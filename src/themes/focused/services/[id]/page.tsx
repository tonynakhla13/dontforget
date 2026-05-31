import { notFound } from "next/navigation";
import { getService } from "@/lib/public-content";
import ServiceDetailFocused from "@/components/focused/ServiceDetailFocused";
import type { Locale } from "@/i18n/config";

export default async function FocusedServicePage({ locale, id }: { locale: Locale; id: string }) {
  const service = await getService(locale, id);
  if (!service) notFound();
  return <ServiceDetailFocused service={service} locale={locale} />;
}
