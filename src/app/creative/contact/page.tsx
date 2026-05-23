import type { Metadata } from "next";
import Loader from "@/components/Loader";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import AmbientGlow from "@/components/AmbientGlow";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact — DON'T FORGET",
  description: "Have a project in mind? Get in touch — we'd love to hear about it.",
};

export default function CreativeContactPage() {
  return (
    <>
      <Loader />
      <SmoothScroll />
      <main className="relative z-[1] overflow-x-clip">
        <div className="noise" />
        <AmbientGlow />
        <Navbar inner />
        {/* Contact uses CSS vars and adapts to dark theme automatically */}
        <div className="pt-24">
          <Contact />
        </div>
      </main>
    </>
  );
}
