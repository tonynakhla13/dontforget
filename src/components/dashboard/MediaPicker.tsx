"use client";

import { useMemo, useState } from "react";

export type MediaPickerAsset = {
  id: string;
  url: string;
  originalName?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  alt?: string | null;
};

export default function MediaPicker({
  assets,
  value,
  onChange,
  onSelectAsset,
  label,
  emptyLabel = "Select image",
  uploadFolder = "dontforget/media",
}: {
  assets: MediaPickerAsset[];
  value?: string;
  onChange: (mediaId: string) => void;
  onSelectAsset?: (asset: MediaPickerAsset) => void;
  label: string;
  emptyLabel?: string;
  uploadFolder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [uploadedAssets, setUploadedAssets] = useState<MediaPickerAsset[]>([]);
  const [uploading, setUploading] = useState(false);
  const libraryAssets = useMemo(() => {
    const merged = [...uploadedAssets];
    for (const asset of assets) {
      if (!merged.some((item) => item.id === asset.id)) merged.push(asset);
    }
    return merged;
  }, [assets, uploadedAssets]);
  const selected = libraryAssets.find((asset) => asset.id === value);

  function isImageAsset(asset: MediaPickerAsset) {
    if (asset.mimeType?.startsWith("image/")) return true;
    return /\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i.test(asset.url)
      || /\.(avif|gif|jpe?g|png|svg|webp)$/i.test(asset.filename ?? "")
      || /\.(avif|gif|jpe?g|png|svg|webp)$/i.test(asset.originalName ?? "");
  }

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return libraryAssets.filter((asset) => {
      if (!isImageAsset(asset)) return false;
      if (!needle) return true;
      return [asset.originalName, asset.filename, asset.alt, asset.url]
        .filter(Boolean)
        .some((item) => item!.toLowerCase().includes(needle));
    });
  }, [libraryAssets, query]);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      const uploaded: MediaPickerAsset[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", uploadFolder);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Upload failed");
        uploaded.push(data.mediaAsset ?? {
          id: data.url,
          url: data.url,
          originalName: file.name,
          filename: file.name,
          mimeType: file.type || "application/octet-stream",
        });
      }
      setQuery("");
      setUploadedAssets((prev) => [...uploaded, ...prev]);
      if (uploaded[0]) {
        onChange(uploaded[0].id);
        onSelectAsset?.(uploaded[0]);
        setOpen(false);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label className="block text-xs text-white/50 uppercase tracking-widest">{label}</label>
        {selected && (
          <button type="button" onClick={() => onChange("")} className="text-xs text-white/25 hover:text-red-300 transition-colors">
            Clear
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex min-h-20 w-full items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-2 text-left transition-colors hover:border-[#3ABF8A]/40 hover:bg-white/[0.07]"
      >
        <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-md bg-zinc-950 ring-1 ring-white/10">
          {selected ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={selected.url} alt={selected.alt ?? ""} className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs text-white/25">Image</span>
          )}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm text-white/75">
            {selected ? selected.originalName ?? selected.filename ?? selected.url : emptyLabel}
          </span>
          <span className="mt-1 block text-xs text-white/30">
            {selected ? "Click to replace from media library" : "Open media library"}
          </span>
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-zinc-950/82 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="mx-auto mt-8 flex h-[calc(100dvh-4rem)] w-[min(1120px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
              <div>
                <h2 className="text-base font-medium text-white">Media Library</h2>
                <p className="mt-1 text-xs text-white/35">{label}</p>
              </div>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer rounded-lg bg-[#3ABF8A] px-3 py-2 text-sm text-white transition-colors hover:bg-[#2ea876]">
                  {uploading ? "Uploading..." : "Upload"}
                  <input type="file" accept="image/*,image/svg+xml" multiple className="hidden" onChange={(event) => upload(event.target.files)} />
                </label>
                <button type="button" onClick={() => setOpen(false)} className="rounded-lg bg-white/5 px-3 py-2 text-sm text-white/55 transition-colors hover:bg-white/10 hover:text-white">
                  Close
                </button>
              </div>
            </div>
            <div className="border-b border-white/10 p-4">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-colors focus:border-[#3ABF8A]"
                placeholder="Search by filename, alt text, or URL"
              />
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {filtered.length ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {filtered.map((asset) => {
                    const active = asset.id === value;
                    return (
                      <button
                        key={asset.id}
                        type="button"
                        onClick={() => {
                          onChange(asset.id);
                          onSelectAsset?.(asset);
                          setOpen(false);
                        }}
                        className={`group overflow-hidden rounded-lg border bg-white/[0.03] text-left transition-colors ${active ? "border-[#3ABF8A] ring-1 ring-[#3ABF8A]/50" : "border-white/10 hover:border-[#3ABF8A]/45"}`}
                      >
                        <span className="block aspect-square overflow-hidden bg-zinc-900">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={asset.url} alt={asset.alt ?? ""} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                        </span>
                        <span className="block truncate px-3 py-2 text-xs text-white/55">
                          {asset.originalName ?? asset.filename ?? asset.url}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="grid h-full min-h-64 place-items-center rounded-xl border border-dashed border-white/10 text-center text-sm text-white/35">
                  <div>
                    <p>No image assets found.</p>
                    <label className="mt-3 inline-flex cursor-pointer rounded-lg bg-white/5 px-3 py-2 text-xs text-white/55 transition-colors hover:bg-white/10 hover:text-white">
                      Upload images
                      <input type="file" accept="image/*,image/svg+xml" multiple className="hidden" onChange={(event) => upload(event.target.files)} />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
