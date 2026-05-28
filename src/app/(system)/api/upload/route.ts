import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { requireAuth } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 50 * 1024 * 1024; // 50 MB

function extensionFor(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]{1,8}$/.test(fromName)) return fromName;
  if (file.type.startsWith("image/")) return file.type.slice(6);
  if (file.type.startsWith("video/")) return file.type.slice(6);
  return "bin";
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError.error;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    // folder param maps to a subdirectory under public/uploads/
    // e.g. "dontforget/projects" → public/uploads/projects
    const folderParam = (formData.get("folder") as string | null) ?? "dontforget/uploads";
    const subDir = folderParam.replace(/^dontforget\/?/, "") || "uploads";

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: "File too large (max 50 MB)" }, { status: 413 });
    }

    const ext = extensionFor(file);
    const fileName = `${Date.now()}-${randomUUID()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", subDir);
    await mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, fileName), buffer);

    const url = `/uploads/${subDir}/${fileName}`;
    return NextResponse.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    console.error("[upload]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
