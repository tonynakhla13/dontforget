"use client";

/**
 * ImmersiveContact
 *
 * Single-viewport contact experience for the immersive mode.
 *
 * Message / voice first, then a compact contact details popup on Send.
 */

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import RequestForm from "@/components/RequestForm";
import * as THREE from "three";

/* ─────────────────────────────────────────────────────────────────────────
   VOICE RECORDER — the visual hero of the form
───────────────────────────────────────────────────────────────────────── */
type VoiceClip = {
  id: string;
  blob: Blob;
  url: string;
  duration: number;
};

function VoiceHero({ onRecorded, onRecordingChange }: { onRecorded: (clips: Blob[]) => void; onRecordingChange?: (recording: boolean) => void }) {
  const [state, setState] = useState<"idle" | "rec">("idle");
  const [secs, setSecs]   = useState(0);
  const [clips, setClips] = useState<VoiceClip[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [err, setErr]     = useState(false);

  const mr   = useRef<MediaRecorder | null>(null);
  const buf  = useRef<Blob[]>([]);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);
  const secsRef = useRef(0);
  const clipsRef = useRef<VoiceClip[]>([]);
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
  const ring1 = useRef<HTMLDivElement>(null);
  const ring2 = useRef<HTMLDivElement>(null);
  const ring3 = useRef<HTMLDivElement>(null);

  const maxClips = 5;
  const canRecord = clips.length < maxClips && state !== "rec";

  useEffect(() => { clipsRef.current = clips; }, [clips]);
  useEffect(() => { onRecordingChange?.(state === "rec"); }, [state, onRecordingChange]);
  useEffect(() => () => {
    if (tick.current) clearInterval(tick.current);
    clipsRef.current.forEach(clip => URL.revokeObjectURL(clip.url));
  }, []);

  function commitClips(next: VoiceClip[]) {
    clipsRef.current = next;
    setClips(next);
    onRecorded(next.map(item => item.blob));
  }

  /* Pulse rings animation — idle = slow invite, recording = fast pulse */
  useEffect(() => {
    [ring1, ring2, ring3].forEach((r, i) => {
      if (!r.current) return;
      gsap.killTweensOf(r.current);
      if (state === "idle" && canRecord) {
        gsap.fromTo(r.current,
          { scale: 1, opacity: clips.length ? 0.22 : 0.35 },
          { scale: clips.length ? 1.55 : 1.9, opacity: 0, duration: clips.length ? 3 : 2.4, repeat: -1,
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
  }, [state, canRecord, clips.length]);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  async function start() {
    if (!canRecord) return;
    setErr(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      mr.current = rec; buf.current = [];
      rec.ondataavailable = e => { if (e.data.size > 0) buf.current.push(e.data); };
      rec.onstop = () => {
        const blob = new Blob(buf.current, { type: "audio/webm" });
        stream.getTracks().forEach(t => t.stop());
        if (!blob.size) {
          setState("idle");
          setSecs(0);
          secsRef.current = 0;
          return;
        }
        const clip = {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          blob,
          url: URL.createObjectURL(blob),
          duration: Math.max(1, secsRef.current),
        };
        if (clipsRef.current.length >= maxClips) {
          URL.revokeObjectURL(clip.url);
        } else {
          commitClips([...clipsRef.current, clip]);
        }
        setState("idle");
        setSecs(0);
        secsRef.current = 0;
      };
      rec.start(); setState("rec"); setSecs(0);
      secsRef.current = 0;
      tick.current = setInterval(() => {
        secsRef.current += 1;
        setSecs(secsRef.current);
      }, 1000);
    } catch { setErr(true); }
  }

  function stop() { mr.current?.stop(); if (tick.current) clearInterval(tick.current); }

  function removeClip(id: string) {
    const target = clips.find(clip => clip.id === id);
    if (target) URL.revokeObjectURL(target.url);
    const audio = audioRefs.current[id];
    audio?.pause();
    delete audioRefs.current[id];
    setPlayingId(current => current === id ? null : current);
    commitClips(clipsRef.current.filter(clip => clip.id !== id));
  }

  function togglePlay(id: string) {
    const target = audioRefs.current[id];
    if (!target) return;
    Object.entries(audioRefs.current).forEach(([key, audio]) => {
      if (key !== id) audio?.pause();
    });
    if (playingId === id) {
      target.pause();
      setPlayingId(null);
    } else {
      target.currentTime = 0;
      target.play().then(() => setPlayingId(id)).catch(() => setPlayingId(null));
    }
  }

  return (
    <div className="flex h-full flex-col justify-center gap-3 px-4 py-4"
      style={{
        alignItems: "center",
        width: clips.length ? "min(480px, calc(100% - 180px))" : "100%",
        minWidth: clips.length ? 280 : "auto",
      }}>

      {/* Label */}
      <p style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.44rem",
        letterSpacing: "0.44em", textTransform: "uppercase",
        color: clips.length ? "var(--teal)" : "var(--body)", opacity: state === "idle" && !clips.length ? 0.5 : 1,
        textAlign: "center" }}>
        {state === "idle" && !clips.length && "Record your message"}
        {state === "idle" && clips.length > 0 && `${clips.length} / ${maxClips} voice notes attached`}
        {state === "rec"  && `Recording — ${fmt(secs)}`}
      </p>

      {/* Big mic button with pulse rings */}
      {(state === "rec" || clips.length === 0) && (
        <div className="relative flex items-center justify-center" style={{ width: clips.length ? 76 : 96, height: clips.length ? 76 : 96 }}>
          {/* Rings */}
          <div ref={ring1}
            style={{ position: "absolute", inset: 0, borderRadius: "50%",
              border: "1px solid rgba(var(--teal-rgb),0.5)", pointerEvents: "none" }} />
          <div ref={ring2}
            style={{ position: "absolute", inset: 0, borderRadius: "50%",
              border: "1px solid rgba(var(--teal-rgb),0.38)", pointerEvents: "none" }} />
          <div ref={ring3}
            style={{ position: "absolute", inset: 0, borderRadius: "50%",
              border: "1px solid rgba(var(--teal-rgb),0.26)", pointerEvents: "none" }} />
          {/* Button */}
          <button type="button"
            onClick={state === "idle" ? start : stop}
            className="relative flex items-center justify-center rounded-full transition-all duration-300 hover:scale-105"
            disabled={state === "idle" && !canRecord}
            style={{
              width: clips.length ? 62 : 80, height: clips.length ? 62 : 80,
              background: state === "rec"
                ? "rgba(239,68,68,0.18)"
                : "linear-gradient(145deg,rgba(var(--teal-rgb),0.22) 0%,rgba(var(--teal-rgb),0.08) 100%)",
              border: `1.5px solid ${state === "rec" ? "rgba(239,68,68,0.55)" : "rgba(var(--teal-rgb),0.55)"}`,
              boxShadow: state === "rec"
                ? "0 0 32px rgba(239,68,68,0.18), inset 0 0 20px rgba(239,68,68,0.05)"
                : "0 0 32px rgba(var(--teal-rgb),0.14), inset 0 0 20px rgba(var(--teal-rgb),0.06)",
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

      {clips.length > 0 && (
        <div style={{
          width: "100%",
          maxWidth: 420,
          display: "grid",
          gridTemplateColumns: clips.length > 2 ? "1fr 1fr" : "1fr",
          gap: "0.45rem",
        }}>
          {clips.map((clip, index) => {
            const active = playingId === clip.id;
            return (
              <div key={clip.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto auto",
                  alignItems: "center",
                  gap: "0.65rem",
                  padding: "0.48rem 0.55rem",
                  borderRadius: "0.75rem",
                  border: `1px solid ${active ? "rgba(var(--teal-rgb),0.46)" : "rgba(var(--teal-rgb),0.16)"}`,
                  background: active
                    ? "linear-gradient(90deg,rgba(var(--teal-rgb),0.13),rgba(var(--teal-rgb),0.035))"
                    : "rgba(3,8,6,0.52)",
                  boxShadow: active ? "0 0 24px rgba(var(--teal-rgb),0.08)" : "none",
                  minWidth: 0,
                }}>
                <audio
                  src={clip.url}
                  ref={el => { audioRefs.current[clip.id] = el; }}
                  onEnded={() => setPlayingId(null)}
                />
                <button type="button" onClick={() => togglePlay(clip.id)}
                  aria-label={active ? `Pause voice note ${index + 1}` : `Play voice note ${index + 1}`}
                  style={{
                    width: 30, height: 30, borderRadius: "50%",
                    border: "1px solid rgba(var(--teal-rgb),0.36)",
                    background: "rgba(var(--teal-rgb),0.12)",
                    color: "var(--teal)",
                    display: "grid", placeItems: "center",
                    flexShrink: 0,
                  }}>
                  {active ? (
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
                    </svg>
                  ) : (
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                    <span style={{
                      fontFamily: "var(--font-mono-next)",
                      fontSize: "0.47rem",
                      letterSpacing: "0.24em",
                      textTransform: "uppercase",
                      color: "var(--teal)",
                      whiteSpace: "nowrap",
                    }}>
                      Take {String(index + 1).padStart(2, "0")}
                    </span>
                    <span style={{ color: "rgba(240,236,227,0.55)", fontSize: "0.72rem" }}>{fmt(clip.duration)}</span>
                  </div>
                  <div className="mt-1 flex items-end gap-[2px]" aria-hidden style={{ height: 12, opacity: active ? 1 : 0.62 }}>
                    {[4,8,5,10,6,12,7,9,5,11,6,8].map((h, i) => (
                      <span key={i} style={{
                        width: 2,
                        height: h,
                        borderRadius: 99,
                        background: "var(--teal)",
                        transformOrigin: "bottom",
                        animation: active ? `voiceMini ${0.48 + (i % 4) * 0.08}s ease-in-out infinite alternate` : "none",
                        animationDelay: `${i * 0.045}s`,
                      }} />
                    ))}
                  </div>
                </div>

                <span style={{
                  fontFamily: "var(--font-mono-next)",
                  fontSize: "0.42rem",
                  letterSpacing: "0.18em",
                  color: "rgba(240,236,227,0.38)",
                  whiteSpace: "nowrap",
                }}>
                  attached
                </span>

                <button type="button" onClick={() => removeClip(clip.id)}
                  aria-label={`Remove voice note ${index + 1}`}
                  style={{
                    color: "rgba(240,236,227,0.45)",
                    width: 24,
                    height: 24,
                    display: "grid",
                    placeItems: "center",
                  }}>
                  <svg width={10} height={10} viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {clips.length > 0 && clips.length < maxClips && state === "idle" && (
        <button type="button" onClick={start}
          className="relative flex items-center justify-center rounded-full transition-all duration-300 hover:scale-105"
          style={{
            width: 52, height: 52,
            background: "linear-gradient(145deg,rgba(var(--teal-rgb),0.18) 0%,rgba(var(--teal-rgb),0.06) 100%)",
            border: "1.5px solid rgba(var(--teal-rgb),0.45)",
            boxShadow: "0 0 24px rgba(var(--teal-rgb),0.1), inset 0 0 14px rgba(var(--teal-rgb),0.04)",
          }}>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none"
            stroke="var(--teal)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="2" width="6" height="12" rx="3" />
            <path d="M5 10a7 7 0 0 0 14 0" />
            <line x1="12" y1="19" x2="12" y2="22" />
            <line x1="9" y1="22" x2="15" y2="22" />
          </svg>
        </button>
      )}

      {clips.length === maxClips && state === "idle" && (
        <span style={{
          fontFamily: "var(--font-mono-next)",
          fontSize: "0.42rem",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "rgba(240,236,227,0.42)",
        }}>
          Maximum 5 voice notes
        </span>
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
      <style>{`@keyframes wv{from{transform:scaleY(0.2)}to{transform:scaleY(1)}}@keyframes voiceMini{from{transform:scaleY(0.38)}to{transform:scaleY(1)}}`}</style>

      {err && <p style={{ fontSize: "0.75rem", color: "#f87171", textAlign: "center" }}>Mic access denied</p>}
    </div>
  );
}
/* ─────────────────────────────────────────────────────────────────────────
   FORM SHAPE — contact-specific 3D wireframe drawn inside the message surface
───────────────────────────────────────────────────────────────────────── */
function FormShapeVisualizer() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.z = 4.8;

    const shapeMat = new THREE.MeshBasicMaterial({
      color: 0x46d12a,
      wireframe: true,
      transparent: true,
      opacity: 0.045,
    });
    const shape = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.88, 0.24, 132, 16, 2, 3),
      shapeMat
    );
    shape.position.set(0.9, -0.08, 0.1);
    shape.rotation.set(0.5, 0.45, 0.1);
    scene.add(shape);

    const resize = () => {
      const rect = el.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const startedAt = performance.now();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = (performance.now() - startedAt) / 1000;
      shape.rotation.x = 0.5 + Math.sin(t * 0.32) * 0.08;
      shape.rotation.y += 0.006;
      shape.rotation.z += 0.003;
      shape.scale.setScalar(1 + Math.sin(t * 0.6) * 0.035);
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      shape.geometry.dispose();
      shapeMat.dispose();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        opacity: 0.42,
        mixBlendMode: "screen",
        maskImage: "linear-gradient(90deg, transparent 0%, black 35%, black 100%)",
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   STEP-BY-STEP MODAL — fixed to the viewport
───────────────────────────────────────────────────────────────────────── */
type GuidedRequestSelection = {
  serviceId?: string;
  serviceTitle?: string;
  deliverable?: string;
  deliverables?: string[];
};

function StepModal({
  onClose,
  initialSelection,
}: {
  onClose: () => void;
  initialSelection?: GuidedRequestSelection;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [headerMeta, setHeaderMeta] = useState({
    counter: "01 / 03",
    label: "Start a project",
  });

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.22 });
    gsap.fromTo(panelRef.current,
      { y: 26, scale: 0.98, autoAlpha: 0 },
      { y: 0, scale: 1, autoAlpha: 1, duration: 0.42, ease: "power3.out" });
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function close() {
    gsap.to(panelRef.current, { y: 18, scale: 0.98, autoAlpha: 0, duration: 0.22, ease: "power2.in" });
    gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.25, onComplete: onClose });
  }

  return (
    <div ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) close(); }}
      onWheel={e => e.stopPropagation()}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        display: "grid", placeItems: "center",
        padding: "clamp(0.75rem,2vw,1.5rem)",
        background: "rgba(var(--bg-rgb),0.76)",
        backdropFilter: "blur(18px)",
        overscrollBehavior: "contain",
      }}>
      <div ref={panelRef}
        style={{
          width: "min(960px, calc(100vw - 2rem))",
          height: "min(860px, calc(100dvh - 2rem))",
          maxHeight: "calc(100dvh - 2rem)",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          borderRadius: "1.25rem",
          border: "1px solid rgba(var(--teal-rgb),0.18)",
          background: "linear-gradient(145deg,rgba(var(--surface-rgb),0.98),rgba(var(--bg-rgb),0.98))",
          boxShadow: "0 28px 90px rgba(var(--bg-rgb),0.48), 0 0 60px rgba(var(--teal-rgb),0.08)",
        }}>
        {/* Header bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0.85rem 1.1rem", borderBottom: "1px solid var(--border)",
          flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
            {[1,2,3].map(n => (
              <div key={n} style={{ width: 6, height: 6, borderRadius: "50%",
                background: "var(--teal)", opacity: 0.3 + n * 0.2,
                boxShadow: "0 0 6px rgba(var(--teal-rgb),0.4)", flexShrink: 0 }} />
            ))}
            <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.46rem",
              letterSpacing: "0.34em", textTransform: "uppercase", color: "var(--teal)",
              marginLeft: "0.25rem", whiteSpace: "nowrap" }}>
              3-step form
            </span>
          </div>
          <div
            aria-live="polite"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.7rem",
              maxWidth: "min(46vw, 480px)",
              minWidth: 0,
              pointerEvents: "none",
            }}
          >
            <span style={{
              fontFamily: "var(--font-mono-next)",
              fontSize: "0.52rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "rgba(var(--teal-rgb),0.78)",
              whiteSpace: "nowrap",
            }}>
              {headerMeta.counter}
            </span>
            <span style={{
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontFamily: "var(--font-mono-next)",
              fontSize: "0.58rem",
              letterSpacing: "0.34em",
              textTransform: "uppercase",
              color: "var(--teal)",
            }}>
              {headerMeta.label}
            </span>
          </div>
          <button onClick={close}
            style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid var(--border)",
              background: "transparent", color: "var(--body)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            className="hover:bg-white/[0.07] transition-colors"
            aria-label="Close guided form">
            <svg width={11} height={11} viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Embedded form content — scrollable, contained */}
        <div
          onWheel={e => e.stopPropagation()}
          style={{ flex: "1 1 auto", minHeight: 0, display: "flex", overflow: "hidden", overscrollBehavior: "contain" }}>
          <RequestForm
            embedded
            onHeaderMetaChange={setHeaderMeta}
            onBack={close}
            initialServiceIds={initialSelection?.serviceId ? [initialSelection.serviceId] : []}
            initialSubServices={initialSelection?.deliverable ? [initialSelection.deliverable] : []}
            initialServiceDetails={initialSelection?.serviceId ? [{
              id: initialSelection.serviceId,
              title: initialSelection.serviceTitle,
              deliverables: initialSelection.deliverables,
            }] : []}
            initialStep={initialSelection?.serviceId ? 2 : 1}
          />
        </div>
      </div>
    </div>
  );
}

type ContactMethod = "whatsapp" | "phone" | "email";
type ContactDetails = {
  name: string;
  method: ContactMethod;
  value: string;
  assets: string[];
};

async function uploadVoiceClip(blob: Blob, index: number) {
  const formData = new FormData();
  formData.append("file", blob, `voice-note-${index + 1}.webm`);
  try {
    const response = await fetch("/api/inquiries/audio", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) return null;
    const data = await response.json() as { url?: string };
    return data.url ?? null;
  } catch {
    return null;
  }
}

function ContactDetailsModal({
  onClose,
  onSubmit,
  submitting,
  submitError,
}: {
  onClose: () => void;
  onSubmit: (details: ContactDetails) => void;
  submitting: boolean;
  submitError: boolean;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLFormElement>(null);
  const fieldsRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [method, setMethod] = useState<ContactMethod>("whatsapp");
  const [value, setValue] = useState("");
  const [assets, setAssets] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 });
    gsap.fromTo(panelRef.current,
      { autoAlpha: 0, y: 40, scale: 0.96 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out", delay: 0.05 });
    if (fieldsRef.current) {
      gsap.fromTo(fieldsRef.current.children,
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.4, ease: "power2.out", delay: 0.2 });
    }
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function close() {
    gsap.to(panelRef.current, { autoAlpha: 0, y: 24, scale: 0.97, duration: 0.2, ease: "power2.in" });
    gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.22, onComplete: onClose });
  }

  const contactLabel = method === "email" ? "Email address" : method === "whatsapp" ? "WhatsApp number" : "Phone number";
  const contactPlaceholder = method === "email" ? "hello@you.com" : "+1 555 123 4567";
  const canSubmit = name.trim().length > 1 && value.trim().length > 3 && !submitting;

  const methodIcons: Record<ContactMethod, React.ReactNode> = {
    whatsapp: (
      <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    phone: (
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    email: (
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    ),
  };

  return (
    <div ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) close(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        display: "grid", placeItems: "center",
        padding: "clamp(0.75rem, 2vw, 1.5rem)",
        background: "rgba(var(--bg-rgb),0.78)",
        backdropFilter: "blur(24px)",
      }}>
      <form ref={panelRef}
        onSubmit={e => {
          e.preventDefault();
          if (!canSubmit) return;
          onSubmit({ name: name.trim(), method, value: value.trim(), assets });
        }}
        style={{
          width: "min(480px, calc(100vw - 2rem))",
          borderRadius: "1.35rem",
          border: "1px solid rgba(var(--teal-rgb),0.16)",
          background: "linear-gradient(165deg, rgba(var(--surface-rgb),0.98) 0%, rgba(var(--bg-rgb),0.99) 100%)",
          boxShadow: "0 32px 100px rgba(var(--bg-rgb),0.55), 0 0 80px rgba(var(--teal-rgb),0.06), inset 0 1px 0 rgba(255,255,255,0.04)",
          maxHeight: "calc(100dvh - 2rem)",
          overflowY: "auto",
          overflowX: "hidden",
          position: "relative",
        }}>

        {/* Top glow line */}
        <div style={{
          position: "absolute", top: 0, left: "10%", right: "10%", height: 1,
          background: "linear-gradient(90deg, transparent, rgba(var(--teal-rgb),0.4), transparent)",
          borderRadius: "0 0 50% 50%",
        }} />

        {/* Header */}
        <div style={{
          padding: "1.5rem 1.5rem 0",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem",
        }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              padding: "0.3rem 0.65rem", borderRadius: 999,
              background: "rgba(var(--teal-rgb),0.1)", border: "1px solid rgba(var(--teal-rgb),0.2)",
              marginBottom: "0.85rem",
            }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--teal)",
                boxShadow: "0 0 8px rgba(var(--teal-rgb),0.6)" }} />
              <span style={{
                fontFamily: "var(--font-mono-next)", fontSize: "0.44rem",
                letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--teal)",
              }}>Almost done</span>
            </div>
            <h2 className="hed" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", lineHeight: 0.95 }}>
              Where do we<br />reach you?
            </h2>
          </div>
          <button type="button" onClick={close}
            aria-label="Close"
            className="transition-colors hover:bg-white/[0.06]"
            style={{
              width: 36, height: 36, borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              color: "rgba(240,236,227,0.5)", display: "grid", placeItems: "center",
              flexShrink: 0, marginTop: "0.25rem",
            }}>
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form fields */}
        <div ref={fieldsRef} style={{ padding: "1.25rem 1.5rem 0" }}>

          {/* Name */}
          <div style={{ marginBottom: "1rem" }}>
            <ContactField label="Your name" value={name} onChange={setName}
              placeholder="Full name" autoComplete="name" />
          </div>

          {/* Contact method selector */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={{
              display: "block", fontFamily: "var(--font-mono-next)", fontSize: "0.42rem",
              letterSpacing: "0.36em", textTransform: "uppercase",
              color: "rgba(240,236,227,0.45)", marginBottom: "0.5rem",
            }}>How should we reach you?</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
              {([
                ["whatsapp", "WhatsApp"],
                ["phone", "Phone"],
                ["email", "Email"],
              ] as const).map(([id, label]) => {
                const active = method === id;
                return (
                  <button key={id} type="button" onClick={() => setMethod(id)}
                    className="transition-all duration-200"
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem",
                      padding: "0.75rem 0.5rem",
                      borderRadius: "0.85rem",
                      border: `1.5px solid ${active ? "rgba(var(--teal-rgb),0.55)" : "rgba(255,255,255,0.06)"}`,
                      background: active
                        ? "linear-gradient(145deg, rgba(var(--teal-rgb),0.14), rgba(var(--teal-rgb),0.06))"
                        : "rgba(255,255,255,0.02)",
                      color: active ? "var(--teal)" : "rgba(240,236,227,0.4)",
                      position: "relative",
                      overflow: "hidden",
                    }}>
                    {active && <div style={{
                      position: "absolute", top: 0, left: "20%", right: "20%", height: 1,
                      background: "linear-gradient(90deg, transparent, rgba(var(--teal-rgb),0.5), transparent)",
                    }} />}
                    {methodIcons[id]}
                    <span style={{
                      fontFamily: "var(--font-mono-next)", fontSize: "0.48rem",
                      letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: active ? 600 : 400,
                    }}>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contact value */}
          <div style={{ marginBottom: "1rem" }}>
            <ContactField
              label={contactLabel}
              value={value}
              onChange={setValue}
              placeholder={contactPlaceholder}
              autoComplete={method === "email" ? "email" : "tel"}
              type={method === "email" ? "email" : "tel"}
            />
          </div>

          {/* File drop zone */}
          <div style={{ marginBottom: "0.25rem" }}>
            <label
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => {
                e.preventDefault(); setDragOver(false);
                const files = Array.from(e.dataTransfer.files).map(f => f.name);
                setAssets(prev => [...prev, ...files].slice(0, 6));
              }}
              className="transition-all duration-200"
              style={{
                display: "flex", alignItems: "center", gap: "0.85rem",
                padding: "0.75rem 0.85rem",
                borderRadius: "0.85rem",
                border: `1px dashed ${dragOver ? "rgba(var(--teal-rgb),0.5)" : "rgba(255,255,255,0.08)"}`,
                background: dragOver ? "rgba(var(--teal-rgb),0.06)" : "rgba(255,255,255,0.015)",
                cursor: "pointer",
              }}>
              <input type="file" multiple
                accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.key,.zip"
                className="sr-only"
                onChange={event => {
                  const selected = Array.from(event.target.files ?? []).map(file => file.name);
                  setAssets(prev => [...prev, ...selected].slice(0, 6));
                }}
              />
              <div style={{
                width: 36, height: 36, borderRadius: "0.65rem",
                background: "rgba(var(--teal-rgb),0.08)", border: "1px solid rgba(var(--teal-rgb),0.15)",
                display: "grid", placeItems: "center", flexShrink: 0,
              }}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
                  stroke="var(--teal)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <div style={{ minWidth: 0 }}>
                <span style={{
                  display: "block", fontSize: "0.82rem", color: "rgba(240,236,227,0.65)",
                }}>Attach files</span>
                <span style={{
                  display: "block", fontFamily: "var(--font-mono-next)", fontSize: "0.42rem",
                  letterSpacing: "0.2em", textTransform: "uppercase",
                  color: "rgba(240,236,227,0.3)", marginTop: "0.15rem",
                }}>Logo, deck, screenshots — optional</span>
              </div>
            </label>
          </div>

          {assets.length > 0 && (
            <div style={{
              display: "flex", flexWrap: "wrap", gap: "0.35rem",
              padding: "0 0.25rem", marginBottom: "0.5rem",
            }}>
              {assets.map((asset, i) => (
                <span key={`${asset}-${i}`}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.4rem",
                    padding: "0.3rem 0.55rem", borderRadius: 999,
                    background: "rgba(var(--teal-rgb),0.08)", border: "1px solid rgba(var(--teal-rgb),0.15)",
                    fontSize: "0.72rem", color: "rgba(240,236,227,0.6)",
                    maxWidth: "100%",
                  }}>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {asset}
                  </span>
                  <button type="button"
                    onClick={() => setAssets(prev => prev.filter((_, idx) => idx !== i))}
                    style={{ color: "rgba(240,236,227,0.35)", flexShrink: 0, lineHeight: 1 }}>
                    <svg width={10} height={10} viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {submitError && (
          <div style={{ padding: "0 1.5rem" }}>
            <div style={{
              padding: "0.65rem 0.85rem", borderRadius: "0.65rem",
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
              fontSize: "0.82rem", color: "#f87171",
            }}>
              Something went wrong. Try again or email HELLO@NOXDEVS.COM.
            </div>
          </div>
        )}

        {/* Submit */}
        <div style={{
          padding: "1.15rem 1.5rem 1.5rem",
        }}>
          <button type="submit" disabled={!canSubmit}
            className="transition-all duration-300 disabled:cursor-not-allowed"
            style={{
              width: "100%",
              padding: "0.95rem 1.5rem",
              borderRadius: "0.85rem",
              border: "none",
              background: canSubmit
                ? "linear-gradient(135deg, rgba(var(--teal-rgb),0.9), rgba(45,160,115,0.9))"
                : "rgba(255,255,255,0.04)",
              color: canSubmit ? "rgba(0,20,10,0.95)" : "rgba(240,236,227,0.25)",
              fontSize: "0.88rem",
              fontWeight: 600,
              letterSpacing: "0.02em",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
              boxShadow: canSubmit ? "0 8px 32px rgba(var(--teal-rgb),0.25), 0 0 0 1px rgba(var(--teal-rgb),0.3)" : "none",
              position: "relative",
              overflow: "hidden",
            }}>
            {canSubmit && <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)",
              animation: "contactShimmer 2.5s ease-in-out infinite",
            }} />}
            <span style={{ position: "relative", zIndex: 1 }}>
              {submitting ? "Sending..." : "Send request"}
            </span>
            {!submitting && (
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
                style={{ position: "relative", zIndex: 1 }}>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
          </button>
          <p style={{
            textAlign: "center", marginTop: "0.75rem",
            fontFamily: "var(--font-mono-next)", fontSize: "0.4rem",
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: "rgba(240,236,227,0.25)",
          }}>
            A real person replies within 24 hours
          </p>
        </div>

        <style>{`@keyframes contactShimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>
      </form>
    </div>
  );
}

function ContactField({ label, type = "text", placeholder, value, onChange, autoComplete }: {
  label: string; type?: string; placeholder: string;
  value: string; onChange: (v: string) => void; autoComplete: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{
        display: "block", fontFamily: "var(--font-mono-next)", fontSize: "0.42rem",
        letterSpacing: "0.36em", textTransform: "uppercase",
        color: "rgba(240,236,227,0.45)", marginBottom: "0.5rem",
      }}>{label}</label>
      <input type={type} placeholder={placeholder} required
        autoComplete={autoComplete} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className="transition-all duration-200"
        style={{
          width: "100%", padding: "0.72rem 0.9rem", borderRadius: "0.7rem",
          border: `1.5px solid ${focused ? "rgba(var(--teal-rgb),0.4)" : "rgba(255,255,255,0.07)"}`,
          background: focused ? "rgba(var(--teal-rgb),0.04)" : "rgba(255,255,255,0.025)",
          color: "var(--fg)", outline: "none",
          fontSize: "0.9rem", fontFamily: "inherit",
          boxShadow: focused ? "0 0 0 3px rgba(var(--teal-rgb),0.08)" : "none",
        }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   SUCCESS STATE — animated confirmation after submission
───────────────────────────────────────────────────────────────────────── */
function SuccessState({ onBack }: { onBack?: () => void }) {
  const containerRef = useRef<HTMLElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const checkRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Particles burst
    if (particlesRef.current) {
      const particles = particlesRef.current.children;
      tl.fromTo(particles,
        { scale: 0, opacity: 1 },
        { scale: 1, opacity: 0, duration: 1.2, stagger: { each: 0.03, from: "center" }, ease: "power2.out" },
        0
      );
    }

    // Ring scales in with elastic feel
    tl.fromTo(ringRef.current,
      { scale: 0, rotation: -90 },
      { scale: 1, rotation: 0, duration: 0.7, ease: "back.out(1.7)" },
      0.1
    );

    // Check mark draws in
    tl.fromTo(checkRef.current,
      { autoAlpha: 0, scale: 0.5 },
      { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2)" },
      0.45
    );

    // Text stagger
    if (textRef.current) {
      tl.fromTo(textRef.current.children,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.55 },
        0.5
      );
    }

    // Subtle pulse on ring
    gsap.to(ringRef.current, {
      boxShadow: "0 0 60px rgba(var(--teal-rgb),0.25), 0 0 120px rgba(var(--teal-rgb),0.08)",
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1,
    });
  }, []);

  const particleCount = 16;
  const particles = Array.from({ length: particleCount }, (_, i) => {
    const angle = (i / particleCount) * Math.PI * 2;
    const radius = 60 + Math.random() * 40;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      size: 2 + Math.random() * 3,
    };
  });

  return (
    <section ref={containerRef}
      style={{
        height: "calc(100vh - 86px)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
      }}>

      {/* Background glow */}
      <div style={{
        position: "absolute",
        width: "clamp(300px, 50vw, 600px)", height: "clamp(300px, 50vw, 600px)",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(var(--teal-rgb),0.08) 0%, transparent 70%)",
        filter: "blur(60px)",
        pointerEvents: "none",
      }} />

      {/* Particle burst */}
      <div ref={particlesRef} style={{
        position: "absolute",
        width: 1, height: 1,
        pointerEvents: "none",
      }}>
        {particles.map((p, i) => (
          <div key={i} style={{
            position: "absolute",
            width: p.size, height: p.size,
            borderRadius: "50%",
            background: "var(--teal)",
            left: p.x, top: p.y,
            opacity: 0,
          }} />
        ))}
      </div>

      {/* Animated ring + check */}
      <div ref={ringRef}
        style={{
          width: 88, height: 88, borderRadius: "50%",
          border: "2px solid var(--teal)",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(var(--teal-rgb),0.06)",
          boxShadow: "0 0 48px rgba(var(--teal-rgb),0.15), 0 0 96px rgba(var(--teal-rgb),0.05)",
          marginBottom: "2.5rem",
          position: "relative",
        }}>
        {/* Inner glow ring */}
        <div style={{
          position: "absolute", inset: 4, borderRadius: "50%",
          border: "1px solid rgba(var(--teal-rgb),0.15)",
        }} />
        <svg ref={checkRef} width={32} height={32} viewBox="0 0 24 24" fill="none"
          stroke="var(--teal)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
          style={{ opacity: 0 }}>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>

      {/* Text content */}
      <div ref={textRef} style={{ textAlign: "center", maxWidth: 460, padding: "0 1.5rem" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          padding: "0.32rem 0.75rem", borderRadius: 999,
          background: "rgba(var(--teal-rgb),0.08)", border: "1px solid rgba(var(--teal-rgb),0.18)",
          marginBottom: "1.25rem", opacity: 0,
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "var(--teal)", boxShadow: "0 0 10px rgba(var(--teal-rgb),0.5)",
          }} />
          <span style={{
            fontFamily: "var(--font-mono-next)", fontSize: "0.46rem",
            letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--teal)",
          }}>Message received</span>
        </div>

        <h1 className="hed" style={{
          fontSize: "clamp(2.4rem, 5vw, 4.2rem)", lineHeight: 0.9,
          marginBottom: "1rem", opacity: 0,
        }}>
          We&apos;re on it.
        </h1>

        <p style={{
          color: "rgba(240,236,227,0.6)", fontSize: "1rem", lineHeight: 1.75,
          marginBottom: "2.5rem", opacity: 0,
        }}>
          Your request just landed with a real human on our team.
          <br />
          Expect a reply within 24 hours.
        </p>

        <div style={{ opacity: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <button type="button"
            onClick={onBack}
            className="transition-all duration-200"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              padding: "0.78rem 1.6rem",
              borderRadius: "0.75rem",
              border: "1px solid rgba(var(--teal-rgb),0.25)",
              background: "rgba(var(--teal-rgb),0.06)",
              color: "var(--teal)",
              fontSize: "0.85rem",
              fontWeight: 500,
              textDecoration: "none",
            }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <span style={{
            fontFamily: "var(--font-mono-next)", fontSize: "0.4rem",
            letterSpacing: "0.25em", textTransform: "uppercase",
            color: "rgba(240,236,227,0.22)",
          }}>
            or close this tab — we&apos;ll find you
          </span>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────── */
export default function ImmersiveContact({
  embedded = false,
  onDoneBack,
}: {
  embedded?: boolean;
  onDoneBack?: () => void;
}) {
  const [voiceClips, setVoiceClips] = useState<Blob[]>([]);
  const [form, setForm]     = useState({ message: "" });
  const [sub, setSub]       = useState(false);
  const [done, setDone]     = useState(false);
  const [err, setErr]       = useState(false);
  const [modal, setModal]   = useState(false);
  const [contactModal, setContactModal] = useState(false);
  const [showMessageSuggestions, setShowMessageSuggestions] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const contactRootRef = useRef<HTMLDivElement>(null);
  const sectionRef  = useRef<HTMLElement>(null);
  const hasMessage = form.message.trim().length > 0;
  const hasVoice = voiceClips.length > 0;
  const hasPayload = hasMessage || hasVoice;
  const messageSuggestions = [
    "I have a company that needs a stronger website and better leads.",
    "We are launching a new offer and need the page, visuals, and strategy.",
    "Our current brand feels unclear and we need a sharper digital presence.",
  ];

  /* Entrance */
  useGSAP(() => {
    gsap.fromTo(
      sectionRef.current?.querySelectorAll("[data-in]") ?? [],
      { autoAlpha: 0, y: 22 },
      { autoAlpha: 1, y: 0, stagger: 0.09, duration: 0.7, ease: "power3.out", delay: 0.05 }
    );
  }, { scope: sectionRef });

  useGSAP(() => {
    const shape = contactRootRef.current?.querySelector("[data-contact-bg]");
    if (!shape || !contactRootRef.current) return;

    gsap.fromTo(
      shape,
      { y: -72, opacity: 0.16 },
      {
        y: 180,
        opacity: 0.07,
        ease: "none",
        scrollTrigger: {
          trigger: contactRootRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      }
    );
    ScrollTrigger.refresh();
  }, { scope: contactRootRef });


  async function handleSubmit(details: ContactDetails) {
    if (!hasPayload) return;
    setSub(true); setErr(false);
    try {
      const audioUrls = hasVoice
        ? await Promise.all(voiceClips.map((clip, index) => uploadVoiceClip(clip, index)))
        : [];
      const uploadedAudioUrls = audioUrls.filter((url): url is string => Boolean(url));
      const failedAudioCount = voiceClips.length - uploadedAudioUrls.length;
      const message = hasMessage ? form.message.trim() : `${voiceClips.length} voice note${voiceClips.length === 1 ? "" : "s"} attached.`;
      const contactLine = `Preferred contact: ${details.method} | ${details.value}`;
      const voiceLine = hasVoice
        ? `\n\n[${uploadedAudioUrls.length} voice note${uploadedAudioUrls.length === 1 ? "" : "s"} uploaded${failedAudioCount ? `, ${failedAudioCount} failed to upload` : ""}]`
        : "";
      const assetLine = details.assets.length
        ? `\n\nShared assets:\n${details.assets.map(asset => `- ${asset}`).join("\n")}`
        : "";
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: details.name,
          email: details.method === "email" ? details.value : `${details.method}@noxdevs.local`,
          projectType: "Open inquiry",
          contactMethod: details.method,
          contactValue: details.value,
          source: "immersive-contact",
          audioUrls: uploadedAudioUrls,
          assetNames: details.assets,
          metadata: {
            hasMessage,
            voiceCount: uploadedAudioUrls.length,
            failedAudioCount,
            assetCount: details.assets.length,
          },
          message: `${message}${voiceLine}${assetLine}\n\n${contactLine}`,
        }),
      });
      if (res.ok) setDone(true);
      else { setErr(true); setSub(false); }
    } catch { setErr(true); setSub(false); }
  }

  /* ── Success ── */
  if (done) {
    return (
      <SuccessState
        onBack={() => {
          if (onDoneBack) {
            onDoneBack();
            return;
          }
          setDone(false);
          setSub(false);
          setForm({ message: "" });
          setVoiceClips([]);
        }}
      />
    );
  }

  return (
    <div ref={contactRootRef} className="relative overflow-hidden">
    {!embedded ? <ContactScrollBackdrop /> : null}
    <section ref={sectionRef} id="contact"
      style={{
        minHeight: embedded ? "auto" : "calc(100dvh - 86px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: embedded
          ? "clamp(5rem,10vh,7rem) clamp(1rem,3vw,2.5rem)"
          : "clamp(8rem,14vh,11rem) clamp(1rem,3vw,2.5rem) clamp(3rem,7vh,5rem)",
        position: "relative", overflow: "hidden",
      }}>

      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[52%] opacity-45"
        style={{
          backgroundImage: "linear-gradient(rgba(var(--teal-rgb),0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--teal-rgb),0.08) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
          maskImage: "linear-gradient(to top, black, transparent)",
          transform: "perspective(700px) rotateX(62deg) translateY(18%)",
          transformOrigin: "bottom",
        }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-70"
        style={{ background: "radial-gradient(ellipse 70% 58% at 78% 36%, rgba(var(--teal-rgb),0.08), transparent 60%), radial-gradient(ellipse 46% 48% at 22% 52%, rgba(42,155,110,0.06), transparent 62%)" }} />

      <div className="mx-auto grid gap-8"
        style={{ width: "100%", maxWidth: 900, minWidth: 0, zIndex: 1 }}>

        <div data-in className="text-center" style={{ opacity: 0 }}>
          <h1 className="hed flex flex-wrap items-baseline justify-center gap-x-4 gap-y-2 text-[clamp(2.8rem,6vw,6.2rem)] leading-[0.88]">
            <span className="font-mono text-[clamp(0.72rem,1.2vw,0.95rem)] uppercase tracking-[0.34em] text-[var(--teal)]">
              / contact us
            </span>
            <span>We are here always</span>
          </h1>
        </div>

        <form onSubmit={e => e.preventDefault()}
          style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: "0.85rem", height: "100%" }}>

          <div data-in className="grid gap-4" style={{ opacity: 0, flex: 1 }}>

            <div style={{ height: "100%", minHeight: embedded ? "clamp(300px,38vh,360px)" : "clamp(390px,48vh,470px)", minWidth: 0, display: "flex", flexDirection: "column",
              borderRadius: "1.2rem", overflow: "hidden",
              border: "1px solid rgba(var(--teal-rgb),0.36)",
              background: "linear-gradient(150deg,rgba(5,13,12,0.88),rgba(0,5,8,0.76))",
              backdropFilter: "blur(18px)",
              position: "relative",
              boxShadow: "0 28px 90px rgba(0,0,0,0.32), 0 0 0 1px rgba(255,255,255,0.03), 0 0 70px rgba(var(--teal-rgb),0.08), inset 0 1px 0 rgba(255,255,255,0.045)" }}>
              <div style={{ position: "absolute", inset: "0 0 auto 0", height: 1,
                background: "linear-gradient(90deg,transparent,rgba(var(--teal-rgb),0.72),transparent)" }} />
              <FormShapeVisualizer />
              <div className="relative z-[2] flex items-center justify-between border-b border-[rgba(var(--teal-rgb),0.14)] px-5 py-4">
                <span className="font-mono text-[0.54rem] uppercase tracking-[0.28em] text-[var(--teal)]">Your message</span>
                <span className="font-mono text-[0.5rem] uppercase tracking-[0.22em] text-[rgba(240,236,227,0.34)]">Voice optional</span>
              </div>
              <textarea
                placeholder="Tell us what you are working on, what feels stuck, or what needs to happen next..."
                value={form.message}
                onFocus={() => setShowMessageSuggestions(true)}
                onClick={() => setShowMessageSuggestions(true)}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                onWheel={e => {
                  const el = e.currentTarget;
                  const canScrollInside = el.scrollHeight > el.clientHeight;
                  if (!canScrollInside) return;
                  e.stopPropagation();
                }}
                style={{ flex: 1, minHeight: 0, resize: "none", background: "transparent",
                  border: "none", outline: "none",
                  padding: "1.1rem 1.35rem 0.9rem",
                  color: "var(--fg)", fontSize: "1.03rem",
                  fontFamily: "inherit", lineHeight: 1.75,
                  position: "relative", zIndex: 1,
                  overflow: "hidden" }} />
              {/* Suggestions — fade without changing height */}
              <div
                style={{
                  position: "relative", zIndex: 2,
                  opacity: !hasMessage && !isRecording ? 1 : 0,
                  visibility: !hasMessage && !isRecording ? "visible" as const : "hidden" as const,
                  transition: "opacity 0.3s ease, visibility 0.3s ease",
                }}>
                <div>
                  <div className="flex flex-wrap gap-2 px-5 pb-4 pt-1">
                    {messageSuggestions.map(sentence => (
                      <button key={sentence} type="button"
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => setForm(f => ({ ...f, message: sentence }))}
                        style={{
                          borderRadius: 999,
                          border: "1px solid rgba(var(--teal-rgb),0.16)",
                          background: "rgba(var(--teal-rgb),0.075)",
                          color: "rgba(240,236,227,0.66)",
                          padding: "0.42rem 0.65rem",
                          fontSize: "0.72rem",
                          lineHeight: 1.25,
                        }}>
                        {sentence}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{
                position: "relative", zIndex: 1,
                minHeight: 154,
                borderTop: "1px solid rgba(var(--teal-rgb),0.13)",
                background: "linear-gradient(180deg,rgba(var(--teal-rgb),0.04),rgba(2,9,9,0.72))",
              }}>
                <VoiceHero onRecorded={setVoiceClips} onRecordingChange={setIsRecording} />
              </div>

              {/* Send button — hidden while recording */}
              <div
                className="transition-all duration-300"
                style={{
                  position: "absolute",
                  right: "clamp(0.75rem,2vw,1.15rem)",
                  bottom: "clamp(0.75rem,2vw,1.15rem)",
                  zIndex: 4,
                  opacity: hasPayload && !isRecording ? 1 : 0,
                  pointerEvents: hasPayload && !isRecording ? "auto" : "none",
                  transform: hasPayload && !isRecording ? "translateY(0) scale(1)" : "translateY(8px) scale(0.95)",
                }}>
                <button type="button"
                  onClick={() => setContactModal(true)}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    padding: "0.82rem 1.45rem",
                    borderRadius: "0.75rem",
                    border: "none",
                    background: "linear-gradient(135deg, rgba(var(--teal-rgb),0.88), rgba(42,155,110,0.88))",
                    color: "rgba(0,20,10,0.95)",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    boxShadow: "0 8px 28px rgba(var(--teal-rgb),0.22), 0 0 0 1px rgba(var(--teal-rgb),0.25)",
                    backdropFilter: "blur(12px)",
                    position: "relative",
                    overflow: "hidden",
                  }}>
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.14) 50%, transparent 100%)",
                    animation: "sendShimmer 2.8s ease-in-out infinite",
                  }} />
                  <span style={{ position: "relative", zIndex: 1 }}>Send signal</span>
                  <svg width={15} height={15} viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
                    style={{ position: "relative", zIndex: 1 }}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <style>{`@keyframes sendShimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>
            </div>


          </div>

          {/* Project planner CTA */}
          <button
            type="button"
            onClick={() => setModal(true)}
            className="group relative w-full overflow-hidden transition-all duration-300 hover:scale-[1.015]"
            style={{
              padding: "1.15rem 2rem",
              borderRadius: "1rem",
              border: "1.5px solid rgba(var(--teal-rgb),0.35)",
              background: "linear-gradient(135deg,rgba(var(--teal-rgb),0.08) 0%,rgba(var(--teal-rgb),0.03) 100%)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 0 40px rgba(var(--teal-rgb),0.06), inset 0 1px 0 rgba(255,255,255,0.04)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
            {/* shimmer on hover */}
            <div className="pointer-events-none absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
              style={{ background: "linear-gradient(90deg,transparent,rgba(var(--teal-rgb),0.08),transparent)" }} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.3rem" }}>
              <span className="font-mono text-[0.48rem] uppercase tracking-[0.36em]"
                style={{ color: "rgba(var(--teal-rgb),0.7)" }}>
                structured brief
              </span>
              <span style={{ fontSize: "clamp(1rem,2vw,1.3rem)", fontWeight: 600, color: "var(--fg)", letterSpacing: "-0.01em" }}>
                Try our Project Planner
              </span>
            </div>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              border: "1.5px solid rgba(var(--teal-rgb),0.3)",
              background: "rgba(var(--teal-rgb),0.1)",
              display: "grid", placeItems: "center", flexShrink: 0,
            }}
              className="group-hover:bg-[rgba(var(--teal-rgb),0.2)] group-hover:border-[rgba(var(--teal-rgb),0.6)] transition-all duration-300">
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none"
                stroke="var(--teal)" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </button>

        </form>
      </div>

      {/* ══════════ MODAL — viewport fixed ══════════ */}
      {modal && <StepModal onClose={() => setModal(false)} />}
      {contactModal && (
        <ContactDetailsModal
          onClose={() => setContactModal(false)}
          onSubmit={handleSubmit}
          submitting={sub}
          submitError={err}
        />
      )}

    </section>
    {!embedded ? <DirectContactSection /> : null}
    </div>
  );
}

export function ImmersiveContactPopup() {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState<GuidedRequestSelection | undefined>();

  useEffect(() => {
    const openPopup = (event: Event) => {
      const detail = event instanceof CustomEvent ? event.detail as GuidedRequestSelection | undefined : undefined;
      setSelection(detail);
      setOpen(true);
    };
    window.addEventListener("immersive-contact:open", openPopup);
    return () => window.removeEventListener("immersive-contact:open", openPopup);
  }, []);

  if (!open) return null;

  return createPortal(
    <StepModal onClose={() => setOpen(false)} initialSelection={selection} />,
    document.body
  );
}

function ContactScrollBackdrop() {
  return (
    <div
      data-contact-bg
      className="pointer-events-none absolute left-0 right-0 top-0 z-0 h-[150vh]"
      aria-hidden
      style={{
        opacity: 0.12,
        mixBlendMode: "screen",
        transform: "translateZ(0)",
      }}
    >
      <div className="absolute left-1/2 top-[6vh] h-[min(86vw,760px)] w-[min(86vw,760px)] -translate-x-1/2">
        <ContactSignalShape />
      </div>
      <div className="absolute inset-x-0 top-0 h-[60vh] bg-[radial-gradient(ellipse_at_50%_10%,rgba(var(--teal-rgb),0.06),transparent_62%)]" />
    </div>
  );
}

function ContactSignalShape() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.z = 5.5;

    const lineMat = new THREE.MeshBasicMaterial({
      color: 0x46d12a,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xb8ffe0,
      wireframe: true,
      transparent: true,
      opacity: 0.09,
    });

    const torus = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.18, 18, 96), lineMat);
    const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(0.72, 0.14, 132, 12, 2, 3), glowMat);
    const node = new THREE.Mesh(new THREE.IcosahedronGeometry(0.44, 2), lineMat.clone());
    node.position.set(1.25, -0.45, 0.35);
    scene.add(torus, knot, node);

    const resize = () => {
      const rect = el.getBoundingClientRect();
      renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false);
      camera.aspect = Math.max(1, rect.width) / Math.max(1, rect.height);
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    let raf = 0;
    const startedAt = performance.now();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = (performance.now() - startedAt) / 1000;
      torus.rotation.x = 0.9 + Math.sin(t * 0.35) * 0.12;
      torus.rotation.y = t * 0.18;
      knot.rotation.x = t * -0.22;
      knot.rotation.y = t * 0.32;
      node.rotation.x = t * 0.4;
      node.rotation.y = t * 0.25;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      torus.geometry.dispose();
      knot.geometry.dispose();
      node.geometry.dispose();
      lineMat.dispose();
      glowMat.dispose();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden />;
}

