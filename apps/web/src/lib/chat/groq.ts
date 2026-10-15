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
        temperature: 0.3,
        max_tokens: 800,
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

  const smartTriggers = [
    // Consultas comerciales complejas / Cotizaciones / Precios en español
    'cotizar',
    'cotización',
    'cotizacion',
    'presupuesto',
    'comparar',
    'recomendar',
    'recomiéndame',
    'recomiendame',
    'cuánto cuesta',
    'cuanto cuesta',
    'precio',
    'precios',
    'costo',
    'costos',
    'para cuántas',
    'para cuantas',
    'volumen',
    'mayoreo',
    'por mayor',
    'institucional',
    'licitación',
    'licitacion',
    'proyecto especial',
    // English triggers
    'how much',
    'how many',
    'cost',
    'costs',
    'price',
    'prices',
    'pricing',
    'quote',
    'quotation',
    'recommend',
    'recommendation',
    'compare',
    'bulk',
    'wholesale',
    'tender',
    'scrub',
    'scrubs',
    'uniform',
    'uniforms',
  ];

  if (smartTriggers.some((t) => last.includes(t))) return 'smart';
  if (messages.length > 10) return 'smart';
  if (last.length > 150) return 'smart';

  return 'fast';
}
