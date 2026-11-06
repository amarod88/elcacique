'use server';

import { paypalClient } from '../../lib/paypal';
import { OrdersController, CheckoutPaymentIntent, OrderApplicationContextShippingPreference } from '@paypal/paypal-server-sdk';
import { supabaseAdmin } from '../../lib/supabase-admin';
import { resolveItemState, type VarianteInfo, type ProductoInfo } from '../../lib/resolveItemState';
import { DEFAULT_LEAD_TIME_DIAS } from '../../lib/config/entrega';

export async function createPayPalOrder(cartItems: any[]): Promise<{ orderID: string; totalAmount: number }> {
  let totalCents = 0;
  const itemsParaPayPal = [];

  for (const item of cartItems) {
    const { data: prod, error } = await supabaseAdmin
      .from('productos')
      .select('id, precio_retail, precio_mayor, nombre, tipo_disponibilidad, tiempo_reposicion_horas, lead_time_dias')
      .eq('id', item.productoId)
      .single();

    if (error || !prod) throw new Error(`Producto no encontrado: ${item.productoId}`);

    let variante: VarianteInfo | null = null;
    if (prod.tipo_disponibilidad === 'stock') {
      const { data: v } = await supabaseAdmin
        .from('producto_variantes')
        .select('talla,color,stock_fisico')
        .eq('producto_id', prod.id)
        .eq('talla', item.talla)
        .eq('color', item.color)
        .maybeSingle();
      variante = v ?? null;
    }

    const state = resolveItemState(prod as ProductoInfo, variante, item.cantidad);
    if (!state.canPurchase) {
      throw new Error(`No se puede comprar "${prod.nombre}" en este momento. Contactá a un asesor.`);
    }

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
          breakdown: { itemTotal: { currencyCode: 'USD', value: totalAmountString } },
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

export async function capturePayPalOrder(
  orderID: string,
  cartItems: any[],
  totalAmount: number
): Promise<{ success: true; pedidoId: string; numeroOrden: string }> {
  const ordersController = new OrdersController(paypalClient);
  const response = await ordersController.ordersCapture({ id: orderID });

  if (response.result.status !== 'COMPLETED') {
    throw new Error('El pago no se completó correctamente en PayPal.');
  }

  const pedidoItems: any[] = [];
  for (const item of cartItems) {
    const { data: prod } = await supabaseAdmin
      .from('productos')
      .select('id, precio_retail, precio_mayor, tipo_disponibilidad, tiempo_reposicion_horas, lead_time_dias')
      .eq('id', item.productoId)
      .single();

    if (!prod) {
      console.error('[capture] PRODUCTO_DESAPARECIDO', { orderID, productoId: item.productoId });
      throw new Error('Un producto de tu pedido ya no está disponible. Contactá a un asesor.');
    }

    let variante: VarianteInfo | null = null;
    if (prod.tipo_disponibilidad === 'stock') {
      const { data: v } = await supabaseAdmin
        .from('producto_variantes')
        .select('talla,color,stock_fisico')
        .eq('producto_id', prod.id)
        .eq('talla', item.talla)
        .eq('color', item.color)
        .maybeSingle();
      variante = v ?? null;
    }

    const state = resolveItemState(prod as ProductoInfo, variante, item.cantidad);
    if (!state.canPurchase) {
      console.error('[capture] STATE_NO_COMPRABLE', { orderID, productoId: item.productoId, motivo: state.motivo });
      throw new Error('El estado de un producto cambió mientras pagabas. Contactá a un asesor.');
    }

    const precioUnitario: number = item.cantidad >= 12 ? prod.precio_mayor : prod.precio_retail;

    pedidoItems.push({
      producto_id: item.productoId,
      cantidad: item.cantidad,
      precio_unitario: precioUnitario,
      talla: item.talla,
      color: item.color,
      es_bajo_pedido: state.esBajoPedido,
      lead_time_dias: state.leadTimeDias ?? DEFAULT_LEAD_TIME_DIAS,
    });
  }

  const { data: pedidoId, error: errorRpc } = await supabaseAdmin.rpc('crear_pedido_completo', {
    p_total: totalAmount,
    p_moneda: 'USD',
    p_paypal_order_id: orderID,
    p_items: pedidoItems,
  });

  if (errorRpc || !pedidoId) {
    if (errorRpc?.code === 'P0001') {
      console.error('[capture] STOCK_INSUFICIENTE', { orderID, mensaje: errorRpc.message, items: pedidoItems });
      throw new Error('El stock cambió mientras completabas el pago. Tu pago fue procesado; contactá a un asesor para resolver tu pedido.');
    }
    console.error('Error atómico guardando pedido:', errorRpc);
    throw new Error('Hubo un error al guardar su pedido en la base de datos.');
  }

  const { data: pedidoRow } = await supabaseAdmin
    .from('pedidos')
    .select('numero_orden')
    .eq('id', pedidoId)
    .single();

  const numeroOrden = (pedidoRow as any)?.numero_orden ?? '';
  return { success: true, pedidoId: pedidoId as string, numeroOrden };
}
