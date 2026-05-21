import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError.error;

  const posts = await prisma.post.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    select: { id: true, title: true, slug: true, status: true, tags: true, publishedAt: true, createdAt: true },
  });
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError.error;

  const body = await request.json();
  const { title, slug, excerpt, content, coverImage, tags, status, order } = body;

  if (!title || !slug) {
    return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
  }

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      excerpt: excerpt || null,
      content: content || "",
      coverImage: coverImage || null,
      tags: tags || [],
      status: status || "DRAFT",
      order: order ?? 0,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
    },
  });
  return NextResponse.json(post, { status: 201 });
}
