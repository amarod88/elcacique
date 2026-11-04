'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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

  // Estados
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState<{id: string, nombre: string, count: number}[]>([]);
  
  const [selectedCategoria, setSelectedCategoria] = useState<string>(initialCategory);
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<'relevancia' | 'precio-asc' | 'precio-desc' | 'nombre'>('relevancia');
  const [onlyBordado, setOnlyBordado] = useState(false);
  const [onlyDestacados, setOnlyDestacados] = useState(false);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(7000);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  // Cargar productos de Supabase
  useEffect(() => {
    async function fetchProductos() {
      const { data, error } = await supabase.from('productos').select('*').order('id');
      if (data) {
        setProductos(data);
        
        // Generar categorías dinámicamente
        const conteo: Record<string, number> = {};
        data.forEach(p => { conteo[p.categoria] = (conteo[p.categoria] || 0) + 1; });
        
        const nombresCat: Record<string, string> = {
          medicos: 'Médicos y Salud', corporativos: 'Corporativos y Oficina',
          sastreria: 'Sastrería a Medida', industriales: 'Industriales y Seguridad',
          gastronomia: 'Gastronomía y Cocina', escolares: 'Uniformes Escolares',
          deportivos: 'Deportivos y Sudaderas', accesorios: 'Accesorios y Gorras',
        };
        
        setCategorias(Object.entries(conteo).map(([id, count]) => ({
          id, nombre: nombresCat[id] || id, count
        })));
      }
      setLoading(false);
    }
    fetchProductos();
  }, []);

  // Debounce búsqueda
  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedQuery(searchInput); setPage(1); }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Sincronizar parámetros URL
  useEffect(() => {
    if (initialCategory !== selectedCategoria) setSelectedCategoria(initialCategory);
    if (initialQuery !== searchInput) { setSearchInput(initialQuery); setDebouncedQuery(initialQuery); }
  }, [initialCategory, initialQuery]);

  const normalizeText = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const filteredProductos = useMemo(() => {
    let result = [...productos];

    if (selectedCategoria !== 'todos') result = result.filter(p => p.categoria.toLowerCase() === selectedCategoria.toLowerCase());

    if (debouncedQuery.trim()) {
      const q = normalizeText(debouncedQuery.trim());
      const words = q.split(/\s+/).filter(Boolean);
      result = result.filter(p => {
        const textPool = normalizeText([p.nombre, p.id, p.subcategoria, p.descripcion, ...(p.sinonimos || []), ...(p.tags || []), ...(p.telas || [])].join(' '));
        return words.every(word => textPool.includes(word));
      });
    }

    result = result.filter(p => {
      const price = p.precio_mayor ?? p.precio_min ?? p.precio_retail ?? 0;
      return price >= minPrice && price <= maxPrice;
    });

    if (onlyBordado) result = result.filter(p => p.personalizacion && p.personalizacion.length > 0);
    if (onlyDestacados) result = result.filter(p => p.destacado);

    if (sortBy === 'precio-asc') result.sort((a, b) => (a.precio_mayor ?? a.precio_min ?? a.precio_retail ?? 0) - (b.precio_mayor ?? b.precio_min ?? b.precio_retail ?? 0));
    else if (sortBy === 'precio-desc') result.sort((a, b) => (b.precio_mayor ?? b.precio_max ?? b.precio_retail ?? 0) - (a.precio_mayor ?? a.precio_max ?? a.precio_retail ?? 0));
    else if (sortBy === 'nombre') result.sort((a, b) => a.nombre.localeCompare(b.nombre));
    else result.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));

    return result;
  }, [productos, selectedCategoria, debouncedQuery, minPrice, maxPrice, onlyBordado, onlyDestacados, sortBy]);

  const paginatedProductos = filteredProductos.slice(0, page * itemsPerPage);

  const resetFilters = () => {
    setSelectedCategoria('todos'); setSearchInput(''); setDebouncedQuery('');
    setMinPrice(0); setMaxPrice(7000); setOnlyBordado(false); setOnlyDestacados(false);
    setSortBy('relevancia'); setPage(1);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-azul font-display text-2xl">Cargando catálogo desde Supabase...</div>;

  return (
    <div className="py-12 md:py-16 bg-beige min-h-screen text-left">
      <Container>
        <div className="mb-8 pb-6 border-b border-azul/10">
          <SectionTitle align="left" badge="Catálogo Maestro" title="Catálogo General de Prendas y Dotaciones" subtitle="Explore nuestras 8 categorías de confección con precios retail y mayoreo a partir de 12 unidades." />
        </div>

        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8 bg-blanco p-4 rounded-xl border border-azul/10 shadow-xs">
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Buscar por prenda, código, tela (ej: scrub, Oxford)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-beige-100 border border-beige-200 text-marron focus:outline-none focus:border-azul"
            />
            <svg className="w-4 h-4 absolute left-3.5 top-3.5 text-marron-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>

          <div className="flex items-center gap-3 text-xs font-body text-marron">
            <span className="font-medium whitespace-nowrap">Ordenar por:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="bg-beige-100 border border-beige-200 rounded-lg px-3 py-2 text-xs text-azul font-semibold outline-none">
              <option value="relevancia">Relevancia (Destacados)</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="nombre">Nombre (A-Z)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          <aside className="lg:col-span-1 bg-blanco p-6 rounded-2xl border border-azul/10 shadow-xs flex flex-col gap-6">
            <div>
              <h3 className="font-display text-base text-azul mb-3 pb-2 border-b border-beige-200">Categorías</h3>
              <ul className="flex flex-col gap-1 text-sm font-body">
                <li>
                  <button onClick={() => { setSelectedCategoria('todos'); setPage(1); }} className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between text-xs font-medium ${selectedCategoria === 'todos' ? 'bg-azul text-blanco' : 'text-marron hover:bg-beige-100'}`}>
                    <span>Todos los productos</span><span>{productos.length}</span>
                  </button>
                </li>
                {categorias.map((cat) => (
                  <li key={cat.id}>
                    <button onClick={() => { setSelectedCategoria(cat.id); setPage(1); }} className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between text-xs font-medium ${selectedCategoria === cat.id ? 'bg-azul text-blanco' : 'text-marron hover:bg-beige-100'}`}>
                      <span className="truncate pr-2">{cat.nombre}</span><span>{cat.count}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-beige-200 pt-5 flex flex-col gap-2.5 text-xs font-body text-marron">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={onlyBordado} onChange={(e) => { setOnlyBordado(e.target.checked); setPage(1); }} className="rounded text-vino" />
                <span>Solo con bordado disponible</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={onlyDestacados} onChange={(e) => { setOnlyDestacados(e.target.checked); setPage(1); }} className="rounded text-vino" />
                <span>Solo productos destacados</span>
              </label>
            </div>
            <Button variant="ghost" size="sm" onClick={resetFilters} className="w-full text-xs">Restablecer filtros</Button>
          </aside>

          <main className="lg:col-span-3 flex flex-col gap-6">
            <div className="flex items-center justify-between text-xs text-marron-400 font-body">
              <span>Mostrando <strong className="text-azul">{paginatedProductos.length}</strong> de <strong className="text-azul">{filteredProductos.length}</strong> prendas</span>
            </div>

            {paginatedProductos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProductos.map((prod) => (
                  <ProductCard key={prod.id} producto={prod} />
                ))}
              </div>
            ) : (
              <div className="bg-blanco p-12 rounded-2xl border border-azul/10 text-center">
                <h4 className="font-display text-2xl text-azul mb-2">No se encontraron productos</h4>
                <p className="text-xs text-marron-400 mb-4">Intenta con otros criterios de búsqueda.</p>
                <Button variant="primary" size="md" onClick={resetFilters}>Ver todo el catálogo</Button>
              </div>
            )}

            {paginatedProductos.length < filteredProductos.length && (
              <div className="text-center pt-8">
                <Button variant="secondary" size="lg" onClick={() => setPage((prev) => prev + 1)}>Cargar más prendas</Button>
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
