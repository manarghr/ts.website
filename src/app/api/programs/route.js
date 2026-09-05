// Public API Route - Get Training Programs
// File: src/app/api/programs/route.js

import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

// Never prerendered: this route depends on the request and the database.
export const dynamic = "force-dynamic";

// GET - Get all training programs (public access)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const goal = searchParams.get('goal'); // Filter by goal: weight_loss, bulking, muscle_building, endurance
    
    const programsCollection = await getCollection('training_programs');
    
    let query = {};
    if (goal) {
      query.goal = goal;
    }
    
    // The cards never render the schedule, and sending it here would hand out
    // every paid program's contents in one request.
    const programs = await programsCollection
      .find(query)
      .project({ schedule: 0, coach_recommendation: 0 })
      .sort({ created_at: -1 })
      .toArray();
    
    return NextResponse.json({ 
      success: true, 
      programs,
      count: programs.length 
    });
  } catch (error) {
    console.error('Error fetching training programs:', error);
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

