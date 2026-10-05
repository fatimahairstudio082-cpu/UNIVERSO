/* b6_dibujos_plus4.js — 20 dibujos más para la biblioteca visual (window.EU_DIBUJOS4).
   · Geografía y ciencias de la Tierra: capas de la Tierra, placas tectónicas, estaciones, zonas climáticas,
     partes del volcán, curso de un río, formas de la costa, ciclo de las rocas.
   · Historia: edades de la Historia (con el hito del país), siglos en números romanos, sociedad feudal.
   · Geometría y medida: regla graduada, calibre (pie de rey), escuadra y cartabón, compás y mediatriz,
     clasificación de triángulos, elementos de la circunferencia, cuadriláteros, desarrollo de un prisma,
     ángulos entre paralelas.
   Todos admiten 2D y 3D (cfg.acab.dibujo) y llevan preguntas con respuesta y proceso.
   Cargar después de b6_dibujos_plus3.js. */
(function () {
  'use strict';
  var ED = window.EU_EDITORIAL, SV = window.EU_SVG;
  if (!ED || !SV || !SV.visual || window.EU_DIBUJOS4) return;
  var H = ED.H, esc = H.esc, it = H.it, E = H.ent, osc = SV.osc, clr = SV.clr, NS = 'xmlns="http://www.w3.org/2000/svg"';
  var UID = 0;
  function r1(n) { return Math.round(n * 10) / 10; }
  function es3d(C) { return C.prem ? C.prem.dibujo === '3d' : (((C.cfg && C.cfg.acab) || {}).dibujo || '3d') === '3d'; }
  function svg(w, h, body, maxw) { return '<svg ' + NS + ' data-plano="1" viewBox="0 0 ' + w + ' ' + h + '" style="width:100%;max-width:' + (maxw || w) + 'px;height:auto;display:block;margin:0 auto">' + body + '</svg>'; }
  function tx(x, y, s, o) { o = o || {}; return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || 'middle') + '" font-size="' + (o.s || 13) + '" font-family="' + esc(o.f || 'sans-serif') + '" font-weight="' + (o.w || 400) + '" fill="' + (o.c || '#222') + '">' + esc(String(s)) + '</text>'; }
  function rc(x, y, w, h, o) { o = o || {}; return '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(w) + '" height="' + r1(h) + '" rx="' + (o.rx || 0) + '" fill="' + (o.f || 'none') + '" stroke="' + (o.s || 'none') + '" stroke-width="' + (o.sw || 1.5) + '"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : '') + (o.op ? ' opacity="' + o.op + '"' : '') + '/>'; }
  function ln(x1, y1, x2, y2, c, w, o) { return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + c + '" stroke-width="' + (w || 1.5) + '"' + (o || '') + '/>'; }
  function ci(x, y, rr, f, s, sw) { return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1(rr) + '" fill="' + (f || 'none') + '" stroke="' + (s || 'none') + '" stroke-width="' + (sw || 1.5) + '"/>'; }
  function pa(d, f, s, sw, o) { return '<path d="' + d + '" fill="' + (f || 'none') + '" stroke="' + (s || 'none') + '" stroke-width="' + (sw || 1.5) + '" stroke-linejoin="round"' + (o || '') + '/>'; }
  function poly(p, f, s, sw) { return '<polygon points="' + p.map(function (q) { return r1(q[0]) + ',' + r1(q[1]); }).join(' ') + '" fill="' + (f || 'none') + '" stroke="' + (s || 'none') + '" stroke-width="' + (sw || 1.5) + '" stroke-linejoin="round"/>'; }
  function sombra(C, p) { return es3d(C) ? poly(p.map(function (q) { return [q[0] + 4, q[1] + 5]; }), '#000').replace('/>', ' opacity=".13"/>') : ''; }
  function flecha(x1, y1, x2, y2, c, w) { var a = Math.atan2(y2 - y1, x2 - x1), L = 8; return ln(x1, y1, x2, y2, c, w || 1.8) + '<path d="M' + r1(x2) + ' ' + r1(y2) + ' L' + r1(x2 - L * Math.cos(a - .45)) + ' ' + r1(y2 - L * Math.sin(a - .45)) + ' L' + r1(x2 - L * Math.cos(a + .45)) + ' ' + r1(y2 - L * Math.sin(a + .45)) + 'Z" fill="' + c + '"/>'; }
  function mk(n, x, y, T, F) { return ci(x, y, 11, T.acc, '#fff', 2) + tx(x, y + 4.5, n, { f: F, s: 12, w: 700, c: '#fff' }); }
  function mc(e, ops, bien, x) { ops = ops.slice(); return it('mc', e, 'abc'.charAt(ops.indexOf(bien)) + ') ' + bien, Object.assign({ o: ops, c: ops.indexOf(bien) }, x || {})); }
  function mcM(r, e, ops, bien, x) { return mc(e, H.mezcla(r, ops.slice()), bien, x); }
  function fmt(n, C) { return H.num(n, C); }
  function grad(C, id, c) { return es3d(C) ? '<defs><radialGradient id="' + id + '" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".55" stop-color="' + c + '" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></radialGradient></defs>' : ''; }
  function brillo(C, id) { return es3d(C) ? ' fill="url(#' + id + ')"' : ' fill="none"'; }
  function arco(cx, cy, R, a1, a2) { var p1 = [cx + R * Math.cos(a1 * Math.PI / 180), cy - R * Math.sin(a1 * Math.PI / 180)], p2 = [cx + R * Math.cos(a2 * Math.PI / 180), cy - R * Math.sin(a2 * Math.PI / 180)]; return 'M' + r1(p1[0]) + ' ' + r1(p1[1]) + ' A' + R + ' ' + R + ' 0 ' + (Math.abs(a2 - a1) > 180 ? 1 : 0) + ' 0 ' + r1(p2[0]) + ' ' + r1(p2[1]); }
  function pt(cx, cy, R, a) { return [cx + R * Math.cos(a * Math.PI / 180), cy - R * Math.sin(a * Math.PI / 180)]; }
  function romano(n) { var v = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']], s = ''; v.forEach(function (p) { while (n >= p[0]) { s += p[1]; n -= p[0]; } }); return s; }
  function siglo(y) { return y > 0 ? romano(Math.floor((y - 1) / 100) + 1) : romano(Math.floor((-y - 1) / 100) + 1) + ' a. C.'; }
  function anio(y) { return y < 0 ? (-y) + ' a. C.' : String(y); }
  var PN = { es: 'España', mx: 'México', co: 'Colombia', ar: 'Argentina', cl: 'Chile', ve: 'Venezuela', do: 'República Dominicana', us: 'Estados Unidos' };
  function pais(C) { return PN[C.pk] || 'España'; }
  var CIELO = '#DDEEF7', MAR = '#9CCBE6', VERDE = '#8DBE6A', TIERRA = '#C9A26B', GRIS = '#8A8F96', LAVA = '#D9482B';

  /* Rótulos numerados con leyenda: tres huecos para completar. */
  function rotulo(u, C, r, S) {
    var T = C.T, F = T.cuerpo, pts = S.pts, oc = H.mezcla(r, pts.map(function (_, i) { return i; })).slice(0, 3), out = S.dib(T, F);
    pts.forEach(function (p, i) { out += mk(i + 1, p[1], p[2], T, F); });
    var paso = Math.min(32, Math.floor((S.H - 30) / pts.length)), lx = S.W + 18;
    out += rc(S.W + 6, 8, 208, S.H - 16, { rx: 10, f: clr(T.acc, .92), s: clr(T.acc, .5), sw: 1 });
    pts.forEach(function (p, i) { var yy = 30 + i * paso; out += mk(i + 1, lx + 11, yy, T, F); out += oc.indexOf(i) >= 0 ? ln(lx + 28, yy + 6, lx + 190, yy + 6, T.ink, 1, ' stroke-dasharray="3 3"') : tx(lx + 28, yy + 4, p[0], { f: F, s: 12.5, a: 'start', w: 700, c: T.ink }); });
    var items = oc.map(function (i) { return it('corta', '¿Qué parte señala el número ' + (i + 1) + '?', pts[i][0]); });
    if (S.extra) items = items.concat(S.extra(r, C));
    return { t: S.t, intro: S.intro, fig: svg(S.W + 220, S.H, out, 640), items: items };
  }

  /* ─────────── GEOGRAFÍA Y TIERRA ─────────── */
  var CAPAS = [['Corteza', 0, 35, 'sólida; hasta 70 km bajo las cordilleras', TIERRA], ['Manto superior', 35, 670, 'sólido y plástico (astenosfera)', '#E8A15A'], ['Manto inferior', 670, 2900, 'sólido, unos 1 900–3 700 °C', '#D9793F'], ['Núcleo externo', 2900, 5150, 'líquido, hierro y níquel, 4 000–5 000 °C', '#E9C23A'], ['Núcleo interno', 5150, 6371, 'sólido, unos 5 400 °C', '#F6E27A']];
  function genCapas(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 620, Hh = 320, cx = 30, cy = 305, R = 275, out = rc(0, 0, W, Hh, { f: '#fff' });
    var rad = [R, R - 9, R * (6371 - 670) / 6371, R * (6371 - 2900) / 6371, R * (6371 - 5150) / 6371];
    if (es3d(C)) out += pa('M' + (cx + 5) + ' ' + (cy + 6) + ' L' + (cx + R + 5) + ' ' + (cy + 6) + ' A' + R + ' ' + R + ' 0 0 0 ' + (cx + 5) + ' ' + (cy - R + 6) + ' Z', '#000', 'none', 0, ' opacity=".12"');
    CAPAS.forEach(function (c, i) { var rr = rad[i]; out += pa('M' + cx + ' ' + cy + ' L' + r1(cx + rr) + ' ' + cy + ' A' + r1(rr) + ' ' + r1(rr) + ' 0 0 0 ' + cx + ' ' + r1(cy - rr) + ' Z', c[4], T.ink, 1.2); });
    var id = 'cp' + (++UID); out += grad(C, id, '#fff') + (es3d(C) ? pa('M' + cx + ' ' + cy + ' L' + (cx + R) + ' ' + cy + ' A' + R + ' ' + R + ' 0 0 0 ' + cx + ' ' + (cy - R) + ' Z', 'url(#' + id + ')', 'none', 0) : '');
    var ang = [78, 62, 45, 30, 14], lx = 360;
    CAPAS.forEach(function (c, i) {
      var rm = i === 0 ? R - 4 : (rad[i] + (rad[i + 1] || 0)) / 2, p = pt(cx, cy, rm, ang[i]), yy = 40 + i * 56;
      out += ci(p[0], p[1], 3.5, T.ink) + pa('M' + r1(p[0]) + ' ' + r1(p[1]) + ' L' + (lx - 12) + ' ' + (yy - 4), 'none', T.ink, 1);
      out += tx(lx, yy, c[0], { f: F, s: 14, a: 'start', w: 700, c: T.ink }) + tx(lx, yy + 16, c[1] + ' – ' + c[2] + ' km', { f: F, s: 12, a: 'start', w: 700, c: T.acc }) + tx(lx, yy + 31, c[3], { f: F, s: 11, a: 'start', c: GRIS });
    });
    out += tx(cx + 4, cy + 13, 'Centro · 6 371 km', { f: F, s: 10.5, a: 'start', c: GRIS });
    var k = E(r, 1, 4), c = CAPAS[k], prof = H.pick(r, [120, 1500, 3200, 4800, 5800, 400, 2500]), cap = CAPAS.filter(function (x) { return prof >= x[1] && prof < x[2]; })[0];
    var items = [
      it('corta', '¿Entre qué profundidades está el ' + c[0].toLowerCase() + '?', c[1] + ' y ' + c[2] + ' km', { ac: [c[1] + ' y ' + c[2] + ' km', c[1] + '–' + c[2] + ' km', c[1] + '-' + c[2]] }),
      it('corta', '¿Cuántos kilómetros de espesor tiene el ' + c[0].toLowerCase() + '?', c[2] - c[1], { x: c[2] + ' − ' + c[1] + ' = ' + (c[2] - c[1]) + ' km' }),
      it('corta', 'Una onda sísmica llega a ' + prof + ' km de profundidad. ¿En qué capa está?', cap[0]),
      mcM(r, '¿Qué capa de la Tierra es líquida?', ['el núcleo externo', 'el núcleo interno', 'la corteza'], 'el núcleo externo', { x: 'Las ondas S no atraviesan el núcleo externo: así se sabe que es líquido.' })
    ];
    return { t: 'Las capas de la Tierra', intro: 'Corte de la Tierra a escala: la corteza se ha engrosado para que se vea. Las capas se separan por discontinuidades: Mohorovičić (corteza–manto), Gutenberg (manto–núcleo) y Lehmann (núcleo externo–interno).', fig: svg(W, Hh, out, 620), items: items };
  }

  var EJ_PLACAS = [['la dorsal mesoatlántica', 'divergente'], ['la cordillera de los Andes', 'convergente'], ['la falla de San Andrés (California)', 'transformante'], ['el Himalaya', 'convergente'], ['el valle del Rift, en África oriental', 'divergente'], ['la falla de Anatolia del Norte (Turquía)', 'transformante']];
  var SISMO = { cl: 'la placa de Nazca se hunde bajo la Sudamericana', mx: 'la placa de Cocos se hunde bajo la Norteamericana', co: 'las placas de Nazca y del Caribe empujan contra la Sudamericana', ve: 'la placa del Caribe roza con la Sudamericana (fallas de Boconó y El Pilar)', ar: 'la placa de Nazca se hunde bajo la Sudamericana, en el oeste del país', do: 'la placa del Caribe roza con la Norteamericana', us: 'la placa del Pacífico roza con la Norteamericana', es: 'la placa africana empuja hacia la euroasiática, sobre todo en el sur y el este' };
  function genPlacas(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 620, Hh = 300, out = '', MN = '#F0B27A';
    [0, 1, 2].forEach(function (k) { var x0 = 8 + k * 204; out += rc(x0, 20, 196, 230, { rx: 8, f: '#fff', s: clr(T.ink, .7), sw: 1 }); });
    var x = 8;
    out += tx(x + 98, 40, 'Divergente', { f: F, s: 14, w: 700, c: T.ink }) + rc(x + 6, 60, 184, 44, { f: MAR }) + rc(x + 6, 150, 184, 94, { f: MN });
    out += poly([[x + 6, 104], [x + 90, 96], [x + 90, 150], [x + 6, 150]], TIERRA, T.ink, 1.2) + poly([[x + 106, 96], [x + 190, 104], [x + 190, 150], [x + 106, 150]], TIERRA, T.ink, 1.2);
    out += pa('M' + (x + 98) + ' 240 C' + (x + 88) + ' 200 ' + (x + 108) + ' 170 ' + (x + 98) + ' 96', 'none', LAVA, 7) + flecha(x + 70, 128, x + 20, 128, T.ink) + flecha(x + 126, 128, x + 176, 128, T.ink);
    out += pa('M' + (x + 60) + ' 215 C' + (x + 60) + ' 175 ' + (x + 90) + ' 175 ' + (x + 90) + ' 200', 'none', LAVA, 1.5, ' stroke-dasharray="4 3"') + pa('M' + (x + 136) + ' 215 C' + (x + 136) + ' 175 ' + (x + 106) + ' 175 ' + (x + 106) + ' 200', 'none', LAVA, 1.5, ' stroke-dasharray="4 3"');
    out += tx(x + 98, 88, 'dorsal', { f: F, s: 11, c: T.ink });
    x = 212;
    out += tx(x + 98, 40, 'Convergente', { f: F, s: 14, w: 700, c: T.ink }) + rc(x + 6, 60, 90, 40, { f: MAR }) + rc(x + 6, 150, 184, 94, { f: MN });
    out += poly([[x + 6, 100], [x + 100, 100], [x + 170, 200], [x + 150, 214], [x + 90, 128], [x + 6, 128]], '#A9876A', T.ink, 1.2);
    out += poly([[x + 100, 100], [x + 120, 80], [x + 190, 80], [x + 190, 170], [x + 150, 150]], TIERRA, T.ink, 1.2) + poly([[x + 132, 80], [x + 146, 54], [x + 160, 80]], osc(TIERRA, .2), T.ink, 1.2);
    out += pa('M' + (x + 150) + ' 180 C' + (x + 150) + ' 130 ' + (x + 146) + ' 100 ' + (x + 146) + ' 58', 'none', LAVA, 3) + flecha(x + 20, 114, x + 70, 114, T.ink) + flecha(x + 184, 124, x + 164, 124, T.ink);
    out += tx(x + 56, 92, 'océano', { f: F, s: 11, c: T.ink }) + tx(x + 58, 180, 'subducción', { f: F, s: 11, c: T.ink }) + ci(x + 124, 150, 5, 'none', '#B03030', 2) + ci(x + 124, 150, 10, 'none', '#B03030', 1);
    x = 416;
    out += tx(x + 98, 40, 'Transformante', { f: F, s: 14, w: 700, c: T.ink }) + tx(x + 98, 56, 'vista desde arriba', { f: F, s: 10.5, c: GRIS });
    out += (es3d(C) ? rc(x + 20, 72, 78, 170, { f: '#000', op: '.12' }) + rc(x + 104, 72, 78, 170, { f: '#000', op: '.12' }) : '') + rc(x + 16, 66, 80, 172, { f: TIERRA, s: T.ink, sw: 1.2 }) + rc(x + 100, 66, 80, 172, { f: '#B9A27E', s: T.ink, sw: 1.2 });
    out += ln(x + 98, 62, x + 98, 244, '#B03030', 2.5, ' stroke-dasharray="6 4"') + flecha(x + 56, 200, x + 56, 110, T.ink, 2.2) + flecha(x + 140, 110, x + 140, 200, T.ink, 2.2);
    out += pa('M' + (x + 30) + ' 150 H' + (x + 96), 'none', '#5a8f3a', 3) + pa('M' + (x + 100) + ' 176 H' + (x + 166), 'none', '#5a8f3a', 3) + tx(x + 98, 256 - 2, 'la carretera queda desplazada', { f: F, s: 10, c: GRIS });
    ['Se separan: nace corteza nueva', 'Chocan: una placa se hunde', 'Se deslizan: terremotos'].forEach(function (s, k) { out += tx(8 + k * 204 + 98, 276, s, { f: F, s: 12, w: 700, c: T.acc }); });
    var ej = H.mezcla(r, EJ_PLACAS).slice(0, 2), ops = ['divergente', 'convergente', 'transformante'];
    var items = ej.map(function (e) { return mc('¿Qué tipo de límite forma ' + e[0] + '?', ops, e[1]); });
    items.push(it('abierta', 'En ' + pais(C) + ', ' + (SISMO[C.pk] || SISMO.es) + '. Explica con el dibujo por qué eso provoca terremotos.', '', { lin: 3 }));
    return { t: 'Los límites de las placas tectónicas', intro: 'La litosfera está partida en placas que se mueven unos centímetros al año sobre el manto. Lo que pasa en sus bordes explica volcanes, cordilleras y terremotos.', fig: svg(W, Hh, out, 620), items: items };
  }

  function genEstaciones(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 620, Hh = 320, sx = 310, sy = 160, out = rc(0, 0, W, Hh, { f: '#1F2A44', rx: 10 });
    var sur = /^(ar|cl)$/.test(C.pk), trop = /^(co|ve)$/.test(C.pk), id = 'es' + (++UID);
    out += '<ellipse cx="' + sx + '" cy="' + sy + '" rx="235" ry="95" fill="none" stroke="#C8D3E8" stroke-width="1.2" stroke-dasharray="5 4"/>';
    out += grad(C, id, '#2E7BC4') + ci(sx, sy, 30, '#FFC93C', '#FFB000', 3) + tx(sx, sy + 5, 'Sol', { f: F, s: 13, w: 700, c: '#5A3A00' });
    var P = [[75, 160, '21 dic', 'solsticio'], [310, 255, '20 mar', 'equinoccio'], [545, 160, '21 jun', 'solsticio'], [310, 65, '22 sep', 'equinoccio']];
    var EST = sur ? ['el verano', 'el otoño', 'el invierno', 'la primavera'] : ['el invierno', 'la primavera', 'el verano', 'el otoño'];
    P.forEach(function (p, i) {
      var dx = p[0] - sx, dy = p[1] - sy, a = Math.atan2(dy, dx) * 180 / Math.PI;
      out += ci(p[0], p[1], 19, '#2E7BC4', '#fff', 1.5) + (es3d(C) ? '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="19"' + brillo(C, id) + '/>' : '');
      out += '<path d="M0 -19 A19 19 0 0 1 0 19 Z" fill="#0B1020" opacity=".55" transform="translate(' + p[0] + ' ' + p[1] + ') rotate(' + r1(a) + ')"/>';
      var ax = 30 * Math.sin(23.4 * Math.PI / 180), ay = 30 * Math.cos(23.4 * Math.PI / 180);
      out += ln(p[0] - ax, p[1] + ay, p[0] + ax, p[1] - ay, '#fff', 1.6) + ci(p[0] + ax, p[1] - ay, 2.5, '#fff');
      var ty = i === 3 ? p[1] - 34 : i === 1 ? p[1] + 34 : p[1] + 40;
      out += tx(p[0], ty, p[2] + ' · ' + p[3], { f: F, s: 12, w: 700, c: '#fff' }) + tx(p[0], ty + 15, trop ? 'hemisferio norte: ' + ['invierno', 'primavera', 'verano', 'otoño'][i] : 'empieza ' + EST[i], { f: F, s: 11, c: '#FFD98A' });
    });
    out += tx(14, 22, 'Eje inclinado 23,4°', { f: F, s: 11, a: 'start', c: '#C8D3E8' }) + tx(14, 36, 'apunta a la estrella Polar', { f: F, s: 10, a: 'start', c: '#C8D3E8' });
    var q = trop ? 'En España, ¿qué estación empieza el 21 de diciembre?' : 'En ' + pais(C) + ', ¿qué estación empieza el 21 de diciembre?';
    var items = [it('corta', q, trop ? 'el invierno' : EST[0], { ac: [trop ? 'el invierno' : EST[0], (trop ? 'el invierno' : EST[0]).replace(/^(el|la) /, '')] }),
      mcM(r, '¿Por qué hay estaciones?', ['porque el eje de la Tierra está inclinado', 'porque en verano la Tierra está más cerca del Sol', 'porque el Sol cambia de tamaño'], 'porque el eje de la Tierra está inclinado', { x: 'En enero la Tierra está más cerca del Sol y en el hemisferio norte es invierno.' }),
      it('corta', 'Cuando en el hemisferio norte es verano, ¿qué estación es en el hemisferio sur?', 'invierno')];
    if (trop) items.push(it('abierta', 'En ' + pais(C) + ', cerca del ecuador, la temperatura apenas cambia en el año. ¿Qué dos estaciones se notan en su lugar?', 'la estación seca y la estación lluviosa', { lin: 2 }));
    return { t: 'Las estaciones del año', intro: 'La Tierra tarda 365 días y 6 horas en dar la vuelta al Sol. Como su eje está inclinado, cada hemisferio recibe la luz más o menos de frente según la época.', fig: svg(W, Hh, out, 620), items: items };
  }

  var CAPITAL = { es: ['Madrid', 40.4], mx: ['Ciudad de México', 19.4], co: ['Bogotá', 4.7], ar: ['Buenos Aires', -34.6], cl: ['Santiago', -33.4], ve: ['Caracas', 10.5], do: ['Santo Domingo', 18.5], us: ['Washington D. C.', 38.9] };
  function zona(lat) { var a = Math.abs(lat); return a < 23.44 ? 'cálida' : a < 66.56 ? 'templada' : 'fría'; }
  function genZonas(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 620, Hh = 320, cx = 170, cy = 160, R = 135, id = 'zc' + (++UID), g = 'zg' + UID, out = '';
    function Y(l) { return cy - R * Math.sin(l * Math.PI / 180); }
    out += '<defs><clipPath id="' + id + '"><circle cx="' + cx + '" cy="' + cy + '" r="' + R + '"/></clipPath></defs>' + grad(C, g, '#fff');
    var B = [[90, 66.56, '#DDEBF5'], [66.56, 23.44, '#B9DDA5'], [23.44, -23.44, '#F4C06A'], [-23.44, -66.56, '#B9DDA5'], [-66.56, -90, '#DDEBF5']];
    out += (es3d(C) ? ci(cx + 5, cy + 6, R, '#000').replace('/>', ' opacity=".13"/>') : '') + '<g clip-path="url(#' + id + ')">' + B.map(function (b) { return rc(cx - R, Y(b[0]), 2 * R, Y(b[1]) - Y(b[0]), { f: b[2] }); }).join('') + '</g>';
    out += ci(cx, cy, R, 'none', T.ink, 2) + (es3d(C) ? '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '"' + brillo(C, g) + '/>' : '');
    var L = [[66.56, 'Círculo polar ártico · 66,5° N (arriba, zona fría)'], [23.44, 'Trópico de Cáncer · 23,4° N'], [0, 'Ecuador · 0°'], [-23.44, 'Trópico de Capricornio · 23,4° S'], [-66.56, 'Círculo polar antártico · 66,5° S (abajo, zona fría)']];
    L.forEach(function (l) { var y = Y(l[0]), hw = R * Math.cos(l[0] * Math.PI / 180); out += ln(cx - hw, y, cx + hw, y, l[0] === 0 ? '#B03030' : T.ink, l[0] === 0 ? 2 : 1.2, ' stroke-dasharray="' + (l[0] === 0 ? '0' : '5 3') + '"') + ln(cx + hw, y, 330, y, clr(T.ink, .5), .8) + tx(336, y + 4, l[1], { f: F, s: 11.5, a: 'start', c: T.ink }); });
    [['Zona templada', 50, '#B9DDA5'], ['Zona cálida', 10, '#F4C06A'], ['Zona templada', -45, '#B9DDA5']].forEach(function (z) { out += tx(cx + 45, Y(z[1]) + 4, z[0], { f: F, s: 11, w: 700, c: T.ink }); });
    var cap = CAPITAL[C.pk] || CAPITAL.es, py = Y(cap[1]);
    out += ci(cx - 40, py, 6, T.acc2, '#fff', 2) + tx(cx - 50, py - 10, cap[0], { f: F, s: 11.5, w: 700, a: 'end', c: T.acc2 });
    var km = Math.round(Math.abs(cap[1]) * 111), otro = H.pick(r, Object.keys(CAPITAL).filter(function (k) { return k !== C.pk; })), c2 = CAPITAL[otro];
    var items = [it('corta', '¿En qué zona climática está ' + cap[0] + '?', 'templada'.replace('templada', zona(cap[1])), { x: 'Latitud ' + fmt(Math.abs(cap[1]), C) + '° ' + (cap[1] < 0 ? 'S' : 'N') }),
      it('corta', '¿A cuántos kilómetros del ecuador está ' + cap[0] + '? (1° de latitud ≈ 111 km)', km, { x: fmt(Math.abs(cap[1]), C) + ' × 111 ≈ ' + km + ' km', ac: [String(km), km + ' km'] }),
      it('corta', c2[0] + ' está a ' + fmt(Math.abs(c2[1]), C) + '° ' + (c2[1] < 0 ? 'S' : 'N') + '. ¿En qué zona climática está?', zona(c2[1])),
      mcM(r, 'La zona cálida está entre…', ['los dos trópicos', 'el ecuador y el círculo polar', 'los dos círculos polares'], 'los dos trópicos')];
    return { t: 'Las zonas climáticas de la Tierra', intro: 'Los paralelos principales dividen la Tierra en cinco zonas. Cuanto más lejos del ecuador, más inclinados llegan los rayos del Sol y menos calientan.', fig: svg(W, Hh, out, 620), items: items };
  }

  var VOLCAN = { es: ['Teide', 3715], mx: ['Popocatépetl', 5393], co: ['Nevado del Ruiz', 5321], ar: ['Lanín', 3747], cl: ['Villarrica', 2847], us: ['Monte Santa Helena', 2549], ve: ['Cotopaxi (Ecuador)', 5897], do: ['Cotopaxi (Ecuador)', 5897] };
  function genVolcan(u, C, r) {
    return rotulo(u, C, r, { t: 'Las partes de un volcán', W: 420, H: 330, intro: 'El magma sube desde la cámara magmática por la chimenea y sale por el cráter como lava, gases y ceniza.',
      pts: [['cráter', 205, 76], ['chimenea', 222, 160], ['cámara magmática', 262, 296], ['cono volcánico', 110, 180], ['colada de lava', 292, 150], ['nube de gases y ceniza', 150, 28], ['cono secundario', 360, 170], ['estratos', 380, 280]],
      dib: function (T, F) {
        var o = rc(0, 0, 420, 230, { f: CIELO });
        ['#CDB38C', '#B89A72', '#A5865F', '#C1A57E'].forEach(function (c, i) { o += rc(0, 230 + i * 25, 420, 25, { f: c }); });
        o += '<ellipse cx="205" cy="296" rx="70" ry="24" fill="' + LAVA + '" stroke="' + T.ink + '"/>';
        o += poly([[40, 232], [180, 82], [230, 82], [370, 232]], '#8B6B55', T.ink, 1.5) + poly([[318, 232], [352, 182], [366, 182], [412, 232]], '#A07E62', T.ink, 1.4);
        o += pa('M198 82 L198 275 M212 82 L212 275', 'none', T.ink, 1) + rc(199, 82, 12, 200, { f: LAVA }) + pa('M211 214 Q290 210 359 184', 'none', LAVA, 5);
        o += pa('M230 84 Q250 110 262 140 Q275 175 300 205 Q312 222 320 232', 'none', '#F07A2A', 8) + ci(205, 40, 26, '#9AA0A6') + ci(180, 30, 20, '#AEB3B8') + ci(232, 26, 20, '#AEB3B8') + ci(205, 16, 16, '#C4C8CC');
        return o;
      },
      extra: function (rr, C) { var v = VOLCAN[C.pk] || VOLCAN.es, prof = H.pick(rr, [4, 5, 6, 8, 10]), tot = v[1] + prof * 1000; return [it('corta', 'El ' + v[0] + ' mide ' + fmt(v[1], C) + ' m. Si su cámara magmática está a ' + prof + ' km bajo el nivel del mar, ¿cuántos metros sube el magma hasta el cráter?', tot, { x: fmt(v[1], C) + ' + ' + fmt(prof * 1000, C) + ' = ' + fmt(tot, C) + ' m' })]; }
    });
  }

  var RIO = { es: ['Tajo', 1007], mx: ['Bravo', 3034], co: ['Magdalena', 1528], ar: ['Paraná', 4880], cl: ['Loa', 440], ve: ['Orinoco', 2140], do: ['Yaque del Norte', 296], us: ['Misisipi', 3730] };
  function genRio(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 620, Hh = 330, out = rc(0, 0, W, 220, { f: '#EAF2DC' }) + rc(540, 0, 80, 220, { f: MAR });
    out += poly([[0, 150], [30, 40], [60, 110], [90, 20], [130, 120], [160, 60], [190, 150]], '#A7A9AC', T.ink, 1.2) + poly([[82, 30], [90, 20], [98, 34]], '#fff', 'none');
    var rio = 'M90 40 C110 80 150 90 190 100 C240 110 230 60 280 70 C330 80 300 140 350 140 C400 140 380 80 430 90 C480 100 490 120 540 118';
    out += pa(rio, 'none', '#3C8DD0', 5) + pa('M250 200 C270 160 250 120 238 100', 'none', '#3C8DD0', 3) + pa('M500 112 L545 80 M505 116 L545 118 M500 120 L545 158', 'none', '#3C8DD0', 2.5) + poly([[480, 112], [540, 70], [540, 166]], '#D7C58E', 'none').replace('/>', ' opacity=".7"/>') + pa(rio.replace(/^.*C480/, 'M430 90 C480'), 'none', '#3C8DD0', 5);
    [200, 390].forEach(function (x) { out += ln(x, 4, x, 216, T.ink, 1, ' stroke-dasharray="5 4"'); });
    [['Curso alto', 100], ['Curso medio', 295], ['Curso bajo', 465]].forEach(function (c) { out += tx(c[1], 16, c[0], { f: F, s: 13, w: 700, c: T.ink }); });
    [['nacimiento', 90, 54, 'start'], ['afluente', 258, 196, 'start'], ['meandro', 350, 160, 'middle'], ['delta', 520, 186, 'middle'], ['mar', 580, 110, 'middle']].forEach(function (l) { out += tx(l[1] + (l[3] === 'start' ? 8 : 0), l[2], l[0], { f: F, s: 11.5, a: l[3], w: 700, c: '#1E5D96' }); });
    out += rc(10, 232, 600, 92, { rx: 8, f: '#fff', s: clr(T.ink, .7), sw: 1 }) + pa('M30 266 Q140 274 200 292 T390 308 T600 314', 'none', T.acc, 3);
    [['erosión · valle en V', 100, 'M80 310 L100 290 L120 310'], ['transporte', 295, 'M270 305 Q295 290 320 305'], ['sedimentación', 495, 'M460 305 L530 305']].forEach(function (c) { out += tx(c[1], 250 + 10, c[0], { f: F, s: 11.5, w: 700, c: T.ink }) + pa(c[2], 'none', '#1E5D96', 2); });
    out += tx(600, 324 - 2, 'perfil del río', { f: F, s: 10, a: 'end', c: GRIS });
    var rr = RIO[C.pk] || RIO.es, v = H.pick(r, [2, 3, 4, 5]), d = Math.round(rr[1] / (v * 24) * 10) / 10;
    var items = [mcM(r, '¿En qué curso se forman los meandros?', ['en el curso medio', 'en el curso alto', 'en el nacimiento'], 'en el curso medio'),
      it('corta', '¿Cómo se llama un río que desemboca en otro río?', 'afluente'),
      it('corta', 'El ' + rr[0] + ' mide ' + fmt(rr[1], C) + ' km. Si el agua avanza a ' + v + ' km/h, ¿cuántos días tarda en recorrerlo?', fmt(d, C), { x: fmt(rr[1], C) + ' ÷ (' + v + ' × 24) ≈ ' + fmt(d, C) + ' días' }),
      it('abierta', '¿Por qué en el curso alto el río erosiona y en el curso bajo deposita sedimentos?', 'Arriba la pendiente es fuerte y el agua va rápida; abajo pierde velocidad y deja caer lo que arrastra.', { lin: 2 })];
    return { t: 'El curso de un río', intro: 'Un río nace en las montañas y termina en el mar, en un lago o en otro río. Según la pendiente, en cada tramo erosiona, transporta o deposita.', fig: svg(W, Hh, out, 620), items: items };
  }

  function genCosta(u, C, r) {
    return rotulo(u, C, r, { t: 'Las formas de la costa', W: 420, H: 330, intro: 'Donde la tierra y el mar se encuentran, el relieve toma formas que tienen nombre propio.',
      pts: [['isla', 115, 122], ['archipiélago', 72, 44], ['península', 230, 108], ['istmo', 230, 184], ['cabo', 392, 138], ['golfo', 115, 256], ['bahía', 320, 228], ['estrecho', 281, 112]],
      dib: function (T, F) {
        var L = VERDE, o = rc(0, 0, 420, 330, { f: MAR });
        o += pa('M0 330 L0 200 L55 200 Q60 292 115 292 Q170 292 175 200 L222 200 L222 165 Q186 160 190 110 Q195 70 230 70 Q268 70 270 110 Q272 160 238 165 L238 200 L300 200 Q298 248 320 248 Q342 248 340 200 L375 200 L392 150 L405 200 L420 200 L420 330 Z', L, T.ink, 1.5);
        o += '<ellipse cx="115" cy="122" rx="34" ry="19" fill="' + L + '" stroke="' + T.ink + '" stroke-width="1.5"/>' + '<ellipse cx="322" cy="100" rx="28" ry="36" fill="' + L + '" stroke="' + T.ink + '" stroke-width="1.5"/>';
        [[40, 40, 12], [70, 26, 9], [98, 48, 11], [58, 66, 8]].forEach(function (p) { o += ci(p[0], p[1], p[2], L, T.ink, 1.2); });
        return o;
      },
      extra: function (rr) { return [mcM(rr, 'Una porción de tierra rodeada de agua por todas partes menos por una, por donde se une al continente, es…', ['una península', 'una isla', 'un golfo'], 'una península'), it('corta', '¿En qué se diferencia un golfo de una bahía?', 'el golfo es más grande', { ac: ['el golfo es más grande', 'tamaño'] })]; }
    });
  }

  function genRocas(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 620, Hh = 330, cx = 310, cy = 168, R = 120, out = '';
    var N = [['Sedimentos', 'arena, barro, restos', '#EAD9B5'], ['Rocas sedimentarias', 'caliza, arenisca', '#D9C08F'], ['Rocas metamórficas', 'mármol, pizarra', '#B8B2C8'], ['Magma', 'roca fundida', '#F29A7A'], ['Rocas magmáticas', 'granito, basalto', '#C9C9C9']];
    var PR = ['compactación y cementación', 'presión y temperatura', 'fusión', 'enfriamiento', 'erosión y transporte'];
    var P = N.map(function (_, i) { return pt(cx, cy, R, 90 - i * 72); });
    P.forEach(function (p, i) {
      var q = P[(i + 1) % 5], a = Math.atan2(q[1] - p[1], q[0] - p[0]), d = Math.hypot(q[0] - p[0], q[1] - p[1]);
      var x1 = p[0] + Math.cos(a) * 52, y1 = p[1] + Math.sin(a) * 30, x2 = p[0] + Math.cos(a) * (d - 58), y2 = p[1] + Math.sin(a) * (d - 34);
      out += flecha(x1, y1, x2, y2, T.acc, 2.2);
      var mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, ox = (mx - cx) * .38, oy = (my - cy) * .38;
      out += tx(mx + ox, my + oy + 4, PR[i], { f: F, s: 11.5, w: 700, c: T.acc, a: mx + ox < cx - 20 ? 'end' : mx + ox > cx + 20 ? 'start' : 'middle' });
    });
    P.forEach(function (p, i) { var bx = p[0] - 72, by = p[1] - 24; out += (es3d(C) ? rc(bx + 3, by + 4, 144, 48, { rx: 10, f: '#000', op: '.13' }) : '') + rc(bx, by, 144, 48, { rx: 10, f: N[i][2], s: T.ink, sw: 1.2 }) + tx(p[0], p[1] - 3, N[i][0], { f: F, s: 11.5, w: 700, c: T.ink }) + tx(p[0], p[1] + 13, N[i][1], { f: F, s: 10.5, c: T.ink }); });
    var EX = [['granito', 'magmática'], ['basalto', 'magmática'], ['caliza', 'sedimentaria'], ['arenisca', 'sedimentaria'], ['mármol', 'metamórfica'], ['pizarra', 'metamórfica']], e = H.mezcla(r, EX).slice(0, 2);
    var items = e.map(function (x) { return mc('¿Qué tipo de roca es el ' + x[0] + '?'.replace('el arenisca', 'la arenisca').replace('el caliza', 'la caliza').replace('el pizarra', 'la pizarra'), ['magmática', 'sedimentaria', 'metamórfica'], x[1]); });
    items = items.map(function (x) { x.e = x.e.replace('el arenisca', 'la arenisca').replace('el caliza', 'la caliza').replace('el pizarra', 'la pizarra'); return x; });
    items.push(it('corta', '¿Qué proceso transforma una roca sedimentaria en metamórfica?', 'presión y temperatura', { ac: ['presión y temperatura', 'la presión y la temperatura', 'presion y temperatura'] }), it('abierta', 'El mármol de una estatua vino de una caliza. Explica su viaje por el ciclo.', '', { lin: 2 }));
    return { t: 'El ciclo de las rocas', intro: 'Las rocas no son eternas: se rompen, se entierran, se calientan y se funden. Cada tipo puede convertirse en otro a lo largo de millones de años.', fig: svg(W, Hh, out, 620), items: items };
  }

  /* ─────────── HISTORIA ─────────── */
  var HITO = { es: [1978, 'Constitución española'], mx: [1810, 'Grito de Dolores'], co: [1810, 'Grito de Independencia'], ar: [1816, 'Independencia'], cl: [1818, 'Independencia'], ve: [1811, 'Independencia'], do: [1844, 'Independencia'], us: [1776, 'Declaración de Independencia'] };
  function genEdades(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 620, Hh = 250, x0 = 14, w = 118, y = 96, out = '';
    var E5 = [['Prehistoria', '', 'hasta la escritura'], ['Edad', 'Antigua', '3000 a. C. – 476'], ['Edad', 'Media', '476 – 1492'], ['Edad', 'Moderna', '1492 – 1789'], ['Edad', 'Contemporánea', '1789 – hoy']];
    var LIM = [['3000 a. C.', 'escritura'], ['476', 'caída de Roma'], ['1492', 'Colón llega a América'], ['1789', 'Revolución francesa']];
    E5.forEach(function (e, i) { var x = x0 + i * w, f = clr(T.acc, .85 - i * .15); out += (es3d(C) ? rc(x + 3, y + 5, w - 4, 54, { rx: 6, f: '#000', op: '.13' }) : '') + rc(x, y, w - 4, 54, { rx: 6, f: f, s: T.ink, sw: 1 }) + tx(x + w / 2 - 2, y + (e[1] ? 22 : 31), e[0], { f: F, s: 13, w: 700, c: T.ink }) + (e[1] ? tx(x + w / 2 - 2, y + 39, e[1], { f: F, s: 13, w: 700, c: T.ink }) : '') + tx(x + w / 2 - 2, y + 72, e[2], { f: F, s: 10.5, c: GRIS }); });
    LIM.forEach(function (l, i) { var x = x0 + (i + 1) * w - 2; out += ln(x, y - 30, x, y, T.acc2, 2) + ci(x, y - 30, 4, T.acc2) + tx(x, y - 52, l[0], { f: F, s: 12, w: 700, c: T.acc2 }) + tx(x, y - 38, l[1], { f: F, s: 10.5, c: T.ink }); });
    var h = HITO[C.pk] || HITO.es, hx = x0 + 4 * w + (h[0] - 1789) / (2026 - 1789) * (w - 4);
    out += ln(hx, y + 54, hx, y + 100, T.acc, 2) + ci(hx, y + 100, 4, T.acc) + tx(Math.min(hx, 560), y + 118, h[0] + ' · ' + h[1], { f: F, s: 11.5, w: 700, c: T.acc, a: hx > 520 ? 'end' : 'middle' }) + tx(Math.min(hx, 560), y + 132, pais(C), { f: F, s: 10.5, c: GRIS, a: hx > 520 ? 'end' : 'middle' });
    var items = [it('corta', '¿Cuántos años duró la Edad Media?', 1016, { x: '1492 − 476 = 1016 años' }),
      it('corta', '¿En qué siglo empieza la Edad Moderna?', 'XV', { x: '1492 → siglo XV' }),
      it('corta', '¿Cuántos años han pasado desde ' + h[0] + ' (' + h[1].toLowerCase() + ') hasta 2026?', 2026 - h[0], { x: '2026 − ' + h[0] + ' = ' + (2026 - h[0]) }),
      mcM(r, '¿Qué hecho marca el paso de la Prehistoria a la Historia?', ['la invención de la escritura', 'el descubrimiento del fuego', 'la caída de Roma'], 'la invención de la escritura')];
    return { t: 'Las edades de la Historia', intro: 'Los historiadores dividen el pasado en edades separadas por grandes acontecimientos. Algunos cierran la Edad Media en 1453, con la caída de Constantinopla.', fig: svg(W, Hh, out, 620), items: items };
  }

  var HECHOS = [[-776, 'primeros Juegos Olímpicos'], [-44, 'muerte de Julio César'], [476, 'caída de Roma'], [711, 'llegada de los musulmanes a la península ibérica'], [1492, 'Colón llega a América'], [1605, 'se publica el Quijote'], [1789, 'Revolución francesa'], [1969, 'llegada a la Luna'], [-221, 'unificación de China'], [1440, 'imprenta de Gutenberg'], [1914, 'empieza la Primera Guerra Mundial']];
  function genSiglos(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 620, Hh = 230, x0 = 20, x1 = 600, y = 120, out = '';
    function X(yr) { return x0 + (yr + 800) / 2900 * (x1 - x0); }
    out += (es3d(C) ? rc(x0 + 3, y - 8, x1 - x0, 20, { f: '#000', op: '.12' }) : '') + rc(x0, y - 12, x1 - x0, 20, { f: clr(T.acc, .85), s: T.ink, sw: 1 });
    for (var k = -8; k < 21; k++) { var a = X(k * 100), b = X((k + 1) * 100), lab = k >= 0 ? romano(k + 1) : romano(-k); out += ln(a, y - 12, a, y + 8, T.ink, k === 0 ? 2.5 : .8) + tx((a + b) / 2, y + 2, lab, { f: F, s: 7.5, w: 700, c: k < 0 ? GRIS : T.ink }); }
    out += tx(X(-400), y + 26, 'antes de Cristo (a. C.)', { f: F, s: 11, c: GRIS }) + tx(X(1000), y + 26, 'después de Cristo (d. C.)', { f: F, s: 11, c: GRIS }) + tx(X(0), y + 26, 'año 1', { f: F, s: 10, w: 700, c: T.ink });
    var ev = []; H.mezcla(r, HECHOS).forEach(function (e) { if (ev.length < 4 && ev.every(function (x) { return Math.abs(x[0] - e[0]) >= 330; })) ev.push(e); }); ev.sort(function (a, b) { return a[0] - b[0]; });
    ev.forEach(function (e, i) { var x = X(e[0]), up = i % 2 === 0, ty = up ? 40 : 190; out += ln(x, up ? 58 : 150, x, up ? y - 12 : y + 8, T.acc2, 1.5) + ci(x, up ? y - 12 : y + 8, 3.5, T.acc2) + tx(Math.max(60, Math.min(560, x)), ty, anio(e[0]), { f: F, s: 12, w: 700, c: T.acc2 }) + tx(Math.max(60, Math.min(560, x)), ty + 14, e[1], { f: F, s: 10.5, c: T.ink }); });
    var s = E(r, 12, 20), items = ev.slice(0, 3).map(function (e) { return it('corta', '¿En qué siglo ocurrió: ' + e[1] + ' (' + anio(e[0]) + ')?', siglo(e[0]), { x: e[0] > 0 ? 'Se quitan las dos últimas cifras de ' + (e[0] - 1) + ' y se suma 1.' : 'Se cuenta hacia atrás desde el año 1.' }); });
    items.push(it('corta', '¿Qué años abarca el siglo ' + romano(s) + '?', ((s - 1) * 100 + 1) + '–' + (s * 100), { ac: [((s - 1) * 100 + 1) + '–' + (s * 100), ((s - 1) * 100 + 1) + '-' + (s * 100), 'del ' + ((s - 1) * 100 + 1) + ' al ' + (s * 100)] }));
    return { t: 'Los siglos en la línea del tiempo', intro: 'Un siglo son cien años. El siglo I empieza en el año 1 (no hay año 0), por eso el año 1500 todavía pertenece al siglo XV y el 1501 ya es del XVI.', fig: svg(W, Hh, out, 620), items: items };
  }

  function genFeudal(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 620, Hh = 310, cx = 200, out = '';
    var N = [['Rey', 'dueño de las tierras del reino'], ['Nobleza y clero', 'señores, obispos y abades'], ['Caballeros', 'vasallos que hacen la guerra'], ['Campesinos y siervos', 'trabajan la tierra y pagan tributos']];
    N.forEach(function (n, i) { var y0 = 20 + i * 70, w0 = 50 + i * 78, w1 = 50 + (i + 1) * 78, p = [[cx - w0 / 2, y0], [cx + w0 / 2, y0], [cx + w1 / 2, y0 + 66], [cx - w1 / 2, y0 + 66]]; out += sombra(C, p) + poly(p, clr(T.acc, .3 + i * .17), T.ink, 1.2) + tx(cx, y0 + 38, n[0], { f: F, s: 14, w: 700, c: i < 2 ? '#fff' : T.ink }) + tx(452, y0 + 30, n[0], { f: F, s: 12.5, w: 700, a: 'start', c: T.ink }) + tx(452, y0 + 46, n[1], { f: F, s: 11, a: 'start', c: GRIS }); });
    out += flecha(420, 30, 420, 284, T.acc2, 2.2) + flecha(436, 284, 436, 30, T.acc, 2.2) + tx(414, 300, '↓ obligaciones', { f: F, s: 11, w: 700, a: 'end', c: T.acc2 }) + tx(442, 300, '↑ protección y tierras', { f: F, s: 11, w: 700, a: 'start', c: T.acc });
    var items = [mcM(r, '¿Qué recibía un vasallo de su señor a cambio de fidelidad?', ['un feudo (tierras) y protección', 'un salario mensual', 'un título universitario'], 'un feudo (tierras) y protección'),
      mcM(r, '¿Qué grupo era el más numeroso?', ['los campesinos y siervos', 'la nobleza', 'el clero'], 'los campesinos y siervos'),
      it('abierta', 'Compara la pirámide feudal con la organización de un país de hoy. ¿Qué ha cambiado?', '', { lin: 3 })];
    return { t: 'La sociedad feudal', intro: 'En la Edad Media europea la sociedad se organizaba como una pirámide de lealtades: cada uno debía obediencia al de arriba y recibía protección a cambio.', fig: svg(W, Hh, out, 620), items: items };
  }

  /* ─────────── GEOMETRÍA Y MEDIDA ─────────── */
  function genRegla(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 620, Hh = 220, x0 = 40, pc = 36, y = 118, out = '';
    var a = H.pick(r, [0, 0, 10, 20, 15, 30, 5]), len = E(r, 38, 150 - a - 8), b = a + len, xa = x0 + a * pc / 10, xb = x0 + b * pc / 10;
    out += (es3d(C) ? poly([[20, y], [600, y], [606, y - 6], [26, y - 6]], osc('#F3E7B6', .15), T.ink, 1) + rc(24, y + 4, 580, 64, { f: '#000', op: '.12' }) : '') + rc(20, y, 580, 64, { rx: 3, f: '#F3E7B6', s: T.ink, sw: 1.5 });
    for (var m = 0; m <= 150; m++) { var x = x0 + m * pc / 10, L = m % 10 === 0 ? 22 : m % 5 === 0 ? 14 : 8; out += ln(x, y, x, y + L, T.ink, m % 10 === 0 ? 1.4 : .8); if (m % 10 === 0) out += tx(x, y + 38, m / 10, { f: F, s: 12, w: 700, c: T.ink }); }
    out += tx(590, y + 58, 'cm', { f: F, s: 11, a: 'end', c: GRIS });
    var py = 72; out += (es3d(C) ? rc(xa + 3, py - 9, xb - xa - 18, 24, { f: '#000', op: '.13' }) : '') + rc(xa, py - 12, xb - xa - 20, 24, { f: T.acc, s: T.ink, sw: 1.2 }) + rc(xa, py - 12, 10, 24, { f: '#F2A7B8', s: T.ink, sw: 1.2 }) + poly([[xb - 20, py - 12], [xb, py], [xb - 20, py + 12]], '#E9C9A0', T.ink, 1.2) + poly([[xb - 7, py - 4], [xb, py], [xb - 7, py + 4]], '#333', 'none');
    out += ln(xa, py + 12, xa, y, T.acc2, 1.2, ' stroke-dasharray="3 3"') + ln(xb, py, xb, y, T.acc2, 1.2, ' stroke-dasharray="3 3"') + tx(20, 30, 'Apreciación: 1 mm (la división más pequeña)', { f: F, s: 12, a: 'start', c: T.ink });
    var items = [it('corta', '¿Cuánto mide el lápiz en milímetros?', len, { x: a ? b + ' mm − ' + a + ' mm = ' + len + ' mm' : 'Empieza en 0 y termina en ' + b + ' mm.', ac: [String(len), len + ' mm'] }),
      it('corta', '¿Y en centímetros?', fmt(len / 10, C), { x: len + ' mm ÷ 10 = ' + fmt(len / 10, C) + ' cm', ac: [fmt(len / 10, C), fmt(len / 10, C) + ' cm', String(len / 10)] }),
      mcM(r, '¿Cómo hay que mirar la regla para leer bien la medida?', ['de frente, perpendicular a la marca', 'desde un lado, en diagonal', 'desde lejos'], 'de frente, perpendicular a la marca', { x: 'Si miras de lado cometes error de paralaje.' })];
    if (a) items.push(it('abierta', 'El lápiz no empieza en el 0. ¿Qué error cometerías si leyeras solo el número del final?', 'Sumaría ' + a + ' mm de más.', { lin: 2 }));
    return { t: 'Medir con la regla', intro: 'Cada centímetro de la regla se divide en 10 milímetros; la raya mediana marca el medio centímetro. Para medir se resta la marca del final menos la del principio.', fig: svg(W, Hh, out, 620), items: items };
  }

  function genCalibre(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 620, Hh = 250, x0 = 70, pm = 11, y = 70, out = '';
    var ent = E(r, 12, 30), k = E(r, 1, 9), L = ent + k / 10, xs = x0 + L * pm, MET = '#C9CED6';
    out += (es3d(C) ? rc(24, y + 4, 560, 44, { f: '#000', op: '.12' }) : '') + rc(20, y, 560, 44, { f: MET, s: T.ink, sw: 1.4 }) + poly([[20, y + 44], [x0, y + 44], [x0, y + 150], [48, y + 150], [20, y + 110]], MET, T.ink, 1.4);
    for (var m = 0; m <= 45; m++) { var x = x0 + m * pm; out += ln(x, y + 44, x, y + 44 - (m % 10 === 0 ? 18 : m % 5 === 0 ? 12 : 8), T.ink, m % 10 === 0 ? 1.3 : .8); if (m % 10 === 0) out += tx(x, y + 18, m / 10, { f: F, s: 11, w: 700, c: T.ink }); }
    out += tx(575, y + 18, 'cm', { f: F, s: 10, a: 'end', c: GRIS });
    out += (es3d(C) ? rc(xs - 16, y + 48, 150, 40, { f: '#000', op: '.12' }) : '') + rc(xs - 20, y + 44, 150, 40, { f: '#E4E7EC', s: T.ink, sw: 1.4 }) + rc(xs, y + 84, 16, 66, { f: '#E4E7EC', s: T.ink, sw: 1.4 });
    for (var i = 0; i <= 10; i++) { var xv = xs + i * .9 * pm, hit = i === k; out += ln(xv, y + 44, xv, y + 44 + (i % 5 === 0 ? 16 : 10), hit ? T.acc2 : T.ink, hit ? 2.4 : .9); if (i % 5 === 0) out += tx(xv, y + 76, i, { f: F, s: 10, w: 700, c: T.ink }); }
    out += ln(x0 + (ent + k) * pm, y + 26, x0 + (ent + k) * pm, y + 44, T.acc2, 2.4) + ci(x0 + (ent + k) * pm, y + 44, 3, T.acc2);
    out += rc(x0, y + 104, xs - x0, 40, { f: T.acc, s: T.ink, sw: 1.2 }) + tx((x0 + xs) / 2, y + 129, 'pieza', { f: F, s: 12, w: 700, c: '#fff' });
    out += tx(20, 24, 'Nonio de 10 divisiones · apreciación 0,1 mm', { f: F, s: 12, a: 'start', c: T.ink }) + tx(xs + 140, y + 104, 'la raya ' + k + ' coincide', { f: F, s: 11, a: 'start', w: 700, c: T.acc2 });
    var items = [it('corta', 'Mira el 0 del nonio: ¿cuántos milímetros enteros marca la regla fija?', ent, { ac: [String(ent), ent + ' mm'] }),
      it('corta', '¿Qué raya del nonio coincide con una raya de la regla?', k),
      it('corta', '¿Cuánto mide la pieza?', fmt(L, C) + ' mm', { x: ent + ' + ' + k + ' × 0,1 = ' + fmt(L, C) + ' mm', ac: [fmt(L, C) + ' mm', fmt(L, C), String(L)] }),
      mcM(r, '¿Por qué el calibre mide mejor que la regla?', ['porque el nonio divide el milímetro en 10 partes', 'porque es de metal', 'porque es más largo'], 'porque el nonio divide el milímetro en 10 partes')];
    return { t: 'El calibre o pie de rey', intro: 'El nonio tiene 10 rayas repartidas en 9 mm. Se leen los milímetros enteros en la regla fija, a la izquierda del 0 del nonio, y las décimas en la raya del nonio que coincide.', fig: svg(W, Hh, out, 620), items: items };
  }

  var COMBO = [[45, 30, '+'], [45, 60, '+'], [60, 45, '−'], [90, 45, '+'], [90, 30, '+'], [90, 60, '+'], [45, 45, '+'], [60, 30, '+'], [45, 30, '−']];
  function genEscuadra(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 620, Hh = 270, out = '', PL = clr(T.acc, .75);
    var e = [[30, 230], [190, 230], [30, 70]], c = [[230, 230], [230 + 173, 230], [230, 130]];
    out += sombra(C, e) + poly(e, PL, T.ink, 1.5) + poly([[48, 212], [140, 212], [48, 120]], '#fff', T.ink, 1) + sombra(C, c) + poly(c, clr(T.acc2, .7), T.ink, 1.5) + poly([[246, 216], [360, 216], [246, 154]], '#fff', T.ink, 1);
    out += rc(30, 216, 14, 14, { s: T.ink, sw: 1 }) + tx(56, 64 + 26, '45°', { f: F, s: 12, w: 700, c: T.ink }) + tx(160, 224, '45°', { f: F, s: 12, w: 700, c: T.ink }) + tx(110, 256, 'Escuadra', { f: F, s: 13, w: 700, c: T.ink });
    out += rc(230, 216, 14, 14, { s: T.ink, sw: 1 }) + tx(246, 150, '60°', { f: F, s: 12, w: 700, c: T.ink }) + tx(372, 224, '30°', { f: F, s: 12, w: 700, c: T.ink }) + tx(316, 256, 'Cartabón', { f: F, s: 13, w: 700, c: T.ink });
    var cb = H.pick(r, COMBO), res = cb[2] === '+' ? cb[0] + cb[1] : cb[0] - cb[1], vx = 470, vy = 220, R = 110;
    function ray(a, col) { var p = pt(vx, vy, R, a); return ln(vx, vy, p[0], p[1], col, 2.5); }
    out += ray(0, T.ink) + ray(cb[0], T.acc) + ray(cb[2] === '+' ? res : res, T.acc2);
    out += pa(arco(vx, vy, 34, 0, res), 'none', T.acc2, 2) + tx(vx + 60, vy - 8, res + '°', { f: F, s: 14, w: 700, c: T.acc2, a: 'start' }) + tx(vx + 40, 26, cb[0] + '° ' + cb[2] + ' ' + cb[1] + '° = ' + res + '°', { f: F, s: 14, w: 700, c: T.ink });
    var c2 = H.pick(r, COMBO.filter(function (x) { return x !== cb; })), r2 = c2[2] === '+' ? c2[0] + c2[1] : c2[0] - c2[1];
    var items = [it('corta', '¿Qué ángulo obtienes ' + (c2[2] === '+' ? 'al juntar' : 'al restar') + ' el de ' + c2[0] + '° y el de ' + c2[1] + '°?', r2 + '°', { x: c2[0] + ' ' + c2[2] + ' ' + c2[1] + ' = ' + r2, ac: [r2 + '°', String(r2)] }),
      it('corta', '¿Cuánto suman los tres ángulos del cartabón?', '180°', { x: '90 + 60 + 30 = 180', ac: ['180°', '180'] }),
      mcM(r, 'La escuadra es un triángulo…', ['rectángulo isósceles', 'equilátero', 'obtusángulo'], 'rectángulo isósceles'),
      it('abierta', '¿Cómo trazarías un ángulo de 15° con la escuadra y el cartabón?', '60° − 45° = 15°', { lin: 2 })];
    return { t: 'La escuadra y el cartabón', intro: 'La escuadra tiene ángulos de 90°, 45° y 45°; el cartabón, de 90°, 60° y 30°. Juntándolos o restándolos se trazan sin transportador 15°, 75°, 105°, 120°, 135° y 150°.', fig: svg(W, Hh, out, 620), items: items };
  }

  function genCompas(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 620, Hh = 310, out = '', ab = E(r, 6, 11);
    out += rc(104, 22, 12, 34, { rx: 4, f: T.acc, s: T.ink, sw: 1.2 }) + ci(110, 64, 9, '#C9CED6', T.ink, 1.5) + ln(106, 70, 66, 238, '#8A8F96', 5) + ln(114, 70, 154, 232, '#8A8F96', 5) + ln(66, 238, 64, 256, T.ink, 1.5) + rc(150, 230, 8, 16, { f: '#333' });
    [['mango', 118, 36], ['bisagra', 122, 68], ['brazos', 136, 150], ['aguja', 74, 256], ['mina', 162, 246]].forEach(function (l) { out += tx(l[1] + 6, l[2] + 4, l[0], { f: F, s: 12, w: 700, a: 'start', c: T.ink }); });
    var A = [300, 180], B = [520, 180], M = 410, R = 150, h = Math.sqrt(R * R - 110 * 110), aP = Math.atan2(h, 110) * 180 / Math.PI;
    out += ln(A[0], A[1], B[0], B[1], T.ink, 2.5) + ci(A[0], A[1], 4, T.ink) + ci(B[0], B[1], 4, T.ink) + tx(A[0] - 10, A[1] + 18, 'A', { f: F, s: 14, w: 700, c: T.ink }) + tx(B[0] + 10, B[1] + 18, 'B', { f: F, s: 14, w: 700, c: T.ink });
    out += pa(arco(A[0], A[1], R, aP - 14, aP + 14), 'none', T.acc, 1.8) + pa(arco(A[0], A[1], R, -aP - 14, -aP + 14), 'none', T.acc, 1.8) + pa(arco(B[0], B[1], R, 180 - aP - 14, 180 - aP + 14), 'none', T.acc, 1.8) + pa(arco(B[0], B[1], R, 180 + aP - 14, 180 + aP + 14), 'none', T.acc, 1.8);
    out += ln(M, A[1] - h - 18, M, A[1] + h + 18, T.acc2, 2.2) + ci(M, A[1] - h, 3.5, T.acc2) + ci(M, A[1] + h, 3.5, T.acc2) + ci(M, A[1], 4, T.acc2) + tx(M + 10, A[1] - h + 4, 'P', { f: F, s: 13, w: 700, a: 'start', c: T.ink }) + tx(M + 10, A[1] + h + 4, 'Q', { f: F, s: 13, w: 700, a: 'start', c: T.ink }) + tx(M + 10, A[1] + 18, 'M', { f: F, s: 13, w: 700, a: 'start', c: T.ink });
    out += tx(355, A[1] - 8, ab + ' cm', { f: F, s: 11.5, c: GRIS }) + tx(560, 30, 'mediatriz', { f: F, s: 12, w: 700, a: 'end', c: T.acc2 });
    var items = [it('corta', 'El segmento AB mide ' + ab + ' cm. ¿Cuánto mide AM?', fmt(ab / 2, C) + ' cm', { x: ab + ' ÷ 2 = ' + fmt(ab / 2, C), ac: [fmt(ab / 2, C) + ' cm', fmt(ab / 2, C), String(ab / 2)] }),
      mcM(r, 'Todos los puntos de la mediatriz están…', ['a la misma distancia de A y de B', 'más cerca de A', 'sobre el segmento AB'], 'a la misma distancia de A y de B'),
      it('corta', '¿Qué ángulo forma la mediatriz con el segmento AB?', '90°', { ac: ['90°', '90', 'recto', 'un ángulo recto'] }),
      it('corta', '¿Qué parte del compás se clava en el papel?', 'la aguja', { ac: ['la aguja', 'aguja'] })];
    return { t: 'El compás y la mediatriz', intro: 'Pasos: 1) abre el compás más de la mitad de AB; 2) traza un arco desde A y otro desde B, sin cambiar la abertura; 3) une los dos cortes P y Q. Esa recta es la mediatriz y pasa por el punto medio M.', fig: svg(W, Hh, out, 620), items: items };
  }

  function genTriangulos(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 620, Hh = 300, out = '';
    function tick(p, q, n) { var mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, a = Math.atan2(q[1] - p[1], q[0] - p[0]) + Math.PI / 2, s = ''; for (var i = 0; i < n; i++) { var o = (i - (n - 1) / 2) * 5, cx = mx + Math.cos(a - Math.PI / 2) * o, cy = my + Math.sin(a - Math.PI / 2) * o; s += ln(cx - Math.cos(a) * 6, cy - Math.sin(a) * 6, cx + Math.cos(a) * 6, cy + Math.sin(a) * 6, T.acc2, 1.6); } return s; }
    var TR = [
      ['Equilátero', '3 lados iguales', [[40, 120], [140, 120], [90, 34]], [[0, 1, 1], [1, 2, 1], [2, 0, 1]]],
      ['Isósceles', '2 lados iguales', [[245, 120], [315, 120], [280, 26]], [[1, 2, 1], [2, 0, 1]]],
      ['Escaleno', '3 lados distintos', [[420, 120], [560, 120], [460, 48]], [[0, 1, 1], [1, 2, 2], [2, 0, 3]]],
      ['Acutángulo', '3 ángulos agudos', [[40, 262], [150, 262], [80, 184]], []],
      ['Rectángulo', '1 ángulo recto', [[240, 262], [340, 262], [240, 184]], []],
      ['Obtusángulo', '1 ángulo obtuso', [[410, 262], [570, 262], [450, 222]], []]];
    TR.forEach(function (t, i) { out += sombra(C, t[2]) + poly(t[2], clr(T.acc, i < 3 ? .8 : .65), T.ink, 1.5) + t[3].map(function (s) { return tick(t[2][s[0]], t[2][s[1]], s[2]); }).join(''); var cx = (t[2][0][0] + t[2][1][0]) / 2; out += tx(cx, t[2][0][1] + 18, t[0], { f: F, s: 13, w: 700, c: T.ink }) + tx(cx, t[2][0][1] + 32, t[1], { f: F, s: 11, c: GRIS }); });
    out += rc(240, 248, 14, 14, { s: T.ink, sw: 1 }) + pa(arco(450, 222, 16, -40, -155 + 360 - 360), 'none', T.acc2, 2) + tx(10, 16, 'Según sus lados', { f: F, s: 12, w: 700, a: 'start', c: T.acc }) + tx(10, 164, 'Según sus ángulos', { f: F, s: 12, w: 700, a: 'start', c: T.acc });
    var kind = H.pick(r, ['acut', 'rect', 'obt']), a, b;
    if (kind === 'rect') { a = 90; b = E(r, 20, 70); } else if (kind === 'obt') { a = E(r, 100, 140); b = E(r, 15, 170 - a - 5); } else { a = E(r, 55, 80); b = E(r, 55, 80); if (180 - a - b >= 90) b = 70; }
    var c = 180 - a - b, cl = Math.max(a, b, c) > 90 ? 'obtusángulo' : Math.max(a, b, c) === 90 ? 'rectángulo' : 'acutángulo';
    var items = [it('corta', 'Un triángulo tiene ángulos de ' + a + '° y ' + b + '°. ¿Cuánto mide el tercero?', c + '°', { x: '180 − ' + a + ' − ' + b + ' = ' + c, ac: [c + '°', String(c)] }),
      mc('¿Cómo se clasifica ese triángulo según sus ángulos?', ['acutángulo', 'rectángulo', 'obtusángulo'], cl),
      mcM(r, 'Un triángulo con dos lados de 5 cm y uno de 3 cm es…', ['isósceles', 'equilátero', 'escaleno'], 'isósceles'),
      it('abierta', '¿Puede un triángulo tener dos ángulos rectos? Explica por qué.', 'No: 90 + 90 = 180 y no quedaría nada para el tercero.', { lin: 2 })];
    return { t: 'Clasificación de triángulos', intro: 'Los tres ángulos de cualquier triángulo suman 180°. Las marcas iguales en los lados indican que esos lados miden lo mismo.', fig: svg(W, Hh, out, 620), items: items };
  }

  function genCircunferencia(u, C, r) {
    var cx = 190, cy = 165, R = 120;
    return rotulo(u, C, r, { t: 'Elementos de la circunferencia', W: 400, H: 330, intro: 'La circunferencia es la línea; el círculo es la superficie que encierra. Todos sus puntos están a la misma distancia del centro: el radio.',
      pts: [['centro', cx - 14, cy - 14], ['radio', pt(cx, cy, 64, 32)[0], pt(cx, cy, 64, 32)[1]], ['diámetro', cx - 70, cy + 16], ['cuerda', pt(cx, cy, 90, 135)[0], pt(cx, cy, 90, 135)[1]], ['arco', pt(cx, cy, R + 16, 250)[0], pt(cx, cy, R + 16, 250)[1]], ['tangente', pt(cx, cy, R, 310)[0] + 48, pt(cx, cy, R, 310)[1] + 20], ['secante', 30, 116], ['sector circular', pt(cx, cy, 80, 62)[0], pt(cx, cy, 80, 62)[1]]],
      dib: function (T, F) {
        var o = rc(0, 0, 400, 330, { f: '#fff' }), p40 = pt(cx, cy, R, 40), p80 = pt(cx, cy, R, 80);
        o += pa('M' + cx + ' ' + cy + ' L' + r1(p40[0]) + ' ' + r1(p40[1]) + ' A' + R + ' ' + R + ' 0 0 0 ' + r1(p80[0]) + ' ' + r1(p80[1]) + ' Z', clr(T.acc, .75), 'none');
        o += ci(cx, cy, R, clr(T.acc, .95), T.ink, 2.5) + pa('M' + cx + ' ' + cy + ' L' + r1(p40[0]) + ' ' + r1(p40[1]) + ' A' + R + ' ' + R + ' 0 0 0 ' + r1(p80[0]) + ' ' + r1(p80[1]) + ' Z', clr(T.acc, .7), T.ink, 1.2);
        o += ln(cx - R, cy, cx + R, cy, T.ink, 2) + ci(cx, cy, 4, T.ink);
        var c1 = pt(cx, cy, R, 110), c2 = pt(cx, cy, R, 165); o += ln(c1[0], c1[1], c2[0], c2[1], T.acc2, 2.2);
        o += pa(arco(cx, cy, R, 225, 275), 'none', T.acc2, 5);
        var t = pt(cx, cy, R, 310), d = [Math.cos(40 * Math.PI / 180), -Math.sin(40 * Math.PI / 180)]; o += ln(t[0] - d[0] * 90, t[1] - d[1] * 90, t[0] + d[0] * 90, t[1] + d[1] * 90, T.ink, 1.8) + ci(t[0], t[1], 3, T.ink);
        var s1 = pt(cx, cy, R, 185), s2 = pt(cx, cy, R, 215), sd = [s2[0] - s1[0], s2[1] - s1[1]]; o += ln(s1[0] - sd[0] * 1.3, s1[1] - sd[1] * 1.3, s2[0] + sd[0] * 1.6, s2[1] + sd[1] * 1.6, T.ink, 1.8);
        return o;
      },
      extra: function (rr, C) { var rad = E(rr, 3, 12), L = Math.round(2 * 3.14 * rad * 10) / 10, A = Math.round(3.14 * rad * rad * 10) / 10; return [it('corta', 'Si el radio mide ' + rad + ' cm, ¿cuánto mide la circunferencia? (π ≈ 3,14)', fmt(L, C) + ' cm', { x: '2 × 3,14 × ' + rad + ' = ' + fmt(L, C), ac: [fmt(L, C) + ' cm', fmt(L, C), String(L)] }), it('corta', '¿Y el área del círculo?', fmt(A, C) + ' cm²', { x: '3,14 × ' + rad + '² = ' + fmt(A, C), ac: [fmt(A, C) + ' cm²', fmt(A, C), String(A)] })]; }
    });
  }

  function genCuadrilateros(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 620, Hh = 300, out = '';
    var Q = [['Cuadrado', '4 lados iguales y 4 ángulos rectos', [[50, 30], [130, 30], [130, 110], [50, 110]]], ['Rectángulo', 'lados opuestos iguales, 4 rectos', [[230, 45], [370, 45], [370, 110], [230, 110]]], ['Rombo', '4 lados iguales, diagonales perpendiculares', [[510, 22], [560, 68], [510, 114], [460, 68]]],
      ['Romboide', 'lados opuestos paralelos e iguales', [[60, 180], [160, 180], [130, 250], [30, 250]]], ['Trapecio', 'solo 2 lados paralelos', [[250, 180], [350, 180], [380, 250], [220, 250]]], ['Trapezoide', 'ningún lado paralelo', [[450, 190], [540, 175], [570, 250], [470, 240]]]];
    Q.forEach(function (q, i) { out += sombra(C, q[2]) + poly(q[2], clr(i % 2 ? T.acc2 : T.acc, .72), T.ink, 1.5); var xs = q[2].map(function (p) { return p[0]; }), cx = (Math.min.apply(null, xs) + Math.max.apply(null, xs)) / 2, by = Math.max.apply(null, q[2].map(function (p) { return p[1]; })); out += tx(cx, by + 18, q[0], { f: F, s: 13, w: 700, c: T.ink }) + tx(cx, by + 32, q[1], { f: F, s: 10.5, c: GRIS }); });
    out += ln(510, 22, 510, 114, T.ink, 1, ' stroke-dasharray="3 3"') + ln(460, 68, 560, 68, T.ink, 1, ' stroke-dasharray="3 3"');
    var a = E(r, 4, 15), b = E(r, 2, a - 1), D = E(r, 6, 14), d = E(r, 3, D - 1), B = E(r, 8, 16), bb = E(r, 3, B - 2), h = E(r, 3, 9);
    var items = [it('corta', 'Un rectángulo mide ' + a + ' cm × ' + b + ' cm. ¿Cuál es su perímetro?', 2 * (a + b) + ' cm', { x: '2 × (' + a + ' + ' + b + ') = ' + 2 * (a + b), ac: [2 * (a + b) + ' cm', String(2 * (a + b))] }),
      it('corta', '¿Y su área?', a * b + ' cm²', { x: a + ' × ' + b + ' = ' + a * b, ac: [a * b + ' cm²', String(a * b)] }),
      it('corta', 'Un rombo tiene diagonales de ' + D + ' y ' + d + ' cm. ¿Cuál es su área?', fmt(D * d / 2, C) + ' cm²', { x: '(' + D + ' × ' + d + ') ÷ 2 = ' + fmt(D * d / 2, C), ac: [fmt(D * d / 2, C) + ' cm²', fmt(D * d / 2, C), String(D * d / 2)] }),
      it('corta', 'Un trapecio tiene bases de ' + B + ' y ' + bb + ' cm y altura ' + h + ' cm. ¿Cuál es su área?', fmt((B + bb) * h / 2, C) + ' cm²', { x: '(' + B + ' + ' + bb + ') × ' + h + ' ÷ 2 = ' + fmt((B + bb) * h / 2, C), ac: [fmt((B + bb) * h / 2, C) + ' cm²', fmt((B + bb) * h / 2, C), String((B + bb) * h / 2)] }),
      mcM(r, '¿Qué cuadrilátero tiene los 4 lados iguales pero ningún ángulo recto?', ['el rombo', 'el cuadrado', 'el trapecio'], 'el rombo')];
    return { t: 'Los cuadriláteros', intro: 'Los cuadriláteros tienen cuatro lados y sus ángulos suman 360°. Se clasifican por el número de pares de lados paralelos.', fig: svg(W, Hh, out, 620), items: items };
  }

  function genDesarrollo(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 620, Hh = 300, s = 16, k = 22, out = '';
    var a = E(r, 3, 7), b = E(r, 2, 5), c = E(r, 2, 6);
    var fx = 50, fy = 250 - c * k, dx = b * k * .55, dy = -b * k * .45, P = clr(T.acc, .7);
    var front = [[fx, fy], [fx + a * k, fy], [fx + a * k, fy + c * k], [fx, fy + c * k]], top = [[fx, fy], [fx + dx, fy + dy], [fx + a * k + dx, fy + dy], [fx + a * k, fy]], side = [[fx + a * k, fy], [fx + a * k + dx, fy + dy], [fx + a * k + dx, fy + c * k + dy], [fx + a * k, fy + c * k]];
    out += sombra(C, front) + poly(front, P, T.ink, 1.5) + poly(top, es3d(C) ? clr(T.acc, .85) : P, T.ink, 1.5) + poly(side, es3d(C) ? osc(P, .15) : P, T.ink, 1.5);
    if (!es3d(C)) out += ln(fx + dx, fy + dy, fx + dx, fy + c * k + dy, T.ink, 1, ' stroke-dasharray="4 3"') + ln(fx + dx, fy + c * k + dy, fx, fy + c * k, T.ink, 1, ' stroke-dasharray="4 3"') + ln(fx + dx, fy + c * k + dy, fx + a * k + dx, fy + c * k + dy, T.ink, 1, ' stroke-dasharray="4 3"');
    out += tx(fx + a * k / 2, fy + c * k + 18, a + ' cm', { f: F, s: 12, w: 700, c: T.ink }) + tx(fx - 8, fy + c * k / 2 + 4, c + ' cm', { f: F, s: 12, w: 700, a: 'end', c: T.ink }) + tx(fx + a * k + dx / 2 + 8, fy + c * k + dy / 2 + 14, b + ' cm', { f: F, s: 12, w: 700, a: 'start', c: T.ink });
    var nx = 232, ny = 14 + b * s, ws = [b, a, b, a], x = nx;
    ws.forEach(function (w, i) { out += rc(x, ny, w * s, c * s, { f: i % 2 ? clr(T.acc, .7) : clr(T.acc2, .72), s: T.ink, sw: 1.2 }); x += w * s; });
    out += rc(nx + b * s, ny - b * s, a * s, b * s, { f: clr(T.acc, .82), s: T.ink, sw: 1.2 }) + rc(nx + b * s, ny + c * s, a * s, b * s, { f: clr(T.acc, .82), s: T.ink, sw: 1.2 });
    out += tx(nx + (a + b) * s, ny + c * s + b * s + 22, 'Desarrollo plano: 6 caras', { f: F, s: 12, w: 700, c: T.acc });
    var AT = 2 * (a * b + a * c + b * c), V = a * b * c;
    var items = [it('corta', '¿Cuál es el área total del prisma?', AT + ' cm²', { x: '2 × (' + a + '·' + b + ' + ' + a + '·' + c + ' + ' + b + '·' + c + ') = ' + AT, ac: [AT + ' cm²', String(AT)] }),
      it('corta', '¿Y su volumen?', V + ' cm³', { x: a + ' × ' + b + ' × ' + c + ' = ' + V, ac: [V + ' cm³', String(V)] }),
      it('corta', '¿Cuántas aristas tiene un prisma rectangular?', 12),
      it('abierta', 'Quieres forrar una caja de ' + a + ' × ' + b + ' × ' + c + ' cm con papel. ¿Cuánto papel necesitas como mínimo y por qué?', AT + ' cm², el área total', { lin: 2 })];
    return { t: 'Desarrollo de un prisma', intro: 'Si abres una caja y la extiendes sobre la mesa obtienes su desarrollo plano. El área total es la suma de las seis caras; el volumen, largo × ancho × alto.', fig: svg(W, Hh, out, 620), items: items };
  }

  function genParalelas(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 620, Hh = 290, out = '', al = H.pick(r, [35, 40, 50, 55, 60, 65, 70, 75]), y1 = 90, y2 = 200, X1 = 230, X2 = X1 + (y2 - y1) / Math.tan(al * Math.PI / 180);
    out += ln(30, y1, 590, y1, T.ink, 2.2) + ln(30, y2, 590, y2, T.ink, 2.2) + tx(596, y1 + 4, 'r', { f: F, s: 13, w: 700, a: 'start', c: T.ink }) + tx(596, y2 + 4, 's', { f: F, s: 13, w: 700, a: 'start', c: T.ink });
    var d = [Math.cos(al * Math.PI / 180), Math.sin(al * Math.PI / 180)]; out += ln(X1 - d[0] * 80, y1 - d[1] * 80, X2 + d[0] * 80, y2 + d[1] * 80, T.acc, 2.2) + tx(X2 + d[0] * 86, y2 + d[1] * 86 + 12, 't', { f: F, s: 13, w: 700, c: T.acc });
    var MID = [180 + al / 2, 270 + al / 2, 90 + al / 2, al / 2], v = [al, 180 - al, 180 - al, al];
    [[X1, y1], [X2, y2]].forEach(function (I, k) { MID.forEach(function (m, j) { var rr = 32, x = I[0] + rr * Math.cos(m * Math.PI / 180), y = I[1] + rr * Math.sin(m * Math.PI / 180); out += ci(x, y, 9, j === 0 && k === 0 ? T.acc2 : '#fff', T.ink, 1) + tx(x, y + 4, k * 4 + j + 1, { f: F, s: 11, w: 700, c: j === 0 && k === 0 ? '#fff' : T.ink }); }); });
    out += tx(30, 30, 'r y s son paralelas; t es secante. El ángulo 1 mide ' + al + '°.', { f: F, s: 13, w: 700, a: 'start', c: T.ink });
    var qs = H.mezcla(r, [2, 3, 4, 5, 6, 7, 8]).slice(0, 3);
    var items = qs.map(function (n) { var val = v[(n - 1) % 4]; return it('corta', '¿Cuánto mide el ángulo ' + n + '?', val + '°', { x: val === al ? 'Es igual al ángulo 1.' : '180 − ' + al + ' = ' + val, ac: [val + '°', String(val)] }); });
    items.push(mcM(r, 'Los ángulos 3 y 6 son…', ['alternos internos', 'correspondientes', 'opuestos por el vértice'], 'alternos internos'), mcM(r, 'Los ángulos 1 y 5 son…', ['correspondientes', 'alternos externos', 'suplementarios'], 'correspondientes'));
    return { t: 'Ángulos entre rectas paralelas', intro: 'Cuando una secante corta dos paralelas se forman ocho ángulos. Solo hay dos medidas distintas, y suman 180°: los opuestos por el vértice, los correspondientes y los alternos son iguales.', fig: svg(W, Hh, out, 620), items: items };
  }

  var GEO = /^(geografia|soci|natu)$/, TIE = /^(geografia|natu|soci|fisica|quimica|bio)$/, HIS = /^(soci|geografia|arte|religion|valores|lengua|musica)$/, GM = /^(mate|geoalg|tecno|arte|calculo)$/, MED = /^(mate|geoalg|tecno|fisica|quimica|natu)$/;
  var V = [
    ['tie_capas', genCapas, TIE, 2], ['tie_placas', genPlacas, TIE, 2], ['tie_estaciones', genEstaciones, /^(geografia|soci|natu|fisica|infantil)$/, 2], ['tie_zonas', genZonas, GEO, 2],
    ['tie_volcan', genVolcan, /^(geografia|natu|soci|quimica|infantil)$/, 2], ['tie_rio', genRio, GEO, 2], ['tie_costa', genCosta, GEO, 2], ['tie_rocas', genRocas, /^(geografia|natu|quimica|bio)$/, 2],
    ['his_edades', genEdades, HIS, 2], ['his_siglos', genSiglos, HIS, 2], ['his_feudal', genFeudal, /^(soci|geografia|valores|religion)$/, 1],
    ['gm_regla', genRegla, /^(mate|geoalg|tecno|fisica|natu|infantil)$/, 2], ['gm_calibre', genCalibre, MED, 2], ['gm_escuadra', genEscuadra, GM, 2], ['gm_compas', genCompas, GM, 2],
    ['gm_triangulos', genTriangulos, /^(mate|geoalg|arte|tecno)$/, 2], ['gm_circunferencia', genCircunferencia, /^(mate|geoalg|arte|tecno|calculo)$/, 2], ['gm_cuadrilateros', genCuadrilateros, /^(mate|geoalg|arte|tecno)$/, 2],
    ['gm_desarrollo', genDesarrollo, /^(mate|geoalg|tecno|arte)$/, 2], ['gm_paralelas', genParalelas, /^(mate|geoalg|calculo|tecno)$/, 2]
  ];
  V.forEach(function (v) { var g = v[1]; SV.visual(v[0], function (u, C, r) { try { return g(u, C, r); } catch (e) { if (window.console) console.warn('[EU_DIBUJOS4] ' + v[0] + ':', e && e.message); return null; } }, { materias: v[2], max: v[3] }); });
  window.EU_DIBUJOS4 = { V: V.map(function (v) { return v[0]; }) };
})();
