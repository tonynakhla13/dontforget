"use client";

import Loader from "@/components/Loader";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import AmbientGlow from "@/components/AmbientGlow";
import ServicesOverview from "@/components/services/ServicesOverview";
import ServicesPipeHologram from "@/components/services/ServicesPipeHologram";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

function ServicesBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 72% 54% at 70% 46%, rgba(58,191,138,0.07), transparent 58%), linear-gradient(180deg, rgba(9,9,9,0.96) 0%, rgba(9,9,9,1) 48%, rgba(9,9,9,0.96) 100%)",
      }} />
    </div>
  );
}

function ServicesHero() {
  const headRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef  = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 2.2 });
    tl.fromTo([headRef.current, bodyRef.current, ctaRef.current],
      { autoAlpha: 0, y: 34 },
      { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.95, ease: "power3.out" }
    ).fromTo(shapeRef.current,
      { autoAlpha: 0, scale: 1.08, x: 70 },
      { autoAlpha: 1, scale: 1, x: 0, duration: 1.35, ease: "power3.out" }, "<0.05"
    );
  }, []);

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden" style={{ background: "transparent" }}>
      <div ref={shapeRef} className="absolute inset-0 z-0" style={{ visibility: "hidden" }}>
        <ServicesPipeHologram />
      </div>
      <div className="relative z-10 wrap flex items-center pt-32 pb-20">
        <div className="max-w-[760px]">
          <h1 ref={headRef} className="hed text-[clamp(4.2rem,10vw,9.6rem)] leading-[0.84] text-[#F8F5EE]" style={{ visibility: "hidden" }}>
            Our<br /><span className="text-[var(--teal)]">Services</span>
          </h1>
          <p ref={bodyRef} className="mt-8 max-w-[520px] text-[clamp(0.92rem,1.3vw,1.04rem)] leading-[1.9] text-[var(--body)]" style={{ visibility: "hidden" }}>
            Brand systems, digital products, immersive web, and motion identities — built to be impossible to forget.
          </p>
          <div ref={ctaRef} className="mt-9 flex flex-wrap gap-4" style={{ visibility: "hidden" }}>
            <Link href="/creative/contact" className="btn btn-primary btn-ripple">Start a project</Link>
            <Link href="/creative/work" className="btn btn-outline">View work →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CreativeServicesPage() {
  return (
    <>
      <Loader />
      <SmoothScroll />
      <main className="relative z-[1] overflow-x-clip">
        <ServicesBackground />
        <div className="noise" />
        <AmbientGlow />
        <Navbar inner />
        <ServicesHero />
        <ServicesOverview />
      </main>
    </>
  );
}
