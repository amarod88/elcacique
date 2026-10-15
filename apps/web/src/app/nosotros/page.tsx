'use client';

import React from 'react';
import { Container } from '../../components/ui/Container';
import { Section } from '../../components/ui/Section';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function NosotrosPage() {
  return (
    <div className="flex flex-col w-full bg-beige min-h-screen text-left">
      {/* Hero Nosotros */}
      <section className="bg-azul text-blanco py-20 md:py-28">
        <Container>
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
            <span className="px-3.5 py-1 rounded-full bg-celeste/20 text-celeste text-xs font-body font-semibold uppercase tracking-wider">
              Nuestra Trayectoria y Valores
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-blanco leading-tight">
              Fábrica de Uniformes El Cacique
            </h1>
            <p className="font-body text-base sm:text-lg text-celeste-100/90 leading-relaxed max-w-2xl">
              Nacidos con la vocación de vestir con dignidad, elegancia y protección a la fuerza laboral de Nicaragua. Desde el sector médico y la sastrería a medida hasta la dotación industrial de alta seguridad.
            </p>
          </div>
        </Container>
      </section>

      {/* Historia y Visión */}
      <Section variant="blanco">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 flex flex-col gap-6">
              <span className="text-xs font-mono uppercase tracking-widest text-vino font-bold">
                Historia y Compromiso
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-azul leading-tight">
                Tradición Textil con Tecnología de Vanguardia
              </h2>
              <p className="font-body text-sm sm:text-base text-marron leading-relaxed">
                El Cacique inició como un taller artesanal enfocado en el calce impecable y la durabilidad de las costuras. Hoy operamos una moderna fábrica en Managua con maquinaria industrial de corte, confección y bordado computarizado, manteniendo intacta nuestra esencia: atender a cada cliente con calidez, rigor técnico y respeto a sus tiempos.
              </p>
              <p className="font-body text-sm sm:text-base text-marron leading-relaxed">
                Creemos que un uniforme no es solo una prenda de trabajo, sino el reflejo directo de la cultura, seriedad y profesionalismo de cada empresa o institución que confía en nosotros.
              </p>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <Card variant="flat" className="p-6 flex flex-col gap-2">
                <span className="font-display text-3xl font-bold text-azul">100%</span>
                <span className="font-body text-xs text-marron-400">Mano de obra y confección nicaragüense</span>
              </Card>
              <Card variant="flat" className="p-6 flex flex-col gap-2">
                <span className="font-display text-3xl font-bold text-azul">48–72h</span>
                <span className="font-body text-xs text-marron-400">Compromiso de entrega en catálogo local</span>
              </Card>
              <Card variant="flat" className="p-6 flex flex-col gap-2">
                <span className="font-display text-3xl font-bold text-azul">3–6 Meses</span>
                <span className="font-body text-xs text-marron-400">Garantía formal en todas nuestras prendas</span>
              </Card>
              <Card variant="flat" className="p-6 flex flex-col gap-2">
                <span className="font-display text-3xl font-bold text-azul">80+</span>
                <span className="font-body text-xs text-marron-400">Modelos y variantes en catálogo continuo</span>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* Fortalezas de Fábrica */}
      <Section variant="beige">
        <Container>
          <SectionTitle
            badge="Ventajas Competitivas"
            title="Por Qué Elegir a El Cacique"
            subtitle="Nos diferenciamos por brindar una experiencia ágil, confiable y con respaldo real en Managua."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="elevated" className="p-6 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-vino/10 text-vino flex items-center justify-center font-bold">
                ✓
              </div>
              <h3 className="font-display text-lg text-azul">Atención Personalizada</h3>
              <p className="text-xs text-marron-400 leading-relaxed">
                Asesores dedicados que le acompañan desde la selección de tela hasta la entrega de la última prenda.
              </p>
            </Card>

            <Card variant="elevated" className="p-6 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-vino/10 text-vino flex items-center justify-center font-bold">
                ✓
              </div>
              <h3 className="font-display text-lg text-azul">Bordado Computarizado</h3>
              <p className="text-xs text-marron-400 leading-relaxed">
                Puntadas de alta densidad que resisten el uso rudo sin deshilacharse ni perder tonalidad con lavados.
              </p>
            </Card>

            <Card variant="elevated" className="p-6 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-vino/10 text-vino flex items-center justify-center font-bold">
                ✓
              </div>
              <h3 className="font-display text-lg text-azul">Confección a la Medida</h3>
              <p className="text-xs text-marron-400 leading-relaxed">
                Flexibilidad para ajustar patrones, largos y tiros para garantizar comodidad total en el trabajo.
              </p>
            </Card>

            <Card variant="elevated" className="p-6 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-vino/10 text-vino flex items-center justify-center font-bold">
                ✓
              </div>
              <h3 className="font-display text-lg text-azul">Delivery Gratuito</h3>
              <p className="text-xs text-marron-400 leading-relaxed">
                Despacho ágil sin costo adicional dentro de todo el casco urbano de Managua.
              </p>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Button href="/cotizacion" variant="primary" size="lg">
              Cotizar dotación para mi empresa
            </Button>
          </div>
        </Container>
      </Section>
    </div>
  );
}
