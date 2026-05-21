"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function PostActions({ id }: { id: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setDeleting(true);
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/dashboard/posts/${id}`}
        className="text-xs text-white/40 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors"
      >
        Edit
      </Link>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="text-xs text-white/40 hover:text-red-400 px-3 py-1.5 rounded-md hover:bg-red-500/5 transition-colors disabled:opacity-40"
      >
        {deleting ? "…" : "Delete"}
      </button>
    </div>
  );
}
