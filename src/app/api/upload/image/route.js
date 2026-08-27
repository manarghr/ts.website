// Image upload
// File: src/app/api/upload/image/route.js
//
// Any signed-in principal may upload -- users, coaches and admins all need it.
// Signed out is refused: without that, a stranger could fill the disk.

import { NextResponse } from "next/server";
import { getCurrentSession } from "@/backend/utils/session";
import {
  saveUpload,
  UploadError,
  IMAGE_TYPES,
  MAX_IMAGE_BYTES,
} from "@/backend/utils/upload-helpers";

export async function POST(request) {
  try {
    if (!(await getCurrentSession(request))) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const formData = await request.formData();
    const { url, filename } = await saveUpload(formData.get("file"), {
      allowed: IMAGE_TYPES,
      maxBytes: MAX_IMAGE_BYTES,
      subdir: ["uploads"],
    });

    return NextResponse.json({ success: true, imageUrl: url, filename });
  } catch (error) {
    if (error instanceof UploadError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("POST /api/upload/image:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
