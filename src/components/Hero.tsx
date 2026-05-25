"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function Hero() {
  const secRef  = useRef<HTMLElement>(null);
  const colRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const col = colRef.current;
      if (!col) return;
      const children = [...col.querySelectorAll("[data-anim]")];
      gsap.timeline({ delay: 2.6 })
        .fromTo(children,
          { autoAlpha: 0, y: 36 },
          { autoAlpha: 1, y: 0, stagger: 0.12, duration: 1.1, ease: "power3.out" });
    }, secRef);
    return () => ctx.revert();
  }, []);

  return (
      <section
        ref={secRef}
        id="hero"
        className="relative z-10 flex min-h-[100svh] flex-col justify-center overflow-visible pt-28 pb-16"
        style={{ background: "transparent" }}
      >
        {/* Bottom fade into next section */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-80"
          style={{
            background:
              "linear-gradient(to top, rgba(9,9,9,0.34) 0%, rgba(9,9,9,0.14) 46%, transparent 100%)",
          }}
        />

        <div className="wrap relative">
          <div ref={colRef} className="max-w-[640px]">

            <p className="eyebrow mb-7" data-anim>
              Web Development Agency
            </p>

            <h1
              className="hed text-[3.8rem] leading-[0.95] text-[#F8F5EE]"
              style={{ color: "#F8F5EE" }}
              data-anim
            >
              We build things<br />
              people won&apos;t<br />
              <span className="script text-[1.05em]">forget.</span>
            </h1>

            <p
              className="mt-7 text-[0.9375rem] leading-[1.85] text-[var(--body)]"
              data-anim
            >
              Most websites are forgotten before the tab closes.
              Ours aren&apos;t. Ask your competitors.
            </p>

            <div className="mt-9 flex flex-wrap gap-4" data-anim>
              <a href="#contact" className="btn-glass">
                <span className="btn-glass-blob" aria-hidden="true" />
                <span className="btn-glass-face">Start a project</span>
              </a>
              <a href="#work" className="btn-glass-ghost">
                <span className="btn-glass-blob" aria-hidden="true" />
                <span className="btn-glass-face">
                  View work
                  <span className="btn-glass-arrow">➔</span>
                </span>
              </a>
            </div>

            <div className="mt-14 flex items-center gap-4" data-anim>
              <span className="h-px w-10 bg-[var(--teal)] opacity-60" />
              <span className="font-mono text-[0.58rem] uppercase tracking-[0.42em] text-[var(--body)]">
                Scroll to explore
              </span>
            </div>
          </div>
        </div>
      </section>
  );
}
