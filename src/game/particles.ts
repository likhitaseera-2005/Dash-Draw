/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  shape: 'circle' | 'star' | 'confetti' | 'spark';
  rotation?: number;
  vRot?: number;
}

export class ParticleSystem {
  public particles: Particle[] = [];

  public update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life++;

      // Drag / gravity
      if (p.shape === 'confetti') {
        p.vy += 0.08;
        p.vx *= 0.98;
        if (p.rotation !== undefined && p.vRot !== undefined) {
          p.rotation += p.vRot;
        }
      } else if (p.shape === 'star' || p.shape === 'spark') {
        p.vx *= 0.94;
        p.vy *= 0.94;
      } else {
        p.vy -= 0.02; // Smoke drifts up slightly
        p.vx *= 0.92;
      }

      p.alpha = Math.max(0, 1 - p.life / p.maxLife);

      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }
  }

  public addDust(x: number, y: number) {
    for (let i = 0; i < 2; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 4,
        vx: -1.5 - Math.random() * 1.5,
        vy: -0.5 - Math.random() * 0.8,
        size: 3 + Math.random() * 4,
        color: 'rgba(210, 215, 225, 0.7)',
        alpha: 0.8,
        life: 0,
        maxLife: 20 + Math.random() * 10,
        shape: 'circle',
      });
    }
  }

  public addDrawSparks(x: number, y: number, color = '#22c55e') {
    for (let i = 0; i < 3; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 2.5,
        color,
        alpha: 0.9,
        life: 0,
        maxLife: 15 + Math.random() * 10,
        shape: 'spark',
      });
    }
  }

  public addGemSparkles(x: number, y: number) {
    const colors = ['#facc15', '#fef08a', '#fbbf24', '#ffffff', '#38bdf8'];
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2 + Math.random() * 0.3;
      const speed = 2 + Math.random() * 4;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3.5 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 0,
        maxLife: 30 + Math.random() * 15,
        shape: Math.random() > 0.4 ? 'star' : 'spark',
      });
    }
  }

  public addBounceSparks(x: number, y: number) {
    for (let i = 0; i < 12; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.4;
      const speed = 3 + Math.random() * 5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 3,
        color: '#fbbf24',
        alpha: 1,
        life: 0,
        maxLife: 25,
        shape: 'spark',
      });
    }
  }

  public addCrashDebris(x: number, y: number) {
    for (let i = 0; i < 24; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 4 + Math.random() * 4,
        color: Math.random() > 0.5 ? '#ef4444' : '#f97316',
        alpha: 1,
        life: 0,
        maxLife: 35,
        shape: 'spark',
      });
    }
  }

  public addVictoryConfetti(x: number, y: number) {
    const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
    for (let i = 0; i < 70; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
      const speed = 4 + Math.random() * 8;
      this.particles.push({
        x: x + (Math.random() - 0.5) * 60,
        y: y + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 5 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 0,
        maxLife: 60 + Math.random() * 40,
        shape: 'confetti',
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
      });
    }
  }

  public clear() {
    this.particles = [];
  }
}
