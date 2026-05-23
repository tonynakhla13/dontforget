"use client";

import { useState } from "react";
import FocusedLayout, { C, TEKO, MONO } from "./FocusedLayout";

export type ContactInfo = {
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  socialLinks?: Record<string, string> | null;
};

const SOCIAL_ICONS: { key: string; label: string; svg: React.ReactNode }[] = [
  {
    key: "instagram",
    label: "Instagram",
    svg: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: "twitter",
    label: "Twitter",
    svg: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 5.8a8.6 8.6 0 0 1-2.4.7 4.2 4.2 0 0 0 1.8-2.3 8.3 8.3 0 0 1-2.6 1 4.2 4.2 0 0 0-7.1 3.8A11.9 11.9 0 0 1 3 4.7a4.2 4.2 0 0 0 1.3 5.6 4.1 4.1 0 0 1-1.9-.5v.1c0 2 1.4 3.7 3.4 4.1a4.3 4.3 0 0 1-1.9.1 4.2 4.2 0 0 0 3.9 2.9 8.4 8.4 0 0 1-6.2 1.7A11.9 11.9 0 0 0 8 20.4c7.7 0 11.9-6.4 11.9-11.9v-.5A8.5 8.5 0 0 0 22 5.8z" />
      </svg>
    ),
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    svg: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    key: "pinterest",
    label: "Pinterest",
    svg: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9.2-.8 1.3-5.4 1.3-5.4s-.3-.7-.3-1.7c0-1.6.9-2.7 2-2.7 1 0 1.5.7 1.5 1.6 0 1-.6 2.5-.9 3.9-.3 1.2.6 2.1 1.7 2.1 2.1 0 3.7-2.2 3.7-5.4 0-2.8-2-4.8-4.9-4.8a5.1 5.1 0 0 0-5.3 5.1c0 1 .4 2.1.9 2.7.1.1.1.2.1.3l-.3 1.3c-.1.2-.2.3-.4.2-1.5-.7-2.5-2.9-2.5-4.7 0-3.8 2.8-7.3 8-7.3 4.2 0 7.5 3 7.5 7 0 4.2-2.7 7.6-6.4 7.6-1.2 0-2.4-.7-2.8-1.4l-.8 2.9c-.3 1-1 2.4-1.5 3.2A10 10 0 1 0 12 2z" />
      </svg>
    ),
  },
];

