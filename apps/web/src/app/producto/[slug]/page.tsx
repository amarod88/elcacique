import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
import { ProductImage } from '../../../components/catalog/ProductImage';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Container } from '../../../components/ui/Container';

export const revalidate = 0;

// CORRECCIÓN NEXT.JS 16: params ahora es una Promesa
export default async function ProductoPage({ params }: { params: Promise<{ slug: string }> }) {
  // Esperamos a que la promesa se resuelva
  const { slug } = await params;

  // Consultar el producto a Supabase usando el slug ya resuelto
  const { data: producto, error } = await supabase
    .from('productos')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !producto) {
    notFound();
  }

  const precioBase = producto.precio_mayor ?? producto.precio_retail ?? producto.precio_min ?? 0;

  return (
    <div className="bg-beige min-h-screen py-12">
      <Container>
        {/* Breadcrumb */}
        <nav className="mb-8 text-xs font-body text-marron-400">
          <Link href="/" className="hover:text-azul">Inicio</Link>
          <span className="mx-2">/</span>
          <Link href="/catalogo" className="hover:text-azul">Catálogo</Link>
          <span className="mx-2">/</span>
          <span className="text-azul font-semibold">{producto.nombre}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="sticky top-24">
            <ProductImage
              imagenes={producto.imagenes}
              nombre={producto.nombre}
              categoria={producto.categoria}
              className="rounded-2xl shadow-lg border border-azul/10"
              priority
            />
          </div>

          <div className="flex flex-col gap-6 text-left">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="category">{producto.categoria}</Badge>
                <Badge variant="default">{producto.subcategoria}</Badge>
                {producto.destacado && <Badge variant="new">Destacado</Badge>}
              </div>
              <span className="text-xs font-mono text-marron-400 uppercase tracking-widest mb-2 block">
                SKU: {producto.id}
              </span>
              <h1 className="font-display text-3xl md:text-5xl text-azul leading-tight mb-4">
                {producto.nombre}
              </h1>
              <p className="text-marron-400 text-sm leading-relaxed mb-6">
                {producto.descripcion}
              </p>
            </div>

            <div className="bg-blanco p-6 rounded-xl border border-azul/10 shadow-sm flex flex-col gap-2">
              <div className="flex justify-between items-center border-b border-beige-200 pb-3">
                <span className="text-sm text-marron">Precio Retail (1-11 uds)</span>
                <span className="font-display text-2xl text-azul font-bold">
                  {producto.precio_retail ? `C$${producto.precio_retail.toLocaleString('es-NI')}` : 'Cotización'}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-sm font-semibold text-vino">Precio Mayor (12+ uds)</span>
                <span className="font-display text-3xl text-vino font-bold">
                  {producto.precio_mayor ? `C$${producto.precio_mayor.toLocaleString('es-NI')}` : `C$${precioBase.toLocaleString('es-NI')}`}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm font-body">
              <div className="bg-blanco p-4 rounded-lg border border-beige-200">
                <span className="block text-xs text-marron-400 mb-1">Telas</span>
                <span className="font-medium text-azul">{producto.telas?.join(', ') || 'No especificada'}</span>
              </div>
              <div className="bg-blanco p-4 rounded-lg border border-beige-200">
                <span className="block text-xs text-marron-400 mb-1">Tiempo de Entrega</span>
                <span className="font-medium text-azul">{producto.tiempo_entrega}</span>
              </div>
              <div className="bg-blanco p-4 rounded-lg border border-beige-200">
                <span className="block text-xs text-marron-400 mb-1">Garantía</span>
                <span className="font-medium text-azul">{producto.garantia}</span>
              </div>
              <div className="bg-blanco p-4 rounded-lg border border-beige-200">
                <span className="block text-xs text-marron-400 mb-1">Pedido Mínimo (MOQ)</span>
                <span className="font-medium text-azul">{producto.moq} unidad(es)</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <span className="text-sm font-semibold text-azul block mb-2">Tallas disponibles</span>
                <div className="flex flex-wrap gap-2">
                  {producto.tallas?.map((t: string) => (
                    <span key={t} className="px-3 py-1 bg-blanco border border-beige-200 rounded text-xs text-marron font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-sm font-semibold text-azul block mb-2">Colores disponibles</span>
                <div className="flex flex-wrap gap-2">
                  {producto.colores?.map((c: string) => (
                    <span key={c} className="px-3 py-1 bg-blanco border border-beige-200 rounded text-xs text-marron font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <Button variant="primary" size="lg" className="w-full text-lg shadow-lg">
                Agregar al Carrito
              </Button>
              <Button variant="outline" size="lg" className="w-full">
                Solicitar Cotización Personalizada
              </Button>
            </div>
            
            <p className="text-xs text-marron-400 text-center mt-2">
              * El precio final y los tiempos de entrega serán confirmados por un asesor.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
