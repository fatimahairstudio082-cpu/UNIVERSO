/* b6_texto_auto.js — banco de contenido para las materias que no tienen banco escrito (window.EU_TEXTO_AUTO), 10-10-2026.
   Solo Matemáticas tiene banco escrito (b6_texto_mate.js); por eso solo Mate tenía «Desarrollo», «Así se resuelve» con
   «▶ Ver resolución» y «Para terminar». Aquí se arma, para cada unidad, un banco con lo que el sistema YA tiene
   (no se inventa contenido):
     · des  — apartados = dibujos de la biblioteca de la materia que más se parecen a la unidad (por palabras del título,
              las claves y las ideas), con su explicación («intro» del dibujo); el «Por qué funciona» lo pone la enciclopedia;
     · ej   — ejemplos resueltos = ejercicios de los generadores de la unidad que traen proceso (x), con sus pasos;
     · voc  — vocabulario = palabras clave de la unidad con la idea de la unidad que las explica;
     · con  — conclusión con las palabras clave.
   Lo usa b6_enciclopedia.js cuando una materia no tiene banco propio. Fuera: Peluquería (tiene su propio libro animado),
   Inglés e Idiomas (b6_ingles_bilingue.js) y Mate (banco escrito). `cfg.acab.textoAuto = 'no'` lo apaga. */
(function () {
  'use strict';
  var ED = window.EU_EDITORIAL; if (!ED || window.EU_TEXTO_AUTO) return;
  var H = ED.H, FUERA = /^(pelu|ingles|idiomas|mate|infantil)$/;
  var TAMBIEN = { bio: ['anat'], geoalg: ['mate'], geografia: ['soci'], historia: ['soci'], reposteria: ['cocina'], cocina: ['batidos'], calculo: ['mate'] };
  var CACHE = typeof WeakMap === 'function' ? new WeakMap() : null;
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/<[^>]+>/g, ' '); }
  function palabras(s) { var o = {}; norm(s).split(/[^a-zñ0-9]+/).forEach(function (w) { if (w.length >= 5) o[w.slice(0, 6)] = 1; }); return o; }
  function parecido(a, b) { var n = 0; for (var k in a) if (b[k]) n++; return n; }
  function S(s, C) { try { return ED.sub(String(s || ''), C); } catch (e) { return String(s || ''); } }
  function pasosDe(x) {
    x = String(x || '').replace(/\s+/g, ' ').trim(); if (!x) return [];
    var p = x.split(/(?:\.\s+|;\s+|\s+→\s+)/).map(function (s) { return s.trim().replace(/\.$/, ''); }).filter(function (s) { return s.length > 1; });
    if (p.length === 1) { var eq = x.split(/\s=\s/); if (eq.length >= 3) p = eq.slice(1).map(function (s, i) { return (i ? '= ' : eq[0] + ' = ') + s.replace(/\.$/, ''); }); }
    return p.slice(0, 6);
  }
  function armar(C, u) {
    var MO = window.EU_MODELOS, b = { des: [], ej: [], voc: [] }, usados = {};
    /* apartados: dibujos de la biblioteca más parecidos a la unidad */
    if (MO && MO.lista) {
      var lista = []; [C.mat].concat(TAMBIEN[C.mat] || []).forEach(function (m) { lista = lista.concat(MO.lista(m) || []); });
      var pu = palabras([u.t].concat(u.k || [], u.i || []).join(' '));
      lista.map(function (m, i) { m.__palA = m.__palA || palabras(m.n + ' ' + (m.intro || '')); return [parecido(pu, m.__palA), i, m]; })
        .filter(function (x) { return x[0] > 0 && x[2].intro && String(x[2].intro).length > 30; })
        .sort(function (a, c) { return c[0] - a[0] || a[1] - c[1]; })
        .slice(0, 6).forEach(function (x) { var m = x[2]; if (usados[m.id]) return; usados[m.id] = 1; b.des.push([m.n, m.intro, m.id]); });
    }
    /* ejemplos resueltos: ejercicios de la unidad con proceso */
    if (H && H.ejercicios) {
      var r = H.rng(H.hash(u.id + ':texto_auto') + (C.semilla || 1)), its = [], vistos = {};
      try { its = H.ejercicios(u, C, r, 24) || []; } catch (e) { its = []; }
      its.forEach(function (x) {
        if (b.ej.length >= 4 || !x || !x.e || x.s == null || x.s === '' || !x.x || String(x.x).length < 10) return;
        var k = H.limpio ? H.limpio(x.e) : String(x.e); if (vistos[k]) return; vistos[k] = 1;
        var ps = pasosDe(x.x); if (!ps.length) return;
        b.ej.push({ e: String(x.e), pasos: ps, s: String(x.s), x: String(x.x) });
      });
    }
    /* vocabulario y conclusión con las claves de la unidad */
    (u.k || []).forEach(function (k0) {
      var k = S(k0, C), kl = k.toLowerCase(), def = (u.i || []).map(function (s) { return S(s, C); }).filter(function (s) { return s.toLowerCase().indexOf(kl) >= 0; })[0];
      if (def && b.voc.length < 6) b.voc.push([k, def]);
    });
    var ks = (u.k || []).map(function (k) { return S(k, C); }).filter(Boolean);
    if (ks.length) b.intro = 'En esta unidad trabajamos «' + S(u.t, C) + '»: ' + (ks.length > 1 ? ks.slice(0, -1).join(', ') + ' y ' + ks[ks.length - 1] : ks[0]) + '.';
    if (ks.length) b.con = 'Ya conoces las palabras clave de «' + S(u.t, C) + '»: ' + (ks.length > 1 ? ks.slice(0, -1).join(', ') + ' y ' + ks[ks.length - 1] : ks[0]) + '. Repasa los ejemplos resueltos y vuelve al esquema cuando lo necesites.';
    if (!b.des.length) delete b.des; if (!b.ej.length) delete b.ej; if (!b.voc.length) delete b.voc;
    return (b.des || b.ej) ? b : null;
  }
  function banco(C, u) {
    if (!C || !u || !u.id || FUERA.test(C.mat || '') || ((C.cfg && C.cfg.acab) || {}).textoAuto === 'no') return null;
    var m = CACHE ? CACHE.get(C) : null; if (!m) { m = {}; if (CACHE) CACHE.set(C, m); }
    if (!(u.id in m)) m[u.id] = armar(C, u);
    return m[u.id];
  }
  window.EU_TEXTO_AUTO = { banco: banco, pasos: pasosDe };
})();
