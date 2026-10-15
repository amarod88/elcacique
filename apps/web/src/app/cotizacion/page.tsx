'use client';

import React, { useState } from 'react';
import { Container } from '../../components/ui/Container';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { getCategorias } from '@el-cacique/shared';

export default function CotizacionPage() {
  const categorias = getCategorias();

  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    categoria: 'medicos',
    producto: '',
    cantidad: '24',
    personalizacion: 'Bordado de logotipo institucional en pecho',
    fechaRequerida: '',
    whatsapp: '',
    correo: '',
    detalles: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const categoriaOptions = categorias.map((cat) => ({
    value: cat.id,
    label: cat.nombre,
  }));

  return (
    <div className="py-12 md:py-20 bg-beige min-h-screen">
      <Container>
        <div className="max-w-3xl mx-auto">
          <SectionTitle
            badge="Atención B2B e Institucional"
            title="Solicitud de Cotización Formal"
            subtitle="Complete este formulario y un asesor técnico de El Cacique le responderá con una propuesta formal y muestras en menos de 24 horas."
          />

          <div className="bg-blanco rounded-2xl p-6 sm:p-10 border border-azul/10 shadow-sm text-left">
            {submitted ? (
              <div className="flex flex-col items-center text-center py-12 gap-4">
                <div className="w-16 h-16 rounded-full bg-success/15 text-success flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-display text-3xl text-azul">¡Solicitud Recibida con Éxito!</h3>
                <p className="font-body text-sm text-marron-400 max-w-md leading-relaxed">
                  Hemos registrado su solicitud de cotización para <strong className="text-azul">{formData.empresa || formData.nombre}</strong>. Un asesor de ventas se comunicará vía WhatsApp o correo electrónico para coordinar muestras físicas y prefactura.
                </p>
                <div className="p-4 rounded-xl bg-beige-100 border border-beige-200 text-xs text-marron-400 text-left w-full max-w-sm mt-4">
                  <span className="block font-semibold text-azul mb-1">Resumen enviado:</span>
                  <span>Categoría: {formData.categoria}</span><br />
                  <span>Cantidad estimada: {formData.cantidad} unidades</span><br />
                  <span>Contacto: {formData.whatsapp || formData.correo}</span>
                </div>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setSubmitted(false)}
                  className="mt-4"
                >
                  Enviar otra cotización
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Nombre y Apellido *"
                    required
                    placeholder="Ej: Lic. Carlos Solís"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  />
                  <Input
                    label="Empresa / Institución"
                    placeholder="Ej: Clínica Santa Fe / Taller Central"
                    value={formData.empresa}
                    onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Select
                    label="Categoría de Uniformes *"
                    options={categoriaOptions}
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  />
                  <Input
                    label="Prenda o Modelo de Interés"
                    placeholder="Ej: Conjunto Médico Premium / Chaleco Lisa"
                    value={formData.producto}
                    onChange={(e) => setFormData({ ...formData, producto: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Cantidad Estimada de Unidades *"
                    type="number"
                    min="1"
                    required
                    helperText="Precios por mayor aplican desde 12 unidades."
                    value={formData.cantidad}
                    onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                  />
                  <Input
                    label="Fecha Máxima Requerida"
                    type="date"
                    value={formData.fechaRequerida}
                    onChange={(e) => setFormData({ ...formData, fechaRequerida: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Número de WhatsApp *"
                    type="tel"
                    required
                    placeholder="+505 8888-8888"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  />
                  <Input
                    label="Correo Electrónico *"
                    type="email"
                    required
                    placeholder="compras@suempresa.com"
                    value={formData.correo}
                    onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                  />
                </div>

                <Input
                  label="Tipo de Personalización / Bordado"
                  placeholder="Ej: Bordado de logotipo a 3 colores en pecho y nombre del empleado"
                  value={formData.personalizacion}
                  onChange={(e) => setFormData({ ...formData, personalizacion: e.target.value })}
                />

                <Textarea
                  label="Detalles adicionales o requerimientos de tela"
                  placeholder="Indique si requiere visita de toma de medidas, muestras de tela o envío departamental..."
                  rows={3}
                  value={formData.detalles}
                  onChange={(e) => setFormData({ ...formData, detalles: e.target.value })}
                />

                <div className="pt-4 border-t border-beige-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-marron-400">
                    * Todos los datos son confidenciales y solo se usan para fines comerciales.
                  </span>
                  <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto">
                    Enviar solicitud de cotización
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
