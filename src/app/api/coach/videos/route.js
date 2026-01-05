import { NextResponse } from "next/server";
import crypto from "crypto";
import { getCollection } from "@/lib/mongodb";
import { getCoachIdFromSession, getCoachSessionCookieName } from "@/backend/utils/coach-auth-helpers";

export async function GET(request) {
  try {
    const sid = request?.cookies?.get(getCoachSessionCookieName())?.value;
    const coachId = await getCoachIdFromSession(sid);
    if (!coachId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const videos = await getCollection("videos");
    const items = await videos
      .find({ coach_id: coachId })
      .sort({ created_at: -1 })
      .limit(200)
      .toArray();
    return NextResponse.json({ success: true, videos: items });
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
    const { title, description, video_url, thumbnail_url, bio, price, discount, discount_percentage, duration } = body;
    if (!title || !String(title).trim()) return NextResponse.json({ error: "Title is required" }, { status: 400 });
    if (!video_url || !String(video_url).trim()) return NextResponse.json({ error: "Video URL is required" }, { status: 400 });

    const videos = await getCollection("videos");
    const now = new Date();
    const doc = {
      id: `video_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
      coach_id: coachId,
      title: String(title).trim(),
      description: String(description || "").trim(),
      bio: String(bio || "").trim(),
      video_url: String(video_url).trim(),
      thumbnail_url: String(thumbnail_url || "").trim(),
      duration: String(duration || "").trim(),
      price: typeof price === "number" ? price : Number(price || 0),
      discount: !!discount,
      discount_percentage: typeof discount_percentage === "number" ? discount_percentage : Number(discount_percentage || 0),
      views: 0,
      likes: 0,
      created_at: now,
      updated_at: now,
    };
    await videos.insertOne(doc);
    return NextResponse.json({ success: true, video: doc });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
