"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NoxNavbar, NoxFooter, NoxPageIntro, TK, SANS, DISPLAY } from "./NoxShared";

gsap.registerPlugin(ScrollTrigger);

export type ContactInfo = {
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  socialLinks?: Record<string, string> | null;
};

type ContactMethod = "email" | "phone" | "whatsapp";

type BriefData = {
  serviceIds: string[];
  subServices: string[];
  timeline: string;
  budget: string;
  name: string;
  contactMethod: ContactMethod;
  contactValue: string;
  note: string;
};

const SERVICES = [
  {
    id: "webdev",
    title: "Web development",
    examples: ["Custom website", "Landing page", "CMS build", "Web app", "Performance pass"],
  },
  {
    id: "uiux",
    title: "UI / UX",
    examples: ["Product audit", "Wireframes", "Design system", "Prototype", "Conversion flow"],
  },
  {
    id: "ecomm",
    title: "E-commerce",
    examples: ["Store build", "Checkout flow", "Product pages", "Subscriptions", "Shopify cleanup"],
  },
  {
    id: "seo",
    title: "SEO",
    examples: ["Technical SEO", "Content plan", "Local SEO", "Analytics", "Search cleanup"],
  },
  {
    id: "crm",
    title: "CRM / automation",
    examples: ["CRM setup", "Lead routing", "Automations", "Dashboards", "Pipeline cleanup"],
  },
  {
    id: "brand",
    title: "Brand system",
    examples: ["Identity refresh", "Visual system", "Messaging", "Launch assets", "Deck design"],
  },
];

const TIMELINES = ["ASAP", "2-4 weeks", "1-3 months", "3+ months", "Flexible"];
const BUDGETS = ["Under $5k", "$5k-$15k", "$15k-$50k", "$50k+", "Need guidance"];
const METHOD_LABELS: Record<ContactMethod, string> = {
  email: "Email",
  phone: "Phone",
  whatsapp: "WhatsApp",
};

const SYNTHESIS = [
  { step: "01", title: "Synthesis", body: "We turn the request into goals, constraints, users, and project shape." },
  { step: "02", title: "Content", body: "We clarify deliverables, page needs, references, assets, and missing material." },
  { step: "03", title: "Start", body: "We answer with the next move, timeline, budget path, and kickoff rhythm." },
];

const INITIAL_BRIEF: BriefData = {
  serviceIds: [],
  subServices: [],
  timeline: "",
  budget: "",
  name: "",
  contactMethod: "email",
  contactValue: "",
  note: "",
};

