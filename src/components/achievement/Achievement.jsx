"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import picture1 from "../assets/logo1.png";
import hero from "../assets/hero_design.png";

export default function Achievement() {
  const [users, setUsers] = useState(0);
  const [coaches, setCoaches] = useState(0);
  const [videos, setVideos] = useState(0);
  const [satisfaction, setSatisfaction] = useState(0);

  const animateValue = (setter, end, duration) => {
    let start = 0;
    const increment = end / (duration / 20);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setter(Math.floor(start));
    }, 20);
  };

  useEffect(() => {
    animateValue(setUsers, 5000, 1300);
    animateValue(setCoaches, 50, 1300);
    animateValue(setVideos, 200, 1300);
    animateValue(setSatisfaction, 95, 1300);
  }, []);

  return (
    <section className="relative bg-[#DADDD8] h-[550px] py-5 px-5 flex md:flex-row items-center justify-between gap-15 overflow-hidden">
      {/* Left side - Text and Stats */}
      <div className="flex-1 relative bottom- left-[100px] ">
        <h2 className="text-6xl font-bold text-[#84A98C] mb-4">
          <span className="text-black">Our</span>{" "}
          <span className="bg-[52796F]">Achievement</span>
        </h2>
        <p className="text-2xl text-black-500 mb-15 relative left-2">
          Real results. Real people. Real achievements.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-[40px]">
          {/* Stat 1 */}
          <div className="flex items-center md:items-start text-center md:text-left">
            <Image src={picture1} alt="Icon" width={63} height={40} />
            <h3 className="text-3xl font-bold mt-1 ml-3">{users.toLocaleString()}+</h3>
            <p className="text-2xl text-black-500 relative top-[35px] right-[100px]">Active Users</p>
          </div>

          {/* Stat 2 */}
          <div className="flex items-center md:items-start text-center md:text-left">
            <Image src={picture1} alt="Icon" width={63} height={40} />
            <h3 className="text-3xl font-bold mt-1 ml-3">{coaches}+</h3>
            <p className="text-[22px] text-black-500 relative top-[35px] right-[55px]">Certified Coaches</p>
          </div>

          {/* Stat 3 */}
          <div className="flex items-center md:items-start text-center md:text-left">
            <Image src={picture1} alt="Icon" width={63} height={40} />
            <h3 className="text-3xl font-bold mt-1 ml-3">{videos}+</h3>
            <p className=" text-[20px] text-black-500 relative top-[35px] right-[75px]">Video Workouts</p>
          </div>

          {/* Stat 4 */}
          <div className="flex items-center md:items-start text-center md:text-left">
            <Image src={picture1} alt="Icon" width={63} height={40} />
            <h3 className="text-3xl font-bold mt-1 ml-3">{satisfaction}%</h3>
            <p className=" text-[20px] text-black-500 relative top-[35px] right-[60px]">User Satisfaction</p>
          </div>
        </div>
      </div>

      {/* Right side - Hero Image */}
    <div className="flex-1 flex justify-center relative translate-y-[40px] left-4 "> 

        <Image
          src={hero}
          alt="Achievement Hero"
          className="object-cover h-full relative left-10"
          width={630}
          height={300}
        />
      </div>
    </section>
  );
}
