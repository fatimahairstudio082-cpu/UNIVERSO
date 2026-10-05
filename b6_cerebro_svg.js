/* b6_cerebro_svg.js — Cerebro SVG: biblioteca de dibujos y gráficas del Estudio.
   · window.EU_SVG: funciones, barras, sectores, cuerpos geométricos (2D línea / 3D sólido),
     reloj, esquema con huecos, infografía y mosaicos. Todo se dibuja con los colores del diseño.
   · Se engancha al Editorial envolviendo EU_EDITORIAL.ensamblar (no toca el motor):
       1. Quita ejercicios repetidos en todo el libro y los cambia por variantes nuevas.
       2. Convierte páginas de relleno en páginas visuales: gráficas y cálculo, esquemas,
          ordenar pasos, sopa de letras (EU_SOPA), cuerpos 3D / dibujo técnico, infografía.
       3. Libros infantiles: páginas repetidas → mandalas nuevos, mosaicos, cuerpos para
          colorear, trazos; y un glosario ilustrado «Mis palabras» (usa EU_INFANTIL).
       4. Libros largos con pocas unidades: amplía con unidades de cursos vecinos.
       5. Rehace el solucionario con los ejercicios finales. */
(function () {
  var ED = window.EU_EDITORIAL;
  if (!ED || ED._svg) return;
  ED._svg = true;
  var H = ED.H, esc = H.esc, CU = window.EU_CURRICULO;

  /* ─────────── utilidades de dibujo ─────────── */
  var NS = 'xmlns="http://www.w3.org/2000/svg"', uid = 0;
  function r1(n) { return Math.round(n * 10) / 10; }
  function svg(w, h, body, maxw) { return '<svg ' + NS + ' data-plano="1" viewBox="0 0 ' + w + ' ' + h + '" style="width:100%;max-width:' + (maxw || w) + 'px;height:auto;display:block;margin:0 auto">' + body + '</svg>'; }
  function tx(x, y, s, o) { o = o || {}; return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || 'middle') + '" font-size="' + (o.s || 13) + '" font-family="' + esc(o.f || 'sans-serif') + '" font-weight="' + (o.w || 400) + '" fill="' + (o.c || '#222') + '">' + esc(s) + '</text>'; }
  function rgb(c) { c = String(c || '#888').replace('#', ''); if (c.length === 3) c = c.replace(/./g, '$&$&'); var A = [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]; return A.some(isNaN) ? [136, 136, 136] : A; }
  function hex(A) { return '#' + A.map(function (v) { return Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'); }).join(''); }
  function osc(c, k) { return hex(rgb(c).map(function (v) { return v * (1 - k); })); }
  function clr(c, k) { return hex(rgb(c).map(function (v) { return v + (255 - v) * k; })); }
  function es3d(C) { return C.prem ? C.prem.dibujo === '3d' : (((C.cfg && C.cfg.acab) || {}).dibujo || '3d') === '3d'; }
  function paleta(C) { var T = C.T; return [T.acc, T.acc2, osc(T.acc, .35), clr(T.acc2, .3), clr(T.acc, .42), osc(T.acc2, .32)]; }
  function fmt(n) { return String(Math.round(n * 100) / 100).replace('.', ','); }
  function poly(pts, at) { return '<polygon points="' + pts.map(function (p) { return r1(p[0]) + ',' + r1(p[1]); }).join(' ') + '" ' + at + '/>'; }

  /* Gráfica de funciones: ejes, cuadrícula, curvas, puntos, tangente y área. */
  function funcion(C, o) {
    var T = C.T, F = T.cuerpo, W = o.W || 320, Hh = o.H || 280, m = 26, x0 = o.x[0], x1 = o.x[1], y0 = o.y[0], y1 = o.y[1];
    var X = function (x) { return m + (x - x0) / (x1 - x0) * (W - 2 * m); }, Y = function (y) { return Hh - m - (y - y0) / (y1 - y0) * (Hh - 2 * m); };
    var id = 'euf' + (++uid), out = '<defs><clipPath id="' + id + '"><rect x="' + m + '" y="' + m + '" width="' + (W - 2 * m) + '" height="' + (Hh - 2 * m) + '"/></clipPath></defs>';
    var paso = (x1 - x0) > 16 ? 5 : (x1 - x0) > 8 ? 2 : 1, pasoY = (y1 - y0) > 16 ? 5 : (y1 - y0) > 8 ? 2 : 1;
    for (var gx = Math.ceil(x0); gx <= x1; gx++) out += '<line x1="' + r1(X(gx)) + '" y1="' + m + '" x2="' + r1(X(gx)) + '" y2="' + (Hh - m) + '" stroke="' + T.soft + '" stroke-width="' + (gx % paso ? .6 : 1) + '"/>';
    for (var gy = Math.ceil(y0); gy <= y1; gy++) out += '<line x1="' + m + '" y1="' + r1(Y(gy)) + '" x2="' + (W - m) + '" y2="' + r1(Y(gy)) + '" stroke="' + T.soft + '" stroke-width="' + (gy % pasoY ? .6 : 1) + '"/>';
    var ax = Y(Math.max(y0, Math.min(y1, 0))), ay = X(Math.max(x0, Math.min(x1, 0)));
    out += '<line x1="' + (m - 6) + '" y1="' + r1(ax) + '" x2="' + (W - m + 10) + '" y2="' + r1(ax) + '" stroke="' + T.ink + '" stroke-width="1.6"/>' + poly([[W - m + 14, ax], [W - m + 5, ax - 4], [W - m + 5, ax + 4]], 'fill="' + T.ink + '"');
    out += '<line x1="' + r1(ay) + '" y1="' + (Hh - m + 6) + '" x2="' + r1(ay) + '" y2="' + (m - 10) + '" stroke="' + T.ink + '" stroke-width="1.6"/>' + poly([[ay, m - 14], [ay - 4, m - 5], [ay + 4, m - 5]], 'fill="' + T.ink + '"');
    out += tx(W - m + 12, ax + 16, 'x', { f: F, s: 12, c: T.ink }) + tx(ay + 10, m - 8, 'y', { f: F, s: 12, c: T.ink, a: 'start' });
    for (var lx = Math.ceil(x0 / paso) * paso; lx <= x1; lx += paso) if (lx) out += tx(X(lx), ax + 13, lx, { f: F, s: 10, c: T.ink });
    for (var ly = Math.ceil(y0 / pasoY) * pasoY; ly <= y1; ly += pasoY) if (ly) out += tx(ay - 5, Y(ly) + 3.5, ly, { f: F, s: 10, c: T.ink, a: 'end' });
    var g = '<g clip-path="url(#' + id + ')">', d3 = es3d(C);
    if (o.area) {
      var a = o.area, pts = [[X(a.a), Y(0)]];
      for (var i = 0; i <= 60; i++) { var xa = a.a + (a.b - a.a) * i / 60; pts.push([X(xa), Y(a.f(xa))]); }
      pts.push([X(a.b), Y(0)]);
      g += poly(pts, 'fill="' + (a.c || T.acc2) + '" fill-opacity=".28" stroke="none"');
    }
    (o.fs || []).forEach(function (fn, k) {
      var col = fn.c || (k ? T.acc2 : T.acc), dd = '', ant = false;
      for (var i = 0; i <= 240; i++) {
        var x = x0 + (x1 - x0) * i / 240, y = fn.f(x);
        if (!isFinite(y) || y > y1 + (y1 - y0) || y < y0 - (y1 - y0)) { ant = false; continue; }
        dd += (ant ? 'L' : 'M') + r1(X(x)) + ',' + r1(Y(y)); ant = true;
      }
      if (d3) g += '<path d="' + dd + '" fill="none" stroke="#000" stroke-opacity=".16" stroke-width="5" transform="translate(1.6 2.4)"/>';
      g += '<path d="' + dd + '" fill="none" stroke="' + col + '" stroke-width="' + (fn.w || 2.8) + '" stroke-linecap="round"' + (fn.dash ? ' stroke-dasharray="6 5"' : '') + '/>';
    });
    g += '</g>';
    out += g;
    (o.pts || []).forEach(function (p) {
      if (p[0] < x0 || p[0] > x1 || p[1] < y0 || p[1] > y1) return;
      out += (d3 ? '<circle cx="' + r1(X(p[0]) + 1.2) + '" cy="' + r1(Y(p[1]) + 1.8) + '" r="5" fill="#000" fill-opacity=".2"/>' : '') + '<circle cx="' + r1(X(p[0])) + '" cy="' + r1(Y(p[1])) + '" r="4.6" fill="' + (p[3] || T.acc2) + '" stroke="#fff" stroke-width="1.4"/>';
      if (p[2]) out += tx(X(p[0]) + 7, Y(p[1]) - 7, p[2], { f: F, s: 11, c: T.ink, w: 700, a: 'start' });
    });
    (o.etq || []).forEach(function (e, k) { out += tx(m + 6, m + 14 + k * 16, e[0], { f: F, s: 12.5, c: e[1] || T.acc, w: 700, a: 'start' }); });
    return svg(W, Hh, out, o.max || W);
  }

  /* Barras (3D: prismas con cara superior y lateral). */
  function barras(C, o) {
    var T = C.T, F = T.cuerpo, cats = o.cats, vals = o.vals, n = cats.length, W = 540, Hh = 290, ml = 40, mb = 44, mt = 18;
    var max = o.max || Math.ceil(Math.max.apply(null, vals) / 2) * 2 + 2, bw = (W - ml - 20) / n, d3 = es3d(C), dx = d3 ? 11 : 0, dy = d3 ? 8 : 0, pal = paleta(C), out = '';
    var Y = function (v) { return Hh - mb - v / max * (Hh - mb - mt - dy); };
    var paso = max > 20 ? 5 : max > 10 ? 2 : 1;
    for (var v = 0; v <= max; v += paso) out += '<line x1="' + ml + '" y1="' + r1(Y(v)) + '" x2="' + (W - 10) + '" y2="' + r1(Y(v)) + '" stroke="' + T.soft + '"/>' + tx(ml - 6, Y(v) + 4, v, { f: F, s: 10.5, c: T.ink, a: 'end' });
    vals.forEach(function (v, i) {
      var c = o.uno ? T.acc : pal[i % pal.length], x = ml + i * bw + bw * .2, w = bw * .6 - dx, yT = Y(v), yB = Y(0);
      if (d3) {
        out += poly([[x + w, yB], [x + w + dx, yB - dy], [x + w + dx, yT - dy], [x + w, yT]], 'fill="' + osc(c, .3) + '"');
        out += poly([[x, yT], [x + dx, yT - dy], [x + w + dx, yT - dy], [x + w, yT]], 'fill="' + clr(c, .35) + '"');
      }
      out += '<rect x="' + r1(x) + '" y="' + r1(yT) + '" width="' + r1(w) + '" height="' + r1(Math.max(0, yB - yT)) + '" fill="' + c + '"/>';
      if (o.valores) out += tx(x + w / 2 + dx / 2, yT - dy - 5, v, { f: F, s: 11, c: T.ink, w: 700 });
      H.limpio(cats[i]).split(' ').reduce(function (acc, p) { var l = acc[acc.length - 1]; if (l && (l + ' ' + p).length <= 12) acc[acc.length - 1] = l + ' ' + p; else acc.push(p); return acc; }, []).slice(0, 2)
        .forEach(function (l, k) { out += tx(x + w / 2, Hh - mb + 16 + k * 13, l, { f: F, s: 11, c: T.ink }); });
    });
    out += '<line x1="' + ml + '" y1="' + (Hh - mb) + '" x2="' + (W - 10) + '" y2="' + (Hh - mb) + '" stroke="' + T.ink + '" stroke-width="1.6"/>';
    if (o.unidad) out += tx(ml - 30, mt - 4, o.unidad, { f: F, s: 10.5, c: T.acc, w: 700, a: 'start' });
    return svg(W, Hh, out, o.max_px || 520);
  }

  /* Sectores (3D: disco con canto). */
  function sectores(C, o) {
    var T = C.T, F = T.cuerpo, vals = o.vals, tot = vals.reduce(function (s, v) { return s + v; }, 0), pal = paleta(C), d3 = es3d(C);
    var cx = 150, cy = 130, R = 105, ky = d3 ? .58 : 1, prof = d3 ? 18 : 0, out = '', ang = -Math.PI / 2;
    var arco = function (a1, a2, dy, col) {
      var p1 = [cx + R * Math.cos(a1), cy + dy + R * ky * Math.sin(a1)], p2 = [cx + R * Math.cos(a2), cy + dy + R * ky * Math.sin(a2)];
      return '<path d="M' + cx + ',' + (cy + dy) + ' L' + r1(p1[0]) + ',' + r1(p1[1]) + ' A' + R + ',' + r1(R * ky) + ' 0 ' + (a2 - a1 > Math.PI ? 1 : 0) + ' 1 ' + r1(p2[0]) + ',' + r1(p2[1]) + ' Z" fill="' + col + '" stroke="#fff" stroke-width="' + (dy ? 0 : 1.5) + '"/>';
    };
    var trozos = vals.map(function (v, i) { var a1 = ang, a2 = ang + v / tot * Math.PI * 2; ang = a2; return [a1, a2, pal[i % pal.length]]; });
    if (d3) for (var d = prof; d > 0; d -= 2) trozos.forEach(function (t) { out += arco(t[0], t[1], d, osc(t[2], .3)); });
    trozos.forEach(function (t, i) {
      out += arco(t[0], t[1], 0, t[2]);
      var am = (t[0] + t[1]) / 2, pc = Math.round(vals[i] / tot * 100);
      if (pc >= 6) out += tx(cx + R * .62 * Math.cos(am), cy + R * ky * .62 * Math.sin(am) + 4, pc + ' %', { f: F, s: 12, c: '#fff', w: 700 });
    });
    (o.cats || []).forEach(function (c, i) { out += '<rect x="290" y="' + (40 + i * 26) + '" width="14" height="14" rx="2" fill="' + pal[i % pal.length] + '"/>' + tx(312, 52 + i * 26, c, { f: F, s: 12.5, c: T.ink, a: 'start' }); });
    return svg(470, 260 + prof, out, 470);
  }

  /* Cuerpos geométricos en perspectiva isométrica. modo: 'solido' (3D con luz) | 'linea' (para colorear o dibujo técnico). */
  function cuerpo(C, o) {
    var T = C.T, F = T.cuerpo, t = o.t || 'cubo', a = o.a || 3, b = o.b || a, c = o.c || a, lin = o.modo === 'linea' || !es3d(C) && o.modo !== 'solido';
    var u = o.u || Math.min(34, 190 / Math.max(a + b, c * 1.6)), ox = 180, oy = 60 + c * u + Math.max(a, b) * u * .1;
    var P = function (x, y, z) { return [ox + (x - y) * .866 * u, oy + (x + y) * .5 * u - z * u]; };
    var base = o.color || T.acc, st = 'stroke="' + T.ink + '" stroke-width="' + (lin ? 2.4 : 1.4) + '" stroke-linejoin="round"';
    var cara = function (pts, k) { return poly(pts, 'fill="' + (lin ? '#fff' : k === 0 ? clr(base, .5) : k === 1 ? base : osc(base, .28)) + '" ' + st); };
    var oculto = function (p, q) { return '<line x1="' + r1(p[0]) + '" y1="' + r1(p[1]) + '" x2="' + r1(q[0]) + '" y2="' + r1(q[1]) + '" stroke="' + T.ink + '" stroke-width="1" stroke-dasharray="4 4" opacity=".55"/>'; };
    var out = '', sombra = lin ? '' : '<ellipse cx="' + ox + '" cy="' + r1(oy + (a + b) * .5 * u * .5 + 14) + '" rx="' + r1((a + b) * .6 * u) + '" ry="' + r1((a + b) * .16 * u) + '" fill="#000" opacity=".12"/>';
    out += sombra;
    if (t === 'cubo' || t === 'prisma') {
      out += oculto(P(0, 0, 0), P(a, 0, 0)) + oculto(P(0, 0, 0), P(0, b, 0)) + oculto(P(0, 0, 0), P(0, 0, c));
      out += cara([P(0, 0, c), P(a, 0, c), P(a, b, c), P(0, b, c)], 0) + cara([P(a, 0, 0), P(a, b, 0), P(a, b, c), P(a, 0, c)], 1) + cara([P(0, b, 0), P(a, b, 0), P(a, b, c), P(0, b, c)], 2);
      if (o.cotas) {
        var pa = P(a / 2, b, 0), pb = P(a, b / 2, 0), pc = P(0, b, c / 2);
        out += tx(pa[0] - 14, pa[1] + 22, o.cotas[0], { f: F, s: 13, c: T.acc2, w: 700 }) + tx(pb[0] + 16, pb[1] + 20, o.cotas[1], { f: F, s: 13, c: T.acc2, w: 700 }) + tx(pc[0] - 14, pc[1] + 4, o.cotas[2], { f: F, s: 13, c: T.acc2, w: 700, a: 'end' });
      }
    } else if (t === 'piramide') {
      var ap = P(a / 2, a / 2, c);
      out += oculto(P(0, 0, 0), P(a, 0, 0)) + oculto(P(0, 0, 0), P(0, a, 0)) + oculto(P(0, 0, 0), ap);
      out += cara([P(a, 0, 0), P(a, a, 0), ap], 1) + cara([P(0, a, 0), P(a, a, 0), ap], 2);
      if (o.cotas) { var q1 = P(a / 2, a, 0), q2 = P(a / 2, a / 2, c / 2); out += tx(q1[0] - 12, q1[1] + 22, o.cotas[0], { f: F, s: 13, c: T.acc2, w: 700 }) + tx(ap[0] + 10, ap[1] - 6, 'h = ' + o.cotas[2], { f: F, s: 13, c: T.acc2, w: 700, a: 'start' }); }
    } else if (t === 'cilindro' || t === 'cono') {
      var R = a * u * .75, ry = R * .38, h = c * u, cx = ox, yb = oy + 10, yt = yb - h, gid = 'eug' + (++uid);
      var fill = lin ? '#fff' : 'url(#' + gid + ')';
      if (!lin) out += '<defs><linearGradient id="' + gid + '" x1="0" x2="1"><stop offset="0" stop-color="' + osc(base, .25) + '"/><stop offset=".45" stop-color="' + clr(base, .35) + '"/><stop offset="1" stop-color="' + osc(base, .35) + '"/></linearGradient></defs>';
      out += '<path d="M' + r1(cx - R) + ',' + r1(yb) + ' A' + r1(R) + ',' + r1(ry) + ' 0 0 0 ' + r1(cx + R) + ',' + r1(yb) + '" fill="none" stroke="' + T.ink + '" stroke-width="1" stroke-dasharray="4 4" opacity=".55"/>';
      if (t === 'cilindro') {
        out += '<path d="M' + r1(cx - R) + ',' + r1(yt) + ' L' + r1(cx - R) + ',' + r1(yb) + ' A' + r1(R) + ',' + r1(ry) + ' 0 0 0 ' + r1(cx + R) + ',' + r1(yb) + ' L' + r1(cx + R) + ',' + r1(yt) + ' Z" fill="' + fill + '" ' + st + '/>';
        out += '<ellipse cx="' + cx + '" cy="' + r1(yt) + '" rx="' + r1(R) + '" ry="' + r1(ry) + '" fill="' + (lin ? '#fff' : clr(base, .5)) + '" ' + st + '/>';
      } else out += '<path d="M' + cx + ',' + r1(yt) + ' L' + r1(cx - R) + ',' + r1(yb) + ' A' + r1(R) + ',' + r1(ry) + ' 0 0 0 ' + r1(cx + R) + ',' + r1(yb) + ' Z" fill="' + fill + '" ' + st + '/>';
      if (o.cotas) out += '<line x1="' + cx + '" y1="' + r1(yb) + '" x2="' + r1(cx + R) + '" y2="' + r1(yb) + '" stroke="' + T.acc2 + '" stroke-width="1.6"/>' + tx(cx + R / 2, yb - 5, 'r = ' + o.cotas[0], { f: F, s: 12, c: T.acc2, w: 700 }) + tx(cx + R + 10, (yb + yt) / 2, 'h = ' + o.cotas[2], { f: F, s: 13, c: T.acc2, w: 700, a: 'start' });
    } else if (t === 'esfera') {
      var Rs = a * u * .8, gs = 'eus' + (++uid), cy2 = oy - Rs * .3;
      if (!lin) out += '<defs><radialGradient id="' + gs + '" cx=".35" cy=".32" r=".75"><stop offset="0" stop-color="' + clr(base, .7) + '"/><stop offset=".55" stop-color="' + base + '"/><stop offset="1" stop-color="' + osc(base, .45) + '"/></radialGradient></defs>';
      out += '<circle cx="' + ox + '" cy="' + r1(cy2) + '" r="' + r1(Rs) + '" fill="' + (lin ? '#fff' : 'url(#' + gs + ')') + '" ' + st + '/>';
      out += '<path d="M' + r1(ox - Rs) + ',' + r1(cy2) + ' A' + r1(Rs) + ',' + r1(Rs * .3) + ' 0 0 0 ' + r1(ox + Rs) + ',' + r1(cy2) + '" fill="none" stroke="' + T.ink + '" stroke-width="1.2"/><path d="M' + r1(ox - Rs) + ',' + r1(cy2) + ' A' + r1(Rs) + ',' + r1(Rs * .3) + ' 0 0 1 ' + r1(ox + Rs) + ',' + r1(cy2) + '" fill="none" stroke="' + T.ink + '" stroke-width="1" stroke-dasharray="4 4" opacity=".5"/>';
      if (o.cotas) out += '<line x1="' + ox + '" y1="' + r1(cy2) + '" x2="' + r1(ox + Rs) + '" y2="' + r1(cy2) + '" stroke="' + T.acc2 + '" stroke-width="1.6"/>' + tx(ox + Rs / 2, cy2 - 6, 'r = ' + o.cotas[0], { f: F, s: 12, c: T.acc2, w: 700 });
    }
    return svg(360, 300, out, o.max || 340);
  }

  function reloj(C, h, m) {
    var T = C.T, F = T.cuerpo, out = '<circle cx="80" cy="80" r="70" fill="#fff" stroke="' + T.ink + '" stroke-width="3"/>';
    if (es3d(C)) out = '<circle cx="82" cy="84" r="70" fill="#000" opacity=".14"/>' + out;
    for (var i = 1; i <= 12; i++) { var a = i * Math.PI / 6 - Math.PI / 2; out += tx(80 + 55 * Math.cos(a), 84 + 55 * Math.sin(a), i, { f: F, s: 14, c: T.ink, w: 700 }); }
    for (var k = 0; k < 60; k++) { var b = k * Math.PI / 30; if (k % 5) out += '<circle cx="' + r1(80 + 66 * Math.cos(b)) + '" cy="' + r1(80 + 66 * Math.sin(b)) + '" r=".9" fill="' + T.ink + '"/>'; }
    var ah = ((h % 12) + m / 60) * Math.PI / 6 - Math.PI / 2, am = m * Math.PI / 30 - Math.PI / 2;
    out += '<line x1="80" y1="80" x2="' + r1(80 + 34 * Math.cos(ah)) + '" y2="' + r1(80 + 34 * Math.sin(ah)) + '" stroke="' + T.acc + '" stroke-width="6" stroke-linecap="round"/>';
    out += '<line x1="80" y1="80" x2="' + r1(80 + 52 * Math.cos(am)) + '" y2="' + r1(80 + 52 * Math.sin(am)) + '" stroke="' + T.acc2 + '" stroke-width="3.5" stroke-linecap="round"/><circle cx="80" cy="80" r="5" fill="' + T.ink + '"/>';
    return svg(160, 160, out, 150);
  }

  /* Infografía: ideas numeradas sobre bloques. */
  function infografia(C, ideas) {
    var T = C.T, F = T.cuerpo, n = ideas.length, W = 640, fila = 74, Hh = n * fila + 10, d3 = es3d(C), pal = paleta(C), out = '';
    out += '<line x1="42" y1="30" x2="42" y2="' + (Hh - 34) + '" stroke="' + T.soft + '" stroke-width="6" stroke-linecap="round"/>';
    ideas.forEach(function (s, i) {
      var y = 10 + i * fila, c = pal[i % pal.length];
      if (d3) {
        out += poly([[20, y + 16], [42, y + 5], [64, y + 16], [42, y + 27]], 'fill="' + clr(c, .45) + '"');
        out += poly([[20, y + 16], [42, y + 27], [42, y + 55], [20, y + 44]], 'fill="' + c + '"');
        out += poly([[42, y + 27], [64, y + 16], [64, y + 44], [42, y + 55]], 'fill="' + osc(c, .3) + '"');
        out += tx(31, y + 45, i + 1, { f: T.tit, s: 17, c: '#fff', w: 700 });
      } else out += '<circle cx="42" cy="' + (y + 30) + '" r="22" fill="' + c + '"/>' + tx(42, y + 37, i + 1, { f: T.tit, s: 19, c: '#fff', w: 700 });
      var ls = [], cur = '';
      String(s).split(' ').forEach(function (w) { if ((cur + ' ' + w).trim().length > 62 && cur) { ls.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); });
      if (cur) ls.push(cur);
      ls.slice(0, 3).forEach(function (l, k) { out += tx(84, y + 30 - (Math.min(ls.length, 3) - 1) * 8.5 + k * 17 + 4, l, { f: F, s: 14, c: T.ink, a: 'start' }); });
    });
    return svg(W, Hh, out, 660);
  }

  /* Mosaico de línea para colorear. */
  function mosaico(forma, seed, W, Hh) {
    var r = H.rng(seed), s = 24 + Math.floor(r() * 6) * 6, out = '', st = 'fill="#fff" stroke="#222" stroke-width="2.2" stroke-linejoin="round"';
    if (forma === 'triangulos') { var h = s * .866; for (var y = 0, f = 0; y < Hh; y += h, f++) for (var x = -s; x < W + s; x += s) { var o = f % 2 ? s / 2 : 0; out += poly([[x + o, y + h], [x + o + s / 2, y], [x + o + s, y + h]], st) + poly([[x + o + s / 2, y], [x + o + s * 1.5, y], [x + o + s, y + h]], st); } }
    else if (forma === 'hexagonos') { var R = s * .6, dx = R * 1.732; for (var j = 0, y2 = 0; y2 < Hh + R; j++, y2 += R * 1.5) for (var x2 = (j % 2 ? dx / 2 : 0) - dx; x2 < W + dx; x2 += dx) { var p = []; for (var k = 0; k < 6; k++) { var a = Math.PI / 6 + k * Math.PI / 3; p.push([x2 + R * Math.cos(a), y2 + R * Math.sin(a)]); } out += poly(p, st); } }
    else if (forma === 'escamas') { for (var j2 = 0, y3 = Hh; y3 > -s; j2++, y3 -= s / 2) for (var x3 = (j2 % 2 ? s / 2 : 0) - s; x3 < W + s; x3 += s) out += '<path d="M' + r1(x3) + ',' + r1(y3) + ' a' + (s / 2) + ',' + (s / 2) + ' 0 0 1 ' + s + ',0 Z" ' + st + '/>'; }
    else { for (var y4 = 0; y4 < Hh; y4 += s) for (var x4 = 0; x4 < W; x4 += s) { out += '<rect x="' + x4 + '" y="' + y4 + '" width="' + s + '" height="' + s + '" ' + st + '/>'; var q = Math.floor(r() * 3); if (q === 0) out += '<line x1="' + x4 + '" y1="' + y4 + '" x2="' + (x4 + s) + '" y2="' + (y4 + s) + '" stroke="#222" stroke-width="2.2"/>'; else if (q === 1) out += '<circle cx="' + (x4 + s / 2) + '" cy="' + (y4 + s / 2) + '" r="' + (s * .32) + '" ' + st + '/>'; else out += '<line x1="' + (x4 + s) + '" y1="' + y4 + '" x2="' + x4 + '" y2="' + (y4 + s) + '" stroke="#222" stroke-width="2.2"/>'; } }
    var deco = '', nd = 6 + Math.floor(r() * 8);
    for (var di = 0; di < nd; di++) { var dx0 = 40 + r() * (W - 80), dy0 = 40 + r() * (Hh - 80), dr = s * (.6 + r() * .9), pet = 5 + Math.floor(r() * 4); deco += '<circle cx="' + r1(dx0) + '" cy="' + r1(dy0) + '" r="' + r1(dr) + '" ' + st + '/>'; for (var pk = 0; pk < pet; pk++) { var pa = pk * 2 * Math.PI / pet; deco += '<circle cx="' + r1(dx0 + dr * .55 * Math.cos(pa)) + '" cy="' + r1(dy0 + dr * .55 * Math.sin(pa)) + '" r="' + r1(dr * .28) + '" ' + st + '/>'; } deco += '<circle cx="' + r1(dx0) + '" cy="' + r1(dy0) + '" r="' + r1(dr * .2) + '" ' + st + '/>'; }
    out += deco;
    return '<svg ' + NS + ' data-plano="1" viewBox="0 0 ' + W + ' ' + Hh + '" style="width:100%;height:auto;display:block"><defs><clipPath id="eum' + (++uid) + '"><rect width="' + W + '" height="' + Hh + '" rx="14"/></clipPath></defs><g clip-path="url(#eum' + uid + ')">' + out + '</g><rect x="1.2" y="1.2" width="' + (W - 2.4) + '" height="' + (Hh - 2.4) + '" rx="14" fill="none" stroke="#222" stroke-width="2.4"/></svg>';
  }

  /* Trazos de preescritura: modelo sólido y repaso punteado. */
  function trazos(seed, T) {
    var r = H.rng(seed), tipos = H.mezcla(r, ['zigzag', 'ondas', 'bucles', 'puentes', 'dientes', 'espiral']).slice(0, 5), out = '', W = 640, fila = 96;
    tipos.forEach(function (t, i) {
      var y = 20 + i * fila, amp = 16 + Math.floor(r() * 3) * 5, per = 40 + Math.floor(r() * 3) * 10, d = 'M20,' + (y + 40);
      for (var x = 20; x < W - 20; x += per) {
        if (t === 'zigzag') d += ' L' + (x + per / 2) + ',' + (y + 40 - amp) + ' L' + (x + per) + ',' + (y + 40);
        else if (t === 'ondas') d += ' Q' + (x + per / 4) + ',' + (y + 40 - amp * 1.6) + ' ' + (x + per / 2) + ',' + (y + 40) + ' T' + (x + per) + ',' + (y + 40);
        else if (t === 'bucles') d += ' C' + (x + per * .9) + ',' + (y + 40 - amp * 2) + ' ' + (x + per * .1) + ',' + (y + 40 - amp * 2) + ' ' + (x + per) + ',' + (y + 40);
        else if (t === 'puentes') d += ' A' + per / 2 + ',' + amp * 1.3 + ' 0 0 1 ' + (x + per) + ',' + (y + 40);
        else if (t === 'dientes') d += ' L' + x + ',' + (y + 40 - amp) + ' L' + (x + per / 2) + ',' + (y + 40 - amp) + ' L' + (x + per / 2) + ',' + (y + 40) + ' L' + (x + per) + ',' + (y + 40);
        else d += ' a' + (per / 3) + ',' + (per / 3) + ' 0 1 1 ' + (per / 2) + ',0 L' + (x + per) + ',' + (y + 40);
      }
      out += '<line x1="12" y1="' + (y + 40) + '" x2="' + (W - 12) + '" y2="' + (y + 40) + '" stroke="' + T.soft + '" stroke-width="1.4"/>';
      out += '<path d="' + d + '" fill="none" stroke="#B9B9B9" stroke-width="3.2" stroke-dasharray="2 7" stroke-linecap="round"/>';
      out += '<g clip-path="url(#eut' + (uid + 1) + '_' + i + ')"><path d="' + d + '" fill="none" stroke="' + T.acc + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g>';
      out += '<defs><clipPath id="eut' + (uid + 1) + '_' + i + '"><rect x="0" y="' + (y - 20) + '" width="' + (20 + per * 1.02) + '" height="' + fila + '"/></clipPath></defs>';
      out += '<circle cx="20" cy="' + (y + 40) + '" r="6" fill="' + T.acc2 + '"/>';
    });
    uid++;
    return svg(W, tipos.length * fila + 20, out, 680);
  }

  window.EU_SVG = { funcion: funcion, barras: barras, sectores: sectores, cuerpo: cuerpo, reloj: reloj, infografia: infografia, mosaico: mosaico, trazos: trazos, paleta: paleta, osc: osc, clr: clr };

  /* ─────────── generadores de páginas visuales ─────────── */
  var it = H.it, S = function (s, C) { return H.sub(s, C); };
  function nb(C) { return C.bnd || 'pri2'; }
  function esPeq(C) { return /^(inf|pri1|pri2)$/.test(nb(C)); }
  function hueco() { return '<span style="display:inline-block;min-width:22mm;border-bottom:1.5px solid currentColor">&#160;</span>'; }

  function genGrafica(u, C, r) {
    var b = nb(C), E = H.ent, fig, items = [], tit = 'Lee la gráfica', intro = '';
    if (b === 'inf' || b === 'pri1' || b === 'pri2' && r() < 0.4) {
      var hs = [E(r, 1, 12), E(r, 1, 12)], ms = b === 'inf' ? [0, 0] : [H.pick(r, [0, 30]), H.pick(r, [0, 15, 30, 45])];
      fig = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10mm;max-width:130mm;margin:0 auto">' + reloj(C, hs[0], ms[0]) + reloj(C, hs[1], ms[1]) + '</div>';
      var hora = function (h, m) { return h + ':' + String(m).padStart(2, '0'); };
      items = [it('corta', '¿Qué hora marca el primer reloj?', hora(hs[0], ms[0]), { ac: [hora(hs[0], ms[0]), hs[0] + (ms[0] ? '' : ''), hs[0] + ' y ' + ms[0]] }), it('corta', '¿Qué hora marca el segundo reloj?', hora(hs[1], ms[1]), { ac: [hora(hs[1], ms[1]), String(hs[1])] })];
      return { t: 'El reloj', intro: 'La aguja corta marca la hora y la larga, los minutos.', fig: fig, items: items };
    }
    if (/^pri/.test(b)) {
      var dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'], v = dias.map(function () { return E(r, 2, b === 'pri1' ? 9 : 18); });
      var mx = v.indexOf(Math.max.apply(null, v)), mn = v.indexOf(Math.min.apply(null, v)), tot = v.reduce(function (s, x) { return s + x; }, 0);
      if (mx === mn) mn = (mx + 1) % 5;
      fig = barras(C, { cats: dias, vals: v, unidad: 'libros', valores: false });
      items = [it('corta', '¿Qué día se prestaron más libros?', dias[mx]), it('corta', '¿Cuántos libros se prestaron el ' + dias[2].toLowerCase() + '?', v[2]), it('corta', '¿Cuántos más se prestaron el ' + dias[mx].toLowerCase() + ' que el ' + dias[mn].toLowerCase() + '?', v[mx] - v[mn]), it('corta', '¿Cuántos libros se prestaron en toda la semana?', tot)];
      return { t: tit, intro: 'La biblioteca del colegio anotó cuántos libros prestó cada día.', fig: fig, items: esPeq(C) ? items.slice(0, 3) : items };
    }
    if (b === 'bach' && r() < 0.6) {
      if (r() < 0.5) {
        var p = E(r, -2, 2), q = E(r, -3, 3), x0 = E(r, -2, 2), f = function (x) { return x * x + p * x + q; }, m = 2 * x0 + p, y0 = f(x0), n = y0 - m * x0;
        var sg = function (k, pal) { return (k < 0 ? ' − ' : ' + ') + (Math.abs(k) === 1 && pal ? '' : Math.abs(k)) + (pal || ''); };
        var fx = 'x²' + (p ? sg(p, 'x') : '') + (q ? sg(q) : '');
        fig = funcion(C, { x: [-6, 6], y: [-6, 10], fs: [{ f: f }, { f: function (x) { return m * x + n; }, c: C.T.acc2, dash: true, w: 2.2 }], pts: [[x0, y0, 'P']], etq: [['f(x) = ' + fx, C.T.acc], ['recta tangente en P', C.T.acc2]] });
        var tg = 'y = ' + (m === 1 ? '' : m === -1 ? '−' : m) + 'x' + (n ? sg(n) : '');
        if (m === 0) tg = 'y = ' + n;
        var dv = '2x' + (p ? sg(p) : ''), dvc = dv.replace(/ /g, '');
        items = [it('corta', 'Calcula f\u2032(x) para f(x) = ' + fx + '.', 'f\u2032(x) = ' + dv, { ac: [dv, dvc, dvc.replace('−', '-'), 'f\u2032(x)=' + dvc, "f'(x)=" + dvc] }), it('corta', '¿Cuánto vale la pendiente de la tangente en x = ' + x0 + '?', m), it('corta', 'Escribe la ecuación de la recta tangente en P(' + x0 + ', ' + y0 + ').', tg, { ac: [tg, tg.replace(/ /g, ''), tg.replace(/ /g, '').replace(/−/g, '-')] })];
        return { t: 'Derivada y recta tangente', intro: 'La derivada en un punto es la pendiente de la recta que toca la curva en ese punto.', fig: fig, items: items };
      }
      var k2 = E(r, 1, 3), c2 = E(r, 0, 3), a2 = E(r, 0, 2), b2 = a2 + E(r, 2, 4), g = function (x) { return k2 * x + c2; };
      var area = (g(a2) + g(b2)) / 2 * (b2 - a2);
      fig = funcion(C, { x: [-1, 7], y: [-1, 16], fs: [{ f: g }], area: { f: g, a: a2, b: b2 }, etq: [['f(x) = ' + k2 + 'x' + (c2 ? ' + ' + c2 : ''), C.T.acc]] });
      items = [it('corta', 'Calcula ∫ de ' + a2 + ' a ' + b2 + ' de (' + k2 + 'x' + (c2 ? ' + ' + c2 : '') + ') dx.', fmt(area), { ac: [fmt(area), String(area)] }), it('corta', '¿Qué figura forma el área coloreada?', 'un trapecio', { ac: ['trapecio', 'un trapecio', 'trapecio rectángulo'] })];
      return { t: 'Integral definida y área', intro: 'La integral definida de una función positiva es el área entre la curva y el eje x.', fig: fig, items: items };
    }
    if (/^(fp|adu)$/.test(b) || C.mat === 'conta') {
      var cats = ['Vivienda', 'Comida', 'Transporte', 'Ocio', 'Ahorro'], pc = [E(r, 25, 35), E(r, 18, 26), E(r, 8, 14), E(r, 6, 12)], ah = 100 - pc.reduce(function (s, x) { return s + x; }, 0), ing = H.pick(r, C.P.precios)[1] * E(r, 200, 400);
      ing = Math.round(ing / 100) * 100 || 1000;
      pc.push(ah);
      fig = sectores(C, { cats: cats, vals: pc });
      var cant = Math.round(ing * ah) / 100;
      items = [it('corta', '¿Qué porcentaje del ingreso se destina al ahorro?', ah + ' %', { ac: [ah, ah + '%', ah + ' %'] }), it('corta', 'Si el ingreso mensual es ' + H.din(ing, C) + ', ¿cuánto se ahorra?', H.din(cant, C), { ac: [cant, H.num(cant, C)] }), it('corta', '¿Cuál es el gasto más grande?', 'Vivienda')];
      return { t: 'Presupuesto en un gráfico', intro: 'El gráfico de sectores reparte el ingreso de un mes entre los gastos y el ahorro.', fig: fig, items: items };
    }
    if (r() < 0.55) {
      var mm = H.pick(r, [-3, -2, -1, 1, 2, 3]), bb = E(r, -4, 5), xv = E(r, -2, 3), lin = function (x) { return mm * x + bb; };
      var cx = -bb / mm, ecu = 'y = ' + (mm === 1 ? '' : mm === -1 ? '−' : mm) + 'x' + (bb ? (bb < 0 ? ' − ' + (-bb) : ' + ' + bb) : '');
      fig = funcion(C, { x: [-6, 6], y: [-8, 8], fs: [{ f: lin }], pts: [[0, bb, '(0, ' + bb + ')']] });
      items = [it('corta', '¿Cuánto vale la ordenada en el origen?', bb), it('corta', 'La recta, ¿es creciente o decreciente?', mm > 0 ? 'creciente' : 'decreciente'), it('corta', 'Escribe la ecuación de la recta.', ecu, { ac: [ecu, ecu.replace(/ /g, '').replace('−', '-')] }), it('corta', 'Calcula y cuando x = ' + xv + '.', lin(xv))];
      if (Number.isInteger(cx)) items[1] = it('corta', '¿En qué punto corta al eje x?', '(' + cx + ', 0)', { ac: ['(' + cx + ',0)', '(' + cx + ', 0)', cx] });
      return { t: 'Analiza la función', intro: 'Observa la recta en el plano cartesiano y responde.', fig: fig, items: items };
    }
    var hv = E(r, -3, 3), kv = E(r, -4, 2), sgn = r() < 0.7 ? 1 : -1, cua = function (x) { return sgn * (x - hv) * (x - hv) + kv; };
    fig = funcion(C, { x: [-6, 6], y: [-8, 8], fs: [{ f: cua }], pts: [[hv, kv, 'V']] });
    items = [it('corta', '¿Cuáles son las coordenadas del vértice V?', '(' + hv + ', ' + kv + ')', { ac: ['(' + hv + ',' + kv + ')', '(' + hv + ', ' + kv + ')'] }), it('corta', '¿Cuál es el eje de simetría?', 'x = ' + hv, { ac: ['x=' + hv, 'x = ' + hv, hv] }), it('corta', 'La parábola, ¿tiene un máximo o un mínimo?', sgn > 0 ? 'mínimo' : 'máximo', { ac: [sgn > 0 ? 'mínimo' : 'máximo', sgn > 0 ? 'un mínimo' : 'un máximo'] }), it('corta', '¿Cuánto vale y cuando x = ' + (hv + 1) + '?', cua(hv + 1))];
    return { t: 'La parábola', intro: 'Una función cuadrática se dibuja como una parábola. Observa su vértice.', fig: fig, items: items };
  }

  /* Curvas con contexto de la materia: crecimiento (Biología), pulso (Anatomía), temperatura (Geografía). */
  function genCurva(u, C, r) {
    var E = H.ent, T = C.T, m = C.mat;
    if (m === 'bio') {
      var n0 = E(r, 1, 3), hh = E(r, 5, 7), f = function (x) { return n0 * Math.pow(2, x); }, x2 = E(r, 2, 3), tot = f(x2);
      return { t: 'Curva de crecimiento de bacterias', intro: 'Una colonia empieza con ' + n0 + ' millones de bacterias y se duplica cada hora. El eje x son horas y el eje y, millones de bacterias.', fig: funcion(C, { x: [0, hh], y: [0, n0 * Math.pow(2, hh) * 1.05], fs: [{ f: f }], pts: [[x2, tot, x2 + ' h']], etq: [['crecimiento exponencial', T.acc]] }),
        items: [it('corta', '¿Cuántos millones de bacterias hay a las ' + x2 + ' horas?', tot, { ac: [tot] }), it('corta', '¿Cuántos habrá una hora después?', tot * 2, { ac: [tot * 2] }), it('abierta', '¿Por qué una colonia no puede crecer así para siempre?', 'Se acaban el alimento y el espacio.', { lin: 2 })] };
    }
    if (m === 'anat') {
      var rep0 = E(r, 60, 75), sube = E(r, 8, 14), tope = rep0 + sube * 6, g = function (x) { return Math.min(rep0 + sube * x, tope); }, x3 = E(r, 2, 4);
      return { t: 'El pulso durante el ejercicio', intro: 'Pulsaciones por minuto de una persona que empieza a correr. El eje x son minutos.', fig: funcion(C, { x: [0, 10], y: [0, 200], fs: [{ f: g }], pts: [[0, rep0, 'reposo'], [x3, g(x3), x3 + ' min']], etq: [['frecuencia cardiaca (ppm)', T.acc]] }),
        items: [it('corta', '¿Cuál es el pulso en reposo?', rep0 + ' ppm', { ac: [rep0] }), it('corta', '¿Cuántas pulsaciones sube cada minuto al principio?', sube, { ac: [sube] }), it('corta', '¿A partir de qué minuto el pulso deja de subir?', 6, { ac: [6, '6 min'] })] };
    }
    var base = E(r, 8, 18), amp = E(r, 4, 9), sur = C.pk === 'ar' || C.pk === 'cl' ? Math.PI : 0, tm = function (x) { return Math.round(base + amp * Math.cos((x - 7) * Math.PI / 6 + sur)); };
    var meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'], vs = meses.map(function (x, i) { return tm(i + 1); }), mx = vs.indexOf(Math.max.apply(null, vs)), mn = vs.indexOf(Math.min.apply(null, vs));
    return { t: 'Temperaturas del año', intro: 'Temperatura media de cada mes en una ciudad. El eje x son los meses (1 = enero).', fig: funcion(C, { x: [0, 13], y: [0, 32], fs: [{ f: function (x) { return base + amp * Math.cos((x - 7) * Math.PI / 6 + sur); } }], pts: vs.map(function (v, i) { return [i + 1, v]; }), etq: [['temperatura (°C)', T.acc]] }),
      items: [it('corta', '¿Cuál es el mes más cálido?', meses[mx]), it('corta', '¿Y el más frío?', meses[mn]), it('corta', '¿Cuál es la amplitud térmica (máxima − mínima)?', (vs[mx] - vs[mn]) + ' °C', { ac: [vs[mx] - vs[mn]] })] };
  }

  function palabrasU(u, C) { return (u.k || []).map(function (k) { return S(k, C); }).filter(function (k) { return k && k.length < 30; }); }

  function genDatos(u, C, r) {
    var ks = H.mezcla(r, palabrasU(u, C)).slice(0, 5);
    if (ks.length < 3) return null;
    var v = ks.map(function () { return H.ent(r, 2, 14); }), mx = v.indexOf(Math.max.apply(null, v)), mn = v.indexOf(Math.min.apply(null, v)), tot = v.reduce(function (s, x) { return s + x; }, 0);
    if (mx === mn) return null;
    var fig = barras(C, { cats: ks.map(H.may), vals: v, unidad: 'votos', valores: true });
    var items = [it('corta', '¿Qué concepto recibió más votos?', H.may(ks[mx]), { ac: [ks[mx], H.may(ks[mx])] }), it('corta', '¿Cuántas personas votaron en total?', tot), it('corta', '¿Cuántos votos de diferencia hay entre «' + ks[mx] + '» y «' + ks[mn] + '»?', v[mx] - v[mn]), it('abierta', 'Elige uno de los conceptos y explica por qué te resulta útil.', '', { lin: 2 })];
    return { t: 'Encuesta de la clase', intro: 'Una clase votó qué concepto de «' + S(u.t, C) + '» le parece más útil en la vida diaria.', fig: fig, items: esPeq(C) ? items.slice(0, 2) : items };
  }

  function figDeUnidad(u) {
    var f = u.f;
    if (f && (f.t === 'mapa' && (f.r || []).length >= 3 || (f.t === 'ciclo' || f.t === 'flujo') && (f.p || []).length >= 3 || f.t === 'linea' && (f.h || []).length >= 3)) return f;
    if ((u.k || []).length >= 3) return { t: 'mapa', c: String(u.t).split(':')[0].slice(0, 28), r: u.k.slice(0, 6) };
    return null;
  }
  function genEsquema(u, C, r) {
    var f = figDeUnidad(u); if (!f) return null;
    var f2 = JSON.parse(JSON.stringify(f)), resp = [];
    if (f2.t === 'mapa') f2.r = f2.r.slice(0, 6).map(function (x, i) { resp.push(S(x, C)); return '( ' + (i + 1) + ' )'; });
    else if (f2.t === 'linea') f2.h = f2.h.map(function (x, i) { resp.push(S(x[1], C)); return [x[0], '( ' + (i + 1) + ' )']; });
    else f2.p = f2.p.slice(0, 6).map(function (x, i) { resp.push(S(x, C)); return /^¿/.test(x) ? x : '( ' + (i + 1) + ' )'; });
    var banco = H.mezcla(r, resp.filter(function (x) { return !/^¿/.test(x); }));
    var fig = '<div style="display:flex;justify-content:center">' + H.figura(f2, C) + '</div><div style="display:flex;flex-wrap:wrap;gap:2mm;justify-content:center;margin:4mm 0 2mm">' + banco.map(function (w) { return '<span style="border:1px dashed ' + C.T.acc2 + ';border-radius:' + (C.T.r ? 99 : 0) + 'px;padding:.8mm 3.5mm;font-size:.9em">' + esc(w) + '</span>'; }).join('') + '</div>';
    var items = resp.map(function (x, i) { return /^¿/.test(x) ? null : it('corta', 'Hueco ' + (i + 1) + ':', x); }).filter(Boolean).slice(0, 6);
    return { t: 'Completa el esquema', intro: 'Escribe en cada hueco la palabra del banco que corresponde.', fig: fig, items: items, compacto: true };
  }
  function genOrdena(u, C, r) {
    var f = u.f; if (!f) return null;
    var pasos = f.t === 'linea' ? (f.h || []).map(function (x) { return x[1]; }) : (f.t === 'ciclo' || f.t === 'flujo') ? (f.p || []) : [];
    pasos = pasos.filter(function (x) { return !/^¿/.test(x); }).map(function (x) { return S(x, C); });
    if (pasos.length < 3) return null;
    var orden = pasos.map(function (x, i) { return i; }), mez = H.mezcla(r, orden);
    if (mez.join() === orden.join()) mez.reverse();
    var L = 'ABCDEFG', sol = orden.map(function (i) { return L.charAt(mez.indexOf(i)); }).join(', ');
    var fig = '<div style="display:flex;flex-direction:column;gap:3mm;max-width:150mm">' + mez.map(function (i, k) { return '<div style="display:flex;gap:4mm;align-items:center;border:1px solid ' + C.T.soft + ';border-radius:' + Math.min(C.T.r, 10) + 'px;padding:3mm 4mm"><b style="flex:none;width:9mm;height:9mm;border-radius:50%;background:' + C.T.acc + ';color:#fff;display:flex;align-items:center;justify-content:center;font-family:' + C.T.tit + '">' + L.charAt(k) + '</b><span>' + esc(pasos[i]) + '</span></div>'; }).join('') + '</div>';
    return { t: 'Ordena los pasos', intro: 'Las tarjetas de «' + S(u.t, C) + '» están desordenadas.', fig: fig, items: [it('corta', 'Escribe las letras en el orden correcto.', sol, { ac: [sol, sol.replace(/, /g, '')] }), it('abierta', 'Explica con tus palabras qué ocurre en el segundo paso.', pasos[1], { lin: 2 })] };
  }
  function genSopa(u, C, r) {
    var SO = window.EU_SOPA; if (!SO) return null;
    var n = esPeq(C) ? 8 : 12, ws = palabrasU(u, C).map(function (w) { return w.toLowerCase(); }).filter(function (w) { return /^[a-záéíóúñü]+$/i.test(w) && w.length >= 3 && w.length <= n; });
    if (ws.length < 3) return null;
    var Sx = SO.crear(H.mezcla(r, ws).slice(0, 8), n, esPeq(C) ? [[1, 0], [0, 1]] : [[1, 0], [0, 1], [1, 1], [-1, 0]], r);
    if (!Sx || !Sx.p || !Sx.p.length) return null;
    var fig = SO.tabla(Sx, C, false, Math.min(12, (C.papel.w - 44) / n)) + SO.lista(Sx, C);
    return { t: 'Sopa de letras', intro: 'Busca las palabras clave de «' + S(u.t, C) + '».', fig: fig, items: [], sopa: Sx, sol: 'Palabras: ' + Sx.p.map(function (p) { return p.o; }).join(', ') };
  }
  function genCuerpo(u, C, r) {
    var tec = /^(arte|tecno)$/.test(C.mat), E = H.ent;
    if (tec) {
      var a = E(r, 2, 4), b = E(r, 2, 3), c = E(r, 2, 4);
      var fig = '<div style="display:grid;grid-template-columns:1.2fr 1fr;gap:6mm;align-items:center"><div>' + cuerpo(C, { t: 'prisma', a: a, b: b, c: c, cotas: [a + ' cm', b + ' cm', c + ' cm'] }) + '</div><div style="display:grid;gap:3mm">' + ['Alzado', 'Planta', 'Perfil'].map(function (v) { return '<div><div style="font-size:.8em;color:' + C.T.acc + ';font-weight:700;letter-spacing:.06em;text-transform:uppercase">' + v + '</div><div style="height:24mm;border:1px solid ' + C.T.ink + ';background-image:linear-gradient(' + C.T.soft + ' 1px,transparent 1px),linear-gradient(90deg,' + C.T.soft + ' 1px,transparent 1px);background-size:5mm 5mm"></div></div>'; }).join('') + '</div></div>';
      return { t: 'Dibujo técnico: vistas de un prisma', intro: 'Dibuja en la cuadrícula las tres vistas del prisma. Cada cuadro vale 1 cm.', fig: fig, items: [it('corta', '¿Qué medidas tendrá el rectángulo del alzado?', a + ' × ' + c + ' cm', { ac: [a + 'x' + c, a + ' x ' + c, a + ' × ' + c] }), it('corta', '¿Y el de la planta?', a + ' × ' + b + ' cm', { ac: [a + 'x' + b, a + ' × ' + b] })] };
    }
    var t = H.pick(r, esPeq(C) ? ['cubo', 'prisma'] : ['cubo', 'prisma', 'cilindro', 'piramide']);
    var A = E(r, 2, 6), B = t === 'cubo' ? A : E(r, 2, 6), Cc = t === 'cubo' ? A : E(r, 2, 7), items;
    if (t === 'cilindro') { var V = Math.round(Math.PI * A * A * Cc * 100) / 100; items = [it('corta', 'Calcula el volumen del cilindro (usa π ≈ 3,14).', fmt(3.14 * A * A * Cc) + ' cm³', { ac: [fmt(3.14 * A * A * Cc), fmt(V)] }), it('corta', '¿Cuánto mide el diámetro de la base?', 2 * A + ' cm', { ac: [2 * A, 2 * A + 'cm'] })]; }
    else if (t === 'piramide') items = [it('corta', 'Calcula el volumen de la pirámide de base cuadrada (V = área de la base × h ÷ 3).', fmt(A * A * Cc / 3) + ' cm³', { ac: [fmt(A * A * Cc / 3)] }), it('corta', '¿Cuántas caras tiene una pirámide de base cuadrada?', 5)];
    else items = [it('corta', 'Calcula el volumen.', A * B * Cc + ' cm³', { ac: [A * B * Cc, A * B * Cc + 'cm3', A * B * Cc + ' cm³'] }), it('corta', 'Calcula el área total de sus caras.', 2 * (A * B + B * Cc + A * Cc) + ' cm²', { ac: [2 * (A * B + B * Cc + A * Cc)] }), it('corta', '¿Cuántas aristas tiene?', 12)];
    if (esPeq(C)) items = [it('corta', '¿Cuántas caras tiene este cuerpo?', 6), it('corta', '¿Cuántos vértices tiene?', 8)];
    var nom = { cubo: 'El cubo', prisma: 'El prisma rectangular', cilindro: 'El cilindro', piramide: 'La pirámide' }[t];
    return { t: nom, intro: 'Observa el cuerpo geométrico y sus medidas.', fig: cuerpo(C, { t: t, a: A, b: B, c: Cc, cotas: [A + ' cm', B + ' cm', Cc + ' cm'], modo: 'solido' }), items: items };
  }
  function genInfografia(u, C) {
    var ideas = (u.i || []).map(function (s) { return S(s, C); }).slice(0, 5);
    if (ideas.length < 2) return null;
    return { t: 'En una imagen', intro: S(u.t, C), fig: infografia(C, ideas) + '<div style="margin-top:4mm">' + H.chipsClave(C, u) + '</div>', items: [], lectura: true };
  }

  var GENV = { curva: genCurva, grafica: genGrafica, datos: genDatos, esquema: genEsquema, ordena: genOrdena, sopa: genSopa, cuerpo: genCuerpo, info: genInfografia };
  var UNICOS = { esquema: 1, ordena: 1, info: 1 }, MAXV = { sopa: 2, datos: 2, curva: 1 }, ESEXTRA = {}, LIBV = {};
  function tiposDe(u, C) {
    var m = C.mat, t = ['info', 'esquema'];
    if (/^(mate|geoalg|calculo)$/.test(m)) t.push('grafica', 'cuerpo', 'grafica');
    else if (m === 'conta') t.push('grafica', 'datos');
    else if (/^(arte|tecno|fisica|quimica)$/.test(m)) t.push('cuerpo', 'datos');
    else if (/^(geografia|bio|anat)$/.test(m)) t.push('datos', 'curva');
    else t.push('datos');
    t.push('ordena', 'sopa');
    var ex = EXTRA.filter(function (e) { return !e.m || e.m.test(C.mat); }).map(function (e) { return e.id; });
    if (ex.length) { var mez = [], a = t.slice(); while (a.length || ex.length) { if (a.length) mez.push(a.shift()); if (ex.length) mez.push(ex.shift()); } t = mez; }
    /* unidades con lista propia de modelos (u.mods, p. ej. Peluquería): solo esos modelos de la biblioteca */
    var MO = window.EU_MODELOS;
    if (u && u.mods && MO && MO.modelo) t = t.filter(function (x) { return !MO.modelo(x) || u.mods.indexOf(x) >= 0; });
    return t;
  }
  var EXTRA = [];
  /* Vuelve a dibujar la figura de una página visual con el diseño actual de C (misma semilla, mismo contenido). */
  window.EU_SVG.regenerar = function (pg, C) {
    try {
      if (pg.gen && GENV[pg.gen] && pg.u) return GENV[pg.gen](pg.u, C, H.rng(pg.sem));
      var TA = window.EU_TALLER, g = pg.v && pg.v._g;
      if (g && pg.rc && TA && TA.generadores[g]) return TA.generadores[g](pg.rc, C, H.rng(pg.v._s));
    } catch (e) { }
    return null;
  };
  window.EU_SVG.generar = function (ty, u, C, r) { try { return GENV[ty] ? GENV[ty](u, C, r) : null; } catch (e) { return null; } };
  window.EU_SVG.tiposDe = tiposDe;
  window.EU_SVG.visual = function (id, gen, o) { o = o || {}; GENV[id] = gen; if (o.unico) UNICOS[id] = 1; if (o.max) MAXV[id] = o.max; ESEXTRA[id] = 1; if (o.libro) LIBV[id] = o.libro; EXTRA.push({ id: id, m: o.materias }); };

  /* ─────────── página visual ─────────── */
  var TITV = { grafica: 'Gráficas', datos: 'Gráficas', esquema: 'Esquemas', ordena: 'Esquemas', sopa: 'Juegos', cuerpo: 'Geometría', info: 'Infografía' };
  var paginas = {
    vis: function (pg, C, modo) {
      var V = pg.v, T = C.T, web = modo === 'web';
      var its = (pg.items || []).map(function (x, i) { return H.itemHTML(x, i, C, modo, 'v' + pg.num); }).join('');
      return H.cabecera(C, pg) + H.h1(C, esc(V.t)) + (V.intro ? '<p style="margin:0 0 4mm;max-width:165mm;text-wrap:pretty">' + esc(V.intro) + '</p>' : '') +
        '<div style="margin:0 0 5mm">' + V.fig + '</div>' + (its ? '<div style="' + (V.compacto ? 'display:grid;grid-template-columns:1fr 1fr;column-gap:8mm' : '') + '">' + its + '</div>' : '') +
        (web && its ? '<button data-comprobar="1" style="font:inherit;padding:2mm 5mm;border:0;border-radius:6px;background:' + T.acc + ';color:#fff;cursor:pointer">Comprobar</button> <span data-resultado="1"></span>' : '') + H.folio(C, pg);
    },
    col_cuerpo: function (pg, C) {
      var N = { cubo: 'el cubo', prisma: 'el prisma', piramide: 'la pirámide', cilindro: 'el cilindro', cono: 'el cono', esfera: 'la esfera' };
      return H.cabecera(C, pg) + H.h1(C, esc('Colorea ' + N[pg.t])) + '<p style="font-size:1.08em;margin:0 0 5mm;max-width:160mm">Pinta cada cara de un color distinto: así se nota que tiene volumen.</p>' +
        '<div style="max-width:150mm;margin:0 auto">' + cuerpo(C, { t: pg.t, a: 3, b: pg.t === 'prisma' ? 2 : 3, c: pg.t === 'prisma' ? 4 : 3, modo: 'linea', max: 560 }) + '</div>' + H.folio(C, pg);
    },
    col_mosaico: function (pg, C) {
      var W = 620, Hh = Math.round((C.papel.h - 90) / (C.papel.w - 34) * W);
      return H.cabecera(C, pg) + H.h1(C, 'Colorea el mosaico') + '<p style="font-size:1.08em;margin:0 0 5mm;max-width:160mm">Elige dos o tres colores y repítelos para crear tu propio dibujo.</p>' + mosaico(pg.forma, pg.seed, W, Hh) + H.folio(C, pg);
    },
    cal_trazos: function (pg, C) {
      return H.cabecera(C, pg) + H.h1(C, 'Trazos para soltar la mano') + '<p style="font-size:1.08em;margin:0 0 5mm;max-width:160mm">Empieza en el punto. Sigue el modelo de color y repasa la línea de puntos sin levantar el lápiz.</p>' + trazos(pg.seed, C.T) + H.folio(C, pg);
    },
    inf_glosario: function (pg, C) {
      var I = window.EU_INFANTIL, T = C.T, ids = pg.ids || [];
      return H.cabecera(C, pg) + H.h1(C, 'Mis palabras') + '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:5mm">' + ids.map(function (id) {
        var f = I.FIG[id];
        return '<div style="border:0.4mm solid ' + T.soft + ';border-radius:' + T.r + 'px;padding:3mm;display:flex;flex-direction:column;align-items:center;gap:2mm;break-inside:avoid"><div style="width:30mm">' + I.figSVG(id) + '</div><div style="font-family:' + T.tit + ';font-weight:' + T.peso + ';font-size:1.1em">' + esc(f[0] + ' ' + (id === 'coche' ? ({ es: 'coche', ar: 'auto', cl: 'auto' }[C.pk] || 'carro') : f[1])) + '</div></div>';
      }).join('') + '</div>' + H.folio(C, pg);
    }
  };
  var voz = {
    vis: function (pg, C) { return pg.v.t + '. ' + (pg.v.intro || '') + ' ' + (pg.items || []).map(function (x, i) { return (i + 1) + '. ' + H.limpio(x.e); }).join(' '); },
    col_cuerpo: function () { return 'Colorea cada cara de un color distinto.'; },
    col_mosaico: function () { return 'Colorea el mosaico con dos o tres colores.'; },
    cal_trazos: function () { return 'Sigue los trazos sin levantar el lápiz.'; },
    inf_glosario: function (pg) { var I = window.EU_INFANTIL; return 'Mis palabras: ' + (pg.ids || []).map(function (id) { return I.FIG[id][1]; }).join(', ') + '.'; }
  };
  var escenas = {
    vis: function (pg) { return pg.v.lectura ? null : { k: 'pregunta', t: pg.v.t + (pg.items && pg.items[0] ? ': ' + H.limpio(pg.items[0].e) : ''), s: pg.items && pg.items[0] ? pg.items[0].s : '' }; }
  };
  ED.registrar({ paginas: paginas, voz: voz, escenas: escenas });

  /* ─────────── variantes de ejercicios (para no repetir) ─────────── */
  function variantes(u, C, r) {
    var ks = palabrasU(u, C), ideas = (u.i || []).map(function (s) { return S(s, C); }), out = [];
    ideas.forEach(function (s) {
      out.push(it('vf', s, 'V'));
      ks.forEach(function (k) {
        var i = s.toLowerCase().indexOf(k.toLowerCase()); if (i < 0 || k.length < 3) return;
        ks.forEach(function (k2) { if (k2 !== k && s.toLowerCase().indexOf(k2.toLowerCase()) < 0) out.push(it('vf', s.slice(0, i) + k2 + s.slice(i + k.length), 'F', { x: 'La palabra correcta es «' + k + '».' })); });
        var ops = H.mezcla(r, [k].concat(H.mezcla(r, ks.filter(function (x) { return x !== k; })).slice(0, 2)));
        if (ops.length >= 3) out.push(it('mc', '¿Qué palabra completa la frase? «' + s.slice(0, i) + hueco() + s.slice(i + k.length) + '»', 'abc'.charAt(ops.indexOf(k)) + ') ' + k, { o: ops, c: ops.indexOf(k) }));
      });
    });
    for (var a = 0; a < ks.length; a++) for (var b = a + 1; b < ks.length; b++) out.push(it('abierta', '¿Qué relación hay entre «' + ks[a] + '» y «' + ks[b] + '»? Escríbelo en una o dos frases.', '', { lin: 2 }));
    var lugares = C.adulto ? ['tu trabajo', 'tu barrio', 'una noticia reciente', 'tu día a día'] : ['tu casa', 'tu colegio', 'tu barrio', 'un cuento que conozcas'];
    ks.forEach(function (k) { lugares.forEach(function (l) { out.push(it('abierta', 'Pon un ejemplo de «' + k + '» en ' + S(l, C) + '.', '', { lin: 2 })); }); });
    ideas.forEach(function (s) { out.push(it('abierta', 'Explica con tus palabras: «' + s + '»', '', { lin: 3 })); });
    return H.mezcla(r, out);
  }
  function alto(x, C) {
    var cpl = Math.round(620 / (C.fs * 0.52)), base = Math.ceil(String(x.e).replace(/<[^>]+>/g, '').length / cpl) + 0.6;
    if (x.alto) base += x.alto;
    return base + ({ corta: 1.4, vf: .6, mc: 1.6 + (x.o || []).length * .4, abierta: (x.lin || 2) * 1.5, dibujo: 7 }[x.tipo] || 2);
  }

  /* ─────────── mejora del libro ya ensamblado ─────────── */
  var LIBROS = /^(libro|ebook|cuaderno|fichas)$/, INF = /^(colorear|caligrafia|pasatiempos)$/;
  function mejorarLibro(res) {
    var C = res.C, pages = res.pages, visto = {}, gens = {}, cuenta = {}, usados = {}, usL = {}, nU = {};
    pages.forEach(function (p) { if (p.u) nU[p.u.id] = 1; });
    var topeL = Math.max(3, Math.ceil(Object.keys(nU).length / 3)); /* una figura añadida no ocupa más de un tercio de las unidades */
    var clave = function (x) { return x.tipo + '|' + H.limpio(x.e); };
    var nuevoVisual = function (pg, forzar) {
      var u = pg.u, tipos = tiposDe(u, C), ini = cuenta[u.id] != null ? cuenta[u.id] : H.hash(u.id) % tipos.length;
      for (var q = 0; q < tipos.length; q++) {
        var ty = tipos[(ini + q) % tipos.length];
        if (UNICOS[ty] && usados[u.id + ty] || MAXV[ty] && (usados[u.id + ty] || 0) >= MAXV[ty]) continue;
        if (ESEXTRA[ty] && (usL[ty] || 0) >= (LIBV[ty] || topeL)) continue;
        var sem = H.hash(u.id + ':vis:' + ty + ':' + pg.num) + (C.semilla || 1) * 7919, rr = H.rng(sem), V = null;
        try { V = GENV[ty](u, C, rr); } catch (e) { console.warn('vis', ty, e); }
        if (!V) { usados[u.id + ty] = 99; continue; }
        cuenta[u.id] = ini + q + 1; usados[u.id + ty] = (usados[u.id + ty] || 0) + 1; usL[ty] = (usL[ty] || 0) + 1;
        V.items.forEach(function (x) { x.e = S(x.e, C); });
        return { tipo: 'vis', u: u, n: pg.n, v: V, items: V.items, relleno: true, sopa: V.sopa, cab: pg.cab, gen: ty, sem: sem };
      }
      return forzar ? null : null;
    };
    var porU = {}, totU = {}, visU = {};
    pages.forEach(function (pg) { if (pg.u && (pg.tipo === 'actividad' || pg.tipo === 'ficha')) totU[pg.u.id] = (totU[pg.u.id] || 0) + 1; });
    pages.forEach(function (pg, i) {
      if (!pg.items || !(pg.tipo === 'actividad' || pg.tipo === 'ficha') || !pg.u) return;
      var u = pg.u; porU[u.id] = (porU[u.id] || 0) + 1;
      var dups = pg.items.filter(function (x) { return visto[clave(x)]; }).length, tope = Math.max(1, Math.ceil(totU[u.id] * (EXTRA.length ? 0.6 : 0.4)));
      var toca = pg.relleno && (visU[u.id] || 0) < tope && (porU[u.id] === 2 || porU[u.id] % 3 === 0 || dups * 2 >= pg.items.length);
      if (toca) { var nv = nuevoVisual(pg); if (nv) { nv.num = pg.num; pages[i] = nv; visU[u.id] = (visU[u.id] || 0) + 1; return; } }
      if (!gens[u.id]) gens[u.id] = { l: variantes(u, C, H.rng(H.hash(u.id + ':var') + (C.semilla || 1) * 31)), i: 0 };
      var G = gens[u.id];
      pg.items = pg.items.map(function (x) {
        var k = clave(x);
        if (!visto[k]) { visto[k] = 1; return x; }
        var h0 = alto(x, C) + .4;
        while (G.i < G.l.length) { var y = G.l[G.i++]; var ky = clave(y); if (!visto[ky] && alto(y, C) <= h0) { visto[ky] = 1; return y; } }
        return x;
      });
    });
    /* Glosario también en el cuaderno largo. */
    if (C.prod.id === 'cuaderno' && pages.length >= 30 && !pages.some(function (p) { return p.tipo === 'glosario'; })) {
      var jg = -1; for (var q = pages.length - 1; q >= 0; q--) if (pages[q].relleno) { jg = q; break; }
      if (jg >= 0) {
        pages.splice(jg, 1);
        var pos = pages.map(function (p) { return p.tipo; }).indexOf('solucion'); if (pos < 0) pos = pages.map(function (p) { return p.tipo; }).indexOf('bibliografia'); if (pos < 0) pos = pages.length - 1;
        pages.splice(pos, 0, { tipo: 'glosario' });
        pages.forEach(function (p, i) { p.num = i + 1; });
      }
    }
    /* Solucionario con los ejercicios finales. */
    var sols = pages.filter(function (p) { return p.tipo === 'solucion'; });
    if (sols.length) {
      var e = [];
      pages.forEach(function (p) {
        if (p.tipo === 'vis' && p.v && p.v.sopa) e.push({ p: p.num, items: [{ s: p.v.sol }], u: p.u });
        else if (p.items && p.items.length && (p.tipo === 'actividad' || p.tipo === 'ficha' || p.tipo === 'vis')) e.push({ p: p.num, items: p.items, u: p.u });
      });
      var per = Math.ceil(e.length / sols.length);
      sols.forEach(function (p, i) { p.entradas = e.slice(i * per, (i + 1) * per); });
    }
  }

  function mejorarInfantil(res) {
    var C = res.C, pages = res.pages, I = window.EU_INFANTIL, id = C.prod.id, vistos = {}, k = 0;
    var firma = function (p) { var o = {}; for (var q in p) if (!/^(num|relleno|indice|cab|pz)$/.test(q)) o[q] = p[q]; try { return JSON.stringify(o); } catch (e) { return p.tipo + Math.random(); } };
    var L = (pages.filter(function (p) { return p.tipo === 'col_mandala'; })[0] || {}).L || 4;
    var cuerpos = ['cubo', 'piramide', 'cilindro', 'prisma', 'cono', 'esfera'], formas = ['hexagonos', 'triangulos', 'escamas', 'cuadros'], nc = 0;
    var lab0 = (pages.filter(function (p) { return p.tipo === 'pas_laberinto'; })[0] || {}).M, figs = I ? Object.keys(I.FIG) : [];
    var yaW = {}; pages.forEach(function (p) { (p.ws || []).concat(p.w ? [p.w] : []).forEach(function (w) { yaW[w] = 1; }); });
    var palabrasInf = H.mezcla(H.rng(C.semilla || 1), figs.map(function (f) { return f === 'coche' ? ({ es: 'coche', ar: 'auto', cl: 'auto' }[C.pk] || 'carro') : I.FIG[f][1]; }).filter(function (w) { return !yaW[w]; }));
    var sigCuerpo = function (s) { return nc < cuerpos.length ? { tipo: 'col_cuerpo', t: cuerpos[nc++] } : { tipo: 'col_mosaico', forma: formas[s % 4], seed: s }; };
    pages.forEach(function (p, i) {
      if (!p.relleno || /_sol$|_como$/.test(p.tipo)) { vistos[firma(p)] = 1; return; }
      var f = firma(p);
      if (!vistos[f]) { vistos[f] = 1; return; }
      var s = H.hash('inf' + i) + (C.semilla || 1) * 977, nuevo;
      if (id === 'caligrafia') { var ch = palabrasInf.splice(0, 4); nuevo = ch.length === 4 && k % 2 ? { tipo: 'cal_palabras', ws: ch, t: 'Palabras con dibujo' } : { tipo: 'cal_trazos', seed: s }; }
      else if (id === 'pasatiempos') nuevo = lab0 && I && I.laberinto && k % 3 !== 2 ? { tipo: 'pas_laberinto', M: I.laberinto(lab0.c, lab0.f, H.rng(s)), a: figs[(k * 2 + 3) % figs.length], b: figs[(k * 2 + 8) % figs.length], sol: true } : sigCuerpo(s);
      else nuevo = k % 3 === 1 ? sigCuerpo(s) : k % 3 === 2 ? { tipo: 'col_mosaico', forma: formas[Math.floor(k / 3) % 4], seed: s } : { tipo: 'col_mandala', seed: s, L: L };
      k++;
      nuevo.relleno = true; nuevo.num = p.num; nuevo.cab = nuevo.tipo === 'cal_trazos' ? 'Trazos' : nuevo.tipo === 'col_mandala' ? 'Mandalas' : nuevo.tipo === 'col_cuerpo' ? 'Cuerpos para colorear' : nuevo.tipo === 'pas_laberinto' ? 'Laberintos' : nuevo.tipo === 'cal_palabras' ? 'Palabras' : 'Mosaicos';
      pages[i] = nuevo;
      vistos[firma(nuevo)] = 1;
    });
    /* Glosario ilustrado */
    if (I && pages.length >= 16 && !pages.some(function (p) { return p.tipo === 'inf_glosario'; })) {
      var ids = [];
      pages.forEach(function (p) { ['f', 'a', 'b'].forEach(function (q) { if (typeof p[q] === 'string' && I.FIG[p[q]] && ids.indexOf(p[q]) < 0) ids.push(p[q]); }); });
      Object.keys(I.FIG).forEach(function (q) { if (ids.length < 12 && ids.indexOf(q) < 0) ids.push(q); });
      ids = ids.slice(0, 12).sort(function (a, b) { return I.FIG[a][1].localeCompare(I.FIG[b][1], 'es'); });
      var j = -1; for (var q = pages.length - 1; q >= 0; q--) if (pages[q].relleno && pages[q].tipo !== 'pas_sol') { j = q; break; }
      if (j >= 0) {
        var g = { tipo: 'inf_glosario', ids: ids, indice: 'Mis palabras', cab: 'Glosario' };
        pages.splice(j, 1);
        var fin = pages.length - 1; for (var z = pages.length - 1; z >= 0; z--) if (pages[z].tipo === 'pas_sol') fin = z;
        pages.splice(fin, 0, g);
      }
    }
    var n = 0; pages.forEach(function (p, i) { p.num = i + 1; if (p.sol === true) p.pz = ++n; });
  }

  /* Libros largos con pocas unidades: se suman unidades de cursos vecinos. */
  function conAmpliacion(cfg, fn) {
    if (!CU || !LIBROS.test(cfg.prod || 'libro')) return fn();
    var N = cfg.paginas || 40, orig = CU.unidades;
    var cerca = orig.call(CU, cfg.materia, CU.banda(cfg.pais, cfg.nivel, cfg.curso)).filter(function (u) { return u._ajuste < 2.6; }).length;
    if (!cerca || N / cerca < 30) return fn();
    CU.unidades = function (m, b) { return orig.call(CU, m, b).map(function (u) { if (u._ajuste >= 2.6 && u._ajuste < 4.1) u._ajuste = 2.5; return u; }); };
    try { return fn(); } finally { CU.unidades = orig; }
  }

  var ensamblarBase = ED.ensamblar;
  ED.ensamblar = function (cfg) {
    var res = conAmpliacion(cfg, function () { return ensamblarBase(cfg); });
    try {
      if (LIBROS.test(res.C.prod.id)) mejorarLibro(res);
      else if (INF.test(res.C.prod.id)) mejorarInfantil(res);
      var us = []; res.pages.forEach(function (p) { if (p.u && us.indexOf(p.u) < 0) us.push(p.u); }); if (us.length) res.unidades = us;
    } catch (e) { console.warn('EU_SVG', e); }
    return res;
  };
})();
