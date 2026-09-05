"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import picture from "../assets/Ellipse 3.png";
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Dumbbell, Heart, Trophy, Target, Zap, Award, TrendingUp, Activity } from "lucide-react";

const testimonials = [
  {
    name: "Jonathan Edward",
    role: "Office Worker",
    rating: 5,
    text: "Join this fitness member, the best choice that I've. They're very professional and give you suggestion about what food and nutrition that you can eat.",
    image: picture
  },
  {
    name: "Sarah Martinez",
    role: "Fitness Enthusiast",
    rating: 5,
    text: "TrainSight has completely transformed my workout routine. The AI coaching is incredibly accurate and the real-time feedback helps me perfect my form every session.",
    image: picture
  },
  {
    name: "Michael Chen",
    role: "Athlete",
    rating: 5,
    text: "As a competitive athlete, I need precision in my training. TrainSight's performance analysis has helped me identify weaknesses I never knew I had.",
    image: picture
  }
];

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const currentTestimonial = testimonials[currentIndex];

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

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section ref={sectionRef} className="w-full bg-gradient-to-br from-[#354F52] to-[#2F3E46] text-white py-20 md:py-28 px-6 md:px-16 relative overflow-hidden">
      {/* Floating Icons Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Dumbbell Icons */}
        <div className="absolute top-[15%] left-[8%] opacity-15 animate-float">
          <Dumbbell className="w-12 h-12 text-[#6BB371]" />
        </div>
        <div className="absolute bottom-[20%] right-[12%] opacity-15 animate-float" style={{ animationDelay: '2s', animationDuration: '7s' }}>
          <Dumbbell className="w-14 h-14 text-[#52796F]" />
        </div>

        {/* Heart Icons */}
        <div className="absolute top-[30%] right-[10%] opacity-20 animate-pulse-glow" style={{ animationDelay: '0.5s' }}>
          <Heart className="w-11 h-11 text-[#6BB371]" />
        </div>

        {/* Trophy Icon */}
        <div className="absolute top-[60%] left-[12%] opacity-20 animate-float" style={{ animationDelay: '1.5s', animationDuration: '8s' }}>
          <Trophy className="w-12 h-12 text-[#52796F]" />
        </div>

        {/* Target Icon */}
        <div className="absolute bottom-[15%] left-[25%] opacity-15 animate-float" style={{ animationDelay: '2.5s', animationDuration: '7.5s' }}>
          <Target className="w-11 h-11 text-[#6BB371]" />
        </div>

        {/* Zap Icon */}
        <div className="absolute top-[45%] right-[20%] opacity-15 animate-pulse-glow" style={{ animationDelay: '1.2s' }}>
          <Zap className="w-10 h-10 text-[#52796F]" />
        </div>

        {/* Award Icon */}
        <div className="absolute bottom-[35%] right-[8%] opacity-20 animate-float" style={{ animationDelay: '1.8s', animationDuration: '6.8s' }}>
          <Award className="w-12 h-12 text-[#6BB371]" />
        </div>

        {/* Activity Icon */}
        <div className="absolute top-[25%] left-[35%] opacity-15 animate-pulse-glow" style={{ animationDelay: '0.8s' }}>
          <Activity className="w-10 h-10 text-[#52796F]" />
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#6BB371]/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#52796F]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#354F52]/20 rounded-full blur-2xl animate-pulse-glow"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side */}
          <div className={`fade-in-on-scroll ${isVisible ? 'visible' : ''}`}>
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                What Our Members
                <span className="block text-[#6BB371]">Say About Us</span>
              </h2>
              <p className="text-lg text-white/80">
                Join thousands of satisfied users who have transformed their fitness journey
              </p>
            </div>

            {/* Customer Count */}
            <div className="flex items-center gap-4 mt-10">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-[#354F52] bg-gradient-to-br from-[#6BB371] to-[#52796F] flex items-center justify-center text-white font-bold">
                    {i}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-2xl font-bold text-[#6BB371]">10K+</p>
                <p className="text-white/80 text-sm">Satisfied Customers</p>
              </div>
            </div>
          </div>

          {/* Right Side - Testimonial Card */}
          <div className={`bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-10 relative shadow-2xl border border-white/20 fade-in-on-scroll ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.3s' }}>
            {/* Quote Icon */}
            <div className="absolute top-6 right-6 text-[#6BB371]/30">
              <FaQuoteLeft size={60} />
            </div>

            {/* Star Rating */}
            <div className="flex gap-2 mb-6">
              {Array.from({ length: currentTestimonial.rating }).map((_, i) => (
                <FaStar key={i} className="text-yellow-400 text-xl" />
              ))}
            </div>

            {/* Testimonial Text */}
            <p className="text-gray-100 text-lg md:text-xl leading-relaxed mb-8 relative z-10">
              &quot;{currentTestimonial.text}&quot;
            </p>

            {/* Author Info */}
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <Image 
                  src={currentTestimonial.image} 
                  width={60} 
                  height={60} 
                  alt={currentTestimonial.name} 
                  className="rounded-full border-2 border-[#6BB371]" 
                />
                <div className="absolute inset-0 rounded-full bg-[#6BB371]/20 animate-pulse"></div>
              </div>
              <div>
                <h4 className="font-bold text-xl text-white">{currentTestimonial.name}</h4>
                <p className="text-gray-300 text-sm">{currentTestimonial.role}</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6 border-t border-white/20">
              {/* Dots Indicator */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentIndex === index
                        ? "bg-[#6BB371] w-8"
                        : "bg-white/30 hover:bg-white/50"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              {/* Navigation Arrows */}
              <div className="flex gap-3">
                <button
                  onClick={prevTestimonial}
                  className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20"
                  aria-label="Previous testimonial"
                >
                  <FaChevronLeft className="text-white" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-12 h-12 bg-[#6BB371] hover:bg-[#52796F] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                  aria-label="Next testimonial"
                >
                  <FaChevronRight className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
