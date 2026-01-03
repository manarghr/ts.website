// Admin API Route - Meals CRUD
// File: src/app/api/admin/meals/route.js

import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

// GET - Get all meals
export async function GET(request) {
  try {
    const mealsCollection = await getCollection('meals');
    const meals = await mealsCollection.find({}).sort({ created_at: -1 }).toArray();
    return NextResponse.json({ success: true, meals });
  } catch (error) {
    console.error('Error fetching meals:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new meal
export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      name, 
      mealType, 
      goal, 
      description, 
      servings, 
      difficulty, 
      prepTime,
      image,
      calories,
      protein,
      carbs,
      fats,
      fiber,
      sugar,
      sodium,
      detailedIngredients,
      steps,
      tips,
      equipment,
      ingredients
    } = body;

    if (!name || !mealType) {
      return NextResponse.json(
        { error: 'Name and meal type are required' },
        { status: 400 }
      );
    }

    const mealsCollection = await getCollection('meals');
    const newMeal = {
      id: `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      mealType,
      goal: goal || 'all',
      description: description || '',
      servings: parseInt(servings) || 1,
      difficulty: difficulty || 'Easy',
      prepTime: `${parseInt(prepTime)} min`,
      image: image || '',
      // Nutrition details
      calories: parseInt(calories) || 0,
      protein: parseInt(protein) || 0,
      carbs: parseInt(carbs) || 0,
      fats: parseInt(fats) || 0,
      fiber: parseInt(fiber) || 0,
      nutritionDetails: {
        calories: parseInt(calories) || 0,
        protein: parseInt(protein) || 0,
        carbs: parseInt(carbs) || 0,
        fats: parseInt(fats) || 0,
        fiber: parseInt(fiber) || 0,
        sugar: parseInt(sugar) || 0,
        sodium: parseInt(sodium) || 0
      },
      // Recipe details
      detailedIngredients: detailedIngredients || [],
      steps: steps || [],
      tips: tips || [],
      equipment: equipment || [],
      ingredients: ingredients || [],
      created_at: new Date(),
      updated_at: new Date(),
    };

    await mealsCollection.insertOne(newMeal);
    return NextResponse.json({ success: true, meal: newMeal });
  } catch (error) {
    console.error('Error creating meal:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update meal
export async function PUT(request) {
  try {
    const body = await request.json();
    const { 
      id,
      name, 
      mealType, 
      goal, 
      description, 
      servings, 
      difficulty, 
      prepTime,
      image,
      calories,
      protein,
      carbs,
      fats,
      fiber,
      sugar,
      sodium,
      detailedIngredients,
      steps,
      tips,
      equipment,
      ingredients
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Meal ID is required' },
        { status: 400 }
      );
    }

    const mealsCollection = await getCollection('meals');
    const updateData = {
      updated_at: new Date(),
    };

    if (name) updateData.name = name;
    if (mealType) updateData.mealType = mealType;
    if (goal !== undefined) updateData.goal = goal;
    if (description !== undefined) updateData.description = description;
    if (servings !== undefined) updateData.servings = parseInt(servings);
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (prepTime !== undefined) updateData.prepTime = `${parseInt(prepTime)} min`;
    if (image !== undefined) updateData.image = image;
    
    // Update nutrition
    if (calories !== undefined) updateData.calories = parseInt(calories);
    if (protein !== undefined) updateData.protein = parseInt(protein);
    if (carbs !== undefined) updateData.carbs = parseInt(carbs);
    if (fats !== undefined) updateData.fats = parseInt(fats);
    if (fiber !== undefined) updateData.fiber = parseInt(fiber);
    
    // Update nutrition details object
    updateData.nutritionDetails = {
      calories: parseInt(calories) || 0,
      protein: parseInt(protein) || 0,
      carbs: parseInt(carbs) || 0,
      fats: parseInt(fats) || 0,
      fiber: parseInt(fiber) || 0,
      sugar: parseInt(sugar) || 0,
      sodium: parseInt(sodium) || 0
    };
    
    // Update recipe details
    if (detailedIngredients !== undefined) updateData.detailedIngredients = detailedIngredients;
    if (steps !== undefined) updateData.steps = steps;
    if (tips !== undefined) updateData.tips = tips;
    if (equipment !== undefined) updateData.equipment = equipment;
    if (ingredients !== undefined) updateData.ingredients = ingredients;

    const result = await mealsCollection.updateOne(
      { id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Meal not found' },
        { status: 404 }
      );
    }

    const updatedMeal = await mealsCollection.findOne({ id });
    return NextResponse.json({ success: true, meal: updatedMeal });
  } catch (error) {
    console.error('Error updating meal:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete meal
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Meal ID is required' },
        { status: 400 }
      );
    }

    const mealsCollection = await getCollection('meals');
    
    // Delete by string ID (not parseInt)
    const result = await mealsCollection.deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Meal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Meal deleted successfully' });
  } catch (error) {
    console.error('Error deleting meal:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}