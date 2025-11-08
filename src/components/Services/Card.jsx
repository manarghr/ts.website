import Image from "next/image";

export default function Card({ image, title, para, isActive }) {
  return (
    <div className="shadow-md overflow-hidden w-[180px] transition-transform duration-300 hover:shadow-xl bg-transparent rounded-xl">
      {/* Image */}
      <div className="relative w-full h-[80px] flex justify-center items-center mt-2">
        <Image
          src={image}
          alt={title}
          width={50}
          className={`object-contain transition-all duration-300 ${
            isActive ? "brightness-0 invert" : ""
          }`}
        />
      </div>

      {/* Text */}
      <div className="p-3 text-center">
        <h3
          className={`text-lg font-semibold mb-1 transition-colors ${
            isActive ? "text-white" : "text-black"
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-sm mb-3 transition-colors ${
            isActive ? "text-white" : "text-gray-700"
          }`}
        >
          {para}
        </p>
        <button
          className={`text-xs py-1 px-3 rounded-md border transition-colors ${
            isActive
              ? "border-white text-white hover:bg-white hover:text-[#52796F]"
              : "border-[#354F52] text-[#354F52] hover:bg-[#354F52] hover:text-white"
          }`}
        >
          Learn More
        </button>
      </div>
    </div>
  );
}
