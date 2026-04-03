'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/axios';
import { cn } from '@/lib/utils/cn';
import type { OrderDto } from '@/services/order/dto/order.dto';

const STEP_STATUSES: OrderDto.OrderStatus[] = ['PENDING', 'PAID', 'SHIPPING', 'DELIVERED', 'COMPLETED'];

const STATUS_LABEL: Record<OrderDto.OrderStatus, string> = {
  PENDING: '결제대기',
  PAYMENT_REQUESTED: '결제요청',
  PAID: '결제완료',
  SHIPPING: '배송중',
  DELIVERED: '배송완료',
  COMPLETED: '구매확정',
  CANCELLED: '취소',
  REFUNDED: '환불',
};

const STEP_LABEL: Record<string, string> = {
  PENDING: '결제대기',
  PAID: '결제완료',
  SHIPPING: '배송중',
  DELIVERED: '배송완료',
  COMPLETED: '구매확정',
};

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  credit_card: '신용카드',
  kakao_pay: '카카오페이',
  naver_pay: '네이버페이',
  bank_transfer: '계좌이체',
};

interface Props {
  orderId: string;
}

export function OrderDetailClient({ orderId }: Props) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderDto.OrderDetail | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get<{ data: OrderDto.OrderDetail & { paymentMethod?: string } }>(
          `/api/orders/${orderId}`
        );
        const data = response.data.data;
        setOrder(data);
        setPaymentMethod(data.paymentMethod ?? '');
      } catch {
        setError('주문 정보를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleCancel = async () => {
    if (!order) return;
    if (!confirm('주문을 취소하시겠습니까?')) return;
    setIsCancelling(true);
    try {
      await apiClient.put(`/api/orders/${orderId}/cancel`);
      setOrder((prev) => prev ? { ...prev, status: 'CANCELLED' } : prev);
    } catch {
      alert('주문 취소에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-oc-gray-500">
        <p className="mb-4">{error ?? '주문을 찾을 수 없습니다.'}</p>
        <button
          onClick={() => router.push('/order/history')}
          className="px-4 py-2 bg-white border border-oc-gray-200 rounded-lg text-sm hover:border-oc-gray-300 transition-colors"
        >
          주문 내역으로 돌아가기
        </button>
      </div>
    );
  }

  const isTerminalStatus = order.status === 'CANCELLED' || order.status === 'REFUNDED';
  const currentStepIndex = STEP_STATUSES.indexOf(order.status);
  const canCancel = order.status === 'PENDING' || order.status === 'PAID';
  const formattedDate = new Date(order.createdAt).toLocaleString('ko-KR');
  const addr = order.shippingAddress;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push('/order/history')}
          className="text-oc-gray-500 hover:text-oc-gray-900 transition-colors"
          aria-label="뒤로가기"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-oc-gray-900">주문 상세</h1>
      </div>

      {/* 주문번호 + 날짜 */}
      <div className="bg-white border border-oc-gray-200 rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-xs text-oc-gray-500 font-mono">{order.orderId}</span>
          <span className="text-xs text-oc-gray-400">{formattedDate}</span>
        </div>
      </div>

      {/* 주문 상태 스텝 인디케이터 */}
      {isTerminalStatus ? (
        <div className="bg-white border border-oc-gray-200 rounded-xl p-4 mb-4 text-center">
          <span className={cn(
            'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border',
            order.status === 'CANCELLED'
              ? 'bg-red-500/20 text-red-400 border-red-500/30'
              : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
          )}>
            {STATUS_LABEL[order.status]}
          </span>
        </div>
      ) : (
        <div className="bg-white border border-oc-gray-200 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            {STEP_STATUSES.map((step, idx) => {
              const isActive = idx <= currentStepIndex;
              const isLast = idx === STEP_STATUSES.length - 1;
              return (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center gap-1">
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2',
                      isActive
                        ? 'bg-[#FF6B35] border-[#FF6B35] text-white'
                        : 'bg-oc-gray-50 border-oc-gray-200 text-oc-gray-400'
                    )}>
                      {idx + 1}
                    </div>
                    <span className={cn(
                      'text-[10px] text-center',
                      isActive ? 'text-[#FF6B35]' : 'text-oc-gray-400'
                    )}>
                      {STEP_LABEL[step]}
                    </span>
                  </div>
                  {!isLast && (
                    <div className={cn(
                      'flex-1 h-0.5 mx-1 mb-4',
                      idx < currentStepIndex ? 'bg-[#FF6B35]' : 'bg-oc-gray-200'
                    )} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* 상품 목록 */}
      <div className="bg-white border border-oc-gray-200 rounded-xl p-4 mb-4">
        <h2 className="text-sm font-semibold text-oc-gray-900 mb-3">주문 상품</h2>
        <div className="flex flex-col gap-3">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex gap-3 items-start">
              <div className="w-16 h-16 bg-oc-gray-100 border border-oc-gray-200 rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-oc-gray-900 font-medium truncate">{item.productName}</p>
                <p className="text-xs text-oc-gray-400 mt-0.5">
                  {item.size}{item.color ? ` / ${item.color}` : ''} / {item.quantity}개
                </p>
              </div>
              <span className="text-sm text-oc-gray-900 font-semibold flex-shrink-0">
                {(item.price * item.quantity).toLocaleString()}원
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 배송 정보 */}
      <div className="bg-white border border-oc-gray-200 rounded-xl p-4 mb-4">
        <h2 className="text-sm font-semibold text-oc-gray-900 mb-3">배송 정보</h2>
        <dl className="flex flex-col gap-1.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-oc-gray-400">수령인</dt>
            <dd className="text-oc-gray-900">{addr.recipientName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-oc-gray-400">연락처</dt>
            <dd className="text-oc-gray-900">{addr.phone}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-oc-gray-400">주소</dt>
            <dd className="text-oc-gray-900 text-right max-w-[60%]">
              ({addr.zipCode}) {addr.address} {addr.addressDetail}
            </dd>
          </div>
          {addr.memo && (
            <div className="flex justify-between">
              <dt className="text-oc-gray-400">배송 메모</dt>
              <dd className="text-oc-gray-900">{addr.memo}</dd>
            </div>
          )}
          {order.trackingNumber && (
            <div className="flex justify-between">
              <dt className="text-oc-gray-400">운송장 번호</dt>
              <dd className="text-oc-gray-900 font-mono text-xs">{order.trackingNumber}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* 결제 정보 */}
      <div className="bg-white border border-oc-gray-200 rounded-xl p-4 mb-6">
        <h2 className="text-sm font-semibold text-oc-gray-900 mb-3">결제 정보</h2>
        <dl className="flex flex-col gap-1.5 text-sm">
          {paymentMethod && (
            <div className="flex justify-between">
              <dt className="text-oc-gray-400">결제수단</dt>
              <dd className="text-oc-gray-900">{PAYMENT_METHOD_LABEL[paymentMethod] ?? paymentMethod}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-oc-gray-400">상품 금액</dt>
            <dd className="text-oc-gray-900">{order.totalPrice.toLocaleString()}원</dd>
          </div>
          <div className="flex justify-between border-t border-oc-gray-200 pt-2 mt-1">
            <dt className="text-oc-gray-500 font-semibold">총 결제금액</dt>
            <dd className="text-[#FF6B35] font-bold">{order.totalPrice.toLocaleString()}원</dd>
          </div>
        </dl>
      </div>

      {/* 주문 취소 버튼 */}
      {canCancel && (
        <button
          onClick={handleCancel}
          disabled={isCancelling}
          className={cn(
            'w-full py-3 rounded-xl text-sm font-medium border transition-colors',
            isCancelling
              ? 'opacity-50 cursor-not-allowed border-oc-gray-200 text-oc-gray-400'
              : 'border-red-500/50 text-red-400 hover:bg-red-500/10'
          )}
        >
          {isCancelling ? '취소 처리 중...' : '주문 취소'}
        </button>
      )}
    </div>
  );
}
