"use client";

import Image from "next/image";
import picture from "../assets/picture.png";
import { MdCheckBox } from "react-icons/md";

export default function AIHome() {
   const framePadding = "p-12" 
   const frameInnerPadding = "p-16" 
  return (
    <section className="bg-[#C8CDC5] flex justify-center py-20">
    <div className="bg-[#354F52] max-w-7xl w-full px-12 -p-4 flex flex-col items-center text-center relative">
      <div className={`flex flex-col justify-center items-center scale-120 relative top-7 text-center ${framePadding}`}>
         <h1 className="text-white text-3xl font-bold mb-5 mt-8 whitespace-nowrap">
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

         <div className="text-white text-xl flex flex-col gap-8 relative left-[40vh] -top-[320px]">
            {[
              "Real-time posture correction",
              "Automatic rep counting",
              "Injury prevention alerts",
              "Personalized exercise feedback",
            ].map((text, index) => (
              <div
                key={index}
                className="flex items-center gap-3 opacity-0 translate-y-8 animate-fadeLine"
                style={{ animationDelay: `${0.3 + index * 0.4}s` }}
              >
                <MdCheckBox className="text-[#ffffff] text-2xl relative -left-[3vh]" />
                <p>{text}</p>
              </div>
          ))}
          <button className="mt-12 px-8 py-3 bg-[#2C3E50] text-white font-semibold rounded hover:bg-[#1a252f] transition">
            TRY NOW
          </button>
        </div>
      </div>  

     
    </div>
    </section>
  );
}
