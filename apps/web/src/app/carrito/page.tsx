'use client';

import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { ProductImage } from '../../components/catalog/ProductImage';
import { useCartStore } from '../../lib/store/cart';
import { PayPalButton } from '../../components/cart/PayPalButton';
import { etiquetaEntrega } from '../../lib/config/entrega';

const emptySubscribe = () => () => {};

export default function CarritoPage() {
  const isHydrated = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const total = useCartStore((state) => state.total);

  const [isSuccess, setIsSuccess] = useState(false);

  if (!isHydrated) return null;

  const handleConfirmOrder = () => setIsSuccess(true);

  if (isSuccess) {
    return (
      <div className="bg-beige min-h-screen py-16 flex items-center justify-center">
        <Container>
          <div className="bg-blanco p-12 rounded-2xl shadow-lg border border-azul/10 text-center max-w-lg mx-auto">
            <h1 className="font-display text-3xl text-azul mb-4">Prefactura Generada</h1>
            <p className="text-marron-400 text-sm leading-relaxed mb-8">
              Un asesor confirmará tiempos, stock exacto y detalles antes de proceder a cualquier pago o anticipo.
            </p>
            <Link href="/catalogo"><Button variant="primary" size="lg">Seguir explorando catálogo</Button></Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-beige min-h-screen py-16">
      <Container>
        <div className="mb-10 pb-6 border-b border-azul/10 text-left">
          <span className="inline-block bg-vino/10 text-vino text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
            Prefactura de Pedido
          </span>
          <h1 className="font-display text-4xl text-azul mb-2">Bolsa de Compras y Cotización</h1>
          <p className="text-marron-400 text-sm max-w-2xl">
            Revise sus prendas. Desde 12 unidades por producto se aplica tarifa por mayor.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-blanco p-12 rounded-2xl border border-azul/10 text-center">
            <h2 className="font-display text-2xl text-azul mb-2">Tu carrito está vacío</h2>
            <p className="text-marron-400 mb-6">Aún no has agregado ninguna prenda a tu cotización.</p>
            <Link href="/catalogo"><Button variant="primary" size="lg">Explorar catálogo</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 flex flex-col gap-4">
              {items.map((item) => {
                const precio = item.precioUnitario;
                const etiqueta = etiquetaEntrega({
                  esBajoPedido: item.esBajoPedido ?? false,
                  leadTimeDias: item.leadTimeDias,
                  tiempoReposicionHoras: item.tiempoReposicionHoras,
                });
                const colorEtiqueta =
                  etiqueta.tipo === 'inmediata'
                    ? 'bg-success/10 text-success border-success/30'
                    : etiqueta.tipo === 'reposicion'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : etiqueta.tipo === 'bajo_pedido'
                    ? 'bg-azul/10 text-azul border-azul/30'
                    : 'bg-red-50 text-red-700 border-red-200';

                return (
                  <div key={`${item.productoId}-${item.talla}-${item.color}-${item.esBajoPedido}`} className="bg-blanco p-4 rounded-xl border border-azul/10 shadow-sm flex items-center gap-4">
                    <div className="w-16 h-20 rounded-xl bg-beige-100 border border-beige-200 overflow-hidden shrink-0">
                      <ProductImage imagenes={[]} nombre={item.nombre} categoria={item.categoria} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-base text-azul font-medium">{item.nombre}</h3>
                      <p className="text-xs text-marron-400 mt-1">Talla: {item.talla} | Color: {item.color}</p>
                      <p className="text-xs font-semibold text-vino mt-1">C${precio.toLocaleString('es-NI')} c/u (Tarifa {item.cantidad >= 12 ? 'Mayor' : 'Retail'})</p>
                      <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full border ${colorEtiqueta}`}>
                        {etiqueta.texto}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.productoId, item.talla, item.color, item.esBajoPedido ?? false, Math.max(1, item.cantidad - 1))} className="w-8 h-8 bg-beige-100 rounded text-azul font-bold">-</button>
                      <span className="w-8 text-center text-sm font-semibold">{item.cantidad}</span>
                      <button onClick={() => updateQuantity(item.productoId, item.talla, item.color, item.esBajoPedido ?? false, item.cantidad + 1)} className="w-8 h-8 bg-beige-100 rounded text-azul font-bold">+</button>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-azul block">C${(precio * item.cantidad).toLocaleString('es-NI')}</span>
                      <button onClick={() => removeItem(item.productoId, item.talla, item.color, item.esBajoPedido ?? false)} className="text-xs text-vino hover:underline mt-1">Eliminar</button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-blanco p-6 rounded-2xl border border-azul/10 shadow-sm sticky top-24">
              <h3 className="font-display text-xl text-azul mb-4">Resumen de Prefactura</h3>
              <div className="flex flex-col gap-3 text-sm font-body border-b border-beige-200 pb-4 mb-4">
                <div className="flex justify-between text-marron">
                  <span>Subtotal estimado:</span>
                  <span className="font-semibold text-azul">C${total().toLocaleString('es-NI')}</span>
                </div>
                <div className="flex justify-between text-marron">
                  <span>Envío (Managua Casco Urbano):</span>
                  <span className="text-success font-semibold">Gratis</span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="font-semibold text-azul text-lg">Total Estimado:</span>
                <span className="font-display text-2xl text-vino font-bold">C${total().toLocaleString('es-NI')}</span>
              </div>

              <div className="p-4 rounded-xl bg-beige-100 border border-beige-200 text-xs text-marron-400 leading-relaxed mb-6">
                <strong className="text-azul block font-semibold mb-1">Confirmación humana obligatoria:</strong>
                Un asesor confirmará tiempos de entrega, existencias y personalización antes de autorizar cualquier transacción.
              </div>

              <div className="mb-4">
                <PayPalButton />
              </div>

              <Button variant="primary" size="lg" onClick={handleConfirmOrder} className="w-full shadow-md">
                Confirmar prefactura
              </Button>

              <div className="text-center mt-4">
                <Link href="/catalogo" className="text-xs text-azul hover:underline">
                  ← Continuar agregando más prendas
                </Link>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
