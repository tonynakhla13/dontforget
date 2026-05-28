"use client";

import { useEffect, useState } from "react";

interface ClientItem {
  id: string;
  name: string;
  company?: string | null;
  country?: string | null;
  logo?: string | null;
  website?: string | null;
  order: number;
}

const inp =
  "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#2ea876] transition-colors text-sm";
const lbl = "block text-xs text-white/50 uppercase tracking-widest mb-2";
const uploadBtn =
  "cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 text-xs px-4 py-3 rounded-lg transition-colors whitespace-nowrap";

export default function ClientsPage() {
  const [items, setItems] = useState<ClientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Add form state
  const [newName, setNewName] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newCountry, setNewCountry] = useState("");
  const [newLogo, setNewLogo] = useState("");
  const [newWebsite, setNewWebsite] = useState("");

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editCompany, setEditCompany] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [editLogo, setEditLogo] = useState("");
  const [editWebsite, setEditWebsite] = useState("");

  async function load() {
    const res = await fetch("/api/clients");
    setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;

    fetch("/api/clients")
      .then((res) => res.json())
      .then((data: ClientItem[]) => {
        if (!cancelled) setItems(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function uploadLogo(file: File, onDone: (url: string) => void) {
    setUploading("logo");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "dontforget/clients");
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

  function resetAdd() {
    setNewName(""); setNewCompany(""); setNewCountry(""); setNewLogo(""); setNewWebsite("");
    setAdding(false);
  }

  async function handleAdd() {
    if (!newName.trim()) return;
    setSaving(true);
    await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName.trim(),
        company: newCompany.trim() || null,
        country: newCountry.trim() || null,
        logo: newLogo.trim() || null,
        website: newWebsite.trim() || null,
        order: items.length,
      }),
    });
    resetAdd();
    setSaving(false);
    load();
  }

  async function handleSaveEdit(id: string) {
    setSaving(true);
    await fetch(`/api/clients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editName.trim(),
        company: editCompany.trim() || null,
        country: editCountry.trim() || null,
        logo: editLogo.trim() || null,
        website: editWebsite.trim() || null,
      }),
    });
    setEditingId(null);
    setSaving(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this client?")) return;
    await fetch(`/api/clients/${id}`, { method: "DELETE" });
    load();
  }

  function startEdit(item: ClientItem) {
    setEditingId(item.id);
    setEditName(item.name);
    setEditCompany(item.company ?? "");
    setEditCountry(item.country ?? "");
    setEditLogo(item.logo ?? "");
    setEditWebsite(item.website ?? "");
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Client Library</h1>
          <p className="text-white/30 text-sm mt-1">
            Manage clients available for selection in project forms.
          </p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="bg-[#3ABF8A] hover:bg-[#2ea876] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Add client
        </button>
      </div>

      {/* ── Add form ── */}
      {adding && (
        <div className="bg-zinc-900 border border-[#3ABF8A]/30 rounded-xl p-5 mb-6 space-y-4">
          <h3 className="text-sm text-white/60 font-medium">New client</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Contact Name *</label>
              <input
                className={inp}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="John Smith"
                autoFocus
                onKeyDown={(e) => { if (e.key === "Escape") resetAdd(); }}
              />
            </div>
            <div>
              <label className={lbl}>Company</label>
              <input
                className={inp}
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                placeholder="Acme Corp"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Country</label>
              <input
                className={inp}
                value={newCountry}
                onChange={(e) => setNewCountry(e.target.value)}
                placeholder="Saudi Arabia"
              />
            </div>
            <div>
              <label className={lbl}>Website</label>
              <input
                className={inp}
                value={newWebsite}
                onChange={(e) => setNewWebsite(e.target.value)}
                placeholder="https://acme.com"
              />
            </div>
          </div>

          <div>
            <label className={lbl}>Logo</label>
            <div className="flex gap-3 items-start">
              <input
                className={`${inp} flex-1`}
                value={newLogo}
                onChange={(e) => setNewLogo(e.target.value)}
                placeholder="Paste URL or upload →"
              />
              <label className={uploadBtn}>
                {uploading === "logo" ? "Uploading…" : "Upload"}
                <input
                  type="file"
                  accept="image/*,image/svg+xml"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadLogo(f, setNewLogo); }}
                />
              </label>
            </div>
            {newLogo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={newLogo} alt="Logo preview" className="mt-2 h-10 object-contain rounded bg-white/5 p-1.5" />
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              disabled={saving || !newName.trim()}
              className="bg-[#3ABF8A] hover:bg-[#2ea876] disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg transition-colors"
            >
              {saving ? "Saving…" : "Add"}
            </button>
            <button onClick={resetAdd} className="bg-white/5 hover:bg-white/10 text-white/60 text-sm px-4 py-2 rounded-lg transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── List ── */}
      {loading ? (
        <p className="text-white/30 text-sm">Loading…</p>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-white/20">
          <p className="text-4xl mb-3">⟡</p>
          <p className="text-sm">No clients yet. Add your first one.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) =>
            editingId === item.id ? (
              <div key={item.id} className="bg-zinc-900 border border-[#3ABF8A]/30 rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={lbl}>Contact Name</label>
                    <input className={inp} value={editName} onChange={(e) => setEditName(e.target.value)} onKeyDown={(e) => { if (e.key === "Escape") setEditingId(null); }} />
                  </div>
                  <div>
                    <label className={lbl}>Company</label>
                    <input className={inp} value={editCompany} onChange={(e) => setEditCompany(e.target.value)} placeholder="Acme Corp" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={lbl}>Country</label>
                    <input className={inp} value={editCountry} onChange={(e) => setEditCountry(e.target.value)} placeholder="Saudi Arabia" />
                  </div>
                  <div>
                    <label className={lbl}>Website</label>
                    <input className={inp} value={editWebsite} onChange={(e) => setEditWebsite(e.target.value)} placeholder="https://…" />
                  </div>
                </div>
                <div>
                  <label className={lbl}>Logo</label>
                  <div className="flex gap-3 items-start">
                    <input className={`${inp} flex-1`} value={editLogo} onChange={(e) => setEditLogo(e.target.value)} placeholder="Paste URL or upload →" />
                    <label className={uploadBtn}>
                      {uploading === "logo" ? "Uploading…" : "Upload"}
                      <input type="file" accept="image/*,image/svg+xml" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadLogo(f, setEditLogo); }} />
                    </label>
                  </div>
                  {editLogo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={editLogo} alt="Logo" className="mt-2 h-10 object-contain rounded bg-white/5 p-1.5" />
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleSaveEdit(item.id)} disabled={saving} className="text-xs bg-[#3ABF8A] hover:bg-[#2ea876] disabled:opacity-50 text-white px-3 py-1.5 rounded-lg transition-colors">Save</button>
                  <button onClick={() => setEditingId(null)} className="text-xs bg-white/5 hover:bg-white/10 text-white/60 px-3 py-1.5 rounded-lg transition-colors">Cancel</button>
                </div>
              </div>
            ) : (
              <div key={item.id} className="bg-zinc-900 border border-white/[0.06] rounded-xl px-4 py-3 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  {item.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.logo} alt={item.name} className="h-8 w-auto object-contain rounded bg-white/5 p-1 shrink-0" />
                  ) : (
                    <div className="h-8 w-8 rounded bg-white/5 flex items-center justify-center text-white/20 text-xs shrink-0">?</div>
                  )}
                  <div>
                    <p className="text-white text-sm font-medium">{item.name}</p>
                    <p className="text-white/30 text-xs">
                      {[item.company, item.country].filter(Boolean).join(" · ")}
                      {item.website && (
                        <span className="ml-2 text-white/20">{item.website}</span>
                      )}
                    </p>
                  </div>
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
