// Send Message to Coach API Route with MongoDB
// File: src/app/api/coaches/[id]/message/route.js

import { NextResponse } from 'next/server';
import { sendMessage } from '@/backend/utils/message-helpers';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId, content } = body;

    // Validate inputs
    if (!userId || !content || !content.trim()) {
      return NextResponse.json(
        { error: 'User ID and message content are required' },
        { status: 400 }
      );
    }

    // Use helper function
    const result = await sendMessage(userId, id, content);

    // Optionally: Send notification to coach
    // You can integrate with email service or push notifications here

    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully',
      messageId: result.messageId
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

