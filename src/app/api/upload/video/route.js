// Video upload
// File: src/app/api/upload/video/route.js
//
// Only coaches upload videos -- the coach dashboard is the sole caller.

import { NextResponse } from "next/server";
import { requireCoach } from "@/backend/utils/session";
import {
  saveUpload,
  UploadError,
  VIDEO_TYPES,
  MAX_VIDEO_BYTES,
} from "@/backend/utils/upload-helpers";

// Never prerendered: this route depends on the request and the database.
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    if (!(await requireCoach(request))) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const formData = await request.formData();
    const { url, filename } = await saveUpload(formData.get("file"), {
      allowed: VIDEO_TYPES,
      maxBytes: MAX_VIDEO_BYTES,
      subdir: ["uploads", "videos"],
    });

    return NextResponse.json({ success: true, videoUrl: url, filename });
  } catch (error) {
    if (error instanceof UploadError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("POST /api/upload/video:", error);
    return NextResponse.json({ error: "Failed to upload video" }, { status: 500 });
  }
}
