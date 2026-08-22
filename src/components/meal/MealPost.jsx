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

  useEffect(() => {
  // Load meal data from MongoDB API
  const loadMeal = async () => {
    try {
      const res = await fetch("/api/admin/meals");
      const data = await res.json();
      
      if (data.success && data.meals) {
        const foundMeal = data.meals.find(m => m.id === postId);
        
        if (foundMeal) {
          setMeal(foundMeal);
        }
      }
    } catch (error) {
      console.error("Error loading meal:", error);
    }
  };

  loadMeal();

  // Ask the server whether this meal is saved. Signed-out visitors just get false.
  const loadFavoriteState = async () => {
    try {
      const res = await fetch("/api/favorites?type=meal", { cache: "no-store" });
      if (!res.ok) {
        setIsFavorite(false);
        return;
      }
      const data = await res.json().catch(() => ({}));
      setIsFavorite((data?.items || []).some((m) => m.id === postId));
    } catch (error) {
      console.error("Error loading favorites:", error);
      setIsFavorite(false);
    }
  };

  loadFavoriteState();
}, [postId]);

  const toggleFavorite = async () => {
    const next = !isFavorite;
    setIsFavorite(next); // optimistic -- a save button that lags feels broken

    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "meal", itemId: meal.id, favorited: next }),
      });

      if (res.status === 401) {
        setIsFavorite(!next);
        alert("Please login to save meals");
        return;
      }
      if (!res.ok) throw new Error("Request failed");

      window.dispatchEvent(new Event("userUpdated"));
    } catch (error) {
      console.error("Failed to update saved meal:", error);
      setIsFavorite(!next);
      alert("Could not save this meal. Please try again.");
    }
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

  // Check if meal has full recipe details
  const hasRecipe = meal.detailedIngredients && meal.detailedIngredients.length > 0 && 
                    meal.steps && meal.steps.length > 0;

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
              backgroundImage: meal.image
                ? `url(${meal.image})`
                : "linear-gradient(135deg, #e5e7eb, #d1d5db)",
              filter: meal.image ? "brightness(0.7)" : "blur(6px)"
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
                {meal.goal ? meal.goal.replace("-", " ") : "All Goals"}
              </span>
              <span className="px-4 py-2 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-md capitalize">
                {meal.mealType}
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">{meal.name}</h1>
            <p className="text-xl text-white/90 max-w-2xl">{meal.description || "Delicious and nutritious meal"}</p>
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

          {meal.servings && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-lg text-center border-2 border-gray-100"
            >
              <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#354F52]">{meal.servings}</div>
              <div className="text-sm text-gray-600">Servings</div>
            </motion.div>
          )}

          {meal.difficulty && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-lg text-center border-2 border-gray-100"
            >
              <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#354F52]">{meal.difficulty}</div>
              <div className="text-sm text-gray-600">Difficulty</div>
            </motion.div>
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
                  {meal.equipment && meal.equipment.length > 0 && (
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
                  )}
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
                        {meal.detailedIngredients.map((ingredient, index) => (
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
                        {meal.steps.map((step, index) => (
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

                  {activeTab === "equipment" && meal.equipment && meal.equipment.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-[#354F52] mb-6 flex items-center gap-2">
                        <UtensilsCrossed className="w-6 h-6 text-[#6BB371]" />
                        Equipment Needed
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {meal.equipment.map((item, index) => (
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
                {meal.tips && meal.tips.length > 0 && (
                  <div className="bg-gradient-to-r from-[#6BB371]/10 to-[#52796F]/10 rounded-xl p-8 mt-8 border-2 border-[#6BB371]/20">
                    <h2 className="text-2xl font-bold text-[#354F52] mb-4 flex items-center gap-2">
                      <Award className="w-6 h-6 text-[#6BB371]" />
                      Pro Tips
                    </h2>
                    <ul className="space-y-3">
                      {meal.tips.map((tip, index) => (
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
                <h3 className="text-xl font-bold text-gray-700 mb-2">Recipe Details Coming Soon</h3>
                <p className="text-gray-500">Full recipe instructions will be available soon for this meal.</p>
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
              
              {meal.nutritionDetails ? (
                <div className="space-y-3">
                  {Object.entries(meal.nutritionDetails).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className="text-gray-600 capitalize">{key}</span>
                      <span className="font-semibold text-[#354F52]">
                        {value}{key !== "calories" && key !== "sodium" ? "g" : key === "sodium" ? "mg" : ""}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flexjustify-between items-center py-2 border-b border-gray-100">
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
                              {meal.goal ? meal.goal.replace("-", " ") + " Goals" : "All Goals"}
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