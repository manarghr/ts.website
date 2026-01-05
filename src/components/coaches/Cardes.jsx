import Image from "next/image";
import Link from "next/link";
import { FaStar, FaUsers, FaAward, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Cardes({ 
  image, 
  title, 
  para, 
  name, 
  description, 
  id, 
  followers, 
  rating, 
  className = "" 
}) {
  const displayName = name || title;
  const displayDescription = description || para;
  const coachId = id || (name ? name.toLowerCase().replace(/\s+/g, '-') : null);
  const displayFollowers = followers || 200; // Default fallback
  const displayRating = rating || 5.0; // Default fallback

  // Enhanced card design for coaches page
  if (name || description) {
    return (
      <motion.div
        whileHover={{ y: -8 }}
        className={`bg-white rounded-2xl overflow-hidden shadow-lg border border-[#C8CDC5]/50 hover:shadow-xl hover:border-[#52796F]/50 transition-all duration-300 group ${className}`}
        style={{ width: '340px', height: '520px' }}
      >
        {/* Coach Image - Fixed size */}
        <div className="relative w-full h-64 overflow-hidden bg-gradient-to-br from-[#C8CDC5] to-[#CAD2C5]">
          <Image
            src={image}
            alt={displayName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          {/* Badge */}
          <div className="absolute top-4 right-4 px-3 py-1 bg-[#6BB371] text-white text-xs font-bold rounded-full shadow-lg">
            Available
          </div>
        </div>

        {/* Coach Info - Fixed padding */}
        <div className="p-6 flex flex-col h-[256px]">
          {/* Coach Name */}
          <h3 className="text-xl font-bold text-[#354F52] mb-2 group-hover:text-[#52796F] transition-colors">
            {displayName}
          </h3>

          {/* Description - Fixed height */}
          <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-grow line-clamp-3">
            {displayDescription}
          </p>

          {/* Stats - Updated with dynamic followers and rating */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#C8CDC5]/50">
            <div className="flex items-center gap-1.5">
              <FaStar className="text-[#6BB371] w-4 h-4" />
              <span className="text-sm font-semibold text-[#354F52]">{displayRating}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FaUsers className="text-[#52796F] w-4 h-4" />
              <span className="text-sm font-semibold text-gray-600">{displayFollowers}+</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FaAward className="text-[#6BB371] w-4 h-4" />
              <span className="text-sm font-semibold text-gray-600">Cert</span>
            </div>
          </div>

          {/* View Profile Button */}
          {coachId ? (
            <Link 
              href={`/coaches/${coachId}`}
              className="w-full py-3 bg-gradient-to-r from-[#354F52] to-[#52796F] text-white font-semibold rounded-lg hover:from-[#52796F] hover:to-[#6BB371] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              View Profile
              <FaArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <button className="w-full py-3 bg-gradient-to-r from-[#354F52] to-[#52796F] text-white font-semibold rounded-lg hover:from-[#52796F] hover:to-[#6BB371] transition-all shadow-md hover:shadow-lg">
              View Profile
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  // Original format (for home page) - image-based card
  return (
    <div
      className={`relative w-[280px] md:w-[300px] h-[480px] overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-[#6BB371]/50 ${className}`}
    >
      {/* Background image */}
      <Image
        src={image}
        alt={displayName}
        fill
        className="object-cover transition-transform duration-300 hover:scale-110"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#354F52]/95 via-[#354F52]/60 to-transparent"></div>

      {/* Text content */}
      <div className="absolute bottom-0 p-6 text-white z-10 w-full">
        <div className="mb-3">
          <div className="w-12 h-1 bg-[#6BB371] rounded-full mb-4"></div>
          <h3 className="text-2xl font-bold mb-2">{displayName}</h3>
        </div>
        <p className="text-sm md:text-base text-white/90 leading-relaxed">{displayDescription}</p>
        
        {/* Stats for home page version */}
        <div className="flex items-center gap-4 text-sm text-white/90 mt-3 mb-2">
          <div className="flex items-center gap-1">
            <FaUsers className="text-[#6BB371]" />
            <span>{displayFollowers} followers</span>
          </div>
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400" />
            <span>{displayRating}</span>
          </div>
        </div>
        
        {/* View Profile Button */}
        <button className="mt-4 px-4 py-2 bg-[#6BB371] hover:bg-[#52796F] text-white text-sm font-semibold rounded-lg transition-all duration-300 hover:scale-105">
          View Profile
        </button>
      </div>
    </div>
  );
}