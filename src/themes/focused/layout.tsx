import FocusedLivingBackground from "@/components/focused/FocusedLivingBackground";
import NoxGrid from "@/components/focused/NoxGrid";

export default function FocusedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap");

        /* ── NOX theme variables ─────────────────────────────── */
        :root {
          --nox-ink:            #000000;
          --nox-paper:          #ffffff;
          --nox-green:          #46ae22;
          --nox-chrome:         rgb(38,37,37);
          --nox-field-bg:       #0b1509;
          --nox-field-bg-focus: #122610;
          --nox-card-mask:      #000000;
          --nox-form-card-bg:   transparent;
          --nox-proj-card-bg:   #050805;
          --nox-proj-sub:       rgba(255,255,255,0.55);
          --nox-proj-body:      rgba(255,255,255,0.74);
          --nox-svc-card-bg:    #0b1e07;
          --nox-svc-card-hov:   #102808;
          --nox-svc-border:     rgba(70,174,34,0.18);
          --nox-svc-border-hov: rgba(70,174,34,0.65);
          --nox-svc-body:       rgba(70,174,34,0.68);
          --nox-svc-body-hov:   rgba(70,174,34,0.95);
          --nox-btn-start-bg:   rgba(70,174,34,0.12);
          --nox-btn-start-hov:  #46ae22;
          --nox-btn-start-c:    #46ae22;
          --nox-btn-start-ch:   #000000;
          /* surface tokens used by components */
          --nox-panel:          #0a0e0c;
          --nox-card:           #070b09;
          --nox-border:         rgba(255,255,255,0.09);
          --nox-border-faint:   rgba(255,255,255,0.06);
          --nox-text-muted:     rgba(255,255,255,0.52);
          --nox-text-faint:     rgba(255,255,255,0.28);
          --nox-icon-faint:     rgba(255,255,255,0.13);
          --nox-logo-filter:    brightness(0) invert(1);
        }
        [data-nox-theme="light"] {
          /* ── page canvas ───────────────────────────────────── */
          --nox-ink:            #f7f6f1;
          --nox-paper:          #0d0d0b;
          --nox-green:          #267803;
          --nox-chrome:         #1a1918;

          /* ── form / inputs ─────────────────────────────────── */
          --nox-field-bg:       #eeede8;
          --nox-field-bg-focus: #e5e4de;
          --nox-card-mask:      #f7f6f1;
          --nox-form-card-bg:   #ffffff;

          /* ── project / work cards ──────────────────────────── */
          --nox-proj-card-bg:   #eeede8;
          --nox-proj-sub:       rgba(13,13,11,0.52);
          --nox-proj-body:      rgba(13,13,11,0.75);

          /* ── service cards ─────────────────────────────────── */
          --nox-svc-card-bg:    #ffffff;
          --nox-svc-card-hov:   #f7f6f1;
          --nox-svc-border:     rgba(0,0,0,0.09);
          --nox-svc-border-hov: rgba(38,120,3,0.55);
          --nox-svc-body:       rgba(38,120,3,0.72);
          --nox-svc-body-hov:   rgba(38,120,3,1);

          /* ── buttons ───────────────────────────────────────── */
          --nox-btn-start-bg:   rgba(38,120,3,0.09);
          --nox-btn-start-hov:  #267803;
          --nox-btn-start-c:    #267803;
          --nox-btn-start-ch:   #ffffff;

          /* ── surface tokens ────────────────────────────────── */
          --nox-panel:          #edecea;
          --nox-card:           #e8e7e1;
          --nox-border:         rgba(0,0,0,0.09);
          --nox-border-faint:   rgba(0,0,0,0.055);
          --nox-text-muted:     rgba(13,13,11,0.55);
          --nox-text-faint:     rgba(13,13,11,0.32);
          --nox-icon-faint:     rgba(13,13,11,0.14);
          --nox-logo-filter:    brightness(0) saturate(0);
        }

        /* Reset focused theme to Techolo canvas */
        html, body {
          background: var(--nox-ink) !important;
          color: #46ae22 !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        /* ── light-mode overrides ────────────────────────────── */

        /* service card injected box-shadows & pill borders */
        [data-nox-theme="light"] [class*="sf-card-"] {
          box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1) !important;
        }
        [data-nox-theme="light"] [class*="sf-card-"]:hover {
          box-shadow: inset 0 0 0 2px var(--nox-green),
                      0 12px 48px rgba(38,120,3,0.08) !important;
        }
        [data-nox-theme="light"] [class*="sf-pill-"] {
          border-color: rgba(0,0,0,0.12) !important;
          background:   rgba(38,120,3,0.06) !important;
        }
        [data-nox-theme="light"] [class*="sf-card-"]:hover [class*="sf-pill-"] {
          border-color: rgba(38,120,3,0.4)  !important;
          background:   rgba(38,120,3,0.12) !important;
        }

        /* grid canvas: tone down on light */
        [data-nox-theme="light"] .nox-grid-canvas {
          opacity: 0.45;
        }

        /* living background: less dominating on light */
        [data-nox-theme="light"] .focused-living-background {
          opacity: 0.25 !important;
        }

        /* navbar: slight shadow so it separates from the page */
        [data-nox-theme="light"] .nox-navbar {
          box-shadow: 0 1px 0 rgba(0,0,0,0.08);
        }

        /* client logo images: invert for dark mode, black for light mode */
        [data-nox-theme="light"] .nox-client-logo {
          filter: var(--nox-logo-filter) !important;
        }

        /* footer dividers and muted text */
        [data-nox-theme="light"] .nox-footer-line {
          background: rgba(0,0,0,0.1) !important;
        }

        /* Hide any leftover ambient/particle elements from the shell */
        [class*="AmbientGlow"],
        [class*="ambient"],
        [class*="Particles"],
        [class*="DoodleCanvas"],
        [class*="doodle"] {
          display: none !important;
        }

        .focused-living-background {
          position: fixed;
          inset: 0;
          z-index: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          opacity: 0.5;
          mix-blend-mode: screen;
          transition: opacity 400ms ease;
        }
        [data-nox-theme="light"] .focused-living-background {
          mix-blend-mode: multiply;
          opacity: 0.6;
        }

        .focused-theme-content {
          position: relative;
          z-index: 2;
        }

        .focused-theme-content > div {
          background: transparent !important;
        }

        /* ── spinning border for service cards ───────────────── */
        @keyframes nox-border-spin {
          to { transform: rotate(360deg); }
        }

        /* The light element – sits inside the card, clips the rotating gradient */
        .nox-border-light {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          opacity: 0;
          transition: opacity 200ms ease;
          z-index: 0;
        }

        /* Rotating conic gradient – the actual "moving light" */
        .nox-border-light::before {
          content: '';
          position: absolute;
          width: 200%;
          height: 200%;
          top: -50%;
          left: -50%;
          background: conic-gradient(
            transparent 0%,
            transparent 38%,
            #46d12a    50%,
            transparent 62%,
            transparent 100%
          );
          animation: nox-border-spin 1.6s linear infinite paused;
        }

        /* Inner mask – hides everything except the 1px border ring */
        .nox-border-light::after {
          content: '';
          position: absolute;
          inset: 1px;
          background: var(--nox-card-mask);
          transition: background 240ms ease;
        }

        /* Active state (class toggled on hover) */
        .nox-card-lit .nox-border-light {
          opacity: 1;
        }
        .nox-card-lit .nox-border-light::before {
          animation-play-state: running;
        }
        .nox-card-lit .nox-border-light::after {
          background: #46ae22;
        }

        /* All card content must sit above the border light */
        .tk-svc-item > *:not(.nox-border-light) {
          position: relative;
          z-index: 1;
        }

        @media (prefers-reduced-motion: reduce) {
          .focused-living-background {
            opacity: 0.24;
          }
          .nox-border-light::before {
            animation: none;
          }
        }
      `}</style>
      <div className="focused-theme-content">{children}</div>
    </>
  );
}
