"use client";

/**
 * ImmersiveContact
 *
 * Two-phase, single-viewport contact experience for the immersive mode.
 *
 * Phase 1 — message:
 *   · Big open textarea  (left)
 *   · Hero voice recorder  (right of textarea, equally prominent)
 *   · "Next →" button  — transitions to phase 2
 *
 * Phase 2 — details (GSAP slides in):
 *   · Name + email fields animate in
 *   · Button becomes "Send →"
 *
 * Side panel — creative tall button that opens a step-by-step modal
 *   · Modal is position:absolute within the section (stays in viewport)
 */

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import RequestForm from "@/components/RequestForm";

/* ─────────────────────────────────────────────────────────────────────────
   VOICE RECORDER — the visual hero of the form
───────────────────────────────────────────────────────────────────────── */
function VoiceHero({ onRecorded }: { onRecorded: (b: Blob | null) => void }) {
  const [state, setState] = useState<"idle" | "rec" | "done">("idle");
  const [secs, setSecs]   = useState(0);
  const [url, setUrl]     = useState<string | null>(null);
  const [err, setErr]     = useState(false);

  const mr   = useRef<MediaRecorder | null>(null);
  const buf  = useRef<Blob[]>([]);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);
  const ring1 = useRef<HTMLDivElement>(null);
  const ring2 = useRef<HTMLDivElement>(null);
  const ring3 = useRef<HTMLDivElement>(null);

  useEffect(() => () => { if (tick.current) clearInterval(tick.current); }, []);

  /* Pulse rings animation — idle = slow invite, recording = fast pulse */
  useEffect(() => {
    [ring1, ring2, ring3].forEach((r, i) => {
      if (!r.current) return;
      gsap.killTweensOf(r.current);
      if (state === "idle") {
        gsap.fromTo(r.current,
          { scale: 1, opacity: 0.35 },
          { scale: 1.9, opacity: 0, duration: 2.4, repeat: -1,
            ease: "power1.out", delay: i * 0.7 });
      } else if (state === "rec") {
        gsap.fromTo(r.current,
          { scale: 1, opacity: 0.55 },
          { scale: 2.4, opacity: 0, duration: 1.1, repeat: -1,
            ease: "power2.out", delay: i * 0.32 });
      } else {
        gsap.set(r.current, { scale: 1, opacity: 0 });
      }
    });
  }, [state]);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  async function start() {
    setErr(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      mr.current = rec; buf.current = [];
      rec.ondataavailable = e => { if (e.data.size > 0) buf.current.push(e.data); };
      rec.onstop = () => {
        const blob = new Blob(buf.current, { type: "audio/webm" });
        setUrl(URL.createObjectURL(blob));
        onRecorded(blob);
        stream.getTracks().forEach(t => t.stop());
        setState("done");
      };
      rec.start(); setState("rec"); setSecs(0);
      tick.current = setInterval(() => setSecs(s => s + 1), 1000);
    } catch { setErr(true); }
  }

  function stop() { mr.current?.stop(); if (tick.current) clearInterval(tick.current); }
  function discard() { setUrl(null); setSecs(0); setState("idle"); onRecorded(null); }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">

      {/* Label */}
      <p style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.44rem",
        letterSpacing: "0.44em", textTransform: "uppercase",
        color: state === "done" ? "var(--teal)" : "var(--body)", opacity: state === "idle" ? 0.5 : 1,
        textAlign: "center" }}>
        {state === "idle" && "Record your message"}
        {state === "rec"  && `Recording — ${fmt(secs)}`}
        {state === "done" && "Voice message ready"}
      </p>

      {/* Big mic button with pulse rings */}
      {state !== "done" && (
        <div className="relative flex items-center justify-center" style={{ width: 96, height: 96 }}>
          {/* Rings */}
          {[ring1, ring2, ring3].map((r, i) => (
            <div key={i} ref={r}
              style={{ position: "absolute", inset: 0, borderRadius: "50%",
                border: `1px solid rgba(58,191,138,${0.5 - i * 0.12})`,
                pointerEvents: "none" }} />
          ))}
          {/* Button */}
          <button type="button"
            onClick={state === "idle" ? start : stop}
            className="relative flex items-center justify-center rounded-full transition-all duration-300 hover:scale-105"
            style={{
              width: 80, height: 80,
              background: state === "rec"
                ? "rgba(239,68,68,0.18)"
                : "linear-gradient(145deg,rgba(58,191,138,0.22) 0%,rgba(58,191,138,0.08) 100%)",
              border: `1.5px solid ${state === "rec" ? "rgba(239,68,68,0.55)" : "rgba(58,191,138,0.55)"}`,
              boxShadow: state === "rec"
                ? "0 0 32px rgba(239,68,68,0.18), inset 0 0 20px rgba(239,68,68,0.05)"
                : "0 0 32px rgba(58,191,138,0.14), inset 0 0 20px rgba(58,191,138,0.06)",
            }}>
            {state === "idle" ? (
              <svg width={28} height={28} viewBox="0 0 24 24" fill="none"
                stroke="var(--teal)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="2" width="6" height="12" rx="3" />
                <path d="M5 10a7 7 0 0 0 14 0" />
                <line x1="12" y1="19" x2="12" y2="22" />
                <line x1="9" y1="22" x2="15" y2="22" />
              </svg>
            ) : (
              <div style={{ width: 18, height: 18, borderRadius: 4, background: "#f87171" }} />
            )}
          </button>
        </div>
      )}

      {/* Waveform while recording */}
      {state === "rec" && (
        <div className="flex items-end gap-[2.5px]" style={{ height: 22 }}>
          {[4,7,12,9,17,11,6,14,8,10,15,7,5,13,9].map((h, i) => (
            <div key={i} style={{ width: 2.5, borderRadius: 99,
              background: "rgba(239,68,68,0.8)", height: h,
              transformOrigin: "bottom",
              animation: `wv ${0.45+(i%5)*0.1}s ease-in-out infinite alternate`,
              animationDelay: `${i*0.055}s` }} />
          ))}
        </div>
      )}
      <style>{`@keyframes wv{from{transform:scaleY(0.2)}to{transform:scaleY(1)}}`}</style>

      {/* Done state */}
      {state === "done" && (
        <div className="flex flex-col items-center gap-3 w-full px-4">
          <div className="flex items-center gap-2">
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
              stroke="var(--teal)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.42rem",
              letterSpacing: "0.36em", textTransform: "uppercase", color: "var(--teal)" }}>
              Attached
            </span>
          </div>
          {url && <audio src={url} controls style={{ width: "100%", maxWidth: 200, height: 30, accentColor: "var(--teal)" }} />}
          <button type="button" onClick={discard}
            style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.40rem",
              letterSpacing: "0.28em", textTransform: "uppercase",
              color: "var(--body)", opacity: 0.4 }}
            className="hover:opacity-70 transition-opacity">
            × remove
          </button>
        </div>
      )}

      {err && <p style={{ fontSize: "0.75rem", color: "#f87171", textAlign: "center" }}>Mic access denied</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   CREATIVE SIDE BUTTON
───────────────────────────────────────────────────────────────────────── */
function CreativeSideButton({ onClick }: { onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const el = ref.current; if (!el) return;
    el.addEventListener("mouseenter", () => {
      gsap.to(el, { borderColor: "rgba(58,191,138,0.70)", duration: 0.25 });
      gsap.to(arrowRef.current, { y: 6, duration: 0.35, ease: "power2.out", repeat: -1, yoyo: true });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(el, { borderColor: "rgba(58,191,138,0.18)", duration: 0.25 });
      gsap.killTweensOf(arrowRef.current);
      gsap.to(arrowRef.current, { y: 0, duration: 0.2 });
    });
  }, []);

  return (
    <button ref={ref} onClick={onClick}
      style={{
        width: 68, height: "100%", flexShrink: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "space-between",
        padding: "1.25rem 0",
        borderRadius: "1.25rem",
        border: "1px solid rgba(58,191,138,0.18)",
        background: "linear-gradient(180deg,rgba(58,191,138,0.06) 0%,rgba(58,191,138,0.01) 60%,rgba(58,191,138,0.04) 100%)",
        cursor: "pointer", position: "relative", overflow: "hidden",
      }}>

      {/* Background diagonal lines */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.06,
        backgroundImage: "repeating-linear-gradient(135deg,var(--teal) 0px,var(--teal) 1px,transparent 1px,transparent 18px)" }} />

      {/* Top glow line */}
      <div style={{ position: "absolute", inset: "0 0 auto 0", height: 1,
        background: "linear-gradient(90deg,transparent,rgba(58,191,138,0.6),transparent)" }} />

      {/* Step counter badge */}
      <div style={{ position: "relative", zIndex: 1,
        width: 32, height: 32, borderRadius: "50%",
        border: "1px solid rgba(58,191,138,0.30)",
        background: "rgba(58,191,138,0.08)",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.42rem",
          letterSpacing: "0.1em", color: "var(--teal)", fontWeight: 700 }}>03</span>
      </div>

      {/* Vertical label */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", zIndex: 1 }}>
        <span style={{
          fontFamily: "var(--font-mono-next)", fontSize: "0.40rem",
          letterSpacing: "0.38em", textTransform: "uppercase", color: "var(--teal)",
          writingMode: "vertical-rl", transform: "rotate(180deg)", lineHeight: 1,
          paddingBlock: "0.75rem",
        }}>
          guided form
        </span>
      </div>

      {/* Animated arrow */}
      <svg ref={arrowRef} width={14} height={14} viewBox="0 0 24 24" fill="none"
        stroke="var(--teal)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
        style={{ position: "relative", zIndex: 1, flexShrink: 0, transform: "rotate(90deg)" }}>
        <path d="M12 5l7 7-7 7M5 12h14" />
      </svg>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   STEP-BY-STEP MODAL — absolute within the section (stays in viewport)
───────────────────────────────────────────────────────────────────────── */
function StepModal({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(ref.current,
      { x: "100%", autoAlpha: 0 },
      { x: "0%", autoAlpha: 1, duration: 0.45, ease: "power3.out" });
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function close() {
    gsap.to(ref.current, { x: "100%", autoAlpha: 0, duration: 0.35, ease: "power3.in", onComplete: onClose });
  }

  return (
    <div ref={ref}
      style={{
        position: "absolute", inset: 0, zIndex: 50,
        display: "flex", flexDirection: "column",
        background: "rgba(6,10,8,0.97)",
        backdropFilter: "blur(20px)",
      }}>
      {/* Header bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0.9rem 1.5rem", borderBottom: "1px solid var(--border)",
        flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {[1,2,3].map(n => (
            <div key={n} style={{ width: 6, height: 6, borderRadius: "50%",
              background: "var(--teal)", opacity: 0.3 + n * 0.2,
              boxShadow: "0 0 6px rgba(58,191,138,0.4)" }} />
          ))}
          <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.42rem",
            letterSpacing: "0.44em", textTransform: "uppercase", color: "var(--teal)",
            marginLeft: "0.25rem" }}>
            3-step form
          </span>
        </div>
        <button onClick={close}
          style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid var(--border)",
            background: "transparent", color: "var(--body)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center" }}
          className="hover:bg-white/[0.07] transition-colors">
          <svg width={11} height={11} viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      {/* Scrollable form content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <RequestForm />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────── */
export default function ImmersiveContact() {
  const [phase, setPhase]   = useState<1 | 2>(1);
  const [voice, setVoice]   = useState<Blob | null>(null);
  const [form, setForm]     = useState({ name: "", email: "", message: "" });
  const [sub, setSub]       = useState(false);
  const [done, setDone]     = useState(false);
  const [err, setErr]       = useState(false);
  const [modal, setModal]   = useState(false);

  const sectionRef  = useRef<HTMLElement>(null);
  const phase2Ref   = useRef<HTMLDivElement>(null);

  /* Entrance */
  useGSAP(() => {
    gsap.fromTo(
      sectionRef.current?.querySelectorAll("[data-in]") ?? [],
      { autoAlpha: 0, y: 22 },
      { autoAlpha: 1, y: 0, stagger: 0.09, duration: 0.7, ease: "power3.out", delay: 0.05 }
    );
  }, { scope: sectionRef });

  /* Phase 2 animation */
  function goPhase2() {
    setPhase(2);
    requestAnimationFrame(() => {
      if (!phase2Ref.current) return;
      gsap.fromTo(phase2Ref.current,
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out" });
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSub(true); setErr(false);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, email: form.email,
          projectType: "Open inquiry",
          message: form.message + (voice ? "\n\n[Voice message attached]" : ""),
        }),
      });
      if (res.ok) setDone(true);
      else { setErr(true); setSub(false); }
    } catch { setErr(true); setSub(false); }
  }

  /* ── Success ── */
  if (done) return (
    <section style={{ height: "calc(100vh - 86px)", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2rem" }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%",
        border: "1.5px solid var(--teal)", display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 0 48px rgba(58,191,138,0.18)" }}>
        <svg width={28} height={28} viewBox="0 0 24 24" fill="none"
          stroke="var(--teal)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <div style={{ textAlign: "center" }}>
        <p className="eyebrow" style={{ marginBottom: "0.5rem" }}>Received</p>
        <h1 className="hed" style={{ fontSize: "clamp(2rem,4vw,3.5rem)" }}>We&apos;ll be in touch.</h1>
        <p style={{ color: "var(--body)", fontSize: "0.875rem", marginTop: "0.5rem" }}>
          A real person replies within 24 hours.
        </p>
      </div>
      <a href="/immersive" className="btn btn-outline">← Back</a>
    </section>
  );

  return (
    <section ref={sectionRef}
      style={{
        height: "calc(100vh - 86px)",
        display: "flex", alignItems: "stretch",
        padding: "clamp(1rem,2.5vh,1.75rem) clamp(1rem,3vw,2.5rem)",
        gap: "0.875rem",
        position: "relative", overflow: "hidden",
      }}>

      {/* Ambient glow */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 55% 65% at 25% 50%, rgba(58,191,138,0.05) 0%, transparent 65%)" }} />

      {/* ══════════ LEFT: form ══════════ */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "0.75rem", zIndex: 1 }}>

        {/* Header */}
        <div data-in style={{ opacity: 0, flexShrink: 0 }}>
          <p className="eyebrow" style={{ marginBottom: "0.4rem" }}>Get in touch</p>
          <h1 className="hed" style={{ fontSize: "clamp(1.9rem,4vw,3.8rem)", lineHeight: 0.92,
            letterSpacing: "-0.02em" }}>
            What&apos;s on<br />
            <span style={{ color: "var(--teal)" }}>your mind?</span>
          </h1>
        </div>

        {/* ── Two-panel: textarea left + voice right ── */}
        <form onSubmit={handleSubmit}
          style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", gap: "0.7rem" }}>

          {/* Message + Voice panel */}
          <div data-in style={{ opacity: 0, flex: 1, minHeight: 0, display: "flex", gap: "0.75rem" }}>

            {/* Textarea card */}
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column",
              borderRadius: "1rem", overflow: "hidden",
              border: "1px solid rgba(58,191,138,0.14)",
              background: "rgba(9,9,9,0.55)", backdropFilter: "blur(10px)",
              position: "relative" }}>
              <div style={{ position: "absolute", inset: "0 0 auto 0", height: 1,
                background: "linear-gradient(90deg,transparent,rgba(58,191,138,0.35),transparent)" }} />
              <textarea
                required
                placeholder="Describe your project, idea, problem, or dream. No need to be formal — just tell us what's going on…"
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                style={{ flex: 1, resize: "none", background: "transparent",
                  border: "none", outline: "none",
                  padding: "1rem 1.1rem",
                  color: "var(--fg)", fontSize: "0.875rem",
                  fontFamily: "inherit", lineHeight: 1.8 }} />
            </div>

            {/* Voice hero panel */}
            <div style={{ width: "38%", minWidth: 160, flexShrink: 0,
              borderRadius: "1rem", overflow: "hidden",
              border: "1px solid rgba(58,191,138,0.14)",
              background: "linear-gradient(160deg,rgba(58,191,138,0.06) 0%,rgba(9,9,9,0.55) 60%)",
              backdropFilter: "blur(10px)",
              display: "flex", flexDirection: "column",
              position: "relative" }}>
              <div style={{ position: "absolute", inset: "0 0 auto 0", height: 1,
                background: "linear-gradient(90deg,transparent,rgba(58,191,138,0.40),transparent)" }} />
              <VoiceHero onRecorded={b => setVoice(b)} />
            </div>

          </div>

          {/* Phase 2: name + email (hidden until Next is clicked) */}
          {phase === 2 && (
            <div ref={phase2Ref} style={{ opacity: 0, flexShrink: 0,
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
              <DetailsField label="Your name" type="text" placeholder="Tony Nakhla"
                value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} autoComplete="name" />
              <DetailsField label="Email" type="email" placeholder="hello@you.com"
                value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} autoComplete="email" />
            </div>
          )}

          {/* CTA row */}
          <div data-in className="flex items-center gap-4" style={{ opacity: 0, flexShrink: 0 }}>
            {phase === 1 ? (
              <button type="button"
                onClick={() => { if (form.message.trim()) goPhase2(); }}
                disabled={!form.message.trim()}
                className="btn btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ paddingInline: "2rem", paddingBlock: "0.7rem", fontSize: "0.8rem" }}>
                Next →
              </button>
            ) : (
              <button type="submit"
                disabled={sub || !form.name || !form.email || !form.message}
                className="btn btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ paddingInline: "2rem", paddingBlock: "0.7rem", fontSize: "0.8rem" }}>
                {sub ? "Sending…" : voice ? "Send + voice →" : "Send →"}
              </button>
            )}

            {phase === 1 && (
              <p style={{ fontSize: "0.75rem", color: "var(--body)", opacity: 0.5 }}>
                Write your message or record above — then hit Next
              </p>
            )}

            {voice && phase === 2 && (
              <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.40rem",
                letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--teal)", opacity: 0.75 }}>
                🎙 voice attached
              </span>
            )}

            {err && (
              <span style={{ fontSize: "0.75rem", color: "#f87171" }}>
                Error — email hello@dontforget.studio
              </span>
            )}
          </div>

        </form>
      </div>

      {/* ══════════ RIGHT: creative button ══════════ */}
      <div data-in style={{ opacity: 0, flexShrink: 0, display: "flex", zIndex: 1 }}>
        <CreativeSideButton onClick={() => setModal(true)} />
      </div>

      {/* ══════════ MODAL — absolute within section ══════════ */}
      {modal && <StepModal onClose={() => setModal(false)} />}

    </section>
  );
}

/* Small input helper */
function DetailsField({ label, type, placeholder, value, onChange, autoComplete }: {
  label: string; type: string; placeholder: string;
  value: string; onChange: (v: string) => void; autoComplete: string;
}) {
  const [f, setF] = useState(false);
  return (
    <div>
      <label style={{ display: "block", fontFamily: "var(--font-mono-next)", fontSize: "0.40rem",
        letterSpacing: "0.40em", textTransform: "uppercase", color: "var(--body)",
        opacity: 0.5, marginBottom: "0.4rem" }}>{label}</label>
      <input type={type} placeholder={placeholder} required
        autoComplete={autoComplete} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setF(true)} onBlur={() => setF(false)}
        style={{
          width: "100%", padding: "0.65rem 0.85rem", borderRadius: "0.6rem",
          border: `1px solid ${f ? "rgba(58,191,138,0.45)" : "var(--border)"}`,
          background: f ? "rgba(58,191,138,0.04)" : "var(--surface)",
          color: "var(--fg)", outline: "none",
          fontSize: "0.875rem", fontFamily: "inherit",
          transition: "border-color 0.2s, background 0.2s",
        }} />
    </div>
  );
}
