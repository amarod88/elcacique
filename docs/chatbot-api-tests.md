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
