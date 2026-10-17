'use client';

import React, { useState, useRef, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import ChatWindow from './ChatWindow';

const emptySubscribe = () => () => {};

function useIsMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function getInitialPosition(): { x: number; y: number } {
  if (typeof window === 'undefined') return { x: 0, y: 0 };
  try {
    const saved = localStorage.getItem('el-cacique-chat-pos');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (typeof parsed?.x === 'number' && typeof parsed?.y === 'number') {
        return parsed;
      }
    }
  } catch {
    // localStorage no disponible
  }
  return { x: 0, y: 0 };
}

export default function ChatWidget() {
  const pathname = usePathname();
  const isMounted = useIsMounted();
  const [isOpen, setIsOpen] = useState(false);

  // Posicion inicial (esquina inferior derecha)
  const [position, setPosition] = useState<{ x: number; y: number }>(getInitialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initX: number; initY: number } | null>(null);
  const hasMovedRef = useRef<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    hasMovedRef.current = false;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: position.x,
      initY: position.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDragging || !dragRef.current) return;

    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      hasMovedRef.current = true;
    }

    // Limitar a la pantalla (evitar que se salga)
    const maxX = window.innerWidth - 64; // 64px ancho del boton
    const maxY = window.innerHeight - 64;

    // x e y son negativos porque el boton esta anclado a bottom-right
    const newX = Math.min(0, Math.max(-maxX, dragRef.current.initX + dx));
    const newY = Math.min(0, Math.max(-maxY, dragRef.current.initY + dy));

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignorar si ya fue liberado
    }
    setIsDragging(false);
    dragRef.current = null;
    try {
      localStorage.setItem('el-cacique-chat-pos', JSON.stringify(position));
    } catch {
      // localStorage no disponible
    }
  };

  // Si fue un click (sin arrastre significativo), abrir/cerrar el chat
  const handleClick = () => {
    if (!hasMovedRef.current) {
      setIsOpen((prev) => !prev);
    }
    hasMovedRef.current = false;
  };

  if (!isMounted || pathname?.startsWith('/design-system')) return null;

  return (
    <>
      <button
        ref={buttonRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={handleClick}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          touchAction: 'none', // Evitar scroll mientras se arrastra
        }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 md:w-16 md:h-16 bg-vino text-white rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200 flex items-center justify-center cursor-grab active:cursor-grabbing focus:outline-none focus-visible:ring-2 focus-visible:ring-azul select-none"
        aria-label="Abrir chat con Dori"
      >
        {/* Icono del chat */}
        <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        {!isOpen && <span className="absolute top-0 right-0 w-3 h-3 bg-azul border-2 border-white rounded-full" />}
      </button>

      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} onMinimize={() => setIsOpen(false)} />}
    </>
  );
}
