import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { projectUpdateData } from "@/lib/content-admin";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { attachments: { include: { media: true }, orderBy: { order: "asc" } }, services: { include: { service: true }, orderBy: { order: "asc" } } },
  });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(request);
  if (authError) return authError.error;

  const { id } = await params;
  const body = await request.json();
  const project = await prisma.project.update({
    where: { id },
    data: projectUpdateData(body),
    include: { attachments: { include: { media: true }, orderBy: { order: "asc" } }, services: { include: { service: true }, orderBy: { order: "asc" } } },
  });
  return NextResponse.json(project);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(request);
  if (authError) return authError.error;

  const { id } = await params;
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
