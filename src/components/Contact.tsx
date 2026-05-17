"use client";

import { useFadeUp } from "@/hooks/useScrollAnimation";

export default function Contact() {
  const titleRef = useFadeUp() as React.RefObject<HTMLDivElement>;
  const formRef = useFadeUp(0.2) as React.RefObject<HTMLFormElement>;

  return (
    <section id="contact" className="bg-black py-32 px-8 border-t border-white/5">
      <div className="max-w-3xl mx-auto text-center">
        {/* Header */}
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

        {/* Form */}
        <form
          ref={formRef}
          className="flex flex-col gap-4 text-left"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your name"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500 transition-colors duration-300"
            />
            <input
              type="email"
              placeholder="Your email"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500 transition-colors duration-300"
            />
          </div>
          <input
            type="text"
            placeholder="Project type (e.g. Web App, Landing Page)"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500 transition-colors duration-300"
          />
          <textarea
            placeholder="Tell us about your project..."
            rows={5}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500 transition-colors duration-300 resize-none"
          />
          <button
            type="submit"
            className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] mt-2"
          >
            Send Message →
          </button>
        </form>

        {/* Footer note */}
        <p className="text-white/20 text-sm mt-12">
          © {new Date().getFullYear()} dontforget agency. All rights reserved.
        </p>
      </div>
    </section>
  );
}
