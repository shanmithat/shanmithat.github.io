/**
 * Reusable Component Architecture (Task 6)
 * Exports: InstrumentIndex, FieldCanvas, TechnicalTicker, ProjectFile,
 * CaseStudyLayout, DataAnnotation, HalftoneImage, ScrapbookEntry,
 * ResearchRecord, SignalDivider, TransmissionFooter.
 */

export function InstrumentIndex({ activeEnv = '00', coordLabel = '13.08°N 80.27°E', ledTone = 'var(--phosphor)' } = {}) {
  const navItems = [
    { env: '00', label: 'UNIVERSE', href: 'index.html' },
    { env: '01', label: 'LABORATORY', href: 'archive.html' },
    { env: '02', label: 'SCRAPBOOK', href: 'beyond.html' },
    { env: '03', label: 'ARCHIVE', href: 'publications.html' },
    { env: '04', label: 'HORIZON', href: 'vision.html' },
    { env: '05', label: 'TRANSMISSION', href: 'contact.html' }
  ];

  const linksHtml = navItems
    .map(
      (n) =>
        `<li><a href="${n.href}" class="inst-link ${activeEnv === n.env ? 'active' : ''}" data-env="${n.env}"><span class="idx">${n.env}</span> ${n.label}</a></li>`
    )
    .join('');

  const mobileHtml = navItems
    .map(
      (n) =>
        `<a href="${n.href}" class="inst-link ${activeEnv === n.env ? 'active' : ''}" data-env="${n.env}"><span class="idx">${n.env}</span> ENV_${n.env} // ${n.label}</a>`
    )
    .join('');

  return `
    <header class="inst-header">
      <div class="inst-nav-inner">
        <a href="index.html" class="inst-brand">
          <span class="inst-led" style="background:${ledTone};box-shadow:0 0 6px ${ledTone};" aria-hidden="true"></span>
          <span>SHANMITHA T.</span>
          <span class="inst-coord-sub" style="color:var(--graphite-light);font-weight:400;">// ${coordLabel}</span>
        </a>
        <nav aria-label="Primary Instrument Navigation">
          <ul class="inst-links">${linksHtml}</ul>
        </nav>
        <div style="display:flex;align-items:center;gap:0.45rem;">
          <a href="res.pdf" class="inst-cv-btn" download="Shanmitha_T_CV.pdf" target="_blank" rel="noopener noreferrer">CV.PDF ↗</a>
          <button class="mobile-menu-btn" id="mobileMenuBtn" aria-expanded="false" aria-controls="mobileDrawer">MENU [≡]</button>
        </div>
      </div>
    </header>
    <div class="mobile-drawer" id="mobileDrawer" aria-label="Mobile Navigation">${mobileHtml}</div>
  `;
}

export function TechnicalTicker(items = []) {
  const defaultItems = [
    'SYS.ENV: COMPUTATIONAL_CYBERGRUNGE_03',
    'LOC: CHENNAI_INDIA [13.0827°N, 80.2707°E]',
    'INSTITUTION: VIT CHENNAI // B.TECH MECHANICAL ENGINEERING (2027)',
    'CASE_01: PEDIGAIT [C3D + PINN + 3D DIGITAL TWIN]',
    'CASE_02: BP-001-CIM [CAD + SIMPY + MICROWEAR-PINN]',
    'CASE_03: MICROWEAR-PINN [ARCHARD + ∇⁴Φ = 0 + ONNX]',
    'CASE_04: DYNAMESH-THERMAL [C++ / CUDA / cuSPARSE / CUB]',
    'CASE_05: AETHERCAST [PI-FNO // NEURIPS 2026 AI4SCIENCE REVIEW]',
    'CASE_06: IMPLICIT LATTICE [TPMS SDF // >140,000× REDUCTION]'
  ];
  const list = items.length ? items : defaultItems;
  const content = [...list, ...list].map((t) => `<span>▪ ${t}</span>`).join('');
  return `<div class="tech-ticker" aria-hidden="true"><div class="tech-ticker-track">${content}</div></div>`;
}

