import React from 'react';

export type CardVariant = 'elevated' | 'flat' | 'outlined';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: React.ReactNode;
}

export function Card({
  variant = 'elevated',
  children,
  className = '',
  ...props
}: CardProps) {
  const baseClasses = 'rounded-xl transition-all duration-200 overflow-hidden';

  const variantClasses: Record<CardVariant, string> = {
    elevated: 'bg-blanco shadow-md hover:shadow-lg border border-azul/5',
    flat: 'bg-beige-100 border border-beige-200',
    outlined: 'bg-blanco border border-azul/15',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
