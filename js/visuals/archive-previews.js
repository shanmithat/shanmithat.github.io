/**
 * Procedural Canvas Renderers for Case Files Without Static Screenshots
 */
export function renderProceduralPreviews(root = document) {
  const canvases = root.querySelectorAll('canvas[data-procedural]');
  canvases.forEach((canvas) => {
    const kind = canvas.dataset.procedural;
    const ctx = canvas.getContext('2d');
    const w = (canvas.width = 480);
    const h = (canvas.height = 290);

    ctx.fillStyle = '#050606';
    ctx.fillRect(0, 0, w, h);

    if (kind === 'dynamesh') {
      // SIMP Thermal-Fluid Topology: branched fluid channels + thermal contour
      const nx = 48, ny = 29;
      const cw = w / nx, ch = h / ny;
      for (let j = 0; j < ny; j++) {
        for (let i = 0; i < nx; i++) {
          const x = i / nx;
          const y = (j - ny / 2) / (ny / 2);
          // Branched manifold density
          const trunk = Math.exp(-Math.pow(y, 2) * 18) * (1 - x * 0.4);
          const branch1 = Math.exp(-Math.pow(y - 0.42 * Math.sin(x * 3.1), 2) * 28) * x;
          const branch2 = Math.exp(-Math.pow(y + 0.42 * Math.sin(x * 3.1), 2) * 28) * x;
          const fluid = Math.min(1, trunk + branch1 + branch2);
          const heat = (1 - fluid) * (0.35 + 0.65 * x);

          if (fluid > 0.45) {
            ctx.fillStyle = `rgba(49, 91, 255, ${0.35 + fluid * 0.55})`;
          } else if (heat > 0.55) {
            ctx.fillStyle = `rgba(255, 84, 46, ${0.28 + heat * 0.6})`;
          } else {
            ctx.fillStyle = `rgba(57, 255, 112, ${0.12 + heat * 0.25})`;
          }
          ctx.fillRect(i * cw, j * ch, cw - 1, ch - 1);
        }
      }
      // Velocity streamlines
      ctx.strokeStyle = '#39FF70';
      ctx.lineWidth = 1.2;
      [-0.36, 0, 0.36].forEach((off) => {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 8) {
          const t = x / w;
          const y = h * 0.5 + off * h * 0.52 * Math.sin(t * 3.1);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
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
