import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PostForm from "@/components/dashboard/PostForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard/posts" className="text-white/30 hover:text-white/60 text-sm transition-colors">
          ← Posts
        </Link>
        <span className="text-white/15">/</span>
        <h1 className="text-2xl font-semibold text-white">{post.title}</h1>
      </div>
      <div className="bg-zinc-900 border border-white/5 rounded-xl p-8">
        <PostForm
          initial={{
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt ?? "",
            content: post.content,
            coverImage: post.coverImage ?? "",
            tags: post.tags,
            status: post.status as "DRAFT" | "PUBLISHED",
            order: post.order,
          }}
        />
      </div>
    </div>
  );
}
