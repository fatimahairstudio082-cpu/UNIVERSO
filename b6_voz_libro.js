/* b6_voz_libro.js — «▶ Ver y escuchar» en el libro interactivo (window.EU_VOZ_LIBRO). Todas las materias, 10–1000 págs.
   · Cada página web lleva su narración preparada (EU_EDITORIAL.textoVoz: la misma que usa la app, tutor incluido;
     si una página no tiene, se lee su texto visible) y un botón «▶ Ver y escuchar» que la lee frase a frase,
     resaltando en la página lo que se está diciendo, con pausas naturales entre frases.
   · Voz: «Google español · es-ES» primero (la misma regla del curso premium); si el aparato no la tiene, la mejor es-ES.
   · Modo pódcast (por defecto; `cfg.acab.podcast = 'no'` lo quita): las preguntas, pistas y respuestas las dice una
     segunda voz española si el aparato la tiene; si no, la misma voz con otro tono.
   · «▶ Escuchar el libro» (barra fija): lee el libro entero, página tras página, y va pasando las páginas.
   · Impreso y EPUB no cambian. `cfg.acab.voz = 'no'` deja el «Escuchar» de siempre.
   Las páginas que ya traen su propio «▶ Ver y escuchar» (guía 3D, Estudios, biblioteca) lo conservan. */
