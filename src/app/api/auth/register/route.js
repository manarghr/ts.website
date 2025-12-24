// User Registration API Route
// File: src/app/api/auth/register/route.js

import { NextResponse } from 'next/server';
import { createUser } from '@/backend/utils/auth-helpers';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      password,
      gender,
      age,
      workoutExperience,
      sportsRating,
      selectedPlan,
      profilePicture,
      bio,
    } = body;

    // Validate required fields
    if (!fullName || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'Full name, email, phone, and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Create user
    const user = await createUser({
      fullName,
      email,
      phone,
      password,
      gender,
      age,
      workoutExperience,
      sportsRating,
      selectedPlan,
      profilePicture,
      bio,
    });

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate user error
    if (error.message.includes('already exists')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 } // Conflict
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

