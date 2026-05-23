import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Loader from "@/components/Loader";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import AmbientGlow from "@/components/AmbientGlow";
import DarkBlogList from "@/components/blog/DarkBlogList";

export const metadata: Metadata = {
  title: "Blog — DON'T FORGET",
  description: "Insights on branding, web performance, design systems, and conversion from the DON'T FORGET studio.",
};

export const dynamic = "force-dynamic";

async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
      select: { id: true, slug: true, title: true, tags: true, coverImage: true, excerpt: true, publishedAt: true },
    });
    return posts;
  } catch { return []; }
}

export default async function CreativeBlogPage() {
  const posts = await getPosts();
  return (
    <>
      <Loader />
      <SmoothScroll />
      <main className="relative z-[1] overflow-x-clip">
        <div className="noise" />
        <AmbientGlow />
        <Navbar inner />
        <DarkBlogList posts={posts} basePath="/creative/blog" />
      </main>
    </>
  );
}
