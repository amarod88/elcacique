import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({
  label,
  error,
  helperText,
  id,
  disabled,
  options,
  placeholder,
  className = '',
  ...props
}: SelectProps) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label
          htmlFor={selectId}
          className={`text-sm font-body font-medium ${
            disabled ? 'text-gris-400' : 'text-azul'
          }`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          disabled={disabled}
          className={`w-full px-3.5 py-2.5 rounded-lg font-body text-sm bg-blanco border appearance-none pr-10 transition-all duration-200 outline-none
            ${
              error
                ? 'border-error text-error focus:ring-2 focus:ring-error/20'
                : 'border-gris-200 text-marron focus:border-azul focus:ring-2 focus:ring-azul/15'
            }
            ${disabled ? 'bg-gris-100 text-gris-400 cursor-not-allowed border-gris-200' : ''}
            ${className}
          `.trim()}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gris-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <span className="text-xs text-error font-body font-medium">{error}</span>}
      {!error && helperText && (
        <span className="text-xs text-marron-400 font-body">{helperText}</span>
      )}
    </div>
  );
}
