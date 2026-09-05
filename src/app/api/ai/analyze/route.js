// Pose analysis proxy
// File: src/app/api/ai/analyze/route.js
//
// Forwards a frame to the Python MediaPipe server. Signed-in users only: without
// that, anyone on the internet can run pose analysis on our hardware for free,
// which becomes a real bill once the AI server is hosted.

import { NextResponse } from "next/server";
import { requireUser } from "@/backend/utils/session";

// Never prerendered: this route depends on the request and the database.
export const dynamic = "force-dynamic";

// A 640x480 JPEG is ~100KB as base64. 2MB leaves generous headroom while stopping
// someone from streaming arbitrary payloads through us to the Python server.
const MAX_BODY_BYTES = 2 * 1024 * 1024;

export async function POST(request) {
  try {
    if (!(await requireUser(request))) {
      return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
    }

    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ ok: false, error: "Frame too large" }, { status: 413 });
    }

    const baseUrl = process.env.AI_SERVER_URL || "http://127.0.0.1:8001";
    const res = await fetch(`${baseUrl}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: raw,
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      console.error(`AI backend error (${res.status}):`, errorText);
      return NextResponse.json(
        { ok: false, error: `AI server error (${res.status})` },
        { status: res.status }
      );
    }

    return NextResponse.json(await res.json(), { status: res.status });
  } catch (e) {
    console.error("POST /api/ai/analyze:", e);
    return NextResponse.json({ ok: false, error: "AI server not reachable" }, { status: 502 });
  }
}
