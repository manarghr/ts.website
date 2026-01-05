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
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false);
  const POSTS_PER_PAGE = 3;

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

  // Get one post per category
  const categories = ['training', 'nutrition', 'technology', 'wellness', 'mindset', 'progress'];

  const getOnePerCategory = () => {
    const result = [];
    categories.forEach(cat => {
      const post = allBlogPosts.find(p => p.category === cat);
      if (post) result.push(post);
    });
    return result;
  };

  const filteredPosts = getOnePerCategory();
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  // Ensure currentPage is valid
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [allBlogPosts.length, totalPages, currentPage]);

  // Safe pagination - ensure we don't go out of bounds
  const validPage = currentPage > totalPages && totalPages > 0 ? 1 : currentPage;
  const startIndex = (validPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    const newPage = Math.max(1, Math.min(page, totalPages));
    console.log('Changing to page:', newPage, 'Total pages:', totalPages, 'Filtered posts:', filteredPosts.length);
    setCurrentPage(newPage);
    if (mounted && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Loading state
  if (loading) {
    return (
      <section className="relative py-12 bg-white overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="text-center py-16">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Loading articles...</p>
          </div>
        </div>
      </section>
    );
  }

  console.log('Rendering:', {
    allPosts: allBlogPosts.length,
    filtered: filteredPosts.length,
    currentPage,
    totalPages,
    paginated: paginatedPosts.length,
    startIndex,
    endIndex
  });

  return (
    <section className="relative py-12 bg-white overflow-hidden z-10">
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
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-[#354F52]">Our</span>{" "}
            <span className="text-[#52796F]">Blog</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Expert tips, insights, and stories to help you achieve your fitness goals
          </p>
        </motion.div>

        {/* Blog Posts Grid */}
        {paginatedPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              {paginatedPosts.map((post, index) => (
                <motion.article
                  key={`${post.id}-page-${currentPage}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-[#C8CDC5]/50 hover:border-[#52796F]/50 overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.image || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800"}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800";
                      }}
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-[#52796F] text-white text-xs font-semibold rounded-full capitalize">
                      {post.category}
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
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex justify-center items-center gap-8 mt-16 mb-12"
              >
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className="group p-4 rounded-2xl bg-[#354F52] text-white hover:bg-[#52796F] transition-all duration-300 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl disabled:hover:scale-100"
                >
                  <IoIosArrowBack size={24} className="group-hover:-translate-x-1 transition-transform" />
                </button>

                {/* Page Dots Indicator */}
                <div className="flex gap-3 items-center">
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          currentPage === page
                            ? "bg-[#354F52] w-12 shadow-lg"
                            : "bg-[#C8CDC5] w-2 hover:bg-[#52796F] hover:w-4"
                        }`}
                        aria-label={`Go to page ${page}`}
                      />
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  className="group p-4 rounded-2xl bg-[#354F52] text-white hover:bg-[#52796F] transition-all duration-300 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl disabled:hover:scale-100"
                >
                  <IoIosArrowForward size={24} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}
          </>
        ) : (
          // Empty State
          <div className="text-center py-16 mb-12">
            <div className="text-6xl mb-4">📝</div>
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