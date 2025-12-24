// Show All Data Route
// File: src/app/api/test-db/show-all-data/route.js
// This route shows ALL data from ALL collections to help debug

import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDatabase();
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // If no collections, return helpful message
    if (collectionNames.length === 0) {
      return NextResponse.json({
        success: true,
        message: '⚠️ No collections found in database',
        database: db.databaseName,
        collections: [],
        instructions: {
          step1: 'Create a collection by inserting data',
          step2: 'POST to /api/coaches with: { "id": "coach_001", "name": "Test", "category": "Fitness" }',
          step3: 'Or POST to /api/test-db/create-test-data'
        }
      });
    }
    
    // Get all data from each collection
    const allData = {};
    
    for (const collName of collectionNames) {
      const collection = db.collection(collName);
      const count = await collection.countDocuments();
      const documents = await collection.find({}).limit(100).toArray(); // Limit to 100 per collection
      
      allData[collName] = {
        count: count,
        documents: documents,
        isEmpty: count === 0
      };
    }
    
    return NextResponse.json({
      success: true,
      message: '✅ All data retrieved',
      database: db.databaseName,
      totalCollections: collectionNames.length,
      collections: collectionNames,
      data: allData,
      summary: Object.keys(allData).map(collName => ({
        collection: collName,
        documentCount: allData[collName].count,
        hasData: !allData[collName].isEmpty
      }))
    });
  } catch (error) {
    console.error('Error showing all data:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

