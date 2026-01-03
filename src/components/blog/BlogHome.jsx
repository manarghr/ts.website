"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight, FaCalendarAlt, FaUser, FaClock, FaDumbbell, FaAppleAlt, FaCarrot, FaFish, FaBreadSlice, FaHeartbeat, FaBicycle, FaRunning } from "react-icons/fa";
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

