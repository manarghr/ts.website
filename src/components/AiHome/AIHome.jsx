"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import picture from "../assets/picture.png";
import { IoMdCheckmark } from "react-icons/io";
import { FaBrain, FaChartLine, FaShieldAlt, FaUserMd } from "react-icons/fa";

export default function AIHome() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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
      icon: <FaBrain className="text-3xl" />,
      title: "Real-time Posture Correction",
      description: "Instant feedback on your form as you train"
    },
    {
      icon: <FaChartLine className="text-3xl" />,
      title: "AI-Powered Performance Analysis",
      description: "Track progress with advanced analytics"
    },
    {
      icon: <FaUserMd className="text-3xl" />,
      title: "Personalized Training Plans",
      description: "Customized workouts tailored to your goals"
    },
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: "Injury Prevention",
      description: "Smart alerts to keep you safe and healthy"
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
      <div className="absolute inset-0 bg-pattern-grid opacity-20"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-[#52796F]/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#354F52]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-[#6BB371]/10 rounded-full blur-2xl animate-pulse-glow"></div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className={`text-center mb-16 fade-in-on-scroll ${isVisible ? 'visible' : ''}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-[#354F52] mb-4">
            Real-Time AI Coaching That
            <span className="block text-[#52796F]">Perfects Every Move</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            TrainSight tracks your posture in real time and gives instant feedback
            to help you move safely and train smarter.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image */}
          <div className={`order-2 lg:order-1 flex justify-center lg:justify-start fade-in-on-scroll ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.2s' }}>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#52796F]/20 to-[#354F52]/20 rounded-3xl blur-3xl transform rotate-6 group-hover:rotate-12 transition-transform duration-500 animate-pulse-glow"></div>
              <div className="relative bg-[#354F52] rounded-2xl p-8 shadow-2xl group-hover:shadow-[#6BB371]/50 transition-all duration-300">
                <Image
                  src={picture}
                  alt="AI Coaching Technology"
                  priority
                  className="w-full h-auto rounded-lg transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Features */}
          <div className="order-1 lg:order-2 space-y-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#C8CDC5]/50 hover:border-[#52796F]/50 group fade-in-on-scroll ${isVisible ? 'visible' : ''}`}
                style={{ transitionDelay: `${0.4 + index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-[#354F52] rounded-lg flex items-center justify-center text-white group-hover:bg-[#52796F] transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#354F52] mb-2 group-hover:text-[#52796F] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <IoMdCheckmark className="text-[#6BB371] text-2xl flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-125" />
                </div>
              </div>
            ))}

            {/* CTA Button */}
            <div className={`pt-4 fade-in-on-scroll ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.8s' }}>
              <button className="w-full lg:w-auto px-8 py-4 bg-[#354F52] hover:bg-[#52796F] text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-105 relative overflow-hidden group">
                <span className="absolute inset-0 bg-gradient-to-r from-[#52796F] to-[#6BB371] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10">Start Your Free Trial</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
