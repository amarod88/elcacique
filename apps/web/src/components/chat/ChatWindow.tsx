'use client';

import React, { useState, useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import {
  ChatSession,
  getSession,
  saveSession,
  createSession,
  clearSession,
  compactSessionIfNeeded,
  ChatMessageItem,
} from '@/lib/chat/session';
import { useCartStore } from '@/lib/store/cart';

export interface ChatWindowProps {
  onClose: () => void;
  onMinimize: () => void;
}

const BIENVENIDA_MSG =
  '¡Bienvenido a El Cacique! Soy Dori, su asistente virtual. ¿En qué tipo de uniforme está interesado hoy? Puedo ayudarle con uniformes médicos, corporativos, industriales, gastronómicos, escolares y sastrería a medida.';

function extractSlugFromPath(path: string): string | undefined {
  const match = path.match(/^\/producto\/([^/]+)/);
  return match ? match[1] : undefined;
}

function getInitialSession(): ChatSession {
  if (typeof window === 'undefined') {
    return {
      sessionId: 'initial',
      messages: [{ role: 'assistant', content: BIENVENIDA_MSG }],
      createdAt: Date.now(),
      lastActivity: Date.now(),
    };
  }

  let current = getSession();
  if (!current || current.messages.length === 0) {
    current = createSession();
    current.messages = [
      {
        role: 'assistant',
        content: BIENVENIDA_MSG,
      },
    ];
    saveSession(current);
  }
  return current;
}

/**
 * Ventana de chat interactiva que gestiona la conversación, memoria y llamadas al backend.
 */
export default function ChatWindow({ onClose, onMinimize }: ChatWindowProps) {
  const [session, setSession] = useState<ChatSession>(getInitialSession);
  const [messages, setMessages] = useState<ChatMessageItem[]>(() => session.messages);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll hacia el mensaje más reciente
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Cerrar ventana con la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Enviar mensaje del usuario
  const handleSend = async (content: string) => {
    if (!content.trim()) return;

    let activeSession = session || getSession() || createSession();

    const userMessage: ChatMessageItem = { role: 'user', content };
    const updatedMessages: ChatMessageItem[] = [...activeSession.messages, userMessage];

    // Actualización inmediata en UI
    setMessages(updatedMessages);
    activeSession = {
      ...activeSession,
      messages: updatedMessages,
      lastActivity: Date.now(),
    };
    setSession(activeSession);
    saveSession(activeSession);
    setLoading(true);

    try {
      // Compactar sesión si supera el límite de mensajes
      activeSession = await compactSessionIfNeeded(activeSession);

      const path = typeof window !== 'undefined' ? window.location.pathname : '/';
      const context = {
        currentPage: path,
        currentProductSlug: extractSlugFromPath(path),
        cartItemsCount: useCartStore.getState().totalItems(),
      };

      const messagesPayload = activeSession.summary
        ? [
            {
              role: 'system' as const,
              content: `Resumen de mensajes anteriores: ${activeSession.summary}`,
            },
            ...activeSession.messages.map((m) => ({ role: m.role, content: m.content })),
          ]
        : activeSession.messages.map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messagesPayload,
          context,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en servidor: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: ChatMessageItem = {
        role: 'assistant',
        content:
          data.message ||
          'Disculpe, ocurrió un inconveniente temporal. Por favor intente nuevamente.',
      };

      const finalMessages = [...activeSession.messages, assistantMessage];
      const finalSession: ChatSession = {
        ...activeSession,
        messages: finalMessages,
        lastActivity: Date.now(),
      };

      setSession(finalSession);
      setMessages(finalMessages);
      saveSession(finalSession);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.warn(`Error al comunicarse con /api/chat: ${errMsg}`);
      const errorMessage: ChatMessageItem = {
        role: 'assistant',
        content:
          'Estoy experimentando dificultades para conectar en este momento. Por favor reintente en unos instantes o contáctenos por WhatsApp al +505 8467 6004.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Limpiar conversación y reiniciar con mensaje de bienvenida
  const handleClear = () => {
    clearSession();
    const newSession = createSession();
    newSession.messages = [
      {
        role: 'assistant',
        content: BIENVENIDA_MSG,
      },
    ];
    saveSession(newSession);
    setSession(newSession);
    setMessages(newSession.messages);
  };

  return (
    <div
      className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 z-50 w-full sm:w-96 h-full sm:h-[600px] bg-white sm:rounded-2xl shadow-xl flex flex-col border sm:border-gris-200 overflow-hidden animate-fade-in-delayed transition-all duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Ventana de chat con Dori"
    >
      {/* Cabecera */}
      <ChatHeader onClear={handleClear} onMinimize={onMinimize} onClose={onClose} />

      {/* Historial de mensajes */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-white"
        role="log"
        aria-live="polite"
      >
        {messages.map((msg, index) => (
          <ChatMessage key={index} role={msg.role} content={msg.content} />
        ))}

        {loading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Entrada de texto */}
      <ChatInput onSend={handleSend} disabled={loading} />
    </div>
  );
}
