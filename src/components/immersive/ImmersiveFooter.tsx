"use client";

/**
 * ImmersiveFooter — the studio's sign-off, built as a status console.
 *
 * Three bands stacked on one glass ground:
 *   1. status bar   — availability + the live Damascus wall clock
 *   2. direct line  — the email as a full-width departure-board row
 *   3. column grid  — brand / navigate / follow / studio, on real hairlines
 *
 * The band carries its own translucent ground so the fixed lava-lamp field
 * reads *through* the footer instead of *over* the type. Everything that used
 * to float (flex-wrapped columns, sub-legible micro-caps) now sits on a grid.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { pagePath, parseCanonicalPath } from "@/lib/site-routing";
import { useEffect, useRef, useState } from "react";
import ImmersiveLogo from "@/components/immersive/ImmersiveLogo";

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

/**
 * Wall clock for the studio, not the visitor — it answers "are they awake?"
 * for a client in another timezone. Renders a placeholder on the server so the
 * markup matches on hydrate, then fills in and re-reads every 20s.
 */
function useStudioTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Damascus",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const read = () => setTime(fmt.format(new Date()));
    read();
    const id = setInterval(read, 20_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/* Lenis owns the scroll on pages that mount SmoothScroll; fall back elsewhere. */
function scrollToTop() {
  if (window.__lenis) {
    window.__lenis.scrollTo(0, { duration: 1.4 });
    return;
  }
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
}

export default function ImmersiveFooter() {
  const pathname = usePathname();
  const route    = parseCanonicalPath(pathname);
  const hrefFor  = (page: typeof NAV[number]["page"]) =>
    route ? pagePath(route.locale, route.theme, page) : `/en/immersive/${page}`;

  const footerRef = useRef<HTMLElement>(null);
  useFadeIn(footerRef as React.RefObject<HTMLElement>);
  const studioTime = useStudioTime();

  return (
    <footer ref={footerRef} className="nf">
      <style>{CSS}</style>

      <div aria-hidden className="nf-grid" />

      <div className="nf-inner">
        {/* ── status bar ── */}
        <div className="nf-status">
          <span className="nf-avail"><i />Available for selected work</span>
          <span className="nf-clock">
            Yabroud
            <b aria-hidden>·</b>
            <time>{studioTime || "--:--"}</time>
            <em>UTC+3</em>
          </span>
        </div>

        {/* ── direct line — the email is the hero ── */}
        <div className="nf-cta">
          <p className="nf-label">Direct line</p>
          <a href="mailto:hello@noxdevs.com" className="nf-line">
            <span className="nf-line-text">HELLO@NOXDEVS.COM</span>
            <span aria-hidden className="nf-line-arrow">&#8594;</span>
          </a>
          <p className="nf-note">Replies within a day, usually the same one.</p>
        </div>

        {/* ── columns ── */}
        <div className="nf-cols">
          <div className="nf-col nf-col--brand">
            <div className="nf-logo"><ImmersiveLogo /></div>
            <p className="nf-blurb">
              An independent studio. We take on a few projects at a time.
            </p>
          </div>

          <div className="nf-col">
            <p className="nf-label">Navigate</p>
            <nav aria-label="Footer navigation" className="nf-list">
              {NAV.map(({ page, label }) => (
                <Link key={page} href={hrefFor(page)} className="nf-item">
                  <span>{label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="nf-col">
            <p className="nf-label">Follow</p>
            <div className="nf-list">
              {SOCIALS.map(({ label, href }) => (
                <a key={label} href={href} className="nf-item nf-item--ext">
                  <span>{label}</span>
                  <i aria-hidden>&#8599;</i>
                </a>
              ))}
            </div>
          </div>

          <div className="nf-col">
            <p className="nf-label">Studio</p>
            <address className="nf-addr">
              Yabroud<br />Damascus Suburbs<br />Syria
            </address>
            <a href="tel:+963935154501" className="nf-phone">+963 935 154 501</a>
          </div>
        </div>

        {/* ── hairline ── */}
        <div className="nf-foot">
          <span>&copy; {new Date().getFullYear()} NOX Studio<b aria-hidden>·</b>Est. 2022</span>
          <button type="button" className="nf-top" onClick={scrollToTop}>
            <i aria-hidden>&#8593;</i>Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   SCOPED STYLES
───────────────────────────────────────────────────────────────────────── */
const CSS = `
.nf { position:relative; z-index:10; overflow:hidden; isolation:isolate;
  /* own ground: the blob field reads THROUGH the footer, not over the type */
  background: linear-gradient(180deg,
    rgba(6,11,7,0.42) 0%, rgba(5,9,6,0.82) 46%, rgba(3,6,4,0.94) 100%);
  -webkit-backdrop-filter: blur(16px); backdrop-filter: blur(16px);
  opacity:0; transform:translateY(40px);
  transition: opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1); }

/* top rule — brightest where the content starts, not a flat 1px box border */
.nf::before { content:""; position:absolute; inset-inline:0; top:0; height:1px; z-index:4;
  background: linear-gradient(90deg,
    rgba(var(--teal-rgb),0.06), rgba(var(--teal-rgb),0.55) 22%,
    rgba(var(--teal-rgb),0.16) 62%, rgba(var(--teal-rgb),0.04)); }

.nf-grid { position:absolute; inset:0; pointer-events:none; z-index:0; opacity:.6;
  background-image: linear-gradient(rgba(var(--teal-rgb),0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(var(--teal-rgb),0.04) 1px, transparent 1px);
  background-size: 76px 76px;
  -webkit-mask-image: linear-gradient(180deg, #000, transparent 78%);
  mask-image: linear-gradient(180deg, #000, transparent 78%); }

/* Matches .immersive-mode .wrap exactly, so the footer's left and right edges
   line up with the navbar and every section above it. Do not add a max-width
   here — immersive .wrap has none, and one puts the footer out of alignment. */
.nf-inner { position:relative; z-index:2;
  width: calc(100% - var(--gutter) * 2); margin-inline:auto;
  padding: clamp(2.4rem,3.6vw,3.4rem) 0 clamp(1.6rem,2.2vw,2.1rem); }

/* ── status bar ── */
.nf-status { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between;
  gap:1rem 1.5rem; padding-bottom:clamp(1.6rem,2.6vw,2.2rem);
  border-bottom:1px solid rgba(var(--teal-rgb),0.13);
  font-family:var(--font-mono-next), monospace; font-size:0.6rem; letter-spacing:0.26em;
  text-transform:uppercase; }
.nf-avail { display:inline-flex; align-items:center; gap:0.65rem; color:rgba(var(--teal-rgb),0.92); }
.nf-avail i { width:6px; height:6px; border-radius:50%; background:var(--teal); flex-shrink:0;
  box-shadow:0 0 0 0 rgba(var(--teal-rgb),0.5); animation: nf-ping 3.2s ease-out infinite; }
.nf-clock { display:inline-flex; align-items:baseline; gap:0.55rem;
  color:rgba(var(--fg-rgb),0.42); }
.nf-clock b { color:rgba(var(--teal-rgb),0.5); font-weight:400; }
.nf-clock time { color:rgba(var(--fg-rgb),0.86); letter-spacing:0.14em;
  font-variant-numeric: tabular-nums; }
.nf-clock em { font-style:normal; color:rgba(var(--fg-rgb),0.3); letter-spacing:0.2em; }

/* ── shared label ── */
.nf-label { font-family:var(--font-mono-next), monospace; font-size:0.58rem; letter-spacing:0.3em;
  text-transform:uppercase; color:rgba(var(--teal-rgb),0.86); margin:0 0 1.1rem; }

/* ── direct line ── */
.nf-cta { padding:clamp(2.2rem,4vw,3.4rem) 0 clamp(2.2rem,4vw,3.2rem); }
/* width:fit-content keeps the rule and the arrow tight to the address instead
   of stranding the arrow at the far edge of a very wide footer */
.nf-line { position:relative; display:grid; grid-template-columns:auto auto;
  justify-content:start; align-items:baseline; width:fit-content; max-width:100%;
  gap:0.5em; padding-bottom:0.3em; text-decoration:none; color:var(--fg); }
.nf-line-text { font-family:var(--font-mono-next), monospace;
  font-size:clamp(1.25rem,5.4vw,3.9rem); line-height:1.02; letter-spacing:0.005em;
  overflow-wrap:anywhere;
  transition:color .35s ease, text-shadow .35s ease; }
.nf-line-arrow { font-family:var(--font-mono-next), monospace;
  font-size:clamp(1.15rem,2.7vw,2.1rem); line-height:1; color:rgba(var(--teal-rgb),0.75);
  transition:transform .45s cubic-bezier(.16,1,.3,1), color .35s ease; }
/* the rule under the line, and the green wipe that runs it on hover */
.nf-line::before, .nf-line::after { content:""; position:absolute; left:0; right:0; bottom:0; height:2px; }
.nf-line::before { background:rgba(var(--teal-rgb),0.26); }
.nf-line::after { background:linear-gradient(90deg, var(--teal), rgb(70,209,42));
  transform:scaleX(0); transform-origin:left center;
  transition:transform .6s cubic-bezier(.16,1,.3,1); }
.nf-line:hover .nf-line-text, .nf-line:focus-visible .nf-line-text {
  color:#fff; text-shadow:0 0 34px rgba(var(--teal-rgb),0.4); }
.nf-line:hover .nf-line-arrow, .nf-line:focus-visible .nf-line-arrow {
  transform:translateX(6px); color:var(--teal); }
.nf-line:hover::after, .nf-line:focus-visible::after { transform:scaleX(1); }
.nf-note { margin-top:1.1rem; font-size:0.86rem; letter-spacing:0.01em;
  color:rgba(var(--fg-rgb),0.42); }

/* ── columns ── */
.nf-cols { display:grid; grid-template-columns:1.15fr 0.8fr 0.8fr 0.95fr;
  border-top:1px solid rgba(var(--teal-rgb),0.13); }
.nf-col { padding:clamp(1.8rem,3vw,2.4rem) clamp(1.2rem,2.6vw,2.4rem);
  border-left:1px solid rgba(var(--teal-rgb),0.11); }
.nf-col:first-child { padding-left:0; border-left:0; }
.nf-col:last-child { padding-right:0; }

.nf-logo { width:104px; }
.nf-blurb { margin-top:1.2rem; max-width:28ch; font-size:0.86rem; line-height:1.75;
  color:rgba(var(--fg-rgb),0.4); }

.nf-list { display:flex; flex-direction:column; align-items:flex-start; gap:0.15rem; }
.nf-item { position:relative; display:inline-flex; align-items:baseline; gap:0.45rem;
  padding:0.3rem 0; text-decoration:none;
  font-family:var(--font-display-next), sans-serif; text-transform:uppercase;
  font-size:clamp(0.9rem,1.05vw,1.05rem); letter-spacing:0.055em;
  color:rgba(var(--fg-rgb),0.68); transition:color .24s ease; }
.nf-item span { position:relative; }
/* underline wipe, anchored to the word only */
.nf-item span::after { content:""; position:absolute; left:0; right:0; bottom:-3px; height:1px;
  background:var(--teal); transform:scaleX(0); transform-origin:left center;
  transition:transform .34s cubic-bezier(.16,1,.3,1); }
.nf-item:hover, .nf-item:focus-visible { color:var(--fg); }
.nf-item:hover span::after, .nf-item:focus-visible span::after { transform:scaleX(1); }
.nf-item--ext i { font-style:normal; font-size:0.7em; color:rgba(var(--teal-rgb),0.6);
  transition:transform .3s cubic-bezier(.16,1,.3,1), color .24s ease; display:inline-block; }
.nf-item--ext:hover i { transform:translate(2px,-2px); color:var(--teal); }

.nf-addr { font-style:normal; font-family:var(--font-mono-next), monospace;
  font-size:0.76rem; line-height:1.95; letter-spacing:0.03em; color:rgba(var(--fg-rgb),0.48); }
.nf-phone { display:inline-block; margin-top:0.9rem; font-family:var(--font-mono-next), monospace;
  font-size:0.78rem; letter-spacing:0.04em; color:rgba(var(--fg-rgb),0.6);
  text-decoration:none; border-bottom:1px solid rgba(var(--teal-rgb),0.25); padding-bottom:2px;
  transition:color .24s ease, border-color .24s ease; }
.nf-phone:hover { color:var(--teal); border-color:var(--teal); }

/* ── hairline ── */
.nf-foot { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap;
  gap:0.8rem 1.5rem; padding-top:clamp(1.4rem,2.4vw,1.9rem);
  border-top:1px solid rgba(var(--teal-rgb),0.13);
  font-family:var(--font-mono-next), monospace; font-size:0.58rem; letter-spacing:0.24em;
  text-transform:uppercase; color:rgba(var(--fg-rgb),0.32); }
.nf-foot b { display:inline-block; padding:0 0.7em; color:rgba(var(--teal-rgb),0.45); font-weight:400; }
.nf-top { display:inline-flex; align-items:center; gap:0.6rem; padding:0.35rem 0;
  background:none; border:0; cursor:pointer; font:inherit; letter-spacing:inherit;
  text-transform:inherit; color:rgba(var(--fg-rgb),0.32); transition:color .24s ease; }
.nf-top i { font-style:normal; transition:transform .34s cubic-bezier(.16,1,.3,1); }
.nf-top:hover { color:var(--teal); }
.nf-top:hover i { transform:translateY(-3px); }

/* focus — the theme's own ring, on every interactive element here */
.nf a:focus-visible, .nf button:focus-visible {
  outline:2px solid var(--teal); outline-offset:4px; border-radius:2px; }

@keyframes nf-ping {
  0%   { box-shadow:0 0 0 0 rgba(var(--teal-rgb),0.45); }
  70%  { box-shadow:0 0 0 9px rgba(var(--teal-rgb),0); }
  100% { box-shadow:0 0 0 0 rgba(var(--teal-rgb),0); }
}

/* ── responsive ── */
@media (max-width:1080px) {
  .nf-cols { grid-template-columns:1fr 1fr; }
  .nf-col { padding-left:clamp(1.2rem,3vw,2rem); padding-right:clamp(1.2rem,3vw,2rem); }
  .nf-col:nth-child(odd) { padding-left:0; border-left:0; }
  .nf-col:nth-child(even) { padding-right:0; }
  .nf-col:nth-child(n+3) { border-top:1px solid rgba(var(--teal-rgb),0.11); }
}
@media (max-width:620px) {
  .nf-cols { grid-template-columns:1fr; }
  .nf-col { padding:1.5rem 0; border-left:0; border-top:1px solid rgba(var(--teal-rgb),0.11); }
  .nf-col:first-child { border-top:0; padding-top:0; }
  .nf-status { font-size:0.55rem; letter-spacing:0.2em; }
  .nf-line { grid-template-columns:1fr; }
  .nf-line-arrow { display:none; }
}

@media (prefers-reduced-motion: reduce) {
  .nf { transition:none; }
  .nf-avail i { animation:none; }
  .nf-line::after, .nf-item span::after, .nf-line-arrow, .nf-item--ext i, .nf-top i {
    transition-duration:1ms; }
}
`;
