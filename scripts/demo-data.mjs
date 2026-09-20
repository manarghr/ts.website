// Demo content for the TrainSight showcase
// File: scripts/demo-data.mjs
//
// Seed content so the site looks like a working product rather than an empty
// shell. Loaded by scripts/seed-demo.mjs.
//
// Everything here is fictional. Coaches are invented people, not real
// trainers, and every document carries `is_demo: true` so it can be listed or
// removed in one query later (`npm run seed-demo -- --clear`).
//
// Field names are not guesses -- they match what the components actually read:
//   coaches            -> src/components/coaches/Coaches.jsx (groups by `category`)
//   training_programs  -> src/components/Programs/ProgramDetail.jsx
//   blog               -> src/components/blog/BlogGrid.jsx (post.sections[])
//   meals              -> src/components/meal/MealPost.jsx
//   videos             -> backend/schemas/coach-schema.js
//
// Images come from Unsplash's CDN, which is already in the allowlist in
// src/lib/image-hosts.mjs -- a host that is not listed there will not render.

// Meal photographs are checked by eye before being used here, not just for a
// 200 response. An id that loads can still show the wrong thing entirely: the
// previous overnight-oats image was a stack of books, which is the kind of
// mistake only looking at it will catch.
const photo = (id) =>
  `https://images.unsplash.com/${id}?w=1600&h=1200&fit=crop&q=85&auto=format`;

const wide = (id) =>
  `https://images.unsplash.com/${id}?w=1600&h=900&fit=crop&q=85&auto=format`;

