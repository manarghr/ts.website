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

  // The first result leads the page; the rest sit in a secondary grid. On a
  // filtered or searched view the lead is still the most recent match, which
  // keeps the page's shape stable rather than collapsing to a plain grid.
  const [lead, ...rest] = paginatedPosts;

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        <p className="eyebrow border-b border-ink/10 pb-5 text-ink-muted">
          {filteredPosts.length === 0
            ? "No articles found"
            : `${filteredPosts.length} article${filteredPosts.length !== 1 ? "s" : ""}`}
          {searchTerm ? ` for "${searchTerm}"` : ""}
          {selectedCategory !== "all" ? ` in ${getCategoryName(selectedCategory)}` : ""}
        </p>

        {filteredPosts.length > 0 ? (
          <>
            {/* Lead article. Given roughly half the viewport so it reads as an
                editor's pick rather than the first item in a list. */}
            {lead && (
              <motion.article
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="group mt-12"
              >
                <Link href={`/blog/${lead.id}`} className="grid gap-8 lg:grid-cols-2 lg:gap-14">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-bone-dark lg:aspect-[4/3]">
                    <Image
                      src={lead.image || "/blog-covers/training.svg"}
                      alt={lead.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.03]"
                      priority
                    />
                  </div>

                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-4">
                      <span className="eyebrow text-moss">{getCategoryName(lead.category)}</span>
                      <span className="h-px w-8 bg-ink/15" />
                      <span className="text-xs text-ink-muted">{lead.readTime}</span>
                    </div>

                    <h2 className="mt-5 font-display text-display-sm font-extrabold text-forest transition-colors duration-300 group-hover:text-moss">
                      {lead.title}
                    </h2>

                    <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink-soft">
                      {lead.excerpt}
                    </p>

                    <p className="mt-7 text-sm text-ink-muted">
                      {lead.author}
                      {lead.date ? <span className="text-ink-muted/60"> · {lead.date}</span> : null}
                    </p>
                  </div>
                </Link>
              </motion.article>
            )}

            {/* The rest. Typography-led rather than white cards -- the image
                carries the card's job and a rule separates the rows. */}
            {rest.length > 0 && (
              <div className="mt-20 grid gap-x-8 gap-y-14 border-t border-ink/10 pt-14 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: (index % 3) * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    className="group"
                  >
                    <Link href={`/blog/${post.id}`} className="block">
                      <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-bone-dark">
                        <Image
                          src={post.image || "/blog-covers/training.svg"}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.04]"
                        />
                      </div>

                      <div className="mt-5 flex items-center gap-3">
                        <span className="eyebrow text-moss">{getCategoryName(post.category)}</span>
                        <span className="text-xs text-ink-muted">· {post.readTime}</span>
                      </div>

                      <h3 className="mt-3 font-display text-xl font-bold leading-snug text-forest transition-colors duration-300 group-hover:text-moss">
                        {post.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 leading-relaxed text-ink-soft">
                        {post.excerpt}
                      </p>

                      <p className="mt-4 text-sm text-ink-muted">{post.author}</p>
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}

            {/* Pagination, reduced to what it needs to be. */}
            {totalPages > 1 && (
              <div className="mt-20 flex items-center justify-between border-t border-ink/10 pt-8">
                <button
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="text-sm font-semibold text-forest transition-opacity duration-300 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Previous
                </button>

                <p className="eyebrow text-ink-muted">
                  {currentPage} / {totalPages}
                </p>

                <button
                  onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="text-sm font-semibold text-forest transition-opacity duration-300 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-24 text-center">
            <h3 className="font-display text-2xl font-bold text-forest">No articles found</h3>
            <p className="mt-3 text-ink-soft">
              Try a different search or category.
            </p>
            <button
              onClick={() => {
                onClearFilters();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="mt-7 rounded-full bg-forest px-7 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-moss"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
