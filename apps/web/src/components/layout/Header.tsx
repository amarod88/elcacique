'use client';

import React, { useState, useEffect, useSyncExternalStore, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCartStore } from '../../lib/store/cart';
import { supabase } from '../../lib/supabase';

const emptySubscribe = () => () => {};
const LOGO_URL = 'https://tsytfsrqemtmqlrctgfz.supabase.co/storage/v1/object/public/public-assets/Logoelcacique1.png';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isMenuDocsOpen, setIsMenuDocsOpen] = useState(false);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const totalItems = useCartStore((state) => state.totalItems());
  const [user, setUser] = useState<any>(null);
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerMenuRef = useRef<HTMLDivElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Cierre automático de menús al cambiar de página
  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  // Cerrar menús al hacer clic fuera (User + Hamburger)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      const clickedHamburgerBtn = hamburgerMenuRef.current?.contains(event.target as Node);
      const clickedMenuPanel = menuPanelRef.current?.contains(event.target as Node);
      if (!clickedHamburgerBtn && !clickedMenuPanel) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cartCount = mounted ? totalItems : 0;
  const handleLogout = async () => { await supabase.auth.signOut(); window.location.reload(); };
  const isAdmin = user?.email === 'admin@elcacique.net' || user?.email === 'brutaldevs@gmail.com';

  // Prevenir scroll del body cuando el menú hamburguesa está abierto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 relative z-50 bg-white">
        
        {/* Izquierda: Logo + Texto + Hamburguesa */}
        <div className="flex items-center gap-3 sm:gap-5 shrink-0" ref={hamburgerMenuRef}>
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-12 sm:h-14 w-auto overflow-hidden flex items-center justify-center">
              <img src={LOGO_URL} alt="El Cacique" className="h-full w-auto object-contain drop-shadow-sm transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="flex flex-col hidden sm:flex">
              <span className="font-display text-xl sm:text-2xl text-azul tracking-tight leading-none">El Cacique</span>
              <span className="font-body text-[9px] sm:text-[10px] uppercase tracking-wider text-marron-400 mt-1">Fábrica de Uniformes</span>
            </div>
          </Link>
          
          <div className="relative flex items-center pl-3 sm:pl-4 border-l border-gray-200">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="p-1.5 text-azul hover:bg-beige-200 transition-colors rounded-lg flex items-center justify-center relative z-[60]"
            >
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> // Icono X
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /> // Icono Hamburguesa
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Centro: Home + Categorías Siempre Visibles */}
        <nav className="hidden md:flex items-center gap-3 lg:gap-6 font-body text-xs sm:text-sm font-semibold text-azul whitespace-nowrap">
          <Link href="/" className="hover:text-vino transition-colors flex items-center justify-center p-1" title="Inicio">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>
          
          <span className="w-px h-4 bg-gray-300 hidden sm:block"></span>
          
          <Link href="/catalogo?categoria=escolares" className="hover:text-vino transition-colors">Uniformes escolares</Link>
          <Link href="/catalogo?categoria=medicos" className="hover:text-vino transition-colors">Médicos</Link>
          <Link href="/catalogo?categoria=corporativos" className="hover:text-vino transition-colors">Empresariales</Link>
          <Link href="/sastreria" className="hover:text-vino transition-colors">Especializados</Link>
        </nav>

        {/* Derecha: Perfil, Carrito */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0 relative z-[60]">
          {/* Menú de Usuario */}
          <div className="relative" ref={userMenuRef}>
            {mounted && (
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
                className="flex items-center gap-2 p-2 text-azul hover:bg-beige-200 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                {user && <span className="hidden sm:block text-xs font-semibold max-w-[100px] truncate">{user.email?.split('@')[0]}</span>}
              </button>
            )}

            {isUserMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-azul/10 py-2 z-50">
                {user ? (
                  <>
                    <div className="px-4 py-3 border-b border-beige-200">
                      <p className="text-sm font-semibold text-azul truncate">{user.email}</p>
                      <p className="text-xs text-marron-400">Bienvenido a El Cacique</p>
                    </div>
                    <Link href="/cuenta/pedidos" className="flex items-center gap-3 px-4 py-2 hover:bg-beige-100 text-azul text-sm font-medium transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                      Mis Pedidos
                    </Link>
                    
                    {isAdmin && (
                      <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-2 hover:bg-red-100 text-vino font-bold text-sm bg-red-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Ir al Panel de Admin
                      </Link>
                    )}

                    <button onClick={() => setIsDocsOpen(!isDocsOpen)} className="flex items-center justify-between w-full text-left px-4 py-2 hover:bg-beige-100 text-azul text-sm font-medium transition-colors">
                      <span className="flex items-center gap-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Documentación
                      </span>
                      <svg className={`w-4 h-4 transition-transform ${isDocsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {isDocsOpen && (
                      <div className="bg-beige-50 pl-11 pr-4 py-1 flex flex-col gap-1 border-l-2 border-azul/20 ml-4">
                        <Link href="/politica-de-privacidad" className="text-xs text-marron hover:text-vino py-1">Política de Privacidad</Link>
                        <Link href="/terminos-y-condiciones" className="text-xs text-marron hover:text-vino py-1">Términos y Condiciones</Link>
                        <Link href="/eliminar-datos" className="text-xs text-marron hover:text-vino py-1">Eliminación de Datos</Link>
                      </div>
                    )}
                    
                    <div className="h-px bg-beige-200 my-1"></div>
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full text-left px-4 py-2 hover:bg-beige-100 text-vino font-semibold text-sm transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-3 border-b border-beige-200">
                      <p className="text-sm font-semibold text-azul">Bienvenido</p>
                      <p className="text-xs text-marron-400">Inicia sesión para comprar</p>
                    </div>
                    <Link href="/login" className="block px-4 py-2 hover:bg-beige-100 text-azul text-sm font-medium">Iniciar Sesión</Link>
                    <Link href="/login" className="block px-4 py-2 hover:bg-beige-100 text-azul text-sm font-medium">Crear una cuenta</Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Carrito */}
          <Link href="/carrito" className="relative p-2 text-azul hover:bg-beige-200 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            {cartCount > 0 && <span className="absolute top-0 right-0 bg-vino text-blanco text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">{cartCount}</span>}
          </Link>
        </div>
      </div>

      {/* MENÚ HAMBURGUESA FULL-WIDTH (Mega-Menú) */}
      {isMenuOpen && (
        <>
          {/* Backdrop oscuro */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Panel de navegación */}
          <div ref={menuPanelRef} className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-beige-200 z-40 max-h-[calc(100vh-80px)] overflow-y-auto">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-12">
              
              {/* Columna 1: Categorías */}
              <div className="flex-1">
                <span className="block text-xs uppercase tracking-wider text-marron-400 font-bold mb-4">Categorías</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                  <Link href="/catalogo?categoria=escolares" className="py-2 text-azul text-base hover:text-vino transition-colors">Uniformes escolares</Link>
                  <Link href="/catalogo?categoria=corporativos" className="py-2 text-azul text-base hover:text-vino transition-colors">Corporativos</Link>
                  <Link href="/catalogo?categoria=medicos" className="py-2 text-azul text-base hover:text-vino transition-colors">Médicos y Salud</Link>
                  <Link href="/catalogo?categoria=industriales" className="py-2 text-azul text-base hover:text-vino transition-colors">Industriales</Link>
                  <Link href="/catalogo?categoria=gastronomia" className="py-2 text-azul text-base hover:text-vino transition-colors">Gastronomía</Link>
                  <Link href="/catalogo?categoria=deportivos" className="py-2 text-azul text-base hover:text-vino transition-colors">Deportivos</Link>
                  <Link href="/catalogo?categoria=accesorios" className="py-2 text-azul text-base hover:text-vino transition-colors">Accesorios</Link>
                  <Link href="/sastreria" className="py-2 text-vino font-semibold text-base hover:text-vino/80 transition-colors">Confección a medida</Link>
                </div>
              </div>

              {/* Columna 2: Enlaces de Interés */}
              <div className="w-full md:w-64 shrink-0 flex flex-col border-t md:border-t-0 md:border-l border-beige-200 pt-6 md:pt-0 md:pl-8">
                <span className="block text-xs uppercase tracking-wider text-marron-400 font-bold mb-4">Explorar</span>
                <Link href="/" className="py-2 text-azul font-medium hover:text-vino transition-colors">Inicio</Link>
                <Link href="/nosotros" className="py-2 text-azul font-medium hover:text-vino transition-colors">Nosotros</Link>
                <Link href="/contacto" className="py-2 text-azul font-medium hover:text-vino transition-colors">Contacto</Link>
                <Link href="/faq" className="py-2 text-azul font-medium hover:text-vino transition-colors">Preguntas Frecuentes</Link>
                
                <button onClick={() => setIsMenuDocsOpen(!isMenuDocsOpen)} className="flex items-center justify-between w-full py-2 text-azul font-medium hover:text-vino transition-colors text-left mt-2">
                  <span>Documentación</span>
                  <svg className={`w-4 h-4 transition-transform ${isMenuDocsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {isMenuDocsOpen && (
                  <div className="flex flex-col gap-2 pl-4 py-2 border-l-2 border-azul/20 ml-2">
                    <Link href="/politica-de-privacidad" className="text-sm text-marron hover:text-vino transition-colors">Política de Privacidad</Link>
                    <Link href="/terminos-y-condiciones" className="text-sm text-marron hover:text-vino transition-colors">Términos y Condiciones</Link>
                    <Link href="/eliminar-datos" className="text-sm text-marron hover:text-vino transition-colors">Eliminación de Datos</Link>
                  </div>
                )}
              </div>

            </div>
          </div>
        </>
      )}
    </header>
  );
}
