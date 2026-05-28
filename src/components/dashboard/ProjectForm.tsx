"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("./RichTextEditor"), { ssr: false });

interface TechItem {
  id: string;
  name: string;
  icon?: string | null;
  iconUrl?: string | null;
}

interface ClientItem {
  id: string;
  name: string;
  company?: string | null;
  country?: string | null;
  logo?: string | null;
  website?: string | null;
}

interface SolutionOption {
  title: string;
  body: string;
}

interface ResultSlide {
  media: string;
  text: string;
}

interface GalleryItem {
  url: string;
  type: "image" | "video" | "pdf";
}

interface ProjectData {
  id?: string;
  title?: string;
  titleAr?: string;
  slug?: string;
  description?: string;
  descriptionAr?: string;
  client?: string;
  clientAr?: string;
  clientId?: string | null;
  year?: string;
  category?: string;
  categoryAr?: string;
  tags?: string[];
  tagsAr?: string[];
  coverImage?: string;
  images?: string[];
  videoUrl?: string;
  gifUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  caseStudyUrl?: string;
  featured?: boolean;
  status?: "DRAFT" | "PUBLISHED";
  order?: number;
  // Extended DNA fields
  projectType?: string;
  tagline?: string;
  shortDescription?: string;
  fullDescription?: string;
  location?: string;
  clientLogo?: string;
  techStack?: string[];
  challengePoints?: string[];
  obstacles?: string[];
  challengeTagline?: string;
  challengeResponses?: string[];
  solutionOptions?: SolutionOption[];
  clientChoice?: number | null;
  resultSlides?: ResultSlide[];
  testimonialText?: string;
  gallery?: GalleryItem[];
  extraMile?: string;
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function ProjectForm({
  initial,
  techItems = [],
  clientItems = [],
}: {
  initial?: ProjectData;
  techItems?: TechItem[];
  clientItems?: ClientItem[];
}) {
  const router = useRouter();
  const editing = !!initial?.id;

  const [form, setForm] = useState<ProjectData>({
    title: "",
    titleAr: "",
    slug: "",
    description: "",
    descriptionAr: "",
    client: "",
    clientAr: "",
    clientId: null,
    year: new Date().getFullYear().toString(),
    category: "",
    categoryAr: "",
    tags: [],
    tagsAr: [],
    coverImage: "",
    images: [],
    videoUrl: "",
    gifUrl: "",
    liveUrl: "",
    githubUrl: "",
    caseStudyUrl: "",
    featured: false,
    status: "DRAFT",
    order: 0,
    projectType: "web_development",
    tagline: "",
    shortDescription: "",
    fullDescription: "",
    location: "",
    clientLogo: "",
    techStack: [],
    challengePoints: ["", "", ""],
    obstacles: [""],
    challengeTagline: "",
    challengeResponses: ["", "", ""],
    solutionOptions: [{ title: "", body: "" }],
    clientChoice: null,
    resultSlides: [{ media: "", text: "" }],
    testimonialText: "",
    gallery: [],
    extraMile: "",
    ...initial,
  });

  const [tagsInput, setTagsInput] = useState((initial?.tags ?? []).join(", "));
  const [tagsArInput, setTagsArInput] = useState((initial?.tagsAr ?? []).join(", "));
  const [uploading, setUploading] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "unsaved" | "saving">("idle");

  function set(field: keyof ProjectData, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaveStatus("unsaved");
  }

  async function uploadFile(
    file: File,
    key: string,
    folder = "dontforget/projects",
    onDone?: (url: string) => void
  ) {
    setUploading(key);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      if (onDone) onDone(data.url);
      else set(key as keyof ProjectData, data.url);
      return data.url as string;
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveStatus("saving");
    setError("");

    const payload = {
      ...form,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
      tagsAr: tagsArInput.split(",").map((t) => t.trim()).filter(Boolean),
    };

    const url = editing ? `/api/projects/${initial!.id}` : "/api/projects";
    const method = editing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong");
      setSaving(false);
      setSaveStatus("unsaved");
      return;
    }

    setSaveStatus("idle");
    router.push("/dashboard/projects");
    router.refresh();
  }

