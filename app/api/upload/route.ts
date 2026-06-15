import { NextResponse } from "next/server";

import { uploadHeadshot } from "@/lib/gcs";
import { validateUploadBuffer } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const contentType = file.type || "image/png";
    const validation = validateUploadBuffer(buffer, contentType);

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const url = await uploadHeadshot(buffer, contentType);
    return NextResponse.json({ url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload failed";
    console.error("Upload error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
