"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────────────────────
//  Three.js pipe-hologram helpers
// ─────────────────────────────────────────────────────────────────────────────

type RulePipeShape = "clarity" | "motion" | "systems-rule" | "honesty";
type StrokeSpec = { points: THREE.Vector3[]; radius?: number; bright?: boolean; closed?: boolean };

function v(x: number, y: number, z: number) { return new THREE.Vector3(x, y, z); }

function circlePoints(cx: number, cy: number, z: number, radius: number, count: number): THREE.Vector3[] {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2;
    return v(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius, z);
  });
}

function roundedRectPoints(w: number, h: number, z: number, r: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  const hw = w / 2 - r, hh = h / 2 - r;
  const corners: [number, number, number][] = [[hw, hh, 0], [-hw, hh, Math.PI / 2], [-hw, -hh, Math.PI], [hw, -hh, Math.PI * 1.5]];
  for (const [cx, cy, sa] of corners)
    for (let s = 0; s <= 5; s++) { const a = sa + (s / 5) * (Math.PI / 2); pts.push(v(cx + Math.cos(a) * r, cy + Math.sin(a) * r, z)); }
  return pts;
}

function makeMat(color: number, opacity: number) {
  return new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
}

function makeStroke(pts: THREE.Vector3[], tubeR: number, mat: THREE.Material, closed: boolean): THREE.Mesh {
  if (pts.length < 2 || (closed && pts.length < 3)) return new THREE.Mesh();
  const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, closed), Math.max(16, pts.length * 8), tubeR, 6, closed);
  return new THREE.Mesh(geo, mat);
}

function ruleStrokes(shape: RulePipeShape): StrokeSpec[] {
  switch (shape) {
    case "clarity": return [
      { points: [v(-1.6,0,.04),v(-.92,.72,.12),v(0,.98,.18),v(.92,.72,.12),v(1.6,0,.04),v(.92,-.72,.12),v(0,-.98,.18),v(-.92,-.72,.12),v(-1.6,0,.04)], radius:.11, bright:true },
      { points: [v(-1.02,.02,.08),v(-.42,.02,.14),v(.24,.02,.18),v(.92,.02,.1)], radius:.075 },
      { points: [v(-1.96,.7,.02),v(-2.28,.1,.12),v(-1.96,-.7,.02)], radius:.12 },
      { points: [v(1.96,.7,.02),v(2.28,.1,.12),v(1.96,-.7,.02)], radius:.12 },
      { points: circlePoints(.12,.02,.14,.2,16), radius:.04, closed:true, bright:true },
    ];
    case "motion": return [
      { points: [v(-2.1,-.18,.02),v(-1.42,.52,.16),v(-.52,.76,.22),v(.28,.22,.16),v(1.04,-.24,.14),v(1.92,-.02,.08)], radius:.12, bright:true },
      { points: [v(-1.88,-.84,.02),v(-1.02,-.28,.14),v(-.12,-.02,.18),v(.76,.44,.16),v(1.58,.9,.08)], radius:.085 },
      { points: [v(1.52,-.32,.1),v(2.18,-.02,.16),v(1.64,.34,.1)], radius:.11, bright:true },
      { points: [v(-.82,1.04,.06),v(-.18,1.22,.12),v(.54,1.04,.06)], radius:.06 },
    ];
    case "systems-rule": return [
      { points: roundedRectPoints(1.18,.78,.14,.04).map(p=>p.clone().add(v(0,.92,0))), radius:.09, closed:true, bright:true },
      { points: roundedRectPoints(1.18,.78,.14,.04).map(p=>p.clone().add(v(-1.38,-.12,0))), radius:.09, closed:true },
      { points: roundedRectPoints(1.18,.78,.14,.04).map(p=>p.clone().add(v(1.38,-.12,0))), radius:.09, closed:true },
      { points: roundedRectPoints(1.18,.78,.14,.04).map(p=>p.clone().add(v(0,-1.16,0))), radius:.09, closed:true, bright:true },
      { points: circlePoints(0,-.1,.24,.14,20), radius:.06, closed:true, bright:true },
      { points: [v(0,.5,.1),v(0,.18,.16),v(0,.02,.2)], radius:.055 },
      { points: [v(-.8,-.12,.1),v(-.38,-.12,.16),v(-.12,-.1,.2)], radius:.055 },
      { points: [v(.8,-.12,.1),v(.38,-.12,.16),v(.12,-.1,.2)], radius:.055 },
      { points: [v(0,-.76,.1),v(0,-.42,.16),v(0,-.2,.2)], radius:.055 },
    ];
    case "honesty": return [
      { points: [v(-1.92,.92,.04),v(-.92,1.02,.12),v(.22,1.02,.16),v(1.28,.92,.08),v(1.42,.14,.12),v(1.28,-.62,.1),v(.22,-.72,.16),v(-.62,-.72,.12),v(-1.12,-1.16,.08),v(-1.02,-.72,.12),v(-1.82,-.62,.08),v(-1.96,.12,.12),v(-1.92,.92,.04)], radius:.1, bright:true },
      { points: [v(-1.28,.34,.08),v(-.42,.36,.14),v(.42,.36,.12)], radius:.07 },
      { points: [v(-1.28,-.02,.08),v(-.62,-.02,.14),v(.02,-.02,.12)], radius:.06 },
      { points: [v(.92,.54,.1),v(1.08,.02,.16),v(1.18,-.34,.1)], radius:.085, bright:true },
      { points: circlePoints(1.18,-.66,.1,.18,14), radius:.035, closed:true, bright:true },
    ];
  }
}

