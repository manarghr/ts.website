import "./globals.css";
import Navbar from "@/components/navBar/NavBar";
import Footer from "@/components/footer/Footer";
import { Montserrat, Inter } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`}>
      <body className="font-inter">
        <Navbar />
        <main className="pt-[60px]">{children}</main> {/* space for fixed navbar */}
        <Footer/>
      </body>
    </html>
  );
}
