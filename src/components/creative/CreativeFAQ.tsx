"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "What types of projects do you work on?",
    a: "We work on websites, apps, online stores, SEO-ready pages, CRMs, booking systems, dashboards, and custom digital tools.",
    defaultOpen: true,
  },
  { q: "How do you approach a new project?", a: "We start by understanding the problem, the audience, the goal, and what already exists. Then we shape the clearest path forward." },
  { q: "What if my idea is not fully clear yet?", a: "That is normal. Many strong projects start messy. We help turn scattered thoughts into a direction, then into a build." },
  { q: "Do you offer ongoing support?", a: "Yes. We can help with updates, improvements, fixes, SEO adjustments, new features, and keeping the digital thing healthy after launch." },
];

function PlusIcon() {
  return (
    <svg viewBox="0 0 49 49" fill="none" width={49} height={49}>
      <circle cx="24.5" cy="24.5" r="24" fill="transparent" stroke="#231F20" />
      <path d="M16 24.5 L33 24.5 M24.5 16 L24.5 33" stroke="#231F20" strokeWidth="2" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg viewBox="0 0 49 49" fill="none" width={49} height={49}>
      <circle cx="24.5" cy="24.5" r="24" fill="#46D12A" stroke="#231F20" />
      <path d="M16 24.5 L33 24.5" stroke="#231F20" strokeWidth="2" />
    </svg>
  );
}

export default function CreativeFAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="c-faq">
      <div className="c-faq__head">
        <div className="c-faq__head-inner">
          <span>FAQ</span>
          <span className="c-faq__star" aria-hidden="true" />
        </div>
      </div>

      {FAQS.map((item, i) => (
        <div
          key={i}
          className={`c-faq__row${open === i ? " c-faq__row--open" : ""}`}
          onClick={() => setOpen(i === open ? -1 : i)}
        >
          <div className="c-faq__q">
            <div className="c-faq__q-text">{item.q}</div>
          </div>
          {open === i ? (
            <div className="c-faq__a">
              <div className="c-faq__a-text">{item.a}</div>
              <button className="c-faq__btn" aria-label="Close" onClick={(e) => { e.stopPropagation(); setOpen(-1); }}>
                <MinusIcon />
              </button>
            </div>
          ) : (
            <button className="c-faq__btn" aria-label="Expand">
              <PlusIcon />
            </button>
          )}
        </div>
      ))}
    </section>
  );
}
