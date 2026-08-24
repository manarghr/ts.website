"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import picture from "../assets/picture.png";
import { FaBrain, FaChartLine, FaShieldAlt, FaUserMd, FaRocket, FaBolt } from "react-icons/fa";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  initial: {},
  whileInView: { 
    transition: { staggerChildren: 0.15 } 
  },
  viewport: { once: true }
};

export default function AIHome() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const features = [
    {
      icon: FaBrain,
      title: "Real-time Posture Correction",
      description: "Instant AI feedback on your form as you train, ensuring perfect technique every time",
      gradient: "from-[#354F52] to-[#52796F]"
    },
    {
      icon: FaChartLine,
      title: "Advanced Performance Analytics",
      description: "Track your progress with detailed insights and data-driven recommendations",
      gradient: "from-[#52796F] to-[#6BB371]"
    },
    {
      icon: FaUserMd,
      title: "Personalized Training Plans",
      description: "AI-generated workouts customized to your goals, fitness level, and preferences",
      gradient: "from-[#6BB371] to-[#52796F]"
    },
    {
      icon: FaShieldAlt,
      title: "Injury Prevention System",
      description: "Smart alerts and form corrections to keep you safe and training sustainably",
      gradient: "from-[#354F52] to-[#6BB371]"
    },
  ];

  return (
    <section ref={sectionRef} className="relative bg-gradient-to-b from-[#C8CDC5]/30 to-white py-20 md:py-28 overflow-hidden">
      {/* Hand-drawn Grid Background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-pattern-ai" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 Q 76 4, 80 8 Q 84 12, 80 16 Q 76 20, 80 24 Q 84 28, 80 32 Q 76 36, 80 40 Q 84 44, 80 48 Q 76 52, 80 56 Q 84 60, 80 64 Q 76 68, 80 72 Q 84 76, 80 80" stroke="#52796F" strokeWidth="1" fill="none" opacity="0.35"/>
            <path d="M 0 0 Q 4 4, 8 0 Q 12 -4, 16 0 Q 20 4, 24 0 Q 28 -4, 32 0 Q 36 4, 40 0 Q 44 -4, 48 0 Q 52 4, 56 0 Q 60 -4, 64 0 Q 68 4, 72 0 Q 76 -4, 80 0" stroke="#52796F" strokeWidth="1" fill="none" opacity="0.35"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern-ai)" opacity="0.5" />
      </svg>
      
      {/* Animated Background Elements */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-[#52796F]/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#354F52]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-[#6BB371]/10 rounded-full blur-2xl animate-pulse-glow"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        {/* Header Section */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#52796F]/10 border border-[#52796F]/20 rounded-full text-[#52796F] text-sm font-bold uppercase tracking-wider mb-8">
            <FaBolt className="text-[#6BB371] animate-pulse-glow" />
            <span>AI-Powered Technology</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight tracking-tight">
            <span className="text-[#354F52]">Next-Level</span>{" "}
            <span className="block mt-2 bg-gradient-to-r from-[#52796F] via-[#6BB371] to-[#52796F] bg-clip-text text-transparent animate-gradient">
              AI Coaching
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
            Experience the future of fitness training with real-time AI analysis that perfects your form, 
            prevents injuries, and maximizes your performance
          </p>
        </motion.div>

        {/* Main Content - Split Layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Side - Image with Premium Design */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="relative group"
          >
            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-72 h-72  group-hover:scale-150 transition-transform duration-1000" style={{ background: "radial-gradient(circle, rgba(82,121,111,0.1) 0%, transparent 70%)" }}></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64  group-hover:scale-150 transition-transform duration-1000" style={{ background: "radial-gradient(circle, rgba(107,179,113,0.1) 0%, transparent 70%)" }} style={{ transitionDelay: '0.2s' }}></div>
            
            {/* Image Container */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#52796F] to-[#354F52] rounded-[3rem] blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-[#354F52] to-[#52796F] rounded-[3rem] p-8 shadow-2xl group-hover:shadow-[0_40px_80px_rgba(53,79,82,0.3)] transition-all duration-500 overflow-hidden">
                {/* Animated Border */}
                <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-r from-[#6BB371]/20 via-transparent to-[#6BB371]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative rounded-2xl overflow-hidden">
                  <Image
                    src={picture}
                    alt="AI Coaching Technology"
                    priority
                    className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Features Grid */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#C8CDC5]/30 hover:border-[#52796F]/50 overflow-hidden"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Icon */}
                <div className={`relative mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  <feature.icon className="w-8 h-8" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-[#354F52] mb-3 group-hover:text-[#52796F] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {feature.description}
                </p>

                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#6BB371]/5 to-transparent rounded-bl-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-[#354F52] to-[#52796F] rounded-[3rem] p-12 md:p-16 overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-pattern-dots opacity-10"></div>
          <div className="absolute top-0 right-0 w-96 h-96" style={{ background: "radial-gradient(circle, rgba(107,179,113,0.1) 0%, transparent 70%)" }}></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-[120px]"></div>

          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-semibold mb-6">
              <FaRocket className="text-[#6BB371]" />
              <span>Ready to Transform Your Training?</span>
            </div>
            
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
              Experience AI Coaching
              <span className="block text-[#6BB371] mt-2">Free for 14 Days</span>
            </h3>
            
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of athletes who are already training smarter with AI-powered feedback
            </p>
            
            <button className="px-10 py-5 bg-[#6BB371] hover:bg-[#52796F] text-white text-lg font-bold rounded-2xl shadow-2xl hover:shadow-[#6BB371]/50 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
              <span className="absolute inset-0 bg-gradient-to-r from-[#52796F] to-[#6BB371] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative z-10">Start Free Trial</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
