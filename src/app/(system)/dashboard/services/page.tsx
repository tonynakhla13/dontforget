import { prisma } from "@/lib/prisma";
import ServicesManager from "@/components/dashboard/ServicesManager";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const [services, mediaAssets, techItems] = await Promise.all([
    prisma.service.findMany({
      orderBy: { order: "asc" },
      include: { attachments: { orderBy: { order: "asc" } } },
    }),
    prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, url: true, originalName: true, filename: true, mimeType: true, alt: true } }),
    prisma.techItem.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }], select: { id: true, name: true, icon: true, iconUrl: true } }),
  ]);
  const initial = services.map((service) => ({
    ...service,
    attachments: service.attachments.map((item) => ({ mediaId: item.mediaId, role: item.role, theme: item.theme, order: item.order })),
  }));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white mb-8">Services</h1>
      <ServicesManager initial={initial} mediaAssets={mediaAssets} techItems={techItems} />
    </div>
  );
}
