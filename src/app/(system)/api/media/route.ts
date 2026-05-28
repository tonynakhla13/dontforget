import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError.error;

  const { searchParams } = new URL(request.url);
  const folder = searchParams.get("folder");
  const type = searchParams.get("type");
  const assets = await prisma.mediaAsset.findMany({
    where: {
      ...(folder ? { folder: { contains: folder, mode: "insensitive" } } : {}),
      ...(type ? { mimeType: { startsWith: `${type}/` } } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(assets);
}

export async function PATCH(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError.error;

  const body = await request.json();
  if (typeof body.id !== "string") {
    return NextResponse.json({ error: "Missing media id" }, { status: 400 });
  }

  const asset = await prisma.mediaAsset.update({
    where: { id: body.id },
    data: {
      alt: typeof body.alt === "string" ? body.alt : null,
      caption: typeof body.caption === "string" ? body.caption : null,
      folder: typeof body.folder === "string" ? body.folder : null,
    },
  });
  return NextResponse.json(asset);
}
