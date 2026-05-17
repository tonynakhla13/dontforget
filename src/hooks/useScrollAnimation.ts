"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface ScrollAnimationOptions {
  start?: string;
  end?: string;
  scrub?: boolean | number;
  toggleActions?: string;
}

export function useScrollAnimation(
  animation: (el: HTMLElement) => gsap.core.Tween | gsap.core.Timeline,
  options: ScrollAnimationOptions = {}
) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      start = "top 80%",
      end = "bottom 20%",
      scrub = false,
      toggleActions = "play none none none",
    } = options;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start,
      end,
      scrub,
      toggleActions,
      animation: animation(el),
    });

    return () => trigger.kill();
  }, []);

  return ref;
}

export function useFadeUp(delay = 0) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tween = gsap.from(el, {
      y: 60,
      opacity: 0,
      duration: 1,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
      },
    });

    return () => tween.kill();
  }, []);

  return ref;
}
