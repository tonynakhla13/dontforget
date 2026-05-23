import type { Metadata } from "next";

import Loader        from "@/components/Loader";
import SmoothScroll  from "@/components/SmoothScroll";
import AmbientGlow   from "@/components/AmbientGlow";
import Navbar        from "@/components/Navbar";
import AboutHero     from "@/components/about/AboutHero";
import OurStory      from "@/components/about/OurStory";
import MissionVision from "@/components/about/MissionVision";
import TeamSection      from "@/components/about/TeamSection";
import ClientsMarquee  from "@/components/about/ClientsMarquee";
import AboutContact    from "@/components/about/AboutContact";
import AboutBackground from "@/components/about/AboutBackground";

export const metadata: Metadata = {
  title: "About — DON'T FORGET",
  description:
    "We're a small studio that builds fast, memorable digital experiences. Learn who we are, what drives us, and meet the team.",
};

export default function AboutPage() {
  return (
    <>
      <Loader />
      <SmoothScroll />
      <AboutBackground />
      <main className="relative z-[1] overflow-x-clip">
        <div className="noise" />
        <AmbientGlow />
        <Navbar inner />
        <AboutHero />
        <OurStory />
        <MissionVision />
        <TeamSection />
        <ClientsMarquee />
        <AboutContact />
      </main>
    </>
  );
}
