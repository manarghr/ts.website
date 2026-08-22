// Admin API Route - Videos CRUD
// File: src/app/api/admin/videos/route.js

import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { requireAdmin } from "@/backend/utils/session";

// GET - Get all videos
export async function GET(request) {
  // Admin-only. Without this, anyone who knew the URL could call it.
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const videosCollection = await getCollection('videos');
    const videos = await videosCollection.find({}).sort({ created_at: -1 }).toArray();
    return NextResponse.json({ success: true, videos });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new video
export async function POST(request) {
  // Admin-only. Without this, anyone who knew the URL could call it.
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, video_url, thumbnail_url, bio, price, discount, discount_percentage, coach_id } = body;

    if (!title || !video_url) {
      return NextResponse.json(
        { error: 'Title and video URL are required' },
        { status: 400 }
      );
    }

    const videosCollection = await getCollection('videos');
    const newVideo = {
      id: `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      description: description || '',
      bio: bio || '',
      video_url,
      thumbnail_url: thumbnail_url || '',
      price: price || 0,
      discount: discount || false,
      discount_percentage: discount_percentage || 0,
      coach_id: coach_id || '',
      views: 0,
      likes: 0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    await videosCollection.insertOne(newVideo);
    return NextResponse.json({ success: true, video: newVideo });
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update video
export async function PUT(request) {
  // Admin-only. Without this, anyone who knew the URL could call it.
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, title, description, video_url, thumbnail_url, bio, price, discount, discount_percentage } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    const videosCollection = await getCollection('videos');
    const updateData = {
      updated_at: new Date(),
    };

    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (bio !== undefined) updateData.bio = bio;
    if (video_url) updateData.video_url = video_url;
    if (thumbnail_url !== undefined) updateData.thumbnail_url = thumbnail_url;
    if (price !== undefined) updateData.price = price;
    if (discount !== undefined) updateData.discount = discount;
    if (discount_percentage !== undefined) updateData.discount_percentage = discount_percentage;

    const result = await videosCollection.updateOne(
      { id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    const updatedVideo = await videosCollection.findOne({ id });
    return NextResponse.json({ success: true, video: updatedVideo });
  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete video
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
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    const videosCollection = await getCollection('videos');
    const result = await videosCollection.deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

