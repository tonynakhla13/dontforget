"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TeamMember } from "@prisma/client";

type MemberForm = Omit<TeamMember, "id" | "createdAt" | "updatedAt">;

const emptyMember: MemberForm = {
  name: "",
  role: "",
  bio: "",
  photo: "",
  linkedinUrl: "",
  twitterUrl: "",
  email: "",
  order: 0,
  active: true,
};

export default function TeamManager({ initial }: { initial: TeamMember[] }) {
  const router = useRouter();
  const [members, setMembers] = useState(initial);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState<MemberForm>(emptyMember);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditing(null);
    setForm(emptyMember);
  }

  function openEdit(member: TeamMember) {
    setEditing(member);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, updatedAt, ...rest } = member;
    setForm(rest);
  }

  async function uploadPhoto(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "dontforget/team");
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setForm((f) => ({ ...f, photo: data.url }));
    setUploading(false);
  }

  async function save() {
    setSaving(true);
    if (editing) {
      await fetch(`/api/team/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setSaving(false);
    setEditing(null);
    setForm(emptyMember);
    router.refresh();
    const res = await fetch("/api/team");
    setMembers(await res.json());
  }

  async function deleteMember(id: string) {
    if (!confirm("Delete this team member?")) return;
    await fetch(`/api/team/${id}`, { method: "DELETE" });
    setMembers((m) => m.filter((x) => x.id !== id));
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
          + Add Member
        </button>
      </div>

      {/* Form panel */}
      {(editing !== null || form.name !== "") && (
        <div className="bg-zinc-900 border border-white/5 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-medium text-white/60 uppercase tracking-widest">
            {editing ? "Edit Member" : "New Member"}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Name *</label>
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className={labelClass}>Role *</label>
              <input
                className={inputClass}
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                placeholder="Creative Director"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Bio</label>
            <textarea
              className={`${inputClass} h-24 resize-none`}
              value={form.bio ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            />
          </div>

          <div>
            <label className={labelClass}>Photo</label>
            <div className="flex gap-3 items-center">
              <input
                className={`${inputClass} flex-1`}
                value={form.photo ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, photo: e.target.value }))}
                placeholder="https://res.cloudinary.com/…"
              />
              <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 text-xs px-4 py-3 rounded-lg transition-colors whitespace-nowrap">
                {uploading ? "Uploading…" : "Upload"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadPhoto(file);
                  }}
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Email</label>
              <input
                className={inputClass}
                value={form.email ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>LinkedIn URL</label>
              <input
                className={inputClass}
                value={form.linkedinUrl ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, linkedinUrl: e.target.value }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>Twitter/X URL</label>
              <input
                className={inputClass}
                value={form.twitterUrl ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, twitterUrl: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              onClick={save}
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm px-6 py-2.5 rounded-lg transition-colors"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => {
                setEditing(null);
                setForm(emptyMember);
              }}
              className="bg-white/5 hover:bg-white/10 text-white/60 text-sm px-6 py-2.5 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Member cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-zinc-900 border border-white/5 rounded-xl p-5 flex gap-4"
          >
            {member.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={member.photo}
                alt={member.name}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white/30 flex-shrink-0">
                {member.name[0]}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white text-sm truncate">
                {member.name}
              </div>
              <div className="text-white/40 text-xs">{member.role}</div>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => openEdit(member)}
                  className="text-xs text-white/40 hover:text-white transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteMember(member.id)}
                  className="text-xs text-white/20 hover:text-red-400 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {members.length === 0 && (
          <p className="text-white/30 text-sm col-span-3">
            No team members yet. Add your first member above.
          </p>
        )}
      </div>
    </div>
  );
}
