# BITÁCORA DE DESARROLLO — EL CACIQUE

## [Noviembre 4, 2026] — Reconstrucción de bitácora y consolidación de estado

### Contexto
El archivo `BITACORA.md` no existía (ni en disco ni en git) al momento de esta auditoría — probablemente por corte de tokens en la fase anterior. Se crea por primera vez a partir de este punto, sellando el estado real del repositorio verificado contra `git log`.

### Auditoría de repositorio (Cláusula de Cero Suposiciones)
- **PROTOCOLO.md**: versionado en `626e37f`. Sin cambios pendientes. ✅
- **HISTORIA.md**: versionado en `626e37f`. Sin cambios pendientes. ✅
- **BITACORA.md**: no existía. Se crea ahora. 🆕

### Último commit en producción
- `7341982` (origin/main) — feat(payments): implement secure server-side PayPal integration and fix TypeScript enums
- Commits previos relevantes: `d6ed57a` (PayPal client + create order action), `626e37f` (protocol + SDKs de pago), `1fa3a1c`, `aaf942f`.

### Trabajo SIN commitear en working tree (identificado al 4-Nov)
**Nuevos (untracked):**
- `apps/web/src/app/carrito/exito/` (página de éxito post-captura PayPal)
- `apps/web/src/components/catalog/ProductActions.tsx` (selectores dinámicos de tallas/colores)

**Modificados:**
- `apps/web/next-env.d.ts`
- `apps/web/src/app/actions/paypal.ts`
- `apps/web/src/app/carrito/page.tsx`
- `apps/web/src/app/producto/[slug]/page.tsx`
- `apps/web/src/components/cart/PayPalButton.tsx`

### Verificado ✅
- `pnpm --filter web build` compila 100% en local (14 rutas, incl. `/carrito/exito`).
- Carrito Zustand operativo.
- Server Actions `createPayPalOrder` / `capturePayPalOrder` compilando.
- Ficha de producto interactiva (`ProductActions.tsx`) funcional.

### Pendiente 🔄
- Cargar `NEXT_PUBLIC_PAYPAL_CLIENT_ID` en Vercel (producción) — aún NO ingresada (esperando cierre de esta fase).
- Validar visualmente el botón PayPal en `http://localhost:3000/carrito` tras reinicio de `pnpm dev`.
- Simulación de compra completa en Sandbox PayPal (buyer → redirect → `/carrito/exito` → capture).
- Compilar limpio (`pnpm build`), commitear y pushear el trabajo pendiente (Regla de Oro).

### Bloqueantes ⛔
- Ninguno técnico. Solo falta cerrar los pendientes arriba para la fase de pagos.

### Entorno inmutable verificado
- macOS 11.7.11 Big Sur · Node v20.20.2 (nvm) · pnpm 9.15.9 · Next 16.4.5

## [Noviembre 4, 2026] — Fix PayPal + Sanitización + Certificación de credenciales

### Sanitización pre-Sandbox
- Auditoría SQL de `pedidos` / `pedido_items`: **ambas tablas ya en 0 filas**.
- Los intentos previos con 422 (`ITEM_TOTAL_REQUIRED`) no llegaron a persistir nada.
- **No se requirió DELETE ni backup.** BD certificada limpia para facturar desde cero.

### Certificación de credenciales PayPal (local)
- Auditoría `.env.local` (solo nombres/longitud, sin exponer valores):
  - Par original: `NEXT_PUBLIC_PAYPAL_CLIENT_ID` con prefijo anómalo `tA…` (81 chars) + `PAYPAL_CLIENT_SECRET` (`EI…`, 80 chars).
  - OAuth Sandbox devolvió **401 `invalid_client`** — par inválido tanto en Live como en Sandbox.
