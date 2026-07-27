# Intake de marca — Movix

Formulario interactivo de una sola página (`index.html`, sin dependencias ni
build) para arrancar cuentas nuevas de cualquier industria.

## Cómo funciona

1. El cliente elige su categoría (turismo, restaurantes, financiero, tecnología,
   salud, retail, bienes raíces, B2B o una categoría abierta).
2. El formulario se arma solo con los campos que aplican a esa industria, más
   cuatro secciones comunes a cualquier negocio (marca, contacto, identidad
   digital y accesos, público y metas).
3. Validaciones en vivo: teléfonos solo aceptan números, los montos solo
   aceptan números con selector de moneda ₡/$, y los usuarios de redes
   sociales sugieren un handle derivado del nombre comercial.
4. El logo se puede arrastrar o seleccionar; queda guardado en el dispositivo
   del cliente (no hay backend, no se sube a ningún servidor) y se puede
   compartir por WhatsApp con la Web Share API cuando el navegador lo permite.
5. Al terminar, un botón envía todo el brief compilado directo al WhatsApp de
   Movix (+506 7086-3466).

## Editar

Es un solo archivo (`index.html`) con HTML, CSS y JavaScript inline. Las
categorías y sus campos están en el arreglo `CATS` dentro del `<script>` —
agregar una industria nueva es agregar un objeto más a ese arreglo.

## Publicar

Sin build. En Netlify: conectar este repo, **Base directory** `intake`,
**Publish directory** `intake`, **Build command** vacío.
