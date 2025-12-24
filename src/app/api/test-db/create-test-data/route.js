// Create Test Data Route
// File: src/app/api/test-db/create-test-data/route.js
// This route helps create sample collections and data for testing

import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function POST(request) {
  try {
    const body = await request.json();
    const { action = 'create' } = body;

    if (action === 'create') {
      // Create sample coach data
      const coachesCollection = await getCollection('coaches');
      
      const sampleCoach = {
        id: 'coach_001',
        name: 'John Doe',
        category: 'Fitness',
        bio: 'Experienced fitness coach with 10+ years of experience',
        image_url: 'https://example.com/image.jpg',
        rating: 4.5,
        total_ratings: 10,
        followers_count: 0,
        following_count: 0,
        created_at: new Date(),
        updated_at: new Date(),
      };

      // Check if coach already exists
      const existing = await coachesCollection.findOne({ id: sampleCoach.id });
      if (existing) {
        return NextResponse.json({
          success: true,
          message: 'Test data already exists',
          coach: existing
        });
      }

      const result = await coachesCollection.insertOne(sampleCoach);

      return NextResponse.json({
        success: true,
        message: '✅ Test data created successfully!',
        insertedId: result.insertedId,
        coach: sampleCoach,
        instructions: {
          nextStep: 'Now test GET /api/coaches to see your data',
          testUrl: '/api/coaches'
        }
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('Error creating test data:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: 'Make sure MongoDB connection is working'
      },
      { status: 500 }
    );
  }
}

// GET method to show instructions
export async function GET() {
  return NextResponse.json({
    message: 'Create Test Data Endpoint',
    instructions: {
      method: 'POST',
      url: '/api/test-db/create-test-data',
      body: {
        action: 'create'
      },
      example: {
        curl: 'curl -X POST http://localhost:3000/api/test-db/create-test-data -H "Content-Type: application/json" -d \'{"action":"create"}\'',
        postman: 'POST request to /api/test-db/create-test-data with body: {"action":"create"}'
      }
    }
  });
}

