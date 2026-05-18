import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const page = await prisma.contactPage.findUnique({ where: { id: 1 } });
  return NextResponse.json(page ?? {});
}

export async function PUT(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError.error;

  const body = await request.json();
  const page = await prisma.contactPage.upsert({
    where: { id: 1 },
    create: { id: 1, ...body },
    update: body,
  });
  return NextResponse.json(page);
}
