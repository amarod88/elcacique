'use server';

import { paypalClient } from '../../lib/paypal';
import { OrdersController, CheckoutPaymentIntent, OrderApplicationContextShippingPreference } from '@paypal/paypal-server-sdk';
import { supabaseAdmin } from '../../lib/supabase-admin';

export async function createPayPalOrder(cartItems: any[]): Promise<{ orderID: string; totalAmount: number }> {
  // Se acumula en CENTAVOS (enteros) para evitar drift de punto flotante
  // y garantizar que sum(items) === breakdown.item_total exactamente.
  let totalCents = 0;
  const itemsParaPayPal = [];

  for (const item of cartItems) {
    const { data: prod, error } = await supabaseAdmin
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

  // 2. Guardar pedido + items atómicamente vía RPC (Opción B)
  const pedidoItems = cartItems.map((item) => ({
    producto_id: item.productoId,
    cantidad: item.cantidad,
    precio_unitario: item.precioUnitario,
    talla: item.talla,
    color: item.color,
  }));

  const { data: pedidoId, error: errorRpc } = await supabaseAdmin.rpc('crear_pedido_completo', {
    p_total: totalAmount,
    p_moneda: 'USD',
    p_paypal_order_id: orderID,
    p_items: pedidoItems,
  });

  if (errorRpc || !pedidoId) {
    console.error('Error atómico guardando pedido:', errorRpc);
    throw new Error('Hubo un error al guardar su pedido en la base de datos.');
  }

  return { success: true, pedidoId: pedidoId };
}
