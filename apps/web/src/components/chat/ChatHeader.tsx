'use client';

import React from 'react';

export interface ChatHeaderProps {
  onClear: () => void;
  onMinimize: () => void;
  onClose: () => void;
}

/**
 * Cabecera del widget de chat con monograma, estado en línea y acciones de control para Dori.
 */
export default function ChatHeader({ onClear, onMinimize, onClose }: ChatHeaderProps) {
  const handleClear = () => {
    const confirmed = window.confirm(
      '¿Desea limpiar el historial de la conversación actual? Esta acción no se puede deshacer.'
    );
    if (confirmed) {
      onClear();
    }
  };

  return (
    <div className="bg-azul text-white px-4 py-3 h-16 flex items-center justify-between rounded-t-2xl select-none shrink-0 shadow-md">
      {/* Información de Dori */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-vino text-white flex items-center justify-center font-display text-lg font-bold shadow-sm">
            D
          </div>
          <span
            className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-success ring-2 ring-azul"
            title="En línea"
          />
        </div>

        <div className="flex flex-col">
          <span className="font-display text-base font-medium leading-tight">
            Dori
          </span>
          <span className="text-xs text-celeste-100 flex items-center mt-0.5">
            <span className="w-2 h-2 rounded-full bg-success inline-block mr-1.5" />
            En línea
          </span>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex items-center space-x-1">
        {/* Limpiar conversación */}
        <button
          type="button"
          onClick={handleClear}
          aria-label="Limpiar conversación"
          title="Limpiar conversación"
          className="p-2 text-white/80 hover:text-white hover:bg-azul-500/40 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-white focus:outline-none"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>

        {/* Minimizar */}
        <button
          type="button"
          onClick={onMinimize}
          aria-label="Minimizar chat"
          title="Minimizar"
          className="p-2 text-white/80 hover:text-white hover:bg-azul-500/40 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-white focus:outline-none"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
          </svg>
        </button>

        {/* Cerrar */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar chat"
          title="Cerrar"
          className="p-2 text-white/80 hover:text-white hover:bg-azul-500/40 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-white focus:outline-none"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
