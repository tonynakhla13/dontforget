import About from "@/components/About";
import Availability from "@/components/Availability";
import AmbientGlow from "@/components/AmbientGlow";
import Contact from "@/components/Contact";
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
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CreativePage() {
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
      <ParticleLayer />
      <main
        className="relative z-[1] overflow-x-clip"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
        }}
      >
        <div className="noise" />

        {/* Creative accent elements */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div
            className="absolute top-20 -right-40 w-80 h-80 rounded-full opacity-20 blur-3xl"
            style={{
              background: "radial-gradient(circle, #14b8a6 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-40 -left-40 w-96 h-96 rounded-full opacity-15 blur-3xl"
            style={{
              background: "radial-gradient(circle, #ec4899 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative z-10">
          <AmbientGlow />
          <Navbar />
          <Hero />
          <About />
          <Marquee />
          <Services />
          <Process />
          <Work projects={projects} />
          <Principles />
          <Availability />
          <Contact />
        </div>
      </main>
    </>
  );
}
