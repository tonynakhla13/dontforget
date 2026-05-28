"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function AmbientGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    const xTo = gsap.quickTo(glow, "x", {
      duration: 0.8,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(glow, "y", {
      duration: 0.8,
      ease: "power3.out",
    });

    const handlePointerMove = (event: PointerEvent) => {
      xTo(event.clientX - 260);
      yTo(event.clientY - 260);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-0 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(var(--teal-rgb),0.16),transparent_68%)] blur-2xl"
    />
  );
}
