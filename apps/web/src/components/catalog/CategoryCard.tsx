import React from 'react';
import Link from 'next/link';
import { CategoriaInfo } from '@el-cacique/shared';

export interface CategoryCardProps {
  categoria: CategoriaInfo;
  className?: string;
}

export function CategoryCard({ categoria, className = '' }: CategoryCardProps) {
  // Íconos representativos por categoría
  const getIcon = (id: string) => {
    switch (id) {
      case 'medicos':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M12 4v16m8-8H4"
          />
        );
      case 'sastreria':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        );
      case 'industriales':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        );
      case 'gastronomia':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        );
      case 'escolares':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-5.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5"
          />
        );
      case 'deportivos':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        );
      case 'accesorios':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        );
      case 'corporativos':
      default:
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        );
    }
  };

  return (
    <Link
      href={`/catalogo?categoria=${categoria.id}`}
      className={`group flex flex-col items-center justify-center p-6 rounded-xl bg-blanco border border-azul/10 text-center transition-all duration-300 hover:bg-azul hover:border-azul hover:-translate-y-1 shadow-xs hover:shadow-lg ${className}`.trim()}
    >
      <div className="w-14 h-14 rounded-full bg-beige-100 text-azul group-hover:bg-azul-700 group-hover:text-blanco transition-colors flex items-center justify-center mb-4 shadow-2xs">
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {getIcon(categoria.id)}
        </svg>
      </div>

      <h3 className="font-display text-lg text-azul group-hover:text-blanco transition-colors">
        {categoria.nombre}
      </h3>

      <span className="font-body text-xs text-marron-400 group-hover:text-celeste-100 transition-colors mt-1 font-medium">
        {categoria.count} {categoria.count === 1 ? 'producto' : 'modelos disponibles'}
      </span>
    </Link>
  );
}
