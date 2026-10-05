/* b6_anuncios_kit.js — Anuncios premium (window.EU_ANUNCIOS): 4 formatos (1:1, 4:5, 9:16, 16:9), maquetación
   automática (titular, subtítulo, oferta en sello, botón de llamada y dato de contacto), 4 marcos de escena
   (tarjeta, círculo, arco, pleno) y exportación SVG/PNG/PDF/ZIP. Reutiliza paletas, primitivas y fuentes de
   EU_PORTADAS. Las 100 escenas están en b6_anuncios_1/2/3.js. Cada escena se dibuja en un cuadrado de 600×600.
   Anuncio: { id, cat, n, marca, t, s, o (oferta), ol (texto de la oferta), cta, dato, pal, f, e (marco), d(K,p,D,A) } */
(function () {
  'use strict';
  if (window.EU_ANUNCIOS) return;
  var EP = window.EU_PORTADAS; if (!EP) { if (window.console) console.warn('EU_ANUNCIOS necesita b6_portadas_kit.js'); return; }
  var D = EP.D, LISTA = [], POR = {};
  var SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
  function r1(v) { return Math.round(v * 10) / 10; }

  var FORMATOS = {
    '1:1': { w: 1080, h: 1080, n: 'Cuadrado', u: 'Feed de Instagram y Facebook', mm: [100, 100] },
    '4:5': { w: 1080, h: 1350, n: 'Vertical', u: 'Feed vertical (el que más ocupa)', mm: [100, 125] },
    '9:16': { w: 1080, h: 1920, n: 'Historia', u: 'Historias, reels, TikTok y estados', mm: [90, 160] },
    '16:9': { w: 1920, h: 1080, n: 'Horizontal', u: 'YouTube, web, pantallas y LinkedIn', mm: [160, 90] }
  };
  /* Cajas de cada formato: T texto, S escena, C fila del botón, tamaños de letra y radio del sello. */
  var LAY = {
    '1:1': { T: [72, 96, 440, 600], S: [536, 330, 500], C: [72, 920], fs: 92, sfs: 32, kfs: 22, ch: 88, cfs: 27, R: 88,
      P: { T: [72, 96, 936, 420], C: [72, 920], B: [900, 690] } },
    '4:5': { T: [72, 96, 936, 330], S: [190, 450, 700], C: [72, 1222], fs: 100, sfs: 34, kfs: 23, ch: 90, cfs: 28, R: 100,
      P: { T: [72, 96, 936, 460], C: [72, 1190], B: [890, 990] } },
    '9:16': { T: [72, 250, 936, 420], S: [140, 700, 800], C: [72, 1588], fs: 116, sfs: 40, kfs: 26, ch: 100, cfs: 31, R: 118,
      P: { T: [72, 250, 936, 560], C: [72, 1588], B: [880, 1360] } },
    '16:9': { T: [110, 150, 800, 640], S: [1010, 130, 820], C: [110, 862], fs: 104, sfs: 36, kfs: 24, ch: 92, cfs: 28, R: 108,
      P: { T: [110, 150, 760, 640], C: [110, 862], B: [1720, 270] } }
  };
  var CATS = { comida: 'Comida y bebida', belleza: 'Belleza y estética', cursos: 'Cursos y formación', tienda: 'Tienda y ofertas', servicios: 'Servicios profesionales', eventos: 'Eventos', salud: 'Salud y bienestar', tecno: 'Tecnología', inmo: 'Inmobiliaria', infantil: 'Infantil' };
  var MARCOS = { tarjeta: 'Tarjeta', circulo: 'Círculo', arco: 'Arco', pleno: 'A sangre' };

  /* ─────────── dibujos propios de anuncios (coordenadas de la escena 600×600) ─────────── */
  var A = {
    bolsa: function (K, x, yb, s, c, ca, letra) { return K.g(K.l('M-40 -150 C-40 -210 40 -210 40 -150', K.osc(c, .35), 9) + K.pg([[-96, -150], [96, -150], [110, 0], [-110, 0]], c) + K.pg([[60, -150], [96, -150], [110, 0], [72, 0]], K.osc(c, .14)) + K.r(-96, -150, 192, 16, K.clr(c, .18)) + K.c(-40, -136, 5, K.osc(c, .4)) + K.c(40, -136, 5, K.osc(c, .4)) + (letra ? K.t(-6, -52, letra, 64, ca || '#fff', { b: 700 }) : ''), K.T(x, yb, s)); },
    botella: function (K, x, yb, s, c, ct, cl) { return K.g(K.r(-46, -170, 92, 170, c, { rx: 22 }) + K.r(-46, -170, 26, 170, '#fff', { op: .16, rx: 13 }) + K.r(-20, -214, 40, 46, ct, { rx: 6 }) + K.r(-28, -186, 56, 18, K.osc(ct, .15), { rx: 4 }) + K.r(-36, -118, 72, 70, cl || '#fff', { rx: 4, op: .92 }) + K.r(-24, -100, 48, 6, K.osc(c, .1), { rx: 3 }) + K.r(-18, -86, 36, 4, K.osc(c, .1), { rx: 2, op: .6 }) + K.r(-22, -72, 44, 4, K.osc(c, .1), { rx: 2, op: .6 }), K.T(x, yb, s)); },
    gotero: function (K, x, yb, s, c, ct) { return K.g(K.r(-34, -120, 68, 120, c, { rx: 14 }) + K.r(-34, -120, 18, 120, '#fff', { op: .2, rx: 9 }) + K.r(-18, -150, 36, 32, ct, { rx: 4 }) + K.e(0, -166, 16, 22, K.osc(ct, .2)) + K.r(-24, -84, 48, 46, '#fff', { op: .85, rx: 3 }), K.T(x, yb, s)); },
    tarro: function (K, x, yb, s, c, ct) { return K.g(K.r(-70, -90, 140, 90, c, { rx: 18 }) + K.r(-76, -118, 152, 32, ct, { rx: 8 }) + K.r(-76, -118, 152, 8, K.clr(ct, .2), { rx: 4 }) + K.r(-54, -76, 108, 44, '#fff', { op: .85, rx: 4 }) + K.r(-62, -84, 16, 76, '#fff', { op: .14, rx: 8 }), K.T(x, yb, s)); },
    labial: function (K, x, yb, s, c, cb) { return K.g(K.r(-26, -70, 52, 70, cb, { rx: 4 }) + K.r(-22, -100, 44, 32, K.clr(cb, .3), { rx: 3 }) + K.d('M-18 -100 L-18 -150 Q-10 -176 18 -168 L18 -100 Z', c) + K.r(-26, -70, 10, 70, '#fff', { op: .2 }), K.T(x, yb, s)); },
    plato: function (K, x, y, r, c, cb) { return K.g(K.e(0, r * .1, r * 1.04, r * .34, '#000', { op: .14 }) + K.e(0, 0, r, r * .32, c) + K.e(0, -2, r * .72, r * .22, cb || K.osc(c, .06)), K.T(x, y)); },
    pizza: function (K, x, y, r, cm, cq, cp, ch) { var s = K.c(0, 0, r, cm) + K.c(0, 0, r * .86, cq), R = K.rng(17); for (var i = 0; i < 9; i++) { var a = i * 2.4, d = r * (.2 + (i % 3) * .2); s += K.c(d * Math.cos(a), d * Math.sin(a), r * .1, cp) + K.c(d * Math.cos(a) - r * .03, d * Math.sin(a) - r * .03, r * .03, '#fff', { op: .3 }); } for (var j = 0; j < 7; j++) s += D.hoja(K, (R() - .5) * r * 1.2, (R() - .5) * r * 1.2, r * .16, R() * 360, ch || '#4E8A3A'); for (var k = 0; k < 6; k++) s += K.l('M0 0 L' + r1(r * Math.cos(k * Math.PI / 3)) + ' ' + r1(r * Math.sin(k * Math.PI / 3)), K.osc(cq, .25), 2, { op: .5 }); return K.g(s, K.T(x, y)); },
    hamburguesa: function (K, x, yb, s, cp, cc, cv, cq) { return K.g(K.e(0, -6, 130, 14, '#000', { op: .14 }) + K.r(-118, -40, 236, 34, cp, { rx: 17 }) + K.d('M-124 -52 L124 -52 L112 -36 L-112 -36 Z', cv || '#5E9E3E') + K.r(-120, -84, 240, 34, cc || '#6B3A22', { rx: 14 }) + K.d('M-122 -90 L122 -90 L96 -64 L70 -82 L40 -62 L6 -84 L-30 -62 L-66 -82 L-98 -64 Z', cq || '#F2B632') + K.d('M-118 -94 C-118 -170 118 -170 118 -94 Z', cp) + K.e(-40, -140, 6, 3.5, '#FBEBC8') + K.e(10, -150, 6, 3.5, '#FBEBC8') + K.e(50, -132, 6, 3.5, '#FBEBC8') + K.e(-74, -120, 6, 3.5, '#FBEBC8') + K.e(-60, -136, 30, 12, '#fff', { op: .16 }), K.T(x, yb, s)); },
    helado: function (K, x, yb, s, cc, c1, c2) { return K.g(K.pg([[-46, -96], [46, -96], [0, 0]], cc) + K.l('M-30 -80 L16 -26 M-6 -96 L30 -54 M30 -80 L-16 -26 M6 -96 L-30 -54', K.osc(cc, .25), 2.5) + K.c(-22, -112, 34, c1) + K.c(22, -112, 34, c2) + K.c(0, -150, 34, K.clr(c1, .2)) + K.c(-12, -162, 9, '#fff', { op: .4 }), K.T(x, yb, s)); },
    copa: function (K, x, yb, s, c, cl) { return K.g(K.e(0, -4, 40, 8, c, { op: .9 }) + K.r(-4, -96, 8, 92, c, { op: .9 }) + K.d('M-46 -220 L46 -220 C46 -150 24 -100 0 -96 C-24 -100 -46 -150 -46 -220 Z', c, { op: .3, st: K.clr(c, .3), sw: 3 }) + K.d('M-42 -180 L42 -180 C38 -136 20 -104 0 -100 C-20 -104 -38 -136 -42 -180 Z', cl) + K.c(-10, -150, 3, '#fff', { op: .7 }) + K.c(8, -132, 2.4, '#fff', { op: .7 }) + K.c(-2, -116, 2, '#fff', { op: .7 }), K.T(x, yb, s)); },
    confeti: function (K, seed, n, x0, y0, w, h, cols) { var R = K.rng(seed || 3), s = ''; for (var i = 0; i < n; i++) { var x = x0 + R() * w, y = y0 + R() * h, c = cols[i % cols.length]; s += R() > .5 ? K.r(x, y, 6 + R() * 8, 4 + R() * 4, c, { tr: 'rotate(' + Math.round(R() * 180) + ' ' + r1(x) + ' ' + r1(y) + ')' }) : K.c(x, y, 2.5 + R() * 4, c); } return s; },
    etiqueta: function (K, x, y, s, a, c, txt, ct) { return K.g(K.d('M0 -44 L150 -44 Q164 -44 164 -30 L164 30 Q164 44 150 44 L0 44 L-46 0 Z', c) + K.c(-14, 0, 9, '#fff') + K.l('M-14 0 C-40 -30 -70 -40 -96 -30', K.osc(c, .3), 3) + (txt ? K.t(72, 16, txt, 44, ct || '#fff', { b: 800, ff: SANS }) : ''), K.T(x, y, s, a)); },
    ticket: function (K, x, y, s, a, c, cl, txt) { return K.g(K.d('M-120 -56 L120 -56 L120 -16 A16 16 0 0 0 120 16 L120 56 L-120 56 L-120 16 A16 16 0 0 0 -120 -16 Z', c) + K.l('M60 -46 L60 46', cl, 2.5, { da: '6 7' }) + K.r(-96, -26, 120, 12, cl, { rx: 4, op: .9 }) + K.r(-96, -4, 84, 9, cl, { rx: 4, op: .55 }) + K.r(-96, 14, 100, 9, cl, { rx: 4, op: .55 }) + (txt ? K.t(90, 10, txt, 26, cl, { b: 800, ff: SANS, tr: 'rotate(-90 90 0)' }) : ''), K.T(x, y, s, a)); },
    pin: function (K, x, y, s, c, ci) { return K.g(K.e(0, 4, 30, 8, '#000', { op: .16 }) + K.d('M0 0 C-14 -30 -52 -58 -52 -100 A52 52 0 0 1 52 -100 C52 -58 14 -30 0 0 Z', c) + K.c(0, -100, 22, ci || '#fff') + K.e(-22, -126, 10, 6, '#fff', { op: .25, tr: 'rotate(-35 -22 -126)' }), K.T(x, y, s)); },
    escudo: function (K, x, y, s, c, cs) { return K.g(K.d('M0 -100 L80 -72 L80 -10 C80 50 40 86 0 104 C-40 86 -80 50 -80 -10 L-80 -72 Z', c) + K.d('M0 -100 L80 -72 L80 -10 C80 50 40 86 0 104 Z', K.osc(c, .12), { op: .6 }) + K.l('M-34 0 L-8 26 L38 -26', cs, 14), K.T(x, y, s)); },
    capsula: function (K, x, y, s, a, c1, c2) { return K.g(K.r(-60, -24, 120, 48, c2, { rx: 24 }) + K.d('M0 -24 L-36 -24 A24 24 0 0 0 -36 24 L0 24 Z', c1) + K.r(-50, -16, 80, 8, '#fff', { op: .3, rx: 4 }), K.T(x, y, s, a)); },
    pesa: function (K, x, y, s, a, c, cb) { return K.g(K.r(-90, -7, 180, 14, cb || K.osc(c, .3), { rx: 6 }) + K.r(-78, -46, 26, 92, c, { rx: 6 }) + K.r(-104, -34, 26, 68, c, { rx: 6 }) + K.r(52, -46, 26, 92, c, { rx: 6 }) + K.r(78, -34, 26, 68, c, { rx: 6 }) + K.r(-74, -40, 6, 70, '#fff', { op: .2, rx: 3 }) + K.r(56, -40, 6, 70, '#fff', { op: .2, rx: 3 }), K.T(x, y, s, a)); },
    diente: function (K, x, y, s, c, cb) { return K.g(K.d('M-60 -60 C-60 -100 -20 -100 0 -84 C20 -100 60 -100 60 -60 C60 -20 46 0 40 40 C36 70 26 86 18 86 C8 86 8 40 0 40 C-8 40 -8 86 -18 86 C-26 86 -36 70 -40 40 C-46 0 -60 -20 -60 -60 Z', c, { st: cb, sw: 3 }) + K.e(-28, -64, 14, 9, '#fff', { op: .7, tr: 'rotate(-30 -28 -64)' }), K.T(x, y, s)); },
    huella: function (K, x, y, s, c) { return K.g(K.e(0, 20, 34, 28, c) + K.e(-38, -18, 13, 17, c, { tr: 'rotate(-20 -38 -18)' }) + K.e(-14, -40, 13, 17, c) + K.e(14, -40, 13, 17, c) + K.e(38, -18, 13, 17, c, { tr: 'rotate(20 38 -18)' }), K.T(x, y, s)); },
    camara: function (K, x, y, s, c, cl, ca) { return K.g(K.r(-110, -64, 220, 140, c, { rx: 16 }) + K.r(-50, -88, 70, 28, c, { rx: 6 }) + K.r(-110, -30, 220, 12, K.osc(c, .2)) + K.c(0, 8, 54, K.osc(c, .35)) + K.c(0, 8, 42, cl) + K.c(0, 8, 28, K.osc(cl, .5)) + K.c(-12, -4, 9, '#fff', { op: .55 }) + K.r(68, -52, 24, 12, ca, { rx: 3 }), K.T(x, y, s)); },
    micro: function (K, x, y, s, c, cm) { var g = ''; for (var i = -2; i <= 2; i++) g += K.l('M' + (i * 11) + ' -118 L' + (i * 11) + ' -34', K.osc(cm, .25), 2, { op: .6 }); return K.g(K.r(-34, -122, 68, 98, cm, { rx: 34 }) + g + K.l('M-50 -70 L-50 -50 Q-50 -6 0 -6 Q50 -6 50 -50 L50 -70', c, 8) + K.r(-5, -6, 10, 56, c) + K.r(-40, 48, 80, 10, c, { rx: 5 }) + K.r(-24, -112, 12, 70, '#fff', { op: .25, rx: 6 }), K.T(x, y, s)); },
    maceta: function (K, x, yb, s, cm, ch) { return K.g(D.hoja(K, 0, -96, 110, -120, ch, K.clr(ch, .4)) + D.hoja(K, 0, -96, 120, -60, K.osc(ch, .12), K.clr(ch, .4)) + D.hoja(K, 0, -96, 90, -90, K.clr(ch, .12), K.clr(ch, .4)) + K.pg([[-56, -96], [56, -96], [44, 0], [-44, 0]], cm) + K.r(-62, -108, 124, 20, K.osc(cm, .12), { rx: 4 }), K.T(x, yb, s)); },
    auriculares: function (K, x, y, s, c, cp) { return K.g(K.l('M-84 10 L-84 -20 A84 84 0 0 1 84 -20 L84 10', c, 16) + K.r(-112, -6, 48, 92, cp, { rx: 20 }) + K.r(64, -6, 48, 92, cp, { rx: 20 }) + K.r(-100, 6, 12, 66, '#fff', { op: .2, rx: 6 }), K.T(x, y, s)); },
    reloj: function (K, x, y, s, c, cf, ca) { return K.g(K.r(-30, -120, 60, 240, K.osc(c, .3), { rx: 14 }) + K.c(0, 0, 72, c) + K.c(0, 0, 60, cf) + K.l('M0 0 L0 -40 M0 0 L28 14', ca, 6) + K.c(0, 0, 6, ca) + K.r(70, -10, 12, 20, c, { rx: 3 }), K.T(x, y, s)); },
    llave: function (K, x, y, s, a, c) { return K.g(K.c(-70, 0, 42, c) + K.c(-70, 0, 16, 'none', { st: K.osc(c, .3), sw: 6 }) + K.r(-34, -10, 150, 20, c, { rx: 6 }) + K.r(80, 10, 16, 26, c, { rx: 3 }) + K.r(104, 10, 12, 18, c, { rx: 3 }) + K.c(-84, -14, 8, '#fff', { op: .35 }), K.T(x, y, s, a)); },
    edificio: function (K, x, yb, w, h, c, cv, pisos) { var s = K.r(x, yb - h, w, h, c) + K.r(x + w * .72, yb - h, w * .28, h, K.osc(c, .12)), n = pisos || Math.floor(h / 40), cols = Math.max(2, Math.floor(w / 40)); for (var j = 0; j < n; j++) for (var i = 0; i < cols; i++) s += K.r(x + 12 + i * (w - 24) / cols, yb - h + 16 + j * (h - 30) / n, (w - 24) / cols - 10, (h - 30) / n - 12, cv, { op: (i + j) % 3 ? .9 : .55 }); return s; },
    sofa: function (K, x, yb, s, c, cc) { return K.g(K.r(-150, -110, 300, 70, K.osc(c, .1), { rx: 22 }) + K.r(-160, -60, 320, 50, c, { rx: 16 }) + K.r(-180, -90, 48, 80, c, { rx: 18 }) + K.r(132, -90, 48, 80, c, { rx: 18 }) + K.r(-140, -104, 120, 56, cc, { rx: 16 }) + K.r(20, -104, 120, 56, K.osc(cc, .08), { rx: 16 }) + K.r(-150, -10, 10, 14, K.osc(c, .4)) + K.r(140, -10, 10, 14, K.osc(c, .4)), K.T(x, yb, s)); },
    lampara: function (K, x, yb, s, c, cl) { return K.g(K.c(0, -230, 90, K.rg(cl, cl, 0), { op: .5 }) + K.e(0, -4, 50, 8, K.osc(c, .3)) + K.r(-4, -200, 8, 196, K.osc(c, .3)) + K.pg([[-60, -200], [60, -200], [36, -280], [-36, -280]], c) + K.pg([[20, -200], [60, -200], [36, -280], [18, -280]], K.osc(c, .12)), K.T(x, yb, s)); },
    nino: function (K, x, yb, s, cpiel, cpelo, cropa) { return K.g(K.r(-30, -96, 60, 74, cropa, { rx: 22 }) + K.r(-24, -26, 18, 26, K.osc(cropa, .3), { rx: 6 }) + K.r(6, -26, 18, 26, K.osc(cropa, .3), { rx: 6 }) + K.c(0, -128, 34, cpiel) + K.d('M-34 -132 C-36 -170 36 -176 34 -132 C24 -150 -10 -156 -34 -132 Z', cpelo) + K.c(-11, -126, 3.5, '#2A2420') + K.c(11, -126, 3.5, '#2A2420') + K.l('M-9 -112 Q0 -104 9 -112', '#2A2420', 2.5) + K.c(-20, -116, 6, '#F28482', { op: .4 }) + K.c(20, -116, 6, '#F28482', { op: .4 }), K.T(x, yb, s)); },
    sello: function (K, x, y, r, c, ct, txt) { var d = ''; for (var i = 0; i <= 48; i++) { var a = i / 48 * 2 * Math.PI, rr = i % 2 ? r * .9 : r; d += (i ? ' L' : 'M') + r1(rr * Math.cos(a)) + ' ' + r1(rr * Math.sin(a)); } return K.g(K.d(d + ' Z', c) + K.c(0, 0, r * .74, 'none', { st: ct, sw: 2, op: .6 }) + (txt ? K.t(0, r * .14, txt, r * .42, ct, { b: 800, ff: SANS }) : ''), K.T(x, y)); },
    base: function (K, p, tipo) {
      if (tipo === 'oscuro') return D.fondo(K, K.mix(p.d, p.b, .25), p.d) + K.c(300, 290, 230, K.rg(p.a, p.a, 0), { op: .22 });
      if (tipo === 'acento') return D.fondo(K, K.clr(p.a, .2), p.a) + K.c(300, 300, 240, '#fff', { op: .12 });
      if (tipo === 'suave') return D.fondo(K, K.clr(p.c, .55), K.clr(p.c, .25)) + K.c(300, 300, 230, '#fff', { op: .3 });
      return D.fondo(K, K.clr(p.f, .3), K.osc(p.f, .05)) + K.c(300, 290, 220, K.mix(p.f, p.a, .16));
    }
  };

  /* ─────────── texto ─────────── */
  function wrap(s, n) { var out = [], cur = ''; String(s).split(/\s+/).forEach(function (w) { if (!w) return; if (!cur) cur = w; else if ((cur + ' ' + w).length <= n) cur += ' ' + w; else { out.push(cur); cur = w; } }); if (cur) out.push(cur); return out.length ? out : ['']; }
  function ajusta(str, w, fs, k, maxL) { var l = []; for (var i = 0; i < 18; i++) { var cpl = Math.max(4, Math.floor(w / (fs * k))); l = wrap(str, cpl); var m = Math.max.apply(null, l.map(function (x) { return x.length; })); if (l.length <= maxL && m <= cpl) break; fs *= .93; } return { l: l, fs: fs }; }
  function ancho(str, fs, k) { return String(str).length * fs * k; }

  function svg(id, fmt, cfg) {
    cfg = cfg || {}; var ad = POR[id] || LISTA[0]; if (!ad) return '';
    var F = FORMATOS[fmt] ? fmt : '1:1', FW = FORMATOS[F].w, FH = FORMATOS[F].h, L = LAY[F];
    var p = EP.PAL[(cfg.pal != null && cfg.pal !== '' ? +cfg.pal : (ad.pal || 0)) % EP.PAL.length], K = EP.kit(p);
    var e = cfg.marco && MARCOS[cfg.marco] ? cfg.marco : (ad.e || 'tarjeta'), pleno = e === 'pleno';
    var FU = EP.FUENTES[cfg.fuente && EP.FUENTES[cfg.fuente] ? cfg.fuente : (ad.f || 'serif')] || EP.FUENTES.serif;
    var sc = ''; try { sc = ad.d(K, p, D, A) || ''; } catch (er) { if (window.console) console.warn('EU_ANUNCIOS', ad.id, er); }
    var tc = pleno ? p.l : (K.lum(p.f) < .5 ? p.l : p.d), out = '';
    var T = pleno ? L.P.T : L.T, C = pleno ? L.P.C : L.C;

    /* fondo y escena */
    if (pleno) {
      var sq = '<rect width="600" height="600"/>';
      out += K.r(0, 0, FW, FH, p.d);
      if (FW > FH) { var ss = FH / 600, ox = FW - FH; out += K.g(K.clip(sc, sq), 'translate(' + ox + ' 0) scale(' + r1(ss * 1000) / 1000 + ')') + K.r(ox - 2, 0, 420, FH, K.lg(p.d, p.d, 'h', 0)) + K.r(0, 0, FW, FH, K.lg(p.d, p.d, 'h', 0), { op: .0 }) + K.r(0, 0, FW * .62, FH, K.lg(p.d, p.d, 'h', 0), { op: .55 }); }
      else { var s2 = FW / 600, oy = FH - FW; out += K.g(K.clip(sc, sq), 'translate(0 ' + oy + ') scale(' + r1(s2 * 1000) / 1000 + ')') + K.r(0, oy - 2, FW, 380, K.lg(p.d, p.d, 'v', 0)) + K.r(0, 0, FW, T[1] + T[3] + 160, K.lg(p.d, p.d, 'v', 0), { op: .55 }) + K.r(0, FH - 420, FW, 420, K.lg(p.d, p.d, 'u', 0), { op: .9 }); }
    } else {
      var S = L.S, sx = S[0], sy = S[1], sz = S[2], k = sz / 600, cx = sx + sz / 2, cy = sy + sz / 2;
      out += K.r(0, 0, FW, FH, p.f) + K.c(cx + sz * .08, cy - sz * .04, sz * .66, K.mix(p.f, p.a, .13));
      out += D.puntos(K, sx - 44, sy - 44, 7, 7, 22, 3.2, tc, .22);
      var shape = e === 'circulo' ? '<circle cx="300" cy="300" r="300"/>' : e === 'arco' ? '<path d="M0 600 L0 300 A300 300 0 0 1 600 300 L600 600 Z"/>' : '<rect width="600" height="600" rx="40"/>';
      var sh = K.sombra(18 / k, 22 / k, .3), base = e === 'circulo' ? K.c(300, 300, 300, p.d, { fl: sh }) : e === 'arco' ? K.d('M0 600 L0 300 A300 300 0 0 1 600 300 L600 600 Z', p.d, { fl: sh }) : K.r(0, 0, 600, 600, p.d, { rx: 40, fl: sh });
      var borde = e === 'circulo' ? K.c(300, 300, 322, 'none', { st: p.a, sw: 2.4 / k * 1.2 }) + K.c(300, 300, 340, 'none', { st: p.a, sw: 1.2 / k, op: .5 }) : e === 'arco' ? K.l('M-22 622 L-22 300 A322 322 0 0 1 622 300 L622 622', p.a, 2.4 / k * 1.2) : K.r(22, 22, 600, 600, 'none', { st: p.a, sw: 2.6 / k * 1.1, rx: 40 });
      out += K.g(borde + base + K.clip(sc, shape), 'translate(' + sx + ' ' + sy + ') scale(' + r1(k * 1000) / 1000 + ')');
    }

    /* textos */
    var marca = String(cfg.marca != null ? cfg.marca : (ad.marca || '')), tit = String(cfg.titular != null ? cfg.titular : (ad.t || '')), sub = String(cfg.sub != null ? cfg.sub : (ad.s || ''));
    var cta = String(cfg.cta != null ? cfg.cta : (ad.cta || '')), dato = String(cfg.dato != null ? cfg.dato : (ad.dato || ''));
    var of = cfg.sinOferta ? '' : String(cfg.oferta != null ? cfg.oferta : (ad.o || '')), ol = String(cfg.ofertaTxt != null ? cfg.ofertaTxt : (ad.ol || ''));
    if (FU.up) tit = tit.toUpperCase();
    var x = T[0], y = T[1], w = T[2], h = T[3], kfs = L.kfs, fs = L.fs, sfs = L.sfs, kk = ({ serif: .57, elegante: .8, sans: .62, cond: .7 })[cfg.fuente && EP.FUENTES[cfg.fuente] ? cfg.fuente : (ad.f || 'serif')] || .6, sk = .5, A1, A2, alto;
    for (var it = 0; it < 16; it++) {
      A1 = ajusta(tit, w, fs, kk, F === '1:1' && !pleno ? 5 : 4); A2 = sub ? ajusta(sub, w, sfs, sk, 3) : { l: [], fs: sfs };
      alto = (marca ? kfs * 2.6 : 0) + A1.l.length * A1.fs * 1.03 + (A2.l.length ? 34 + A2.l.length * A2.fs * 1.32 : 0);
      if (alto <= h) break; fs *= .93; sfs *= .97;
    }
    if (marca) { out += K.r(x, y + kfs * .2, 40, 4, p.a) + K.t(x + 56, y + kfs * .62, marca.toUpperCase(), kfs, tc, { ff: SANS, a: 'start', b: 700, ls: r1(kfs * .16), op: .9 }); y += kfs * 2.6; }
    var hf = A1.fs, oT = { ff: FU.f, a: 'start', b: FU.w, ls: FU.ls ? r1(FU.ls * hf) : null };
    A1.l.forEach(function (l, i) { out += K.t(x, y + hf * .84 + i * hf * 1.03, l, hf, tc, oT); });
    y += A1.l.length * hf * 1.03;
    if (A2.l.length) { var serifSub = FU.f.indexOf('Georgia') >= 0; A2.l.forEach(function (l, i) { out += K.t(x, y + 34 + A2.fs * .9 + i * A2.fs * 1.32, l, A2.fs, tc, { ff: serifSub ? FU.f : SANS, a: 'start', it: serifSub, op: .86, b: serifSub ? null : 400 }); }); }

    /* botón y dato */
    var ch = L.ch, cfs = L.cfs, ctaTxt = cta ? cta.toUpperCase() + '  →' : '', cw = ctaTxt ? ancho(ctaTxt, cfs, .66) + ch * .9 : 0, ctc = K.lum(p.a) < .55 ? '#ffffff' : p.d, rad = ad.f === 'cond' ? 6 : ch / 2;
    if (ctaTxt) out += K.r(C[0], C[1], cw, ch, p.a, { rx: rad }) + K.t(C[0] + cw / 2, C[1] + ch / 2 + cfs * .36, ctaTxt, cfs, ctc, { ff: SANS, b: 800, ls: r1(cfs * .08) });
    if (dato) {
      var dfs = cfs * .86, dw = ancho(dato, dfs, .56), lado = C[0] + cw + 44 + dw <= FW - 72;
      var dx = lado ? C[0] + cw + (ctaTxt ? 40 : 0) : C[0], dy = lado ? C[1] + ch / 2 + dfs * .36 : C[1] + ch + dfs * 1.8;
      if (!lado && dy > FH - 30) dy = C[1] - dfs * 1.2;
      out += K.t(dx, dy, dato, dfs, tc, { ff: SANS, a: 'start', b: 600, op: .85 });
    }

    /* sello de oferta */
    if (of) {
      var R = L.R, bx, by;
      if (pleno) { bx = L.P.B[0]; by = L.P.B[1]; } else { bx = Math.min(L.S[0] + L.S[2] - R * .75, FW - R - 24); by = Math.min(L.S[1] + L.S[2] - R * .45, FH - R - 24); }
      var btc = K.lum(p.a) < .55 ? '#ffffff' : p.d, ofs = R * (of.length <= 3 ? .62 : of.length <= 5 ? .5 : of.length <= 7 ? .38 : .3), olL = ol ? wrap(ol, 12).slice(0, 2) : [];
      var g = K.c(0, 0, R + 10, p.a, { op: .25 }) + K.c(0, 0, R, p.a, { fl: K.sombra(10, 12, .25) }) + K.c(0, 0, R * .86, 'none', { st: btc, sw: 2, op: .5 }) + K.t(0, (olL.length ? -R * .04 : ofs * .36), of, ofs, btc, { ff: SANS, b: 800 });
      olL.forEach(function (l, i) { g += K.t(0, R * .3 + i * R * .2, l.toUpperCase(), R * .14, btc, { ff: SANS, b: 700, ls: r1(R * .02) }); });
      out += K.g(g, 'translate(' + r1(bx) + ' ' + r1(by) + ') rotate(-8)');
    }

    /* grano */
    var gid = K.uid(), gs = '', GR = K.rng(11); for (var i = 0; i < 46; i++) gs += '<circle cx="' + r1(GR() * 64) + '" cy="' + r1(GR() * 64) + '" r="' + r1(.35 + GR() * .6) + '" fill="' + (i % 2 ? '#000' : '#fff') + '"/>';
    K.def('<pattern id="' + gid + '" width="64" height="64" patternUnits="userSpaceOnUse">' + gs + '</pattern>');
    out += K.r(0, 0, FW, FH, 'url(#' + gid + ')', { op: .07 });

    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + FW + ' ' + FH + '" width="' + FW + '" height="' + FH + '" style="width:100%;height:auto;display:block" data-anuncio="' + ad.id + '" data-formato="' + F + '"><defs>' + K.defs() + '</defs>' + K.clip(out, '<rect width="' + FW + '" height="' + FH + '"/>') + '</svg>';
  }

  /* ─────────── exportación ─────────── */
  function bajar(blob, nombre) { var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nombre; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 800); }
  function lienzo(s, esc) { return new Promise(function (ok, mal) { var m = /viewBox="0 0 (\d+) (\d+)"/.exec(s), w = Math.round(+m[1] * (esc || 1)), h = Math.round(+m[2] * (esc || 1)); var t = s.replace(/width="\d+" height="\d+" style="[^"]*"/, 'width="' + w + '" height="' + h + '"'); var img = new Image(); img.onload = function () { var cv = document.createElement('canvas'); cv.width = w; cv.height = h; var cx = cv.getContext('2d'); cx.fillStyle = '#fff'; cx.fillRect(0, 0, w, h); cx.drawImage(img, 0, 0, w, h); ok(cv); }; img.onerror = mal; img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(t); }); }
  function aBlob(cv, tipo, q) { return new Promise(function (ok) { cv.toBlob(ok, tipo || 'image/png', q); }); }
  function nombre(id, fmt) { return 'anuncio-' + id + '-' + String(fmt).replace(':', 'x'); }

  window.EU_ANUNCIOS = {
    A: A, FORMATOS: FORMATOS, LAY: LAY, CATS: CATS, MARCOS: MARCOS, PAL: EP.PAL, FUENTES: EP.FUENTES,
    agregar: function (l) { l.forEach(function (c) { if (POR[c.id]) return; POR[c.id] = c; LISTA.push(c); }); },
    lista: function (cat) { return cat ? LISTA.filter(function (c) { return c.cat === cat; }) : LISTA.slice(); },
    anuncio: function (id) { return POR[id] || null; },
    svg: svg, lienzo: lienzo, nombre: nombre,
    descargarSVG: function (id, fmt, cfg) { bajar(new Blob([svg(id, fmt, cfg)], { type: 'image/svg+xml' }), nombre(id, fmt) + '.svg'); },
    descargarPNG: function (id, fmt, cfg, esc) { return lienzo(svg(id, fmt, cfg), esc || 1).then(function (cv) { return aBlob(cv); }).then(function (b) { bajar(b, nombre(id, fmt) + '.png'); }); },
    descargarJPG: function (id, fmt, cfg) { return lienzo(svg(id, fmt, cfg), 1).then(function (cv) { return aBlob(cv, 'image/jpeg', .93); }).then(function (b) { bajar(b, nombre(id, fmt) + '.jpg'); }); },
    descargarPDF: function (id, fmt, cfg) { return lienzo(svg(id, fmt, cfg), 2).then(function (cv) { var J = window.jspdf && window.jspdf.jsPDF; if (!J) throw new Error('jsPDF no está cargado'); var mm = FORMATOS[fmt].mm, doc = new J({ unit: 'mm', format: mm, orientation: mm[0] > mm[1] ? 'l' : 'p' }); doc.addImage(cv.toDataURL('image/jpeg', .94), 'JPEG', 0, 0, mm[0], mm[1]); doc.save(nombre(id, fmt) + '.pdf'); }); },
    /* ZIP: lista de [id, cfg] × formatos, en PNG + SVG. aviso(n, total) informa del avance. */
    zip: function (items, fmts, nom, aviso) {
      if (!window.JSZip) return Promise.reject(new Error('El ZIP necesita conexión la primera vez.'));
      var z = new window.JSZip(), tareas = [];
      items.forEach(function (it) { (fmts || Object.keys(FORMATOS)).forEach(function (f) { tareas.push([it[0], f, it[1]]); }); });
      var n = 0, cadena = Promise.resolve();
      tareas.forEach(function (t) { cadena = cadena.then(function () { var s = svg(t[0], t[1], t[2]), carpeta = String(t[1]).replace(':', 'x'); z.file(carpeta + '/' + nombre(t[0], t[1]) + '.svg', s); return lienzo(s, 1).then(aBlob).then(function (b) { z.file(carpeta + '/' + nombre(t[0], t[1]) + '.png', b); n++; if (aviso) aviso(n, tareas.length); }); }); });
      return cadena.then(function () { return z.generateAsync({ type: 'blob' }); }).then(function (b) { bajar(b, (nom || 'anuncios') + '.zip'); });
    }
  };
})();
