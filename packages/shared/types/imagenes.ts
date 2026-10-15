export type EstadoImagen = 'hotlink' | 'ia' | 'mockup' | 'pendiente_foto' | 'pendiente_ia';

export interface ImagenProducto {
  imagenes: string[];
  alt: string;
  estado: EstadoImagen;
  prompt_ia?: string;
}

export interface ManifiestoImagenes {
  version: string;
  base_url: string;
  transformaciones: {
    card: string;
    detalle: string;
    thumbnail: string;
    hero: string;
  };
  instrucciones: Record<string, unknown>;
  productos: Record<string, ImagenProducto>;
}
