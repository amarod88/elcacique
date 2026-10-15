import React from 'react';
import Link from 'next/link';

export function Footer() {
  const categorias = [
    { label: 'Uniformes Médicos', href: '/catalogo?categoria=medicos' },
    { label: 'Corporativos y Oficina', href: '/catalogo?categoria=corporativos' },
    { label: 'Sastrería a Medida', href: '/sastreria' },
    { label: 'Industriales y Seguridad', href: '/catalogo?categoria=industriales' },
    { label: 'Gastronomía y Chef', href: '/catalogo?categoria=gastronomia' },
    { label: 'Uniformes Escolares', href: '/catalogo?categoria=escolares' },
    { label: 'Deportivos y Sudaderas', href: '/catalogo?categoria=deportivos' },
    { label: 'Gorras y Accesorios', href: '/catalogo?categoria=accesorios' },
  ];

  const enlaces = [
    { label: 'Sobre Nosotros', href: '/nosotros' },
    { label: 'Solicitar Cotización', href: '/cotizacion' },
    { label: 'Sastrería Ejecutiva', href: '/sastreria' },
    { label: 'Preguntas Frecuentes', href: '/#faq' },
    { label: 'Contacto y Ubicación', href: '/contacto' },
    { label: 'Sistema de Diseño (Guía)', href: '/design-system' },
  ];

  return (
    <footer className="bg-azul-700 text-beige-100 border-t border-azul pt-16 pb-12 font-body">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-16 border-b border-azul-500/30">
          {/* Columna 1: Identidad */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-vino text-blanco flex items-center justify-center font-display text-xl font-bold shadow-xs">
                C
              </div>
              <div className="flex flex-col">
                <span className="font-display text-2xl text-blanco tracking-tight">El Cacique</span>
                <span className="text-[10px] uppercase tracking-wider text-celeste-100/70">
                  Fábrica de Uniformes
                </span>
              </div>
            </div>
            <p className="text-sm text-celeste-100/80 leading-relaxed mt-2">
              Líderes en confección a la medida, bordado computarizado de alta definición y uniformes profesionales en Nicaragua. Calidad garantizada de 3 a 6 meses.
            </p>
            <div className="text-xs text-celeste-100/60 pt-2">
              Entrega local en 48–72 horas · Delivery gratis en casco urbano de Managua.
            </div>
          </div>

          {/* Columna 2: Categorías */}
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-lg text-blanco tracking-normal">
              Categorías de Catálogo
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-celeste-100/80">
              {categorias.map((cat) => (
                <li key={cat.label}>
                  <Link
                    href={cat.href}
                    className="hover:text-blanco hover:underline transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Enlaces de Interés */}
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-lg text-blanco tracking-normal">
              Empresa y Servicios
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-celeste-100/80">
              {enlaces.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-blanco hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4: Ubicación y Contacto */}
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-lg text-blanco tracking-normal">
              Taller y Sala de Ventas
            </h3>
            <div className="flex flex-col gap-3 text-sm text-celeste-100/80 leading-relaxed">
              <p>
                <strong className="text-blanco font-medium block">Dirección:</strong>
                Semáforos de Plaza El Sol, 4 cuadras al sur, a mano izquierda, Managua, Nicaragua.
              </p>
              <p>
                <strong className="text-blanco font-medium block">Horarios de atención:</strong>
                Lunes a viernes 8:00am – 5:00pm<br />
                Sábados 8:00am – 12:00pm
              </p>
              <p>
                <strong className="text-blanco font-medium block">WhatsApp comercial:</strong>
                <a
                  href="https://wa.me/50588888888"
                  target="_blank"
                  rel="noreferrer"
                  className="text-celeste hover:underline inline-flex items-center gap-1.5 font-medium"
                >
                  +505 8888-8888
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-celeste-100/60">
          <div>
            © {new Date().getFullYear()} El Cacique, Fábrica de Uniformes. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span className="text-celeste-100/40">Métodos de pago aceptados:</span>
            <span className="bg-azul-500/40 px-2 py-0.5 rounded text-blanco font-medium">PayPal</span>
            <span className="bg-azul-500/40 px-2 py-0.5 rounded text-blanco font-medium">Transferencia Bancaria</span>
            <span className="bg-azul-500/40 px-2 py-0.5 rounded text-blanco font-medium">Depósito Bancario</span>
            <span className="bg-azul-500/40 px-2 py-0.5 rounded text-blanco font-medium">Efectivo en Tienda</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
