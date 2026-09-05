import { NextResponse } from "next/server";
import crypto from "crypto";
import { getCollection } from "@/lib/mongodb";
import { getCoachIdFromSession, getCoachSessionCookieName } from "@/backend/utils/coach-auth-helpers";

// Never prerendered: this route depends on the request and the database.
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const sid = request?.cookies?.get(getCoachSessionCookieName())?.value;
    const coachId = await getCoachIdFromSession(sid);
    if (!coachId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    // Get both approved blogs and pending blogs for this coach
    const blog = await getCollection("blog");
    const pendingBlog = await getCollection("pending_blogs");
    
    const [approvedBlogs, pendingBlogs] = await Promise.all([
      blog.find({ coach_id: coachId }).sort({ created_at: -1 }).limit(200).toArray(),
      pendingBlog.find({ coach_id: coachId }).sort({ created_at: -1 }).limit(200).toArray(),
    ]);

    // Combine and mark status
    const allBlogs = [
      ...approvedBlogs.map(b => ({ ...b, status: "approved" })),
      ...pendingBlogs.map(b => ({ ...b, status: "pending" })),
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return NextResponse.json({ success: true, blogs: allBlogs });
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
    const { title, excerpt, author, category, image, readTime, date, sections } = body;
    if (!title || !String(title).trim()) return NextResponse.json({ error: "Title is required" }, { status: 400 });
    if (!excerpt || !String(excerpt).trim()) return NextResponse.json({ error: "Excerpt is required" }, { status: 400 });

    // Create pending blog (coach blogs need admin approval)
    const pendingBlog = await getCollection("pending_blogs");
    const now = new Date();
    const doc = {
      id: `pending_blog_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
      coach_id: coachId,
      title: String(title).trim(),
      excerpt: String(excerpt).trim(),
      author: String(author || coachId).trim(),
      date: date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: readTime || "5 min read",
      image: image || "",
      category: category || "training",
      sections: Array.isArray(sections) && sections.length > 0 ? sections : [{ title: "", content: "" }],
      status: "pending",
      submittedBy: coachId,
      created_at: now,
    };
    await pendingBlog.insertOne(doc);
    return NextResponse.json({ success: true, blog: doc, message: "Blog submitted for review. It will be published after admin approval." });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

