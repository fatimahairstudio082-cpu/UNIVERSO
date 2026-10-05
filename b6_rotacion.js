/* b6_rotacion.js — Rotación de diseños en el Editorial (window.EU_ROTACION).
   Para que un libro de 300 páginas no repita el mismo aspecto, cada página (o cada unidad) se pinta con
   uno de los 16 diseños de EU_CONECTORES.DISENOS (Prensa, Clásica, Plano técnico, Suizo, Nocturno,
   Orgánico, Corporativo, Informe, Revista, Cuento, Cómic, Mínimo, Acuarela, Ceras, Arcoíris, Pizarra).
   · Portada, contraportada e índice conservan el diseño elegido para el libro.
   · El orden es una permutación con semilla: se recorren todos antes de repetir y nunca coinciden dos seguidos.
   · Las páginas visuales se vuelven a dibujar con los colores del diseño de su página (EU_SVG.regenerar);
     las figuras incrustadas en los ejercicios cambian sus colores base por los del diseño nuevo.
   · Conjuntos: «afines» (mismo grupo que el diseño base), «claros» (los 14 de fondo claro) o «todos».
   Opciones en cfg.acab.rotar ('no' | 'unidad' | 'pagina') y cfg.acab.rotarSet.
   Se engancha con EU_EDITORIAL.registrar({ pre, post }). Cargar al final. */
