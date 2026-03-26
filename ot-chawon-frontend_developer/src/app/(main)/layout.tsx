import type { ReactNode } from 'react';
import { Footer } from '@/components/layout';
import { MobileNav } from '@/components/layout';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
