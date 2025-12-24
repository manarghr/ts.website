// MongoDB Connection Utility
// File: backend/utils/mongodb.js
// This is a copy for reference. The actual file used is in src/lib/mongodb.js

import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {
  // Add connection options for better reliability
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

/**
 * Get database instance
 */
export async function getDatabase() {
  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB || 'trainsight';
  return client.db(dbName);
}

/**
 * Get collection helper
 */
export async function getCollection(collectionName) {
  const db = await getDatabase();
  return db.collection(collectionName);
}

/**
 * Test database connection
 */
export async function testConnection() {
  try {
    const client = await clientPromise;
    await client.db('admin').command({ ping: 1 });
    console.log('✅ MongoDB connection successful!');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    return false;
  }
}

