import type { Metadata } from "next";
import ContactFocused from "@/components/focused/ContactFocused";

export const metadata: Metadata = {
  title: "Contact — NOX Studio",
  description: "Have a project in mind? Tell us what you need.",
};

export default function FocusedContactPage() {
  return <ContactFocused />;
}
