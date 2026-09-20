"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Apple,
  ArrowLeft,
  Award,
  Beef,
  CheckCircle2,
  ChefHat,
  ChevronLeft,
  Clock,
  Flame,
  Heart,
  Timer,
  Users,
  UtensilsCrossed,
  Wheat
} from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export default function MealPost({ postId }) {
  const toast = useToast();
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
        toast.error("Please log in to save meals.");
        return;
      }
      if (!res.ok) throw new Error("Request failed");

      window.dispatchEvent(new Event("userUpdated"));
    } catch (error) {
      console.error("Failed to update saved meal:", error);
      setIsFavorite(!next);
      toast.error("Could not save this meal. Please try again.");
    }
  };

  if (!meal) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-32 text-center md:px-12">
        <p className="text-ink-muted">Loading recipe…</p>
      </div>
    );
  }

  const TABS = [
    { id: "ingredients", label: "Ingredients" },
    { id: "instructions", label: "Method" },
    { id: "equipment", label: "Equipment" },
  ];

  return (
    <div className="bg-white">
      {/* Recipe header
          ------------------------------------------------------------------
          The photograph and the numbers together, because those are the two
          things someone checks before deciding to cook. Everything else --
          ingredients, method, equipment -- sits below in tabs. */}
      <section className="bg-bone pb-14 pt-10 md:pb-16">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <button
            onClick={() => router.back()}
            className="group inline-flex items-center gap-2 text-sm text-ink-muted transition-colors duration-300 hover:text-forest"
          >
            <ChevronLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            Back to meals
          </button>

          <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-bone-dark">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={meal.image || "/blog-covers/nutrition.svg"}
                alt={meal.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="eyebrow text-moss">{meal.mealType}</span>
                {meal.goal && (
                  <>
                    <span className="h-px w-8 bg-ink/15" />
                    <span className="text-xs capitalize text-ink-muted">
                      {String(meal.goal).replace("-", " ")}
                    </span>
                  </>
                )}
              </div>

              <h1 className="mt-5 font-display text-display-sm font-extrabold text-forest">
                {meal.name}
              </h1>

              {meal.description && (
                <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink-soft">
                  {meal.description}
                </p>
              )}

              {/* Prep facts. */}
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-y border-ink/10 py-5 text-sm">
                {meal.prepTime && (
                  <span className="text-ink-soft">
                    <span className="text-ink-muted">Time</span> {meal.prepTime}
                  </span>
                )}
                {meal.servings && (
                  <span className="text-ink-soft">
                    <span className="text-ink-muted">Serves</span> {meal.servings}
                  </span>
                )}
                {meal.difficulty && (
                  <span className="text-ink-soft">
                    <span className="text-ink-muted">Difficulty</span> {meal.difficulty}
                  </span>
                )}
              </div>

              {/* Macros. */}
              <dl className="mt-6 grid grid-cols-4 gap-px overflow-hidden rounded-2xl bg-ink/10">
                {[
                  ["Calories", meal.calories],
                  ["Protein", meal.protein ? `${meal.protein}g` : "—"],
                  ["Carbs", meal.carbs ? `${meal.carbs}g` : "—"],
                  ["Fats", meal.fats ? `${meal.fats}g` : "—"],
                ].map(([label, value]) => (
                  <div key={label} className="bg-bone px-3 py-4 text-center">
                    <dd className="font-display text-xl font-bold text-forest">{value}</dd>
                    <dt className="eyebrow mt-1 text-ink-muted">{label}</dt>
                  </div>
                ))}
              </dl>

              <button
                onClick={toggleFavorite}
                className="mt-8 inline-flex w-fit items-center gap-2.5 rounded-full bg-forest px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-moss"
              >
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                {isFavorite ? "Saved" : "Save recipe"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Ingredients, method, equipment. */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-20 lg:px-16">
        <div className="flex gap-x-8 border-b border-ink/10">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative pb-4 text-sm font-semibold transition-colors duration-300 ${
                activeTab === tab.id ? "text-forest" : "text-ink-muted hover:text-forest"
              }`}
            >
              {tab.label}
              <span
                className={`absolute bottom-0 left-0 h-px w-full bg-forest transition-transform duration-300 ease-editorial ${
                  activeTab === tab.id ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          ))}
        </div>

        <div className="mt-10 max-w-3xl">
          {activeTab === "ingredients" && (
            <ul className="divide-y divide-ink/10 border-y border-ink/10">
              {(meal.detailedIngredients || meal.ingredients || []).map((item, i) => (
                <li key={i} className="py-3.5 text-ink-soft">
                  {item}
                </li>
              ))}
            </ul>
          )}

          {activeTab === "instructions" && (
            <ol className="space-y-7">
              {(meal.steps || []).map((step, i) => (
                <li key={i} className="flex gap-6">
                  <span className="eyebrow pt-1 text-ink-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="max-w-prose leading-relaxed text-ink-soft">{step}</p>
                </li>
              ))}
            </ol>
          )}

          {activeTab === "equipment" && (
            <p className="leading-relaxed text-ink-soft">
              {meal.equipment || "Nothing beyond a bowl and a spoon."}
            </p>
          )}
        </div>

        {meal.tips && (
          <div className="mt-12 max-w-3xl border-l-2 border-moss-light pl-6">
            <p className="eyebrow text-moss">Tip</p>
            <p className="mt-3 leading-relaxed text-ink-soft">{meal.tips}</p>
          </div>
        )}
      </section>

      {/* What people said. Kept plain: an avatar and a card per comment would
          triple the weight of the section without adding anything. */}
      {meal.comments?.length > 0 && (
        <section className="bg-bone py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
            <div className="flex items-baseline justify-between border-b border-ink/10 pb-5">
              <h2 className="font-display text-2xl font-bold text-forest">
                What people said
              </h2>
              <span className="eyebrow text-ink-muted">
                {meal.comments.length}{" "}
                {meal.comments.length === 1 ? "comment" : "comments"}
              </span>
            </div>

            <ul className="mt-10 grid max-w-4xl gap-10 md:grid-cols-2">
              {meal.comments.map((comment, i) => (
                <li key={i}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-moss text-sm font-semibold text-white">
                      {comment.author?.charAt(0) || "?"}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-forest">{comment.author}</p>
                      {comment.rating && (
                        <p className="text-xs text-ink-muted">{comment.rating} out of 5</p>
                      )}
                    </div>
                  </div>
                  <p className="mt-4 leading-relaxed text-ink-soft">{comment.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
