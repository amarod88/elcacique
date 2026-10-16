/**
 * apps/web/src/lib/chat/session.ts
 * Manejo de memoria por sesión para el chatbot de El Cacique con localStorage y compactación.
 */

export interface ChatMessageItem {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatSession {
  sessionId: string;
  messages: ChatMessageItem[];
  createdAt: number;
  lastActivity: number;
  summary?: string;
}

const SESSION_STORAGE_KEY = 'el-cacique-chat-session';
const EXPIRATION_TIME_MS = 2 * 60 * 60 * 1000; // 2 horas de inactividad

/**
 * Obtiene la sesión actual desde localStorage.
 * Si ha expirado (más de 2 horas de inactividad), la descarta y retorna null.
 */
export function getSession(): ChatSession | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;

    const session: ChatSession = JSON.parse(raw);
    const now = Date.now();

    if (now - session.lastActivity > EXPIRATION_TIME_MS) {
      clearSession();
      return null;
    }

    return session;
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.warn(`Error al leer la sesión de chat: ${errMsg}`);
    return null;
  }
}

/**
 * Guarda o actualiza la sesión en localStorage, refrescando lastActivity.
 */
export function saveSession(session: ChatSession): void {
  if (typeof window === 'undefined') return;

  try {
    const updatedSession: ChatSession = {
      ...session,
      lastActivity: Date.now(),
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedSession));
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.warn(`Error al guardar la sesión de chat: ${errMsg}`);
  }
}

/**
 * Limpia y elimina la sesión de chat del localStorage.
 */
export function clearSession(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.warn(`Error al eliminar la sesión de chat: ${errMsg}`);
  }
}

/**
 * Crea una nueva sesión de chat vacía con identificador único y marcas de tiempo actuales.
 */
export function createSession(): ChatSession {
  const now = Date.now();
  const id =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `session-${now}-${Math.random().toString(36).substring(2, 9)}`;

  const newSession: ChatSession = {
    sessionId: id,
    messages: [],
    createdAt: now,
    lastActivity: now,
  };

  saveSession(newSession);
  return newSession;
}

/**
 * Compactación síncrona preventiva: si el historial supera 15 mensajes,
 * conserva únicamente los últimos 10 mensajes.
 */
export function compactSession(session: ChatSession): ChatSession {
  if (session.messages.length <= 15) return session;

  return {
    ...session,
    messages: session.messages.slice(-10),
  };
}

/**
 * Compactación con IA: Si el historial supera 15 mensajes, los primeros 10
 * se resumen mediante el endpoint /api/chat. El resumen se almacena en session.summary
 * y el historial se reduce a los últimos 10 mensajes.
 */
export async function compactSessionIfNeeded(
  session: ChatSession
): Promise<ChatSession> {
  if (session.messages.length <= 15) return session;

  const primeros = session.messages.slice(0, 10);
  const ultimos = session.messages.slice(-10);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          ...primeros,
          {
            role: 'user',
            content:
              'Resume la conversación anterior en 3 oraciones, destacando productos consultados, precios discutidos y estado del pedido. Responde solo con el resumen.',
          },
        ],
        context: { currentPage: 'compactacion' },
      }),
    });

    if (!response.ok) {
      console.warn('No se pudo compactar la sesión via API, manteniendo últimos mensajes');
      return compactSession(session);
    }

    const data = await response.json();

    const compacted: ChatSession = {
      ...session,
      summary: data.message || session.summary,
      messages: ultimos,
      lastActivity: Date.now(),
    };

    saveSession(compacted);
    return compacted;
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.warn(`Error durante la compactación de la sesión: ${errMsg}`);
    return compactSession(session);
  }
}
