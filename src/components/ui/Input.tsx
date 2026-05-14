import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...rest }, ref) => {
    const inputId = id ?? `input-${Math.random().toString(36).slice(2, 9)}`;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-bark-600">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            'w-full rounded-lg border bg-cream-50 px-3 py-2.5 text-sm text-bark-700 placeholder:text-bark-400/60',
            'transition focus:outline-none focus:ring-2',
            error
              ? 'border-red-400 focus:ring-red-200'
              : 'border-sage-200 focus:border-sage-500 focus:ring-sage-200',
            className,
          ].join(' ')}
          {...rest}
        />
        {hint && !error && <p className="text-xs text-bark-400">{hint}</p>}
        {error && <p className="text-xs text-red-700">{error}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';
