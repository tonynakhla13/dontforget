"use client";

import { useState } from "react";
import type { Inquiry, InquiryStatus } from "@prisma/client";

const STATUS_LABELS: Record<InquiryStatus, string> = {
  NEW: "New",
  READ: "Read",
  REPLIED: "Replied",
  ARCHIVED: "Archived",
};

const STATUS_COLORS: Record<InquiryStatus, string> = {
  NEW: "bg-[#3ABF8A]/12 text-[#3ABF8A]",
  READ: "bg-white/5 text-white/50",
  REPLIED: "bg-emerald-600/20 text-emerald-400",
  ARCHIVED: "bg-white/5 text-white/20",
};

export default function InquiriesManager({
  initial,
}: {
  initial: Inquiry[];
}) {
  const [inquiries, setInquiries] = useState(initial);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function updateStatus(id: string, status: InquiryStatus) {
    await fetch(`/api/inquiries/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status } : i))
    );
    if (selected?.id === id) setSelected((s) => s && { ...s, status });
  }

  async function saveNotes() {
    if (!selected) return;
    setSaving(true);
    await fetch(`/api/inquiries/${selected.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
    setInquiries((prev) =>
      prev.map((i) => (i.id === selected.id ? { ...i, notes } : i))
    );
    setSaving(false);
  }

  async function deleteInquiry(id: string) {
    if (!confirm("Delete this inquiry?")) return;
    await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
    setInquiries((prev) => prev.filter((i) => i.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  function openInquiry(inquiry: Inquiry) {
    setSelected(inquiry);
    setNotes(inquiry.notes ?? "");
    if (inquiry.status === "NEW") updateStatus(inquiry.id, "READ");
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-10rem)]">
      {/* List */}
      <div className="w-80 flex-shrink-0 overflow-y-auto space-y-2">
        {inquiries.length === 0 && (
          <p className="text-white/30 text-sm p-4">No inquiries yet.</p>
        )}
        {inquiries.map((inquiry) => (
          <button
            key={inquiry.id}
            onClick={() => openInquiry(inquiry)}
            className={`w-full text-left p-4 rounded-xl border transition-colors ${
              selected?.id === inquiry.id
                ? "bg-[#3ABF8A]/10 border-[#2ea876]/30"
                : "bg-zinc-900 border-white/5 hover:border-white/10"
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="font-medium text-white text-sm truncate">
                {inquiry.name}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_COLORS[inquiry.status]}`}
              >
                {STATUS_LABELS[inquiry.status]}
              </span>
            </div>
            <div className="text-xs text-white/40 truncate">{inquiry.email}</div>
            {inquiry.projectType && (
              <div className="text-xs text-white/30 mt-1">{inquiry.projectType}</div>
            )}
            <div className="text-xs text-white/20 mt-2">
              {new Date(inquiry.createdAt).toLocaleDateString()}
            </div>
          </button>
        ))}
      </div>

      {/* Detail */}
      {selected ? (
        <div className="flex-1 bg-zinc-900 border border-white/5 rounded-xl p-6 overflow-y-auto space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">{selected.name}</h2>
              <a
                href={`mailto:${selected.email}`}
                className="text-sm text-[#3ABF8A] hover:text-[#4dd9a0] transition-colors"
              >
                {selected.email}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selected.status}
                onChange={(e) =>
                  updateStatus(selected.id, e.target.value as InquiryStatus)
                }
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/70 text-sm focus:outline-none focus:border-[#2ea876]"
              >
                {Object.entries(STATUS_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => deleteInquiry(selected.id)}
                className="text-xs text-white/20 hover:text-red-400 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>

          {selected.projectType && (
            <div>
              <span className="text-xs text-white/40 uppercase tracking-widest">
                Project Type
              </span>
              <p className="text-sm text-white mt-1">{selected.projectType}</p>
            </div>
          )}

          <div>
            <span className="text-xs text-white/40 uppercase tracking-widest">
              Message
            </span>
            <p className="text-sm text-white/80 mt-2 whitespace-pre-wrap leading-relaxed">
              {selected.message}
            </p>
          </div>

          <div>
            <span className="text-xs text-white/40 uppercase tracking-widest">
              Internal Notes
            </span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-2 w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#2ea876] h-28 resize-none"
              placeholder="Add private notes…"
            />
            <button
              onClick={saveNotes}
              disabled={saving}
              className="mt-2 text-xs text-[#3ABF8A] hover:text-[#4dd9a0] disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving…" : "Save notes"}
            </button>
          </div>

          <div className="text-xs text-white/20">
            Received {new Date(selected.createdAt).toLocaleString()}
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-zinc-900 border border-white/5 rounded-xl flex items-center justify-center">
          <p className="text-white/20 text-sm">Select an inquiry to view</p>
        </div>
      )}
    </div>
  );
}
