"use client";

import { useState } from "react";
import { useFadeUp } from "@/hooks/useScrollAnimation";

export default function Contact() {
  const titleRef = useFadeUp() as React.RefObject<HTMLDivElement>;
  const formRef = useFadeUp(0.2) as React.RefObject<HTMLFormElement>;

  const [form, setForm] = useState({
    name: "",
    email: "",
    projectType: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
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

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500 transition-colors duration-300";

  return (
    <section id="contact" className="bg-black py-32 px-8 border-t border-white/5">
      <div className="max-w-3xl mx-auto text-center">
        <div ref={titleRef} className="mb-16">
          <p className="text-indigo-400 text-sm font-mono uppercase tracking-widest mb-4">
            Get In Touch
          </p>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Let&apos;s build
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
              something great
            </span>
          </h2>
          <p className="text-white/50 text-lg">
            Tell us about your project and we&apos;ll get back to you within 24 hours.
          </p>
        </div>

        {status === "sent" ? (
          <div className="py-16">
            <p className="text-3xl mb-4">✦</p>
            <p className="text-white text-xl font-semibold mb-2">
              Message sent!
            </p>
            <p className="text-white/40">
              We&apos;ll be in touch within 24 hours.
            </p>
          </div>
        ) : (
          <form
            ref={formRef}
            className="flex flex-col gap-4 text-left"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your name"
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
              <input
                type="email"
                placeholder="Your email"
                className={inputClass}
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                required
              />
            </div>
            <input
              type="text"
              placeholder="Project type (e.g. Web App, Landing Page)"
              className={inputClass}
              value={form.projectType}
              onChange={(e) =>
                setForm((f) => ({ ...f, projectType: e.target.value }))
              }
            />
            <textarea
              placeholder="Tell us about your project..."
              rows={5}
              className={`${inputClass} resize-none`}
              value={form.message}
              onChange={(e) =>
                setForm((f) => ({ ...f, message: e.target.value }))
              }
              required
            />
            {status === "error" && (
              <p className="text-red-400 text-sm">
                Something went wrong. Please try again.
              </p>
            )}
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] mt-2"
            >
              {status === "sending" ? "Sending…" : "Send Message →"}
            </button>
          </form>
        )}

        <p className="text-white/20 text-sm mt-12">
          © {new Date().getFullYear()} dontforget agency. All rights reserved.
        </p>
      </div>
    </section>
  );
}
