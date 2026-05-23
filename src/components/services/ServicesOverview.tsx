"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const SERVICES = [
  {
    id: "webdev",
    num: "01",
    title: "Web Development",
    body: "High-converting landing pages, commercial sites, dashboards, and custom applications built with performance, motion, accessibility, and long-term maintainability in mind.",
    examples: ["Landing pages", "Commercial sites", "Dashboards", "Web apps"],
  },
  {
    id: "uiux",
    num: "02",
    title: "UI / UX Design",
    body: "Research-led interfaces, wireframes, prototypes, design systems, and flows that make complex products feel direct, useful, and memorable.",
    examples: ["Wireframes", "Design systems", "User flows", "Prototypes"],
  },
  {
    id: "ecomm",
    num: "03",
    title: "E-Commerce",
    body: "Shopify, WooCommerce, Salla, and custom stores shaped around product structure, checkout clarity, SEO, retention, and repeat purchase behavior.",
    examples: ["Shopify", "WooCommerce", "Checkout", "Subscriptions"],
  },
  {
    id: "mobile",
    num: "04",
    title: "Mobile Apps",
    body: "iOS, Android, and React Native experiences with sharp onboarding, product rhythm, push flows, and interface details that keep users coming back.",
    examples: ["iOS", "Android", "React Native", "Onboarding"],
  },
  {
    id: "seo",
    num: "05",
    title: "SEO & Search",
    body: "Technical SEO, content architecture, AI-aware search strategy, audits, reporting, and local visibility systems built to compound over time.",
    examples: ["Technical SEO", "AI search", "Content plans", "Audits"],
  },
  {
    id: "crm",
    num: "06",
    title: "CRM Systems",
    body: "Custom operational platforms for bookings, pipelines, travel, medical practices, permissions, dashboards, and internal automation.",
    examples: ["Bookings", "Pipelines", "Automations", "Permissions"],
  },
];

const GLYPHS = [
  [
    "M126 110H394C416 110 432 126 432 148V282C432 304 416 320 394 320H126C104 320 88 304 88 282V148C88 126 104 110 126 110Z",
    "M88 166H432",
    "M176 218L136 248L176 278",
    "M344 218L384 248L344 278",
    "M286 210L236 288",
  ],
  [
    "M108 92H244V228H108V92Z",
    "M294 92H432V160H294V92Z",
    "M294 208H432V296H294V208Z",
    "M136 128H216M136 164H188M322 126H398M322 244H390",
  ],
  [
    "M116 140H392C414 140 432 158 432 180V272C432 294 414 312 392 312H116C94 312 76 294 76 272V180C76 158 94 140 116 140Z",
    "M116 140L154 84H354L392 140",
    "M154 84L188 140M354 84L322 140",
    "M144 214H260M144 252H342",
  ],
  [
    "M196 62H336C358 62 374 78 374 100V324C374 346 358 362 336 362H196C174 362 158 346 158 324V100C158 78 174 62 196 62Z",
    "M188 116H344M188 308H344",
    "M222 158H310M222 198H286M222 238H316",
    "M252 334H280",
  ],
  [
    "M94 274C154 172 226 126 310 148C358 160 394 142 426 92",
    "M98 304H434",
    "M118 116H256",
    "M118 154H202",
    "M352 112A62 62 0 1 0 352 236A62 62 0 0 0 352 112Z",
    "M396 208L456 268",
  ],
  [
    "M92 118H204V214H92V118Z",
    "M254 76H366V172H254V76Z",
    "M416 118H528V214H416V118Z",
    "M148 214V278H472V214",
    "M310 172V318",
    "M196 318H424",
  ],
];

