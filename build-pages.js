#!/usr/bin/env node
/* Generador de páginas del sitio de Movix Studio.
   Uso: node build-pages.js  (desde la raíz del repo)
   Toda página comparte skeleton, brandbar y footer; el contenido vive acá. */
"use strict";
const fs = require("fs");
const path = require("path");

const WA = "https://wa.me/50670863466";
const FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%237C5CFF'/%3E%3Cstop offset='1' stop-color='%23FF5B3D'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='24' height='24' rx='6' fill='url(%23g)'/%3E%3Cpath d='M9.2 6.8v10.4l8.6-5.2z' fill='%23fff'/%3E%3C/svg%3E";

const PLAY_SVG = `<svg viewBox="0 0 10 10" fill="none"><path d="M2 1.2 8.4 5 2 8.8Z" fill="#fff"/></svg>`;
const ARROW = `<svg viewBox="0 0 10 10" fill="none"><path d="M2.6 1.6 7.8 5 2.6 8.4Z" fill="#fff"/></svg>`;

const ICON = {
  social:'<circle cx="12" cy="12" r="8.4"/><path d="M12 3.6v16.8M3.6 12h16.8"/>',
  video:'<rect x="3.5" y="6" width="13" height="12" rx="2.5"/><path d="m16.5 10 4-2.5v9L16.5 14"/>',
  ads:'<path d="M4 14V10l9-5v14"/><path d="M13 9.5c2.8 0 4.5 1.1 4.5 2.5S15.8 14.5 13 14.5"/>',
  brand:'<circle cx="12" cy="12" r="8.4"/><path d="m12 6.5 1.6 3.3 3.6.5-2.6 2.5.6 3.6L12 14.7l-3.2 1.7.6-3.6-2.6-2.5 3.6-.5Z"/>',
  web:'<circle cx="12" cy="12" r="8.4"/><path d="M3.6 12h16.8M12 3.6c-4.7 4.7-4.7 12.1 0 16.8M12 3.6c4.7 4.7 4.7 12.1 0 16.8"/>',
  ia:'<rect x="5" y="7" width="14" height="11" rx="3"/><circle cx="9.5" cy="12.5" r="1.3"/><circle cx="14.5" cy="12.5" r="1.3"/><path d="M12 7V4M8 4h8"/>',
  spark:'<path d="m12 4 1.8 4.6L18 10.4l-4.2 1.8L12 16.8l-1.8-4.6L6 10.4l4.2-1.8Z"/>',
  eye:'<path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z"/><circle cx="12" cy="12" r="2.6"/>',
  wa:'<path d="M12 4a8 8 0 0 0-6.8 12.2L4 20l3.9-1.2A8 8 0 1 0 12 4Z"/><path d="M9.3 9.5c.6 2.4 2.8 4.6 5.2 5.2l1-1.5 2 .9c-.3 1.7-1.7 2.4-3.3 2-3.2-.8-5.5-3.1-6.3-6.3-.4-1.6.3-3 2-3.3l.9 2Z"/>',
  hand:'<path d="M8 12V6.5a1.5 1.5 0 0 1 3 0V11m0-4.5a1.5 1.5 0 0 1 3 0V11m0-3a1.5 1.5 0 0 1 3 0v6.5A5.5 5.5 0 0 1 11.5 20 5.5 5.5 0 0 1 6 14.5V9a1.5 1.5 0 0 1 2 0"/>',
  shield:'<path d="M12 3.5 5 6.3v5.4c0 4 2.9 7.5 7 8.8 4.1-1.3 7-4.8 7-8.8V6.3Z"/><path d="m9.2 12.2 2 2 3.6-4"/>',
  lock:'<rect x="5" y="10.5" width="14" height="9.5" rx="2.6"/><path d="M8.4 10.5V8a3.6 3.6 0 0 1 7.2 0v2.5"/><path d="M12 14.3v2.4"/>',
  scan:'<path d="M4 8.5V6a2 2 0 0 1 2-2h2.5M20 8.5V6a2 2 0 0 0-2-2h-2.5M4 15.5V18a2 2 0 0 0 2 2h2.5M20 15.5V18a2 2 0 0 1-2 2h-2.5"/><path d="M4 12h16"/>',
  globe:'<circle cx="12" cy="12" r="8.4"/><path d="M3.6 12h16.8"/><path d="M12 3.6c2.6 3.3 2.6 13.5 0 16.8-2.6-3.3-2.6-13.5 0-16.8Z"/>',
  wallet:'<rect x="3.5" y="6.5" width="17" height="11.5" rx="2.6"/><path d="M3.5 10.5h17"/><circle cx="16.6" cy="14.4" r="1.2"/>',
  bell:'<path d="M6.8 10.4a5.2 5.2 0 0 1 10.4 0c0 3.4 1.3 4.8 1.3 4.8H5.5s1.3-1.4 1.3-4.8Z"/><path d="M10.2 18.2a2 2 0 0 0 3.6 0"/>',
  heart:'<path d="M12 19.2s-6.6-3.9-6.6-8.4a3.6 3.6 0 0 1 6.6-2 3.6 3.6 0 0 1 6.6 2c0 4.5-6.6 8.4-6.6 8.4Z"/>',
  layers:'<path d="m12 4 8 4.2-8 4.2-8-4.2Z"/><path d="m4 12.8 8 4.2 8-4.2"/><path d="m4 16.8 8 4.2 8-4.2"/>',
  pride:'<circle cx="12" cy="12" r="8.4"/><path d="M10 8.6v6.8l5-3.4Z"/>',
  doc:'<path d="M6.5 3.8h7.2L18 8.1v12.1H6.5Z"/><path d="M13.4 3.8v4.5H18"/><path d="M9.2 12.4h5.6M9.2 15.6h5.6"/>',
  scale:'<path d="M12 4.6v15"/><path d="M6.5 19.4h11"/><path d="M4 9.4h16"/><path d="M4 9.4 6.6 15h-5.2Z"/><path d="M20 9.4 22.6 15h-5.2Z"/>'
};
const mark = k => `<div class="scard__mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICON[k]}</svg></div>`;

const SERVICES = [
  { slug:"social-media", icon:"social", name:"Social media integral",
    short:"Estrategia, calendario, publicación y comunidad — tus redes trabajando con intención comercial.",
    h1:'Redes que <span class="grad">venden</span>, no que decoran.',
    lead:"Gestión integral de tus canales sociales con una tesis simple: cada publicación existe para acercar una venta. Estrategia editorial, producción, publicación y comunidad, medidas contra objetivos de negocio.",
    steps:[
      ["Auditoría y tesis","Analizamos tus canales, tu competencia y tu categoría. De ahí sale la tesis de contenido: qué va a decir tu marca y por qué alguien debería escucharla."],
      ["Arquitectura editorial","Pilares de contenido con pesos definidos, calendario mensual y sistema de aprobación ágil — vos aprobás desde el cel, sin idas y vueltas eternas."],
      ["Publicación y comunidad","Publicación constante con la identidad al frente. Respondemos comentarios y mensajes con la voz de tu marca, en ventanas de respuesta definidas."],
      ["Iteración por datos","Reporte mensual orientado a negocio: qué formato trajo conversaciones, qué se corta, qué se duplica. El calendario del mes siguiente hereda lo aprendido."]],
    includes:["Estrategia y pilares de contenido documentados","Calendario editorial mensual aprobable desde el cel","Diseño y copywriting de cada pieza","Publicación y programación multicanal","Gestión de comunidad con voz de marca","Social listening básico de categoría","Reporte mensual orientado a ventas","Reunión mensual de iteración"],
    who:"Para negocios que ya intentaron 'estar en redes' publicando cuando se puede, y quieren pasar a un sistema constante que genere conversaciones de venta — sin contratar un equipo interno.",
    faq:[
      ["¿En qué redes trabajan?","Donde esté tu cliente, no donde esté la moda: Instagram, Facebook y TikTok como núcleo; LinkedIn y YouTube cuando el negocio lo amerita."],
      ["¿Cuántas publicaciones incluye?","Se define por estrategia, no por plantilla. Un ritmo sostenible y constante gana siempre contra un mes heroico seguido de tres de silencio."],
      ["¿Quién aprueba el contenido?","Vos, siempre. El calendario llega con días de anticipación y se aprueba con un toque; nada sale al aire sin tu visto bueno."]]
  },
  { slug:"contenido-video", icon:"video", name:"Contenido y video",
    short:"Reels, foto y video con dirección de arte — producción que detiene el scroll y suena a tu marca.",
    h1:'Contenido que <span class="grad">detiene el scroll.</span>',
    lead:"Producción audiovisual con dirección de arte: reels, sesiones de foto y video comercial pensados para el algoritmo y para tu cliente — en ese orden de exigencia y con tu identidad al frente.",
    steps:[
      ["Dirección creativa","Definimos el lenguaje visual de tu contenido: encuadres, ritmo de edición, paleta y tono. Tu feed se vuelve reconocible a tres metros de distancia."],
      ["Preproducción","Guiones y shot-lists antes de encender una cámara. Un día de rodaje bien planificado rinde semanas de contenido."],
      ["Producción","Rodaje en locación con equipo profesional: video vertical nativo, fotografía comercial y captura de audio limpia."],
      ["Postproducción","Edición con ritmo, color grading, subtítulos y entregables por canal — cada plataforma recibe su formato nativo, no un recorte."]],
    includes:["Dirección de arte y guionismo","Días de rodaje en locación","Reels y video vertical nativo","Fotografía comercial de producto y equipo","Color grading y sonorización","Subtitulado y versiones por plataforma","Banco de contenido organizado en la nube","Cesiones de uso de imagen en regla"],
    who:"Para marcas que ya saben que el banco de imágenes se nota — y que la diferencia entre 'publicar' y 'posicionar' es producción propia con intención.",
    faq:[
      ["¿Hacen solo video o también foto?","Ambos. Cada día de rodaje se planifica para salir con video vertical, horizontal y fotografía en una sola sesión."],
      ["¿Qué pasa si mi negocio está fuera de San José?","Producimos en todo Costa Rica. La logística de locación se coordina en la preproducción."],
      ["¿El contenido es mío?","Sí. Todo el material entregado es propiedad de tu marca, con su banco organizado y accesible."]]
  },
  { slug:"pauta-digital", icon:"ads", name:"Pauta digital",
    short:"Meta, TikTok y Google con presupuesto cuidado como propio — medido en leads y ventas.",
    h1:'Pauta que se mide en <span class="grad">clientes.</span>',
    lead:"Campañas de performance en Meta, TikTok y Google con una regla innegociable: tu presupuesto se trata como si fuera nuestro. Arquitectura de campañas, creatividades que convierten y optimización semanal.",
    steps:[
      ["Arquitectura de campaña","Embudos por temperatura de audiencia: frío, tibio y caliente, cada uno con su mensaje, su creatividad y su objetivo de conversión."],
      ["Creatividades de performance","Anuncios diseñados para convertir, no para gustar en la oficina. Ángulos múltiples, ganchos probados y variantes listas para testear."],
      ["Medición limpia","Píxeles, eventos de conversión y UTMs bien instalados antes de invertir un colón. Si no se puede medir, no se pauta."],
      ["Optimización semanal","Revisión de resultados cada semana: se apaga lo caro, se escala lo rentable, y el reporte te dice cuánto costó cada lead — sin maquillaje."]],
    includes:["Estrategia de embudo completa","Campañas en Meta, TikTok y Google","Diseño de creatividades y copies de anuncio","Instalación de píxel y eventos de conversión","Segmentación y públicos personalizados","Pruebas A/B continuas","Optimización semanal documentada","Reporte con costo por lead y por venta"],
    who:"Para negocios listos para invertir en crecimiento y cansados de 'quemar pauta' sin saber qué volvió. Requisito honesto: tener la operación lista para atender los leads que van a entrar.",
    faq:[
      ["¿Cuál es el presupuesto mínimo de pauta?","El que tu categoría exige para aprender rápido — se define con datos en la propuesta, no con un número mágico igual para todos."],
      ["¿La comisión depende del presupuesto?","El modelo de cobro se define en la propuesta y siempre es transparente: sabés exactamente qué pagás por gestión y qué va a las plataformas."],
      ["¿En cuánto tiempo se ven resultados?","Las primeras señales, en semanas; la optimización compuesta, en meses. Desconfiá de quien prometa lo contrario."]]
  },
  { slug:"branding", icon:"brand", name:"Branding",
    short:"Identidad, logo y sistema visual con reglas claras — listo para crecer sin perder consistencia.",
    h1:'Una marca con <span class="grad">sistema</span>, no solo un logo.',
    lead:"Construimos identidades que funcionan como sistemas: logo, paleta, tipografía, voz y reglas de uso documentadas — para que tu marca se vea impecable la publique quien la publique.",
    steps:[
      ["Descubrimiento","Entendemos el negocio, el público y la competencia antes de dibujar nada. La estética sin estrategia es decoración."],
      ["Territorio visual","Exploración de direcciones creativas con fundamento. Se presentan pocas opciones, bien argumentadas — no veinte logos para adivinar."],
      ["Sistema de identidad","Logo con sus variantes, paleta con roles semánticos, escalas tipográficas, iconografía y aplicaciones reales de tu operación."],
      ["Brand guide entregable","Manual de marca práctico con reglas de uso, tal como el que usa Movix: si mañana cambia tu diseñador, la marca no cambia con él."]],
    includes:["Investigación y plataforma de marca","Diseño de logotipo y variantes de uso","Paleta con roles y escalas extendidas","Sistema tipográfico","Voz y tono documentados","Aplicaciones clave (perfiles, papelería, plantillas)","Brand guide completo y entregado","Archivos fuente en vectores"],
    who:"Para negocios nuevos que quieren nacer con identidad seria, y para marcas establecidas cuya imagen ya no está a la altura de su producto.",
    faq:[
      ["¿Cuánto tarda un proceso de branding?","Semanas, no días — el descubrimiento y la iteración honesta toman tiempo. El cronograma exacto va en la propuesta."],
      ["¿Incluye el registro de marca?","El diseño sí; el registro legal ante el Registro Nacional lo gestiona tu abogado — y te decimos exactamente qué archivos necesita."],
      ["¿Puedo pedir solo un refresh del logo actual?","Sí. El sistema se puede construir alrededor de un símbolo existente que ya tiene reconocimiento."]]
  },
  { slug:"sitios-web", icon:"web", name:"Sitios web",
    short:"Páginas rápidas, seguras y hechas para convertir — con formularios que llegan directo a tu WhatsApp.",
    h1:'Sitios que <span class="grad">convierten</span> visitas en clientes.',
    lead:"Diseñamos y construimos sitios de alto rendimiento: carga instantánea, seguridad de nivel empresarial y cada sección orientada a una acción. Como este mismo sitio — que es nuestro mejor portafolio.",
    steps:[
      ["Arquitectura de conversión","Definimos el recorrido del visitante antes que el diseño: qué ve, qué siente y qué acción toma en cada pantalla."],
      ["Diseño premium","Interfaz con tu sistema de marca, motion sutil y jerarquía tipográfica cuidada. Nada de plantillas recicladas."],
      ["Construcción de alto rendimiento","Código limpio y ligero, WebGL cuando aporta, y formularios que convierten — incluyendo integración directa a WhatsApp."],
      ["Seguridad y despliegue","HTTPS con HSTS, Content Security Policy estricta y cabeceras de protección completas. Desplegado en CDN global con despliegue continuo."]],
    includes:["Arquitectura de la información y wireframes","Diseño de interfaz con tu identidad","Desarrollo a medida, sin plantillas","Optimización de velocidad (Core Web Vitals)","Blindaje de seguridad (CSP, HSTS, headers)","Formularios integrados a WhatsApp","SEO técnico de base","Capacitación para actualizar contenido"],
    who:"Para negocios cuyo sitio actual da vergüenza ajena o directamente no existe — y entienden que la web es el único canal que es 100 % suyo.",
    faq:[
      ["¿Usan WordPress o plantillas?","Construimos a medida cuando el proyecto lo amerita, y usamos la herramienta correcta cuando no. La decisión es técnica, no comercial."],
      ["¿El sitio queda a mi nombre?","Siempre. Dominio, hosting y código quedan bajo tu propiedad, con nosotros como administradores mientras dure la relación."],
      ["¿Incluye mantenimiento?","El plan de mantenimiento es opcional y se cotiza aparte — sin letra pequeña de dependencia forzada."]]
  },
  { slug:"ia-automatizaciones", icon:"ia", name:"IA y automatizaciones",
    short:"Renders generativos, chatbots y flujos automatizados — tecnología de frontera aplicada a vender más.",
    h1:'Inteligencia artificial <span class="grad">aplicada a vender.</span>',
    lead:"Ponemos IA generativa de frontera a trabajar para tu marca: renders fotorrealistas sin sesión de fotos, asistentes conversacionales que atienden 24/7 y automatizaciones que eliminan el trabajo repetitivo de tu operación.",
    steps:[
      ["Renders generativos","Producción visual con modelos de difusión de última generación: renders fotorrealistas de producto, ambientes y campañas, con dirección de arte y consistencia de marca en cada imagen. Catálogos premium sin depender de una sesión de fotos por cada lanzamiento."],
      ["IA conversacional","Asistentes y chatbots entrenados con el conocimiento de tu negocio: responden preguntas frecuentes, califican leads y agendan — en tu sitio y en WhatsApp, 24/7, con escalamiento a humano cuando importa."],
      ["Automatización de flujos","Orquestamos tus herramientas: el lead que llega por pauta entra a tu CRM, dispara el seguimiento por WhatsApp y alimenta el reporte — sin que nadie copie y pegue nada."],
      ["Gobernanza y control","Cada sistema con supervisión humana, límites definidos y datos tratados con la misma seriedad que exigimos en nuestros propios sitios. IA con criterio, no IA suelta."]],
    includes:["Renders fotorrealistas con IA generativa","Dirección de arte y consistencia de estilo","Chatbots para sitio web y WhatsApp","Calificación automática de leads","Flujos de seguimiento automatizados","Integración con CRM y hojas de cálculo","Reportería automatizada","Capacitación de tu equipo en las herramientas"],
    who:"Para marcas que quieren la ventaja de la IA sin el humo: producción visual de nivel editorial a una fracción del costo, y una operación comercial que no duerme.",
    faq:[
      ["¿Los renders con IA se ven artificiales?","Los malos, sí. Con dirección de arte, iteración y curaduría profesional, el resultado es de catálogo premium — y siempre te mostramos pruebas con tu producto antes de producir en serie."],
      ["¿El chatbot reemplaza a mi equipo?","No: lo libera. Atiende lo repetitivo al instante y entrega a tu equipo los leads calificados con todo el contexto."],
      ["¿Qué pasa con los datos de mis clientes?","Se tratan bajo los mismos estándares de nuestra política de privacidad: minimización, transparencia y control tuyo. Lo definimos por escrito en cada proyecto."]]
  }
];

