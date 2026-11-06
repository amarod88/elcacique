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

## 6. Arquitectura del Panel de Administración (Fase 2)
- **Auth SSR:** Se usa `@supabase/ssr` con `createBrowserClient` en el frontend para sincronizar la sesión en cookies y `createServerClient` en el servidor para leerlas.
- **RLS (Row Level Security):** Se solucionó un error de recursión infinita (Code: 42P17) usando una función `SECURITY DEFINER` llamada `is_admin()`. Además, se otorgaron permisos base (GRANT SELECT) a la tabla `profiles`.
- **Inventario Relacional:** Creada tabla `producto_variantes` (talla, color, stock_fisico, en_produccion, lead_time_dias). Sembrada con 100 unidades por variante para el `MED-TOP-001`.
- **Dashboard Admin:** Rutas protegidas en `/admin/(panel)/dashboard` y `/admin/(panel)/inventario`. Layout aislado del login usando Route Groups `(panel)`.

## 7. Arquitectura de Gobernanza y Disponibilidad (Fase 3+)

### 7.1. Modelo de Disponibilidad (3 estados por producto)
- `tipo_disponibilidad`: `'stock'` | `'bajo_pedido'` | `'visita_local'`.
- `tiempo_reposicion_horas` (integer NULL): aplica solo a productos `'stock'` de alta rotación. Default conceptual: 48h.
- `activo boolean DEFAULT true` (soft-delete). Admin NO borra en duro.
- `eliminado_por uuid NULL`, `eliminado_at timestamptz NULL` (auditoría).

### 7.2. Máquina de 6 estados del botón (ProductActions)
| # | Condición | Botón | Alerta |
|---|---|---|---|
| 1 | `visita_local` | "Solicitar Cotización" | "Producto a medida. Te esperamos en tienda." |
| 2 | `stock > 10` | "Agregar al Carrito" | — |
| 3 | `1 <= stock <= 10` | "Agregar al Carrito" | "Últimos N en stock" |
| 4 | `stock = 0`, `tiempo_reposicion_horas` definido | "Reservar Bajo Pedido (48h)" | "Agotado. Disponible en 48h si lo pides ahora." |
| 5 | `stock = 0`, sin `tiempo_reposicion_horas` | "Sin stock — Consultar" (bloqueado) | "Agotado. Consulta disponibilidad." |
| 6 | `bajo_pedido` (MTO puro) | "Ordenar bajo pedido (N días)" | "Se fabrica a tu medida. Entrega en N días." |

### 7.3. Libro Mayor de Inventario (única vía de modificar stock)
- `stock_fisico` en `producto_variantes` **no es editable directamente**.
- Toda modificación ocurre por **movimiento de inventario** con: `tipo` (venta, requisa, devolucion-reparada, ajuste-auditoria), `cantidad` (+/-), `motivo`, `ejecutado_por`, `created_at`.
- El stock mostrado es la proyección del libro mayor. Fase 4 introduce tabla `movimientos_inventario`.
- Admin sembrado por auditoría física; NO puede alterarlo salvo por eventos autorizados (factura local, venta confirmada, requisa declarada).

### 7.4. Roles y Límites
- **Admin:** opera inventario, atiende pedidos, registra ventas locales, autoriza anulaciones (auto-reversión con notificación), gestiona RMAs.
- **Superadmin:** gobierna catálogo, precios públicos, `tipo_disponibilidad`, categorías, códigos de descuento, umbrales. Ve auditoría del admin.
- **Admin NO puede:** borrar producto con stock > 0, modificar precios públicos, alterar `stock_fisico` fuera de eventos autorizados.

### 7.5. Pagos y Comisiones
- Métodos: efectivo, transferencia, crédito (con plazo + alerta), tarjeta POS, e-commerce (PayPal/crédito).
- `pedidos.metodo_pago`, `pedidos.comision_bancaria` (registro interno).
- Comisión POS = **gasto empresa**, no se traslada al cliente. Precio público es final.
- Umbral stock bajo = **10** (global, hardcodeado; superadmin override en fase futura).

### 7.6. MTO y Reposición 48h (dos pools de producción)
- **Pool A — MTO puro:** `tipo='bajo_pedido'`. SLA >= 7 días (configurable por producto por superadmin). Cola por orden de llegada. Equipo producción general.
- **Pool B — Alta rotación 48h:** `tipo='stock'` agotado con `tiempo_reposicion_horas=48`. Cola por orden de llegada. Equipo corte rápido.
- Admin verá ambos pools consolidados con reporte acumulado por **categoría + SKU**.
- **Módulo de Control de Producción (declarado, fase posterior):** onboarding que refleje el estado exacto de cada orden (En Cola -> En Producción -> Control Calidad -> Completado/Reproceso).

### 7.7. Devoluciones (RMA) por Defecto de Fábrica
- Cuarentena -> inspección -> `reparado` o `descartado`.
- **NO reingresa automáticamente** al stock vendible.
- Solo si `reparado` se registra reingreso. Métricas obligatorias: `reparado` vs `descartado` por SKU y por proveedor.

### 7.8. Anulación de Factura / Venta
- Admin puede anular con **motivo obligatorio**.
- Reversión automática de stock + notificación al superadmin + registro en `anulaciones`.

### 7.9. Pruebas QA (Fase 3)
- 3 usuarios `qa-1@elcacique.net`, `qa-2@...`, `qa-3@...` en `auth.users` (creados manualmente por el Operador).
- Escenarios: (A) compra con stock -> decremento; (B) compra agotado -> bajo_pedido; (C) anulación -> reversión.
- **Protocolo de limpieza al cierre:** DELETE por patrón + re-siembra de stock + registro en BITACORA.

### 7.10. OAuth
- Diferido. Login admin SSR con email/password. OAuth (Google/Facebook) en fase posterior a certificar el flujo QA.

### 7.11. Hoja de Ruta
- **Fase 3 (esta):** Bajo-pedido end-to-end + pruebas QA. Cierra lazo venta -> stock -> dashboard.
- **Fase 4:** Libro mayor, dashboard admin (KPIs accionables), RMA, reportes de producción, catálogo depurado.
- **Fase 5:** Superadmin (gobernanza, roles, auditoría, precios, descuentos).
- **Fase 6:** Control de Producción (onboarding, dos equipos, reporte acumulado).
