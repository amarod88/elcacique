'use client';

import React from 'react';
import { Container } from '../../components/ui/Container';
import { Section } from '../../components/ui/Section';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { getProductosByCategoria } from '@el-cacique/shared';
import { ProductCard } from '../../components/catalog/ProductCard';

export default function SastreriaPage() {
  const productosSastreria = getProductosByCategoria('sastreria');

  return (
    <div className="flex flex-col w-full bg-beige min-h-screen">
      {/* Hero de Sastrería */}
      <section className="bg-azul-700 text-blanco py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#A8D5E5_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <Container>
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6 relative z-10">
            <span className="px-3.5 py-1 rounded-full bg-celeste/20 text-celeste text-xs font-body font-semibold uppercase tracking-wider">
              Taller de Alta Costura Masculina y Femenina
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-blanco leading-tight">
              Sastrería Ejecutiva y Artesanal a Medida
            </h1>
            <p className="font-body text-base sm:text-lg text-celeste-100/90 leading-relaxed max-w-2xl">
              Corte milimétrico sobre patrón individual. Prendas formales con entretelas europeas, forros de satén y telas nobles de lana fría y casimir seleccionadas para resistir el clima tropical de Nicaragua.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button href="/cotizacion?tipo=sastreria" variant="primary" size="lg" className="!bg-vino hover:!bg-vino-600">
                Agendar cita con sastre maestro
              </Button>
              <Button href="#modelos" variant="secondary" size="lg" className="!border-celeste !text-celeste hover:!bg-celeste hover:!text-azul">
                Ver modelos y rangos
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Proceso Sastre en 4 Etapas */}
      <Section variant="blanco" id="proceso-sastre">
        <Container>
          <SectionTitle
            badge="Tradición y Calce"
            title="El Arte de la Confección a Mano"
            subtitle="Cada pieza pasa por un riguroso proceso de confección artesanal en Managua garantizando caída, ligereza y presencia ejecutiva."
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            <Card variant="flat" className="p-6 flex flex-col gap-3">
              <span className="font-mono text-2xl font-bold text-vino">Etapa 01</span>
              <h3 className="font-display text-xl text-azul">Toma de Medidas</h3>
              <p className="text-xs text-marron-400 leading-relaxed">
                Evaluamos postura, caída de hombros y proporciones físicas en nuestra sala de pruebas o en su despacho.
              </p>
            </Card>

            <Card variant="flat" className="p-6 flex flex-col gap-3">
              <span className="font-mono text-2xl font-bold text-vino">Etapa 02</span>
              <h3 className="font-display text-xl text-azul">Selección de Paños</h3>
              <p className="text-xs text-marron-400 leading-relaxed">
                Muestrario de lanas tropicales Super 120s, casimires italianos, forros y botones de asta o nácar.
              </p>
            </Card>

            <Card variant="flat" className="p-6 flex flex-col gap-3">
              <span className="font-mono text-2xl font-bold text-vino">Etapa 03</span>
              <h3 className="font-display text-xl text-azul">Prueba Intermedia</h3>
              <p className="text-xs text-marron-400 leading-relaxed">
                Prueba de estructura semiterminada para ajustar solapas, entalle de cintura y largo de mangas.
              </p>
            </Card>

            <Card variant="flat" className="p-6 flex flex-col gap-3">
              <span className="font-mono text-2xl font-bold text-vino">Etapa 04</span>
              <h3 className="font-display text-xl text-azul">Entrega y Guardapolvo</h3>
              <p className="text-xs text-marron-400 leading-relaxed">
                Planchado al vapor artesanal y entrega en porta-trajes de viaje de cortesía en 7 a 20 días hábiles.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Modelos de Sastrería */}
      <Section variant="beige" id="modelos">
        <Container>
          <SectionTitle
            badge="Prendas Disponibles"
            title="Nuestra Colección de Sastrería"
            subtitle="Precios claros con rango presupuestario cerrado para confección a medida en Managua."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productosSastreria.map((prod) => (
              <ProductCard key={prod.id} producto={prod} />
            ))}
          </div>

          <div className="mt-16 bg-blanco p-8 rounded-2xl border border-azul/10 text-center max-w-3xl mx-auto shadow-xs flex flex-col items-center gap-4">
            <h3 className="font-display text-2xl text-azul">¿Requiere dotación ejecutiva para directiva o bufete?</h3>
            <p className="font-body text-sm text-marron-400 leading-relaxed">
              Atendemos visitas corporativas para grupos de más de 5 personas directamente en sus oficinas corporativas en Managua.
            </p>
            <Button href="/cotizacion?tipo=corporativo-sastreria" variant="primary" size="md">
              Solicitar visita de sastre a empresa
            </Button>
          </div>
        </Container>
      </Section>
    </div>
  );
}
