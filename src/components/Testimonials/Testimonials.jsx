import Image from "next/image";
import picture from "../assets/Ellipse 3.png"

export default function TestimonialSection() {
  return (
    <section className="w-full bg-[#2F4A4E] text-white py-20 px-6 md:px-16 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

        {/* Left Side */}
        <div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight relative -top-20">
            What Our Member <br /> Say About Us?
          </h2>

          <div className="flex items-center gap-4 mt-10">
            <div className="flex -space-x-3">
              <Image src={picture} width={50} height={50} alt="customer" className="rounded-full border-2 border-white"/>
              <Image src={picture} width={50} height={50} alt="customer" className="rounded-full border-2 border-white"/>
              <Image src={picture} width={50} height={50} alt="customer" className="rounded-full border-2 border-white"/>
            </div>
            <p className="text-gray-200 text-lg">10K+ Satisfied Customer</p>
          </div>
        </div>

        {/* Right Side - Testimonial Card */}
        <div className="bg-[#354F52] rounded-2xl p-10 relative shadow-lg overflow-hidden">

          {/* ⭐ Star Rating — moved right */}
          <div className="flex gap-2 mb-7 text-yellow-500 text-xl relative translate-x-[380px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>

          <p className="text-gray-200 text-lg leading-relaxed mb-6">
            “ Join this fitness member, the best choice that I’ve. They’re very
            professional and give you suggestion about what food and nutrition
            that you can eat ”
          </p>

          <div className="flex items-center gap-4">
            <Image src={picture} width={60} height={60} alt="Jonathan" className="rounded-full" />
            <div>
              <h4 className="font-semibold text-lg">Jonathan Edward</h4>
              <p className="text-gray-400 text-sm">Office Worker</p>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8">
            <div className="flex gap-2">
              <span className="w-3 h-3 bg-cyan-400 rounded-full"></span>
              <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
              <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
            </div>

            <button className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-md hover:scale-105 transition">
              ➜
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
