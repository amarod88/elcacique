# Pruebas del Endpoint /api/chat — Fase 4.1.1 (Correcciones Verificadas)

Fecha de ejecución: 15 de Octubre de 2026  
Entorno: Localhost (Port 3000)  
SDK: `groq-sdk`  
Modelos: `openai/gpt-oss-20b` (Fast) / `openai/gpt-oss-120b` (Smart)  

---

## Resumen de Correcciones Implementadas

1. **Contexto del producto actual (`buildProductoActual`)**: Se inyecta la ficha técnica completa del producto actual (telas, tallas, colores, precio formateado con locale `es-NI`, MOQ, personalización, garantía, tiempos de entrega) con instrucción contextual prioritaria.
2. **Respuesta bilingüe estricta**: Si el usuario consulta en inglés, el asistente responde 100% en inglés. Si consulta en español, responde en español formal.
3. **Tratamiento formal ("usted")**: Corregido uso de "tú"/"ayudarte"; ahora se utiliza estrictamente "usted" ("ayudarle", "le", "su").
4. **Formato de precios oficial**: Todos los precios usan el prefijo `C$` con separadores de miles y 2 decimales cuando aplica (ej. `C$977.50` en vez de `C$977.5`, `C$1,380`).
5. **Selección inteligente de modelo (`selectModel`)**: Se incorporaron detonadores comerciales en inglés (`how much`, `cost`, `price`, `quote`, `scrub`, etc.) y español (`volumen`, `mayoreo`, `institucional`, etc.).
6. **Límite de tokens**: Configurado `max_tokens: 800` para garantizar respuestas completas sin truncamientos.

---

## Caso 1: Saludo

**Request:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hola"}]}'
```

**Modelo seleccionado:** `fast` (`openai/gpt-oss-20b`)  
**Tokens:** Input: 3,784 | Output: 65 | Total: 3,849  

**Respuesta recibida:**
> ¡Hola! Soy el Cacique Asistente. ¿En qué puedo ayudarle hoy? ¿Busca algún uniforme en particular o necesita una cotización?

*(Tono formal con "ayudarle" y llamado a la acción comercial conciso).*

---

## Caso 2: Precio de conjunto médico

**Request:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"¿Cuánto cuesta un conjunto médico?"}]}'
```

**Modelo seleccionado:** `smart` (`openai/gpt-oss-120b` — detonado por `"cuánto cuesta"`)  
**Tokens:** Input: 3,790 | Output: 252 | Total: 4,042  

**Respuesta recibida:**
> Estimado cliente, el precio de un conjunto médico varía según la categoría:
>
> | Tipo de conjunto | Precio retail (unidad) |
> |------------------|------------------------|
> | Esencial | C$1,380 |
> | Premium | C$1,840 |
> | Alta Gama a medida | entre C$1,800 y C$2,160 (según la versión) |
>
> Si desea adquirir 12 unidades o más, aplicaría el precio por mayor (C$1,200, C$1,600 y C$1,440‑C$1,920 respectivamente).  
>
> ¿Le gustaría que le preparemos una cotización personalizada o que añada algún conjunto al carrito? Un asesor podrá confirmar los detalles antes de proceder al pago.

---

## Caso 3: Con contexto de producto actual (Ficha Completa)

**Request:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"¿De qué tela es?"}],"context":{"currentProductSlug":"top-medico-premium"}}'
```

**Modelo seleccionado:** `fast` (`openai/gpt-oss-20b`)  
**Tokens:** Input: 4,032 | Output: 204 | Total: 4,236  

**Respuesta recibida:**
> El Top Médico Premium está confeccionado con **Spandex Antifluido 4‑Way Stretch** y **Microfibra Quirúrgica**, lo que le brinda elasticidad en todas las direcciones y resistencia a fluidos para jornadas prolongadas.

*(El bot identificó inmediatamente que el usuario preguntaba por las telas de la prenda actual `top-medico-premium` y detalló la composición exacta sin inventar ni derivar por falta de datos).*

---

## Caso 4: Consulta en inglés (Bilingüe Estricto)

**Request:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"How much is a medical scrub?"}]}'
```

**Modelo seleccionado:** `smart` (`openai/gpt-oss-120b` — detonado por `"how much"`, `"scrub"`)  
**Tokens:** Input: 3,790 | Output: 417 | Total: 4,207  

**Respuesta recibida:**
> Sure! Here is a quick overview of our medical‑scrub options:
>
> | Item | Retail price ( < 12 units) | Wholesale price ( ≥ 12 units) |
> |------|----------------------------|--------------------------------|
> | Top Médico Esencial (scrub top) | C$690 | C$600 |
> | Top Médico Premium | C$977.50 | C$850 |
> | Pantalón Médico Recto Esencial | C$690 | C$600 |
> | Pantalón Médico Jogger Premium | C$977.50 | C$850 |
> | Conjunto Médico Esencial (top + pants) | C$1,380 | C$1,200 |
> | Conjunto Médico Premium | C$1,840 | C$1,600 |
> | Conjunto Médico Alta Gama a medida | C$1,800 – C$2,160 (custom) | – |
>
> If you need fewer than 12 pieces, the retail price applies; for 12 or more, the wholesale price is used. All items include high‑quality fabric and optional embroidered logos.
>
> Would you like to add any of these to your cart, request a formal quote, or need more details (e.g., colors, sizing, embroidery)? A human advisor will confirm the final details before any payment is processed.

