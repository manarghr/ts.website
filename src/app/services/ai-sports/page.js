"use client";

import { useEffect, useRef, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { 
  FaVideo,
  FaTrophy,
  FaStopwatch,
  FaBolt,
  FaShieldAlt,
  FaChartLine
} from "react-icons/fa";

export default function AISportsPage() {
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = useRef({});

  const aiSportsFeatures = [
    {
      icon: <FaVideo className="text-4xl" />,
      title: "Real-Time Movement Analysis",
      description: "Advanced computer vision technology analyzes your exercise form in real-time, providing instant feedback on technique and posture.",
      color: "from-[#354F52] to-[#52796F]"
    },
    {
      icon: <FaTrophy className="text-4xl" />,
      title: "Performance Optimization",
      description: "AI algorithms identify your strengths and weaknesses, suggesting targeted improvements to maximize your athletic performance.",
      color: "from-[#52796F] to-[#6BB371]"
    },
    {
      icon: <FaStopwatch className="text-4xl" />,
      title: "Rep Counting & Timing",
      description: "Automatically tracks your repetitions, sets, and rest periods with precision, keeping you focused on your workout.",
      color: "from-[#6BB371] to-[#52796F]"
    },
    {
      icon: <FaBolt className="text-4xl" />,
      title: "Adaptive Training Plans",
      description: "Dynamic workout adjustments based on your progress, ensuring continuous improvement and preventing plateaus.",
      color: "from-[#354F52] to-[#6BB371]"
    },
    {
      icon: <FaShieldAlt className="text-4xl" />,
      title: "Injury Risk Detection",
      description: "Proactive identification of movement patterns that could lead to injuries, helping you train safely and sustainably.",
      color: "from-[#52796F] to-[#354F52]"
    },
    {
      icon: <FaChartLine className="text-4xl" />,
      title: "Progress Analytics",
      description: "Comprehensive data visualization showing your training evolution, strength gains, and performance metrics over time.",
      color: "from-[#6BB371] to-[#354F52]"
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
    <MainLayout>
      <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1400')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 bg-[#52796F]/80" />
        </div>
        <div className="relative h-full flex items-center justify-center px-8 md:px-16">
          <div className="text-center">
            <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
              AI-Powered <span className="text-[#6BB371]">Sports Intelligence</span>
            </h1>
            <p className="text-white text-lg md:text-xl max-w-2xl mx-auto">
              Revolutionize your training with cutting-edge AI technology
            </p>
            <div className="w-24 h-1 bg-[#6BB371] mx-auto mt-6" />
          </div>
        </div>
      </section>

      {/* AI Sports Section */}
      <section className="bg-gradient-to-b from-white via-[#C8CDC5]/20 to-white py-20 md:py-28 px-8 md:px-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-10"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#52796F]/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#354F52]/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#6BB371]/5 rounded-full blur-2xl animate-pulse-glow"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-[#52796F]/10 backdrop-blur-sm border border-[#52796F]/30 rounded-full text-sm font-medium text-[#354F52]">
              Advanced Technology
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#354F52] mb-4">
              AI-Powered
              <span className="block text-[#52796F]">Sports Intelligence</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Revolutionize your training with cutting-edge AI that analyzes your movements, optimizes performance, and prevents injuries in real-time
            </p>
            <div className="w-32 h-1 bg-[#52796F] mx-auto mt-6" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {aiSportsFeatures.map((feature, index) => (
              <div
                key={index}
                ref={(el) => {
                  if (!sectionRefs.current[`ai-feature-${index}`]) {
                    sectionRefs.current[`ai-feature-${index}`] = el;
                  }
                }}
                className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-[#C8CDC5]/50 hover:border-[#52796F]/50 group ${
                  isVisible[`ai-feature-${index}`] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`bg-gradient-to-br ${feature.color} rounded-xl p-4 w-16 h-16 flex items-center justify-center text-white mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-[#354F52] mb-3 group-hover:text-[#52796F] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-[#354F52] to-[#52796F] rounded-3xl p-8 md:p-12 shadow-2xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>
            <div className="relative z-10 text-center">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Experience the Future of Sports Training
              </h3>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join athletes worldwide who are using AI to elevate their performance and train smarter
              </p>
              <button className="bg-white text-[#354F52] font-bold py-4 px-10 rounded-lg text-lg hover:bg-[#C8CDC5] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Start AI Training Now
              </button>
            </div>
          </div>
        </div>
      </section>
      </div>
    </MainLayout>
  );
}

