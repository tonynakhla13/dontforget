"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import RequestForm from "@/components/RequestForm";

/* ─────────────────────────────────────────────────────────────────────────
   VOICE RECORDER  (compact inline layout)
───────────────────────────────────────────────────────────────────────── */
function VoiceRecorder({ onRecorded }: { onRecorded: (b: Blob | null) => void }) {
  const [state, setState] = useState<"idle" | "rec" | "done">("idle");
  const [secs, setSecs]   = useState(0);
  const [url, setUrl]     = useState<string | null>(null);
  const [err, setErr]     = useState(false);

  const mr   = useRef<MediaRecorder | null>(null);
  const buf  = useRef<Blob[]>([]);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (tick.current) clearInterval(tick.current); }, []);

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
      rec.start();
      setState("rec");
      setSecs(0);
      tick.current = setInterval(() => setSecs(s => s + 1), 1000);
    } catch { setErr(true); }
  }

  function stop() { mr.current?.stop(); if (tick.current) clearInterval(tick.current); }
  function discard() { setUrl(null); setSecs(0); setState("idle"); onRecorded(null); }

  const mono: React.CSSProperties = {
    fontFamily: "var(--font-mono-next)", fontSize: "0.42rem",
    letterSpacing: "0.36em", textTransform: "uppercase",
  };

  if (state === "idle") return (
    <div className="flex items-center gap-3">
      <button type="button" onClick={start}
        className="flex items-center gap-2.5 rounded-full px-4 py-2 transition-all duration-200 hover:scale-[1.03] shrink-0"
        style={{ border: "1px solid rgba(58,191,138,0.30)", background: "rgba(58,191,138,0.07)", color: "var(--teal)" }}>
        <svg width={13} height={13} viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="2" width="6" height="12" rx="3" />
          <path d="M5 10a7 7 0 0 0 14 0" /><line x1="12" y1="19" x2="12" y2="22" /><line x1="9" y1="22" x2="15" y2="22" />
        </svg>
        <span style={mono}>Record voice note</span>
      </button>
      {err && <span style={{ fontSize: "0.75rem", color: "#f87171" }}>Mic access denied</span>}
    </div>
  );

  if (state === "rec") return (
    <div className="flex items-center gap-4">
      <div className="flex items-end gap-[2px]" style={{ height: 18 }}>
        {[5,8,13,9,16,11,7,14,6,10,15,8,5].map((h, i) => (
          <div key={i} style={{ width: 2.5, borderRadius: 99, background: "var(--teal)", height: h,
            transformOrigin: "bottom",
            animation: `wvBar ${0.5+(i%5)*0.1}s ease-in-out infinite alternate`,
            animationDelay: `${i*0.06}s` }} />
        ))}
      </div>
      <style>{`@keyframes wvBar{from{transform:scaleY(0.2)}to{transform:scaleY(1)}}`}</style>
      <span style={{ ...mono, color: "var(--teal)" }}>{fmt(secs)}</span>
      <button type="button" onClick={stop}
        className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5"
        style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)", color: "#f87171" }}>
        <div style={{ width: 8, height: 8, borderRadius: 2, background: "#f87171" }} />
        <span style={mono}>Stop</span>
      </button>
    </div>
  );

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--teal)", boxShadow: "0 0 6px rgba(58,191,138,0.6)" }} />
        <span style={{ ...mono, color: "var(--teal)" }}>Voice attached</span>
      </div>
      {url && <audio src={url} controls style={{ height: 28, flex: 1, minWidth: 160, maxWidth: 240, accentColor: "var(--teal)" }} />}
      <button type="button" onClick={discard}
        style={{ ...mono, color: "var(--body)", opacity: 0.45 }}
        className="hover:opacity-70 transition-opacity">× discard</button>
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
    gsap.fromTo(panelRef.current, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35, ease: "power3.out" });
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function close() {
    gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.2, onComplete: onClose });
  }

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[200] flex flex-col"
      style={{ background: "rgba(0,0,0,0.90)", backdropFilter: "blur(14px)" }}>
      <div className="flex shrink-0 items-center justify-between border-b border-[var(--border)] px-8 py-4"
        style={{ background: "rgba(9,9,9,0.97)" }}>
        <div className="flex items-center gap-3">
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--teal)", boxShadow: "0 0 8px rgba(58,191,138,0.55)" }} />
          <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.44rem", letterSpacing: "0.44em",
            textTransform: "uppercase", color: "var(--teal)" }}>Step-by-step form</span>
        </div>
        <button onClick={close}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 hover:bg-white/[0.08]"
          style={{ color: "var(--body)", border: "1px solid var(--border)" }}>
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none"
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
   TALL SIDE BUTTON  (full column height)
