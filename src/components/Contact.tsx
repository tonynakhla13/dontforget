"use client";

import { useFadeUp } from "@/hooks/useScrollAnimation";

export default function Contact() {
  const titleRef = useFadeUp();
  const formRef = useFadeUp(0.12);

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div ref={titleRef}>
          <p className="eyebrow mb-6">Contact</p>
          <h2 className="display-text max-w-xl text-3xl leading-tight text-[var(--paper)] md:text-5xl">
            Have an idea worth remembering?
          </h2>
          <p className="mt-7 max-w-md leading-8 text-[var(--text-dark)]">
            Tell us what you&apos;re building. We&apos;ll help shape the system, the story,
            and the motion around it.
          </p>
        </div>

        <div ref={formRef} className="rounded-[28px] border hairline bg-white/[0.02] p-5 md:p-7">
          <form className="grid gap-4" onSubmit={(event) => event.preventDefault()}>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="Name"
                className="rounded-2xl border hairline bg-white/[0.02] px-4 py-4 text-[var(--paper)] outline-none transition-colors placeholder:text-[var(--text-dark)] focus:border-[rgba(0,200,176,0.55)]"
              />
              <input
                type="email"
                placeholder="Email"
                className="rounded-2xl border hairline bg-white/[0.02] px-4 py-4 text-[var(--paper)] outline-none transition-colors placeholder:text-[var(--text-dark)] focus:border-[rgba(0,200,176,0.55)]"
              />
            </div>
            <input
              type="text"
              placeholder="Project type"
              className="rounded-2xl border hairline bg-white/[0.02] px-4 py-4 text-[var(--paper)] outline-none transition-colors placeholder:text-[var(--text-dark)] focus:border-[rgba(0,200,176,0.55)]"
            />
            <textarea
              placeholder="Message"
              rows={6}
              className="resize-none rounded-2xl border hairline bg-white/[0.02] px-4 py-4 text-[var(--paper)] outline-none transition-colors placeholder:text-[var(--text-dark)] focus:border-[rgba(0,200,176,0.55)]"
            />
            <button
              type="submit"
              className="mt-2 rounded-full bg-[var(--teal)] px-6 py-4 font-mono text-xs uppercase tracking-[0.25em] text-[var(--ink)] transition-transform duration-300 hover:-translate-y-1"
            >
              Send inquiry
            </button>
          </form>
        </div>
      </div>

      <div className="section-shell mt-20 flex items-center justify-between border-t hairline pt-6 text-[var(--text-dark)]">
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
