'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container } from '../../components/ui/Container';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { ProductCard } from '../../components/catalog/ProductCard';
import { Button } from '../../components/ui/Button';
import { productos, getCategorias, searchProductos, normalizeText } from '@el-cacique/shared';

function CatalogoContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('categoria') || 'todos';

  const categorias = useMemo(() => getCategorias(), []);

  // Estados de filtros
  const [selectedCategoria, setSelectedCategoria] = useState<string>(initialCategory);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [suggestions, setSuggestions] = useState<typeof productos>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sortBy, setSortBy] = useState<'relevancia' | 'precio-asc' | 'precio-desc' | 'nombre'>('relevancia');
  const [onlyBordado, setOnlyBordado] = useState(false);
  const [onlyDestacados, setOnlyDestacados] = useState(false);

  // Rango de precio dinámico basado en catálogo
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(7000);

  // Paginación: 12 productos por página
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  // Sincronizar parámetro de URL si cambia
  const [prevCategoryParam, setPrevCategoryParam] = useState(initialCategory);
  if (initialCategory !== prevCategoryParam) {
    setPrevCategoryParam(initialCategory);
    setSelectedCategoria(initialCategory);
    setPage(1);
  }

  // Debounce de 300ms para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Filtrado y ordenamiento en cliente
  const filteredProductos = useMemo(() => {
    let result = [...productos];

    // 1. Filtro por categoría
    if (selectedCategoria !== 'todos') {
      result = result.filter(
        (p) => p.categoria.toLowerCase() === selectedCategoria.toLowerCase()
      );
    }

    // 2. Filtro por texto debounced (con normalización de tildes)
    if (debouncedQuery.trim()) {
      const q = normalizeText(debouncedQuery.trim());
      const words = q.split(/\s+/).filter(Boolean);

      result = result.filter((p) => {
        const textPool = normalizeText(
          [
            p.nombre,
            p.id,
            p.subcategoria,
            p.descripcion,
            ...p.sinonimos,
            ...p.tags,
            ...p.telas,
          ].join(' ')
        );

        return words.every((word) => textPool.includes(word));
      });
    }

    // 3. Filtro por rango de precio
    result = result.filter((p) => {
      const price = p.precio_mayor ?? p.precio_min ?? p.precio_retail ?? 0;
      return price >= minPrice && price <= maxPrice;
    });

    // 4. Filtro solo con bordado
    if (onlyBordado) {
      result = result.filter(
        (p) => p.personalizacion && p.personalizacion.length > 0
      );
    }

    // 5. Filtro solo destacados
    if (onlyDestacados) {
      result = result.filter((p) => p.destacado);
    }

    // 6. Ordenamiento
    if (sortBy === 'precio-asc') {
      result.sort((a, b) => {
        const priceA = a.precio_mayor ?? a.precio_min ?? a.precio_retail ?? 0;
        const priceB = b.precio_mayor ?? b.precio_min ?? b.precio_retail ?? 0;
        return priceA - priceB;
      });
    } else if (sortBy === 'precio-desc') {
      result.sort((a, b) => {
        const priceA = a.precio_mayor ?? a.precio_max ?? a.precio_retail ?? 0;
        const priceB = b.precio_mayor ?? b.precio_max ?? b.precio_retail ?? 0;
        return priceB - priceA;
      });
    } else if (sortBy === 'nombre') {
      result.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else {
      // Relevancia: destacados primero, luego orden por ID
      result.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));
    }

    return result;
  }, [
    selectedCategoria,
    debouncedQuery,
    minPrice,
    maxPrice,
    onlyBordado,
    onlyDestacados,
    sortBy,
  ]);

  const paginatedProductos = filteredProductos.slice(0, page * itemsPerPage);

  const resetFilters = () => {
    setSelectedCategoria('todos');
    setSearchInput('');
    setSuggestions([]);
    setShowSuggestions(false);
    setDebouncedQuery('');
    setMinPrice(0);
    setMaxPrice(7000);
    setOnlyBordado(false);
    setOnlyDestacados(false);
    setSortBy('relevancia');
    setPage(1);
  };

  return (
    <div className="py-12 md:py-16 bg-beige min-h-screen text-left">
      <Container>
        {/* Encabezado */}
        <div className="mb-8 pb-6 border-b border-azul/10">
          <SectionTitle
            align="left"
            badge="Catálogo Maestro"
            title="Catálogo General de Prendas y Dotaciones"
            subtitle="Explore nuestras 8 categorías de confección con precios retail y mayoreo a partir de 12 unidades. Garantía formal de 3 a 6 meses."
          />
        </div>

        {/* Barra superior de Búsqueda y Ordenamiento */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8 bg-blanco p-4 rounded-xl border border-azul/10 shadow-xs">
          {/* Input de Búsqueda con buscador predictivo */}
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Buscar por prenda, código, tela (ej: scrub, Oxford, reflectivo)..."
              value={searchInput}
              onChange={(e) => {
                const val = e.target.value;
                setSearchInput(val);
                if (val.trim().length > 1) {
                  const results = searchProductos(val);
                  setSuggestions(results.slice(0, 5));
                  setShowSuggestions(true);
                } else {
                  setSuggestions([]);
                  setShowSuggestions(false);
                }
              }}
              onFocus={() => {
                if (searchInput.trim().length > 1 && suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={() => {
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-beige-100 border border-beige-200 text-marron placeholder:text-marron-400 focus:outline-none focus:border-azul"
            />
            <svg
              className="w-4 h-4 absolute left-3.5 top-3.5 text-marron-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  setSuggestions([]);
                  setShowSuggestions(false);
                }}
                className="absolute right-3 top-3 text-xs text-marron-400 hover:text-azul"
              >
                Limpiar
              </button>
            )}

            {/* Dropdown predictivo condicional */}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-50 w-full mt-1 bg-white border border-beige-200 rounded-lg shadow-xl overflow-hidden top-full">
                {suggestions.map((prod) => (
                  <li key={prod.id} className="border-b border-beige-100 last:border-0">
                    <button
                      type="button"
                      onClick={() => {
                        window.location.href = `/producto/${prod.slug}`;
                      }}
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

          {/* Selector de Orden */}
          <div className="flex items-center gap-3 justify-between lg:justify-end text-xs font-body text-marron">
            <span className="font-medium whitespace-nowrap">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'relevancia' | 'precio-asc' | 'precio-desc' | 'nombre')
              }
              className="bg-beige-100 border border-beige-200 rounded-lg px-3 py-2 text-xs text-azul font-semibold focus:outline-none focus:border-azul cursor-pointer"
            >
              <option value="relevancia">Relevancia (Destacados)</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="nombre">Nombre (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Layout: Sidebar de Filtros + Grid de Productos */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Sidebar */}
          <aside className="lg:col-span-1 bg-blanco p-6 rounded-2xl border border-azul/10 shadow-xs flex flex-col gap-6">
            {/* Filtro por Categorías */}
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-beige-200">
                <h3 className="font-display text-base text-azul">Categorías</h3>
                {selectedCategoria !== 'todos' && (
                  <button
                    type="button"
                    onClick={() => { setSelectedCategoria('todos'); setPage(1); }}
                    className="text-[11px] text-vino hover:underline"
                  >
                    Ver todas
                  </button>
                )}
              </div>
              <ul className="flex flex-col gap-1 text-sm font-body">
                <li>
                  <button
                    type="button"
                    onClick={() => { setSelectedCategoria('todos'); setPage(1); }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between text-xs font-medium cursor-pointer ${
                      selectedCategoria === 'todos'
                        ? 'bg-azul text-blanco font-semibold'
                        : 'text-marron hover:bg-beige-100'
                    }`}
                  >
                    <span>Todos los productos</span>
                    <span className="opacity-75">{productos.length}</span>
                  </button>
                </li>
                {categorias.map((cat) => (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => { setSelectedCategoria(cat.id); setPage(1); }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between text-xs font-medium cursor-pointer ${
                        selectedCategoria === cat.id
                          ? 'bg-azul text-blanco font-semibold'
                          : 'text-marron hover:bg-beige-100'
                      }`}
                    >
                      <span className="truncate pr-2">{cat.nombre}</span>
                      <span className="opacity-75 shrink-0">{cat.count}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Filtro de Rango de Precio */}
            <div className="border-t border-beige-200 pt-5">
              <h3 className="font-display text-base text-azul mb-3">
                Rango de Precio (C$)
              </h3>
              <div className="flex items-center gap-2 mb-3 text-xs font-mono">
                <input
                  type="number"
                  min="0"
                  max="7000"
                  value={minPrice}
                  onChange={(e) => { setMinPrice(Math.max(0, parseInt(e.target.value) || 0)); setPage(1); }}
                  className="w-20 px-2 py-1.5 rounded bg-beige-100 border border-beige-200 text-marron text-center"
                />
                <span className="text-marron-400">a</span>
                <input
                  type="number"
                  min="0"
                  max="7000"
                  value={maxPrice}
                  onChange={(e) => { setMaxPrice(Math.max(0, parseInt(e.target.value) || 7000)); setPage(1); }}
                  className="w-20 px-2 py-1.5 rounded bg-beige-100 border border-beige-200 text-marron text-center"
                />
              </div>
              <input
                type="range"
                min="0"
                max="7000"
                step="100"
                value={maxPrice}
                onChange={(e) => { setMaxPrice(parseInt(e.target.value)); setPage(1); }}
                className="w-full accent-vino cursor-pointer"
              />
              <span className="text-[11px] text-marron-400 block mt-1">
                Hasta C${maxPrice.toLocaleString('es-NI')}
              </span>
            </div>

            {/* Checkboxes adicionales */}
            <div className="border-t border-beige-200 pt-5 flex flex-col gap-2.5 text-xs font-body text-marron">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyBordado}
                  onChange={(e) => { setOnlyBordado(e.target.checked); setPage(1); }}
                  className="rounded border-gris-300 text-vino focus:ring-vino"
                />
                <span>Solo con bordado disponible</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyDestacados}
                  onChange={(e) => { setOnlyDestacados(e.target.checked); setPage(1); }}
                  className="rounded border-gris-300 text-vino focus:ring-vino"
                />
                <span>Solo productos destacados</span>
              </label>
            </div>

            {/* Botón para Limpiar Filtros */}
            <Button variant="ghost" size="sm" onClick={resetFilters} className="w-full text-xs">
              Restablecer todos los filtros
            </Button>
          </aside>

          {/* Grid de Productos */}
          <main className="lg:col-span-3 flex flex-col gap-6">
            <div className="flex items-center justify-between text-xs text-marron-400 font-body">
              <span>
                Mostrando <strong className="text-azul">{paginatedProductos.length}</strong> de{' '}
                <strong className="text-azul">{filteredProductos.length}</strong> prendas encontradas
              </span>
              {filteredProductos.length < productos.length && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-vino hover:underline font-medium"
                >
                  Ver catálogo completo ({productos.length})
                </button>
              )}
            </div>

            {paginatedProductos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProductos.map((prod) => (
                  <ProductCard key={prod.id} producto={prod} />
                ))}
              </div>
            ) : (
              <div className="bg-blanco p-12 rounded-2xl border border-azul/10 text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-beige-200 text-marron-400 flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-display text-2xl text-azul">
                  No se encontraron productos con esos filtros
                </h4>
                <p className="text-xs text-marron-400 max-w-sm">
                  Intenta con otros criterios, ajusta el rango de precio o limpia el término de búsqueda.
                </p>
                <Button variant="primary" size="md" onClick={resetFilters}>
                  Ver todos los 80 productos
                </Button>
              </div>
            )}

            {/* Paginación: Cargar Más */}
            {paginatedProductos.length < filteredProductos.length && (
              <div className="text-center pt-8">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setPage((prev) => prev + 1)}
                  className="shadow-xs"
                >
                  Cargar más prendas ({filteredProductos.length - paginatedProductos.length} restantes)
                </Button>
              </div>
            )}
          </main>
        </div>
      </Container>
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-beige flex items-center justify-center py-24 text-marron-400 font-sans">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-vino border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium">Cargando catálogo maestro...</p>
          </div>
        </div>
      }
    >
      <CatalogoContent />
    </React.Suspense>
  );
}
