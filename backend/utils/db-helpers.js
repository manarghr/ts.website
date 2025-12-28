// Database Helper Functions
// File: backend/utils/db-helpers.js
// Note: These functions import from src/lib/mongodb.js (the actual connection file)

import { getCollection } from '@/lib/mongodb';

/**
 * Get coach by ID
 */
export async function getCoachById(coachId) {
  const coachesCollection = await getCollection('coaches');
  return await coachesCollection.findOne({ id: coachId });
}

/**
 * Create a new coach
 */
export async function createCoach(coachData) {
  const coachesCollection = await getCollection('coaches');

  const doc = {
    id: coachData.id,
    name: coachData.name,
    category: coachData.category,
    bio: coachData.bio || '',
    image_url: coachData.image_url || '',
    rating: coachData.rating || 0,
    total_ratings: coachData.total_ratings || 0,
    followers_count: coachData.followers_count || 0,
    following_count: coachData.following_count || 0,
    created_at: new Date(),
    updated_at: new Date(),
  };

  await coachesCollection.insertOne(doc);
  return doc;
}

/**
 * Get all coaches with optional filters
 */
export async function getCoaches(filters = {}) {
  try {
    console.log('=== DB-HELPER: getCoaches called ===');
    console.log('Filters:', filters);
    
    const coachesCollection = await getCollection('coaches');
    console.log('Collection obtained');
    
    const query = {};
    
    if (filters.category) {
      query.category = filters.category;
    }
    
    if (filters.minRating) {
      query.rating = { $gte: parseFloat(filters.minRating) };
    }
    
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { bio: { $regex: filters.search, $options: 'i' } }
      ];
    }
    
    console.log('Query:', JSON.stringify(query));
    
    const coaches = await coachesCollection.find(query).toArray();
    console.log('Coaches found:', coaches.length);
    console.log('First coach sample:', coaches[0]);
    
    return coaches;
  } catch (error) {
    console.error('=== DB-HELPER: Error in getCoaches ===');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    throw error;
  }
}

/**
 * Get coach certifications
 */
export async function getCoachCertifications(coachId) {
  const certificationsCollection = await getCollection('certifications');
  return await certificationsCollection
    .find({ coach_id: coachId })
    .sort({ year: -1 })
    .toArray();
}

/**
 * Get coach videos
 */
export async function getCoachVideos(coachId, limit = 50) {
  const videosCollection = await getCollection('videos');
  return await videosCollection
    .find({ coach_id: coachId })
    .sort({ created_at: -1 })
    .limit(limit)
    .toArray();
}

/**
 * Get coach announcements
 */
export async function getCoachAnnouncements(coachId) {
  const announcementsCollection = await getCollection('announcements');
  return await announcementsCollection
    .find({ 
      coach_id: coachId,
      date: { $gte: new Date().toISOString().split('T')[0] }
    })
    .sort({ date: 1 })
    .limit(10)
    .toArray();
}

/**
 * Get coach ratings/comments
 */
export async function getCoachRatings(coachId, limit = 20) {
  const ratingsCollection = await getCollection('coach_ratings');
  return await ratingsCollection
    .aggregate([
      { $match: { coach_id: coachId } },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: 'id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          id: 1,
          rating: 1,
          comment: 1,
          created_at: 1,
          user: {
            name: '$user.fullName',
            id: '$user.id'
          }
        }
      },
      { $sort: { created_at: -1 } },
      { $limit: limit }
    ])
    .toArray();
}

/**
 * Check if user is following coach
 */
export async function checkFollowStatus(userId, coachId) {
  const followsCollection = await getCollection('follows');
  const follow = await followsCollection.findOne({
    follower_id: userId,
    following_id: coachId
  });
  return !!follow;
}

/**
 * Toggle follow status
 */
export async function toggleFollow(userId, coachId, action) {
  const followsCollection = await getCollection('follows');
  const coachesCollection = await getCollection('coaches');
  
  if (action === 'follow') {
    // Check if already following
    const existing = await followsCollection.findOne({
      follower_id: userId,
      following_id: coachId
    });
    
    if (existing) {
      return { isFollowing: true, message: 'Already following' };
    }
    
    // Insert follow
    await followsCollection.insertOne({
      follower_id: userId,
      following_id: coachId,
      created_at: new Date()
    });
    
    // Update count
    await coachesCollection.updateOne(
      { id: coachId },
      { $inc: { followers_count: 1 } }
    );
    
    return { isFollowing: true, message: 'Successfully followed' };
  } else {
    // Unfollow
    const result = await followsCollection.deleteOne({
      follower_id: userId,
      following_id: coachId
    });
    
    if (result.deletedCount > 0) {
      await coachesCollection.updateOne(
        { id: coachId },
        { $inc: { followers_count: -1 } }
      );
    }
    
    return { isFollowing: false, message: 'Successfully unfollowed' };
  }
}

