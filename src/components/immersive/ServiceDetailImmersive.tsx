"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import AmbientGlow from "@/components/AmbientGlow";
import ServicesDFParticles from "@/components/services/ServicesDFParticles";
import ServiceBrickBreaker from "@/components/services/ServiceBrickBreaker";
import ServiceHeroHologram from "@/features/services/[id]/ServiceHeroHologram";
import ImmersiveDeliverables from "@/components/immersive/ImmersiveDeliverables";
import ImmersiveContact from "@/components/immersive/ImmersiveContact";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { pagePath, parseCanonicalPath } from "@/lib/site-routing";
import type { PublicService } from "@/lib/public-content";

type RichItem = {
  title: string;
  description: string;
  tagline?: string;
  highlight?: boolean;
};

type ProcessItem = {
  title: string;
  description: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

function richItems(value: unknown): RichItem[] {
  if (!Array.isArray(value)) return [];
  const mapped: Array<RichItem | null> = value.map((item) => {
    if (typeof item === "string") return { title: item, description: "" };
    if (!item || typeof item !== "object") return null;
    const object = item as Record<string, unknown>;
    return {
      title: String(object.title ?? object.name ?? ""),
      description: String(object.description ?? object.body ?? ""),
      tagline: String(object.tagline ?? ""),
      highlight: Boolean(object.highlight),
    };
  });
  return mapped.filter((item): item is RichItem => Boolean(item?.title));
}

function processItems(value: unknown): ProcessItem[] {
  if (!Array.isArray(value)) return [];
  const mapped: Array<ProcessItem | null> = value.map((item) => {
    if (typeof item === "string") return { title: item, description: "" };
    if (!item || typeof item !== "object") return null;
    const object = item as Record<string, unknown>;
    return {
      title: String(object.title ?? object.name ?? ""),
      description: String(object.description ?? object.body ?? ""),
    };
  });
  return mapped.filter((item): item is ProcessItem => Boolean(item?.title));
}

function faqItems(value: unknown): FaqItem[] {
  if (!Array.isArray(value)) return [];
  const mapped: Array<FaqItem | null> = value.map((item) => {
    if (!item || typeof item !== "object") return null;
    const object = item as Record<string, unknown>;
    return {
      question: String(object.question ?? ""),
      answer: String(object.answer ?? ""),
    };
  });
  return mapped.filter((item): item is FaqItem => Boolean(item?.question));
}

function stringItems(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    if (typeof item === "string") return item;
    if (!item || typeof item !== "object") return "";
    const object = item as Record<string, unknown>;
    return String(object.title ?? object.name ?? "");
  }).filter(Boolean);
}

function stripHtml(value: string | null | undefined) {
  return (value ?? "").replace(/<[^>]*>/g, " ").replace(/\s{2,}/g, " ").trim();
}

function hologramId(service: PublicService) {
  const key = `${service.id} ${service.slug ?? ""} ${service.title}`.toLowerCase();
  if (key.includes("ui") || key.includes("ux") || key.includes("design")) return "uiux";
  if (key.includes("commerce") || key.includes("shop") || key.includes("store")) return "ecomm";
  if (key.includes("mobile") || key.includes("app")) return "mobile";
  if (key.includes("seo") || key.includes("search")) return "seo";
  if (key.includes("crm") || key.includes("booking") || key.includes("platform")) return "crm";
  return "webdev";
}

function requestFormServiceId(service: PublicService) {
  return hologramId(service);
}

function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 70% 52% at 72% 38%, rgba(var(--teal-rgb),0.08), transparent 58%), linear-gradient(180deg, rgba(var(--bg-rgb),0.96) 0%, rgba(var(--bg-rgb),1) 52%, rgba(var(--bg-rgb),0.97) 100%)",
        }}
      />
      <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(var(--teal-rgb),0.13)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--teal-rgb),0.1)_1px,transparent_1px)] [background-size:70px_70px] [mask-image:radial-gradient(ellipse_72%_62%_at_72%_40%,black,transparent_74%)]" />
    </div>
  );
}

