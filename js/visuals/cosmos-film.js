/**
 * Three.js + Clean Sharp Cosmic Gradient Backdrop & Scroll-Scrubbed 3D Film Engine
 * Eliminates low-res FBM banding; shifts 3D focal geometry right so hero typography breathes.
 */
export async function initCosmosFilm(canvasId, synth, onProgress) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;

  let THREE;
  try {
    THREE = await import('https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js');
  } catch (err) {
    console.warn('Three.js CDN unavailable.', err);
    return null;
  }

  const isMobile = window.innerWidth < 768;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 2);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isMobile,
    powerPreference: 'high-performance',
    alpha: false
  });
  renderer.setPixelRatio(dpr);
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setClearColor(0x070913, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x070913, 0.011);

  const camera = new THREE.PerspectiveCamera(54, window.innerWidth / window.innerHeight, 0.1, 260);
  camera.position.set(0, 0, 12);

  // --------------------------------------------------------------------------
  // 1. Clean Sharp Dark Cosmic Gradient (#070913 -> #0D1226) + Subtle Radial Aura
  // --------------------------------------------------------------------------
  const bgUniforms = {
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uThermal: { value: 0 },
    uAudio: { value: 0 },
    uHover: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.7, 0.5) },
    uRes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
  };

  const bgMat = new THREE.ShaderMaterial({
    depthWrite: false,
    depthTest: false,
    uniforms: bgUniforms,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.9999, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform float uScroll;
      uniform float uThermal;
      uniform float uAudio;
      uniform float uHover;
      uniform vec2 uMouse;
      uniform vec2 uRes;

      void main() {
        vec3 deepNavy = vec3(0.024, 0.031, 0.068); // #060811
        vec3 indigo   = vec3(0.048, 0.068, 0.145); // #0D1226
        vec3 violet   = vec3(0.180, 0.110, 0.360);
        vec3 infrared = vec3(0.420, 0.110, 0.060);

        // Smooth vertical + radial analytical gradient
        float grad = smoothstep(0.0, 1.0, vUv.y * 0.7 + (1.0 - vUv.x) * 0.3);
        vec3 col = mix(deepNavy, indigo, grad);

        // Subtle off-center orbital halo on the right
        vec2 haloCenter = vec2(0.74, 0.52) + (uMouse - 0.5) * 0.06;
        float dist = length((vUv - haloCenter) * vec2(1.4, 1.0));
        float halo = exp(-dist * dist * 4.2) * (0.28 + uAudio * 0.18);
        col += violet * halo;

        // Subtle infrared warmth during thermal/manufacturing chapters
        float tHalo = exp(-dist * dist * 3.5) * 0.35 * uThermal;
        col += infrared * tHalo;

        // Prominent #060606 halftone dot matrix that shrinks upon pointer movement / hover
        float aspect = uRes.x / max(1.0, uRes.y);
        float dMouse = length((vUv - uMouse) * vec2(aspect, 1.0));
        float hoverZone = exp(-dMouse * dMouse * 16.0);
        float ripple = 0.5 + 0.5 * sin(dMouse * 32.0 - uTime * 2.5);

        vec2 px = vUv * uRes;
        float cell = 9.0;
        vec2 gridUv = fract(px / cell) - 0.5;
        float dDot = length(gridUv);

        // Prominent normally (0.36), shrinking down on pointer hover (to ~0.04)
        float normalRadius = 0.36 - grad * 0.04;
        float shrinkAmount = hoverZone * (0.28 + 0.03 * ripple + 0.05 * uHover);
        float radius = clamp(normalRadius - shrinkAmount, 0.03, 0.40);
        float dotMask = 1.0 - smoothstep(radius - 0.045, radius + 0.045, dDot);

        vec3 dotCol = vec3(0.0235, 0.0235, 0.0235); // #060606
        col = mix(col, dotCol, dotMask * 0.85);

        gl_FragColor = vec4(col, 1.0);
      }
    `
  });

  const bgQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMat);
  bgQuad.frustumCulled = false;
  bgQuad.renderOrder = -10;
  scene.add(bgQuad);

  // --------------------------------------------------------------------------
  // 2. Crisp High-Contrast Procedural Starfield
  // --------------------------------------------------------------------------
  const starCount = isMobile ? 1000 : 2800;
  const starPos = new Float32Array(starCount * 3);
  const starCol = new Float32Array(starCount * 3);
  const cWhite = new THREE.Color(0xF4F6FB);
  const cPlasma = new THREE.Color(0xC09AFF);
  const cBlue = new THREE.Color(0x315BFF);

  for (let i = 0; i < starCount; i++) {
    starPos[i * 3] = (Math.random() - 0.5) * 95;
    starPos[i * 3 + 1] = (Math.random() - 0.5) * 70;
    starPos[i * 3 + 2] = 14 - Math.random() * 145;
    const pick = Math.random();
    const c = pick > 0.82 ? cPlasma : pick > 0.62 ? cBlue : cWhite;
    starCol[i * 3] = c.r;
    starCol[i * 3 + 1] = c.g;
    starCol[i * 3 + 2] = c.b;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));
  const starMat = new THREE.PointsMaterial({ size: 0.14, vertexColors: true, transparent: true, opacity: 0.85 });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  // Right-shift offset so hero typography on the left has clean breathing room
  const xShift = isMobile ? 0.8 : 4.2;

  // --------------------------------------------------------------------------
  // 3. Chapter 00-01: Right-Framed Orbital Wireframe & Gravitational Rings
  // --------------------------------------------------------------------------
  const heroOrbGroup = new THREE.Group();
  heroOrbGroup.position.set(xShift, -0.2, -3);

  const heroSphere = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.65, 2),
    new THREE.MeshBasicMaterial({ color: 0x315BFF, wireframe: true, transparent: true, opacity: 0.34 })
  );
  const heroRing1 = new THREE.Mesh(
    new THREE.TorusGeometry(3.8, 0.018, 8, 96),
    new THREE.MeshBasicMaterial({ color: 0x8956FF, transparent: true, opacity: 0.52 })
  );
  heroRing1.rotation.x = 1.15;
  heroRing1.rotation.y = 0.35;

  const heroRing2 = new THREE.Mesh(
    new THREE.TorusGeometry(4.7, 0.014, 8, 96),
    new THREE.MeshBasicMaterial({ color: 0xC09AFF, transparent: true, opacity: 0.28 })
  );
  heroRing2.rotation.x = 0.65;
  heroRing2.rotation.y = -0.45;
  heroOrbGroup.add(heroSphere, heroRing1, heroRing2);
  scene.add(heroOrbGroup);

  // --------------------------------------------------------------------------
  // 4. Chapter 02: Procedural GLSL Earth & Biosphere Wireframe (z = -40)
  // --------------------------------------------------------------------------
  const earthGroup = new THREE.Group();
  earthGroup.position.set(isMobile ? 0 : 2.8, -0.2, -40);

  const earthUniforms = { uTime: { value: 0 } };
  const earthMat = new THREE.ShaderMaterial({
    uniforms: earthUniforms,
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPos;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      varying vec3 vNormal;
      varying vec3 vPos;
      uniform float uTime;

      float hash3(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453); }
      float noise3(vec3 x) {
        vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(mix(hash3(i), hash3(i+vec3(1,0,0)), f.x), mix(hash3(i+vec3(0,1,0)), hash3(i+vec3(1,1,0)), f.x), f.y),
          mix(mix(hash3(i+vec3(0,0,1)), hash3(i+vec3(1,0,1)), f.x), mix(hash3(i+vec3(0,1,1)), hash3(i+vec3(1,1,1)), f.x), f.y),
          f.z
        );
      }
      void main() {
        vec3 n = normalize(vPos);
        float c = noise3(n * 3.4 + vec3(uTime * 0.02, 0.0, 0.0)) * 0.65 + noise3(n * 7.8) * 0.35;
        vec3 col = mix(vec3(0.03, 0.05, 0.18), vec3(0.15, 0.28, 0.78), smoothstep(0.49, 0.56, c));
        float fresnel = pow(1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.8);
        col += vec3(0.54, 0.34, 1.0) * fresnel * 1.1;
        gl_FragColor = vec4(col, 1.0);
      }
    `
  });

  const earthSphere = new THREE.Mesh(new THREE.SphereGeometry(3.4, isMobile ? 32 : 48, isMobile ? 24 : 36), earthMat);
  const earthWire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(3.65, 2),
    new THREE.MeshBasicMaterial({ color: 0xC09AFF, wireframe: true, transparent: true, opacity: 0.14 })
  );
  earthGroup.add(earthSphere, earthWire);
  scene.add(earthGroup);

  // --------------------------------------------------------------------------
  // 5. Chapter 03–04: Machinery Rings & Computational Mesh (z = -68)
  // --------------------------------------------------------------------------
  const machineGroup = new THREE.Group();
  machineGroup.position.set(isMobile ? 0 : 3.2, 0, -68);

  const gearRing1 = new THREE.Mesh(
    new THREE.TorusGeometry(4.0, 0.12, 6, 36),
    new THREE.MeshBasicMaterial({ color: 0xFF542E, wireframe: true, transparent: true, opacity: 0.48 })
  );
  const gearRing2 = new THREE.Mesh(
    new THREE.TorusGeometry(2.6, 0.1, 6, 24),
    new THREE.MeshBasicMaterial({ color: 0x315BFF, wireframe: true, transparent: true, opacity: 0.62 })
  );
  const femCore = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.9, isMobile ? 1 : 2),
    new THREE.MeshBasicMaterial({ color: 0xC09AFF, wireframe: true, transparent: true, opacity: 0.52 })
  );
  machineGroup.add(gearRing1, gearRing2, femCore);
  scene.add(machineGroup);

  // --------------------------------------------------------------------------
  // 6. Chapter 05–06: Audio-Reactive Harmonic Knot & Symbiosis Horizon (z = -96)
  // --------------------------------------------------------------------------
  const soundGroup = new THREE.Group();
  soundGroup.position.set(isMobile ? 0 : 2.6, 0, -96);
  const harmonicKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(2.5, 0.58, isMobile ? 64 : 110, 14),
    new THREE.MeshBasicMaterial({ color: 0x8956FF, wireframe: true, transparent: true, opacity: 0.48 })
  );
  const horizonRing = new THREE.Mesh(
    new THREE.TorusGeometry(5.2, 0.025, 8, 96),
    new THREE.MeshBasicMaterial({ color: 0xFF542E, transparent: true, opacity: 0.42 })
  );
  horizonRing.rotation.x = 1.2;
  soundGroup.add(harmonicKnot, horizonRing);
  scene.add(soundGroup);

  // --------------------------------------------------------------------------
  // Pointer + Scroll + Visibility
  // --------------------------------------------------------------------------
  const mouse = { x: 0.7, y: 0.5, tx: 0.7, ty: 0.5, hover: 0, hoverTarget: 0 };
  window.addEventListener('pointermove', (e) => {
    mouse.tx = e.clientX / window.innerWidth;
    mouse.ty = e.clientY / window.innerHeight;
  });

  const hoverSel = 'a, button, .proj-visual, .void-tag, .stat-item, .ch-heading, .void-name, .ch-serif-quote, .annot';
  document.addEventListener('pointerover', (e) => {
    if (e.target && e.target.closest && e.target.closest(hoverSel)) mouse.hoverTarget = 1;
  });
  document.addEventListener('pointerout', (e) => {
    if (e.target && e.target.closest && e.target.closest(hoverSel)) mouse.hoverTarget = 0;
  });

  let scrollProgress = 0;
  function updateScrollProgress() {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    scrollProgress = Math.max(0, Math.min(1, window.scrollY / max));
    if (onProgress) onProgress(scrollProgress);
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    bgUniforms.uRes.value.set(window.innerWidth, window.innerHeight);
  });

  let paused = false;
  document.addEventListener('visibilitychange', () => { paused = document.hidden; });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    if (paused) return;

    const elapsed = clock.elapsedTime;
    const audio = synth ? synth.getMetrics(elapsed) : { bass: 0.2, mid: 0.2, high: 0.1, pulse: 0 };

    mouse.x += (mouse.tx - mouse.x) * 0.06;
    mouse.y += (mouse.ty - mouse.y) * 0.06;
    mouse.hover += (mouse.hoverTarget - mouse.hover) * 0.1;

    const targetZ = 12 - scrollProgress * 120;
    const targetX = Math.sin(scrollProgress * Math.PI * 2.5) * 0.85 + (mouse.x - 0.5) * 0.8;
    const targetY = Math.cos(scrollProgress * Math.PI * 2.0) * 0.45 - (mouse.y - 0.5) * 0.55;

    camera.position.z += (targetZ - camera.position.z) * 0.12;
    camera.position.x += (targetX - camera.position.x) * 0.08;
    camera.position.y += (targetY - camera.position.y) * 0.08;
    camera.lookAt(0, 0, camera.position.z - 18);

    bgUniforms.uTime.value = reducedMotion ? 0 : elapsed;
    bgUniforms.uScroll.value = scrollProgress;
    bgUniforms.uAudio.value = audio.bass;
    bgUniforms.uHover.value = mouse.hover;
    bgUniforms.uThermal.value = Math.max(0, 1 - Math.abs(scrollProgress - 0.48) * 4.5);
    bgUniforms.uMouse.value.set(mouse.x, 1 - mouse.y);
    earthUniforms.uTime.value = elapsed;

    if (!reducedMotion) {
      stars.rotation.z = elapsed * 0.006;
      heroOrbGroup.rotation.y = elapsed * 0.14 + scrollProgress * 3.5;
      heroRing1.rotation.z = elapsed * 0.18;
      heroRing2.rotation.z = -elapsed * 0.12;

      earthGroup.rotation.y = elapsed * 0.12 + scrollProgress * 3;
      earthWire.rotation.y = -elapsed * 0.07;

      gearRing1.rotation.z = elapsed * 0.26 + scrollProgress * 8;
      gearRing2.rotation.z = -elapsed * 0.38 - scrollProgress * 10;
      femCore.rotation.x = elapsed * 0.2;
      femCore.rotation.y = elapsed * 0.28;
      femCore.scale.setScalar(1 + audio.bass * 0.16);

      harmonicKnot.rotation.x = elapsed * 0.2 + scrollProgress * 5;
      harmonicKnot.rotation.y = elapsed * 0.26;
      harmonicKnot.scale.setScalar(1 + audio.mid * 0.32 + audio.pulse * 0.14);
      horizonRing.rotation.z = elapsed * 0.14;
    }

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('beforeunload', () => {
    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    });
    renderer.dispose();
  });

  return { renderer, scene, camera };
}
