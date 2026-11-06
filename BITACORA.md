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

## [2026-11-05 00:25 CST] — Diagnóstico del INSERT fallido en producción (H-001 confirmada)

### Contexto
Continuación del refinamiento de PROTOCOLO (§3.6 + §5.4 ya aplicados y desplegados en `5e92507`). Se entra al diagnóstico del blocker activo: en producción (Vercel), tras pago exitoso en PayPal Sandbox, el INSERT en Supabase falla y el frontend muestra "Hubo un error al guardar su pedido".

### Evidencia SQL recogida (Supabase SQL Editor)
- **[1A]** `SELECT * FROM pedidos` / `pedido_items` → `No rows returned`. `pedidos=0`, `pedido_items=0`.
- **[1B]** Conteos certificados: `pedidos=0`, `pedido_items=0`. **Ningún INSERT persistió.**
- **[1C] Constraints:**
  - `pedido_items.pedido_id → pedidos.id ON DELETE CASCADE` (FK)
  - `pedido_items.producto_id → productos.id` (FK, sin cascade)
  - `pedidos.usuario_id → auth.users.id` (FK)
  - `pedidos.paypal_order_id` UNIQUE
- **[1D] RLS (HALLAZGO CRÍTICO):**
  - `pedidos`: RLS ON. Única política INSERT → **solo `service_role`**.
  - `pedido_items`: RLS ON. **CERO políticas** → cualquier INSERT con rol `anon`/`authenticated` falla con SQLSTATE 42501.
- **[1E] Columnas:** `pedidos.usuario_id` nullable (checkout anónimo OK), `pedido_items.cantidad`/`precio_unitario` NOT NULL, `numeric` sin scale (sin overflow posible), `pedidos.paypal_order_id` nullable.

### Evidencia de código (lectura dirigida §3.6 Escenario B)
- **`apps/web/src/app/actions/paypal.ts`:**
  - Importa `supabase` desde `../../lib/supabase` (línea 5).
  - INSERT #1 en `pedidos` (líneas 75-88): captura `errorPedido` y hace **`throw`** si falla.
  - INSERT #2 en `pedido_items` (línea 100): captura `errorItems` pero **NO hace `throw`**, solo `console.error`. Retorna `{ success: true }` igualmente → **venta huérfana latente**.
  - Divisa **hardcodeada**: `moneda: 'USD'` (línea 79).
- **`apps/web/src/lib/supabase.ts`:**
  - `createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)` → rol **`anon`** en Postgres.
  - Fallback silencioso: si falta env var, usa `'https://placeholder.supabase.co'` con `console.warn` (no `throw`). **Bomba de tiempo que enmascara errores de config.**
- **`.env.example`:** NO documenta vars Supabase. Viola §5.2.

### Causa raíz certificada — H-001 CONFIRMADA
Cadena causal completa:
1. `capturePayPalOrder` inserta en `pedidos` con cliente `anon`.
2. RLS activo en `pedidos`, única política INSERT `service_role`.
3. Postgres rechaza con `SQLSTATE 42501` (RLS violation).
4. `errorPedido` no nulo → `throw` → alert "Hubo un error al guardar su pedido".
5. INSERT #2 nunca se ejecuta (0 filas en ambas tablas).

### Bugs latentes confirmados (no bloquean, pero deben resolverse)
- **H-007:** `pedido_items` silencia error (sin `throw`, sin rollback).
- **H-008:** `moneda: 'USD'` hardcodeado, UI en C$. Bug de negocio.
- **D-009:** `.env.example` sin vars Supabase.
- **D-011:** fallback `'placeholder'` en `lib/supabase.ts` enmascara errores.

### Decisión arquitectónica del Operador
**Opción B elegida:** migrar `paypal.ts` a `service_role` server-side. Motivo: patrón oficial Supabase para operaciones de pago, cierra el vector de ataque de Opción A (anon key expuesto en bundle público), no requiere cambios en RLS.

