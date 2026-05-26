import { prisma } from "@/lib/prisma";
import InquiriesManager from "@/components/dashboard/InquiriesManager";

export const dynamic = "force-dynamic";

export default async function InquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white mb-8">Inquiries</h1>
      <InquiriesManager initial={inquiries} />
    </div>
  );
}
