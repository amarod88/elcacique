# Control de Imágenes Pendientes — El Cacique

Inventario del estado visual de los 80 productos del catálogo maestro de El Cacique.

---

## 1. Resumen Estadístico

| Categoría | Total Productos | Con Prompt IA | Estado Principal |
| :--- | :---: | :---: | :--- |
| **Médicos y Salud** | 17 | 0 | `pendiente_foto` (producción de taller) |
| **Corporativos y Oficina** | 13 | 0 | `pendiente_foto` (producción de taller) |
| **Sastrería a Medida** | 4 | 4 | `pendiente_foto` + prompt IA disponible |
| **Industriales y Seguridad** | 16 | 16 | `pendiente_ia` (prompts listos) |
| **Gastronomía y Cocina** | 8 | 8 | `pendiente_ia` (prompts listos) |
| **Uniformes Escolares** | 8 | 8 | `pendiente_ia` (prompts listos) |
| **Deportivos y Sudaderas** | 8 | 8 | `pendiente_ia` (prompts listos) |
| **Accesorios y Gorras** | 6 | 6 | `pendiente_ia` (prompts listos) |
| **TOTAL** | **80** | **50** | **100% categorizado con fallback visual** |

---

## 2. Productos con Prompts IA Listos (`pendiente_ia`)

### Industriales y Seguridad
- `IND-OVE-001` (Overol industrial heavy duty): `"Heavy duty industrial coverall, navy blue, front view on invisible mannequin, white studio background, catalog photo, high detail."`
- `IND-OVE-002` (Overol industrial premium con cintas 3M): `"Premium industrial coverall with 3M reflective stripes, orange and navy, front view, white studio background, catalog photo."`
- `IND-CHA-001` (Chaleco industrial reflectivo liso): `"Industrial safety vest, navy blue solid, with 2-inch reflective stripes, front view, white studio background, catalog photo."`
- `IND-CHA-002` (Chaleco brigadista alta visibilidad): `"High visibility emergency brigade vest, neon yellow and orange, multi-pocket, front view, white studio background, catalog photo."`
- `IND-CAM-001` (Camisa industrial manga larga reflectiva): `"Industrial work shirt, long sleeve, navy blue with reflective stripe across chest and sleeves, front view on invisible mannequin, studio catalog."`
- `IND-CAM-002` (Camisa industrial dos tonos gabardina): `"Two-tone industrial work shirt, navy blue and safety orange, button-up, front view on invisible mannequin, white studio background."`
- `IND-PAN-001` (Pantalón comando 6 bolsillos gabardina): `"Heavy duty tactical cargo work pants, 6 pockets, navy blue, flat front view, studio catalog photo."`
- `IND-PAN-002` (Pantalón industrial con cintas reflectivas): `"Industrial cargo work pants with double reflective stripes below knees, navy blue, flat front view, studio catalog photo."`
- `IND-BAP-001` (3-Pack Overoles industriales heavy duty): `"3-pack heavy duty industrial coveralls neatly stacked and displayed, navy blue, commercial product catalog photo."`
- `IND-BAP-002` (3-Pack Overoles industriales reflectivos): `"3-pack industrial coveralls with 3M reflective tape neatly arranged, safety colors, commercial product catalog photo."`
- `IND-BAP-003` (3-Pack Chalecos reflectivos lisos): `"3-pack safety vests neatly arranged, high visibility neon colors, product catalog photo."`
- `IND-BAP-004` (3-Pack Chalecos brigadistas): `"3-pack brigade emergency vests arranged neatly, multi-pocket, commercial product photo."`
- `IND-BAP-005` (3-Pack Camisas industriales manga larga): `"3-pack long sleeve industrial shirts folded neatly, navy blue and grey, commercial catalog photo."`
- `IND-BAP-006` (3-Pack Camisas industriales dos tonos): `"3-pack two-tone industrial work shirts neatly folded, product catalog lighting."`
- `IND-BAP-007` (3-Pack Pantalones comando 6 bolsillos): `"3-pack tactical cargo work pants neatly stacked, heavy duty gabardine, studio catalog photo."`
- `IND-BAP-008` (3-Pack Pantalones reflectivos): `"3-pack reflective safety cargo pants neatly displayed, commercial product studio lighting."`

### Gastronomía y Cocina
- `GAS-FIL-001` (Filipina de chef broche ejecutiva): `"Executive chef jacket with metal press studs, black with white piping, mandarin collar, front view on invisible mannequin, white studio background."`
- `GAS-FIL-002` (Filipina de chef botón tradicional): `"Traditional chef jacket with cloth knot buttons, double breasted, pure white, front view on invisible mannequin, studio lighting."`
- `GAS-FIL-003` (Filipina de chef malla respirable): `"Modern chef jacket with breathable mesh back and side panels, charcoal grey, front view on invisible mannequin, studio lighting."`
- `GAS-PAN-001` (Pantalón de cocina elástico gabardina): `"Chef kitchen pants with elastic waist and drawstring, black and white houndstooth pattern, flat front view, studio catalog photo."`
- `GAS-MAN-001` (Mandil con peto chef 3 bolsillos): `"Full bib chef apron with adjustable neck strap and 3 utility pockets, dark brown canvas, front view on invisible mannequin, studio catalog."`
- `GAS-MAN-002` (Mandil de cintura medio cuerpo): `"Half bistro waist apron with divided front pocket, black cotton-poly blend, front view on invisible mannequin, studio catalog photo."`
- `GAS-GOR-001` (Gorro de chef alto hongo tradicional): `"Traditional tall chef hat toque blanche, pleated white cotton, studio product catalog photo."`
- `GAS-GOR-002` (Gorro tipo bandana pirata cocina): `"Culinary skull cap pirate style tie-back bandana, black breathable fabric, studio product catalog photo."`

---

## 3. Plan de Actualización Visual

1. **Fase Actual (Completada):** Todos los 80 productos cuentan con su entrada normalizada en `imagenes.json` y el componente `ProductImage` renderiza el fallback institucional con monograma `C`.
2. **Carga en ImageKit:** A medida que se tomen fotografías o se generen mockups con IA, solo se actualiza la ruta en `imagenes.json` (ejemplo: `"imagenes": ["productos/med-top-001-1.webp"]`) y el estado a `"hotlink"` o `"ia"`.
3. **Cero impacto en frontend:** Las URLs se ensamblan dinámicamente con transformaciones optimizadas sin necesidad de alterar componentes React.
