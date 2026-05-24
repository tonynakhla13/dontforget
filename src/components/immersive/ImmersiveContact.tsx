"use client";

/**
 * ImmersiveContact
 *
 * Single-viewport contact experience for the immersive mode.
 *
 * Message / voice first, then a compact contact details popup on Send.
 */

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
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

function VoiceHero({ onRecorded }: { onRecorded: (clips: Blob[]) => void }) {
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
  useEffect(() => () => {
    if (tick.current) clearInterval(tick.current);
    clipsRef.current.forEach(clip => URL.revokeObjectURL(clip.url));
  }, []);

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
        setClips(prev => {
          if (prev.length >= maxClips) {
            URL.revokeObjectURL(clip.url);
            return prev;
          }
          const next = [...prev, clip];
          onRecorded(next.map(item => item.blob));
          return next;
        });
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
    setClips(prev => {
      const next = prev.filter(clip => clip.id !== id);
      onRecorded(next.map(item => item.blob));
      return next;
    });
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
        alignItems: clips.length ? "flex-start" : "center",
        width: clips.length ? "min(430px, calc(100% - 220px))" : "100%",
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
              border: "1px solid rgba(58,191,138,0.5)", pointerEvents: "none" }} />
          <div ref={ring2}
            style={{ position: "absolute", inset: 0, borderRadius: "50%",
              border: "1px solid rgba(58,191,138,0.38)", pointerEvents: "none" }} />
          <div ref={ring3}
            style={{ position: "absolute", inset: 0, borderRadius: "50%",
              border: "1px solid rgba(58,191,138,0.26)", pointerEvents: "none" }} />
          {/* Button */}
          <button type="button"
            onClick={state === "idle" ? start : stop}
            className="relative flex items-center justify-center rounded-full transition-all duration-300 hover:scale-105"
            disabled={state === "idle" && !canRecord}
            style={{
              width: clips.length ? 62 : 80, height: clips.length ? 62 : 80,
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
                  border: `1px solid ${active ? "rgba(58,191,138,0.46)" : "rgba(58,191,138,0.16)"}`,
                  background: active
                    ? "linear-gradient(90deg,rgba(58,191,138,0.13),rgba(58,191,138,0.035))"
                    : "rgba(3,8,6,0.52)",
                  boxShadow: active ? "0 0 24px rgba(58,191,138,0.08)" : "none",
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
                    border: "1px solid rgba(58,191,138,0.36)",
                    background: "rgba(58,191,138,0.12)",
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
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            border: 0,
            background: "transparent",
            color: "var(--teal)",
            fontFamily: "var(--font-mono-next)",
            fontSize: "0.48rem",
            letterSpacing: "0.30em",
            textTransform: "uppercase",
          }}>
          <span style={{ fontSize: "0.8rem", lineHeight: 1 }}>+</span>
          Record another
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
      color: 0x5de7b4,
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
   GUIDED FORM BUTTON
