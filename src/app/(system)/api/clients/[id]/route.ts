import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { parseClientItemUpdatePayload } from "@/lib/clientItems";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(request);
  if (authError) return authError.error;

  const { id } = await params;
  const body = await request.json();
  const data = parseClientItemUpdatePayload(body);
  if ("error" in data) return NextResponse.json({ error: data.error }, { status: 400 });

  const item = await prisma.clientItem.update({ where: { id }, data });
  return NextResponse.json(item);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(request);
  if (authError) return authError.error;

  const { id } = await params;
  await prisma.clientItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
