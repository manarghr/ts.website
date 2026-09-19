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

const wide = (id) => `https://images.unsplash.com/${id}?w=1200&h=675&fit=crop`;

export const programs = [
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

export const blogs = [
  {
    id: "demo_blog_easy_days",
    title: "Your easy days are too hard",
    excerpt:
      "The most common mistake in amateur endurance training is running every session at the same moderately uncomfortable pace. Here is why that caps your progress.",
    author: "Youssef Haddad",
    category: "Running",
    readTime: "6 min read",
    image: wide("photo-1461896836934-ffe607ba8211"),
    sections: [
      {
        heading: "The grey zone",
        content:
          "There is a pace that feels productive: hard enough to feel like training, easy enough to sustain. Almost every self-coached runner gravitates to it, and almost every coached runner is pulled away from it. It is too hard to allow recovery and too easy to drive real adaptation, so it delivers neither.",
      },
      {
        heading: "What easy actually means",
        content:
          "Easy means you can speak in full sentences. Not gasped fragments between breaths -- sentences. For most people starting out, that pace feels insultingly slow, and the instinct is to assume it cannot possibly be doing anything. It is building the aerobic base that every faster session draws on.",
      },
      {
        heading: "Making the change",
        content:
          "Take two of your three weekly runs and slow them until conversation is comfortable. Keep one hard session and make it genuinely hard. Give it six weeks before judging the result -- aerobic adaptations are slow and the first fortnight mostly feels like going backwards.",
      },
    ],
  },
  {
    id: "demo_blog_form_check",
    title: "What a camera can and cannot tell you about your form",
    excerpt:
      "Pose estimation is a useful mirror, not a physiotherapist. A look at what joint-angle analysis actually measures, and where it goes blind.",
    author: "Amine Belkacem",
    category: "Technique",
    readTime: "8 min read",
    image: wide("photo-1534438327276-14e5300c3a48"),
    sections: [
      {
        heading: "What it measures",
        content:
          "A pose model finds your joints in the frame and measures the angles between them. For a squat that means hip, knee and ankle: the angle at the knee tells you how deep you went, and that is genuinely useful feedback delivered instantly, which no human coach can match for frequency.",
      },
      {
        heading: "What it misses",
        content:
          "It sees a flat, two-dimensional picture. Rotation toward or away from the lens is invisible to it, so a knee that caves inward or a spine that rounds away from the camera can pass unnoticed. It also knows nothing about your injuries, your proportions, or what a physiotherapist told you last month.",
      },
      {
        heading: "Use it as feedback, not permission",
        content:
          "A good score is not proof that a movement is safe for your body, and a poor one is not proof that something is wrong. Treat it the way you would treat a mirror: useful information, interpreted by you.",
      },
    ],
  },
  {
    id: "demo_blog_protein",
    title: "How much protein do you actually need?",
    excerpt:
      "Between the supplement industry and the internet, the number has drifted a long way from the evidence. A practical answer.",
    author: "Sara Mansouri",
    category: "Nutrition",
    readTime: "7 min read",
    image: wide("photo-1490645935967-10de6ba17061"),
    sections: [
      {
        heading: "The range that matters",
        content:
          "For people training regularly, the evidence clusters around 1.6 to 2.2 grams per kilogram of bodyweight per day. Below that range you leave adaptation on the table. Above it, the additional benefit is small enough to be hard to measure.",
      },
      {
        heading: "Distribution matters less than total",
        content:
          "The idea that the body can only absorb thirty grams at a sitting has been overstated for years. Total daily intake is what drives the outcome. Spreading it across meals is convenient and probably marginally better, but it is a refinement, not a requirement.",
      },
      {
        heading: "Practical targets",
        content:
          "A 70kg person training four times a week needs roughly 110 to 150 grams a day. That is achievable with ordinary food: eggs at breakfast, a protein source at lunch and dinner, and dairy or legumes filling the gaps. Powder is a convenience, not a necessity.",
      },
    ],
  },
  {
    id: "demo_blog_deload",
    title: "The deload week you keep skipping",
    excerpt:
      "Planned recovery is not lost training. It is the week where the previous three weeks finally turn into something.",
    author: "Omar Fathi",
    category: "Programming",
    readTime: "5 min read",
    image: wide("photo-1517836357463-d25dfeac3438"),
    sections: [
      {
        heading: "Why it feels wrong",
        content:
          "Cutting volume deliberately feels like going backwards, particularly when the weights are still moving. That is exactly when it works best -- a deload taken before you need it costs you nothing, and one taken after you needed it costs weeks.",
      },
      {
        heading: "What to cut",
        content:
          "Cut volume, keep intensity. Roughly half the usual number of sets at close to the usual load keeps the movement patterns sharp while letting accumulated fatigue drain away. Dropping the weight instead tends to leave you feeling flat rather than fresh.",
      },
    ],
  },
  {
    id: "demo_blog_desk_shoulders",
    title: "Undoing desk shoulders in fifteen minutes a day",
    excerpt:
      "Eight hours at a keyboard does predictable things to a thoracic spine. The fix is unglamorous and it works.",
    author: "Inès Bouraoui",
    category: "Mobility",
    readTime: "6 min read",
    image: wide("photo-1544367567-0f2fcb009e0b"),
    sections: [
      {
        heading: "The pattern",
        content:
          "Rounded upper back, shoulders drawn forward, neck compensating for both. It is not a moral failing or a posture problem to be fixed by sitting up straight -- it is tissue adapting to the position it spends most of its time in.",
      },
      {
        heading: "The daily fifteen",
        content:
          "Thoracic extension over a foam roller, shoulder controlled articular rotations, a doorway pec stretch and two minutes of diaphragmatic breathing. Every day, before training rather than after. Consistency matters far more than the specific sequence.",
      },
    ],
  },
  {
    id: "demo_blog_first_month",
    title: "What to expect in your first month of lifting",
    excerpt:
      "Rapid progress, sore legs, and a lot of numbers that will never move that fast again. A realistic timeline.",
    author: "Karim Ziani",
    category: "Beginner",
    readTime: "7 min read",
    image: wide("photo-1571019613454-1cb2f99b2d8b"),
    sections: [
      {
        heading: "Weeks one and two",
        content:
          "Almost all early progress is neurological. You are not building much muscle yet; you are learning to recruit what you already have. This is why the numbers climb so quickly and why that rate is not sustainable.",
      },
      {
        heading: "Weeks three and four",
        content:
          "Soreness settles, sessions start feeling routine, and the first plateau appears. This is the point where most people either add a structured programme or quietly stop. Adding structure is the better option.",
      },
    ],
  },
];

export const meals = [
  {
    id: "demo_meal_oats",
    name: "Overnight oats with berries",
    description: "Five minutes the night before, a complete breakfast in the morning. High fibre, decent protein, no cooking.",
    image: wide("photo-1517673132405-a56a62b18caf"),
    mealType: "breakfast",
    goal: "muscle-gain",
    calories: 420,
    protein: 24,
    carbs: 58,
    fats: 11,
    fiber: 9,
    prepTime: "5 min + overnight",
    servings: 1,
    difficulty: "Easy",
    equipment: "Jar or bowl",
    ingredients: ["Rolled oats", "Greek yoghurt", "Milk", "Mixed berries", "Honey", "Chia seeds"],
    detailedIngredients: [
      "60g rolled oats",
      "150g Greek yoghurt",
      "120ml milk",
      "80g mixed berries",
      "1 tsp honey",
      "1 tbsp chia seeds",
    ],
    steps: [
      "Combine the oats, yoghurt, milk and chia seeds in a jar and stir well.",
      "Cover and refrigerate overnight, or for at least six hours.",
      "In the morning, top with berries and honey.",
    ],
    tips: "Make three jars at once on Sunday. The texture is best between day one and day three.",
    nutritionDetails: "Roughly a third of the day's fibre target in one bowl, and enough protein to make it to lunch without grazing.",
  },
  {
    id: "demo_meal_chicken_bowl",
    name: "Chicken and rice bowl",
    description: "The unglamorous staple of anyone who lifts. Fast, filling and easy to scale up or down.",
    image: wide("photo-1512621776951-a57141f2eefd"),
    mealType: "lunch",
    goal: "muscle-gain",
    calories: 610,
    protein: 48,
    carbs: 62,
    fats: 16,
    fiber: 7,
    prepTime: "25 min",
    servings: 2,
    difficulty: "Easy",
    equipment: "Pan, saucepan",
    ingredients: ["Chicken breast", "Basmati rice", "Broccoli", "Olive oil", "Garlic", "Lemon", "Paprika"],
    detailedIngredients: [
      "300g chicken breast",
      "150g basmati rice, uncooked",
      "200g broccoli florets",
      "1 tbsp olive oil",
      "2 cloves garlic",
      "Half a lemon",
      "1 tsp paprika",
    ],
    steps: [
      "Cook the rice according to the packet instructions.",
      "Season the chicken with paprika, salt and pepper, and pan-fry over medium heat for 6-7 minutes per side.",
      "Steam the broccoli for four minutes so it keeps some bite.",
      "Rest the chicken for five minutes before slicing, then assemble with a squeeze of lemon.",
    ],
    tips: "Cook double the rice and chicken. The second portion is tomorrow's lunch and takes ninety seconds to reheat.",
    nutritionDetails: "Around 48g of protein per serving, which covers roughly a third of a 70kg lifter's daily target.",
  },
  {
    id: "demo_meal_salmon",
    name: "Baked salmon with sweet potato",
    description: "One tray, forty minutes, almost no washing up. Omega-3s and slow carbohydrate in the same dish.",
    image: wide("photo-1467003909585-2f8a72700288"),
    mealType: "dinner",
    goal: "general-health",
    calories: 560,
    protein: 38,
    carbs: 44,
    fats: 24,
    fiber: 8,
    prepTime: "40 min",
    servings: 2,
    difficulty: "Easy",
    equipment: "Oven, baking tray",
    ingredients: ["Salmon fillets", "Sweet potato", "Asparagus", "Olive oil", "Lemon", "Dill"],
    detailedIngredients: [
      "2 salmon fillets, about 150g each",
      "400g sweet potato, cubed",
      "200g asparagus",
      "2 tbsp olive oil",
      "1 lemon",
      "Fresh dill",
    ],
    steps: [
      "Heat the oven to 200C. Toss the sweet potato in oil and roast for 20 minutes.",
      "Add the salmon and asparagus to the tray and return for 12-15 minutes.",
      "Finish with lemon and dill.",
    ],
    tips: "The salmon is done when it flakes under light pressure. Overcooked salmon is the most common way to ruin this.",
    nutritionDetails: "A good source of omega-3 fatty acids, which most people training regularly under-consume.",
  },
  {
    id: "demo_meal_lentil",
    name: "Lentil and spinach stew",
    description: "Cheap, vegetarian, and genuinely high in protein for a plant-based meal. Better on day two.",
    image: wide("photo-1547592166-23ac45744acd"),
    mealType: "dinner",
    goal: "fat-loss",
    calories: 390,
    protein: 22,
    carbs: 54,
    fats: 8,
    fiber: 16,
    prepTime: "35 min",
    servings: 4,
    difficulty: "Easy",
    equipment: "Large pot",
    ingredients: ["Red lentils", "Spinach", "Onion", "Garlic", "Cumin", "Tinned tomatoes", "Vegetable stock"],
    detailedIngredients: [
      "300g red lentils",
      "200g spinach",
      "1 onion",
      "3 cloves garlic",
      "2 tsp cumin",
      "1 tin chopped tomatoes",
      "800ml vegetable stock",
    ],
    steps: [
      "Soften the onion and garlic in a large pot for five minutes.",
      "Add the cumin, lentils, tomatoes and stock, and simmer for 25 minutes.",
      "Stir the spinach through at the end until it wilts.",
    ],
    tips: "16g of fibre per serving is a lot if you are not used to it. Introduce it gradually.",
    nutritionDetails: "High fibre and high satiety for under 400 calories, which makes it useful in a deficit.",
  },
  {
    id: "demo_meal_eggs",
    name: "Shakshuka",
    description: "Eggs poached in spiced tomato. A weekend breakfast that takes one pan and twenty-five minutes.",
    image: wide("photo-1590412200988-a436970781fa"),
    mealType: "breakfast",
    goal: "general-health",
    calories: 380,
    protein: 22,
    carbs: 24,
    fats: 22,
    fiber: 6,
    prepTime: "25 min",
    servings: 2,
    difficulty: "Medium",
    equipment: "Frying pan with lid",
    ingredients: ["Eggs", "Tinned tomatoes", "Red pepper", "Onion", "Paprika", "Cumin", "Feta"],
    detailedIngredients: [
      "4 eggs",
      "1 tin chopped tomatoes",
      "1 red pepper",
      "1 onion",
      "1 tsp smoked paprika",
      "1 tsp cumin",
      "50g feta",
    ],
    steps: [
      "Soften the onion and pepper for 8 minutes.",
      "Add the spices and tomatoes and simmer for 10 minutes until thickened.",
      "Make four wells, crack in the eggs, cover and cook for 6-8 minutes until the whites set.",
      "Crumble feta over the top.",
    ],
    tips: "Keep the heat low once the eggs go in. Rushing gives you rubbery whites and raw yolks.",
    nutritionDetails: "Eggs provide complete protein and choline; the tomato base adds lycopene and fibre.",
  },
  {
    id: "demo_meal_smoothie",
    name: "Post-training smoothie",
    description: "Liquid calories for when you finish training with no appetite. Thirty seconds to make.",
    image: wide("photo-1505252585461-04db1eb84625"),
    mealType: "snack",
    goal: "muscle-gain",
    calories: 450,
    protein: 32,
    carbs: 56,
    fats: 10,
    fiber: 6,
    prepTime: "3 min",
    servings: 1,
    difficulty: "Easy",
    equipment: "Blender",
    ingredients: ["Banana", "Whey or soy protein", "Oats", "Milk", "Peanut butter"],
    detailedIngredients: [
      "1 banana",
      "30g protein powder",
      "40g oats",
      "300ml milk",
      "1 tbsp peanut butter",
    ],
    steps: ["Put everything in the blender.", "Blend for thirty seconds.", "Drink within the hour."],
    tips: "Freeze the banana in advance. It changes the texture completely and costs nothing.",
    nutritionDetails: "Carbohydrate and protein together, in a form that is easy to get down when solid food is unappealing.",
  },
  {
    id: "demo_meal_salad",
    name: "Tuna and white bean salad",
    description: "A no-cook lunch built from tins. Ready in six minutes and holds up in a lunchbox.",
    image: wide("photo-1512852939750-1305098529bf"),
    mealType: "lunch",
    goal: "fat-loss",
    calories: 340,
    protein: 34,
    carbs: 28,
    fats: 9,
    fiber: 11,
    prepTime: "6 min",
    servings: 1,
    difficulty: "Easy",
    equipment: "Bowl",
    ingredients: ["Tinned tuna", "Cannellini beans", "Red onion", "Rocket", "Lemon", "Olive oil"],
    detailedIngredients: [
      "1 tin tuna in spring water",
      "150g cannellini beans, drained",
      "Quarter red onion, sliced thin",
      "Handful of rocket",
      "Half a lemon",
      "1 tsp olive oil",
    ],
    steps: [
      "Drain the tuna and beans.",
      "Combine everything in a bowl and dress with lemon and oil.",
      "Season and eat.",
    ],
    tips: "Soak the sliced onion in cold water for five minutes to take the harsh edge off it.",
    nutritionDetails: "34g of protein and 11g of fibre for 340 calories -- one of the better satiety-per-calorie ratios here.",
  },
  {
    id: "demo_meal_curry",
    name: "Chickpea and spinach curry",
    description: "A weeknight curry from store-cupboard ingredients. Freezes well in single portions.",
    image: wide("photo-1565557623262-b51c2513a641"),
    mealType: "dinner",
    goal: "general-health",
    calories: 470,
    protein: 19,
    carbs: 62,
    fats: 16,
    fiber: 14,
    prepTime: "30 min",
    servings: 4,
    difficulty: "Easy",
    equipment: "Large pan",
    ingredients: ["Chickpeas", "Spinach", "Coconut milk", "Curry paste", "Onion", "Rice"],
    detailedIngredients: [
      "2 tins chickpeas",
      "200g spinach",
      "1 tin light coconut milk",
      "2 tbsp curry paste",
      "1 onion",
      "300g rice",
    ],
    steps: [
      "Soften the onion, then fry the curry paste for a minute until fragrant.",
      "Add the chickpeas and coconut milk and simmer for 15 minutes.",
      "Stir the spinach through and serve with rice.",
    ],
    tips: "Frying the paste before adding liquid makes a noticeable difference. Do not skip it.",
    nutritionDetails: "14g of fibre per serving, and it costs very little per portion.",
  },
];

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
