import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { projectData } from "@/lib/content-admin";
import { getProjects as getPublicProjects } from "@/lib/public-content";

export async function GET() {
  return NextResponse.json(await getPublicProjects("en"));
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
