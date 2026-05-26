import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// Public — receives submissions from the contact form
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, projectType, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const inquiry = await prisma.inquiry.create({
    data: { name, email, projectType, message },
  });
  return NextResponse.json(inquiry, { status: 201 });
}

// Protected — lists all inquiries for the dashboard
export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError.error;

  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(inquiries);
}
