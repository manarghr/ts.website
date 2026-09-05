import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { requireAdmin, getCurrentSession, ROLES } from "@/backend/utils/session";

// Never prerendered: this route depends on the request and the database.
export const dynamic = "force-dynamic";

// GET - Get all pending blogs
export async function GET(request) {
  // Admin-only. Without this, anyone who knew the URL could call it.
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const pendingBlogCollection = await getCollection('pending_blogs');
    const pendingBlogs = await pendingBlogCollection.find({}).sort({ created_at: -1 }).toArray();
    return NextResponse.json({ success: true, blogs: pendingBlogs });
  } catch (error) {
    console.error('Error fetching pending blogs:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Submit a blog for review.
// Not admin-only: any signed-in user or coach may submit. But they must be signed
// in, and the author is taken from their session -- previously `submittedBy` came
// straight from the request body, so anyone could submit as anyone.
export async function POST(request) {
  try {
    const session = await getCurrentSession(request);

    if (!session || (session.role !== ROLES.USER && session.role !== ROLES.COACH)) {
      return NextResponse.json(
        { error: 'You must be signed in to submit a blog' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      excerpt,
      author,
      readTime,
      image,
      category,
      sections,
    } = body;

    if (!title || !String(title).trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const pendingBlogCollection = await getCollection('pending_blogs');
    const newPendingBlog = {
      id: `pending_blog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      excerpt,
      author,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime,
      image,
      category: category || 'training',
      sections,
      status: 'pending',
      submittedBy: session.principalId,
      submittedByRole: session.role,
      created_at: new Date(),
    };

    await pendingBlogCollection.insertOne(newPendingBlog);
    return NextResponse.json({ success: true, blog: newPendingBlog });
  } catch (error) {
    console.error('Error creating pending blog:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}