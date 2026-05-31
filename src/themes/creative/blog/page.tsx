import { prisma } from "@/lib/prisma";
import CreativeNavbar from "@/components/creative/CreativeNavbar";
import CreativeFooter from "@/components/creative/CreativeFooter";
import CreativeBlogList, { type BlogPost } from "@/components/creative/CreativeBlogList";

const FALLBACK: BlogPost[] = [
  { id: "1", slug: "branding-mistakes",  title: "5 branding mistakes that are costing you clients",         tags: ["Branding"],   coverImage: null, excerpt: "Common pitfalls and how to avoid them when building a recognisable brand.", publishedAt: null },
  { id: "2", slug: "web-performance",    title: "Why your website speed is your most important metric",     tags: ["Web"],         coverImage: null, excerpt: "A practical look at performance budgets and the decisions that make sites feel instant.", publishedAt: null },
  { id: "3", slug: "design-systems",     title: "What a design system actually saves you",                  tags: ["Design"],      coverImage: null, excerpt: "The smallest system that keeps a growing product consistent — and sane.", publishedAt: null },
  { id: "4", slug: "seo-in-2026",        title: "SEO in 2026: what still works and what doesn't",           tags: ["Strategy"],    coverImage: null, excerpt: "The landscape has shifted. Here's what matters now.", publishedAt: null },
  { id: "5", slug: "conversion-copy",    title: "Writing copy that converts without being pushy",            tags: ["Content"],     coverImage: null, excerpt: "Persuasion without pressure — words that earn trust.", publishedAt: null },
  { id: "6", slug: "gsap-animations",    title: "How we use GSAP to make interfaces feel alive",             tags: ["Dev"],         coverImage: null, excerpt: "Motion that communicates rather than decorates.", publishedAt: null },
];

async function getPosts(): Promise<BlogPost[]> {
  try {
    const posts = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
      select: { id: true, slug: true, title: true, tags: true, coverImage: true, excerpt: true, publishedAt: true },
    });
    return posts.length ? posts : FALLBACK;
  } catch { return FALLBACK; }
}

export default async function CreativeBlogPage({ locale = "en" }: { locale?: string }) {
  const posts = await getPosts();

  return (
    <>
      <CreativeNavbar />

      {/* ── Page hero ── */}
      <section className="c-page-hero" style={{ paddingBottom: "clamp(60px, 8vw, 100px)" }}>
        <div className="c-page-hero__art" aria-hidden="true" />
        <p className="c-page-hero__label">/ Our thinking</p>
        <h1 className="c-page-hero__title">Blog</h1>
        <p style={{
          fontFamily: "var(--c-f-body)", fontSize: "clamp(17px, 1.6vw, 22px)",
          lineHeight: 1.55, color: "var(--c-ink)", opacity: .6,
          maxWidth: 520, marginTop: 20,
        }}>
          Insights on design, web performance, and building things that last.
        </p>
      </section>

      {/* ── Post list (client, handles hover image reveal) ── */}
      <section style={{ background: "var(--c-white)", padding: "0 var(--c-pad-x) clamp(80px, 12vw, 160px)" }}>
        <CreativeBlogList posts={posts} locale={locale} />
      </section>

      <CreativeFooter />
    </>
  );
}
