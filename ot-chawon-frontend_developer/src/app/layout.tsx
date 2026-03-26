import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { SidebarProvider } from './sidebar-context';

export const metadata: Metadata = {
  title: '옷차원 - AI 3D 가상 피팅',
  description: 'AI 기반 3D 옷핏 가상 피팅 쇼핑 플랫폼',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-oc-black text-white antialiased">
        <Providers>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
