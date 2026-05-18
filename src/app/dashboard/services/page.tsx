import { prisma } from "@/lib/prisma";
import ServicesManager from "@/components/dashboard/ServicesManager";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white mb-8">Services</h1>
      <ServicesManager initial={services} />
    </div>
  );
}
