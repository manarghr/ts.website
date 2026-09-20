"use client";

import { useState } from "react";
import { 
  Search, 
  Filter, 
  Apple,
  Dumbbell,
  Cpu,
  Heart,
  Brain,
  TrendingUp
} from "lucide-react";

export default function BlogFilters({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory }) {
  
  const categories = [
    { id: "all", label: "All Articles", icon: Filter },
    { id: "nutrition", label: "Nutrition", icon: Apple },
    { id: "training", label: "Training", icon: Dumbbell },
    { id: "technology", label: "Technology", icon: Cpu },
    { id: "wellness", label: "Wellness", icon: Heart },
    { id: "mindset", label: "Mindset", icon: Brain },
    { id: "progress", label: "Progress", icon: TrendingUp },
  ];

  return (
    // Sticky controls under the masthead. A light bar rather than a second
    // dark banner: two stacked dark blocks made the page feel like it opened
    // twice before reaching any articles.
    <div className="sticky top-[var(--nav-h)] z-30 border-b border-ink/10 bg-white/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        <div className="flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xs">
            <Search className="pointer-events-none absolute left-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search articles"
              aria-label="Search articles"
              className="w-full border-0 border-b border-ink/15 bg-transparent py-2 pl-6 text-sm text-ink placeholder:text-ink-muted focus:border-moss focus:outline-none focus:ring-0"
            />
          </div>

          <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
            {categories.map((category) => {
              const active = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`relative pb-1 text-sm font-semibold transition-colors duration-300 ${
                    active ? "text-forest" : "text-ink-muted hover:text-forest"
                  }`}
                >
                  {category.label}
                  <span
                    className={`absolute -bottom-[9px] left-0 h-px w-full bg-forest transition-transform duration-300 ease-editorial ${
                      active ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
