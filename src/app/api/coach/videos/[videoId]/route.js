import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { getCoachIdFromSession, getCoachSessionCookieName } from "@/backend/utils/coach-auth-helpers";

export async function PUT(request, { params }) {
  try {
    const sid = request?.cookies?.get(getCoachSessionCookieName())?.value;
    const coachId = await getCoachIdFromSession(sid);
    if (!coachId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { videoId } = await params;
    if (!videoId) return NextResponse.json({ error: "Video ID is required" }, { status: 400 });

    const body = await request.json();
    const { title, description, video_url, thumbnail_url, bio, price, discount, discount_percentage, duration } = body;

    const videos = await getCollection("videos");
    const existing = await videos.findOne({ id: videoId });
    if (!existing) return NextResponse.json({ error: "Video not found" }, { status: 404 });
    if (existing.coach_id !== coachId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const update = { updated_at: new Date() };
    if (title !== undefined) update.title = String(title).trim();
    if (description !== undefined) update.description = String(description).trim();
    if (bio !== undefined) update.bio = String(bio).trim();
    if (video_url !== undefined) update.video_url = String(video_url).trim();
    if (thumbnail_url !== undefined) update.thumbnail_url = String(thumbnail_url).trim();
    if (duration !== undefined) update.duration = String(duration).trim();
    if (price !== undefined) update.price = typeof price === "number" ? price : Number(price || 0);
    if (discount !== undefined) update.discount = !!discount;
    if (discount_percentage !== undefined) {
      update.discount_percentage =
        typeof discount_percentage === "number" ? discount_percentage : Number(discount_percentage || 0);
    }

    await videos.updateOne({ id: videoId }, { $set: update });
    const updated = await videos.findOne({ id: videoId });
    return NextResponse.json({ success: true, video: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const sid = request?.cookies?.get(getCoachSessionCookieName())?.value;
    const coachId = await getCoachIdFromSession(sid);
    if (!coachId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { videoId } = await params;
    if (!videoId) return NextResponse.json({ error: "Video ID is required" }, { status: 400 });

    const videos = await getCollection("videos");
    const existing = await videos.findOne({ id: videoId });
    if (!existing) return NextResponse.json({ error: "Video not found" }, { status: 404 });
    if (existing.coach_id !== coachId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await videos.deleteOne({ id: videoId });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
