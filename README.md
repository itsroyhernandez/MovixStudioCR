# MovixStudioCR

[![Seguridad](https://github.com/itsroyhernandez/MovixStudioCR/actions/workflows/security.yml/badge.svg)](https://github.com/itsroyhernandez/MovixStudioCR/actions/workflows/security.yml)

Propiedades web de **Movix Corporation S.R.L.** (San Rafael de Escazú, Costa
Rica) y de su marca creativa **Movix Studio**. Todo es estático — sin backend,
sin base de datos — lo que reduce la superficie de ataque al mínimo por diseño.

> **Confidencialidad.** Este repositorio es público. El material corporativo
> interno (participación accionaria, identificaciones de los socios,
> presupuestos, rentabilidad, herramientas contratadas y hoja de ruta) **no
> entra acá bajo ninguna circunstancia**. `scripts/check-csp.js` incluye un
> barrido que falla la compilación si alguno de esos datos aparece en un
> archivo publicado.

## Estructura

| Ruta | Qué es |
|---|---|
| `index.html` | **Sitio oficial** (hero 3D, servicios, ecosistema, seguridad, blog). |
| `servicios/` | Índice y una página por servicio, con el proceso paso a paso. |
| `ecosistema.html` | Movix Corporation y sus tres marcas: Movix Studio, Fidelix y Petix Care. |
| `blog/` | Índice y artículos del estudio. |
| `nosotros.html` | Historia, principios y el logo diverso animado. |
| `soporte.html` | Asistente 24/7 y base de conocimiento. |
| `contacto.html` | Centro de contacto: WhatsApp, brief, asistente y domicilio. |
| `terminos.html` | Términos y condiciones (22 cláusulas, ley costarricense). |
| `privacidad.html` | Política de privacidad, cookies y datos (Ley 8968 de Costa Rica). |
| `seguridad.html` | Postura de seguridad pública: los controles activos, uno por uno. |
| `intake/` | **Brief de marca**: subpágina del sitio; el cliente elige su industria, lo llena y lo envía por WhatsApp. |
| `assets/site.css` · `site.js` | Sistema visual y comportamiento compartidos por **todas** las páginas, intake incluido. |
| `assets/intake.css` · `intake.js` | Capa propia del formulario. Se carga después de `site.css`. |
| `build-pages.js` | Generador de las 20 páginas (`node build-pages.js`). |
| `scripts/check-csp.js` | Guardia de CSP, de código en línea y de confidencialidad. |
| `.github/workflows/security.yml` | Snyk Code + el guardia anterior, en cada push, PR y cada lunes. |
| `_headers` · `intake/_headers` | Cabeceras de seguridad aplicadas en el CDN de Netlify. |
| `netlify.toml` | Publica la **raíz** del repo. Tiene prioridad sobre el panel de Netlify. |

## Cómo editar el sitio

Todo el contenido vive en `build-pages.js` (arreglos `SERVICES`, `POSTS` y los
cuerpos de cada página, incluido el del intake). **No edités los `.html` a
mano**: se sobrescriben en la siguiente generación.

```bash
node build-pages.js        # regenera las 20 páginas
node scripts/check-csp.js  # verifica cabeceras, código en línea y confidencialidad
```

Los dos comandos son los mismos que corre CI, así que si pasan localmente,
pasan en GitHub.

### Reglas que el guardia hace cumplir

- **Cero código en línea.** Ni `<script>`, ni `<style>`, ni `style=`, ni
  `onclick=`. Todo el JS y el CSS vive bajo `assets/`. Gracias a eso la CSP es
  `script-src 'self'; style-src 'self'` — sin hashes que se desincronicen y sin
  `'unsafe-inline'`.
- **Cero recursos externos.** Ningún CDN, ninguna fuente remota, ningún píxel.
  La única URL externa permitida es `https://wa.me/…`.
- **Cero datos confidenciales** en el HTML publicado ni en el generador.

## Despliegue en Netlify

La configuración vive en **`netlify.toml`**, que tiene prioridad sobre lo que
diga el panel. No hace falta tocar el dashboard.

```toml
[build]
  publish = "."
```

Resultado: `/` es el sitio oficial, `/intake/` el brief, y el resto de las
páginas cuelgan de la raíz.

> **Por qué importa.** Antes el proyecto publicaba solo `intake/`. Con esa
> configuración el formulario quedaba en la raíz del dominio y sus enlaces al
> sitio (`../servicios/`, `../nosotros.html`…) apuntaban fuera de lo publicado:
> daban 404. El intake se veía "desconectado" del sitio aunque en el código sí
> lo estuviera. `netlify.toml` lo corrige desde el repositorio.

Atajos configurados: `/brief` y `/dale-play` redirigen a `/intake/`.

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
