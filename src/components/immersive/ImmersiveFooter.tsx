"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { pagePath, parseCanonicalPath, themeHome } from "@/lib/site-routing";
import { useEffect, useRef } from "react";

/* ── lazy-load the heavy Three.js canvas ── */
const FooterOrb = dynamic(() => import("./FooterOrb"), { ssr: false });

/* ── NOX data ── */
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

/* ── scan-line reveal on entry ── */
function useFadeIn(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity    = "1";
          el.style.transform  = "translateY(0)";
          obs.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
}

/* ── animated scan line ── */
function ScanLine() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden">
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(90deg, transparent 0%, rgba(70,174,34,0.22) 20%, rgba(70,174,34,0.65) 50%, rgba(70,174,34,0.22) 80%, transparent 100%)",
        animation: "nox-footer-scan 3s ease-in-out infinite alternate",
      }} />
    </div>
  );
}

export default function ImmersiveFooter() {
  const pathname = usePathname();
  const route    = parseCanonicalPath(pathname);
  const homeHref = route ? themeHome(route.locale, route.theme) : "/en/immersive";
  const hrefFor  = (page: typeof NAV[number]["page"]) =>
    route ? pagePath(route.locale, route.theme, page) : `/en/immersive/${page}`;

  const footerRef = useRef<HTMLElement>(null);
  useFadeIn(footerRef as React.RefObject<HTMLElement>);

  return (
    <>
      {/* keyframe injection */}
      <style>{`
        @keyframes nox-footer-scan {
          from { transform: translateX(-60%); }
          to   { transform: translateX(60%); }
        }
        @keyframes nox-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.2; }
        }
        @keyframes nox-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
      `}</style>

      <footer
        ref={footerRef}
        style={{
          position: "relative", zIndex: 10, overflow: "hidden",
          background: "linear-gradient(180deg, rgba(9,9,9,0) 0%, #090909 6%)",
          borderTop: "1px solid rgba(70,174,34,0.18)",
          opacity: 0, transform: "translateY(40px)",
          transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* scan line top */}
        <ScanLine />

        {/* grid overlay */}
        <div aria-hidden style={{
          pointerEvents: "none", position: "absolute", inset: 0,
          backgroundImage: `
            linear-gradient(rgba(70,174,34,0.028) 1px, transparent 1px),
            linear-gradient(90deg, rgba(70,174,34,0.022) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }} />

        {/* left ambient glow */}
        <div aria-hidden style={{
          pointerEvents: "none", position: "absolute",
          left: "-10%", top: "10%",
          width: "50vw", height: "60%",
          background: "radial-gradient(ellipse at 0% 50%, rgba(70,174,34,0.07) 0%, transparent 65%)",
          filter: "blur(60px)",
        }} />

        {/* ═══════════════════════════════════════════════════════════
            HERO BAND — orb LEFT · CTA RIGHT
        ═══════════════════════════════════════════════════════════ */}
        <div style={{
          maxWidth: 1440, margin: "0 auto",
          padding: "clamp(3rem,6vw,6rem) clamp(1.5rem,5vw,5rem) 0",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "minmax(280px, 420px) 1fr",
            gap: "clamp(2rem,4vw,4rem)",
            alignItems: "center",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            paddingBottom: "clamp(3rem,5vw,5rem)",
          }}>

            {/* ── ORB ── */}
            <div style={{
              display: "flex", justifyContent: "center", alignItems: "center",
              position: "relative",
            }}>
              {/* glow behind orb */}
              <div aria-hidden style={{
                position: "absolute", inset: 0,
                background: "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(70,174,34,0.12) 0%, transparent 70%)",
                filter: "blur(40px)",
              }} />
              <div style={{ animation: "nox-float 6s ease-in-out infinite" }}>
                <FooterOrb size={380} />
              </div>
            </div>

            {/* ── CTA ── */}
            <div style={{ paddingLeft: "clamp(0rem,2vw,2rem)" }}>
              {/* available pill */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                marginBottom: "clamp(1.8rem,3vw,2.8rem)",
              }}>
                <span style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: "rgba(70,174,34,1)",
                  boxShadow: "0 0 10px rgba(70,174,34,0.8)",
                  animation: "nox-blink 2.4s ease-in-out infinite",
                  flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: "var(--font-mono-next)",
                  fontSize: "0.52rem", letterSpacing: "0.44em",
                  textTransform: "uppercase", color: "rgba(70,174,34,0.75)",
                }}>
                  Available for selected work
                </span>
              </div>

              {/* big heading */}
              <h2 className="hed" style={{
                fontSize: "clamp(3.2rem,6.5vw,7rem)",
                lineHeight: 0.88, letterSpacing: "-0.045em",
                color: "var(--fg)",
                marginBottom: "clamp(2rem,3.5vw,3.5rem)",
              }}>
                Make it hard<br />
                <span style={{ color: "rgba(70,174,34,1)" }}>to forget.</span>
              </h2>

              {/* email + CTA row */}
              <div style={{ display: "flex", alignItems: "center", gap: "clamp(1.5rem,3vw,3rem)", flexWrap: "wrap" }}>
                <a
                  href="mailto:hello@noxstudio.dev"
                  style={{
                    fontFamily: "var(--font-mono-next)",
                    fontSize: "clamp(0.7rem,1.1vw,0.9rem)",
                    letterSpacing: "0.06em",
                    color: "rgba(255,255,255,0.55)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                    borderBottom: "1px solid rgba(255,255,255,0.12)",
                    paddingBottom: 2,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(70,174,34,1)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                >
                  hello@noxstudio.dev
                </a>

                <Link
                  href={hrefFor("contact")}
                  className="btn-glass"
                >
                  <span className="btn-glass-blob" aria-hidden />
                  <span className="btn-glass-face">
                    Let&apos;s talk <span className="btn-glass-arrow">→</span>
                  </span>
                </Link>
              </div>
            </div>

          </div>

          {/* ═══════════════════════════════════════════════════════════
              INFO BAND — studio · nav · contact · socials
          ═══════════════════════════════════════════════════════════ */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "clamp(1.5rem,3vw,3rem)",
            padding: "clamp(2.5rem,4.5vw,4.5rem) 0",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}>

            {/* Studio */}
            <div>
              <p style={{
                fontFamily: "var(--font-mono-next)",
                fontSize: "0.40rem", letterSpacing: "0.46em",
                textTransform: "uppercase", color: "rgba(70,174,34,0.55)",
                marginBottom: "1.25rem",
              }}>
                Studio
              </p>
              <p style={{ fontSize: "0.85rem", lineHeight: 1.85, color: "var(--body)", marginBottom: "0.4rem" }}>
                NOX Studio
              </p>
              <address style={{ fontStyle: "normal", fontSize: "0.80rem", lineHeight: 1.85, color: "rgba(255,255,255,0.38)" }}>
                Yabroud, Damascus Suburbs<br />Syria
              </address>
              <a
                href="tel:+963935154501"
                style={{
                  display: "block", marginTop: "0.6rem",
                  fontSize: "0.80rem", color: "rgba(255,255,255,0.38)",
                  textDecoration: "none", transition: "color 0.2s",
                  fontFamily: "var(--font-mono-next)", letterSpacing: "0.04em",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(70,174,34,0.9)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.38)")}
              >
                +963 935 154 501
              </a>
            </div>

            {/* Navigation */}
            <div>
              <p style={{
                fontFamily: "var(--font-mono-next)",
                fontSize: "0.40rem", letterSpacing: "0.46em",
                textTransform: "uppercase", color: "rgba(70,174,34,0.55)",
                marginBottom: "1.25rem",
              }}>
                Navigate
              </p>
              <nav aria-label="Footer navigation" style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {NAV.map(({ page, label }) => (
                  <Link
                    key={page}
                    href={hrefFor(page)}
                    style={{
                      fontSize: "0.85rem", color: "rgba(255,255,255,0.45)",
                      textDecoration: "none", transition: "color 0.2s",
                      display: "inline-flex", alignItems: "center", gap: 6,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--fg)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Contact */}
            <div>
              <p style={{
                fontFamily: "var(--font-mono-next)",
                fontSize: "0.40rem", letterSpacing: "0.46em",
                textTransform: "uppercase", color: "rgba(70,174,34,0.55)",
                marginBottom: "1.25rem",
              }}>
                Contact
              </p>
              <a
                href="mailto:hello@noxstudio.dev"
                style={{
                  display: "block", fontSize: "0.85rem",
                  color: "rgba(255,255,255,0.45)", textDecoration: "none",
                  transition: "color 0.2s", marginBottom: "0.5rem",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(70,174,34,0.9)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
              >
                hello@noxstudio.dev
              </a>
              <Link
                href={hrefFor("contact")}
                style={{
                  display: "inline-block", marginTop: "1.25rem",
                  fontFamily: "var(--font-mono-next)",
                  fontSize: "0.40rem", letterSpacing: "0.38em",
                  textTransform: "uppercase",
                  color: "rgba(70,174,34,0.7)",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(70,174,34,0.25)",
                  paddingBottom: 2, transition: "color 0.2s, border-color 0.2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = "rgba(70,174,34,1)";
                  e.currentTarget.style.borderColor = "rgba(70,174,34,0.65)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = "rgba(70,174,34,0.7)";
                  e.currentTarget.style.borderColor = "rgba(70,174,34,0.25)";
                }}
              >
                Start a project →
              </Link>
            </div>

            {/* Socials */}
            <div>
              <p style={{
                fontFamily: "var(--font-mono-next)",
                fontSize: "0.40rem", letterSpacing: "0.46em",
                textTransform: "uppercase", color: "rgba(70,174,34,0.55)",
                marginBottom: "1.25rem",
              }}>
                Follow
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {SOCIALS.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    style={{
                      fontSize: "0.85rem", color: "rgba(255,255,255,0.45)",
                      textDecoration: "none", transition: "color 0.2s",
                      display: "inline-flex", alignItems: "center", gap: 6,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--fg)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
                  >
                    ↗ {label}
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* ═══════════════════════════════════════════════════════════
              BOTTOM BAR — copyright · tagline
          ═══════════════════════════════════════════════════════════ */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: "1rem",
            padding: "clamp(1.5rem,2.5vw,2rem) 0",
          }}>
            <span style={{
              fontFamily: "var(--font-mono-next)",
              fontSize: "0.48rem", letterSpacing: "0.28em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.22)",
            }}>
              © {new Date().getFullYear()} NOX Studio. All rights reserved.
            </span>

            <span style={{
              fontFamily: "var(--font-mono-next)",
              fontSize: "0.44rem", letterSpacing: "0.28em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.18)",
            }}>
              Est. 2022 — Built with intent.
            </span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            BIG WORDMARK — decorative bottom strip
        ═══════════════════════════════════════════════════════════ */}
        <div
          aria-hidden
          style={{
            display: "flex", justifyContent: "center", alignItems: "center",
            padding: "0 clamp(1.5rem,4vw,4rem) clamp(0.5rem,1.5vw,1.5rem)",
            overflow: "hidden", userSelect: "none", pointerEvents: "none",
            borderTop: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <span
            className="hed"
            style={{
              fontSize: "clamp(4rem,13vw,16rem)",
              lineHeight: 0.80,
              letterSpacing: "-0.06em",
              color: "transparent",
              WebkitTextStroke: "1px rgba(70,174,34,0.12)",
              whiteSpace: "nowrap",
            }}
          >
            NOX STUDIO
          </span>
        </div>

      </footer>
    </>
  );
}
