import type { Metadata } from "next";
import ServicesFocused from "@/components/focused/ServicesFocused";

export const metadata: Metadata = {
  title: "Our Services — NOX Studio",
  description:
    "Web development, UI/UX, e-commerce, mobile apps, SEO, and CRM platforms — six disciplines, one studio. Built to be impossible to forget.",
};

export default function FocusedServicesPage() {
  return <ServicesFocused />;
}
