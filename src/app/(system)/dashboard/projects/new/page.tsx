import { prisma } from "@/lib/prisma";
import ProjectForm from "@/components/dashboard/ProjectForm";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const [techItems, clientItems, services, mediaAssets] = await Promise.all([
    prisma.techItem.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] }),
    prisma.clientItem.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] }),
    prisma.service.findMany({ orderBy: [{ order: "asc" }, { title: "asc" }], select: { id: true, title: true } }),
    prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, url: true, originalName: true, filename: true, mimeType: true, alt: true } }),
  ]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white mb-8">New Project</h1>
      <ProjectForm techItems={techItems} clientItems={clientItems} services={services} mediaAssets={mediaAssets} />
    </div>
  );
}
