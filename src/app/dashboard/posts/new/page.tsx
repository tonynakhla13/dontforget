import PostForm from "@/components/dashboard/PostForm";
import Link from "next/link";

export default function NewPostPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard/posts" className="text-white/30 hover:text-white/60 text-sm transition-colors">
          ← Posts
        </Link>
        <span className="text-white/15">/</span>
        <h1 className="text-2xl font-semibold text-white">New post</h1>
      </div>
      <div className="bg-zinc-900 border border-white/5 rounded-xl p-8">
        <PostForm />
      </div>
    </div>
  );
}
