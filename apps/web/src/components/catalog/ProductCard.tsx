import React from 'react';
import Link from 'next/link';
import { ProductImage } from './ProductImage';
import { Badge } from '../ui/Badge';

interface Props {
  producto: any;
}

export function ProductCard({ producto }: Props) {
  const precio = producto.precio_mayor ?? producto.precio_retail ?? producto.precio_min ?? 0;

  return (
    <Link href={`/producto/${producto.slug}`} className="group flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-xl border border-azul/10 bg-blanco shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
        <ProductImage
          imagenes={producto.imagenes}
          nombre={producto.nombre}
          categoria={producto.categoria}
          className="w-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <Badge variant="category">{producto.subcategoria}</Badge>
          {producto.destacado && <Badge variant="new">Destacado</Badge>}
        </div>
      </div>
      <div className="flex flex-col px-1">
        <span className="text-[10px] font-mono text-marron-400 uppercase tracking-widest">{producto.id}</span>
        <h3 className="font-display text-base text-azul font-medium leading-tight line-clamp-2">{producto.nombre}</h3>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-[10px] text-marron-400">Desde</span>
          <span className="font-bold text-vino text-lg">C${precio.toLocaleString('es-NI')}</span>
        </div>
      </div>
    </Link>
  );
}
