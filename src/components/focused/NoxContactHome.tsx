"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { TK, SANS, DISPLAY } from "./NoxShared";

/* ─── Data ──────────────────────────────────────────────────────────── */
const SERVICES = [
  { id: "webdev", n: "01", title: "Web Dev",    tag: "Pages, apps & dashboards",          examples: ["Landing pages", "Commercial sites", "Blogs", "Portfolios", "Dashboards", "Web apps"] },
  { id: "uiux",   n: "02", title: "UI / UX",    tag: "Design systems, flows & prototypes", examples: ["Wireframes", "Design systems", "User flows", "Prototypes", "Usability tests", "Product UX"] },
  { id: "ecomm",  n: "03", title: "E-Commerce", tag: "Shopify, WooCommerce & custom",      examples: ["Shopify", "WooCommerce", "Salla", "Product pages", "Checkout", "Subscriptions"] },
  { id: "mobile", n: "04", title: "Mobile",     tag: "iOS, Android & React Native",        examples: ["iOS", "Android", "React Native", "Onboarding", "Push flows", "App systems"] },
  { id: "seo",    n: "05", title: "SEO",         tag: "Technical, AI search & content",    examples: ["Technical SEO", "Content plans", "AI search", "Local SEO", "Audits", "Reporting"] },
  { id: "crm",    n: "06", title: "CRM",         tag: "Bookings, pipelines & automations", examples: ["Bookings", "Pipelines", "Dashboards", "Automations", "Permissions", "Integrations"] },
];
const TIMELINES = ["ASAP", "1–3 months", "3–6 months", "Flexible"];
const BUDGETS   = ["< $5k", "$5–15k", "$15–50k", "$50k+"];
const PROMPTS   = [
  "I need a stronger website and better leads.",
  "We're launching and need a page, visuals, and strategy.",
  "Our brand feels unclear and needs a sharper digital presence.",
];

type ContactMethod = "whatsapp" | "phone" | "email";
type CD = { name: string; method: ContactMethod; value: string };
type VoiceClip = { id: string; blob: Blob; url: string; duration: number };
type GuidedData = { serviceIds: string[]; subServices: string[]; timeline: string; budget: string };

const METHOD_LABELS: Record<ContactMethod, string> = { whatsapp: "WhatsApp", phone: "Phone", email: "Email" };

/* ─── Upload helper ─────────────────────────────────────────────────── */
async function uploadVoice(blob: Blob, i: number): Promise<string | null> {
  const fd = new FormData();
  fd.append("file", blob, `voice-note-${i + 1}.webm`);
  try {
    const res = await fetch("/api/inquiries/audio", { method: "POST", body: fd });
    if (!res.ok) return null;
    const d = await res.json() as { url?: string };
    return d.url ?? null;
  } catch { return null; }
}

async function uploadInquiryFile(file: File) {
  const fd = new FormData();
  fd.append("file", file, file.name);
  try {
    const res = await fetch("/api/inquiries/files", { method: "POST", body: fd });
    if (!res.ok) return null;
    const data = await res.json() as { name?: string; url?: string };
    return data.name && data.url ? { name: data.name, url: data.url } : null;
  } catch { return null; }
}

/* ─── Chip ──────────────────────────────────────────────────────────── */
function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{
      padding:    "0.45rem 0.9rem",
      border:     `1px solid ${active ? TK.green : TK.line}`,
      background: active ? TK.green : "transparent",
      color:      active ? TK.ink   : TK.green,
      fontFamily: SANS,
      fontSize:   "clamp(0.72rem, 0.88vw, 0.88rem)",
      cursor:     "pointer",
      transition: "all 160ms ease",
    }}>{label}</button>
  );
}

/* ─── Label ─────────────────────────────────────────────────────────── */
function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label style={{
      display:       "block",
      fontFamily:    SANS,
      fontSize:      "clamp(0.6rem, 0.75vw, 0.75rem)",
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      color:         TK.green,
      opacity:       0.55,
      marginBottom:  "0.55rem",
    }}>{children}</label>
  );
}

/* ─── Input field ───────────────────────────────────────────────────── */
function Field({ label, value, onChange, type = "text", placeholder, autoComplete }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder: string; autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);
  const id = `nox-field-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <style>{`#${id}::placeholder{color:rgba(70,174,34,0.38)}`}</style>
      <input
        id={id}
        type={type} value={value} placeholder={placeholder}
        autoComplete={autoComplete} required
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width:        "100%",
          background:   focused ? "var(--nox-field-bg-focus)" : "var(--nox-field-bg)",
          border:       `1px solid ${focused ? TK.green : TK.line}`,
          outline:      "none",
          padding:      "0.75rem 0.9rem",
          fontFamily:   SANS,
          fontSize:     "clamp(0.88rem, 1.1vw, 1.05rem)",
          color:        TK.paper,
          transition:   "border-color 180ms ease, background 180ms ease",
          boxSizing:    "border-box",
        }}
      />
    </div>
  );
}

