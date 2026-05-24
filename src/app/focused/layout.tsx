import DoodleCanvas from "@/components/home/DoodleCanvas";

export default function FocusedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        :root {
          --bg:          #EBDECE;
          --surface:     #f5f5f5;
          --surface2:    #f0f0f0;
          --border:      rgba(0, 0, 0, 0.08);
          --fg:          #221F1A;
          --body:        #555555;
          --teal:        #14b8a6;
          --teal-faint:  rgba(20, 184, 166, 0.06);
          --teal-mid:    rgba(20, 184, 166, 0.22);
        }

        html { background: #EBDECE !important; }
        body { background: #EBDECE !important; color: #221F1A !important; }

        /* Focused theme typography overrides */
        .hed {
          color: var(--fg);
          font-weight: 900;
        }

        /* Hide ambient elements that don't fit minimal design */
        [class*="AmbientGlow"],
        [class*="ambient"],
        [class*="Particles"] {
          display: none !important;
        }

        /* Section styling */
        section {
          background: transparent;
        }

        /* Card styling */
        [data-card],
        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 2rem;
        }

        /* Button styling for focused theme */
        .btn-primary {
          background: var(--fg);
          color: var(--bg);
          border-color: var(--fg);
        }

        .btn-primary:hover {
          background: var(--teal);
          border-color: var(--teal);
          color: var(--bg);
        }

        .btn-outline {
          color: var(--fg);
          border-color: var(--fg);
        }

        .btn-outline:hover {
          background: var(--fg);
          color: var(--bg);
        }
      `}</style>
      {/* Outer wrapper gives position:absolute canvas a containing block */}
      <div style={{ position: "relative" }}>
        <DoodleCanvas />
        <div style={{ position: "relative", zIndex: 2 }}>
          {children}
        </div>
      </div>
    </>
  );
}
