"use client";

import Image from "next/image";
import picture from "../assets/picture.png";
import { IoMdCheckmark } from "react-icons/io";

export default function AIHome() {
  return (
    <section className="bg-[#354F52] py-24 flex justify-center items-center relative overflow-hidden">
      <div className="flex flex-col justify-center items-center scale-120 relative top-7 text-center">
        <h1 className="text-white text-4xl font-bold mb-5 max-w-2xl">
          Real-Time AI Coaching That Perfects Every Move You Make
        </h1>

        <p className="text-white text-lg mb-8 leading-relaxed max-w-xl">
          TrainSight tracks your posture in real time and gives instant feedback
          to help you move safely and train smarter.
        </p>

        <Image
          src={picture}
          alt="AI Coaching"
          priority
          className="relative -left-[35vh] top-[5vh] w-[500px] h-auto"
        />

        <div className="text-white text-xl flex flex-col gap-8 relative left-[50vh] -top-[320px]">
          {[
            "Real-time posture correction",
            "AI-powered performance analysis",
            "Personalized training plans",
            "Injury prevention tips",
          ].map((text, index) => (
            <div
              key={index}
              className="flex items-center gap-3 opacity-0 translate-y-8 animate-fadeLine"
              style={{ animationDelay: `${0.3 + index * 0.4}s` }}
            >
              <IoMdCheckmark className="text-[#6BB371] text-2xl relative -left-[3vh]" />
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>

     
    </section>
  );
}
