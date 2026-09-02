// Public API Route - Get Single Training Program
// File: src/app/api/programs/[id]/route.js
//
// This route used to hand back the whole document, so the day-by-day schedule of a
// $99 program was readable by anyone -- buying it granted nothing you could not
// already see. The paid parts are now stripped unless the caller owns the program.

import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { requireUser } from '@/backend/utils/session';
import { hasPurchased } from '@/backend/utils/purchase-helpers';

// What you are actually paying for. Everything else stays public so the page can
// still sell the program: name, description, overview, price, the exercise list.
const PAID_FIELDS = ['schedule', 'coach_recommendation'];

function lockProgram(program) {
  const locked = { ...program };
  for (const field of PAID_FIELDS) delete locked[field];

  // Enough to advertise what is behind the paywall, without giving it away.
  return {
    ...locked,
    lockedDays: Array.isArray(program.schedule) ? program.schedule.length : 0,
  };
}

// GET - Get single training program by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Program ID is required' },
        { status: 400 }
      );
    }

    const programsCollection = await getCollection('training_programs');
    const program = await programsCollection.findOne({ id });

    if (!program) {
      return NextResponse.json(
        { success: false, error: 'Program not found' },
        { status: 404 }
      );
    }

    // Free programs are free: no session lookup, no lock.
    const price = Number(program.price) || 0;
    let owned = price === 0;

    if (!owned) {
      const userId = await requireUser(request);
      owned = userId ? await hasPurchased(userId, 'program', id) : false;
    }

    return NextResponse.json({
      success: true,
      locked: !owned,
      program: owned ? program : lockProgram(program),
    });
  } catch (error) {
    console.error('Error fetching training program:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error.message
      },
      { status: 500 }
    );
  }
}
