'use client';

import React, { useState, useSyncExternalStore } from 'react';

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
  const reducedMotion = usePrefersReducedMotion();

  const posterUrl = 'https://ik.imagekit.io/klfr4wofz/serigrafia%20san%20jose/confeccion.mp4?tr=so-1';
  const videoWebmDesktop = 'https://ik.imagekit.io/klfr4wofz/serigrafia%20san%20jose/confeccion.mp4?tr=w-1920,q-80,ac-none,f-webm';
  const videoMp4Desktop = 'https://ik.imagekit.io/klfr4wofz/serigrafia%20san%20jose/confeccion.mp4?tr=w-1920,q-80,ac-none';
  const videoMp4Mobile = 'https://ik.imagekit.io/klfr4wofz/serigrafia%20san%20jose/confeccion.mp4?tr=w-854,q-70,ac-none';

  return (
    <>
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
          <source src={videoMp4Mobile} type="video/mp4" media="(max-width: 767px)" />
          <source src={videoWebmDesktop} type="video/webm" media="(min-width: 768px)" />
          <source src={videoMp4Desktop} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center z-0 transition-opacity duration-500"
          style={{ backgroundImage: `url(${posterUrl})` }}
        />
      )}

      {/* Overlay azul ajustado (menos opaco, más brillo) */}
      <div className="absolute inset-0 bg-azul/50 backdrop-brightness-90 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F2338] via-azul/20 to-[#0F2338]/40 z-10 pointer-events-none" />
    </>
  );
}
