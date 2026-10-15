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
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const completion = await groq.chat.completions.create(
      {
        messages,
        model: modelName,
        temperature: 0.5,
        max_tokens: 700,
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

  // Saludos simples y consultas muy cortas van al fast
  const simpleGreetings = ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'hi', 'hello'];
  const isJustGreeting = simpleGreetings.some((g) => last.trim() === g || last.trim() === `${g}!`);

  if (isJustGreeting && messages.length <= 2) return 'fast';

  // Todo lo demás va al smart (más natural y conversacional)
  // El fast solo se usa como fallback si smart falla
  return 'smart';
}
