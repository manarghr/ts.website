"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";


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
// Neutral silhouette instead of a stock photograph -- see Coaches.jsx.
const COACH_AVATAR = "/coach-avatar.svg";

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
    return COACH_AVATAR;
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
          <h3 className="text-2xl font-bold text-[#354F52] mb-2">No coaches available</h3>
          <p className="text-gray-600">Check back soon for our expert trainers!</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative bg-white py-20 md:py-28">
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-16">
        {/* Header. Left-aligned, no pill: an eyebrow and a headline carry the
            same information without the template look. */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="eyebrow text-moss">The coaches</p>
            <h2 className="mt-5 max-w-2xl font-display text-display font-bold text-forest">
              Real coaches, real specialisms.
            </h2>
          </div>

          <Link
            href="/coaches"
            className="group inline-flex shrink-0 items-center gap-2 text-base font-semibold text-forest transition-all duration-300 ease-editorial hover:gap-3"
          >
            All coaches
            <FaArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Category switch as quiet text tabs rather than six filled pills.
            The underline marks the active one; nothing else needs to shout. */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-b border-ink/10 pb-4"
        >
          {categoryNames.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`relative pb-2 text-sm font-semibold transition-colors duration-300 ${
                activeCategory === category
                  ? "text-forest"
                  : "text-ink-muted hover:text-forest"
              }`}
            >
              {category}
              <span
                className={`absolute -bottom-[17px] left-0 h-px w-full bg-forest transition-transform duration-300 ease-editorial ${
                  activeCategory === category ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          ))}
        </motion.div>

        {/* Profiles. Portrait-led, no card chrome -- the image is the card. */}
        <div
          className={`mt-14 grid grid-cols-2 gap-x-6 gap-y-12 transition-all duration-500 lg:grid-cols-4 ${
            isChanging ? "translate-y-3 opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
          {activeCategory &&
            categories[activeCategory]?.slice(0, 4).map((coach, i) => (
              <motion.div
                key={`${coach.id}-${activeCategory}-${i}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group"
              >
                <Link href="/coaches" className="block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-bone-dark">
                    <Image
                      src={getCoachImage(coach, i)}
                      alt={coach.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.04]"
                    />
                  </div>

                  <p className="eyebrow mt-5 text-ink-muted">{coach.category}</p>
                  <h3 className="mt-2 font-display text-xl font-bold text-forest">
                    {coach.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">
                    {coach.bio}
                  </p>
                </Link>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
}
