"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import Link from "next/link";

// ─── Data ────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id: "webdev",
    num: "01",
    title: "Web Dev",
    tagline: "Landing pages, dashboards & web apps",
    examples: ["Landing pages", "Commercial sites", "Blogs", "Portfolios", "Dashboards", "Web apps"],
  },
  {
    id: "uiux",
    num: "02",
    title: "UI / UX",
    tagline: "Design systems, flows & prototypes",
    examples: ["Wireframes", "Design systems", "User flows", "Prototypes", "Usability tests", "Product UX"],
  },
  {
    id: "ecomm",
    num: "03",
    title: "E-Commerce",
    tagline: "Shopify, WooCommerce & custom stores",
    examples: ["Shopify", "WooCommerce", "Salla", "Product pages", "Checkout", "Subscriptions"],
  },
  {
    id: "mobile",
    num: "04",
    title: "Mobile",
    tagline: "iOS, Android & React Native apps",
    examples: ["iOS", "Android", "React Native", "Onboarding", "Push flows", "App systems"],
  },
  {
    id: "seo",
    num: "05",
    title: "SEO",
    tagline: "Technical SEO, AI search & content plans",
    examples: ["Technical SEO", "Content plans", "AI search", "Local SEO", "Audits", "Reporting"],
  },
  {
    id: "crm",
    num: "06",
    title: "CRM",
    tagline: "Booking systems, pipelines & automations",
    examples: ["Bookings", "Pipelines", "Dashboards", "Automations", "Permissions", "Integrations"],
  },
];

const TIMELINES = ["ASAP", "1–3 months", "3–6 months", "Flexible"];
const BUDGETS   = ["< $5k", "$5–15k", "$15–50k", "$50k+"];

// ─── Icons ────────────────────────────────────────────────────────────────────

