// File: src/app/api/coaches/[id]/review/route.js

import { NextResponse } from 'next/server';
import { addCoachRating, getUserReviewForCoach } from '../../../../../../backend/utils/db-helpers';

export async function POST(request, { params }) {
  console.log('=== Review API Called ===');
  
  try {
    const { id } = await params;
    console.log('Coach ID:', id);
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const { userId, userName, rating, comment } = body;

    // Validation
    if (!userId || !userName || !rating || !comment) {
      console.error('Missing fields:', { userId, userName, rating, comment });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      console.error('Invalid rating:', rating);
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (comment.trim().length < 10) {
      console.error('Comment too short:', comment.length);
      return NextResponse.json(
        { error: 'Comment must be at least 10 characters' },
        { status: 400 }
      );
    }

    console.log('Validation passed, adding rating...');
    
    // Add or update the rating
    const result = await addCoachRating(id, userId, userName, rating, comment);
    
    console.log('Rating added successfully:', result);

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully',
      newRating: result.newRating,
      totalRatings: result.totalRatings,
    });
  } catch (error) {
    console.error('=== Review API Error ===');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove a review
export async function DELETE(request, { params }) {
  console.log('=== Review DELETE API Called ===');
  
  try {
    const { id } = await params;
    console.log('Coach ID:', id);
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const { userId } = body;

    // Validation
    if (!userId) {
      console.error('Missing userId');
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    console.log('Deleting review for user:', userId);
    
    // Import deleteCoachRating function
    const { deleteCoachRating } = await import('../../../../../../backend/utils/db-helpers');
    
    // Delete the rating
    const result = await deleteCoachRating(id, userId);
    
    console.log('Review deleted successfully:', result);

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('=== Review DELETE API Error ===');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to check if user already reviewed
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter required' },
        { status: 400 }
      );
    }

    const existingReview = await getUserReviewForCoach(id, userId);

    return NextResponse.json({
      hasReviewed: !!existingReview,
      review: existingReview || null,
    });
  } catch (error) {
    console.error('Error checking review status:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}