export interface Producto {
  id: string;                    // Ej: "MED-TOP-001"
  slug: string;                  // Ej: "top-medico-esencial"
  categoria: string;             // Ej: "medicos"
  subcategoria: string;          // Ej: "Tops y casacas"
  nombre: string;
  descripcion: string;
  sinonimos: string[];           // Para búsqueda del bot
  telas: string[];
  tallas: string[];
  colores: string[];
  variantes?: string[];          // Colores o combinaciones específicas
  moq: number;                   // Mínimo de compra
  precio_retail: number | null;  // null si es rango
  precio_mayor: number | null;   // null si es rango
  precio_min?: number;           // Para productos con rango
  precio_max?: number;           // Para productos con rango
  personalizacion: string[];     // Técnicas disponibles
  garantia: string;              // Ej: "3 meses"
  tiempo_entrega: string;        // Ej: "48–72 horas"
  delivery_gratis: boolean;      // true si aplica casco urbano
  destacado: boolean;            // Para mostrar en home
  tags: string[];                // Ej: ["antifluido", "premium"]
  imagenes?: string[];           // URLs (se llenan en Fase 3)
}

export interface CartItem {
  producto: Producto;
  cantidad: number;
}

export interface CategoriaInfo {
  id: string;
  nombre: string;
  count: number;
}
