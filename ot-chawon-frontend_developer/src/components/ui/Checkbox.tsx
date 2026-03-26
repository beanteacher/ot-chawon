import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';

// --- Checkbox ---

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, indeterminate = false, className, id, ...props }, ref) => {
    const innerRef = useRef<HTMLInputElement>(null);
    const resolvedRef = (ref as React.RefObject<HTMLInputElement>) ?? innerRef;
    const checkboxId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    useEffect(() => {
      if (resolvedRef.current) {
        resolvedRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate, resolvedRef]);

    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          'inline-flex items-center gap-2 cursor-pointer',
          props.disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <input
          ref={resolvedRef}
          id={checkboxId}
          type="checkbox"
          className={cn(
            'h-4 w-4 rounded border-oc-gray-300 text-oc-accent',
            'focus:ring-2 focus:ring-oc-accent focus:ring-offset-1',
            'transition-colors',
            'accent-oc-accent'
          )}
          {...props}
        />
        {label && <span className="text-sm text-oc-gray-800">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// --- Radio ---

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, className, id, ...props }, ref) => {
    const radioId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <label
        htmlFor={radioId}
        className={cn(
          'inline-flex items-center gap-2 cursor-pointer',
          props.disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <input
          ref={ref}
          id={radioId}
          type="radio"
          className={cn(
            'h-4 w-4 border-oc-gray-300 text-oc-accent',
            'focus:ring-2 focus:ring-oc-accent focus:ring-offset-1',
            'transition-colors',
            'accent-oc-accent'
          )}
          {...props}
        />
        {label && <span className="text-sm text-oc-gray-800">{label}</span>}
      </label>
    );
  }
);

Radio.displayName = 'Radio';

// --- CheckboxGroup ---

interface CheckboxGroupProps {
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
  children: React.ReactNode;
}

const CheckboxGroupContext = React.createContext<{
  groupValue: string[];
  onChange: (value: string[]) => void;
} | null>(null);

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  value,
  onChange,
  className,
  children,
}) => {
  return (
    <CheckboxGroupContext.Provider value={{ groupValue: value, onChange }}>
      <div className={cn('flex flex-col gap-2', className)}>{children}</div>
    </CheckboxGroupContext.Provider>
  );
};

CheckboxGroup.displayName = 'CheckboxGroup';

// GroupCheckbox: CheckboxGroup 내에서 사용하는 Checkbox
interface GroupCheckboxProps extends Omit<CheckboxProps, 'checked' | 'onChange'> {
  value: string;
}

const GroupCheckbox: React.FC<GroupCheckboxProps> = ({ value, ...props }) => {
  const ctx = React.useContext(CheckboxGroupContext);
  if (!ctx) return <Checkbox {...props} />;

  const checked = ctx.groupValue.includes(value);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      ctx.onChange([...ctx.groupValue, value]);
    } else {
      ctx.onChange(ctx.groupValue.filter((v) => v !== value));
    }
  };

  return <Checkbox checked={checked} onChange={handleChange} {...props} />;
};

GroupCheckbox.displayName = 'GroupCheckbox';

// --- RadioGroup ---

interface RadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  name: string;
  className?: string;
  children: React.ReactNode;
}

const RadioGroupContext = React.createContext<{
  groupValue: string;
  onChange: (value: string) => void;
  name: string;
} | null>(null);

const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onChange,
  name,
  className,
  children,
}) => {
  return (
    <RadioGroupContext.Provider value={{ groupValue: value, onChange, name }}>
      <div className={cn('flex flex-col gap-2', className)} role="radiogroup">
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

RadioGroup.displayName = 'RadioGroup';

// GroupRadio: RadioGroup 내에서 사용하는 Radio
interface GroupRadioProps extends Omit<RadioProps, 'checked' | 'onChange' | 'name'> {
  value: string;
}

const GroupRadio: React.FC<GroupRadioProps> = ({ value, ...props }) => {
  const ctx = React.useContext(RadioGroupContext);
  if (!ctx) return <Radio {...props} />;

  const checked = ctx.groupValue === value;
  const handleChange = () => ctx.onChange(value);

  return (
    <Radio
      name={ctx.name}
      checked={checked}
      onChange={handleChange}
      {...props}
    />
  );
};

GroupRadio.displayName = 'GroupRadio';

export { Checkbox, Radio, CheckboxGroup, GroupCheckbox, RadioGroup, GroupRadio };
export type {
  CheckboxProps,
  RadioProps,
  CheckboxGroupProps,
  GroupCheckboxProps,
  RadioGroupProps,
  GroupRadioProps,
};
