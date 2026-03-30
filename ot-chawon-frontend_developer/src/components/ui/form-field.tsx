import React from 'react';
import { cn } from '@/lib/utils/cn';

interface FormFieldProps {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  required?: boolean;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}

const FormField = ({
  label,
  helperText,
  errorMessage,
  required = false,
  htmlFor,
  className,
  children,
}: FormFieldProps) => {
  const hasError = Boolean(errorMessage);

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium text-oc-gray-800"
        >
          {label}
          {required && (
            <span className="ml-1 text-oc-error" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      {children}
      {hasError && (
        <p className="text-xs text-oc-error" role="alert">
          {errorMessage}
        </p>
      )}
      {!hasError && helperText && (
        <p className="text-xs text-oc-gray-500">{helperText}</p>
      )}
    </div>
  );
};

FormField.displayName = 'FormField';

export { FormField };
export type { FormFieldProps };
