// Fuente única de verdad para días/horas de entrega.
// Si el negocio cambia, se cambia acá y en ningún otro lado.

export const DEFAULT_LEAD_TIME_DIAS = 7;
export const DEFAULT_REPOSICION_HORAS = 48;

export type EtiquetaEntrega =
  | { tipo: 'inmediata'; texto: 'Entrega inmediata' }
  | { tipo: 'reposicion'; texto: string; horas: number }
  | { tipo: 'bajo_pedido'; texto: string; dias: number }
  | { tipo: 'sin_stock'; texto: 'Sin stock — consultar' };

export function etiquetaEntrega(params: {
  esBajoPedido: boolean;
  leadTimeDias: number | null | undefined;
  tiempoReposicionHoras: number | null | undefined;
}): EtiquetaEntrega {
  if (!params.esBajoPedido) {
    return { tipo: 'inmediata', texto: 'Entrega inmediata' };
  }
  if (params.tiempoReposicionHoras && params.tiempoReposicionHoras > 0) {
    return {
      tipo: 'reposicion',
      texto: `Disponible en ${params.tiempoReposicionHoras}h`,
      horas: params.tiempoReposicionHoras,
    };
  }
  const dias = params.leadTimeDias ?? DEFAULT_LEAD_TIME_DIAS;
  return { tipo: 'bajo_pedido', texto: `Bajo pedido — ${dias} días`, dias };
}
