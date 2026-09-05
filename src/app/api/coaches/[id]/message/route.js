// Send a message to a coach
// File: src/app/api/coaches/[id]/message/route.js
//
// The sender is the session user. Taking it from the body would let anyone send a
// coach a message that lands in their inbox under someone else's name.

import { NextResponse } from 'next/server';
import { requireUser } from '@/backend/utils/session';
import { sendMessage, MAX_MESSAGE_LENGTH } from '@/backend/utils/message-helpers';
import { getCoachById } from '@/backend/utils/db-helpers';
import { getUserById } from '@/backend/utils/auth-helpers';
import { notify, NOTIFICATION_TYPES } from '@/backend/utils/notification-helpers';

// Never prerendered: this route depends on the request and the database.
export const dynamic = "force-dynamic";

const UNAUTHORIZED = NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

// POST /api/coaches/[id]/message   { content }
export async function POST(request, { params }) {
  try {
    const userId = await requireUser(request);
    if (!userId) return UNAUTHORIZED;

    const { id } = await params;
    const { content } = await request.json();

    const trimmed = String(content || '').trim();
    if (!trimmed) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }
    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer` },
        { status: 400 }
      );
    }

    // Without this a typo'd id writes a message addressed to nobody.
    if (!(await getCoachById(id))) {
      return NextResponse.json({ error: 'Coach not found' }, { status: 404 });
    }

    const result = await sendMessage(userId, id, trimmed);

    const sender = await getUserById(userId);
    await notify({
      recipientId: id,
      recipientRole: 'coach',
      type: NOTIFICATION_TYPES.MESSAGE,
      title: `New message from ${sender?.fullName || 'a member'}`,
      body: trimmed.slice(0, 140),
      link: '/coach/dashboard',
    });

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      messageId: result.messageId,
    });
  } catch (error) {
    console.error('POST /api/coaches/[id]/message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
