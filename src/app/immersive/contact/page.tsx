import type { Metadata } from "next";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import AmbientGlow from "@/components/AmbientGlow";
import ContactHub from "@/components/ContactHub";

export const metadata: Metadata = {
  title: "Contact — DON'T FORGET",
  description: "Have a project in mind? Tell us what you need.",
};

export default function ImmersiveContactPage() {
  return (
    <>
      <SmoothScroll />
      <AmbientGlow />
      <main className="relative z-[1] overflow-x-clip">
        <div className="noise" />
        <Navbar inner />
        <ContactHub />
      </main>
    </>
  );
}
