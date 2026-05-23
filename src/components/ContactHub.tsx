"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import RequestForm from "@/components/RequestForm";

/* ─────────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────────── */
const fmt = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

/* ─────────────────────────────────────────────────────────────────────────
   VOICE RECORDER
───────────────────────────────────────────────────────────────────────── */
function VoiceRecorder({ onRecorded }: { onRecorded: (b: Blob | null) => void }) {
  const [state, setState] = useState<"idle" | "rec" | "done">("idle");
  const [secs, setSecs]   = useState(0);
  const [url, setUrl]     = useState<string | null>(null);
  const [err, setErr]     = useState(false);

  const mr   = useRef<MediaRecorder | null>(null);
  const buf  = useRef<Blob[]>([]);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => () => { if (tick.current) clearInterval(tick.current); }, []);

  /* pulsing ring animation while recording */
  useEffect(() => {
    if (!ring.current) return;
    if (state === "rec") {
      gsap.to(ring.current, { scale: 1.55, opacity: 0, duration: 1.1, repeat: -1, ease: "power2.out" });
    } else {
      gsap.killTweensOf(ring.current);
      gsap.set(ring.current, { scale: 1, opacity: 0.4 });
    }
  }, [state]);

  async function start() {
    setErr(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      mr.current = rec;
      buf.current = [];
      rec.ondataavailable = e => { if (e.data.size > 0) buf.current.push(e.data); };
      rec.onstop = () => {
        const blob = new Blob(buf.current, { type: "audio/webm" });
        setUrl(URL.createObjectURL(blob));
        onRecorded(blob);
        stream.getTracks().forEach(t => t.stop());
        setState("done");
      };
      rec.start();
      setState("rec");
      setSecs(0);
      tick.current = setInterval(() => setSecs(s => s + 1), 1000);
    } catch { setErr(true); }
  }

  function stop() {
    mr.current?.stop();
    if (tick.current) clearInterval(tick.current);
  }

  function discard() {
    setUrl(null); setSecs(0); setState("idle"); onRecorded(null);
  }

  /* ── idle ── */
  if (state === "idle") return (
    <div className="flex flex-col items-center gap-3 py-2">
      <p style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.44rem", letterSpacing: "0.4em",
        textTransform: "uppercase", color: "var(--body)", opacity: 0.45 }}>
        or record a voice message
      </p>
      <button type="button" onClick={start}
        className="group relative flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300 hover:scale-105"
        style={{ background: "rgba(58,191,138,0.10)", border: "1.5px solid rgba(58,191,138,0.35)" }}>
        {/* ring */}
        <div ref={ring} className="absolute inset-0 rounded-full pointer-events-none"
          style={{ border: "1.5px solid rgba(58,191,138,0.45)", opacity: 0.4 }} />
        <svg width={22} height={22} viewBox="0 0 24 24" fill="none"
          stroke="var(--teal)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="2" width="6" height="12" rx="3" />
          <path d="M5 10a7 7 0 0 0 14 0" />
          <line x1="12" y1="19" x2="12" y2="22" />
          <line x1="9" y1="22" x2="15" y2="22" />
        </svg>
      </button>
      {err && <p style={{ fontSize: "0.75rem", color: "#f87171" }}>Microphone access denied</p>}
    </div>
  );

  /* ── recording ── */
  if (state === "rec") return (
    <div className="flex flex-col items-center gap-4 py-2">
      <p style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.44rem", letterSpacing: "0.4em",
        textTransform: "uppercase", color: "var(--teal)" }}>
        Recording — {fmt(secs)}
      </p>
      {/* Waveform bars */}
      <div className="flex items-end gap-[3px]" style={{ height: 28 }}>
        {[5,9,14,10,18,12,8,15,7,10,16,9,6,12,8].map((h, i) => (
          <div key={i} style={{ width: 3, borderRadius: 99, background: "var(--teal)",
            height: h, transformOrigin: "bottom",
            animation: `wvBar ${0.5 + (i % 5) * 0.1}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.06}s` }} />
        ))}
      </div>
      <style>{`@keyframes wvBar{from{transform:scaleY(0.2)}to{transform:scaleY(1)}}`}</style>
      <button type="button" onClick={stop}
        className="flex items-center gap-2 rounded-full px-5 py-2.5 transition-all duration-200 hover:scale-105"
        style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)", color: "#f87171" }}>
        <div style={{ width: 9, height: 9, borderRadius: 2, background: "#f87171" }} />
        <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.46rem", letterSpacing: "0.3em", textTransform: "uppercase" }}>
          Stop
        </span>
      </button>
    </div>
  );

  /* ── done ── */
  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <div className="flex items-center gap-2">
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--teal)",
          boxShadow: "0 0 8px rgba(58,191,138,0.6)" }} />
        <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.44rem", letterSpacing: "0.36em",
          textTransform: "uppercase", color: "var(--teal)" }}>Voice attached</span>
      </div>
      {url && <audio src={url} controls style={{ height: 34, width: "100%", maxWidth: 280, accentColor: "var(--teal)" }} />}
      <button type="button" onClick={discard}
        style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.44rem", letterSpacing: "0.28em",
          textTransform: "uppercase", color: "var(--body)", opacity: 0.45 }}
        className="hover:opacity-70 transition-opacity">
        × discard
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MULTISTEP MODAL
───────────────────────────────────────────────────────────────────────── */
function MultistepModal({ onClose }: { onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.22 });
    gsap.fromTo(panelRef.current,   { y: 48, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.38, ease: "power3.out" });
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function close() {
    gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.2, onComplete: onClose });
  }

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[200] flex flex-col"
      style={{ background: "rgba(0,0,0,0.90)", backdropFilter: "blur(14px)" }}>
      {/* Top bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-[var(--border)] px-8 py-5"
        style={{ background: "rgba(9,9,9,0.97)" }}>
        <div className="flex items-center gap-3">
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--teal)",
            boxShadow: "0 0 10px rgba(58,191,138,0.55)" }} />
          <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.46rem",
            letterSpacing: "0.46em", textTransform: "uppercase", color: "var(--teal)" }}>
            Step-by-step form
          </span>
        </div>
        <button onClick={close}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 hover:bg-white/[0.08]"
          style={{ color: "var(--body)", border: "1px solid var(--border)" }}>
          <svg width={13} height={13} viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div ref={panelRef} className="flex-1 overflow-y-auto">
        <RequestForm />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   TALL SIDE BUTTON
───────────────────────────────────────────────────────────────────────── */
function TallButton({ onClick }: { onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  useGSAP(() => {
    const el = ref.current; if (!el) return;
    el.addEventListener("mouseenter", () =>
      gsap.to(el, { borderColor: "rgba(58,191,138,0.65)", boxShadow: "0 0 28px rgba(58,191,138,0.12)", duration: 0.25 }));
    el.addEventListener("mouseleave", () =>
      gsap.to(el, { borderColor: "rgba(58,191,138,0.22)", boxShadow: "0 0 0px rgba(58,191,138,0)", duration: 0.25 }));
  }, []);

  return (
    <button ref={ref} onClick={onClick}
      className="relative flex flex-col items-center justify-between overflow-hidden rounded-[1.25rem] py-8 px-[18px]"
      style={{ width: 64, minHeight: "100%", flexShrink: 0, cursor: "pointer",
        border: "1px solid rgba(58,191,138,0.22)",
        background: "linear-gradient(180deg,rgba(58,191,138,0.07) 0%,rgba(58,191,138,0.02) 100%)",
        transition: "border-color 0.25s, box-shadow 0.25s" }}>

      {/* Top accent line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(58,191,138,0.6),transparent)" }} />

      {/* Dot */}
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--teal)",
        flexShrink: 0, boxShadow: "0 0 8px rgba(58,191,138,0.5)",
        animation: "dotPulse 2.8s ease-in-out infinite" }} />
      <style>{`@keyframes dotPulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>

      {/* Vertical label */}
      <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.42rem",
        letterSpacing: "0.38em", textTransform: "uppercase", color: "var(--teal)",
        writingMode: "vertical-rl", transform: "rotate(180deg)", flex: 1,
        display: "flex", alignItems: "center", paddingBlock: "1.5rem", lineHeight: 1 }}>
        Try step-by-step
      </span>

      {/* Arrow */}
      <svg width={12} height={12} viewBox="0 0 24 24" fill="none"
        stroke="var(--teal)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
        style={{ flexShrink: 0, transform: "rotate(90deg)" }}>
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   FIELD component (avoids inline style repetition)
───────────────────────────────────────────────────────────────────────── */
function Field({
  label, type = "text", placeholder, value, onChange, autoComplete,
}: {
  label: string; type?: string; placeholder: string;
  value: string; onChange: (v: string) => void; autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ display: "block", fontFamily: "var(--font-mono-next)",
        fontSize: "0.44rem", letterSpacing: "0.4em", textTransform: "uppercase",
        color: "var(--body)", opacity: 0.5, marginBottom: "0.55rem" }}>
        {label}
      </label>
      <input type={type} placeholder={placeholder} required
        autoComplete={autoComplete} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", display: "block",
          padding: "0.85rem 1rem",
          borderRadius: "0.75rem",
          border: `1px solid ${focused ? "rgba(58,191,138,0.45)" : "var(--border)"}`,
          background: focused ? "rgba(58,191,138,0.03)" : "var(--surface)",
          color: "var(--fg)", outline: "none",
          fontSize: "0.9rem", fontFamily: "inherit", lineHeight: 1.6,
          transition: "border-color 0.2s, background 0.2s",
        }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────── */
export default function ContactHub() {
  const [voice, setVoice]       = useState<Blob | null>(null);
  const [form, setForm]         = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmit] = useState(false);
  const [done, setDone]         = useState(false);
  const [err, setErr]           = useState(false);
  const [modal, setModal]       = useState(false);
  const [taFocused, setTaFocus] = useState(false);

  const rootRef = useRef<HTMLElement>(null);

  /* entrance */
  useGSAP(() => {
    const items = rootRef.current?.querySelectorAll("[data-in]");
    if (!items?.length) return;
    gsap.fromTo(items,
      { autoAlpha: 0, y: 28 },
      { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.7, ease: "power3.out", delay: 0.1 });
  }, { scope: rootRef });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmit(true); setErr(false);
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
      else { setErr(true); setSubmit(false); }
    } catch { setErr(true); setSubmit(false); }
  }

  /* ── Success ── */
  if (done) return (
    <section className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center gap-8 text-center px-6">
      <div style={{ width: 72, height: 72, borderRadius: "50%",
        border: "1.5px solid var(--teal)", display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 0 40px rgba(58,191,138,0.15)" }}>
        <svg width={28} height={28} viewBox="0 0 24 24" fill="none"
          stroke="var(--teal)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <div>
        <p className="eyebrow mb-3">Request received</p>
        <h1 className="hed" style={{ fontSize: "clamp(2.4rem,5vw,4rem)" }}>
          We&apos;ll be in touch.
        </h1>
        <p style={{ color: "var(--body)", fontSize: "0.9rem", marginTop: "0.75rem", lineHeight: 1.8 }}>
          A real person will reply within 24 hours.
        </p>
      </div>
      <a href="/" className="btn btn-outline">← Back to home</a>
    </section>
  );

  return (
    <section ref={rootRef}
      className="relative px-5 md:px-10"
      style={{ minHeight: "calc(100vh - 80px)", display: "flex", alignItems: "center" }}>

      {/* Background ambient */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: "radial-gradient(ellipse 55% 60% at 30% 50%, rgba(58,191,138,0.04) 0%, transparent 65%)" }} />

      <div style={{ width: "100%", maxWidth: 1120, margin: "0 auto", paddingBlock: "5rem" }}>
        <div className="flex gap-4 items-stretch">

          {/* ══════════════ LEFT ══════════════ */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Header */}
            <div data-in className="mb-10" style={{ opacity: 0 }}>
              <p className="eyebrow mb-5">Get in touch</p>
              <h1 className="hed" style={{
                fontSize: "clamp(2.8rem,6vw,5.5rem)", lineHeight: 0.9,
                letterSpacing: "-0.02em", marginBottom: "1.25rem" }}>
                What&apos;s on<br />
                <span style={{ color: "var(--teal)" }}>your mind?</span>
              </h1>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.9, color: "var(--body)", maxWidth: "40ch" }}>
                Write freely or drop a voice note — we read and listen to everything.
              </p>
            </div>

            <form onSubmit={submit}>

              {/* ── Main message card ── */}
              <div data-in style={{ opacity: 0, marginBottom: "1.25rem" }}>
                <div className="relative overflow-hidden rounded-[1.25rem]"
                  style={{
                    border: `1px solid ${taFocused ? "rgba(58,191,138,0.45)" : "rgba(58,191,138,0.15)"}`,
                    background: "rgba(9,9,9,0.60)",
                    backdropFilter: "blur(12px)",
                    transition: "border-color 0.3s",
                    boxShadow: taFocused ? "0 0 40px rgba(58,191,138,0.06)" : "none",
                  }}>

                  {/* Top gradient line */}
                  <div className="absolute inset-x-0 top-0 h-px pointer-events-none"
                    style={{ background: "linear-gradient(90deg,transparent,rgba(58,191,138,0.45),transparent)" }} />

                  {/* Textarea */}
                  <textarea
                    rows={9}
                    required
                    placeholder="Describe your project, idea, or problem in as much detail as you want. The more context you give us, the faster we can help…"
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    onFocus={() => setTaFocus(true)}
                    onBlur={() => setTaFocus(false)}
                    style={{
                      width: "100%", display: "block", resize: "none",
                      background: "transparent", border: "none", outline: "none",
                      padding: "1.5rem 1.5rem 1rem",
                      color: "var(--fg)", fontSize: "0.95rem",
                      fontFamily: "inherit", lineHeight: 1.85,
                    }}
                  />

                  {/* Divider */}
                  <div className="flex items-center gap-4 px-6 py-1">
                    <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                    <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.40rem",
                      letterSpacing: "0.44em", textTransform: "uppercase", color: "var(--body)", opacity: 0.35 }}>
                      or
                    </span>
                    <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                  </div>

                  {/* Voice recorder */}
                  <div className="px-6 pb-5 pt-2">
                    <VoiceRecorder onRecorded={b => setVoice(b)} />
                  </div>
                </div>
              </div>

              {/* ── Name + Email ── */}
              <div data-in className="grid gap-4 sm:grid-cols-2 mb-6" style={{ opacity: 0 }}>
                <Field label="Your name" placeholder="Tony Nakhla"
                  value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))}
                  autoComplete="name" />
                <Field label="Email address" type="email" placeholder="hello@you.com"
                  value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))}
                  autoComplete="email" />
              </div>

              {err && (
                <p data-in style={{ fontSize: "0.8rem", color: "#f87171", marginBottom: "1rem", opacity: 0 }}>
                  Something went wrong — email us at{" "}
                  <a href="mailto:hello@dontforget.studio" style={{ textDecoration: "underline" }}>
                    hello@dontforget.studio
                  </a>
                </p>
              )}

              {/* ── Submit row ── */}
              <div data-in className="flex items-center gap-5" style={{ opacity: 0 }}>
                <button type="submit" disabled={submitting || !form.name || !form.email || !form.message}
                  className="btn btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ paddingInline: "2.25rem", paddingBlock: "0.85rem", fontSize: "0.82rem" }}>
                  {submitting ? "Sending…" : voice ? "Send + voice note →" : "Send message →"}
                </button>
                {voice && (
                  <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.42rem",
                    letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--teal)", opacity: 0.75 }}>
                    🎙 voice attached
                  </span>
                )}
              </div>

            </form>
          </div>

          {/* ══════════════ RIGHT: tall button ══════════════ */}
          <div data-in className="hidden md:flex" style={{ opacity: 0, flexShrink: 0 }}>
            <TallButton onClick={() => setModal(true)} />
          </div>

        </div>

        {/* Mobile step-by-step link */}
        <div className="mt-8 flex justify-center md:hidden" data-in style={{ opacity: 0 }}>
          <button onClick={() => setModal(true)}
            className="flex items-center gap-2 rounded-full px-6 py-3 transition-all duration-200 hover:scale-[1.02]"
            style={{ border: "1px solid rgba(58,191,138,0.30)", background: "rgba(58,191,138,0.06)", color: "var(--teal)" }}>
            <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.46rem", letterSpacing: "0.36em", textTransform: "uppercase" }}>
              Try step-by-step form →
            </span>
          </button>
        </div>

      </div>

      {modal && <MultistepModal onClose={() => setModal(false)} />}
    </section>
  );
}
