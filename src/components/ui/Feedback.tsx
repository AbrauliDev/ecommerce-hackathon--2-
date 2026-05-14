import { ReactNode } from 'react';

export const Spinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const dimensions = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' }[size];
  return (
    <span
      className={`inline-block ${dimensions} animate-spin rounded-full border-2 border-sage-600 border-r-transparent`}
      role="status"
      aria-label="Cargando"
    />
  );
};

export const PageSpinner = () => (
  <div className="flex min-h-[40vh] items-center justify-center">
    <Spinner size="lg" />
  </div>
);

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export const Badge = ({ children, className = '' }: BadgeProps) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
    {children}
  </span>
);

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export const EmptyState = ({ title, description, action, icon }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-sage-100 bg-cream-100/40 py-16 text-center">
    {icon && <div className="mb-4 text-sage-500">{icon}</div>}
    <h3 className="font-display text-xl font-semibold text-bark-700">{title}</h3>
    {description && <p className="mt-1 text-sm text-bark-400">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);
