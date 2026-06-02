"use client";

import dynamic from "next/dynamic";

// Principles uses GSAP pin:true which moves its DOM node during ScrollTrigger setup.
// React Strict Mode's double-mount causes insertBefore to fail because the node is
// no longer in its expected parent. Rendering client-only (ssr:false) avoids this.
const Principles = dynamic(() => import("@/components/Principles"), { ssr: false });

export default function PrinciplesWrapper() {
  return <Principles />;
}
