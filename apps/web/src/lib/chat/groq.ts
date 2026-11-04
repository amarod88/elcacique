import Groq from 'groq-sdk';

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export interface GroqCallResult {
  content: string;
  model: 'fast' | 'smart';
  tokens: { input: number; output: number };
}

export async function callGroq(
  messages: Groq.Chat.ChatCompletionMessageParam[],
  model: 'fast' | 'smart'
): Promise<GroqCallResult> {
  const modelName =
    model === 'fast'
      ? process.env.GROQ_MODEL_FAST || 'openai/gpt-oss-20b'
      : process.env.GROQ_MODEL_SMART || 'openai/gpt-oss-120b';

  const controller = new AbortController();
  const timeoutMs = model === 'smart' ? 25000 : 15000;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const completion = await groq.chat.completions.create(
      {
        messages,
        model: modelName,
        temperature: 0.5,
        max_tokens: 1000,
        top_p: 0.9,
      },
      { signal: controller.signal }
    );

    const content = completion.choices[0]?.message?.content ?? '';
    return {
      content,
      model,
      tokens: {
        input: completion.usage?.prompt_tokens ?? 0,
        output: completion.usage?.completion_tokens ?? 0,
      },
    };
  } finally {
    clearTimeout(timeout);
  }
}

export function selectModel(
  messages: { role: string; content: string }[]
): 'fast' | 'smart' {
  const last = messages[messages.length - 1]?.content.toLowerCase() ?? '';

  // Consultas sobre pliegos o licitaciones complejas se derivan a smart
  const complexKeywords = ['licitación', 'licitacion', 'pliego técnico', 'pliego de bases'];
  const isComplex = complexKeywords.some((k) => last.includes(k));

  if (isComplex) return 'smart';

  // Usar 'fast' (openai/gpt-oss-20b) por defecto para respuestas rápidas (<1s),
  // evitando timeouts de 15s y sobrecarga de tokens en Groq.
  return 'smart';
}
