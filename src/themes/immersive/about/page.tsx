import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import AmbientGlow from "@/components/AmbientGlow";
import AboutHero from "@/components/about/AboutHero";
import StatsSection from "@/components/about/StatsSection";
import OurStory from "@/components/about/OurStory";
import MissionVision from "@/components/about/MissionVision";
import TeamSection from "@/components/about/TeamSection";
import ClientsMarquee from "@/components/about/ClientsMarquee";
import ImmersiveContact from "@/components/immersive/ImmersiveContact";
import NoxPipeHologram from "@/components/about/NoxPipeHologram";
import type { StatItem } from "@/components/about/StatsSection";
import type { StoryEvent } from "@/components/about/OurStory";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About — DON'T FORGET",
  description: "Meet the team behind DON'T FORGET — a small studio building fast, memorable digital experiences.",
};

export default async function ImmersiveAboutPage() {
  const aboutData = await prisma.aboutPage.findUnique({ where: { id: 1 } });

  const stats  = (aboutData?.stats  as StatItem[]  | null) ?? [];
  const story  = (aboutData?.story  as StoryEvent[] | null) ?? [];
  const mission = aboutData?.mission ?? null;
  const vision  = aboutData?.vision  ?? null;

  return (
    <>
      <SmoothScroll />
      {/* NOX pipe hologram — bespoke wireframe lettering for the about page */}
      <NoxPipeHologram />
      <main className="relative z-[1] overflow-x-clip">
        <div className="noise" />
        <AmbientGlow />
        <Navbar inner />
        <AboutHero />
        <StatsSection stats={stats} />
        <OurStory story={story} />
        <ClientsMarquee />
        <TeamSection />
        <MissionVision mission={mission} vision={vision} />
        {/* "Our musts" (PrinciplesWrapper) hidden per request */}
        {/* Dark overlay so the embedded contact matches the sections above */}
        <div style={{ position: "relative", background: "rgba(9,9,9,0.92)", backdropFilter: "blur(8px)", borderTop: "1px solid var(--border)" }}>
          <ImmersiveContact embedded />
        </div>
      </main>
    </>
  );
}
