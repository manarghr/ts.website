import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { ConfirmProvider } from "@/components/ui/ConfirmProvider";
import { Sora, Inter } from "next/font/google";

// Display face. Sora is a geometric grotesk with enough character to carry a
// hero headline at 100px, where Montserrat -- the previous choice -- reads as
// the default any template ships with.
const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

// Body face. Inter stays: it is genuinely excellent for interface text and
// pairing a characterful display face with a neutral body face is what stops
// the page shouting in two voices at once.
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
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body className="font-inter">
        {/* Feedback sits above AuthProvider so the auth modals can use it too. */}
        <ToastProvider>
          <ConfirmProvider>
            <AuthProvider>{children}</AuthProvider>
          </ConfirmProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
