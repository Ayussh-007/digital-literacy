// Sound effects manager using the Web Audio API
// Generates sounds procedurally so no external files are needed

class SoundManager {
  constructor() {
    this.enabled = true;
    this.volume = 0.5;
    this.audioContext = null;
  }

  getContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this.audioContext;
  }

  play(type) {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      switch (type) {
        case 'correct': this._playCorrect(ctx); break;
        case 'wrong': this._playWrong(ctx); break;
        case 'click': this._playClick(ctx); break;
        case 'bonus': this._playBonus(ctx); break;
        case 'spin': this._playSpin(ctx); break;
        case 'celebration': this._playCelebration(ctx); break;
        case 'countdown': this._playCountdown(ctx); break;
        case 'leaderboard': this._playLeaderboard(ctx); break;
        case 'victory': this._playVictory(ctx); break;
        case 'applause': this._playApplause(ctx); break;
        case 'whoosh': this._playWhoosh(ctx); break;
        case 'pop': this._playPop(ctx); break;
        case 'tick': this._playTick(ctx); break;
        default: this._playClick(ctx);
      }
    } catch (e) {
      // Silently fail if audio is blocked
    }
  }

  _createOsc(ctx, type, freq, startTime, duration, vol = this.volume) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(vol, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration);
    return osc;
  }

  _playCorrect(ctx) {
    const t = ctx.currentTime;
    this._createOsc(ctx, 'sine', 523, t, 0.15, this.volume * 0.4);
    this._createOsc(ctx, 'sine', 659, t + 0.1, 0.15, this.volume * 0.4);
    this._createOsc(ctx, 'sine', 784, t + 0.2, 0.3, this.volume * 0.5);
  }

  _playWrong(ctx) {
    const t = ctx.currentTime;
    this._createOsc(ctx, 'sawtooth', 200, t, 0.3, this.volume * 0.2);
    this._createOsc(ctx, 'sawtooth', 180, t + 0.15, 0.3, this.volume * 0.2);
  }

  _playClick(ctx) {
    const t = ctx.currentTime;
    this._createOsc(ctx, 'sine', 800, t, 0.05, this.volume * 0.3);
  }

  _playBonus(ctx) {
    const t = ctx.currentTime;
    for (let i = 0; i < 5; i++) {
      this._createOsc(ctx, 'sine', 400 + i * 100, t + i * 0.08, 0.15, this.volume * 0.3);
    }
  }

  _playSpin(ctx) {
    const t = ctx.currentTime;
    for (let i = 0; i < 10; i++) {
      this._createOsc(ctx, 'triangle', 300 + Math.random() * 400, t + i * 0.1, 0.08, this.volume * 0.2);
    }
  }

  _playCelebration(ctx) {
    const t = ctx.currentTime;
    const notes = [523, 659, 784, 1047, 784, 1047, 1319];
    notes.forEach((n, i) => {
      this._createOsc(ctx, 'sine', n, t + i * 0.12, 0.2, this.volume * 0.3);
    });
  }

  _playCountdown(ctx) {
    const t = ctx.currentTime;
    this._createOsc(ctx, 'sine', 440, t, 0.15, this.volume * 0.4);
  }

  _playLeaderboard(ctx) {
    const t = ctx.currentTime;
    this._createOsc(ctx, 'sine', 600, t, 0.1, this.volume * 0.3);
    this._createOsc(ctx, 'sine', 800, t + 0.1, 0.2, this.volume * 0.3);
  }

  _playVictory(ctx) {
    const t = ctx.currentTime;
    const notes = [523, 523, 523, 698, 880, 784, 698, 880, 1047];
    notes.forEach((n, i) => {
      this._createOsc(ctx, 'sine', n, t + i * 0.15, 0.2, this.volume * 0.4);
    });
  }

  _playApplause(ctx) {
    const t = ctx.currentTime;
    for (let i = 0; i < 20; i++) {
      const bufferSize = ctx.sampleRate * 0.05;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let j = 0; j < bufferSize; j++) {
        data[j] = (Math.random() * 2 - 1) * 0.3;
      }
      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      source.buffer = buffer;
      gain.gain.setValueAtTime(this.volume * 0.15, t + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.05 + 0.08);
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start(t + i * 0.05);
    }
  }

  _playWhoosh(ctx) {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(1200, t + 0.2);
    gain.gain.setValueAtTime(this.volume * 0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.3);
  }

  _playPop(ctx) {
    const t = ctx.currentTime;
    this._createOsc(ctx, 'sine', 600, t, 0.08, this.volume * 0.4);
  }

  _playTick(ctx) {
    const t = ctx.currentTime;
    this._createOsc(ctx, 'sine', 1000, t, 0.03, this.volume * 0.25);
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }
}

export const soundManager = new SoundManager();
