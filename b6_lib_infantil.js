/* b6_lib_infantil.js — Infantil: modelos 1–23 de 50 (primera entrega). Materia `infantil`. Prefijo `if_`.
   Cargar después de b6_modelos.js. Expone window.EU_INF_K (animales y escenario) que usa b6_lib_infantil2.js.
   No repite esc_*, inf_contar, val_emociones, tie_estaciones, tie_volcan, gm_regla ni geo_simetria.
   Familias: sabana, selva, granja (este archivo); mar, bosque y frío, bichitos, aprendo con animales (b6_lib_infantil2.js). */
(function () {
  'use strict';
  var MO = window.EU_MODELOS; if (!MO || MO.modelo('if_leon')) return;
  var P = { tinta: '#2A2420', blanco: '#FFFFFF', crema: '#FBEFD8', rosa: '#F6B8C0', rosaC: '#FAD4DA', mej: '#F49AA6', cesped: '#C6E4A0', cespedO: '#6FA84A', hoja: '#7CC06A', agua: '#B4DDF2', aguaO: '#4F9CC8', arena: '#F2DDA4', sol: '#FFD24A', naranja: '#F4A04A', rojo: '#E8645A', amarillo: '#FFE07A', verde: '#8CCB6E', azul: '#8EC0EC', morado: '#C8A8E8', marron: '#B07A4E', marronO: '#7A4E2E', gris: '#B8B8C0', negro: '#3A3634', madera: '#C89A62', barro: '#A88058' };
  var FAM = { sab: 'La sabana', sel: 'La selva', gra: 'La granja', mar: 'El mar', bos: 'El bosque y el frío', bic: 'Bichitos del jardín', apr: 'Aprendo con animales' };
  function N(v) { return Math.round(v * 10) / 10; }
  function XY(x, y, e) { return [function (v) { return N(x + v * e); }, function (v) { return N(y + v * e); }]; }
  function ojos(K, x, y, sep, r) { return [x - sep, x + sep].map(function (cx) { return K.c(N(cx), y, r, P.tinta, { negro: 1, w: .3 }) + K.c(N(cx + r * .35), N(y - r * .4), N(r * .4), P.blanco, { sin: 1 }); }).join(''); }
  function boca(K, x, y, w) { return K.l('M' + N(x - w) + ' ' + N(y) + ' Q' + N(x) + ' ' + N(y + w) + ' ' + N(x + w) + ' ' + N(y), P.tinta, { w: .8 }); }
  function mej(K, x, y, sep, r) { return K.linea ? '' : K.e(N(x - sep), y, r, N(r * .6), P.mej, { sin: 1, op: .75 }) + K.e(N(x + sep), y, r, N(r * .6), P.mej, { sin: 1, op: .75 }); }
  function bigotes(K, X, Y) { return K.l('M' + X(-4) + ' ' + Y(-24.5) + ' L' + X(-11) + ' ' + Y(-26) + ' M' + X(-4) + ' ' + Y(-23.5) + ' L' + X(-11) + ' ' + Y(-22.5) + ' M' + X(4) + ' ' + Y(-24.5) + ' L' + X(11) + ' ' + Y(-26) + ' M' + X(4) + ' ' + Y(-23.5) + ' L' + X(11) + ' ' + Y(-22.5), P.tinta, { w: .5 }); }

  /* cuadrúpedo «chibi»: (x, y) = punto entre las patas en el suelo; alto ≈ 45·e */
  function bicho(K, x, y, e, o) {
    e = e || 1; var q = XY(x, y, e), X = q[0], Y = q[1], c = o.c, c2 = o.c2 || P.crema, oc = o.oc || c, s = '';
    if (o.antes) s += o.antes(K, X, Y, e);
    var co = o.cola;
    if (co === 'larga' || co === 'fina') s += K.l('M' + X(9) + ' ' + Y(-8) + ' Q' + X(24) + ' ' + Y(-8) + ' ' + X(21) + ' ' + Y(-24), co === 'fina' ? (o.colaC || P.rosa) : K.oscuro(c, .1), { w: N((co === 'fina' ? 1 : 2.2) * e) }) + (o.cc ? K.c(X(21), Y(-25), N(3.2 * e), o.cc, { w: .7 }) : '');
    if (co === 'bola') s += K.c(X(11), Y(-8), N(4 * e), o.cc || c2, { w: .7 });
    if (co === 'rizo') s += K.l('M' + X(11) + ' ' + Y(-10) + ' q' + N(5 * e) + ' ' + N(-1 * e) + ' ' + N(4 * e) + ' ' + N(-5 * e) + ' q' + N(-2 * e) + ' ' + N(-2 * e) + ' ' + N(-3 * e) + ' ' + N(1 * e), K.oscuro(c, .2), { w: N(1.2 * e) });
    if (co === 'zorro') s += K.p('M' + X(8) + ' ' + Y(-6) + ' Q' + X(28) + ' ' + Y(-2) + ' ' + X(26) + ' ' + Y(-24) + ' Q' + X(20) + ' ' + Y(-12) + ' ' + X(8) + ' ' + Y(-12) + ' Z', c, { w: .8 }) + K.p('M' + X(26) + ' ' + Y(-24) + ' Q' + X(27) + ' ' + Y(-16) + ' ' + X(22) + ' ' + Y(-12) + ' Q' + X(22) + ' ' + Y(-19) + ' ' + X(26) + ' ' + Y(-24) + ' Z', P.blanco, { w: .5 });
    if (co === 'ardilla') s += K.p('M' + X(8) + ' ' + Y(-5) + ' C' + X(28) + ' ' + Y(-4) + ' ' + X(30) + ' ' + Y(-38) + ' ' + X(14) + ' ' + Y(-40) + ' C' + X(22) + ' ' + Y(-28) + ' ' + X(18) + ' ' + Y(-15) + ' ' + X(8) + ' ' + Y(-14) + ' Z', c, { w: .8 });
    if (co === 'mono') s += K.l('M' + X(9) + ' ' + Y(-6) + ' Q' + X(26) + ' ' + Y(-4) + ' ' + X(24) + ' ' + Y(-20) + ' Q' + X(22) + ' ' + Y(-28) + ' ' + X(17) + ' ' + Y(-24), K.oscuro(c, .1), { w: N(1.8 * e) });
    s += K.e(X(0), Y(-10), N(12 * e), N(10 * e), c, { w: .9 }) + (o.panza === 0 ? '' : K.e(X(0), Y(-8.5), N(7 * e), N(6.5 * e), c2, { w: .5 }));
    if (o.sobreCuerpo) s += o.sobreCuerpo(K, X, Y, e);
    s += K.e(X(-10.5), Y(-11), N(3.2 * e), N(5.2 * e), o.bc || c, { w: .6 }) + K.e(X(10.5), Y(-11), N(3.2 * e), N(5.2 * e), o.bc || c, { w: .6 });
    s += K.e(X(-6), Y(-1.8), N(4.6 * e), N(2.6 * e), o.pc || K.oscuro(c, .08), { w: .7 }) + K.e(X(6), Y(-1.8), N(4.6 * e), N(2.6 * e), o.pc || K.oscuro(c, .08), { w: .7 });
    var or = o.orejas, ear = function (sx) {
      if (or === 'red') return K.c(X(8 * sx), Y(-37), N(4.6 * e), oc, { w: .8 }) + K.c(X(8 * sx), Y(-37), N(2.4 * e), o.ic || c2, { w: .4 });
      if (or === 'grande') return K.c(X(10 * sx), Y(-36), N(6.5 * e), oc, { w: .8 }) + K.c(X(10 * sx), Y(-36), N(4 * e), o.ic || P.rosaC, { w: .4 });
      if (or === 'pun') return K.pl([[X(10.5 * sx), Y(-31)], [X(9.5 * sx), Y(-44)], [X(2.5 * sx), Y(-37.5)]], oc, { w: .8 }) + K.pl([[X(9 * sx), Y(-34)], [X(8.6 * sx), Y(-41)], [X(4.6 * sx), Y(-37.5)]], o.ic || P.rosaC, { w: .4 });
      if (or === 'lar') return K.e(X(4.8 * sx), Y(-46), N(3.4 * e), N(9.5 * e), oc, { w: .8 }) + K.e(X(4.8 * sx), Y(-45), N(1.6 * e), N(6.6 * e), P.rosaC, { w: .4 });
      if (or === 'ele') return K.c(X(13 * sx), Y(-28), N(9.5 * e), oc, { w: .9 }) + K.c(X(13.5 * sx), Y(-28), N(6.2 * e), P.rosaC, { w: .4 });
      if (or === 'vac') return K.e(X(13 * sx), Y(-33), N(5.6 * e), N(2.6 * e), oc, { w: .7 });
      if (or === 'mini') return K.c(X(7 * sx), Y(-38), N(2.8 * e), oc, { w: .7 });
      if (or === 'mono') return K.c(X(11.5 * sx), Y(-28), N(4.4 * e), oc, { w: .8 }) + K.c(X(11.5 * sx), Y(-28), N(2.4 * e), c2, { w: .4 });
      return '';
    };
    s += ear(-1) + ear(1);
    if (o.melena) for (var i = 0; i < 12; i++) { var a = i * Math.PI / 6; s += K.c(N(X(0) + Math.cos(a) * 13 * e), N(Y(-28) + Math.sin(a) * 13 * e), N(5.6 * e), o.melena, { w: .7 }); }
    s += K.c(X(0), Y(-28), N(11 * e), o.cab || c, { w: .9 });
    if (or === 'cai') s += K.e(X(-11), Y(-27), N(3.6 * e), N(7.6 * e), oc, { w: .8 }) + K.e(X(11), Y(-27), N(3.6 * e), N(7.6 * e), oc, { w: .8 });
    if (o.sobreCab) s += o.sobreCab(K, X, Y, e);
    if (o.hocico !== 0) s += K.e(X(0), Y(-23.5), N((o.anchoH || 5.6) * e), N(4.2 * e), o.hc || c2, { w: .5 });
    s += ojos(K, X(0), Y(-30), N(4.3 * e), N((o.ro || 1.7) * e));
    var na = o.nariz;
    if (na === 'cerdo') s += K.e(X(0), Y(-25), N(3.6 * e), N(2.6 * e), K.oscuro(c, .12), { w: .6 }) + K.c(X(-1.2), Y(-25), N(.6 * e), P.tinta, { negro: 1, w: .2 }) + K.c(X(1.2), Y(-25), N(.6 * e), P.tinta, { negro: 1, w: .2 });
    else if (na === 'koala') s += K.e(X(0), Y(-25.5), N(2.8 * e), N(3.6 * e), P.negro, { negro: 1, w: .3 });
    else if (na !== 'no') s += K.e(X(0), Y(-25.8), N(1.9 * e), N(1.3 * e), o.nc || P.negro, { negro: 1, w: .3 });
    if (o.boca !== 0) s += boca(K, X(0), Y(o.bocaY || -23), N(1.9 * e));
    s += mej(K, X(0), Y(-24.5), N(7.6 * e), N(1.9 * e));
    if (o.final) s += o.final(K, X, Y, e);
    return s;
  }
  var A = {
    leon: { c: '#F4C46A', c2: '#FCE7BC', orejas: 'red', oc: '#E9A64A', cola: 'larga', cc: '#B8662A', melena: '#C8742E' },
    leona: { c: '#F4C46A', c2: '#FCE7BC', orejas: 'red', oc: '#E9A64A', cola: 'larga', cc: '#C8742E' },
    tigre: { c: '#F5A04C', c2: '#FFF4E4', orejas: 'red', ic: '#FFF4E4', cola: 'larga', cc: '#3A3634', final: bigotes,
      sobreCuerpo: function (K, X, Y, e) { var s = ''; [-1, 1].forEach(function (sx) { s += K.l('M' + X(11.8 * sx) + ' ' + Y(-14) + ' L' + X(7.5 * sx) + ' ' + Y(-13) + ' M' + X(11.8 * sx) + ' ' + Y(-7) + ' L' + X(8 * sx) + ' ' + Y(-6.5), P.negro, { w: N(1.3 * e) }); }); return s; },
      sobreCab: function (K, X, Y, e) { return K.l('M' + X(0) + ' ' + Y(-38.5) + ' L' + X(0) + ' ' + Y(-34.5) + ' M' + X(-3.5) + ' ' + Y(-38) + ' L' + X(-2.6) + ' ' + Y(-35) + ' M' + X(3.5) + ' ' + Y(-38) + ' L' + X(2.6) + ' ' + Y(-35) + ' M' + X(-11) + ' ' + Y(-28) + ' L' + X(-8) + ' ' + Y(-27.5) + ' M' + X(11) + ' ' + Y(-28) + ' L' + X(8) + ' ' + Y(-27.5), P.negro, { w: N(1.2 * e) }); } },
    oso: { c: '#B07A4E', c2: '#E8C9A4', orejas: 'red', cola: 'bola', cc: '#B07A4E' },
    osoPolar: { c: '#F4F6F8', c2: '#FFFFFF', orejas: 'red', ic: '#E4E8EC', cola: 'bola', cc: '#F4F6F8' },
    panda: { c: '#FFFFFF', c2: '#FFFFFF', panza: 0, orejas: 'red', oc: '#3A3634', ic: '#3A3634', bc: '#3A3634', pc: '#3A3634', ro: 1.3,
      sobreCab: function (K, X, Y, e) { return [-1, 1].map(function (sx) { return K.e(X(4.4 * sx), Y(-29.5), N(3.2 * e), N(4 * e), P.negro, { negro: 1, w: .3 }) + K.c(X(4.3 * sx), Y(-30), N(1.9 * e), P.blanco, { sin: 1 }); }).join(''); } },
    koala: { c: '#AEB0B8', c2: '#E8E6EC', orejas: 'grande', ic: '#F2F0F4', nariz: 'koala', hocico: 0 },
    mono: { c: '#9A6A44', c2: '#F2D2AA', orejas: 'mono', cola: 'mono', hocico: 0,
      sobreCab: function (K, X, Y) { return K.p('M' + X(0) + ' ' + Y(-33) + ' C' + X(-3) + ' ' + Y(-37) + ' ' + X(-9) + ' ' + Y(-34) + ' ' + X(-8) + ' ' + Y(-28) + ' C' + X(-8) + ' ' + Y(-21) + ' ' + X(-3) + ' ' + Y(-19) + ' ' + X(0) + ' ' + Y(-19) + ' C' + X(3) + ' ' + Y(-19) + ' ' + X(8) + ' ' + Y(-21) + ' ' + X(8) + ' ' + Y(-28) + ' C' + X(9) + ' ' + Y(-34) + ' ' + X(3) + ' ' + Y(-37) + ' ' + X(0) + ' ' + Y(-33) + ' Z', '#F2D2AA', { w: .5 }); } },
    gato: { c: '#F4B46C', c2: '#FFF1DC', orejas: 'pun', cola: 'larga', hocico: 0, final: bigotes,
      sobreCab: function (K, X, Y, e) { return K.l('M' + X(-2.5) + ' ' + Y(-38.5) + ' L' + X(-2) + ' ' + Y(-35) + ' M' + X(2.5) + ' ' + Y(-38.5) + ' L' + X(2) + ' ' + Y(-35), '#D88A3A', { w: N(1.2 * e) }); } },
    perro: { c: '#EAD4B2', c2: '#FFF6E8', orejas: 'cai', oc: '#A0704A', cola: 'bola', cc: '#EAD4B2',
      sobreCab: function (K, X, Y, e) { return K.e(X(4.6), Y(-31), N(3.6 * e), N(3.2 * e), '#C89A6A', { w: .3 }); } },
    conejo: { c: '#EEEAE4', c2: '#FFFFFF', orejas: 'lar', cola: 'bola', cc: '#FFFFFF', hocico: 0, nc: '#F49AA6', final: bigotes },
    cerdo: { c: '#F7BCC4', c2: '#FAD4DA', orejas: 'pun', ic: '#F49AA6', cola: 'rizo', nariz: 'cerdo', hocico: 0, bocaY: -20.8 },
    vaca: { c: '#FFFFFF', c2: '#FFFFFF', panza: 0, orejas: 'vac', cola: 'larga', cc: '#3A3634', hc: '#F7BCC4', anchoH: 7, nariz: 'no', bocaY: -21.6,
      antes: function (K, X, Y) { return K.p('M' + X(-5) + ' ' + Y(-37) + ' Q' + X(-9) + ' ' + Y(-41) + ' ' + X(-8) + ' ' + Y(-45) + ' Q' + X(-4) + ' ' + Y(-42) + ' ' + X(-2) + ' ' + Y(-38) + ' Z', '#F2E6C8', { w: .6 }) + K.p('M' + X(5) + ' ' + Y(-37) + ' Q' + X(9) + ' ' + Y(-41) + ' ' + X(8) + ' ' + Y(-45) + ' Q' + X(4) + ' ' + Y(-42) + ' ' + X(2) + ' ' + Y(-38) + ' Z', '#F2E6C8', { w: .6 }); },
      sobreCuerpo: function (K, X, Y, e) { return K.e(X(-5), Y(-14), N(4 * e), N(3 * e), P.negro, { negro: 1, w: .3 }) + K.e(X(6), Y(-7), N(3.2 * e), N(2.5 * e), P.negro, { negro: 1, w: .3 }) + K.e(X(4), Y(-16), N(1.8 * e), N(1.4 * e), P.negro, { negro: 1, w: .3 }); },
      sobreCab: function (K, X, Y, e) { return K.e(X(-5.5), Y(-33), N(3.6 * e), N(3.2 * e), P.negro, { negro: 1, w: .3 }); },
      final: function (K, X, Y, e) { return K.c(X(-2.6), Y(-24.4), N(.8 * e), '#C8707A', { negro: 1, w: .2 }) + K.c(X(2.6), Y(-24.4), N(.8 * e), '#C8707A', { negro: 1, w: .2 }); } },
    oveja: { c: '#FBF8F2', c2: '#FBF8F2', panza: 0, cab: '#F2D9C0', orejas: 'vac', oc: '#E8C8A8', hocico: 0, cola: 'bola', cc: '#FBF8F2', pc: '#5A4A44',
      sobreCuerpo: function (K, X, Y, e) { var s = ''; for (var i = 0; i < 12; i++) { var a = i * Math.PI / 6; s += K.c(N(X(0) + Math.cos(a) * 10.5 * e), N(Y(-10) + Math.sin(a) * 8.5 * e), N(3.8 * e), '#FBF8F2', { w: .6 }); } return s + K.e(X(0), Y(-10), N(10 * e), N(8 * e), '#FBF8F2', { sin: 1 }); },
      sobreCab: function (K, X, Y, e) { return K.c(X(-4.5), Y(-37.5), N(3.8 * e), '#FBF8F2', { w: .6 }) + K.c(X(4.5), Y(-37.5), N(3.8 * e), '#FBF8F2', { w: .6 }) + K.c(X(0), Y(-39), N(3.8 * e), '#FBF8F2', { w: .6 }); } },
    zorro: { c: '#EE8A3E', c2: '#FFFFFF', orejas: 'pun', ic: '#3A3634', cola: 'zorro', hocico: 0, pc: '#3A3634',
      sobreCab: function (K, X, Y) { return K.p('M' + X(-10.5) + ' ' + Y(-27) + ' Q' + X(-5) + ' ' + Y(-28) + ' ' + X(0) + ' ' + Y(-25) + ' Q' + X(5) + ' ' + Y(-28) + ' ' + X(10.5) + ' ' + Y(-27) + ' Q' + X(8) + ' ' + Y(-18) + ' ' + X(0) + ' ' + Y(-17.2) + ' Q' + X(-8) + ' ' + Y(-18) + ' ' + X(-10.5) + ' ' + Y(-27) + ' Z', '#FFFFFF', { w: .4 }); } },
    raton: { c: '#BDB8B4', c2: '#EEE8E4', orejas: 'grande', cola: 'fina', hocico: 0, nc: '#F49AA6', final: bigotes },
    elefante: { c: '#AAB6C8', c2: '#C8D2E0', orejas: 'ele', hocico: 0, nariz: 'no', boca: 0, cola: 'fina', colaC: '#7A8698',
      final: function (K, X, Y) { return K.p('M' + X(-3) + ' ' + Y(-26) + ' C' + X(-3.5) + ' ' + Y(-18) + ' ' + X(-1) + ' ' + Y(-14) + ' ' + X(4) + ' ' + Y(-15) + ' L' + X(4.5) + ' ' + Y(-18) + ' C' + X(1.5) + ' ' + Y(-18) + ' ' + X(3) + ' ' + Y(-22) + ' ' + X(3) + ' ' + Y(-26) + ' Z', '#AAB6C8', { w: .8 }); } },
    hipo: { c: '#B8A2CC', c2: '#D8C8E4', orejas: 'mini', anchoH: 8.5, nariz: 'no', bocaY: -21.4,
      final: function (K, X, Y, e) { return K.e(X(-3), Y(-25), N(1 * e), N(.7 * e), P.negro, { negro: 1, w: .2 }) + K.e(X(3), Y(-25), N(1 * e), N(.7 * e), P.negro, { negro: 1, w: .2 }); } },
    cebra: { c: '#FFFFFF', c2: '#FFFFFF', panza: 0, orejas: 'pun', ic: '#3A3634', cola: 'larga', cc: '#3A3634', hc: '#8A8488', nariz: 'no',
      antes: function (K, X, Y, e) { return K.r(X(-2.2), Y(-42.5), N(4.4 * e), N(8 * e), 1.5, P.negro, { negro: 1, w: .3 }); },
      sobreCuerpo: function (K, X, Y, e) { var s = ''; [[-8, 7.4], [-4, 9.4], [0, 10], [4, 9.4], [8, 7.4]].forEach(function (p) { s += K.l('M' + X(p[0]) + ' ' + Y(-10 - p[1] + .6) + ' Q' + X(p[0] + 1.5) + ' ' + Y(-10) + ' ' + X(p[0]) + ' ' + Y(-10 + p[1] - .6), P.negro, { w: N(1.5 * e) }); }); return s; },
      sobreCab: function (K, X, Y, e) { return K.l('M' + X(-3) + ' ' + Y(-38.5) + ' L' + X(-2) + ' ' + Y(-34) + ' M' + X(3) + ' ' + Y(-38.5) + ' L' + X(2) + ' ' + Y(-34) + ' M' + X(-10.6) + ' ' + Y(-30) + ' L' + X(-8) + ' ' + Y(-29) + ' M' + X(10.6) + ' ' + Y(-30) + ' L' + X(8) + ' ' + Y(-29), P.negro, { w: N(1.4 * e) }); } },
    ardilla: { c: '#C97A3C', c2: '#F6DDB8', orejas: 'pun', cola: 'ardilla', hocico: 0 },
    erizo: { c: '#EAD2B0', c2: '#F8EBD8', orejas: 'mini', oc: '#C8A880', hocico: 0, cola: 0,
      antes: function (K, X, Y, e) { var pts = []; for (var i = 0; i < 26; i++) { var a = Math.PI * (i / 25) - Math.PI, r = (i % 2 ? 23 : 15) * e; pts.push([N(X(0) + Math.cos(a) * r * 1.05), N(Y(-16) + Math.sin(a) * r)]); } pts.push([X(19), Y(-2)], [X(-19), Y(-2)]); return K.pl(pts, '#8A5A3A', { w: .7 }); } }
  };
  function animal(K, n, x, y, e, ex) { var o = {}, k; for (k in A[n]) o[k] = A[n][k]; if (ex) for (k in ex) o[k] = ex[k]; return bicho(K, x, y, e, o); }

  /* aves: (x, y) = pies en el suelo; alto ≈ 28·e */
  var AV = {
    loro: { c: '#5CBF5A', c2: '#F4E06A', ac: '#E8574A', pc: '#F4E8C8', pico: 'curvo', cola: '#3A8AD8' },
    tucan: { c: '#3A3634', c2: '#FFE07A', ac: '#2E2A28', pc: '#F4A04A', pico: 'tucan', cara: 1 },
    buho: { c: '#B08458', c2: '#F2DDBA', ac: '#8A6440', pc: '#F4A04A', buho: 1 },
    pollito: { c: '#FFE07A', c2: '#FFF0B0', ac: '#F8D050', pc: '#F4A04A', cresta: 'pollo' },
    gallina: { c: '#FFFFFF', c2: '#FFFFFF', ac: '#F2EDE6', pc: '#F4A04A', cresta: 'gallina' },
    pato: { c: '#FFFFFF', c2: '#FFFFFF', ac: '#EDEDED', pc: '#F4A04A', pico: 'pato' },
    patito: { c: '#FFE07A', c2: '#FFF0B0', ac: '#F8D050', pc: '#F4A04A', pico: 'pato' },
    pinguino: { c: '#3A3F4A', c2: '#FFFFFF', ac: '#2E323A', pc: '#F4A04A', cara: 1 },
    pajaro: { c: '#8EC0EC', c2: '#E4F0FA', ac: '#5A90C8', pc: '#F4A04A' }
  };
  function ave(K, t, x, y, e, ex) {
    e = e || 1; var o = {}, k; for (k in AV[t]) o[k] = AV[t][k]; if (ex) for (k in ex) o[k] = ex[k];
    var q = XY(x, y, e), X = q[0], Y = q[1], s = '', pc = o.pc || '#F4A04A';
    if (o.cola) s += K.p('M' + X(-3) + ' ' + Y(-6) + ' L' + X(-6) + ' ' + Y(12) + ' L' + X(0) + ' ' + Y(10) + ' L' + X(3) + ' ' + Y(-6) + ' Z', o.cola, { w: .7 });
    s += K.l('M' + X(-4) + ' ' + Y(-2.5) + ' L' + X(-4) + ' ' + Y(0) + ' M' + X(-6) + ' ' + Y(0) + ' L' + X(-2) + ' ' + Y(0) + ' M' + X(4) + ' ' + Y(-2.5) + ' L' + X(4) + ' ' + Y(0) + ' M' + X(2) + ' ' + Y(0) + ' L' + X(6) + ' ' + Y(0), '#E08A2A', { w: N(1.3 * e) });
    if (o.buho) s += K.pl([[X(-10), Y(-26)], [X(-9.5), Y(-35)], [X(-4), Y(-28.5)]], o.c, { w: .7 }) + K.pl([[X(10), Y(-26)], [X(9.5), Y(-35)], [X(4), Y(-28.5)]], o.c, { w: .7 });
    if (o.cresta === 'gallina') s += K.p('M' + X(-3) + ' ' + Y(-26.5) + ' q' + N(-1 * e) + ' ' + N(-5 * e) + ' ' + N(2 * e) + ' ' + N(-4 * e) + ' q' + N(1 * e) + ' ' + N(-3 * e) + ' ' + N(3 * e) + ' ' + N(-1 * e) + ' q' + N(3 * e) + ' 0 ' + N(1 * e) + ' ' + N(5 * e) + ' Z', P.rojo, { w: .6 });
    s += K.e(X(0), Y(-14), N(11 * e), N(14 * e), o.c, { w: .9 });
    if (o.cara) s += K.e(X(0), Y(-19.5), N(7.5 * e), N(5.6 * e), o.c2, { w: .4 });
    s += K.e(X(0), Y(-8.5), N(7 * e), N(7.5 * e), o.c2, { w: .5 });
    s += K.e(X(-10.5), Y(-12), N(3.6 * e), N(7.5 * e), o.ac, { w: .7 }) + K.e(X(10.5), Y(-12), N(3.6 * e), N(7.5 * e), o.ac, { w: .7 });
    if (o.cresta === 'pollo') s += K.l('M' + X(0) + ' ' + Y(-27.5) + ' q' + N(-2 * e) + ' ' + N(-4 * e) + ' ' + N(1 * e) + ' ' + N(-5 * e) + ' M' + X(0) + ' ' + Y(-27.5) + ' q' + N(2 * e) + ' ' + N(-3 * e) + ' ' + N(3.5 * e) + ' ' + N(-3 * e), '#D8A830', { w: .8 });
    if (o.buho) s += K.c(X(-4.8), Y(-20), N(4.6 * e), o.c2, { w: .6 }) + K.c(X(4.8), Y(-20), N(4.6 * e), o.c2, { w: .6 });
    s += ojos(K, X(0), Y(-20), N((o.buho ? 4.8 : 4.4) * e), N((o.buho ? 2.4 : 1.7) * e));
    if (o.pico === 'curvo') s += K.p('M' + X(-2.2) + ' ' + Y(-17.5) + ' Q' + X(0) + ' ' + Y(-19.5) + ' ' + X(2.6) + ' ' + Y(-17) + ' Q' + X(3) + ' ' + Y(-13) + ' ' + X(.5) + ' ' + Y(-11.5) + ' Q' + X(1.2) + ' ' + Y(-14.5) + ' ' + X(-2.2) + ' ' + Y(-15) + ' Z', pc, { w: .6 });
    else if (o.pico === 'pato') s += K.e(X(0), Y(-15.5), N(4.6 * e), N(2 * e), pc, { w: .6 });
    else if (o.pico === 'tucan') s += K.p('M' + X(-1.5) + ' ' + Y(-18) + ' Q' + X(12) + ' ' + Y(-20) + ' ' + X(18) + ' ' + Y(-12) + ' Q' + X(8) + ' ' + Y(-12) + ' ' + X(-1.5) + ' ' + Y(-14) + ' Z', '#F4A04A', { w: .7 }) + K.p('M' + X(14) + ' ' + Y(-15.5) + ' Q' + X(17) + ' ' + Y(-14) + ' ' + X(18) + ' ' + Y(-12) + ' Q' + X(15) + ' ' + Y(-12.2) + ' ' + X(12) + ' ' + Y(-13) + ' Z', P.rojo, { w: .4 });
    else s += K.pl([[X(-2.4), Y(-17)], [X(2.4), Y(-17)], [X(0), Y(-13.4)]], pc, { w: .6 });
    s += mej(K, X(0), Y(-15.5), N(7 * e), N(1.6 * e));
    return s;
  }

  function jirafa(K, x, y, e) {
    var q = XY(x, y, e), X = q[0], Y = q[1], c = '#F6CF6A', m = '#C8843A', s = '';
    s += K.l('M' + X(-15) + ' ' + Y(-27) + ' Q' + X(-20) + ' ' + Y(-22) + ' ' + X(-19) + ' ' + Y(-13), K.oscuro(c, .3), { w: N(1 * e) }) + K.e(X(-19), Y(-12), N(1.6 * e), N(2.6 * e), m, { w: .4 });
    [-11, -5, 5, 11].forEach(function (lx) { s += K.r(X(lx - 1.7), Y(-24), N(3.4 * e), N(22.5 * e), 1.5, c, { w: .7 }) + K.r(X(lx - 1.9), Y(-2.4), N(3.8 * e), N(2.4 * e), .8, P.marronO, { w: .4 }); });
    s += K.e(X(0), Y(-26), N(16 * e), N(9 * e), c, { w: .9 });
    s += K.p('M' + X(5) + ' ' + Y(-31) + ' L' + X(10) + ' ' + Y(-62) + ' L' + X(17) + ' ' + Y(-61) + ' L' + X(15) + ' ' + Y(-27) + ' Z', c, { w: .9 });
    [[-8, -27, 3], [-1, -29, 2.6], [6, -24, 2.8], [-6, -21, 2], [11, -37, 2], [12, -46, 1.8], [13, -54, 1.6], [1, -23, 1.6], [-12, -24, 1.6]].forEach(function (p) { s += K.e(X(p[0]), Y(p[1]), N(p[2] * e), N(p[2] * .8 * e), m, { w: .3 }); });
    s += K.l('M' + X(12) + ' ' + Y(-68) + ' L' + X(11) + ' ' + Y(-73) + ' M' + X(16.5) + ' ' + Y(-68.5) + ' L' + X(17.5) + ' ' + Y(-73.5), m, { w: N(1.2 * e) }) + K.c(X(11), Y(-73.5), N(1.4 * e), m, { w: .4 }) + K.c(X(17.5), Y(-74), N(1.4 * e), m, { w: .4 });
    s += K.e(X(8.5), Y(-66), N(3.2 * e), N(1.5 * e), c, { w: .6 });
    s += K.e(X(14.5), Y(-64.5), N(6.5 * e), N(5.5 * e), c, { w: .9 }) + K.e(X(17.5), Y(-61.5), N(4.2 * e), N(3 * e), P.crema, { w: .5 });
    s += K.c(X(14), Y(-66), N(1.4 * e), P.tinta, { negro: 1, w: .3 }) + K.c(X(14.5), Y(-66.6), N(.5 * e), P.blanco, { sin: 1 }) + K.c(X(16.4), Y(-62.6), N(.5 * e), P.tinta, { negro: 1, w: .2 }) + boca(K, X(18.2), Y(-60.8), N(1.4 * e));
    return s;
  }
  function rana(K, x, y, e, c) {
    e = e || 1; c = c || '#7CC65A'; var q = XY(x, y, e), X = q[0], Y = q[1];
    return K.e(X(-10.5), Y(-2.6), N(5.4 * e), N(2.8 * e), c, { w: .7 }) + K.e(X(10.5), Y(-2.6), N(5.4 * e), N(2.8 * e), c, { w: .7 }) + K.e(X(0), Y(-8), N(12 * e), N(8 * e), c, { w: .9 }) + K.e(X(0), Y(-5.5), N(7 * e), N(4.4 * e), '#DDF0B8', { w: .4 }) + K.c(X(-6), Y(-15), N(4.4 * e), c, { w: .8 }) + K.c(X(6), Y(-15), N(4.4 * e), c, { w: .8 }) + K.c(X(-6), Y(-15), N(2.8 * e), P.blanco, { w: .4 }) + K.c(X(6), Y(-15), N(2.8 * e), P.blanco, { w: .4 }) + ojos(K, X(0), Y(-15), N(6 * e), N(1.6 * e)) + K.l('M' + X(-6) + ' ' + Y(-10) + ' Q' + X(0) + ' ' + Y(-6.5) + ' ' + X(6) + ' ' + Y(-10), P.tinta, { w: .8 }) + mej(K, X(0), Y(-9.5), N(8.5 * e), N(1.5 * e));
  }
  function renacuajo(K, x, y, e) { var q = XY(x, y, e), X = q[0], Y = q[1]; return K.p('M' + X(3) + ' ' + Y(-3) + ' Q' + X(10) + ' ' + Y(-7) + ' ' + X(14) + ' ' + Y(-2) + ' Q' + X(18) + ' ' + Y(2) + ' ' + X(23) + ' ' + Y(-1) + ' Q' + X(18) + ' ' + Y(5) + ' ' + X(12) + ' ' + Y(2) + ' Q' + X(8) + ' ' + Y(1) + ' ' + X(3) + ' ' + Y(3) + ' Z', '#6E8A5A', { w: .6 }) + K.e(X(0), Y(0), N(6.5 * e), N(5 * e), '#6E8A5A', { w: .8 }) + ojos(K, X(-1), Y(-1), N(2.6 * e), N(1.1 * e)) + boca(K, X(-1), Y(2), N(1 * e)); }
  function serpiente(K, x0, y, len, c, ond, e) {
    e = e || 1; var n = 24, up = [], dn = [], amp = 5 * e, w = 3.4 * e, i;
    for (i = 0; i <= n; i++) { var t = i / n, px = x0 + t * len, py = y + Math.sin(t * Math.PI * 2 * ond) * amp, ww = w * (.45 + .55 * Math.min(1, t * 3)); up.push([N(px), N(py - ww)]); dn.unshift([N(px), N(py + ww)]); }
    var hx = x0 + len + 3 * e, hy = y + Math.sin(Math.PI * 2 * ond) * amp, s = K.pl(up.concat(dn), c, { w: .8 });
    for (i = 3; i < n; i += 4) { var t2 = i / n; s += K.c(N(x0 + t2 * len), N(y + Math.sin(t2 * Math.PI * 2 * ond) * amp), N(1.1 * e), K.oscuro(c, .25), { w: .2 }); }
    s += K.l('M' + N(hx + 5 * e) + ' ' + N(hy + 1 * e) + ' L' + N(hx + 9 * e) + ' ' + N(hy + 1 * e) + ' l' + N(1.5 * e) + ' ' + N(-1.5 * e) + ' M' + N(hx + 9 * e) + ' ' + N(hy + 1 * e) + ' l' + N(1.5 * e) + ' ' + N(1.5 * e), P.rojo, { w: .7 });
    return s + K.e(N(hx), N(hy), N(5.5 * e), N(4.4 * e), c, { w: .8 }) + ojos(K, N(hx + .5 * e), N(hy - 1.2 * e), N(2 * e), N(1 * e)) + boca(K, N(hx + 1 * e), N(hy + 1.6 * e), N(1.4 * e));
  }

  /* escenario */
  function prado(K, y) { return K.r(0, y, 200, 150 - y, 0, P.cesped, { sin: 1 }) + K.l('M0 ' + y + ' H200', P.cespedO, { w: .8 }); }
  function sol(K, x, y, r) { var s = ''; for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4; s += K.l('M' + N(x + Math.cos(a) * (r + 2.5)) + ' ' + N(y + Math.sin(a) * (r + 2.5)) + ' L' + N(x + Math.cos(a) * (r + 6)) + ' ' + N(y + Math.sin(a) * (r + 6)), '#E8A820', { w: 1.2 }); } return s + K.c(x, y, r, P.sol, { w: .8 }) + ojos(K, x, N(y - 1), N(r * .32), N(r * .11)) + boca(K, x, N(y + r * .3), N(r * .3)); }
  function nube(K, x, y, e) { e = e || 1; return K.p('M' + N(x - 14 * e) + ' ' + N(y + 5 * e) + ' a' + N(5 * e) + ' ' + N(5 * e) + ' 0 0 1 ' + N(3 * e) + ' ' + N(-9 * e) + ' a' + N(7 * e) + ' ' + N(7 * e) + ' 0 0 1 ' + N(13 * e) + ' ' + N(-3 * e) + ' a' + N(5.5 * e) + ' ' + N(5.5 * e) + ' 0 0 1 ' + N(9 * e) + ' ' + N(5 * e) + ' a' + N(4 * e) + ' ' + N(4 * e) + ' 0 0 1 ' + N(-1 * e) + ' ' + N(7 * e) + ' Z', '#F2F6FA', { w: .8 }); }
  function arbol(K, x, y, h, r, c) { return K.r(N(x - 3), N(y - h), 6, h, 1.5, P.madera, { w: .7 }) + K.c(x, N(y - h), r, c || P.hoja, { w: .9 }); }
  function acacia(K, x, y, h, w) { return K.p('M' + N(x - 2.5) + ' ' + y + ' L' + N(x - 1.5) + ' ' + N(y - h) + ' L' + N(x + 1.5) + ' ' + N(y - h) + ' L' + N(x + 2.5) + ' ' + y + ' Z', P.madera, { w: .7 }) + K.l('M' + x + ' ' + N(y - h * .55) + ' L' + N(x - w * .45) + ' ' + N(y - h + 2) + ' M' + x + ' ' + N(y - h * .5) + ' L' + N(x + w * .45) + ' ' + N(y - h + 2), P.madera, { w: 1.6 }) + K.e(x, N(y - h), w, N(w * .3), '#9CC46A', { w: .9 }); }
  function flor(K, x, y, c, e) { e = e || 1; var s = K.l('M' + x + ' ' + y + ' L' + x + ' ' + N(y - 10 * e), P.cespedO, { w: N(1 * e) }); for (var i = 0; i < 5; i++) { var a = i * Math.PI * 2 / 5 - Math.PI / 2; s += K.c(N(x + Math.cos(a) * 3 * e), N(y - 10 * e + Math.sin(a) * 3 * e), N(2.4 * e), c, { w: .5 }); } return s + K.c(x, N(y - 10 * e), N(1.8 * e), P.amarillo, { w: .5 }); }
  function matas(K, lista, c) { return lista.map(function (q) { var x = q[0], y = q[1], h = q[2] || 6; return K.l('M' + N(x - 2.5) + ' ' + y + ' L' + N(x - 3.5) + ' ' + N(y - h * .8) + ' M' + x + ' ' + y + ' L' + x + ' ' + N(y - h) + ' M' + N(x + 2.5) + ' ' + y + ' L' + N(x + 3.5) + ' ' + N(y - h * .8), c || P.cespedO, { w: .9 }); }).join(''); }
  function agua(K, y, op) { var d = 'M0 ' + y; for (var i = 0; i < 10; i++) d += ' q5 -3 10 0 q5 3 10 0'; return K.p(d + ' L200 150 L0 150 Z', P.agua, { w: .8, op: op }); }
  function valla(K, x0, x1, y, h) { var s = K.r(x0, N(y - h * .75), x1 - x0, 2.6, 0, P.madera, { w: .5 }) + K.r(x0, N(y - h * .35), x1 - x0, 2.6, 0, P.madera, { w: .5 }); for (var x = x0 + 3; x < x1 - 4; x += 12) s += K.p('M' + x + ' ' + y + ' L' + x + ' ' + N(y - h) + ' L' + N(x + 2.5) + ' ' + N(y - h - 3) + ' L' + N(x + 5) + ' ' + N(y - h) + ' L' + N(x + 5) + ' ' + y + ' Z', P.madera, { w: .6 }); return s; }
  function etq(K, x, y, txt, s, o) { o = o || {}; return K.t(x, y, txt, { s: s || 6.4, b: 1, a: o.a, c: o.c }); }
  function flechita(K, x1, y1, x2, y2) { return K.flecha(x1, y1, x2, y2, P.tinta, { w: .7, p: 2.6 }); }
  function rama(K, x0, x1, y) { var s = K.r(x0, y, x1 - x0, 5, 2.5, P.madera, { w: .7 }); for (var x = x0 + 8; x < x1 - 4; x += 22) s += K.e(x, N(y - 2), 5, 2.4, P.hoja, { w: .5 }) + K.e(x + 6, N(y + 7), 4.4, 2.2, P.verde, { w: .5 }); return s; }
  function globo(K, x, y, w, h, txt, fs) { return K.r(x, y, w, h, 6, P.blanco, { w: .8 }) + K.p('M' + N(x + 5) + ' ' + N(y + h - 1) + ' l-8 6 l11 -3 Z', P.blanco, { w: .6 }) + K.t(N(x + w / 2), N(y + h / 2 + fs * .36), txt, { s: fs || 7, b: 1 }); }
  function pildora(K, x, y, w, h, c, txt, fs) { return K.r(N(x - w / 2), N(y - h / 2), w, h, N(h / 2), c, { w: .7 }) + K.t(x, N(y + (fs || 6) * .36), txt, { s: fs || 6, b: 1 }); }
  function granero(K, x, y, w, h) { var hb = h * .62; return K.r(x, N(y - hb), w, N(hb), 0, '#D85A48', { w: .9 }) + K.pl([[N(x - 3), N(y - hb)], [N(x + w / 2), N(y - h)], [N(x + w + 3), N(y - hb)]], '#A8423A', { w: .9 }) + K.r(N(x + w * .3), N(y - hb * .62), N(w * .4), N(hb * .62), 0, P.blanco, { w: .7 }) + K.l('M' + N(x + w * .3) + ' ' + N(y - hb * .62) + ' L' + N(x + w * .7) + ' ' + y + ' M' + N(x + w * .7) + ' ' + N(y - hb * .62) + ' L' + N(x + w * .3) + ' ' + y, '#A8423A', { w: .9 }) + K.r(N(x + w * .4), N(y - hb - h * .22), N(w * .2), N(h * .14), 0, P.blanco, { w: .6 }); }
  function nido(K, x, y, w) { return K.e(x, y, w, N(w * .28), P.madera, { w: .8 }) + K.l('M' + N(x - w * .8) + ' ' + N(y - 1) + ' Q' + x + ' ' + N(y + 4) + ' ' + N(x + w * .8) + ' ' + N(y - 1) + ' M' + N(x - w * .6) + ' ' + N(y + 3) + ' Q' + x + ' ' + N(y + 6) + ' ' + N(x + w * .6) + ' ' + N(y + 3), '#8A6440', { w: .6 }); }
  function huevo(K, x, y, e, roto) { var s = K.e(x, y, N(7 * e), N(9 * e), P.crema, { w: .8 }); if (roto) s += K.l('M' + N(x - 7 * e) + ' ' + N(y - 1 * e) + ' l' + N(2.5 * e) + ' ' + N(-3 * e) + ' l' + N(2.5 * e) + ' ' + N(3 * e) + ' l' + N(2.5 * e) + ' ' + N(-3 * e) + ' l' + N(2.5 * e) + ' ' + N(3 * e) + ' l' + N(2.5 * e) + ' ' + N(-3 * e) + ' l' + N(1.5 * e) + ' ' + N(2 * e), P.tinta, { w: .8 }); return s; }
  function platano(K, x, y, e) { e = e || 1; return K.p('M' + N(x - 5 * e) + ' ' + N(y - 9 * e) + ' Q' + N(x - 7 * e) + ' ' + N(y + 6 * e) + ' ' + N(x + 7 * e) + ' ' + N(y + 5 * e) + ' Q' + N(x - 1 * e) + ' ' + N(y + 2 * e) + ' ' + N(x - 2 * e) + ' ' + N(y - 9 * e) + ' Z', P.amarillo, { w: .7 }) + K.r(N(x - 5 * e), N(y - 11 * e), N(3 * e), N(2.4 * e), .6, P.marronO, { w: .3 }); }
  function zanahoria(K, x, y, e, entera) { e = e || 1; var s = K.e(N(x - 3 * e), N(y - 5 * e), N(1.6 * e), N(5 * e), P.hoja, { w: .5 }) + K.e(x, N(y - 6 * e), N(1.6 * e), N(6 * e), P.verde, { w: .5 }) + K.e(N(x + 3 * e), N(y - 5 * e), N(1.6 * e), N(5 * e), P.hoja, { w: .5 }); return s + (entera ? K.p('M' + N(x - 4 * e) + ' ' + y + ' L' + N(x + 4 * e) + ' ' + y + ' L' + x + ' ' + N(y + 17 * e) + ' Z', P.naranja, { w: .7 }) + K.l('M' + N(x - 2.5 * e) + ' ' + N(y + 4 * e) + ' l' + N(2 * e) + ' 0 M' + N(x + .5 * e) + ' ' + N(y + 8 * e) + ' l' + N(1.5 * e) + ' 0', K.oscuro(P.naranja, .3), { w: .5 }) : K.e(x, N(y + 1 * e), N(4 * e), N(1.6 * e), P.naranja, { w: .6 })); }

  window.EU_INF_K = { P: P, N: N, XY: XY, ojos: ojos, boca: boca, mej: mej, bigotes: bigotes, bicho: bicho, A: A, animal: animal, AV: AV, ave: ave, jirafa: jirafa, rana: rana, renacuajo: renacuajo, serpiente: serpiente, prado: prado, sol: sol, nube: nube, arbol: arbol, acacia: acacia, flor: flor, matas: matas, agua: agua, valla: valla, etq: etq, flechita: flechita, rama: rama, globo: globo, pildora: pildora, granero: granero, nido: nido, huevo: huevo, platano: platano, zanahoria: zanahoria, FAM: FAM };

  var L = [
    /* ─────────── LA SABANA ─────────── */
    { id: 'if_leon', fam: 'sab', n: 'El león',
      d: function (K) { return sol(K, 24, 22, 9) + prado(K, 120) + acacia(K, 182, 120, 38, 20) + matas(K, [[20, 120], [140, 120], [158, 120]]) + animal(K, 'leon', 86, 118, 1.9) + etq(K, 22, 64, 'melena') + flechita(K, 36, 64, 52, 66) + etq(K, 148, 54, 'cola') + flechita(K, 146, 58, 131, 68) + etq(K, 100, 140, 'El león, rey de la sabana', 7); },
      intro: 'El león vive en la sabana africana. El macho tiene una gran melena alrededor de la cabeza.',
      q: [['¿Qué tiene el león alrededor de la cabeza?', 'Una melena.'], ['¿Cómo hace el león?', '¡Grrr! El león ruge.'], ['¿Dónde vive el león?', 'En la sabana, donde hay mucha hierba y pocos árboles.']],
      porque: 'El rugido del león se oye muy lejos: así avisa a los demás de que ese lugar es suyo.' },
    { id: 'if_jirafa', fam: 'sab', n: 'La jirafa',
      d: function (K) { return prado(K, 122) + acacia(K, 152, 122, 92, 26) + matas(K, [[20, 122], [184, 122]]) + jirafa(K, 76, 122, 1.42) + etq(K, 34, 48, 'cuello largo') + flechita(K, 54, 50, 86, 58) + etq(K, 24, 100, 'manchas') + flechita(K, 38, 96, 60, 88) + etq(K, 100, 140, 'La jirafa es el animal más alto', 7); },
      intro: 'La jirafa tiene el cuello muy largo para comer las hojas más altas de los árboles.',
      q: [['¿Qué come la jirafa?', 'Hojas de los árboles altos, como la acacia.'], ['¿Qué tiene en la piel la jirafa?', 'Manchas.'], ['¿Quién es más alto, tú o la jirafa?', 'La jirafa: puede medir más de 5 metros.']],
      porque: 'Gracias a su cuello, la jirafa alcanza hojas que otros animales no pueden comer.' },
    { id: 'if_elefante', fam: 'sab', n: 'El elefante',
      d: function (K) { return prado(K, 120) + K.e(140, 126, 30, 4, P.agua, { w: .6 }) + animal(K, 'elefante', 78, 120, 1.9) + K.e(98, 84, 1.6, 2.4, P.agua, { w: .4 }) + K.e(104, 77, 1.6, 2.4, P.agua, { w: .4 }) + K.e(108, 86, 1.6, 2.4, P.agua, { w: .4 }) + etq(K, 160, 100, 'trompa') + flechita(K, 146, 99, 94, 95) + etq(K, 162, 44, 'orejas grandes') + flechita(K, 136, 48, 118, 56) + etq(K, 100, 140, 'El elefante bebe con la trompa', 7); },
      intro: 'El elefante es el animal terrestre más grande. Con la trompa huele, agarra la comida y bebe agua.',
      q: [['¿Para qué usa el elefante la trompa?', 'Para oler, agarrar la comida y beber agua.'], ['¿Cómo son las orejas del elefante?', 'Muy grandes.'], ['¿Qué es más grande, un elefante o un ratón?', 'El elefante.']],
      porque: 'Las orejas grandes ayudan al elefante a refrescarse cuando hace calor.' },
    { id: 'if_cebra', fam: 'sab', n: 'La cebra',
      d: function (K) { return prado(K, 122) + matas(K, [[110, 122], [190, 122], [10, 122]]) + animal(K, 'cebra', 62, 122, 1.75) + animal(K, 'cebra', 156, 122, 1.05) + etq(K, 100, 20, 'Rayas blancas y negras', 7) + etq(K, 156, 64, 'cría', 6) + etq(K, 100, 140, 'Cada cebra tiene sus propias rayas', 6.6); },
      intro: 'La cebra se parece a un caballo y tiene el cuerpo cubierto de rayas blancas y negras.',
      q: [['¿De qué color son las rayas de la cebra?', 'Blancas y negras.'], ['¿A qué animal se parece la cebra?', 'Al caballo.'], ['¿Hay dos cebras con las mismas rayas?', 'No: cada cebra tiene sus propias rayas, como una huella.']],
      porque: 'Cuando las cebras van juntas, sus rayas confunden a los animales que las quieren cazar.' },
    { id: 'if_hipo', fam: 'sab', n: 'El hipopótamo',
      d: function (K) { return sol(K, 176, 24, 9) + animal(K, 'hipo', 96, 130, 2) + agua(K, 104, .9) + matas(K, [[16, 104, 14], [28, 104, 10], [184, 104, 12]], P.cespedO) + etq(K, 100, 138, 'El hipopótamo se refresca en el río', 6.8); },
      intro: 'El hipopótamo pasa casi todo el día dentro del agua y sale de noche a comer hierba.',
      q: [['¿Dónde pasa el día el hipopótamo?', 'En el agua del río o del lago.'], ['¿Cuándo sale a comer?', 'De noche.'], ['¿Por qué se mete en el agua?', 'Para refrescarse y proteger su piel del sol.']],
      porque: 'La piel del hipopótamo se seca con el sol; el agua y el barro la protegen.' },
    { id: 'if_sabana', fam: 'sab', n: 'Los animales de la sabana',
      d: function (K) { return sol(K, 180, 22, 8) + prado(K, 118) + acacia(K, 72, 118, 60, 18) + jirafa(K, 34, 118, .8) + animal(K, 'elefante', 104, 118, .9) + animal(K, 'leon', 160, 118, .85) + etq(K, 34, 132, 'jirafa') + etq(K, 104, 132, 'elefante') + etq(K, 160, 132, 'león') + etq(K, 92, 22, 'Hierba, calor y pocos árboles', 6.6); },
      intro: 'En la sabana hace calor, crece mucha hierba y hay pocos árboles. Allí viven animales muy grandes.',
      q: [['Nombra tres animales de la sabana.', 'El león, la jirafa y el elefante (también la cebra y el hipopótamo).'], ['¿Cuál es el más alto?', 'La jirafa.'], ['¿Hace frío o calor en la sabana?', 'Calor.']],
      porque: 'En la sabana llueve poco una parte del año; por eso crece mucha hierba y hay pocos árboles.' },
    { id: 'if_leones', fam: 'sab', n: 'Una familia de leones',
      d: function (K) { return prado(K, 120) + animal(K, 'leon', 46, 120, 1.45) + animal(K, 'leona', 110, 120, 1.25) + animal(K, 'leona', 154, 120, .7, { c: '#F8D488' }) + animal(K, 'leona', 182, 120, .6, { c: '#F8D488' }) + etq(K, 46, 134, 'papá') + etq(K, 110, 134, 'mamá') + etq(K, 168, 134, 'cachorros') + etq(K, 100, 22, 'Una manada de leones', 7); },
      intro: 'Los leones viven en familia. El grupo se llama manada y los bebés se llaman cachorros.',
      q: [['¿Cómo se llama el bebé del león?', 'Cachorro.'], ['¿Quién tiene melena, el león o la leona?', 'El león.'], ['¿Cuántos cachorros hay en el dibujo?', 'Dos.']],
      porque: 'Las leonas de la manada cuidan juntas a los cachorros mientras crecen.' },
    /* ─────────── LA SELVA ─────────── */
    { id: 'if_loro', fam: 'sel', n: 'El loro de colores',
      d: function (K) { return rama(K, 12, 188, 90) + ave(K, 'loro', 100, 90, 2.2) + etq(K, 34, 46, 'pico curvo') + flechita(K, 52, 49, 96, 56) + etq(K, 168, 46, 'alas rojas') + flechita(K, 160, 50, 132, 62) + etq(K, 160, 118, 'cola azul') + flechita(K, 142, 116, 108, 112) + etq(K, 100, 140, 'El loro tiene plumas de muchos colores', 6.6); },
      intro: 'El loro vive en los árboles de la selva. Tiene plumas de colores y un pico curvo y fuerte.',
      q: [['Nombra los colores del loro.', 'Verde, amarillo, rojo y azul.'], ['¿Qué tiene el loro en lugar de boca?', 'Un pico.'], ['¿Qué puede imitar un loro?', 'Sonidos y palabras.']],
      porque: 'El pico curvo y fuerte le sirve al loro para abrir semillas duras y para trepar por las ramas.' },
    { id: 'if_mono', fam: 'sel', n: 'El mono y los plátanos',
      d: function (K) { var s = prado(K, 122) + animal(K, 'mono', 58, 122, 1.75) + etq(K, 100, 22, 'Cuenta los plátanos del mono', 7); [128, 144, 160, 176, 192].forEach(function (x, i) { s += platano(K, x, 100, 1.1) + etq(K, x, 120, String(i + 1), 7); }); return s + etq(K, 100, 140, '¿Cuántos hay?', 6.6); },
      intro: 'Al mono le encantan los plátanos. Vive en la selva y trepa muy bien por los árboles.',
      q: [['¿Cuántos plátanos hay?', 'Cinco.'], ['Si el mono se come dos, ¿cuántos quedan?', 'Tres.'], ['¿Para qué usa el mono la cola?', 'Para agarrarse a las ramas y no caerse.']],
      porque: 'Muchos monos de América usan la cola como una mano más para colgarse de los árboles.' },
    { id: 'if_tigre', fam: 'sel', n: 'El tigre',
      d: function (K) { return prado(K, 120) + matas(K, [[12, 120, 18], [26, 120, 14], [150, 120, 16], [170, 120, 20], [188, 120, 14]], '#5E9A3E') + animal(K, 'tigre', 92, 118, 1.9) + etq(K, 26, 74, 'rayas') + flechita(K, 38, 76, 72, 90) + etq(K, 168, 64, 'bigotes') + flechita(K, 156, 66, 118, 70) + etq(K, 100, 140, 'El tigre se esconde entre la hierba', 6.8); },
      intro: 'El tigre es el gato más grande del mundo. Su pelo es naranja con rayas negras.',
      q: [['¿De qué color es el tigre?', 'Naranja con rayas negras.'], ['¿Para qué le sirven las rayas?', 'Para esconderse entre la hierba y los árboles.'], ['¿El tigre es de la familia de los gatos o de los perros?', 'De los gatos: es un felino.']],
      porque: 'Las rayas rompen la silueta del tigre y lo hacen difícil de ver entre las sombras de la hierba.' },
    { id: 'if_rana', fam: 'sel', n: 'De renacuajo a rana',
      d: function (K) { var s = agua(K, 100, .55) + etq(K, 100, 22, 'La rana cambia mientras crece', 7); [[16, 76], [24, 74], [30, 80], [20, 84], [27, 87], [14, 85]].forEach(function (p) { s += K.c(p[0], p[1], 4.2, '#E8F2DC', { w: .5 }) + K.c(p[0], p[1], 1.4, P.tinta, { negro: 1, w: .2 }); }); s += renacuajo(K, 58, 80, 1.3) + K.e(120, 93, 18, 4, P.verde, { w: .6 }) + K.p('M112 86 Q104 84 100 90 Q106 88 112 90 Z', '#7CC65A', { w: .5 }) + rana(K, 120, 92, 1) + K.e(175, 93, 24, 4.6, P.verde, { w: .6 }) + rana(K, 175, 92, 1.4); return s + flechita(K, 36, 80, 46, 80) + flechita(K, 89, 80, 98, 80) + flechita(K, 140, 80, 150, 80) + etq(K, 22, 112, 'huevos', 5.8) + etq(K, 62, 112, 'renacuajo', 5.8) + etq(K, 120, 112, 'con patas', 5.8) + etq(K, 175, 112, 'rana', 5.8) + etq(K, 100, 138, 'Vive en el agua y en la tierra', 6.6); },
      intro: 'La rana no nace como su mamá: primero es un huevo, luego un renacuajo que nada y después una rana.',
      q: [['¿Qué sale del huevo de la rana?', 'Un renacuajo.'], ['¿Dónde vive el renacuajo?', 'En el agua.'], ['¿Qué le pasa al renacuajo para ser rana?', 'Le crecen patas y la cola desaparece.']],
      porque: 'Este cambio se llama metamorfosis: el renacuajo respira en el agua y la rana adulta también puede vivir en la tierra.' },
    { id: 'if_tucan', fam: 'sel', n: 'El tucán',
      d: function (K) { var s = rama(K, 8, 192, 98) + ave(K, 'tucan', 80, 98, 2.4); [[152, 108], [158, 112], [146, 113], [153, 117]].forEach(function (p) { s += K.c(p[0], p[1], 3.4, '#C8406A', { w: .5 }); }); return s + K.l('M152 103 L152 105', P.cespedO, { w: .8 }) + etq(K, 162, 40, 'pico grande') + flechita(K, 150, 44, 126, 56) + etq(K, 168, 132, 'frutas') + etq(K, 80, 138, 'El tucán vive en la selva', 7); },
      intro: 'El tucán es un pájaro de la selva con un pico enorme y de colores.',
      q: [['¿Qué tiene de especial el tucán?', 'Un pico muy grande y de colores.'], ['¿Qué come el tucán?', 'Sobre todo frutas.'], ['¿Pesa mucho su pico?', 'No: es grande pero muy ligero, casi hueco por dentro.']],
      porque: 'El pico largo le permite alcanzar las frutas de las ramas finas sin caerse.' },
    { id: 'if_serpiente', fam: 'sel', n: 'Serpientes largas y cortas',
      d: function (K) { return matas(K, [[10, 130], [100, 130], [190, 130]]) + serpiente(K, 14, 36, 150, '#8CCB6E', 2) + serpiente(K, 14, 74, 100, '#F4A04A', 1.5) + serpiente(K, 14, 110, 50, '#C8A8E8', 1) + etq(K, 190, 40, 'larga') + etq(K, 152, 78, 'mediana') + etq(K, 98, 114, 'corta') + etq(K, 100, 142, 'Las serpientes no tienen patas', 6.8); },
      intro: 'Hay serpientes largas y serpientes cortas. Ninguna tiene patas: se mueven arrastrándose.',
      q: [['¿Cuál es la serpiente más larga?', 'La verde.'], ['¿Cuál es la más corta?', 'La morada.'], ['¿Cómo se mueve una serpiente sin patas?', 'Arrastrándose y moviendo el cuerpo como una ola.']],
      porque: 'La serpiente se mueve apoyando las escamas de la panza en el suelo y empujando con todo el cuerpo.' },
    { id: 'if_selva', fam: 'sel', n: 'Los animales de la selva',
      d: function (K) { return prado(K, 122) + arbol(K, 18, 122, 100, 24, '#5FAE58') + arbol(K, 184, 122, 96, 24, '#5FAE58') + rama(K, 18, 80, 62) + rama(K, 122, 184, 56) + ave(K, 'loro', 48, 62, .9) + ave(K, 'tucan', 156, 56, .9) + animal(K, 'mono', 96, 122, 1.05) + rana(K, 150, 124, .9) + etq(K, 48, 84, 'loro') + etq(K, 158, 78, 'tucán') + etq(K, 96, 136, 'mono') + etq(K, 150, 136, 'rana') + etq(K, 100, 14, 'La selva tiene muchos árboles', 6.2); },
      intro: 'En la selva llueve mucho y hace calor. Hay tantos árboles que casi no llega la luz al suelo.',
      q: [['¿Llueve mucho o poco en la selva?', 'Mucho.'], ['Nombra un animal que vive en los árboles.', 'El loro, el tucán o el mono.'], ['¿Qué animal del dibujo vive cerca del agua?', 'La rana.']],
      porque: 'Con tanta lluvia y calor crecen muchísimas plantas, y entre ellas viven más animales que en ningún otro lugar.' },
    /* ─────────── LA GRANJA ─────────── */
    { id: 'if_vaca', fam: 'gra', n: 'La vaca nos da leche',
      d: function (K) { return prado(K, 122) + animal(K, 'vaca', 60, 122, 1.75) + K.r(128, 90, 16, 32, 3, P.blanco, { w: .8 }) + K.r(132, 82, 8, 9, 1, P.blanco, { w: .7 }) + K.r(131, 78, 10, 5, 1.5, P.azul, { w: .6 }) + K.r(130, 100, 12, 10, 1, P.azul, { w: .4 }) + K.pl([[154, 122], [190, 122], [190, 98]], P.amarillo, { w: .8 }) + K.c(170, 116, 2.4, '#E8C050', { w: .4 }) + K.c(182, 110, 2, '#E8C050', { w: .4 }) + K.c(184, 118, 1.6, '#E8C050', { w: .4 }) + etq(K, 136, 134, 'leche') + etq(K, 176, 134, 'queso') + etq(K, 100, 20, 'La vaca nos da leche', 7); },
      intro: 'La vaca vive en la granja y come hierba. Con su leche se hacen el queso, el yogur y la mantequilla.',
      q: [['¿Qué nos da la vaca?', 'Leche.'], ['¿Qué alimentos se hacen con la leche?', 'Queso, yogur y mantequilla.'], ['¿Cómo hace la vaca?', '¡Muuu!']],
      porque: 'La vaca produce leche para alimentar a su ternero; también la ordeñamos para hacer muchos alimentos.' },
    { id: 'if_cerdo', fam: 'gra', n: 'El cerdo en el barro',
      d: function (K) { return prado(K, 112) + valla(K, 4, 200, 112, 24) + K.e(100, 126, 72, 10, P.barro, { w: .8 }) + animal(K, 'cerdo', 94, 126, 1.8) + K.c(150, 118, 2, P.barro, { w: .4 }) + K.c(46, 116, 1.6, P.barro, { w: .4 }) + etq(K, 152, 130, 'barro', 6, { c: '#FFFFFF' }) + etq(K, 100, 146, 'El cerdo se refresca en el barro', 6.6); },
      intro: 'Al cerdo le gusta revolcarse en el barro. No es por sucio: así se refresca cuando hace calor.',
      q: [['¿De qué color es el cerdo del dibujo?', 'Rosado.'], ['¿Por qué se revuelca en el barro?', 'Para refrescarse y protegerse del sol.'], ['¿Cómo hace el cerdo?', '¡Oinc, oinc!']],
      porque: 'El cerdo casi no suda; el barro le enfría la piel como si fuera agua.' },
    { id: 'if_oveja', fam: 'gra', n: 'La oveja y su lana',
      d: function (K) { var s = prado(K, 122) + animal(K, 'oveja', 52, 122, 1.7) + flechita(K, 90, 98, 104, 98) + K.c(124, 98, 13, '#F4F0F8', { w: .9 }) + K.l('M113 92 Q124 86 135 94 M112 100 Q124 92 136 102 M114 106 Q126 100 134 108', '#B8A8C8', { w: .7 }) + K.l('M136 104 Q142 114 148 110', '#B8A8C8', { w: .7 }) + flechita(K, 148, 98, 160, 98) + K.r(168, 68, 14, 48, 3, P.rojo, { w: .8 }); [78, 92, 106].forEach(function (y) { s += K.r(168, y, 14, 4, 0, '#FFFFFF', { w: .4 }); }); return s + K.l('M170 116 l0 5 M174 116 l0 5 M178 116 l0 5', P.rojo, { w: .9 }) + etq(K, 52, 134, 'lana') + etq(K, 124, 134, 'ovillo') + etq(K, 175, 134, 'bufanda') + etq(K, 100, 20, 'Con la lana se hace ropa', 7); },
      intro: 'La oveja tiene el cuerpo cubierto de lana. Con esa lana se hacen ovillos para tejer ropa abrigada.',
      q: [['¿Qué nos da la oveja?', 'Lana.'], ['¿Qué ropa se hace con lana?', 'Bufandas, gorros, guantes y calcetines.'], ['¿Cómo se llama el bebé de la oveja?', 'Cordero.']],
      porque: 'A la oveja se le corta la lana una vez al año; no le duele y le vuelve a crecer.' },
    { id: 'if_gallina', fam: 'gra', n: 'Del huevo al pollito',
      d: function (K) { return prado(K, 120) + ave(K, 'gallina', 36, 112, 1.3) + nido(K, 36, 114, 24) + huevo(K, 90, 104, 1.1) + huevo(K, 128, 104, 1.1, 1) + ave(K, 'pollito', 168, 120, 1.15) + flechita(K, 60, 104, 78, 104) + flechita(K, 100, 104, 114, 104) + flechita(K, 139, 104, 151, 104) + etq(K, 36, 134, 'gallina') + etq(K, 90, 134, 'huevo') + etq(K, 128, 134, 'se rompe') + etq(K, 168, 134, 'pollito') + etq(K, 100, 22, 'Del huevo sale un pollito', 7); },
      intro: 'La gallina pone huevos y los calienta. Dentro del huevo crece un pollito que un día rompe la cáscara.',
      q: [['¿Qué pone la gallina?', 'Huevos.'], ['¿Qué sale del huevo?', 'Un pollito.'], ['¿Cómo hace el pollito?', '¡Pío, pío!']],
      porque: 'La gallina se sienta sobre los huevos para darles calor; así el pollito crece dentro unas tres semanas.' },
    { id: 'if_patitos', fam: 'gra', n: 'Mamá pata y sus patitos',
      d: function (K) { var s = agua(K, 100, .6) + ave(K, 'pato', 34, 114, 1.35); [76, 106, 136, 166].forEach(function (x, i) { s += ave(K, 'patito', x, 114, .75) + etq(K, x, 82, String(i + 1), 8); }); return s + K.r(0, 110, 200, 40, 0, P.agua, { sin: 1, op: .55 }) + etq(K, 100, 22, 'Cuenta los patitos', 7) + etq(K, 100, 138, 'Mamá pata va delante', 6.6); },
      intro: 'Los patitos nadan en fila detrás de su mamá. Así no se pierden.',
      q: [['¿Cuántos patitos hay?', 'Cuatro.'], ['Si llega uno más, ¿cuántos son?', 'Cinco.'], ['¿Cómo hace el pato?', '¡Cuac, cuac!']],
      porque: 'Los patitos siguen al primer ser que ven al nacer, que casi siempre es su mamá.' },
    { id: 'if_mascotas', fam: 'gra', n: 'Cuidamos a las mascotas',
      d: function (K) { return K.suelo(100, 120, 96) + animal(K, 'perro', 44, 120, 1.45) + animal(K, 'gato', 154, 120, 1.45) + pildora(K, 100, 40, 42, 13, P.azul, 'agua') + pildora(K, 100, 58, 42, 13, P.amarillo, 'comida') + pildora(K, 100, 76, 42, 13, P.verde, 'paseo') + pildora(K, 100, 94, 42, 13, P.rosa, 'cariño') + etq(K, 100, 18, '¿Qué necesita una mascota?', 6.8) + etq(K, 100, 140, 'Cuidarla es tarea de toda la familia', 6.4); },
      intro: 'El perro y el gato viven con nosotros en casa. Necesitan que los cuidemos todos los días.',
      q: [['¿Qué necesita una mascota cada día?', 'Agua limpia, comida, ejercicio y cariño.'], ['¿Cómo hace el perro? ¿Y el gato?', 'El perro: ¡guau! El gato: ¡miau!'], ['¿Quién lleva a la mascota al veterinario?', 'Su familia, para que esté sana.']],
      porque: 'Una mascota depende de nosotros: cuidarla es una responsabilidad.' },
    { id: 'if_conejo', fam: 'gra', n: 'El conejo y la zanahoria',
      d: function (K) { return prado(K, 120) + animal(K, 'conejo', 60, 120, 1.7) + zanahoria(K, 98, 103, 1, 1) + K.r(112, 114, 82, 8, 3, P.barro, { w: .7 }) + zanahoria(K, 126, 114, 1) + zanahoria(K, 152, 114, 1) + zanahoria(K, 178, 114, 1) + etq(K, 152, 96, 'huerto') + etq(K, 100, 140, 'El conejo come hierba y verduras', 6.8); },
      intro: 'El conejo tiene orejas largas, se mueve saltando y come hierba, hojas y algunas verduras.',
      q: [['¿Qué come el conejo?', 'Hierba, hojas y algunas verduras como la zanahoria.'], ['¿Cómo son las orejas del conejo?', 'Largas.'], ['¿Cómo se mueve el conejo?', 'Saltando.']],
      porque: 'Los dientes del conejo no paran de crecer; masticar hierba los desgasta.' },
    { id: 'if_sonidos', fam: 'gra', n: 'Los sonidos de la granja',
      d: function (K) { return animal(K, 'vaca', 34, 62, .85) + globo(K, 60, 14, 36, 15, 'muuu', 7) + animal(K, 'cerdo', 134, 62, .85) + globo(K, 160, 14, 36, 15, 'oinc', 7) + animal(K, 'oveja', 34, 126, .85) + globo(K, 60, 80, 36, 15, 'beee', 7) + ave(K, 'pato', 134, 126, 1.1) + globo(K, 160, 86, 36, 15, 'cuac', 7) + K.suelo(34, 62, 30) + K.suelo(134, 62, 30) + etq(K, 100, 144, 'Imita el sonido de cada animal', 6.2); },
      intro: 'Cada animal de la granja tiene su propio sonido. ¿Los sabes imitar?',
      q: [['¿Qué animal hace «muuu»?', 'La vaca.'], ['¿Qué animal hace «cuac»?', 'El pato.'], ['Imita el sonido de la oveja.', '¡Beee!']],
      porque: 'Los animales usan sus sonidos para llamarse, avisar de un peligro o encontrar a sus crías.' },
    { id: 'if_granja', fam: 'gra', n: 'La granja',
      d: function (K) { return sol(K, 180, 20, 8) + nube(K, 120, 22, 1) + prado(K, 118) + valla(K, 66, 200, 118, 16) + granero(K, 8, 118, 54, 56) + animal(K, 'vaca', 112, 124, .9) + animal(K, 'cerdo', 162, 126, .8) + ave(K, 'gallina', 78, 128, .75) + ave(K, 'pollito', 94, 130, .45) + etq(K, 40, 16, 'La granja', 8) + etq(K, 100, 144, 'Aquí viven animales que nos dan alimentos', 6); },
      intro: 'En la granja viven animales que nos dan leche, huevos y lana. El granjero los cuida cada día.',
      q: [['¿Qué animales hay en la granja del dibujo?', 'La vaca, el cerdo, la gallina y el pollito.'], ['¿Dónde se guardan los animales y la comida?', 'En el granero.'], ['¿Qué animal de la granja pone huevos?', 'La gallina.']],
      porque: 'Los granjeros cuidan a los animales y ellos nos dan alimentos como la leche y los huevos.' }
  ];
  MO.agregar('infantil', L, { nombre: 'Infantil', familias: FAM, materias: /^(infantil)$/ });
})();
