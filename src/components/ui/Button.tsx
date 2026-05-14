import { ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'clay';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  // Verde salvia — acción principal
  primary: 'bg-sage-600 text-cream-50 hover:bg-sage-700 focus:ring-sage-400 shadow-sm',
  // Marrón oscuro — alternativa elegante
  secondary: 'bg-bark-600 text-cream-50 hover:bg-bark-700 focus:ring-bark-400',
  // Terracota — CTA destacado
  clay: 'bg-clay-500 text-cream-50 hover:bg-clay-600 focus:ring-clay-400 shadow-sm',
  // Borde — acción secundaria sobre crema
  outline: 'bg-transparent text-bark-600 border border-sage-300 hover:bg-sage-50 hover:border-sage-500 focus:ring-sage-300',
  // Fantasma — terciaria
  ghost: 'bg-transparent text-bark-600 hover:bg-sage-100 focus:ring-sage-200',
  // Peligro
  danger: 'bg-red-700 text-cream-50 hover:bg-red-800 focus:ring-red-400',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', size = 'md', loading, fullWidth, className = '', children, disabled, ...rest },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={[
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cream-50',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth ? 'w-full' : '',
          className,
        ].join(' ')}
        {...rest}
      >
        {loading && (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
        )}
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';
