"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "./Cardes";
import Image from "next/image";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaDumbbell, FaRunning, FaLeaf } from "react-icons/fa";

// Images (fallback)
import picture1 from "../assets/picture1.png";
import picture2 from "../assets/picture2.png";
import picture3 from "../assets/picture3.png";

// Default images array for fallback
const defaultImages = [picture1, picture2, picture3];

export default function Coaches() {
  const [isVisible, setIsVisible] = useState({});
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch coaches from MongoDB API
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/coaches');
        if (!response.ok) {
          throw new Error('Failed to fetch coaches');
        }
        const data = await response.json();
        
        if (data.success && data.coaches) {
          setCoaches(data.coaches);
        } else {
          setCoaches([]);
        }
      } catch (err) {
        console.error('Error fetching coaches:', err);
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
    if (categoryNames.length === 0) return;
    
    const newIndices = {};
    categoryNames.forEach(cat => {
      newIndices[cat] = carouselIndices[cat] || 0;
    });
    setCarouselIndices(prev => ({ ...prev, ...newIndices }));
  }, [coaches.length]);

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
    <div className="min-h-screen bg-gradient-to-b from-white via-[#C8CDC5]/10 to-white">
      {/* Banner Section */}
      <section className="relative bg-gradient-to-br from-[#2F3E46] via-[#354F52] to-[#2F3E46] text-white py-28 md:py-40 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-[#6BB371]/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#52796F]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Repeating COACHES pattern background */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 100px,
              rgba(255,255,255,0.03) 100px,
              rgba(255,255,255,0.03) 200px
            )`,
          }}
        />
        
        {/* Coach Image Background - Horizontal Transparent */}
        <div 
          className="absolute inset-0 z-[1] opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1400')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: 'brightness(1.1) contrast(0.85)'
          }}
        />
        
        {/* COACHES Text - Above the image */}
        <div className="absolute inset-0 flex items-center justify-center z-[2]">
          <div className="text-[180px] md:text-[280px] lg:text-[350px] font-black text-white opacity-[0.05] select-none" style={{
            fontFamily: 'var(--font-montserrat), sans-serif',
            letterSpacing: '20px',
            animation: 'heartbeat 4s ease-in-out infinite',
          }}>
            COACHES
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 animate-fadeInUp">
            Meet Our <span className="text-[#6F8676]">Coaches</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto animate-fadeInUp mb-8" style={{ animationDelay: '0.2s' }}>
            Professional trainers dedicated to your fitness journey
          </p>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-1 bg-[#6BB371] mx-auto"
          />
        </div>
      </section>

      {/* Coaches Sections - Dynamic */}
      <div className="py-16 md:py-24">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-[#354F52] text-lg">Loading coaches...</div>
          </div>
        ) : coaches.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-500 text-lg">No coaches available</div>
          </div>
        ) : categoryNames.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-500 text-lg">
              No categories found. Coaches: {coaches.length}
            </div>
          </div>
        ) : (
          categoryNames.map((categoryName, categoryIndex) => {
            const categoryCoaches = categories[categoryName] || [];
            const categoryId = categoryName.toLowerCase().replace(/\s+/g, '-');
            const categoryColor = getCategoryColor(categoryName, categoryIndex);
            
            return (
              <section key={categoryName} data-section id={categoryId} className="mb-20">
                <div className="bg-gradient-to-r from-[#C8CDC5] via-[#CAD2C5] to-[#C8CDC5] py-5 mb-10 shadow-md">
                  <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl" style={{ backgroundColor: categoryColor }}>
                      {getCategoryIcon(categoryName)}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#354F52] uppercase tracking-wide">
                      {categoryName.toUpperCase()}
                    </h2>
                  </div>
                </div>
                
                <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
                  {categoryCoaches.length === 0 ? (
                    <div className="flex justify-center items-center py-20">
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
                        className="flex gap-8 overflow-x-auto scroll-smooth no-scrollbar snap-x snap-mandatory pb-4"
                        style={{ minHeight: '400px' }}
                      >
                        {categoryCoaches.map((coach, index) => {
                          if (!coach) return null;
                          return (
                            <div 
                              key={coach.id || coach._id || `coach-${categoryName}-${index}`} 
                              className="snap-center min-w-[320px]"
                            >
                              <Card
                                id={coach.id}
                                image={getCoachImage(coach, index)}
                                name={coach.name || 'Unknown Coach'}
                                description={coach.bio || coach.description || 'Professional fitness coach'}
                              />
                            </div>
                          );
                        })}
                      </div>

                      {/* Navigation Arrows */}
                      {categoryCoaches.length > 1 && (
                        <>
                          <button
                            onClick={() => scrollCarousel(categoryName, "left")}
                            disabled={(carouselIndices[categoryName] || 0) === 0}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 w-14 h-14 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 z-10 backdrop-blur-sm"
                            style={{ backgroundColor: categoryColor }}
                            onMouseEnter={(e) => {
                              if (!e.currentTarget.disabled) {
                                e.currentTarget.style.backgroundColor = categoryColor;
                                e.currentTarget.style.opacity = '0.8';
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = categoryColor;
                            }}
                          >
                            <IoIosArrowBack size={26} />
                          </button>
                          <button
                            onClick={() => scrollCarousel(categoryName, "right")}
                            disabled={(carouselIndices[categoryName] || 0) === categoryCoaches.length - 1}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-14 h-14 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 z-10 backdrop-blur-sm"
                            style={{ backgroundColor: categoryColor }}
                            onMouseEnter={(e) => {
                              if (!e.currentTarget.disabled) {
                                e.currentTarget.style.backgroundColor = categoryColor;
                                e.currentTarget.style.opacity = '0.8';
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = categoryColor;
                            }}
                          >
                            <IoIosArrowForward size={26} />
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

      {/* Newsletter Section */}
      <section data-section id="newsletter" className="bg-gradient-to-br from-[#C8CDC5] via-[#CAD2C5] to-[#C8CDC5] py-20 md:py-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-pattern-dots opacity-10"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-[#52796F]/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 left-10 w-56 h-56 bg-[#354F52]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center">
          <div className={`fade-in-on-scroll ${isVisible.newsletter ? 'visible' : ''}`}>
            <div className="inline-block mb-4 px-4 py-2 bg-[#354F52]/10 backdrop-blur-sm border border-[#52796F]/30 rounded-full text-sm font-medium text-[#354F52]">
              Stay Connected
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#354F52] mb-4">
              Join Our Fitness Community
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
              Receive expert insights and exclusive fitness content every week
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="enter your email address"
                className="flex-1 px-6 py-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-[#354F52] text-gray-700 bg-white shadow-md transition-all hover:shadow-lg"
              />
              <button className="px-8 py-4 bg-[#354F52] text-white font-semibold rounded-lg hover:bg-[#52796F] transition-all shadow-lg hover:shadow-xl hover:scale-105 transform">
                Subscribe
              </button>
            </div>
        </div>
      </div>
    </section>
    </div>
  );
}
