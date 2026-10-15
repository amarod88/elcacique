'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { Button } from '../ui/Button';

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === 'undefined') return () => {};
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      mediaQuery.addEventListener('change', callback);
      return () => mediaQuery.removeEventListener('change', callback);
    },
    () => (typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false),
    () => false
  );
}

export function HeroVideo() {
  const [videoError, setVideoError] = useState(false);
  const [delayedContent, setDelayedContent] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const posterUrl = 'https://ik.imagekit.io/klfr4wofz/serigrafia%20san%20jose/confeccion.mp4?tr=so-1';
  const videoWebmDesktop = 'https://ik.imagekit.io/klfr4wofz/serigrafia%20san%20jose/confeccion.mp4?tr=w-1920,q-80,ac-none,f-webm';
  const videoMp4Desktop = 'https://ik.imagekit.io/klfr4wofz/serigrafia%20san%20jose/confeccion.mp4?tr=w-1920,q-80,ac-none';
  const videoMp4Mobile = 'https://ik.imagekit.io/klfr4wofz/serigrafia%20san%20jose/confeccion.mp4?tr=w-854,q-70,ac-none';

  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayedContent(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const showContent = reducedMotion || delayedContent;

  return (
    <div className="relative w-full min-h-[80vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-azul-700">
      {/* Video Background o Fallback Poster si falla o si reduced-motion está activo */}
      {!videoError && !reducedMotion ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={posterUrl}
          onError={() => setVideoError(true)}
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        >
          {/* Móvil */}
          <source src={videoMp4Mobile} type="video/mp4" media="(max-width: 767px)" />
          {/* Desktop WebM */}
          <source src={videoWebmDesktop} type="video/webm" media="(min-width: 768px)" />
          {/* Desktop MP4 fallback */}
          <source src={videoMp4Desktop} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center z-0 transition-opacity duration-500"
          style={{ backgroundImage: `url(${posterUrl})` }}
        />
      )}

      {/* Overlay azul #1B3A5C al 45% */}
      <div className="absolute inset-0 bg-azul/45 backdrop-brightness-95 z-10" />

      {/* Gradiente adicional sutil para legibilidad en bordes */}
      <div className="absolute inset-0 bg-gradient-to-t from-azul-700/80 via-transparent to-azul-700/40 z-10 pointer-events-none" />

      {/* Contenido con retardo de 4s (o inmediato en reduced motion) y transición suave */}
      <div
        className={`relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center transition-all duration-800 ${
          showContent
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
      >
        <span className="inline-block px-3.5 py-1 rounded-full bg-beige/20 text-beige border border-beige/30 font-body text-xs sm:text-sm font-semibold tracking-wide uppercase mb-6 backdrop-blur-xs">
          Fábrica de Uniformes en Managua
        </span>

        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-blanco leading-[1.1] tracking-tight mb-6 text-balance drop-shadow-md">
          Uniformes que proyectan presencia. Confeccionados a su medida.
        </h1>

        <p className="font-body text-base sm:text-lg md:text-xl text-beige-100/90 max-w-2xl mx-auto leading-relaxed mb-10 text-balance drop-shadow-xs">
          Fábrica de uniformes con atención personalizada, bordado computarizado y entrega local en 48–72 horas.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button href="/catalogo" variant="primary" size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-xl">
            Ver catálogo completo
          </Button>
          <Button
            href="/cotizacion"
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto !border-beige !text-beige hover:!bg-beige hover:!text-azul backdrop-blur-xs"
          >
            Solicitar cotización
          </Button>
        </div>

        {/* Indicadores de confianza debajo de los botones */}
        <div className="mt-12 pt-8 border-t border-blanco/20 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-body text-beige-100/80">
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-celeste" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Garantía de 3 a 6 meses
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-celeste" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Bordado computarizado incluido
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-celeste" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Delivery gratis en Managua
          </span>
        </div>
      </div>
    </div>
  );
}
