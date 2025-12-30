"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FaArrowRight, FaUser, FaClock } from "react-icons/fa";
import Image from "next/image";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
};

export default function BlogGrid({ searchTerm, 
    selectedCategory,
    onClearFilters }) {
  // Extended blog posts with more categories
  const allBlogPosts = [
    // Training Articles
    {
      id: 1,
      title: "10 Essential Exercises for Perfect Form",
      excerpt: "Learn the fundamental movements that will transform your training and prevent injuries.",
      author: "Sarah Johnson",
      date: "March 15, 2024",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
      category: "training"
    },
    {
      id: 4,
      title: "Building Strength: A Complete Guide",
      excerpt: "Everything you need to know about strength training, from beginner to advanced techniques.",
      author: "John Smith",
      date: "March 8, 2024",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
      category: "training"
    },
    {
      id: 7,
      title: "HIIT vs Steady State Cardio",
      excerpt: "Discover which cardio method is best for your fitness goals and lifestyle.",
      author: "Alex Turner",
      date: "February 28, 2024",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800",
      category: "training"
    },
    
    // Nutrition Articles
    {
      id: 2,
      title: "Nutrition Tips for Optimal Recovery",
      excerpt: "Discover how proper nutrition can accelerate your recovery and boost performance.",
      author: "Mike Chen",
      date: "March 12, 2024",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800",
      category: "nutrition"
    },
    {
      id: 5,
      title: "Meal Prep Made Easy",
      excerpt: "Simple strategies to prepare healthy meals for the entire week in just a few hours.",
      author: "Lisa Anderson",
      date: "March 5, 2024",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1547496502-affa22d38842?w=800",
      category: "nutrition"
    },
    {
      id: 8,
      title: "Understanding Macros and Micros",
      excerpt: "A comprehensive guide to macronutrients and micronutrients for optimal health.",
      author: "Dr. Rachel Green",
      date: "February 25, 2024",
      readTime: "9 min read",
      image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800",
      category: "nutrition"
    },
    
    // Technology Articles
    {
      id: 3,
      title: "How AI is Revolutionizing Fitness",
      excerpt: "Explore the latest AI technology in fitness and how it's changing the way we train.",
      author: "Emily Davis",
      date: "March 10, 2024",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
      category: "technology"
    },
    {
      id: 6,
      title: "Wearable Tech for Fitness Tracking",
      excerpt: "The best fitness wearables and how to use them to optimize your workouts.",
      author: "David Park",
      date: "March 2, 2024",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=800",
      category: "technology"
    },
    {
      id: 9,
      title: "The Future of Virtual Training",
      excerpt: "How virtual reality and AI are creating the next generation of fitness experiences.",
      author: "Chris Martinez",
      date: "February 22, 2024",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?w=800",
      category: "technology"
    },
    
    // Wellness Articles
    {
      id: 10,
      title: "The Importance of Rest Days",
      excerpt: "Why recovery is just as important as your workout routine for long-term success.",
      author: "Dr. Amanda White",
      date: "February 20, 2024",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
      category: "wellness"
    },
    {
      id: 11,
      title: "Sleep and Fitness Performance",
      excerpt: "Discover how quality sleep impacts your training results and overall health.",
      author: "Dr. James Wilson",
      date: "February 18, 2024",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800",
      category: "wellness"
    },
    {
      id: 12,
      title: "Managing Stress Through Exercise",
      excerpt: "Learn how physical activity can be your best tool for stress management.",
      author: "Jennifer Lee",
      date: "February 15, 2024",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
      category: "wellness"
    },
    
    // Mindset Articles
    {
      id: 13,
      title: "Building a Growth Mindset in Fitness",
      excerpt: "How changing your mindset can unlock your full potential in training and life.",
      author: "Marcus Thompson",
      date: "February 12, 2024",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800",
      category: "mindset"
    },
    {
      id: 14,
      title: "Overcoming Workout Motivation Slumps",
      excerpt: "Proven strategies to stay motivated even when you don't feel like exercising.",
      author: "Nicole Brown",
      date: "February 10, 2024",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800",
      category: "mindset"
    },
    {
      id: 15,
      title: "The Psychology of Habit Formation",
      excerpt: "Understanding the science behind building lasting fitness habits.",
      author: "Dr. Robert Chang",
      date: "February 8, 2024",
      readTime: "9 min read",
      image: "https://images.unsplash.com/photo-1499728603263-13726abce5fd?w=800",
      category: "mindset"
    },
    
    // Progress Articles
    {
      id: 16,
      title: "Tracking Your Fitness Journey",
      excerpt: "Essential metrics and methods to monitor your progress effectively.",
      author: "Kevin Williams",
      date: "February 5, 2024",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
      category: "progress"
    },
    {
      id: 17,
      title: "Breaking Through Plateaus",
      excerpt: "Strategies to overcome training plateaus and continue making gains.",
      author: "Samantha Cruz",
      date: "February 2, 2024",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
      category: "progress"
    },
    {
      id: 18,
      title: "Setting Realistic Fitness Goals",
      excerpt: "How to set achievable goals that keep you motivated and on track.",
      author: "Tom Anderson",
      date: "January 30, 2024",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800",
      category: "progress"
    },
  ];

  // Filter blog posts based on search term and category
  const filteredPosts = allBlogPosts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === "all" || 
      post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Group posts by category for display
  const getCategoryName = (category) => {
    const names = {
      training: "Training",
      nutrition: "Nutrition",
      technology: "Technology",
      wellness: "Wellness",
      mindset: "Mindset",
      progress: "Progress"
    };
    return names[category] || category;
  };

  return (
    <section className="relative py-12 bg-white overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#52796F]/5 via-transparent to-[#6BB371]/5"></div>
      <div className="absolute inset-0 opacity-35" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cstyle%3E.grid-line%7Bstroke:%2352796F;stroke-width:0.4;fill:none;stroke-linecap:round%7D%3C/style%3E%3C/defs%3E%3Cpath class='grid-line' d='M0 0 Q2 1 0 2 T0 4 T0 6 T0 8 T0 10 T0 12 T0 14 T0 16 T0 18 T0 20 T0 22 T0 24 T0 26 T0 28 T0 30 T0 32 T0 34 T0 36 T0 38 T0 40 T0 42 T0 44 T0 46 T0 48 T0 50 T0 52 T0 54 T0 56 T0 58 T0 60'/%3E%3Cpath class='grid-line' d='M0 0 Q1 2 2 0 T4 0 T6 0 T8 0 T10 0 T12 0 T14 0 T16 0 T18 0 T20 0 T22 0 T24 0 T26 0 T28 0 T30 0 T32 0 T34 0 T36 0 T38 0 T40 0 T42 0 T44 0 T46 0 T48 0 T50 0 T52 0 T54 0 T56 0 T58 0 T60 0'/%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px'
      }}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        {/* Results Count */}
        <div className="mb-8">
          <p className="text-gray-600 text-lg">
            {filteredPosts.length === 0 ? (
              <span>No articles found matching your criteria</span>
            ) : (
              <span>
                Found <strong className="text-[#52796F]">{filteredPosts.length}</strong> article{filteredPosts.length !== 1 ? 's' : ''}
                {searchTerm && <span> for "<strong>{searchTerm}</strong>"</span>}
                {selectedCategory !== "all" && <span> in <strong>{getCategoryName(selectedCategory)}</strong></span>}
              </span>
            )}
          </p>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="wait">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={`${post.id}-${selectedCategory}-${searchTerm}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-[#C8CDC5]/50 hover:border-[#52796F]/50 overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800';
                      }}
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-[#52796F] text-white text-xs font-semibold rounded-full capitalize">
                      {getCategoryName(post.category)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#354F52] mb-3 group-hover:text-[#52796F] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <FaUser className="w-3 h-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaClock className="w-3 h-3" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    <Link
                      href={`/blog/${post.id}`}
                      className="inline-flex items-center gap-2 text-[#52796F] font-semibold hover:text-[#354F52] transition-colors group-hover:gap-3"
                    >
                      Read More
                      <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          // Empty State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-[#354F52] mb-2">No articles found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <button
              onClick={() => {
                onClearFilters();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                }}

              className="inline-flex items-center gap-2 px-6 py-3 bg-[#52796F] text-white font-semibold rounded-xl hover:bg-[#354F52] transition-all duration-300"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}