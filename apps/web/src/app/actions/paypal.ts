'use server';

import { paypalClient } from '../../lib/paypal';
import { OrdersController, CheckoutPaymentIntent, OrderApplicationContextShippingPreference } from '@paypal/paypal-server-sdk';
import { supabase } from '../../lib/supabase';

interface CartItemInput {
  productoId: string;
  cantidad: number;
  talla: string;
  color: string;
}

export async function createPayPalOrder(cartItems: CartItemInput[]): Promise<{ orderID: string; totalAmount: number }> {
  let totalAmount = 0;
  const itemsParaPayPal = [];

  for (const item of cartItems) {
    const { data: prod, error } = await supabase
      .from('productos')
      .select('precio_retail, precio_mayor, nombre')
      .eq('id', item.productoId)
      .single();
    
    if (error || !prod) throw new Error(`Producto no encontrado: ${item.productoId}`);

    const precioUnitario = item.cantidad >= 12 ? prod.precio_mayor : prod.precio_retail;
    totalAmount += precioUnitario * item.cantidad;

    itemsParaPayPal.push({
      name: prod.nombre.substring(0, 127),
      unitAmount: { currencyCode: 'USD', value: precioUnitario.toFixed(2) },
      quantity: item.cantidad.toString(),
    });
  }

  const ordersController = new OrdersController(paypalClient);
  
  const response = await ordersController.ordersCreate({
    body: {
      intent: CheckoutPaymentIntent.Capture, // <-- ENUM CORRECTO
      purchaseUnits: [{
        amount: { 
          currencyCode: 'USD', 
          value: totalAmount.toFixed(2) 
        },
        items: itemsParaPayPal,
      }],
      applicationContext: { 
        brandName: 'El Cacique', 
        shippingPreference: OrderApplicationContextShippingPreference.NoShipping // <-- ENUM CORRECTO
      },
    },
  });

  // Validamos que PayPal nos devuelva un ID antes de retornar
  const orderID = response.result.id;
  if (!orderID) {
    throw new Error('PayPal no devolvió un ID de orden válido.');
  }

  return { orderID, totalAmount };
}