───────────────────────────────────────────────────────────────────────── */
function GuidedTextButton({ onClick }: { onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = ref.current; if (!el) return;
    gsap.fromTo(el,
      { autoAlpha: 0, y: 18 },
      { autoAlpha: 1, y: 0, duration: 0.78, ease: "power3.out", delay: 0.35 }
    );
    gsap.fromTo(lineRef.current,
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 0.9, ease: "power3.out", delay: 0.55 }
    );
    gsap.to(arrowRef.current, {
      x: 5,
      duration: 0.75,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
      delay: 1.1,
    });
    el.addEventListener("mouseenter", () => {
      gsap.to(el, { opacity: 1, duration: 0.25 });
      gsap.to(lineRef.current, { opacity: 0.85, scaleX: 1.08, duration: 0.35, ease: "power2.out" });
      gsap.to(arrowRef.current, { x: 10, duration: 0.25, ease: "power2.out" });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(el, { opacity: 0.9, duration: 0.25 });
      gsap.to(lineRef.current, { opacity: 0.48, scaleX: 1, duration: 0.35 });
      gsap.to(arrowRef.current, { x: 5, duration: 0.25 });
    });
  }, []);

  return (
    <button ref={ref} type="button" onClick={onClick}
      className="group"
      style={{
        width: "100%",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem",
        padding: "1rem 1.1rem",
        border: "1px solid rgba(58,191,138,0.18)",
        borderRadius: "0.95rem",
        background: "linear-gradient(145deg,rgba(58,191,138,0.13),rgba(58,191,138,0.045))",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.035), 0 18px 44px rgba(0,0,0,0.16)",
        cursor: "pointer", position: "relative",
        textAlign: "left",
        opacity: 0.9,
      }}>

      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "1rem", minWidth: 0 }}>
        <div style={{ minWidth: 0 }}>
          <span style={{
            display: "block",
            fontFamily: "var(--font-mono-next)", fontSize: "0.56rem",
            letterSpacing: "0.38em", textTransform: "uppercase", color: "var(--teal)",
            lineHeight: 1.1, marginBottom: "0.4rem",
          }}>
            guided alternative
          </span>
          <span className="hed" style={{
            display: "block",
            color: "var(--teal)",
            fontSize: "clamp(1.45rem,2.25vw,2.35rem)",
            lineHeight: 0.92,
            letterSpacing: 0,
          }}>
            Try our new way
          </span>
          <span style={{
            display: "block",
            marginTop: "0.35rem",
            color: "rgba(240,236,227,0.68)",
            fontSize: "0.88rem",
            lineHeight: 1.45,
          }}>
            A sharper project brief when a blank message is not enough.
          </span>
        </div>
      </div>

      <svg ref={arrowRef} width={22} height={22} viewBox="0 0 24 24" fill="none"
        stroke="var(--teal)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
        style={{ position: "relative", zIndex: 1, flexShrink: 0 }}>
        <path d="M12 5l7 7-7 7M5 12h14" />
      </svg>
      <span ref={lineRef} aria-hidden style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 1,
        opacity: 0.48,
        background: "linear-gradient(90deg,var(--teal),rgba(58,191,138,0.14),transparent)",
      }} />
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   STEP-BY-STEP MODAL — fixed to the viewport
───────────────────────────────────────────────────────────────────────── */
function StepModal({ onClose }: { onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

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
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        display: "grid", placeItems: "center",
        padding: "clamp(0.75rem,2vw,1.5rem)",
        background: "rgba(0,0,0,0.76)",
        backdropFilter: "blur(18px)",
      }}>
      <div ref={panelRef}
        style={{
          width: "min(960px, calc(100vw - 2rem))",
          height: "min(680px, calc(100dvh - 2rem))",
          maxHeight: "calc(100dvh - 2rem)",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          borderRadius: "1.25rem",
          border: "1px solid rgba(58,191,138,0.18)",
          background: "linear-gradient(145deg,rgba(8,13,11,0.98),rgba(4,6,5,0.98))",
          boxShadow: "0 28px 90px rgba(0,0,0,0.48), 0 0 60px rgba(58,191,138,0.08)",
        }}>
        {/* Header bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0.85rem 1.1rem", borderBottom: "1px solid var(--border)",
          flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
            {[1,2,3].map(n => (
              <div key={n} style={{ width: 6, height: 6, borderRadius: "50%",
                background: "var(--teal)", opacity: 0.3 + n * 0.2,
                boxShadow: "0 0 6px rgba(58,191,138,0.4)", flexShrink: 0 }} />
            ))}
            <span style={{ fontFamily: "var(--font-mono-next)", fontSize: "0.46rem",
              letterSpacing: "0.34em", textTransform: "uppercase", color: "var(--teal)",
              marginLeft: "0.25rem", whiteSpace: "nowrap" }}>
              3-step form
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

        {/* Embedded form content */}
        <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
          <RequestForm embedded />
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
  const sideRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [method, setMethod] = useState<ContactMethod>("whatsapp");
  const [value, setValue] = useState("");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [assets, setAssets] = useState<string[]>([]);

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 });
    gsap.fromTo(panelRef.current,
      { autoAlpha: 0, y: 24, scale: 0.98 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.42, ease: "power3.out" });
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    if (!advancedOpen || !sideRef.current) return;
    gsap.fromTo(sideRef.current,
      { autoAlpha: 0, x: 28 },
      { autoAlpha: 1, x: 0, duration: 0.42, ease: "power3.out" }
    );
  }, [advancedOpen]);

  function close() {
    gsap.to(panelRef.current, { autoAlpha: 0, y: 18, scale: 0.98, duration: 0.22, ease: "power2.in" });
    gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.25, onComplete: onClose });
  }

  const contactLabel = method === "email" ? "Email address" : method === "whatsapp" ? "WhatsApp number" : "Phone number";
  const contactPlaceholder = method === "email" ? "hello@you.com" : "+1 555 123 4567";
  const canSubmit = name.trim().length > 1 && value.trim().length > 3 && !submitting;

  return (
    <div ref={overlayRef}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        display: "grid", placeItems: "center",
        padding: "1rem",
        background: "rgba(0,0,0,0.72)",
        backdropFilter: "blur(18px)",
      }}>
      <form ref={panelRef}
        onSubmit={e => {
          e.preventDefault();
          if (!canSubmit) return;
          onSubmit({ name: name.trim(), method, value: value.trim(), assets });
        }}
        style={{
          width: advancedOpen ? "min(900px, calc(100vw - 2rem))" : "min(520px, calc(100vw - 2rem))",
          borderRadius: "1.15rem",
          border: "1px solid rgba(58,191,138,0.2)",
          background: "linear-gradient(145deg,rgba(8,13,11,0.98),rgba(4,6,5,0.98))",
          boxShadow: "0 28px 90px rgba(0,0,0,0.48), 0 0 60px rgba(58,191,138,0.08)",
          padding: "1.2rem",
          maxHeight: "calc(100dvh - 2rem)",
          overflowY: "auto",
          overflowX: "hidden",
        }}>
        <div className={`grid gap-5 ${advancedOpen ? "md:grid-cols-[minmax(0,1fr)_minmax(260px,320px)]" : ""}`}
          style={{ alignItems: "stretch" }}>
          <div>
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="eyebrow" style={{ marginBottom: "0.45rem" }}>Where should we reply?</p>
                <h2 className="hed" style={{ fontSize: "clamp(1.75rem,4vw,2.55rem)", lineHeight: 0.95 }}>
                  Contact details.
                </h2>
              </div>
              <button type="button" onClick={close}
                aria-label="Close contact details"
                style={{
                  width: 34, height: 34, borderRadius: "50%",
                  border: "1px solid var(--border)",
                  color: "var(--body)", display: "grid", placeItems: "center",
                  flexShrink: 0,
                }}>
                <svg width={11} height={11} viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-7 grid gap-4">
              <ModalField label="Name" value={name} onChange={setName} placeholder="Tony Nakhla" autoComplete="name" />

              <div>
                <label style={{ display: "block", fontFamily: "var(--font-mono-next)", fontSize: "0.48rem",
                  letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--body)",
                  opacity: 0.62, marginBottom: "0.55rem" }}>
                  Contact method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    ["whatsapp", "WhatsApp"],
                    ["phone", "Phone"],
                    ["email", "Email"],
                  ] as const).map(([id, label]) => {
                    const active = method === id;
                    return (
                      <button key={id} type="button" onClick={() => setMethod(id)}
                        style={{
                          borderRadius: 999,
                          border: `1px solid ${active ? "rgba(58,191,138,0.65)" : "var(--border)"}`,
                          background: active ? "rgba(58,191,138,0.16)" : "rgba(255,255,255,0.02)",
                          color: active ? "var(--teal)" : "var(--body)",
                          padding: "0.72rem 0.5rem",
                          fontFamily: "var(--font-mono-next)",
                          fontSize: "0.58rem",
                          letterSpacing: "0.16em",
                          textTransform: "uppercase",
                        }}>
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <ModalField
                label={contactLabel}
                value={value}
                onChange={setValue}
                placeholder={contactPlaceholder}
                autoComplete={method === "email" ? "email" : "tel"}
                type={method === "email" ? "email" : "tel"}
              />
            </div>

            <button type="button" onClick={() => setAdvancedOpen(open => !open)}
              className="mt-5"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                border: "1px solid rgba(58,191,138,0.14)",
                borderRadius: "0.8rem",
                background: advancedOpen ? "rgba(58,191,138,0.10)" : "rgba(255,255,255,0.018)",
                padding: "0.8rem 0.9rem",
                textAlign: "left",
              }}>
              <span>
                <span style={{
                  display: "block",
                  fontFamily: "var(--font-mono-next)",
                  fontSize: "0.48rem",
                  letterSpacing: "0.34em",
                  textTransform: "uppercase",
                  color: "var(--teal)",
                  marginBottom: "0.32rem",
                }}>
                  Advanced info
                </span>
                <span style={{ display: "block", color: "rgba(240,236,227,0.58)", fontSize: "0.82rem", lineHeight: 1.4 }}>
                  Share a logo, company profile, deck, or useful assets.
                </span>
              </span>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none"
                stroke="var(--teal)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: advancedOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s", flexShrink: 0 }}>
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>

            {submitError && (
              <p className="mt-4 text-sm text-red-400">Something went wrong. Try again or email hello@dontforget.studio.</p>
            )}

            <div className="mt-7 flex justify-end">
              <button type="submit" disabled={!canSubmit}
                className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-40"
                style={{ paddingInline: "1.8rem", paddingBlock: "0.78rem", fontSize: "0.82rem" }}>
                {submitting ? "Sending..." : "Send request ->"}
              </button>
            </div>
          </div>

          {advancedOpen && (
            <div ref={sideRef}
              style={{
                borderRadius: "0.95rem",
                border: "1px solid rgba(58,191,138,0.18)",
                background: "linear-gradient(180deg,rgba(58,191,138,0.075),rgba(255,255,255,0.018))",
                padding: "1rem",
                minHeight: "100%",
              }}>
              <p className="eyebrow" style={{ marginBottom: "0.55rem" }}>Optional assets</p>
              <h3 className="hed" style={{ fontSize: "1.45rem", lineHeight: 0.96, marginBottom: "0.65rem" }}>
                Add context.
              </h3>
              <p style={{ color: "rgba(240,236,227,0.56)", fontSize: "0.82rem", lineHeight: 1.55 }}>
                Upload a logo, brand guide, company profile, pitch deck, screenshots, or anything useful.
              </p>

              <label className="mt-5 flex cursor-pointer flex-col items-center justify-center gap-3"
                style={{
                  minHeight: 138,
                  borderRadius: "0.9rem",
                  border: "1px dashed rgba(58,191,138,0.36)",
                  background: "rgba(0,0,0,0.18)",
                  color: "var(--teal)",
                  textAlign: "center",
                }}>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.key,.zip"
                  className="sr-only"
                  onChange={event => {
                    const selected = Array.from(event.target.files ?? []).map(file => file.name);
                    setAssets(selected.slice(0, 6));
                  }}
                />
                <svg width={26} height={26} viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v12" />
                  <path d="m7 8 5-5 5 5" />
                  <path d="M5 15v3a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-3" />
                </svg>
                <span style={{
                  fontFamily: "var(--font-mono-next)",
                  fontSize: "0.52rem",
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                }}>
                  Upload files
                </span>
              </label>

              {assets.length > 0 && (
                <div className="mt-4 grid gap-2">
                  {assets.map(asset => (
                    <div key={asset}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "0.75rem",
                        borderRadius: "0.55rem",
                        background: "rgba(0,0,0,0.18)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        padding: "0.55rem 0.65rem",
                      }}>
                      <span style={{
                        minWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: "rgba(240,236,227,0.68)",
                        fontSize: "0.78rem",
                      }}>
                        {asset}
                      </span>
                      <span style={{ color: "var(--teal)", fontSize: "0.7rem" }}>ready</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────── */
export default function ImmersiveContact() {
  const [voiceClips, setVoiceClips] = useState<Blob[]>([]);
  const [form, setForm]     = useState({ message: "" });
  const [sub, setSub]       = useState(false);
  const [done, setDone]     = useState(false);
  const [err, setErr]       = useState(false);
  const [modal, setModal]   = useState(false);
  const [contactModal, setContactModal] = useState(false);
  const [showMessageSuggestions, setShowMessageSuggestions] = useState(false);

  const sectionRef  = useRef<HTMLElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (!hasPayload || !ctaRef.current) return;
    gsap.fromTo(ctaRef.current,
      { autoAlpha: 0, x: 54, scale: 0.98 },
      { autoAlpha: 1, x: 0, scale: 1, duration: 0.55, ease: "power3.out" }
    );
  }, [hasPayload]);

  async function handleSubmit(details: ContactDetails) {
    if (!hasPayload) return;
    setSub(true); setErr(false);
    try {
      const message = hasMessage ? form.message.trim() : `${voiceClips.length} voice note${voiceClips.length === 1 ? "" : "s"} attached.`;
      const contactLine = `Preferred contact: ${details.method} | ${details.value}`;
      const voiceLine = hasVoice
        ? `\n\n[${voiceClips.length} voice note${voiceClips.length === 1 ? "" : "s"} attached]`
        : "";
      const assetLine = details.assets.length
        ? `\n\nShared assets:\n${details.assets.map(asset => `- ${asset}`).join("\n")}`
        : "";
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: details.name,
          email: details.method === "email" ? details.value : `${details.method}@dontforget.local`,
          projectType: "Open inquiry",
          message: `${message}${voiceLine}${assetLine}\n\n${contactLine}`,
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
        minHeight: "calc(100dvh - 86px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "clamp(5.25rem,10vh,6.5rem) clamp(1rem,3vw,2.5rem) clamp(1rem,2.5vh,1.75rem)",
        position: "relative", overflow: "visible",
      }}>

      {/* Ambient glow */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 55% 65% at 25% 50%, rgba(58,191,138,0.05) 0%, transparent 65%)" }} />

      {/* ══════════ LEFT: heading / RIGHT: form ══════════ */}
      <div className="grid gap-8 lg:grid-cols-[0.42fr_0.58fr] lg:items-center"
        style={{ width: "100%", maxWidth: 1180, minWidth: 0, zIndex: 1 }}>

        <div data-in style={{ opacity: 0 }}>
          <p className="eyebrow" style={{ marginBottom: "0.6rem" }}>Immersive contact</p>
          <h1 className="hed" style={{ fontSize: "clamp(2.35rem,5.8vw,5.4rem)", lineHeight: 0.88 }}>
            Start with<br />
            <span style={{ color: "var(--teal)" }}>the signal.</span>
          </h1>
          <p style={{ marginTop: "1.1rem", maxWidth: 440, color: "rgba(240,236,227,0.72)",
            fontSize: "clamp(0.95rem,1.4vw,1.06rem)", lineHeight: 1.75 }}>
            Write a message, record a voice note, or use the guided brief.
          </p>
        </div>

        <form onSubmit={e => e.preventDefault()}
          style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: "0.85rem" }}>

          <div data-in className="grid gap-4" style={{ opacity: 0 }}>

            <div style={{ minHeight: "clamp(330px,48vh,390px)", minWidth: 0, display: "flex", flexDirection: "column",
              borderRadius: "1rem", overflow: "hidden",
              border: "1px solid rgba(58,191,138,0.20)",
              background: "linear-gradient(145deg,rgba(15,20,18,0.92),rgba(8,9,9,0.86))",
              backdropFilter: "blur(12px)",
              position: "relative",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.035), 0 24px 60px rgba(0,0,0,0.22)" }}>
              <div style={{ position: "absolute", inset: "0 0 auto 0", height: 1,
                background: "linear-gradient(90deg,transparent,rgba(58,191,138,0.35),transparent)" }} />
              <FormShapeVisualizer />
              <textarea
                placeholder="Describe the project, idea, problem, or dream. Voice-only is fine too."
                value={form.message}
                onFocus={() => setShowMessageSuggestions(true)}
                onClick={() => setShowMessageSuggestions(true)}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                style={{ flex: 1, minHeight: 0, resize: "none", background: "transparent",
                  border: "none", outline: "none",
                  padding: "1.2rem 1.25rem 0.8rem",
                  color: "var(--fg)", fontSize: "1rem",
                  fontFamily: "inherit", lineHeight: 1.75,
                  position: "relative", zIndex: 1 }} />
              {showMessageSuggestions && (
                <div className="flex flex-wrap gap-2 px-5 pb-4" style={{ position: "relative", zIndex: 2 }}>
                  {messageSuggestions.map(sentence => (
                    <button key={sentence} type="button"
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => setForm(f => ({ ...f, message: f.message.trim() ? `${f.message}\n${sentence}` : sentence }))}
                      style={{
                        borderRadius: 999,
                        border: "1px solid rgba(58,191,138,0.16)",
                        background: "rgba(58,191,138,0.055)",
                        color: "rgba(240,236,227,0.58)",
                        padding: "0.42rem 0.65rem",
                        fontSize: "0.72rem",
                        lineHeight: 1.25,
                      }}>
                      {sentence}
                    </button>
                  ))}
                </div>
              )}
              <div style={{
                position: "relative", zIndex: 1,
                minHeight: 142,
                background: "linear-gradient(180deg,rgba(58,191,138,0.035),rgba(4,7,6,0.5))",
              }}>
                <VoiceHero onRecorded={setVoiceClips} />
              </div>

              {hasPayload && (
                <div ref={ctaRef}
                  style={{
                    position: "absolute",
                    right: "clamp(0.75rem,2vw,1.15rem)",
                    bottom: "clamp(0.75rem,2vw,1.15rem)",
                    zIndex: 4,
                    opacity: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.65rem",
                    padding: "0.34rem",
                    borderRadius: 999,
                    border: "1px solid rgba(58,191,138,0.22)",
                    background: "rgba(3,7,6,0.78)",
                    backdropFilter: "blur(16px)",
                    boxShadow: "0 18px 48px rgba(0,0,0,0.28), 0 0 30px rgba(58,191,138,0.10)",
                  }}>
                  <button type="button"
                    onClick={() => setContactModal(true)}
                    className="btn btn-primary"
                    style={{
                      paddingInline: "clamp(1.45rem,3vw,2rem)",
                      paddingBlock: "0.82rem",
                      fontSize: "0.82rem",
                      boxShadow: "0 0 0 6px rgba(58,191,138,0.08)",
                    }}>
                    Send →
                  </button>
                </div>
              )}
            </div>

            <GuidedTextButton onClick={() => setModal(true)} />

          </div>

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
  );
}

/* Small input helper */
function ModalField({ label, type = "text", placeholder, value, onChange, autoComplete }: {
  label: string; type?: string; placeholder: string;
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
