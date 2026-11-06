'use client';

import React, { useState } from 'react';
import { Container } from '../../components/ui/Container';
import { SectionTitle } from '../../components/ui/SectionTitle';

export default function FaqPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    { pregunta: '¿Hacen uniformes médicos?', respuesta: 'Sí. Confeccionamos scrubs, gabachas, batas de laboratorio, chaquetas clínicas y gorros quirúrgicos, con opción de bordado computarizado y corte personalizado a la medida.' },
    { pregunta: '¿Cuánto cuesta un conjunto médico?', respuesta: 'Desde C$1,200 (esencial) hasta C$2,160 (alta gama a medida). Incluye tela antifluido de alto rendimiento y opción de bordado computarizado.' },
    { pregunta: '¿Cuál es el pedido mínimo (MOQ)?', respuesta: 'Varía según la categoría: desde 1 unidad en sastrería a medida, filipinas y prendas médicas, hasta 12 unidades en uniformes escolares, industriales y gorras.' },
    { pregunta: '¿Hacen bordado computarizado?', respuesta: 'Sí, contamos con bordadoras computarizadas industriales para reproducir logotipos corporativos, nombres, monogramas, escudos y banderas con máxima definición.' },
    { pregunta: '¿Cuánto tardan en entregar un pedido?', respuesta: '48–72 horas hábiles en prendas de catálogo estándar. De 5 a 20 días en confección a la medida, sastrería o proyectos de gran volumen.' },
    { pregunta: '¿Tienen garantía de fábrica?', respuesta: 'Sí, de 3 a 6 meses según la prenda. Aceptamos cambios o devoluciones dentro de 1 mes por defectos comprobables de confección o fábrica.' },
    { pregunta: '¿Qué métodos de pago aceptan?', respuesta: 'Aceptamos PayPal (pasarela online internacional), transferencia bancaria nacional, depósito bancario y efectivo en nuestra sala de ventas.' },
    { pregunta: '¿Hacen envíos a domicilio?', respuesta: 'Sí. El delivery es completamente gratis dentro del casco urbano de Managua. Para entregas fuera del casco urbano o departamentos, se coordina la tarifa con un asesor.' },
  ];

  return (
    <div className="py-12 md:py-16 bg-beige min-h-screen">
      <Container>
        <SectionTitle
          badge="Resolución de Dudas"
          title="Preguntas Frecuentes"
          subtitle="Todo lo que necesita saber sobre cotizaciones, tiempos, bordados y métodos de pago."
        />
        <div className="max-w-3xl mx-auto flex flex-col gap-3 mt-8">
          {faqs.map((faq, idx) => (
            <div key={faq.pregunta} className="border border-azul/10 rounded-xl overflow-hidden bg-blanco transition-colors">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-display text-lg text-azul hover:text-vino transition-colors"
              >
                <span>{faq.pregunta}</span>
                <svg className={`w-5 h-5 shrink-0 text-azul transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    </div>
  );
}
