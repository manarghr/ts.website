import Image from "next/image";

export default function Cardes({ image, title, para, className = "" }) {
  return (
    <div
      className={`relative bottom-30 w-[260px] h-[460px]  overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl ${className}`}
    >
      {/* Background image */}
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
      />

      {/* Blurred overlay only at the bottom */}
      <div className="absolute bottom-0 w-full h-[150px] bg-gradient-to-t from-black/60 via-black/30 to-transparent backdrop-blur-sm"></div>

      {/* Text content */}
      <div className="absolute bottom-0 p-5 text-white z-10">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm">{para}</p>
      </div>
    </div>
  );
}
