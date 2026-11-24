/**
 * Signature Procedural Scientific Visualization Engine
 * Modes:
 *   1) 'wireframe' — 3D Deformable Computational Wireframe Surface + Inflection Telemetry
 *   2) 'vector'    — 2D Convergence / Divergence Vector Field + Advected Streamlines
 *   3) 'thermal'   — Quantized Advection-Diffusion Thermal Field + Iso-Contours
 */
export function initHeroField(canvasId, hudCoordId, modeButtonsSelector) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const coordEl = document.getElementById(hudCoordId);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let mode = 'wireframe';
  let t = 0;

  const pointer = { nx: 0.52, ny: 0.48, tx: 0.52, ty: 0.48, active: false };

  // Thermal grid state (for 'thermal' mode)
  const TW = 44;
  const TH = 34;
  let tempA = new Float32Array(TW * TH);
  let tempB = new Float32Array(TW * TH);

  function seedThermal() {
    for (let y = 0; y < TH; y++) {
      for (let x = 0; x < TW; x++) {
        const dx1 = x - TW * 0.35;
        const dy1 = y - TH * 0.45;
        const dx2 = x - TW * 0.7;
        const dy2 = y - TH * 0.62;
        tempA[y * TW + x] =
          Math.exp(-(dx1 * dx1 + dy1 * dy1) / 36) * 0.95 +
          Math.exp(-(dx2 * dx2 + dy2 * dy2) / 28) * 0.72;
      }
    }
  }
  seedThermal();

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = Math.max(300, Math.floor(rect.width));
    height = Math.max(320, Math.floor(rect.height));
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener('resize', resize);
  resize();

  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    pointer.tx = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    pointer.ty = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height));
    pointer.active = true;
    if (coordEl) {
      const fx = (pointer.tx * 2 - 1).toFixed(3);
      const fy = (1 - pointer.ty * 2).toFixed(3);
      coordEl.textContent = `ξ=${fx} η=${fy}`;
    }
  });

  canvas.addEventListener('pointerleave', () => {
    pointer.active = false;
  });

  document.querySelectorAll(modeButtonsSelector).forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll(modeButtonsSelector).forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      mode = btn.dataset.mode || 'wireframe';
    });
  });

  // --------------------------------------------------------------------------
  // Mode 1: 3D Deformable Computational Wireframe Mesh
  // --------------------------------------------------------------------------
  function drawWireframe() {
    const cols = 34;
    const rows = 26;
    const pts = new Array(rows);

    const cx = pointer.nx * 2 - 1;
    const cy = pointer.ny * 2 - 1;

    const tiltX = 0.62 + (pointer.ny - 0.5) * 0.14;
    const rotY = -0.35 + (pointer.nx - 0.5) * 0.25;
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const cosX = Math.cos(tiltX);
    const sinX = Math.sin(tiltX);

    const scale = Math.min(width, height) * 0.52;

    for (let j = 0; j < rows; j++) {
      pts[j] = new Array(cols);
      const v = (j / (rows - 1)) * 2 - 1;
      for (let i = 0; i < cols; i++) {
        const u = (i / (cols - 1)) * 2 - 1;

        const r2 = u * u + v * v;
        const dc2 = (u - cx) * (u - cx) + (v - cy) * (v - cy);

        // Coupled wave + saddle + cursor potential well
        const h =
          0.26 * Math.sin(u * 3.4 + t * 1.15) * Math.cos(v * 3.1 - t * 0.85) +
          0.16 * Math.cos(Math.sqrt(r2) * 5.2 - t * 1.6) * Math.exp(-r2 * 0.65) -
          0.34 * Math.exp(-dc2 * 5.5);

        // Rotate in 3D
        const x1 = u * cosY - h * sinY;
        const z1 = u * sinY + h * cosY;
        const y2 = v * cosX - z1 * sinX;
        const z2 = v * sinX + z1 * cosX;

        const persp = 2.6 / (2.6 + z2 * 0.55);
        const sx = width * 0.5 + x1 * scale * persp;
        const sy = height * 0.52 + y2 * scale * persp;
        pts[j][i] = { sx, sy, h };
      }
    }

    // Draw mesh lines
    ctx.lineWidth = 1;
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const p = pts[j][i];
        const energy = Math.min(1, Math.abs(p.h) * 2.2);
        const isWell = p.h < -0.14;

        let stroke;
        if (isWell) {
          stroke = `rgba(49, 91, 255, ${0.42 + energy * 0.5})`;
        } else if (p.h > 0.24) {
          stroke = `rgba(255, 84, 46, ${0.4 + energy * 0.45})`;
        } else {
          stroke = `rgba(57, 255, 112, ${0.16 + energy * 0.62})`;
        }

        ctx.strokeStyle = stroke;
        if (i < cols - 1) {
          const pr = pts[j][i + 1];
          ctx.beginPath();
          ctx.moveTo(p.sx, p.sy);
          ctx.lineTo(pr.sx, pr.sy);
          ctx.stroke();
        }
        if (j < rows - 1) {
          const pd = pts[j + 1][i];
          ctx.beginPath();
          ctx.moveTo(p.sx, p.sy);
          ctx.lineTo(pd.sx, pd.sy);
          ctx.stroke();
        }
      }
    }

    // Highlight sparse lattice vertices
    ctx.fillStyle = '#39FF70';
    for (let j = 0; j < rows; j += 3) {
      for (let i = 0; i < cols; i += 3) {
        const p = pts[j][i];
        ctx.fillRect(p.sx - 1, p.sy - 1, 2, 2);
      }
    }
  }

  // --------------------------------------------------------------------------
  // Mode 2: 2D Convergence / Divergence Vector Field
  // --------------------------------------------------------------------------
  const tracers = Array.from({ length: 110 }, (_, k) => ({
    x: ((k * 73) % 100) / 100,
    y: ((k * 41) % 100) / 100,
    age: k % 60
  }));

  function fieldVel(nx, ny) {
    const ax = pointer.nx;
    const ay = pointer.ny;
    const bx = 0.28 + 0.08 * Math.sin(t * 0.5);
    const by = 0.35 + 0.08 * Math.cos(t * 0.4);

    // Attractor 1 (sink + swirl at pointer)
    const dx1 = nx - ax;
    const dy1 = ny - ay;
    const r1 = dx1 * dx1 + dy1 * dy1 + 0.018;

    // Source 2
    const dx2 = nx - bx;
    const dy2 = ny - by;
    const r2 = dx2 * dx2 + dy2 * dy2 + 0.025;

    const vx = (-dx1 * 0.14 - dy1 * 0.22) / r1 + (dx2 * 0.08 - dy2 * 0.12) / r2 + 0.12 * Math.cos(ny * 5 + t);
    const vy = (-dy1 * 0.14 + dx1 * 0.22) / r1 + (dy2 * 0.08 + dx2 * 0.12) / r2 + 0.12 * Math.sin(nx * 5 - t);
    return { vx, vy };
  }

  function drawVectorField() {
    const gx = 20;
    const gy = 15;
    const cw = width / gx;
    const ch = height / gy;

    ctx.lineWidth = 1;
    for (let j = 0; j < gy; j++) {
      for (let i = 0; i < gx; i++) {
        const nx = (i + 0.5) / gx;
        const ny = (j + 0.5) / gy;
        const { vx, vy } = fieldVel(nx, ny);
        const mag = Math.hypot(vx, vy) || 1;
        const len = Math.min(18, 5 + mag * 1.8);
        const ux = vx / mag;
        const uy = vy / mag;

        const px = nx * width;
        const py = ny * height;
        const ex = px + ux * len;
        const ey = py + uy * len;

        const norm = Math.min(1, mag / 9);
        ctx.strokeStyle = norm > 0.65
          ? `rgba(255, 84, 46, ${0.45 + norm * 0.4})`
          : `rgba(57, 255, 112, ${0.24 + norm * 0.55})`;

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(ex, ey);
        ctx.stroke();

        ctx.fillStyle = ctx.strokeStyle;
        ctx.fillRect(ex - 1, ey - 1, 2, 2);
      }
    }

    // Advect tracer particles
    for (const tr of tracers) {
      const { vx, vy } = fieldVel(tr.x, tr.y);
      const mag = Math.hypot(vx, vy) || 1;
      const step = 0.0045;
      const nx = tr.x + (vx / mag) * step;
      const ny = tr.y + (vy / mag) * step;

      ctx.strokeStyle = 'rgba(49, 91, 255, 0.78)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(tr.x * width, tr.y * height);
      ctx.lineTo(nx * width, ny * height);
      ctx.stroke();

      tr.x = nx;
      tr.y = ny;
      tr.age++;
      if (tr.x < 0 || tr.x > 1 || tr.y < 0 || tr.y > 1 || tr.age > 90) {
        tr.x = Math.random();
        tr.y = Math.random();
        tr.age = 0;
      }
    }
  }

  // --------------------------------------------------------------------------
  // Mode 3: Quantized Advection-Diffusion Thermal Field
  // --------------------------------------------------------------------------
  function stepThermal() {
    const px = Math.floor(pointer.nx * (TW - 2)) + 1;
    const py = Math.floor(pointer.ny * (TH - 2)) + 1;

    for (let y = 1; y < TH - 1; y++) {
      for (let x = 1; x < TW - 1; x++) {
        const idx = y * TW + x;
        const lap =
          tempA[idx - 1] +
          tempA[idx + 1] +
          tempA[idx - TW] +
          tempA[idx + TW] -
          4 * tempA[idx];
        // Slight swirling advection
        const advX = (tempA[idx - 1] - tempA[idx + 1]) * 0.06 * Math.sin(t + y * 0.2);
        let next = tempA[idx] + 0.14 * lap + advX;
        next *= 0.992;
        if (Math.hypot(x - px, y - py) < 2.2) next = Math.min(1, next + 0.22);
        // Periodic warm pulse
        if (Math.hypot(x - TW * 0.28, y - TH * 0.68) < 1.8) {
          next = Math.max(next, 0.65 + 0.25 * Math.sin(t * 2));
        }
        tempB[idx] = Math.max(0, Math.min(1, next));
      }
    }
    const tmp = tempA;
    tempA = tempB;
    tempB = tmp;
  }

  function drawThermal() {
    stepThermal();
    const cw = width / TW;
    const ch = height / TH;

    for (let y = 0; y < TH; y++) {
      for (let x = 0; x < TW; x++) {
        const val = tempA[y * TW + x];
        // Quantized scientific colormap: #050606 -> #315BFF -> #39FF70 -> #FF542E
        let fill = '#050606';
        if (val > 0.72) fill = '#FF542E';
        else if (val > 0.48) fill = '#39FF70';
        else if (val > 0.24) fill = '#315BFF';
        else if (val > 0.10) fill = '#13204a';

        ctx.fillStyle = fill;
        ctx.fillRect(x * cw, y * ch, cw - 1, ch - 1);
      }
    }
  }

  // --------------------------------------------------------------------------
  // Instrumentation Crosshair Overlay + Animation Loop
  // --------------------------------------------------------------------------
  function drawReticle() {
    const mx = pointer.nx * width;
    const my = pointer.ny * height;

    ctx.strokeStyle = 'rgba(197, 201, 206, 0.22)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.moveTo(mx, 0);
    ctx.lineTo(mx, height);
    ctx.moveTo(0, my);
    ctx.lineTo(width, my);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = '#39FF70';
    ctx.strokeRect(mx - 8, my - 8, 16, 16);
  }

  function frame() {
    pointer.nx += (pointer.tx - pointer.nx) * 0.08;
    pointer.ny += (pointer.ty - pointer.ny) * 0.08;
    t += 0.016;

    ctx.fillStyle = '#050606';
    ctx.fillRect(0, 0, width, height);

    // Subtle background coordinate ticks
    ctx.strokeStyle = 'rgba(30, 34, 38, 0.7)';
    ctx.lineWidth = 1;
    for (let x = 40; x < width; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 6);
      ctx.moveTo(x, height - 6);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    if (mode === 'wireframe') drawWireframe();
    else if (mode === 'vector') drawVectorField();
    else drawThermal();

    drawReticle();

    if (!reducedMotion) {
      requestAnimationFrame(frame);
    }
  }

  frame();
}
