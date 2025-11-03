"use client";

import { useRef, useState, useEffect } from "react";
import Card from "./Card";
import {
  PiArrowSquareLeftDuotone,
  PiArrowSquareRightDuotone,
} from "react-icons/pi";
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
  ];

  // Handle scroll buttons
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

  // Update current index when user scrolls manually
  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const cardWidth = container.children[0].offsetWidth + 40;
    const index = Math.round(scrollLeft / cardWidth);
    setCurrentIndex(index);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (

    <section className="py-20  bg-[#C8CDC5]/30 text-center relative overflow-hidden">

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
              className={`snap-center transition-all duration-500 ease-in-out p-2 rounded-2xl shadow-md min-w-[300px] ${
                currentIndex === index
                  ? "scale-105 bg-[#52796F] text-white"
                  : "opacity-70 bg-[#CAD2C5] text-black"
              }`}
            >
              <Card image={picture} title={service.title} para={service.para} />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className="flex justify-center gap-8 mt-12">
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="p-2 rounded-full"
          >
            <PiArrowSquareLeftDuotone size={36} className="text-[#354F52]" />
          </button>

          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="p-2 rounded-full"
          >
            <PiArrowSquareRightDuotone size={36} className="text-[#354F52]" />
          </button>
        </div>
      </div>
    </section>
  );
}
