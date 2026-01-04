"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { FaArrowLeft, FaUser, FaClock, FaTag } from "react-icons/fa"
import Image from "next/image"
import { useState, useEffect } from "react"



export default function BlogPost({ postId }) {
  const [post, setPost] = useState(null)
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
          const foundPost = data.blogs.find(p => p.id === postId)
          setPost(foundPost)
        }
      } catch (error) {
        console.error('Error fetching blog post:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [postId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#52796F]/10 to-[#6BB371]/10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">⏳</div>
          <h1 className="text-4xl font-bold text-[#354F52] mb-4">Loading Article...</h1>
        </motion.div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#52796F]/10 to-[#6BB371]/10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-4xl font-bold text-[#354F52] mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600 mb-8 text-lg">Sorry, we couldn't find the article you're looking for.</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#52796F] text-white rounded-xl font-semibold hover:bg-[#354F52] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </motion.div>
      </div>
    )
  }

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

  const relatedPosts = allBlogPosts
    .filter(p => p.category === post.category && p.id !== post.id)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Enhanced */}
      <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-[#6BB371]/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#52796F]/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 h-full flex items-end">
          <div className="max-w-5xl mx-auto w-full px-6 md:px-12 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {/* Category Badge */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#52796F]/90 backdrop-blur-sm text-white rounded-full text-sm font-bold uppercase tracking-wider mb-6 shadow-lg"
              >
                <FaTag className="w-3 h-3" />
                {getCategoryName(post.category)}
              </motion.div>
              
              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
                {post.title}
              </h1>
              
              {/* Decorative Line */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 96 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="h-1.5 bg-gradient-to-r from-[#6BB371] to-[#52796F] mb-6"
              />
              
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-white/90 text-base">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                    <FaUser className="w-4 h-4" />
                  </div>
                  <span className="font-semibold">{post.author}</span>
                </div>
                <span className="text-white/50">•</span>
                <span className="font-medium">{post.date}</span>
                <span className="text-white/50">•</span>
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                    <FaClock className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{post.readTime}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Article Content Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#52796F]/5 via-transparent to-[#6BB371]/5"></div>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cstyle%3E.grid-line%7Bstroke:%2352796F;stroke-width:0.4;fill:none;stroke-linecap:round%7D%3C/style%3E%3C/defs%3E%3Cpath class='grid-line' d='M0 0 Q2 1 0 2 T0 4 T0 6 T0 8 T0 10 T0 12 T0 14 T0 16 T0 18 T0 20 T0 22 T0 24 T0 26 T0 28 T0 30 T0 32 T0 34 T0 36 T0 38 T0 40 T0 42 T0 44 T0 46 T0 48 T0 50 T0 52 T0 54 T0 56 T0 58 T0 60'/%3E%3Cpath class='grid-line' d='M0 0 Q1 2 2 0 T4 0 T6 0 T8 0 T10 0 T12 0 T14 0 T16 0 T18 0 T20 0 T22 0 T24 0 T26 0 T28 0 T30 0 T32 0 T34 0 T36 0 T38 0 T40 0 T42 0 T44 0 T46 0 T48 0 T50 0 T52 0 T54 0 T56 0 T58 0 T60 0'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}></div>

        {/* Floating Accent Elements */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-[#6BB371]/10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-40 left-10 w-40 h-40 bg-[#52796F]/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="bg-white rounded-3xl shadow-xl p-8 md:p-12 lg:p-16 border border-[#C8CDC5]/30"
          >
            <article className="prose prose-lg max-w-none">
              {post.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  const heading = paragraph.replace(/\*\*/g, '')
                  return (
                    <motion.h2 
                      key={index} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.5 }}
                      className="text-3xl md:text-4xl font-bold text-[#354F52] mt-12 mb-6 first:mt-0 flex items-center gap-3"
                    >
                      <span className="w-2 h-8 bg-gradient-to-b from-[#52796F] to-[#6BB371] rounded-full"></span>
                      {heading}
                    </motion.h2>
                  )
                }
                
                const formattedText = paragraph.split('**').map((text, i) => 
                  i % 2 === 1 ? <strong key={i} className="text-[#52796F] font-bold">{text}</strong> : text
                )
                
                return (
                  <motion.p 
                    key={index} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index, duration: 0.5 }}
                    className="text-gray-700 leading-relaxed mb-6 text-lg"
                  >
                    {formattedText}
                  </motion.p>
                )
              })}
            </article>

            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="mt-16 pt-8 border-t-2 border-[#C8CDC5]/30"
            >
              <Link
                href="/blog"
                className="inline-flex items-center gap-3 text-[#52796F] hover:text-[#354F52] font-bold text-lg transition-all duration-300 group"
              >
                <div className="bg-[#52796F]/10 group-hover:bg-[#52796F] rounded-full p-3 transition-colors duration-300">
                  <FaArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform group-hover:text-white" />
                </div>
                Back to All Articles
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <section className="relative bg-gradient-to-br from-[#CAE5C4]/40 via-[#CAE5C4]/20 to-transparent py-20 md:py-28 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-25" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cstyle%3E.grid-line%7Bstroke:%2352796F;stroke-width:0.3;fill:none;stroke-linecap:round%7D%3C/style%3E%3C/defs%3E%3Cpath class='grid-line' d='M0 0 Q2 1 0 2 T0 4 T0 6 T0 8 T0 10 T0 12 T0 14 T0 16 T0 18 T0 20 T0 22 T0 24 T0 26 T0 28 T0 30 T0 32 T0 34 T0 36 T0 38 T0 40 T0 42 T0 44 T0 46 T0 48 T0 50 T0 52 T0 54 T0 56 T0 58 T0 60'/%3E%3Cpath class='grid-line' d='M0 0 Q1 2 2 0 T4 0 T6 0 T8 0 T10 0 T12 0 T14 0 T16 0 T18 0 T20 0 T22 0 T24 0 T26 0 T28 0 T30 0 T32 0 T34 0 T36 0 T38 0 T40 0 T42 0 T44 0 T46 0 T48 0 T50 0 T52 0 T54 0 T56 0 T58 0 T60 0'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}></div>

          {/* Floating Elements */}
          <div className="absolute top-10 right-20 w-64 h-64 bg-[#6BB371]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-64 h-64 bg-[#52796F]/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-[#354F52] mb-3">
                    More {getCategoryName(post.category)} Articles
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 bg-gradient-to-r from-[#52796F] to-[#6BB371]"></div>
                    <p className="text-gray-600 font-medium">
                      {relatedPosts.length} article{relatedPosts.length !== 1 ? 's' : ''} available
                    </p>
                  </div>
                </div>
                
                <Link 
                  href="/blog"
                  className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-[#52796F] text-white rounded-xl font-semibold hover:bg-[#354F52] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  View All Articles
                  <FaArrowLeft className="w-4 h-4 rotate-180" />
                </Link>
              </div>
            
              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.slice(0, 6).map((relatedPost, index) => (
                  <motion.div
                    key={relatedPost.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                  >
                    <Link href={`/blog/${relatedPost.id}`}>
                      <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#52796F]/30 h-full transform hover:-translate-y-2">
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute top-4 left-4 px-3 py-1.5 bg-[#52796F] text-white text-xs font-bold rounded-full capitalize shadow-lg">
                            {getCategoryName(relatedPost.category)}
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-[#354F52] mb-3 group-hover:text-[#52796F] transition-colors line-clamp-2 leading-tight">
                            {relatedPost.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                            {relatedPost.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <FaClock className="w-3 h-3" />
                              <span className="font-medium">{relatedPost.readTime}</span>
                            </div>
                            <span className="text-[#52796F] font-semibold group-hover:gap-2 inline-flex items-center gap-1 transition-all">
                              Read More
                              <FaArrowLeft className="w-3 h-3 rotate-180 group-hover:translate-x-1 transition-transform" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* View More Buttons */}
              {relatedPosts.length > 6 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6, duration: 0.5 }}
                  className="mt-12 text-center"
                >
                  <Link
                    href={`/blog?category=${post.category}`}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#52796F] to-[#6BB371] text-white rounded-xl font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    View All {getCategoryName(post.category)} Articles ({relatedPosts.length})
                    <FaArrowLeft className="w-5 h-5 rotate-180" />
                  </Link>
                </motion.div>
              )}

              {/* Mobile Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7, duration: 0.5 }}
                className="mt-8 md:hidden text-center"
              >
                <Link 
                  href="/blog"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#52796F] text-[#52796F] rounded-xl font-semibold hover:bg-[#52796F] hover:text-white transition-all duration-300"
                >
                  View All Articles
                  <FaArrowLeft className="w-4 h-4 rotate-180" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  )
}