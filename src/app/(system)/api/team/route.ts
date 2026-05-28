import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const members = await prisma.teamMember.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(members);
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError.error;

  const body = await request.json();
  const member = await prisma.teamMember.create({ data: body });
  return NextResponse.json(member, { status: 201 });
}