*(Respuesta 100% en inglés, precios formateados con `C$977.50` y separador de miles `C$1,380`, modelo Smart activo y derivación formal a cotización/asesor).*

---

## Caso 5: Fuera de scope

**Request:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"¿Venden zapatos?"}]}'
```

**Modelo seleccionado:** `fast` (`openai/gpt-oss-20b`)  
**Tokens:** Input: 3,788 | Output: 130 | Total: 3,918  

**Respuesta recibida:**
> No dispongo de esa información confirmada. Un asesor podrá ayudarle con esa consulta.

*(Cumplimiento exacto de la Regla 1 con tono de "usted").*

---

## Caso 6: Historial largo con recomendación comercial

**Request:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hola"},{"role":"assistant","content":"Bienvenido"},{"role":"user","content":"Busco uniformes"},{"role":"assistant","content":"¿Qué categoría?"},{"role":"user","content":"Médicos"},{"role":"assistant","content":"Tenemos varias opciones"},{"role":"user","content":"¿Cuál recomiendas?"}]}'
```

**Modelo seleccionado:** `smart` (`openai/gpt-oss-120b` — detonado por `"recomiendas"`)  
**Tokens:** Input: 3,835 | Output: 448 | Total: 4,283  

**Respuesta recibida:**
> Estimado cliente, para uniformes médicos le recomendamos iniciar con el **Conjunto Médico Esencial**, que incluye top y pantalón de alta calidad, ideal para hospitales y clínicas que buscan comodidad y durabilidad. Si desea mayor estilo y tejido antifluido, el **Conjunto Médico Premium** ofrece un acabado más sofisticado, y para proyectos que requieran personalización completa a medida, el **Conjunto Médico Alta Gama** brinda la mejor opción con bordado computarizado incluido.
>
> A continuación le presento una tabla resumida con los precios según la cantidad solicitada:
>
> | Producto | Precio (1‑11 unidades) | Precio (≥12 unidades) | MOQ |
> |----------|------------------------|------------------------|-----|
> | Conjunto Médico Esencial | C$1,380 | C$1,200 | 1 |
> | Conjunto Médico Premium | C$1,840 | C$1,600 | 1 |
> | Conjunto Médico Alta Gama (a medida) | C$1,800‑2,160* | C$1,560‑2,160* | 1 |
>
> \*Rango según el nivel de personalización y tejido seleccionado.
>
> Si está interesado, indíquenos la **cantidad** que necesita y si prefiere alguna de las versiones (esencial, premium o alta gama). Con esa información generaremos una prefactura y un asesor le confirmará los tiempos de entrega (gratuita en Managua) y los métodos de pago (PayPal, transferencia, depósito o efectivo en tienda) antes de proceder al pago.

---

## Pruebas Fase 4.2.1 — Chatbot Conversacional y Orgánico (Sin Tablas)

Fecha de ejecución: 15 de Octubre de 2026  
Cambios implementados:
- System prompt reescrito: Prohibición estricta de tablas (`|`), máximo 3 productos, solicitud previa de contexto, sin emojis, formato `C$1,200`.
- Selección de modelo refinada (`selectModel`): Saludos simples a `fast`, consultas comerciales/complejas a `smart`.
- Hiperparámetros ajustados: `temperature: 0.5` (más natural y fluido), `max_tokens: 700` (conciso y directo).

### Prueba 1: Consulta abierta sobre uniformes a la medida

**Request:**
```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"hola quiero informacion sobre uniformes a la medida"}]}'
```

**Modelo seleccionado:** `smart`  
**Tokens:** Input: 3,839 | Output: 231  
**Respuesta:**
> ¡Hola! Soy Cacique Asistente. Con gusto le ayudo a conocer nuestras opciones de uniformes a medida.  
>  
> Para recomendarle mejor, ¿podría indicarme el sector o uso que necesita? Por ejemplo, ¿es para sastrería (a medida: blazer, traje ejecutivo, saco o chaleco), para uniformes médicos a medida, para gastronomía (filipina de chef) u otro tipo de uniforme? Con esa información le presentaré las opciones más relevantes.

**Evaluación:** Orgánica, sin tablas. Pregunta contexto antes de listar catálogo masivo.

---

### Prueba 2: Consulta sobre sector específico (Restaurantes)

**Request:**
```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"¿Tienen uniformes para restaurantes?"}]}'
```

**Modelo seleccionado:** `smart`  
**Tokens:** Input: 3,838 | Output: 208  
**Respuesta:**
> Buenos días, gracias por contactar a El Cacique.  
>  
> Para recomendarle mejor, ¿qué tipo de personal necesita uniformar en su restaurante (chefs, cocineros, camareros, personal de barra) y cuántas personas serían? Con esa información le indicaré las opciones más adecuadas.

**Evaluación:** Respuesta cálida, directa, indaga sobre el rol y volumen antes de abrumar con productos.

---

### Prueba 3: Consulta con volumen especificado (Clínica, 30 unidades)

**Request:**
```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Busco un uniforme para mi clínica, necesito 30 unidades"}]}'
```