/* ─── Contact method toggle ─────────────────────────────────────────── */
/* ─── Voice Recorder ────────────────────────────────────────────────── */
function NoxVoice({
  onRecorded,
  onRecordingChange,
}: {
  onRecorded: (blobs: Blob[]) => void;
  onRecordingChange?: (r: boolean) => void;
}) {
  const [state, setState] = useState<"idle" | "rec">("idle");
  const [secs, setSecs]   = useState(0);
  const [clips, setClips] = useState<VoiceClip[]>([]);
  const [err, setErr]     = useState(false);
  const mr       = useRef<MediaRecorder | null>(null);
  const buf      = useRef<Blob[]>([]);
  const ticker   = useRef<ReturnType<typeof setInterval> | null>(null);
  const secsRef  = useRef(0);
  const clipsRef = useRef<VoiceClip[]>([]);
  const r1 = useRef<HTMLDivElement>(null);
  const r2 = useRef<HTMLDivElement>(null);
  const r3 = useRef<HTMLDivElement>(null);
  const MAX = 3;
  const canRec = clips.length < MAX && state !== "rec";

  useEffect(() => { clipsRef.current = clips; }, [clips]);
  useEffect(() => { onRecordingChange?.(state === "rec"); }, [state, onRecordingChange]);
  useEffect(() => () => {
    if (ticker.current) clearInterval(ticker.current);
    clipsRef.current.forEach(c => URL.revokeObjectURL(c.url));
  }, []);

  function commit(next: VoiceClip[]) {
    clipsRef.current = next;
    setClips(next);
    onRecorded(next.map(c => c.blob));
  }

  useEffect(() => {
    const ringColor = state === "rec" ? "rgba(239,68,68,0.55)" : "rgba(70,174,34,0.5)";
    [r1, r2, r3].forEach((r, i) => {
      if (!r.current) return;
      gsap.killTweensOf(r.current);
      if (state === "idle" && canRec) {
        gsap.fromTo(r.current, { scale: 1, opacity: 0.45 }, {
          scale: 2, opacity: 0, duration: 2.2, repeat: -1, ease: "power1.out", delay: i * 0.65,
        });
      } else if (state === "rec") {
        gsap.fromTo(r.current, { scale: 1, opacity: 0.6 }, {
          scale: 2.6, opacity: 0, duration: 1, repeat: -1, ease: "power2.out", delay: i * 0.3,
        });
      } else {
        gsap.set(r.current, { opacity: 0 });
      }
    });
  }, [state, canRec]);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  async function start() {
    if (!canRec) return;
    setErr(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      mr.current = rec; buf.current = [];
      rec.ondataavailable = e => { if (e.data.size > 0) buf.current.push(e.data); };
      rec.onstop = () => {
        const blob = new Blob(buf.current, { type: "audio/webm" });
        stream.getTracks().forEach(t => t.stop());
        if (!blob.size) { setState("idle"); setSecs(0); secsRef.current = 0; return; }
        const clip: VoiceClip = {
          id: `${Date.now()}`,
          blob,
          url: URL.createObjectURL(blob),
          duration: Math.max(1, secsRef.current),
        };
        if (clipsRef.current.length < MAX) commit([...clipsRef.current, clip]);
        else URL.revokeObjectURL(clip.url);
        setState("idle"); setSecs(0); secsRef.current = 0;
      };
      rec.start(); setState("rec"); setSecs(0); secsRef.current = 0;
      ticker.current = setInterval(() => { secsRef.current += 1; setSecs(secsRef.current); }, 1000);
    } catch { setErr(true); }
  }

  function stop() {
    mr.current?.stop();
    if (ticker.current) clearInterval(ticker.current);
  }

  function remove(id: string) {
    const t = clips.find(c => c.id === id);
    if (t) URL.revokeObjectURL(t.url);
    commit(clipsRef.current.filter(c => c.id !== id));
  }

  const rec = state === "rec";
  const ringColor = rec ? "rgba(239,68,68,0.55)" : "rgba(70,174,34,0.5)";

  return (
    <div style={{
      display:    "flex",
      alignItems: "center",
      gap:        "clamp(1rem, 2vw, 1.8rem)",
      padding:    "clamp(1rem, 1.8vw, 1.4rem) clamp(1.2rem, 2vw, 1.8rem)",
    }}>
      {/* Mic button with pulse rings */}
      <div style={{ position: "relative", flexShrink: 0, width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div ref={r1} style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1px solid ${ringColor}`, pointerEvents: "none" }} />
        <div ref={r2} style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1px solid ${ringColor}`, opacity: 0.7, pointerEvents: "none" }} />
        <div ref={r3} style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1px solid ${ringColor}`, opacity: 0.4, pointerEvents: "none" }} />
        <button
          type="button"
          onClick={rec ? stop : start}
          disabled={!canRec && !rec}
          style={{
            width:      42, height: 42, borderRadius: "50%",
            background: rec ? "rgba(239,68,68,0.1)" : "transparent",
            border:     `1px solid ${rec ? "rgba(239,68,68,0.7)" : TK.green}`,
            color:      rec ? "#ef4444" : TK.green,
            display:    "flex", alignItems: "center", justifyContent: "center",
            cursor:     canRec || rec ? "pointer" : "default",
            opacity:    !canRec && !rec ? 0.3 : 1,
            transition: "all 200ms ease",
          }}>
          {rec ? (
            <div style={{ width: 14, height: 14, borderRadius: 2, background: "#ef4444" }} />
          ) : (
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="2" width="6" height="12" rx="3" />
              <path d="M5 10a7 7 0 0 0 14 0" />
              <line x1="12" y1="19" x2="12" y2="22" />
              <line x1="9" y1="22" x2="15" y2="22" />
            </svg>
          )}
        </button>
      </div>

      {/* Status + waveform + clips */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontFamily:    SANS,
          fontSize:      "clamp(0.65rem, 0.82vw, 0.82rem)",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color:         rec ? "#ef4444" : TK.green,
          opacity:       clips.length === 0 && !rec ? 0.45 : 1,
          margin:        0,
        }}>
          {rec ? `Recording — ${fmt(secs)}` :
           clips.length ? `${clips.length} / ${MAX} voice note${clips.length > 1 ? "s" : ""}` :
           "Record a voice note"}
        </p>

        {rec && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 18, marginTop: "0.4rem" }}>
            {[4,7,12,9,17,11,6,14,8,10,15,7,5].map((h, i) => (
              <div key={i} style={{
                width: 2, borderRadius: 99, background: "#ef4444", height: h,
                transformOrigin: "bottom",
                animation: `nwv ${0.45 + (i % 5) * 0.1}s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.055}s`,
              }} />
            ))}
          </div>
        )}

        {!rec && clips.length > 0 && (
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.4rem" }}>
            {clips.map((clip, i) => (
              <span key={clip.id} style={{
                display:    "inline-flex",
                alignItems: "center",
                gap:        "0.4rem",
                padding:    "0.22rem 0.55rem",
                border:     `1px solid ${TK.line}`,
                fontFamily: SANS,
                fontSize:   "0.72rem",
                color:      TK.green,
              }}>
                Take {String(i + 1).padStart(2, "0")} — {fmt(clip.duration)}
                <button type="button" onClick={() => remove(clip.id)}
                  style={{ color: TK.green, background: "none", border: "none", cursor: "pointer", lineHeight: 1, padding: 0 }}>
                  <svg width={9} height={9} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {err && <p style={{ fontFamily: SANS, fontSize: "0.72rem", color: "#ef4444", flexShrink: 0 }}>Mic denied</p>}
      <style>{`@keyframes nwv{from{transform:scaleY(0.2)}to{transform:scaleY(1)}}`}</style>
    </div>
  );
}

function MiniVoiceButton({ onRecorded, count }: { onRecorded: (blob: Blob) => void; count: number }) {
  const [recording, setRecording] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function toggle() {
    if (recording) {
      mediaRef.current?.stop();
      return;
    }
    if (count >= 3) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      mediaRef.current = recorder;
      recorder.ondataavailable = event => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        if (blob.size) onRecorded(blob);
        setRecording(false);
      };
      recorder.start();
      setRecording(true);
    } catch {
      setRecording(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={!recording && count >= 3}
      aria-label={recording ? "Stop recording" : "Record voice note"}
      style={{
        width: 34,
        height: 34,
        display: "grid",
        placeItems: "center",
        border: `1px solid ${recording ? "#ef4444" : TK.line}`,
        background: recording ? "rgba(239,68,68,0.12)" : "rgba(70,174,34,0.06)",
        color: recording ? "#ef4444" : TK.green,
        cursor: !recording && count >= 3 ? "default" : "pointer",
        opacity: !recording && count >= 3 ? 0.35 : 1,
      }}
    >
      {recording ? (
        <span style={{ width: 10, height: 10, borderRadius: 2, background: "currentColor" }} />
      ) : (
        <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <path d="M12 19v4" />
          <path d="M8 23h8" />
        </svg>
      )}
    </button>
  );
}

/* ─── Guided brief card ─────────────────────────────────────────────── */
function GuidedCard({ onClick }: { onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button" onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:    "flex",
        alignItems: "center",
        gap:        "clamp(1rem, 2vw, 1.8rem)",
        padding:    "clamp(1.2rem, 2vw, 1.8rem)",
        border:     `1px solid ${hov ? TK.green : TK.line}`,
        background: hov ? "rgba(70,174,34,0.05)" : "transparent",
        cursor:     "pointer",
        textAlign:  "left",
        width:      "100%",
        marginTop:  "clamp(2rem, 4vw, 4rem)",
        transition: "border-color 200ms ease, background 200ms ease",
      }}>
      <div style={{ width: 8, height: 8, background: TK.green, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{
          display:    "block",
          fontFamily: SANS, fontWeight: 700,
          fontSize:   "clamp(1rem, 1.4vw, 1.3rem)",
          color:      TK.paper, lineHeight: 1.1,
        }}>Not sure what you need?</span>
        <span style={{
          display:    "block",
          fontFamily: SANS,
          fontSize:   "clamp(0.78rem, 0.95vw, 0.92rem)",
          color:      TK.green, marginTop: "0.3rem",
        }}>We will walk you through it — 3 quick questions.</span>
      </div>
      <span style={{
        fontFamily: SANS,
        fontSize:   "clamp(1rem, 1.5vw, 1.4rem)",
        color:      hov ? TK.green : TK.line,
        transform:  hov ? "translateX(4px)" : "translateX(0)",
        transition: "color 200ms ease, transform 200ms ease",
        flexShrink: 0,
      }}>→</span>
    </button>
  );
}

/* ─── 3-step guided brief modal ─────────────────────────────────────── */
export function FocusedGuidedBriefModal({ onClose }: { onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [step, setStep]   = useState(1);
  const [done, setDone]   = useState(false);
  const [sub, setSub]     = useState(false);
  const [err, setErr]     = useState(false);
  const [gd, setGd]       = useState<GuidedData>({ serviceIds: [], subServices: [], timeline: "", budget: "" });
  const [cd, setCd]       = useState<CD>({ name: "", method: "email", value: "" });
  const [message, setMessage] = useState("");
  const [voice, setVoice] = useState<Blob[]>([]);
  const [assetFiles, setAssetFiles] = useState<File[]>([]);

  const selected = SERVICES.filter(s => gd.serviceIds.includes(s.id));
  const examples = Array.from(new Set(selected.flatMap(s => s.examples)));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    gsap.fromTo(overlayRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.22 });
    gsap.fromTo(panelRef.current, { autoAlpha: 0, y: 28, scale: 0.98 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.38, ease: "power3.out" });
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [mounted]);

  function close() {
    gsap.to(panelRef.current, { autoAlpha: 0, y: 16, scale: 0.98, duration: 0.2 });
    gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.22, onComplete: onClose });
  }

  const canAdvance =
    step === 1 ? gd.serviceIds.length > 0 :
    step === 2 ? gd.subServices.length > 0 && !!gd.timeline && !!gd.budget :
    step === 3 ? cd.name.trim().length > 1 && cd.value.trim().length > 3 : false;

  async function submit() {
    if (!canAdvance) return;
    setSub(true); setErr(false);
    try {
      const audioUploads = voice.length
        ? await Promise.all(voice.map((blob, index) => uploadVoice(blob, index)))
        : [];
      const audioUrls = audioUploads.filter((url): url is string => Boolean(url));
      const failedAudioCount = voice.length - audioUrls.length;
      const fileUploads = assetFiles.length
        ? await Promise.all(assetFiles.map(file => uploadInquiryFile(file)))
        : [];
      const uploadedFiles = fileUploads.filter((file): file is { name: string; url: string } => Boolean(file));
      const failedFileCount = assetFiles.length - uploadedFiles.length;
      const noteLine = message.trim() ? `\n\nMessage:\n${message.trim()}` : "";
      const voiceLine = voice.length
        ? `\n\nVoice notes: ${audioUrls.length} uploaded${failedAudioCount ? `, ${failedAudioCount} failed to upload` : ""}`
        : "";
      const fileLine = uploadedFiles.length
        ? `\n\nShared files:\n${uploadedFiles.map(file => `- ${file.name}: ${file.url}`).join("\n")}`
        : "";
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cd.name.trim(),
          email: cd.method === "email" ? cd.value : `${cd.method}@dontforget.local`,
          projectType: `${selected.map(s => s.title).join(", ")} — ${gd.subServices.join(", ")}`,
          message: `Timeline: ${gd.timeline} | Budget: ${gd.budget}${noteLine}${voiceLine}${fileLine}`,
          contactMethod: cd.method,
          contactValue:  cd.value,
          source: "focused-home-guided",
          audioUrls,
          assetNames: uploadedFiles.map(file => file.name),
          metadata: {
            serviceIds: gd.serviceIds,
            subServices: gd.subServices,
            timeline: gd.timeline,
            budget: gd.budget,
            assetCount: uploadedFiles.length,
            failedFileCount,
            assetUrls: uploadedFiles,
            voiceCount: audioUrls.length,
            failedAudioCount,
          },
        }),
      });
      if (res.ok) setDone(true);
      else { setErr(true); setSub(false); }
    } catch { setErr(true); setSub(false); }
  }

  const STEP_LABELS = ["Services", "Scope", "Details"];

  if (!mounted) return null;

  return createPortal(
    <div ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) close(); }}
      onWheel={e => e.stopPropagation()}
      style={{
        position: "fixed", inset: 0, zIndex: 100000,
        display: "grid", placeItems: "center",
        padding: "clamp(0.75rem, 2vw, 1.5rem)",
        background: "rgba(0,0,0,0.92)",
        backdropFilter: "blur(14px)",
        overscrollBehavior: "contain",
      }}>
      <div ref={panelRef}
        style={{
          width:         "min(760px, calc(100vw - 2rem))",
          maxHeight:     "calc(100dvh - 2rem)",
          display:       "flex",
          flexDirection: "column",
          overflow:      "hidden",
          background:    TK.ink,
          border:        `1px solid ${TK.line}`,
        }}>

        {/* Header */}
        <div style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          padding:        "clamp(1rem, 1.8vw, 1.4rem) clamp(1.2rem, 2vw, 1.8rem)",
          borderBottom:   `1px solid ${TK.line}`,
          flexShrink:     0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {[1, 2, 3].map(n => (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <div style={{
                  width: 22, height: 22,
                  border:     `1px solid ${step >= n ? TK.green : TK.line}`,
                  background: step > n ? TK.green : "transparent",
                  display:    "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: SANS,
                  fontSize:   "0.55rem",
                  color:      step > n ? TK.ink : step === n ? TK.green : TK.line,
                }}>{n}</div>
                {n < 3 && <div style={{ width: 16, height: 1, background: step > n ? TK.green : TK.line }} />}
              </div>
            ))}
            <span style={{ fontFamily: SANS, fontSize: "clamp(0.6rem, 0.75vw, 0.75rem)", letterSpacing: "0.18em", textTransform: "uppercase", color: TK.green, opacity: 0.65, marginLeft: "0.5rem" }}>
              {STEP_LABELS[step - 1]}
            </span>
          </div>
          <button type="button" onClick={close} aria-label="Close"
            style={{ background: "none", border: `1px solid ${TK.line}`, color: TK.green, cursor: "pointer", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: "1 1 auto", minHeight: 0, overflowY: "auto", padding: "clamp(1.5rem, 3vw, 2.5rem) clamp(1.2rem, 2vw, 1.8rem)", overscrollBehavior: "contain" }}>
          {done ? (
            <div style={{ textAlign: "center", padding: "clamp(2rem, 5vw, 4rem) 0" }}>
              <div style={{ width: 64, height: 64, border: `2px solid ${TK.green}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto clamp(1.5rem, 3vw, 2rem)" }}>
                <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={TK.green} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <h3 style={{ fontFamily: SANS, fontWeight: 700, fontSize: "clamp(1.6rem, 3vw, 2.5rem)", color: TK.paper, lineHeight: 1, margin: "0 0 0.75rem" }}>Brief received.</h3>
              <p style={{ fontFamily: SANS, fontSize: "clamp(0.88rem, 1.1vw, 1.05rem)", color: TK.green, lineHeight: 1.6 }}>A real person will reply within 24 hours.</p>
            </div>

          ) : step === 1 ? (
            <div>
              <h3 style={{ fontFamily: SANS, fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", color: TK.paper, lineHeight: 1, margin: "0 0 0.5rem" }}>What are you building?</h3>
              <p style={{ fontFamily: SANS, fontSize: "clamp(0.82rem, 1vw, 1rem)", color: TK.green, opacity: 0.7, margin: "0 0 clamp(1.5rem, 2.5vw, 2rem)" }}>Pick every service that belongs in the project.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.65rem" }}>
                {SERVICES.map(svc => {
                  const active = gd.serviceIds.includes(svc.id);
                  return (
                    <button key={svc.id} type="button"
                      onClick={() => setGd(d => ({
                        ...d,
                        serviceIds: active ? d.serviceIds.filter(id => id !== svc.id) : [...d.serviceIds, svc.id],
                        subServices: [],
                      }))}
                      style={{
                        display:       "flex",
                        flexDirection: "column",
                        alignItems:    "flex-start",
                        gap:           "0.3rem",
                        padding:       "clamp(0.9rem, 1.5vw, 1.2rem)",
                        border:        `1px solid ${active ? TK.green : TK.line}`,
                        background:    active ? "rgba(70,174,34,0.07)" : "transparent",
                        cursor:        "pointer",
                        textAlign:     "left",
                        transition:    "all 160ms ease",
                      }}>
                      <span style={{ fontFamily: SANS, fontSize: "clamp(0.55rem, 0.68vw, 0.68rem)", letterSpacing: "0.2em", color: active ? TK.green : TK.line }}>{svc.n}</span>
                      <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: "clamp(0.88rem, 1.1vw, 1.1rem)", color: active ? TK.paper : TK.green, lineHeight: 1.1 }}>{svc.title}</span>
                      <span style={{ fontFamily: SANS, fontSize: "clamp(0.62rem, 0.78vw, 0.78rem)", color: active ? TK.green : TK.line, lineHeight: 1.35 }}>{svc.tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          ) : step === 2 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "clamp(1.5rem, 2.5vw, 2rem)" }}>
              <div>
                <h3 style={{ fontFamily: SANS, fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", color: TK.paper, lineHeight: 1, margin: "0 0 0.5rem" }}>What do you need?</h3>
                <p style={{ fontFamily: SANS, fontSize: "clamp(0.82rem, 1vw, 1rem)", color: TK.green, opacity: 0.7, margin: 0 }}>Select deliverables, timeline, and budget.</p>
              </div>
              <div>
                <FieldLabel>Deliverables</FieldLabel>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {examples.map(ex => (
                    <Chip key={ex} label={ex}
                      active={gd.subServices.includes(ex)}
                      onClick={() => setGd(d => ({
                        ...d,
                        subServices: d.subServices.includes(ex) ? d.subServices.filter(s => s !== ex) : [...d.subServices, ex],
                      }))} />
                  ))}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(1rem, 2vw, 2rem)" }}>
                <div>
                  <FieldLabel>Timeline</FieldLabel>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {TIMELINES.map(t => <Chip key={t} label={t} active={gd.timeline === t} onClick={() => setGd(d => ({ ...d, timeline: t }))} />)}
                  </div>
                </div>
                <div>
                  <FieldLabel>Budget</FieldLabel>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {BUDGETS.map(b => <Chip key={b} label={b} active={gd.budget === b} onClick={() => setGd(d => ({ ...d, budget: b }))} />)}
                  </div>
                </div>
              </div>
            </div>

          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "clamp(1.2rem, 2vw, 1.8rem)" }}>
              <div>
                <h3 style={{ fontFamily: SANS, fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", color: TK.paper, lineHeight: 1, margin: "0 0 0.5rem" }}>Last few details.</h3>
                <p style={{ fontFamily: SANS, fontSize: "clamp(0.82rem, 1vw, 1rem)", color: TK.green, opacity: 0.7, margin: 0 }}>We promise, that&apos;s it.</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(0.8rem, 1.5vw, 1.2rem)" }}>
                <Field label="Your name" value={cd.name} onChange={v => setCd(d => ({ ...d, name: v }))} placeholder="Full name" autoComplete="name" />
                <div>
                  <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "0.35rem",
                    minHeight: "calc(clamp(0.6rem, 0.75vw, 0.75rem) * 1.2 + 0.55rem)",
                    marginBottom: "0.55rem",
                  }}>
                    {(["email", "phone", "whatsapp"] as ContactMethod[]).map(method => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setCd(d => ({ ...d, method, value: "" }))}
                        style={{
                          border: `1px solid ${cd.method === method ? TK.green : TK.line}`,
                          background: cd.method === method ? TK.green : "transparent",
                          color: cd.method === method ? TK.ink : TK.green,
                          fontFamily: SANS,
                          fontSize: "0.62rem",
                          padding: "0.25rem 0.5rem",
                          cursor: "pointer",
                          lineHeight: 1,
                        }}
                      >
                        {METHOD_LABELS[method]}
                      </button>
                    ))}
                  </div>
                  <input
                    value={cd.value}
                    onChange={e => setCd(d => ({ ...d, value: e.target.value }))}
                    type={cd.method === "email" ? "email" : "tel"}
                    placeholder={cd.method === "email" ? "hello@you.com" : "+1 555 123 4567"}
                    autoComplete={cd.method === "email" ? "email" : "tel"}
                    required
                    style={{
                      width: "100%",
                      background: "var(--nox-field-bg)",
                      border: `1px solid ${TK.line}`,
                      outline: "none",
                      padding: "0.75rem 0.9rem",
                      fontFamily: SANS,
                      fontSize: "clamp(0.88rem, 1.1vw, 1.05rem)",
                      color: TK.paper,
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>
              <div>
                <FieldLabel>Message</FieldLabel>
                <style>{`#focused-guided-message::placeholder{color:rgba(70,174,34,0.38)}`}</style>
                <div
                  style={{
                    position: "relative",
                    background: "var(--nox-field-bg)",
                    border: `1px solid ${TK.line}`,
                  }}
                >
                  <textarea
                    id="focused-guided-message"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Add context, goals, links, constraints, or anything we should know."
                    style={{
                      width: "100%",
                      minHeight: 150,
                      resize: "vertical",
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      padding: "0.9rem 0.95rem 3.2rem",
                      fontFamily: SANS,
                      fontSize: "clamp(0.88rem, 1.1vw, 1.05rem)",
                      color: TK.paper,
                      lineHeight: 1.55,
                      boxSizing: "border-box",
                    }}
                  />
                  <div style={{
                    position: "absolute",
                    right: "0.75rem",
                    bottom: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.45rem",
                  }}>
                    <label
                      aria-label="Attach files"
                      style={{
                        width: 34,
                        height: 34,
                        display: "grid",
                        placeItems: "center",
                        border: `1px solid ${TK.line}`,
                        background: "rgba(70,174,34,0.06)",
                        color: TK.green,
                        cursor: "pointer",
                      }}
                    >
                      <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                        <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                      </svg>
                      <input
                        type="file"
                        multiple
                        style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
                        onChange={e => {
                          const next = Array.from(e.target.files ?? []);
                          if (next.length) setAssetFiles(files => [...files, ...next].slice(0, 6));
                          e.currentTarget.value = "";
                        }}
                      />
                    </label>
                    <MiniVoiceButton onRecorded={blob => setVoice(items => [...items, blob].slice(0, 3))} count={voice.length} />
                  </div>
                </div>
                {(assetFiles.length > 0 || voice.length > 0) && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginTop: "0.65rem" }}>
                    {assetFiles.map((file, i) => (
                      <button
                        key={`${file.name}-${i}`}
                        type="button"
                        onClick={() => setAssetFiles(files => files.filter((_, index) => index !== i))}
                        style={{
                          border: `1px solid ${TK.line}`,
                          background: "transparent",
                          color: TK.green,
                          padding: "0.35rem 0.55rem",
                          fontFamily: SANS,
                          fontSize: "0.72rem",
                          cursor: "pointer",
                        }}
                      >
                        {file.name} x
                      </button>
                    ))}
                    {voice.map((_, i) => (
                      <button key={i} type="button" onClick={() => setVoice(items => items.filter((_, index) => index !== i))} style={{
                        border: `1px solid ${TK.line}`,
                        color: TK.green,
                        background: "transparent",
                        padding: "0.35rem 0.55rem",
                        fontFamily: SANS,
                        fontSize: "0.72rem",
                        cursor: "pointer",
                      }}>
                        Voice note {i + 1} x
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {err && <p style={{ fontFamily: SANS, fontSize: "0.82rem", color: "#ef4444" }}>Something went wrong. Try again.</p>}
            </div>
          )}
        </div>

        {/* Footer nav */}
        {!done && (
          <div style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            padding:        "clamp(1rem, 1.8vw, 1.4rem) clamp(1.2rem, 2vw, 1.8rem)",
            borderTop:      `1px solid ${TK.line}`,
            flexShrink:     0,
          }}>
            {step > 1 ? (
              <button type="button" onClick={() => setStep(s => s - 1)} style={{
                background: "none", border: `1px solid ${TK.line}`, color: TK.green,
                fontFamily: SANS, fontSize: "clamp(0.78rem, 0.95vw, 0.95rem)",
                padding: "0.6rem 1.2rem", cursor: "pointer",
              }}>← Back</button>
            ) : <span />}
            <button type="button"
              disabled={!canAdvance || sub}
              onClick={step < 3 ? () => setStep(s => s + 1) : submit}
              style={{
                background: canAdvance ? TK.green : "transparent",
                color:      canAdvance ? TK.ink   : TK.green,
                border:     `1px solid ${canAdvance ? TK.green : TK.line}`,
                fontFamily: SANS, fontWeight: 700,
                fontSize:   "clamp(0.88rem, 1.1vw, 1.05rem)",
                padding:    "0.7rem clamp(1.5rem, 2.5vw, 2.5rem)",
                cursor:     canAdvance && !sub ? "pointer" : "default",
                opacity:    canAdvance ? 1 : 0.4,
                transition: "all 160ms ease",
              }}>
              {step === 3 ? (sub ? "Sending…" : "Send brief →") : "Continue →"}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

/* ─── Main ──────────────────────────────────────────────────────────── */
export default function NoxContactHome() {
  const [message, setMessage]     = useState("");
  const [voice, setVoice]         = useState<Blob[]>([]);
  const [isRec, setIsRec]         = useState(false);
  const [taFocused, setTaFocused] = useState(false);
  const [stepModal, setStepModal] = useState(false);

  const hasMsg     = message.trim().length > 0;
  const hasVoice   = voice.length > 0;
  const hasPayload = hasMsg || hasVoice;

  return (
    <section className="tk-contact-home" style={{
      position:   "relative",
      overflow:   "hidden",
      zIndex:     3,
      borderTop:  `1px solid ${TK.line}`,
      padding:    "clamp(6rem, 12vw, 14rem) clamp(1.5rem, 4vw, 3.5rem) clamp(6rem, 12vw, 14rem)",
    }}>

      {/* Dark overlay — kills the background animation noise */}
      <div style={{
        position:   "absolute",
        inset:      0,
        background: "var(--nox-ink)",
        zIndex:     0,
        pointerEvents: "none",
      }} />

      {/* All content above overlay */}
      <div style={{ position: "relative", zIndex: 1 }}>

      {/* Section heading */}
      <div style={{ textAlign: "center", margin: "0 0 clamp(4rem, 7vw, 8rem)" }}>
        <p style={{
          fontFamily:    SANS,
          fontSize:      "clamp(0.65rem, 0.85vw, 0.85rem)",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color:         TK.green,
          opacity:       0.6,
          margin:        "0 0 clamp(1rem, 1.8vw, 1.5rem)",
        }}>/ get in touch</p>
        <h2 style={{
          fontFamily:    SANS,
          fontWeight:    700,
          fontSize:      "clamp(3rem, 7vw, 8rem)",
          lineHeight:    0.92,
          color:         TK.paper,
          textTransform: "uppercase",
          letterSpacing: "-0.03em",
          margin:        "0 0 0.2em",
        }}>Have something</h2>
        <h2 style={{
          fontFamily:  DISPLAY,
          fontStyle:   "italic",
          fontWeight:  700,
          fontSize:    "clamp(3.2rem, 8vw, 9rem)",
          lineHeight:  0.9,
          color:       TK.green,
          letterSpacing: "-0.03em",
          margin:      "0 0 clamp(1rem,2vw,2rem)",
        }}>you want to build?</h2>
        <p style={{
          fontFamily: SANS,
          fontSize:   "clamp(0.85rem, 1.05vw, 1.05rem)",
          lineHeight: 1.7,
          color:      TK.green,
          opacity:    0.65,
          maxWidth:   520,
          margin:     "0 auto",
        }}>
          No pressure. No confusing sales performance. Just a useful conversation.
        </p>
      </div>

      {/* Two-column layout */}
      <div style={{
        display:             "grid",
        gridTemplateColumns: "1fr 1fr",
        gap:                 "clamp(2.5rem, 5vw, 5rem)",
        maxWidth:            1100,
        margin:              "0 auto",
      }}>

        {/* LEFT — description + guided brief card */}
        <div>
          <p style={{ fontFamily: SANS, fontSize: "clamp(0.95rem, 1.4vw, 1.4rem)", lineHeight: 1.65, color: TK.green, margin: 0 }}>
            Clear brief? Great. Messy idea? Also great. Tell us what you are trying to create, fix, launch, or finally understand — and we will help you find the next smart step.
            <br /><br />
            <span style={{ color: TK.paper, fontSize: "clamp(0.95rem,1.2vw,1.2rem)", display: "block", textAlign: "left" }}>
              You can also use the mic{" "}
              <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle", marginBottom: 2 }}>
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>{" "}
              button to <strong style={{ fontWeight: 700 }}>voice record your message</strong>.
            </span>
          </p>
          <GuidedCard onClick={() => setStepModal(true)} />
        </div>

        {/* RIGHT — form card */}
        <div style={{ position: "relative" }}>
          <div style={{
            border:        `1px solid ${TK.line}`,
            background:    "var(--nox-form-card-bg, transparent)",
            display:       "flex",
            flexDirection: "column",
            minHeight:     "clamp(320px, 48vh, 460px)",
          }}>
            {/* Textarea + suggestion overlay */}
            <style>{`#nox-main-ta::placeholder{color:rgba(70,174,34,0.38)}`}</style>
            <div style={{ position: "relative", flex: "1 1 auto", display: "flex", flexDirection: "column" }}>
              <textarea
                id="nox-main-ta"
                value={message}
                onChange={e => setMessage(e.target.value)}
                onFocus={() => setTaFocused(true)}
                onBlur={() => setTaFocused(false)}
                placeholder="Describe the project, idea, or problem."
                style={{
                  flex:       "1 1 auto",
                  minHeight:  "clamp(140px, 22vh, 220px)",
                  resize:     "none",
                  background: "var(--nox-field-bg)",
                  border:     "none",
                  outline:    "none",
                  padding:    "clamp(1rem, 1.8vw, 1.5rem)",
                  fontFamily: SANS,
                  fontSize:   "clamp(0.95rem, 1.2vw, 1.2rem)",
                  color:      TK.paper,
                  lineHeight: 1.65,
                }} />

              {/* Quick-prompt chips — absolute overlay, only when focused + empty */}
              <div style={{
                position:   "absolute",
                bottom:     "clamp(0.75rem, 1.2vw, 1rem)",
                left:       "clamp(1rem, 1.8vw, 1.5rem)",
                right:      "clamp(1rem, 1.8vw, 1.5rem)",
                display:    "flex",
                flexWrap:   "wrap",
                gap:        "0.4rem",
                opacity:    taFocused && !hasMsg && !isRec ? 1 : 0,
                transform:  taFocused && !hasMsg && !isRec ? "translateY(0)" : "translateY(6px)",
                transition: "opacity 180ms ease, transform 180ms ease",
                pointerEvents: taFocused && !hasMsg && !isRec ? "auto" : "none",
              }}>
                {PROMPTS.map(p => (
                  <button key={p} type="button"
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => setMessage(p)}
                    style={{
                      padding:    "0.35rem 0.7rem",
                      border:     `1px solid ${TK.line}`,
                      background: "var(--nox-field-bg)",
                      color:      TK.green,
                      fontFamily: SANS,
                      fontSize:   "clamp(0.68rem, 0.82vw, 0.82rem)",
                      cursor:     "pointer",
                      lineHeight: 1.3,
                      opacity:    0.85,
                      transition: "opacity 160ms ease, border-color 160ms ease",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.borderColor = TK.green; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.borderColor = TK.line; }}
                  >{p}</button>
                ))}
              </div>
            </div>

            {/* Voice recorder */}
            <div style={{ borderTop: `1px solid ${TK.line}` }}>
              <NoxVoice onRecorded={setVoice} onRecordingChange={setIsRec} />
            </div>
          </div>

          {/* Send button — floats bottom-right, appears when there's a payload */}
          <div style={{
            position:      "absolute",
            bottom:        "clamp(1rem, 1.8vw, 1.5rem)",
            right:         "clamp(1rem, 1.8vw, 1.5rem)",
            zIndex:        2,
            opacity:       hasPayload && !isRec ? 1 : 0,
            pointerEvents: hasPayload && !isRec ? "auto" : "none",
            transform:     hasPayload && !isRec ? "translateY(0) scale(1)" : "translateY(6px) scale(0.96)",
            transition:    "opacity 220ms ease, transform 220ms ease",
          }}>
            <button type="button" onClick={() => setStepModal(true)} style={{
              display:    "flex",
              alignItems: "center",
              gap:        "0.4rem",
              padding:    "0.72rem clamp(1rem, 1.8vw, 1.5rem)",
              background: TK.green,
              border:     "none",
              color:      TK.ink,
              fontFamily: SANS, fontWeight: 700,
              fontSize:   "clamp(0.82rem, 0.95vw, 0.95rem)",
              cursor:     "pointer",
            }}>
              Send
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      </div>{/* end zIndex wrapper */}

      {stepModal && <FocusedGuidedBriefModal onClose={() => setStepModal(false)} />}
    </section>
  );
}
