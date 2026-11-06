'use client';

import React, { useState, useEffect } from 'react';
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
  
  // --- LÓGICA DEL CARRUSEL ---
  const [allFavoritos, setAllFavoritos] = useState<any[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const todos = getProductosDestacados();
    // Priorizar escolares y médicos
    const priorizados = todos.filter(p => {
      const cat = (p.categoria || '').toLowerCase();
      const nom = (p.nombre || '').toLowerCase();
      return cat.includes('escolar') || cat.includes('medic') || nom.includes('pantalon') || nom.includes('bata') || nom.includes('pijama');
    });
    const pool = priorizados.length >= 8 ? priorizados : todos;
    
    // Mezclar aleatoriamente la lista base
    const randomList = [...pool].sort(() => 0.5 - Math.random());
    setAllFavoritos(randomList);
  }, []);

  // Rotación automática cada 5 segundos
  useEffect(() => {
    if (allFavoritos.length <= 4) return;
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % (allFavoritos.length - 3));
    }, 5000);
    return () => clearInterval(interval);
  }, [allFavoritos]);

  const handlePrev = () => {
    setStartIndex((prev) => (prev === 0 ? allFavoritos.length - 4 : prev - 1));
  };
  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % (allFavoritos.length - 3));
  };

  const productosVisibles = allFavoritos.slice(startIndex, startIndex + 4);

  // Botones de promociones
  const promociones = [
    { titulo: 'Ofertas', color: 'bg-azul text-white', link: '/catalogo' },
    { titulo: 'Liquidación', color: 'bg-vino text-white', link: '/catalogo' },
    { titulo: 'Temporada Escolar', color: 'bg-beige-200 text-azul', link: '/catalogo?categoria=escolares' },
    { titulo: 'Médicos', color: 'bg-beige-200 text-azul', link: '/catalogo?categoria=medicos' },
    { titulo: 'Corporativos', color: 'bg-beige-200 text-azul', link: '/catalogo?categoria=corporativos' },
    { titulo: 'Gorras y Accesorios', color: 'bg-beige-200 text-azul', link: '/catalogo?categoria=accesorios' },
  ];

  return (
    <div className="flex flex-col w-full pb-20">
      
      {/* 1. LUPA PEGADA AL HEADER */}
      <div className="w-full bg-white border-b border-gray-100 py-3 px-4 shadow-sm z-30 relative">
        <div className="max-w-3xl mx-auto">
          <SearchBar placeholder="Buscar uniformes, telas, SKU..." />
        </div>
      </div>

      {/* 2. HERO VIDEO COMO BANNER CONTENIDO */}
      <div className="w-full pt-6 pb-8">
        <div className="max-w-[1200px] mx-auto px-4">
          <section className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
            <HeroVideo />
            <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 text-center">
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl !text-white leading-[1.1] tracking-tight mb-4 drop-shadow-xl max-w-4xl">
                Vestimos cada etapa de tu camino.
              </h1>
              <p className="font-body text-sm sm:text-lg !text-white/90 max-w-2xl mb-8 drop-shadow-md">
                Uniformes escolares, corporativos y especializados confeccionados para acompañar a quienes construyen el futuro.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button href="/catalogo" variant="primary" size="lg" className="!bg-vino hover:!bg-vino-600 shadow-xl text-base px-8">
                  Explorar catálogo
                </Button>
                <Button href="/nosotros" variant="secondary" size="lg" className="!border-white !text-white hover:!bg-white hover:!text-azul backdrop-blur-xs shadow-xl text-base px-8">
                  Conocer nuestros servicios
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* 3. CATEGORÍAS Y PROMOCIONES */}
      <Section variant="beige" id="categorias" className="pt-4 pb-12">
        <Container>
          <SectionTitle
            badge="Explora por rubro"
            title="¿Qué tipo de uniforme necesitas?"
            subtitle="Encuentra fácilmente la ropa de trabajo para tu equipo."
          />
          
          {/* Botones de Promociones (Movidos aquí) */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {promociones.map((promo, idx) => (
              <a 
                key={idx} 
                href={promo.link}
                className={`px-6 py-2 rounded-full text-sm font-semibold tracking-wide transition-transform hover:scale-105 shadow-sm ${promo.color}`}
              >
                {promo.titulo}
              </a>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {categorias.map((cat) => (
              <CategoryCard key={cat.id} categoria={cat} />
            ))}
          </div>
        </Container>
      </Section>

      {/* 4. FAVORITOS EN CARRUSEL ROTATIVO */}
      <Section variant="blanco" id="destacados">
        <Container>
          <div className="flex justify-between items-end mb-8">
            <SectionTitle
              align="left"
              badge="Los más pedidos"
              title="Favoritos de nuestros clientes"
              subtitle="Una selección rotativa de nuestras mejores prendas."
              className="mb-0"
            />
            {/* Controles del Carrusel */}
            <div className="hidden sm:flex gap-2">
              <button onClick={handlePrev} className="p-2 rounded-full border border-azul/20 text-azul hover:bg-azul hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={handleNext} className="p-2 rounded-full border border-azul/20 text-azul hover:bg-azul hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isMounted ? (
                productosVisibles.map((prod) => (
                  <ProductCard key={prod.id} producto={prod} />
                ))
              ) : (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-3 animate-pulse">
                    <div className="w-full aspect-[4/5] bg-beige-200 rounded-xl"></div>
                    <div className="h-4 bg-beige-200 rounded w-3/4"></div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Controles móviles */}
          <div className="flex justify-center gap-4 mt-8 sm:hidden">
            <button onClick={handlePrev} className="p-3 rounded-full border border-azul/20 text-azul"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></button>
            <button onClick={handleNext} className="p-3 rounded-full border border-azul/20 text-azul"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></button>
          </div>
        </Container>
      </Section>

      {/* 5. CTA FINAL */}
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
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
