import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const MAX_FILE_BYTES = 18 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/zip",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const runtime = "nodejs";

function extensionFor(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]{1,8}$/.test(fromName)) return fromName;
  if (file.type.startsWith("image/")) return file.type.slice(6);
  return "bin";
}

async function saveFileLocally(buffer: Buffer, file: File) {
  const extension = extensionFor(file);
  const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "inquiries", "files");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), buffer);
  return `/uploads/inquiries/files/${fileName}`;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type) && !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File type is not allowed" }, { status: 400 });
  }

  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: "File is too large" }, { status: 413 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await saveFileLocally(buffer, file);
    return NextResponse.json({ name: file.name, url });
  } catch (error) {
    console.error("Inquiry file upload failed", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
