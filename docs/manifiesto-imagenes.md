# Manifiesto de Imágenes — El Cacique (Fábrica de Uniformes)

Documento técnico del sistema de gestión y entrega de imágenes para el catálogo maestro de 80 prendas de El Cacique.

---

## 1. Arquitectura de Almacenamiento y CDN

- **Proveedor CDN:** ImageKit.io
- **Base URL:** `https://ik.imagekit.io/klfr4wofz/el-cacique`
- **Archivo Fuente:** `packages/shared/data/imagenes.json`
- **Tipado TypeScript:** `packages/shared/types/imagenes.ts`
- **Funciones de Consumo:** `@el-cacique/shared` (`packages/shared/src/index.ts`)

---

## 2. Transformaciones de Imagen

ImageKit procesa y optimiza las imágenes dinámicamente con WebP/AVIF y dimensionamiento exacto:

| Transformación | Parámetro URL | Uso Principal |
| :--- | :--- | :--- |
| `card` | `?tr=w-600,q-80,f-auto` | Tarjetas de catálogo en cuadrícula (`ProductCard`, aspecto 4:5). |
| `detalle` | `?tr=w-1200,q-85,f-auto` | Imagen principal en la ficha de producto (`ProductDetailClient`). |
| `thumbnail` | `?tr=w-200,q-70,f-auto` | Carrito de compras, miniaturas de selección y prefacturas. |
| `hero` | `?tr=w-1920,q-80,f-auto` | Banners de ancho completo y fondos de sección. |

---

## 3. Estados de Imagen (`EstadoImagen`)

Cada entrada en `imagenes.json` tiene un estado que define el origen del recurso:

1. **`hotlink`**: Imagen ya alojada en ImageKit y lista para producción.
2. **`ia`**: Imagen sintetizada mediante modelos de inteligencia artificial y subida al CDN.
3. **`mockup`**: Imagen digital con corte profesional en maniquí invisible.
4. **`pendiente_foto`**: Prenda confeccionada pendiente de sesión fotográfica de taller.
5. **`pendiente_ia`**: Prenda con prompt descriptivo en inglés listo para generación de imagen por IA.

---

## 4. API de Consumo (`@el-cacique/shared`)

```typescript
import {
  getImagenProducto,
  buildImageUrl,
  getUrlsProducto,
  tieneImagenes,
  manifiestoImagenes,
} from '@el-cacique/shared';

// Obtener datos del manifiesto para un SKU específico
const entrada = getImagenProducto('IND-OVE-001');

// Construir URL con transformación
const urlCard = buildImageUrl('productos/ind-ove-001-1.jpg', 'card');

// Obtener array de URLs transformadas
const fotos = getUrlsProducto('MED-TOP-001', 'detalle');

// Verificar si tiene imágenes cargadas
const tieneFotos = tieneImagenes('MED-TOP-001');
```

---

## 5. Componente de Renderizado (`ProductImage`)

Ubicado en `apps/web/src/components/catalog/ProductImage.tsx`:
- Cuando `urls.length > 0`: Utiliza `next/image` con optimización nativa y responsive sizes.
- Cuando `urls.length === 0`: Renderiza automáticamente un fallback con monograma **"C"** de El Cacique sobre fondo suave beige (`bg-beige-200`), nombre del producto y subcategoría.