export default function ContactFocused({ contactInfo }: { contactInfo?: ContactInfo }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const email   = contactInfo?.email   ?? "hello@dontforget.studio";
  const phone   = contactInfo?.phone   ?? "+1 (312) 555-0173";
  const socials = contactInfo?.socialLinks ?? {};

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: `2px solid ${C.ink}`,
    background: "transparent",
    borderRadius: 40,
    padding: "14px 22px",
    fontFamily: MONO,
    fontWeight: 500,
    fontSize: "clamp(0.82rem, 1vw, 1rem)",
    color: C.ink,
    outline: "none",
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:    fd.get("name"),
          email:   fd.get("email"),
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
    <FocusedLayout title="Contact Us" activeNav="contact" animationClass="kbm-contact-content">

      <section className="kbm-contact-content" style={{
        margin: "0 clamp(1.5rem, 4vw, 3.75rem) clamp(4rem, 8vw, 8rem)",
        display: "grid",
        gridTemplateColumns: "clamp(200px, 22vw, 380px) 1fr clamp(200px, 22vw, 380px)",
        gap: "clamp(1.5rem, 3vw, 4rem)",
        alignItems: "start",
      }}>

        {/* ── Left: info cards ─────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(1rem, 1.5vw, 1.5rem)" }}>
          {/* Email */}
          <div style={{
            backgroundColor: C.yellow, borderRadius: 40,
            padding: "clamp(1.5rem, 2.5vw, 2.5rem)",
            display: "flex", flexDirection: "column", gap: 10,
          }}>
            <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: "clamp(0.78rem, 1vw, 1rem)", color: C.ink }}>
              Email:
            </span>
            <a href={`mailto:${email}`} style={{
              fontFamily: MONO, fontWeight: 500,
              fontSize: "clamp(0.85rem, 1.2vw, 1.2rem)", color: C.ink,
              textDecoration: "none", wordBreak: "break-all",
            }}>
              {email}
            </a>
          </div>

          {/* Phone */}
          <div style={{
            backgroundColor: C.orange, borderRadius: 40,
            padding: "clamp(1.5rem, 2.5vw, 2.5rem)",
            display: "flex", flexDirection: "column", gap: 10,
          }}>
            <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: "clamp(0.78rem, 1vw, 1rem)", color: C.white }}>
              Phone:
            </span>
            <a href={`tel:${phone.replace(/\s|\(|\)|-/g, "")}`} style={{
              fontFamily: MONO, fontWeight: 500,
              fontSize: "clamp(0.85rem, 1.2vw, 1.2rem)", color: C.white,
              textDecoration: "none",
            }}>
              {phone}
            </a>
          </div>

          {/* Socials */}
          <div style={{
            backgroundColor: C.ink, borderRadius: 40,
            padding: "clamp(1.2rem, 2vw, 2rem) clamp(1.5rem, 2.5vw, 2.5rem)",
            display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center",
          }}>
            {SOCIAL_ICONS.map(({ key, label, svg }) => (
              <a key={label}
                href={socials[key] ?? "#"}
                aria-label={label}
                target={socials[key] ? "_blank" : undefined}
                rel="noopener noreferrer"
                style={{ color: C.white, transition: "color .2s" }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = C.yellow)}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = C.white)}
              >{svg}</a>
            ))}
          </div>
        </div>

        {/* ── Middle: contact form ──────────────────────────── */}
        {submitted ? (
          <div role="alert" style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", gap: 24, minHeight: 400,
            backgroundColor: C.green, borderRadius: 40,
            padding: "clamp(2rem, 4vw, 4rem)",
          }}>
            <div style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>✓</div>
            <h3 style={{ fontFamily: TEKO, fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: C.yellow, textAlign: "center" }}>
              Message sent!
            </h3>
            <p style={{ fontFamily: MONO, fontSize: "clamp(0.8rem, 1.1vw, 1rem)", color: C.cream, textAlign: "center", maxWidth: 320 }}>
              We&apos;ll get back to you within one business day.
            </p>
          </div>
        ) : (
          <form
            style={{ display: "flex", flexDirection: "column", gap: "clamp(1rem, 2vw, 1.5rem)" }}
            onSubmit={handleSubmit}
          >
            <label style={{ display: "flex", flexDirection: "column", gap: 8, fontFamily: MONO, fontWeight: 500, fontSize: "clamp(0.78rem, 1vw, 1rem)", color: C.ink }}>
              Name
              <input name="name" type="text" placeholder="Your full name" required style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = C.orange)}
                onBlur={e => (e.currentTarget.style.borderColor = C.ink)}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 8, fontFamily: MONO, fontWeight: 500, fontSize: "clamp(0.78rem, 1vw, 1rem)", color: C.ink }}>
              Email
              <input name="email" type="email" placeholder="you@example.com" required style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = C.orange)}
                onBlur={e => (e.currentTarget.style.borderColor = C.ink)}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 8, fontFamily: MONO, fontWeight: 500, fontSize: "clamp(0.78rem, 1vw, 1rem)", color: C.ink }}>
              Message
              <textarea name="message" placeholder="Tell us about your project…" required rows={6}
                style={{ ...inputStyle, borderRadius: 28, resize: "vertical" }}
                onFocus={e => (e.currentTarget.style.borderColor = C.orange)}
                onBlur={e => (e.currentTarget.style.borderColor = C.ink)}
              />
            </label>

            {error && (
              <p style={{ fontFamily: MONO, fontSize: "clamp(0.78rem, 1vw, 0.95rem)", color: C.orange, margin: 0 }}>
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} style={{
              alignSelf: "flex-start",
              padding: "clamp(12px, 1.5vw, 18px) clamp(28px, 4vw, 48px)",
              border: `2px solid ${C.ink}`, background: "transparent",
              borderRadius: 40, fontFamily: TEKO, fontWeight: 700,
              fontSize: "clamp(1rem, 1.5vw, 1.5rem)", color: C.ink,
              cursor: loading ? "wait" : "pointer",
              transition: "background .2s, color .2s",
              opacity: loading ? 0.6 : 1,
            }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = C.ink; e.currentTarget.style.color = C.yellow; } }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.ink; }}
            >
              {loading ? "Sending…" : "Submit"}
            </button>
          </form>
        )}

        {/* ── Right: map ────────────────────────────────────── */}
        <div style={{
          height: "clamp(300px, 40vw, 600px)",
          backgroundColor: C.ph, borderRadius: 40,
          overflow: "hidden", position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <iframe
            loading="lazy"
            allowFullScreen
            src="https://www.openstreetmap.org/export/embed.html?bbox=-87.65%2C41.87%2C-87.60%2C41.90&layer=mapnik&marker=41.885%2C-87.625"
            title="Map of Chicago, IL"
            style={{ width: "100%", height: "100%", border: 0, borderRadius: 40 }}
          />
        </div>

      </section>
    </FocusedLayout>
  );
}