function createRulePipeHologram(shape: RulePipeShape): THREE.Group {
  const group = new THREE.Group();
  const mat = makeMat(0x35c592, 0.055);
  const bright = makeMat(0x53e6b2, 0.105);
  const echoMat = makeMat(0x35c592, 0.026);
  const echoBright = makeMat(0x53e6b2, 0.04);

  const echo = new THREE.Group();
  echo.position.set(0.12, -0.1, -0.32);
  echo.scale.setScalar(1.035);

  const main = new THREE.Group();
  for (const s of ruleStrokes(shape)) {
    const r = s.radius ?? 0.12;
    main.add(makeStroke(s.points, r, s.bright ? bright : mat, s.closed ?? false));
    echo.add(makeStroke(s.points, r * 1.05, s.bright ? echoBright : echoMat, s.closed ?? false));
  }
  group.add(echo, main);
  group.rotation.set(-0.08, 0.16, -0.015);
  return group;
}

// ─────────────────────────────────────────────────────────────────────────────
//  Per-rule canvas
// ─────────────────────────────────────────────────────────────────────────────

function RuleMeshCanvas({ shape }: { shape: RulePipeShape }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    cam.position.set(0, 0, 6.5);

    const group = createRulePipeHologram(shape);
    scene.add(group);

    const resize = () => {
      const { width: w, height: h } = el.getBoundingClientRect();
      cam.aspect = Math.max(w, 1) / Math.max(h, 1);
      cam.updateProjectionMatrix();
      renderer.setSize(Math.max(w, 1), Math.max(h, 1), false);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const t0 = performance.now();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = (performance.now() - t0) / 1000;
      group.rotation.y += 0.002;
      group.rotation.x = -0.08 + Math.sin(t * 0.12) * 0.018;
      group.position.y = Math.sin(t * 0.18) * 0.022;
      renderer.render(scene, cam);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      scene.traverse(o => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          if (Array.isArray(o.material)) o.material.forEach(m => m.dispose());
          else (o.material as THREE.Material).dispose();
        }
      });
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [shape]);

  return <div ref={ref} className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden />;
}

// ─────────────────────────────────────────────────────────────────────────────
//  Data
// ─────────────────────────────────────────────────────────────────────────────

const rules = [
  { n: "01", name: "Clarity",  shape: "clarity"      as RulePipeShape, line: "If it doesn't sharpen the message, it doesn't make the cut." },
  { n: "02", name: "Motion",   shape: "motion"        as RulePipeShape, line: "Every movement has to explain, reveal, or guide." },
  { n: "03", name: "Systems",  shape: "systems-rule"  as RulePipeShape, line: "The launch is not the finish line. It is the first stress test." },
  { n: "04", name: "Honesty",  shape: "honesty"       as RulePipeShape, line: "The strongest result starts with saying the useful thing early." },
];

