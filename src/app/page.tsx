import About from "@/components/About";
import Availability from "@/components/Availability";
import AmbientGlow from "@/components/AmbientGlow";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Navbar from "@/components/Navbar";
import Principles from "@/components/Principles";
import Process from "@/components/Process";
import Services from "@/components/Services";
import Work from "@/components/Work";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
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
    <main className="relative overflow-x-clip">
      <div className="noise-layer" />
      <AmbientGlow />
      <Navbar />
      <Hero />
      <About />
      <Marquee />
      <Services services={services} />
      <Process />
      <Work projects={projects} />
      <Principles />
      <Availability />
      <Contact />
    </main>
  );
}
