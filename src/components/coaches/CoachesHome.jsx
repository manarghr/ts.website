"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Card from "./Cardes";
import { Afacad } from "next/font/google";
import Image from "next/image";
import background from "../assets/Group 2046.png";
import Link from "next/link";
import { FaArrowRight, FaUsers, FaStar } from "react-icons/fa";

// Images (exemple)
import picture1 from "../assets/picture1.png";
import picture2 from "../assets/picture2.png";
import picture3 from "../assets/picture3.png";

const afacad = Afacad({ subsets: ["latin"], weight: ["400", "600", "700"] });

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  initial: {},
  whileInView: { 
    transition: { staggerChildren: 0.15 } 
  },
  viewport: { once: true }
};

export default function CoachesHome() {
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
      { image: picture1, title: "John Smith", para: "Expert in strength and conditioning.", rating: 5, clients: 250 },
      { image: picture2, title: "Lucas Grey", para: "Powerlifting coach with 8 years of experience.", rating: 5, clients: 180 },
      { image: picture3, title: "Sophia Ray", para: "Functional fitness and mobility specialist.", rating: 5, clients: 320 },
    ],
    Cardio: [
      { image: picture1, title: "Michael Lee", para: "Cardio and endurance specialist.", rating: 5, clients: 200 },
      { image: picture2, title: "Emma White", para: "HIIT and endurance expert.", rating: 5, clients: 280 },
      { image: picture3, title: "Tom Harris", para: "Marathon and stamina trainer.", rating: 5, clients: 150 },
    ],
    Yoga: [
      { image: picture1, title: "Emma Brown", para: "Certified yoga instructor with 10 years of experience.", rating: 5, clients: 400 },
      { image: picture2, title: "Lina Patel", para: "Expert in Hatha and Vinyasa yoga.", rating: 5, clients: 350 },
      { image: picture3, title: "David Kim", para: "Mindfulness and meditation teacher.", rating: 5, clients: 220 },
    ],
    "Weight Loss": [
      { image: picture1, title: "Anna Scott", para: "Nutrition-focused weight loss coach.", rating: 5, clients: 500 },
      { image: picture2, title: "James Carter", para: "Body transformation specialist.", rating: 5, clients: 380 },
      { image: picture3, title: "Olivia Chen", para: "Fat-loss and endurance expert.", rating: 5, clients: 290 },
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
    }, 300);
  };

  return (
    <section ref={sectionRef} className="text-center bg-white py-12 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#52796F]/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#6BB371]/5 rounded-full blur-[120px]"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        {/* Enhanced Section Header */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#52796F]/10 border border-[#52796F]/20 rounded-full text-[#52796F] text-sm font-semibold mb-6">
            <FaUsers className="text-[#6BB371]" />
            <span>Expert Trainers</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-[#354F52]">Our Expert</span>{" "}
            <span className="text-[#52796F]">Coaches</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Meet our team of professional trainers dedicated to helping you achieve your fitness goals
          </p>
        </motion.div>

        {/* Enhanced Category Filter Buttons */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className={`flex justify-center gap-4 mb-16 flex-wrap ${afacad.className}`}
        >
          {Object.keys(categories).map((category) => (
            <motion.button
              key={category}
              onClick={() => handleCategoryChange(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-3 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl
                ${activeCategory === category
                  ? "bg-gradient-to-r from-[#354F52] to-[#52796F] text-white scale-105 shadow-xl"
                  : "bg-white text-[#354F52] hover:bg-[#52796F] hover:text-white border-2 border-[#C8CDC5] hover:border-[#52796F]"
                }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Enhanced Coaches Cards Container */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="relative"
        >
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-500 
            ${isChanging ? "opacity-0 translate-y-5" : "opacity-100 translate-y-0"}`}
          >
            {categories[activeCategory].map((coach, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#C8CDC5]/50 hover:border-[#52796F]/50 overflow-hidden">
                  {/* Gradient Background on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#52796F]/5 to-[#6BB371]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Decorative Corner */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#6BB371]/10 to-transparent rounded-bl-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Coach Image */}
                  <div className="relative mb-6 flex justify-center">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-[#52796F]/20 group-hover:ring-[#52796F]/40 transition-all duration-300">
                      <Image
                        src={coach.image}
                        alt={coach.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    {/* Status Badge */}
                    <div className="absolute bottom-0 right-[calc(50%-4rem)] w-6 h-6 bg-[#6BB371] rounded-full border-4 border-white shadow-lg"></div>
                  </div>

                  {/* Coach Info */}
                  <div className="relative z-10 text-center">
                    <h3 className="text-2xl font-bold text-[#354F52] mb-2 group-hover:text-[#52796F] transition-colors">
                      {coach.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {coach.para}
                    </p>

                    {/* Stats */}
                    <div className="flex justify-center items-center gap-6 mb-6">
                      <div className="flex items-center gap-1">
                        <FaStar className="text-[#6BB371] w-4 h-4" />
                        <span className="text-sm font-semibold text-[#354F52]">{coach.rating}.0</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaUsers className="text-[#52796F] w-4 h-4" />
                        <span className="text-sm font-semibold text-gray-600">{coach.clients}+ Clients</span>
                      </div>
                    </div>

                    {/* View Profile Button */}
                    <Link
                      href="/coaches"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#354F52] text-white font-semibold rounded-xl hover:bg-[#52796F] hover:shadow-lg transition-all duration-300 group-hover:gap-3"
                    >
                      View Profile
                      <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* View All Button */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="mt-12"
        >
          <Link
            href="/coaches"
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#354F52] to-[#52796F] text-white font-bold rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            View All Coaches
            <FaArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
