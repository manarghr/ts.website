// Blogs you submitted
// File: src/app/api/blogs/mine/route.js
//
// Pending and published together, because from the author's side they are one
// list with a status -- not two places to go looking.

import { NextResponse } from "next/server";
import { requireUser } from "@/backend/utils/session";
import { getCollection } from "@/lib/mongodb";

// Never prerendered: this route depends on the request and the database.
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const userId = await requireUser(request);
    if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const [pending, published] = await Promise.all([
      (await getCollection("pending_blogs"))
        .find({ submittedBy: userId })
        .sort({ created_at: -1 })
        .limit(100)
        .project({ _id: 0 })
        .toArray(),
      (await getCollection("blog"))
        .find({ submittedBy: userId })
        .sort({ created_at: -1 })
        .limit(100)
        .project({ _id: 0 })
        .toArray(),
    ]);

    const blogs = [
      ...pending.map((blog) => ({ ...blog, status: "pending" })),
      ...published.map((blog) => ({ ...blog, status: "published" })),
    ].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

    return NextResponse.json({
      success: true,
      blogs,
      pendingCount: pending.length,
      publishedCount: published.length,
    });
  } catch (error) {
    console.error("GET /api/blogs/mine:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
