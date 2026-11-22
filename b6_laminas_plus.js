/* b6_laminas_plus.js — Más láminas para Matemáticas, Contabilidad, Física, Química y Dibujo técnico, y
   relleno inteligente de páginas (window.EU_LAMINAS_PLUS).
   Reutiliza los motores que ya existen (recipientes, barras, sectores, funciones, dial) y añade:
   · Matemáticas: fracciones en vasos graduados, porcentaje en cuadrícula 100, Pitágoras con cuadrados,
     estadística (media, mediana, moda), probabilidad con ruleta.
   · Contabilidad: factura con el IVA del país, balance de situación, punto de equilibrio, flujo de caja,
     libro diario con cuentas T.
   · Química: colorimetría (tinte + oxidante en probetas, volúmenes de peróxido y círculo cromático
     corrector), diluciones C₁V₁ = C₂V₂ con recipientes, escala de pH.
   · Física: circuito en serie y en paralelo, gráfica posición–tiempo, plano inclinado.
   · Dibujo técnico: piezas de cubos en isométrico (cada semilla, una pieza distinta) con papel para vistas.
   Relleno inteligente: tras ensamblar un libro se mide cada página; si queda más de 55 mm libres, se añade
   un bloque «Un paso más» con una figura de la misma materia, una o dos preguntas y la solución invertida.
   Se desactiva con cfg.acab.relleno = 'no'. Cargar después de b6_anatomia_transversal.js. */
