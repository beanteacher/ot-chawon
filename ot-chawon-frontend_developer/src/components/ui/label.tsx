import React from 'react';
import { cn } from '@/lib/utils/cn';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  children: React.ReactNode;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ required = false, className, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn('text-sm font-medium text-oc-gray-800', className)}
        {...props}
      >
        {children}
        {required && (
          <span className="ml-1 text-oc-error" aria-hidden="true">
            *
          </span>
        )}
      </label>
    );
  }
);

Label.displayName = 'Label';

export { Label };
export type { LabelProps };
