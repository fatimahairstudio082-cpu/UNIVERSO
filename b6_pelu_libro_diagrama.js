/* b6_pelu_libro_diagrama.js — la diagramación de cortes dentro del libro de Peluquería (página `pe_diagrama`).
   Usa el motor EU_DIAGRAMA (b6_pelu_diagrama.js) sobre el maniquí de Guías 3D, sin editar ningún motor:
   · Una página por corte del libro (receta del catálogo EU_CORTES con su cabello): capas en la nuca, lateral
     (división de oreja a oreja) y frente (guía a su altura), cada vista con su explicación, ficha y repaso.
   · Además, una página por cada corte guardado en «✏️ Crear mi corte» (localStorage eu_cortes_mios, solo lectura)
     y por cada técnica de EU_GEOMETRIA_CAPILAR (las «a validar por Fátima» salen marcadas así).
   · Impreso: el fotograma final de cada vista. Libro interactivo (web): «▶ Ver diagramación» anima las tres
     vistas con voz es-ES; las preguntas se corrigen al tocarlas.
   Solo ocupa páginas de relleno de las unidades de corte (actividades de relleno, lecturas sobrantes); si no hay
   hueco, el corte no se añade. El número de páginas del libro no cambia. `cfg.acab.diagramas = 'no'` lo apaga.
   Cargar después de b6_pelu_libro3d.js, b6_pelu_diagrama.js y b6_pelu_geometria.js. */
