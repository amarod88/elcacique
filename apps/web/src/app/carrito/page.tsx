'use client';

import React, { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Container } from '../../components/ui/Container';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { Button } from '../../components/ui/Button';
import { ProductImage } from '../../components/catalog/ProductImage';
import { getProductoBySlug, calcularPrecio } from '@el-cacique/shared';
import { useCartStore } from '../../lib/store/cart';

const emptySubscribe = () => () => {};

export default function CarritoPage() {
  const isHydrated = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clear);

  const [orderConfirmed, setOrderConfirmed] = useState(false);

  // Ítems hidratados o vacío durante SSR
  const activeItems = isHydrated ? items : [];

  // Recalcular precios dinámicos por volumen (mayoreo a partir de 12 unidades)
  const calculatedItems = activeItems.map((item) => {
    const prod = getProductoBySlug(item.slug);
    const unitPrice = prod ? calcularPrecio(prod, item.cantidad) : item.precioUnitario;
    const subtotal = unitPrice * item.cantidad;
    const isWholesale = item.cantidad >= 12;

    return {
      ...item,
      unitPrice,
      subtotal,
      isWholesale,
    };
  });

  const total = calculatedItems.reduce((acc, curr) => acc + curr.subtotal, 0);

  const handleConfirmOrder = () => {
    setOrderConfirmed(true);
    clearCart();
  };

  return (
    <div className="py-12 md:py-20 bg-beige min-h-screen text-left">
      <Container>
        <SectionTitle
          align="left"
          badge="Prefactura de Pedido"
          title="Bolsa de Compras y Cotización"
          subtitle="Revise sus prendas seleccionadas. Recuerde que a partir de 12 unidades por producto se activa automáticamente la tarifa por mayor."
        />

        {orderConfirmed ? (
          <div className="bg-blanco rounded-2xl p-10 border border-azul/10 text-center max-w-xl mx-auto flex flex-col items-center gap-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-success/15 text-success flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-display text-2xl text-azul">Prefactura Generada con Éxito</h3>
            <p className="font-body text-sm text-marron-400 leading-relaxed">
              Su prefactura ha sido registrada en el sistema de El Cacique. Uno de nuestros ejecutivos de cuenta se pondrá en contacto para afinar tallas, bordados y plazos de entrega.
            </p>
            <div className="p-4 rounded-xl bg-celeste/20 text-azul border border-celeste/30 text-xs text-left w-full mt-2">
              <strong>Aviso de validación humana obligatoria:</strong>
              <p className="mt-1 text-marron">
                Un asesor confirmará tiempos de entrega, stock exacto y detalles de bordado antes de proceder a cualquier pago o anticipo.
              </p>
            </div>
            <Button href="/catalogo" variant="primary" size="md" className="mt-4">
              Seguir explorando catálogo
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Lista de Ítems */}
            <div className="lg:col-span-8 bg-blanco rounded-2xl p-6 sm:p-8 border border-azul/10 shadow-xs flex flex-col gap-6">
              {calculatedItems.length > 0 ? (
                <div className="flex flex-col divide-y divide-beige-200">
                  {calculatedItems.map((item) => (
                    <div
                      key={`${item.productoId}-${item.talla}-${item.color}`}
                      className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-20 rounded-xl bg-beige-100 border border-beige-200 overflow-hidden shrink-0">
                          <ProductImage
                            imagenes={[]}
                            nombre={item.nombre}
                            categoria={item.categoria}
                          />
                        </div>
                        <div className="flex flex-col">
                          <Link
                            href={`/producto/${item.slug}`}
                            className="font-display text-lg text-azul hover:text-vino transition-colors font-medium"
                          >
                            {item.nombre}
                          </Link>
                          <span className="text-xs text-marron-400 font-body">
                            Talla: <strong>{item.talla}</strong> · Color: <strong>{item.color}</strong>
                            {item.bordado && ' · Con bordado'}
                          </span>
                          <span className="text-xs font-semibold text-vino mt-1">
                            C${item.unitPrice.toLocaleString('es-NI', { minimumFractionDigits: 2 })} c/u
                            {item.isWholesale ? ' (Tarifa Mayorista)' : ' (Tarifa Retail)'}
                          </span>
                        </div>
                      </div>

                      {/* Control de Cantidad y Subtotal */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                        <div className="flex items-center border border-beige-200 rounded-lg overflow-hidden bg-beige-100">
                          <button
                            type="button"
                            onClick={() => {
                              if (item.cantidad > 1) {
                                updateQuantity(item.productoId, item.talla, item.color, item.cantidad - 1);
                              } else {
                                removeItem(item.productoId, item.talla, item.color);
                              }
                            }}
                            className="px-2.5 py-1 text-sm font-bold text-azul hover:bg-beige-200 cursor-pointer"
                            aria-label="Disminuir cantidad"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-xs font-bold text-azul">{item.cantidad}</span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.productoId, item.talla, item.color, item.cantidad + 1)
                            }
                            className="px-2.5 py-1 text-sm font-bold text-azul hover:bg-beige-200 cursor-pointer"
                            aria-label="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right min-w-[110px]">
                          <span className="font-display text-base text-azul font-bold block">
                            C${item.subtotal.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeItem(item.productoId, item.talla, item.color)}
                            className="text-[11px] text-error hover:underline mt-0.5 cursor-pointer"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-beige-200 text-marron-400 flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h4 className="font-display text-xl text-azul">Su carrito está vacío</h4>
                  <p className="text-xs text-marron-400 max-w-sm">
                    Aún no ha agregado prendas a su bolsa de pedido. Explore nuestro catálogo con más de 80 prendas industriales, médicas y corporativas.
                  </p>
                  <Button href="/catalogo" variant="primary" size="md" className="mt-2">
                    Ir al catálogo maestro
                  </Button>
                </div>
              )}
            </div>

            {/* Resumen Lateral */}
            <div className="lg:col-span-4 bg-blanco rounded-2xl p-6 sm:p-8 border border-azul/10 shadow-xs flex flex-col gap-6">
              <h3 className="font-display text-xl text-azul pb-3 border-b border-beige-200">
                Resumen de Prefactura
              </h3>

              <div className="flex flex-col gap-3 text-sm font-body">
                <div className="flex justify-between text-marron-400">
                  <span>Subtotal estimado:</span>
                  <span className="font-semibold text-azul">
                    C${total.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-marron-400">
                  <span>Envío (Managua Casco Urbano):</span>
                  <span className="text-success font-semibold">Gratis</span>
                </div>
                <div className="flex justify-between text-marron-400 text-xs">
                  <span>Validación de tiempos:</span>
                  <span>48–72h catálogo estándar</span>
                </div>
                <div className="pt-3 border-t border-beige-200 flex justify-between items-baseline">
                  <span className="font-display text-lg text-azul">Total Estimado:</span>
                  <span className="font-display text-2xl text-vino font-bold">
                    C${total.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Mensaje obligatorio de confirmación humana */}
              <div className="p-4 rounded-xl bg-beige-100 border border-beige-200 text-xs text-marron-400 leading-relaxed">
                <strong className="text-azul block font-semibold mb-1">
                  Confirmación humana obligatoria:
                </strong>
                Un asesor confirmará tiempos de entrega, existencias y personalización antes de autorizar cualquier transacción.
              </div>

              <Button
                variant="primary"
                size="lg"
                disabled={calculatedItems.length === 0}
                onClick={handleConfirmOrder}
                className="w-full shadow-md"
              >
                Confirmar prefactura
              </Button>

              <div className="text-center">
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
