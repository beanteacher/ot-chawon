'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/axios';
import { Pagination } from '@/components/ui/pagination';
import { cn } from '@/lib/utils/cn';
import type { OrderDto } from '@/services/order/dto/order.dto';

type StatusFilter = 'ALL' | OrderDto.OrderStatus;

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: 'ALL', label: '전체' },
  { key: 'PENDING', label: '결제대기' },
  { key: 'PAID', label: '결제완료' },
  { key: 'SHIPPING', label: '배송중' },
  { key: 'DELIVERED', label: '배송완료' },
  { key: 'CANCELLED', label: '취소' },
];

const STATUS_CONFIG: Partial<Record<OrderDto.OrderStatus, { label: string; className: string }>> = {
  PENDING: { label: '결제대기', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  PAYMENT_REQUESTED: { label: '결제요청', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  PAID: { label: '결제완료', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  SHIPPING: { label: '배송중', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  DELIVERED: { label: '배송완료', className: 'bg-[#616161]/20 text-[#BDBDBD] border-[#616161]/30' },
  COMPLETED: { label: '구매확정', className: 'bg-[#616161]/20 text-[#BDBDBD] border-[#616161]/30' },
  CANCELLED: { label: '취소', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
  REFUNDED: { label: '환불', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

const PAGE_SIZE = 10;

export default function OrderHistoryPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('ALL');
  const [orders, setOrders] = useState<OrderDto.OrderDetail[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (status: StatusFilter, currentPage: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = { page: currentPage, size: PAGE_SIZE };
      if (status !== 'ALL') params.status = status;

      const response = await apiClient.get<{ data: OrderDto.ListResponse }>('/api/orders', { params });
      const data = response.data.data;
      setOrders(data.orders);
      setTotal(data.total);
    } catch {
      setError('주문 내역을 불러오는 데 실패했습니다.');
      setOrders([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(activeFilter, page);
  }, [activeFilter, page, fetchOrders]);

  const handleFilterChange = (filter: StatusFilter) => {
    setActiveFilter(filter);
    setPage(1);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-[#111111] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-[#F9F9F9] mb-6">주문 내역</h1>

        {/* 상태 필터 탭 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleFilterChange(tab.key)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium transition-colors border',
                activeFilter === tab.key
                  ? 'bg-[#FF6B35] text-white border-[#FF6B35]'
                  : 'bg-[#212121] text-[#BDBDBD] border-[#333333] hover:border-[#616161]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 로딩 */}
        {isLoading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* 에러 */}
        {!isLoading && error && (
          <div className="text-center py-16 text-red-400">{error}</div>
        )}

        {/* 빈 상태 */}
        {!isLoading && !error && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-[#616161]">
            <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-[#BDBDBD] mb-4">주문 내역이 없습니다</p>
            <button
              onClick={() => router.push('/products')}
              className="px-6 py-2 bg-[#FF6B35] text-white rounded-lg text-sm font-medium hover:bg-[#E55A24] transition-colors"
            >
              쇼핑하기
            </button>
          </div>
        )}

        {/* 주문 목록 */}
        {!isLoading && !error && orders.length > 0 && (
          <>
            <div className="flex flex-col gap-3">
              {orders.map((order) => {
                const statusCfg = STATUS_CONFIG[order.status];
                const formattedDate = new Date(order.createdAt).toLocaleDateString('ko-KR');
                const firstItem = order.items[0];
                const itemLabel = firstItem
                  ? order.items.length > 1
                    ? `${firstItem.productName} 외 ${order.items.length - 1}개`
                    : firstItem.productName
                  : '-';

                return (
                  <div
                    key={order.orderId}
                    onClick={() => router.push(`/order/${order.orderId}`)}
                    className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 cursor-pointer hover:border-[#616161] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs text-[#BDBDBD] font-mono">{order.orderId}</span>
                      {statusCfg && (
                        <span className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                          statusCfg.className
                        )}>
                          {statusCfg.label}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#F9F9F9] font-medium mb-1">{itemLabel}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-[#616161]">{formattedDate}</span>
                      <span className="text-sm text-[#F9F9F9] font-semibold">
                        {order.totalPrice.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
