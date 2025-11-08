

import "./globals.css";
import Head from '@/components/head/Head';
import AIHome from '@/components/AiHome/AIHome';



import Services from '@/components/Services/Services';

import Footer from '@/components/footer/Footer';
import FAQ from '@/components/faq/FAQ';
import Coaches from '@/components/coaches/Coaches';


export default function Home() {
  return (
    <div>
     
     <Head/>
   
     <AIHome/>
     <Services/>
      <Coaches/>
     <FAQ/>
     <Footer />
    </div>
  );
}