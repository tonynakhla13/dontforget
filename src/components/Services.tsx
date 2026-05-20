"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const SERVICES = [
  {
    id: "webdev",
    num: "01",
    title: "Web Dev",
    body: "From high-converting landing pages to complex web applications, we build fast, scalable, and interactive digital experiences. Every decision is made with performance, clarity, and real results in mind.",
  },
  {
    id: "uiux",
    num: "02",
    title: "UI / UX",
    body: "We start with research, not assumptions. Through competitive analysis, user testing, and relentless iteration, we shape interfaces that feel effortless — and perform even better than they look.",
  },
  {
    id: "ecomm",
    num: "03",
    title: "E-Commerce",
    body: "Shopify, WooCommerce, Salla, or fully custom-built — we design and develop stores that actually sell. SEO and organic growth strategy are engineered in from day one, not added as an afterthought.",
  },
  {
    id: "mobile",
    num: "04",
    title: "Mobile",
    body: "iOS and Android. React Native or fully native — whichever fits your product best. We don't just ship apps; we define the feel, the flow, and the personality that keeps users coming back every day.",
  },
  {
    id: "seo",
    num: "05",
    title: "SEO",
    body: "From technical on-page SEO to fully integrated AI-powered search strategies, we move the needle in ways most agencies simply can't. We also handle full marketing — plans, visual design, branding, and everything in between.",
  },
  {
    id: "crm",
    num: "06",
    title: "CRM",
    body: "We build custom CRMs for booking systems, travel platforms, medical practices, and complex business workflows. Engineer-minded and precision-built — systems that understand exactly how your operations work.",
  },
];

function Card({ num, title, tall }: { num: string; title: string; tall?: boolean }) {
  return (
    <div
      className="relative overflow-hidden rounded-[1.4rem] border border-[rgba(58,191,138,0.13)]"
      style={{
        width:  tall ? 220 : 260,
        height: tall ? 300 : 190,
        background:
          "linear-gradient(145deg,rgba(10,26,19,1) 0%,rgba(13,34,23,1) 55%,rgba(7,14,10,1) 100%)",
      }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--teal)] to-transparent opacity-25" />
      <div className="absolute bottom-5 left-5 right-5">
        <span className="block font-mono text-[0.46rem] uppercase tracking-[0.42em] text-[var(--teal)] opacity-55">
          {num}
        </span>
        <span className="mt-1 block font-mono text-[0.56rem] uppercase tracking-[0.28em] text-[var(--body)]">
          {title}
        </span>
      </div>
    </div>
  );
}

