// User Login API Route
// File: src/app/api/auth/login/route.js

import { NextResponse } from 'next/server';
import { authenticateUser } from '@/backend/utils/auth-helpers';

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
    const user = await authenticateUser(email, password);

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

    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

