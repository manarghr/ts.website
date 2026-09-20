"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";

// Default images array for fallback (using placeholder URLs)
// A coach without a photo gets a neutral silhouette in the site palette,
// not a stock photograph. Borrowed faces on profiles that are not those
// people read as impersonation, however harmless the intent.
const COACH_AVATAR = "/coach-avatar.svg";

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
    return COACH_AVATAR;
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


  // Category colors mapping
  const getCategoryColor = (category, index) => {
    const colors = ['#354F52', '#52796F', '#6BB371', '#4A7C59', '#5A8A6B', '#3D5A4F'];
    return colors[index % colors.length];
  };

  const allCoaches = filteredCategoryNames.flatMap((cat) => filteredCategories[cat] || []);

  return (
    <div className="bg-white">
      {/* Introduction
          --------------------------------------------------------------------
          A compact dark band rather than a 48-unit banner stacked with blurred
          orbs, geometric outlines, a dot grid and a background photograph. The
          page is a directory: its job is to get you to the list quickly, so the
          header states what this is and gets out of the way. */}
      <section className="bg-forest pb-16 pt-16 text-white md:pb-20">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end">
            <div>
              <p className="eyebrow text-moss-light">Coaches</p>
              <h1 className="mt-6 font-display text-display font-extrabold">
                Find someone who
                <span className="block text-white/45">knows your sport.</span>
              </h1>
            </div>

            <p className="max-w-prose leading-relaxed text-white/65 lg:pb-3">
              Every coach here lists the thing they actually specialise in, rather
              than a general claim to do everything. Filter by discipline, or search
              for what you are trying to fix.
            </p>
          </div>
        </div>
      </section>

      {/* Controls. A search field and quiet category tabs -- no filled pills. */}
      <section className="sticky top-[var(--nav-h)] z-30 border-b border-ink/10 bg-white/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <div className="flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-xs">
              <FaSearch className="pointer-events-none absolute left-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search coaches"
                aria-label="Search coaches"
                className="w-full border-0 border-b border-ink/15 bg-transparent py-2 pl-6 text-sm text-ink placeholder:text-ink-muted focus:border-moss focus:outline-none focus:ring-0"
              />
            </div>

            <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`relative pb-1 text-sm font-semibold transition-colors duration-300 ${
                  !selectedCategory ? "text-forest" : "text-ink-muted hover:text-forest"
                }`}
              >
                All
                <span
                  className={`absolute -bottom-[9px] left-0 h-px w-full bg-forest transition-transform duration-300 ease-editorial ${
                    !selectedCategory ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>

              {categoryNames.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`relative pb-1 text-sm font-semibold transition-colors duration-300 ${
                    selectedCategory === category
                      ? "text-forest"
                      : "text-ink-muted hover:text-forest"
                  }`}
                >
                  {category}
                  <span
                    className={`absolute -bottom-[9px] left-0 h-px w-full bg-forest transition-transform duration-300 ease-editorial ${
                      selectedCategory === category ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The directory. Portrait-led, no card chrome: the image is the card and
          a rule underneath carries the metadata. */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-20 lg:px-16">
        <p className="eyebrow mb-10 text-ink-muted">
          {allCoaches.length} {allCoaches.length === 1 ? "coach" : "coaches"}
          {selectedCategory ? ` in ${selectedCategory}` : ""}
        </p>

        {allCoaches.length === 0 ? (
          <div className="border-t border-ink/10 py-20 text-center">
            <p className="font-display text-2xl font-bold text-forest">No coaches match that</p>
            <p className="mt-3 text-ink-soft">Try a different discipline, or clear the search.</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-7 rounded-full bg-forest px-7 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-moss"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-4">
            {allCoaches.map((coach, index) => (
              <motion.article
                key={coach.id || index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="group"
              >
                <Link href={`/coaches/${coach.id}`} className="block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-bone-dark">
                    <Image
                      src={getCoachImage(coach, index)}
                      alt={coach.name || "Coach"}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.04]"
                    />
                  </div>

                  <div className="mt-5 flex items-baseline justify-between gap-3">
                    <p className="eyebrow text-ink-muted">{coach.category}</p>
                    {coach.rating > 0 && (
                      <span className="text-xs font-semibold text-ink-muted">
                        {Number(coach.rating).toFixed(1)}
                      </span>
                    )}
                  </div>

                  <h2 className="mt-2 font-display text-xl font-bold text-forest transition-transform duration-300 ease-editorial group-hover:translate-x-0.5">
                    {coach.name || "Unknown coach"}
                  </h2>

                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">
                    {coach.bio || coach.description || "Professional fitness coach"}
                  </p>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
