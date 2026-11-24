/**
 * Optional Web Audio API Space-Ambient & Modular Synth Engine
 * Starts muted. Never autoplays. Drives real-time FFT / waveform telemetry.
 */
export class AmbientSynth {
  constructor() {
    this.ctx = null;
    this.analyser = null;
    this.master = null;
    this.enabled = false;
    this.stepTimer = null;
    this.grainTimer = null;
    this.freqData = new Uint8Array(128);
    this.timeData = new Uint8Array(128);
    this.stepIndex = 0;
    this.pulseLevel = 0;
  }

  init() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return false;
    this.ctx = new AudioCtx();
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.82;

    this.master = this.ctx.createGain();
    this.master.gain.value = 0.0001;
    this.master.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    // 1. Deep space sub-pad + evolving low-pass filter
    const padFilter = this.ctx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.value = 340;
    padFilter.Q.value = 3.2;
    padFilter.connect(this.master);

    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.value = 0.07;
    lfoGain.gain.value = 180;
    lfo.connect(lfoGain);
    lfoGain.connect(padFilter.frequency);
    lfo.start();

    [
      { freq: 55.0, type: 'sawtooth', gain: 0.08 },
      { freq: 82.41, type: 'triangle', gain: 0.07 },
      { freq: 110.0, type: 'sine', gain: 0.06 },
      { freq: 164.81, type: 'sine', gain: 0.035 }
    ].forEach((cfg) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = cfg.type;
      osc.frequency.value = cfg.freq;
      g.gain.value = cfg.gain;
      osc.connect(g);
      g.connect(padFilter);
      osc.start();
    });

    // 2. Granular harmonic shimmer (A-maj9 cloud)
    const grainNotes = [220, 277.18, 329.63, 415.3, 493.88, 659.25];
    this.grainTimer = setInterval(() => {
      if (!this.enabled || !this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = grainNotes[Math.floor(Math.random() * grainNotes.length)];
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.028, now + 0.45);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
      osc.connect(g);
      g.connect(this.master);
      osc.start(now);
      osc.stop(now + 1.9);
    }, 950);

    // 3. Subtle modular step pulse (116 BPM sixteenth-ish Euclidean feel)
    const pattern = [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0];
    const seqNotes = [110, 164.81, 138.59, 220, 164.81, 246.94];
    this.stepTimer = setInterval(() => {
      this.stepIndex = (this.stepIndex + 1) % pattern.length;
      if (!this.enabled || !this.ctx || !pattern[this.stepIndex]) return;
      this.pulseLevel = 1;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filt = this.ctx.createBiquadFilter();
      const g = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = seqNotes[this.stepIndex % seqNotes.length];
      filt.type = 'bandpass';
      filt.frequency.value = 680;
      filt.Q.value = 2.5;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.055, now + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
      osc.connect(filt);
      filt.connect(g);
      g.connect(this.master);
      osc.start(now);
      osc.stop(now + 0.26);
    }, 258);

    return true;
  }

  async toggle() {
    if (!this.ctx) {
      if (!this.init()) return false;
    }
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    this.enabled = !this.enabled;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(Math.max(0.0001, this.master.gain.value), now);
    this.master.gain.exponentialRampToValueAtTime(this.enabled ? 0.42 : 0.0001, now + 0.45);
    return this.enabled;
  }

  getMetrics(t) {
    this.pulseLevel *= 0.88;
    if (this.enabled && this.analyser) {
      this.analyser.getByteFrequencyData(this.freqData);
      this.analyser.getByteTimeDomainData(this.timeData);
      let bass = 0, mid = 0, high = 0;
      for (let i = 0; i < 12; i++) bass += this.freqData[i];
      for (let i = 12; i < 48; i++) mid += this.freqData[i];
      for (let i = 48; i < 96; i++) high += this.freqData[i];
      return {
        active: true,
        bass: bass / (12 * 255),
        mid: mid / (36 * 255),
        high: high / (48 * 255),
        pulse: this.pulseLevel,
        step: this.stepIndex,
        freqData: this.freqData,
        timeData: this.timeData
      };
    }

    // Procedural fallback when muted so visuals still breathe organically
    for (let i = 0; i < 128; i++) {
      const f = Math.exp(-i / 36) * (0.45 + 0.35 * Math.sin(t * 1.8 + i * 0.22));
      this.freqData[i] = Math.max(0, Math.min(255, Math.floor(f * 200)));
      this.timeData[i] = Math.floor(128 + 42 * Math.sin(t * 3.1 + i * 0.18) + 18 * Math.cos(t * 5.2 - i * 0.09));
    }
    return {
      active: false,
      bass: 0.25 + 0.12 * Math.sin(t * 1.4),
      mid: 0.22 + 0.1 * Math.cos(t * 2.1),
      high: 0.14 + 0.08 * Math.sin(t * 3.0),
      pulse: Math.max(0, Math.sin(t * 4) * 0.4),
      step: Math.floor(t * 4) % 16,
      freqData: this.freqData,
      timeData: this.timeData
    };
  }
}
