# HANDOFF DE CONTEXTO — PROYECTO EL CACIQUE

## 1. Estado Actual (Último milímetro)
- **Commit en `main`:** `8d0fa89` (Vercel: Ready).
- **Pagos:** OK 100% funcionales. RPC atómico `crear_pedido_completo` en producción.
- **Admin:** OK Login SSR, Dashboard, Inventario (5 archivos, mínimo).
- **BD:** `producto_variantes` con 42 variantes de `MED-TOP-001` (4200u). Resto del catálogo sin variantes sembradas.

## 2. Fase 3 en curso — Bajo Pedido end-to-end
### 3 commits secuenciales
1. **docs** — este bloque.
2. **SQL 3.1** — ALTER `productos` + `CREATE OR REPLACE FUNCTION crear_pedido_completo` con decremento de stock.
3. **code 3.2/3.3** — `cart.ts`, `ProductActions.tsx`, `paypal.ts`.

### Máquina de 6 estados
Ver HISTORIA §7.2.

### Pruebas QA
3 usuarios `qa-N@elcacique.net` en `auth.users`. Escenarios: A stock, B agotado, C anulación. Sandbox PayPal en producción. **Protocolo de limpieza al cierre.**

## 3. Próximas fases (declaradas, no construidas)
- **Fase 4:** Libro Mayor (`movimientos_inventario`), Dashboard Admin con KPIs accionables, RMA, reporte producción acumulada.
- **Fase 5:** Superadmin (roles, precios, categorías, descuentos, auditoría).
- **Fase 6:** Módulo Control de Producción (onboarding, dos equipos).

## 4. Lecciones Aprendidas
- **GRANTs:** tras crear tabla, `GRANT ... TO authenticated` o falla silencioso.
- **RLS admin:** `is_admin()` explícito en tablas que el admin debe leer todo.
- **Vercel CLI:** falla en Big Sur. Deploy manual por UI, sin caché.
- **RPC atómico:** cero ventas huérfanas. Nunca volver a INSERTs separados.

## 5. Reglas del Proyecto
- §2 Cero Suposiciones. §3 Regla de Oro (`pnpm build` verde antes de push). §4 Entorno inmutable. §6.1 Deploy por UI.
- §3.6 lectura de código permitida con declaración de objetivo. §5.4 escalera de 3 peldaños. Prohibido `-g`.