(function () {
  var ED = window.EU_EDITORIAL, CN = window.EU_CONECTORES;
  if (!ED || !CN || !CN.DISENOS || window.EU_ROTACION) return;
  var H = ED.H, DIS = CN.DISENOS, IDS = Object.keys(DIS);
  var OSCUROS = { nocturno: 1, pizarra: 1 }, FIJAS = /^(portada|contra|indice|car_portada|car_cierre|s_portada)$/;
  var GRUPO_BASE = { juego: 'escolar', cuaderno: 'escolar', lexico: 'escolar', tecnica: 'pro', editorial: 'autor', sobria: 'autor', cocina: 'autor' };
  var ROLES = ['acc', 'acc2', 'soft', 'soft2', 'ink', 'bg'];
  function opc(cfg) { var A = (cfg && cfg.acab) || {}; return { modo: A.rotar || 'no', set: A.rotarSet || 'claros' }; }

  function lista(C, O) {
    var base = C._rotBase0 || C.T, g = DIS[base.id] ? DIS[base.id].g : GRUPO_BASE[base.id] || 'autor', L;
    if (O.set === 'todos') L = IDS.slice();
    else if (O.set === 'afines') { L = IDS.filter(function (k) { return DIS[k].g === g && (!OSCUROS[k] || OSCUROS[base.id]); }); if (L.length < 3) L = IDS.filter(function (k) { return !OSCUROS[k]; }); }
    else L = IDS.filter(function (k) { return !OSCUROS[k]; });
    return L.filter(function (k) { return ED.PLANTILLAS[k]; });
  }
  /* Posición i de la secuencia: ciclos barajados con semilla, sin repetir en la costura entre ciclos. */
  function diseno(C, O, i) {
    var R = C._rot || (C._rot = { L: lista(C, O), P: [], T: {} }), L = R.L, n = L.length; if (!n) return null;
    var ciclo = Math.floor(i / n);
    for (var c = R.P.length; c <= ciclo; c++) {
      var p = H.mezcla(H.rng(H.hash('rot' + c) + (C.semilla || 1) * 104729), L);
      var prev = c ? R.P[c - 1][n - 1] : (C._rotBase0 || C.T).id;
      if (n > 1 && p[0] === prev) { var t = p[0]; p[0] = p[1]; p[1] = t; }
      R.P.push(p);
    }
    return R.P[ciclo][i % n];
  }
  function tema(C, id) {
    var R = C._rot; if (R.T[id]) return R.T[id];
    var T = Object.assign({ id: id }, ED.PLANTILLAS[id]);
    if (C.cfg.dislexia) { T.cuerpo = "'Lexend', sans-serif"; T.tit = "'Lexend', sans-serif"; }
    return (R.T[id] = T);
  }

  function pre(pg, C) {
    var O = opc(C.cfg); if (O.modo === 'no' || FIJAS.test(pg.tipo || '')) return;
    if (!C._rotBase0) C._rotBase0 = C.T;
    var i = O.modo === 'unidad' ? (pg.n || 0) - 1 : (pg.num || 1) - 1;
    if (i < 0) return;
    var id = diseno(C, O, i); if (!id || id === C.T.id) return;
    var base = C.T; C.T = tema(C, id); C._rotDe = base;
    var fig0 = null;
    if (pg.tipo === 'vis' && pg.v && window.EU_SVG && EU_SVG.regenerar) { var V = EU_SVG.regenerar(pg, C); if (V && V.fig) { fig0 = pg.v.fig; pg.v.fig = V.fig; } }
    return function () { C._rotDe = null; if (fig0 != null) pg.v.fig = fig0; };
  }
  /* Colores de la base que quedaron fijados al ensamblar (figuras dentro de ejercicios) → diseño de la página. */
  function post(h, pg, C) {
    var B = C._rotDe, T = C.T; if (!B || B === T) return h;
    var map = {}, claves = [];
    ROLES.forEach(function (k) { var a = String(B[k] || '').toLowerCase(), b = T[k]; if (/^#[0-9a-f]{6}$/.test(a) && b && a !== String(b).toLowerCase() && !map[a]) { map[a] = b; claves.push(a); } });
    if (!claves.length) return h;
    return h.replace(new RegExp(claves.join('|'), 'gi'), function (m) { return map[m.toLowerCase()] || m; });
  }
  ED.registrar({ pre: pre, post: post });

  /* ─────────── panel ─────────── */
  if (CN.panel && !CN.panel._rotacion) {
    var orig = CN.panel;
    var nuevo = function (ed, seccion, U) {
      var el = U.el, ST = U.ST, chip = U.chip, O = opc(ed.cfg);
      var setO = function (k, v) { var a = Object.assign({}, ed.cfg.acab || {}); a[k] = v; ed.set('acab', a); };
      var s = seccion('Rotación de diseños');
      var fila = function (opts, val, fn) { var f = el('div', ST.fila); opts.forEach(function (o) { var b = el('button', chip(val === o[0]), o[1]); b.onclick = function () { fn(o[0]); }; f.appendChild(b); }); s.appendChild(f); };
      s.appendChild(el('div', ST.lbl, 'Cambiar de diseño'));
      fila([['no', 'Nunca'], ['unidad', 'Por unidad'], ['pagina', 'Por página']], O.modo, function (v) { setO('rotar', v); });
      if (O.modo !== 'no') {
        s.appendChild(el('div', ST.lbl, 'Diseños que entran'));
        fila([['afines', 'Afines'], ['claros', 'Fondo claro (14)'], ['todos', 'Los 16']], O.set, function (v) { setO('rotarSet', v); });
      }
      s.appendChild(el('div', ST.nota, O.modo === 'no' ? 'Todo el libro usa el diseño elegido.' :
        'Portada, contraportada e índice mantienen el diseño del libro. ' + (O.modo === 'pagina' ? 'Cada página toma otro diseño' : 'Cada unidad toma otro diseño') + ' y se recorren todos antes de repetir; dos seguidos nunca coinciden. Las láminas y gráficos se redibujan con los colores de su página.' + (O.set === 'todos' ? ' Incluye Nocturno y Pizarra, de fondo oscuro: gastan más tinta al imprimir.' : '')));
      return orig.apply(this, arguments);
    };
    nuevo._rotacion = true; nuevo._premium = CN.panel._premium;
    CN.panel = nuevo;
  }

  window.EU_ROTACION = { opc: opc, lista: lista, diseno: diseno };
})();
