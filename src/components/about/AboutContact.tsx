"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AboutContact() {
  const [form, setForm]     = useState({ name: "", email: "", projectType: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setStatus("sent");
      setForm({ name: "", email: "", projectType: "", message: "" });
    } else {
      setStatus("error");
    }
  }

  const field =
    "w-full rounded-xl border border-[var(--border)] bg-[var(--surface2)] px-5 py-4 text-[var(--fg)] outline-none placeholder:text-[#444] transition-all duration-200 focus:border-[var(--teal-mid)] focus:bg-[var(--teal-faint)]";
  const label =
    "block font-mono text-[0.58rem] uppercase tracking-[0.32em] text-[var(--body)] mb-2.5";

  return (
    <section id="contact" className="relative section-py border-t border-[var(--border)]" style={{ background: "rgba(9,9,9,0.82)", backdropFilter: "blur(6px)" }}>
      <div className="wrap grid gap-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-24">

        {/* Left */}
        <div>
          <motion.p
            className="eyebrow mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            viewport={{ once: true, margin: "-80px" }}
          >
            Work with us
          </motion.p>
          <motion.h2
            className="hed text-[3rem]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            viewport={{ once: true, margin: "-80px" }}
          >
            Got a project<br />
            worth<br />
            remembering?
          </motion.h2>
          <motion.p
            className="mt-8 max-w-sm text-[0.9375rem] leading-[1.85] text-[var(--body)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            viewport={{ once: true, margin: "-80px" }}
          >
            Tell us what you&apos;re building. We&apos;ll tell you how to make it
            unforgettable — or at least not embarrassing.
          </motion.p>

          <motion.div
            className="mt-12 border-t border-[var(--border)]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            viewport={{ once: true, margin: "-80px" }}
          >
            {[
              { k: "Email",        v: "hello@dontforget.studio" },
              { k: "Response",     v: "Within 24 hours" },
              { k: "Availability", v: "2 spots open" },
            ].map((row) => (
              <div key={row.k} className="flex items-center justify-between border-b border-[var(--border)] py-5">
                <span className="font-mono text-[0.58rem] uppercase tracking-[0.3em] text-[var(--body)]">{row.k}</span>
                <span className="text-sm text-[var(--fg)]">{row.v}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Form */}
        <motion.div
          className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-8 md:p-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          viewport={{ once: true, margin: "-80px" }}
        >
          {status === "sent" ? (
            <motion.div
              className="flex min-h-[420px] flex-col justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <p className="eyebrow mb-6">Message sent</p>
              <h3 className="hed text-[3.8rem] text-[var(--fg)]">We&apos;ll be in touch.</h3>
              <p className="mt-5 text-[0.9375rem] leading-[1.85] text-[var(--body)]">
                Check your inbox within 24 hours. Yes, a real person will reply.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={submit} className="space-y-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className={label}>Name</label>
                  <input type="text" placeholder="Your name" className={field} required
                    value={form.name} onChange={e => setForm(c => ({ ...c, name: e.target.value }))} />
                </div>
                <div>
                  <label className={label}>Email</label>
                  <input type="email" placeholder="your@email.com" className={field} required
                    value={form.email} onChange={e => setForm(c => ({ ...c, email: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className={label}>Project type</label>
                <input type="text" placeholder="Brand system, Web app, Landing page…" className={field}
                  value={form.projectType} onChange={e => setForm(c => ({ ...c, projectType: e.target.value }))} />
              </div>
              <div>
                <label className={label}>Tell us everything</label>
                <textarea rows={6} placeholder="Project details, timeline, budget, dreams, fears…"
                  className={`${field} resize-none`} required
                  value={form.message} onChange={e => setForm(c => ({ ...c, message: e.target.value }))} />
              </div>
              {status === "error" && (
                <p className="text-sm text-red-400">Something broke. Try again or email us directly.</p>
              )}
              <button type="submit" disabled={status === "sending"}
                className="btn btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-50">
                {status === "sending" ? "Sending…" : "Send inquiry →"}
              </button>
            </form>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        className="wrap mt-24 flex flex-col gap-5 border-t border-[var(--border)] pt-8 md:flex-row md:items-center md:justify-between"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        viewport={{ once: true, margin: "-80px" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <a href="/" className="flex shrink-0 items-center">
          <img src="/dont%20forget%20logo.png" alt="DON'T FORGET" style={{ height: 28, width: "auto" }} />
        </a>
        <div className="flex gap-8 font-mono text-[0.58rem] uppercase tracking-[0.28em] text-[var(--body)]">
          <span>Web Development Agency</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </motion.div>
    </section>
  );
}
