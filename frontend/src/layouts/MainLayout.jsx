import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SiteOpeningReveal from '../components/SiteOpeningReveal';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F5] dark:bg-[#0B0F17] text-stone-900 dark:text-stone-100 transition-colors duration-300 font-sans antialiased">
      <SiteOpeningReveal />
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
