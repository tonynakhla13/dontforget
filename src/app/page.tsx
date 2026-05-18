import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Work from "@/components/Work";
import Contact from "@/components/Contact";
import { prisma } from "@/lib/prisma";

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
    <main>
      <Navbar />
      <Hero />
      <Services services={services} />
      <Work projects={projects} />
      <Contact />
    </main>
  );
}
