// LocalStorage-based Authentication (Fallback when MongoDB is not available)
// File: backend/utils/localStorage-auth.js

import bcrypt from 'bcryptjs';

// Note: This is a fallback for development/demo purposes
// In production, always use MongoDB

/**
 * Get users from localStorage (server-side simulation)
 * Since we can't access localStorage on server, we'll use a file-based approach
 * or make the API routes handle localStorage on client-side
 */
function getUsersFromStorage() {
  // This will be handled client-side in the API route
  return [];
}

/**
 * Create a new user (localStorage fallback)
 */
export async function createUserLocal(userData) {
  // Generate user ID
  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const newUser = {
    id: userId,
    fullName: userData.fullName,
    email: userData.email,
    phone: userData.phone,
    password: hashedPassword,
    gender: userData.gender || '',
    age: userData.age || null,
    workoutExperience: userData.workoutExperience || '',
    sportsRating: userData.sportsRating || '',
    selectedPlan: userData.selectedPlan || '',
    profilePicture: userData.profilePicture || '',
    bio: userData.bio || '',
    followers: [],
    followings: [],
    favoriteCoaches: [],
    likedVideos: [],
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Return user without password
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

/**
 * Authenticate user (localStorage fallback)
 */
export async function authenticateUserLocal(email, password, users) {
  // Find user by email
  const user = users.find(u => u.email === email);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

