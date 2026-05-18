"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProjectActions({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3 justify-end">
      <Link
        href={`/dashboard/projects/${id}`}
        className="text-xs text-white/40 hover:text-white transition-colors"
      >
        Edit
      </Link>
      <button
        onClick={handleDelete}
        className="text-xs text-white/20 hover:text-red-400 transition-colors"
      >
        Delete
      </button>
    </div>
  );
}
