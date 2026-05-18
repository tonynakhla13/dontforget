import About from "@/components/About";
import AmbientGlow from "@/components/AmbientGlow";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Navbar from "@/components/Navbar";
import Services from "@/components/Services";
import Work from "@/components/Work";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [projects, services] = await Promise.all([
    prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    }),
    prisma.service.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <main className="relative overflow-x-clip">
      <div className="noise-layer" />
      <AmbientGlow />
      <Navbar />
      <Hero />
      <About />
      <Marquee />
      <Services services={services} />
      <Work projects={projects} />
      <Contact />
    </main>
  );
}