function ServiceIcon({ id }: { id: string }) {
  const props = {
    className: "h-7 w-7",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const map: Record<string, React.ReactNode> = {
    webdev: <svg {...props}><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 20h8" /><path d="M12 17v3" /><path d="M7 9l2.5 2L7 13" /><path d="M12 13h4" /></svg>,
    uiux:   <svg {...props}><rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="8" rx="1.5" /><rect x="3" y="13" width="8" height="8" rx="1.5" /><rect x="13" y="13" width="8" height="8" rx="1.5" /></svg>,
    ecomm:  <svg {...props}><path d="M3 5h2l2.4 10.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.5L21 8H7" /><circle cx="10" cy="20" r="1.2" /><circle cx="18" cy="20" r="1.2" /></svg>,
    mobile: <svg {...props}><rect x="7" y="2" width="10" height="20" rx="2.5" /><path d="M11 18h2" /><path d="M10 6h4" /></svg>,
    seo:    <svg {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-4.5-4.5" /><path d="M11 8v3l2 1" /></svg>,
    crm:    <svg {...props}><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M8.5 12h7" /><path d="m15.5 7.5 1 2.5" /><path d="m15.5 16.5 1-2.5" /></svg>,
  };
  return <>{map[id]}</>;
}

// ─── Check icon for selected pills ───────────────────────────────────────────

function Check() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormData {
  serviceIds:  string[];
  subServices: string[];
  timeline:    string;
  budget:      string;
  name:        string;
  email:       string;
  note:        string;
}

// ─── Component ───────────────────────────────────────────────────────────────

type GuidedVoiceClip = {
  id: string;
  blob: Blob;
  duration: number;
};

async function uploadVoiceClip(blob: Blob, index: number) {
  const formData = new FormData();
  formData.append("file", blob, `guided-voice-note-${index + 1}.webm`);

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

async function uploadInquiryFile(file: File) {
  const formData = new FormData();
  formData.append("file", file, file.name);

  try {
    const response = await fetch("/api/inquiries/files", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) return null;
    const data = await response.json() as { name?: string; url?: string };
    return data.name && data.url ? { name: data.name, url: data.url } : null;
  } catch {
    return null;
  }
}

type RequestFormHeaderMeta = {
  counter: string;
  label: string;
};

export default function RequestForm({
  embedded = false,
  onHeaderMetaChange,
  onBack,
}: {
  embedded?: boolean;
  onHeaderMetaChange?: (meta: RequestFormHeaderMeta) => void;
  onBack?: () => void;
} = {}) {
  const [step, setStep]     = useState(1);
  const [dir,  setDir]      = useState<1 | -1>(1);
  const [data, setData]     = useState<FormData>({
    serviceIds: [], subServices: [], timeline: "", budget: "", name: "", email: "", note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [done, setDone]     = useState(false);
  const [assetFiles, setAssetFiles] = useState<File[]>([]);
  const [voiceClips, setVoiceClips] = useState<GuidedVoiceClip[]>([]);

  const contentRef  = useRef<HTMLDivElement>(null);
  const barRef      = useRef<HTMLDivElement>(null);

  const selectedServices = SERVICES.filter(s => data.serviceIds.includes(s.id));
  const selectedServiceTitle = selectedServices.map(service => service.title).join(" + ");

  useEffect(() => {
    if (!embedded || !onHeaderMetaChange) return;
    onHeaderMetaChange({
      counter: done ? "Complete" : `0${step} / 03`,
      label: done
        ? "Complete"
        : step === 1
          ? "Start a project"
          : step === 2
            ? selectedServiceTitle || "Scope"
            : "Almost there",
    });
  }, [done, embedded, onHeaderMetaChange, selectedServiceTitle, step]);

  // ── Animate step enter ──────────────────────────────────────────────────
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { x: dir === 1 ? 44 : -44, autoAlpha: 0 },
      { x: 0, autoAlpha: 1, duration: 0.34, ease: "power2.out" }
    );
  }, [step, done, dir]);

  // ── Animate progress bar ────────────────────────────────────────────────
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    if (done) { gsap.to(bar, { width: "100%", duration: 0.6, ease: "power2.out" }); return; }
    const pct = step === 1 ? 0 : step === 2 ? 33 : 67;
    gsap.to(bar, { width: `${pct}%`, duration: 0.5, ease: "power2.out" });
  }, [step, done]);

  // ── Keyboard navigation ─────────────────────────────────────────────────
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter" && canAdvance && !done) { e.preventDefault(); advance(); }
      if (e.key === "Escape" && step > 1 && !done)  { e.preventDefault(); goBack(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // ── Navigation helpers ──────────────────────────────────────────────────
  function navigate(next: number, direction: 1 | -1) {
    setDir(direction);
    const el = contentRef.current;
    gsap.to(el, {
      x: direction === 1 ? -44 : 44,
      autoAlpha: 0,
      duration: 0.22,
      ease: "power2.in",
      onComplete: () => setStep(next),
    });
  }

  const canAdvance =
    step === 1 ? data.serviceIds.length > 0 :
    step === 2 ? data.subServices.length > 0 && !!data.timeline && !!data.budget :
    step === 3 ? !!data.name.trim() && !!data.email.trim() : false;

  function advance() {
    if (!canAdvance) return;
    if (step < 3) { navigate(step + 1, 1); return; }
    handleSubmit();
  }

  function goBack() {
    if (step === 1) {
      if (embedded && onBack) {
        onBack();
        return;
      }
      window.location.href = "/";
      return;
    }
    navigate(step - 1, -1);
  }

  // ── Sub-service toggle ──────────────────────────────────────────────────
  function toggleSub(ex: string) {
    setData(d => ({
      ...d,
      subServices: d.subServices.includes(ex)
        ? d.subServices.filter(s => s !== ex)
        : [...d.subServices, ex],
    }));
  }

  function toggleAll() {
    const all = Array.from(new Set(selectedServices.flatMap(item => item.examples)));
    setData(d => ({
      ...d,
      subServices: d.subServices.length === all.length ? [] : [...all],
    }));
  }

  // ── Submit ──────────────────────────────────────────────────────────────
  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(false);
    const serviceTitles = selectedServices.map(item => item.title).join(", ");
    const projectType = `${serviceTitles} — ${data.subServices.join(", ")}`;
    try {
      const audioUploads = voiceClips.length
        ? await Promise.all(voiceClips.map((clip, index) => uploadVoiceClip(clip.blob, index)))
        : [];
      const audioUrls = audioUploads.filter((url): url is string => Boolean(url));
      const failedAudioCount = voiceClips.length - audioUrls.length;
      const fileUploads = assetFiles.length
        ? await Promise.all(assetFiles.map(file => uploadInquiryFile(file)))
        : [];
      const uploadedFiles = fileUploads.filter((file): file is { name: string; url: string } => Boolean(file));
      const failedFileCount = assetFiles.length - uploadedFiles.length;
      const assetNames = uploadedFiles.map(file => file.name);
      const assetLine = uploadedFiles.length
        ? `\n\nShared files:\n${uploadedFiles.map(file => `- ${file.name}: ${file.url}`).join("\n")}`
        : "";
      const voiceLine = voiceClips.length
        ? `\n\nVoice notes: ${audioUrls.length} uploaded${failedAudioCount ? `, ${failedAudioCount} failed to upload` : ""}`
        : "";
      const message = `Timeline: ${data.timeline} | Budget: ${data.budget}${data.note ? `\n\n${data.note}` : ""}${voiceLine}${assetLine}`;
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          projectType,
          message,
          source: "guided-request",
          audioUrls,
          assetNames,
          metadata: {
            serviceIds: data.serviceIds,
            services: selectedServices.map(item => item.title),
            subServices: data.subServices,
            timeline: data.timeline,
            budget: data.budget,
            assetCount: uploadedFiles.length,
            failedFileCount,
            assetUrls: uploadedFiles,
            voiceCount: audioUrls.length,
            failedAudioCount,
          },
        }),
      });
      if (res.ok) {
        setDir(1);
        const el = contentRef.current;
        gsap.to(el, {
          x: -44, autoAlpha: 0, duration: 0.22, ease: "power2.in",
          onComplete: () => setDone(true),
        });
      } else {
        setSubmitError(true);
        setSubmitting(false);
      }
    } catch {
      setSubmitError(true);
      setSubmitting(false);
    }
  }

  // ── Shared style strings ────────────────────────────────────────────────
  const field =
    "w-full rounded-xl border border-[var(--border)] bg-[var(--surface2)] px-5 py-4 text-[var(--fg)] outline-none placeholder:text-[#444] transition-all duration-200 focus:border-[var(--teal-mid)] focus:bg-[var(--teal-faint)]";
  const label =
    "block font-mono text-[0.58rem] uppercase tracking-[0.32em] text-[var(--body)] mb-2.5";

  // ════════════════════════════════════════════════════════════════════════
  //  Render
  // ════════════════════════════════════════════════════════════════════════
  return (
    <div className={embedded
      ? "relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-transparent"
      : "relative flex min-h-screen flex-col overflow-x-hidden bg-[var(--bg)]"}>
      <div className="noise" />

      {/* ── Progress bar ── */}
      <div className={`${embedded ? "absolute top-0" : "fixed top-[72px]"} left-0 right-0 z-40 h-[2px] bg-[var(--border)] transition-opacity duration-500 ${step === 1 && !done ? "opacity-0" : "opacity-100"}`}>
        <div ref={barRef} className="h-full rounded-full bg-[var(--teal)]" style={{ width: "0%" }} />
      </div>

      {/* ── Step counter (hidden on step 1) ── */}
      <div className={`${embedded ? "hidden" : "fixed top-[80px] flex pt-4"} left-0 right-0 z-40 justify-center transition-opacity duration-500 ${step === 1 && !done ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        <span className="font-mono text-[0.58rem] uppercase tracking-[0.38em] text-[var(--teal)]">
          {done ? "Complete" : `0${step} / 03`}
        </span>
      </div>

      {/* ── Main content ── */}
      <main className={embedded
        ? "flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-5 pb-4 pt-7"
        : "flex flex-1 flex-col items-center justify-center px-5 pb-10 pt-36"}>
        <div className="w-full max-w-[940px]">
          <div ref={contentRef}>
            {done ? (
              <SuccessScreen data={data} services={selectedServices} embedded={embedded} onBack={onBack} />
            ) : step === 1 ? (
              <Step1 data={data} setData={setData} />
            ) : step === 2 ? (
              <Step2
                services={selectedServices}
                data={data}
                setData={setData}
                onToggleSub={toggleSub}
                onToggleAll={toggleAll}
              />
            ) : (
              <Step3
                data={data}
                setData={setData}
                field={field}
                label={label}
                submitError={submitError}
                assetFiles={assetFiles}
                setAssetFiles={setAssetFiles}
                voiceClips={voiceClips}
                setVoiceClips={setVoiceClips}
              />
            )}
          </div>
        </div>
      </main>

      {/* ── Navigation ── */}
      {!done && (
        <nav className={`${embedded ? "shrink-0" : "sticky bottom-0"} z-50 flex items-center justify-between border-t border-[var(--border)] bg-[rgba(9,9,9,0.88)] px-6 py-5 backdrop-blur-xl md:px-10`}>
          <button onClick={goBack} className="btn-glass-ghost">
            <span className="btn-glass-blob" aria-hidden="true" />
            <span className="btn-glass-face">{step === 1 && !embedded ? "Home" : "Back"}</span>
          </button>

          <div className="flex items-center gap-4">
            {/* Dots */}
            <div className="flex gap-1.5">
              {[1, 2, 3].map(n => (
                <div
                  key={n}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: step === n ? "1.5rem" : "0.375rem",
                    background: step >= n ? "var(--teal)" : "var(--border)",
                  }}
                />
              ))}
            </div>

            <button
              onClick={advance}
              disabled={!canAdvance || submitting}
              className="btn-glass disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="btn-glass-blob" aria-hidden="true" />
              <span className="btn-glass-face">
                {step === 3 ? (submitting ? "Sending…" : "Send Request →") : "Continue →"}
              </span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}

// ─── Step 1: Service selection ────────────────────────────────────────────────

function Step1({
  data,
  setData,
}: {
  data: FormData;
  setData: React.Dispatch<React.SetStateAction<FormData>>;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="hed mb-3 whitespace-nowrap text-[clamp(2rem,4.2vw,3.45rem)] leading-[0.92]">
        What are you <span className="text-[var(--teal)]">building?</span>
      </h1>
      <p className="mb-6 max-w-sm text-[0.9rem] leading-[1.65] text-[var(--body)]">
        Pick every service that belongs in the project.
      </p>

      <div className="grid w-full grid-cols-2 gap-2.5 md:grid-cols-3">
        {SERVICES.map(svc => {
          const selected = data.serviceIds.includes(svc.id);
          return (
            <button
              key={svc.id}
              onClick={() => setData(d => ({
                ...d,
                serviceIds: selected
                  ? d.serviceIds.filter(id => id !== svc.id)
                  : [...d.serviceIds, svc.id],
                subServices: [],
              }))}
              className="group relative overflow-hidden rounded-xl border px-5 py-4 text-left transition-all duration-200 hover:scale-[1.015]"
              style={{
                borderColor: selected ? "var(--teal)" : "rgba(58,191,138,0.18)",
                background: selected
                  ? "rgba(58,191,138,0.07)"
                  : "linear-gradient(145deg,rgba(10,26,19,0.7) 0%,rgba(7,14,10,0.7) 100%)",
                boxShadow: selected ? "0 0 0 1px var(--teal), 0 0 28px rgba(58,191,138,0.12)" : "none",
              }}
            >
              {/* Top line accent */}
              <div
                className="absolute inset-x-0 top-0 h-px transition-opacity duration-300"
                style={{
                  background: "linear-gradient(to right, transparent, var(--teal), transparent)",
                  opacity: selected ? 0.55 : 0.18,
                }}
              />

              {/* Selected checkmark */}
              {selected && (
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--teal)] text-[var(--bg)]">
                  <Check />
                </span>
              )}

              {/* Content */}
              <div
                className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-200"
                style={{
                  background: selected ? "rgba(58,191,138,0.2)" : "rgba(58,191,138,0.1)",
                  color: "var(--teal)",
                }}
              >
                <ServiceIcon id={svc.id} />
              </div>

              <span className="mb-0.5 block font-mono text-[0.46rem] uppercase tracking-[0.42em] text-[var(--teal)] opacity-70">
                {svc.num}
              </span>
              <span className="block font-mono text-[0.74rem] font-bold uppercase tracking-[0.08em] text-[var(--fg)]">
                {svc.title}
              </span>
              <span className="mt-1 block text-[0.72rem] leading-[1.45] text-[var(--body)]">
                {svc.tagline}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 2: Scope ────────────────────────────────────────────────────────────

function Step2({
  services,
  data,
  setData,
  onToggleSub,
  onToggleAll,
}: {
  services: typeof SERVICES;
  data: FormData;
  setData: React.Dispatch<React.SetStateAction<FormData>>;
  onToggleSub: (ex: string) => void;
  onToggleAll: () => void;
}) {
  const examples = Array.from(new Set(services.flatMap(service => service.examples)));
  const allSelected = data.subServices.length === examples.length;
  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h2 className="hed mb-3 text-[clamp(2.2rem,5vw,3.65rem)] leading-[0.92]">
          What do you need?
        </h2>
        <p className="text-[0.9rem] leading-[1.6] text-[var(--body)]">
          Select everything that applies.
        </p>
      </div>

      {/* Sub-service toggles */}
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[0.58rem] uppercase tracking-[0.32em] text-[var(--body)]">
          Deliverables
        </span>
        <button
          onClick={onToggleAll}
          className="font-mono text-[0.56rem] uppercase tracking-[0.24em] text-[var(--teal)] underline underline-offset-2 transition-opacity hover:opacity-70"
        >
          {allSelected ? "Deselect all" : "Select all"}
        </button>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {examples.map(ex => {
          const on = data.subServices.includes(ex);
          return (
            <button
              key={ex}
              onClick={() => onToggleSub(ex)}
              className="flex items-center gap-2.5 rounded-xl border px-4 py-3 text-left transition-all duration-150"
              style={{
                borderColor:  on ? "var(--teal)"        : "var(--border)",
                background:   on ? "rgba(58,191,138,0.08)" : "var(--surface2)",
                color:        on ? "var(--teal)"        : "var(--body)",
              }}
            >
              <span
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all duration-150"
                style={{
                  borderColor: on ? "var(--teal)" : "var(--border)",
                  background:  on ? "var(--teal)" : "transparent",
                  color:       "var(--bg)",
                }}
              >
                {on && <Check />}
              </span>
              <span className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.12em]">
                {ex}
              </span>
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="mb-5">
        <p className="mb-2 font-mono text-[0.56rem] uppercase tracking-[0.32em] text-[var(--body)]">
          Timeline
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TIMELINES.map(t => {
            const on = data.timeline === t;
            return (
              <button
                key={t}
                onClick={() => setData(d => ({ ...d, timeline: t }))}
                className="rounded-xl border py-3 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.1em] transition-all duration-150"
                style={{
                  borderColor: on ? "var(--teal)"           : "var(--border)",
                  background:  on ? "var(--teal)"           : "var(--surface2)",
                  color:       on ? "var(--bg)"             : "var(--body)",
                }}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Budget */}
      <div>
        <p className="mb-2 font-mono text-[0.56rem] uppercase tracking-[0.32em] text-[var(--body)]">
          Budget range
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {BUDGETS.map(b => {
            const on = data.budget === b;
            return (
              <button
                key={b}
                onClick={() => setData(d => ({ ...d, budget: b }))}
                className="rounded-xl border py-3 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.1em] transition-all duration-150"
                style={{
                  borderColor: on ? "var(--teal)"           : "var(--border)",
                  background:  on ? "var(--teal)"           : "var(--surface2)",
                  color:       on ? "var(--bg)"             : "var(--body)",
                }}
              >
                {b}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: Contact details ──────────────────────────────────────────────────

function GuidedVoiceRecorder({
  clips,
  setClips,
}: {
  clips: GuidedVoiceClip[];
  setClips: React.Dispatch<React.SetStateAction<GuidedVoiceClip[]>>;
}) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secondsRef = useRef(0);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    recorderRef.current?.stream.getTracks().forEach(track => track.stop());
  }, []);

  const fmt = (value: number) =>
    `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;

  async function startRecording() {
    setError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];
      secondsRef.current = 0;
      setSeconds(0);

      recorder.ondataavailable = event => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach(track => track.stop());
        setRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
        if (!blob.size) return;
        setClips(current => [
          ...current,
          {
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            blob,
            duration: Math.max(1, secondsRef.current),
          },
        ]);
      };

      recorder.start();
      setRecording(true);
      timerRef.current = setInterval(() => {
        secondsRef.current += 1;
        setSeconds(secondsRef.current);
      }, 1000);
    } catch {
      setError(true);
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
  }

  return (
    <div>
      <button
        type="button"
        onClick={recording ? stopRecording : startRecording}
        className="flex w-full items-center justify-between rounded-xl border border-[rgba(58,191,138,0.18)] bg-[rgba(58,191,138,0.045)] px-4 py-3 text-left transition-colors hover:border-[rgba(58,191,138,0.42)]"
      >
        <span>
          <span className="block font-mono text-[0.52rem] uppercase tracking-[0.28em] text-[var(--teal)]">
            {recording ? "Recording" : "Voice note"}
          </span>
          <span className="mt-1 block text-[0.76rem] text-[rgba(240,236,227,0.58)]">
            {recording ? fmt(seconds) : clips.length ? `${clips.length} attached` : "Record a short brief"}
          </span>
        </span>
        <span className={`grid h-9 w-9 place-items-center rounded-full border ${recording ? "border-red-400/50 text-red-300" : "border-[rgba(58,191,138,0.35)] text-[var(--teal)]"}`}>
          {recording ? (
            <span className="h-3 w-3 rounded-[0.2rem] bg-red-300" />
          ) : (
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <path d="M12 19v3" />
            </svg>
          )}
        </span>
      </button>

      {clips.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {clips.map((clip, index) => (
            <span key={clip.id} className="inline-flex max-w-full items-center gap-2 rounded-full border border-[rgba(58,191,138,0.16)] bg-[rgba(58,191,138,0.055)] px-3 py-1.5 text-[0.72rem] text-[rgba(240,236,227,0.64)]">
              Voice {index + 1} - {fmt(clip.duration)}
              <button
                type="button"
                aria-label={`Remove voice note ${index + 1}`}
                className="text-[rgba(240,236,227,0.38)] transition-colors hover:text-[var(--teal)]"
                onClick={() => setClips(current => current.filter(item => item.id !== clip.id))}
              >
                x
              </button>
            </span>
          ))}
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-400">Mic access failed. Check browser permission and try again.</p>}
    </div>
  );
}