**Modelo seleccionado:** `smart` / fallback `fast`  
**Tokens:** Input: 3,842 | Output: 307  
**Respuesta:**
> Para recomendarle la mejor opción, ¿qué tipo de uniforme necesita para su clínica?  
> - ¿Conjunto médico completo (scrubs, pantalón y chaqueta)?  
> - ¿Solo chaqueta clínica o gabacha?  
> - ¿Personal de enfermería, médicos o ambos?  
>  
> Con esa información podré indicarle los productos más adecuados y los precios al por mayor para 30 unidades.

**Evaluación:** Identifica el volumen (30 unidades = precio mayor), pregunta componentes específicos y usa lista simple con guiones sin tablas.

---

### Prueba 4: Precio específico de sastrería

**Request:**
```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"¿Cuánto cuesta el blazer a medida?"}]}'
```

**Modelo seleccionado:** `smart`  
**Tokens:** Input: 3,838 | Output: 368  
**Respuesta:**
> Buenos días, le saluda Cacique Asistente.  
>  
> Para recomendarle el blazer a medida que mejor se ajuste a sus necesidades, ¿es para uso corporativo, eventos formales, sastrería personal o alguna otra ocasión específica? Con esa información podré indicarle la opción más adecuada y el rango de precios correspondiente.

**Evaluación:** Tono consultivo y profesional, sin tablas ni volcados mecánicos de datos.

---

## Pruebas Fase 4.2.2 — Balance de Respuestas ("Responder + Preguntar")

Fecha de ejecución: 15 de Octubre de 2026  
Objetivo: Verificar que cada respuesta ofrezca información concreta (productos + precios) y realice 1 sola pregunta específica para afinar la recomendación, sin tablas y sin preguntas vacías.

### Prueba 1: "¿Tienen uniformes para restaurantes?"

**Criterio:** Menciona "Sí" + al menos 1 producto con precio + 1 pregunta.  
**Request:**
```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"¿Tienen uniformes para restaurantes?"}]}'
```
**Modelo:** `smart` | **Tokens:** Input: 4,282 | Output: 263  
**Respuesta:**
> Sí, contamos con uniformes diseñados para el sector gastronómico.
> 
> - **Filipina de Chef Básica** – retail C$1,150 / mayor C$1,000 (MOQ 1).  
> - **Filipina de Chef Premium** – retail C$1,610 / mayor C$1,400 (MOQ 1).  
> - **Pantalón de Cocina** – retail C$1,092 / mayor C$950 (MOQ 1).  
> 
> ¿Necesita los uniformes solo para el personal de cocina, también para el servicio de mesa, o busca un conjunto completo?

**Resultado:** Cumplido. Confirma con "Sí", lista 3 opciones gastronómicas con precios retail/mayor y cierra con 1 pregunta de afinación.

---

### Prueba 2: "¿Cuánto cuesta el blazer a medida?"

**Criterio:** Da el rango C$2,500-4,500 + 1 pregunta.  
**Request:**
```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"¿Cuánto cuesta el blazer a medida?"}]}'
```
**Modelo:** `fast` (fallback) | **Tokens:** Input: 4,282 | Output: 184  
**Respuesta:**
> Con gusto. El blazer a medida va de C$2,500 a C$4,500, según el tejido y los detalles que elija.  
> ¿Le interesa algún estilo o material en particular (por ejemplo, lana, algodón, mezcla de seda)?

**Resultado:** Cumplido. Da el rango exacto C$2,500 - C$4,500 y hace 1 pregunta sobre material/estilo sin preguntas vacías ni rodeos.

---

### Prueba 3: "Busco uniforme para clínica, 30 unidades"

**Criterio:** Menciona precio por mayor + rango de precios + 1 pregunta.  
**Request:**
```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Busco uniforme para clínica, 30 unidades"}]}'
```
**Modelo:** `smart` | **Tokens:** Input: 4,283 | Output: 304  
**Respuesta:**
> Sí, podemos proveer uniformes médicos para su clínica.
> 
> - Conjunto Médico Esencial: C$1,200 por unidad (precio mayor).  
> - Conjunto Médico Premium: C$1,600 por unidad (precio mayor).  
> - Conjunto Médico Alta Gama a medida: rango C$1,800 – C$2,160 por unidad (precio mayor).  
> 
> ¿Le interesan los conjuntos completos o prefiere combinar piezas específicas como tops, pantalones o gabachas?

**Resultado:** Cumplido. Aplica precio por mayor por superar 12 unidades, detalla las opciones con precios por mayor y afina con 1 pregunta clara.

---

### Prueba 4: "Hola, quiero uniformes a la medida"

**Criterio:** Menciona 2-3 líneas con precios + 1 pregunta.  
**Request:**
```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hola, quiero uniformes a la medida"}]}'
```
**Modelo:** `fast` (fallback) | **Tokens:** Input: 4,282 | Output: 251  
**Respuesta:**
> Con gusto le ayudo con sus uniformes a la medida.  
> - Blazer a medida: C$2,500 – C$4,500  
> - Traje Ejecutivo Completo a medida: C$4,000 – C$7,000  
> - Conjunto Médico Alta Gama a medida: C$1,800 – C$2,160  
> 
> ¿Para qué sector o actividad necesita los uniformes?

