"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AuthModal from "@/components/auth/AuthModal";
import { 
  FaDumbbell,
  FaBrain,
  FaUtensils,
  FaUserPlus,
  FaSearch,
  FaRocket,
  FaArrowRight,
  FaCheckCircle
} from "react-icons/fa";

export default function ServicesPage() {
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = useRef({});
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const observers = Object.keys(sectionRefs.current).map((key) => {
      return new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [key]: true }));
          }
        },
        { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
      );
    });

    Object.keys(sectionRefs.current).forEach((key, index) => {
      if (sectionRefs.current[key]) {
        observers[index].observe(sectionRefs.current[key]);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2F3E46] via-[#354F52] to-[#2F3E46]" />
        
        {/* Background Image - Horizontal Transparent */}
        <div 
          className="absolute inset-0 z-[1] opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1400')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: 'brightness(1.1) contrast(0.85)'
          }}
        />
        
        {/* SERVICES Text - Background */}
        <div className="absolute inset-0 flex items-center justify-center z-[2]">
          <div className="text-[180px] md:text-[280px] lg:text-[350px] font-black text-white opacity-[0.05] select-none" style={{
            fontFamily: 'var(--font-montserrat), sans-serif',
            letterSpacing: '20px',
            animation: 'heartbeat 4s ease-in-out infinite',
          }}>
            SERVICES
          </div>
        </div>
        
        {/* Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-[#6BB371]/20 rounded-full blur-3xl"
            animate={{
              y: [0, 30, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-[#52796F]/15 rounded-full blur-3xl"
            animate={{
              y: [0, -40, 0],
              x: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>

        <div className="relative h-full flex items-center justify-center px-8 md:px-16 z-10">
          <motion.div 
            ref={(el) => (sectionRefs.current["hero"] = el)}
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible["hero"] ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            <h1 className="text-white text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
              OUR <span className="text-[#6F8676]">SERVICES</span>
            </h1>
            <p className="text-white/95 text-xl md:text-2xl mb-8 mx-auto leading-relaxed font-light whitespace-nowrap">
              An all-in-one fitness platform powered by AI, nutrition guidance, and expert programs.
            </p>
            <motion.div
              initial={{ width: 0 }}
              animate={isVisible["hero"] ? { width: 96 } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="h-1 bg-[#6BB371] mx-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gradient-to-b from-white via-[#C8CDC5]/5 to-white py-24 md:py-32 px-8 md:px-16 relative overflow-hidden">
        {/* Light Grid Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#52796F]/5 via-transparent to-[#6BB371]/5"></div>
        <div className="absolute inset-0 opacity-35 z-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cstyle%3E.grid-line%7Bstroke:%2352796F;stroke-width:0.4;fill:none;stroke-linecap:round%7D%3C/style%3E%3C/defs%3E%3Cpath class='grid-line' d='M0 0 Q2 1 0 2 T0 4 T0 6 T0 8 T0 10 T0 12 T0 14 T0 16 T0 18 T0 20 T0 22 T0 24 T0 26 T0 28 T0 30 T0 32 T0 34 T0 36 T0 38 T0 40 T0 42 T0 44 T0 46 T0 48 T0 50 T0 52 T0 54 T0 56 T0 58 T0 60'/%3E%3Cpath class='grid-line' d='M0 0 Q1 2 2 0 T4 0 T6 0 T8 0 T10 0 T12 0 T14 0 T16 0 T18 0 T20 0 T22 0 T24 0 T26 0 T28 0 T30 0 T32 0 T34 0 T36 0 T38 0 T40 0 T42 0 T44 0 T46 0 T48 0 T50 0 T52 0 T54 0 T56 0 T58 0 T60 0'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
        <div className="absolute inset-0 opacity-25 z-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cstyle%3E.grid-line%7Bstroke:%2352796F;stroke-width:0.3;fill:none;stroke-linecap:round%7D%3C/style%3E%3C/defs%3E%3Cpath class='grid-line' d='M0 0 Q-1 1 0 2 T0 4 T0 6 T0 8 T0 10 T0 12 T0 14 T0 16 T0 18 T0 20 T0 22 T0 24 T0 26 T0 28 T0 30 T0 32 T0 34 T0 36 T0 38 T0 40 T0 42 T0 44 T0 46 T0 48 T0 50 T0 52 T0 54 T0 56 T0 58 T0 60'/%3E%3Cpath class='grid-line' d='M0 0 Q1 -1 2 0 T4 0 T6 0 T8 0 T10 0 T12 0 T14 0 T16 0 T18 0 T20 0 T22 0 T24 0 T26 0 T28 0 T30 0 T32 0 T34 0 T36 0 T38 0 T40 0 T42 0 T44 0 T46 0 T48 0 T50 0 T52 0 T54 0 T56 0 T58 0 T60 0'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
          backgroundPosition: '1px 1px'
        }}></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            ref={(el) => (sectionRefs.current["how-it-works"] = el)}
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible["how-it-works"] ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-[#354F52]">How It</span>{" "}
              <span className="text-[#52796F]">Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              Get started with TrainSight in just a few simple steps
            </p>
            <div className="w-40 h-1.5 bg-gradient-to-r from-transparent via-[#52796F] to-transparent mx-auto rounded-full" />
          </motion.div>

          <div className="relative">
            {/* Animated Connection Line */}
            <motion.div 
              className="hidden md:block absolute top-28 left-0 right-0 h-1 bg-gradient-to-r from-[#354F52]/20 via-[#52796F]/40 to-[#6BB371]/20 rounded-full"
              initial={{ scaleX: 0 }}
              animate={isVisible["how-it-works"] ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.3 }}
              style={{ transformOrigin: "left" }}
            />
            
            <div className="grid md:grid-cols-3 gap-10 md:gap-14 relative">
              {[
                {
                  step: "01",
                  icon: <FaUserPlus className="text-5xl" />,
                  title: "Sign Up & Set Goals",
                  description: "Create your account and tell us about your fitness goals, experience level, and preferences.",
                  color: "from-[#354F52] to-[#52796F]"
                },
                {
                  step: "02",
                  icon: <FaSearch className="text-5xl" />,
                  title: "Explore Services",
                  description: "Browse our programs, AI tools, and meal plans. Choose what fits your journey best.",
                  color: "from-[#52796F] to-[#6BB371]"
                },
                {
                  step: "03",
                  icon: <FaRocket className="text-5xl" />,
                  title: "Start Your Journey",
                  description: "Begin training with personalized guidance, track your progress, and achieve your goals.",
                  color: "from-[#6BB371] to-[#52796F]"
                }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  ref={(el) => {
                    if (!sectionRefs.current[`step-${index}`]) {
                      sectionRefs.current[`step-${index}`] = el;
                    }
                  }}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isVisible[`step-${index}`] ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: index * 0.2 }}
                  className="relative"
                >
                  {/* Enhanced Step Number Badge */}
                  <motion.div 
                    className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#354F52] to-[#52796F] rounded-full blur-lg opacity-50"></div>
                      <div className="relative bg-gradient-to-br from-[#354F52] to-[#52796F] text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl shadow-2xl border-4 border-white">
                        {item.step}
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Animated Arrow */}
                  {index < 2 && (
                    <motion.div 
                      className="hidden md:block absolute top-14 -right-7 z-20"
                      initial={{ opacity: 0, x: -10 }}
                      animate={isVisible[`step-${index}`] ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: index * 0.3 + 0.5 }}
                    >
                      <FaArrowRight className="text-[#52796F] text-3xl opacity-60" />
                    </motion.div>
                  )}
                  
                  {/* Enhanced Card */}
                  <motion.div 
                    className="bg-white rounded-3xl p-10 pt-16 shadow-xl hover:shadow-2xl transition-all duration-500 border border-[#C8CDC5]/30 hover:border-[#52796F]/40 group mt-10 relative overflow-hidden"
                    whileHover={{ y: -8 }}
                  >
                    {/* Animated Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#52796F]/0 via-transparent to-[#6BB371]/0 group-hover:from-[#52796F]/8 group-hover:via-transparent group-hover:to-[#6BB371]/8 transition-all duration-700"></div>
                    
                    {/* Shine Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  </div>

                    <div className="relative z-10">
                      <motion.div 
                        className={`bg-gradient-to-br ${item.color} rounded-2xl p-8 w-28 h-28 flex items-center justify-center text-white mb-8 mx-auto shadow-xl group-hover:shadow-2xl`}
                        whileHover={{ scale: 1.15, rotate: 8 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {item.icon}
                      </motion.div>
                      <h3 className="text-2xl md:text-3xl font-bold text-[#354F52] mb-5 text-center group-hover:text-[#52796F] transition-colors">
                        {item.title}
                        </h3>
                      <p className="text-gray-600 leading-relaxed text-center text-lg">
                        {item.description}
                      </p>
                        </div>
                  </motion.div>
                </motion.div>
                    ))}
                  </div>
                </div>
        </div>
      </section>

      {/* Services Navigation Cards - Horizontal Layout */}
      <section className="bg-white py-20 md:py-28 px-8 md:px-16 relative overflow-hidden">
        {/* Light Grid Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#52796F]/5 via-transparent to-[#6BB371]/5"></div>
        <div className="absolute inset-0 opacity-35 z-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cstyle%3E.grid-line%7Bstroke:%2352796F;stroke-width:0.4;fill:none;stroke-linecap:round%7D%3C/style%3E%3C/defs%3E%3Cpath class='grid-line' d='M0 0 Q2 1 0 2 T0 4 T0 6 T0 8 T0 10 T0 12 T0 14 T0 16 T0 18 T0 20 T0 22 T0 24 T0 26 T0 28 T0 30 T0 32 T0 34 T0 36 T0 38 T0 40 T0 42 T0 44 T0 46 T0 48 T0 50 T0 52 T0 54 T0 56 T0 58 T0 60'/%3E%3Cpath class='grid-line' d='M0 0 Q1 2 2 0 T4 0 T6 0 T8 0 T10 0 T12 0 T14 0 T16 0 T18 0 T20 0 T22 0 T24 0 T26 0 T28 0 T30 0 T32 0 T34 0 T36 0 T38 0 T40 0 T42 0 T44 0 T46 0 T48 0 T50 0 T52 0 T54 0 T56 0 T58 0 T60 0'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
        <div className="absolute inset-0 opacity-25 z-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cstyle%3E.grid-line%7Bstroke:%2352796F;stroke-width:0.3;fill:none;stroke-linecap:round%7D%3C/style%3E%3C/defs%3E%3Cpath class='grid-line' d='M0 0 Q-1 1 0 2 T0 4 T0 6 T0 8 T0 10 T0 12 T0 14 T0 16 T0 18 T0 20 T0 22 T0 24 T0 26 T0 28 T0 30 T0 32 T0 34 T0 36 T0 38 T0 40 T0 42 T0 44 T0 46 T0 48 T0 50 T0 52 T0 54 T0 56 T0 58 T0 60'/%3E%3Cpath class='grid-line' d='M0 0 Q1 -1 2 0 T4 0 T6 0 T8 0 T10 0 T12 0 T14 0 T16 0 T18 0 T20 0 T22 0 T24 0 T26 0 T28 0 T30 0 T32 0 T34 0 T36 0 T38 0 T40 0 T42 0 T44 0 T46 0 T48 0 T50 0 T52 0 T54 0 T56 0 T58 0 T60 0'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
          backgroundPosition: '1px 1px'
        }}></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {/* Programs Card */}
            <motion.div 
              onClick={() => router.push('/services/programs')}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="group relative cursor-pointer bg-gradient-to-br from-[#354F52] to-[#52796F] rounded-3xl p-10 md:p-14 text-white overflow-hidden shadow-2xl hover:shadow-[#354F52]/50 transition-all duration-500"
            >
              {/* Animated Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-all duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800')",
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#354F52]/90 via-[#354F52]/70 to-transparent"></div>
              
              {/* Animated Border Glow */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#6BB371]/20 via-transparent to-[#6BB371]/20 blur-xl"></div>
              </div>
              
              <div className="relative z-10">
                <motion.div 
                  className="mb-8"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FaDumbbell className="text-6xl md:text-7xl drop-shadow-lg" />
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold mb-5 group-hover:text-[#6BB371] transition-colors duration-300">
                  Our Programs
            </h2>
                <p className="text-lg md:text-xl mb-8 leading-relaxed opacity-95 font-light">
                  Structured training programs designed to help you achieve your fitness goals
                </p>
                <motion.div
                  className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-xl font-semibold inline-block group-hover:bg-white group-hover:text-[#354F52] transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore →
                </motion.div>
          </div>
            </motion.div>

            {/* AI Sports Card */}
            <motion.div 
              onClick={() => router.push('/services/ai-sports')}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="group relative cursor-pointer bg-gradient-to-br from-[#52796F] to-[#6BB371] rounded-3xl p-10 md:p-14 text-white overflow-hidden shadow-2xl hover:shadow-[#52796F]/50 transition-all duration-500"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-all duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800')",
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#52796F]/90 via-[#52796F]/70 to-transparent"></div>
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#354F52]/20 via-transparent to-[#354F52]/20 blur-xl"></div>
              </div>
              <div className="relative z-10">
                <motion.div 
                  className="mb-8"
                  whileHover={{ scale: 1.2, rotate: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FaBrain className="text-6xl md:text-7xl drop-shadow-lg" />
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold mb-5 group-hover:text-[#354F52] transition-colors duration-300">
                  AI Sports
                </h2>
                <p className="text-lg md:text-xl mb-8 leading-relaxed opacity-95 font-light">
                  Revolutionize your training with cutting-edge AI technology
                </p>
                <motion.div
                  className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-xl font-semibold inline-block group-hover:bg-white group-hover:text-[#52796F] transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Discover →
                </motion.div>
              </div>
            </motion.div>

            {/* Meal Preparation Card */}
            <motion.div 
              onClick={() => router.push('/services/meals')}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="group relative cursor-pointer bg-gradient-to-br from-[#6BB371] to-[#52796F] rounded-3xl p-10 md:p-14 text-white overflow-hidden shadow-2xl hover:shadow-[#6BB371]/50 transition-all duration-500"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-all duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800')",
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#6BB371]/90 via-[#6BB371]/70 to-transparent"></div>
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#52796F]/20 via-transparent to-[#52796F]/20 blur-xl"></div>
              </div>
              <div className="relative z-10">
                <motion.div 
                  className="mb-8"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FaUtensils className="text-6xl md:text-7xl drop-shadow-lg" />
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold mb-5 group-hover:text-[#354F52] transition-colors duration-300">
                  Meal Prep
                </h2>
                <p className="text-lg md:text-xl mb-8 leading-relaxed opacity-95 font-light">
                  Expert nutrition guidance and meal preparation plans
                </p>
                <motion.div
                  className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-xl font-semibold inline-block group-hover:bg-white group-hover:text-[#6BB371] transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View →
                </motion.div>
            </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="bg-white py-24 md:py-32 px-8 md:px-16 relative overflow-hidden">
        {/* Light Grid Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#52796F]/5 via-transparent to-[#6BB371]/5"></div>
        <div className="absolute inset-0 opacity-35 z-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cstyle%3E.grid-line%7Bstroke:%2352796F;stroke-width:0.4;fill:none;stroke-linecap:round%7D%3C/style%3E%3C/defs%3E%3Cpath class='grid-line' d='M0 0 Q2 1 0 2 T0 4 T0 6 T0 8 T0 10 T0 12 T0 14 T0 16 T0 18 T0 20 T0 22 T0 24 T0 26 T0 28 T0 30 T0 32 T0 34 T0 36 T0 38 T0 40 T0 42 T0 44 T0 46 T0 48 T0 50 T0 52 T0 54 T0 56 T0 58 T0 60'/%3E%3Cpath class='grid-line' d='M0 0 Q1 2 2 0 T4 0 T6 0 T8 0 T10 0 T12 0 T14 0 T16 0 T18 0 T20 0 T22 0 T24 0 T26 0 T28 0 T30 0 T32 0 T34 0 T36 0 T38 0 T40 0 T42 0 T44 0 T46 0 T48 0 T50 0 T52 0 T54 0 T56 0 T58 0 T60 0'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
        <div className="absolute inset-0 opacity-25 z-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cstyle%3E.grid-line%7Bstroke:%2352796F;stroke-width:0.3;fill:none;stroke-linecap:round%7D%3C/style%3E%3C/defs%3E%3Cpath class='grid-line' d='M0 0 Q-1 1 0 2 T0 4 T0 6 T0 8 T0 10 T0 12 T0 14 T0 16 T0 18 T0 20 T0 22 T0 24 T0 26 T0 28 T0 30 T0 32 T0 34 T0 36 T0 38 T0 40 T0 42 T0 44 T0 46 T0 48 T0 50 T0 52 T0 54 T0 56 T0 58 T0 60'/%3E%3Cpath class='grid-line' d='M0 0 Q1 -1 2 0 T4 0 T6 0 T8 0 T10 0 T12 0 T14 0 T16 0 T18 0 T20 0 T22 0 T24 0 T26 0 T28 0 T30 0 T32 0 T34 0 T36 0 T38 0 T40 0 T42 0 T44 0 T46 0 T48 0 T50 0 T52 0 T54 0 T56 0 T58 0 T60 0'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
          backgroundPosition: '1px 1px'
        }}></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            ref={(el) => (sectionRefs.current["included"] = el)}
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible["included"] ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-[#354F52]">What&apos;s</span>{" "}
              <span className="text-[#52796F]">Included</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              Everything you need to succeed, all in one platform
            </p>
            <div className="w-40 h-1.5 bg-gradient-to-r from-transparent via-[#52796F] to-transparent mx-auto rounded-full" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10 relative z-10">
            {[
              {
                title: "Training Programs",
                items: [
                  "Structured workout plans for all fitness levels",
                  "Video demonstrations and form guides",
                  "Progress tracking and analytics",
                  "Customizable program adjustments"
                ],
                icon: <FaDumbbell className="text-5xl" />,
                color: "from-[#354F52] to-[#52796F]"
              },
              {
                title: "AI Technology",
                items: [
                  "Real-time movement analysis",
                  "Form correction and feedback",
                  "Injury prevention alerts",
                  "Performance optimization insights"
                ],
                icon: <FaBrain className="text-5xl" />,
                color: "from-[#52796F] to-[#6BB371]"
              },
              {
                title: "Nutrition Support",
                items: [
                  "Personalized meal plans",
                  "Macro and calorie tracking",
                  "Recipe library and meal prep guides",
                  "Nutritionist consultations"
                ],
                icon: <FaUtensils className="text-5xl" />,
                color: "from-[#6BB371] to-[#52796F]"
              },
              {
                title: "Community & Support",
                items: [
                  "Access to expert coaches",
                  "Community forums and challenges",
                  "24/7 customer support",
                  "Regular updates and new content"
                ],
                icon: <FaUserPlus className="text-5xl" />,
                color: "from-[#354F52] to-[#6BB371]"
              }
            ].map((category, index) => (
              <motion.div
                key={category.title}
                ref={(el) => {
                  if (!sectionRefs.current[`included-${index}`]) {
                    sectionRefs.current[`included-${index}`] = el;
                  }
                }}
                initial={{ opacity: 0, y: 40 }}
                animate={isVisible[`included-${index}`] ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-[#C8CDC5]/40 hover:border-[#52796F]/60 group relative overflow-hidden z-10"
              >
                {/* Animated Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#52796F]/0 via-transparent to-[#6BB371]/0 group-hover:from-[#52796F]/8 group-hover:via-transparent group-hover:to-[#6BB371]/8 transition-all duration-700 rounded-3xl"></div>
                
                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </div>
                
                <div className="relative z-10">
                  <motion.div 
                    className={`bg-gradient-to-br ${category.color} rounded-2xl p-8 w-28 h-28 flex items-center justify-center text-white mb-8 shadow-xl`}
                    whileHover={{ scale: 1.15, rotate: 8 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {category.icon}
                  </motion.div>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#354F52] mb-7 group-hover:text-[#52796F] transition-colors">
                    {category.title}
                </h3>
                  <ul className="space-y-4">
                    {category.items.map((item, idx) => (
                      <motion.li 
                        key={idx} 
                        className="flex items-start gap-4 group/item"
                        initial={{ opacity: 0, x: -10 }}
                        animate={isVisible[`included-${index}`] ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.4, delay: index * 0.1 + idx * 0.1 }}
                      >
                        <div className="mt-1.5 flex-shrink-0">
                          <FaCheckCircle className="text-[#6BB371] text-lg group-hover/item:scale-125 transition-transform duration-300" />
                        </div>
                        <span className="text-gray-600 group-hover/item:text-[#354F52] transition-colors text-lg leading-relaxed">{item}</span>
                      </motion.li>
                  ))}
                </ul>
              </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
