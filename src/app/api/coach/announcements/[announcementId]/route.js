import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCoachIdFromSession, getCoachSessionCookieName } from "@/backend/utils/coach-auth-helpers";
import { getCollection } from "@/lib/mongodb";

function isValidDateString(d) {
  return typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d);
}

function parseObjectId(id) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

export async function PUT(request, { params }) {
  try {
    const sid = request?.cookies?.get(getCoachSessionCookieName())?.value;
    const coachId = await getCoachIdFromSession(sid);
    if (!coachId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { announcementId } = await params;
    const _id = parseObjectId(announcementId);
    if (!_id) return NextResponse.json({ error: "Invalid announcement id" }, { status: 400 });

    const body = await request.json();
    const { title, content, date } = body;

    const update = { updated_at: new Date() };
    if (title !== undefined) update.title = String(title).trim();
    if (content !== undefined) update.content = String(content).trim();
    if (date !== undefined) {
      if (!isValidDateString(date)) return NextResponse.json({ error: "Date must be YYYY-MM-DD" }, { status: 400 });
      update.date = date;
    }

    const announcements = await getCollection("announcements");
    const existing = await announcements.findOne({ _id });
    if (!existing) return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
    if (existing.coach_id !== coachId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await announcements.updateOne({ _id }, { $set: update });
    const updated = await announcements.findOne({ _id });
    return NextResponse.json({
      success: true,
      announcement: {
        id: updated._id.toString(),
        title: updated.title,
        content: updated.content,
        date: updated.date,
        created_at: updated.created_at,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const sid = request?.cookies?.get(getCoachSessionCookieName())?.value;
    const coachId = await getCoachIdFromSession(sid);
    if (!coachId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { announcementId } = await params;
    const _id = parseObjectId(announcementId);
    if (!_id) return NextResponse.json({ error: "Invalid announcement id" }, { status: 400 });

    const announcements = await getCollection("announcements");
    const existing = await announcements.findOne({ _id });
    if (!existing) return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
    if (existing.coach_id !== coachId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await announcements.deleteOne({ _id });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

