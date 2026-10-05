/* b6_cerebro_visual.js — Biblioteca visual ampliada del Editorial (se apoya en EU_SVG y EU_MAPAS_DATOS).
   · Mapas reales de los 8 países (contorno Natural Earth): mapa mudo con ciudades, coordenadas en cuadrícula.
   · Recipientes: probeta, vaso de precipitado, matraz, jarra medidora, taza y vaso, con nivel de líquido.
   · Termómetros, mapa mental radial y mapa conceptual con palabras de enlace.
   · Movimiento: en pantalla los dibujos se animan (el trazo del mapa se dibuja, el líquido sube,
     las ramas crecen); al imprimir queda el estado final.
   · Diccionario: test interactivo por tema con autocorrección, en lugar de prácticas repetidas.
   Se registra con EU_SVG.visual(id, generador, { materias, max }). Cargar después de b6_cerebro_svg.js. */
(function () {
  var ED = window.EU_EDITORIAL, SV = window.EU_SVG;
  if (!ED || !SV || !SV.visual || SV._visual) return;
  SV._visual = true;
  var H = ED.H, esc = H.esc, it = H.it, E = H.ent, osc = SV.osc, clr = SV.clr, NS = 'xmlns="http://www.w3.org/2000/svg"', uid = 0;
  function r1(n) { return Math.round(n * 10) / 10; }
  function es3d(C) { return C.prem ? C.prem.dibujo === '3d' : (((C.cfg && C.cfg.acab) || {}).dibujo || '3d') === '3d'; }
  function svg(w, h, body, maxw) { return '<svg ' + NS + ' data-plano="1" viewBox="0 0 ' + w + ' ' + h + '" style="width:100%;max-width:' + (maxw || w) + 'px;height:auto;display:block;margin:0 auto">' + body + '</svg>'; }
  function tx(x, y, s, o) { o = o || {}; return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || 'middle') + '" font-size="' + (o.s || 13) + '" font-family="' + esc(o.f || 'sans-serif') + '" font-weight="' + (o.w || 400) + '" fill="' + (o.c || '#222') + '"' + (o.st ? ' stroke="#fff" stroke-width="3" paint-order="stroke"' : '') + '>' + esc(s) + '</text>'; }
  function lineas(s, max) { var ls = [], cur = ''; String(s).split(' ').forEach(function (w) { if ((cur + ' ' + w).trim().length > max && cur) { ls.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }); if (cur) ls.push(cur); return ls; }
  function txL(x, y, s, max, o) { var ls = lineas(s, max).slice(0, o.n || 3), lh = (o.s || 13) * 1.2; return ls.map(function (l, k) { return tx(x, y - (ls.length - 1) * lh / 2 + k * lh, l, o); }).join(''); }
  function anim(at, de, a, dur, extra) { return '<animate attributeName="' + at + '" from="' + de + '" to="' + a + '" dur="' + (dur || 1.4) + 's" begin="0s" fill="freeze" calcMode="spline" keySplines=".2 .7 .3 1" keyTimes="0;1"' + (extra || '') + '/>'; }
  function fmt(n) { return String(Math.round(n * 100) / 100).replace('.', ','); }
  function esPeq(C) { return /^(inf|pri1|pri2)$/.test(C.bnd || ''); }
  var S = function (s, C) { return H.sub(s, C); };
  function mc(e, ops, bien, x) { return it('mc', e, 'abc'.charAt(ops.indexOf(bien)) + ') ' + bien, Object.assign({ o: ops, c: ops.indexOf(bien) }, x || {})); }

  /* ─────────── mapas de país ─────────── */
  var PAISES = { es: 'España', mx: 'México', co: 'Colombia', ar: 'Argentina', cl: 'Chile', ve: 'Venezuela', do: 'República Dominicana', us: 'Estados Unidos' };
  function mapaPais(C, pk, o) {
    var D = (window.EU_MAPAS_DATOS || {})[pk]; if (!D) return null;
    o = o || {};
    var T = C.T, F = T.cuerpo, pad = 34, esc2 = pk === 'cl' ? 1.25 : 1, W = D.w * esc2 + pad * 2 + (o.grid ? 20 : 0), Hh = D.h * esc2 + pad * 2 + (o.grid ? 20 : 0), ox = pad + (o.grid ? 20 : 0), oy = pad + (o.grid ? 20 : 0);
    if (pk === 'cl') W = Math.max(W, 220);
    var d3 = es3d(C), id = 'eump' + (++uid), out = '', tr = 'translate(' + ox + ' ' + oy + ') scale(' + esc2 + ')';
    out += '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + clr(T.acc, d3 ? .55 : .8) + '"/><stop offset="1" stop-color="' + clr(T.acc, d3 ? .78 : .8) + '"/></linearGradient></defs>';
    if (o.grid) {
      var cols = 5, rows = Math.max(3, Math.round(5 * D.h / D.w)), cw = D.w * esc2 / cols, rh = D.h * esc2 / rows;
      if (rows > 8) rows = 8, rh = D.h * esc2 / rows;
      for (var i = 0; i <= cols; i++) out += '<line x1="' + r1(ox + i * cw) + '" y1="' + oy + '" x2="' + r1(ox + i * cw) + '" y2="' + r1(oy + D.h * esc2) + '" stroke="' + T.soft + '" stroke-width="1"/>' + (i < cols ? tx(ox + (i + .5) * cw, oy - 8, 'ABCDEFGH'.charAt(i), { f: F, s: 12, c: T.acc, w: 700 }) : '');
      for (var j = 0; j <= rows; j++) out += '<line x1="' + ox + '" y1="' + r1(oy + j * rh) + '" x2="' + r1(ox + D.w * esc2) + '" y2="' + r1(oy + j * rh) + '" stroke="' + T.soft + '" stroke-width="1"/>' + (j < rows ? tx(ox - 10, oy + (j + .5) * rh + 4, j + 1, { f: F, s: 12, c: T.acc, w: 700 }) : '');
      o._celda = function (x, y) { return 'ABCDEFGH'.charAt(Math.min(cols - 1, Math.floor(x * esc2 / cw))) + (Math.min(rows - 1, Math.floor(y * esc2 / rh)) + 1); };
    }
    if (d3) out += '<path d="' + D.d + '" transform="translate(' + (ox + 3) + ' ' + (oy + 5) + ') scale(' + esc2 + ')" fill="' + osc(T.acc, .45) + '" opacity=".85"/>';
    out += '<path d="' + D.d + '" transform="' + tr + '" fill="url(#' + id + ')" stroke="' + osc(T.acc, .2) + '" stroke-width="' + r1(1.3 / esc2) + '" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 0">' + anim('stroke-dasharray', '0 1', '1 0', 2.2) + '</path>';
    (o.pts || []).forEach(function (p, k) {
      var x = ox + p.x * esc2, y = oy + p.y * esc2, cap = p.cap;
      out += (cap ? '<polygon points="' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (q) { var a = -Math.PI / 2 + q * Math.PI / 5, rr = q % 2 ? 3.4 : 8; return r1(x + rr * Math.cos(a)) + ',' + r1(y + rr * Math.sin(a)); }).join(' ') + '" fill="' + T.acc2 + '" stroke="#fff" stroke-width="1.2"/>' : '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="4.6" fill="' + T.acc2 + '" stroke="#fff" stroke-width="1.4"><animate attributeName="r" values="0;7;4.6" dur="1s" begin="' + (1 + k * .15) + 's" fill="freeze"/></circle>');
      if (p.et) out += tx(x + (p.x * esc2 > D.w * esc2 * .6 ? -9 : 9), y + 4.5, p.et, { f: F, s: 12, c: T.ink, w: 700, a: p.x * esc2 > D.w * esc2 * .6 ? 'end' : 'start', st: true });
    });
    var nx = W - 22, ny = 30;
    out += '<polygon points="' + nx + ',' + (ny - 16) + ' ' + (nx + 6) + ',' + ny + ' ' + nx + ',' + (ny - 4) + ' ' + (nx - 6) + ',' + ny + '" fill="' + T.ink + '"/>' + tx(nx, ny + 14, 'N', { f: F, s: 12, c: T.ink, w: 700 });
    return svg(W, Hh, out, o.max || 460);
  }
  function genMapa(u, C, r) {
    if (!window.EU_MAPAS_DATOS) return null;
    var otros = Object.keys(PAISES).filter(function (k) { return k !== C.pk; }), pk = r() < 0.4 && PAISES[C.pk] ? C.pk : H.pick(r, otros), D = window.EU_MAPAS_DATOS[pk];
    var cs = D.c.map(function (c) { return { n: c[0], x: c[1], y: c[2], cap: !!c[3] }; }), ord = H.mezcla(r, cs.map(function (c, i) { return i; }));
    var pts = cs.map(function (c, i) { return { x: c.x, y: c.y, cap: c.cap, et: String(ord.indexOf(i) + 1) }; });
    var cap = cs.filter(function (c) { return c.cap; })[0], by = function (f) { return cs.slice().sort(f)[0].n; };
    var norte = by(function (a, b) { return a.y - b.y; }), sur = by(function (a, b) { return b.y - a.y; }), este = by(function (a, b) { return b.x - a.x; });
    var banco = H.mezcla(r, cs.map(function (c) { return c.n; }));
    var fig = mapaPais(C, pk, { pts: pts }) + '<div style="display:flex;flex-wrap:wrap;gap:2mm;justify-content:center;margin:4mm 0 1mm">' + banco.map(function (w) { return '<span style="border:1px dashed ' + C.T.acc2 + ';border-radius:' + (C.T.r ? 99 : 0) + 'px;padding:.8mm 3.5mm;font-size:.9em">' + esc(w) + '</span>'; }).join('') + '</div>';
    var n1 = ord[0], items = [it('corta', '¿Qué número marca la estrella de la capital, ' + cap.n + '?', ord.indexOf(cs.indexOf(cap)) + 1), it('corta', 'Escribe el nombre de la ciudad número 1.', cs[n1].n), it('corta', '¿Cuál de estas ciudades está más al norte?', norte), it('corta', '¿Y cuál está más al sur?', sur)];
    if (!esPeq(C)) items.push(it('corta', '¿Cuál está más al este?', este));
    return { t: 'Mapa de ' + PAISES[pk], intro: 'Cada punto numerado es una ciudad de ' + PAISES[pk] + '. Usa el banco de nombres y la rosa de los vientos (N = norte).', fig: fig, items: items, compacto: true };
  }
  function genCoordenadas(u, C, r) {
    if (!window.EU_MAPAS_DATOS) return null;
    var pk = H.pick(r, Object.keys(PAISES).filter(function (k) { return k !== 'cl'; })), D = window.EU_MAPAS_DATOS[pk], o = { grid: true };
    var cs = H.mezcla(r, D.c.map(function (c) { return { n: c[0], x: c[1], y: c[2], cap: !!c[3] }; })).slice(0, 4);
    o.pts = cs.map(function (c) { return { x: c.x, y: c.y, cap: c.cap, et: c.n }; });
    var fig = mapaPais(C, pk, o), cel = o._celda;
    var items = cs.slice(0, 3).map(function (c) { var k = cel(c.x, c.y); return it('corta', '¿En qué casilla está ' + c.n + '?', k, { ac: [k, k.toLowerCase()] }); });
    items.push(it('abierta', 'Traza con el dedo el camino de ' + cs[0].n + ' a ' + cs[1].n + ' y escribe por qué casillas pasas.', '', { lin: 2 }));
    return { t: 'Coordenadas en el mapa', intro: 'Cada casilla se nombra con una letra (columna) y un número (fila), como en un plano de ciudad.', fig: fig, items: items };
  }

  /* ─────────── recipientes ─────────── */
  var FORMAS = {
    probeta: { n: 'probeta', in: [42, 78], top: 30, bot: 184, marca: 44, out: 'M42,26 L38,22 L82,22 L78,26 L78,184 L95,186 L95,194 L25,194 L25,186 L42,184 Z', grad: true },
    vaso_p: { n: 'vaso de precipitado', in: [20, 100], top: 34, bot: 188, marca: 56, out: 'M14,26 L22,32 L22,184 Q22,190 28,190 L92,190 Q98,190 98,184 L98,30 L104,26', grad: true },
    jarra: { n: 'jarra medidora', in: [22, 92], top: 40, bot: 186, marca: 58, out: 'M14,34 L24,40 L24,182 Q24,190 32,190 L84,190 Q92,190 92,182 L92,36 M92,60 Q118,60 118,100 Q118,140 92,146', grad: true },
    matraz: { n: 'matraz', in: [14, 106], top: 30, bot: 188, marca: 120, out: 'M48,24 L48,86 L16,176 Q12,190 26,190 L94,190 Q108,190 104,176 L72,86 L72,24', grad: false },
    taza: { n: 'taza', in: [16, 94], top: 88, bot: 184, marca: 96, out: 'M14,88 L14,160 Q14,188 44,188 L66,188 Q96,188 96,160 L96,88 M96,104 Q120,104 120,128 Q120,152 96,152', grad: false },
    vaso: { n: 'vaso', in: [20, 100], top: 40, bot: 188, marca: 50, out: 'M16,40 L28,188 L92,188 L104,40', grad: false }
  };
  function recipiente(C, f, cap, vol, et) {
    var T = C.T, F = T.cuerpo, R = FORMAS[f], d3 = es3d(C), id = 'eur' + (++uid), lvl = R.bot - (vol / cap) * (R.bot - R.marca), out = '';
    var interior = f === 'matraz' ? 'M49,24 L49,86 L17,176 Q13,189 26,189 L94,189 Q107,189 103,176 L71,86 L71,24 Z' : f === 'vaso' ? 'M17,40 L29,187 L91,187 L103,40 Z' : f === 'taza' ? 'M15,88 L15,160 Q15,187 44,187 L66,187 Q95,187 95,160 L95,88 Z' : 'M' + R.in[0] + ',' + R.top + ' L' + R.in[0] + ',' + (R.bot + 2) + ' L' + R.in[1] + ',' + (R.bot + 2) + ' L' + R.in[1] + ',' + R.top + ' Z';
    var liq = T.acc2;
    out += '<defs><clipPath id="' + id + '"><path d="' + interior + '"/></clipPath><linearGradient id="' + id + 'g" x1="0" x2="1"><stop offset="0" stop-color="' + clr(liq, .15) + '"/><stop offset=".5" stop-color="' + clr(liq, d3 ? .45 : .3) + '"/><stop offset="1" stop-color="' + osc(liq, d3 ? .2 : 0) + '"/></linearGradient></defs>';
    if (d3) out += '<ellipse cx="60" cy="196" rx="48" ry="5" fill="#000" opacity=".14"/>';
    out += '<path d="' + interior + '" fill="' + (d3 ? clr(T.acc, .9) : '#fff') + '"/>';
    out += '<g clip-path="url(#' + id + ')"><rect x="0" y="' + r1(lvl) + '" width="130" height="' + r1(200 - lvl) + '" fill="' + (d3 ? 'url(#' + id + 'g)' : clr(liq, .45)) + '">' + anim('y', 200, r1(lvl), 1.6) + anim('height', 0, r1(200 - lvl), 1.6) + '</rect>' +
      '<path d="M0,' + r1(lvl) + ' q15,-3 30,0 t30,0 t30,0 t30,0 t30,0" fill="none" stroke="' + osc(liq, .25) + '" stroke-width="1.6"><animateTransform attributeName="transform" type="translate" values="0 ' + r1(200 - lvl) + ';-30 0;0 0" dur="1.6s" fill="freeze"/></path></g>';
    if (d3) out += '<rect x="' + (R.in[0] + 5) + '" y="' + (R.top + 6) + '" width="5" height="' + (R.bot - R.top - 16) + '" rx="2.5" fill="#fff" opacity=".55" clip-path="url(#' + id + ')"/>';
    out += '<path d="' + R.out + '" fill="none" stroke="' + T.ink + '" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>';
    if (R.grad) for (var k = 1; k <= 10; k++) { var y = R.bot - k / 10 * (R.bot - R.marca), lg = k % 5 === 0; out += '<line x1="' + R.in[0] + '" y1="' + r1(y) + '" x2="' + (R.in[0] + (lg ? 14 : 8)) + '" y2="' + r1(y) + '" stroke="' + T.ink + '" stroke-width="' + (lg ? 1.6 : 1) + '"/>' + (lg || cap <= 100 && k % 2 === 0 ? tx(R.in[0] + 17, y + 3.5, fmt(cap * k / 10), { f: F, s: 9, c: T.ink, a: 'start' }) : ''); }
    if (et) out += tx(60, 216, et, { f: T.tit, s: 15, c: T.acc, w: 700 });
    return '<svg ' + NS + ' data-plano="1" viewBox="0 0 130 224" style="width:100%;height:auto;display:block">' + out + '</svg>';
  }
  SV.recipiente = recipiente; SV.mapaPais = mapaPais;
  function filaFig(arr) { return '<div style="display:grid;grid-template-columns:repeat(' + arr.length + ',1fr);gap:6mm;max-width:' + (arr.length * 46) + 'mm;margin:0 auto">' + arr.join('') + '</div>'; }
  function genRecipientes(u, C, r) {
    var L = 'ABC', cocina = /^(cocina|reposteria|panaderia|pasteleria|batidos)$/.test(C.mat);
    if (/^(inf|pri1)$/.test(C.bnd || '')) {
      var f = H.pick(r, ['taza', 'vaso']), vs = H.mezcla(r, [1, 5, 9]).map(function (x) { return x * 10; });
      var mx = vs.indexOf(Math.max.apply(null, vs)), mn = vs.indexOf(Math.min.apply(null, vs));
      return { t: 'Lleno, medio y vacío', intro: 'Observa cuánto líquido tiene cada ' + FORMAS[f].n + '.', fig: filaFig(vs.map(function (v, i) { return recipiente(C, f, 100, v, L.charAt(i)); })), items: [mc('¿Qué ' + FORMAS[f].n + ' tiene más?', ['A', 'B', 'C'], L.charAt(mx)), mc('¿Cuál está casi vacío?', ['A', 'B', 'C'], L.charAt(mn))] };
    }
    if (cocina) {
      var cap = 1000, v = [E(r, 2, 9) * 100, E(r, 1, 4) * 250 > 1000 ? 750 : E(r, 1, 4) * 250], tz = v[1] / 250;
      return { t: 'Medir líquidos en la cocina', intro: 'La jarra medidora marca mililitros (mL). Una taza medidora equivale a 250 mL.', fig: filaFig([recipiente(C, 'jarra', cap, v[0], 'A'), recipiente(C, 'jarra', cap, v[1], 'B')]), items: [it('corta', '¿Cuántos mL de leche hay en la jarra A?', v[0] + ' mL', { ac: [v[0], v[0] + 'ml', v[0] + ' ml'] }), it('corta', '¿A cuántas tazas equivale el agua de la jarra B?', fmt(tz), { ac: [fmt(tz), String(tz)] }), it('corta', 'Si juntas las dos jarras, ¿cuántos litros tienes?', fmt((v[0] + v[1]) / 1000) + ' L', { ac: [fmt((v[0] + v[1]) / 1000), String((v[0] + v[1]) / 1000)] }), it('corta', '¿Cuántos mL faltan para llenar la jarra A (1000 mL)?', (1000 - v[0]) + ' mL', { ac: [1000 - v[0]] })] };
    }
    var fs = H.mezcla(r, ['probeta', 'vaso_p', 'jarra']), caps = fs.map(function (f) { return f === 'probeta' ? H.pick(r, [50, 100]) : f === 'vaso_p' ? H.pick(r, [250, 500]) : 1000; });
    var vols = caps.map(function (c) { return c / 10 * E(r, 2, 9); }), tot = vols.reduce(function (s, x) { return s + x; }, 0), mxi = vols.indexOf(Math.max.apply(null, vols));
    var items = fs.map(function (f, i) { return it('corta', '¿Cuántos mL marca el recipiente ' + L.charAt(i) + ' (' + FORMAS[f].n + ')?', fmt(vols[i]) + ' mL', { ac: [fmt(vols[i]), String(vols[i]), vols[i] + 'ml', vols[i] + ' ml'] }); });
    items.push(mc('¿Qué recipiente contiene más líquido?', ['A', 'B', 'C'], L.charAt(mxi)));
    if (!esPeq(C)) items.push(it('corta', 'Expresa en litros el volumen total.', fmt(tot / 1000) + ' L', { ac: [fmt(tot / 1000), String(tot / 1000)] }));
    return { t: 'Lee los recipientes graduados', intro: 'Cada rayita es una décima parte de la capacidad. Lee el nivel en la parte baja de la curva del líquido.', fig: filaFig(fs.map(function (f, i) { return recipiente(C, f, caps[i], vols[i], L.charAt(i)); })), items: items, compacto: true };
  }

  /* ─────────── termómetro ─────────── */
  function termometro(C, t, et) {
    var T = C.T, F = T.cuerpo, y0 = 190, y1 = 30, tmin = -20, tmax = 50, Y = function (v) { return y0 - (v - tmin) / (tmax - tmin) * (y0 - y1); }, out = '', d3 = es3d(C), col = t < 0 ? T.acc : T.acc2;
    if (d3) out += '<rect x="34" y="18" width="30" height="200" rx="15" fill="#000" opacity=".1" transform="translate(2 3)"/>';
    out += '<rect x="34" y="18" width="30" height="200" rx="15" fill="' + (d3 ? clr(T.acc, .88) : '#fff') + '" stroke="' + T.ink + '" stroke-width="2"/><circle cx="49" cy="204" r="12" fill="' + col + '"/>';
    out += '<rect x="45" y="' + r1(Y(t)) + '" width="8" height="' + r1(200 - Y(t)) + '" fill="' + col + '">' + anim('y', 200, r1(Y(t)), 1.8) + anim('height', 0, r1(200 - Y(t)), 1.8) + '</rect>';
    for (var v = tmin; v <= tmax; v += 5) { var lg = v % 10 === 0; out += '<line x1="64" y1="' + r1(Y(v)) + '" x2="' + (64 + (lg ? 9 : 5)) + '" y2="' + r1(Y(v)) + '" stroke="' + T.ink + '" stroke-width="' + (lg ? 1.4 : .8) + '"/>' + (lg ? tx(77, Y(v) + 3.5, v, { f: F, s: 10, c: T.ink, a: 'start' }) : ''); }
    if (d3) out += '<rect x="39" y="26" width="4" height="170" rx="2" fill="#fff" opacity=".6"/>';
    out += tx(55, 234, et, { f: T.tit, s: 14, c: T.acc, w: 700 });
    return '<svg ' + NS + ' data-plano="1" viewBox="0 0 110 240" style="width:100%;height:auto;display:block">' + out + '</svg>';
  }
  function genTermometro(u, C, r) {
    var ciud = H.mezcla(r, Object.keys(window.EU_MAPAS_DATOS || { es: 1 }).map(function (k) { var D = window.EU_MAPAS_DATOS[k]; return D ? D.c[0][0] : 'Madrid'; })).slice(0, 3);
    var ts = ciud.map(function () { return E(r, -3, 8) * 5; }), mx = ts.indexOf(Math.max.apply(null, ts)), mn = ts.indexOf(Math.min.apply(null, ts));
    if (mx === mn) { ts[0] += 10; mx = 0; mn = ts.indexOf(Math.min.apply(null, ts)); }
    var items = ciud.map(function (c, i) { return it('corta', '¿Qué temperatura marca el termómetro de ' + c + '?', ts[i] + ' °C', { ac: [ts[i], ts[i] + '°', ts[i] + '°c', ts[i] + ' °C'] }); });
    items.push(it('corta', '¿Cuántos grados de diferencia hay entre ' + ciud[mx] + ' y ' + ciud[mn] + '?', (ts[mx] - ts[mn]) + ' °C', { ac: [ts[mx] - ts[mn]] }));
    return { t: 'Lee los termómetros', intro: 'Temperatura a mediodía en tres ciudades. Cada rayita vale 5 °C.', fig: filaFig(ciud.map(function (c, i) { return termometro(C, ts[i], c); })), items: esPeq(C) ? items.slice(0, 2) : items, compacto: true };
  }

  /* ─────────── mapa mental radial ─────────── */
  function mapaMental(C, centro, ramas, vacio) {
    var T = C.T, F = T.cuerpo, W = 660, Hh = 440, cx = W / 2, cy = Hh / 2, pal = SV.paleta(C), d3 = es3d(C), n = ramas.length, out = '';
    ramas.forEach(function (rm, i) {
      var a = -Math.PI / 2 + i * 2 * Math.PI / n + .3, bx = cx + Math.cos(a) * 190, by = cy + Math.sin(a) * 140, c = pal[i % pal.length];
      var mx = cx + Math.cos(a) * 90, my = cy + Math.sin(a) * 90 + (i % 2 ? 20 : -20);
      out += '<path d="M' + cx + ',' + cy + ' Q' + r1(mx) + ',' + r1(my) + ' ' + r1(bx) + ',' + r1(by) + '" fill="none" stroke="' + c + '" stroke-width="7" stroke-linecap="round" pathLength="1" stroke-dasharray="1 0">' + anim('stroke-dasharray', '0 1', '1 0', 1.2, '') + '</path>';
      var w = 130, h = 44;
      if (d3) out += '<rect x="' + r1(bx - w / 2 + 3) + '" y="' + r1(by - h / 2 + 4) + '" width="' + w + '" height="' + h + '" rx="22" fill="' + osc(c, .4) + '"/>';
      out += '<rect x="' + r1(bx - w / 2) + '" y="' + r1(by - h / 2) + '" width="' + w + '" height="' + h + '" rx="22" fill="' + (vacio ? '#fff' : c) + '" stroke="' + c + '" stroke-width="2.4"/>';
      if (!vacio) out += txL(bx, by + 5, rm, 16, { f: F, s: 13, c: '#fff', w: 700, n: 2 });
    });
    if (d3) out += '<ellipse cx="' + (cx + 3) + '" cy="' + (cy + 5) + '" rx="96" ry="46" fill="' + osc(T.acc, .45) + '"/>';
    out += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="96" ry="46" fill="#fff" stroke="' + T.acc + '" stroke-width="3.5"/>' + txL(cx, cy + 5, centro, 18, { f: T.tit, s: 16, c: T.ink, w: 700, n: 3 });
    return svg(W, Hh, out, 660);
  }
  function genMental(u, C, r) {
    var ks = (u.k || []).map(function (k) { return S(k, C); }).slice(0, 6);
    if (ks.length < 3) return null;
    var tit = S(String(u.t).split(':')[0], C), vacio = r() < 0.35;
    return vacio ? { t: 'Tu mapa mental', intro: 'Escribe en cada rama una palabra clave de «' + tit + '». Después añade un dibujo pequeño al lado de cada una.', fig: mapaMental(C, tit, ks, true), items: [it('abierta', 'Elige dos ramas y escribe una frase que las una.', ks[0] + ' y ' + ks[1], { lin: 2 })], sol: 'Ramas posibles: ' + ks.join(', ') }
      : { t: 'Mapa mental', intro: 'Las ideas clave de «' + tit + '» salen del centro como ramas.', fig: mapaMental(C, tit, ks, false), items: [it('abierta', 'Añade una rama nueva con otra idea que relaciones con el tema y explica por qué.', '', { lin: 2 })] };
  }

  /* ─────────── mapa conceptual jerárquico ─────────── */
  function genConceptual(u, C, r) {
    var ks = (u.k || []).map(function (k) { return S(k, C); }).slice(0, 4), ideas = (u.i || []).map(function (s) { return S(s, C); });
    if (ks.length < 3) return null;
    var T = C.T, F = T.cuerpo, W = 680, n = ks.length, cw = W / n, d3 = es3d(C), pal = SV.paleta(C), out = '', tit = S(String(u.t).split(':')[0], C);
    var enl = H.mezcla(r, ['incluye', 'se relaciona con', 'se estudia con', 'necesita', 'se explica con']);
    var box = function (x, y, w, h, fill, st, txt, col, s) { return (d3 ? '<rect x="' + (x + 3) + '" y="' + (y + 4) + '" width="' + w + '" height="' + h + '" rx="' + Math.min(T.r, 10) + '" fill="' + osc(st, .45) + '"/>' : '') + '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + Math.min(T.r, 10) + '" fill="' + fill + '" stroke="' + st + '" stroke-width="2"/>' + txL(x + w / 2, y + h / 2 + 4, txt, Math.round(w / 7.5), { f: F, s: s || 12.5, c: col, w: 700, n: 3 }); };
    out += box(W / 2 - 120, 10, 240, 50, T.acc, T.acc, tit, '#fff', 15);
    var hojas = [];
    ks.forEach(function (k, i) {
      var x = i * cw + cw / 2, idea = ideas.filter(function (s) { return s.toLowerCase().indexOf(k.toLowerCase()) >= 0; })[0];
      out += '<path d="M' + (W / 2) + ',60 C' + (W / 2) + ',100 ' + r1(x) + ',96 ' + r1(x) + ',140" fill="none" stroke="' + T.ink + '" stroke-width="1.6" pathLength="1" stroke-dasharray="1 0">' + anim('stroke-dasharray', '0 1', '1 0', 1) + '</path>';
      out += tx(x + (x < W / 2 ? 14 : x > W / 2 ? -14 : 0), 112, enl[i % enl.length], { f: F, s: 11, c: T.acc2, w: 700, a: x < W / 2 ? 'start' : x > W / 2 ? 'end' : 'middle', st: true });
      out += box(x - cw / 2 + 8, 140, cw - 16, 44, '#fff', pal[i % pal.length], H.may(k), T.ink);
      if (idea) { hojas.push(idea); out += '<line x1="' + r1(x) + '" y1="184" x2="' + r1(x) + '" y2="214" stroke="' + T.ink + '" stroke-width="1.4"/>' + box(x - cw / 2 + 6, 214, cw - 12, 76, clr(pal[i % pal.length], .82), pal[i % pal.length], idea.length > 90 ? idea.slice(0, 88) + '…' : idea, T.ink, 11); }
    });
    return { t: 'Mapa conceptual', intro: 'Lee el mapa de arriba abajo: el concepto general, las palabras de enlace y los conceptos que dependen de él.', fig: svg(W, hojas.length ? 300 : 196, out, 680), items: [it('abierta', 'Escribe una frase que empiece por «' + tit + ' ' + enl[0] + '…».', tit + ' ' + enl[0] + ' ' + ks[0], { lin: 2 }), it('corta', '¿Qué palabra de enlace une «' + tit + '» con «' + ks[1] + '»?', enl[1])] };
  }

  var HIST = /^(soci|valores|historia|geografia|ingles|idiomas|conta|lengua)$/, CIEN = /^(natu|mate|tecno|cocina|reposteria|panaderia|pasteleria|batidos|fisica|quimica|bio|anat|geoalg|calculo)$/;
  SV.visual('mental', genMental, { max: 1 });
  SV.visual('conceptual', genConceptual, { max: 1 });
  SV.visual('mapa_pais', genMapa, { materias: HIST, max: 2 });
  SV.visual('coordenadas', genCoordenadas, { materias: /^(soci|mate|geografia|valores|conta|geoalg|calculo)$/, max: 1 });
  SV.visual('recipientes', genRecipientes, { materias: CIEN, max: 2 });
  SV.visual('termometro', genTermometro, { materias: /^(natu|mate|soci|fisica|quimica|geografia|bio|anat|geoalg|calculo)$/, max: 1 });

  /* ─────────── diccionario: test interactivo por tema ─────────── */
  var I = window.EU_IDIOMAS;
  function testDic(pg, C, r) {
    if (!I || !pg.tema) return null;
    var t = pg.tema, pal = H.mezcla(r, t.pal), op = (C.op && C.op.idiomas && C.op.idiomas.length ? C.op.idiomas : Object.keys(I.LENG)), base = (C.op && C.op.base) || 'es', otros = op.filter(function (l) { return l !== base; });
    if (!otros.length) otros = ['en'];
    var w = function (p, lg) { return lg === 'es' ? S(p[lg], C) : p[lg]; }, items = [];
    pal.slice(0, 8).forEach(function (p, i) {
      var lg = otros[i % otros.length], fal = H.mezcla(r, pal.filter(function (q) { return q !== p; })).slice(0, 2), ops = H.mezcla(r, [p].concat(fal).map(function (q) { return w(q, lg); }));
      if (i % 3 === 2) items.push(it('corta', 'Escribe en ' + I.LENG[lg].n.toLowerCase() + ': «' + w(p, base) + '»', p[lg], { ac: [p[lg], String(p[lg]).replace(/^(the|a|an|le|la|les|l'|un|une|der|die|das|de|d|s|es) /i, '')] }));
      else items.push(mc('«' + w(p, base) + '» en ' + I.LENG[lg].n.toLowerCase() + ' es…', ops, w(p, lg)));
    });
    return { tipo: 'vis', num: pg.num, relleno: true, cab: 'Test', tema: t, v: { t: 'Test: ' + t.t[0], intro: 'Marca o escribe la respuesta. En la versión interactiva pulsa «Comprobar» para corregirte.', fig: '', items: items }, items: items };
  }
  var ens = ED.ensamblar;
  SV.visual('dic_test', function (u, C, r) { if (!u.tema) return null; var p = testDic({ tema: u.tema, num: 0 }, C, r); return p && p.v; }, { materias: /^idiomas$/, max: 2 });
  ED.ensamblar = function (cfg) {
    var res = ens(cfg);
    try {
      if (res.C.mat === 'idiomas' && I) {
        var vistos = {};
        res.pages.forEach(function (p, i) {
          if (!p.tema || !/^dic_(practica|tarjetas)$/.test(p.tipo)) return;
          var k = p.tema.id; vistos[k] = (vistos[k] || 0) + 1;
          if (vistos[k] % 2 === 1) { var nv = testDic(p, res.C, H.rng(H.hash(k + ':test:' + i) + (res.C.semilla || 1))); if (nv) res.pages[i] = nv; }
        });
      }
    } catch (e) { console.warn('EU_VISUAL', e); }
    return res;
  };
})();