export default function ServiceDetailImmersive({ service }: { service: PublicService }) {
  const rootRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const route = parseCanonicalPath(pathname);
  const servicesHref = route ? pagePath(route.locale, route.theme, "services") : "/en/immersive/services";
  const contactHref = route ? pagePath(route.locale, route.theme, "contact") : "/en/immersive/contact";

  const deliverables = useMemo(() => richItems(service.deliverables), [service.deliverables]);
  const process = useMemo(() => processItems(service.process), [service.process]);
  const benefits = useMemo(() => stringItems(service.benefits), [service.benefits]);
  const faqs = useMemo(() => faqItems(service.faq), [service.faq]);
  const tech = useMemo(() => service.techStackItems?.map(item => item.name) ?? stringItems(service.techStack), [service.techStack, service.techStackItems]);
  const gameFeatures = useMemo(() => {
    const fromDeliverables = deliverables.map(item => item.title);
    return [...fromDeliverables, ...benefits].slice(0, 18);
  }, [benefits, deliverables]);
  const intro = service.shortDescription || stripHtml(service.description) || service.tagline || "";
  const ctaHeadline = service.ctaHeadline || "Make it hard to forget.";
  const ctaSubtext = service.ctaSubtext || "Tell us what you need built, fixed, launched, or made sharper.";
  const ctaLabel = service.ctaButtonLabel || "Start this project";
  const ctaLink = service.ctaButtonLink || contactHref;
  const requestServiceId = requestFormServiceId(service);

  function openDeliverableRequest(deliverable: RichItem) {
    window.dispatchEvent(new CustomEvent("immersive-contact:open", {
      detail: {
        serviceId: requestServiceId,
        serviceTitle: service.title,
        deliverable: deliverable.title,
        deliverables: deliverables.map(item => item.title),
      },
    }));
  }

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-service-in]",
        { autoAlpha: 0, y: 34 },
        { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.9, ease: "power3.out", delay: 0.25 }
      );

      gsap.utils.toArray<HTMLElement>("[data-detail-section]").forEach(section => {
        gsap.fromTo(
          section,
          { autoAlpha: 0.35, y: 58 },
          {
            autoAlpha: 1,
            y: 0,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top bottom", end: "top 42%", scrub: 1 },
          }
        );
      });

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <SmoothScroll />
      <main ref={rootRef} className="relative z-[1] overflow-x-clip">
        <Background />
        <ServicesDFParticles />
        <div className="noise" />
        <AmbientGlow />
        <Navbar inner />

        <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20">
          <div className="pointer-events-none absolute inset-0 opacity-85">
            <ServiceHeroHologram serviceId={hologramId(service)} />
          </div>
          <div className="wrap relative z-10">
            <div className="max-w-[820px]">
              <Link href={servicesHref} data-service-in className="mb-8 inline-flex items-center gap-3 font-mono text-[0.58rem] uppercase tracking-[0.28em] text-[var(--body)] transition-colors hover:text-[var(--teal)]">
                <span className="h-px w-8 bg-current" />
                Services
              </Link>
              <span data-service-in className="mb-6 block font-mono text-[0.58rem] uppercase tracking-[0.38em] text-[var(--teal)]">
                Backend content / immersive service
              </span>
              <h1 data-service-in className="hed text-[clamp(4rem,9vw,8.8rem)] leading-[0.84]">
                {service.title}
              </h1>
              {service.tagline ? (
                <p data-service-in className="script mt-5 text-[clamp(1.1rem,2vw,1.55rem)] text-[var(--teal)]">
                  {service.tagline}
                </p>
              ) : null}
              {intro ? (
                <p data-service-in className="mt-8 max-w-[620px] text-[0.98rem] leading-[1.9] text-[var(--body)]">
                  {intro}
                </p>
              ) : null}
              <div data-service-in className="mt-9 flex flex-wrap gap-4">
                <Link href={ctaLink} className="btn-glass">
                  <span className="btn-glass-blob" aria-hidden="true" />
                  <span className="btn-glass-face">{ctaLabel}</span>
                </Link>
                <Link href="#stack" className="btn-glass-ghost">
                  <span className="btn-glass-blob" aria-hidden="true" />
                  <span className="btn-glass-face">Break the stack -&gt;</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section data-detail-section className="relative z-10 border-y border-[rgba(var(--teal-rgb),0.14)] py-8">
          <div className="wrap grid gap-4 md:grid-cols-4">
            {[
              ["Deliverables", deliverables.length],
              ["Process", process.length],
              ["Benefits", benefits.length],
              ["Tech", tech.length],
            ].map(([label, count]) => (
              <div key={label} className="rounded-[1rem] border border-[rgba(var(--teal-rgb),0.16)] bg-[rgba(7,10,9,0.42)] p-5 backdrop-blur-md">
                <span className="font-mono text-[0.52rem] uppercase tracking-[0.28em] text-[var(--body)]">{label}</span>
                <strong className="mt-4 block font-mono text-[2.3rem] leading-none text-[var(--teal)]">{String(count).padStart(2, "0")}</strong>
              </div>
            ))}
          </div>
        </section>

        {service.description ? (
          <section data-detail-section className="relative z-10 py-20 md:py-28">
            <div className="wrap grid gap-10 lg:grid-cols-[0.35fr_0.65fr]">
              <div>
                <p className="eyebrow mb-5">Overview</p>
                <h2 className="hed text-[clamp(3rem,6vw,6rem)] leading-[0.88]">What this<br /><span className="text-[var(--teal)]">covers.</span></h2>
              </div>
              <div className="rounded-[1.4rem] border border-[rgba(var(--teal-rgb),0.16)] bg-[rgba(7,10,9,0.44)] p-7 text-[1rem] leading-[1.9] text-[var(--body)] backdrop-blur-md md:p-9 [&_li]:mb-2 [&_p]:mb-5 [&_strong]:text-[var(--fg)] [&_ul]:ml-5" dangerouslySetInnerHTML={{ __html: service.description }} />
            </div>
          </section>
        ) : null}

        <div id="stack">
          <ServiceBrickBreaker serviceTitle={service.title} features={gameFeatures} tech={tech} />
        </div>

        {deliverables.length > 0 ? (
          <ImmersiveDeliverables deliverables={deliverables} onRequest={openDeliverableRequest} />
        ) : null}

        {process.length > 0 ? (
          <section data-detail-section className="relative z-10 overflow-hidden border-y border-[rgba(var(--teal-rgb),0.12)] py-20 md:py-28">
            <div className="wrap">
              <p className="eyebrow mb-6">Process</p>
              <h2 className="hed mb-12 text-[clamp(3.4rem,7vw,7.6rem)] leading-[0.86]">The build<br /><span className="text-[var(--teal)]">sequence.</span></h2>
              <div className="grid gap-0 rounded-[1.5rem] border border-[rgba(var(--teal-rgb),0.16)] bg-[rgba(7,10,9,0.44)] backdrop-blur-md lg:grid-cols-5">
                {process.slice(0, 5).map((step, index) => (
                  <article key={`${step.title}-${index}`} className="min-h-[300px] border-b border-[rgba(var(--teal-rgb),0.12)] p-6 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0">
                    <span className="font-mono text-[clamp(2.4rem,5vw,4.8rem)] leading-none text-[var(--teal)]">{String(index + 1).padStart(2, "0")}</span>
                    <h3 className="mt-8 text-[1.25rem] font-semibold text-[var(--fg)]">{step.title}</h3>
                    {step.description ? <p className="mt-5 text-[0.9rem] leading-[1.75] text-[var(--body)]">{step.description}</p> : null}
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {benefits.length > 0 ? (
          <section data-detail-section className="relative z-10 py-20 md:py-28">
            <div className="wrap">
              <div className="mb-10 border-b border-[rgba(var(--teal-rgb),0.14)] pb-8">
                <p className="eyebrow mb-5">Key Benefits</p>
                <h2 className="hed text-[clamp(3.4rem,7vw,7.6rem)] leading-[0.86]">Why it<br /><span className="text-[var(--teal)]">works.</span></h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {benefits.map((benefit, index) => (
                  <article key={`${benefit}-${index}`} className="min-h-[190px] rounded-[1.2rem] border border-[rgba(var(--teal-rgb),0.15)] bg-[rgba(7,10,9,0.42)] p-6 backdrop-blur-md">
                    <span className="font-mono text-[0.54rem] uppercase tracking-[0.28em] text-[var(--teal)]">{String(index + 1).padStart(2, "0")}</span>
                    <p className="mt-8 text-[0.96rem] leading-[1.75] text-[var(--body)]">{benefit}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {faqs.length > 0 ? (
          <section data-detail-section className="relative z-10 border-y border-[rgba(var(--teal-rgb),0.12)] py-20 md:py-28">
            <div className="wrap grid gap-10 lg:grid-cols-[0.35fr_0.65fr]">
              <h2 className="hed text-[clamp(3.4rem,7vw,7.6rem)] leading-[0.86]">Questions.</h2>
              <div className="space-y-3">
                {faqs.map((item, index) => (
                  <details key={`${item.question}-${index}`} className="group rounded-[1rem] border border-[rgba(var(--teal-rgb),0.16)] bg-[rgba(7,10,9,0.44)] p-5 backdrop-blur-md">
                    <summary className="cursor-pointer list-none font-semibold text-[var(--fg)]">{item.question}</summary>
                    <div className="mt-5 text-[0.92rem] leading-[1.8] text-[var(--body)]" dangerouslySetInnerHTML={{ __html: item.answer }} />
                  </details>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {service.relatedProjects?.length ? (
          <section data-detail-section className="relative z-10 py-20 md:py-28">
            <div className="wrap">
              <p className="eyebrow mb-6">Related Work</p>
              <div className="grid gap-5 md:grid-cols-3">
                {service.relatedProjects.map(project => (
                  <article key={project.id} className="overflow-hidden rounded-[1.2rem] border border-[rgba(var(--teal-rgb),0.16)] bg-[rgba(7,10,9,0.44)] backdrop-blur-md">
                    {project.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={project.coverImage} alt={project.title} className="aspect-[1.45] w-full object-cover" />
                    ) : null}
                    <div className="p-5">
                      {project.category ? <p className="font-mono text-[0.52rem] uppercase tracking-[0.24em] text-[var(--teal)]">{project.category}</p> : null}
                      <h3 className="mt-3 text-[1.3rem] font-semibold text-[var(--fg)]">{project.title}</h3>
                      {project.description ? <p className="mt-3 text-[0.9rem] leading-[1.7] text-[var(--body)]">{project.description}</p> : null}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section data-detail-section className="relative z-10 border-t border-[rgba(var(--teal-rgb),0.12)] py-20 md:py-28">
          <div className="wrap text-center">
            <p className="eyebrow mb-6">Ready to start?</p>
            <h2 className="hed mx-auto max-w-[920px] text-[clamp(3.4rem,7vw,7.8rem)] leading-[0.86]">{ctaHeadline}</h2>
            <p className="mx-auto mt-8 max-w-[560px] text-[1rem] leading-[1.8] text-[var(--body)]">{ctaSubtext}</p>
            <Link href={ctaLink} className="btn-glass mt-10 inline-flex">
              <span className="btn-glass-blob" aria-hidden="true" />
              <span className="btn-glass-face">{ctaLabel}</span>
            </Link>
          </div>
        </section>

        <section className="relative z-10 border-t border-[rgba(var(--teal-rgb),0.12)]">
          <ImmersiveContact embedded />
        </section>
      </main>
    </>
  );
}
