// Admin API Route - Training Programs CRUD
// File: src/app/api/admin/programs/route.js

import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { requireAdmin } from "@/backend/utils/session";

// GET - Get all training programs
export async function GET(request) {
  // Admin-only. Without this, anyone who knew the URL could call it.
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const programsCollection = await getCollection('training_programs');
    const programs = await programsCollection.find({}).sort({ created_at: -1 }).toArray();
    return NextResponse.json({ success: true, programs });
  } catch (error) {
    console.error('Error fetching training programs:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new training program
export async function POST(request) {
  // Admin-only. Without this, anyone who knew the URL could call it.
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, description, duration, schedule, exercises, price, discount, discount_percentage } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    const programsCollection = await getCollection('training_programs');
    const newProgram = {
      id: `program_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      duration: duration || '',
      schedule: schedule || [],
      exercises: exercises || [],
      price: price || 0,
      discount: discount || false,
      discount_percentage: discount_percentage || 0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    await programsCollection.insertOne(newProgram);
    return NextResponse.json({ success: true, program: newProgram });
  } catch (error) {
    console.error('Error creating training program:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update training program
export async function PUT(request) {
  // Admin-only. Without this, anyone who knew the URL could call it.
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, description, duration, schedule, exercises, price, discount, discount_percentage } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Program ID is required' },
        { status: 400 }
      );
    }

    const programsCollection = await getCollection('training_programs');
    const updateData = {
      updated_at: new Date(),
    };

    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (duration !== undefined) updateData.duration = duration;
    if (schedule !== undefined) updateData.schedule = schedule;
    if (exercises !== undefined) updateData.exercises = exercises;
    if (price !== undefined) updateData.price = price;
    if (discount !== undefined) updateData.discount = discount;
    if (discount_percentage !== undefined) updateData.discount_percentage = discount_percentage;

    const result = await programsCollection.updateOne(
      { id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Training program not found' },
        { status: 404 }
      );
    }

    const updatedProgram = await programsCollection.findOne({ id });
    return NextResponse.json({ success: true, program: updatedProgram });
  } catch (error) {
    console.error('Error updating training program:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete training program
export async function DELETE(request) {
  // Admin-only. Without this, anyone who knew the URL could call it.
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Program ID is required' },
        { status: 400 }
      );
    }

    const programsCollection = await getCollection('training_programs');
    const result = await programsCollection.deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Training program not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Training program deleted successfully' });
  } catch (error) {
    console.error('Error deleting training program:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

