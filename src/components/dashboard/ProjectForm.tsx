"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProjectData {
  id?: string;
  title?: string;
  titleAr?: string;
  slug?: string;
  description?: string;
  descriptionAr?: string;
  client?: string;
  clientAr?: string;
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
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function ProjectForm({ initial }: { initial?: ProjectData }) {
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
    ...initial,
  });

  const [tagsInput, setTagsInput] = useState(
    (initial?.tags ?? []).join(", ")
  );
  const [tagsArInput, setTagsArInput] = useState((initial?.tagsAr ?? []).join(", "));
  const [imagesInput, setImagesInput] = useState(
    (initial?.images ?? []).join("\n")
  );
  const [uploading, setUploading] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(field: keyof ProjectData, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function uploadFile(file: File, field: "coverImage" | "gifUrl") {
    setUploading(field);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "dontforget/projects");
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    set(field, data.url);
    setUploading(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      tagsAr: tagsArInput.split(",").map((tag) => tag.trim()).filter(Boolean),
      images: imagesInput.split("\n").map((u) => u.trim()).filter(Boolean),
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
      return;
    }

    router.push("/dashboard/projects");
    router.refresh();
  }

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#2ea876] transition-colors text-sm";
  const labelClass = "block text-xs text-white/50 uppercase tracking-widest mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* Basic info */}
      <section className="bg-zinc-900 border border-white/5 rounded-xl p-6 space-y-5">
        <h2 className="text-sm font-medium text-white/60 uppercase tracking-widest">
          Basic Info
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Title *</label>
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => {
                set("title", e.target.value);
                if (!editing) set("slug", slugify(e.target.value));
              }}
              required
              placeholder="Elia Clinic"
            />
          </div>
          <div>
            <label className={labelClass}>Slug *</label>
            <input
              className={inputClass}
              value={form.slug}
              onChange={(e) => set("slug", slugify(e.target.value))}
              required
              placeholder="elia-clinic"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Client</label>
            <input
              className={inputClass}
              value={form.client}
              onChange={(e) => set("client", e.target.value)}
              placeholder="Elia Clinic"
            />
          </div>
          <div>
            <label className={labelClass}>Year</label>
            <input
              className={inputClass}
              value={form.year}
              onChange={(e) => set("year", e.target.value)}
              placeholder="2025"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Category</label>
            <input
              className={inputClass}
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              placeholder="Healthcare · Web Design"
            />
          </div>
          <div>
            <label className={labelClass}>Tags (comma separated)</label>
            <input
              className={inputClass}
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="branding, web, motion"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            className={`${inputClass} h-32 resize-none`}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="A brief case study overview…"
          />
        </div>
      </section>

      <section className="bg-zinc-900 border border-white/5 rounded-xl p-6 space-y-5">
        <h2 className="text-sm font-medium text-white/60 uppercase tracking-widest">
          Arabic Content
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Arabic Title</label>
            <input dir="rtl" className={inputClass} value={form.titleAr} onChange={(e) => set("titleAr", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Arabic Client</label>
            <input dir="rtl" className={inputClass} value={form.clientAr} onChange={(e) => set("clientAr", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Arabic Category</label>
            <input dir="rtl" className={inputClass} value={form.categoryAr} onChange={(e) => set("categoryAr", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Arabic Tags (comma separated)</label>
            <input dir="rtl" className={inputClass} value={tagsArInput} onChange={(e) => setTagsArInput(e.target.value)} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Arabic Description</label>
          <textarea dir="rtl" className={`${inputClass} h-32 resize-none`} value={form.descriptionAr} onChange={(e) => set("descriptionAr", e.target.value)} />
        </div>
      </section>

      {/* Media */}
      <section className="bg-zinc-900 border border-white/5 rounded-xl p-6 space-y-5">
        <h2 className="text-sm font-medium text-white/60 uppercase tracking-widest">
          Media
        </h2>

        <div>
          <label className={labelClass}>Cover Image</label>
          <div className="flex gap-3 items-start">
            <input
              className={`${inputClass} flex-1`}
              value={form.coverImage}
              onChange={(e) => set("coverImage", e.target.value)}
              placeholder="https://res.cloudinary.com/…"
            />
            <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 text-xs px-4 py-3 rounded-lg transition-colors whitespace-nowrap">
              {uploading === "coverImage" ? "Uploading…" : "Upload"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadFile(file, "coverImage");
                }}
              />
            </label>
          </div>
          {form.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.coverImage}
              alt="Cover preview"
              className="mt-3 h-32 rounded-lg object-cover"
            />
          )}
        </div>

        <div>
          <label className={labelClass}>Additional Images (one URL per line)</label>
          <textarea
            className={`${inputClass} h-28 resize-none font-mono text-xs`}
            value={imagesInput}
            onChange={(e) => setImagesInput(e.target.value)}
            placeholder={"https://res.cloudinary.com/…\nhttps://res.cloudinary.com/…"}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Video URL</label>
            <input
              className={inputClass}
              value={form.videoUrl}
              onChange={(e) => set("videoUrl", e.target.value)}
              placeholder="https://vimeo.com/…"
            />
          </div>
          <div>
            <label className={labelClass}>GIF</label>
            <div className="flex gap-3 items-start">
              <input
                className={`${inputClass} flex-1`}
                value={form.gifUrl}
                onChange={(e) => set("gifUrl", e.target.value)}
                placeholder="https://res.cloudinary.com/…"
              />
              <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 text-xs px-4 py-3 rounded-lg transition-colors whitespace-nowrap">
                {uploading === "gifUrl" ? "Uploading…" : "Upload"}
                <input
                  type="file"
                  accept="image/gif,video/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadFile(file, "gifUrl");
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Links */}
      <section className="bg-zinc-900 border border-white/5 rounded-xl p-6 space-y-5">
        <h2 className="text-sm font-medium text-white/60 uppercase tracking-widest">
          Links
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Live URL</label>
            <input
              className={inputClass}
              value={form.liveUrl}
              onChange={(e) => set("liveUrl", e.target.value)}
              placeholder="https://…"
            />
          </div>
          <div>
            <label className={labelClass}>GitHub URL</label>
            <input
              className={inputClass}
              value={form.githubUrl}
              onChange={(e) => set("githubUrl", e.target.value)}
              placeholder="https://github.com/…"
            />
          </div>
          <div>
            <label className={labelClass}>Case Study URL</label>
            <input
              className={inputClass}
              value={form.caseStudyUrl}
              onChange={(e) => set("caseStudyUrl", e.target.value)}
              placeholder="https://…"
            />
          </div>
        </div>
      </section>

      {/* Settings */}
      <section className="bg-zinc-900 border border-white/5 rounded-xl p-6 space-y-5">
        <h2 className="text-sm font-medium text-white/60 uppercase tracking-widest">
          Settings
        </h2>
        <div className="flex flex-wrap gap-6 items-center">
          <div>
            <label className={labelClass}>Status</label>
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Order</label>
            <input
              type="number"
              className={`${inputClass} w-24`}
              value={form.order}
              onChange={(e) => set("order", Number(e.target.value))}
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer mt-4">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="w-4 h-4 accent-[#2ea876]"
            />
            <span className="text-sm text-white/60">Featured project</span>
          </label>
        </div>
      </section>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#3ABF8A] hover:bg-[#2ea876] disabled:opacity-50 text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors"
        >
          {saving ? "Saving…" : editing ? "Save Changes" : "Create Project"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-white/5 hover:bg-white/10 text-white/60 text-sm px-6 py-3 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
