"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const rules = [
  {
    n: "01",
    name: "Clarity",
    line: "If it doesn’t sharpen the message, it doesn’t make the cut.",
    note: "Noise is expensive. We remove it until the idea reads in one clean hit.",
  },
  {
    n: "02",
    name: "Motion",
    line: "Every movement has to explain, reveal, or guide.",
    note: "Animation is proof. If it cannot carry meaning, it does not stay.",
  },
  {
    n: "03",
    name: "Systems",
    line: "The launch is not the finish line. It is the first stress test.",
    note: "Components, flows, and content have to survive real use after the reveal.",
  },
  {
    n: "04",
    name: "Honesty",
    line: "The strongest result starts with saying the useful thing early.",
    note: "We pressure the idea before time, budget, and attention get wasted.",
  },
];

function RuleShape({ index, active }: { index: number; active: number }) {
  const visible = index === active;

  return (
    <svg
      viewBox="0 0 620 520"
      className="pointer-events-none absolute left-[5vw] top-[8vh] h-[min(42vh,460px)] w-[min(54vw,1040px)] transition-all duration-700 ease-out max-lg:left-[-8vw] max-lg:w-[86vw]"
      style={{
        opacity: visible ? 0.84 : 0,
        transform: visible
          ? "perspective(1000px) rotateX(58deg) rotateY(0deg) rotateZ(-5deg) scale(1.12)"
          : "perspective(1000px) rotateX(66deg) rotateY(-18deg) rotateZ(-12deg) scale(.92)",
        transformOrigin: "48% 52%",
      }}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <filter id={`rule-shape-glow-${index}`}>
          <feGaussianBlur stdDeviation="2.25" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={`rule-shape-grad-${index}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(58,191,138,0.08)" />
          <stop offset="55%" stopColor="rgba(58,191,138,0.68)" />
          <stop offset="100%" stopColor="rgba(58,191,138,0.16)" />
        </linearGradient>
      </defs>

      {index === 0 && (
        <g stroke={`url(#rule-shape-grad-${index})`} strokeWidth="1.8" filter={`url(#rule-shape-glow-${index})`}>
          <path d="M76 156h360l118 82v196H194L76 350z" />
          <path d="M436 156v196l118 82M194 434V238L76 156M194 238h360" />
          <path d="M124 204h330M112 285h398M150 370h324" opacity=".5" />
          <path d="M124 204 474 370M454 204 150 370" opacity=".32" />
          <path d="M74 434c110-72 210-94 350-74 72 10 117 34 164 74" opacity=".3" />
          <path d="M60 104c190-58 390-46 530 34" opacity=".18" />
          <circle cx="322" cy="296" r="116" opacity=".22" />
          <circle cx="322" cy="296" r="176" opacity=".13" />
        </g>
      )}

      {index === 1 && (
        <g stroke={`url(#rule-shape-grad-${index})`} strokeWidth="1.85" filter={`url(#rule-shape-glow-${index})`}>
          <path d="M70 342 C154 80, 328 448, 470 210 S612 190, 574 382" />
          <path d="M448 188h92v92h-92z" opacity=".52" />
          <path d="M86 312h74v74H86z" opacity=".5" />
          <path d="m428 164 64 54-64 58" />
          <path d="M112 458c136 48 320 38 452-24" opacity=".28" />
          <path d="M90 128c124-38 300-28 452 30" opacity=".18" />
          <circle cx="332" cy="292" r="178" opacity=".12" />
        </g>
      )}

      {index === 2 && (
        <g stroke={`url(#rule-shape-grad-${index})`} strokeWidth="1.65" filter={`url(#rule-shape-glow-${index})`}>
          {[116, 256, 396, 536].map((x, i) => (
            <g key={x}>
              <rect x={x - 58} y={i % 2 ? 316 : 196} width="116" height="86" rx="16" />
              <path d={`M${x - 34} ${i % 2 ? 348 : 228}h68M${x - 34} ${i % 2 ? 378 : 258}h42`} />
            </g>
          ))}
          <path d="M174 238 C220 200, 232 330, 256 346" />
          <path d="M314 346 C360 390, 372 240, 396 238" />
          <path d="M454 238 C500 200, 512 330, 536 346" />
          <circle cx="326" cy="294" r="205" opacity=".2" />
          <circle cx="326" cy="294" r="282" opacity=".12" />
          <path d="M66 454c160-48 348-51 504-8" opacity=".22" />
        </g>
      )}

      {index === 3 && (
        <g stroke={`url(#rule-shape-grad-${index})`} strokeWidth="1.75" filter={`url(#rule-shape-glow-${index})`}>
          <path d="M76 198h332v166H76z" />
          <path d="M126 250h214M126 300h142" />
          <path d="m408 266 136-72v186l-136-76z" />
          <path d="M568 222c44 42 44 122 0 166" opacity=".36" />
          <path d="M608 172c72 78 72 236 0 314" opacity=".23" />
          <path d="M72 438h488" opacity=".34" />
          <circle cx="304" cy="290" r="214" opacity=".13" />
          <path d="M96 140c138-40 336-30 472 34" opacity=".18" />
        </g>
      )}
    </svg>
  );
}

