# Sistema de Diseño — El Cacique (Fábrica de Uniformes)

Documentación técnica y reglas de diseño para la plataforma web de El Cacique.

---

## 1. Tokens de Diseño

Los tokens están implementados en `apps/web/src/app/globals.css` mediante la directiva `@theme` de Tailwind CSS 4.

### 1.1. Paleta de Colores

| Token | Valor Hex | Rol y Uso Principal |
| :--- | :---: | :--- |
| `--color-beige` | `#F5F0E8` | Color de fondo principal (canvas neutro 60%). |
| `--color-beige-100` | `#FAF7F0` | Fondo de tarjetas planas y paneles secundarios. |
| `--color-beige-200` | `#EDE6D6` | Bordes suaves y divisores de contenido. |
| `--color-azul` | `#1B3A5C` | Color estructural de marca (headers, títulos h1-h6, navegación). |
| `--color-azul-700` | `#12283F` | Fondo de footer, secciones de alto contraste y hero video. |
| `--color-azul-500` | `#2D5A87` | Color de acento informativo y estados activos secundarios. |
| `--color-vino` | `#722F37` | Acento comercial de alta conversión y botones CTA principales. |
| `--color-vino-600` | `#5C252C` | Estado hover de botones y elementos interactivos primarios. |
| `--color-vino-400` | `#8E4149` | Estados activos y bordes sutiles de acento. |
| `--color-celeste` | `#A8D5E5` | Highlights visuales, badges de categorías e insignias. |
| `--color-celeste-100` | `#D6EBF2` | Fondos de etiquetas de categoría y textos de apoyo en fondos oscuros. |
| `--color-marron` | `#5C4033` | Color principal de lectura para párrafos de texto (WCAG AA). |
| `--color-marron-400` | `#8A6B5C` | Metadatos secundarios, SKUs y etiquetas de ayuda. |
| `--color-success` | `#2F7D4F` | Alertas de éxito, descuentos por mayor aplicados y badges nuevos. |
| `--color-warning` | `#C68A2E` | Advertencias de inventario o tiempo de entrega especial. |
| `--color-error` | `#A32C2C` | Mensajes de error en validaciones de formulario. |
| `--color-blanco` | `#FFFFFF` | Superficie de tarjetas elevadas e inputs de formulario. |
| `--color-negro` | `#0F0F0F` | Contraste máximo para texto técnico. |

### 1.2. Tipografía y Jerarquía

- **Display Face:** `DM Serif Display` (peso 400).
  - Utilizado en todos los encabezados principales (`h1`, `h2`, `h3`, `h4`), precios destacados y logotipo de marca.
- **Body Face:** `Inter` (pesos 400, 500, 600, 700).
  - Utilizado en párrafos de texto, botones, fichas técnicas y controles de navegación.

### 1.3. Escala de Radios y Sombras

- **Radios:**
  - `rounded-md` (`0.5rem` / 8px): Controles pequeños y botones secundarios.
  - `rounded-lg` (`0.75rem` / 12px): Botones principales, inputs y selectores.
  - `rounded-xl` (`1rem` / 16px): Tarjetas de catálogo y paneles modulares.
  - `rounded-2xl` (`1.5rem` / 24px): Bloques destacados y contenedores de sección.
  - `rounded-full` (9999px): Badges, avatares y píldoras de navegación.
- **Sombras:**
  - `shadow-sm`: Elevación mínima para botones y chips.
  - `shadow-md`: Elevación estándar para tarjetas de catálogo (`Card elevated`).
  - `shadow-lg`: Elevación al hacer hover en tarjetas interactivas.

---

## 2. Componentes Atómicos (`apps/web/src/components/ui/`)

### 2.1. `Button`
- **Props:**
  - `variant`: `'primary'` | `'secondary'` | `'ghost'` | `'link'` (default: `'primary'`)
  - `size`: `'sm'` (32px) | `'md'` (40px) | `'lg'` (48px) (default: `'md'`)
  - `href`: `string` opcional (renderiza un `Link` de Next.js accesible)
  - `loading`: `boolean` opcional (muestra spinner integrado)
  - `disabled`: `boolean` opcional (aplica opacidad 50% y anula eventos)
  - `onClick`: `() => void`
  - `children`: contenido del botón
- **Ejemplo:**
  ```tsx
  <Button variant="primary" size="lg" href="/cotizacion">
    Solicitar cotización
  </Button>
  ```

