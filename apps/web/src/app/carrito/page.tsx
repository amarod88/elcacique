'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { ProductImage } from '../../components/catalog/ProductImage';
import { useCartStore } from '../../lib/store/cart';
import { PayPalButton } from '../../components/cart/PayPalButton';
import { etiquetaEntrega } from '../../lib/config/entrega';
import { supabase } from '../../lib/supabase';

const emptySubscribe = () => () => {};

export default function CarritoPage() {
  const isHydrated = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const total = useCartStore((state) => state.total);

  const [user, setUser] = useState<any>(null);
  const [perfil, setPerfil] = useState<any>(null);
  const [cargandoPerfil, setCargandoPerfil] = useState(true);
  
  // Estados para el formulario de checkout
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        // Buscar perfil
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        setPerfil(data);
        if (data) {
          setTelefono(data.telefono || '');
          setDireccion(data.direccion || '');
        }
      }
      setCargandoPerfil(false);
    }
    if (isHydrated) checkUser();
  }, [isHydrated]);

  if (!isHydrated || cargandoPerfil) return null;

  // Lógica del Checkout Gate: Si está logueado y le faltan datos, bloqueamos la compra
  const requiereDatos = user && (!perfil?.telefono || !perfil?.direccion);

  const handleGuardarDatos = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    const { error } = await supabase.from('profiles').update({ telefono, direccion }).eq('id', user.id);
    if (!error) {
      setPerfil({ ...perfil, telefono, direccion });
    }
    setGuardando(false);
  };

  return (
    <div className="bg-beige min-h-screen py-16">
      <Container>
        <div className="mb-10 pb-6 border-b border-azul/10 text-left">
          <h1 className="font-display text-4xl text-azul mb-2">Bolsa de Compras</h1>
          <p className="text-marron-400 text-sm max-w-2xl">Revise sus prendas. Desde 12 unidades por producto se aplica tarifa por mayor.</p>
        </div>

        {items.length === 0 ? (
          <div className="bg-blanco p-12 rounded-2xl border border-azul/10 text-center">
            <h2 className="font-display text-2xl text-azul mb-2">Tu carrito está vacío</h2>
            <Link href="/catalogo"><Button variant="primary" size="lg">Explorar catálogo</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Lista de Productos */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {items.map((item) => {
                const precio = item.precioUnitario;
                const etiqueta = etiquetaEntrega({
                  esBajoPedido: item.esBajoPedido ?? false,
                  leadTimeDias: item.leadTimeDias,
                  tiempoReposicionHoras: item.tiempoReposicionHoras,
                });
                const colorEtiqueta = etiqueta.tipo === 'inmediata' ? 'bg-success/10 text-success border-success/30' : etiqueta.tipo === 'reposicion' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-azul/10 text-azul border-azul/30';

                return (
                  <div key={`${item.productoId}-${item.talla}-${item.color}-${item.esBajoPedido}`} className="bg-blanco p-4 rounded-xl border border-azul/10 shadow-sm flex items-center gap-4">
                    <div className="w-16 h-20 rounded-xl bg-beige-100 border border-beige-200 overflow-hidden shrink-0">
                      <ProductImage imagenes={[]} nombre={item.nombre} categoria={item.categoria} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-base text-azul font-medium">{item.nombre}</h3>
                      <p className="text-xs text-marron-400 mt-1">Talla: {item.talla} | Color: {item.color}</p>
                      <span className={`inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full border ${colorEtiqueta}`}>{etiqueta.texto}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-azul block">C${(precio * item.cantidad).toLocaleString('es-NI')}</span>
                      <button onClick={() => removeItem(item.productoId, item.talla, item.color, item.esBajoPedido ?? false)} className="text-xs text-vino hover:underline mt-1">Eliminar</button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Resumen y Pago */}
            <div className="bg-blanco p-6 rounded-2xl border border-azul/10 shadow-sm sticky top-24">
              <h3 className="font-display text-xl text-azul mb-4">Resumen</h3>
              
              <div className="flex justify-between items-center mb-6 pt-4 border-t border-beige-200">
                <span className="font-semibold text-azul text-lg">Total:</span>
                <span className="font-display text-2xl text-vino font-bold">C${total().toLocaleString('es-NI')}</span>
              </div>

              {/* CHECKOUT GATE */}
              {!user ? (
                <div className="mb-4">
                  <p className="text-xs text-marron-400 text-center mb-3">Debes iniciar sesión para completar tu compra.</p>
                  <Link href="/login"><Button variant="primary" className="w-full">Iniciar Sesión / Registrarse</Button></Link>
                </div>
              ) : requiereDatos ? (
                <div className="mb-4 bg-beige-100 p-4 rounded-xl border border-beige-200">
                  <p className="text-xs font-semibold text-azul mb-3">Por favor, completa tus datos para el envío:</p>
                  <form onSubmit={handleGuardarDatos} className="flex flex-col gap-3">
                    <input type="tel" placeholder="Número de teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} required className="w-full px-3 py-2 text-sm rounded-lg border border-beige-200 focus:outline-none focus:border-azul" />
                    <input type="text" placeholder="Dirección de entrega exacta" value={direccion} onChange={e => setDireccion(e.target.value)} required className="w-full px-3 py-2 text-sm rounded-lg border border-beige-200 focus:outline-none focus:border-azul" />
                    <Button type="submit" variant="primary" disabled={guardando} className="w-full mt-2">
                      {guardando ? 'Guardando...' : 'Guardar Datos'}
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="mb-4">
                  <PayPalButton />
                </div>
              )}

              <div className="text-center mt-4">
                <Link href="/catalogo" className="text-xs text-azul hover:underline">← Seguir comprando</Link>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
