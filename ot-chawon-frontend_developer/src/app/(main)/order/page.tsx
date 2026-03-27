'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Checkbox } from '@/components/ui';
import { OrderForm, ShippingInfo } from '@/components/order/OrderForm';
import { PaymentSelect, PaymentMethod } from '@/components/order/PaymentSelect';

const DUMMY_ORDER_ITEMS = [
  { productId: 1, productName: '오버사이즈 코튼 티셔츠', size: 'M', color: '화이트', quantity: 2, price: 39000 },
  { productId: 2, productName: '와이드 데님 팬츠', size: '32', color: '인디고 블루', quantity: 1, price: 89000 },
];

const TERMS = [
  { id: 'terms-service', label: '[필수] 서비스 이용약관 동의' },
  { id: 'terms-privacy', label: '[필수] 개인정보 수집 및 이용 동의' },
  { id: 'terms-payment', label: '[필수] 전자금융거래 이용약관 동의' },
  { id: 'terms-marketing', label: '[선택] 마케팅 정보 수신 동의' },
];

export default function OrderPage() {
  const router = useRouter();
  const [isItemsExpanded, setIsItemsExpanded] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    recipientName: '',
    phone: '',
    zipCode: '',
    address: '',
    addressDetail: '',
    memo: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [agreedTerms, setAgreedTerms] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const subtotal = DUMMY_ORDER_ITEMS.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal >= 50000 ? 0 : 3000;
  const total = subtotal + shippingFee;

  const allTermsChecked = TERMS.every((t) => agreedTerms.has(t.id));
  const requiredTermsChecked = TERMS.filter((t) => t.label.includes('[필수]')).every((t) =>
    agreedTerms.has(t.id)
  );

  const handleAllTerms = (checked: boolean) => {
    if (checked) {
      setAgreedTerms(new Set(TERMS.map((t) => t.id)));
    } else {
      setAgreedTerms(new Set());
    }
  };

  const handleTermChange = (id: string, checked: boolean) => {
    setAgreedTerms((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleShippingChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleZipCodeSearch = () => {
    // 우편번호 검색 로직 (추후 API 연동)
    alert('우편번호 검색 기능은 API 연동 후 활성화됩니다.');
  };

  const handlePayment = async () => {
    if (!requiredTermsChecked) return;
    setIsLoading(true);
    // 결제 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    router.push('/order/complete');
  };

  return (
    <main className="max-w-screen-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">주문서 작성</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 왼쪽: 폼 영역 */}
        <div className="flex-1 flex flex-col gap-6">
          {/* 배송지 정보 */}
          <section className="rounded-lg border border-oc-gray-700 bg-oc-gray-900 p-5">
            <h2 className="text-base font-semibold text-white mb-4">배송지 정보</h2>
            <OrderForm
              shippingInfo={shippingInfo}
              onChange={handleShippingChange}
              onZipCodeSearch={handleZipCodeSearch}
            />
          </section>

          {/* 주문 상품 요약 */}
          <section className="rounded-lg border border-oc-gray-700 bg-oc-gray-900 p-5">
            <button
              type="button"
              className="w-full flex items-center justify-between"
              onClick={() => setIsItemsExpanded((v) => !v)}
            >
              <h2 className="text-base font-semibold text-white">
                주문 상품 ({DUMMY_ORDER_ITEMS.length}개)
              </h2>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-5 h-5 text-oc-gray-400 transition-transform ${isItemsExpanded ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isItemsExpanded && (
              <div className="mt-4 flex flex-col gap-3">
                {DUMMY_ORDER_ITEMS.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start text-sm">
                    <div>
                      <p className="text-oc-gray-200">{item.productName}</p>
                      <p className="text-xs text-oc-gray-500 mt-0.5">
                        {item.size} / {item.color} / {item.quantity}개
                      </p>
                    </div>
                    <span className="text-oc-gray-200 font-medium ml-4">
                      {(item.price * item.quantity).toLocaleString()}원
                    </span>
                  </div>
                ))}
              </div>
            )}

            {!isItemsExpanded && (
              <p className="mt-2 text-sm text-oc-gray-500">
                {DUMMY_ORDER_ITEMS[0]?.productName}
                {DUMMY_ORDER_ITEMS.length > 1 && ` 외 ${DUMMY_ORDER_ITEMS.length - 1}개`}
              </p>
            )}
          </section>

          {/* 결제 수단 */}
          <section className="rounded-lg border border-oc-gray-700 bg-oc-gray-900 p-5">
            <h2 className="text-base font-semibold text-white mb-4">결제 수단</h2>
            <PaymentSelect value={paymentMethod} onChange={setPaymentMethod} />
          </section>

          {/* 약관 동의 */}
          <section className="rounded-lg border border-oc-gray-700 bg-oc-gray-900 p-5">
            <h2 className="text-base font-semibold text-white mb-4">약관 동의</h2>
            <div className="flex flex-col gap-3">
              <div className="pb-3 border-b border-oc-gray-700">
                <Checkbox
                  label="전체 동의"
                  checked={allTermsChecked}
                  indeterminate={agreedTerms.size > 0 && !allTermsChecked}
                  onChange={(e) => handleAllTerms(e.target.checked)}
                  className="font-medium"
                />
              </div>
              {TERMS.map((term) => (
                <Checkbox
                  key={term.id}
                  id={term.id}
                  label={term.label}
                  checked={agreedTerms.has(term.id)}
                  onChange={(e) => handleTermChange(term.id, e.target.checked)}
                />
              ))}
            </div>
          </section>
        </div>

        {/* 오른쪽: 결제 요약 사이드바 */}
        <div className="lg:w-80 lg:flex-shrink-0">
          <div className="lg:sticky lg:top-4 rounded-lg border border-oc-gray-700 bg-oc-gray-900 p-5">
            <h2 className="text-base font-semibold text-white mb-4">최종 결제 금액</h2>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between text-oc-gray-300">
                <span>상품 금액</span>
                <span>{subtotal.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-oc-gray-300">
                <span>배송비</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-oc-primary-500">무료</span>
                  ) : (
                    `${shippingFee.toLocaleString()}원`
                  )}
                </span>
              </div>
              <div className="border-t border-oc-gray-700 pt-3 flex justify-between font-semibold text-base">
                <span className="text-white">총 결제 금액</span>
                <span className="text-oc-primary-500">{total.toLocaleString()}원</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              className="mt-5"
              onClick={handlePayment}
              disabled={!requiredTermsChecked}
              loading={isLoading}
            >
              {total.toLocaleString()}원 결제하기
            </Button>

            {!requiredTermsChecked && (
              <p className="mt-2 text-center text-xs text-oc-gray-500">
                필수 약관에 동의해주세요
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
