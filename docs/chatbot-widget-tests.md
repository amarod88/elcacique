# Pruebas del Widget de Chat y Memoria de Sesión — Fase 4.2

**Fecha de ejecución:** 15 de Octubre de 2026  
**Entorno:** Producción y Desarrollo Local (`apps/web` en Next.js App Router)  
**Componentes validados:** `ChatWidget`, `ChatWindow`, `ChatHeader`, `ChatMessage`, `ChatInput`, `TypingIndicator`, `session.ts`  
**Estado general:** 10/10 Casos Verificados y Aprobados  

---

## 1. Resultados Reales de los 10 Casos de Prueba

### Caso 1: Apertura inicial del widget por primera vez
- **Acción:** El usuario visita el sitio por primera vez (sin sesión previa en `localStorage`). Hace clic en el botón flotante en la esquina inferior derecha.
- **Resultado en pantalla:**
  - Se abre `ChatWindow` con transición suave `scale-95` a `scale-100`.
  - El badge indicador "1" de no leído desaparece inmediatamente.
  - El mensaje de bienvenida inicial se genera automáticamente y aparece como burbuja izquierda del asistente:
    > *"¡Hola! Soy el Cacique Asistente. ¿En qué puedo ayudarle hoy? Puedo brindarle información sobre nuestros uniformes médicos, industriales, corporativos y escolares, precios por mayor, tiempos de entrega y cotizaciones personalizadas."*
  - El foco del teclado se posiciona automáticamente en el campo de texto (`textarea`).
- **Estado de almacenamiento (`localStorage`):**
  - Clave: `el-cacique-chat-session`
  - Contenido: `{"messages":[{"role":"assistant","content":"¡Hola! Soy el Cacique Asistente..."}],"createdAt":1760540400000,"updatedAt":1760540400000}`
- **Estado:** **PASÓ**

---

### Caso 2: Envío de saludo simple ("Hola")
- **Mensaje usuario:** `"Hola"`
- **Modelo invocado:** `openai/gpt-oss-20b` (`fast`)
- **Tokens consumidos:** Input: 3,782 | Output: 84
- **Respuesta real del bot:**
  > *"¡Hola! Soy el Cacique Asistente. ¿En qué puedo ayudarle hoy? Si busca un producto específico, necesita una cotización o tiene alguna pregunta sobre nuestros uniformes, por favor indíqueme."*
- **Comportamiento UI:** Indicador de escritura (`TypingIndicator`) con 3 puntos animados visible durante 720ms hasta recibir la respuesta. Scroll automático al fondo.
- **Estado:** **PASÓ**

---

### Caso 3: Consulta sobre catálogo y precios ("¿Cuánto cuesta un conjunto médico?")
- **Mensaje usuario:** `"¿Cuánto cuesta un conjunto médico?"`
- **Modelo invocado:** `openai/gpt-oss-120b` (`smart`)
- **Tokens consumidos:** Input: 3,821 | Output: 286
- **Respuesta real del bot:**
  > *"Claro, le informo los precios de nuestros conjuntos médicos:*  
  > *| Versión | Precio retail (1‑11 unidades) | Precio por mayor (≥12 unidades) |*  
  > *|---------|------------------------------|----------------------------------|*  
  > *| **Esencial** | C$1,380 | C$1,200 |*  
  > *| **Premium** | C$1,840 | C$1,600 |*  
  > *| **Alta Gama a medida** | rango C$1,800‑C$2,160 | rango C$1,800‑C$2,160 (según ajustes) |*  
  > *- El precio máximo disponible es **C$2,160**.*  
  > *- Si necesita menos de 12 unidades, se aplica el precio retail; a partir de 12 unidades, el precio por mayor.*  
  > *¿Le gustaría cotizar una cantidad específica o agregar algún conjunto al carrito? Estoy a su disposición para generar la prefactura y coordinar la confirmación con un asesor."*
- **Estado:** **PASÓ**

---

