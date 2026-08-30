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
  try {
    const ratingsCollection = await getCollection('coach_ratings');
    
    // Try to get ratings with user lookup
    const ratingsWithUsers = await ratingsCollection
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
        {
          $project: {
            _id: 1,
            id: 1,
            user_id: 1, 
            rating: 1,
            comment: 1,
            user_name: 1,
            created_at: 1,
            user: {
              $cond: {
                if: { $gt: [{ $size: '$user' }, 0] },
                then: { $arrayElemAt: ['$user', 0] },
                else: null
              }
            }
          }
        },
        {
          $project: {
            _id: 1,
            id: 1,
            user_id: 1,
            rating: 1,
            comment: 1,
            created_at: 1,
            user_name: {
              $cond: {
                if: '$user',
                then: '$user.fullName',
                else: '$user_name'
              }
            }
          }
        },
        { $sort: { created_at: -1 } },
        { $limit: limit }
      ])
      .toArray();
    
    return ratingsWithUsers;
  } catch (error) {
    console.error('Error fetching coach ratings:', error);
    // Fallback to simple query if aggregation fails
    const ratingsCollection = await getCollection('coach_ratings');
    return await ratingsCollection
      .find({ coach_id: coachId })
      .sort({ created_at: -1 })
      .limit(limit)
      .toArray();
  }
}

/**
 * Add a new rating/review for a coach
 */
export async function addCoachRating(coachId, userId, userName, rating, comment) {
  try {
    const ratingsCollection = await getCollection('coach_ratings');
    const coachesCollection = await getCollection('coaches');
    
    // Check if user already reviewed this coach
    const existingReview = await ratingsCollection.findOne({
      coach_id: coachId,
      user_id: userId
    });
    
    if (existingReview) {
      // Update existing review
      await ratingsCollection.updateOne(
        { coach_id: coachId, user_id: userId },
        {
          $set: {
            rating: parseInt(rating),
            comment: comment.trim(),
            updated_at: new Date(),
          },
        }
      );
    } else {
      // Create new review
      await ratingsCollection.insertOne({
        coach_id: coachId,
        user_id: userId,
        user_name: userName,
        rating: parseInt(rating),
        comment: comment.trim(),
        created_at: new Date(),
      });
    }
    
    // Recalculate average rating
    const allRatings = await ratingsCollection
      .find({ coach_id: coachId })
      .toArray();
    
    const avgRating = 
      allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
    
    // Update coach document with new average
    await coachesCollection.updateOne(
      { id: coachId },
      {
        $set: {
          rating: Math.round(avgRating * 10) / 10,
          total_ratings: allRatings.length,
          updated_at: new Date(),
        },
      }
    );
    
    return {
      success: true,
      newRating: Math.round(avgRating * 10) / 10,
      totalRatings: allRatings.length,
    };
  } catch (error) {
    console.error('Error adding coach rating:', error);
    throw error;
  }
}

/**
 * Delete a rating/review
 */
export async function deleteCoachRating(coachId, userId) {
  try {
    const ratingsCollection = await getCollection('coach_ratings');
    const coachesCollection = await getCollection('coaches');
    
    await ratingsCollection.deleteOne({
      coach_id: coachId,
      user_id: userId,
    });
    
    // Recalculate average rating
    const allRatings = await ratingsCollection
      .find({ coach_id: coachId })
      .toArray();
    
    if (allRatings.length > 0) {
      const avgRating = 
        allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
      
      await coachesCollection.updateOne(
        { id: coachId },
        {
          $set: {
            rating: Math.round(avgRating * 10) / 10,
            total_ratings: allRatings.length,
            updated_at: new Date(),
          },
        }
      );
    } else {
      // No more ratings
      await coachesCollection.updateOne(
        { id: coachId },
        {
          $set: {
            rating: 0,
            total_ratings: 0,
            updated_at: new Date(),
          },
        }
      );
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting coach rating:', error);
    throw error;
  }
}

/**
 * Get a specific user's review for a coach
 */
export async function getUserReviewForCoach(coachId, userId) {
  try {
    const ratingsCollection = await getCollection('coach_ratings');
    
    const review = await ratingsCollection.findOne({
      coach_id: coachId,
      user_id: userId
    });
    
    return review;
  } catch (error) {
    console.error('Error fetching user review:', error);
    return null;
  }
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
/**
 * The coaches this user follows, as coach documents. Two queries for the whole
 * list rather than one per follow row.
 */
export async function listFollowedCoaches(userId) {
  const followsCollection = await getCollection('follows');
  const coachesCollection = await getCollection('coaches');

  const rows = await followsCollection
    .find({ follower_id: userId })
    .sort({ created_at: -1 })
    .limit(200)
    .toArray();

  if (rows.length === 0) return [];

  return coachesCollection
    .find({ id: { : rows.map((row) => row.following_id) } })
    .project({ _id: 0, id: 1, name: 1, image_url: 1, category: 1 })
    .toArray();
}

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