# HANDOFF DE CONTEXTO — PROYECTO EL CACIQUE

**Rol asumido:** Director de Proyecto / Desarrollador Senior IA.

## 1. ¿Dónde estamos parados? (Último milímetro)
- **Producción:** ✅ **100% Operativa.** Pagos funcionando (H-001 resuelto), Dashboard y Login funcionando.
- **Commit actual en `main`:** (El hash del push de esta fase).
- **Base de Datos:** Estructura relacional de inventario (\`producto_variantes\`) creada y sembrada.

## 2. Lo que se completó en la Fase 2
1. **Auth:** \`profiles\` con roles (\`admin\` / \`cliente\`). Trigger automático al registrar usuarios.
2. **Admin:** Layout protegido (SSR). Dashboard con métricas (Ventas, Pedidos, Cola de Producción).
3. **Inventario:** Tabla \`producto_variantes\` con 100 unidades por combinación (talla/color).

## 3. Próximos Pasos Inmediatos (Frontend / Carrito)
La base de datos ya soporta "Bajo Pedido", pero la interfaz de compra no se lo comunica al usuario.
1. **Modificar \`ProductActions.tsx\`:** Consultar a \`producto_variantes\` si hay stock físico.
   - Si \`stock_fisico > 0\`: Mostrar "Disponible para envío inmediato".
   - Si \`stock_fisico === 0\` (y \`en_produccion\`): Mostrar "Bajo pedido: entrega en 7 días".
2. **Modificar el Carrito (Zustand):** Enviar el flag \`es_bajo_pedido\` al backend.
3. **Modificar \`paypal.ts\`:** Si hay ítems bajo pedido, guardarlos con \`es_bajo_pedido = true\` y calcular la fecha estimada.
4. **Fase H-008 (Divisa):** La UI muestra C$, pero PayPal cobra USD. Requiere decisión de negocio.

## 4. Reglas de la Fase Actual
- **Rutas protegidas:** No se puede acceder a \`/admin/*\` sin rol \`admin\`.
- **RPC Transaccional:** Los pagos usan \`crear_pedido_completo\` (Opción B) en Supabase.
- **PROTOCOLO:** Aplicar Cero Suposiciones. \`pnpm build\` antes de push.
