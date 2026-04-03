'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

export type MyPageTab = 'profile' | 'orders' | 'fittings' | 'address';

interface TabItem {
  id: MyPageTab;
  label: string;
}

const TABS: TabItem[] = [
  { id: 'profile', label: '프로필' },
  { id: 'orders', label: '주문내역' },
  { id: 'fittings', label: '피팅이력' },
  { id: 'address', label: '배송지' },
];

interface MyPageTabsProps {
  activeTab: MyPageTab;
  onChange: (tab: MyPageTab) => void;
}

export function MyPageTabs({ activeTab, onChange }: MyPageTabsProps) {
  return (
    <nav
      className="border-b border-oc-gray-300 overflow-x-auto scrollbar-none"
      aria-label="마이페이지 탭 네비게이션"
    >
      <div className="flex min-w-max">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={cn(
                'px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2',
                isActive
                  ? 'border-[#FF6B35] text-oc-gray-900'
                  : 'border-transparent text-oc-gray-500 hover:text-oc-gray-900 hover:border-oc-gray-300'
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