### Estado al cierre de esta sesión
- **Diagnóstico:** ✅ cerrado (certificado arriba).
- **Fix de código (Option B + parches):** 🟡 pendiente (próxima sesión).
- **Build & push de esta sesión:** solo documentación (BITACORA + HANDOFF).
- **SQL de RLS:** NO se aplican políticas nuevas (Opción B bypassea RLS). RLS queda intacto.

### Próximos pasos (herederos)
1. **Operador:** confirmar/crear `SUPABASE_SERVICE_ROLE_KEY` en `.env.local` y en Vercel (Production + Preview + Development).
2. **Director (próxima sesión):** leer HANDOFF actualizado + 3 maestros.
3. **Director:** dictar Fix #1 (cliente admin `supabase-admin.ts` + parche `paypal.ts`).
4. **Director:** dictar Fix #2 (`throw` en `errorItems` + manejo rollback — decisión a consultar).
5. **Director:** dictar Fix #3 (`throw` en fallback de `lib/supabase.ts`).
6. **Director:** dictar Fix #4 (`.env.example` completo).
7. **Operador:** `pnpm build` (Regla de Oro) + auditoría 14 rutas.
8. **Commit + push** del bloque de fixes (Fix #1–#4).
9. **Verificación end-to-end** en producción (Sandbox → capture → INSERT → fila visible en `pedidos` y `pedido_items`).
10. **Fase separada:** H-008 (divisa C$/USD) — análisis y decisión de conversión.

### Entorno inmutable verificado
- macOS 11.7.11 Big Sur · Node v20.20.2 (nvm) · pnpm 9.15.9 · Next 16.4.5
- Commit de origen de esta sesión de diagnóstico: `5e92507` (en `origin/main`, Vercel `Ready`).

## [2026-11-05 12:14 CST] — Fixes #1 y #2 (Opción B): Migración a Service Role + Transacción Atómica RPC

### Contexto
Resolución del blocker H-001 (INSERT fallido por RLS). Se implementó la Opción B elegida por el Operador: migrar a `service_role` server-side y reemplazar los dos INSERTs separados por una función atómica en PostgreSQL.

### Cambios implementados
- **Fix #1 (Service Role):** Creado `apps/web/src/lib/supabase-admin.ts` (cliente con `SUPABASE_SERVICE_ROLE_KEY`, solo server-side). Modificado `paypal.ts` para usar `supabaseAdmin` en vez de `supabase`.
- **Fix #2 (Transacción Atómica):** Creada función SQL `public.crear_pedido_completo` con `SECURITY DEFINER`. Modificado `paypal.ts` para llamar a `.rpc('crear_pedido_completo', {...})`. Si falla el insert de los items, PostgreSQL hace ROLLBACK automático (cero ventas huérfanas).
- **Fix #3 (D-011):** `lib/supabase.ts` ahora lanza un `throw` si faltan las variables de entorno (fallo ruidoso, no silencioso).
- **Fix #4 (D-009):** Creado `apps/web/.env.example` con placeholders de todas las variables necesarias (PayPal, Supabase, Groq).

### Verificado
- SQL ejecutado en Supabase: `Success. No rows returned`.
- Código de `paypal.ts` inspeccionado: cero llamadas a `.insert()` directas, usa solo `.rpc()`.
- `.env.local` contiene `SUPABASE_SERVICE_ROLE_KEY` (219 chars, certificado).
- Build: pendiente de certificación en este bloque.

## [2026-11-05 12:47 CST] — Vercel CLI falla en Big Sur + Blocker de sincronización de Webhook

### Contexto
El código del Fix #1 (Service Role) y Fix #2 (RPC) está en GitHub (`1e608eb` y `27ecd01`), pero Vercel sigue compilando el commit viejo (`0479dfe`). Los logs de Runtime demuestran que Vercel sigue ejecutando la versión con `anon` (error 42501).

### Intentos de solución
- `git commit --allow-empty` + push: Falló (Vercel ignoró el commit vacío).
- `pnpm dlx vercel@latest --prod`: Falló con `dyld: Symbol not found: _SecTrustCopyCertificateChain`. Causa: Vercel CLI v65 usa `esbuild` que ya no es compatible con macOS 11 (Big Sur). Prohibido actualizar OS por §4.

### Plan
- Se actualizan los 4 archivos maestros con este hallazgo (commit real) para forzar a Vercel a detectar el push.
- Se requiere Redeploy Manual desde la UI de Vercel, desmarcando "Use existing Build Cache".

## [2026-11-05 12:57 CST] — ✅ CIERRE DE FASE: H-001 Erradicado. Pago End-to-End Exitoso.

### Hito Alcanzado
El flujo completo de pago en producción (Vercel) funciona correctamente. La pantalla `/carrito/exito` se renderiza sin errores. El INSERT atómico en Supabase se completó.

### Certificación Técnica
- Vercel desplegó el commit `89b2948` (Ready).
- El build forzado manualmente desde la UI resolvió el desfase del webhook.
- La base de datos ahora contiene pedidos con sus respectivos items (cero ventas huérfanas).

### Deuda Técnica Pendiente (Fase Futura)
- **H-008 (Divisa):** El frontend muestra C$ pero PayPal procesa USD (hardcodeado en `paypal.ts`). Requiere análisis de negocio y conversión.

### Próxima Fase Iniciada
- Dashboard de Administración y Control de Inventario.

## [2026-11-05 16:03 CST] — ✅ Fase 2: Dashboard Admin y Control de Inventario

### Hito Alcanzado
- Autenticación SSR configurada con `@supabase/ssr`.
- Rutas de admin protegidas (`/admin/dashboard`, `/admin/inventario`).
- Layout de Admin con Sidebar y botón de Cerrar Sesión.
- Tabla de inventario conectada a la BD (mostrando las 42 variantes sembradas).

### Arquitectura de Base de Datos
- Tabla `profiles` creada (vinculada a `auth.users`, con roles `cliente` y `admin`).
- Tabla `producto_variantes` creada para inventario relacional (talla/color/stock).
- `pedido_items` actualizada con columnas `es_bajo_pedido` y `fecha_entrega_estimada`.

### Próximos Pasos (Frontend y Carrito)
- El backend ya soporta "Bajo Pedido", pero el frontend (Carrito) sigue cobrando normal.
- Falta actualizar `ProductActions.tsx` y el flujo del carrito para mostrar el aviso de "Bajo Pedido (7 días)" cuando no haya stock físico.
- Falta la Fase H-008 (Divisa C$/USD).

## [2026-11-05 17:25 CST] — ✅ CIERRE DE FASE 2: Dashboard Admin y Auth Operativos

### Hito Alcanzado
Se resolvieron los bloqueos de autenticación (bucle de redirección, falta de cookies, recursión de RLS y falta de GRANTs). El usuario administrador (`admin@elcacique.net`) puede iniciar sesión y visualizar el Dashboard y la tabla de Inventario con las 42 variantes.

### Fixes aplicados
- `createBrowserClient` en `lib/supabase.ts` para persistir sesión en cookies.
- Función `is_admin()` y `GRANT SELECT ON profiles TO authenticated` en Supabase.
- Layout movido a Route Group `(panel)` para aislar el `/admin/login`.
- Eliminación del código de debug en producción (commit `0a9cf31`).

## [2026-11-05 17:26 CST] — Fix: Dashboard Admin mostrando ceros por falta de GRANTs

### Diagnóstico
El Dashboard Admin mostraba 0 ventas, 0 pedidos y 0 inventario a pesar de que la base de datos tenía 42 variantes y 2 items de pedidos. 
Causa: El rol `authenticated` no tenía permisos de `SELECT` (solo TRUNCATE/TRIGGER) en las tablas `pedidos`, `pedido_items` y `producto_variantes`. Además, la política RLS de `pedidos` solo permitía ver los pedidos propios.

### Solución Aplicada
- `GRANT SELECT` a `authenticated` en las 3 tablas.
- Nuevas políticas RLS usando `is_admin()` para permitir al Administrador leer todos los pedidos e items.

## [2026-11-05 — Reframe de Fase 3: de "conectar frontend" a "control de inventario con trazabilidad"]

### Contexto
El alcance original de Fase 3 ("conectar ProductActions con variantes") era precondición técnica, no el fin. El Operador expuso la visión completa: control de inventario inmutable, libro mayor de movimientos, modelo de 3 estados de disponibilidad, dos pools de producción (MTO 7d + Alta Rotación 48h), roles admin/superadmin, RMA por defecto de fábrica, y métricas/alertas accionables. Se acota Fase 3 al lazo mínimo (venta -> decremento stock -> dashboard) y se abre Fase 4 (Libro Mayor + Dashboard) y Fase 5 (Superadmin).

### Decisiones cerradas (N1-N14)
- N5: alta rotación con stock=0 -> bloquear pago, ofrecer reposición 48h. MTO separado.
- N7: umbral stock bajo = 10 global (override futuro).
- N8: anulación -> reversión auto + notificación superadmin + registro.
- N9: devoluciones NO reingresan auto; cuarentena -> reparado/descartado.
- N10: comisión POS = gasto empresa, no al cliente.
- N11/N13: 3 usuarios QA en producción, creados manualmente por Operador.
- N12: descuento de stock post-pago (dentro del RPC atómico).
- N14: escenarios QA (A stock, B agotado, C anulación).

### Hallazgos §3.6 (lectura dirigida)
- Admin actual mínimo: 5 archivos, 0 componentes reutilizables. Fase 4 construye desde base.
- `producto_variantes`: solo `MED-TOP-001` tiene 42 variantes sembradas (4200u). El resto del catálogo NO tiene variantes -> D1 default = bajo_pedido.
- RPC `crear_pedido_completo` actual NO descuenta stock, NO conoce `es_bajo_pedido`/`lead_time_dias`/`fecha_entrega_estimada`. Requiere migración.
- `productos` NO tiene `tipo_disponibilidad` ni `tiempo_reposicion_horas`. ALTER en Fase 3.1.

### Entorno inmutable verificado
macOS 11.7.11 · Node v20.20.2 · pnpm 9.15.9 · Next 16.4.5 · HEAD `8d0fa89` · build verde certificado.

## [2026-11-05 — Cierre Fase 3: Lógica Bajo Pedido y Sub-Tickets Certificados]

### Hitos Alcanzados
- **Lógica de división de carrito:** Si un cliente pide más unidades de las que hay en stock, el sistema separa la orden (ej. 10 en stock inmediato, 5 en producción).
- **Sub-tickets de Entrega (Fulfillment):** La pantalla de éxito ahora agrupa los ítems por fecha, generando códigos de entrega tipo `EC-2026-0001-A` (retiro inmediato) y `EC-2026-0001-B` (producción 48h/7d).
- **Permisos (GRANTs):** Se otorgaron permisos a `service_role` sobre las tablas `pedidos` y `pedido_items` para que el backend pueda leer y renderizar los tickets.
- **PayPal Sandbox:** Prueba end-to-end exitosa. El pago se procesa, el stock baja atómicamente y el ticket se muestra al cliente.

### Decisiones y Deudas Técnicas
- **Pagos:** Se validó el flujo Sandbox. Para pasar a producción, se requiere cuenta Business, habilitar ACDC (tarjetas) y cambiar credenciales en Vercel.
- **CyberSource:** Se revisó la documentación del banco (JWT + 3DS). Queda diferido hasta que el ejecutivo del banco entregue credenciales.
- **Auth:** Se planificó la Fase 4.0 (OAuth Google/Facebook + Email/Pass). Queda pendiente.
- **Limpieza QA:** Se ejecutó el protocolo de limpieza para restaurar stock y borrar pedidos de prueba.
