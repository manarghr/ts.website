"use client";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Card from "./Card";
import {
  IoIosArrowBack,
  IoIosArrowForward,
} from "react-icons/io";
import { FaDumbbell, FaRunning, FaYinYang, FaFutbol, FaHeartbeat, FaAppleAlt, FaFire } from "react-icons/fa";
import picture from "../assets/elements.png";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  initial: {},
  whileInView: { 
    transition: { staggerChildren: 0.1 } 
  },
  viewport: { once: true }
};

export default function Services() {
  const scrollRef = useRef(null);
  const sectionRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
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

  const services = [
    { 
      title: "Strength Training", 
      para: "Build muscle and increase power with personalized programs designed for your fitness level.",
      icon: FaDumbbell,
      gradient: "from-[#354F52] to-[#52796F]"
    },
    { 
      title: "Cardio Workouts", 
      para: "Improve endurance and cardiovascular health with dynamic, high-energy training sessions.",
      icon: FaRunning,
      gradient: "from-[#52796F] to-[#6BB371]"
    },
    { 
      title: "Flexibility & Mobility", 
      para: "Enhance range of motion and prevent injuries with targeted stretching and mobility work.",
      icon: FaYinYang,
      gradient: "from-[#6BB371] to-[#52796F]"
    },
    { 
      title: "Sports-Specific Training", 
      para: "Tailored programs for your chosen sport, focusing on performance and skill development.",
      icon: FaFutbol,
      gradient: "from-[#354F52] to-[#6BB371]"
    },
    { 
      title: "Recovery & Rehabilitation", 
      para: "Smart recovery plans to get you back stronger, faster, and ready for your next challenge.",
      icon: FaHeartbeat,
      gradient: "from-[#52796F] to-[#354F52]"
    },
    { 
      title: "Nutrition Guidance", 
      para: "Fuel your body for optimal performance with personalized meal plans and expert advice.",
      icon: FaAppleAlt,
      gradient: "from-[#6BB371] to-[#354F52]"
    },
  ];

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container || !container.children[0]) return;

    const cardElement = container.children[0];
    const cardWidth = cardElement.offsetWidth;
    const gap = 24;
    const scrollAmount = cardWidth + gap;

    let newIndex =
      direction === "left"
        ? Math.max(currentIndex - 1, 0)
        : Math.min(currentIndex + 1, services.length - 1);

    setCurrentIndex(newIndex);
    container.scrollTo({
      left: newIndex * scrollAmount,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container || !container.children[0]) return;

    const scrollLeft = container.scrollLeft;
    const cardElement = container.children[0];
    const cardWidth = cardElement.offsetWidth;
    const gap = 24;
    const scrollAmount = cardWidth + gap;
    const index = Math.round(scrollLeft / scrollAmount);
    
    const clampedIndex = Math.max(0, Math.min(index, services.length - 1));
    if (clampedIndex !== currentIndex) {
      setCurrentIndex(clampedIndex);
    }
  };

  return (
    <section ref={sectionRef} className="bg-white py-20 md:py-28 text-center relative overflow-hidden">
      {/* Hand-drawn Grid Background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-pattern-services" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 Q 76 4, 80 8 Q 84 12, 80 16 Q 76 20, 80 24 Q 84 28, 80 32 Q 76 36, 80 40 Q 84 44, 80 48 Q 76 52, 80 56 Q 84 60, 80 64 Q 76 68, 80 72 Q 84 76, 80 80" stroke="#52796F" strokeWidth="1" fill="none" opacity="0.35"/>
            <path d="M 0 0 Q 4 4, 8 0 Q 12 -4, 16 0 Q 20 4, 24 0 Q 28 -4, 32 0 Q 36 4, 40 0 Q 44 -4, 48 0 Q 52 4, 56 0 Q 60 -4, 64 0 Q 68 4, 72 0 Q 76 -4, 80 0" stroke="#52796F" strokeWidth="1" fill="none" opacity="0.35"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern-services)" opacity="0.5" />
      </svg>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-pattern-waves opacity-10"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#52796F]/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#354F52]/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        {/* Enhanced Header */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#52796F]/10 border border-[#52796F]/20 rounded-full text-[#52796F] text-sm font-bold uppercase tracking-wider mb-8">
            <FaFire className="text-[#6BB371] animate-pulse-glow" />
            <span>Comprehensive Training</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight tracking-tight">
            <span className="text-[#354F52]">Our</span>{" "}
            <span className="bg-gradient-to-r from-[#52796F] via-[#6BB371] to-[#52796F] bg-clip-text text-transparent animate-gradient">
              Training Services
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
            Comprehensive fitness solutions designed to help you achieve your goals, 
            whether you're building strength, improving endurance, or recovering from injury
          </p>
        </motion.div>

        {/* Enhanced Cards Container */}
        <div className="relative">
          <motion.div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar px-4 py-6 flex-nowrap snap-x snap-mandatory"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`snap-center transition-all duration-500 ease-in-out min-w-[320px] md:min-w-[360px] ${
                  currentIndex === index
                    ? "scale-105 z-10"
                    : "opacity-85 scale-95"
                }`}
              >
                <Card
                  image={picture}
                  title={service.title}
                  para={service.para}
                  isActive={currentIndex === index}
                  icon={service.icon}
                  gradient={service.gradient}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced Navigation */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="flex justify-center items-center gap-8 mt-16"
          >
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              disabled={currentIndex === 0}
              className="group p-4 rounded-2xl bg-[#354F52] text-white hover:bg-[#52796F] transition-all duration-300 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl disabled:hover:scale-100"
            >
              <IoIosArrowBack size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>

            {/* Enhanced Dots Indicator */}
            <div className="flex gap-3 items-center">
              {services.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const container = scrollRef.current;
                    if (!container || !container.children[0]) return;
                    const cardElement = container.children[0];
                    const cardWidth = cardElement.offsetWidth;
                    const gap = 24;
                    const scrollAmount = cardWidth + gap;
                    setCurrentIndex(index);
                    container.scrollTo({
                      left: index * scrollAmount,
                      behavior: "smooth",
                    });
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? "bg-[#354F52] w-12 shadow-lg"
                      : "bg-[#C8CDC5] w-2 hover:bg-[#52796F] hover:w-4"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              disabled={currentIndex === services.length - 1}
              className="group p-4 rounded-2xl bg-[#354F52] text-white hover:bg-[#52796F] transition-all duration-300 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl disabled:hover:scale-100"
            >
              <IoIosArrowForward size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
