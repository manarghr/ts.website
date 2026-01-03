"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { FaArrowLeft, FaUser, FaClock, FaTag } from "react-icons/fa"
import Image from "next/image"

// Extended blog posts data with full content
export const allBlogPosts = [
  // Training Articles
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
    id: 4,
    title: "Building Strength: A Complete Guide",
    excerpt: "Everything you need to know about strength training, from beginner to advanced techniques.",
    author: "John Smith",
    date: "March 8, 2024",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
    category: "training",
    content: `Strength training is one of the most effective ways to transform your body, boost metabolism, and improve overall health. This comprehensive guide will take you from the basics to advanced techniques.

**Understanding Strength Training**

Strength training involves using resistance to build muscle mass, increase bone density, and enhance functional fitness. Whether you're using free weights, machines, or bodyweight, the principles remain the same: progressive overload and proper recovery.

**Beginner Foundation**

Start with compound movements that work multiple muscle groups simultaneously. Focus on squats, deadlifts, bench press, rows, and overhead press. Begin with 2-3 sets of 8-12 reps, using weights that challenge you while maintaining perfect form.

**Intermediate Progression**

Once you've built a solid foundation (typically 3-6 months), introduce variation through different rep ranges, tempo training, and exercise variations. Incorporate isolation exercises to target specific muscle groups and address weaknesses.

**Advanced Techniques**

Advanced lifters can experiment with periodization, where you cycle through different phases focusing on strength, hypertrophy, and power. Consider techniques like drop sets, supersets, and pyramid training to push past plateaus.

**Programming Principles**

A well-designed strength program includes adequate volume, intensity, and frequency. Most people benefit from 3-5 training sessions per week, with each muscle group trained 2-3 times weekly for optimal results.

**Recovery and Adaptation**

Muscle growth happens during recovery, not during the workout. Ensure you're getting 7-9 hours of quality sleep, eating adequate protein (0.7-1g per pound of bodyweight), and allowing proper rest between sessions.

**Tracking Progress**

Keep a training log to track weights, reps, and how you feel. Progress isn't always linear, but over months and years, consistent effort compounds into remarkable transformations.

Strength training is a journey, not a destination. Stay consistent, be patient with yourself, and enjoy the process of becoming stronger every day.`
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
    content: `The debate between HIIT and steady-state cardio has divided the fitness community for years. The truth? Both have their place, and the best choice depends on your goals, fitness level, and preferences.

**What is HIIT?**

High-Intensity Interval Training involves short bursts of maximum effort followed by brief recovery periods. A typical session might include 30 seconds of sprinting followed by 90 seconds of walking, repeated for 15-20 minutes.

**What is Steady State Cardio?**

Steady-state cardio involves maintaining a consistent, moderate intensity for an extended period. Think jogging at a conversational pace for 30-60 minutes, or cycling at a steady rhythm.

**Benefits of HIIT**

HIIT is incredibly time-efficient, often delivering results in just 15-20 minutes. It creates an "afterburn effect" where your metabolism stays elevated for hours post-workout. It's excellent for fat loss while preserving muscle mass and improving cardiovascular fitness quickly.

**Benefits of Steady State**

Steady-state cardio is easier to recover from, making it ideal for active recovery days. It builds aerobic base and endurance, burns calories without excessive stress on the body, and is more sustainable for longer periods.

**Which is Better for Fat Loss?**

Both are effective for fat loss. HIIT burns more calories per minute and boosts metabolism post-workout, but steady-state allows you to burn calories for longer periods with less fatigue. The best approach often combines both methods.

**Considerations for Your Choice**

Choose HIIT if you're time-constrained, enjoy intense workouts, have a good fitness base, and want to improve power and speed. Choose steady-state if you're new to exercise, recovering from injury, need low-impact options, or enjoy longer, meditative workouts.

**The Hybrid Approach**

Most successful fitness programs incorporate both. Try 2-3 HIIT sessions weekly for intensity and efficiency, combined with 2-3 steady-state sessions for recovery and aerobic development.

Remember, the best cardio is the one you'll actually do consistently. Choose based on what you enjoy and what fits your lifestyle.`
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
    content: `Recovery isn't just about rest—it's about providing your body with the right nutrients at the right time. Let's explore the science-backed strategies that will help you recover faster and perform better.

**The Anabolic Window**

While the traditional "30-minute window" has been overstated, consuming protein and carbohydrates within 2-3 hours post-workout does optimize recovery. Your muscles are primed to absorb nutrients during this period, making it an ideal time to refuel.

**Protein Requirements**

Aim for 0.7-1 gram of protein per pound of body weight daily. Post-workout, 20-40 grams of high-quality protein helps kickstart muscle repair. Good sources include lean meats, fish, eggs, Greek yogurt, and plant-based options like legumes and tofu.

**Carbohydrates Matter**

Carbs replenish glycogen stores depleted during training. After intense workouts, consume 0.5-0.7 grams of carbs per pound of body weight. Choose easily digestible options like rice, potatoes, oats, or fruit.

**Hydration and Electrolytes**

Water is crucial, but don't forget electrolytes. For every pound lost during exercise, drink 16-24 ounces of fluid. If you're training for over an hour or sweating heavily, include sodium, potassium, and magnesium in your recovery routine.

**Anti-Inflammatory Foods**

Include omega-3 rich foods like salmon, walnuts, and flaxseeds to combat exercise-induced inflammation. Colorful fruits and vegetables provide antioxidants that support recovery at the cellular level.

**Timing Throughout the Day**

Recovery nutrition isn't just about post-workout meals. Distribute protein evenly across 4-5 meals throughout the day for optimal muscle protein synthesis. Each meal should contain 25-40 grams of protein.

**Sleep and Nutrition**

What you eat before bed matters. A small serving of protein (like cottage cheese or casein protein) provides amino acids throughout the night, supporting muscle repair during sleep.

**Supplement Considerations**

While whole foods should be your priority, certain supplements can support recovery. Creatine, vitamin D, and omega-3s have strong research backing. Consult with a healthcare provider before starting any supplement regimen.

The key to optimal recovery nutrition is consistency. Create a sustainable eating pattern that supports your training goals without causing unnecessary stress or restriction.`
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
    content: `Meal prep is the secret weapon of successful fitness enthusiasts. By dedicating just a few hours on the weekend, you can ensure healthy eating throughout your busy week.

**Why Meal Prep Works**

Meal prep removes decision fatigue, saves money, reduces food waste, ensures portion control, and makes it easier to hit your nutrition goals. When healthy food is ready to eat, you're less likely to make impulsive, unhealthy choices.

**Essential Equipment**

Invest in quality storage containers (glass or BPA-free plastic), measuring cups and a food scale, large baking sheets and pans, a slow cooker or instant pot, and sharp knives and cutting boards.

**The Basic Framework**

Start with a simple formula: protein + carbs + vegetables + healthy fats. Choose 2-3 protein sources, 2-3 carb sources, and 3-4 different vegetables. This variety prevents boredom while simplifying your prep.

**Step-by-Step Process**

Begin by planning your meals for the week. Make a detailed shopping list and shop once. Set aside 2-3 hours on Sunday (or your preferred day). Prep ingredients in batches—cook all proteins together, roast all vegetables at once, and batch cook grains.

**Protein Prep Ideas**

Bake chicken breasts with different seasonings, grill lean ground turkey or beef, hard boil a dozen eggs, bake salmon filets, and prepare a large batch of beans or lentils.

**Carb Solutions**

Cook a large pot of brown rice or quinoa, bake sweet potatoes in bulk, prepare overnight oats for breakfasts, and cook pasta for easy meals.

**Vegetable Strategies**

Roast sheet pans of mixed vegetables with olive oil and seasonings. Steam broccoli and cauliflower. Prepare salad ingredients in separate containers. Chop raw veggies for snacking.

**Storage Tips**

Store proteins and carbs separately for flexibility in mixing meals. Keep sauces and dressings separate until eating. Label containers with contents and dates. Most prepped meals last 4-5 days in the fridge.

**Preventing Boredom**

Use different seasonings and marinades to create variety from the same base ingredients. Mix and match components throughout the week. Don't prep all seven days—leave room for 1-2 fresh meals or dining out.

**Time-Saving Hacks**

Use pre-cut vegetables when budget allows, cook multiple dishes simultaneously using oven and stovetop, embrace one-pot meals, and consider a slow cooker or instant pot for hands-off cooking.

Meal prep doesn't have to be perfect. Start small with just a few meals, and gradually expand as you become more comfortable with the process. The goal is consistency, not perfection.`
  },
  {
    id: 8,
    title: "Understanding Macros and Micros",
    excerpt: "A comprehensive guide to macronutrients and micronutrients for optimal health.",
    author: "Dr. Rachel Green",
    date: "February 25, 2024",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800",
    category: "nutrition",
    content: `Understanding macronutrients and micronutrients is fundamental to optimizing your nutrition. This guide breaks down what you need to know about the building blocks of food.

**The Three Macronutrients**

Macronutrients are nutrients your body needs in large amounts: protein, carbohydrates, and fats. Each plays unique and essential roles in your health and performance.

**Protein: The Builder**

Protein is essential for building and repairing tissues, producing enzymes and hormones, and supporting immune function. Aim for 0.7-1 gram per pound of body weight if you're active. Quality sources include lean meats, fish, eggs, dairy, legumes, and plant-based proteins like tofu and tempeh.

**Carbohydrates: The Fuel**

Despite recent trends, carbs are not the enemy. They're your body's preferred energy source, especially for high-intensity exercise. Focus on complex carbohydrates like whole grains, fruits, vegetables, and legumes. Active individuals typically need 2-3 grams per pound of body weight daily.

**Fats: The Essential**

Healthy fats support hormone production, nutrient absorption, and brain health. Aim for 0.3-0.5 grams per pound of body weight. Prioritize sources like avocados, nuts, seeds, olive oil, fatty fish, and coconut oil.

**Understanding Micronutrients**

Micronutrients include vitamins and minerals needed in smaller amounts but equally crucial for health. They support immune function, bone health, energy production, and countless other processes.

**Essential Vitamins**

Vitamin D supports bone health and immune function (get sun exposure or supplement if needed). B vitamins are crucial for energy metabolism (found in whole grains, meat, leafy greens). Vitamin C supports immune health and collagen production (citrus fruits, berries, bell peppers). Vitamin A is important for vision and immune function (orange vegetables, dark leafy greens).

**Critical Minerals**

Iron carries oxygen in blood (red meat, spinach, lentils). Calcium builds strong bones (dairy, fortified plant milks, leafy greens). Magnesium supports muscle function and sleep (nuts, seeds, dark chocolate). Zinc aids immune function and recovery (meat, shellfish, legumes). Potassium regulates fluid balance (bananas, potatoes, avocados).

**Getting Your Micros**

The best approach is eating a rainbow of colorful fruits and vegetables, including variety in protein sources, choosing whole grains over refined grains, eating nuts and seeds regularly, and considering a quality multivitamin as insurance.

**Tracking Macros**

If you choose to track macros, use an app like MyFitnessPal or Cronometer. Start by tracking everything you normally eat for a week to establish a baseline. Then adjust based on your goals—weight loss, maintenance, or muscle gain.

**The 80/20 Approach**

Aim for 80% of your diet to come from nutrient-dense whole foods. The remaining 20% allows flexibility for treats and social occasions. This sustainable approach prevents the all-or-nothing mentality that leads to diet failure.

**Individual Needs**

Remember, these are general guidelines. Your optimal macro split depends on your goals, activity level, age, genetics, and personal preferences. Consider working with a registered dietitian for personalized recommendations.

Nutrition doesn't have to be complicated. Focus on whole foods, eat plenty of protein and vegetables, stay hydrated, and allow yourself flexibility. Consistency over perfection is what creates lasting results.`
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

**Smart Equipment**

Connected fitness equipment uses AI to adjust resistance, suggest workout modifications, and track your progress over time. These smart machines learn your preferences and automatically optimize your training.

**The Future is Now**

We're just scratching the surface of AI's potential in fitness. Upcoming innovations include augmented reality workout experiences, predictive injury prevention models, and even AI that can detect early signs of health issues through exercise performance patterns.

**The Human Element**

Despite these advances, AI won't replace human trainers—it will enhance them. The best approach combines AI's analytical power with human empathy, motivation, and accountability.

**Getting Started with AI Fitness**

You don't need expensive equipment to benefit from AI fitness technology. Many smartphone apps offer AI-powered features for free or at minimal cost. Start by trying form analysis apps, AI workout planners, or smart nutrition trackers.

The fitness industry is experiencing a technological revolution, and AI is at its center. Whether you're a gym owner, trainer, or fitness enthusiast, understanding and embracing these tools will be crucial for success in the coming years.`
  },
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