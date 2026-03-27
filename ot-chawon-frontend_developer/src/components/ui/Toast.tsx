'use client';

import { useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils/cn';
import { useToastStore, type Toast, type ToastType } from '@/hooks/useToast';

// ─── 아이콘 ───────────────────────────────────────────────────────────────────

const SuccessIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ErrorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const WarningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ─── 타입별 스타일 ─────────────────────────────────────────────────────────────

const typeConfig: Record<ToastType, { container: string; icon: string; iconComponent: () => JSX.Element }> = {
  success: {
    container: 'border-l-4 border-oc-success bg-white text-oc-gray-800',
    icon: 'text-oc-success',
    iconComponent: SuccessIcon,
  },
  error: {
    container: 'border-l-4 border-oc-error bg-white text-oc-gray-800',
    icon: 'text-oc-error',
    iconComponent: ErrorIcon,
  },
  warning: {
    container: 'border-l-4 border-oc-warning bg-white text-oc-gray-800',
    icon: 'text-oc-warning',
    iconComponent: WarningIcon,
  },
  info: {
    container: 'border-l-4 border-oc-info bg-white text-oc-gray-800',
    icon: 'text-oc-info',
    iconComponent: InfoIcon,
  },
};

// ─── 단일 토스트 아이템 ────────────────────────────────────────────────────────

interface ToastItemProps {
  toast: Toast;
}

function ToastItem({ toast }: ToastItemProps) {
  const remove = useToastStore((s) => s.remove);
  const { container, icon, iconComponent: Icon } = typeConfig[toast.type];

  const dismiss = useCallback(() => remove(toast.id), [remove, toast.id]);

  // 자동 dismiss 타이머
  useEffect(() => {
    const duration = toast.duration ?? 3000;
    if (duration <= 0) return;
    const timer = setTimeout(dismiss, duration);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, dismiss]);

  return (
    <div
      role="alert"
      className={cn(
        'flex w-full max-w-sm items-start gap-3 rounded-lg px-4 py-3 shadow-md animate-slide-up',
        container
      )}
    >
      {/* 타입 아이콘 */}
      <span className={cn('mt-0.5 shrink-0', icon)}>
        <Icon />
      </span>

      {/* 메시지 + 액션 */}
      <div className="flex flex-1 flex-col gap-1">
        <p className="text-sm font-medium leading-snug">{toast.message}</p>
        {toast.action && (
          <button
            type="button"
            onClick={() => {
              toast.action!.onClick();
              dismiss();
            }}
            className="self-start text-xs font-semibold underline underline-offset-2 hover:opacity-75 focus:outline-none"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {/* 닫기 버튼 */}
      <button
        type="button"
        onClick={dismiss}
        className="shrink-0 rounded p-0.5 text-oc-gray-400 hover:text-oc-gray-600 focus:outline-none focus:ring-2 focus:ring-oc-accent"
        aria-label="알림 닫기"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

// ─── 공개 export ───────────────────────────────────────────────────────────────

export { ToastItem };
export type { ToastItemProps };
