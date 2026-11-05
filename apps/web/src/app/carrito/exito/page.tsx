import Link from 'next/link';
import { Container } from '../../../components/ui/Container';
import { Button } from '../../../components/ui/Button';

export default function ExitoPage() {
  return (
    <div className="bg-beige min-h-screen flex items-center justify-center py-20">
      <Container>
        <div className="bg-blanco p-12 rounded-2xl shadow-lg border border-azul/10 text-center max-w-lg mx-auto">
          <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="font-display text-3xl text-azul mb-4">¡Pago Exitoso!</h1>
          <p className="text-marron-400 text-sm leading-relaxed mb-8">
            Gracias por su compra. Hemos recibido su pago a través de PayPal y su pedido ha sido registrado en nuestro sistema.
            <br /><br />
            Un asesor de El Cacique se pondrá en contacto con usted en las próximas 24 horas para coordinar la entrega y personalización de su pedido.
          </p>
          <Link href="/catalogo">
            <Button variant="primary" size="lg" className="w-full">
              Volver al catálogo
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
