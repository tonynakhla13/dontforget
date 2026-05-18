"use client";

import dynamic from "next/dynamic";

const DFParticles = dynamic(() => import("./DFParticles"), { ssr: false });

export default function ParticleLayer() {
  return <DFParticles />;
}
