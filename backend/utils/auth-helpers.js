// Authentication Helper Functions
// File: backend/utils/auth-helpers.js

import { getCollection } from '@/lib/mongodb';

// Dynamic import for bcrypt (native module, must be loaded at runtime)
async function getBcrypt() {
  const bcrypt = await import('bcrypt');
  return bcrypt.default || bcrypt;
}

/**
 * Create a new user
 */
export async function createUser(userData) {
  const usersCollection = await getCollection('users');
  
  // Check if user already exists
  const existingUser = await usersCollection.findOne({ 
    $or: [
      { email: userData.email },
      { phone: userData.phone }
    ]
  });

  if (existingUser) {
    throw new Error('User with this email or phone already exists');
  }

  // Hash password
  const bcrypt = await getBcrypt();
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const newUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    fullName: userData.fullName,
    email: userData.email,
    phone: userData.phone,
    password: hashedPassword, // Store hashed password
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
    createdAt: new Date(),
    lastLogin: new Date(),
    updated_at: new Date(),
  };

  await usersCollection.insertOne(newUser);
  
  // Return user without password
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

/**
 * Authenticate user (login)
 */
export async function authenticateUser(email, password) {
  const usersCollection = await getCollection('users');
  
  // Find user by email
  const user = await usersCollection.findOne({ email });
  
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Update last login
  await usersCollection.updateOne(
    { _id: user._id },
    { $set: { lastLogin: new Date() } }
  );

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Get user by ID
 */
export async function getUserById(userId) {
  const usersCollection = await getCollection('users');
  const user = await usersCollection.findOne({ id: userId });
  
  if (!user) {
    return null;
  }

  // Return user without password
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Get user by email
 */
export async function getUserByEmail(email) {
  const usersCollection = await getCollection('users');
  const user = await usersCollection.findOne({ email });
  
  if (!user) {
    return null;
  }

  // Return user without password
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Update user profile
 */
export async function updateUser(userId, updateData) {
  const usersCollection = await getCollection('users');
  
  // If password is being updated, hash it
  if (updateData.password) {
    const bcrypt = await getBcrypt();
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }

  updateData.updated_at = new Date();

  const result = await usersCollection.updateOne(
    { id: userId },
    { $set: updateData }
  );

  if (result.matchedCount === 0) {
    throw new Error('User not found');
  }

  return await getUserById(userId);
}

