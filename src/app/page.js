

import "./globals.css";
import Head from '@/components/head/Head';
import AIHome from '@/components/AiHome/AIHome';



import Services from '@/components/Services/Services';

import Footer from '@/components/footer/Footer';
import FAQ from '@/components/faq/FAQ';
import Coaches from '@/components/coaches/Coaches';
import Achievement from "@/components/achievement/Achievement";


export default function Home() {
  return (
    <div>
     
     <Head/>
   
     <AIHome/>
     <Services/>
      <Coaches/>
      <Achievement/>
     <FAQ/>
    </div>
  );
}