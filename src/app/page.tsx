import About from "@/components/About";
import AmbientGlow from "@/components/AmbientGlow";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Navbar from "@/components/Navbar";
import Services from "@/components/Services";
import Work from "@/components/Work";

export default function Home() {
  return (
    <main className="relative overflow-x-clip">
      <div className="noise-layer" />
      <AmbientGlow />
      <Navbar />
      <Hero />
      <About />
      <Marquee />
      <Services />
      <Work />
      <Contact />
    </main>
  );
}
