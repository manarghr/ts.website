"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "./Cardes";
import Image from "next/image";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaDumbbell, FaRunning, FaLeaf, FaSearch, FaTimes, FaFilter } from "react-icons/fa";

// Default images array for fallback (using placeholder URLs)
const defaultImages = [
  "https://images.unsplash.com/photo-1571019613452-2df05eb5c3b?w=400",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400",
  "https://images.unsplash.com/photo-1518611012115-8f740f1e1072?w=400",
];

export default function Coaches() {
  const [isVisible, setIsVisible] = useState({});
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  // Single-select category filter (like Meals). null = all categories.
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch coaches from MongoDB API
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('=== CLIENT: Fetching coaches ===');
        
        const response = await fetch('/api/coaches');
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Response error data:', errorData);
          throw new Error(errorData.error || `Failed to fetch coaches: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('=== CLIENT: Response data ===');
        console.log('Success:', data.success);
        console.log('Coaches count:', data.coaches?.length || 0);
        console.log('Coaches data:', data.coaches);
        
        if (data.success && Array.isArray(data.coaches)) {
          setCoaches(data.coaches);
          console.log('Coaches set successfully:', data.coaches.length);
        } else {
          console.warn('Invalid response format:', data);
          setCoaches([]);
        }
      } catch (err) {
        console.error('=== CLIENT: Error fetching coaches ===');
        console.error('Error:', err);
        console.error('Error message:', err.message);
        setError(err.message);
        setCoaches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('[data-section]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Group coaches by category (case-insensitive)
  const normalizeCategory = (cat) => {
    if (!cat) return '';
    return cat.toLowerCase().trim();
  };

  // Get all unique categories from coaches
  const getAllCategories = () => {
    const categoryMap = {};
    coaches.forEach(coach => {
      if (coach.category) {
        const cat = coach.category.trim();
        if (!categoryMap[cat]) {
          categoryMap[cat] = [];
        }
        categoryMap[cat].push(coach);
      } else {
        // If no category, put in "Other" category
        if (!categoryMap['Other']) {
          categoryMap['Other'] = [];
        }
        categoryMap['Other'].push(coach);
      }
    });
    return categoryMap;
  };

  // Get categories dynamically from coaches data
  const allCategories = getAllCategories();
  
  // Create a sorted list of category names
  const categoryNames = Object.keys(allCategories).sort();
  
  // Filter coaches based on search query and selected categories
  const filteredCategories = useMemo(() => {
    // Create a deep copy of categories to avoid mutating the original
    const filtered = {};
    Object.keys(allCategories).forEach(cat => {
      filtered[cat] = [...(allCategories[cat] || [])];
    });
    
    let result = { ...filtered };
    
    // Filter by selected category (single select)
    if (selectedCategory) {
      const filteredByCategory = {};
      if (result[selectedCategory]) {
        filteredByCategory[selectedCategory] = result[selectedCategory];
      }
      result = filteredByCategory;
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const filteredBySearch = {};
      Object.keys(result).forEach(cat => {
        const matchingCoaches = result[cat].filter(coach => {
          const name = (coach.name || '').toLowerCase();
          const bio = (coach.bio || coach.description || '').toLowerCase();
          const query = searchQuery.toLowerCase();
          return name.includes(query) || bio.includes(query);
        });
        if (matchingCoaches.length > 0) {
          filteredBySearch[cat] = matchingCoaches;
        }
      });
      result = filteredBySearch;
    }
    
    return result;
  }, [coaches, selectedCategory, searchQuery]);
  
  const filteredCategoryNames = Object.keys(filteredCategories).sort();
  
  // Toggle category filter (single select)
  const toggleCategory = (category) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
  };
  
  // Check if any filters are active
  const hasActiveFilters = searchQuery.trim() !== "" || !!selectedCategory;
  
  // Debug: Log categories and coaches
  useEffect(() => {
    if (coaches.length > 0) {
      console.log('=== COACHES DEBUG ===');
      console.log('Total coaches:', coaches.length);
      console.log('Coaches data:', coaches);
      console.log('Categories found:', categoryNames);
      console.log('Categories with coaches:', allCategories);
      categoryNames.forEach(cat => {
        console.log(`Category "${cat}": ${allCategories[cat]?.length || 0} coaches`);
        console.log(`  Coaches:`, allCategories[cat]);
      });
    }
  }, [coaches.length]);
  
  // Map category names to display names and icons
  const categoryDisplayNames = {
    'Strength': 'Strength',
    'Yoga': 'Yoga',
    'Cardio': 'Cardio',
    'Nutrition': 'Nutrition',
    'CrossFit': 'CrossFit',
    'Boxing': 'Boxing',
    'Pilates': 'Pilates',
    'Personal Training': 'Personal Training',
    'Senior Fitness': 'Senior Fitness',
    'Sports Performance': 'Sports Performance',
    'Rehabilitation': 'Rehabilitation',
  };

  // Use dynamic categories or fallback to empty object
  const categories = allCategories;

  // Helper function to get image for coach
  const getCoachImage = (coach, index) => {
    if (coach.image_url) {
      return coach.image_url;
    }
    // Use default image based on index
    return defaultImages[index % defaultImages.length];
  };

  // Carousel state for each category (dynamic)
  const [carouselIndices, setCarouselIndices] = useState({});
  const scrollRefs = useRef({});

  // Initialize carousel state for all categories
  useEffect(() => {
    if (filteredCategoryNames.length === 0) return;
    
    const newIndices = {};
    filteredCategoryNames.forEach(cat => {
      newIndices[cat] = carouselIndices[cat] || 0;
    });
    setCarouselIndices(prev => ({ ...prev, ...newIndices }));
  }, [filteredCategoryNames.length, coaches.length]);

  const scrollCarousel = (category, direction) => {
    const container = scrollRefs.current[category];
    if (!container) return;

    const cardWidth = 320; // Card width + gap
    const categoryCoaches = categories[category] || [];
    const maxIndex = categoryCoaches.length - 1;
    const currentIndex = carouselIndices[category] || 0;

    let newIndex;
    if (direction === "left") {
      newIndex = Math.max(0, currentIndex - 1);
    } else {
      newIndex = Math.min(maxIndex, currentIndex + 1);
    }

    setCarouselIndices((prev) => ({ ...prev, [category]: newIndex }));
    container.scrollTo({
      left: newIndex * cardWidth,
      behavior: "smooth",
    });
  };

  // Category icons mapping
  const getCategoryIcon = (category) => {
    const cat = category.toLowerCase();
    if (cat.includes('strength') || cat.includes('fitness') || cat.includes('powerlifting')) {
      return <FaDumbbell />;
    } else if (cat.includes('yoga') || cat.includes('meditation') || cat.includes('mindfulness') || cat.includes('pilates')) {
      return <FaLeaf />;
    } else if (cat.includes('cardio') || cat.includes('hiit') || cat.includes('endurance') || cat.includes('running') || cat.includes('crossfit')) {
      return <FaRunning />;
    } else {
      return <FaDumbbell />; // Default icon
    }
  };

  // Category colors mapping
  const getCategoryColor = (category, index) => {
    const colors = ['#354F52', '#52796F', '#6BB371', '#4A7C59', '#5A8A6B', '#3D5A4F'];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EDEB] via-[#F2F5F3] to-[#E3E8E6] relative">
      {/* Beautiful Animated Background with more color */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Main colored gradient overlay - more visible */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#DAE4DF]/60 via-[#E8EDEB]/40 to-[#D4DFD9]/50"></div>
        
        {/* Large animated gradient orbs - more colorful and visible */}
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-gradient-to-br from-[#52796F]/20 to-[#6BB371]/15 rounded-full blur-[300px] animate-float"></div>
        <div className="absolute bottom-0 left-0 w-[900px] h-[900px] bg-gradient-to-tr from-[#354F52]/18 to-[#52796F]/15 rounded-full blur-[280px] animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#6BB371]/18 to-[#4A7C59]/12 rounded-full blur-[250px] animate-pulse-glow"></div>
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[#6BB371]/15 rounded-full blur-[220px] animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-[550px] h-[550px] bg-[#52796F]/12 rounded-full blur-[200px] animate-float" style={{ animationDelay: '1s' }}></div>
        
        {/* Grid Pattern Overlay - more visible */}
        <div 
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #354F52 1px, transparent 1px),
              linear-gradient(to bottom, #354F52 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        ></div>
        
        {/* Dot Pattern - more visible */}
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(circle, #52796F 1.5px, transparent 1.5px)',
            backgroundSize: '35px 35px'
          }}
        ></div>
      </div>
      {/* Enhanced Banner Section */}
      <section className="relative bg-gradient-to-br from-[#2F3E46] via-[#354F52] to-[#2F3E46] text-white py-32 md:py-48 overflow-hidden z-10">
        {/* Enhanced Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-[#6BB371]/15 rounded-full blur-[150px] animate-float"></div>
          <div className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-[#52796F]/15 rounded-full blur-[120px] animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6BB371]/10 rounded-full blur-[200px] animate-pulse-glow"></div>
          
          {/* Subtle geometric shapes */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-white/5 rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-white/5 rotate-45"></div>
        </div>

        {/* Coach Image Background */}
        <div 
          className="absolute inset-0 z-[1] opacity-15"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1400')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: 'brightness(1.1) contrast(0.85)'
          }}
        />
        
        {/* COACHES Text Background */}
        <div className="absolute inset-0 flex items-center justify-center z-[2]">
          <div className="text-[200px] md:text-[300px] lg:text-[400px] font-black text-white opacity-[0.04] select-none" style={{
            fontFamily: 'var(--font-montserrat), sans-serif',
            letterSpacing: '25px',
          }}>
            COACHES
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-semibold mb-8">
              <span>Expert Trainers</span>
            </div>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight">
              Meet Our <span className="block mt-2 bg-gradient-to-r from-[#6BB371] to-[#52796F] bg-clip-text text-transparent">Coaches</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed">
              Professional trainers dedicated to your fitness journey
            </p>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-1.5 bg-gradient-to-r from-[#6BB371] to-[#52796F] mx-auto rounded-full"
            />
          </motion.div>
        </div>
      </section>

      {/* Filter Section - styled like Meals */}
      <div className="relative bg-gradient-to-br from-[#2F3E46] via-[#354F52] to-[#2F3E46] py-10 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <span className="absolute top-16 left-10 text-4xl opacity-10 animate-float" style={{ animationDelay: '0s', animationDuration: '6s' }}>🏋️</span>
          <span className="absolute top-24 right-16 text-3xl opacity-10 animate-float" style={{ animationDelay: '1s', animationDuration: '7s' }}>💪</span>
          <span className="absolute bottom-20 left-1/4 text-5xl opacity-10 animate-float" style={{ animationDelay: '2s', animationDuration: '8s' }}>🎯</span>
          <span className="absolute bottom-16 right-1/3 text-4xl opacity-10 animate-float" style={{ animationDelay: '3s', animationDuration: '6.5s' }}>🧠</span>
          <span className="absolute top-1/2 left-20 text-3xl opacity-10 animate-float" style={{ animationDelay: '1.5s', animationDuration: '7.5s' }}>🔥</span>
          <span className="absolute top-1/3 right-24 text-4xl opacity-10 animate-float" style={{ animationDelay: '2.5s', animationDuration: '6.5s' }}>🚀</span>
          <span className="absolute bottom-1/3 left-1/3 text-3xl opacity-10 animate-float" style={{ animationDelay: '0.5s', animationDuration: '8s' }}>⚡</span>
          <span className="absolute top-20 right-1/4 text-4xl opacity-10 animate-float" style={{ animationDelay: '3.5s', animationDuration: '7s' }}>🤸</span>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="relative max-w-2xl mx-auto mb-8">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5 z-10" />
              <input
                type="text"
                placeholder="Search coaches by name or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#6BB371] focus:border-[#6BB371] transition-all duration-300 text-lg"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {/* All categories button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(null)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                  !selectedCategory
                    ? "bg-[#6BB371] text-white shadow-lg shadow-[#6BB371]/30 scale-105"
                    : "bg-white/10 backdrop-blur-sm text-white/80 hover:bg-white/20 border border-white/20"
                }`}
              >
                <span>All</span>
              </motion.button>
              {categoryNames.map((category) => {
                const isSelected = selectedCategory === category;
                return (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleCategory(category)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                      isSelected
                        ? "bg-[#6BB371] text-white shadow-lg shadow-[#6BB371]/30 scale-105"
                        : "bg-white/10 backdrop-blur-sm text-white/80 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    {getCategoryIcon(category)}
                    <span>{category}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-18px);
            }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
        `}</style>
      </div>

      {/* Coaches Sections - Dynamic */}
      <div className="py-16 md:py-24 relative">
        {/* Additional Background Accents */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-[#52796F]/4 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 left-0 w-[350px] h-[350px] bg-[#6BB371]/4 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="relative z-10">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-[#354F52] text-lg">Loading coaches...</div>
          </div>
        ) : coaches.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-500 text-lg">No coaches available</div>
          </div>
        ) : filteredCategoryNames.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="text-gray-500 text-lg mb-4">
              {hasActiveFilters ? "No coaches found matching your filters" : "No categories found. Coaches: " + coaches.length}
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-[#354F52] text-white font-semibold rounded-xl hover:bg-[#52796F] transition-all shadow-lg hover:shadow-xl"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          filteredCategoryNames.map((categoryName, categoryIndex) => {
            const categoryCoaches = filteredCategories[categoryName] || [];
            const categoryId = categoryName.toLowerCase().replace(/\s+/g, '-');
            const categoryColor = getCategoryColor(categoryName, categoryIndex);
            
            return (
              <section key={categoryName} data-section id={categoryId} className="mb-16">
                {/* Simplified Category Header */}
                <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg shadow-lg" style={{ backgroundColor: categoryColor }}>
                      {getCategoryIcon(categoryName)}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-[#354F52]">
                        {categoryName}
                      </h2>
                      <p className="text-gray-600 text-sm mt-0.5">
                        {categoryCoaches.length} {categoryCoaches.length === 1 ? 'coach' : 'coaches'} available
                      </p>
                    </div>
                    <div className="h-px bg-gradient-to-r from-[#C8CDC5] to-transparent flex-1 max-w-32"></div>
                  </div>
                </div>
                
                <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
                  {categoryCoaches.length === 0 ? (
                    <div className="flex justify-center items-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg border border-[#C8CDC5]/30">
                      <div className="text-gray-500 text-lg">No {categoryName} coaches available</div>
                    </div>
                  ) : (
                    <>
                      <div
                        ref={(el) => {
                          if (el) {
                            scrollRefs.current[categoryName] = el;
                          }
                        }}
                        className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar snap-x snap-mandatory pb-6"
                        style={{ minHeight: '520px' }}
                      >
                        {categoryCoaches.map((coach, index) => {
                          if (!coach) return null;
                          return (
                            <div 
                              key={coach.id || coach._id || `coach-${categoryName}-${index}`} 
                              className="snap-center flex-shrink-0"
                            >
                              <Card
                                id={coach.id}
                                image={getCoachImage(coach, index)}
                                name={coach.name || 'Unknown Coach'}
                                description={coach.bio || coach.description || 'Professional fitness coach'}
                                followers={coach.followers_count || 0}
                                rating={coach.rating || 5.0}
                              />
                            </div>
                          );
                        })}
                      </div>

                      {/* Enhanced Navigation Arrows */}
                      {categoryCoaches.length > 1 && (
                        <>
                          <button
                            onClick={() => scrollCarousel(categoryName, "left")}
                            disabled={(carouselIndices[categoryName] || 0) === 0}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 w-16 h-16 text-white rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 hover:shadow-3xl transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 z-10 backdrop-blur-md border-2 border-white/20"
                            style={{ backgroundColor: categoryColor }}
                          >
                            <IoIosArrowBack size={28} />
                          </button>
                          <button
                            onClick={() => scrollCarousel(categoryName, "right")}
                            disabled={(carouselIndices[categoryName] || 0) === categoryCoaches.length - 1}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 w-16 h-16 text-white rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 hover:shadow-3xl transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 z-10 backdrop-blur-md border-2 border-white/20"
                            style={{ backgroundColor: categoryColor }}
                          >
                            <IoIosArrowForward size={28} />
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </section>
            );
          })
        )}
        </div>
      </div>

      {/* Enhanced Newsletter Section */}
      <section data-section id="newsletter" className="bg-gradient-to-br from-[#354F52] via-[#52796F] to-[#354F52] py-24 md:py-32 relative overflow-hidden z-10">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-pattern-dots opacity-5"></div>
          <div className="absolute top-10 right-10 w-96 h-96 bg-[#6BB371]/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
          
          {/* Geometric accents */}
          <div className="absolute top-1/2 right-1/4 w-40 h-40 border border-white/5 rounded-full"></div>
          <div className="absolute bottom-1/4 left-1/4 w-32 h-32 border border-white/5 rotate-45"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-semibold mb-8">
              <span>Stay Connected</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
              Join Our Fitness <span className="text-[#6BB371]">Community</span>
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
              Receive expert insights and exclusive fitness content every week
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-xl border-2 border-white/20 focus:outline-none focus:border-white/40 text-gray-900 bg-white/95 backdrop-blur-sm shadow-xl transition-all hover:shadow-2xl placeholder-gray-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-[#6BB371] text-white font-bold rounded-xl hover:bg-[#52796F] transition-all shadow-xl hover:shadow-2xl"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
