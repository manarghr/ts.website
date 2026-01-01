"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Clock,
  Flame,
  ChefHat,
  Heart,
  ArrowLeft,
  Users,
  Timer,
  UtensilsCrossed,
  Apple,
  Beef,
  Wheat,
  Award,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function MealPost({ postId }) {
  const router = useRouter();
  const [meal, setMeal] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("ingredients");

  // Recipe details for each meal 
  const mealRecipes = {
    1: {
      servings: 2,
      difficulty: "Easy",
      totalTime: "5 min prep + overnight",
      steps: [
        "In a mason jar or bowl, combine rolled oats with your choice of milk",
        "Add protein powder and mix well until no clumps remain",
        "Stir in Greek yogurt for extra creaminess and protein",
        "Add a drizzle of honey for natural sweetness",
        "Cover and refrigerate overnight (or at least 4 hours)",
        "In the morning, top with fresh berries and sliced almonds",
        "Optional: Add extra milk if you prefer a thinner consistency",
        "Enjoy cold or heat in microwave for 30-60 seconds"
      ],
      nutritionDetails: {
        calories: 420,
        protein: 28,
        carbs: 45,
        fats: 12,
        fiber: 8,
        sugar: 12,
        sodium: 180
      },
      tips: [
        "Prepare multiple jars on Sunday for the whole week",
        "Use vanilla or chocolate protein powder for variety",
        "Add chia seeds for extra omega-3s and fiber",
        "Experiment with different fruit toppings each day"
      ],
      equipment: ["Mason jar or bowl", "Measuring cups", "Spoon", "Refrigerator"],
      detailedIngredients: [
        { item: "Rolled oats", amount: "1/2 cup", notes: "Old-fashioned oats work best" },
        { item: "Greek yogurt", amount: "1/2 cup", notes: "Plain or vanilla" },
        { item: "Protein powder", amount: "1 scoop", notes: "Your favorite flavor" },
        { item: "Mixed berries", amount: "1/2 cup", notes: "Fresh or frozen" },
        { item: "Almonds", amount: "2 tbsp", notes: "Sliced or chopped" },
        { item: "Honey", amount: "1 tbsp", notes: "Or maple syrup" },
        { item: "Milk of choice", amount: "1/2 cup", notes: "Almond, oat, or regular" }
      ]
    },
    5: {
      servings: 1,
      difficulty: "Easy",
      totalTime: "20 minutes",
      steps: [
        "Season chicken breast with salt, pepper, and your favorite herbs",
        "Heat grill or grill pan over medium-high heat",
        "Grill chicken for 6-7 minutes per side until internal temperature reaches 165°F",
        "While chicken cooks, wash and chop mixed greens",
        "Slice cucumber and halve cherry tomatoes",
        "Remove chicken from heat and let rest for 5 minutes",
        "Slice chicken into strips and arrange over greens",
        "Add cucumber and tomatoes, drizzle with olive oil and fresh lemon juice",
        "Season with salt, pepper, and optional herbs"
      ],
      nutritionDetails: {
        calories: 320,
        protein: 35,
        carbs: 15,
        fats: 12,
        fiber: 8,
        sugar: 6,
        sodium: 420
      },
      tips: [
        "Marinate chicken for 30 minutes for extra flavor",
        "Use a meat thermometer to ensure chicken is fully cooked",
        "Add feta cheese for extra protein and flavor",
        "Prep chicken in advance for quick assembly"
      ],
      equipment: ["Grill or grill pan", "Tongs", "Cutting board", "Knife", "Large bowl", "Meat thermometer"],
      detailedIngredients: [
        { item: "Chicken breast", amount: "6 oz", notes: "Boneless, skinless" },
        { item: "Mixed greens", amount: "3 cups", notes: "Spinach, arugula, romaine" },
        { item: "Cucumber", amount: "1 medium", notes: "Sliced" },
        { item: "Cherry tomatoes", amount: "1 cup", notes: "Halved" },
        { item: "Olive oil", amount: "1 tbsp", notes: "Extra virgin" },
        { item: "Lemon", amount: "1/2", notes: "Fresh squeezed" },
        { item: "Salt & pepper", amount: "to taste", notes: "" },
        { item: "Herbs", amount: "optional", notes: "Basil, oregano, or parsley" }
      ]
    },
    9: {
      servings: 2,
      difficulty: "Medium",
      totalTime: "25 minutes",
      steps: [
        "Preheat oven to 400°F (200°C)",
        "Line a baking sheet with parchment paper",
        "Pat salmon fillets dry and season with salt, pepper, and garlic powder",
        "Place salmon on one side of the baking sheet",
        "Toss asparagus spears with olive oil, salt, and pepper",
        "Arrange asparagus next to salmon",
        "Cut sweet potato into wedges, toss with olive oil and place on sheet",
        "Drizzle salmon with olive oil and add lemon slices on top",
        "Bake for 15-18 minutes until salmon flakes easily with a fork",
        "Remove from oven and let rest for 2 minutes",
        "Squeeze fresh lemon over everything before serving"
      ],
      nutritionDetails: {
        calories: 380,
        protein: 32,
        carbs: 20,
        fats: 18,
        fiber: 6,
        sugar: 4,
        sodium: 340
      },
      tips: [
        "Don't overcook salmon - it should be slightly pink in the center",
        "Use wild-caught salmon for better omega-3 content",
        "Add a honey glaze for a sweet variation",
        "Leftover salmon is perfect for salads the next day"
      ],
      equipment: ["Baking sheet", "Parchment paper", "Knife", "Cutting board", "Mixing bowl"],
      detailedIngredients: [
        { item: "Salmon fillet", amount: "8 oz", notes: "Wild-caught preferred" },
        { item: "Asparagus", amount: "1 bunch", notes: "Woody ends trimmed" },
        { item: "Sweet potato", amount: "1 medium", notes: "Cut into wedges" },
        { item: "Lemon", amount: "1", notes: "Sliced" },
        { item: "Garlic", amount: "2 cloves", notes: "Minced" },
        { item: "Olive oil", amount: "2 tbsp", notes: "Divided" },
        { item: "Salt & pepper", amount: "to taste", notes: "" }
      ]
    },
    10: {
      servings: 4,
      difficulty: "Medium",
      totalTime: "35 minutes",
      steps: [
        "Cook whole wheat pasta according to package directions, drain and set aside",
        "In a bowl, combine ground turkey with breadcrumbs, egg, minced garlic, and Italian herbs",
        "Season with salt and pepper, mix until just combined",
        "Form mixture into golf ball-sized meatballs (should make about 16)",
        "Heat olive oil in a large skillet over medium heat",
        "Brown meatballs on all sides, about 8-10 minutes total",
        "Add marinara sauce to the skillet, reduce heat to low",
        "Cover and simmer for 15 minutes until meatballs are cooked through",
        "Toss pasta with a bit of sauce",
        "Serve meatballs and sauce over pasta",
        "Garnish with fresh basil and grated Parmesan cheese"
      ],
      nutritionDetails: {
        calories: 580,
        protein: 42,
        carbs: 68,
        fats: 14,
        fiber: 8,
        sugar: 8,
        sodium: 620
      },
      tips: [
        "Don't overmix the meat mixture to keep meatballs tender",
        "Bake meatballs at 400°F instead of pan-frying for easier cleanup",
        "Make extra and freeze for quick future meals",
        "Add red pepper flakes for a spicy kick"
      ],
      equipment: ["Large pot", "Large skillet", "Mixing bowl", "Wooden spoon", "Measuring cups"],
      detailedIngredients: [
        { item: "Ground turkey", amount: "1 lb", notes: "93% lean" },
        { item: "Whole wheat pasta", amount: "12 oz", notes: "Penne or spaghetti" },
        { item: "Marinara sauce", amount: "24 oz", notes: "Your favorite brand" },
        { item: "Breadcrumbs", amount: "1/2 cup", notes: "Italian style" },
        { item: "Egg", amount: "1 large", notes: "" },
        { item: "Parmesan", amount: "1/2 cup", notes: "Grated, plus more for serving" },
        { item: "Basil", amount: "1/4 cup", notes: "Fresh, chopped" },
        { item: "Garlic", amount: "3 cloves", notes: "Minced" },
        { item: "Italian herbs", amount: "1 tsp", notes: "Dried" },
        { item: "Olive oil", amount: "2 tbsp", notes: "" }
      ]
    },
    13: {
      servings: 1,
      difficulty: "Very Easy",
      totalTime: "2 minutes",
      steps: [
        "Scoop Greek yogurt into a bowl",
        "Wash and dry mixed berries (strawberries, blueberries, raspberries)",
        "If using strawberries, slice them",
        "Arrange berries on top of yogurt",
        "Drizzle with honey",
        "Top with sliced or chopped almonds",
        "Optional: add a sprinkle of granola for extra crunch",
        "Enjoy immediately!"
      ],
      nutritionDetails: {
        calories: 150,
        protein: 15,
        carbs: 20,
        fats: 2,
        fiber: 4,
        sugar: 15,
        sodium: 60
      },
      tips: [
        "Use full-fat Greek yogurt for more satiety",
        "Freeze berries for a thicker, ice cream-like texture",
        "Add chia seeds for extra omega-3s",
        "This makes a great post-workout snack"
      ],
      equipment: ["Bowl", "Spoon"],
      detailedIngredients: [
        { item: "Greek yogurt", amount: "1 cup", notes: "Plain, non-fat or 2%" },
        { item: "Mixed berries", amount: "1/2 cup", notes: "Fresh or frozen" },
        { item: "Honey", amount: "1 tsp", notes: "Raw honey preferred" },
        { item: "Almonds", amount: "1 tbsp", notes: "Sliced" }
      ]
    },
    14: {
      servings: 12,
      difficulty: "Easy",
      totalTime: "10 minutes + chill time",
      steps: [
        "Add pitted dates to food processor and pulse until broken down",
        "Add almonds and pulse until coarsely chopped",
        "Add protein powder, cocoa powder, and shredded coconut",
        "Pulse until mixture sticks together when pressed",
        "If too dry, add 1 tbsp water or almond butter at a time",
        "If too wet, add more protein powder or coconut",
        "Scoop mixture and roll into 12 balls using your hands",
        "Roll balls in extra coconut, cocoa powder, or crushed nuts (optional)",
        "Place on a plate and refrigerate for at least 30 minutes to firm up",
        "Store in an airtight container in the fridge for up to 2 weeks"
      ],
      nutritionDetails: {
        calories: 220,
        protein: 18,
        carbs: 18,
        fats: 10,
        fiber: 5,
        sugar: 12,
        sodium: 45
      },
      tips: [
        "Make a big batch and freeze for grab-and-go snacks",
        "Use vanilla protein powder for a sweeter taste",
        "Add mini chocolate chips for extra indulgence",
        "Perfect pre or post-workout fuel"
      ],
      equipment: ["Food processor", "Measuring cups", "Plate", "Airtight container"],
      detailedIngredients: [
        { item: "Protein powder", amount: "1 cup", notes: "Vanilla or chocolate" },
        { item: "Dates", amount: "1 cup", notes: "Pitted, Medjool preferred" },
        { item: "Almonds", amount: "1 cup", notes: "Raw or roasted" },
        { item: "Shredded coconut", amount: "1/2 cup", notes: "Unsweetened" },
        { item: "Cocoa powder", amount: "3 tbsp", notes: "Unsweetened" },
        { item: "Almond butter", amount: "1-2 tbsp", notes: "If needed for binding" }
      ]
    }
  };

  // Default meals (ADD YOUR DEFAULT MEALS HERE)
  const defaultMeals = [
        {
          id: 1,
          name: "Protein Overnight Oats",
          mealType: "breakfast",
          goal: "muscle-gain",
          calories: 420,
          protein: 28,
          carbs: 45,
          fats: 12,
          fiber: 8,
          ingredients: ["Rolled oats", "Greek yogurt", "Protein powder", "Berries", "Almonds", "Honey"],
          image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800",
          prepTime: "5 min",
          description: "High-protein breakfast to fuel your morning workout"
        },
        {
          id: 5,
          name: "Grilled Chicken Salad",
          mealType: "lunch",
          goal: "lose-weight",
          calories: 320,
          protein: 35,
          carbs: 15,
          fats: 12,
          fiber: 8,
          ingredients: ["Chicken breast", "Mixed greens", "Cucumber", "Cherry tomatoes", "Olive oil", "Lemon"],
          image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
          prepTime: "20 min",
          description: "Lean protein with fresh vegetables"
        },
        {
          id: 9,
          name: "Baked Salmon with Vegetables",
          mealType: "dinner",
          goal: "lose-weight",
          calories: 380,
          protein: 32,
          carbs: 20,
          fats: 18,
          fiber: 6,
          ingredients: ["Salmon fillet", "Asparagus", "Sweet potato", "Lemon", "Garlic", "Olive oil"],
          image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800",
          prepTime: "25 min",
          description: "Omega-3 rich dinner option"
        },
        {
          id: 10,
          name: "Turkey Meatballs with Pasta",
          mealType: "dinner",
          goal: "muscle-gain",
          calories: 580,
          protein: 42,
          carbs: 68,
          fats: 14,
          fiber: 8,
          ingredients: ["Ground turkey", "Whole wheat pasta", "Marinara sauce", "Parmesan", "Basil", "Garlic"],
          image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800",
          prepTime: "35 min",
          description: "High-protein dinner for recovery"
        },
        {
          id: 13,
          name: "Greek Yogurt with Berries",
          mealType: "snacks",
          goal: "lose-weight",
          calories: 150,
          protein: 15,
          carbs: 20,
          fats: 2,
          fiber: 4,
          ingredients: ["Greek yogurt", "Mixed berries", "Honey", "Almonds"],
          image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800",
          prepTime: "2 min",
          description: "Low-calorie protein snack"
        },
        {
          id: 14,
          name: "Protein Energy Balls",
          mealType: "snacks",
          goal: "muscle-gain",
          calories: 220,
          protein: 18,
          carbs: 18,
          fats: 10,
          fiber: 5,
          ingredients: ["Protein powder", "Dates", "Almonds", "Coconut", "Cocoa powder"],
          image: "https://images.unsplash.com/photo-1616663040245-0c5e0c0c8c8c?w=800",
          prepTime: "10 min",
          description: "High-protein pre/post workout snack"
        }
      ];

  useEffect(() => {
    // Load meal data from localStorage or default meals
    const loadMeal = () => {
      // Try to find meal in admin meals first
      const adminMeals = localStorage.getItem("admin_meals");
      let allMeals = defaultMeals;
      
      if (adminMeals) {
        try {
          const parsedAdminMeals = JSON.parse(adminMeals);
          allMeals = [...parsedAdminMeals, ...defaultMeals];
        } catch (error) {
          console.error("Error parsing admin meals:", error);
        }
      }

      const foundMeal = allMeals.find(m => m.id === parseInt(postId));
      
      if (foundMeal) {
        setMeal({
          ...foundMeal,
          recipe: mealRecipes[foundMeal.id] || null
        });
      }
    };

    loadMeal();

    // Check if meal is favorited
    const currentUser = localStorage.getItem("trainsight_current_user");
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        const favorites = userData.favoriteMeals || [];
        setIsFavorite(favorites.some(f => f.id === parseInt(postId)));
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    }
  }, [postId]);

  const toggleFavorite = () => {
    if (typeof window === "undefined") return;
    
    const currentUser = localStorage.getItem("trainsight_current_user");
    if (!currentUser) {
      alert("Please login to favorite meals");
      return;
    }

    const userData = JSON.parse(currentUser);
    const favorites = userData.favoriteMeals || [];
    const mealIndex = favorites.findIndex(f => f.id === meal.id);

    let updatedFavorites;
    if (mealIndex >= 0) {
      updatedFavorites = favorites.filter(f => f.id !== meal.id);
      setIsFavorite(false);
    } else {
      updatedFavorites = [...favorites, {
        ...meal,
        likedAt: new Date().toISOString(),
        comment: ""
      }];
      setIsFavorite(true);
    }

    const updatedUser = {
      ...userData,
      favoriteMeals: updatedFavorites
    };

    localStorage.setItem("trainsight_current_user", JSON.stringify(updatedUser));
    
    const users = JSON.parse(localStorage.getItem("trainsight_users") || "[]");
    const updatedUsers = users.map(u => u.id === userData.id ? updatedUser : u);
    localStorage.setItem("trainsight_users", JSON.stringify(updatedUsers));

    window.dispatchEvent(new Event("userUpdated"));
  };

  if (!meal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Meal not found</h2>
          <p className="text-gray-500 mb-4">The recipe you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push("/services/meals")}
            className="px-6 py-3 bg-[#6BB371] text-white rounded-lg hover:bg-[#52796F] transition-colors"
          >
            Back to Meals
          </button>
        </div>
      </div>
    );
  }

  const recipe = meal.recipe;
  const hasRecipe = recipe !== null;

  const goalColors = {
    "lose-weight": { bg: "from-orange-500 to-red-500", text: "text-orange-600", icon: Flame },
    "gain-weight": { bg: "from-green-500 to-emerald-500", text: "text-green-600", icon: Apple },
    "muscle-gain": { bg: "from-purple-500 to-indigo-500", text: "text-purple-600", icon: Beef },
    "maintenance": { bg: "from-blue-500 to-cyan-500", text: "text-blue-600", icon: UtensilsCrossed }
  };

  const goalInfo = goalColors[meal.goal] || goalColors["maintenance"];
  const GoalIcon = goalInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${meal.image})`,
            filter: "brightness(0.7)"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex flex-col justify-between py-8">
          <button
            onClick={() => router.push("/services/meals")}
            className="flex items-center gap-2 text-white hover:text-[#6BB371] transition-colors w-fit group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Meals</span>
          </button>

          <div className="text-white">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${goalInfo.bg} capitalize`}>
                {meal.goal.replace("-", " ")}
              </span>
              <span className="px-4 py-2 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-md capitalize">
                {meal.mealType}
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">{meal.name}</h1>
            <p className="text-xl text-white/90 max-w-2xl">{meal.description}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg text-center border-2 border-gray-100"
          >
            <Clock className="w-8 h-8 text-[#6BB371] mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#354F52]">{meal.prepTime}</div>
            <div className="text-sm text-gray-600">Prep Time</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg text-center border-2 border-gray-100"
          >
            <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#354F52]">{meal.calories}</div>
            <div className="text-sm text-gray-600">Calories</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-lg text-center border-2 border-gray-100"
          >
            <Beef className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#354F52]">{meal.protein}g</div>
            <div className="text-sm text-gray-600">Protein</div>
          </motion.div>

          {hasRecipe && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl p-6 shadow-lg text-center border-2 border-gray-100"
              >
                <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#354F52]">{recipe.servings}</div>
                <div className="text-sm text-gray-600">Servings</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl p-6 shadow-lg text-center border-2 border-gray-100"
              >
                <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#354F52]">{recipe.difficulty}</div>
                <div className="text-sm text-gray-600">Difficulty</div>
              </motion.div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recipe Details */}
          <div className="lg:col-span-2">
            {hasRecipe ? (
              <>
                {/* Tabs */}
                <div className="flex gap-2 mb-6 bg-gray-100 p-2 rounded-xl">
                  <button
                    onClick={() => setActiveTab("ingredients")}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                      activeTab === "ingredients"
                        ? "bg-white text-[#354F52] shadow-md"
                        : "text-gray-600 hover:text-[#354F52]"
                    }`}
                  >
                    Ingredients
                  </button>
                  <button
                    onClick={() => setActiveTab("instructions")}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                      activeTab === "instructions"
                        ? "bg-white text-[#354F52] shadow-md"
                        : "text-gray-600 hover:text-[#354F52]"
                    }`}
                  >
                    Instructions
                  </button>
                  <button
                    onClick={() => setActiveTab("equipment")}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                      activeTab === "equipment"
                        ? "bg-white text-[#354F52] shadow-md"
                        : "text-gray-600 hover:text-[#354F52]"
                    }`}
                  >
                    Equipment
                  </button>
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-gray-100">
                  {activeTab === "ingredients" && (
                    <div>
                      <h2 className="text-2xl font-bold text-[#354F52] mb-6 flex items-center gap-2">
                        <Apple className="w-6 h-6 text-[#6BB371]" />
                        Ingredients
                      </h2>
                      <div className="space-y-3">
                        {recipe.detailedIngredients.map((ingredient, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <CheckCircle2 className="w-5 h-5 text-[#6BB371] mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-baseline gap-2">
                                <span className="font-semibold text-[#354F52]">{ingredient.amount}</span>
                                <span className="text-gray-700">{ingredient.item}</span>
                              </div>
                              {ingredient.notes && (
                                <p className="text-sm text-gray-500 mt-1">{ingredient.notes}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "instructions" && (
                    <div>
                      <h2 className="text-2xl font-bold text-[#354F52] mb-6 flex items-center gap-2">
                        <ChefHat className="w-6 h-6 text-[#6BB371]" />
                        Instructions
                      </h2>
                      <div className="space-y-4">
                        {recipe.steps.map((step, index) => (
                          <div key={index} className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#6BB371] to-[#52796F] text-white flex items-center justify-center font-bold">
                              {index + 1}
                            </div>
                            <p className="text-gray-700 pt-1 flex-1">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "equipment" && (
                    <div>
                      <h2 className="text-2xl font-bold text-[#354F52] mb-6 flex items-center gap-2">
                        <UtensilsCrossed className="w-6 h-6 text-[#6BB371]" />
                        Equipment Needed
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {recipe.equipment.map((item, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                            <CheckCircle2 className="w-5 h-5 text-[#6BB371]" />
                            <span className="text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tips Section */}
                {recipe.tips && recipe.tips.length > 0 && (
                  <div className="bg-gradient-to-r from-[#6BB371]/10 to-[#52796F]/10 rounded-xl p-8 mt-8 border-2 border-[#6BB371]/20">
                    <h2 className="text-2xl font-bold text-[#354F52] mb-4 flex items-center gap-2">
                      <Award className="w-6 h-6 text-[#6BB371]" />
                      Pro Tips
                    </h2>
                    <ul className="space-y-3">
                      {recipe.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-[#6BB371] font-bold mt-1">•</span>
                          <span className="text-gray-700">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-gray-100 text-center">
                <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">Recipe Coming Soon</h3>
                <p className="text-gray-500">Full recipe details will be available soon for this meal.</p>
              </div>
            )}
          </div>

          {/* Right Column - Nutrition & Actions */}
          <div className="space-y-6">
            {/* Favorite Button */}
            <button
              onClick={toggleFavorite}
              className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                isFavorite
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200"
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
              {isFavorite ? "Saved to Favorites" : "Save to Favorites"}
            </button>

            {/* Nutrition Facts */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100">
              <h3 className="text-xl font-bold text-[#354F52] mb-4 flex items-center gap-2">
                <Wheat className="w-5 h-5 text-[#6BB371]" />
                Nutrition Facts
              </h3>
              
              {hasRecipe && recipe.nutritionDetails ? (
                <div className="space-y-3">
                  {Object.entries(recipe.nutritionDetails).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className="text-gray-600 capitalize">{key}</span>
                      <span className="font-semibold text-[#354F52]">
                        {value}{key !== "calories" && "g"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Calories</span>
                    <span className="font-semibold text-[#354F52]">{meal.calories}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Protein</span>
                    <span className="font-semibold text-[#354F52]">{meal.protein}g</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Carbs</span>
                    <span className="font-semibold text-[#354F52]">{meal.carbs}g</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Fats</span>
                    <span className="font-semibold text-[#354F52]">{meal.fats}g</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Fiber</span>
                    <span className="font-semibold text-[#354F52]">{meal.fiber}g</span>
                  </div>
                </div>
              )}
            </div>

            {/* Goal Info */}
            <div className={`bg-gradient-to-r ${goalInfo.bg} rounded-xl p-6 text-white shadow-lg`}>
              <div className="flex items-center gap-3 mb-3">
                <GoalIcon className="w-8 h-8" />
                <h3 className="text-xl font-bold">Perfect For</h3>
              </div>
              <p className="text-white/90 capitalize text-lg">
                {meal.goal.replace("-", " ")} Goals
              </p>
            </div>

            {/* Meal Type */}
            <div className="bg-gradient-to-br from-[#354F52] to-[#52796F] rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <Timer className="w-8 h-8" />
                <h3 className="text-xl font-bold">Meal Type</h3>
              </div>
              <p className="text-white/90 capitalize text-lg">{meal.mealType}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}