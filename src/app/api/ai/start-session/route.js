// Start a pose-analysis session -- OFF unless explicitly configured
// File: src/app/api/ai/start-session/route.js
//
// Companion to /api/ai/analyze, and disabled the same way. The browser path
// keeps its own session state in memory (src/lib/ai/session.js), so nothing
// about a workout needs to be registered on the server to count reps.

import { NextResponse } from "next/server";
import { requireUser } from "@/backend/utils/session";

// Never prerendered: this route depends on the request and the database.
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const baseUrl = process.env.AI_SERVER_URL;
    if (!baseUrl) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Server-side pose analysis is disabled. This deployment analyses poses in the browser.",
        },
        { status: 503 }
      );
    }

    if (!(await requireUser(request))) {
      return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
    }

    const res = await fetch(`${baseUrl}/start-session`, { method: "POST" });

    return NextResponse.json(await res.json(), { status: res.status });
  } catch (e) {
    console.error("POST /api/ai/start-session:", e);
    return NextResponse.json({ ok: false, error: "AI server not reachable" }, { status: 502 });
  }
}
