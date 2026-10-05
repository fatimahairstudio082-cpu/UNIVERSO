/* b6_idiomas_soluciones.js — solucionario del «Diccionario ilustrado».
   Cada práctica (traduce, une, completa, sopa de letras, escribe y dibuja) queda con sus
   respuestas en las páginas «Soluciones» del final, antes del índice alfabético.
   Para no cambiar el número de páginas pedido, las soluciones ocupan el sitio de tarjetas o
   prácticas de relleno. Reproduce la misma selección aleatoria que b6_cerebro_idiomas.js.
   Cargar después de b6_cerebro_idiomas.js. */
(function () {
  'use strict';
  var ED = window.EU_EDITORIAL, ID = window.EU_IDIOMAS;
  if (!ED || !ID || ID._sol) return;
  var H = ED.H, LENG = ID.LENG, ORDEN = ['es', 'en', 'fr', 'de', 'gsw'];
  var prod = ED.PRODUCTOS.filter(function (p) { return p.id === 'diccionario'; })[0];
  if (!prod || !prod.armar) return;

  function langs(C) {
    var l = (C.op.idiomas && C.op.idiomas.length ? C.op.idiomas : ORDEN).slice(), base = C.op.base || 'es';
    if (l.indexOf(base) < 0) l.unshift(base);
    return { base: base, otros: l.filter(function (x) { return x !== base; }), todos: [base].concat(l.filter(function (x) { return x !== base; })) };
  }
  function palabra(p, lg, C) { var w = p[lg]; return lg === 'es' ? H.sub(w, C) : w; }
  function temaT(t, lg) { return t.t[ORDEN.indexOf(lg)] || t.t[0]; }

  /* Misma lógica que dic_practica: devuelve { tit, pares | sopa } */
  function resolver(pg, C) {
    var t = pg.tema, L = langs(C), r = H.rng(H.hash(t.id + pg.k) + C.semilla), lg = L.otros[pg.k % Math.max(1, L.otros.length)] || L.base;
    var pal = H.mezcla(r, t.pal).slice(0, C.peque ? 6 : 8), v = Math.floor(pg.k / Math.max(1, L.otros.length)) % 5;
    var pares = function (lst) { return lst.map(function (p) { return [palabra(p, L.base, C), p[lg]]; }); };
    if (v === 0) return { tit: 'Traduce al ' + LENG[lg].n.toLowerCase(), pares: pares(pal), lg: lg };
    if (v === 1) return { tit: 'Une cada palabra con su traducción', pares: pares(pal), lg: lg };
    if (v === 2) return { tit: 'Completa la frase', pares: pares(pal.slice(0, 6)), lg: lg };
    if (v === 3 && window.EU_SOPA) {
      var ws = pal.map(function (p) { return p[lg].replace(/^(der|die|das|le|la|les|l’|d|s|de|the)\s+/i, '').replace(/^l’/, ''); }).filter(function (w) { return /^[\p{L}]+$/u.test(w) && w.length <= 10; }).slice(0, 8);
      return { tit: 'Sopa de letras en ' + LENG[lg].n.toLowerCase(), sopa: ws, seed: H.hash(t.id + lg + pg.k) + C.semilla, lg: lg };
    }
    return { tit: 'Escribe y dibuja', pares: pares(pal.slice(0, 4)), lg: lg };
  }

  var armar0 = prod.armar;
  prod.armar = function (C, pool, N, r) {
    /* Sin temas elegidos: solo los que caben con su práctica, sus soluciones y el índice. */
    if (!(C.op.temas && C.op.temas.length)) {
      var L0 = langs(C), por0 = L0.todos.length >= 5 ? 3 : L0.todos.length >= 4 ? 4 : 5; if (C.peque) por0 = Math.max(2, por0 - 1);
      var disp = N - 8, usados = [], pal = 0;
      for (var q = 0; q < ID.TEMAS.length; q++) {
        var t = ID.TEMAS[q], coste = 3 + Math.ceil(t.pal.length / por0), p2 = pal + t.pal.length;
        var idx = N >= 30 ? Math.ceil(p2 * L0.todos.length / (C.peque ? 60 : 84)) : 0, sol = Math.ceil((usados.length + 1) * 1.6 / (C.peque ? 4 : 6));
        var total = usados.reduce(function (s, x) { return s + 3 + Math.ceil(x.pal.length / por0); }, 0) + coste + idx + sol;
        if (total > disp) break;
        usados.push(t); pal = p2;
      }
      if (usados.length && usados.length < ID.TEMAS.length) C.op = Object.assign({}, C.op, { temas: usados.map(function (x) { return x.id; }) });
    }
    var pages = armar0.apply(this, arguments);
    try {
      var pr = pages.filter(function (p) { return p.tipo === 'dic_practica'; });
      if (!pr.length || N < 8) return pages;
      var porPag = C.peque ? 4 : 6, nSol = Math.ceil(pr.length / porPag), quitar = [];
      /* hueco: primero tarjetas de relleno, luego prácticas de relleno (las de k más alto) */
      var cand = pages.map(function (p, i) { return { p: p, i: i }; }).filter(function (o) { return o.p.relleno && (o.p.tipo === 'dic_tarjetas' || (o.p.tipo === 'dic_practica' && o.p.k > 0)); })
        .sort(function (a, b) { return (a.p.tipo === 'dic_tarjetas' ? 0 : 1) - (b.p.tipo === 'dic_tarjetas' ? 0 : 1) || (b.p.k || 0) - (a.p.k || 0); });
      for (var z = 0; z < cand.length && quitar.length < nSol; z++) {
        quitar.push(cand[z].i);
        if (cand[z].p.tipo === 'dic_practica') { pr = pr.filter(function (x) { return x !== cand[z].p; }); nSol = Math.ceil(pr.length / porPag); }
      }
      var out = pages.filter(function (p, i) { return quitar.indexOf(i) < 0; });
      var sols = [];
      for (var s = 0; s < nSol; s++) sols.push({ tipo: 'dic_sol', parte: s, lista: pr.slice(s * porPag, (s + 1) * porPag), indice: s ? null : 'Soluciones', cab: 'Soluciones' });
      var pos = out.map(function (p) { return p.tipo; }).indexOf('dic_indice');
      if (pos < 0) pos = out.length - (/contra/.test((out[out.length - 1] || {}).tipo || '') ? 1 : 0);
      Array.prototype.splice.apply(out, [pos, 0].concat(sols));
      return out;
    } catch (e) { console.warn('EU_IDIOMAS soluciones', e); return pages; }
  };

  ED.registrar({
    paginas: {
      dic_sol: function (pg, C) {
        var T = C.T, bloques = pg.lista.map(function (p) {
          var R = resolver(p, C), cuerpo;
          if (R.sopa) cuerpo = '<div style="max-width:70mm;font-size:.8em">' + window.EU_SOPA.pagina(R.sopa, C, R.seed, true) + '</div>';
          else cuerpo = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.6mm 5mm;font-size:.92em">' + R.pares.map(function (x, i) { return '<div style="display:flex;gap:2mm;border-bottom:0.2mm dotted ' + T.soft + '"><b style="color:' + T.acc + ';flex:none;width:5mm">' + (i + 1) + '.</b><span style="flex:1;min-width:0">' + H.esc(x[0]) + '</span><span style="font-weight:700;color:' + LENG[R.lg].col + '">' + H.esc(x[1]) + '</span></div>'; }).join('') + '</div>';
          return '<div style="break-inside:avoid;margin:0 0 5mm"><div style="display:flex;gap:3mm;align-items:baseline;margin-bottom:1.5mm"><span style="font-weight:700;color:' + T.acc + '">Pág. ' + (p.num || '·') + '</span><span style="font-weight:700">' + H.esc(temaT(p.tema, langs(C).base)) + '</span><span style="opacity:.75">· ' + H.esc(R.tit) + '</span></div>' + cuerpo + '</div>';
        }).join('');
        return H.cabecera(C, pg) + H.h1(C, pg.parte ? 'Soluciones (' + (pg.parte + 1) + ')' : 'Soluciones', 'font-size:' + (C.fs * 1.7) + 'px') + bloques + H.folio(C, pg);
      }
    },
    voz: { dic_sol: function () { return [{ t: 'Soluciones de las prácticas.', lang: 'es-ES' }]; } }
  });
  ID._sol = true;
})();
