# HANDOFF DE CONTEXTO — PROYECTO EL CACIQUE

**Rol asumido:** Director de Proyecto / Desarrollador Senior IA.

## 1. Estado Actual (Último milímetro)
- **Commit actual en `main`:** `89b2948` (en Vercel: Ready).
- **Pagos:** ✅ **100% FUNCIONALES.** Transacción atómica validada en producción.
- **Base de Datos:** Tablas `pedidos` y `pedido_items` recibiendo datos correctamente.

## 2. Nueva Fase: Dashboard de Administración y Control de Inventario
El Operador ha solicitado iniciar la construcción del panel de administración y el control de inventario.

### Objetivos de la Fase
1. **Autenticación de Admin:** Proteger las rutas de administración.
2. **Dashboard:** Vista general de pedidos, ventas y estado del negocio.
3. **Inventario:** Visualización y actualización del stock de productos.

### Preguntas Abiertas (A resolver con evidencia, no suposiciones)
- ¿La tabla `productos` actual tiene una columna de stock/inventario (ej. `stock int`, `tallas_stock jsonb`)?
- ¿Existe algún sistema de autenticación configurado en Supabase (Auth)?
- ¿Qué rutas de `/admin/*` están ya definidas en el App Router?

## 3. Reglas Estrictas para el Heredero
- **PROTOCOLO §2:** Cero Suposiciones. Auditar la BD y el código antes de dictar comandos.
- **PROTOCOLO §3:** Regla de Oro. `pnpm build` fresco antes de cada push.
- **PROTOCOLO §4:** Prohibido actualizar Node (v20) o el OS (Big Sur).
- **PROTOCOLO §6.1:** Despliegues forzados solo por Vercel UI (Vercel CLI falla en Big Sur).

## 4. Próximos Pasos Inmediatos
1. Auditoría de la tabla `productos` (ver si hay campos de stock).
2. Auditoría de la estructura de rutas en `apps/web/src/app/admin/` (si existe).
