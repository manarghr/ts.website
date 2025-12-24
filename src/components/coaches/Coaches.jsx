"use client";
import { useState, useRef, useEffect } from "react";
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

  const categories = {
    Strength: coaches.filter(coach => {
      const cat = normalizeCategory(coach.category);
      return cat === 'strength' || cat === 'fitness' || cat === 'powerlifting';
    }),
    Yoga: coaches.filter(coach => {
      const cat = normalizeCategory(coach.category);
      return cat === 'yoga' || cat === 'meditation' || cat === 'mindfulness';
    }),
    Cardio: coaches.filter(coach => {
      const cat = normalizeCategory(coach.category);
      return cat === 'cardio' || cat === 'hiit' || cat === 'endurance' || cat === 'running';
    }),
  };

  // Helper function to get image for coach
  const getCoachImage = (coach, index) => {
    if (coach.image_url) {
      return coach.image_url;
    }
    // Use default image based on index
    return defaultImages[index % defaultImages.length];
  };

  // Carousel state for each category
  const [carouselIndices, setCarouselIndices] = useState({
    Strength: 0,
    Yoga: 0,
    Cardio: 0,
  });

  const scrollRefs = {
    Strength: useRef(null),
    Yoga: useRef(null),
    Cardio: useRef(null),
  };

  const scrollCarousel = (category, direction) => {
    const container = scrollRefs[category].current;
    if (!container) return;

    const cardWidth = 320; // Card width + gap
    const categoryCoaches = categories[category] || [];
    const maxIndex = categoryCoaches.length - 1;
    const currentIndex = carouselIndices[category];

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

  const categoryIcons = {
    Strength: <FaDumbbell />,
    Yoga: <FaLeaf />,
    Cardio: <FaRunning />,
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
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[180px] md:text-[280px] lg:text-[350px] font-black opacity-5 select-none animate-pulse-glow" style={{
              fontFamily: 'monospace',
              letterSpacing: '20px',
            }}>
              COACHES
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-[#52796F]/30 backdrop-blur-sm border border-[#6BB371]/30 rounded-full text-sm font-medium">
            Expert Trainers
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold uppercase tracking-wide mb-4 animate-fadeInUp">
            MEET OUR
            <span className="block text-[#6BB371] mt-2">COACHES</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            Professional trainers dedicated to your fitness journey
          </p>
        </div>
      </section>

      {/* Coaches Sections */}
      <div className="py-16 md:py-24">
        {/* STRENGTH Section */}
        <section data-section id="strength" className="mb-20">
          <div className="bg-gradient-to-r from-[#C8CDC5] via-[#CAD2C5] to-[#C8CDC5] py-5 mb-10 shadow-md">
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center gap-4">
              <div className="w-12 h-12 bg-[#354F52] rounded-lg flex items-center justify-center text-white text-xl">
                {categoryIcons.Strength}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#354F52] uppercase tracking-wide">
                STRENGTH
              </h2>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-[#354F52] text-lg">Loading coaches...</div>
              </div>
            ) : categories.Strength.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-gray-500 text-lg">No Strength coaches available</div>
              </div>
            ) : (
              <>
                <div
                  ref={scrollRefs.Strength}
                  className="flex gap-8 overflow-x-auto scroll-smooth no-scrollbar snap-x snap-mandatory pb-4"
                >
                  {categories.Strength.map((coach, index) => (
                    <div 
                      key={coach.id || coach._id || index} 
                      className={`snap-center min-w-[320px] fade-in-on-scroll ${isVisible.strength ? 'visible' : ''}`}
                      style={{ transitionDelay: `${index * 0.1}s` }}
                    >
                      <Card
                        id={coach.id}
                        image={getCoachImage(coach, index)}
                        name={coach.name}
                        description={coach.bio || coach.description || 'Professional fitness coach'}
                      />
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={() => scrollCarousel("Strength", "left")}
                  disabled={carouselIndices.Strength === 0}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 w-14 h-14 bg-[#354F52] text-white rounded-full flex items-center justify-center shadow-xl hover:bg-[#52796F] hover:scale-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 z-10 backdrop-blur-sm"
                >
                  <IoIosArrowBack size={26} />
                </button>
                <button
                  onClick={() => scrollCarousel("Strength", "right")}
                  disabled={carouselIndices.Strength === categories.Strength.length - 1}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-14 h-14 bg-[#354F52] text-white rounded-full flex items-center justify-center shadow-xl hover:bg-[#52796F] hover:scale-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 z-10 backdrop-blur-sm"
                >
                  <IoIosArrowForward size={26} />
                </button>
              </>
            )}
          </div>
        </section>

        {/* YOGA Section */}
        <section data-section id="yoga" className="mb-20">
          <div className="bg-gradient-to-r from-[#C8CDC5] via-[#CAD2C5] to-[#C8CDC5] py-5 mb-10 shadow-md">
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center gap-4">
              <div className="w-12 h-12 bg-[#52796F] rounded-lg flex items-center justify-center text-white text-xl">
                {categoryIcons.Yoga}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#354F52] uppercase tracking-wide">
                YOGA
              </h2>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-[#354F52] text-lg">Loading coaches...</div>
              </div>
            ) : categories.Yoga.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-gray-500 text-lg">No Yoga coaches available</div>
              </div>
            ) : (
              <>
                <div
                  ref={scrollRefs.Yoga}
                  className="flex gap-8 overflow-x-auto scroll-smooth no-scrollbar snap-x snap-mandatory pb-4"
                >
                  {categories.Yoga.map((coach, index) => (
                    <div 
                      key={coach.id || coach._id || index} 
                      className={`snap-center min-w-[320px] fade-in-on-scroll ${isVisible.yoga ? 'visible' : ''}`}
                      style={{ transitionDelay: `${index * 0.1}s` }}
                    >
                      <Card
                        id={coach.id}
                        image={getCoachImage(coach, index)}
                        name={coach.name}
                        description={coach.bio || coach.description || 'Professional fitness coach'}
                      />
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={() => scrollCarousel("Yoga", "left")}
                  disabled={carouselIndices.Yoga === 0}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 w-14 h-14 bg-[#354F52] text-white rounded-full flex items-center justify-center shadow-xl hover:bg-[#52796F] hover:scale-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 z-10 backdrop-blur-sm"
                >
                  <IoIosArrowBack size={26} />
                </button>
                <button
                  onClick={() => scrollCarousel("Yoga", "right")}
                  disabled={carouselIndices.Yoga === categories.Yoga.length - 1}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-14 h-14 bg-[#354F52] text-white rounded-full flex items-center justify-center shadow-xl hover:bg-[#52796F] hover:scale-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 z-10 backdrop-blur-sm"
                >
                  <IoIosArrowForward size={26} />
                </button>
              </>
            )}
          </div>
        </section>

        {/* CARDIO Section */}
        <section data-section id="cardio" className="mb-20">
          <div className="bg-gradient-to-r from-[#C8CDC5] via-[#CAD2C5] to-[#C8CDC5] py-5 mb-10 shadow-md">
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center gap-4">
              <div className="w-12 h-12 bg-[#6BB371] rounded-lg flex items-center justify-center text-white text-xl">
                {categoryIcons.Cardio}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#354F52] uppercase tracking-wide">
                CARDIO
              </h2>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-[#354F52] text-lg">Loading coaches...</div>
              </div>
            ) : categories.Cardio.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-gray-500 text-lg">No Cardio coaches available</div>
              </div>
            ) : (
              <>
                <div
                  ref={scrollRefs.Cardio}
                  className="flex gap-8 overflow-x-auto scroll-smooth no-scrollbar snap-x snap-mandatory pb-4"
                >
                  {categories.Cardio.map((coach, index) => (
                    <div 
                      key={coach.id || coach._id || index} 
                      className={`snap-center min-w-[320px] fade-in-on-scroll ${isVisible.cardio ? 'visible' : ''}`}
                      style={{ transitionDelay: `${index * 0.1}s` }}
                    >
                      <Card
                        id={coach.id}
                        image={getCoachImage(coach, index)}
                        name={coach.name}
                        description={coach.bio || coach.description || 'Professional fitness coach'}
                      />
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={() => scrollCarousel("Cardio", "left")}
                  disabled={carouselIndices.Cardio === 0}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 w-14 h-14 bg-[#354F52] text-white rounded-full flex items-center justify-center shadow-xl hover:bg-[#52796F] hover:scale-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 z-10 backdrop-blur-sm"
                >
                  <IoIosArrowBack size={26} />
                </button>
                <button
                  onClick={() => scrollCarousel("Cardio", "right")}
                  disabled={carouselIndices.Cardio === categories.Cardio.length - 1}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-14 h-14 bg-[#354F52] text-white rounded-full flex items-center justify-center shadow-xl hover:bg-[#52796F] hover:scale-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 z-10 backdrop-blur-sm"
                >
                  <IoIosArrowForward size={26} />
                </button>
              </>
            )}
          </div>
        </section>
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
