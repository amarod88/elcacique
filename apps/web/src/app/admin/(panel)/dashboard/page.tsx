import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );

  // Traer métricas en paralelo
  const [pedidos, bajoPedido] = await Promise.all([
    supabase.from('pedidos').select('total', { count: 'exact' }),
    supabase.from('pedido_items').select('*', { count: 'exact' }).eq('es_bajo_pedido', true)
  ]);

  const totalVentas = pedidos.data?.reduce((acc, curr) => acc + Number(curr.total), 0) || 0;
  const cantidadPedidos = pedidos.count || 0;
  const itemsProduccion = bajoPedido.count || 0;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500 mb-1">Ventas Totales</p>
          <p className="text-3xl font-bold text-slate-900">${totalVentas.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500 mb-1">Pedidos Totales</p>
          <p className="text-3xl font-bold text-slate-900">{cantidadPedidos}</p>
        </div>
        <div className="bg-amber-50 p-6 rounded-lg shadow-sm border border-amber-200">
          <p className="text-sm font-medium text-amber-700 mb-1">Cola de Producción (Bajo Pedido)</p>
          <p className="text-3xl font-bold text-amber-900">{itemsProduccion} prendas</p>
        </div>
      </div>
    </div>
  );
}
