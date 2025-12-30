"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { FaArrowLeft, FaUser, FaClock, FaTag } from "react-icons/fa"
import Image from "next/image"

// Extended blog posts data with full content
export const allBlogPosts = [
     {
    id: 1,
    title: "10 Essential Exercises for Perfect Form",
    excerpt: "Learn the fundamental movements that will transform your training and prevent injuries.",
    author: "Sarah Johnson",
    date: "March 15, 2024",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
    category: "training",
    content: `# 10 Essential Exercises for Perfect Form

Proper form is the foundation of any successful fitness journey. Whether you're a beginner or an experienced athlete, mastering these fundamental exercises will help you build strength safely and effectively.

## 1. Squats
Squats are the king of lower-body exercises. Stand with feet shoulder-width apart, toes slightly pointed out. As you descend, imagine sitting back into a chair, keeping your chest up and core engaged. Drive through your heels to return to standing. Proper form ensures your knees track over your toes and prevents injury.

## 2. Deadlifts
Deadlifts work your entire posterior chain. Begin with feet hip-width apart and barbell over mid-foot. Hinge at the hips, keeping your back flat and chest proud. Grip the bar outside your legs, then lift with controlled motion. Deadlifts build strength in the back, glutes, and hamstrings.

## 3. Push-Ups
A proper push-up starts in a plank position with hands slightly wider than shoulders. Lower your chest toward the ground, keeping elbows at 45 degrees. Push back up with control. This strengthens the chest, triceps, and core while improving shoulder stability.

## 4. Rows
Rows target the back and improve posture. Focus on squeezing shoulder blades together during the pull. Keep core tight and avoid using momentum. Rows can be done with dumbbells, barbells, or cables.

## 5. Overhead Press
Stand with feet hip-width apart, core engaged. Press the weight overhead in a straight line, finishing with your biceps by your ears. Avoid arching your lower back. This strengthens shoulders, arms, and stabilizes the core.

## 6-10. Additional Exercises
Include lunges, planks, pull-ups, hip bridges, and kettlebell swings. Each builds functional strength and targets different muscle groups. Progressive overload and proper recovery ensure continuous improvement.

Perfect form takes practice. Focus on control, technique, and gradual progression. Consulting a qualified trainer can help accelerate results and prevent injuries.`
  },
  {
    id: 4,
    title: "Building Strength: A Complete Guide",
    excerpt: "Everything you need to know about strength training, from beginner to advanced techniques.",
    author: "John Smith",
    date: "March 8, 2024",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
    category: "training",
    content: `# Building Strength: A Complete Guide

Strength training is essential for improving muscle mass, bone density, and overall fitness. This guide covers exercises, programming, and recovery strategies suitable for all levels.

## Core Lifts
Focus on compound lifts like squats, deadlifts, and bench press. These movements recruit multiple muscles, promoting growth and functional strength. Ensure proper technique and start with manageable weights.

## Accessory Work
Add exercises to strengthen weak points and balance your physique. Examples include lunges, rows, tricep extensions, and lateral raises. Accessory work improves overall stability and prevents injuries.

## Programming
Structure workouts using sets, reps, and rest intervals. Beginners may start with 3 sets of 8-12 reps, while advanced athletes can use varied rep ranges and intensity techniques like drop sets and supersets.

## Recovery
Strength gains happen outside the gym. Sleep, nutrition, and active recovery are vital. Include deload weeks periodically to allow muscles and joints to recover.

## Nutrition
Protein intake, sufficient calories, and balanced macros support muscle repair and growth. Hydration and micronutrients optimize performance and recovery.

Strength training is a journey. Consistency, proper form, and intelligent programming are keys to sustainable progress.`
  },
  {
    id: 7,
    title: "HIIT vs Steady State Cardio",
    excerpt: "Discover which cardio method is best for your fitness goals and lifestyle.",
    author: "Alex Turner",
    date: "February 28, 2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800",
    category: "training",
    content: `# HIIT vs Steady State Cardio

Cardiovascular training is essential for heart health, endurance, and fat loss. Choosing the right method depends on your goals, lifestyle, and fitness level.

## High-Intensity Interval Training (HIIT)
HIIT alternates intense exercise bursts with recovery periods. It boosts metabolism, improves VO2 max, and burns calories efficiently. Workouts can be completed in 20-30 minutes, making them time-efficient.

## Steady-State Cardio
Steady-state cardio involves maintaining a consistent pace for extended periods, like jogging or cycling. It enhances aerobic capacity, promotes fat utilization, and is easier on joints compared to HIIT.

## Choosing the Right Cardio
Combine both methods for maximum benefit. Use HIIT for metabolic conditioning and steady-state cardio for endurance and recovery days. Tailor your cardio to your goals, fitness level, and schedule.`
  },

  // Nutrition Articles
  {
    id: 2,
    title: "Nutrition Tips for Optimal Recovery",
    excerpt: "Discover how proper nutrition can accelerate your recovery and boost performance.",
    author: "Mike Chen",
    date: "March 12, 2024",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800",
    category: "nutrition",
    content: `# Nutrition Tips for Optimal Recovery

Recovery is as important as training. Proper nutrition accelerates muscle repair, replenishes energy stores, and reduces soreness.

## Protein
Protein repairs and rebuilds muscles. Consume 0.7-1g per pound of body weight daily, focusing on sources like lean meats, fish, eggs, and legumes.

## Carbohydrates
Replenish glycogen stores with complex carbs such as oats, brown rice, and sweet potatoes. Post-workout carbs help recovery and performance.

## Fats
Healthy fats aid hormone production and support cell function. Include nuts, avocados, olive oil, and fatty fish.

## Hydration & Electrolytes
Water and electrolytes maintain optimal performance and recovery. Consume fluids during and after exercise to replace losses.

## Supplements
Optional supplements like creatine, vitamin D, and omega-3s can enhance recovery. Consult a professional before use.

Consistency in nutrition supports long-term performance improvements and reduces injury risk.`
  },
  {
    id: 5,
    title: "Meal Prep Made Easy",
    excerpt: "Simple strategies to prepare healthy meals for the entire week in just a few hours.",
    author: "Lisa Anderson",
    date: "March 5, 2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1547496502-affa22d38842?w=800",
    category: "nutrition",
    content: `**Meal Prep Made Easy**

Meal prepping simplifies healthy eating and ensures consistency with your diet. With proper planning, you can prepare a week's worth of meals in a few hours.

**Planning**

Decide on your meals, focusing on protein, carbs, and vegetables. Create a grocery list and shop efficiently.

**Cooking**

Batch cook proteins like chicken, fish, or tofu. Roast vegetables and cook grains in large quantities. Portion meals into containers for convenience.

**Storage**

Use airtight containers, label with dates, and refrigerate or freeze to maintain freshness. Rotate meals throughout the week to prevent boredom.

Meal prepping reduces stress, saves money, and improves adherence to nutrition goals.`
  },

  // Technology Articles
  {
    id: 3,
    title: "How AI is Revolutionizing Fitness",
    excerpt: "Explore the latest AI technology in fitness and how it's changing the way we train.",
    author: "Emily Davis",
    date: "March 10, 2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
    category: "technology",
    content: `# How AI is Revolutionizing Fitness

Artificial intelligence is transforming the fitness industry. From personalized workouts to real-time feedback, AI makes expert-level training accessible to everyone.

## Personalized Training
AI analyzes your data and customizes programs for optimal results, considering goals, equipment, and injury history.

## Form Correction
Computer vision tracks movement patterns, providing immediate feedback to prevent injuries and improve performance.

## Predictive Analytics
AI predicts overtraining risks, monitors recovery, and recommends adjustments for better performance.

Embrace AI as a tool to complement your workouts, making your fitness journey more efficient and informed.`
  },
  {
    id: 6,
    title: "Wearable Tech for Fitness Tracking",
    excerpt: "The best fitness wearables and how to use them to optimize your workouts.",
    author: "David Park",
    date: "March 2, 2024",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=800",
    category: "technology",
    content: `# Wearable Tech for Fitness Tracking

Wearables track heart rate, steps, sleep, and performance metrics. Popular devices include smartwatches and fitness trackers.

## Benefits
- Monitor progress over time
- Receive alerts for activity goals
- Track sleep quality
- Optimize training intensity

## Tips
Use data to adjust workouts, prevent overtraining, and stay motivated. Pair wearable insights with personalized coaching for best results.`
  },
  {
    id: 9,
    title: "The Future of Virtual Training",
    excerpt: "How virtual reality and AI are creating the next generation of fitness experiences.",
    author: "Chris Martinez",
    date: "February 22, 2024",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?w=800",
    category: "technology",
    content: `The Future of Virtual Training

Virtual reality and AI are merging to create immersive training experiences. Gamified workouts, real-time corrections, and adaptive programs enhance engagement and results.

## VR Workouts
Simulate environments, track motion, and visualize form. Perfect for home-based training or rehabilitation.

## AI Integration
AI coaches analyze performance and provide personalized guidance. Users can adjust intensity based on feedback, making every session optimized.

Virtual training will continue evolving, offering accessibility, motivation, and innovation for all fitness enthusiasts.`
  },
];


