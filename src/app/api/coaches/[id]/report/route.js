// Report Coach API Route with MongoDB
// File: src/app/api/coaches/[id]/report/route.js

import { NextResponse } from 'next/server';
import { submitReport } from '@/backend/utils/report-helpers';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId, reason, description } = body;

    // Validate inputs
    if (!userId || !reason) {
      return NextResponse.json(
        { error: 'User ID and reason are required' },
        { status: 400 }
      );
    }

    // Use helper function
    const result = await submitReport(userId, id, reason, description);

    // Optionally: Notify admins
    // You can integrate with admin notification system here

    return NextResponse.json({ 
      success: true, 
      message: 'Report submitted successfully. Our team will review it.',
      reportId: result.reportId
    });
  } catch (error) {
    console.error('Error submitting report:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

