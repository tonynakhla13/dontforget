"use client";

import { useState } from "react";
import type { Service } from "@prisma/client";

type ServiceForm = Omit<Service, "id" | "createdAt" | "updatedAt">;

const empty: ServiceForm = {
  title: "",
  description: "",
  icon: "",
  order: 0,
  active: true,
};

export default function ServicesManager({ initial }: { initial: Service[] }) {
  const [services, setServices] = useState(initial);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<ServiceForm>(empty);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditing(null);
    setForm(empty);
  }

  function openEdit(s: Service) {
    setEditing(s);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, updatedAt, ...rest } = s;
    setForm(rest);
  }

  async function save() {
    setSaving(true);
    if (editing) {
      const res = await fetch(`/api/services/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const updated: Service = await res.json();
      setServices((prev) =>
        prev.map((s) => (s.id === editing.id ? updated : s))
      );
    } else {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const created: Service = await res.json();
      setServices((prev) => [...prev, created]);
    }
    setSaving(false);
    setEditing(null);
    setForm(empty);
  }

  async function deleteService(id: string) {
    if (!confirm("Delete this service?")) return;
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    setServices((prev) => prev.filter((s) => s.id !== id));
  }

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-colors text-sm";
  const labelClass =
    "block text-xs text-white/50 uppercase tracking-widest mb-2";

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={openNew}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          + Add Service
        </button>
      </div>

      {(editing !== null || form.title !== "") && (
        <div className="bg-zinc-900 border border-white/5 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-medium text-white/60 uppercase tracking-widest">
            {editing ? "Edit Service" : "New Service"}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Title *</label>
              <input
                className={inputClass}
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Web Design"
              />
            </div>
            <div>
              <label className={labelClass}>Icon (symbol or emoji)</label>
              <input
                className={inputClass}
                value={form.icon ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                placeholder="✦"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              className={`${inputClass} h-24 resize-none`}
              value={form.description ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div className="flex items-center gap-6">
            <div>
              <label className={labelClass}>Order</label>
              <input
                type="number"
                className={`${inputClass} w-24`}
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer mt-4">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                className="accent-indigo-500"
              />
              <span className="text-sm text-white/60">Active</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={save}
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm px-6 py-2.5 rounded-lg transition-colors"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => { setEditing(null); setForm(empty); }}
              className="bg-white/5 hover:bg-white/10 text-white/60 text-sm px-6 py-2.5 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden">
        {services.length === 0 ? (
          <div className="p-8 text-center text-white/30 text-sm">
            No services yet.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs text-white/40 uppercase tracking-widest px-6 py-4">
                  Icon
                </th>
                <th className="text-left text-xs text-white/40 uppercase tracking-widest px-6 py-4">
                  Title
                </th>
                <th className="text-left text-xs text-white/40 uppercase tracking-widest px-6 py-4">
                  Status
                </th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="border-b border-white/5 last:border-0">
                  <td className="px-6 py-4 text-xl">{s.icon}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white font-medium">{s.title}</div>
                    {s.description && (
                      <div className="text-xs text-white/40 mt-0.5 truncate max-w-xs">
                        {s.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        s.active
                          ? "bg-emerald-600/20 text-emerald-400"
                          : "bg-white/5 text-white/30"
                      }`}
                    >
                      {s.active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => openEdit(s)}
                        className="text-xs text-white/40 hover:text-white transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteService(s.id)}
                        className="text-xs text-white/20 hover:text-red-400 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
