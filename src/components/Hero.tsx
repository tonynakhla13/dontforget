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
        className="relative z-10 flex min-h-[100svh] flex-col justify-center overflow-hidden pt-28 pb-16"
        style={{ background: "transparent" }}
      >
        {/* Bottom fade into next section */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[var(--bg)] to-transparent" />

        <div className="wrap relative">
          <div ref={colRef} className="max-w-[640px]">

            <p className="eyebrow mb-7" data-anim>
              Web Development Agency
            </p>

            <h1
              className="hed text-[5.4rem] leading-[0.92]"
              data-anim
            >
              We build things<br />
              people won&apos;t<br />
              <span
                className="script text-[var(--teal)] text-[1.1em]"
              >forget.</span>
            </h1>

            <p
              className="mt-7 text-[0.9375rem] leading-[1.85] text-[var(--body)]"
              data-anim
            >
              Most websites are forgotten before the tab closes.
              Ours aren&apos;t. Ask your competitors.
            </p>

            <div className="mt-9 flex flex-wrap gap-4" data-anim>
              <a href="#contact" className="btn btn-primary">Start a project</a>
              <a href="#work"    className="btn btn-outline">View work →</a>
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
