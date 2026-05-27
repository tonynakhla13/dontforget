import FocusedLivingBackground from "@/components/focused/FocusedLivingBackground";
import NoxGrid from "@/components/focused/NoxGrid";

export default function FocusedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Prevent flash: read localStorage before React hydrates */}
      <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('nox-theme');if(t==='light')document.documentElement.dataset.noxTheme='light';}catch(e){}` }} />
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
        }
        [data-nox-theme="light"] {
          --nox-ink:            #e9e9e9;
          --nox-paper:          #000000;
          --nox-green:          #3d9e18;
          --nox-chrome:         rgb(215,215,215);
          --nox-field-bg:       #c8e8b8;
          --nox-field-bg-focus: #b2dea0;
          --nox-card-mask:      #ffffff;
          --nox-form-card-bg:   #daf0ce;
          --nox-proj-card-bg:   #c2e0b2;
          --nox-proj-sub:       rgba(0,0,0,0.5);
          --nox-proj-body:      rgba(0,0,0,0.72);
          --nox-svc-card-bg:    #eaf6e4;
          --nox-svc-card-hov:   #d6efcc;
          --nox-svc-border:     rgba(61,158,24,0.22);
          --nox-svc-border-hov: rgba(61,158,24,0.7);
          --nox-svc-body:       rgba(61,158,24,0.75);
          --nox-svc-body-hov:   rgba(61,158,24,1);
          --nox-btn-start-bg:   rgba(61,158,24,0.12);
          --nox-btn-start-hov:  #3d9e18;
          --nox-btn-start-c:    #3d9e18;
          --nox-btn-start-ch:   #ffffff;
        }

        /* Reset focused theme to Techolo canvas */
        html, body {
          background: var(--nox-ink) !important;
          color: #46ae22 !important;
          margin: 0 !important;
          padding: 0 !important;
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
      <FocusedLivingBackground />
      <NoxGrid />
      <div className="focused-theme-content">{children}</div>
    </>
  );
}
