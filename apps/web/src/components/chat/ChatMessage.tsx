'use client';

import React from 'react';

export interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Parsea segmentos de texto con formato de negrita (**texto**).
 */
function renderBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );
}

/**
 * Renderiza contenido con formato básico: negritas, listas y saltos de línea.
 */
function renderContent(content: string): React.ReactNode {
  const lines = content.split('\n');
  return lines.map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ')) {
      return (
        <li key={i} className="ml-4 list-disc leading-relaxed">
          {renderBold(trimmed.slice(2))}
        </li>
      );
    }
    if (trimmed === '') {
      return <div key={i} className="h-2" />;
    }
    return (
      <p key={i} className="leading-relaxed">
        {renderBold(line)}
      </p>
    );
  });
}

/**
 * Componente para mostrar un mensaje individual en la conversación.
 */
export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex w-full my-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] sm:max-w-[80%] px-4 py-3 text-sm shadow-sm transition-all duration-200 ${
          isUser
            ? 'bg-azul text-white rounded-2xl rounded-tr-sm'
            : 'bg-beige-200 text-marron rounded-2xl rounded-tl-sm'
        }`}
      >
        <div className="space-y-1">{renderContent(content)}</div>
      </div>
    </div>
  );
}
