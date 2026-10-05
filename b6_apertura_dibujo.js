/* b6_apertura_dibujo.js — llena con un dibujo de la biblioteca los huecos discontinuos que el motor deja
   en la apertura de cada unidad («Ilustración de apertura») y en «Cerca de ti» («Foto o dibujo de un ejemplo real»)
   cuando la usuaria no ha subido imágenes.
   Orden de búsqueda: 1) un dibujo registrado en EU_SVG.visual para la materia (2D/3D según cfg.acab.dibujo),
   2) la figura propia de la unidad (u.f), 3) un bodegón de EU_BOTANICA.
   Cargar después de b6_geometria_visual.js (que ya llena geoalg y cálculo) y antes de b6_portada_edicion.js. */
(function () {
  'use strict';
  var ED = window.EU_EDITORIAL, SV = window.EU_SVG;
  if (!ED || !SV || window.EU_APERTURA_DIBUJO) return;
  var H = ED.H;
  var HUECO = /<div style="height:(\d+(?:\.\d+)?)mm;border:0\.5mm dashed[^"]*">(Ilustración de apertura[^<]*|Imagen de apertura[^<]*|Foto o dibujo de un ejemplo real[^<]*)<\/div>/;
  /* Fuera: los que dejan huecos para contestar o dependen de sus preguntas. */
  var FUERA = /^(esc_|dic_|sopa$|ordena$|esquema$)/;

  function ajustar(fig, alto) {
    return '<div style="height:' + alto + 'mm;display:flex;align-items:center;justify-content:center;overflow:hidden">' +
      fig.replace(/<svg([^>]*?)style="[^"]*"/, '<svg$1style="display:block;width:auto;height:100%;max-width:100%"') + '</div>';
  }
  function candidatos(u, C) {
    var t = []; try { t = SV.tiposDe(u, C) || []; } catch (e) { }
    return t.filter(function (x, i) { return !FUERA.test(x) && t.indexOf(x) === i; });
  }
  /* modelo de la biblioteca de la materia cuyo nombre más se parece al título de la unidad */
  function palabras(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').match(/[a-zñ]{4,}/g) || []; }
  function modeloParecido(u, C, h0) {
    var MO = window.EU_MODELOS; if (!MO || !MO.lista || !C.mat) return '';
    var L = MO.lista(C.mat).filter(function (m) { return !/^pe_(ft|fx|elev)_/.test(m.id); }); if (u.mods) { var L2 = L.filter(function (m) { return u.mods.indexOf(m.id) >= 0; }); if (L2.length) L = L2; } if (!L.length) return '';
    var cl = palabras(u.t + ' ' + (u.k || []).join(' ')), mejor = null, pm = 0;
    L.forEach(function (m, i) { var w = palabras(m.n + ' ' + (m.intro || '')), p = 0; cl.forEach(function (x) { if (w.indexOf(x) >= 0) p++; }); p = p * 1000 + ((h0 + i) % 997); if (p > pm) { pm = p; mejor = m; } });
    var modo = ((C.cfg && C.cfg.acab) || {}).dibujo === '2d' ? 'color' : '3d';
    try { return mejor ? MO.svg(mejor.id, modo) : ''; } catch (e) { return ''; }
  }
  function dibujo(u, C, sal) {
    var tipos = candidatos(u, C), h0 = H.hash(u.id + ':' + sal);
    for (var q = 0; q < Math.min(tipos.length, 4); q++) {
      var ty = tipos[(h0 + q) % tipos.length], V = SV.generar(ty, u, C, H.rng(h0 + q * 7919));
      if (V && /<svg/.test(V.fig || '')) return V.fig;
    }
    if (u.f) { try { var f = H.figura(u.f, C); if (/<svg/.test(f || '')) return f; } catch (e) { } }
    var md = modeloParecido(u, C, h0); if (md) return md;
    var B = window.EU_BOTANICA;
    if (B && B.bodegon && B.lista) { var L = B.lista().map(function (x) { return x.id; }), ids = []; for (var i = 0; i < 4 && L.length; i++) ids.push(L[(h0 + i * 13) % L.length]); return B.bodegon(ids, C, { alto: 300, max: 4 }); }
    return '';
  }
  /* Caché: el motor y los módulos de relleno repintan cada página varias veces al medirla. */
  var CACHE = {}, NC = 0;
  var CACHE = {};
  function post(h, pg, C) {
    if (!pg || !pg.u || !/^(apertura|ejemplo|pro_capitulo)$/.test(pg.tipo || '')) return h;
    if (h.indexOf('0.5mm dashed') < 0) return h;
    var m = HUECO.exec(h); if (!m) return h;
    var k = [pg.u.id, pg.tipo, pg.n || 0, C.mat, C.pk, (C.T && C.T.id) || '', ((C.cfg && C.cfg.acab) || {}).dibujo || '3d', m[1], pg.portMod || ''].join('|');
    if (!(k in CACHE)) {
      if (++NC > 400) { CACHE = {}; NC = 1; }
      var fig = '', modoD = ((C.cfg && C.cfg.acab) || {}).dibujo === '2d' ? 'color' : '3d';
      /* pg.portMod lo fija el módulo de la materia (p. ej. b6_pelu_orden) con un dibujo que no sale en otra página */
      try { if (pg.portMod) fig = typeof pg.portMod === 'string' ? window.EU_MODELOS.svg(pg.portMod, modoD) : window.EU_PELU_FICHAS.svg(pg.portMod[0], pg.portMod[1], modoD); } catch (e) { fig = ''; }
      if (!fig) try { fig = dibujo(pg.u, C, pg.tipo + ':' + (pg.n || 0)); } catch (e) { }
      CACHE[k] = fig ? ajustar(fig, +m[1]) : '';
    }
    return CACHE[k] ? h.replace(HUECO, CACHE[k]) : h;
  }
  ED.registrar({ post: post });
  window.EU_APERTURA_DIBUJO = { dibujo: dibujo, candidatos: candidatos };
})();
