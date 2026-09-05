// Report a coach
// File: src/app/api/coaches/[id]/report/route.js
//
// The reporter is the session user. From the body, anyone could file reports in
// another user's name -- and reports are what moderation decisions get made on.

import { NextResponse } from 'next/server';
import { requireUser } from '@/backend/utils/session';
import {
  submitReport,
  isValidReportReason,
  REPORT_REASONS,
} from '@/backend/utils/report-helpers';
import { getCoachById } from '@/backend/utils/db-helpers';

// Never prerendered: this route depends on the request and the database.
export const dynamic = "force-dynamic";

const UNAUTHORIZED = NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

// POST /api/coaches/[id]/report   { reason, description }
export async function POST(request, { params }) {
  try {
    const userId = await requireUser(request);
    if (!userId) return UNAUTHORIZED;

    const { id } = await params;
    const { reason, description } = await request.json();

    if (!isValidReportReason(reason)) {
      return NextResponse.json(
        { error: `Reason must be one of: ${REPORT_REASONS.join(', ')}` },
        { status: 400 }
      );
    }

    if (!(await getCoachById(id))) {
      return NextResponse.json({ error: 'Coach not found' }, { status: 404 });
    }

    const result = await submitReport(userId, id, reason, description);

    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully. Our team will review it.',
      reportId: result.reportId,
    });
  } catch (error) {
    if (error.message === 'Already reported') {
      return NextResponse.json(
        { error: 'You already have a report open for this coach' },
        { status: 409 }
      );
    }
    console.error('POST /api/coaches/[id]/report:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
