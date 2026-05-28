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

  const [project, techItems, clientItems, services, mediaAssets] = await Promise.all([
    prisma.project.findUnique({
      where: { id },
      include: { attachments: { orderBy: { order: "asc" } }, services: { orderBy: { order: "asc" } } },
    }),
    prisma.techItem.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] }),
    prisma.clientItem.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] }),
    prisma.service.findMany({ orderBy: [{ order: "asc" }, { title: "asc" }], select: { id: true, title: true } }),
    prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, url: true, originalName: true, filename: true, mimeType: true, alt: true } }),
  ]);

  if (!project) notFound();

  const initial = Object.fromEntries(
    Object.entries(project).map(([k, v]) => [k, v === null ? undefined : v])
  );
  initial.attachments = project.attachments.map((item) => ({ mediaId: item.mediaId, role: item.role, theme: item.theme, order: item.order }));
  initial.serviceIds = project.services.map((item) => item.serviceId);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white mb-8">
        Edit — {project.title}
      </h1>
      <ProjectForm initial={initial} techItems={techItems} clientItems={clientItems} services={services} mediaAssets={mediaAssets} />
    </div>
  );
}