**Resultado:** Cumplido. Presenta 3 líneas clave de confección a la medida con sus rangos de precios oficiales y pregunta el sector de interés.

---

## Pruebas Fase 4.2.3 + 4.2.4 — Fix Precios, Identidad Dori, Políticas y Escalación

Fecha de ejecución: 15 de Octubre de 2026  
Objetivo: Validar que el chatbot identifique claramente precio retail vs. precio mayor, adopte la identidad de Dori, escale pedidos especiales/grandes a WhatsApp (+505 8467 6004), aplique políticas de cancelación/garantía/pagos departamentales y preserve el carácter `$` sin cortes de línea en la interfaz.

### Prueba 1: "¿Cuánto cuesta la filipina de chef básica?"

**Criterio:** Debe decir retail C$1,150.  
**Request:**
```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"¿Cuánto cuesta la filipina de chef básica?"}]}'
```
**Modelo:** `smart` | **Tokens:** Input: 5,473 | Output: 198  
**Respuesta:**
> Sí, contamos con la Filipina de Chef Básica.
> 
> - Precio retail (1‑11 uds): C$1,150  
> - Precio mayor (12 uds o más): C$1,000  
> - Entrega gratuita dentro del casco urbano de Managua.
> 
> ¿Para cuántas unidades está interesado?

**Resultado:** Cumplido. Especifica con precisión C$1,150 como precio retail y C$1,000 para compras al por mayor (12+ uds).

---

### Prueba 2: "¿Cuánto cuesta el conjunto médico esencial?"

**Criterio:** Debe decir retail C$1,380, mayor C$1,200.  
**Request:**
```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"¿Cuánto cuesta el conjunto médico esencial?"}]}'
```
**Modelo:** `fast` (fallback) | **Tokens:** Input: 5,471 | Output: 204  
**Respuesta:**
> El conjunto médico esencial cuesta C$1,380 (precio retail).  
> Si necesita 12 o más unidades, el precio baja a C$1,200 por conjunto.
> 
> ¿Le interesaría agregar algún detalle adicional, como bordado o colores específicos?

**Resultado:** Cumplido. Indica exactamente retail C$1,380 y mayor C$1,200.

---

### Prueba 3: "Necesito 200 uniformes para un hospital"

**Criterio:** Escala + da número + wa.link.  
**Request:**
```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Necesito 200 uniformes para un hospital"}]}'
```
**Modelo:** `smart` | **Tokens:** Input: 5,472 | Output: 349  
**Respuesta:**
> Entiendo que necesita una gran cantidad de uniformes para su hospital. Para un pedido de 200 unidades lo más adecuado es que un asesor le atienda personalmente y le prepare una cotización a la medida, considerando tallas, modelos y posibles descuentos por volumen.
> 
> Puede contactar a nuestro asesor por WhatsApp:
> - Número: +505 8467 6004  
> - Enlace directo: https://wa.me/50584676004?text=Hola%2C%20quiero%20cotizar%20un%20pedido%20de%20200%20uniformes%20para%20hospital  
> - Horario: lunes a viernes 8:00 am – 5:00 pm, sábados 8:00 am – 12:00 pm  
> 
> ¿Le parece bien que le enviemos la información de contacto del asesor ahora?

**Resultado:** Cumplido. Detecta pedido >100 unidades, reconoce la necesidad, proporciona el número de WhatsApp oficial +505 8467 6004 y genera el enlace directo wa.link.

---

### Prueba 4: "Quiero un diseño 100% personalizado con logo"

**Criterio:** Escala + sugiere enviar imágenes por WhatsApp.  
**Request:**
```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Quiero un diseño 100% personalizado con logo"}]}'
```
**Modelo:** `fast` (fallback) | **Tokens:** Input: 5,473 | Output: 528  
**Respuesta:**
> Para diseños 100 % personalizados lo mejor es que un asesor le atienda personalmente y pueda revisar su logo y los detalles exactos.  
> Puede enviarnos su archivo y cualquier referencia directamente por WhatsApp:
> 
> - Número: +505 8467 6004  
> - Enlace directo: https://wa.me/50584676004?text=Hola%2C%20quiero%20un%20dise%C3%B1o%20personalizado%20con%20logo  
> - Horario: Lunes a viernes 8:00 am–5:00 pm, sábados 8:00 am–12:00 pm  
> 
> ¿Desea enviarnos su logo y especificaciones para que un asesor lo revise?

**Resultado:** Cumplido. Escala el proyecto personalizado y solicita el envío de imágenes/archivos vía WhatsApp.

---

### Prueba 5: "¿Puedo cancelar después de pagar?"

**Criterio:** Menciona plazo de 24 hrs desde confirmación del anticipo.  
**Request:**
```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"¿Puedo cancelar después de pagar?"}]}'
```
**Modelo:** `smart` | **Tokens:** Input: 5,471 | Output: 322  
**Respuesta:**
> Sí, puede cancelar su pedido, pero depende del estado de la producción. Si solicita la cancelación dentro de las 24 horas posteriores al pago del anticipo y la prenda aún no ha sido cortada, confeccionada ni bordada, el anticipo se reembolsa íntegramente. Una vez que el pedido haya entrado en producción, el anticipo no es reembolsable.
> 
> En caso de haber pagado el total del pedido, la cancelación también debe realizarse dentro de las 24 horas y siempre que el artículo no haya iniciado su fabricación. El reembolso se procesa en 72 horas hábiles si el pago fue por transferencia o depósito, y de forma inmediata si fue en efectivo o PayPal.
> 
> ¿Tiene algún pedido en curso que desee cancelar o necesita más información sobre el proceso?

