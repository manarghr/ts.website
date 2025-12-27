"use client";

import { useEffect, useRef, useState } from "react";
import { 
  FaUtensils, 
  FaAppleAlt, 
  FaLeaf,
  FaCheckCircle
} from "react-icons/fa";

export default function MealsPage() {
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = useRef({});

  const mealCards = [
    {
      icon: <FaUtensils className="text-4xl" />,
      title: "Custom Meal Plans",
      description: "Personalized nutrition plans tailored to your fitness goals, dietary preferences, and lifestyle.",
      features: ["Macro tracking", "Shopping lists", "Recipe variations", "Dietitian approved"]
    },
    {
      icon: <FaAppleAlt className="text-4xl" />,
      title: "Meal Prep Guidance",
      description: "Step-by-step meal preparation guides to help you save time and stay consistent with your nutrition.",
      features: ["Weekly prep schedules", "Batch cooking tips", "Storage solutions", "Time-saving hacks"]
    },
    {
      icon: <FaLeaf className="text-4xl" />,
      title: "Nutrition Coaching",
      description: "Expert guidance on proper nutrition, supplements, and fueling strategies for optimal performance.",
      features: ["1-on-1 consultations", "Progress tracking", "Supplement advice", "Performance nutrition"]
    }
  ];

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
      <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1400')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 bg-[#6BB371]/80" />
        </div>
        <div className="relative h-full flex items-center justify-center px-8 md:px-16">
          <div className="text-center">
            <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
              Meal <span className="text-[#354F52]">Preparation</span>
            </h1>
            <p className="text-white text-lg md:text-xl max-w-2xl mx-auto">
              Fuel your body with expertly crafted nutrition plans and meal prep guidance
            </p>
            <div className="w-24 h-1 bg-white mx-auto mt-6" />
          </div>
        </div>
      </section>

      {/* Meal Preparation Cards Section */}
      <section className="bg-white py-20 md:py-28 px-8 md:px-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-waves opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#52796F]/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#354F52]/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-[#354F52]">Meal</span>{" "}
              <span className="text-[#52796F]">Preparation</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Fuel your body with expertly crafted nutrition plans and meal prep guidance
            </p>
            <div className="w-32 h-1 bg-[#52796F] mx-auto mt-6" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {mealCards.map((card, index) => (
              <div
                key={card.title}
                ref={(el) => {
                  if (!sectionRefs.current[`meal-${index}`]) {
                    sectionRefs.current[`meal-${index}`] = el;
                  }
                }}
                className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-[#C8CDC5]/50 hover:border-[#52796F]/50 ${
                  isVisible[`meal-${index}`] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-br from-[#354F52] to-[#52796F] rounded-xl p-6 text-white">
                    {card.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#354F52] mb-4 text-center">
                  {card.title}
                </h3>
                <p className="text-gray-600 mb-6 text-center leading-relaxed">
                  {card.description}
                </p>
                <ul className="space-y-3 mb-6">
                  {card.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      <FaCheckCircle className="text-[#6BB371] flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full py-3 px-6 bg-[#354F52] text-white font-semibold rounded-lg hover:bg-[#52796F] transition-all duration-300 hover:scale-105 shadow-lg">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

