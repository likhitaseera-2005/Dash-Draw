/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicGainNode: GainNode | null = null;
  private sfxGainNode: GainNode | null = null;
  private isMusicPlaying = false;
  private musicInterval: number | null = null;
  private musicStep = 0;

  public soundEnabled = true;
  public musicEnabled = true;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.musicGainNode = this.ctx.createGain();
      this.musicGainNode.gain.value = this.musicEnabled ? 0.18 : 0;
      this.musicGainNode.connect(this.ctx.destination);

      this.sfxGainNode = this.ctx.createGain();
      this.sfxGainNode.gain.value = this.soundEnabled ? 0.35 : 0;
      this.sfxGainNode.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (this.sfxGainNode && this.ctx) {
      this.sfxGainNode.gain.setValueAtTime(enabled ? 0.35 : 0, this.ctx.currentTime);
    }
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (this.musicGainNode && this.ctx) {
      this.musicGainNode.gain.setValueAtTime(enabled ? 0.18 : 0, this.ctx.currentTime);
    }
    if (enabled && !this.isMusicPlaying) {
      this.startMusic();
    } else if (!enabled && this.isMusicPlaying) {
      this.stopMusic();
    }
  }

  // --- Sound Effects ---

  public playClick() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.05);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  public playDraw() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400 + Math.random() * 80, now);
    osc.frequency.linearRampToValueAtTime(480 + Math.random() * 80, now + 0.04);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(now);
    osc.stop(now + 0.045);
  }

  public playJump() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(580, now + 0.16);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(now);
    osc.stop(now + 0.19);
  }

  public playBounce() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(740, now + 0.22);

    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.24);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  public playGem(combo = 0) {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    const baseFreqs = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6
    const freq = baseFreqs[Math.min(combo, baseFreqs.length - 1)];

    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.15);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, now);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + 0.3);
    osc2.stop(now + 0.3);
  }

  public playSpeedBoost() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.25);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(now);
    osc.stop(now + 0.29);
  }

  public playHurt() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.linearRampToValueAtTime(70, now + 0.3);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.32);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(now);
    osc.stop(now + 0.33);
  }

  public playVictory() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    const notes = [
      { freq: 523.25, start: 0, dur: 0.12 },    // C5
      { freq: 659.25, start: 0.12, dur: 0.12 }, // E5
      { freq: 783.99, start: 0.24, dur: 0.14 }, // G5
      { freq: 1046.5, start: 0.38, dur: 0.45 }, // C6
    ];

    const now = this.ctx.currentTime;

    notes.forEach((n) => {
      if (!this.ctx || !this.sfxGainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = now + n.start;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.freq, noteTime);

      gain.gain.setValueAtTime(0.35, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.01, noteTime + n.dur);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(noteTime);
      osc.stop(noteTime + n.dur + 0.05);
    });
  }

  public playUndo() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // --- Procedural Synth BGM ---

  public startMusic() {
    if (!this.musicEnabled || this.isMusicPlaying) return;
    this.initContext();
    if (!this.ctx || !this.musicGainNode) return;

    this.isMusicPlaying = true;
    this.musicStep = 0;

    // Upbeat pentatonic melodic loop: 130 BPM (approx 115ms per 16th note)
    const melody = [
      392.0, 0, 523.25, 0, 587.33, 659.25, 0, 523.25,
      659.25, 783.99, 0, 659.25, 587.33, 0, 523.25, 392.0,
      440.0, 0, 523.25, 0, 587.33, 0, 659.25, 0,
      783.99, 659.25, 587.33, 523.25, 587.33, 0, 0, 0,
    ];

    const bass = [
      130.81, 0, 130.81, 0, 164.81, 0, 164.81, 0,
      174.61, 0, 174.61, 0, 196.0, 0, 196.0, 0,
      130.81, 0, 130.81, 0, 164.81, 0, 164.81, 0,
      174.61, 0, 174.61, 0, 196.0, 174.61, 164.81, 146.83,
    ];

    const stepDuration = 120; // ms

    this.musicInterval = window.setInterval(() => {
      if (!this.ctx || !this.musicGainNode || !this.musicEnabled) return;

      const now = this.ctx.currentTime;
      const melFreq = melody[this.musicStep % melody.length];
      const bassFreq = bass[this.musicStep % bass.length];

      // Play bass note
      if (bassFreq > 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(bassFreq, now);

        bassGain.gain.setValueAtTime(0.12, now);
        bassGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        bassOsc.connect(bassGain);
        bassGain.connect(this.musicGainNode);

        bassOsc.start(now);
        bassOsc.stop(now + 0.16);
      }

      // Play lead melody note
      if (melFreq > 0) {
        const leadOsc = this.ctx.createOscillator();
        const leadGain = this.ctx.createGain();
        leadOsc.type = 'sine';
        leadOsc.frequency.setValueAtTime(melFreq, now);

        leadGain.gain.setValueAtTime(0.08, now);
        leadGain.gain.exponentialRampToValueAtTime(0.005, now + 0.18);

        leadOsc.connect(leadGain);
        leadGain.connect(this.musicGainNode);

        leadOsc.start(now);
        leadOsc.stop(now + 0.19);
      }

      // Snare/Hat pulse every 4 steps
      if (this.musicStep % 4 === 2) {
        const hatOsc = this.ctx.createOscillator();
        const hatGain = this.ctx.createGain();
        hatOsc.type = 'square';
        hatOsc.frequency.setValueAtTime(800, now);
        hatOsc.frequency.exponentialRampToValueAtTime(200, now + 0.04);

        hatGain.gain.setValueAtTime(0.03, now);
        hatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        hatOsc.connect(hatGain);
        hatGain.connect(this.musicGainNode);

        hatOsc.start(now);
        hatOsc.stop(now + 0.045);
      }

      this.musicStep = (this.musicStep + 1) % melody.length;
    }, stepDuration);
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const soundManager = new SoundEngine();
