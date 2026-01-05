import { NextResponse } from "next/server";
import crypto from "crypto";
import { getCollection } from "@/lib/mongodb";
import { getCoachIdFromSession, getCoachSessionCookieName } from "@/backend/utils/coach-auth-helpers";

export async function GET(request) {
  try {
    const sid = request?.cookies?.get(getCoachSessionCookieName())?.value;
    const coachId = await getCoachIdFromSession(sid);
    if (!coachId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const blog = await getCollection("blog");
    const items = await blog
      .find({ coach_id: coachId })
      .sort({ created_at: -1 })
      .limit(200)
      .toArray();
    return NextResponse.json({ success: true, blogs: items });
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
    const { title, excerpt, category, image, readTime, date, content } = body;
    if (!title || !String(title).trim()) return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const blog = await getCollection("blog");
    const now = new Date();
    const doc = {
      id: `blog_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
      coach_id: coachId,
      title: String(title).trim(),
      excerpt: String(excerpt || "").trim(),
      author: coachId,
      date: date || now.toISOString().slice(0, 10),
      readTime: readTime || "3 min read",
      image: image || "",
      category: category || "training",
      sections: [
        {
          title: "Article",
          content: String(content || "").trim(),
        },
      ],
      created_at: now,
      updated_at: now,
    };
    await blog.insertOne(doc);
    return NextResponse.json({ success: true, blog: doc });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

