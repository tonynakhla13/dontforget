import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { serviceUpdateData } from "@/lib/content-admin";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(request);
  if (authError) return authError.error;

  const { id } = await params;
  const body = await request.json();
  const service = await prisma.service.update({
    where: { id },
    data: serviceUpdateData(body),
    include: { attachments: { include: { media: true }, orderBy: { order: "asc" } } },
  });
  return NextResponse.json(service);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(request);
  if (authError) return authError.error;

  const { id } = await params;
  await prisma.service.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
