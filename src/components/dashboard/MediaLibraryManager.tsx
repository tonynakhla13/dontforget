"use client";

import { useMemo, useState } from "react";
import type { MediaAsset } from "@prisma/client";

export default function MediaLibraryManager({ initial }: { initial: MediaAsset[] }) {
  const [assets, setAssets] = useState(initial);
  const [folder, setFolder] = useState("");
  const [type, setType] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<Record<string, Partial<MediaAsset>>>({});

  const filtered = useMemo(() => assets.filter((asset) => {
    if (folder && !asset.folder?.toLowerCase().includes(folder.toLowerCase())) return false;
    if (type && !asset.mimeType.startsWith(`${type}/`)) return false;
    return true;
  }), [assets, folder, type]);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      const next: MediaAsset[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", folder ? `dontforget/${folder}` : "dontforget/media");
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Upload failed");
        next.push(data.mediaAsset);
      }
      setAssets((prev) => [...next, ...prev]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function save(asset: MediaAsset) {
    const patch = editing[asset.id] ?? {};
    const res = await fetch("/api/media", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: asset.id, alt: patch.alt ?? asset.alt ?? "", caption: patch.caption ?? asset.caption ?? "", folder: patch.folder ?? asset.folder ?? "" }),
    });
    const updated = await res.json();
    if (!res.ok) return alert(updated.error ?? "Save failed");
    setAssets((prev) => prev.map((item) => item.id === asset.id ? updated : item));
    setEditing((prev) => ({ ...prev, [asset.id]: {} }));
  }

  const input = "bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/20 focus:outline-none focus:border-[#2ea876] text-sm";

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 border border-white/5 rounded-xl p-5 flex flex-wrap gap-3 items-end">
        <label className="space-y-2">
          <span className="block text-xs text-white/45 uppercase tracking-widest">Folder</span>
          <input className={input} value={folder} onChange={(e) => setFolder(e.target.value)} placeholder="projects/gallery" />
        </label>
        <label className="space-y-2">
          <span className="block text-xs text-white/45 uppercase tracking-widest">Type</span>
          <select className={input} value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All</option>
            <option value="image">Images</option>
            <option value="video">Video</option>
            <option value="application">Documents</option>
          </select>
        </label>
        <label className="cursor-pointer bg-[#3ABF8A] hover:bg-[#2ea876] text-white text-sm px-4 py-2 rounded-lg transition-colors">
          {uploading ? "Uploading..." : "Upload files"}
          <input type="file" multiple className="hidden" onChange={(e) => upload(e.target.files)} />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((asset) => {
          const draft = editing[asset.id] ?? {};
          const isImage = asset.mimeType.startsWith("image/");
          return (
            <div key={asset.id} className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden">
              <div className="aspect-video bg-white/5">
                {isImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={asset.url} alt={asset.alt ?? ""} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full grid place-items-center text-white/35 text-sm">{asset.mimeType}</div>
                )}
              </div>
              <div className="p-4 space-y-3">
                <div className="text-xs text-white/35 truncate">{asset.originalName ?? asset.filename ?? asset.url}</div>
                <input className={`${input} w-full`} value={(draft.alt ?? asset.alt ?? "") as string} onChange={(e) => setEditing((prev) => ({ ...prev, [asset.id]: { ...prev[asset.id], alt: e.target.value } }))} placeholder="Alt text" />
                <input className={`${input} w-full`} value={(draft.caption ?? asset.caption ?? "") as string} onChange={(e) => setEditing((prev) => ({ ...prev, [asset.id]: { ...prev[asset.id], caption: e.target.value } }))} placeholder="Caption" />
                <div className="flex gap-2">
                  <button type="button" onClick={() => navigator.clipboard.writeText(asset.url)} className="bg-white/5 hover:bg-white/10 text-white/55 text-xs px-3 py-2 rounded-lg">Copy URL</button>
                  <button type="button" onClick={() => navigator.clipboard.writeText(asset.id)} className="bg-white/5 hover:bg-white/10 text-white/55 text-xs px-3 py-2 rounded-lg">Copy ID</button>
                  <button type="button" onClick={() => save(asset)} className="ml-auto bg-[#3ABF8A]/15 text-[#3ABF8A] text-xs px-3 py-2 rounded-lg">Save</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
