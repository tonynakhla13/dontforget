"use client";

import { useState } from "react";
import { useFadeUp } from "@/hooks/useScrollAnimation";

export default function Contact() {
  const titleRef = useFadeUp();
  const formRef = useFadeUp(0.12);

  const [form, setForm] = useState({
    name: "",
    email: "",
    projectType: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      setStatus("sent");
      setForm({ name: "", email: "", projectType: "", message: "" });
    } else {
      setStatus("error");
    }
  }

  const inputClass =
    "rounded-2xl border hairline bg-white/[0.02] px-5 py-5 text-[var(--paper)] outline-none transition-colors placeholder:text-[var(--text-dark)] focus:border-[rgba(0,200,176,0.55)]";

  return (
    <section
      id="contact"
      className="relative flex min-h-screen scroll-mt-28 flex-col justify-center py-[var(--section-space)]"
    >
      <div className="section-shell grid gap-20 lg:grid-cols-[0.88fr_1.12fr] lg:items-start lg:gap-32">
        <div ref={titleRef}>
          <p className="eyebrow mb-6">Contact</p>
          <h2 className="display-text max-w-2xl text-4xl leading-[0.98] text-[var(--paper)] md:text-6xl">
            Have an idea worth remembering?
          </h2>
          <p className="mt-8 max-w-lg text-base leading-8 text-[var(--text-dark)] md:text-lg">
            Tell us what you&apos;re building. We&apos;ll help shape the system, the story,
            and the motion around it.
          </p>
        </div>

        <div ref={formRef} className="rounded-[32px] border hairline bg-white/[0.02] p-8 md:p-10">
          {status === "sent" ? (
            <div className="flex min-h-[320px] flex-col items-start justify-center">
              <p className="eyebrow mb-4">Sent</p>
              <h3 className="display-text text-3xl text-[var(--paper)]">Message received.</h3>
              <p className="mt-4 max-w-sm leading-7 text-[var(--text-dark)]">
                We&apos;ll be in touch within 24 hours.
              </p>
            </div>
          ) : (
            <form className="grid gap-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Name"
                  className={inputClass}
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, name: event.target.value }))
                  }
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className={inputClass}
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, email: event.target.value }))
                  }
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Project type"
                className={inputClass}
                value={form.projectType}
                onChange={(event) =>
                  setForm((current) => ({ ...current, projectType: event.target.value }))
                }
              />
              <textarea
                placeholder="Message"
                rows={6}
                className={`${inputClass} resize-none`}
                value={form.message}
                onChange={(event) =>
                  setForm((current) => ({ ...current, message: event.target.value }))
                }
                required
              />
              {status === "error" && (
                <p className="text-sm text-red-300">Something went wrong. Please try again.</p>
              )}
              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-2 rounded-full bg-[var(--teal)] px-6 py-4 font-mono text-xs uppercase tracking-[0.25em] text-[var(--ink)] transition-transform duration-300 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : "Send inquiry"}
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="section-shell mt-28 flex items-center justify-between border-t hairline pt-7 text-[var(--text-dark)] md:mt-32">
        <span className="display-text text-lg text-[var(--paper)]">
          dont<span className="text-[var(--teal)]">forget</span>
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.28em]">
          © {new Date().getFullYear()}
        </span>
      </div>
    </section>
  );
}
