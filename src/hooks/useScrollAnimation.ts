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

// Fade + slide up — body copy, cards, smaller UI blocks
export function useFadeUp<T extends HTMLElement = HTMLDivElement>(delay = 0) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tween = gsap.fromTo(
      el,
      { autoAlpha: 0, y: 40 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.1,
        delay,
        ease: "power4.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      }
    );

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

// More dramatic reveal with skew — section headings
export function useRevealUp<T extends HTMLElement = HTMLDivElement>(delay = 0) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tween = gsap.fromTo(
      el,
      { autoAlpha: 0, y: 70, skewY: 1.5 },
      {
        autoAlpha: 1,
        y: 0,
        skewY: 0,
        duration: 1.4,
        delay,
        ease: "power4.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          once: true,
        },
      }
    );

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

// Stagger animate direct children — lists, grids, metric rows
export function useStaggerChildren<T extends HTMLElement = HTMLDivElement>(
  delay = 0,
  stagger = 0.12
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const children = [...el.children] as HTMLElement[];
    if (!children.length) return;

    const tween = gsap.fromTo(
      children,
      { autoAlpha: 0, y: 36 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.95,
        delay,
        stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      }
    );

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

// Scrub parallax — decorative shapes that drift as you scroll
export function useParallax<T extends HTMLElement = HTMLDivElement>(
  yFrom = -50,
  yTo = 50
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const section = el.closest("section") ?? el.parentElement ?? el;

    const tween = gsap.fromTo(
      el,
      { y: yFrom },
      {
        y: yTo,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      }
    );

    return () => {
      tween.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
