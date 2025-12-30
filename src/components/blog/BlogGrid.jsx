"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight, FaUser, FaClock } from "react-icons/fa";
import Image from "next/image";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  initial: {},
  whileInView: { 
    transition: { staggerChildren: 0.15 } 
  },
  viewport: { once: true }
};

export default function BlogGrid({ searchTerm, selectedCategory }) {
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

  
}