import { NextRequest, NextResponse } from 'next/server';
import { callGroq, selectModel } from '@/lib/chat/groq';
import { buildSystemPrompt } from '@/lib/chat/context';

export const runtime = 'nodejs';
export const maxDuration = 30;

interface ChatRequest {
  messages: { role: 'user' | 'assistant'; content: string }[];
  context?: {
    currentPage?: string;
    currentProductSlug?: string;
    cartItemsCount?: number;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequest;

    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json(
        { error: 'Mensajes inválidos' },
        { status: 400 }
      );
    }

    const recent = body.messages.slice(-20);
    const systemPrompt = buildSystemPrompt(body.context ?? {});

    const groqMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...recent.map((m) => ({ role: m.role, content: m.content })),
    ];

    const model = selectModel(recent);

    try {
      const result = await callGroq(groqMessages, model);
      return NextResponse.json({
        message: result.content,
        model: result.model,
        tokens: result.tokens,
      });
    } catch (primaryError) {
      // Fallback al otro modelo
      const fallbackModel = model === 'fast' ? 'smart' : 'fast';
      console.warn('[chat] fallback a', fallbackModel, primaryError);

      const result = await callGroq(groqMessages, fallbackModel);
      return NextResponse.json({
        message: result.content,
        model: result.model,
        tokens: result.tokens,
      });
    }
  } catch (error) {
    console.error('[chat] error:', error);
    return NextResponse.json({
      message:
        'Estoy teniendo problemas técnicos. Por favor intenta de nuevo o escribe a nuestro WhatsApp al +505 8888-8888.',
      model: 'fast',
      tokens: { input: 0, output: 0 },
    });
  }
}