const inputBase: React.CSSProperties = {
  width: "100%",
  background: "rgba(3,8,5,0.68)",
  border: `1px solid ${TK.line}`,
  borderRadius: 0,
  padding: "clamp(12px, 1.5vw, 18px) clamp(16px, 2vw, 24px)",
  fontFamily: SANS,
  fontSize: "clamp(0.88rem, 1.1vw, 1.05rem)",
  color: TK.paper,
  outline: "none",
  transition: "border-color 150ms ease, background 150ms ease",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const labelTextStyle: React.CSSProperties = {
  fontFamily: SANS,
  fontSize: "clamp(0.68rem, 0.82vw, 0.82rem)",
  letterSpacing: "0.16em",
  color: TK.green,
  opacity: 0.75,
  textTransform: "uppercase",
};

export default function ContactFocused({ contactInfo }: { contactInfo?: ContactInfo }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [brief, setBrief] = useState<BriefData>(INITIAL_BRIEF);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const email = contactInfo?.email ?? "hello@noxstudio.dev";
  const base = contactInfo?.address ?? "Yabroud, Syria / working worldwide";
  const selectedServices = useMemo(
    () => SERVICES.filter((service) => brief.serviceIds.includes(service.id)),
    [brief.serviceIds],
  );
  const availableDeliverables = useMemo(
    () => Array.from(new Set(selectedServices.flatMap((service) => service.examples))),
    [selectedServices],
  );
  const canSubmit =
    brief.serviceIds.length > 0 &&
    brief.timeline &&
    brief.budget &&
    brief.name.trim().length > 1 &&
    brief.contactValue.trim().length > 2 &&
    brief.note.trim().length > 8;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".tk-contact-way", {
        y: 30,
        opacity: 0,
        stagger: 0.08,
        duration: 0.65,
        ease: "power3.out",
        scrollTrigger: { trigger: ".tk-contact-ways", start: "top 82%" },
      });
      gsap.from(".tk-contact-synthesis-card", {
        y: 34,
        opacity: 0,
        stagger: 0.08,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: { trigger: ".tk-contact-synthesis", start: "top 80%" },
      });
      gsap.from(".tk-contact-form-shell", {
        y: 42,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: { trigger: ".tk-contact-form-shell", start: "top 80%" },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  function toggleService(id: string) {
    setBrief((current) => {
      const nextServiceIds = current.serviceIds.includes(id)
        ? current.serviceIds.filter((serviceId) => serviceId !== id)
        : [...current.serviceIds, id];
      const nextServices = SERVICES.filter((service) => nextServiceIds.includes(service.id));
      const allowedDeliverables = new Set(nextServices.flatMap((service) => service.examples));
      return {
        ...current,
        serviceIds: nextServiceIds,
        subServices: current.subServices.filter((item) => allowedDeliverables.has(item)),
      };
    });
  }

  function toggleDeliverable(item: string) {
    setBrief((current) => ({
      ...current,
      subServices: current.subServices.includes(item)
        ? current.subServices.filter((value) => value !== item)
        : [...current.subServices, item],
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit || loading) return;

    setLoading(true);
    setError(null);

    const serviceTitles = selectedServices.map((service) => service.title);
    const message = [
      `Services: ${serviceTitles.join(", ")}`,
      `Deliverables: ${brief.subServices.length ? brief.subServices.join(", ") : "To be confirmed"}`,
      `Timeline: ${brief.timeline}`,
      `Budget: ${brief.budget}`,
      "",
      brief.note.trim(),
    ].join("\n");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: brief.name.trim(),
          email:
            brief.contactMethod === "email" && brief.contactValue.includes("@")
              ? brief.contactValue.trim()
              : `${brief.contactMethod}@noxstudio.local`,
          contactMethod: brief.contactMethod,
          contactValue: brief.contactValue.trim(),
          projectType: serviceTitles.join(", "),
          source: "focused-contact-guided",
          message,
          metadata: {
            serviceIds: brief.serviceIds,
            services: serviceTitles,
            subServices: brief.subServices,
            timeline: brief.timeline,
            budget: brief.budget,
          },
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
      setBrief(INITIAL_BRIEF);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const ways = [
    { label: "project desk", value: email, href: `mailto:${email}` },
    { label: "response", value: "within one business day", href: null },
    { label: "studio base", value: base, href: null },
  ];

  return (
    <div ref={rootRef} style={{ background: TK.ink, color: TK.green, fontFamily: SANS }}>
      <style>{`
        .tk-contact-ways {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          border-top: 1px solid ${TK.line};
          border-bottom: 1px solid ${TK.line};
        }
        .tk-contact-way {
          padding: clamp(2rem, 4vw, 4.5rem) clamp(1.5rem, 3vw, 3rem);
          border-right: 1px solid ${TK.line};
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .tk-contact-way:last-child { border-right: none; }
        .tk-contact-synthesis {
          padding: clamp(4rem, 8vw, 8rem) clamp(1.5rem, 4vw, 3.5rem);
          display: grid;
          grid-template-columns: .75fr 1.25fr;
          gap: clamp(2rem, 5vw, 5rem);
          border-bottom: 1px solid ${TK.line};
        }
        .tk-contact-synthesis-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1px;
          background: ${TK.line};
          border: 1px solid ${TK.line};
        }
        .tk-contact-synthesis-card {
          min-height: 230px;
          padding: clamp(1.2rem, 2vw, 2rem);
          background: rgba(3, 8, 5, .92);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .tk-contact-form-shell {
          max-width: 1320px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(280px, .72fr) minmax(0, 1.28fr);
          gap: 1px;
          border: 1px solid ${TK.line};
          background: ${TK.line};
        }
        .tk-contact-panel,
        .tk-contact-form-panel {
          background: rgba(3, 8, 5, .94);
          padding: clamp(1.5rem, 4vw, 3.5rem);
        }
        .tk-contact-chip-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }
        .tk-contact-chip {
          min-height: 54px;
          border: 1px solid ${TK.line};
          background: rgba(70,174,34,.04);
          color: ${TK.paper};
          padding: 13px 14px;
          font-family: ${SANS};
          font-size: .92rem;
          text-align: left;
          cursor: pointer;
          transition: transform 140ms ease, border-color 140ms ease, background 140ms ease, color 140ms ease;
        }
        .tk-contact-chip:hover {
          transform: translateY(-2px);
          border-color: rgba(70,174,34,.75);
        }
        .tk-contact-chip.is-active {
          background: ${TK.green};
          border-color: ${TK.green};
          color: ${TK.ink};
        }
        .tk-contact-field-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(1rem, 2vw, 1.5rem);
        }
        @media (max-width: 980px) {
          .tk-contact-ways,
          .tk-contact-synthesis,
          .tk-contact-form-shell {
            grid-template-columns: 1fr;
          }
          .tk-contact-way {
            border-right: none;
            border-bottom: 1px solid ${TK.line};
          }
          .tk-contact-way:last-child { border-bottom: none; }
          .tk-contact-synthesis-grid,
          .tk-contact-chip-grid,
          .tk-contact-field-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <NoxNavbar active="contact" />

      <NoxPageIntro
        eyebrow="/ focused contact"
        title="start with"
        italic="clarity."
        lede="Send the real project shape: what needs to work, what is missing, and what outcome matters. NOX answers with a tighter scope and a practical path forward."
      />

      <section className="tk-contact-ways" aria-label="Contact details">
        {ways.map((way) => (
          <div key={way.label} className="tk-contact-way">
            <span style={labelTextStyle}>{way.label}</span>
            {way.href ? (
              <a
                href={way.href}
                style={{
                  fontFamily: DISPLAY,
                  fontStyle: "italic",
                  fontWeight: 600,
                  fontSize: "clamp(1.4rem, 2.5vw, 2.5rem)",
                  lineHeight: 1.1,
                  color: TK.paper,
                  textDecoration: "none",
                }}
              >
                {way.value}
              </a>
            ) : (
              <strong
                style={{
                  fontFamily: DISPLAY,
                  fontStyle: "italic",
                  fontWeight: 600,
                  fontSize: "clamp(1.4rem, 2.5vw, 2.5rem)",
                  lineHeight: 1.1,
                  color: TK.paper,
                }}
              >
                {way.value}
              </strong>
            )}
          </div>
        ))}
      </section>

      <section className="tk-contact-synthesis" aria-label="Project start process">
        <div>
          <span style={labelTextStyle}>/ project start</span>
          <h2
            style={{
              margin: "1rem 0 0",
              fontFamily: SANS,
              fontSize: "clamp(2.5rem, 6vw, 6.5rem)",
              fontWeight: 800,
              letterSpacing: 0,
              lineHeight: 0.94,
              color: TK.paper,
              textTransform: "uppercase",
            }}
          >
            Synthesis
            <br />
            content
            <br />
            kickoff.
          </h2>
        </div>
        <div className="tk-contact-synthesis-grid">
          {SYNTHESIS.map((item) => (
            <article className="tk-contact-synthesis-card" key={item.step}>
              <span style={{ ...labelTextStyle, opacity: 1 }}>{item.step}</span>
              <div>
                <h3
                  style={{
                    margin: "0 0 .75rem",
                    fontFamily: DISPLAY,
                    fontStyle: "italic",
                    fontSize: "clamp(1.6rem, 2.5vw, 3rem)",
                    color: TK.paper,
                    lineHeight: 1,
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ margin: 0, color: "rgba(233,233,233,.68)", lineHeight: 1.55, fontSize: "1rem" }}>
                  {item.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={{ padding: "clamp(4rem, 8vw, 9rem) clamp(1.5rem, 4vw, 3.5rem)" }}>
        <div className="tk-contact-form-shell">
          <aside className="tk-contact-panel">
            <span style={labelTextStyle}>/ inquiry system</span>
            <h2
              style={{
                margin: "1rem 0 1.5rem",
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: "clamp(2rem, 4vw, 4.8rem)",
                lineHeight: 0.96,
                color: TK.paper,
                textTransform: "uppercase",
              }}
            >
              Build the brief before the call.
            </h2>
            <p style={{ margin: 0, color: "rgba(233,233,233,.66)", lineHeight: 1.65, maxWidth: 440 }}>
              Choose the services, select the exact deliverables, and leave the detail that would normally get lost
              in a first email.
            </p>
            <div style={{ marginTop: "clamp(2rem, 4vw, 4rem)", display: "grid", gap: "1px", background: TK.line }}>
              {[
                ["Services", String(brief.serviceIds.length || 0)],
                ["Deliverables", String(brief.subServices.length || 0)],
                ["Timeline", brief.timeline || "Open"],
                ["Budget", brief.budget || "Open"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    background: "rgba(3,8,5,.95)",
                    padding: "1.1rem 0",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    color: TK.paper,
                  }}
                >
                  <span style={{ ...labelTextStyle, color: "rgba(233,233,233,.62)" }}>{label}</span>
                  <strong style={{ fontFamily: DISPLAY, fontStyle: "italic", color: TK.green }}>{value}</strong>
                </div>
              ))}
            </div>
          </aside>

          <div className="tk-contact-form-panel">
            {submitted ? (
              <div
                style={{
                  minHeight: 520,
                  display: "grid",
                  placeItems: "center",
                  textAlign: "center",
                  padding: "clamp(2rem, 5vw, 5rem)",
                }}
              >
                <div>
                  <span
                    style={{
                      fontFamily: DISPLAY,
                      fontStyle: "italic",
                      fontWeight: 600,
                      fontSize: "clamp(4rem, 9vw, 9rem)",
                      lineHeight: 1,
                      color: TK.green,
                    }}
                  >
                    sent.
                  </span>
                  <p style={{ margin: "1rem auto 0", maxWidth: 460, color: TK.paper, lineHeight: 1.6 }}>
                    Message received. We will come back with a clear next move within one business day.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "grid", gap: "clamp(1.75rem, 3vw, 2.8rem)" }}>
                <div style={labelStyle}>
                  <span style={labelTextStyle}>Services</span>
                  <div className="tk-contact-chip-grid">
                    {SERVICES.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        className={`tk-contact-chip ${brief.serviceIds.includes(service.id) ? "is-active" : ""}`}
                        onClick={() => toggleService(service.id)}
                      >
                        {service.title}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={labelStyle}>
                  <span style={labelTextStyle}>Deliverables</span>
                  <div className="tk-contact-chip-grid">
                    {(availableDeliverables.length ? availableDeliverables : ["Select a service first"]).map((item) => (
                      <button
                        key={item}
                        type="button"
                        disabled={!availableDeliverables.length}
                        className={`tk-contact-chip ${brief.subServices.includes(item) ? "is-active" : ""}`}
                        onClick={() => availableDeliverables.length && toggleDeliverable(item)}
                        style={!availableDeliverables.length ? { cursor: "not-allowed", opacity: 0.45 } : undefined}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="tk-contact-field-grid">
                  <div style={labelStyle}>
                    <span style={labelTextStyle}>Timeline</span>
                    <div className="tk-contact-chip-grid" style={{ gridTemplateColumns: "1fr" }}>
                      {TIMELINES.map((item) => (
                        <button
                          key={item}
                          type="button"
                          className={`tk-contact-chip ${brief.timeline === item ? "is-active" : ""}`}
                          onClick={() => setBrief((current) => ({ ...current, timeline: item }))}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={labelStyle}>
                    <span style={labelTextStyle}>Budget</span>
                    <div className="tk-contact-chip-grid" style={{ gridTemplateColumns: "1fr" }}>
                      {BUDGETS.map((item) => (
                        <button
                          key={item}
                          type="button"
                          className={`tk-contact-chip ${brief.budget === item ? "is-active" : ""}`}
                          onClick={() => setBrief((current) => ({ ...current, budget: item }))}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="tk-contact-field-grid">
                  <label style={labelStyle}>
                    <span style={labelTextStyle}>Name</span>
                    <input
                      value={brief.name}
                      onChange={(e) => setBrief((current) => ({ ...current, name: e.target.value }))}
                      type="text"
                      placeholder="Your name"
                      style={inputBase}
                    />
                  </label>
                  <label style={labelStyle}>
                    <span style={labelTextStyle}>Contact</span>
                    <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 10 }}>
                      <select
                        value={brief.contactMethod}
                        onChange={(e) =>
                          setBrief((current) => ({
                            ...current,
                            contactMethod: e.target.value as ContactMethod,
                            contactValue: "",
                          }))
                        }
                        style={{ ...inputBase, cursor: "pointer" }}
                      >
                        {(Object.keys(METHOD_LABELS) as ContactMethod[]).map((method) => (
                          <option key={method} value={method} style={{ background: TK.ink }}>
                            {METHOD_LABELS[method]}
                          </option>
                        ))}
                      </select>
                      <input
                        value={brief.contactValue}
                        onChange={(e) => setBrief((current) => ({ ...current, contactValue: e.target.value }))}
                        type={brief.contactMethod === "email" ? "email" : "text"}
                        placeholder={brief.contactMethod === "email" ? "you@company.com" : "Number or handle"}
                        style={inputBase}
                      />
                    </div>
                  </label>
                </div>

                <label style={labelStyle}>
                  <span style={labelTextStyle}>Project note</span>
                  <textarea
                    value={brief.note}
                    onChange={(e) => setBrief((current) => ({ ...current, note: e.target.value }))}
                    placeholder="What are you building, what is stuck, and what needs to happen next?"
                    rows={7}
                    style={{ ...inputBase, resize: "vertical" }}
                  />
                </label>

                {error && (
                  <p style={{ fontFamily: SANS, fontSize: "0.95rem", color: "#ff6b6b", margin: 0 }}>{error}</p>
                )}

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                  <button
                    type="submit"
                    disabled={!canSubmit || loading}
                    style={{
                      minHeight: 58,
                      padding: "0 clamp(1.5rem, 4vw, 3rem)",
                      border: `1px solid ${TK.green}`,
                      background: TK.green,
                      fontFamily: SANS,
                      fontWeight: 800,
                      fontSize: "0.95rem",
                      color: TK.ink,
                      cursor: !canSubmit || loading ? "not-allowed" : "pointer",
                      opacity: !canSubmit || loading ? 0.48 : 1,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {loading ? "Sending" : "Start the project"}
                  </button>
                  <span style={{ color: "rgba(233,233,233,.56)", fontSize: ".9rem" }}>
                    The selected services and deliverables are saved with the inquiry.
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <NoxFooter />
    </div>
  );
}
