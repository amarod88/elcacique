'use server';

import { paypalClient } from '../../lib/paypal';
import { OrdersController, CheckoutPaymentIntent, OrderApplicationContextShippingPreference } from '@paypal/paypal-server-sdk';
import { supabase } from '../../lib/supabase';

export async function createPayPalOrder(cartItems: any[]): Promise<{ orderID: string; totalAmount: number }> {
  // Se acumula en CENTAVOS (enteros) para evitar drift de punto flotante
  // y garantizar que sum(items) === breakdown.item_total exactamente.
  let totalCents = 0;
  const itemsParaPayPal = [];

  for (const item of cartItems) {
    const { data: prod, error } = await supabase
      .from('productos')
      .select('precio_retail, precio_mayor, nombre')
      .eq('id', item.productoId)
      .single();

    if (error || !prod) throw new Error(`Producto no encontrado: ${item.productoId}`);

    const precioUnitario: number = item.cantidad >= 12 ? prod.precio_mayor : prod.precio_retail;
    const unitCents = Math.round(precioUnitario * 100);
    totalCents += unitCents * item.cantidad;

    itemsParaPayPal.push({
      name: prod.nombre.substring(0, 127),
      unitAmount: { currencyCode: 'USD', value: (unitCents / 100).toFixed(2) },
      quantity: item.cantidad.toString(),
    });
  }

  const totalAmountString = (totalCents / 100).toFixed(2);
  const totalAmount = Number(totalAmountString);

  const ordersController = new OrdersController(paypalClient);

  const response = await ordersController.ordersCreate({
    body: {
      intent: CheckoutPaymentIntent.Capture,
      purchaseUnits: [{
        amount: {
          currencyCode: 'USD',
          value: totalAmountString,
          // PayPal exige item_total cuando se envían items (error ITEM_TOTAL_REQUIRED).
          // Con shipping_preference=NO_SHIPPING y sin impuestos, breakdown = { item_total }.
          breakdown: {
            itemTotal: { currencyCode: 'USD', value: totalAmountString },
          },
        },
        items: itemsParaPayPal,
      }],
      applicationContext: { brandName: 'El Cacique', shippingPreference: OrderApplicationContextShippingPreference.NoShipping },
    },
  });

  const orderID = response.result.id;
  if (!orderID) throw new Error('PayPal no devolvió un ID de orden válido.');

  return { orderID, totalAmount };
}

export async function capturePayPalOrder(orderID: string, cartItems: any[], totalAmount: number) {
  const ordersController = new OrdersController(paypalClient);

  // 1. Capturar el pago en PayPal
  const response = await ordersController.ordersCapture({ id: orderID });

  if (response.result.status !== 'COMPLETED') {
    throw new Error('El pago no se completó correctamente en PayPal.');
  }

  // 2. Guardar el pedido en Supabase
  const { data: pedido, error: errorPedido } = await supabase
    .from('pedidos')
    .insert({
      estado: 'pagado',
      total: totalAmount,
      moneda: 'USD',
      paypal_order_id: orderID,
    })
    .select()
    .single();

  if (errorPedido || !pedido) {
    console.error('Error guardando pedido:', errorPedido);
    throw new Error('Error guardando el pedido en la base de datos.');
  }

  // 3. Guardar los items del pedido
  const pedidoItems = cartItems.map((item) => ({
    pedido_id: pedido.id,
    producto_id: item.productoId,
    cantidad: item.cantidad,
    precio_unitario: item.precioUnitario,
    talla: item.talla,
    color: item.color,
  }));

  const { error: errorItems } = await supabase.from('pedido_items').insert(pedidoItems);

  if (errorItems) {
    console.error('Error guardando items:', errorItems);
    // Nota: El pago ya se cobró, pero los items fallaron. Se debe manejar manualmente o con webhook.
  }

  return { success: true, pedidoId: pedido.id };
}
