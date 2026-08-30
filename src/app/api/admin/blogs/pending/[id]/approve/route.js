import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { requireAdmin } from "@/backend/utils/session";

// POST - Approve pending blog
export async function POST(request, context) {
  // Admin-only. Without this, anyone who knew the URL could call it.
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Await params in Next.js 15
    const params = await context.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    const pendingBlogCollection = await getCollection('pending_blogs');
    const blogCollection = await getCollection('blog');

    // Get the pending blog
    const pendingBlog = await pendingBlogCollection.findOne({ id });

    if (!pendingBlog) {
      return NextResponse.json(
        { error: 'Pending blog not found' },
        { status: 404 }
      );
    }

    // Create approved blog (remove pending-specific fields but keep authorship)
    const { status, created_at, _id, ...blogData } = pendingBlog;

    const approvedBlog = {
      ...blogData,
      // Preserve coach_id if it exists (for coach-submitted blogs)
      coach_id: pendingBlog.coach_id || blogData.coach_id || null,
      // ...and submittedBy for user-submitted ones. This used to be dropped here,
      // so a published blog had no record of who wrote it and could never be
      // listed back to its author.
      submittedBy: pendingBlog.submittedBy || null,
      id: `blog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Insert into main blog collection
    await blogCollection.insertOne(approvedBlog);

    // Remove from pending collection
    await pendingBlogCollection.deleteOne({ id });

    return NextResponse.json({ success: true, blog: approvedBlog });
  } catch (error) {
    console.error('Error approving blog:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}