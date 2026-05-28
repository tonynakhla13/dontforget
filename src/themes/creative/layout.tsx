import "./creative.css";
import type { ReactNode } from "react";
import CreativeBodyOverflow from "@/components/creative/CreativeBodyOverflow";
import LimeBrushTrail from "@/components/creative/LimeBrushTrail";
import CreativeCursor from "@/components/creative/CreativeCursor";

export default function CreativeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="creative-mode">
      <CreativeBodyOverflow />
      <CreativeCursor />
      <LimeBrushTrail />
      {children}
    </div>
  );
}
