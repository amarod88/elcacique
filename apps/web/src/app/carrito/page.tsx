'use client';

import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { ProductImage } from '../../components/catalog/ProductImage';
import { useCartStore } from '../../lib/store/cart';
import { PayPalButton } from '../../components/cart/PayPalButton';

const emptySubscribe = () => () => {};

export default function CarritoPage() {
  const isHydrated = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const total = useCartStore((state) => state.total);
  
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isHydrated) return null;

  const handleConfirmOrder = () => {
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="bg-beige min-h-screen py-16 flex items-center justify-center">
        <Container>
          <div className="bg-blanco p-12 rounded-2xl shadow-lg border border-azul/10 text-center max-w-lg mx-auto">
            <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="font-display text-3xl text-azul mb-4">Prefactura Generada con Éxito</h1>
            <p className="text-marron-400 text-sm leading-relaxed mb-8">
              Su prefactura ha sido registrada en el sistema de El Cacique. Uno de nuestros ejecutivos de cuenta se pondrá en contacto para afinar tallas, bordados y plazos de entrega.
              <br /><br />
              <strong className="text-azul">Aviso de validación humana obligatoria:</strong> Un asesor confirmará tiempos, stock exacto y detalles antes de proceder a cualquier pago o anticipo.
            </p>
            <Link href="/catalogo">
              <Button variant="primary" size="lg">Seguir explorando catálogo</Button>
            </Link>
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
            Revise sus prendas seleccionadas. Recuerde que a partir de 12 unidades por producto se activa automáticamente la tarifa por mayor.
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
            
            {/* Lista de Productos */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {items.map((item) => {
                const precio = item.precioUnitario;
                return (
                  <div key={`${item.productoId}-${item.talla}-${item.color}`} className="bg-blanco p-4 rounded-xl border border-azul/10 shadow-sm flex items-center gap-4">
                    <div className="w-16 h-20 rounded-xl bg-beige-100 border border-beige-200 overflow-hidden shrink-0">
                      <ProductImage imagenes={[]} nombre={item.nombre} categoria={item.categoria} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-base text-azul font-medium">{item.nombre}</h3>
                      <p className="text-xs text-marron-400 mt-1">Talla: {item.talla} | Color: {item.color}</p>
                      <p className="text-xs font-semibold text-vino mt-1">C${precio.toLocaleString('es-NI')} c/u (Tarifa {item.cantidad >= 12 ? 'Mayor' : 'Retail'})</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.productoId, item.talla, item.color, Math.max(1, item.cantidad - 1))} className="w-8 h-8 bg-beige-100 rounded text-azul font-bold">-</button>
                      <span className="w-8 text-center text-sm font-semibold">{item.cantidad}</span>
                      <button onClick={() => updateQuantity(item.productoId, item.talla, item.color, item.cantidad + 1)} className="w-8 h-8 bg-beige-100 rounded text-azul font-bold">+</button>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-azul block">C${(precio * item.cantidad).toLocaleString('es-NI')}</span>
                      <button onClick={() => removeItem(item.productoId, item.talla, item.color)} className="text-xs text-vino hover:underline mt-1">Eliminar</button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Resumen y Pago */}
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

              {/* AQUÍ ESTÁ EL BOTÓN DE PAYPAL CORRECTAMENTE UBICADO */}
              <div className="mb-4">
                <PayPalButton />
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleConfirmOrder}
                className="w-full shadow-md"
              >
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
