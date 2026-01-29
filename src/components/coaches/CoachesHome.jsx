"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Card from "./Cardes";
import { Afacad } from "next/font/google";
import Image from "next/image";
import background from "../assets/Group 2046.png";
import Link from "next/link";
import { FaArrowRight, FaUsers, FaStar } from "react-icons/fa";

const afacad = Afacad({ subsets: ["latin"], weight: ["400", "600", "700"], display: "swap" });

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

// Default images array for fallback (using placeholder URLs)
const defaultImages = [
  "https://images.unsplash.com/photo-1571019613452-2df05eb5c3b?w=400",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400",
  "https://images.unsplash.com/photo-1518611012115-8f740f1e1072?w=400",
];

export default function CoachesHome() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Fetch coaches from MongoDB
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/coaches');
        const data = await response.json();
        
        if (data.success && Array.isArray(data.coaches)) {
          setCoaches(data.coaches);
        } else {
          setCoaches([]);
        }
      } catch (err) {
        console.error('Error fetching coaches:', err);
        setCoaches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  // Group coaches by category and get 3 per category
  const getCategoriesWithCoaches = () => {
    const categoryMap = {};
    coaches.forEach(coach => {
      const cat = coach.category || 'Other';
      if (!categoryMap[cat]) {
        categoryMap[cat] = [];
      }
      // Only add if less than 3 coaches in this category
      if (categoryMap[cat].length < 3) {
        categoryMap[cat].push({
          ...coach,
          rating: 5, // Default rating
          clients: Math.floor(Math.random() * 400) + 150 // Random client count for demo
        });
      }
    });
    return categoryMap;
  };

  const categories = getCategoriesWithCoaches();
  const categoryNames = Object.keys(categories);

  // Set initial active category when coaches load
  useEffect(() => {
    if (categoryNames.length > 0 && !activeCategory) {
      setActiveCategory(categoryNames[0]);
    }
  }, [categoryNames.length]);

  // Helper function to get image for coach
  const getCoachImage = (coach, index) => {
    if (coach.image_url) {
      return coach.image_url;
    }
    return defaultImages[index % defaultImages.length];
  };

  // Changement de catégorie avec animation
  const handleCategoryChange = (category) => {
    if (category === activeCategory) return;
    setIsChanging(true);
    setTimeout(() => {
      setActiveCategory(category);
      setIsChanging(false);
    }, 300);
  };

  // Loading state
  if (loading) {
    return (
      <section ref={sectionRef} className="text-center bg-gradient-to-b from-white to-[#C8CDC5]/30 py-20 md:py-28">
        <div className="text-center py-16">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading coaches...</p>
        </div>
      </section>
    );
  }

  // Empty state
  if (coaches.length === 0 || categoryNames.length === 0) {
    return (
      <section ref={sectionRef} className="text-center bg-gradient-to-b from-white to-[#C8CDC5]/30 py-20 md:py-28">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-2xl font-bold text-[#354F52] mb-2">No coaches available</h3>
          <p className="text-gray-600">Check back soon for our expert trainers!</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="text-center bg-gradient-to-b from-white to-[#C8CDC5]/30 py-20 md:py-28 relative overflow-hidden">
      {/* Hand-drawn Grid Background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-pattern-coaches" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 Q 76 4, 80 8 Q 84 12, 80 16 Q 76 20, 80 24 Q 84 28, 80 32 Q 76 36, 80 40 Q 84 44, 80 48 Q 76 52, 80 56 Q 84 60, 80 64 Q 76 68, 80 72 Q 84 76, 80 80" stroke="#52796F" strokeWidth="1" fill="none" opacity="0.35"/>
            <path d="M 0 0 Q 4 4, 8 0 Q 12 -4, 16 0 Q 20 4, 24 0 Q 28 -4, 32 0 Q 36 4, 40 0 Q 44 -4, 48 0 Q 52 4, 56 0 Q 60 -4, 64 0 Q 68 4, 72 0 Q 76 -4, 80 0" stroke="#52796F" strokeWidth="1" fill="none" opacity="0.35"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern-coaches)" opacity="0.5" />
      </svg>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-pattern-dots opacity-15"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-[#52796F]/8 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-[#354F52]/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '2.5s' }}></div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        {/* Enhanced Section Header */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#52796F]/10 border border-[#52796F]/20 rounded-full text-[#52796F] text-sm font-semibold mb-6">
            <FaUsers className="text-[#6BB371]" />
            <span>Expert Trainers</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-[#354F52]">Our Expert</span>{" "}
            <span className="text-[#52796F]">Coaches</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Meet our team of professional trainers dedicated to helping you achieve your fitness goals
          </p>
        </motion.div>

        {/* Enhanced Category Filter Buttons */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className={`flex justify-center gap-4 mb-16 flex-wrap ${afacad.className}`}
        >
          {categoryNames.map((category) => (
            <motion.button
              key={category}
              onClick={() => handleCategoryChange(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-3 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl
                ${activeCategory === category
                  ? "bg-gradient-to-r from-[#354F52] to-[#52796F] text-white scale-105 shadow-xl"
                  : "bg-white text-[#354F52] hover:bg-[#52796F] hover:text-white border-2 border-[#C8CDC5] hover:border-[#52796F]"
                }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Enhanced Coaches Cards Container */}
        <div className="relative">
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-500 
            ${isChanging ? "opacity-0 translate-y-5" : "opacity-100 translate-y-0"}`}
          >
            {activeCategory && categories[activeCategory]?.map((coach, i) => (
              <motion.div
                key={`${coach.id}-${activeCategory}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#C8CDC5]/50 hover:border-[#52796F]/50 overflow-hidden">
                  {/* Gradient Background on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#52796F]/5 to-[#6BB371]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Decorative Corner */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#6BB371]/10 to-transparent rounded-bl-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Coach Image */}
                  <div className="relative mb-6 flex justify-center">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-[#52796F]/20 group-hover:ring-[#52796F]/40 transition-all duration-300">
                      <Image
                        src={getCoachImage(coach, i)}
                        alt={coach.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    {/* Status Badge */}
                    <div className="absolute bottom-0 right-[calc(50%-4rem)] w-6 h-6 bg-[#6BB371] rounded-full border-4 border-white shadow-lg"></div>
                  </div>

                  {/* Coach Info */}
                  <div className="relative z-10 text-center">
                    <h3 className="text-2xl font-bold text-[#354F52] mb-2 group-hover:text-[#52796F] transition-colors">
                      {coach.name}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
                      {coach.bio || coach.description || 'Professional fitness coach'}
                    </p>

                    {/* Stats */}
                    <div className="flex justify-center items-center gap-6 mb-6">
                      <div className="flex items-center gap-1">
                        <FaStar className="text-[#6BB371] w-4 h-4" />
                        <span className="text-sm font-semibold text-[#354F52]">{coach.rating}.0</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaUsers className="text-[#52796F] w-4 h-4" />
                        <span className="text-sm font-semibold text-gray-600">{coach.clients}+ Clients</span>
                      </div>
                    </div>

                    {/* View Profile Button */}
                    <Link
                      href="/coaches"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#354F52] text-white font-semibold rounded-xl hover:bg-[#52796F] hover:shadow-lg transition-all duration-300 group-hover:gap-3"
                    >
                      View Profile
                      <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="mt-12"
        >
          <Link
            href="/coaches"
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#354F52] to-[#52796F] text-white font-bold rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            View All Coaches
            <FaArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}