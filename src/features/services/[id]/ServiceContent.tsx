"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import ImmersiveContact from "@/components/immersive/ImmersiveContact";
import ServiceBrickBreaker from "@/components/services/ServiceBrickBreaker";
import type { ServiceData } from "./page";

const SERVICE_TOTAL = "06";

const PROCESS: Record<string, { title: string; body: string }[]> = {
  webdev: [
    { title: "Map the architecture", body: "We define routes, content models, integrations, performance targets, and the launch surface before production code starts." },
    { title: "Prototype the interface", body: "Critical screens are built as motion-ready systems so hierarchy, responsiveness, and conversion are validated early." },
    { title: "Build the stack", body: "Frontend, CMS, APIs, analytics, forms, and deployment are implemented with clean ownership and maintainable patterns." },
    { title: "Harden and launch", body: "We run browser QA, accessibility checks, performance passes, redirects, SEO basics, and deployment verification." },
  ],
  uiux: [
    { title: "Research the behavior", body: "We audit competitors, user expectations, task flows, and friction points to understand what the interface must solve." },
    { title: "Shape the journey", body: "Information architecture, wireframes, and flows turn loose ideas into a product path people can follow." },
    { title: "Design the system", body: "Screens, components, states, tokens, and interaction rules are composed into a reusable interface language." },
    { title: "Test and refine", body: "We pressure-test important moments, remove ambiguity, and prepare handoff-ready design details." },
  ],
  ecomm: [
    { title: "Structure the catalog", body: "Products, variants, collections, filters, content, and merchandising logic are shaped around how people buy." },
    { title: "Design sales paths", body: "Product pages, carts, checkout, upsells, retention touchpoints, and trust signals are designed as one flow." },
    { title: "Integrate operations", body: "Payments, shipping, inventory, tax, email, analytics, and admin workflows are connected cleanly." },
    { title: "Optimize after launch", body: "We watch performance, conversion paths, search visibility, and retention signals to improve what matters." },
  ],
  mobile: [
    { title: "Define the app rhythm", body: "We map core loops, onboarding, states, permissions, notifications, and platform-specific behaviors." },
    { title: "Prototype touch flows", body: "Navigation, gestures, empty states, and high-frequency tasks are tested before the app is built out." },
    { title: "Build and integrate", body: "React Native or native implementation connects APIs, storage, analytics, notifications, and release tooling." },
    { title: "Prepare for release", body: "We tune performance, QA devices, handle store assets, submission requirements, and post-launch monitoring." },
  ],
  seo: [
    { title: "Audit the foundation", body: "Technical health, content structure, indexing, competitors, and Core Web Vitals show where growth is blocked." },
    { title: "Build search architecture", body: "We map topics, internal links, landing pages, metadata, schema, and AI-search visibility opportunities." },
    { title: "Publish and optimize", body: "Content, page updates, technical fixes, and local/search improvements are shipped in priority order." },
    { title: "Report what compounds", body: "We track rankings, impressions, conversions, and content performance so the system improves over time." },
  ],
  crm: [
    { title: "Model the workflow", body: "We study the real operation: roles, permissions, data, status changes, handoffs, and exceptions." },
    { title: "Design operational views", body: "Dashboards, tables, forms, alerts, reports, and detail pages are mapped around daily use." },
    { title: "Build the platform", body: "Database schema, APIs, authentication, automations, integrations, and admin controls are implemented together." },
    { title: "Train and iterate", body: "We test with real scenarios, migrate data, document workflows, and refine around team feedback." },
  ],
};