export default function BlogPost({ postId }) {
  const post = allBlogPosts.find(p => p.id === parseInt(postId))

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

  // Get all related posts from the same category
  const relatedPosts = allBlogPosts
    .filter(p => p.category === post.category && p.id !== post.id)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[400px] md:h-[500px] overflow-hidden"
      >
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-4xl mx-auto w-full px-6 md:px-12 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#52796F] text-white rounded-full text-sm font-semibold capitalize">
                  <FaTag className="w-3 h-3" />
                  {getCategoryName(post.category)}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <FaUser className="w-4 h-4" />
                  <span className="font-medium">{post.author}</span>
                </div>
                <span className="text-white/50">•</span>
                <span>{post.date}</span>
                <span className="text-white/50">•</span>
                <div className="flex items-center gap-2">
                  <FaClock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Article Content */}
      <div className="relative bg-white">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#52796F]/5 via-transparent to-[#6BB371]/5 pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-20">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="prose prose-lg max-w-none"
            style={{
              color: '#354F52',
              fontSize: '1.125rem',
              lineHeight: '1.8'
            }}
          >
            {post.content.split('\n\n').map((paragraph, index) => {
              // Check if paragraph is a heading (starts with **)
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                const heading = paragraph.replace(/\*\*/g, '')
                return (
                  <h2 key={index} className="text-2xl md:text-3xl font-bold text-[#354F52] mt-12 mb-6 first:mt-0">
                    {heading}
                  </h2>
                )
              }
              
              // Regular paragraph with potential bold text
              const formattedText = paragraph.split('**').map((text, i) => 
                i % 2 === 1 ? <strong key={i} className="text-[#52796F] font-bold">{text}</strong> : text
              )
              
              return (
                <p key={index} className="text-gray-700 leading-relaxed mb-6">
                  {formattedText}
                </p>
              )
            })}
          </motion.article>

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-16 pt-8 border-t border-[#C8CDC5]/50"
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[#52796F] hover:text-[#354F52] font-semibold text-lg transition-colors group"
            >
              <FaArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to All Articles
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="bg-gradient-to-br from-[#f5f1e8] to-white py-16 md:py-20 border-t border-[#C8CDC5]/50"
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#354F52] mb-2">
                  More {getCategoryName(post.category)} Articles
                </h2>
                <p className="text-gray-600">
                  Explore {relatedPosts.length} more article{relatedPosts.length !== 1 ? 's' : ''} in this category
                </p>
              </div>
              
              <Link 
                href="/blog"
                className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-[#52796F] text-white rounded-xl font-semibold hover:bg-[#354F52] transition-all duration-300 shadow-md hover:shadow-lg"
              >
                View All Articles
                <FaArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.slice(0, 6).map((relatedPost, index) => (
                <motion.div
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                >
                  <Link href={`/blog/${relatedPost.id}`}>
                    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-[#C8CDC5]/50 hover:border-[#52796F]/50 h-full">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4 px-3 py-1 bg-[#52796F] text-white text-xs font-semibold rounded-full capitalize">
                          {getCategoryName(relatedPost.category)}
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-[#354F52] mb-3 group-hover:text-[#52796F] transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <FaClock className="w-3 h-3" />
                          <span>{relatedPost.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}