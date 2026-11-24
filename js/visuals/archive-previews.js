/**
 * Procedural Canvas Renderers for Case Files Without Static Screenshots
 */
export function renderProceduralPreviews(root = document) {
  const canvases = root.querySelectorAll('canvas[data-procedural]');
  canvases.forEach((canvas) => {
    const kind = canvas.dataset.procedural;
    const ctx = canvas.getContext('2d');
    const w = (canvas.width = 640);
    const h = (canvas.height = 400);

    ctx.fillStyle = '#070913';
    ctx.fillRect(0, 0, w, h);

    if (kind === 'dynamesh') {
      // High-contrast GPU SIMP Thermal-Fluid Velocity Contour & Topology Render
      const nx = 64, ny = 40;
      const cw = w / nx, ch = h / ny;
      for (let j = 0; j < ny; j++) {
        for (let i = 0; i < nx; i++) {
          const x = i / nx;
          const y = (j - ny / 2) / (ny / 2);
          const trunk = Math.exp(-Math.pow(y, 2) * 16) * (1.05 - x * 0.35);
          const branch1 = Math.exp(-Math.pow(y - 0.44 * Math.sin(x * 3.15), 2) * 24) * Math.pow(x, 0.75);
          const branch2 = Math.exp(-Math.pow(y + 0.44 * Math.sin(x * 3.15), 2) * 24) * Math.pow(x, 0.75);
          const sub1 = Math.exp(-Math.pow(y - 0.22 * Math.sin(x * 5.2), 2) * 32) * (x > 0.45 ? 0.65 : 0);
          const sub2 = Math.exp(-Math.pow(y + 0.22 * Math.sin(x * 5.2), 2) * 32) * (x > 0.45 ? 0.65 : 0);
          const fluid = Math.min(1, trunk + branch1 + branch2 + sub1 + sub2);
          const temp = Math.max(0, Math.min(1, (1 - fluid * 0.85) * (0.3 + 0.7 * x)));

          if (fluid > 0.42) {
            ctx.fillStyle = `rgba(49, 91, 255, ${0.45 + fluid * 0.5})`; // Cool convective flow
          } else if (temp > 0.58) {
            ctx.fillStyle = `rgba(255, 84, 46, ${0.42 + temp * 0.55})`; // High thermal hotspot
          } else {
            ctx.fillStyle = `rgba(137, 86, 255, ${0.22 + temp * 0.4})`; // Solid conductive transition
          }
          ctx.fillRect(i * cw, j * ch, cw - 0.5, ch - 0.5);
        }
      }

      // Iso-velocity streamlines
      ctx.strokeStyle = '#F4F6FB';
      ctx.lineWidth = 1.4;
      [-0.4, 0, 0.4].forEach((off) => {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 6) {
          const t = x / w;
          const y = h * 0.5 + off * h * 0.5 * Math.sin(t * 3.15);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      // Technical HUD colorbar & labels
      ctx.fillStyle = 'rgba(7, 9, 19, 0.86)';
      ctx.fillRect(14, 14, 330, 26);
      ctx.strokeStyle = 'rgba(192, 154, 255, 0.35)';
      ctx.strokeRect(14, 14, 330, 26);
      ctx.fillStyle = '#F4F6FB';
      ctx.font = '11px monospace';
      ctx.fillText('SIMP DENSITY γ(x) // THERMAL-FLUID FVM', 24, 31);

      const barGrad = ctx.createLinearGradient(16, 0, 176, 0);
      barGrad.addColorStop(0, '#315BFF');
      barGrad.addColorStop(0.5, '#8956FF');
      barGrad.addColorStop(1, '#FF542E');
      ctx.fillStyle = barGrad;
      ctx.fillRect(16, h - 24, 160, 10);
      ctx.fillStyle = '#CBD2E1';
      ctx.fillText('T_min', 16, h - 29);
      ctx.fillText('T_max', 142, h - 29);
    } else if (kind === 'cad-metrology') {
      // Wireframe B-Rep polyhedron + OBB + principal axes
      const cx = w * 0.5, cy = h * 0.5;
      ctx.strokeStyle = '#1E2226';
      for (let x = 0; x < w; x += 24) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 24) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

      // Isometric bracket wireframe
      ctx.strokeStyle = '#5B7FFF';
      ctx.lineWidth = 1.5;
      const pts = [
        [cx - 95, cy + 45], [cx + 25, cy + 75], [cx + 105, cy + 15], [cx - 15, cy - 15],
        [cx - 95, cy - 35], [cx + 25, cy - 5], [cx + 105, cy - 65], [cx - 15, cy - 95]
      ];
      const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
      edges.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(pts[a][0], pts[a][1]);
        ctx.lineTo(pts[b][0], pts[b][1]);
        ctx.stroke();
      });
      // Principal inertia axes
      ctx.strokeStyle = '#39FF70';
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + 85, cy - 28); ctx.stroke();
      ctx.strokeStyle = '#FF542E';
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx - 50, cy - 60); ctx.stroke();
    } else if (kind === 'crowd-flow') {
      // Continuum velocity divergence field
      for (let j = 0; j < 12; j++) {
        for (let i = 0; i < 18; i++) {
          const px = (i + 0.5) * (w / 18);
          const py = (j + 0.5) * (h / 12);
          const dx = px - w * 0.58;
          const dy = py - h * 0.5;
          const r = Math.hypot(dx, dy) + 18;
          const vx = -dx / r * 14;
          const vy = -dy / r * 14;
          const comp = r < 95;
          ctx.strokeStyle = comp ? '#FF542E' : '#39FF70';
          ctx.lineWidth = comp ? 1.6 : 1;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + vx, py + vy);
          ctx.stroke();
          ctx.fillStyle = ctx.strokeStyle;
          ctx.fillRect(px + vx - 1.5, py + vy - 1.5, 3, 3);
        }
      }
      ctx.strokeStyle = 'rgba(255, 84, 46, 0.55)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(w * 0.58, h * 0.5, 72, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    } else {
      // Spectral NLP morphing waveform
      [
        { color: '#315BFF', f: 0.032, a: 48, p: 0.2 },
        { color: '#39FF70', f: 0.055, a: 28, p: 1.4 },
        { color: '#C5C9CE', f: 0.018, a: 62, p: 2.3 }
      ].forEach((wcfg) => {
        ctx.strokeStyle = wcfg.color;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 4) {
          const y = h * 0.5 + Math.sin(x * wcfg.f + wcfg.p) * wcfg.a * Math.sin((x / w) * Math.PI);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
    }
  });
}
