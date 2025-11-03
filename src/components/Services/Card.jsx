import Image from "next/image";

export default function Card({ image, title, para }) {
  return (
    <div className="bg-[#C8CDC5] rounded-2xl shadow-md overflow-hidden w-[280px] transition-transform duration-300 hover:scale-105 hover:shadow-xl ">
      {/* Image */}
      <div className="relative top-10 w-full h-[200px]">
      <Image
  src={image}
  alt={title}
  width={70}
 
  className="object-cover mx-auto rounded-t-2xl"
/>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-semibold  mb-2 relative bottom-20">
          {title}
        </h3>
        <p className="text-gray-600 mb-4 relative bottom-15">{para}</p>
        <button className="border border-[#354F52] text-[#354F52] py-2 px-4 rounded-lg hover:bg-[#354F52] hover:text-white transition">
          Learn More
        </button>
      </div>
    </div>
  );
}
