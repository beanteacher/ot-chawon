'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form-field';

interface Address {
  id: string;
  recipientName: string;
  zipCode: string;
  address: string;
  addressDetail: string;
  phone: string;
  isDefault: boolean;
}

interface AddressFormState {
  recipientName: string;
  zipCode: string;
  address: string;
  addressDetail: string;
  phone: string;
}

const EMPTY_FORM: AddressFormState = {
  recipientName: '',
  zipCode: '',
  address: '',
  addressDetail: '',
  phone: '',
};

// Mock 데이터
const INITIAL_ADDRESSES: Address[] = [
  {
    id: 'addr-001',
    recipientName: '홍길동',
    zipCode: '06234',
    address: '서울특별시 강남구 테헤란로 123',
    addressDetail: '5층 501호',
    phone: '010-1234-5678',
    isDefault: true,
  },
  {
    id: 'addr-002',
    recipientName: '홍길동',
    zipCode: '04799',
    address: '서울특별시 성동구 왕십리로 50',
    addressDetail: '행당동 101-1',
    phone: '010-1234-5678',
    isDefault: false,
  },
];

export function AddressManagement() {
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressFormState>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addr: Address) => {
    setEditingId(addr.id);
    setForm({
      recipientName: addr.recipientName,
      zipCode: addr.zipCode,
      address: addr.address,
      addressDetail: addr.addressDetail,
      phone: addr.phone,
    });
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleChange = (field: keyof AddressFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (editingId) {
      setAddresses((prev) =>
        prev.map((a) =>
          a.id === editingId ? { ...a, ...form } : a
        )
      );
    } else {
      const newAddr: Address = {
        id: `addr-${Date.now()}`,
        ...form,
        isDefault: addresses.length === 0,
      };
      setAddresses((prev) => [...prev, newAddr]);
    }

    setIsSaving(false);
    handleClose();
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => {
      const filtered = prev.filter((a) => a.id !== id);
      // 삭제된 것이 기본 배송지였으면 첫 번째를 기본으로
      const hasDefault = filtered.some((a) => a.isDefault);
      if (!hasDefault && filtered.length > 0) {
        return filtered.map((a, i) => ({ ...a, isDefault: i === 0 }));
      }
      return filtered;
    });
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-oc-gray-900">배송지 관리</h2>
        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenAdd}
          className="bg-[#FF6B35] hover:bg-[#e55a25]"
        >
          + 배송지 추가
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-oc-gray-400">
          <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-sm text-oc-gray-500">등록된 배송지가 없습니다</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={cn(
                'bg-white border rounded-xl p-4',
                addr.isDefault ? 'border-[#FF6B35]/50' : 'border-oc-gray-100'
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold text-oc-gray-900">
                      {addr.recipientName}
                    </span>
                    {addr.isDefault && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#FF6B35]/20 text-[#FF6B35] border border-[#FF6B35]/30">
                        기본배송지
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-oc-gray-500">
                    [{addr.zipCode}] {addr.address}
                  </p>
                  {addr.addressDetail && (
                    <p className="text-sm text-oc-gray-500">{addr.addressDetail}</p>
                  )}
                  <p className="text-xs text-oc-gray-400 mt-1">{addr.phone}</p>
                </div>

                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEdit(addr)}
                    className="text-oc-gray-500 hover:text-oc-gray-900 text-xs px-2 h-7"
                  >
                    수정
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(addr.id)}
                    className="text-red-400 hover:text-red-300 text-xs px-2 h-7"
                  >
                    삭제
                  </Button>
                </div>
              </div>

              {!addr.isDefault && (
                <button
                  type="button"
                  onClick={() => handleSetDefault(addr.id)}
                  className="mt-3 text-xs text-oc-gray-500 hover:text-[#FF6B35] transition-colors underline"
                >
                  기본 배송지로 설정
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 배송지 추가/수정 모달 */}
      <Modal
        open={isModalOpen}
        onClose={handleClose}
        title={editingId ? '배송지 수정' : '배송지 추가'}
        size="md"
      >
        <div className="flex flex-col gap-4">
          <FormField label="수령인" htmlFor="addr-name" required>
            <Input
              id="addr-name"
              type="text"
              value={form.recipientName}
              onChange={(e) => handleChange('recipientName', e.target.value)}
              placeholder="수령인 이름"
            />
          </FormField>

          <FormField label="우편번호" htmlFor="addr-zip" required>
            <div className="flex gap-2">
              <Input
                id="addr-zip"
                type="text"
                value={form.zipCode}
                onChange={(e) => handleChange('zipCode', e.target.value)}
                placeholder="우편번호"
                className="flex-1"
              />
              <Button
                variant="secondary"
                size="md"
                type="button"
                onClick={() => alert('우편번호 검색은 API 연동 후 활성화됩니다.')}
                className="whitespace-nowrap"
              >
                검색
              </Button>
            </div>
          </FormField>

          <FormField label="주소" htmlFor="addr-address" required>
            <Input
              id="addr-address"
              type="text"
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="기본 주소"
            />
          </FormField>

          <FormField label="상세주소" htmlFor="addr-detail">
            <Input
              id="addr-detail"
              type="text"
              value={form.addressDetail}
              onChange={(e) => handleChange('addressDetail', e.target.value)}
              placeholder="상세 주소 (선택)"
            />
          </FormField>

          <FormField label="전화번호" htmlFor="addr-phone" required>
            <Input
              id="addr-phone"
              type="text"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="010-0000-0000"
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" size="md" onClick={handleClose}>
              취소
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleSave}
              loading={isSaving}
              className="bg-[#FF6B35] hover:bg-[#e55a25]"
            >
              저장
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
