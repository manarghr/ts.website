// Admin API Route - Blog CRUD
// File: src/app/api/admin/blog/route.js

import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { requireAdmin } from "@/backend/utils/session";

// Never prerendered: this route depends on the request and the database.
export const dynamic = "force-dynamic";

// GET - Get all meals
export async function GET(request) {
  try {
    const blogCollection = await getCollection('blog');
    const blogs = await blogCollection.find({}).sort({ created_at: -1 }).toArray();
    return NextResponse.json({ success: true, blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new blog
export async function POST(request) {
  // Admin-only. Without this, anyone who knew the URL could call it.
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { 
    id,
    title,
    excerpt,
    author,
    date,
    readTime,
    image,
    category,
    sections
    } = body;



    const blogCollection = await getCollection('blog');
    const newBlog = {
      id: `blog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      excerpt,
      author,
      date,
      readTime,
      image,
      category : category || 'Training',
      sections,  
      created_at: new Date(),
    };

    await blogCollection.insertOne(newBlog);
    return NextResponse.json({ success: true, blog: newBlog });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update blog
export async function PUT(request) {
  // Admin-only. Without this, anyone who knew the URL could call it.
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { 
    id,
    title,
    excerpt,
    author,
    date,
    readTime,
    image,
    category,
    sections
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    const blogCollection = await getCollection('blog');
    const updateData = {
      updated_at: new Date(),
    };

    if (title) updateData.title = title;
    if (excerpt) updateData.excerpt = excerpt;
    if (author) updateData.author = author;
    if (date) updateData.date = date;
    if (readTime) updateData.readTime = readTime;
    if (image) updateData.image = image;
    if (category) updateData.category = category;
    if (sections) updateData.sections = sections;


    const result = await blogCollection.updateOne(
      { id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    const updatedBlog = await blogCollection.findOne({ id });
    return NextResponse.json({ success: true, blog: updatedBlog });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog
export async function DELETE(request) {
  // Admin-only. Without this, anyone who knew the URL could call it.
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    const blogCollection = await getCollection('blog');
    
    // Delete by string ID (not parseInt)
    const result = await blogCollection.deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}