"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";
import { useRouter } from "next/navigation";

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
  Cookie,
  Heart
} from "lucide-react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function MealsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("all");
  const [selectedMealType, setSelectedMealType] = useState("all");
  const [favoriteMeals, setFavoriteMeals] = useState([]);

const MEALS_PER_PAGE = 4; // 2 rows of 4 cards
const [currentPages, setCurrentPages] = useState({
  breakfast: 1,
  lunch: 1,
  dinner: 1,
  snacks: 1
});



  // Toggle favorite meal
  const toggleFavorite = (meal) => {
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
      // Remove from favorites
      updatedFavorites = favorites.filter(f => f.id !== meal.id);
    } else {
      // Add to favorites
      updatedFavorites = [...favorites, {
        ...meal,
        likedAt: new Date().toISOString(),
        comment: ""
      }];
    }

    const updatedUser = {
      ...userData,
      favoriteMeals: updatedFavorites
    };

    localStorage.setItem("trainsight_current_user", JSON.stringify(updatedUser));
    
    // Update users array
    const users = JSON.parse(localStorage.getItem("trainsight_users") || "[]");
    const updatedUsers = users.map(u => u.id === userData.id ? updatedUser : u);
    localStorage.setItem("trainsight_users", JSON.stringify(updatedUsers));

    setFavoriteMeals(updatedFavorites);
    window.dispatchEvent(new Event("userUpdated"));
  };

  const isFavorite = (mealId) => {
    return favoriteMeals.some(f => f.id === mealId);
  };


  const handlePageChange = (mealType, page) => {
    setCurrentPages(prev => ({
      ...prev,
      [mealType]: page
    }));
  };

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

  // Default meals
  const defaultMeals = [];


const [meals, setMeals] = useState(defaultMeals);

