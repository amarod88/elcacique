# HISTORIA Y ARQUITECTURA DEL PROYECTO — EL CACIQUE

## 1. Stack Tecnológico
- **Frontend:** Next.js 16.4.5 (App Router), React 19, TypeScript, Tailwind CSS 4.
- **Backend:** Next.js Server Actions y Route Handlers.
- **Base de Datos:** Supabase (PostgreSQL).
- **Chatbot IA:** Groq SDK (Modelos: GPT-OSS 20B y 120B).
- **Pagos:** PayPal SDK (`@paypal/paypal-server-sdk` v0.6.1) — integración server-side completa (create + capture). Sandbox validado en local (`orders → 201`). Pendiente: flujo end-to-end completo (buyer approve + capture + persistencia) y sincronización de env vars en Vercel.
- **Estado Global:** Zustand (para el carrito de compras).
- **Monorepo:** pnpm workspaces.

## 2. Arquitectura de Datos (Validada vía SQL)
- **productos:** id (text), slug (text), arrays para tallas/colores/imagenes/telas, numeric para precios.
- **pedidos:** id (uuid PK), usuario_id (uuid), estado (text, default 'pendiente'), total (numeric), moneda (text, default 'USD'), paypal_order_id (text), created_at (timestamptz).
- **pedido_items:** id (uuid PK), pedido_id (uuid FK → pedidos.id **ON DELETE CASCADE**), producto_id (text FK → productos.id **NO ACTION**), cantidad (int), precio_unitario (numeric), talla (text), color (text), created_at (timestamptz).
- Las imágenes son hotlinks externos temporales. No se usa Supabase Storage aún para ahorrar cuota.

## 3. Rutas y Componentes Clave
- **Rutas generadas (14):** `/`, `/catalogo`, `/producto/[slug]`, `/carrito`, `/carrito/exito`, `/chatbot`, `/admin/*` (sujetas a re-certificación en cada `pnpm build`).
- **Componentes críticos:**
  - `apps/web/src/components/catalog/ProductActions.tsx` — selectores dinámicos de tallas/colores desde Supabase.
  - `apps/web/src/components/cart/PayPalButton.tsx` — cliente PayPal con create/capture server-side.
- **Server Actions:** `createPayPalOrder`, `capturePayPalOrder` en `apps/web/src/app/actions/paypal.ts`.
- **Flujo de pago certificado (local):**
  1. Carrito (Zustand) → `createPayPalOrder(cartItems)`.
  2. Server valida precios contra Supabase, arma `purchaseUnits[0].amount` con `value` y `breakdown.itemTotal` (requerido por PayPal cuando se envían `items`), y crea la orden en `api-m.sandbox.paypal.com`.
  3. Redirect al checkout PayPal Sandbox (`returnUrl /carrito/exito`).
  4. Buyer Sandbox aprueba.
  5. `capturePayPalOrder(orderID, cartItems, totalAmount)` → captura + inserta en `pedidos` y `pedido_items`.

## 4. Deuda Técnica Conocida
- **supabase-js + Node 20:** la librería emite warning de deprecación. La actualización a Node 22 está **prohibida por §4 del protocolo** (rompe el entorno Big Sur). Monitorear releases por LTS compatible con Node 20; no actuar preventivamente.
- **FK `pedido_items.producto_id → productos.id` con `NO ACTION`:** impide borrar productos con historial de ventas (correcto para auditoría), pero exige que el catálogo nunca se elimine físicamente — usar soft-delete (`activo boolean`) en fase futura. También implica que el flujo de capture debe manejar el caso "producto desaparecido entre add-to-cart y pago" (webhook de reconciliación o fallback).
- **Cálculo monetario:** `createPayPalOrder` acumula en centavos (enteros) para evitar drift de punto flotante y garantizar `sum(items) === breakdown.item_total`. No volver a introducir aritmética de floats para totales.

## 5. Deuda Técnica de Infraestructura (Vercel CLI)
- **Vercel CLI en macOS Big Sur:** La versión \`vercel@latest\` (v65+) falla al instalarse/ejecutarse en macOS 11 (error de símbolos dinámicos \`dyld\` en \`esbuild\`). Queda prohibido intentar usar Vercel CLI localmente en este entorno. Cualquier deploy forzado debe hacerse desde el Dashboard Web de Vercel (Redeploy desmarcando caché).
