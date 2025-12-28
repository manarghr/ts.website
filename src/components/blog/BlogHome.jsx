"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight, FaCalendarAlt, FaUser, FaClock } from "react-icons/fa";
import Image from "next/image";

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

const blogPosts = [
  {
    id: 1,
    title: "10 Essential Exercises for Perfect Form",
    excerpt: "Learn the fundamental movements that will transform your training and prevent injuries.",
    author: "Sarah Johnson",
    date: "March 15, 2024",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
    category: "Training"
  },
  {
    id: 2,
    title: "Nutrition Tips for Optimal Recovery",
    excerpt: "Discover how proper nutrition can accelerate your recovery and boost performance.",
    author: "Mike Chen",
    date: "March 12, 2024",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800",
    category: "Nutrition"
  },
  {
    id: 3,
    title: "How AI is Revolutionizing Fitness",
    excerpt: "Explore the latest AI technology in fitness and how it's changing the way we train.",
    author: "Emily Davis",
    date: "March 10, 2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
    category: "Technology"
  }
];

export default function BlogHome() {
  return (
    <section className="relative py-12 bg-white overflow-hidden z-10">
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
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10"
        >
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              variants={fadeInUp}
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-[#C8CDC5]/50 hover:border-[#52796F]/50 overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-[#52796F] text-white text-xs font-semibold rounded-full">
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
        </motion.div>

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

