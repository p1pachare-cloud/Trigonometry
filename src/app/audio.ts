// src/app/audio.ts - Lightweight Web Audio API sound generator (Zero external dependencies)

class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled = true;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Crisp mechanical tactile click
  public click() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.045);
    } catch {
      // Audio fallback silent
    }
  }

  // Uplifting sparkling chime for correct answers
  public correct() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        const startTime = this.ctx!.currentTime + idx * 0.06;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.36);
      });
    } catch {
      // Audio fallback
    }
  }

  // Gentle soft error nudge
  public wrong() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(160, this.ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.19);
    } catch {
      // Audio fallback
    }
  }

  // Celebratory fanfare when lighting a star or conquering a boss vault
  public fanfare() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const melody = [
        { f: 523.25, d: 0.10 }, // C5
        { f: 659.25, d: 0.10 }, // E5
        { f: 783.99, d: 0.10 }, // G5
        { f: 1046.5, d: 0.28 }, // C6
      ];

      let t = this.ctx.currentTime;
      melody.forEach(m => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(m.f, t);

        gain.gain.setValueAtTime(0.16, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + m.d);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(t);
        osc.stop(t + m.d + 0.02);

        t += m.d * 0.85;
      });
    } catch {
      // Audio fallback
    }
  }
}

export const sound = new SoundEngine();
