import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceDetailFocused, { SERVICES_DATA } from "@/components/focused/ServiceDetailFocused";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const svc = SERVICES_DATA.find((s) => s.slug === slug);
  if (!svc) return { title: "Service Not Found — NOX Studio" };
  return {
    title: `${svc.title} — NOX Studio`,
    description: svc.body,
  };
}

export function generateStaticParams() {
  return SERVICES_DATA.map((s) => ({ slug: s.slug }));
}

export default async function FocusedServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const svc = SERVICES_DATA.find((s) => s.slug === slug);
  if (!svc) notFound();
  return <ServiceDetailFocused slug={slug} />;
}
