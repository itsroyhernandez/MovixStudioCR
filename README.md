# MovixStudioCR

Repositorio de Movix. Va a alojar más de una propiedad web de la marca, así que
cada proyecto vive en su propia carpeta — la raíz queda libre para el **sitio
oficial** cuando se agregue.

## Qué hay ahora

| Carpeta | Qué es |
|---|---|
| [`intake/`](intake/) | Formulario de intake de marca — el cliente elige su industria y llena el brief, que se envía directo por WhatsApp a Movix. |

## Publicar en Netlify

Cada carpeta se despliega por separado, apuntando **Base directory** y
**Publish directory** al nombre de la carpeta (sin build command). Por ejemplo,
para el intake:

- Base directory: `intake`
- Publish directory: `intake`
- Build command: *(vacío)*
