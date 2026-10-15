import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Textarea({
  label,
  error,
  helperText,
  id,
  disabled,
  rows = 4,
  className = '',
  ...props
}: TextareaProps) {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label
          htmlFor={textareaId}
          className={`text-sm font-body font-medium ${
            disabled ? 'text-gris-400' : 'text-azul'
          }`}
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        disabled={disabled}
        className={`w-full px-3.5 py-2.5 rounded-lg font-body text-sm bg-blanco border transition-all duration-200 outline-none resize-y
          ${
            error
              ? 'border-error text-error placeholder:text-error/50 focus:ring-2 focus:ring-error/20'
              : 'border-gris-200 text-marron placeholder:text-gris-400 focus:border-azul focus:ring-2 focus:ring-azul/15'
          }
          ${disabled ? 'bg-gris-100 text-gris-400 cursor-not-allowed border-gris-200' : ''}
          ${className}
        `.trim()}
        {...props}
      />
      {error && <span className="text-xs text-error font-body font-medium">{error}</span>}
      {!error && helperText && (
        <span className="text-xs text-marron-400 font-body">{helperText}</span>
      )}
    </div>
  );
}
