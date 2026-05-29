"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PublicService } from "@/lib/public-content";
import CreativeNavbar from "@/components/creative/CreativeNavbar";
import CreativeFooter from "@/components/creative/CreativeFooter";

gsap.registerPlugin(ScrollTrigger);

/* ── coercion helpers ─────────────────────────────────────────────────────── */
type Deliverable = { title: string; description: string; icon: string; image: string; highlight: boolean };
type ProcessItem  = { title: string; description: string };
type FaqItem      = { question: string; answer: string };
type TechItem     = { id: string; name: string; icon: string | null; iconUrl: string | null };

function toDeliverables(val: unknown): Deliverable[] {
  if (!Array.isArray(val)) return [];
  return val.map((item) => {
    if (typeof item === "object" && item !== null) {
      const o = item as Record<string, unknown>;
      return { title: String(o.title ?? ""), description: String(o.description ?? ""), icon: String(o.icon ?? ""), image: String(o.image ?? ""), highlight: Boolean(o.highlight) };
    }
    if (typeof item === "string") return { title: item, description: "", icon: "", image: "", highlight: false };
    return null;
  }).filter((d): d is Deliverable => !!d && !!d.title);
}
function toProcess(val: unknown): ProcessItem[] {
  if (!Array.isArray(val)) return [];
  return val.map((item) => {
    if (typeof item === "object" && item !== null) {
      const o = item as Record<string, unknown>;
      return { title: String(o.title ?? o.name ?? ""), description: String(o.description ?? o.body ?? "") };
    }
    if (typeof item === "string") return { title: item, description: "" };
    return null;
  }).filter((s): s is ProcessItem => !!s && !!s.title);
}
function toFaq(val: unknown): FaqItem[] {
  if (!Array.isArray(val)) return [];
  return val.map((item) => {
    if (typeof item === "object" && item !== null) {
      const o = item as Record<string, unknown>;
      return { question: String(o.question ?? ""), answer: String(o.answer ?? "") };
    }
    return null;
  }).filter((f): f is FaqItem => !!f && !!f.question);
}
function toStringArray(val: unknown): string[] {
  if (!Array.isArray(val)) return [];
  return val.map((item) => {
    if (typeof item === "string") return item;
    if (item && typeof item === "object") return String((item as Record<string, unknown>).title ?? (item as Record<string, unknown>).name ?? "");
    return "";
  }).filter(Boolean);
}

