/* b6_modelos_libro.js — en los libros largos, que salga toda la biblioteca de modelos de la materia.
   Después del ensamblado, los modelos que no han salido sustituyen páginas de relleno (actividades
   repetidas) y, si faltan huecos, lecturas `lec_concepto`/`lec_amplia` sobrantes (se dejan 2 por unidad).
   Cada modelo va a la unidad cuyo título y palabras clave más se le parecen. El solucionario se actualiza.
   Cargar antes de b6_comercio_electronico.js y b6_relleno_total.js (así el relleno mide las páginas nuevas).
   `cfg.acab.modelos = 'no'` lo apaga. */
(function () {
  'use strict';
  var ED = window.EU_EDITORIAL; if (!ED || ED.__modelosLibro) return; ED.__modelosLibro = 1;
  var PRODS = /^(libro|ebook|cuaderno|fichas|unidad|trabajo|libro_pro|recetario|diccionario)$/;
  var TAMBIEN = { bio: ['anat'], geoalg: ['mate'], geografia: ['soci'], reposteria: ['cocina'], cocina: ['batidos'] };
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/<[^>]+>/g, ' '); }
  function palabras(s) { var o = {}; norm(s).split(/[^a-zñ0-9]+/).forEach(function (w) { if (w.length >= 5) o[w.slice(0, 6)] = 1; }); return o; }
  function parecido(a, b) { var n = 0; for (var k in a) if (b[k]) n++; return n; }

  function completar(res) {
    var C = res.C, MO = window.EU_MODELOS, H = ED.H;
    if (!C || !MO || !MO.vis || !H) return;
    if (!PRODS.test((C.prod && C.prod.id) || '') || (((C.cfg || {}).acab || {}).modelos === 'no')) return;
    var mats = [C.mat].concat(TAMBIEN[C.mat] || []), lista = [];
    mats.forEach(function (m) { lista = lista.concat(MO.lista(m) || []); });
    if (!lista.length) return;
    var pages = res.pages, ya = {};
    /* lo que ya está de verdad en el libro (el registro de b6_modelos también cuenta pruebas que luego se descartan) */
    pages.forEach(function (p) {
      if (p.tipo === 'vis' && p.gen) ya[p.gen] = 1; if (p.tipo === 'col_modelo' && p.mod) ya[p.mod] = 1;
      var t = ''; try { t = JSON.stringify(p, function (k, v) { return k === 'u' || k === 'C' ? undefined : v; }); } catch (e) { }
      (t.match(/data-modelo=\\"[^\\"]+/g) || []).forEach(function (x) { ya[x.replace(/^data-modelo=\\"/, '')] = 1; });
    });
    /* dibujos elegidos en la Galería con «Usar en mi libro» (localStorage eu_mi_libro = { materia: [ids] }): van primero */
    var pide = {}; try { var ML = JSON.parse(localStorage.getItem('eu_mi_libro') || '{}'); mats.forEach(function (k) { (ML[k] || []).forEach(function (id) { pide[id] = 1; }); }); } catch (e) { }
    var libres = lista.filter(function (m) { return !ya[m.id]; });
    /* unidades con lista propia de modelos (u.mods, b6_pelu_orden): solo salen los modelos de alguna unidad */
    var permit = null;
    pages.forEach(function (p) { if (p.u && p.u.mods) { permit = permit || {}; p.u.mods.forEach(function (id) { permit[id] = 1; }); } });
    if (permit) libres = libres.filter(function (m) { return permit[m.id]; });
    if (!libres.length) return;
    libres.forEach(function (m) { m.__pal = m.__pal || palabras(m.n + ' ' + m.intro + ' ' + MO.nombreFamilia(m.mat, m.fam)); });

    /* huecos por niveles: 0 relleno de ejercicios · 1 lecturas por encima de 2 por unidad ·
       2 figuras genéricas de relleno · 3 lecturas hasta dejar 1 por unidad · 4 casos/lecturas/proyectos repetidos */
    var lecU = {}, huecos = [], nivel = {};
    var poner = function (i, n) { if (nivel[i] == null) { nivel[i] = n; huecos.push(i); } };
    pages.forEach(function (p) { if (p.u && /^lec_(concepto|amplia)$/.test(p.tipo)) lecU[p.u.id] = (lecU[p.u.id] || 0) + 1; });
    pages.forEach(function (p, i) { if (p.u && p.relleno && (p.tipo === 'actividad' || p.tipo === 'ficha')) poner(i, 0); });
    /* «Libro profesional» (b6_conectores): su relleno son hojas de «Notas» y diagramas genéricos */
    pages.forEach(function (p, i) { if (p.u && p.relleno && p.tipo === 'pro_notas') poner(i, 0); else if (p.u && p.relleno && p.tipo === 'pro_diagrama') poner(i, 2); });
    var vistoL = {};
    pages.forEach(function (p, i) { if (!p.u || !/^lec_(concepto|amplia)$/.test(p.tipo)) return; var id = p.u.id, j = vistoL[id] = (vistoL[id] || 0) + 1; if (j > 1) poner(i, j - 1 <= lecU[id] - 2 ? 1 : 3); });
    pages.forEach(function (p, i) { if (p.u && p.relleno && p.tipo === 'vis' && p.gen && !MO.modelo(p.gen) && !p.sopa) poner(i, 2); });
    /* 4: lecturas de caso, lectura y proyecto por encima de 1 por unidad y tipo (materias de adultos y oficios) */
    var vistoC = {};
    pages.forEach(function (p, i) { if (!p.u || !/^lec_(caso|lectura|proyecto)$/.test(p.tipo)) return; var k = p.u.id + p.tipo; vistoC[k] = (vistoC[k] || 0) + 1; if (vistoC[k] > 1) poner(i, 4); });
    /* 5: en oficios y adultos, la lectura de una unidad que ya tiene caso (solo se usa si siguen faltando dibujos) */
    if (/^(pelu|panaderia|pasteleria|cocina|batidos|reposteria|empre|mkt|ia|redes|ecom)$/.test(C.mat)) {
      var conCaso = {};
      pages.forEach(function (p) { if (p.u && p.tipo === 'lec_caso') conCaso[p.u.id] = 1; });
      pages.forEach(function (p, i) { if (p.u && p.tipo === 'lec_lectura' && conCaso[p.u.id]) poner(i, 5); });
    }
    if (!huecos.length) return;
    /* repartir: alternar unidades para no concentrar los modelos */
    var porU = {}, orden = [];
    huecos.forEach(function (i) { var id = pages[i].u.id; (porU[id] = porU[id] || []).push(i); });
    var cols = Object.keys(porU).map(function (k) { return porU[k]; }), r = 0, hay = true;
    while (hay) { hay = false; cols.forEach(function (c) { if (c[r] != null) { orden.push(c[r]); hay = true; } }); r++; }
    orden.sort(function (a, b) { return nivel[a] - nivel[b]; });

    var cambios = {}, palU = {};
    for (var h = 0; h < orden.length && libres.length; h++) {
      var i = orden[h], pg = pages[i], u = pg.u;
      var pu = palU[u.id] || (palU[u.id] = palabras([u.t, (u.k || []).join(' '), (u.i || []).join(' ')].join(' ')));
      var mejor = -1, puntos = -1;
      puntos = -1e9;
      libres.forEach(function (m, j) { var s = parecido(m.__pal, pu) + (pide[m.id] ? 1000 : 0) + (u.mods ? (u.mods.indexOf(m.id) >= 0 ? 100 : -10000) : 0); if (s > puntos) { puntos = s; mejor = j; } });
      if (u.mods && puntos < -5000) continue;
      while (mejor >= 0) {
        var m = libres.splice(mejor, 1)[0], sem = H.hash(u.id + ':vis:' + m.id + ':' + pg.num) + (C.semilla || 1) * 7919, V = MO.vis(m.id, C);
        if (V) {
          var nu = { tipo: 'vis', u: u, n: pg.n, v: V, items: V.items, relleno: false, modeloLib: 1, cab: pg.cab, gen: m.id, sem: sem, num: pg.num };
          if (pg.indice) nu.indice = pg.indice;
          cambios[pg.num] = { antes: pg, nuevo: nu }; pages[i] = nu; break;
        }
        mejor = libres.length ? 0 : -1;
      }
    }
    /* solucionario */
    var sols = pages.filter(function (p) { return p.tipo === 'solucion' && p.entradas; });
    if (!sols.length) return;
    Object.keys(cambios).forEach(function (num) {
      num = +num; var c = cambios[num], hecho = false;
      sols.forEach(function (s) { s.entradas.forEach(function (e) { if (e.p === num) { e.items = c.nuevo.items; e.u = c.nuevo.u; hecho = true; } }); });
      if (hecho || !c.nuevo.items || !c.nuevo.items.length) return;
      var dest = sols[0];
      sols.forEach(function (s) { if (s.entradas.length && s.entradas[0].p < num) dest = s; });
      dest.entradas.push({ p: num, items: c.nuevo.items, u: c.nuevo.u });
      dest.entradas.sort(function (a, b) { return a.p - b.p; });
    });
  }

  var ens = ED.ensamblar;
  ED.ensamblar = function (cfg) {
    var res = ens.apply(this, arguments);
    try { completar(res); } catch (e) { console.warn('modelos libro', e); }
    return res;
  };
  /* segunda pasada al final de la cadena: módulos cargados después (páginas propias de adultos, rellenos)
     pueden haber sustituido páginas que llevaban un modelo; se vuelven a colocar los que falten */
  function tarde() {
    if (ED.__modelosLibro2) return; ED.__modelosLibro2 = 1;
    var e2 = ED.ensamblar;
    ED.ensamblar = function () { var res = e2.apply(this, arguments); try { completar(res); } catch (e) { console.warn('modelos libro 2', e); } return res; };
  }
  if (document.readyState === 'complete') setTimeout(tarde, 0); else window.addEventListener('load', tarde);
})();
