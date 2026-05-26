"use client";

import { useState } from "react";
import type { ContactPage } from "@prisma/client";

type SocialLinks = {
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  facebook?: string;
  youtube?: string;
  behance?: string;
  dribbble?: string;
};

export default function ContactEditor({
  initial,
}: {
  initial: ContactPage | null;
}) {
  const [form, setForm] = useState({
    headline: initial?.headline ?? "",
    headlineAr: initial?.headlineAr ?? "",
    subheadline: initial?.subheadline ?? "",
    subheadlineAr: initial?.subheadlineAr ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    address: initial?.address ?? "",
    addressAr: initial?.addressAr ?? "",
  });

  const initSocials = (initial?.socialLinks ?? {}) as SocialLinks;
  const [socials, setSocials] = useState<SocialLinks>(initSocials);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/contact-page", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, socialLinks: socials }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#2ea876] transition-colors text-sm";
  const labelClass =
    "block text-xs text-white/50 uppercase tracking-widest mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <section className="bg-zinc-900 border border-white/5 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-medium text-white/60 uppercase tracking-widest">
          Hero Copy
        </h2>
        <div>
          <label className={labelClass}>Headline</label>
          <input
            className={inputClass}
            value={form.headline}
            onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))}
            placeholder="Let's work together"
          />
        </div>
        <div>
          <label className={labelClass}>Subheadline</label>
          <input
            className={inputClass}
            value={form.subheadline}
            onChange={(e) =>
              setForm((f) => ({ ...f, subheadline: e.target.value }))
            }
            placeholder="Tell us about your project"
          />
        </div>
      </section>

      <section className="bg-zinc-900 border border-white/5 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-medium text-white/60 uppercase tracking-widest">
          Arabic Content
        </h2>
        <div>
          <label className={labelClass}>Arabic Headline</label>
          <input dir="rtl" className={inputClass} value={form.headlineAr} onChange={(e) => setForm((f) => ({ ...f, headlineAr: e.target.value }))} />
        </div>
        <div>
          <label className={labelClass}>Arabic Subheadline</label>
          <input dir="rtl" className={inputClass} value={form.subheadlineAr} onChange={(e) => setForm((f) => ({ ...f, subheadlineAr: e.target.value }))} />
        </div>
        <div>
          <label className={labelClass}>Arabic Address</label>
          <input dir="rtl" className={inputClass} value={form.addressAr} onChange={(e) => setForm((f) => ({ ...f, addressAr: e.target.value }))} />
        </div>
      </section>

      <section className="bg-zinc-900 border border-white/5 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-medium text-white/60 uppercase tracking-widest">
          Contact Details
        </h2>
        <div>
          <label className={labelClass}>Email</label>
          <input
            className={inputClass}
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="hello@dontforget.agency"
          />
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input
            className={inputClass}
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="+1 (555) 000-0000"
          />
        </div>
        <div>
          <label className={labelClass}>Address</label>
          <input
            className={inputClass}
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            placeholder="Los Angeles, CA"
          />
        </div>
      </section>

      <section className="bg-zinc-900 border border-white/5 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-medium text-white/60 uppercase tracking-widest">
          Social Links
        </h2>
        {(
          [
            "instagram",
            "twitter",
            "linkedin",
            "facebook",
            "youtube",
            "behance",
            "dribbble",
          ] as (keyof SocialLinks)[]
        ).map((key) => (
          <div key={key}>
            <label className={labelClass}>{key}</label>
            <input
              className={inputClass}
              value={socials[key] ?? ""}
              onChange={(e) =>
                setSocials((s) => ({ ...s, [key]: e.target.value }))
              }
              placeholder={`https://${key}.com/…`}
            />
          </div>
        ))}
      </section>

      <button
        type="submit"
        disabled={saving}
        className="bg-[#3ABF8A] hover:bg-[#2ea876] disabled:opacity-50 text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors"
      >
        {saving ? "Saving…" : saved ? "Saved ✓" : "Save Changes"}
      </button>
    </form>
  );
}