function GuidedVoiceRecorderInline({
  clips,
  setClips,
}: {
  clips: GuidedVoiceClip[];
  setClips: React.Dispatch<React.SetStateAction<GuidedVoiceClip[]>>;
}) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secondsRef = useRef(0);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    recorderRef.current?.stream.getTracks().forEach(track => track.stop());
  }, []);

  const fmt = (value: number) =>
    `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;

  async function startRecording() {
    setError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];
      secondsRef.current = 0;
      setSeconds(0);
      recorder.ondataavailable = event => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach(track => track.stop());
        setRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
        if (!blob.size) return;
        setClips(current => [
          ...current,
          {
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            blob,
            duration: Math.max(1, secondsRef.current),
          },
        ]);
      };
      recorder.start();
      setRecording(true);
      timerRef.current = setInterval(() => {
        secondsRef.current += 1;
        setSeconds(secondsRef.current);
      }, 1000);
    } catch {
      setError(true);
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
  }

  return (
    <>
      <button
        type="button"
        onClick={recording ? stopRecording : startRecording}
        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors ${
          recording
            ? "bg-[rgba(239,68,68,0.08)] text-red-300"
            : "text-[rgba(240,236,227,0.45)] hover:bg-[rgba(58,191,138,0.06)] hover:text-[var(--teal)]"
        }`}
      >
        {recording ? (
          <>
            <span className="h-2.5 w-2.5 rounded-sm bg-red-400" />
            <span className="font-mono text-[0.44rem] uppercase tracking-[0.18em]">{fmt(seconds)}</span>
          </>
        ) : (
          <>
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            </svg>
            <span className="font-mono text-[0.44rem] uppercase tracking-[0.18em]">Voice</span>
          </>
        )}
      </button>
      {error && <span className="text-[0.6rem] text-red-400">Mic denied</span>}
    </>
  );
}

