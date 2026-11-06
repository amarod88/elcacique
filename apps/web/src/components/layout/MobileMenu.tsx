'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  cartCount?: number;
  user?: any;
  onLogout?: () => void;
}

const LOGO_URL = 'https://tsytfsrqemtmqlrctgfz.supabase.co/storage/v1/object/public/public-assets/Logoelcacique1.png';

export function MobileMenu({ isOpen, onClose, cartCount = 0, user, onLogout }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex" aria-modal="true" role="dialog">
      <div className="fixed inset-0 bg-negro/60 backdrop-blur-xs transition-opacity" onClick={onClose} aria-hidden="true" />
      <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-beige-200 pb-4">
            <Link href="/" onClick={onClose} className="flex items-center">
              <img src={LOGO_URL} alt="El Cacique" className="h-12 w-auto object-contain" />
            </Link>
            <button onClick={onClose} className="p-2 rounded-lg text-azul hover:bg-beige-200 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <nav className="flex flex-col gap-3 font-body font-medium text-base text-azul">
            <Link href="/" onClick={onClose} className="py-2 px-3 rounded-lg hover:bg-beige-200 transition-colors">Inicio</Link>
            <Link href="/catalogo" onClick={onClose} className="py-2 px-3 rounded-lg hover:bg-beige-200 transition-colors">Catálogo</Link>
            <Link href="/sastreria" onClick={onClose} className="py-2 px-3 rounded-lg hover:bg-beige-200 transition-colors">Confección a Medida</Link>
            <Link href="/nosotros" onClick={onClose} className="py-2 px-3 rounded-lg hover:bg-beige-200 transition-colors">Nosotros</Link>
            <Link href="/faq" onClick={onClose} className="py-2 px-3 rounded-lg hover:bg-beige-200 transition-colors">Preguntas Frecuentes</Link>
            <Link href="/contacto" onClick={onClose} className="py-2 px-3 rounded-lg hover:bg-beige-200 transition-colors">Contacto</Link>
            <Link href="/carrito" onClick={onClose} className="py-2 px-3 rounded-lg hover:bg-beige-200 transition-colors flex items-center justify-between">
              <span>Carrito / Prefactura</span>
              {cartCount > 0 && <span className="bg-vino text-blanco text-xs font-semibold px-2 py-0.5 rounded-full">{cartCount}</span>}
            </Link>
          </nav>

          <div className="border-t border-beige-200 pt-4">
            {user ? (
              <button onClick={() => { onLogout?.(); onClose(); }} className="w-full text-left py-2 px-3 rounded-lg text-vino font-semibold hover:bg-beige-200 transition-colors flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Cerrar Sesión ({user.email?.split('@')[0]})
              </button>
            ) : (
              <Link href="/login" onClick={onClose} className="w-full text-left py-2 px-3 rounded-lg text-azul font-semibold hover:bg-beige-200 transition-colors flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                Iniciar Sesión / Registrarse
              </Link>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 border-t border-beige-200">
          <Button href="/cotizacion" variant="primary" size="md" className="w-full" onClick={onClose}>Solicitar cotización</Button>
          <div className="text-center text-xs text-marron-400 font-body">Managua, Nicaragua · L-V 8am–5pm</div>
        </div>
      </div>
    </div>
  );
}
