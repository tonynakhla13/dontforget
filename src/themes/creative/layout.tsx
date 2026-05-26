import "./creative.css";
import type { ReactNode } from "react";
import LimeBrushTrail from "@/components/creative/LimeBrushTrail";
import CreativeCursor from "@/components/creative/CreativeCursor";

export default function CreativeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="creative-mode">
      <CreativeCursor />
      <LimeBrushTrail />
      {children}
    </div>
  );
}
