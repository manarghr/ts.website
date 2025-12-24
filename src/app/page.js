import "./globals.css";
import Head from '@/components/head/Head';
import AIHome from '@/components/AiHome/AIHome';
import Services from '@/components/Services/Services';
import Footer from '@/components/footer/Footer';
import FAQ from '@/components/faq/FAQ';
import CoachesHome from '@/components/coaches/CoachesHome';
import Achievement from "@/components/achievement/Achievement";
import TestimonialSection from "@/components/Testimonials/Testimonials";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Head/>
      <AIHome/>
      <Services/>
      <Achievement/>
      <CoachesHome/>
      <TestimonialSection/>
      <FAQ/>
    </div>
  );
}