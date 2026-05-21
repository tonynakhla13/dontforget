"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PostData {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  tags?: string[];
  status?: "DRAFT" | "PUBLISHED";
  order?: number;
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

const inputCls = "w-full bg-zinc-800 border border-white/8 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#3ABF8A]/50 focus:bg-zinc-800/80 transition-colors";
const labelCls = "block text-xs font-medium text-white/50 uppercase tracking-widest mb-2";

export default function PostForm({ initial }: { initial?: PostData }) {
  const router = useRouter();
  const editing = !!initial?.id;

  const [form, setForm] = useState<PostData>({
    title: "", slug: "", excerpt: "", content: "", coverImage: "",
    tags: [], status: "DRAFT", order: 0,
    ...initial,
  });
  const [tagsInput, setTagsInput] = useState((initial?.tags ?? []).join(", "));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(field: keyof PostData, value: unknown) {
    setForm(p => ({ ...p, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean),
    };

    const url    = editing ? `/api/posts/${initial!.id}` : "/api/posts";
    const method = editing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const d = await res.json();
      setError(d.error || "Something went wrong");
      setSaving(false);
      return;
    }

    router.push("/dashboard/posts");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Title + Slug */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Title *</label>
          <input
            className={inputCls} required
            value={form.title} placeholder="Post title"
            onChange={e => { set("title", e.target.value); if (!editing) set("slug", slugify(e.target.value)); }}
          />
        </div>
        <div>
          <label className={labelCls}>Slug *</label>
          <input
            className={inputCls} required
            value={form.slug} placeholder="post-url-slug"
            onChange={e => set("slug", slugify(e.target.value))}
          />
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label className={labelCls}>Excerpt</label>
        <textarea
          className={`${inputCls} resize-none`} rows={2}
          value={form.excerpt} placeholder="Short summary shown in listings and meta…"
          onChange={e => set("excerpt", e.target.value)}
        />
      </div>

      {/* Content */}
      <div>
        <label className={labelCls}>Content <span className="normal-case text-white/30">(Markdown)</span></label>
        <textarea
          className={`${inputCls} resize-y font-mono text-[0.8rem] leading-relaxed`} rows={18}
          value={form.content} placeholder={"# Heading\n\nWrite your post content in Markdown…"}
          onChange={e => set("content", e.target.value)}
        />
      </div>

      {/* Cover image + Tags */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Cover image URL</label>
          <input
            className={inputCls}
            value={form.coverImage} placeholder="https://..."
            onChange={e => set("coverImage", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Tags <span className="normal-case text-white/30">(comma-separated)</span></label>
          <input
            className={inputCls}
            value={tagsInput} placeholder="seo, web dev, tips"
            onChange={e => setTagsInput(e.target.value)}
          />
        </div>
      </div>

      {/* Status + Order */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Status</label>
          <select
            className={inputCls}
            value={form.status}
            onChange={e => set("status", e.target.value as "DRAFT" | "PUBLISHED")}
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Order</label>
          <input
            type="number" className={inputCls}
            value={form.order}
            onChange={e => set("order", parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit" disabled={saving}
          className="bg-[#3ABF8A] hover:bg-[#2ea876] text-black text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : editing ? "Save changes" : "Create post"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/posts")}
          className="text-white/40 hover:text-white text-sm transition-colors px-4 py-2.5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
