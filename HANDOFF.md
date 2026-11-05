# HANDOFF DE CONTEXTO — PROYECTO EL CACIQUE

**Rol asumido:** Director de Proyecto / Desarrollador Senior IA.

## 1. Estado Actual (Último milímetro)
- **Commit actual en `main`:** `0a9cf31` (en Vercel: Ready).
- **Pagos:** ✅ **100% Funcionales.** RPC atómico en producción.
- **Admin:** ✅ **Operativo.** Login SSR con cookies, Dashboard protegido y tabla de inventario visible.
- **Base de Datos:** Tabla `producto_variantes` creada y sembrada (100 unidades por talla/color del Top Médico).

## 2. Próxima Fase: Frontend "Bajo Pedido" + Carrito
El backend y la base de datos ya soportan la lógica de "Bajo Pedido" (`en_produccion`, `lead_time_dias`, `es_bajo_pedido` en pedido_items), pero el frontend (tienda pública) aún no está conectado a esta lógica.

### Objetivos Inmediatos
1. **`ProductActions.tsx`:** Consultar `producto_variantes` para verificar `stock_fisico`.
   - Si `stock_fisico > 0`: Mostrar stock disponible.
   - Si `stock_fisico === 0` (y `en_produccion`): Mostrar "Bajo pedido (7 días)".
2. **Carrito (Zustand):** Propagar el flag `es_bajo_pedido` al backend.
3. **`paypal.ts`:** Actualizar la llamada al RPC `crear_pedido_completo` para insertar el flag `es_bajo_pedido` y calcular la `fecha_entrega_estimada`.
4. **Fase H-008 (Divisa):** Sigue pendiente resolver C$ vs USD. Requiere decisión de negocio.

## 3. Reglas del Proyecto
- **PROTOCOLO §2 (Cero Suposiciones):** Usar SQL, logs o grep antes de dictar fixes.
- **PROTOCOLO §3 (Regla de Oro):** `pnpm build` exitoso antes de cada push.
- **PROTOCOLO §4:** Prohibido actualizar Node (v20) o macOS Big Sur.
- **PROTOCOLO §6.1:** Deploys forzados solo por Vercel UI (CLI falla en Big Sur).
