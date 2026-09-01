"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SERVICES = [
  { id: "webdev",  num: "01", title: "Web Dev",     tagline: "Landing pages, dashboards & web apps", img: "/creative/web-dev-service.png", examples: ["Landing pages", "Commercial sites", "Blogs", "Portfolios", "Dashboards", "Web apps"] },
  { id: "uiux",    num: "02", title: "UI / UX",     tagline: "Design systems, flows & prototypes",   img: "/creative/ui-ux-service.png",   examples: ["Wireframes", "Design systems", "User flows", "Prototypes", "Usability tests", "Product UX"] },
  { id: "ecomm",   num: "03", title: "E-Commerce",  tagline: "Shopify, WooCommerce & custom stores", img: "/creative/ecommerce-service.png", examples: ["Shopify", "WooCommerce", "Salla", "Product pages", "Checkout", "Subscriptions"] },
  { id: "mobile",  num: "04", title: "Mobile",      tagline: "iOS, Android & React Native apps",     img: "/creative/app-service.png",     examples: ["iOS", "Android", "React Native", "Onboarding", "Push flows", "App systems"] },
  { id: "seo",     num: "05", title: "SEO",         tagline: "Technical SEO, AI search & content",   img: "/creative/seo-service.png",     examples: ["Technical SEO", "Content plans", "AI search", "Local SEO", "Audits", "Reporting"] },
  { id: "crm",     num: "06", title: "CRM",         tagline: "Booking systems & automations",        img: "/creative/crm-service.png",     examples: ["Bookings", "Pipelines", "Dashboards", "Automations", "Permissions", "Integrations"] },
];

const TIMELINES = ["ASAP", "1–3 months", "3–6 months", "Flexible"];
const BUDGETS   = ["< $5k", "$5–15k", "$15–50k", "$50k+"];

type ContactMethod = "email" | "phone" | "whatsapp";
type GuidedRequestSelection = {
  serviceId?: string;
  serviceTitle?: string;
  deliverable?: string;
  deliverables?: string[];
};

interface FormData {
  serviceIds:    string[];
  subServices:   string[];
  timeline:      string;
  budget:        string;
  name:          string;
  contactMethod: ContactMethod;
  contactValue:  string;
  note:          string;
}

type GuidedVoiceClip = { id: string; blob: Blob; duration: number };

function serviceOptionsForSelection(initialSelection?: GuidedRequestSelection) {
  return SERVICES.map(service => {
    if (service.id !== initialSelection?.serviceId) return service;
    const deliverables = initialSelection.deliverables?.filter(Boolean);
    if (!deliverables?.length) return service;
    return {
      ...service,
      title: initialSelection.serviceTitle || service.title,
      examples: Array.from(new Set(deliverables)),
    };
  });
}

