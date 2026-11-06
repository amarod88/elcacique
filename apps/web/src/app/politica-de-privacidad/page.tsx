import { Container } from '../../components/ui/Container';

export default function PrivacidadPage() {
  return (
    <div className="bg-beige min-h-screen py-16">
      <Container>
        <div className="bg-blanco p-8 md:p-12 rounded-2xl shadow-lg border border-azul/10 max-w-3xl mx-auto prose prose-azul">
          <h1 className="font-display text-3xl text-azul mb-6">Política de Privacidad</h1>
          <p className="text-sm text-marron-400 mb-4">Última actualización: Noviembre 2026</p>
          
          <p className="mb-4 text-marron">En El Cacique, valoramos su privacidad. Esta política explica cómo recopilamos, usamos y protegemos su información personal cuando utiliza nuestro sitio web.</p>

          <h2 className="text-xl font-semibold text-azul mt-6 mb-2">1. Información que recopilamos</h2>
          <p className="mb-4 text-marron">Recopilamos información que usted nos proporciona directamente al crear una cuenta o realizar un pedido, como su nombre, dirección de correo electrónico, número de teléfono y dirección de envío. Si inicia sesión mediante Google o Facebook, recibimos su nombre y correo electrónico básicos.</p>

          <h2 className="text-xl font-semibold text-azul mt-6 mb-2">2. Uso de la información</h2>
          <p className="mb-4 text-marron">Utilizamos su información para procesar sus pedidos, gestionar su cuenta, enviarle confirmaciones de compra, coordinar entregas (incluyendo pedidos bajo pedido) y mejorar nuestro servicio.</p>

          <h2 className="text-xl font-semibold text-azul mt-6 mb-2">3. Compartición de datos</h2>
          <p className="mb-4 text-marron">No vendemos ni alquilamos su información a terceros. Utilizamos proveedores de servicios de confianza (como pasarelas de pago y servicios de autenticación) estrictamente para operar nuestra tienda.</p>

          <h2 className="text-xl font-semibold text-azul mt-6 mb-2">4. Sus derechos</h2>
          <p className="mb-4 text-marron">Usted tiene derecho a acceder, corregir o solicitar la eliminación de sus datos personales. Para ejercer estos derechos, contáctenos en brutaldevs@gmail.com.</p>
        </div>
      </Container>
    </div>
  );
}
