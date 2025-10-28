import "./globals.css";
import Navbar from "@/components/navBar/NavBar";
import Footer from "@/components/footer/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="pt-[60px]">{children}</main> {/* space for fixed navbar */}
        
      </body>
    </html>
  );
}
