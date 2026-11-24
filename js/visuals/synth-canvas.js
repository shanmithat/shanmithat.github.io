/**
 * Chapter 05 — Algorave / Eurorack / Oscilloscope / Lissajous / Spectrogram Canvas
 * Driven in real time by AmbientSynth AnalyserNode (or procedural synthesis when muted).
 */
export function initSynthCanvas(canvasId, synth) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let mode = 'osc'; // 'osc' | 'lissajous' | 'spectrum'
  let w = 800;
  let h = 360;
  let t = 0;

  function resize() {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.max(320, Math.floor(r.width));
    h = Math.max(240, Math.floor(r.height));
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  document.querySelectorAll('.synth-mode-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.synth-mode-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      mode = btn.dataset.synthMode || 'osc';
    });
  });

  function draw() {
    if (!document.hidden) {
      t += 0.025;
      const m = synth.getMetrics(t);

      ctx.fillStyle = 'rgba(5, 8, 22, 0.86)';
      ctx.fillRect(0, 0, w, h);

      // Eurorack graticule lines
      ctx.strokeStyle = 'rgba(192, 154, 255, 0.1)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 48) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 48) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

      if (mode === 'osc') {
        // Dual-trace oscilloscope
        ctx.strokeStyle = '#315BFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 128; i++) {
          const x = (i / 127) * w;
          const v = (m.timeData[i] - 128) / 128;
          const y = h * 0.5 + v * (h * 0.38);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.strokeStyle = '#C09AFF';
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        for (let i = 0; i < 128; i++) {
          const x = (i / 127) * w;
          const v = (m.timeData[(i + 12) % 128] - 128) / 128;
          const y = h * 0.5 + v * (h * 0.28) * Math.cos(t * 0.7);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else if (mode === 'lissajous') {
        // Harmonic Lissajous figure
        ctx.strokeStyle = '#C09AFF';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        const fx = 3 + Math.round(m.bass * 3);
        const fy = 2 + Math.round(m.mid * 4);
        for (let i = 0; i <= 260; i++) {
          const a = (i / 260) * Math.PI * 2;
          const x = w * 0.5 + Math.sin(a * fx + t) * (w * 0.32);
          const y = h * 0.5 + Math.sin(a * fy) * (h * 0.36);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else {
        // FFT Spectrogram bars
        const bars = 64;
        const bw = w / bars;
        for (let i = 0; i < bars; i++) {
          const mag = m.freqData[i] / 255;
          const bh = mag * (h * 0.78);
          ctx.fillStyle = mag > 0.65 ? '#FF542E' : mag > 0.35 ? '#8956FF' : '#315BFF';
          ctx.fillRect(i * bw + 1, h - bh - 26, bw - 2, bh);
        }
      }

      // Bottom 16-step MIDI / Algorave sequencer strip
      const sw = w / 16;
      const pattern = [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0];
      for (let s = 0; s < 16; s++) {
        const active = s === m.step;
        ctx.fillStyle = active ? '#F5F4FF' : pattern[s] ? 'rgba(137, 86, 255, 0.45)' : 'rgba(216, 220, 235, 0.1)';
        ctx.fillRect(s * sw + 2, h - 14, sw - 4, 8);
      }
    }

    if (!reducedMotion) requestAnimationFrame(draw);
  }

  draw();
}