function ContactMapPanel() {
  return (
    <div className="relative min-h-[390px] overflow-hidden bg-[rgba(5,12,8,0.56)]">
      <div className="absolute inset-0 opacity-55 [background-image:linear-gradient(rgba(var(--teal-rgb),0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--teal-rgb),0.1)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_58%_44%,rgba(var(--teal-rgb),0.26),transparent_48%)]" />
      <svg viewBox="0 0 520 360" className="absolute inset-0 h-full w-full" fill="none" aria-hidden>
        <path d="M42 254 C116 190 168 214 224 154 S340 70 458 110" stroke="rgba(184,255,224,0.42)" strokeWidth="1.4" />
        <path d="M66 118 C126 154 194 104 252 134 S354 216 470 178" stroke="rgba(70,209,42,0.34)" strokeWidth="1.2" />
        <path d="M110 306 C178 244 260 268 330 224 S410 154 492 220" stroke="rgba(70,174,34,0.3)" strokeWidth="1" />
        <circle cx="296" cy="176" r="46" stroke="rgba(184,255,224,0.22)" />
        <circle cx="296" cy="176" r="18" fill="rgba(70,209,42,0.22)" stroke="rgba(184,255,224,0.64)" />
        <circle cx="296" cy="176" r="4" fill="#b8ffe0" />
      </svg>
      <div className="absolute left-5 top-5 font-mono text-[0.5rem] uppercase tracking-[0.3em] text-[var(--teal)]">
        Studio signal / remote-first
      </div>
      <div className="absolute bottom-5 left-5 right-5 rounded-[0.7rem] border border-[rgba(var(--teal-rgb),0.16)] bg-[rgba(0,0,0,0.36)] p-4 backdrop-blur-md">
        <p className="font-mono text-[0.52rem] uppercase tracking-[0.24em] text-[var(--teal)]">Location</p>
        <p className="mt-2 text-[0.92rem] leading-[1.65] text-[rgba(240,236,227,0.72)]">
          Remote studio. Available for projects across time zones.
        </p>
      </div>
    </div>
  );
}

function DirectContactSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      sectionRef.current?.querySelectorAll("[data-direct-in]") ?? [],
      { autoAlpha: 0, y: 32 },
      {
        autoAlpha: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative z-10 px-4 py-20 md:py-28">
      <div
        data-direct-in
        className="relative z-10 mx-auto grid w-full max-w-[1180px] overflow-hidden border border-[rgba(var(--teal-rgb),0.2)] bg-[rgba(3,9,8,0.62)] backdrop-blur-xl lg:grid-cols-[0.45fr_0.55fr]"
        style={{ borderRadius: "1.25rem", boxShadow: "0 32px 110px rgba(0,0,0,0.26), inset 0 1px 0 rgba(255,255,255,0.04)" }}
      >
        <div className="relative flex min-h-[390px] flex-col justify-between p-6 md:p-8">
          <div className="pointer-events-none absolute inset-y-8 right-0 w-px bg-[linear-gradient(transparent,rgba(var(--teal-rgb),0.28),transparent)]" />
          <div>
            <h2 className="hed text-[clamp(3.2rem,6vw,6.4rem)] leading-[0.86]">
              Need help<br />
              <span className="text-[var(--teal)]">or support?</span>
            </h2>
            <p className="mt-7 max-w-[470px] text-[0.98rem] leading-[1.85] text-[var(--body)]">
              Questions, fixes, partnerships, and existing project requests all start here. The map and contact lines stay together so the next step is easy to scan.
            </p>
          </div>
          <div className="mt-8 grid gap-3">
            {[
              ["Email", "HELLO@NOXDEVS.COM", "M18 8 12 13 6 8M5 6h14v12H5z"],
              ["Phone", "+1 555 123 4567", "M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2 3.6 1.1v3.2c0 .8-.7 1.5-1.5 1.5C9.5 21 3 14.5 3 6.5 3 5.7 3.7 5 4.5 5h3.2l1.1 3.6-2.2 2.2z"],
              ["Reply window", "Within 24 hours", "M12 6v6l4 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"],
            ].map(([label, value, path]) => (
              <div key={label} className="grid grid-cols-[2.3rem_1fr] items-center gap-3 border-t border-[rgba(var(--teal-rgb),0.12)] pt-3">
                <div className="grid h-9 w-9 place-items-center rounded-full border border-[rgba(var(--teal-rgb),0.2)] bg-[rgba(var(--teal-rgb),0.07)] text-[var(--teal)]">
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d={path} />
                  </svg>
                </div>
                <div>
                  <p className="font-mono text-[0.46rem] uppercase tracking-[0.24em] text-[rgba(var(--teal-rgb),0.86)]">{label}</p>
                  <p className="mt-1 text-[0.9rem] text-[rgba(240,236,227,0.72)]">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <ContactMapPanel />
      </div>
    </section>
  );
}
