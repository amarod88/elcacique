export type EstadoImagen = 'hotlink' | 'ia' | 'mockup' | 'pendiente_foto' | 'pendiente_ia' | string;

export interface ReferenciaDetalle {
  url: string;
  vista?: string;
  modelo_genero?: string;
  coincidencia_estimativa?: string;
  verificacion?: string;
  tipo_url?: string;
}

export interface ImagenProducto {
  imagenes: string[];
  alt: string;
  estado: EstadoImagen;
  prompt_ia?: string;
  audiencia_objetivo?: string;
  referencias_detalle?: ReferenciaDetalle[];
  coincidencia_estimativa?: string;
  nota_curaduria?: string;
}

export interface ManifiestoImagenes {
  version: string;
  base_url?: string;
  transformaciones?: {
    card?: string;
    detalle?: string;
    thumbnail?: string;
    hero?: string;
  } | Record<string, string>;
  nombre?: string;
  proposito?: string;
  cantidad_productos?: number;
  cantidad_hotlinks?: number;
  advertencia?: string;
  reglas_integracion?: string[];
  instrucciones?: Record<string, unknown>;
  productos: Record<string, ImagenProducto>;
}
