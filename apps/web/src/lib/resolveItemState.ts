import { DEFAULT_LEAD_TIME_DIAS } from './config/entrega';

export type TipoDisponibilidad = 'stock' | 'bajo_pedido' | 'visita_local';
export type ItemMotivo = 'visita_local' | 'stock' | 'stock_bajo' | 'parcial' | 'reposicion' | 'bajo_pedido' | 'sin_stock';

export interface ProductoInfo {
  id: string;
  tipo_disponibilidad: TipoDisponibilidad;
  tiempo_reposicion_horas: number | null;
  lead_time_dias: number | null;
}

export interface VarianteInfo {
  talla: string;
  color: string;
  stock_fisico: number;
}

export interface ItemState {
  canPurchase: boolean;
  esBajoPedido: boolean;
  leadTimeDias: number | null;
  tiempoReposicionHoras: number | null;
  stockDisponible: number | null;
  cantidadEnStock: number;
  cantidadBajoPedido: number;
  motivo: ItemMotivo;
}

export function resolveItemState(
  producto: ProductoInfo,
  variante: VarianteInfo | null,
  cantidad: number
): ItemState {
  const base = { canPurchase: true, leadTimeDias: null, tiempoReposicionHoras: null, stockDisponible: null, cantidadEnStock: 0, cantidadBajoPedido: 0 };

  if (producto.tipo_disponibilidad === 'visita_local') {
    return { ...base, canPurchase: false, esBajoPedido: false, motivo: 'visita_local' };
  }

  if (producto.tipo_disponibilidad === 'bajo_pedido' || !variante) {
    return {
      ...base,
      esBajoPedido: true,
      leadTimeDias: producto.lead_time_dias ?? DEFAULT_LEAD_TIME_DIAS,
      cantidadBajoPedido: cantidad,
      motivo: 'bajo_pedido',
    };
  }

  const stock = variante.stock_fisico;
  const reposicion = producto.tiempo_reposicion_horas;

  // Caso ideal: hay stock para todo
  if (stock >= cantidad) {
    return {
      ...base,
      esBajoPedido: false,
      stockDisponible: stock,
      cantidadEnStock: cantidad,
      motivo: stock > 10 ? 'stock' : 'stock_bajo',
    };
  }

  // Hay algo de stock, pero no todo
  if (stock > 0 && reposicion && reposicion > 0) {
    return {
      ...base,
      esBajoPedido: true, // el item se considera mixto
      tiempoReposicionHoras: reposicion,
      stockDisponible: stock,
      cantidadEnStock: stock,
      cantidadBajoPedido: cantidad - stock,
      motivo: 'parcial',
    };
  }

  // No hay stock, pero hay reposición
  if (stock === 0 && reposicion && reposicion > 0) {
    return {
      ...base,
      esBajoPedido: true,
      tiempoReposicionHoras: reposicion,
      stockDisponible: 0,
      cantidadBajoPedido: cantidad,
      motivo: 'reposicion',
    };
  }

  // Sin stock y sin reposición
  return {
    ...base,
    canPurchase: false,
    esBajoPedido: true,
    leadTimeDias: producto.lead_time_dias ?? DEFAULT_LEAD_TIME_DIAS,
    stockDisponible: 0,
    cantidadBajoPedido: cantidad,
    motivo: 'sin_stock',
  };
}