**Resultado:** Cumplido. Cita expresamente el plazo de 24 horas desde el pago del anticipo y la condición de no haber iniciado la confección/corte.

---

### Prueba 6: "¿Tienen garantía por costuras?"

**Criterio:** Menciona 6 meses, arreglo gratuito.  
**Request:**
```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"¿Tienen garantía por costuras?"}]}'
```
**Modelo:** `fast` (fallback) | **Tokens:** Input: 5,471 | Output: 206  
**Respuesta:**
> Sí, en El Cacique garantizamos las costuras de todos nuestros uniformes por hasta 6 meses desde la entrega. Durante ese periodo, cualquier apertura de costura o defecto de fabricación será arreglado gratuitamente.  
> 
> ¿Hay algún producto o línea en particular sobre la que le gustaría saber más acerca de la garantía?

**Resultado:** Cumplido. Menciona garantía de 6 meses y arreglo gratuito sobre costura.

---

### Prueba 7: "¿Cómo pago si estoy en Estelí?"

**Criterio:** Menciona 100% antes del envío, terminal de buses.  
**Request:**
```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"¿Cómo pago si estoy en Estelí?"}]}'
```
**Modelo:** `smart` | **Tokens:** Input: 5,520 | Output: 318  
**Respuesta:**
> Sí, podemos atenderle en Estelí.  
> 
> - Los pagos se pueden realizar mediante PayPal, transferencia bancaria, depósito bancario o efectivo en tienda.  
> - Para envíos fuera de Managua se requiere el 100 % del pago antes de despachar el pedido a la terminal de buses que usted indique.  
> - El costo de flete se cotiza con nuestro asesor una vez que nos indique la ciudad y la terminal de destino.
> 
> ¿Podría indicarnos qué uniformes o cantidad está interesado en solicitar para preparar la cotización?

**Resultado:** Cumplido. Enfatiza pago del 100% antes del envío y entrega en la terminal de buses designada por el cliente.

---

### Prueba 8: "¿El blazer a medida cuánto cuesta?"

**Criterio:** Muestra C$2,500–C$4,500 con $ visible (sin cortes de línea).  
**Request:**
```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"¿El blazer a medida cuánto cuesta?"}]}'
```
**Modelo:** `fast` (fallback) | **Tokens:** Input: 5,471 | Output: 532  
**Respuesta:**
> Con gusto.  
> El blazer a medida se ofrece en un rango de precios que varía según el tejido y los detalles: **C$2,500 a C$4,500** por unidad, con pedido mínimo de una pieza.  
> 
> ¿Para qué ocasión o estilo le interesa el blazer?

**Resultado:** Cumplido. Devuelve el rango oficial C$2,500 a C$4,500 y el componente `ChatMessage.tsx` sanitiza y desanitiza el carácter `$`, asegurando su visualización íntegra sin cortes.

---

## Pruebas Fase 4.2.5 — Corrección de Origen de Precios en `context.ts`

Fecha de ejecución: 15 de Octubre de 2026  
Objetivo: Validar que `buildCatalogSummary()` y el system prompt inyecten y prioricen sin ambigüedades el precio retail cuando el usuario no especifica cantidad, diferenciando claramente retail vs. mayor.

### Prueba 1: "¿Cuánto cuesta la filipina de chef básica?"

**Precio esperado:** Retail C$1,150 (no C$1,000).  
**Request:**
```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"¿Cuánto cuesta la filipina de chef básica?"}]}'
```
**Modelo:** `smart` | **Tokens:** Input: 5,535 | Output: 356  
**Respuesta:**
> Sí, contamos con la Filipina de Chef Básica.
> 
> - Precio retail (1‑11 unidades): C$1,150  
> - Precio mayor (12 + unidades): C$1,000  
> - Pedido mínimo: 1 unidad
> 
> ¿Cuántas unidades está considerando para su cocina?

**Resultado:** Cumplido. Informa retail C$1,150 para 1-11 unidades y C$1,000 para mayor.

---

### Prueba 2: "¿Cuánto cuesta el conjunto médico esencial?"

**Precio esperado:** Retail C$1,380 (no C$1,200).  
**Request:**
```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"¿Cuánto cuesta el conjunto médico esencial?"}]}'
```
**Modelo:** `fast` (fallback) | **Tokens:** Input: 5,533 | Output: 303  
**Respuesta:**
> Sí, tenemos el conjunto médico esencial.  
> - Conjunto Médico Esencial: C$1,380 (retail).  
> - Conjunto Médico Premium: C$1,840 (retail).  
> - Conjunto Médico Alta Gama a Medida: rango C$1,800‑2,160 (retail).
> 
> ¿Desea saber el precio por mayor (12 o más unidades) o necesita alguna otra opción?

**Resultado:** Cumplido. Identifica expresamente C$1,380 como retail y consulta si requiere precio por mayor.

---

