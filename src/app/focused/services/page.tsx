import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ServicesFocused, { type FocusedService } from "@/components/focused/ServicesFocused";

export const metadata: Metadata = {
  title: "Our Services — DON'T FORGET",
  description:
    "Brand systems, digital products, immersive web experiences, and motion identities — built to be impossible to forget.",
};

export const dynamic = "force-dynamic";

async function getServices(): Promise<FocusedService[] | undefined> {
  try {
    const svcs = await prisma.service.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      select: { title: true, description: true },
    });
    if (!svcs.length) return undefined;
    return svcs.map(s => ({ title: s.title, body: s.description ?? "" }));
  } catch {
    return undefined;
  }
}

export default async function FocusedServicesPage() {
  const services = await getServices();
  // undefined → ServicesFocused uses its own built-in fallback
  return <ServicesFocused services={services} />;
}
