import React from 'react';
import Link from 'next/link';
import { Container } from '../ui/Container';

const LOGO_URL = 'https://tsytfsrqemtmqlrctgfz.supabase.co/storage/v1/object/public/public-assets/Logoelcacique1.png';

export function Footer() {
  return (
    <footer className="bg-azul-700 text-celeste-100 border-t border-white/10 pt-16 pb-8">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
            <Link href="/">
              <img src={LOGO_URL} alt="El Cacique" className="h-20 w-auto object-contain drop-shadow-lg" />
            </Link>
            <p className="font-body text-sm leading-relaxed text-celeste-100/80 mt-2">
              Fábrica de uniformes médicos, industriales y corporativos. Confección a la medida con bordado computarizado en Nicaragua.
            </p>
          </div>
          <div className="col-span-1">
            <h4 className="font-display text-lg text-white mb-4">Tienda</h4>
            <ul className="flex flex-col gap-2 font-body text-sm">
              <li><Link href="/catalogo" className="hover:text-white transition-colors">Catálogo</Link></li>
              <li><Link href="/sastreria" className="hover:text-white transition-colors">Confección a Medida</Link></li>
              <li><Link href="/nosotros" className="hover:text-white transition-colors">Sobre Nosotros</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">Preguntas Frecuentes</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="font-display text-lg text-white mb-4">Atención al Cliente</h4>
            <ul className="flex flex-col gap-2 font-body text-sm">
              <li><Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link></li>
              <li><Link href="/carrito" className="hover:text-white transition-colors">Mi Carrito</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Mi Cuenta</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="font-display text-lg text-white mb-4">Legal</h4>
            <ul className="flex flex-col gap-2 font-body text-sm">
              <li><Link href="/politica-de-privacidad" className="hover:text-white transition-colors">Política de Privacidad</Link></li>
              <li><Link href="/terminos-y-condiciones" className="hover:text-white transition-colors">Términos y Condiciones</Link></li>
              <li><Link href="/eliminar-datos" className="hover:text-white transition-colors">Eliminación de Datos</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 font-body text-xs text-celeste-100/60">
          <p>© {new Date().getFullYear()} El Cacique S.A. Todos los derechos reservados.</p>
          <p>Managua, Nicaragua · L-V 8am–5pm</p>
        </div>
      </Container>
    </footer>
  );
}
