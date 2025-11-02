"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function CustomFAQ() {
  const [openItem, setOpenItem] = useState(null);

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
      id: "faq-3",
      question: "Can I use TrainSight if I’m a beginner?",
      answer:
        "Absolutely. TrainSight is designed to support all fitness levels. Whether you're just starting out or refining your form, the AI adapts to your pace and goals.",
    },
    {
      id: "faq-4",
      question: " Can I train with a coach or just solo?",
      answer:
        "You can do both! TrainSight works great for solo sessions, but it also integrates with coaching workflows, allowing trainers to monitor progress and give feedback remotely.",
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
    <section className=" w-full">
      <div className="w-full max-w-4xl mx-auto py-16 px-4">
        <div className="text-center mb-12 ">
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
                className="flex justify-between items-center w-full py-6 text-left bg-[#4a6e72ed] hover:bg-[#84A98C] rounded-t-lg px-4"
              >
                <span className="text-[#ffff] font-semibold">
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
  );
}