(function () {
  var ED = window.EU_EDITORIAL, SV = window.EU_SVG;
  if (!ED || !SV || !SV.visual || window.EU_LAMINAS_PLUS) return;
  var H = ED.H, esc = H.esc, it = H.it, E = H.ent, osc = SV.osc, clr = SV.clr, NS = 'xmlns="http://www.w3.org/2000/svg"', uid = 0, MM = 3.7795;
  function r1(n) { return Math.round(n * 10) / 10; }
  function fmt(n, d) { var k = Math.pow(10, d == null ? 2 : d); return String(Math.round(n * k) / k).replace('.', ','); }
  function es3d(C) { return C.prem ? C.prem.dibujo === '3d' : (((C.cfg && C.cfg.acab) || {}).dibujo || '3d') === '3d'; }
  function esPeq(C) { return /^(inf|pri1|pri2)$/.test(C.bnd || ''); }
  function svg(w, h, body, maxw) { return '<svg ' + NS + ' data-plano="1" viewBox="0 0 ' + r1(w) + ' ' + r1(h) + '" style="width:100%;max-width:' + (maxw || w) + 'px;height:auto;display:block;margin:0 auto">' + body + '</svg>'; }
  function tx(x, y, s, o) { o = o || {}; return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || 'middle') + '" font-size="' + (o.s || 13) + '" font-family="' + esc(o.f || 'sans-serif') + '" font-weight="' + (o.w || 400) + '" fill="' + (o.c || '#222') + '"' + (o.st ? ' stroke="#fff" stroke-width="3" paint-order="stroke"' : '') + '>' + esc(s) + '</text>'; }
  function ln(a, b, at) { return '<line x1="' + r1(a[0]) + '" y1="' + r1(a[1]) + '" x2="' + r1(b[0]) + '" y2="' + r1(b[1]) + '" ' + at + '/>'; }
  function rect(x, y, w, h, at) { return '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(w) + '" height="' + r1(h) + '" ' + at + '/>'; }
  function poly(p, at) { return '<polygon points="' + p.map(function (q) { return r1(q[0]) + ',' + r1(q[1]); }).join(' ') + '" ' + at + '/>'; }
  function num(v, ext) { return { ac: [v, fmt(v), String(v)].concat(ext || []) }; }
  function mc(e, ops, bien) { return it('mc', e, 'abc'.charAt(ops.indexOf(bien)) + ') ' + bien, { o: ops, c: ops.indexOf(bien) }); }
  function porque(C, s) { return H.guia(C, s, false); }
  function con(C, cols) { return Object.assign({}, C, { T: Object.assign({}, C.T, cols) }); }
  function din(v, C) { return H.din ? H.din(v, C) : fmt(v); }
  function base(C) { return (C.P && C.P.precios && C.P.precios[2] && C.P.precios[2][1]) || 1; }
  function redo(v, C) { var b = base(C), q = b >= 1000 ? 100 : b >= 100 ? 10 : 1; return Math.max(q, Math.round(v / q) * q); }

  /* ═════════ MATEMÁTICAS ═════════ */
  function genFracVasos(u, C, r) {
    if (!SV.recipiente) return null;
    var d = H.pick(r, [4, 5, 6, 8]), ns = H.mezcla(r, [1, 2, 3, 4, 5, 6, 7].filter(function (x) { return x < d; })).slice(0, 3), L = 'ABC';
    var figs = ns.map(function (n, i) { return '<div style="text-align:center">' + SV.recipiente(C, 'probeta', d, n, L.charAt(i)) + '<div style="font-weight:700;margin-top:1mm">' + L.charAt(i) + '</div></div>'; }).join('');
    var mx = ns.indexOf(Math.max.apply(null, ns)), s2 = ns[0] + ns[1];
    var items = [it('corta', 'Cada probeta tiene ' + d + ' partes iguales. ¿Qué fracción está llena en A?', ns[0] + '/' + d, { ac: [ns[0] + '/' + d] }), it('corta', '¿Qué probeta tiene más líquido?', L.charAt(mx), { ac: [L.charAt(mx), L.charAt(mx).toLowerCase()] })];
    if (!esPeq(C)) items.push(it('corta', 'Si vacías A y B en una probeta igual, ¿qué fracción se llena? ' + (s2 > d ? '(puede pasar de 1)' : ''), s2 + '/' + d, { ac: [s2 + '/' + d] }));
    return { t: 'Fracciones en el laboratorio', intro: 'Una fracción dice cuántas partes de un total están llenas. Aquí el total es cada probeta.', fig: '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8mm;max-width:130mm;margin:0 auto">' + figs + '</div>' + porque(C, 'El denominador cuenta las partes en que se divide el todo y el numerador, las que se toman. Con el mismo denominador, compara solo los numeradores.'), items: items };
  }
  function genPorcentaje(u, C, r) {
    var T = C.T, p = H.pick(r, [12, 15, 20, 25, 30, 35, 40, 45, 60, 75]), c = 26, out = '', d3 = es3d(C);
    for (var i = 0; i < 100; i++) { var x = (i % 10) * c, y = Math.floor(i / 10) * c, on = i < p; out += rect(x + 1, y + 1, c - 2, c - 2, 'rx="' + Math.min(T.r, 4) + '" fill="' + (on ? T.acc : T.soft) + '"' + (on && d3 ? ' stroke="' + osc(T.acc, .3) + '" stroke-width="1"' : '')); }
    var g = function (a, b) { return b ? g(b, a % b) : a; }, k = g(p, 100), pr = redo(base(C) * E(r, 20, 90), C), desc = Math.round(pr * p / 100);
    var items = [it('corta', '¿Qué porcentaje de la cuadrícula está coloreado?', p + ' %', num(p, [p + '%'])), it('corta', 'Escríbelo como fracción simplificada.', (p / k) + '/' + (100 / k), { ac: [(p / k) + '/' + (100 / k)] })];
    if (!esPeq(C)) items.push(it('corta', 'Un artículo cuesta ' + din(pr, C) + ' y tiene un ' + p + ' % de descuento. ¿Cuánto pagas?', din(pr - desc, C), num(pr - desc)));
    return { t: 'El porcentaje en una cuadrícula', intro: 'La cuadrícula tiene 100 cuadros: cada cuadro es el 1 %.', fig: svg(260, 260, out, 260) + porque(C, '«Por ciento» significa «de cada cien». Un 25 % es lo mismo que 25/100 = 1/4: la cuarta parte.'), items: items };
  }
  function genPitagoras(u, C, r) {
    var T = C.T, tr = H.pick(r, [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10]]), k = tr[2] > 10 ? 9 : 14, a = tr[0] * k, b = tr[1] * k, ox = 40 + b, oy = 30 + a + b * 0, out = '';
    ox = 30 + a; oy = 30 + b;
    var A = [ox, oy], B = [ox + a, oy], Cc = [ox, oy - b];
    var cuad = function (p, q, col, n, lado) { var dx = q[0] - p[0], dy = q[1] - p[1], nx = dy, ny = -dx, s = ''; var pts = [p, q, [q[0] + nx, q[1] + ny], [p[0] + nx, p[1] + ny]]; s += poly(pts, 'fill="' + clr(col, .6) + '" stroke="' + col + '" stroke-width="2"'); for (var i = 1; i < n; i++) { var t = i / n; s += ln([p[0] + dx * t, p[1] + dy * t], [p[0] + dx * t + nx, p[1] + dy * t + ny], 'stroke="' + col + '" stroke-width=".7" opacity=".6"') + ln([p[0] + nx * t, p[1] + ny * t], [q[0] + nx * t, q[1] + ny * t], 'stroke="' + col + '" stroke-width=".7" opacity=".6"'); } var cx = (p[0] + q[0] + nx) / 2, cy = (p[1] + q[1] + ny) / 2; return s + tx(cx, cy + 5, lado, { f: T.cuerpo, s: 14, c: T.ink, w: 700, st: true }); };
    out += cuad(B, A, T.acc, tr[0], tr[0] + '² = ' + tr[0] * tr[0]) + cuad(A, Cc, T.acc2, tr[1], tr[1] + '² = ' + tr[1] * tr[1]) + cuad(Cc, B, osc(T.acc, .3), tr[2], '?');
    out += poly([A, B, Cc], 'fill="' + T.bg + '" stroke="' + T.ink + '" stroke-width="2.5"') + rect(ox, oy - 12, 12, 12, 'fill="none" stroke="' + T.ink + '" stroke-width="1.5"');
    var xs = [A[0], B[0], Cc[0], B[0] + b, Cc[0] - b, A[0] - a], ys = [A[1], B[1], Cc[1], B[1] + a, Cc[1] - b, A[1] + a];
    var mnx = Math.min.apply(null, xs.concat([ox - b])), mxx = Math.max.apply(null, xs.concat([ox + a + b])), mny = Math.min.apply(null, ys.concat([oy - b - a])), mxy = Math.max.apply(null, ys.concat([oy + a]));
    var fig = '<svg ' + NS + ' data-plano="1" viewBox="' + r1(mnx - 10) + ' ' + r1(mny - 10) + ' ' + r1(mxx - mnx + 20) + ' ' + r1(mxy - mny + 20) + '" style="width:100%;max-width:340px;height:auto;display:block;margin:0 auto">' + out + '</svg>';
    var items = [it('corta', 'Suma las áreas de los dos cuadrados pequeños.', tr[0] * tr[0] + tr[1] * tr[1], num(tr[0] * tr[0] + tr[1] * tr[1])), it('corta', '¿Cuánto mide la hipotenusa?', tr[2], num(tr[2])), it('corta', 'Una escalera de ' + (tr[2] * 50) + ' cm se apoya a ' + (tr[0] * 50) + ' cm de la pared. ¿A qué altura llega?', tr[1] * 50 + ' cm', num(tr[1] * 50))];
    return { t: 'El teorema de Pitágoras', intro: 'En un triángulo rectángulo, el cuadrado de la hipotenusa es igual a la suma de los cuadrados de los catetos: c² = a² + b².', fig: fig + porque(C, 'Los albañiles lo usan para comprobar esquinas rectas: marcan 3 m en una pared y 4 m en la otra; si la diagonal mide 5 m, el ángulo es recto.'), items: items };
  }
  var DATOS = [['Notas de un examen', 'puntos', [3, 10]], ['Horas de sueño', 'horas', [5, 10]], ['Goles por partido', 'goles', [0, 5]], ['Libros leídos al mes', 'libros', [0, 6]], ['Temperatura máxima', '°C', [14, 32]]];
  function genEstadistica(u, C, r) {
    var T = C.T, D0 = H.pick(r, DATOS), n = E(r, 7, 9), v = []; for (var i = 0; i < n; i++) v.push(E(r, D0[2][0], D0[2][1]));
    var s = v.slice().sort(function (a, b) { return a - b; }), media = v.reduce(function (a, b) { return a + b; }, 0) / n, med = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
    var f = {}; v.forEach(function (x) { f[x] = (f[x] || 0) + 1; }); var moda = +Object.keys(f).sort(function (a, b) { return f[b] - f[a] || a - b; })[0];
    var mn = D0[2][0], mx = D0[2][1], W = 520, Hh = 60 + Math.max.apply(null, Object.keys(f).map(function (k) { return f[k]; })) * 26, X = function (x) { return 30 + (x - mn) / (mx - mn) * (W - 60); }, out = ln([20, Hh - 30], [W - 20, Hh - 30], 'stroke="' + T.ink + '" stroke-width="2"'), cnt = {};
    for (var x = mn; x <= mx; x++) out += ln([X(x), Hh - 34], [X(x), Hh - 26], 'stroke="' + T.ink + '"') + tx(X(x), Hh - 10, x, { f: T.cuerpo, s: 12, c: T.ink });
    v.forEach(function (x) { cnt[x] = (cnt[x] || 0) + 1; out += '<circle cx="' + r1(X(x)) + '" cy="' + (Hh - 30 - cnt[x] * 24) + '" r="10" fill="' + T.acc + '" stroke="' + T.bg + '" stroke-width="2"/>'; });
    out += ln([X(media), 10], [X(media), Hh - 30], 'stroke="' + T.acc2 + '" stroke-width="2" stroke-dasharray="6 4"') + tx(X(media), 12, 'media', { f: T.cuerpo, s: 11, c: T.acc2, w: 700 });
    var tabla = '<div style="display:flex;gap:1.5mm;justify-content:center;flex-wrap:wrap;margin:2mm 0">' + v.map(function (x) { return '<span style="min-width:9mm;text-align:center;border:1px solid ' + T.acc + ';border-radius:' + Math.min(T.r, 6) + 'px;padding:.6mm 1.5mm;font-variant-numeric:tabular-nums">' + x + '</span>'; }).join('') + '</div>';
    var items = [it('corta', 'Calcula la media (un decimal).', fmt(media, 1), num(Math.round(media * 10) / 10)), it('corta', '¿Cuál es la mediana?', fmt(med, 1), num(med)), it('corta', '¿Y la moda?', moda, num(moda)), it('corta', '¿Cuál es el rango (máximo − mínimo)?', s[n - 1] - s[0], num(s[n - 1] - s[0]))];
    return { t: 'Estadística: ' + D0[0].toLowerCase(), intro: 'Datos de ' + n + ' personas (' + D0[1] + '). Cada punto es un dato.', fig: tabla + svg(W, Hh, out, 520) + porque(C, 'La media reparte el total a partes iguales; la mediana es el valor del centro al ordenar; la moda, el que más se repite. Si hay un dato muy extremo, la mediana representa mejor al grupo que la media.'), items: esPeq(C) ? items.slice(2, 4) : items };
  }
  function genProbabilidad(u, C, r) {
    if (!SV.sectores) return null;
    var cols = ['rojo', 'azul', 'verde', 'amarillo'], k = E(r, 3, 4), n = [], tot = 0; for (var i = 0; i < k; i++) { n.push(E(r, 1, 4)); tot += n[i]; }
    var c0 = cols[0], p0 = n[0], g = function (a, b) { return b ? g(b, a % b) : a; }, d = g(p0, tot);
    var fig = SV.sectores(con(C, {}), { cats: cols.slice(0, k).map(function (c, i) { return c + ' (' + n[i] + ')'; }), vals: n });
    var items = [it('corta', 'La ruleta tiene ' + tot + ' casillas iguales. ¿Qué probabilidad hay de que salga ' + c0 + '? (fracción)', (p0 / d) + '/' + (tot / d), { ac: [(p0 / d) + '/' + (tot / d), p0 + '/' + tot] }), it('corta', 'Exprésala en porcentaje (redondea).', Math.round(p0 / tot * 100) + ' %', num(Math.round(p0 / tot * 100))), it('corta', 'Si giras la ruleta ' + tot * 10 + ' veces, ¿cuántas veces esperas ' + c0 + '?', p0 * 10, num(p0 * 10))];
    return { t: 'Probabilidad con una ruleta', intro: 'Cada sector indica cuántas casillas iguales tiene ese color.', fig: fig + porque(C, 'Probabilidad = casos favorables ÷ casos posibles. No predice una tirada concreta: dice qué pasará, de media, si repites muchas veces.'), items: items };
  }

  /* ═════════ CONTABILIDAD ═════════ */
  var IVA = { es: [21, 'IVA'], mx: [16, 'IVA'], co: [19, 'IVA'], ar: [21, 'IVA'], cl: [19, 'IVA'], ve: [16, 'IVA'], do: [18, 'ITBIS'], us: [7, 'impuesto de ventas'] };
  var PROD = [['Resma de papel', 1], ['Tóner de impresora', 12], ['Silla de oficina', 30], ['Archivador', 3], ['Calculadora', 4], ['Mesa de trabajo', 45], ['Caja de bolígrafos', 1.5], ['Lámpara de escritorio', 8]];
  function genFactura(u, C, r) {
    var T = C.T, iv = IVA[C.pk] || [18, 'IVA'], L = H.mezcla(r, PROD).slice(0, E(r, 3, 4)).map(function (p) { var q = E(r, 1, 6), pu = redo(base(C) * p[1] * E(r, 8, 14) / 10, C); return [p[0], q, pu, q * pu]; });
    var sub = L.reduce(function (s, x) { return s + x[3]; }, 0), imp = Math.round(sub * iv[0] / 100), tot = sub + imp, nf = 'F-' + (1000 + E(r, 1, 8999));
    var td = function (s, al, b) { return '<td style="padding:1.4mm 2mm;border-bottom:1px solid ' + T.soft + ';text-align:' + (al || 'left') + (b ? ';font-weight:700' : '') + '">' + s + '</td>'; };
    var fig = '<div style="border:0.4mm solid ' + T.ink + ';border-radius:' + Math.min(T.r, 6) + 'px;padding:4mm 5mm;max-width:160mm;margin:0 auto;font-size:.9em;font-variant-numeric:tabular-nums">' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:3mm"><div><div style="font-family:' + T.tit + ';font-weight:' + T.peso + ';font-size:1.5em;color:' + T.acc + '">Factura</div><div>N.º ' + nf + '</div></div><div style="text-align:right">' + esc(H.pick(r, ['Papelería ', 'Suministros ', 'Oficinas ']) + H.pick(r, C.P.ciudades || ['Centro'])) + '<br/>Cliente: ' + esc(H.pick(r, C.P.nombres || ['Ana'])) + '</div></div>' +
      '<table style="width:100%;border-collapse:collapse"><tr style="background:' + T.soft + '">' + ['Concepto', 'Cant.', 'Precio', 'Importe'].map(function (s, i) { return '<th style="padding:1.4mm 2mm;text-align:' + (i ? 'right' : 'left') + '">' + s + '</th>'; }).join('') + '</tr>' +
      L.map(function (x, i) { return '<tr>' + td(esc(x[0])) + td(x[1], 'right') + td(din(x[2], C), 'right') + td(i === 1 ? '?' : din(x[3], C), 'right') + '</tr>'; }).join('') +
      '<tr>' + td('') + td('') + td('Base imponible', 'right', 1) + td('?', 'right', 1) + '</tr><tr>' + td('') + td('') + td(esc(iv[1]) + ' ' + iv[0] + ' %', 'right', 1) + td('?', 'right', 1) + '</tr><tr>' + td('') + td('') + td('Total', 'right', 1) + td('?', 'right', 1) + '</tr></table></div>';
    var items = [it('corta', 'Importe de la línea 2 (' + L[1][0].toLowerCase() + ').', din(L[1][3], C), num(L[1][3])), it('corta', 'Base imponible (suma de importes).', din(sub, C), num(sub)), it('corta', iv[1] + ' del ' + iv[0] + ' % (redondea).', din(imp, C), num(imp)), it('corta', 'Total de la factura.', din(tot, C), num(tot))];
    return { t: 'Completa la factura', intro: 'Rellena los huecos «?». El ' + iv[1] + ' se calcula sobre la base imponible.', fig: fig + porque(C, 'La empresa cobra el ' + iv[1] + ' al cliente pero no es suyo: lo ingresa después en Hacienda, restando el que pagó en sus compras.'), items: items };
  }
  function genBalance(u, C, r) {
    var T = C.T, b = base(C) * 100, anc = redo(b * E(r, 30, 80), C), ac = redo(b * E(r, 10, 40), C), pc = redo(b * E(r, 5, 25), C), pnc = redo(b * E(r, 10, 35), C), act = anc + ac, pat = act - pc - pnc;
    if (pat <= 0) return null;
    var W = 420, Hh = 300, k = (Hh - 40) / act, out = '', col = function (x, partes, t) { var y = 20; partes.forEach(function (p) { var h = p[1] * k; out += rect(x, y, 120, h, 'fill="' + p[2] + '" stroke="' + T.bg + '" stroke-width="2"') + tx(x + 60, y + h / 2 - 2, p[0], { f: T.cuerpo, s: 12, c: T.ink, w: 700, st: true }) + tx(x + 60, y + h / 2 + 13, p[3] ? '?' : din(p[1], C), { f: T.cuerpo, s: 11, c: T.ink, st: true }); y += h; }); out += tx(x + 60, Hh - 2, t, { f: T.tit, s: 14, c: T.ink, w: 700 }); };
    col(40, [['No corriente', anc, T.acc], ['Corriente', ac, clr(T.acc, .45)]], 'ACTIVO'); col(240, [['Patrimonio neto', pat, T.acc2, 1], ['Pasivo no corr.', pnc, clr(T.acc2, .45)], ['Pasivo corr.', pc, clr(T.acc2, .7)]], 'PASIVO + PN');
    out += tx(210, Hh / 2, '=', { f: T.tit, s: 40, c: T.ink, w: 700 });
    var liq = Math.round(ac / pc * 100) / 100;
    var items = [it('corta', '¿Cuánto vale el activo total?', din(act, C), num(act)), it('corta', 'Calcula el patrimonio neto (activo − pasivo).', din(pat, C), num(pat)), it('corta', 'Ratio de liquidez = activo corriente ÷ pasivo corriente (dos decimales).', fmt(liq), num(liq)), mc('Con esa liquidez, ¿puede pagar sus deudas a corto plazo?', ['sí', 'no'], liq >= 1 ? 'sí' : 'no')];
    return { t: 'El balance de situación', intro: 'Las dos columnas miden lo mismo: lo que la empresa tiene (activo) y de dónde salió (pasivo y patrimonio).', fig: svg(W, Hh, out, 420) + porque(C, 'Activo = Pasivo + Patrimonio neto siempre: es la ecuación fundamental de la contabilidad. Si una columna no cuadra con la otra, hay un error en los asientos.'), items: items };
  }
  function genEquilibrio(u, C, r) {
    if (!SV.funcion) return null;
    var mg = E(r, 2, 4), q = E(r, 3, 7), cv = E(r, 2, 4), p = cv + mg, cf = q * mg, esc0 = redo(base(C) * 10, C);
    var fig = SV.funcion(C, { x: [0, 10], y: [0, Math.ceil(p * 10 / 5) * 5], fs: [{ f: function (x) { return p * x; } }, { f: function (x) { return cf + cv * x; } }], pts: [[q, p * q, 'E']], etq: [['Ingresos', C.T.acc], ['Costes totales', C.T.acc2]], W: 420, H: 300 });
    var items = [it('corta', '¿Cuántas centenas de unidades hay que vender para no ganar ni perder?', q, num(q)), it('corta', 'Precio de venta ' + p + ', coste variable ' + cv + '. ¿Cuál es el margen por unidad?', mg, num(mg)), it('corta', 'Comprueba: costes fijos ÷ margen =', q, num(q)), it('abierta', '¿Qué pasa con el punto de equilibrio si sube el alquiler del local?', 'Aumentan los costes fijos y hay que vender más unidades para cubrirlos.', { lin: 2 })];
    return { t: 'El punto de equilibrio', intro: 'Costes fijos: ' + cf + ' (en miles de ' + (C.P.moneda || 'unidades monetarias') + '). El eje x son centenas de unidades vendidas.', fig: fig + porque(C, 'Por debajo del punto E la empresa pierde dinero; por encima, cada unidad vendida deja su margen como beneficio. Es la primera cuenta de cualquier plan de negocio.'), items: items };
  }
  function genFlujo(u, C, r) {
    if (!SV.barras) return null;
    var M = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'], ing = M.map(function () { return E(r, 20, 60); }), egr = M.map(function () { return E(r, 15, 50); }), s = 0, sal = ing.map(function (x, i) { return (s += x - egr[i]); });
    var fig = SV.barras(C, { cats: M, vals: ing.map(function (x, i) { return x - egr[i]; }), unidad: 'saldo del mes (miles)', valores: true, max: Math.max.apply(null, ing) });
    var peor = sal.indexOf(Math.min.apply(null, sal));
    var tabla = '<table style="margin:3mm auto 0;border-collapse:collapse;font-size:.85em;font-variant-numeric:tabular-nums"><tr><th></th>' + M.map(function (m) { return '<th style="padding:1mm 2.5mm">' + m + '</th>'; }).join('') + '</tr><tr><td style="padding:1mm 2mm;font-weight:700">Cobros</td>' + ing.map(function (x) { return '<td style="text-align:right;padding:1mm 2.5mm">' + x + '</td>'; }).join('') + '</tr><tr><td style="padding:1mm 2mm;font-weight:700">Pagos</td>' + egr.map(function (x) { return '<td style="text-align:right;padding:1mm 2.5mm">' + x + '</td>'; }).join('') + '</tr></table>';
    var items = [it('corta', 'Saldo acumulado a final de junio (miles).', sal[5], num(sal[5])), it('corta', '¿En qué mes el saldo acumulado es más bajo?', M[peor], { ac: [M[peor], M[peor].toLowerCase()] }), it('abierta', 'Si un mes el saldo es negativo, ¿qué puede hacer la empresa?', 'Pedir un préstamo a corto plazo, retrasar pagos o adelantar cobros.', { lin: 2 })];
    return { t: 'El flujo de caja', intro: 'Cobros y pagos de un pequeño negocio en seis meses, en miles.', fig: tabla + fig + porque(C, 'Una empresa puede tener beneficios y quedarse sin dinero en la caja si cobra tarde y paga pronto. Por eso se vigila el flujo de caja mes a mes.'), items: items };
  }
  var ASI = [['Compra de mercaderías al contado', 'Mercaderías', 'Caja'], ['Venta a crédito a un cliente', 'Clientes', 'Ventas'], ['Pago de sueldos por el banco', 'Sueldos y salarios', 'Bancos'], ['Préstamo recibido en el banco', 'Bancos', 'Deudas con entidades de crédito'], ['Cobro de un cliente en efectivo', 'Caja', 'Clientes'], ['Compra de un ordenador a plazos', 'Equipos informáticos', 'Proveedores de inmovilizado']];
  function genDiario(u, C, r) {
    var T = C.T, a = H.pick(r, ASI), imp = redo(base(C) * E(r, 20, 200), C), W = 520, out = '';
    var cT = function (x, n, d, h) { return tx(x + 90, 20, n, { f: T.cuerpo, s: 13, c: T.ink, w: 700 }) + ln([x, 30], [x + 180, 30], 'stroke="' + T.ink + '" stroke-width="2.5"') + ln([x + 90, 30], [x + 90, 130], 'stroke="' + T.ink + '" stroke-width="2.5"') + tx(x + 45, 48, 'Debe', { f: T.cuerpo, s: 11, c: T.acc }) + tx(x + 135, 48, 'Haber', { f: T.cuerpo, s: 11, c: T.acc }) + (d ? tx(x + 45, 80, d, { f: T.cuerpo, s: 13, c: T.ink, w: 700 }) : '') + (h ? tx(x + 135, 80, h, { f: T.cuerpo, s: 13, c: T.ink, w: 700 }) : ''); };
    out += cT(20, a[1], '?', '') + cT(300, a[2], '', '?');
    var fig = '<div style="border:1px solid ' + T.soft + ';border-radius:' + Math.min(T.r, 6) + 'px;padding:3mm 4mm;margin:0 0 4mm;font-size:.92em"><b>Operación:</b> ' + esc(a[0]) + ' por ' + din(imp, C) + '.</div>' + svg(W, 140, out, 520);
    var items = [mc('¿Qué cuenta se carga (va al Debe)?', H.mezcla(r, [a[1], a[2]]), a[1]), it('corta', '¿Qué importe va en el Haber de ' + a[2] + '?', din(imp, C), num(imp)), it('abierta', 'Escribe el asiento en el libro diario: fecha, cuentas, Debe y Haber.', a[1] + ' ' + din(imp, C) + ' a ' + a[2] + ' ' + din(imp, C), { lin: 2 })];
    return { t: 'Del libro diario a las cuentas T', intro: 'Cada operación se anota con partida doble: lo que entra en una cuenta sale de otra por el mismo importe.', fig: fig + porque(C, 'Partida doble: en cada asiento, la suma del Debe es igual a la del Haber. Se carga (Debe) la cuenta que recibe el valor y se abona (Haber) la que lo entrega.'), items: items };
  }

  /* ═════════ QUÍMICA ═════════ */
  var TONOS = [['rubio claro', '#D8B070'], ['castaño', '#6B4226'], ['caoba', '#7A2E1E'], ['cobrizo', '#B5551F'], ['negro azulado', '#1E2433'], ['rubio ceniza', '#B8AE98']];
  var RUEDA = ['#E53935', '#F4511E', '#FB8C00', '#FDD835', '#C0CA33', '#43A047', '#00897B', '#039BE5', '#1E5AA8', '#5E35B1', '#8E24AA', '#D81B60'];
  var RN = ['rojo', 'rojo anaranjado', 'naranja', 'amarillo', 'amarillo verdoso', 'verde', 'verde azulado', 'azul claro', 'azul', 'violeta azulado', 'violeta', 'magenta'];
  function genColorimetria(u, C, r) {
    if (!SV.recipiente) return null;
    var T = C.T, tn = H.pick(r, TONOS), pr = H.pick(r, [[1, 1], [1, 1.5], [1, 2]]), g = H.pick(r, [40, 50, 60]), ox = g * pr[1], vol = H.pick(r, [[10, 3], [20, 6], [30, 9], [40, 12]]);
    var cap = 100, f1 = SV.recipiente(con(C, { acc2: tn[1] }), 'probeta', cap, g, g + ' g'), f2 = SV.recipiente(con(C, { acc2: '#C9D3DE' }), 'probeta', 150, Math.min(150, ox), ox + ' mL'), f3 = SV.recipiente(con(C, { acc2: clr(tn[1], .25) }), 'vaso_p', 250, Math.min(250, g + ox), 'mezcla');
    var i0 = H.pick(r, [2, 3, 1, 10]), op = (i0 + 6) % 12, rd = '', cx = 110, cy = 110;
    RUEDA.forEach(function (c, i) { var a0 = (i - .5) / 12 * Math.PI * 2 - Math.PI / 2, a1 = (i + .5) / 12 * Math.PI * 2 - Math.PI / 2, R = 90, R2 = 44; rd += '<path d="M' + r1(cx + R2 * Math.cos(a0)) + ',' + r1(cy + R2 * Math.sin(a0)) + ' L' + r1(cx + R * Math.cos(a0)) + ',' + r1(cy + R * Math.sin(a0)) + ' A' + R + ',' + R + ' 0 0 1 ' + r1(cx + R * Math.cos(a1)) + ',' + r1(cy + R * Math.sin(a1)) + ' L' + r1(cx + R2 * Math.cos(a1)) + ',' + r1(cy + R2 * Math.sin(a1)) + ' A' + R2 + ',' + R2 + ' 0 0 0 ' + r1(cx + R2 * Math.cos(a0)) + ',' + r1(cy + R2 * Math.sin(a0)) + ' Z" fill="' + c + '" stroke="' + T.bg + '" stroke-width="2"' + (i === i0 ? ' stroke-width="4"' : '') + '/>'; });
    var ang = function (i) { return i / 12 * Math.PI * 2 - Math.PI / 2; };
    rd += ln([cx + 56 * Math.cos(ang(i0)), cy + 56 * Math.sin(ang(i0))], [cx + 56 * Math.cos(ang(op)), cy + 56 * Math.sin(ang(op))], 'stroke="' + T.ink + '" stroke-width="2.5" stroke-dasharray="5 4"') + '<circle cx="' + cx + '" cy="' + cy + '" r="30" fill="#8a8a8a"/>' + tx(cx, cy + 4, 'neutro', { f: T.cuerpo, s: 11, c: '#fff', w: 700 });
    var fig = '<div style="display:grid;grid-template-columns:1fr 1fr 1.2fr 1.6fr;gap:4mm;align-items:end;max-width:170mm;margin:0 auto">' + '<div style="text-align:center">' + f1 + '<div style="font-size:.85em;font-weight:700">tinte ' + esc(tn[0]) + '</div></div><div style="text-align:center">' + f2 + '<div style="font-size:.85em;font-weight:700">oxidante ' + vol[0] + ' vol</div></div><div style="text-align:center">' + f3 + '<div style="font-size:.85em;font-weight:700">bol de mezcla</div></div>' + svg(220, 220, rd, 220) + '</div>';
    var items = [it('corta', 'Proporción 1:' + fmt(pr[1], 1) + '. ¿Cuántos mL de oxidante van con ' + g + ' g de tinte?', ox + ' mL', num(ox)), it('corta', '¿Cuánto pesa la mezcla en el bol (1 mL de oxidante ≈ 1 g)?', (g + ox) + ' g', num(g + ox)), it('corta', 'El oxidante de ' + vol[0] + ' volúmenes, ¿qué porcentaje de peróxido de hidrógeno tiene?', vol[1] + ' %', num(vol[1])), mc('Para neutralizar un reflejo ' + RN[i0] + ', ¿qué color se usa?', H.mezcla(r, [RN[op], RN[(i0 + 3) % 12], RN[(i0 + 9) % 12]]), RN[op])];
    return { t: 'Colorimetría: mezclas y neutralización', intro: 'En coloración, el tinte se mezcla con oxidante en una proporción fija. En la rueda, cada color se neutraliza con el que tiene enfrente.', fig: fig + porque(C, 'El peróxido de hidrógeno abre la cutícula y oxida los pigmentos para que se fijen: cada 10 volúmenes son un 3 % de peróxido. Dos colores opuestos en la rueda se anulan y dan un gris neutro: por eso el matiz azul apaga el naranja y el violeta apaga el amarillo.'), items: items };
  }
  function genDilucion(u, C, r) {
    if (!SV.recipiente) return null;
    var T = C.T, c1 = H.pick(r, [10, 20, 40]), v1 = H.pick(r, [25, 50, 100]), f = H.pick(r, [2, 4, 5]), v2 = v1 * f, c2 = c1 / f, col = H.pick(r, ['#1E88E5', '#8E24AA', '#E53935', '#43A047']);
    var figs = [[c1, v1, 'inicial'], [c2, v2, 'diluida']].map(function (x, i) { return '<div style="text-align:center">' + SV.recipiente(con(C, { acc2: clr(col, 1 - x[0] / c1 * .85) }), 'vaso_p', 500, x[1], x[1] + ' mL') + '<div style="font-weight:700;font-size:.9em">' + fmt(x[0], 1) + ' g/L · ' + x[2] + '</div></div>'; }).join('<div style="align-self:center;font-size:2em;color:' + T.acc + '">→</div>');
    var items = [it('corta', 'Aplica C₁ · V₁ = C₂ · V₂: ¿qué concentración queda al llevar ' + v1 + ' mL de ' + c1 + ' g/L hasta ' + v2 + ' mL?', fmt(c2, 1) + ' g/L', num(c2)), it('corta', '¿Cuántos mL de agua se han añadido?', (v2 - v1) + ' mL', num(v2 - v1)), it('corta', '¿Cuántos gramos de soluto hay en el vaso final?', fmt(c1 * v1 / 1000, 2) + ' g', num(c1 * v1 / 1000))];
    return { t: 'Diluciones', intro: 'Al añadir agua el color se aclara, pero la cantidad de soluto no cambia.', fig: '<div style="display:flex;gap:6mm;justify-content:center;align-items:end;max-width:120mm;margin:0 auto">' + figs + '</div>' + porque(C, 'Diluir reparte el mismo soluto en más volumen: si el volumen se multiplica por ' + f + ', la concentración se divide entre ' + f + '. Así se preparan medicamentos, abonos y productos de limpieza.'), items: items };
  }
  var PH = [['jugo gástrico', 1.5], ['limón', 2], ['vinagre', 3], ['café', 5], ['leche', 6.5], ['agua pura', 7], ['sangre', 7.4], ['bicarbonato', 8.5], ['jabón', 10], ['amoníaco', 11.5], ['lejía', 13]];
  function genPH(u, C, r) {
    var T = C.T, W = 600, x0 = 30, bw = W - 60, out = '', cols = ['#D7263D', '#E4572E', '#F08A24', '#F4B63A', '#F2D43D', '#C6D63E', '#7AC143', '#3EAA5B', '#26A69A', '#1E88E5', '#3949AB', '#5E35B1', '#6A1B9A', '#4A148C', '#311B92'];
    for (var i = 0; i < 15; i++) out += rect(x0 + i * bw / 15, 60, bw / 15, 34, 'fill="' + cols[i] + '"') + tx(x0 + (i + .5) * bw / 15, 112, i, { f: T.cuerpo, s: 12, c: T.ink, w: 700 });
    var sel = H.mezcla(r, PH).slice(0, 5).sort(function (a, b) { return a[1] - b[1]; });
    sel.forEach(function (s, i) { var x = x0 + (s[1] + .5) / 15 * bw, y = i % 2 ? 150 : 40; out += ln([x, i % 2 ? 96 : 58], [x, i % 2 ? 138 : 46], 'stroke="' + T.ink + '" stroke-width="1.4"') + tx(x, i % 2 ? 152 : 38, s[0], { f: T.cuerpo, s: 12, c: T.ink, w: 700, st: true }); });
    out += tx(x0, 20, '← ácido', { f: T.cuerpo, s: 12, c: cols[0], w: 700, a: 'start' }) + tx(x0 + bw, 20, 'básico →', { f: T.cuerpo, s: 12, c: cols[13], w: 700, a: 'end' });
    var a = sel[0], b = sel[sel.length - 1], dif = Math.round(Math.abs(sel[1][1] - sel[0][1]));
    var items = [mc('¿Es ácido o básico ' + a[0] + '?', ['ácido', 'neutro', 'básico'], a[1] < 7 ? 'ácido' : a[1] > 7 ? 'básico' : 'neutro'), mc('¿Y ' + b[0] + '?', ['ácido', 'neutro', 'básico'], b[1] < 7 ? 'ácido' : b[1] > 7 ? 'básico' : 'neutro')];
    if (!esPeq(C) && dif >= 1) items.push(it('corta', 'Cada punto de pH es 10 veces más ácido. ¿Cuántas veces más ácido es ' + sel[0][0] + ' que ' + sel[1][0] + '? (usa ' + dif + ' puntos)', Math.pow(10, dif), num(Math.pow(10, dif))));
    return { t: 'La escala de pH', intro: 'El pH va de 0 a 14: por debajo de 7, ácido; 7, neutro; por encima, básico.', fig: svg(W, 165, out, 600) + porque(C, 'El pH mide la concentración de iones hidrógeno en escala logarítmica. La repostería lo aprovecha: el bicarbonato (básico) reacciona con el yogur o el limón (ácidos) y libera el CO₂ que hace subir la masa.'), items: items };
  }

  /* ═════════ FÍSICA ═════════ */
  function genCircuito(u, C, r) {
    var T = C.T, par = !esPeq(C) && r() < .5, V = H.pick(r, [6, 9, 12]), R = par ? [H.pick(r, [6, 12]), H.pick(r, [6, 12, 4])] : [E(r, 1, 4) * 2, E(r, 1, 3) * 2], out = '';
    var res = function (x, y, v, t) { var p = 'M' + x + ',' + y; for (var i = 0; i < 6; i++) p += ' l5,' + (i % 2 ? 10 : -10); return (v ? '<g transform="rotate(90 ' + x + ' ' + y + ')">' : '<g>') + ln([x - 20, y], [x, y], 'stroke="' + T.ink + '" stroke-width="3"') + '<path d="' + p + ' l0,0" transform="translate(0 5)" fill="none" stroke="' + T.acc + '" stroke-width="3" stroke-linejoin="round"/>' + '</g>' + tx(v ? x + 30 : x + 15, v ? y + 20 : y - 20, t, { f: T.cuerpo, s: 13, c: T.ink, w: 700, st: true }); };
    var wire = function (d) { return '<path d="' + d + '" fill="none" stroke="' + T.ink + '" stroke-width="3"/>'; };
    out += ln([60, 90], [60, 110], 'stroke="' + T.ink + '" stroke-width="5"') + ln([42, 118], [78, 118], 'stroke="' + T.ink + '" stroke-width="3"') + ln([50, 128], [70, 128], 'stroke="' + T.ink + '" stroke-width="6"') + tx(24, 124, V + ' V', { f: T.cuerpo, s: 14, c: T.acc2, w: 700 });
    out += wire('M60,90 L60,40 L340,40 L340,200 L60,200 L60,128');
    if (!par) { out += rect(150, 30, 70, 20, 'fill="' + T.bg + '"') + res(160, 40, false, 'R₁ = ' + R[0] + ' Ω') + rect(330, 90, 20, 70, 'fill="' + T.bg + '"') + res(340, 100, true, 'R₂ = ' + R[1] + ' Ω'); }
    else { out += wire('M200,40 L200,90 M280,40 L280,90 M200,160 L200,200 M280,160 L280,200') + rect(190, 90, 20, 70, 'fill="' + T.bg + '"') + rect(270, 90, 20, 70, 'fill="' + T.bg + '"') + res(200, 100, true, 'R₁ = ' + R[0] + ' Ω') + res(280, 100, true, 'R₂ = ' + R[1] + ' Ω'); }
    out += '<circle cx="110" cy="200" r="12" fill="' + T.bg + '" stroke="' + T.ink + '" stroke-width="2.5"/>' + tx(110, 205, 'A', { f: T.cuerpo, s: 13, c: T.ink, w: 700 });
    var Rt = par ? R[0] * R[1] / (R[0] + R[1]) : R[0] + R[1], I = V / Rt;
    var items = [it('corta', '¿Cuál es la resistencia total? ' + (par ? '(1/R = 1/R₁ + 1/R₂)' : '(R = R₁ + R₂)'), fmt(Rt) + ' Ω', num(Math.round(Rt * 100) / 100)), it('corta', '¿Qué intensidad marca el amperímetro A? (I = V ÷ R)', fmt(I) + ' A', num(Math.round(I * 100) / 100)), mc('Si se funde R₁, ¿sigue pasando corriente por R₂?', ['sí', 'no'], par ? 'sí' : 'no')];
    return { t: 'Circuito en ' + (par ? 'paralelo' : 'serie'), intro: 'Una pila de ' + V + ' V alimenta dos resistencias ' + (par ? 'en paralelo' : 'en serie') + '.', fig: svg(380, 230, out, 420) + porque(C, par ? 'En paralelo cada resistencia tiene su propio camino: la corriente se reparte y, si una se rompe, la otra sigue funcionando. Así están conectados los enchufes de una casa.' : 'En serie la corriente solo tiene un camino y atraviesa todas las resistencias: si una se rompe, el circuito se abre y todo se apaga, como en las guirnaldas antiguas.'), items: items };
  }
  function genMRU(u, C, r) {
    if (!SV.funcion) return null;
    var v = E(r, 2, 6), x0 = E(r, 0, 4) * 2, t = E(r, 3, 6), xt = x0 + v * t;
    var fig = SV.funcion(C, { x: [0, 8], y: [0, Math.ceil((x0 + v * 8) / 10) * 10], fs: [{ f: function (x) { return x0 + v * x; } }], pts: [[t, xt, 'P']], etq: [['x(t) = ' + x0 + ' + ' + v + 't', C.T.acc]], W: 420, H: 300 });
    var items = [it('corta', '¿En qué posición empieza el móvil (m)?', x0, num(x0)), it('corta', '¿Cuál es su velocidad (m/s)? Pendiente = Δx ÷ Δt', v, num(v)), it('corta', '¿Dónde está a los ' + t + ' s?', xt + ' m', num(xt)), it('corta', '¿Cuánto tarda en llegar a ' + (x0 + v * 10) + ' m?', '10 s', num(10))];
    return { t: 'Movimiento rectilíneo uniforme', intro: 'Gráfica posición–tiempo de un ciclista que va a velocidad constante. El eje x son segundos; el eje y, metros.', fig: fig + porque(C, 'En la gráfica posición–tiempo, una recta significa velocidad constante y su pendiente es la velocidad. Cuanto más inclinada, más rápido va.'), items: items };
  }
  function genPlano(u, C, r) {
    var T = C.T, m = E(r, 2, 10), P = m * 10, ang = 30, a = ang * Math.PI / 180, L = 360, x0 = 40, y0 = 250, x1 = x0 + L * Math.cos(a), y1 = y0 - L * Math.sin(a), out = '';
    out += poly([[x0, y0], [x1, y0], [x1, y1]], 'fill="' + T.soft + '" stroke="' + T.ink + '" stroke-width="2.5"') + '<path d="M' + (x0 + 50) + ',' + y0 + ' A50,50 0 0 0 ' + r1(x0 + 50 * Math.cos(a)) + ',' + r1(y0 - 50 * Math.sin(a)) + '" fill="none" stroke="' + T.ink + '"/>' + tx(x0 + 62, y0 - 10, ang + '°', { f: T.cuerpo, s: 13, c: T.ink, w: 700 });
    var cx = x0 + 200 * Math.cos(a), cy = y0 - 200 * Math.sin(a), s = 44;
    out += '<g transform="rotate(' + (-ang) + ' ' + r1(cx) + ' ' + r1(cy) + ')">' + rect(cx - s / 2, cy - s, s, s, 'fill="' + T.acc + '" stroke="' + osc(T.acc, .3) + '" stroke-width="2"') + '</g>';
    var gx = cx - s / 2 * Math.sin(a), gy = cy - s / 2 * Math.cos(a), ar = function (b, c, col, t) { var an = Math.atan2(c[1] - b[1], c[0] - b[0]), p1 = [c[0] - 11 * Math.cos(an - .4), c[1] - 11 * Math.sin(an - .4)], p2 = [c[0] - 11 * Math.cos(an + .4), c[1] - 11 * Math.sin(an + .4)]; return ln(b, c, 'stroke="' + col + '" stroke-width="3.5"') + poly([c, p1, p2], 'fill="' + col + '"') + tx(c[0] + 10, c[1] + 16, t, { f: T.cuerpo, s: 13, c: col, w: 700, st: true, a: 'start' }); };
    var k = 100 / P;
    out += ar([gx, gy], [gx, gy + P * k], T.ink, 'P = ' + P + ' N') + ar([gx, gy], [gx - P * .5 * k * Math.cos(a), gy + P * .5 * k * Math.sin(a)], T.acc2, 'Px') + ar([gx, gy], [gx + P * .866 * k * Math.sin(a), gy + P * .866 * k * Math.cos(a)], osc(T.acc2, .3), 'Py');
    var px = P * .5, py = Math.round(P * .866 * 10) / 10;
    var items = [it('corta', '¿Cuánto pesa el bloque de ' + m + ' kg? (g ≈ 10 N/kg)', P + ' N', num(P)), it('corta', 'Componente que lo hace deslizar: Px = P · sen 30° (sen 30° = 0,5).', px + ' N', num(px)), it('corta', 'Componente que lo aprieta contra el plano: Py = P · cos 30° (cos 30° ≈ 0,866).', fmt(py, 1) + ' N', num(py))];
    return { t: 'El plano inclinado', intro: 'El peso de un bloque sobre una rampa se descompone en dos fuerzas perpendiculares.', fig: svg(440, 280, out, 440) + porque(C, 'Una rampa reparte el esfuerzo: para subir el bloque solo hay que vencer Px, que es menor que el peso. A cambio, se recorre más distancia. Por eso las carreteras de montaña van en zigzag.'), items: items };
  }

  /* ═════════ DIBUJO TÉCNICO: piezas isométricas ═════════ */
  function pieza(r) {
    var n = 3, h = []; for (var y = 0; y < n; y++) { h.push([]); for (var x = 0; x < n; x++) h[y].push(0); }
    var formas = [function (x, y) { return x === 0 || y === 0 ? E(r, 1, 3) : 0; }, function (x, y) { return y === 0 ? 3 - x : y === 1 && x === 0 ? 2 : 0; }, function (x, y) { return x === 1 ? E(r, 2, 3) : y === 2 ? 1 : 0; }, function (x, y) { return 3 - Math.max(x, y) - (r() < .3 ? 1 : 0); }, function (x, y) { return (x + y) % 2 === 0 ? E(r, 1, 3) : 1; }];
    var f = H.pick(r, formas); for (var yy = 0; yy < n; yy++) for (var xx = 0; xx < n; xx++) h[yy][xx] = Math.max(0, Math.min(3, f(xx, yy)));
    if (!h[0][0]) h[0][0] = 1; return h;
  }
  function genIso(u, C, r) {
    var T = C.T, h = pieza(r), s = 36, ox = 170, oy = 120, out = '', n = 3, c30 = Math.cos(Math.PI / 6);
    var P = function (x, y, z) { return [ox + (x - y) * s * c30, oy + (x + y) * s * .5 - z * s]; };
    var cara = function (pts, col) { return poly(pts, 'fill="' + col + '" stroke="' + T.ink + '" stroke-width="1.4" stroke-linejoin="round"'); };
    for (var i = -2; i < 12; i++) out += ln(P(i, -2, 0), P(i, 8, 0), 'stroke="' + T.soft + '" stroke-width=".8"') + ln(P(-2, i, 0), P(8, i, 0), 'stroke="' + T.soft + '" stroke-width=".8"');
    var cubos = 0, orden = [];
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) for (var z = 0; z < h[y][x]; z++) orden.push([x, y, z]);
    orden.sort(function (a, b) { return (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]) || a[2] - b[2]; });
    orden.forEach(function (q) { var x = q[0], y = q[1], z = q[2]; cubos++; out += cara([P(x, y, z + 1), P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)], clr(T.acc, .55)) + cara([P(x + 1, y, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x + 1, y, z + 1)], T.acc) + cara([P(x, y + 1, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)], osc(T.acc, .3)); });
    var papel = ''; for (var yy = 0; yy <= 8; yy++) for (var xx = 0; xx <= 22; xx++) papel += '<circle cx="' + (10 + xx * 20) + '" cy="' + (10 + yy * 20) + '" r="1.3" fill="' + T.ink + '" opacity=".45"/>';
    ['alzado', 'planta', 'perfil'].forEach(function (t, i) { papel += tx(70 + i * 150, 180, t, { f: T.cuerpo, s: 12, c: T.acc, w: 700 }); });
    var lado = H.pick(r, [1, 2, 3]), vol = cubos * lado * lado * lado, alt = Math.max.apply(null, h.map(function (f) { return Math.max.apply(null, f); }));
    var items = [it('corta', '¿Cuántos cubos forman la pieza?', cubos, num(cubos)), it('corta', 'Si cada cubo mide ' + lado + ' cm de arista, ¿qué volumen tiene?', vol + ' cm³', num(vol)), it('corta', '¿Cuántos cubos de altura tiene la parte más alta?', alt, num(alt)), it('dibujo', 'Dibuja en la trama de puntos el alzado, la planta y el perfil de la pieza.', 'Vistas según la norma: alzado de frente, planta desde arriba y perfil izquierdo.')];
    return { t: 'Pieza en perspectiva isométrica', intro: 'La pieza está hecha de cubos iguales. Las caras de arriba, derecha y frente tienen tonos distintos para leer el volumen.', fig: '<div style="display:grid;grid-template-columns:1.1fr 1fr;gap:5mm;align-items:center">' + svg(340, 280, out, 340) + svg(460, 190, papel, 460) + '</div>' + porque(C, 'En isométrico los tres ejes forman 120° entre sí y las medidas se dibujan sin reducir: así se ve la pieza entera en una sola imagen. Las vistas separan la pieza en tres dibujos planos para fabricarla.'), items: items };
  }

  /* ─────────── registro ─────────── */
  var REG = [
    ['mat_fracvasos', genFracVasos, /^(mate|quimica|geoalg|calculo)$/], ['mat_porcentaje', genPorcentaje, /^(mate|conta|geoalg|calculo)$/], ['mat_pitagoras', genPitagoras, /^(mate|tecno|fisica|geoalg|calculo)$/], ['mat_estadistica', genEstadistica, /^(mate|bio|geografia|efisica|conta|natu|sociales|geoalg|calculo)$/], ['mat_probabilidad', genProbabilidad, /^(mate|geoalg|calculo)$/],
    ['con_factura', genFactura, /^(conta|mate|geoalg|calculo)$/], ['con_balance', genBalance, /^(conta)$/], ['con_equilibrio', genEquilibrio, /^(conta|mate|geoalg|calculo)$/], ['con_flujo', genFlujo, /^(conta)$/], ['con_diario', genDiario, /^(conta)$/],
    ['qui_color', genColorimetria, /^(quimica|arte|estetica|peluqueria|imagen)$/], ['qui_dilucion', genDilucion, /^(quimica|bio|natu|mate|geoalg|calculo)$/], ['qui_ph', genPH, /^(quimica|bio|natu|cocina|reposteria|pasteleria|panaderia)$/],
    ['fis_circuito', genCircuito, /^(fisica|tecno)$/], ['fis_mru', genMRU, /^(fisica|mate|efisica|geoalg|calculo)$/], ['fis_plano', genPlano, /^(fisica|tecno)$/], ['tec_iso', genIso, /^(tecno|arte|mate|geoalg|calculo)$/]
  ];
  REG.forEach(function (g) { SV.visual(g[0], g[1], { materias: g[2], max: 2 }); });
  var GEN = {}; REG.forEach(function (g) { GEN[g[0]] = g[1]; });

  /* ═════════ relleno inteligente ═════════ */
  var LIBROS = /^(libro|ebook|cuaderno|fichas)$/, CANDIDATAS = /^(actividad|ficha|ejemplo|explica|vis|repaso|apertura)$/, NO_TY = /^(sopa|ordena|esquema|info|anat_sistemas|anat_digestion|anat_edades)$/;
  var MEMO = {}, memoK = [];
  function bloque(pg, C, modo) {
    var X = pg.extra; if (!X) return '';
    var V = SV.generar(X.ty, X.u, C, H.rng(X.sem)); if (!V || !V.fig) return '';
    var items = (V.items || []).slice(0, X.ni).map(function (x) { return Object.assign({}, x, { e: H.sub(x.e, C) }); }), T = C.T;
    var fig = String(V.fig).replace(/<div style="[^"]*display:flex;gap:3\.5mm;align-items:center">[\s\S]*$/, function (m) { return /position:absolute/.test(m) ? m : ''; });
    var sol = items.filter(function (x) { return x.s !== '' && x.s != null; }).map(function (x, i) { return (i + 1) + ') ' + H.limpio(String(x.s)); }).join('   ');
    return '<div data-extra="1" style="margin-top:5mm;padding-top:3mm;border-top:' + (T.r ? '0' : '0.4mm solid ' + T.ink) + '">' +
      '<div style="display:flex;align-items:baseline;gap:3mm;margin:0 0 2mm"><span style="font-size:.72em;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:' + T.acc + '">Un paso más</span><span style="font-family:' + T.tit + ';font-weight:' + T.peso + ';font-size:1.15em">' + esc(V.t) + '</span></div>' +
      '<div style="width:' + X.w + 'mm;max-width:100%;margin:0 auto 2mm">' + fig + '</div>' +
      items.map(function (x, i) { return H.itemHTML(x, i, C, modo, 'x' + pg.num); }).join('') +
      (sol ? '<div style="font-size:.66em;opacity:.6;transform:rotate(180deg);text-align:right;margin-top:1mm">Solución: ' + esc(sol) + '</div>' : '') + '</div>';
  }
  function post(h, pg, C, modo) { if (!pg.extra) return h; try { return h + bloque(pg, C, modo); } catch (e) { return h; } }
  ED.registrar({ post: post });

  function medir(res) {
    var C = res.C, W = C.papel.w * MM, Hp = C.papel.h * MM, host = document.createElement('div');
    host.style.cssText = 'position:fixed;left:-20000px;top:0;width:' + W + 'px;visibility:hidden;pointer-events:none;contain:layout style paint';
    document.body.appendChild(host);
    var caja = document.createElement('div'); caja.style.cssText = 'position:fixed;left:-20000px;top:0;visibility:hidden;contain:layout style paint;width:' + (W - 34 * MM) + 'px;font-family:' + C.T.cuerpo + ';font-size:' + C.fs + 'px;line-height:1.5'; document.body.appendChild(caja);
    var libre = function (p) {
      host.innerHTML = ED.paginaHTML(p, C, 'print', res);
      var el = host.firstChild; if (!el) return 0;
      var top = el.getBoundingClientRect().top, fondo = 0, tope = Hp - 20 * MM, hijos = [];
      var mete = function (n) { for (var i = 0; i < n.children.length; i++) { var c = n.children[i], cs = getComputedStyle(c); if (cs.display === 'contents') mete(c); else if (cs.position !== 'absolute' && cs.position !== 'fixed') hijos.push(c); else { var b = c.getBoundingClientRect(); if (b.top - top > Hp * .55 && b.height < Hp * .3) tope = Math.min(tope, b.top - top - 4 * MM); } } };
      mete(el);
      hijos.forEach(function (c) { var b = c.getBoundingClientRect(); if (b.height) fondo = Math.max(fondo, b.bottom - top); });
      return (tope - fondo) / MM;
    };
    var k = 0, usados = {}, t0 = performance.now(), PRESUP = 700;
    try {
      res.pages.forEach(function (p) {
        if (performance.now() - t0 > PRESUP) return;
        if (!CANDIDATAS.test(p.tipo) || p.mini) return;
        var f = libre(p); if (f < 55) return;
        var u = p.u || (res.unidades || [])[0]; if (!u) return;
        var tipos = SV.tiposDe(u, C).filter(function (t) { return !NO_TY.test(t) && t !== p.gen; });
        var tipos2 = tipos.filter(function (t) { return !usados[u.id + t]; }); if (tipos2.length) tipos = tipos2;
        for (var q = 0; q < tipos.length; q++) {
          var ty = tipos[(k + q) % tipos.length], sem = H.hash(u.id + ':extra:' + p.num) + (C.semilla || 1) * 131, V = SV.generar(ty, u, C, H.rng(sem));
          if (!V || !V.fig) continue;
          var ni = f > 120 ? 2 : 1, w = Math.min(150, (f - 18 - ni * 12) * 1.25);
          p.extra = { ty: ty, u: u, sem: sem, w: Math.max(60, Math.round(w)), ni: ni };
          var g = 0, cabe = function () { caja.innerHTML = bloque(p, C, 'print'); return caja.getBoundingClientRect().height / MM <= f - 6; };
          while (g++ < 5 && !cabe()) { if (p.extra.ni > 1) p.extra.ni = 1; else p.extra.w = Math.round(p.extra.w * .8); if (p.extra.w < 55) break; }
          if (p.extra.w < 55 || !cabe()) { delete p.extra; continue; }
          usados[u.id + ty] = 1; k++; break;
        }
      });
    } finally { host.remove(); caja.remove(); window.EU_LAMINAS_PLUS_ms = Math.round(performance.now() - t0); }
  }
  var ens = ED.ensamblar;
  ED.ensamblar = function (cfg) {
    var res = ens(cfg);
    try {
      var C = res.C;
      if (!LIBROS.test(C.prod.id) || ((cfg.acab || {}).relleno === 'no') || !document.body) return res;
      var key = JSON.stringify(cfg);
      if (MEMO[key]) { var m = MEMO[key]; res.pages.forEach(function (p) { if (m[p.num]) p.extra = Object.assign({}, m[p.num], { u: p.u || (res.unidades || [])[0] }); }); return res; }
      medir(res);
      var guard = {}; res.pages.forEach(function (p) { if (p.extra) guard[p.num] = { ty: p.extra.ty, sem: p.extra.sem, w: p.extra.w, ni: p.extra.ni }; });
      MEMO[key] = guard; memoK.push(key); if (memoK.length > 6) delete MEMO[memoK.shift()];
    } catch (e) { console.warn('relleno', e); }
    return res;
  };

  window.EU_LAMINAS_PLUS = { generadores: GEN, medir: medir };
})();