function ServiceBlueprint({ svc }: { svc: ServiceData }) {
  const cards = [
    {
      label: "Scope",
      title: "Clear project shape",
      body: `We turn the ${svc.title.toLowerCase()} brief into screens, flows, integrations, content needs, and launch priorities before production gets noisy.`,
    },
    {
      label: "Delivery",
      title: "Built in connected passes",
      body: "Strategy, interface, motion, implementation, QA, and deployment move together so the final system feels intentional instead of assembled late.",
    },
    {
      label: "Handoff",
      title: "Ready to run",
      body: "You get the finished experience, the operational details behind it, and a clean path for maintenance, growth, or the next release.",
    },
  ];

  return (
    <section data-motion-section className="relative z-10 py-10 md:py-20">
      <div className="wrap">
        <div className="grid gap-5 md:grid-cols-3">
          {cards.map((card, index) => (
            <article
              key={card.title}
              className="relative min-h-[280px] overflow-hidden rounded-[1.45rem] border border-[rgba(58,191,138,0.14)] bg-[rgba(7,10,9,0.44)] p-6 backdrop-blur-md"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_28%_18%,rgba(58,191,138,0.1),transparent_52%)]" />
              <div className="relative flex h-full flex-col justify-between gap-10">
                <div className="flex items-center justify-between gap-5">
                  <span className="font-mono text-[0.54rem] uppercase tracking-[0.3em] text-[var(--teal)]">
                    {card.label}
                  </span>
                  <span className="font-mono text-[0.54rem] uppercase tracking-[0.24em] text-[var(--body)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <h3 className="hed text-[clamp(2.2rem,4vw,3.8rem)] leading-[0.9]">{card.title}</h3>
                  <p className="mt-5 text-[0.92rem] leading-[1.8] text-[var(--body)]">{card.body}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection({ svc }: { svc: ServiceData }) {
  const steps = PROCESS[svc.id] ?? PROCESS.webdev;
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const panels = panelsRef.current.filter(Boolean) as HTMLElement[];
    if (!section || !panels.length) return;

    const ctx = gsap.context(() => {
      gsap.set(panels, { autoAlpha: 0, y: 44, scale: 0.96 });
      gsap.set(panels[0], { autoAlpha: 1, y: 0, scale: 1 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      panels.forEach((panel, index) => {
        if (index > 0) {
          timeline.to(panels[index - 1], { autoAlpha: 0, y: -38, scale: 0.97, duration: 0.34 }, index);
          timeline.fromTo(
            panel,
            { autoAlpha: 0, y: 46, scale: 0.96 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.45 },
            index + 0.04
          );
        }
        timeline.to(progressRef.current, { scaleX: (index + 1) / panels.length, duration: 0.55 }, index + 0.12);
      });

      timeline.to({}, { duration: 0.2 });
    }, section);

    return () => ctx.revert();
  }, [steps.length]);

  return (
    <section ref={sectionRef} className="relative z-10 min-h-[330vh]">
      <div ref={pinRef} className="sticky top-0 flex min-h-screen items-center overflow-hidden py-20">
        <div className="absolute inset-x-0 top-1/2 h-px bg-[rgba(58,191,138,0.16)]" />
        <div className="wrap relative grid gap-12 lg:grid-cols-[0.42fr_0.58fr] lg:items-center">
          <div>
            <p className="eyebrow mb-6">Process</p>
            <h2 className="hed text-[clamp(3.4rem,7vw,7.8rem)] leading-[0.84]">
              Scroll<br />
              <span className="text-[var(--teal)]">the build.</span>
            </h2>
            <p className="mt-8 max-w-[470px] text-[0.98rem] leading-[1.9] text-[var(--body)]">
              The section holds in place while each stage appears. This is the operating rhythm behind every {svc.title.toLowerCase()} project.
            </p>
            <div className="mt-10 h-px w-full max-w-[420px] origin-left overflow-hidden bg-[rgba(248,245,238,0.12)]">
              <div ref={progressRef} className="h-full origin-left scale-x-0 bg-[var(--teal)]" />
            </div>
          </div>

          <div className="relative min-h-[440px] lg:min-h-[560px]">
            <div className="absolute inset-0 rounded-[2rem] border border-[rgba(58,191,138,0.12)] bg-[rgba(7,10,9,0.34)] backdrop-blur-md" />
            <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(ellipse_at_42%_36%,rgba(58,191,138,0.12),transparent_48%)]" />
            {steps.map((step, index) => (
              <article
                key={step.title}
                ref={node => {
                  panelsRef.current[index] = node;
                }}
                className="absolute inset-0 flex flex-col justify-between p-7 md:p-10"
              >
                <div className="flex items-start justify-between gap-6">
                  <span className="font-mono text-[0.58rem] uppercase tracking-[0.34em] text-[var(--teal)]">
                    Step {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[0.58rem] uppercase tracking-[0.28em] text-[var(--body)]">
                    {String(index + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <h3 className="hed max-w-[760px] text-[clamp(3.3rem,7vw,7.1rem)] leading-[0.82]">
                    {step.title}
                  </h3>
                  <p className="mt-8 max-w-[620px] text-[1rem] leading-[1.9] text-[var(--body)]">{step.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ServiceContent({ svc }: { svc: ServiceData }) {
  const heroRef = useRef<HTMLElement>(null);
  const techRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heroItems = heroRef.current?.querySelectorAll("[data-hero-item]");
      if (heroItems?.length) {
        gsap.fromTo(
          heroItems,
          { autoAlpha: 0, y: 34 },
          { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.9, ease: "power3.out", delay: 2.35 }
        );
      }

      if (heroRef.current && heroItems?.length) {
        gsap.to(heroItems, {
          y: -80,
          autoAlpha: 0.18,
          ease: "none",
          stagger: 0.02,
          scrollTrigger: {
            trigger: heroRef.current,
            start: "45% top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      [techRef.current, contactRef.current].forEach(element => {
        if (!element) return;
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 34 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 80%", toggleActions: "play none none reverse" },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-motion-section]").forEach(element => {
        gsap.fromTo(
          element,
          { y: 70, autoAlpha: 0.35 },
          {
            y: 0,
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: {
              trigger: element,
              start: "top bottom",
              end: "top 38%",
              scrub: 1,
            },
          }
        );
      });

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section ref={heroRef} className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20">
        <div className="wrap relative z-10">
          <div className="max-w-[780px]">
            <Link
              href="/services"
              data-hero-item
              className="mb-8 inline-flex items-center gap-3 font-mono text-[0.58rem] uppercase tracking-[0.28em] text-[var(--body)] transition-colors hover:text-[var(--teal)]"
              style={{ visibility: "hidden" }}
            >
              <span className="h-px w-8 bg-current" />
              Services
            </Link>
            <span
              data-hero-item
              className="mb-6 block font-mono text-[0.58rem] uppercase tracking-[0.38em] text-[var(--teal)]"
              style={{ visibility: "hidden" }}
            >
              {svc.num} / {SERVICE_TOTAL}
            </span>
            <h1
              data-hero-item
              className="hed text-[clamp(4rem,9vw,8.8rem)] leading-[0.84]"
              style={{ visibility: "hidden" }}
            >
              {svc.title}
            </h1>
            <p
              data-hero-item
              className="script mt-5 text-[clamp(1.1rem,2vw,1.55rem)]"
              style={{ visibility: "hidden" }}
            >
              {svc.tagline}
            </p>
            <p
              data-hero-item
              className="mt-8 max-w-[560px] text-[0.98rem] leading-[1.9] text-[var(--body)]"
              style={{ visibility: "hidden" }}
            >
              {svc.body}
            </p>
            <div data-hero-item className="mt-9 flex flex-wrap gap-4" style={{ visibility: "hidden" }}>
              <Link href="#contact" className="btn-glass">
                <span className="btn-glass-blob" aria-hidden="true" />
                <span className="btn-glass-face">Start this project</span>
              </Link>
              <Link href="/services" className="btn-glass-ghost">
                <span className="btn-glass-blob" aria-hidden="true" />
                <span className="btn-glass-face">All services →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ServiceBrickBreaker serviceTitle={svc.title} features={svc.features} tech={svc.tech} />

      <ServiceBlueprint svc={svc} />

      <ProcessSection svc={svc} />

      <section ref={techRef} data-motion-section className="relative z-10 py-14">
        <div className="wrap">
          <div className="grid gap-6 rounded-[1.75rem] border border-[rgba(58,191,138,0.14)] bg-[rgba(7,10,9,0.42)] p-7 backdrop-blur-md md:grid-cols-[0.24fr_1fr] md:items-center">
            <p className="font-mono text-[0.58rem] uppercase tracking-[0.3em] text-[var(--teal)]">Built with</p>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {svc.tech.map(tech => (
                <span key={tech} className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-[#F8F5EE]">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section ref={contactRef} data-motion-section className="relative z-10 border-t border-[rgba(58,191,138,0.12)]">
        <ImmersiveContact embedded />
      </section>
    </>
  );
}
