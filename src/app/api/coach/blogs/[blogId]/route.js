import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { getCoachIdFromSession, getCoachSessionCookieName } from "@/backend/utils/coach-auth-helpers";

// Never prerendered: this route depends on the request and the database.
export const dynamic = "force-dynamic";

export async function PUT(request, { params }) {
  try {
    const sid = request?.cookies?.get(getCoachSessionCookieName())?.value;
    const coachId = await getCoachIdFromSession(sid);
    if (!coachId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { blogId } = await params;
    if (!blogId) return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });

    const body = await request.json();
    const { title, excerpt, category, image, readTime, date, content } = body;

    const blog = await getCollection("blog");
    const existing = await blog.findOne({ id: blogId });
    if (!existing) return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    if (existing.coach_id !== coachId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const update = { updated_at: new Date() };
    if (title !== undefined) update.title = String(title).trim();
    if (excerpt !== undefined) update.excerpt = String(excerpt).trim();
    if (category !== undefined) update.category = category;
    if (image !== undefined) update.image = image;
    if (readTime !== undefined) update.readTime = readTime;
    if (date !== undefined) update.date = date;
    if (content !== undefined) update.sections = [{ title: "Article", content: String(content).trim() }];

    await blog.updateOne({ id: blogId }, { $set: update });
    const updated = await blog.findOne({ id: blogId });
    return NextResponse.json({ success: true, blog: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const sid = request?.cookies?.get(getCoachSessionCookieName())?.value;
    const coachId = await getCoachIdFromSession(sid);
    if (!coachId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { blogId } = await params;
    if (!blogId) return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });

    const blog = await getCollection("blog");
    const existing = await blog.findOne({ id: blogId });
    if (!existing) return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    if (existing.coach_id !== coachId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await blog.deleteOne({ id: blogId });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

