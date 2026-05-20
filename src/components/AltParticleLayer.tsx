"use client";

import dynamic from "next/dynamic";

const AltParticles = dynamic(() => import("./AltParticles"), { ssr: false });

export default function AltParticleLayer({ mode }: { mode: "helix" | "galaxy" }) {
  return <AltParticles mode={mode} />;
}
