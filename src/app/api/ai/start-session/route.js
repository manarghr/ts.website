// Start a pose-analysis session
// File: src/app/api/ai/start-session/route.js

import { NextResponse } from "next/server";
import { requireUser } from "@/backend/utils/session";

// Never prerendered: this route depends on the request and the database.
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    if (!(await requireUser(request))) {
      return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
    }

    const baseUrl = process.env.AI_SERVER_URL || "http://127.0.0.1:8001";
    const res = await fetch(`${baseUrl}/start-session`, { method: "POST" });

    return NextResponse.json(await res.json(), { status: res.status });
  } catch (e) {
    console.error("POST /api/ai/start-session:", e);
    return NextResponse.json({ ok: false, error: "AI server not reachable" }, { status: 502 });
  }
}
