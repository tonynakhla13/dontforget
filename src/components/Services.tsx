"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const SERVICES = [
  {
    id: "webdev",
    num: "01",
    title: "Web Dev",
    body: "Fast, interactive, built to convert. From a single landing page to a full-scale web application — we engineer the whole stack.",
  },
  {
    id: "uiux",
    num: "02",
    title: "UI / UX",
    body: "Market research, interaction design, obsessive prototyping. We find what works and design what users actually want.",
  },
  {
    id: "ecomm",
    num: "03",
    title: "E-Commerce",
    body: "Shopify, WooCommerce, Salla, or fully custom. Full SEO and organic reach baked in from day one.",
  },
  {
    id: "mobile",
    num: "04",
    title: "Mobile",
    body: "iOS and Android. React Native or native. We give apps a spirit, a character, and a reason to open again.",
  },
  {
    id: "seo",
    num: "05",
    title: "SEO",
    body: "On-page to fully integrated SEO systems with AI SEO. Plus full marketing — plans, branding, posters, everything.",
  },
  {
    id: "crm",
    num: "06",
    title: "CRM",
    body: "Custom CRMs for booking, travel, medical, and complex operations. Engineer-minded systems that just work.",
  },
];

function PlaceholderCard({
  num, title, portrait,
}: {
  num: string; title: string; portrait?: boolean;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-[1.4rem] border border-[rgba(58,191,138,0.14)]"
      style={{
        width:  portrait ? 230 : 270,
        height: portrait ? 320 : 200,
        background: "linear-gradient(135deg, rgba(9,26,18,1) 0%, rgba(12,35,24,1) 60%, rgba(6,14,10,1) 100%)",
      }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--teal)] to-transparent opacity-30" />
      <div className="absolute bottom-5 left-5 right-5">
        <span className="block font-mono text-[0.46rem] uppercase tracking-[0.44em] text-[var(--teal)] opacity-60">{num}</span>
        <span className="mt-1 block font-mono text-[0.58rem] uppercase tracking-[0.3em] text-[var(--body)]">{title}</span>
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
    const sticky = stickyRef.current;
    const intro  = introRef.current;
    const sphere = sphereRef.current;
    const panels = panelsRef.current.filter(Boolean) as HTMLDivElement[];

    if (!outer || !sticky || !intro || !sphere || panels.length !== SERVICES.length) return;

    gsap.set(sphere, { scale: 0, autoAlpha: 0 });
    gsap.set(panels, { autoAlpha: 0 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outer,
          start: "top top",
          end: "+=5200",
          scrub: 1.2,
          pin: sticky,
          pinSpacing: true,
          anticipatePin: 1,
        },
      });

      // Intro hold
      tl.to({}, { duration: 0.4 });

      // Intro out + sphere in
      tl.to(intro,  { autoAlpha: 0, y: -50, duration: 0.4, ease: "none" });
      tl.to(sphere, { scale: 1, autoAlpha: 1, duration: 0.5, ease: "none" }, "<0.1");

      SERVICES.forEach((_, i) => {
        const panel = panels[i];
        const title  = panel.querySelector<HTMLElement>("[data-title]")!;
        const cardL  = panel.querySelector<HTMLElement>("[data-card-l]")!;
        const cardR  = panel.querySelector<HTMLElement>("[data-card-r]")!;
        const desc   = panel.querySelector<HTMLElement>("[data-desc]")!;
        const isLast = i === SERVICES.length - 1;
        const xShift = i % 2 === 0 ? -60 : 60;

        // Sphere shift
        tl.to(sphere, { x: xShift, duration: 0.35, ease: "none" });

        // Panel enter
        tl.set(panel, { autoAlpha: 1 }, "<");
        tl.fromTo(title, { yPercent: 55, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.4, ease: "none" }, "<0.05");
        tl.fromTo(cardL, { x: -70, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.35, ease: "none" }, "<0.05");
        tl.fromTo(cardR, { x: 70,  autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.35, ease: "none" }, "<");
        tl.fromTo(desc,  { y: 28,  autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.3,  ease: "none" }, "<0.1");

        // Hold
        tl.to({}, { duration: isLast ? 0.7 : 0.45 });

        // Panel exit
        if (!isLast) {
          tl.to(title, { yPercent: -70, autoAlpha: 0, duration: 0.38, ease: "none" });
          tl.to([cardL, cardR, desc], { autoAlpha: 0, duration: 0.28, ease: "none" }, "<");
          tl.set(panel, { autoAlpha: 0 }, "+=0.02");
        }
      });
    }, outer);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={outerRef} id="services">
      <div
        ref={stickyRef}
        className="relative h-screen overflow-hidden border-t border-[var(--border)]"
        style={{ background: "var(--bg)" }}
      >

        {/* ── Teal 3-D sphere ── */}
        <div
          className="pointer-events-none absolute"
          style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        >
          <div
            ref={sphereRef}
            className="rounded-full"
            style={{
              width:  640,
              height: 640,
              background:
                "radial-gradient(circle at 34% 28%, rgba(58,191,138,0.92) 0%, rgba(18,85,58,0.90) 40%, rgba(9,22,15,0.97) 80%, rgba(9,9,9,1) 100%)",
              boxShadow:
                "inset -55px -55px 110px rgba(0,0,0,0.60), inset 20px 20px 60px rgba(58,191,138,0.10), 0 0 160px rgba(58,191,138,0.07)",
            }}
          />
        </div>

        {/* ── Intro ── */}
        <div ref={introRef} className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
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
            className="absolute inset-0 flex items-center"
          >
            {/* Left card */}
            <div
              data-card-l
              className="absolute hidden md:block"
              style={{ left: "6%", top: "14%" }}
            >
              <PlaceholderCard num={svc.num} title={svc.title} portrait />
            </div>

            {/* Giant title — center */}
            <div
              data-title
              className="relative z-20 w-full text-center"
              style={{ pointerEvents: "none" }}
            >
              <h2 className="hed text-[9rem] leading-[0.88] text-[var(--fg)]">
                {svc.title}
              </h2>
            </div>

            {/* Description — bottom-center */}
            <div
              data-desc
              className="absolute z-20 text-center"
              style={{ bottom: "12%", left: "50%", transform: "translateX(-50%)", width: 360 }}
            >
              <span className="mb-3 block font-mono text-[0.52rem] uppercase tracking-[0.4em] text-[var(--teal)]">
                {svc.num} — {svc.title}
              </span>
              <p className="text-[0.875rem] leading-[1.85] text-[var(--body)]">{svc.body}</p>
              <a
                href="#contact"
                className="btn btn-primary mt-6 inline-flex py-2.5 px-6 text-[0.62rem]"
              >
                Start this project →
              </a>
            </div>

            {/* Right card */}
            <div
              data-card-r
              className="absolute hidden md:block"
              style={{ right: "6%", bottom: "20%" }}
            >
              <PlaceholderCard num={svc.num} title={svc.title} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
