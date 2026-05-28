import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { parseClientItemCreatePayload } from "@/lib/clientItems";

export async function GET() {
  const items = await prisma.clientItem.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError.error;

  const body = await request.json();
  const data = parseClientItemCreatePayload(body);
  if ("error" in data) return NextResponse.json({ error: data.error }, { status: 400 });

  const item = await prisma.clientItem.create({ data });
  return NextResponse.json(item, { status: 201 });
}
