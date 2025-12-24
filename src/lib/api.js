// API Client Utility
// File: src/lib/api.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Get current user ID from localStorage or session
 */
function getCurrentUserId() {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('trainsight_current_user');
    if (user) {
      return JSON.parse(user).id;
    }
  }
  return null;
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Coach API functions
 */
export const coachAPI = {
  /**
   * Get coach profile by ID
   */
  getCoach: async (coachId) => {
    return fetchAPI(`/coaches/${coachId}`);
  },

  /**
   * Get all coaches with optional filters
   */
  getCoaches: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.rating) queryParams.append('minRating', filters.rating);
    if (filters.search) queryParams.append('search', filters.search);

    const query = queryParams.toString();
    return fetchAPI(`/coaches${query ? `?${query}` : ''}`);
  },

  /**
   * Get coach videos
   */
  getCoachVideos: async (coachId) => {
    return fetchAPI(`/coaches/${coachId}/videos`);
  },

  /**
   * Get coach announcements
   */
  getCoachAnnouncements: async (coachId) => {
    return fetchAPI(`/coaches/${coachId}/announcements`);
  },

  /**
   * Get coach ratings/comments
   */
  getCoachRatings: async (coachId) => {
    return fetchAPI(`/coaches/${coachId}/ratings`);
  },

  /**
   * Check if current user is following a coach
   */
  checkFollowStatus: async (coachId) => {
    const userId = getCurrentUserId();
    if (!userId) return { isFollowing: false };

    return fetchAPI(`/coaches/${coachId}/follow?userId=${userId}`);
  },

  /**
   * Follow or unfollow a coach
   */
  toggleFollow: async (coachId, action) => {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error('User must be logged in to follow coaches');
    }

    return fetchAPI(`/coaches/${coachId}/follow`, {
      method: 'POST',
      body: JSON.stringify({ userId, action }),
    });
  },

  /**
   * Send message to coach
   */
  sendMessage: async (coachId, content) => {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error('User must be logged in to send messages');
    }

    return fetchAPI(`/coaches/${coachId}/message`, {
      method: 'POST',
      body: JSON.stringify({ userId, content }),
    });
  },

  /**
   * Report a coach
   */
  reportCoach: async (coachId, reason, description = '') => {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error('User must be logged in to report coaches');
    }

    return fetchAPI(`/coaches/${coachId}/report`, {
      method: 'POST',
      body: JSON.stringify({ userId, reason, description }),
    });
  },
};

