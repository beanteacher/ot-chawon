'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import {
  MyPageTabs,
  ProfileSection,
  OrderHistory,
  FittingGallery,
  AddressManagement,
} from '@/components/mypage';
import type { MyPageTab } from '@/components/mypage';

const TAB_HASH_MAP: Record<MyPageTab, string> = {
  profile: '#profile',
  orders: '#orders',
  fittings: '#fittings',
  address: '#address',
};

const HASH_TAB_MAP: Record<string, MyPageTab> = {
  '#profile': 'profile',
  '#orders': 'orders',
  '#fittings': 'fittings',
  '#address': 'address',
};

function getInitialTab(): MyPageTab {
  if (typeof window === 'undefined') return 'profile';
  const hash = window.location.hash;
  return HASH_TAB_MAP[hash] ?? 'profile';
}

export default function MyPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<MyPageTab>('profile');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    setActiveTab(getInitialTab());
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const tab = HASH_TAB_MAP[hash];
      if (tab) setActiveTab(tab);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab: MyPageTab) => {
    setActiveTab(tab);
    window.history.replaceState(null, '', TAB_HASH_MAP[tab]);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#111111]">
      <div className="max-w-screen-lg mx-auto px-4 py-8">
        {/* 헤더 */}
        <h1 className="text-2xl font-bold text-[#F9F9F9] mb-6">마이페이지</h1>

        {/* 탭 네비게이션 */}
        <MyPageTabs activeTab={activeTab} onChange={handleTabChange} />

        {/* 탭 콘텐츠 */}
        <div className="mt-6">
          {activeTab === 'profile' && <ProfileSection />}
          {activeTab === 'orders' && <OrderHistory />}
          {activeTab === 'fittings' && <FittingGallery />}
          {activeTab === 'address' && <AddressManagement />}
        </div>
      </div>
    </main>
  );
}
