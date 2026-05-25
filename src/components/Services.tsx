"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import ServicePipeCardHologram, { servicePipeShapes } from "@/components/services/ServicePipeCardHologram";

const SERVICES = [
  {
    id: "webdev",
    num: "01",
    title: "Web Dev",
    body: "From high-converting landing pages to complex web applications, we build fast, scalable, and interactive digital experiences. Every decision is made with performance, clarity, conversion, and long-term maintainability in mind.",
    examples: ["Landing pages", "Commercial sites", "Blogs", "Portfolios", "Dashboards", "Web apps"],
  },
  {
    id: "uiux",
    num: "02",
    title: "UI / UX",
    body: "We start with research, not assumptions. Through competitive analysis, user testing, wireframes, prototypes, and relentless iteration, we shape interfaces that feel effortless — and perform even better than they look.",
    examples: ["Wireframes", "Design systems", "User flows", "Prototypes", "Usability tests", "Product UX"],
  },
  {
    id: "ecomm",
    num: "03",
    title: "E-Commerce",
    body: "Shopify, WooCommerce, Salla, or fully custom-built — we design and develop stores that actually sell. Product structure, checkout flow, SEO, retention, and organic growth strategy are engineered in from day one.",
    examples: ["Shopify", "WooCommerce", "Salla", "Product pages", "Checkout", "Subscriptions"],
  },
  {
    id: "mobile",
    num: "04",
    title: "Mobile",
    body: "iOS and Android. React Native or fully native — whichever fits your product best. We do not just ship apps; we define the feel, the flow, and the product rhythm that keeps users coming back every day.",
    examples: ["iOS", "Android", "React Native", "Onboarding", "Push flows", "App systems"],
  },
  {
    id: "seo",
    num: "05",
    title: "SEO",
    body: "From technical on-page SEO to AI-aware search strategies, we move the needle in ways most agencies cannot. We connect structure, content, authority, and reporting so growth compounds instead of appearing as a one-off spike.",
    examples: ["Technical SEO", "Content plans", "AI search", "Local SEO", "Audits", "Reporting"],
  },
  {
    id: "crm",
    num: "06",
    title: "CRM",
    body: "We build custom CRMs for booking systems, travel platforms, medical practices, and complex business workflows. Engineer-minded and precision-built, these systems reflect exactly how your operations work in the real world.",
    examples: ["Bookings", "Pipelines", "Dashboards", "Automations", "Permissions", "Integrations"],
  },
];

