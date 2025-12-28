// Backend Health Check API
// File: src/app/api/health/route.js

import { NextResponse } from 'next/server';
import { testConnection, getDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {}
    };

    // Test MongoDB connection
    try {
      const isConnected = await testConnection();
      health.services.mongodb = {
        status: isConnected ? 'connected' : 'disconnected',
        message: isConnected ? 'MongoDB connection successful' : 'MongoDB connection failed'
      };

      if (isConnected) {
        const db = await getDatabase();
        const dbName = db.databaseName;
        const collections = await db.listCollections().toArray();
        
        health.services.mongodb.database = dbName;
        health.services.mongodb.collections = collections.map(c => c.name);
        health.services.mongodb.collectionCount = collections.length;
      }
    } catch (error) {
      health.services.mongodb = {
        status: 'error',
        message: error.message,
        error: error.message.includes('timed out') 
          ? 'Connection timeout - check if MongoDB is running'
          : error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')
          ? 'Cannot reach MongoDB server - check MONGODB_URI'
          : 'Unknown error'
      };
    }

    // Check environment variables
    health.config = {
      mongodbUri: !!process.env.MONGODB_URI ? 'configured' : 'missing',
      mongodbDb: process.env.MONGODB_DB || 'trainsight (default)',
      nodeEnv: process.env.NODE_ENV || 'development'
    };

    const allServicesOk = health.services.mongodb?.status === 'connected';
    const statusCode = allServicesOk ? 200 : 503;

    return NextResponse.json(health, { status: statusCode });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

