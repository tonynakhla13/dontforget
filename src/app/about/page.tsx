import Navbar        from "@/components/Navbar";
import Loader        from "@/components/Loader";
import SmoothScroll  from "@/components/SmoothScroll";
import ParticleLayer from "@/components/ParticleLayer";
import AboutHero     from "@/components/about/AboutHero";
import OurStory      from "@/components/about/OurStory";
import MissionVision from "@/components/about/MissionVision";
import TeamSection   from "@/components/about/TeamSection";
import AboutContact  from "@/components/about/AboutContact";

export const metadata = {
  title: "About — DON'T FORGET",
  description:
    "We're a small studio that builds fast, memorable digital experiences. Learn who we are, what drives us, and meet the team.",
};

export default function AboutPage() {
  return (
    <>
      <Loader />
      <SmoothScroll />
      <ParticleLayer />
      <main className="relative z-[1] overflow-x-clip">
        <Navbar />
        <AboutHero />
        <OurStory />
        <MissionVision />
        <TeamSection />
        <AboutContact />
      </main>
    </>
  );
}
