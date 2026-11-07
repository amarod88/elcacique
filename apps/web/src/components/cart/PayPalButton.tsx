'use client';

import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { createPayPalOrder, capturePayPalOrder } from '../../app/actions/paypal';
import { useCartStore } from '../../lib/store/cart';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function PayPalButton() {
  const router = useRouter();
  const { items, total, clear } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  if (items.length === 0) return null;

  return (
    <div className="w-full mt-4">
      {isProcessing && (
        <div className="text-center text-sm text-azul mb-2 font-semibold animate-pulse">
          Procesando pago seguro...
        </div>
      )}

      <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test', currency: 'USD' }}>
        <PayPalButtons
          style={{ layout: 'vertical', shape: 'rect', label: 'pay' }}
          disabled={isProcessing}
          createOrder={async () => {
            const cartItems = items.map(item => ({
              productoId: item.productoId,
              cantidad: item.cantidad,
              talla: item.talla,
              color: item.color,
              precioUnitario: item.precioUnitario,
            }));
            const result = await createPayPalOrder(cartItems);
            return result.orderID as string;
          }}
          onApprove={async (data) => {
            setIsProcessing(true);
            try {
              const cartItems = items.map(item => ({
                productoId: item.productoId,
                cantidad: item.cantidad,
                talla: item.talla,
                color: item.color,
                precioUnitario: item.precioUnitario,
              }));

              const { data: { user } } = await supabase.auth.getUser();
              const userId = user?.id ?? null;
              const result = await capturePayPalOrder(data.orderID, cartItems, total(), userId);
              clear();
              router.push(`/carrito/exito?pp=${encodeURIComponent(data.orderID)}&orden=${encodeURIComponent(result.numeroOrden)}`);
            } catch (error) {
              console.error(error);
              const msg = error instanceof Error ? error.message : 'Hubo un error al guardar su pedido.';
              alert(msg + ' Por favor, contacte a soporte.');
              setIsProcessing(false);
            }
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}
