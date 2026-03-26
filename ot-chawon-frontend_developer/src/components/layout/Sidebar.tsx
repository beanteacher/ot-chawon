'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/lib/utils/cn';

const GNB_LINKS = [
  { href: '/', label: '홈' },
  { href: '/products', label: '상품' },
  { href: '/fitting', label: '피팅' },
  { href: '/mypage', label: '마이페이지' },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { isAuthenticated, user, clearAuth } = useAuthStore();

  // ESC 키로 닫기
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  // 열릴 때 스크롤 잠금
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {/* 오버레이 */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/60 transition-opacity duration-300 md:hidden',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 사이드바 패널 */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-72 bg-oc-gray-900 border-r border-oc-gray-800 transition-transform duration-300 md:hidden flex flex-col',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-oc-gray-800 shrink-0">
          <span className="text-lg font-bold text-white">OT-CHAWON</span>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-oc-gray-400 hover:text-white"
            aria-label="메뉴 닫기"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* 사용자 정보 */}
        <div className="px-4 py-4 border-b border-oc-gray-800">
          {isAuthenticated && user ? (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-white font-medium">{user.name}</p>
              <p className="text-xs text-oc-gray-500">{user.email}</p>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/login"
                onClick={onClose}
                className="flex-1 text-center text-sm text-oc-gray-300 border border-oc-gray-700 rounded-lg py-2 hover:border-oc-gray-500 transition-colors"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                onClick={onClose}
                className="flex-1 text-center text-sm text-white bg-oc-primary-500 hover:bg-oc-primary-600 rounded-lg py-2 transition-colors"
              >
                회원가입
              </Link>
            </div>
          )}
        </div>

        {/* 네비게이션 */}
        <nav className="flex-1 overflow-y-auto py-2">
          {GNB_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="flex items-center px-4 py-3 text-sm text-oc-gray-300 hover:text-white hover:bg-oc-gray-800 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* 로그아웃 */}
        {isAuthenticated && (
          <div className="px-4 py-4 border-t border-oc-gray-800 shrink-0">
            <button
              type="button"
              onClick={() => { clearAuth(); onClose(); }}
              className="w-full text-sm text-oc-gray-400 hover:text-white py-2 transition-colors text-left"
            >
              로그아웃
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
