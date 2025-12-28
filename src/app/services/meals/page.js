"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Filter, 
  Clock, 
  Flame, 
  Apple,
  UtensilsCrossed,
  Coffee,
  Sun,
  Moon,
  Cookie
} from "lucide-react";

export default function MealsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("all");
  const [selectedMealType, setSelectedMealType] = useState("all");

  const goals = [
    { id: "all", label: "All Goals", icon: Filter },
    { id: "lose-weight", label: "Lose Weight", icon: Flame },
    { id: "gain-weight", label: "Gain Weight", icon: Apple },
    { id: "muscle-gain", label: "Muscle Gain", icon: UtensilsCrossed },
    { id: "maintenance", label: "Maintenance", icon: Clock },
  ];

  const mealTypes = [
    { id: "all", label: "All Meals", icon: Filter },
    { id: "breakfast", label: "Breakfast", icon: Coffee },
    { id: "lunch", label: "Lunch", icon: Sun },
    { id: "dinner", label: "Dinner", icon: Moon },
    { id: "snacks", label: "Snacks", icon: Cookie },
  ];

  const meals = [
    // Breakfast Meals
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
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400",
      prepTime: "5 min",
      description: "High-protein breakfast to fuel your morning workout"
    },
    {
      id: 2,
      name: "Avocado Toast with Eggs",
      mealType: "breakfast",
      goal: "maintenance",
      calories: 380,
      protein: 18,
      carbs: 32,
      fats: 22,
      fiber: 10,
      ingredients: ["Whole grain bread", "Avocado", "Eggs", "Cherry tomatoes", "Spinach", "Lemon"],
      image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400",
      prepTime: "10 min",
      description: "Balanced breakfast with healthy fats and protein"
    },
    {
      id: 3,
      name: "Green Smoothie Bowl",
      mealType: "breakfast",
      goal: "lose-weight",
      calories: 280,
      protein: 15,
      carbs: 35,
      fats: 8,
      fiber: 12,
      ingredients: ["Spinach", "Banana", "Mango", "Chia seeds", "Almond milk", "Protein powder"],
      image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400",
      prepTime: "5 min",
      description: "Low-calorie, nutrient-dense breakfast option"
    },
    {
      id: 4,
      name: "High-Calorie Pancakes",
      mealType: "breakfast",
      goal: "gain-weight",
      calories: 650,
      protein: 22,
      carbs: 85,
      fats: 25,
      fiber: 6,
      ingredients: ["Whole wheat flour", "Eggs", "Milk", "Butter", "Maple syrup", "Bananas", "Nuts"],
      image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400",
      prepTime: "15 min",
      description: "Energy-dense breakfast for weight gain"
    },
    // Lunch Meals
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
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
      prepTime: "20 min",
      description: "Lean protein with fresh vegetables"
    },
    {
      id: 6,
      name: "Quinoa Power Bowl",
      mealType: "lunch",
      goal: "muscle-gain",
      calories: 520,
      protein: 32,
      carbs: 65,
      fats: 15,
      fiber: 10,
      ingredients: ["Quinoa", "Chicken", "Black beans", "Avocado", "Corn", "Cilantro", "Lime"],
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
      prepTime: "25 min",
      description: "Complete protein source with complex carbs"
    },
    {
      id: 7,
      name: "Beef and Rice Bowl",
      mealType: "lunch",
      goal: "gain-weight",
      calories: 680,
      protein: 38,
      carbs: 75,
      fats: 22,
      fiber: 5,
      ingredients: ["Lean beef", "Brown rice", "Broccoli", "Carrots", "Sesame oil", "Soy sauce"],
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
      prepTime: "30 min",
      description: "High-calorie meal for weight gain"
    },
    {
      id: 8,
      name: "Mediterranean Wrap",
      mealType: "lunch",
      goal: "maintenance",
      calories: 450,
      protein: 20,
      carbs: 48,
      fats: 18,
      fiber: 7,
      ingredients: ["Whole wheat tortilla", "Hummus", "Grilled chicken", "Feta cheese", "Cucumber", "Olives"],
      image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400",
      prepTime: "15 min",
      description: "Balanced Mediterranean flavors"
    },
    // Dinner Meals
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
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400",
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
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
      prepTime: "35 min",
      description: "High-protein dinner for recovery"
    },
    {
      id: 11,
      name: "Steak with Mashed Potatoes",
      mealType: "dinner",
      goal: "gain-weight",
      calories: 720,
      protein: 45,
      carbs: 55,
      fats: 35,
      fiber: 4,
      ingredients: ["Ribeye steak", "Potatoes", "Butter", "Green beans", "Garlic", "Herbs"],
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
      prepTime: "40 min",
      description: "Calorie-dense dinner for weight gain"
    },
    {
      id: 12,
      name: "Vegetable Stir Fry",
      mealType: "dinner",
      goal: "maintenance",
      calories: 420,
      protein: 18,
      carbs: 52,
      fats: 16,
      fiber: 12,
      ingredients: ["Mixed vegetables", "Tofu", "Brown rice", "Soy sauce", "Ginger", "Sesame oil"],
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
      prepTime: "20 min",
      description: "Plant-based balanced dinner"
    },
    // Snacks
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
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400",
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
      image: "https://images.unsplash.com/photo-1606312619070-d48b4bc98f48?w=400",
      prepTime: "10 min",
      description: "High-protein pre/post workout snack"
    },
    {
      id: 15,
      name: "Trail Mix",
      mealType: "snacks",
      goal: "gain-weight",
      calories: 350,
      protein: 12,
      carbs: 28,
      fats: 22,
      fiber: 6,
      ingredients: ["Nuts", "Dried fruits", "Dark chocolate", "Seeds"],
      image: "https://images.unsplash.com/photo-1606312619070-d48b4bc98f48?w=400",
      prepTime: "5 min",
      description: "Calorie-dense snack mix"
    },
    {
      id: 16,
      name: "Apple with Peanut Butter",
      mealType: "snacks",
      goal: "maintenance",
      calories: 280,
      protein: 10,
      carbs: 32,
      fats: 14,
      fiber: 8,
      ingredients: ["Apple", "Natural peanut butter", "Cinnamon"],
      image: "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400",
      prepTime: "3 min",
      description: "Balanced snack with healthy fats"
    },
  ];

  const filteredMeals = meals.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meal.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesGoal = selectedGoal === "all" || meal.goal === selectedGoal;
    const matchesMealType = selectedMealType === "all" || meal.mealType === selectedMealType;
    return matchesSearch && matchesGoal && matchesMealType;
  });

  const mealsByType = {
    breakfast: filteredMeals.filter(m => m.mealType === "breakfast"),
    lunch: filteredMeals.filter(m => m.mealType === "lunch"),
    dinner: filteredMeals.filter(m => m.mealType === "dinner"),
    snacks: filteredMeals.filter(m => m.mealType === "snacks"),
  };

  const MealCard = ({ meal, index }) => (
    <motion.div
      key={meal.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={meal.image}
          alt={meal.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x200?text=Meal+Image'; }}
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-[#354F52] flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {meal.prepTime}
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold text-[#354F52] mb-2">{meal.name}</h3>
        <p className="text-sm text-gray-600 mb-4">{meal.description}</p>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-gradient-to-r from-[#6BB371]/10 to-[#6BB371]/5 p-2 rounded-lg">
            <div className="text-xs text-gray-600">Calories</div>
            <div className="text-lg font-bold text-[#354F52]">{meal.calories}</div>
          </div>
          <div className="bg-gradient-to-r from-[#6BB371]/10 to-[#6BB371]/5 p-2 rounded-lg">
            <div className="text-xs text-gray-600">Protein</div>
            <div className="text-lg font-bold text-[#354F52]">{meal.protein}g</div>
          </div>
          <div className="bg-gradient-to-r from-[#6BB371]/10 to-[#6BB371]/5 p-2 rounded-lg">
            <div className="text-xs text-gray-600">Carbs</div>
            <div className="text-lg font-bold text-[#354F52]">{meal.carbs}g</div>
          </div>
          <div className="bg-gradient-to-r from-[#6BB371]/10 to-[#6BB371]/5 p-2 rounded-lg">
            <div className="text-xs text-gray-600">Fats</div>
            <div className="text-lg font-bold text-[#354F52]">{meal.fats}g</div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="text-xs font-semibold text-gray-700 mb-2">Ingredients:</div>
          <div className="flex flex-wrap gap-1">
            {meal.ingredients.slice(0, 4).map((ingredient, idx) => (
              <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                {ingredient}
              </span>
            ))}
            {meal.ingredients.length > 4 && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">
                +{meal.ingredients.length - 4} more
              </span>
            )}
          </div>
        </div>
        
        <button className="w-full bg-gradient-to-r from-[#6BB371] to-[#52796F] text-white py-2 rounded-lg font-semibold hover:from-[#52796F] hover:to-[#6BB371] transition-all duration-300">
          View Recipe
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[500px] md:h-[600px] bg-gradient-to-br from-[#2F3E46] via-[#354F52] to-[#2F3E46] overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(1.1) contrast(0.85)"
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            Meal <span className="text-[#FF8C42]">Preparation</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-8 font-medium">
            Discover delicious, nutritious meals tailored to your fitness goals
          </p>
          <div className="flex items-center gap-4 text-white/70">
            <UtensilsCrossed className="w-6 h-6" />
            <span className="text-lg">Fresh Ingredients</span>
            <span className="text-2xl">•</span>
            <span className="text-lg">Expert Recipes</span>
            <span className="text-2xl">•</span>
            <span className="text-lg">Customized Plans</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-gradient-to-br from-[#2F3E46] via-[#354F52] to-[#2F3E46] py-10 px-4 relative overflow-hidden">
        {/* Floating Food Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <span className="absolute top-16 left-10 text-4xl opacity-10 animate-float" style={{ animationDelay: '0s', animationDuration: '6s' }}>🍎</span>
          <span className="absolute top-24 right-16 text-3xl opacity-10 animate-float" style={{ animationDelay: '1s', animationDuration: '7s' }}>🥗</span>
          <span className="absolute bottom-20 left-1/4 text-5xl opacity-10 animate-float" style={{ animationDelay: '2s', animationDuration: '8s' }}>🍳</span>
          <span className="absolute bottom-16 right-1/3 text-4xl opacity-10 animate-float" style={{ animationDelay: '3s', animationDuration: '6.5s' }}>🥑</span>
          <span className="absolute top-1/2 left-20 text-3xl opacity-10 animate-float" style={{ animationDelay: '1.5s', animationDuration: '7.5s' }}>🥕</span>
          <span className="absolute top-1/3 right-24 text-4xl opacity-10 animate-float" style={{ animationDelay: '2.5s', animationDuration: '6.5s' }}>🍌</span>
          <span className="absolute bottom-1/3 left-1/3 text-3xl opacity-10 animate-float" style={{ animationDelay: '0.5s', animationDuration: '8s' }}>🥝</span>
          <span className="absolute top-20 right-1/4 text-4xl opacity-10 animate-float" style={{ animationDelay: '3.5s', animationDuration: '7s' }}>🍇</span>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5 z-10" />
              <input
                type="text"
                placeholder="Search meals or ingredients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#6BB371] focus:border-[#6BB371] transition-all duration-300 text-lg"
              />
            </div>
          </div>

          {/* Goal Filters */}
          <div className="mb-6">
            <div className="flex flex-wrap justify-center gap-3">
              {goals.map((goal) => {
                const Icon = goal.icon;
                return (
                  <button
                    key={goal.id}
                    onClick={() => setSelectedGoal(goal.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                      selectedGoal === goal.id
                        ? "bg-[#6BB371] text-white shadow-lg shadow-[#6BB371]/30 scale-105"
                        : "bg-white/10 backdrop-blur-sm text-white/80 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {goal.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Meal Type Filters */}
          <div>
            <div className="flex flex-wrap justify-center gap-3">
              {mealTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedMealType(type.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                      selectedMealType === type.id
                        ? "bg-[#6BB371] text-white shadow-lg shadow-[#6BB371]/30 scale-105"
                        : "bg-white/10 backdrop-blur-sm text-white/80 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Meals Timeline Section */}
      <div className="bg-white py-12 px-4 relative overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#52796F]/5 via-transparent to-[#6BB371]/5"></div>
        <div className="absolute inset-0 opacity-35" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cstyle%3E.grid-line%7Bstroke:%2352796F;stroke-width:0.4;fill:none;stroke-linecap:round%7D%3C/style%3E%3C/defs%3E%3Cpath class='grid-line' d='M0 0 Q2 1 0 2 T0 4 T0 6 T0 8 T0 10 T0 12 T0 14 T0 16 T0 18 T0 20 T0 22 T0 24 T0 26 T0 28 T0 30 T0 32 T0 34 T0 36 T0 38 T0 40 T0 42 T0 44 T0 46 T0 48 T0 50 T0 52 T0 54 T0 56 T0 58 T0 60'/%3E%3Cpath class='grid-line' d='M0 0 Q1 2 2 0 T4 0 T6 0 T8 0 T10 0 T12 0 T14 0 T16 0 T18 0 T20 0 T22 0 T24 0 T26 0 T28 0 T30 0 T32 0 T34 0 T36 0 T38 0 T40 0 T42 0 T44 0 T46 0 T48 0 T50 0 T52 0 T54 0 T56 0 T58 0 T60 0'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
        <div className="absolute inset-0 opacity-25" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cstyle%3E.grid-line%7Bstroke:%2352796F;stroke-width:0.3;fill:none;stroke-linecap:round%7D%3C/style%3E%3C/defs%3E%3Cpath class='grid-line' d='M0 0 Q-1 1 0 2 T0 4 T0 6 T0 8 T0 10 T0 12 T0 14 T0 16 T0 18 T0 20 T0 22 T0 24 T0 26 T0 28 T0 30 T0 32 T0 34 T0 36 T0 38 T0 40 T0 42 T0 44 T0 46 T0 48 T0 50 T0 52 T0 54 T0 56 T0 58 T0 60'/%3E%3Cpath class='grid-line' d='M0 0 Q1 -1 2 0 T4 0 T6 0 T8 0 T10 0 T12 0 T14 0 T16 0 T18 0 T20 0 T22 0 T24 0 T26 0 T28 0 T30 0 T32 0 T34 0 T36 0 T38 0 T40 0 T42 0 T44 0 T46 0 T48 0 T50 0 T52 0 T54 0 T56 0 T58 0 T60 0'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
          backgroundPosition: '1px 1px'
        }}></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
        {selectedMealType === "all" ? (
          // Timeline View - Show all meal types
          <>
            {/* Breakfast Section */}
            {mealsByType.breakfast.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <Coffee className="w-8 h-8 text-[#FF8C42]" />
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FF8C42] to-[#FFB347] bg-clip-text text-transparent">Breakfast</h2>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-[#FF8C42] via-[#FFB347]/70 to-transparent"></div>
                </div>
                <p className="text-gray-600 mb-6">Start your day with nutritious breakfast options</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {mealsByType.breakfast.map((meal, index) => (
                    <MealCard key={meal.id} meal={meal} index={index} />
                  ))}
                </div>
              </div>
            )}

            {/* Lunch Section */}
            {mealsByType.lunch.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <Sun className="w-8 h-8 text-[#FFD93D]" />
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FFD93D] to-[#FFA500] bg-clip-text text-transparent">Lunch</h2>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-[#FFD93D] via-[#FFA500]/70 to-transparent"></div>
                </div>
                <p className="text-gray-600 mb-6">Fuel your afternoon with balanced lunch meals</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {mealsByType.lunch.map((meal, index) => (
                    <MealCard key={meal.id} meal={meal} index={index} />
                  ))}
                </div>
              </div>
            )}

            {/* Dinner Section */}
            {mealsByType.dinner.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <Moon className="w-8 h-8 text-[#8B5CF6]" />
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] bg-clip-text text-transparent">Dinner</h2>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA]/70 to-transparent"></div>
                </div>
                <p className="text-gray-600 mb-6">End your day with satisfying dinner options</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {mealsByType.dinner.map((meal, index) => (
                    <MealCard key={meal.id} meal={meal} index={index} />
                  ))}
                </div>
              </div>
            )}

            {/* Snacks Section */}
            {mealsByType.snacks.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <Cookie className="w-8 h-8 text-[#EC4899]" />
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-[#EC4899] to-[#F472B6] bg-clip-text text-transparent">Snacks</h2>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-[#EC4899] via-[#F472B6]/70 to-transparent"></div>
                </div>
                <p className="text-gray-600 mb-6">Healthy snacks to keep you energized throughout the day</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {mealsByType.snacks.map((meal, index) => (
                    <MealCard key={meal.id} meal={meal} index={index} />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          // Filtered View - Show only selected meal type
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMeals.map((meal, index) => (
              <MealCard key={meal.id} meal={meal} index={index} />
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