const POSTS = [
  { slug:"likes-no-pagan-planilla", cat:"Estrategia", date:"Julio 2026",
    title:"Los likes no pagan planilla: las métricas que sí importan",
    excerpt:"Alcance, impresiones y seguidores son el marcador del juego equivocado. Estas son las cifras que miramos nosotros — y las que deberías exigirle a cualquier agencia.",
    body:`
<p>Hay una conversación que tenemos con casi todo cliente nuevo. Llega con reportes de su agencia anterior llenos de números grandes — alcance, impresiones, seguidores — y una pregunta incómoda: <b>«¿y por qué no estoy vendiendo más?»</b></p>
<p>La respuesta corta: porque esas métricas miden actividad, no negocio. Son fáciles de inflar, cómodas de reportar y no pagan una sola planilla.</p>
<h3>Las métricas que sí miramos</h3>
<ul>
<li><b>Conversaciones iniciadas.</b> ¿Cuánta gente te escribió al WhatsApp este mes por las redes? Ese es el pulso real de una estrategia de contenido comercial.</li>
<li><b>Costo por lead.</b> Si invertís en pauta, cada lead tiene un precio. Conocerlo te dice si el sistema es rentable o solo ruidoso.</li>
<li><b>Tasa de cierre.</b> De cada diez conversaciones, ¿cuántas terminan en venta? Si es baja, el problema no es el contenido — es la atención o la oferta. Y eso también se arregla.</li>
<li><b>Ingresos atribuibles.</b> La única métrica que a fin de mes importa de verdad.</li>
</ul>
<blockquote>El contenido no es el objetivo. Es el vehículo. El objetivo siempre fue vender.</blockquote>
<h3>¿Y entonces los likes no sirven de nada?</h3>
<p>Sirven como señal temprana: te dicen qué formato conecta, qué gancho funciona, qué duele y qué aburre. Nosotros los usamos como brújula de contenido — nunca como resultado a celebrar en el reporte.</p>
<p>Si tu reporte mensual actual no responde «¿cuánto costó cada cliente nuevo?», ya sabés cuál es la primera pregunta para tu próxima reunión.</p>`},
  { slug:"whatsapp-canal-de-ventas", cat:"Ventas", date:"Julio 2026",
    title:"WhatsApp es tu mejor vendedor (si lo tratás como tal)",
    excerpt:"En Costa Rica, el que responde primero vende. Cómo convertir el WhatsApp del negocio en un canal de ventas serio — sin perder el toque humano.",
    body:`
<p>En Costa Rica el ciclo de venta de un negocio local casi siempre termina en el mismo lugar: una conversación de WhatsApp. Y sin embargo, la mayoría de negocios lo maneja como un chat personal: se responde cuando se puede, desde el celular de alguien, sin registro de nada.</p>
<p>El costo de eso es invisible pero brutal: <b>cada hora sin responder, la probabilidad de cerrar cae en picada</b>. El cliente que escribió a tres lugares le compra al primero que contestó bien.</p>
<h3>Los cinco básicos que casi nadie hace</h3>
<ul>
<li><b>WhatsApp Business, no personal.</b> Catálogo, respuestas rápidas, etiquetas y horarios. Es gratis y es otra liga.</li>
<li><b>Mensaje de bienvenida que califica.</b> «¿Para qué fecha y cuántas personas?» ahorra tres idas y vueltas y te dice qué tan serio es el lead.</li>
<li><b>Ventana de respuesta definida.</b> Quién responde, hasta qué hora, y qué pasa el fin de semana. Si pautás y nadie contesta el sábado, la pauta del sábado es plata regalada.</li>
<li><b>Respuestas rápidas cargadas.</b> Precio, ubicación, horario, políticas: el 80 % de las preguntas son las mismas cinco.</li>
<li><b>Seguimiento a las 24 horas.</b> El «¿pudiste revisar?» amable recupera ventas que dabas por muertas.</li>
</ul>
<blockquote>La pauta trae la conversación. La conversación la cierra un proceso — o la pierde la falta de uno.</blockquote>
<h3>El siguiente nivel</h3>
<p>Cuando el volumen crece, entra la automatización con criterio: asistentes que atienden lo repetitivo 24/7, califican al lead y se lo entregan a tu equipo con contexto. De eso hablamos en nuestro servicio de <a href="../servicios/ia-automatizaciones.html">IA y automatizaciones</a> — pero los cinco básicos de arriba van primero. Sin proceso humano, la automatización solo acelera el desorden.</p>`},
  { slug:"renders-ia-catalogos-premium", cat:"IA", date:"Julio 2026",
    title:"Renders con IA: catálogos premium sin sesión de fotos",
    excerpt:"Los modelos de difusión cambiaron las reglas de la producción visual. Qué son los renders generativos, cuándo valen la pena y cómo se ve el proceso con dirección de arte.",
    body:`
<p>Hasta hace poco, un catálogo visual premium exigía una ecuación cara: estudio, fotógrafo, locación, y volver a pagarla entera con cada lanzamiento. La IA generativa cambió esa ecuación — pero no como lo cuenta el humo de las redes.</p>
<h3>Qué es (de verdad) un render generativo</h3>
<p>Los modelos de difusión de última generación pueden producir imágenes fotorrealistas de tu producto en ambientes que nunca existieron: tu salsa artesanal en una cocina de revista, tu mueble en un loft con luz de atardecer, tu marca de café en una finca al amanecer. El insumo es una buena captura base de tu producto; el resto es dirección de arte digital.</p>
<h3>La parte que el humo no cuenta</h3>
<ul>
<li><b>Sin dirección de arte, se nota.</b> Manos raras, texturas plásticas, sombras imposibles. La diferencia entre un render amateur y uno de catálogo es curaduría profesional e iteración.</li>
<li><b>La consistencia es el reto real.</b> Una imagen linda es fácil; veinte imágenes que parecen de la misma marca exigen un sistema de estilo definido y mantenido.</li>
<li><b>Hay líneas que no se cruzan.</b> El producto tiene que ser tu producto real — el render ambienta y eleva, no inventa lo que vendés.</li>
</ul>
<blockquote>La IA no reemplaza el criterio visual. Lo multiplica — para bien o para mal.</blockquote>
<h3>Cuándo tiene sentido</h3>
<p>Lanzamientos frecuentes, catálogos estacionales, pruebas de concepto antes de producir, y marcas que necesitan nivel editorial con presupuesto de pyme. Para rostros humanos reales y testimonios, la fotografía sigue mandando — y lo decimos aunque vendamos lo otro.</p>
<p>¿Querés ver pruebas con tu producto? Ese es exactamente el primer paso de nuestro servicio de <a href="../servicios/ia-automatizaciones.html">IA y automatizaciones</a>: renders de prueba con tu marca antes de comprometer nada.</p>`}
];

