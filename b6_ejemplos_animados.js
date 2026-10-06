/* b6_ejemplos_animados.js — animaciones del libro interactivo con el motor de láminas (window.EU_EJ_ANIM).
   · Ejemplos resueltos (páginas enc_ejemplos de b6_enciclopedia.js): «▶ Ver resolución» dibuja los pasos uno a uno
     como una pizarra (estructuras de flujo del motor: cadena o serpentina), narrados con la voz «Google español»;
     al final, la respuesta y el porqué.
   · Láminas de la unidad (escáner, tutor): «▶ Animar esquema» pinta la misma lámina en vivo, caja a caja, y dice
     cada rótulo. El impreso, el PDF y el EPUB no cambian: llevan la foto final.
   El motor de láminas se copia una sola vez dentro del HTML descargado (igual que en el curso premium), con la mezcla
   de colores mínima que necesita fuera de la app. `cfg.acab.animar = 'no'` lo apaga. Cargar después de
   b6_enciclopedia.js. */
(function () {
  'use strict';
  var ED = window.EU_EDITORIAL; if (!ED || window.EU_EJ_ANIM) return;
  function es(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function activo(C) { return C && ((C.cfg && C.cfg.acab) || {}).animar !== 'no'; }

  /* el código del motor de láminas, para copiarlo en el libro descargado */
  var SRC = null;
  (function cargar() {
    if (!window.fetch) return;
    var el = document.querySelector('script[src*="b6_laminas_motor.js"]'), src = el ? el.getAttribute('src') : './b6_laminas_motor.js';
    fetch(src).then(function (r) { return r.ok ? r.text() : ''; }).then(function (t) { SRC = /LAMINAS_MOTOR/.test(t) ? t : ''; }).catch(function () { SRC = ''; });
  })();

  /* láminas de la unidad: se marca cada foto con su receta para poder pintarla en vivo */
  ED.registrar({
    post: function (h, pg, C, modo) {
      if (modo !== 'web' || !activo(C) || !pg.u || !/^(esc_lamina|tutor|enc_conclusion)$/.test(pg.tipo)) return h;
      var ES = window.EU_ESCANER; if (!ES || !ES.especie || !ES.lamina) return h;
      var lams = pg.tipo === 'esc_lamina' ? [pg.lam || 0] : ((pg.tut && pg.tut.lams) || []);
      lams.forEach(function (l) {
        var src = ES.lamina({ u: pg.u, lam: l }, C), lam = ES.especie({ u: pg.u, lam: l }, C); if (!src || !lam) return;
        var k = h.indexOf('src="' + src + '"'); if (k < 0) return;
        h = h.slice(0, k) + 'data-lam="' + es(JSON.stringify(lam)) + '" ' + h.slice(k);
      });
      return h;
    }
  });

  function reproductor() {
    return '<script>(function(){var LM=window.LAMINAS_MOTOR;if(!LM)return;var S=window.speechSynthesis;' +
      'function V(){if(!S)return null;var v=S.getVoices().filter(function(x){return /^es/i.test(x.lang)});return v.filter(function(x){return /google/i.test(x.name)&&/es[-_]ES/i.test(x.lang)})[0]||v.filter(function(x){return /es[-_]ES/i.test(x.lang)})[0]||v[0]||null}' +
      'function di(t,cb){var hecho=0,fin=function(){if(hecho)return;hecho=1;cb&&cb()};if(!S||!t){setTimeout(fin,1400);return}var u=new SpeechSynthesisUtterance(t);u.lang="es-ES";var v=V();if(v)u.voice=v;u.rate=.95;u.onend=fin;u.onerror=fin;setTimeout(fin,Math.max(2600,t.length*95));S.speak(u)}' +
      'function pinta(cv,lam,p,m){var c=cv.getContext("2d");c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.globalCompositeOperation="source-over";c.clearRect(0,0,cv.width,cv.height);LM.pintar(c,cv.width,cv.height,lam,{prog:p,modo:m||"aparecer"})}' +
      'function va(cv,lam,a,b,ms,m,cb){var t0=performance.now();(function f(t){var k=Math.min(1,(t-t0)/ms);pinta(cv,lam,a+(b-a)*k,m);if(k<1&&!cv._stop)requestAnimationFrame(f);else if(cb)cb()})(t0)}' +
      'var pal=(LM.paletas()||[]).filter(function(p){return p.claro})[0];' +
      'function bt(t){var b=document.createElement("button");b.textContent=t;b.style.cssText="font:600 12px system-ui,sans-serif;padding:4px 11px;border-radius:99px;border:0;background:#1f1b18;color:#fff;cursor:pointer;margin:1.5mm 0";return b}' +
      /* ejemplos resueltos */
      '[].slice.call(document.querySelectorAll("script[data-ej-anim]")).forEach(function(sc){var D=JSON.parse(sc.textContent),box=sc.parentNode,b=bt("\\u25b6 Ver resoluci\\u00f3n"),cv=null;box.insertBefore(b,box.children[1]||null);' +
      'b.onclick=function(){if(cv){cv._stop=1;S&&S.cancel();cv.remove();cv=null;b.textContent="\\u25b6 Ver resoluci\\u00f3n";return}' +
      'var nod=D.p.map(function(p,i){return{t:"Paso "+(i+1),d:p,nivel:1}}).concat([{t:"Respuesta",d:D.s,nivel:1}]),n=nod.length,lam={titulo:D.t,subtitulo:D.e.length>110?D.e.slice(0,108)+"\\u2026":D.e,estructura:n>4?"fl_serpiente":"fl_cadena",paleta:pal&&pal.id,nodos:nod};' +
      'cv=document.createElement("canvas");cv.width=1400;cv.height=n>4?900:640;cv.style.cssText="width:100%;height:auto;display:block;border-radius:6px;margin:1mm 0";box.insertBefore(cv,b.nextSibling);b.textContent="\\u25a0 Parar";S&&S.cancel();pinta(cv,lam,0);' +
      'var i=0;(function paso(){if(!cv||cv._stop)return;if(i>=n){di("Por qu\\u00e9: "+D.x,function(){if(cv)b.textContent="\\u21ba Cerrar"});return}var txt=i<n-1?"Paso "+(i+1)+". "+D.p[i]:"La respuesta es: "+D.s+".";var a=i/n,z=(i+1)/n;i++;var ok=0,sig=function(){if(++ok===2)paso()};va(cv,lam,a,z,900,"aparecer",sig);di(txt,sig)})()}});' +
      /* láminas de la unidad */
      '[].slice.call(document.querySelectorAll("img[data-lam]")).forEach(function(im){var lam;try{lam=JSON.parse(im.getAttribute("data-lam"))}catch(e){return}var b=bt("\\u25b6 Animar esquema"),cv=null;im.parentNode.insertBefore(b,im);' +
      'b.onclick=function(){if(cv){cv._stop=1;S&&S.cancel();cv.remove();cv=null;im.style.display="";b.textContent="\\u25b6 Animar esquema";return}' +
      'cv=document.createElement("canvas");cv.width=im.naturalWidth||1400;cv.height=im.naturalHeight||1560;cv.style.cssText=im.style.cssText+";display:block;height:"+im.offsetHeight+"px;width:auto;max-width:100%";im.style.display="none";im.parentNode.insertBefore(cv,im);b.textContent="\\u25a0 Parar";' +
      'var N=lam.nodos||[],i=0,m=["aparecer","dibujar"][(lam.titulo||"").length%2];pinta(cv,lam,0,m);di(lam.titulo,function(){});' +
      '(function sig(){if(!cv||cv._stop)return;if(i>=N.length){b.textContent="\\u21ba Ver foto";return}var a=i/N.length,z=(i+1)/N.length,t=N[i].t;i++;var ok=0,f=function(){if(++ok===2)sig()};va(cv,lam,a,z,700,m,f);di(t,f)})()}});' +
      'if(S&&S.onvoiceschanged!==undefined)S.onvoiceschanged=function(){V()}})();<\/script>';
  }
  /* lo que el motor de láminas toma del motor de folletos (mezcla de colores, transparencias y temas): fuera de la app
     no está, así que se copia lo mínimo; sin «rgba» los velos se pintaban opacos y la lámina salía oscura */
  function shim() {
    var FM = window.FOLLETO_MOTOR, TEM = {};
    if (FM && FM.TEMAS) Object.keys(FM.TEMAS).forEach(function (k) { var t = FM.TEMAS[k], o = {}; ['nombre', 'claro', 'fondo', 'panel', 'tinta', 'tinta2', 'acento', 'acento2', 'titulo', 'cuerpo'].forEach(function (c) { if (t[c] != null) o[c] = t[c]; }); TEM[k] = o; });
    return 'if(!window.FOLLETO_MOTOR)window.FOLLETO_MOTOR=(function(){function h(c){c=String(c||"#000").replace("#","");if(c.length===3)c=c[0]+c[0]+c[1]+c[1]+c[2]+c[2];var v=parseInt(c,16);return[(v>>16)&255,(v>>8)&255,v&255]}' +
      'return{TEMAS:' + JSON.stringify(TEM).replace(/</g, '\\u003c') + ',rgba:function(c,a){var x=h(c);return"rgba("+x[0]+","+x[1]+","+x[2]+","+a+")"},mezclar:function(a,b,t){var x=h(a),y=h(b);return"rgb("+Math.round(x[0]+(y[0]-x[0])*t)+","+Math.round(x[1]+(y[1]-x[1])*t)+","+Math.round(x[2]+(y[2]-x[2])*t)+")"}}})();';
  }
  var doc = ED.documento;
  ED.documento = function (res, modo) {
    var h = doc.apply(this, arguments);
    try {
      if (modo === 'web' && SRC && res && activo(res.C) && (h.indexOf('data-ej-anim') >= 0 || h.indexOf('data-lam=') >= 0)) {
        var k = h.lastIndexOf('</body>');
        if (k > 0) h = h.slice(0, k) + '<script>' + shim() + '<\/script><script>' + SRC.replace(/<\/script/gi, '<\\/script') + '<\/script>' + reproductor() + h.slice(k);
      }
    } catch (e) { console.warn('Ejemplos animados', e); }
    return h;
  };
  window.EU_EJ_ANIM = { listo: function () { return !!SRC; }, reproductor: reproductor, shim: shim };
})();
