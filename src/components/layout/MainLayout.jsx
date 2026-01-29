"use client";

import Navbar from "@/components/navbar/NavBar";
import Footer from "@/components/footer/Footer";

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="pt-[60px]">{children}</main>
      <Footer />
    </>
  );
}

