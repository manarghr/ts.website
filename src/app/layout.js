import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { ConfirmProvider } from "@/components/ui/ConfirmProvider";
import { Manrope } from "next/font/google";

// One family, six weights.
//
// A display face paired with a separate body face is a valid system, but it
// asks the reader to hold two voices at once and it doubles the font payload.
// Manrope carries both jobs: tight and confident at 100px for a hero, and
// genuinely comfortable at 16px for body copy.
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
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
    <html lang="en" className={manrope.variable}>
      <body className="font-sans antialiased">
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
