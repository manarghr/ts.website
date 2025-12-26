// MongoDB Connection Utility
// File: src/lib/mongodb.js

import { MongoClient } from 'mongodb';

// Don't throw error immediately - let it fail gracefully in getCollection
const uri = process.env.MONGODB_URI;

const options = {
  // Add connection options for better reliability
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client;
let clientPromise;

if (!uri) {
  // Create a rejected promise if URI is not set
  clientPromise = Promise.reject(new Error('MongoDB URI is not configured. Please add MONGODB_URI to .env.local'));
} else if (process.env.NODE_ENV === 'development') {
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
  try {
    const db = await getDatabase();
    return db.collection(collectionName);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw new Error('Database connection failed. Please check your MongoDB configuration.');
  }
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

/**
 * List all collections in the current database with document counts
 */
export async function listCollectionsWithStats() {
  try {
    const db = await getDatabase();
    const collections = await db.listCollections().toArray();
    
    const collectionsWithStats = await Promise.all(
      collections.map(async (coll) => {
        const collection = db.collection(coll.name);
        const count = await collection.countDocuments();
        return {
          name: coll.name,
          count: count,
          isEmpty: count === 0
        };
      })
    );
    
    return collectionsWithStats;
  } catch (error) {
    console.error('Error listing collections:', error);
    throw error;
  }
}

/**
 * Get database by name (for debugging)
 */
export async function getDatabaseByName(dbName) {
  const client = await clientPromise;
  return client.db(dbName);
}

