# HANDOFF DE CONTEXTO — PROYECTO EL CACIQUE

**Rol asumido:** Director de Proyecto / Desarrollador Senior IA.
**Regla inquebrantable:** Leer PROTOCOLO.md, HISTORIA.md y BITACORA.md antes de ejecutar cualquier acción. Aplicar estrictamente la Cláusula de Cero Suposiciones (§2) y la Regla de Oro de compilación (§3).

## 1. ¿Dónde estamos parados? (Último milímetro)
- **Commit actual en `main`:** (Pendiente de push tras esta fase).
- **Producción (Vercel):** Deploy `Ready` del commit `0479dfe`. Env vars de Supabase actualizadas con `SUPABASE_SERVICE_ROLE_KEY`.
- **Local:** Código con Fix #1, #2, #3 y #4 implementados. Build en certificación.
- **Base de Datos:** Función `public.crear_pedido_completo` creada y certificada.

## 2. Blockers Activos
- **Ninguno bloqueante de código.** El bug H-001 está resuelto arquitectónicamente.
- **Pendiente:** Verificación end-to-end en producción (compra Sandbox → capture → INSERT atómico).
- **Fase futura (H-008):** Divisa C$/USD hardcodeada en `paypal.ts` (`moneda: 'USD'`).

## 3. Lo que se ha resuelto (Fixes #1 al #4)
- **Fix #1 (Service Role):** `paypal.ts` usa `supabaseAdmin` (`SUPABASE_SERVICE_ROLE_KEY`) para INSERTs. Bypassea RLS correctamente.
- **Fix #2 (Transacción Atómica):** `paypal.ts` llama a `.rpc('crear_pedido_completo')`. El SQL maneja los dos INSERTs en un bloque `BEGIN...COMMIT`, garantizando integridad total (sin ventas huérfanas).
- **Fix #3 (Fallo ruidoso):** `lib/supabase.ts` ahora lanza un `throw` si faltan env vars. Ya no usa `'placeholder'` silencioso.
- **Fix #4 (`.env.example`):** Creado con las variables canónicas.

## 4. Próximos pasos para el heredero
1. Verificar Vercel Deploy `Ready` tras el push.
2. **Verificación end-to-end:** Simular compra en Sandbox en producción.
3. **Auditoría SQL post-prueba:** Confirmar que `pedidos` y `pedido_items` ahora tienen filas (y que los datos coinciden).
4. **Fase H-008 (Divisa):** Analizar cómo convertir los montos de C$ a USD o cambiar la moneda en BD, para que lo que el usuario paga coincida con lo que ve.

## 5. Restricciones Inmutables
- **Entorno:** Node v20.20.2, macOS Big Sur. Prohibido sugerir Node 22.
- **Credenciales:** Prohibido pedir valores reales. Usar placeholders (§2.1).
- **Protocolo Git:** No autorizar `git push` sin `pnpm build` exitoso (§3 Regla de Oro).
- **PROTOCOLO §3.6 (nueva):** lectura de código dirigida permitida con objetivo declarado.
- **PROTOCOLO §5.4 (nueva):** escalera `pnpm exec` → `pnpm dlx <pkg>@<x.y.z>` → `npx --yes --package=<pkg>@<x.y.z>` (nunca `-g`).
