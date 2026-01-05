// API Route for listing and creating coaches
// File: src/app/api/coaches/route.js

import { NextResponse } from 'next/server';
import { getCoaches, createCoach } from '../../../../backend/utils/db-helpers';

// GET /api/coaches - list coaches with optional filters
export async function GET(request) {
  try {
    console.log('=== COACHES API: Starting fetch ===');
    
    // Check MongoDB URI first
    if (!process.env.MONGODB_URI) {
      console.error('MongoDB URI is not configured');
      return NextResponse.json(
        { 
          success: false,
          error: 'Database not configured', 
          details: 'MongoDB URI is missing. Please add MONGODB_URI to .env.local',
          coaches: [] 
        },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const minRating = searchParams.get('minRating');
    const search = searchParams.get('search');

    console.log('Filters:', { category, minRating, search });

    const coaches = await getCoaches({
      category: category || undefined,
      minRating: minRating || undefined,
      search: search || undefined,
    });

    console.log('Coaches fetched:', coaches?.length || 0);
    console.log('Coaches data:', coaches);

    return NextResponse.json({ success: true, coaches: coaches || [] });
  } catch (error) {
    console.error('=== COACHES API ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Ensure we always return valid JSON
    const errorMessage = error.message || 'Unknown error occurred';
    const errorDetails = error.stack ? error.stack.split('\n')[0] : 'No stack trace available';
    
    // Provide user-friendly error message
    let userMessage = 'Failed to fetch coaches';
    if (errorMessage.includes('timed out') || errorMessage.includes('connection')) {
      userMessage = 'Database connection failed. Please ensure MongoDB is running and check your connection settings.';
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: userMessage, 
        details: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorDetails : undefined,
        coaches: [] 
      },
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
    const coachAccounts = await getCollection('coach_accounts');
    const coachSessions = await getCollection('coach_sessions');
    const announcements = await getCollection('announcements');
    const programs = await getCollection('training_programs');
    const videos = await getCollection('videos');
    const blogs = await getCollection('blog');

    // Delete auth account
    await coachAccounts.deleteMany({ coach_id: id });
    // Delete sessions
    await coachSessions.deleteMany({ coach_id: id });
    // Delete related content
    await announcements.deleteMany({ coach_id: id });
    await programs.deleteMany({ coach_id: id });
    await videos.deleteMany({ coach_id: id });
    await blogs.deleteMany({ coach_id: id });

    // Delete public profile
    const result = await coachesCollection.deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Coach not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Coach deleted successfully (profile, account, sessions, content)' });
  } catch (error) {
    console.error('Error deleting coach:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

