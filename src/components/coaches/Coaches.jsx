"use client";
import { useState, useEffect, useRef } from "react";
import Card from "./Cardes";
import { Afacad } from "next/font/google";
import Image from "next/image";
import background from "../assets/Group 2046.png";

// Images (exemple)
import picture1 from "../assets/picture1.png";
import picture2 from "../assets/picture2.png";
import picture3 from "../assets/picture3.png";

const afacad = Afacad({ subsets: ["latin"], weight: ["400", "600", "700"] });

export default function Coaches() {
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

  // --- Données des catégories ---
  const categories = {
    Strength: [
      { image: picture1, title: "John Smith", para: "Expert in strength and conditioning." },
      { image: picture2, title: "Lucas Grey", para: "Powerlifting coach with 8 years of experience." },
      { image: picture3, title: "Sophia Ray", para: "Functional fitness and mobility specialist." },
    ],
    Cardio: [
      { image: picture1, title: "Michael Lee", para: "Cardio and endurance specialist." },
      { image: picture2, title: "Emma White", para: "HIIT and endurance expert." },
      { image: picture3, title: "Tom Harris", para: "Marathon and stamina trainer." },
    ],
    Yoga: [
      { image: picture1, title: "Emma Brown", para: "Certified yoga instructor with 10 years of experience." },
      { image: picture2, title: "Lina Patel", para: "Expert in Hatha and Vinyasa yoga." },
      { image: picture3, title: "David Kim", para: "Mindfulness and meditation teacher." },
    ],
    "Weight Loss": [
      { image: picture1, title: "Anna Scott", para: "Nutrition-focused weight loss coach." },
      { image: picture2, title: "James Carter", para: "Body transformation specialist." },
      { image: picture3, title: "Olivia Chen", para: "Fat-loss and endurance expert." },
    ],
  };

  // --- État pour la catégorie active ---
  const [activeCategory, setActiveCategory] = useState("Strength");
  const [isChanging, setIsChanging] = useState(false);

  // --- Changement de catégorie avec animation ---
  const handleCategoryChange = (category) => {
    if (category === activeCategory) return;
    setIsChanging(true);
    setTimeout(() => {
      setActiveCategory(category);
      setIsChanging(false);
    }, 300); // durée de l’animation de fade
  };

  return (
    <section ref={sectionRef} className="text-center bg-gradient-to-b from-white to-[#C8CDC5]/30 py-20 md:py-28 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-pattern-dots opacity-15"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-[#52796F]/8 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-[#354F52]/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '2.5s' }}></div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className={`mb-12 fade-in-on-scroll ${isVisible ? 'visible' : ''}`}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-[#354F52]">Our Expert</span>{" "}
            <span className="text-[#52796F]">Coaches</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Meet our team of professional trainers dedicated to helping you achieve your fitness goals.
          </p>
        </div>

        {/* Category Filter Buttons */}
        <div className={`flex justify-center gap-4 mb-16 flex-wrap ${afacad.className} fade-in-on-scroll ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.2s' }}>
          {Object.keys(categories).map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:scale-110
                ${activeCategory === category
                  ? "bg-[#354F52] text-white scale-105 shadow-xl"
                  : "bg-white text-[#354F52] hover:bg-[#52796F] hover:text-white border border-[#C8CDC5]"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Coaches Cards Container */}
        <div className="relative bg-gradient-to-br from-[#354F52] to-[#52796F] rounded-3xl p-8 md:p-12 min-h-[600px] flex items-center justify-center overflow-hidden shadow-2xl">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <Image
              src={background}
              alt="Coaches background"
              fill
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#354F52]/90 to-[#52796F]/90"></div>
          </div>

          {/* Coaches Cards */}
          <div
            className={`flex justify-center items-center gap-8 md:gap-12 relative z-10 flex-wrap transition-all duration-500 
            ${isChanging ? "opacity-0 translate-y-5" : "opacity-100 translate-y-0"}`}
          >
            {categories[activeCategory].map((coach, i) => (
              <Card
                key={i}
                className={`relative transform transition-all duration-300 hover:scale-105 ${
                  i === 1 ? "-mt-8 md:-mt-12" : ""
                }`}
                image={coach.image}
                title={coach.title}
                para={coach.para}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
