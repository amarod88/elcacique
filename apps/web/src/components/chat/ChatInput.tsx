'use client';

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';

export interface ChatInputProps {
  onSend: (content: string) => void;
  disabled: boolean;
}

const MAX_CHARS = 500;

/**
 * Campo de entrada para el usuario con auto-crecimiento, contador de caracteres y atajos de teclado.
 */
export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus al montar
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Ajuste dinámico de altura (hasta 4 líneas ~120px)
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (disabled || !trimmed || text.length > MAX_CHARS) {
      return;
    }

    onSend(trimmed);
    setText('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isOverLimit = text.length > MAX_CHARS;
  const canSend = text.trim().length > 0 && !isOverLimit && !disabled;

  return (
    <div className="p-4 border-t border-beige-200 bg-white pb-[calc(1rem+env(safe-area-inset-bottom))] shrink-0">
      {/* Contador superior derecho */}
      <div className="flex justify-end pr-1 mb-1">
        <span
          className={`text-xs ${
            isOverLimit ? 'text-error font-bold' : 'text-gris-400'
          }`}
        >
          {text.length}/{MAX_CHARS}
        </span>
      </div>

      <div className="flex items-end space-x-2 bg-beige-100 rounded-xl p-1.5 border border-gris-200 focus-within:border-azul focus-within:ring-1 focus-within:ring-azul transition-all">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe su consulta..."
          rows={1}
          disabled={disabled}
          className="flex-1 bg-transparent resize-none outline-none text-sm text-marron placeholder:text-gris-400 max-h-28 px-2 py-1 leading-relaxed disabled:opacity-50"
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Enviar mensaje"
          title="Enviar mensaje"
          className="p-2.5 rounded-full bg-vino text-white hover:bg-vino-600 disabled:opacity-40 disabled:hover:bg-vino disabled:cursor-not-allowed transition-colors shrink-0 shadow-sm focus-visible:ring-2 focus-visible:ring-azul focus:outline-none"
        >
          <svg
            className="w-4 h-4 transform rotate-90"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 19V5m0 0l-7 7m7-7l7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