───────────────────────────────────────────────────────────────────────── */
function TallButton({ onClick }: { onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    const el = ref.current; if (!el) return;
    el.addEventListener("mouseenter", () =>
      gsap.to(el, { borderColor: "rgba(58,191,138,0.65)", boxShadow: "0 0 32px rgba(58,191,138,0.10)", duration: 0.25 }));
    el.addEventListener("mouseleave", () =>
      gsap.to(el, { borderColor: "rgba(58,191,138,0.20)", boxShadow: "none", duration: 0.25 }));
  }, []);

  return (
    <button ref={ref} onClick={onClick}
      style={{
        width: 58, height: "100%",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between",
        padding: "1.5rem 0",
        borderRadius: "1.25rem",
        border: "1px solid rgba(58,191,138,0.20)",
        background: "linear-gradient(180deg,rgba(58,191,138,0.08) 0%,rgba(58,191,138,0.02) 100%)",
        cursor: "pointer",
        position: "relative", overflow: "hidden",
        transition: "border-color 0.25s, box-shadow 0.25s",
        flexShrink: 0,
      }}>

      {/* top accent */}
      <div style={{ position: "absolute", inset: "0 0 auto 0", height: 1,
        background: "linear-gradient(90deg,transparent,rgba(58,191,138,0.55),transparent)" }} />

      {/* pulsing dot */}
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--teal)",
        boxShadow: "0 0 8px rgba(58,191,138,0.5)", flexShrink: 0,
        animation: "dotPulse 2.8s ease-in-out infinite" }} />
      <style>{`@keyframes dotPulse{0%,100%{opacity:1}50%{opacity:0.25}}`}</style>

      {/* vertical label */}
      <span style={{
        fontFamily: "var(--font-mono-next)", fontSize: "0.40rem",
        letterSpacing: "0.40em", textTransform: "uppercase", color: "var(--teal)",
        writingMode: "vertical-rl", transform: "rotate(180deg)",
        flex: 1, display: "flex", alignItems: "center",
        paddingBlock: "1rem", lineHeight: 1,
      }}>
        Try step-by-step
      </span>

      {/* arrow */}
      <svg width={11} height={11} viewBox="0 0 24 24" fill="none"
        stroke="var(--teal)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
        style={{ flexShrink: 0, transform: "rotate(90deg)" }}>
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MAIN
───────────────────────────────────────────────────────────────────────── */
export default function ContactHub() {
  const [voice, setVoice]   = useState<Blob | null>(null);
  const [form, setForm]     = useState({ name: "", email: "", message: "" });
  const [sub, setSub]       = useState(false);
  const [done, setDone]     = useState(false);
  const [err, setErr]       = useState(false);
  const [modal, setModal]   = useState(false);
  const [taFocus, setTaF]   = useState(false);

  const rootRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const items = rootRef.current?.querySelectorAll("[data-in]");
    if (!items?.length) return;
    gsap.fromTo(items,
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, stagger: 0.07, duration: 0.65, ease: "power3.out", delay: 0.05 });
  }, { scope: rootRef });

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
    <section className="flex flex-col items-center justify-center gap-8 text-center px-6"
      style={{ height: "calc(100vh - 86px)" }}>
      <div style={{ width: 68, height: 68, borderRadius: "50%", border: "1.5px solid var(--teal)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 0 40px rgba(58,191,138,0.15)" }}>
        <svg width={26} height={26} viewBox="0 0 24 24" fill="none"
          stroke="var(--teal)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <div>
        <p className="eyebrow mb-3">Request received</p>
        <h1 className="hed" style={{ fontSize: "clamp(2.2rem,4vw,3.5rem)" }}>We&apos;ll be in touch.</h1>
        <p style={{ color: "var(--body)", fontSize: "0.875rem", marginTop: "0.6rem" }}>
          A real person replies within 24 hours.
        </p>
      </div>
      <a href="/" className="btn-glass-ghost">
        <span className="btn-glass-blob" aria-hidden="true" />
        <span className="btn-glass-face">← Back to home</span>
      </a>
    </section>
  );

  const labelStyle: React.CSSProperties = {
    display: "block", fontFamily: "var(--font-mono-next)",
    fontSize: "0.42rem", letterSpacing: "0.40em", textTransform: "uppercase",
    color: "var(--body)", opacity: 0.5, marginBottom: "0.45rem",
  };

  const inputStyle = (focused: boolean): React.CSSProperties => ({
    width: "100%", display: "block",
    padding: "0.7rem 0.9rem",
    borderRadius: "0.65rem",
    border: `1px solid ${focused ? "rgba(58,191,138,0.45)" : "var(--border)"}`,
    background: focused ? "rgba(58,191,138,0.03)" : "var(--surface)",
    color: "var(--fg)", outline: "none",
    fontSize: "0.875rem", fontFamily: "inherit",
    transition: "border-color 0.2s, background 0.2s",
  });

  return (
    <section ref={rootRef}
      style={{
        height: "calc(100vh - 86px)",
        display: "flex", alignItems: "stretch",
        padding: "clamp(1.25rem,3vh,2rem) clamp(1.25rem,4vw,3rem)",
        gap: "1rem",
        overflow: "hidden",
      }}>

      {/* ambient */}
      <div className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 50% 60% at 28% 50%, rgba(58,191,138,0.04) 0%, transparent 65%)" }} />

      {/* ══ LEFT: form ══ */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "0.9rem", zIndex: 1 }}>

        {/* Header */}
        <div data-in style={{ opacity: 0, flexShrink: 0 }}>
          <p className="eyebrow" style={{ marginBottom: "0.5rem" }}>Get in touch</p>
          <h1 className="hed" style={{
            fontSize: "clamp(2rem,4.5vw,4rem)", lineHeight: 0.92,
            letterSpacing: "-0.02em", marginBottom: "0.4rem",
          }}>
            What&apos;s on<br />
            <span style={{ color: "var(--teal)" }}>your mind?</span>
          </h1>
          <p style={{ fontSize: "0.8rem", lineHeight: 1.7, color: "var(--body)" }}>
            Write freely or drop a voice note — we read and listen to everything.
          </p>
        </div>

        {/* ── Message card (flex:1, fills remaining height) ── */}
        <form onSubmit={handleSubmit}
          style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>

          <div data-in style={{ opacity: 0, flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
            <div style={{
              flex: 1, minHeight: 0,
              display: "flex", flexDirection: "column",
              borderRadius: "1.1rem",
              border: `1px solid ${taFocus ? "rgba(58,191,138,0.45)" : "rgba(58,191,138,0.14)"}`,
              background: "rgba(9,9,9,0.55)",
              backdropFilter: "blur(10px)",
              overflow: "hidden",
              transition: "border-color 0.25s",
              boxShadow: taFocus ? "0 0 36px rgba(58,191,138,0.05)" : "none",
              position: "relative",
            }}>
              {/* top line */}
              <div style={{ position: "absolute", inset: "0 0 auto 0", height: 1,
                background: "linear-gradient(90deg,transparent,rgba(58,191,138,0.40),transparent)" }} />

              {/* Textarea — fills available space */}
              <textarea
                required
                placeholder="Describe your project, idea, or problem. The more detail you give us, the faster we can help…"
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                onFocus={() => setTaF(true)}
                onBlur={() => setTaF(false)}
                style={{
                  flex: 1, minHeight: 0, resize: "none",
                  background: "transparent", border: "none", outline: "none",
                  padding: "1.1rem 1.2rem 0.75rem",
                  color: "var(--fg)", fontSize: "0.875rem",
                  fontFamily: "inherit", lineHeight: 1.8,
                }}
              />

              {/* Divider + Voice inside card */}
              <div style={{ flexShrink: 0, borderTop: "1px solid rgba(255,255,255,0.05)", padding: "0.7rem 1.2rem" }}>
                <VoiceRecorder onRecorded={b => setVoice(b)} />
              </div>
            </div>
          </div>

          {/* Name + Email */}
          <div data-in className="grid gap-3 sm:grid-cols-2" style={{ opacity: 0, flexShrink: 0 }}>
            <NameEmailField label="Your name" type="text" placeholder="Tony Nakhla"
              value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))}
              autoComplete="name" labelStyle={labelStyle} inputStyle={inputStyle} />
            <NameEmailField label="Email address" type="email" placeholder="hello@you.com"
              value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))}
              autoComplete="email" labelStyle={labelStyle} inputStyle={inputStyle} />
          </div>

          {/* Submit */}
          <div data-in className="flex items-center gap-4" style={{ opacity: 0, flexShrink: 0 }}>
            <button type="submit"
              disabled={sub || !form.name || !form.email || !form.message}
              className="btn-glass disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ paddingInline: "2rem", paddingBlock: "0.75rem", fontSize: "0.8rem" }}>
              <span className="btn-glass-blob" aria-hidden="true" />
              <span className="btn-glass-face">{sub ? "Sending…" : voice ? "Send + voice →" : "Send message →"}</span>
            </button>
            {voice && (
              <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.40rem",
                letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--teal)", opacity: 0.7 }}>
                🎙 voice attached
              </span>
            )}
            {err && (
              <span style={{ fontSize: "0.75rem", color: "#f87171" }}>
                Error — email HELLO@NOXDEVS.COM
              </span>
            )}
          </div>

        </form>
      </div>

      {/* ══ RIGHT: tall button ══ */}
      <div data-in style={{ opacity: 0, flexShrink: 0, display: "flex", zIndex: 1 }}>
        <TallButton onClick={() => setModal(true)} />
      </div>

      {modal && <MultistepModal onClose={() => setModal(false)} />}
    </section>
  );
}

/* small helper to avoid inline state per field */
function NameEmailField({
  label, type, placeholder, value, onChange, autoComplete, labelStyle, inputStyle,
}: {
  label: string; type: string; placeholder: string; value: string;
  onChange: (v: string) => void; autoComplete: string;
  labelStyle: React.CSSProperties;
  inputStyle: (focused: boolean) => React.CSSProperties;
}) {
  const [f, setF] = useState(false);
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input type={type} placeholder={placeholder} required autoComplete={autoComplete}
        value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => setF(true)} onBlur={() => setF(false)}
        style={inputStyle(f)} />
    </div>
  );
}
