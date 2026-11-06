import { Container } from '../../components/ui/Container';

export default function TerminosPage() {
  return (
    <div className="bg-beige min-h-screen py-16">
      <Container>
        <div className="bg-blanco p-8 md:p-12 rounded-2xl shadow-lg border border-azul/10 max-w-3xl mx-auto prose prose-azul">
          <h1 className="font-display text-3xl text-azul mb-6">Términos y Condiciones</h1>
          <p className="text-sm text-marron-400 mb-4">Última actualización: Noviembre 2026</p>
          
          <p className="mb-4 text-marron">Bienvenido a El Cacique. Al utilizar nuestro sitio web y realizar compras, usted acepta los siguientes términos y condiciones.</p>

          <h2 className="text-xl font-semibold text-azul mt-6 mb-2">1. Productos y Pedidos</h2>
          <p className="mb-4 text-marron">Nuestro catálogo incluye productos en stock y productos bajo pedido. Los plazos de entrega para productos bajo pedido (fabricación) se indican en el ticket de compra. Las prendas a medida y sastrería requieren cotización y visita presencial.</p>

          <h2 className="text-xl font-semibold text-azul mt-6 mb-2">2. Precios y Pagos</h2>
          <p className="mb-4 text-marron">Los precios están sujetos a cambios sin previo aviso. Los pagos se procesan de forma segura a través de nuestras pasarelas autorizadas. La confirmación del pedido está sujeta a la aprobación del pago.</p>

          <h2 className="text-xl font-semibold text-azul mt-6 mb-2">3. Devoluciones y Garantías</h2>
          <p className="mb-4 text-marron">Aceptamos devoluciones únicamente por defectos de fábrica. Los productos en cuarentena serán evaluados para determinar si aplica una reparación o reemplazo, de acuerdo con nuestras políticas de control de calidad.</p>

          <h2 className="text-xl font-semibold text-azul mt-6 mb-2">4. Cuentas de Usuario</h2>
          <p className="mb-4 text-marron">Usted es responsable de mantener la confidencialidad de su cuenta y contraseña. El uso de nuestros servicios de autenticación (Google, Facebook) está sujeto a los términos de dichos proveedores.</p>
        </div>
      </Container>
    </div>
  );
}
