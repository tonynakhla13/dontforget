"use client";

/**
 * ContactHub
 *
 * Two-panel contact experience:
 *   LEFT  — open-ended form: big textarea + voice recording + name/email
 *   RIGHT — tall vertical pill button that opens the multistep RequestForm
 *           in a full-screen modal overlay
 */

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import RequestForm from "@/components/RequestForm";

/* ─── tiny helpers ─────────────────────────────────────────────────────── */
function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

/* ─── Mic waveform bars (animated while recording) ─────────────────────── */
function Waveform({ active }: { active: boolean }) {
  return (
    <div className="flex items-end gap-[3px]" style={{ height: 22 }}>
      {[4, 7, 12, 9, 16, 10, 7, 13, 6, 9, 14, 8, 5].map((h, i) => (
        <div
          key={i}
          style={{
            width: 3,
            borderRadius: 99,
            background: "var(--teal)",
            height: active ? undefined : h,
            minHeight: 3,
            animation: active ? `waveBar ${0.55 + (i % 4) * 0.12}s ease-in-out infinite alternate` : "none",
            animationDelay: `${i * 0.07}s`,
            ...(active ? { height: h } : {}),
          }}
        />
      ))}
      <style>{`
        @keyframes waveBar {
          from { transform: scaleY(0.25); }
          to   { transform: scaleY(1.6); }
        }
      `}</style>
    </div>
  );
}

/* ─── Mic icon ─────────────────────────────────────────────────────────── */
function MicIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="9" y1="22" x2="15" y2="22" />
    </svg>
  );
}

/* ─── Voice Recorder sub-component ─────────────────────────────────────── */
function VoiceRecorder({
  onRecorded,
}: {
  onRecorded: (blob: Blob | null) => void;
}) {
  const [state, setState]   = useState<"idle" | "recording" | "done">("idle");
  const [secs, setSecs]     = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError]   = useState<string | null>(null);

  const recRef    = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  async function startRecording() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mr = new MediaRecorder(stream);
      recRef.current = mr;
      chunksRef.current = [];

      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url  = URL.createObjectURL(blob);
        setAudioUrl(url);
        onRecorded(blob);
        stream.getTracks().forEach(t => t.stop());
        setState("done");
      };

      mr.start();
      setState("recording");
      setSecs(0);
      timerRef.current = setInterval(() => setSecs(s => s + 1), 1000);
    } catch {
      setError("Microphone access denied. Please allow microphone access and try again.");
    }
  }

  function stopRecording() {
    recRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function discard() {
    setAudioUrl(null);
    setSecs(0);
    setState("idle");
    onRecorded(null);
  }

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  return (
    <div>
      {/* Hint */}
      <div className="mb-3 flex items-center gap-2">
        <div style={{
          width: 6, height: 6, borderRadius: "50%",
          background: "var(--teal)",
          boxShadow: "0 0 8px rgba(58,191,138,0.6)",
          animation: state === "recording" ? "pulse 1s ease-in-out infinite" : "none",
        }} />
        <span style={{
          fontFamily: "var(--font-mono-next)", fontSize: "0.48rem",
          letterSpacing: "0.36em", textTransform: "uppercase",
          color: state === "recording" ? "var(--teal)" : "var(--body)", opacity: state === "idle" ? 0.55 : 1,
        }}>
          {state === "idle" && "Voice message available"}
          {state === "recording" && `Recording — ${fmtTime(secs)}`}
          {state === "done" && "Voice message attached"}
        </span>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>

      {state === "idle" && (
        <button
          type="button"
          onClick={startRecording}
          className="flex items-center gap-3 rounded-full px-5 py-3 transition-all duration-200 hover:scale-[1.03]"
          style={{
            border: "1px solid rgba(58,191,138,0.35)",
            background: "rgba(58,191,138,0.07)",
            color: "var(--teal)",
          }}
        >
          <MicIcon size={17} />
          <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.52rem", letterSpacing: "0.28em", textTransform: "uppercase" }}>
            Tap to record
          </span>
        </button>
      )}

      {state === "recording" && (
        <div className="flex items-center gap-4">
          <Waveform active />
          <button
            type="button"
            onClick={stopRecording}
            className="flex items-center gap-2.5 rounded-full px-5 py-3 transition-all duration-200"
            style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.40)", color: "#f87171" }}
          >
            <div style={{ width: 10, height: 10, borderRadius: 2, background: "#f87171" }} />
            <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.50rem", letterSpacing: "0.28em", textTransform: "uppercase" }}>
              Stop
            </span>
          </button>
        </div>
      )}

      {state === "done" && audioUrl && (
        <div className="flex flex-wrap items-center gap-3">
          <audio src={audioUrl} controls
            style={{ height: 36, borderRadius: 99, outline: "none", accentColor: "var(--teal)", flex: 1, minWidth: 180 }} />
          <button
            type="button"
            onClick={discard}
            style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.48rem", letterSpacing: "0.28em",
              textTransform: "uppercase", color: "var(--body)", opacity: 0.5 }}
            className="hover:opacity-80 transition-opacity"
          >
            × Discard
          </button>
        </div>
      )}

      {error && (
        <p style={{ fontSize: "0.78rem", color: "#f87171", marginTop: "0.5rem" }}>{error}</p>
      )}
    </div>
  );
}

