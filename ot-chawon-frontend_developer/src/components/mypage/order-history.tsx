'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import type { OrderDto } from '@/services/order/dto/order.dto';

const STATUS_CONFIG: Record<
  OrderDto.OrderStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: '결제대기',
    className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  },
  PAYMENT_REQUESTED: {
    label: '결제요청',
    className: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  },
  PAID: {
    label: '결제완료',
    className: 'bg-green-500/20 text-green-400 border-green-500/30',
  },
  SHIPPING: {
    label: '배송중',
    className: 'bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/30',
  },
  DELIVERED: {
    label: '배송완료',
    className: 'bg-[#616161]/20 text-[#BDBDBD] border-[#616161]/30',
  },
  COMPLETED: {
    label: '구매확정',
    className: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  },
  CANCELLED: {
    label: '취소',
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
  REFUNDED: {
    label: '환불',
    className: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  },
};

export function OrderHistory() {
  const router = useRouter();
  const [orders, setOrders] = useState<(OrderDto.Response & { productName: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const token = typeof window !== 'undefined'
          ? JSON.parse(localStorage.getItem('auth-storage') ?? '{}')?.state?.accessToken
          : null;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SPRING_GATEWAY_URL ?? 'http://localhost:8080'}/api/orders?page=0&size=10`,
          {
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );
        if (!res.ok) throw new Error('Failed to fetch orders');
        const json = await res.json();
        const data = json.data ?? json;
        const orderList = (data.orders ?? data ?? []).map((o: OrderDto.OrderDetail) => ({
          orderId: o.orderId,
          status: o.status,
          totalPrice: o.totalPrice,
          createdAt: o.createdAt,
          productName: o.items?.map((i) => i.productName).join(', ') ?? '',
        }));
        setOrders(orderList);
      } catch {
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <section className="py-6">
        <h2 className="text-lg font-semibold text-oc-gray-900 mb-6">주문 내역</h2>
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-6">
      <h2 className="text-lg font-semibold text-oc-gray-900 mb-6">주문 내역</h2>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-oc-gray-400">
          <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm text-oc-gray-500">주문 내역이 없습니다</p>
        </div>
      ) : (
        <>
          {/* 데스크탑: 테이블 */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-oc-gray-300">
                  <th className="text-left py-3 px-4 text-oc-gray-500 font-medium">주문번호</th>
                  <th className="text-left py-3 px-4 text-oc-gray-500 font-medium">상품명</th>
                  <th className="text-right py-3 px-4 text-oc-gray-500 font-medium">결제금액</th>
                  <th className="text-center py-3 px-4 text-oc-gray-500 font-medium">주문상태</th>
                  <th className="text-right py-3 px-4 text-oc-gray-500 font-medium">주문일</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const statusConfig = STATUS_CONFIG[order.status];
                  const formattedDate = new Date(order.createdAt).toLocaleDateString('ko-KR');
                  return (
                    <tr
                      key={order.orderId}
                      className="border-b border-oc-gray-100 hover:bg-white transition-colors cursor-pointer"
                      onClick={() => router.push(`/order/${order.orderId}`)}
                    >
                      <td className="py-4 px-4 text-oc-gray-500 font-mono text-xs">{order.orderId}</td>
                      <td className="py-4 px-4 text-oc-gray-900">{order.productName}</td>
                      <td className="py-4 px-4 text-right text-oc-gray-900 font-medium">
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
                      <td className="py-4 px-4 text-right text-oc-gray-500 text-xs">{formattedDate}</td>
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
                  className="bg-white border border-oc-gray-100 rounded-xl p-4 cursor-pointer hover:bg-oc-gray-50 transition-colors"
                  onClick={() => router.push(`/order/${order.orderId}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs text-oc-gray-500 font-mono">{order.orderId}</span>
                    <span
                      className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
                        statusConfig.className
                      )}
                    >
                      {statusConfig.label}
                    </span>
                  </div>
                  <p className="text-sm text-oc-gray-900 font-medium mb-1">{order.productName}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-oc-gray-400">{formattedDate}</span>
                    <span className="text-sm text-oc-gray-900 font-semibold">
                      {order.totalPrice.toLocaleString()}원
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          {/* 주문 내역 더보기 */}
          <div className="mt-4 text-center">
            <Link
              href="/order/history"
              className="text-sm text-[#FF6B35] hover:text-[#FF8C5A] transition-colors underline"
            >
              주문 내역 더보기
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
