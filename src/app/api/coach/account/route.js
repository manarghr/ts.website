import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { getCoachIdFromSession, getCoachSessionCookieName } from "@/backend/utils/coach-auth-helpers";

// DELETE /api/coach/account
// Protected: deletes the logged-in coach account + profile + related data.
export async function DELETE(request) {
  try {
    const sid = request?.cookies?.get(getCoachSessionCookieName())?.value;
    const coachId = await getCoachIdFromSession(sid);
    if (!coachId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const coachAccounts = await getCollection("coach_accounts");
    const coaches = await getCollection("coaches");
    const sessions = await getCollection("coach_sessions");
    const announcements = await getCollection("announcements");
    const programs = await getCollection("training_programs");
    const videos = await getCollection("videos");
    const blogs = await getCollection("blog");

    // Delete auth account
    await coachAccounts.deleteMany({ coach_id: coachId });
    // Delete public profile
    await coaches.deleteMany({ id: coachId });
    // Delete sessions
    await sessions.deleteMany({ coach_id: coachId });
    // Delete related content
    await announcements.deleteMany({ coach_id: coachId });
    await programs.deleteMany({ coach_id: coachId });
    await videos.deleteMany({ coach_id: coachId });
    await blogs.deleteMany({ coach_id: coachId });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

