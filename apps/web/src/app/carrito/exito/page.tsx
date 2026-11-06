import Link from 'next/link';
import { supabaseAdmin } from '../../../lib/supabase-admin';
import { Container } from '../../../components/ui/Container';
import { Button } from '../../../components/ui/Button';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ pp?: string; orden?: string }>;
}

export default async function ExitoPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const pp = sp.pp;
  const ordenFallback = sp.orden;

  if (!pp) {
    return (
      <div className="bg-beige min-h-screen flex items-center justify-center py-20">
        <Container>
          <div className="bg-blanco p-12 rounded-2xl shadow-lg border border-azul/10 text-center max-w-lg mx-auto">
            <h1 className="font-display text-3xl text-azul mb-4">¡Pago Exitoso!</h1>
            <p className="text-marron-400 text-sm leading-relaxed mb-8">
              Gracias por su compra. Un asesor se pondrá en contacto con usted en las próximas 24 horas.
            </p>
            <Link href="/catalogo"><Button variant="primary" size="lg">Volver al catálogo</Button></Link>
          </div>
        </Container>
      </div>
    );
  }

  const { data: pedido } = await supabaseAdmin
    .from('pedidos')
    .select('id, numero_orden, total, moneda, created_at')
    .eq('paypal_order_id', pp)
    .maybeSingle();

  if (!pedido) {
    return (
      <div className="bg-beige min-h-screen flex items-center justify-center py-20">
        <Container>
          <div className="bg-blanco p-12 rounded-2xl shadow-lg border border-azul/10 text-center max-w-lg mx-auto">
            <h1 className="font-display text-3xl text-azul mb-4">¡Pago Exitoso!</h1>
            <p className="text-marron-400 text-sm leading-relaxed mb-8">
              Gracias por su compra. Un asesor se pondrá en contacto con usted en las próximas 24 horas.
            </p>
            <Link href="/catalogo"><Button variant="primary" size="lg">Volver al catálogo</Button></Link>
          </div>
        </Container>
      </div>
    );
  }

  const { data: itemsData } = await supabaseAdmin
    .from('pedido_items')
    .select('producto_id, cantidad, precio_unitario, talla, color, es_bajo_pedido, fecha_entrega_estimada')
    .eq('pedido_id', pedido.id);

  const items = itemsData ?? [];

  const productosPorId: Record<string, { nombre: string }> = {};
  if (items.length > 0) {
    const ids = Array.from(new Set(items.map((i: any) => i.producto_id)));
    const { data: prods } = await supabaseAdmin
      .from('productos')
      .select('id, nombre')
      .in('id', ids);
    (prods ?? []).forEach((p: any) => {
      productosPorId[p.id] = { nombre: p.nombre };
    });
  }

  const itemsInmediatos = items.filter((i: any) => !i.es_bajo_pedido);
  const itemsPendientes = items.filter((i: any) => i.es_bajo_pedido);

  const numeroOrden = pedido.numero_orden ?? ordenFallback ?? '—';

  return (
    <div className="bg-beige min-h-screen py-16">
      <Container>
        <div className="bg-blanco p-8 md:p-12 rounded-2xl shadow-lg border border-azul/10 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="font-display text-3xl text-azul mb-2">¡Pago Exitoso!</h1>
            <p className="text-marron-400 text-sm">Gracias por su compra en El Cacique.</p>
          </div>

          <div className="bg-azul/5 border border-azul/20 rounded-xl p-4 mb-6 text-center">
            <span className="text-xs uppercase tracking-widest text-marron-400 block mb-1">Número de orden</span>
            <span className="font-mono font-bold text-2xl text-azul">{numeroOrden}</span>
            <p className="text-xs text-marron-400 mt-2">Guardá este número para cualquier consulta.</p>
          </div>

          {/* BLOQUE 1: ENTREGA INMEDIATA */}
          {itemsInmediatos.length > 0 && (
            <div className="mb-6">
              <h2 className="font-display text-lg text-azul mb-3 flex items-center gap-2">
                <span className="bg-success/10 text-success px-2 py-0.5 rounded text-xs uppercase tracking-wider font-semibold border border-success/30">Listos para entrega</span>
              </h2>
              <div className="flex flex-col gap-3">
                {itemsInmediatos.map((item: any, idx: number) => (
                  <div key={`inm-${idx}`} className="flex justify-between items-start border-b border-beige-200 pb-3">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-azul">{productosPorId[item.producto_id]?.nombre ?? item.producto_id}</div>
                      <div className="text-xs text-marron-400 mt-1">Talla {item.talla} · Color {item.color} · Cant. {item.cantidad}</div>
                      <div className="text-xs text-success mt-1 font-medium">Disponible para retirar en tienda</div>
                    </div>
                    <div className="text-sm font-semibold text-azul ml-4">
                      C${(item.precio_unitario * item.cantidad).toLocaleString('es-NI')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BLOQUE 2: PENDIENTES (BAJO PEDIDO) */}
          {itemsPendientes.length > 0 && (
            <div className="mb-6">
              <h2 className="font-display text-lg text-azul mb-3 flex items-center gap-2">
                <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-xs uppercase tracking-wider font-semibold border border-amber-200">Pendientes de reposición</span>
              </h2>
              <div className="flex flex-col gap-3">
                {itemsPendientes.map((item: any, idx: number) => (
                  <div key={`pen-${idx}`} className="flex justify-between items-start border-b border-beige-200 pb-3">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-azul">{productosPorId[item.producto_id]?.nombre ?? item.producto_id}</div>
                      <div className="text-xs text-marron-400 mt-1">Talla {item.talla} · Color {item.color} · Cant. {item.cantidad}</div>
                      {item.fecha_entrega_estimada && (
                        <div className="text-xs text-amber-600 mt-1 font-medium">
                          Entrega estimada: {new Date(item.fecha_entrega_estimada).toLocaleDateString('es-NI')}
                        </div>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-azul ml-4">
                      C${(item.precio_unitario * item.cantidad).toLocaleString('es-NI')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mb-8 pt-4 border-t border-azul/20">
            <span className="font-semibold text-azul">Total pagado:</span>
            <span className="font-display text-2xl text-vino font-bold">
              {pedido.moneda ?? 'USD'} {Number(pedido.total).toFixed(2)}
            </span>
          </div>

          <p className="text-xs text-marron-400 text-center mb-6">
            Un asesor de El Cacique se pondrá en contacto con usted en las próximas 24 horas para coordinar la entrega o recogida.
          </p>

          <Link href="/catalogo"><Button variant="primary" size="lg" className="w-full">Volver al catálogo</Button></Link>
        </div>
      </Container>
    </div>
  );
}
