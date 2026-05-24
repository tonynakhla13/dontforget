import "./creative.css";
import type { ReactNode } from "react";

export default function CreativeLayout({ children }: { children: ReactNode }) {
  return <div className="creative-mode">{children}</div>;
}
