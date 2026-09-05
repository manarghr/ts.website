// Admin API Route - Get all users
// File: src/app/api/admin/users/route.js

import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { requireAdmin } from "@/backend/utils/session";

// Never prerendered: this route depends on the request and the database.
export const dynamic = "force-dynamic";

export async function GET(request) {
  // Admin-only. Without this, anyone who knew the URL could call it.
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const usersCollection = await getCollection('users');
    const users = await usersCollection.find({}).toArray();
    
    // Remove passwords from response
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    
    return NextResponse.json({ success: true, users: usersWithoutPasswords });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