/* ── pixel icons ─────────────────────────────────────────────────────────── */
const PIXEL_ICONS = [
  <svg key={0} width={36} height={36} viewBox="0 0 16 16" fill="currentColor" shapeRendering="crispEdges">
    <rect x={2} y={0} width={9} height={1}/><rect x={2} y={1} width={10} height={1}/><rect x={2} y={2} width={10} height={1}/>
    <rect x={2} y={3} width={10} height={1}/><rect x={2} y={4} width={10} height={1}/><rect x={2} y={5} width={10} height={1}/>
    <rect x={2} y={6} width={10} height={1}/><rect x={2} y={7} width={10} height={1}/><rect x={2} y={8} width={10} height={1}/>
    <rect x={2} y={9} width={10} height={1}/><rect x={2} y={10} width={10} height={1}/><rect x={2} y={11} width={10} height={1}/>
    <rect x={4} y={3} width={6} height={1} fill="white" opacity={0.3}/><rect x={4} y={5} width={6} height={1} fill="white" opacity={0.3}/>
    <rect x={4} y={7} width={4} height={1} fill="white" opacity={0.3}/>
  </svg>,
  <svg key={1} width={36} height={36} viewBox="0 0 16 16" fill="currentColor" shapeRendering="crispEdges">
    <rect x={0} y={2} width={16} height={12}/>
    <rect x={1} y={3} width={14} height={10} fill="white" opacity={0.08}/>
    <rect x={2} y={5} width={3} height={1} fill="white" opacity={0.7}/><rect x={1} y={6} width={1} height={1} fill="white" opacity={0.7}/>
    <rect x={2} y={7} width={1} height={1} fill="white" opacity={0.7}/><rect x={1} y={8} width={1} height={1} fill="white" opacity={0.7}/>
    <rect x={2} y={9} width={3} height={1} fill="white" opacity={0.7}/><rect x={10} y={5} width={3} height={1} fill="white" opacity={0.7}/>
    <rect x={13} y={6} width={1} height={1} fill="white" opacity={0.7}/><rect x={12} y={7} width={1} height={1} fill="white" opacity={0.7}/>
    <rect x={13} y={8} width={1} height={1} fill="white" opacity={0.7}/><rect x={10} y={9} width={3} height={1} fill="white" opacity={0.7}/>
    <rect x={6} y={4} width={1} height={8} fill="white" opacity={0.25}/>
    <rect x={8} y={5} width={2} height={1} fill="white" opacity={0.5}/><rect x={7} y={7} width={3} height={1} fill="white" opacity={0.5}/>
    <rect x={8} y={9} width={2} height={1} fill="white" opacity={0.5}/>
  </svg>,
  <svg key={2} width={36} height={36} viewBox="0 0 16 16" fill="currentColor" shapeRendering="crispEdges">
    <rect x={1} y={4} width={14} height={3}/><rect x={1} y={8} width={14} height={3}/><rect x={1} y={12} width={14} height={3}/>
    <rect x={2} y={5} width={12} height={1} fill="white" opacity={0.2}/>
    <rect x={2} y={9} width={12} height={1} fill="white" opacity={0.2}/>
    <rect x={2} y={13} width={12} height={1} fill="white" opacity={0.2}/>
  </svg>,
  <svg key={3} width={36} height={36} viewBox="0 0 16 16" fill="currentColor" shapeRendering="crispEdges">
    <rect x={0} y={13} width={16} height={1}/><rect x={0} y={0} width={1} height={14}/>
    <rect x={3} y={9} width={2} height={4}/><rect x={7} y={5} width={2} height={8}/><rect x={11} y={2} width={2} height={11}/>
  </svg>,
  <svg key={4} width={36} height={36} viewBox="0 0 16 16" fill="currentColor" shapeRendering="crispEdges">
    <rect x={2} y={0} width={1} height={12}/><rect x={3} y={1} width={1} height={1}/><rect x={4} y={2} width={1} height={1}/>
    <rect x={5} y={3} width={1} height={1}/><rect x={6} y={4} width={1} height={1}/><rect x={7} y={5} width={1} height={1}/>
    <rect x={6} y={6} width={2} height={1}/><rect x={7} y={7} width={1} height={1}/><rect x={8} y={6} width={1} height={4}/>
    <rect x={7} y={9} width={1} height={4}/><rect x={6} y={10} width={1} height={4}/>
  </svg>,
  <svg key={5} width={36} height={36} viewBox="0 0 16 16" fill="currentColor" shapeRendering="crispEdges">
    <rect x={7} y={1} width={2} height={2}/><rect x={7} y={13} width={2} height={2}/>
    <rect x={1} y={7} width={2} height={2}/><rect x={13} y={7} width={2} height={2}/>
    <rect x={4} y={4} width={2} height={2}/><rect x={10} y={4} width={2} height={2}/>
    <rect x={4} y={10} width={2} height={2}/><rect x={10} y={10} width={2} height={2}/>
    <rect x={6} y={6} width={4} height={4}/>
  </svg>,
];

/* ── faq icons (circle style matching home FAQ) ───────────────────────────── */
function PlusIcon() {
  return (
    <svg viewBox="0 0 49 49" fill="none" width={49} height={49}>
      <circle cx="24.5" cy="24.5" r="24" fill="transparent" stroke="#231F20" />
      <path d="M16 24.5 L33 24.5 M24.5 16 L24.5 33" stroke="#231F20" strokeWidth="2" />
    </svg>
  );
}
function MinusIcon() {
  return (
    <svg viewBox="0 0 49 49" fill="none" width={49} height={49}>
      <circle cx="24.5" cy="24.5" r="24" fill="#46D12A" stroke="#231F20" />
      <path d="M16 24.5 L33 24.5" stroke="#231F20" strokeWidth="2" />
    </svg>
  );
}

/* ── brand glyphs ─────────────────────────────────────────────────────────── */
function BrandO({ size = 120, opacity = 0.06 }: { size?: number; opacity?: number }) {
  return (
    <div aria-hidden style={{
      width: size, height: size, borderRadius: "50%",
      border: "2px solid currentColor", opacity, flexShrink: 0, display: "inline-block",
    }} />
  );
}
function BrandI({ height = 80, opacity = 0.08 }: { height?: number; opacity?: number }) {
  return (
    <div aria-hidden style={{
      width: 3, height, background: "currentColor",
      opacity, flexShrink: 0, display: "inline-block",
    }} />
  );
}

