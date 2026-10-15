import React from 'react';

export type SectionVariant = 'beige' | 'blanco' | 'azul';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: SectionVariant;
  children: React.ReactNode;
}

export function Section({
  variant = 'beige',
  children,
  className = '',
  ...props
}: SectionProps) {
  const variantClasses: Record<SectionVariant, string> = {
    beige: 'bg-beige text-marron',
    blanco: 'bg-blanco text-marron',
    azul: 'bg-azul text-beige-100',
  };

  return (
    <section
      className={`py-16 md:py-24 transition-colors duration-200 ${variantClasses[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </section>
  );
}
