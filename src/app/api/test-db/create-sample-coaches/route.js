// Create Sample Coaches Route
// File: src/app/api/test-db/create-sample-coaches/route.js
// This route creates multiple sample coaches for testing

import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { requireAdmin } from '@/backend/utils/session';

// Never prerendered: this route depends on the request and the database.
export const dynamic = "force-dynamic";

const generateSampleCoaches = () => {
  const coaches = [];

  // Strength & Bodybuilding Coaches
  coaches.push({
    id: `coach_${Date.now()}_strength_1`,
    name: "Marcus Johnson",
    category: "Strength",
    bio: "Professional strength coach with 15+ years of experience. Former powerlifting champion and certified strength and conditioning specialist. Specializes in powerlifting, bodybuilding, and functional strength training. Has trained over 500 athletes and helped countless individuals achieve their strength goals.",
    image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    rating: 4.9,
    total_ratings: 127,
    followers_count: 5420,
    following_count: 234,
    created_at: new Date(),
    updated_at: new Date()
  });

  coaches.push({
    id: `coach_${Date.now()}_strength_2`,
    name: "Sarah Martinez",
    category: "Strength",
    bio: "Elite strength coach specializing in women's strength training and bodybuilding. IFBB Pro with expertise in muscle building, fat loss, and competition prep. Known for her science-based approach and personalized training programs. 10+ years of coaching experience.",
    image_url: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=400&fit=crop",
    rating: 4.8,
    total_ratings: 89,
    followers_count: 3890,
    following_count: 156,
    created_at: new Date(),
    updated_at: new Date()
  });

  // Cardio & Endurance Coaches
  coaches.push({
    id: `coach_${Date.now()}_cardio_1`,
    name: "David Chen",
    category: "Cardio",
    bio: "Marathon runner and endurance coach with 20+ years of experience. Has completed 50+ marathons and multiple ultra-marathons. Specializes in marathon training, 5K/10K programs, and cardiovascular conditioning. Certified running coach helping runners of all levels achieve their goals.",
    image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    rating: 4.7,
    total_ratings: 203,
    followers_count: 6780,
    following_count: 189,
    created_at: new Date(),
    updated_at: new Date()
  });

  coaches.push({
    id: `coach_${Date.now()}_cardio_2`,
    name: "Emily Rodriguez",
    category: "Cardio",
    bio: "HIIT and functional fitness specialist. Former competitive athlete turned coach, specializing in high-intensity interval training, metabolic conditioning, and fat loss. Creates dynamic, challenging workouts that deliver results. 8+ years of coaching experience.",
    image_url: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop",
    rating: 4.9,
    total_ratings: 156,
    followers_count: 5120,
    following_count: 201,
    created_at: new Date(),
    updated_at: new Date()
  });

  // Yoga & Flexibility Coaches
  coaches.push({
    id: `coach_${Date.now()}_yoga_1`,
    name: "Priya Sharma",
    category: "Yoga",
    bio: "Certified yoga instructor with 12+ years of experience. Specializes in Vinyasa, Hatha, and restorative yoga. Helps students improve flexibility, reduce stress, and enhance overall well-being. Trained in India and certified by Yoga Alliance. Passionate about making yoga accessible to everyone.",
    image_url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop",
    rating: 4.8,
    total_ratings: 94,
    followers_count: 3450,
    following_count: 123,
    created_at: new Date(),
    updated_at: new Date()
  });

  coaches.push({
    id: `coach_${Date.now()}_yoga_2`,
    name: "James Wilson",
    category: "Yoga",
    bio: "Power yoga and flexibility coach. Combines strength training principles with yoga for a unique approach to fitness. Specializes in improving mobility, flexibility, and functional movement. 7+ years of experience helping athletes and fitness enthusiasts.",
    image_url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop",
    rating: 4.6,
    total_ratings: 67,
    followers_count: 2890,
    following_count: 98,
    created_at: new Date(),
    updated_at: new Date()
  });

  // Nutrition Coaches
  coaches.push({
    id: `coach_${Date.now()}_nutrition_1`,
    name: "Dr. Amanda Foster",
    category: "Nutrition",
    bio: "Registered dietitian and nutrition coach with a Ph.D. in Nutritional Sciences. Specializes in sports nutrition, weight management, and meal planning. Works with athletes and individuals to optimize performance and health through proper nutrition. 15+ years of clinical and coaching experience.",
    image_url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
    rating: 4.9,
    total_ratings: 178,
    followers_count: 6230,
    following_count: 145,
    created_at: new Date(),
    updated_at: new Date()
  });

  coaches.push({
    id: `coach_${Date.now()}_nutrition_2`,
    name: "Michael Thompson",
    category: "Nutrition",
    bio: "Certified nutrition coach specializing in meal prep and macro tracking. Helps clients achieve their body composition goals through strategic nutrition planning. Former bodybuilder with expertise in cutting and bulking nutrition. 10+ years of experience.",
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    rating: 4.7,
    total_ratings: 112,
    followers_count: 4560,
    following_count: 167,
    created_at: new Date(),
    updated_at: new Date()
  });

  // CrossFit & Functional Fitness
  coaches.push({
    id: `coach_${Date.now()}_crossfit_1`,
    name: "Jessica Parker",
    category: "CrossFit",
    bio: "CrossFit Level 3 coach and competitive athlete. Specializes in functional fitness, Olympic lifting, and competition training. Has competed at regional and national levels. Known for her high-energy coaching style and attention to technique. 9+ years of coaching experience.",
    image_url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop",
    rating: 4.8,
    total_ratings: 145,
    followers_count: 5890,
    following_count: 212,
    created_at: new Date(),
    updated_at: new Date()
  });

  coaches.push({
    id: `coach_${Date.now()}_crossfit_2`,
    name: "Robert Kim",
    category: "CrossFit",
    bio: "Functional fitness coach and movement specialist. Combines CrossFit methodology with mobility work and injury prevention. Specializes in helping athletes move better and perform at their peak. Certified in multiple movement systems. 11+ years of experience.",
    image_url: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=400&h=400&fit=crop",
    rating: 4.7,
    total_ratings: 98,
    followers_count: 4120,
    following_count: 134,
    created_at: new Date(),
    updated_at: new Date()
  });

  // Boxing & Martial Arts
  coaches.push({
    id: `coach_${Date.now()}_boxing_1`,
    name: "Carlos Mendez",
    category: "Boxing",
    bio: "Professional boxing coach and former professional boxer. Specializes in boxing technique, conditioning, and self-defense. Trains both competitive fighters and fitness enthusiasts. Known for his technical expertise and motivational coaching. 18+ years of experience.",
    image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    rating: 4.9,
    total_ratings: 167,
    followers_count: 7120,
    following_count: 198,
    created_at: new Date(),
    updated_at: new Date()
  });

  coaches.push({
    id: `coach_${Date.now()}_boxing_2`,
    name: "Lisa Anderson",
    category: "Boxing",
    bio: "Boxing fitness coach specializing in women's boxing and self-defense. Creates empowering, high-energy boxing workouts that build confidence and fitness. Combines boxing technique with cardio and strength training. 6+ years of coaching experience.",
    image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    rating: 4.8,
    total_ratings: 124,
    followers_count: 5230,
    following_count: 178,
    created_at: new Date(),
    updated_at: new Date()
  });

  // Pilates & Core
  coaches.push({
    id: `coach_${Date.now()}_pilates_1`,
    name: "Sophie Laurent",
    category: "Pilates",
    bio: "Certified Pilates instructor with expertise in mat and reformer Pilates. Specializes in core strength, posture correction, and rehabilitation. Helps clients build a strong foundation and prevent injuries. Trained in classical and contemporary Pilates methods. 10+ years of experience.",
    image_url: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=400&fit=crop",
    rating: 4.7,
    total_ratings: 87,
    followers_count: 3670,
    following_count: 112,
    created_at: new Date(),
    updated_at: new Date()
  });

  // Personal Training (General)
  coaches.push({
    id: `coach_${Date.now()}_personal_1`,
    name: "Alex Morgan",
    category: "Personal Training",
    bio: "Certified personal trainer specializing in weight loss and body transformation. Creates personalized programs for clients of all fitness levels. Known for motivational coaching and sustainable lifestyle changes. 8+ years of experience with hundreds of successful transformations.",
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    rating: 4.9,
    total_ratings: 201,
    followers_count: 8450,
    following_count: 245,
    created_at: new Date(),
    updated_at: new Date()
  });

  coaches.push({
    id: `coach_${Date.now()}_personal_2`,
    name: "Rachel Green",
    category: "Personal Training",
    bio: "Holistic fitness coach combining strength training, mobility, and wellness practices. Specializes in helping busy professionals achieve their fitness goals with efficient, effective workouts. Focuses on sustainable habits and work-life balance. 7+ years of experience.",
    image_url: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop",
    rating: 4.8,
    total_ratings: 143,
    followers_count: 6120,
    following_count: 189,
    created_at: new Date(),
    updated_at: new Date()
  });

  // Senior Fitness
  coaches.push({
    id: `coach_${Date.now()}_senior_1`,
    name: "Patricia Williams",
    category: "Senior Fitness",
    bio: "Specialized in senior fitness and active aging. Creates safe, effective programs for older adults focusing on strength, balance, mobility, and independence. Certified in senior fitness and fall prevention. 12+ years of experience helping seniors stay active and healthy.",
    image_url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
    rating: 4.9,
    total_ratings: 156,
    followers_count: 4890,
    following_count: 134,
    created_at: new Date(),
    updated_at: new Date()
  });

  // Sports Performance
  coaches.push({
    id: `coach_${Date.now()}_sports_1`,
    name: "Coach Mike Davis",
    category: "Sports Performance",
    bio: "Sports performance coach working with athletes across multiple sports. Specializes in speed, agility, power, and sport-specific training. Has trained professional and collegiate athletes. Combines strength training with movement quality and performance metrics. 20+ years of experience.",
    image_url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop",
    rating: 4.8,
    total_ratings: 189,
    followers_count: 7230,
    following_count: 223,
    created_at: new Date(),
    updated_at: new Date()
  });

  // Rehabilitation & Injury Prevention
  coaches.push({
    id: `coach_${Date.now()}_rehab_1`,
    name: "Dr. Kevin Park",
    category: "Rehabilitation",
    bio: "Physical therapist and movement specialist. Specializes in injury rehabilitation, corrective exercise, and pain-free movement. Helps clients recover from injuries and prevent future problems. Combines clinical expertise with practical training. 14+ years of experience.",
    image_url: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=400&h=400&fit=crop",
    rating: 4.9,
    total_ratings: 134,
    followers_count: 5670,
    following_count: 156,
    created_at: new Date(),
    updated_at: new Date()
  });

  return coaches;
};