useEffect(() => {
  const fetchMeals = async () => {
    try {
      const res = await fetch("/api/admin/meals");
      const data = await res.json();
      
      if (data.success && data.meals && data.meals.length > 0) {
        // Merge API meals with default meals
        const existingIds = new Set(data.meals.map(m => m.id));
        const uniqueDefaultMeals = defaultMeals.filter(m => !existingIds.has(m.id));
        setMeals([...data.meals, ...uniqueDefaultMeals]);
      } else {
        setMeals(defaultMeals);
      }
    } catch (error) {
      console.error("Error fetching meals:", error);
      setMeals(defaultMeals);
    }
  };

  fetchMeals();
}, []);

  // Refetch meals when they're updated in admin
  useEffect(() => {
    const handleMealsUpdate = () => {
      fetch("/api/admin/meals")
        .then(res => res.json())
        .then(data => {
          if (data.success && data.meals) {
            setMeals(data.meals);
          }
        })
        .catch(err => console.error("Error refetching meals:", err));
    };

    window.addEventListener("mealsUpdated", handleMealsUpdate);
    return () => window.removeEventListener("mealsUpdated", handleMealsUpdate);
  }, []);

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

  // Paginated meals
  const paginatedMealsByType = {
    breakfast: {
      meals: mealsByType.breakfast.slice(
        (currentPages.breakfast - 1) * MEALS_PER_PAGE,
        currentPages.breakfast * MEALS_PER_PAGE
      ),
      totalPages: Math.ceil(mealsByType.breakfast.length / MEALS_PER_PAGE)
    },
    lunch: {
      meals: mealsByType.lunch.slice(
        (currentPages.lunch - 1) * MEALS_PER_PAGE,
        currentPages.lunch * MEALS_PER_PAGE
      ),
      totalPages: Math.ceil(mealsByType.lunch.length / MEALS_PER_PAGE)
    },
    dinner: {
      meals: mealsByType.dinner.slice(
        (currentPages.dinner - 1) * MEALS_PER_PAGE,
        currentPages.dinner * MEALS_PER_PAGE
      ),
      totalPages: Math.ceil(mealsByType.dinner.length / MEALS_PER_PAGE)
    },
    snacks: {
      meals: mealsByType.snacks.slice(
        (currentPages.snacks - 1) * MEALS_PER_PAGE,
        currentPages.snacks * MEALS_PER_PAGE
      ),
      totalPages: Math.ceil(mealsByType.snacks.length / MEALS_PER_PAGE)
    }
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
            src={meal.image || "/images/placeholder-blur.svg"}
            alt={meal.name || "Meal image"}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "/images/placeholder-blur.svg";
            }}
          />

        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-[#354F52] flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {meal.prepTime}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(meal);
          }}
          className={`absolute top-3 left-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
            isFavorite(meal.id)
              ? "bg-red-500/90 text-white shadow-lg"
              : "bg-white/90 text-gray-600 hover:bg-white"
          }`}
        >
          <Heart 
            className={`w-4 h-4 ${isFavorite(meal.id) ? "fill-current" : ""}`}
          />
        </button>
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
        
        <button 
        onClick={() => router.push(`/services/meals/${meal.id}`)}
        className="w-full bg-gradient-to-r from-[#6BB371] to-[#52796F] text-white py-2 rounded-lg font-semibold hover:from-[#52796F] hover:to-[#6BB371] transition-all duration-300"
      >
        View Recipe
      </button>
      </div>
    </motion.div>
  );


  const PaginationControls = ({ mealType, currentPage, totalPages }) => {
  if (totalPages < 1) return null;
  
  return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex justify-center items-center gap-8 mt-8"
        >
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(mealType, Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="group p-4 rounded-2xl bg-[#354F52] text-white hover:bg-[#52796F] transition-all duration-300 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl disabled:hover:scale-100"
          >
            <IoIosArrowBack size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>

          {/* Page Dots Indicator */}
          <div className="flex gap-3 items-center">
            {Array.from({ length: totalPages }).map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(mealType, page)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentPage === page
                      ? "bg-[#354F52] w-12 shadow-lg"
                      : "bg-[#C8CDC5] w-2 hover:bg-[#52796F] hover:w-4"
                  }`}
                  aria-label={`Go to page ${page}`}
                />
              );
            })}
      </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(mealType, Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="group p-4 rounded-2xl bg-[#354F52] text-white hover:bg-[#52796F] transition-all duration-300 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl disabled:hover:scale-100"
            >
              <IoIosArrowForward size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        );
    };

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[500px] md:h-[600px] bg-gradient-to-br from-[#2F3E46] via-[#354F52] to-[#2F3E46] overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('https://plus.unsplash.com/premium_photo-1700760417057-bea54a42503c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
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
                  {paginatedMealsByType.breakfast.meals.map((meal, index) => (
                    <MealCard key={meal.id} meal={meal} index={index} />
                  ))}
                </div>
                {/*PAGINATION */}
                <PaginationControls 
                  mealType="breakfast" 
                  currentPage={currentPages.breakfast} 
                  totalPages={paginatedMealsByType.breakfast.totalPages} 
                />
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
                  {paginatedMealsByType.lunch.meals.map((meal, index) => (
                    <MealCard key={meal.id} meal={meal} index={index} />
                  ))}
                </div>
                {/*PAGINATION */}
                <PaginationControls 
                  mealType="lunch" 
                  currentPage={currentPages.lunch} 
                  totalPages={paginatedMealsByType.lunch.totalPages} 
                />
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
                  {paginatedMealsByType.dinner.meals.map((meal, index) => (
                    <MealCard key={meal.id} meal={meal} index={index} />
                  ))}
                </div>
                {/* ADD PAGINATION */}
                <PaginationControls 
                  mealType="dinner" 
                  currentPage={currentPages.dinner} 
                  totalPages={paginatedMealsByType.dinner.totalPages} 
                />
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
                  {paginatedMealsByType.snacks.meals.map((meal, index) => (
                    <MealCard key={meal.id} meal={meal} index={index} />
                  ))}
                </div>
                {/* ADD PAGINATION */}
                <PaginationControls 
                  mealType="snacks" 
                  currentPage={currentPages.snacks} 
                  totalPages={paginatedMealsByType.snacks.totalPages} 
                />
              </div>
            )}
          </>
        ) : (
          // Filtered View - Show only selected meal type
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(() => {
              const currentPage = currentPages[selectedMealType] || 1;
              const totalPages = Math.ceil(filteredMeals.length / MEALS_PER_PAGE);
              const paginatedMeals = filteredMeals.slice(
                (currentPage - 1) * MEALS_PER_PAGE,
                currentPage * MEALS_PER_PAGE
              );
              
              return paginatedMeals.map((meal, index) => (
                <MealCard key={meal.id} meal={meal} index={index} />
              ));
            })()}
          </div>
          {selectedMealType !== "all" && (
            <PaginationControls 
              mealType={selectedMealType} 
              currentPage={currentPages[selectedMealType] || 1} 
              totalPages={Math.ceil(filteredMeals.length / MEALS_PER_PAGE)} 
            />
          )}
        </>
        )}
        </div>
      </div>
      </div>
    </MainLayout>
  );
}
