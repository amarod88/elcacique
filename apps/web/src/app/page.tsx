'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HeroVideo } from '../components/hero/HeroVideo';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CategoryCard } from '../components/catalog/CategoryCard';
import { ProductCard } from '../components/catalog/ProductCard';
import { getCategorias, getProductosDestacados } from '@el-cacique/shared';

export default function Home() {
  const categorias = getCategorias();
  const productosDestacados = getProductosDestacados().slice(0, 4);

  // Acordeón interactivo para FAQ
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      pregunta: '¿Hacen uniformes médicos?',
      respuesta:
        'Sí. Confeccionamos scrubs, gabachas, batas de laboratorio, chaquetas clínicas y gorros quirúrgicos, con opción de bordado computarizado y corte personalizado a la medida.',
    },
    {
      pregunta: '¿Cuánto cuesta un conjunto médico?',
      respuesta:
        'Desde C$1,200 (esencial) hasta C$2,160 (alta gama a medida). Incluye tela antifluido de alto rendimiento y opción de bordado computarizado.',
    },
    {
      pregunta: '¿Cuál es el pedido mínimo (MOQ)?',
      respuesta:
        'Varía según la categoría: desde 1 unidad en sastrería a medida, filipinas y prendas médicas, hasta 12 unidades en uniformes escolares, industriales y gorras.',
    },
    {
      pregunta: '¿Hacen bordado computarizado?',
      respuesta:
        'Sí, contamos con bordadoras computarizadas industriales para reproducir logotipos corporativos, nombres, monogramas, escudos y banderas con máxima definición.',
    },
    {
      pregunta: '¿Cuánto tardan en entregar un pedido?',
      respuesta:
        '48–72 horas hábiles en prendas de catálogo estándar. De 5 a 20 días en confección a la medida, sastrería o proyectos de gran volumen.',
    },
    {
      pregunta: '¿Tienen garantía de fábrica?',
      respuesta:
        'Sí, de 3 a 6 meses según la prenda. Aceptamos cambios o devoluciones dentro de 1 mes por defectos comprobables de confección o fábrica.',
    },
    {
      pregunta: '¿Qué métodos de pago aceptan?',
      respuesta:
        'Aceptamos PayPal (pasarela online internacional), transferencia bancaria nacional, depósito bancario y efectivo en nuestra sala de ventas.',
    },
    {
      pregunta: '¿Hacen envíos a domicilio?',
      respuesta:
        'Sí. El delivery es completamente gratis dentro del casco urbano de Managua. Para entregas fuera del casco urbano o departamentos, se coordina la tarifa con un asesor.',
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero con Video */}
      <HeroVideo />

      {/* 2. Barra de Confianza (4 Pilares) */}
      <section className="bg-blanco border-y border-azul/10 py-8 shadow-xs">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center gap-2 p-2">
              <div className="w-10 h-10 rounded-full bg-celeste/20 text-azul flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-display text-base text-azul font-semibold">Atención Personalizada</h3>
              <p className="text-xs text-marron-400">Asesoría directa en su empresa o taller</p>
            </div>

            <div className="flex flex-col items-center gap-2 p-2">
              <div className="w-10 h-10 rounded-full bg-celeste/20 text-azul flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="font-display text-base text-azul font-semibold">Bordado Computarizado</h3>
              <p className="text-xs text-marron-400">Alta definición y durabilidad garantizada</p>
            </div>

            <div className="flex flex-col items-center gap-2 p-2">
              <div className="w-10 h-10 rounded-full bg-celeste/20 text-azul flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-display text-base text-azul font-semibold">Garantía de 3 a 6 Meses</h3>
              <p className="text-xs text-marron-400">Respaldo total ante defectos de confección</p>
            </div>

            <div className="flex flex-col items-center gap-2 p-2">
              <div className="w-10 h-10 rounded-full bg-celeste/20 text-azul flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-display text-base text-azul font-semibold">Entrega en 48–72 Horas</h3>
              <p className="text-xs text-marron-400">Delivery gratis en casco urbano de Managua</p>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Categorías de Productos */}
      <Section variant="beige" id="categorias">
        <Container>
          <SectionTitle
            badge="Catálogo Especializado"
            title="Soluciones de Uniformes para Cada Industria"
            subtitle="Explore nuestra gama completa de confección técnica, corporativa e industrial diseñada para los más altos estándares de exigencia."
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {categorias.map((cat) => (
              <CategoryCard key={cat.id} categoria={cat} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button href="/catalogo" variant="primary" size="lg">
              Explorar todo el catálogo (80 productos)
            </Button>
          </div>
        </Container>
      </Section>

      {/* 4. Bloque Destacado de Sastrería a Medida */}
      <Section variant="azul" id="sastreria-destacada">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 flex flex-col gap-6 text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-celeste/20 text-celeste font-body text-xs font-semibold uppercase tracking-wider w-fit">
                División de Alta Confección
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-blanco leading-tight">
                Sastrería Ejecutiva y Trajes a Medida
              </h2>
              <p className="font-body text-base sm:text-lg text-celeste-100/90 leading-relaxed">
                Elaboramos sacos, blazers y ternos completos con patronaje individualizado, entretelas termofusionadas europeas y paños de lana fría y casimir de alta distinción. Un servicio exclusivo para directivos, corporaciones y actos solemnes.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="border-l-2 border-celeste pl-4">
                  <span className="block font-display text-2xl text-blanco font-bold">C$2,500 – C$4,500</span>
                  <span className="text-xs text-celeste-100/70">Blazers ejecutivos a medida</span>
                </div>
                <div className="border-l-2 border-celeste pl-4">
                  <span className="block font-display text-2xl text-blanco font-bold">C$4,000 – C$7,000</span>
                  <span className="text-xs text-celeste-100/70">Traje completo de saco y pantalón</span>
                </div>
              </div>
              <div className="pt-4 flex flex-wrap gap-4">
                <Button href="/sastreria" variant="primary" size="lg" className="!bg-vino hover:!bg-vino-600">
                  Conocer servicio de sastrería
                </Button>
                <Button href="/cotizacion?tipo=sastreria" variant="secondary" size="lg" className="!border-celeste !text-celeste hover:!bg-celeste hover:!text-azul">
                  Agendar toma de medidas
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="aspect-3/4 rounded-2xl bg-azul-500/30 border border-celeste/20 p-8 flex flex-col justify-between overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-radial from-azul-500/40 to-azul-700/80 pointer-events-none" />
                <div className="relative z-10 flex justify-between items-start">
                  <span className="text-xs font-mono text-celeste tracking-widest uppercase">SAS-TRA-001</span>
                  <span className="bg-vino text-blanco text-xs font-semibold px-2.5 py-1 rounded-full">
                    A Medida
                  </span>
                </div>
                <div className="relative z-10 flex flex-col items-center my-auto text-center py-8">
                  <div className="w-24 h-24 rounded-full bg-azul text-celeste flex items-center justify-center mb-4 shadow-inner">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-display text-2xl text-blanco">Corte y Confección Maestra</h3>
                  <p className="text-xs text-celeste-100/80 mt-2 max-w-xs">
                    Pruebas de calce presenciales en Managua con nuestro sastre jefe.
                  </p>
                </div>
                <div className="relative z-10 text-center text-xs text-celeste-100/60 border-t border-celeste/20 pt-4">
                  Tiempo de confección artesanal: 7 a 20 días
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 5. Productos Destacados */}
      <Section variant="blanco" id="destacados">
        <Container>
          <SectionTitle
            badge="Más Solicitados"
            title="Prendas Destacadas de la Fábrica"
            subtitle="Conozca los modelos predilectos de hospitales, industrias y corporaciones en Nicaragua."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productosDestacados.map((prod) => (
              <ProductCard key={prod.id} producto={prod} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button href="/catalogo" variant="secondary" size="md">
              Ver los 80 productos en catálogo
            </Button>
          </div>
        </Container>
      </Section>

      {/* 6. Servicios Industriales y de Confección */}
      <Section variant="beige" id="servicios">
        <Container>
          <SectionTitle
            badge="Capacidades Técnicas"
            title="Servicios Integrales en Nuestra Fábrica"
            subtitle="Equipamiento industrial para dar vida a la imagen corporativa de su institución con acabados de primera clase."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="elevated" className="p-8 text-left flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-vino/10 text-vino flex items-center justify-center font-bold text-xl">
                01
              </div>
              <h3 className="font-display text-2xl text-azul">Bordado Computarizado</h3>
              <p className="font-body text-sm text-marron-400 leading-relaxed">
                Bordadoras electrónicas multicabezales de alta precisión. Reproducimos monogramas, escudos colegiales, nombres y logotipos con hilos resistentes a lavados industriales.
              </p>
              <ul className="text-xs text-marron-400 flex flex-col gap-1.5 pt-2 border-t border-beige-200">
                <li>· Hilos de alta resistencia a cloro y fricción</li>
                <li>· Bordado directo en prendas o parches térmicos</li>
                <li>· Digitalización y ponchado propio</li>
              </ul>
            </Card>

            <Card variant="elevated" className="p-8 text-left flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-azul/10 text-azul flex items-center justify-center font-bold text-xl">
                02
              </div>
              <h3 className="font-display text-2xl text-azul">Confección a la Medida</h3>
              <p className="font-body text-sm text-marron-400 leading-relaxed">
                Toma de medidas in situ para dotaciones completas o cortes individualizados. Adaptamos largos de manga, tiros y tallas especiales desde XS hasta 5XL.
              </p>
              <ul className="text-xs text-marron-400 flex flex-col gap-1.5 pt-2 border-t border-beige-200">
                <li>· Visita de toma de medidas para empresas</li>
                <li>· Muestras físicas antes de producción masiva</li>
                <li>· Tallas especiales y ajustes personalizados</li>
              </ul>
            </Card>

            <Card variant="elevated" className="p-8 text-left flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-vino/10 text-vino flex items-center justify-center font-bold text-xl">
                03
              </div>
              <h3 className="font-display text-2xl text-azul">Patronaje y Desarrollo</h3>
              <p className="font-body text-sm text-marron-400 leading-relaxed">
                Diseñamos uniformes exclusivos para licitaciones o empresas que buscan diferenciarse. Selección de telas importadas antifluido, ripstop o de seguridad reflectiva.
              </p>
              <ul className="text-xs text-marron-400 flex flex-col gap-1.5 pt-2 border-t border-beige-200">
                <li>· Fichas técnicas para licitaciones públicas y privadas</li>
                <li>· Asesoría en normativas de seguridad laboral</li>
                <li>· Control de calidad punto a punto</li>
              </ul>
            </Card>
          </div>
        </Container>
      </Section>

      {/* 7. Proceso de Trabajo en 4 Pasos */}
      <Section variant="blanco" id="proceso">
        <Container>
          <SectionTitle
            badge="Metodología"
            title="Cómo Trabajamos su Pedido"
            subtitle="Un proceso transparente y ágil diseñado para garantizar que sus prendas lleguen exactamente como las necesita."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="p-6 rounded-xl bg-beige-100 border border-beige-200 flex flex-col gap-3">
              <span className="font-mono text-2xl font-bold text-vino">Paso 01</span>
              <h3 className="font-display text-xl text-azul">Cotización Inicial</h3>
              <p className="text-xs text-marron-400 leading-relaxed">
                Seleccione las prendas del catálogo o especifique sus requerimientos de diseño, bordado y cantidad.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-beige-100 border border-beige-200 flex flex-col gap-3">
              <span className="font-mono text-2xl font-bold text-vino">Paso 02</span>
              <h3 className="font-display text-xl text-azul">Validación y Muestra</h3>
              <p className="text-xs text-marron-400 leading-relaxed">
                Un asesor confirma medidas, colores, ponchado de bordado y tiempos de entrega antes de ingresar a taller.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-beige-100 border border-beige-200 flex flex-col gap-3">
              <span className="font-mono text-2xl font-bold text-vino">Paso 03</span>
              <h3 className="font-display text-xl text-azul">Producción en Taller</h3>
              <p className="text-xs text-marron-400 leading-relaxed">
                Corte, confección y bordado computarizado bajo estrictos controles de costura y acabado textil.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-beige-100 border border-beige-200 flex flex-col gap-3">
              <span className="font-mono text-2xl font-bold text-vino">Paso 04</span>
              <h3 className="font-display text-xl text-azul">Entrega y Respaldo</h3>
              <p className="text-xs text-marron-400 leading-relaxed">
                Delivery gratis en Managua y despacho coordinado a departamentos con garantía certificada de fábrica.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* 8. Respaldo y Clientes */}
      <Section variant="beige" id="clientes">
        <Container>
          <div className="max-w-4xl mx-auto text-center flex flex-col gap-8">
            <span className="text-xs font-mono uppercase tracking-widest text-marron-400">
              Confianza Comprobada
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-azul">
              Equipando a los Principales Sectores Productivos de Nicaragua
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 text-center">
              <div className="p-6 rounded-xl bg-blanco border border-azul/5 shadow-xs">
                <span className="block font-display text-3xl font-bold text-azul">80+</span>
                <span className="text-xs text-marron-400 mt-1 block">Modelos en Catálogo</span>
              </div>
              <div className="p-6 rounded-xl bg-blanco border border-azul/5 shadow-xs">
                <span className="block font-display text-3xl font-bold text-azul">48–72h</span>
                <span className="text-xs text-marron-400 mt-1 block">Despacho en Catálogo</span>
              </div>
              <div className="p-6 rounded-xl bg-blanco border border-azul/5 shadow-xs">
                <span className="block font-display text-3xl font-bold text-azul">6 Meses</span>
                <span className="text-xs text-marron-400 mt-1 block">Garantía de Fábrica</span>
              </div>
              <div className="p-6 rounded-xl bg-blanco border border-azul/5 shadow-xs">
                <span className="block font-display text-3xl font-bold text-azul">100%</span>
                <span className="text-xs text-marron-400 mt-1 block">Confección Local</span>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 9. Preguntas Frecuentes (Acordeón) */}
      <Section variant="blanco" id="faq">
        <Container>
          <SectionTitle
            badge="Resolución de Dudas"
            title="Preguntas Frecuentes"
            subtitle="Todo lo que necesita saber sobre cotizaciones, tiempos, bordados y métodos de pago."
          />

          <div className="max-w-3xl mx-auto flex flex-col gap-3">
            {faqs.map((faq, idx) => (
              <div
                key={faq.pregunta}
                className="border border-azul/10 rounded-xl overflow-hidden bg-beige-100 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-display text-lg text-azul hover:text-vino transition-colors"
                  aria-expanded={openFaq === idx}
                >
                  <span>{faq.pregunta}</span>
                  <svg
                    className={`w-5 h-5 shrink-0 text-azul transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 font-body text-sm text-marron leading-relaxed border-t border-beige-200 pt-3">
                    {faq.respuesta}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 10. CTA Final */}
      <Section variant="azul" id="contacto-cta">
        <Container>
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
            <span className="inline-block px-3 py-1 rounded-full bg-celeste/20 text-celeste font-body text-xs font-semibold uppercase tracking-wider">
              Atención Inmediata
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-blanco leading-tight">
              ¿Listo para Uniformar a su Personal con la Mejor Calidad?
            </h2>
            <p className="font-body text-base sm:text-lg text-celeste-100/90 max-w-2xl leading-relaxed">
              Solicite una cotización detallada en línea o contáctenos por WhatsApp para recibir atención personalizada de un asesor técnico.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Button href="/cotizacion" variant="primary" size="lg" className="!bg-vino hover:!bg-vino-600">
                Llenar formulario de cotización
              </Button>
              <a
                href="https://wa.me/50588888888"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center font-body font-medium text-base py-3 px-6 rounded-lg gap-2 text-blanco border border-celeste/50 hover:bg-celeste/10 transition-colors"
              >
                <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.303c-.087.087-.179.182-.077.357.101.174.449.741.964 1.201.662.591 1.221.774 1.394.861.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z" />
                </svg>
                Hablar por WhatsApp (+505 8888-8888)
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
