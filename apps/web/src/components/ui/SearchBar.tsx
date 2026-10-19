'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { searchProductos, type Producto } from '@el-cacique/shared';

export interface SearchBarProps {
  placeholder?: string;
  className?: string;
  defaultValue?: string;
}

export function SearchBar({
  placeholder = '¿Qué uniforme necesita hoy? Busque aquí...',
  className = '',
  defaultValue = '',
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<Producto[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length > 1) {
      const results = searchProductos(val);
      setSuggestions(results.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (slug: string) => {
    setShowSuggestions(false);
    router.push(`/producto/${slug}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/catalogo?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push('/catalogo');
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative w-full ${className}`}>
      <div className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => {
            if (query.trim().length > 1 && suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => {
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-16 py-3 rounded-xl text-sm bg-beige-100 border border-beige-200 text-marron placeholder:text-marron-400 focus:outline-none focus:border-azul focus:ring-1 focus:ring-azul transition-all shadow-xs"
        />

        {/* Icono de lupa */}
        <svg
          className="w-4 h-4 absolute left-3.5 top-4 text-marron-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* Botón limpiar */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-3.5 text-xs text-marron-400 hover:text-azul transition-colors font-medium px-1"
          >
            Limpiar
          </button>
        )}

        {/* Dropdown predictivo de sugerencias */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-50 w-full mt-1 bg-white border border-beige-200 rounded-lg shadow-xl overflow-hidden top-full text-left">
            {suggestions.map((prod) => (
              <li key={prod.id} className="border-b border-beige-100 last:border-0">
                <button
                  type="button"
                  onClick={() => handleSelectSuggestion(prod.slug)}
                  className="w-full text-left px-4 py-3 hover:bg-beige-50 transition-colors flex flex-col cursor-pointer"
                >
                  <span className="font-semibold text-azul text-sm">{prod.nombre}</span>
                  <span className="text-xs text-marron">
                    Desde C${prod.precio_retail || prod.precio_min || 0}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </form>
  );
}

export default SearchBar;