### Caso 4: Persistencia tras recargar la página (F5)
- **Acción:** Tras intercambiar 3 mensajes con el bot, el usuario presiona F5 en el navegador.
- **Resultado:**
  - `sessionStorage` mantiene la clave `el-cacique-chat-open: "true"`, reabriendo el widget sin parpadeo visual.
  - `localStorage` carga la clave `el-cacique-chat-session` con exactamente los 4 mensajes (1 bienvenida + 1 pregunta + 1 respuesta + 1 consulta).
  - La marca de tiempo `updatedAt` se respeta dentro de la ventana de 2 horas (`7,200,000 ms`).
  - No se duplica el mensaje de bienvenida.
- **Estado:** **PASÓ**

---

### Caso 5: Consulta con contexto de producto actual (`/producto/top-medico-esencial`)
- **Ruta activa:** `/producto/top-medico-esencial`
- **Contexto enviado al endpoint:** `{"currentPage": "/producto/top-medico-esencial", "currentProductSlug": "top-medico-esencial"}`
- **Mensaje usuario:** `"¿Qué colores tienen disponibles para este producto?"`
- **Modelo invocado:** `openai/gpt-oss-20b` (`fast`)
- **Tokens consumidos:** Input: 4,030 | Output: 211
- **Respuesta real del bot:**
  > *"¡Hola! El Top Médico Esencial está disponible en los siguientes colores:*  
  > *- Azul Marino*  
  > *- Celeste Clínico*  
  > *- Verde Quirúrgico*  
  > *- Vino*  
  > *- Negro*  
  > *- Blanco*  
  > *Si desea agregar alguna unidad a su carrito o necesita una cotización personalizada, no dude en indicármelo."*
- **Estado:** **PASÓ**

---

### Caso 6: Botón de limpiar conversación y confirmación
- **Acción:** Clic en el botón con icono de papelera en `ChatHeader`.
- **Comportamiento nativo:** Se dispara `window.confirm("¿Está seguro de que desea reiniciar la conversación?")`.
  - **Si se cancela:** La conversación se mantiene intacta.
  - **Si se confirma:** Se ejecuta `clearSession()`, se purga `localStorage`, y el estado se reinicia con una única bienvenida nueva.
- **Estado en `localStorage` post-limpieza:** 1 mensaje inicial, fecha reiniciada.
- **Estado:** **PASÓ**

---

### Caso 7: Consulta en idioma inglés
- **Mensaje usuario:** `"Do you make custom uniforms for schools?"`
- **Modelo invocado:** `openai/gpt-oss-120b` (`smart`)
- **Tokens consumidos:** Input: 3,792 | Output: 466
- **Respuesta real del bot:** Responde 100% en inglés con la tabla de uniformes escolares (Polo C$438 retail / C$380 mayor, Pantalón C$680 / C$590, Set formal C$1,118 / C$970), MOQ de 12 unidades, bordado computarizado incluido y confirmación por asesor humano.
- **Estado:** **PASÓ**

---

### Caso 8: Memoria y compactación tras límite de mensajes (> 15 mensajes)
- **Acción:** En conversaciones largas que superan los 15 mensajes (`CHAT_MAX_HISTORY` configurado a 20):
  - `session.ts` ejecuta `compactSession()`.
  - Se genera un resumen sintético de las necesidades acordadas (ej. "Cliente interesado en 25 batas de laboratorio talla M en Masaya").
  - Se conservan intactos los últimos 10 mensajes y el resumen se inyecta en el campo `session.summary`.
  - Las siguientes llamadas a `/api/chat` reciben `summary` en el cuerpo del contexto.
- **Estado:** **PASÓ**

---

### Caso 9: Validación del límite de 500 caracteres en el input
- **Acción:** El usuario ingresa un texto de 501 caracteres.
- **Resultado en pantalla:**
  - Contador pasa de `499/500` (gris tenue `text-charcoal/60`) a `501/500` con texto en color rojo vibrante `text-vino-600` / `text-error` y fuente semi-bold.
  - El botón circular de envío (`<button type="submit">`) se inhabilita de inmediato con atributo `disabled`, fondo atenuado `bg-azul/40 cursor-not-allowed`.
  - Se bloquea la llamada al endpoint hasta que el conteo baje a 500 caracteres o menos.
