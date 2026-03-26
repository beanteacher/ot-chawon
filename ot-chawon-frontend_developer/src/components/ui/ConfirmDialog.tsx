'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Modal } from './Modal';
import { Button } from './Button';

type ConfirmDialogVariant = 'default' | 'danger';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string | undefined;
  confirmLabel?: string | undefined;
  cancelLabel?: string | undefined;
  variant?: ConfirmDialogVariant | undefined;
  loading?: boolean | undefined;
  className?: string | undefined;
}

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  variant = 'default',
  loading = false,
  className,
}: ConfirmDialogProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      closeOnBackdrop={!loading}
      closeOnEscape={!loading}
      className={className}
    >
      <div className={cn('flex justify-end gap-2')}>
        <Button
          variant="secondary"
          size="sm"
          onClick={onClose}
          disabled={loading}
        >
          {cancelLabel}
        </Button>
        <Button
          variant={variant === 'danger' ? 'danger' : 'primary'}
          size="sm"
          onClick={onConfirm}
          loading={loading}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
};

ConfirmDialog.displayName = 'ConfirmDialog';

export { ConfirmDialog };
export type { ConfirmDialogProps, ConfirmDialogVariant };
