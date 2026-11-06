# HANDOFF DE CONTEXTO — PROYECTO EL CACIQUE

## 1. Estado Actual (Último milímetro)
- **Fase 3:** ✅ **Cerrada y certificada.** El flujo de compra (PayPal Sandbox), descuento de stock atómico y generación de tickets divididos (A, B, C) está funcionando al 100%.
- **Base de Datos:** Limpia (sin pedidos de prueba). Stock del Top Médico y Uniformes intacto (10 u/variante).
- **Rama:** `main` lista para iniciar Fase 4.

## 2. Próxima Fase: Auth y Dashboard (Fase 4)
El objetivo es construir el sistema de logins y el panel de administración.

### Tareas Inmediatas
1. **Auth (OAuth):**
   - Implementar login con Google, Facebook y Email/Password.
   - Pantallas de carga en `/auth/callback` para evitar pantallas en blanco.
   - Recuperación de contraseña (`/recuperar-password`).
2. **Vinculación de Pedidos:**
   - Asociar los pedidos al `usuario_id` cuando el cliente se loguea.
3. **Dashboard Admin:**
   - Métricas reales (ventas del día, pedidos pendientes).
   - Gestión del Libro Mayor de Inventario (trazabilidad de stock).

### Deudas Técnicas / Futuras
- **PayPal Producción:** Falta cuenta Business y habilitar tarjetas (ACDC).
- **CyberSource:** Esperando credenciales del banco para integrar JWT + 3DS.
- **Dominio Supabase:** Configurar Custom Domain en Supabase Pro para ocultar `supabase.co` en los logins sociales.

## 3. Lecciones Aprendidas
- **GRANTs:** Siempre otorgar permisos explícitos a `service_role` en tablas nuevas.
- **Next.js Cache:** Forzar `export const dynamic = 'force-dynamic'` en páginas que leen stock en tiempo real.
- **Carrito:** La llave de Zustand ahora incluye `esBajoPedido` para no fusionar ítems de stock con ítems de producción.

## 4. Reglas del Proyecto
- §2 Cero Suposiciones. §3 Regla de Oro (`pnpm build` verde antes de push). §4 Entorno inmutable. §6.1 Deploy por UI.
