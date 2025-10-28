import Image from "next/image";
import picture from "../assets/picture.jpg";

export default function Header() {
  return (
   <section>
     <Image
  src={picture}
  alt="Header Image"
  className="absolute top-0 left-0 w-full h-[300px] md:h-[550px] object-cover z-0"
/>
   <div className="relative h-[490px] bg-[#354F52]/50 text-white p-[20vh]">
    <h2 className="flex flex-col justify-center items-center text-[4rem] uppercase font-bold tracking-wide mb-4">
  <span>About Trainsight</span>
  <span>Tools</span>
</h2>


   </div>
   
   </section>
  );
}