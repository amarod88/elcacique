'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '../../lib/store/cart';
import { resolveItemState, type VarianteInfo } from '../../lib/resolveItemState';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface Props {
  producto: any;
  variantes: VarianteInfo[];
}

export function ProductActions({ producto, variantes }: Props) {
  const addItem = useCartStore((state) => state.addItem);
  const [selectedTalla, setSelectedTalla] = useState(producto.tallas?.[0] || 'N/A');
  const [selectedColor, setSelectedColor] = useState(producto.colores?.[0] || 'N/A');
  const [cantidad, setCantidad] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const precioUnitario = cantidad >= 12 ? producto.precio_mayor : producto.precio_retail;
  const varianteSeleccionada = variantes.find((v) => v.talla === selectedTalla && v.color === selectedColor) ?? null;
  const state = resolveItemState(producto, varianteSeleccionada, cantidad);

  const handleAddToCart = () => {
    if (!state.canPurchase) return;

    // Si hay stock disponible, lo agregamos como entrega inmediata
    if (state.cantidadEnStock > 0) {
      addItem({
        productoId: producto.id, slug: producto.slug, nombre: producto.nombre, categoria: producto.categoria,
        talla: selectedTalla, color: selectedColor, bordado: false,
        cantidad: state.cantidadEnStock, precioUnitario,
        esBajoPedido: false, leadTimeDias: null, tiempoReposicionHoras: null,
      });
    }

    // Si hay pendientes por reponer, los agregamos como bajo pedido
    if (state.cantidadBajoPedido > 0) {
      addItem({
        productoId: producto.id, slug: producto.slug, nombre: producto.nombre, categoria: producto.categoria,
        talla: selectedTalla, color: selectedColor, bordado: false,
        cantidad: state.cantidadBajoPedido, precioUnitario,
        esBajoPedido: true, leadTimeDias: state.leadTimeDias, tiempoReposicionHoras: state.tiempoReposicionHoras,
      });
    }

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const alerta = (() => {
    switch (state.motivo) {
      case 'stock_bajo': return { texto: `⚠️ Últimos ${state.stockDisponible} en stock`, tono: 'warn' };
      case 'parcial': return { texto: `Límite de stock alcanzado. Hay ${state.cantidadEnStock} en tienda y ${state.cantidadBajoPedido} irán a producción (${state.tiempoReposicionHoras}h).`, tono: 'warn' };
      case 'reposicion': return { texto: `Agotado. Disponible en ${state.tiempoReposicionHoras}h si lo pedís ahora.`, tono: 'error' };
      case 'bajo_pedido': return { texto: `Se fabrica a tu medida. Entrega estimada en ${state.leadTimeDias} días.`, tono: 'info' };
      case 'sin_stock': return { texto: 'Agotado. Consultá disponibilidad con un asesor.', tono: 'error' };
      case 'visita_local': return { texto: 'Producto a medida. Te esperamos en tienda o contactá a un asesor.', tono: 'info' };
      default: return null;
    }
  })();

  return (
    <div className="flex flex-col gap-6 mt-6">
      {producto.tallas && producto.tallas.length > 0 && (
        <div>
          <span className="text-sm font-semibold text-azul block mb-2">Talla</span>
          <div className="flex flex-wrap gap-2">
            {producto.tallas.map((t: string) => (
              <button key={t} onClick={() => setSelectedTalla(t)} className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${selectedTalla === t ? 'bg-azul text-blanco border-azul' : 'bg-blanco text-marron border-beige-200 hover:border-azul'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {producto.colores && producto.colores.length > 0 && (
        <div>
          <span className="text-sm font-semibold text-azul block mb-2">Color</span>
          <div className="flex flex-wrap gap-2">
            {producto.colores.map((c: string) => (
              <button key={c} onClick={() => setSelectedColor(c)} className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${selectedColor === c ? 'bg-azul text-blanco border-azul' : 'bg-blanco text-marron border-beige-200 hover:border-azul'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <span className="text-sm font-semibold text-azul block mb-2">Cantidad</span>
        <div className="flex items-center gap-3">
          <button onClick={() => setCantidad(Math.max(1, cantidad - 1))} className="w-10 h-10 bg-beige-200 rounded-lg font-bold text-azul hover:bg-beige-300 transition-colors">-</button>
          <span className="w-12 text-center font-semibold text-lg text-azul">{cantidad}</span>
          <button onClick={() => setCantidad(cantidad + 1)} className="w-10 h-10 bg-beige-200 rounded-lg font-bold text-azul hover:bg-beige-300 transition-colors">+</button>
          {cantidad >= 12 && <Badge variant="price">Precio Mayor Aplicado</Badge>}
        </div>
      </div>

      {alerta && (
        <div className={`text-sm px-4 py-3 rounded-lg border ${alerta.tono === 'warn' ? 'bg-beige-200 text-marron border-beige-300' : alerta.tono === 'error' ? 'bg-blanco text-vino border-vino' : 'bg-blanco text-azul border-azul'}`}>
          {alerta.texto}
        </div>
      )}

      <div className="flex flex-col gap-3 mt-4">
        {state.motivo === 'visita_local' ? (
          <Link href="/contacto" className="block"><Button variant="secondary" size="lg" className="w-full text-lg">Solicitar Cotización</Button></Link>
        ) : (
          <Button variant="primary" size="lg" onClick={handleAddToCart} className={`w-full text-lg shadow-lg transition-all ${!state.canPurchase ? 'opacity-50 cursor-not-allowed' : ''} ${isAdded ? '!bg-success hover:!bg-success' : ''}`}>
            {isAdded ? '✓ Agregado al carrito' : state.motivo === 'sin_stock' ? 'Sin stock — Consultar' : 'Agregar al Carrito'}
          </Button>
        )}
        <Button variant="secondary" size="lg" className="w-full">Solicitar Cotización Personalizada</Button>
      </div>
    </div>
  );
}
