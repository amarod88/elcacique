import { productos, getCategorias, getProductoBySlug } from '@el-cacique/shared';
import { SYSTEM_PROMPT } from './data/system-prompt';
import { FAQ } from './data/faq';
import { POLITICAS } from './data/politicas';

interface ContextInput {
  currentPage?: string;
  currentProductSlug?: string;
  cartItemsCount?: number;
}

function formatMoney(amount?: number | null): string {
  if (amount === undefined || amount === null) return '0';
  return amount.toLocaleString('es-NI', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

function buildProductoActual(slug?: string): string {
  if (!slug) return '';

  const producto = getProductoBySlug(slug);
  if (!producto) return '';

  const precio = producto.precio_retail
    ? `Retail C$${producto.precio_retail.toLocaleString('es-NI')} | Mayor C$${producto.precio_mayor?.toLocaleString('es-NI')}`
    : `Rango C$${producto.precio_min?.toLocaleString('es-NI')} - C$${producto.precio_max?.toLocaleString('es-NI')}`;

  return [
    '\n\n[PRODUCTO ACTUAL — CONTEXTO]',
    `El cliente está viendo la ficha de: "${producto.nombre}" (${producto.id})`,
    `Descripción: ${producto.descripcion}`,
    `Telas: ${producto.telas.join(', ')}`,
    `Tallas: ${producto.tallas.join(', ')}`,
    `Colores: ${producto.colores.join(', ')}`,
    `Precio: ${precio}`,
    `MOQ: ${producto.moq}`,
    `Personalización: ${producto.personalizacion.join(', ')}`,
    `Garantía: ${producto.garantia}`,
    `Tiempo de entrega: ${producto.tiempo_entrega}`,
    `Instrucción crítica: Si el cliente pregunta "¿de qué tela es?", "¿cuánto cuesta?", "¿qué tallas hay?" o similar SIN nombrar el producto, asume inmediatamente que se refiere a este producto actual.`,
  ].join('\n');
}

function buildCatalogSummary(): string {
  const categorias = getCategorias();
  const lineas: string[] = ['CATÁLOGO EL CACIQUE (resumen)'];

  for (const cat of categorias) {
    const prods = productos.filter((p) => p.categoria === cat.id);
    const precios = prods
      .filter((p) => p.precio_retail !== null && p.precio_retail !== undefined)
      .map((p) => p.precio_retail as number);
    const preciosMayor = prods
      .filter((p) => p.precio_mayor !== null && p.precio_mayor !== undefined)
      .map((p) => p.precio_mayor as number);

    if (precios.length > 0) {
      const min = Math.min(...precios);
      const max = Math.max(...precios);
      const minMayor = preciosMayor.length > 0 ? Math.min(...preciosMayor) : min;
      const maxMayor = preciosMayor.length > 0 ? Math.max(...preciosMayor) : max;

      lineas.push(
        `${cat.nombre}: ${cat.count} productos. Retail C$${min}-${max}. Mayor C$${minMayor}-${maxMayor}.`
      );
    } else {
      lineas.push(`${cat.nombre}: ${cat.count} productos a medida (cotización por rango).`);
    }
  }

  lineas.push('\nPara precios exactos de un producto, usar la función getProductoBySlug.');

  return lineas.join('\n');
}


export function buildSystemPrompt(context: ContextInput = {}): string {
  const productoActualBlock = buildProductoActual(context.currentProductSlug);

  const contextBlock = [
    '\n\n[CONTEXTO ACTUAL DE NAVEGACIÓN]',
    `Página: ${context.currentPage ?? 'desconocida'}`,
    `Producto actual: ${context.currentProductSlug ?? 'ninguno'}`,
    `Items en carrito: ${context.cartItemsCount ?? 0}`,
  ].join('\n');

  const catalogBlock = '\n\n' + buildCatalogSummary();
  const faqBlock = '\n\n[FAQ]\n' + FAQ;
  const politicasBlock = '\n\n[POLÍTICAS]\n' + POLITICAS;

  return (
    SYSTEM_PROMPT +
    productoActualBlock +
    catalogBlock +
    faqBlock +
    politicasBlock +
    contextBlock
  );
}
