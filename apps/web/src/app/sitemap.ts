import type { MetadataRoute } from 'next';
import { productos } from '@el-cacique/shared';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elcacique.com.ni';

  // Rutas estáticas clave
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/catalogo`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cotizacion`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sastreria`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/nosotros`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // 80 fichas de productos dinámicas
  const productRoutes: MetadataRoute.Sitemap = productos.map((prod) => ({
    url: `${baseUrl}/producto/${prod.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}
