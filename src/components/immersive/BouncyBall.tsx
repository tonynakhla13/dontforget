"use client";

/**
 * BouncyBall
 *
 * Full-screen Three.js background for the Work page. A holographic wireframe
 * ball drifts DVD-logo style and ricochets off all four screen borders. Every
 * border crash is an *event*:
 *   • squash-and-stretch + jump to the next neon colour
 *   • the ball sheds 2–3 mini wireframe balls that drift off and keep floating,
 *     bouncing gently around the viewport (a bounded, self-recycling pool)
 *   • a spray of additive spark particles bursts off the contact point
 *   • a shockwave ring pulses out along the wall
 * No floor / no contact shadow — everything floats free across the viewport.
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ─── neon palette — advances one step on every border bounce ─── */
const PALETTE = [
  0x46ae22, // NOX green
  0x6aee4e, // bright lime
  0x14e0c8, // teal
  0x2bb8ff, // sky
  0x6a7bff, // indigo
  0xb14bff, // violet
  0xff5bd1, // magenta
  0xff8a3d, // amber
  0xffe14b, // gold
];

function lineMat(color: number, opacity: number) {
  return new THREE.LineBasicMaterial({
    color, transparent: true, opacity,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
}

function pointMat(color: number, opacity: number, size: number) {
  return new THREE.PointsMaterial({
    color, transparent: true, opacity, size,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
  });
}

function icoWire(r: number, detail: number, m: THREE.Material) {
  const geo  = new THREE.IcosahedronGeometry(r, detail);
  const wire = new THREE.LineSegments(new THREE.WireframeGeometry(geo), m);
  geo.dispose();
  return wire;
}

export default function BouncyBall() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    /* renderer */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0, 0);
    mount.appendChild(renderer.domElement);

    /* scene + camera (looks straight at origin so screen bounds stay symmetric) */
    const scene  = new THREE.Scene();
    const CAM_Z  = 8;
    const VFOV   = 46;
    const camera = new THREE.PerspectiveCamera(VFOV, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, CAM_Z);
    camera.lookAt(0, 0, 0);

    const isMobile  = window.innerWidth < 900;
    const baseScale = isMobile ? 0.7 : 1.0;
    const RBASE     = 1.15;                 // wireframe radius (pre-scale)
    const R         = RBASE * baseScale;    // effective world radius

    /* ── ball rig: `rig` does the bounce + squash, `ball` spins ── */
    const rig  = new THREE.Group();
    const ball = new THREE.Group();

    const outer = icoWire(RBASE,        1, lineMat(PALETTE[0], 0.22));
    const inner = icoWire(RBASE * 0.62, 1, lineMat(PALETTE[0], 0.26));
    const core  = icoWire(RBASE * 0.28, 2, lineMat(PALETTE[0], 0.38));

    const dotsGeo = new THREE.IcosahedronGeometry(RBASE, 1);
    const dots = new THREE.Points(dotsGeo, pointMat(PALETTE[0], 0.4, 0.045));

    const body = new THREE.Mesh(
      new THREE.SphereGeometry(RBASE * 0.96, 32, 24),
      new THREE.MeshBasicMaterial({
        color: PALETTE[0], transparent: true, opacity: 0.02,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }),
    );

    ball.add(outer, inner, core, dots, body);
    rig.add(ball);
    rig.scale.setScalar(baseScale);
    scene.add(rig);

    /* ── colour cycling ── */
    const mats: { color: THREE.Color }[] = [
      outer.material as THREE.LineBasicMaterial,
      inner.material as THREE.LineBasicMaterial,
      core.material  as THREE.LineBasicMaterial,
      dots.material  as THREE.PointsMaterial,
      body.material  as THREE.MeshBasicMaterial,
    ];
    let colorIdx = 0;
    const cycleColor = () => {
      colorIdx = (colorIdx + 1) % PALETTE.length;
      for (const m of mats) m.color.set(PALETTE[colorIdx]);
    };

    const tmpCol = new THREE.Color();

    /* ════════════ spark-particle system (pooled THREE.Points) ════════════ */
    const MAXP  = 360;
    const pPos  = new Float32Array(MAXP * 3);
    const pCol  = new Float32Array(MAXP * 3);
    const pVel  = new Float32Array(MAXP * 3);
    const pLife = new Float32Array(MAXP);   // remaining, 1 → 0
    const pSpan = new Float32Array(MAXP);   // total lifespan (s)
    const pSize = new Float32Array(MAXP);
    for (let i = 0; i < MAXP; i++) pPos[i * 3 + 2] = -999;

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute("aColor",   new THREE.BufferAttribute(pCol, 3));
    pGeo.setAttribute("aLife",    new THREE.BufferAttribute(pLife, 1));
    pGeo.setAttribute("aSize",    new THREE.BufferAttribute(pSize, 1));

    const particleMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        attribute float aLife;
        attribute float aSize;
        attribute vec3  aColor;
        varying float vLife;
        varying vec3  vColor;
        void main() {
          vLife = aLife;
          vColor = aColor;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          float persp = 360.0 / max(0.001, -mv.z);
          gl_PointSize = aSize * persp * (0.35 + 0.65 * clamp(vLife, 0.0, 1.0));
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        precision mediump float;
        varying float vLife;
        varying vec3  vColor;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          float mask = smoothstep(0.5, 0.0, d);
          if (mask <= 0.001) discard;
          gl_FragColor = vec4(vColor, mask * clamp(vLife, 0.0, 1.0) * 0.5);
        }
      `,
    });
    const points = new THREE.Points(pGeo, particleMat);
    points.frustumCulled = false;
    scene.add(points);

    let pCursor = 0;
    const spawnBurst = (x: number, y: number, nx: number, ny: number, count: number, hex: number) => {
      tmpCol.set(hex);
      for (let k = 0; k < count; k++) {
        const idx = pCursor; pCursor = (pCursor + 1) % MAXP;
        const i3 = idx * 3;
        // direction: inward normal (nx,ny) widened into a cone + a kick toward camera
        let vx = nx + (Math.random() - 0.5) * 1.25;
        let vy = ny + (Math.random() - 0.5) * 1.25;
        const len = Math.hypot(vx, vy) || 1;
        const speed = 1.7 + Math.random() * 3.2;
        vx = (vx / len) * speed;
        vy = (vy / len) * speed;
        pPos[i3]     = x; pPos[i3 + 1] = y; pPos[i3 + 2] = (Math.random() - 0.5) * 0.35;
        pVel[i3]     = vx; pVel[i3 + 1] = vy; pVel[i3 + 2] = (Math.random() * 0.9 + 0.1) * 2.2;
        pCol[i3]     = tmpCol.r; pCol[i3 + 1] = tmpCol.g; pCol[i3 + 2] = tmpCol.b;
        pLife[idx]   = 1;
        pSpan[idx]   = 0.55 + Math.random() * 0.65;
        pSize[idx]   = 3 + Math.random() * 6;
      }
    };
    const updateParticles = (dt: number) => {
      for (let i = 0; i < MAXP; i++) {
        if (pLife[i] <= 0) continue;
        const i3 = i * 3;
        pVel[i3 + 1] -= 1.5 * dt;                 // gentle gravity
        const drag = Math.exp(-dt * 1.5);
        pVel[i3] *= drag; pVel[i3 + 1] *= drag; pVel[i3 + 2] *= drag;
        pPos[i3]     += pVel[i3]     * dt;
        pPos[i3 + 1] += pVel[i3 + 1] * dt;
        pPos[i3 + 2] += pVel[i3 + 2] * dt;
        pLife[i]     -= dt / pSpan[i];
        if (pLife[i] <= 0) { pLife[i] = 0; pPos[i3 + 2] = -999; }
      }
      pGeo.attributes.position.needsUpdate = true;
      pGeo.attributes.aColor.needsUpdate   = true;
      pGeo.attributes.aLife.needsUpdate    = true;
      pGeo.attributes.aSize.needsUpdate    = true;
    };

    /* ════════════ mini-ball shards (pool) — split off and keep floating ═══════
       Each border crash sheds 2–3 mini wireframe balls. Instead of fading or
       being re-absorbed, they drift gently and bounce off the screen edges, so a
       small population of shards stays floating across the viewport. The pool is
       bounded: once full, a fresh split recycles the oldest shard. */
    type Mini = {
      obj: THREE.LineSegments; mat: THREE.LineBasicMaterial;
      active: boolean; seq: number; popT: number; base: number;
      vel: THREE.Vector3; spin: THREE.Vector3;
    };
    const MINI_R = RBASE * 0.32 * baseScale;
    const MINI_POOL = 10;
    const MINIS: Mini[] = [];
    for (let i = 0; i < MINI_POOL; i++) {
      const mat = lineMat(PALETTE[0], 0.42);
      const obj = icoWire(MINI_R, 1, mat);
      obj.visible = false;
      scene.add(obj);
      MINIS.push({
        obj, mat, active: false, seq: 0, popT: 0, base: 1,
        vel: new THREE.Vector3(), spin: new THREE.Vector3(),
      });
    }
    let miniSeq = 0;
    const activateMini = (m: Mini, x: number, y: number, ang: number, hex: number) => {
      const sp = 0.45 + Math.random() * 0.5;            // gentle float speed
      m.active = true; m.obj.visible = true;
      m.seq = ++miniSeq;
      m.mat.color.set(hex);
      m.obj.position.set(x, y, (Math.random() - 0.5) * 0.3);
      m.obj.scale.setScalar(0.01);
      m.vel.set(Math.cos(ang) * sp, Math.sin(ang) * sp, (Math.random() - 0.5) * 0.2);
      m.spin.set((Math.random() - 0.5) * 2.2, (Math.random() - 0.5) * 2.2, (Math.random() - 0.5) * 2.2);
      m.popT = 0;
      m.base = 0.7 + Math.random() * 0.5;
    };
    const spawnSplit = (x: number, y: number, nx: number, ny: number, hex: number) => {
      const want = 2 + (Math.random() < 0.5 ? 1 : 0);   // 2 or 3 shards
      for (let n = 0; n < want; n++) {
        const ang = Math.atan2(ny, nx) + (Math.random() - 0.5) * 1.5;
        // reuse a free shard, otherwise recycle the oldest active one
        let target = MINIS.find((m) => !m.active);
        if (!target) target = MINIS.reduce((a, b) => (a.seq <= b.seq ? a : b));
        activateMini(target, x, y, ang, hex);
      }
    };
    const updateMinis = (dt: number) => {
      const bx = Math.max(0.2, halfW - MINI_R);         // keep them on screen
      const by = Math.max(0.2, halfH - MINI_R);
      for (const m of MINIS) {
        if (!m.active) continue;
        const p = m.obj.position;
        p.x += m.vel.x * dt; p.y += m.vel.y * dt; p.z += m.vel.z * dt;
        // soft reflect off the viewport edges → they stay floating in-frame
        if (p.x >  bx) { p.x =  bx; m.vel.x = -Math.abs(m.vel.x); }
        else if (p.x < -bx) { p.x = -bx; m.vel.x =  Math.abs(m.vel.x); }
        if (p.y >  by) { p.y =  by; m.vel.y = -Math.abs(m.vel.y); }
        else if (p.y < -by) { p.y = -by; m.vel.y =  Math.abs(m.vel.y); }
        m.vel.z += (0 - p.z) * dt * 0.5;                 // ease back toward the plane
        m.vel.z *= Math.exp(-dt * 0.8);
        m.obj.rotation.x += m.spin.x * dt;
        m.obj.rotation.y += m.spin.y * dt;
        m.obj.rotation.z += m.spin.z * dt;
        m.popT = Math.min(1, m.popT + dt / 0.3);         // pop-in, then hold steady
        const ease = 1 - Math.pow(1 - m.popT, 3);        // easeOutCubic
        m.obj.scale.setScalar(m.base * ease);
        m.mat.opacity = 0.42 * ease;
      }
    };

    /* ════════════ shockwave rings (pool) ════════════ */
    type Ring = { obj: THREE.Mesh; mat: THREE.MeshBasicMaterial; active: boolean; life: number };
    const ringGeo = new THREE.RingGeometry(0.86, 1.0, 56);
    const RINGS: Ring[] = [];
    for (let i = 0; i < 5; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: PALETTE[0], transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
      });
      const obj = new THREE.Mesh(ringGeo, mat);
      obj.visible = false;
      scene.add(obj);
      RINGS.push({ obj, mat, active: false, life: 0 });
    }
    const spawnRing = (x: number, y: number, hex: number) => {
      for (const r of RINGS) {
        if (r.active) continue;
        r.active = true; r.obj.visible = true;
        r.mat.color.set(hex);
        r.obj.position.set(x, y, 0);
        r.obj.scale.setScalar(0.12);
        r.life = 1;
        return;
      }
    };
    const updateRings = (dt: number) => {
      for (const r of RINGS) {
        if (!r.active) continue;
        r.life -= dt / 0.5;
        if (r.life <= 0) { r.active = false; r.obj.visible = false; continue; }
        r.obj.scale.setScalar((0.12 + (1 - r.life) * 2.8) * baseScale);
        r.mat.opacity = 0.18 * r.life * r.life;
      }
    };

    /* ── visible-bounds helper (world units at the z=0 plane) ── */
    const vfov = THREE.MathUtils.degToRad(VFOV);
    let halfH = Math.tan(vfov / 2) * CAM_Z;
    let halfW = halfH * camera.aspect;

    /* ── motion state ── */
    const SPEED = 0.6;                                  // global drift slow-down
    const pos = { x: 0, y: 0 };
    const vel = { x: reduce ? 0 : 2.35 * SPEED, y: reduce ? 0 : 1.6 * SPEED };
    if (!reduce) {
      vel.x *= Math.random() < 0.5 ? -1 : 1;
      vel.y *= Math.random() < 0.5 ? -1 : 1;
    }
    let squashT = 0;          // 1 at impact → decays to 0
    let squashAxis: "x" | "y" = "x";

    /* one collision = colour jump + squash + shards + sparks + shockwave */
    const impact = (cx: number, cy: number, nx: number, ny: number, axis: "x" | "y") => {
      squashT = 1; squashAxis = axis;
      cycleColor();
      const hex = PALETTE[colorIdx];
      spawnBurst(cx, cy, nx, ny, 16, hex);
      spawnSplit(cx, cy, nx, ny, hex);
      spawnRing(cx, cy, hex);
    };

    /* mouse parallax — tilts the spin only (position is owned by the bounce) */
    const ptr = { x: 0, y: 0 };
    const onMouse = (e: MouseEvent) => {
      ptr.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      ptr.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      halfH = Math.tan(vfov / 2) * CAM_Z;
      halfW = halfH * camera.aspect;
    };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("resize",    onResize);

    /* render loop */
    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, clock.getDelta());

      /* integrate position */
      pos.x += vel.x * dt;
      pos.y += vel.y * dt;

      /* keep the whole ball inside the frame, reflect + erupt on contact */
      const limX = Math.max(0, halfW - R * 1.05);
      const limY = Math.max(0, halfH - R * 1.05);

      if (pos.x >  limX) { pos.x =  limX; vel.x = -Math.abs(vel.x); impact(pos.x + R, pos.y, -1, 0, "x"); }
      else if (pos.x < -limX) { pos.x = -limX; vel.x =  Math.abs(vel.x); impact(pos.x - R, pos.y,  1, 0, "x"); }
      if (pos.y >  limY) { pos.y =  limY; vel.y = -Math.abs(vel.y); impact(pos.x, pos.y + R, 0, -1, "y"); }
      else if (pos.y < -limY) { pos.y = -limY; vel.y =  Math.abs(vel.y); impact(pos.x, pos.y - R, 0,  1, "y"); }

      rig.position.x = pos.x;
      rig.position.y = pos.y;

      /* squash & stretch — compresses along the impact axis, decays out */
      squashT *= Math.exp(-dt * 6);
      const k = squashT;
      let sx = baseScale, sy = baseScale;
      if (squashAxis === "x") { sx = baseScale * (1 - 0.26 * k); sy = baseScale * (1 + 0.18 * k); }
      else                    { sy = baseScale * (1 - 0.26 * k); sx = baseScale * (1 + 0.18 * k); }
      rig.scale.set(sx, sy, sx);

      /* spin for life + subtle mouse tilt */
      ball.rotation.y += reduce ? 0 : 0.0038;
      ball.rotation.x  = 0.2 + ptr.y * 0.16;
      ball.rotation.z += reduce ? 0 : 0.0011;

      /* advance the eruption effects */
      updateParticles(dt);
      updateMinis(dt);
      updateRings(dt);

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize",    onResize);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mm = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mm)) mm.forEach((x) => x.dispose());
        else mm?.dispose?.();
      });
      dotsGeo.dispose();
      ringGeo.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(70,174,34,0.03),transparent_64%)]" />
      <div ref={mountRef} className="absolute inset-0" />
    </div>
  );
}
