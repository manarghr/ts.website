
import React from 'react';
import "./globals.css";
import Head from '@/components/head/Head';
import AIHome from '@/components/AiHome/AIHome';
import Services from '@/components/Services/Services';


export default function Home() {
  return (
    <div>
     <Head/>
     <AIHome/>
     <Services/>
    </div>
  );
}