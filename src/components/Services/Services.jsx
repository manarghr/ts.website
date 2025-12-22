"use client";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import Card from "./Card";
import {
  IoIosArrowBack,
  IoIosArrowForward,
} from "react-icons/io";
import picture from "../assets/elements.png";

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
    { title: "Strength Training", para: "Build muscle and increase power with personalized programs." },
    { title: "Cardio Workouts", para: "Improve endurance and cardiovascular health." },
    { title: "Flexibility & Mobility", para: "Enhance range of motion and prevent injuries." },
    { title: "Sports-Specific Training", para: "Tailored programs for your chosen sport." },
    { title: "Recovery & Rehabilitation", para: "Smart recovery plans to get you back stronger." },
    { title: "Nutrition Guidance", para: "Fuel your body for optimal performance." },
  ];

  // --- Fonction de défilement manuel ---
  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container || !container.children[0]) return;

    // Get card width including gap (gap-6 = 24px)
    const cardElement = container.children[0];
    const cardWidth = cardElement.offsetWidth;
    const gap = 24; // gap-6 = 24px
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

  // --- Mettre à jour l'index quand on scroll manuellement ---
  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container || !container.children[0]) return;

    const scrollLeft = container.scrollLeft;
    const cardElement = container.children[0];
    const cardWidth = cardElement.offsetWidth;
    const gap = 24; // gap-6 = 24px
    const scrollAmount = cardWidth + gap;
    const index = Math.round(scrollLeft / scrollAmount);
    
    // Clamp index to valid range
    const clampedIndex = Math.max(0, Math.min(index, services.length - 1));
    if (clampedIndex !== currentIndex) {
      setCurrentIndex(clampedIndex);
    }
  };

  // --- Slider automatique ---


  // --- Render ---
  return (
    <section ref={sectionRef} className="bg-white py-20 md:py-28 text-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-pattern-waves opacity-10"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#52796F]/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#354F52]/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className={`mb-16 fade-in-on-scroll ${isVisible ? 'visible' : ''}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-[#354F52]">Our</span>{" "}
            <span className="text-[#52796F]">Training Services</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive fitness solutions designed to help you achieve your goals
          </p>
        </div>

        <div className="relative">
          {/* Scrollable cards container */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar px-4 py-6 flex-nowrap snap-x snap-mandatory"
            onScroll={handleScroll}
          >
            {services.map((service, index) => (
              <div
                key={index}
                className={`snap-center transition-all duration-500 ease-in-out min-w-[280px] md:min-w-[320px] ${
                  currentIndex === index
                    ? "scale-105"
                    : "opacity-80 scale-95"
                }`}
              >
                <Card
                  image={picture}
                  title={service.title}
                  para={service.para}
                  isActive={currentIndex === index}
                />
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-center items-center gap-8 mt-12">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              disabled={currentIndex === 0}
              className="p-3 rounded-full bg-[#354F52] text-white hover:bg-[#52796F] transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <IoIosArrowBack size={24} />
            </button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {services.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const container = scrollRef.current;
                    if (!container || !container.children[0]) return;
                    const cardElement = container.children[0];
                    const cardWidth = cardElement.offsetWidth;
                    const gap = 24; // gap-6 = 24px
                    const scrollAmount = cardWidth + gap;
                    setCurrentIndex(index);
                    container.scrollTo({
                      left: index * scrollAmount,
                      behavior: "smooth",
                    });
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? "bg-[#354F52] w-8"
                      : "bg-[#C8CDC5] hover:bg-[#52796F]"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              disabled={currentIndex === services.length - 1}
              className="p-3 rounded-full bg-[#354F52] text-white hover:bg-[#52796F] transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <IoIosArrowForward size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
