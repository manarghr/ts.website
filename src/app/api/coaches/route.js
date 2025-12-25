// API Route for listing and creating coaches
// File: src/app/api/coaches/route.js

import { NextResponse } from 'next/server';
import { getCoaches, createCoach } from '../../../../backend/utils/db-helpers';

// GET /api/coaches - list coaches with optional filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const minRating = searchParams.get('minRating');
    const search = searchParams.get('search');

    const coaches = await getCoaches({
      category: category || undefined,
      minRating: minRating || undefined,
      search: search || undefined,
    });

    return NextResponse.json({ success: true, coaches });
  } catch (error) {
    console.error('Error fetching coaches:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/coaches - create coach (for Postman)
export async function POST(request) {
  try {
    const body = await request.json();
    const { id, name, category, bio, image_url } = body;

    if (!id || !name || !category) {
      return NextResponse.json(
        { error: 'id, name, and category are required' },
        { status: 400 }
      );
    }

    const doc = await createCoach({ id, name, category, bio, image_url });
    return NextResponse.json({ success: true, coach: doc });
  } catch (error) {
    console.error('Error creating coach:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/coaches - update coach
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, name, category, bio, image_url } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Coach ID is required' },
        { status: 400 }
      );
    }

    const { getCollection } = await import('@/lib/mongodb');
    const coachesCollection = await getCollection('coaches');
    
    const updateData = {
      updated_at: new Date(),
    };

    if (name) updateData.name = name;
    if (category) updateData.category = category;
    if (bio !== undefined) updateData.bio = bio;
    if (image_url !== undefined) updateData.image_url = image_url;

    const result = await coachesCollection.updateOne(
      { id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Coach not found' },
        { status: 404 }
      );
    }

    const updatedCoach = await coachesCollection.findOne({ id });
    return NextResponse.json({ success: true, coach: updatedCoach });
  } catch (error) {
    console.error('Error updating coach:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/coaches - delete coach
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Coach ID is required' },
        { status: 400 }
      );
    }

    const { getCollection } = await import('@/lib/mongodb');
    const coachesCollection = await getCollection('coaches');
    const result = await coachesCollection.deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Coach not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Coach deleted successfully' });
  } catch (error) {
    console.error('Error deleting coach:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

