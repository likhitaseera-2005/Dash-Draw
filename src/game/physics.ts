/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Point, DrawnStroke, Platform, Obstacle, CollectibleGem, InkPickup, FinishGate, CharacterState } from './types.ts';

export function distSq(p1: Point, p2: Point): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return dx * dx + dy * dy;
}

export function dist(p1: Point, p2: Point): number {
  return Math.sqrt(distSq(p1, p2));
}

export function calculateStrokeLength(points: Point[]): number {
  let len = 0;
  for (let i = 0; i < points.length - 1; i++) {
    len += dist(points[i], points[i + 1]);
  }
  return len;
}

// Distance from point P to segment AB, returns closest point on segment
export function closestPointOnSegment(p: Point, a: Point, b: Point): { point: Point; t: number; distance: number } {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const lenSq = abx * abx + aby * aby;

  if (lenSq === 0) {
    const d = dist(p, a);
    return { point: { x: a.x, y: a.y }, t: 0, distance: d };
  }

  const apx = p.x - a.x;
  const apy = p.y - a.y;
  let t = (apx * abx + apy * aby) / lenSq;
  t = Math.max(0, Math.min(1, t));

  const closestX = a.x + t * abx;
  const closestY = a.y + t * aby;
  const d = Math.sqrt((p.x - closestX) ** 2 + (p.y - closestY) ** 2);

  return {
    point: { x: closestX, y: closestY },
    t,
    distance: d,
  };
}

export interface PhysicsStepResult {
  char: CharacterState;
  collectedGems: string[];
  collectedInks: string[];
  hitHazard: boolean;
  reachedGoal: boolean;
  bounced: boolean;
  boosted: boolean;
}

