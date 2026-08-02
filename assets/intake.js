/* MOVIX STUDIO — Intake de marca. Comportamiento del formulario por industria.
   El fondo de lava, las brasas, el play 3D y el ticker viven en site.js. */
(function(){
  "use strict";

  /* ============================================================
     TILT 3D — las tarjetas de categoría se inclinan con el cursor
     ============================================================ */
  function wireTilt(card){
    if(!window.matchMedia||matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if("ontouchstart" in window) return;
    card.addEventListener("pointermove",function(e){
      var r=card.getBoundingClientRect();
      var px=(e.clientX-r.left)/r.width-0.5;
      var py=(e.clientY-r.top)/r.height-0.5;
      card.classList.add("tilting");
      card.style.transform="translateY(-3px) scale(1.015) rotateX("+(-py*7).toFixed(2)+"deg) rotateY("+(px*9).toFixed(2)+"deg)";
    });
    card.addEventListener("pointerleave",function(){
      card.classList.remove("tilting");
      card.style.transform="";
    });
  }

  /* ============================================================
     ICONOS — trazos geométricos simples, sin librerías externas
     ============================================================ */
  var ICON = {
    compass:'<circle cx="12" cy="12" r="8.4"/><path d="m14.4 9.6-1.6 4.8-4.8 1.6 1.6-4.8Z"/>',
    plate:'<circle cx="12" cy="12" r="8.4"/><circle cx="12" cy="12" r="4"/>',
    shield:'<path d="M12 3.5 19 6v5.2c0 4.6-3 7.7-7 9.3-4-1.6-7-4.7-7-9.3V6Z"/>',
    nodes:'<circle cx="6" cy="17" r="1.9"/><circle cx="18" cy="17" r="1.9"/><circle cx="12" cy="6.5" r="1.9"/><path d="M7.5 15.6 10.6 8.3M16.5 15.6 13.4 8.3M8 17h8"/>',
    cross:'<circle cx="12" cy="12" r="8.4"/><path d="M12 8.4v7.2M8.4 12h7.2"/>',
    bag:'<path d="M7 8h10l1 12H6Z"/><path d="M9 8a3 3 0 0 1 6 0"/>',
    home:'<path d="M4 11 12 4l8 7"/><path d="M6 10.5V20h12v-9.5"/>',
    layers:'<path d="m12 4 8 4.2-8 4.2-8-4.2Z"/><path d="m4 12.8 8 4.2 8-4.2"/><path d="m4 16.8 8 4.2 8-4.2"/>',
    plus:'<circle cx="12" cy="12" r="8.4"/><path d="M12 8v8M8 12h8"/>'
  };
  function markSvg(key){
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" '+
      'stroke-linecap="round" stroke-linejoin="round">'+ICON[key]+'</svg>';
  }

  /* ============================================================
     CATEGORÍAS
     ============================================================ */
  function T(label,key,ph){return {t:"text",prio:"req",label:label,key:key,ph:ph};}
  function Ti(label,key,ph){return {t:"text",prio:"imp",label:label,key:key,ph:ph};}
  function To(label,key,ph){return {t:"text",prio:"opt",label:label,key:key,ph:ph};}
  function Wr(label,key,prio){return {t:"textarea",prio:prio||"req",label:label,key:key,wide:true};}
  function Ph(label,key,prio){return {t:"phone",prio:prio||"req",label:label,key:key};}
  function Num(label,key,prio){return {t:"number",prio:prio||"req",label:label,key:key};}
  function Price(label,key,prio){return {t:"price",prio:prio||"req",label:label,key:key};}
  function Soc(label,key,ph){return {t:"text",prio:"req",label:label,key:key,ph:ph,social:true};}
  function SocI(label,key,ph){return {t:"text",prio:"imp",label:label,key:key,ph:ph,social:true};}

  var CATS = [
    {
      id:"turismo", name:"Turismo y experiencias", mark:"compass",
      desc:"Tours, hospedaje, aventura y traslados.",
      badge:"Turismo y experiencias",
      title:"Arranquemos tu marca de turismo.",
      lead:"Lo que necesitamos para vender tus experiencias: quién sos, dónde operás, tus permisos y cada paquete que ofrecés.",
      core:{
        title:"Operación turística", num:"05",
        lead:"Dónde encontrás al viajero y qué papeles tenés al día.",
        fields:[
          T("Dirección exacta del punto de encuentro","Punto de encuentro"),
          T("Link de Google Maps","Google Maps"),
          Ti("¿Recogen en hotel? ¿Zonas sin costo?","Recogida en hotel"),
          Ti("Traslados desde aeropuerto","Traslado aeropuerto"),
          To("Guías, idiomas y capacidad por día","Guías y capacidad")
        ],
        checks:[
          "Cédula jurídica y patente al día","Guías con carné vigente","Póliza de responsabilidad civil",
          "Declaratoria Turística (ICT)","Vehículos con placa TE","Permisos de parques nacionales"
        ]
      },
      repeat:{
        title:"Tus paquetes o tours", singular:"Paquete", num:"06",
        lead:"Uno por cada tour. Agregá los que necesités.",
        fields:[
          T("Nombre del tour","Nombre"),
          T("Destinos exactos","Destinos"),
          T("Duración puerta a puerta","Duración","Ej: 6 horas"),
          Price("Precio por persona","Precio"),
          Ti("Precio niño y edades","Precio niño"),
          Ti("Mínimo y máximo de personas","Mín-máx"),
          Wr("Qué incluye","Incluye"),
          Wr("Qué NO incluye","No incluye"),
          T("Días que opera","Días"),
          T("Qué pasa si llueve","Si llueve")
        ]
      }
    },
    {
      id:"restaurantes", name:"Restaurantes y gastronomía", mark:"plate",
      desc:"Cocina, cafeterías, bares y delivery.",
      badge:"Restaurantes y gastronomía",
      title:"Arranquemos tu marca gastronómica.",
      lead:"Lo que necesitamos para llenar tus mesas: tu concepto, tu operación y cada platillo o menú que querés destacar.",
      core:{
        title:"Operación del local", num:"05",
        lead:"Cómo recibís al comensal y por dónde también lo vendés.",
        fields:[
          T("Dirección del local","Dirección"),
          T("Horario de servicio","Horario","L–V ___ · Sáb ___ · Dom ___"),
          Ti("¿Toman reservas? ¿Por dónde?","Reservas"),
          Ti("Aforo aproximado","Aforo"),
          Ti("Apps de delivery en las que están","Apps de delivery"),
          To("Concepto o historia detrás de la cocina","Concepto")
        ],
        checks:[
          "Patente municipal y permiso de salud","Permiso de licores (si aplica)","Facturación electrónica",
          "Fotos profesionales del menú","Menú con precios actualizado","Certificación de manipulación de alimentos"
        ]
      },
      repeat:{
        title:"Tu menú o platillos estrella", singular:"Platillo", num:"06",
        lead:"Los platillos o combos que más querés vender. Agregá los que necesités.",
        fields:[
          T("Nombre del platillo","Nombre"),
          T("Descripción corta","Descripción"),
          Price("Precio","Precio"),
          Ti("Categoría","Categoría","Entrada, fuerte, postre, bebida…"),
          Ti("Restricciones o alérgenos","Alérgenos"),
          Wr("Qué lo hace diferente","Diferenciador","opt")
        ]
      }
    },
    {
      id:"financiero", name:"Financiero y seguros", mark:"shield",
      desc:"Banca, seguros, inversión y crédito.",
      badge:"Financiero y seguros",
      title:"Arranquemos tu marca financiera.",
      lead:"Lo que necesitamos para comunicar con la seriedad que exige el sector: tus productos, tus licencias y a quién le hablás.",
      core:{
        title:"Marco regulatorio y producto", num:"05",
        lead:"Este sector se rige por reglas estrictas de qué se puede prometer.",
        fields:[
          T("Entidad reguladora y número de registro","Regulador","SUGEF, SUGEVAL, SUGESE…"),
          T("Público objetivo","Público objetivo","Personas, pymes, corporativo…"),
          Ti("Canales de venta actuales","Canales de venta"),
          Ti("¿Quién aprueba legalmente cada pieza de comunicación?","Aprobación legal"),
          To("Alianzas o representaciones de marca","Alianzas")
        ],
        checks:[
          "Licencia vigente ante el regulador","Términos y condiciones aprobados por legal",
          "Política de tratamiento de datos","Tarifario o cotizador actualizado"
        ]
      },
      repeat:{
        title:"Tus productos financieros", singular:"Producto", num:"06",
        lead:"Uno por cada producto o plan. Agregá los que necesités.",
        fields:[
          T("Nombre del producto","Nombre","Crédito, póliza, fondo…"),
          Wr("A quién está dirigido","Dirigido a"),
          Wr("Beneficio principal, en una frase","Beneficio"),
          T("Tasa, prima o costo","Costo"),
          Ti("Requisitos para aplicar","Requisitos"),
          Wr("Restricciones o letra pequeña relevante","Restricciones")
        ]
      }
    },
    {
      id:"tecnologia", name:"Tecnología y software", mark:"nodes",
      desc:"SaaS, apps, plataformas y productos digitales.",
      badge:"Tecnología y software",
      title:"Arranquemos tu marca de producto.",
      lead:"Lo que necesitamos para posicionar tu plataforma: qué resuelve, para quién y cómo se compra.",
      core:{
        title:"El producto", num:"05",
        lead:"Cómo funciona tu negocio digital, sin tecnicismos internos.",
        fields:[
          T("¿Qué problema resuelve tu producto?","Problema que resuelve"),
          T("Modelo de negocio","Modelo","Suscripción, licencia, freemium…"),
          T("Público objetivo","Público objetivo","Desarrolladores, pymes, consumidor final…"),
          Ti("Plataformas o integraciones clave","Integraciones"),
          To("Próximas funciones a comunicar","Roadmap a comunicar")
        ],
        checks:[
          "Demo o video del producto disponible","Landing page o sitio activo",
          "Planes y precios definidos","Casos de uso documentados"
        ]
      },
      repeat:{
        title:"Tus planes o módulos", singular:"Plan", num:"06",
        lead:"Uno por cada plan o módulo que vendés. Agregá los que necesités.",
        fields:[
          T("Nombre del plan o módulo","Nombre"),
          Wr("Qué incluye","Incluye"),
          Price("Precio mensual","Precio"),
          Ti("Límites o cuotas","Límites"),
          To("Público ideal para este plan","Público ideal")
        ]
      }
    },
    {
      id:"salud", name:"Salud y bienestar", mark:"cross",
      desc:"Clínicas, consultorios, spa y fitness.",
      badge:"Salud y bienestar",
      title:"Arranquemos tu marca de salud.",
      lead:"Lo que necesitamos respetando las reglas de publicidad del sector: tus servicios, tu equipo y cómo se agenda una cita.",
      core:{
        title:"Práctica y agenda", num:"05",
        lead:"Cómo opera la consulta o el centro, de puertas para adentro.",
        fields:[
          T("Dirección del consultorio o centro","Dirección"),
          T("Horario de atención","Horario"),
          Ti("¿Cómo se agenda una cita?","Agenda de citas"),
          Ti("Seguros o aseguradoras que aceptan","Seguros aceptados"),
          To("Equipo: profesionales y especialidades","Equipo profesional")
        ],
        checks:[
          "Incorporado al colegio profesional correspondiente","Permiso sanitario del Ministerio de Salud",
          "Consentimientos informados listos","Restricciones de publicidad médica revisadas"
        ]
      },
      repeat:{
        title:"Tus servicios o especialidades", singular:"Servicio", num:"06",
        lead:"Uno por cada servicio o tratamiento. Agregá los que necesités.",
        fields:[
          T("Nombre del servicio","Nombre"),
          Wr("En qué consiste","Descripción"),
          T("Duración de la sesión","Duración"),
          Price("Precio","Precio"),
          Ti("Profesional a cargo","Profesional a cargo")
        ]
      }
    },
    {
      id:"retail", name:"Retail y e-commerce", mark:"bag",
      desc:"Tienda física, online o ambas.",
      badge:"Retail y e-commerce",
      title:"Arranquemos tu marca de retail.",
      lead:"Lo que necesitamos para vender tu catálogo: dónde estás, cómo despachás y qué productos empujar primero.",
      core:{
        title:"Operación de venta", num:"05",
        lead:"Cómo compra hoy tu cliente y qué tan rápido lo atendés.",
        fields:[
          T("Canal de venta","Canal de venta","Tienda física, online, ambos"),
          Ti("Dirección de la tienda (si aplica)","Dirección de tienda"),
          Ti("Zonas y tiempos de envío","Envíos"),
          Ti("Medios de pago que aceptan","Medios de pago"),
          To("Plataforma de e-commerce actual","Plataforma actual")
        ],
        checks:[
          "Catálogo con fotos profesionales","Facturación electrónica",
          "Política de cambios y devoluciones","Inventario sincronizado entre canales"
        ]
      },
      repeat:{
        title:"Tu catálogo destacado", singular:"Producto", num:"06",
        lead:"Los productos que más querés empujar. Agregá los que necesités.",
        fields:[
          T("Nombre del producto","Nombre"),
          Price("Precio","Precio"),
          Ti("Variantes","Variantes","Talla, color, presentación…"),
          Wr("Qué lo hace tu producto estrella","Por qué destacarlo","opt")
        ]
      }
    },
    {
      id:"inmobiliaria", name:"Bienes raíces", mark:"home",
      desc:"Venta, alquiler y desarrollos.",
      badge:"Bienes raíces",
      title:"Arranquemos tu marca inmobiliaria.",
      lead:"Lo que necesitamos para vender confianza y propiedades: tu cobertura, tus servicios y cada listado activo.",
      core:{
        title:"Cobertura y servicios", num:"05",
        lead:"Dónde operás y qué tipo de negocio hacés.",
        fields:[
          T("Zonas donde operan","Zonas"),
          T("Tipo de servicio","Tipo de servicio","Venta, alquiler, administración…"),
          Ti("¿Ofrecen financiamiento o gestión bancaria?","Financiamiento"),
          To("Tamaño del equipo de agentes","Equipo de agentes")
        ],
        checks:[
          "Incorporado a la cámara o colegio correspondiente","Contratos de corretaje listos",
          "Fotos y planos profesionales por propiedad","Tour virtual disponible"
        ]
      },
      repeat:{
        title:"Tus propiedades activas", singular:"Propiedad", num:"06",
        lead:"Una por cada listado que querés promover ya. Agregá las que necesités.",
        fields:[
          T("Nombre o dirección de la propiedad","Propiedad"),
          T("Tipo","Tipo","Casa, apto, lote, comercial…"),
          Price("Precio","Precio"),
          Ti("Metros cuadrados y habitaciones","Metros y habitaciones"),
          Wr("Qué la hace única","Diferenciador")
        ]
      }
    },
    {
      id:"b2b", name:"B2B y servicios profesionales", mark:"layers",
      desc:"Consultoría, agencias y servicios a empresas.",
      badge:"B2B y servicios profesionales",
      title:"Arranquemos tu marca B2B.",
      lead:"Lo que necesitamos para venderle a otras empresas: tu propuesta de valor, tu prueba social y tu ciclo de venta.",
      core:{
        title:"Propuesta y ciclo de venta", num:"05",
        lead:"Cómo decide comprar tu cliente y cuánto tarda en decidirse.",
        fields:[
          Wr("Problema que resuelve tu servicio","Problema que resuelve"),
          T("Sector de tus clientes ideales","Sector de clientes"),
          Ti("Duración típica del ciclo de venta","Ciclo de venta"),
          Ti("Canal principal de prospección","Prospección","LinkedIn, referidos, licitaciones…"),
          To("Clientes o marcas que pueden mencionarse como referencia","Referencias mencionables")
        ],
        checks:[
          "Casos de éxito documentados","Propuesta comercial o deck actualizado",
          "Testimonios en video o escritos","Perfil de LinkedIn de la empresa activo"
        ]
      },
      repeat:{
        title:"Tus servicios", singular:"Servicio", num:"06",
        lead:"Uno por cada servicio o línea que ofrecés. Agregá los que necesités.",
        fields:[
          T("Nombre del servicio","Nombre"),
          Wr("En qué consiste","Descripción"),
          Ti("Modelo de cobro","Modelo de cobro","Por proyecto, retainer, por hora…"),
          To("Rango de inversión típico","Rango de inversión")
        ]
      }
    },
    {
      id:"otro", name:"Otra categoría", mark:"plus",
      desc:"Tu negocio no calza en las anteriores.",
      badge:"Categoría personalizada",
      title:"Arranquemos tu marca.",
      lead:"Contanos en tus palabras a qué se dedica tu negocio y armamos el resto de la conversación juntos.",
      core:{
        title:"Tu negocio, en tus palabras", num:"05",
        lead:"Sin categoría predefinida — esto lo cubre todo.",
        fields:[
          T("¿A qué se dedica tu negocio?","Descripción del negocio"),
          T("Público objetivo","Público objetivo"),
          Ti("Principal competencia o referencia","Competencia"),
          To("Algo más que debamos saber","Notas adicionales")
        ],
        checks:[]
      },
      repeat:{
        title:"Tus productos o servicios", singular:"Producto o servicio", num:"06",
        lead:"Uno por cada producto o servicio. Agregá los que necesités.",
        fields:[
          T("Nombre","Nombre"),
          Wr("Descripción","Descripción"),
          Price("Precio","Precio","imp")
        ]
      }
    }
  ];

  /* ============================================================
     SECCIONES BASE — comunes a toda categoría
     ============================================================ */
  function BASE(){
    return [
      {title:"Sobre vos", num:"01",
        lead:"Quién nos escribe y cómo seguimos la conversación. Es lo primero que leemos cuando llega tu brief.",
        fields:[
          T("Tu nombre completo","Nombre de contacto"),
          Ti("Tu puesto o rol en el negocio","Rol","Dueño, gerente, mercadeo…"),
          Ph("Tu WhatsApp directo","WhatsApp de contacto"),
          T("Tu correo","Correo de contacto"),
          Ti("¿Cuándo querés arrancar?","Inicio deseado","Ya mismo, este mes, en 1–3 meses…"),
          To("¿Cómo conociste a Movix Studio?","Cómo nos conociste","Instagram, referido, Google…")
        ]},
      {title:"La marca", num:"02",
        lead:"Cómo se llama, quién es legalmente y cómo habla.",
        fields:[
          T("Nombre comercial","Nombre comercial","Como querés que la gente lo diga"),
          T("Razón social / nombre legal","Razón social"),
          T("Cédula jurídica o física","Cédula jurídica"),
          Ti("Frase de una línea (tagline)","Tagline"),
          Num("Año de inicio de operaciones","Año de inicio","opt"),
          Wr("¿Cómo habla la marca?","Tono de voz","imp"),
          Wr("¿Qué te hace distinto de tu competencia directa?","Diferenciador","imp")
        ]},
      {title:"Contacto", num:"03",
        lead:"Los números y correos que van públicos. En los teléfonos, solo escribí los números.",
        fields:[
          Ph("WhatsApp de ventas","WhatsApp de ventas"),
          Ph("Segundo número o línea de soporte","Teléfono secundario","imp"),
          T("Correo principal","Correo principal"),
          T("Dominio web actual o deseado","Dominio"),
          Ti("¿El dominio ya está comprado? ¿Dónde?","Estado del dominio")
        ]},
      {title:"Identidad digital y accesos", num:"04",
        lead:"No escribas contraseñas aquí — solo decinos qué existe. Vos quedás siempre como dueño de todo.",
        extra:"logo",
        fields:[
          Soc("Instagram","Instagram"),
          Soc("Facebook","Facebook"),
          SocI("TikTok","TikTok"),
          Ti("Otras redes","Otras redes","LinkedIn, YouTube…"),
          Ti("Google Business / Maps","Google Business"),
          Price("Presupuesto mensual para pauta","Presupuesto de pauta","imp")
        ]},
      {title:"Público y metas", num:"05",
        lead:"A quién le hablás y qué tiene que pasar en 90 días para llamarlo éxito.",
        fields:[
          Wr("¿Quién es tu cliente ideal hoy?","Cliente ideal"),
          Ti("Idioma principal de venta","Idioma principal"),
          Num("Meta numérica del primer trimestre","Meta del trimestre","imp"),
          Wr("¿Qué tiene que pasar en 90 días para que esto se sienta un éxito?","Meta de 90 días")
        ]}
    ];
  }

  /* ============================================================
     TICKER — reel continuo de categorías (siempre en movimiento)
     ============================================================ */
  var tickerTrack=document.getElementById("tickerTrack");
  var names=CATS.filter(function(c){return c.id!=="otro";}).map(function(c){return c.name;});
  var seq=names.concat(names);
  tickerTrack.innerHTML=seq.map(function(n,i){
    return "<span>"+n+"</span>"+(i<seq.length-1?'<span class="sep">·</span>':"");
  }).join("");

  /* ============================================================
     PARTÍCULAS — "dale play" ignita al elegir categoría
     ============================================================ */
  function burst(x,y){
    var cs=getComputedStyle(document.documentElement);
    var colors=[cs.getPropertyValue("--violet").trim(),cs.getPropertyValue("--coral").trim()];
    for(var i=0;i<10;i++){
      (function(i){
        var p=document.createElement("span");
        p.className="burstp";
        var ang=(Math.PI*2*i/10)+Math.random()*0.4;
        var dist=42+Math.random()*38;
        p.style.setProperty("--dx",(Math.cos(ang)*dist)+"px");
        p.style.setProperty("--dy",(Math.sin(ang)*dist)+"px");
        p.style.left=x+"px";p.style.top=y+"px";
        p.style.background=i%2?colors[0]:colors[1];
        document.body.appendChild(p);
        setTimeout(function(){ if(p.parentNode) p.remove(); },700);
      })(i);
    }
  }

  /* ============================================================
     RENDER — categorías
     ============================================================ */
  var catgrid=document.getElementById("catgrid");
  CATS.forEach(function(c){
    var b=document.createElement("button");
    b.type="button";b.className="catcard";b.setAttribute("role","listitem");b.dataset.cat=c.id;
    b.innerHTML='<div class="catcard__mark">'+markSvg(c.mark)+'</div><h3>'+c.name+'</h3><p>'+c.desc+
      '</p><span class="catcard__cta">Dale play →</span>';
    b.addEventListener("click",function(e){ burst(e.clientX,e.clientY); openCategory(c.id); });
    wireTilt(b);
    catgrid.appendChild(b);
  });

  /* ============================================================
     RENDER — formulario de una categoría
     ============================================================ */
  var catview=document.getElementById("catview");
  var formview=document.getElementById("formview");
  var formmain=document.getElementById("formmain");
  var tocRow=document.getElementById("tocRow");
  var STORE="movixBrief.v1";
  var state={category:null,logo:null,priceCur:{},milestones:{}};

  function slugify(s){
    return (s||"").normalize("NFD").replace(/[̀-ͯ]/g,"")
      .toLowerCase().replace(/[^a-z0-9]+/g,"").slice(0,30) || "tumarca";
  }

  var LOGO_SVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/></svg>';

  function fieldHTML(f){
    var reqDot='<i class="prio '+f.prio+'"></i>';
    var hintHTML=f.hint?' <span class="hint">'+f.hint+'</span>':'';

    if(f.t==="textarea"){
      return '<label class="field'+(f.wide?" wide":"")+'"><span class="lab">'+reqDot+f.label+'</span>'+
        '<textarea data-label="'+f.key+'"></textarea></label>';
    }
    if(f.t==="phone"){
      return '<label class="field'+(f.wide?" wide":"")+'"><span class="lab">'+reqDot+f.label+
        ' <span class="hint">solo números, sin necesitar código de país</span></span>'+
        '<input type="tel" inputmode="numeric" data-label="'+f.key+'" data-phone="1" placeholder="00000000"></label>';
    }
    if(f.t==="number"){
      return '<label class="field'+(f.wide?" wide":"")+'"><span class="lab">'+reqDot+f.label+
        ' <span class="hint">solo números</span></span>'+
        '<input type="text" inputmode="numeric" data-label="'+f.key+'" data-numeric="1" placeholder="0"></label>';
    }
    if(f.t==="price"){
      return '<label class="field'+(f.wide?" wide":"")+'"><span class="lab">'+reqDot+f.label+'</span>'+
        '<div class="pricewrap">'+
          '<div class="curtoggle" data-for="'+f.key+'">'+
            '<button type="button" class="cur active" data-v="₡">₡</button>'+
            '<button type="button" class="cur" data-v="$">$</button>'+
          '</div>'+
          '<input type="text" inputmode="decimal" data-label="'+f.key+'" data-price="1" placeholder="0">'+
        '</div></label>';
    }
    var suggestHTML=f.social?'<div class="suggest">Sugerido: <button type="button" class="chip">@tumarca</button></div>':'';
    return '<label class="field'+(f.wide?" wide":"")+'"><span class="lab">'+reqDot+f.label+hintHTML+'</span>'+
      '<input type="text" data-label="'+f.key+'"'+(f.ph?' placeholder="'+f.ph+'"':'')+'>'+suggestHTML+'</label>';
  }

  var LOGOBOX_HTML =
    '<label class="field wide"><span class="lab"><i class="prio imp"></i>Logo de la marca '+
    '<span class="hint">se guarda en tu dispositivo, no se sube a ningún servidor</span></span>'+
    '<div class="logobox" id="logobox">'+
      '<input type="file" accept="image/*" id="logoInput" hidden>'+
      '<div class="logobox__empty" id="logoEmpty">'+LOGO_SVG+'<span>Arrastrá tu logo aquí o <b>hacé clic para elegir</b></span></div>'+
      '<div class="logobox__preview" id="logoPreview" hidden>'+
        '<img id="logoImg" alt="Logo">'+
        '<div class="logobox__meta"><span id="logoName"></span>'+
          '<div class="logobox__actions">'+
            '<button type="button" class="btn btn--ghost" id="logoShare">Compartir por WhatsApp</button>'+
            '<a class="btn btn--ghost" id="logoDownload" download>Descargar</a>'+
            '<button type="button" class="rm" id="logoRemove">Quitar</button>'+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div></label>';

  function renderSection(sec){
    var el=document.createElement("section");
    el.className="sec fadein";el.id="sec-"+sec.num;
    var body='<div class="sec__head"><span class="sec__num">'+sec.num+'</span><h2 class="sec__title">'+sec.title+'</h2></div>'+
      '<p class="sec__lead">'+sec.lead+'</p><div class="card"><div class="grid">'+
      sec.fields.map(fieldHTML).join("")+(sec.extra==="logo"?LOGOBOX_HTML:'')+'</div>';
    if(sec.checks && sec.checks.length){
      body+='<div class="checks">'+sec.checks.map(function(c){
        return '<label class="chk"><input type="checkbox" data-label="'+c+'"><span>'+c+'</span></label>';
      }).join("")+'</div>';
    }
    body+='</div>';
    el.innerHTML=body;
    return el;
  }

  function renderTopicsSection(){
    var el=document.createElement("section");
    el.className="sec fadein";el.id="sec-08";
    el.innerHTML='<div class="sec__head"><span class="sec__num">08</span>'+
      '<h2 class="sec__title">Posibles temas a tocar</h2></div>'+
      '<p class="sec__lead">Esto no hay que llenarlo — se arma solo con lo que ya escribiste arriba, '+
      'para tenerlo listo en la reunión de arranque.</p>'+
      '<div class="card"><ul class="topics" id="topicsList" hidden></ul>'+
      '<p class="topics__empty" id="topicsEmpty">Todavía no hay suficientes respuestas para sugerir temas — seguí llenando el formulario.</p></div>';
    return el;
  }

  function escapeHTML(s){
    return String(s).replace(/[&<>"']/g,function(c){
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
    });
  }
  function unescapeHTML(s){
    return String(s).replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g,function(c){
      return {"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'"}[c];
    });
  }

  var repeatCounters={};

  function currentValues(){
    var vals={};
    allFields().forEach(function(el){
      vals[el.getAttribute("data-label")] = el.type==="checkbox" ? el.checked : el.value.trim();
    });
    return vals;
  }

  function categoryTopics(cat,v){
    switch(cat.id){
      case "turismo": {
        var t=[];
        if(v("Recogida en hotel")) t.push("Dejar clara la zona exacta de recogida gratis vs. con costo: <b>"+escapeHTML(v("Recogida en hotel"))+"</b>.");
        if(v("Traslado aeropuerto")) t.push("Confirmar tarifa y anticipación mínima del traslado de aeropuerto.");
        return t;
      }
      case "restaurantes": {
        var t=[];
        if(v("Apps de delivery")) t.push("Revisar si el precio en <b>"+escapeHTML(v("Apps de delivery"))+"</b> ya lleva el margen de la comisión.");
        if(v("Reservas")) t.push("Definir la política de no-show para las reservas.");
        return t;
      }
      case "financiero": {
        var t=[];
        if(v("Aprobación legal")) t.push("Montar el flujo de revisión legal (<b>"+escapeHTML(v("Aprobación legal"))+"</b>) para cada pieza antes de publicar.");
        return t;
      }
      case "tecnologia": {
        var t=[];
        if(v("Roadmap a comunicar")) t.push("Decidir cuándo anunciar: <b>"+escapeHTML(v("Roadmap a comunicar"))+"</b>.");
        return t;
      }
      case "salud": {
        var t=[];
        if(v("Equipo profesional")) t.push("Revisar qué se puede decir de cada profesional según las reglas de publicidad médica.");
        return t;
      }
      case "retail": {
        var t=[];
        if(v("Plataforma actual")) t.push("Confirmar si el catálogo se sincroniza solo desde <b>"+escapeHTML(v("Plataforma actual"))+"</b> o hay que subirlo a mano.");
        return t;
      }
      case "inmobiliaria": {
        var t=[];
        if(v("Financiamiento")) t.push("Aclarar cómo se menciona el financiamiento en el material: <b>"+escapeHTML(v("Financiamiento"))+"</b>.");
        return t;
      }
      case "b2b": {
        var t=[];
        if(v("Ciclo de venta")) t.push("Planear contenido para cada etapa de un ciclo de venta de <b>"+escapeHTML(v("Ciclo de venta"))+"</b>.");
        return t;
      }
      default:
        return [];
    }
  }

  function buildTopics(cat){
    var vals=currentValues();
    var v=function(k){return vals[k]||"";};
    var topics=[];

    var nameLabel=cat.repeat.fields[0].label;
    var priceField=cat.repeat.fields.filter(function(f){return f.t==="price";})[0];
    var n=repeatCounters[cat.id]||0;
    for(var i=1;i<=n;i++){
      var nm=v(cat.repeat.singular+" "+i+" · "+nameLabel);
      if(!nm) continue;
      if(priceField){
        var pk=cat.repeat.singular+" "+i+" · "+priceField.label;
        var pv=v(pk);
        var cur=state.priceCur[pk]||"₡";
        if(pv) topics.push("Confirmar si el precio de \"<b>"+escapeHTML(nm)+"</b>\" ("+cur+escapeHTML(pv)+") ya incluye impuestos o comisiones.");
        else topics.push("Terminar de definir el precio de \"<b>"+escapeHTML(nm)+"</b>\" antes de publicarlo.");
      }
    }

    if(v("Inicio deseado")) topics.push("Agendar la reunión de arranque — quieren iniciar: <b>"+escapeHTML(v("Inicio deseado"))+"</b>.");
    if(v("Cómo nos conociste")) topics.push("Registrar el canal que trajo este lead: <b>"+escapeHTML(v("Cómo nos conociste"))+"</b>.");
    if(v("Diferenciador")) topics.push("Cómo metemos tu diferenciador — \"<b>"+escapeHTML(v("Diferenciador"))+"</b>\" — en el primer contenido que publiquemos.");
    if(v("Cliente ideal")) topics.push("Validar que todo el contenido le hable directo a: <b>"+escapeHTML(v("Cliente ideal"))+"</b>.");
    if(v("Meta del trimestre")) topics.push("Armar cómo medimos el avance hacia la meta del trimestre: <b>"+escapeHTML(v("Meta del trimestre"))+"</b>.");
    if(v("Meta de 90 días")) topics.push("Definir el checkpoint a 90 días: <b>"+escapeHTML(v("Meta de 90 días"))+"</b>.");

    var socials=["Instagram","Facebook","TikTok"];
    var missingSoc=socials.filter(function(s){return !v(s);});
    if(missingSoc.length) topics.push("Definir usuario para "+missingSoc.map(function(s){return "<b>"+s+"</b>";}).join(", ")+" antes de arrancar a publicar.");
    else topics.push("Armar el calendario de contenido para Instagram, Facebook y TikTok.");

    if(v("Presupuesto de pauta")) topics.push("Repartir el presupuesto de pauta ("+(state.priceCur["Presupuesto de pauta"]||"₡")+escapeHTML(v("Presupuesto de pauta"))+") entre plataformas y objetivos.");

    var uncheckedCount=0;
    (cat.core.checks||[]).forEach(function(c){ if(!vals[c]) uncheckedCount++; });
    if(uncheckedCount>0) topics.push("Resolver <b>"+uncheckedCount+"</b> pendiente"+(uncheckedCount>1?"s":"")+" de la lista de permisos y documentos antes de publicar.");

    return topics.concat(categoryTopics(cat,v));
  }

  function updateTopics(){
    var cat=CATS.filter(function(c){return c.id===state.category;})[0];
    var list=document.getElementById("topicsList");
    var empty=document.getElementById("topicsEmpty");
    if(!cat || !list) return;
    var topics=buildTopics(cat);
    if(!topics.length){ list.hidden=true;list.innerHTML="";empty.hidden=false;return; }
    empty.hidden=true;list.hidden=false;
    list.innerHTML=topics.map(function(t){return "<li>"+t+"</li>";}).join("");
  }

  function renderRepeatItem(cat,n){
    var r=cat.repeat;
    var el=document.createElement("div");el.className="repeat";
    el.innerHTML='<div class="repeat__h"><h4>'+r.singular+' '+n+'</h4>'+
      (n>1?'<button class="rm" type="button">Quitar</button>':'')+'</div>'+
      '<div class="grid">'+r.fields.map(function(f){
        var f2=Object.assign({},f,{key:r.singular+" "+n+" · "+f.label});
        return fieldHTML(f2);
      }).join("")+'</div>';
    var rm=el.querySelector(".rm");
    if(rm) rm.addEventListener("click",function(){el.remove();wireAll();save();updateProgress();});
    return el;
  }

  function renderRepeatSection(cat){
    var r=cat.repeat;
    var el=document.createElement("section");
    el.className="sec fadein";el.id="sec-"+r.num;
    el.innerHTML='<div class="sec__head"><span class="sec__num">'+r.num+'</span><h2 class="sec__title">'+r.title+'</h2></div>'+
      '<p class="sec__lead">'+r.lead+'</p><div class="card card--pad" id="repeatWrap"></div>';
    var addBtn=document.createElement("button");
    addBtn.type="button";addBtn.className="addbtn";
    addBtn.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg> Agregar otro '+r.singular.toLowerCase();
    addBtn.addEventListener("click",function(){
      repeatCounters[cat.id]++;
      el.querySelector("#repeatWrap").appendChild(renderRepeatItem(cat,repeatCounters[cat.id]));
      wireAll();save();updateProgress();
    });
    el.querySelector(".card").after(addBtn);
    return el;
  }

  function openCategory(id){
    var cat=CATS.filter(function(c){return c.id===id;})[0];
    if(!cat) return;
    state.category=id;
    document.getElementById("fh-badge").textContent="Reproduciendo — "+cat.badge;
    document.getElementById("fh-title").textContent=cat.title;
    document.getElementById("fh-lead").textContent=cat.lead;

    var sections=BASE();
    cat.core.num="06";cat.repeat.num="07";
    sections.push(cat.core);

    formmain.innerHTML="";
    tocRow.innerHTML="";
    sections.forEach(function(sec){
      formmain.appendChild(renderSection(sec));
      var a=document.createElement("a");a.href="#sec-"+sec.num;a.textContent=sec.title;tocRow.appendChild(a);
    });
    repeatCounters[cat.id]=repeatCounters[cat.id]||0;
    var repSec=renderRepeatSection(cat);
    formmain.appendChild(repSec);
    var a2=document.createElement("a");a2.href="#sec-"+cat.repeat.num;a2.textContent=cat.repeat.title;tocRow.appendChild(a2);

    if(repeatCounters[cat.id]===0){
      repeatCounters[cat.id]=1;
      repSec.querySelector("#repeatWrap").appendChild(renderRepeatItem(cat,1));
    } else {
      for(var n=1;n<=repeatCounters[cat.id];n++){
        repSec.querySelector("#repeatWrap").appendChild(renderRepeatItem(cat,n));
      }
    }

    var topicsSec=renderTopicsSection();
    formmain.appendChild(topicsSec);
    var a3=document.createElement("a");a3.href="#sec-08";a3.textContent="Posibles temas a tocar";tocRow.appendChild(a3);

    catview.classList.add("hidden");
    formview.classList.add("active");
    window.scrollTo(0,0);
    restoreCategory(id);
    wireAll();
    wireSuggestions();
    wirePriceToggles();
    wireLogo();
    markDoneAll();
    updateProgress();
  }

  document.getElementById("backlink").addEventListener("click",function(){
    save();
    formview.classList.remove("active");
    catview.classList.remove("hidden");
    window.scrollTo(0,0);
  });

  /* ---------- persistence, per category ---------- */
  function allFields(){return Array.prototype.slice.call(formmain.querySelectorAll("[data-label]"));}
  function loadStore(){
    var raw;try{raw=localStorage.getItem(STORE);}catch(e){}
    if(!raw) return {};
    try{return JSON.parse(raw)||{};}catch(e){return {};}
  }
  function save(){
    if(!state.category) return;
    var db=loadStore();
    var vals={};
    allFields().forEach(function(el){vals[el.getAttribute("data-label")] = el.type==="checkbox" ? (el.checked?1:0) : el.value;});
    db[state.category]={vals:vals,repeatN:repeatCounters[state.category]||1,priceCur:state.priceCur};
    try{localStorage.setItem(STORE,JSON.stringify(db));}catch(e){}
  }
  function restoreCategory(id){
    var db=loadStore();
    var entry=db[id];
    if(!entry) return;
    allFields().forEach(function(el){
      var v=entry.vals?entry.vals[el.getAttribute("data-label")]:undefined;
      if(v===undefined) return;
      if(el.type==="checkbox") el.checked=!!v; else el.value=v;
    });
    if(entry.priceCur){
      state.priceCur=entry.priceCur;
      Object.keys(state.priceCur).forEach(function(k){
        var wrap=formmain.querySelector('.curtoggle[data-for="'+cssEscape(k)+'"]');
        if(!wrap) return;
        wrap.querySelectorAll(".cur").forEach(function(btn){
          btn.classList.toggle("active", btn.getAttribute("data-v")===state.priceCur[k]);
        });
      });
    }
  }
  function cssEscape(s){ return (window.CSS && CSS.escape) ? CSS.escape(s) : s.replace(/[^a-zA-Z0-9_-]/g,"\\$&"); }

  function markDoneAll(){
    allFields().forEach(function(el){
      var fld=el.closest(".field");
      if(!fld) return;
      var filled = el.type==="checkbox" ? el.checked : el.value.trim().length>0;
      fld.classList.toggle("done", !!filled);
    });
  }

  function updateProgress(){
    var fields=allFields();
    var total=0,done=0;
    fields.forEach(function(el){
      total++;
      if(el.type==="checkbox"){if(el.checked)done++;}
      else if(el.value.trim())done++;
    });
    var pct=total?Math.round(done/total*100):0;
    document.getElementById("fill").style.width=pct+"%";
    document.getElementById("thumb").style.left=pct+"%";
    var t=document.getElementById("progtxt");
    if(done===0){ t.textContent="Todavía no le diste play"; }
    else if(pct<100){ t.textContent="Reproduciendo tu marca — "+pct+"% · "+done+" respuestas"; }
    else { t.textContent="Play completo — lista para enviar"; }

    if(state.category){
      var flags=state.milestones[state.category]=state.milestones[state.category]||{};
      if(pct>=50 && !flags.half){ flags.half=true; if(pct<100) toast("Vas a la mitad — seguí así"); }
      if(pct>=100 && !flags.full){ flags.full=true; toast("Play completo — dale send cuando quieras"); }
    }
    updateTopics();
  }

  function wireAll(){
    allFields().forEach(function(el){
      if(el.__wired)return; el.__wired=true;
      var ev=el.type==="checkbox"?"change":"input";
      if(el.dataset.phone){
        el.addEventListener("input",function(){
          var clean=el.value.replace(/[^0-9]/g,"");
          if(clean!==el.value) el.value=clean;
        });
      }
      if(el.dataset.numeric){
        el.addEventListener("input",function(){
          var clean=el.value.replace(/[^0-9]/g,"");
          if(clean!==el.value) el.value=clean;
        });
      }
      if(el.dataset.price){
        el.addEventListener("input",function(){
          var clean=el.value.replace(/[^0-9.]/g,"").replace(/(\..*)\./g,"$1");
          if(clean!==el.value) el.value=clean;
        });
      }
      el.addEventListener(ev,function(){
        save();updateProgress();
        var fld=el.closest(".field");
        if(fld){
          var filled = el.type==="checkbox" ? el.checked : el.value.trim().length>0;
          fld.classList.toggle("done", !!filled);
        }
      });
    });
  }

  function wirePriceToggles(){
    formmain.querySelectorAll(".curtoggle").forEach(function(wrap){
      if(wrap.__wired) return; wrap.__wired=true;
      var key=wrap.getAttribute("data-for");
      if(!state.priceCur[key]) state.priceCur[key]="₡";
      wrap.querySelectorAll(".cur").forEach(function(btn){
        btn.addEventListener("click",function(){
          wrap.querySelectorAll(".cur").forEach(function(b){b.classList.remove("active");});
          btn.classList.add("active");
          state.priceCur[key]=btn.getAttribute("data-v");
          save();updateTopics();
        });
      });
    });
  }

  function wireSuggestions(){
    var nameInput=formmain.querySelector('[data-label="Nombre comercial"]');
    var chips=formmain.querySelectorAll(".suggest .chip");
    function recompute(){
      var slug=slugify(nameInput?nameInput.value:"");
      chips.forEach(function(ch){ch.textContent="@"+slug;});
    }
    if(nameInput && !nameInput.__sugWired){
      nameInput.__sugWired=true;
      nameInput.addEventListener("input",recompute);
    }
    recompute();
    chips.forEach(function(ch){
      if(ch.__wired) return; ch.__wired=true;
      ch.addEventListener("click",function(){
        var wrap=ch.closest(".field");
        var input=wrap.querySelector("input");
        if(input && !input.value.trim()){
          input.value=ch.textContent;
          input.dispatchEvent(new Event("input",{bubbles:true}));
          input.focus();
        }
      });
    });
  }

  function wireLogo(){
    var input=document.getElementById("logoInput");
    if(!input) return;
    var box=document.getElementById("logobox");
    var empty=document.getElementById("logoEmpty");
    var preview=document.getElementById("logoPreview");
    var img=document.getElementById("logoImg");
    var nameEl=document.getElementById("logoName");
    var shareBtn=document.getElementById("logoShare");
    var dlLink=document.getElementById("logoDownload");
    var rmBtn=document.getElementById("logoRemove");

    function showLogo(logo){
      state.logo=logo;
      img.src=logo.dataURL;nameEl.textContent=logo.name;
      dlLink.href=logo.dataURL;dlLink.download=logo.name;
      empty.hidden=true;preview.hidden=false;
    }
    function setLogo(file){
      if(!file || file.type.indexOf("image/")!==0){toast("Elegí un archivo de imagen");return;}
      var reader=new FileReader();
      reader.onload=function(){
        var logo={name:file.name,type:file.type,dataURL:reader.result};
        showLogo(logo);
        try{
          if(reader.result.length<1500000){
            var db=loadStore();db.__logo=db.__logo||{};db.__logo[state.category]=logo;
            localStorage.setItem(STORE,JSON.stringify(db));
          }
        }catch(e){}
      };
      reader.readAsDataURL(file);
    }

    box.addEventListener("click",function(e){
      if(e.target===rmBtn||e.target===shareBtn||e.target===dlLink) return;
      input.click();
    });
    input.addEventListener("change",function(){ if(input.files[0]) setLogo(input.files[0]); });
    box.addEventListener("dragover",function(e){e.preventDefault();box.classList.add("drag");});
    box.addEventListener("dragleave",function(){box.classList.remove("drag");});
    box.addEventListener("drop",function(e){
      e.preventDefault();box.classList.remove("drag");
      var f=e.dataTransfer.files[0];
      if(f) setLogo(f);
    });
    rmBtn.addEventListener("click",function(ev){
      ev.stopPropagation();
      state.logo=null;empty.hidden=false;preview.hidden=true;input.value="";
      var db=loadStore();if(db.__logo) delete db.__logo[state.category];
      try{localStorage.setItem(STORE,JSON.stringify(db));}catch(e){}
    });
    shareBtn.addEventListener("click",function(ev){
      ev.stopPropagation();
      if(!state.logo) return;
      fetch(state.logo.dataURL).then(function(r){return r.blob();}).then(function(blob){
        var file=new File([blob],state.logo.name,{type:state.logo.type});
        if(navigator.canShare && navigator.canShare({files:[file]})){
          navigator.share({files:[file],text:"Logo de la marca"}).catch(function(){});
        } else {
          toast("Tu navegador no permite compartir archivos — descargalo y adjuntalo en WhatsApp");
        }
      });
    });

    var db=loadStore();
    if(db.__logo && db.__logo[state.category]) showLogo(db.__logo[state.category]);
    else state.logo=null;
  }

  /* ---------- compile + send ---------- */
  var MOVIX_WA="50670863466";

  function compile(){
    var cat=CATS.filter(function(c){return c.id===state.category;})[0];
    var out=["*BRIEF DE MARCA — MOVIX STUDIO*","Categoría: "+(cat?cat.name:"")];
    formmain.querySelectorAll("section.sec").forEach(function(sec){
      var title=sec.querySelector(".sec__title").textContent.trim();
      var lines=[];
      sec.querySelectorAll("[data-label]").forEach(function(el){
        var v,key=el.getAttribute("data-label");
        if(el.type==="checkbox"){if(!el.checked)return;v="Sí";}
        else{
          v=el.value.trim();if(!v)return;
          if(el.dataset.price){ v=(state.priceCur[key]||"₡")+v; }
        }
        lines.push("• "+key+": "+v);
      });
      if(lines.length) out.push("\n*"+title.toUpperCase()+"*\n"+lines.join("\n"));
    });
    if(state.logo){
      out.push("\n*LOGO*\n• Logo adjunto: "+state.logo.name+" (se comparte por separado con el botón de compartir o se adjunta manualmente en WhatsApp)");
    }
    if(cat){
      var topics=buildTopics(cat).map(function(t){return unescapeHTML(t.replace(/<\/?b>/g,"*"));});
      if(topics.length) out.push("\n*POSIBLES TEMAS A TOCAR EN LA REUNIÓN*\n"+topics.map(function(t){return "• "+t;}).join("\n"));
    }
    return out.length<=2 ? "" : out.join("\n");
  }

  function toast(msg){
    var t=document.getElementById("toast");
    t.textContent=msg;t.classList.add("show");
    clearTimeout(t.__t);t.__t=setTimeout(function(){t.classList.remove("show");},2600);
  }

  document.getElementById("wa").addEventListener("click",function(){
    var msg=compile();
    if(!msg){toast("Todavía no le diste play a nada");return;}
    toast("Play activado — abriendo WhatsApp");
    window.open("https://wa.me/"+MOVIX_WA+"?text="+encodeURIComponent(msg),"_blank");
  });
  document.getElementById("copy").addEventListener("click",function(){
    var msg=compile();
    if(!msg){toast("Todavía no le diste play a nada");return;}
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(msg).then(function(){toast("Copiado — dale play y pegalo donde quieras");},function(){fallbackCopy(msg);});
    } else fallbackCopy(msg);
  });
  function fallbackCopy(msg){
    var ta=document.createElement("textarea");ta.value=msg;document.body.appendChild(ta);
    ta.select();try{document.execCommand("copy");toast("Copiado ✓");}catch(e){toast("No se pudo copiar");}
    document.body.removeChild(ta);
  }
})();
