/**
 * Three.js + Custom GLSL Continuous Scroll-Scrubbed 3D Film Engine
 * Connects: Void/Nebula -> Physical Fields -> Earth -> Machines -> Computation -> Sound -> Symbiosis -> Cosmos
 */
export async function initCosmosFilm(canvasId, synth, onProgress) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;

  let THREE;
  try {
    THREE = await import('https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js');
  } catch (err) {
    console.warn('Three.js CDN unavailable, falling back to 2D cosmic canvas.', err);
    return null;
  }

  const isMobile = window.innerWidth < 768;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.75);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isMobile,
    powerPreference: 'high-performance',
    alpha: false
  });
  renderer.setPixelRatio(dpr);
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setClearColor(0x050816, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050816, 0.012);

  const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 260);
  camera.position.set(0, 0, 12);

  // --------------------------------------------------------------------------
  // 1. Volumetric GLSL Nebula Backdrop (Pinned to camera background)
  // --------------------------------------------------------------------------
  const nebulaUniforms = {
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uThermal: { value: 0 },
    uAudio: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uRes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
  };

  const nebulaMat = new THREE.ShaderMaterial({
    depthWrite: false,
    depthTest: false,
    uniforms: nebulaUniforms,
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
      uniform vec2 uMouse;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }
      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
        for (int i = 0; i < 4; i++) {
          v += a * noise(p);
          p = rot * p * 2.04;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = vUv - 0.5;
        vec2 m = (uMouse - 0.5) * 0.18;
        vec2 p = uv * 2.6 + vec2(uScroll * 1.4, uTime * 0.03) + m;

        float q = fbm(p);
        float r = fbm(p + q * 1.8 + vec2(uTime * 0.04, -uScroll * 0.8));
        float f = fbm(p + r * 1.5);

        vec3 midnight = vec3(0.020, 0.031, 0.086);   // #050816
        vec3 indigo   = vec3(0.090, 0.067, 0.231);   // #17113B
        vec3 electric = vec3(0.192, 0.357, 1.000);   // #315BFF
        vec3 violet   = vec3(0.537, 0.337, 1.000);   // #8956FF
        vec3 plasma   = vec3(0.753, 0.604, 1.000);   // #C09AFF
        vec3 infrared = vec3(1.000, 0.329, 0.180);   // #FF542E

        vec3 col = mix(midnight, indigo, smoothstep(0.18, 0.68, f));
        col = mix(col, electric * 0.75, smoothstep(0.45, 0.82, r) * 0.55);
        col = mix(col, violet * 0.8, smoothstep(0.58, 0.92, q * f * 1.6) * (0.42 + uAudio * 0.35));
        col += plasma * pow(max(0.0, f * r), 3.0) * 0.45;
        col = mix(col, col + infrared * 0.28 * smoothstep(0.55, 0.9, r), uThermal);

        // Subtle radial vignette
        float vig = 1.0 - dot(uv, uv) * 0.85;
        gl_FragColor = vec4(col * max(0.35, vig), 1.0);
      }
    `
  });

  const nebulaQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), nebulaMat);
  nebulaQuad.frustumCulled = false;
  nebulaQuad.renderOrder = -10;
  scene.add(nebulaQuad);

  // --------------------------------------------------------------------------
  // 2. Deep Starfield & Distant Spiral Galaxy
  // --------------------------------------------------------------------------
  const starCount = isMobile ? 900 : 2400;
  const starPos = new Float32Array(starCount * 3);
  const starCol = new Float32Array(starCount * 3);
  const cSilver = new THREE.Color(0xD8DCEB);
  const cPlasma = new THREE.Color(0xC09AFF);
  const cBlue = new THREE.Color(0x315BFF);

  for (let i = 0; i < starCount; i++) {
    starPos[i * 3] = (Math.random() - 0.5) * 90;
    starPos[i * 3 + 1] = (Math.random() - 0.5) * 65;
    starPos[i * 3 + 2] = 14 - Math.random() * 145;
    const pick = Math.random();
    const c = pick > 0.75 ? cPlasma : pick > 0.5 ? cBlue : cSilver;
    starCol[i * 3] = c.r;
    starCol[i * 3 + 1] = c.g;
    starCol[i * 3 + 2] = c.b;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));
  const starMat = new THREE.PointsMaterial({ size: 0.16, vertexColors: true, transparent: true, opacity: 0.88 });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  // --------------------------------------------------------------------------
  // 3. Chapter 01: Gravitational Orbital Rings & Field Torus (z = -18)
  // --------------------------------------------------------------------------
  const physicsGroup = new THREE.Group();
  physicsGroup.position.set(2.2, 0.2, -18);
  [3.4, 5.1, 6.8].forEach((radius, idx) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.02, 8, 96),
      new THREE.MeshBasicMaterial({ color: idx === 1 ? 0x8956FF : 0x315BFF, transparent: true, opacity: 0.58 })
    );
    ring.rotation.x = Math.PI * (0.35 + idx * 0.18);
    ring.rotation.y = idx * 0.5;
    physicsGroup.add(ring);
  });
  scene.add(physicsGroup);

  // --------------------------------------------------------------------------
  // 4. Chapter 02: Procedural GLSL Earth & Biosphere Wireframe (z = -42)
  // --------------------------------------------------------------------------
  const earthGroup = new THREE.Group();
  earthGroup.position.set(-1.6, -0.3, -42);

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

      float hash3(vec3 p) {
        return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
      }
      float noise3(vec3 x) {
        vec3 i = floor(x);
        vec3 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(mix(hash3(i), hash3(i+vec3(1,0,0)), f.x), mix(hash3(i+vec3(0,1,0)), hash3(i+vec3(1,1,0)), f.x), f.y),
          mix(mix(hash3(i+vec3(0,0,1)), hash3(i+vec3(1,0,1)), f.x), mix(hash3(i+vec3(0,1,1)), hash3(i+vec3(1,1,1)), f.x), f.y),
          f.z
        );
      }

      void main() {
        vec3 n = normalize(vPos);
        float continent = noise3(n * 3.2 + vec3(uTime * 0.02, 0.0, 0.0)) * 0.65 + noise3(n * 7.5) * 0.35;
        vec3 ocean = vec3(0.04, 0.08, 0.28);
        vec3 land  = vec3(0.19, 0.36, 0.95);
        vec3 col = mix(ocean, land, smoothstep(0.49, 0.56, continent));

        float fresnel = pow(1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.6);
        col += vec3(0.54, 0.34, 1.0) * fresnel * 1.15;
        gl_FragColor = vec4(col, 1.0);
      }
    `
  });

  const earthSphere = new THREE.Mesh(new THREE.SphereGeometry(3.8, isMobile ? 32 : 52, isMobile ? 24 : 38), earthMat);
  const earthWire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(4.05, 2),
    new THREE.MeshBasicMaterial({ color: 0xC09AFF, wireframe: true, transparent: true, opacity: 0.16 })
  );
  earthGroup.add(earthSphere, earthWire);
  scene.add(earthGroup);

  // --------------------------------------------------------------------------
  // 5. Chapter 03–04: Machinery Rings & Deformable Computational Mesh (z = -68)
  // --------------------------------------------------------------------------
  const machineGroup = new THREE.Group();
  machineGroup.position.set(1.8, 0, -68);

  const gearRing1 = new THREE.Mesh(
    new THREE.TorusGeometry(4.2, 0.14, 6, 36),
    new THREE.MeshBasicMaterial({ color: 0xFF542E, wireframe: true, transparent: true, opacity: 0.55 })
  );
  const gearRing2 = new THREE.Mesh(
    new THREE.TorusGeometry(2.8, 0.12, 6, 24),
    new THREE.MeshBasicMaterial({ color: 0x315BFF, wireframe: true, transparent: true, opacity: 0.72 })
  );
  const femCore = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.1, isMobile ? 1 : 2),
    new THREE.MeshBasicMaterial({ color: 0xC09AFF, wireframe: true, transparent: true, opacity: 0.62 })
  );
  machineGroup.add(gearRing1, gearRing2, femCore);
  scene.add(machineGroup);

  // --------------------------------------------------------------------------
  // 6. Chapter 05–06: Audio-Reactive Harmonic Knot & Symbiosis Horizon (z = -96)
  // --------------------------------------------------------------------------
  const soundGroup = new THREE.Group();
  soundGroup.position.set(-0.5, 0, -96);
  const harmonicKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(2.7, 0.65, isMobile ? 64 : 110, 14),
    new THREE.MeshBasicMaterial({ color: 0x8956FF, wireframe: true, transparent: true, opacity: 0.55 })
  );
  const horizonRing = new THREE.Mesh(
    new THREE.TorusGeometry(5.6, 0.03, 8, 96),
    new THREE.MeshBasicMaterial({ color: 0xFF542E, transparent: true, opacity: 0.48 })
  );
  horizonRing.rotation.x = 1.2;
  soundGroup.add(harmonicKnot, horizonRing);
  scene.add(soundGroup);

  // --------------------------------------------------------------------------
  // Pointer + Scroll Progress + Resize + Visibility Loop
  // --------------------------------------------------------------------------
  const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  window.addEventListener('pointermove', (e) => {
    mouse.tx = e.clientX / window.innerWidth;
    mouse.ty = e.clientY / window.innerHeight;
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
    nebulaUniforms.uRes.value.set(window.innerWidth, window.innerHeight);
  });

  let paused = false;
  document.addEventListener('visibilitychange', () => {
    paused = document.hidden;
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    if (paused) return;

    const dt = Math.min(clock.getDelta(), 0.05);
    const elapsed = clock.elapsedTime;
    const audio = synth ? synth.getMetrics(elapsed) : { bass: 0.2, mid: 0.2, high: 0.1, pulse: 0 };

    mouse.x += (mouse.tx - mouse.x) * 0.06;
    mouse.y += (mouse.ty - mouse.y) * 0.06;

    // Continuous scrubbed camera flight: z = +12 -> -108
    const targetZ = 12 - scrollProgress * 120;
    const targetX = Math.sin(scrollProgress * Math.PI * 3.0) * 1.4 + (mouse.x - 0.5) * 1.2;
    const targetY = Math.cos(scrollProgress * Math.PI * 2.0) * 0.65 - (mouse.y - 0.5) * 0.8;

    camera.position.z += (targetZ - camera.position.z) * 0.12;
    camera.position.x += (targetX - camera.position.x) * 0.08;
    camera.position.y += (targetY - camera.position.y) * 0.08;
    camera.lookAt(0, 0, camera.position.z - 16);

    // Uniforms
    nebulaUniforms.uTime.value = reducedMotion ? 0 : elapsed;
    nebulaUniforms.uScroll.value = scrollProgress;
    nebulaUniforms.uAudio.value = audio.bass;
    // Infrared tint peaks around Chapters 03-04 (scroll 0.35 -> 0.65)
    const thermalWindow = Math.max(0, 1 - Math.abs(scrollProgress - 0.48) * 4.5);
    nebulaUniforms.uThermal.value = thermalWindow;
    nebulaUniforms.uMouse.value.set(mouse.x, 1 - mouse.y);

    earthUniforms.uTime.value = elapsed;

    if (!reducedMotion) {
      stars.rotation.z = elapsed * 0.008;
      physicsGroup.rotation.y = elapsed * 0.18 + scrollProgress * 4;
      physicsGroup.rotation.z = elapsed * 0.09;

      earthGroup.rotation.y = elapsed * 0.12 + scrollProgress * 3;
      earthWire.rotation.y = -elapsed * 0.07;

      gearRing1.rotation.z = elapsed * 0.28 + scrollProgress * 8;
      gearRing2.rotation.z = -elapsed * 0.42 - scrollProgress * 10;
      femCore.rotation.x = elapsed * 0.22;
      femCore.rotation.y = elapsed * 0.31;
      const pulseScale = 1 + audio.bass * 0.18;
      femCore.scale.setScalar(pulseScale);

      harmonicKnot.rotation.x = elapsed * 0.2 + scrollProgress * 5;
      harmonicKnot.rotation.y = elapsed * 0.27;
      harmonicKnot.scale.setScalar(1 + audio.mid * 0.35 + audio.pulse * 0.15);
      horizonRing.rotation.z = elapsed * 0.14;
    }

    renderer.render(scene, camera);
  }

  animate();

  // GPU cleanup on unload
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