/* ── tech carousel ────────────────────────────────────────────────────────── */
function CreativeTechCarousel({ items }: { items: TechItem[] }) {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef   = useRef<number>(0);
  const posRef   = useRef(0);
  const pauseRef = useRef(false);
  const dragRef  = useRef({ active: false, startX: 0, startPos: 0 });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const half = track.scrollWidth / 2;
    function tick() {
      if (!pauseRef.current) {
        posRef.current += 0.55;
        if (posRef.current >= half) posRef.current -= half;
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  function onMouseDown(e: React.MouseEvent) {
    dragRef.current = { active: true, startX: e.clientX, startPos: posRef.current };
    pauseRef.current = true;
    if (wrapRef.current) wrapRef.current.style.cursor = "grabbing";
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!dragRef.current.active) return;
    const track = trackRef.current;
    if (!track) return;
    const half = track.scrollWidth / 2;
    let next = dragRef.current.startPos - (e.clientX - dragRef.current.startX);
    if (next < 0) next += half;
    if (next >= half) next -= half;
    posRef.current = next;
    track.style.transform = `translateX(-${next}px)`;
  }
  function onMouseUp() { dragRef.current.active = false; if (wrapRef.current) wrapRef.current.style.cursor = "grab"; }
  function onMouseEnter() { pauseRef.current = true; if (wrapRef.current) wrapRef.current.style.cursor = "grab"; }
  function onMouseLeave() { dragRef.current.active = false; pauseRef.current = false; if (wrapRef.current) wrapRef.current.style.cursor = "grab"; }

  const doubled = [...items, ...items];
  return (
    <div
      ref={wrapRef}
      className="c-svc-tech-carousel"
      onMouseEnter={onMouseEnter}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      <div ref={trackRef} className="c-svc-tech-carousel__track">
        {doubled.map((item, i) => (
          <div key={i} className="c-svc-tech-pill">
            {item.iconUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.iconUrl} alt={item.name} className="c-svc-tech-pill__img" draggable={false} />
            ) : (
              <span className="c-svc-tech-pill__abbr" aria-hidden="true">{item.name.slice(0, 2).toUpperCase()}</span>
            )}
            <span className="c-svc-tech-pill__name">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── component ────────────────────────────────────────────────────────────── */
export default function ServiceDetailCreative({ service, locale }: { service: PublicService; locale: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  const deliverables    = toDeliverables(service.deliverables);
  const processSteps    = toProcess(service.process).slice(0, 5);
  const benefits        = toStringArray(service.benefits);
  const faqItems        = toFaq(service.faq);
  const techItems       = (service.techStackItems ?? []) as TechItem[];
  const relatedProjects = service.relatedProjects ?? [];

  const icon        = service.icon ?? "";
  const heroImage   = service.attachments?.creative?.hero?.[0] ?? null;
  const ctaHeadline = service.ctaHeadline || "Let's make it hard to forget.";
  const ctaLink     = service.ctaButtonLink  || `/${locale}/creative/contact`;
  const ctaLabel    = service.ctaButtonLabel || "Get started";
  const hasStats    = deliverables.length > 0 || processSteps.length > 0 || benefits.length > 0;

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* ── HERO: word-split title ───────────────────────────────────────── */
      const titleEl = rootRef.current?.querySelector<HTMLElement>(".c-svc-hero__title");
      if (titleEl) {
        const raw = titleEl.textContent ?? "";
        titleEl.innerHTML = raw
          .split(" ")
          .map((w) => `<span class="c-svc-word"><span class="c-svc-word__i">${w}</span></span>`)
          .join(" ");
      }

      const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });
      heroTl
        .from(".c-svc-hero__back",  { x: -32, opacity: 0, duration: 0.5 }, 0.05)
        .from(".c-svc-hero__icon",  { scale: 0, opacity: 0, duration: 0.55, ease: "back.out(2.4)" }, 0.15)
        .from(".c-svc-hero__title .c-svc-word__i",
          { y: "110%", duration: 0.75, stagger: 0.065 }, 0.2)
        .from(".c-svc-hero__tagline", { y: 22, opacity: 0, duration: 0.55 }, 0.65)
        .from(".c-svc-hero__img-wrap",
          { scale: 1.08, opacity: 0, duration: 0.9, ease: "power2.out" }, 0.3)
        .from(".c-svc-hero__glyphs", { opacity: 0, duration: 0.8 }, 0.45);

      /* ── STATS: count up ─────────────────────────────────────────────── */
      rootRef.current?.querySelectorAll<HTMLElement>(".c-svc-stat__n").forEach((el) => {
        const end = parseInt(el.textContent?.replace(/\D/g, "") ?? "0", 10);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: end, duration: 1.4, ease: "power2.out",
          onUpdate() { el.textContent = String(Math.round(obj.val)).padStart(2, "0"); },
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      /* ── SECTION EYEBROWS ────────────────────────────────────────────── */
      gsap.utils.toArray<HTMLElement>([
        ".c-svc-deliverables__eyebrow", ".c-svc-process__label",
        ".c-svc-benfits-eyebrow", ".c-svc-tech-section__eyebrow",
        ".c-svc-overview__label",
      ]).forEach((el) => {
        gsap.from(el, {
          x: -24, opacity: 0, duration: 0.5, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      /* ── SECTION H2 TITLES ───────────────────────────────────────────── */
      gsap.utils.toArray<HTMLElement>([
        ".c-svc-deliverables__title", ".c-svc-process__title",
        ".c-svc-benfits-title", ".c-svc-tech-section__title",
      ]).forEach((el) => {
        gsap.from(el, {
          y: 44, opacity: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });

      /* ── OVERVIEW DESC ───────────────────────────────────────────────── */
      gsap.from(".c-svc-overview__desc", {
        y: 30, opacity: 0, duration: 0.75, ease: "power3.out",
        scrollTrigger: { trigger: ".c-svc-overview__desc", start: "top 85%", once: true },
      });

      /* ── DELIVERABLES: stagger scale + alternating x ─────────────────── */
      gsap.utils.toArray<HTMLElement>(".c-svc-dbox").forEach((el, i) => {
        gsap.from(el, {
          y: 60, x: i % 2 === 0 ? -22 : 22, scale: 0.93, opacity: 0,
          duration: 0.75, ease: "power3.out", delay: i * 0.08,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });

      /* ── PROCESS STEPS ───────────────────────────────────────────────── */
      gsap.utils.toArray<HTMLElement>(".c-svc-step").forEach((el, i) => {
        gsap.from(el, {
          y: 48, opacity: 0, duration: 0.7, ease: "power3.out", delay: i * 0.09,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      /* ── BENEFITS ────────────────────────────────────────────────────── */
      gsap.utils.toArray<HTMLElement>(".c-svc-bcard").forEach((el, i) => {
        gsap.from(el, {
          y: 28, opacity: 0, duration: 0.5, ease: "power2.out", delay: i * 0.07,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      /* ── FAQ ROWS ────────────────────────────────────────────────────── */
      gsap.utils.toArray<HTMLElement>(".c-faq__row").forEach((el, i) => {
        gsap.from(el, {
          y: 20, opacity: 0, duration: 0.45, ease: "power2.out", delay: i * 0.05,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      /* ── CTA: staggered timeline ─────────────────────────────────────── */
      const ctaTl = gsap.timeline({
        scrollTrigger: { trigger: ".c-svc-cta", start: "top 75%", once: true },
      });
      ctaTl
        .from(".c-svc-cta__eyebrow", { x: -24, opacity: 0, duration: 0.5, ease: "power2.out" })
        .from(".c-svc-cta__title",   { y: 56, opacity: 0, duration: 0.85, ease: "power4.out" }, 0.15)
        .from(".c-svc-cta__sub",     { y: 20, opacity: 0, duration: 0.5 }, 0.45)
        .from(".c-svc-cta .c-btn",   { scale: 0.85, opacity: 0, duration: 0.45, ease: "back.out(1.8)" }, 0.55);

    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      <CreativeNavbar active="services" />

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section className="c-svc-hero">
        <div className="c-svc-hero__art" aria-hidden="true" />
        <div aria-hidden className="c-svc-hero__glyphs">
          <BrandO size={220} opacity={0.05} />
          <BrandI height={120} opacity={0.07} />
          <BrandO size={80} opacity={0.04} />
        </div>
        <Link href={`/${locale}/creative/services`} className="c-svc-hero__back">
          ← All Services
        </Link>
        {icon && <div className="c-svc-hero__icon">{icon}</div>}
        <div className="c-svc-hero__body">
          <div className="c-svc-hero__text">
            <h1 className="c-svc-hero__title">{service.title}</h1>
            {service.tagline && <p className="c-svc-hero__tagline">{service.tagline}</p>}
          </div>
          {heroImage && (
            <div className="c-svc-hero__img-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroImage} alt="" className="c-svc-hero__img" />
            </div>
          )}
        </div>
      </section>

      {/* ══ STATS BAR ═════════════════════════════════════════════════════ */}
      {hasStats && (
        <div className="c-svc-stats" role="list" aria-label="Service stats">
          {deliverables.length > 0 && (
            <div className="c-svc-stat" role="listitem">
              <span className="c-svc-stat__n">{String(deliverables.length).padStart(2, "0")}</span>
              <span className="c-svc-stat__l">Deliverables</span>
            </div>
          )}
          {processSteps.length > 0 && (
            <div className="c-svc-stat" role="listitem">
              <span className="c-svc-stat__n">{String(processSteps.length).padStart(2, "0")}</span>
              <span className="c-svc-stat__l">Process steps</span>
            </div>
          )}
          {benefits.length > 0 && (
            <div className="c-svc-stat" role="listitem">
              <span className="c-svc-stat__n">{String(benefits.length).padStart(2, "0")}</span>
              <span className="c-svc-stat__l">Key benefits</span>
            </div>
          )}
        </div>
      )}

      {/* ══ OVERVIEW ══════════════════════════════════════════════════════ */}
      {service.shortDescription && (
        <section className="c-svc-overview">
          <div aria-hidden className="c-svc-overview__ibar"><BrandI height={200} opacity={0.12} /></div>
          <div aria-hidden className="c-svc-overview__ring c-svc-overview__ring--spin" />
          <div className="c-svc-overview__content">
            <p className="c-svc-overview__desc">{service.shortDescription}</p>
            <div className="c-svc-overview__meta">
              <div aria-hidden className="c-svc-overview__dots">
                <BrandO size={40} opacity={0.5} />
                <BrandO size={24} opacity={0.3} />
                <BrandO size={14} opacity={0.2} />
              </div>
              <span className="c-svc-overview__label">/ {service.title}</span>
            </div>
          </div>
        </section>
      )}

      {/* ══ TECH CAROUSEL ═════════════════════════════════════════════════ */}
      {techItems.length > 0 && (
        <section className="c-svc-tech-section">
          <div className="c-svc-tech-section__head">
            <span className="c-svc-tech-section__eyebrow">— Tools &amp; Technologies</span>
            <h2 className="c-svc-tech-section__title">The Stack.</h2>
            <span className="c-svc-tech-section__count">{techItems.length} in stack</span>
          </div>
          <CreativeTechCarousel items={techItems} />
        </section>
      )}

      {/* ══ DELIVERABLES ══════════════════════════════════════════════════ */}
      {deliverables.length > 0 && (
        <section className="c-svc-deliverables">
          <div className="c-svc-deliverables__head">
            <div>
              <span className="c-svc-deliverables__eyebrow">— What's included</span>
              <h2 className="c-svc-deliverables__title">Deliverables.</h2>
            </div>
          </div>
          <div className="c-svc-dbox-grid">
            {deliverables.map((d, i) => (
              <div key={i} className={`c-svc-dbox${d.highlight ? " c-svc-dbox--feat" : ""}`}>
                {/* watermark number — decorative bg layer */}
                <span className="c-svc-dbox__watermark" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {/* top row: number + badge */}
                <div className="c-svc-dbox__top">
                  <span className="c-svc-dbox__num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="c-svc-dbox__creative-badge">✦ Creative</span>
                </div>
                {/* image strip — only if set in DB */}
                {d.image && (
                  <div className="c-svc-dbox__img-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={d.image} alt={d.title} className="c-svc-dbox__img" />
                  </div>
                )}
                {/* body */}
                <h3 className="c-svc-dbox__title">{d.title}</h3>
                {d.description && (
                  <p className="c-svc-dbox__desc" dangerouslySetInnerHTML={{ __html: d.description }} />
                )}
                {/* CTA — slides in on hover */}
                <div className="c-svc-dbox__cta-wrap">
                  <Link href={`/${locale}/creative/contact`} className="c-svc-dbox__cta">
                    Start this project →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══ PROCESS ═══════════════════════════════════════════════════════ */}
      {processSteps.length > 0 && (
        <section className="c-svc-process">
          <div className="c-svc-process__head">
            <span className="c-svc-process__label">— How we deliver</span>
            <h2 className="c-svc-process__title">The Process.</h2>
          </div>
          <div
            className="c-svc-process__grid"
            style={{ "--step-count": processSteps.length } as React.CSSProperties}
          >
            {processSteps.map((step, i) => (
              <div key={i} className="c-svc-step">
                <span className="c-svc-step__num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="c-svc-step__title">{step.title}</h3>
                {step.description && <p className="c-svc-step__desc">{step.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══ BENEFITS ══════════════════════════════════════════════════════ */}
      {benefits.length > 0 && (
        <section className="c-svc-benfits-section">
          <div className="c-svc-benfits-head">
            <span className="c-svc-benfits-eyebrow">— What you gain</span>
            <h2 className="c-svc-benfits-title">Built to deliver.</h2>
          </div>
          <div className="c-svc-benfits-grid">
            {benefits.map((b, i) => (
              <div key={i} className="c-svc-bcard" style={{ animationDelay: `${i * 0.08}s` }}>
                <span className="c-svc-bcard__num">{String(i + 1).padStart(2, "0")}</span>
                <span className="c-svc-bcard__text">{b}</span>
                <div aria-hidden className="c-svc-bcard__accent" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══ FULL DESCRIPTION ══════════════════════════════════════════════ */}
      {service.description && (
        <section className="c-svc-prose-section">
          <div className="c-svc-prose" dangerouslySetInnerHTML={{ __html: service.description }} />
        </section>
      )}

      {/* ══ FAQ ═══════════════════════════════════════════════════════════ */}
      {faqItems.length > 0 && (
        <section className="c-faq">
          <div className="c-faq__head">
            <div className="c-faq__head-inner">
              <span>FAQ</span>
              <span className="c-faq__star" aria-hidden="true" />
            </div>
          </div>
          {faqItems.map((item, i) => (
            <div
              key={i}
              className={`c-faq__row${openFaq === i ? " c-faq__row--open" : ""}`}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div className="c-faq__q">
                <div className="c-faq__q-text">{item.question}</div>
              </div>
              {openFaq === i ? (
                <div className="c-faq__a">
                  <div className="c-faq__a-text" dangerouslySetInnerHTML={{ __html: item.answer }} />
                  <button
                    className="c-faq__btn"
                    aria-label="Close"
                    onClick={(e) => { e.stopPropagation(); setOpenFaq(null); }}
                  >
                    <MinusIcon />
                  </button>
                </div>
              ) : (
                <button className="c-faq__btn" aria-label="Expand">
                  <PlusIcon />
                </button>
              )}
            </div>
          ))}
        </section>
      )}

      {/* ══ RELATED PROJECTS ══════════════════════════════════════════════ */}
      {relatedProjects.length > 0 && (
        <section className="c-svc-related">
          <div className="c-svc-related__head">
            <span className="c-svc-related__eyebrow">— See it in the wild</span>
            <h2 className="c-svc-related__title">Related Work.</h2>
          </div>
          <div className="c-svc-related__grid">
            {relatedProjects.map((p) => (
              <Link key={p.id} href={`/${locale}/creative/projects/${p.slug}`} className="c-svc-rcard">
                <div className="c-svc-rcard__img-wrap">
                  {p.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.coverImage} alt={p.title} className="c-svc-rcard__img" />
                  ) : (
                    <div className="c-svc-rcard__img-placeholder" />
                  )}
                </div>
                <div className="c-svc-rcard__info">
                  {p.category && <span className="c-svc-rcard__cat">{p.category}</span>}
                  <h3 className="c-svc-rcard__title">{p.title}</h3>
                  <span className="c-svc-rcard__arrow">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ══ CTA ═══════════════════════════════════════════════════════════ */}
      <section className="c-svc-cta">
        <div className="c-svc-cta__bg" aria-hidden="true" />
        <span className="c-svc-cta__eyebrow">Ready to start?</span>
        <h2 className="c-svc-cta__title">{ctaHeadline}</h2>
        {service.ctaSubtext && <p className="c-svc-cta__sub">{service.ctaSubtext}</p>}
        <div>
          <Link href={ctaLink} className="c-btn c-btn--ink">{ctaLabel} →</Link>
        </div>
      </section>

      <CreativeFooter />
    </div>
  );
}
