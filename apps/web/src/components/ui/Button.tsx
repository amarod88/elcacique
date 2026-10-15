import React from 'react';
import Link from 'next/link';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  disabled = false,
  loading = false,
  children,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center font-body font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-azul whitespace-nowrap cursor-pointer select-none';

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'text-xs py-1.5 px-3 rounded-md gap-1.5 min-h-[32px]',
    md: 'text-sm py-2 px-4 rounded-lg gap-2 min-h-[40px]',
    lg: 'text-base py-3 px-6 rounded-lg gap-2.5 min-h-[48px]',
  };

  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      'bg-vino text-blanco hover:bg-vino-600 shadow-sm hover:shadow-md active:translate-y-px',
    secondary:
      'border border-azul text-azul bg-transparent hover:bg-azul hover:text-blanco shadow-sm hover:shadow-md active:translate-y-px',
    ghost:
      'text-azul hover:bg-azul/10 hover:text-azul-700 active:bg-azul/15',
    link:
      'text-vino hover:text-vino-600 hover:underline p-0 min-h-0 bg-transparent shadow-none',
  };

  const disabledClasses = disabled || loading ? 'opacity-50 pointer-events-none cursor-not-allowed shadow-none' : '';

  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${className}`.trim();

  const content = (
    <>
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </>
  );

  if (href && !disabled && !loading) {
    return (
      <Link href={href} className={combinedClasses} role="button">
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={combinedClasses}
      {...props}
    >
      {content}
    </button>
  );
}
