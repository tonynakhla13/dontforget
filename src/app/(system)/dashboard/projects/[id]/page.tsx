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

  const [project, techItems, clientItems] = await Promise.all([
    prisma.project.findUnique({ where: { id } }),
    prisma.techItem.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] }),
    prisma.clientItem.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] }),
  ]);

  if (!project) notFound();

  const initial = Object.fromEntries(
    Object.entries(project).map(([k, v]) => [k, v === null ? undefined : v])
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white mb-8">
        Edit — {project.title}
      </h1>
      <ProjectForm initial={initial} techItems={techItems} clientItems={clientItems} />
    </div>
  );
}