export default function CreativeContactHome({
  cardOnly = false,
  initialSelection,
}: {
  cardOnly?: boolean;
  initialSelection?: GuidedRequestSelection;
} = {}) {
  const [step, setStep] = useState(initialSelection?.serviceId ? 2 : 1);
  const serviceOptions = serviceOptionsForSelection(initialSelection);
  const [data, setData] = useState<FormData>({
    serviceIds: initialSelection?.serviceId ? [initialSelection.serviceId] : [],
    subServices: initialSelection?.deliverable ? [initialSelection.deliverable] : [],
    timeline: "",
    budget: "",
    name: "",
    contactMethod: "email",
    contactValue: "",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [done, setDone] = useState(false);
  const [voiceClips, setVoiceClips] = useState<GuidedVoiceClip[]>([]);
  const [assetFiles, setAssetFiles] = useState<File[]>([]);

  const contentRef = useRef<HTMLDivElement>(null);
  const selectedServices = serviceOptions.filter(s => data.serviceIds.includes(s.id));

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(16px)";
    requestAnimationFrame(() => {
      el.style.transition = "opacity 0.35s ease, transform 0.35s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  }, [step, done]);

  const canAdvance =
    step === 1 ? data.serviceIds.length > 0 :
    step === 2 ? data.subServices.length > 0 && !!data.timeline && !!data.budget :
    step === 3 ? !!data.name.trim() && !!data.contactValue.trim() : false;

  function advance() {
    if (!canAdvance) return;
    if (step < 3) { setStep(step + 1); return; }
    handleSubmit();
  }

  function goBack() {
    if (step > 1) setStep(step - 1);
  }

  function toggleSub(ex: string) {
    setData(d => ({
      ...d,
      subServices: d.subServices.includes(ex) ? d.subServices.filter(s => s !== ex) : [...d.subServices, ex],
    }));
  }

  function toggleAll() {
    const all = Array.from(new Set(selectedServices.flatMap(s => s.examples)));
    setData(d => ({
      ...d,
      subServices: d.subServices.length === all.length ? [] : [...all],
    }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(false);
    const serviceTitles = selectedServices.map(s => s.title).join(", ");
    const projectType = `${serviceTitles} — ${data.subServices.join(", ")}`;
    const message = `Timeline: ${data.timeline} | Budget: ${data.budget}${data.note ? `\n\n${data.note}` : ""}`;
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.contactMethod === "email" ? data.contactValue : `${data.contactMethod}@dontforget.local`,
          projectType,
          message,
          contactMethod: data.contactMethod,
          contactValue: data.contactValue,
          source: "creative-home-guided",
          metadata: {
            serviceIds: data.serviceIds,
            services: selectedServices.map(s => s.title),
            subServices: data.subServices,
            timeline: data.timeline,
            budget: data.budget,
          },
        }),
      });
      if (res.ok) setDone(true);
      else { setSubmitError(true); setSubmitting(false); }
    } catch { setSubmitError(true); setSubmitting(false); }
  }

  const progressPct = done ? 100 : step === 1 ? 0 : step === 2 ? 33 : 67;

  return (
    <section className={`cc-home${cardOnly ? " cc-home--card-only" : ""}`} id="contact">
      <div className="cc-home__inner">

        {/* Left column */}
        {!cardOnly && <div className="cc-home__left">
          <div className="cc-home__icon" aria-hidden="true" />
          <h2 className="cc-home__heading">
            Start your<br /><span className="cc-accent">project</span>.
          </h2>
          <p className="cc-home__sub">
            Three quick steps — pick your services, set the scope, and tell us who you are. Takes under two minutes.
          </p>
          {!done && step > 1 && (
            <div className="cc-home__progress">
              <div className="cc-home__progress-bar" style={{ width: `${progressPct}%` }} />
            </div>
          )}
          <div className="cc-home__img-wrap">
            <Image src="/creative/bust1.png" alt="" width={260} height={320} className="cc-home__bust" />
          </div>
        </div>}

        {/* Right: form card */}
        <div className="cc-home__card">
          {/* Step indicator */}
          {!done && (
            <div className="cc-step-bar">
              {[1, 2, 3].map(n => (
                <div key={n} className={`cc-step-dot${step >= n ? " active" : ""}`}>
                  {n}
                </div>
              ))}
              <span className="cc-step-label">
                {step === 1 ? "Services" : step === 2 ? selectedServices.map(s => s.title).join(" + ") : "Details"}
              </span>
            </div>
          )}

          <div ref={contentRef}>
            {done ? (
              <div className="cc-done">
                <div className="cc-done__icon">✱</div>
                <h3>Request received.</h3>
                <p>A real person will reply within 24 hours.</p>
              </div>
            ) : step === 1 ? (
              <CStep1 data={data} setData={setData} services={serviceOptions} />
            ) : step === 2 ? (
              <CStep2 data={data} setData={setData} services={selectedServices} onToggleSub={toggleSub} onToggleAll={toggleAll} />
            ) : (
              <CStep3
                data={data} setData={setData} submitError={submitError}
                voiceClips={voiceClips} setVoiceClips={setVoiceClips}
                assetFiles={assetFiles} setAssetFiles={setAssetFiles}
              />
            )}
          </div>

          {/* Navigation */}
          {!done && (
            <div className="cc-nav">
              {step > 1 ? (
                <button type="button" className="cc-nav__back" onClick={goBack}>← Back</button>
              ) : <span />}
              <button
                type="button"
                className={`c-btn${!canAdvance ? " cc-disabled" : ""}`}
                disabled={!canAdvance || submitting}
                onClick={advance}
              >
                {step === 3 ? (submitting ? "Sending…" : "Send brief") : "Continue"}
                <span className="c-blink" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Step 1: Service selection ── */
function CStep1({
  data,
  setData,
  services,
}: {
  data: FormData;
  setData: React.Dispatch<React.SetStateAction<FormData>>;
  services: typeof SERVICES;
}) {
  return (
    <div className="cc-step">
      <h3 className="cc-step__title">What are you <span className="cc-accent">building</span>?</h3>
      <p className="cc-step__sub">Pick every service that belongs in the project.</p>
      <div className="cc-services-grid">
        {services.map(svc => {
          const on = data.serviceIds.includes(svc.id);
          return (
            <button key={svc.id} type="button"
              className={`cc-service-card${on ? " active" : ""}`}
              onClick={() => setData(d => ({
                ...d,
                serviceIds: on ? d.serviceIds.filter(id => id !== svc.id) : [...d.serviceIds, svc.id],
                subServices: [],
              }))}
            >
              <Image src={svc.img} alt={svc.title} width={48} height={48} className="cc-service-img" />
              <span className="cc-service-title">{svc.title}</span>
              <span className="cc-service-tag">{svc.tagline}</span>
              {on && <span className="cc-service-check">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Step 2: Scope ── */
function CStep2({
  data, setData, services, onToggleSub, onToggleAll,
}: {
  data: FormData;
  setData: React.Dispatch<React.SetStateAction<FormData>>;
  services: typeof SERVICES;
  onToggleSub: (ex: string) => void;
  onToggleAll: () => void;
}) {
  const examples = Array.from(new Set(services.flatMap(s => s.examples)));
  const allSelected = data.subServices.length === examples.length;

  return (
    <div className="cc-step">
      <h3 className="cc-step__title">What do you <span className="cc-accent">need</span>?</h3>

      <div className="cc-section-label">
        <span>Deliverables</span>
        <button type="button" className="cc-select-all" onClick={onToggleAll}>
          {allSelected ? "Deselect all" : "Select all"}
        </button>
      </div>
      <div className="c-chips">
        {examples.map(ex => (
          <span key={ex} className={`c-chip${data.subServices.includes(ex) ? " active" : ""}`} onClick={() => onToggleSub(ex)}>
            {ex}
          </span>
        ))}
      </div>

      <div className="cc-row" style={{ marginTop: 28 }}>
        <div style={{ flex: 1 }}>
          <div className="cc-section-label"><span>Timeline</span></div>
          <div className="c-chips">
            {TIMELINES.map(t => (
              <span key={t} className={`c-chip${data.timeline === t ? " active" : ""}`} onClick={() => setData(d => ({ ...d, timeline: t }))}>
                {t}
              </span>
            ))}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div className="cc-section-label"><span>Budget</span></div>
          <div className="c-chips">
            {BUDGETS.map(b => (
              <span key={b} className={`c-chip${data.budget === b ? " active" : ""}`} onClick={() => setData(d => ({ ...d, budget: b }))}>
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Voice recorder (inline) ── */
function CVoiceRecorder({ clips, setClips }: { clips: GuidedVoiceClip[]; setClips: React.Dispatch<React.SetStateAction<GuidedVoiceClip[]>> }) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secsRef = useRef(0);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    recorderRef.current?.stream.getTracks().forEach(t => t.stop());
  }, []);

  const fmt = (v: number) => `${String(Math.floor(v / 60)).padStart(2, "0")}:${String(v % 60).padStart(2, "0")}`;

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      recorderRef.current = rec;
      chunksRef.current = [];
      secsRef.current = 0;
      setSeconds(0);
      rec.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach(t => t.stop());
        setRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
        if (!blob.size) return;
        setClips(c => [...c, { id: `${Date.now()}`, blob, duration: Math.max(1, secsRef.current) }]);
      };
      rec.start();
      setRecording(true);
      timerRef.current = setInterval(() => { secsRef.current += 1; setSeconds(secsRef.current); }, 1000);
    } catch { /* mic denied */ }
  }

  return (
    <div className="cc-voice">
      <button type="button" className={`cc-voice-btn${recording ? " recording" : ""}`} onClick={recording ? () => recorderRef.current?.stop() : start}>
        {recording ? (
          <><span className="cc-voice-stop" />{fmt(seconds)}</>
        ) : (
          <><svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /></svg>Voice note</>
        )}
      </button>
      {clips.map((c, i) => (
        <span key={c.id} className="cc-voice-chip">
          Voice {i + 1} — {fmt(c.duration)}
          <button type="button" onClick={() => setClips(cur => cur.filter(x => x.id !== c.id))}>×</button>
        </span>
      ))}
    </div>
  );
}

/* ── Step 3: Contact ── */
function CStep3({
  data, setData, submitError,
  voiceClips, setVoiceClips, assetFiles, setAssetFiles,
}: {
  data: FormData;
  setData: React.Dispatch<React.SetStateAction<FormData>>;
  submitError: boolean;
  voiceClips: GuidedVoiceClip[];
  setVoiceClips: React.Dispatch<React.SetStateAction<GuidedVoiceClip[]>>;
  assetFiles: File[];
  setAssetFiles: React.Dispatch<React.SetStateAction<File[]>>;
}) {
  return (
    <div className="cc-step">
      <h3 className="cc-step__title">Last few <span className="cc-accent">details</span>.</h3>
      <p className="cc-step__sub">We promise, that&apos;s it.</p>

      <div className="cc-fields">
        <div>
          <label className="cc-label">Your name</label>
          <input className="cc-input" type="text" placeholder="Jane Doe" required autoComplete="name"
            value={data.name} onChange={e => setData(d => ({ ...d, name: e.target.value }))} />
        </div>

        <div>
          <label className="cc-label">How should we reach you?</label>
          <div className="cc-contact-toggle">
            <button type="button" className={`cc-contact-opt${data.contactMethod === "email" ? " active" : ""}`}
              onClick={() => setData(d => ({ ...d, contactMethod: "email", contactValue: "" }))}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect width={20} height={16} x={2} y={4} rx={2}/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              Email
            </button>
            <button type="button" className={`cc-contact-opt${data.contactMethod === "phone" ? " active" : ""}`}
              onClick={() => setData(d => ({ ...d, contactMethod: "phone", contactValue: "" }))}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Phone
            </button>
            <button type="button" className={`cc-contact-opt${data.contactMethod === "whatsapp" ? " active" : ""}`}
              onClick={() => setData(d => ({ ...d, contactMethod: "whatsapp", contactValue: "" }))}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              WhatsApp
            </button>
          </div>
          <input
            className="cc-input"
            type={data.contactMethod === "email" ? "email" : "tel"}
            placeholder={data.contactMethod === "email" ? "jane@company.com" : "+1 (555) 000-0000"}
            required
            autoComplete={data.contactMethod === "email" ? "email" : "tel"}
            value={data.contactValue}
            onChange={e => setData(d => ({ ...d, contactValue: e.target.value }))}
          />
        </div>

        <div>
          <label className="cc-label">Anything else? <span style={{ opacity: 0.5 }}>(optional)</span></label>
          <div className="cc-message-box">
            <textarea className="cc-textarea" rows={3} placeholder="Context, references, goals…"
              value={data.note} onChange={e => setData(d => ({ ...d, note: e.target.value }))} />

            {(assetFiles.length > 0 || voiceClips.length > 0) && (
              <div className="cc-attachments">
                {assetFiles.map(f => (
                  <span key={`${f.name}:${f.size}`} className="cc-attach-chip">
                    {f.name}
                    <button type="button" onClick={() => setAssetFiles(c => c.filter(x => x !== f))}>×</button>
                  </span>
                ))}
              </div>
            )}

            <div className="cc-toolbar">
              <label className="cc-toolbar-btn">
                <input type="file" multiple className="sr-only" accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.key,.zip"
                  onChange={e => {
                    const next = Array.from(e.target.files ?? []);
                    setAssetFiles(c => {
                      const m = new Map(c.map(f => [`${f.name}:${f.size}`, f]));
                      next.forEach(f => m.set(`${f.name}:${f.size}`, f));
                      return Array.from(m.values()).slice(0, 8);
                    });
                    e.currentTarget.value = "";
                  }}
                />
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
                Attach
              </label>
              <CVoiceRecorder clips={voiceClips} setClips={setVoiceClips} />
            </div>
          </div>
        </div>
      </div>

      {submitError && <p className="cc-error">Something went wrong. Try again or email us directly.</p>}
    </div>
  );
}
