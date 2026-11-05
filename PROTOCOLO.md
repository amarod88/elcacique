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

### 2.1. Política de manejo de credenciales (NO NEGOCIABLE)
- **Nunca** se escriben valores reales de secrets/API keys/client IDs en el chat, en comandos dictados por el Director, ni en bitácoras.
- El Director **siempre** usa placeholders de referencia: `pega-tu-client-id-aqui`, `pega-tu-secret-aqui`, `[tu-valor]`.
- La certificación de credenciales se realiza **sin revelar el valor** mediante:
  1. `git check-ignore` → protección del archivo.
  2. Verificación de longitud + prefijo parcial (ej. `Ae… · 80 chars`).
  3. Prueba funcional contra la API externa (ej. OAuth PayPal) → solo ✅/❌.
- El Operador es el único que toca los valores reales en su entorno local o en el dashboard de Vercel. El Director jamás los solicita ni los almacena.

## 3. Flujo de Trabajo Estricto
1. El Senior (IA) proporciona el comando o código exacto.
2. El Operador (Humano) lo ejecuta y entrega el output completo.
3. El Senior evalúa y autoriza el `git commit/push`.
4. **Regla de Oro:** Nunca se hace `git push` a producción sin compilar exitosamente en local (`pnpm build`).

### 3.5. Verificación por output (refuerzo de la Cláusula de Cero Suposiciones)
- El Director certifica el estado del repositorio **exclusivamente por el output de terminal / SQL** que devuelve el Operador.
- La confirmación verbal del Operador solo aplica a elementos **no verificables por terminal** (ej. visibilidad de un botón en el navegador).
- Un ✅ histórico registrado en la BITACORA **no equivale a build vigente**. La Regla de Oro exige `pnpm build` fresco antes de cada `git push`, y su output debe quedar certificado por el Director.
- **Reinicio tras cambios de `.env.local` o dependencias:** `rm -rf apps/web/.next && pnpm dev`. El `Ctrl+C + pnpm dev` no siempre basta para invalidar el bundle de variables `NEXT_PUBLIC_*` en Turbopack.

### 3.6. El código fuente como canal de verificación
La lectura de código fuente (`cat`, `sed -n`, `grep -n`, etc.) es una herramienta de diagnóstico legítima y NO viola §2 (Cero Suposiciones). Se permite en dos escenarios:

**Escenario A — Hipótesis validada, problema persiste:** una hipótesis ya fue confirmada por evidencia conductual (logs, SQL, red), el problema se reproduce, y la lectura de código es necesaria para localizar la causa raíz exacta o la interacción no prevista.

**Escenario B — El código es la vía correcta de diagnóstico:** la evidencia conductual no permite aislar la causa (comportamiento inesperado en una rama de lógica, error silencioso sin log, discrepancia entre lo esperado y lo observado) y la lectura dirigida del código es la vía más directa y menos invasiva para diagnosticar.

**Secuencia obligatoria en ambos escenarios:**
1. Declaración en el chat del objetivo de la lectura: qué se busca y por qué el código es la vía (A o B, justificado en una frase).
2. Lectura dirigida: solo los archivos y rangos de línea relevantes a ese objetivo.
3. Auditoría del output contra el objetivo declarado, con veredicto explícito.

**Prohibido:** lectura de código "a ver qué encuentro" (exploración sin objetivo declarado).

**Facultad del Director:** en cualquier momento del diagnóstico, el Director PUEDE dictar comandos de lectura de código como canal de verificación, previa declaración del objetivo. No requiere aprobación adicional del Operador si respeta la secuencia obligatoria.

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

### 5.2. Convención de nombres de variables de entorno
- Las variables que deben llegar al browser llevan prefijo `NEXT_PUBLIC_`.
- Las variables server-side NO llevan prefijo y se declaran con su nombre canónico.
- Si una credencial se usa en ambos lados (ej. PayPal client_id), se declara **dos veces con el mismo valor**: `NEXT_PUBLIC_<VAR>` y `<VAR>`. No son credenciales distintas — es el mismo valor expuesto en dos ámbitos.
- El archivo `apps/web/.env.example` es la fuente canónica de nombres. Cualquier divergencia entre `.env.example` y `.env.local` debe detectarse en la auditoría de inicio de fase.
- Los artefactos de `node_modules/.pnpm/node_modules/*/.env*` no son fuente de verdad y se ignoran para diagnóstico.

### 5.3. Registro de secretos en logs
- Prohibido pegar en el chat, en issues o en cualquier destino público cualquier log que contenga `authorization: Bearer ...` u otros headers de auth.
- Antes de compartir un output de `pnpm dev`, recortar manualmente los bloques `authorization`.
- Los tokens OAuth de PayPal Sandbox expiran en 9h. Aun así, la disciplina aplica siempre.

### 5.4. Ejecutables no instalados: escalera de tres peldaños
Regla general: preferir SIEMPRE binarios ya presentes en el monorepo. Si ninguno sirve, escalar en este orden. El Director dicta el peldaño; el Operador valida antes de ejecutar.

**Peldaño 1 (por defecto) — `pnpm exec` / `pnpm --filter <workspace> exec`:**
solo resuelve binarios ya instalados en el monorepo. Único peldaño permitido sin justificación adicional.

**Peldaño 2 (preferido para one-shots) — `pnpm dlx <pkg>@<x.y.z>`:**
equivalente a `npx`, pero efímero, aislado y versionado dentro del ecosistema pnpm. NO instala en `node_modules` ni en el global. Requiere SIEMPRE versión exacta (`@<x.y.z>`), nunca `latest`. El Director declara el objetivo del comando en una línea antes de dictarlo.

**Peldaño 3 (excepcional) — `npx --yes --package=<pkg>@<x.y.z> <cmd>`:**
solo si `pnpm dlx` no cubre el caso (p. ej. resolución de peer deps específica del registry npm). Requiere:
  - (a) Justificación explícita del Director: por qué `pnpm dlx` no sirve.
  - (b) Versión exacta pinchada; prohibido `npx <pkg>` sin `@<versión>`.
  - (c) Prohibido `-g` / `--global` / `--install-global`.
  - (d) El Operador revisa y veta si percibe riesgo en su entorno global.

**Prohibido absolutamente:** `npm install -g`, `npx -g`, `pnpm add -g`. Cualquier comando que escriba en instalaciones globales del Operador queda vetado sin excepción.

### 6.1. Despliegues en Vercel
- Dado que Vercel CLI no es compatible con macOS Big Sur (§4), todos los despliegues manuales o forzados deben realizarse desde la interfaz web de Vercel.
- Si el webhook de GitHub falla, usar la opción "Redeploy" en el dashboard, asegurándose de **desmarcar** la casilla "Use existing Build Cache" para garantizar una compilación limpia desde el último commit.
