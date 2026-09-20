"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight, FaCalendarAlt, FaUser, FaClock, FaDumbbell, FaAppleAlt, FaCarrot, FaFish, FaBreadSlice, FaHeartbeat, FaBicycle, FaRunning } from "react-icons/fa";
import Image from "next/image";
import { useState, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

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

export default function BlogHome() {
  // State management
  const [allBlogPosts, setAllBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch logic
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/blogs');
        const data = await response.json();
        if (data.success) {
          setAllBlogPosts(data.blogs);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // One article per category, with the categories taken from the articles
  // themselves. The previous version compared against a hardcoded lowercase
  // list, so a post in any other category -- or the same one capitalised
  // differently -- vanished, and the section claimed there were no articles
  // while the database was full.
  const getOnePerCategory = () => {
    const seen = new Set();
    const result = [];

    for (const post of allBlogPosts) {
      const key = (post.category || "uncategorised").toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      result.push(post);
    }

    return result;
  };

  const filteredPosts = getOnePerCategory();
  const totalSlides = filteredPosts.length;
  const activePost = filteredPosts[Math.min(current, Math.max(0, totalSlides - 1))];

  const goTo = (next) => {
    if (totalSlides === 0) return;
    // Wrap around, so neither arrow is ever a dead end.
    setCurrent(((next % totalSlides) + totalSlides) % totalSlides);
  };

  // Keep the slide in range if the article list changes under it.
  useEffect(() => {
    if (current >= filteredPosts.length) setCurrent(0);
  }, [filteredPosts.length, current]);

  // Loading state
  if (loading) {
    return (
      <section className="relative py-12 bg-white overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="text-center py-16">
            <p className="text-gray-600">Loading articles...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 md:py-28 bg-white overflow-hidden z-10">
      {/* Floating Gym and Food Icons Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Gym Icons */}
        <div className="absolute top-[10%] left-[5%] opacity-10 animate-float">
          <FaDumbbell className="w-12 h-12 text-[#52796F]" />
        </div>
        <div className="absolute top-[60%] left-[8%] opacity-15 animate-float" style={{ animationDelay: '1s', animationDuration: '6s' }}>
          <FaRunning className="w-10 h-10 text-[#354F52]" />
        </div>
        <div className="absolute bottom-[15%] right-[10%] opacity-12 animate-float" style={{ animationDelay: '2.5s', animationDuration: '7s' }}>
          <FaDumbbell className="w-14 h-14 text-[#6BB371]" />
        </div>
        <div className="absolute top-[40%] right-[5%] opacity-15 animate-float" style={{ animationDelay: '1.5s', animationDuration: '8s' }}>
          <FaBicycle className="w-11 h-11 text-[#52796F]" />
        </div>
        <div className="absolute top-[25%] left-[15%] opacity-10 animate-pulse-glow" style={{ animationDelay: '0.5s' }}>
          <FaHeartbeat className="w-10 h-10 text-[#6BB371]" />
        </div>

        {/* Food Icons */}
        <div className="absolute top-[30%] right-[12%] opacity-15 animate-pulse-glow" style={{ animationDelay: '0.8s' }}>
          <FaAppleAlt className="w-10 h-10 text-[#52796F]" />
        </div>
        <div className="absolute bottom-[30%] left-[12%] opacity-12 animate-pulse-glow" style={{ animationDelay: '2s' }}>
          <FaCarrot className="w-12 h-12 text-[#6BB371]" />
        </div>
        <div className="absolute top-[50%] left-[20%] opacity-15 animate-float" style={{ animationDelay: '1.2s', animationDuration: '6.5s' }}>
          <FaFish className="w-11 h-11 text-[#354F52]" />
        </div>
        <div className="absolute bottom-[20%] right-[15%] opacity-10 animate-float" style={{ animationDelay: '2.2s', animationDuration: '7.5s' }}>
          <FaBreadSlice className="w-12 h-12 text-[#52796F]" />
        </div>
        <div className="absolute top-[70%] right-[25%] opacity-15 animate-pulse-glow" style={{ animationDelay: '1.8s' }}>
          <FaAppleAlt className="w-9 h-9 text-[#6BB371]" />
        </div>
        <div className="absolute bottom-[40%] right-[8%] opacity-12 animate-float" style={{ animationDelay: '3s', animationDuration: '6.8s' }}>
          <FaCarrot className="w-10 h-10 text-[#354F52]" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#52796F]/10 border border-[#52796F]/20 rounded-full text-[#52796F] text-sm font-semibold mb-6">
            <FaCalendarAlt className="text-[#6BB371]" />
            <span>Latest Articles</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="text-[#354F52]">Our</span>{" "}
            <span className="text-[#52796F]">Blog</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Expert tips, insights, and stories to help you achieve your fitness goals
          </p>
        </motion.div>

        {/* Blog Posts Grid */}
        {totalSlides > 0 && activePost ? (
          <>
            {/* One article at a time. A single wide card reads better on a
                landing page than a grid of three narrow ones, and the arrows
                make it obvious there is more behind it. */}
            <div className="relative mb-10">
              <motion.article
                key={activePost.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35 }}
                className="group mx-auto grid max-w-5xl overflow-hidden rounded-2xl border border-[#C8CDC5]/60 bg-white shadow-md transition-all duration-300 hover:shadow-xl md:grid-cols-2"
              >
                <div className="relative h-56 overflow-hidden md:h-full md:min-h-[320px]">
                  <Image
                    src={activePost.image || "/video-placeholder.svg"}
                    alt={activePost.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-4 top-4 rounded-full bg-[#52796F] px-3 py-1 text-xs font-semibold capitalize text-white">
                    {activePost.category}
                  </div>
                </div>

                <div className="flex flex-col justify-center p-6 md:p-10">
                  <h3 className="mb-3 text-2xl font-bold text-[#354F52] transition-colors group-hover:text-[#52796F] md:text-3xl">
                    {activePost.title}
                  </h3>
                  <p className="mb-5 leading-relaxed text-gray-600 line-clamp-3">
                    {activePost.excerpt}
                  </p>

                  <div className="mb-6 flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FaUser className="h-3 w-3" />
                      <span>{activePost.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaClock className="h-3 w-3" />
                      <span>{activePost.readTime}</span>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${activePost.id}`}
                    className="inline-flex w-fit items-center gap-2 font-semibold text-[#52796F] transition-all hover:gap-3 hover:text-[#354F52]"
                  >
                    Read More
                    <FaArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.article>

              {totalSlides > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => goTo(current - 1)}
                    aria-label="Previous article"
                    className="absolute left-0 top-1/2 -translate-y-1/2 rounded-2xl bg-[#354F52] p-3 text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#52796F] lg:-left-6"
                  >
                    <IoIosArrowBack size={22} />
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo(current + 1)}
                    aria-label="Next article"
                    className="absolute right-0 top-1/2 -translate-y-1/2 rounded-2xl bg-[#354F52] p-3 text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#52796F] lg:-right-6"
                  >
                    <IoIosArrowForward size={22} />
                  </button>
                </>
              )}
            </div>

            {totalSlides > 1 && (
              <div className="mb-12 flex justify-center gap-2">
                {filteredPosts.map((post, index) => (
                  <button
                    key={post.id}
                    type="button"
                    onClick={() => setCurrent(index)}
                    aria-label={`Go to article ${index + 1}`}
                    aria-current={index === current}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === current ? "w-8 bg-[#354F52]" : "w-2 bg-[#C8CDC5] hover:bg-[#52796F]"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          // Empty State
          <div className="text-center py-16 mb-12">
            <h3 className="text-2xl font-bold text-[#354F52] mb-2">No articles yet</h3>
            <p className="text-gray-600">Check back soon for new content!</p>
          </div>
        )}

        {/* View All Button */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#354F52] text-white font-bold rounded-2xl hover:bg-[#52796F] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            View All Articles
            <FaArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}