'use client';

import { useState } from 'react';
import { useCartStore } from '../../lib/store/cart';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface Props {
  producto: any;
}

export function ProductActions({ producto }: Props) {
  const addItem = useCartStore((state) => state.addItem);
  
  // Inicializamos con la primera opción disponible o 'N/A'
  const [selectedTalla, setSelectedTalla] = useState(producto.tallas?.[0] || 'N/A');
  const [selectedColor, setSelectedColor] = useState(producto.colores?.[0] || 'N/A');
  const [cantidad, setCantidad] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const precioUnitario = cantidad >= 12 ? producto.precio_mayor : producto.precio_retail;

  const handleAddToCart = () => {
    addItem({
      productoId: producto.id,
      slug: producto.slug,
      nombre: producto.nombre,
      categoria: producto.categoria,
      talla: selectedTalla,
      color: selectedColor,
      bordado: false,
      cantidad: cantidad,
      precioUnitario: precioUnitario,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 mt-6">
      {/* Selector de Talla */}
      {producto.tallas && producto.tallas.length > 0 && (
        <div>
          <span className="text-sm font-semibold text-azul block mb-2">Talla</span>
          <div className="flex flex-wrap gap-2">
            {producto.tallas.map((t: string) => (
              <button
                key={t}
                onClick={() => setSelectedTalla(t)}
                className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  selectedTalla === t ? 'bg-azul text-blanco border-azul' : 'bg-blanco text-marron border-beige-200 hover:border-azul'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selector de Color */}
      {producto.colores && producto.colores.length > 0 && (
        <div>
          <span className="text-sm font-semibold text-azul block mb-2">Color</span>
          <div className="flex flex-wrap gap-2">
            {producto.colores.map((c: string) => (
              <button
                key={c}
                onClick={() => setSelectedColor(c)}
                className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  selectedColor === c ? 'bg-azul text-blanco border-azul' : 'bg-blanco text-marron border-beige-200 hover:border-azul'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selector de Cantidad */}
      <div>
        <span className="text-sm font-semibold text-azul block mb-2">Cantidad</span>
        <div className="flex items-center gap-3">
          <button onClick={() => setCantidad(Math.max(1, cantidad - 1))} className="w-10 h-10 bg-beige-200 rounded-lg font-bold text-azul hover:bg-beige-300 transition-colors">-</button>
          <span className="w-12 text-center font-semibold text-lg text-azul">{cantidad}</span>
          <button onClick={() => setCantidad(cantidad + 1)} className="w-10 h-10 bg-beige-200 rounded-lg font-bold text-azul hover:bg-beige-300 transition-colors">+</button>
          {cantidad >= 12 && <Badge variant="price">Precio Mayor Aplicado</Badge>}
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex flex-col gap-3 mt-4">
        <Button
          variant="primary"
          size="lg"
          onClick={handleAddToCart}
          className={`w-full text-lg shadow-lg transition-all ${isAdded ? '!bg-success hover:!bg-success' : ''}`}
        >
          {isAdded ? '✓ Agregado al carrito' : 'Agregar al Carrito'}
        </Button>
        <Button variant="secondary" size="lg" className="w-full">
          Solicitar Cotización Personalizada
        </Button>
      </div>
    </div>
  );
}
