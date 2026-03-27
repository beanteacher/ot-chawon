'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { Modal } from '@/components/ui/Modal';

interface SizeGuideProps {
  open: boolean;
  onClose: () => void;
  category?: string;
}

const TOP_SIZES = [
  { size: 'S', shoulder: 44, chest: 48, length: 65 },
  { size: 'M', shoulder: 46, chest: 50, length: 67 },
  { size: 'L', shoulder: 48, chest: 52, length: 69 },
  { size: 'XL', shoulder: 50, chest: 54, length: 71 },
];

const BOTTOM_SIZES = [
  { size: '28', waist: 72, hip: 90, length: 98 },
  { size: '30', waist: 76, hip: 94, length: 99 },
  { size: '32', waist: 80, hip: 98, length: 100 },
  { size: '34', waist: 84, hip: 102, length: 101 },
  { size: '36', waist: 88, hip: 106, length: 102 },
];

type TabType = '상의' | '하의';

export function SizeGuide({ open, onClose, category }: SizeGuideProps) {
  const defaultTab: TabType = category === '하의' ? '하의' : '상의';
  const [tab, setTab] = useState<TabType>(defaultTab);

  return (
    <Modal open={open} onClose={onClose} title="사이즈 가이드" size="lg">
      <div className="flex gap-2 mb-4 border-b border-oc-gray-200 -mx-6 px-6">
        {(['상의', '하의'] as TabType[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
              tab === t
                ? 'border-oc-primary-500 text-oc-primary-500'
                : 'border-transparent text-oc-gray-500 hover:text-oc-gray-800'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === '상의' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-oc-gray-200">
                <th className="py-2 text-left text-oc-gray-800 font-medium">사이즈</th>
                <th className="py-2 text-center text-oc-gray-800 font-medium">어깨너비</th>
                <th className="py-2 text-center text-oc-gray-800 font-medium">가슴단면</th>
                <th className="py-2 text-center text-oc-gray-800 font-medium">총장</th>
              </tr>
            </thead>
            <tbody>
              {TOP_SIZES.map((row) => (
                <tr key={row.size} className="border-b border-oc-gray-100">
                  <td className="py-2.5 font-semibold text-oc-gray-800">{row.size}</td>
                  <td className="py-2.5 text-center text-oc-gray-600">{row.shoulder}</td>
                  <td className="py-2.5 text-center text-oc-gray-600">{row.chest}</td>
                  <td className="py-2.5 text-center text-oc-gray-600">{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === '하의' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-oc-gray-200">
                <th className="py-2 text-left text-oc-gray-800 font-medium">사이즈</th>
                <th className="py-2 text-center text-oc-gray-800 font-medium">허리단면</th>
                <th className="py-2 text-center text-oc-gray-800 font-medium">엉덩이단면</th>
                <th className="py-2 text-center text-oc-gray-800 font-medium">총장</th>
              </tr>
            </thead>
            <tbody>
              {BOTTOM_SIZES.map((row) => (
                <tr key={row.size} className="border-b border-oc-gray-100">
                  <td className="py-2.5 font-semibold text-oc-gray-800">{row.size}</td>
                  <td className="py-2.5 text-center text-oc-gray-600">{row.waist}</td>
                  <td className="py-2.5 text-center text-oc-gray-600">{row.hip}</td>
                  <td className="py-2.5 text-center text-oc-gray-600">{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-3 text-xs text-oc-gray-400">(단위: cm, 측정 방법에 따라 1~3cm 오차 발생)</p>
    </Modal>
  );
}
