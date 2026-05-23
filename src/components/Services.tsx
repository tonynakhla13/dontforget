"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

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
    className: "h-4 w-4",
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

function ServiceSketch({ index }: { index: number }) {
  const sketches = [
    [
      "M74 68h302c24 0 42 18 42 42v126c0 24-18 42-42 42H74c-24 0-42-18-42-42V110c0-24 18-42 42-42Z",
      "M33 118h384",
      "M92 166l-34 30 34 30",
      "M354 166l34 30-34 30",
      "M244 156l-42 82",
      "M132 162h76M132 194h38M276 238h76",
    ],
    [
      "M56 58h176v184H56V58Z",
      "M276 58h208v74H276V58Z",
      "M276 166h88v76h-88v-76Z",
      "M396 166h88v76h-88v-76Z",
      "M82 92h118M82 124h86M82 174h118M82 206h72",
      "M306 94h146M306 202h34M424 202h34",
    ],
    [
      "M82 72h256c22 0 38 16 38 38v124c0 22-16 38-38 38H82c-22 0-38-16-38-38V110c0-22 16-38 38-38Z",
      "M396 108h96v128h-96V108Z",
      "M88 124h104v92H88v-92Z",
      "M220 128h96M220 166h70M220 205h118",
      "M422 144h44M422 174h38M422 204h28",
      "M125 250h190M408 250h74",
    ],
    [
      "M180 44h164c24 0 42 18 42 42v178c0 24-18 42-42 42H180c-24 0-42-18-42-42V86c0-24 18-42 42-42Z",
      "M166 92h192M166 248h192",
      "M202 128h120M202 160h72M202 194h94",
      "M250 276h24",
      "M88 134c30-46 82-70 154-70",
      "M430 212c-30 46-82 70-154 70",
    ],
    [
      "M94 216c48-76 98-108 152-92 34 10 58 2 82-36 25-40 62-54 112-28",
      "M88 236h368",
      "M110 92h148",
      "M110 124h92",
      "M360 76a54 54 0 1 0 0 108 54 54 0 0 0 0-108Z",
      "M398 152l62 62",
    ],
    [
      "M74 84h112v78H74V84Z",
      "M236 84h112v78H236V84Z",
      "M398 84h112v78H398V84Z",
      "M130 162v58h324v-58",
      "M292 162v98",
      "M154 260h276",
      "M112 112h36M274 112h36M436 112h36",
    ],
  ];

  return (
    <svg
      aria-hidden="true"
      className="h-full w-full overflow-visible"
      viewBox="0 0 540 330"
      fill="none"
    >
      <defs>
        <filter id={`service-sketch-glow-${index}`} x="-20%" y="-30%" width="140%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="0 0 0 0 0.227 0 0 0 0 0.749 0 0 0 0 0.541 0 0 0 0.72 0"
          />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        data-sketch-line
        d="M40 286C134 314 246 315 358 286C430 267 484 231 508 178"
        stroke="rgba(58,191,138,0.18)"
        strokeWidth="1.4"
        vectorEffect="non-scaling-stroke"
      />
      {sketches[index % sketches.length].map((path, pathIndex) => (
        <path
          key={path}
          data-sketch-line
          d={path}
          stroke={pathIndex % 2 ? "rgba(248,245,238,0.42)" : "rgba(58,191,138,0.74)"}
          strokeWidth={pathIndex % 2 ? 1.25 : 1.55}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          filter={pathIndex < 3 ? `url(#service-sketch-glow-${index})` : undefined}
        />
      ))}
    </svg>
  );
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
      const sketchLines = panel.querySelectorAll<SVGPathElement>("[data-sketch-line]");
      sketchLines.forEach(line => {
        const length = line.getTotalLength();
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
      });
      gsap.set(panel.querySelector("[data-sketch-shell]"), { autoAlpha: 0, scale: 0.94, y: 16 });
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
        const sketchLines = panel.querySelectorAll<SVGPathElement>("[data-sketch-line]");
        const isLast = i === panels.length - 1;
        tl.to({}, { duration: 0.12 });

        /* Panel enter */
        tl.set(panel,  { autoAlpha: 1 }, "<");
        tl.fromTo(title, { yPercent: 55, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.42, ease: "none" }, "<0.04");
        tl.fromTo(sketchShell, { autoAlpha: 0, scale: 0.94, y: 18 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.34, ease: "none" }, "<0.04");
        tl.to(sketchLines, { strokeDashoffset: 0, stagger: 0.035, duration: 0.5, ease: "none" }, "<0.04");
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
              className="absolute left-1/2 z-10 h-[min(42vh,360px)] w-[min(780px,88vw)] -translate-x-1/2"
              style={{ top: "19%" }}
            >
              <ServiceSketch index={i} />
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
                    className="flex min-h-[76px] w-full items-center justify-center gap-3 rounded-2xl border border-[rgba(58,191,138,0.28)] bg-[rgba(9,9,9,0.72)] px-3 py-3 text-center shadow-[0_14px_45px_rgba(0,0,0,0.26)] backdrop-blur-md"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[rgba(58,191,138,0.14)] text-[var(--teal)]">
                      <MiniIcon index={exampleIndex} />
                    </span>
                    <span className="font-mono text-[clamp(0.56rem,1.05vw,0.66rem)] font-semibold uppercase tracking-[0.12em] text-[#F8F5EE]">
                      {example}
                    </span>
                  </div>
                ))}
              </div>

              {/* Description sits with the boxes instead of drifting away from them. */}
              <div data-desc className="mt-8 w-[min(680px,86vw)] text-center">
                <p className="text-[clamp(0.84rem,1.3vw,1rem)] leading-[1.8] text-[var(--fg)]">{svc.body}</p>
                <a href="#contact" className="btn btn-primary mt-7 inline-flex py-2.5 px-6 text-[0.62rem]">
                  Start this project →
                </a>
              </div>
            </div>

            <div
              className="absolute z-20 font-mono text-[0.58rem] uppercase tracking-[0.42em] text-[var(--teal)]"
              style={{ left: "3%", bottom: "5%" }}
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
