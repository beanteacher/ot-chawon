'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { useToastStore } from '@/hooks/useToast';
import { ToastItem } from './toast';

/**
 * 앱 레벨 토스트 컨테이너.
 * createPortal을 사용해 document.body에 렌더링하므로
 * z-index 충돌 없이 항상 최상위에 표시됩니다.
 */
export function ToastProvider() {
  const toasts = useToastStore((s) => s.toasts);
  // SSR 환경에서 document가 없을 수 있으므로 마운트 후 포털 렌더링
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    /* aria-live="polite" — 스크린 리더가 새 토스트를 읽어줌 */
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-4 right-4 z-[9999] flex flex-col-reverse gap-2"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>,
    document.body
  );
}
