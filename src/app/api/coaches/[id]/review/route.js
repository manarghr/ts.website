// Coach reviews
// File: src/app/api/coaches/[id]/review/route.js
//
// The reviewer is always the session user -- never a userId sent in the body, which
// would let anyone post a review under someone else's name or delete a review that
// isn't theirs. The display name is looked up server-side for the same reason.

import { NextResponse } from 'next/server';
import { requireUser } from '@/backend/utils/session';
import { getUserById } from '@/backend/utils/auth-helpers';
import {
  addCoachRating,
  deleteCoachRating,
  getUserReviewForCoach,
} from '@/backend/utils/db-helpers';
import { notify, NOTIFICATION_TYPES } from '@/backend/utils/notification-helpers';

const UNAUTHORIZED = NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

const MIN_COMMENT_LENGTH = 10;

// POST /api/coaches/[id]/review   { rating, comment }
export async function POST(request, { params }) {
  try {
    const userId = await requireUser(request);
    if (!userId) return UNAUTHORIZED;

    const { id } = await params;
    const { rating, comment } = await request.json();

    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json({ error: 'Rating must be a whole number from 1 to 5' }, { status: 400 });
    }

    const trimmedComment = String(comment || '').trim();
    if (trimmedComment.length < MIN_COMMENT_LENGTH) {
      return NextResponse.json(
        { error: `Comment must be at least ${MIN_COMMENT_LENGTH} characters` },
        { status: 400 }
      );
    }

    // The name shown next to the review comes from the account, not the request.
    const user = await getUserById(userId);
    if (!user) return UNAUTHORIZED;

    const result = await addCoachRating(id, userId, user.fullName || 'Anonymous', numericRating, trimmedComment);

    await notify({
      recipientId: id,
      recipientRole: 'coach',
      type: NOTIFICATION_TYPES.REVIEW,
      title: `${user.fullName || 'Someone'} left you a ${numericRating}-star review`,
      body: trimmedComment.slice(0, 140),
      link: `/coaches/${id}`,
    });

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully',
      newRating: result.newRating,
      totalRatings: result.totalRatings,
    });
  } catch (error) {
    console.error('POST /api/coaches/[id]/review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/coaches/[id]/review
// Takes no body: you can only ever delete your own review.
export async function DELETE(request, { params }) {
  try {
    const userId = await requireUser(request);
    if (!userId) return UNAUTHORIZED;

    const { id } = await params;
    await deleteCoachRating(id, userId);

    return NextResponse.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/coaches/[id]/review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/coaches/[id]/review -> has the signed-in user reviewed this coach?
// Signed out is not an error here: the page just renders the "log in to review" state.
export async function GET(request, { params }) {
  try {
    const userId = await requireUser(request);
    if (!userId) return NextResponse.json({ hasReviewed: false, review: null });

    const { id } = await params;
    const review = await getUserReviewForCoach(id, userId);

    return NextResponse.json({ hasReviewed: !!review, review: review || null });
  } catch (error) {
    console.error('GET /api/coaches/[id]/review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
