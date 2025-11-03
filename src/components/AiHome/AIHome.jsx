"use client";

import Image from "next/image";
import picture from "../assets/picture.png";
import { IoMdCheckmark } from "react-icons/io";

export default function AIHome() {
  return (
    <main className="bg-[#C8CDC5]/30 min-h-screen flex items-center justify-center">
      <section className="bg-[#354F52] w-[85%] mx-auto h-[800px] p-[10vh] rounded-2xl relative bottom-25 overflow-hidden">
        <div className="flex flex-col justify-center items-center scale-100 relative top-7 text-center">
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

          {/* ✅ Features list */}
          <div className="text-white text-xl flex flex-col gap-8 relative left-[40vh] -top-[320px]">
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

            {/* ✅ Button placed outside the map */}
            <button className="bg-[#2F3E46] hover:bg-[#2F3E56] transition-colors text-white font-semibold py-3 px-9 rounded-md w-fit mx-auto mt-10">
              Try Now
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
