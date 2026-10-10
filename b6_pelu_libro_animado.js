/* b6_pelu_libro_animado.js — las técnicas animadas de EU_PARTICIONES también en el libro (página `pe_animada`).
   Libro = curso: cada técnica del catálogo de b6_pelu_particiones.js (las de los diagramas de Fátima en «Secciones,
   elevación y mecha guía» y las 16 del Cerebro —color, mechas, hidratación, queratina, químicos, cabello— en su unidad
   cb_<técnica>) sale con las MISMAS escenas, textos y preguntas que su lección «Diagramación · …» del curso premium.
   · Impreso (PDF/EPUB): hasta 4 fotogramas finales con el título y la explicación de cada paso, y el repaso con soluciones.
   · Libro interactivo (web): «▶ Ver y escuchar» reproduce todas las escenas en un lienzo, frase a frase con voz es-ES,
     y las preguntas se corrigen al tocarlas.
   Primero ocupa huecos (páginas sin contenido, relleno, lecturas sobrantes) de su unidad; las técnicas que no caben
   van en un anexo antes del solucionario, una hoja por técnica (Fátima, 10-10-2026; `cfg.acab.anexo = 'no'` lo apaga). No toca pe_tecnica, pe_guia3d ni pe_diagrama.
   `cfg.acab.animadas = 'no'` lo apaga. Cargar después de b6_pelu_particiones.js y b6_pelu_libro_diagrama.js. */