// ─────────────────────────────────────────────────────────────────────────────
//  Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function Principles() {
  const sectionRef = useRef<HTMLElement>(null);
  const mustsRef   = useRef<HTMLDivElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);
  const cardRefs   = useRef<(HTMLElement | null)[]>([]);

  const [typedLines, setTypedLines] = useState<string[]>(rules.map(() => ""));
  const maxRevealedRef = useRef(-1);
  const timersRef = useRef<(number | null)[]>([null, null, null, null]);

  function triggerTyping(idx: number) {
    if (idx < 0 || idx >= rules.length || timersRef.current[idx]) return;
    const line = rules[idx].line;
    let i = 0;
    timersRef.current[idx] = window.setInterval(() => {
      i = Math.min(line.length, i + 6);
      setTypedLines(prev => { const n = [...prev]; n[idx] = line.slice(0, i); return n; });
      if (i >= line.length) { window.clearInterval(timersRef.current[idx]!); timersRef.current[idx] = null; }
    }, 16);
  }

  useEffect(() => {
    const section = sectionRef.current;
    const musts   = mustsRef.current;
    const grid    = gridRef.current;
    const cards   = cardRefs.current.filter(Boolean) as HTMLElement[];
    if (!section || !musts || !grid || cards.length < 4) return;

    gsap.set(cards, { autoAlpha: 0, y: 48, scale: 0.962, filter: "blur(10px)" });
    gsap.set(grid,  { autoAlpha: 0 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * 4.5}`,
          scrub: 0.85,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            const seg = Math.floor(self.progress * (rules.length + 1)) - 1; // -1..3
            if (seg > maxRevealedRef.current) {
              for (let i = maxRevealedRef.current + 1; i <= seg && i < rules.length; i++) triggerTyping(i);
              maxRevealedRef.current = seg;
            }
          },
        },
      });

      // OUR MUSTS exits
      tl.to(musts, { autoAlpha: 0, y: -36, scale: 0.96, filter: "blur(14px)", duration: 0.18, ease: "power2.in" }, 0);

      // Grid fades in
      tl.to(grid, { autoAlpha: 1, duration: 0.09 }, 0.12);

      // Cards appear 1 by 1
      cards.forEach((card, i) => {
        tl.fromTo(card,
          { autoAlpha: 0, y: 48, scale: 0.962, filter: "blur(10px)" },
          { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.19, ease: "power3.out" },
          0.22 + i * 0.2
        );
      });
    }, section);

    return () => {
      ctx.revert();
      timersRef.current.forEach(t => { if (t) window.clearInterval(t); });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      id="principles"
      ref={sectionRef}
      className="relative h-screen overflow-hidden border-t border-[var(--border)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_56%_52%,rgba(var(--teal-rgb),0.06),transparent_68%)]" />

      {/* ── OUR MUSTS slide (full-viewport, exits on scroll) ── */}
      <div ref={mustsRef} className="absolute inset-0 z-20 flex items-center px-[var(--gutter)]">
        <div>
          <p className="eyebrow mb-7">The rules we work by</p>
          <h2 className="hed text-[clamp(5rem,16vw,19rem)] leading-[0.74] tracking-[-0.055em] text-[var(--fg)] drop-shadow-[0_22px_0_rgba(255,255,255,0.07)]">
            OUR <span className="text-[var(--teal)]">MUSTS</span>
          </h2>
        </div>
      </div>

      {/* ── 2×2 rules grid ── */}
      <div ref={gridRef} className="absolute inset-0 z-10 flex flex-col gap-4 px-[clamp(1rem,2.5vw,2rem)] pb-[clamp(1rem,2.5vw,2rem)] pt-[calc(86px+clamp(0.75rem,1.5vw,1.25rem))]">
        {/* Eyebrow */}
        <div className="flex items-center justify-between shrink-0">
          <p className="eyebrow">The rules we work by</p>
        </div>

        {/* Grid */}
        <div className="grid flex-1 grid-cols-2 grid-rows-2 gap-4 min-h-0 max-h-[calc(100vh-160px)]">
          {rules.map((rule, index) => (
            <article
              key={rule.n}
              ref={el => { cardRefs.current[index] = el; }}
              className="group relative overflow-hidden rounded-[1.5rem] border border-[rgba(var(--teal-rgb),0.14)] bg-[rgba(var(--bg-rgb),0.55)] shadow-[0_24px_80px_rgba(var(--bg-rgb),0.35)] backdrop-blur-md transition-[border-color,box-shadow] duration-500 hover:border-[rgba(var(--teal-rgb),0.38)] hover:shadow-[0_24px_80px_rgba(var(--bg-rgb),0.35),0_0_60px_rgba(var(--teal-rgb),0.14),inset_0_0_0_1px_rgba(var(--teal-rgb),0.08)]"
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(var(--teal-rgb),0.08),transparent_46%,rgba(248,245,238,0.015))]" />
              <div className="absolute inset-0 [background-image:linear-gradient(90deg,rgba(var(--teal-rgb),0.06)_1px,transparent_1px),linear-gradient(180deg,rgba(var(--teal-rgb),0.04)_1px,transparent_1px)] [background-size:36px_36px] opacity-30" />
              {/* Hover glow */}
              <div className="pointer-events-none absolute inset-0 rounded-[1.5rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "radial-gradient(ellipse at 60% 50%, rgba(var(--teal-rgb),0.13) 0%, transparent 68%)" }} />

              <div className="relative h-full grid grid-cols-[1fr_0.72fr] p-5 gap-3">
                {/* ── Left: text ── */}
                <div className="flex min-w-0 flex-col justify-center py-0.5">
                  <span className="font-mono text-[0.68rem] uppercase tracking-[0.32em] text-[var(--teal)] mb-3">
                    Rule {rule.n}
                  </span>

                  <div>
                    <h3
                      className="hed leading-[0.82] tracking-[-0.045em] text-[var(--fg)]"
                      style={{ fontSize: "clamp(2.8rem,4.4vw,5.5rem)" }}
                    >
                      {rule.name}
                    </h3>
                    <p className="mt-3 text-[clamp(0.72rem,0.9vw,0.88rem)] leading-[1.8] text-[var(--body)] max-w-[34ch]">
                      {typedLines[index]}
                      {typedLines[index].length > 0 && typedLines[index].length < rule.line.length && (
                        <span className="ml-0.5 inline-block h-[0.75em] w-[0.06em] translate-y-[0.08em] bg-[var(--teal)] shadow-[0_0_10px_rgba(var(--teal-rgb),0.8)]" />
                      )}
                    </p>
                  </div>
                </div>

                {/* ── Right: mesh ── */}
                <div className="relative overflow-hidden">
                  <RuleMeshCanvas shape={rule.shape} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
