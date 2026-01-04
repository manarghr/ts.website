import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

// GET - Get all pending blogs
export async function GET(request) {
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

// POST - Create new pending blog (from user submission)
export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      title,
      excerpt,
      author,
      readTime,
      image,
      category,
      sections,
      submittedBy
    } = body;

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
      submittedBy,
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