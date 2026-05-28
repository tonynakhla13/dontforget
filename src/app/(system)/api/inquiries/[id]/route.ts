import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

const ALLOWED_FIELDS = new Set(["status", "notes"]);

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(request);
  if (authError) return authError.error;

  const { id } = await params;
  const body = await request.json();
  const data = Object.fromEntries(
    Object.entries(body).filter(([key]) => ALLOWED_FIELDS.has(key))
  );
  const inquiry = await prisma.inquiry.update({ where: { id }, data });
  return NextResponse.json(inquiry);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(request);
  if (authError) return authError.error;

  const { id } = await params;
  await prisma.inquiry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
