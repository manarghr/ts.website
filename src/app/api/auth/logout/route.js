// User logout
// File: src/app/api/auth/logout/route.js

import { NextResponse } from "next/server";
import {
  destroySession,
  getSessionIdFromRequest,
  clearSessionCookie,
} from "@/backend/utils/session";

export async function POST(request) {
  try {
    // Delete the row server-side as well as clearing the cookie -- otherwise a copied
    // cookie value would keep working until it expired.
    await destroySession(getSessionIdFromRequest(request));
  } catch (error) {
    console.error("POST /api/auth/logout:", error);
    // Fall through: clearing the cookie still logs them out of this browser.
  }

  return clearSessionCookie(NextResponse.json({ success: true }));
}