// Seeding endpoints must never be reachable on a deployed site -- anyone who found
// the URL could stuff the database with junk. NODE_ENV is "production" on Vercel.
function blockedInProduction() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return null;
}

export async function POST(request) {
  const blocked = blockedInProduction();
  if (blocked) return blocked;

  // Seeding writes straight into the real database. Dev mode points at the same
  // Atlas cluster as production, so "not production" is not on its own a guard.
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const coachesCollection = await getCollection('coaches');
    
    // Generate sample coaches
    const sampleCoaches = generateSampleCoaches();
    
    // Check if coaches already exist (by checking count)
    const existingCount = await coachesCollection.countDocuments();
    
    // Insert all coaches
    const result = await coachesCollection.insertMany(sampleCoaches, { ordered: false });
    
    return NextResponse.json({
      success: true,
      message: `✅ Successfully created ${result.insertedCount} sample coaches!`,
      coachesCreated: result.insertedCount,
      totalCoaches: existingCount + result.insertedCount,
      coaches: sampleCoaches.map(c => ({
        id: c.id,
        name: c.name,
        category: c.category,
        rating: c.rating,
        total_ratings: c.total_ratings
      })),
      categories: [...new Set(sampleCoaches.map(c => c.category))],
      instructions: {
        nextStep: 'View coaches at /coaches or /api/coaches',
        viewUrl: '/coaches',
        apiUrl: '/api/coaches'
      }
    });
  } catch (error) {
    // Handle duplicate key errors gracefully
    if (error.code === 11000) {
      return NextResponse.json({
        success: false,
        error: 'Some coaches already exist',
        message: 'Some coaches may have been created. Check /api/coaches to see existing coaches.',
        details: error.message
      }, { status: 400 });
    }
    
    console.error('Error creating sample coaches:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: 'Make sure MongoDB connection is working'
      },
      { status: 500 }
    );
  }
}

// GET method to show instructions
export async function GET() {
  const blocked = blockedInProduction();
  if (blocked) return blocked;

  return NextResponse.json({
    message: 'Create Sample Coaches Endpoint',
    instructions: {
      method: 'POST',
      url: '/api/test-db/create-sample-coaches',
      description: 'Creates 15+ sample coaches across various categories',
      example: {
        curl: 'curl -X POST http://localhost:3000/api/test-db/create-sample-coaches',
        postman: 'POST request to /api/test-db/create-sample-coaches (no body required)'
      },
      categories: [
        'Strength (2 coaches)',
        'Cardio (2 coaches)',
        'Yoga (2 coaches)',
        'Nutrition (2 coaches)',
        'CrossFit (2 coaches)',
        'Boxing (2 coaches)',
        'Pilates (1 coach)',
        'Personal Training (2 coaches)',
        'Senior Fitness (1 coach)',
        'Sports Performance (1 coach)',
        'Rehabilitation (1 coach)'
      ]
    }
  });
}

