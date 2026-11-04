'use server';

import { paypalClient } from '../../lib/paypal';
import { OrdersController } from '@paypal/paypal-server-sdk';
import { supabase } from '../../lib/supabase';

interface CartItemInput {
  productoId: string;
  cantidad: number;
  talla: string;
  color: string;
}

export async function createPayPalOrder(cartItems: CartItemInput[]) {
  let totalAmount = 0;
  const itemsParaPayPal = [];

  // 1. VALIDACIÓN SERVER-SIDE: Consultamos los precios reales a Supabase
  for (const item of cartItems) {
    const { data: prod, error } = await supabase
      .from('productos')
      .select('precio_retail, precio_mayor, nombre')
      .eq('id', item.productoId)
      .single();
    
    if (error || !prod) throw new Error(`Producto no encontrado: ${item.productoId}`);

    // Regla de negocio: Mayorista a partir de 12 unidades
    const precioUnitario = item.cantidad >= 12 ? prod.precio_mayor : prod.precio_retail;
    totalAmount += precioUnitario * item.cantidad;

    itemsParaPayPal.push({
      name: prod.nombre.substring(0, 127), // PayPal limita a 127 caracteres
      unitAmount: { currencyCode: 'USD', value: precioUnitario.toFixed(2) },
      quantity: item.cantidad.toString(),
    });
  }

  // 2. Crear la orden en PayPal
  const ordersController = new OrdersController(paypalClient);
  const response = await ordersController.createOrder({
    body: {
      intent: 'CAPTURE',
      purchaseUnits: [{
        amount: { 
          currencyCode: 'USD', 
          value: totalAmount.toFixed(2) 
        },
        items: itemsParaPayPal,
      }],
      applicationContext: { brandName: 'El Cacique', shippingPreference: 'NO_SHIPPING' },
    },
  });

  return { orderID: response.result.id, totalAmount };
}
