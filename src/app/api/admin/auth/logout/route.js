// Admin logout
// File: src/app/api/admin/auth/logout/route.js

import { NextResponse } from "next/server";
import {
  destroySession,
  getSessionIdFromRequest,
  clearSessionCookie,
} from "@/backend/utils/session";

export async function POST(request) {
  try {
    await destroySession(getSessionIdFromRequest(request));
  } catch (error) {
    console.error("POST /api/admin/auth/logout:", error);
  }

  return clearSessionCookie(NextResponse.json({ success: true }));
}
