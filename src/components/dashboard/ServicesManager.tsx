"use client";

import { useState } from "react";
import MediaPicker from "./MediaPicker";

type MediaAssetItem = { id: string; url: string; originalName?: string | null; filename?: string | null };
type TechItem = { id: string; name: string; icon?: string | null; iconUrl?: string | null };
type AttachmentInput = { mediaId: string; role: string; theme?: string | null; order?: number };
type ServiceRecord = {
  id: string; title: string; titleAr?: string | null; slug: string; description?: string | null; descriptionAr?: string | null;
  shortDescription?: string | null; tagline?: string | null; benefits: unknown; deliverables: unknown; process: unknown;
  techStack: unknown;
  featured: boolean; seoTitle?: string | null; seoDescription?: string | null; icon?: string | null; order: number; active: boolean;
  attachments?: AttachmentInput[];
};

type ServiceForm = Omit<ServiceRecord, "id">;

const empty: ServiceForm = {
  title: "",
  titleAr: "",
  slug: "",
  description: "",
  descriptionAr: "",
  shortDescription: "",
  tagline: "",
  benefits: [],
  deliverables: [],
  process: [],
  techStack: [],
  featured: false,
  seoTitle: "",
  seoDescription: "",
  icon: "",
  order: 0,
  active: true,
  attachments: [],
};

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function lines(value: unknown) {
  return Array.isArray(value) ? value.join("\n") : "";
}

function parseLines(value: string) {
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
}

