'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';

export default function MisPedidosPage() {
  const [user, setUser] = useState<any>(null);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPedidos() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoading(false);
        return;
      }
      setUser(session.user);

      const { data, error } = await supabase
        .from('pedidos')
        .select('*, pedido_items(*)')
        .eq('usuario_id', session.user.id)
        .order('created_at', { ascending: false });

      if (!error && data) setPedidos(data);
      setLoading(false);
    }
    fetchPedidos();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-azul font-display text-2xl">Cargando pedidos...</div>;

  if (!user) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-2xl font-display text-azul mb-4">Inicia sesión para ver tus pedidos</h1>
      <Link href="/login" className="bg-azul text-white px-6 py-2 rounded-lg font-semibold hover:bg-azul/90">Ir al Login</Link>
    </div>
  );

  return (
    <div className="py-12 md:py-16 bg-beige min-h-screen">
      <div className="max-w-[1000px] mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-display text-azul mb-8 border-b border-azul/10 pb-4">Mis Pedidos</h1>
        
        {pedidos.length === 0 ? (
          <div className="bg-white p-12 rounded-xl text-center shadow-sm border border-gray-100">
            <h3 className="text-xl font-display text-azul mb-2">Aún no tienes pedidos</h3>
            <p className="text-marron-400 mb-6">Explora nuestro catálogo y encuentra la prenda perfecta.</p>
            <Link href="/catalogo" className="bg-azul text-white px-6 py-2 rounded-lg font-semibold hover:bg-azul/90">Ir al Catálogo</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b border-gray-100 gap-2">
                  <div>
                    <span className="text-xs font-bold text-marron-400 uppercase tracking-wider">Pedido</span>
                    <p className="font-mono text-sm text-azul">#{pedido.id.split('-')[0].toUpperCase()}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-marron-400 uppercase tracking-wider">Fecha</span>
                    <p className="text-sm text-azul">{new Date(pedido.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-marron-400 uppercase tracking-wider">Estado</span>
                    <span className="inline-block bg-azul/10 text-azul px-2 py-1 rounded text-xs font-bold capitalize mt-1">{pedido.estado}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-marron-400 uppercase tracking-wider">Total</span>
                    <p className="font-bold text-lg text-azul">C$ {pedido.total.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {pedido.pedido_items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-marron">{item.cantidad}x {item.producto_nombre || item.producto_id}</span>
                      <span className="text-azul font-medium">C$ {(item.precio_unitario * item.cantidad).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
