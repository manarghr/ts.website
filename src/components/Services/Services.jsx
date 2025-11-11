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
  const [currentIndex, setCurrentIndex] = useState(0);

  const services = [
    { title: "Web Development", para: "Building responsive and modern websites." },
    { title: "Graphic Design", para: "Creating visually stunning graphics." },
    { title: "Digital Marketing", para: "Promoting your brand effectively online." },
    { title: "SEO Optimization", para: "Improving search rankings and reach." },
    { title: "UI/UX Design", para: "Creating user-friendly and modern interfaces." },
     { title: "UI/UX Design", para: "Creating user-friendly and modern interfaces." },
      { title: "UI/UX Design", para: "Creating user-friendly and modern interfaces." },
  ];

  // --- Fonction de défilement manuel ---
  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    const cardWidth = container.children[0].offsetWidth + 40;
    let newIndex =
      direction === "left"
        ? Math.max(currentIndex - 1, 0)
        : Math.min(currentIndex + 1, services.length - 1);

    setCurrentIndex(newIndex);
    container.scrollTo({
      left: newIndex * cardWidth,
      behavior: "smooth",
    });
  };

  // --- Mettre à jour l'index quand on scroll manuellement ---
  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const cardWidth = container.children[0].offsetWidth + 40;
    const index = Math.round(scrollLeft / cardWidth);
    setCurrentIndex(index);
  };

  // --- Slider automatique ---
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const autoScroll = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % services.length;
        container.scrollTo({
          left: nextIndex * (container.children[0].offsetWidth + 40),
          behavior: "smooth",
        });
        return nextIndex;
      });
    }, 3000); // toutes les 3 secondes

    container.addEventListener("scroll", handleScroll);

    return () => {
      clearInterval(autoScroll);
      container.removeEventListener("scroll", handleScroll);
    };
  }, [services.length]);

  // --- Render ---
  return (
    <section className="py-20 bg-[#C8CDC5]/30 text-center relative overflow-hidden">
      <h2 className="text-4xl font-bold mb-12">
        <span className="text-[#354F52]">Our</span>{" "}
        <span className="text-[#52796F]">Services</span>
      </h2>

      <div className="relative w-[85%] mx-auto">
        {/* Scrollable cards container */}
        <div
          ref={scrollRef}
          className="flex gap-10 overflow-x-auto scroll-smooth no-scrollbar px-4 py-6 flex-nowrap snap-x snap-mandatory"
        >
          {services.map((service, index) => (
            <div
              key={index}
              className={`snap-center transition-all duration-500 ease-in-out p-2 rounded-2xl shadow-md min-w-[200px] ${
                currentIndex === index
                  ? "scale-105 bg-[#52796F] text-white"
                  : "opacity-70 bg-[#CAD2C5] text-black"
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
        <div className="flex justify-center gap-8 mt-12">
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="relative right-165 bottom-50 rounded-full hover:scale-110 transition-transform"
          >
            <IoIosArrowBack size={36} className="text-[#354F52]" />
          </button>

          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="relative left-165 bottom-50 rounded-full hover:scale-110 transition-transform"
          >
            <IoIosArrowForward  size={36} className="text-[#354F52]" />
          </button>
        </div>
      </div>
    </section>
  );
}
