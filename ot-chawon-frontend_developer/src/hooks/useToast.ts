'use client';

import { create } from 'zustand';

/** 토스트 타입 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/** 토스트 액션 버튼 */
export interface ToastAction {
  label: string;
  onClick: () => void;
}

/** 토스트 아이템 */
export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number; // ms, 기본 3000
  action?: ToastAction;
}

/** 토스트 생성 옵션 (id 제외) */
export type ToastOptions = Omit<Toast, 'id'>;

interface ToastStore {
  toasts: Toast[];
  add: (options: ToastOptions) => string;
  remove: (id: string) => void;
  clear: () => void;
}

/** 전역 토스트 Zustand 스토어 */
export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  add: (options) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const toast: Toast = { duration: 3000, ...options, id };

    set((state) => ({ toasts: [...state.toasts, toast] }));
    return id;
  },

  remove: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  clear: () => set({ toasts: [] }),
}));

/** 편의 훅 — 토스트를 쉽게 띄우는 헬퍼 함수 반환 */
export function useToast() {
  const { add, remove, clear, toasts } = useToastStore();

  const toast = (options: ToastOptions) => add(options);

  toast.success = (message: string, options?: Partial<Omit<ToastOptions, 'type' | 'message'>>) =>
    add({ type: 'success', message, ...options });

  toast.error = (message: string, options?: Partial<Omit<ToastOptions, 'type' | 'message'>>) =>
    add({ type: 'error', message, ...options });

  toast.warning = (message: string, options?: Partial<Omit<ToastOptions, 'type' | 'message'>>) =>
    add({ type: 'warning', message, ...options });

  toast.info = (message: string, options?: Partial<Omit<ToastOptions, 'type' | 'message'>>) =>
    add({ type: 'info', message, ...options });

  return { toast, remove, clear, toasts };
}
