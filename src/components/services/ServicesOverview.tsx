"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import ServicePipeCardHologram, { servicePipeShapes } from "@/components/services/ServicePipeCardHologram";

const SERVICES = [
  {
    id: "webdev",
    num: "01",
    title: "Web Development",
    body: "High-converting landing pages, commercial sites, dashboards, and custom applications built with performance, motion, accessibility, and long-term maintainability in mind.",
    examples: ["Landing pages", "Commercial sites", "Web apps", "Dashboards", "CMS builds", "Animations", "Performance", "Maintenance"],
    line: "Pixel muscles, fast pages, fewer \"why is it broken?\" moments.",
  },
  {
    id: "uiux",
    num: "02",
    title: "UI / UX Design",
    body: "Research-led interfaces, wireframes, prototypes, design systems, and flows that make complex products feel direct, useful, and memorable.",
    examples: ["Wireframes", "Design systems", "User flows", "Prototypes", "App screens", "UX audits", "Interaction states", "Handoffs"],
    line: "Interfaces that stop making users squint, guess, or sigh.",
  },
  {
    id: "ecomm",
    num: "03",
    title: "E-Commerce",
    body: "Shopify, WooCommerce, Salla, and custom stores shaped around product structure, checkout clarity, SEO, retention, and repeat purchase behavior.",
    examples: ["Shopify", "WooCommerce", "Salla", "Checkout", "Product pages", "Subscriptions", "Cart flows", "Store SEO"],
    line: "Carts that behave, checkouts that do not scare people away.",
  },
  {
    id: "mobile",
    num: "04",
    title: "Mobile Apps",
    body: "iOS, Android, and React Native experiences with sharp onboarding, product rhythm, push flows, and interface details that keep users coming back.",
    examples: ["iOS", "Android", "React Native", "Onboarding", "Push flows", "App dashboards", "User accounts", "Release support"],
    line: "Pocket-sized product magic, minus the mystery crashes.",
  },
  {
    id: "seo",
    num: "05",
    title: "SEO & Search",
    body: "Technical SEO, content architecture, AI-aware search strategy, audits, reporting, and local visibility systems built to compound over time.",
    examples: ["Technical SEO", "AI search", "Content plans", "Audits", "Local SEO", "Schema", "Reporting", "Site structure"],
    line: "Helping search engines find you without bribing the algorithm.",
  },
  {
    id: "crm",
    num: "06",
    title: "CRM Systems",
    body: "Custom operational platforms for bookings, pipelines, travel, medical practices, permissions, dashboards, and internal automation.",
    examples: ["Bookings", "Pipelines", "Automations", "Permissions", "Dashboards", "Reports", "Integrations", "Team portals"],
    line: "Less spreadsheet archaeology, more work actually moving.",
  },
];

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
          {SERVICES.map(service => (
            <article
              key={service.id}
              data-service-row
              className="group relative overflow-hidden rounded-[1.75rem] border border-[rgba(58,191,138,0.14)] bg-[rgba(7,10,9,0.46)] p-5 shadow-[0_34px_120px_rgba(0,0,0,0.3)] backdrop-blur-md md:p-7"
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(58,191,138,0.075),transparent_32%,rgba(248,245,238,0.018))]" />
              <div className="relative grid gap-7 lg:grid-cols-[0.16fr_0.44fr_0.4fr] lg:items-stretch">
                <div className="flex items-start justify-between gap-6 border-b border-[rgba(58,191,138,0.12)] pb-5 lg:flex-col lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.36em] text-[var(--teal)]">
                    {service.num}
                  </span>
                  <div className="hidden w-full space-y-5 lg:block">
                    {service.examples.map(example => (
                      <div key={example} data-service-meta>
                        <span className="block origin-left border-l border-[rgba(83,230,178,0.24)] pl-3 font-mono text-[0.54rem] uppercase tracking-[0.18em] text-[#F8F5EE]/88 transition duration-300 ease-out hover:translate-x-1 hover:scale-110 hover:border-[#53E6B2] hover:text-[#F8F5EE]">
                          {example}
                        </span>
                      </div>
                    ))}
                  </div>
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
                    <p data-service-meta className="mb-7 max-w-[620px] font-mono text-[0.66rem] uppercase tracking-[0.16em] text-[#53E6B2]">
                      {service.line}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link href={`/services/${service.id}`} className="btn-glass">
                        <span className="btn-glass-blob" aria-hidden="true" />
                        <span className="btn-glass-face">Browse service</span>
                      </Link>
                      <Link href="/#contact" className="btn-glass-ghost">
                        <span className="btn-glass-blob" aria-hidden="true" />
                        <span className="btn-glass-face">Start a project →</span>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="relative h-full min-h-[300px] overflow-visible">
                  <ServicePipeCardHologram shape={servicePipeShapes[service.id]} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
