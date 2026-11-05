import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export default async function InventarioPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );

  // Traer variantes con el nombre del producto
  const { data: variantes } = await supabase
    .from('producto_variantes')
    .select('*, productos(nombre)')
    .order('producto_id')
    .order('talla');

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Inventario Físico</h1>
        <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
          Sincronizado con BD
        </span>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Producto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Talla</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Color</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Stock Físico</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {variantes?.map((v) => (
              <tr key={v.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  {v.productos?.nombre || v.producto_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{v.talla}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{v.color}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">{v.stock_fisico}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {v.stock_fisico > 0 ? (
                    <span className="text-green-600 bg-green-50 px-2 py-1 rounded">En Stock</span>
                  ) : v.en_produccion ? (
                    <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded">Bajo Pedido ({v.lead_time_dias} días)</span>
                  ) : (
                    <span className="text-red-600 bg-red-50 px-2 py-1 rounded">Agotado</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
