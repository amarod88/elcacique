'use client';

import React, { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { MobileMenu } from './MobileMenu';
import { useCartStore } from '../../lib/store/cart';

const emptySubscribe = () => () => {};

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const totalItems = useCartStore((state) => state.totalItems());

  const cartCount = mounted ? totalItems : 0;

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-beige/95 backdrop-blur-md border-b border-azul/10 transition-colors">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          {/* Brand Zone */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded-lg bg-azul text-beige flex items-center justify-center font-display text-xl font-bold shadow-xs group-hover:bg-azul-700 transition-colors">
              C
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl text-azul tracking-tight leading-none">
                El Cacique
              </span>
              <span className="font-body text-[10px] uppercase tracking-wider text-marron-400 mt-1">
                Fábrica de Uniformes
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 font-body text-sm font-medium text-azul">
            <Link
              href="/"
              className="hover:text-vino transition-colors whitespace-nowrap"
            >
              Inicio
            </Link>
            <Link
              href="/catalogo"
              className="hover:text-vino transition-colors whitespace-nowrap"
            >
              Catálogo
            </Link>
            <Link
              href="/sastreria"
              className="hover:text-vino transition-colors whitespace-nowrap"
            >
              Sastrería
            </Link>
            <Link
              href="/nosotros"
              className="hover:text-vino transition-colors whitespace-nowrap"
            >
              Nosotros
            </Link>
            <Link
              href="/contacto"
              className="hover:text-vino transition-colors whitespace-nowrap"
            >
              Contacto
            </Link>
          </nav>

          {/* Action Zone: Cart + Primary CTA + Mobile Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Cart Icon Button */}
            <Link
              href="/carrito"
              className="relative p-2.5 rounded-lg text-azul hover:bg-beige-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azul"
              aria-label="Ver carrito de prefactura"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-vino text-blanco text-[11px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-xs animate-scale-in">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Desktop CTA */}
            <div className="hidden sm:block">
              <Button href="/cotizacion" variant="primary" size="md">
                Solicitar cotización
              </Button>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2.5 rounded-lg text-azul hover:bg-beige-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azul"
              aria-label="Abrir menú de navegación"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        cartCount={cartCount}
      />
    </>
  );
}