export default function ServicesManager({
  initial,
  mediaAssets = [],
  techItems = [],
}: {
  initial: ServiceRecord[];
  mediaAssets?: MediaAssetItem[];
  techItems?: TechItem[];
}) {
  const [services, setServices] = useState(initial);
  const [editing, setEditing] = useState<ServiceRecord | null>(null);
  const [form, setForm] = useState<ServiceForm>(empty);
  const [benefitsText, setBenefitsText] = useState("");
  const [processText, setProcessText] = useState("");
  const [saving, setSaving] = useState(false);
  const selectedTech = Array.isArray(form.techStack) ? form.techStack.filter((id): id is string => typeof id === "string") : [];

  function openNew() {
    setEditing(null);
    setForm(empty);
    setBenefitsText("");
    setProcessText("");
  }

  function openEdit(s: ServiceRecord) {
    setEditing(s);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = s;
    setForm({ ...empty, ...rest });
    setBenefitsText(lines(s.benefits));
    setProcessText(lines(s.process));
  }

  function set<K extends keyof ServiceForm>(key: K, value: ServiceForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setAttachment(role: string, mediaId: string, theme: string | null = null) {
    const attachments = form.attachments ?? [];
    set("attachments", [
      ...attachments.filter((item) => !(item.role === role && (item.theme ?? null) === theme)),
      ...(mediaId ? [{ role, mediaId, theme, order: 0 }] : []),
    ]);
  }

  function attachmentValue(role: string, theme: string | null = null) {
    return form.attachments?.find((item) => item.role === role && (item.theme ?? null) === theme)?.mediaId ?? "";
  }

  async function save() {
    setSaving(true);
    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
      benefits: parseLines(benefitsText),
      deliverables: [],
      process: parseLines(processText),
    };
    const res = await fetch(editing ? `/api/services/${editing.id}` : "/api/services", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const saved = await res.json();
    setSaving(false);
    if (!res.ok) return alert(saved.error ?? "Save failed");
    setServices((prev) => editing ? prev.map((s) => (s.id === editing.id ? saved : s)) : [...prev, saved]);
    openNew();
  }

  async function deleteService(id: string) {
    if (!confirm("Delete this service?")) return;
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    setServices((prev) => prev.filter((s) => s.id !== id));
  }

  const input = "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#2ea876] transition-colors text-sm";
  const label = "block text-xs text-white/50 uppercase tracking-widest mb-2";
  const mediaSelect = (role: string, theme: string | null, text: string) => (
    <MediaPicker assets={mediaAssets} value={attachmentValue(role, theme)} onChange={(mediaId) => setAttachment(role, mediaId, theme)} label={text} />
  );
  const toggleTech = (id: string) => {
    set("techStack", selectedTech.includes(id) ? selectedTech.filter((item) => item !== id) : [...selectedTech, id]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={openNew} className="bg-[#3ABF8A] hover:bg-[#2ea876] text-white text-sm px-4 py-2 rounded-lg transition-colors">+ Add Service</button>
      </div>

      {(editing !== null || form.title !== "") && (
        <div className="bg-zinc-900 border border-white/5 rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-medium text-white/60 uppercase tracking-widest">{editing ? "Edit Service" : "New Service"}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={label}>Title *</label><input className={input} value={form.title} onChange={(e) => { set("title", e.target.value); if (!editing) set("slug", slugify(e.target.value)); }} /></div>
            <div><label className={label}>Slug *</label><input className={input} value={form.slug} onChange={(e) => set("slug", slugify(e.target.value))} /></div>
            <div><label className={label}>Icon</label><input className={input} value={form.icon ?? ""} onChange={(e) => set("icon", e.target.value)} /></div>
            <div><label className={label}>Tagline</label><input className={input} value={form.tagline ?? ""} onChange={(e) => set("tagline", e.target.value)} /></div>
          </div>
          <div><label className={label}>Description</label><textarea className={`${input} h-24 resize-none`} value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} /></div>
          <div><label className={label}>Short Description</label><textarea className={`${input} h-20 resize-none`} value={form.shortDescription ?? ""} onChange={(e) => set("shortDescription", e.target.value)} /></div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-widest text-white/40">Tech Stack</h3>
              <a href="/dashboard/tech" target="_blank" className="text-xs text-white/25 hover:text-white/60 transition-colors">Manage tech</a>
            </div>
            {techItems.length ? (
              <div className="flex flex-wrap gap-2">
                {techItems.map((tech) => {
                  const active = selectedTech.includes(tech.id);
                  return (
                    <button
                      key={tech.id}
                      type="button"
                      onClick={() => toggleTech(tech.id)}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${active ? "border-[#3ABF8A]/45 bg-[#3ABF8A]/12 text-[#3ABF8A]" : "border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white"}`}
                    >
                      {tech.iconUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={tech.iconUrl} alt="" className="h-4 w-4 object-contain" />
                      ) : tech.icon ? (
                        <span className="text-xs">{tech.icon}</span>
                      ) : null}
                      {tech.name}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-white/30">No tech items yet.</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={label}>Benefits</label><textarea className={`${input} h-32 resize-none`} value={benefitsText} onChange={(e) => setBenefitsText(e.target.value)} placeholder="One per line" /></div>
            <div><label className={label}>Process</label><textarea className={`${input} h-32 resize-none`} value={processText} onChange={(e) => setProcessText(e.target.value)} placeholder="One per line" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={label}>SEO Title</label><input className={input} value={form.seoTitle ?? ""} onChange={(e) => set("seoTitle", e.target.value)} /></div>
            <div><label className={label}>SEO Description</label><input className={input} value={form.seoDescription ?? ""} onChange={(e) => set("seoDescription", e.target.value)} /></div>
          </div>
          <div className="border-t border-white/5 pt-4 space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-white/40">Theme Media</h3>
            <div className="grid grid-cols-2 gap-4">
              {mediaSelect("creative_default", "creative", "Creative default")}
              {mediaSelect("creative_hover", "creative", "Creative hover")}
              {mediaSelect("immersive_left", "immersive", "Immersive left")}
              {mediaSelect("immersive_right", "immersive", "Immersive right")}
              {mediaSelect("immersive_shape", "immersive", "Immersive shape")}
              {mediaSelect("focused_icon", "focused", "Focused icon")}
            </div>
          </div>
          <div className="border-t border-white/5 pt-4 space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-white/40">Arabic Content</h3>
            <input dir="rtl" className={input} value={form.titleAr ?? ""} onChange={(e) => set("titleAr", e.target.value)} placeholder="Arabic title" />
            <textarea dir="rtl" className={`${input} h-24 resize-none`} value={form.descriptionAr ?? ""} onChange={(e) => set("descriptionAr", e.target.value)} />
          </div>
          <div className="flex items-center gap-6">
            <div><label className={label}>Order</label><input type="number" className={`${input} w-24`} value={form.order} onChange={(e) => set("order", Number(e.target.value))} /></div>
            <label className="flex items-center gap-2 cursor-pointer mt-4"><input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="accent-[#2ea876]" /><span className="text-sm text-white/60">Featured</span></label>
            <label className="flex items-center gap-2 cursor-pointer mt-4"><input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} className="accent-[#2ea876]" /><span className="text-sm text-white/60">Active</span></label>
          </div>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="bg-[#3ABF8A] hover:bg-[#2ea876] disabled:opacity-50 text-white text-sm px-6 py-2.5 rounded-lg transition-colors">{saving ? "Saving..." : "Save"}</button>
            <button onClick={openNew} className="bg-white/5 hover:bg-white/10 text-white/60 text-sm px-6 py-2.5 rounded-lg transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden">
        {services.length === 0 ? <div className="p-8 text-center text-white/30 text-sm">No services yet.</div> : (
          <table className="w-full">
            <thead><tr className="border-b border-white/5"><th className="text-left text-xs text-white/40 uppercase tracking-widest px-6 py-4">Service</th><th className="text-left text-xs text-white/40 uppercase tracking-widest px-6 py-4">Status</th><th className="px-6 py-4" /></tr></thead>
            <tbody>{services.map((s) => (
              <tr key={s.id} className="border-b border-white/5 last:border-0">
                <td className="px-6 py-4"><div className="text-sm text-white font-medium">{s.title}</div><div className="text-xs text-white/35">{s.slug}</div></td>
                <td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded-full ${s.active ? "bg-emerald-600/20 text-emerald-400" : "bg-white/5 text-white/30"}`}>{s.active ? "Active" : "Hidden"}</span></td>
                <td className="px-6 py-4"><div className="flex gap-3 justify-end"><button onClick={() => openEdit(s)} className="text-xs text-white/40 hover:text-white">Edit</button><button onClick={() => deleteService(s.id)} className="text-xs text-white/20 hover:text-red-400">Delete</button></div></td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}
