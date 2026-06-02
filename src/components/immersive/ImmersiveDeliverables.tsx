"use client";

import { useEffect, useRef, useState, type PointerEvent as RPE } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type RichItem = {
  title: string;
  description: string;
  tagline?: string;
  highlight?: boolean;
};

const pad = (n: number) => String(n).padStart(2, "0");

export default function ImmersiveDeliverables({
  deliverables,
  onRequest,
}: {
  deliverables: RichItem[];
  onRequest: (item: RichItem) => void;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-dlv-panel]");

      panels.forEach((panel, i) => {
        if (reduce) {
          panel.setAttribute("data-revealed", "1");
        } else {
          gsap.fromTo(
            panel.querySelectorAll("[data-dlv-anim]"),
            { autoAlpha: 0, y: 30 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.85,
              ease: "power3.out",
              stagger: 0.06,
              scrollTrigger: {
                trigger: panel,
                start: "top 82%",
                once: true,
                onEnter: () => panel.setAttribute("data-revealed", "1"),
              },
            }
          );
        }

        ScrollTrigger.create({
          trigger: panel,
          start: "top 62%",
          end: "bottom 42%",
          onToggle: (self) => {
            if (self.isActive) setActive(i);
          },
        });
      });

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, [deliverables.length]);

  if (!deliverables.length) return null;

  const handleMove = (e: RPE<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${(px * 100).toFixed(2)}%`);
    el.style.setProperty("--my", `${(py * 100).toFixed(2)}%`);
    el.style.setProperty("--rx", `${((0.5 - py) * 6).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((px - 0.5) * 7).toFixed(2)}deg`);
  };

  const handleLeave = (e: RPE<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--mx", "72%");
    el.style.setProperty("--my", "-4%");
  };

  const scrollTo = (i: number) =>
    panelRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });

  return (
    <section
      ref={rootRef}
      className="dlv-deck relative z-10 overflow-hidden py-20 md:py-28"
    >
      <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(var(--teal-rgb),0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--teal-rgb),0.04)_1px,transparent_1px)] [background-size:84px_84px] [mask-image:radial-gradient(ellipse_70%_62%_at_50%_38%,black,transparent_72%)]" />

      <div className="wrap relative">
        {/* ── header / decryption status bar ── */}
        <header className="mb-12 border-b border-[rgba(var(--teal-rgb),0.18)] pb-8">
          <p className="eyebrow mb-5">Deliverables</p>
          <h2 className="hed max-w-[1500px] text-[clamp(2.8rem,6.2vw,7.2rem)] leading-[0.86]">
            Scope that <span className="text-[var(--teal)]">ships clean.</span>
          </h2>
          <p className="mt-7 max-w-[680px] text-[0.98rem] leading-[1.85] text-[var(--body)]">
            Each line is a decryptable unit of work pulled straight from this service.
            Lock onto one and the request console opens with it pre-selected.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.5rem] uppercase tracking-[0.28em] text-[rgba(var(--body-rgb),0.85)]">
            <span className="text-[var(--teal)]">{"// manifest decrypted"}</span>
            <span aria-hidden>·</span>
            <span>{pad(deliverables.length)} deliverables</span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="dlv-live-dot" aria-hidden /> live feed
            </span>
          </div>
        </header>

        {/* ── console: sticky manifest rail + spec panels ── */}
        <div className="grid gap-8 lg:grid-cols-[0.27fr_0.73fr]">
          {/* rail */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-[1.2rem] border border-[rgba(var(--teal-rgb),0.16)] bg-[rgba(3,8,8,0.62)] p-5 backdrop-blur-md">
              <div className="flex items-center justify-between font-mono text-[0.5rem] uppercase tracking-[0.28em] text-[rgba(var(--body-rgb),0.85)]">
                <span>Manifest</span>
                <span className="text-[var(--teal)]">{pad(deliverables.length)}</span>
              </div>

              <div className="relative mt-5 pl-5">
                <span className="absolute left-[6px] top-1.5 bottom-1.5 w-px bg-[rgba(var(--teal-rgb),0.16)]" />
                <span
                  className="absolute left-[6px] top-1.5 w-px bg-[var(--teal)] shadow-[0_0_8px_rgba(var(--teal-rgb),0.7)] transition-[height] duration-500 ease-out"
                  style={{ height: `calc(${((active + 1) / deliverables.length) * 100}% - 0.375rem)` }}
                  aria-hidden
                />
                <ul className="space-y-0.5">
                  {deliverables.map((item, i) => {
                    const isOn = active === i;
                    return (
                      <li key={`${item.title}-${i}`} className="relative">
                        <span
                          className={`absolute -left-5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full transition-all duration-300 ${
                            isOn
                              ? "scale-100 bg-[var(--teal)] shadow-[0_0_10px_rgba(var(--teal-rgb),0.9)]"
                              : "scale-75 bg-[rgba(var(--teal-rgb),0.3)]"
                          }`}
                          aria-hidden
                        />
                        <button
                          type="button"
                          onClick={() => scrollTo(i)}
                          aria-current={isOn ? "true" : undefined}
                          className={`flex w-full items-baseline gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors duration-300 ${
                            isOn
                              ? "bg-[rgba(var(--teal-rgb),0.08)] text-[var(--fg)]"
                              : "text-[rgba(var(--body-rgb),0.8)] hover:text-[var(--fg)]"
                          }`}
                        >
                          <span
                            className={`shrink-0 font-mono text-[0.5rem] tracking-[0.18em] ${
                              isOn ? "text-[var(--teal)]" : "text-[rgba(var(--teal-rgb),0.55)]"
                            }`}
                          >
                            {pad(i + 1)}
                          </span>
                          <span className="min-w-0 flex-1 truncate text-[0.82rem] leading-tight">
                            {item.title}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <p className="mt-5 border-t border-[rgba(var(--teal-rgb),0.12)] pt-4 font-mono text-[0.46rem] uppercase tracking-[0.26em] text-[rgba(var(--body-rgb),0.7)]">
                <span className="text-[var(--teal)]">▸</span> viewing {pad(active + 1)} / {pad(deliverables.length)}
              </p>
            </div>
          </aside>

          {/* spec panels */}
          <div className="grid gap-5 md:gap-6">
            {deliverables.map((item, i) => (
              <article
                key={`${item.title}-${i}`}
                ref={(el) => {
                  panelRefs.current[i] = el;
                }}
                data-dlv-panel
                data-active={active === i}
                onPointerMove={handleMove}
                onPointerLeave={handleLeave}
                className="dlv-panel"
              >
                <div className="dlv-tilt rounded-[1.4rem]">
                  <span className="dlv-grid" aria-hidden />
                  <span className="dlv-spot" aria-hidden />
                  <span className="dlv-ghost" aria-hidden>{pad(i + 1)}</span>
                  <span className="dlv-hair" aria-hidden />
                  <span className="dlv-corner dlv-corner--tl" aria-hidden />
                  <span className="dlv-corner dlv-corner--tr" aria-hidden />
                  <span className="dlv-corner dlv-corner--bl" aria-hidden />
                  <span className="dlv-corner dlv-corner--br" aria-hidden />
                  <span className="dlv-scan" aria-hidden />

                  <div className="relative z-10 grid gap-5 p-6 md:p-9 lg:grid-cols-[1fr_auto] lg:items-end">
                    <div className="min-w-0">
                      <p
                        data-dlv-anim
                        className="flex items-center gap-2 font-mono text-[0.54rem] uppercase tracking-[0.24em] text-[rgba(var(--teal-rgb),0.85)]"
                      >
                        <span>DLV-{pad(i + 1)}</span>
                        <span className="text-[rgba(var(--body-rgb),0.7)]">{"//"}</span>
                        <span className="truncate text-[rgba(var(--body-rgb),0.9)]">
                          {item.tagline || "scope unit"}
                        </span>
                        <span className="dlv-cursor" aria-hidden />
                      </p>

                      <h3
                        data-dlv-anim
                        className="hed mt-4 text-[clamp(1.9rem,5vw,4.6rem)] leading-[0.9]"
                        title={item.title}
                      >
                        {item.title}
                      </h3>

                      {item.description ? (
                        <div
                          data-dlv-anim
                          className="mt-5 max-w-[60ch] text-[0.92rem] leading-[1.72] text-[rgba(240,236,227,0.72)] [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:text-[var(--fg)]"
                          dangerouslySetInnerHTML={{ __html: item.description }}
                        />
                      ) : (
                        <p
                          data-dlv-anim
                          className="mt-5 max-w-[60ch] text-[0.92rem] leading-[1.72] text-[rgba(240,236,227,0.72)]"
                        >
                          A focused piece of scope, ready to pull into a build.
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      data-dlv-anim
                      onClick={() => onRequest(item)}
                      className="group/request relative isolate inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full border border-[rgba(var(--teal-rgb),0.42)] bg-[linear-gradient(135deg,rgba(var(--teal-rgb),0.14),rgba(var(--teal-rgb),0.035))] px-6 py-3.5 text-center font-mono text-[0.56rem] uppercase tracking-[0.24em] text-[var(--teal)] shadow-[0_0_0_1px_rgba(var(--teal-rgb),0.06),0_14px_36px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(var(--teal-rgb),0.9)] hover:text-black hover:shadow-[0_0_36px_rgba(var(--teal-rgb),0.22)] lg:w-fit lg:min-w-[11rem]"
                    >
                      <span className="absolute inset-0 -z-10 translate-x-[-105%] bg-[var(--teal)] transition-transform duration-300 ease-out group-hover/request:translate-x-0" />
                      <span className="relative">Request this</span>
                      <span className="relative text-[0.85rem] leading-none transition-transform duration-300 group-hover/request:translate-x-1">
                        →
                      </span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .dlv-deck .dlv-panel { perspective: 1400px; }

        .dlv-deck .dlv-tilt {
          position: relative;
          overflow: hidden;
          min-height: 280px;
          border: 1px solid rgba(var(--teal-rgb), 0.16);
          background: linear-gradient(135deg, rgba(6,14,12,0.92), rgba(3,8,8,0.78));
          box-shadow: 0 20px 60px rgba(0,0,0,0.34);
          transform: perspective(1400px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
          transition: transform .55s cubic-bezier(.16,1,.3,1),
                      border-color .4s ease, box-shadow .4s ease;
          will-change: transform;
        }
        .dlv-deck .dlv-panel[data-active="true"] .dlv-tilt {
          border-color: rgba(var(--teal-rgb), 0.5);
          box-shadow: 0 26px 84px rgba(0,0,0,0.44), 0 0 54px rgba(var(--teal-rgb), 0.12);
        }
        @media (hover: none) {
          .dlv-deck .dlv-tilt { transform: none !important; }
        }

        /* holographic micro grid */
        .dlv-deck .dlv-grid {
          position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: .55;
          background-image:
            linear-gradient(rgba(var(--teal-rgb),0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(var(--teal-rgb),0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          -webkit-mask-image: radial-gradient(ellipse 90% 85% at 72% 0%, black, transparent 78%);
                  mask-image: radial-gradient(ellipse 90% 85% at 72% 0%, black, transparent 78%);
        }

        /* cursor-tracking light */
        .dlv-deck .dlv-spot {
          position: absolute; inset: 0; z-index: 1; pointer-events: none; opacity: 0;
          background: radial-gradient(460px circle at var(--mx, 72%) var(--my, -4%),
                      rgba(var(--teal-rgb),0.15), transparent 60%);
          transition: opacity .4s ease;
        }
        .dlv-deck .dlv-tilt:hover .dlv-spot,
        .dlv-deck .dlv-panel[data-active="true"] .dlv-spot { opacity: 1; }

        /* ghosted index watermark */
        .dlv-deck .dlv-ghost {
          position: absolute; top: -.16em; right: .02em; z-index: 0; pointer-events: none;
          font-family: var(--font-display-next), sans-serif; font-weight: 400;
          font-size: clamp(8rem, 20vw, 18rem); line-height: .8; letter-spacing: -.02em;
          color: transparent; -webkit-text-stroke: 1px rgba(var(--teal-rgb),0.10);
          opacity: .55; transition: -webkit-text-stroke-color .5s ease, opacity .5s ease;
        }
        .dlv-deck .dlv-panel[data-active="true"] .dlv-ghost {
          -webkit-text-stroke-color: rgba(var(--teal-rgb),0.2); opacity: .85;
        }

        /* top hairline */
        .dlv-deck .dlv-hair {
          position: absolute; left: 0; right: 0; top: 0; height: 1px; z-index: 20;
          background: linear-gradient(90deg, transparent, rgba(var(--teal-rgb),0.7), transparent);
          opacity: .28; transition: opacity .4s ease;
        }
        .dlv-deck .dlv-panel[data-active="true"] .dlv-hair { opacity: 1; }

        /* HUD corner brackets */
        .dlv-deck .dlv-corner {
          position: absolute; width: 16px; height: 16px; z-index: 20; pointer-events: none;
          border-color: rgba(var(--teal-rgb),0.55); opacity: .4;
          transition: opacity .4s ease, width .4s ease, height .4s ease;
        }
        .dlv-deck .dlv-panel[data-active="true"] .dlv-corner {
          opacity: 1; width: 24px; height: 24px;
          filter: drop-shadow(0 0 6px rgba(var(--teal-rgb),0.6));
        }
        .dlv-deck .dlv-corner--tl { top: 12px; left: 12px; border-top: 1.5px solid; border-left: 1.5px solid; }
        .dlv-deck .dlv-corner--tr { top: 12px; right: 12px; border-top: 1.5px solid; border-right: 1.5px solid; }
        .dlv-deck .dlv-corner--bl { bottom: 12px; left: 12px; border-bottom: 1.5px solid; border-left: 1.5px solid; }
        .dlv-deck .dlv-corner--br { bottom: 12px; right: 12px; border-bottom: 1.5px solid; border-right: 1.5px solid; }

        /* decryption scanline */
        .dlv-deck .dlv-scan {
          position: absolute; left: 0; right: 0; top: 0; height: 2px; z-index: 30; pointer-events: none;
          background: linear-gradient(90deg, transparent, rgba(var(--teal-rgb),0.85), transparent);
          box-shadow: 0 0 18px 2px rgba(var(--teal-rgb),0.45); opacity: 0;
        }
        .dlv-deck .dlv-panel[data-revealed="1"] .dlv-scan {
          animation: dlv-scan 1.05s cubic-bezier(.5,0,.3,1) .08s 1;
        }
        .dlv-deck .dlv-panel[data-active="true"] .dlv-scan {
          animation: dlv-scan 5s linear infinite;
        }
        @keyframes dlv-scan {
          0%   { top: -2%;  opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { top: 102%; opacity: 0; }
        }

        /* blinking spec cursor */
        .dlv-deck .dlv-cursor {
          display: inline-block; width: 7px; height: 0.9em; margin-left: 1px;
          background: var(--teal); vertical-align: -1px;
          animation: dlv-blink 1.05s steps(1) infinite;
        }
        @keyframes dlv-blink { 0%,49% { opacity: 1; } 50%,100% { opacity: 0; } }

        /* live-feed dot */
        .dlv-deck .dlv-live-dot {
          display: inline-block; width: 6px; height: 6px; border-radius: 999px;
          background: var(--teal); box-shadow: 0 0 8px rgba(var(--teal-rgb),0.8);
          animation: dlv-pulse 1.8s ease-in-out infinite;
        }
        @keyframes dlv-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .35; transform: scale(.7); } }

        @media (prefers-reduced-motion: reduce) {
          .dlv-deck .dlv-tilt { transition: none; transform: none !important; }
          .dlv-deck .dlv-scan,
          .dlv-deck .dlv-cursor,
          .dlv-deck .dlv-live-dot { animation: none !important; }
          .dlv-deck .dlv-cursor { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