// Richer detail for each programme: the cover photo, how many people are on it,
// a lesson playlist, and what people said about it.
//
// PHOTOS are checked by eye, not just for a 200 response.
// YOUTUBE IDS are checked against img.youtube.com/vi/<id>/hqdefault.jpg --
// a real video returns a ~25KB thumbnail, an unavailable one returns ~2KB.
// The playlist opens videos on YouTube rather than embedding them: the site's
// CSP has no frame-src, so an iframe would be blocked without a config change.
const PROGRAM_EXTRAS = {
  demo_prog_strength_foundations: {
    coachIds: ["demo_coach_amine", "demo_coach_omar", "demo_coach_samira"],
    whoFor: [
      "You can already squat, bench and deadlift with reasonable technique",
      "You have trained consistently for at least six months",
      "You can commit to four sessions a week for twelve weeks",
    ],
    outcomes: [
      "A heavier squat, bench and deadlift, with the numbers logged",
      "A repeatable way to progress load without stalling every month",
      "An understanding of why the deload week is not optional",
    ],
    // verified: barbell deadlift setup
    image: photo("photo-1517836357463-d25dfeac3438"),
    enrolled: 1284,
    lessons: [
      { title: "Setting up the squat", duration: "12:04", youtubeId: "dJlFmxiL11s" },
      { title: "Bracing and the valsalva", duration: "8:42", youtubeId: "IODxDxX7oi4" },
      { title: "Bench press arch and leg drive", duration: "10:18", youtubeId: "ml6cT4AZdqI" },
      { title: "Deadlift: hips, bar path, lockout", duration: "14:27", youtubeId: "2pLT-olgUJs" },
      { title: "Running the deload week", duration: "6:55", youtubeId: "UBMk30rjy0o" },
    ],
    testimonials: [
      { name: "Sofiane R.", text: "Third block in and my squat has moved 15kg. The deload weeks felt pointless until they very obviously were not.", weeks: 12 },
      { name: "Nadia B.", text: "First programme I have actually finished. Knowing exactly what the session is before I get to the gym is most of it.", weeks: 12 },
    ],
  },

  demo_prog_first_10k: {
    coachIds: ["demo_coach_youssef", "demo_coach_selma", "demo_coach_mehdi"],
    whoFor: [
      "You can currently run about 3km without stopping",
      "You have three days a week to run",
      "You are willing to run slower than feels productive",
    ],
    outcomes: [
      "A finished 10K",
      "A genuine easy pace you can hold a conversation at",
      "The habit of one hard session a week rather than three mediocre ones",
    ],
    // verified: sprinter on starting blocks
    image: photo("photo-1461896836934-ffe607ba8211"),
    enrolled: 2046,
    lessons: [
      { title: "Finding your easy pace", duration: "9:31", youtubeId: "dJlFmxiL11s" },
      { title: "Your first interval session", duration: "11:12", youtubeId: "IODxDxX7oi4" },
      { title: "Building the long run", duration: "7:48", youtubeId: "ml6cT4AZdqI" },
      { title: "Race week", duration: "6:20", youtubeId: "2pLT-olgUJs" },
    ],
    testimonials: [
      { name: "Yanis M.", text: "I was running every session flat out and wondering why I never improved. Slowing down two of three runs changed everything.", weeks: 8 },
      { name: "Lina T.", text: "Finished my first 10K in week eight. Never thought I would say that.", weeks: 8 },
    ],
  },

  demo_prog_mobility_reset: {
    coachIds: ["demo_coach_leila", "demo_coach_ines", "demo_coach_mariam"],
    whoFor: [
      "You sit for most of the working day",
      "You have fifteen minutes, most days",
      "You want range of motion rather than a workout",
    ],
    outcomes: [
      "A hip and thoracic position that does not limit your lifts",
      "A short sequence you will actually keep doing",
      "Less of the stiffness that arrives around 3pm",
    ],
    // verified: yoga/meditation at sunrise
    image: photo("photo-1506126613408-eca07ce68773"),
    enrolled: 3517,
    lessons: [
      { title: "The 90/90 hip sequence", duration: "13:05", youtubeId: "ml6cT4AZdqI" },
      { title: "Thoracic spine, daily", duration: "10:44", youtubeId: "dJlFmxiL11s" },
      { title: "Shoulder CARs explained", duration: "8:16", youtubeId: "UBMk30rjy0o" },
    ],
    testimonials: [
      { name: "Omar K.", text: "Fifteen minutes before training instead of stretching after it. My overhead position is unrecognisable.", weeks: 6 },
      { name: "Sara D.", text: "Desk job shoulders, mostly gone. It is very boring and it works.", weeks: 6 },
    ],
  },

  demo_prog_fat_loss_12: {
    coachIds: ["demo_coach_omar", "demo_coach_rania", "demo_coach_othmane"],
    whoFor: [
      "You want to lose fat without losing the muscle you have built",
      "You have three days a week to lift and can walk daily",
      "You are prepared for this to take twelve weeks, not four",
    ],
    outcomes: [
      "Fat lost at a rate that does not cost you strength",
      "Lifts that hold or improve across a deficit",
      "A step target you can sustain after the programme ends",
    ],
    // verified: group mat workout
    image: photo("photo-1518611012118-696072aa579a"),
    enrolled: 1872,
    lessons: [
      { title: "Why the lifting matters in a deficit", duration: "9:58", youtubeId: "IODxDxX7oi4" },
      { title: "Setting your step target", duration: "6:32", youtubeId: "2pLT-olgUJs" },
      { title: "Full body A, walked through", duration: "15:40", youtubeId: "ml6cT4AZdqI" },
    ],
    testimonials: [
      { name: "Meriem H.", text: "The lifts stayed the same while the weight came down, which is exactly what I was told to expect.", weeks: 12 },
      { name: "Karim A.", text: "The step target did more than any cardio plan I have tried.", weeks: 10 },
    ],
  },

  demo_prog_boxing_basics: {
    coachIds: ["demo_coach_nadia", "demo_coach_sami", "demo_coach_imen"],
    whoFor: [
      "You have never boxed, or learned from videos and want it corrected",
      "You are not looking to spar",
      "You accept spending the first three weeks on footwork",
    ],
    outcomes: [
      "A stance you can hold under fatigue",
      "A jab that goes out and comes back on the same line",
      "Conditioning built around real three-minute rounds",
    ],
    // verified: speed bag in a boxing gym
    image: photo("photo-1633394782368-6e7260566004"),
    enrolled: 964,
    lessons: [
      { title: "Stance and guard", duration: "11:23", youtubeId: "dJlFmxiL11s" },
      { title: "The jab, properly", duration: "13:47", youtubeId: "UBMk30rjy0o" },
      { title: "Lateral movement drills", duration: "9:05", youtubeId: "IODxDxX7oi4" },
      { title: "Rope work for rounds", duration: "7:39", youtubeId: "2pLT-olgUJs" },
    ],
    testimonials: [
      { name: "Rania S.", text: "Three weeks of footwork before a single combination. Frustrating, then obviously correct.", weeks: 8 },
      { name: "Tarek L.", text: "My jab goes out and comes back on the same line now. It did not before.", weeks: 8 },
    ],
  },

  demo_prog_crossfit_onramp: {
    coachIds: ["demo_coach_karim", "demo_coach_maya", "demo_coach_sabrine"],
    whoFor: [
      "You are new to CrossFit, or returning after a long break",
      "You would rather learn the movements than chase a time",
      "You have access to a barbell, kettlebell and pull-up bar",
    ],
    outcomes: [
      "The nine foundational movements, performed cleanly",
      "The judgement to scale a workout correctly",
      "A base that makes the next two years possible",
    ],
    // verified: barbell in a rack
    image: photo("photo-1541534741688-6078c6bfb5c5"),
    enrolled: 1130,
    lessons: [
      { title: "The nine foundational movements", duration: "16:12", youtubeId: "ml6cT4AZdqI" },
      { title: "Scaling without ego", duration: "10:30", youtubeId: "dJlFmxiL11s" },
      { title: "Kettlebell swing mechanics", duration: "8:54", youtubeId: "2pLT-olgUJs" },
    ],
    testimonials: [
      { name: "Ines F.", text: "Six weeks before anyone touched a clock. I can hold positions now that I could not fake before.", weeks: 6 },
      { name: "Bilal N.", text: "The scaling lesson alone was worth it.", weeks: 6 },
    ],
  },
};

