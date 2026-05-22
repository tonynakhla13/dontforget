"use client";

import { useTheme } from "@/lib/themeContext";
import { ReactNode } from "react";

export default function ThemeStyleWrapper({ children }: { children: ReactNode }) {
  const { mode } = useTheme();

  let backgroundColor = "";
  let accentElements = null;

  if (mode === "focused") {
    backgroundColor = "linear-gradient(to b, #ffffff, #f8fafc, #ffffff)";
  } else if (mode === "creative") {
    backgroundColor = "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)";
    accentElements = (
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute top-20 -right-40 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, #14b8a6 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-40 -left-40 w-96 h-96 rounded-full opacity-15 blur-3xl"
          style={{
            background: "radial-gradient(circle, #ec4899 0%, transparent 70%)",
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={
        backgroundColor ? { background: backgroundColor } : undefined
      }
      className="relative z-[1] overflow-x-clip"
    >
      {accentElements}
      <div className={mode === "creative" ? "relative z-10" : ""}>
        {children}
      </div>
    </div>
  );
}
