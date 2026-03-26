'use client';

import React, { useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils/cn';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string | undefined;
  description?: string | undefined;
  size?: ModalSize | undefined;
  closeOnBackdrop?: boolean | undefined;
  closeOnEscape?: boolean | undefined;
  className?: string | undefined;
  children: React.ReactNode;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const Modal = ({
  open,
  onClose,
  title,
  description,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  className,
  children,
}: ModalProps) => {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose();
      }
    },
    [closeOnEscape, onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, handleEscape]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          'relative z-10 w-full rounded-xl bg-white shadow-xl animate-slide-up',
          sizeClasses[size],
          className
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 border-b border-oc-gray-200 px-6 py-4">
            <div className="flex flex-col gap-1">
              {title && (
                <h2
                  id="modal-title"
                  className="text-lg font-semibold text-oc-gray-800"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id="modal-description"
                  className="text-sm text-oc-gray-500"
                >
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-md p-1 text-oc-gray-500 hover:bg-oc-gray-100 hover:text-oc-gray-800 focus:outline-none focus:ring-2 focus:ring-oc-accent"
              aria-label="닫기"
            >
              <CloseIcon />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
};

Modal.displayName = 'Modal';

export { Modal };
export type { ModalProps, ModalSize };