/* ---------- plantillas compartidas ---------- */
function brandbar(root, tag){
  return `<div class="brandbar"><div class="brandbar__inner">
    <a class="logo" href="${root}" aria-label="Movix Studio">
      <span class="logo__play">${PLAY_SVG}</span><span class="logo__word">Movix Studio</span></a>
    ${tag ? `<span class="brandbar__tag">${tag}</span>` : ""}
    <nav aria-label="Secciones del sitio">
      <a href="${root}servicios/">Servicios</a>
      <a href="${root}ecosistema.html">Ecosistema</a>
      <a href="${root}nosotros.html">Nosotros</a>
      <a href="${root}blog/">Blog</a>
      <a href="${root}contacto.html">Contacto</a>
    </nav>
    <a class="btn btn--send" href="${root}intake/"><span class="l">Dale play</span>${ARROW}</a>
  </div></div>`;
}
function footer(root){
  const svc = SERVICES.map(s=>`<li><a href="${root}servicios/${s.slug}.html">${s.name}</a></li>`).join("");
  return `<footer><div class="foot">
    <div>
      <div class="flog"><span class="logo__play">${PLAY_SVG}</span>Movix Studio</div>
      <p class="tag">Dale play a tu marca.</p>
      <p>Agencia de marketing en Costa Rica. Estrategia, contenido, pauta e inteligencia artificial aplicada a vender.</p>
    </div>
    <div><h4>Servicios</h4><ul>${svc}</ul></div>
    <div><h4>Ecosistema</h4><ul>
      <li><a href="${root}ecosistema.html">Movix Corporation</a></li>
      <li><a href="${root}ecosistema.html#movix-studio">Movix Studio</a></li>
      <li><a href="${root}ecosistema.html#fidelix">Fidelix</a></li>
      <li><a href="${root}ecosistema.html#petix-care">Petix Care</a></li>
      <li><a href="${root}nosotros.html">Nosotros</a></li>
      <li><a href="${root}inclusion.html">Inclusión</a></li>
      <li><a href="${root}blog/">Blog</a></li>
    </ul></div>
    <div><h4>Empezar</h4><ul>
      <li><a href="${root}intake/">Brief de marca</a></li>
      <li><a href="${WA}" rel="noopener" target="_blank">WhatsApp +506 7086-3466</a></li>
      <li><a href="${root}contacto.html">Contacto</a></li>
      <li><a href="${root}soporte.html">Soporte en línea</a></li>
      <li><a href="${root}seguridad.html">Seguridad</a></li>
    </ul></div>
  </div>
  <div class="foot__legal">
    <span>© 2026 <strong>Movix Corporation S.R.L.</strong> · San Rafael de Escazú, Costa Rica</span>
    <span class="foot__legal-links">
      <a href="${root}terminos.html">Términos y condiciones</a>
      <a href="${root}privacidad.html">Privacidad y datos</a>
      <a href="${root}seguridad.html">Seguridad</a>
    </span>
    <span>Sin cookies, sin rastreadores.</span>
  </div>
  </footer>`;
}
function page(o){
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${o.title}</title>
<meta name="description" content="${o.desc}">
<link rel="icon" href="${FAVICON}">
<link rel="stylesheet" href="${o.root}assets/site.css">
${(o.css||[]).map(f=>`<link rel="stylesheet" href="${o.root}assets/${f}">`).join("\n")}
</head>
<body data-root="${o.root}"${o.bodyClass?` class="${o.bodyClass}"`:""}>
<canvas id="lava" aria-hidden="true"></canvas>
<div class="aurora" aria-hidden="true"><span class="a1"></span><span class="a2"></span><div class="aurora__grid"></div></div>
<div class="embers" id="embers" aria-hidden="true"></div>
${brandbar(o.root, o.tag)}
${o.body}
${footer(o.root)}
<script src="${o.root}assets/site.js" defer></script>
${(o.js||[]).map(f=>`<script src="${o.root}assets/${f}" defer></script>`).join("\n")}
</body>
</html>`;
}
/* ---------- TESTIMONIOS ----------
   Prueba social real. Cada entrada es una cita textual de un cliente que
   autorizó su publicación, con su nombre, su cargo y su marca.

   Para agregar una:
     { nombre:"…", cargo:"…", marca:"…", fecha:"2026-07-28", cita:"…" }
   La fecha va en formato ISO y el sitio la convierte sola a "hace 2 días",
   "hace 2 meses", etc. al generar las páginas.

   IMPORTANTE — este arreglo va vacío a propósito. No se publican testimonios
   inventados, ni nombres, cargos o marcas de personas que no dieron su
   consentimiento: además de engañar a quien lee, contradice los términos y
   condiciones del propio sitio y la postura publicada en inclusion.html.
   La sección completa (tarjetas, animación, fechas relativas) ya está
   construida y aparece sola en el home y en nosotros.html en cuanto haya al
   menos una entrada real acá. */
const TESTIMONIOS = [];

/* "hace 2 días", "hace 3 meses" — se calcula al generar, no en el navegador */
function haceCuanto(iso){
  const d = Math.max(0, Math.round((Date.now() - new Date(iso + "T12:00:00Z")) / 86400000));
  if (d <= 0)  return "hoy";
  if (d === 1) return "ayer";
  if (d < 7)   return `hace ${d} días`;
  if (d < 14)  return "hace una semana";
  if (d < 31)  return `hace ${Math.round(d/7)} semanas`;
  if (d < 62)  return "hace un mes";
  if (d < 365) return `hace ${Math.round(d/30)} meses`;
  if (d < 730) return "hace un año";
  return `hace ${Math.round(d/365)} años`;
}
/* monograma en disco degradado: identifica sin inventar una cara */
function monograma(nombre){
  const ini = nombre.trim().split(/\s+/).slice(0,2).map(w=>w[0]).join("").toUpperCase();
  let h = 0; for (const c of nombre) h = (h*31 + c.charCodeAt(0)) % 6;
  return `<span class="tsti__av tsti__av--${h}" aria-hidden="true">${ini}</span>`;
}
function testimonios(titulo, intro){
  if (!TESTIMONIOS.length) return "";
  const cards = TESTIMONIOS.map((t,i)=>`
    <figure class="tsti" data-i="${i%6}">
      <blockquote class="tsti__q">${t.cita}</blockquote>
      <figcaption class="tsti__who">
        ${monograma(t.nombre)}
        <span class="tsti__id"><b>${t.nombre}</b><span>${t.cargo} · ${t.marca}</span></span>
        <time class="tsti__when" datetime="${t.fecha}">${haceCuanto(t.fecha)}</time>
      </figcaption>
    </figure>`).join("");
  return `<section class="blk reveal">
    <div class="blk__head"><h2>${titulo}</h2><p>${intro}</p></div>
    <div class="tstis">${cards}</div>
  </section>`;
}

const cta = (root,h,p) => `<section class="blk reveal"><div class="cta">
  <h2>${h||'¿Listo para darle <span class="grad">play?</span>'}</h2>
  <p>${p||"Contanos de tu marca hoy y llegá a la primera reunión con la estrategia ya empezada."}</p>
  <div class="row">
    <a class="btn btn--send" href="${root}intake/"><span class="l">Empezar mi brief</span>${ARROW}</a>
    <a class="btn btn--ghost" href="${WA}?text=Hola%20Movix%20Studio%2C%20quiero%20info" rel="noopener" target="_blank">Hablemos por WhatsApp</a>
  </div></div></section>`;

/* ---------- HOME ---------- */
const INDUSTRIES=["Turismo y experiencias","Restaurantes y gastronomía","Financiero y seguros","Tecnología y software","Salud y bienestar","Retail y e-commerce","Bienes raíces","B2B y servicios profesionales","Otra categoría"];
const homeBody = `
<header class="hero">
  <div class="wrap">
    <div class="hero__copy">
    <p class="eyebrow">Agencia de marketing · Costa Rica</p>
    <h1>Tu marca, <span class="grad">en movimiento.</span><span class="caret" aria-hidden="true"></span></h1>
    <p class="lead">Movix Studio lleva tu negocio de estar en redes a vender en redes: estrategia, contenido
       que detiene el scroll, pauta medida en clientes e inteligencia artificial aplicada con criterio.</p>
    <div class="hero__cta">
      <a class="btn btn--send" href="intake/"><span class="l">Dale play a tu marca</span>${ARROW}</a>
      <a class="btn btn--ghost" href="${WA}?text=Hola%20Movix%20Studio%2C%20quiero%20info" rel="noopener" target="_blank">Hablemos por WhatsApp</a>
    </div>
    <p class="hero__note">El brief se llena en 15 minutos, desde el cel, y nos llega directo por WhatsApp.</p>
    </div>
    <div class="hero__deco" aria-hidden="true">
      <span class="ring r1"></span><span class="ring r2"></span><span class="ring r3"></span>
      <canvas class="play3d" id="play3d"></canvas>
    </div>
  </div>
  <div class="ticker" aria-hidden="true"><div class="ticker__track" id="tickerTrack" data-words="Estrategia,Contenido,Pauta,Branding,Video,Sitios web,Renders IA,Chatbots,Automatización,Datos"></div></div>
</header>
<main class="wrap">
  <section class="blk reveal" id="servicios">
    <div class="blk__head"><h2>Todo lo que tu marca necesita, <span class="grad">en un solo lugar.</span></h2>
    <p>Sin malabares entre proveedores: estrategia, producción, crecimiento e IA bajo el mismo techo, hablándose entre sí.</p></div>
    <div class="cards">${SERVICES.map(s=>`
      <a class="scard" href="servicios/${s.slug}.html">${mark(s.icon)}<h3>${s.name}</h3><p>${s.short}</p><span class="more">Cómo lo hacemos →</span></a>`).join("")}
    </div>
  </section>
  <section class="blk reveal">
    <div class="blk__head"><h2>Así se ve <span class="grad">darle play.</span></h2>
    <p>Un proceso claro de principio a fin — sabés en qué paso estamos y qué sigue, siempre.</p></div>
    <div class="steps">
      <div class="step"><span class="step__n">01</span><h3>Brief</h3><p>Llenás el intake en 15 minutos: tu marca, tus productos y tus metas. Nos llega directo por WhatsApp.</p></div>
      <div class="step"><span class="step__n">02</span><h3>Estrategia</h3><p>Reunión de arranque con propuesta sobre la mesa: públicos, calendario y promociones para tu industria.</p></div>
      <div class="step"><span class="step__n">03</span><h3>Producción</h3><p>Contenido, video y pauta corriendo. Publicación constante con la identidad de tu marca al frente.</p></div>
      <div class="step"><span class="step__n">04</span><h3>Crecimiento</h3><p>Reportes que hablan de ventas y leads, no de likes. Se corta lo que no funciona, se duplica lo que sí.</p></div>
    </div>
  </section>
  <section class="blk reveal">
    <div class="blk__head"><h2>Tu industria ya tiene <span class="grad">su formulario.</span></h2>
    <p>El intake de Movix Studio se adapta a tu rubro: elegí tu categoría y el brief se arma solo con lo que tu negocio necesita.</p></div>
    <div class="inds">${INDUSTRIES.map(n=>`<a class="ind" href="intake/"><i></i>${n}</a>`).join("")}</div>
  </section>
  ${testimonios("Lo que dicen <span class='grad'>quienes trabajan con nosotros.</span>","Sin recortes convenientes: cada cita es textual y publicada con autorización de quien la dijo.")}
  <section class="blk reveal">
    <div class="blk__head"><h2>Detrás del estudio, <span class="grad">un ecosistema.</span></h2>
    <p>Movix Studio es la marca creativa de Movix Corporation S.R.L. El mismo grupo construye software
    propio, así que cuando tu negocio necesita tecnología no te mandamos a otro proveedor.</p></div>
    <div class="cards">
      <a class="scard" href="ecosistema.html#movix-studio">${mark("video")}<h3>Movix Studio</h3>
        <p>El motor creativo. Contenido, video vertical, pauta digital, branding e IA aplicada a vender.</p>
        <span class="more">Ver la marca →</span></a>
      <a class="scard" href="ecosistema.html#fidelix">${mark("wallet")}<h3>Fidelix</h3>
        <p>Lealtad digital sin fricción: la tarjeta de puntos vive en Apple Wallet y Google Wallet, sin otra app que instalar.</p>
        <span class="more">Ver la plataforma →</span></a>
      <a class="scard" href="ecosistema.html#petix-care">${mark("heart")}<h3>Petix Care</h3>
        <p>Marketplace de servicios para mascotas: agenda llena para veterinarias, atención de club para las familias.</p>
        <span class="more">Ver la plataforma →</span></a>
    </div>
    <p class="fineprint">Trabajar con una marca del ecosistema abre condiciones preferenciales en las
    otras. <a href="ecosistema.html">Ver cómo funciona el beneficio cruzado</a>.</p>
  </section>
  <section class="blk reveal">
    <div class="blk__head"><h2>Tu marca, <span class="grad">bien resguardada.</span></h2>
    <p>Cifrado en tránsito con secreto perfecto hacia adelante, política de contenido de denegación por
    defecto, análisis estático de seguridad en cada despliegue y cero cookies o rastreadores. No es un
    discurso: se puede verificar desde tu navegador.</p></div>
    <div class="cards cards--2">
      <a class="scard" href="seguridad.html">${mark("shield")}<h3>Postura de seguridad</h3>
        <p>Los doce controles activos en producción, explicados uno por uno y sin humo técnico.</p>
        <span class="more">Ver cómo está blindado →</span></a>
      <a class="scard" href="privacidad.html">${mark("lock")}<h3>Privacidad y datos</h3>
        <p>Qué pasa con lo que nos contás y qué derechos tenés bajo la Ley N.º 8968 de Costa Rica.</p>
        <span class="more">Leer la política →</span></a>
    </div>
  </section>
  <section class="blk reveal">
    <div class="blk__head"><h2>Ideas del <span class="grad">estudio.</span></h2>
    <p>Lo que aprendemos trabajando, escrito sin humo. Estrategia, ventas e inteligencia artificial aplicada.</p></div>
    <div class="posts">${POSTS.map(p=>`
      <a class="post" href="blog/${p.slug}.html"><span class="cat">${p.cat}</span><h3>${p.title}</h3><p>${p.excerpt}</p><span class="date">${p.date}</span></a>`).join("")}
    </div>
  </section>
  ${cta("")}
</main>`;

/* ---------- SERVICIOS index ---------- */
const svcIndexBody = `
<header class="hero hero--sub"><div class="wrap"><div class="hero__copy">
  <p class="eyebrow">Servicios</p>
  <h1>Lo que hacemos, <span class="grad">y cómo.</span></h1>
  <p class="lead">Seis disciplinas, un solo sistema. Cada servicio tiene su página con el proceso completo,
  qué incluye y las respuestas a lo que siempre nos preguntan.</p>
</div></div></header>
<main class="wrap">
  <section class="blk reveal" style-note="">
    <div class="cards cards--2">${SERVICES.map(s=>`
      <a class="scard" href="${s.slug}.html">${mark(s.icon)}<h3>${s.name}</h3><p>${s.short}</p><span class="more">Ver el proceso completo →</span></a>`).join("")}
    </div>
  </section>
  ${cta("../")}
</main>`;

/* ---------- página de cada servicio ---------- */
function serviceBody(s){
  return `
<header class="hero hero--sub"><div class="wrap"><div class="hero__copy">
  <p class="eyebrow">Servicio · Movix Studio</p>
  <h1>${s.h1}</h1>
  <p class="lead">${s.lead}</p>
  <div class="hero__cta">
    <a class="btn btn--send" href="../intake/"><span class="l">Quiero este servicio</span>${ARROW}</a>
    <a class="btn btn--ghost" href="index.html">Ver todos los servicios</a>
  </div>
</div></div></header>
<main class="wrap">
  <section class="blk reveal">
    <div class="blk__head"><h2>Cómo lo <span class="grad">hacemos.</span></h2></div>
    <div class="steps">${s.steps.map((st,i)=>`
      <div class="step"><span class="step__n">0${i+1}</span><h3>${st[0]}</h3><p>${st[1]}</p></div>`).join("")}
    </div>
  </section>
  <section class="blk reveal">
    <div class="blk__head"><h2>Qué <span class="grad">incluye.</span></h2></div>
    <ul class="ticklist">${s.includes.map(x=>`<li>${x}</li>`).join("")}</ul>
  </section>
  <section class="blk reveal">
    <div class="blk__head"><h2>Para quién <span class="grad">es.</span></h2>
    <p>${s.who}</p></div>
  </section>
  <section class="blk reveal">
    <div class="blk__head"><h2>Preguntas <span class="grad">frecuentes.</span></h2></div>
    ${s.faq.map(f=>`<details class="faq"><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join("")}
  </section>
  ${cta("../","¿Hablamos de <span class='grad'>"+s.name.toLowerCase()+"?</span>","Contanos de tu marca en el brief y llegá a la primera llamada con una propuesta concreta sobre la mesa.")}
</main>`;
}

/* ---------- NOSOTROS ---------- */
const nosotrosBody = `
<header class="hero hero--sub"><div class="wrap"><div class="hero__copy">
  <p class="eyebrow">Nosotros</p>
  <h1>Una agencia hecha para <span class="grad">mover marcas.</span></h1>
  <p class="lead">Movix nace de una convicción simple: en Costa Rica hay negocios excelentes con marcas que
  no les hacen justicia. Nuestro trabajo es cerrar esa brecha — con estrategia, oficio y tecnología de frontera.</p>
</div></div></header>
<main class="wrap">
  <section class="blk reveal"><div class="prose">
    <p><b>El nombre lo dice todo: Movix viene de movimiento.</b> Una marca quieta es una marca invisible —
    y la nuestra es una promesa de lo contrario: contenido que circula, campañas que iteran, sistemas que
    aprenden y marcas que avanzan mes a mes con evidencia, no con corazonadas.</p>
    <p>No somos la agencia de los reportes de humo. Si un formato no vendió, se corta. Si una campaña
    quema presupuesto, se apaga. Nuestro incentivo está alineado con el tuyo: <b>que tu negocio venda más</b>
    — porque una agencia solo se queda donde los números lo justifican.</p>
    <p>Y trabajamos con las herramientas de esta década: renders generativos, asistentes conversacionales y
    automatización de flujos, siempre con dirección humana y criterio editorial. La tecnología multiplica el
    oficio; nunca lo sustituye.</p>
    <h3>El estudio no trabaja solo</h3>
    <p>Movix Studio es la marca creativa de <b>Movix Corporation S.R.L.</b>, sociedad costarricense con
    domicilio en San Rafael de Escazú. El mismo grupo desarrolla software propio: <b>Fidelix</b>, una
    plataforma de lealtad digital que vive en la billetera del teléfono, y <b>Petix Care</b>, un
    marketplace de servicios para mascotas. Eso cambia lo que podemos ofrecerte: no revendemos
    herramientas de terceros con una capa de servicio encima — cuando tu negocio necesita tecnología,
    la construimos. <a href="ecosistema.html">Conocé el ecosistema completo</a>.</p>
  </div></section>
  <section class="blk reveal">
    <div class="blk__head"><h2>Lo que nos <span class="grad">gobierna.</span></h2></div>
    <div class="cards">
      <div class="scard">${mark("spark")}<h3>Movimiento</h3><p>Publicar, medir, iterar. El plan perfecto que nunca sale pierde contra el sistema constante que mejora cada semana.</p></div>
      <div class="scard">${mark("eye")}<h3>Precisión</h3><p>Datos antes que opiniones. Cada colón de pauta rastreado, cada decisión con evidencia, cada reporte sin maquillaje.</p></div>
      <div class="scard">${mark("hand")}<h3>Transparencia</h3><p>Vos sos dueño de todo: tus cuentas, tus accesos, tu contenido, tus datos. Nosotros administramos; jamás secuestramos.</p></div>
    </div>
    <p class="fineprint">Lo de "vos sos dueño de todo" no es una frase de brochure: está redactado como
    obligación en los <a href="terminos.html">términos y condiciones</a>, junto con el uso que le damos
    a la inteligencia artificial y qué garantizamos exactamente.</p>
  </section>
  <section class="blk reveal">
    <div class="pride">
      <div class="prideplay" role="img" aria-label="Play de Movix en los colores Progress Pride">
        <svg viewBox="0 0 24 24" fill="none"><path d="M8 5v14l11-7Z" fill="#fff"/></svg>
      </div>
      <div class="pride__txt">
        <h3>Un espacio libre.</h3>
        <p>Nuestra marca es violeta y coral los doce meses del año — y cuando el play se enciende en el
        espectro Progress Pride, no es una campaña: es una declaración de casa. En Movix Studio nadie tiene
        que cambiar quién es para entrar, trabajar o crear. La diversidad no es un mes en el calendario;
        es parte del sistema de marca — <b>con orgullo, siempre</b>. Con esa variante patrocinamos eventos
        culturales e iniciativas de derechos humanos durante todo el año.</p>
        <p class="pride__cta"><a class="btn btn--ghost" href="inclusion.html">Cómo lo sostenemos, en concreto</a></p>
      </div>
    </div>
  </section>
  <section class="blk reveal">
    <div class="blk__head"><h2>Cómo se trabaja <span class="grad">con nosotros.</span></h2>
    <p>Sin misterio y sin reuniones eternas: un proceso de cuatro pasos que arranca con un brief de 15 minutos.</p></div>
    <div class="steps">
      <div class="step"><span class="step__n">01</span><h3>Brief</h3><p>Nos contás tu marca en el intake — se llena desde el cel y nos llega por WhatsApp.</p></div>
      <div class="step"><span class="step__n">02</span><h3>Propuesta</h3><p>Llegamos a la primera reunión con estrategia y precio concretos. Sin cotizaciones infladas de plantilla.</p></div>
      <div class="step"><span class="step__n">03</span><h3>Ejecución</h3><p>Calendario aprobable desde el cel, producción constante y comunicación directa — sin intermediarios.</p></div>
      <div class="step"><span class="step__n">04</span><h3>Evidencia</h3><p>Reporte mensual orientado a ventas y una regla fija: lo que no funciona se corta ese mismo mes.</p></div>
    </div>
  </section>
  ${testimonios("En palabras de <span class='grad'>nuestros clientes.</span>","Publicadas con nombre, cargo y marca — porque un testimonio anónimo no vale nada.")}
  ${cta("")}
</main>`;

/* ---------- BLOG ---------- */
const blogIndexBody = `
<header class="hero hero--sub"><div class="wrap"><div class="hero__copy">
  <p class="eyebrow">Blog</p>
  <h1>Ideas del <span class="grad">estudio.</span></h1>
  <p class="lead">Lo que aprendemos trabajando con marcas reales, escrito sin humo: estrategia, ventas por
  WhatsApp e inteligencia artificial aplicada con criterio.</p>
</div></div></header>
<main class="wrap">
  <section class="blk reveal">
    <div class="posts">${POSTS.map(p=>`
      <a class="post" href="${p.slug}.html"><span class="cat">${p.cat}</span><h3>${p.title}</h3><p>${p.excerpt}</p><span class="date">${p.date} · Equipo Movix Studio</span></a>`).join("")}
    </div>
  </section>
  ${cta("../")}
</main>`;

function postBody(p){
  return `
<header class="hero hero--sub"><div class="wrap"><div class="hero__copy">
  <p class="eyebrow">${p.cat}</p>
  <h1 style-note="">${p.title.replace(/:(.+)$/,': <span class="grad">$1</span>')}</h1>
</div></div></header>
<main class="wrap">
  <div class="postmeta"><span>${p.date}</span><span>·</span><span>Equipo Movix Studio</span></div>
  <article class="prose reveal in">${p.body}</article>
  ${cta("../")}
</main>`;
}


/* ---------- SOPORTE ---------- */
const soporteBody = `
<header class="hero hero--sub"><div class="wrap"><div class="hero__copy">
  <p class="eyebrow">Soporte en línea</p>
  <h1>Ayuda cuando la <span class="grad">necesitás.</span></h1>
  <p class="lead">Un asistente disponible 24/7 para lo inmediato, y un equipo humano por WhatsApp para
  lo que necesita criterio. Acá está todo lo que solemos resolver antes de que tengás que escribir.</p>
  <div class="hero__cta">
    <a class="btn btn--send" href="#" data-open-chat><span class="l">Abrir el asistente</span>${ARROW}</a>
    <a class="btn btn--ghost" href="${WA}?text=Hola%20Movix%20Studio%2C%20necesito%20soporte" rel="noopener" target="_blank">Escribir a una persona</a>
  </div>
</div></div></header>
<main class="wrap">
  <section class="blk reveal">
    <div class="blk__head"><h2>Tres formas de <span class="grad">resolverlo.</span></h2>
    <p>Elegí según la urgencia y el tipo de consulta. Ninguna requiere registro ni deja datos guardados.</p></div>
    <div class="cards">
      <div class="scard">${mark("ia")}<h3>Asistente 24/7</h3><p>Responde al instante lo frecuente: servicios, cómo empezar, tiempos, alcance. Está en el botón flotante de cualquier página del sitio.</p></div>
      <div class="scard">${mark("wa")}<h3>Equipo humano</h3><p>Para clientes activos y consultas que necesitan criterio. WhatsApp directo en horario hábil de Costa Rica, sin bots de por medio.</p></div>
      <div class="scard">${mark("spark")}<h3>Base de conocimiento</h3><p>Las respuestas a lo que más nos preguntan, escritas completas y sin rodeos. Están acá abajo.</p></div>
    </div>
  </section>
  <section class="blk reveal">
    <div class="blk__head"><h2>Proyectos <span class="grad">en marcha.</span></h2></div>
    <details class="faq"><summary>¿Cómo apruebo el contenido del mes?</summary><p>El calendario editorial llega con días de anticipación y se aprueba desde el celular. Cada pieza se puede comentar o pedir cambios en el mismo hilo — nada sale publicado sin tu visto bueno.</p></details>
    <details class="faq"><summary>¿Con cuánta anticipación debo enviar material?</summary><p>Fotos, productos nuevos o promociones: idealmente una semana antes del mes que van a salir. Para urgencias comerciales tenemos margen, pero mientras más aviso, mejor queda la pieza.</p></details>
    <details class="faq"><summary>Necesito un cambio urgente en una campaña activa</summary><p>Escribinos por WhatsApp con la palabra "urgente" al inicio. Pausar o ajustar una campaña de pauta es cuestión de minutos en horario hábil.</p></details>
    <details class="faq"><summary>¿Cada cuánto recibo reportes?</summary><p>Un reporte mensual orientado a negocio — conversaciones, leads, costo por lead y ventas atribuibles — más la reunión de iteración donde decidimos qué se corta y qué se duplica.</p></details>
  </section>
  <section class="blk reveal">
    <div class="blk__head"><h2>Accesos y <span class="grad">propiedad.</span></h2></div>
    <details class="faq"><summary>¿De quién son mis cuentas y mi contenido?</summary><p>Tuyas, siempre. Vos quedás como propietario de cada cuenta, dominio y pieza de contenido; nosotros entramos como administradores mientras dure la relación y salimos sin llevarnos nada.</p></details>
    <details class="faq"><summary>¿Cómo les doy acceso sin mandar contraseñas?</summary><p>Nunca por WhatsApp ni correo. Cada plataforma permite dar acceso por rol: Meta Business Suite, Google Business Profile y TikTok tienen su propio flujo de invitación. Te guiamos paso a paso en el arranque.</p></details>
    <details class="faq"><summary>Perdí el acceso a mi propia cuenta de Instagram o Facebook</summary><p>Pasa más de lo que parece y tiene solución. Escribinos: hemos recuperado cuentas con verificación de identidad de Meta varias veces y te acompañamos en el proceso.</p></details>
  </section>
  <section class="blk reveal">
    <div class="blk__head"><h2>Facturación y <span class="grad">contratación.</span></h2></div>
    <details class="faq"><summary>¿Cómo se factura el servicio?</summary><p>Factura electrónica a nombre de tu empresa, con el detalle de lo que incluye cada línea. Los términos exactos quedan por escrito en la propuesta — sin cargos sorpresa.</p></details>
    <details class="faq"><summary>¿El presupuesto de pauta va aparte?</summary><p>Sí, y siempre transparente: sabés exactamente cuánto pagás por gestión y cuánto va directo a las plataformas. Nunca inflamos el presupuesto de medios.</p></details>
    <details class="faq"><summary>¿Hay permanencia mínima?</summary><p>Los términos se definen en la propuesta según el servicio. Nuestra postura es simple: una agencia debería quedarse porque los números lo justifican, no porque un contrato lo obligue.</p></details>
  </section>
  ${cta("","¿No encontraste lo que <span class='grad'>buscabas?</span>","Escribinos directo por WhatsApp — si es de un proyecto activo, mencionanos el nombre de tu marca y vamos al grano.")}
</main>`;

/* ---------- INCLUSIÓN ----------
   Criterio: la inclusión se sostiene con compromisos verificables, no con
   decoración. Por eso la página mezcla la variante Pride permanente con
   accesibilidad medible, representación en la producción y acceso al talento.
   Un sitio que se dice inclusivo y no es navegable por teclado, no lo es. */
const inclusionBody = `
<header class="hero hero--sub"><div class="wrap"><div class="hero__copy">
  <p class="eyebrow">Con orgullo, siempre</p>
  <h1>La inclusión se demuestra, <span class="grad">no se decora.</span></h1>
  <p class="lead">Es fácil pintar un logo de colores en junio. Es más difícil sostener un estudio donde
  nadie tiene que editarse para entrar, producir contenido donde la gente se reconozca, y construir
  sitios que una persona ciega pueda usar sin ayuda. Nosotros elegimos lo segundo — y acá está
  exactamente en qué consiste.</p>
</div>
<div class="hero__deco hero__deco--pride" aria-hidden="true">
  <div class="prideplay prideplay--xl"><svg viewBox="0 0 24 24" fill="none"><path d="M8 5v14l11-7Z" fill="#fff"/></svg></div>
</div></div></header>
<main class="wrap">

  <section class="blk reveal">
    <div class="blk__head"><h2>El play arcoíris <span class="grad">no es de temporada.</span></h2>
    <p>El play es la firma de Movix. Su variante en el espectro Progress Pride no se activa en junio
    para guardarse en julio: es una variante permanente del sistema de marca, disponible los doce meses
    del año. Con ella patrocinamos eventos culturales e iniciativas de derechos humanos.</p></div>
    <div class="cards cards--2">
      <div class="scard">${mark("pride")}<h3>Por qué la bandera Progress y no la clásica</h3>
        <p>La Progress Pride suma las franjas negra y café por las personas racializadas, y celeste,
        rosa y blanco por las personas trans. Es la versión que representa explícitamente a quienes
        quedaban fuera de la original. Si el gesto es de inclusión, se hace completo o no se hace.</p></div>
      <div class="scard">${mark("hand")}<h3>Qué significa en la práctica</h3>
        <p>Que un cliente puede pedirnos la variante estándar y la tendrá, pero nadie nos va a pedir que
        escondamos la otra. Y que el equipo no cambia de discurso según quién esté en la sala.</p></div>
    </div>
  </section>

  <section class="blk reveal">
    <div class="blk__head"><h2>Accesibilidad: la parte <span class="grad">que nadie presume.</span></h2>
    <p>Una marca que se dice inclusiva y publica video sin subtítulos está dejando fuera a una de cada
    cinco personas. Estos son los estándares que aplicamos a todo lo que producimos — para nosotros y
    para vos, sin costo adicional y sin que haya que pedirlo.</p></div>
    <ul class="ticklist">
      <li><b>Subtítulos en todo el video.</b> No como opción del reproductor: quemados o nativos, siempre. También sirven para quien mira sin sonido, que es la mayoría.</li>
      <li><b>Contraste verificado.</b> Todo texto cumple o supera el mínimo <em>WCAG AA</em>. Ningún gris elegante que solo se lee en una pantalla nueva.</li>
      <li><b>Texto alternativo real.</b> Descripciones que dicen qué hay en la imagen, no "imagen1.jpg".</li>
      <li><b>Navegable por teclado.</b> Todo el sitio se recorre sin mouse, con foco visible en cada elemento.</li>
      <li><b>Respeta el movimiento reducido.</b> Si tu sistema pide menos animación, la animación se apaga sola. Sin excepciones.</li>
      <li><b>Lenguaje claro.</b> Se escribe para que se entienda a la primera, no para sonar sofisticado.</li>
      <li><b>Estructura semántica.</b> Encabezados jerárquicos y regiones marcadas para que un lector de pantalla no se pierda.</li>
      <li><b>Sin dependencia del color.</b> Ninguna información se transmite solo por color; siempre hay texto o forma que la respalde.</li>
    </ul>
    <p class="fineprint">Podés comprobarlo en este mismo sitio: recorrelo con la tecla de tabulación, o
    activá "reducir movimiento" en tu sistema y volvé a cargarlo.</p>
  </section>

  <section class="blk reveal">
    <div class="blk__head"><h2>A quién se ve <span class="grad">en las piezas.</span></h2>
    <p>La representación no se arregla en la edición: se decide en el casting y en el guion. Es una
    conversación que tenemos con cada cliente, y una que sabemos sostener con argumentos comerciales
    además de éticos.</p></div>
    <div class="steps">
      <div class="step"><span class="step__n">01</span><h3>Casting con criterio</h3>
        <p>Buscamos que quien aparece en pantalla se parezca a quien compra. En Costa Rica eso significa
        más variedad de la que suele mostrar la publicidad local — de edad, de cuerpo, de origen.</p></div>
      <div class="step"><span class="step__n">02</span><h3>Sin estereotipos de relleno</h3>
        <p>Incluir a alguien para ocupar una casilla se nota y se castiga. Las personas aparecen con rol
        y con voz, o no aparecen.</p></div>
      <div class="step"><span class="step__n">03</span><h3>Consentimiento informado</h3>
        <p>Cesiones de uso de imagen claras, con alcance y plazo explícitos. Nadie firma sin entender
        dónde va a salir su cara y por cuánto tiempo.</p></div>
      <div class="step"><span class="step__n">04</span><h3>Sin rostros fabricados</h3>
        <p>No generamos personas con inteligencia artificial para simular clientes, testimonios o
        equipos. Si ves una cara en una pieza nuestra, esa persona existe y dio su permiso.</p></div>
    </div>
  </section>

  <section class="blk reveal">
    <div class="blk__head"><h2>Talento donde <span class="grad">nadie busca.</span></h2>
    <p>El talento está repartido parejo; las oportunidades no. Movix mantiene abiertos dos frentes que
    no dependen de que nos convenga comercialmente.</p></div>
    <div class="cards cards--2">
      <div class="scard">${mark("spark")}<h3>Reclutamiento fuera del circuito</h3>
        <p>Buscamos perfiles disruptivos en zonas y comunidades que las agencias no visitan. No pedimos
        portafolios de escuela cara: pedimos que nos muestren algo que hayan hecho.</p></div>
      <div class="scard">${mark("doc")}<h3>Recursos liberados</h3>
        <p>Publicamos plantillas, guías y recursos gratuitos para pymes con presupuesto corto.
        Democratizar el marketing también mueve el mercado en el que trabajamos.</p></div>
    </div>
  </section>

  <section class="blk reveal">
    <div class="blk__head"><h2>Lo que <span class="grad">no hacemos.</span></h2>
    <p>Un compromiso sin límites claros no es un compromiso. Estos son los nuestros, y valen tanto para
    campañas propias como para las de clientes.</p></div>
    <ul class="ticklist">
      <li><b>No producimos contenido</b> que denigre a una persona o grupo por su identidad, orientación, origen, edad, discapacidad o creencias.</li>
      <li><b>No hacemos rainbow-washing:</b> no vendemos campañas de junio a marcas que no sostienen nada el resto del año.</li>
      <li><b>No fabricamos personas ni testimonios</b> con inteligencia artificial para simular respaldo social.</li>
      <li><b>No entregamos piezas inaccesibles</b> aunque el cliente no las haya pedido accesibles.</li>
    </ul>
    <p class="fineprint">Estos límites están además redactados como obligación en los
    <a href="terminos.html">términos y condiciones</a> — no son una promesa de página web.</p>
  </section>

  ${cta("","¿Trabajamos <span class='grad'>así?</span>","Si esto describe cómo querés que se vea y se comporte tu marca, tenemos mucho de qué hablar.")}
</main>`;

/* ---------- TÉRMINOS Y CONDICIONES ---------- */
const terminosBody = `
<header class="hero hero--sub"><div class="wrap"><div class="hero__copy">
  <p class="eyebrow">Marco contractual</p>
  <h1>Términos y <span class="grad">condiciones.</span></h1>
  <p class="lead">Las reglas del juego, escritas para que se entiendan. Este documento rige el uso de
  este sitio y del formulario de brief, y establece el marco general de contratación de los servicios
  y plataformas de Movix Corporation S.R.L. Está redactado conforme al ordenamiento jurídico
  costarricense.</p>
  <p class="hero__note">Última actualización: 2 de agosto de 2026 · Versión 1.0</p>
</div></div></header>
<main class="wrap">

  <section class="blk reveal"><div class="prose">
    <h3>1 · Quién presta el servicio</h3>
    <p><strong>Movix Corporation S.R.L.</strong> ("Movix", "nosotros"), sociedad de responsabilidad
    limitada domiciliada en San Rafael de Escazú, San José, Costa Rica, es la titular de este sitio y
    la responsable de la prestación de los servicios descritos en él, sea directamente o a través de
    sus marcas <strong>Movix Studio</strong>, <strong>Fidelix</strong> y <strong>Petix Care</strong>.
    Los datos registrales completos y la cédula jurídica se entregan en la propuesta y en todo
    documento contractual o tributario que se emita a tu nombre.</p>
    <p>Canal oficial de contacto: WhatsApp
    <a href="${WA}" rel="noopener" target="_blank">+506 7086-3466</a>.</p>

    <h3>2 · Qué aceptás al usar este sitio</h3>
    <p>Al navegar este sitio, usar el asistente en línea o completar el formulario de brief, aceptás
    estos términos y la <a href="privacidad.html">política de privacidad</a>. Si no estás de acuerdo
    con alguna parte, la vía correcta es no usar el sitio. Estos términos aplican a personas mayores
    de edad y a representantes con capacidad legal para obligar al negocio que representan.</p>

    <h3>3 · Naturaleza de la información publicada</h3>
    <p>El contenido de este sitio —descripciones de servicios, niveles de acompañamiento, artículos
    del blog, respuestas del asistente y materiales descargables— tiene <strong>carácter informativo
    y no constituye una oferta vinculante</strong>, ni asesoría legal, contable, tributaria, médica,
    financiera ni de inversión. Ningún precio, porcentaje, plazo o alcance mencionado en el sitio
    obliga a Movix hasta que conste en una propuesta escrita, firmada o aceptada por medio verificable.</p>
    <p>Nos reservamos el derecho de modificar, suspender o descontinuar cualquier servicio, nivel,
    beneficio o contenido, sin que ello genere derecho a indemnización. Los cambios no afectan
    retroactivamente contratos ya perfeccionados.</p>

    <h3>4 · El brief de marca</h3>
    <p>El formulario de brief es una <strong>herramienta de diagnóstico previa a la contratación</strong>.
    Completarlo y enviarlo <strong>no crea relación contractual</strong> ni obliga a ninguna de las
    dos partes: no nos obliga a prestar el servicio ni te obliga a contratarlo.</p>
    <ul>
      <li>Tus respuestas y los archivos que cargués se guardan <strong>únicamente en el almacenamiento
      local de tu dispositivo</strong> hasta que vos decidás enviarlos. No se transmiten a servidores
      nuestros ni podemos verlos antes de ese envío.</li>
      <li>El envío se realiza como mensaje de WhatsApp <strong>desde tu propia cuenta</strong>, por
      acción tuya. A partir de ese momento aplican también los términos de WhatsApp (Meta).</li>
      <li>Declarás que la información que enviás es veraz y que tenés facultades para compartirla,
      incluidos logotipos, imágenes y datos del negocio que representás.</li>
    </ul>

    <h3>5 · Contratación, propuestas y precios</h3>
    <p>La relación comercial se perfecciona con la aceptación de una <strong>propuesta escrita</strong>
    que detalla alcance, entregables, plazos, precio, forma de pago y vigencia. En caso de
    discrepancia entre este sitio y la propuesta, <strong>prevalece siempre la propuesta</strong>.</p>
    <ul>
      <li>Los precios se cotizan por proyecto o por servicio recurrente, según el alcance real. No
      existe tarifario de plantilla publicado.</li>
      <li>Salvo indicación expresa, los montos cotizados <strong>no incluyen el Impuesto al Valor
      Agregado</strong>, que se traslada conforme a la legislación costarricense vigente.</li>
      <li>Los proyectos ejecutados fuera del área metropolitana pueden incluir una provisión de
      viáticos y logística, que siempre se detalla en la propuesta antes de aprobarse.</li>
      <li>Todo trabajo solicitado por fuera del alcance acordado se cotiza aparte y requiere
      aprobación escrita previa. No facturamos sorpresas.</li>
    </ul>

    <h3>6 · Pagos, mora y suspensión</h3>
    <ul>
      <li>Los servicios recurrentes se facturan por adelantado según la periodicidad pactada; los
      proyectos, conforme al calendario de hitos de la propuesta.</li>
      <li>El atraso en el pago faculta a Movix a <strong>suspender la prestación</strong> previo
      aviso, sin que ello constituya incumplimiento de nuestra parte, y a aplicar los intereses
      moratorios que permita la ley.</li>
      <li>Los anticipos destinados a reservar equipo, locación, talento o pauta pueden no ser
      reembolsables cuando ya se hayan comprometido con terceros. Esa condición se advierte por
      escrito antes del cobro.</li>
      <li>La <strong>inversión publicitaria</strong> (el presupuesto que se entrega a Meta, Google,
      TikTok u otra plataforma) es un rubro distinto de nuestros honorarios y se detalla por separado.
      No retenemos remanentes de pauta no ejecutada: se reporta y se reasigna o devuelve.</li>
    </ul>

    <h3>7 · Obligaciones del cliente</h3>
    <p>La calidad y los plazos del trabajo dependen en parte de vos. Al contratar te comprometés a:</p>
    <ul>
      <li>Entregar información, materiales, accesos y aprobaciones dentro de los plazos acordados. Los
      atrasos de tu lado corren el cronograma, no lo comprimen.</li>
      <li>Designar una persona con autoridad para aprobar. Las aprobaciones dadas por esa persona se
      tienen por válidas y definitivas.</li>
      <li>Garantizar que el material que nos entregás (logos, fotos, música, textos, bases de datos)
      es de tu propiedad o contás con licencia suficiente para su uso.</li>
      <li>Cumplir la normativa aplicable a tu actividad —incluidos permisos sanitarios, patentes,
      pólizas y reglas de publicidad de tu sector— así como la normativa de protección de datos
      respecto de las bases de contactos que nos compartás.</li>
    </ul>

    <h3>8 · Accesos y propiedad de las cuentas</h3>
    <p>Trabajamos <strong>siempre por delegación de permisos, nunca con tus contraseñas</strong>. Vos
    nos otorgás acceso desde el administrador de tu propia cuenta y podés revocarlo en cualquier
    momento. La titularidad de perfiles, páginas, píxeles, cuentas publicitarias, dominios y
    propiedades de analítica <strong>es tuya desde el primer día</strong> y así queda establecido por
    escrito. Al terminar la relación no retenemos accesos ni condicionamos la entrega de cuentas.</p>

    <h3>9 · Propiedad intelectual</h3>
    <ul>
      <li><strong>Lo que producimos para tu marca</strong> —piezas gráficas, video, fotografía, copys y
      material de campaña aprobado— se te cede en uso pleno para los fines comerciales de tu marca una
      vez cancelado el precio correspondiente.</li>
      <li><strong>Lo que es nuestro sigue siendo nuestro:</strong> metodologías, plantillas, código
      fuente de las plataformas, flujos de automatización, prompts, modelos, componentes reutilizables
      y el software de Fidelix y Petix Care. Sobre estos se otorga licencia de uso, no propiedad.</li>
      <li><strong>Archivos de trabajo</strong> (proyectos de edición, capas, sesiones en crudo) no
      forman parte del entregable salvo pacto expreso y cotizado.</li>
      <li><strong>Portafolio:</strong> salvo que nos pidás lo contrario por escrito, podemos mostrar el
      trabajo realizado y mencionar tu marca con fines de portafolio. Basta un mensaje para excluirte.</li>
      <li><strong>Licencias de terceros</strong> (música, tipografías, imágenes de banco, actores)
      se rigen por sus propios términos y por el alcance temporal y territorial contratado.</li>
    </ul>

    <h3>10 · Contenido generado con inteligencia artificial</h3>
    <p>Parte de la producción puede apoyarse en modelos de inteligencia artificial —generación de
    imagen y video, asistentes conversacionales, subtitulado, segmentación y análisis—. Sobre esto
    somos explícitos:</p>
    <ul>
      <li>Todo material generado con IA que salga a nombre de tu marca pasa por <strong>revisión y
      aprobación humana</strong> antes de publicarse. La IA acelera, no decide.</li>
      <li>El estado legal de las obras generadas por IA está en evolución en varias jurisdicciones;
      no garantizamos la registrabilidad como obra protegida de piezas puramente generativas.</li>
      <li>No usamos IA para suplantar personas reales, fabricar testimonios ni simular respaldos que
      no existan. Cuando una pieza sea sustancialmente generativa y ello pueda inducir a error, se
      identifica como tal.</li>
      <li>Los asistentes conversacionales pueden equivocarse. Sus respuestas son orientativas y no
      sustituyen una confirmación del equipo humano.</li>
    </ul>

    <h3>11 · Resultados: qué garantizamos y qué no</h3>
    <p>Nos obligamos a una <strong>obligación de medios, no de resultado</strong>. Garantizamos
    ejecución profesional, cumplimiento del alcance, transparencia en la medición y reporte honesto —
    incluso cuando el número no favorece. <strong>No garantizamos</strong> volúmenes específicos de
    ventas, seguidores, alcance, posiciones en buscadores ni retorno de inversión, porque esos
    resultados dependen también de tu producto, tu precio, tu operación, tu competencia y de
    algoritmos de terceros que no controlamos. Cualquier proyección compartida es un escenario
    estimado, no una promesa.</p>

    <h3>12 · Plataformas de terceros</h3>
    <p>Buena parte del trabajo se ejecuta sobre plataformas ajenas (Meta, Google, TikTok, WhatsApp,
    Apple Wallet, Google Wallet, proveedores de hosting y de modelos de IA). Sus cambios de política,
    interrupciones, rechazos de anuncios, restricciones o cierres de cuenta <strong>no son
    imputables a Movix</strong>, aunque nos comprometemos a advertirlos, gestionarlos y buscar la
    mejor alternativa disponible.</p>

    <h3>13 · Confidencialidad</h3>
    <p>Toda información sensible que compartás —estrategia, precios de costo, márgenes, bases de
    clientes, planes de lanzamiento— se trata como confidencial y se usa solo para prestarte el
    servicio. Esta obligación es <strong>recíproca</strong>: también esperamos reserva sobre nuestras
    metodologías, propuestas y estructura de costos. Se mantiene vigente por dos años después de
    terminada la relación y no aplica a información pública, a la obtenida lícitamente de un tercero
    o a la que deba revelarse por orden de autoridad competente.</p>

    <h3>14 · Vigencia y terminación</h3>
    <ul>
      <li>Los servicios recurrentes se pactan por el plazo indicado en la propuesta y se renuevan
      según lo que ahí se establezca.</li>
      <li>Cualquiera de las partes puede terminar la relación con <strong>preaviso de treinta días
      naturales</strong>, salvo plazo distinto pactado por escrito.</li>
      <li>La terminación no exime del pago del trabajo ya ejecutado ni de los compromisos ya
      adquiridos con terceros por cuenta del proyecto.</li>
      <li>Movix puede terminar de inmediato y sin responsabilidad ante uso fraudulento, actividad
      ilícita, incumplimiento grave de pago, o si se nos solicita producir contenido engañoso,
      discriminatorio o que vulnere derechos de terceros.</li>
      <li>Al terminar entregamos los materiales aprobados y liberamos accesos en un plazo razonable.</li>
    </ul>

    <h3>15 · Limitación de responsabilidad</h3>
    <p>En la máxima medida permitida por la ley costarricense, la responsabilidad total de Movix
    frente a vos por cualquier reclamo derivado de la relación contractual se limita al
    <strong>monto efectivamente pagado por el servicio que originó el reclamo durante los tres meses
    anteriores al hecho</strong>. No respondemos por daños indirectos, lucro cesante, pérdida de
    datos, de oportunidad o de reputación. Nada de esto limita la responsabilidad por dolo, culpa
    grave o por aquello que la ley declare irrenunciable.</p>

    <h3>16 · Fuerza mayor</h3>
    <p>Ninguna parte responde por incumplimientos causados por hechos fuera de su control razonable:
    desastres naturales, cortes prolongados de electricidad o conectividad, conmoción civil, actos de
    autoridad, fallas mayores de proveedores de infraestructura o emergencias sanitarias. Los plazos
    se suspenden mientras dure el evento y se reanudan al cesar.</p>

    <h3>17 · Uso aceptable del sitio</h3>
    <p>No está permitido intentar vulnerar la seguridad del sitio, ejecutar accesos automatizados
    masivos, extraer contenido de forma sistemática para reutilizarlo comercialmente, suplantar
    identidad ni interferir con su funcionamiento. Si encontraste una vulnerabilidad, la vía correcta
    es <strong>reportarla</strong> por WhatsApp: agradecemos la divulgación responsable y respondemos
    rápido. Ver nuestra <a href="seguridad.html">postura de seguridad</a>.</p>

    <h3>18 · Datos personales</h3>
    <p>El tratamiento de datos personales se rige por la <a href="privacidad.html">política de
    privacidad</a>, conforme a la <strong>Ley N.º 8968</strong> de Protección de la Persona frente al
    Tratamiento de sus Datos Personales y su reglamento. Este sitio no instala cookies ni
    rastreadores. Cuando actuemos como encargados de tratamiento sobre bases de datos tuyas, lo
    haremos únicamente siguiendo tus instrucciones documentadas y aplicando medidas de seguridad
    equivalentes a las que aplicamos a las nuestras.</p>

    <h3>19 · Comunicaciones</h3>
    <p>Aceptás que las comunicaciones operativas del proyecto —aprobaciones, entregas, avisos— sean
    válidas por WhatsApp y correo electrónico a los contactos designados. Los avisos de terminación o
    reclamo formal deben constar por escrito y ser acusados de recibo.</p>

    <h3>20 · Cambios a estos términos</h3>
    <p>Podemos actualizar estos términos; la versión vigente será siempre la publicada en esta página
    con su fecha. Los cambios <strong>no aplican retroactivamente</strong> a contratos ya perfeccionados:
    esos se rigen por la versión vigente al momento de su aceptación.</p>

    <h3>21 · Ley aplicable y resolución de controversias</h3>
    <p>Estos términos se rigen por las <strong>leyes de la República de Costa Rica</strong>. Ante
    cualquier diferencia, las partes se obligan a intentar primero una solución directa y de buena fe
    dentro de los treinta días naturales siguientes a la notificación del reclamo. De no lograrse,
    la controversia se someterá a los <strong>tribunales de justicia de San José, Costa Rica</strong>,
    salvo que ambas partes acuerden por escrito acudir a un centro de resolución alterna de conflictos
    legalmente habilitado. Si alguna cláusula resultara nula o inaplicable, el resto conserva plena
    validez.</p>

    <h3>22 · Contacto</h3>
    <p>Dudas sobre estos términos, solicitudes de datos o reportes de seguridad: WhatsApp
    <a href="${WA}" rel="noopener" target="_blank">+506 7086-3466</a>. Respondemos en horario hábil
    de Costa Rica.</p>
  </div></section>

  <section class="blk reveal">
    <div class="blk__head"><h2>Lo mismo, <span class="grad">en corto.</span></h2>
    <p>Este resumen es orientativo y no sustituye el texto completo de arriba — pero si solo vas a
    leer una parte, que sea esta.</p></div>
    <ul class="ticklist">
      <li><b>Tus cuentas son tuyas.</b> Accesos por delegación, nunca por contraseña, y revocables cuando querrás.</li>
      <li><b>Lo que producimos para tu marca es tuyo</b> una vez pagado. Nuestras metodologías y nuestro software siguen siendo nuestros.</li>
      <li><b>El brief no te obliga a nada</b> y se queda en tu dispositivo hasta que vos lo enviés.</li>
      <li><b>Nada se factura por sorpresa:</b> todo fuera de alcance se cotiza y se aprueba antes.</li>
      <li><b>Garantizamos ejecución, no milagros.</b> Reportamos el número real aunque no favorezca.</li>
      <li><b>La IA se usa con revisión humana</b> y sin suplantar personas ni fabricar testimonios.</li>
      <li><b>Se sale con treinta días de preaviso</b> y te entregamos todo lo aprobado.</li>
      <li><b>Lo que nos contás es confidencial</b>, y esperamos la misma reserva de tu parte.</li>
    </ul>
  </section>

  ${cta("","¿Todo claro? <span class='grad'>Dale play.</span>","Si algo de este documento te genera dudas, preguntá antes de firmar nada — preferimos aclararlo hoy que discutirlo después.")}
</main>`;

/* ---------- ECOSISTEMA ----------
   Sólo información pública. El material corporativo interno (participación
   accionaria, identificaciones de los socios, presupuestos, rentabilidad,
   herramientas contratadas y hoja de ruta) no entra acá ni a ningún archivo
   de este repo. scripts/check-csp.js lo verifica en cada compilación. */
const ecosistemaBody = `
<header class="hero hero--sub"><div class="wrap"><div class="hero__copy">
  <p class="eyebrow">Movix Corporation S.R.L.</p>
  <h1>Un ecosistema, <span class="grad">no una agencia suelta.</span></h1>
  <p class="lead">Movix Studio no trabaja aislado. Es el motor creativo de un ecosistema que también
  construye software propio: una plataforma de lealtad digital y un marketplace de servicios para
  mascotas. Concepto, video, pauta, automatización y lealtad en un solo motor interconectado.</p>
  <div class="hero__cta">
    <a class="btn btn--send" href="intake/"><span class="l">Empezar mi brief</span>${ARROW}</a>
    <a class="btn btn--ghost" href="servicios/">Ver los servicios</a>
  </div>
  <p class="hero__note">San Rafael de Escazú, Costa Rica · "Tu marca, en movimiento."</p>
</div></div></header>
<main class="wrap">

  <section class="blk reveal">
    <div class="blk__head"><h2>Por qué existe <span class="grad">de esta forma.</span></h2>
    <p>Entre el marketing de alto nivel y la tecnología que realmente adquiere clientes suele haber una
    pared: la agencia entrega piezas, el software lo pone otro proveedor, y nadie responde por el
    resultado completo. Movix se estructuró para que esa pared no exista.</p></div>
    <div class="cards">
      <div class="scard">${mark("spark")}<h3>Una sola tesis</h3>
        <p>Todo lo que producimos —una campaña, un video, un flujo automatizado, un programa de
        lealtad— responde a la misma pregunta: ¿esto acerca una venta? Si no, no se hace.</p></div>
      <div class="scard">${mark("layers")}<h3>Tecnología propia</h3>
        <p>No revendemos software de terceros con una capa de servicio encima. Fidelix y Petix Care son
        plataformas nuestras, y eso significa que podemos moverlas al ritmo de tu negocio.</p></div>
      <div class="scard">${mark("ia")}<h3>IA de punta a punta</h3>
        <p>Modelos generativos en producción de contenido, IA conversacional en atención y calificación
        de leads, y automatización en la operación interna. Aplicada, no decorativa.</p></div>
    </div>
  </section>

  <section class="blk reveal" id="movix-studio">
    <div class="blk__head"><p class="eyebrow">Marca 01</p><h2>Movix <span class="grad">Studio.</span></h2>
    <p>El motor creativo, B2B y B2C. Estudio audiovisual-first que pone marcas en movimiento:
    video vertical de retención, pauta digital y automatización con inteligencia artificial.</p></div>
    <div class="cards cards--2">
      <a class="scard" href="servicios/contenido-video.html">${mark("video")}<h3>Producción audiovisual</h3>
        <p>Video vertical nativo, fotografía comercial y dirección de arte propia. El formato que
        gobierna la atención hoy, producido para que se sostenga el scroll.</p>
        <span class="more">Ver el proceso →</span></a>
      <a class="scard" href="servicios/ia-automatizaciones.html">${mark("ia")}<h3>IA y automatización</h3>
        <p>Chatbots y agentes conversacionales, calificación automática de leads, subtitulado y
        segmentación asistida por modelos. Atención que no duerme.</p>
        <span class="more">Ver el proceso →</span></a>
    </div>
    <div class="blk__head blk__head--mt"><h3>Cómo se trabaja acá</h3>
    <p>No hay paquetes en un menú. Hay un estudio que entra a entender tu negocio y diseña una
    respuesta a la medida — y esa respuesta se define con vos, no se elige de una lista.</p></div>
    <div class="steps">
      <div class="step"><span class="step__n">01</span><h3>Se estudia</h3>
        <p>Tu categoría, tu competencia, cómo compra tu cliente y qué está fallando hoy. De ahí sale la
        tesis: qué va a decir tu marca y por qué alguien debería detenerse a escucharla.</p></div>
      <div class="step"><span class="step__n">02</span><h3>Se diseña</h3>
        <p>Dirección de arte propia antes de encender una cámara. Encuadre, ritmo, paleta y voz — lo que
        hace que tu contenido se reconozca a tres metros sin ver el logo.</p></div>
      <div class="step"><span class="step__n">03</span><h3>Se produce</h3>
        <p>Producción propia con equipo profesional. Nada de banco de imágenes disfrazado de marca:
        cada pieza se rueda, se edita y se colorea con criterio editorial.</p></div>
      <div class="step"><span class="step__n">04</span><h3>Se sostiene</h3>
        <p>El oficio no está en el lanzamiento: está en el mes catorce. Ritmo constante, medición honesta
        y una regla fija — lo que no funciona se corta ese mismo mes.</p></div>
    </div>
    <p class="fineprint">El alcance se define con vos y queda por escrito antes de empezar: qué incluye,
    qué no, y en cuánto tiempo. Sin letra pequeña y sin sorpresas en la factura.</p>
  </section>

  <section class="blk reveal" id="fidelix">
    <div class="blk__head"><p class="eyebrow">Marca 02</p><h2>Fidelix — lealtad <span class="grad">sin fricción.</span></h2>
    <p>Plataforma de lealtad <em>white-label</em> para comercios. Sustituye la tarjeta de puntos física
    por un boleto digital que vive directamente en Apple Wallet y Google Wallet del cliente: sin
    instalar otra app, sin tarjetas que se pierden, sin sellos que se falsifican.</p></div>
    <div class="cards">
      <div class="scard">${mark("wallet")}<h3>En la billetera, no en otra app</h3>
        <p>El cliente agrega tu tarjeta a la billetera que ya usa. La barrera de instalación —donde se
        cae la mayoría de los programas de lealtad— simplemente desaparece.</p></div>
      <div class="scard">${mark("bell")}<h3>Notificaciones que llegan</h3>
        <p>Promociones y recordatorios directo a la pantalla de bloqueo, sin depender del alcance
        orgánico de una red social ni del correo que nadie abre.</p></div>
      <div class="scard">${mark("layers")}<h3>De una sucursal a una cadena</h3>
        <p>Escala desde un local único hasta operaciones multisucursal con integración al punto de
        venta. La marca en la tarjeta es la tuya, no la nuestra.</p></div>
    </div>
    <div class="hero__cta hero__cta--mt">
      <a class="btn btn--send" href="${WA}?text=Hola%2C%20quiero%20informaci%C3%B3n%20de%20Fidelix" rel="noopener" target="_blank"><span class="l">Consultar por Fidelix</span>${ARROW}</a>
    </div>
  </section>

  <section class="blk reveal" id="petix-care">
    <div class="blk__head"><p class="eyebrow">Marca 03</p><h2>Petix Care — el club <span class="grad">de las mascotas.</span></h2>
    <p>Marketplace híbrido de servicios veterinarios y de bienestar animal. Para los comercios es
    tráfico real y agenda llena; para las familias, acceso a atención médica y estética en condiciones
    de club, con recompensas por seguir cuidando bien a su mascota.</p></div>
    <div class="cards cards--2">
      <div class="scard">${mark("hand")}<h3>Para veterinarias y comercios</h3>
        <p>Motor de citas, membresías y visibilidad dentro del club. No es un directorio pasivo:
        la plataforma inyecta demanda hacia tu agenda.</p></div>
      <div class="scard">${mark("heart")}<h3>Para dueños de mascotas</h3>
        <p>Membresía con beneficios en consulta, estética y servicios asociados, con modalidad
        familiar para hogares de varias mascotas.</p></div>
    </div>
    <div class="hero__cta hero__cta--mt">
      <a class="btn btn--send" href="${WA}?text=Hola%2C%20quiero%20informaci%C3%B3n%20de%20Petix%20Care" rel="noopener" target="_blank"><span class="l">Consultar por Petix Care</span>${ARROW}</a>
    </div>
  </section>

  <section class="blk reveal">
    <div class="blk__head"><h2>Beneficios <span class="grad">cruzados.</span></h2>
    <p>Pertenecer al ecosistema no es un sello: cambia las condiciones. Quien trabaja con una de las
    marcas entra a las otras en términos preferenciales, y con un solo interlocutor respondiendo por
    todo.</p></div>
    <ul class="ticklist">
      <li><b>Del estudio a las plataformas.</b> Si trabajás con Movix Studio, tu entrada a Fidelix o Petix Care llega en condiciones preferentes desde el primer mes.</li>
      <li><b>De las plataformas al estudio.</b> Si ya operás con una de nuestras plataformas, la producción creativa entra con esas mismas condiciones.</li>
      <li><b>Por recomendar.</b> Quien trae a un colega y quien llega recomendado se benefician los dos. Nunca solo el que refiere.</li>
      <li><b>Un solo interlocutor.</b> Contenido, pauta, lealtad y automatización responden al mismo equipo. Nadie se pasa la bola entre proveedores cuando algo falla.</li>
    </ul>
    <p class="fineprint">Las condiciones exactas se confirman por escrito en tu propuesta antes de
    contratar. Ver <a href="terminos.html">términos y condiciones</a>.</p>
  </section>

  <section class="blk reveal">
    <div class="blk__head"><h2>El retorno <span class="grad">que no se factura.</span></h2>
    <p>Movix es un ecosistema diverso y sin juicios. La inclusión no es una obra de caridad para
    nosotros: es nuestra mayor fuerza creativa y una ventaja de mercado real.</p></div>
    <div class="cards">
      <div class="scard">${mark("pride")}<h3>Con orgullo, siempre</h3>
        <p>El play arcoíris no es una campaña de junio que se guarda en julio: es una variante
        permanente de la marca, y con ella patrocinamos eventos culturales e iniciativas de derechos
        humanos durante todo el año.</p></div>
      <div class="scard">${mark("hand")}<h3>Talento donde nadie busca</h3>
        <p>Programas de reclutamiento de perfiles disruptivos provenientes de zonas vulnerables. El
        talento está repartido parejo; las oportunidades no.</p></div>
      <div class="scard">${mark("spark")}<h3>Recursos liberados</h3>
        <p>Publicamos plantillas, guías y recursos gratuitos para pymes con presupuesto corto.
        Democratizar el marketing también mueve el mercado en el que trabajamos.</p></div>
    </div>
  </section>

  ${cta("","¿Con cuál de las tres <span class='grad'>empezamos?</span>","Contanos qué necesita tu negocio y te decimos honestamente cuál del ecosistema te sirve — aunque sea ninguna todavía.")}
</main>`;

/* ---------- INTAKE ----------
   El formulario por industria. Comparte brandbar, footer, tokens, tipografía,
   botones y fondo animado con el resto del sitio; su capa propia vive en
   assets/intake.css y assets/intake.js. */
const intakeBody = `
<div id="catview">
  <div class="wrap hero">
    <div class="hero__copy">
      <nav class="crumbs" aria-label="Ruta"><a href="../">Movix Studio</a><span aria-hidden="true">/</span><span aria-current="page">Brief de marca</span></nav>
      <p class="eyebrow">Un formulario. Todas las industrias.</p>
      <h1 class="hero__title">Dale play a <span class="grad">tu marca.</span><span class="caret" aria-hidden="true"></span></h1>
      <p class="hero__lead">Elegí tu categoría y arrancá. El formulario se ajusta al instante con los campos que
         tu industria realmente necesita — nada genérico, nada de más. Son unos 15 minutos, se guarda solo
         en tu dispositivo y podés retomarlo cuando querrás.</p>
    </div>
    <div class="hero__deco" id="heroDeco" aria-hidden="true">
      <span class="ring r1"></span><span class="ring r2"></span><span class="ring r3"></span>
      <span class="playbig"><svg viewBox="0 0 24 24" fill="none"><path d="M8 5v14l11-7Z" fill="currentColor"/></svg></span>
      <canvas class="play3d" id="play3d"></canvas>
    </div>
  </div>

  <div class="ticker" aria-hidden="true"><div class="ticker__track" id="tickerTrack"></div></div>

  <div class="wrap">
    <p class="catgrid__label">Elegí tu categoría</p>
    <div class="catgrid" id="catgrid" role="list"></div>

    <div class="howto">
      <div class="howto__i"><span class="howto__n">1</span><span>Elegís tu <b>categoría</b> y le das play</span></div>
      <div class="howto__i"><span class="howto__n">2</span><span>Llenás lo que aplica, <b>a tu ritmo</b></span></div>
      <div class="howto__i"><span class="howto__n">3</span><span>Lo enviás a Movix Studio <b>por WhatsApp</b></span></div>
    </div>

    <div class="intakenote">
      <p><b>¿Preferís hablar antes de llenar nada?</b> Es válido. Escribinos por
      <a href="${WA}?text=Hola%20Movix%20Studio%2C%20quiero%20info" rel="noopener" target="_blank">WhatsApp</a>,
      mirá <a href="../servicios/">qué hacemos y cómo</a>, o abrí el
      <a href="#" data-open-chat>asistente</a> — responde al instante.</p>
    </div>
  </div>
</div>

<div id="formview">
  <div class="wrap">
    <button class="backlink" id="backlink" type="button">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 5 8 12l7 7"/></svg>
      Cambiar categoría
    </button>
    <div class="formhero">
      <span class="formhero__badge">
        <span class="eq" aria-hidden="true"><i></i><i></i><i></i></span>
        <span id="fh-badge">Reproduciendo</span>
      </span>
      <h2 id="fh-title">Título</h2>
      <p id="fh-lead">Descripción.</p>
    </div>
    <div class="legend" aria-hidden="true">
      <span><i class="dot req"></i> Obligatorio — sin esto no arrancamos</span>
      <span><i class="dot imp"></i> Importante — primera semana</span>
      <span><i class="dot opt"></i> Opcional — suma, no urge</span>
    </div>
  </div>

  <nav class="toc" aria-label="Secciones"><div class="row" id="tocRow"></div></nav>

  <main class="wrap formmain" id="formmain"></main>

  <div class="actions">
    <div class="wrap">
      <div class="prog">
        <div class="prog__bar">
          <div class="prog__fill" id="fill"></div>
          <div class="prog__thumb" id="thumb"><svg viewBox="0 0 10 10" fill="none"><path d="M2.6 1.6 7.8 5 2.6 8.4Z" fill="#fff"/></svg></div>
        </div>
        <div class="prog__txt" id="progtxt">Todavía no le diste play</div>
      </div>
      <button class="btn btn--ghost" id="copy" type="button">Copiar todo</button>
      <button class="btn btn--send" id="wa" type="button">
        <span class="btn__label">Dale play y enviá a Movix Studio</span>
        <svg viewBox="0 0 10 10" fill="none"><path d="M2.6 1.6 7.8 5 2.6 8.4Z" fill="#fff"/></svg>
      </button>
      <span class="sendnote">Se envía al WhatsApp de Movix Studio · +506 7086-3466</span>
    </div>
  </div>
</div>

<div class="toast" id="toast" role="status" aria-live="polite"></div>`;

/* ---------- PRIVACIDAD ---------- */
const privacidadBody = `
<header class="hero hero--sub"><div class="wrap"><div class="hero__copy">
  <p class="eyebrow">Transparencia total</p>
  <h1>Política de privacidad, <span class="grad">cookies y datos.</span></h1>
  <p class="lead">Diseñamos este sitio con un principio simple: recolectar lo mínimo posible y que vos
  tengás el control. Acá está, sin letra pequeña, qué información se maneja y qué derechos tenés sobre
  ella conforme a la Ley N.º 8968 de Protección de la Persona frente al Tratamiento de sus Datos
  Personales de Costa Rica y su reglamento.</p>
  <p class="hero__note">Última actualización: 2 de agosto de 2026</p>
</div></div></header>
<main class="wrap">
  <section class="blk reveal"><div class="prose">
    <h3>01 · Quién es el responsable</h3>
    <p><strong>Movix Corporation S.R.L.</strong>, sociedad domiciliada en San Rafael de Escazú, San José,
    Costa Rica, es la responsable del tratamiento de los datos que decidás compartirnos, a través de sus
    marcas <strong>Movix Studio</strong>, <strong>Fidelix</strong> y <strong>Petix Care</strong>. Para
    cualquier tema de datos escribinos por WhatsApp al
    <a href="${WA}" rel="noopener" target="_blank">+506 7086-3466</a>.</p>

    <h3>02 · Cookies: no usamos</h3>
    <p>Este sitio <strong>no instala cookies</strong>, ni propias ni de terceros. Tampoco usamos píxeles
    de seguimiento, herramientas de analítica, huellas digitales del navegador ni ninguna otra tecnología
    de rastreo publicitario. Por eso no verás un banner de cookies: no hay nada que aceptar ni rechazar.</p>

    <h3>03 · Qué datos se manejan y dónde viven</h3>
    <p><strong>Al navegar el sitio:</strong> no recolectamos ningún dato personal de forma automática.
    No hay cuentas, no hay registro y no hay formularios que envíen información a servidores nuestros
    — de hecho, este sitio no tiene servidores propios ni bases de datos.</p>
    <p><strong>Al llenar el formulario de intake:</strong> lo que escribís, incluido tu logo si lo cargás,
    se guarda únicamente en el almacenamiento local de tu propio dispositivo, con un solo propósito
    funcional: que no perdás tu avance si cerrás la página. Esa información no se transmite a ningún
    servidor y nosotros no podemos verla.</p>
    <p><strong>Al presionar enviar:</strong> tu brief se convierte en un mensaje de WhatsApp que
    <strong>vos mismo enviás</strong> desde tu cuenta. Nada sale sin esa acción tuya. A partir de ahí
    aplica también la política de privacidad de WhatsApp (Meta), como en cualquier conversación de esa
    plataforma.</p>
    <p><strong>Cómo borrar tus datos locales:</strong> limpiá los datos de navegación de tu navegador para
    este sitio, o usá el botón de quitar el logo dentro del formulario. Al ser almacenamiento local, el
    borrado es inmediato y total.</p>

    <h3>04 · Para qué usamos lo que nos enviás</h3>
    <ul>
      <li>Preparar la reunión de arranque y la propuesta de trabajo para tu marca.</li>
      <li>Contactarte por los medios que vos mismo indicaste en el brief.</li>
      <li>Prestarte los servicios que contratés con Movix Studio.</li>
    </ul>
    <p>No vendemos, alquilamos ni compartimos tu información con terceros para fines publicitarios. Punto.</p>

    <h3>05 · Terceros que intervienen técnicamente</h3>
    <ul>
      <li><strong>Netlify</strong> (hosting y CDN): sirve las páginas de este sitio. Como todo proveedor de
      infraestructura, puede registrar datos técnicos de conexión —como la dirección IP— en sus bitácoras
      de servidor, bajo su propia política de privacidad.</li>
      <li><strong>WhatsApp (Meta)</strong>: interviene únicamente cuando vos decidís enviarnos tu brief o
      escribirnos, bajo sus propios términos.</li>
    </ul>
    <p>Ningún otro tercero recibe información desde este sitio: la política de seguridad de contenido
    bloquea técnicamente las conexiones a dominios externos.</p>

    <h3>06 · Tus derechos</h3>
    <p>Conforme a la Ley 8968 tenés derecho a <strong>acceder</strong> a los datos que nos hayás enviado,
    <strong>rectificarlos</strong>, <strong>actualizarlos</strong> y pedir su <strong>supresión</strong>,
    así como a revocar tu consentimiento en cualquier momento. Escribinos por WhatsApp y lo resolvemos
    directamente, sin formularios eternos ni esperas. También podés acudir a la <strong>Agencia de
    Protección de Datos de los Habitantes (PRODHAB)</strong> si considerás que tus datos fueron tratados
    indebidamente.</p>

    <h3>07 · Seguridad</h3>
    <p>El sitio se sirve exclusivamente por HTTPS con HSTS, con una política de contenido estricta que
    impide la ejecución de scripts inyectados, protección contra clickjacking y una Permissions-Policy
    que niega el acceso a cámara, micrófono y ubicación. Al no existir base de datos ni cuentas de
    usuario, la superficie de ataque para robo de datos personales es mínima por diseño. El detalle
    control por control está en la <a href="seguridad.html">página de seguridad</a>.</p>

    <h3>08 · Menores de edad</h3>
    <p>Nuestros servicios están dirigidos a negocios y personas mayores de edad. No recolectamos
    deliberadamente datos de menores; si creés que un menor nos envió información, escribinos y la
    eliminamos.</p>

    <h3>09 · Relación con los términos y condiciones</h3>
    <p>Esta política se complementa con los <a href="terminos.html">términos y condiciones</a>, que rigen
    la contratación de los servicios. Ante cualquier duda sobre el tratamiento de datos, manda la
    presente política.</p>

    <h3>10 · Cambios a esta política</h3>
    <p>Si esta política cambia, publicaremos la versión nueva en esta misma página con su fecha de
    actualización. Los cambios nunca reducirán retroactivamente la protección de los datos que ya nos
    hayás enviado.</p>
  </div></section>
  ${cta("","¿Dudas sobre <span class='grad'>tus datos?</span>","Escribinos y te respondemos con nombre y apellido — no con un formulario automático.")}
</main>`;

/* ---------- SEGURIDAD ---------- */
const seguridadBody = `
<header class="hero hero--sub"><div class="wrap"><div class="hero__copy">
  <p class="eyebrow">Confianza y seguridad</p>
  <h1>Tu marca en manos <span class="grad">que la cuidan.</span></h1>
  <p class="lead">La seguridad no es una promesa de brochure: es una configuración que se puede verificar.
  Esto es exactamente cómo está blindada la plataforma de Movix Studio — y por qué tus datos y los de
  tus clientes están mejor acá que en la mayoría de sitios de agencia.</p>
  <div class="hero__cta">
    <a class="btn btn--send" href="intake/"><span class="l">Empezar mi brief</span>${ARROW}</a>
    <a class="btn btn--ghost" href="privacidad.html">Ver política de datos</a>
  </div>
</div></div></header>
<main class="wrap">

  <section class="blk reveal">
    <div class="blk__head"><h2>Cuatro capas, <span class="grad">sin puntos ciegos.</span></h2>
    <p>Cada capa cierra un tipo distinto de riesgo. Juntas eliminan las vías de ataque más comunes
    contra sitios de marca: inyección de scripts, secuestro de sesión, suplantación por iframe y fuga
    de datos hacia terceros.</p></div>
    <div class="cards cards--2">
      <div class="scard">${mark("lock")}<h3>Transporte cifrado de extremo a extremo</h3>
        <p>Servido exclusivamente sobre TLS con <strong>Perfect Forward Secrecy</strong>: cada sesión
        negocia su propia clave efímera, así que comprometer una no expone el tráfico pasado.
        <strong>HSTS</strong> con dos años de vigencia y directiva <em>preload</em> hace que el navegador
        rechace por sí solo cualquier intento de conexión sin cifrar, incluso antes de la primera
        petición.</p></div>
      <div class="scard">${mark("shield")}<h3>Content Security Policy de denegación por defecto</h3>
        <p>La política arranca en <code>default-src 'none'</code>: nada se carga salvo lo que está
        explícitamente permitido. <strong>No existe código en línea</strong>: todo el JavaScript y el
        CSS vive en archivos propios del sitio, así que un script inyectado en el HTML —aunque logre
        llegar ahí— simplemente no se ejecuta. Sin <em>eval</em>, sin <em>unsafe-inline</em>, sin
        orígenes comodín, sin una sola dependencia de terceros.</p></div>
      <div class="scard">${mark("scan")}<h3>Análisis continuo de código</h3>
        <p>Cada cambio pasa por <strong>Snyk Code</strong> (análisis estático de seguridad) y por un
        verificador propio que revisa página por página que nadie haya reintroducido código en línea,
        un recurso externo o una directiva debilitada — y falla la compilación si lo encuentra. Ese
        mismo verificador bloquea la publicación si detecta información corporativa que no debe ser
        pública. Los resultados de Snyk se publican en formato <strong>SARIF</strong>
        dentro del panel de seguridad del repositorio. Además corre un barrido programado cada semana,
        para detectar vulnerabilidades descubiertas después del despliegue.</p></div>
      <div class="scard">${mark("globe")}<h3>Superficie de ataque mínima por diseño</h3>
        <p>No hay base de datos, no hay cuentas de usuario, no hay sesiones, no hay backend propio.
        Lo que no existe no se puede vulnerar: no hay credenciales que robar ni tablas que filtrar.
        Es la decisión de arquitectura que más seguridad aporta, y la tomamos desde el primer día.</p></div>
    </div>
  </section>

  <section class="blk reveal">
    <div class="blk__head"><h2>Controles activos, <span class="grad">uno por uno.</span></h2>
    <p>Todo lo de esta lista está aplicado en producción ahora mismo. Se puede comprobar desde
    cualquier navegador abriendo las herramientas de desarrollo, pestaña de red, cabeceras de respuesta.</p></div>
    <ul class="ticklist">
      <li><strong>Strict-Transport-Security</strong> — 63 072 000 s, <em>includeSubDomains</em>, <em>preload</em>.</li>
      <li><strong>Content-Security-Policy</strong> — <em>default-src 'none'</em>; <em>script-src</em> y <em>style-src</em> solo <em>'self'</em>, sin <em>unsafe-inline</em> ni <em>eval</em>; <em>connect-src</em> restringido al propio origen.</li>
      <li><strong>X-Frame-Options: DENY</strong> y <strong>frame-ancestors 'none'</strong> — doble barrera contra <em>clickjacking</em>.</li>
      <li><strong>X-Content-Type-Options: nosniff</strong> — impide que el navegador reinterprete un archivo como código.</li>
      <li><strong>Referrer-Policy</strong> — <em>strict-origin-when-cross-origin</em>: no se filtran rutas internas a sitios externos.</li>
      <li><strong>Permissions-Policy</strong> — cámara, micrófono, geolocalización, pagos, USB, sensores y sincronización en segundo plano: todo denegado.</li>
      <li><strong>Cross-Origin-Opener-Policy</strong> y <strong>Resource-Policy</strong> — aislamiento del contexto de navegación frente a ventanas y recursos de otros orígenes.</li>
      <li><strong>form-action 'none'</strong> y <strong>base-uri 'none'</strong> — ningún formulario puede ser redirigido a un destino ajeno.</li>
      <li><strong>object-src 'none'</strong> — sin plugins ni objetos incrustados heredados.</li>
      <li><strong>upgrade-insecure-requests</strong> — cualquier recurso solicitado en claro se eleva a cifrado automáticamente.</li>
      <li><strong>Tipografías y recursos autoalojados</strong> — <em>font-src 'self'</em>: ni una sola petición sale hacia una CDN de terceros.</li>
      <li><strong>Cero cookies, cero rastreadores</strong> — sin analítica, sin píxeles, sin huella digital del navegador.</li>
    </ul>
  </section>

  <section class="blk reveal">
    <div class="blk__head"><h2>Qué pasa con <span class="grad">lo que nos contás.</span></h2></div>
    <div class="steps">
      <div class="step"><span class="step__n">01</span><h3>Se queda en tu equipo</h3>
        <p>Mientras llenás el brief, tus respuestas y tu logo viven únicamente en el almacenamiento local
        de tu propio dispositivo, con un solo fin: que no perdás el avance. Nunca viajan a un servidor nuestro.</p></div>
      <div class="step"><span class="step__n">02</span><h3>Vos decidís cuándo se envía</h3>
        <p>Al presionar enviar, el brief se convierte en un mensaje de WhatsApp que sale desde tu propia
        cuenta, cifrado de extremo a extremo por la plataforma. Sin esa acción tuya, no se transmite nada.</p></div>
      <div class="step"><span class="step__n">03</span><h3>Se usa solo para atenderte</h3>
        <p>Preparar tu propuesta, contactarte por los canales que vos indicaste y prestarte el servicio.
        No se vende, no se alquila y no se comparte con terceros para publicidad. Nunca.</p></div>
      <div class="step"><span class="step__n">04</span><h3>Lo borrás cuando querás</h3>
        <p>Al ser almacenamiento local, el borrado es inmediato y total. Y conforme a la Ley N.º 8968,
        podés pedirnos acceso, rectificación o supresión de lo que ya nos hayás enviado — por WhatsApp,
        sin trámites eternos.</p></div>
    </div>
  </section>

  <section class="blk reveal">
    <div class="blk__head"><h2>Preguntas <span class="grad">directas.</span></h2></div>
    <details class="faq"><summary>¿Esto aplica también a los sitios que ustedes construyen?</summary><p>Sí. La misma línea base de seguridad — cabeceras estrictas, política de contenido sin código en línea, cifrado en tránsito y análisis estático en cada despliegue — es la que aplicamos a los sitios que desarrollamos para clientes. No es un extra que se cobra aparte: es el estándar mínimo del estudio.</p></details>
    <details class="faq"><summary>¿Tienen WAF y protección contra denegación de servicio?</summary><p>La plataforma se sirve desde una CDN global con mitigación de tráfico anómalo en el borde. Para marcas con dominio propio y perfil de riesgo alto configuramos además un firewall de aplicación con reglas gestionadas, limitación de tasa y filtrado por reputación de origen. Se define en la propuesta según lo que el proyecto realmente necesite.</p></details>
    <details class="faq"><summary>¿Manejan accesos a mis cuentas de redes o publicidad?</summary><p>Trabajamos siempre por delegación de permisos, nunca con tu contraseña: vos nos das acceso desde el administrador de tu propia cuenta y lo revocás cuando querrás. La propiedad de perfiles, píxeles y cuentas publicitarias es tuya desde el primer día y queda por escrito.</p></details>
    <details class="faq"><summary>¿Cómo puedo verificar lo que dice esta página?</summary><p>Abrí las herramientas de desarrollo del navegador en cualquier página de este sitio, mirá las cabeceras de respuesta y compará. También podés analizar el dominio con cualquier evaluador público de cabeceras de seguridad. Preferimos que lo compruebes a que nos creás.</p></details>
    <details class="faq"><summary>Encontré algo que parece una vulnerabilidad, ¿a quién le escribo?</summary><p>Escribinos por WhatsApp al +506 7086-3466 con el detalle. Agradecemos los reportes responsables y respondemos rápido — preferimos enterarnos por vos que por un incidente.</p></details>
  </section>

  ${cta("","¿Listo para trabajar con un estudio <span class='grad'>que se toma esto en serio?</span>","La misma rigurosidad con la que blindamos esta plataforma es la que le ponemos a tu marca.")}
</main>`;

/* ---------- CONTACTO ---------- */
const contactoBody = `
<header class="hero hero--sub"><div class="wrap"><div class="hero__copy">
  <p class="eyebrow">Centro de contacto</p>
  <h1>Hablemos — por el canal <span class="grad">que prefirás.</span></h1>
  <p class="lead">Tres caminos, cero fricción. El asistente y el brief funcionan 24/7; el equipo humano
  responde por WhatsApp en horario hábil de Costa Rica.</p>
</div></div></header>
<main class="wrap">
  <section class="blk reveal">
    <div class="contactgrid">
      <div class="ccard"><h3>WhatsApp directo</h3>
        <p>El canal más rápido para hablar con una persona del equipo. Consultas, cotizaciones y soporte de proyectos activos.</p>
        <a class="btn btn--send" href="${WA}?text=Hola%20Movix%20Studio" rel="noopener" target="_blank"><span class="l">+506 7086-3466</span>${ARROW}</a></div>
      <div class="ccard"><h3>Brief de marca</h3>
        <p>¿Querés arrancar un proyecto? El intake es el camino corto: 15 minutos y llegás a la primera reunión con propuesta sobre la mesa.</p>
        <a class="btn btn--ghost" href="intake/">Llenar el brief</a></div>
      <div class="ccard"><h3>Soporte en línea</h3>
        <p>El asistente guiado responde al instante las preguntas frecuentes: servicios, precios, cómo empezar. Disponible 24/7 en todo el sitio.</p>
        <a class="btn btn--ghost" href="#" data-open-chat>Abrir el asistente</a></div>
    </div>
  </section>
  <section class="blk reveal">
    <div class="blk__head"><h2>Antes de escribir, <span class="grad">tal vez esto ayuda.</span></h2></div>
    <details class="faq"><summary>¿Trabajan con paquetes cerrados?</summary><p>No. Un paquete de menú obliga a que tu marca se acomode a una lista; nosotros hacemos lo contrario. Estudiamos tu negocio y diseñamos el alcance que necesita — ni una pieza de más para inflar la factura, ni una de menos para que no funcione. Lo que sí es fijo es que sepás exactamente qué incluye y qué no, por escrito, antes de empezar.</p></details>
    <details class="faq"><summary>¿Trabajan con negocios fuera de Costa Rica?</summary><p>Sí. La operación es remota por diseño; producimos en Costa Rica y gestionamos marcas de cualquier país de habla hispana.</p></details>
    <details class="faq"><summary>¿Qué tan rápido responden?</summary><p>El asistente y el brief, al instante, a cualquier hora. El equipo humano responde por WhatsApp en horario hábil de Costa Rica — y si llenaste el brief, la primera respuesta llega con propuesta incluida.</p></details>
    <details class="faq"><summary>¿Cómo manejan mis datos?</summary><p>Con la misma seriedad que este sitio: sin cookies, sin rastreadores, y tu información solo se usa para atenderte. El detalle completo está en la <a href="privacidad.html">política de privacidad</a> y en los <a href="terminos.html">términos y condiciones</a>.</p></details>
    <details class="faq"><summary>¿Con quién estoy contratando exactamente?</summary><p>Con <b>Movix Corporation S.R.L.</b>, sociedad costarricense domiciliada en San Rafael de Escazú. Movix Studio es su marca de servicios creativos; el mismo grupo opera las plataformas Fidelix y Petix Care. El detalle está en <a href="ecosistema.html">el ecosistema</a>.</p></details>
    <details class="faq"><summary>¿Quién es dueño de mis cuentas y del material?</summary><p>Vos. Trabajamos por delegación de permisos, nunca con tus contraseñas, y la titularidad de perfiles, píxeles y cuentas publicitarias es tuya desde el primer día. El material aprobado se te cede para uso pleno de tu marca. Está por escrito en los <a href="terminos.html">términos</a>.</p></details>
  </section>
  <section class="blk reveal">
    <div class="blk__head"><h2>Dónde <span class="grad">estamos.</span></h2></div>
    <div class="contactgrid">
      <div class="ccard"><h3>Movix Corporation S.R.L.</h3>
        <p>San Rafael de Escazú, San José, Costa Rica.</p>
        <p>La operación es remota por diseño: producimos en Costa Rica y gestionamos marcas de cualquier país de habla hispana. Las reuniones presenciales se coordinan por agenda.</p></div>
      <div class="ccard"><h3>Horario de atención</h3>
        <p>El equipo humano responde por WhatsApp en horario hábil de Costa Rica (GMT-6).</p>
        <p>El asistente en línea y el brief funcionan 24/7, todos los días del año.</p></div>
      <div class="ccard"><h3>Temas legales y de datos</h3>
        <p>Solicitudes de acceso, rectificación o supresión de datos, y reportes de seguridad: por el mismo WhatsApp, y los atendemos directamente.</p>
        <p><a href="terminos.html">Términos y condiciones</a> · <a href="privacidad.html">Privacidad</a> · <a href="seguridad.html">Seguridad</a></p></div>
    </div>
  </section>
  ${cta("")}
</main>`;

/* ---------- escribir archivos ---------- */
const OUT = __dirname;
function write(rel, html){
  const f = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
  console.log("✓", rel);
}
write("index.html", page({root:"./", title:"Movix Studio — Dale play a tu marca", desc:"Agencia de marketing en Costa Rica: social media, contenido y video, pauta digital, branding, sitios web e IA aplicada a vender.", body:homeBody}));
write("servicios/index.html", page({root:"../", title:"Servicios — Movix Studio", desc:"Social media integral, contenido y video, pauta digital, branding, sitios web e IA y automatizaciones. Así trabaja Movix Studio.", body:svcIndexBody}));
SERVICES.forEach(s=>{
  write(`servicios/${s.slug}.html`, page({root:"../", title:`${s.name} — Movix Studio`, desc:s.short, body:serviceBody(s)}));
});
write("nosotros.html", page({root:"./", title:"Nosotros — Movix Studio", desc:"Movix viene de movimiento: una agencia costarricense guiada por evidencia, transparencia y un espacio libre para crear.", body:nosotrosBody}));
write("blog/index.html", page({root:"../", title:"Blog — Movix Studio", desc:"Ideas del estudio: estrategia, ventas por WhatsApp e inteligencia artificial aplicada, sin humo.", body:blogIndexBody}));
POSTS.forEach(p=>{
  write(`blog/${p.slug}.html`, page({root:"../", title:`${p.title} — Movix Studio`, desc:p.excerpt, body:postBody(p)}));
});
write("soporte.html", page({root:"./", title:"Soporte — Movix Studio", desc:"Asistente 24/7, equipo humano por WhatsApp y la base de conocimiento de Movix Studio.", body:soporteBody}));
write("ecosistema.html", page({root:"./", title:"Ecosistema — Movix Corporation S.R.L.", desc:"Movix Studio, Fidelix y Petix Care: el motor creativo y las plataformas propias de Movix Corporation S.R.L., Costa Rica.", body:ecosistemaBody}));
write("inclusion.html", page({root:"./", title:"Inclusión — Movix Studio", desc:"Con orgullo, siempre: la variante Pride permanente, estándares de accesibilidad, representación en la producción y acceso al talento.", body:inclusionBody}));
write("terminos.html", page({root:"./", title:"Términos y condiciones — Movix Studio", desc:"Marco contractual de Movix Corporation S.R.L.: alcance, propiedad intelectual, uso de IA, accesos, pagos y ley aplicable en Costa Rica.", body:terminosBody}));
write("intake/index.html", page({root:"../", title:"Brief de marca — Movix Studio", tag:"Brief de marca",
  desc:"Contanos tu marca en 15 minutos: el brief se adapta a tu industria y nos llega directo por WhatsApp.",
  css:["intake.css"], js:["intake.js"], body:intakeBody}));
write("privacidad.html", page({root:"./", title:"Privacidad y datos — Movix Studio", desc:"Política de privacidad, cookies y datos de Movix Studio: sin cookies, sin rastreadores, conforme a la Ley 8968 de Costa Rica.", body:privacidadBody}));
write("seguridad.html", page({root:"./", title:"Seguridad — Movix Studio", desc:"Cifrado en tránsito, política de contenido de denegación por defecto, análisis continuo de código y cero rastreadores. Así está blindada la plataforma de Movix Studio.", body:seguridadBody}));
write("contacto.html", page({root:"./", title:"Contacto — Movix Studio", desc:"WhatsApp directo, brief de marca y soporte en línea 24/7. Hablemos por el canal que prefirás.", body:contactoBody}));
console.log("Listo.");
