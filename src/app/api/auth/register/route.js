// User Registration API Route
// File: src/app/api/auth/register/route.js

import { NextResponse } from 'next/server';

// Try MongoDB first, fallback to localStorage-based auth
let createUser;
let useMongoDB = true;

try {
  const authHelpers = await import('@/backend/utils/auth-helpers');
  createUser = authHelpers.createUser;
} catch (error) {
  console.warn('MongoDB not available, using localStorage fallback');
  useMongoDB = false;
}

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
    let user;
    
    if (useMongoDB && createUser) {
      try {
        user = await createUser({
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
      } catch (dbError) {
        // If MongoDB fails, fall back to localStorage approach
        if (dbError.message.includes('Database connection') || dbError.message.includes('MongoDB')) {
          useMongoDB = false;
        } else {
          throw dbError;
        }
      }
    }

    // Fallback: Create user data (client will handle localStorage)
    if (!useMongoDB || !user) {
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      user = {
        id: userId,
        fullName,
        email,
        phone,
        gender: gender || '',
        age: age || null,
        workoutExperience: workoutExperience || '',
        sportsRating: sportsRating || '',
        selectedPlan: selectedPlan || '',
        profilePicture: profilePicture || '',
        bio: bio || '',
        followers: [],
        followings: [],
        favoriteCoaches: [],
        likedVideos: [],
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

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

    // Handle database connection errors
    if (error.message.includes('Database connection failed') || error.message.includes('MongoDB')) {
      return NextResponse.json(
        { error: 'Database connection error. Please check server configuration.', details: error.message },
        { status: 503 } // Service Unavailable
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

