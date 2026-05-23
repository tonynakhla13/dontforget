"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type { ServiceData } from "./page";

const SERVICE_TOTAL = "06";

type RelatedProject = {
  id: string;
  slug?: string | null;
  title: string;
  category?: string | null;
  year?: string | null;
  description?: string | null;
  coverImage?: string | null;
};

const RELATED_FALLBACK: RelatedProject[] = [
  {
    id: "elia-clinic",
    slug: "elia-clinic",
    title: "Elia Clinic",
    category: "Healthcare",
    year: "2025",
    description: "Calm medical web experience built for credibility, conversion, and speed.",
    coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&q=85&auto=format&fit=crop",
  },
  {
    id: "montgab",
    slug: "montgab",
    title: "Montgab",
    category: "E-Commerce",
    year: "2025",
    description: "A tactile storefront with product storytelling, checkout clarity, and editorial rhythm.",
    coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=85&auto=format&fit=crop",
  },
  {
    id: "launchpad",
    slug: "launchpad",
    title: "Launchpad",
    category: "SaaS Platform",
    year: "2026",
    description: "Developer-focused dashboard shaped around speed, collaboration, and clean workflow.",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=85&auto=format&fit=crop",
  },
];

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

const TECH_MARKS: Record<string, string> = {
  "Next.js": "N",
  React: "R",
  TypeScript: "TS",
  "Tailwind CSS": "TW",
  GSAP: "G",
  Figma: "F",
  FigJam: "FJ",
  Maze: "MZ",
  Hotjar: "HJ",
  Principle: "PR",
  Shopify: "S",
  WooCommerce: "WC",
  Salla: "SA",
  Stripe: "ST",
  Klaviyo: "K",
  "React Native": "RN",
  Swift: "SW",
  Kotlin: "KT",
  Expo: "EX",
  Firebase: "FB",
  Ahrefs: "AH",
  "Screaming Frog": "SF",
  GSC: "GS",
  Semrush: "SE",
  Perplexity: "PX",
  PostgreSQL: "PG",
  Prisma: "P",
  Redis: "RD",
  Zapier: "Z",
};

function FeatureBand({ label, index }: { label: string; index: number }) {
  return (
    <li
      data-feature-row
      className="grid gap-4 border-t border-[rgba(58,191,138,0.12)] py-6 md:grid-cols-[0.18fr_1fr]"
    >
      <span className="font-mono text-[0.56rem] uppercase tracking-[0.3em] text-[var(--teal)]">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="font-mono text-[0.76rem] uppercase tracking-[0.18em] text-[#F8F5EE]">
        {label}
      </span>
    </li>
  );
}

