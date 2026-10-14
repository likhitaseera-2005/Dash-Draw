/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LevelConfig } from './types.ts';

export const LEVELS: LevelConfig[] = [
  // LEVEL 1: Beginner Run
  {
    id: 1,
    name: 'Level 1: Beginner Run',
    subtitle: 'Meadow Sprint',
    description: 'Learn the basics: Draw sturdy bridges across gaps and sketch ramps to climb higher ledges.',
    worldWidth: 2000,
    worldHeight: 700,
    spawnPoint: { x: 80, y: 380 },
    finishGate: { x: 1820, y: 270, width: 60, height: 90 },
    maxInk: 650,
    targetTimeSeconds: 15,
    theme: 'meadow',
    tutorialHint: '✏️ Drag with mouse or finger to draw a bridge over the gap! Press Dash or Spacebar to run.',
    platforms: [
      // Starting strip
      { id: 'p1_start', x: 0, y: 440, width: 360, height: 260, type: 'solid' },
      // Gap between 360 and 580 -> needs bridge!
      // Middle island
      { id: 'p1_mid', x: 580, y: 440, width: 450, height: 260, type: 'solid' },
      // Step up ledge
      { id: 'p1_step', x: 1200, y: 360, width: 350, height: 340, type: 'solid' },
      // Final platform
      { id: 'p1_final', x: 1700, y: 360, width: 300, height: 340, type: 'solid' },
    ],
    obstacles: [
      // Safe tutorial pit at bottom
      { id: 'o1_pit', type: 'pit', x: 360, y: 680, width: 220, height: 30 },
      { id: 'o1_pit2', type: 'pit', x: 1030, y: 680, width: 170, height: 30 },
      { id: 'o1_pit3', type: 'pit', x: 1550, y: 680, width: 150, height: 30 },
    ],
    gems: [
      { id: 'g1_1', x: 470, y: 390, collected: false, value: 100 }, // Over gap 1
      { id: 'g1_2', x: 800, y: 370, collected: false, value: 100 }, // On middle island
      { id: 'g1_3', x: 1110, y: 310, collected: false, value: 100 }, // Over gap 2
      { id: 'g1_4', x: 1400, y: 290, collected: false, value: 100 }, // On high ledge
    ],
    inkPickups: [
      { id: 'ink1_1', x: 700, y: 380, amount: 80, collected: false },
    ],
  },

  // LEVEL 2: Bridge Challenge
  {
    id: 2,
    name: 'Level 2: Bridge Challenge',
    subtitle: 'Canyon Crossing',
    description: 'Brave wide canyons and high floating islands. Draw long, stable bridges and angled ramps.',
    worldWidth: 2600,
    worldHeight: 750,
    spawnPoint: { x: 80, y: 400 },
    finishGate: { x: 2420, y: 300, width: 60, height: 90 },
    maxInk: 850,
    targetTimeSeconds: 22,
    theme: 'canyon',
    tutorialHint: '💡 Tip: Draw smooth downward slopes to build up speed, or slight upward curves to catch momentum.',
    platforms: [
      { id: 'p2_start', x: 0, y: 460, width: 320, height: 290, type: 'solid' },
      // Floating rock 1
      { id: 'p2_rock1', x: 650, y: 460, width: 240, height: 180, type: 'solid' },
      // High floating rock 2
      { id: 'p2_rock2', x: 1180, y: 380, width: 280, height: 180, type: 'solid' },
      // Moving platform in canyon!
      { id: 'p2_move1', x: 1650, y: 440, width: 180, height: 40, type: 'moving', axis: 'y', range: 90, speed: 1.8, baseX: 1650, baseY: 440 },
      // Final cliff
      { id: 'p2_end', x: 2150, y: 390, width: 450, height: 360, type: 'solid' },
    ],
    obstacles: [
      { id: 'o2_pit1', type: 'pit', x: 320, y: 730, width: 330, height: 30 },
      { id: 'o2_pit2', type: 'pit', x: 890, y: 730, width: 290, height: 30 },
      { id: 'o2_pit3', type: 'pit', x: 1460, y: 730, width: 690, height: 30 },
    ],
    gems: [
      { id: 'g2_1', x: 485, y: 400, collected: false, value: 100 },
      { id: 'g2_2', x: 770, y: 390, collected: false, value: 100 },
      { id: 'g2_3', x: 1030, y: 320, collected: false, value: 100 },
      { id: 'g2_4', x: 1740, y: 340, collected: false, value: 100 },
      { id: 'g2_5', x: 1980, y: 330, collected: false, value: 100 },
    ],
    inkPickups: [
      { id: 'ink2_1', x: 770, y: 410, amount: 120, collected: false },
      { id: 'ink2_2', x: 1320, y: 330, amount: 120, collected: false },
    ],
  },

  // LEVEL 3: Spike Escape
  {
    id: 3,
    name: 'Level 3: Spike Escape',
    subtitle: 'Ruins of Thorns',
    description: 'Spikes line the ground and rocky ceilings. Sketch ramps to leap over hazards and shield against traps.',
    worldWidth: 2800,
    worldHeight: 750,
    spawnPoint: { x: 80, y: 400 },
    finishGate: { x: 2620, y: 330, width: 60, height: 90 },
    maxInk: 900,
    targetTimeSeconds: 25,
    theme: 'ruins',
    tutorialHint: '⚠️ Watch the spikes! Draw an arched bridge high above the spikes to glide right past them.',
    platforms: [
      { id: 'p3_start', x: 0, y: 460, width: 300, height: 290, type: 'solid' },
      // Safe mid pillar 1
      { id: 'p3_pillar1', x: 720, y: 440, width: 140, height: 310, type: 'solid' },
      // Safe mid pillar 2 with spring!
      { id: 'p3_pillar2', x: 1280, y: 410, width: 140, height: 340, type: 'spring' },
      // High ruined arch
      { id: 'p3_arch', x: 1750, y: 350, width: 320, height: 80, type: 'solid' },
      // End platform
      { id: 'p3_end', x: 2400, y: 420, width: 400, height: 330, type: 'solid' },
    ],
    obstacles: [
      // Spike bed 1
      { id: 'o3_spike1', type: 'spike', x: 300, y: 450, width: 420, height: 40 },
      // Spike bed 2
      { id: 'o3_spike2', type: 'spike', x: 860, y: 450, width: 420, height: 40 },
      // Spike bed 3 under arch
      { id: 'o3_spike3', type: 'spike', x: 1420, y: 450, width: 330, height: 40 },
      // Giant spike field before goal
      { id: 'o3_spike4', type: 'spike', x: 2070, y: 450, width: 330, height: 40 },
    ],
    gems: [
      { id: 'g3_1', x: 510, y: 360, collected: false, value: 100 },
      { id: 'g3_2', x: 1070, y: 340, collected: false, value: 100 },
      { id: 'g3_3', x: 1350, y: 260, collected: false, value: 100 },
      { id: 'g3_4', x: 1910, y: 280, collected: false, value: 100 },
      { id: 'g3_5', x: 2235, y: 340, collected: false, value: 100 },
    ],
    inkPickups: [
      { id: 'ink3_1', x: 790, y: 390, amount: 140, collected: false },
      { id: 'ink3_2', x: 1850, y: 300, amount: 140, collected: false },
    ],
  },

  // LEVEL 4: Gem Rush
  {
    id: 4,
    name: 'Level 4: Gem Rush',
    subtitle: 'Crystal Caverns',
    description: 'High vertical chambers packed with glittering crystals. Use bounce lines and speed ramps to reach secret peaks.',
    worldWidth: 3200,
    worldHeight: 800,
    spawnPoint: { x: 80, y: 440 },
    finishGate: { x: 3020, y: 350, width: 60, height: 90 },
    maxInk: 1000,
    targetTimeSeconds: 28,
    theme: 'crystal',
    tutorialHint: '💎 Switch pencil modes! Bouncy lines fling you sky-high, while Speed lines rocket you forward.',
    platforms: [
      { id: 'p4_start', x: 0, y: 520, width: 320, height: 280, type: 'solid' },
      // High crystal ledge
      { id: 'p4_ledge1', x: 620, y: 320, width: 280, height: 60, type: 'solid' },
      // Lower crystal floor
      { id: 'p4_floor1', x: 1000, y: 540, width: 340, height: 260, type: 'booster' },
      // Sky crystal
      { id: 'p4_sky', x: 1540, y: 260, width: 260, height: 60, type: 'solid' },
      // Moving crystal elevator
      { id: 'p4_elev', x: 2000, y: 460, width: 160, height: 40, type: 'moving', axis: 'y', range: 140, speed: 2.2, baseX: 2000, baseY: 460 },
      // Pre-goal ledge
      { id: 'p4_ledge2', x: 2360, y: 380, width: 260, height: 60, type: 'solid' },
      // Finish cliff
      { id: 'p4_end', x: 2840, y: 440, width: 360, height: 360, type: 'solid' },
    ],
    obstacles: [
      { id: 'o4_saw1', type: 'sawblade', x: 450, y: 460, width: 50, height: 50, speed: 2.5, range: 80, phase: 0 },
      { id: 'o4_pit1', type: 'pit', x: 320, y: 780, width: 680, height: 30 },
      { id: 'o4_spikes', type: 'spike', x: 1340, y: 560, width: 200, height: 40 },
      { id: 'o4_pit2', type: 'pit', x: 1540, y: 780, width: 820, height: 30 },
      { id: 'o4_pit3', type: 'pit', x: 2620, y: 780, width: 220, height: 30 },
    ],
    gems: [
      { id: 'g4_1', x: 480, y: 380, collected: false, value: 100 },
      { id: 'g4_2', x: 760, y: 260, collected: false, value: 150 }, // High secret gem!
      { id: 'g4_3', x: 1170, y: 470, collected: false, value: 100 },
      { id: 'g4_4', x: 1670, y: 200, collected: false, value: 200 }, // Supreme sky gem!
      { id: 'g4_5', x: 2180, y: 350, collected: false, value: 100 },
      { id: 'g4_6', x: 2730, y: 380, collected: false, value: 100 },
    ],
    inkPickups: [
      { id: 'ink4_1', x: 800, y: 340, amount: 150, collected: false },
      { id: 'ink4_2', x: 1700, y: 280, amount: 150, collected: false },
    ],
  },

  // LEVEL 5: Ultimate Dash
  {
    id: 5,
    name: 'Level 5: Ultimate Dash',
    subtitle: 'Cyber Volcano',
    description: 'The master challenge. Oscillating laser beams, moving platforms, and high-speed jumps above molten lava.',
    worldWidth: 3600,
    worldHeight: 850,
    spawnPoint: { x: 80, y: 460 },
    finishGate: { x: 3420, y: 390, width: 60, height: 90 },
    maxInk: 1100,
    targetTimeSeconds: 32,
    theme: 'cyber',
    tutorialHint: '🔥 Master all skills! Plan your trajectory carefully in Draw Mode before initiating the run.',
    platforms: [
      { id: 'p5_start', x: 0, y: 540, width: 340, height: 310, type: 'solid' },
      // Speed booster strip
      { id: 'p5_boost1', x: 600, y: 520, width: 220, height: 50, type: 'booster' },
      // Moving platform 1 (horizontal)
      { id: 'p5_move1', x: 1100, y: 480, width: 170, height: 35, type: 'moving', axis: 'x', range: 140, speed: 2.8, baseX: 1100, baseY: 480 },
      // High tech spring tower
      { id: 'p5_spring', x: 1560, y: 440, width: 140, height: 410, type: 'spring' },
      // Moving platform 2 (vertical)
      { id: 'p5_move2', x: 1980, y: 380, width: 170, height: 35, type: 'moving', axis: 'y', range: 130, speed: 2.4, baseX: 1980, baseY: 380 },
      // Floating fortress
      { id: 'p5_fortress', x: 2420, y: 320, width: 320, height: 70, type: 'solid' },
      // Descent ramp island
      { id: 'p5_island', x: 2950, y: 460, width: 200, height: 390, type: 'booster' },
      // Finish platform
      { id: 'p5_end', x: 3340, y: 480, width: 260, height: 370, type: 'solid' },
    ],
    obstacles: [
      { id: 'o5_laser1', type: 'laser', x: 440, y: 350, width: 30, height: 180, speed: 2.0, phase: 0 },
      { id: 'o5_lava1', type: 'pit', x: 340, y: 830, width: 760, height: 30 },
      { id: 'o5_saw1', type: 'sawblade', x: 920, y: 490, width: 55, height: 55, speed: 3.2, range: 90 },
      { id: 'o5_laser2', type: 'laser', x: 1800, y: 280, width: 30, height: 200, speed: 2.5, phase: Math.PI },
      { id: 'o5_spikes', type: 'spike', x: 2740, y: 550, width: 210, height: 40 },
      { id: 'o5_lava2', type: 'pit', x: 1700, y: 830, width: 1250, height: 30 },
      { id: 'o5_lava3', type: 'pit', x: 3150, y: 830, width: 190, height: 30 },
    ],
    gems: [
      { id: 'g5_1', x: 470, y: 420, collected: false, value: 120 },
      { id: 'g5_2', x: 860, y: 380, collected: false, value: 120 },
      { id: 'g5_3', x: 1350, y: 400, collected: false, value: 150 },
      { id: 'g5_4', x: 1630, y: 240, collected: false, value: 200 },
      { id: 'g5_5', x: 2260, y: 290, collected: false, value: 150 },
      { id: 'g5_6', x: 2580, y: 230, collected: false, value: 250 },
      { id: 'g5_7', x: 3245, y: 400, collected: false, value: 150 },
    ],
    inkPickups: [
      { id: 'ink5_1', x: 1100, y: 420, amount: 160, collected: false },
      { id: 'ink5_2', x: 2480, y: 260, amount: 180, collected: false },
    ],
  },

  // BONUS: Sandbox Playground
  {
    id: 6,
    name: 'Bonus: Sandbox Arena',
    subtitle: 'Free Draw Playground',
    description: 'Unlimited ink! Experiment with loop-de-loops, massive ramps, multiple bounce lines, and high-speed stunts.',
    worldWidth: 4000,
    worldHeight: 900,
    spawnPoint: { x: 100, y: 520 },
    finishGate: { x: 3800, y: 460, width: 60, height: 90 },
    maxInk: 9999,
    targetTimeSeconds: 60,
    theme: 'sandbox',
    tutorialHint: '🎨 Unlimited Ink Sandbox! Test extreme slopes, giant trampolines, and wild stunt tracks.',
    platforms: [
      { id: 'ps_start', x: 0, y: 600, width: 450, height: 300, type: 'solid' },
      { id: 'ps_boost1', x: 1000, y: 560, width: 180, height: 50, type: 'booster' },
      { id: 'ps_spring1', x: 1800, y: 500, width: 160, height: 400, type: 'spring' },
      { id: 'ps_mid', x: 2600, y: 440, width: 300, height: 60, type: 'solid' },
      { id: 'ps_end', x: 3700, y: 550, width: 300, height: 350, type: 'solid' },
    ],
    obstacles: [
      { id: 'os_spike', type: 'spike', x: 1400, y: 620, width: 250, height: 40 },
    ],
    gems: [
      { id: 'gs_1', x: 600, y: 450, collected: false, value: 100 },
      { id: 'gs_2', x: 1200, y: 350, collected: false, value: 100 },
      { id: 'gs_3', x: 1880, y: 220, collected: false, value: 200 },
      { id: 'gs_4', x: 2750, y: 360, collected: false, value: 100 },
      { id: 'gs_5', x: 3300, y: 300, collected: false, value: 150 },
    ],
  },
];