function MiniIcon({ index }: { index: number }) {
  const common = {
    className: "h-5 w-5",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const icons = [
    <svg key="screen" {...common}><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 20h8" /></svg>,
    <svg key="grid" {...common}><rect x="4" y="4" width="6" height="6" /><rect x="14" y="4" width="6" height="6" /><rect x="4" y="14" width="6" height="6" /><rect x="14" y="14" width="6" height="6" /></svg>,
    <svg key="cart" {...common}><path d="M3 5h2l2.4 10.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.5L21 8H7" /><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg>,
    <svg key="phone" {...common}><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></svg>,
    <svg key="search" {...common}><circle cx="11" cy="11" r="6" /><path d="m20 20-4.2-4.2" /></svg>,
    <svg key="nodes" {...common}><circle cx="6" cy="12" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="18" cy="18" r="2" /><path d="M8 12h4" /><path d="m14 11 2-3" /><path d="m14 13 2 3" /></svg>,
  ];
  return icons[index % icons.length];
}


function Card({ num, title, tall }: { num: string; title: string; tall?: boolean }) {
  return (
    <div
      className="relative overflow-hidden rounded-[1.1rem] border border-[rgba(58,191,138,0.18)]"
      style={{
        width:  tall ? 220 : 260,
        height: tall ? 300 : 190,
        background:
          "linear-gradient(145deg,rgba(10,27,21,0.9) 0%,rgba(12,38,27,0.72) 52%,rgba(7,12,10,0.88) 100%)",
        boxShadow: "0 22px 80px rgba(0,0,0,0.34), inset 0 0 38px rgba(58,191,138,0.05)",
      }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--teal)] to-transparent opacity-25" />
      <div className="absolute inset-4 rounded-[0.8rem] border border-[rgba(248,245,238,0.05)]" />
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
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const outer  = outerRef.current;
    const intro  = introRef.current;
    if (!outer || !intro) return;

    const panels = panelsRef.current.filter((p): p is HTMLDivElement => p !== null);
    if (panels.length !== SERVICES.length) return;

    /* Initial states */
    gsap.set(panels, { autoAlpha: 0 });
    panels.forEach(panel => {
      gsap.set(panel.querySelector("[data-sketch-shell]"), { autoAlpha: 0, scale: 0.88 });
    });

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

      /* Intro out */
      tl.to(intro,  { autoAlpha: 0, y: -60, duration: 0.45, ease: "none" });

      /* Services */
      panels.forEach((panel, i) => {
        const title  = panel.querySelector<HTMLElement>("[data-title]")!;
        const cardL  = panel.querySelector<HTMLElement>("[data-card-l]")!;
        const cardR  = panel.querySelector<HTMLElement>("[data-card-r]")!;
        const desc   = panel.querySelector<HTMLElement>("[data-desc]")!;
        const pills  = panel.querySelectorAll<HTMLElement>("[data-pill]");
        const sketchShell = panel.querySelector<HTMLElement>("[data-sketch-shell]")!;
        const isLast = i === panels.length - 1;
        tl.to({}, { duration: 0.12 });

        /* Panel enter */
        tl.set(panel,  { autoAlpha: 1 }, "<");
        tl.fromTo(title, { yPercent: 55, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.42, ease: "none" }, "<0.04");
        tl.fromTo(sketchShell, { autoAlpha: 0, scale: 0.88 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "none" }, "<0.04");
        tl.fromTo(cardL, { x: -70, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.36, ease: "none" }, "<0.04");
        tl.fromTo(cardR, { x:  70, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.36, ease: "none" }, "<");
        tl.fromTo(
          pills,
          { y: 54, autoAlpha: 0, scale: 0.92 },
          { y: 0, autoAlpha: 1, scale: 1, stagger: 0.055, duration: 0.36, ease: "none" },
          "<0.05"
        );
        tl.fromTo(desc,  { y: 28, autoAlpha: 0 },  { y: 0, autoAlpha: 1, duration: 0.30, ease: "none" }, "<0.08");

        /* Hold */
        tl.to({}, { duration: isLast ? 0.8 : 0.5 });

        /* Panel exit */
        if (!isLast) {
          tl.to(title,           { yPercent: -70, autoAlpha: 0, duration: 0.38, ease: "none" });
          tl.to([cardL, cardR, desc, sketchShell], { autoAlpha: 0, duration: 0.28, ease: "none" }, "<");
          tl.set(panel, { autoAlpha: 0 });
        }
      });
    }, outer);

    return () => ctx.revert();
  }, []);

  return (
    /* Outer div height = sticky scroll range. CSS sticky keeps inner at top. */
    <div ref={outerRef} id="services" style={{ minHeight: "750vh", background: "transparent" }}>
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen overflow-hidden border-t border-[var(--border)]"
        style={{ background: "transparent" }}
      >

        {/* ── Intro ── */}
        <div
          ref={introRef}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center"
        >
          <p className="eyebrow mb-8">Service stack</p>
          <h2 className="hed text-[clamp(4.3rem,10vw,8rem)] leading-[0.9]">
            Scroll the <span className="text-[var(--teal)]">blueprint.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-[0.9375rem] leading-[1.85] text-[var(--body)]">
            Each service draws itself into view as the particles rebuild the system around it.
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

            <div
              data-sketch-shell
              className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width:  "min(54vh, 500px)",
                height: "min(54vh, 500px)",
                background: "radial-gradient(circle, rgba(58,191,138,0.05) 0%, transparent 68%)",
                boxShadow: "0 0 90px rgba(58,191,138,0.10), 0 0 200px rgba(58,191,138,0.05)",
              }}
            >
              <ServicePipeCardHologram shape={servicePipeShapes[svc.id]} />
            </div>

            {/* Giant title — upper zone */}
            <div
              data-title
              className="absolute z-20 w-full text-center"
              style={{ top: "12%", pointerEvents: "none" }}
            >
              <h2 className="hed text-[clamp(3rem,8vw,6.4rem)] leading-[0.88] text-[var(--fg)]">
                {svc.title}
              </h2>
            </div>

            <div
              className="absolute left-1/2 z-20 flex w-[min(980px,92vw)] -translate-x-1/2 flex-col items-center"
              style={{ top: "31%" }}
            >
              <div className="grid w-full grid-cols-2 justify-items-stretch gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {svc.examples.map((example, exampleIndex) => (
                  <div
                    key={example}
                    data-pill
                    className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-[rgba(58,191,138,0.26)] bg-[rgba(9,9,9,0.78)] px-4 py-5 text-center shadow-[0_8px_32px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[rgba(58,191,138,0.12)] text-[var(--teal)] shadow-[0_0_18px_rgba(58,191,138,0.22),inset_0_1px_0_rgba(58,191,138,0.18)] ring-1 ring-[rgba(58,191,138,0.20)]">
                      <MiniIcon index={exampleIndex} />
                    </span>
                    <span className="text-[0.72rem] font-semibold leading-tight tracking-wide text-[rgba(240,236,227,0.88)]">
                      {example}
                    </span>
                  </div>
                ))}
              </div>

              {/* Description sits with the boxes instead of drifting away from them. */}
              <div data-desc className="mt-8 w-[min(680px,86vw)] rounded-2xl bg-[rgba(9,9,9,0.72)] px-8 py-6 text-center backdrop-blur-md" style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)" }}>
                <p className="text-[clamp(0.84rem,1.3vw,1rem)] leading-[1.8] text-[var(--fg)]">{svc.body}</p>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                  <a href="#contact" className="btn-glass inline-flex">
                    <span className="btn-glass-blob" aria-hidden="true" />
                    <span className="btn-glass-face">Use this service</span>
                  </a>
                  <a href={`/services/${svc.id}`} className="btn-glass-ghost inline-flex">
                    <span className="btn-glass-blob" aria-hidden="true" />
                    <span className="btn-glass-face">Explore <span className="btn-glass-arrow">→</span></span>
                  </a>
                </div>
              </div>
            </div>

            <div
              className="absolute z-20 font-mono text-[0.58rem] uppercase tracking-[0.42em] text-[var(--teal)]"
              style={{ left: "0.75rem", bottom: "5%" }}
            >
              {svc.num}
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
