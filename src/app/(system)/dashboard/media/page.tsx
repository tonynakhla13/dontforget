import { prisma } from "@/lib/prisma";
import MediaLibraryManager from "@/components/dashboard/MediaLibraryManager";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white mb-8">Media Library</h1>
      <MediaLibraryManager initial={assets} />
    </div>
  );
}
