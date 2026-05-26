import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const count = await prisma.admin.count();
  return NextResponse.json({ hasAdmin: count > 0 });
}

export async function POST(request: NextRequest) {
  // Only works if no admin exists yet
  const count = await prisma.admin.count();
  if (count > 0) {
    return NextResponse.json({ error: "Admin already exists" }, { status: 403 });
  }

  const { username, password } = await request.json();

  if (!username || !password || password.length < 8) {
    return NextResponse.json(
      { error: "Username and password (min 8 chars) required" },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await prisma.admin.create({ data: { username, passwordHash } });

  return NextResponse.json({ ok: true, username: admin.username });
}
