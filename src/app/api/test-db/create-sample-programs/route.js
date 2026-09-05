// Create Sample Programs Route
// File: src/app/api/test-db/create-sample-programs/route.js
// This route creates multiple sample training programs for testing

import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { requireAdmin } from '@/backend/utils/session';

// Never prerendered: this route depends on the request and the database.
export const dynamic = "force-dynamic";

const generateSamplePrograms = () => {
  const programs = [];

  // Weight Loss Programs
  programs.push({
    id: `program_${Date.now()}_wl_1`,
    name: "12-Week Fat Loss Transformation",
    description: "A comprehensive 12-week program designed to help you lose fat while maintaining muscle mass through strategic cardio and strength training.",
    overview: "This intensive 12-week program combines high-intensity interval training (HIIT), strength training, and metabolic conditioning to maximize fat loss. You'll work out 5-6 days per week with progressive overload to ensure continuous results. The program includes detailed nutrition guidance and recovery protocols to support your transformation journey.",
    duration: "12 weeks",
    goal: "weight_loss",
    level: "Intermediate",
    price: 99.99,
    discount: true,
    discount_percentage: 20,
    equipment: ["Dumbbells", "Resistance Bands", "Yoga Mat", "Jump Rope", "Kettlebell"],
    coach_recommendation: "Perfect for individuals who have some fitness experience and are ready to commit to a structured fat loss program. Best results when combined with a calorie deficit diet.",
    coach_id: "",
    schedule: [
      {
        day: 1,
        focus: "Upper Body Strength",
        exercises: [
          { name: "Push-ups", sets: 4, reps: "12-15", notes: "Focus on form" },
          { name: "Dumbbell Rows", sets: 4, reps: "10-12", notes: "Control the weight" },
          { name: "Shoulder Press", sets: 3, reps: "10-12", notes: "Full range of motion" },
          { name: "Bicep Curls", sets: 3, reps: "12-15", notes: "Slow and controlled" }
        ]
      },
      {
        day: 2,
        focus: "HIIT Cardio",
        exercises: [
          { name: "Jump Rope", sets: 1, reps: "30 seconds on, 30 off x 10", notes: "High intensity" },
          { name: "Burpees", sets: 1, reps: "20 seconds on, 40 off x 8", notes: "Full body movement" },
          { name: "Mountain Climbers", sets: 1, reps: "30 seconds on, 30 off x 6", notes: "Keep core tight" }
        ]
      },
      {
        day: 3,
        focus: "Lower Body Strength",
        exercises: [
          { name: "Squats", sets: 4, reps: "12-15", notes: "Go below parallel" },
          { name: "Lunges", sets: 3, reps: "12 each leg", notes: "Keep front knee behind toe" },
          { name: "Romanian Deadlifts", sets: 4, reps: "10-12", notes: "Feel the stretch" },
          { name: "Calf Raises", sets: 3, reps: "15-20", notes: "Full extension" }
        ]
      },
      {
        day: 4,
        focus: "Active Recovery",
        exercises: [
          { name: "Yoga Flow", sets: 1, reps: "30 minutes", notes: "Focus on flexibility" },
          { name: "Light Walking", sets: 1, reps: "20-30 minutes", notes: "Easy pace" }
        ]
      },
      {
        day: 5,
        focus: "Full Body Circuit",
        exercises: [
          { name: "Circuit Training", sets: 3, reps: "45 seconds each, 15 rest", notes: "Complete 6 exercises" }
        ]
      },
      {
        day: 6,
        focus: "Cardio Endurance",
        exercises: [
          { name: "Steady State Cardio", sets: 1, reps: "30-45 minutes", notes: "Moderate intensity" }
        ]
      }
    ],
    exercises: ["Push-ups", "Dumbbell Rows", "Squats", "Lunges", "HIIT Cardio", "Burpees"],
    created_at: new Date(),
    updated_at: new Date()
  });

  programs.push({
    id: `program_${Date.now()}_wl_2`,
    name: "Beginner Fat Loss Starter",
    description: "A gentle introduction to fat loss training perfect for beginners starting their fitness journey.",
    overview: "This 8-week beginner-friendly program focuses on building a solid foundation while promoting fat loss. Workouts are designed to be accessible, requiring minimal equipment and focusing on proper form. You'll learn fundamental movements while gradually increasing intensity.",
    duration: "8 weeks",
    goal: "weight_loss",
    level: "Beginner",
    price: 49.99,
    discount: false,
    discount_percentage: 0,
    equipment: ["Resistance Bands", "Yoga Mat", "Water Bottle"],
    coach_recommendation: "Ideal for complete beginners or those returning to exercise after a long break. Start slow and focus on consistency over intensity.",
    coach_id: "",
    schedule: [
      {
        day: 1,
        focus: "Full Body Basics",
        exercises: [
          { name: "Bodyweight Squats", sets: 3, reps: "10-12", notes: "Learn proper form" },
          { name: "Wall Push-ups", sets: 3, reps: "8-10", notes: "Easier variation" },
          { name: "Plank", sets: 3, reps: "20-30 seconds", notes: "Build core strength" }
        ]
      },
      {
        day: 2,
        focus: "Rest Day",
        exercises: [
          { name: "Light Stretching", sets: 1, reps: "10 minutes", notes: "Recovery is important" }
        ]
      },
      {
        day: 3,
        focus: "Cardio Introduction",
        exercises: [
          { name: "Brisk Walking", sets: 1, reps: "20-30 minutes", notes: "Moderate pace" },
          { name: "Light Jogging", sets: 1, reps: "5-10 minutes", notes: "If comfortable" }
        ]
      }
    ],
    exercises: ["Bodyweight Squats", "Wall Push-ups", "Plank", "Walking", "Stretching"],
    created_at: new Date(),
    updated_at: new Date()
  });

  // Bulking Programs
  programs.push({
    id: `program_${Date.now()}_bulk_1`,
    name: "Mass Builder - Advanced Bulking",
    description: "An intensive 16-week program designed for serious muscle gain and mass building.",
    overview: "This advanced bulking program is for experienced lifters ready to pack on serious muscle mass. The program emphasizes progressive overload, compound movements, and strategic volume increases. You'll train 6 days per week with a focus on heavy lifting and adequate recovery. Nutrition support is crucial for success.",
    duration: "16 weeks",
    goal: "bulking",
    level: "Advanced",
    price: 149.99,
    discount: true,
    discount_percentage: 15,
    equipment: ["Barbell", "Dumbbells", "Bench Press", "Squat Rack", "Cable Machine", "Pull-up Bar"],
    coach_recommendation: "Only for experienced lifters with at least 2 years of consistent training. Requires commitment to heavy lifting and proper nutrition (calorie surplus).",
    coach_id: "",
    schedule: [
      {
        day: 1,
        focus: "Chest & Triceps",
        exercises: [
          { name: "Bench Press", sets: 5, reps: "5-6", notes: "Heavy weight" },
          { name: "Incline Dumbbell Press", sets: 4, reps: "8-10", notes: "Control the negative" },
          { name: "Dips", sets: 4, reps: "8-12", notes: "Add weight if needed" },
          { name: "Tricep Extensions", sets: 3, reps: "10-12", notes: "Isolation work" }
        ]
      },
      {
        day: 2,
        focus: "Back & Biceps",
        exercises: [
          { name: "Deadlifts", sets: 5, reps: "5-6", notes: "Focus on form" },
          { name: "Pull-ups", sets: 4, reps: "8-10", notes: "Weighted if possible" },
          { name: "Barbell Rows", sets: 4, reps: "8-10", notes: "Full range" },
          { name: "Barbell Curls", sets: 3, reps: "10-12", notes: "Strict form" }
        ]
      },
      {
        day: 3,
        focus: "Legs & Glutes",
        exercises: [
          { name: "Barbell Squats", sets: 5, reps: "6-8", notes: "Deep squats" },
          { name: "Romanian Deadlifts", sets: 4, reps: "8-10", notes: "Feel the stretch" },
          { name: "Leg Press", sets: 4, reps: "12-15", notes: "High volume" },
          { name: "Leg Curls", sets: 3, reps: "10-12", notes: "Hamstring focus" }
        ]
      },
      {
        day: 4,
        focus: "Shoulders & Traps",
        exercises: [
          { name: "Overhead Press", sets: 5, reps: "6-8", notes: "Standing or seated" },
          { name: "Lateral Raises", sets: 4, reps: "12-15", notes: "Higher reps" },
          { name: "Rear Delt Flyes", sets: 3, reps: "12-15", notes: "Posterior delts" },
          { name: "Shrugs", sets: 4, reps: "12-15", notes: "Heavy weight" }
        ]
      },
      {
        day: 5,
        focus: "Arms Specialization",
        exercises: [
          { name: "Close Grip Bench", sets: 4, reps: "8-10", notes: "Tricep focus" },
          { name: "Hammer Curls", sets: 4, reps: "10-12", notes: "Brachialis" },
          { name: "Cable Extensions", sets: 3, reps: "12-15", notes: "Pump work" }
        ]
      },
      {
        day: 6,
        focus: "Legs Volume Day",
        exercises: [
          { name: "Front Squats", sets: 4, reps: "10-12", notes: "Different stimulus" },
          { name: "Bulgarian Split Squats", sets: 3, reps: "10 each leg", notes: "Unilateral" },
          { name: "Calf Raises", sets: 4, reps: "15-20", notes: "Full range" }
        ]
      }
    ],
    exercises: ["Bench Press", "Deadlifts", "Squats", "Overhead Press", "Pull-ups", "Rows"],
    created_at: new Date(),
    updated_at: new Date()
  });

  programs.push({
    id: `program_${Date.now()}_bulk_2`,
    name: "Lean Bulk Program",
    description: "Build muscle while minimizing fat gain with this strategic lean bulking approach.",
    overview: "This 12-week lean bulk program focuses on quality muscle gain with minimal fat accumulation. The training approach balances volume and intensity while maintaining a moderate calorie surplus. Perfect for those who want to stay relatively lean while building muscle.",
    duration: "12 weeks",
    goal: "bulking",
    level: "Intermediate",
    price: 89.99,
    discount: false,
    discount_percentage: 0,
    equipment: ["Dumbbells", "Barbell", "Bench", "Pull-up Bar", "Cable Machine"],
    coach_recommendation: "Best for intermediate lifters who want to gain muscle without excessive fat gain. Requires disciplined nutrition with a small calorie surplus.",
    coach_id: "",
    schedule: [
      {
        day: 1,
        focus: "Push Day",
        exercises: [
          { name: "Bench Press", sets: 4, reps: "8-10", notes: "Moderate weight" },
          { name: "Overhead Press", sets: 3, reps: "8-10", notes: "Strict form" },
          { name: "Dips", sets: 3, reps: "10-12", notes: "Bodyweight or weighted" }
        ]
      },
      {
        day: 2,
        focus: "Pull Day",
        exercises: [
          { name: "Deadlifts", sets: 4, reps: "6-8", notes: "Heavy but controlled" },
          { name: "Pull-ups", sets: 4, reps: "8-10", notes: "Full range" },
          { name: "Cable Rows", sets: 3, reps: "10-12", notes: "Squeeze at top" }
        ]
      },
      {
        day: 3,
        focus: "Legs",
        exercises: [
          { name: "Squats", sets: 4, reps: "8-10", notes: "Quality over quantity" },
          { name: "Romanian Deadlifts", sets: 3, reps: "10-12", notes: "Hamstring focus" },
          { name: "Leg Press", sets: 3, reps: "12-15", notes: "Volume work" }
        ]
      },
      {
        day: 4,
        focus: "Rest",
        exercises: [
          { name: "Light Cardio", sets: 1, reps: "20-30 minutes", notes: "Optional" }
        ]
      }
    ],
    exercises: ["Bench Press", "Deadlifts", "Squats", "Pull-ups", "Overhead Press"],
    created_at: new Date(),
    updated_at: new Date()
  });

  // Muscle Building Programs
  programs.push({
    id: `program_${Date.now()}_mb_1`,
    name: "Complete Muscle Builder",
    description: "A comprehensive program targeting all muscle groups for balanced, aesthetic development.",
    overview: "This 12-week program is designed to build muscle mass across your entire body with a focus on symmetry and proportion. The program uses a push/pull/legs split with strategic volume and intensity to maximize hypertrophy. Perfect for intermediate to advanced lifters looking to build a complete physique.",
    duration: "12 weeks",
    goal: "muscle_building",
    level: "Intermediate",
    price: 119.99,
    discount: true,
    discount_percentage: 25,
    equipment: ["Barbell", "Dumbbells", "Bench", "Squat Rack", "Cable Machine", "Pull-up Bar"],
    coach_recommendation: "Excellent for intermediate lifters who want balanced muscle development. Focus on progressive overload and proper form throughout.",
    coach_id: "",
    schedule: [
      {
        day: 1,
        focus: "Push (Chest, Shoulders, Triceps)",
        exercises: [
          { name: "Bench Press", sets: 4, reps: "8-10", notes: "Main movement" },
          { name: "Incline Dumbbell Press", sets: 4, reps: "10-12", notes: "Upper chest" },
          { name: "Overhead Press", sets: 3, reps: "8-10", notes: "Shoulders" },
          { name: "Lateral Raises", sets: 3, reps: "12-15", notes: "Side delts" },
          { name: "Tricep Dips", sets: 3, reps: "10-12", notes: "Triceps" }
        ]
      },
      {
        day: 2,
        focus: "Pull (Back, Biceps)",
        exercises: [
          { name: "Deadlifts", sets: 4, reps: "6-8", notes: "Posterior chain" },
          { name: "Pull-ups", sets: 4, reps: "8-10", notes: "Lats" },
          { name: "Barbell Rows", sets: 4, reps: "8-10", notes: "Mid back" },
          { name: "Barbell Curls", sets: 3, reps: "10-12", notes: "Biceps" },
          { name: "Hammer Curls", sets: 3, reps: "10-12", notes: "Brachialis" }
        ]
      },
      {
        day: 3,
        focus: "Legs (Quads, Hamstrings, Glutes, Calves)",
        exercises: [
          { name: "Barbell Squats", sets: 4, reps: "8-10", notes: "Quads" },
          { name: "Romanian Deadlifts", sets: 4, reps: "10-12", notes: "Hamstrings" },
          { name: "Leg Press", sets: 3, reps: "12-15", notes: "Volume" },
          { name: "Leg Curls", sets: 3, reps: "12-15", notes: "Hamstring isolation" },
          { name: "Calf Raises", sets: 4, reps: "15-20", notes: "Calves" }
        ]
      },
      {
        day: 4,
        focus: "Rest",
        exercises: [
          { name: "Active Recovery", sets: 1, reps: "Light stretching", notes: "Recovery day" }
        ]
      },
      {
        day: 5,
        focus: "Push (Volume Day)",
        exercises: [
          { name: "Dumbbell Press", sets: 4, reps: "10-12", notes: "Different angle" },
          { name: "Cable Flyes", sets: 3, reps: "12-15", notes: "Chest isolation" },
          { name: "Arnold Press", sets: 3, reps: "10-12", notes: "Shoulders" }
        ]
      },
      {
        day: 6,
        focus: "Pull (Volume Day)",
        exercises: [
          { name: "Cable Rows", sets: 4, reps: "10-12", notes: "Back width" },
          { name: "Lat Pulldowns", sets: 3, reps: "10-12", notes: "Lats" },
          { name: "Face Pulls", sets: 3, reps: "15-20", notes: "Rear delts" }
        ]
      }
    ],
    exercises: ["Bench Press", "Deadlifts", "Squats", "Pull-ups", "Overhead Press", "Rows"],
    created_at: new Date(),
    updated_at: new Date()
  });

  programs.push({
    id: `program_${Date.now()}_mb_2`,
    name: "Upper/Lower Split Builder",
    description: "A classic upper/lower split perfect for building muscle with 4 training days per week.",
    overview: "This 10-week upper/lower split program is ideal for those who prefer training 4 days per week. Each muscle group is trained twice per week with optimal volume for muscle growth. The program is perfect for intermediate lifters who want to build muscle while maintaining flexibility in their schedule.",
    duration: "10 weeks",
    goal: "muscle_building",
    level: "Intermediate",
    price: 79.99,
    discount: false,
    discount_percentage: 0,
    equipment: ["Barbell", "Dumbbells", "Bench", "Squat Rack", "Cable Machine"],
    coach_recommendation: "Great for intermediate lifters who want a balanced approach to muscle building. The 4-day split allows for good recovery between sessions.",
    coach_id: "",
    schedule: [
      {
        day: 1,
        focus: "Upper Body Strength",
        exercises: [
          { name: "Bench Press", sets: 4, reps: "6-8", notes: "Heavy" },
          { name: "Barbell Rows", sets: 4, reps: "6-8", notes: "Heavy" },
          { name: "Overhead Press", sets: 3, reps: "8-10", notes: "Shoulders" },
          { name: "Pull-ups", sets: 3, reps: "8-10", notes: "Lats" }
        ]
      },
      {
        day: 2,
        focus: "Lower Body Strength",
        exercises: [
          { name: "Squats", sets: 4, reps: "6-8", notes: "Heavy" },
          { name: "Romanian Deadlifts", sets: 4, reps: "8-10", notes: "Hamstrings" },
          { name: "Leg Press", sets: 3, reps: "12-15", notes: "Volume" }
        ]
      },
      {
        day: 3,
        focus: "Rest",
        exercises: []
      },
      {
        day: 4,
        focus: "Upper Body Hypertrophy",
        exercises: [
          { name: "Incline Dumbbell Press", sets: 4, reps: "10-12", notes: "Volume" },
          { name: "Cable Rows", sets: 4, reps: "10-12", notes: "Volume" },
          { name: "Lateral Raises", sets: 3, reps: "12-15", notes: "Delts" },
          { name: "Bicep Curls", sets: 3, reps: "12-15", notes: "Arms" }
        ]
      },
      {
        day: 5,
        focus: "Lower Body Hypertrophy",
        exercises: [
          { name: "Front Squats", sets: 4, reps: "10-12", notes: "Volume" },
          { name: "Leg Curls", sets: 3, reps: "12-15", notes: "Hamstrings" },
          { name: "Lunges", sets: 3, reps: "12 each leg", notes: "Unilateral" }
        ]
      }
    ],
    exercises: ["Bench Press", "Squats", "Rows", "Overhead Press", "Pull-ups"],
    created_at: new Date(),
    updated_at: new Date()
  });

  // Endurance Programs
  programs.push({
    id: `program_${Date.now()}_end_1`,
    name: "Marathon Training Program",
    description: "A comprehensive 16-week program to prepare you for your first or next marathon.",
    overview: "This 16-week marathon training program is designed to build your endurance, improve your running economy, and prepare you for race day. The program includes long runs, tempo runs, interval training, and recovery days. Perfect for runners who want to complete a marathon or improve their personal best.",
    duration: "16 weeks",
    goal: "endurance",
    level: "Intermediate",
    price: 129.99,
    discount: true,
    discount_percentage: 10,
    equipment: ["Running Shoes", "GPS Watch", "Foam Roller", "Resistance Bands"],
    coach_recommendation: "Best for runners with at least 6 months of consistent running experience. You should be able to run 5K comfortably before starting. Nutrition and hydration strategies included.",
    coach_id: "",
    schedule: [
      {
        day: 1,
        focus: "Easy Run",
        exercises: [
          { name: "Easy Pace Run", sets: 1, reps: "30-45 minutes", notes: "Conversational pace" }
        ]
      },
      {
        day: 2,
        focus: "Tempo Run",
        exercises: [
          { name: "Warm-up", sets: 1, reps: "10 minutes easy", notes: "Prepare body" },
          { name: "Tempo Pace", sets: 1, reps: "20-30 minutes", notes: "Comfortably hard" },
          { name: "Cool-down", sets: 1, reps: "10 minutes easy", notes: "Recovery" }
        ]
      },
      {
        day: 3,
        focus: "Recovery Run",
        exercises: [
          { name: "Easy Run", sets: 1, reps: "20-30 minutes", notes: "Very easy pace" }
        ]
      },
      {
        day: 4,
        focus: "Interval Training",
        exercises: [
          { name: "Warm-up", sets: 1, reps: "10 minutes", notes: "Easy pace" },
          { name: "Intervals", sets: 1, reps: "6x800m with 2min rest", notes: "5K pace" },
          { name: "Cool-down", sets: 1, reps: "10 minutes", notes: "Easy pace" }
        ]
      },
      {
        day: 5,
        focus: "Rest or Cross-Training",
        exercises: [
          { name: "Light Activity", sets: 1, reps: "30-45 minutes", notes: "Swimming, cycling, or rest" }
        ]
      },
      {
        day: 6,
        focus: "Long Run",
        exercises: [
          { name: "Long Distance Run", sets: 1, reps: "90-120 minutes", notes: "Build endurance" }
        ]
      },
      {
        day: 7,
        focus: "Rest Day",
        exercises: [
          { name: "Complete Rest", sets: 1, reps: "Full rest", notes: "Recovery is crucial" }
        ]
      }
    ],
    exercises: ["Easy Runs", "Tempo Runs", "Interval Training", "Long Runs", "Recovery"],
    created_at: new Date(),
    updated_at: new Date()
  });

  programs.push({
    id: `program_${Date.now()}_end_2`,
    name: "5K to 10K Endurance Builder",
    description: "Progress from 5K to 10K with this structured 8-week endurance program.",
    overview: "This 8-week program is perfect for runners who can comfortably run 5K and want to build their endurance to complete a 10K. The program gradually increases distance while incorporating speed work and recovery. You'll train 4-5 days per week with a focus on building aerobic capacity.",
    duration: "8 weeks",
    goal: "endurance",
    level: "Beginner",
    price: 59.99,
    discount: false,
    discount_percentage: 0,
    equipment: ["Running Shoes", "GPS Watch or App"],
    coach_recommendation: "Perfect for beginners who can run 5K without stopping. The program builds gradually to prevent injury and build confidence.",
    coach_id: "",
    schedule: [
      {
        day: 1,
        focus: "Base Run",
        exercises: [
          { name: "Steady Run", sets: 1, reps: "20-25 minutes", notes: "Comfortable pace" }
        ]
      },
      {
        day: 2,
        focus: "Rest",
        exercises: [
          { name: "Rest or Walk", sets: 1, reps: "20 minutes", notes: "Active recovery" }
        ]
      },
      {
        day: 3,
        focus: "Interval Training",
        exercises: [
          { name: "Warm-up", sets: 1, reps: "5 minutes walk", notes: "Prepare" },
          { name: "Run/Walk Intervals", sets: 1, reps: "5x (3min run, 1min walk)", notes: "Build capacity" },
          { name: "Cool-down", sets: 1, reps: "5 minutes walk", notes: "Recovery" }
        ]
      },
      {
        day: 4,
        focus: "Easy Run",
        exercises: [
          { name: "Easy Pace", sets: 1, reps: "15-20 minutes", notes: "Very comfortable" }
        ]
      },
      {
        day: 5,
        focus: "Long Run",
        exercises: [
          { name: "Longer Distance", sets: 1, reps: "30-40 minutes", notes: "Build endurance" }
        ]
      }
    ],
    exercises: ["Steady Runs", "Interval Training", "Long Runs", "Recovery Walks"],
    created_at: new Date(),
    updated_at: new Date()
  });

  programs.push({
    id: `program_${Date.now()}_end_3`,
    name: "Triathlon Training Program",
    description: "A complete 20-week program preparing you for your first triathlon (Olympic distance).",
    overview: "This comprehensive 20-week triathlon training program covers swimming, cycling, and running with structured workouts for each discipline. The program includes brick workouts (combining disciplines) and builds your endurance across all three sports. Perfect for athletes ready to take on the challenge of a triathlon.",
    duration: "20 weeks",
    goal: "endurance",
    level: "Advanced",
    price: 179.99,
    discount: true,
    discount_percentage: 20,
    equipment: ["Swim Gear", "Bicycle", "Running Shoes", "GPS Watch", "Wetsuit (optional)"],
    coach_recommendation: "For athletes with experience in at least one of the three disciplines. Requires commitment to training 6 days per week. Nutrition and transition practice included.",
    coach_id: "",
    schedule: [
      {
        day: 1,
        focus: "Swim Training",
        exercises: [
          { name: "Warm-up", sets: 1, reps: "200m easy", notes: "Freestyle" },
          { name: "Main Set", sets: 1, reps: "10x100m with 20s rest", notes: "Build endurance" },
          { name: "Cool-down", sets: 1, reps: "200m easy", notes: "Recovery" }
        ]
      },
      {
        day: 2,
        focus: "Bike Training",
        exercises: [
          { name: "Long Ride", sets: 1, reps: "60-90 minutes", notes: "Aerobic base" }
        ]
      },
      {
        day: 3,
        focus: "Run Training",
        exercises: [
          { name: "Tempo Run", sets: 1, reps: "30-40 minutes", notes: "Comfortably hard" }
        ]
      },
      {
        day: 4,
        focus: "Swim Technique",
        exercises: [
          { name: "Drills", sets: 1, reps: "45 minutes", notes: "Focus on form" }
        ]
      },
      {
        day: 5,
        focus: "Brick Workout",
        exercises: [
          { name: "Bike", sets: 1, reps: "45 minutes", notes: "Moderate pace" },
          { name: "Transition", sets: 1, reps: "5 minutes", notes: "Practice" },
          { name: "Run", sets: 1, reps: "20 minutes", notes: "Off the bike" }
        ]
      },
      {
        day: 6,
        focus: "Long Run",
        exercises: [
          { name: "Endurance Run", sets: 1, reps: "60-75 minutes", notes: "Build capacity" }
        ]
      }
    ],
    exercises: ["Swimming", "Cycling", "Running", "Brick Workouts", "Transitions"],
    created_at: new Date(),
    updated_at: new Date()
  });

  // Add a few more muscle building programs
  programs.push({
    id: `program_${Date.now()}_mb_3`,
    name: "Home Workout Muscle Builder",
    description: "Build muscle at home with minimal equipment using bodyweight and basic tools.",
    overview: "This 10-week program is designed for those who prefer training at home or have limited access to a gym. Using primarily bodyweight exercises, resistance bands, and basic dumbbells, you'll build muscle and strength. The program focuses on progressive overload through rep increases and exercise variations.",
    duration: "10 weeks",
    goal: "muscle_building",
    level: "All Levels",
    price: 69.99,
    discount: false,
    discount_percentage: 0,
    equipment: ["Resistance Bands", "Dumbbells (optional)", "Pull-up Bar (optional)", "Yoga Mat"],
    coach_recommendation: "Perfect for home trainers or those with limited gym access. Can be adapted for all fitness levels by adjusting reps and difficulty.",
    coach_id: "",
    schedule: [
      {
        day: 1,
        focus: "Upper Body",
        exercises: [
          { name: "Push-ups", sets: 4, reps: "Max reps", notes: "Various hand positions" },
          { name: "Pull-ups or Rows", sets: 4, reps: "8-12", notes: "Use bands if needed" },
          { name: "Dips", sets: 3, reps: "10-15", notes: "Chair or parallel bars" },
          { name: "Pike Push-ups", sets: 3, reps: "10-12", notes: "Shoulder focus" }
        ]
      },
      {
        day: 2,
        focus: "Lower Body",
        exercises: [
          { name: "Pistol Squats", sets: 3, reps: "5-8 each leg", notes: "Advanced" },
          { name: "Bulgarian Split Squats", sets: 3, reps: "12 each leg", notes: "Use weight if available" },
          { name: "Glute Bridges", sets: 3, reps: "15-20", notes: "Hip thrust variation" },
          { name: "Calf Raises", sets: 3, reps: "15-20", notes: "Bodyweight or weighted" }
        ]
      },
      {
        day: 3,
        focus: "Full Body",
        exercises: [
          { name: "Burpees", sets: 3, reps: "10-15", notes: "Full body" },
          { name: "Mountain Climbers", sets: 3, reps: "30 seconds", notes: "Core and cardio" },
          { name: "Plank Variations", sets: 3, reps: "45-60 seconds", notes: "Core strength" }
        ]
      }
    ],
    exercises: ["Push-ups", "Pull-ups", "Squats", "Dips", "Burpees", "Planks"],
    created_at: new Date(),
    updated_at: new Date()
  });

  // Add one more weight loss program
  programs.push({
    id: `program_${Date.now()}_wl_3`,
    name: "HIIT Fat Burner",
    description: "High-intensity interval training program designed to maximize fat burning in minimal time.",
    overview: "This 6-week HIIT program is perfect for busy individuals who want maximum results in minimal time. Each workout is 20-30 minutes and designed to burn calories both during and after exercise (EPOC effect). The program combines strength and cardio for a complete fat-burning experience.",
    duration: "6 weeks",
    goal: "weight_loss",
    level: "Intermediate",
    price: 69.99,
    discount: true,
    discount_percentage: 30,
    equipment: ["Dumbbells", "Jump Rope", "Yoga Mat", "Timer"],
    coach_recommendation: "Ideal for those with limited time who want efficient workouts. High intensity - not recommended for complete beginners or those with joint issues.",
    coach_id: "",
    schedule: [
      {
        day: 1,
        focus: "Full Body HIIT",
        exercises: [
          { name: "Warm-up", sets: 1, reps: "5 minutes", notes: "Dynamic movements" },
          { name: "Circuit", sets: 4, reps: "45s work, 15s rest x 8 exercises", notes: "High intensity" },
          { name: "Cool-down", sets: 1, reps: "5 minutes", notes: "Stretching" }
        ]
      },
      {
        day: 2,
        focus: "Upper Body HIIT",
        exercises: [
          { name: "HIIT Circuit", sets: 1, reps: "20 minutes", notes: "Push-ups, rows, presses" }
        ]
      },
      {
        day: 3,
        focus: "Lower Body HIIT",
        exercises: [
          { name: "HIIT Circuit", sets: 1, reps: "20 minutes", notes: "Squats, lunges, jumps" }
        ]
      },
      {
        day: 4,
        focus: "Cardio HIIT",
        exercises: [
          { name: "Sprint Intervals", sets: 1, reps: "20 minutes", notes: "Running or cycling" }
        ]
      },
      {
        day: 5,
        focus: "Active Recovery",
        exercises: [
          { name: "Light Activity", sets: 1, reps: "30 minutes", notes: "Walking or yoga" }
        ]
      }
    ],
    exercises: ["HIIT Circuits", "Burpees", "Jump Squats", "Mountain Climbers", "Sprint Intervals"],
    created_at: new Date(),
    updated_at: new Date()
  });

  return programs;
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
    const programsCollection = await getCollection('training_programs');
    
    // Generate sample programs
    const samplePrograms = generateSamplePrograms();
    
    // Check if programs already exist (by checking count)
    const existingCount = await programsCollection.countDocuments();
    
    // Insert all programs
    const result = await programsCollection.insertMany(samplePrograms, { ordered: false });
    
    return NextResponse.json({
      success: true,
      message: `✅ Successfully created ${result.insertedCount} sample programs!`,
      programsCreated: result.insertedCount,
      totalPrograms: existingCount + result.insertedCount,
      programs: samplePrograms.map(p => ({
        id: p.id,
        name: p.name,
        goal: p.goal,
        level: p.level,
        duration: p.duration,
        price: p.price
      })),
      instructions: {
        nextStep: 'View programs at /services/programs or /api/programs',
        viewUrl: '/services/programs',
        apiUrl: '/api/programs'
      }
    });
  } catch (error) {
    // Handle duplicate key errors gracefully
    if (error.code === 11000) {
      return NextResponse.json({
        success: false,
        error: 'Some programs already exist',
        message: 'Some programs may have been created. Check /api/programs to see existing programs.',
        details: error.message
      }, { status: 400 });
    }
    
    console.error('Error creating sample programs:', error);
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
    message: 'Create Sample Programs Endpoint',
    instructions: {
      method: 'POST',
      url: '/api/test-db/create-sample-programs',
      description: 'Creates 12+ sample training programs across all goals (weight_loss, bulking, muscle_building, endurance)',
      example: {
        curl: 'curl -X POST http://localhost:3000/api/test-db/create-sample-programs',
        postman: 'POST request to /api/test-db/create-sample-programs (no body required)'
      },
      programsCreated: [
        'Weight Loss: 12-Week Fat Loss, Beginner Fat Loss Starter, HIIT Fat Burner',
        'Bulking: Advanced Mass Builder, Lean Bulk Program',
        'Muscle Building: Complete Muscle Builder, Upper/Lower Split, Home Workout Builder',
        'Endurance: Marathon Training, 5K to 10K Builder, Triathlon Training'
      ]
    }
  });
}

