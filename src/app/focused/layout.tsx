export default function FocusedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        :root {
          --bg:          #ffffff;
          --surface:     #f5f5f5;
          --surface2:    #f0f0f0;
          --border:      rgba(0, 0, 0, 0.08);
          --fg:          #000000;
          --body:        #555555;
          --teal:        #14b8a6;
          --teal-faint:  rgba(20, 184, 166, 0.06);
          --teal-mid:    rgba(20, 184, 166, 0.22);
        }

        html { background: var(--bg); }
        body { background: var(--bg); color: var(--body); }

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
          background: var(--bg);
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
      {children}
    </>
  );
}