function ServiceGlyph({ index }: { index: number }) {
  return (
    <div
      className="relative h-full min-h-[260px] overflow-hidden rounded-[1.5rem] border border-[rgba(58,191,138,0.12)] bg-[rgba(8,14,11,0.32)]"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(58,191,138,0.09), transparent 42%), radial-gradient(ellipse at 55% 52%, rgba(58,191,138,0.1), transparent 58%)",
      }}
    >
      <div className="absolute inset-0 opacity-[0.22] [background-image:linear-gradient(90deg,rgba(58,191,138,0.28)_1px,transparent_1px),linear-gradient(180deg,rgba(58,191,138,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 620 430"
        fill="none"
      >
        <defs>
          <filter id={`band-glow-${index}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="0 0 0 0 0.227 0 0 0 0 0.749 0 0 0 0 0.541 0 0 0 0.75 0"
            />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          data-glyph-line
          d="M72 334C168 388 326 384 474 318C538 290 574 250 588 198"
          stroke="rgba(58,191,138,0.18)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M102 102L428 58L538 142L218 202Z"
          fill="rgba(58,191,138,0.045)"
          stroke="rgba(58,191,138,0.12)"
        />
        <path
          d="M218 202L538 142L500 310L182 366Z"
          fill="rgba(58,191,138,0.025)"
          stroke="rgba(58,191,138,0.1)"
        />
        <g filter={`url(#band-glow-${index})`}>
          {GLYPHS[index % GLYPHS.length].map((path, pathIndex) => (
            <path
              key={path}
              data-glyph-line
              d={path}
              stroke={pathIndex % 2 === 0 ? "rgba(58,191,138,0.82)" : "rgba(248,245,238,0.34)"}
              strokeWidth={pathIndex % 2 === 0 ? 1.75 : 1.25}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              transform="translate(28 8)"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

export default function ServicesOverview() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-service-row]");

      rows.forEach(row => {
        const glyphLines = row.querySelectorAll<SVGPathElement>("[data-glyph-line]");
        const metaItems = row.querySelectorAll<HTMLElement>("[data-service-meta]");

        glyphLines.forEach(line => {
          const length = line.getTotalLength();
          gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
        });

        gsap.set(row, { autoAlpha: 0, y: 54 });
        gsap.set(metaItems, { autoAlpha: 0, y: 14 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        });

        tl.to(row, { autoAlpha: 1, y: 0, duration: 0.78, ease: "power3.out" })
          .to(glyphLines, { strokeDashoffset: 0, stagger: 0.035, duration: 0.85, ease: "power2.out" }, "-=0.45")
          .to(metaItems, { autoAlpha: 1, y: 0, stagger: 0.045, duration: 0.38, ease: "power3.out" }, "-=0.38");
      });

      ScrollTrigger.refresh();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="services" className="relative z-10 py-28 md:py-36">
      <div className="wrap">
        <div className="mb-12 grid gap-8 border-y border-[rgba(58,191,138,0.12)] py-10 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <h2 className="hed text-[clamp(3.5rem,7vw,7.2rem)] leading-[0.9]">
            Service<br />
            <span className="text-[var(--teal)]">System</span>
          </h2>
          <p className="max-w-[620px] text-[0.98rem] leading-[1.9] text-[var(--body)] md:justify-self-end">
            A single build system across strategy, interface, engineering, launch, and growth. Each service can stand alone, but they are designed to connect.
          </p>
        </div>

        <div className="space-y-8">
          {SERVICES.map((service, index) => (
            <article
              key={service.id}
              data-service-row
              className="relative overflow-hidden rounded-[1.75rem] border border-[rgba(58,191,138,0.14)] bg-[rgba(7,10,9,0.46)] p-5 shadow-[0_34px_120px_rgba(0,0,0,0.3)] backdrop-blur-md md:p-7"
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(58,191,138,0.075),transparent_32%,rgba(248,245,238,0.018))]" />
              <div className="relative grid gap-7 lg:grid-cols-[0.16fr_0.44fr_0.4fr] lg:items-stretch">
                <div className="flex items-start justify-between border-b border-[rgba(58,191,138,0.12)] pb-5 lg:flex-col lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.36em] text-[var(--teal)]">
                    {service.num}
                  </span>
                  <span className="font-mono text-[0.52rem] uppercase tracking-[0.24em] text-[var(--body)] lg:[writing-mode:vertical-rl]">
                    Don&apos;t Forget
                  </span>
                </div>

                <div className="flex min-h-[360px] flex-col justify-between gap-10 py-1 lg:pr-6">
                  <div>
                    <h3 className="hed max-w-[600px] text-[clamp(2.7rem,5.4vw,5.9rem)] leading-[0.88]">
                      {service.title}
                    </h3>
                    <p className="mt-7 max-w-[620px] text-[0.97rem] leading-[1.85] text-[var(--body)]">
                      {service.body}
                    </p>
                  </div>

                  <div>
                    <div className="mb-7 flex flex-wrap gap-x-5 gap-y-3">
                      {service.examples.map(example => (
                        <span
                          key={example}
                          data-service-meta
                          className="font-mono text-[0.56rem] uppercase tracking-[0.2em] text-[#F8F5EE]"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Link href={`/services/${service.id}`} className="btn btn-primary btn-ripple px-5 py-3 text-[0.58rem]">
                        Browse service
                      </Link>
                      <Link href="/#contact" className="btn btn-outline px-5 py-3 text-[0.58rem]">
                        Start a project →
                      </Link>
                    </div>
                  </div>
                </div>

                <ServiceGlyph index={index} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
