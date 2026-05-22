"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

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
  serviceId:   string;
  subServices: string[];
  timeline:    string;
  budget:      string;
  name:        string;
  email:       string;
  note:        string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function RequestForm() {
  const [step, setStep]     = useState(1);
  const [dir,  setDir]      = useState<1 | -1>(1);
  const [data, setData]     = useState<FormData>({
    serviceId: "", subServices: [], timeline: "", budget: "", name: "", email: "", note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [done, setDone]     = useState(false);

  const contentRef  = useRef<HTMLDivElement>(null);
  const barRef      = useRef<HTMLDivElement>(null);

  const service = SERVICES.find(s => s.id === data.serviceId);

  // ── Animate step enter ──────────────────────────────────────────────────
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { x: dir === 1 ? 44 : -44, autoAlpha: 0 },
      { x: 0, autoAlpha: 1, duration: 0.34, ease: "power2.out" }
    );
  }, [step, done]);

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
    step === 1 ? !!data.serviceId :
    step === 2 ? data.subServices.length > 0 && !!data.timeline && !!data.budget :
    step === 3 ? !!data.name.trim() && !!data.email.trim() : false;

  function advance() {
    if (!canAdvance) return;
    if (step < 3) { navigate(step + 1, 1); return; }
    handleSubmit();
  }

  function goBack() {
    if (step === 1) { window.location.href = "/"; return; }
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
    if (!service) return;
    const all = service.examples;
    setData(d => ({
      ...d,
      subServices: d.subServices.length === all.length ? [] : [...all],
    }));
  }

  // ── Submit ──────────────────────────────────────────────────────────────
  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(false);
    const projectType = `${service?.title} — ${data.subServices.join(", ")}`;
    const message     = `Timeline: ${data.timeline} | Budget: ${data.budget}${data.note ? `\n\n${data.note}` : ""}`;
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email, projectType, message }),
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
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[var(--bg)]">
      <div className="noise" />

      {/* ── Progress bar ── */}
      <div className={`fixed left-0 right-0 top-[72px] z-40 h-[2px] bg-[var(--border)] transition-opacity duration-500 ${step === 1 && !done ? "opacity-0" : "opacity-100"}`}>
        <div ref={barRef} className="h-full rounded-full bg-[var(--teal)]" style={{ width: "0%" }} />
      </div>

      {/* ── Step counter (hidden on step 1) ── */}
      <div className={`fixed left-0 right-0 top-[80px] z-40 flex justify-center pt-4 transition-opacity duration-500 ${step === 1 && !done ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        <span className="font-mono text-[0.58rem] uppercase tracking-[0.38em] text-[var(--teal)]">
          {done ? "Complete" : `0${step} / 03`}
        </span>
      </div>

      {/* ── Main content ── */}
      <main className="flex flex-1 flex-col items-center justify-center px-5 pb-10 pt-36">
        <div className="w-full max-w-[940px]">
          <div ref={contentRef}>
            {done ? (
              <SuccessScreen data={data} service={service} />
            ) : step === 1 ? (
              <Step1 data={data} setData={setData} />
            ) : step === 2 ? (
              <Step2
                service={service!}
                data={data}
                setData={setData}
                onToggleSub={toggleSub}
                onToggleAll={toggleAll}
              />
            ) : (
              <Step3 data={data} setData={setData} field={field} label={label} submitError={submitError} />
            )}
          </div>
        </div>
      </main>

      {/* ── Navigation ── */}
      {!done && (
        <nav className="sticky bottom-0 z-50 flex items-center justify-between border-t border-[var(--border)] bg-[rgba(9,9,9,0.88)] px-6 py-5 backdrop-blur-xl md:px-10">
          <button onClick={goBack} className="btn btn-outline text-[0.63rem]">
            {step === 1 ? "← Home" : "← Back"}
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
              className="btn btn-primary text-[0.63rem] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {step === 3
                ? (submitting ? "Sending…" : "Send Request →")
                : "Continue →"}
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
      <p className="eyebrow mb-6">Start a project</p>
      <h1 className="hed mb-4 text-[clamp(2.6rem,6vw,5rem)] leading-[0.9]">
        What are you<br />
        <span className="text-[var(--teal)]">building?</span>
      </h1>
      <p className="mb-12 max-w-sm text-[0.9375rem] leading-[1.85] text-[var(--body)]">
        Pick the service that best describes your project.
      </p>

      <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3">
        {SERVICES.map(svc => {
          const selected = data.serviceId === svc.id;
          return (
            <button
              key={svc.id}
              onClick={() => setData(d => ({ ...d, serviceId: svc.id, subServices: [] }))}
              className="group relative overflow-hidden rounded-2xl border p-6 text-left transition-all duration-200 hover:scale-[1.02]"
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
                className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-200"
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
              <span className="block font-mono text-[0.78rem] font-bold uppercase tracking-[0.08em] text-[var(--fg)]">
                {svc.title}
              </span>
              <span className="mt-1 block text-[0.75rem] leading-[1.55] text-[var(--body)]">
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
  service,
  data,
  setData,
  onToggleSub,
  onToggleAll,
}: {
  service: (typeof SERVICES)[0];
  data: FormData;
  setData: React.Dispatch<React.SetStateAction<FormData>>;
  onToggleSub: (ex: string) => void;
  onToggleAll: () => void;
}) {
  const allSelected = data.subServices.length === service.examples.length;

  return (
    <div className="mx-auto max-w-[780px]">
      <div className="mb-10 text-center">
        <p className="eyebrow mb-4">{service.title}</p>
        <h2 className="hed mb-4 text-[clamp(2.2rem,5vw,4rem)] leading-[0.92]">
          What do you need?
        </h2>
        <p className="text-[0.9375rem] leading-[1.85] text-[var(--body)]">
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

      <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {service.examples.map(ex => {
          const on = data.subServices.includes(ex);
          return (
            <button
              key={ex}
              onClick={() => onToggleSub(ex)}
              className="flex items-center gap-2.5 rounded-xl border px-4 py-3.5 text-left transition-all duration-150"
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
      <div className="mb-6">
        <p className="mb-3 font-mono text-[0.58rem] uppercase tracking-[0.32em] text-[var(--body)]">
          Timeline
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TIMELINES.map(t => {
            const on = data.timeline === t;
            return (
              <button
                key={t}
                onClick={() => setData(d => ({ ...d, timeline: t }))}
                className="rounded-xl border py-3.5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.1em] transition-all duration-150"
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
        <p className="mb-3 font-mono text-[0.58rem] uppercase tracking-[0.32em] text-[var(--body)]">
          Budget range
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {BUDGETS.map(b => {
            const on = data.budget === b;
            return (
              <button
                key={b}
                onClick={() => setData(d => ({ ...d, budget: b }))}
                className="rounded-xl border py-3.5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.1em] transition-all duration-150"
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

function Step3({
  data,
  setData,
  field,
  label,
  submitError,
}: {
  data: FormData;
  setData: React.Dispatch<React.SetStateAction<FormData>>;
  field: string;
  label: string;
  submitError: boolean;
}) {
  return (
    <div className="mx-auto max-w-[600px]">
      <div className="mb-10 text-center">
        <p className="eyebrow mb-4">Almost there</p>
        <h2 className="hed mb-4 text-[clamp(2.2rem,5vw,4rem)] leading-[0.92]">
          Last few details.
        </h2>
        <p className="text-[0.9375rem] leading-[1.85] text-[var(--body)]">
          We promise, that&apos;s it.
        </p>
      </div>

      <div className="space-y-5">
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

        <div>
          <label className={label}>
            Anything else we should know?{" "}
            <span className="opacity-50">(optional)</span>
          </label>
          <textarea
            rows={5}
            placeholder="Context, references, goals, timelines, dreams…"
            className={`${field} resize-none`}
            value={data.note}
            onChange={e => setData(d => ({ ...d, note: e.target.value }))}
          />
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
  service,
}: {
  data: FormData;
  service: (typeof SERVICES)[0] | undefined;
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
    { k: "Service",      v: service?.title ?? "" },
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

      <a href="/" className="btn btn-outline inline-flex">
        ← Back to home
      </a>
    </div>
  );
}
