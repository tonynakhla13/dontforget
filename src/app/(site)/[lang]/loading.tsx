export default function Loading() {
  return (
    <main className="site-loading" aria-label="Loading">
      <div className="site-loading-brand">
        <span className="site-loading-mark" aria-hidden="true" />
        <span>DON&apos;T <strong>FORGET</strong></span>
      </div>
      <div className="site-loading-track" aria-hidden="true">
        <span />
      </div>
    </main>
  );
}
