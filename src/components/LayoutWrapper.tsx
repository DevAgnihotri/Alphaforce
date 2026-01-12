'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ProductTour } from '@/components/ProductTour';
import { initSession, trackPageVisit } from '@/lib/sessionTracking';
import { notifyLogin, useNotifications } from '@/lib/notifications';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const notifications = useNotifications(state => state.notifications);
  
  // Initialize session and track page visits
  useEffect(() => {
    const session = initSession();
    
    // Show login notification only once per session (when no pages visited yet)
    if (session.pagesVisited.length === 0) {
      notifyLogin();
    }
    
    // Track current page
    trackPageVisit(pathname);
  }, [pathname, notifications.length]);
  
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
