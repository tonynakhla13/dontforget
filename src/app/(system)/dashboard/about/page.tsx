import { prisma } from "@/lib/prisma";
import AboutEditor from "@/components/dashboard/AboutEditor";

export const dynamic = "force-dynamic";

export default async function AboutDashboardPage() {
  const page = await prisma.aboutPage.findUnique({ where: { id: 1 } });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white mb-2">About Page</h1>
      <p className="text-sm text-white/40 mb-8">Edit studio metrics, story timeline, mission, and vision.</p>
      <AboutEditor initial={page as Parameters<typeof AboutEditor>[0]["initial"]} />
    </div>
  );
}
