"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar/NavBar";
import Footer from "@/components/footer/Footer";

export default function MainLayout({ children }) {
  const pathname = usePathname();

  // The home page opens on a full-height hero video, and the navbar sits over
  // it transparently. Padding the main element there would push the video down
  // and leave a dark strip above it. Every other page needs the padding,
  // because its content starts immediately under a solid navbar.
  const overlayHero = pathname === "/";

  return (
    <>
      <Navbar />
      <main className={overlayHero ? "" : "pt-[var(--nav-h)]"}>{children}</main>
      <Footer />
    </>
  );
}
