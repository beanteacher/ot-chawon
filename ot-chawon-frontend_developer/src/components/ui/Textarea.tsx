'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string | undefined;
  helperText?: string | undefined;
  errorMessage?: string | undefined;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both' | undefined;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      errorMessage,
      resize = 'vertical',
      disabled,
      className,
      id,
      maxLength,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    const hasError = Boolean(errorMessage);
    const isControlled = value !== undefined;

    const [internalLength, setInternalLength] = useState<number>(() => {
      if (defaultValue !== undefined) {
        return String(defaultValue).length;
      }
      return 0;
    });

    const currentLength = isControlled ? String(value).length : internalLength;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!isControlled) {
        setInternalLength(e.target.value.length);
      }
      onChange?.(e);
    };

    const resizeClass: Record<NonNullable<TextareaProps['resize']>, string> = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    };

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-oc-gray-800"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          className={cn(
            'w-full rounded-md border border-oc-gray-300 bg-white px-3 py-2 text-sm text-oc-gray-800',
            'placeholder:text-oc-gray-400',
            'transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-oc-accent focus:border-transparent',
            hasError && 'ring-2 ring-oc-error border-transparent',
            disabled && 'opacity-50 cursor-not-allowed bg-oc-gray-50',
            resizeClass[resize],
            className
          )}
          {...props}
        />
        <div className="flex items-start justify-between gap-2">
          <div>
            {hasError && (
              <p className="text-xs text-oc-error" role="alert">
                {errorMessage}
              </p>
            )}
            {!hasError && helperText && (
              <p className="text-xs text-oc-gray-500">{helperText}</p>
            )}
          </div>
          {maxLength !== undefined && (
            <p className="shrink-0 text-xs text-oc-gray-400">
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
export type { TextareaProps };
