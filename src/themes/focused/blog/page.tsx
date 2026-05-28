import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import BlogFocused, { type FocusedPost } from "@/components/focused/BlogFocused";

export const metadata: Metadata = {
  title: "Blog — NOX Studio",
  description:
    "Insights on branding, web performance, design systems, SEO, and conversion from the NOX Studio team.",
};

export const dynamic = "force-dynamic";

async function getPosts(): Promise<FocusedPost[] | undefined> {
  try {
    const posts = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
      select: {
        id: true,
        slug: true,
        title: true,
        tags: true,
        coverImage: true,
        excerpt: true,
      },
    });
    // Return undefined if empty so BlogFocused shows its built-in fallback
    return posts.length ? posts : undefined;
  } catch {
    return undefined;
  }
}

export default async function FocusedBlogPage() {
  const posts = await getPosts();
  return <BlogFocused posts={posts} />;
}
