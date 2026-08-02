/* ============================================================
   MOVIX STUDIO — comportamiento compartido del sitio
   Sin librerías externas. Cada módulo se activa solo si su
   elemento existe en la página.
   ============================================================ */
(function(){
  "use strict";
  var ROOT=document.body.getAttribute("data-root")||"./";
  var REDUCED=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  var WA="https://wa.me/50670863466";

  /* ---------- lámpara de lava (tenue) ---------- */
  (function initLava(){
    var canvas=document.getElementById("lava");
    if(!canvas) return;
    var gl=canvas.getContext("webgl",{alpha:true,antialias:false,premultipliedAlpha:true});
    if(!gl) return;
    var Q=0.42;
    function fit(){canvas.width=Math.max(2,innerWidth*Q);canvas.height=Math.max(2,innerHeight*Q);gl.viewport(0,0,canvas.width,canvas.height);}
    fit();addEventListener("resize",fit);
    var VS="attribute vec2 aP;void main(){gl_Position=vec4(aP,0.,1.);}";
    var FS="precision mediump float;uniform vec2 uR;uniform float uT;"+
      "void main(){vec2 uv=gl_FragCoord.xy/uR;vec2 p=uv;p.x*=uR.x/uR.y;"+
      "float fv=0.;float fc=0.;"+
      "for(int i=0;i<7;i++){float fi=float(i);"+
      "float sp=0.045+0.012*fi;"+
      "vec2 c=vec2(0.16+0.113*fi+0.15*sin(uT*sp*0.7+fi*2.1),0.5+0.44*sin(uT*sp+fi*1.7));"+
      "c.x*=uR.x/uR.y;"+
      "float r=0.11+0.05*sin(fi*3.7+uT*0.05);"+
      "float d=max(length(p-c),0.001);"+
      "float f=r*r/(d*d);"+
      "if(mod(fi,2.)<1.)fv+=f;else fc+=f;}"+
      "float F=fv+fc;"+
      "vec3 vio=vec3(0.486,0.361,1.0);vec3 cor=vec3(1.0,0.357,0.239);"+
      "vec3 col=(vio*fv+cor*fc)/max(F,0.001);"+
      "float body=smoothstep(0.95,1.7,F);"+
      "float glow=smoothstep(0.4,1.1,F)*0.10;"+
      "float a=body*0.22+glow;"+
      "gl_FragColor=vec4(col*a,a);}";
    function sh(t,s){var o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return o;}
    var pr=gl.createProgram();
    gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS));
    gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS));
    gl.linkProgram(pr);
    if(!gl.getProgramParameter(pr,gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    document.body.classList.add("lava-on");
    var b=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,b);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    var aP=gl.getAttribLocation(pr,"aP");
    gl.enableVertexAttribArray(aP);gl.vertexAttribPointer(aP,2,gl.FLOAT,false,0,0);
    var uR=gl.getUniformLocation(pr,"uR"),uT=gl.getUniformLocation(pr,"uT");
    gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0,0,0,0);
    function draw(ms){
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uR,canvas.width,canvas.height);
      gl.uniform1f(uT,ms*0.001);
      gl.drawArrays(gl.TRIANGLES,0,3);
      if(!REDUCED) requestAnimationFrame(draw);
    }
    if(REDUCED) draw(40000); else requestAnimationFrame(draw);
  })();

  /* ---------- brasas ---------- */
  (function initEmbers(){
    var wrap=document.getElementById("embers");
    if(!wrap) return;
    var colors=["var(--violet)","var(--coral)"];
    for(var i=0;i<10;i++){
      var s=document.createElement("span");
      s.style.left=(Math.random()*100)+"vw";
      s.style.background=colors[i%2];
      s.style.setProperty("--dx",((Math.random()*60)-30).toFixed(0)+"px");
      s.style.animationDuration=(16+Math.random()*14).toFixed(1)+"s";
      s.style.animationDelay="-"+(Math.random()*22).toFixed(1)+"s";
      wrap.appendChild(s);
    }
  })();

  /* ---------- play 3D del hero ---------- */
  (function initPlay3D(){
    var canvas=document.getElementById("play3d");
    if(!canvas) return;
    var gl=canvas.getContext("webgl",{alpha:true,antialias:true});
    if(!gl){ canvas.remove(); return; }
    var dpr=Math.min(window.devicePixelRatio||1,2);
    function fit(){var s=canvas.clientWidth||200;canvas.width=s*dpr;canvas.height=s*dpr;gl.viewport(0,0,canvas.width,canvas.height);}
    fit();addEventListener("resize",fit);
    var VS="attribute vec3 aP;attribute vec3 aN;uniform mat4 uMVP;uniform mat4 uM;"+
      "varying vec3 vN;varying vec3 vP;void main(){vN=mat3(uM[0].xyz,uM[1].xyz,uM[2].xyz)*aN;"+
      "vP=(uM*vec4(aP,1.)).xyz;gl_Position=uMVP*vec4(aP,1.);}";
    var FS="precision mediump float;varying vec3 vN;varying vec3 vP;"+
      "void main(){vec3 N=normalize(vN);"+
      "vec3 vio=vec3(0.486,0.361,1.0);vec3 cor=vec3(1.0,0.357,0.239);"+
      "vec3 base=mix(vio,cor,clamp(vP.x*0.55+0.5,0.,1.));"+
      "vec3 L1=normalize(vec3(-0.5,0.8,0.6));vec3 L2=normalize(vec3(0.7,-0.3,0.5));"+
      "float d=0.5*max(dot(N,L1),0.)+0.35*max(dot(N,L2),0.);"+
      "vec3 H=normalize(L1+vec3(0.,0.,1.));float sp=pow(max(dot(N,H),0.),26.)*0.4;"+
      "gl_FragColor=vec4(base*(0.42+d)+sp,1.0);}";
    function sh(type,src){var s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s;}
    var prog=gl.createProgram();
    gl.attachShader(prog,sh(gl.VERTEX_SHADER,VS));
    gl.attachShader(prog,sh(gl.FRAGMENT_SHADER,FS));
    gl.linkProgram(prog);
    if(!gl.getProgramParameter(prog,gl.LINK_STATUS)){ canvas.remove();return; }
    gl.useProgram(prog);
    var A=[-0.55,0.75],B=[-0.55,-0.75],C=[0.85,0],D=0.26;
    var verts=[];
    function tri(p1,p2,p3){
      var u=[p2[0]-p1[0],p2[1]-p1[1],p2[2]-p1[2]],v=[p3[0]-p1[0],p3[1]-p1[1],p3[2]-p1[2]];
      var n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
      var l=Math.hypot(n[0],n[1],n[2])||1;n=[n[0]/l,n[1]/l,n[2]/l];
      [p1,p2,p3].forEach(function(p){verts.push(p[0],p[1],p[2],n[0],n[1],n[2]);});
    }
    function quad(p,q){
      var pf=[p[0],p[1],D],pb=[p[0],p[1],-D],qf=[q[0],q[1],D],qb=[q[0],q[1],-D];
      tri(pf,pb,qb);tri(pf,qb,qf);
    }
    tri([A[0],A[1],D],[B[0],B[1],D],[C[0],C[1],D]);
    tri([A[0],A[1],-D],[C[0],C[1],-D],[B[0],B[1],-D]);
    quad(A,B);quad(B,C);quad(C,A);
    var nVerts=verts.length/6;
    var buf=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buf);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(verts),gl.STATIC_DRAW);
    var aP=gl.getAttribLocation(prog,"aP"),aN=gl.getAttribLocation(prog,"aN");
    gl.enableVertexAttribArray(aP);gl.vertexAttribPointer(aP,3,gl.FLOAT,false,24,0);
    gl.enableVertexAttribArray(aN);gl.vertexAttribPointer(aN,3,gl.FLOAT,false,24,12);
    var uMVP=gl.getUniformLocation(prog,"uMVP"),uM=gl.getUniformLocation(prog,"uM");
    gl.enable(gl.DEPTH_TEST);gl.clearColor(0,0,0,0);
    function mul(a,b){
      var o=new Array(16);
      for(var r=0;r<4;r++)for(var c=0;c<4;c++){
        o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];
      }
      return o;
    }
    function rotY(t){var c=Math.cos(t),s=Math.sin(t);return [c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1];}
    function rotX(t){var c=Math.cos(t),s=Math.sin(t);return [1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1];}
    function persp(fov,n,f){
      var t=1/Math.tan(fov/2),d=1/(n-f);
      return [t,0,0,0, 0,t,0,0, 0,0,(n+f)*d,-1, 0,0,2*n*f*d,0];
    }
    var proj=persp(0.62,0.1,10);
    var view=[1,0,0,0, 0,1,0,0, 0,0,1,0, 0,-0.02,-3.6,1];
    var tx=0,ty=0,cx=0,cy=0;
    if(!("ontouchstart" in window)){
      window.addEventListener("pointermove",function(e){
        var r=canvas.getBoundingClientRect();
        var mx=(e.clientX-(r.left+r.width/2))/window.innerWidth;
        var my=(e.clientY-(r.top+r.height/2))/window.innerHeight;
        ty=Math.max(-0.6,Math.min(0.6,mx*1.6));
        tx=Math.max(-0.45,Math.min(0.45,my*1.3));
      });
    }
    function draw(t){
      cx+=(tx-cx)*0.06;cy+=(ty-cy)*0.06;
      var spin=REDUCED?0.45:Math.sin(t*0.00085)*0.6;
      var wob=REDUCED?-0.12:Math.sin(t*0.0011)*0.16;
      var model=mul(rotX(wob+cx),rotY(spin+cy));
      gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      gl.uniformMatrix4fv(uM,false,new Float32Array(model));
      gl.uniformMatrix4fv(uMVP,false,new Float32Array(mul(proj,mul(view,model))));
      gl.drawArrays(gl.TRIANGLES,0,nVerts);
      if(!REDUCED) requestAnimationFrame(draw);
    }
    if(REDUCED) draw(0); else requestAnimationFrame(draw);
  })();

  /* ---------- ticker ---------- */
  (function initTicker(){
    var track=document.getElementById("tickerTrack");
    if(!track) return;
    var words=(track.getAttribute("data-words")||"").split(",").filter(Boolean);
    if(!words.length) return;
    var seq=words.concat(words).concat(words);
    track.innerHTML=seq.map(function(n,i){
      return "<span>"+n+"</span>"+(i<seq.length-1?'<span class="sep">·</span>':"");
    }).join("");
  })();

  /* ---------- tilt 3D en tarjetas ---------- */
  (function initTilt(){
    if(REDUCED||("ontouchstart" in window)) return;
    document.querySelectorAll(".scard").forEach(function(card){
      card.addEventListener("pointermove",function(e){
        var r=card.getBoundingClientRect();
        var px=(e.clientX-r.left)/r.width-0.5;
        var py=(e.clientY-r.top)/r.height-0.5;
        card.style.transform="translateY(-2px) rotateX("+(-py*6).toFixed(2)+"deg) rotateY("+(px*8).toFixed(2)+"deg)";
      });
      card.addEventListener("pointerleave",function(){card.style.transform="";});
    });
  })();

  /* ---------- reveal al hacer scroll ---------- */
  (function initReveal(){
    var els=document.querySelectorAll(".reveal");
    if(!els.length) return;
    if(!("IntersectionObserver" in window)){els.forEach(function(e){e.classList.add("in");});return;}
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting){en.target.classList.add("in");io.unobserve(en.target);} });
    },{threshold:0.1});
    els.forEach(function(e){io.observe(e);});
  })();

  /* ---------- link activo del nav ---------- */
  (function initNav(){
    var path=location.pathname.replace(/index\.html$/,"");
    document.querySelectorAll(".brandbar nav a").forEach(function(a){
      var href=a.getAttribute("href");
      if(!href) return;
      var target=new URL(href,location.href).pathname.replace(/index\.html$/,"");
      if(target===path) a.classList.add("on");
    });
  })();

  /* ============================================================
     SOPORTE EN LÍNEA — asistente guiado (sin backend, sin datos)
     ============================================================ */
  (function initChat(){
    if(document.body.getAttribute("data-chat")==="off") return;
    var fab=document.createElement("button");
    fab.type="button";fab.className="chatfab";fab.setAttribute("aria-label","Abrir soporte en línea");
    fab.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8.5 8.5 0 0 1-8.5 8.5c-1.2 0-2.4-.2-3.4-.7L4 21l1.3-4.2A8.5 8.5 0 1 1 21 12Z"/><path d="m10.2 9.6 4.4 2.4-4.4 2.4Z" fill="currentColor" stroke="none"/></svg>';
    var box=document.createElement("div");
    box.className="chatbox";box.setAttribute("role","dialog");box.setAttribute("aria-label","Soporte en línea de Movix Studio");
    box.innerHTML=
      '<div class="chatbox__head">'+
        '<span class="logo__play"><svg viewBox="0 0 10 10" fill="none"><path d="M2 1.2 8.4 5 2 8.8Z" fill="#fff"/></svg></span>'+
        '<div><b>Soporte Movix Studio</b><small>Asistente guiado · respuesta inmediata</small></div>'+
        '<button type="button" class="chatbox__close" aria-label="Cerrar">×</button>'+
      '</div>'+
      '<div class="chatbox__log" id="chatLog"></div>'+
      '<div class="chips" id="chatChips"></div>'+
      '<div class="chatbox__note">Asistente guiado, sin registro de datos. Para atención humana: WhatsApp.</div>';
    document.body.appendChild(fab);
    document.body.appendChild(box);
    var log=box.querySelector("#chatLog");
    var chipsEl=box.querySelector("#chatChips");

    function say(html,who){
      var m=document.createElement("div");
      m.className="msg "+(who||"bot");
      m.innerHTML=html;
      log.appendChild(m);
      log.scrollTop=log.scrollHeight;
    }
    var TOPICS=[
      ["Servicios","¿Qué servicios ofrecen?",
        "Todo lo que una marca necesita para vender: <b>social media integral</b>, <b>contenido y video</b>, <b>pauta digital</b>, <b>branding</b>, <b>sitios web</b> e <b>IA y automatizaciones</b> (chatbots y flujos de WhatsApp). Los detalles de cada uno están en <a href='"+ROOT+"servicios/'>Servicios</a>."],
      ["Cómo empiezo","¿Cómo empiezo con Movix?",
        "Fácil: llenás el <a href='"+ROOT+"intake/'>brief de marca</a> — 15 minutos, desde el cel — y nos llega directo por WhatsApp. Con eso llegamos a la primera reunión con propuesta sobre la mesa."],
      ["Precios","¿Cuánto cuesta?",
        "Cada marca necesita algo distinto, así que no vendemos paquetes iguales para todos. El <a href='"+ROOT+"intake/'>brief</a> nos deja darte un precio real y a la medida, sin inflar nada."],
      ["Hablar con alguien","Quiero hablar con una persona",
        "¡Con gusto! Escribinos directo al WhatsApp de Movix Studio: <a href='"+WA+"' rel='noopener' target='_blank'>+506 7086-3466</a>. Respondemos en horario hábil de Costa Rica."],
      ["Horario","¿Cuál es el horario?",
        "El equipo responde por WhatsApp en horario hábil de Costa Rica. Este asistente y el <a href='"+ROOT+"intake/'>brief</a> funcionan 24/7 — podés dejar todo listo a cualquier hora."]
    ];
    function showChips(){
      chipsEl.innerHTML="";
      TOPICS.forEach(function(t){
        var b=document.createElement("button");
        b.type="button";b.textContent=t[0];
        b.addEventListener("click",function(){
          say(t[1],"user");
          setTimeout(function(){say(t[2],"bot");},260);
        });
        chipsEl.appendChild(b);
      });
    }
    var greeted=false;
    function toggle(open){
      box.classList.toggle("open",open);
      if(open&&!greeted){
        greeted=true;
        say("¡Pura vida! Soy el asistente de Movix Studio. Elegí un tema y te respondo al instante:","bot");
        showChips();
      }
    }
    fab.addEventListener("click",function(){toggle(!box.classList.contains("open"));});
    box.querySelector(".chatbox__close").addEventListener("click",function(){toggle(false);});
    document.querySelectorAll("[data-open-chat]").forEach(function(el){
      el.addEventListener("click",function(ev){ev.preventDefault();toggle(true);});
    });
  })();
})();