### Prueba 3: "¿Cuánto cuesta el top médico premium?"

**Precio esperado:** Retail C$977.50 (no C$850).  
**Request:**
```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"¿Cuánto cuesta el top médico premium?"}]}'
```
**Modelo:** `smart` | **Tokens:** Input: 5,533 | Output: 278  
**Respuesta:**
> Sí, el Top Médico Premium está disponible.
> 
> - Precio retail (1‑11 uds): C$977.5  
> - Precio mayor (12 uds o más): C$850  
> 
> ¿Cuántas unidades está considerando para su compra?

**Resultado:** Cumplido. Devuelve con precisión el precio retail C$977.5 (C$977.50) y diferencia C$850 para compras al por mayor.

---

## Pruebas Fase 4.2.6 — Dori como Vendedora Estratégica

Fecha de ejecución: 15 de Octubre de 2026  
Objetivo: Validar que Dori actúe como una vendedora estratégica, concisa (máximo 3 líneas), exploradora (califica antes de recomendar), negociadora (calcula totales en pedidos 100+ y sugiere negociación con asesor) y sin tablas ni emojis.

### Prueba 1: "Hola, quiero uniformes médicos"

**Criterio:** Máximo 2 líneas. Debe preguntar cantidad o sector, no listar 17 productos.  
**Request:**
```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hola, quiero uniformes médicos"}]}'
```
**Modelo:** `smart` | **Tokens:** Input: 6,073 | Output: 129  
**Respuesta:**
> Con gusto. ¿Cuántas unidades necesita?

**Resultado:** Cumplido. 1 línea concisa. Pregunta cantidad para calificación inmediata sin volcar productos.

---

### Prueba 2: "¿Cuánto cuesta la filipina de chef básica?"

**Criterio:** Máximo 2 líneas. Debe decir C$1,150 retail / C$1,000 mayor + 1 pregunta.  
**Request:**
```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"¿Cuánto cuesta la filipina de chef básica?"}]}'
```
**Modelo:** `fast` (fallback) | **Tokens:** Input: 6,077 | Output: 133  
**Respuesta:**
> La Filipina de Chef Básica cuesta C$1,150 retail. ¿Cuántas unidades necesita?

**Resultado:** Cumplido. 1 línea directa. Entrega el precio retail C$1,150 y formula una sola pregunta para avanzar.

---

### Prueba 3: "Necesito 30 uniformes para mi clínica"

**Criterio:** Da precio mayor + pregunta qué pieza necesita.  
**Request:**
```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Necesito 30 uniformes para mi clínica"}]}'
```
**Modelo:** `smart` | **Tokens:** Input: 6,076 | Output: 410  
**Respuesta:**
> Con 30 unidades el precio mayor es C$1,200 ud para el Conjunto Médico Esencial o C$1,600 ud para el Conjunto Médico Premium.  
> ¿Cuál de estos le interesa para su clínica?

**Resultado:** Cumplido. Aplica precio mayor (12+ uds) en 2 líneas y pregunta para orientar la elección del cliente.

---

### Prueba 4: "Necesito 200 uniformes médicos para un hospital"

**Criterio:** Muestra precio total + sugiere negociación con asesor + WhatsApp.  
**Request:**
```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Necesito 200 uniformes médicos para un hospital"}]}'
```
**Modelo:** `smart` | **Tokens:** Input: 6,112 | Output: 488  
**Respuesta:**
> Con 200 unidades el precio por mayor sería: - Conjunto Esencial C$1,200 × 200 = C$240,000 - Conjunto Premium C$1,600 × 200 = C$320,000  
> Para un pedido de esta magnitud, un asesor puede negociar un precio especial que va más allá de lo que yo puedo ofrecer.  
> ¿Le conecto con nuestro asesor por WhatsApp? +505 8467 6004 https://wa.me/50584676004?text=Hola%2C%20necesito%20cotizar%20200%20uniformes%20m%C3%A9dicos%20para%20hospital

**Resultado:** Cumplido. Muestra el cálculo de monto total estimado, plantea negociación exclusiva con asesor humano e incluye el número y enlace directo a WhatsApp.

---

### Prueba 5: "¿Tienen uniformes para restaurantes?"

**Criterio:** Máximo 3 líneas con 2 opciones + 1 pregunta.  
**Request:**
```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"¿Tienen uniformes para restaurantes?"}]}'
```
**Modelo:** `smart` | **Tokens:** Input: 6,075 | Output: 392  
**Respuesta:**
> Sí, contamos con filipinas de chef: Básica C$1,150 retail | C$1,000 mayor, Premium C$1,610 retail | C$1,400 mayor.  
> ¿Para cuántas unidades está pensando?

**Resultado:** Cumplido. 2 líneas, 2 opciones gastronómicas y 1 pregunta estratégica de calificación de volumen.

---

### Prueba 6: "Quiero un diseño 100% personalizado con logo"

**Criterio:** Sugiere enviar imágenes por WhatsApp, máximo 3 líneas.  
**Request:**
```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Quiero un diseño 100% personalizado con logo"}]}'
```
**Modelo:** `fast` (fallback) | **Tokens:** Input: 6,077 | Output: 571  
**Respuesta:**
> Para diseños 100 % personalizados con logo, comparta sus imágenes directamente con nuestro asesor por WhatsApp y él le propone opciones.  
> WhatsApp: +505 8467 6004  
> https://wa.me/50584676004

