"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ── design tokens ─────────────────────────────────────────────── */
export const C = {
  cream:  "#EBDECE",
  green:  "#324438",
  yellow: "#F4B905",
  orange: "#E35523",
  ink:    "#221F1A",
  white:  "#FFFFFF",
  ph:     "#CFCBC4",
} as const;

export const TEKO = "var(--font-teko), 'Teko', sans-serif";
export const MONO = "var(--font-source-code-pro), 'Source Code Pro', ui-monospace, monospace";

const NAV_LINKS = [
  { label: "Home",     href: "/" },
  { label: "About",    href: "/about" },
  { label: "Projects", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Blog",     href: "/blog" },
  { label: "Contact",  href: "/contact" },
];

/* ── reusable pill button ──────────────────────────────────────── */
export function PillOutline({
  children, href, style,
}: { children: React.ReactNode; href?: string; style?: React.CSSProperties }) {
  const base: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    padding: "10px 28px", border: `2px solid ${C.ink}`, borderRadius: 40,
    fontFamily: TEKO, fontWeight: 700, fontSize: 18, color: C.ink,
    background: "transparent", cursor: "pointer",
    transition: "background .2s, color .2s", textDecoration: "none", ...style,
  };
  const enter = (e: React.MouseEvent<HTMLElement>) => {
    (e.currentTarget as HTMLElement).style.background = C.ink;
    (e.currentTarget as HTMLElement).style.color = C.yellow;
  };
  const leave = (e: React.MouseEvent<HTMLElement>) => {
    (e.currentTarget as HTMLElement).style.background = "transparent";
    (e.currentTarget as HTMLElement).style.color = C.ink;
  };
  if (href) return <Link href={href} style={base} onMouseEnter={enter} onMouseLeave={leave}>{children}</Link>;
  return <button style={base} onMouseEnter={enter} onMouseLeave={leave}>{children}</button>;
}

