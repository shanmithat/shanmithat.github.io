/**
 * SHANMITHA T. — RESEARCH PORTFOLIO INTERACTIVITY ENGINE
 * Features:
 * 1. Mobile navigation drawer with keyboard and focus trap handling
 * 2. Ultra-lightweight deep-ocean/cosmic ambient particle & wave canvas
 * 3. Filterable project and research cards
 * 4. BibTeX citation drawer & one-click clipboard copy
 * 5. High-performance, zero-framework, accessible interaction
 */

(function () {
  'use strict';

  // --- 1. Mobile Navigation Drawer ---
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');

  if (mobileToggle && mobileNavDrawer) {
    mobileToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = mobileNavDrawer.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      mobileToggle.innerHTML = isOpen ? '✕ Close' : '☰ Menu';
    });

    document.addEventListener('click', function (e) {
      if (mobileNavDrawer.classList.contains('open') && !mobileNavDrawer.contains(e.target) && e.target !== mobileToggle) {
        mobileNavDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.innerHTML = '☰ Menu';
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNavDrawer.classList.contains('open')) {
        mobileNavDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.innerHTML = '☰ Menu';
        mobileToggle.focus();
      }
    });
  }

  // --- 2. Interactive Deep-Ocean & Cosmic Ambient Canvas ---
  const canvas = document.getElementById('ambientCanvas');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = Math.min(canvas.parentElement.offsetHeight, 540));
    let animationFrameId;
    let isVisible = true;
    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    const resize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = Math.min(canvas.parentElement.offsetHeight, 540);
    };

    window.addEventListener('resize', resize, { passive: true });

    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      if (e.clientY <= rect.bottom && e.clientY >= rect.top) {
        mouse.targetX = e.clientX - rect.left;
        mouse.targetY = e.clientY - rect.top;
      }
    }, { passive: true });

    // Starlight particles representing discrete physical nodes / spectral modes
    const particleCount = Math.min(48, Math.floor(width / 24));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.6 + 0.8,
      alpha: Math.random() * 0.4 + 0.2
    }));

    let phase = 0;

    const render = () => {
      if (!isVisible) return;

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
      phase += 0.008;

      // Ideological Atmospheric Transport Plume around Cursor (Purple-Blue-Green ALONE)
      const plumeGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 240);
      plumeGrad.addColorStop(0, 'rgba(139, 92, 246, 0.16)');    // Violet/Purple core
      plumeGrad.addColorStop(0.3, 'rgba(59, 130, 246, 0.12)');  // Royal blue transition
      plumeGrad.addColorStop(0.65, 'rgba(16, 185, 129, 0.08)'); // Emerald dispersion
      plumeGrad.addColorStop(0.9, 'rgba(5, 150, 105, 0.03)');   // Deep teal boundary
      plumeGrad.addColorStop(1.0, 'rgba(3, 5, 13, 0)');
      ctx.fillStyle = plumeGrad;
      ctx.fillRect(0, 0, width, height);

      // Ideological Transport Streamlines (Pure Purple-Blue-Green Colormap)
      const waveLayers = [
        { amp: 22, freq: 0.0035, speed: 1.0, width: 2.0 },
        { amp: 30, freq: 0.0025, speed: 0.7, width: 1.5 },
        { amp: 16, freq: 0.0055, speed: 1.4, width: 1.2 }
      ];

      // Multi-stop continuous scientific transport colormap (Purple -> Blue -> Green)
      const waveGrad = ctx.createLinearGradient(0, 0, width, 0);
      waveGrad.addColorStop(0.0, 'rgba(124, 58, 237, 0.28)');   // Deep purple
      waveGrad.addColorStop(0.32, 'rgba(59, 130, 246, 0.35)');  // Royal blue
      waveGrad.addColorStop(0.68, 'rgba(14, 165, 233, 0.30)');  // Sapphire
      waveGrad.addColorStop(0.88, 'rgba(16, 185, 129, 0.32)');  // Emerald green
      waveGrad.addColorStop(1.0, 'rgba(52, 211, 153, 0.25)');   // Mint green

      waveLayers.forEach((w, layerIdx) => {
        ctx.beginPath();
        ctx.strokeStyle = waveGrad;
        ctx.lineWidth = w.width;

        for (let x = 0; x <= width; x += 6) {
          const distToMouse = Math.abs(x - mouse.x);
          const mouseDisplacement = distToMouse < 240 ? Math.cos((distToMouse / 240) * (Math.PI / 2)) * 16 : 0;
          const y = (height * 0.52) + 
                    Math.sin(x * w.freq + phase * w.speed + layerIdx * 1.5) * w.amp + 
                    mouseDisplacement;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      // Update & render scalar tracer particles colored by spatial Purple-Blue-Green colormap
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Dynamic scalar colormap based on normalized horizontal domain position
        const normX = p.x / width;
        let pColor;
        if (normX < 0.35) pColor = `rgba(167, 139, 250, ${p.alpha * 1.3})`;      // Lavender/Purple
        else if (normX < 0.70) pColor = `rgba(96, 165, 250, ${p.alpha * 1.3})`;  // Royal Blue
        else pColor = `rgba(52, 211, 153, ${p.alpha * 1.3})`;                    // Emerald/Mint Green

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = pColor;
        ctx.fill();

        // Connect nearby points to form subtle computational lattice mesh
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 85) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(59, 130, 246, ${(1 - dist / 85) * 0.2})`;
            ctx.lineWidth = 0.75;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Pause rendering when canvas is out of viewport to preserve 100% CPU/GPU performance
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = requestAnimationFrame(render);
        } else {
          cancelAnimationFrame(animationFrameId);
        }
      });
    }, { threshold: 0.05 });

    observer.observe(canvas);
  }

  // --- 3. Filterable Card Tabs (Experience & Research) ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const filterCards = document.querySelectorAll('[data-category]');

  if (filterButtons.length > 0 && filterCards.length > 0) {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const targetCategory = btn.getAttribute('data-filter');

        filterCards.forEach((card) => {
          const cardCategories = card.getAttribute('data-category').split(' ');
          if (targetCategory === 'all' || cardCategories.includes(targetCategory)) {
            card.style.display = '';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- 4. BibTeX Citation Drawer & Copy Handler ---
  window.toggleBibtex = function (id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.toggle('open');
    }
  };

  window.copyBibtex = function (btn, textId) {
    const textEl = document.getElementById(textId);
    if (!textEl) return;

    const citation = textEl.innerText.trim();
    navigator.clipboard.writeText(citation).then(() => {
      const originalText = btn.innerText;
      btn.innerText = '✓ Copied to clipboard';
      btn.style.background = '#0284c7';
      btn.style.color = '#ffffff';

      setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = '';
        btn.style.color = '';
      }, 2000);
    }).catch((err) => {
      console.error('Failed to copy BibTeX: ', err);
    });
  };

  // --- 5. Email Copy Helper ---
  window.copyEmail = function (btn, email) {
    navigator.clipboard.writeText(email).then(() => {
      const originalHtml = btn.innerHTML;
      btn.innerHTML = '<span>✓ Copied: ' + email + '</span>';
      setTimeout(() => {
        btn.innerHTML = originalHtml;
      }, 2200);
    });
  };

})();