const programList = [
  {
    id: "demo_prog_strength_foundations",
    name: "Strength Foundations",
    title: "Strength Foundations",
    description:
      "A twelve-week barbell programme for lifters who know the movements and want them heavier. Four sessions a week, built on progressive overload with a deload every fourth week.",
    overview:
      "Most intermediate lifters stall not because they lack effort but because they never run the same plan long enough to see it work. This programme runs three four-week blocks on the same main lifts, adding load in small increments and cutting volume in week four so the gains actually land.",
    goal: "Build maximal strength",
    level: "Intermediate",
    duration: "12 weeks",
    price: 49,
    discount_percentage: 20,
    equipment: "Barbell, rack, bench, plates",
    exercises: "Back squat, bench press, deadlift, overhead press, rows, chin-ups",
    coach_id: "demo_coach_amine",
    coach_recommendation:
      "Film your top set from the side each week. You will spot depth and bar path problems long before your body tells you about them.",
    schedule: [
      { day: "Day 1", focus: "Lower - squat", exercises: "Back squat, Romanian deadlift, split squat, calf raise", notes: "Squat is the priority; everything after it is accessory volume." },
      { day: "Day 2", focus: "Upper - press", exercises: "Bench press, overhead press, dips, triceps extension", notes: "Rest 3 minutes between bench sets. Not 90 seconds." },
      { day: "Day 3", focus: "Lower - hinge", exercises: "Deadlift, front squat, hip thrust, hamstring curl", notes: "Stop deadlift sets when bar speed drops, regardless of the number on the sheet." },
      { day: "Day 4", focus: "Upper - pull", exercises: "Chin-ups, barbell row, face pull, biceps curl", notes: "Add weight to chin-ups before adding reps." },
    ],
  },
  {
    id: "demo_prog_first_10k",
    name: "Your First 10K",
    title: "Your First 10K",
    description:
      "Eight weeks from comfortable 3K to a finished 10K. Three runs a week, most of them slower than you expect.",
    overview:
      "The plan is built on the idea that beginners fail at 10K for one reason: every run is a hard run. Two of your three weekly runs here are genuinely easy, and that is what lets the third one be useful.",
    goal: "Complete a 10K",
    level: "Beginner",
    duration: "8 weeks",
    price: 29,
    discount_percentage: 0,
    equipment: "Running shoes",
    exercises: "Easy runs, interval sessions, long runs, strides",
    coach_id: "demo_coach_youssef",
    coach_recommendation:
      "If you can't hold a conversation on an easy run, you are running it too fast. Slow down; the race day payoff is real.",
    schedule: [
      { day: "Day 1", focus: "Easy run", exercises: "25-35 min conversational pace", notes: "Genuinely easy. Walk breaks are allowed." },
      { day: "Day 2", focus: "Intervals", exercises: "6-8 x 400m with 90s jog recovery", notes: "The only hard session of the week." },
      { day: "Day 3", focus: "Long run", exercises: "45-70 min, building weekly", notes: "Add no more than 10 minutes per week." },
    ],
  },
  {
    id: "demo_prog_mobility_reset",
    name: "Mobility Reset",
    title: "Mobility Reset",
    description:
      "Six weeks of short daily sessions for hips, thoracic spine and shoulders. Fifteen minutes, no equipment.",
    overview:
      "Built for people who sit for a living. Each session is short enough that skipping it is hard to justify, and the sequence changes every fortnight so the tissue keeps being asked something new.",
    goal: "Improve mobility",
    level: "Beginner",
    duration: "6 weeks",
    price: 0,
    discount_percentage: 0,
    equipment: "Mat",
    exercises: "Hip openers, thoracic rotations, shoulder CARs, breathing drills",
    coach_id: "demo_coach_leila",
    coach_recommendation:
      "Do it before training, not after. Mobility work is a warm-up that happens to have long-term effects.",
    schedule: [
      { day: "Daily", focus: "Full sequence", exercises: "90/90 hips, thoracic opener, shoulder CARs, diaphragmatic breathing", notes: "15 minutes. Every day beats 45 minutes twice a week." },
    ],
  },
  {
    id: "demo_prog_fat_loss_12",
    name: "Lean Twelve",
    title: "Lean Twelve",
    description:
      "Twelve weeks of resistance training and walking targets designed to lose fat while keeping the muscle you already have.",
    overview:
      "Three lifting sessions and a daily step target. The lifting is there to protect lean mass during a deficit; the steps are there because they are the most sustainable form of activity anyone has yet invented.",
    goal: "Lose fat",
    level: "Intermediate",
    duration: "12 weeks",
    price: 39,
    discount_percentage: 15,
    equipment: "Dumbbells, bench, resistance bands",
    exercises: "Goblet squat, dumbbell press, row, hinge, carries, walking",
    coach_id: "demo_coach_omar",
    coach_recommendation:
      "Keep the weights the same or heavier as the weeks pass. If your lifts are falling, the deficit is too aggressive.",
    schedule: [
      { day: "Day 1", focus: "Full body A", exercises: "Goblet squat, dumbbell bench, row, farmer carry", notes: "Leave two reps in reserve on every set." },
      { day: "Day 2", focus: "Full body B", exercises: "Romanian deadlift, incline press, lat pulldown, plank", notes: "" },
      { day: "Day 3", focus: "Full body C", exercises: "Split squat, overhead press, cable row, hip thrust", notes: "" },
    ],
  },
  {
    id: "demo_prog_boxing_basics",
    name: "Boxing Basics",
    title: "Boxing Basics",
    description:
      "Eight weeks of stance, footwork and the four core punches, with conditioning built around real three-minute rounds.",
    overview:
      "No sparring, no pressure. The goal is to leave with a stance you can hold under fatigue and a jab that goes out and comes back on the same line.",
    goal: "Learn boxing fundamentals",
    level: "Beginner",
    duration: "8 weeks",
    price: 35,
    discount_percentage: 0,
    equipment: "Wraps, gloves, skipping rope",
    exercises: "Jab, cross, hook, uppercut, footwork drills, rope work",
    coach_id: "demo_coach_nadia",
    coach_recommendation:
      "Spend the first three weeks almost entirely on footwork. Everyone wants to skip it and everyone who skips it plateaus.",
    schedule: [
      { day: "Day 1", focus: "Footwork + jab", exercises: "Stance holds, lateral steps, jab on the move, 6 rounds rope", notes: "" },
      { day: "Day 2", focus: "Combinations", exercises: "1-2, 1-2-3, pad rounds, conditioning finisher", notes: "" },
      { day: "Day 3", focus: "Conditioning", exercises: "Shadow boxing, rope intervals, core circuit", notes: "" },
    ],
  },
  {
    id: "demo_prog_crossfit_onramp",
    name: "CrossFit On-Ramp",
    title: "CrossFit On-Ramp",
    description:
      "Six weeks teaching the nine foundational movements properly before any of them get done fast.",
    overview:
      "Scaling is the skill this programme actually teaches. Every workout has three versions and you are expected to pick the one that keeps the movement clean, not the one that flatters your ego.",
    goal: "Learn CrossFit movements",
    level: "Beginner",
    duration: "6 weeks",
    price: 32,
    discount_percentage: 10,
    equipment: "Barbell, kettlebell, pull-up bar, box",
    exercises: "Air squat, front squat, overhead squat, press, push press, deadlift, kettlebell swing",
    coach_id: "demo_coach_karim",
    coach_recommendation:
      "If the movement breaks down, the workout is over. That is not a failure, that is the workout doing its job.",
    schedule: [
      { day: "Day 1", focus: "Squat series", exercises: "Air squat, front squat, overhead squat, short metcon", notes: "" },
      { day: "Day 2", focus: "Press series", exercises: "Shoulder press, push press, push jerk, accessory", notes: "" },
      { day: "Day 3", focus: "Hinge + conditioning", exercises: "Deadlift, kettlebell swing, box step-up, metcon", notes: "" },
    ],
  },
];