/* ─── Multistep modal overlay ──────────────────────────────────────────── */
function MultistepModal({ onClose }: { onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate in
    gsap.fromTo(overlayRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: "none" });
    gsap.fromTo(panelRef.current, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35, ease: "power3.out" });
    // Prevent body scroll
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function handleClose() {
    gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.22, ease: "none", onComplete: onClose });
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex flex-col"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(12px)" }}
    >
      {/* Close bar */}
      <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4 shrink-0"
        style={{ background: "rgba(9,9,9,0.95)" }}>
        <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.48rem", letterSpacing: "0.44em",
          textTransform: "uppercase", color: "var(--teal)" }}>
          Multi-step form
        </span>
        <button
          onClick={handleClose}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/10"
          style={{ color: "var(--body)" }}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Scrollable RequestForm */}
      <div ref={panelRef} className="flex-1 overflow-y-auto">
        <RequestForm />
      </div>
    </div>
  );
}

/* ─── Tall side button ─────────────────────────────────────────────────── */
function TallButton({ onClick }: { onClick: () => void }) {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;
    el.addEventListener("mouseenter", () =>
      gsap.to(el, { scaleY: 1.03, duration: 0.22, ease: "power2.out" }));
    el.addEventListener("mouseleave", () =>
      gsap.to(el, { scaleY: 1, duration: 0.22, ease: "power2.in" }));
  }, []);

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      className="relative flex flex-col items-center justify-between overflow-hidden rounded-[1.5rem] px-4 py-8 transition-colors duration-200"
      style={{
        width: 72,
        minHeight: "100%",
        border: "1px solid rgba(58,191,138,0.35)",
        background: "linear-gradient(180deg,rgba(58,191,138,0.10) 0%,rgba(58,191,138,0.04) 100%)",
        cursor: "pointer",
        writingMode: "vertical-rl",
      }}
    >
      {/* Top glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(58,191,138,0.70),transparent)" }} />

      {/* Pulsing dot */}
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--teal)",
        boxShadow: "0 0 10px rgba(58,191,138,0.6)",
        animation: "pulse 2.5s ease-in-out infinite", marginBottom: 8 }} />

      <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.85)} }`}</style>

      {/* Vertical text */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{
          fontFamily: "var(--font-mono-next)", fontSize: "0.46rem",
          letterSpacing: "0.44em", textTransform: "uppercase",
          color: "var(--teal)", writingMode: "vertical-rl",
          textOrientation: "mixed", transform: "rotate(180deg)",
          lineHeight: 1.2,
        }}>
          Try our multistep form
        </span>
      </div>

      {/* Arrow at bottom */}
      <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
        style={{ color: "var(--teal)", marginTop: 8, transform: "rotate(90deg)" }}>
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </button>
  );
}

/* ─── Main ContactHub ──────────────────────────────────────────────────── */
export default function ContactHub() {
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const wrapRef  = useRef<HTMLDivElement>(null);
  const headRef  = useRef<HTMLDivElement>(null);
  const formRef  = useRef<HTMLFormElement>(null);
  const btnRef   = useRef<HTMLDivElement>(null);

  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(headRef.current, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0)
        .fromTo(formRef.current, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.18)
        .fromTo(btnRef.current,  { autoAlpha: 0, x: 24 }, { autoAlpha: 1, x: 0, duration: 0.6 }, 0.28);
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setSubmitting(true);
    setError(false);

    const note = [
      form.message,
      voiceBlob ? "[Voice message attached — see recording]" : "",
    ].filter(Boolean).join("\n\n");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          projectType: "Open inquiry",
          message: note,
        }),
      });
      if (res.ok) setDone(true);
      else { setError(true); setSubmitting(false); }
    } catch {
      setError(true);
      setSubmitting(false);
    }
  }

  const field = {
    width: "100%",
    borderRadius: "0.875rem",
    border: "1px solid var(--border)",
    background: "var(--surface2)",
    padding: "0.875rem 1.1rem",
    color: "var(--fg)",
    outline: "none",
    fontSize: "0.9rem",
    fontFamily: "inherit",
    lineHeight: 1.7,
    transition: "border-color 0.2s, background 0.2s",
  } as const;

  return (
    <div ref={wrapRef} className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center px-5 py-16"
      style={{ maxWidth: 1100, margin: "0 auto" }}>

      {/* ── Two-column: form left / tall button right ── */}
      <div className="flex gap-5 items-stretch">

        {/* ── LEFT: open form ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Header */}
          <div ref={headRef} style={{ opacity: 0 }} className="mb-10">
            <p className="eyebrow mb-4">Get in touch</p>
            <h1 className="hed" style={{ fontSize: "clamp(2.4rem,5.5vw,4.8rem)", lineHeight: 0.92, marginBottom: "1rem" }}>
              Tell us what<br />
              <span style={{ color: "var(--teal)" }}>you need.</span>
            </h1>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.85, color: "var(--body)", maxWidth: "42ch" }}>
              Describe your problem, idea, or project — in writing or with a voice message. We read every word.
            </p>
          </div>

          {done ? (
            /* ── Success ── */
            <div className="flex flex-col items-center justify-center text-center py-16 gap-6">
              <div style={{ width: 68, height: 68, borderRadius: "50%",
                border: "1.5px solid var(--teal)", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 32px rgba(58,191,138,0.18)" }}>
                <svg width={28} height={28} viewBox="0 0 24 24" fill="none"
                  stroke="var(--teal)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <div>
                <h2 className="hed" style={{ fontSize: "clamp(1.8rem,3vw,2.8rem)" }}>We got it.</h2>
                <p style={{ color: "var(--body)", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                  Expect a reply within 24 hours.
                </p>
              </div>
              <a href="/" className="btn btn-outline text-sm">← Back to home</a>
            </div>
          ) : (
            /* ── Form ── */
            <form ref={formRef} onSubmit={handleSubmit} style={{ opacity: 0 } as React.CSSProperties} className="flex flex-col gap-5">

              {/* Big message area */}
              <div>
                <label style={{ display: "block", fontFamily: "var(--font-mono-next)", fontSize: "0.46rem",
                  letterSpacing: "0.38em", textTransform: "uppercase", color: "var(--body)",
                  opacity: 0.6, marginBottom: "0.6rem" }}>
                  Your message
                </label>
                <textarea
                  rows={8}
                  placeholder="Describe your project, idea, pain point, or dream. The more you share, the better we can help…"
                  required
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  style={{ ...field, resize: "vertical" }}
                  onFocus={e => { e.target.style.borderColor = "rgba(58,191,138,0.55)"; e.target.style.background = "rgba(58,191,138,0.04)"; }}
                  onBlur={e  => { e.target.style.borderColor = "var(--border)";         e.target.style.background = "var(--surface2)"; }}
                />
              </div>

              {/* Voice recording */}
              <div style={{ paddingTop: "0.25rem" }}>
                <VoiceRecorder onRecorded={blob => setVoiceBlob(blob)} />
              </div>

              {/* Name + Email row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-mono-next)", fontSize: "0.46rem",
                    letterSpacing: "0.38em", textTransform: "uppercase", color: "var(--body)",
                    opacity: 0.6, marginBottom: "0.6rem" }}>
                    Your name
                  </label>
                  <input
                    type="text"
                    placeholder="Tony Nakhla"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    style={field}
                    onFocus={e => { e.target.style.borderColor = "rgba(58,191,138,0.55)"; e.target.style.background = "rgba(58,191,138,0.04)"; }}
                    onBlur={e  => { e.target.style.borderColor = "var(--border)";         e.target.style.background = "var(--surface2)"; }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-mono-next)", fontSize: "0.46rem",
                    letterSpacing: "0.38em", textTransform: "uppercase", color: "var(--body)",
                    opacity: 0.6, marginBottom: "0.6rem" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="hello@you.com"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    style={field}
                    onFocus={e => { e.target.style.borderColor = "rgba(58,191,138,0.55)"; e.target.style.background = "rgba(58,191,138,0.04)"; }}
                    onBlur={e  => { e.target.style.borderColor = "var(--border)";         e.target.style.background = "var(--surface2)"; }}
                  />
                </div>
              </div>

              {error && (
                <p style={{ fontSize: "0.78rem", color: "#f87171" }}>
                  Something went wrong. Try again or email us at hello@dontforget.studio
                </p>
              )}

              {/* Submit */}
              <div className="flex items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={submitting || !form.name || !form.email || !form.message}
                  className="btn btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ paddingLeft: "2rem", paddingRight: "2rem" }}
                >
                  {submitting ? "Sending…" : voiceBlob ? "Send message + voice →" : "Send message →"}
                </button>
                {voiceBlob && (
                  <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.44rem", letterSpacing: "0.3em",
                    textTransform: "uppercase", color: "var(--teal)", opacity: 0.7 }}>
                    🎙 Voice attached
                  </span>
                )}
              </div>

            </form>
          )}
        </div>

        {/* ── RIGHT: tall button ── */}
        <div ref={btnRef} style={{ opacity: 0, display: "flex", flexShrink: 0 }}>
          <TallButton onClick={() => setModalOpen(true)} />
        </div>

      </div>

      {/* ── Multistep modal ── */}
      {modalOpen && <MultistepModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
