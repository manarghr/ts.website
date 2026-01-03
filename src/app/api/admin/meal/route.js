import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// GET - Fetch all meals
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('trainsight');
    const meals = await db.collection('meals').find({}).toArray();
    
    return NextResponse.json({ success: true, meals });
  } catch (error) {
    console.error('Error fetching meals:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch meals' },
      { status: 500 }
    );
  }
}

// POST - Create new meal
export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db('trainsight');
    const body = await request.json();
    
    // Generate ID if not provided
    const id = body.id || Date.now();
    
    const mealData = {
      id,
      name: body.name,
      mealType: body.mealType,
      goal: body.goal,
      description: body.description || "",
      servings: parseInt(body.servings) || 1,
      difficulty: body.difficulty,
      prepTime: `${parseInt(body.prepTime)} min`,
      image: body.image,
      // Nutrition details
      calories: parseInt(body.calories) || 0,
      protein: parseInt(body.protein) || 0,
      carbs: parseInt(body.carbs) || 0,
      fats: parseInt(body.fats) || 0,
      fiber: parseInt(body.fiber) || 0,
      nutritionDetails: {
        calories: parseInt(body.calories) || 0,
        protein: parseInt(body.protein) || 0,
        carbs: parseInt(body.carbs) || 0,
        fats: parseInt(body.fats) || 0,
        fiber: parseInt(body.fiber) || 0,
        sugar: parseInt(body.sugar) || 0,
        sodium: parseInt(body.sodium) || 0
      },
      // Recipe details
      detailedIngredients: body.detailedIngredients || [],
      steps: body.steps || [],
      tips: body.tips || [],
      equipment: body.equipment || [],
      ingredients: body.ingredients || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('meals').insertOne(mealData);
    
    return NextResponse.json({ 
      success: true, 
      meal: { ...mealData, _id: result.insertedId }
    });
  } catch (error) {
    console.error('Error creating meal:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create meal' },
      { status: 500 }
    );
  }
}

// PUT - Update meal
export async function PUT(request) {
  try {
    const client = await clientPromise;
    const db = client.db('trainsight');
    const body = await request.json();
    
    const mealData = {
      name: body.name,
      mealType: body.mealType,
      goal: body.goal,
      description: body.description || "",
      servings: parseInt(body.servings) || 1,
      difficulty: body.difficulty,
      prepTime: `${parseInt(body.prepTime)} min`,
      image: body.image,
      // Nutrition details
      calories: parseInt(body.calories) || 0,
      protein: parseInt(body.protein) || 0,
      carbs: parseInt(body.carbs) || 0,
      fats: parseInt(body.fats) || 0,
      fiber: parseInt(body.fiber) || 0,
      nutritionDetails: {
        calories: parseInt(body.calories) || 0,
        protein: parseInt(body.protein) || 0,
        carbs: parseInt(body.carbs) || 0,
        fats: parseInt(body.fats) || 0,
        fiber: parseInt(body.fiber) || 0,
        sugar: parseInt(body.sugar) || 0,
        sodium: parseInt(body.sodium) || 0
      },
      // Recipe details
      detailedIngredients: body.detailedIngredients || [],
      steps: body.steps || [],
      tips: body.tips || [],
      equipment: body.equipment || [],
      ingredients: body.ingredients || [],
      updatedAt: new Date()
    };
    
    const result = await db.collection('meals').updateOne(
      { id: body.id },
      { $set: mealData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Meal not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, meal: { id: body.id, ...mealData } });
  } catch (error) {
    console.error('Error updating meal:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update meal' },
      { status: 500 }
    );
  }
}

// DELETE - Delete meal
export async function DELETE(request) {
  try {
    const client = await clientPromise;
    const db = client.db('trainsight');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Meal ID is required' },
        { status: 400 }
      );
    }
    
    const result = await db.collection('meals').deleteOne({ id: parseInt(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Meal not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting meal:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete meal' },
      { status: 500 }
    );
  }
}