import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import ServiceForm from "@/components/dashboard/ServiceForm";

export const dynamic = "force-dynamic";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [service, projects, techItems, mediaAssets] = await Promise.all([
    prisma.service.findUnique({
      where: { id },
      include: {
        attachments: { orderBy: { order: "asc" } },
        projects: { orderBy: { order: "asc" } },
      },
    }),
    prisma.project.findMany({
      orderBy: [{ order: "asc" }, { title: "asc" }],
      select: { id: true, title: true, slug: true },
    }),
    prisma.techItem.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
      select: { id: true, name: true, icon: true, iconUrl: true },
    }),
    prisma.mediaAsset.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, url: true, originalName: true, filename: true, mimeType: true, alt: true },
    }),
  ]);

  if (!service) notFound();

  const initial = {
    ...service,
    attachments: service.attachments.map((item) => ({
      mediaId: item.mediaId,
      role: item.role,
      theme: item.theme,
      order: item.order,
    })),
    projectIds: service.projects.map((item) => item.projectId),
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/dashboard/services" className="text-white/30 hover:text-white/60 transition-colors text-sm">
          ← Services
        </Link>
        <span className="text-white/15">/</span>
        <span className="text-white/50 text-sm">{service.title}</span>
      </div>
      <h1 className="text-2xl font-semibold text-white mb-8">Edit Service</h1>
      <ServiceForm
        initial={initial}
        projects={projects}
        techItems={techItems}
        mediaAssets={mediaAssets}
      />
    </div>
  );
}