(function () {
  'use strict';
  var ED = window.EU_EDITORIAL; if (!ED || window.EU_PELU_LIBRO_DG) return;
  var ALT_N = { cejas: 'bajo las cejas', ojo: 'bajo el ojo', nariz: 'bajo la nariz', labio: 'bajo el labio', barbilla: 'en la barbilla', rostro: 'donde termina el rostro', cuello: 'en el cuello' };
  var VISTAS = ['lateral', 'frente', 'capas'];
  function es(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }

  /* receta y escenas de una página (se guardan: el libro se repinta muchas veces) */
  var CACHE = {};
  function receta(dg) {
    var DG = window.EU_DIAGRAMA, GC = window.EU_GEOMETRIA_CAPILAR; if (!DG) return null;
    if (dg.k === 'corte') return DG.receta(dg.corte, dg.cab);
    if (dg.k === 'tec') { var t = GC && GC.tecnica(dg.id); return t ? GC.receta(t) : null; }
    if (dg.k === 'mio') return GC ? GC.receta(dg.o) : DG.libre(dg.o);
    if (dg.k === 'var') { var v = GC && GC.variante && GC.variante(dg.id); return v ? GC.receta(v) : null; }
    return null;
  }
  function clave(dg) { return dg.k + '|' + (dg.corte || dg.id || (dg.o && dg.o.n)) + '|' + (dg.cab || ''); }
  function datos(dg) {
    var k = clave(dg); if (CACHE[k]) return CACHE[k];
    var DG = window.EU_DIAGRAMA, R = receta(dg); if (!DG || !R || !DG.construirYa) return null;
    var E = null; try { E = DG.construirYa(R); } catch (e) { console.warn('Diagramación', k, e); }
    if (!E) return null;
    var por = {}; E.escenas.forEach(function (e) { por[e.tipo] = e; });
    var vis = VISTAS.map(function (t) { return por[t]; }).filter(Boolean);
    if (por.oblicua) vis[2] = por.oblicua;
    var d = { R: E.R, E: E, vis: vis, fotos: vis.map(function (e) { return DG.foto(e, 640, 0.8); }) };
    return (CACHE[k] = d);
  }

  function escena(d, tipo) { return d && d.E ? d.E.escenas.filter(function (e) { return e.tipo === tipo; })[0] : null; }
  var FOTOS = {};
  function fotoEscena(dg, tipo) {
    var k = clave(dg) + '|' + tipo; if (FOTOS[k] !== undefined) return FOTOS[k];
    var d = datos(dg), e = escena(d, tipo), f = ''; try { f = e ? window.EU_DIAGRAMA.foto(e, 640, 0.8) : ''; } catch (er) { f = ''; }
    return (FOTOS[k] = f);
  }
  /* la regla del lateral ya va en la ficha de la página: en la leyenda solo lo propio de este corte */
  function leyenda(e, d, dg) {
    if (dg && dg.k === 'var' && d) {
      /* variantes: el método ya se explica en las páginas de técnica; aquí solo los datos de esta combinación */
      var R = d.R, g = function (a) { return a.map(function (x) { return x + '°'; }).join(' · '); };
      if (e.tipo === 'lateral') return (R.liso ? 'Secciones horizontales (liso extremo)' : 'Secciones verticales') + '; delante: ' + g(R.frente.pila) + (R.desg ? ', desgrafilado' : '') + '.';
      if (e.tipo === 'frente') return 'Guía a 0° ' + (ALT_N[R.altura] || R.altura) + (R.linea === 'recta' ? '; línea recta' : R.linea === 'redondeada' ? '; línea hacia delante' : '') + '.';
      if (e.tipo === 'capas') return 'Atrás, de abajo arriba: ' + g(R.capas.pila) + '.';
    }
    return String(e.texto || '').replace(/^El lateral, delante de la división de oreja a oreja\.\s*/, '');
  }
  /* ficha de la receta: solo lo que dice la receta (catálogo, técnica de Fátima o corte guardado) */
  function ficha(d, dg, T) {
    var R = d.R, pila = R.capas.pila || [], part = R.oblicua ? 'oblicua (box universal)' : R.liso ? 'horizontal (liso extremo)' : 'vertical';
    var chips = pila.map(function (g, z) { return '<span style="display:inline-block;margin:0 1mm 1mm 0;padding:.4mm 2mm;border-radius:99px;background:' + T.soft + ';white-space:nowrap"><b style="color:' + T.acc + '">' + (R.libre ? z + 1 : 'Z' + z) + '</b> ' + g + '°</span>'; }).join('');
    var GC = window.EU_GEOMETRIA_CAPILAR, t = !GC ? null : dg.k === 'tec' ? GC.tecnica(dg.id) : dg.k === 'var' ? GC.variante(dg.id) : null;
    /* si delante se trabaja distinto que atrás (variantes, cortes propios), se ven las dos pilas */
    var fr = (R.frente && R.frente.pila) || pila, dos = fr.join() !== pila.join();
    var chipsF = fr.map(function (g, z) { return '<span style="display:inline-block;margin:0 1mm 1mm 0;padding:.4mm 2mm;border-radius:99px;background:' + T.soft + ';white-space:nowrap"><b style="color:' + T.acc + '">' + (z + 1) + '</b> ' + g + '°</span>'; }).join('');
    return '<div style="font-size:.74em;line-height:1.4;display:grid;gap:1.2mm">' +
      '<div><b>' + (dos ? 'Atrás, capas de abajo arriba:' : 'Capas de abajo arriba:') + '</b><div style="margin-top:1mm">' + chips + '</div></div>' +
      (dos ? '<div><b>Delante, capas de abajo arriba:</b><div style="margin-top:1mm">' + chipsF + '</div></div>' : '') +
      '<div><b>Secciones:</b> ' + part + ' · <b>Lateral:</b> dividido de oreja a oreja</div>' +
      '<div><b>Guía del frente:</b> a 0°, ' + es(ALT_N[R.altura] || R.altura) + (R.fuenteAltura === 'ejemplo' ? ' (ejemplo)' : '') + '</div>' +
      (R.linea ? '<div><b>Línea de corte:</b> ' + (R.linea === 'recta' ? 'recta (queda cuadrado)' : 'hacia delante (queda redondeado)') + '</div>' : '') +
      '<div><b>Acabado:</b> ' + (R.desg ? 'desgrafilado' : 'recto') + (R.punto ? ' · lateral llevado a un punto' : '') + '</div>' +
      (t && t.variante ? '<div>Atrás como en «' + es(GC.tecnica(t.base[0]).n) + '»; delante como en «' + es(GC.tecnica(t.base[1]).n) + '».</div>' : t && t.texto ? '<div>' + es(t.texto) + '</div>' : '') +
      (t && t.validar ? '<div style="color:#A0522D;font-weight:700">Elevaciones de ejemplo, a validar por Fátima.</div>' : '') + '</div>';
  }

  var SCRIPT = '<script>(function(){if(window.__dgLibro)return;window.__dgLibro=1;var V=null,act=null;' +
    'function voz(){if(!window.speechSynthesis)return null;var v=speechSynthesis.getVoices().filter(function(x){return/^es/i.test(x.lang)});return v.filter(function(x){return/google/i.test(x.name)&&/es-ES/i.test(x.lang)})[0]||v.filter(function(x){return/es-ES/i.test(x.lang)})[0]||v[0]||null}' +
    'var IM={};function fondo(k){if(!IM[k]&&window.DG_FONDOS&&DG_FONDOS[k]){IM[k]=new Image();IM[k].src=DG_FONDOS[k]}return IM[k]}' +
    'function para(){if(window.speechSynthesis)speechSynthesis.cancel();if(act){act.b.textContent="▶ Ver diagramación";act.fin=1}act=null}' +
    'document.addEventListener("click",function(ev){var b=ev.target.closest("[data-dg-play]");if(b){var pg=b.closest("[data-dg-pg]");if(act&&act.pg===pg)return para();para();if(!window.DG_PINTA)return;V=V||voz();' +
    'var A=JSON.parse(pg.querySelector("[data-dg-anim]").textContent),figs=pg.querySelectorAll("[data-dg-fig]"),sub=pg.querySelector("[data-dg-sub]"),i=0,me={pg:pg,b:b};act=me;b.textContent="❚❚ Parar";' +
    '(function sig(){if(act!==me)return;if(i>=A.length){para();return}var a=A[i],f=figs[i++],img=f.querySelector("img"),cv=document.createElement("canvas");cv.width=640;cv.height=512;cv.style.cssText="width:100%;height:auto;display:block;border-radius:inherit";img.style.display="none";var vie=f.querySelector("canvas");if(vie)vie.remove();img.parentNode.insertBefore(cv,img);' +
    'var x=cv.getContext("2d"),im=fondo(a.v),dur=Math.max(5000,a.s.length*65),t0=performance.now(),hab=0,acabo=0;if(sub)sub.textContent=a.s;f.scrollIntoView({block:"nearest",behavior:"smooth"});' +
    'function fin(){if(hab&&acabo&&act===me)setTimeout(sig,400)}' +
    '(function cuadro(){if(act!==me)return;var p=Math.min(1,(performance.now()-t0)/dur);DG_PINTA(x,a.a,im,0,0,640,512,p);if(p<1)requestAnimationFrame(cuadro);else{acabo=1;fin()}})();' +
    'if(V&&window.speechSynthesis){var u=new SpeechSynthesisUtterance(a.s);u.voice=V;u.lang="es-ES";u.onend=u.onerror=function(){hab=1;fin()};speechSynthesis.speak(u)}else hab=1})();return}' +
    'var q=ev.target.closest("[data-dg-op]");if(q){var box=q.closest("[data-dg-q]"),c=+box.dataset.c,acc=box.closest("[data-dg-pg]").dataset.acc;box.querySelectorAll("[data-dg-op]").forEach(function(x){x.disabled=true;if(+x.dataset.dgOp===c){x.style.background=acc;x.style.color="#fff"}});if(+q.dataset.dgOp!==c)q.style.background="#F3D3D3"}' +
    '})})();<\/script>';

  function pagina(pg, C, modo) {
    var H = ED.H, T = C.T, dg = pg.dg || {}, d = datos(dg), web = modo === 'web', rad = Math.min(T.r || 4, 6);
    if (!d) return H.cabecera(C, pg) + H.h1(C, es(pg.titulo || 'Diagramación')) + '<p style="font-size:.85em">La diagramación se prepara con el maniquí de Guías 3D: vuelve a abrir esta página en un momento.</p>' + H.folio(C, pg);
    /* una vista igual a otra ya impresa en el libro se cambia por otra escena del mismo corte (pg.alt, lo fija el escáner) */
    if (pg.alt) { d = Object.assign({}, d, { vis: d.vis.slice(), fotos: d.fotos.slice() }); Object.keys(pg.alt).forEach(function (i) { var e = escena(d, pg.alt[i]); if (e) { d.vis[i] = e; d.fotos[i] = fotoEscena(dg, pg.alt[i]); } }); }
    var R = d.R, tipo = dg.k === 'corte' ? 'Diagramación del corte' : dg.k === 'mio' ? 'Mi corte · diagramación' : dg.k === 'var' ? 'Variante de técnica' : 'Geometría capilar · técnica';
    var cab = '<div style="font-size:.74em;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:' + T.acc + ';margin:0 0 1.5mm">' + tipo + ' · lateral, frente y capas</div>' + H.h1(C, es(R.n));
    var ctrl = web ? '<div style="display:flex;gap:3mm;align-items:center;margin:0 0 2.5mm"><button data-dg-play="1" style="font:inherit;font-size:.86em;padding:1.5mm 4mm;border:0;border-radius:' + rad + 'px;background:' + T.acc + ';color:#fff;cursor:pointer;white-space:nowrap;flex:none">▶ Ver diagramación</button><span data-dg-sub="1" style="font-size:.8em;font-style:italic;opacity:.85;min-width:0"></span></div>'
      : '<div style="font-size:.76em;opacity:.8;margin:0 0 2.5mm">Animación con voz de esta diagramación en el libro interactivo y en el curso premium.</div>';
    var fig = function (e, i, gr) {
      return '<figure data-dg-fig="' + i + '" style="margin:0;background:' + T.soft + ';border-radius:' + rad + 'px;padding:1.5mm' + (gr ? '' : ';font-size:.92em') + '">' +
        '<img src="' + d.fotos[i] + '" alt="' + es(e.t) + '" style="width:100%;height:auto;display:block;border-radius:' + rad + 'px">' +
        '<figcaption style="font-size:.66em;line-height:1.3;margin-top:1.2mm"><b style="font-family:' + T.tit + ';color:' + T.acc + ';font-size:1.12em;display:block">' + (i + 1) + ' · ' + es(e.t) + '</b>' + es(leyenda(e, d, dg)) + '</figcaption></figure>';
    };
    var arriba = '<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:3mm">' + d.vis.slice(0, 2).map(function (e, i) { return fig(e, i, 1); }).join('') + '</div>';
    var abajo = '<div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:3mm;margin-top:3mm;align-items:start">' + (d.vis[2] ? fig(d.vis[2], 2) : '<div></div>') + ficha(d, dg, T) + '</div>';
    var Q = d.E.preguntas || [];
    var test = Q.length ? '<div style="margin-top:2.5mm;font-size:.74em"><b style="font-family:' + T.tit + ';color:' + T.acc + '">Compruébalo</b><div style="display:grid;grid-template-columns:repeat(' + Q.length + ',minmax(0,1fr));gap:3mm">' + Q.map(function (q, i) {
      return '<div data-dg-q="1" data-c="' + q.c + '" style="margin-top:1.5mm"><div>' + (i + 1) + '. ' + es(q.e) + '</div>' + (web ? '<div style="display:flex;flex-wrap:wrap;gap:1mm;margin-top:1mm">' + q.o.map(function (o, j) {
        return '<button data-dg-op="' + j + '" style="font:inherit;font-size:.95em;padding:.8mm 2.5mm;line-height:1.25;text-align:left;border:0.3mm solid ' + T.acc + ';background:#fff;border-radius:' + rad + 'px;cursor:pointer">' + es(o) + '</button>';
      }).join('') + '</div>' : '<div style="opacity:.85">' + q.o.map(function (o, j) { return String.fromCharCode(97 + j) + ') ' + es(o); }).join('   ') + '</div>') + '</div>';
    }).join('') + '</div>' + (web ? '' : '<div style="font-size:.85em;opacity:.7;margin-top:1.5mm">Soluciones: ' + Q.map(function (q, i) { return (i + 1) + String.fromCharCode(97 + q.c); }).join(' · ') + '</div>') + '</div>' : '';
    var anim = web ? '<script type="application/json" data-dg-anim="1">' + JSON.stringify(d.vis.map(function (e) { return { v: e.vista, s: e.texto, a: e.anim }; })).replace(/</g, '\\u003c') + '<\/script>' : '';
    return H.cabecera(C, pg) + '<div data-dg-pg="1" data-acc="' + es(T.acc) + '">' + cab + ctrl + arriba + abajo + test + anim + '</div>' + (web ? SCRIPT : '') + H.folio(C, pg);
  }
  function voz(pg) { var d = datos(pg.dg || {}); return d ? d.R.n + '. ' + d.vis.map(function (e) { return e.texto; }).join(' ') : ''; }
  ED.registrar({ paginas: { pe_diagrama: pagina }, voz: { pe_diagrama: voz } });

  /* en el libro interactivo: fondos del maniquí y reproductor, una sola vez */
  var doc0 = ED.documento;
  ED.documento = function (res, modo) {
    var h = doc0.apply(this, arguments), DG = window.EU_DIAGRAMA;
    if (modo !== 'web' || !DG || !/data-dg-pg/.test(h)) return h;
    var F = DG.fondosYa && DG.fondosYa(); if (!F) return h;
    var s = '<script>window.DG_FONDOS=' + JSON.stringify(F) + ';window.DG_PINTA=' + DG.pinta.toString() + ';<\/script>';
    return h.replace(/<\/body>/i, function () { return s + '</body>'; });
  };

  /* reparto: cortes del libro, luego mis cortes y luego las técnicas; solo en páginas de relleno de unidades de corte */
  /* huecos de una unidad, de más a menos prescindible: −1 página llegada sin contenido · 0 paso de guía 3D repetido (su imagen ya está en la página
     de la guía) · 1 actividad de relleno · 2 figura de relleno · 3 lecturas por encima de una por tipo */
  function huecos(res, uid, g3d) {
    var c = [], vistos = {};
    res.pages.forEach(function (p, i) {
      if (!p.u || p.u.id !== uid) return;
      if (p.tipo === 'lec_amplia' && !p.ds) return c.push([-1, i]);
      var m = p.tipo === 'vis' && /^pe_g3d_(.+)_\d+$/.exec(p.gen || '');
      if (m && g3d[m[1]]) return c.push([0, i]);
      if (p.relleno && (p.tipo === 'actividad' || p.tipo === 'ficha')) return c.push([1, i]);
      if (p.relleno && p.tipo === 'vis') return c.push([2, i]);
      if (/^lec_(amplia|concepto|lectura|caso|proyecto)$/.test(p.tipo)) { var k = p.tipo; vistos[k] = (vistos[k] || 0) + 1; if (vistos[k] > 1) c.push([3, i]); }
    });
    return c.sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
  }
  /* el maniquí 3D tarda un momento la primera vez: cuando está listo, el Editorial vuelve a armar el libro */
  var ESPERA = 0;
  function prepararMotor() {
    if (ESPERA) return; ESPERA = 1;
    window.EU_DIAGRAMA.fondos().then(function () {
      document.querySelectorAll('editorial-escolar').forEach(function (e) { if (e.cfg && e.cfg.materia === 'pelu' && e.programar) e.programar(); });
    }, function (er) { ESPERA = 0; console.warn('Diagramación del libro', er); });
  }
  function repartir(res, cfg) {
    if (!res || !res.pages || !cfg || cfg.materia !== 'pelu' || !window.EU_DIAGRAMA || (((cfg.acab || {}).diagramas) === 'no')) return res;
    if (!window.EU_DIAGRAMA.fondosYa()) { prepararMotor(); return res; }
    var GC = window.EU_GEOMETRIA_CAPILAR, cortes = [], otras = [], libres = {}, hechos = {}, g3d = {}, quitadas = {}, n = 0;
    res.pages.forEach(function (p) {
      if (p.tipo === 'pe_guia3d' && p.corte) g3d[p.corte] = 1;
      if (p.u && cortes.indexOf(p.u.id) < 0 && otras.indexOf(p.u.id) < 0) (/^pe_u_c_/.test(p.u.id) ? cortes : otras).push(p.u.id);
    });
    cortes.concat(otras).forEach(function (u) { libres[u] = huecos(res, u, g3d); });
    function pon(uid, dg, t, tope) {
      var L = libres[uid] || []; if (!L.length || (tope != null && L[0][0] > tope)) return false;
      var i = L.shift()[1];
      var p = res.pages[i]; res.pages[i] = { tipo: 'pe_diagrama', u: p.u, n: p.n, num: p.num, dg: dg, titulo: t }; quitadas[p.num] = 1; n++; return true;
    }
    /* 1 · cada corte con guía 3D en el libro, en su unidad */
    res.pages.forEach(function (p) { if (p.tipo === 'pe_guia3d' && p.corte) { var k = p.corte + '|' + (p.cab || ''); if (!hechos[k] && pon(p.u.id, { k: 'corte', corte: p.corte, cab: p.cab || '' }, p.corte)) hechos[k] = 1; } });
    /* 2 · mis cortes y 3 · técnicas: por turno en las unidades de corte y, si no caben, en las demás de Peluquería */
    var extra = (GC ? GC.mios() : []).map(function (o) { return { k: 'mio', o: o }; }).concat((GC ? GC.TECNICAS : []).map(function (t) { return { k: 'tec', id: t.id }; }));
    var todas = cortes.concat(otras), j = 0;
    extra.forEach(function (dg) { for (var v = 0; v < todas.length; v++) { if (pon(todas[(j + v) % todas.length], dg, dg.id || dg.o.n)) { j = (j + v + 1) % todas.length; return; } } });
    /* 4 · variantes de técnicas (atrás una, delante otra): en los huecos de relleno que queden en las unidades de corte
       y en «Secciones, elevación y mecha guía»; no sustituyen lecturas. Ninguna se repite en el libro. */
    var VAR = GC && GC.variantes ? GC.variantes() : [], dest = cortes.concat(otras.filter(function (u) { return u === 'pe_u_base'; })), iv = 0, hay = true;
    while (hay && iv < VAR.length) { hay = false; for (var w = 0; w < dest.length && iv < VAR.length; w++) if (pon(dest[w], { k: 'var', id: VAR[iv].id }, VAR[iv].id, 2)) { iv++; hay = true; } }
    res.variantes = iv;
    /* las soluciones de las páginas sustituidas salen del solucionario (la página nueva lleva las suyas) */
    res.pages.forEach(function (p) { if (p.tipo === 'solucion' && p.entradas) p.entradas = p.entradas.filter(function (e) { return !quitadas[e.p]; }); });
    res.diagramas = n;
    return res;
  }
  function enganchar() {
    if (ED.__peluLibroDg) return; ED.__peluLibroDg = 1;
    var ens = ED.ensamblar;
    ED.ensamblar = function (cfg) { var r = ens.apply(this, arguments); try { repartir(r, cfg); } catch (e) { console.warn('pelu diagramación', e); } return r; };
  }
  /* después de la guía 3D del libro y de la segunda pasada de modelos (que se engancha al terminar la carga) */
  function esperar() { if (ED.__peluG3dLibro && (ED.__modelosLibro2 || !ED.__modelosLibro)) enganchar(); else setTimeout(esperar, 300); }
  if (document.readyState === 'complete') setTimeout(esperar, 50); else window.addEventListener('load', function () { setTimeout(esperar, 50); });

  window.EU_PELU_LIBRO_DG = { pagina: pagina, repartir: repartir, datos: datos, receta: receta, fotoEscena: fotoEscena };
})();
