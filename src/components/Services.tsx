"use client";

import { useRef } from "react";
import { useFadeUp } from "@/hooks/useScrollAnimation";

const services = [
  {
    number: "01",
    title: "Web Design",
    description:
      "Pixel-perfect designs that convert. We craft visually stunning interfaces that feel as good as they look.",
    icon: "✦",
  },
  {
    number: "02",
    title: "Development",
    description:
      "Clean, performant code. From React to Next.js — we build fast, scalable web applications.",
    icon: "⟡",
  },
  {
    number: "03",
    title: "3D & Motion",
    description:
      "Immersive Three.js experiences and GSAP animations that make your brand unforgettable.",
    icon: "◈",
  },
  {
    number: "04",
    title: "Strategy",
    description:
      "Data-driven digital strategy. We help you define goals, audience, and roadmap to grow online.",
    icon: "◎",
  },
];

function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) {
  const ref = useFadeUp(index * 0.1) as React.RefObject<HTMLDivElement>;

  return (
    <div
      ref={ref}
      className="group p-8 border border-white/10 rounded-2xl hover:border-indigo-500/50 transition-all duration-500 hover:bg-indigo-950/20 cursor-default"
    >
      <div className="flex items-start justify-between mb-6">
        <span className="text-indigo-400 text-3xl">{service.icon}</span>
        <span className="text-white/20 text-sm font-mono">{service.number}</span>
      </div>
      <h3 className="text-white text-2xl font-bold mb-3 group-hover:text-indigo-300 transition-colors duration-300">
        {service.title}
      </h3>
      <p className="text-white/50 leading-relaxed">{service.description}</p>
    </div>
  );
}

export default function Services() {
  const titleRef = useFadeUp() as React.RefObject<HTMLDivElement>;

  return (
    <section id="services" className="bg-black py-32 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={titleRef} className="mb-20">
          <p className="text-indigo-400 text-sm font-mono uppercase tracking-widest mb-4">
            What We Do
          </p>
          <h2 className="text-5xl md:text-6xl font-black text-white leading-tight">
            Services that
            <br />
            <span className="text-white/30">make an impact</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <ServiceCard key={service.number} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
