// A coach's wallet
// File: src/app/api/coach/earnings/route.js

import { NextResponse } from "next/server";
import { requireCoach } from "@/backend/utils/session";
import { getCoachWallet } from "@/backend/utils/purchase-helpers";

// Never prerendered: this route depends on the request and the database.
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const coachId = await requireCoach(request);
    if (!coachId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json({ success: true, wallet: await getCoachWallet(coachId) });
  } catch (error) {
    console.error("GET /api/coach/earnings:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
