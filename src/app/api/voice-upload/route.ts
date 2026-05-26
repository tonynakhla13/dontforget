import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

// Public endpoint — accepts voice recordings from the contact form
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Basic safety: limit to ~10MB audio uploads
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 413 });
  }

  // Only allow audio mime types
  if (!file.type.startsWith("audio/")) {
    return NextResponse.json({ error: "Only audio files allowed" }, { status: 415 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await uploadToCloudinary(buffer, "dontforget/voice-notes");
  return NextResponse.json({ url });
}
