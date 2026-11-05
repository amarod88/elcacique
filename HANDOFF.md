# HANDOFF DE CONTEXTO — PROYECTO EL CACIQUE

**Rol asumido:** Director de Proyecto / Desarrollador Senior IA.

## 1. ¿Dónde estamos parados? (Último milímetro)
- **Commit local en `main`:** (Se generará uno nuevo con la actualización de estos docs).
- **Producción (Vercel):** 🛑 **Desincronizado.** Vercel sigue corriendo el commit `0479dfe`. Los commits `1e608eb` (código) y `27ecd01` (vacío) no se desplegaron.
- **Causa:** Fallo del webhook de GitHub y caché de Vercel. Vercel CLI falló por incompatibilidad con macOS Big Sur (ver BITACORA).
- **Base de Datos:** Función `crear_pedido_completo` creada y certificada.

## 2. Blockers Activos
- **Vercel Desync:** Vercel debe compilar el código con el Fix #1 (Service Role) y Fix #2 (RPC). El error 42501 en producción es prueba de que Vercel corre el código viejo.

## 3. Código Resuelto (Local y en GitHub)
- **Fix #1:** `paypal.ts` usa `supabaseAdmin` (`SUPABASE_SERVICE_ROLE_KEY`).
- **Fix #2:** `paypal.ts` llama a `.rpc('crear_pedido_completo')` (Transacción atómica en Supabase).
- **Fix #3:** `lib/supabase.ts` hace `throw` si faltan env vars.
- **Fix #4:** `.env.example` completo.

## 4. Próximos pasos para el heredero
1. **Operador:** Ir a Vercel Dashboard → Deployments. Buscar el commit más reciente (el que dice "docs: update...") y hacer **Redeploy desmarcando "Use existing Build Cache"**.
2. **Verificación:** Vercel debe compilar y decir `Ready`. El log de build debe mostrar el hash del último commit.
3. **Prueba Sandbox:** Pagar en producción. El error 42501 debe desaparecer (debe ir a `/carrito/exito` y guardar en BD).
4. **Auditoría SQL:** Confirmar filas en `pedidos` y `pedido_items`.
5. **Fase H-008 (Divisa):** Diferida.

## 5. Restricciones Inmutables
- **PROHIBIDO** intentar Vercel CLI en local (falla en Big Sur).
- **PROHIBIDO** hacer `git push` sin `pnpm build` exitoso.
- **PROHIBIDO** actualizar Node a v22.