### 2.2. `Card`
- **Props:**
  - `variant`: `'elevated'` (blanco con sombra) | `'flat'` (beige con borde) | `'outlined'` (blanco con borde azul)
  - `children`: `React.ReactNode`
- **Ejemplo:**
  ```tsx
  <Card variant="elevated" className="p-6">
    <h3>Contenido modular</h3>
  </Card>
  ```

### 2.3. `Badge`
- **Props:**
  - `variant`: `'category'` (celeste) | `'price'` (vino) | `'new'` (verde) | `'premium'` (vino con borde) | `'default'` (gris)
  - `children`: texto de la etiqueta
- **Ejemplo:**
  ```tsx
  <Badge variant="category">Uniformes Médicos</Badge>
  ```

### 2.4. `Input`, `Textarea`, `Select`
- **Props comunes:**
  - `label`: etiqueta visible en la parte superior
  - `error`: mensaje de error (activa borde rojo y texto de validación)
  - `helperText`: texto descriptivo complementario
  - `disabled`: desactiva el control con cursor no permitido
- **Ejemplo:**
  ```tsx
  <Input
    label="Correo Electrónico"
    type="email"
    placeholder="correo@ejemplo.com"
    required
  />
  ```

### 2.5. `Container`, `Section`, `SectionTitle`
- **`Container`:** Ancho máximo de 1200px con padding horizontal responsivo (`px-4 sm:px-6 lg:px-8`).
- **`Section`:** Bloque vertical con variantes `'beige'`, `'blanco'`, `'azul'` y padding adaptativo (`py-16 md:py-24`).
- **`SectionTitle`:** Título `font-display`, subtítulo balanceado y badge contextual con alineación `'center'` o `'left'`.

---

## 3. Componentes de Catálogo y Producto (`apps/web/src/components/catalog/`)

### 3.1. `ProductCard`
Tarjeta de presentación de producto con imagen en relación de aspecto 4:5, badges automáticos de categoría y bordado, cálculo de precio "desde", elevación interactiva al cursor y enlace a `/producto/[slug]`.

### 3.2. `CategoryCard`
Tarjeta de acceso rápido por sector con ícono vectorial SVG representativo, nombre de categoría, conteo dinámico de modelos disponibles y hover de transición a azul marino con texto blanco.

### 3.3. `PriceTag`
Renderizador de precios que distingue automáticamente:
- **Precios fijos minoristas y mayoristas:** Aplica la tarifa según el volumen (`< 12` unidades = retail; `>= 12` unidades = mayorista).
- **Precios de rango a medida:** Muestra "C$min – C$max" con aviso de confección personalizada.

---

## 4. Componente Hero (`apps/web/src/components/hero/HeroVideo.tsx`)

- **Video Streaming:** Integración con CDN de ImageKit en formato WebM y MP4 optimizado por dispositivo.
- **Overlay:** Filtro de azul institucional al 45% (`bg-azul/45`) para garantizar legibilidad de titulares de acuerdo a la norma WCAG AA.
- **Transición Temporal:** El contenido textual y los botones de llamada a la acción emergen a los 4 segundos con animación suave (`animate-fade-in-delayed`).
- **Fallback Resiliente:** En caso de falla de red o bloqueo de video, conmuta automáticamente al póster de alta definición con el texto visible.

---

## 5. Reglas de Accesibilidad y Responsive

1. **Contraste de Color:**
   - Todo texto de cuerpo (`color-marron`) sobre fondo beige (`color-beige`) supera un ratio de contraste de 4.8:1 (WCAG AA).
   - Textos de titulares blancos sobre fondo azul superan un ratio de 9.5:1 (WCAG AAA).
2. **Áreas de Toque (Touch Targets):**
   - Todos los botones interactivos tienen una altura mínima de 40px en desktop y 44px en móviles.
3. **Foco Teclado Visible:**
   - Todos los elementos interactivos (`button`, `a`, `input`, `select`) poseen anillos de enfoque `focus-visible:ring-2 focus-visible:ring-azul`.
4. **Breakpoints Oficiales:**
   - `sm`: 640px (teléfonos grandes)
   - `md`: 768px (tablets y menú móvil colapsado)
   - `lg`: 1024px (laptops y cuadrículas de 3–4 columnas)
   - `xl`: 1280px (pantallas de escritorio)
