"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function BlogHero() {
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = useRef({});

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
    <div className="w-full overflow-hidden bg-white">
      {/* Hero Section with Parallax Effect */}
      <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2F3E46] via-[#354F52] to-[#2F3E46]" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-[#6BB371]/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#52796F]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Background Image - Horizontal Transparent */}
        <div 
          className="absolute inset-0 z-[1] opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1456613820599-bfe244172af5?w=1400')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: 'brightness(1.1) contrast(0.85)'
          }}
        />
        
        {/* OUR BLOG Text - Above the image */}
        <div className="absolute inset-0 flex items-center justify-center z-[2]">
          <div className="text-[120px] md:text-[200px] lg:text-[280px] font-black text-white opacity-[0.05] select-none" style={{
            fontFamily: 'var(--font-montserrat), sans-serif',
            letterSpacing: '15px',
            animation: 'heartbeat 4s ease-in-out infinite',
          }}>
            OUR BLOG
          </div>
        </div>

        <div className="relative z-10 h-full flex items-center justify-center px-8 md:px-16">
          <div className={`text-center transition-all duration-1000 ${isVisible["hero"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <h1 className="text-white text-5xl md:text-7xl font-bold mb-6 tracking-wide uppercase">
              OUR <span className="text-[#6F8676]">BLOG</span>
            </h1>
            <p className="text-white text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Expert tips, insights, and stories to help you achieve your fitness goals
            </p>
            <motion.div
              initial={{ width: 0 }}
              animate={isVisible["hero"] ? { width: 96 } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="h-1 bg-[#6BB371] mx-auto"
            />
          </div>
        </div>
        <div 
          ref={(el) => (sectionRefs.current["hero"] = el)}
          className="absolute bottom-0 w-full h-20"
        />
      </section>

      {/* Add the keyframe animation style */}
      <style jsx>{`
        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}