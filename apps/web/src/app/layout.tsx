import { Suspense } from 'react';
import type { Metadata } from 'next';
import { DM_Serif_Display, Inter } from 'next/font/google';
import './globals.css';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import ChatWidget from '../components/chat/ChatWidget';

const dmSerifDisplay = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://elcacique.net'),
  title: {
    default: 'El Cacique — Fábrica de Uniformes en Nicaragua',
    template: '%s | El Cacique — Fábrica de Uniformes',
  },
  description:
    'Fábrica de uniformes médicos, industriales, corporativos y escolares en Managua, Nicaragua. Confección a medida, bordado computarizado de alta definición y entrega en 48–72 horas.',
  keywords: [
    'uniformes nicaragua',
    'fábrica de uniformes managua',
    'scrubs medicos nicaragua',
    'uniformes industriales managua',
    'camisas oxford bordadas',
    'sastrería ejecutiva nicaragua',
    'ropa de trabajo managua',
    'el cacique uniformes',
  ],
  openGraph: {
    title: 'El Cacique — Fábrica de Uniformes en Nicaragua',
    description:
      'Uniformes que proyectan presencia. Confección industrial, médica, ejecutiva y escolar con garantía de 3 a 6 meses y delivery gratis en Managua.',
    url: 'https://elcacique.net',
    siteName: 'El Cacique',
    locale: 'es_NI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'El Cacique — Fábrica de Uniformes en Nicaragua',
    description:
      'Confección de uniformes de alta gama con bordado computarizado en Managua, Nicaragua.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${dmSerifDisplay.variable} ${inter.variable} flex flex-col min-h-screen bg-beige text-marron antialiased`}
      >
        <Suspense fallback={<div className="h-20 w-full bg-white border-b border-gray-100 shadow-sm" />}>
          <Header />
        </Suspense>
        {/* El padding-top asegura que el contenido no quede oculto detrás del header sticky */}
        <main className="flex-1 flex flex-col w-full">
          {children}
        </main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
