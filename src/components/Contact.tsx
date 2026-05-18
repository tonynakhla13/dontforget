"use client";

import { useState } from "react";
import { useFadeUp, useRevealUp, useParallax } from "@/hooks/useScrollAnimation";

export default function Contact() {
  const headRef = useRevealUp();
  const formRef = useFadeUp(0.12);
  const hexRef = useParallax(-24, 24);

  const [form, setForm] = useState({ name: "", email: "", projectType: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) { setStatus("sent"); setForm({ name: "", email: "", projectType: "", message: "" }); }
    else setStatus("error");
  }

  const field = "w-full rounded-2xl border border-white/8 bg-white/[0.04] px-6 py-5 text-[var(--paper)] outline-none placeholder:text-[var(--text-muted)] transition-all duration-200 focus:border-[rgba(58,191,138,0.45)] focus:bg-white/[0.06]";
  const label = "block font-mono text-[0.62rem] uppercase tracking-[0.3em] text-[var(--text-muted)] mb-3";

  return (
    <section id="contact" className="relative overflow-hidden section-py">
      {/* Hex */}
      <div ref={hexRef} aria-hidden="true" className="pointer-events-none absolute -left-20 top-[8%] opacity-[0.1]">
        <svg width="420" height="420" viewBox="0 0 100 100" fill="none">
          <polygon points="50,3 91,26 91,74 50,97 9,74 9,26" stroke="#3abf8a" strokeWidth="0.6" fill="none" strokeDasharray="4 8" />
        </svg>
      </div>

      {/* Orb */}
      <div aria-hidden="true" className="pointer-events-none absolute right-[6%] top-1/3 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(58,191,138,0.07),transparent_65%)] blur-[120px]" />

      <div className="wrap grid gap-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-28">
        {/* Left */}
        <div ref={headRef}>
          <p className="eyebrow mb-8">Contact</p>
          <h2 className="display-text text-[clamp(2.8rem,7vw,6rem)] leading-[0.9] text-[var(--paper)]">
            Have an idea<br />worth remembering?
          </h2>
          <p className="mt-8 text-[0.9375rem] leading-[1.85] text-[var(--text-muted)]">
            Tell us what you&apos;re building. We&apos;ll help shape the system, the story, and the motion around it.
          </p>

          <div className="mt-14 space-y-0 border-t border-white/8">
            {[
              { k: "Email", v: "hello@dontforget.studio" },
              { k: "Response", v: "Within 24 hours" },
              { k: "Availability", v: "Limited slots open" },
            ].map((row) => (
              <div key={row.k} className="flex items-center justify-between border-b border-white/8 py-5">
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-[var(--text-muted)]">{row.k}</span>
                <span className="text-sm text-[var(--paper)]">{row.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div ref={formRef} className="rounded-[var(--card-radius)] border border-white/8 bg-[var(--surface)] p-8 md:p-12">
          {status === "sent" ? (
            <div className="flex min-h-[400px] flex-col justify-center">
              <p className="eyebrow mb-6">Message sent</p>
              <h3 className="display-text text-[clamp(2rem,4vw,3.5rem)] text-[var(--paper)]">We&apos;ll be in touch.</h3>
              <p className="mt-5 text-[0.9375rem] leading-[1.85] text-[var(--text-muted)]">Expect a reply within 24 hours.</p>
            </div>
          ) : (
            <form className="space-y-7" onSubmit={submit}>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className={label}>Name</label>
                  <input type="text" placeholder="Your name" className={field} value={form.name} onChange={(e) => setForm(c => ({ ...c, name: e.target.value }))} required />
                </div>
                <div>
                  <label className={label}>Email</label>
                  <input type="email" placeholder="your@email.com" className={field} value={form.email} onChange={(e) => setForm(c => ({ ...c, email: e.target.value }))} required />
                </div>
              </div>
              <div>
                <label className={label}>Project type</label>
                <input type="text" placeholder="Brand system, Web app, Landing page…" className={field} value={form.projectType} onChange={(e) => setForm(c => ({ ...c, projectType: e.target.value }))} />
              </div>
              <div>
                <label className={label}>Message</label>
                <textarea rows={6} placeholder="Tell us about your project, timeline, and budget…" className={`${field} resize-none`} value={form.message} onChange={(e) => setForm(c => ({ ...c, message: e.target.value }))} required />
              </div>
              {status === "error" && <p className="text-sm text-red-400">Something went wrong — please try again.</p>}
              <button type="submit" disabled={status === "sending"} className="btn btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                {status === "sending" ? "Sending…" : "Send inquiry →"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="wrap mt-24 flex flex-col gap-6 border-t border-white/8 pt-8 md:flex-row md:items-center md:justify-between">
        <span className="brand-text text-[0.72rem] text-[var(--paper)]">
          DON&apos;T <span className="text-[var(--teal)]">FORGET</span>
        </span>
        <div className="flex gap-8 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-[var(--text-muted)]">
          <span>Web Development Agency</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </section>
  );
}