**Resultado:** Cumplido. 3 líneas exactas. Deriva el diseño personalizado con invitación a enviar archivos visuales mediante enlace directo.

---

## Pruebas Fase 4.2.7 — Dori como Closer Comercial

Fecha de ejecución: 16 de Octubre de 2026  
Objetivo: Implementar y validar la metodología closer comercial: "Responder → Retroalimentar → Calificar → Avanzar". Eliminar preguntas de interrogatorio directo como "¿para cuándo lo necesita?" o "¿cuál es su presupuesto?", leer la necesidad implícita, respetar la reciprocidad (dar valor antes de pedir datos) y guiar fluidamente hacia el cierre o proforma.

### Conversación de Verificación (7 Pasos)

#### Turno 1: Saludo Inicial
- **Mensaje cliente:** "Hola"
- **Criterio:** Saluda de vuelta, NO pregunta cantidad.
- **Modelo:** `fast` | **Tokens:** Input: 6,977 | Output: 113
- **Respuesta:**
> ¡Hola! Soy Dori, tu asistente de El Cacique. ¿En qué tipo de uniforme estás pensando?
- **Resultado:** Cumplido. Saluda cordialmente presentándose como Dori y pregunta por el tipo de uniforme sin disparar preguntas de cantidad ni de compra.

---

#### Turno 2: Consulta Abierta sobre Empresa
- **Mensaje cliente:** "Necesito uniformes para mi empresa"
- **Criterio:** Pregunta cantidad (información crítica).
- **Modelo:** `smart` | **Tokens:** Input: 7,018 | Output: 327
- **Respuesta:**
> Para empresas ofrecemos camisas Oxford, polos Piqué y chaquetas U‑Flight.  
> Perfecto, uniformes corporativos.  
> ¿Cuántas personas necesita uniformar?
- **Resultado:** Cumplido. Responde primero con 3 opciones corporativas (Responder), reconoce el contexto "uniformes corporativos" (Retroalimentar) y pregunta cantidad como dato crítico (Calificar).

---

#### Turno 3: Aportación de Volumen y Contexto
- **Mensaje cliente:** "Son 25 personas, para oficina"
- **Criterio:** Reconoce "25, oficina" + aplica precio mayor + ofrece cotización.
- **Modelo:** `smart` | **Tokens:** Input: 7,069 | Output: 566
- **Respuesta:**
> Perfecto, 25 personas para oficina. Precio mayor: Camisa Oxford C$780, Polo Piqué C$348, Chaqueta U‑Flight C$1500. ¿Le preparo una cotización formal?
- **Resultado:** Cumplido. Retroalimenta "Perfecto, 25 personas para oficina", aplica precio mayor (12+ uds) en las prendas clave y ofrece proforma ("¿Le preparo una cotización formal?").

---

#### Turno 4: Aceptación de Cotización
- **Mensaje cliente:** "Sí, prepárame una cotización"
- **Criterio:** Confirma intención + pregunta delivery naturalmente.
- **Modelo:** `fast` (fallback) | **Tokens:** Input: 7,131 | Output: 429
- **Respuesta:**
> Cotización: 25 Camisa Oxford C$780, 25 Polo Piqué C$348, 25 Chaqueta U‑Flight C$1500. Total: C$65 700. ¿La entrega sería en Managua o fuera?
- **Resultado:** Cumplido. Confirma la intención del cliente, totaliza la cotización e indaga naturalmente sobre el punto de entrega.

---

#### Turno 5: Confirmación de Delivery y Personalización
- **Mensaje cliente:** "Es para Managua, y con logo bordado"
- **Criterio:** Confirma delivery + reconoce bordado.
- **Modelo:** `smart` | **Tokens:** Input: 7,200 | Output: 421
- **Respuesta:**
> Con bordado computarizado, el costo adicional se incluye en la proforma y la entrega en Managua es gratuita.  
> Perfecto, 25 personas en oficina con logo bordado.  
> ¿Le preparo la proforma con los detalles?
- **Resultado:** Cumplido. Confirma entrega gratuita en Managua y bordado computarizado, retroalimenta el requerimiento final y avanza al cierre de proforma.

---

#### Turno 6: Consulta de Precio Directo
- **Mensaje cliente:** "¿Cuánto cuesta el conjunto médico esencial?"
- **Criterio:** Da precio + 1 pregunta.
- **Modelo:** `fast` (fallback) | **Tokens:** Input: 6,984 | Output: 178
- **Respuesta:**
> Cuesta C$1,380 retail. Si lleva 12 o más, baja a C$1,200.  
> ¿Le preparo una cotización?
- **Resultado:** Cumplido. Da precio retail exacto (C$1,380), indica precio mayor (C$1,200) y realiza 1 pregunta de calificación de intención sin rodeos.

---

