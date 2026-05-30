import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProjectsFocused, { type FocusedProject } from "@/components/focused/ProjectsFocused";

export const metadata: Metadata = {
  title: "Our Work — NOX Studio",
  description:
    "Selected work from NOX Studio — healthcare, e-commerce, SaaS, and brand projects built to perform and be remembered.",
};

export const dynamic = "force-dynamic";

const PROJECTS_FALLBACK: FocusedProject[] = [
  { id: "1", slug: "elia-clinic",  title: "Elia Clinic",  category: "Healthcare",   description: null, coverImage: null },
  { id: "2", slug: "montgab",      title: "Montgab",      category: "E-Commerce",   description: null, coverImage: null },
  { id: "3", slug: "180-degrees",  title: "180 Degrees",  category: "Agency / Brand", description: null, coverImage: null },
  { id: "4", slug: "launchpad",    title: "Launchpad",    category: "SaaS Platform", description: null, coverImage: null },
];

async function getProjects(): Promise<FocusedProject[]> {
  try {
    const projects = await prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        description: true,
        coverImage: true,
      },
    });
    return projects.length ? projects : PROJECTS_FALLBACK;
  } catch {
    return PROJECTS_FALLBACK;
  }
}

export default async function FocusedWorkPage({ locale = "en" }: { locale?: string }) {
  const projects = await getProjects();
  return <ProjectsFocused projects={projects} locale={locale} />;
}
