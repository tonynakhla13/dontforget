"use client";

import { useEffect, useState } from "react";

interface TechItem {
  id: string;
  name: string;
  icon?: string | null;
  iconUrl?: string | null;
  order: number;
}

const inp =
  "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#2ea876] transition-colors text-sm";
const lbl = "block text-xs text-white/50 uppercase tracking-widest mb-2";
const uploadBtn =
  "cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 text-xs px-4 py-3 rounded-lg transition-colors whitespace-nowrap";

export default function TechLibraryPage() {
  const [items, setItems] = useState<TechItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("");
  const [newIconUrl, setNewIconUrl] = useState("");
  const [uploading, setUploading] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [editIconUrl, setEditIconUrl] = useState("");

  async function load() {
    const res = await fetch("/api/tech");
    setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function uploadIcon(file: File, onDone: (url: string) => void) {
    setUploading("icon");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "dontforget/tech-icons");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      onDone(data.url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  }

  async function handleAdd() {
    if (!newName.trim()) return;
    setSaving(true);
    await fetch("/api/tech", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName.trim(),
        icon: newIcon.trim() || null,
        iconUrl: newIconUrl.trim() || null,
        order: items.length,
      }),
    });
    setNewName(""); setNewIcon(""); setNewIconUrl("");
    setAdding(false);
    setSaving(false);
    load();
  }

  async function handleSaveEdit(id: string) {
    setSaving(true);
    await fetch(`/api/tech/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editName.trim(),
        icon: editIcon.trim() || null,
        iconUrl: editIconUrl.trim() || null,
      }),
    });
    setEditingId(null);
    setSaving(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this tech item?")) return;
    await fetch(`/api/tech/${id}`, { method: "DELETE" });
    load();
  }

  function startEdit(item: TechItem) {
    setEditingId(item.id);
    setEditName(item.name);
    setEditIcon(item.icon ?? "");
    setEditIconUrl(item.iconUrl ?? "");
  }

  function TechIcon({ item }: { item: TechItem }) {
    if (item.iconUrl) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={item.iconUrl} alt={item.name} className="h-6 w-6 object-contain shrink-0" />;
    }
    if (item.icon) return <span className="text-xl w-7 text-center shrink-0">{item.icon}</span>;
    return <span className="w-7 h-6 rounded bg-white/5 flex items-center justify-center text-white/20 text-xs shrink-0">?</span>;
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Tech Library</h1>
          <p className="text-white/30 text-sm mt-1">
            Manage the tech stack options available in project forms.
          </p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="bg-[#3ABF8A] hover:bg-[#2ea876] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Add tech
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="bg-zinc-900 border border-[#3ABF8A]/30 rounded-xl p-5 mb-6 space-y-4">
          <h3 className="text-sm text-white/60 font-medium">New tech item</h3>

          <div>
            <label className={lbl}>Name *</label>
            <input
              className={inp}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Next.js"
              autoFocus
              onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") setAdding(false); }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>
                Icon Image <span className="text-white/20 normal-case tracking-normal">(SVG / PNG)</span>
              </label>
              <div className="flex gap-2 items-start">
                <input
                  className={`${inp} flex-1`}
                  value={newIconUrl}
                  onChange={(e) => setNewIconUrl(e.target.value)}
                  placeholder="Paste URL or upload →"
                />
                <label className={uploadBtn}>
                  {uploading === "icon" ? "…" : "↑"}
                  <input
                    type="file"
                    accept="image/*,image/svg+xml"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadIcon(f, setNewIconUrl); }}
                  />
                </label>
              </div>
              {newIconUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={newIconUrl} alt="Icon preview" className="mt-2 h-8 w-8 object-contain" />
              )}
            </div>
            <div>
              <label className={lbl}>
                Emoji Fallback <span className="text-white/20 normal-case tracking-normal">(used if no image)</span>
              </label>
              <input
                className={inp}
                value={newIcon}
                onChange={(e) => setNewIcon(e.target.value)}
                placeholder="⚡"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              disabled={saving || !newName.trim()}
              className="bg-[#3ABF8A] hover:bg-[#2ea876] disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg transition-colors"
            >
              {saving ? "Saving…" : "Add"}
            </button>
            <button
              onClick={() => { setAdding(false); setNewName(""); setNewIcon(""); setNewIconUrl(""); }}
              className="bg-white/5 hover:bg-white/10 text-white/60 text-sm px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <p className="text-white/30 text-sm">Loading…</p>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-white/20">
          <p className="text-4xl mb-3">◎</p>
          <p className="text-sm">No tech items yet. Add your first one.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) =>
            editingId === item.id ? (
              <div key={item.id} className="bg-zinc-900 border border-[#3ABF8A]/30 rounded-xl p-4 space-y-3">
                <div>
                  <label className={lbl}>Name</label>
                  <input className={inp} value={editName} onChange={(e) => setEditName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleSaveEdit(item.id); if (e.key === "Escape") setEditingId(null); }} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={lbl}>Icon Image <span className="text-white/20 normal-case tracking-normal">(SVG / PNG)</span></label>
                    <div className="flex gap-2 items-start">
                      <input className={`${inp} flex-1`} value={editIconUrl} onChange={(e) => setEditIconUrl(e.target.value)} placeholder="https://…" />
                      <label className={uploadBtn}>
                        {uploading === "icon" ? "…" : "↑"}
                        <input type="file" accept="image/*,image/svg+xml" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadIcon(f, setEditIconUrl); }} />
                      </label>
                    </div>
                    {editIconUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={editIconUrl} alt="Icon" className="mt-2 h-8 w-8 object-contain" />
                    )}
                  </div>
                  <div>
                    <label className={lbl}>Emoji Fallback</label>
                    <input className={inp} value={editIcon} onChange={(e) => setEditIcon(e.target.value)} placeholder="⚡" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleSaveEdit(item.id)} disabled={saving} className="text-xs bg-[#3ABF8A] hover:bg-[#2ea876] disabled:opacity-50 text-white px-3 py-1.5 rounded-lg transition-colors">Save</button>
                  <button onClick={() => setEditingId(null)} className="text-xs bg-white/5 hover:bg-white/10 text-white/60 px-3 py-1.5 rounded-lg transition-colors">Cancel</button>
                </div>
              </div>
            ) : (
              <div key={item.id} className="bg-zinc-900 border border-white/[0.06] rounded-xl px-4 py-3 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <TechIcon item={item} />
                  <span className="text-white text-sm font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEdit(item)} className="text-xs text-white/40 hover:text-white px-2 py-1 rounded transition-colors">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-xs text-white/20 hover:text-red-400 px-2 py-1 rounded transition-colors">Delete</button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
