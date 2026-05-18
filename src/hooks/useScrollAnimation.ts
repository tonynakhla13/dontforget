"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface ScrollAnimationOptions {
  start?: string;
  end?: string;
  scrub?: boolean | number;
  toggleActions?: string;
}

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  animation: (el: T) => gsap.core.Tween | gsap.core.Timeline,
  options: ScrollAnimationOptions = {}
) {
  const ref = useRef<T>(null);
  const {
    start = "top 80%",
    end = "bottom 20%",
    scrub = false,
    toggleActions = "play none none none",
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start,
      end,
      scrub,
      toggleActions,
      animation: animation(el),
    });

    return () => trigger.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

export function useFadeUp<T extends HTMLElement = HTMLDivElement>(delay = 0) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tween = gsap.from(el, {
      y: 28,
      duration: 0.9,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 86%",
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === el) trigger.kill();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
