# MovixStudioCR

[![Seguridad](https://github.com/itsroyhernandez/MovixStudioCR/actions/workflows/security.yml/badge.svg)](https://github.com/itsroyhernandez/MovixStudioCR/actions/workflows/security.yml)

Propiedades web de **Movix Studio**. Todo es estático — sin build, sin backend,
sin base de datos — lo que reduce la superficie de ataque al mínimo por diseño.

## Estructura

| Ruta | Qué es |
|---|---|
| `index.html` | **Sitio oficial** de Movix Studio (hero 3D, servicios, proceso, industrias, seguridad, blog). |
| `servicios/` | Índice y una página por servicio, con el proceso paso a paso. |
| `blog/` | Índice y artículos del estudio. |
| `nosotros.html` | Historia, principios y el logo diverso animado. |
| `soporte.html` | Asistente 24/7 y base de conocimiento. |
| `contacto.html` | Centro de contacto: WhatsApp, brief y asistente. |
| `seguridad.html` | Postura de seguridad pública: los controles activos, uno por uno. |
| `privacidad.html` | Política de privacidad, cookies y datos (Ley 8968 de Costa Rica). |
| `intake/` | **Intake de marca**: el cliente elige su industria, llena el brief y lo envía por WhatsApp. |
| `build-pages.js` | Generador de todas las páginas del sitio (`node build-pages.js`). |
| `scripts/check-csp.js` | Verifica que los hashes CSP de `_headers` coincidan con el contenido real. |
| `.github/workflows/security.yml` | Snyk Code + verificación de CSP en cada push, PR y cada lunes. |
| `_headers` | Headers de seguridad para todo el sitio (cuando Netlify publica la raíz). |
| `intake/_headers` | Headers de seguridad solo del intake (config actual de Netlify). |

## Cómo editar el sitio

El contenido vive en `build-pages.js` (arreglos `SERVICES`, `POSTS` y los
cuerpos de cada página). Después de tocarlo:

```bash
node build-pages.js      # regenera todas las páginas
node scripts/check-csp.js  # recalcula y verifica los hashes CSP
```

Los dos comandos son los mismos que corre CI, así que si pasan localmente,
pasan en GitHub.

## Despliegue en Netlify

**Configuración recomendada** (sirve el sitio completo):

- Branch: `main` · Base directory: *(vacío)* · Build command: *(vacío)* · Publish directory: *(vacío o `/`)*
- Resultado: `/` → sitio oficial · `/intake/` → formulario · `/privacidad.html` → política.

> Ojo: la configuración actual publica solo `intake/`, con el formulario en la
> raíz del dominio. Al cambiar a la recomendada, el formulario pasa a vivir en
> `/intake/` — si ya compartiste el link viejo con alguien, avisale del cambio.

## Seguridad

Los archivos `_headers` aplican en el CDN de Netlify:

- **CSP con hash SHA-256** del único script inline de cada página: ningún script
  inyectado puede ejecutarse (mitigación real de XSS). `default-src 'none'`,
  sin objetos, sin frames, sin formularios a terceros.
- **HSTS** 2 años con `includeSubDomains; preload`.
- Anti-clickjacking (`frame-ancestors 'none'` + `X-Frame-Options: DENY`),
  `nosniff`, Referrer-Policy estricta, Permissions-Policy negando cámara,
  micrófono, geolocalización y demás hardware, COOP/CORP/COEP.

**Importante:** los hashes CSP se calculan sobre el contenido exacto del
`<script>`. Si editás el script de `index.html` o `intake/index.html`,
regenerá los `_headers`:

```bash
node -e "const c=require('crypto'),f=require('fs');['index.html','intake/index.html'].forEach(p=>{const m=f.readFileSync(p,'utf8').match(/<script>([\s\S]*?)<\/script>/);console.log(p,\"'sha256-\"+c.createHash('sha256').update(m[1],'utf8').digest('base64')+\"'\");})"
```

y pegá los hashes nuevos en `script-src` de ambos `_headers`.

## Cloudflare delante (WAF + anti-DDoS avanzado) — opcional

El plan gratuito de Cloudflare agrega WAF con reglas gestionadas, mitigación
DDoS sin límite y Bot Fight Mode. Requiere un **dominio propio** (p. ej.
`movixstudio.cr`):

1. Crear cuenta en Cloudflare → **Add a site** → escribir el dominio.
2. Cloudflare da dos nameservers → cambiarlos donde se compró el dominio.
3. En Cloudflare DNS: registro `CNAME` de `@` (y `www`) hacia
   `movixstudiocr.netlify.app`, con el proxy activado (nube naranja).
4. En Netlify → Domain management → agregar el dominio personalizado.
5. En Cloudflare → SSL/TLS → modo **Full (Strict)**; en Edge Certificates
   activar **TLS 1.3** y subir "Minimum TLS Version" a 1.2.
6. Security → activar **Bot Fight Mode** y verificar que el **Free Managed
   Ruleset** del WAF esté activo.

Sin dominio propio no se puede poner Cloudflare delante de `*.netlify.app`;
la alternativa es desplegar este mismo repo en **Cloudflare Pages** (gratis,
lee los mismos `_headers`) y obtener su red anti-DDoS de forma nativa.
