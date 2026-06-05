"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function CreativeHomeMotion() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      heroTl
        .fromTo(
          ".c-hero__brush",
          { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 1.65, ease: "steps(22)" }
        )
        .from(".c-hero__earth", { autoAlpha: 0, scale: 0.78, rotate: 24, duration: 1.25 }, "-=1.05")
        .from(".c-hero__char", { autoAlpha: 0, yPercent: 45, stagger: 0.045, duration: 0.08, ease: "none" }, "-=0.65")
        .from(".c-hero__arrow-btn", { autoAlpha: 0, scale: 0, rotate: -90, duration: 0.75 }, "-=0.45")
        .from(".c-hero__star", { autoAlpha: 0, scale: 0, rotate: 80, duration: 0.75 }, "-=0.55")
        .from(".c-hero__card", { autoAlpha: 0, y: 60, rotate: -34, duration: 0.8 }, "-=0.45")
        .from(".c-hero__sub > *", { autoAlpha: 0, y: 26, stagger: 0.1, duration: 0.72 }, "-=0.42")
        .from(".c-hero__stats", { autoAlpha: 0, y: 70, duration: 0.75 }, "-=0.4")
        .fromTo(".c-hero__clients", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.65 }, "-=0.5");

      gsap.to(".c-hero__earth", {
        rotate: 24,
        scale: 1.08,
        xPercent: 5,
        scrollTrigger: { trigger: ".c-hero", start: "top top", end: "bottom top", scrub: 1 },
      });
      gsap.to(".c-hero__head", {
        yPercent: -16,
        scrollTrigger: { trigger: ".c-hero", start: "top top", end: "bottom top", scrub: 1 },
      });

      gsap.utils.toArray<HTMLElement>(".c-about__title-line, .c-about__body, .c-about__tags .c-tag, .c-pill").forEach((el, index) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 46,
          rotate: index % 2 ? 1.5 : -1.5,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 86%", toggleActions: "play none none reverse" },
        });
      });

      ScrollTrigger.create({
        trigger: ".c-about",
        start: "top top",
        end: "+=520",
        pin: true,
        pinSpacing: true,
      });

      gsap.from(".c-services__head > *", {
        autoAlpha: 0,
        y: 60,
        rotate: -2,
        stagger: 0.08,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".c-services", start: "top 72%", toggleActions: "play none none reverse" },
      });

      const servicesViewport = document.querySelector<HTMLElement>(".c-services-carousel .c-carousel__viewport");
      if (servicesViewport) {
        const maxServiceScroll = () => Math.max(0, servicesViewport.scrollWidth - servicesViewport.clientWidth);

        gsap.to(servicesViewport, {
          scrollLeft: () => maxServiceScroll(),
          ease: "none",
          scrollTrigger: {
            trigger: ".c-services-carousel",
            start: "top top",
            end: () => `+=${maxServiceScroll() + window.innerHeight * 0.35}`,
            scrub: 1.8,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }

      const portfolioTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".c-portfolio",
          start: "top top",
          end: "+=1000",
          scrub: 1,
          pin: true,
        },
      });
      portfolioTl
        .from(".c-portfolio__card", { scale: 0.92, rotate: -2, autoAlpha: 0.4, duration: 0.25 })
        .from(".c-portfolio__earth", { yPercent: -20, rotate: -24, duration: 0.3 }, 0)
        .from(".c-portfolio__title > *", { x: 90, autoAlpha: 0, stagger: 0.06, duration: 0.3 }, 0.08)
        .from(".c-portfolio-carousel", { y: 42, autoAlpha: 0, duration: 0.42 }, 0.2)
        .to(".c-ribbon-back", { x: -180, y: -60, duration: 0.55 }, 0.25)
        .to(".c-ribbon-front", { x: -260, y: -95, duration: 0.55 }, 0.25);

      gsap.from(".c-cta1__grid", {
        scale: 1.25,
        rotate: 10,
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: ".c-cta1", start: "top 76%", toggleActions: "play none none reverse" },
      });
      gsap.from(".c-cta1__text, .c-cta1 .c-btn, .c-cta1__word", {
        autoAlpha: 0,
        y: 34,
        stagger: 0.08,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".c-cta1", start: "top 74%", toggleActions: "play none none reverse" },
      });

      gsap.from(".c-testi__title span, .c-testi__photo, .c-testi__big-img, .c-testi__content > *", {
        autoAlpha: 0,
        y: 54,
        stagger: 0.06,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: { trigger: ".c-testi", start: "top 70%", toggleActions: "play none none reverse" },
      });

      gsap.from(".c-faq__head-inner > *, .c-faq__row", {
        autoAlpha: 0,
        y: 40,
        stagger: 0.05,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".c-faq", start: "top 74%", toggleActions: "play none none reverse" },
      });

      gsap.from(".c-cta2__left, .c-cta2__right", {
        autoAlpha: 0,
        y: 48,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".c-cta2", start: "top 78%", toggleActions: "play none none reverse" },
      });
    });

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return null;
}
