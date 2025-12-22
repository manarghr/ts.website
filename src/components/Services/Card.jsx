import Image from "next/image";

export default function Card({ image, title, para, isActive }) {
  return (
    <div className={`overflow-hidden transition-all duration-500 rounded-2xl ${
      isActive 
        ? "bg-gradient-to-br from-[#354F52] to-[#52796F] text-white shadow-2xl" 
        : "bg-white text-[#354F52] shadow-lg hover:shadow-xl border border-[#C8CDC5]"
    }`}>
      {/* Image */}
      <div className="relative w-full h-[140px] flex justify-center items-center p-6">
        <div className={`w-20 h-20 rounded-xl flex items-center justify-center transition-all duration-300 ${
          isActive 
            ? "bg-white/20 backdrop-blur-sm" 
            : "bg-[#354F52]/10"
        }`}>
          <Image
            src={image}
            alt={title}
            width={60}
            height={60}
            className={`object-contain transition-all duration-300 ${
              isActive ? "brightness-0 invert" : ""
            }`}
          />
        </div>
      </div>

      {/* Text */}
      <div className="p-6 text-center">
        <h3
          className={`text-xl font-bold mb-3 transition-colors ${
            isActive ? "text-white" : "text-[#354F52]"
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-sm mb-6 leading-relaxed transition-colors ${
            isActive ? "text-white/90" : "text-gray-600"
          }`}
        >
          {para}
        </p>
        <button
          className={`text-sm font-semibold py-2.5 px-6 rounded-lg transition-all duration-300 ${
            isActive
              ? "bg-white text-[#354F52] hover:bg-white/90 hover:scale-105 shadow-lg"
              : "bg-[#354F52] text-white hover:bg-[#52796F] hover:scale-105"
          }`}
        >
          Learn More
        </button>
      </div>
    </div>
  );
}
