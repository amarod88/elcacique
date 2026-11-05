# HANDOFF DE CONTEXTO — PROYECTO EL CACIQUE

**Rol asumido:** Director de Proyecto / Desarrollador Senior IA.
**Regla inquebrantable:** Leer PROTOCOLO.md, HISTORIA.md y BITACORA.md antes de ejecutar cualquier acción. Aplicar estrictamente la Cláusula de Cero Suposiciones (§2) y la Regla de Oro de compilación (§3).

## 1. ¿Dónde estamos parados? (Último milímetro)
- **Commit actual en `main`:** `c288866` (Fix PayPal + Docs).
- **Producción (Vercel):** Deploy `Ready` del commit `c288866`. Env vars de PayPal y Supabase configuradas.
- **Local:** Compila limpio (`pnpm build` exit 0, 14 rutas). `createPayPalOrder` corregido y certificado (crea orden 201 en Sandbox).
- **Base de Datos:** Tablas `pedidos` y `pedido_items` auditadas y en 0 filas previo a la prueba.

## 2. El Bloqueante Actual (Fase Sandbox en Producción)
Durante la prueba de compra end-to-end en Vercel:
1. **PayPal (Éxito):** El usuario completó el pago en la pasarela Sandbox.
2. **Frontend (Error):** Al retornar a `/carrito`, saltó el alert: "Hubo un error al guardar su pedido. Por favor, contacte a soporte."
3. **Conclusión:** El cobro en PayPal se ejecutó, pero la persistencia en Supabase (INSERT en pedidos o pedido_items desde capturePayPalOrder) falló.

### Bandera Roja de Arquitectura Detectada
- El payload hacia PayPal se envió en **USD** (`5244.00`), pero la interfaz del carrito muestra los precios en **Córdobas (C$)**.
- **Hipótesis:** El backend está forzando `currency_code: 'USD'` en `paypal.ts` sin convertir los montos de la BD.

## 3. Los 3 Pasos Inmediatos para el Nuevo Agente
El nuevo Agente sigue `PROTOCOLO.md` §3.6 para lectura de código fuente: verificación dirigida con objetivo declarado. Prohibida la exploración sin objetivo. Debe dictar lo siguiente:

1. **Auditoría SQL (Cero Suposiciones):** Solicitar al Operador que ejecute en Supabase SQL Editor:
   SELECT * FROM pedidos ORDER BY created_at DESC LIMIT 5;
   SELECT * FROM pedido_items ORDER BY created_at DESC LIMIT 5;
   *Objetivo:* Certificar si el pedido se guardó parcialmente, si está vacío, o si falló por un constraint (RLS o FK).

2. **Diagnóstico del Error en Servidor:** Si el SQL da 0 filas, dictar la revisión de los logs de Vercel (Runtime Logs) o pedir al Operador que busque el POST /carrito que falló y copie el JSON del error exacto que Supabase devolvió.

3. **Resolución de la Divisa:** Revisar `apps/web/src/app/actions/paypal.ts` y la tabla productos para determinar cómo se maneja la moneda (USD vs C$) y alinear el precio.

## 4. Restricciones Inmutables
- **Entorno:** Node v20.20.2, macOS Big Sur. Prohibido sugerir Node 22.
- **Credenciales:** Prohibido pedir valores reales. Usar placeholders.
- **Protocolo Git:** No autorizar `git push` sin `pnpm build` exitoso.
