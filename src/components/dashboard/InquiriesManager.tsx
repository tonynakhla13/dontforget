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

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function metadataRows(metadata: Inquiry["metadata"]) {
  if (!isRecord(metadata)) return [];
  const rows: { label: string; value: string }[] = [];

  const services = metadata.services;
  const subServices = metadata.subServices;
  if (Array.isArray(services) && services.length) rows.push({ label: "Services", value: services.join(", ") });
  if (Array.isArray(subServices) && subServices.length) rows.push({ label: "Deliverables", value: subServices.join(", ") });
  if (typeof metadata.timeline === "string") rows.push({ label: "Timeline", value: metadata.timeline });
  if (typeof metadata.budget === "string") rows.push({ label: "Budget", value: metadata.budget });
  if (typeof metadata.voiceCount === "number") rows.push({ label: "Voice notes", value: String(metadata.voiceCount) });
  if (typeof metadata.failedAudioCount === "number" && metadata.failedAudioCount > 0) {
    rows.push({ label: "Failed audio uploads", value: String(metadata.failedAudioCount) });
  }
  if (typeof metadata.assetCount === "number") rows.push({ label: "Assets", value: String(metadata.assetCount) });

  return rows;
}

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
            {inquiry.audioUrls.length > 0 && (
              <div className="text-xs text-[#3ABF8A] mt-1">
                {inquiry.audioUrls.length} voice note{inquiry.audioUrls.length === 1 ? "" : "s"}
              </div>
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
              {selected.contactMethod && selected.contactValue && (
                <div className="mt-2 text-sm text-white/60">
                  <span className="text-white/30">Preferred:</span>{" "}
                  {selected.contactMethod} · {selected.contactValue}
                </div>
              )}
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

          {selected.source && (
            <div>
              <span className="text-xs text-white/40 uppercase tracking-widest">
                Source
              </span>
              <p className="text-sm text-white mt-1">{selected.source}</p>
            </div>
          )}

          {selected.audioUrls.length > 0 && (
            <div>
              <span className="text-xs text-white/40 uppercase tracking-widest">
                Voice Notes
              </span>
              <div className="mt-3 grid gap-3">
                {selected.audioUrls.map((url, index) => (
                  <div
                    key={url}
                    className="rounded-lg border border-[#3ABF8A]/20 bg-[#3ABF8A]/5 p-3"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-[#3ABF8A]">
                        Voice note {index + 1}
                      </span>
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-white/35 hover:text-white/70"
                      >
                        Open
                      </a>
                    </div>
                    <audio controls preload="metadata" src={url} className="w-full" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {selected.assetNames.length > 0 && (
            <div>
              <span className="text-xs text-white/40 uppercase tracking-widest">
                Shared Assets
              </span>
              <div className="mt-3 flex flex-wrap gap-2">
                {selected.assetNames.map((asset) => (
                  <span
                    key={asset}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/60"
                  >
                    {asset}
                  </span>
                ))}
              </div>
            </div>
          )}

          {metadataRows(selected.metadata).length > 0 && (
            <div>
              <span className="text-xs text-white/40 uppercase tracking-widest">
                Brief Details
              </span>
              <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                {metadataRows(selected.metadata).map((row) => (
                  <div key={row.label} className="rounded-lg border border-white/5 bg-white/[0.025] p-3">
                    <dt className="text-xs text-white/30">{row.label}</dt>
                    <dd className="mt-1 text-sm text-white/75">{row.value}</dd>
                  </div>
                ))}
              </dl>
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
