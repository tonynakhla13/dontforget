"use client";

import dynamic from "next/dynamic";

const BlogDFParticles = dynamic(() => import("./BlogDFParticles"), { ssr: false });

export default function BlogParticleLayer() {
  return <BlogDFParticles />;
}
