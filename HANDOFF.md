# HANDOFF DE CONTEXTO — PROYECTO EL CACIQUE

## 1. Estado Actual (Último milímetro)
- **Fase Actual:** Fase 1 (Experiencia de Cliente) al 90%.
- **Auth & Perfiles:** Login con Google/Facebook/Email operativo. Tabla `profiles` actualizada con `telefono` y `direccion`. Formulario de "Checkout Gate" implementado en el carrito para capturar datos faltantes.
- **UI/UX:** Header con menú de usuario (dropdown). El diseño del Home tiene el video encapsulado en un banner, carrusel de favoritos rotativo y botones de categorías/promociones.
- **Inventario:** 121 variantes sembradas. El RPC `crear_pedido_completo` descuenta stock automáticamente.

## 2. Próximos Pasos (Instrucciones para el Heredero)
1.  **Escuchar al Operador:** Él tiene observaciones pendientes sobre el flujo de compra actual (Fase 1). Corregirlas antes de avanzar.
2.  **Fase 2 (El Centro de Mando - CRÍTICO):**
    *   **Pestaña Facturación (POS):** Catálogo ordenado alfabéticamente para ventas locales (Efectivo, Transferencia, POS). Descuenta stock.
    *   **Pestaña Órdenes de Producción:** Agrupa pedidos bajo pedido y reposición 48h.
    *   **Pestaña Control de Inventario:** Protegida por un PIN de seguridad (Modo Supervisor) para sembrar stock, requisas y mermas.
    *   **Pestaña Métricas:** KPIs básicos (Ventas del día, Pedidos Web, Alertas de Stock).

## 3. Reglas del Proyecto
- §2 Cero Suposiciones. §3 Regla de Oro (`pnpm build` verde antes de push). §4 Entorno inmutable (Node v20, Big Sur).


---
## Actualización [2026-11-06] — Cierre de Bloque UI/UX (Header + Catálogo)

### Estado
- **Build certificado:** 22/22 rutas generadas, exit status 0.
- **Header.tsx refactorizado:** Mega-Menú full-width, menú de usuario con cierre por fuera, icono de Home en nav central, categoría "Médicos" añadida.
- **Catálogo sincronizado:** `useEffect` con `useSearchParams` para reflejar cambios de URL desde el Header.
- **Bug resuelto (black box debug):** `handleClickOutside` (mousedown) desmontaba el menú antes del `click` del `<Link>`. Fix: `menuPanelRef` excluido del cierre exterior.
- **Bug resuelto (build):** `useSearchParams` en Header requiere `<Suspense>` en layout raíz. Añadido fallback `h-20`.

### Próximos Pasos
1. **Checkout Gate:** revisar observaciones UI/UX pendientes del Operador.
2. **Fase 2 (Dashboard Admin):** reactivar cuando se cierre la Fase 1.

### Deudas sin cambio
- H-008 (divisa C$/USD en PayPal hardcodeado).
- OAuth Facebook en producción (pendiente Portafolio Comercial Meta).
