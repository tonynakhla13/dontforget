import type { Metadata } from "next";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import ContactHub from "@/components/ContactHub";

export const metadata: Metadata = {
  title: "Contact — DON'T FORGET",
  description: "Have a project in mind? Tell us what you need.",
};

export default function FocusedContactPage() {
  return (
    <>
      <SmoothScroll />
      <Navbar inner />
      <ContactHub />
    </>
  );
}