function ProcessSection({ svc }: { svc: ServiceData }) {
  const steps = PROCESS[svc.id] ?? PROCESS.webdev;
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const panels = panelsRef.current.filter(Boolean) as HTMLDivElement[];
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

function TechnologyCarousel({ tech }: { tech: readonly string[] }) {
  const items = [...tech, ...tech, ...tech];

  return (
    <section data-motion-section className="relative z-10 py-24">
      <div className="wrap">
        <div className="mb-10 flex flex-col justify-between gap-5 border-y border-[rgba(58,191,138,0.12)] py-8 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-4">Technology stack</p>
            <h2 className="hed text-[clamp(2.6rem,5vw,5.4rem)] leading-[0.9]">
              Tools in<br />
              <span className="text-[var(--teal)]">motion.</span>
            </h2>
          </div>
          <p className="max-w-[520px] text-[0.95rem] leading-[1.85] text-[var(--body)]">
            The stack changes by project, but these are the tools usually involved in this service path.
          </p>
        </div>
      </div>

      <div className="overflow-hidden border-y border-[rgba(58,191,138,0.1)] py-5">
        <div className="service-tech-track flex w-max gap-4">
          {items.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="flex min-w-[220px] items-center gap-4 rounded-[1.1rem] border border-[rgba(58,191,138,0.16)] bg-[rgba(7,10,9,0.5)] px-5 py-4 backdrop-blur-md"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[0.9rem] border border-[rgba(58,191,138,0.26)] bg-[rgba(58,191,138,0.08)] font-mono text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[var(--teal)]">
                {TECH_MARKS[item] ?? item.slice(0, 2)}
              </span>
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-[#F8F5EE]">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .service-tech-track {
          animation: service-tech-marquee 26s linear infinite;
        }
        @keyframes service-tech-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .service-tech-track { animation: none; }
        }
      `}</style>
    </section>
  );
}

function RelatedWorkSection({ serviceId }: { serviceId: string }) {
  const [projects, setProjects] = useState<RelatedProject[]>(RELATED_FALLBACK);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) return;
        const data = (await response.json()) as RelatedProject[];
        if (!cancelled && data.length) setProjects(data.slice(0, 3));
      } catch {
        // Fallback projects keep the section populated when the API is unavailable.
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [serviceId]);

  const related = useMemo(() => projects.slice(0, 3), [projects]);

  return (
    <section data-motion-section className="relative z-10 py-24 md:py-32">
      <div className="wrap">
        <div className="mb-10 flex flex-col justify-between gap-5 border-y border-[rgba(58,191,138,0.12)] py-8 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-4">Related work</p>
            <h2 className="hed text-[clamp(2.8rem,5vw,5.6rem)] leading-[0.9]">
              Proof in<br />
              <span className="text-[var(--teal)]">production.</span>
            </h2>
          </div>
          <Link href="/work" className="btn btn-outline self-start md:self-auto">
            See all work →
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {related.map(project => (
            <Link
              key={project.id}
              href={`/work/${project.slug ?? project.id}`}
              data-related-card
              className="group relative min-h-[430px] overflow-hidden rounded-[1.5rem] border border-[rgba(58,191,138,0.14)] bg-[rgba(7,10,9,0.48)]"
            >
              {project.coverImage ? (
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  className="object-cover opacity-62 transition duration-700 group-hover:scale-[1.04] group-hover:opacity-80"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-[rgba(58,191,138,0.06)]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/48 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="mb-3 font-mono text-[0.56rem] uppercase tracking-[0.24em] text-[var(--teal)]">
                  {project.category ?? project.year ?? "Project"}
                </p>
                <h3 className="hed text-[2.4rem] leading-[0.9]">{project.title}</h3>
                {project.description && (
                  <p className="mt-4 line-clamp-3 text-[0.86rem] leading-[1.7] text-white/68">{project.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ServiceContent({ svc }: { svc: ServiceData }) {
  const heroRef = useRef<HTMLElement>(null);
  const featureRef = useRef<HTMLElement>(null);
  const techRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

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

      const featureRows = featureRef.current?.querySelectorAll("[data-feature-row]");
      if (featureRows?.length) {
        gsap.fromTo(
          featureRows,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.07,
            duration: 0.65,
            ease: "power3.out",
            scrollTrigger: { trigger: featureRef.current, start: "top 76%", toggleActions: "play none none reverse" },
          }
        );
      }

      [techRef.current, ctaRef.current].forEach(element => {
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

      gsap.utils.toArray<HTMLElement>("[data-related-card]").forEach((element, index) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 42, scale: 0.96 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            delay: index * 0.06,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 84%", toggleActions: "play none none reverse" },
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
              <Link href="/#contact" className="btn btn-primary btn-ripple">
                Start this project
              </Link>
              <Link href="/services" className="btn btn-outline">
                All services →
              </Link>
            </div>
          </div>

        </div>
      </section>

      <section ref={featureRef} data-motion-section className="relative z-10 py-24 md:py-32">
        <div className="wrap grid gap-12 border-y border-[rgba(58,191,138,0.12)] py-12 lg:grid-cols-[0.38fr_0.62fr]">
          <div>
            <p className="eyebrow mb-6">What&apos;s included</p>
            <h2 className="hed text-[clamp(3rem,6vw,6rem)] leading-[0.9]">
              Built as<br />
              <span className="text-[var(--teal)]">a system.</span>
            </h2>
          </div>
          <ul>
            {svc.features.map((feature, index) => (
              <FeatureBand key={feature} label={feature} index={index} />
            ))}
          </ul>
        </div>
      </section>

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

      <TechnologyCarousel tech={svc.tech} />

      <RelatedWorkSection serviceId={svc.id} />

      <section ref={ctaRef} data-motion-section className="relative z-10 section-py text-center">
        <div className="wrap">
          <p className="eyebrow mb-6">Ready to build?</p>
          <h2 className="hed text-[clamp(3rem,6vw,5.8rem)] leading-[0.9]">
            Let&apos;s make this<br />
            <span className="text-[var(--teal)]">unforgettable.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-[520px] text-[0.95rem] leading-[1.9] text-[var(--body)]">
            We take on a small number of projects at a time so the strategy, interface, and engineering all stay sharp.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/#contact" className="btn btn-primary btn-ripple">
              Start the conversation →
            </Link>
            <Link href="/services" className="btn btn-outline">
              Back to services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
