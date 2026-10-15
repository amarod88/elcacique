'use client';

import React from 'react';

/**
 * Indicador visual de escritura cuando el asistente está procesando una respuesta.
 */
export default function TypingIndicator() {
  return (
    <div className="flex justify-start my-2">
      <div
        role="status"
        aria-label="Cacique Asistente está escribiendo"
        className="bg-beige-200 text-marron rounded-2xl rounded-tl-sm px-4 py-3 flex items-center space-x-1.5 shadow-sm"
      >
        <span className="sr-only">Cacique Asistente está escribiendo...</span>
        <div
          className="w-2 h-2 rounded-full bg-vino animate-bounce"
          style={{ animationDelay: '0ms', animationDuration: '1000ms' }}
        />
        <div
          className="w-2 h-2 rounded-full bg-vino animate-bounce"
          style={{ animationDelay: '200ms', animationDuration: '1000ms' }}
        />
        <div
          className="w-2 h-2 rounded-full bg-vino animate-bounce"
          style={{ animationDelay: '400ms', animationDuration: '1000ms' }}
        />
      </div>
    </div>
  );
}
