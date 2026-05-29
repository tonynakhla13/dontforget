import { notFound } from "next/navigation";
import { getService } from "@/lib/public-content";
import ServiceDetailCreative from "@/components/creative/ServiceDetailCreative";
import type { Locale } from "@/i18n/config";

export default async function CreativeServicePage({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const service = await getService(locale, slug);
  if (!service) notFound();
  return <ServiceDetailCreative service={service} locale={locale} />;
}
