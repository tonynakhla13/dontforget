import type { Metadata } from "next";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import AmbientGlow from "@/components/AmbientGlow";
import ImmersiveContact from "@/components/immersive/ImmersiveContact";

export const metadata: Metadata = {
  title: "Contact — NOX Studio",
  description: "Have a project in mind? Tell us what you need.",
};

export default function ImmersiveContactPage() {
  return (
    <>
      <SmoothScroll />
      <AmbientGlow />
      <main className="immersive-mode relative z-[1] overflow-x-clip" style={{ position: "relative" }}>
        <div className="noise" />
        <Navbar inner />
        <ImmersiveContact />
      </main>
    </>
  );
}
