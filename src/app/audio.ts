// src/app/audio.ts - Offline MP3 Audio & Web Audio Engine

class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled = true;
  private currentAudio: HTMLAudioElement | null = null;
  private preloadedCache: Map<string, HTMLAudioElement> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      // Preload primary offline MP3 sound assets for zero-latency offline playback
      this.preload('/audio/correct.mp3');
      this.preload('/audio/incorrect.mp3');
      this.preload('/audio/victory.mp3');
      this.preload('/audio/fanfare.mp3');
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopAudio();
    }
  }

  public preload(url: string) {
    if (typeof window === 'undefined') return;
    try {
      if (!this.preloadedCache.has(url)) {
        const audio = new Audio(url);
        audio.preload = 'auto';
        this.preloadedCache.set(url, audio);
      }
    } catch {
      // Ignore preload errors in restrictive environments
    }
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

  public stopAudio() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {
        // Ignore aborts
      }
      this.currentAudio = null;
    }
  }

  /**
   * Play any pre-generated offline MP3 audio file
   */
  public playFile(url: string, onEnd?: () => void, onError?: () => void): HTMLAudioElement | null {
    if (!this.enabled || typeof window === 'undefined') return null;
    this.stopAudio();

    try {
      const audio = new Audio(url);
      this.currentAudio = audio;

      audio.onended = () => {
        if (this.currentAudio === audio) {
          this.currentAudio = null;
        }
        onEnd?.();
      };

      audio.onerror = () => {
        if (this.currentAudio === audio) {
          this.currentAudio = null;
        }
        onError?.();
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (err.name !== 'AbortError') {
            onError?.();
          }
        });
      }

      return audio;
    } catch {
      onError?.();
      return null;
    }
  }

  /**
   * Quick playback of pre-cached sound effect MP3s with fallback
   */
  private playEffect(url: string, fallbackFn: () => void) {
    if (!this.enabled || typeof window === 'undefined') return;

    try {
      const audio = new Audio(url);
      audio.volume = 0.85;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          fallbackFn();
        });
      }
    } catch {
      fallbackFn();
    }
  }

  // --- Tactile Click (Mechanical Web Audio click) ---
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

  // --- Correct Answer: Plays offline correct.mp3 with chime fallback ---
  public correct() {
    this.playEffect('/audio/correct.mp3', () => this.fallbackCorrectChime());
  }

  // --- Wrong Answer: Plays offline incorrect.mp3 with soft error fallback ---
  public wrong() {
    this.playEffect('/audio/incorrect.mp3', () => this.fallbackWrongTone());
  }

  // --- Celebratory Fanfare: Plays offline fanfare.mp3 with melody fallback ---
  public fanfare() {
    this.playEffect('/audio/fanfare.mp3', () => this.fallbackFanfareMelody());
  }

  // --- Mascot Specific Lines ---
  public playMascot(type: 'correct' | 'incorrect' | 'victory' | 'bossIntro', onEnd?: () => void) {
    const map: Record<string, string> = {
      correct: '/audio/correct.mp3',
      incorrect: '/audio/incorrect.mp3',
      victory: '/audio/victory.mp3',
      bossIntro: '/audio/boss-intro.mp3',
    };
    const file = map[type];
    if (file) {
      this.playFile(file, onEnd);
    }
  }

  // --- Internal Web Audio Fallbacks ---
  private fallbackCorrectChime() {
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
      // Fallback
    }
  }

  private fallbackWrongTone() {
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
      // Fallback
    }
  }

  private fallbackFanfareMelody() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const melody = [
        { f: 523.25, d: 0.10 },
        { f: 659.25, d: 0.10 },
        { f: 783.99, d: 0.10 },
        { f: 1046.5, d: 0.28 },
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
      // Fallback
    }
  }
}

export const sound = new SoundEngine();
