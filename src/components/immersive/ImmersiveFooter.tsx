"use client";

/**
 * ImmersiveFooter — one layered, immersive band.
 *
 * The Three.js orb is no longer a tall hero column; it glows as a backdrop on
 * the right while the CTA overlays it. Everything else (nav, contact, socials,
 * legal) compresses into a single meta row + hairline, with a giant ghost
 * wordmark floating behind it all. One section, not four stacked bands.
 */

import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { pagePath, parseCanonicalPath } from "@/lib/site-routing";
import { useEffect, useRef } from "react";
import ImmersiveLogo from "@/components/immersive/ImmersiveLogo";

/* lazy-load the heavy Three.js canvas */
const FooterOrb = dynamic(() => import("./FooterOrb"), { ssr: false });

const SOCIALS = [
  { label: "Instagram", href: "#" },
  { label: "Behance",   href: "#" },
  { label: "LinkedIn",  href: "#" },
  { label: "X",         href: "#" },
];

const NAV = [
  { page: "work",     label: "Work" },
  { page: "services", label: "Services" },
  { page: "about",    label: "About" },
  { page: "blog",     label: "Blog" },
  { page: "contact",  label: "Contact" },
] as const;

/* fade/rise the whole band in on first view */
function useFadeIn(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          obs.disconnect();
        }
      },
      { threshold: 0.06 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
}

