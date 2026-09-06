import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
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

export const metadata = {
  title: "TrainSight - AI-Powered Fitness Platform",
  description: "Transform your training with AI-powered coaching, real-time feedback, and personalized fitness programs.",
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`}>
      <body className="font-inter">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
