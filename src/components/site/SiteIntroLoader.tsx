"use client";

import { useEffect, useState } from "react";
import NoxLoader, { NOX_LOADER_DEFAULT_SECONDS } from "./NoxLoader";

/**
 * The intro loader for a hard page load, in every theme.
 *
 * Mounted once in the locale layout, which survives theme switches and every
 * soft navigation — those are covered by ThemeLoadingExperience instead. It is
 * server-rendered in the "show" phase so the black screen is already in the
 * first HTML, then the timers below take it away after hydration.
 */

const HOLD_MS = NOX_LOADER_DEFAULT_SECONDS * 1000;
const FADE_MS = 700;

export default function SiteIntroLoader() {
  const [phase, setPhase] = useState<"show" | "fade" | "done">("show");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const fadeTimer = window.setTimeout(() => setPhase("fade"), HOLD_MS);
    const doneTimer = window.setTimeout(() => {
      document.body.style.overflow = previousOverflow;
      setPhase("done");
    }, HOLD_MS + FADE_MS);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      style={{
        position:      "fixed",
        inset:         0,
        zIndex:        20000,
        background:    "#000",
        opacity:       phase === "fade" ? 0 : 1,
        transition:    `opacity ${FADE_MS}ms ease`,
        pointerEvents: phase === "fade" ? "none" : "all",
      }}
    >
      <NoxLoader />
    </div>
  );
}
