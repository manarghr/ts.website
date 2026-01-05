import { NextResponse } from "next/server";
import { deleteCoachSession, getCoachSessionCookieName } from "@/backend/utils/coach-auth-helpers";

export async function POST(request) {
  try {
    const cookieName = getCoachSessionCookieName();
    const sid = request?.cookies?.get(cookieName)?.value;
    if (sid) await deleteCoachSession(sid);

    const res = NextResponse.json({ success: true });
    res.cookies.set(cookieName, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
    return res;
  } catch (error) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

