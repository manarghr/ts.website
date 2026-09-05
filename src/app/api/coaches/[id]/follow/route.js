// Follow / unfollow a coach
// File: src/app/api/coaches/[id]/follow/route.js
//
// The follower is taken from the session cookie. It used to come from `userId` in
// the request body / query string, which meant anyone could make any user follow
// any coach, or read who someone else follows.

import { NextResponse } from 'next/server';
import { checkFollowStatus, toggleFollow } from '../../../../../../backend/utils/db-helpers';
import { requireUser } from '@/backend/utils/session';
import { getUserById } from '@/backend/utils/auth-helpers';
import { notify, NOTIFICATION_TYPES } from '@/backend/utils/notification-helpers';

// Never prerendered: this route depends on the request and the database.
export const dynamic = "force-dynamic";

// POST - follow or unfollow
export async function POST(request, { params }) {
  try {
    const { id } = await params;

    const userId = await requireUser(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'You must be signed in to follow coaches' },
        { status: 401 }
      );
    }

    const { action } = await request.json();

    if (action !== 'follow' && action !== 'unfollow') {
      return NextResponse.json(
        { error: 'Action must be "follow" or "unfollow"' },
        { status: 400 }
      );
    }

    const result = await toggleFollow(userId, id, action);

    // Only on the way in. Being told someone unfollowed you helps nobody.
    if (action === 'follow') {
      const follower = await getUserById(userId);
      await notify({
        recipientId: id,
        recipientRole: 'coach',
        type: NOTIFICATION_TYPES.FOLLOW,
        title: `${follower?.fullName || 'Someone'} started following you`,
        link: `/coaches/${id}`,
      });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      isFollowing: result.isFollowing,
    });
  } catch (error) {
    console.error('POST /api/coaches/[id]/follow:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET - am I following this coach?
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Signed out is a valid answer here, not an error -- the button just renders
    // as "Follow" for visitors.
    const userId = await requireUser(request);
    if (!userId) {
      return NextResponse.json({ isFollowing: false, authenticated: false });
    }

    return NextResponse.json({
      isFollowing: await checkFollowStatus(userId, id),
      authenticated: true,
    });
  } catch (error) {
    console.error('GET /api/coaches/[id]/follow:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
