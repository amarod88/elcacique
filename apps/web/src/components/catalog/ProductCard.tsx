import React from 'react';
import Link from 'next/link';
import { Producto } from '@el-cacique/shared';
import { Badge } from '../ui/Badge';
import { ProductImage } from './ProductImage';

export interface ProductCardProps {
  producto: Producto;
  className?: string;
}

export function ProductCard({ producto, className = '' }: ProductCardProps) {
  // Badges automáticos según reglas de negocio
  const esDestacado = producto.destacado;
  const esPremium = (producto.precio_max && producto.precio_max >= 2000) || (producto.precio_retail && producto.precio_retail >= 2000);
  const esReflectivo = producto.tags.some((t) => t.toLowerCase().includes('reflectiv'));
  const tieneBordado = producto.personalizacion && producto.personalizacion.length > 0;

  // Formato del precio "Desde C$X"
  const formatMonto = (num: number) => {
    return num % 1 === 0 ? num.toLocaleString('es-NI') : num.toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  let precioDisplay = '';
  if (producto.precio_mayor !== null) {
    precioDisplay = `Desde C$${formatMonto(producto.precio_mayor)}`;
  } else if (producto.precio_min) {
    precioDisplay = `Desde C$${formatMonto(producto.precio_min)}`;
  } else {
    precioDisplay = 'Cotizar';
  }

  return (
    <Link
      href={`/producto/${producto.slug}`}
      className={`group flex flex-col bg-blanco rounded-xl border border-azul/10 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-left ${className}`.trim()}
    >
      {/* Contenedor de Imagen Aspect Ratio 4:5 con ProductImage */}
      <div className="relative aspect-4/5 w-full bg-beige-200 overflow-hidden border-b border-azul/5">
        <ProductImage
          productoId={producto.id}
          nombre={producto.nombre}
          categoria={producto.subcategoria || producto.categoria}
          transformacion="card"
        />

        {/* Badges automáticos en esquina superior izquierda */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {esDestacado && <Badge variant="price">Destacado</Badge>}
          {esPremium && <Badge variant="premium">Premium</Badge>}
          {esReflectivo && <Badge variant="category">Reflectivo</Badge>}
          {tieneBordado && !esReflectivo && <Badge variant="category">Bordado disponible</Badge>}
        </div>

        {/* Botón flotante al hacer hover */}
        <div className="absolute inset-x-4 bottom-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
          <span className="w-full py-2.5 px-4 rounded-lg bg-vino text-blanco font-body text-xs font-semibold shadow-md flex items-center justify-center gap-1.5">
            Ver detalle de prenda
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </div>
      </div>

      {/* Información del Producto */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-marron-400">
            {producto.id} · {producto.subcategoria}
          </span>
          <h3 className="font-display text-lg text-azul group-hover:text-vino transition-colors line-clamp-1">
            {producto.nombre}
          </h3>
          <p className="font-body text-xs text-marron-400 line-clamp-2 leading-relaxed">
            {producto.descripcion}
          </p>
        </div>

        <div className="pt-3 border-t border-beige-200 flex items-baseline justify-between gap-2">
          <div className="flex flex-col">
            <span className="font-display text-lg text-azul font-bold tracking-tight">
              {precioDisplay}
            </span>
            <span className="text-[10px] text-marron-400">
              {producto.precio_mayor !== null ? 'Precio por mayor (desde 12 unid.)' : 'Confección a medida'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
