"use client";

import { useState } from "react";

/* ── types ── */
type StatItem   = { value: number; suffix: string; label: string; desc: string };
type StoryEvent = { year: string; title: string; body: string };

type AboutData = {
  stats:   StatItem[];
  story:   StoryEvent[];
  mission: string;
  vision:  string;
};

const DEFAULT_STATS: StatItem[] = [
  { value: 14,  suffix: "+",  label: "Projects shipped", desc: "From zero to live — design, build, and hand-off." },
  { value: 6,   suffix: "",   label: "Countries served",  desc: "Clients across 6 countries, same standard everywhere." },
  { value: 3,   suffix: "yr", label: "Since '22",         desc: "Three years of shipping things worth remembering." },
  { value: 100, suffix: "%",  label: "On-time delivery",  desc: "Deadlines aren't guidelines. We've never missed one." },
];

const DEFAULT_STORY: StoryEvent[] = [
  { year: "2022", title: "Founded",         body: "Born out of frustration with forgettable work. We set out to build a studio with an unreasonably high bar — and actually keep it." },
  { year: "2023", title: "First wins",      body: "First client tripled their conversion rate in month one. First mobile app featured by Apple week one. The bar was set early." },
  { year: "2024", title: "10 projects live",body: "Ten live projects across three countries. E-commerce, custom CRMs, full-stack platforms. No templates. No shortcuts. Ever." },
  { year: "2025", title: "6 countries",     body: "Shipping across six countries, 14+ clients, AI-powered search. Still small on purpose — every project gets the A-team." },
];

const DEFAULT_MISSION = "We exist to create digital experiences that leave a mark — websites, apps, and systems that are fast, beautiful, and built to last. Not just functional. Genuinely unforgettable.";
const DEFAULT_VISION  = "A world where every business, regardless of size, has access to the kind of digital craftsmanship that used to belong only to the biggest companies in the world.";

/* ── helpers ── */
const inputClass   = "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#2ea876] transition-colors text-sm";
const labelClass   = "block text-xs text-white/50 uppercase tracking-widest mb-2";
const sectionClass = "bg-zinc-900 border border-white/5 rounded-xl p-6 space-y-4";

export default function AboutEditor({ initial }: { initial: Partial<AboutData> | null }) {
  const [stats,   setStats]   = useState<StatItem[]>  (initial?.stats   ?? DEFAULT_STATS);
  const [story,   setStory]   = useState<StoryEvent[]>(initial?.story   ?? DEFAULT_STORY);
  const [mission, setMission] = useState<string>      (initial?.mission ?? DEFAULT_MISSION);
  const [vision,  setVision]  = useState<string>      (initial?.vision  ?? DEFAULT_VISION);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  /* ── stat helpers ── */
  function updateStat(i: number, field: keyof StatItem, val: string | number) {
    setStats(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s));
  }

  /* ── story helpers ── */
  function updateStory(i: number, field: keyof StoryEvent, val: string) {
    setStory(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: val } : e));
  }
  function addStory() {
    setStory(prev => [...prev, { year: String(new Date().getFullYear()), title: "New milestone", body: "" }]);
  }
  function removeStory(i: number) {
    setStory(prev => prev.filter((_, idx) => idx !== i));
  }

  /* ── save ── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/about", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stats, story, mission, vision }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">

      {/* ── Studio Metrics ── */}
      <section className={sectionClass}>
        <h2 className="text-sm font-medium text-white/60 uppercase tracking-widest">Studio Metrics</h2>
        <p className="text-xs text-white/30">The 4 stats shown in the about page hero band.</p>

        <div className="space-y-6">
          {stats.map((stat, i) => (
            <div key={i} className="grid grid-cols-[80px_80px_1fr_1fr] gap-3 items-start">
              <div>
                <label className={labelClass}>Value</label>
                <input
                  type="number"
                  className={inputClass}
                  value={stat.value}
                  onChange={e => updateStat(i, "value", Number(e.target.value))}
                />
              </div>
              <div>
                <label className={labelClass}>Suffix</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="+, %, yr…"
                  value={stat.suffix}
                  onChange={e => updateStat(i, "suffix", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Label</label>
                <input
                  type="text"
                  className={inputClass}
                  value={stat.label}
                  onChange={e => updateStat(i, "label", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <input
                  type="text"
                  className={inputClass}
                  value={stat.desc}
                  onChange={e => updateStat(i, "desc", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className={sectionClass}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-white/60 uppercase tracking-widest">Our Story — Timeline</h2>
          <button
            type="button"
            onClick={addStory}
            className="text-xs text-[#3ABF8A] border border-[#3ABF8A]/30 px-3 py-1.5 rounded-lg hover:bg-[#3ABF8A]/10 transition-colors"
          >
            + Add milestone
          </button>
        </div>

        <div className="space-y-5">
          {story.map((event, i) => (
            <div key={i} className="relative border border-white/[0.06] rounded-lg p-4 space-y-3">
              <button
                type="button"
                onClick={() => removeStory(i)}
                className="absolute top-3 right-3 text-white/20 hover:text-red-400 text-xs transition-colors"
              >
                ✕
              </button>
              <div className="grid grid-cols-[100px_1fr] gap-3">
                <div>
                  <label className={labelClass}>Year</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={event.year}
                    onChange={e => updateStory(i, "year", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Title</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={event.title}
                    onChange={e => updateStory(i, "title", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Body</label>
                <textarea
                  rows={3}
                  className={inputClass}
                  value={event.body}
                  onChange={e => updateStory(i, "body", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission ── */}
      <section className={sectionClass}>
        <h2 className="text-sm font-medium text-white/60 uppercase tracking-widest">Mission</h2>
        <p className="text-xs text-white/30">Displayed in the &quot;What drives us&quot; section — Mission card.</p>
        <textarea
          rows={4}
          className={inputClass}
          value={mission}
          onChange={e => setMission(e.target.value)}
          placeholder={DEFAULT_MISSION}
        />
      </section>

      {/* ── Vision ── */}
      <section className={sectionClass}>
        <h2 className="text-sm font-medium text-white/60 uppercase tracking-widest">Vision</h2>
        <p className="text-xs text-white/30">Displayed in the &quot;What drives us&quot; section — Vision card.</p>
        <textarea
          rows={4}
          className={inputClass}
          value={vision}
          onChange={e => setVision(e.target.value)}
          placeholder={DEFAULT_VISION}
        />
      </section>

      {/* ── Save ── */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-[#3ABF8A] text-black text-sm font-semibold rounded-lg hover:bg-[#2ea876] transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        {saved && <span className="text-xs text-[#3ABF8A]">✓ Saved</span>}
      </div>
    </form>
  );
}
