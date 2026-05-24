"use client";

import { useEffect, useState } from "react";
import type { Project } from "@prisma/client";
import { ScrollTrigger } from "@/lib/gsap";
import About from "@/components/About";
import ClientsMarquee from "@/components/about/ClientsMarquee";
import AmbientGlow from "@/components/AmbientGlow";
import ImmersiveContact from "@/components/immersive/ImmersiveContact";
import Hero from "@/components/Hero";
import Loader from "@/components/Loader";
import Marquee from "@/components/Marquee";
import Navbar from "@/components/Navbar";
import Principles from "@/components/Principles";
import Process from "@/components/Process";
import Services from "@/components/Services";
import SmoothScroll from "@/components/SmoothScroll";
import Work from "@/components/Work";
import ParticleLayer from "@/components/ParticleLayer";
import ImmersiveFooter from "@/components/immersive/ImmersiveFooter";

export default function HomeImmersive() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects?published=true");
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };
    fetchProjects();
  }, []);

  // Content mounts late inside the theme switcher, so ScrollTrigger measured
  // stale positions on init. Refresh once laid out so reveal triggers fire.
  useEffect(() => {
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <Loader />
      <SmoothScroll />
      {/* ParticleLayer must live OUTSIDE <main> to avoid stacking context trapping z-index:-1 */}
      <ParticleLayer />
      <main className="relative z-[1] overflow-x-clip">
        <div className="noise" />
        <AmbientGlow />
        <Navbar />
        <Hero />
        <About />
        <Marquee />
        <Services />
        <Process />
        <Work projects={projects} />
        <Principles />
        <ClientsMarquee />
        <ImmersiveContact embedded />
        <ImmersiveFooter />
      </main>
    </>
  );
}
