// Test Database Connection
// File: src/app/api/test-db/route.js

import { NextResponse } from 'next/server';
import { getDatabase, testConnection } from '@/lib/mongodb';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    // Test connection
    const isConnected = await testConnection();
    
    if (!isConnected) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to connect to MongoDB',
          message: 'Check your connection string and network access'
        },
        { status: 500 }
      );
    }

    const client = await clientPromise;
    
    // List ALL databases
    const adminDb = client.db('admin');
    const databasesList = await adminDb.admin().listDatabases();
    const allDatabases = databasesList.databases.map(db => ({
      name: db.name,
      sizeOnDisk: db.sizeOnDisk
    }));

    // Get current database
    const db = await getDatabase();
    const currentDbName = db.databaseName;
    
    // Ensure current database is in the list (even if empty)
    const currentDbInList = allDatabases.find(db => db.name === currentDbName);
    if (!currentDbInList) {
      allDatabases.push({
        name: currentDbName,
        sizeOnDisk: 0
      });
    }
    
    // List collections in current database with stats
    const collections = await db.listCollections().toArray();
    const collectionsWithStats = await Promise.all(
      collections.map(async (coll) => {
        const collection = db.collection(coll.name);
        const count = await collection.countDocuments();
        const sampleDoc = await collection.findOne({});
        return {
          name: coll.name,
          count: count,
          hasData: count > 0,
          sampleDocument: sampleDoc || null
        };
      })
    );

    // Check all databases for collections
    const allDatabasesWithCollections = await Promise.all(
      allDatabases.map(async (dbInfo) => {
        try {
          const tempDb = client.db(dbInfo.name);
          const colls = await tempDb.listCollections().toArray();
          const collNames = colls.map(c => c.name);
          
          // Get counts for each collection
          const collStats = await Promise.all(
            collNames.map(async (collName) => {
              const coll = tempDb.collection(collName);
              const count = await coll.countDocuments();
              return { name: collName, count };
            })
          );
          
          return {
            database: dbInfo.name,
            collections: collStats,
            totalCollections: collNames.length
          };
        } catch (err) {
          return {
            database: dbInfo.name,
            error: err.message,
            collections: []
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      message: '✅ MongoDB connection successful!',
      connectionInfo: {
        currentDatabase: currentDbName,
        expectedDatabase: process.env.MONGODB_DB || 'trainsight',
        uriConfigured: !!process.env.MONGODB_URI
      },
      currentDatabase: {
        name: currentDbName,
        collections: collectionsWithStats,
        totalCollections: collections.length
      },
      allDatabases: allDatabasesWithCollections,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        details: 'Check your MONGODB_URI in .env.local file'
      },
      { status: 500 }
    );
  }
}

