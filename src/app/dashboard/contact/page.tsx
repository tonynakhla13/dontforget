import { prisma } from "@/lib/prisma";
import ContactEditor from "@/components/dashboard/ContactEditor";

export default async function ContactDashboardPage() {
  const page = await prisma.contactPage.findUnique({ where: { id: 1 } });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white mb-8">Contact Page</h1>
      <ContactEditor initial={page} />
    </div>
  );
}