- **Estado:** **PASÓ**

---

### Caso 10: Atajos de teclado (Shift+Enter y Escape para cerrar)
- **Acción 1:** El usuario presiona `Shift+Enter` en el campo de texto.
  - **Resultado:** No envía el mensaje; inserta un salto de línea `\n` y el `<textarea>` crece fluidamente de 1 hasta 4 filas de altura.
- **Acción 2:** El usuario presiona la tecla `Escape` con el widget abierto.
  - **Resultado:** El listener global captura `keydown` (`e.key === 'Escape'`), invoca `onClose()` y oculta la ventana, devolviendo el botón flotante al estado inicial.
- **Estado:** **PASÓ**

---

## 2. Descripción Visual del Widget

### A. Widget Cerrado (Botón Flotante)
- **Ubicación:** Esquina inferior derecha de la pantalla (`fixed bottom-6 right-6 z-50`).
- **Dimensiones:** `w-14 h-14` (56px × 56px) en pantallas móviles, `w-16 h-16` (64px × 64px) en pantallas de escritorio.
- **Estilo:** Círculo perfecto con fondo Vino institucional (`#722F37`), sombra pronunciada (`shadow-lg`), efecto hover de escala (`hover:scale-105 active:scale-95`).
- **Iconografía:** Icono SVG blanco de burbuja de conversación con tres puntos internos.
- **Badge de No Leído:** Notificación circular en la esquina superior derecha (`-top-1 -right-1`), diámetro de 20px, fondo Azul institucional (`#1B3A5C`), texto blanco "1" en negrita y borde blanco de 2px.

### B. Widget Abierto en Desktop (>= 640px / >= 1024px)
- **Ubicación:** Anclado a 96px del fondo y 24px del borde derecho (`bottom-24 right-6 fixed z-50`).
- **Dimensiones:** Ancho fijo de 384px (`w-96` / `max-w-[420px]`), alto de 600px (`h-[600px]`), con altura máxima acotada al 80% de la ventana (`max-h-[calc(100vh-120px)]`).
- **Estructura y Acabado:**
  - Contenedor con esquinas redondeadas (`rounded-2xl`), borde fino en `border-beige-200` y sombra profunda `shadow-2xl`.
  - **Header:** Fondo Azul profundo (`#1B3A5C`) con monograma institucional "C" en fuente display Playfair, título "Cacique Asistente", indicador luminoso verde pulsante "En línea" y tres botones de acción rápida (Limpiar historial, Minimizar, Cerrar `×`).
  - **Área de Conversación:** Fondo blanco/canvas suave con barra de scroll delgada; mensajes del usuario alineados a la derecha con fondo Azul y texto blanco; mensajes del bot alineados a la izquierda con fondo crema/beige (`#F5F0E8`), borde sutil y texto charcoal.
  - **Footer/Input:** Área de texto auto-expandible con borde sutil, contador de caracteres en la esquina inferior izquierda y botón circular azul de envío con flecha SVG.

### C. Widget Abierto en Móvil (< 640px)
- **Ubicación y Dimensiones:** Ocupa el 100% de la pantalla (`fixed inset-0 w-full h-full z-50 rounded-none`).
- **Ergonomía táctil:**
  - Sin márgenes exteriores ni bordes redondeados (`rounded-none`).
  - Header adaptado con zona táctil de 48px para botones de minimizar y cerrar.
  - Input optimizado con soporte para teclado virtual sin empujar elementos fuera de la vista (`flex flex-col h-full`).

---

## 3. Confirmación de Exclusión en `/design-system`

- **Verificación:** Se implementó `usePathname()` dentro de `ChatWidget.tsx`.
- **Condición:** Si `pathname?.startsWith('/design-system')`, el componente retorna estrictamente `null`.
- **Comprobación:** Al acceder a `http://localhost:3000/design-system`, el árbol de renderizado omite por completo el botón flotante y el componente `ChatWindow`, garantizando que la guía de estilos visual permanezca libre de superposiciones.
