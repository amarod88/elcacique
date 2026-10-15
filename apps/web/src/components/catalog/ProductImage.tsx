import React from 'react';
import Image from 'next/image';
import { getUrlsProducto, getImagenProducto } from '@el-cacique/shared';

export interface ProductImageProps {
  productoId: string;
  nombre: string;
  categoria: string;
  transformacion?: 'card' | 'detalle' | 'thumbnail';
  className?: string;
  priority?: boolean;
}

export function ProductImage({
  productoId,
  nombre,
  categoria,
  transformacion = 'card',
  className = '',
  priority = false,
}: ProductImageProps) {
  const urls = getUrlsProducto(productoId, transformacion);
  const entrada = getImagenProducto(productoId);

  // Fallback elegante si no hay imagen
  if (urls.length === 0) {
    return (
      <div
        className={`relative aspect-4/5 w-full bg-beige-200 flex flex-col items-center justify-center border border-celeste/30 select-none overflow-hidden ${className}`.trim()}
      >
        <span className="font-display text-6xl text-azul/20">C</span>
        <span className="font-body text-xs text-azul/40 mt-2 px-4 text-center line-clamp-1">
          {nombre}
        </span>
        <span className="font-body text-[10px] uppercase tracking-widest text-marron/40 mt-1">
          {categoria}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative aspect-4/5 w-full overflow-hidden ${className}`.trim()}>
      <Image
        src={urls[0]}
        alt={entrada?.alt ?? nombre}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover"
        priority={priority}
      />
    </div>
  );
}
