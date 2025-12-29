"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function CustomFAQ() {
  const [openItem, setOpenItem] = useState(null);
  const [email, setEmail] = useState("");

  const toggleItem = (id) => {
    setOpenItem(openItem === id ? null : id);
  };

  const faqItems = [
    {
      id: "faq-1",
      question: "What is TrainSight?",
      answer:
        "TrainSight is an AI-powered fitness companion that analyzes your workouts using just your camera. No wearables, no sensors—just smart, real-time feedback to help you move better and train smarter.",
    },
    {
      id: "faq-2",
      question: "Do I need any special equipment?",
      answer:
        "Nope! All you need is a device with a camera—like your phone or laptop. TrainSight uses computer vision to track your movements and offer insights without any extra gear.",
    },

   
    {
      id: "faq-5",
      question: "Are the workouts personalized?",
      answer:
        "Yes! TrainSight tailors workouts based on your fitness level, goals, and performance data. The more you use it, the better it gets at recommending exercises that suit you.",
    
    },{
    
    id: "faq-6",
      question: "Is TrainSight free to use?",
      answer:
        " There's a free version with basic features, but we also offer premium plans that unlock advanced analytics, personalized coaching, and more. Check our pricing page for details.",
    },
    
    {
      id: "faq-7",
      question: "Is my data safe?",
      answer:
        " We take your privacy seriously. All data is encrypted and stored securely. We never share your information without your consent. Check our privacy policy for more details.",
    },
  ];

  return (
    <>
      {/* FAQ Section with Grid Background */}
      <section className="relative w-full bg-[#C8CDC5]/30 overflow-hidden">
        {/* Hand-drawn Grid Background */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern-faq" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 Q 76 4, 80 8 Q 84 12, 80 16 Q 76 20, 80 24 Q 84 28, 80 32 Q 76 36, 80 40 Q 84 44, 80 48 Q 76 52, 80 56 Q 84 60, 80 64 Q 76 68, 80 72 Q 84 76, 80 80" stroke="#52796F" strokeWidth="1" fill="none" opacity="0.35"/>
              <path d="M 0 0 Q 4 4, 8 0 Q 12 -4, 16 0 Q 20 4, 24 0 Q 28 -4, 32 0 Q 36 4, 40 0 Q 44 -4, 48 0 Q 52 4, 56 0 Q 60 -4, 64 0 Q 68 4, 72 0 Q 76 -4, 80 0" stroke="#52796F" strokeWidth="1" fill="none" opacity="0.35"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern-faq)" opacity="0.5" />
        </svg>
        <div className="w-full max-w-4xl mx-auto py-16 px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-6xl font-extrabold text-[#2F3E46] mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-[#84A98C] font-bold text-lg max-w-4xl mx-auto">
              Everything you need to know about{" "}
              <span className="text-[#354F52]">TrainSight</span>.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item) => (
              <div key={item.id} className="border-b border-gray-100">
                <button
                  onClick={() => toggleItem(item.id)}
                  className="flex justify-between items-center w-full py-6 text-left bg-[#ffffff] hover:bg-[#C8CDC5] rounded-t-lg px-4"
                >
                  <span className="text-[#030303] font-semibold">
                    {item.question}
                  </span>
                  <span className="text-[#ffffff] ml-2">
                    {openItem === item.id ? (
                      <Minus className="h-5 w-5" />
                    ) : (
                      <Plus className="h-5 w-5" />
                    )}
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openItem === item.id
                      ? "max-h-96 pb-6 bg-[#eef2ff] px-4 rounded-b-lg shadow-sm"
                      : "max-h-0"
                  }`}
                >
                  <p className="text-black pt-4">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Fitness Community Section - No Grid */}
      <section className="w-full bg-[#C8CDC5]/60 py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-4xl font-bold text-[#2F3E46] mb-3">
            Join Our <span className="text-[#6B8B85]">Fitness Community</span>
          </h3>
          <p className="text-[#2F3E46] mb-8 font-medium">
            Receive expert insights and exclusive fitness content every week
          </p>

          <div className="max-w-md mx-auto">
            {/* Outer white frame to match design */}
            <div className="flex items-center bg-white rounded-2xl p-1.5 shadow-md ring-1 ring-gray-100">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent px-6 py-4 rounded-l-xl text-[#2F3E46] placeholder-gray-400 focus:outline-none"
              />
              <button className="bg-[#2F3E46] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#354F52] transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 
