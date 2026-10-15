'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Producto, calcularPrecio } from '@el-cacique/shared';
import { Container } from '../ui/Container';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { PriceTag } from './PriceTag';
import { ProductImage } from './ProductImage';
import { ProductCard } from './ProductCard';
import { useCartStore } from '../../lib/store/cart';

export interface ProductDetailClientProps {
  producto: Producto;
  relacionados: Producto[];
}

export function ProductDetailClient({
  producto,
  relacionados,
}: ProductDetailClientProps) {
  const addItem = useCartStore((state) => state.addItem);

  // Estados interactivos
  const [selectedTalla, setSelectedTalla] = useState(producto.tallas[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(producto.colores[0] || 'Azul');
  const [cantidad, setCantidad] = useState(1);
  const [incluirBordado, setIncluirBordado] = useState(
    producto.personalizacion && producto.personalizacion.length > 0
  );
  const [toastVisible, setToastVisible] = useState(false);

  // Cálculo de precio unitario y total
  const unitPrice = calcularPrecio(producto, cantidad);
  const subtotal = unitPrice * cantidad;

  const handleAddToCart = () => {
    addItem({
      productoId: producto.id,
      slug: producto.slug,
      nombre: producto.nombre,
      categoria: producto.categoria,
      talla: selectedTalla,
      color: selectedColor,
      bordado: incluirBordado,
      cantidad,
      precioUnitario: unitPrice,
    });

    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 2000);
  };

  return (
    <div className="py-8 md:py-14 bg-beige min-h-screen text-left">
      <Container>
        {/* Toast Simple (2 segundos) */}
        {toastVisible && (
          <div className="fixed bottom-6 right-6 z-50 bg-azul text-blanco px-5 py-3 rounded-xl shadow-xl border border-celeste/30 font-body text-sm flex items-center gap-3 animate-fade-in-delayed">
            <span className="w-5 h-5 rounded-full bg-success text-blanco flex items-center justify-center text-xs font-bold">
              ✓
            </span>
            <span>Producto agregado al carrito</span>
            <Link href="/carrito" className="underline font-bold text-celeste hover:text-blanco ml-2">
              Ver carrito
            </Link>
          </div>
        )}

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-marron-400 font-body mb-8">
          <Link href="/" className="hover:text-azul transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/catalogo" className="hover:text-azul transition-colors">
            Catálogo
          </Link>
          <span>/</span>
          <Link
            href={`/catalogo?categoria=${producto.categoria}`}
            className="hover:text-azul capitalize transition-colors"
          >
            {producto.categoria}
          </Link>
          <span>/</span>
          <span className="text-azul font-semibold truncate max-w-xs">
            {producto.nombre}
          </span>
        </nav>

        {/* Ficha Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-blanco rounded-2xl p-6 sm:p-8 md:p-10 border border-azul/10 shadow-sm">
          {/* Galería de Imágenes */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="relative aspect-4/5 w-full bg-beige-200 rounded-xl overflow-hidden border border-azul/5">
              <ProductImage
                productoId={producto.id}
                nombre={producto.nombre}
                categoria={producto.subcategoria || producto.categoria}
                transformacion="detalle"
                priority
              />

              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                <Badge variant="category">{producto.subcategoria}</Badge>
                {producto.destacado && <Badge variant="price">Destacado</Badge>}
                {producto.delivery_gratis && (
                  <Badge variant="new">Delivery Gratis Managua</Badge>
                )}
              </div>
            </div>

            {/* Miniaturas de vista previa */}
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((idx) => (
                <div
                  key={idx}
                  className={`aspect-square rounded-lg bg-beige-100 border flex items-center justify-center cursor-pointer transition-colors ${
                    idx === 1
                      ? 'border-azul ring-1 ring-azul'
                      : 'border-beige-200 hover:border-azul/50'
                  }`}
                >
                  <span className="font-mono text-[10px] text-marron-400">
                    Vista {idx}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Información y Selectores */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="premium">{producto.categoria.toUpperCase()}</Badge>
                <span className="text-xs font-mono text-marron-400">
                  Código: {producto.id}
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl text-azul tracking-tight">
                {producto.nombre}
              </h1>

              <PriceTag producto={producto} cantidad={cantidad} size="lg" />

              <p className="font-body text-sm text-marron-400 leading-relaxed border-t border-b border-beige-200 py-4">
                {producto.descripcion}
              </p>

              {/* Selector de Talla */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-body font-semibold text-azul uppercase tracking-wider">
                  Seleccionar Talla ({producto.tallas.length} disponibles)
                </label>
                <div className="flex flex-wrap gap-2">
                  {producto.tallas.map((talla) => (
                    <button
                      key={talla}
                      type="button"
                      onClick={() => setSelectedTalla(talla)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-all cursor-pointer ${
                        selectedTalla === talla
                          ? 'bg-azul text-blanco shadow-xs'
                          : 'bg-beige-100 text-marron hover:bg-beige-200 border border-beige-200'
                      }`}
                    >
                      {talla}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector de Color */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-body font-semibold text-azul uppercase tracking-wider">
                  Color de Prenda
                </label>
                <div className="flex flex-wrap gap-2">
                  {producto.colores.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-all cursor-pointer ${
                        selectedColor === color
                          ? 'bg-vino text-blanco shadow-xs'
                          : 'bg-beige-100 text-marron hover:bg-beige-200 border border-beige-200'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cantidad y Aviso Mayorista */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-body font-semibold text-azul uppercase tracking-wider">
                  Cantidad Solicitada
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gris-200 rounded-lg overflow-hidden bg-beige-100">
                    <button
                      type="button"
                      onClick={() =>
                        setCantidad((prev) => Math.max(producto.moq || 1, prev - 1))
                      }
                      className="px-3 py-1.5 text-base font-bold text-azul hover:bg-beige-200 cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={producto.moq || 1}
                      value={cantidad}
                      onChange={(e) =>
                        setCantidad(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-16 text-center text-sm font-semibold bg-transparent outline-none py-1.5"
                    />
                    <button
                      type="button"
                      onClick={() => setCantidad((prev) => prev + 1)}
                      className="px-3 py-1.5 text-base font-bold text-azul hover:bg-beige-200 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-marron-400">
                    {cantidad >= 12 ? (
                      <strong className="text-success font-medium">
                        ✓ Tarifa mayorista activa
                      </strong>
                    ) : (
                      'A partir de 12 unidades aplica precio por mayor'
                    )}
                  </span>
                </div>
              </div>

              {/* Checkbox de Bordado */}
              {producto.personalizacion && producto.personalizacion.length > 0 && (
                <div className="p-4 rounded-xl bg-beige-100 border border-beige-200 flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-azul cursor-pointer">
                    <input
                      type="checkbox"
                      checked={incluirBordado}
                      onChange={(e) => setIncluirBordado(e.target.checked)}
                      className="rounded text-vino focus:ring-vino"
                    />
                    Bordado computarizado personalizado
                  </label>
                  <p className="text-[11px] text-marron-400">
                    Técnicas: {producto.personalizacion.join(', ')}
                  </p>
                </div>
              )}
            </div>

            {/* Acciones de Compra y Cotización */}
            <div className="flex flex-col gap-3 pt-4 border-t border-beige-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-marron-400">
                  Subtotal estimado ({cantidad} unid.):
                </span>
                <span className="font-display text-2xl text-azul font-bold">
                  C${subtotal.toLocaleString('es-NI', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button variant="primary" size="lg" onClick={handleAddToCart}>
                  Agregar al carrito
                </Button>
                <Button
                  href={`/cotizacion?producto=${producto.slug}&cant=${cantidad}`}
                  variant="secondary"
                  size="lg"
                >
                  Solicitar cotización
                </Button>
              </div>

              <a
                href={`https://wa.me/50588888888?text=Hola,%20deseo%20consultar%20por%20la%20prenda%20${encodeURIComponent(
                  producto.nombre
                )}%20(${producto.id})`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-lg border border-azul/20 text-azul hover:bg-beige-100 text-xs font-medium text-center flex items-center justify-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.303c-.087.087-.179.182-.077.357.101.174.449.741.964 1.201.662.591 1.221.774 1.394.861.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z" />
                </svg>
                Hablar con un asesor técnico
              </a>
            </div>
          </div>
        </div>

        {/* Ficha Técnica Completa */}
        <div className="mt-12 bg-blanco rounded-2xl p-6 sm:p-8 border border-azul/10 shadow-xs">
          <h2 className="font-display text-2xl text-azul mb-6 pb-3 border-b border-beige-200">
            Ficha Técnica de Confección
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-body">
            <div className="flex flex-col gap-1 p-4 rounded-xl bg-beige-100">
              <span className="text-marron-400 font-semibold uppercase">
                Telas y Composición
              </span>
              <span className="text-azul font-medium">
                {producto.telas.join(', ')}
              </span>
            </div>

            <div className="flex flex-col gap-1 p-4 rounded-xl bg-beige-100">
              <span className="text-marron-400 font-semibold uppercase">
                Tiempo de Entrega
              </span>
              <span className="text-azul font-medium">{producto.tiempo_entrega}</span>
            </div>

            <div className="flex flex-col gap-1 p-4 rounded-xl bg-beige-100">
              <span className="text-marron-400 font-semibold uppercase">
                Garantía Certificada
              </span>
              <span className="text-azul font-medium">{producto.garantia}</span>
            </div>

            <div className="flex flex-col gap-1 p-4 rounded-xl bg-beige-100">
              <span className="text-marron-400 font-semibold uppercase">
                Pedido Mínimo (MOQ)
              </span>
              <span className="text-azul font-medium">
                {producto.moq} unidad{producto.moq > 1 ? 'es' : ''}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-beige-200 text-xs text-marron-400 flex flex-wrap gap-6">
            <span>
              <strong>Personalización:</strong> {producto.personalizacion.join(', ')}
            </span>
            <span>
              <strong>Delivery:</strong>{' '}
              {producto.delivery_gratis
                ? 'Gratis en Managua (casco urbano)'
                : 'A coordinar según municipio'}
            </span>
            <span>
              <strong>Garantía:</strong> 1 mes para cambio inmediato por defecto de fábrica.
            </span>
          </div>
        </div>

        {/* Productos Relacionados */}
        {relacionados.length > 0 && (
          <div className="mt-16 text-left">
            <h2 className="font-display text-2xl sm:text-3xl text-azul mb-6">
              Otras Prendas en {producto.categoria.toUpperCase()}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relacionados.map((rel) => (
                <ProductCard key={rel.id} producto={rel} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
