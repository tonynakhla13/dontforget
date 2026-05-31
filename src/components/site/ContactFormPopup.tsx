"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const CreativeContactHome = dynamic(() => import("@/components/creative/CreativeContactHome"), { ssr: false });
const FocusedGuidedBriefModal = dynamic(
  () => import("@/components/focused/NoxContactHome").then((mod) => mod.FocusedGuidedBriefModal),
  { ssr: false },
);

const CONTACT_EVENT = "contact-form:open";
type ContactTheme = "creative" | "focused";

export function openContactFormPopup() {
  window.dispatchEvent(new Event(CONTACT_EVENT));
}

function ContactFormDialog({ onClose, theme }: { onClose: () => void; theme: ContactTheme }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const isCreative = theme === "creative";

  if (isCreative) {
    return (
      <div
        className="theme-contact-popup theme-contact-popup--creative"
        role="dialog"
        aria-modal="true"
        aria-label="Project inquiry form"
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 20000,
          display: "grid",
          placeItems: "center",
          padding: "clamp(0.75rem, 2vw, 1.5rem)",
          background: "rgba(35,31,32,0.56)",
          backdropFilter: "blur(18px)",
        }}
      >
        <style>{`
          .theme-contact-popup--creative .cc-home--card-only {
            padding: 0;
            background: transparent;
          }
          .theme-contact-popup--creative .cc-home--card-only .cc-home__inner {
            display: block;
            max-width: none;
            margin: 0;
          }
          .theme-contact-popup--creative .cc-home--card-only .cc-home__card {
            border: 0;
            border-radius: 28px;
            min-height: auto;
            padding: clamp(2rem, 4vw, 3rem);
            box-shadow: 8px 10px 0 var(--c-lime), 13px 16px 0 var(--c-ink);
          }
          .theme-contact-popup--creative .cc-home--card-only .cc-nav {
            margin-top: clamp(2rem, 4vw, 3rem);
          }
        `}</style>
        <div
          onClick={(event) => event.stopPropagation()}
          style={{
            position: "relative",
            width: "min(980px, calc(100vw - 1.5rem))",
            maxHeight: "calc(100dvh - 1.5rem)",
            overflow: "auto",
            borderRadius: 28,
            border: "2px solid var(--c-ink)",
            background: "var(--c-white)",
            color: "var(--c-ink)",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close contact form"
            style={{
              position: "absolute",
              top: 18,
              right: 18,
              zIndex: 5,
              width: 40,
              height: 40,
              display: "grid",
              placeItems: "center",
              borderRadius: "50%",
              border: "1px solid var(--c-ink)",
              color: "var(--c-ink)",
              background: "var(--c-lime)",
              boxShadow: "2px 2px 0 var(--c-ink)",
            }}
          >
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <CreativeContactHome cardOnly />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`theme-contact-popup theme-contact-popup--${theme}`}
      role="dialog"
      aria-modal="true"
      aria-label="Project inquiry form"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 20000,
        display: "grid",
        placeItems: "center",
        padding: "clamp(0.75rem, 2vw, 1.5rem)",
        background: isCreative ? "rgba(35,31,32,0.64)" : "rgba(0,0,0,0.72)",
        backdropFilter: "blur(18px)",
      }}
    >
      <style>{`
        .theme-contact-popup .cc-home {
          min-height: auto;
          padding: clamp(2rem, 4vw, 3.5rem);
        }
        .theme-contact-popup .cc-home--card-only {
          padding: 0;
          background: transparent;
        }
        .theme-contact-popup .cc-home--card-only .cc-home__inner {
          display: block;
          max-width: none;
          margin: 0;
        }
        .theme-contact-popup .cc-home--card-only .cc-home__card {
          border: 0;
          border-radius: 0;
          min-height: 100%;
        }
        .theme-contact-popup .tk-contact-home {
          min-height: auto;
          border-top: 0 !important;
          padding: clamp(3rem, 6vw, 5rem) clamp(1.5rem, 4vw, 3.5rem) !important;
        }
      `}</style>
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: isCreative ? "min(1180px, calc(100vw - 1.5rem))" : "min(1180px, calc(100vw - 1.5rem))",
          height: "min(820px, calc(100vh - 1.5rem))",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          borderRadius: isCreative ? 24 : 0,
          border: isCreative ? "2px solid var(--c-ink)" : "1px solid var(--nox-border)",
          background: isCreative ? "var(--c-paper)" : "var(--nox-ink)",
          color: isCreative ? "var(--c-ink)" : "var(--nox-green)",
          boxShadow: "0 28px 90px rgba(0,0,0,0.45)",
        }}
      >
        <div
          style={{
            height: 58,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 18px",
            borderBottom: isCreative ? "2px solid var(--c-ink)" : "1px solid var(--nox-border)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono-next), monospace",
              fontSize: "0.62rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: isCreative ? "var(--c-ink)" : "var(--nox-green)",
            }}
          >
            Let&apos;s talk
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close contact form"
            style={{
              width: 34,
              height: 34,
              display: "grid",
              placeItems: "center",
              borderRadius: "50%",
              border: isCreative ? "1px solid var(--c-ink)" : "1px solid var(--nox-border)",
              color: isCreative ? "var(--c-ink)" : "var(--nox-text-muted)",
              background: isCreative ? "var(--c-lime)" : "transparent",
            }}
          >
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div style={{ flex: "1 1 auto", minHeight: 0, overflow: "auto", overscrollBehavior: "contain" }}>
          {isCreative ? <CreativeContactHome cardOnly /> : null}
        </div>
      </div>
    </div>
  );
}

export default function ContactFormPopup({ theme }: { theme: ContactTheme }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openPopup = () => setOpen(true);
    window.addEventListener(CONTACT_EVENT, openPopup);
    return () => window.removeEventListener(CONTACT_EVENT, openPopup);
  }, []);

  if (!open) return null;

  if (theme === "focused") {
    return <FocusedGuidedBriefModal onClose={() => setOpen(false)} />;
  }

  return <ContactFormDialog theme={theme} onClose={() => setOpen(false)} />;
}
