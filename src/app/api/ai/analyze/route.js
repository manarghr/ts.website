// Pose analysis proxy -- OFF unless explicitly configured
// File: src/app/api/ai/analyze/route.js
//
// The website does NOT use this route. Pose analysis runs in the browser
// (src/components/AI/PoseEngine.jsx + src/lib/ai/), so camera frames never
// leave the viewer's device.
//
// This exists only to run the Python reference implementation side by side
// during development (see AI/README.md). It forwards a frame to that service,
// which makes it the one place in the codebase where camera data could cross
// the network -- so it stays disabled unless AI_SERVER_URL is explicitly set.
//
// Deliberately NOT defaulting to http://127.0.0.1:8001: with a default, the
// only thing preventing frames from being forwarded in production is an
// environment variable happening to be unset. That is an accident, not a
// guarantee. Setting the variable is now a conscious act.

import { NextResponse } from "next/server";
import { requireUser } from "@/backend/utils/session";

// Never prerendered: this route depends on the request and the database.
export const dynamic = "force-dynamic";

// A 640x480 JPEG is ~100KB as base64. 2MB leaves generous headroom while stopping
// someone from streaming arbitrary payloads through us to the Python server.
const MAX_BODY_BYTES = 2 * 1024 * 1024;

const DISABLED = {
  ok: false,
  error:
    "Server-side pose analysis is disabled. This deployment analyses poses in the browser; " +
    "camera frames are not uploaded. Set AI_SERVER_URL to enable the Python reference service.",
};

export async function POST(request) {
  try {
    const baseUrl = process.env.AI_SERVER_URL;
    // Checked before authentication on purpose: when the feature is off there is
    // nothing to authorise, and no reason to touch the session store.
    if (!baseUrl) {
      return NextResponse.json(DISABLED, { status: 503 });
    }

    if (!(await requireUser(request))) {
      return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
    }

    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ ok: false, error: "Frame too large" }, { status: 413 });
    }

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
