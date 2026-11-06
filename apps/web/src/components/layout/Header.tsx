'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { MobileMenu } from './MobileMenu';
import { useCartStore } from '../../lib/store/cart';
import { supabase } from '../../lib/supabase';

const emptySubscribe = () => () => {};
// Nuevo logo aislado
const LOGO_URL = 'https://tsytfsrqemtmqlrctgfz.supabase.co/storage/v1/object/public/public-assets/Logoelcacique1.png';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-azul/10 transition-colors shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          
          {/* Brand Zone: Logo + Texto */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative h-16 w-auto overflow-hidden flex items-center justify-center">
              <img 
                src={LOGO_URL} 
                alt="El Cacique" 
                className="h-full w-auto object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105"
              />
              {/* Efecto de brillo diagonal (sin rounded-full) */}
              <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-[-25deg] animate-shine" />
              </div>
            </div>
            <div className="flex flex-col hidden sm:flex">
              <span className="font-display text-xl text-azul tracking-tight leading-none">El Cacique</span>
              <span className="font-body text-[9px] uppercase tracking-wider text-marron-400 mt-1">Fábrica de Uniformes</span>
            </div>
          </Link>

          {/* Navegación Comercial */}
          <nav className="hidden lg:flex items-center gap-6 font-body text-sm font-medium text-azul">
            <Link href="/" className="hover:text-vino transition-colors whitespace-nowrap">Inicio</Link>
            <Link href="/catalogo?categoria=escolares" className="hover:text-vino transition-colors whitespace-nowrap">Uniformes escolares</Link>
            <Link href="/catalogo?categoria=corporativos" className="hover:text-vino transition-colors whitespace-nowrap">Empresariales</Link>
            
            {/* Dropdown Especializados */}
            <div className="relative group py-4">
              <span className="hover:text-vino transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1">
                Especializados
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </span>
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="bg-white rounded-xl shadow-xl border border-azul/10 py-2 w-56 text-azul">
                  <Link href="/catalogo?categoria=medicos" className="block px-4 py-2 hover:bg-beige-100 transition-colors">Médicos y Salud</Link>
                  <Link href="/catalogo?categoria=industriales" className="block px-4 py-2 hover:bg-beige-100 transition-colors">Industriales y Seguridad</Link>
                  <Link href="/catalogo?categoria=gastronomia" className="block px-4 py-2 hover:bg-beige-100 transition-colors">Gastronomía y Cocina</Link>
                  <Link href="/catalogo?categoria=deportivos" className="block px-4 py-2 hover:bg-beige-100 transition-colors">Deportivos y Sudaderas</Link>
                  <Link href="/catalogo?categoria=accesorios" className="block px-4 py-2 hover:bg-beige-100 transition-colors">Accesorios y Gorras</Link>
                  <div className="border-t border-beige-200 my-1"></div>
                  <Link href="/sastreria" className="block px-4 py-2 hover:bg-beige-100 transition-colors font-semibold text-vino">Confección a medida</Link>
                </div>
              </div>
            </div>

            <Link href="/nosotros" className="hover:text-vino transition-colors whitespace-nowrap">Nosotros</Link>
            <Link href="/contacto" className="hover:text-vino transition-colors whitespace-nowrap">Contacto</Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {mounted && (
              user ? (
                <div className="flex items-center gap-3">
                  <span className="hidden sm:block text-xs font-semibold text-azul max-w-[100px] truncate">{user.email?.split('@')[0]}</span>
                  <button onClick={handleLogout} className="px-3 py-2 rounded-lg bg-red-50 text-vino hover:bg-red-100 transition-colors text-xs font-bold flex items-center gap-1" title="Cerrar Sesión">
                    Salir <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  </button>
                </div>
              ) : (
                <Link href="/login" className="p-2.5 rounded-lg text-azul hover:bg-beige-200 transition-colors" title="Iniciar Sesión">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </Link>
              )
            )}

            <Link href="/carrito" className="relative p-2.5 rounded-lg text-azul hover:bg-beige-200 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-vino text-blanco text-[11px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-xs animate-scale-in">{cartCount}</span>}
            </Link>

            <div className="hidden sm:block">
              <Button href="/cotizacion" variant="primary" size="md">Solicitar cotización</Button>
            </div>

            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2.5 rounded-lg text-azul hover:bg-beige-200 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} cartCount={cartCount} user={user} onLogout={handleLogout} />
    </>
  );
}
