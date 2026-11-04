'use client';

import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { createPayPalOrder } from '../../app/actions/paypal';
import { useCartStore } from '../../lib/store/cart';
import { useRouter } from 'next/navigation';

export function PayPalButton() {
  const router = useRouter();
  const { items, clear } = useCartStore();

  if (items.length === 0) return null;

  return (
    <div className="w-full mt-4">
      <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test', currency: 'USD' }}>
        <PayPalButtons
          style={{ layout: 'vertical', shape: 'rect', label: 'pay' }}
          createOrder={async () => {
            const cartItems = items.map(item => ({
              productoId: item.productoId,
              cantidad: item.cantidad,
              talla: item.talla,
              color: item.color
            }));
            
            // Forzamos el tipo string para satisfacer al SDK de React de PayPal
            const result = await createPayPalOrder(cartItems);
            return result.orderID as string; 
          }}
          onApprove={async (data, actions) => {
            console.log('Pago aprobado en el frontend:', data.orderID);
            alert('Pago aprobado. En la siguiente fase guardaremos esto en la base de datos.');
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}