export function updatePhysics(
  char: CharacterState,
  strokes: DrawnStroke[],
  platforms: Platform[],
  obstacles: Obstacle[],
  gems: CollectibleGem[],
  inkPickups: InkPickup[],
  finishGate: FinishGate,
  worldHeight: number,
  timeElapsed: number
): PhysicsStepResult {
  const result: PhysicsStepResult = {
    char: { ...char },
    collectedGems: [],
    collectedInks: [],
    hitHazard: false,
    reachedGoal: false,
    bounced: false,
    boosted: false,
  };

  if (result.char.isDead || result.char.hasFinished) {
    return result;
  }

  const GRAVITY = 0.52;
  const BASE_RUN_SPEED = 4.2;
  const BOOSTED_RUN_SPEED = 7.0;

  // Handle speed boost countdown
  if (result.char.speedBoostTimer > 0) {
    result.char.speedBoostTimer--;
  }

  const targetSpeed = result.char.speedBoostTimer > 0 ? BOOSTED_RUN_SPEED : BASE_RUN_SPEED;

  // Horizontal acceleration toward target speed
  if (result.char.vx < targetSpeed) {
    result.char.vx = Math.min(targetSpeed, result.char.vx + 0.3);
  } else if (result.char.vx > targetSpeed) {
    result.char.vx = Math.max(targetSpeed, result.char.vx - 0.15);
  }

  // Apply gravity
  result.char.vy = Math.min(14, result.char.vy + GRAVITY);

  // Update dynamic platform positions first
  platforms.forEach((p) => {
    if (p.type === 'moving' && p.speed && p.range) {
      const offset = Math.sin(timeElapsed * p.speed * 0.05) * p.range;
      if (p.axis === 'y' && p.baseY !== undefined) {
        p.y = p.baseY + offset;
      } else if (p.axis === 'x' && p.baseX !== undefined) {
        p.x = p.baseX + offset;
      }
    }
  });

  // Tentative new position
  let newX = result.char.x + result.char.vx;
  let newY = result.char.y + result.char.vy;

  let grounded = false;
  let groundNormal = { x: 0, y: -1 };
  let groundType: CharacterState['groundType'] = null;
  let groundAngle = 0;

  const charRadius = result.char.radius;
  const charFeetY = newY + result.char.height / 2;

  // 1. Check Solid Platform collisions
  for (const plat of platforms) {
    const platLeft = plat.x;
    const platRight = plat.x + plat.width;
    const platTop = plat.y;
    const platBottom = plat.y + plat.height;

    // Check if character's feet are landing on platform top
    const prevFeetY = result.char.y + result.char.height / 2;
    if (
      newX + charRadius > platLeft &&
      newX - charRadius < platRight &&
      prevFeetY <= platTop + 8 &&
      charFeetY >= platTop - 4 &&
      result.char.vy >= 0
    ) {
      // Land on platform
      newY = platTop - result.char.height / 2;
      result.char.vy = 0;
      grounded = true;
      groundType = 'platform';

      // Check platform specials
      if (plat.type === 'spring') {
        result.char.vy = -14.5;
        result.bounced = true;
        result.char.squash = 0.5;
      } else if (plat.type === 'booster') {
        result.char.speedBoostTimer = 90;
        result.boosted = true;
      }

      // If platform is moving horizontally, carry character
      if (plat.type === 'moving' && plat.axis === 'x' && plat.speed && plat.range) {
        const delta = Math.cos(timeElapsed * plat.speed * 0.05) * plat.speed * 0.8;
        newX += delta;
      }
      break;
    }
  }

  // 2. Check Drawn Strokes collision
  const feetPoint = { x: newX, y: charFeetY };

  for (const stroke of strokes) {
    const pts = stroke.points;
    if (pts.length < 2) continue;

    for (let i = 0; i < pts.length - 1; i++) {
      const pA = pts[i];
      const pB = pts[i + 1];

      // AABB quick prune
      const minX = Math.min(pA.x, pB.x) - charRadius;
      const maxX = Math.max(pA.x, pB.x) + charRadius;
      const minY = Math.min(pA.y, pB.y) - charRadius * 2;
      const maxY = Math.max(pA.y, pB.y) + charRadius * 2;

      if (feetPoint.x < minX || feetPoint.x > maxX || feetPoint.y < minY || feetPoint.y > maxY) {
        continue;
      }

      const hit = closestPointOnSegment(feetPoint, pA, pB);
      const collisionThreshold = charRadius;

      if (hit.distance < collisionThreshold) {
        const segDx = pB.x - pA.x;
        const segDy = pB.y - pA.y;
        const segLen = Math.sqrt(segDx * segDx + segDy * segDy);
        if (segLen === 0) continue;

        // Normal pointing upwards (assuming drawing left-to-right mostly)
        let nx = -segDy / segLen;
        let ny = segDx / segLen;
        if (ny > 0) {
          nx = -nx;
          ny = -ny;
        }

        // Tangent vector along line
        const tx = segDx / segLen;
        const ty = segDy / segLen;

        // Only collide if falling or sliding onto the top surface of the line
        const dotVelNorm = result.char.vx * nx + result.char.vy * ny;
        if (dotVelNorm <= 0.5) {
          // Resolve position onto line
          const penetration = collisionThreshold - hit.distance;
          newX += nx * penetration;
          newY += ny * penetration;

          grounded = true;
          groundNormal = { x: nx, y: ny };
          groundType = stroke.type;
          groundAngle = Math.atan2(ty, tx);

          if (stroke.type === 'bounce') {
            result.char.vy = -13.8;
            result.char.vx = Math.max(result.char.vx, 5.0);
            result.bounced = true;
            result.char.squash = 0.5;
            grounded = false;
          } else if (stroke.type === 'speed') {
            result.char.speedBoostTimer = 60;
            result.char.vx = 7.5;
            result.boosted = true;
            // Project velocity along tangent
            result.char.vy = ty * 7.5;
          } else {
            // Solid stroke: project along tangent
            const forwardSpeed = Math.max(targetSpeed, Math.abs(result.char.vx));
            result.char.vx = Math.abs(tx) * forwardSpeed;
            result.char.vy = ty * forwardSpeed;
          }
          break;
        }
      }
    }
    if (grounded) break;
  }

  // 3. Check Obstacles & Hazards
  for (const obs of obstacles) {
    if (obs.type === 'spike') {
      // Spike bounding box with triangle tip leniency
      if (
        newX + charRadius > obs.x + 4 &&
        newX - charRadius < obs.x + obs.width - 4 &&
        charFeetY > obs.y + 6 &&
        newY - result.char.height / 2 < obs.y + obs.height
      ) {
        result.hitHazard = true;
        result.char.isDead = true;
        break;
      }
    } else if (obs.type === 'sawblade') {
      const bladeCenter = {
        x: obs.x + obs.width / 2 + Math.sin(timeElapsed * (obs.speed || 2) * 0.05) * (obs.range || 0),
        y: obs.y + obs.height / 2,
      };
      const d = dist({ x: newX, y: newY }, bladeCenter);
      if (d < charRadius + obs.width * 0.45) {
        result.hitHazard = true;
        result.char.isDead = true;
        break;
      }
    } else if (obs.type === 'laser') {
      // Laser beam periodically blinks
      const laserActive = Math.sin(timeElapsed * (obs.speed || 2) * 0.04 + (obs.phase || 0)) > -0.3;
      obs.active = laserActive;
      if (
        laserActive &&
        newX + charRadius > obs.x &&
        newX - charRadius < obs.x + obs.width &&
        newY + result.char.height / 2 > obs.y &&
        newY - result.char.height / 2 < obs.y + obs.height
      ) {
        result.hitHazard = true;
        result.char.isDead = true;
        break;
      }
    } else if (obs.type === 'pit') {
      if (
        newX + charRadius > obs.x &&
        newX - charRadius < obs.x + obs.width &&
        charFeetY > obs.y
      ) {
        result.hitHazard = true;
        result.char.isDead = true;
        break;
      }
    }
  }

  // 4. Fell off bottom of world
  if (newY > worldHeight + 60) {
    result.hitHazard = true;
    result.char.isDead = true;
  }

  // 5. Gem collection
  for (const gem of gems) {
    if (!gem.collected) {
      const d = dist({ x: newX, y: newY }, { x: gem.x, y: gem.y });
      if (d < charRadius + 22) {
        gem.collected = true;
        result.collectedGems.push(gem.id);
      }
    }
  }

  // 6. Ink pickups
  for (const ink of inkPickups) {
    if (!ink.collected) {
      const d = dist({ x: newX, y: newY }, { x: ink.x, y: ink.y });
      if (d < charRadius + 20) {
        ink.collected = true;
        result.collectedInks.push(ink.id);
      }
    }
  }

  // 7. Finish Gate
  if (
    newX + charRadius > finishGate.x &&
    newX - charRadius < finishGate.x + finishGate.width &&
    newY + result.char.height / 2 > finishGate.y &&
    newY - result.char.height / 2 < finishGate.y + finishGate.height
  ) {
    result.reachedGoal = true;
    result.char.hasFinished = true;
  }

  // Animation cycle updates
  if (grounded) {
    result.char.runCycle += result.char.vx * 0.15;
    result.char.isAirborne = false;
    result.char.dustTimer++;
  } else {
    result.char.isAirborne = true;
    result.char.dustTimer = 0;
  }

  // Squash & stretch recovery
  if (result.char.squash < 1) {
    result.char.squash = Math.min(1, result.char.squash + 0.05);
  } else if (result.char.squash > 1) {
    result.char.squash = Math.max(1, result.char.squash - 0.05);
  }

  result.char.x = newX;
  result.char.y = newY;
  result.char.onGround = grounded;
  result.char.groundNormal = groundNormal;
  result.char.groundType = groundType;
  result.char.groundAngle = groundAngle;

  return result;
}
