import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

function stringOrNull(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function stringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : [];
}

function objectOrEmpty(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

// Public — receives submissions from the contact form
export async function POST(request: NextRequest) {
  const body = await request.json();
  const name = stringOrNull(body.name);
  const email = stringOrNull(body.email);
  const message = stringOrNull(body.message);

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const inquiry = await prisma.inquiry.create({
    data: {
      name,
      email,
      message,
      projectType: stringOrNull(body.projectType),
      contactMethod: stringOrNull(body.contactMethod),
      contactValue: stringOrNull(body.contactValue),
      source: stringOrNull(body.source),
      audioUrls: stringArray(body.audioUrls),
      assetNames: stringArray(body.assetNames),
      metadata: objectOrEmpty(body.metadata),
    },
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
