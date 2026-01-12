'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { ProductTour } from '@/components/ProductTour';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Don't show sidebar on the landing page
  const isLandingPage = pathname === '/';

  if (isLandingPage) {
    return (
      <main className="min-h-screen">
        {children}
      </main>
    );
  }

  return (
    <>
      <Sidebar />
      <main className="lg:ml-64 min-h-screen">
        {children}
      </main>
      <ProductTour />
    </>
  );
}
