import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuth(request);
  if (authError) return authError.error;

  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuth(request);
  if (authError) return authError.error;

  const { id } = await params;
  const body = await request.json();
  const { title, titleAr, slug, excerpt, excerptAr, content, contentAr, coverImage, tags, tagsAr, status, order } = body;

  const current = await prisma.post.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const wasPublished = current.status === "PUBLISHED";
  const nowPublished = status === "PUBLISHED";

  const post = await prisma.post.update({
    where: { id },
    data: {
      title,
      titleAr: titleAr || null,
      slug,
      excerpt: excerpt || null,
      excerptAr: excerptAr || null,
      content: content || "",
      contentAr: contentAr || null,
      coverImage: coverImage || null,
      tags: tags || [],
      tagsAr: tagsAr || [],
      status,
      order: order ?? 0,
      publishedAt: nowPublished && !wasPublished ? new Date() : current.publishedAt,
    },
  });
  return NextResponse.json(post);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuth(request);
  if (authError) return authError.error;

  const { id } = await params;
  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
