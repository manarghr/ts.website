import Image from "next/image";
import { motion } from "framer-motion";

export default function Card({ image, title, para, isActive, icon: Icon, gradient }) {
  return (
    <motion.div
      className={`group relative overflow-hidden transition-all duration-500 rounded-3xl ${
        isActive 
          ? "bg-gradient-to-br from-[#354F52] to-[#52796F] text-white shadow-2xl" 
          : "bg-white text-[#354F52] shadow-lg hover:shadow-2xl border border-[#C8CDC5]/50 hover:border-[#52796F]/50"
      }`}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      {/* Decorative Background Elements */}
      {isActive && (
        <>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#6BB371]/10 rounded-full blur-[80px]"></div>
        </>
      )}

      {/* Icon Section */}
      <div className="relative w-full h-[180px] flex justify-center items-center p-8">
        {Icon ? (
          <div className={`relative w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-500 ${
            isActive 
              ? `bg-white/20 backdrop-blur-md shadow-xl group-hover:scale-110 group-hover:rotate-6`
              : `bg-gradient-to-br ${gradient} text-white shadow-lg group-hover:scale-110 group-hover:rotate-6`
          }`}>
            <Icon className="w-12 h-12" />
            {isActive && (
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/30 to-transparent"></div>
            )}
          </div>
        ) : (
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            isActive 
              ? "bg-white/20 backdrop-blur-sm shadow-xl" 
              : "bg-[#354F52]/10 group-hover:bg-[#354F52]/20"
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
        )}
      </div>

      {/* Content Section */}
      <div className="p-8 text-center">
        <h3
          className={`text-2xl font-black mb-4 transition-colors ${
            isActive ? "text-white" : "text-[#354F52]"
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-base mb-8 leading-relaxed transition-colors ${
            isActive ? "text-white/90" : "text-gray-600"
          }`}
        >
          {para}
        </p>
        <motion.button
          className={`w-full text-base font-bold py-4 px-8 rounded-2xl transition-all duration-300 ${
            isActive
              ? "bg-white text-[#354F52] hover:bg-white/90 shadow-xl hover:scale-105"
              : `bg-gradient-to-r ${gradient} text-white hover:shadow-xl hover:scale-105`
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Learn More
        </motion.button>
      </div>

      {/* Hover Effect Border */}
      {!isActive && (
        <div className="absolute inset-0 rounded-3xl border-2 border-[#52796F]/0 group-hover:border-[#52796F]/30 transition-all duration-500 pointer-events-none"></div>
      )}
    </motion.div>
  );
}
