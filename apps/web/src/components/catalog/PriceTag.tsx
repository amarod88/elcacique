import React from 'react';
import { Producto } from '@el-cacique/shared';

export interface PriceTagProps {
  producto: Producto;
  cantidad?: number;
  showWholesaleNotice?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PriceTag({
  producto,
  cantidad = 1,
  showWholesaleNotice = true,
  size = 'md',
  className = '',
}: PriceTagProps) {
  const isRange = producto.precio_retail === null || producto.precio_mayor === null;

  const sizeClasses = {
    sm: {
      main: 'text-sm font-semibold',
      secondary: 'text-xs',
      sub: 'text-[10px]',
    },
    md: {
      main: 'text-lg font-bold',
      secondary: 'text-sm',
      sub: 'text-xs',
    },
    lg: {
      main: 'text-2xl font-bold',
      secondary: 'text-base',
      sub: 'text-xs',
    },
  }[size];

  // Caso: Producto con rango presupuestario (sastrería / alta gama)
  if (isRange) {
    const minStr = producto.precio_min ? `C$${producto.precio_min.toLocaleString('es-NI')}` : '';
    const maxStr = producto.precio_max ? `C$${producto.precio_max.toLocaleString('es-NI')}` : '';
    const rangeText = minStr && maxStr ? `${minStr} – ${maxStr}` : minStr ? `Desde ${minStr}` : 'A cotizar';

    return (
      <div className={`flex flex-col gap-0.5 text-left font-body ${className}`.trim()}>
        <span className={`text-azul font-display ${sizeClasses.main}`}>
          {rangeText}
        </span>
        <span className={`text-marron-400 ${sizeClasses.sub}`}>
          Confección a medida / Cotización personalizada
        </span>
      </div>
    );
  }

  // Precios estándar definidos
  const isWholesale = cantidad >= 12;
  const currentPrice = isWholesale ? producto.precio_mayor! : producto.precio_retail!;
  const wholesalePrice = producto.precio_mayor!;

  return (
    <div className={`flex flex-col gap-0.5 text-left font-body ${className}`.trim()}>
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className={`text-azul font-bold tracking-tight ${sizeClasses.main}`}>
          C${currentPrice.toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        {!isWholesale && (
          <span className={`text-marron-400 font-medium ${sizeClasses.secondary}`}>
            (Retail)
          </span>
        )}
      </div>

      {showWholesaleNotice && (
        <div className={`text-vino font-medium flex items-center gap-1 ${sizeClasses.sub}`}>
          <span>Mayorista: C${wholesalePrice.toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span className="text-marron-400">(desde 12 unid.)</span>
        </div>
      )}
    </div>
  );
}
