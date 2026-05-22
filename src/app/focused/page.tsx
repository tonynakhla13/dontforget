import About from "@/components/About";
import Availability from "@/components/Availability";
import Contact from "@/components/Contact";
import Loader from "@/components/Loader";
import Marquee from "@/components/Marquee";
import Navbar from "@/components/Navbar";
import Principles from "@/components/Principles";
import Process from "@/components/Process";
import Services from "@/components/Services";
import SmoothScroll from "@/components/SmoothScroll";
import Work from "@/components/Work";
import FocusedParticles from "@/components/FocusedParticles";
import FocusedHero from "@/components/FocusedHero";
import FocusedSection from "@/components/FocusedSection";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function FocusedPage() {
  const [projects, services] = process.env.DATABASE_URL
    ? await Promise.all([
        prisma.project.findMany({
          where: { status: "PUBLISHED" },
          orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        }),
        prisma.service.findMany({
          where: { active: true },
          orderBy: { order: "asc" },
        }),
      ])
    : [[], []];

  return (
    <>
      <Loader />
      <SmoothScroll />
      <FocusedParticles />
      <main className="relative z-[1] overflow-x-clip bg-white">
        <Navbar />
        <FocusedHero />
        <About />
        <Marquee />
        <Services />
        <Process />
        <Work projects={projects} />
        <Principles />
        <Availability />
        <Contact />
      </main>
    </>
  );
}
