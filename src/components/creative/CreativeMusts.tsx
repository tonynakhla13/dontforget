"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const RULES = [
  {
    n: "01", name: "Clarity",
    line: "If it doesn't sharpen the message, it doesn't make the cut.",
    img: "/creative/thinking.png",
  },
  {
    n: "02", name: "Motion",
    line: "Every movement has to explain, reveal, or guide.",
    img: "/creative/bust2.png",
  },
  {
    n: "03", name: "Systems",
    line: "The launch is not the finish line. It is the first stress test.",
    img: "/creative/bust1.png",
  },
  {
    n: "04", name: "Honesty",
    line: "The strongest result starts with saying the useful thing early.",
    img: "/creative/thinking.png",
  },
];

export default function CreativeMusts() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const headWords = [...section.querySelectorAll<HTMLElement>("[data-mh]")];
    const cards     = [...section.querySelectorAll<HTMLElement>("[data-rule]")];

    const ctx = gsap.context(() => {
      // Heading — each word slides up
      gsap.fromTo(
        headWords,
        { autoAlpha: 0, y: 80, skewY: 4 },
        {
          autoAlpha: 1, y: 0, skewY: 0,
          duration: 1, ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: headWords[0], start: "top 85%", toggleActions: "play none none reverse" },
        }
      );

      // Cards staggered per row
      cards.forEach((card, i) => {
        const col = i % 2;
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 70, scale: 0.94, rotateX: 6 },
          {
            autoAlpha: 1, y: 0, scale: 1, rotateX: 0,
            duration: 0.95, ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none reverse" },
            delay: col * 0.14,
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="c-musts">

      {/* ── Background decorations ── */}
      <div className="c-musts__bg-earth"   aria-hidden="true" />
      <div className="c-musts__bg-star"    aria-hidden="true" />
      <div className="c-musts__bg-ring"    aria-hidden="true" />
      <div className="c-musts__bg-grain"   aria-hidden="true" />

      {/* ── Heading ── */}
      <div className="c-musts__head">
        <span className="c-musts__eyebrow" data-mh>— The rules we work by</span>
        <h2 className="c-musts__title">
          <span data-mh>OUR</span>
          <span data-mh>MUSTS</span>
        </h2>
      </div>

      {/* ── 2×2 grid ── */}
      <div className="c-musts__grid">
        {RULES.map((rule) => (
          <article key={rule.n} data-rule className="c-must-card">

            {/* lime corner triangle */}
            <div className="c-must-card__corner" aria-hidden="true" />

            {/* Text side */}
            <div className="c-must-card__text">
              <span className="c-must-card__num">{rule.n}</span>
              <h3 className="c-must-card__name">{rule.name}</h3>
              <p className="c-must-card__body">{rule.line}</p>
            </div>

            {/* Image side — statue overflows above card */}
            <div className="c-must-card__img-col" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={rule.img}
                alt=""
                draggable={false}
                className="c-must-card__img"
              />
            </div>

          </article>
        ))}
      </div>

    </section>
  );
}
