import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProjectForm from "@/components/dashboard/ProjectForm";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  // Convert Prisma nulls to undefined for the form
  const initial = Object.fromEntries(
    Object.entries(project).map(([k, v]) => [k, v === null ? undefined : v])
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white mb-8">
        Edit — {project.title}
      </h1>
      <ProjectForm initial={initial} />
    </div>
  );
}
