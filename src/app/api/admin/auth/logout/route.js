// Admin logout
// File: src/app/api/admin/auth/logout/route.js

import { NextResponse } from "next/server";
import {
  destroySession,
  getSessionIdFromRequest,
  clearSessionCookie,
} from "@/backend/utils/session";

// Never prerendered: this route depends on the request and the database.
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    await destroySession(getSessionIdFromRequest(request));
  } catch (error) {
    console.error("POST /api/admin/auth/logout:", error);
  }

  return clearSessionCookie(NextResponse.json({ success: true }));
}
