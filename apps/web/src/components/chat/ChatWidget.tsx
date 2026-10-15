'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import ChatWindow from './ChatWindow';

const STORAGE_OPEN_KEY = 'el-cacique-chat-open';

const emptySubscribe = () => () => {};

/**
 * Hook para detectar si el componente está montado en el cliente sin disparar re-renders innecesarios.
 */
function useIsMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function getInitialIsOpen(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(STORAGE_OPEN_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Componente flotante de chat autocontenido, anclado en la esquina inferior derecha.
 */
export default function ChatWidget() {
  const pathname = usePathname();
  const isMounted = useIsMounted();
  const [isOpen, setIsOpen] = useState<boolean>(getInitialIsOpen);
  const [hasUnread, setHasUnread] = useState<boolean>(() => !getInitialIsOpen());

  if (!isMounted || pathname?.startsWith('/design-system')) {
    return null;
  }

  const toggleOpen = () => {
    setIsOpen((prev) => {
      const next = !prev;
      try {
        sessionStorage.setItem(STORAGE_OPEN_KEY, String(next));
      } catch (e) {
        console.warn('Error guardando estado en sessionStorage:', e);
      }
      if (next) {
        setHasUnread(false);
      }
      return next;
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem(STORAGE_OPEN_KEY, 'false');
    } catch (e) {
      console.warn('Error guardando estado en sessionStorage:', e);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* Ventana de chat cuando está abierta */}
      {isOpen && <ChatWindow onClose={handleClose} onMinimize={handleClose} />}

      {/* Botón flotante siempre visible o al minimizar */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={toggleOpen}
          aria-label={
            isOpen ? 'Cerrar chat con Cacique Asistente' : 'Abrir chat con Cacique Asistente'
          }
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-vino text-white shadow-lg hover:bg-vino-600 transition-all duration-200 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-azul focus:outline-none hover:scale-105 active:scale-95"
        >
          {/* Badge de mensaje no leído */}
          {!isOpen && hasUnread && (
            <span
              className="absolute -top-1 -right-1 w-5 h-5 bg-azul text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm"
              aria-label="1 mensaje no leído"
            >
              1
            </span>
          )}

          {isOpen ? (
            /* Icono de cerrar cuando está abierto */
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            /* Icono de conversación cuando está cerrado */
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          )}
        </button>
      </div>
    </>
  );
}
