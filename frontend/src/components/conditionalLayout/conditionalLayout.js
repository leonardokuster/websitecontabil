'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/header/Header.js'; 
import Footer from '@/components/footer/Footer.js'; 

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <>
      {!isDashboard && <Header />}
      <main>{children}</main>
      {!isDashboard && <Footer />}
    </>
  );
}