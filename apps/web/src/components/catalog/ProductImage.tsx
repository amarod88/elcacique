'use client';

import React, { useState } from 'react';

interface Props {
  imagenes?: string[];
  nombre: string;
  categoria: string;
  className?: string;
  priority?: boolean;
}

export function ProductImage({
  imagenes = [],
  nombre,
  categoria,
  className = '',
  priority = false,
}: Props) {
  const [error, setError] = useState(false);

  // Si no hay imágenes o falla la carga, mostramos el placeholder elegante
  if (imagenes.length === 0 || error) {
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imagenes[0]}
        alt={nombre}
        className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        onError={() => setError(true)}
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
}
