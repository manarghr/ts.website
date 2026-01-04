"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { FaArrowRight, FaUser, FaClock } from "react-icons/fa"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"
import Image from "next/image"
import { useRouter } from "next/navigation"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
}

export default function BlogGrid({ searchTerm, selectedCategory, onClearFilters }) {
  const POSTS_PER_PAGE = 6
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter();
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory])

  const [allBlogPosts, setAllBlogPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/blogs')
        const data = await response.json()
        if (data.success) {
          setAllBlogPosts(data.blogs)
        }
      } catch (error) {
        console.error('Error fetching blogs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])


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
    )
  }

  // Filter blog posts based on search term and category
  const filteredPosts = allBlogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)

  const paginatedPosts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)

  // Group posts by category for display
  const getCategoryName = (category) => {
    const names = {
      training: "Training",
      nutrition: "Nutrition",
      technology: "Technology",
      wellness: "Wellness",
      mindset: "Mindset",
      progress: "Progress",
    }
    return names[category] || category
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <section className="relative py-12 bg-white overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#52796F]/5 via-transparent to-[#6BB371]/5"></div>
      <div
        className="absolute inset-0 opacity-35"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cstyle%3E.grid-line%7Bstroke:%2352796F;stroke-width:0.4;fill:none;stroke-linecap:round%7D%3C/style%3E%3C/defs%3E%3Cpath class='grid-line' d='M0 0 Q2 1 0 2 T0 4 T0 6 T0 8 T0 10 T0 12 T0 14 T0 16 T0 18 T0 20 T0 22 T0 24 T0 26 T0 28 T0 30 T0 32 T0 34 T0 36 T0 38 T0 40 T0 42 T0 44 T0 46 T0 48 T0 50 T0 52 T0 54 T0 56 T0 58 T0 60'/%3E%3Cpath class='grid-line' d='M0 0 Q1 2 2 0 T4 0 T6 0 T8 0 T10 0 T12 0 T14 0 T16 0 T18 0 T20 0 T22 0 T24 0 T26 0 T28 0 T30 0 T32 0 T34 0 T36 0 T38 0 T40 0 T42 0 T44 0 T46 0 T48 0 T50 0 T52 0 T54 0 T56 0 T58 0 T60 0'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        {/* Results Count */}
        <div className="mb-8">
          <p className="text-gray-600 text-lg">
            {filteredPosts.length === 0 ? (
              <span>No articles found matching your criteria</span>
            ) : (
              <span>
                Found <strong className="text-[#52796F]">{filteredPosts.length}</strong> article
                {filteredPosts.length !== 1 ? "s" : ""}
                {searchTerm && (
                  <span>
                    {" "}
                    for "<strong>{searchTerm}</strong>"
                  </span>
                )}
                {selectedCategory !== "all" && (
                  <span>
                    {" "}
                    in <strong>{getCategoryName(selectedCategory)}</strong>
                  </span>
                )}
              </span>
            )}
          </p>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="wait">
                {paginatedPosts.map((post, index) => (
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
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800"
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
                      <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">{post.excerpt}</p>

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

            {/*Pagination */}
            {totalPages >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex justify-center items-center gap-8 mt-16"
              >
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className="group p-4 rounded-2xl bg-[#354F52] text-white hover:bg-[#52796F] transition-all duration-300 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl disabled:hover:scale-100"
                >
                  <IoIosArrowBack size={24} className="group-hover:-translate-x-1 transition-transform" />
                </button>

                {/* Page Dots Indicator */}
                <div className="flex gap-3 items-center">
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const page = index + 1
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
                    )
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-[#354F52] mb-2">No articles found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <button
              onClick={() => {
                onClearFilters()
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#52796F] text-white font-semibold rounded-xl hover:bg-[#354F52] transition-all duration-300"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}