'use client';

import type { FittingDto } from '@/types/fitting.dto';

interface FittingHistoryProps {
  fittings: FittingDto.Response[];
}

const STATUS_LABEL: Record<FittingDto.Response['status'], string> = {
  QUEUED: '대기 중',
  PROCESSING: '처리 중',
  COMPLETED: '완료',
  FAILED: '실패',
};

const STATUS_COLOR: Record<FittingDto.Response['status'], string> = {
  QUEUED: 'bg-oc-gray-700 text-oc-gray-300',
  PROCESSING: 'bg-[#3B82F6]/20 text-[#60A5FA]',
  COMPLETED: 'bg-[#FF6B35]/20 text-[#FF6B35]',
  FAILED: 'bg-red-500/20 text-red-400',
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function FittingHistory({ fittings }: FittingHistoryProps) {
  if (fittings.length === 0) {
    return (
      <div className="bg-oc-surface rounded-2xl p-6 text-center text-oc-gray-500 text-sm">
        피팅 이력이 없습니다
      </div>
    );
  }

  return (
    <div className="bg-oc-surface rounded-2xl p-6 space-y-4">
      <h2 className="text-lg font-bold text-oc-primary">피팅 이력</h2>
      <ul className="space-y-3">
        {fittings.map((fitting) => (
          <li
            key={fitting.id}
            className="flex items-center justify-between p-3 rounded-xl bg-oc-black border border-oc-gray-800"
          >
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-white">
                아이템 #{fitting.itemId}
              </p>
              <p className="text-xs text-oc-gray-500">{formatDate(fitting.createdAt)}</p>
            </div>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLOR[fitting.status]}`}
            >
              {STATUS_LABEL[fitting.status]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