(function () {
  'use strict';
  var ED = window.EU_EDITORIAL; if (!ED || window.EU_PELU_LIBRO_ANIM) return;
  function es(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }

  /* escenas de una técnica (se guardan: el libro se repinta muchas veces) */
  var CACHE = {}, NO_IMPRESO = /^cb_receta$|_preparacion$|_cierre$/;
  function datos(id) {
    if (CACHE[id]) return CACHE[id];
    var PA = window.EU_PARTICIONES, DG = window.EU_DIAGRAMA; if (!PA || !DG || !PA.construirYa) return null;
    var E = null; try { E = PA.construirYa(id); } catch (e) { console.warn('Técnica animada', id, e); }
    if (!E || !E.escenas || !E.escenas.length) return null;
    /* impreso: hasta 4 escenas repartidas a lo largo de la técnica, siempre con la última (la forma final) */
    /* Fátima, 10-10-2026: sin imágenes repetidas en el PDF. Las escenas de preparación (cabeza sin cabello y lista
       de materiales) y de aclarado eran iguales en muchas técnicas: en el impreso se eligen escenas de trabajo y el
       resultado; en la animación siguen todas. */
    var n = E.escenas.length, sel = [], cand = [];
    for (var c0 = 0; c0 < n; c0++) if (!NO_IMPRESO.test(E.escenas[c0].tipo || '')) cand.push(c0);
    if (!cand.length) for (var c1 = 0; c1 < n; c1++) cand.push(c1);
    var m = cand.length;
    if (m <= 4) sel = cand.slice();
    else [0, Math.round((m - 1) / 3), Math.round(2 * (m - 1) / 3), m - 1].forEach(function (k) { if (sel.indexOf(cand[k]) < 0) sel.push(cand[k]); });
    var fotos = sel.map(function (k) { try { return DG.foto(E.escenas[k], 640, 0.8); } catch (e) { return ''; } });
    return (CACHE[id] = { E: E, sel: sel, fotos: fotos });
  }

  var SCRIPT = '<script>(function(){if(window.__paLibro)return;window.__paLibro=1;var V=null,act=null;' +
    'function voz(){if(!window.speechSynthesis)return null;var v=speechSynthesis.getVoices().filter(function(x){return/^es/i.test(x.lang)});return v.filter(function(x){return/google/i.test(x.name)&&/es-ES/i.test(x.lang)})[0]||v.filter(function(x){return/es-ES/i.test(x.lang)})[0]||v[0]||null}' +
    'var IM={};function fondo(k){if(!IM[k]&&window.DG_FONDOS&&DG_FONDOS[k]){IM[k]=new Image();IM[k].src=DG_FONDOS[k]}return IM[k]}' +
    'function para(){if(window.speechSynthesis)speechSynthesis.cancel();if(act){act.b.textContent="▶ Ver y escuchar";act.cv.remove();act.gr.style.display="";if(act.sub)act.sub.textContent=""}act=null}' +
    'document.addEventListener("click",function(ev){var b=ev.target.closest("[data-pa-play]");if(b){var pg=b.closest("[data-pa-pg]");if(act&&act.pg===pg)return para();para();if(!window.DG_PINTA)return;V=V||voz();' +
    'var A=JSON.parse(pg.querySelector("[data-pa-anim]").textContent),gr=pg.querySelector("[data-pa-grid]"),sub=pg.querySelector("[data-pa-sub]"),cv=document.createElement("canvas");cv.width=640;cv.height=512;cv.style.cssText="width:100%;max-width:150mm;height:auto;display:block;margin:0 auto 2mm;border-radius:6px";gr.parentNode.insertBefore(cv,gr);gr.style.display="none";' +
    'var x=cv.getContext("2d"),i=0,me={pg:pg,b:b,cv:cv,gr:gr,sub:sub};act=me;b.textContent="❚❚ Parar";cv.scrollIntoView({block:"nearest",behavior:"smooth"});' +
    '(function sig(){if(act!==me)return;if(i>=A.length){para();return}var a=A[i++],im=fondo(a.v),dur=Math.max(5000,a.s.length*65),t0=performance.now(),hab=0,acabo=0;if(sub)sub.textContent=i+"/"+A.length+" · "+a.t+": "+a.s;' +
    'function fin(){if(hab&&acabo&&act===me)setTimeout(sig,400)}' +
    '(function cuadro(){if(act!==me)return;var p=Math.min(1,(performance.now()-t0)/dur);DG_PINTA(x,a.a,im,0,0,640,512,p);if(p<1)requestAnimationFrame(cuadro);else{acabo=1;fin()}})();' +
    'if(V&&window.speechSynthesis){var u=new SpeechSynthesisUtterance(a.t+". "+a.s);u.voice=V;u.lang="es-ES";u.onend=u.onerror=function(){hab=1;fin()};speechSynthesis.speak(u)}else hab=1})();return}' +
    'var q=ev.target.closest("[data-pa-op]");if(q){var box=q.closest("[data-pa-q]"),c=+box.dataset.c,acc=box.closest("[data-pa-pg]").dataset.acc;box.querySelectorAll("[data-pa-op]").forEach(function(x){x.disabled=true;if(+x.dataset.paOp===c){x.style.background=acc;x.style.color="#fff"}});if(+q.dataset.paOp!==c)q.style.background="#F3D3D3";var w=box.querySelector("[data-pa-x]");if(w)w.style.display=""}' +
    '})})();<\/script>';

  function pagina(pg, C, modo) {
    var H = ED.H, T = C.T, d = datos(pg.tec), web = modo === 'web', rad = Math.min(T.r || 4, 6);
    if (!d) return H.cabecera(C, pg) + H.h1(C, es(pg.titulo || 'Técnica animada')) + '<p style="font-size:.85em">La animación se prepara con el maniquí de Guías 3D: vuelve a abrir esta página en un momento.</p>' + H.folio(C, pg);
    var E = d.E, cab = '<div style="font-size:.74em;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:' + T.acc + ';margin:0 0 1.5mm">Técnica paso a paso · ' + E.escenas.length + ' pasos animados</div>' + H.h1(C, es(E.R.n));
    var ctrl = web ? '<div style="display:flex;gap:3mm;align-items:center;margin:0 0 2.5mm"><button data-pa-play="1" style="font:inherit;font-size:.86em;padding:1.5mm 4mm;border:0;border-radius:' + rad + 'px;background:' + T.acc + ';color:#fff;cursor:pointer;white-space:nowrap;flex:none">▶ Ver y escuchar</button><span data-pa-sub="1" style="font-size:.8em;font-style:italic;opacity:.85;min-width:0"></span></div>'
      : '<div style="font-size:.76em;opacity:.8;margin:0 0 2.5mm">Los ' + E.escenas.length + ' pasos, animados y con voz, en el libro interactivo y en el curso premium.</div>';
    var figs = d.sel.map(function (k, j) {
      var e = E.escenas[k];
      return '<figure style="margin:0;background:' + T.soft + ';border-radius:' + rad + 'px;padding:1.5mm">' +
        '<img src="' + d.fotos[j] + '" alt="' + es(e.t) + '" style="width:100%;height:auto;display:block;border-radius:' + rad + 'px">' +
        '<figcaption style="font-size:.64em;line-height:1.3;margin-top:1.2mm"><b style="font-family:' + T.tit + ';color:' + T.acc + ';font-size:1.12em;display:block">' + (k + 1) + ' · ' + es(e.t) + '</b>' + es(e.texto) + '</figcaption></figure>';
    }).join('');
    var grid = '<div data-pa-grid="1" style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:3mm">' + figs + '</div>';
    var Q = (E.preguntas || []).slice(0, 3);
    var test = Q.length ? '<div style="margin-top:2.5mm;font-size:.74em"><b style="font-family:' + T.tit + ';color:' + T.acc + '">Compruébalo</b><div style="display:grid;grid-template-columns:repeat(' + Q.length + ',minmax(0,1fr));gap:3mm">' + Q.map(function (q, i) {
      return '<div data-pa-q="1" data-c="' + q.c + '" style="margin-top:1.5mm"><div>' + (i + 1) + '. ' + es(q.e) + '</div>' + (web ? '<div style="display:flex;flex-wrap:wrap;gap:1mm;margin-top:1mm">' + q.o.map(function (o, j) {
        return '<button data-pa-op="' + j + '" style="font:inherit;font-size:.95em;padding:.8mm 2.5mm;line-height:1.25;text-align:left;border:0.3mm solid ' + T.acc + ';background:#fff;border-radius:' + rad + 'px;cursor:pointer">' + es(o) + '</button>';
      }).join('') + '</div>' + (q.x ? '<div data-pa-x="1" style="display:none;margin-top:1mm;font-style:italic">✅ ' + es(q.x) + '</div>' : '') : '<div style="opacity:.85">' + q.o.map(function (o, j) { return String.fromCharCode(97 + j) + ') ' + es(o); }).join('   ') + '</div>') + '</div>';
    }).join('') + '</div>' + (web ? '' : '<div style="font-size:.85em;opacity:.7;margin-top:1.5mm">Soluciones: ' + Q.map(function (q, i) { return (i + 1) + String.fromCharCode(97 + q.c); }).join(' · ') + '</div>') + '</div>' : '';
    var anim = web ? '<script type="application/json" data-pa-anim="1">' + JSON.stringify(E.escenas.map(function (e) { return { v: e.vista, t: e.t, s: e.texto, a: e.anim }; })).replace(/</g, '\\u003c') + '<\/script>' : '';
    return H.cabecera(C, pg) + '<div data-pa-pg="1" data-acc="' + es(T.acc) + '">' + cab + ctrl + grid + test + anim + '</div>' + (web ? SCRIPT : '') + H.folio(C, pg);
  }
  function voz(pg) { var d = datos(pg.tec); return d ? d.E.R.n + '. ' + d.E.escenas.map(function (e) { return e.t + '. ' + e.texto; }).join(' ') : ''; }
  ED.registrar({ paginas: { pe_animada: pagina }, voz: { pe_animada: voz } });

  /* libro interactivo: fondos del maniquí y función de pintar, una sola vez (si la diagramación de cortes ya los puso, no se repiten) */
  var doc0 = ED.documento;
  ED.documento = function (res, modo) {
    var h = doc0.apply(this, arguments), DG = window.EU_DIAGRAMA;
    if (modo !== 'web' || !DG || !/data-pa-pg/.test(h) || /window\.DG_FONDOS=/.test(h)) return h;
    var F = DG.fondosYa && DG.fondosYa(); if (!F) return h;
    var s = '<script>window.DG_FONDOS=' + JSON.stringify(F) + ';window.DG_PINTA=' + DG.pinta.toString() + ';<\/script>';
    return h.replace(/<\/body>/i, function () { return s + '</body>'; });
  };

  /* huecos de una unidad, de más a menos prescindible:
     −1 página llegada sin contenido · 1 actividad de relleno · 2 figura de relleno ·
     3 lecturas sobrantes: la unidad conserva siempre su primera lectura; se usan las siguientes, empezando por la última */
  function huecos(res, uid) {
    var c = [], lec = 0;
    res.pages.forEach(function (p, i) {
      if (!p.u || p.u.id !== uid) return;
      if (p.tipo === 'lec_amplia' && !p.ds) return c.push([-1, i]);
      if (p.relleno && (p.tipo === 'actividad' || p.tipo === 'ficha')) return c.push([1, i]);
      if (p.relleno && p.tipo === 'vis') return c.push([2, i]);
      if (/^lec_(amplia|concepto|lectura|caso|proyecto)$/.test(p.tipo) && ++lec > 1) c.push([3, i]);
    });
    return c.sort(function (a, b) { return a[0] - b[0] || (a[0] === 3 ? b[1] - a[1] : a[1] - b[1]); });
  }
  var ESPERA = 0;
  function prepararMotor() {
    if (ESPERA) return; ESPERA = 1;
    window.EU_DIAGRAMA.fondos().then(function () {
      document.querySelectorAll('editorial-escolar').forEach(function (e) { if (e.cfg && e.cfg.materia === 'pelu' && e.programar) e.programar(); });
    }, function (er) { ESPERA = 0; console.warn('Técnicas animadas del libro', er); });
  }
  function repartir(res, cfg) {
    var PA = window.EU_PARTICIONES;
    if (!res || !res.pages || !cfg || cfg.materia !== 'pelu' || !PA || !window.EU_DIAGRAMA || (((cfg.acab || {}).animadas) === 'no')) return res;
    if (!window.EU_DIAGRAMA.fondosYa()) { prepararMotor(); return res; }
    var hay = {}, ya = {}, quitadas = {}, n = 0, solo = [], unidad = {};
    res.pages.forEach(function (p) { if (p.u) { hay[p.u.id] = 1; if (!unidad[p.u.id]) unidad[p.u.id] = p; } if (p.tipo === 'pe_animada') ya[p.tec] = 1; });
    /* por unidad: se eligen los huecos y las técnicas van en ellos en el orden del catálogo (el mismo del curso) */
    var porU = {}, orden = [];
    PA.catalogo().forEach(function (t) { if (!hay[t.unidad] || ya[t.id]) return; if (!porU[t.unidad]) { porU[t.unidad] = []; orden.push(t.unidad); } porU[t.unidad].push(t); });
    orden.forEach(function (uid) {
      var T = porU[uid], idx = huecos(res, uid).slice(0, T.length).map(function (h) { return h[1]; }).sort(function (a, b) { return a - b; });
      T.forEach(function (t, j) {
        if (j >= idx.length) { solo.push(t); return; }
        var i = idx[j], p = res.pages[i];
        res.pages[i] = { tipo: 'pe_animada', u: p.u, n: p.n, num: p.num, tec: t.id, titulo: t.n, fill2: { nada: 1 } };
        quitadas[p.num] = 1; ya[t.id] = 1; n++;
      });
    });
    /* las soluciones de las páginas sustituidas salen del solucionario (la página nueva lleva las suyas) */
    res.pages.forEach(function (p) { if (p.tipo === 'solucion' && p.entradas) p.entradas = p.entradas.filter(function (e) { return !quitadas[e.p]; }); });
    /* Fátima, 10-10-2026 · ANEXO: las técnicas y clases que no caben en los huecos de su unidad van en hojas nuevas,
       una por técnica, antes del solucionario. El libro crece en esas hojas (libro web, PDF imprimible y paquete).
       `cfg.acab.anexo = 'no'` lo apaga y vuelve al comportamiento anterior (solo en el curso). */
    var anexo = [];
    if (solo.length && ((cfg.acab || {}).anexo) !== 'no') {
      solo.forEach(function (t) { var ref = unidad[t.unidad]; anexo.push({ tipo: 'pe_animada', u: ref.u, n: ref.n, tec: t.id, titulo: t.n, anexo: 1, fill2: { nada: 1 } }); ya[t.id] = 1; });
      var tipos = res.pages.map(function (p) { return p.tipo; }), pos = tipos.indexOf('solucion');
      if (pos < 0) pos = tipos.indexOf('bibliografia'); if (pos < 0) pos = tipos.indexOf('contra'); if (pos < 0) pos = res.pages.length;
      res.pages.splice.apply(res.pages, [pos, 0].concat(anexo));
      /* nueva numeración; el solucionario sigue apuntando a sus páginas */
      var nueva = {};
      res.pages.forEach(function (p, i) { if (p.num != null) nueva[p.num] = i + 1; });
      res.pages.forEach(function (p, i) { p.num = i + 1; });
      res.pages.forEach(function (p) { if (p.tipo === 'solucion' && p.entradas) p.entradas.forEach(function (e) { if (nueva[e.p]) e.p = nueva[e.p]; }); });
    }
    res.animadas = { libro: n, anexo: anexo.length, soloCurso: anexo.length ? [] : solo.map(function (t) { return t.id; }) };
    return res;
  }
  function enganchar() {
    if (ED.__peluLibroAnim) return; ED.__peluLibroAnim = 1;
    var ens = ED.ensamblar;
    ED.ensamblar = function (cfg) { var r = ens.apply(this, arguments); try { repartir(r, cfg); } catch (e) { console.warn('pelu técnicas animadas', e); } return r; };
  }
  /* después de la diagramación de cortes del libro (que espera a la guía 3D y a la segunda pasada de modelos) */
  function esperar() { if (ED.__peluLibroDg || !window.EU_PELU_LIBRO_DG) enganchar(); else setTimeout(esperar, 300); }
  if (document.readyState === 'complete') setTimeout(esperar, 80); else window.addEventListener('load', function () { setTimeout(esperar, 80); });

  /* fotograma final de cualquier escena de una técnica (para que otras páginas usen imágenes distintas a las de esta) */
  function foto(id, k, w, prog) {
    var d = datos(id); if (!d || !d.E.escenas[k]) return '';
    var key = k + '|' + (w || 480) + '|' + (prog == null ? 1 : prog); d.extra = d.extra || {};
    if (d.extra[key] == null) { try { d.extra[key] = window.EU_DIAGRAMA.foto(d.E.escenas[k], w || 480, 0.8, prog) || ''; } catch (e) { d.extra[key] = ''; } }
    return d.extra[key];
  }
  window.EU_PELU_LIBRO_ANIM = { pagina: pagina, repartir: repartir, datos: datos, foto: foto, NO_IMPRESO: NO_IMPRESO };
})();
