
import React from 'react';
import "./globals.css";
import Head from '@/components/head/Head';
import AIHome from '@/components/AiHome/AIHome';
import Footer from '@/components/footer/Footer';


export default function Home() {
  return (
    <div>
     <Head/>
     <AIHome/>
     <Footer/>
    </div>
  );
}