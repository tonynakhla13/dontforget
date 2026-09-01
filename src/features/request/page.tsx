import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import AmbientGlow from "@/components/AmbientGlow";
import ContactHub from "@/components/ContactHub";

export const metadata: Metadata = {
  title: "Start a Project — NOX Studio",
  description:
    "Tell us what you're building. We'll make it unforgettable.",
};

export default function RequestPage() {
  return (
    <>
      <AmbientGlow />
      <Navbar inner />
      <ContactHub />
    </>
  );
}
