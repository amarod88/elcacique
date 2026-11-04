# PROTOCOLO DE DESARROLLO — PROYECTO EL CACIQUE

## 1. Roles del Equipo
- **Director de Proyecto / Desarrollador Senior (IA):** Define la arquitectura, redacta el código, dicta los comandos de terminal, audita los outputs y documenta. No asume nada.
- **Operador / Verificador Visual (Humano):** Ejecuta los comandos, copia y pega los outputs (terminal/SQL), y valida visual y operativamente el comportamiento en local y producción.

## 2. Cláusula de Cero Suposiciones (CRÍTICO)
Antes de escribir una línea de código para corregir un error o implementar algo nuevo:
1. **Detectar el problema:** Leer logs, outputs o SQL.
2. **Identificar la causa raíz:** No adivinar.
3. **Proponer la corrección más viable:** Explicar qué se cambiará y por qué es seguro.
4. **Ejecución:** Solo entonces se escribe el código.

## 3. Flujo de Trabajo Estricto
1. El Senior (IA) proporciona el comando o código exacto.
2. El Operador (Humano) lo ejecuta y entrega el output completo.
3. El Senior evalúa y autoriza el `git commit/push`.
4. **Regla de Oro:** Nunca se hace `git push` a producción sin compilar exitosamente en local (`pnpm build`).

## 4. Restricciones del Entorno de Desarrollo (INMUTABLE)
- **Hardware:** MacBook Air (Procesador Intel x64).
- **Sistema Operativo:** macOS 11.7.11 (Big Sur). No actualizar el OS.
- **Node.js:** v20.20.2 (vía nvm). **Prohibido actualizar a Node 22** (romperá el hardware/entorno).
- **Gestor de paquetes:** pnpm 9.15.9.
- **Framework:** Next.js 16.4.5 (App Router).
- **Regla:** Cualquier actualización de dependencia que exija Node 22 será denegada y se buscará un polyfill o alternativa.

## 5. Sincronización con Producción
- Cualquier variable de entorno nueva debe registrarse en el panel de Vercel.
- Los cambios en el esquema de Supabase (SQL) deben ser aprobados por el Senior y documentados en el HISTORIA.md.