export default function Principles() {
  const sectionRef = useRef<HTMLElement>(null);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const section = sectionRef.current;
    const slides = slideRefs.current.filter(Boolean) as HTMLElement[];
    if (!section || slides.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(slides, { autoAlpha: 0, yPercent: 18, scale: 0.96, filter: "blur(12px)" });
      gsap.set(slides[0], { autoAlpha: 1, yPercent: 0, scale: 1, filter: "blur(0px)" });

      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * 5.35}`,
          scrub: 0.9,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            const beat = Math.min(rules.length, Math.floor(self.progress * (rules.length + 1)));
            setActive(beat - 1);
          },
        },
      });

      slides.forEach((slide, index) => {
        if (index > 0) {
          tl.fromTo(
            slide,
            { autoAlpha: 0, yPercent: 18, xPercent: 3, scale: 0.96, filter: "blur(14px)" },
            { autoAlpha: 1, yPercent: 0, xPercent: 0, scale: 1, filter: "blur(0px)", duration: 0.42 },
            index
          );
        }

        tl.to(slide, { autoAlpha: 1, yPercent: 0, scale: 1, filter: "blur(0px)", duration: 0.24 }, index + 0.42);

        if (index < slides.length - 1) {
          tl.to(
            slide,
            { autoAlpha: 0, yPercent: -18, xPercent: -3, scale: 1.035, filter: "blur(12px)", duration: 0.36 },
            index + 0.72
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="principles"
      ref={sectionRef}
      className="relative h-screen overflow-hidden border-t border-[var(--border)] bg-transparent"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_56%_52%,rgba(58,191,138,0.06),transparent_68%)]" />
      <div className="pointer-events-none absolute inset-0 z-0">
        {rules.map((_, index) => (
          <RuleShape key={index} index={index} active={active} />
        ))}
      </div>

      <div className="relative z-20 h-full">
        <article
          ref={(node) => {
            slideRefs.current[0] = node;
          }}
          className="absolute inset-0 flex items-center px-[var(--gutter)]"
        >
          <div>
            <p className="eyebrow mb-7">The rules we work by</p>
            <h2 className="hed text-[clamp(5rem,16vw,19rem)] leading-[0.74] tracking-[-0.055em] text-[var(--fg)] drop-shadow-[0_22px_0_rgba(255,255,255,0.07)]">
              OUR <span className="text-[var(--teal)]">MUSTS</span>
            </h2>
          </div>
        </article>

        {rules.map((rule, index) => (
          <article
            key={rule.n}
            ref={(node) => {
              slideRefs.current[index + 1] = node;
            }}
            className="absolute inset-0 flex items-end px-[var(--gutter)] pb-[13vh]"
          >
            <div className="relative w-full max-w-[min(1120px,72vw)] max-lg:max-w-[92vw]">
              <div className="pointer-events-none fixed right-[var(--gutter)] top-[18vh] z-20 text-right max-md:top-[14vh]">
                <div className="relative inline-block">
                  <div className="hed text-[clamp(3.8rem,8vw,10.5rem)] leading-[0.72] tracking-[-0.055em] text-[var(--teal)] drop-shadow-[0_0_28px_rgba(58,191,138,0.28)]">
                    RULE #{rule.n}
                  </div>
                </div>
              </div>

              <div className="mb-6 flex items-center gap-5">
                <span className="h-px w-24 bg-[var(--teal)]/55" />
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-white/48">
                  {rule.name}
                </span>
              </div>

              <h3 className="hed max-w-[68vw] text-[clamp(2.05rem,4vw,5.4rem)] leading-[0.92] text-[var(--fg)] drop-shadow-[0_14px_0_rgba(255,255,255,0.075)] max-lg:max-w-[86vw] max-md:max-w-[92vw] max-md:text-[clamp(2rem,9vw,4.2rem)]">
                {rule.line}
              </h3>

              <p className="mt-7 max-w-2xl text-[clamp(1rem,1.45vw,1.22rem)] leading-[1.75] text-white/72">
                {rule.note}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
