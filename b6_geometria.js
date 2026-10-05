/* b6_geometria.js — Motor de geometría transversal (window.EU_GEO).
   La geometría alimenta a todas las materias, no solo a Matemáticas:
   · simetría (Biología, Anatomía, Arte, Religión, Matemáticas…), canon y proporciones del cuerpo
     (Anatomía, Arte, Educación física), polígonos y rosetones (Arte, Religión, Tecnología),
     áreas y planos con escala (Geografía, Contabilidad, Sociales), escala de mapas con distancias reales,
     vectores de fuerza, densidad de cuerpos 3D, transportador de ángulos, canchas deportivas,
     microscopio y escala en Biología, geometría molecular en Química y fracciones del compás en Música.
   Cada generador se registra con EU_SVG.visual y respeta el interruptor 2D / 3D.
   Cargar después de b6_cerebro_visual.js. */
(function () {
  var ED = window.EU_EDITORIAL, SV = window.EU_SVG;
  if (!ED || !SV || !SV.visual || window.EU_GEO) return;
  var H = ED.H, esc = H.esc, it = H.it, E = H.ent, osc = SV.osc, clr = SV.clr, NS = 'xmlns="http://www.w3.org/2000/svg"', uid = 0;
  function r1(n) { return Math.round(n * 10) / 10; }
  function fmt(n) { return String(Math.round(n * 100) / 100).replace('.', ','); }
  function es3d(C) { return C.prem ? C.prem.dibujo === '3d' : (((C.cfg && C.cfg.acab) || {}).dibujo || '3d') === '3d'; }
  function esPeq(C) { return /^(inf|pri1|pri2)$/.test(C.bnd || ''); }
  function svg(w, h, body, maxw) { return '<svg ' + NS + ' data-plano="1" viewBox="0 0 ' + w + ' ' + h + '" style="width:100%;max-width:' + (maxw || w) + 'px;height:auto;display:block;margin:0 auto">' + body + '</svg>'; }
  function tx(x, y, s, o) { o = o || {}; return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || 'middle') + '" font-size="' + (o.s || 13) + '" font-family="' + esc(o.f || 'sans-serif') + '" font-weight="' + (o.w || 400) + '" fill="' + (o.c || '#222') + '"' + (o.st ? ' stroke="#fff" stroke-width="3" paint-order="stroke"' : '') + '>' + esc(s) + '</text>'; }
  function poly(p, at) { return '<polygon points="' + p.map(function (q) { return r1(q[0]) + ',' + r1(q[1]); }).join(' ') + '" ' + at + '/>'; }
  function ln(a, b, at) { return '<line x1="' + r1(a[0]) + '" y1="' + r1(a[1]) + '" x2="' + r1(b[0]) + '" y2="' + r1(b[1]) + '" ' + at + '/>'; }
  function flecha(a, b, col, w, et, C) {
    var ang = Math.atan2(b[1] - a[1], b[0] - a[0]), L = 12, p1 = [b[0] - L * Math.cos(ang - .4), b[1] - L * Math.sin(ang - .4)], p2 = [b[0] - L * Math.cos(ang + .4), b[1] - L * Math.sin(ang + .4)];
    var e = [b[0] - 6 * Math.cos(ang), b[1] - 6 * Math.sin(ang)];
    return ln(a, e, 'stroke="' + col + '" stroke-width="' + (w || 4) + '" stroke-linecap="round"') + poly([b, p1, p2], 'fill="' + col + '"') + (et ? tx(b[0] + 16 * Math.cos(ang) + (Math.abs(Math.cos(ang)) < .3 ? 14 : 0), b[1] + 16 * Math.sin(ang) + 5, et, { f: C.T.cuerpo, s: 14, c: col, w: 700, st: true }) : '');
  }
  function mc(e, ops, bien, x) { return it('mc', e, 'abc'.charAt(ops.indexOf(bien)) + ') ' + bien, Object.assign({ o: ops, c: ops.indexOf(bien) }, x || {})); }
  function num(v, ext) { return { ac: [v, fmt(v), String(v)].concat(ext || []) }; }
  var S = function (s, C) { return H.sub(s, C); };

  /* ─────────── Simetría ─────────── */
  var EJES = [['el cuadrado', 4], ['el rectángulo', 2], ['el triángulo equilátero', 3], ['el pentágono regular', 5], ['el hexágono regular', 6], ['el rombo', 2], ['el trapecio isósceles', 1], ['el triángulo isósceles', 1], ['el octógono regular', 8]];
  var SIM_CTX = {
    bio: 'Muchos seres vivos, como la mariposa o la hoja, tienen simetría bilateral.', anat: 'El cuerpo humano tiene simetría bilateral: el eje pasa por la nariz y el ombligo.',
    arte: 'Los diseñadores usan la simetría para dar equilibrio a una composición.', religion: 'Los rosetones, los mandalas y los mosaicos sagrados se basan en la simetría.',
    natu: 'La simetría aparece en flores, insectos y cristales.', tecno: 'Las piezas simétricas se equilibran mejor al girar.', efisica: 'En gimnasia, una postura simétrica reparte el peso igual en los dos lados.'
  };
  function genSimetria(u, C, r) {
    var T = C.T, n = 10, c = 30, W = n * c, out = '', lado = [], d3 = es3d(C);
    var alto = [];
    for (var x = 0; x < 4; x++) alto.push([E(r, 1, 3), E(r, 6, 8)]);
    for (var yy = 0; yy < n; yy++) for (var xx = 0; xx < 5; xx++) {
      var col = 4 - xx, hueco = col < 4 && yy >= alto[col][0] && yy <= alto[col][1] || col === 4 && yy >= 2 && yy <= 7;
      if (xx === 4 && yy >= 1 && yy <= 8) hueco = true;
      if (hueco) lado.push([xx, yy]);
    }
    var celda = {}; lado.forEach(function (p) { celda[p[0] + ',' + p[1]] = 1; });
    for (var i = 0; i <= n; i++) out += ln([i * c, 0], [i * c, W], 'stroke="' + T.soft + '" stroke-width="1"') + ln([0, i * c], [W, i * c], 'stroke="' + T.soft + '" stroke-width="1"');
    lado.forEach(function (p) {
      if (d3) out += '<rect x="' + (p[0] * c + 3) + '" y="' + (p[1] * c + 3) + '" width="' + c + '" height="' + c + '" fill="' + osc(T.acc, .35) + '"/>';
      out += '<rect x="' + p[0] * c + '" y="' + p[1] * c + '" width="' + c + '" height="' + c + '" fill="' + (d3 ? clr(T.acc, .15) : T.acc) + '" stroke="#fff" stroke-width="1"/>';
    });
    out += ln([W / 2, -8], [W / 2, W + 8], 'stroke="' + T.acc2 + '" stroke-width="3" stroke-dasharray="8 5"') + tx(W / 2, W + 24, 'eje de simetría', { f: T.cuerpo, s: 12, c: T.acc2, w: 700 });
    var fig = svg(W, W + 30, out, 380), e = H.pick(r, EJES), total = lado.length * 2;
    var items = [it('corta', '¿Cuántos cuadros tendrá la figura completa?', total, num(total)), mc('¿Cuántos ejes de simetría tiene ' + e[0] + '?', H.mezcla(r, [e[1], e[1] + 1, Math.max(0, e[1] - 1) || e[1] + 2].map(String)), String(e[1]))];
    if (!esPeq(C)) items.push(it('abierta', 'Busca en tu entorno un objeto con simetría radial y dibújalo.', '', { lin: 2 }));
    return { t: 'Completa la simetría', intro: (SIM_CTX[C.mat] || 'Una figura es simétrica si el eje la divide en dos mitades iguales.') + ' Pinta en la cuadrícula la mitad que falta.', fig: fig, items: items };
  }

  /* ─────────── Canon y proporciones del cuerpo ─────────── */
  function canonSVG(C, cab) {
    var T = C.T, F = T.cuerpo, u = 44, x0 = 150, top = 20, out = '', d3 = es3d(C), piel = clr(T.acc, .55), cont = osc(T.acc, .3);
    var marcas = ['cabeza', 'pecho', 'ombligo', 'cadera', 'medio muslo', 'rodilla', 'media pierna', 'pies'];
    for (var i = 0; i <= 8; i++) { out += ln([40, top + i * u], [300, top + i * u], 'stroke="' + T.soft + '" stroke-width="1"' + (i % 8 ? ' stroke-dasharray="3 4"' : '')); if (i < 8) out += tx(34, top + i * u + u / 2 + 4, i + 1, { f: F, s: 12, c: T.acc, w: 700, a: 'end' }) + tx(306, top + (i + 1) * u + 4, marcas[i], { f: F, s: 11, c: T.ink, a: 'start' }); }
    var Y = function (k) { return top + k * u; }, st = 'stroke="' + cont + '" stroke-width="2" stroke-linejoin="round"';
    var g = '';
    g += '<ellipse cx="' + x0 + '" cy="' + r1(Y(.5)) + '" rx="' + r1(u * .36) + '" ry="' + r1(u * .48) + '" fill="' + piel + '" ' + st + '/>';
    g += '<rect x="' + (x0 - 7) + '" y="' + r1(Y(.95)) + '" width="14" height="' + r1(u * .3) + '" fill="' + piel + '" ' + st + '/>';
    g += poly([[x0 - u * .95, Y(1.2)], [x0 + u * .95, Y(1.2)], [x0 + u * .62, Y(3)], [x0 - u * .62, Y(3)]], 'fill="' + piel + '" ' + st);
    g += poly([[x0 - u * .62, Y(3)], [x0 + u * .62, Y(3)], [x0 + u * .75, Y(4)], [x0 - u * .75, Y(4)]], 'fill="' + piel + '" ' + st);
    [-1, 1].forEach(function (s) {
      g += poly([[x0 + s * u * .95, Y(1.2)], [x0 + s * u * 1.22, Y(1.35)], [x0 + s * u * 1.18, Y(3.9)], [x0 + s * u * .98, Y(3.9)], [x0 + s * u * .82, Y(1.6)]], 'fill="' + piel + '" ' + st);
      g += poly([[x0 + s * u * .05, Y(4)], [x0 + s * u * .75, Y(4)], [x0 + s * u * .55, Y(7.85)], [x0 + s * u * .15, Y(7.85)]], 'fill="' + piel + '" ' + st);
      g += '<ellipse cx="' + r1(x0 + s * u * .38) + '" cy="' + r1(Y(7.9)) + '" rx="' + r1(u * .3) + '" ry="' + r1(u * .12) + '" fill="' + piel + '" ' + st + '/>';
    });
    if (d3) out += '<g transform="translate(4 5)" opacity=".22">' + g.replace(/fill="[^"]+"/g, 'fill="#000"').replace(/stroke="[^"]+"/g, 'stroke="none"') + '</g>';
    out += g + ln([x0, Y(0)], [x0, Y(8)], 'stroke="' + T.acc2 + '" stroke-width="1.4" stroke-dasharray="5 4"');
    out += '<path d="M' + (x0 + u * 1.5) + ',' + Y(0) + ' l8,0 l0,' + (8 * u) + ' l-8,0" fill="none" stroke="' + T.acc2 + '" stroke-width="1.6"/>' + tx(x0 + u * 1.5 + 12, Y(4), cab ? '8 × ' + cab : '8 cabezas', { f: F, s: 12, c: T.acc2, w: 700, a: 'start', st: true });
    return svg(400, top * 2 + 8 * u, out, 330);
  }
  function genCanon(u, C, r) {
    var cab = H.pick(r, [20, 21, 22, 23, 24]), alt = cab * 8, omb = cab * 5, rod = cab * 2;
    var items = [it('corta', 'Si la cabeza mide ' + cab + ' cm, ¿cuánto mide la figura completa?', alt + ' cm', num(alt)), it('corta', '¿A qué altura del suelo queda el ombligo (a tres cabezas del suelo… o a cinco desde arriba)?', (alt - 3 * cab) + ' cm', num(alt - 3 * cab)), it('corta', '¿Cuánto mide del suelo a la rodilla (dos cabezas)?', rod + ' cm', num(rod))];
    if (!esPeq(C)) items.push(it('corta', 'La envergadura es casi igual a la altura. ¿Cuánto medirá aproximadamente?', alt + ' cm', num(alt)));
    var intro = { anat: 'Los anatomistas y artistas usan la cabeza como unidad para medir el cuerpo adulto.', arte: 'El canon clásico de ocho cabezas sirve para encajar la figura humana en el dibujo.', efisica: 'Conocer las proporciones del cuerpo ayuda a entender las palancas del movimiento.' }[C.mat] || 'El cuerpo adulto mide unas ocho cabezas de alto.';
    return { t: 'El canon de ocho cabezas', intro: intro, fig: canonSVG(C, cab + ' cm'), items: items };
  }
  function genAureo(u, C, r) {
    var T = C.T, a = H.pick(r, [10, 12, 15, 20, 25]), b = Math.round(a * 1.618 * 10) / 10, W = 520, k = 300 / b, out = '', d3 = es3d(C);
    var x0 = 30, y0 = 20, w = b * k, h = a * k, sq = h, fi = Math.PI / 2;
    if (d3) out += '<rect x="' + (x0 + 5) + '" y="' + (y0 + 6) + '" width="' + r1(w) + '" height="' + r1(h) + '" fill="' + osc(T.acc, .45) + '"/>';
    out += '<rect x="' + x0 + '" y="' + y0 + '" width="' + r1(w) + '" height="' + r1(h) + '" fill="' + clr(T.acc, .8) + '" stroke="' + T.ink + '" stroke-width="2"/>';
    out += '<rect x="' + x0 + '" y="' + y0 + '" width="' + r1(sq) + '" height="' + r1(sq) + '" fill="' + clr(T.acc, .55) + '" stroke="' + T.ink + '" stroke-width="1.4"/>';
    var s2 = w - sq; out += '<rect x="' + r1(x0 + sq) + '" y="' + y0 + '" width="' + r1(s2) + '" height="' + r1(s2) + '" fill="' + clr(T.acc2, .6) + '" stroke="' + T.ink + '" stroke-width="1.2"/>';
    out += '<path d="M' + r1(x0) + ',' + r1(y0 + sq) + ' A' + r1(sq) + ',' + r1(sq) + ' 0 0 1 ' + r1(x0 + sq) + ',' + r1(y0) + ' A' + r1(s2) + ',' + r1(s2) + ' 0 0 1 ' + r1(x0 + sq + s2) + ',' + r1(y0 + s2) + '" fill="none" stroke="' + T.acc2 + '" stroke-width="3"/>';
    out += tx(x0 + w / 2, y0 + h + 22, b + ' cm', { f: T.cuerpo, s: 13, c: T.ink, w: 700 }) + tx(x0 - 8, y0 + h / 2, a + ' cm', { f: T.cuerpo, s: 13, c: T.ink, w: 700, a: 'end' });
    var a2 = H.pick(r, [8, 30, 40, 50]), b2 = Math.round(a2 * 1.618 * 10) / 10;
    return { t: 'El rectángulo áureo', intro: 'Sus lados están en proporción 1 : 1,618 (el número de oro). Si le quitas un cuadrado, queda otro rectángulo áureo más pequeño.', fig: svg(W, h + 60, out, 480), items: [it('corta', 'Si el lado corto mide ' + a2 + ' cm, ¿cuánto medirá el largo? (redondea a una cifra decimal)', fmt(b2) + ' cm', num(b2)), it('corta', '¿Cuánto mide el lado del cuadrado grande del dibujo?', a + ' cm', num(a)), it('abierta', 'Busca un objeto (tarjeta, libro, pantalla) y comprueba si es casi áureo.', '', { lin: 2 })] };
  }

  /* ─────────── Polígonos y rosetones ─────────── */
  function genPoligono(u, C, r) {
    var T = C.T, n = H.pick(r, esPeq(C) ? [3, 4, 5, 6] : [5, 6, 8, 10, 12]), R = 130, cx = 170, cy = 160, out = '', d3 = es3d(C), pal = SV.paleta(C);
    var P = []; for (var i = 0; i < n; i++) { var a = -Math.PI / 2 + i * 2 * Math.PI / n; P.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]); }
    if (d3) out += poly(P.map(function (p) { return [p[0] + 4, p[1] + 6]; }), 'fill="' + osc(T.acc, .45) + '"');
    P.forEach(function (p, i) { var q = P[(i + 1) % n]; out += poly([[cx, cy], p, q], 'fill="' + (d3 ? clr(pal[i % 2 ? 0 : 1], i % 2 ? .35 : .55) : i % 2 ? clr(T.acc, .6) : '#fff') + '" stroke="' + T.ink + '" stroke-width="1.4"'); });
    if (n >= 5) for (var j = 0; j < n; j++) out += ln(P[j], P[(j + 2) % n], 'stroke="' + T.acc2 + '" stroke-width="1.2" opacity=".75"');
    out += poly(P, 'fill="none" stroke="' + T.ink + '" stroke-width="3"') + '<circle cx="' + cx + '" cy="' + cy + '" r="' + r1(R * Math.cos(Math.PI / n) * .38) + '" fill="#fff" stroke="' + T.ink + '" stroke-width="1.6"/>';
    var nom = { 3: 'triángulo equilátero', 4: 'cuadrado', 5: 'pentágono', 6: 'hexágono', 8: 'octógono', 10: 'decágono', 12: 'dodecágono' }[n], suma = (n - 2) * 180, ang = Math.round(suma / n * 10) / 10, diag = n * (n - 3) / 2, cen = Math.round(360 / n * 10) / 10;
    var items = esPeq(C) ? [it('corta', '¿Cuántos lados tiene el ' + nom + '?', n, num(n)), it('corta', '¿En cuántos triángulos está dividido el rosetón?', n, num(n))]
      : [it('corta', '¿Cuánto suman los ángulos interiores de un ' + nom + '?', suma + '°', num(suma)), it('corta', '¿Cuánto mide cada ángulo interior?', fmt(ang) + '°', num(ang)), it('corta', '¿Cuánto mide cada ángulo central (en el centro del rosetón)?', fmt(cen) + '°', num(cen)), it('corta', '¿Cuántas diagonales tiene?', diag, num(diag))];
    var ctx = { religion: 'Los rosetones de las catedrales se trazan con polígonos regulares.', arte: 'Este rosetón se construye con un ' + nom + ' dividido en triángulos iguales.', tecno: 'Las tuercas y muchas piezas mecánicas son polígonos regulares.', bio: 'Las celdas del panal son hexágonos: encajan sin dejar huecos.' }[C.mat] || 'Un polígono regular tiene todos sus lados y ángulos iguales.';
    return { t: 'Rosetón: el ' + nom, intro: ctx, fig: svg(340, 320, out, 320), items: items };
  }

  /* ─────────── Plano con área y escala ─────────── */
  function genPlano(u, C, r) {
    var T = C.T, F = T.cuerpo, cw = 34, gw = E(r, 7, 10), gh = E(r, 5, 7), a = E(r, 2, gw - 4), b = E(r, 2, gh - 3), esc2 = H.pick(r, esPeq(C) ? [1] : [1, 2, 5]), out = '', d3 = es3d(C);
    var W = gw * cw, Hh = gh * cw, pts = [[0, 0], [W, 0], [W, Hh - b * cw], [W - a * cw, Hh - b * cw], [W - a * cw, Hh], [0, Hh]];
    for (var i = 0; i <= gw + 1; i++) out += ln([i * cw + 20, 20], [i * cw + 20, (gh + 1) * cw + 20], 'stroke="' + T.soft + '"');
    for (var j = 0; j <= gh + 1; j++) out += ln([20, j * cw + 20], [(gw + 1) * cw + 20, j * cw + 20], 'stroke="' + T.soft + '"');
    var P = pts.map(function (p) { return [p[0] + 20, p[1] + 20]; });
    if (d3) out += poly(P.map(function (p) { return [p[0] + 5, p[1] + 6]; }), 'fill="' + osc(T.acc, .45) + '"');
    out += poly(P, 'fill="' + clr(T.acc, d3 ? .55 : .75) + '" stroke="' + T.ink + '" stroke-width="3"');
    out += tx(20 + W / 2, 14, gw * esc2 + ' m', { f: F, s: 12, c: T.ink, w: 700 }) + tx(12, 20 + Hh / 2, gh * esc2 + ' m', { f: F, s: 12, c: T.ink, w: 700, a: 'end' });
    out += '<rect x="' + (W - 40) + '" y="' + (Hh + 58) + '" width="' + cw + '" height="8" fill="' + T.ink + '"/>' + tx(W - 40 + cw + 6, Hh + 66, '= ' + esc2 + ' m', { f: F, s: 11, c: T.ink, a: 'start' });
    var area = (gw * gh - a * b) * esc2 * esc2, per = 2 * (gw + gh) * esc2;
    var ctx = { geografia: 'Plano de una parcela agrícola.', soci: 'Plano de una plaza del barrio.', conta: 'Plano del local de un negocio.', tecno: 'Plano de un taller.', arte: 'Plano de una sala de exposiciones.', efisica: 'Plano de una zona de juego.' }[C.mat] || 'Plano de un terreno.';
    var items = [it('corta', '¿Cuál es el área de la figura?', area + ' m²', num(area)), it('corta', '¿Cuál es su perímetro?', per + ' m', num(per))];
    if (C.mat === 'conta' || C.adulto) { var pm = H.pick(r, C.P.precios)[1] * E(r, 2, 6); pm = Math.max(1, Math.round(pm)); items.push(it('corta', 'Si el alquiler cuesta ' + H.din(pm, C) + ' por m² al mes, ¿cuánto se paga al mes?', H.din(pm * area, C), { ac: [pm * area, H.num(pm * area, C)] })); }
    else if (C.mat === 'geografia' && area >= 100) items.push(it('corta', 'Una hectárea son 10 000 m². ¿Qué fracción de hectárea es la parcela? (en decimal)', fmt(area / 10000), num(area / 10000)));
    else items.push(it('corta', 'Si se pone valla en todo el borde, ¿cuántos metros de valla hacen falta?', per + ' m', num(per)));
    return { t: 'Área y perímetro en un plano', intro: ctx + ' Cada cuadro representa ' + esc2 + ' m de lado.', fig: svg((gw + 2) * cw + 110, Hh + 80, '<g transform="translate(40 0)">' + out + '</g>', 460), items: items };
  }

  /* ─────────── Escala de mapas con distancias reales ─────────── */
  var CIU = { es: [['Madrid', 40.42, -3.70], ['Barcelona', 41.39, 2.17], ['Sevilla', 37.39, -5.98], ['Valencia', 39.47, -0.38], ['Bilbao', 43.26, -2.93]], mx: [['Ciudad de México', 19.43, -99.13], ['Guadalajara', 20.67, -103.35], ['Monterrey', 25.69, -100.32], ['Mérida', 20.97, -89.62], ['Tijuana', 32.51, -117.04]], co: [['Bogotá', 4.71, -74.07], ['Medellín', 6.24, -75.58], ['Cali', 3.45, -76.53], ['Barranquilla', 10.96, -74.80], ['Cartagena', 10.39, -75.51]], ar: [['Buenos Aires', -34.60, -58.38], ['Córdoba', -31.42, -64.18], ['Rosario', -32.95, -60.65], ['Mendoza', -32.89, -68.83], ['Ushuaia', -54.80, -68.30]], cl: [['Santiago', -33.45, -70.67], ['Valparaíso', -33.05, -71.62], ['Antofagasta', -23.65, -70.40], ['Concepción', -36.83, -73.05], ['Punta Arenas', -53.16, -70.91]], ve: [['Caracas', 10.49, -66.88], ['Maracaibo', 10.65, -71.64], ['Valencia', 10.16, -68.00], ['Barquisimeto', 10.07, -69.32], ['Ciudad Guayana', 8.35, -62.64]], do: [['Santo Domingo', 18.49, -69.93], ['Santiago de los Caballeros', 19.45, -70.70], ['La Romana', 18.43, -68.97], ['Puerto Plata', 19.79, -70.69], ['Punta Cana', 18.58, -68.40]], us: [['Washington D. C.', 38.90, -77.04], ['Nueva York', 40.71, -74.01], ['Los Ángeles', 34.05, -118.24], ['Chicago', 41.88, -87.63], ['Miami', 25.76, -80.19], ['Houston', 29.76, -95.37]] };
  function km(a, b) { var R = 6371, f1 = a[1] * Math.PI / 180, f2 = b[1] * Math.PI / 180, df = f2 - f1, dl = (b[2] - a[2]) * Math.PI / 180, h = Math.sin(df / 2) * Math.sin(df / 2) + Math.cos(f1) * Math.cos(f2) * Math.sin(dl / 2) * Math.sin(dl / 2); return 2 * R * Math.asin(Math.sqrt(h)); }
  function genEscala(u, C, r) {
    var pk = CIU[C.pk] && r() < 0.6 ? C.pk : H.pick(r, Object.keys(CIU)), L0 = CIU[pk], a = L0[0], b = H.pick(r, L0.slice(1)), d = Math.round(km(a, b) / 10) * 10;
    if (d < 30) return null;
    var paso = d > 1500 ? 200 : d > 600 ? 100 : d > 200 ? 50 : 10, cm = Math.round(d / paso * 10) / 10;
    var D = (window.EU_MAPAS_DATOS || {})[pk], fig = '';
    if (D && SV.mapaPais) {
      var ca = D.c.filter(function (c) { return c[0] === a[0]; })[0], cb = D.c.filter(function (c) { return c[0] === b[0]; })[0];
      fig = SV.mapaPais(C, pk, { pts: [ca, cb].filter(Boolean).map(function (c) { return { x: c[1], y: c[2], cap: !!c[3], et: c[0] }; }), max: 420 });
    }
    var T = C.T, bar = '';
    for (var i = 0; i < 4; i++) bar += '<rect x="' + (20 + i * 60) + '" y="10" width="60" height="10" fill="' + (i % 2 ? '#fff' : T.ink) + '" stroke="' + T.ink + '" stroke-width="1.4"/>' + tx(20 + i * 60, 36, i * paso, { f: T.cuerpo, s: 11, c: T.ink });
    bar += tx(260, 36, 4 * paso + ' km', { f: T.cuerpo, s: 11, c: T.ink, a: 'start' });
    fig += '<div style="margin-top:3mm">' + svg(320, 44, bar, 320) + '</div>';
    var items = [it('corta', 'La escala dice 1 cm = ' + paso + ' km. ¿Cuántos centímetros separan ' + a[0] + ' y ' + b[0] + ' en el mapa? (distancia real ≈ ' + H.num(d, C) + ' km)', fmt(cm) + ' cm', num(cm)), it('corta', 'Si en otro mapa hay 6 cm entre dos ciudades con la misma escala, ¿cuántos km son?', 6 * paso + ' km', num(6 * paso))];
    if (!esPeq(C)) items.push(it('corta', 'Escribe la escala numérica equivalente a 1 cm = ' + paso + ' km.', '1:' + (paso * 100000).toLocaleString('es'), { ac: ['1:' + paso * 100000, '1:' + (paso * 100000).toLocaleString('es')] }));
    return { t: 'Distancias con la escala', intro: 'Distancia en línea recta entre ' + a[0] + ' y ' + b[0] + ': unos ' + H.num(d, C) + ' km. La escala gráfica transforma esa distancia en centímetros del mapa.', fig: fig, items: items };
  }

  /* ─────────── Vectores de fuerza ─────────── */
  var TRI = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20]];
  function genVectores(u, C, r) {
    var T = C.T, out = '', d3 = es3d(C), cx = 150, cy = 190, k;
    for (var i = 0; i <= 18; i++) out += ln([i * 20, 0], [i * 20, 300], 'stroke="' + T.soft + '" stroke-width=".8"') + (i <= 15 ? ln([0, i * 20], [360, i * 20], 'stroke="' + T.soft + '" stroke-width=".8"') : '');
    var caja = function () { return (d3 ? poly([[cx - 26, cy - 26], [cx - 16, cy - 36], [cx + 36, cy - 36], [cx + 26, cy - 26]], 'fill="' + clr(T.ink, .55) + '"') + poly([[cx + 26, cy - 26], [cx + 36, cy - 36], [cx + 36, cy + 16], [cx + 26, cy + 26]], 'fill="' + clr(T.ink, .25) + '"') : '') + '<rect x="' + (cx - 26) + '" y="' + (cy - 26) + '" width="52" height="52" fill="' + clr(T.ink, .4) + '" stroke="' + T.ink + '" stroke-width="2"/>'; };
    if (esPeq(C)) {
      var f1 = E(r, 2, 6), f2 = E(r, 2, 6); if (f1 === f2) f2++;
      out += caja() + flecha([cx - 26, cy], [cx - 26 - f1 * 18, cy], T.acc, 5, f1 + ' N', C) + flecha([cx + 26, cy], [cx + 26 + f2 * 18, cy], T.acc2, 5, f2 + ' N', C);
      return { t: 'Fuerzas enfrentadas', intro: 'Dos niños tiran de una caja en sentidos contrarios. Cada cuadro de la flecha vale 1 N.', fig: svg(460, 380, '<g transform="translate(30 60)">' + out + '</g>', 440), items: [mc('¿Hacia dónde se moverá la caja?', ['izquierda', 'derecha', 'no se mueve'], f1 > f2 ? 'izquierda' : 'derecha'), it('corta', '¿Cuál es la fuerza resultante?', Math.abs(f1 - f2) + ' N', num(Math.abs(f1 - f2)))] };
    }
    k = H.pick(r, TRI); var s = 10;
    out += caja() + flecha([cx + 26, cy], [cx + 26 + k[0] * s, cy], T.acc, 5, 'F₁ = ' + k[0] + ' N', C) + flecha([cx, cy - 26], [cx, cy - 26 - k[1] * s], T.acc, 5, 'F₂ = ' + k[1] + ' N', C);
    out += ln([cx + 26 + k[0] * s, cy], [cx + 26 + k[0] * s, cy - 26 - k[1] * s], 'stroke="' + T.ink + '" stroke-width="1.2" stroke-dasharray="5 4"') + ln([cx, cy - 26 - k[1] * s], [cx + 26 + k[0] * s, cy - 26 - k[1] * s], 'stroke="' + T.ink + '" stroke-width="1.2" stroke-dasharray="5 4"');
    out += flecha([cx + 13, cy - 13], [cx + 26 + k[0] * s, cy - 26 - k[1] * s], T.acc2, 4, 'R', C);
    var ang = Math.round(Math.atan2(k[1], k[0]) * 180 / Math.PI);
    var items = [it('corta', 'Calcula el módulo de la fuerza resultante R.', k[2] + ' N', num(k[2])), it('corta', '¿Qué teorema has usado?', 'Pitágoras', { ac: ['Pitágoras', 'teorema de Pitágoras', 'pitagoras'] }), it('corta', '¿Qué ángulo (redondeado) forma R con la horizontal?', ang + '°', num(ang))];
    var ctx = { efisica: 'En una melé dos jugadores empujan en direcciones perpendiculares.', tecno: 'Dos cables tiran de una pieza en ángulo recto.' }[C.mat] || 'Dos fuerzas perpendiculares actúan sobre el mismo cuerpo.';
    return { t: 'Suma de fuerzas', intro: ctx + ' La resultante es la diagonal del rectángulo.', fig: svg(460, 380, '<g transform="translate(30 60)">' + out + '</g>', 440), items: items };
  }

  /* ─────────── Densidad de cuerpos geométricos ─────────── */
  var MAT = [['madera de pino', .5], ['hielo', .92], ['agua', 1], ['aluminio', 2.7], ['hierro', 7.9], ['corcho', .24], ['vidrio', 2.5]];
  function genDensidad(u, C, r) {
    if (!SV.cuerpo) return null;
    var m = H.pick(r, MAT.filter(function (x) { return x[0] !== 'agua'; })), a = E(r, 2, 6), V = a * a * a, masa = Math.round(m[1] * V * 10) / 10;
    var fig = SV.cuerpo(C, { t: 'cubo', a: 3, b: 3, c: 3, cotas: [a + ' cm', a + ' cm', a + ' cm'], modo: 'solido', color: m[1] > 2 ? '#8a8f98' : m[1] < 1 ? '#c8a26a' : '#9fd3e6', max: 300 });
    var items = [it('corta', 'Calcula el volumen del cubo.', V + ' cm³', num(V)), it('corta', 'Tiene una masa de ' + fmt(masa) + ' g. ¿Cuál es su densidad?', fmt(m[1]) + ' g/cm³', num(m[1])), mc('¿Flota en el agua?', ['sí', 'no'], m[1] < 1 ? 'sí' : 'no')];
    var ctx = { quimica: 'La densidad permite identificar sustancias.', natu: 'Con la densidad sabemos qué objetos flotan.', tecno: 'Al elegir material, la densidad decide cuánto pesa la pieza.' }[C.mat] || 'La densidad relaciona la masa con el volumen: d = m ÷ V.';
    return { t: 'Un cubo de ' + m[0], intro: ctx, fig: fig, items: items };
  }

  /* ─────────── Transportador de ángulos ─────────── */
  function genAngulo(u, C, r) {
    var T = C.T, F = T.cuerpo, ang = E(r, 2, 16) * 10 + (esPeq(C) ? 0 : H.pick(r, [0, 5])), cx = 200, cy = 200, R = 170, out = '', d3 = es3d(C);
    if (d3) out += '<path d="M' + (cx - R + 4) + ',' + (cy + 5) + ' A' + R + ',' + R + ' 0 0 1 ' + (cx + R + 4) + ',' + (cy + 5) + ' Z" fill="#000" opacity=".12"/>';
    out += '<path d="M' + (cx - R) + ',' + cy + ' A' + R + ',' + R + ' 0 0 1 ' + (cx + R) + ',' + cy + ' Z" fill="' + clr(T.acc, .82) + '" stroke="' + T.ink + '" stroke-width="2"/>';
    for (var g = 0; g <= 180; g += 5) { var a = Math.PI - g * Math.PI / 180, l = g % 10 ? 8 : 14; out += ln([cx + R * Math.cos(a), cy - R * Math.sin(a)], [cx + (R - l) * Math.cos(a), cy - (R - l) * Math.sin(a)], 'stroke="' + T.ink + '" stroke-width="' + (g % 10 ? .8 : 1.4) + '"'); if (g % 30 === 0) out += tx(cx + (R - 28) * Math.cos(a), cy - (R - 28) * Math.sin(a) + 4, g, { f: F, s: 11, c: T.ink }); }
    var b = Math.PI - ang * Math.PI / 180;
    out += '<path d="M' + (cx + 50) + ',' + cy + ' A50,50 0 0 0 ' + r1(cx + 50 * Math.cos(Math.PI - b)) + ',' + r1(cy - 50 * Math.sin(Math.PI - b)) + '" fill="none" stroke="' + T.acc2 + '" stroke-width="3"/>';
    out += ln([cx, cy], [cx + R + 10, cy], 'stroke="' + T.acc2 + '" stroke-width="3.5" stroke-linecap="round"') + ln([cx, cy], [r1(cx + (R + 10) * Math.cos(Math.PI - b)), r1(cy - (R + 10) * Math.sin(Math.PI - b))], 'stroke="' + T.acc2 + '" stroke-width="3.5" stroke-linecap="round"') + '<circle cx="' + cx + '" cy="' + cy + '" r="5" fill="' + T.ink + '"/>';
    var tipo = ang < 90 ? 'agudo' : ang === 90 ? 'recto' : 'obtuso';
    var ctx = { efisica: 'Ángulo de salida de un lanzamiento de peso.', anat: 'Ángulo de flexión de la rodilla al sentarse.', fisica: 'Ángulo de un plano inclinado.', arte: 'Ángulo de inclinación de una línea en la composición.', tecno: 'Ángulo de giro de un brazo robótico.' }[C.mat] || 'Mide el ángulo con el transportador.';
    return { t: 'Mide el ángulo', intro: ctx + ' Lee en la escala interior empezando en 0.', fig: svg(400, 215, out, 420), items: [it('corta', '¿Cuántos grados mide el ángulo?', ang + '°', num(ang)), mc('¿Qué tipo de ángulo es?', ['agudo', 'recto', 'obtuso'], tipo), it('corta', '¿Cuánto le falta para llegar a 180°?', (180 - ang) + '°', num(180 - ang))] };
  }

  /* ─────────── Cancha deportiva ─────────── */
  var CANCHAS = [['voleibol', 18, 9, 'red'], ['baloncesto', 28, 15, 'círculo'], ['fútbol sala', 40, 20, 'área'], ['bádminton', 13.4, 6.1, 'red'], ['balonmano', 40, 20, 'área']];
  function genCancha(u, C, r) {
    var T = C.T, c = H.pick(r, CANCHAS), k = 440 / c[1], W = c[1] * k, Hh = c[2] * k, out = '', d3 = es3d(C), x0 = 20, y0 = 20, verde = C.T.acc2;
    if (d3) out += '<rect x="' + (x0 + 5) + '" y="' + (y0 + 7) + '" width="' + r1(W) + '" height="' + r1(Hh) + '" fill="#000" opacity=".15"/>';
    out += '<rect x="' + x0 + '" y="' + y0 + '" width="' + r1(W) + '" height="' + r1(Hh) + '" fill="' + clr(verde, .55) + '" stroke="#fff" stroke-width="3"/><rect x="' + x0 + '" y="' + y0 + '" width="' + r1(W) + '" height="' + r1(Hh) + '" fill="none" stroke="' + T.ink + '" stroke-width="1"/>';
    out += ln([x0 + W / 2, y0], [x0 + W / 2, y0 + Hh], 'stroke="#fff" stroke-width="' + (c[3] === 'red' ? 5 : 2.5) + '"');
    if (c[3] === 'círculo') out += '<circle cx="' + r1(x0 + W / 2) + '" cy="' + r1(y0 + Hh / 2) + '" r="' + r1(1.8 * k) + '" fill="none" stroke="#fff" stroke-width="2.5"/>' + [0, 1].map(function (s) { return '<path d="M' + r1(s ? x0 + W : x0) + ',' + r1(y0 + Hh / 2 - 6.75 * k) + ' A' + r1(6.75 * k) + ',' + r1(6.75 * k) + ' 0 0 ' + (s ? 0 : 1) + ' ' + r1(s ? x0 + W : x0) + ',' + r1(y0 + Hh / 2 + 6.75 * k) + '" fill="none" stroke="#fff" stroke-width="2.5"/>'; }).join('');
    if (c[3] === 'área') out += [0, 1].map(function (s) { return '<path d="M' + r1(s ? x0 + W : x0) + ',' + r1(y0 + Hh / 2 - 6 * k) + ' A' + r1(6 * k) + ',' + r1(6 * k) + ' 0 0 ' + (s ? 0 : 1) + ' ' + r1(s ? x0 + W : x0) + ',' + r1(y0 + Hh / 2 + 6 * k) + '" fill="none" stroke="#fff" stroke-width="2.5"/>'; }).join('') + '<circle cx="' + r1(x0 + W / 2) + '" cy="' + r1(y0 + Hh / 2) + '" r="' + r1(3 * k) + '" fill="none" stroke="#fff" stroke-width="2.5"/>';
    out += tx(x0 + W / 2, y0 + Hh + 22, c[1] + ' m', { f: T.cuerpo, s: 13, c: T.ink, w: 700 }) + tx(x0 + W + 8, y0 + Hh / 2 + 4, c[2] + ' m', { f: T.cuerpo, s: 13, c: T.ink, w: 700, a: 'start' });
    var area = Math.round(c[1] * c[2] * 100) / 100, per = Math.round(2 * (c[1] + c[2]) * 100) / 100, vueltas = Math.ceil(1000 / per), diag = Math.round(Math.sqrt(c[1] * c[1] + c[2] * c[2]) * 10) / 10;
    var items = [it('corta', '¿Cuál es el área de la cancha?', fmt(area) + ' m²', num(area)), it('corta', '¿Cuántos metros recorres dando una vuelta por la línea exterior?', fmt(per) + ' m', num(per)), it('corta', '¿Cuántas vueltas completas necesitas para correr al menos 1 km?', vueltas, num(vueltas))];
    if (!esPeq(C)) items.push(it('corta', '¿Cuánto mide la diagonal de la cancha? (una cifra decimal)', fmt(diag) + ' m', num(diag)));
    return { t: 'La cancha de ' + c[0], intro: 'Medidas oficiales de una cancha de ' + c[0] + ', dibujada a escala.', fig: svg(W + 80, Hh + 40, out, 520), items: items };
  }

  /* ─────────── Microscopio y escala ─────────── */
  function genMicro(u, C, r) {
    var T = C.T, veg = r() < 0.5, aum = H.pick(r, [100, 200, 400, 1000]), cm = E(r, 3, 6), real = Math.round(cm * 10000 / aum * 10) / 10, out = '', d3 = es3d(C), id = 'eucel' + (++uid);
    var cx = 200, cy = 150, rx = 150, ry = 105;
    out += '<defs><radialGradient id="' + id + '" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="' + clr(T.acc2, .85) + '"/><stop offset="1" stop-color="' + clr(T.acc2, d3 ? .4 : .75) + '"/></radialGradient></defs>';
    if (veg) out += (d3 ? '<rect x="' + (cx - rx + 5) + '" y="' + (cy - ry + 6) + '" width="' + 2 * rx + '" height="' + 2 * ry + '" rx="22" fill="#000" opacity=".15"/>' : '') + '<rect x="' + (cx - rx) + '" y="' + (cy - ry) + '" width="' + 2 * rx + '" height="' + 2 * ry + '" rx="22" fill="url(#' + id + ')" stroke="' + osc(T.acc2, .3) + '" stroke-width="6"/><rect x="' + (cx - rx + 8) + '" y="' + (cy - ry + 8) + '" width="' + (2 * rx - 16) + '" height="' + (2 * ry - 16) + '" rx="16" fill="none" stroke="' + osc(T.acc2, .1) + '" stroke-width="1.5"/>';
    else out += (d3 ? '<ellipse cx="' + (cx + 5) + '" cy="' + (cy + 6) + '" rx="' + rx + '" ry="' + ry + '" fill="#000" opacity=".15"/>' : '') + '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="url(#' + id + ')" stroke="' + osc(T.acc2, .3) + '" stroke-width="2.5"/>';
    var rr = H.rng(Math.floor(r() * 1e6));
    if (veg) for (var i = 0; i < 7; i++) { var x = cx - 110 + rr() * 220, y = cy - 70 + rr() * 140; if (Math.hypot(x - cx - 40, y - cy + 10) < 50) continue; out += '<ellipse cx="' + r1(x) + '" cy="' + r1(y) + '" rx="16" ry="9" fill="#5b9a3c" stroke="#2f5d1c" stroke-width="1.2" transform="rotate(' + Math.round(rr() * 180) + ' ' + r1(x) + ' ' + r1(y) + ')"/>'; }
    else for (var j = 0; j < 6; j++) { var x2 = cx - 100 + rr() * 200, y2 = cy - 60 + rr() * 120; if (Math.hypot(x2 - cx - 40, y2 - cy + 10) < 50) continue; out += '<ellipse cx="' + r1(x2) + '" cy="' + r1(y2) + '" rx="13" ry="6" fill="' + T.acc + '" opacity=".8" transform="rotate(' + Math.round(rr() * 180) + ' ' + r1(x2) + ' ' + r1(y2) + ')"/>'; }
    if (veg) out += '<ellipse cx="' + (cx - 30) + '" cy="' + (cy + 10) + '" rx="70" ry="50" fill="' + clr(T.acc, .85) + '" stroke="' + T.acc + '" stroke-width="1.2" opacity=".8"/>';
    out += '<circle cx="' + (cx + 40) + '" cy="' + (cy - 10) + '" r="' + (d3 ? 32 : 30) + '" fill="' + osc(T.acc, .1) + '" stroke="' + osc(T.acc, .4) + '" stroke-width="2"/><circle cx="' + (cx + 46) + '" cy="' + (cy - 4) + '" r="9" fill="' + osc(T.acc, .45) + '"/>';
    if (d3) out += '<ellipse cx="' + (cx + 30) + '" cy="' + (cy - 22) + '" rx="9" ry="5" fill="#fff" opacity=".5"/>';
    var et = [[cx + 40, cy - 10, 330, 34, 'núcleo'], [cx - rx + 6, cy - 60, 20, 30, veg ? 'pared celular' : 'membrana'], [cx - 30, cy + 10, 60, 282, veg ? 'vacuola' : 'citoplasma']];
    if (veg) et.push([cx - 80, cy - 40, 80, 20, 'cloroplasto']);
    et.forEach(function (e) { out += ln([e[0], e[1]], [e[2], e[3]], 'stroke="' + T.ink + '" stroke-width="1"') + tx(e[2] + (e[2] > cx ? 4 : -4), e[3] + (e[3] < 40 ? -4 : 14), e[4], { f: T.cuerpo, s: 12, c: T.ink, w: 700, a: e[2] > cx ? 'start' : 'end', st: true }); });
    out += '<rect x="-60" y="318" width="' + (cm * 10) + '" height="6" fill="' + T.ink + '"/>' + tx(-60 + cm * 10 + 8, 325, '× ' + aum, { f: T.cuerpo, s: 12, c: T.ink, w: 700, a: 'start' });
    var items = [mc('¿Es una célula animal o vegetal?', ['animal', 'vegetal'], veg ? 'vegetal' : 'animal'), it('corta', 'En la foto aumentada la célula mide ' + cm + ' cm. Con un aumento de ×' + aum + ', ¿cuántos micrómetros (µm) mide de verdad? (1 cm = 10 000 µm)', fmt(real) + ' µm', num(real))];
    if (!esPeq(C)) items.push(it('abierta', 'Explica por qué la célula vegetal tiene forma más rectangular.', 'La pared celular rígida le da forma.', { lin: 2 }));
    return { t: 'Al microscopio', intro: 'Esquema de una célula ' + (veg ? 'vegetal' : 'animal') + ' vista con un aumento de ×' + aum + '.', fig: svg(560, 340, '<g transform="translate(90 0)">' + out + '</g>', 520), items: items };
  }

  /* ─────────── Geometría molecular ─────────── */
  var MOL = [['agua', 'H₂O', 'angular', 104.5, [['O', 0, 0, 0], ['H', -1, .78, 0], ['H', 1, .78, 0]]], ['dióxido de carbono', 'CO₂', 'lineal', 180, [['C', 0, 0, 0], ['O', -1.3, 0, 0], ['O', 1.3, 0, 0]]], ['metano', 'CH₄', 'tetraédrica', 109.5, [['C', 0, 0, 0], ['H', 0, -1.1, 0], ['H', -1, .45, .4], ['H', 1, .45, .4], ['H', 0, .45, -1]]], ['amoníaco', 'NH₃', 'piramidal', 107, [['N', 0, -.2, 0], ['H', -1, .6, .3], ['H', 1, .6, .3], ['H', 0, .6, -1]]]];
  var AT = { O: ['#e0463a', 26], H: ['#f2f2f2', 17], C: ['#3b3b3b', 25], N: ['#3a6fe0', 25] };
  function genMolecula(u, C, r) {
    var T = C.T, m = H.pick(r, MOL), cx = 200, cy = 130, s = 90, out = '', d3 = es3d(C), defs = '';
    var P = m[4].map(function (a) { return { e: a[0], x: cx + a[1] * s + a[3] * 30, y: cy + a[2] * s - a[3] * 20, z: a[3] }; });
    P.slice(1).forEach(function (p) { out += ln([P[0].x, P[0].y], [p.x, p.y], 'stroke="' + T.ink + '" stroke-width="' + (m[1] === 'CO₂' ? 11 : 8) + '" stroke-linecap="round"') + (m[1] === 'CO₂' ? ln([P[0].x, P[0].y], [p.x, p.y], 'stroke="#fff" stroke-width="3"') : ''); });
    P.slice().sort(function (a, b) { return a.z - b.z; }).forEach(function (p, i) {
      var A = AT[p.e], id = 'euat' + (++uid), R = A[1] * (1 + p.z * .12);
      defs += '<radialGradient id="' + id + '" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="' + clr(A[0], .75) + '"/><stop offset=".6" stop-color="' + A[0] + '"/><stop offset="1" stop-color="' + osc(A[0], .45) + '"/></radialGradient>';
      out += '<circle cx="' + r1(p.x) + '" cy="' + r1(p.y) + '" r="' + r1(R) + '" fill="' + (d3 ? 'url(#' + id + ')' : A[0]) + '" stroke="' + osc(A[0], .5) + '" stroke-width="1.5"/>' + tx(p.x, p.y + 5, p.e, { f: T.cuerpo, s: 14, c: p.e === 'H' ? T.ink : '#fff', w: 700 });
    });
    if (m[3] < 180) { var a1 = Math.atan2(P[1].y - P[0].y, P[1].x - P[0].x), a2 = Math.atan2(P[2].y - P[0].y, P[2].x - P[0].x), R2 = 48; out += '<path d="M' + r1(P[0].x + R2 * Math.cos(a1)) + ',' + r1(P[0].y + R2 * Math.sin(a1)) + ' A' + R2 + ',' + R2 + ' 0 0 0 ' + r1(P[0].x + R2 * Math.cos(a2)) + ',' + r1(P[0].y + R2 * Math.sin(a2)) + '" fill="none" stroke="' + T.acc2 + '" stroke-width="2.4"/>' + tx(P[0].x, P[0].y + 80, fmt(m[3]) + '°', { f: T.cuerpo, s: 15, c: T.acc2, w: 700, st: true }); }
    else out += tx(cx, cy + 50, '180°', { f: T.cuerpo, s: 15, c: T.acc2, w: 700 });
    var formas = ['angular', 'lineal', 'tetraédrica', 'piramidal'];
    return { t: 'La molécula de ' + m[0] + ' (' + m[1] + ')', intro: 'Modelo de bolas y varillas. Cada bola es un átomo y cada varilla un enlace.', fig: svg(400, 240, '<defs>' + defs + '</defs>' + out, 400), items: [it('corta', '¿Cuántos átomos tiene la molécula?', P.length, num(P.length)), mc('¿Qué forma geométrica tiene?', H.mezcla(r, formas).slice(0, 3).concat([]).filter(function (f, i, a) { return a.indexOf(f) === i; }).slice(0, 2).concat([m[2]]).filter(function (f, i, a) { return a.indexOf(f) === i; }), m[2]), it('corta', '¿Cuánto mide el ángulo de enlace?', fmt(m[3]) + '°', num(m[3]))] };
  }

  /* ─────────── Música: fracciones del compás ─────────── */
  var FIG_M = [['redonda', 1], ['blanca', 1 / 2], ['negra', 1 / 4], ['corchea', 1 / 8]];
  function genCompas(u, C, r) {
    var T = C.T, out = '', W = 600, x = 20, rest = 1, seq = [], pal = SV.paleta(C), d3 = es3d(C);
    while (rest > 1e-6) { var ops = FIG_M.filter(function (f) { return f[1] <= rest + 1e-9 && f[1] < 1; }); var f = H.pick(r, ops); seq.push(f); rest -= f[1]; }
    var falta = seq.pop(), fi = FIG_M.indexOf(falta);
    seq.forEach(function (f, i) { var w = f[1] * (W - 40); if (d3) out += '<rect x="' + r1(x + 3) + '" y="34" width="' + r1(w) + '" height="50" fill="' + osc(pal[FIG_M.indexOf(f)], .4) + '"/>'; out += '<rect x="' + r1(x) + '" y="30" width="' + r1(w) + '" height="50" fill="' + pal[FIG_M.indexOf(f)] + '" stroke="#fff" stroke-width="2"/>' + tx(x + w / 2, 60, f[0], { f: T.cuerpo, s: w < 60 ? 10 : 13, c: '#fff', w: 700 }); x += w; });
    var wf = falta[1] * (W - 40); out += '<rect x="' + r1(x) + '" y="30" width="' + r1(wf) + '" height="50" fill="#fff" stroke="' + T.ink + '" stroke-width="2" stroke-dasharray="6 4"/>' + tx(x + wf / 2, 61, '?', { f: T.tit, s: 20, c: T.ink, w: 700 });
    out += '<rect x="20" y="30" width="' + (W - 40) + '" height="50" fill="none" stroke="' + T.ink + '" stroke-width="2.5"/>' + tx(W / 2, 110, 'compás de 4/4 = 1 redonda', { f: T.cuerpo, s: 12, c: T.ink });
    var tot = seq.reduce(function (s2, f) { return s2 + f[1] * 4; }, 0);
    return { t: 'El compás como fracción', intro: 'Cada figura ocupa una parte del compás: la redonda es el entero, la blanca 1/2, la negra 1/4 y la corchea 1/8.', fig: svg(W, 120, out, 600), items: [mc('¿Qué figura falta para completar el compás?', ['blanca', 'negra', 'corchea'].indexOf(falta[0]) >= 0 ? ['blanca', 'negra', 'corchea'] : ['blanca', 'negra', 'corchea', falta[0]], falta[0]), it('corta', '¿Cuántos tiempos (negras) ocupan las figuras ya escritas?', fmt(tot), num(tot)), it('corta', '¿Qué fracción del compás falta?', '1/' + Math.round(1 / falta[1]), { ac: ['1/' + Math.round(1 / falta[1]), fmt(falta[1])] })] };
  }

  var G = {
    simetria: [genSimetria, /^(bio|anat|arte|religion|natu|mate|tecno|efisica|valores|infantil|geoalg|calculo)$/, 2],
    canon: [genCanon, /^(anat|arte|efisica|bio)$/, 1],
    aureo: [genAureo, /^(arte|mate|anat|bio|tecno|geoalg|calculo)$/, 1],
    poligono: [genPoligono, /^(arte|religion|tecno|mate|bio|quimica|geoalg|calculo)$/, 2],
    plano: [genPlano, /^(geografia|soci|conta|tecno|mate|arte|efisica|valores|geoalg|calculo)$/, 2],
    escala: [genEscala, /^(geografia|soci|ingles|idiomas|mate|geoalg|calculo)$/, 2],
    vectores: [genVectores, /^(fisica|efisica|tecno|mate|geoalg|calculo)$/, 2],
    densidad: [genDensidad, /^(fisica|quimica|natu|tecno)$/, 2],
    angulo: [genAngulo, /^(efisica|anat|fisica|arte|tecno|mate|geoalg|calculo)$/, 2],
    cancha: [genCancha, /^(efisica|mate|geoalg|calculo)$/, 2],
    micro: [genMicro, /^(bio|anat|natu)$/, 2],
    molecula: [genMolecula, /^(quimica|bio|natu|fisica)$/, 2],
    compas: [genCompas, /^(musica)$/, 3]
  };
  Object.keys(G).forEach(function (k) { SV.visual('geo_' + k, G[k][0], { materias: G[k][1], max: G[k][2] }); });
  window.EU_GEO = { generadores: G, canon: canonSVG, km: km, CIUDADES: CIU };
})();
