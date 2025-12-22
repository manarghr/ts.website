import Image from "next/image";

export default function Cardes({ image, title, para, className = "" }) {
  return (
    <div
      className={`relative w-[280px] md:w-[300px] h-[480px] overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-[#6BB371]/50 ${className}`}
    >
      {/* Background image */}
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-300 hover:scale-110"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#354F52]/95 via-[#354F52]/60 to-transparent"></div>

      {/* Text content */}
      <div className="absolute bottom-0 p-6 text-white z-10 w-full">
        <div className="mb-3">
          <div className="w-12 h-1 bg-[#6BB371] rounded-full mb-4"></div>
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
        </div>
        <p className="text-sm md:text-base text-white/90 leading-relaxed">{para}</p>
        
        {/* View Profile Button */}
        <button className="mt-4 px-4 py-2 bg-[#6BB371] hover:bg-[#52796F] text-white text-sm font-semibold rounded-lg transition-all duration-300 hover:scale-105">
          View Profile
        </button>
      </div>
    </div>
  );
}
