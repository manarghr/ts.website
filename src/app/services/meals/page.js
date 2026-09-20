"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  Heart,
  ArrowRight
} from "lucide-react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useToast } from "@/components/ui/ToastProvider";

export default function MealsPage() {
  const toast = useToast();
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



  // Saved meals live in the `favorites` collection, keyed off the session cookie.
  const loadFavorites = useCallback(async () => {
    try {
      const res = await fetch("/api/favorites?type=meal", { cache: "no-store" });
      if (!res.ok) {
        setFavoriteMeals([]);
        return;
      }
      const data = await res.json().catch(() => ({}));
      setFavoriteMeals(data?.items || []);
    } catch (error) {
      console.error("Failed to load saved meals:", error);
      setFavoriteMeals([]);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const toggleFavorite = async (meal) => {
    const next = !favoriteMeals.some((f) => f.id === meal.id);
    const previous = favoriteMeals;

    // Optimistic: update the heart immediately, roll back if the server refuses.
    setFavoriteMeals(next ? [...previous, meal] : previous.filter((f) => f.id !== meal.id));

    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "meal", itemId: meal.id, favorited: next }),
      });

      if (res.status === 401) {
        setFavoriteMeals(previous);
        toast.error("Please log in to save meals.");
        return;
      }
      if (!res.ok) throw new Error("Request failed");

      window.dispatchEvent(new Event("userUpdated"));
    } catch (error) {
      console.error("Failed to update saved meal:", error);
      setFavoriteMeals(previous);
      toast.error("Could not save this meal. Please try again.");
    }
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

  // A meal card is one of the few places on the site where a card is the right
  // component: the image, the name and the macros are a single unit you scan
  // and compare against its neighbours.
  const MealCard = ({ meal, index }) => (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link href={`/services/meals/${meal.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-bone-dark">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={meal.image || "/blog-covers/nutrition.svg"}
            alt={meal.name || "Meal"}
            className="h-full w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.04]"
          />

          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(meal);
            }}
            aria-label={`Save ${meal.name}`}
            className="absolute right-3 top-3 rounded-full bg-white/90 p-2.5 text-ink transition-colors duration-300 hover:bg-white"
          >
            <Heart
              className={`h-4 w-4 ${
                favoriteMeals.some((f) => f.id === meal.id) ? "fill-current text-moss-light" : ""
              }`}
            />
          </button>
        </div>

        <h3 className="mt-4 font-display text-lg font-bold text-forest transition-colors duration-300 group-hover:text-moss">
          {meal.name}
        </h3>

        {/* Macros as a data row rather than four coloured chips. */}
        <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 border-t border-ink/10 pt-3 text-xs">
          {[
            ["kcal", meal.calories],
            ["P", meal.protein ? `${meal.protein}g` : null],
            ["C", meal.carbs ? `${meal.carbs}g` : null],
            ["F", meal.fats ? `${meal.fats}g` : null],
          ]
            .filter(([, value]) => value)
            .map(([label, value]) => (
              <div key={label} className="flex items-baseline gap-1">
                <dt className="text-ink-muted">{label}</dt>
                <dd className="font-semibold text-forest">{value}</dd>
              </div>
            ))}
        </dl>
      </Link>
    </motion.article>
  );

  const MEAL_SECTIONS = [
    { id: "breakfast", label: "Breakfast" },
    { id: "lunch", label: "Lunch" },
    { id: "dinner", label: "Dinner" },
    { id: "snacks", label: "Snacks" },
  ];

  const [heroMeal] = filteredMeals;

  return (
    <MainLayout>
      <div className="w-full bg-white">
        {/* Masthead
            ----------------------------------------------------------------
            Off-white and warm rather than the deep teal used by Programs and
            the analyser. This is the lifestyle corner of the product and it
            should feel like a different room in the same building. */}
        <section className="bg-bone pb-16 pt-16 md:pb-20 md:pt-20">
          <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]"
            >
              <div>
                <p className="eyebrow text-moss">Fuel your training</p>
                <h1 className="mt-6 font-display text-display font-extrabold text-forest">
                  Eat well.
                  <span className="block text-ink-muted">Train better.</span>
                </h1>
              </div>

              <p className="max-w-prose leading-relaxed text-ink-soft lg:pb-3">
                Meals with the macros already worked out, filterable by what you are
                training for. Prep time and method included, because a plan has to
                survive a weekday evening.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Controls: search, goal, meal type. */}
        <section className="sticky top-[var(--nav-h)] z-30 border-b border-ink/10 bg-white/90 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
            <div className="flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-xs">
                <Search className="pointer-events-none absolute left-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search meals or ingredients"
                  aria-label="Search meals"
                  className="w-full border-0 border-b border-ink/15 bg-transparent py-2 pl-6 text-sm text-ink placeholder:text-ink-muted focus:border-moss focus:outline-none focus:ring-0"
                />
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {goals.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => setSelectedGoal(goal.id)}
                    className={`relative pb-1 text-sm font-semibold transition-colors duration-300 ${
                      selectedGoal === goal.id
                        ? "text-forest"
                        : "text-ink-muted hover:text-forest"
                    }`}
                  >
                    {goal.label}
                    <span
                      className={`absolute -bottom-[9px] left-0 h-px w-full bg-forest transition-transform duration-300 ease-editorial ${
                        selectedGoal === goal.id ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured meal: a full editorial split with the numbers spelled out. */}
        {heroMeal && (
          <section className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-20 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="group grid gap-10 lg:grid-cols-2 lg:gap-16"
            >
              <Link
                href={`/services/meals/${heroMeal.id}`}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-bone-dark"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroMeal.image || "/blog-covers/nutrition.svg"}
                  alt={heroMeal.name}
                  className="h-full w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.03]"
                />
              </Link>

              <div className="flex flex-col justify-center">
                <p className="eyebrow text-moss">This week&apos;s pick</p>

                <h2 className="mt-5 font-display text-display-sm font-extrabold text-forest">
                  {heroMeal.name}
                </h2>

                <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink-soft">
                  {heroMeal.description}
                </p>

                <dl className="mt-8 grid grid-cols-4 gap-px overflow-hidden rounded-2xl bg-ink/10">
                  {[
                    ["Calories", heroMeal.calories],
                    ["Protein", heroMeal.protein ? `${heroMeal.protein}g` : "—"],
                    ["Carbs", heroMeal.carbs ? `${heroMeal.carbs}g` : "—"],
                    ["Fats", heroMeal.fats ? `${heroMeal.fats}g` : "—"],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-white px-4 py-5 text-center">
                      <dd className="font-display text-2xl font-bold text-forest">{value}</dd>
                      <dt className="eyebrow mt-1.5 text-ink-muted">{label}</dt>
                    </div>
                  ))}
                </dl>

                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-muted">
                  {heroMeal.prepTime && <span>{heroMeal.prepTime}</span>}
                  {heroMeal.servings && <span>Serves {heroMeal.servings}</span>}
                  {heroMeal.difficulty && <span>{heroMeal.difficulty}</span>}
                </div>

                <Link
                  href={`/services/meals/${heroMeal.id}`}
                  className="group/cta mt-9 inline-flex w-fit items-center gap-3 rounded-full bg-forest px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 ease-editorial hover:gap-4 hover:bg-moss"
                >
                  View meal
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </section>
        )}

        {/* By meal type. Each section keeps its own pagination. */}
        {MEAL_SECTIONS.map(({ id, label }) => {
          const section = paginatedMealsByType[id];
          if (!section || section.meals.length === 0) return null;

          return (
            <section key={id} className="mx-auto max-w-7xl px-6 pb-16 md:px-12 lg:px-16">
              <div className="flex items-baseline justify-between border-b border-ink/10 pb-5">
                <h2 className="font-display text-2xl font-bold text-forest">{label}</h2>
                <span className="eyebrow text-ink-muted">
                  {mealsByType[id].length} {mealsByType[id].length === 1 ? "meal" : "meals"}
                </span>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {section.meals.map((meal, index) => (
                  <MealCard key={meal.id} meal={meal} index={index} />
                ))}
              </div>

              {section.totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-8">
                  <button
                    onClick={() => handlePageChange(id, Math.max(currentPages[id] - 1, 1))}
                    disabled={currentPages[id] === 1}
                    className="text-sm font-semibold text-forest transition-opacity duration-300 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Previous
                  </button>
                  <span className="eyebrow text-ink-muted">
                    {currentPages[id]} / {section.totalPages}
                  </span>
                  <button
                    onClick={() =>
                      handlePageChange(id, Math.min(currentPages[id] + 1, section.totalPages))
                    }
                    disabled={currentPages[id] === section.totalPages}
                    className="text-sm font-semibold text-forest transition-opacity duration-300 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Next
                  </button>
                </div>
              )}
            </section>
          );
        })}

        {filteredMeals.length === 0 && (
          <section className="mx-auto max-w-7xl px-6 py-24 text-center md:px-12 lg:px-16">
            <h2 className="font-display text-2xl font-bold text-forest">No meals match that</h2>
            <p className="mt-3 text-ink-soft">Try a different goal, or clear the search.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedGoal("all");
                setSelectedMealType("all");
              }}
              className="mt-7 rounded-full bg-forest px-7 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-moss"
            >
              Clear filters
            </button>
          </section>
        )}
      </div>
    </MainLayout>
  );
}
