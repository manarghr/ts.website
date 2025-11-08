"use client";
import { useState } from "react";
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
    <section className="p-10 text-center bg-[#C8CDC5]/30 relative overflow-hidden">
      <h1 className="text-4xl font-bold text-[#354F52] mb-7">Our Coaches</h1>
      <p className="text-lg text-gray-600">
        Meet our team of professional trainers dedicated to your success.
      </p>

      {/* Boutons de filtre */}
      <div className={`flex justify-center gap-6 mt-6 flex-wrap ${afacad.className}`}>
        {Object.keys(categories).map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 
              ${activeCategory === category
                ? "bg-[#354F52] text-white scale-105"
                : "bg-[#CAD2C5] text-[#2F3E46] hover:bg-[#354F52] hover:text-white"
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Zone des cartes */}
      <div className="relative bg-[#354F52] h-[590px] mt-20 flex items-center justify-center rounded-3xl overflow-visible">
        <Image
          src={background}
          alt="Coaches background"
          fill
          className="object-cover opacity-80 rounded-3xl"
        />

        <div
          className={`flex justify-center gap-30 relative flex-wrap z-10 transition-all duration-500 
          ${isChanging ? "opacity-0 translate-y-5" : "opacity-100 translate-y-0"}`}
        >
          {categories[activeCategory].map((coach, i) => (
            <Card
              key={i}
              className={`relative ${i === 1 ? "bottom-10" : "bottom-0"}`}
              image={coach.image}
              title={coach.title}
              para={coach.para}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
