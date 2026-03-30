'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { cn } from '@/lib/utils/cn';

const GNB_LINKS = [
  { href: '/', label: '홈' },
  { href: '/products', label: '상품' },
  { href: '/fitting', label: '피팅' },
  { href: '/mypage', label: '마이페이지' },
];

interface HeaderProps {
  onMenuOpen?: () => void;
}

export function Header({ onMenuOpen }: HeaderProps) {
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const items = useCartStore((s) => s.items);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full bg-oc-black border-b border-oc-gray-800 transition-shadow duration-200',
        scrolled && 'shadow-md'
      )}
    >
      <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* 햄버거 버튼 (모바일) */}
        <button
          type="button"
          className="md:hidden p-2 text-oc-gray-300 hover:text-white"
          onClick={onMenuOpen}
          aria-label="메뉴 열기"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* 로고 */}
        <Link href="/" className="text-xl font-bold text-white tracking-tight shrink-0">
          OT-CHAWON
        </Link>

        {/* GNB (데스크탑) */}
        <nav className="hidden md:flex items-center gap-6 ml-6">
          {GNB_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-oc-gray-300 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* 검색바 */}
        <div className="flex-1 max-w-xs hidden md:block">
          <input
            type="search"
            placeholder="상품 검색..."
            className="w-full bg-oc-gray-900 border border-oc-gray-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-oc-gray-500 focus:outline-none focus:border-oc-primary-500"
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          {/* 장바구니 */}
          <Link href="/cart" className="relative p-2 text-oc-gray-300 hover:text-white" aria-label="장바구니">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {items.length > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-oc-primary-500 text-white text-2xs font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {items.length > 99 ? '99+' : items.length}
              </span>
            )}
          </Link>

          {/* 사용자 메뉴 */}
          {isAuthenticated && user ? (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-oc-gray-300">{user.name}</span>
              <Link href="/mypage" className="text-sm text-oc-gray-300 hover:text-white transition-colors">
                마이페이지
              </Link>
              <button
                type="button"
                onClick={clearAuth}
                className="text-sm text-oc-gray-300 hover:text-white transition-colors"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login" className="text-sm text-oc-gray-300 hover:text-white transition-colors">
                로그인
              </Link>
              <Link
                href="/signup"
                className="text-sm bg-oc-primary-500 hover:bg-oc-primary-600 text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                회원가입
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
