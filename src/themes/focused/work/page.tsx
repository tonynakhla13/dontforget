import type { Metadata } from "next";
import { getProjects as getPublicProjects } from "@/lib/public-content";
import ProjectsFocused, { type FocusedProject } from "@/components/focused/ProjectsFocused";

export const metadata: Metadata = {
  title: "Our Work — NOX Studio",
  description:
    "Selected work from NOX Studio — healthcare, e-commerce, SaaS, and brand projects built to perform and be remembered.",
};

export const dynamic = "force-dynamic";

export default async function FocusedWorkPage({ locale = "en" }: { locale?: string }) {
  const safeLocale = locale === "ar" ? "ar" : "en";
  const projects = await getPublicProjects(safeLocale);
  const focusedProjects: FocusedProject[] = projects.map((project) => ({
    id: project.id,
    slug: project.slug,
    title: project.title,
    category: project.category,
    description: project.description,
    coverImage: project.coverImage,
  }));

  return <ProjectsFocused projects={focusedProjects} locale={safeLocale} />;
}