(function () {
  'use strict';
  var ED = window.EU_EDITORIAL; if (!ED || window.EU_VOZ_LIBRO) return;
  function acab(C) { return (C && C.cfg && C.cfg.acab) || {}; }
  function activo(C) { return acab(C).voz !== 'no'; }
  function es(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  /* narración de la página, guardada dentro de la propia página (invisible) */
  ED.registrar({
    post: function (h, pg, C, modo) {
      if (modo !== 'web' || !activo(C)) return h;
      var t = ''; try { t = ED.textoVoz(pg, C) || ''; } catch (e) { t = ''; }
      t = String(t).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      /* entrada de la guía, como en una clase: solo marco, sin contenido nuevo */
      var g = (C.guia && C.guia.n) || '';
      if (t && g && pg.tipo === 'explica') t = g + ' te lo explica. ' + t;
      else if (t && g && (pg.tipo === 'actividad' || pg.tipo === 'ficha')) t = 'Vamos a practicar con ' + g + '. ' + t;
      return h + '<template data-narra="1">' + es(t) + '</template>';
    }
  });

  /* reproductor que viaja dentro del HTML descargado (sin dependencias) */
  function script(C) {
    var guia = (C.guia && C.guia.n) || '', pod = acab(C).podcast !== 'no';
    return '<script>(function(){var S=window.speechSynthesis;if(!S)return;var POD=' + (pod ? 1 : 0) + ',GUIA=' + JSON.stringify(guia) + ';' +
      'function V(){var v=S.getVoices().filter(function(x){return /^es/i.test(x.lang)}),ES=function(x){return /es[-_]ES/i.test(x.lang)};' +
      'var a=v.filter(function(x){return /google/i.test(x.name)&&ES(x)})[0]||v.filter(ES)[0]||v[0]||null;' +
      'var b=v.filter(function(x){return x!==a&&ES(x)})[0]||v.filter(function(x){return x!==a})[0]||null;return [a,b]}' +
      'function txt(p){var t=p.querySelector("template[data-narra]"),s=t?t.innerHTML.replace(/&lt;/g,"<").replace(/&amp;/g,"&").trim():"";if(s)return s;' +
      'var fc=p.firstElementChild,cab=fc&&/space-between/.test(fc.getAttribute("style")||"")?(fc.innerText||"").split(/\\n+/).map(function(x){return x.trim()}):[],bt=[].slice.call(p.querySelectorAll("button")).map(function(x){return x.textContent.trim()});' +
      'return (p.innerText||"").split(/\\n+/).map(function(x){return x.replace(/\\s+/g," ").trim()}).filter(function(x){return x&&x.length>1&&!/^\\d+$/.test(x)&&cab.indexOf(x)<0&&bt.indexOf(x)<0&&!/^(Escuchar|Comprobar)$/.test(x)})' +
      '.map(function(x){return /[.!?:;\u2026\u00bb"]$/.test(x)?x:x+"."}).join(" ")}' +
      'function frases(s){return (s.match(/[^.!?\\u2026]+[.!?\\u2026]*["\\u00bb)]*\\s*/g)||[]).map(function(x){return x.trim()}).filter(function(x){return /[a-z0-9\\u00c0-\\u024f]/i.test(x)})}' +
      'function n(s){return String(s).replace(/\\s+/g," ").toLowerCase()}' +
      'var marca=null;function luz(p,f){if(marca){marca.style.background=marca.dataset.bg||"";marca.style.boxShadow="";marca=null}if(!p||!f)return;' +
      'var F=n(f),c=F.indexOf(":"),w=F.split(" "),ks=[F.slice(0,38),c>0&&c<28?F.slice(c+1).trim().slice(0,30):"",w.slice(1,6).join(" "),w.slice(-5).join(" ")].filter(function(k){return k.length>8}),m=null,es=[].slice.call(p.querySelectorAll("p,li,td,h1,h2,h3,div,span,b"));' +
      'for(var q=0;q<ks.length&&!m;q++)es.forEach(function(e){var t=n(e.textContent);if(t.indexOf(ks[q])>=0&&(!m||t.length<=n(m.textContent).length))m=e});' +
      'if(m&&n(m.textContent).length<1200){m.dataset.bg=m.style.background||"";m.style.background="rgba(255,213,79,.38)";m.style.boxShadow="0 0 0 2px rgba(255,193,7,.5)";marca=m}}' +
      'var E={p:null,f:[],i:0,on:0,libro:0,b:null,ses:0};' +
      'function boton(p){return p.querySelector("button[data-vyl]")}' +
      'function parar(){E.ses=(E.ses||0)+1;E.on=0;E.libro=0;if(window.EU_BIL)EU_BIL.parar();S.cancel();luz();[].slice.call(document.querySelectorAll("button[data-vyl]")).forEach(function(b){b.textContent="\\u25b6 Ver y escuchar"});if(G)G.textContent="\\u25b6 Escuchar el libro"}' +
      'function dice(){if(!E.on)return;if(E.i>=E.f.length){luz();var b=boton(E.p);if(b)b.textContent="\\u25b6 Ver y escuchar";if(E.libro)siguiente();else E.on=0;return}' +
      'var f=E.f[E.i],vv=V(),otra=POD&&(/\\?\\s*$/.test(f)||/^(pista|respuesta|la respuesta|piensa)/i.test(f)),u=new SpeechSynthesisUtterance(f);' +
      /* (10-10-2026) Inglés e Idiomas: lo escrito en inglés se dice con voz inglesa (b6_voz_bilingue.js) */
      'if(window.EU_BIL&&EU_BIL.activo&&EU_BIL.hay(f)){var ss=E.ses;luz(E.p,f);EU_BIL.decir(f,{rate:.95,es:otra&&vv[1]?vv[1]:vv[0],pitch:otra&&!vv[1]?.82:1},function(){if(ss!==E.ses)return;E.i++;setTimeout(function(){if(ss===E.ses)dice()},f.length>60?420:300)});return}' +
      'u.lang="es-ES";var v=otra&&vv[1]?vv[1]:vv[0];if(v)u.voice=v;u.rate=.95;u.pitch=otra&&!vv[1]?.82:1;luz(E.p,f);' +
      'var s1=E.ses;u.onend=function(){if(s1!==E.ses)return;E.i++;setTimeout(function(){if(s1===E.ses)dice()},f.length>60?420:300)};u.onerror=function(){if(s1!==E.ses)return;E.i++;setTimeout(function(){if(s1===E.ses)dice()},200)};S.speak(u)}' +
      'function empieza(p){if(window.EU_BIL)EU_BIL.parar();E.ses=(E.ses||0)+1;S.cancel();E.p=p;E.f=frases(txt(p));E.i=0;E.on=1;var b=boton(p);if(b)b.textContent="\\u25a0 Parar";p.scrollIntoView({behavior:"smooth",block:"start"});var s0=E.ses;setTimeout(function(){if(s0===E.ses)dice()},250)}' +
      'function siguiente(){var ps=[].slice.call(document.querySelectorAll(".pg")),k=ps.indexOf(E.p)+1;while(k<ps.length&&!frases(txt(ps[k])).length)k++;if(k>=ps.length){parar();return}empieza(ps[k])}' +
      '[].slice.call(document.querySelectorAll(".pg")).forEach(function(p){[].slice.call(p.children).forEach(function(b){if(b.tagName==="BUTTON"&&b.textContent==="Escuchar")b.remove()});' +
      'if([].slice.call(p.querySelectorAll("button")).some(function(b){return /ver y escuchar/i.test(b.textContent)}))return;if(!frases(txt(p)).length)return;' +
      'var b=document.createElement("button");b.setAttribute("data-vyl","1");b.textContent="\\u25b6 Ver y escuchar";b.style.cssText="position:absolute;top:5mm;right:5mm;z-index:5;font:600 12px system-ui,sans-serif;padding:5px 12px;border-radius:99px;border:0;background:#1f1b18;color:#fff;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.25)";' +
      'b.onclick=function(){if(E.on&&E.p===p){parar();return}E.libro=0;empieza(p)};p.appendChild(b)});' +
      'var G=document.createElement("button");G.textContent="\\u25b6 Escuchar el libro";G.style.cssText="position:fixed;right:16px;bottom:16px;z-index:9;font:600 13px system-ui,sans-serif;padding:10px 16px;border-radius:99px;border:0;background:#B5476B;color:#fff;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.3)";' +
      'G.onclick=function(){if(E.on&&E.libro){parar();return}var ps=[].slice.call(document.querySelectorAll(".pg")),y=window.scrollY,p=ps.filter(function(x){return x.offsetTop+x.offsetHeight>y+40})[0]||ps[0];E.libro=1;G.textContent="\\u25a0 Parar";empieza(p)};' +
      'document.body.appendChild(G);if(S.onvoiceschanged!==undefined)S.onvoiceschanged=function(){V()};V();' +
      'var t=document.createElement("div");t.style.cssText="position:fixed;right:16px;bottom:62px;z-index:9;font:11px system-ui,sans-serif;color:#555;background:rgba(255,255,255,.9);padding:3px 8px;border-radius:6px";' +
      'setTimeout(function(){var v=V();t.textContent=v[0]?"Voz: "+v[0].name+(POD&&v[1]?" \\u00b7 "+v[1].name:""):"";if(t.textContent)document.body.appendChild(t)},900);' +
      '})();<\/script>';
  }
  var doc = ED.documento;
  ED.documento = function (res, modo) {
    var h = doc.apply(this, arguments);
    try { if (modo === 'web' && res && res.C && activo(res.C)) { var k = h.lastIndexOf('</body>'); if (k > 0) h = h.slice(0, k) + script(res.C) + h.slice(k); } } catch (e) { console.warn('Voz del libro', e); }
    return h;
  };
  window.EU_VOZ_LIBRO = { script: script };
})();
