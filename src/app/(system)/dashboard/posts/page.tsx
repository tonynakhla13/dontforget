import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PostActions from "@/components/dashboard/PostActions";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Blog Posts</h1>
          <p className="text-white/40 text-sm mt-1">{posts.length} post{posts.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/dashboard/posts/new"
          className="bg-[#3ABF8A] hover:bg-[#2ea876] text-black text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          + New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-zinc-900 border border-white/5 rounded-xl p-16 text-center">
          <p className="text-4xl mb-4">✍️</p>
          <p className="text-white/60 font-medium mb-1">No posts yet</p>
          <p className="text-white/30 text-sm mb-6">Write your first blog post to share insights with your audience.</p>
          <Link
            href="/dashboard/posts/new"
            className="bg-[#3ABF8A] hover:bg-[#2ea876] text-black text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            Write first post
          </Link>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs text-white/30 uppercase tracking-widest px-6 py-4">Title</th>
                <th className="text-left text-xs text-white/30 uppercase tracking-widest px-6 py-4">Tags</th>
                <th className="text-left text-xs text-white/30 uppercase tracking-widest px-6 py-4">Status</th>
                <th className="text-left text-xs text-white/30 uppercase tracking-widest px-6 py-4">Date</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white text-sm">{post.title}</div>
                    <div className="text-white/30 text-xs mt-0.5 font-mono">/{post.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs bg-white/5 text-white/40 px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-xs text-white/25">+{post.tags.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full ${
                      post.status === "PUBLISHED"
                        ? "bg-[#3ABF8A]/15 text-[#3ABF8A]"
                        : "bg-white/5 text-white/35"
                    }`}>
                      {post.status === "PUBLISHED" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-white/40">
                    {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-6 py-4">
                    <PostActions id={post.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
