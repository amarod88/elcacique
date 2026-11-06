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

  // Agrupar ítems por fecha de entrega
  const grupos: Record<string, any[]> = {};
  items.forEach((item: any) => {
    // Si no es bajo pedido, la fecha es "Hoy"
    const fechaKey = !item.es_bajo_pedido 
      ? 'Inmediata' 
      : item.fecha_entrega_estimada 
        ? new Date(item.fecha_entrega_estimada).toISOString().split('T')[0]
        : 'Pendiente';
        
    if (!grupos[fechaKey]) grupos[fechaKey] = [];
    grupos[fechaKey].push(item);
  });

  // Ordenar llaves: Inmediata primero, luego por fecha
  const fechasOrdenadas = Object.keys(grupos).sort((a, b) => {
    if (a === 'Inmediata') return -1;
    if (b === 'Inmediata') return 1;
    return a.localeCompare(b);
  });

  const numeroOrden = pedido.numero_orden ?? ordenFallback ?? '—';
  let letraTicket = 65; // Código ASCII para 'A'

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

          <div className="bg-azul/5 border border-azul/20 rounded-xl p-4 mb-8 text-center">
            <span className="text-xs uppercase tracking-widest text-marron-400 block mb-1">Orden de Compra Principal</span>
            <span className="font-mono font-bold text-2xl text-azul">{numeroOrden}</span>
            <p className="text-xs text-marron-400 mt-2">Guardá este número para cualquier consulta.</p>
          </div>

          {fechasOrdenadas.map((fechaKey) => {
            const letraActual = String.fromCharCode(letraTicket++);
            const esInmediata = fechaKey === 'Inmediata';
            const fechaMostrar = esInmediata 
              ? 'Disponible para retiro inmediato' 
              : fechaKey === 'Pendiente'
                ? 'Fecha por confirmar'
                : `Entrega estimada: ${new Date(fechaKey).toLocaleDateString('es-NI')}`;
            
            return (
              <div key={fechaKey} className="mb-6 border border-beige-200 rounded-xl overflow-hidden">
                <div className={`px-4 py-3 border-b border-beige-200 flex justify-between items-center ${esInmediata ? 'bg-success/5' : 'bg-amber-50'}`}>
                  <div>
                    <span className={`text-xs uppercase tracking-wider font-bold block ${esInmediata ? 'text-success' : 'text-amber-700'}`}>
                      Ticket de Entrega {numeroOrden}-{letraActual}
                    </span>
                    <span className="text-sm font-semibold text-azul">{fechaMostrar}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold border ${esInmediata ? 'bg-success/10 text-success border-success/30' : 'bg-amber-100 text-amber-800 border-amber-300'}`}>
                    {esInmediata ? 'Listo en tienda' : 'En producción'}
                  </span>
                </div>
                <div className="p-4 flex flex-col gap-3 bg-blanco">
                  {grupos[fechaKey].map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-azul">{productosPorId[item.producto_id]?.nombre ?? item.producto_id}</div>
                        <div className="text-xs text-marron-400 mt-1">Talla {item.talla} · Color {item.color} · Cant. {item.cantidad}</div>
                      </div>
                      <div className="text-sm font-semibold text-azul ml-4">
                        C${(item.precio_unitario * item.cantidad).toLocaleString('es-NI')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

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
