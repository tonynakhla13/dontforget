"use client";

import dynamic from "next/dynamic";

const ServicesDFParticles = dynamic(() => import("./ServicesDFParticles"), { ssr: false });

export default function ServicesParticleLayer() {
  return <ServicesDFParticles />;
}
