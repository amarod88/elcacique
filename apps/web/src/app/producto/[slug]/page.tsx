import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { productos, getProductoBySlug, getProductosByCategoria } from '@el-cacique/shared';
import { ProductDetailClient } from '../../../components/catalog/ProductDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return productos.map((producto) => ({
    slug: producto.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const producto = getProductoBySlug(slug);

  if (!producto) {
    return {
      title: 'Producto no encontrado — El Cacique',
      description: 'El uniforme o prenda solicitada no está disponible en nuestro catálogo.',
    };
  }

  const precioStr = producto.precio_retail
    ? `C$${producto.precio_retail}`
    : producto.precio_min
    ? `Desde C$${producto.precio_min}`
    : 'Cotización a medida';

  return {
    title: `${producto.nombre} | El Cacique — Fábrica de Uniformes`,
    description: `${producto.descripcion} Precios retail y mayoreo (${precioStr}). Confección industrial y corporativa en Nicaragua.`,
    openGraph: {
      title: `${producto.nombre} — El Cacique`,
      description: producto.descripcion,
      type: 'website',
      url: `https://elcacique.com.ni/producto/${producto.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${producto.nombre} | El Cacique`,
      description: producto.descripcion,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const producto = getProductoBySlug(slug);

  if (!producto) {
    notFound();
  }

  const relacionados = getProductosByCategoria(producto.categoria)
    .filter((p) => p.id !== producto.id)
    .slice(0, 4);

  return <ProductDetailClient producto={producto} relacionados={relacionados} />;
}
