'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  cartCount?: number;
}

export function MobileMenu({ isOpen, onClose, cartCount = 0 }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex" aria-modal="true" role="dialog">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-negro/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative ml-auto w-full max-w-xs bg-beige-100 h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-beige-200 pb-4">
            <Link href="/" onClick={onClose} className="flex flex-col">
              <span className="font-display text-2xl text-azul tracking-tight">El Cacique</span>
              <span className="font-body text-[10px] uppercase tracking-wider text-marron-400">
                Fábrica de Uniformes
              </span>
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-azul hover:bg-beige-200 transition-colors"
              aria-label="Cerrar menú"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-3 font-body font-medium text-base text-azul">
            <Link
              href="/"
              onClick={onClose}
              className="py-2 px-3 rounded-lg hover:bg-beige-200 transition-colors"
            >
              Inicio
            </Link>
            <Link
              href="/catalogo"
              onClick={onClose}
              className="py-2 px-3 rounded-lg hover:bg-beige-200 transition-colors"
            >
              Catálogo
            </Link>
            <Link
              href="/sastreria"
              onClick={onClose}
              className="py-2 px-3 rounded-lg hover:bg-beige-200 transition-colors"
            >
              Sastrería a Medida
            </Link>
            <Link
              href="/nosotros"
              onClick={onClose}
              className="py-2 px-3 rounded-lg hover:bg-beige-200 transition-colors"
            >
              Nosotros
            </Link>
            <Link
              href="/contacto"
              onClick={onClose}
              className="py-2 px-3 rounded-lg hover:bg-beige-200 transition-colors"
            >
              Contacto
            </Link>
            <Link
              href="/carrito"
              onClick={onClose}
              className="py-2 px-3 rounded-lg hover:bg-beige-200 transition-colors flex items-center justify-between"
            >
              <span>Carrito / Prefactura</span>
              {cartCount > 0 && (
                <span className="bg-vino text-blanco text-xs font-semibold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </nav>
        </div>

        <div className="flex flex-col gap-3 pt-6 border-t border-beige-200">
          <Button href="/cotizacion" variant="primary" size="md" className="w-full" onClick={onClose}>
            Solicitar cotización
          </Button>
          <div className="text-center text-xs text-marron-400 font-body">
            Managua, Nicaragua · L-V 8am–5pm
          </div>
        </div>
      </div>
    </div>
  );
}
