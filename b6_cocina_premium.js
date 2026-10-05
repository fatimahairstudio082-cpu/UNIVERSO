/* b6_cocina_premium.js — Cocina premium: panadería, pastelería, repostería y batidos con todos los motores
   (window.EU_COCINA_PREMIUM). Añade al taller visual (EU_TALLER) seis láminas nuevas por receta:
   · Tazas y cucharas: conversión de gramos y mL a tazas, cucharadas y cucharaditas (recipientes de EU_SVG).
   · Punto del azúcar: dial de almíbar (hilo, bola, lámina, quebrado, caramelo) con la ciencia del hervor.
   · Capas del batido: vaso con cada ingrediente como una franja proporcional a su volumen.
   · Escalar la receta: regla de tres y barras con las cantidades nuevas.
   · Templar el chocolate: curva temperatura–tiempo de las tres fases.
   · Molde redondo o cuadrado: misma superficie con distinta forma (geometría transversal).
   Las láminas entran en la rotación del recetario (EU_TALLER.orden) y, en libros de texto, se registran
   con EU_SVG.visual para Cocina, Matemáticas y Ciencias. Cargar después de b6_cerebro_taller.js. */
(function () {
  var ED = window.EU_EDITORIAL, SV = window.EU_SVG, CO = window.EU_COCINA, TA = window.EU_TALLER;
  if (!ED || !SV || !CO || !TA || !SV.visual || window.EU_COCINA_PREMIUM) return;
  var H = ED.H, esc = H.esc, it = H.it, E = H.ent, osc = SV.osc, clr = SV.clr, NS = 'xmlns="http://www.w3.org/2000/svg"', uid = 0;
  var COC = /^(cocina|reposteria|panaderia|pasteleria|batidos)$/;
  function r1(n) { return Math.round(n * 10) / 10; }
  function fmt(n) { return String(Math.round(n * 100) / 100).replace('.', ','); }
  function es3d(C) { return C.prem ? C.prem.dibujo === '3d' : (((C.cfg && C.cfg.acab) || {}).dibujo || '3d') === '3d'; }
  function svg(w, h, body, maxw) { return '<svg ' + NS + ' data-plano="1" viewBox="0 0 ' + w + ' ' + h + '" style="width:100%;max-width:' + (maxw || w) + 'px;height:auto;display:block;margin:0 auto">' + body + '</svg>'; }
  function tx(x, y, s, o) { o = o || {}; return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || 'middle') + '" font-size="' + (o.s || 13) + '" font-family="' + esc(o.f || 'sans-serif') + '" font-weight="' + (o.w || 400) + '" fill="' + (o.c || '#222') + '"' + (o.st ? ' stroke="#fff" stroke-width="3" paint-order="stroke"' : '') + '>' + esc(s) + '</text>'; }
  function ln(a, b, at) { return '<line x1="' + r1(a[0]) + '" y1="' + r1(a[1]) + '" x2="' + r1(b[0]) + '" y2="' + r1(b[1]) + '" ' + at + '/>'; }
  function num(v, ext) { return { ac: [v, fmt(v), String(v)].concat(ext || []) }; }
  function mc(e, ops, bien) { return it('mc', e, 'abc'.charAt(ops.indexOf(bien)) + ') ' + bien, { o: ops, c: ops.indexOf(bien) }); }
  var loc = function (s, C) { return CO.loc ? CO.loc(s, C) : s; };
  function nombre(rc, C) { return loc((rc.al && rc.al[C.pk]) || rc.n, C); }
  function porque(C, s) { return H.guia(C, s, false); }
  function limpio(s, C) { return loc(s, C).replace(/\s*\(.*\)$/, ''); }
  var DENS = [[/harina/i, .53], [/azúcar glas|glas/i, .5], [/azúcar/i, .8], [/cacao/i, .45], [/mantequilla|margarina/i, .95], [/aceite/i, .92], [/miel/i, 1.4], [/sal\b/i, 1.2], [/levadura/i, .6], [/avena/i, .4], [/yogur/i, 1.03], [/leche|agua|zumo|jugo|nata|crema/i, 1]];
  function dens(n) { for (var i = 0; i < DENS.length; i++) if (DENS[i][0].test(n)) return DENS[i][1]; return 0; }

  /* ─────────── 1 · Tazas y cucharas ─────────── */
  function cuchara(C, x, y, g, et) {
    var T = C.T, rx = g ? 16 : 11, ry = g ? 10 : 7, L = g ? 58 : 44;
    return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="' + clr(T.acc, .55) + '" stroke="' + T.ink + '" stroke-width="1.5"/>' +
      '<path d="M' + (x + rx - 2) + ',' + (y - 2) + ' L' + (x + rx + L) + ',' + (y - 6) + ' L' + (x + rx + L) + ',' + (y + 1) + ' L' + (x + rx - 2) + ',' + (y + 3) + ' Z" fill="' + clr(T.ink, .6) + '" stroke="' + T.ink + '" stroke-width="1.2"/>' +
      (et ? tx(x + 10, y + ry + 16, et, { f: T.cuerpo, s: 11, c: T.ink, w: 700 }) : '');
  }
  function medidas(rc, C, r) {
    var L = rc.ing.map(function (g) { var d = g[1] === 'ml' ? 1 : g[1] === 'g' ? dens(g[2]) : 0; return d ? { n: limpio(g[2], C), g: g[0], u: g[1], ml: Math.round(g[0] / d) } : null; }).filter(Boolean);
    if (L.length < 2 || !SV.recipiente) return null;
    var gran = L.slice().sort(function (a, b) { return b.ml - a.ml; })[0], peq = L.filter(function (x) { return x.ml <= 60 && x !== gran; })[0];
    var tz = Math.round(gran.ml / 250 * 100) / 100, T = C.T;
    var capJ = gran.ml > 500 ? 1000 : gran.ml > 250 ? 500 : 250, taza = SV.recipiente(C, 'jarra', capJ, Math.min(capJ, gran.ml), gran.ml + ' mL');
    var cuch = '', cda = 0, cdta = 0;
    if (peq) { cda = Math.floor(peq.ml / 15); cdta = Math.round((peq.ml - cda * 15) / 5); var s = ''; var x = 30; for (var i = 0; i < Math.min(cda, 4); i++) { s += cuchara(C, x, 40 + i * 44, true, i === 0 ? 'cda. = 15 mL' : ''); } for (var j = 0; j < Math.min(cdta, 3); j++) s += cuchara(C, 150, 40 + j * 44, false, j === 0 ? 'cdta. = 5 mL' : ''); cuch = svg(240, 40 + Math.max(cda, cdta, 1) * 44 + 10, s, 220); }
    var fig = '<div style="display:grid;grid-template-columns:' + (cuch ? '1fr 1.3fr' : '1fr') + ';gap:8mm;align-items:center;max-width:150mm;margin:0 auto"><div style="max-width:48mm;margin:0 auto;width:100%">' + taza + '</div>' + cuch + '</div>' +
      '<div style="display:flex;gap:6mm;justify-content:center;flex-wrap:wrap;margin-top:2mm;font-size:.9em"><span><b>Taza:</b> ' + esc(gran.n) + ' (' + gran.g + ' ' + gran.u + ')</span>' + (peq ? '<span><b>Cucharas:</b> ' + esc(peq.n) + ' (' + peq.g + ' ' + peq.u + ')</span>' : '') + '</div>';
    var items = [it('corta', '¿A cuántas tazas de 250 mL equivalen ' + gran.g + ' ' + gran.u + ' de ' + gran.n + '? (dos decimales)', fmt(tz), num(tz))];
    if (gran.u === 'g') items.push(it('corta', 'Si 1 taza de ' + gran.n + ' pesa ' + Math.round(250 * dens(gran.n)) + ' g, ¿cuántos gramos son media taza?', Math.round(125 * dens(gran.n)) + ' g', num(Math.round(125 * dens(gran.n)))));
    if (peq) items.push(it('corta', '¿Cuántas cucharaditas de 5 mL caben en ' + peq.ml + ' mL de ' + peq.n + '?', Math.round(peq.ml / 5), num(Math.round(peq.ml / 5))));
    items.push(mc('¿Por qué una taza de harina pesa menos que una de azúcar?', H.mezcla(r, ['la harina tiene más aire entre sus granos', 'la harina está más fría', 'el azúcar tiene agua']), 'la harina tiene más aire entre sus granos'));
    return { t: 'Tazas y cucharas', intro: 'Conversión de «' + nombre(rc, C) + '» a medidas caseras. Una taza son 250 mL, una cucharada 15 mL y una cucharadita 5 mL.', fig: fig + porque(C, 'La taza mide volumen, no peso. Cada ingrediente tiene su densidad: una taza de agua pesa 250 g, pero una de harina tamizada apenas 130 g. Por eso los pasteleros pesan y los recetarios caseros «enrasan» la taza con un cuchillo.'), items: items };
  }

  /* ─────────── 2 · Punto del azúcar ─────────── */
  var PUNTOS = [[100, 112, 'hilo', 108, 'almíbar para bizcochos borrachos'], [112, 121, 'bola', 118, 'merengue italiano y fondant'], [121, 146, 'lámina', 135, 'turrones blandos'], [146, 160, 'quebrado', 150, 'caramelo duro y crocantes'], [160, 180, 'caramelo', 170, 'flanes y salsas de caramelo']];
  function azucar(rc, C, r) {
    if (!rc.ing.some(function (g) { return /azúcar/i.test(g[2]); }) || rc.cat === 'batidos' || !TA.dial) return null;
    var txt = rc.s.join(' '), P = /caramel/i.test(txt) ? PUNTOS[4] : /merengue/i.test(txt) ? PUNTOS[1] : H.pick(r, PUNTOS), T = C.T;
    var zonas = PUNTOS.map(function (p, i) { return [p[0], p[1], i % 2 ? clr(T.acc2, .35 + i * .08) : clr(T.acc, .3 + i * .1), p[2]]; });
    var Fh = Math.round(P[3] * 9 / 5 + 32);
    var items = [it('corta', '¿Qué temperatura marca el termómetro de almíbar?', P[3] + ' °C', num(P[3])), mc('¿En qué punto está el azúcar?', H.mezcla(r, [P[2]].concat(H.mezcla(r, PUNTOS.filter(function (p) { return p[2] !== P[2]; })).slice(0, 2).map(function (p) { return p[2]; }))), P[2]), it('corta', 'Pásalo a grados Fahrenheit: °F = °C × 9 ÷ 5 + 32.', Fh + ' °F', num(Fh))];
    return { t: 'El punto del azúcar', intro: 'En repostería el almíbar se mide con termómetro. A ' + P[3] + ' °C está en punto de ' + P[2] + ': el que se usa para ' + P[4] + '.', fig: TA.dial(C, 100, 180, P[3], zonas, '°C', 'punto de ' + P[2]) + porque(C, 'El agua sola hierve a 100 °C, pero con azúcar disuelto hierve a más temperatura. Cuanta más agua se evapora, más concentrado queda el almíbar y más sube el termómetro: por eso cada grado es una textura distinta, del hilo blando al caramelo que cruje.'), items: items };
  }

  /* ─────────── 3 · Capas del batido ─────────── */
  function capas(rc, C, r) {
    if (rc.cat !== 'batidos') return null;
    var L = rc.ing.filter(function (g) { return g[1] === 'g' || g[1] === 'ml'; }).map(function (g) { return { n: limpio(g[2], C), v: g[0], liq: g[1] === 'ml' }; });
    if (L.length < 2) return null;
    L.sort(function (a, b) { return (b.liq ? 1 : 0) - (a.liq ? 1 : 0); });
    var T = C.T, tot = L.reduce(function (s, x) { return s + x.v; }, 0), id = 'eubt' + (++uid), top = 40, bot = 330, xt = [70, 230], xb = [95, 205], d3 = es3d(C), pal = SV.paleta(C), out = '';
    var vaso = 'M' + xt[0] + ',' + top + ' L' + xt[1] + ',' + top + ' L' + xb[1] + ',' + bot + ' Q150,' + (bot + 12) + ' ' + xb[0] + ',' + bot + ' Z';
    out += '<defs><clipPath id="' + id + '"><path d="' + vaso + '"/></clipPath></defs>';
    if (d3) out += '<ellipse cx="150" cy="' + (bot + 10) + '" rx="70" ry="8" fill="#000" opacity=".15"/>';
    var y = bot + 6, lleno = .9, alto = (bot - top) * lleno;
    L.forEach(function (x, i) { var h = alto * x.v / tot, c = pal[i % pal.length]; out += '<rect x="40" y="' + r1(y - h) + '" width="220" height="' + r1(h + .5) + '" fill="' + clr(c, .2) + '" clip-path="url(#' + id + ')"><animate attributeName="y" from="' + r1(bot + 6) + '" to="' + r1(y - h) + '" dur=".9s" begin="' + (i * .3) + 's" fill="freeze"/></rect>'; var pc = Math.round(x.v / tot * 100); out += ln([xb[1] + (xt[1] - xb[1]) * (1 - (y - h / 2 - top) / (bot - top)) + 6, y - h / 2], [262, y - h / 2], 'stroke="' + T.ink + '" stroke-width="1"') + tx(268, y - h / 2 + 4, x.n + ' · ' + pc + ' %', { f: T.cuerpo, s: 12.5, c: T.ink, w: 700, a: 'start' }); y -= h; });
    out += '<path d="' + vaso + '" fill="none" stroke="' + T.ink + '" stroke-width="3"/>' + (d3 ? '<path d="M' + (xt[0] + 14) + ',' + (top + 10) + ' L' + (xb[0] + 10) + ',' + (bot - 14) + '" stroke="#fff" stroke-width="5" opacity=".5" stroke-linecap="round"/>' : '');
    var fruta = L.filter(function (x) { return !x.liq; }).reduce(function (s, x) { return s + x.v; }, 0), pf = Math.round(fruta / tot * 100), vasos = H.pick(r, [3, 4, 5]);
    var items = [it('corta', '¿Cuántos mL tiene el batido en total (cuenta 1 g ≈ 1 mL)?', tot + ' mL', num(tot)), it('corta', '¿Qué porcentaje del vaso es fruta y sólidos?', pf + ' %', num(pf, [pf + '%'])), it('corta', 'Para ' + vasos + ' vasos, ¿cuántos mL de ' + L[0].n + ' necesitas?', L[0].v * vasos + ' mL', num(L[0].v * vasos))];
    return { t: 'Las capas del batido', intro: 'Si «' + nombre(rc, C) + '» no se mezclara, cada ingrediente ocuparía esta franja del vaso.', fig: svg(470, bot + 22, out, 460) + porque(C, 'El líquido va primero en la batidora porque ayuda a que las cuchillas giren sin atascarse. Al triturar, la fibra de la fruta atrapa aire y el batido espesa; si reposa, los trozos más densos bajan al fondo y el aire sube.'), items: items };
  }

  /* ─────────── 4 · Escalar la receta ─────────── */
  function escalado(rc, C, r) {
    var L = rc.ing.filter(function (g) { return g[1] === 'g' || g[1] === 'ml'; }).slice(0, 5);
    if (L.length < 3 || !rc.p || !SV.barras) return null;
    var p0 = rc.p, p1 = H.pick(r, [p0 * 2, p0 * 3, Math.max(1, Math.round(p0 / 2)), p0 + 2]); if (p1 === p0) p1 = p0 * 2;
    var f = p1 / p0, T = C.T, nuevos = L.map(function (g) { return Math.round(g[0] * f); });
    var fig = SV.barras(C, { cats: L.map(function (g) { return limpio(g[2], C).split(' ')[0]; }), vals: nuevos, unidad: 'g o mL para ' + p1 + ' porciones', valores: true });
    var tabla = '<table style="border-collapse:collapse;margin:3mm auto 0;font-size:.9em;font-variant-numeric:tabular-nums"><tr><th style="text-align:left;padding:1.2mm 3mm;border-bottom:1px solid ' + T.ink + '">Ingrediente</th><th style="padding:1.2mm 3mm;border-bottom:1px solid ' + T.ink + '">' + p0 + ' porc.</th><th style="padding:1.2mm 3mm;border-bottom:1px solid ' + T.ink + ';color:' + T.acc + '">' + p1 + ' porc.</th></tr>' +
      L.map(function (g, i) { return '<tr><td style="padding:1mm 3mm;border-bottom:1px solid ' + T.soft + '">' + esc(limpio(g[2], C)) + '</td><td style="padding:1mm 3mm;text-align:right;border-bottom:1px solid ' + T.soft + '">' + g[0] + ' ' + g[1] + '</td><td style="padding:1mm 3mm;text-align:right;border-bottom:1px solid ' + T.soft + '">' + (i === 1 ? '?' : nuevos[i] + ' ' + g[1]) + '</td></tr>'; }).join('') + '</table>';
    var items = [it('corta', '¿Por cuánto se multiplica cada ingrediente para pasar de ' + p0 + ' a ' + p1 + ' porciones?', fmt(f), num(Math.round(f * 100) / 100)), it('corta', 'Completa la casilla ? de la tabla (' + limpio(L[1][2], C) + ').', nuevos[1] + ' ' + L[1][1], num(nuevos[1])), mc('¿Qué NO se multiplica igual al escalar?', H.mezcla(r, ['el tiempo de horno', 'la harina', 'la leche']), 'el tiempo de horno')];
    return { t: 'Escalar la receta', intro: '«' + nombre(rc, C) + '» es para ' + p0 + ' porciones. Así queda para ' + p1 + '.', fig: fig + tabla + porque(C, 'Escalar es una regla de tres: todos los ingredientes se multiplican por el mismo factor y la receta guarda sus proporciones. El tiempo de horno no: depende del grosor de la pieza, no de la cantidad total. Dos bizcochos iguales tardan lo mismo que uno.'), items: items };
  }

  /* ─────────── 5 · Templar el chocolate ─────────── */
  function temple(rc, C, r) {
    if (!/chocolate/i.test(rc.ing.map(function (g) { return g[2]; }).join(' ') + rc.s.join(' '))) return null;
    var T = C.T, tipo = H.pick(r, [['negro', 50, 28, 31], ['con leche', 45, 27, 29]]), W = 560, Hh = 300, ml = 50, mb = 40, mt = 20, tm = 14;
    var X = function (t) { return ml + t / tm * (W - ml - 20); }, Y = function (c) { return Hh - mb - (c - 15) / 45 * (Hh - mb - mt); }, out = '';
    for (var c = 20; c <= 60; c += 10) out += ln([ml, Y(c)], [W - 20, Y(c)], 'stroke="' + T.soft + '" stroke-width="1"') + tx(ml - 8, Y(c) + 4, c + ' °C', { f: T.cuerpo, s: 11, c: T.ink, a: 'end' });
    for (var t = 0; t <= tm; t += 2) out += tx(X(t), Hh - mb + 18, t, { f: T.cuerpo, s: 11, c: T.ink });
    out += tx((W + ml) / 2, Hh - 4, 'minutos', { f: T.cuerpo, s: 11, c: T.ink });
    var pts = [[0, 22], [4, tipo[1]], [5, tipo[1]], [10, tipo[2]], [12, tipo[3]], [14, tipo[3]]], d = 'M' + pts.map(function (p) { return r1(X(p[0])) + ',' + r1(Y(p[1])); }).join(' L');
    out += '<path d="' + d + '" fill="none" stroke="' + T.acc2 + '" stroke-width="4" stroke-linejoin="round" stroke-dasharray="900" stroke-dashoffset="0"><animate attributeName="stroke-dashoffset" from="900" to="0" dur="2s" fill="freeze"/></path>';
    [[4.5, tipo[1], '1 · fundir'], [10, tipo[2], '2 · enfriar'], [13, tipo[3], '3 · recalentar']].forEach(function (e) { out += '<circle cx="' + r1(X(e[0])) + '" cy="' + r1(Y(e[1])) + '" r="6" fill="' + T.acc + '" stroke="#fff" stroke-width="2"/>' + tx(X(e[0]), Y(e[1]) - 14, e[2] + ' · ' + e[1] + ' °C', { f: T.cuerpo, s: 12, c: T.ink, w: 700, st: true }); });
    var fig = svg(W, Hh, out, 560);
    var items = [it('corta', '¿Hasta qué temperatura se funde el chocolate ' + tipo[0] + '?', tipo[1] + ' °C', num(tipo[1])), it('corta', '¿Cuántos grados baja entre la fase 1 y la 2?', (tipo[1] - tipo[2]) + ' °C', num(tipo[1] - tipo[2])), mc('Si no se templa, el chocolate…', H.mezcla(r, ['queda mate y con manchas blancas', 'sabe salado', 'se vuelve líquido para siempre']), 'queda mate y con manchas blancas')];
    return { t: 'Templar el chocolate', intro: 'Curva de temperatura para templar chocolate ' + tipo[0] + ': fundir, enfriar y volver a calentar un poco.', fig: fig + porque(C, 'La manteca de cacao puede cristalizar de seis formas distintas y solo una da brillo y un «crac» limpio. Al fundir se borran todos los cristales; al enfriar se forman muchos; al recalentar un poco se funden los malos y quedan solo los buenos.'), items: items };
  }

  /* ─────────── 6 · Molde redondo o cuadrado ─────────── */
  function moldeRect(rc, C, r) {
    var m = /molde (?:redondo )?de (\d+) ?cm/i.exec(rc.s.join(' ')); if (!m) return null;
    var d = +m[1], A = Math.round(3.14 * d * d / 4), l = Math.round(Math.sqrt(A) * 10) / 10, T = C.T, k = 7, R = d / 2 * k, d3 = es3d(C), out = '', cy = 30 + R;
    var sombra = function (s) { return d3 ? s.replace(/fill="[^"]+"/, 'fill="#000"').replace(/<(\w+) /, '<$1 opacity=".14" transform="translate(4 5)" ') : ''; };
    var circ = '<circle cx="' + (30 + R) + '" cy="' + cy + '" r="' + r1(R) + '" fill="' + clr(T.acc, .6) + '" stroke="' + T.ink + '" stroke-width="2.5"/>', L2 = l * k, xq = 90 + 2 * R;
    var cuad = '<rect x="' + r1(xq) + '" y="' + r1(cy - L2 / 2) + '" width="' + r1(L2) + '" height="' + r1(L2) + '" fill="' + clr(T.acc2, .6) + '" stroke="' + T.ink + '" stroke-width="2.5"/>';
    out += sombra(circ) + circ + sombra(cuad) + cuad + ln([30, cy], [30 + 2 * R, cy], 'stroke="' + T.ink + '" stroke-width="1.5"') + tx(30 + R, cy - 8, d + ' cm', { f: T.cuerpo, s: 14, c: T.ink, w: 700, st: true }) + tx(xq + L2 / 2, cy - L2 / 2 - 8, '¿lado?', { f: T.cuerpo, s: 14, c: T.acc2, w: 700 }) + tx((30 + xq + L2) / 2, cy + Math.max(R, L2 / 2) + 26, 'misma superficie: ' + A + ' cm²', { f: T.cuerpo, s: 13, c: T.ink, w: 700 });
    var fig = svg(xq + L2 + 30, cy + Math.max(R, L2 / 2) + 36, out, 520);
    var items = [it('corta', 'Área del molde redondo de ' + d + ' cm (π ≈ 3,14, redondea).', A + ' cm²', num(A)), it('corta', '¿Cuánto mide el lado de un molde cuadrado con la misma área? (raíz cuadrada, un decimal)', fmt(l) + ' cm', num(l)), mc('Un molde cuadrado de ' + d + ' cm de lado, ¿necesita más o menos masa que el redondo de ' + d + ' cm?', ['más', 'menos', 'la misma'], 'más')];
    return { t: 'Molde redondo o cuadrado', intro: '«' + nombre(rc, C) + '» pide un molde redondo de ' + d + ' cm. ¿Qué molde cuadrado da el mismo grosor?', fig: fig + porque(C, 'Si la superficie es la misma, la masa sube a la misma altura y el tiempo de horno no cambia. Un cuadrado del mismo ancho que el diámetro tiene un 27 % más de área: la masa quedaría más fina y se secaría antes.'), items: items };
  }

  var NUEVOS = { medidas: medidas, azucar: azucar, capas: capas, escalado: escalado, temple: temple, molde_rect: moldeRect };
  Object.keys(NUEVOS).forEach(function (k) { TA.generadores[k] = NUEVOS[k]; if (TA.orden && TA.orden.indexOf(k) < 0) TA.orden.push(k); });

  /* ─────────── libros de texto ─────────── */
  function recDe(u, C, r) {
    var cat = u.cat || (COC.test(C.mat) && C.mat !== 'cocina' ? C.mat : null), L = CO.RECETAS.filter(function (x) { return !x.gen && (!cat || x.cat === cat); });
    if (!L.length) L = CO.RECETAS.filter(function (x) { return !x.gen; });
    return L.length ? H.pick(r, L) : null;
  }
  function gen(tipos, pref) {
    return function (u, C, r) {
      var ini = Math.floor(r() * tipos.length);
      for (var q = 0; q < tipos.length * 2; q++) {
        var rc = recDe(u, C, r); if (!rc) return null;
        var V = null; try { V = NUEVOS[tipos[(ini + q) % tipos.length]](rc, C, r); } catch (e) { console.warn('cocina premium', e); }
        if (V) { V.items.forEach(function (x) { x.e = H.sub(x.e, C); }); if (pref) V.t = pref + V.t.charAt(0).toLowerCase() + V.t.slice(1); return V; }
      }
      return null;
    };
  }
  SV.visual('coc_premium', gen(Object.keys(NUEVOS)), { materias: COC, max: 3 });
  SV.visual('coc_premium_mate', gen(['escalado', 'molde_rect', 'medidas'], 'La matemática en la cocina: '), { materias: /^(mate|conta|geoalg|calculo)$/, max: 1 });
  SV.visual('coc_premium_ciencia', gen(['azucar', 'temple'], 'La ciencia en la cocina: '), { materias: /^(fisica|quimica|natu)$/, max: 1 });

  window.EU_COCINA_PREMIUM = { generadores: NUEVOS, cuchara: cuchara };
})();
