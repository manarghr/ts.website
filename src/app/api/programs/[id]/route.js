// Public API Route - Get Single Training Program
// File: src/app/api/programs/[id]/route.js

import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

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
    
    return NextResponse.json({ 
      success: true, 
      program 
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

