import { DEFAULT_LEAD_TIME_DIAS, DEFAULT_REPOSICION_HORAS } from './config/entrega';

export type TipoDisponibilidad = 'stock' | 'bajo_pedido' | 'visita_local';

export type ItemMotivo =
  | 'visita_local'
  | 'stock'
  | 'stock_bajo'
  | 'reposicion'
  | 'bajo_pedido'
  | 'sin_stock';

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
  motivo: ItemMotivo;
}

export function resolveItemState(
  producto: ProductoInfo,
  variante: VarianteInfo | null,
  cantidad: number
): ItemState {
  if (producto.tipo_disponibilidad === 'visita_local') {
    return {
      canPurchase: false,
      esBajoPedido: false,
      leadTimeDias: null,
      tiempoReposicionHoras: null,
      stockDisponible: null,
      motivo: 'visita_local',
    };
  }

  if (producto.tipo_disponibilidad === 'bajo_pedido' || !variante) {
    return {
      canPurchase: true,
      esBajoPedido: true,
      leadTimeDias: producto.lead_time_dias ?? DEFAULT_LEAD_TIME_DIAS,
      tiempoReposicionHoras: null,
      stockDisponible: null,
      motivo: 'bajo_pedido',
    };
  }

  if (variante.stock_fisico >= cantidad) {
    return {
      canPurchase: true,
      esBajoPedido: false,
      leadTimeDias: null,
      tiempoReposicionHoras: null,
      stockDisponible: variante.stock_fisico,
      motivo: variante.stock_fisico > 10 ? 'stock' : 'stock_bajo',
    };
  }

  const reposicion = producto.tiempo_reposicion_horas ?? null;
  if (reposicion && reposicion > 0) {
    return {
      canPurchase: true,
      esBajoPedido: true,
      leadTimeDias: null,
      tiempoReposicionHoras: reposicion,
      stockDisponible: variante.stock_fisico,
      motivo: 'reposicion',
    };
  }

  return {
    canPurchase: false,
    esBajoPedido: true,
    leadTimeDias: producto.lead_time_dias ?? DEFAULT_LEAD_TIME_DIAS,
    tiempoReposicionHoras: null,
    stockDisponible: 0,
    motivo: 'sin_stock',
  };
}
