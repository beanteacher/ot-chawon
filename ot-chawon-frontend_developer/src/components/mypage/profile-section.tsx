'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form-field';

interface ProfileFormState {
  name: string;
  email: string;
  phone: string;
}

export function ProfileSection() {
  const user = useAuthStore((state) => state.user);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [form, setForm] = useState<ProfileFormState>({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleOpen = () => {
    setForm({
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: '',
    });
    setIsEditOpen(true);
  };

  const handleClose = () => {
    setIsEditOpen(false);
  };

  const handleChange = (field: keyof ProfileFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // 실제 API 연동 전 mock 저장
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSaving(false);
    setIsEditOpen(false);
  };

  const initials = user?.name
    ? user.name.slice(0, 2).toUpperCase()
    : 'U';

  const joinedDate = '2024-01-15'; // mock 가입일

  return (
    <section className="py-6">
      <h2 className="text-lg font-semibold text-oc-gray-900 mb-6">프로필</h2>

      {/* 프로필 카드 */}
      <div className="bg-white border border-oc-gray-300 rounded-xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* 아바타 */}
        <div className="w-20 h-20 rounded-full bg-[#FF6B35] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
          {initials}
        </div>

        {/* 정보 */}
        <div className="flex-1 text-center sm:text-left">
          <p className="text-xl font-semibold text-oc-gray-900">{user?.name ?? '이름 없음'}</p>
          <p className="text-sm text-oc-gray-500 mt-1">{user?.email ?? '이메일 없음'}</p>
          <p className="text-xs text-oc-gray-400 mt-2">가입일: {joinedDate}</p>
        </div>

        {/* 편집 버튼 */}
        <div className="flex-shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleOpen}
            className="border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35]/10"
          >
            프로필 편집
          </Button>
        </div>
      </div>

      {/* 프로필 편집 모달 */}
      <Modal
        open={isEditOpen}
        onClose={handleClose}
        title="프로필 편집"
        size="md"
      >
        <div className="flex flex-col gap-4">
          <FormField label="이름" htmlFor="edit-name">
            <Input
              id="edit-name"
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="이름을 입력하세요"
            />
          </FormField>

          <FormField label="이메일" htmlFor="edit-email">
            <Input
              id="edit-email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="이메일을 입력하세요"
            />
          </FormField>

          <FormField label="전화번호" htmlFor="edit-phone">
            <Input
              id="edit-phone"
              type="text"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="전화번호를 입력하세요"
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
