// Admin API Route - Nutrition Plans CRUD
// File: src/app/api/admin/nutrition/route.js

import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { requireAdmin } from "@/backend/utils/session";

// GET - Get all nutrition plans
export async function GET(request) {
  // Admin-only. Without this, anyone who knew the URL could call it.
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const nutritionCollection = await getCollection('nutrition_plans');
    const plans = await nutritionCollection.find({}).sort({ created_at: -1 }).toArray();
    return NextResponse.json({ success: true, plans });
  } catch (error) {
    console.error('Error fetching nutrition plans:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new nutrition plan
export async function POST(request) {
  // Admin-only. Without this, anyone who knew the URL could call it.
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, description, duration, meals, price, discount, discount_percentage } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    const nutritionCollection = await getCollection('nutrition_plans');
    const newPlan = {
      id: `nutrition_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      duration: duration || '',
      meals: meals || [],
      price: price || 0,
      discount: discount || false,
      discount_percentage: discount_percentage || 0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    await nutritionCollection.insertOne(newPlan);
    return NextResponse.json({ success: true, plan: newPlan });
  } catch (error) {
    console.error('Error creating nutrition plan:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update nutrition plan
export async function PUT(request) {
  // Admin-only. Without this, anyone who knew the URL could call it.
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, description, duration, meals, price, discount, discount_percentage } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    const nutritionCollection = await getCollection('nutrition_plans');
    const updateData = {
      updated_at: new Date(),
    };

    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (duration !== undefined) updateData.duration = duration;
    if (meals !== undefined) updateData.meals = meals;
    if (price !== undefined) updateData.price = price;
    if (discount !== undefined) updateData.discount = discount;
    if (discount_percentage !== undefined) updateData.discount_percentage = discount_percentage;

    const result = await nutritionCollection.updateOne(
      { id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Nutrition plan not found' },
        { status: 404 }
      );
    }

    const updatedPlan = await nutritionCollection.findOne({ id });
    return NextResponse.json({ success: true, plan: updatedPlan });
  } catch (error) {
    console.error('Error updating nutrition plan:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete nutrition plan
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
        { error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    const nutritionCollection = await getCollection('nutrition_plans');
    const result = await nutritionCollection.deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Nutrition plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Nutrition plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting nutrition plan:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