export default function Services() {
  const outerRef  = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const introRef  = useRef<HTMLDivElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const outer  = outerRef.current;
    const intro  = introRef.current;
    const sphere = sphereRef.current;
    if (!outer || !intro || !sphere) return;

    const panels = panelsRef.current.filter((p): p is HTMLDivElement => p !== null);
    if (panels.length !== SERVICES.length) return;

    /* Initial states */
    gsap.set(sphere, { scale: 0, autoAlpha: 0 });
    gsap.set(panels, { autoAlpha: 0 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outer,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.4,
        },
      });

      /* Hold intro */
      tl.to({}, { duration: 0.4 });

      /* Intro out + sphere in */
      tl.to(intro,  { autoAlpha: 0, y: -60, duration: 0.45, ease: "none" });
      tl.to(sphere, { scale: 1, autoAlpha: 1, duration: 0.5, ease: "none" }, "<0.1");

      /* Services */
      panels.forEach((panel, i) => {
        const title  = panel.querySelector<HTMLElement>("[data-title]")!;
        const cardL  = panel.querySelector<HTMLElement>("[data-card-l]")!;
        const cardR  = panel.querySelector<HTMLElement>("[data-card-r]")!;
        const desc   = panel.querySelector<HTMLElement>("[data-desc]")!;
        const isLast = i === panels.length - 1;
        const xShift = (i % 2 === 0 ? -1 : 1) * 55;

        /* Sphere nudge */
        tl.to(sphere, { x: xShift, duration: 0.38, ease: "none" });

        /* Panel enter */
        tl.set(panel,  { autoAlpha: 1 }, "<");
        tl.fromTo(title, { yPercent: 55, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.42, ease: "none" }, "<0.04");
        tl.fromTo(cardL, { x: -70, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.36, ease: "none" }, "<0.04");
        tl.fromTo(cardR, { x:  70, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.36, ease: "none" }, "<");
        tl.fromTo(desc,  { y: 28, autoAlpha: 0 },  { y: 0, autoAlpha: 1, duration: 0.30, ease: "none" }, "<0.08");

        /* Hold */
        tl.to({}, { duration: isLast ? 0.8 : 0.5 });

        /* Panel exit */
        if (!isLast) {
          tl.to(title,           { yPercent: -70, autoAlpha: 0, duration: 0.38, ease: "none" });
          tl.to([cardL, cardR, desc], { autoAlpha: 0, duration: 0.28, ease: "none" }, "<");
          tl.set(panel, { autoAlpha: 0 });
        }
      });
    }, outer);

    return () => ctx.revert();
  }, []);

  return (
    /* Outer div height = sticky scroll range. CSS sticky keeps inner at top. */
    <div ref={outerRef} id="services" style={{ minHeight: "750vh", background: "var(--bg)" }}>
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen overflow-hidden border-t border-[var(--border)]"
        style={{ background: "var(--bg)" }}
      >

        {/* ── Holographic wireframe sphere ── */}
        <div
          ref={sphereRef}
          className="pointer-events-none absolute"
          style={{
            top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            width: 620, height: 620,
            opacity: 0, visibility: "hidden",
          }}
        >
          {/* Outer glow bloom */}
          <div className="absolute rounded-full" style={{
            inset: -40,
            background: "radial-gradient(circle, rgba(58,191,138,0.07) 0%, transparent 70%)",
          }} />
          {/* Outer ring */}
          <div className="absolute rounded-full" style={{
            inset: 0,
            border: "1px solid rgba(58,191,138,0.50)",
            boxShadow: "0 0 30px rgba(58,191,138,0.15), inset 0 0 30px rgba(58,191,138,0.05)",
          }} />
          {/* Latitude ring — equator */}
          <div className="absolute rounded-full" style={{
            top: "50%", left: "0", right: "0",
            height: "18%", transform: "translateY(-50%)",
            border: "1px solid rgba(58,191,138,0.38)",
          }} />
          {/* Latitude ring — upper */}
          <div className="absolute rounded-full" style={{
            top: "22%", left: "8%", right: "8%",
            height: "12%", transform: "translateY(-50%)",
            border: "1px solid rgba(58,191,138,0.22)",
          }} />
          {/* Latitude ring — lower */}
          <div className="absolute rounded-full" style={{
            top: "78%", left: "8%", right: "8%",
            height: "12%", transform: "translateY(-50%)",
            border: "1px solid rgba(58,191,138,0.22)",
          }} />
          {/* Meridian — center vertical */}
          <div className="absolute rounded-full" style={{
            top: "0", bottom: "0", left: "50%",
            width: "18%", transform: "translateX(-50%)",
            border: "1px solid rgba(58,191,138,0.32)",
          }} />
          {/* Meridian — tilted */}
          <div className="absolute rounded-full" style={{
            inset: "4%",
            border: "1px solid rgba(58,191,138,0.18)",
            transform: "rotate(42deg) scaleX(0.28)",
          }} />
          {/* Inner soft glow */}
          <div className="absolute rounded-full" style={{
            inset: "18%",
            background: "radial-gradient(circle at 38% 35%, rgba(58,191,138,0.10) 0%, transparent 65%)",
          }} />
        </div>

        {/* ── Intro ── */}
        <div
          ref={introRef}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center"
        >
          <p className="eyebrow mb-8">Services</p>
          <h2 className="hed text-[7rem] leading-[0.92]">
            What we<br />
            <span className="text-[var(--teal)]">build.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-md text-[0.9375rem] leading-[1.85] text-[var(--body)]">
            Web, mobile, e-commerce, SEO, design, CRM —<br />
            full-stack execution from concept to launch.
          </p>
        </div>

        {/* ── Service panels ── */}
        {SERVICES.map((svc, i) => (
          <div
            key={svc.id}
            ref={el => { panelsRef.current[i] = el; }}
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity: 0, visibility: "hidden" }}
          >
            {/* Left card */}
            <div
              data-card-l
              className="absolute hidden md:block"
              style={{ left: "4%", top: "10%" }}
            >
              <Card num={svc.num} title={svc.title} tall />
            </div>

            {/* Giant title — upper zone */}
            <div
              data-title
              className="absolute z-20 w-full text-center"
              style={{ top: "10%", pointerEvents: "none" }}
            >
              <h2 className="hed text-[8rem] leading-[0.9] text-[var(--fg)]">
                {svc.title}
              </h2>
            </div>

            {/* Description — lower zone, well below title */}
            <div
              data-desc
              className="absolute z-20 text-center"
              style={{ bottom: "8%", left: "50%", transform: "translateX(-50%)", width: 380 }}
            >
              <span className="mb-3 block font-mono text-[0.5rem] uppercase tracking-[0.42em] text-[var(--teal)]">
                {svc.num}
              </span>
              <p className="text-[0.875rem] leading-[1.85] text-[var(--body)]">{svc.body}</p>
              <a href="#contact" className="btn btn-primary mt-6 inline-flex py-2.5 px-6 text-[0.62rem]">
                Start this project →
              </a>
            </div>

            {/* Right card */}
            <div
              data-card-r
              className="absolute hidden md:block"
              style={{ right: "4%", bottom: "14%" }}
            >
              <Card num={svc.num} title={svc.title} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
