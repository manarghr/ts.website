// Follow/Unfollow Coach API Route with MongoDB
// File: src/app/api/coaches/[id]/follow/route.js

import { NextResponse } from 'next/server';
import { checkFollowStatus, toggleFollow } from '../../../../../../backend/utils/db-helpers';

// POST - Follow or unfollow a coach
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId, action } = body; // action: 'follow' or 'unfollow'

    // Validate inputs
    if (!userId || !action) {
      return NextResponse.json(
        { error: 'User ID and action are required' },
        { status: 400 }
      );
    }

    if (action !== 'follow' && action !== 'unfollow') {
      return NextResponse.json(
        { error: 'Action must be "follow" or "unfollow"' },
        { status: 400 }
      );
    }

    // Use helper function
    const result = await toggleFollow(userId, id, action);
    
    return NextResponse.json({ 
      success: true, 
      message: result.message,
      isFollowing: result.isFollowing 
    });
  } catch (error) {
    console.error('Error in follow action:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// GET - Check if user is following a coach
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Use helper function
    const isFollowing = await checkFollowStatus(userId, id);
    
    return NextResponse.json({ 
      isFollowing 
    });
  } catch (error) {
    console.error('Error checking follow status:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

