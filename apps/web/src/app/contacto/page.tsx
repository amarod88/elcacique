'use client';

import React, { useState } from 'react';
import { Container } from '../../components/ui/Container';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';

export default function ContactoPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="py-12 md:py-20 bg-beige min-h-screen text-left">
      <Container>
        <SectionTitle
          align="left"
          badge="Atención y Visitas"
          title="Contacto y Ubicación de Fábrica"
          subtitle="Visítenos en nuestra sala de ventas y taller en Managua o comuníquese directamente con nuestros asesores comerciales."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Columna Izquierda: Información de Contacto y Mapa */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-blanco rounded-2xl p-6 sm:p-8 border border-azul/10 shadow-xs flex flex-col gap-6">
              <h3 className="font-display text-2xl text-azul">Datos de Contacto</h3>

              <div className="flex flex-col gap-4 text-sm font-body text-marron">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-azul/10 text-azul flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-azul block">Dirección de Taller:</strong>
                    <span>Semáforos de Plaza El Sol, 4 cuadras al sur, a mano izquierda, Managua, Nicaragua.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-azul/10 text-azul flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-azul block">Horarios de Atención:</strong>
                    <span>Lunes a viernes: 8:00am – 5:00pm</span><br />
                    <span>Sábados: 8:00am – 12:00pm</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-azul/10 text-azul flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-azul block">WhatsApp Asesor Comercial:</strong>
                    <a href="https://wa.me/50588888888" target="_blank" rel="noreferrer" className="text-vino font-semibold hover:underline">
                      +505 8888-8888
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Mapa Embebido / Placeholder */}
            <div className="bg-blanco rounded-2xl p-4 border border-azul/10 shadow-xs overflow-hidden flex flex-col gap-3">
              <span className="text-xs font-semibold text-azul uppercase tracking-wider px-2">
                Ubicación Satelital (Plaza El Sol, Managua)
              </span>
              <div className="aspect-16/9 w-full rounded-xl bg-beige-200 border border-beige-300 flex flex-col items-center justify-center text-center p-6 relative">
                <svg className="w-10 h-10 text-azul mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span className="font-display text-base text-azul font-bold">El Cacique Fábrica</span>
                <span className="text-xs text-marron-400">4 cuadras al sur de semáforos Plaza El Sol</span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Formulario de Contacto */}
          <div className="lg:col-span-7 bg-blanco rounded-2xl p-6 sm:p-10 border border-azul/10 shadow-xs">
            {sent ? (
              <div className="flex flex-col items-center text-center py-12 gap-4">
                <div className="w-14 h-14 rounded-full bg-success/15 text-success flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl text-azul">Mensaje Enviado con Éxito</h3>
                <p className="text-sm text-marron-400 max-w-md">
                  Gracias por escribirnos. Nuestro equipo comercial se comunicará a la brevedad posible.
                </p>
                <Button variant="secondary" size="sm" onClick={() => setSent(false)} className="mt-2">
                  Enviar otro mensaje
                </Button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="flex flex-col gap-6">
                <h3 className="font-display text-2xl text-azul">Envíenos un Mensaje</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input label="Nombre completo *" required placeholder="Su nombre" />
                  <Input label="Empresa" placeholder="Nombre de empresa" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input label="Teléfono / WhatsApp *" required type="tel" placeholder="+505 8888-8888" />
                  <Input label="Correo electrónico *" required type="email" placeholder="correo@ejemplo.com" />
                </div>
                <Textarea label="Mensaje o Consulta *" required rows={4} placeholder="Escriba aquí los detalles de su consulta, prendas requeridas o solicitud de visita..." />
                <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto self-start">
                  Enviar mensaje ahora
                </Button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
