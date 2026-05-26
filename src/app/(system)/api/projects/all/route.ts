import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// Returns all projects (including drafts) — dashboard only
export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError.error;

  const projects = await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(projects);
}
