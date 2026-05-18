"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const EVENTS = [
  {
    year: "2022",
    title: "Founded",
    body: "DON'T FORGET was born out of frustration. Too many agencies building forgettable work. We set out to change that with a small team and an unreasonably high bar.",
  },
  {
    year: "2022",
    title: "First client shipped",
    body: "Our first project — a high-converting landing page for a fashion brand. Delivered in two weeks. The client tripled their conversion rate in the first month.",
  },
  {
    year: "2023",
    title: "Mobile practice launched",
    body: "Expanded into iOS and Android development. Our first app shipped to the App Store, and it got a feature from Apple in its first week.",
  },
  {
    year: "2023",
    title: "10 projects milestone",
    body: "Ten projects live across three countries. Every one built from scratch, designed with intent, and shipped on time. No templates. No shortcuts.",
  },
  {
    year: "2024",
    title: "E-commerce expertise",
    body: "Full e-commerce practice launched. Shopify, WooCommerce, and fully custom storefronts. The SEO-first approach started here — and it compounded fast.",
  },
  {
    year: "2024",
    title: "CRM & custom systems",
    body: "Hired engineers with a background in systems architecture. First custom CRM built for a travel platform. The engineer-minded approach became our standard.",
  },
  {
    year: "2025",
    title: "SEO & AI search",
    body: "Launched our SEO and AI-powered marketing practice. Results that most agencies describe as 'not possible.' We just call it doing the work properly.",
  },
  {
    year: "2025",
    title: "6 countries. Still small.",
    body: "Projects live in 6 countries. 14+ clients. Zero boring websites made. We're staying small on purpose — so every client gets the A-team, every time.",
  },
];

export default function OurStory() {
  const outerRef  = useRef<HTMLDivElement>(null);
  const trackRef  = useRef<HTMLDivElement>(null);
  const headRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    if (!outer || !track) return;

    /* How far to scroll horizontally */
    const getDistance = () => track.scrollWidth - track.offsetWidth;

    const ctx = gsap.context(() => {
      /* Heading fade-in */
      gsap.fromTo(headRef.current,
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: headRef.current, start: "top 82%", toggleActions: "play none none none" },
        }
      );

      /* Horizontal scroll */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outer,
          start: "top top",
          end: () => `+=${getDistance() + window.innerHeight}`,
          scrub: 1.2,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(track, {
        x: () => -getDistance(),
        ease: "none",
        duration: 1,
      });

      /* Stagger card reveal */
      gsap.utils.toArray<HTMLElement>("[data-story-card]").forEach((card, i) => {
        gsap.fromTo(card,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out",
            scrollTrigger: {
              trigger: outer,
              start: `${i * 12}% top`,
              toggleActions: "play none none none",
              containerAnimation: tl,
            },
          }
        );
      });
    }, outer);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={outerRef} className="relative border-t border-[var(--border)] bg-[var(--bg)]">
      {/* Section header — shown before pin kicks in */}
      <div ref={headRef} className="wrap py-20" style={{ visibility: "hidden" }}>
        <p className="eyebrow mb-6">Our Story</p>
        <h2 className="hed text-[3.2rem]">
          How we got<br />
          <span className="text-[var(--teal)]">here.</span>
        </h2>
      </div>

      {/* Horizontal scroll track */}
      <div className="flex h-screen items-center overflow-hidden">
        <div
          ref={trackRef}
          className="flex items-stretch gap-6 pl-[var(--gutter)]"
          style={{ paddingRight: "var(--gutter)" }}
        >
          {EVENTS.map((ev, i) => (
            <div
              key={i}
              data-story-card
              className="relative flex-shrink-0 flex flex-col justify-between rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface)] p-8"
              style={{ width: 320, minHeight: 380 }}
            >
              {/* Top teal line */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--teal)] to-transparent opacity-40" />

              <div>
                <span className="hed text-[4rem] leading-none text-[var(--teal)] opacity-20">
                  {ev.year}
                </span>
                <h3 className="hed mt-3 text-[1.5rem] text-[var(--fg)]">{ev.title}</h3>
                <p className="mt-4 text-[0.875rem] leading-[1.85] text-[var(--body)]">{ev.body}</p>
              </div>

              {/* Index badge */}
              <span className="mt-8 block font-mono text-[0.5rem] uppercase tracking-[0.4em] text-[var(--teal)] opacity-50">
                {String(i + 1).padStart(2, "0")} / {String(EVENTS.length).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
