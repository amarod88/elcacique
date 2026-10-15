# El Cacique — Landing Premium + Chatbot IA

Landing web premium con chatbot de atención al cliente y ventas para El Cacique, Fábrica de Uniformes en Nicaragua.

## Stack
- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4
- Groq (GPT-OSS 20B / 120B) para el chatbot
- PayPal para pagos
- ImageKit para imágenes y video
- Vercel para despliegue

## Requisitos
- Node 20+
- pnpm 9+

## Instalación
```bash
pnpm install
pnpm dev
```

## Estructura
- `apps/web` — Landing y chatbot
- `packages/shared` — Tipos y datos compartidos
- `packages/config` — Configuración compartida
- `ia/` — Base de conocimiento del chatbot

## Fases
- Fase 0: Fundaciones (actual)
- Fase 1: Catálogo y datos
- Fase 2: Diseño visual
- Fase 3: Landing base
- Fase 4: Chatbot IA
- Fase 5: Carrito y PayPal
- Fase 6: Pruebas
- Fase 7: Lanzamiento
