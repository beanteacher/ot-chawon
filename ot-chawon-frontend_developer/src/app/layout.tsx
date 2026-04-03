import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { SidebarProvider } from './sidebar-context';

export const metadata: Metadata = {
  title: '옷차원 - AI 3D 가상 피팅',
  description: 'AI 기반 3D 옷핏 가상 피팅 쇼핑 플랫폼',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-oc-gray-50 text-oc-gray-900 antialiased">
        <Providers>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
