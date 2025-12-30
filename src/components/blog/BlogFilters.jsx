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
    <div className="bg-gradient-to-br from-[#2F3E46] via-[#354F52] to-[#2F3E46] py-10 px-4 relative overflow-hidden">
      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <span className="absolute top-16 left-10 text-4xl opacity-10 animate-float" style={{ animationDelay: '0s', animationDuration: '6s' }}>📝</span>
        <span className="absolute top-24 right-16 text-3xl opacity-10 animate-float" style={{ animationDelay: '1s', animationDuration: '7s' }}>💪</span>
        <span className="absolute bottom-20 left-1/4 text-5xl opacity-10 animate-float" style={{ animationDelay: '2s', animationDuration: '8s' }}>🎯</span>
        <span className="absolute bottom-16 right-1/3 text-4xl opacity-10 animate-float" style={{ animationDelay: '3s', animationDuration: '6.5s' }}>🧠</span>
        <span className="absolute top-1/2 left-20 text-3xl opacity-10 animate-float" style={{ animationDelay: '1.5s', animationDuration: '7.5s' }}>🔥</span>
        <span className="absolute top-1/3 right-24 text-4xl opacity-10 animate-float" style={{ animationDelay: '2.5s', animationDuration: '6.5s' }}>💡</span>
        <span className="absolute bottom-1/3 left-1/3 text-3xl opacity-10 animate-float" style={{ animationDelay: '0.5s', animationDuration: '8s' }}>⚡</span>
        <span className="absolute top-20 right-1/4 text-4xl opacity-10 animate-float" style={{ animationDelay: '3.5s', animationDuration: '7s' }}>🚀</span>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5 z-10" />
            <input
              type="text"
              placeholder="Search articles, topics, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#6BB371] focus:border-[#6BB371] transition-all duration-300 text-lg"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "bg-[#6BB371] text-white shadow-lg shadow-[#6BB371]/30 scale-105"
                      : "bg-white/10 backdrop-blur-sm text-white/80 hover:bg-white/20 border border-white/20"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}