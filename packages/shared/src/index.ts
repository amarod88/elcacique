import { Producto, CartItem, CategoriaInfo } from '../types/index';
import { productos } from '../data/index';
import imagenesRaw from '../data/imagenes.json';
import type { ManifiestoImagenes, ImagenProducto } from '../types/imagenes';

export * from '../types/index';
export * from '../types/imagenes';
export * from '../data/index';

export const manifiestoImagenes = imagenesRaw as ManifiestoImagenes;

/**
 * Obtener la entrada del manifiesto por ID de producto.
 */
export function getImagenProducto(id: string): ImagenProducto | null {
  return manifiestoImagenes.productos[id] ?? null;
}

/**
 * Construir URL completa de una imagen con transformación de ImageKit.
 */
export function buildImageUrl(
  rutaRelativa: string,
  transformacion: 'card' | 'detalle' | 'thumbnail' | 'hero' = 'card'
): string {
  const base = manifiestoImagenes.base_url.replace(/\/$/, '');
  const ruta = rutaRelativa.replace(/^\//, '');
  const tr = manifiestoImagenes.transformaciones[transformacion] || '';
  return `${base}/${ruta}${tr}`;
}

/**
 * Obtener todas las URLs de imágenes de un producto.
 */
export function getUrlsProducto(
  id: string,
  transformacion: 'card' | 'detalle' | 'thumbnail' | 'hero' = 'card'
): string[] {
  const entrada = getImagenProducto(id);
  if (!entrada || !entrada.imagenes || entrada.imagenes.length === 0) return [];
  return entrada.imagenes.map((ruta) => buildImageUrl(ruta, transformacion));
}

/**
 * Verificar si un producto tiene imágenes cargadas.
 */
export function tieneImagenes(id: string): boolean {
  const entrada = getImagenProducto(id);
  return !!entrada && entrada.imagenes.length > 0;
}

const CATEGORIA_NOMBRES: Record<string, string> = {
  medicos: 'Médicos y Salud',
  corporativos: 'Corporativos y Oficina',
  sastreria: 'Sastrería a Medida',
  industriales: 'Industriales y Seguridad',
  gastronomia: 'Gastronomía y Cocina',
  escolares: 'Uniformes Escolares',
  deportivos: 'Deportivos y Sudaderas',
  accesorios: 'Accesorios y Gorras',
};

/**
 * Busca un producto por su slug único.
 */
export function getProductoBySlug(slug: string): Producto | undefined {
  if (!slug) return undefined;
  const cleanSlug = slug.toLowerCase().trim();
  return productos.find((p) => p.slug.toLowerCase() === cleanSlug);
}

/**
 * Filtra productos por identificador de categoría.
 */
export function getProductosByCategoria(categoria: string): Producto[] {
  if (!categoria) return [];
  const cleanCat = categoria.toLowerCase().trim();
  return productos.filter((p) => p.categoria.toLowerCase() === cleanCat);
}

/**
 * Normaliza texto eliminando acentos/tildes y convirtiendo a minúsculas.
 */
export function normalizeText(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

/**
 * Búsqueda de productos por texto libre (nombre, sinónimos, tags y descripción).
 */
export function searchProductos(query: string): Producto[] {
  if (!query || !query.trim()) return [];
  const cleanQuery = normalizeText(query.trim());
  const words = cleanQuery.split(/\s+/).filter(Boolean);

  return productos.filter((p) => {
    const textPool = normalizeText(
      [
        p.nombre,
        p.slug,
        p.subcategoria,
        p.descripcion,
        ...p.sinonimos,
        ...p.tags,
        ...p.telas,
      ].join(' ')
    );

    return words.every((word) => textPool.includes(word));
  });
}

/**
 * Calcula el precio unitario de un producto según el volumen solicitado.
 * - Cantidad < 12: aplica precio_retail.
 * - Cantidad >= 12: aplica precio_mayor.
 * - Para productos con rango (sastrería / alta gama): retorna precio_min como base de cotización.
 */
export function calcularPrecio(producto: Producto, cantidad: number): number {
  if (cantidad <= 0) return 0;

  // Productos con rango de precio (sastrería o alta gama)
  if (producto.precio_retail === null || producto.precio_mayor === null) {
    return producto.precio_min ?? 0;
  }

  // Descuento por mayoreo a partir de 12 unidades
  if (cantidad >= 12) {
    return producto.precio_mayor;
  }

  return producto.precio_retail;
}

/**
 * Calcula el monto total del carrito sumando el subtotal de cada ítem según su cantidad.
 */
export function calcularTotal(items: CartItem[]): number {
  if (!items || items.length === 0) return 0;

  const total = items.reduce((acc, item) => {
    const unitPrice = calcularPrecio(item.producto, item.cantidad);
    return acc + unitPrice * item.cantidad;
  }, 0);

  return Math.round(total * 100) / 100;
}

/**
 * Obtiene todos los productos marcados como destacados para la vitrina principal.
 */
export function getProductosDestacados(): Producto[] {
  return productos.filter((p) => p.destacado);
}

/**
 * Obtiene el listado consolidado de categorías con su nombre visible y conteo de productos.
 */
export function getCategorias(): CategoriaInfo[] {
  const conteo: Record<string, number> = {};

  for (const prod of productos) {
    conteo[prod.categoria] = (conteo[prod.categoria] || 0) + 1;
  }

  return Object.entries(conteo).map(([id, count]) => ({
    id,
    nombre: CATEGORIA_NOMBRES[id] || id,
    count,
  }));
}
