import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const MAX_AUDIO_BYTES = 12 * 1024 * 1024;
const EXTENSIONS: Record<string, string> = {
  "audio/webm": "webm",
  "audio/wav": "wav",
  "audio/wave": "wav",
  "audio/mpeg": "mp3",
  "audio/mp4": "m4a",
  "audio/ogg": "ogg",
};

export const runtime = "nodejs";

async function saveAudioLocally(buffer: Buffer, type: string) {
  const extension = EXTENSIONS[type] ?? "webm";
  const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "inquiries", "audio");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), buffer);
  return `/uploads/inquiries/audio/${fileName}`;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
  }

  if (!file.type.startsWith("audio/")) {
    return NextResponse.json({ error: "Only audio files are allowed" }, { status: 400 });
  }

  if (file.size > MAX_AUDIO_BYTES) {
    return NextResponse.json({ error: "Audio file is too large" }, { status: 413 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await saveAudioLocally(buffer, file.type);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Inquiry audio upload failed", error);
    return NextResponse.json({ error: "Audio upload failed" }, { status: 500 });
  }
}
