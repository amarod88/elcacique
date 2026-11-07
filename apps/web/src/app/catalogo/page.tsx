'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container } from '../../components/ui/Container';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { ProductCard } from '../../components/catalog/ProductCard';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

function CatalogoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('categoria') || 'todos';
  const initialQuery = searchParams.get('q') || '';

  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState<{id: string, nombre: string, count: number}[]>([]);
  
  const [selectedCategoria, setSelectedCategoria] = useState<string>(initialCategory);
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  // --- NUEVO: Sincronizar el estado con los cambios de URL (Header Links) ---
  useEffect(() => {
    setSelectedCategoria(initialCategory);
    if (!initialQuery) {
      setSearchInput('');
      setDebouncedQuery('');
    }
  }, [initialCategory, initialQuery]);
  const [sortBy, setSortBy] = useState<'relevancia' | 'precio-asc' | 'precio-desc' | 'nombre'>('relevancia');
  const [page, setPage] = useState(1);
  
  // Estados para las sugerencias (Autocompletado)
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const itemsPerPage = 12;

  // Cargar productos iniciales
  useEffect(() => {
    async function fetchProductos() {
      const { data } = await supabase.from('productos').select('*').order('id');
      if (data) {
        setProductos(data);
        const conteo: Record<string, number> = {};
        data.forEach(p => { conteo[p.categoria] = (conteo[p.categoria] || 0) + 1; });
        const nombresCat: Record<string, string> = {
          medicos: 'Médicos y Salud', corporativos: 'Corporativos y Oficina', sastreria: 'Sastrería a Medida', industriales: 'Industriales y Seguridad', gastronomia: 'Gastronomía y Cocina', escolares: 'Uniformes Escolares', deportivos: 'Deportivos y Sudaderas', accesorios: 'Accesorios y Gorras',
        };
        setCategorias(Object.entries(conteo).map(([id, count]) => ({ id, nombre: nombresCat[id] || id, count })));
      }
      setLoading(false);
    }
    fetchProductos();
  }, []);

  // Autocompletado en tiempo real
  useEffect(() => {
    async function fetchSuggestions() {
      if (searchInput.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      const { data } = await supabase
        .from('productos')
        .select('id, nombre, slug, precio_retail, precio_min')
        .ilike('nombre', `%${searchInput}%`)
        .limit(5);
      if (data) setSuggestions(data);
    }

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Debounce para filtrado principal
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchInput);
      setPage(1);
      // IMPORTANTE: Si el usuario está buscando, reseteamos la categoría para que busque en todo el catálogo
      if (searchInput.trim().length > 0) {
        setSelectedCategoria('todos');
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const normalizeText = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const filteredProductos = useMemo(() => {
    let result = [...productos];
    
    // Filtrar por categoría (solo si no hay búsqueda activa)
    if (selectedCategoria !== 'todos' && debouncedQuery.trim() === '') {
      result = result.filter(p => p.categoria.toLowerCase().includes(selectedCategoria.toLowerCase()));
    }

    // Filtrar por búsqueda
    if (debouncedQuery.trim()) {
      const q = normalizeText(debouncedQuery.trim());
      const words = q.split(/\s+/).filter(Boolean);
      result = result.filter(p => {
        const textPool = normalizeText([p.nombre, p.id, p.subcategoria, p.descripcion, ...(p.sinonimos || []), ...(p.tags || []), ...(p.telas || [])].join(' '));
        return words.every(word => textPool.includes(word));
      });
    }

    // Ordenamiento
    if (sortBy === 'precio-asc') result.sort((a, b) => (a.precio_mayor ?? 0) - (b.precio_mayor ?? 0));
    else if (sortBy === 'precio-desc') result.sort((a, b) => (b.precio_mayor ?? 0) - (a.precio_mayor ?? 0));
    else if (sortBy === 'nombre') result.sort((a, b) => a.nombre.localeCompare(b.nombre));
    
    return result;
  }, [productos, selectedCategoria, debouncedQuery, sortBy]);

  const paginatedProductos = filteredProductos.slice(0, page * itemsPerPage);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-azul font-display text-2xl">Cargando catálogo...</div>;

  return (
    <div className="py-12 md:py-16 bg-beige min-h-screen text-left">
      <Container>
        <div className="mb-8 pb-6 border-b border-azul/10">
          <SectionTitle align="left" badge="Catálogo" title="Nuestras Prendas" subtitle="Encuentra lo que buscas por categoría o usando el buscador." />
        </div>

        {/* Barra de búsqueda con Autocompletado */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8 bg-blanco p-4 rounded-xl border border-azul/10 shadow-xs relative z-20">
          <div className="relative w-full max-w-lg">
            <input 
              type="text" 
              placeholder="Buscar prenda, SKU o tela (ej: columbia, scrub)..." 
              value={searchInput} 
              onChange={(e) => { setSearchInput(e.target.value); setShowSuggestions(true); }} 
              onFocus={() => { if (searchInput.trim().length >= 2) setShowSuggestions(true); }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-beige-100 border border-beige-200 focus:outline-none focus:border-azul" 
            />
            <svg className="w-4 h-4 absolute left-3.5 top-3.5 text-marron-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>

            {/* Dropdown de Sugerencias */}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-50 w-full mt-1 bg-white border border-beige-200 rounded-lg shadow-xl overflow-hidden top-full text-left">
                {suggestions.map((prod) => (
                  <li key={prod.id} className="border-b border-beige-100 last:border-0">
                    <button
                      type="button"
                      onClick={() => { setShowSuggestions(false); router.push(`/producto/${prod.slug}`); }}
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

          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileFiltersOpen(true)} className="lg:hidden px-4 py-2 bg-azul text-blanco rounded-lg text-sm font-semibold flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              Filtros
            </button>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="bg-beige-100 border border-beige-200 rounded-lg px-3 py-2 text-xs font-semibold outline-none">
              <option value="relevancia">Relevancia</option>
              <option value="precio-asc">Menor Precio</option>
              <option value="precio-desc">Mayor Precio</option>
              <option value="nombre">A-Z</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Filtros Escritorio / Móvil */}
          <aside className={`lg:col-span-1 bg-blanco p-6 rounded-2xl border border-azul/10 shadow-xs flex-col gap-6 ${isMobileFiltersOpen ? 'fixed inset-0 z-50 m-4 overflow-y-auto flex' : 'hidden lg:flex'}`}>
            <div className="flex justify-between items-center lg:hidden mb-4">
              <h3 className="font-display text-xl text-azul">Filtros</h3>
              <button onClick={() => setIsMobileFiltersOpen(false)} className="text-marron-400 text-2xl font-bold">&times;</button>
            </div>
            <div>
              <h3 className="font-display text-base text-azul mb-3 pb-2 border-b border-beige-200">Categorías</h3>
              <ul className="flex flex-col gap-1 text-sm font-body">
                <li>
                  <button onClick={() => { setSelectedCategoria('todos'); setPage(1); setIsMobileFiltersOpen(false); setSearchInput(''); }} className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between text-xs font-medium ${selectedCategoria === 'todos' && !debouncedQuery ? 'bg-azul text-blanco' : 'text-marron hover:bg-beige-100'}`}>
                    <span>Todos</span><span>{productos.length}</span>
                  </button>
                </li>
                {categorias.map((cat) => (
                  <li key={cat.id}>
                    <button onClick={() => { setSelectedCategoria(cat.id); setSearchInput(''); setPage(1); setIsMobileFiltersOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between text-xs font-medium ${selectedCategoria === cat.id && !debouncedQuery ? 'bg-azul text-blanco' : 'text-marron hover:bg-beige-100'}`}>
                      <span className="truncate pr-2">{cat.nombre}</span><span>{cat.count}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:hidden mt-6 pt-4 border-t border-beige-200">
               <Button variant="primary" className="w-full" onClick={() => setIsMobileFiltersOpen(false)}>Aplicar Filtros</Button>
            </div>
          </aside>

          {/* Grid de Productos */}
          <main className="lg:col-span-3 flex flex-col gap-6 w-full">
            <div className="flex items-center justify-between">
              <span className="text-xs text-marron-400 font-body">
                Mostrando <strong>{paginatedProductos.length}</strong> de <strong>{filteredProductos.length}</strong> prendas
              </span>
              {debouncedQuery && (
                <span className="text-xs bg-beige-200 text-marron px-2 py-1 rounded-md">
                  Búsqueda: "{debouncedQuery}" <button onClick={() => setSearchInput('')} className="ml-1 font-bold text-vino">&times;</button>
                </span>
              )}
            </div>
            
            {paginatedProductos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProductos.map((prod) => <ProductCard key={prod.id} producto={prod} />)}
              </div>
            ) : (
              <div className="bg-blanco p-12 rounded-2xl border border-azul/10 text-center">
                <h4 className="font-display text-2xl text-azul mb-2">No encontramos prendas</h4>
                <p className="text-marron-400 text-sm mb-4">Intenta con otra palabra o revisa la ortografía.</p>
                <Button variant="primary" onClick={() => { setSelectedCategoria('todos'); setSearchInput(''); }}>Ver todo el catálogo</Button>
              </div>
            )}
            
            {paginatedProductos.length < filteredProductos.length && (
              <div className="text-center pt-8">
                <Button variant="secondary" size="lg" onClick={() => setPage((prev) => prev + 1)}>Cargar más</Button>
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
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center text-azul">Cargando...</div>}>
      <CatalogoContent />
    </React.Suspense>
  );
}
