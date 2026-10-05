/* b6_cerebro_taller.js — Taller visual de cocina: reutiliza los motores de dibujo (EU_SVG, recipientes,
   gráficos de barras y sectores) para explicar cada receta con imágenes y con la ciencia que hay detrás.
   Páginas por receta:
   · Mide los líquidos (jarra o vaso graduado con los mL de la receta, escalados a las porciones).
   · Temperatura del horno (dial con zonas suave / moderado / fuerte y conversión a °F).
   · Temperatura del proceso (leche tibia para la levadura, baño maría, hervor de la crema…).
   · Proporciones (porcentaje panadero e hidratación en pan; sectores de ingredientes en lo demás).
   · El molde (vista superior, área y factor para cambiar de tamaño).
   · Plan de trabajo (diagrama de tiempos de los pasos y hora de salida).
   Cada página lleva preguntas con solución y un mensaje explicativo «por qué funciona».
   En el recetario sustituye las páginas «Mi receta» repetidas; en libros de texto se registra con
   EU_SVG.visual para Cocina y, como «La ciencia en la cocina», en Matemáticas, Física, Química y Ciencias.
   Cargar después de b6_cerebro_visual.js. */
(function () {
  var ED = window.EU_EDITORIAL, SV = window.EU_SVG, CO = window.EU_COCINA;
  if (!ED || !SV || !CO || !SV.visual || window.EU_TALLER) return;
  var H = ED.H, esc = H.esc, it = H.it, E = H.ent, osc = SV.osc, clr = SV.clr, NS = 'xmlns="http://www.w3.org/2000/svg"', uid = 0;
  var COC = /^(cocina|reposteria|panaderia|pasteleria|batidos)$/;
  function r1(n) { return Math.round(n * 10) / 10; }
  function fmt(n) { return String(Math.round(n * 100) / 100).replace('.', ','); }
  function es3d(C) { return C.prem ? C.prem.dibujo === '3d' : (((C.cfg && C.cfg.acab) || {}).dibujo || '3d') === '3d'; }
  function svg(w, h, body, maxw) { return '<svg ' + NS + ' data-plano="1" viewBox="0 0 ' + w + ' ' + h + '" style="width:100%;max-width:' + (maxw || w) + 'px;height:auto;display:block;margin:0 auto">' + body + '</svg>'; }
  function tx(x, y, s, o) { o = o || {}; return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || 'middle') + '" font-size="' + (o.s || 13) + '" font-family="' + esc(o.f || 'sans-serif') + '" font-weight="' + (o.w || 400) + '" fill="' + (o.c || '#222') + '"' + (o.st ? ' stroke="#fff" stroke-width="3" paint-order="stroke"' : '') + '>' + esc(s) + '</text>'; }
  function num(v, ext) { return { ac: [v, fmt(v), String(v)].concat(ext || []) }; }
  function mc(e, ops, bien) { return it('mc', e, 'abc'.charAt(ops.indexOf(bien)) + ') ' + bien, { o: ops, c: ops.indexOf(bien) }); }
  var loc = function (s, C) { return CO.loc ? CO.loc(s, C) : s; };
  function nombre(rc, C) { return loc((rc.al && rc.al[C.pk]) || rc.n, C); }
  function factor(rc, C) { var p = +((C.op || {}).porciones) || 0; return rc.p > 2 && p ? p / rc.p : 1; }
  function porque(C, s) { return H.guia(C, s, false); }
  function figBox(a, b) { return '<div style="display:grid;grid-template-columns:' + (b ? '1fr 1fr' : '1fr') + ';gap:6mm;align-items:center">' + a + (b || '') + '</div>'; }

  /* ─────────── dial (horno y termómetro de cocina) ─────────── */
  function dial(C, min, max, val, zonas, uni, et) {
    var T = C.T, F = T.cuerpo, cx = 160, cy = 160, R = 130, a0 = Math.PI * 1.15, a1 = -Math.PI * .15, d3 = es3d(C), out = '';
    var A = function (v) { return a0 + (a1 - a0) * (v - min) / (max - min); }, P = function (a, r) { return [cx + r * Math.cos(a), cy - r * Math.sin(a)]; };
    if (d3) out += '<circle cx="' + (cx + 4) + '" cy="' + (cy + 6) + '" r="' + (R + 14) + '" fill="#000" opacity=".16"/>';
    out += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (R + 14) + '" fill="' + (d3 ? clr(T.ink, .82) : '#fff') + '" stroke="' + T.ink + '" stroke-width="3"/>';
    zonas.forEach(function (z) {
      var p1 = P(A(z[0]), R - 6), p2 = P(A(z[1]), R - 6), grande = Math.abs(A(z[1]) - A(z[0])) > Math.PI ? 1 : 0;
      out += '<path d="M' + r1(p1[0]) + ',' + r1(p1[1]) + ' A' + (R - 6) + ',' + (R - 6) + ' 0 ' + grande + ' 1 ' + r1(p2[0]) + ',' + r1(p2[1]) + '" fill="none" stroke="' + z[2] + '" stroke-width="14"/>';
      var pm = P(A((z[0] + z[1]) / 2), R - 34); out += tx(pm[0], pm[1] + 4, z[3], { f: F, s: 11, c: T.ink, w: 700 });
    });
    var paso = (max - min) / 10;
    for (var v = min; v <= max + .01; v += paso / 2) { var lg = Math.round((v - min) / paso * 2) % 2 === 0, q1 = P(A(v), R + 8), q2 = P(A(v), R - (lg ? 16 : 8)); out += '<line x1="' + r1(q1[0]) + '" y1="' + r1(q1[1]) + '" x2="' + r1(q2[0]) + '" y2="' + r1(q2[1]) + '" stroke="' + T.ink + '" stroke-width="' + (lg ? 2 : 1) + '"/>'; if (lg) { var q3 = P(A(v), R - 52); out += tx(q3[0], q3[1] + 4, Math.round(v), { f: F, s: 11, c: T.ink }); } }
    var deg = -(A(val) * 180 / Math.PI), deg0 = -(A(min) * 180 / Math.PI);
    out += '<g><polygon points="' + cx + ',' + (cy - 6) + ' ' + (cx + R - 22) + ',' + cy + ' ' + cx + ',' + (cy + 6) + '" fill="' + T.acc2 + '"/><animateTransform attributeName="transform" type="rotate" from="' + r1(deg0) + ' ' + cx + ' ' + cy + '" to="' + r1(deg) + ' ' + cx + ' ' + cy + '" dur="1.6s" fill="freeze" calcMode="spline" keySplines=".2 .7 .3 1" keyTimes="0;1"/><set attributeName="opacity" to="1"/></g>';
    out = out.replace('<g><polygon', '<g transform="rotate(' + r1(deg) + ' ' + cx + ' ' + cy + ')"><polygon');
    out += '<circle cx="' + cx + '" cy="' + cy + '" r="12" fill="' + T.ink + '"/>' + tx(cx, cy + 58, val + ' ' + uni, { f: T.tit, s: 26, c: T.acc2, w: 700 }) + (et ? tx(cx, cy + 80, et, { f: F, s: 12, c: T.ink }) : '');
    return svg(320, 320, out, 300);
  }

  /* ─────────── generadores por receta ─────────── */
  function liquidos(rc, C, r) {
    var f = factor(rc, C), L = rc.ing.filter(function (g) { return g[1] === 'ml'; }).slice(0, 3).map(function (g) { return [Math.round(g[0] * f), loc(g[2], C)]; });
    if (!L.length || !SV.recipiente) return null;
    var mx = Math.max.apply(null, L.map(function (x) { return x[0]; })), cap = mx > 500 ? 1000 : mx > 250 ? 500 : 250, forma = rc.cat === 'batidos' ? 'vaso_p' : 'jarra';
    var figs = L.map(function (x, i) { return SV.recipiente(C, forma, cap, Math.min(cap, x[0]), 'ABC'.charAt(i)); });
    var fig = '<div style="display:grid;grid-template-columns:repeat(' + L.length + ',1fr);gap:6mm;max-width:' + (L.length * 46) + 'mm;margin:0 auto">' + figs.join('') + '</div>' +
      '<div style="display:flex;gap:6mm;justify-content:center;margin-top:2mm;font-size:.9em">' + L.map(function (x, i) { return '<span><b>' + 'ABC'.charAt(i) + '</b> · ' + esc(x[1]) + '</span>'; }).join('') + '</div>';
    var tot = L.reduce(function (s, x) { return s + x[0]; }, 0), tz = Math.round(L[0][0] / 250 * 100) / 100;
    var items = [it('corta', '¿Cuántos mL de ' + L[0][1] + ' marca la jarra A?', L[0][0] + ' mL', num(L[0][0], [L[0][0] + ' ml', L[0][0] + 'ml'])), it('corta', '¿A cuántas tazas medidoras (250 mL) equivale?', fmt(tz), num(tz))];
    if (L.length > 1) items.push(it('corta', '¿Cuántos litros de líquido lleva la receta en total?', fmt(tot / 1000) + ' L', num(tot / 1000)));
    return { t: 'Mide los líquidos', intro: 'Líquidos de «' + nombre(rc, C) + '»' + (f !== 1 ? ' ya ajustados a tus porciones' : '') + '. Lee la jarra a la altura de los ojos, apoyada en la mesa.', fig: fig + porque(C, 'Medir en mL y no «a ojo» es lo que hace que la receta salga igual cada vez. Una masa con un 10 % más de líquido cambia de textura: el bizcocho se hunde y el pan se aplana.'), items: items };
  }
  function horno(rc, C, r) {
    if (!rc.h) return null;
    var us = C.pk === 'us', Fh = Math.round((rc.h * 9 / 5 + 32) / 5) * 5, val = us ? Fh : rc.h, mn = us ? 200 : 100, mx = us ? 500 : 260;
    var zc = function (a, b) { return us ? Math.round(a * 9 / 5 + 32) : a; };
    var zonas = [[mn, zc(160), clr(C.T.acc, .45), 'suave'], [zc(160), zc(200), C.T.acc, 'moderado'], [zc(200), mx, osc(C.T.acc2, .1), 'fuerte']];
    var zona = rc.h < 160 ? 'suave' : rc.h <= 200 ? 'moderado' : 'fuerte';
    var items = [mc('¿En qué zona del horno se cuece?', ['suave', 'moderado', 'fuerte'], zona), us ? it('corta', 'Pasa ' + Fh + ' °F a grados Celsius (redondea): °C = (°F − 32) × 5 ÷ 9.', rc.h + ' °C', num(rc.h)) : it('corta', 'Una receta americana pide 350 °F. ¿Cuántos °C son (redondea)? °C = (°F − 32) × 5 ÷ 9', '177 °C', num(177, [175, 180])), it('corta', 'Si el horno tarda 12 minutos en precalentar y la receta dura ' + rc.min + ' min, ¿cuántos minutos contando el precalentado?', (rc.min + 12) + ' min', num(rc.min + 12))];
    var exp = rc.cat === 'panaderia' ? 'A partir de unos 140 °C la superficie se dora (reacción de Maillard) y forma la corteza. El pan pide horno fuerte para que el vapor del interior lo haga crecer antes de que la corteza se endurezca.' : rc.h < 160 ? 'El calor suave cuaja sin hinchar: por eso los flanes y merengues se hornean despacio, a veces al baño maría.' : 'A temperatura moderada el aire atrapado en la masa se dilata y la estructura cuaja a la vez. Si el horno está demasiado fuerte, la corteza se cierra y el centro queda crudo.';
    return { t: 'La temperatura del horno', intro: '«' + nombre(rc, C) + '» se hornea a ' + (us ? Fh + ' °F (' + rc.h + ' °C)' : rc.h + ' °C') + '.', fig: dial(C, mn, mx, val, zonas, us ? '°F' : '°C', 'horno precalentado') + porque(C, exp), items: items };
  }
  var PROC = [[/tibi/i, 37, 'Leche o agua tibia', 'La levadura trabaja mejor entre 25 y 38 °C y muere hacia los 55 °C. Si el líquido quema al tocarlo, el pan no subirá.'], [/baño mar/i, 70, 'Baño maría', 'El agua caliente reparte el calor con suavidad: el huevo cuaja sin cortarse. Las claras del merengue suizo se calientan hasta unos 70 °C para que sea estable.'], [/hierv|hervir|rompa a hervir/i, 100, 'Hervor', 'El agua hierve a 100 °C al nivel del mar. La maicena necesita llegar a ese punto para espesar la crema; si no hierve, la crema se afloja al enfriar.'], [/funde|fundir|derrit/i, 45, 'Fundir el chocolate', 'El chocolate negro se funde a unos 45 °C. Por encima de 55 °C se quema y se vuelve granuloso: por eso se funde a fuego muy bajo o al baño maría.'], [/fr[ií]a|nevera|frío/i, 4, 'Frío de nevera', 'La nevera está a unos 4 °C. La mantequilla fría no se mezcla con la harina y deja capas: así la masa queda quebradiza y crujiente.']];
  function proceso(rc, C, r) {
    var txt = rc.s.join(' '), P0 = PROC.filter(function (p) { return p[0].test(txt); })[0];
    if (!P0) return null;
    var zonas = [[0, 10, clr(C.T.acc, .5), 'frío'], [10, 40, clr(C.T.acc2, .6), 'tibio'], [40, 80, C.T.acc2, 'caliente'], [80, 120, osc(C.T.acc2, .25), 'hervor']];
    var items = [it('corta', '¿Qué temperatura marca el termómetro?', P0[1] + ' °C', num(P0[1], [P0[1] + '°'])), mc('¿Qué zona del termómetro es?', ['frío', 'tibio', 'caliente', 'hervor'].slice(0, 4), P0[1] < 10 ? 'frío' : P0[1] <= 40 ? 'tibio' : P0[1] < 80 ? 'caliente' : 'hervor'), it('abierta', 'Explica qué pasaría en esta receta si no se respeta esa temperatura.', P0[3], { lin: 2 })];
    return { t: 'Temperatura del proceso: ' + P0[2].toLowerCase(), intro: 'Un paso de «' + nombre(rc, C) + '» depende de la temperatura. Un termómetro de cocina quita las dudas.', fig: dial(C, 0, 120, P0[1], zonas, '°C', P0[2]) + porque(C, P0[3]), items: items };
  }
  function proporcion(rc, C, r) {
    var f = factor(rc, C), g = rc.ing.filter(function (x) { return x[1] === 'g' || x[1] === 'ml'; }).map(function (x) { return [loc(x[2], C).replace(/\s*\(.*\)$/, ''), x[0] * f, x[2]]; });
    if (g.length < 3) return null;
    var harina = g.filter(function (x) { return /harina/i.test(x[2]); }).reduce(function (s, x) { return s + x[1]; }, 0);
    if (rc.cat === 'panaderia' && harina) {
      var pc = g.map(function (x) { return Math.round(x[1] / harina * 1000) / 10; }), agua = g.filter(function (x) { return /agua|leche/i.test(x[2]); }).reduce(function (s, x) { return s + x[1]; }, 0), hid = Math.round(agua / harina * 100), sal = g.filter(function (x) { return /^sal$/i.test(x[2]); })[0];
      var sub = g.filter(function (x) { return !/harina/i.test(x[2]); }), fig = SV.barras(C, { cats: ['harina'].concat(sub.map(function (x) { return x[0]; })).slice(0, 6), vals: [100].concat(sub.map(function (x) { return Math.round(x[1] / harina * 100); })).slice(0, 6), unidad: '% de la harina', valores: true, max: 110 });
      var items = [it('corta', '¿Qué hidratación tiene la masa (agua y leche ÷ harina × 100)?', hid + ' %', num(hid, [hid + '%'])), it('corta', 'Con 1 kg de harina y la misma hidratación, ¿cuántos mL de líquido pondrías?', (hid * 10) + ' mL', num(hid * 10, [hid * 10 + ' ml']))];
      if (sal) items.push(it('corta', '¿Qué porcentaje de sal lleva respecto a la harina?', fmt(Math.round(sal[1] / harina * 1000) / 10) + ' %', num(Math.round(sal[1] / harina * 1000) / 10)));
      return { t: 'Porcentaje panadero', intro: 'En panadería todo se calcula respecto a la harina, que vale siempre 100 %. Así la receta se escala a cualquier cantidad.', fig: fig + porque(C, 'Con una hidratación baja (60 %) la masa es firme y la miga cerrada; por encima del 75 % la masa se pega y la miga sale abierta, con alvéolos grandes, como en la focaccia.'), items: items };
    }
    var ord = g.slice().sort(function (a, b) { return b[1] - a[1]; }).slice(0, 5), tot = g.reduce(function (s, x) { return s + x[1]; }, 0);
    var fig2 = SV.sectores(C, { cats: ord.map(function (x) { return x[0]; }), vals: ord.map(function (x) { return x[1]; }) });
    var az = g.filter(function (x) { return /azúcar|miel/i.test(x[2]); }).reduce(function (s, x) { return s + x[1]; }, 0), azp = Math.round(az / tot * 100);
    var items2 = [it('corta', '¿Cuál es el ingrediente que más pesa?', ord[0][0]), it('corta', '¿Cuántos gramos pesa en total la mezcla (cuenta 1 mL = 1 g)?', Math.round(tot) + ' g', num(Math.round(tot)))];
    if (az) items2.push(it('corta', '¿Qué porcentaje de la mezcla es azúcar (redondea)?', azp + ' %', num(azp, [azp + '%'])));
    return { t: 'Las proporciones de la receta', intro: 'Reparto de los ingredientes principales de «' + nombre(rc, C) + '» por peso.', fig: fig2 + porque(C, rc.cat === 'batidos' ? 'La proporción ideal de un batido ronda dos partes de fruta por una de líquido: con más líquido queda aguado; con menos, no pasa por la pajita.' : 'El azúcar no solo endulza: retiene humedad y ayuda a dorar. Si lo reduces más de un tercio, el bizcocho sale más seco y pálido.'), items: items2 };
  }
  function molde(rc, C, r) {
    var m = /molde (?:redondo )?de (\d+) ?cm/i.exec(rc.s.join(' ')); if (!m) return null;
    var d = +m[1], d2 = d + H.pick(r, [-4, 4, 6]), T = C.T, d3 = es3d(C), k = 5.2, cx = 170, cy = 150, out = '';
    var circ = function (dd, fill, st, dash) { return (d3 && !dash ? '<ellipse cx="' + (cx + 4) + '" cy="' + (cy + 7) + '" rx="' + r1(dd * k) + '" ry="' + r1(dd * k) + '" fill="#000" opacity=".14"/>' : '') + '<circle cx="' + cx + '" cy="' + cy + '" r="' + r1(dd * k) + '" fill="' + fill + '" stroke="' + st + '" stroke-width="' + (dash ? 2 : 3) + '"' + (dash ? ' stroke-dasharray="7 5"' : '') + '/>'; };
    out += d2 > d ? circ(d2 / 2, 'none', T.acc2, true) + circ(d / 2, clr(T.acc, .6), T.ink) : circ(d / 2, clr(T.acc, .6), T.ink) + circ(d2 / 2, 'none', T.acc2, true);
    out += '<line x1="' + r1(cx - d / 2 * k) + '" y1="' + cy + '" x2="' + r1(cx + d / 2 * k) + '" y2="' + cy + '" stroke="' + T.ink + '" stroke-width="1.6"/>' + tx(cx, cy - 8, d + ' cm', { f: T.cuerpo, s: 14, c: T.ink, w: 700, st: true });
    out += tx(cx, cy + d2 / 2 * k + 22 > 300 ? 296 : cy + Math.max(d, d2) / 2 * k + 20, 'molde nuevo: ' + d2 + ' cm (línea discontinua)', { f: T.cuerpo, s: 12, c: T.acc2, w: 700 });
    var A1 = Math.round(3.14 * (d / 2) * (d / 2)), A2 = Math.round(3.14 * (d2 / 2) * (d2 / 2)), fac = Math.round(A2 / A1 * 100) / 100;
    var hr = rc.ing.filter(function (x) { return /harina/i.test(x[2]) && x[1] === 'g'; })[0];
    var items = [it('corta', 'Calcula el área del fondo del molde de ' + d + ' cm (usa π ≈ 3,14 y redondea).', A1 + ' cm²', num(A1)), it('corta', '¿Por cuánto multiplicas los ingredientes para el molde de ' + d2 + ' cm? (área nueva ÷ área original, dos decimales)', fmt(fac), num(fac))];
    if (hr) items.push(it('corta', '¿Cuánta harina necesitas entonces (redondea)?', Math.round(hr[0] * fac) + ' g', num(Math.round(hr[0] * fac))));
    return { t: 'El molde y su superficie', intro: 'La receta pide un molde de ' + d + ' cm de diámetro. ¿Y si tu molde es de ' + d2 + ' cm?', fig: svg(340, 310, out, 320) + porque(C, 'La masa se reparte por la superficie, que crece con el cuadrado del diámetro: un molde solo 4 cm más grande necesita casi un 40 % más de masa. Si no ajustas, el bizcocho sale plano y se seca.'), items: items };
  }
  function durMin(s) {
    var t = s.toLowerCase(), m;
    if (/hora y media/.test(t)) return 90;
    if ((m = /(\d+(?:[.,]\d+)?)\s*horas?/.exec(t))) return Math.round(parseFloat(m[1].replace(',', '.')) * 60);
    if (/\buna hora\b|\b1 hora\b/.test(t)) return 60;
    if ((m = /(\d+)\s*(?:a\s*\d+\s*)?minutos?/.exec(t))) return +m[1];
    if ((m = /toda la noche|12 horas/.exec(t))) return 720;
    return 0;
  }
  function plan(rc, C, r) {
    var pasos = rc.s.map(function (s) { var i = s.indexOf(':'); return [i > 0 && i < 24 ? s.slice(0, i) : s.slice(0, 18), durMin(s)]; }).filter(function (p) { return p[1] > 0; });
    if (pasos.length < 2) return null;
    var T = C.T, tot = pasos.reduce(function (s, p) { return s + p[1]; }, 0), W = 620, x0 = 150, bw = W - x0 - 30, rowH = 34, out = '', d3 = es3d(C), acc = 0, pal = SV.paleta(C);
    pasos.forEach(function (p, i) {
      var x = x0 + acc / tot * bw, w = Math.max(4, p[1] / tot * bw), y = 14 + i * rowH, c = pal[i % pal.length];
      out += tx(x0 - 10, y + 17, p[0], { f: T.cuerpo, s: 12.5, c: T.ink, w: 700, a: 'end' });
      if (d3) out += '<polygon points="' + r1(x) + ',' + y + ' ' + r1(x + 6) + ',' + (y - 5) + ' ' + r1(x + w + 6) + ',' + (y - 5) + ' ' + r1(x + w) + ',' + y + '" fill="' + clr(c, .4) + '"/><polygon points="' + r1(x + w) + ',' + y + ' ' + r1(x + w + 6) + ',' + (y - 5) + ' ' + r1(x + w + 6) + ',' + (y + 19) + ' ' + r1(x + w) + ',' + (y + 24) + '" fill="' + osc(c, .3) + '"/>';
      out += '<rect x="' + r1(x) + '" y="' + y + '" width="' + r1(w) + '" height="24" fill="' + c + '"><animate attributeName="width" from="0" to="' + r1(w) + '" dur=".8s" begin="' + (i * .25) + 's" fill="freeze"/></rect>' + tx(x + w + (d3 ? 12 : 6), y + 17, p[1] >= 60 ? fmt(p[1] / 60) + ' h' : p[1] + ' min', { f: T.cuerpo, s: 11.5, c: T.ink, a: 'start', st: true });
      acc += p[1];
    });
    var Hh = 14 + pasos.length * rowH + 10;
    var larg = pasos.slice().sort(function (a, b) { return b[1] - a[1]; })[0], hIni = H.pick(r, [8, 9, 10, 15, 16]), fin = hIni * 60 + tot, hf = Math.floor(fin / 60) % 24, mf = fin % 60, hora = hf + ':' + String(mf).padStart(2, '0');
    var items = [it('corta', '¿Qué paso es el más largo?', larg[0]), it('corta', '¿Cuánto tiempo suman los pasos medidos?', tot >= 60 ? fmt(tot / 60) + ' h' : tot + ' min', num(tot, [fmt(tot / 60), tot + ' min'])), it('corta', 'Si empiezas a las ' + hIni + ':00, ¿a qué hora terminas estos pasos?', hora, { ac: [hora, hora.replace(':', '.'), hora.replace(/^0/, '')] })];
    return { t: 'Plan de trabajo', intro: 'Diagrama de tiempos de «' + nombre(rc, C) + '»: cada barra es un paso y su largo, lo que tarda.', fig: svg(W, Hh, out, 620) + porque(C, rc.cat === 'panaderia' ? 'En panadería el tiempo es un ingrediente: los levados largos no se pueden acortar sin perder volumen y sabor. Planifica hacia atrás desde la hora a la que quieres el pan.' : 'Los profesionales ordenan la receta como un plan de obra: mientras algo reposa o se hornea, se prepara lo siguiente. Así nada espera y todo sale a tiempo.'), items: items };
  }
  var GEN = { liquidos: liquidos, horno: horno, proceso: proceso, proporcion: proporcion, molde: molde, plan: plan };
  var ORDEN = ['proporcion', 'horno', 'liquidos', 'plan', 'proceso', 'molde'];
  function visualDe(rc, C, k, usados) {
    for (var q = 0; q < ORDEN.length; q++) {
      var ty = ORDEN[(H.hash(rc.id) + k + q) % ORDEN.length];
      if (usados[rc.id + ty]) continue;
      usados[rc.id + ty] = 1;
      var sem = H.hash(rc.id + ty) + (C.semilla || 1) * 13, V = null; try { V = GEN[ty](rc, C, H.rng(sem)); } catch (e) { console.warn('taller', ty, e); }
      if (V) { V.items.forEach(function (x) { x.e = H.sub(x.e, C); }); V._g = ty; V._s = sem; return V; }
    }
    return null;
  }

  /* ─────────── recetario: una página visual tras cada receta ─────────── */
  var ens = ED.ensamblar;
  ED.ensamblar = function (cfg) {
    var res = ens(cfg);
    try {
      var C = res.C, pages = res.pages;
      if (!COC.test(C.mat) || !pages.some(function (p) { return p.tipo === 'coc_receta_b'; })) return res;
      var mis = [], usados = {}, vistos = 0;
      pages.forEach(function (p, i) { if (p.tipo === 'coc_mireceta') { vistos++; if (vistos > 2) mis.push(i); } });
      /* Batidos: el relleno son combinaciones generadas; se cede una de cada tres parejas a páginas visuales. */
      var gpar = 0; pages.forEach(function (p, i) { if (p.tipo === 'coc_receta_a' && p.rc.gen && pages[i + 1] && pages[i + 1].tipo === 'coc_receta_b') { gpar++; if (gpar > 4 && gpar % 3 !== 1) mis.push(i, i + 1); } });
      var quitarSet = {}; mis.forEach(function (i) { quitarSet[i] = 1; });
      var recs = pages.map(function (p, i) { return p.tipo === 'coc_receta_b' && !quitarSet[i] && (!p.rc.gen || C.mat === 'batidos') ? i : -1; }).filter(function (i) { return i >= 0; });
      var libres = mis.length, nuevas = [];
      for (var ronda = 0; libres > 0 && ronda < 4; ronda++) recs.forEach(function (i) {
        if (libres <= 0) return;
        var p = pages[i], V = visualDe(p.rc, C, ronda, usados);
        if (V) { nuevas.push([i, { tipo: 'vis', v: V, items: V.items, cab: p.cab, n: p.n, relleno: true, rc: p.rc }]); libres--; }
      });
      if (!nuevas.length) return res;
      var quitar = {}; mis.slice(0, nuevas.length).forEach(function (i) { quitar[i] = 1; });
      var porPos = {}; nuevas.forEach(function (n) { (porPos[n[0]] = porPos[n[0]] || []).push(n[1]); });
      var out = [];
      pages.forEach(function (p, i) { if (quitar[i]) return; out.push(p); (porPos[i] || []).forEach(function (v) { out.push(v); }); });
      out.forEach(function (p, i) { p.num = i + 1; });
      res.pages = out;
    } catch (e) { console.warn('EU_TALLER', e); }
    return res;
  };

  /* ─────────── libros de texto: Cocina y «La ciencia en la cocina» ─────────── */
  function recDe(u, C, r) {
    var cat = u.cat || (COC.test(C.mat) && C.mat !== 'cocina' ? C.mat : null), L = CO.RECETAS.filter(function (x) { return !x.gen && (!cat || x.cat === cat); });
    return L.length ? H.pick(r, L) : null;
  }
  function genTaller(tipos, pref) {
    return function (u, C, r) {
      var rc = recDe(u, C, r); if (!rc) return null;
      for (var q = 0; q < tipos.length; q++) { var V = GEN[tipos[(Math.floor(r() * tipos.length) + q) % tipos.length]](rc, C, r); if (V) { if (pref) V.t = pref + V.t.charAt(0).toLowerCase() + V.t.slice(1); return V; } }
      return null;
    };
  }
  SV.visual('taller_coc', genTaller(ORDEN), { materias: COC, max: 3 });
  SV.visual('taller_mate', genTaller(['proporcion', 'molde', 'plan'], 'La matemática en la cocina: '), { materias: /^(mate|conta|geoalg|calculo)$/, max: 1 });
  SV.visual('taller_ciencia', genTaller(['proceso', 'horno', 'liquidos'], 'La ciencia en la cocina: '), { materias: /^(fisica|quimica|natu|bio)$/, max: 1 });

  window.EU_TALLER = { generadores: GEN, orden: ORDEN, dial: dial, visualDe: visualDe };
})();
