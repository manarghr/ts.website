"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { FaArrowLeft, FaUser, FaClock, FaTag } from "react-icons/fa"
import Image from "next/image"

// Extended blog posts data with full content
const allBlogPosts = [
  {
    id: 1,
    title: "10 Essential Exercises for Perfect Form",
    excerpt: "Learn the fundamental movements that will transform your training and prevent injuries.",
    author: "Sarah Johnson",
    date: "March 15, 2024",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
    category: "training",
    content: `Proper form is the foundation of any successful fitness journey. Whether you're a beginner or an experienced athlete, mastering these fundamental exercises will help you build strength safely and effectively.

**1. The Perfect Squat**

Squats are the king of lower body exercises. Start with your feet shoulder-width apart, toes slightly pointed out. As you descend, imagine sitting back into a chair, keeping your chest up and core engaged. Your knees should track over your toes, never caving inward. Drive through your heels to return to standing.

**2. Deadlift Fundamentals**

The deadlift works your entire posterior chain. Stand with feet hip-width apart, barbell over mid-foot. Hinge at the hips, keeping your back flat and chest proud. Grip the bar just outside your legs, then drive through your heels while keeping the bar close to your body.

**3. Push-Up Perfection**

A proper push-up starts in a plank position with hands slightly wider than shoulders. Your body should form a straight line from head to heels. Lower yourself until your chest nearly touches the ground, keeping elbows at a 45-degree angle. Push back up with control.

**4. The Row Variation**

Rows are essential for back development and posture. Whether using dumbbells, barbells, or cables, focus on pulling your shoulder blades together first, then bending your elbows. Keep your core tight and avoid using momentum.

**5. Overhead Press Technique**

Stand with feet hip-width apart, core braced. Press the weight overhead in a straight line, finishing with your biceps by your ears. Avoid arching your lower back by keeping your glutes engaged throughout the movement.

**Common Mistakes to Avoid**

The most common error across all exercises is rushing through movements. Quality always beats quantity. Take time to feel each muscle working and maintain control throughout the entire range of motion.

**Progressive Overload**

Once you've mastered proper form, gradually increase the challenge through added weight, reps, or time under tension. This progressive approach ensures continued gains while minimizing injury risk.

Remember, perfect form takes practice. Don't be discouraged if it feels awkward at first. Consider working with a qualified trainer to ensure you're performing movements correctly before adding significant weight.`
  },
  {
    id: 2,
    title: "Nutrition Tips for Optimal Recovery",
    excerpt: "Discover how proper nutrition can accelerate your recovery and boost performance.",
    author: "Mike Chen",
    date: "March 12, 2024",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800",
    category: "nutrition",
    content: `Recovery isn't just about rest—it's about providing your body with the right nutrients at the right time. Let's explore the science-backed strategies that will help you recover faster and perform better.

**The Anabolic Window: Fact or Fiction?**

While the traditional "30-minute window" has been overstated, consuming protein and carbohydrates within 2-3 hours post-workout does optimize recovery. Your muscles are primed to absorb nutrients during this period, making it an ideal time to refuel.

**Protein Requirements**

Aim for 0.7-1 gram of protein per pound of body weight daily. Post-workout, 20-40 grams of high-quality protein helps kickstart muscle repair. Good sources include lean meats, fish, eggs, Greek yogurt, and plant-based options like legumes and tofu.

**Carbohydrates: The Forgotten Hero**

Carbs replenish glycogen stores depleted during training. After intense workouts, consume 0.5-0.7 grams of carbs per pound of body weight. Choose easily digestible options like rice, potatoes, oats, or fruit.

**Hydration and Electrolytes**

Water is crucial, but don't forget electrolytes. For every pound lost during exercise, drink 16-24 ounces of fluid. If you're training for over an hour or sweating heavily, include sodium, potassium, and magnesium in your recovery routine.

**Anti-Inflammatory Foods**

Include omega-3 rich foods like salmon, walnuts, and flaxseeds to combat exercise-induced inflammation. Colorful fruits and vegetables provide antioxidants that support recovery at the cellular level.

**Sleep and Nutrition**

What you eat before bed matters. A small serving of protein (like cottage cheese or casein protein) provides amino acids throughout the night, supporting muscle repair during sleep.

**Supplement Considerations**

While whole foods should be your priority, certain supplements can support recovery. Creatine, vitamin D, and omega-3s have strong research backing. Consult with a healthcare provider before starting any supplement regimen.

The key to optimal recovery nutrition is consistency. Create a sustainable eating pattern that supports your training goals without causing unnecessary stress or restriction.`
  },
  {
    id: 3,
    title: "How AI is Revolutionizing Fitness",
    excerpt: "Explore the latest AI technology in fitness and how it's changing the way we train.",
    author: "Emily Davis",
    date: "March 10, 2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
    category: "technology",
    content: `Artificial intelligence is transforming the fitness industry in ways we never imagined. From personalized workout plans to real-time form correction, AI is making expert-level training accessible to everyone.

**Personalized Training Programs**

AI algorithms analyze your fitness level, goals, available equipment, and even your injury history to create truly customized workout plans. These programs adapt in real-time based on your performance, energy levels, and recovery needs—something even the best human trainers struggle to do consistently.

**Form Analysis and Correction**

Computer vision technology can now analyze your exercise form through your smartphone or webcam. These systems provide instant feedback on joint angles, movement patterns, and potential injury risks. It's like having a personal trainer watching your every rep.

**Predictive Analytics**

AI can predict when you're at risk of overtraining or injury by analyzing patterns in your performance data, sleep quality, heart rate variability, and more. This proactive approach helps prevent setbacks before they occur.

**Virtual Coaching**

Natural language processing enables AI coaches that can answer questions, provide motivation, and adjust your program through conversational interfaces. These systems learn your preferences and communication style over time, creating increasingly personalized interactions.

**Nutrition Optimization**

AI-powered apps can scan your meals, calculate macros, and provide personalized nutrition recommendations based on your goals and dietary preferences. Some systems even learn which foods you enjoy and suggest meal plans you'll actually follow.

**Recovery Monitoring**

Wearable devices combined with AI algorithms track recovery metrics like heart rate variability, sleep quality, and stress levels. The system then recommends optimal training intensity for each day.

**The Future is Now**

We're just scratching the surface of AI's potential in fitness. Upcoming innovations include augmented reality workout experiences, predictive injury prevention models, and even AI that can detect early signs of health issues through exercise performance patterns.

**The Human Element**

Despite these advances, AI won't replace human trainers—it will enhance them. The best approach combines AI's analytical power with human empathy, motivation, and accountability.

The fitness industry is experiencing a technological revolution, and AI is at its center. Whether you're a gym owner, trainer, or fitness enthusiast, understanding and embracing these tools will be crucial for success in the coming years.`
  },
  // Add more posts with full content as needed
]

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

  const relatedPosts = allBlogPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3)

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
            <h2 className="text-3xl md:text-4xl font-bold text-[#354F52] mb-10">
              Related Articles
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost, index) => (
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