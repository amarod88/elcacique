'use client';

import React, { useState } from 'react';
import { Container } from '../../components/ui/Container';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { PriceTag } from '../../components/catalog/PriceTag';
import { CategoryCard } from '../../components/catalog/CategoryCard';
import { ProductCard } from '../../components/catalog/ProductCard';
import { getProductoBySlug } from '@el-cacique/shared';

export default function DesignSystemPage() {
  const [loadingBtn, setLoadingBtn] = useState(false);
  const sampleProduct = getProductoBySlug('top-medico-esencial')!;
  const sampleSastreria = getProductoBySlug('traje-ejecutivo-completo-a-medida')!;

  const colors = [
    { name: 'Azul (Primario / Headers)', class: 'bg-azul', hex: '#1B3A5C', textLight: true },
    { name: 'Azul 700 (Profundo)', class: 'bg-azul-700', hex: '#12283F', textLight: true },
    { name: 'Azul 500 (Acento)', class: 'bg-azul-500', hex: '#2D5A87', textLight: true },
    { name: 'Vino (CTAs Primarios)', class: 'bg-vino', hex: '#722F37', textLight: true },
    { name: 'Vino 600 (Hover)', class: 'bg-vino-600', hex: '#5C252C', textLight: true },
    { name: 'Celeste (Highlights)', class: 'bg-celeste', hex: '#A8D5E5', textLight: false },
    { name: 'Celeste 100 (Badges)', class: 'bg-celeste-100', hex: '#D6EBF2', textLight: false },
    { name: 'Beige (Fondo Canvas)', class: 'bg-beige', hex: '#F5F0E8', textLight: false },
    { name: 'Beige 100 (Superficies)', class: 'bg-beige-100', hex: '#FAF7F0', textLight: false },
    { name: 'Marrón (Texto Cuerpo)', class: 'bg-marron', hex: '#5C4033', textLight: true },
    { name: 'Marrón 400 (Muted)', class: 'bg-marron-400', hex: '#8A6B5C', textLight: true },
    { name: 'Success', class: 'bg-success', hex: '#2F7D4F', textLight: true },
    { name: 'Warning', class: 'bg-warning', hex: '#C68A2E', textLight: true },
    { name: 'Error', class: 'bg-error', hex: '#A32C2C', textLight: true },
  ];

  return (
    <div className="py-16 bg-beige min-h-screen text-left">
      <Container>
        {/* Cabecera del Design System */}
        <div className="pb-8 border-b border-azul/15 mb-16">
          <Badge variant="premium">Referencia Visual de Sistema</Badge>
          <h1 className="font-display text-4xl sm:text-5xl text-azul mt-3">
            El Cacique — Design System
          </h1>
          <p className="font-body text-base text-marron-400 mt-2 max-w-2xl">
            Guía de tokens, componentes atómicos, componentes de layout y piezas de catálogo que componen la interfaz de usuario.
          </p>
        </div>

        {/* 1. Paleta de Colores */}
        <section className="mb-20">
          <SectionTitle
            align="left"
            title="1. Tokens de Color"
            subtitle="Paleta oficial gobernada por la regla 60-30-10: Canvas beige, estructuras azul marino y acentos en tono vino tinto."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {colors.map((c) => (
              <div key={c.name} className="p-3 bg-blanco rounded-xl border border-azul/10 shadow-xs flex flex-col gap-2">
                <div
                  className={`h-16 rounded-lg w-full ${c.class} flex items-end p-2 border border-black/5`}
                >
                  <span className={`text-[10px] font-mono font-bold ${c.textLight ? 'text-blanco' : 'text-azul'}`}>
                    {c.hex}
                  </span>
                </div>
                <div>
                  <span className="font-display text-xs text-azul font-bold block">{c.name}</span>
                  <span className="font-mono text-[10px] text-marron-400">{c.class}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Tipografía y Escalas */}
        <section className="mb-20">
          <SectionTitle
            align="left"
            title="2. Jerarquía Tipográfica"
            subtitle="Expresiva tipografía de display serif para titulares y sans-serif neutral para cuerpo de texto y metadatos."
          />
          <div className="bg-blanco p-8 rounded-2xl border border-azul/10 shadow-xs flex flex-col gap-8">
            <div className="flex flex-col gap-2 pb-6 border-b border-beige-200">
              <span className="font-mono text-xs text-marron-400">Display Face (DM Serif Display)</span>
              <h1 className="font-display text-4xl md:text-5xl text-azul">
                El Cacique: Confección de Alta Presencia
              </h1>
              <p className="font-display text-2xl text-azul-500">
                Titular Secundario H2 en Peso 400
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs text-marron-400">Body Face (Inter)</span>
              <p className="font-body text-base text-marron leading-relaxed max-w-2xl">
                Texto de cuerpo regular (16px). Empleado para descripciones de productos, fichas técnicas y lectura continua con interlineado generoso.
              </p>
              <p className="font-body text-xs text-marron-400">
                Metadato secundario (12px): Códigos SKU, notas legales y avisos informativos.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Componentes Atómicos: Botones */}
        <section className="mb-20">
          <SectionTitle
            align="left"
            title="3. Botones (Button)"
            subtitle="Variantes primary, secondary, ghost y link en tamaños sm, md, lg con soporte de carga y estados desactivados."
          />
          <div className="bg-blanco p-8 rounded-2xl border border-azul/10 shadow-xs flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <span className="font-mono text-xs text-marron-400">Variantes principales (Tamaño MD):</span>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary">Botón Primario (Vino)</Button>
                <Button variant="secondary">Botón Secundario (Azul)</Button>
                <Button variant="ghost">Botón Ghost</Button>
                <Button variant="link">Botón Enlace</Button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="font-mono text-xs text-marron-400">Escala de Tamaños:</span>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary" size="sm">Tamaño SM (32px)</Button>
                <Button variant="primary" size="md">Tamaño MD (40px)</Button>
                <Button variant="primary" size="lg">Tamaño LG (48px)</Button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="font-mono text-xs text-marron-400">Estados Especiales:</span>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary" loading={loadingBtn} onClick={() => { setLoadingBtn(true); setTimeout(() => setLoadingBtn(false), 2000); }}>
                  {loadingBtn ? 'Procesando...' : 'Haga click para probar Loading'}
                </Button>
                <Button variant="primary" disabled>
                  Desactivado (Disabled)
                </Button>
                <Button variant="secondary" disabled>
                  Secundario Desactivado
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Badges e Insignias */}
        <section className="mb-20">
          <SectionTitle
            align="left"
            title="4. Insignias (Badge)"
            subtitle="Elementos de etiquetado semántico para categorías, precios, novedades y certificaciones de fábrica."
          />
          <div className="bg-blanco p-8 rounded-2xl border border-azul/10 shadow-xs flex flex-wrap gap-4 items-center">
            <Badge variant="category">Categoría (Celeste)</Badge>
            <Badge variant="price">Precio Especial (Vino)</Badge>
            <Badge variant="new">Nuevo Modelo (Success)</Badge>
            <Badge variant="premium">Bordado Disponible (Premium)</Badge>
            <Badge variant="default">Etiqueta Básica (Gris)</Badge>
          </div>
        </section>

        {/* 5. Tarjetas (Card) */}
        <section className="mb-20">
          <SectionTitle
            align="left"
            title="5. Tarjetas (Card)"
            subtitle="Contenedores modulares en variantes elevated, flat y outlined."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="elevated" className="p-6">
              <span className="font-mono text-xs text-vino font-bold">Variante Elevated</span>
              <h4 className="font-display text-xl text-azul mt-2">Elevated Card</h4>
              <p className="text-xs text-marron-400 mt-2">
                Con sombra flotante suave y borde casi invisible.
              </p>
            </Card>

            <Card variant="flat" className="p-6">
              <span className="font-mono text-xs text-azul font-bold">Variante Flat</span>
              <h4 className="font-display text-xl text-azul mt-2">Flat Card</h4>
              <p className="text-xs text-marron-400 mt-2">
                Fondo beige claro con borde sutil de contorno.
              </p>
            </Card>

            <Card variant="outlined" className="p-6">
              <span className="font-mono text-xs text-marron-400 font-bold">Variante Outlined</span>
              <h4 className="font-display text-xl text-azul mt-2">Outlined Card</h4>
              <p className="text-xs text-marron-400 mt-2">
                Fondo blanco puro con borde delimitador definido.
              </p>
            </Card>
          </div>
        </section>

        {/* 6. Formularios */}
        <section className="mb-20">
          <SectionTitle
            align="left"
            title="6. Controles de Formulario"
            subtitle="Campos de texto, selectores y áreas de texto con etiquetas, ayudas y estados de validación."
          />
          <div className="bg-blanco p-8 rounded-2xl border border-azul/10 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Input Normal"
              placeholder="Escriba aquí..."
              helperText="Texto auxiliar debajo del campo"
            />
            <Input
              label="Input con Error"
              value="correo-invalido"
              error="Por favor ingrese un correo válido"
              readOnly
            />
            <Input
              label="Input Desactivado"
              value="Valor no editable"
              disabled
            />
            <Select
              label="Selector Desplegable"
              options={[
                { value: '1', label: 'Opción A' },
                { value: '2', label: 'Opción B' },
              ]}
            />
            <div className="md:col-span-2">
              <Textarea
                label="Área de Texto"
                placeholder="Escriba notas adicionales..."
                rows={2}
              />
            </div>
          </div>
        </section>

        {/* 7. Componentes de Catálogo en Vivo */}
        <section className="mb-20">
          <SectionTitle
            align="left"
            title="7. Componentes de Catálogo"
            subtitle="Módulos especializados para vitrina de productos y categorías."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs text-marron-400">ProductCard (Retail / Mayorista):</span>
              <ProductCard producto={sampleProduct} />
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs text-marron-400">ProductCard (Rango a Medida):</span>
              <ProductCard producto={sampleSastreria} />
            </div>

            <div className="flex flex-col gap-4">
              <span className="font-mono text-xs text-marron-400">CategoryCard:</span>
              <CategoryCard categoria={{ id: 'medicos', nombre: 'Médicos y Salud', count: 17 }} />
              <div className="p-4 bg-blanco rounded-xl border border-azul/10">
                <span className="font-mono text-xs text-marron-400 block mb-2">PriceTag aislado:</span>
                <PriceTag producto={sampleProduct} cantidad={12} size="md" />
              </div>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
