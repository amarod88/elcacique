# HANDOFF DE CONTEXTO — PROYECTO EL CACIQUE

**Rol asumido:** Director de Proyecto / Desarrollador Senior IA.
**Regla inquebrantable:** Leer PROTOCOLO.md, HISTORIA.md y BITACORA.md antes de ejecutar cualquier acción. Aplicar estrictamente la Cláusula de Cero Suposiciones (§2) y la Regla de Oro de compilación (§3).

## 1. ¿Dónde estamos parados? (Último milímetro)
- **Commit actual en `main`:** `5e92507` (docs: refine code-source access §3.6 + pnpm dlx policy §5.4).
- **Producción (Vercel):** Deploy `Ready` del commit `5e92507`.
- **Local:** Build certificado (`pnpm build` exit 0, 14 rutas — ver BITACORA [4-Nov] Refinamiento).
- **Base de Datos:** `pedidos=0`, `pedido_items=0` al cierre de la sesión de diagnóstico (ambas tablas vacías, ningún INSERT persistió).

## 2. Blocker del INSERT fallido — DIAGNÓSTICO CERRADO
**Causa raíz certificada — H-001 CONFIRMADA:**

1. `capturePayPalOrder` (en `apps/web/src/app/actions/paypal.ts`) usa el cliente `supabase` importado de `../../lib/supabase`.
2. Ese cliente se construye con `NEXT_PUBLIC_SUPABASE_ANON_KEY` → rol `anon` en Postgres.
3. Tabla `public.pedidos`: RLS ON, única política INSERT para `service_role`.
4. Postgres rechaza el INSERT con `SQLSTATE 42501` (RLS violation).
5. `errorPedido` no nulo → `throw` → frontend: "Hubo un error al guardar su pedido".
6. INSERT #2 en `pedido_items` nunca se ejecuta → 0 filas en ambas tablas.

**Evidencia completa (SQL + código) registrada en BITACORA `[5-Nov] — Diagnóstico del INSERT fallido en producción (H-001 confirmada)`.**

## 3. Decisión arquitectónica del Operador
**Opción B (elegida):** migrar `paypal.ts` a `service_role` server-side.

- Motivo: patrón oficial Supabase para pagos; cierra el vector de ataque de Opción A (anon key expuesto en bundle público); no requiere cambios en RLS (service_role bypassea).
- La decisión de diseño fue tomada por el Operador al cierre de la sesión de diagnóstico del 5-Nov.

## 4. Plan de implementación (próxima sesión)

Los fixes se aplican en un bloque, con `pnpm build` + commit + push únicos (Regla de Oro). Fix #5 queda diferido a fase separada.

### Fix #1 — Cliente `service_role` server-side (resuelve H-001)
- **Operador (paso previo):** confirmar/crear `SUPABASE_SERVICE_ROLE_KEY` en `.env.local` y en Vercel (3 entornos).
- **Director:** dictar `apps/web/src/lib/supabase-admin.ts` con `createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)`. **Nunca importado en componentes cliente.**
- **Director:** dictar parche en `paypal.ts` → importar `supabaseAdmin` para los 2 INSERTs.

### Fix #2 — `throw` en `errorItems` + manejo rollback (resuelve H-007)
- **Director:** dictar parche en `paypal.ts`. Si `errorItems` no nulo → `throw` + (ideal) DELETE del `pedido` padre para evitar venta huérfana. **Decisión a consultar con el Operador en próxima sesión:** ¿rollback destructivo (DELETE) vs compensación con marca `estado='error'`?**

### Fix #3 — `throw` en fallback de `lib/supabase.ts` (resuelve D-011)
- **Director:** dictar parche → `throw new Error(...)` en vez de `console.warn` + placeholder `'placeholder'`.

### Fix #4 — `.env.example` completo (resuelve D-009)
- **Director:** dictar append de las 2 vars Supabase + `SUPABASE_SERVICE_ROLE_KEY` con placeholders.

### Fix #5 (DIFERIDO a fase separada) — Divisa C$/USD (resuelve H-008)
- No se toca en la misma sesión. Requiere análisis de producto: ¿precio de BD está en C$ o USD? ¿PayPal opera en USD con conversión explícita? ¿O se migra todo a NIO?

## 5. Pasos del Operador para la próxima sesión
1. Al abrir nueva sesión, confirmar al Director que `SUPABASE_SERVICE_ROLE_KEY` existe en `.env.local` y en Vercel (3 entornos).
2. Director leerá este HANDOFF + los 3 maestros antes de dictar cualquier comando.
3. Director dictará Fixes #1–#4 con backup + diff + `pnpm build` + commit + push (Regla de Oro).
4. **Verificación end-to-end:** compra Sandbox en producción → confirmar filas visibles en `pedidos` y `pedido_items` vía SQL audit post-fix.
5. Fase separada: H-008 (divisa C$/USD) — análisis y decisión.

## 6. Bugs latentes anotados (no bloquean Fix #1, pero deben resolverse)
- **H-007:** `pedido_items` silencia error (`console.error` sin `throw`). Venta huérfana si items falla tras Fix #1.
- **H-008:** `moneda: 'USD'` hardcodeado, UI en C$. Bug de negocio (fase separada).
- **D-009:** `.env.example` sin vars Supabase (viola §5.2).
- **D-011:** fallback `'placeholder'` en `lib/supabase.ts` enmascara errores de config (viola el espíritu de §2 Cero Suposiciones).

## 7. Restricciones Inmutables
- **Entorno:** Node v20.20.2, macOS Big Sur. Prohibido sugerir Node 22.
- **Credenciales:** Prohibido pedir valores reales. Usar placeholders (§2.1).
- **Protocolo Git:** No autorizar `git push` sin `pnpm build` exitoso (§3 Regla de Oro).
- **PROTOCOLO §3.6 (nueva):** lectura de código dirigida permitida con objetivo declarado (Escenario A o B).
- **PROTOCOLO §5.4 (nueva):** escalera `pnpm exec` → `pnpm dlx <pkg>@<x.y.z>` → `npx --yes --package=<pkg>@<x.y.z>` (nunca `-g`).
