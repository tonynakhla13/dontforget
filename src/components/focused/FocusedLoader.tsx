"use client";
import { useEffect, useState } from "react";
import { NoxLogo } from "./NoxShared";

export default function FocusedLoader() {
  const [phase, setPhase] = useState<"show" | "fade" | "done">("show");

  useEffect(() => {
    // Hold for 1.6s then fade out over 0.6s
    const t1 = setTimeout(() => setPhase("fade"), 1600);
    const t2 = setTimeout(() => setPhase("done"), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      style={{
        position:        "fixed",
        inset:           0,
        zIndex:          99999,
        background:      "#000",
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        flexDirection:   "column",
        gap:             "clamp(1rem, 3vw, 2rem)",
        opacity:         phase === "fade" ? 0 : 1,
        transition:      "opacity 0.6s ease",
        pointerEvents:   phase === "fade" ? "none" : "all",
      }}
    >
      {/* Logo */}
      <div
        style={{
          width:    "clamp(260px, 45vw, 560px)",
          opacity:  1,
          animation: "nox-loader-pulse 1.8s ease-in-out infinite",
        }}
      >
        <NoxLogo height={120} />
        <style>{`
          @keyframes nox-loader-pulse {
            0%, 100% { opacity: 0.9; transform: scale(1); }
            50%       { opacity: 1;   transform: scale(1.025); }
          }
          .nox-loader-dot {
            width: 6px; height: 6px; border-radius: 50%;
            background: #46ae22;
            animation: nox-dot-blink 1.2s ease-in-out infinite;
          }
          .nox-loader-dot:nth-child(2) { animation-delay: .2s; }
          .nox-loader-dot:nth-child(3) { animation-delay: .4s; }
          @keyframes nox-dot-blink {
            0%, 100% { opacity: 0.2; transform: scale(0.7); }
            50%       { opacity: 1;   transform: scale(1); }
          }
        `}</style>
      </div>

      {/* Loading dots */}
      <div style={{ display: "flex", gap: 8 }}>
        <span className="nox-loader-dot" />
        <span className="nox-loader-dot" />
        <span className="nox-loader-dot" />
      </div>
    </div>
  );
}
