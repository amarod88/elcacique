'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { useCartStore } from '../../lib/store/cart';
import { supabase } from '../../lib/supabase';

const emptySubscribe = () => () => {};
const LOGO_URL = 'https://tsytfsrqemtmqlrctgfz.supabase.co/storage/v1/object/public/public-assets/Logoelcacique1.png';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const totalItems = useCartStore((state) => state.totalItems());
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  const cartCount = mounted ? totalItems : 0;
  const handleLogout = async () => { await supabase.auth.signOut(); window.location.reload(); };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Izquierda: Logo + Texto + Hamburguesa */}
        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-12 sm:h-14 w-auto overflow-hidden flex items-center justify-center">
              <img 
                src={LOGO_URL} 
                alt="El Cacique" 
                className="h-full w-auto object-contain drop-shadow-sm transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
            {/* Texto Restaurado */}
            <div className="flex flex-col hidden sm:flex">
              <span className="font-display text-xl sm:text-2xl text-azul tracking-tight leading-none">El Cacique</span>
              <span className="font-body text-[9px] sm:text-[10px] uppercase tracking-wider text-marron-400 mt-1">Fábrica de Uniformes</span>
            </div>
          </Link>
          
          {/* Botón Hamburguesa con separador visual */}
          <div className="relative flex items-center pl-3 sm:pl-4 border-l border-gray-200">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="p-1.5 text-azul hover:bg-beige-200 transition-colors rounded-lg flex items-center justify-center"
            >
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Dropdown del Menú */}
            {isMenuOpen && (
              <div className="absolute top-full left-0 mt-4 w-72 bg-white rounded-xl shadow-2xl border border-azul/10 py-3 z-50 max-h-[80vh] overflow-y-auto">
                <Link href="/" onClick={() => setIsMenuOpen(false)} className="block px-5 py-2 hover:bg-beige-100 text-azul font-medium">Inicio</Link>
                <div className="h-px bg-beige-200 my-2"></div>
                <span className="block px-5 py-1 text-xs uppercase tracking-wider text-marron-400 font-bold">Categorías</span>
                <Link href="/catalogo?categoria=escolares" onClick={() => setIsMenuOpen(false)} className="block px-5 py-2 hover:bg-beige-100 text-azul text-sm">Uniformes escolares</Link>
                <Link href="/catalogo?categoria=corporativos" onClick={() => setIsMenuOpen(false)} className="block px-5 py-2 hover:bg-beige-100 text-azul text-sm">Corporativos</Link>
                <Link href="/catalogo?categoria=medicos" onClick={() => setIsMenuOpen(false)} className="block px-5 py-2 hover:bg-beige-100 text-azul text-sm">Médicos y Salud</Link>
                <Link href="/catalogo?categoria=industriales" onClick={() => setIsMenuOpen(false)} className="block px-5 py-2 hover:bg-beige-100 text-azul text-sm">Industriales</Link>
                <Link href="/catalogo?categoria=gastronomia" onClick={() => setIsMenuOpen(false)} className="block px-5 py-2 hover:bg-beige-100 text-azul text-sm">Gastronomía</Link>
                <Link href="/catalogo?categoria=deportivos" onClick={() => setIsMenuOpen(false)} className="block px-5 py-2 hover:bg-beige-100 text-azul text-sm">Deportivos</Link>
                <Link href="/catalogo?categoria=accesorios" onClick={() => setIsMenuOpen(false)} className="block px-5 py-2 hover:bg-beige-100 text-azul text-sm">Accesorios</Link>
                <Link href="/sastreria" onClick={() => setIsMenuOpen(false)} className="block px-5 py-2 hover:bg-beige-100 text-vino font-semibold text-sm">Confección a medida</Link>
                <div className="h-px bg-beige-200 my-2"></div>
                <Link href="/nosotros" onClick={() => setIsMenuOpen(false)} className="block px-5 py-2 hover:bg-beige-100 text-azul font-medium">Nosotros</Link>
                <Link href="/contacto" onClick={() => setIsMenuOpen(false)} className="block px-5 py-2 hover:bg-beige-100 text-azul font-medium">Contacto</Link>
                <Link href="/faq" onClick={() => setIsMenuOpen(false)} className="block px-5 py-2 hover:bg-beige-100 text-azul font-medium">Preguntas Frecuentes</Link>
              </div>
            )}
          </div>
        </div>

        {/* Centro: 3 Categorías Siempre Visibles */}
        <nav className="flex items-center gap-4 sm:gap-8 font-body text-xs sm:text-sm font-semibold text-azul whitespace-nowrap overflow-x-auto">
          <Link href="/catalogo?categoria=escolares" className="hover:text-vino transition-colors">Uniformes escolares</Link>
          <Link href="/catalogo?categoria=corporativos" className="hover:text-vino transition-colors">Empresariales</Link>
          <Link href="/sastreria" className="hover:text-vino transition-colors">Especializados</Link>
        </nav>

        {/* Derecha: Iconos y CTA */}
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          {mounted && (
            user ? (
              <button onClick={handleLogout} className="hidden sm:flex px-2 py-2 text-vino text-xs font-bold items-center gap-1 hover:bg-red-50 rounded-lg transition-colors">
                Salir <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            ) : (
              <Link href="/login" className="p-2 text-azul hover:bg-beige-200 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </Link>
            )
          )}
          <Link href="/carrito" className="relative p-2 text-azul hover:bg-beige-200 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            {cartCount > 0 && <span className="absolute top-0 right-0 bg-vino text-blanco text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">{cartCount}</span>}
          </Link>
          <div className="hidden lg:block">
            <Button href="/cotizacion" variant="primary" size="md">Solicitar cotización</Button>
          </div>
        </div>
      </div>
    </header>
  );
}
