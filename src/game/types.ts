/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Point {
  x: number;
  y: number;
}

export type StrokeType = 'solid' | 'bounce' | 'speed';

export interface DrawnStroke {
  id: string;
  points: Point[];
  type: StrokeType;
  length: number;
}

export type HazardType = 'spike' | 'laser' | 'sawblade' | 'pit';

export interface Obstacle {
  id: string;
  type: HazardType;
  x: number;
  y: number;
  width: number;
  height: number;
  phase?: number;
  speed?: number;
  range?: number;
  baseY?: number;
  baseX?: number;
  active?: boolean;
}

export interface Platform {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'solid' | 'moving' | 'spring' | 'booster';
  speed?: number;
  range?: number;
  axis?: 'x' | 'y';
  baseX?: number;
  baseY?: number;
}

export interface CollectibleGem {
  id: string;
  x: number;
  y: number;
  collected: boolean;
  value: number;
}

export interface InkPickup {
  id: string;
  x: number;
  y: number;
  amount: number;
  collected: boolean;
}

export interface FinishGate {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LevelConfig {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  worldWidth: number;
  worldHeight: number;
  spawnPoint: Point;
  finishGate: FinishGate;
  platforms: Platform[];
  obstacles: Obstacle[];
  gems: CollectibleGem[];
  inkPickups?: InkPickup[];
  maxInk: number;
  targetTimeSeconds: number;
  theme: 'meadow' | 'canyon' | 'ruins' | 'crystal' | 'cyber' | 'sandbox';
  tutorialHint?: string;
}

export interface CharacterState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  height: number;
  onGround: boolean;
  groundNormal: Point;
  groundType: StrokeType | 'platform' | null;
  groundAngle: number;
  isDead: boolean;
  hasFinished: boolean;
  runCycle: number;
  facing: 1 | -1;
  isAirborne: boolean;
  squash: number; // For squash & stretch
  dustTimer: number;
  speedBoostTimer: number;
  shieldTimer: number;
}

export interface LevelRecord {
  unlocked: boolean;
  completed: boolean;
  highScore: number;
  bestTime: number; // in seconds
  gemsCollected: number;
  maxGems: number;
  stars: number; // 0-3
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  sfxVolume: number;
  musicVolume: number;
  smoothCamera: boolean;
}

export type GameScreen = 'MENU' | 'PLAYING' | 'LEVEL_SELECT' | 'HOW_TO_PLAY' | 'SANDBOX';
export type PlayMode = 'DRAW_PREP' | 'RUNNING';
