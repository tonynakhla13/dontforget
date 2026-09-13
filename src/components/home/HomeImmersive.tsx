'use client'

import { useEffect } from 'react'
import { ScrollTrigger } from '@/lib/gsap'
import About from '@/components/About'
import ClientsMarquee from '@/components/about/ClientsMarquee'
import AmbientGlow from '@/components/AmbientGlow'
import ImmersiveContact from '@/components/immersive/ImmersiveContact'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import Navbar from '@/components/Navbar'
import Principles from '@/components/Principles'
import Process from '@/components/Process'
import Services from '@/components/Services'
import SmoothScroll from '@/components/SmoothScroll'
import type { Project } from '@/components/Work'
import ImmersiveWorkCarousel from '@/components/immersive/ImmersiveWorkCarousel'
import ParticleLayer from '@/components/ParticleLayer'
import type { PublicService } from '@/lib/public-content'

export default function HomeImmersive({
  projects,
  services,
}: {
  projects?: Project[]
  services?: PublicService[]
}) {
  // Content mounts late inside the theme switcher, so ScrollTrigger measured
  // stale positions on init. Refresh once laid out so reveal triggers fire.
  useEffect(() => {
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <>
      <SmoothScroll />
      {/* ParticleLayer must live OUTSIDE <main> to avoid stacking context trapping z-index:-1 */}
      <ParticleLayer />
      <main className="immersive-mode relative z-[1] overflow-x-clip">
        <div className="noise" />
        <AmbientGlow />
        <Navbar />
        <Hero />
        <About />
        <Marquee />
        <Services services={services} />
        <Process />
        <ImmersiveWorkCarousel projects={projects} />
        <Principles />
        <ClientsMarquee />
        <ImmersiveContact embedded />
      </main>
    </>
  )
}
