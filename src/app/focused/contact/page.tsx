import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ContactFocused, { type ContactInfo } from "@/components/focused/ContactFocused";

export const metadata: Metadata = {
  title: "Contact — DON'T FORGET",
  description:
    "Have a project in mind? Get in touch with the DON'T FORGET studio — we'd love to hear about it.",
};

export const dynamic = "force-dynamic";

async function getContactInfo(): Promise<ContactInfo> {
  try {
    const page = await prisma.contactPage.findUnique({ where: { id: 1 } });
    if (!page) return {};
    return {
      email:       page.email,
      phone:       page.phone,
      address:     page.address,
      socialLinks: page.socialLinks as Record<string, string> | null,
    };
  } catch {
    return {};
  }
}

export default async function FocusedContactPage() {
  const contactInfo = await getContactInfo();
  return <ContactFocused contactInfo={contactInfo} />;
}
