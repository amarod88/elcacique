'use client';

import React, { useState } from 'react';
import { getUrlsProducto, getImagenProducto } from '@el-cacique/shared';

interface Props {
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
}: Props) {
  const [error, setError] = useState(false);
  const urls = getUrlsProducto(productoId, transformacion);
  const entrada = getImagenProducto(productoId);

  // Fallback elegante si no hay imagen o si falla la carga (link roto)
  if (urls.length === 0 || error) {
    return (
      <div className={`relative aspect-[4/5] bg-beige-200 flex flex-col items-center justify-center border border-celeste/30 ${className}`}>
        <span className="font-display text-6xl text-azul/20">C</span>
        <span className="font-body text-xs text-azul/40 mt-2 px-4 text-center">{nombre}</span>
        <span className="font-body text-[10px] uppercase tracking-widest text-marron/40 mt-1">{categoria}</span>
      </div>
    );
  }

  return (
    <div className={`relative aspect-[4/5] overflow-hidden bg-white ${className}`}>
      {/* Usamos img estándar para saltar la restricción de dominios de Next.js con hotlinks temporales */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={urls[0]}
        alt={entrada?.alt ?? nombre}
        className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        onError={() => setError(true)}
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
}
