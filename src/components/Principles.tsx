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
  const tubeRings = Array.from({ length: 16 }, (_, i) => i);
  const ribs = Array.from({ length: 13 }, (_, i) => i);
  const floaters = Array.from({ length: 9 }, (_, i) => i);

  return (
    <svg
      viewBox="0 0 880 620"
      className="pointer-events-none absolute left-[-3vw] top-[-5vh] h-[min(68vh,780px)] w-[min(68vw,1340px)] transition-all duration-700 ease-out max-lg:left-[-30vw] max-lg:w-[128vw]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? `perspective(1100px) rotateX(${56 + index * 2}deg) rotateY(${-24 + index * 7}deg) rotateZ(${-17 + index * 5}deg) scale(1.18)`
          : `perspective(1100px) rotateX(${72 + index * 2}deg) rotateY(${-44 + index * 7}deg) rotateZ(${-25 + index * 5}deg) scale(.88)`,
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

      <g stroke={`url(#rule-shape-grad-${index})`} strokeWidth="1.55" filter={`url(#rule-shape-glow-${index})`}>
        {/* main hero-like cylindrical tube */}
        <g opacity=".9">
          <path d="M120 292 C198 150 430 120 650 212" />
          <path d="M128 390 C230 520 482 494 712 344" />
          <path d="M120 292 C90 326 96 366 128 390" />
          <path d="M650 212 C742 238 776 296 712 344" />
          <ellipse cx="126" cy="340" rx="38" ry="56" transform="rotate(-14 126 340)" opacity=".82" />
          <ellipse cx="686" cy="278" rx="66" ry="96" transform="rotate(72 686 278)" opacity=".82" />

          {tubeRings.map((ring) => {
            const t = ring / (tubeRings.length - 1);
            const x = 132 + t * 548 + Math.sin(t * Math.PI + index) * 18;
            const y = 342 - Math.sin(t * Math.PI) * 80 + Math.cos(t * Math.PI * 1.6 + index) * 20;
            const rx = 40 + Math.sin(t * Math.PI) * 30;
            const ry = 62 + Math.sin(t * Math.PI) * 18;
            return (
              <ellipse
                key={`ring-${ring}`}
                cx={x}
                cy={y}
                rx={rx}
                ry={ry}
                transform={`rotate(${64 - t * 72 + index * 9} ${x} ${y})`}
                opacity={0.18 + Math.sin(t * Math.PI) * 0.36}
              />
            );
          })}

          {ribs.map((rib) => {
            const offset = (rib - 6) * 10;
            return (
              <path
                key={`rib-${rib}`}
                d={`M${128 + rib * 8} ${318 + offset} C${260 + rib * 6} ${210 + offset * 0.25}, ${478 - rib * 4} ${198 - offset * 0.2}, ${700 - rib * 5} ${286 - offset}`}
                opacity={0.13 + (rib % 5) * 0.06}
              />
            );
          })}
        </g>

        {/* second crossing cylinder */}
        <g opacity=".55">
          <path d="M214 168 C310 94 498 104 626 178" />
          <path d="M184 246 C308 342 514 330 676 230" />
          <path d="M214 168 C158 188 146 224 184 246" />
          <path d="M626 178 C692 184 716 210 676 230" />
          <ellipse cx="198" cy="207" rx="34" ry="58" transform="rotate(68 198 207)" />
          <ellipse cx="650" cy="204" rx="42" ry="72" transform="rotate(76 650 204)" />
          {Array.from({ length: 9 }, (_, i) => {
            const t = i / 8;
            const x = 198 + t * 452;
            const y = 206 - Math.sin(t * Math.PI) * 50;
            return (
              <ellipse
                key={`cross-${i}`}
                cx={x}
                cy={y}
                rx={28 + Math.sin(t * Math.PI) * 18}
                ry={58}
                transform={`rotate(${70 - t * 34} ${x} ${y})`}
                opacity={0.22 + Math.sin(t * Math.PI) * 0.18}
              />
            );
          })}
        </g>

        {/* floating cylindrical fragments */}
        {floaters.map((floater) => {
          const x = 112 + ((floater * 83 + index * 37) % 560);
          const y = 98 + ((floater * 61 + index * 43) % 390);
          const rot = -38 + ((floater * 29 + index * 17) % 80);
          const scale = 0.72 + (floater % 4) * 0.14;
          return (
            <g key={`floater-${floater}`} transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`} opacity={0.16 + (floater % 4) * 0.08}>
              <path d="M0 0 C42-22 116-18 158 8" />
              <path d="M-8 48 C46 82 122 74 174 28" />
              <ellipse cx="0" cy="24" rx="18" ry="28" />
              <ellipse cx="166" cy="18" rx="20" ry="34" />
              <path d="M34 14 C76 0 110 2 146 18" opacity=".55" />
              <path d="M28 48 C74 58 116 52 152 30" opacity=".45" />
            </g>
          );
        })}

        {index === 0 && (
          <>
            <path d="M242 306h260M250 356h168" opacity=".46" />
            <path d="m522 282 54 40-54 42" opacity=".5" />
          </>
        )}
        {index === 1 && (
          <>
            <path d="M144 370 C232 132, 382 430, 530 218" opacity=".62" />
            <path d="M500 202h82v82h-82z" opacity=".38" />
          </>
        )}
        {index === 2 && (
          <>
            {[220, 380, 540].map((x) => (
              <rect key={x} x={x - 54} y={x === 380 ? 322 : 214} width="108" height="78" rx="14" opacity=".42" />
            ))}
          </>
        )}
        {index === 3 && (
          <>
            <path d="M210 230h260v134H210z" opacity=".46" />
            <path d="m470 272 116-62v164l-116-68z" opacity=".45" />
          </>
        )}
      </g>
    </svg>
  );
}

export default function Principles() {
  const sectionRef = useRef<HTMLElement>(null);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);
  const [active, setActive] = useState(-1);
  const [typedLine, setTypedLine] = useState("");

  useEffect(() => {
    const section = sectionRef.current;
    const slides = slideRefs.current.filter(Boolean) as HTMLElement[];
    if (!section || slides.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(slides, {
        autoAlpha: 0,
        yPercent: 22,
        xPercent: 5,
        scale: 0.94,
        rotateZ: -1.4,
        filter: "blur(16px)",
        transformOrigin: "30% 70%",
      });
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
            { autoAlpha: 0, yPercent: 24, xPercent: 7, scale: 0.92, rotateZ: -1.8, filter: "blur(18px)" },
            { autoAlpha: 1, yPercent: 0, xPercent: 0, scale: 1, rotateZ: 0, filter: "blur(0px)", duration: 0.5 },
            index
          );
        }

        tl.to(slide, { autoAlpha: 1, yPercent: 0, scale: 1, rotateZ: 0, filter: "blur(0px)", duration: 0.2 }, index + 0.5);

        if (index < slides.length - 1) {
          tl.to(
            slide,
            { autoAlpha: 0, yPercent: -24, xPercent: -7, scale: 1.045, rotateZ: 1.5, filter: "blur(16px)", duration: 0.42 },
            index + 0.76
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (active < 0 || active >= rules.length) {
      setTypedLine("");
      return;
    }

    const line = rules[active].line;
    let index = 0;
    setTypedLine("");

    const timer = window.setInterval(() => {
      index = Math.min(line.length, index + 7);
      setTypedLine(line.slice(0, index));
      if (index >= line.length) window.clearInterval(timer);
    }, 14);

    return () => window.clearInterval(timer);
  }, [active]);

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
            className="absolute inset-0 flex items-end px-[var(--gutter)] pb-[14vh]"
          >
            <div className="relative w-full max-w-[min(1120px,72vw)] max-lg:max-w-[92vw]">
              <div className="pointer-events-none fixed right-[var(--gutter)] top-[14vh] z-20 text-right max-md:top-[14vh]">
                <div className="relative inline-block">
                  <div
                    className="hed -skew-x-6 text-[clamp(6.8rem,13vw,18rem)] italic leading-[0.64] tracking-[-0.085em] drop-shadow-[0_0_42px_rgba(58,191,138,0.55)]"
                    style={{ color: "var(--teal)", fontStyle: "italic" }}
                  >
                    RULE #{rule.n}
                  </div>
                </div>
              </div>

              <h3 className="hed text-[clamp(5.2rem,12vw,15.5rem)] leading-[0.68] tracking-[-0.055em] text-[#F8F5EE] drop-shadow-[0_18px_0_rgba(255,255,255,0.07)]">
                {rule.name}
              </h3>

              <p className="mt-8 max-w-[64vw] font-mono text-[clamp(1rem,2vw,2rem)] font-bold uppercase leading-[1.35] tracking-[0.035em] text-white/80 max-md:max-w-[92vw]">
                {active === index ? typedLine : rule.line}
                {active === index && typedLine.length < rule.line.length ? (
                  <span className="ml-2 inline-block h-[0.78em] w-[0.08em] translate-y-[0.08em] bg-[var(--teal)] shadow-[0_0_18px_rgba(58,191,138,0.8)]" />
                ) : null}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