export function FieldCanvas({ canvasId = 'heroFieldCanvas', hudCoordId = 'hudCoord' } = {}) {
  return `
    <div class="hero-canvas-frame reticle">
      <canvas id="${canvasId}" aria-label="Interactive procedural green computational wireframe and vector convergence field"></canvas>
      <div class="field-hud-top">
        <span>FIELD_SOLVER // MULTI-SCALE PDE MESH</span>
        <span id="${hudCoordId}">ξ=0.040 η=0.040</span>
      </div>
      <div class="field-hud-bottom">
        <span>CURSOR = LOCAL POTENTIAL PERTURBATION</span>
        <div class="field-mode-switch" role="group" aria-label="Visualization mode">
          <button class="field-mode-btn active" data-mode="wireframe">WIREFRAME</button>
          <button class="field-mode-btn" data-mode="vector">VECTOR</button>
          <button class="field-mode-btn" data-mode="thermal">THERMAL</button>
        </div>
      </div>
    </div>
  `;
}

export function DataAnnotation(label, value = '') {
  return `<span class="data-annotation"><span>${label}</span>${value ? `<strong style="color:var(--silver-bright);">${value}</strong>` : ''}</span>`;
}

export function HalftoneImage({ src, alt, caption = '', treatment = 'tex-dither' }) {
  return `
    <figure class="fig-frame">
      <div class="halftone-img-wrap ${treatment}">
        <img src="${src}" alt="${alt}" loading="lazy">
      </div>
      ${caption ? `<figcaption class="fig-caption">${caption}</figcaption>` : ''}
    </figure>
  `;
}

export function SignalDivider(label) {
  return `<div class="signal-divider"><span>// ${label}</span></div>`;
}

export function ProjectFile(p) {
  const identityMap = {
    pedigait: 'telemetry',
    'bp001-cim': 'schematic',
    'microwear-pinn': 'darkroom',
    'dynamesh-thermal': 'matrix',
    aethercast: 'spectral',
    'implicit-lattice': 'blueprint'
  };
  const identity = identityMap[p.id] || 'telemetry';
  const treatment = p.tone === 'infrared' ? 'tex-infrared' : 'tex-dither';
  const eqLine = p.equations && p.equations[0] ? `<div class="case-eq-pill">${p.equations[0].label}</div>` : '';

  return `
    <article class="case-file" data-tone="${p.tone}" data-identity="${identity}">
      <div class="case-rail">
        <span class="case-num">${p.num}</span>
        <span class="case-status-v">${p.status.split('//')[0].trim()}</span>
      </div>
      <div class="case-body">
        <div>
          <div class="case-meta-line">
            <span>${p.domain}</span>
            <span>${p.status}</span>
          </div>
          <h3 class="case-title">${p.name}</h3>
          ${eqLine}
          <p class="case-summary">${p.summary}</p>
        </div>
        <div>
          <div class="case-stack">STACK // ${p.stack.join(' · ')}</div>
          <div class="case-actions">
            <a href="project.html?id=${p.id}" class="cmd-btn primary">OPEN CASE FILE →</a>
            ${p.repo ? `<a href="${p.repo}" target="_blank" rel="noopener noreferrer" class="cmd-btn">${p.repoLabel || 'SOURCE ↗'}</a>` : ''}
            ${p.demo ? `<a href="${p.demo}" target="_blank" rel="noopener noreferrer" class="cmd-btn">LIVE ↗</a>` : ''}
          </div>
        </div>
      </div>
      <div class="case-visual halftone-img-wrap ${p.previewImg ? treatment : ''}">
        ${
          p.previewImg
            ? `<img src="${p.previewImg}" alt="${p.name} visualization" loading="lazy">`
            : `<canvas data-procedural="${p.procedural}" aria-label="${p.name} procedural visualization"></canvas>`
        }
        <div class="case-visual-cap">
          <span>${p.previewCap}</span>
          <span>ID_${identity.toUpperCase()}</span>
        </div>
      </div>
    </article>
  `;
}

