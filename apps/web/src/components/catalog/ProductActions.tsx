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
    addItem({
      productoId: producto.id,
      slug: producto.slug,
      nombre: producto.nombre,
      categoria: producto.categoria,
      talla: selectedTalla,
      color: selectedColor,
      bordado: false,
      cantidad,
      precioUnitario,
      esBajoPedido: state.esBajoPedido,
      leadTimeDias: state.leadTimeDias,
      tiempoReposicionHoras: state.tiempoReposicionHoras,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const buttonConfig = (() => {
    switch (state.motivo) {
      case 'visita_local':
        return { label: 'Solicitar Cotización', variant: 'secondary' as const, disabled: false, isLink: '/contacto' as string | null };
      case 'stock':
      case 'stock_bajo':
        return { label: isAdded ? '✓ Agregado al carrito' : 'Agregar al Carrito', variant: 'primary' as const, disabled: false, isLink: null };
      case 'bajo_pedido':
        return { label: `Ordenar bajo pedido (${state.leadTimeDias} días)`, variant: 'primary' as const, disabled: false, isLink: null };
      case 'reposicion':
        return { label: `Reservar (${state.tiempoReposicionHoras}h)`, variant: 'primary' as const, disabled: false, isLink: null };
      case 'sin_stock':
        return { label: 'Sin stock — Consultar', variant: 'secondary' as const, disabled: true, isLink: null };
    }
  })();

  const alerta = (() => {
    switch (state.motivo) {
      case 'stock_bajo':
        return { texto: `⚠️ Últimos ${state.stockDisponible} en stock`, tono: 'warn' as const };
      case 'reposicion':
        return { texto: `Agotado. Disponible en ${state.tiempoReposicionHoras}h si lo pedís ahora.`, tono: 'error' as const };
      case 'bajo_pedido':
        return { texto: `Se fabrica a tu medida. Entrega estimada en ${state.leadTimeDias} días.`, tono: 'info' as const };
      case 'sin_stock':
        return { texto: 'Agotado. Consultá disponibilidad con un asesor.', tono: 'error' as const };
      case 'visita_local':
        return { texto: 'Producto a medida. Te esperamos en tienda o contactá a un asesor.', tono: 'info' as const };
      default:
        return null;
    }
  })();

  return (
    <div className="flex flex-col gap-6 mt-6">
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
        <div
          className={`text-sm px-4 py-3 rounded-lg border ${
            alerta.tono === 'warn'
              ? 'bg-beige-200 text-marron border-beige-300'
              : alerta.tono === 'error'
              ? 'bg-blanco text-vino border-vino'
              : 'bg-blanco text-azul border-azul'
          }`}
        >
          {alerta.texto}
        </div>
      )}

      <div className="flex flex-col gap-3 mt-4">
        {buttonConfig.isLink ? (
          <Link href={buttonConfig.isLink} className="block">
            <Button variant={buttonConfig.variant} size="lg" className="w-full text-lg">
              {buttonConfig.label}
            </Button>
          </Link>
        ) : (
          <Button
            variant={buttonConfig.variant}
            size="lg"
            onClick={handleAddToCart}
            className={`w-full text-lg shadow-lg transition-all ${
              buttonConfig.disabled ? 'opacity-50 cursor-not-allowed' : ''
            } ${isAdded ? '!bg-success hover:!bg-success' : ''}`}
          >
            {buttonConfig.label}
          </Button>
        )}
        <Button variant="secondary" size="lg" className="w-full">
          Solicitar Cotización Personalizada
        </Button>
      </div>
    </div>
  );
}
