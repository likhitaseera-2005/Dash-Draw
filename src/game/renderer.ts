/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LevelConfig, DrawnStroke, CharacterState, Point, StrokeType } from './types.ts';
import { ParticleSystem } from './particles.ts';

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public render(
    level: LevelConfig,
    char: CharacterState,
    strokes: DrawnStroke[],
    currentStroke: Point[] | null,
    currentStrokeType: StrokeType,
    particles: ParticleSystem,
    camX: number,
    camY: number,
    viewportWidth: number,
    viewportHeight: number,
    time: number
  ) {
    const ctx = this.ctx;

    // Clear viewport
    ctx.clearRect(0, 0, viewportWidth, viewportHeight);

    // 1. Draw Parallax Background
    this.drawParallaxBackground(level.theme, camX, camY, viewportWidth, viewportHeight, time);

    // 2. Save canvas state for World Coordinates
    ctx.save();
    ctx.translate(-camX, -camY);

    // Draw Tutorial Hints floating in world if present
    if (level.tutorialHint && camX < 500) {
      this.drawTutorialWorldBanner(level.tutorialHint, level.spawnPoint.x, level.spawnPoint.y - 100);
    }

    // 3. Draw Platforms
    this.drawPlatforms(level, time);

    // 4. Draw Obstacles & Hazards
    this.drawObstacles(level, time);

    // 5. Draw Collectibles (Gems & Ink)
    this.drawCollectibles(level, time);

    // 6. Draw Finish Gate
    this.drawFinishGate(level.finishGate, time);

    // 7. Draw Completed Strokes
    this.drawStrokes(strokes, time);

    // 8. Draw Active / Drawing Stroke Preview
    if (currentStroke && currentStroke.length > 1) {
      this.drawActiveStroke(currentStroke, currentStrokeType, time);
    }

    // 9. Draw Particles (dust, sparks, confetti)
    this.drawParticles(particles);

    // 10. Draw Character
    this.drawCharacter(char, time);

    // Restore canvas
    ctx.restore();
  }

  // --- Parallax Backgrounds ---
  private drawParallaxBackground(
    theme: LevelConfig['theme'],
    camX: number,
    _camY: number,
    width: number,
    height: number,
    time: number
  ) {
    const ctx = this.ctx;

    let skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    let mountainColor = '#94a3b8';
    let hillColor = '#64748b';

    if (theme === 'meadow') {
      skyGrad.addColorStop(0, '#bae6fd');
      skyGrad.addColorStop(0.6, '#e0f2fe');
      skyGrad.addColorStop(1, '#f0fdf4');
      mountainColor = '#93c5fd';
      hillColor = '#86efac';
    } else if (theme === 'canyon') {
      skyGrad.addColorStop(0, '#fed7aa');
      skyGrad.addColorStop(0.5, '#ffedd5');
      skyGrad.addColorStop(1, '#fecdd3');
      mountainColor = '#f97316';
      hillColor = '#ea580c';
    } else if (theme === 'ruins') {
      skyGrad.addColorStop(0, '#c4b5fd');
      skyGrad.addColorStop(0.6, '#ddd6fe');
      skyGrad.addColorStop(1, '#f5d0fe');
      mountainColor = '#7c3aed';
      hillColor = '#6d28d9';
    } else if (theme === 'crystal') {
      skyGrad.addColorStop(0, '#1e1b4b');
      skyGrad.addColorStop(0.6, '#312e81');
      skyGrad.addColorStop(1, '#4c1d95');
      mountainColor = '#4338ca';
      hillColor = '#6366f1';
    } else if (theme === 'cyber') {
      skyGrad.addColorStop(0, '#0f172a');
      skyGrad.addColorStop(0.5, '#3b0764');
      skyGrad.addColorStop(1, '#831843');
      mountainColor = '#be185d';
      hillColor = '#e11d48';
    } else {
      skyGrad.addColorStop(0, '#e0e7ff');
      skyGrad.addColorStop(1, '#f8fafc');
      mountainColor = '#818cf8';
      hillColor = '#6366f1';
    }

    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Sun / Moon / Glow Orb
    const sunX = width * 0.75 - ((camX * 0.03) % width);
    const sunY = 110;
    const sunGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 70);
    sunGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    sunGrad.addColorStop(0.4, 'rgba(254, 240, 138, 0.5)');
    sunGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 70, 0, Math.PI * 2);
    ctx.fill();

    // Distant Layer 1 (Mountains) - parallax speed 0.1
    ctx.fillStyle = mountainColor;
    ctx.globalAlpha = 0.28;
    ctx.beginPath();
    ctx.moveTo(0, height);
    const mountStep = 180;
    const mountOffset = -(camX * 0.1) % mountStep;
    for (let x = -mountStep; x <= width + mountStep; x += mountStep) {
      const peakX = x + mountOffset;
      const peakY = height * 0.55 + Math.sin(x * 0.01) * 70;
      ctx.lineTo(peakX, peakY);
      ctx.lineTo(peakX + mountStep / 2, height * 0.75);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // Midground Layer 2 (Rolling Hills & Clouds) - parallax speed 0.25
    ctx.fillStyle = hillColor;
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.moveTo(0, height);
    const hillStep = 240;
    const hillOffset = -(camX * 0.25) % hillStep;
    for (let x = -hillStep; x <= width + hillStep; x += hillStep) {
      const hx = x + hillOffset;
      const hy = height * 0.7 + Math.sin(x * 0.02) * 50;
      ctx.quadraticCurveTo(hx + hillStep / 4, hy - 40, hx + hillStep / 2, hy);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // Floating Clouds
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.55;
    for (let i = 0; i < 4; i++) {
      const cloudSpeed = 0.15 + i * 0.05;
      const cx = ((time * 12 + i * 400 - camX * cloudSpeed) % (width + 300)) - 100;
      const cy = 60 + i * 45;
      this.drawCloud(ctx, cx, cy, 50 + i * 15);
    }

    ctx.globalAlpha = 1.0;
  }

  private drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    ctx.beginPath();
    ctx.arc(x, y, size * 0.4, 0, Math.PI * 2);
    ctx.arc(x + size * 0.35, y - size * 0.15, size * 0.45, 0, Math.PI * 2);
    ctx.arc(x + size * 0.7, y, size * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawTutorialWorldBanner(text: string, x: number, y: number) {
    const ctx = this.ctx;
    ctx.save();
    ctx.font = '600 13px system-ui, sans-serif';
    const textWidth = ctx.measureText(text).width;
    const boxW = textWidth + 32;
    const boxH = 34;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x - 20, y, boxW, boxH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, x - 4, y + 22);
    ctx.restore();
  }

  // --- Platforms ---
  private drawPlatforms(level: LevelConfig, time: number) {
    const ctx = this.ctx;

    level.platforms.forEach((p) => {
      ctx.save();

      if (p.type === 'spring') {
        // Base pillar
        ctx.fillStyle = '#334155';
        ctx.fillRect(p.x, p.y + 12, p.width, p.height - 12);

        // Bouncy spring top cap
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.roundRect(p.x, p.y, p.width, 16, 6);
        ctx.fill();

        // Spring coil visual
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 4;
        ctx.beginPath();
        const coilCount = 4;
        const step = p.width / coilCount;
        for (let i = 0; i < coilCount; i++) {
          const cx = p.x + i * step + step / 2;
          ctx.ellipse(cx, p.y + 8, step * 0.35, 5, 0, 0, Math.PI * 2);
        }
        ctx.stroke();

        // Little up arrow icon
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(p.x + p.width / 2, p.y + 3);
        ctx.lineTo(p.x + p.width / 2 - 8, p.y + 12);
        ctx.lineTo(p.x + p.width / 2 + 8, p.y + 12);
        ctx.closePath();
        ctx.fill();
      } else if (p.type === 'booster') {
        // Speed booster platform
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(p.x, p.y, p.width, p.height);

        // Neon animated arrows
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 3;
        const offset = (time * 60) % 24;
        for (let x = p.x + 10; x < p.x + p.width - 15; x += 28) {
          const ax = x + offset;
          if (ax < p.x + p.width - 10) {
            ctx.beginPath();
            ctx.moveTo(ax, p.y + 5);
            ctx.lineTo(ax + 8, p.y + 13);
            ctx.lineTo(ax, p.y + 21);
            ctx.stroke();
          }
        }
      } else if (p.type === 'moving') {
        // High-tech floating platform
        const grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.height);
        grad.addColorStop(0, '#38bdf8');
        grad.addColorStop(1, '#0284c7');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(p.x, p.y, p.width, p.height, 8);
        ctx.fill();

        // Glow engine thrusters underneath
        ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.beginPath();
        ctx.arc(p.x + 25, p.y + p.height + 4, 8 + Math.sin(time * 10) * 2, 0, Math.PI);
        ctx.arc(p.x + p.width - 25, p.y + p.height + 4, 8 + Math.sin(time * 10) * 2, 0, Math.PI);
        ctx.fill();
      } else {
        // Standard Solid Terrain Block
        let topColor = '#22c55e';
        let bodyColor = '#78350f';
        let rockDetail = '#92400e';

        if (level.theme === 'canyon') {
          topColor = '#f97316';
          bodyColor = '#9a3412';
          rockDetail = '#c2410c';
        } else if (level.theme === 'ruins') {
          topColor = '#a855f7';
          bodyColor = '#4c1d95';
          rockDetail = '#581c87';
        } else if (level.theme === 'crystal') {
          topColor = '#06b6d4';
          bodyColor = '#164e63';
          rockDetail = '#0891b2';
        } else if (level.theme === 'cyber') {
          topColor = '#ec4899';
          bodyColor = '#18181b';
          rockDetail = '#27272a';
        }

        // Platform Body
        ctx.fillStyle = bodyColor;
        ctx.fillRect(p.x, p.y + 14, p.width, p.height - 14);

        // Platform Top Trim
        ctx.fillStyle = topColor;
        ctx.beginPath();
        ctx.roundRect(p.x, p.y, p.width, 16, [6, 6, 0, 0]);
        ctx.fill();

        // Stylized drip grass / stone teeth
        ctx.fillStyle = topColor;
        for (let x = p.x + 8; x < p.x + p.width - 8; x += 18) {
          const h = 5 + (x % 7);
          ctx.fillRect(x, p.y + 14, 8, h);
        }

        // Inner rock details
        ctx.fillStyle = rockDetail;
        ctx.globalAlpha = 0.4;
        for (let x = p.x + 16; x < p.x + p.width - 20; x += 36) {
          ctx.beginPath();
          ctx.arc(x, p.y + 35 + (x % 15), 6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1.0;
      }

      ctx.restore();
    });
  }

  // --- Obstacles ---
  private drawObstacles(level: LevelConfig, time: number) {
    const ctx = this.ctx;

    level.obstacles.forEach((obs) => {
      ctx.save();

      if (obs.type === 'spike') {
        const spikeW = 20;
        const count = Math.floor(obs.width / spikeW);
        const actualW = obs.width / count;

        for (let i = 0; i < count; i++) {
          const sx = obs.x + i * actualW;
          const sy = obs.y + obs.height;

          // Spike gradient
          const grad = ctx.createLinearGradient(sx, sy, sx, obs.y);
          grad.addColorStop(0, '#64748b');
          grad.addColorStop(0.7, '#ef4444');
          grad.addColorStop(1, '#ffffff');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + actualW / 2, obs.y);
          ctx.lineTo(sx + actualW, sy);
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle = '#b91c1c';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      } else if (obs.type === 'sawblade') {
        const bladeX = obs.x + obs.width / 2 + Math.sin(time * (obs.speed || 2) * 0.05) * (obs.range || 0);
        const bladeY = obs.y + obs.height / 2;
        const radius = obs.width / 2;

        ctx.translate(bladeX, bladeY);
        ctx.rotate(time * 8);

        // Blade teeth
        ctx.fillStyle = '#dc2626';
        ctx.strokeStyle = '#fca5a5';
        ctx.lineWidth = 2;
        const teeth = 8;
        ctx.beginPath();
        for (let i = 0; i < teeth; i++) {
          const angle = (i / teeth) * Math.PI * 2;
          const nextAngle = ((i + 1) / teeth) * Math.PI * 2;
          ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
          ctx.lineTo(Math.cos(angle + 0.2) * (radius * 1.25), Math.sin(angle + 0.2) * (radius * 1.25));
          ctx.lineTo(Math.cos(nextAngle) * radius, Math.sin(nextAngle) * radius);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Hub
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.35, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.15, 0, Math.PI * 2);
        ctx.fill();
      } else if (obs.type === 'laser') {
        const active = obs.active !== false;

        // Top & bottom emitters
        ctx.fillStyle = '#334155';
        ctx.fillRect(obs.x - 4, obs.y, obs.width + 8, 12);
        ctx.fillRect(obs.x - 4, obs.y + obs.height - 12, obs.width + 8, 12);

        if (active) {
          // Beam
          ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
          ctx.fillRect(obs.x, obs.y + 12, obs.width, obs.height - 24);

          ctx.fillStyle = '#ef4444';
          ctx.fillRect(obs.x + obs.width / 2 - 3, obs.y + 12, 6, obs.height - 24);

          ctx.fillStyle = '#ffffff';
          ctx.fillRect(obs.x + obs.width / 2 - 1, obs.y + 12, 2, obs.height - 24);
        }
      }

      ctx.restore();
    });
  }

  // --- Collectibles ---
  private drawCollectibles(level: LevelConfig, time: number) {
    const ctx = this.ctx;

    // Gems
    level.gems.forEach((gem) => {
      if (gem.collected) return;
      ctx.save();

      const hoverY = gem.y + Math.sin(time * 4 + gem.x * 0.1) * 6;
      ctx.translate(gem.x, hoverY);

      // Glowing aura
      const auraGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 24);
      auraGrad.addColorStop(0, 'rgba(250, 204, 21, 0.7)');
      auraGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.fill();

      // Diamond facet shape
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.lineTo(12, -4);
      ctx.lineTo(10, 10);
      ctx.lineTo(0, 15);
      ctx.lineTo(-10, 10);
      ctx.lineTo(-12, -4);
      ctx.closePath();
      ctx.fill();

      // Bright inner facets
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.lineTo(0, 15);
      ctx.lineTo(10, 10);
      ctx.lineTo(12, -4);
      ctx.closePath();
      ctx.fill();

      // Top light reflection
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-3, -6, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });

    // Ink Flasks
    if (level.inkPickups) {
      level.inkPickups.forEach((ink) => {
        if (ink.collected) return;
        ctx.save();
        const hoverY = ink.y + Math.sin(time * 3 + ink.x * 0.05) * 5;
        ctx.translate(ink.x, hoverY);

        // Flask bottle
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(0, 4, 11, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(-4, -10, 8, 8);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-5, -12, 10, 3);

        // Glow ring
        ctx.strokeStyle = '#7dd3fc';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.restore();
      });
    }
  }

  // --- Finish Gate ---
  private drawFinishGate(gate: LevelConfig['finishGate'], time: number) {
    const ctx = this.ctx;
    ctx.save();

    // Archway Pillars
    ctx.fillStyle = '#475569';
    ctx.fillRect(gate.x, gate.y, 8, gate.height);
    ctx.fillRect(gate.x + gate.width - 8, gate.y, 8, gate.height);

    // Arch beam
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(gate.x, gate.y, gate.width, 14);

    // Chequered Flag waving
    const flagW = gate.width - 16;
    const flagH = 26;
    const flagX = gate.x + 8;
    const flagY = gate.y + 16;

    const cols = 6;
    const rows = 3;
    const cellW = flagW / cols;
    const cellH = flagH / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const wave = Math.sin(time * 5 + c * 0.6) * 3;
        ctx.fillStyle = (r + c) % 2 === 0 ? '#ffffff' : '#0f172a';
        ctx.fillRect(flagX + c * cellW, flagY + r * cellH + wave, cellW, cellH);
      }
    }

    // "GOAL" text banner on top
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FINISH', gate.x + gate.width / 2, gate.y + 11);

    // Rotating celebration star over arch
    ctx.save();
    ctx.translate(gate.x + gate.width / 2, gate.y - 12);
    ctx.rotate(time * 2);
    ctx.fillStyle = '#facc15';
    this.drawStarShape(ctx, 0, 0, 5, 12, 6);
    ctx.restore();

    ctx.restore();
  }

  private drawStarShape(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    spikes: number,
    outerR: number,
    innerR: number
  ) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerR);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerR;
      y = cy + Math.sin(rot) * outerR;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerR;
      y = cy + Math.sin(rot) * innerR;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerR);
    ctx.closePath();
    ctx.fill();
  }

  // --- Drawn Strokes ---
  private drawStrokes(strokes: DrawnStroke[], time: number) {
    const ctx = this.ctx;

    strokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;
      ctx.save();

      let mainColor = '#10b981';
      let glowColor = 'rgba(16, 185, 129, 0.4)';
      let lineWidth = 9;

      if (stroke.type === 'bounce') {
        mainColor = '#f59e0b';
        glowColor = 'rgba(245, 158, 11, 0.45)';
        lineWidth = 10;
      } else if (stroke.type === 'speed') {
        mainColor = '#06b6d4';
        glowColor = 'rgba(6, 182, 212, 0.45)';
        lineWidth = 9;
      }

      // Outer glow line
      ctx.strokeStyle = glowColor;
      ctx.lineWidth = lineWidth + 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();

      // Main core line
      ctx.strokeStyle = mainColor;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();

      // Inner shiny highlight stripe
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y - 2);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y - 2);
      }
      ctx.stroke();

      // Bounce Trampoline cross stitches or Speed chevrons
      if (stroke.type === 'bounce') {
        ctx.fillStyle = '#fef08a';
        for (let i = 0; i < stroke.points.length - 1; i += 2) {
          const pt = stroke.points[i];
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (stroke.type === 'speed') {
        ctx.fillStyle = '#ffffff';
        const pulse = (time * 8) % 10;
        for (let i = 0; i < stroke.points.length; i += 3) {
          const pt = stroke.points[i];
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2 + Math.sin(pulse + i) * 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    });
  }

  private drawActiveStroke(pts: Point[], type: StrokeType, _time: number) {
    const ctx = this.ctx;
    ctx.save();

    let strokeColor = '#22c55e';
    if (type === 'bounce') strokeColor = '#fbbf24';
    if (type === 'speed') strokeColor = '#22d3ee';

    // Glow under active drawing
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.stroke();

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.stroke();

    // Brush Tip indicator
    const lastPt = pts[pts.length - 1];
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(lastPt.x, lastPt.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }

  // --- Particles ---
  private drawParticles(particles: ParticleSystem) {
    const ctx = this.ctx;

    particles.particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;

      if (p.shape === 'confetti') {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation || 0);
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else if (p.shape === 'star') {
        this.drawStarShape(ctx, p.x, p.y, 5, p.size, p.size * 0.45);
      } else if (p.shape === 'spark') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Circle / dust
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });
  }

  // --- Character: Dashy ---
  private drawCharacter(char: CharacterState, time: number) {
    const ctx = this.ctx;
    ctx.save();

    ctx.translate(char.x, char.y);

    // Apply ground slope rotation if running on slopes
    if (char.onGround && Math.abs(char.groundAngle) > 0.05) {
      ctx.rotate(char.groundAngle * 0.6);
    }

    // Squash & Stretch scale
    ctx.scale(1 / char.squash, char.squash);

    // Ground Shadow
    if (char.onGround) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
      ctx.beginPath();
      ctx.ellipse(0, char.height / 2 + 1, char.radius * 0.9, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Red Cape fluttering behind
    ctx.save();
    const capeCycle = time * 12;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(-6, -4);
    const capeLen = 22;
    const wave1 = Math.sin(capeCycle) * 6;
    const wave2 = Math.cos(capeCycle * 1.3) * 8;
    ctx.quadraticCurveTo(-capeLen * 0.6, -2 + wave1, -capeLen, 2 + wave2);
    ctx.lineTo(-capeLen + 2, 8 + wave2);
    ctx.quadraticCurveTo(-capeLen * 0.5, 6 + wave1, -4, 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Running Legs (swining back and forth)
    ctx.save();
    const legPhase = char.onGround ? char.runCycle : 0;
    const leftLegRot = char.isAirborne ? 0.4 : Math.sin(legPhase) * 0.7;
    const rightLegRot = char.isAirborne ? -0.3 : Math.sin(legPhase + Math.PI) * 0.7;

    // Left leg
    ctx.save();
    ctx.translate(-4, 4);
    ctx.rotate(leftLegRot);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-2, 0, 4, 12);
    // Red sneaker
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.roundRect(-2, 10, 8, 5, 2);
    ctx.fill();
    ctx.restore();

    // Right leg
    ctx.save();
    ctx.translate(4, 4);
    ctx.rotate(rightLegRot);
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(-2, 0, 4, 12);
    // Red sneaker
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.roundRect(-2, 10, 8, 5, 2);
    ctx.fill();
    ctx.restore();
    ctx.restore();

    // Body Torso
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.roundRect(-8, -10, 16, 16, 6);
    ctx.fill();

    // Orange Chest Accent / Star
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(0, -2, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(0, -18, 11, 0, Math.PI * 2);
    ctx.fill();

    // Hair / Tuft
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(0, -23, 10, Math.PI, 0);
    ctx.arc(4, -25, 4, 0, Math.PI * 2);
    ctx.fill();

    // Athletic Headband
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-10, -22, 20, 4.5);

    // Eyes
    if (char.isDead) {
      // Dizzy 'X' eyes on death
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      // Eye 1
      ctx.beginPath();
      ctx.moveTo(-1, -19);
      ctx.lineTo(4, -15);
      ctx.moveTo(4, -19);
      ctx.lineTo(-1, -15);
      // Eye 2
      ctx.moveTo(5, -19);
      ctx.lineTo(9, -15);
      ctx.moveTo(9, -19);
      ctx.lineTo(5, -15);
      ctx.stroke();
    } else if (char.hasFinished) {
      // Joyous arched eyes
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(3, -16, 3, Math.PI, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(8, -16, 3, Math.PI, 0);
      ctx.stroke();
    } else {
      // Determined forward-looking cartoon eyes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(3, -17, 3.5, 4.5, 0, 0, Math.PI * 2);
      ctx.ellipse(8, -17, 3.5, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pupils
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(4.5, -17, 2, 0, Math.PI * 2);
      ctx.arc(9.5, -17, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cheerful Smile
    ctx.strokeStyle = '#7c2d12';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (char.hasFinished) {
      ctx.arc(5, -12, 4, 0, Math.PI);
    } else if (char.isDead) {
      ctx.arc(5, -10, 4, Math.PI, 0);
    } else {
      ctx.arc(5, -12, 3, 0, Math.PI);
    }
    ctx.stroke();

    // Arms
    ctx.fillStyle = '#fed7aa';
    if (char.hasFinished) {
      // Victory arms raised
      ctx.fillRect(-10, -22, 4, 14);
      ctx.fillRect(6, -22, 4, 14);
    } else {
      // Pumping running arm
      ctx.save();
      ctx.translate(2, -6);
      ctx.rotate(char.onGround ? -Math.sin(legPhase) * 0.8 : -0.5);
      ctx.fillRect(-2, 0, 4, 10);
      // Glove
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(0, 10, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }
}
