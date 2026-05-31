import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import AmbientGlow from "@/components/AmbientGlow";
import ParticleLayer from "@/components/ParticleLayer";
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

export default async function ImmersiveBlogPage({ locale = "en" }: { locale?: string }) {
  const posts = await getPosts();
  return (
    <>
      <SmoothScroll />
      <ParticleLayer />
      <main className="immersive-mode relative z-[1] overflow-x-clip">
        <div className="noise" />
        <AmbientGlow />
        <Navbar inner />
        <DarkBlogList posts={posts} basePath="/immersive/blog" locale={locale} />
      </main>
    </>
  );
}
