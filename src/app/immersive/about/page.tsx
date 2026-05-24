import type { Metadata } from "next";
import Loader from "@/components/Loader";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import AmbientGlow from "@/components/AmbientGlow";
import AboutHero from "@/components/about/AboutHero";
import OurStory from "@/components/about/OurStory";
import MissionVision from "@/components/about/MissionVision";
import TeamSection from "@/components/about/TeamSection";
import ClientsMarquee from "@/components/about/ClientsMarquee";
import AboutContact from "@/components/about/AboutContact";
import MeshWebDevBackgroundClient from "@/components/about/MeshWebDevBackgroundClient";

export const metadata: Metadata = {
  title: "About — DON'T FORGET",
  description: "Meet the team behind DON'T FORGET — a small studio building fast, memorable digital experiences.",
};

export default function ImmersiveAboutPage() {
  return (
    <>
      <Loader />
      <SmoothScroll />
      <MeshWebDevBackgroundClient />
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