/* ── footer ────────────────────────────────────────────────────── */
function FocusedFooter() {
  return (
    <footer style={{ padding: "0 clamp(1.5rem, 4vw, 3.75rem) clamp(3rem, 6vw, 6rem)" }}>
      {/* Row 1 */}
      <div style={{
        display: "grid", gridTemplateColumns: "1.8fr 1fr 1fr",
        gap: "clamp(1rem, 2vw, 2rem)", marginBottom: "clamp(1rem, 2vw, 2rem)",
      }}>
        <div className="kbm-footer-card" style={{
          backgroundColor: C.green, borderRadius: 40,
          padding: "clamp(2rem, 4vw, 4rem)", color: C.white,
          minHeight: "clamp(200px, 24vw, 380px)",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          <h2 style={{ fontFamily: TEKO, fontWeight: 500, fontSize: "clamp(1.5rem, 3.5vw, 3.5rem)", lineHeight: 1.2, color: C.white, maxWidth: 500 }}>
            Have a question, a project?<br />We&apos;d love to discuss
          </h2>
          <div>
            <a href="mailto:hello@dontforget.studio" style={{ display: "block", fontFamily: MONO, fontSize: "clamp(0.9rem, 1.5vw, 1.6rem)", color: C.white, lineHeight: 1.5 }}>
              hello@dontforget.studio
            </a>
            <a href="tel:+13125550173" style={{ display: "block", fontFamily: MONO, fontSize: "clamp(0.9rem, 1.5vw, 1.6rem)", color: C.white, lineHeight: 1.5 }}>
              +1 (312) 555-0173
            </a>
          </div>
        </div>

        <div className="kbm-footer-card" style={{ backgroundColor: C.yellow, borderRadius: 40, padding: "clamp(2rem, 3vw, 3rem)" }}>
          {NAV_LINKS.map(({ label, href }) => (
            <Link key={label} href={href} style={{
              display: "block", fontFamily: TEKO, fontWeight: 500,
              fontSize: "clamp(1rem, 1.8vw, 1.8rem)", lineHeight: 1.6,
              color: C.ink, textTransform: "capitalize",
            }}>{label}</Link>
          ))}
        </div>

        <div className="kbm-footer-card" style={{ backgroundColor: C.orange, borderRadius: 40, padding: "clamp(2rem, 3vw, 3rem)" }}>
          {["Style Guide", "Instructions", "Licenses", "Changelog", "Error 404"].map(l => (
            <a key={l} href="#" style={{
              display: "block", fontFamily: TEKO, fontWeight: 500,
              fontSize: "clamp(1rem, 1.8vw, 1.8rem)", lineHeight: 1.6,
              color: C.ink, textTransform: "capitalize",
            }}>{l}</a>
          ))}
        </div>
      </div>

      {/* Row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(1rem, 2vw, 2rem)" }}>
        <div className="kbm-footer-card" style={{
          backgroundColor: C.yellow, borderRadius: 40,
          padding: "clamp(2rem, 3vw, 3rem)", display: "flex",
          flexDirection: "column", justifyContent: "space-between",
          minHeight: "clamp(160px, 20vw, 340px)",
        }}>
          <div style={{ fontFamily: TEKO, fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 3rem)", color: C.green, textTransform: "uppercase" }}>
            DON&apos;T FORGET
          </div>
          <div style={{ fontFamily: MONO, fontSize: "clamp(0.75rem, 1vw, 1rem)", lineHeight: 1.4, color: C.ink }}>
            © 2026. All rights reserved. Designed by Experts
          </div>
        </div>

        <div className="kbm-footer-card" style={{
          backgroundColor: C.orange, borderRadius: 40,
          padding: "clamp(2rem, 3vw, 3rem)", display: "flex",
          flexDirection: "column", gap: "clamp(1.5rem, 2.5vw, 2.5rem)",
        }}>
          <h3 style={{ fontFamily: TEKO, fontWeight: 700, fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)", lineHeight: 1.1, color: C.white, textTransform: "uppercase" }}>
            Sign up now and stay inspired!
          </h3>
          <form onSubmit={e => { e.preventDefault(); (e.currentTarget.querySelector("button") as HTMLButtonElement).textContent = "THANKS!"; }} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input type="email" placeholder="EMAIL ADDRESS" required style={{
              height: 52, borderRadius: 40, border: `2px solid ${C.ink}`,
              background: "transparent", padding: "0 20px",
              fontFamily: TEKO, fontWeight: 700, fontSize: 18, color: C.ink, outline: "none",
            }} />
            <button type="submit" style={{
              height: 52, width: 160, borderRadius: 40, border: `2px solid ${C.ink}`,
              background: "transparent", fontFamily: TEKO, fontWeight: 700, fontSize: 18, color: C.ink, cursor: "pointer",
            }}>SUBMIT</button>
          </form>
        </div>

        <div className="kbm-footer-card" style={{
          backgroundColor: C.ink, borderRadius: 40,
          padding: "clamp(2rem, 3vw, 3rem)", display: "flex",
          flexDirection: "column", gap: 6,
        }}>
          <h3 style={{ fontFamily: TEKO, fontWeight: 700, fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)", color: C.white, marginBottom: 10 }}>
            We&apos;re here for you
          </h3>
          {["Chicago Studio — Don't Forget", "Chicago, IL 60601", "", "Mon – Fri: 9:30 – 18:00", "Sat: 9:30 – 13:00", "Sun: Closed"].map((row, i) =>
            row === "" ? <div key={i} style={{ height: 8 }} /> :
            <div key={i} style={{ fontFamily: MONO, fontSize: "clamp(0.7rem, 0.9vw, 0.95rem)", lineHeight: 1.5, color: C.white }}>{row}</div>
          )}
          <div style={{ display: "flex", gap: 20, marginTop: 16 }}>
            {[
              <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></>,
              <><path d="M22 5.8a8.6 8.6 0 0 1-2.4.7 4.2 4.2 0 0 0 1.8-2.3 8.3 8.3 0 0 1-2.6 1 4.2 4.2 0 0 0-7.1 3.8A11.9 11.9 0 0 1 3 4.7a4.2 4.2 0 0 0 1.3 5.6 4.1 4.1 0 0 1-1.9-.5v.1c0 2 1.4 3.7 3.4 4.1a4.3 4.3 0 0 1-1.9.1 4.2 4.2 0 0 0 3.9 2.9 8.4 8.4 0 0 1-6.2 1.7A11.9 11.9 0 0 0 8 20.4c7.7 0 11.9-6.4 11.9-11.9v-.5A8.5 8.5 0 0 0 22 5.8z" /></>,
              <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></>,
            ].map((icon, i) => (
              <a key={i} href="#" style={{ color: C.white, transition: "color .2s" }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = C.yellow)}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = C.white)}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill={i === 0 ? "none" : "currentColor"} stroke={i === 0 ? "currentColor" : undefined} strokeWidth={i === 0 ? 2 : undefined}>
                  {icon}
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── main layout ────────────────────────────────────────────────── */
interface FocusedLayoutProps {
  title: string;
  activeNav: string;
  children: React.ReactNode;
  animationClass?: string;
}

export default function FocusedLayout({ title, activeNav, children, animationClass = "kbm-content" }: FocusedLayoutProps) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".kbm-topbar-brand", { x: -40, opacity: 0, duration: 0.8, ease: "power3.out" });
      gsap.from(".kbm-topbar-nav a", { y: -20, opacity: 0, stagger: 0.07, duration: 0.6, ease: "power2.out", delay: 0.2 });
      gsap.from(".kbm-topbar-cta", { x: 40, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.3 });
      gsap.from(".kbm-page-title", { y: 60, opacity: 0, duration: 1, ease: "power4.out", delay: 0.1 });
      gsap.from(`.${animationClass}`, {
        y: 50, opacity: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: `.${animationClass}`, start: "top 85%" },
      });
      gsap.from(".kbm-footer-card", {
        y: 30, opacity: 0, stagger: 0.07, duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: "footer", start: "top 90%" },
      });
    }, rootRef);
    return () => ctx.revert();
  }, [animationClass]);

  return (
    <div ref={rootRef} style={{ backgroundColor: C.cream, color: C.ink, overflowX: "hidden" }}>
      {/* ── Topbar ─────────────────────────────────────────────── */}
      <header style={{
        padding: "clamp(1.5rem, 3vw, 3rem) clamp(1.5rem, 4vw, 3.75rem)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: "1rem",
      }}>
        <Link href="/" className="kbm-topbar-brand" style={{
          fontFamily: TEKO, fontWeight: 700,
          fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)",
          color: C.green, letterSpacing: "0.02em",
          textTransform: "uppercase", textDecoration: "none", flexShrink: 0,
        }}>DON&apos;T FORGET</Link>

        <nav className="kbm-topbar-nav" style={{ display: "flex", gap: "clamp(1rem, 3vw, 3.5rem)", flexWrap: "wrap", justifyContent: "center" }}>
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link key={label} href={href} style={{
                fontFamily: TEKO, fontWeight: 500,
                fontSize: "clamp(0.9rem, 1.3vw, 1.4rem)",
                color: isActive ? C.orange : C.ink,
                textTransform: "capitalize", letterSpacing: "0.04em",
                textDecoration: "none", position: "relative", padding: "6px 0",
                borderBottom: isActive ? `2px solid ${C.orange}` : "2px solid transparent",
                transition: "color .2s, border-color .2s",
              }}
                onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.color = C.orange; } }}
                onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.color = C.ink; } }}
              >{label}</Link>
            );
          })}
        </nav>

        <Link href="/contact" className="kbm-topbar-cta" style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          height: "clamp(36px, 3.5vw, 48px)", padding: "0 clamp(14px, 2vw, 28px)",
          border: `2px solid ${C.ink}`, borderRadius: 40,
          fontFamily: TEKO, fontWeight: 500, fontSize: "clamp(0.85rem, 1.2vw, 1.2rem)",
          color: C.ink, textDecoration: "none", flexShrink: 0,
          transition: "background .2s, color .2s",
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.ink; (e.currentTarget as HTMLElement).style.color = C.yellow; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = C.ink; }}
        >Get in Touch</Link>
      </header>

      {/* ── Page Title ─────────────────────────────────────────── */}
      <div style={{ textAlign: "center", padding: "clamp(1rem, 3vw, 2.5rem) clamp(1.5rem, 4vw, 3.75rem) clamp(2rem, 4vw, 4rem)" }}>
        <h1 className="kbm-page-title" style={{
          fontFamily: TEKO, fontWeight: 700,
          fontSize: "clamp(4rem, 12vw, 10rem)",
          lineHeight: 1, color: C.ink,
          letterSpacing: "-0.01em", textTransform: "capitalize",
        }}>{title}</h1>
      </div>

      {/* ── Content ────────────────────────────────────────────── */}
      {children}

      {/* ── Footer ─────────────────────────────────────────────── */}
      <FocusedFooter />
    </div>
  );
}
