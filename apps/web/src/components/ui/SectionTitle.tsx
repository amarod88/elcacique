import React from 'react';
import { Badge } from './Badge';

export interface SectionTitleProps {
  title: string;
  subtitle?: string;
  badge?: string;
  align?: 'center' | 'left';
  inverted?: boolean;
  className?: string;
}

export function SectionTitle({
  title,
  subtitle,
  badge,
  align = 'center',
  inverted = false,
  className = '',
}: SectionTitleProps) {
  const alignClasses = align === 'center' ? 'text-center mx-auto items-center' : 'text-left items-start';

  return (
    <div className={`flex flex-col gap-3 max-w-3xl mb-12 md:mb-16 ${alignClasses} ${className}`.trim()}>
      {badge && (
        <Badge variant={inverted ? 'category' : 'premium'}>
          {badge}
        </Badge>
      )}
      <h2
        className={`font-display text-3xl sm:text-4xl md:text-5xl tracking-tight text-balance ${
          inverted ? 'text-blanco' : 'text-azul'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`font-body text-base sm:text-lg md:text-xl font-normal leading-relaxed text-balance ${
            inverted ? 'text-celeste-100/90' : 'text-marron-400'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