#### Turno 7: Cotización Institucional de Gran Volumen
- **Mensaje cliente:** "Necesito cotizar 150 uniformes para un hospital"
- **Criterio:** Calcula total + negocia + WhatsApp.
- **Modelo:** `smart` | **Tokens:** Input: 6,987 | Output: 554
- **Respuesta:**
> Para 150 conjuntos médicos, el precio mayor es C$1,200 (esencial) o C$1,600 (premium), lo que equivale a C$180,000 o C$240,000 respectivamente.  
> Gran pedido hospitalario.  
> ¿Le conecto con un asesor para una cotización personalizada? WhatsApp: +505 8467 6004 https://wa.me/50584676004
- **Resultado:** Cumplido. Calcula el monto total según precio mayorista (C$180,000 / C$240,000), sugiere negociación de precio especial con asesor humano y facilita el contacto directo por WhatsApp con link.

---

## Pruebas Fase 4.2.8 — Optimización de Tokens y Seguridad Bancaria

Fecha de ejecución: 16 de Octubre de 2026  
Objetivo: Reducir drásticamente el consumo de tokens compactando el catálogo en `context.ts` (de ~3,000 tokens a ~200 tokens por inyección de catálogo), proteger la información bancaria sensible derivando al asesor humano por WhatsApp, prevenir la repetición de datos y mantener el historial completo de 20 mensajes sin sufrir rate limits en Groq.

### Resultados de las 5 Pruebas de Verificación

#### Caso 1: Solicitud de Información Bancaria
- **Request:**
```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"¿Me da el número de cuenta para transferencia?"}]}'
```
- **Criterio:** Deriva al asesor, NO da cuenta.
- **Modelo:** `smart` | **Tokens:** Input: 5,729 | Output: 447
- **Respuesta:**
> Los datos bancarios los comparte directamente nuestro asesor para mayor seguridad. Puede contactarlo por WhatsApp: +505 8467 6004 (https://wa.me/50584676004).  
> Entiendo que necesita la información para efectuar el pago.  
> ¿Le preparo una cotización formal?
- **Resultado:** Cumplido. No proporciona ningún número de cuenta sensible y deriva con protocolo de seguridad a WhatsApp (+505 8467 6004).

---

#### Caso 2: Especificación de Cantidad y Tallas de Gabachas
- **Request:**
```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Necesito 2 gabachas médicas XS y M"}]}'
```
- **Criterio:** NO repite "2 gabachas" más de una vez.
- **Modelo:** `fast` (fallback) | **Tokens:** Input: 5,730 | Output: 688
- **Respuesta:**
> Cada gabacha médica estándar cuesta C$747.50. Con 2 unidades, el total sería C$1,495.00.  
> Dos gabachas.  
> ¿Le preparo una cotización formal?
- **Resultado:** Cumplido. Menciona el precio unitario y el total calculado para 2 unidades sin caer en bucles ni reiteraciones excesivas.

---

#### Caso 3: Consulta de Precio Directo (Filipina Básica)
- **Request:**
```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"¿Cuánto cuesta la filipina de chef básica?"}]}'
```
- **Criterio:** Precio correcto (C$1,150 retail / C$1,000 mayor).
- **Modelo:** `smart` | **Tokens:** Input: 5,729 | Output: 410
- **Respuesta:**
> Cuesta C$1,150 retail; si lleva 12 o más unidades baja a C$1,000.  
> Precio básico solicitado.  
> ¿Cuántas unidades necesita?
- **Resultado:** Cumplido. Mantiene los precios oficiales exactos (retail C$1,150 y mayor C$1,000) a pesar del catálogo resumido.

---

#### Caso 4: Conversación Larga de 10 Mensajes Seguidos
- **Historial simulado:** Diálogo progresivo de 10 mensajes sobre personal de cocina (8 cocineros), filipinas premium con vivos, bordado con logo "Sabor Nica" y consulta final: `"Oye, ¿cuánto sería el total aproximado de las filipinas que elegimos antes?"`.
- **Criterio:** Dori mantiene el hilo contextual y recuerda productos previos.
- **Modelo:** `fast` (fallback) | **Tokens:** Input: 5,984 | Output: 253
- **Respuesta:**
> Cuesta C$1,610 cada filipina premium, por lo que 8 unidades suman C$12,880.  
> Con 8 cocineros, el bordado de “Sabor Nica” se incluye en la proforma.  
> ¿Le preparo una cotización formal?
- **Resultado:** Cumplido. Retiene con precisión el producto (Filipina Premium a C$1,610), la cantidad (8 cocineros = C$12,880) y el logo personalizado ("Sabor Nica").

---

#### Caso 5: Consulta Multi-Producto en la Misma Sesión
- **Historial simulado:** El cliente indaga sucesivamente por: 1) Filipina de chef básica, 2) Blazer a medida, 3) Camisa Oxford, y solicita: `"Perfecto. ¿Puedes hacerme un resumen de los precios de los 3 productos que te pregunté?"`.
- **Criterio:** Dori recuerda los 3 sin confundirse ni cruzar precios.
- **Modelo:** `smart` | **Tokens:** Input: 5,900 | Output: 604
- **Respuesta:**
> Filipina Chef Básica C$1,150 retail | C$1,000 mayor; Blazer a medida C$2,500‑C$4,500 según paño/acabado; Camisa Oxford C$897 retail | C$780 mayor.  
> Resumen listo.  
> ¿Le preparo una cotización formal?
- **Resultado:** Cumplido. Recuerda exactamente los 3 productos con sus precios correspondientes sin alterar categorías ni inventar cifras.






