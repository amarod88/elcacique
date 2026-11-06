# HANDOFF DE CONTEXTO — PROYECTO EL CACIQUE

## 1. Estado Actual (Último milímetro)
- **Commit en `main`:** (Se actualizará tras el push).
- **Dominio:** `elcacique.net` comprado y conectado en Vercel.
- **Auth:** Login operativo (Google, Facebook en local, Email/Pass).
- **UI/UX:** Hero del Home reconstruido (limpio, B2C), buscador conectado a Supabase, filtros móviles operativos.
- **Pagos/Inventario:** 100% funcionales (Fase 3 cerrada).

## 2. Próximos Pasos Inmediatos
1. **Verificación de Meta (Facebook):** Crear el Portafolio Comercial y verificar la empresa para permitir logins de clientes reales.
2. **Afinar UI/UX:** Revisar tipografías, espaciados y contraste en el Home, Catálogo y Carrito.
3. **Pruebas con Cliente:** Entregar credenciales de admin y dominio al cliente para su visto bueno.

## 3. Lecciones Aprendidas
- **Hero limpio:** Mantener los textos en `page.tsx` y usar los componentes de fondo (como `HeroVideo`) sin contenido hardcodeado para evitar superposiciones.
- **Auth Callback:** El flujo de OAuth requiere que los orígenes y callbacks estén configurados tanto en Supabase como en Google/Meta.
- **Next.js Caché:** Siempre limpiar `.next` tras cambios grandes en Server Components.

## 4. Reglas del Proyecto
- §2 Cero Suposiciones. §3 Regla de Oro (`pnpm build` verde antes de push). §4 Entorno inmutable. §6.1 Deploy por UI.
