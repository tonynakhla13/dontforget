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
  title: "About — NOX Studio",
  description: "Meet the team behind NOX Studio — a small studio building fast, memorable digital experiences.",
};

type AboutPageData = {
  stats: unknown;
  story: unknown;
  mission: string | null;
  vision: string | null;
};

type OptionalAboutPageClient = {
  aboutPage?: {
    findUnique: (args: { where: { id: number } }) => Promise<AboutPageData | null>;
  };
};

async function getAboutPageData() {
  const aboutPage = (prisma as unknown as OptionalAboutPageClient).aboutPage;
  if (!aboutPage) return null;

  try {
    return await aboutPage.findUnique({ where: { id: 1 } });
  } catch {
    return null;
  }
}

export default async function ImmersiveAboutPage() {
  const aboutData = await getAboutPageData();

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
