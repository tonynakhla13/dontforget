"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NoxNavbar, NoxFooter, NoxPageIntro, TK, SANS, DISPLAY } from "./NoxShared";

gsap.registerPlugin(ScrollTrigger);

export type ContactInfo = {
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  socialLinks?: Record<string, string> | null;
};

const inputBase: React.CSSProperties = {
  width:       "100%",
  background:  "transparent",
  border:      `1px solid rgba(70,174,34,0.4)`,
  padding:     "clamp(12px, 1.5vw, 18px) clamp(16px, 2vw, 24px)",
  fontFamily:  SANS,
  fontSize:    "clamp(0.88rem, 1.1vw, 1.05rem)",
  color:       TK.paper,
  outline:     "none",
  transition:  "border-color 150ms ease",
  boxSizing:   "border-box",
};

const WAYS = [
  { label: "email us",    value: "hello@noxstudio.co",   href: "mailto:hello@noxstudio.co" },
  { label: "call us",     value: "+1 (312) 555-0173",    href: "tel:+13125550173" },
  { label: "find us",     value: "Chicago, IL — Remote", href: null },
];

export default function ContactFocused({ contactInfo }: { contactInfo?: ContactInfo }) {
  const rootRef   = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const email = contactInfo?.email ?? "hello@noxstudio.co";

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".tk-contact-way", {
        y: 30, opacity: 0, stagger: 0.1, duration: 0.75, ease: "power3.out",
        scrollTrigger: { trigger: ".tk-contact-ways", start: "top 82%" },
      });
      gsap.from(".tk-contact-form", {
        y: 40, opacity: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: ".tk-contact-form", start: "top 80%" },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/inquiries", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          name:    fd.get("name"),
          email:   fd.get("email"),
          budget:  fd.get("budget"),
          message: fd.get("message"),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div ref={rootRef} style={{ background: TK.ink, color: TK.green, fontFamily: SANS }}>
      <NoxNavbar active="contact" />

      <NoxPageIntro
        eyebrow="/ contact"
        title="let's make"
        italic="something."
        lede="We work with founders, marketers, and brand teams. If you have a project that needs to be impossible to forget, we'd like to hear about it."
      />

      {/* ── Ways to reach us ── */}
      <section className="tk-contact-ways" style={{
        display:   "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        borderTop:    `1px solid ${TK.line}`,
        borderBottom: `1px solid ${TK.line}`,
      }}>
        {WAYS.map((w, i) => (
          <div key={i} className="tk-contact-way" style={{
            padding:     "clamp(2rem, 4vw, 4.5rem) clamp(1.5rem, 3vw, 3rem)",
            borderRight: i < 2 ? `1px solid ${TK.line}` : "none",
            display:     "flex",
            flexDirection: "column",
            gap:         12,
          }}>
            <span style={{
              fontFamily:    SANS,
              fontSize:      "clamp(0.65rem, 0.82vw, 0.82rem)",
              letterSpacing: "0.18em",
              color:         TK.green,
              textTransform: "uppercase",
              opacity:       0.65,
            }}>{w.label}</span>
            {w.href ? (
              <a href={w.href} style={{
                fontFamily:    DISPLAY,
                fontStyle:     "italic",
                fontWeight:    600,
                fontSize:      "clamp(1.4rem, 2.5vw, 2.5rem)",
                lineHeight:    1.1,
                color:         TK.paper,
                textDecoration:"none",
                transition:    "color 150ms ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = TK.green)}
              onMouseLeave={e => (e.currentTarget.style.color = TK.paper)}
              >{w.value}</a>
            ) : (
              <span style={{
                fontFamily: DISPLAY,
                fontStyle:  "italic",
                fontWeight: 600,
                fontSize:   "clamp(1.4rem, 2.5vw, 2.5rem)",
                lineHeight: 1.1,
                color:      TK.paper,
              }}>{w.value}</span>
            )}
          </div>
        ))}
      </section>

      {/* ── Contact form ── */}
      <section style={{
        padding: "clamp(4rem, 8vw, 9rem) clamp(1.5rem, 4vw, 3.5rem) clamp(6rem, 10vw, 11rem)",
      }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{
            fontFamily:    SANS,
            fontWeight:    700,
            fontSize:      "clamp(2rem, 5vw, 5rem)",
            lineHeight:    1,
            color:         TK.paper,
            textTransform: "uppercase",
            margin:        "0 0 clamp(3rem, 5vw, 5rem)",
          }}>tell us about your project</h2>

          {submitted ? (
            <div style={{
              padding:      "clamp(3rem, 6vw, 6rem)",
              border:       `1px solid ${TK.line}`,
              textAlign:    "center",
              display:      "flex",
              flexDirection:"column",
              alignItems:   "center",
              gap:          24,
            }}>
              <span style={{
                fontFamily: DISPLAY,
                fontStyle:  "italic",
                fontWeight: 600,
                fontSize:   "clamp(3rem, 7vw, 7rem)",
                lineHeight: 1,
                color:      TK.green,
              }}>✓</span>
              <p style={{ fontFamily: SANS, fontSize: "clamp(1rem, 1.6vw, 1.5rem)", color: TK.paper, margin: 0 }}>
                Message received. We&apos;ll be in touch within one business day.
              </p>
            </div>
          ) : (
            <form className="tk-contact-form" onSubmit={handleSubmit} style={{
              display:       "flex",
              flexDirection: "column",
              gap:           "clamp(1.5rem, 2.5vw, 2.5rem)",
            }}>
              {/* Name + Email row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(1rem, 2vw, 2rem)" }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <span style={{ fontFamily: SANS, fontSize: "clamp(0.7rem, 0.88vw, 0.88rem)", letterSpacing: "0.14em", color: TK.green, opacity: 0.75, textTransform: "uppercase" }}>Name</span>
                  <input
                    name="name"
                    type="text"
                    placeholder="Your name"
                    required
                    style={inputBase}
                    onFocus={e => (e.currentTarget.style.borderColor = TK.green)}
                    onBlur={e  => (e.currentTarget.style.borderColor = "rgba(70,174,34,0.4)")}
                  />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <span style={{ fontFamily: SANS, fontSize: "clamp(0.7rem, 0.88vw, 0.88rem)", letterSpacing: "0.14em", color: TK.green, opacity: 0.75, textTransform: "uppercase" }}>Email</span>
                  <input
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    required
                    style={inputBase}
                    onFocus={e => (e.currentTarget.style.borderColor = TK.green)}
                    onBlur={e  => (e.currentTarget.style.borderColor = "rgba(70,174,34,0.4)")}
                  />
                </label>
              </div>

              {/* Budget */}
              <label style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <span style={{ fontFamily: SANS, fontSize: "clamp(0.7rem, 0.88vw, 0.88rem)", letterSpacing: "0.14em", color: TK.green, opacity: 0.75, textTransform: "uppercase" }}>Budget range</span>
                <select
                  name="budget"
                  style={{ ...inputBase, cursor: "pointer", appearance: "none" }}
                  onFocus={e => (e.currentTarget.style.borderColor = TK.green)}
                  onBlur={e  => (e.currentTarget.style.borderColor = "rgba(70,174,34,0.4)")}
                >
                  <option value="" style={{ background: TK.ink }}>Select a range</option>
                  <option value="<5k"   style={{ background: TK.ink }}>Under $5k</option>
                  <option value="5-15k" style={{ background: TK.ink }}>$5k – $15k</option>
                  <option value="15-50k"style={{ background: TK.ink }}>$15k – $50k</option>
                  <option value="50k+"  style={{ background: TK.ink }}>$50k+</option>
                  <option value="tbd"   style={{ background: TK.ink }}>Let's talk</option>
                </select>
              </label>

              {/* Message */}
              <label style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <span style={{ fontFamily: SANS, fontSize: "clamp(0.7rem, 0.88vw, 0.88rem)", letterSpacing: "0.14em", color: TK.green, opacity: 0.75, textTransform: "uppercase" }}>Tell us about your project</span>
                <textarea
                  name="message"
                  placeholder="What are you building? What's broken? What needs to change?"
                  required
                  rows={7}
                  style={{ ...inputBase, resize: "vertical" }}
                  onFocus={e => (e.currentTarget.style.borderColor = TK.green)}
                  onBlur={e  => (e.currentTarget.style.borderColor = "rgba(70,174,34,0.4)")}
                />
              </label>

              {error && (
                <p style={{ fontFamily: SANS, fontSize: "clamp(0.8rem, 1vw, 0.95rem)", color: "#e55", margin: 0 }}>{error}</p>
              )}

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding:    "clamp(14px, 1.8vw, 20px) clamp(32px, 5vw, 56px)",
                    border:     `1px solid ${TK.green}`,
                    background: TK.green,
                    fontFamily: SANS,
                    fontWeight: 700,
                    fontSize:   "clamp(0.88rem, 1.1vw, 1.05rem)",
                    color:      TK.ink,
                    cursor:     loading ? "wait" : "pointer",
                    transition: "background 150ms ease, color 150ms ease",
                    opacity:    loading ? 0.6 : 1,
                    letterSpacing: "0.04em",
                  }}
                  onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = TK.green; } }}
                  onMouseLeave={e => { e.currentTarget.style.background = TK.green; e.currentTarget.style.color = TK.ink; }}
                >
                  {loading ? "Sending…" : "Send message →"}
                </button>
                <span style={{ fontFamily: SANS, fontSize: "clamp(0.75rem, 0.9vw, 0.88rem)", color: TK.green, opacity: 0.6 }}>
                  We respond within 24 hours.
                </span>
              </div>
            </form>
          )}
        </div>
      </section>

      <NoxFooter />
    </div>
  );
}
