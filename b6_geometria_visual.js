/* b6_geometria_visual.js — dibujos de concepto para Geometría y Álgebra y Cálculo.
   · Una figura propia por unidad (40): transportador, polígonos, áreas, palillos, fichas
     algebraicas, balanza, Pitágoras con cuadrados, Tales con sombras, cuerpos 2D/3D, modelo
     de área, rectas, pendiente, circunferencia goniométrica, parábola, (a + b)², distancia,
     vectores, recta numérica, determinante como área, Gauss, cónicas, plano complejo,
     espacio 3D, progresiones; funciones, TVM, extremos, límite, derivada, cadena, tangente,
     optimización, primitivas, Riemann, área entre curvas, asíntotas, exponencial, series,
     Taylor y curvas de nivel. Cada figura trae sus fórmulas clave.
   · Dónde aparecen: «Aprende» (sustituye el esquema genérico), la apertura de unidad
     (en lugar del hueco de ilustración si no hay imagen), «Cerca de ti» (figura al margen)
     y dos páginas visuales nuevas: «Mira y resuelve» y «Paso a paso».
   · Arregla «en clase de Geometría y Álgebra» → minúsculas en «Cerca de ti».
   Cargar después de b6_mates_plus.js. */
(function () {
  'use strict';
  var ED = window.EU_EDITORIAL, SV = window.EU_SVG, MP = window.EU_MATES_PLUS;
  if (!ED || !SV || !MP || window.EU_GEO_VISUAL) return;
  var H = ED.H, esc = H.esc, E = H.ent, NS = 'xmlns="http://www.w3.org/2000/svg"';
  var clr = SV.clr || function (c) { return c; }, osc = SV.osc || function (c) { return c; };
  function R(n) { return Math.round(n * 10) / 10; }
  function nf(n) { return String(Math.round(n * 100) / 100).replace('.', ',').replace('-', '−'); }
  function es3d(C) { return C.prem ? C.prem.dibujo === '3d' : (((C.cfg && C.cfg.acab) || {}).dibujo || '3d') === '3d'; }
  function K(C) { var T = C.T; return { a: T.acc, b: T.acc2, s: T.soft, s2: T.soft2, i: T.ink, f: T.cuerpo, d3: es3d(C) }; }

  /* ─────────── primitivas ─────────── */
  function L(x1, y1, x2, y2, c, w, x) { return '<line x1="' + R(x1) + '" y1="' + R(y1) + '" x2="' + R(x2) + '" y2="' + R(y2) + '" stroke="' + c + '" stroke-width="' + (w || 2) + '" stroke-linecap="round"' + (x || '') + '/>'; }
  function DL(x1, y1, x2, y2, c, w) { return L(x1, y1, x2, y2, c, w || 1.4, ' stroke-dasharray="6 5"'); }
  function PG(pts, f, s, w, x) { return '<polygon points="' + pts.map(function (p) { return R(p[0]) + ',' + R(p[1]); }).join(' ') + '" fill="' + f + '" stroke="' + (s || 'none') + '" stroke-width="' + (w || 2) + '" stroke-linejoin="round"' + (x || '') + '/>'; }
  function PA(d, f, s, w, x) { return '<path d="' + d + '" fill="' + (f || 'none') + '" stroke="' + (s || 'none') + '" stroke-width="' + (w || 2) + '" stroke-linecap="round" stroke-linejoin="round"' + (x || '') + '/>'; }
  function CI(x, y, r, f, s, w, x2) { return '<circle cx="' + R(x) + '" cy="' + R(y) + '" r="' + R(r) + '" fill="' + f + '" stroke="' + (s || 'none') + '" stroke-width="' + (w || 2) + '"' + (x2 || '') + '/>'; }
  function EL(x, y, rx, ry, f, s, w, x2) { return '<ellipse cx="' + R(x) + '" cy="' + R(y) + '" rx="' + R(rx) + '" ry="' + R(ry) + '" fill="' + f + '" stroke="' + (s || 'none') + '" stroke-width="' + (w || 2) + '"' + (x2 || '') + '/>'; }
  function RE(x, y, w, h, f, s, sw, rx) { return '<rect x="' + R(x) + '" y="' + R(y) + '" width="' + R(w) + '" height="' + R(h) + '" rx="' + (rx || 0) + '" fill="' + f + '" stroke="' + (s || 'none') + '" stroke-width="' + (sw || 2) + '"/>'; }
  function TX(k, x, y, t, o) { o = o || {}; return '<text x="' + R(x) + '" y="' + R(y) + '" font-family="' + esc(k.f) + '" font-size="' + (o.s || 17) + '" fill="' + (o.c || k.i) + '" font-weight="' + (o.w || 400) + '" text-anchor="' + (o.a || 'middle') + '"' + (o.it ? ' font-style="italic"' : '') + '>' + esc(t) + '</text>'; }
  function FL(x1, y1, x2, y2, c, w) { var a = Math.atan2(y2 - y1, x2 - x1), h = 11 + (w || 2.5); return L(x1, y1, x2 - Math.cos(a) * h * .6, y2 - Math.sin(a) * h * .6, c, w || 2.5) + PG([[x2, y2], [x2 - Math.cos(a - .38) * h, y2 - Math.sin(a - .38) * h], [x2 - Math.cos(a + .38) * h, y2 - Math.sin(a + .38) * h]], c); }
  function PT(cx, cy, r, g) { var a = g * Math.PI / 180; return [cx + Math.cos(a) * r, cy - Math.sin(a) * r]; }
  function ARC(cx, cy, r, g1, g2, c, f) { var p = PT(cx, cy, r, g1), q = PT(cx, cy, r, g2), big = Math.abs(g2 - g1) > 180 ? 1 : 0; return f ? PA('M' + R(cx) + ',' + R(cy) + ' L' + R(p[0]) + ',' + R(p[1]) + ' A' + r + ',' + r + ' 0 ' + big + ' 0 ' + R(q[0]) + ',' + R(q[1]) + ' Z', f, 'none', 0, ' opacity=".35"') + PA('M' + R(p[0]) + ',' + R(p[1]) + ' A' + r + ',' + r + ' 0 ' + big + ' 0 ' + R(q[0]) + ',' + R(q[1]), 'none', c, 2) : PA('M' + R(p[0]) + ',' + R(p[1]) + ' A' + r + ',' + r + ' 0 ' + big + ' 0 ' + R(q[0]) + ',' + R(q[1]), 'none', c, 2); }
  function REC(x, y, dx, dy, c) { return PA('M' + (x + dx * 14) + ',' + y + ' L' + (x + dx * 14) + ',' + (y + dy * 14) + ' L' + x + ',' + (y + dy * 14), 'none', c, 1.5); }
  /* ejes: o = { ox, oy, sx, sy, x0, x1, y0, y1, nx, ny (nombres), paso } */
  function EJES(k, o) {
    var g = '', sx = o.sx, sy = o.sy || o.sx, X = function (x) { return o.ox + x * sx; }, Y = function (y) { return o.oy - y * sy; }, p = o.paso || 1, i;
    for (i = Math.ceil(o.x0); i <= o.x1; i += p) g += L(X(i), Y(o.y0), X(i), Y(o.y1), k.s, .8);
    for (i = Math.ceil(o.y0); i <= o.y1; i += p) g += L(X(o.x0), Y(i), X(o.x1), Y(i), k.s, .8);
    g += FL(X(o.x0), Y(0), X(o.x1) + 8, Y(0), k.i, 1.6) + FL(X(0), Y(o.y0), X(0), Y(o.y1) - 8, k.i, 1.6);
    g += TX(k, X(o.x1) + 4, Y(0) + 22, o.nx || 'x', { s: 15, it: true }) + TX(k, X(0) - 14, Y(o.y1) - 4, o.ny || 'y', { s: 15, it: true });
    if (o.num !== false) {
      var st = o.num || (sx < 22 ? 2 : 1);
      for (i = Math.ceil(o.x0 / st) * st; i < o.x1; i += st) if (i) g += L(X(i), Y(0) - 4, X(i), Y(0) + 4, k.i, 1.2) + TX(k, X(i), Y(0) + 18, nf(i), { s: 12 });
      var sty = o.numy || (sy < 22 ? 2 : 1);
      for (i = Math.ceil(o.y0 / sty) * sty; i < o.y1; i += sty) if (i) g += L(X(0) - 4, Y(i), X(0) + 4, Y(i), k.i, 1.2) + TX(k, X(0) - 8, Y(i) + 4, nf(i), { s: 12, a: 'end' });
    }
    return { g: g, X: X, Y: Y, o: o };
  }
  function PLOT(E0, fn, a, b, c, w, x) {
    var o = E0.o, d = '', on = false, n = 120;
    for (var i = 0; i <= n; i++) {
      var t = a + (b - a) * i / n, y = fn(t);
      if (!isFinite(y) || y < o.y0 - .5 || y > o.y1 + .5) { on = false; continue; }
      d += (on ? ' L' : 'M') + R(E0.X(t)) + ',' + R(E0.Y(y)); on = true;
    }
    return PA(d, 'none', c, w || 3, x);
  }
  function DOT(x, y, c, r) { return CI(x, y, r || 5.5, c, '#fff', 2); }
  function svg(body, st) { return '<svg ' + NS + ' data-plano="1" viewBox="0 0 600 340" style="' + (st || 'width:100%;max-width:150mm') + ';height:auto;display:block;margin:0 auto">' + body + '</svg>'; }
  function sombra(k, c, n) { return k.d3 ? osc(c, n || .22) : c; }

  /* ─────────── figuras por unidad ─────────── */
  var FIG = {
    ga1_angulos: function (k, r) {
      var cx = 300, cy = 285, Rr = 210, a = H.pick(r, [35, 50, 65, 120, 140]), g = '', i;
      g += PA('M' + (cx - Rr) + ',' + cy + ' A' + Rr + ',' + Rr + ' 0 0 1 ' + (cx + Rr) + ',' + cy + ' Z', k.s2, k.i, 2);
      for (i = 0; i <= 180; i += 10) { var p = PT(cx, cy, Rr, i), q = PT(cx, cy, Rr - (i % 30 ? 10 : 20), i); g += L(p[0], p[1], q[0], q[1], k.i, 1.3); if (i % 30 === 0) { var t = PT(cx, cy, Rr - 36, i); g += TX(k, t[0], t[1] + 5, i + '°', { s: 13 }); } }
      var p1 = PT(cx, cy, Rr + 24, 0), p2 = PT(cx, cy, Rr + 24, a), m = PT(cx, cy, 92, a / 2);
      g += ARC(cx, cy, 64, 0, a, k.a, k.a) + L(cx, cy, p1[0], p1[1], k.a, 4) + L(cx, cy, p2[0], p2[1], k.a, 4) + DOT(cx, cy, k.b, 7) + TX(k, m[0], m[1] + 6, a + '°', { s: 22, w: 700, c: k.a }) + TX(k, cx, cy + 26, 'vértice', { s: 14 });
      return { t: 'El transportador', cap: ['recto = 90°', 'llano = 180°', 'complementarios suman 90°', 'suplementarios suman 180°'], g: g };
    },
    ga1_poligonos: function (k) {
      var g = '', N = ['triángulo', 'cuadrado', 'pentágono', 'hexágono', 'heptágono', 'octógono'];
      for (var n = 3; n <= 8; n++) {
        var cx = 55 + (n - 3) * 98, cy = 140, rr = 40, pts = [];
        for (var j = 0; j < n; j++) pts.push(PT(cx, cy, rr, 90 + j * 360 / n + (n % 2 ? 0 : 180 / n)));
        g += PG(pts, n % 2 ? k.s2 : clr(k.a, .7), k.a, 2.5);
        pts.forEach(function (p, j) { var q = pts[(j + 1) % n], mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, dx = q[1] - p[1], dy = p[0] - q[0], d = Math.hypot(dx, dy); g += L(mx - dx / d * 5, my - dy / d * 5, mx + dx / d * 5, my + dy / d * 5, k.i, 1.5); });
        g += TX(k, cx, 215, N[n - 3], { s: 14, w: 700 }) + TX(k, cx, 236, n + ' lados', { s: 13 });
      }
      g += TX(k, 300, 300, 'Perímetro de un polígono regular = n × lado', { s: 18, c: k.a, w: 700 });
      return { t: 'Polígonos regulares', cap: ['P = suma de los lados', 'regular: P = n · l'], g: g };
    },
    ga1_area: function (k, r) {
      var b = E(r, 4, 7), h = E(r, 2, 4), u = 25, g = '', i, x0 = 30, y0 = 200 - h * u;
      g += RE(x0, y0, b * u, h * u, k.s2, k.a, 2.5);
      for (i = 1; i < b; i++) g += L(x0 + i * u, y0, x0 + i * u, 200, k.a, .8);
      for (i = 1; i < h; i++) g += L(x0, y0 + i * u, x0 + b * u, y0 + i * u, k.a, .8);
      g += TX(k, x0 + b * u / 2, 222, 'b = ' + b, { s: 15 }) + TX(k, x0 - 6, y0 + h * u / 2 + 5, 'h = ' + h, { s: 15, a: 'end' }) + TX(k, x0 + b * u / 2, 262, 'A = b · h = ' + (b * h) + ' u²', { s: 16, w: 700, c: k.a });
      g += PG([[235, 200], [385, 200], [300, 80]], clr(k.b, .6), k.b, 2.5) + DL(300, 80, 300, 200, k.i) + REC(300, 200, 1, -1, k.i) + TX(k, 310, 150, 'h', { s: 16, it: true, a: 'start' }) + TX(k, 310, 222, 'b', { s: 16, it: true }) + TX(k, 310, 262, 'A = b · h ÷ 2', { s: 16, w: 700, c: k.b });
      g += CI(500, 145, 58, k.s2, k.a, 2.5) + L(500, 145, 558, 145, k.a, 2) + DOT(500, 145, k.a, 4) + TX(k, 529, 137, 'r', { s: 16, it: true }) + TX(k, 500, 262, 'A = π · r²', { s: 16, w: 700, c: k.a });
      g += TX(k, 300, 312, 'El área se mide en unidades cuadradas: cm², m², km²…', { s: 14 });
      return { t: 'Áreas de figuras planas', cap: ['rectángulo: b · h', 'triángulo: b · h ÷ 2', 'círculo: π · r²'], g: g };
    },
    ga1_patrones: function (k) {
      var g = '', X0 = [30, 130, 255, 400];
      [1, 2, 3, 4].forEach(function (n, gi) {
        var x0 = X0[gi], y0 = 170, v = [], j;
        for (j = 0; j <= n + 1; j++) v.push(j % 2 ? [x0 + 20 + (j - 1) / 2 * 40, y0 - 36] : [x0 + j / 2 * 40, y0]);
        var c = n === 4 ? k.s : k.a, x = n === 4 ? ' stroke-dasharray="6 5"' : '';
        for (j = 0; j < v.length - 1; j++) g += L(v[j][0], v[j][1], v[j + 1][0], v[j + 1][1], c, 4, x);
        for (j = 0; j + 2 < v.length; j++) g += L(v[j][0], v[j][1], v[j + 2][0], v[j + 2][1], c, 4, x);
        g += TX(k, x0 + (n + 1) * 10, 215, 'figura ' + n, { s: 14, w: 700 }) + TX(k, x0 + (n + 1) * 10, 238, n === 4 ? '¿ palillos ?' : (2 * n + 1) + ' palillos', { s: 14, c: n === 4 ? k.b : k.i });
      });
      g += TX(k, 300, 290, 'Cada figura añade 2 palillos → palillos = 2n + 1', { s: 18, w: 700, c: k.a });
      return { t: 'Un patrón con palillos', cap: ['aₙ = a₁ + (n − 1) · d', 'd = diferencia constante'], g: g };
    },
    ga1_expr: function (k, r) {
      var a1 = E(r, 1, 3), b1 = E(r, 1, 3), a2 = E(r, 1, 3), b2 = E(r, 1, 3), g = '', x = 20;
      function grupo(a, b, lab) { var s = '', x0 = x, i; for (i = 0; i < a; i++) { s += RE(x, 60, 24, 110, k.a, k.i, 1.5, 3) + TX(k, x + 12, 122, 'x', { s: 15, c: '#fff', it: true }); x += 30; } for (i = 0; i < b; i++) s += RE(x, 60 + i * 30, 24, 24, k.b, k.i, 1.5, 3); x += 30; s += TX(k, (x0 + x - 6) / 2, 205, lab, { s: 18, w: 700 }); return s; }
      g += grupo(a1, b1, a1 + 'x + ' + b1) + TX(k, x + 6, 125, '+', { s: 34, w: 700 }); x += 32;
      g += grupo(a2, b2, a2 + 'x + ' + b2) + TX(k, x + 6, 125, '=', { s: 34, w: 700 }); x += 32;
      g += grupo(a1 + a2, b1 + b2, (a1 + a2) + 'x + ' + (b1 + b2));
      g += RE(150, 260, 16, 50, k.a, k.i, 1.2, 2) + TX(k, 176, 292, '= x', { s: 16, a: 'start' }) + RE(290, 272, 22, 22, k.b, k.i, 1.2, 2) + TX(k, 322, 292, '= 1', { s: 16, a: 'start' });
      return { t: 'Fichas algebraicas', cap: ['solo se suman términos semejantes', 'x + x = 2x'], g: g };
    },
    ga1_ecua: function (k, r) {
      var a = E(r, 2, 3), xv = E(r, 2, 5), b = E(r, 1, 3), c = a * xv + b, g = '', i;
      g += PG([[300, 150], [270, 290], [330, 290]], k.s, k.i, 2) + RE(220, 290, 160, 12, k.i, 'none', 0, 3) + L(90, 150, 510, 150, k.i, 5) + CI(300, 150, 7, k.b);
      [140, 460].forEach(function (x0) { g += L(x0, 150, x0 - 50, 215, k.i, 1.4) + L(x0, 150, x0 + 50, 215, k.i, 1.4) + PA('M' + (x0 - 70) + ',215 Q' + x0 + ',250 ' + (x0 + 70) + ',215 Z', k.s2, k.i, 2); });
      for (i = 0; i < a; i++) g += RE(88 + i * 38, 178, 34, 34, k.a, k.i, 1.5, 4) + TX(k, 105 + i * 38, 201, 'x', { s: 16, c: '#fff', it: true, w: 700 });
      for (i = 0; i < b; i++) g += CI(92 + (a + i) * 38 + 8, 197, 13, k.b, k.i, 1.5) + TX(k, 100 + (a + i) * 38, 202, '1', { s: 13, c: '#fff', w: 700 });
      g += RE(420, 170, 80, 42, k.b, k.i, 1.5, 6) + TX(k, 460, 198, c + ' kg', { s: 17, c: '#fff', w: 700 });
      g += TX(k, 300, 40, a + 'x + ' + b + ' = ' + c + '  →  ' + a + 'x = ' + (c - b) + '  →  x = ' + xv, { s: 20, w: 700, c: k.a });
      g += TX(k, 300, 330, 'Lo que quitas en un platillo, quítalo también en el otro.', { s: 14 });
      return { t: 'La ecuación como balanza', cap: ['misma operación en los dos miembros', 'comprueba sustituyendo'], g: g };
    },
    ga2_pitagoras: function (k) {
      var u = 28, A = [220, 200], B = [220 + 4 * u, 200], Cc = [220, 200 - 3 * u], g = '', i, j;
      g += PG([A, B, [B[0], B[1] + 4 * u], [A[0], A[1] + 4 * u]], clr(k.b, .65), k.b, 2);
      for (i = 1; i < 4; i++) g += L(A[0] + i * u, 200, A[0] + i * u, 200 + 4 * u, k.b, .7) + L(A[0], 200 + i * u, B[0], 200 + i * u, k.b, .7);
      g += PG([Cc, A, [A[0] - 3 * u, A[1]], [Cc[0] - 3 * u, Cc[1]]], clr(k.a, .65), k.a, 2);
      for (i = 1; i < 3; i++) g += L(A[0] - i * u, Cc[1], A[0] - i * u, 200, k.a, .7) + L(A[0] - 3 * u, Cc[1] + i * u, A[0], Cc[1] + i * u, k.a, .7);
      var n = [3 * u, -4 * u], P3 = [B[0] + n[0], B[1] + n[1]], P4 = [Cc[0] + n[0], Cc[1] + n[1]];
      g += PG([Cc, B, P3, P4], k.s2, k.i, 2);
      for (i = 1; i < 5; i++) { var t = i / 5; g += L(Cc[0] + (B[0] - Cc[0]) * t, Cc[1] + (B[1] - Cc[1]) * t, P4[0] + (P3[0] - P4[0]) * t, P4[1] + (P3[1] - P4[1]) * t, k.i, .6) + L(Cc[0] + n[0] * t, Cc[1] + n[1] * t, B[0] + n[0] * t, B[1] + n[1] * t, k.i, .6); }
      g += PG([A, B, Cc], '#fff', k.i, 3) + REC(A[0], A[1], 1, -1, k.i);
      g += TX(k, A[0] + 2 * u, 200 + 2 * u + 8, '16', { s: 24, w: 700, c: osc(k.b, .3) }) + TX(k, A[0] - 1.5 * u, Cc[1] + 1.5 * u + 8, '9', { s: 24, w: 700, c: osc(k.a, .3) }) + TX(k, (Cc[0] + P3[0]) / 2, (Cc[1] + P3[1]) / 2 + 8, '25', { s: 24, w: 700 });
      g += TX(k, 238, 160, 'a = 3', { s: 13, a: 'start' }) + TX(k, 278, 194, 'b = 4', { s: 13 }) + TX(k, 286, 146, 'c = 5', { s: 13, a: 'start' });
      g += TX(k, 470, 250, 'a² + b² = c²', { s: 24, w: 700, c: k.a }) + TX(k, 470, 282, '9 + 16 = 25', { s: 20 });
      return { t: 'Los cuadrados de Pitágoras', cap: ['c² = a² + b²', 'c = √(a² + b²)', 'terna 3 · 4 · 5'], g: g };
    },
    ga2_tales: function (k) {
      var g = '', y = 290;
      g += CI(46, 46, 26, '#F4C22A', osc('#F4C22A', .2), 2);
      for (var i = 0; i < 8; i++) { var p = PT(46, 46, 34, i * 45), q = PT(46, 46, 46, i * 45); g += L(p[0], p[1], q[0], q[1], '#E8A42A', 3); }
      g += L(20, y, 580, y, k.i, 2.5);
      g += PG([[110, 230], [110, y], [160, y]], k.s2) + PG([[330, 110], [330, y], [480, y]], k.s2);
      g += RE(300, 110, 30, 180, clr(k.a, .5), k.a, 2) ;
      for (var f = 0; f < 5; f++) g += RE(307, 124 + f * 32, 16, 16, '#fff', k.a, 1);
      g += L(110, 230, 110, y, k.b, 5) + DL(66, 177, 160, y, k.i) + DL(238, 0, 480, y, k.i) + L(110, y, 160, y, k.a, 6) + L(330, y, 480, y, k.a, 6);
      g += TX(k, 96, 266, 'h', { s: 18, it: true, a: 'end' }) + TX(k, 135, 314, 's', { s: 18, it: true }) + TX(k, 290, 205, 'H = ?', { s: 18, w: 700, a: 'end' }) + TX(k, 405, 314, 'S', { s: 18, it: true });
      g += TX(k, 470, 90, 'H ÷ S = h ÷ s', { s: 24, w: 700, c: k.a }) + TX(k, 470, 120, 'rayos paralelos → triángulos semejantes', { s: 13 });
      return { t: 'Tales y las sombras', cap: ['H / S = h / s', 'áreas × k²', 'volúmenes × k³'], g: g };
    },
    ga2_volumen: function (k) {
      var g = '', a = k.a, b = k.b;
      g += PG([[40, 140], [130, 140], [130, 250], [40, 250]], a, k.i, 2) + PG([[40, 140], [70, 110], [160, 110], [130, 140]], clr(a, .4), k.i, 2) + PG([[130, 140], [160, 110], [160, 220], [130, 250]], sombra(k, a, .28), k.i, 2);
      g += RE(190, 120, 90, 130, b, 'none') + EL(235, 250, 45, 14, b, k.i, 2) + RE(190, 120, 90, 130, b, 'none') + L(190, 120, 190, 250, k.i, 2) + L(280, 120, 280, 250, k.i, 2) + EL(235, 120, 45, 14, clr(b, .45), k.i, 2) + DL(235, 120, 280, 120, k.i) + TX(k, 258, 113, 'r', { s: 14, it: true }) + DL(296, 120, 296, 250, k.i) + TX(k, 306, 190, 'h', { s: 14, it: true, a: 'start' });
      g += PA('M320,250 L365,110 L410,250', sombra(k, clr(a, .25), .1), k.i, 2) + EL(365, 250, 45, 14, sombra(k, a, .15), k.i, 2) + PA('M320,250 L365,110 L410,250', 'none', k.i, 2) + DL(365, 110, 365, 250, k.i);
      g += (k.d3 ? '<defs><radialGradient id="gvesf" cx=".35" cy=".35" r=".7"><stop offset="0" stop-color="' + clr(b, .6) + '"/><stop offset="1" stop-color="' + osc(b, .25) + '"/></radialGradient></defs>' + CI(515, 185, 62, 'url(#gvesf)', k.i, 2) : CI(515, 185, 62, clr(b, .3), k.i, 2)) + PA('M453,185 A62,18 0 0 0 577,185', 'none', k.i, 1.4) + PA('M453,185 A62,18 0 0 1 577,185', 'none', k.i, 1.2, ' stroke-dasharray="5 4"') + L(515, 185, 577, 185, k.i, 1.6) + TX(k, 546, 178, 'r', { s: 14, it: true });
      var N = [['prisma', 'V = a · b · c', 100], ['cilindro', 'V = π · r² · h', 235], ['cono', 'V = π · r² · h ÷ 3', 365], ['esfera', 'V = 4/3 · π · r³', 515]];
      N.forEach(function (n) { g += TX(k, n[2], 292, n[0], { s: 15, w: 700 }) + TX(k, n[2], 316, n[1], { s: 14, c: k.a }); });
      return { t: 'Cuerpos geométricos', cap: ['1 dm³ = 1 L', 'cono = cilindro ÷ 3'], g: g };
    },
    ga2_polinomios: function (k, r) {
      var a = E(r, 1, 4), b = E(r, 1, 4), u = 30, X = 150, x0 = 50, y0 = 45, g = '';
      g += RE(x0, y0, X, X, clr(k.a, .45), k.i, 2) + RE(x0 + X, y0, b * u, X, k.s2, k.i, 2) + RE(x0, y0 + X, X, a * u, k.s2, k.i, 2) + RE(x0 + X, y0 + X, b * u, a * u, clr(k.b, .5), k.i, 2);
      g += TX(k, x0 + X / 2, y0 + X / 2 + 8, 'x²', { s: 26, w: 700 }) + TX(k, x0 + X + b * u / 2, y0 + X / 2 + 6, b + 'x', { s: 18, w: 700 }) + TX(k, x0 + X / 2, y0 + X + a * u / 2 + 6, a + 'x', { s: 18, w: 700 }) + TX(k, x0 + X + b * u / 2, y0 + X + a * u / 2 + 6, String(a * b), { s: 16, w: 700 });
      g += TX(k, x0 + X / 2, y0 - 10, 'x', { s: 16, it: true }) + TX(k, x0 + X + b * u / 2, y0 - 10, String(b), { s: 16 }) + TX(k, x0 - 12, y0 + X / 2, 'x', { s: 16, it: true }) + TX(k, x0 - 12, y0 + X + a * u / 2 + 5, String(a), { s: 16 });
      g += TX(k, 470, 150, '(x + ' + a + ')(x + ' + b + ')', { s: 22, w: 700 }) + TX(k, 470, 185, '= x² + ' + (a + b) + 'x + ' + (a * b), { s: 22, w: 700, c: k.a }) + TX(k, 470, 225, 'cada rectángulo es un término', { s: 13 });
      return { t: 'El producto como área', cap: ['propiedad distributiva', 'grado = mayor exponente'], g: g };
    },
    ga2_sistemas: function (k, r) {
      var E0 = EJES(k, { ox: 300, oy: 170, sx: 26, x0: -8, x1: 8, y0: -5.5, y1: 5.5 }), x0 = E(r, -3, 3), y0 = E(r, -2, 2), m1 = H.pick(r, [1, 2, .5]), m2 = H.pick(r, [-1, -2, -.5]);
      var g = E0.g + PLOT(E0, function (x) { return y0 + m1 * (x - x0); }, -8, 8, k.a, 3.5) + PLOT(E0, function (x) { return y0 + m2 * (x - x0); }, -8, 8, k.b, 3.5);
      g += DOT(E0.X(x0), E0.Y(y0), k.i, 7) + RE(E0.X(x0) + 12, E0.Y(y0) - 36, 78, 26, '#fff', k.i, 1, 6) + TX(k, E0.X(x0) + 51, E0.Y(y0) - 18, '(' + x0 + ', ' + y0 + ')', { s: 15, w: 700 });
      g += TX(k, 90, 30, 'r₁', { s: 18, w: 700, c: k.a }) + TX(k, 510, 30, 'r₂', { s: 18, w: 700, c: k.b });
      return { t: 'Dos rectas, una solución', cap: ['solución = punto de corte', 'paralelas → sin solución', 'coincidentes → infinitas'], g: g };
    },
    ga2_lineal: function (k, r) {
      var E0 = EJES(k, { ox: 280, oy: 200, sx: 28, x0: -9, x1: 10, y0: -4.5, y1: 4.5 }), q = H.pick(r, [1, 2, 3]), p = H.pick(r, [1, 2, -1, -2]), b = E(r, -2, 1), m = p / q;
      var g = E0.g + PLOT(E0, function (x) { return m * x + b; }, -9, 10, k.a, 3.5);
      var x1 = p > 0 ? 1 : -3, y1 = m * x1 + b, X1 = E0.X(x1), Y1 = E0.Y(y1), X2 = E0.X(x1 + q), Y2 = E0.Y(y1 + p);
      g += PG([[X1, Y1], [X2, Y1], [X2, Y2]], k.s2, 'none') + L(X1, Y1, X2, Y1, k.b, 3) + L(X2, Y1, X2, Y2, k.b, 3) + TX(k, (X1 + X2) / 2, Y1 + (p > 0 ? 20 : -8), 'Δx = ' + q, { s: 14, w: 700 }) + TX(k, X2 + 8, (Y1 + Y2) / 2 + 5, 'Δy = ' + nf(p), { s: 14, w: 700, a: 'start' });
      g += DOT(E0.X(0), E0.Y(b), k.b, 6) + TX(k, E0.X(0) - 10, E0.Y(b) + 20, 'b = ' + nf(b), { s: 14, a: 'end' });
      g += RE(22, 20, 176, 58, '#fff', k.i, 1, 8) + TX(k, 110, 44, 'y = ' + (p < 0 ? '−' : '') + (q === 1 ? (Math.abs(p) === 1 ? '' : Math.abs(p)) : Math.abs(p) + '/' + q) + 'x' + (b ? (b < 0 ? ' − ' + (-b) : ' + ' + b) : ''), { s: 17, w: 700, c: k.a }) + TX(k, 110, 68, 'm = Δy ÷ Δx', { s: 14 });
      return { t: 'La pendiente de una recta', cap: ['y = m·x + b', 'm > 0 sube, m < 0 baja'], g: g };
    },
    ga3_trigo: function (k, r) {
      var cx = 180, cy = 180, Rr = 130, a = H.pick(r, [35, 40, 50, 55]), g = '', P = PT(cx, cy, Rr, a);
      g += CI(cx, cy, Rr, k.s2, k.i, 2) + L(cx - Rr - 20, cy, cx + Rr + 20, cy, k.i, 1.4) + L(cx, cy + Rr + 14, cx, cy - Rr - 14, k.i, 1.4);
      g += ARC(cx, cy, 40, 0, a, k.a, k.a) + L(cx, cy, P[0], P[1], k.i, 3) + L(P[0], P[1], P[0], cy, k.b, 5) + L(cx, cy, P[0], cy, k.a, 5) + DOT(P[0], P[1], k.i, 6);
      g += TX(k, P[0] + 10, (P[1] + cy) / 2, 'sen α', { s: 15, w: 700, c: k.b, a: 'start' }) + TX(k, (cx + P[0]) / 2, cy + 22, 'cos α', { s: 15, w: 700, c: k.a }) + TX(k, cx + 52, cy - 10, 'α', { s: 16, it: true }) + TX(k, (cx + P[0]) / 2 - 16, (cy + P[1]) / 2 - 4, '1', { s: 15 });
      var A = [345, 270], B = [525, 270], Cc = [525, 130];
      g += PG([A, B, Cc], clr(k.a, .8), k.i, 2.5) + REC(525, 270, -1, -1, k.i) + ARC(345, 270, 36, 0, 38, k.i);
      g += TX(k, 435, 294, 'cateto contiguo', { s: 14 }) + TX(k, 533, 205, 'cateto', { s: 14, a: 'start' }) + TX(k, 533, 222, 'opuesto', { s: 14, a: 'start' }) + TX(k, 425, 188, 'hipotenusa', { s: 14, a: 'end' }) + TX(k, 391, 262, 'α', { s: 15, it: true });
      g += TX(k, 470, 44, 'sen α = opuesto ÷ hipotenusa', { s: 14, a: 'middle' }) + TX(k, 470, 66, 'cos α = contiguo ÷ hipotenusa', { s: 14 }) + TX(k, 470, 88, 'tg α = opuesto ÷ contiguo', { s: 14 });
      return { t: 'Seno, coseno y tangente', cap: ['sen² α + cos² α = 1', 'tg α = sen α ÷ cos α'], g: g };
    },
    ga3_cuadratica: function (k, r) {
      var p = E(r, -5, 0), q = p + E(r, 2, 6), s = (q - p) * (q - p) / 4 > 7 ? .5 : 1, E0 = EJES(k, { ox: 300, oy: 230, sx: 28, x0: -8, x1: 8, y0: -7.5, y1: 3.5 }), h = (p + q) / 2, v = -s * (q - p) * (q - p) / 4;
      var g = E0.g + DL(E0.X(h), E0.Y(3.5), E0.X(h), E0.Y(-7.5), k.b) + PLOT(E0, function (x) { return s * (x - p) * (x - q); }, -8, 8, k.a, 3.5);
      g += DOT(E0.X(p), E0.Y(0), k.b, 6) + DOT(E0.X(q), E0.Y(0), k.b, 6) + DOT(E0.X(h), E0.Y(v), k.i, 6) + TX(k, E0.X(p) - 6, E0.Y(0) - 12, 'x₁', { s: 15, w: 700, a: 'end' }) + TX(k, E0.X(q) + 6, E0.Y(0) - 12, 'x₂', { s: 15, w: 700, a: 'start' }) + TX(k, E0.X(h) + 12, E0.Y(v) + 5, 'vértice', { s: 14, a: 'start' });
      g += RE(18, 14, 190, 84, '#fff', k.i, 1, 8) + TX(k, 30, 38, 'Δ > 0 → dos soluciones', { s: 14, a: 'start' }) + TX(k, 30, 62, 'Δ = 0 → una doble', { s: 14, a: 'start' }) + TX(k, 30, 86, 'Δ < 0 → ninguna real', { s: 14, a: 'start' });
      return { t: 'Raíces de la parábola', cap: ['x = (−b ± √Δ) ÷ 2a', 'Δ = b² − 4ac'], g: g };
    },
    ga3_factor: function (k) {
      var x0 = 40, y0 = 30, A = 170, B = 110, g = '';
      g += RE(x0, y0, A, A, clr(k.a, .45), k.i, 2) + RE(x0 + A, y0, B, A, k.s2, k.i, 2) + RE(x0, y0 + A, A, B, k.s2, k.i, 2) + RE(x0 + A, y0 + A, B, B, clr(k.b, .5), k.i, 2);
      g += TX(k, x0 + A / 2, y0 + A / 2 + 9, 'a²', { s: 28, w: 700 }) + TX(k, x0 + A + B / 2, y0 + A / 2 + 7, 'ab', { s: 22, w: 700 }) + TX(k, x0 + A / 2, y0 + A + B / 2 + 7, 'ab', { s: 22, w: 700 }) + TX(k, x0 + A + B / 2, y0 + A + B / 2 + 8, 'b²', { s: 24, w: 700 });
      g += TX(k, x0 + A / 2, y0 - 8, 'a', { s: 16, it: true }) + TX(k, x0 + A + B / 2, y0 - 8, 'b', { s: 16, it: true }) + TX(k, x0 - 12, y0 + A / 2, 'a', { s: 16, it: true }) + TX(k, x0 - 12, y0 + A + B / 2, 'b', { s: 16, it: true });
      g += TX(k, 470, 120, '(a + b)² = a² + 2ab + b²', { s: 18, w: 700, c: k.a }) + TX(k, 470, 160, '(a − b)² = a² − 2ab + b²', { s: 17 }) + TX(k, 470, 200, '(a + b)(a − b) = a² − b²', { s: 17 });
      return { t: 'El cuadrado de una suma', cap: ['factor común primero', 'diferencia de cuadrados'], g: g };
    },
    ga3_analitica: function (k, r) {
      var T2 = H.pick(r, [[3, 4, 5], [4, 3, 5], [6, 8, 10]]), E0 = EJES(k, { ox: 300, oy: 175, sx: 26, x0: -8, x1: 8, y0: -5.5, y1: 5.5 });
      var x1 = T2[0] > 5 ? -3 : E(r, -6, 0), y1 = T2[1] > 5 ? -4 : E(r, -5, 1), x2 = x1 + T2[0], y2 = y1 + T2[1];
      var g = E0.g + DL(E0.X(x1), E0.Y(y1), E0.X(x2), E0.Y(y1), k.b, 2) + DL(E0.X(x2), E0.Y(y1), E0.X(x2), E0.Y(y2), k.b, 2) + L(E0.X(x1), E0.Y(y1), E0.X(x2), E0.Y(y2), k.a, 4);
      g += DOT(E0.X(x1), E0.Y(y1), k.i, 6) + DOT(E0.X(x2), E0.Y(y2), k.i, 6) + DOT(E0.X((x1 + x2) / 2), E0.Y((y1 + y2) / 2), k.b, 6);
      g += TX(k, E0.X(x1) - 8, E0.Y(y1) + 20, 'A(' + x1 + ', ' + y1 + ')', { s: 14, w: 700, a: 'end' }) + TX(k, E0.X(x2) + 8, E0.Y(y2) - 8, 'B(' + x2 + ', ' + y2 + ')', { s: 14, w: 700, a: 'start' }) + TX(k, E0.X((x1 + x2) / 2) - 10, E0.Y((y1 + y2) / 2) - 8, 'M', { s: 15, w: 700, a: 'end', c: k.b });
      g += TX(k, (E0.X(x1) + E0.X(x2)) / 2, E0.Y(y1) + 20, String(T2[0]), { s: 14, c: k.b }) + TX(k, E0.X(x2) + 12, (E0.Y(y1) + E0.Y(y2)) / 2, String(T2[1]), { s: 14, c: k.b, a: 'start' }) + RE(20, 14, 120, 30, '#fff', k.i, 1, 6) + TX(k, 80, 35, 'd = ' + T2[2], { s: 17, w: 700, c: k.a });
      return { t: 'Distancia y punto medio', cap: ['d = √((x₂−x₁)² + (y₂−y₁)²)', 'M = ((x₁+x₂)/2, (y₁+y₂)/2)'], g: g };
    },
    ga3_vectores: function (k, r) {
      var u = 34, O = [110, 285], a = [E(r, 4, 6), E(r, 0, 2)], b = [E(r, 1, 2), E(r, 3, 5)], g = '', i;
      for (i = 0; i <= 14; i++) g += L(30 + i * u, 20, 30 + i * u, 320, k.s, .8);
      for (i = 0; i <= 9; i++) g += L(30, 20 + i * u, 510, 20 + i * u, k.s, .8);
      var A = [O[0] + a[0] * u, O[1] - a[1] * u], B = [O[0] + b[0] * u, O[1] - b[1] * u], S = [O[0] + (a[0] + b[0]) * u, O[1] - (a[1] + b[1]) * u];
      g += PG([O, A, S, B], k.s2, 'none') + DL(A[0], A[1], S[0], S[1], k.i) + DL(B[0], B[1], S[0], S[1], k.i) + FL(O[0], O[1], A[0], A[1], k.a, 4) + FL(O[0], O[1], B[0], B[1], k.a, 4) + FL(O[0], O[1], S[0], S[1], k.b, 4.5) + DOT(O[0], O[1], k.i, 5);
      g += TX(k, (O[0] + A[0]) / 2, (O[1] + A[1]) / 2 + 24, 'u = (' + a[0] + ', ' + a[1] + ')', { s: 14, w: 700 }) + TX(k, (O[0] + B[0]) / 2 - 12, (O[1] + B[1]) / 2, 'v = (' + b[0] + ', ' + b[1] + ')', { s: 14, w: 700, a: 'end' }) + TX(k, S[0] + 8, S[1] - 6, 'u + v = (' + (a[0] + b[0]) + ', ' + (a[1] + b[1]) + ')', { s: 15, w: 700, c: k.b, a: 'start' });
      return { t: 'Suma de vectores', cap: ['regla del paralelogramo', '|u| = √(u₁² + u₂²)', 'u · v = 0 → perpendiculares'], g: g };
    },
    ga3_inecua: function (k, r) {
      var g = '', x0 = E(r, -3, 3), x1 = E(r, -3, 3), X = function (v) { return 300 + v * 40; };
      [[110, x0, '>', false], [240, x1, '≤', true]].forEach(function (o) {
        var y = o[0], v = o[1], der = o[2] === '>';
        g += L(40, y, 560, y, k.i, 2);
        for (var i = -6; i <= 6; i++) g += L(X(i), y - 6, X(i), y + 6, k.i, 1.3) + TX(k, X(i), y + 26, nf(i), { s: 13 });
        g += FL(X(v), y, der ? 572 : 28, y, k.a, 7) + CI(X(v), y, 9, o[3] ? k.a : '#fff', k.a, 3) + TX(k, X(v), y - 22, 'x ' + o[2] + ' ' + nf(v), { s: 19, w: 700, c: k.a });
      });
      g += TX(k, 150, 316, '○ abierto: no incluye el extremo', { s: 13 }) + TX(k, 450, 316, '● cerrado: sí lo incluye', { s: 13 });
      return { t: 'Soluciones en la recta', cap: ['× (−1) cambia el sentido', 'la solución es un intervalo'], g: g };
    },
    ga4_matrices: function (k, r) {
      var a = E(r, 1, 3), b = E(r, 0, 2), c = E(r, 0, 1), d = E(r, 1, 3); if (a * d - b * c === 0) d++;
      var u = 44, O = [60, 280], P = function (x, y) { return [O[0] + x * u, O[1] - y * u]; }, g = '', i;
      for (i = 0; i <= 7; i++) g += L(O[0] + i * u, 20, O[0] + i * u, O[1], k.s, .8);
      for (i = 0; i <= 6; i++) g += L(O[0], O[1] - i * u, O[0] + 7 * u, O[1] - i * u, k.s, .8);
      g += PG([P(0, 0), P(1, 0), P(1, 1), P(0, 1)], k.s2, k.i, 1.5) + PG([P(0, 0), P(a, c), P(a + b, c + d), P(b, d)], clr(k.a, .55), k.a, 2.5, ' fill-opacity=".75"');
      g += FL(O[0], O[1], P(a, c)[0], P(a, c)[1], k.a, 3.5) + FL(O[0], O[1], P(b, d)[0], P(b, d)[1], k.b, 3.5) + TX(k, P(.5, .5)[0], P(.5, .5)[1] + 5, '1', { s: 14 });
      g += TX(k, 470, 110, 'M =', { s: 20, a: 'end' }) + PA('M484,76 L478,76 L478,140 L484,140', 'none', k.i, 2) + PA('M556,76 L562,76 L562,140 L556,140', 'none', k.i, 2) + TX(k, 500, 102, String(a), { s: 20, c: k.a }) + TX(k, 540, 102, String(b), { s: 20, c: k.b }) + TX(k, 500, 130, String(c), { s: 20, c: k.a }) + TX(k, 540, 130, String(d), { s: 20, c: k.b });
      g += TX(k, 490, 190, 'área = |det M|', { s: 18, w: 700 }) + TX(k, 490, 218, '= ' + a + '·' + d + ' − ' + b + '·' + c + ' = ' + (a * d - b * c), { s: 18, c: k.a, w: 700 });
      return { t: 'El determinante como área', cap: ['det = a·d − b·c', 'det = 0 → sin inversa'], g: g };
    },
    ga4_gauss: function (k, r) {
      var M = [[E(r, 1, 3), E(r, -3, 3), E(r, -3, 3), E(r, -9, 9)], [0, E(r, 1, 3), E(r, -3, 3), E(r, -9, 9)], [0, 0, E(r, 1, 3), E(r, -9, 9)]], x0 = 150, y0 = 60, w = 72, h = 62, g = '';
      M.forEach(function (f, i) { f.forEach(function (v, j) { var z = j < i; g += RE(x0 + j * w, y0 + i * h, w, h, z ? clr(k.b, .55) : (j === 3 ? k.s2 : '#fff'), k.i, 1.2) + TX(k, x0 + j * w + w / 2, y0 + i * h + h / 2 + 8, nf(v), { s: 22, w: z ? 700 : 400, c: z ? osc(k.b, .35) : k.i }); }); });
      g += L(x0 + 3 * w, y0 - 8, x0 + 3 * w, y0 + 3 * h + 8, k.a, 3);
      g += TX(k, x0 - 14, y0 + h * 1.5 + 6, 'F₂ − k·F₁', { s: 14, a: 'end', c: k.b, w: 700 }) + TX(k, x0 - 14, y0 + h * 2.5 + 6, 'F₃ − k·F₂', { s: 14, a: 'end', c: k.b, w: 700 });
      g += TX(k, x0 + 2 * w, y0 + 3 * h + 44, 'Ceros bajo la diagonal → se despeja z, luego y, luego x', { s: 15 });
      g += FL(505, 240, 505, 90, k.a, 3) + TX(k, 520, 170, 'de abajo', { s: 13, a: 'start' }) + TX(k, 520, 188, 'arriba', { s: 13, a: 'start' });
      return { t: 'Matriz escalonada de Gauss', cap: ['A · X = B', 'det ≠ 0 → solución única'], g: g };
    },
    ga4_conicas: function (k) {
      var g = '', y = 150, c = [80, 230, 380, 525];
      g += CI(c[0], y, 55, k.s2, k.a, 3) + DOT(c[0], y, k.a, 4) + L(c[0], y, c[0] + 55, y, k.a, 1.5);
      g += EL(c[1], y, 68, 42, k.s2, k.a, 3) + DOT(c[1] - 53, y, k.b, 4) + DOT(c[1] + 53, y, k.b, 4);
      g += PA('M' + (c[2] - 60) + ',60 Q' + c[2] + ',300 ' + (c[2] + 60) + ',60', 'none', k.a, 3) + DOT(c[2], 150, k.b, 4) + DL(c[2] - 65, 208, c[2] + 65, 208, k.i);
      g += DL(c[3] - 65, 70, c[3] + 65, 230, k.i, 1.2) + DL(c[3] - 65, 230, c[3] + 65, 70, k.i, 1.2) + PA('M' + (c[3] - 70) + ',70 Q' + (c[3] - 18) + ',150 ' + (c[3] - 70) + ',230', 'none', k.a, 3) + PA('M' + (c[3] + 70) + ',70 Q' + (c[3] + 18) + ',150 ' + (c[3] + 70) + ',230', 'none', k.a, 3);
      [['circunferencia', 'centro y radio'], ['elipse', 'dos focos'], ['parábola', 'foco y directriz'], ['hipérbola', 'dos ramas']].forEach(function (n, i) { g += TX(k, c[i], 272, n[0], { s: 15, w: 700 }) + TX(k, c[i], 294, n[1], { s: 13 }); });
      return { t: 'Las cuatro cónicas', cap: ['(x−a)² + (y−b)² = r²', 'x²/a² + y²/b² = 1'], g: g };
    },
    ga4_complejos: function (k, r) {
      var a = E(r, 2, 6), b = E(r, 1, 4), E0 = EJES(k, { ox: 230, oy: 180, sx: 30, x0: -2, x1: 7.5, y0: -4.5, y1: 4.8, nx: 'Re', ny: 'Im' }), P = [E0.X(a), E0.Y(b)], Q = [E0.X(a), E0.Y(-b)];
      var g = E0.g + DL(P[0], P[1], P[0], E0.Y(0), k.b) + DL(P[0], P[1], E0.X(0), P[1], k.b) + FL(E0.X(0), E0.Y(0), P[0], P[1], k.a, 4) + DL(E0.X(0), E0.Y(0), Q[0], Q[1], k.i) + DOT(P[0], P[1], k.a, 6) + DOT(Q[0], Q[1], k.i, 5);
      var th = Math.atan2(b, a) * 180 / Math.PI;
      g += ARC(E0.X(0), E0.Y(0), 40, 0, th, k.b) + TX(k, E0.X(0) + 50, E0.Y(0) - 8, 'θ', { s: 16, it: true, a: 'start' }) + TX(k, P[0] + 8, P[1] - 8, 'z = ' + a + ' + ' + b + 'i', { s: 16, w: 700, a: 'start', c: k.a }) + TX(k, Q[0] + 8, Q[1] + 16, 'z̄ = ' + a + ' − ' + b + 'i', { s: 14, a: 'start' }) + TX(k, (E0.X(0) + P[0]) / 2 - 8, (E0.Y(0) + P[1]) / 2 - 8, '|z|', { s: 15, w: 700, a: 'end' });
      return { t: 'El plano complejo', cap: ['|z| = √(a² + b²)', 'i² = −1', 'z̄ = a − bi'], g: g };
    },
    ga4_espacio: function (k, r) {
      var O = [270, 220], s = 38, pr = function (v) { return [O[0] + (v[1] - v[0]) * s * .87, O[1] + (v[0] + v[1]) * s * .5 - v[2] * s]; };
      var u = [E(r, 2, 3), 0, E(r, 0, 1)], v = [0, E(r, 2, 3), E(r, 0, 1)], w = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]], m = Math.hypot(w[0], w[1], w[2]) || 1;
      w = w.map(function (x) { return x / m * 3.2; });
      var g = '', ax = [[4, 0, 0, 'x'], [0, 4.2, 0, 'y'], [0, 0, 4, 'z']];
      ax.forEach(function (a) { var p = pr(a); g += FL(O[0], O[1], p[0], p[1], k.i, 1.6) + TX(k, p[0] + (a[3] === 'x' ? -12 : 12), p[1] + 4, a[3], { s: 15, it: true }); });
      g += PG([pr([0, 0, 0]), pr(u), pr([u[0] + v[0], u[1] + v[1], u[2] + v[2]]), pr(v)], k.s2, k.i, 1, ' stroke-dasharray="4 4"');
      g += FL(O[0], O[1], pr(u)[0], pr(u)[1], k.a, 4) + FL(O[0], O[1], pr(v)[0], pr(v)[1], k.a, 4) + FL(O[0], O[1], pr(w)[0], pr(w)[1], k.b, 4.5) + DOT(O[0], O[1], k.i, 4);
      g += TX(k, pr(u)[0] - 8, pr(u)[1] + 20, 'u', { s: 17, w: 700, it: true }) + TX(k, pr(v)[0] + 10, pr(v)[1] + 18, 'v', { s: 17, w: 700, it: true }) + TX(k, pr(w)[0] + 10, pr(w)[1], 'u × v', { s: 17, w: 700, c: k.b, a: 'start' });
      g += TX(k, 490, 290, 'u × v es perpendicular', { s: 14 }) + TX(k, 490, 310, 'a u y a v', { s: 14 });
      return { t: 'Vectores en el espacio', cap: ['|u × v| = área del paralelogramo', 'u · v = |u||v| cos α'], g: g };
    },
    ga4_sucesiones: function (k, r) {
      var d = E(r, 2, 4), a1 = E(r, 1, 3), q = 2, g = '', base = 290, n;
      g += L(40, base, 570, base, k.i, 2);
      for (n = 1; n <= 6; n++) {
        var ar = a1 + (n - 1) * d, ge = Math.pow(q, n - 1), x = 40 + (n - 1) * 88, sc = 7.5;
        g += RE(x + 10, base - ar * sc, 30, ar * sc, k.a, 'none', 0, 3) + RE(x + 44, base - ge * sc, 30, ge * sc, k.b, 'none', 0, 3);
        g += TX(k, x + 25, base - ar * sc - 6, String(ar), { s: 13, w: 700 }) + TX(k, x + 59, base - ge * sc - 6, String(ge), { s: 13, w: 700 }) + TX(k, x + 42, base + 20, 'n = ' + n, { s: 13 });
      }
      g += RE(40, 16, 16, 16, k.a, 'none', 0, 3) + TX(k, 62, 29, 'aritmética: +' + d, { s: 14, a: 'start' }) + RE(220, 16, 16, 16, k.b, 'none', 0, 3) + TX(k, 242, 29, 'geométrica: ×' + q, { s: 14, a: 'start' });
      return { t: 'Sumar o multiplicar', cap: ['aₙ = a₁ + (n − 1)·d', 'aₙ = a₁ · rⁿ⁻¹'], g: g };
    },

    /* ─────────── Cálculo ─────────── */
    ca1_funciones: function (k, r) {
      var a = E(r, 0, 3), g = '';
      g += TX(k, 30, 106, 'x', { s: 22, it: true, w: 700 }) + FL(44, 100, 84, 100, k.i, 2.5) + RE(90, 60, 90, 80, clr(k.a, .5), k.a, 2.5, 12) + TX(k, 135, 110, 'f', { s: 30, it: true, w: 700 }) + FL(186, 100, 226, 100, k.i, 2.5) + TX(k, 262, 106, 'f(x)', { s: 20, it: true, w: 700 });
      g += TX(k, 135, 170, 'a cada x, un único y', { s: 13 });
      var E0 = EJES(k, { ox: 330, oy: 280, sx: 24, x0: -1, x1: 10.5, y0: -1, y1: 3.5, num: 2 });
      g += E0.g + L(E0.X(a), E0.Y(0), E0.X(10.5), E0.Y(0), k.b, 7) + PLOT(E0, function (x) { return Math.sqrt(x - a); }, a, 10.5, k.a, 3.5) + DOT(E0.X(a), E0.Y(0), k.a, 6);
      g += TX(k, E0.X(6), E0.Y(0) + 40, 'dominio: x ≥ ' + a, { s: 15, w: 700, c: k.b }) + TX(k, E0.X(6), 30, 'f(x) = √(x − ' + a + ')', { s: 17, w: 700, c: k.a });
      return { t: 'Una función y su dominio', cap: ['dominio: donde existe f', '√: radicando ≥ 0', '1/x: x ≠ 0'], g: g };
    },
    ca1_tvm: function (k, r) {
      var f = function (x) { return .05 * x * x + .1 * x + .5; }, a = E(r, 1, 4), b = a + E(r, 3, 6), E0 = EJES(k, { ox: 60, oy: 300, sx: 42, sy: 40, x0: 0, x1: 12, y0: 0, y1: 7 });
      var g = E0.g + PLOT(E0, f, 0, 12, k.a, 3.5), m = (f(b) - f(a)) / (b - a);
      g += PLOT(E0, function (x) { return f(a) + m * (x - a); }, a - 1.5, b + 1.5, k.b, 2.5) + DL(E0.X(a), E0.Y(f(a)), E0.X(b), E0.Y(f(a)), k.i) + DL(E0.X(b), E0.Y(f(a)), E0.X(b), E0.Y(f(b)), k.i);
      g += DOT(E0.X(a), E0.Y(f(a)), k.b, 6) + DOT(E0.X(b), E0.Y(f(b)), k.b, 6) + TX(k, (E0.X(a) + E0.X(b)) / 2, E0.Y(f(a)) + 20, 'Δx = ' + (b - a), { s: 14, w: 700 }) + TX(k, E0.X(b) + 8, (E0.Y(f(a)) + E0.Y(f(b))) / 2, 'Δy', { s: 14, w: 700, a: 'start' });
      g += RE(80, 16, 220, 34, '#fff', k.i, 1, 8) + TX(k, 190, 39, 'TVM = Δy ÷ Δx = ' + nf(m), { s: 16, w: 700, c: k.b });
      return { t: 'La recta secante', cap: ['TVM = (f(b) − f(a)) ÷ (b − a)', 'velocidad media'], g: g };
    },
    ca1_graficas: function (k) {
      var f = function (x) { return x * x * x - 3 * x; }, E0 = EJES(k, { ox: 300, oy: 175, sx: 80, sy: 30, x0: -2.6, x1: 2.6, y0: -4.8, y1: 4.8, num: 1, numy: 2 });
      var g = E0.g + PLOT(E0, f, -2.3, -1, k.b, 4) + PLOT(E0, f, -1, 1, k.a, 4) + PLOT(E0, f, 1, 2.3, k.b, 4);
      g += DOT(E0.X(-1), E0.Y(2), k.i, 6) + DOT(E0.X(1), E0.Y(-2), k.i, 6) + TX(k, E0.X(-1), E0.Y(2) - 14, 'máximo', { s: 15, w: 700 }) + TX(k, E0.X(1), E0.Y(-2) + 26, 'mínimo', { s: 15, w: 700 });
      g += TX(k, E0.X(-2), 30, 'crece', { s: 14, c: k.b, w: 700 }) + TX(k, E0.X(0), 30, 'decrece', { s: 14, c: k.a, w: 700 }) + TX(k, E0.X(2), 30, 'crece', { s: 14, c: k.b, w: 700 });
      return { t: 'Crecimiento y extremos', cap: ["crece: f′ > 0", "máximo o mínimo: f′ = 0"], g: g };
    },
    ca1_limites: function (k, r) {
      var a = E(r, 1, 3), E0 = EJES(k, { ox: 120, oy: 290, sx: 40, sy: 30, x0: -1, x1: 11, y0: -1, y1: 8.5 });
      var g = E0.g + PLOT(E0, function (x) { return x + a; }, -1, 7.5 - a + 1, k.a, 3.5) + DL(E0.X(a), E0.Y(0), E0.X(a), E0.Y(2 * a), k.i) + DL(E0.X(0), E0.Y(2 * a), E0.X(a), E0.Y(2 * a), k.i) + CI(E0.X(a), E0.Y(2 * a), 7, '#fff', k.a, 3);
      g += FL(E0.X(a - 1.6), E0.Y(0) - 16, E0.X(a) - 12, E0.Y(0) - 16, k.b, 3) + FL(E0.X(a + 1.6), E0.Y(0) - 16, E0.X(a) + 12, E0.Y(0) - 16, k.b, 3);
      g += TX(k, E0.X(0) - 10, E0.Y(2 * a) + 5, 'L = ' + (2 * a), { s: 15, w: 700, a: 'end', c: k.a }) + TX(k, 430, 60, 'f(x) = (x² − ' + (a * a) + ') ÷ (x − ' + a + ')', { s: 16, w: 700 }) + TX(k, 430, 88, 'no existe en x = ' + a + ', pero se acerca a ' + (2 * a), { s: 13 });
      return { t: 'Acercarse sin llegar', cap: ['lím (x→a) f(x) = L', '0/0: factorizar y simplificar'], g: g };
    },
    ca2_derivada: function (k, r) {
      var f = function (x) { return .12 * x * x + .2; }, x0 = E(r, 2, 4), E0 = EJES(k, { ox: 50, oy: 300, sx: 44, sy: 32, x0: 0, x1: 11.5, y0: 0, y1: 8.5 }), g = E0.g + PLOT(E0, f, 0, 8.2, k.i, 3.5);
      [4, 2.5, 1.2].forEach(function (h, i) { var m = (f(x0 + h) - f(x0)) / h; g += PLOT(E0, function (x) { return f(x0) + m * (x - x0); }, x0 - 1.5, x0 + h + 1.2, k.a, 2, ' opacity="' + (.35 + i * .2) + '"') + DOT(E0.X(x0 + h), E0.Y(f(x0 + h)), k.a, 4); });
      var md = .24 * x0; g += PLOT(E0, function (x) { return f(x0) + md * (x - x0); }, x0 - 3, x0 + 4, k.b, 4) + DOT(E0.X(x0), E0.Y(f(x0)), k.b, 7);
      g += TX(k, 400, 40, 'secantes → tangente', { s: 16, w: 700 }) + TX(k, 400, 66, 'cuando h → 0', { s: 14, c: k.a });
      return { t: 'De la secante a la tangente', cap: ["f′(a) = lím (h→0) (f(a+h) − f(a)) ÷ h", 'pendiente de la tangente'], g: g };
    },
    ca2_reglas: function (k) {
      var g = '';
      function eng(cx, cy, rr, n, c, rot) { var s = ''; for (var i = 0; i < n; i++) { var a = (i * 360 / n + (rot || 0)), p = PT(cx, cy, rr + 7, a); s += '<rect x="' + R(p[0] - 6) + '" y="' + R(p[1] - 6) + '" width="12" height="12" fill="' + c + '" transform="rotate(' + (-a) + ' ' + R(p[0]) + ' ' + R(p[1]) + ')"/>'; } return s + CI(cx, cy, rr, c, osc(c, .3), 2) + CI(cx, cy, rr * .3, '#fff', osc(c, .3), 2); }
      g += eng(150, 120, 60, 14, k.a) + eng(262, 120, 38, 9, k.b, 20) + TX(k, 150, 210, 'g(x)', { s: 16, w: 700 }) + TX(k, 262, 210, 'f(u)', { s: 16, w: 700 });
      g += TX(k, 205, 250, 'cada engranaje multiplica la velocidad', { s: 13 });
      g += TX(k, 455, 70, 'x → u = g(x) → y = f(u)', { s: 16, w: 700 }) + TX(k, 455, 120, 'dy/dx = f′(u) · g′(x)', { s: 20, w: 700, c: k.a }) + TX(k, 455, 170, '(u · v)′ = u′·v + u·v′', { s: 16 }) + TX(k, 455, 205, '(eˣ)′ = eˣ   (sen x)′ = cos x', { s: 15 });
      return { t: 'La regla de la cadena', cap: ['(f∘g)′ = f′(g(x)) · g′(x)', 'derivar de fuera hacia dentro'], g: g };
    },
    ca2_tangente: function (k, r) {
      var x0 = E(r, -2, 2), f = function (x) { return .35 * x * x; }, m = .7 * x0, E0 = EJES(k, { ox: 300, oy: 290, sx: 40, sy: 32, x0: -6.5, x1: 6.5, y0: -1, y1: 8 });
      var g = E0.g + PLOT(E0, f, -5, 5, k.i, 3.5) + PLOT(E0, function (x) { return f(x0) + m * (x - x0); }, x0 - 4, x0 + 4, k.a, 3.5);
      g += PG([[E0.X(x0), E0.Y(f(x0))], [E0.X(x0 + 2), E0.Y(f(x0))], [E0.X(x0 + 2), E0.Y(f(x0) + 2 * m)]], k.s2, 'none') + DL(E0.X(x0), E0.Y(f(x0)), E0.X(x0 + 2), E0.Y(f(x0)), k.b) + DL(E0.X(x0 + 2), E0.Y(f(x0)), E0.X(x0 + 2), E0.Y(f(x0) + 2 * m), k.b);
      g += DOT(E0.X(x0), E0.Y(f(x0)), k.a, 7) + TX(k, E0.X(x0) - 10, E0.Y(f(x0)) - 12, 'P', { s: 16, w: 700, a: 'end' }) + RE(20, 14, 210, 32, '#fff', k.i, 1, 8) + TX(k, 125, 36, "m = f′(" + x0 + ') = ' + nf(m), { s: 16, w: 700, c: k.a });
      return { t: 'La recta tangente', cap: ["y − f(a) = f′(a)(x − a)"], g: g };
    },
    ca2_optim: function (k) {
      var g = '';
      g += RE(40, 90, 180, 120, clr(k.b, .6), k.i, 2.5, 4) + PA('M40,90 L220,90 L220,210 L40,210 Z', 'none', k.i, 4, ' stroke-dasharray="3 7"') + TX(k, 130, 230, 'x', { s: 18, it: true }) + TX(k, 230, 155, '10 − x', { s: 16, it: true, a: 'start' }) + TX(k, 130, 158, 'A = x(10 − x)', { s: 15, w: 700 }) + TX(k, 130, 70, '20 m de valla', { s: 15, w: 700 });
      var E0 = EJES(k, { ox: 330, oy: 300, sx: 24, sy: 10, x0: 0, x1: 10.5, y0: 0, y1: 27, num: 2, numy: 5, nx: 'x', ny: 'A' });
      g += E0.g + PLOT(E0, function (x) { return x * (10 - x); }, 0, 10, k.a, 3.5) + DL(E0.X(5), E0.Y(0), E0.X(5), E0.Y(25), k.i) + DOT(E0.X(5), E0.Y(25), k.b, 7) + TX(k, E0.X(5) + 10, E0.Y(25) - 6, 'máx: x = 5 → 25 m²', { s: 14, w: 700, a: 'start' });
      return { t: 'El mejor rectángulo', cap: ["A′(x) = 0 → x = 5", "A″(x) < 0 → máximo"], g: g };
    },
    ca3_primitivas: function (k) {
      var E0 = EJES(k, { ox: 300, oy: 180, sx: 55, sy: 26, x0: -3.2, x1: 3.2, y0: -5.5, y1: 5.5, numy: 2 }), g = E0.g, F = function (x) { return x * x * x / 6 - x; };
      [-3, -1.5, 0, 1.5, 3].forEach(function (c, i) {
        g += PLOT(E0, function (x) { return F(x) + c; }, -3.2, 3.2, c ? k.a : k.b, c ? 2.4 : 4, c ? ' opacity=".55"' : '');
        var x1 = 2, y1 = F(x1) + c, m = x1 * x1 / 2 - 1; g += L(E0.X(x1 - .35), E0.Y(y1 - .35 * m), E0.X(x1 + .35), E0.Y(y1 + .35 * m), k.i, 2.4);
        g += TX(k, E0.X(-3.1), E0.Y(F(-3.1) + c) + 5, 'C = ' + nf(c), { s: 12, a: 'start' });
      });
      g += TX(k, 470, 320, 'en x = 2 todas tienen la misma pendiente', { s: 13 });
      return { t: 'Una familia de primitivas', cap: ['∫ f(x) dx = F(x) + C', 'F′(x) = f(x)'], g: g };
    },
    ca3_definida: function (k, r) {
      var n = H.pick(r, [6, 8, 10]), a = 1, b = 9, f = function (x) { return .06 * x * x + 1; }, E0 = EJES(k, { ox: 50, oy: 300, sx: 48, sy: 40, x0: 0, x1: 10.5, y0: 0, y1: 6.5 }), g = E0.g, w = (b - a) / n;
      for (var i = 0; i < n; i++) { var x = a + i * w, y = f(x + w / 2); g += RE(E0.X(x), E0.Y(y), w * 48, y * 40, i % 2 ? k.s2 : clr(k.a, .6), k.a, 1.3); }
      g += PLOT(E0, f, 0, 10.2, k.i, 3.5) + TX(k, E0.X(a), E0.Y(0) + 34, 'a', { s: 16, it: true, w: 700 }) + TX(k, E0.X(b), E0.Y(0) + 34, 'b', { s: 16, it: true, w: 700 });
      g += RE(80, 14, 260, 34, '#fff', k.i, 1, 8) + TX(k, 210, 37, n + ' rectángulos · n → ∞ da el área exacta', { s: 14, w: 700 });
      return { t: 'Sumas de Riemann', cap: ['∫ₐᵇ f(x) dx = F(b) − F(a)', 'regla de Barrow'], g: g };
    },
    ca3_area: function (k, r) {
      var c = E(r, 2, 3), E0 = EJES(k, { ox: 70, oy: 300, sx: 130, sy: 30, x0: -.3, x1: c + .5, y0: -.5, y1: c * c + .5, num: 1, numy: c > 2 ? 3 : 2 }), g = E0.g, pts = [], i;
      for (i = 0; i <= 40; i++) { var x = c * i / 40; pts.push([E0.X(x), E0.Y(c * x)]); }
      for (i = 40; i >= 0; i--) { var x2 = c * i / 40; pts.push([E0.X(x2), E0.Y(x2 * x2)]); }
      g += PG(pts, clr(k.a, .45), 'none') + PLOT(E0, function (x) { return c * x; }, 0, c + .3, k.b, 3.5) + PLOT(E0, function (x) { return x * x; }, 0, c + .2, k.a, 3.5);
      g += TX(k, E0.X(c * .55), E0.Y(c * c * .55) - 12, 'y = ' + c + 'x', { s: 15, w: 700, c: k.b, a: 'end' }) + TX(k, E0.X(c) + 8, E0.Y(c * c) + 30, 'y = x²', { s: 15, w: 700, c: k.a, a: 'start' }) + TX(k, 430, 60, 'A = ∫₀^' + c + ' (' + c + 'x − x²) dx', { s: 16, w: 700 });
      return { t: 'Área entre dos curvas', cap: ['A = ∫ (arriba − abajo) dx', 'primero, los puntos de corte'], g: g };
    },
    ca3_asintotas: function (k, r) {
      var c = E(r, -2, 2), a = E(r, -1, 2), E0 = EJES(k, { ox: 300, oy: 170, sx: 30, x0: -9, x1: 9, y0: -5, y1: 5.2 }), f = function (x) { return a + 2 / (x - c); };
      var g = E0.g + DL(E0.X(c), E0.Y(5.2), E0.X(c), E0.Y(-5), k.b, 2) + DL(E0.X(-9), E0.Y(a), E0.X(9), E0.Y(a), k.b, 2) + PLOT(E0, f, -9, c - .05, k.a, 3.5) + PLOT(E0, f, c + .05, 9, k.a, 3.5);
      g += TX(k, E0.X(c) + 8, 34, 'x = ' + c, { s: 15, w: 700, c: k.b, a: 'start' }) + TX(k, E0.X(8.8), E0.Y(a) - 10, 'y = ' + a, { s: 15, w: 700, c: k.b, a: 'end' });
      return { t: 'Asíntotas', cap: ['vertical: el denominador se anula', 'horizontal: límite en ∞'], g: g };
    },
    ca4_edo: function (k) {
      var E0 = EJES(k, { ox: 60, oy: 300, sx: 60, sy: 26, x0: 0, x1: 8.4, y0: 0, y1: 10.5, nx: 't', numy: 2 }), g = E0.g;
      g += PLOT(E0, function (t) { return Math.exp(.35 * t); }, 0, 8, k.a, 3.5) + PLOT(E0, function (t) { return 8 * Math.exp(-.35 * t); }, 0, 8, k.b, 3.5);
      var th = Math.log(2) / .35; g += DL(E0.X(th), E0.Y(0), E0.X(th), E0.Y(4), k.i) + DL(E0.X(0), E0.Y(4), E0.X(th), E0.Y(4), k.i) + TX(k, E0.X(th), E0.Y(0) + 34, 'semivida', { s: 13 });
      g += TX(k, E0.X(6.6), E0.Y(10) + 4, 'k > 0: crece', { s: 15, w: 700, c: k.a, a: 'end' }) + TX(k, E0.X(6.5), E0.Y(1.2) - 10, 'k < 0: decrece', { s: 15, w: 700, c: k.b });
      return { t: 'Crecer y decrecer', cap: ["y′ = k·y → y = y₀·eᵏᵗ", 'interés, población, carbono 14'], g: g };
    },
    ca4_series: function (k) {
      var x = 40, y = 30, w = 270, h = 270, g = '', lab = ['1/2', '1/4', '1/8', '1/16', '1/32', '1/64'];
      for (var i = 0; i < 7; i++) {
        var c = i % 2 ? clr(k.b, .2 + i * .1) : clr(k.a, .15 + i * .1);
        if (i % 2 === 0) { g += RE(x, y, w / 2, h, c, '#fff', 2); if (i < 6) g += TX(k, x + w / 4, y + h / 2 + 7, lab[i], { s: Math.max(11, 24 - i * 3), w: 700 }); x += w / 2; w /= 2; }
        else { g += RE(x, y, w, h / 2, c, '#fff', 2); if (i < 6) g += TX(k, x + w / 2, y + h / 4 + 6, lab[i], { s: Math.max(11, 24 - i * 3), w: 700 }); y += h / 2; h /= 2; }
      }
      g += RE(40, 30, 270, 270, 'none', k.i, 2.5);
      g += TX(k, 460, 140, '1/2 + 1/4 + 1/8 + … = 1', { s: 20, w: 700, c: k.a }) + TX(k, 460, 180, 'infinitos trozos, área finita', { s: 14 });
      return { t: 'Una suma infinita que vale 1', cap: ['S = a₁ ÷ (1 − r), |r| < 1', 'converge / diverge'], g: g };
    },
    ca4_taylor: function (k) {
      var E0 = EJES(k, { ox: 250, oy: 290, sx: 90, sy: 30, x0: -2.4, x1: 3.3, y0: -1, y1: 8.8, numy: 2 }), g = E0.g;
      g += PLOT(E0, function (x) { return 1 + x; }, -2.4, 3.3, clr(k.b, .2), 2.5, ' stroke-dasharray="7 5"') + PLOT(E0, function (x) { return 1 + x + x * x / 2; }, -2.4, 3.3, k.b, 2.5, ' stroke-dasharray="3 4"') + PLOT(E0, function (x) { return 1 + x + x * x / 2 + x * x * x / 6; }, -2.4, 3.3, k.a, 3) + PLOT(E0, Math.exp, -2.4, 2.2, k.i, 4);
      g += TX(k, 30, 30, 'eˣ', { s: 16, w: 700, a: 'start' }) + TX(k, 30, 54, 'grado 1: 1 + x', { s: 13, a: 'start', c: k.b }) + TX(k, 30, 76, 'grado 2: + x²/2', { s: 13, a: 'start', c: k.b }) + TX(k, 30, 98, 'grado 3: + x³/6', { s: 13, a: 'start', c: k.a });
      return { t: 'Aproximar con polinomios', cap: ['eˣ ≈ 1 + x + x²/2 + x³/6', 'más términos, menos error'], g: g };
    },
    ca4_varias: function (k) {
      var g = '', cx = 280, cy = 170;
      for (var i = 6; i >= 1; i--) g += EL(cx, cy, i * 40, i * 24, clr(k.a, .15 + (6 - i) * .12), k.a, 1.5) + TX(k, cx + i * 40 - 4, cy - 4, String(7 - i) + '00 m', { s: 11, a: 'end' });
      g += DOT(cx, cy, k.b, 6) + TX(k, cx, cy - 12, 'cima', { s: 13, w: 700 });
      g += FL(cx + 190, cy + 90, cx + 130, cy + 50, k.b, 3.5) + FL(cx - 200, cy - 20, cx - 140, cy - 10, k.b, 3.5) + TX(k, 540, 300, '∇f: dirección de máxima subida', { s: 14, w: 700, c: k.b, a: 'end' });
      return { t: 'Curvas de nivel', cap: ['∂f/∂x y ∂f/∂y', '∇f ⟂ curvas de nivel'], g: g };
    }
  };

  /* ─────────── utilidades ─────────── */
  function dibujar(u, C, clave, st) {
    var f = FIG[u.id]; if (!f) return null;
    var r = H.rng(H.hash(u.id + ':' + clave) + (C.semilla || 1) * 131), R0 = f(K(C), r, C);
    return { t: R0.t, cap: R0.cap || [], svg: svg(R0.g, st) };
  }
  function caps(C, c) { var T = C.T; return c.length ? '<div style="display:flex;flex-wrap:wrap;gap:1.5mm 2mm;justify-content:center;margin-top:2mm">' + c.map(function (x) { return '<span style="padding:.8mm 3mm;border-radius:99px;background:' + T.soft2 + ';color:' + T.ink + ';font-size:.84em;font-weight:600">' + esc(x) + '</span>'; }).join('') + '</div>' : ''; }
  function limpioT(u, C) { return H.sub(u.t, C).replace(/^Nivel \d · /, ''); }
  var HUECO = /<div style="height:(\d+(?:\.\d+)?)mm;border:0\.5mm dashed[^"]*">[^<]*<\/div>/;
  var MARCA = 'margin:4mm 0;display:flex;justify-content:center">';

  function post(h, pg, C) {
    if (pg.tipo === 'ejemplo') h = h.replace(/(en clase de )([^,<]+)(,)/, function (m, a, b, c) { return a + b.toLowerCase() + c; });
    var u = pg.u; if (!u || !FIG[u.id]) return h;
    if (pg.tipo === 'explica') {
      var i = h.indexOf(MARCA), j = i < 0 ? -1 : h.indexOf('</svg>', i);
      if (i >= 0 && j > i) { var d = dibujar(u, C, 'explica'); h = h.slice(0, i + MARCA.length) + '<div style="width:100%">' + d.svg + caps(C, d.cap) + '</div>' + h.slice(j + 6); }
    } else if (pg.tipo === 'apertura') {
      var m = HUECO.exec(h);
      if (m) { var d2 = dibujar(u, C, 'apertura', 'height:' + (+m[1] - 6) + 'mm;width:auto;max-width:100%'); h = h.replace(HUECO, '<div style="height:' + m[1] + 'mm;display:flex;align-items:center;justify-content:center;background:' + C.T.soft2 + ';border-radius:' + C.T.r + 'px;overflow:hidden">' + d2.svg + '</div>'); }
    } else if (pg.tipo === 'ejemplo') {
      var p = h.indexOf('<p style="margin:0 0 3mm">');
      if (p >= 0) { var d3 = dibujar(u, C, 'ejemplo', 'width:100%'); h = h.slice(0, p) + '<div style="float:right;width:74mm;margin:0 0 2mm 5mm">' + d3.svg + '<div style="font-size:.78em;text-align:center;opacity:.8;margin-top:1mm">' + esc(d3.t) + '</div></div>' + h.slice(p); }
    }
    return h;
  }
  ED.registrar({ post: post });

  /* ─────────── páginas visuales ─────────── */
  function items(u, C, r, n) { var g = MP.GEN[u.g], o = []; for (var i = 0; i < n && g; i++) { var x = g(u, C, r); x.e = H.sub(x.e, C); o.push(x); } return o; }
  SV.visual('geo_mira', function (u, C, r) {
    if (!FIG[u.id]) return null;
    var d = dibujar(u, C, 'mira:' + H.ent(r, 1, 999));
    return { t: 'Mira y resuelve: ' + d.t.toLowerCase(), intro: H.sub((u.i || [])[1] || (u.i || [''])[0], C), fig: '<div style="max-width:150mm;margin:0 auto">' + d.svg + caps(C, d.cap) + '</div>', items: items(u, C, r, 3) };
  }, { materias: /^(geoalg|calculo)$/, max: 2 });
  SV.visual('geo_paso', function (u, C, r) {
    if (!FIG[u.id] || !MP.GEN[u.g]) return null;
    var T = C.T, x = items(u, C, r, 1)[0], d = dibujar(u, C, 'paso:' + H.ent(r, 1, 999), 'width:100%');
    var pasos = String(x.x || '').split(/\s+→\s+|\.\s+(?=[A-ZÁÉÍÓÚÑ¿(])/).map(function (s) { return s.replace(/\.$/, ''); }).filter(Boolean);
    var html = '<div style="display:grid;grid-template-columns:minmax(0,1fr) 72mm;gap:6mm;align-items:start">' +
      '<div><div style="font-weight:700;margin:0 0 3mm">' + x.e + '</div>' + pasos.map(function (s, i) { return '<div style="display:flex;gap:3mm;margin:0 0 2.5mm"><span style="flex:none;width:7mm;height:7mm;border-radius:50%;background:' + T.acc + ';color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.85em">' + (i + 1) + '</span><span style="flex:1">' + esc(s) + '.</span></div>'; }).join('') +
      '<div style="margin-top:3mm;padding:2.5mm 4mm;border-radius:' + T.r + 'px;background:' + T.soft + ';font-weight:700">Resultado: ' + esc(x.s) + '</div></div>' +
      '<div>' + d.svg + caps(C, d.cap.slice(0, 2)) + '</div></div>';
    return { t: 'Paso a paso: ' + limpioT(u, C).toLowerCase(), intro: 'Lee cada paso, tapa la solución y repítelo tú solo con los ejercicios de abajo.', fig: html, items: items(u, C, r, 2) };
  }, { materias: /^(geoalg|calculo)$/, max: 2 });

  window.EU_GEO_VISUAL = { FIG: FIG, dibujar: dibujar };
})();
