'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export interface SearchBarProps {
  placeholder?: string;
  className?: string;
  defaultValue?: string;
}

export function SearchBar({
  placeholder = '¿Qué uniforme necesita hoy?',
  className = '',
  defaultValue = '',
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    async function fetchSuggestions() {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      const { data } = await supabase
        .from('productos')
        .select('id, nombre, slug, precio_retail, precio_min')
        .ilike('nombre', `%${query}%`)
        .limit(5);
      if (data) setSuggestions(data);
    }

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectSuggestion = (slug: string) => {
    setShowSuggestions(false);
    setQuery('');
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

  return (
    <form onSubmit={handleSubmit} className={`relative w-full ${className}`}>
      <div className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
          onFocus={() => { if (query.trim().length >= 2) setShowSuggestions(true); }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-beige-100 border border-beige-200 text-marron placeholder:text-marron-400 focus:outline-none focus:border-azul focus:ring-1 focus:ring-azul transition-all shadow-sm"
        />
        <svg className="w-4 h-4 absolute left-3.5 top-4 text-marron-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

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
                  <span className="text-xs text-marron">Desde C${prod.precio_retail || prod.precio_min || 0}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </form>
  );
}
