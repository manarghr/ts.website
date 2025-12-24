// MongoDB Schema Examples for Coaches
// These are reference schemas showing the expected document structure

/**
 * Coach Document Schema
 */
export const coachSchema = {
  id: String, // Unique identifier (e.g., "sami", "younes")
  name: String,
  category: String, // "Strength", "Yoga", "Cardio"
  bio: String,
  image_url: String,
  rating: Number, // 0-5
  total_ratings: Number,
  followers_count: Number,
  following_count: Number,
  created_at: Date,
  updated_at: Date
};

/**
 * Certification Document Schema
 */
export const certificationSchema = {
  coach_id: String, // References coaches.id
  name: String,
  year: String
};

/**
 * Video Document Schema
 */
export const videoSchema = {
  coach_id: String, // References coaches.id
  title: String,
  thumbnail_url: String,
  video_url: String,
  views: Number,
  likes: Number,
  duration: String, // "8:30"
  created_at: Date
};

/**
 * Announcement Document Schema
 */
export const announcementSchema = {
  coach_id: String, // References coaches.id
  title: String,
  content: String,
  date: String, // ISO date string
  created_at: Date
};

/**
 * Rating/Comment Document Schema
 */
export const ratingSchema = {
  coach_id: String, // References coaches.id
  user_id: String, // References users.id
  rating: Number, // 1-5
  comment: String,
  created_at: Date
};

/**
 * Follow Document Schema
 */
export const followSchema = {
  follower_id: String, // References users.id
  following_id: String, // References coaches.id
  created_at: Date
};

/**
 * Message Document Schema
 */
export const messageSchema = {
  sender_id: String, // References users.id
  receiver_id: String, // References coaches.id
  content: String,
  read: Boolean,
  created_at: Date
};

/**
 * Report Document Schema
 */
export const reportSchema = {
  reporter_id: String, // References users.id
  reported_coach_id: String, // References coaches.id
  reason: String,
  description: String,
  status: String, // "pending", "reviewed", "resolved"
  created_at: Date
};

