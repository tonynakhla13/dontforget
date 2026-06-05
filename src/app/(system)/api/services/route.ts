import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { serviceData } from "@/lib/content-admin";

export async function GET() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    include: { attachments: { include: { media: true }, orderBy: { order: "asc" } } },
  });
  return NextResponse.json(services);
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError.error;

  const body = await request.json();
  const service = await prisma.service.create({
    data: serviceData(body),
    include: { attachments: { include: { media: true }, orderBy: { order: "asc" } } },
  });
  return NextResponse.json(service, { status: 201 });
}
