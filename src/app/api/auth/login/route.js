// User Login API Route
// File: src/app/api/auth/login/route.js

import { NextResponse } from 'next/server';

// Try MongoDB first, fallback to localStorage-based auth
let authenticateUser;
let useMongoDB = true;

try {
  const authHelpers = await import('@/backend/utils/auth-helpers');
  authenticateUser = authHelpers.authenticateUser;
} catch (error) {
  console.warn('MongoDB not available, using localStorage fallback');
  useMongoDB = false;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Authenticate user
    let user;
    
    if (useMongoDB && authenticateUser) {
      try {
        user = await authenticateUser(email, password);
      } catch (dbError) {
        // If MongoDB fails, fall back to localStorage approach
        if (dbError.message.includes('Database connection') || dbError.message.includes('MongoDB')) {
          useMongoDB = false;
        } else if (dbError.message.includes('Invalid email or password')) {
          // Re-throw auth errors
          throw dbError;
        } else {
          useMongoDB = false;
        }
      }
    }

    // Fallback: Return error - client will handle localStorage auth
    if (!useMongoDB || !user) {
      return NextResponse.json(
        { 
          error: 'Please use client-side authentication. Database not configured.',
          useLocalStorage: true 
        },
        { status: 200 } // Return 200 but with useLocalStorage flag
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user,
    });
  } catch (error) {
    console.error('Login error:', error);
    
    // Handle authentication errors
    if (error.message.includes('Invalid email or password')) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 } // Unauthorized
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