export function CaseStudyLayout(p, allProjects) {
  const treatment = p.tone === 'infrared' ? 'tex-infrared' : 'tex-dither';
  const switcher = allProjects
    .map(
      (item) =>
        `<a href="project.html?id=${item.id}" class="filter-tab ${item.id === p.id ? 'active' : ''}" style="border:1px solid var(--hairline-strong);">${item.num}</a>`
    )
    .join('');

  return `
    <div style="margin-bottom:1.25rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
      <a href="archive.html" class="cmd-btn">← BACK TO LABORATORY</a>
      <div style="display:flex;flex-wrap:wrap;gap:0.35rem;">${switcher}</div>
    </div>

    <div class="band-head">
      <div>
        <span class="env-code">CASE FILE ${p.num} // ${p.domain.toUpperCase()} // ${p.status}</span>
        <h1 class="env-title">${p.name}</h1>
        <p style="font-family:var(--font-mono);font-size:0.82rem;color:var(--tone);margin-top:0.45rem;">${p.subtitle}</p>
      </div>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
        ${p.repo ? `<a href="${p.repo}" target="_blank" rel="noopener noreferrer" class="cmd-btn primary">${p.repoLabel || 'REPOSITORY ↗'}</a>` : ''}
        ${p.demo ? `<a href="${p.demo}" target="_blank" rel="noopener noreferrer" class="cmd-btn">LIVE DEMO ↗</a>` : ''}
      </div>
    </div>

    <div class="dossier-grid">
      <aside class="dossier-sidebar reticle">
        <div style="font-family:var(--font-pixel);font-size:0.64rem;color:var(--tone);margin-bottom:0.85rem;">SPEC_SHEET</div>
        <div style="font-family:var(--font-mono);font-size:0.72rem;display:flex;flex-direction:column;gap:0.7rem;">
          <div><span style="color:var(--graphite-light);display:block;">CASE_ID</span><span style="color:var(--silver-bright);">CASE_${p.num}</span></div>
          <div><span style="color:var(--graphite-light);display:block;">DOMAINS</span><span style="color:var(--tone);">${p.domains.join(' · ')}</span></div>
          <div><span style="color:var(--graphite-light);display:block;">STATUS</span><span style="color:var(--silver-bright);">${p.status}</span></div>
          <div><span style="color:var(--graphite-light);display:block;">STACK</span><span style="color:var(--silver);line-height:1.5;">${p.stack.join(', ')}</span></div>
        </div>
      </aside>

      <div style="display:flex;flex-direction:column;gap:1.35rem;">
        <div class="frame" style="padding:1.35rem;">
          ${DataAnnotation('01 // ENGINEERING PROBLEM')}
          <p style="color:var(--silver-bright);line-height:1.7;margin-top:0.6rem;">${p.problem}</p>
        </div>

        <div class="frame" style="padding:1.35rem;">
          ${DataAnnotation('02 // PHYSICAL & DOMAIN FORMULATION')}
          <p style="color:var(--silver);line-height:1.7;margin-top:0.6rem;">${p.biomechanics}</p>
        </div>

        <div class="frame" style="padding:1.35rem;">
          ${DataAnnotation('03 // ARCHITECTURE & EQUATIONS')}
          <p style="color:var(--silver);line-height:1.7;margin-top:0.6rem;">${p.architecture}</p>
          ${p.equations
            .map(
              (eq) => `
            <div class="eq-block">
              <div class="eq-label">${eq.label}</div>
              <div class="katex-eq" data-tex="${eq.tex.replace(/"/g, '&quot;')}"></div>
            </div>
          `
            )
            .join('')}
        </div>

        <div class="frame" style="padding:1.35rem;">
          ${DataAnnotation('04 // VERIFICATION, RESULTS & LIMITATIONS')}
          <ul style="padding-left:1.15rem;display:flex;flex-direction:column;gap:0.55rem;color:var(--silver);margin-top:0.65rem;">
            ${p.results.map((r) => `<li>${r}</li>`).join('')}
          </ul>
        </div>

        <div>
          ${DataAnnotation('05 // VISUALIZATIONS (HOVER TO REVEAL RAW)')}
          ${
            p.figures.length > 0
              ? `<div class="fig-grid">${p.figures.map((f) => HalftoneImage({ src: f.src, alt: f.cap, caption: f.cap, treatment })).join('')}</div>`
              : `<div class="fig-frame" style="margin-top:0.75rem;"><canvas data-procedural="${p.procedural}" style="width:100%;max-height:360px;"></canvas><div class="fig-caption">${p.previewCap} // PROCEDURAL RENDER</div></div>`
          }
        </div>
      </div>
    </div>
  `;
}

export function ScrapbookEntry({ tag, title, body, span = 'col-4', accent = false }) {
  return `
    <article class="scrapbook-entry ${accent ? 'blue-top' : ''} ${span}">
      <div style="font-family:var(--font-mono);font-size:0.66rem;color:#5B7FFF;margin-bottom:0.4rem;">[${tag}]</div>
      <h3 style="font-family:var(--font-display);font-size:1.35rem;text-transform:uppercase;color:var(--silver-bright);margin-bottom:0.35rem;">${title}</h3>
      <p style="font-size:0.88rem;color:var(--silver);line-height:1.58;">${body}</p>
    </article>
  `;
}

export function ResearchRecord(pub, index) {
  return `
    <article class="research-record reticle">
      <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;font-family:var(--font-mono);font-size:0.7rem;color:var(--graphite-light);margin-bottom:0.45rem;">
        <span>RECORD_0${index + 1} // ${pub.year}</span>
        <span style="color:var(--silver-bright);">${pub.status}</span>
      </div>
      <h3 style="font-family:var(--font-display);font-size:1.65rem;color:var(--silver-bright);line-height:1.1;margin-bottom:0.45rem;">${pub.title}</h3>
      <div style="font-family:var(--font-mono);font-size:0.76rem;color:var(--silver);margin-bottom:0.3rem;">${pub.authors}</div>
      <div style="font-family:var(--font-mono);font-size:0.72rem;color:var(--graphite-light);margin-bottom:0.8rem;">
        ${pub.venue}${pub.doi ? ` · DOI: ${pub.doi}` : ''}
      </div>
      <p style="font-size:0.9rem;color:var(--silver);line-height:1.6;margin-bottom:0.9rem;">${pub.abstract}</p>
      <div style="display:flex;flex-wrap:wrap;gap:0.45rem;">
        ${pub.links.map((l) => `<a href="${l.url}" target="_blank" rel="noopener noreferrer" class="cmd-btn">${l.label} ↗</a>`).join('')}
        <button class="cmd-btn bib-btn" data-target="bib-${pub.id}">BIBTEX [+]</button>
      </div>
      <pre id="bib-${pub.id}" style="display:none;margin-top:0.8rem;padding:0.85rem;background:#040506;border:1px solid var(--hairline-strong);font-family:var(--font-mono);font-size:0.72rem;color:var(--silver);overflow-x:auto;">${pub.bibtex}</pre>
    </article>
  `;
}

export function TransmissionFooter() {
  return `
    <footer class="transmission-footer">
      <div class="shell-wrap" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
        <div>
          <span style="color:var(--phosphor);">END_OF_TRANSMISSION //</span>
          <strong style="color:var(--silver-bright);">SHANMITHA T.</strong> · VIT Chennai (2027) ·
          <a href="mailto:shanmithat3@gmail.com" style="color:var(--silver-bright);">shanmithat3@gmail.com</a>
        </div>
        <nav style="display:flex;flex-wrap:wrap;gap:1rem;" aria-label="Footer Navigation">
          <a href="index.html">00 UNIVERSE</a>
          <a href="archive.html">01 LABORATORY</a>
          <a href="beyond.html">02 SCRAPBOOK</a>
          <a href="publications.html">03 ARCHIVE</a>
          <a href="vision.html">04 HORIZON</a>
          <a href="contact.html">05 TRANSMISSION</a>
          <a href="res.pdf" download="Shanmitha_T_CV.pdf" target="_blank" rel="noopener noreferrer" style="color:#5B7FFF;">CV.PDF</a>
        </nav>
      </div>
    </footer>
  `;
}
