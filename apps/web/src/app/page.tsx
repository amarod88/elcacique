'use client';

import React from 'react';
import Link from 'next/link';
import { HeroVideo } from '../components/hero/HeroVideo';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Button } from '../components/ui/Button';
import { CategoryCard } from '../components/catalog/CategoryCard';
import { ProductCard } from '../components/catalog/ProductCard';
import { SearchBar } from '../components/ui/SearchBar';
import { getCategorias, getProductosDestacados } from '@el-cacique/shared';

export default function Home() {
  const categorias = getCategorias();
  const productosDestacados = getProductosDestacados().slice(0, 4);

  return (
    <div className="flex flex-col w-full">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[75vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Video de fondo */}
        <HeroVideo />
        
        {/* Contenido superpuesto */}
        <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blanco/10 backdrop-blur-md border border-blanco/20 text-white font-body text-xs sm:text-sm font-semibold tracking-wide uppercase mb-6">
            Fábrica de Uniformes en Nicaragua
          </span>
          
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight mb-6 text-balance drop-shadow-xl">
            Vestimos a tu equipo con la calidad que se siente.
          </h1>
          
          <p className="font-body text-base sm:text-lg md:text-xl text-celeste-100 max-w-2xl mx-auto leading-relaxed mb-10 text-balance drop-shadow-md">
            Confección médica, industrial y corporativa con bordado computarizado y entrega local en 48–72 horas.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/catalogo" variant="primary" size="lg" className="w-full sm:w-auto !bg-vino hover:!bg-vino-600 shadow-2xl text-lg px-8">
              Explorar Catálogo
            </Button>
            <Button href="/cotizacion" variant="secondary" size="lg" className="w-full sm:w-auto !border-white !text-white hover:!bg-white hover:!text-azul backdrop-blur-xs text-lg px-8">
              Cotizar por Mayoreo
            </Button>
          </div>
        </div>
      </section>

      {/* 2. BUSCADOR FLOTANTE */}
      <div className="relative z-30 -mt-8 px-4 w-full">
        <div className="max-w-3xl mx-auto bg-blanco p-2 sm:p-3 rounded-2xl shadow-xl border border-azul/10">
          <SearchBar placeholder="Buscar uniformes, telas, SKU... (ej. Top Médico)" />
        </div>
      </div>

      {/* 3. BARRA DE CONFIANZA */}
      <section className="bg-blanco border-b border-azul/10 py-10 mt-12">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center gap-2 p-2">
              <div className="w-12 h-12 rounded-full bg-beige-100 text-azul flex items-center justify-center mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <h3 className="font-display text-sm sm:text-base text-azul font-semibold">Atención Personalizada</h3>
              <p className="text-xs text-marron-400 hidden sm:block">Te asesoramos en tu empresa</p>
            </div>
            <div className="flex flex-col items-center gap-2 p-2">
              <div className="w-12 h-12 rounded-full bg-beige-100 text-azul flex items-center justify-center mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </div>
              <h3 className="font-display text-sm sm:text-base text-azul font-semibold">Bordado Premium</h3>
              <p className="text-xs text-marron-400 hidden sm:block">Acabados de alta definición</p>
            </div>
            <div className="flex flex-col items-center gap-2 p-2">
              <div className="w-12 h-12 rounded-full bg-beige-100 text-azul flex items-center justify-center mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="font-display text-sm sm:text-base text-azul font-semibold">Garantía Fábrica</h3>
              <p className="text-xs text-marron-400 hidden sm:block">De 3 a 6 meses</p>
            </div>
            <div className="flex flex-col items-center gap-2 p-2">
              <div className="w-12 h-12 rounded-full bg-beige-100 text-azul flex items-center justify-center mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="font-display text-sm sm:text-base text-azul font-semibold">Entrega Rápida</h3>
              <p className="text-xs text-marron-400 hidden sm:block">48–72 horas en Managua</p>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. CATEGORÍAS */}
      <Section variant="beige" id="categorias">
        <Container>
          <SectionTitle
            badge="Explora por rubro"
            title="¿Qué tipo de uniforme necesitas?"
            subtitle="Encuentra fácilmente la ropa de trabajo para tu equipo."
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {categorias.map((cat) => (
              <CategoryCard key={cat.id} categoria={cat} />
            ))}
          </div>
        </Container>
      </Section>

      {/* 5. PRODUCTOS DESTACADOS */}
      <Section variant="blanco" id="destacados">
        <Container>
          <div className="flex flex-col sm:flex-row justify-between items-end mb-8 gap-4">
            <SectionTitle
              align="left"
              badge="Los más pedidos"
              title="Favoritos de nuestros clientes"
              subtitle="Prendas que ya usan hospitales y oficinas."
              className="mb-0"
            />
            <Button href="/catalogo" variant="secondary" size="md" className="whitespace-nowrap hidden sm:flex">
              Ver todos
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productosDestacados.map((prod) => (
              <ProductCard key={prod.id} producto={prod} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Button href="/catalogo" variant="secondary" size="md" className="w-full">
              Ver todo el catálogo
            </Button>
          </div>
        </Container>
      </Section>

      {/* 6. CTA FINAL */}
      <Section variant="azul" id="contacto-cta">
        <Container>
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white leading-tight">
              ¿Listo para uniformar a tu equipo?
            </h2>
            <p className="font-body text-base sm:text-lg text-celeste-100/90 max-w-2xl leading-relaxed">
              Contáctanos por WhatsApp o solicita una cotización en línea. Te responderemos rápido para armar el pedido perfecto.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
              <Button href="/cotizacion" variant="primary" size="lg" className="!bg-vino hover:!bg-vino-600 w-full sm:w-auto">
                Solicitar cotización
              </Button>
              <a href="https://wa.me/50588888888" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center font-body font-medium text-base py-3 px-6 rounded-lg gap-2 text-white border border-celeste/50 hover:bg-celeste/10 transition-colors w-full sm:w-auto">
                <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.303c-.087.087-.179.182-.077.357.101.174.449.741.964 1.201.662.591 1.221.774 1.394.861.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z" /></svg>
                WhatsApp
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
