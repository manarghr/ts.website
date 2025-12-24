import Image from "next/image";
import Link from "next/link";

export default function Cardes({ image, title, para, name, description, id, className = "" }) {
  // Support both old format (title/para) and new format (name/description)
  const displayName = name || title;
  const displayDescription = description || para;
  const coachId = id || (name ? name.toLowerCase().replace(/\s+/g, '-') : null);

  // If name/description format (for coaches page), use the new card design
  if (name || description) {
    return (
      <div
        className={`bg-white rounded-2xl p-6 shadow-lg border border-[#C8CDC5]/50 hover:shadow-2xl hover:border-[#52796F]/50 transition-all duration-300 group ${className}`}
      >
        {/* Coach Image */}
        <div className="relative w-full h-72 mb-5 rounded-xl overflow-hidden bg-gradient-to-br from-[#C8CDC5] to-[#CAD2C5] group-hover:scale-105 transition-transform duration-300">
          <Image
            src={image}
            alt={displayName}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* Coach Name */}
        <h3 className="text-2xl font-bold text-[#354F52] mb-3 group-hover:text-[#52796F] transition-colors">
          {displayName}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-5 leading-relaxed min-h-[60px]">
          {displayDescription}
        </p>

        {/* Social Icons */}
        <div className="flex items-center gap-4 mb-5 text-gray-500">
          <button className="hover:text-red-500 transition-all hover:scale-110 transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
          <button className="hover:text-blue-500 transition-all hover:scale-110 transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </button>
          <button className="hover:text-green-500 transition-all hover:scale-110 transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
            </svg>
          </button>
        </div>

        {/* View Profile Button */}
        {coachId ? (
          <Link 
            href={`/coaches/${coachId}`}
            className="w-full py-3.5 bg-gradient-to-r from-[#354F52] to-[#52796F] text-white font-semibold rounded-lg hover:from-[#52796F] hover:to-[#6BB371] transition-all shadow-md hover:shadow-lg hover:scale-105 transform block text-center"
          >
            View Profile
          </Link>
        ) : (
          <button className="w-full py-3.5 bg-gradient-to-r from-[#354F52] to-[#52796F] text-white font-semibold rounded-lg hover:from-[#52796F] hover:to-[#6BB371] transition-all shadow-md hover:shadow-lg hover:scale-105 transform">
            View Profile
          </button>
        )}
      </div>
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
        
        {/* View Profile Button */}
        <button className="mt-4 px-4 py-2 bg-[#6BB371] hover:bg-[#52796F] text-white text-sm font-semibold rounded-lg transition-all duration-300 hover:scale-105">
          View Profile
        </button>
      </div>
    </div>
  );
}
