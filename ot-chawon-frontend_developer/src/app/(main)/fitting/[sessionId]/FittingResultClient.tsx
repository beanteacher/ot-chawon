'use client';

import { useRouter } from 'next/navigation';
import { FittingResult } from '@/components/fitting/FittingResult';

interface FittingResultClientProps {
  sessionId: string;
}

export function FittingResultClient({ sessionId }: FittingResultClientProps) {
  const router = useRouter();

  const handleAddToCart = (size: string) => {
    // TODO: 실제 장바구니 담기 연동
    router.push('/cart');
  };

  return (
    <div className="space-y-4">
      <FittingResult
        sessionId={sessionId}
        fitScore={94}
        onAddToCart={handleAddToCart}
      />

      {/* 다시 피팅하기 */}
      <button
        onClick={() => router.push('/fitting')}
        className="w-full py-3 text-sm font-medium text-oc-gray-400 border border-oc-gray-700 rounded-xl hover:border-oc-gray-500 hover:text-oc-gray-300 transition-colors"
      >
        다시 피팅하기
      </button>
    </div>
  );
}