/** Programmes with their extra detail folded in. */
export const programs = programList.map((program) => ({
  ...program,
  ...(PROGRAM_EXTRAS[program.id] || {}),
}));

/** A few videos per coach, so coach profiles are not blank. */
export const videos = [
  { coach_id: "demo_coach_amine", title: "Fixing your squat depth", duration: "8:42", views: 12400, likes: 890 },
  { coach_id: "demo_coach_amine", title: "Deadlift setup in four cues", duration: "6:15", views: 9800, likes: 720 },
  { coach_id: "demo_coach_leila", title: "Ten-minute morning mobility", duration: "10:03", views: 21500, likes: 1840 },
  { coach_id: "demo_coach_leila", title: "Hip openers for lifters", duration: "12:27", views: 15200, likes: 1310 },
  { coach_id: "demo_coach_youssef", title: "How to pace your first 10K", duration: "7:31", views: 8600, likes: 640 },
  { coach_id: "demo_coach_sara", title: "Building a plate that works", duration: "9:18", views: 11300, likes: 980 },
  { coach_id: "demo_coach_karim", title: "Scaling a workout properly", duration: "11:44", views: 7400, likes: 520 },
  { coach_id: "demo_coach_nadia", title: "Footwork before power", duration: "9:56", views: 10100, likes: 830 },
  { coach_id: "demo_coach_omar", title: "In-season lifting for athletes", duration: "13:02", views: 6300, likes: 470 },
  { coach_id: "demo_coach_ines", title: "Breathing to down-regulate", duration: "8:09", views: 13700, likes: 1150 },
];

export const THUMBNAILS = [
  "photo-1534438327276-14e5300c3a48",
  "photo-1571019613454-1cb2f99b2d8b",
  "photo-1517836357463-d25dfeac3438",
  "photo-1518611012118-696072aa579a",
  "photo-1544367567-0f2fcb009e0b",
];