function Step3({
  data,
  setData,
  field,
  label,
  submitError,
  assetFiles,
  setAssetFiles,
  voiceClips,
  setVoiceClips,
}: {
  data: FormData;
  setData: React.Dispatch<React.SetStateAction<FormData>>;
  field: string;
  label: string;
  submitError: boolean;
  assetFiles: File[];
  setAssetFiles: React.Dispatch<React.SetStateAction<File[]>>;
  voiceClips: GuidedVoiceClip[];
  setVoiceClips: React.Dispatch<React.SetStateAction<GuidedVoiceClip[]>>;
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestions = [
    "I have a company that needs a clearer website and better lead flow.",
    "We are launching a new offer and need the page, visuals, and funnel.",
    "Our current site feels outdated and we need a sharper digital presence.",
  ];

  return (
    <div className="mx-auto w-full max-w-[600px]">
      <div className="mb-7 text-center">
        <h2 className="hed mb-3 text-[clamp(2.2rem,5vw,3.65rem)] leading-[0.92]">
          Last few details.
        </h2>
        <p className="text-[0.9rem] leading-[1.6] text-[var(--body)]">
          We promise, that&apos;s it.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Your name</label>
            <input
              type="text"
              placeholder="Tony Nakhla"
              className={field}
              autoComplete="name"
              value={data.name}
              onChange={e => setData(d => ({ ...d, name: e.target.value }))}
            />
          </div>
          <div>
            <label className={label}>Email</label>
            <input
              type="email"
              placeholder="your best email — we reply within 24h"
              className={field}
              autoComplete="email"
              value={data.email}
              onChange={e => setData(d => ({ ...d, email: e.target.value }))}
            />
          </div>
        </div>

        {/* Message box with voice + attachments embedded inside */}
        <div>
          <label className={label}>
            Anything else?{" "}
            <span className="opacity-50">(optional)</span>
          </label>
          <div
            className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface2)] transition-all duration-200 focus-within:border-[var(--teal-mid)] focus-within:bg-[var(--teal-faint)]"
          >
            <textarea
              rows={3}
              placeholder="Context, references, goals, timelines, dreams…"
              className="w-full resize-none border-none bg-transparent px-4 pt-3 pb-2 text-[var(--fg)] outline-none placeholder:text-[#444]"
              style={{ fontSize: "0.875rem", fontFamily: "inherit", lineHeight: 1.65 }}
              value={data.note}
              onFocus={() => setShowSuggestions(true)}
              onClick={() => setShowSuggestions(true)}
              onChange={e => setData(d => ({ ...d, note: e.target.value }))}
            />

            {/* Attachments inside the box */}
            {(assetFiles.length > 0 || voiceClips.length > 0) && (
              <div className="flex flex-wrap gap-1.5 px-3 pb-2">
                {assetFiles.map(file => (
                  <span key={`${file.name}:${file.size}`} className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-[rgba(58,191,138,0.18)] bg-[rgba(58,191,138,0.06)] px-2.5 py-1 text-[0.68rem] text-[rgba(240,236,227,0.6)]">
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                      <path d="M14 2v6h6" />
                    </svg>
                    <span className="max-w-[120px] truncate">{file.name}</span>
                    <button
                      type="button"
                      aria-label={`Remove ${file.name}`}
                      className="ml-0.5 text-[rgba(240,236,227,0.35)] transition-colors hover:text-red-400"
                      onClick={() => setAssetFiles(current => current.filter(item => item !== file))}
                    >
                      <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                    </button>
                  </span>
                ))}
                {voiceClips.map((clip, index) => (
                  <span key={clip.id} className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-[rgba(58,191,138,0.18)] bg-[rgba(58,191,138,0.06)] px-2.5 py-1 text-[0.68rem] text-[rgba(240,236,227,0.6)]">
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    </svg>
                    Voice {index + 1} — {`${String(Math.floor(clip.duration / 60)).padStart(2, "0")}:${String(clip.duration % 60).padStart(2, "0")}`}
                    <button
                      type="button"
                      aria-label={`Remove voice note ${index + 1}`}
                      className="ml-0.5 text-[rgba(240,236,227,0.35)] transition-colors hover:text-red-400"
                      onClick={() => setVoiceClips(current => current.filter(item => item.id !== clip.id))}
                    >
                      <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Bottom toolbar: attach + voice */}
            <div className="flex items-center gap-1 border-t border-[rgba(255,255,255,0.04)] px-2 py-1.5">
              <label className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[rgba(240,236,227,0.45)] transition-colors hover:bg-[rgba(58,191,138,0.06)] hover:text-[var(--teal)]">
                <input
                  type="file"
                  multiple
                  className="sr-only"
                  accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.key,.zip"
                  onChange={event => {
                    const nextFiles = Array.from(event.target.files ?? []);
                    setAssetFiles(current => {
                      const byKey = new Map(current.map(file => [`${file.name}:${file.size}`, file]));
                      nextFiles.forEach(file => byKey.set(`${file.name}:${file.size}`, file));
                      return Array.from(byKey.values()).slice(0, 8);
                    });
                    event.currentTarget.value = "";
                  }}
                />
                <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
                <span className="font-mono text-[0.44rem] uppercase tracking-[0.18em]">Attach</span>
              </label>

              <GuidedVoiceRecorderInline clips={voiceClips} setClips={setVoiceClips} />
            </div>
          </div>

          {showSuggestions && !data.note && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {suggestions.map(sentence => (
                <button key={sentence} type="button"
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => setData(d => ({ ...d, note: d.note ? `${d.note}\n${sentence}` : sentence }))}
                  className="rounded-full border border-[rgba(58,191,138,0.14)] bg-[rgba(58,191,138,0.035)] px-2.5 py-1.5 text-left text-[0.68rem] leading-snug text-[rgba(240,236,227,0.5)] transition-colors hover:border-[rgba(58,191,138,0.38)] hover:text-[var(--teal)]"
                >
                  {sentence}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {submitError && (
        <p className="mt-4 text-sm text-red-400">
          Something went wrong. Try again or email us directly.
        </p>
      )}
    </div>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────

function SuccessScreen({
  data,
  services,
  embedded = false,
  onBack,
}: {
  data: FormData;
  services: typeof SERVICES;
  embedded?: boolean;
  onBack?: () => void;
}) {
  const rowsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rows = rowsRef.current?.querySelectorAll("[data-row]");
    if (!rows) return;
    gsap.fromTo(
      rows,
      { y: 28, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, stagger: 0.09, duration: 0.45, ease: "power2.out", delay: 0.1 }
    );
  }, []);

  const summary = [
    { k: "Services",     v: services.map(service => service.title).join(", ") },
    { k: "Deliverables", v: data.subServices.join(", ") },
    { k: "Timeline",     v: data.timeline },
    { k: "Budget",       v: data.budget },
    { k: "Sent by",      v: data.name },
  ];

  return (
    <div className="mx-auto max-w-[620px] text-center">
      {/* Animated ring */}
      <div className="mx-auto mb-10 flex h-20 w-20 items-center justify-center rounded-full"
        style={{ border: "1.5px solid var(--teal)", boxShadow: "0 0 32px rgba(58,191,138,0.2)" }}>
        <svg className="h-9 w-9 text-[var(--teal)]" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>

      <p className="eyebrow mb-6">Request received</p>
      <h2 className="hed mb-4 text-[clamp(2.6rem,6vw,5rem)] leading-[0.9]">
        We&apos;ll be in touch.
      </h2>
      <p className="mb-12 text-[0.9375rem] leading-[1.85] text-[var(--body)]">
        Check your inbox within 24 hours. A real person will reply.
      </p>

      {/* Summary rows */}
      <div ref={rowsRef} className="mb-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-left">
        {summary.map(row => (
          <div
            key={row.k}
            data-row
            className="flex items-start justify-between gap-4 border-b border-[var(--border)] py-3.5 last:border-0"
            style={{ opacity: 0 }}
          >
            <span className="font-mono text-[0.56rem] uppercase tracking-[0.3em] text-[var(--body)]">
              {row.k}
            </span>
            <span className="text-right text-[0.82rem] text-[var(--fg)]">{row.v}</span>
          </div>
        ))}
      </div>

      {embedded && onBack ? (
        <button type="button" onClick={onBack} className="btn-glass-ghost inline-flex">
          <span className="btn-glass-blob" aria-hidden="true" />
          <span className="btn-glass-face">Back</span>
        </button>
      ) : (
        <Link href="/" className="btn-glass-ghost inline-flex">
          <span className="btn-glass-blob" aria-hidden="true" />
          <span className="btn-glass-face">Back to home</span>
        </Link>
      )}
    </div>
  );
}

