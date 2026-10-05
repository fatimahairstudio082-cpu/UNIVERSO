/* b6_dibujos_plus3.js — 29 dibujos más para la biblioteca visual (window.EU_DIBUJOS3).
   · Idiomas, Inglés e Infantil: escenas con rótulos numerados (la casa, la ciudad, el cuerpo, la ropa,
     formas y tamaños, la familia). Las palabras salen del diccionario de EU_IDIOMAS en la lengua del libro.
   · Redes sociales: calendario de publicación, anatomía de una publicación, comparativa de formatos.
   · Comercio electrónico: ficha de producto, mapa de envíos por zonas (EU_MAPAS_DATOS), ciclo de devolución.
   · Religión: calendario de fiestas 2026, templos. Música: familias de instrumentos, colocación de la orquesta.
   · Contabilidad: cuentas en T, amortización lineal, inventario PEPS, presupuesto frente a real, cadena del IVA.
   · Geografía: climograma, pirámide de población, perfil topográfico, husos horarios, rosa de los vientos.
   · Lengua: sílaba tónica. Inglés: rutina diaria. Valores: las emociones.
   Cargar después de b6_dibujos_plus2.js. */
(function () {
  'use strict';
  var ED = window.EU_EDITORIAL, SV = window.EU_SVG;
  if (!ED || !SV || !SV.visual || window.EU_DIBUJOS3) return;
  var H = ED.H, esc = H.esc, it = H.it, E = H.ent, osc = SV.osc, clr = SV.clr, NS = 'xmlns="http://www.w3.org/2000/svg"';
  var FX = (window.EU_EMPRE && EU_EMPRE.FX) || { es: 1 };
  function r1(n) { return Math.round(n * 10) / 10; }
  function es3d(C) { return C.prem ? C.prem.dibujo === '3d' : (((C.cfg && C.cfg.acab) || {}).dibujo || '3d') === '3d'; }
  function svg(w, h, body, maxw) { return '<svg ' + NS + ' data-plano="1" viewBox="0 0 ' + w + ' ' + h + '" style="width:100%;max-width:' + (maxw || w) + 'px;height:auto;display:block;margin:0 auto">' + body + '</svg>'; }
  function tx(x, y, s, o) { o = o || {}; return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || 'middle') + '" font-size="' + (o.s || 13) + '" font-family="' + esc(o.f || 'sans-serif') + '" font-weight="' + (o.w || 400) + '" fill="' + (o.c || '#222') + '">' + esc(String(s)) + '</text>'; }
  function rc(x, y, w, h, o) { o = o || {}; return '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(w) + '" height="' + r1(h) + '" rx="' + (o.rx || 0) + '" fill="' + (o.f || 'none') + '" stroke="' + (o.s || 'none') + '" stroke-width="' + (o.sw || 1.5) + '"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : '') + '/>'; }
  function ln(x1, y1, x2, y2, c, w, o) { return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + c + '" stroke-width="' + (w || 1.5) + '"' + (o || '') + '/>'; }
  function ci(x, y, rr, f, s, sw) { return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1(rr) + '" fill="' + (f || 'none') + '" stroke="' + (s || 'none') + '" stroke-width="' + (sw || 1.5) + '"/>'; }
  function pa(d, f, s, sw) { return '<path d="' + d + '" fill="' + (f || 'none') + '" stroke="' + (s || 'none') + '" stroke-width="' + (sw || 1.5) + '" stroke-linejoin="round"/>'; }
  function sh(C, x, y, w, h, rx) { return es3d(C) ? rc(x + 3, y + 4, w, h, { rx: rx, f: '#000' }).replace('/>', ' opacity=".13"/>') : ''; }
  function flecha(x1, y1, x2, y2, c) { var a = Math.atan2(y2 - y1, x2 - x1), L = 8; return ln(x1, y1, x2, y2, c, 1.8) + '<path d="M' + r1(x2) + ' ' + r1(y2) + ' L' + r1(x2 - L * Math.cos(a - .45)) + ' ' + r1(y2 - L * Math.sin(a - .45)) + ' L' + r1(x2 - L * Math.cos(a + .45)) + ' ' + r1(y2 - L * Math.sin(a + .45)) + 'Z" fill="' + c + '"/>'; }
  function mk(n, x, y, T, F) { return ci(x, y, 11, T.acc, '#fff', 2) + tx(x, y + 4.5, n, { f: F, s: 12, w: 700, c: '#fff' }); }
  function mc(e, ops, bien, x) { ops = ops.slice(); return it('mc', e, 'abc'.charAt(ops.indexOf(bien)) + ') ' + bien, Object.assign({ o: ops, c: ops.indexOf(bien) }, x || {})); }
  function mcM(r, e, ops, bien, x) { return mc(e, H.mezcla(r, ops.slice()), bien, x); }
  function fmt(n, C) { return H.num(n, C); }
  function bon(v) { if (v <= 0) return 0; if (v < 10) return Math.round(v * 10) / 10; var p = Math.pow(10, Math.max(0, Math.floor(Math.log10(v)) - 1)); return Math.round(v / p) * p; }
  function m(eur, C) { return bon(eur * (FX[C.pk] || 1)); }
  function din(v, C) { return H.din(v, C); }
  function sub(s, C) { return H.sub ? H.sub(s, C) : s; }
  function leyenda(x, y, filas, T, F, paso) {
    paso = paso || 30; var o = '';
    filas.forEach(function (f, i) {
      var yy = y + i * paso; o += mk(f.n, x + 11, yy, T, F);
      if (f.oc) o += ln(x + 28, yy + 6, x + 190, yy + 6, T.ink, 1, ' stroke-dasharray="3 3"');
      else { o += tx(x + 28, yy + (f.b ? 0 : 4), f.a, { f: F, s: 12.5, a: 'start', w: 700, c: T.ink }); if (f.b) o += tx(x + 28, yy + 13, f.b, { f: F, s: 11.5, a: 'start', c: T.acc }); }
    });
    return o;
  }

  /* ─────────── Diccionario para las escenas ─────────── */
  var DIC = null;
  function dic() {
    if (DIC) return DIC; var D = {}, n = 0;
    var I = window.EU_IDIOMAS; ((I && I.TEMAS) || []).forEach(function (t) { ((t && t.pal) || []).forEach(function (p) { if (!p || !p.es) return; var k = String(p.es).replace(/^(el|la|los|las)\s+/, ''); if (!D[k]) { D[k] = p; n++; } }); });
    if (n) DIC = D; /* no se cachea vacío: EU_IDIOMAS puede cargarse después */
    return D;
  }
  function lenguas(C) {
    var I = window.EU_IDIOMAS, op = C.op || {};
    if (C.mat === 'idiomas') { var base = op.base || 'es', l = (op.idiomas && op.idiomas.length ? op.idiomas : ['es', 'en']).filter(function (x) { return x !== base; }), o = l[0] || (base === 'en' ? 'es' : 'en'); return { base: base, otro: o, n: I && I.LENG && I.LENG[o] && I.LENG[o].n ? String(I.LENG[o].n).toLowerCase() : o }; }
    if (C.mat === 'ingles') return { base: 'es', otro: 'en', n: 'inglés' };
    return { base: 'es', otro: null };
  }
  function pal(k, lg, C) { var p = dic()[k]; if (!p) return lg === 'es' ? k : ''; var w = p[lg] || ''; return lg === 'es' ? sub(w, C) : w; }
  function escena(u, C, r, S) {
    if (!C || !C.T || !S || !S.pts) return null;
    var T = C.T, F = T.cuerpo, L = lenguas(C), D = dic(), pts = S.pts.filter(function (p) { return p && D[p[0]]; });
    if (pts.length < 5) return null;
    var oc = H.mezcla(r, pts.map(function (_, i) { return i; })).slice(0, 3), out = S.dib(T, F);
    pts.forEach(function (p, i) { if (p.length > 3) out += ln(p[1], p[2], p[3], p[4], T.ink, 1.2); out += mk(i + 1, p.length > 3 ? p[3] : p[1], p.length > 3 ? p[4] : p[2], T, F); });
    var filas = pts.map(function (p, i) { return { n: i + 1, a: pal(p[0], L.base, C), b: L.otro ? pal(p[0], L.otro, C) : '', oc: oc.indexOf(i) >= 0 }; });
    var paso = Math.min(32, Math.floor((S.H - 30) / filas.length));
    out += rc(S.W + 6, 8, 208, S.H - 16, { rx: 10, f: clr(T.acc, .92), s: clr(T.acc, .5), sw: 1 }) + leyenda(S.W + 18, 30, filas, T, F, paso);
    var items = oc.map(function (i) { var k = pts[i][0]; return L.otro ? it('corta', 'Escribe en ' + L.n + ' el nombre del número ' + (i + 1) + '.', pal(k, L.otro, C)) : it('corta', H.pick(r, ['¿Qué es el número ', 'Escribe el nombre del número ']) + (i + 1) + '.', pal(k, 'es', C)); });
    items = items.map(function (x) { if (/^¿/.test(x.e) && !/\?$/.test(x.e)) x.e = x.e.replace(/\.$/, '?'); return x; });
    if (L.otro) { var v = pts.filter(function (_, i) { return oc.indexOf(i) < 0; }), k2 = v.length ? H.pick(r, v)[0] : pts[0][0]; items.push(it('abierta', 'Escribe una frase en ' + L.n + ' con la palabra del dibujo «' + pal(k2, L.otro, C) + '».', '', { lin: 2 })); }
    else if (S.extra) items = items.concat(S.extra(r, C));
    var tt = L.otro ? pal(S.tema, L.otro, C) : '';
    return { t: S.t + (tt ? ' · ' + tt : ''), intro: S.intro + (L.otro ? ' Los números vacíos los completas tú en ' + L.n + '.' : ' Completa los números que faltan.'), fig: svg(S.W + 220, S.H, out, 620), items: items };
  }
  var VERDE = '#8DBE6A', CIELO = '#DDEEF7', TIERRA = '#C9A26B', GRIS = '#8A8F96';

  function genCasa(u, C, r) {
    return escena(u, C, r, { t: 'La casa', tema: 'casa', W: 420, H: 330, intro: 'Una casa por dentro: cada número señala una parte.',
      pts: [['casa', 190, 62], ['cama', 125, 158], ['baño', 234, 164], ['ventana', 296, 124], ['cocina', 80, 216], ['mesa', 118, 246], ['silla', 176, 240], ['puerta', 276, 250], ['jardín', 392, 300]],
      dib: function (T, F) {
        var o = rc(0, 0, 420, 300, { f: CIELO }) + rc(0, 290, 420, 40, { f: VERDE });
        o += pa('M45 112 L190 30 L335 112 Z', clr(T.acc2, .35), T.ink, 2) + rc(60, 110, 260, 180, { f: clr(T.acc, .86), s: T.ink, sw: 2 });
        o += ln(60, 200, 320, 200, T.ink, 2) + ln(190, 110, 190, 200, T.ink, 2) + ln(230, 200, 230, 290, T.ink, 2);
        o += rc(78, 168, 94, 20, { rx: 3, f: '#fff', s: T.ink }) + rc(76, 150, 10, 40, { f: TIERRA, s: T.ink }) + rc(90, 160, 24, 9, { rx: 4, f: clr(T.acc2, .6), s: T.ink, sw: 1 });
        o += pa('M205 170 H268 V180 Q268 194 254 194 H219 Q205 194 205 180 Z', '#fff', T.ink, 1.5) + ln(262, 150, 262, 170, T.ink, 1.5);
        o += rc(280, 124, 32, 30, { f: '#fff', s: T.ink }) + ln(296, 124, 296, 154, T.ink, 1) + ln(280, 139, 312, 139, T.ink, 1);
        o += rc(84, 248, 72, 6, { f: TIERRA, s: T.ink, sw: 1 }) + ln(90, 254, 90, 288, T.ink, 2) + ln(150, 254, 150, 288, T.ink, 2);
        o += rc(166, 256, 22, 4, { f: TIERRA, s: T.ink, sw: 1 }) + ln(186, 230, 186, 288, T.ink, 2.5) + ln(168, 260, 168, 288, T.ink, 2);
        o += rc(258, 226, 38, 64, { rx: 2, f: TIERRA, s: T.ink }) + ci(288, 260, 2.5, T.ink);
        o += rc(364, 226, 12, 66, { f: TIERRA }) + ci(370, 212, 30, VERDE, osc(VERDE, .25), 2) + ci(400, 286, 4, T.acc2) + ci(344, 288, 4, T.acc2);
        return o;
      },
      extra: function (rr, C) { return [mcM(rr, '¿Dónde dormimos?', [sub('en la cama', C), sub('en la mesa', C), sub('en la puerta', C)], sub('en la cama', C)), it('abierta', 'Colorea el tejado y dibuja una flor en el jardín.', '', { lin: 0 })]; }
    });
  }
  function genCiudad(u, C, r) {
    return escena(u, C, r, { t: 'La ciudad', tema: 'ciudad', W: 420, H: 330, intro: 'Una calle de la ciudad con sus tiendas, sus servicios y su transporte.',
      pts: [['tren', 60, 22], ['tienda', 70, 104], ['panadería', 180, 104], ['hospital', 290, 70], ['parque', 386, 150], ['acera', 400, 229], ['calle', 330, 268], ['autobús', 105, 262], ['bicicleta', 270, 246]],
      dib: function (T, F) {
        var o = rc(0, 0, 420, 222, { f: CIELO });
        o += ln(0, 48, 236, 48, T.ink, 3) + rc(20, 22, 70, 24, { rx: 5, f: T.acc2, s: T.ink }) + rc(96, 22, 70, 24, { rx: 5, f: T.acc2, s: T.ink });
        [30, 50, 70, 106, 126, 146].forEach(function (x) { o += rc(x, 27, 12, 9, { f: '#fff' }); });
        o += rc(20, 90, 100, 130, { f: clr(T.acc, .8), s: T.ink }) + rc(18, 144, 104, 14, { f: T.acc, s: T.ink }) + rc(32, 168, 76, 40, { f: '#fff', s: T.ink });
        o += rc(130, 90, 100, 130, { f: '#F2D7A6', s: T.ink }) + rc(146, 120, 68, 20, { rx: 4, f: '#fff', s: T.ink }) + tx(180, 135, 'PAN', { f: F, s: 13, w: 700, c: T.ink }) + rc(166, 168, 30, 52, { f: TIERRA, s: T.ink });
        o += rc(240, 50, 100, 170, { f: '#fff', s: T.ink }) + rc(282, 88, 16, 44, { f: '#D23B3B' }) + rc(268, 102, 44, 16, { f: '#D23B3B' });
        [252, 318].forEach(function (x) { [150, 180].forEach(function (y) { o += rc(x, y, 14, 16, { f: CIELO, s: T.ink, sw: 1 }); }); });
        o += rc(372, 180, 8, 40, { f: TIERRA }) + ci(376, 172, 20, VERDE, osc(VERDE, .25)) + rc(404, 196, 6, 24, { f: TIERRA }) + ci(407, 190, 13, VERDE, osc(VERDE, .25)) + rc(346, 206, 22, 4, { f: TIERRA });
        o += rc(0, 220, 420, 18, { f: '#D9D6CF' }) + rc(0, 238, 420, 60, { f: '#5C6168' }) + rc(0, 298, 420, 32, { f: '#D9D6CF' });
        for (var x = 10; x < 420; x += 40) o += rc(x, 266, 22, 4, { f: '#fff' });
        o += rc(40, 246, 132, 40, { rx: 7, f: T.acc, s: T.ink }) + [52, 76, 100, 124, 148].map(function (x) { return rc(x, 252, 18, 13, { f: '#fff' }); }).join('') + ci(70, 288, 9, '#222') + ci(144, 288, 9, '#222');
        o += ci(252, 282, 14, 'none', T.ink, 2.5) + ci(292, 282, 14, 'none', T.ink, 2.5) + pa('M252 282 L268 264 L292 282 M268 264 L262 282 L252 282 M268 264 L286 262 M262 258 H274', 'none', T.acc, 2.5);
        return o;
      },
      extra: function (rr, C) { return [mcM(rr, '¿Dónde compramos el pan?', [sub('en la panadería', C), 'en el hospital', 'en el parque'], sub('en la panadería', C)), it('abierta', '¿Qué transporte usas tú para ir a la escuela?', '', { lin: 1 })]; }
    });
  }
  function genCuerpo(u, C, r) {
    return escena(u, C, r, { t: 'El cuerpo', tema: 'cuerpo', W: 300, H: 340, intro: 'Las partes del cuerpo que usamos cada día.',
      pts: [['cabeza', 176, 44, 254, 30], ['ojo', 164, 64, 254, 62], ['oreja', 193, 74, 254, 96], ['nariz', 148, 80, 40, 58], ['boca', 142, 94, 40, 98], ['brazo', 92, 168, 36, 158], ['mano', 62, 222, 30, 232], ['pie', 184, 318, 254, 312]],
      dib: function (T, F) {
        var piel = '#F1C9A5', ps = osc(piel, .3), o = '';
        o += '<ellipse cx="110" cy="74" rx="7" ry="12" fill="' + piel + '" stroke="' + ps + '" stroke-width="1.5"/><ellipse cx="190" cy="74" rx="7" ry="12" fill="' + piel + '" stroke="' + ps + '" stroke-width="1.5"/>';
        o += ci(150, 70, 38, piel, ps, 1.5) + pa('M114 58 Q150 18 186 58 Q170 40 150 42 Q130 40 114 58 Z', TIERRA, osc(TIERRA, .3), 1) + ci(136, 64, 4, '#222') + ci(164, 64, 4, '#222') + pa('M150 70 L145 83 H153', 'none', ps, 1.8) + pa('M138 92 Q150 103 162 92', 'none', '#B5473C', 2.5);
        o += rc(142, 104, 16, 16, { f: piel }) + '<line x1="113" y1="130" x2="70" y2="210" stroke="' + clr(T.acc, .3) + '" stroke-width="17" stroke-linecap="round"/><line x1="187" y1="130" x2="230" y2="210" stroke="' + clr(T.acc, .3) + '" stroke-width="17" stroke-linecap="round"/>';
        o += ci(66, 220, 11, piel, ps) + ci(234, 220, 11, piel, ps) + rc(110, 116, 80, 112, { rx: 16, f: clr(T.acc, .3), s: osc(T.acc, .2) });
        o += '<line x1="134" y1="226" x2="130" y2="306" stroke="' + clr(T.acc2, .2) + '" stroke-width="19" stroke-linecap="round"/><line x1="166" y1="226" x2="170" y2="306" stroke="' + clr(T.acc2, .2) + '" stroke-width="19" stroke-linecap="round"/>';
        o += '<ellipse cx="120" cy="318" rx="17" ry="7" fill="#444"/><ellipse cx="182" cy="318" rx="17" ry="7" fill="#444"/>';
        return o;
      },
      extra: function (rr) { return [it('corta', '¿Cuántos dedos tiene una mano?', 5), it('corta', '¿Con qué parte del cuerpo oímos?', 'con las orejas (el oído)')]; }
    });
  }
  function genRopa(u, C, r) {
    return escena(u, C, r, { t: 'La ropa', tema: 'ropa', W: 420, H: 320, intro: 'Ropa tendida para secar y ropa lista para salir.',
      pts: [['camisa', 60, 132], ['pantalón', 140, 152], ['falda', 210, 122], ['vestido', 285, 152], ['calcetín', 350, 128], ['bufanda', 398, 156], ['zapato', 74, 256], ['sombrero', 190, 244], ['guante', 270, 236], ['abrigo', 360, 300]],
      dib: function (T, F) {
        var o = pa('M8 38 Q210 56 412 38', 'none', T.ink, 1.5), a = clr(T.acc, .35), b = clr(T.acc2, .3), c = clr(T.acc, .65);
        o += pa('M30 46 L50 41 L70 41 L90 46 L100 72 L88 76 L86 62 V120 H34 V62 L32 76 L20 72 Z', a, osc(a, .3));
        o += pa('M114 44 H166 L169 142 H147 L140 72 L133 142 H111 Z', '#4A6FA5', osc('#4A6FA5', .3));
        o += pa('M195 46 H225 L246 112 H174 Z', b, osc(b, .3));
        o += pa('M270 46 H300 L298 72 L320 142 H250 L272 72 Z', c, osc(c, .3));
        o += pa('M335 48 H352 V92 L368 103 L360 116 L335 102 Z', '#fff', T.ink);
        o += rc(376, 48, 16, 96, { f: T.acc2, s: osc(T.acc2, .3) }) + [378, 383, 388].map(function (x) { return ln(x, 144, x, 152, T.acc2, 2); }).join('');
        [60, 140, 210, 285, 344, 384].forEach(function (x) { o += rc(x - 3, 40, 6, 12, { rx: 1, f: TIERRA }); });
        o += pa('M40 296 V274 H70 L82 284 L112 289 V298 H40 Z', '#6B4A2F', '#3E2A1A');
        o += '<ellipse cx="190" cy="294" rx="44" ry="7" fill="' + osc(T.acc2, .2) + '"/>' + rc(165, 262, 50, 32, { rx: 7, f: T.acc2 }) + rc(165, 282, 50, 6, { f: osc(T.acc2, .35) });
        o += pa('M256 296 V262 L260 250 L264 262 V246 L268 244 L272 246 V260 V244 L276 242 L280 244 V262 L284 250 L288 252 L286 272 L282 296 Z', clr(T.acc, .15), osc(T.acc, .3));
        o += ln(360, 168, 360, 178, T.ink, 2) + pa('M330 188 L360 178 L390 188 L402 290 H318 Z', '#8A5A3C', '#5A3A24') + ln(360, 180, 360, 290, '#5A3A24', 1.5) + [205, 230, 255].map(function (y) { return ci(366, y, 3, '#F2D7A6'); }).join('');
        return o;
      },
      extra: function (rr, C) { return [mcM(rr, '¿Qué te pones en los pies?', [sub('el zapato', C), 'el sombrero', 'la bufanda'], sub('el zapato', C)), it('abierta', '¿Qué ropa te pones cuando hace frío?', '', { lin: 1 })]; }
    });
  }
  var FORMAS = {
    'círculo': function (x, y, s) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r1(38 * s) + '"'; },
    'cuadrado': function (x, y, s) { var a = 68 * s; return '<rect x="' + r1(x - a / 2) + '" y="' + r1(y - a / 2) + '" width="' + r1(a) + '" height="' + r1(a) + '"'; },
    'triángulo': function (x, y, s) { var a = 40 * s; return '<path d="M' + x + ' ' + r1(y - a) + ' L' + r1(x + a * 1.1) + ' ' + r1(y + a * .8) + ' L' + r1(x - a * 1.1) + ' ' + r1(y + a * .8) + ' Z"'; },
    'rectángulo': function (x, y, s) { return '<rect x="' + r1(x - 42 * s) + '" y="' + r1(y - 24 * s) + '" width="' + r1(84 * s) + '" height="' + r1(48 * s) + '"'; },
    'estrella': function (x, y, s) { var p = []; for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = (i % 2 ? 17 : 40) * s; p.push(r1(x + rr * Math.cos(a)) + ' ' + r1(y + rr * Math.sin(a))); } return '<path d="M' + p.join(' L') + ' Z"'; },
    'corazón': function (x, y, s) { var k = s * 36; return '<path d="M' + x + ' ' + r1(y + k) + ' C' + r1(x - k * 1.6) + ' ' + r1(y - k * .2) + ' ' + r1(x - k * .7) + ' ' + r1(y - k * 1.2) + ' ' + x + ' ' + r1(y - k * .4) + ' C' + r1(x + k * .7) + ' ' + r1(y - k * 1.2) + ' ' + r1(x + k * 1.6) + ' ' + r1(y - k * .2) + ' ' + x + ' ' + r1(y + k) + ' Z"'; },
    'rombo': function (x, y, s) { return '<path d="M' + x + ' ' + r1(y - 42 * s) + ' L' + r1(x + 30 * s) + ' ' + y + ' L' + x + ' ' + r1(y + 42 * s) + ' L' + r1(x - 30 * s) + ' ' + y + ' Z"'; },
    'óvalo': function (x, y, s) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + r1(44 * s) + '" ry="' + r1(28 * s) + '"'; },
    'hexágono': function (x, y, s) { var p = []; for (var i = 0; i < 6; i++) { var a = i * Math.PI / 3; p.push(r1(x + 38 * s * Math.cos(a)) + ' ' + r1(y + 38 * s * Math.sin(a))); } return '<path d="M' + p.join(' L') + ' Z"'; }
  };
  var LADOS = { 'cuadrado': 4, 'triángulo': 3, 'rectángulo': 4, 'rombo': 4, 'hexágono': 6 };
  function genFormas(u, C, r) {
    var sel = H.mezcla(r, Object.keys(FORMAS)).slice(0, 8), tam = sel.map(function () { return H.pick(r, [.5, .75, 1]); });
    if (tam.indexOf(1) < 0) tam[0] = 1; if (tam.indexOf(.5) < 0) tam[1] = .5;
    var gr = tam.indexOf(1), pq = tam.indexOf(.5), L = lenguas(C);
    var S = { t: 'Formas y tamaños', tema: 'formas', W: 420, H: 300, intro: 'Formas grandes, medianas y pequeñas.',
      pts: sel.map(function (k, i) { return [k, 52 + (i % 4) * 105, 38 + Math.floor(i / 4) * 140]; }),
      dib: function (T) { var pal6 = SV.paleta(C), o = ''; sel.forEach(function (k, i) { var x = 52 + (i % 4) * 105, y = 92 + Math.floor(i / 4) * 140; if (es3d(C)) o += FORMAS[k](x + 3, y + 4, tam[i]) + ' fill="#000" opacity=".13"/>'; o += FORMAS[k](x, y, tam[i]) + ' fill="' + clr(pal6[i % pal6.length], .25) + '" stroke="' + osc(pal6[i % pal6.length], .25) + '" stroke-width="2"/>'; }); return o; },
      extra: function (rr, C2) { var ex = [it('corta', '¿Qué número tiene una forma pequeña?', pq + 1, { ac: tam.map(function (t, i) { return t === .5 ? i + 1 : null; }).filter(Boolean) })]; var lad = sel.filter(function (k) { return LADOS[k]; }); if (lad.length) { var k = H.pick(rr, lad); ex.push(it('corta', '¿Cuántos lados tiene ' + pal(k, 'es', C2) + '?', LADOS[k])); } return ex; }
    };
    var x = escena(u, C, r, S); if (!x) return null;
    if (L.otro) x.items.splice(3, 0, it('corta', 'La forma número ' + (gr + 1) + ', ¿es grande o pequeña? Contesta en ' + L.n + '.', pal('grande', L.otro, C)));
    return x;
  }
  function genFamilia(u, C, r) {
    var gente = [['abuelo', 150, 60, 1], ['abuela', 230, 60, 1], ['tía', 70, 170, 0], ['tío', 140, 170, 0], ['padre', 250, 170, 0], ['madre', 330, 170, 0], ['hermano', 220, 280, 0], ['hermana', 290, 280, 0], ['bebé', 360, 284, 0]];
    return escena(u, C, r, { t: 'La familia', tema: 'familia', W: 420, H: 330, intro: 'Un árbol de familia de tres generaciones: abuelos, padres y tíos, hermanos.',
      pts: gente.map(function (g) { return [g[0], g[1] + 20, g[2] - 26]; }),
      dib: function (T, F) {
        var o = ln(150, 60, 230, 60, T.ink, 2) + ln(190, 60, 190, 115, T.ink, 2) + ln(140, 115, 250, 115, T.ink, 2) + ln(140, 115, 140, 140, T.ink, 2) + ln(250, 115, 250, 140, T.ink, 2);
        o += ln(70, 170, 140, 170, T.ink, 2) + ln(250, 170, 330, 170, T.ink, 2) + ln(290, 170, 290, 228, T.ink, 2) + ln(220, 228, 360, 228, T.ink, 2) + [220, 290, 360].map(function (x) { return ln(x, 228, x, 250, T.ink, 2); }).join('');
        gente.forEach(function (g, i) { var s = g[0] === 'bebé' ? .7 : 1, c = SV.paleta(C)[i % 6]; o += pa('M' + (g[1] - 22 * s) + ' ' + (g[2] + 30 * s) + ' Q' + g[1] + ' ' + (g[2] - 6 * s) + ' ' + (g[1] + 22 * s) + ' ' + (g[2] + 30 * s) + ' Z', clr(c, .3), osc(c, .2)) + ci(g[1], g[2] - 4 * s, 13 * s, '#F1C9A5', '#C99A76') + (g[3] ? pa('M' + (g[1] - 13) + ' ' + (g[2] - 8) + ' Q' + g[1] + ' ' + (g[2] - 26) + ' ' + (g[1] + 13) + ' ' + (g[2] - 8), '#ddd', '#aaa') : ''); });
        return o;
      },
      extra: function (rr, C2) { return [mcM(rr, '¿Quién es el padre de mi padre?', [pal('abuelo', 'es', C2), pal('tío', 'es', C2), pal('hermano', 'es', C2)], pal('abuelo', 'es', C2))]; }
    });
  }

  /* ─────────── Redes sociales ─────────── */
  var FMT = [['R', 'Reel o vídeo corto'], ['C', 'Carrusel'], ['H', 'Historia'], ['D', 'Directo']];
  function genCalendario(u, C, r) {
    var T = C.T, F = T.cuerpo, pal6 = SV.paleta(C), col = { R: T.acc, C: T.acc2, H: osc(T.acc, .35), D: osc(T.acc2, .35) }, dias = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    var plan = H.pick(r, [{ R: [0, 2, 4], C: [1, 3], H: [0, 1, 2, 3, 4, 5, 6], D: [] }, { R: [1, 3, 5], C: [0, 4], H: [0, 2, 4, 6], D: [6] }, { R: [0, 3, 5], C: [2], H: [1, 3, 5], D: [4] }]);
    var W = 600, Hh = 330, x0 = 40, y0 = 50, cw = 76, chh = 62, out = '', cnt = { R: 0, C: 0, H: 0, D: 0 }, porDia = [0, 0, 0, 0, 0, 0, 0], sem = 4;
    dias.forEach(function (d, j) { out += tx(x0 + j * cw + cw / 2, y0 - 12, d, { f: F, s: 14, w: 700, c: T.ink }); });
    for (var w = 0; w < sem; w++) for (var j = 0; j < 7; j++) {
      var x = x0 + j * cw, y = y0 + w * chh; out += rc(x + 2, y + 2, cw - 4, chh - 4, { rx: 6, f: '#fff', s: clr(T.acc, .55), sw: 1 }) + tx(x + 10, y + 16, w * 7 + j + 1, { f: F, s: 10, a: 'start', c: GRIS });
      var k = 0; ['R', 'C', 'H', 'D'].forEach(function (f) { if (plan[f].indexOf(j) >= 0) { cnt[f]++; porDia[j]++; out += rc(x + 8 + k * 16, y + 28, 14, 20, { rx: 3, f: col[f] }) + tx(x + 15 + k * 16, y + 42, f, { f: F, s: 10, w: 700, c: '#fff' }); k++; } });
    }
    FMT.forEach(function (f, i) { out += rc(x0 + i * 140, 305, 14, 14, { rx: 3, f: col[f[0]] }) + tx(x0 + i * 140 + 20, 316, f[1], { f: F, s: 11.5, a: 'start', c: T.ink }); });
    var tot = cnt.R + cnt.C + cnt.H + cnt.D, sinH = tot - cnt.H, top = porDia.indexOf(Math.max.apply(null, porDia));
    var DN = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
    var items = [it('corta', '¿Cuántas publicaciones hay en total en las cuatro semanas?', tot, { x: 'R ' + cnt.R + ' + C ' + cnt.C + ' + H ' + cnt.H + ' + D ' + cnt.D }), it('corta', 'Sin contar las historias, ¿qué porcentaje del contenido son reels?', fmt(r1(cnt.R / sinH * 100), C) + ' %', { ac: [r1(cnt.R / sinH * 100)], x: cnt.R + ' ÷ ' + sinH + ' × 100' }), it('corta', '¿Qué día de la semana tiene más publicaciones?', DN[top]),
      it('abierta', 'Si cada reel te lleva 90 minutos y cada carrusel 45, ¿cuántas horas de producción necesitas al mes? ¿Te cabe en tu semana?', fmt(r1((cnt.R * 90 + cnt.C * 45) / 60), C) + ' h', { lin: 2 })];
    return { t: 'Calendario de publicación', intro: 'Plan de contenidos de un mes para una cuenta que empieza. La constancia pesa más que el volumen: mejor un ritmo que puedas sostener.', fig: svg(W, Hh, out, 580), items: items };
  }
  function genAnatomia(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 600, Hh = 380, px = 60, py = 14, out = '';
    var A = E(r, 8, 40) * 100, L = Math.round(A * (E(r, 30, 90) / 1000)), c = Math.round(L * E(r, 4, 12) / 100), g = Math.round(L * E(r, 8, 25) / 100), s = Math.round(L * E(r, 3, 10) / 100);
    out += sh(C, px, py, 200, 352, 26) + rc(px, py, 200, 352, { rx: 26, f: '#1E1E22' }) + rc(px + 10, py + 22, 180, 316, { rx: 8, f: '#fff' });
    out += ci(px + 30, py + 44, 12, clr(T.acc, .4), T.acc) + rc(px + 48, py + 36, 70, 7, { rx: 3, f: '#333' }) + rc(px + 48, py + 47, 44, 5, { rx: 2, f: '#bbb' });
    out += rc(px + 10, py + 64, 180, 150, { f: clr(T.acc2, .55) }) + pa('M' + (px + 90) + ' ' + (py + 118) + ' l24 16 l-24 16 z', '#fff') + tx(px + 100, py + 200, '0:03', { f: F, s: 10, c: '#fff' });
    ['me gusta ' + L, c + ' coment.', s + ' compart.', g + ' guard.'].forEach(function (t, i) { out += tx(px + 20 + i * 44, py + 232, t, { f: F, s: 8.5, a: 'start', c: '#333' }); });
    out += rc(px + 20, py + 244, 150, 8, { rx: 3, f: '#333' }) + rc(px + 20, py + 258, 130, 6, { rx: 3, f: '#999' }) + rc(px + 20, py + 270, 110, 6, { rx: 3, f: '#999' });
    out += rc(px + 20, py + 286, 90, 16, { rx: 8, f: T.acc }) + tx(px + 65, py + 298, 'Enlace en la bio', { f: F, s: 8.5, w: 700, c: '#fff' }) + tx(px + 20, py + 322, '#tema #ciudad #nicho', { f: F, s: 9, a: 'start', c: T.acc });
    var P = [[1, px + 30, py + 44, 'Perfil: foto y nombre que se reconocen'], [2, px + 100, py + 110, 'Visual: los 3 primeros segundos'], [3, px + 20, py + 232, 'Métricas de la publicación'], [4, px + 20, py + 248, 'Gancho: la primera línea del texto'], [5, px + 65, py + 294, 'Llamada a la acción'], [6, px + 20, py + 322, 'Etiquetas y palabras clave']];
    P.forEach(function (p, i) { var yy = 40 + i * 54; out += ln(p[1], p[2], 300, yy, T.ink, 1, ' stroke-dasharray="3 3"') + mk(p[0], 300, yy, T, F) + tx(318, yy + 4, p[3], { f: F, s: 12.5, a: 'start', c: T.ink }); });
    var tasa = r1((L + c + g + s) / A * 100);
    var items = [it('corta', 'La publicación llegó a ' + fmt(A, C) + ' cuentas. Calcula la tasa de interacción sobre el alcance.', fmt(tasa, C) + ' %', { ac: [tasa], x: '(' + L + ' + ' + c + ' + ' + g + ' + ' + s + ') ÷ ' + fmt(A, C) + ' × 100' }),
      it('corta', '¿Qué es mayor, los guardados o los comentarios? ¿Cuántos más?', (g >= c ? 'guardados, ' + (g - c) + ' más' : 'comentarios, ' + (c - g) + ' más')),
      mcM(r, '¿Qué parte decide si alguien sigue mirando o pasa de largo?', ['el visual de los primeros segundos', 'las etiquetas', 'el nombre del perfil'], 'el visual de los primeros segundos'),
      it('abierta', 'Escribe dos ganchos distintos para una publicación sobre tu negocio o afición.', '', { lin: 2 })];
    return { t: 'Anatomía de una publicación', intro: 'Las partes de una publicación en una red de vídeo o imagen. Los guardados y los compartidos dicen más del interés real que los «me gusta».', fig: svg(W, Hh, out, 580), items: items };
  }
  function genFormatos(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 600, Hh = 300, out = '';
    var D = [['Reel', E(r, 18, 40) * 100, E(r, 5, 9), 90], ['Carrusel', E(r, 8, 18) * 100, E(r, 7, 12), 45], ['Historia', E(r, 3, 8) * 100, E(r, 2, 5), 10], ['Directo', E(r, 2, 6) * 100, E(r, 10, 18), 60]];
    var mx = Math.max.apply(null, D.map(function (d) { return d[1]; }));
    out += tx(150, 22, 'Alcance medio', { f: F, s: 13, w: 700, c: T.ink }) + tx(390, 22, 'Interacción', { f: F, s: 13, w: 700, c: T.ink }) + tx(520, 22, 'Minutos', { f: F, s: 13, w: 700, c: T.ink });
    D.forEach(function (d, i) {
      var y = 44 + i * 60, w = d[1] / mx * 200; out += tx(78, y + 22, d[0], { f: F, s: 13, a: 'end', w: 700, c: T.ink }) + sh(C, 86, y, w, 30, 4) + rc(86, y, w, 30, { rx: 4, f: SV.paleta(C)[i] }) + tx(92 + w, y + 20, fmt(d[1], C), { f: F, s: 12, a: 'start', c: T.ink });
      out += rc(350, y, d[2] * 8, 30, { rx: 4, f: clr(T.acc2, .4) }) + tx(356 + d[2] * 8, y + 20, d[2] + ' %', { f: F, s: 12, a: 'start', c: T.ink }) + tx(520, y + 20, d[3] + ' min', { f: F, s: 12, c: T.ink });
    });
    out += tx(300, 290, 'Datos de ejemplo de una cuenta pequeña durante un mes', { f: F, s: 11, c: GRIS });
    var ef = D.map(function (d) { return r1(d[1] / d[3]); }), best = ef.indexOf(Math.max.apply(null, ef)), ia = D.map(function (d) { return Math.round(d[1] * d[2] / 100); }), bi = ia.indexOf(Math.max.apply(null, ia));
    var items = [it('corta', '¿Cuántas personas interactúan, de media, con un ' + D[1][0].toLowerCase() + '?', ia[1], { x: fmt(D[1][1], C) + ' × ' + D[1][2] + ' %' }), it('corta', '¿Qué formato consigue más alcance por minuto de trabajo?', D[best][0].toLowerCase(), { x: D.map(function (d, i) { return d[0] + ': ' + fmt(ef[i], C); }).join(' · ') }),
      it('corta', '¿Qué formato suma más interacciones en total por publicación?', D[bi][0].toLowerCase()), it('abierta', 'Con 5 horas a la semana, ¿qué mezcla de formatos elegirías y por qué?', '', { lin: 2 })];
    return { t: 'Comparativa de formatos', intro: 'Cada formato cumple una función: el vídeo corto atrae a gente nueva, el carrusel se guarda, la historia mantiene el contacto y el directo crea comunidad.', fig: svg(W, Hh, out, 580), items: items };
  }

  /* ─────────── Comercio electrónico ─────────── */
  function paisEc(C) { var P = (window.EU_ECOM && EU_ECOM.PAIS) || {}; return P[C.pk] || null; }
  function envC(C) { var PE = paisEc(C), e = PE && PE.envR; return e && e[0] != null && e[1] != null ? e : [m(4, C), m(8, C)]; }
  function impC(C) { var p = C.P && C.P.imp; return p && p.p ? p : { n: 'IVA', p: 21 }; }
  function genFicha(u, C, r) {
    var T = C.T, F = T.cuerpo, PE = paisEc(C), I = impC(C), W = 600, Hh = 360, out = '';
    var base = m(H.pick(r, [12, 15, 18, 24, 29]), C), pvp = bon(base * (1 + I.p / 100)), env = envC(C), gratis = bon(pvp * H.pick(r, [2, 3]));
    var st = [E(r, 20, 60), E(r, 8, 25), E(r, 2, 8), E(r, 0, 4), E(r, 0, 3)], nst = st.reduce(function (a, b) { return a + b; }, 0), med = r1((st[0] * 5 + st[1] * 4 + st[2] * 3 + st[3] * 2 + st[4]) / nst);
    out += sh(C, 10, 10, 380, 340, 10) + rc(10, 10, 380, 340, { rx: 10, f: '#fff', s: clr(T.acc, .4) }) + rc(10, 10, 380, 24, { rx: 10, f: clr(T.acc, .85) }) + [24, 38, 52].map(function (x) { return ci(x, 22, 4, '#fff'); }).join('');
    out += rc(26, 48, 160, 160, { rx: 6, f: clr(T.acc2, .8) }) + pa('M70 100 H140 V160 Q140 180 120 180 H90 Q70 180 70 160 Z', '#fff', T.ink, 2) + pa('M140 115 Q165 115 165 135 Q165 155 140 155', 'none', T.ink, 2) + [0, 1, 2, 3].map(function (i) { return rc(26 + i * 42, 214, 34, 26, { rx: 3, f: clr(T.acc2, .6 + i * .08) }); }).join('');
    out += tx(200, 66, 'Taza de cerámica 350 ml', { f: F, s: 14, a: 'start', w: 700, c: T.ink }) + tx(200, 86, '★★★★☆  ' + fmt(med, C) + ' (' + nst + ')', { f: F, s: 12, a: 'start', c: '#C08A00' });
    out += tx(200, 116, din(pvp, C), { f: F, s: 20, a: 'start', w: 700, c: T.ink }) + tx(200, 132, I.n + ' incluido', { f: F, s: 10, a: 'start', c: GRIS });
    ['blanca', 'azul', 'verde'].forEach(function (v, i) { out += rc(200 + i * 58, 144, 52, 22, { rx: 11, f: i ? '#fff' : clr(T.acc, .8), s: T.acc, sw: 1 }) + tx(226 + i * 58, 159, v, { f: F, s: 10.5, c: T.ink }); });
    out += tx(200, 186, 'Envío ' + din(env[0], C) + '–' + din(env[1], C), { f: F, s: 11, a: 'start', c: T.ink }) + tx(200, 200, 'Gratis desde ' + din(gratis, C), { f: F, s: 11, a: 'start', c: T.acc });
    out += rc(200, 212, 170, 30, { rx: 15, f: T.acc }) + tx(285, 232, 'Añadir al carrito', { f: F, s: 12, w: 700, c: '#fff' }) + tx(26, 262, 'Devoluciones: plazo legal del país · Pago seguro', { f: F, s: 10.5, a: 'start', c: GRIS });
    [5, 4, 3, 2, 1].forEach(function (k, i) { var y = 278 + i * 13, w = st[5 - k] / Math.max.apply(null, st) * 140; out += tx(40, y + 9, k + '★', { f: F, s: 9.5, a: 'end', c: T.ink }) + rc(46, y, 140, 9, { rx: 3, f: '#eee' }) + rc(46, y, w, 9, { rx: 3, f: '#E0A800' }) + tx(192, y + 9, st[5 - k], { f: F, s: 9.5, a: 'start', c: T.ink }); });
    var P = [[1, 106, 48, 'Foto principal y galería'], [2, 200, 60, 'Título con lo que se busca'], [3, 200, 110, 'Precio con impuesto'], [4, 200, 155, 'Variantes'], [5, 200, 192, 'Envío y umbral gratis'], [6, 285, 227, 'Botón de compra'], [7, 110, 330, 'Reseñas']];
    P.forEach(function (p, i) { var yy = 40 + i * 44; out += ln(p[1], p[2], 410, yy, T.ink, .8, ' stroke-dasharray="3 3"') + mk(p[0], 410, yy, T, F) + tx(428, yy + 4, p[3], { f: F, s: 11.5, a: 'start', c: T.ink }); });
    var items = [it('corta', '¿Cuál es el precio sin ' + I.n + ' (' + I.p + ' %)?', din(r1(pvp / (1 + I.p / 100)), C), { ac: [r1(pvp / (1 + I.p / 100))], x: din(pvp, C) + ' ÷ ' + fmt(1 + I.p / 100, C) }), it('corta', 'Comprueba la nota media de las reseñas.', fmt(med, C), { ac: [med], x: '(' + st.map(function (n, i) { return n + '×' + (5 - i); }).join(' + ') + ') ÷ ' + nst }),
      it('corta', '¿Cuántas tazas hay que comprar, como mínimo, para tener envío gratis?', Math.ceil(gratis / pvp), { x: din(gratis, C) + ' ÷ ' + din(pvp, C) }), it('abierta', 'Escribe una descripción de 3 líneas para esta taza: material, medida y uso.', '', { lin: 3 })];
    return { t: 'Ficha de producto', intro: 'Una ficha que vende responde antes de que el cliente pregunte: qué es, cuánto cuesta con impuestos, cuándo llega y qué pasa si no le gusta.' + (PE ? ' Derecho de desistimiento: ' + PE.ret + '.' : ''), fig: svg(W, Hh, out, 580), items: items };
  }
  function genZonas(u, C, r) {
    var MD = window.EU_MAPAS_DATOS && EU_MAPAS_DATOS[C.pk]; if (!MD) return null;
    var T = C.T, F = T.cuerpo, PE = paisEc(C), env = envC(C), k = Math.min(360 / MD.w, 300 / MD.h), W = 600, Hh = 320, ox = 10, oy = 10, out = '';
    var cap = MD.c.filter(function (c) { return c[3]; })[0] || MD.c[0], cx = ox + cap[1] * k, cy = oy + cap[2] * k, R = Math.max(MD.w, MD.h) * k;
    var r1z = R * .2, r2z = R * .42, tar = [env[0], bon((env[0] + env[1]) / 2), env[1]];
    out += '<g transform="translate(' + ox + ' ' + oy + ') scale(' + r1(k) + ')"><path d="' + MD.d + '" fill="' + clr(T.acc, .85) + '" stroke="' + osc(T.acc, .2) + '" stroke-width="' + r1(1.2 / k) + '"/></g>';
    out += '<defs><clipPath id="zc"><rect x="0" y="0" width="380" height="320"/></clipPath></defs><g clip-path="url(#zc)">' + ci(cx, cy, r2z, clr(T.acc2, .85), T.acc2, 1.5).replace('/>', ' fill-opacity=".45"/>') + ci(cx, cy, r1z, clr(T.acc2, .6), osc(T.acc2, .2), 1.5).replace('/>', ' fill-opacity=".55"/>') + '</g>';
    var zc = function (c) { var d = Math.hypot(ox + c[1] * k - cx, oy + c[2] * k - cy); return d <= r1z ? 1 : d <= r2z ? 2 : 3; };
    var cs = MD.c.filter(function (c) { return !c[3]; });
    MD.c.forEach(function (c) { var x = ox + c[1] * k, y = oy + c[2] * k; out += c[3] ? rc(x - 7, y - 7, 14, 14, { rx: 2, f: T.ink, s: '#fff', sw: 2 }) : ci(x, y, 5, '#fff', T.ink, 2); out += tx(x + 9, y - 6, c[0] + (c[3] ? ' (almacén)' : ''), { f: F, s: 11, a: 'start', w: c[3] ? 700 : 400, c: T.ink }); });
    out += rc(396, 60, 196, 150, { rx: 8, f: '#fff', s: clr(T.acc, .4) }) + tx(494, 84, 'Tarifa por paquete', { f: F, s: 13, w: 700, c: T.ink });
    tar.forEach(function (t, i) { var y = 110 + i * 32; out += rc(410, y - 12, 16, 16, { rx: 3, f: i === 0 ? clr(T.acc2, .6) : i === 1 ? clr(T.acc2, .85) : '#fff', s: T.acc2 }) + tx(434, y + 1, 'Zona ' + (i + 1), { f: F, s: 12, a: 'start', c: T.ink }) + tx(582, y + 1, din(t, C), { f: F, s: 12, a: 'end', w: 700, c: T.ink }); });
    out += tx(494, 232, 'Tarifa de ejemplo', { f: F, s: 10, c: GRIS });
    var sel = H.mezcla(r, cs.slice()).slice(0, 3), n = sel.map(function () { return E(r, 2, 9); }), tot = sel.reduce(function (a, c, i) { return a + n[i] * tar[zc(c) - 1]; }, 0);
    var items = sel.slice(0, 2).map(function (c) { return it('corta', '¿En qué zona está ' + c[0] + '?', 'zona ' + zc(c), { ac: [zc(c)] }); });
    items.push(it('corta', 'Envías ' + sel.map(function (c, i) { return n[i] + ' paquetes a ' + c[0]; }).join(', ') + '. ¿Cuánto pagas de envío?', din(tot, C), { ac: [tot], x: sel.map(function (c, i) { return n[i] + ' × ' + din(tar[zc(c) - 1], C); }).join(' + ') }),
      it('abierta', '¿Cobrarías al cliente la tarifa real de su zona o un precio único para todo el país? Explica ventajas e inconvenientes.', '', { lin: 2 }));
    return { t: 'Mapa de envíos por zonas', intro: 'Las empresas de paquetería cobran más cuanto más lejos del almacén está el cliente.' + (PE ? ' Algunas opciones en ' + C.P.n + ': ' + PE.env.slice(0, 3).join(', ') + '.' : '') + ' Pide cotización: las cifras de la tabla son de ejemplo.', fig: svg(W, Hh, out, 580), items: items };
  }
  function genDevolucion(u, C, r) {
    var T = C.T, F = T.cuerpo, PE = paisEc(C), env = envC(C), W = 600, Hh = 340, cx = 200, cy = 170, R = 120, out = '';
    var P = ['Solicitud del cliente', 'Etiqueta de vuelta', 'Envío al almacén', 'Revisión del producto', 'Reembolso', 'Vuelta al stock'];
    P.forEach(function (p, i) { var a = -Math.PI / 2 + i * Math.PI / 3, b = a + Math.PI / 3, x = cx + R * Math.cos(a), y = cy + R * Math.sin(a); out += flecha(cx + R * Math.cos(a + .28), cy + R * Math.sin(a + .28), cx + R * Math.cos(b - .28), cy + R * Math.sin(b - .28), clr(T.acc, .3)); out += (es3d(C) ? ci(x + 2, y + 3, 26, '#000').replace('/>', ' opacity=".13"/>') : '') + ci(x, y, 26, SV.paleta(C)[i], '#fff', 3) + tx(x, y + 6, i + 1, { f: F, s: 17, w: 700, c: '#fff' }); });
    out += tx(cx, cy + 5, 'Devolución', { f: F, s: 15, w: 700, c: T.ink });
    P.forEach(function (p, i) { out += mk(i + 1, 380, 50 + i * 44, T, F) + tx(398, 55 + i * 44, p, { f: F, s: 13, a: 'start', c: T.ink }); });
    var N = E(r, 12, 40) * 10, pc = H.pick(r, [4, 6, 8, 10, 12]), dv = Math.round(N * pc / 100), ce = env[0], rev = m(H.pick(r, [1, 1.5, 2]), C), tot = r1(dv * (ce + rev));
    var items = [it('corta', 'Vendes ' + N + ' pedidos al mes y se devuelve el ' + pc + ' %. ¿Cuántas devoluciones gestionas?', dv, { x: N + ' × ' + pc + ' %' }), it('corta', 'Cada devolución te cuesta ' + din(ce, C) + ' de envío y ' + din(rev, C) + ' de revisión. ¿Cuánto pierdes al mes?', din(tot, C), { ac: [tot], x: dv + ' × (' + din(ce, C) + ' + ' + din(rev, C) + ')' }),
      mcM(r, '¿Qué paso va justo antes del reembolso?', ['la revisión del producto', 'la etiqueta de vuelta', 'la vuelta al stock'], 'la revisión del producto'), it('abierta', 'Propón dos cambios en la ficha de producto que reduzcan las devoluciones.', '', { lin: 2 })];
    return { t: 'Ciclo de una devolución', intro: 'Una devolución bien resuelta recupera al cliente. ' + (PE ? 'En ' + C.P.n + ': ' + PE.ret + '.' : ''), fig: svg(W, Hh, out, 580), items: items };
  }

  /* ─────────── Religión ─────────── */
  function pascua(y) { var a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m2 = Math.floor((a + 11 * h + 22 * l) / 451), mes = Math.floor((h + l - 7 * m2 + 114) / 31), dia = ((h + l - 7 * m2 + 114) % 31) + 1; return [mes, dia]; }
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  var FIE = [['Epifanía', 1, 6, 0], ['Miércoles de Ceniza', 2, 18, 0], ['Inicio del Ramadán*', 2, 18, 1], ['Fiesta del fin del Ramadán*', 3, 20, 1], ['Pésaj', 4, 2, 2], ['Pascua de Resurrección', 4, 5, 0], ['Fiesta del Sacrificio*', 5, 27, 1], ['Rosh Hashaná', 9, 12, 2], ['Yom Kipur', 9, 21, 2], ['Diwali', 11, 8, 3], ['Janucá', 12, 5, 2], ['Navidad', 12, 25, 0]];
  var TRAD = ['cristianismo', 'islam', 'judaísmo', 'hinduismo'];
  function genFiestas(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 600, Hh = 380, cx = 190, cy = 190, R = 150, out = '', col = [T.acc, T.acc2, osc(T.acc, .4), osc(T.acc2, .4)];
    MESES.forEach(function (mm, i) { var a0 = -Math.PI / 2 + i * Math.PI / 6, a1 = a0 + Math.PI / 6, am = (a0 + a1) / 2; out += pa('M' + cx + ' ' + cy + ' L' + r1(cx + R * Math.cos(a0)) + ' ' + r1(cy + R * Math.sin(a0)) + ' A' + R + ' ' + R + ' 0 0 1 ' + r1(cx + R * Math.cos(a1)) + ' ' + r1(cy + R * Math.sin(a1)) + ' Z', i % 2 ? '#fff' : clr(T.acc, .9), clr(T.acc, .5), 1) + tx(cx + (R + 16) * Math.cos(am), cy + (R + 16) * Math.sin(am) + 4, mm.slice(0, 3), { f: F, s: 11, w: 700, c: T.ink }); });
    out += ci(cx, cy, 36, '#fff', T.ink, 1.5) + tx(cx, cy + 6, '2026', { f: F, s: 16, w: 700, c: T.ink });
    FIE.forEach(function (f, i) { var a = -Math.PI / 2 + ((f[1] - 1) + (f[2] - .5) / 31) * Math.PI / 6, rr = 60 + (i % 4) * 22; out += ci(cx + rr * Math.cos(a), cy + rr * Math.sin(a), 7, col[f[3]], '#fff', 1.5); });
    FIE.forEach(function (f, i) { var y = 30 + i * 25; out += ci(378, y - 4, 6, col[f[3]]) + tx(390, y, f[2] + ' ' + MESES[f[1] - 1].slice(0, 3) + ' · ' + f[0], { f: F, s: 11.5, a: 'start', c: T.ink }); });
    TRAD.forEach(function (t, i) { out += ci(40 + i * 90, 368, 6, col[i]) + tx(50 + i * 90, 372, t, { f: F, s: 11, a: 'start', c: T.ink }); });
    var an = H.pick(r, [2027, 2028, 2029, 2030]), pq = pascua(an);
    var items = [it('corta', '¿Cuántos días hay entre el Miércoles de Ceniza (18 feb) y la Pascua (5 abr) de 2026?', 46, { x: '10 días de febrero + 31 de marzo + 5 de abril' }), it('corta', 'En 2027 el Ramadán empieza hacia el 8 de febrero. ¿Cuántos días se adelanta respecto a 2026?', 10, { x: '18 − 8 = 10 días (el año lunar es unos 11 días más corto)' }),
      it('corta', 'La Pascua de ' + an + ' cae el ' + pq[1] + ' de ' + MESES[pq[0] - 1] + '. ¿En qué estación del hemisferio norte?', 'primavera'), it('abierta', 'Añade al calendario una fiesta de tu país: ' + C.P.fiesta + '. ¿Es religiosa, civil o las dos cosas?', '', { lin: 2 })];
    return { t: 'Calendario de fiestas 2026', intro: 'Fiestas principales de cuatro tradiciones. Las marcadas con * dependen de la observación de la luna y pueden variar un día. Las fiestas judías empiezan la tarde anterior.', fig: svg(W, Hh, out, 580), items: items };
  }
  function genTemplos(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 600, Hh = 280, out = rc(0, 230, 600, 50, { f: clr(TIERRA, .6) }), c1 = clr(T.acc, .6), s1 = osc(T.acc, .3);
    out += rc(30, 120, 100, 110, { f: c1, s: s1 }) + pa('M30 120 L80 88 L130 120 Z', clr(T.acc2, .4), s1) + rc(66, 40, 28, 80, { f: c1, s: s1 }) + pa('M66 40 L80 22 L94 40 Z', clr(T.acc2, .4), s1) + ln(80, 4, 80, 22, T.ink, 2) + ln(72, 10, 88, 10, T.ink, 2) + pa('M68 230 V190 Q80 176 92 190 V230', '#6B4A2F');
    out += rc(170, 140, 120, 90, { f: c1, s: s1 }) + pa('M185 140 Q230 60 275 140 Z', clr(T.acc2, .4), s1) + rc(300, 60, 18, 170, { f: c1, s: s1 }) + pa('M298 60 L309 36 L320 60 Z', clr(T.acc2, .4), s1) + pa('M218 230 V195 Q230 180 242 195 V230', '#6B4A2F') + pa('M230 78 a8 8 0 1 0 6 -12 a6 6 0 1 1 -6 12', T.ink);
    out += rc(350, 120, 110, 110, { f: c1, s: s1 }) + pa('M350 120 H460 L405 96 Z', clr(T.acc2, .4), s1) + pa('M405 140 l12 21 h-24 z M405 168 l12 -21 h-24 z', 'none', T.ink, 2) + pa('M390 230 V192 H420 V230', '#6B4A2F');
    out += pa('M490 230 H590 L580 210 H500 Z', c1, s1) + pa('M505 210 Q540 120 575 210 Z', clr(T.acc2, .4), s1) + rc(534, 110, 12, 30, { f: c1, s: s1 }) + pa('M530 110 L540 60 L550 110 Z', '#D9A400', s1);
    var N = [['iglesia', 80], ['mezquita', 245], ['sinagoga', 405], ['estupa', 540]], oc = H.mezcla(r, [0, 1, 2, 3]).slice(0, 2);
    N.forEach(function (n, i) { out += mk(i + 1, n[1], 254, T, F) + (oc.indexOf(i) < 0 ? tx(n[1], 274, n[0], { f: F, s: 12, w: 700, c: T.ink }) : ''); });
    var items = oc.map(function (i) { return it('corta', '¿Qué templo es el número ' + (i + 1) + '?', N[i][0]); });
    items.push(it('corta', '¿Qué número tiene un minarete, la torre desde la que se llama a la oración?', 2), mcM(r, 'La estupa guarda…', ['reliquias de Buda', 'los rollos de la Torá', 'el altar mayor'], 'reliquias de Buda'), it('abierta', 'Elige un templo de tu ciudad y describe su forma y sus materiales.', '', { lin: 2 }));
    return { t: 'Templos del mundo', intro: 'Siluetas de cuatro espacios de culto: iglesia, mezquita, sinagoga y estupa budista. Cada forma responde a un uso.', fig: svg(W, Hh, out, 580), items: items };
  }

  /* ─────────── Música ─────────── */
  function genFamilias(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 600, Hh = 330, out = '', madera = '#B7773F', metal = '#D9A400', md = osc(madera, .3);
    var I = [
      ['violín', 'cuerda', function (x, y) { return '<ellipse cx="' + x + '" cy="' + (y + 20) + '" rx="22" ry="26" fill="' + madera + '" stroke="' + md + '"/><ellipse cx="' + x + '" cy="' + (y - 16) + '" rx="17" ry="20" fill="' + madera + '" stroke="' + md + '"/>' + rc(x - 3, y - 70, 6, 60, { f: '#333' }) + ln(x - 1, y - 66, x - 1, y + 38, '#eee', .8) + ln(x + 1, y - 66, x + 1, y + 38, '#eee', .8); }],
      ['guitarra', 'cuerda', function (x, y) { return '<ellipse cx="' + x + '" cy="' + (y + 22) + '" rx="28" ry="28" fill="' + clr(madera, .2) + '" stroke="' + md + '"/><ellipse cx="' + x + '" cy="' + (y - 16) + '" rx="21" ry="21" fill="' + clr(madera, .2) + '" stroke="' + md + '"/>' + ci(x, y + 8, 8, '#333') + rc(x - 4, y - 76, 8, 62, { f: '#5A3A24' }); }],
      ['flauta', 'viento', function (x, y) { return rc(x - 6, y - 70, 12, 130, { rx: 4, f: '#C9CDD2', s: '#8A8F96' }) + [-50, -30, -10, 10, 30].map(function (d) { return ci(x, y + d, 3, '#555'); }).join(''); }],
      ['trompeta', 'viento', function (x, y) { return rc(x - 40, y - 6, 60, 10, { rx: 4, f: metal, s: osc(metal, .3) }) + pa('M' + (x + 20) + ' ' + (y - 6) + ' L' + (x + 44) + ' ' + (y - 22) + ' V' + (y + 20) + ' L' + (x + 20) + ' ' + (y + 4) + ' Z', metal, osc(metal, .3)) + [-26, -14, -2].map(function (d) { return rc(x + d, y - 22, 6, 16, { f: osc(metal, .2) }); }).join(''); }],
      ['tambor', 'percusión', function (x, y) { return rc(x - 34, y - 20, 68, 50, { f: clr(T.acc, .3), s: osc(T.acc, .2) }) + '<ellipse cx="' + x + '" cy="' + (y - 20) + '" rx="34" ry="10" fill="#F4EEE2" stroke="' + osc(T.acc, .2) + '"/><ellipse cx="' + x + '" cy="' + (y + 30) + '" rx="34" ry="10" fill="' + clr(T.acc, .3) + '" stroke="' + osc(T.acc, .2) + '"/>' + ln(x - 30, y - 50, x - 6, y - 24, madera, 4) + ln(x + 30, y - 50, x + 6, y - 24, madera, 4); }],
      ['xilófono', 'percusión', function (x, y) { var o = ''; for (var i = 0; i < 6; i++) o += rc(x - 42 + i * 14, y - 30 + i * 4, 11, 60 - i * 8, { rx: 2, f: SV.paleta(C)[i], s: '#fff', sw: 1 }); return o + ln(x - 46, y + 34, x + 46, y + 20, '#555', 3); }],
      ['maracas', 'percusión', function (x, y) { return '<ellipse cx="' + (x - 14) + '" cy="' + (y - 16) + '" rx="14" ry="18" fill="' + T.acc2 + '"/><ellipse cx="' + (x + 14) + '" cy="' + (y - 10) + '" rx="14" ry="18" fill="' + T.acc + '"/>' + rc(x - 17, y, 6, 40, { f: madera }) + rc(x + 11, y + 6, 6, 40, { f: madera }); }],
      ['sintetizador', 'electrófono', function (x, y) { var o = rc(x - 48, y - 20, 96, 44, { rx: 4, f: '#2B2B30' }); for (var i = 0; i < 10; i++) o += rc(x - 44 + i * 9, y - 2, 8, 22, { f: '#fff', s: '#999', sw: .5 }); return o + ci(x - 36, y - 11, 4, T.acc2) + ci(x - 24, y - 11, 4, T.acc) + rc(x + 4, y - 15, 36, 8, { f: '#6EE7B7' }); }]
    ];
    var sel = H.mezcla(r, I.slice()), oc = [0, 1, 2, 3].map(function (i) { return i; });
    sel.forEach(function (s, i) { var x = 75 + (i % 4) * 150, y = 90 + Math.floor(i / 4) * 160; out += s[2](x, y) + mk(i + 1, x - 55, y - 60, T, F) + tx(x, y + 64, s[0], { f: F, s: 12.5, w: 700, c: T.ink }); });
    var fam = ['cuerda', 'viento', 'percusión', 'electrófono'], pk = H.mezcla(r, sel.map(function (_, i) { return i; })).slice(0, 3);
    var items = pk.map(function (i) { return it('corta', '¿A qué familia pertenece el instrumento ' + (i + 1) + ' (' + sel[i][0] + ')?', sel[i][1]); });
    items.push(it('corta', '¿Cuántos instrumentos de percusión hay en la lámina?', 3), mcM(r, '¿Qué vibra en una flauta?', ['una columna de aire', 'una cuerda', 'una membrana'], 'una columna de aire'), it('abierta', 'Añade un instrumento típico de ' + C.P.n + ' y di a qué familia pertenece.', '', { lin: 1 }));
    return { t: 'Familias de instrumentos', intro: 'Los instrumentos se agrupan por lo que vibra: una cuerda, una columna de aire, un cuerpo golpeado o un circuito eléctrico.', fig: svg(W, Hh, out, 580), items: items };
  }
  function genOrquesta(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 600, Hh = 320, cx = 300, cy = 290, out = '', S = [['cuerdas', 70, 150, E(r, 40, 60)], ['maderas', 150, 195, E(r, 8, 12)], ['metales', 195, 235, E(r, 9, 14)], ['percusión', 235, 270, E(r, 3, 6)]];
    S.forEach(function (s, i) { var c = SV.paleta(C)[i]; out += pa('M' + (cx - s[2]) + ' ' + cy + ' A' + s[2] + ' ' + s[2] + ' 0 0 1 ' + (cx + s[2]) + ' ' + cy + ' L' + (cx + s[1]) + ' ' + cy + ' A' + s[1] + ' ' + s[1] + ' 0 0 0 ' + (cx - s[1]) + ' ' + cy + ' Z', clr(c, .4), '#fff', 2) + mk(i + 1, cx, cy - (s[1] + s[2]) / 2, T, F); });
    out += ci(cx, cy - 20, 12, T.ink) + tx(cx, cy + 6, 'director', { f: F, s: 12, w: 700, c: T.ink }) + rc(0, cy + 12, 600, 2, { f: T.ink });
    S.forEach(function (s, i) { out += tx(20, 30 + i * 22, (i + 1) + ' · ' + s[0] + ': ' + s[3] + ' músicos', { f: F, s: 12, a: 'start', c: T.ink }); });
    var tot = S.reduce(function (a, s) { return a + s[3]; }, 0);
    var items = [it('corta', '¿Cuántos músicos tiene esta orquesta?', tot, { x: S.map(function (s) { return s[3]; }).join(' + ') }), it('corta', '¿Qué porcentaje de la orquesta son cuerdas?', fmt(Math.round(S[0][3] / tot * 100), C) + ' %', { ac: [Math.round(S[0][3] / tot * 100)] }), mcM(r, '¿Qué sección está al fondo?', ['percusión', 'cuerdas', 'maderas'], 'percusión'), it('abierta', '¿Por qué crees que los metales van detrás de las maderas?', 'Porque suenan más fuerte y taparían a las maderas.', { lin: 2 })];
    return { t: 'La colocación de la orquesta', intro: 'Vista desde arriba: el director en el centro, las cuerdas delante y los instrumentos más potentes al fondo.', fig: svg(W, Hh, out, 580), items: items };
  }

  /* ─────────── Contabilidad ─────────── */
  function cuentaT(x, y, n, deb, hab, T, F) {
    var o = tx(x + 70, y, n, { f: F, s: 12, w: 700, c: T.ink }) + ln(x, y + 8, x + 140, y + 8, T.ink, 2) + ln(x + 70, y + 8, x + 70, y + 90, T.ink, 2) + tx(x + 4, y + 22, 'Debe', { f: F, s: 9, a: 'start', c: GRIS }) + tx(x + 136, y + 22, 'Haber', { f: F, s: 9, a: 'end', c: GRIS });
    deb.forEach(function (d, i) { o += tx(x + 64, y + 40 + i * 16, d, { f: F, s: 11, a: 'end', c: T.ink }); }); hab.forEach(function (d, i) { o += tx(x + 76, y + 40 + i * 16, d, { f: F, s: 11, a: 'start', c: T.ink }); });
    return o;
  }
  function genCuentasT(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 600, Hh = 330, out = '';
    var OP = [['Compra de mercadería al contado', 'Mercaderías', 'Caja', 1], ['Venta al contado', 'Caja', 'Ventas', 1], ['Pago del alquiler del local', 'Alquileres', 'Caja', 1], ['Aporte del dueño en efectivo', 'Caja', 'Capital', 1], ['Cobro a un cliente', 'Caja', 'Clientes', 1], ['Pago a un proveedor', 'Proveedores', 'Caja', 1]];
    var sel = H.mezcla(r, OP.slice()).slice(0, 3), s0 = m(E(r, 20, 60) * 100, C), imp = sel.map(function () { return m(E(r, 3, 18) * 100, C); }), A = { Caja: { d: ['SI ' + fmt(s0, C)], h: [] } }, ord = ['Caja'];
    sel.forEach(function (o, i) { [[o[1], 'd'], [o[2], 'h']].forEach(function (p) { if (!A[p[0]]) { A[p[0]] = { d: [], h: [] }; ord.push(p[0]); } A[p[0]][p[1]].push('(' + (i + 1) + ') ' + fmt(imp[i], C)); }); });
    ord.slice(0, 6).forEach(function (n, i) { out += cuentaT(20 + (i % 3) * 195, 24 + Math.floor(i / 3) * 120, n, A[n].d, A[n].h, T, F); });
    sel.forEach(function (o, i) { out += tx(20, 272 + i * 18, '(' + (i + 1) + ') ' + o[0] + ': ' + din(imp[i], C), { f: F, s: 11.5, a: 'start', c: T.ink }); });
    var saldo = s0; sel.forEach(function (o, i) { if (o[1] === 'Caja') saldo += imp[i]; else saldo -= imp[i]; });
    var q = H.pick(r, [0, 1, 2]);
    var items = [it('corta', 'Caja empieza con ' + din(s0, C) + ' (SI = saldo inicial). ¿Cuál es su saldo final?', din(saldo, C), { ac: [saldo], x: fmt(s0, C) + sel.map(function (o, i) { return (o[1] === 'Caja' ? ' + ' : ' − ') + fmt(imp[i], C); }).join('') }), mcM(r, 'En la operación (' + (q + 1) + '), ¿qué cuenta se anota en el debe?', [sel[q][1], sel[q][2], 'ninguna'], sel[q][1]),
      it('corta', '¿El saldo de Caja es deudor o acreedor?', saldo >= 0 ? 'deudor' : 'acreedor'), it('abierta', 'Anota en cuentas T esta operación: compras una impresora a crédito por ' + din(m(300, C), C) + '.', 'Mobiliario/Equipos al debe; Acreedores al haber.', { lin: 2 })];
    return { t: 'Cuentas en T', intro: 'Cada operación se anota dos veces: en el debe de una cuenta y en el haber de otra, por el mismo importe (partida doble).', fig: svg(W, Hh, out, 580), items: items };
  }
  function genAmortiza(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 560, Hh = 300, x0 = 60, y0 = 250, out = '';
    var V = m(H.pick(r, [1200, 2400, 3600, 6000, 12000, 18000]), C), n = H.pick(r, [4, 5, 6, 8]), R = bon(V * H.pick(r, [0, .1, .2])), q = (V - R) / n, sx = 440 / n, sy = 200 / V;
    var obj = H.pick(r, ['un ordenador', 'una furgoneta', 'un horno industrial', 'una máquina de coser']);
    out += ln(x0, y0, x0 + 460, y0, T.ink) + ln(x0, y0, x0, 30, T.ink);
    var pts = []; for (var a = 0; a <= n; a++) { var v = V - q * a, x = x0 + a * sx, y = y0 - v * sy; pts.push(r1(x) + ',' + r1(y)); out += rc(x - 10, y, 20, y0 - y, { f: clr(T.acc, .75) }) + tx(x, y0 + 16, 'año ' + a, { f: F, s: 10, c: T.ink }); }
    out += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + T.acc + '" stroke-width="3"/>' + tx(x0 + 4, y0 - V * sy - 8, din(V, C), { f: F, s: 11, a: 'start', w: 700, c: T.ink }) + (R ? tx(x0 + n * sx - 4, y0 - R * sy - 8, 'residual ' + din(R, C), { f: F, s: 11, a: 'end', c: T.ink }) : '');
    var k = E(r, 1, n - 1), vk = r1(V - q * k);
    var items = [it('corta', 'Compras ' + obj + ' por ' + din(V, C) + ', con vida útil de ' + n + ' años y valor residual de ' + din(R, C) + '. ¿Cuál es la cuota anual de amortización?', din(r1(q), C), { ac: [r1(q)], x: '(' + fmt(V, C) + ' − ' + fmt(R, C) + ') ÷ ' + n }), it('corta', '¿Cuál es su valor contable al final del año ' + k + '?', din(vk, C), { ac: [vk], x: fmt(V, C) + ' − ' + k + ' × ' + fmt(r1(q), C) }),
      it('corta', '¿Qué porcentaje del valor amortizable se amortiza cada año?', fmt(r1(100 / n), C) + ' %', { ac: [r1(100 / n)] }), it('abierta', '¿Por qué la amortización es un gasto aunque no salga dinero de la caja cada año?', 'Porque reparte el coste del bien entre los años en que se usa.', { lin: 2 })];
    return { t: 'Amortización lineal', intro: 'El método lineal reparte el coste de un bien, menos su valor residual, en partes iguales durante su vida útil.', fig: svg(W, Hh, out, 540), items: items };
  }
  function genPEPS(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 560, Hh = 300, out = '';
    var q1 = E(r, 4, 12) * 10, q2 = E(r, 4, 12) * 10, c1 = m(E(r, 20, 60) / 10, C), c2 = r1(c1 * H.pick(r, [1.1, 1.2, 1.25])), sale = E(r, Math.round(q1 * .6), q1 + Math.round(q2 * .8));
    var hmax = 200, k = hmax / (q1 + q2), h1 = q1 * k, h2 = q2 * k;
    out += sh(C, 80, 40, 150, h2 + h1, 4) + rc(80, 40, 150, h2, { f: clr(T.acc2, .5), s: T.ink }) + rc(80, 40 + h2, 150, h1, { f: clr(T.acc, .5), s: T.ink });
    out += tx(155, 40 + h2 / 2 + 4, 'Lote 2: ' + q2 + ' u × ' + din(c2, C), { f: F, s: 11.5, w: 700, c: T.ink }) + tx(155, 40 + h2 + h1 / 2 + 4, 'Lote 1: ' + q1 + ' u × ' + din(c1, C), { f: F, s: 11.5, w: 700, c: T.ink });
    var ys = 40 + hmax - sale * k; out += ln(60, ys, 250, ys, '#C0392B', 2, ' stroke-dasharray="6 4"') + tx(260, ys + 4, 'salen ' + sale + ' u (desde abajo)', { f: F, s: 12, a: 'start', w: 700, c: '#C0392B' });
    out += flecha(40, 40 + hmax, 40, ys + 4, '#C0392B') + tx(155, 262, 'lo primero que entra es lo primero que sale', { f: F, s: 11, c: GRIS });
    var cv = sale <= q1 ? sale * c1 : q1 * c1 + (sale - q1) * c2, qd = q1 + q2 - sale, vr = sale <= q1 ? (q1 - sale) * c1 + q2 * c2 : qd * c2;
    cv = r1(cv); vr = r1(vr);
    var items = [it('corta', 'Con el método PEPS (FIFO), ¿cuánto cuestan las ' + sale + ' unidades vendidas?', din(cv, C), { ac: [cv], x: sale <= q1 ? sale + ' × ' + fmt(c1, C) : q1 + ' × ' + fmt(c1, C) + ' + ' + (sale - q1) + ' × ' + fmt(c2, C) }), it('corta', '¿Cuántas unidades quedan en el almacén?', qd), it('corta', '¿Cuál es el valor del inventario final?', din(vr, C), { ac: [vr] }),
      it('abierta', 'Si los precios de compra suben, ¿el método PEPS da un beneficio mayor o menor que el costo promedio? ¿Por qué?', 'Mayor: el costo de venta usa los precios antiguos, más baratos.', { lin: 2 })];
    return { t: 'Inventario PEPS', intro: 'Primero en entrar, primero en salir: las ventas se valoran con el precio de las compras más antiguas.', fig: svg(W, Hh, out, 540), items: items };
  }
  function genPresupuesto(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 580, Hh = 300, x0 = 60, y0 = 240, out = '', ms = ['ene', 'feb', 'mar', 'abr', 'may', 'jun'];
    var P = ms.map(function () { return m(E(r, 20, 40) * 100, C); }), R = P.map(function (p) { return bon(p * (1 + (E(r, -15, 15)) / 100)); }), mx = Math.max.apply(null, P.concat(R));
    out += ln(x0, y0, x0 + 500, y0, T.ink);
    ms.forEach(function (mm, i) { var x = x0 + 12 + i * 82, hp = P[i] / mx * 190, hr = R[i] / mx * 190; out += rc(x, y0 - hp, 28, hp, { f: clr(T.acc, .6) }) + rc(x + 30, y0 - hr, 28, hr, { f: T.acc2 }) + tx(x + 29, y0 + 16, mm, { f: F, s: 11, c: T.ink }); });
    out += rc(x0, 270, 14, 14, { f: clr(T.acc, .6) }) + tx(x0 + 20, 281, 'Presupuesto', { f: F, s: 11.5, a: 'start', c: T.ink }) + rc(x0 + 130, 270, 14, 14, { f: T.acc2 }) + tx(x0 + 150, 281, 'Real', { f: F, s: 11.5, a: 'start', c: T.ink });
    ms.forEach(function (mm, i) { out += tx(x0 + 41 + i * 82, 26, fmt(R[i], C), { f: F, s: 9.5, c: T.ink }) + tx(x0 + 41 + i * 82, 12, fmt(P[i], C), { f: F, s: 9.5, c: GRIS }); });
    var i = E(r, 0, 5), dv = R[i] - P[i], pd = r1(dv / P[i] * 100), tp = P.reduce(function (a, b) { return a + b; }, 0), tr = R.reduce(function (a, b) { return a + b; }, 0);
    var items = [it('corta', '¿Cuál es la desviación de ' + MESES[i] + ' (real − presupuesto) en porcentaje?', fmt(pd, C) + ' %', { ac: [pd], x: '(' + fmt(R[i], C) + ' − ' + fmt(P[i], C) + ') ÷ ' + fmt(P[i], C) + ' × 100' }), it('corta', '¿Cuánto se gastó de más o de menos en el semestre?', din(tr - tp, C), { ac: [tr - tp], x: fmt(tr, C) + ' − ' + fmt(tp, C) }),
      it('corta', '¿En cuántos meses el gasto real superó al presupuesto?', R.filter(function (v, j) { return v > P[j]; }).length), it('abierta', 'Elige el mes con más desviación y propón dos causas posibles.', '', { lin: 2 })];
    return { t: 'Presupuesto frente a gasto real', intro: 'Comparar lo previsto con lo gastado cada mes permite corregir a tiempo. Arriba de cada par: presupuesto (gris) y real.', fig: svg(W, Hh, out, 560), items: items };
  }
  function genIvaCadena(u, C, r) {
    if (C.pk === 'us') return null;
    var T = C.T, F = T.cuerpo, I = impC(C), p = I.p / 100, W = 600, Hh = 280, out = '';
    var b1 = m(E(r, 10, 30) * 10, C), b2 = bon(b1 * H.pick(r, [1.5, 1.8, 2])), b3 = bon(b2 * H.pick(r, [1.4, 1.6, 1.8]));
    var E_ = [['Productor', 0, b1], ['Fabricante', b1, b2], ['Tienda', b2, b3], ['Cliente final', b3, null]];
    E_.forEach(function (e, i) { var x = 20 + i * 148; out += sh(C, x, 40, 120, 150, 8) + rc(x, 40, 120, 150, { rx: 8, f: i === 3 ? clr(T.acc2, .7) : clr(T.acc, .85), s: T.acc }) + tx(x + 60, 62, e[0], { f: F, s: 13, w: 700, c: T.ink });
      if (e[2] != null) { out += tx(x + 60, 90, 'vende a ' + fmt(e[2], C), { f: F, s: 11, c: T.ink }) + tx(x + 60, 108, 'cobra ' + I.n + ' ' + fmt(r1(e[2] * p), C), { f: F, s: 11, c: T.ink }) + tx(x + 60, 126, 'pagó ' + I.n + ' ' + fmt(r1(e[1] * p), C), { f: F, s: 11, c: T.ink }); out += rc(x + 10, 140, 100, 38, { rx: 6, f: '#fff', s: T.acc2 }) + tx(x + 60, 156, 'ingresa', { f: F, s: 10, c: GRIS }) + tx(x + 60, 172, i === 1 ? '¿?' : fmt(r1((e[2] - e[1]) * p), C), { f: F, s: 13, w: 700, c: T.ink }); }
      else out += tx(x + 60, 100, 'paga ' + fmt(r1(b3 * (1 + p)), C), { f: F, s: 12, c: T.ink }) + tx(x + 60, 120, 'soporta todo el ' + I.n, { f: F, s: 11, c: T.ink });
      if (i < 3) out += flecha(x + 122, 115, x + 146, 115, T.ink); });
    out += tx(300, 230, I.n + ' del ' + I.p + ' %. Importes sin impuesto salvo el del cliente final.', { f: F, s: 11.5, c: GRIS });
    var ing2 = r1((b2 - b1) * p);
    var items = [it('corta', '¿Cuánto ingresa el fabricante en Hacienda?', din(ing2, C), { ac: [ing2], x: fmt(r1(b2 * p), C) + ' − ' + fmt(r1(b1 * p), C) }), it('corta', 'Suma lo que ingresan los tres. ¿Coincide con el ' + I.n + ' que paga el cliente final?', din(r1(b3 * p), C), { ac: [r1(b3 * p)], x: I.p + ' % × ' + fmt(b3, C) }),
      mcM(r, '¿Quién soporta de verdad el impuesto?', ['el cliente final', 'el productor', 'la tienda'], 'el cliente final'), it('abierta', 'Explica con tus palabras por qué las empresas restan el ' + I.n + ' que pagaron del que cobran.', '', { lin: 2 })];
    return { t: 'La cadena del ' + I.n, intro: 'En cada paso, la empresa cobra el impuesto a su cliente y descuenta el que pagó a su proveedor. Solo ingresa la diferencia.', fig: svg(W, Hh, out, 580), items: items };
  }

  /* ─────────── Geografía ─────────── */
  var CLIMA = {
    'mediterráneo': [[10, 11, 13, 15, 19, 23, 26, 26, 23, 18, 14, 11], [45, 40, 35, 40, 30, 15, 5, 10, 35, 60, 60, 55]],
    'oceánico': [[8, 8, 10, 11, 14, 16, 18, 18, 17, 14, 11, 9], [120, 100, 95, 85, 75, 55, 45, 50, 70, 110, 125, 130]],
    'tropical húmedo': [[27, 27, 27, 28, 28, 27, 27, 27, 27, 27, 27, 27], [60, 70, 110, 200, 280, 250, 230, 240, 260, 280, 200, 100]],
    'desértico': [[13, 15, 19, 23, 28, 32, 34, 33, 30, 24, 18, 14], [5, 5, 3, 2, 1, 0, 0, 1, 1, 2, 4, 6]],
    'continental': [[-4, -2, 4, 11, 17, 22, 24, 23, 18, 11, 4, -2], [40, 35, 45, 55, 70, 85, 90, 80, 65, 50, 45, 40]]
  };
  function genClimograma(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 580, Hh = 320, x0 = 60, y0 = 270, out = '', tipo = H.pick(r, Object.keys(CLIMA)), D = CLIMA[tipo], t = D[0].slice(), p = D[1].slice(), sur = /^(ar|cl)$/.test(C.pk) && tipo !== 'tropical húmedo';
    if (sur) { t = t.slice(6).concat(t.slice(0, 6)); p = p.slice(6).concat(p.slice(0, 6)); }
    var pm = 300, sy = 220 / pm, st = 220 / 50;
    out += ln(x0, y0, x0 + 456, y0, T.ink) + ln(x0, y0, x0, 44, T.ink) + ln(x0 + 456, y0, x0 + 456, 44, T.ink);
    [0, 100, 200, 300].forEach(function (v) { out += tx(x0 - 6, y0 - v * sy + 4, v, { f: F, s: 10, a: 'end', c: T.acc2 }); }); [-10, 0, 10, 20, 30, 40].forEach(function (v) { out += tx(x0 + 462, y0 - (v + 10) * st + 4, v, { f: F, s: 10, a: 'start', c: T.acc }); });
    out += tx(x0 - 6, 34, 'mm', { f: F, s: 10, a: 'end', w: 700, c: T.acc2 }) + tx(x0 + 462, 34, '°C', { f: F, s: 10, a: 'start', w: 700, c: T.acc });
    var pts = []; MESES.forEach(function (mm, i) { var x = x0 + 6 + i * 37.5; out += rc(x, y0 - p[i] * sy, 26, p[i] * sy, { f: clr(T.acc2, .35) }) + tx(x + 13, y0 + 14, mm.charAt(0).toUpperCase(), { f: F, s: 10, c: T.ink }); pts.push(r1(x + 13) + ',' + r1(y0 - (t[i] + 10) * st)); });
    out += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + T.acc + '" stroke-width="3"/>' + pts.map(function (q) { var a = q.split(','); return ci(+a[0], +a[1], 3.5, T.acc); }).join('');
    var tmax = Math.max.apply(null, t), tmin = Math.min.apply(null, t), tot = p.reduce(function (a, b) { return a + b; }, 0), ml = p.indexOf(Math.max.apply(null, p));
    var items = [it('corta', '¿Cuál es la amplitud térmica anual (máxima − mínima)?', (tmax - tmin) + ' °C', { ac: [tmax - tmin], x: tmax + ' − (' + tmin + ')' }), it('corta', '¿Cuánta lluvia cae en el año?', fmt(tot, C) + ' mm', { ac: [tot] }), it('corta', '¿Cuál es el mes más lluvioso?', MESES[ml]),
      it('abierta', 'Describe el clima: ¿hay estación seca? ¿los inviernos son fríos o suaves?', '', { lin: 2 })];
    return { t: 'Climograma: clima ' + tipo, intro: 'Barras: precipitación mensual (mm). Línea: temperatura media (°C). Valores típicos de este tipo de clima' + (sur ? ', en el hemisferio sur (el verano cae en enero).' : '.'), fig: svg(W, Hh, out, 560), items: items };
  }
  var PIR = { progresiva: [[16, 16], [13, 13], [9, 9], [6, 6], [4, 4], [2, 2]], estancada: [[10, 10], [10, 10], [10, 10], [9, 9], [6, 7], [4, 5]], regresiva: [[7, 7], [8, 8], [10, 10], [11, 11], [9, 10], [4, 5]] };
  function genPiramide(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 560, Hh = 300, cx = 280, out = '', tipo = H.pick(r, Object.keys(PIR)), D = PIR[tipo], G = ['0–14', '15–29', '30–44', '45–59', '60–74', '75+'], sx = 12;
    D.forEach(function (d, i) { var y = 240 - i * 36; out += rc(cx - 24 - d[0] * sx, y, d[0] * sx, 30, { f: clr(T.acc, .35) }) + rc(cx + 24, y, d[1] * sx, 30, { f: clr(T.acc2, .35) }) + tx(cx, y + 20, G[i], { f: F, s: 11, w: 700, c: T.ink }) + tx(cx - 30 - d[0] * sx, y + 20, d[0] + ' %', { f: F, s: 11, a: 'end', c: T.ink }) + tx(cx + 30 + d[1] * sx, y + 20, d[1] + ' %', { f: F, s: 11, a: 'start', c: T.ink }); });
    out += tx(cx - 120, 20, 'Hombres', { f: F, s: 13, w: 700, c: T.acc }) + tx(cx + 120, 20, 'Mujeres', { f: F, s: 13, w: 700, c: T.acc2 });
    var jov = D[0][0] + D[0][1], may = D[4][0] + D[4][1] + D[5][0] + D[5][1], mu75 = D[5][1] - D[5][0];
    var items = [it('corta', '¿Qué porcentaje de la población tiene menos de 15 años?', jov + ' %', { ac: [jov] }), it('corta', '¿Y 60 años o más?', may + ' %', { ac: [may] }), mcM(r, '¿Qué tipo de pirámide es?', ['progresiva', 'estancada', 'regresiva'], tipo),
      it('abierta', mu75 > 0 ? 'Entre los mayores de 75 hay más mujeres. ¿A qué se debe?' : '¿Qué servicios necesitará dentro de 20 años este país?', mu75 > 0 ? 'Las mujeres viven, de media, más años.' : '', { lin: 2 })];
    return { t: 'Pirámide de población ' + tipo, intro: 'Cada barra es el porcentaje de la población total en ese grupo de edad. La forma cuenta la historia de nacimientos y esperanza de vida.', fig: svg(W, Hh, out, 540), items: items };
  }
  function genPerfil(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 560, Hh = 360, cx = 280, cy = 110, out = '', n = E(r, 4, 6), eq = H.pick(r, [50, 100, 200]), base = H.pick(r, [0, 100, 200, 400]), rx = 230, ry = 88;
    for (var i = 0; i < n; i++) { var k = 1 - i / n, h = base + (i + 1) * eq; out += '<ellipse cx="' + (cx + i * 8) + '" cy="' + cy + '" rx="' + r1(rx * k) + '" ry="' + r1(ry * k) + '" fill="' + clr(T.acc2, .85 - i * .12) + '" stroke="' + osc(T.acc2, .3) + '" stroke-width="1"/>' + tx(cx + i * 8 + rx * k - 14, cy - 4, h, { f: F, s: 9.5, c: T.ink }); }
    out += ln(cx - 250, cy, cx + 250, cy, '#C0392B', 1.5, ' stroke-dasharray="6 3"') + tx(cx - 256, cy + 4, 'A', { f: F, s: 13, a: 'end', w: 700, c: '#C0392B' }) + tx(cx + 256, cy + 4, 'B', { f: F, s: 13, a: 'start', w: 700, c: '#C0392B' });
    var y0 = 330, sy = 120 / (n * eq), pts = [[cx - 250, y0 - 0]];
    var cr = []; for (var j = 0; j < n; j++) { var kk = 1 - j / n; cr.push([cx + j * 8 - rx * kk, base + (j + 1) * eq]); } for (var j2 = n - 1; j2 >= 0; j2--) { var k2 = 1 - j2 / n; cr.push([cx + j2 * 8 + rx * k2, base + (j2 + 1) * eq]); }
    var bx = [cx - 250].concat(cr.map(function (c) { return c[0]; })).concat([cx + 250]), bh = [base].concat(cr.map(function (c) { return c[1]; })).concat([base]);
    out += ln(cx - 250, y0, cx + 250, y0, T.ink) + '<polygon points="' + bx.map(function (x, i) { return r1(x) + ',' + r1(y0 - (bh[i] - base) * sy); }).join(' ') + ' ' + (cx + 250) + ',' + y0 + ' ' + (cx - 250) + ',' + y0 + '" fill="' + clr(TIERRA, .4) + '" stroke="' + osc(TIERRA, .3) + '" stroke-width="2"/>';
    out += tx(cx - 256, y0 - 4, base + ' m', { f: F, s: 10, a: 'end', c: T.ink }) + tx(20, 222, 'Perfil A–B', { f: F, s: 12, a: 'start', w: 700, c: T.ink });
    var cima = base + n * eq, d = H.pick(r, [4, 6, 8]), esc2 = H.pick(r, [25000, 50000]);
    var items = [it('corta', '¿Cuál es la equidistancia entre curvas de nivel?', eq + ' m'), it('corta', '¿A qué altura está, como mínimo, la cima?', cima + ' m', { ac: [cima] }), it('corta', 'En un mapa 1:' + fmt(esc2, C) + ', A y B están a ' + d + ' cm. ¿Cuántos kilómetros hay en la realidad?', fmt(d * esc2 / 100000, C) + ' km', { ac: [d * esc2 / 100000], x: d + ' × ' + fmt(esc2, C) + ' cm = ' + fmt(d * esc2 / 100, C) + ' m' }),
      mcM(r, 'Donde las curvas están más juntas, la pendiente es…', ['más fuerte', 'más suave', 'igual'], 'más fuerte')];
    return { t: 'Curvas de nivel y perfil topográfico', intro: 'Cada curva une puntos de la misma altura. Al cortar el mapa por la línea A–B se obtiene el perfil del relieve.', fig: svg(W, Hh, out, 540), items: items };
  }
  var HUSOS = [['es', 'España (Madrid)', 1], ['us', 'EE. UU. (Nueva York)', -5], ['mx', 'México (Ciudad de México)', -6], ['co', 'Colombia', -5], ['ve', 'Venezuela', -4], ['do', 'República Dominicana', -4], ['cl', 'Chile (continental)', -4], ['ar', 'Argentina', -3]];
  function genHusos(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 600, Hh = 300, x0 = 40, sx = 520 / 9, out = '';
    for (var h = -7; h <= 2; h++) { var x = x0 + (h + 7) * sx; out += rc(x, 30, sx, 200, { f: (h % 2 ? clr(T.acc, .9) : '#fff') }) + tx(x + sx / 2, 22, 'UTC' + (h > 0 ? '+' + h : h === 0 ? '' : h), { f: F, s: 10.5, w: 700, c: T.ink }); }
    HUSOS.forEach(function (p, i) { var x = x0 + (p[2] + 7.5) * sx, y = 50 + i * 23, yo = p[0] === C.pk; out += ci(x, y, 6, yo ? T.acc2 : T.acc) + tx(x + (p[2] > -1 ? -10 : 10), y + 4, p[1], { f: F, s: 11, a: p[2] > -1 ? 'end' : 'start', w: yo ? 700 : 400, c: T.ink }); });
    out += tx(300, 258, 'Hora estándar de cada país, sin horario de verano.', { f: F, s: 11, c: GRIS });
    var yo = HUSOS.filter(function (p) { return p[0] === C.pk; })[0] || HUSOS[0], otros = H.mezcla(r, HUSOS.filter(function (p) { return p !== yo; })).slice(0, 2), hora = E(r, 8, 18);
    var hh = function (o) { var v = ((hora + o[2] - yo[2]) % 24 + 24) % 24; return v + ':00'; };
    var items = otros.map(function (o) { return it('corta', 'Si en ' + yo[1] + ' son las ' + hora + ':00, ¿qué hora es en ' + o[1] + '?', hh(o), { x: hora + ' ' + (o[2] - yo[2] >= 0 ? '+ ' : '− ') + Math.abs(o[2] - yo[2]) + ' h' }); });
    items.push(it('corta', '¿Cuántas horas de diferencia hay entre España y México?', 7), it('abierta', 'Tienes una videollamada con alguien de otro país. Propón una hora que sea razonable para los dos.', '', { lin: 2 }));
    return { t: 'Husos horarios', intro: 'La Tierra gira 15° cada hora, así que cada huso horario ocupa unos 15° de longitud. Hacia el este la hora aumenta.', fig: svg(W, Hh, out, 580), items: items };
  }
  var RUMBOS = ['norte', 'noreste', 'este', 'sureste', 'sur', 'suroeste', 'oeste', 'noroeste'];
  function genRosa(u, C, r) {
    var MD = window.EU_MAPAS_DATOS && EU_MAPAS_DATOS[C.pk]; if (!MD) return null;
    var T = C.T, F = T.cuerpo, k = Math.min(380 / MD.w, 300 / MD.h), W = 600, Hh = 320, ox = 10, oy = 10, out = '';
    out += '<g transform="translate(' + ox + ' ' + oy + ') scale(' + r1(k) + ')"><path d="' + MD.d + '" fill="' + clr(T.acc, .85) + '" stroke="' + osc(T.acc, .2) + '" stroke-width="' + r1(1.2 / k) + '"/></g>';
    var cap = MD.c.filter(function (c) { return c[3]; })[0] || MD.c[0], cx = ox + cap[1] * k, cy = oy + cap[2] * k;
    MD.c.forEach(function (c) { var x = ox + c[1] * k, y = oy + c[2] * k; out += (c[3] ? '<path d="M' + r1(x) + ' ' + r1(y - 8) + ' l2.4 5.6 6 .4 -4.6 4 1.4 5.8 -5.2 -3.2 -5.2 3.2 1.4 -5.8 -4.6 -4 6 -.4z" fill="' + T.ink + '"/>' : ci(x, y, 4.5, '#fff', T.ink, 2)) + tx(x + 8, y - 6, c[0], { f: F, s: 11, a: 'start', w: c[3] ? 700 : 400, c: T.ink }); });
    var rx = 510, ry = 150;
    for (var i = 0; i < 8; i++) { var a = -Math.PI / 2 + i * Math.PI / 4, L = i % 2 ? 36 : 62; out += pa('M' + rx + ' ' + ry + ' L' + r1(rx + L * Math.cos(a) + 7 * Math.cos(a + Math.PI / 2)) + ' ' + r1(ry + L * Math.sin(a) + 7 * Math.sin(a + Math.PI / 2)) + ' L' + r1(rx + L * Math.cos(a)) + ' ' + r1(ry + L * Math.sin(a)) + ' Z', i % 2 ? clr(T.acc, .4) : T.acc) + pa('M' + rx + ' ' + ry + ' L' + r1(rx + L * Math.cos(a) - 7 * Math.cos(a + Math.PI / 2)) + ' ' + r1(ry + L * Math.sin(a) - 7 * Math.sin(a + Math.PI / 2)) + ' L' + r1(rx + L * Math.cos(a)) + ' ' + r1(ry + L * Math.sin(a)) + ' Z', i % 2 ? '#fff' : osc(T.acc, .3), clr(T.acc, .4), .8); if (i % 2 === 0) out += tx(rx + 76 * Math.cos(a), ry + 76 * Math.sin(a) + 5, 'NESO'.charAt(i / 2), { f: F, s: 14, w: 700, c: T.ink }); }
    var rumbo = function (c) { var dx = ox + c[1] * k - cx, dy = cy - (oy + c[2] * k), g = Math.atan2(dx, dy) * 180 / Math.PI; return RUMBOS[((Math.round(g / 45) % 8) + 8) % 8]; };
    var cs = H.mezcla(r, MD.c.filter(function (c) { return !c[3]; })).slice(0, 3);
    var items = cs.map(function (c) { return it('corta', '¿En qué dirección está ' + c[0] + ' desde ' + cap[0] + '?', 'al ' + rumbo(c)); });
    items.push(mcM(r, 'Si caminas hacia el sur y giras a tu izquierda, vas hacia el…', ['este', 'oeste', 'norte'], 'este'));
    return { t: 'Orientarse en el mapa de ' + C.P.n, intro: 'Los puntos cardinales se leen con la rosa de los vientos. En este mapa el norte está arriba. La estrella marca la capital.', fig: svg(W, Hh, out, 580), items: items };
  }

  /* ─────────── Lengua, Inglés, Valores ─────────── */
  var PALS = [['can', 'ción', 1], ['ár', 'bol', 0], ['mú', 'si', 'ca', 0], ['ca', 'mión', 1], ['lá', 'piz', 0], ['ca', 'fé', 1], ['me', 'sa', 0], ['re', 'loj', 1], ['pá', 'ja', 'ro', 0], ['e', 'xa', 'men', 1], ['te', 'lé', 'fo', 'no', 1], ['ra', 'tón', 1], ['cár', 'cel', 0], ['pa', 'red', 1], ['sá', 'ba', 'do', 0], ['ven', 'ta', 'na', 1], ['a', 'zú', 'car', 1], ['jar', 'dín', 1], ['ma', 'pa', 0], ['re', 'la', 'ám', 'pa', 'go', 2]];
  function genTilde(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 580, Hh = 300, out = '', sel = H.mezcla(r, PALS.slice()).slice(0, 5), cls = ['aguda', 'llana', 'esdrújula', 'sobresdrújula'];
    var info = sel.map(function (w) { var s = w.slice(0, -1), ti = w[w.length - 1], desdeFin = s.length - 1 - ti; return { s: s, ti: ti, c: cls[desdeFin], til: /[áéíóú]/.test(s.join('')) }; });
    info.forEach(function (p, i) { var y = 30 + i * 52, bw = 64; p.s.forEach(function (sy, j) { var x = 40 + j * (bw + 6); out += sh(C, x, y, bw, 36, 6) + rc(x, y, bw, 36, { rx: 6, f: j === p.ti ? T.acc : '#fff', s: T.acc, sw: 1.5 }) + tx(x + bw / 2, y + 24, sy, { f: F, s: 17, w: 700, c: j === p.ti ? '#fff' : T.ink }); }); out += rc(360, y + 4, 180, 28, { rx: 4, f: 'none', s: T.ink, sw: 1, d: '4 3' }); });
    out += tx(40, 290, 'La sílaba coloreada es la tónica (la que suena más fuerte).', { f: F, s: 11.5, a: 'start', c: GRIS });
    var items = info.slice(0, 3).map(function (p) { return it('corta', '«' + p.s.join('') + '»: ¿aguda, llana o esdrújula?', p.c); });
    var p4 = info[3]; items.push(it('abierta', '¿Por qué «' + p4.s.join('') + '» ' + (p4.til ? 'lleva' : 'no lleva') + ' tilde?', p4.c === 'aguda' ? (p4.til ? 'Es aguda y termina en vocal, n o s.' : 'Es aguda y no termina en vocal, n o s.') : p4.c === 'llana' ? (p4.til ? 'Es llana y no termina en vocal, n o s.' : 'Es llana y termina en vocal, n o s.') : 'Las esdrújulas llevan tilde siempre.', { lin: 2 }), it('abierta', 'Escribe en los recuadros la clase de cada palabra.', info.map(function (p) { return p.s.join('') + ': ' + p.c; }).join('; '), { lin: 0 }));
    return { t: 'La sílaba tónica', intro: 'Contamos las sílabas desde el final: si la tónica es la última, la palabra es aguda; la penúltima, llana; la antepenúltima, esdrújula.', fig: svg(W, Hh, out, 560), items: items };
  }
  var NUM_EN = ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  function horaEn(h, mi) { var h12 = h % 12, s = h12 === 0 ? 12 : h12, nx = (h + 1) % 12 || 12; if (mi === 0) return NUM_EN[s] + " o'clock"; if (mi === 15) return 'quarter past ' + NUM_EN[s]; if (mi === 30) return 'half past ' + NUM_EN[s]; return 'quarter to ' + NUM_EN[nx]; }
  function genRutina(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 600, Hh = 260, x0 = 30, sx = 540 / 17, out = '', nom = H.pick(r, (C.P && C.P.nombres) || ['Ana']);
    var A = [['wakes up', 6, 7], ['has breakfast', 7, 8], ['goes to school', 8, 8], ['has lunch', 13, 14], ['does homework', 16, 17], ['has dinner', 20, 21], ['goes to bed', 21, 22]].map(function (a) { return [a[0], E(r, a[1], a[2]), H.pick(r, [0, 15, 30, 45])]; });
    for (var i = 1; i < A.length; i++) if (A[i][1] * 60 + A[i][2] <= A[i - 1][1] * 60 + A[i - 1][2]) { A[i][1] = A[i - 1][1]; A[i][2] = A[i - 1][2] + 30; if (A[i][2] >= 60) { A[i][1]++; A[i][2] -= 60; } if (A[i][2] % 15) A[i][2] = 30; }
    out += ln(x0, 130, x0 + 540, 130, T.ink, 3); for (var h = 6; h <= 23; h++) out += ln(x0 + (h - 6) * sx, 124, x0 + (h - 6) * sx, 136, T.ink, 1.5) + (h % 2 === 0 ? tx(x0 + (h - 6) * sx, 152, h + ':00', { f: F, s: 10, c: T.ink }) : '');
    A.forEach(function (a, i) { var x = x0 + (a[1] - 6 + a[2] / 60) * sx, up = i % 2 === 0, y = up ? 60 : 196; out += ln(x, 130, x, up ? 78 : 180, T.acc, 1.5) + ci(x, 130, 6, T.acc2) + rc(x - 50, y - 16, 100, 34, { rx: 8, f: clr(T.acc, .85), s: T.acc }) + tx(x, y - 1, a[0], { f: F, s: 11, w: 700, c: T.ink }) + tx(x, y + 13, a[1] + ':' + (a[2] < 10 ? '0' : '') + a[2], { f: F, s: 10.5, c: T.ink }); });
    var q = H.mezcla(r, [1, 3, 5]).slice(0, 2), d = (A[3][1] * 60 + A[3][2]) - (A[1][1] * 60 + A[1][2]);
    var items = q.map(function (i) { var v = A[i][0].replace(/^(\w+)s\b/, '$1').replace('has', 'have').replace('does', 'do').replace('goes', 'go'); return it('corta', 'What time does ' + nom + ' ' + v + '?', 'At ' + horaEn(A[i][1], A[i][2]) + '.'); });
    items.push(it('corta', 'How long is it between breakfast and lunch? (in minutes)', d, { x: d + ' minutes' }), it('abierta', 'Write your own routine with five sentences. Use «always», «usually» or «never».', '', { lin: 3 }));
    return { t: nom + '’s day', intro: 'Present simple for routines: with he and she the verb takes -s (wakes up, has, goes, does).', fig: svg(W, Hh, out, 580), items: items };
  }
  var EMO = [['alegría', 'M-14 8 Q0 20 14 8', 0, 0], ['tristeza', 'M-14 14 Q0 2 14 14', 1, 0], ['enfado', 'M-12 12 H12', 2, 0], ['miedo', 'M-10 12 Q-5 6 0 12 Q5 18 10 12', 3, 1], ['sorpresa', null, 4, 1], ['calma', 'M-10 10 Q0 14 10 10', 5, 0]];
  function genEmociones(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 600, Hh = 260, out = '', sel = H.mezcla(r, EMO.slice());
    var SIT = { 'alegría': 'Te dan la noticia de que tu equipo ha ganado.', 'tristeza': 'Tu mejor amigo se va a vivir a otra ciudad.', 'enfado': 'Alguien rompe tu dibujo a propósito.', 'miedo': 'Oyes un ruido fuerte en la oscuridad.', 'sorpresa': 'Al llegar a casa hay una fiesta preparada para ti.', 'calma': 'Descansas tumbado en la hierba un domingo.' };
    sel.forEach(function (e, i) { var x = 60 + i * 96, y = 90, c = SV.paleta(C)[i]; out += (es3d(C) ? ci(x + 3, y + 4, 38, '#000').replace('/>', ' opacity=".12"/>') : '') + ci(x, y, 38, '#FFD66B', '#D9A400', 2);
      var ey = e[0] === 'sorpresa' || e[0] === 'miedo' ? 5 : 3.5; out += ci(x - 13, y - 8, ey, '#222') + ci(x + 13, y - 8, ey, '#222');
      if (e[0] === 'enfado') out += ln(x - 22, y - 22, x - 6, y - 16, '#222', 3) + ln(x + 22, y - 22, x + 6, y - 16, '#222', 3); if (e[0] === 'tristeza') out += ln(x - 22, y - 16, x - 6, y - 22, '#222', 2.5) + ln(x + 22, y - 16, x + 6, y - 22, '#222', 2.5);
      if (e[0] === 'calma') out = out.replace(ci(x - 13, y - 8, ey, '#222') + ci(x + 13, y - 8, ey, '#222'), pa('M' + (x - 19) + ' ' + (y - 8) + ' q6 5 12 0 M' + (x + 7) + ' ' + (y - 8) + ' q6 5 12 0', 'none', '#222', 2.5));
      out += e[1] ? '<path d="' + e[1].replace(/(-?\d+) (-?\d+)/g, function (m0, a, b) { return (x + +a) + ' ' + (y + +b); }).replace(/H(-?\d+)/, function (m0, a) { return 'H' + (x + +a); }) + '" fill="none" stroke="#222" stroke-width="3" stroke-linecap="round"/>' : '<ellipse cx="' + x + '" cy="' + (y + 16) + '" rx="7" ry="9" fill="#222"/>';
      out += mk(i + 1, x, y + 62, T, F); });
    var pk = H.mezcla(r, sel.map(function (_, i) { return i; })).slice(0, 3);
    var items = pk.map(function (i) { return it('corta', SIT[sel[i][0]] + ' ¿Qué cara (número) muestra lo que sentirías?', (i + 1) + ' (' + sel[i][0] + ')', { ac: [i + 1] }); });
    items.push(it('corta', 'Escribe el nombre de la emoción de la cara ' + (pk[0] + 1 === 1 ? 2 : 1) + '.', sel[pk[0] + 1 === 1 ? 1 : 0][0]), it('abierta', '¿Qué haces tú para calmarte cuando sientes enfado?', '', { lin: 2 }));
    return { t: 'Las emociones', intro: 'Reconocer lo que sentimos, y lo que sienten los demás, es el primer paso para convivir bien.', fig: svg(W, Hh, out, 580), items: items };
  }

  var V = [
    ['esc_casa', genCasa, /^(idiomas|infantil|ingles)$/, 2], ['esc_ciudad', genCiudad, /^(idiomas|infantil|ingles|soci)$/, 2], ['esc_cuerpo', genCuerpo, /^(idiomas|infantil|ingles|natu)$/, 2],
    ['esc_ropa', genRopa, /^(idiomas|infantil|ingles)$/, 2], ['esc_formas', genFormas, /^(idiomas|infantil|ingles)$/, 2], ['esc_familia', genFamilia, /^(idiomas|infantil|ingles|valores)$/, 2],
    ['rs_calendario', genCalendario, /^(redes|mkt|empre)$/, 2], ['rs_anatomia', genAnatomia, /^(redes|mkt)$/, 2], ['rs_formatos', genFormatos, /^(redes|mkt)$/, 2],
    ['ec_ficha', genFicha, /^(ecom|mkt|empre)$/, 2], ['ec_zonas', genZonas, /^(ecom|empre|geografia)$/, 2], ['ec_devolucion', genDevolucion, /^(ecom|empre)$/, 2],
    ['rel_fiestas', genFiestas, /^(religion|soci|valores)$/, 2], ['rel_templos', genTemplos, /^(religion|arte)$/, 2],
    ['mus_familias', genFamilias, /^(musica|fisica)$/, 2], ['mus_orquesta', genOrquesta, /^musica$/, 2],
    ['con_cuentast', genCuentasT, /^(conta|empre)$/, 2], ['con_amortiza', genAmortiza, /^(conta|empre|ecom)$/, 2], ['con_peps', genPEPS, /^(conta|ecom)$/, 2], ['con_presupuesto', genPresupuesto, /^(conta|empre|mkt)$/, 2], ['con_ivacadena', genIvaCadena, /^(conta|empre|ecom|soci)$/, 2],
    ['geo_clima', genClimograma, /^(geografia|natu|soci)$/, 2], ['geo_piramide', genPiramide, /^(geografia|soci|mate)$/, 2], ['geo_perfil', genPerfil, /^(geografia|natu|efisica)$/, 2], ['geo_husos', genHusos, /^(geografia|soci|ingles)$/, 2], ['geo_rosa', genRosa, /^(geografia|soci|efisica)$/, 2],
    ['len_tonica', genTilde, /^lengua$/, 3], ['ing_rutina', genRutina, /^(ingles|idiomas)$/, 2], ['val_emociones', genEmociones, /^(valores|infantil|religion)$/, 2]
  ];
  V.forEach(function (v) { var g = v[1]; v[1] = function (u, C, r) { try { return g(u, C, r); } catch (e) { if (window.console) console.warn('[EU_DIBUJOS3] ' + v[0] + ':', e && e.message); return null; } }; SV.visual(v[0], v[1], { materias: v[2], max: v[3] }); });
  window.EU_DIBUJOS3 = { V: V.map(function (v) { return v[0]; }), GEN: V.reduce(function (o, v) { o[v[0]] = v[1]; return o; }, {}), dic: dic, lenguas: lenguas };
})();
