'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';
import type { OrderDto } from '@/types/order.dto';

// Mock 데이터 (실제 API 연동 전)
const MOCK_ORDERS: (OrderDto.Response & { productName: string })[] = [
  {
    orderId: 'ORD-2024-001',
    status: 'DELIVERED',
    totalPrice: 128000,
    createdAt: '2024-03-10T10:30:00Z',
    productName: '오버사이즈 코튼 티셔츠 외 1개',
  },
  {
    orderId: 'ORD-2024-002',
    status: 'SHIPPED',
    totalPrice: 79000,
    createdAt: '2024-03-18T14:20:00Z',
    productName: '슬림 테이퍼드 데님 팬츠',
  },
  {
    orderId: 'ORD-2024-003',
    status: 'CONFIRMED',
    totalPrice: 189000,
    createdAt: '2024-03-22T09:15:00Z',
    productName: '울 블렌드 오버핏 코트',
  },
  {
    orderId: 'ORD-2024-004',
    status: 'CANCELLED',
    totalPrice: 55000,
    createdAt: '2024-03-05T16:45:00Z',
    productName: '체크 패턴 셔츠',
  },
];

const STATUS_CONFIG: Record<
  OrderDto.OrderStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: '결제대기',
    className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  },
  CONFIRMED: {
    label: '주문완료',
    className: 'bg-green-500/20 text-green-400 border-green-500/30',
  },
  SHIPPED: {
    label: '배송중',
    className: 'bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/30',
  },
  DELIVERED: {
    label: '배송완료',
    className: 'bg-[#616161]/20 text-[#BDBDBD] border-[#616161]/30',
  },
  CANCELLED: {
    label: '취소',
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
};

export function OrderHistory() {
  const [orders, setOrders] = useState<(OrderDto.Response & { productName: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 서비스 함수 호출 구조 유지 (mock)
    const fetchOrders = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setOrders(MOCK_ORDERS);
      setIsLoading(false);
    };
    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <section className="py-6">
        <h2 className="text-lg font-semibold text-[#F9F9F9] mb-6">주문 내역</h2>
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-6">
      <h2 className="text-lg font-semibold text-[#F9F9F9] mb-6">주문 내역</h2>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-[#616161]">
          <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm text-[#BDBDBD]">주문 내역이 없습니다</p>
        </div>
      ) : (
        <>
          {/* 데스크탑: 테이블 */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#616161]">
                  <th className="text-left py-3 px-4 text-[#BDBDBD] font-medium">주문번호</th>
                  <th className="text-left py-3 px-4 text-[#BDBDBD] font-medium">상품명</th>
                  <th className="text-right py-3 px-4 text-[#BDBDBD] font-medium">결제금액</th>
                  <th className="text-center py-3 px-4 text-[#BDBDBD] font-medium">주문상태</th>
                  <th className="text-right py-3 px-4 text-[#BDBDBD] font-medium">주문일</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const statusConfig = STATUS_CONFIG[order.status];
                  const formattedDate = new Date(order.createdAt).toLocaleDateString('ko-KR');
                  return (
                    <tr
                      key={order.orderId}
                      className="border-b border-[#333333] hover:bg-[#212121] transition-colors"
                    >
                      <td className="py-4 px-4 text-[#BDBDBD] font-mono text-xs">{order.orderId}</td>
                      <td className="py-4 px-4 text-[#F9F9F9]">{order.productName}</td>
                      <td className="py-4 px-4 text-right text-[#F9F9F9] font-medium">
                        {order.totalPrice.toLocaleString()}원
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                            statusConfig.className
                          )}
                        >
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right text-[#BDBDBD] text-xs">{formattedDate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 모바일: 카드 */}
          <div className="md:hidden flex flex-col gap-3">
            {orders.map((order) => {
              const statusConfig = STATUS_CONFIG[order.status];
              const formattedDate = new Date(order.createdAt).toLocaleDateString('ko-KR');
              return (
                <div
                  key={order.orderId}
                  className="bg-[#212121] border border-[#333333] rounded-xl p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs text-[#BDBDBD] font-mono">{order.orderId}</span>
                    <span
                      className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
                        statusConfig.className
                      )}
                    >
                      {statusConfig.label}
                    </span>
                  </div>
                  <p className="text-sm text-[#F9F9F9] font-medium mb-1">{order.productName}</p>
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
        </>
      )}
    </section>
  );
}
