# HISTORIA Y ARQUITECTURA DEL PROYECTO — EL CACIQUE

## 1. Stack Tecnológico
- **Frontend:** Next.js 16.4.5 (App Router), React 19, TypeScript, Tailwind CSS 4.
- **Backend:** Next.js Server Actions y Route Handlers.
- **Base de Datos:** Supabase (PostgreSQL).
- **Chatbot IA:** Groq SDK (Modelos: GPT-OSS 20B y 120B).
- **Pagos:** PayPal SDK (Sandbox en progreso).
- **Estado Global:** Zustand (para el carrito de compras).
- **Monorepo:** pnpm workspaces.

## 2. Arquitectura de Datos (Validada vía SQL)
- **productos:** id (text), slug (text), arrays para tallas/colores/imagenes/telas, numeric para precios.
- **pedidos:** id (uuid), total (numeric), paypal_order_id (text), estado (text).
- **pedido_items:** id (uuid), pedido_id (uuid), producto_id (text), precio_unitario (numeric).
- Las imágenes son hotlinks externos temporales. No se usa Supabase Storage aún para ahorrar cuota.
