import { NextResponse } from "next/server";
import { getCoachIdFromSession, getCoachSessionCookieName } from "@/backend/utils/coach-auth-helpers";
import { getCollection } from "@/lib/mongodb";

// Never prerendered: this route depends on the request and the database.
export const dynamic = "force-dynamic";

function isValidDateString(d) {
  // YYYY-MM-DD
  return typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d);
}

export async function GET(request) {
  try {
    const sid = request?.cookies?.get(getCoachSessionCookieName())?.value;
    const coachId = await getCoachIdFromSession(sid);
    if (!coachId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const announcements = await getCollection("announcements");
    const items = await announcements
      .find({ coach_id: coachId })
      .sort({ date: -1, created_at: -1 })
      .limit(100)
      .toArray();

    return NextResponse.json({
      success: true,
      announcements: items.map((a) => ({
        id: a._id?.toString(),
        title: a.title,
        content: a.content,
        date: a.date,
        created_at: a.created_at,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const sid = request?.cookies?.get(getCoachSessionCookieName())?.value;
    const coachId = await getCoachIdFromSession(sid);
    if (!coachId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const body = await request.json();
    const { title, content, date } = body;

    if (!title || !String(title).trim()) return NextResponse.json({ error: "Title is required" }, { status: 400 });
    if (!content || !String(content).trim()) return NextResponse.json({ error: "Content is required" }, { status: 400 });
    if (!isValidDateString(date)) return NextResponse.json({ error: "Date must be YYYY-MM-DD" }, { status: 400 });

    const announcements = await getCollection("announcements");
    const doc = {
      coach_id: coachId,
      title: String(title).trim(),
      content: String(content).trim(),
      date,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const result = await announcements.insertOne(doc);

    return NextResponse.json({
      success: true,
      announcement: { ...doc, id: result.insertedId.toString() },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

