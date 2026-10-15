import React from 'react';

export type BadgeVariant = 'category' | 'price' | 'new' | 'premium' | 'default';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export function Badge({
  variant = 'default',
  children,
  className = '',
  ...props
}: BadgeProps) {
  const baseClasses =
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-body font-medium tracking-wide whitespace-nowrap transition-colors';

  const variantClasses: Record<BadgeVariant, string> = {
    category: 'bg-celeste-100 text-azul border border-celeste/40',
    price: 'bg-vino text-blanco shadow-xs',
    new: 'bg-success/15 text-success border border-success/30',
    premium: 'bg-vino/10 text-vino border border-vino/50 font-semibold',
    default: 'bg-gris-100 text-gris-600 border border-gris-200',
  };

  return (
    <span
      className={`${baseClasses} ${variantClasses[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
}