export default function ImmersiveFooter() {
  const pathname = usePathname();
  const route    = parseCanonicalPath(pathname);
  const hrefFor  = (page: typeof NAV[number]["page"]) =>
    route ? pagePath(route.locale, route.theme, page) : `/en/immersive/${page}`;

  const footerRef = useRef<HTMLElement>(null);
  useFadeIn(footerRef as React.RefObject<HTMLElement>);

  return (
    <footer ref={footerRef} className="nf">
      <style>{CSS}</style>

      {/* ── backdrop atmosphere ── */}
      <div aria-hidden className="nf-scan"><span /></div>
      <div aria-hidden className="nf-grid" />
      <div aria-hidden className="nf-glow" />
      <span aria-hidden className="hed nf-mark">NOX</span>

      {/* ── orb backdrop (right) ── */}
      <div aria-hidden className="nf-orb">
        <div className="nf-orb-glow" />
        <div className="nf-orb-float"><FooterOrb size={460} /></div>
      </div>

      <div className="nf-inner">
        {/* ── CTA ── */}
        <div className="nf-cta">
          <span className="nf-pill"><i />Available for selected work</span>
          <h2 className="hed nf-h">Make it hard<br /><span className="nf-h-accent">to forget.</span></h2>
          <div className="nf-cta-row">
            <a href="mailto:hello@noxstudio.dev" className="nf-email-lg">hello@noxstudio.dev</a>
            <Link href={hrefFor("contact")} className="btn-glass">
              <span className="btn-glass-blob" aria-hidden />
              <span className="btn-glass-face">Let&apos;s talk <span className="btn-glass-arrow">→</span></span>
            </Link>
          </div>
        </div>

        {/* ── meta row: brand · nav · socials ── */}
        <div className="nf-meta">
          <div className="nf-brand">
            <div className="nf-logo"><ImmersiveLogo /></div>
            <p className="nf-addr">Yabroud · Damascus Suburbs · Syria</p>
            <a href="tel:+963935154501" className="nf-phone">+963 935 154 501</a>
          </div>

          <div className="nf-col">
            <p className="nf-label">Navigate</p>
            <nav aria-label="Footer navigation" className="nf-links">
              {NAV.map(({ page, label }) => (
                <Link key={page} href={hrefFor(page)} className="nf-link">{label}</Link>
              ))}
            </nav>
          </div>

          <div className="nf-col">
            <p className="nf-label">Follow</p>
            <div className="nf-links">
              {SOCIALS.map(({ label, href }) => (
                <a key={label} href={href} className="nf-link nf-social">↗ {label}</a>
              ))}
            </div>
          </div>
        </div>

        {/* ── hairline ── */}
        <div className="nf-bottom">
          <span>© {new Date().getFullYear()} NOX Studio — All rights reserved.</span>
          <span className="nf-bottom-tag">Est. 2022 · Built with intent.</span>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   SCOPED STYLES
───────────────────────────────────────────────────────────────────────── */
const CSS = `
.nf { --g: 70,174,34; --gb: 70,209,42; position:relative; z-index:10; overflow:hidden;
  border-top:1px solid rgba(var(--g),0.18);
  background: linear-gradient(180deg, rgba(9,9,9,0) 0%, #090909 7%);
  opacity:0; transform:translateY(40px);
  transition: opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1); }

/* atmosphere */
.nf-scan { position:absolute; inset-inline:0; top:0; height:1px; overflow:hidden; pointer-events:none; z-index:3; }
.nf-scan span { position:absolute; inset:0;
  background: linear-gradient(90deg, transparent, rgba(var(--g),0.22) 20%, rgba(var(--g),0.65) 50%, rgba(var(--g),0.22) 80%, transparent);
  animation: nf-scan 3s ease-in-out infinite alternate; }
.nf-grid { position:absolute; inset:0; pointer-events:none; z-index:0; opacity:.5;
  background-image: linear-gradient(rgba(var(--g),0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(var(--g),0.024) 1px, transparent 1px);
  background-size: 72px 72px;
  -webkit-mask-image: radial-gradient(ellipse 90% 75% at 30% 40%, #000, transparent 85%);
  mask-image: radial-gradient(ellipse 90% 75% at 30% 40%, #000, transparent 85%); }
.nf-glow { position:absolute; left:-12%; top:8%; width:55vw; height:70%; pointer-events:none; z-index:0;
  background: radial-gradient(ellipse at 0% 50%, rgba(var(--g),0.08) 0%, transparent 64%); filter: blur(60px); }
.nf-mark { position:absolute; left:50%; bottom:-6%; transform:translateX(-50%); z-index:0;
  font-size:clamp(8rem,30vw,26rem); line-height:.74; letter-spacing:-0.06em; white-space:nowrap;
  color:transparent; -webkit-text-stroke:1px rgba(var(--g),0.05); text-stroke:1px rgba(var(--g),0.05);
  pointer-events:none; user-select:none; }

/* orb backdrop */
.nf-orb { position:absolute; top:50%; right:-7%; transform:translateY(-58%); z-index:1; pointer-events:none; }
.nf-orb-glow { position:absolute; inset:8%;
  background: radial-gradient(ellipse 75% 75% at 50% 50%, rgba(var(--g),0.13), transparent 70%); filter: blur(38px); }
.nf-orb-float { position:relative; animation: nf-float 6.5s ease-in-out infinite; }

/* layout */
.nf-inner { position:relative; z-index:2; max-width:1320px; margin:0 auto;
  padding: clamp(2.8rem,5.5vw,4.6rem) clamp(1.5rem,5vw,4rem) clamp(1.4rem,2.4vw,2rem); }

/* CTA */
.nf-cta { max-width:60ch; }
.nf-pill { display:inline-flex; align-items:center; gap:8px; margin-bottom:clamp(1.4rem,2.6vw,2.2rem);
  font-family:var(--font-mono-next); font-size:0.52rem; letter-spacing:0.44em; text-transform:uppercase;
  color:rgba(var(--g),0.78); }
.nf-pill i { width:7px; height:7px; border-radius:50%; background:rgb(var(--g));
  box-shadow:0 0 10px rgba(var(--g),0.8); animation: nf-blink 2.4s ease-in-out infinite; flex-shrink:0; }
.nf-h { font-size:clamp(2.7rem,7vw,6rem); line-height:0.88; letter-spacing:-0.045em; color:var(--fg);
  margin-bottom:clamp(1.5rem,3vw,2.4rem); }
.nf-h-accent { color:rgb(var(--g)); text-shadow:0 0 34px rgba(var(--g),0.4); }
.nf-cta-row { display:flex; align-items:center; gap:clamp(1.3rem,3vw,2.6rem); flex-wrap:wrap; }
.nf-email-lg { font-family:var(--font-mono-next); font-size:clamp(0.72rem,1.1vw,0.9rem); letter-spacing:0.05em;
  color:rgba(255,255,255,0.55); text-decoration:none; border-bottom:1px solid rgba(255,255,255,0.14);
  padding-bottom:2px; transition:color .2s ease, border-color .2s ease; }
.nf-email-lg:hover { color:rgb(var(--g)); border-color:rgba(var(--g),0.5); }

/* meta row */
.nf-meta { display:flex; flex-wrap:wrap; gap:clamp(1.8rem,4vw,3.5rem); justify-content:space-between;
  align-items:flex-start; margin-top:clamp(2.4rem,4.5vw,3.6rem);
  padding-top:clamp(1.6rem,2.6vw,2.2rem); border-top:1px solid rgba(255,255,255,0.07); }
.nf-brand { display:flex; flex-direction:column; gap:0.55rem; min-width:200px; }
.nf-logo { width:108px; }
.nf-addr { font-family:var(--font-mono-next); font-size:0.66rem; letter-spacing:0.04em;
  color:rgba(255,255,255,0.4); }
.nf-phone { font-family:var(--font-mono-next); font-size:0.74rem; letter-spacing:0.04em;
  color:rgba(255,255,255,0.45); text-decoration:none; transition:color .2s ease; }
.nf-phone:hover { color:rgb(var(--g)); }
.nf-col { display:flex; flex-direction:column; }
.nf-label { font-family:var(--font-mono-next); font-size:0.4rem; letter-spacing:0.46em; text-transform:uppercase;
  color:rgba(var(--g),0.55); margin-bottom:1rem; }
.nf-links { display:flex; flex-direction:column; gap:0.55rem; }
.nf-link { font-size:0.85rem; color:rgba(255,255,255,0.45); text-decoration:none; transition:color .2s ease; width:fit-content; }
.nf-link:hover { color:var(--fg); }

/* hairline */
.nf-bottom { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.6rem;
  margin-top:clamp(1.6rem,2.8vw,2.2rem); padding-top:clamp(1rem,1.6vw,1.2rem);
  border-top:1px solid rgba(255,255,255,0.05);
  font-family:var(--font-mono-next); text-transform:uppercase; }
.nf-bottom span { font-size:0.48rem; letter-spacing:0.28em; color:rgba(255,255,255,0.24); }
.nf-bottom-tag { color:rgba(255,255,255,0.18) !important; }

@keyframes nf-scan { from { transform:translateX(-60%); } to { transform:translateX(60%); } }
@keyframes nf-blink { 0%,100% { opacity:1; } 50% { opacity:0.25; } }
@keyframes nf-float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-12px); } }

@media (max-width:900px) {
  .nf-orb { top:auto; bottom:2%; right:50%; transform:translateX(50%); opacity:0.4; }
  .nf-h { font-size:clamp(2.6rem,11vw,4rem); }
}
@media (prefers-reduced-motion: reduce) {
  .nf-scan span, .nf-pill i, .nf-orb-float { animation:none !important; }
}
`;
