import React from "react";
import Link from "next/link";
import { FaRegBell } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";

export default function Navbar() {
  const links = [
    { name: "Home", href: "/" },
    { name: "About us", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Help Center", href: "/help" },
    { name: "Services", href: "/services" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full h-[60px] flex justify-between items-center px-6 bg-[#354F52] text-white shadow-md z-50">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-20">
        <p className="font-bold text-xl tracking-wide">TrainSight</p>

        <ul className="flex gap-10 ml-80">
          {links.map((link, i) => (
            <li key={i}>
              <Link
                href={link.href}
                className="text-white hover:text-[#C1B8AE] transition-colors duration-300"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex justify-between items-center gap-10 pr-4">
        <FaSearch className="text-white text-lg cursor-pointer hover:text-[#C1B8AE] transition-colors" />
        <FaRegBell className="text-white text-lg cursor-pointer hover:text-[#C1B8AE] transition-colors" />
        <FaRegUserCircle className="text-white text-lg cursor-pointer hover:text-[#C1B8AE] transition-colors" />
      </div>
    </header>
  );
}
