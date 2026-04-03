'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

export type PaymentMethod = 'credit_card' | 'kakao_pay' | 'naver_pay' | 'bank_transfer';

interface PaymentOption {
  value: PaymentMethod;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

const paymentOptions: PaymentOption[] = [
  {
    value: 'credit_card',
    label: '신용카드',
    description: 'VISA, Mastercard, 국내카드',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    value: 'kakao_pay',
    label: '카카오페이',
    description: '카카오페이 간편결제',
    icon: (
      <div className="w-5 h-5 rounded bg-yellow-400 flex items-center justify-center text-xs font-bold text-yellow-900">
        K
      </div>
    ),
  },
  {
    value: 'naver_pay',
    label: '네이버페이',
    description: '네이버페이 간편결제',
    icon: (
      <div className="w-5 h-5 rounded bg-green-500 flex items-center justify-center text-xs font-bold text-white">
        N
      </div>
    ),
  },
  {
    value: 'bank_transfer',
    label: '무통장입금',
    description: '가상계좌 발급 후 입금',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
      </svg>
    ),
  },
];

interface PaymentSelectProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export const PaymentSelect: React.FC<PaymentSelectProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-3">
      {paymentOptions.map((option) => {
        const isSelected = value === option.value;
        return (
          <label
            key={option.value}
            className={cn(
              'flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors',
              isSelected
                ? 'border-oc-primary-500 bg-oc-primary-500/10'
                : 'border-oc-gray-200 bg-white hover:border-oc-gray-400'
            )}
          >
            <input
              type="radio"
              name="payment-method"
              value={option.value}
              checked={isSelected}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            <div
              className={cn(
                'w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                isSelected ? 'border-oc-primary-500' : 'border-oc-gray-400'
              )}
            >
              {isSelected && (
                <div className="w-2 h-2 rounded-full bg-oc-primary-500" />
              )}
            </div>
            <div className={cn('flex-shrink-0', isSelected ? 'text-oc-primary-500' : 'text-oc-gray-400')}>
              {option.icon}
            </div>
            <div className="flex-1">
              <p className={cn('text-sm font-medium', isSelected ? 'text-oc-gray-900' : 'text-oc-gray-600')}>
                {option.label}
              </p>
              {option.description && (
                <p className="text-xs text-oc-gray-500 mt-0.5">{option.description}</p>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
};
