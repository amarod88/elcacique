# VISIÓN DEL PRODUCTO MADURO — EL CACIQUE + TUPRIX

**Estado:** Visión a futuro. No implementado. Documento de intención estratégica.
**Fecha de declaración:** 2026-11-07

---

## 1. Alcance buscado con El Cacique (producto maduro)
El Cacique (maduro) empuja pedidos "listos para recoger" a una plataforma externa de logística. El cliente final depende de un pool de repartidores independientes. El negocio se enfoca en fabricar, no en gestionar flota propia.

## 2. Tuprix.com — Proyecto Paralelo (Independiente)
- **Naturaleza:** Marketplace de entregas en tiempo real, tipo Amazon Flex.
- **Stack:** PostgreSQL + PostGIS (geolocalización).
- **Lógica core:** Pool de órdenes activas → repartidores con rangos de entrega diarios las toman.
- **Construcción:** Desde cero, proyecto separado, lógica y requisitos propios.

## 3. Integración Futura: El Cacique → Tuprix
- **Punto de contacto:** Pedidos en estado `listo_para_entrega`.
- **Contrato (borrador):** `pedido_id`, `numero_orden`, `pickup_address`, `dropoff_address`, `cliente_nombre/telefono`, `peso`, `prioridad` + geocodificación a `GEOGRAPHY(Point)`.
- **Sincronización de estados** vía webhook o polling.

## 4. Roadmap Sugerido
| Fase | Proyecto | Entregable |
|---|---|---|
| MVP actual | El Cacique | Dashboard admin, inventario, POS, bajo pedido, PayPal. |
| Fase 2 | El Cacique | Historial cliente, seguridad PayPal server-side, ON CONFLICT. |
| Fase 3 | El Cacique | Estados de pedido, API de exportación. |
| Fase 4 | Tuprix | Documento fundacional, stack, PostGIS setup. |
| Fase 5 | Tuprix | MVP: pool de órdenes, matching por rango. |
| Fase 6 | Integración | El Cacique → Tuprix. |

## 5. Decisiones No Tomadas (Pendientes)
Monorepo vs repo separado, Supabase compartido vs separado, comisiones, otros comercios, app nativa vs PWA.

## 6. Principios Rectores
Separación de responsabilidades, independencia técnica, integración por contrato explícito, PostGIS como base geoespacial, escalabilidad.

**Fin del documento de visión.**
