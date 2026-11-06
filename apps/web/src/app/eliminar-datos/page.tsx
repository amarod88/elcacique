import { Container } from '../../components/ui/Container';

export default function EliminarDatosPage() {
  return (
    <div className="bg-beige min-h-screen py-16">
      <Container>
        <div className="bg-blanco p-8 md:p-12 rounded-2xl shadow-lg border border-azul/10 max-w-3xl mx-auto prose prose-azul">
          <h1 className="font-display text-3xl text-azul mb-6">Eliminación de Datos de Usuario</h1>
          
          <p className="mb-4 text-marron">De acuerdo con las políticas de privacidad de Meta (Facebook) y Google, los usuarios tienen derecho a solicitar la eliminación de los datos que nuestra aplicación (El Cacique) ha recopilado.</p>

          <h2 className="text-xl font-semibold text-azul mt-6 mb-2">¿Cómo solicitar la eliminación?</h2>
          <p className="mb-4 text-marron">Si desea que eliminemos su cuenta y los datos asociados (nombre y correo electrónico) de nuestra base de datos, siga estos pasos:</p>
          <ol className="list-decimal pl-6 mb-4 text-marron">
            <li>Envíe un correo electrónico a <strong>brutaldevs@gmail.com</strong>.</li>
            <li>Utilice el asunto: <strong>"Eliminación de datos - El Cacique"</strong>.</li>
            <li>Incluya la dirección de correo electrónico con la que se registró o inició sesión.</li>
          </ol>
          <p className="mb-4 text-marron">Procesaremos su solicitud y eliminaremos su información de nuestras bases de datos en un plazo máximo de 30 días hábiles, notificándole por correo una vez completado el proceso.</p>
        </div>
      </Container>
    </div>
  );
}
