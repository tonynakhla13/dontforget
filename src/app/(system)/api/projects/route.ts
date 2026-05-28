import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { projectData } from "@/lib/content-admin";

export async function GET() {
  const projects = await prisma.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: { attachments: { include: { media: true }, orderBy: { order: "asc" } }, services: { include: { service: true }, orderBy: { order: "asc" } } },
  });
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError.error;

  const body = await request.json();
  const project = await prisma.project.create({
    data: projectData(body),
    include: { attachments: { include: { media: true } }, services: { include: { service: true } } },
  });
  return NextResponse.json(project, { status: 201 });
}
