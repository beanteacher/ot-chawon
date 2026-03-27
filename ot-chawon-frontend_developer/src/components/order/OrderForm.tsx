'use client';

import React from 'react';
import { Input, FormField, Checkbox } from '@/components/ui';

export interface ShippingInfo {
  recipientName: string;
  phone: string;
  zipCode: string;
  address: string;
  addressDetail: string;
  memo: string;
}

interface OrderFormProps {
  shippingInfo: ShippingInfo;
  onChange: (field: keyof ShippingInfo, value: string) => void;
  onZipCodeSearch: () => void;
}

const MEMO_OPTIONS = [
  '직접 입력',
  '부재시 문 앞에 놓아주세요',
  '경비실에 맡겨주세요',
  '배송 전 연락 부탁드립니다',
  '택배함에 넣어주세요',
];

export const OrderForm: React.FC<OrderFormProps> = ({
  shippingInfo,
  onChange,
  onZipCodeSearch,
}) => {
  const [selectedMemo, setSelectedMemo] = React.useState(MEMO_OPTIONS[0]);

  const handleMemoSelect = (value: string) => {
    setSelectedMemo(value);
    if (value !== '직접 입력') {
      onChange('memo', value);
    } else {
      onChange('memo', '');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <FormField label="수령인" required htmlFor="recipient-name">
        <Input
          id="recipient-name"
          placeholder="이름을 입력하세요"
          value={shippingInfo.recipientName}
          onChange={(e) => onChange('recipientName', e.target.value)}
        />
      </FormField>

      <FormField label="연락처" required htmlFor="phone">
        <Input
          id="phone"
          placeholder="010-0000-0000"
          value={shippingInfo.phone}
          onChange={(e) => onChange('phone', e.target.value)}
        />
      </FormField>

      <FormField label="우편번호" required htmlFor="zip-code">
        <div className="flex gap-2">
          <Input
            id="zip-code"
            placeholder="우편번호"
            value={shippingInfo.zipCode}
            onChange={(e) => onChange('zipCode', e.target.value)}
            className="flex-1"
          />
          <button
            type="button"
            onClick={onZipCodeSearch}
            className="px-4 py-2 rounded-md border border-oc-gray-600 text-sm text-oc-gray-300 hover:bg-oc-gray-700 transition-colors whitespace-nowrap"
          >
            우편번호 검색
          </button>
        </div>
      </FormField>

      <FormField label="주소" required htmlFor="address">
        <Input
          id="address"
          placeholder="주소를 검색하세요"
          value={shippingInfo.address}
          onChange={(e) => onChange('address', e.target.value)}
          readOnly
        />
      </FormField>

      <FormField label="상세주소" htmlFor="address-detail">
        <Input
          id="address-detail"
          placeholder="상세주소를 입력하세요"
          value={shippingInfo.addressDetail}
          onChange={(e) => onChange('addressDetail', e.target.value)}
        />
      </FormField>

      <FormField label="배송 메모" htmlFor="memo">
        <select
          id="memo"
          value={selectedMemo}
          onChange={(e) => handleMemoSelect(e.target.value)}
          className="w-full rounded-md border border-oc-gray-600 bg-oc-gray-800 px-3 py-2 text-sm text-oc-gray-200 focus:outline-none focus:ring-2 focus:ring-oc-accent"
        >
          {MEMO_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {selectedMemo === '직접 입력' && (
          <Input
            placeholder="배송 메모를 입력하세요"
            value={shippingInfo.memo}
            onChange={(e) => onChange('memo', e.target.value)}
            className="mt-2"
          />
        )}
      </FormField>

      <div className="flex items-center gap-2 pt-1">
        <Checkbox
          id="save-address"
          label="배송지로 저장"
        />
      </div>
    </div>
  );
};