  // ── style tokens ─────────────────────────────────────────────────────────
  const inp =
    "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#2ea876] transition-colors text-sm";
  const lbl = "block text-xs text-white/50 uppercase tracking-widest mb-2";
  const card = "bg-zinc-900 border border-white/[0.06] rounded-xl p-6 space-y-5";
  const sec = "text-sm font-medium text-white/50 uppercase tracking-widest";
  const addBtn =
    "text-xs text-[#3ABF8A] hover:text-[#2ea876] flex items-center gap-1.5 transition-colors mt-2";
  const uploadBtn =
    "cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 text-xs px-4 py-3 rounded-lg transition-colors whitespace-nowrap";

  // ── DNA helpers ───────────────────────────────────────────────────────────
  const pts = form.challengePoints ?? ["", "", ""];
  const obs = form.obstacles ?? [""];
  const resp = form.challengeResponses ?? ["", "", ""];
  const opts = form.solutionOptions ?? [{ title: "", body: "" }];
  const slides = form.resultSlides ?? [{ media: "", text: "" }];
  const gallery = form.gallery ?? [];

  function updateAt<T>(arr: T[], i: number, val: T): T[] {
    const next = [...arr];
    next[i] = val;
    return next;
  }

  // ── client picker ─────────────────────────────────────────────────────────
  function selectClient(c: ClientItem) {
    const alreadySelected = form.clientId === c.id;
    setForm((prev) => ({
      ...prev,
      clientId: alreadySelected ? null : c.id,
      client: alreadySelected ? prev.client : c.name,
      clientLogo: alreadySelected ? prev.clientLogo : (c.logo ?? prev.clientLogo),
    }));
    setSaveStatus("unsaved");
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* ── Sticky save bar ── */}
      <div className="sticky top-0 z-20 bg-zinc-950/90 backdrop-blur border-b border-white/[0.06] px-8 py-3 -mx-8 -mt-8 mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-white/40 text-sm truncate">
            {form.title || (editing ? "Project" : "New Project")}
          </span>
          {saveStatus !== "idle" && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                saveStatus === "saving"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-white/10 text-white/35"
              }`}
            >
              {saveStatus === "saving" ? "Saving…" : "Unsaved"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <select
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#2ea876] transition-colors"
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-white/5 hover:bg-white/10 text-white/60 text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-[#3ABF8A] hover:bg-[#2ea876] disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
          >
            {saving ? "Saving…" : editing ? "Save" : "Create"}
          </button>
        </div>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* ── SECTION 01 — Basic Info ── */}
        <section id="s01" className={card}>
          <h2 className={sec}>01 — Basic Info</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Project Name *</label>
              <input
                className={inp}
                value={form.title}
                onChange={(e) => {
                  set("title", e.target.value);
                  if (!editing) set("slug", slugify(e.target.value));
                }}
                required
                placeholder="Muntajab Platform"
              />
            </div>
            <div>
              <label className={lbl}>Slug *</label>
              <input
                className={inp}
                value={form.slug}
                onChange={(e) => set("slug", slugify(e.target.value))}
                required
                placeholder="muntajab-platform"
              />
            </div>
          </div>

          <div>
            <label className={lbl}>Tagline</label>
            <input
              className={inp}
              value={form.tagline}
              onChange={(e) => set("tagline", e.target.value)}
              placeholder="One line that captures the project's soul"
            />
          </div>

          <div>
            <label className={lbl}>Short Description</label>
            <textarea
              className={`${inp} h-20 resize-none`}
              value={form.shortDescription}
              onChange={(e) => set("shortDescription", e.target.value)}
              placeholder="2–3 sentence overview for cards and preview blocks"
            />
          </div>

          <div>
            <label className={lbl}>
              Full Description{" "}
              <span className="text-white/20 normal-case tracking-normal">(Markdown)</span>
            </label>
            <textarea
              className={`${inp} h-44 resize-none font-mono text-xs leading-relaxed`}
              value={form.fullDescription}
              onChange={(e) => set("fullDescription", e.target.value)}
              placeholder={"# Overview\n\nA full case study write-up goes here…"}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Location</label>
              <input
                className={inp}
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="Riyadh, Saudi Arabia"
              />
            </div>
            <div>
              <label className={lbl}>Year</label>
              <input
                className={inp}
                value={form.year}
                onChange={(e) => set("year", e.target.value)}
                placeholder="2025"
              />
            </div>
          </div>

          {/* ── Client picker ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className={lbl + " mb-0"}>Client</label>
              <a
                href="/dashboard/clients"
                target="_blank"
                className="text-xs text-white/25 hover:text-white/60 transition-colors"
              >
                Manage library ↗
              </a>
            </div>

            {clientItems.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {clientItems.map((c) => {
                  const selected = form.clientId === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => selectClient(c)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-sm transition-all ${
                        selected
                          ? "bg-[#3ABF8A]/10 border-[#3ABF8A]/40 text-white"
                          : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/20"
                      }`}
                    >
                      {c.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.logo} alt={c.name} className="h-4 w-auto object-contain" />
                      ) : (
                        <span className="text-white/30 text-xs">⟡</span>
                      )}
                      <span className="flex flex-col leading-tight text-left">
                        <span>{c.name}</span>
                        {(c.company || c.country) && (
                          <span className="text-[10px] text-white/30 font-normal">
                            {[c.company, c.country].filter(Boolean).join(" · ")}
                          </span>
                        )}
                      </span>
                      {selected && <span className="text-[#3ABF8A] text-xs">✓</span>}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>
                  Client Name{" "}
                  <span className="text-white/20 normal-case tracking-normal">
                    (auto-filled from picker, or enter manually)
                  </span>
                </label>
                <input
                  className={inp}
                  value={form.client}
                  onChange={(e) => { set("client", e.target.value); set("clientId", null); }}
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <label className={lbl}>Live URL</label>
                <input
                  type="url"
                  className={inp}
                  value={form.liveUrl}
                  onChange={(e) => set("liveUrl", e.target.value)}
                  placeholder="https://muntajab.com"
                />
              </div>
            </div>

            <div>
              <label className={lbl}>Client Logo</label>
              <div className="flex gap-3 items-start">
                <input
                  className={`${inp} flex-1`}
                  value={form.clientLogo}
                  onChange={(e) => set("clientLogo", e.target.value)}
                  placeholder="Paste URL or upload →"
                />
                <label className={uploadBtn}>
                  {uploading === "clientLogo" ? "Uploading…" : "Upload"}
                  <input
                    type="file"
                    accept="image/*,image/svg+xml"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadFile(f, "clientLogo", "dontforget/clients");
                    }}
                  />
                </label>
              </div>
              {form.clientLogo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.clientLogo}
                  alt="Client logo"
                  className="mt-3 h-12 rounded object-contain bg-white/5 p-2"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Category</label>
              <input
                className={inp}
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                placeholder="Web Development · SaaS"
              />
            </div>
            <div>
              <label className={lbl}>
                Tags{" "}
                <span className="text-white/20 normal-case tracking-normal">(comma separated)</span>
              </label>
              <input
                className={inp}
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="nextjs, dashboard, arabic"
              />
            </div>
          </div>
        </section>

        {/* ── Localization ── */}
        <section id="l10n" className={card}>
          <h2 className={sec}>Arabic / Localization</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Arabic Title</label>
              <input dir="rtl" className={inp} value={form.titleAr} onChange={(e) => set("titleAr", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Arabic Client</label>
              <input dir="rtl" className={inp} value={form.clientAr} onChange={(e) => set("clientAr", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>Arabic Category</label>
              <input dir="rtl" className={inp} value={form.categoryAr} onChange={(e) => set("categoryAr", e.target.value)} />
            </div>
            <div>
              <label className={lbl}>
                Arabic Tags{" "}
                <span className="text-white/20 normal-case tracking-normal">(comma separated)</span>
              </label>
              <input dir="rtl" className={inp} value={tagsArInput} onChange={(e) => setTagsArInput(e.target.value)} />
            </div>
          </div>
          <div>
            <label className={lbl}>Arabic Description</label>
            <textarea dir="rtl" className={`${inp} h-28 resize-none`} value={form.descriptionAr} onChange={(e) => set("descriptionAr", e.target.value)} />
          </div>
        </section>

        {/* ── SECTION 02 — Hero Media ── */}
        <section id="s02" className={card}>
          <h2 className={sec}>02 — Hero Media</h2>

          <div>
            <label className={lbl}>Cover Image</label>
            <div className="flex gap-3 items-start">
              <input
                className={`${inp} flex-1`}
                value={form.coverImage}
                onChange={(e) => set("coverImage", e.target.value)}
                placeholder="Paste URL or upload →"
              />
              <label className={uploadBtn}>
                {uploading === "coverImage" ? "Uploading…" : "Upload"}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f, "coverImage"); }} />
              </label>
            </div>
            {form.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.coverImage} alt="Cover" className="mt-3 h-32 rounded-lg object-cover" />
            )}
          </div>

          <div>
            <label className={lbl}>Project GIF / Hero Animation</label>
            <div className="flex gap-3 items-start">
              <input
                className={`${inp} flex-1`}
                value={form.gifUrl}
                onChange={(e) => set("gifUrl", e.target.value)}
                placeholder="Paste URL or upload →"
              />
              <label className={uploadBtn}>
                {uploading === "gifUrl" ? "Uploading…" : "Upload"}
                <input type="file" accept="image/gif,image/*,video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f, "gifUrl"); }} />
              </label>
            </div>
            {form.gifUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.gifUrl} alt="GIF preview" className="mt-3 h-32 rounded-lg object-cover" />
            )}
          </div>

          <div>
            <label className={lbl}>
              Project Video{" "}
              <span className="text-white/20 normal-case tracking-normal">(URL or upload)</span>
            </label>
            <div className="flex gap-3 items-start">
              <input
                className={`${inp} flex-1`}
                value={form.videoUrl}
                onChange={(e) => set("videoUrl", e.target.value)}
                placeholder="https://vimeo.com/… or paste URL"
              />
              <label className={uploadBtn}>
                {uploading === "videoUrl" ? "Uploading…" : "Upload"}
                <input type="file" accept="video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f, "videoUrl"); }} />
              </label>
            </div>
          </div>
        </section>

        {/* ── SECTION 03 — Tech Stack ── */}
        <section id="s03" className={card}>
          <div className="flex items-center justify-between">
            <h2 className={sec}>03 — Tech Stack</h2>
            <a href="/dashboard/tech" target="_blank" className="text-xs text-white/25 hover:text-white/60 transition-colors">
              Manage library ↗
            </a>
          </div>

          {techItems.length === 0 ? (
            <p className="text-white/30 text-sm">
              No tech items in the library yet.{" "}
              <a href="/dashboard/tech" target="_blank" className="text-[#3ABF8A] hover:underline">Add some →</a>
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {techItems.map((tech) => {
                const selected = (form.techStack ?? []).includes(tech.id);
                return (
                  <button
                    key={tech.id}
                    type="button"
                    onClick={() => {
                      const current = form.techStack ?? [];
                      set("techStack", selected ? current.filter((t) => t !== tech.id) : [...current, tech.id]);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-all ${
                      selected
                        ? "bg-[#3ABF8A]/12 border-[#3ABF8A]/40 text-[#3ABF8A]"
                        : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/20"
                    }`}
                  >
                    {tech.iconUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={tech.iconUrl} alt={tech.name} className="h-4 w-4 object-contain" />
                    ) : tech.icon ? (
                      <span>{tech.icon}</span>
                    ) : null}
                    {tech.name}
                    {selected && <span className="text-xs">✓</span>}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* ── SECTION 04 — Project DNA ── */}
        <div id="s04" className="space-y-4">
          <h2 className={`${sec} px-1`}>04 — Project DNA</h2>

          {/* 4A — Challenge */}
          <div className={card}>
            <h3 className="text-sm text-white/40 font-medium">4A — Challenge</h3>

            <div>
              <label className={lbl}>Challenge Points <span className="text-white/20 normal-case tracking-normal">(exactly 3)</span></label>
              <div className="space-y-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-white/20 text-xs w-5 text-right shrink-0">{i + 1}.</span>
                    <input
                      className={inp}
                      value={pts[i] ?? ""}
                      onChange={(e) => set("challengePoints", updateAt(pts, i, e.target.value))}
                      placeholder={`Challenge ${i + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className={lbl}>Obstacles <span className="text-white/20 normal-case tracking-normal">(4–5 items)</span></label>
              <div className="space-y-2">
                {obs.map((o, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-white/20 text-sm shrink-0">•</span>
                    <input
                      className={`${inp} flex-1`}
                      value={o}
                      onChange={(e) => set("obstacles", updateAt(obs, i, e.target.value))}
                      placeholder={`Obstacle ${i + 1}`}
                    />
                    <button type="button" onClick={() => set("obstacles", obs.filter((_, idx) => idx !== i))} className="text-white/20 hover:text-red-400 text-sm px-1 transition-colors">×</button>
                  </div>
                ))}
              </div>
              {obs.length < 5 && (
                <button type="button" onClick={() => set("obstacles", [...obs, ""])} className={addBtn}>
                  + Add obstacle
                </button>
              )}
            </div>

            <div>
              <label className={lbl}>Challenge Tagline</label>
              <input className={inp} value={form.challengeTagline} onChange={(e) => set("challengeTagline", e.target.value)} placeholder="The core problem in one punchy line" />
            </div>
          </div>

          {/* 4B — Proposed */}
          <div className={card}>
            <h3 className="text-sm text-white/40 font-medium">4B — Proposed Solution</h3>

            <div>
              <label className={lbl}>Challenge Responses <span className="text-white/20 normal-case tracking-normal">(one per challenge point)</span></label>
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="space-y-1.5">
                    {pts[i] && <p className="text-xs text-white/25 pl-7">↳ Challenge {i + 1}: {pts[i]}</p>}
                    <div className="flex items-center gap-2">
                      <span className="text-white/20 text-xs w-5 text-right shrink-0">{i + 1}.</span>
                      <input
                        className={inp}
                        value={resp[i] ?? ""}
                        onChange={(e) => set("challengeResponses", updateAt(resp, i, e.target.value))}
                        placeholder={`Challenge ${i + 1} — what we did`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className={lbl}>Solution Options <span className="text-white/20 normal-case tracking-normal">(2–3 options)</span></label>
              <div className="space-y-4">
                {opts.map((opt, i) => {
                  const isChosen = form.clientChoice === i;
                  return (
                    <div
                      key={i}
                      className={`rounded-xl border p-4 space-y-3 transition-all ${
                        isChosen ? "border-[#3ABF8A]/40 bg-[#3ABF8A]/[0.04]" : "border-white/[0.08] bg-white/[0.02]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/30">Option {String.fromCharCode(65 + i)}</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => set("clientChoice", isChosen ? null : i)}
                            className={`text-xs px-3 py-1 rounded-full border transition-all ${
                              isChosen
                                ? "bg-[#3ABF8A]/20 border-[#3ABF8A]/50 text-[#3ABF8A]"
                                : "border-white/10 text-white/30 hover:border-[#3ABF8A]/40 hover:text-[#3ABF8A]"
                            }`}
                          >
                            {isChosen ? "✓ Client's choice" : "Mark as chosen"}
                          </button>
                          {opts.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                set("solutionOptions", opts.filter((_, idx) => idx !== i));
                                if (form.clientChoice === i) set("clientChoice", null);
                                else if ((form.clientChoice ?? 0) > i) set("clientChoice", (form.clientChoice ?? 0) - 1);
                              }}
                              className="text-white/20 hover:text-red-400 text-sm transition-colors"
                            >×</button>
                          )}
                        </div>
                      </div>
                      <input
                        className={inp}
                        value={opt.title}
                        onChange={(e) => set("solutionOptions", updateAt(opts, i, { ...opt, title: e.target.value }))}
                        placeholder={`Option ${String.fromCharCode(65 + i)}: Next.js + Supabase`}
                      />
                      <textarea
                        className={`${inp} h-24 resize-none text-xs font-mono leading-relaxed`}
                        value={opt.body}
                        onChange={(e) => set("solutionOptions", updateAt(opts, i, { ...opt, body: e.target.value }))}
                        placeholder="Describe this approach… (Markdown supported)"
                      />
                    </div>
                  );
                })}
              </div>
              {opts.length < 3 && (
                <button type="button" onClick={() => set("solutionOptions", [...opts, { title: "", body: "" }])} className={addBtn}>
                  + Add option
                </button>
              )}
            </div>
          </div>

          {/* 4C — Results */}
          <div className={card}>
            <h3 className="text-sm text-white/40 font-medium">4C — Results</h3>

            <div className="space-y-4">
              {slides.map((slide, i) => (
                <div key={i} className="border border-white/[0.08] rounded-xl p-4 space-y-3 bg-white/[0.02]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/30">Slide {i + 1}</span>
                    {slides.length > 1 && (
                      <button type="button" onClick={() => set("resultSlides", slides.filter((_, idx) => idx !== i))} className="text-white/20 hover:text-red-400 text-sm transition-colors">×</button>
                    )}
                  </div>
                  <div className="flex gap-3 items-start">
                    <input
                      className={`${inp} flex-1`}
                      value={slide.media}
                      onChange={(e) => set("resultSlides", updateAt(slides, i, { ...slide, media: e.target.value }))}
                      placeholder="Paste URL or upload → above (image or video)"
                    />
                    <label className={uploadBtn}>
                      {uploading === `slide-${i}` ? "Uploading…" : "Upload"}
                      <input
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f)
                            uploadFile(f, `slide-${i}`, "dontforget/projects/results", (url) =>
                              set("resultSlides", updateAt(slides, i, { ...slide, media: url }))
                            );
                        }}
                      />
                    </label>
                  </div>
                  {slide.media && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={slide.media} alt={`Slide ${i + 1}`} className="h-24 rounded-lg object-cover" />
                  )}
                  <div>
                    <label className={lbl}>Slide text</label>
                    <RichTextEditor
                      value={slide.text}
                      onChange={(html) => set("resultSlides", updateAt(slides, i, { ...slide, text: html }))}
                      placeholder="Caption, result description, stats…"
                      minHeight="100px"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => set("resultSlides", [...slides, { media: "", text: "" }])} className={addBtn}>
              + Add result slide
            </button>
          </div>

          {/* 4D — Testimonial */}
          <div className={card}>
            <h3 className="text-sm text-white/40 font-medium">4D — Testimonial</h3>
            <div>
              <label className={lbl}>What the client said</label>
              <textarea
                className={`${inp} h-32 resize-none`}
                value={form.testimonialText}
                onChange={(e) => set("testimonialText", e.target.value)}
                placeholder={`"Working with the team was a game-changer for our business…"`}
              />
            </div>
          </div>
        </div>

        {/* ── SECTION 05 — Gallery ── */}
        <section id="s05" className={card}>
          <h2 className={sec}>05 — Project Gallery</h2>

          <label className="flex items-center justify-center gap-2 w-full border border-dashed border-white/15 rounded-xl p-10 text-white/30 hover:text-white/55 hover:border-white/30 transition-all text-sm cursor-pointer">
            {uploading === "gallery" ? (
              <span>Uploading…</span>
            ) : (
              <><span className="text-xl">+</span> Upload images, videos, or PDFs</>
            )}
            <input
              type="file"
              accept="image/*,video/*,application/pdf"
              multiple
              className="hidden"
              onChange={async (e) => {
                if (!e.target.files) return;
                const files = Array.from(e.target.files);
                const newItems: GalleryItem[] = [];
                try {
                  for (const file of files) {
                    setUploading("gallery");
                    const fd = new FormData();
                    fd.append("file", file);
                    fd.append("folder", "dontforget/projects/gallery");
                    const res = await fetch("/api/upload", { method: "POST", body: fd });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error ?? "Upload failed");
                    const type = file.type.startsWith("video/") ? "video" : file.type === "application/pdf" ? "pdf" : "image";
                    newItems.push({ url: data.url, type });
                  }
                  set("gallery", [...gallery, ...newItems]);
                } catch (err) {
                  alert(err instanceof Error ? err.message : "Upload failed");
                } finally {
                  setUploading(null);
                }
              }}
            />
          </label>

          {gallery.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {gallery.map((item, i) => (
                <div key={i} className="relative group rounded-lg overflow-hidden aspect-video bg-white/5">
                  {item.type === "pdf" ? (
                    <div className="flex items-center justify-center h-full text-white/30 text-xs gap-1"><span>📄</span> PDF</div>
                  ) : item.type === "video" ? (
                    <video src={item.url} className="w-full h-full object-cover" muted />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                  )}
                  <button
                    type="button"
                    onClick={() => set("gallery", gallery.filter((_, idx) => idx !== i))}
                    className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/70 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center leading-none"
                  >×</button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── SECTION 06 — Extra Mile ── */}
        <section id="s06" className={card}>
          <h2 className={sec}>06 — Extra Mile</h2>
          <div>
            <label className={lbl}>
              What went beyond the brief{" "}
              <span className="text-white/20 normal-case tracking-normal">(Markdown or bullet list)</span>
            </label>
            <textarea
              className={`${inp} h-40 resize-none text-xs font-mono leading-relaxed`}
              value={form.extraMile}
              onChange={(e) => set("extraMile", e.target.value)}
              placeholder={"- Custom animation system\n- Bilingual RTL support from day one\n- Performance: 98 Lighthouse score"}
            />
          </div>
        </section>

        {/* ── Settings ── */}
        <section id="settings" className={card}>
          <h2 className={sec}>Settings</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>GitHub URL</label>
              <input className={inp} value={form.githubUrl} onChange={(e) => set("githubUrl", e.target.value)} placeholder="https://github.com/…" />
            </div>
            <div>
              <label className={lbl}>Case Study URL</label>
              <input className={inp} value={form.caseStudyUrl} onChange={(e) => set("caseStudyUrl", e.target.value)} placeholder="https://…" />
            </div>
          </div>
          <div className="flex flex-wrap gap-6 items-center pt-1">
            <div>
              <label className={lbl}>Order</label>
              <input type="number" className={`${inp} w-24`} value={form.order} onChange={(e) => set("order", Number(e.target.value))} />
            </div>
            <label className="flex items-center gap-3 cursor-pointer mt-4">
              <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="w-4 h-4 accent-[#2ea876]" />
              <span className="text-sm text-white/60">Featured project</span>
            </label>
          </div>
        </section>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-4 pb-20">
          <button type="submit" disabled={saving} className="bg-[#3ABF8A] hover:bg-[#2ea876] disabled:opacity-50 text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors">
            {saving ? "Saving…" : editing ? "Save Changes" : "Create Project"}
          </button>
          <button type="button" onClick={() => router.back()} className="bg-white/5 hover:bg-white/10 text-white/60 text-sm px-6 py-3 rounded-lg transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