- **Hallazgo estructural adicional:** el código server-side (`paypal.ts`) leía `process.env.PAYPAL_CLIENT_ID` (sin prefijo) mientras el `.env.local` solo tenía `NEXT_PUBLIC_PAYPAL_CLIENT_ID` → el client server-side arrancaba sin auth.
- **Corrección aplicada (Operador en dashboard PayPal + `nano apps/web/.env.local`):**
  - Regenerado el secret en PayPal Developer Dashboard → nuevo `PAYPAL_CLIENT_SECRET` (`EF…`, 80 chars).
  - Corregido el client_id → `AR…` (80 chars, formato estándar Sandbox).
  - Añadida la variable server-side `PAYPAL_CLIENT_ID` (mismo valor que la pública).
- **Re-certificación:** OAuth Sandbox ✅ credenciales válidas, token 97 chars, expira 32400s (9h).

### Fix `ITEM_TOTAL_REQUIRED` en `createPayPalOrder`
- `ordersCreate` devolvía **422 `UNPROCESSABLE_ENTITY` / `ITEM_TOTAL_REQUIRED`** porque PayPal exige `amount.breakdown.item_total` cuando se envían `items`.
- **Patch aplicado** en `apps/web/src/app/actions/paypal.ts`:
  - Añadido `amount.breakdown.itemTotal = { currencyCode, value }` con el mismo `value` que el total.
  - Refactor del cálculo monetario: acumulación en centavos enteros (`totalCents`) y conversión a string con `toFixed(2)` para eliminar drift de punto flotante.
- **Verificación:** `pnpm exec tsc --noEmit` → `exit_code=0`. `pnpm dev` reiniciado con `rm -rf .next`. Log: `POST /v2/checkout/orders → 201`. ✅

### Pendientes 🔄
- Flujo Sandbox end-to-end (buyer approve → `/carrito/exito` → `capturePayPalOrder` → INSERT en `pedidos`/`pedido_items`).
- Cargar `NEXT_PUBLIC_PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET` y `PAYPAL_ENV` en Vercel (3 entornos).
- `pnpm build` fresco + `git push` de esta fase (Regla de Oro).

### Entorno inmutable verificado
- macOS 11.7.11 Big Sur · Node v20.20.2 (nvm) · pnpm 9.15.9 · Next 16.4.5

## [Noviembre 4, 2026] — Refinamiento de PROTOCOLO (vía refinada de diagnóstico)

### Contexto
Durante el traspaso al nuevo Director, el Operador levantó dos restricciones heredadas que resultaban sobre-restrictivas para el diagnóstico eficiente:
1. La prohibición absoluta de leer código fuente (HANDOFF anterior §3.1).
2. La prohibición absoluta de `npx` (PROTOCOLO §5.4 anterior).

### Cambios aplicados
- **PROTOCOLO.md §3.6 (NUEVA):** lectura de código fuente como canal de verificación permitida en dos escenarios (A: hipótesis validada, problema persiste; B: el código es la vía correcta de diagnóstico). Requiere declaración previa del objetivo y lectura dirigida.
- **PROTOCOLO.md §5.4 (REEMPLAZADA):** escalera de tres peldaños para ejecutables no instalados. P2 preferido: `pnpm dlx <pkg>@<x.y.z>` (aislado, versionado, sin tocar global). P3 excepcional: `npx --yes --package=<pkg>@<x.y.z> <cmd>`. Prohibido absolutamente `npm i -g`, `npx -g`, `pnpm add -g`.
- **HANDOFF.md §3 (intro):** alineado con §3.6 — la restricción absoluta previa queda superada por la política refinada del 4-Nov-2026.
- **HISTORIA.md:** sin cambios (esta refinación no altera arquitectura ni stack).

### Motivo
El diagnóstico del blocker activo (INSERT fallido en Supabase durante `capturePayPalOrder` en producción) requiere flexibilidad para leer código fuente cuando la evidencia conductual sea insuficiente. La política anterior impedía esa vía sin necesidad técnica real.

### Verificado
- `pnpm build` fresco en local.
- `git diff` auditado contra backups timestamped.
- Commit: pendiente de la firma del Operador.

### Entorno inmutable verificado
- macOS 11.7.11 Big Sur · Node v20.20.2 (nvm) · pnpm 9.15.9 · Next 16.4.5
