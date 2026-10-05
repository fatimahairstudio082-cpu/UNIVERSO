/* b6_lib_infantil2.js — Infantil: modelos 24–50 de 50. Materia `infantil`. Prefijo `if_`.
   Cargar después de b6_lib_infantil.js (usa window.EU_INF_K). Familias: mar, bosque y frío, bichitos, aprendo con animales. */
(function () {
  'use strict';
  var MO = window.EU_MODELOS, IK = window.EU_INF_K; if (!MO || !IK || MO.modelo('if_pez')) return;
  var P = IK.P, N = IK.N, XY = IK.XY, ojos = IK.ojos, boca = IK.boca, mej = IK.mej, animal = IK.animal, ave = IK.ave, rana = IK.rana, prado = IK.prado, sol = IK.sol, arbol = IK.arbol, flor = IK.flor, matas = IK.matas, agua = IK.agua, etq = IK.etq, flechita = IK.flechita, rama = IK.rama, pildora = IK.pildora, nido = IK.nido, platano = IK.platano, zanahoria = IK.zanahoria;

  function pez(K, x, y, e, c) {
    e = e || 1; c = c || P.naranja; var q = XY(x, y, e), X = q[0], Y = q[1], c2 = K.oscuro(c, .12), s = '';
    s += K.pl([[X(-11), Y(0)], [X(-20), Y(-8)], [X(-17.5), Y(0)], [X(-20), Y(8)]], c2, { w: .7 });
    s += K.p('M' + X(-5) + ' ' + Y(-8) + ' Q' + X(1) + ' ' + Y(-15) + ' ' + X(6) + ' ' + Y(-8) + ' Z', c2, { w: .6 });
    s += K.e(X(0), Y(0), N(13 * e), N(9 * e), c, { w: .9 });
    s += K.l('M' + X(4) + ' ' + Y(-6) + ' Q' + X(1.5) + ' ' + Y(0) + ' ' + X(4) + ' ' + Y(6), K.oscuro(c, .35), { w: .7 });
    s += K.l('M' + X(-3) + ' ' + Y(-3) + ' Q' + X(-1) + ' ' + Y(0) + ' ' + X(-3) + ' ' + Y(3) + ' M' + X(-7.5) + ' ' + Y(-3) + ' Q' + X(-5.5) + ' ' + Y(0) + ' ' + X(-7.5) + ' ' + Y(3), K.oscuro(c, .25), { w: .6 });
    s += K.e(X(-1), Y(5), N(4 * e), N(1.8 * e), c2, { w: .5 });
    s += K.c(X(7.5), Y(-2), N(2 * e), P.tinta, { negro: 1, w: .3 }) + K.c(X(8.2), Y(-2.8), N(.8 * e), P.blanco, { sin: 1 }) + boca(K, X(10), Y(2.5), N(1.4 * e));
    return s + (K.linea ? '' : K.e(X(7), Y(2.6), N(1.6 * e), N(1 * e), P.mej, { sin: 1, op: .7 }));
  }
  function ballena(K, x, y, e) {
    var q = XY(x, y, e), X = q[0], Y = q[1], c = '#7AA8D8', s = '';
    s += K.l('M' + X(-12) + ' ' + Y(-18) + ' L' + X(-12) + ' ' + Y(-25) + ' M' + X(-12) + ' ' + Y(-25) + ' Q' + X(-16) + ' ' + Y(-30) + ' ' + X(-21) + ' ' + Y(-27) + ' M' + X(-12) + ' ' + Y(-25) + ' Q' + X(-8) + ' ' + Y(-30) + ' ' + X(-3) + ' ' + Y(-27), P.aguaO, { w: N(1.2 * e) });
    s += K.p('M' + X(-32) + ' ' + Y(0) + ' C' + X(-32) + ' ' + Y(-20) + ' ' + X(10) + ' ' + Y(-22) + ' ' + X(22) + ' ' + Y(-6) + ' L' + X(34) + ' ' + Y(-16) + ' L' + X(32) + ' ' + Y(2) + ' L' + X(23) + ' ' + Y(3) + ' C' + X(14) + ' ' + Y(14) + ' ' + X(-32) + ' ' + Y(16) + ' ' + X(-32) + ' ' + Y(0) + ' Z', c, { w: .9 });
    s += K.p('M' + X(-31) + ' ' + Y(4) + ' C' + X(-22) + ' ' + Y(14) + ' ' + X(8) + ' ' + Y(12) + ' ' + X(18) + ' ' + Y(5) + ' C' + X(4) + ' ' + Y(8) + ' ' + X(-20) + ' ' + Y(8) + ' ' + X(-31) + ' ' + Y(4) + ' Z', '#D4E6F6', { w: .5 });
    s += K.e(X(-6), Y(7), N(6 * e), N(2.4 * e), K.oscuro(c, .1), { w: .6 });
    s += K.c(X(-21), Y(-4), N(1.8 * e), P.tinta, { negro: 1, w: .3 }) + K.c(X(-20.4), Y(-4.7), N(.7 * e), P.blanco, { sin: 1 }) + K.l('M' + X(-31) + ' ' + Y(1.5) + ' Q' + X(-25) + ' ' + Y(5) + ' ' + X(-18) + ' ' + Y(2), P.tinta, { w: .8 });
    return s + (K.linea ? '' : K.e(X(-21), Y(1.2), N(1.8 * e), N(1.1 * e), P.mej, { sin: 1, op: .7 }));
  }
  function delfin(K, x, y, e) {
    var q = XY(x, y, e), X = q[0], Y = q[1], c = '#8AA8C8', s = '';
    s += K.pl([[X(-2), Y(-11.5)], [X(3), Y(-21)], [X(7), Y(-12)]], K.oscuro(c, .1), { w: .7 });
    s += K.p('M' + X(-28) + ' ' + Y(6) + ' L' + X(-20) + ' ' + Y(2) + ' C' + X(-14) + ' ' + Y(-12) + ' ' + X(12) + ' ' + Y(-16) + ' ' + X(22) + ' ' + Y(-4) + ' L' + X(30) + ' ' + Y(-11) + ' L' + X(29) + ' ' + Y(2) + ' L' + X(22) + ' ' + Y(1) + ' C' + X(12) + ' ' + Y(7) + ' ' + X(-10) + ' ' + Y(8) + ' ' + X(-18) + ' ' + Y(7) + ' Z', c, { w: .9 });
    s += K.p('M' + X(-24) + ' ' + Y(6) + ' C' + X(-12) + ' ' + Y(8) + ' ' + X(8) + ' ' + Y(6) + ' ' + X(18) + ' ' + Y(2) + ' C' + X(8) + ' ' + Y(3) + ' ' + X(-10) + ' ' + Y(4) + ' ' + X(-24) + ' ' + Y(6) + ' Z', '#E2ECF4', { w: .4 });
    s += K.e(X(-4), Y(6), N(5 * e), N(2 * e), K.oscuro(c, .1), { w: .5 });
    return s + K.c(X(-14), Y(-1.5), N(1.6 * e), P.tinta, { negro: 1, w: .3 }) + K.c(X(-13.5), Y(-2.1), N(.6 * e), P.blanco, { sin: 1 }) + K.l('M' + X(-25) + ' ' + Y(5.4) + ' Q' + X(-21) + ' ' + Y(6.5) + ' ' + X(-17) + ' ' + Y(4), P.tinta, { w: .7 });
  }
  function pulpo(K, x, y, e, c) {
    c = c || '#E88AA8'; var q = XY(x, y, e), X = q[0], Y = q[1], s = '';
    for (var i = 0; i < 8; i++) { var tx = -12 + i * 24 / 7, dx = (i % 2 ? 1.5 : -1.5); s += K.p('M' + X(tx - 2.6) + ' ' + Y(-14) + ' Q' + X(tx - 3 + dx) + ' ' + Y(-5) + ' ' + X(tx + dx * 1.8) + ' ' + Y(-1) + ' Q' + X(tx + dx * 2.6) + ' ' + Y(.5) + ' ' + X(tx + dx * 2.4) + ' ' + Y(-2) + ' Q' + X(tx + 2.6 + dx * .4) + ' ' + Y(-6) + ' ' + X(tx + 2.6) + ' ' + Y(-14) + ' Z', c, { w: .7 }) + K.c(X(tx + dx * .4), Y(-6), N(.8 * e), K.claro(c, .4), { w: .3 }); }
    s += K.e(X(0), Y(-24), N(13 * e), N(13 * e), c, { w: .9 }) + K.e(X(-5), Y(-31), N(3 * e), N(2 * e), K.claro(c, .35), { sin: 1 });
    return s + ojos(K, X(0), Y(-22), N(4.6 * e), N(2 * e)) + boca(K, X(0), Y(-17), N(2.4 * e)) + mej(K, X(0), Y(-18.5), N(8 * e), N(1.8 * e));
  }
  function tortuga(K, x, y, e, c) {
    c = c || '#8CB85A'; var q = XY(x, y, e), X = q[0], Y = q[1], sk = '#B8D88A', s = '';
    s += K.e(X(-11), Y(-2.5), N(4.2 * e), N(3 * e), sk, { w: .7 }) + K.e(X(10), Y(-2.5), N(4.2 * e), N(3 * e), sk, { w: .7 }) + K.pl([[X(-15), Y(-5)], [X(-20), Y(-4)], [X(-15), Y(-8)]], sk, { w: .6 });
    s += K.c(X(18), Y(-10), N(5.6 * e), sk, { w: .8 });
    s += K.p('M' + X(-16) + ' ' + Y(-4) + ' Q' + X(-16) + ' ' + Y(-23) + ' ' + X(0) + ' ' + Y(-23) + ' Q' + X(16) + ' ' + Y(-23) + ' ' + X(16) + ' ' + Y(-4) + ' Z', c, { w: .9 });
    s += K.r(X(-17), Y(-6), N(34 * e), N(3.4 * e), N(1.5 * e), K.oscuro(c, .12), { w: .6 });
    s += K.pl([[X(-5), Y(-17)], [X(5), Y(-17)], [X(7), Y(-11)], [X(0), Y(-8)], [X(-7), Y(-11)]], K.claro(c, .25), { w: .5 });
    s += K.l('M' + X(-5) + ' ' + Y(-17) + ' L' + X(-9) + ' ' + Y(-20) + ' M' + X(5) + ' ' + Y(-17) + ' L' + X(9) + ' ' + Y(-20) + ' M' + X(-7) + ' ' + Y(-11) + ' L' + X(-14) + ' ' + Y(-9) + ' M' + X(7) + ' ' + Y(-11) + ' L' + X(14) + ' ' + Y(-9) + ' M' + X(0) + ' ' + Y(-8) + ' L' + X(0) + ' ' + Y(-6), K.oscuro(c, .3), { w: .6 });
    return s + K.c(X(19.5), Y(-11.5), N(1.4 * e), P.tinta, { negro: 1, w: .3 }) + K.c(X(20), Y(-12), N(.5 * e), P.blanco, { sin: 1 }) + boca(K, X(20.5), Y(-8), N(1.4 * e));
  }
  function cangrejo(K, x, y, e) {
    var q = XY(x, y, e), X = q[0], Y = q[1], c = '#E8645A', dk = K.oscuro(c, .2), s = '';
    [-1, 1].forEach(function (sx) {
      for (var i = 0; i < 3; i++) s += K.l('M' + X(sx * 8) + ' ' + Y(-6 + i * 2) + ' L' + X(sx * (15 + i)) + ' ' + Y(-4 + i * 2) + ' L' + X(sx * (17 + i)) + ' ' + Y(0), dk, { w: N(1.2 * e) });
      s += K.l('M' + X(sx * 9) + ' ' + Y(-11) + ' Q' + X(sx * 14) + ' ' + Y(-16) + ' ' + X(sx * 16) + ' ' + Y(-17), dk, { w: N(1.4 * e) });
      s += K.p('M' + X(sx * 14) + ' ' + Y(-16) + ' Q' + X(sx * 12) + ' ' + Y(-24) + ' ' + X(sx * 17) + ' ' + Y(-25) + ' L' + X(sx * 16.5) + ' ' + Y(-20.5) + ' L' + X(sx * 21) + ' ' + Y(-22) + ' Q' + X(sx * 22) + ' ' + Y(-15) + ' ' + X(sx * 14) + ' ' + Y(-16) + ' Z', c, { w: .7 });
      s += K.l('M' + X(sx * 3) + ' ' + Y(-13) + ' L' + X(sx * 4) + ' ' + Y(-18), dk, { w: N(1 * e) }) + K.c(X(sx * 4), Y(-19.5), N(2.4 * e), P.blanco, { w: .5 }) + K.c(X(sx * 4), Y(-19.5), N(1.2 * e), P.tinta, { negro: 1, w: .2 });
    });
    return s + K.e(X(0), Y(-9), N(12 * e), N(6.5 * e), c, { w: .9 }) + boca(K, X(0), Y(-8), N(2 * e)) + mej(K, X(0), Y(-9), N(6 * e), N(1.6 * e));
  }
  function estrella(K, x, y, r, c, cara) { var pts = []; for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; pts.push([N(x + Math.cos(a) * rr), N(y + Math.sin(a) * rr)]); } return K.pl(pts, c || P.amarillo, { w: .8 }) + (cara ? ojos(K, x, N(y - r * .08), N(r * .2), N(r * .09)) + boca(K, x, N(y + r * .18), N(r * .16)) : ''); }
  function concha(K, x, y, e) { return K.p('M' + N(x - 6 * e) + ' ' + y + ' Q' + N(x - 7 * e) + ' ' + N(y - 8 * e) + ' ' + x + ' ' + N(y - 9 * e) + ' Q' + N(x + 7 * e) + ' ' + N(y - 8 * e) + ' ' + N(x + 6 * e) + ' ' + y + ' Z', '#F8C8B0', { w: .7 }) + K.l('M' + x + ' ' + y + ' L' + x + ' ' + N(y - 8 * e) + ' M' + x + ' ' + y + ' L' + N(x - 4 * e) + ' ' + N(y - 7 * e) + ' M' + x + ' ' + y + ' L' + N(x + 4 * e) + ' ' + N(y - 7 * e), '#C8907A', { w: .5 }); }
  function caracol(K, x, y, e, c) {
    c = c || '#F4A04A'; var q = XY(x, y, e), X = q[0], Y = q[1], sk = '#E8D8A8', s = '';
    s += K.l('M' + X(15) + ' ' + Y(-13) + ' L' + X(13) + ' ' + Y(-22) + ' M' + X(18) + ' ' + Y(-13) + ' L' + X(21) + ' ' + Y(-21), K.oscuro(sk, .35), { w: N(.9 * e) }) + K.c(X(13), Y(-22.5), N(1.5 * e), P.tinta, { negro: 1, w: .3 }) + K.c(X(21), Y(-21.5), N(1.5 * e), P.tinta, { negro: 1, w: .3 });
    s += K.p('M' + X(-17) + ' ' + Y(0) + ' Q' + X(-17) + ' ' + Y(-3.5) + ' ' + X(-9) + ' ' + Y(-3.5) + ' L' + X(11) + ' ' + Y(-3.5) + ' Q' + X(12) + ' ' + Y(-15) + ' ' + X(17) + ' ' + Y(-15) + ' Q' + X(22) + ' ' + Y(-15) + ' ' + X(21.5) + ' ' + Y(-6) + ' Q' + X(21) + ' ' + Y(0) + ' ' + X(12) + ' ' + Y(0) + ' Z', sk, { w: .8 });
    s += K.c(X(0), Y(-13), N(11 * e), c, { w: .9 }) + K.l('M' + X(1.5) + ' ' + Y(-13) + ' a' + N(1.5 * e) + ' ' + N(1.5 * e) + ' 0 1 1 ' + N(-3 * e) + ' 0 a' + N(3.5 * e) + ' ' + N(3.5 * e) + ' 0 1 1 ' + N(7 * e) + ' 0 a' + N(6 * e) + ' ' + N(6 * e) + ' 0 1 1 ' + N(-12 * e) + ' 0', K.oscuro(c, .35), { w: N(1 * e) });
    return s + boca(K, X(18.5), Y(-7.5), N(1.4 * e));
  }
  var PUN = [[-5, -4], [5, -4], [-6, 3], [6, 3], [-2.8, 8], [2.8, 8]];
  function mariquita(K, x, y, e, n) {
    e = e || 1; if (n == null) n = 6; var q = XY(x, y, e), X = q[0], Y = q[1], s = '';
    s += K.l('M' + X(-9) + ' ' + Y(-2) + ' L' + X(-13) + ' ' + Y(-4) + ' M' + X(-9) + ' ' + Y(3) + ' L' + X(-13) + ' ' + Y(5) + ' M' + X(-6) + ' ' + Y(7) + ' L' + X(-9) + ' ' + Y(11) + ' M' + X(9) + ' ' + Y(-2) + ' L' + X(13) + ' ' + Y(-4) + ' M' + X(9) + ' ' + Y(3) + ' L' + X(13) + ' ' + Y(5) + ' M' + X(6) + ' ' + Y(7) + ' L' + X(9) + ' ' + Y(11), P.negro, { w: N(.8 * e) });
    s += K.l('M' + X(-2) + ' ' + Y(-14) + ' Q' + X(-4) + ' ' + Y(-18) + ' ' + X(-6) + ' ' + Y(-17) + ' M' + X(2) + ' ' + Y(-14) + ' Q' + X(4) + ' ' + Y(-18) + ' ' + X(6) + ' ' + Y(-17), P.negro, { w: N(.7 * e) });
    s += K.c(X(0), Y(-9), N(5.5 * e), P.negro, { negro: 1, w: .4 }) + K.c(X(0), Y(1), N(10 * e), '#E8443A', { w: .9 }) + K.l('M' + X(0) + ' ' + Y(-9) + ' L' + X(0) + ' ' + Y(11), P.negro, { w: N(.8 * e) });
    PUN.slice(0, n).forEach(function (p) { s += K.c(X(p[0]), Y(p[1]), N(1.9 * e), P.negro, { negro: 1, w: .3 }); });
    return s + K.c(X(-2.2), Y(-11), N(1.3 * e), P.blanco, { w: .2 }) + K.c(X(2.2), Y(-11), N(1.3 * e), P.blanco, { w: .2 }) + K.c(X(-2), Y(-11), N(.6 * e), P.tinta, { negro: 1, w: .1 }) + K.c(X(2.4), Y(-11), N(.6 * e), P.tinta, { negro: 1, w: .1 });
  }
  function mariposa(K, x, y, e, c1, c2) {
    e = e || 1; c1 = c1 || '#F4A0C8'; c2 = c2 || '#C8A8E8'; var q = XY(x, y, e), X = q[0], Y = q[1], s = '';
    [-1, 1].forEach(function (sx) { s += K.e(X(sx * 9), Y(-5), N(9 * e), N(8 * e), c1, { w: .8 }) + K.e(X(sx * 7), Y(6), N(6 * e), N(6 * e), c2, { w: .8 }) + K.c(X(sx * 10), Y(-6), N(2.8 * e), P.blanco, { w: .4 }) + K.c(X(sx * 7.5), Y(7), N(1.8 * e), P.amarillo, { w: .3 }); });
    s += K.e(X(0), Y(1), N(2.2 * e), N(10 * e), P.negro, { w: .5 }) + K.c(X(0), Y(-11), N(3 * e), P.negro, { w: .5 });
    s += K.l('M' + X(-1) + ' ' + Y(-13.5) + ' Q' + X(-3) + ' ' + Y(-19) + ' ' + X(-6) + ' ' + Y(-19) + ' M' + X(1) + ' ' + Y(-13.5) + ' Q' + X(3) + ' ' + Y(-19) + ' ' + X(6) + ' ' + Y(-19), P.negro, { w: N(.7 * e) }) + K.c(X(-6), Y(-19), N(1 * e), P.negro, { negro: 1, w: .2 }) + K.c(X(6), Y(-19), N(1 * e), P.negro, { negro: 1, w: .2 });
    return s + K.c(X(-1.1), Y(-11.4), N(.7 * e), P.blanco, { sin: 1 }) + K.c(X(1.1), Y(-11.4), N(.7 * e), P.blanco, { sin: 1 });
  }
  function oruga(K, x, y, e, c) {
    c = c || '#9CD06A'; var q = XY(x, y, e), X = q[0], Y = q[1], s = '';
    [-16, -10, -4, 2].forEach(function (dx, i) { s += K.c(X(dx), Y(-4 - (i % 2) * 1.5), N(4 * e), i % 2 ? K.claro(c, .15) : c, { w: .7 }); });
    return s + K.c(X(9), Y(-7), N(5.4 * e), c, { w: .8 }) + K.l('M' + X(7) + ' ' + Y(-12) + ' L' + X(5) + ' ' + Y(-16) + ' M' + X(11) + ' ' + Y(-12) + ' L' + X(13) + ' ' + Y(-16), P.negro, { w: N(.7 * e) }) + ojos(K, X(9), Y(-8), N(2 * e), N(1 * e)) + boca(K, X(9.5), Y(-5), N(1.3 * e)) + mej(K, X(9), Y(-5.5), N(3.6 * e), N(1 * e));
  }
  function abeja(K, x, y, e) {
    e = e || 1; var q = XY(x, y, e), X = q[0], Y = q[1], s = '';
    s += K.e(X(-3), Y(-8), N(4.4 * e), N(6.4 * e), '#E4F2FC', { w: .6, op: .9 }) + K.e(X(3), Y(-9), N(4.4 * e), N(6.4 * e), '#E4F2FC', { w: .6, op: .9 });
    s += K.pl([[X(-9.5), Y(-1)], [X(-13.5), Y(0)], [X(-9.5), Y(1.5)]], P.negro, { w: .5 }) + K.e(X(0), Y(0), N(10 * e), N(7 * e), '#FFD24A', { w: .9 });
    [-4, 1.5].forEach(function (dx) { var h = 2 * 7 * Math.sqrt(1 - dx * dx / 100) - 1; s += K.r(X(dx - 1.4), N(y - h / 2 * e), N(2.8 * e), N(h * e), N(1 * e), P.negro, { negro: 1, w: .2 }); });
    return s + K.c(X(10), Y(-1), N(5 * e), '#FFD24A', { w: .8 }) + K.l('M' + X(9) + ' ' + Y(-5.5) + ' Q' + X(9) + ' ' + Y(-10) + ' ' + X(6) + ' ' + Y(-10) + ' M' + X(12) + ' ' + Y(-5.5) + ' Q' + X(13) + ' ' + Y(-10) + ' ' + X(16) + ' ' + Y(-9), P.negro, { w: N(.7 * e) }) + ojos(K, X(10.5), Y(-2), N(2 * e), N(1 * e)) + boca(K, X(11), Y(1), N(1.3 * e));
  }
  function hormiga(K, x, y, e, c) {
    c = c || '#7A5444'; var q = XY(x, y, e), X = q[0], Y = q[1], dk = K.oscuro(c, .3), s = '';
    [-10, -6, -2, 2, 6, 10].forEach(function (g) { var t = g < 0 ? -1 : 1; s += K.l('M' + X(t) + ' ' + Y(-5) + ' Q' + X((t + g) / 2) + ' ' + Y(-9) + ' ' + X(g) + ' ' + Y(0), dk, { w: N(.8 * e) }); });
    s += K.l('M' + X(7) + ' ' + Y(-11) + ' Q' + X(8) + ' ' + Y(-16) + ' ' + X(11) + ' ' + Y(-16) + ' M' + X(8.5) + ' ' + Y(-11) + ' Q' + X(11) + ' ' + Y(-14) + ' ' + X(13) + ' ' + Y(-13), dk, { w: N(.6 * e) });
    s += K.e(X(-8), Y(-6), N(5 * e), N(4 * e), c, { w: .7 }) + K.e(X(0), Y(-6), N(3 * e), N(2.4 * e), c, { w: .6 }) + K.c(X(6.5), Y(-8), N(3.6 * e), c, { w: .7 });
    return s + K.c(X(7.6), Y(-8.6), N(1.1 * e), P.blanco, { w: .2 }) + K.c(X(7.9), Y(-8.6), N(.6 * e), P.tinta, { negro: 1, w: .1 }) + boca(K, X(7.8), Y(-6.3), N(1 * e));
  }
  function arana(K, x, y, e, c) {
    c = c || '#7A6A9A'; var q = XY(x, y, e), X = q[0], Y = q[1], dk = K.oscuro(c, .3), s = '';
    [-1, 1].forEach(function (sx) { for (var i = 0; i < 4; i++) s += K.l('M' + X(sx * 3) + ' ' + Y(-9 + i * 2.5) + ' Q' + X(sx * 14) + ' ' + Y(-17 + i * 3) + ' ' + X(sx * (16 + i)) + ' ' + Y(-2 + i * 3), dk, { w: N(1.1 * e) }); });
    s += K.c(X(0), Y(-6), N(7 * e), c, { w: .9 });
    return s + K.c(X(-2.6), Y(-7.5), N(2 * e), P.blanco, { w: .4 }) + K.c(X(2.6), Y(-7.5), N(2 * e), P.blanco, { w: .4 }) + K.c(X(-2.3), Y(-7.3), N(1 * e), P.tinta, { negro: 1, w: .1 }) + K.c(X(2.9), Y(-7.3), N(1 * e), P.tinta, { negro: 1, w: .1 }) + boca(K, X(0), Y(-3.5), N(1.8 * e));
  }
  function colmena(K, x, y, e) { var s = ''; [[-4, 14, 4], [-11, 13, 4], [-18, 11, 4], [-24.5, 8, 3.6], [-30, 5, 3]].forEach(function (p) { s += K.e(x, N(y + p[0] * e), N(p[1] * e), N(p[2] * e), '#F2C04A', { w: .7 }); }); return s + K.e(x, N(y - 8 * e), N(3.4 * e), N(2.6 * e), P.marronO, { negro: 1, w: .4 }); }
  function caseta(K, x, y, w, h) { var hb = h * .62; return K.r(N(x - w / 2), N(y - hb), w, N(hb), 0, '#E8A060', { w: .8 }) + K.pl([[N(x - w / 2 - 4), N(y - hb + 1)], [x, N(y - h)], [N(x + w / 2 + 4), N(y - hb + 1)]], '#D85A48', { w: .8 }) + K.p('M' + N(x - w * .25) + ' ' + y + ' L' + N(x - w * .25) + ' ' + N(y - hb * .55) + ' A' + N(w * .25) + ' ' + N(w * .25) + ' 0 0 1 ' + N(x + w * .25) + ' ' + N(y - hb * .55) + ' L' + N(x + w * .25) + ' ' + y + ' Z', P.negro, { negro: 1, w: .5 }); }
  function pecera(K, x, y, r) { return K.c(x, N(y - r), r, '#EEF8FD', { w: .9 }) + K.p('M' + N(x - r * .954) + ' ' + N(y - r * 1.3) + ' A' + r + ' ' + r + ' 0 1 0 ' + N(x + r * .954) + ' ' + N(y - r * 1.3) + ' Z', P.agua, { w: .5 }) + K.e(x, N(y - r * 1.95), N(r * .5), 2, '#D4ECF8', { w: .7 }) + K.e(x, N(y - 2), N(r * .6), 2.2, P.arena, { w: .4 }); }
  function tarro(K, x, y, e) { return K.r(N(x - 8 * e), N(y - 18 * e), N(16 * e), N(18 * e), N(3 * e), '#F2B830', { w: .8 }) + K.r(N(x - 9 * e), N(y - 22 * e), N(18 * e), N(5 * e), N(1.5 * e), P.madera, { w: .7 }) + K.r(N(x - 6 * e), N(y - 13 * e), N(12 * e), N(7 * e), 1, P.blanco, { w: .4 }) + K.t(x, N(y - 8.2 * e), 'miel', { s: N(4 * e), b: 1 }); }
  function bellota(K, x, y, e) { return K.e(x, N(y + 1.5 * e), N(4 * e), N(5 * e), '#C8945A', { w: .7 }) + K.e(x, N(y - 3 * e), N(5 * e), N(2.8 * e), '#8A5A32', { w: .6 }) + K.l('M' + x + ' ' + N(y - 5.5 * e) + ' l' + N(.8 * e) + ' ' + N(-2.4 * e), '#5A3A22', { w: N(.8 * e) }); }
  function pino(K, x, y, h) { var w = h * .3, c = '#5E9E5A'; return K.r(N(x - 2.5), N(y - h * .25), 5, N(h * .25), 1, P.madera, { w: .6 }) + K.pl([[N(x - w), N(y - h * .25)], [x, N(y - h * .75)], [N(x + w), N(y - h * .25)]], c, { w: .8 }) + K.pl([[N(x - w * .8), N(y - h * .45)], [x, N(y - h * .9)], [N(x + w * .8), N(y - h * .45)]], c, { w: .8 }) + K.pl([[N(x - w * .6), N(y - h * .65)], [x, N(y - h)], [N(x + w * .6), N(y - h * .65)]], c, { w: .8 }); }
  function bambu(K, x, y, h) { var s = '', n = Math.floor(h / 16); for (var i = 0; i < n; i++) s += K.r(N(x - 2.5), N(y - (i + 1) * 16), 5, 16, 1.5, '#9CC86A', { w: .6 }); return s + K.e(N(x + 6), N(y - n * 16 + 4), 6, 2, P.hoja, { w: .5 }) + K.e(N(x - 6), N(y - n * 16 + 10), 6, 2, P.hoja, { w: .5 }); }
  function luna(K, x, y, r) { return K.p('M' + x + ' ' + N(y - r) + ' A' + r + ' ' + r + ' 0 1 0 ' + x + ' ' + N(y + r) + ' A' + N(r * .45) + ' ' + r + ' 0 1 1 ' + x + ' ' + N(y - r) + ' Z', '#FFF0A8', { w: .7 }); }
  function copo(K, x, y, r) { var d = ''; for (var i = 0; i < 3; i++) { var a = i * Math.PI / 3; d += 'M' + N(x - Math.cos(a) * r) + ' ' + N(y - Math.sin(a) * r) + ' L' + N(x + Math.cos(a) * r) + ' ' + N(y + Math.sin(a) * r) + ' '; } return K.l(d, '#8EC0EC', { w: .7 }); }
  function fondoMar(K) { return K.r(0, 0, 200, 150, 0, P.agua, { sin: 1, op: .45 }); }
  function burbujas(K, L) { return L.map(function (q) { return K.c(q[0], q[1], q[2] || 2, P.blanco, { w: .5 }); }).join(''); }
  function algas(K, x, y, h) { return K.l('M' + x + ' ' + y + ' Q' + N(x - 5) + ' ' + N(y - h * .33) + ' ' + x + ' ' + N(y - h * .55) + ' Q' + N(x + 5) + ' ' + N(y - h * .78) + ' ' + x + ' ' + N(y - h), '#4FA05A', { w: 2 }); }
  function puntos(K, x0, x1, y) { return K.c(x0, y, 2, P.tinta, { negro: 1, w: .2 }) + K.c(x1, y, 2, P.tinta, { negro: 1, w: .2 }); }

  var L = [
    /* ─────────── EL MAR ─────────── */
    { id: 'if_pez', fam: 'mar', n: 'Las partes del pez',
      d: function (K) { return fondoMar(K) + algas(K, 12, 150, 40) + algas(K, 188, 150, 34) + burbujas(K, [[140, 52, 2.4], [146, 44, 1.8], [150, 36, 1.4]]) + pez(K, 96, 72, 3) + etq(K, 150, 28, 'aleta') + flechita(K, 140, 30, 104, 38) + etq(K, 24, 40, 'cola') + flechita(K, 28, 44, 42, 56) + etq(K, 174, 58, 'ojo') + flechita(K, 166, 60, 124, 65) + etq(K, 176, 88, 'boca') + flechita(K, 164, 86, 130, 80) + etq(K, 50, 122, 'escamas') + flechita(K, 56, 114, 76, 84) + etq(K, 120, 140, 'El pez vive en el agua', 7); },
      intro: 'El pez vive en el agua. Nada con las aletas y la cola, y tiene el cuerpo cubierto de escamas.',
      q: [['¿Con qué nada el pez?', 'Con las aletas y la cola.'], ['¿Qué le cubre el cuerpo?', 'Escamas.'], ['¿Puede vivir el pez fuera del agua?', 'No: necesita el agua para respirar.']],
      porque: 'El pez respira por las branquias, que toman el aire que hay disuelto en el agua.' },
    { id: 'if_peces', fam: 'mar', n: 'Cuenta los peces',
      d: function (K) { var s = fondoMar(K) + algas(K, 192, 112, 30); [[34, 36, P.naranja], [120, 34, P.naranja], [78, 74, P.naranja], [160, 70, P.azul], [30, 96, P.azul], [120, 100, P.verde], [176, 30, P.verde]].forEach(function (f) { s += pez(K, f[0], f[1], 1.2, f[2]); }); [[30, P.naranja], [90, P.azul], [150, P.verde]].forEach(function (f) { s += pez(K, f[0], 126, .6, f[1]) + etq(K, f[0] + 20, 129, '= ?', 7); }); return s + etq(K, 100, 146, 'Cuenta los peces de cada color', 6.4); },
      intro: 'En el mar hay peces de muchos colores. Muchos nadan juntos en grupo.',
      q: [['¿Cuántos peces naranjas hay?', 'Tres.'], ['¿Cuántos peces azules hay?', 'Dos.'], ['¿Cuántos peces hay en total?', 'Siete.']],
      porque: 'Muchos peces nadan juntos en un grupo llamado banco para protegerse.' },
    { id: 'if_ballena', fam: 'mar', n: 'La ballena: grande y pequeño',
      d: function (K) { return fondoMar(K) + burbujas(K, [[150, 120, 1.8], [156, 112, 1.4]]) + ballena(K, 92, 70, 2.2) + pez(K, 180, 112, .6, P.amarillo) + etq(K, 60, 122, 'grande') + etq(K, 178, 128, 'pequeño') + etq(K, 100, 142, 'La ballena es el animal más grande', 6.8); },
      intro: 'La ballena es enorme y vive en el mar. Al lado de un pececito se ve todavía más grande.',
      q: [['¿Quién es más grande, la ballena o el pez?', 'La ballena.'], ['¿Por dónde sale el chorro de agua de la ballena?', 'Por un agujero en la cabeza, cuando respira.'], ['¿La ballena es un pez?', 'No: es un mamífero y respira aire.']],
      porque: 'La ballena azul es el animal más grande que ha existido; sube a la superficie para respirar aire.' },
    { id: 'if_pulpo', fam: 'mar', n: 'El pulpo y sus ocho brazos',
      d: function (K) { var s = fondoMar(K) + K.r(0, 124, 200, 26, 0, P.arena, { sin: 1 }) + K.e(176, 124, 20, 9, P.gris, { w: .7 }) + algas(K, 150, 124, 26) + pulpo(K, 66, 124, 2.5); for (var i = 0; i < 8; i++) s += etq(K, N(66 + (-12 + i * 24 / 7) * 2.5), 140, String(i + 1), 6); return s + etq(K, 150, 50, '8 brazos', 8) + etq(K, 150, 66, 'con ventosas', 6) + etq(K, 150, 94, '¡Cuéntalos!', 7); },
      intro: 'El pulpo vive en el mar, entre las rocas. Tiene ocho brazos con ventosas para agarrarse.',
      q: [['¿Cuántos brazos tiene el pulpo?', 'Ocho.'], ['¿Qué tiene en los brazos para agarrarse?', 'Ventosas.'], ['¿Dónde vive el pulpo?', 'En el mar, entre las rocas.']],
      porque: 'El pulpo puede cambiar de color para esconderse entre las rocas.' },
    { id: 'if_tortuga', fam: 'mar', n: 'La tortuga marina',
      d: function (K) { return agua(K, 40, .8) + K.p('M0 72 Q50 66 100 72 T200 70 L200 150 L0 150 Z', P.arena, { w: .6 }) + tortuga(K, 80, 124, 2.3) + K.e(166, 124, 20, 6, '#D8BC80', { w: .6 }) + [[158, 121], [166, 119], [174, 121], [162, 125], [170, 125]].map(function (p) { return K.c(p[0], p[1], 3.4, P.blanco, { w: .5 }); }).join('') + etq(K, 40, 56, 'caparazón') + flechita(K, 52, 60, 70, 80) + etq(K, 166, 140, 'huevos') + etq(K, 100, 18, 'La tortuga nace en la playa', 7); },
      intro: 'La tortuga marina vive en el mar, pero pone sus huevos en la arena de la playa.',
      q: [['¿Qué lleva la tortuga en la espalda?', 'Un caparazón.'], ['¿Dónde pone los huevos la tortuga marina?', 'En la arena de la playa.'], ['¿La tortuga es rápida o lenta en la tierra?', 'Lenta.']],
      porque: 'El caparazón es duro y protege a la tortuga como si fuera su casa.' },
    { id: 'if_playa', fam: 'mar', n: 'Vamos a la playa',
      d: function (K) { return sol(K, 24, 20, 8) + agua(K, 44, .85) + K.p('M0 86 Q50 80 100 86 T200 84 L200 150 L0 150 Z', P.arena, { w: .6 }) + cangrejo(K, 56, 120, 1.7) + estrella(K, 140, 112, 15, P.naranja, 1) + concha(K, 186, 120, 1.2) + etq(K, 56, 138, 'cangrejo') + etq(K, 140, 138, 'estrella de mar') + etq(K, 110, 22, 'Vamos a la playa', 7); },
      intro: 'En la playa viven animales pequeños: el cangrejo corre por la arena y la estrella de mar descansa junto al agua.',
      q: [['¿Cómo camina el cangrejo?', 'De lado.'], ['¿Cuántas puntas tiene la estrella de mar?', 'Cinco.'], ['¿Qué usa el cangrejo para agarrar?', 'Sus pinzas.']],
      porque: 'El cangrejo camina de lado porque sus patas se doblan mejor hacia los costados.' },
    { id: 'if_delfin', fam: 'mar', n: 'El delfín',
      d: function (K) { return agua(K, 86, .85) + delfin(K, 100, 52, 2.4) + [[30, 82], [36, 76], [170, 80], [176, 74]].map(function (p) { return K.e(p[0], p[1], 1.6, 2.4, P.agua, { w: .4 }); }).join('') + delfin(K, 150, 116, 1) + etq(K, 100, 142, 'El delfín respira aire', 7); },
      intro: 'El delfín vive en el mar y salta sobre las olas. Es muy listo y nada en grupo.',
      q: [['¿Dónde vive el delfín?', 'En el mar.'], ['¿Por qué sube a la superficie?', 'Para respirar aire.'], ['¿Los delfines viven solos o en grupo?', 'En grupo.']],
      porque: 'El delfín es un mamífero: respira aire por un agujero en la cabeza, igual que la ballena.' },
    /* ─────────── EL BOSQUE Y EL FRÍO ─────────── */
    { id: 'if_oso', fam: 'bos', n: 'El oso y la miel',
      d: function (K) { return prado(K, 122) + pino(K, 20, 122, 60) + pino(K, 184, 122, 70) + animal(K, 'oso', 82, 122, 1.9) + tarro(K, 122, 122, 1.4) + abeja(K, 142, 84, .55) + abeja(K, 158, 100, .5) + etq(K, 100, 140, 'Al oso le encanta la miel', 7); },
      intro: 'El oso vive en el bosque. Come frutas, raíces, peces y, sobre todo, le encanta la miel.',
      q: [['¿Qué le gusta comer al oso?', 'Miel, frutas, raíces y peces.'], ['¿Qué hace el oso en invierno?', 'Duerme mucho tiempo en su cueva.'], ['¿De qué color es este oso?', 'Marrón.']],
      porque: 'Antes del invierno el oso come mucho; así guarda energía para dormir varios meses.' },
    { id: 'if_zorro', fam: 'bos', n: 'El zorro del bosque',
      d: function (K) { return prado(K, 122) + pino(K, 16, 122, 64) + pino(K, 186, 122, 56) + [[40, 126, P.naranja], [120, 130, P.rojo], [160, 127, P.amarillo], [60, 132, P.rojo]].map(function (h) { return K.e(h[0], h[1], 3, 1.6, h[2], { w: .4 }); }).join('') + animal(K, 'zorro', 88, 122, 1.9) + etq(K, 40, 22, 'orejas puntiagudas', 6.2) + flechita(K, 54, 26, 68, 36) + etq(K, 162, 56, 'cola peluda') + flechita(K, 156, 60, 140, 72) + etq(K, 100, 142, 'El zorro vive en el bosque', 7); },
      intro: 'El zorro tiene el pelo naranja, las orejas puntiagudas y una cola larga y peluda.',
      q: [['¿Cómo es la cola del zorro?', 'Larga y peluda.'], ['¿De qué color es el zorro?', 'Naranja con el pecho blanco.'], ['¿Dónde vive el zorro?', 'En el bosque, en una madriguera.']],
      porque: 'Con sus orejas grandes el zorro oye a los ratones que se mueven bajo la tierra o la nieve.' },
    { id: 'if_buho', fam: 'bos', n: 'El búho: de día y de noche',
      d: function (K) { return K.r(0, 0, 100, 124, 0, '#D8ECFA', { sin: 1 }) + K.r(100, 0, 100, 124, 0, '#3A4A78', { sin: 1 }) + sol(K, 50, 26, 9) + luna(K, 168, 24, 10) + estrella(K, 122, 20, 3, '#FFF0A8') + estrella(K, 190, 52, 2.5, '#FFF0A8') + estrella(K, 126, 62, 2, '#FFF0A8') + estrella(K, 188, 12, 2, '#FFF0A8') + prado(K, 124) + rama(K, 4, 96, 96) + rama(K, 104, 196, 96) + ave(K, 'pajaro', 50, 96, 1.3) + ave(K, 'buho', 150, 96, 1.6) + K.t(50, 140, 'día', { s: 7, b: 1 }) + K.t(150, 140, 'noche', { s: 7, b: 1 }); },
      intro: 'Muchos pájaros duermen de noche, pero el búho hace lo contrario: duerme de día y caza de noche.',
      q: [['¿Cuándo está despierto el búho?', 'De noche.'], ['¿Qué hace el búho durante el día?', 'Duerme.'], ['¿Qué se ve en el cielo de noche?', 'La luna y las estrellas.']],
      porque: 'Los ojos grandes del búho captan muy poca luz: por eso ve bien en la oscuridad.' },
    { id: 'if_ardilla', fam: 'bos', n: 'La ardilla y las bellotas',
      d: function (K) { var s = prado(K, 122) + arbol(K, 18, 122, 70, 22) + animal(K, 'ardilla', 64, 122, 1.7); [[128, 92], [148, 92], [168, 92], [138, 112], [158, 112], [178, 112]].forEach(function (p) { s += bellota(K, p[0], p[1], 1.4); }); return s + etq(K, 110, 18, 'La ardilla guarda bellotas', 7) + etq(K, 100, 140, '¿Cuántas bellotas hay?', 6.8); },
      intro: 'La ardilla vive en los árboles. En otoño junta bellotas y nueces y las esconde para el invierno.',
      q: [['¿Cuántas bellotas hay?', 'Seis.'], ['¿Para qué guarda comida la ardilla?', 'Para comer en invierno, cuando hay poca.'], ['¿Para qué sirve su cola grande?', 'Para mantener el equilibrio al saltar y para abrigarse.']],
      porque: 'La ardilla esconde bellotas en muchos sitios; las que olvida pueden convertirse en árboles nuevos.' },
    { id: 'if_erizo', fam: 'bos', n: 'El erizo',
      d: function (K) { return prado(K, 122) + [[20, 128, P.naranja], [160, 130, P.rojo], [180, 126, P.amarillo]].map(function (h) { return K.e(h[0], h[1], 3.4, 1.8, h[2], { w: .4 }); }).join('') + animal(K, 'erizo', 88, 122, 2) + K.c(96, 42, 6, P.rojo, { w: .7 }) + K.e(99, 35, 2.6, 1.3, P.hoja, { w: .4 }) + etq(K, 160, 50, 'púas') + flechita(K, 152, 54, 130, 68) + etq(K, 100, 142, 'El erizo se hace una bola', 7); },
      intro: 'El erizo es pequeño y tiene la espalda cubierta de púas. Sale de noche a buscar insectos.',
      q: [['¿Qué tiene el erizo en la espalda?', 'Púas.'], ['¿Qué hace el erizo si tiene miedo?', 'Se enrolla y se hace una bola.'], ['¿Cuándo sale a buscar comida?', 'Por la noche.']],
      porque: 'Hecho una bola, el erizo solo enseña las púas y los demás animales no se atreven a tocarlo.' },
    { id: 'if_frio', fam: 'bos', n: 'Animales del frío',
      d: function (K) { var s = K.r(0, 0, 200, 150, 0, '#E8F4FC', { sin: 1 }) + K.p('M0 112 Q50 104 100 110 T200 108 L200 150 L0 150 Z', P.blanco, { w: .7 }) + K.l('M100 34 L100 146', P.aguaO, { d: '3 3', w: .8 }) + K.pl([[4, 110], [14, 84], [26, 92], [34, 110]], '#CDE6F4', { w: .7 }); [[30, 40], [78, 54], [120, 44], [186, 36], [176, 76]].forEach(function (p) { s += copo(K, p[0], p[1], 3.4); }); return s + ave(K, 'pinguino', 56, 124, 1.6) + animal(K, 'osoPolar', 150, 124, 1.6) + etq(K, 50, 22, 'Polo Sur', 7) + etq(K, 150, 22, 'Polo Norte', 7) + etq(K, 56, 140, 'pingüino') + etq(K, 150, 140, 'oso polar'); },
      intro: 'Donde hace mucho frío también viven animales. Tienen grasa y plumas o pelo espeso para no helarse.',
      q: [['¿Qué animales viven donde hace mucho frío?', 'El pingüino y el oso polar.'], ['¿Puede volar el pingüino?', 'No, pero nada muy bien.'], ['¿De qué color es el oso polar?', 'Blanco.']],
      porque: 'El oso polar vive en el Polo Norte y el pingüino en el Polo Sur: nunca se encuentran.' },
    { id: 'if_panda', fam: 'bos', n: 'El panda y el bambú',
      d: function (K) { return prado(K, 122) + bambu(K, 12, 122, 96) + bambu(K, 28, 122, 80) + bambu(K, 172, 122, 80) + bambu(K, 188, 122, 112) + animal(K, 'panda', 82, 122, 1.9) + bambu(K, 114, 118, 48) + etq(K, 150, 56, 'bambú') + flechita(K, 140, 58, 120, 70) + etq(K, 100, 142, 'El panda come bambú', 7); },
      intro: 'El panda es blanco y negro y vive en los bosques de montaña de China. Casi solo come bambú.',
      q: [['¿Qué come el panda?', 'Bambú.'], ['¿De qué colores es el panda?', 'Blanco y negro.'], ['¿En qué país vive el panda?', 'En China.']],
      porque: 'El panda pasa casi todo el día comiendo bambú, porque es una comida que alimenta poco.' },
    /* ─────────── BICHITOS DEL JARDÍN ─────────── */
    { id: 'if_mariquita', fam: 'bic', n: 'Los puntos de la mariquita',
      d: function (K) { var s = ''; [[40, 2], [100, 4], [160, 6]].forEach(function (m) { s += K.e(m[0], 80, 26, 8, P.hoja, { w: .7 }) + mariquita(K, m[0], 64, 1.8, m[1]) + K.r(m[0] - 11, 98, 22, 16, 3, P.blanco, { w: .7 }); }); return s + etq(K, 100, 18, 'Cuenta los puntos', 7) + etq(K, 100, 136, '¿Cuál tiene más?', 7); },
      intro: 'La mariquita es roja con puntos negros. No todas tienen el mismo número de puntos.',
      q: [['¿Cuántos puntos tiene cada mariquita?', 'Dos, cuatro y seis.'], ['¿Cuál tiene más puntos?', 'La de seis puntos.'], ['¿Cuántos puntos hay en total?', 'Doce.']],
      porque: 'Los colores vivos de la mariquita avisan a los pájaros de que sabe mal y no conviene comerla.' },
    { id: 'if_mariposa', fam: 'bic', n: 'De oruga a mariposa',
      d: function (K) { return K.e(20, 84, 13, 5, P.hoja, { w: .6 }) + K.c(15, 80, 2.2, P.crema, { w: .4 }) + K.c(21, 79, 2.2, P.crema, { w: .4 }) + K.c(27, 80, 2.2, P.crema, { w: .4 }) + oruga(K, 76, 86, 1.4) + K.r(104, 40, 40, 4, 2, P.madera, { w: .6 }) + K.l('M124 44 L124 57', P.marronO, { w: .6 }) + K.e(124, 70, 5.5, 13, '#A8C878', { w: .8 }) + K.l('M120 64 Q124 66 128 64 M120 72 Q124 74 128 72', '#6E8A4A', { w: .5 }) + mariposa(K, 174, 78, 1.3) + flechita(K, 35, 82, 45, 82) + flechita(K, 99, 76, 114, 76) + flechita(K, 132, 76, 146, 76) + etq(K, 20, 112, 'huevo', 5.8) + etq(K, 76, 112, 'oruga', 5.8) + etq(K, 124, 112, 'crisálida', 5.8) + etq(K, 174, 112, 'mariposa', 5.8) + etq(K, 100, 20, 'La oruga se convierte en mariposa', 6.6) + etq(K, 100, 136, 'Este cambio se llama metamorfosis', 6.4); },
      intro: 'La mariposa empieza como un huevo. De él sale una oruga, que se encierra en una crisálida y sale convertida en mariposa.',
      q: [['¿Qué sale del huevo de la mariposa?', 'Una oruga.'], ['¿Qué pasa dentro de la crisálida?', 'La oruga se transforma en mariposa.'], ['¿Qué come la oruga?', 'Hojas.']],
      porque: 'La oruga come muchas hojas para crecer; después descansa en la crisálida mientras su cuerpo cambia.' },
    { id: 'if_abeja', fam: 'bic', n: 'La abeja y las flores',
      d: function (K) { return prado(K, 124) + flor(K, 36, 124, '#F4A0C8', 3) + flor(K, 96, 124, '#C8A8E8', 2.4) + colmena(K, 172, 124, 1.6) + K.l('M30 70 Q60 40 96 66 T150 60', P.tinta, { d: '2 3', w: .7 }) + abeja(K, 62, 54, 1.2) + abeja(K, 122, 74, 1.1) + etq(K, 172, 62, 'colmena') + etq(K, 100, 142, 'La abeja hace miel', 7); },
      intro: 'La abeja vuela de flor en flor para tomar su néctar. Con él fabrica miel en la colmena.',
      q: [['¿Qué hace la abeja en las flores?', 'Toma el néctar y lleva polen de una flor a otra.'], ['¿Qué fabrica la abeja?', 'Miel.'], ['¿Dónde vive la abeja?', 'En la colmena.']],
      porque: 'Al llevar polen de flor en flor, la abeja ayuda a que nazcan frutas y semillas.' },
    { id: 'if_caracol', fam: 'bic', n: 'Lento y rápido',
      d: function (K) { var s = K.r(0, 50, 200, 30, 0, '#EAF4DA', { sin: 1 }) + K.r(0, 106, 200, 30, 0, '#EAF4DA', { sin: 1 }); for (var i = 0; i < 12; i++) s += K.r(178, 46 + i * 8, 8, 8, 0, i % 2 ? P.blanco : P.negro, { w: .3, negro: i % 2 ? 0 : 1 }); return s + caracol(K, 44, 76, 1.4) + K.l('M100 108 L116 108 M96 116 L114 116 M100 124 L116 124', P.tinta, { w: .7 }) + animal(K, 'conejo', 142, 132, .9) + etq(K, 104, 68, 'lento') + etq(K, 66, 122, 'rápido') + etq(K, 182, 40, 'meta', 6) + etq(K, 96, 22, '¿Quién llega primero a la meta?', 6.6); },
      intro: 'El caracol avanza muy despacio. El conejo, en cambio, corre y salta muy rápido.',
      q: [['¿Quién es más lento, el caracol o el conejo?', 'El caracol.'], ['¿Quién llegará primero a la meta?', 'El conejo.'], ['¿Qué lleva el caracol a cuestas?', 'Su concha, que es su casa.']],
      porque: 'El caracol avanza sobre una baba que deja en el suelo; así se desliza sin hacerse daño.' },
    { id: 'if_hormigas', fam: 'bic', n: 'Las hormigas trabajan en equipo',
      d: function (K) { var s = K.r(0, 120, 200, 30, 0, '#EAD8B4', { sin: 1 }) + K.p('M140 122 Q170 84 200 122 Z', '#C8A070', { w: .8 }) + K.e(170, 108, 5, 3.5, P.negro, { negro: 1, w: .3 }); [22, 54, 86, 118].forEach(function (x, i) { s += hormiga(K, x, 120, 1.5) + (i % 2 ? K.c(x - 9, 102, 3.6, P.crema, { w: .5 }) : K.e(x - 9, 103, 6, 3, P.hoja, { w: .5 })); }); return s + etq(K, 100, 22, 'Las hormigas trabajan en equipo', 6.8) + etq(K, 100, 140, '¿Cuántas hormigas hay?', 6.8); },
      intro: 'Las hormigas viven juntas en el hormiguero y se ayudan para llevar la comida.',
      q: [['¿Cómo trabajan las hormigas?', 'En equipo, ayudándose.'], ['¿Cuántas hormigas hay en la fila?', 'Cuatro.'], ['¿Dónde viven las hormigas?', 'En el hormiguero, bajo la tierra.']],
      porque: 'Una hormiga puede cargar mucho más que su propio peso, y juntas mueven cosas enormes.' },
    { id: 'if_patas', fam: 'bic', n: '¿Cuántas patas tiene?',
      d: function (K) { return K.l('M148 0 L148 82', P.gris, { w: .6 }) + hormiga(K, 52, 96, 2.6) + arana(K, 148, 96, 2.4) + etq(K, 52, 116, '6 patas', 7) + etq(K, 148, 128, '8 patas', 7) + etq(K, 100, 18, '¿Cuántas patas tiene?', 7) + etq(K, 100, 142, 'La hormiga tiene 6 patas; la araña, 8', 6.2); },
      intro: 'La hormiga es un insecto y tiene seis patas. La araña no es un insecto: tiene ocho.',
      q: [['¿Cuántas patas tiene la hormiga?', 'Seis.'], ['¿Cuántas patas tiene la araña?', 'Ocho.'], ['¿La araña es un insecto?', 'No: los insectos tienen seis patas y la araña tiene ocho.']],
      porque: 'Todos los insectos tienen seis patas y el cuerpo dividido en tres partes.' },
    { id: 'if_jardin', fam: 'bic', n: 'Bichitos del jardín',
      d: function (K) { return prado(K, 96) + flor(K, 92, 96, '#F4A0C8', 2) + flor(K, 128, 96, P.amarillo, 1.6) + flor(K, 184, 96, '#C8A8E8', 2) + flor(K, 12, 96, P.rojo, 1.6) + abeja(K, 40, 40, 1.1) + mariposa(K, 150, 36, 1.2) + caracol(K, 40, 128, 1.2) + K.e(104, 128, 16, 6, P.hoja, { w: .6 }) + mariquita(K, 104, 122, 1.1) + oruga(K, 166, 128, 1.1) + etq(K, 40, 58, 'abeja', 6) + etq(K, 150, 64, 'mariposa', 6) + etq(K, 40, 142, 'caracol', 6) + etq(K, 104, 144, 'mariquita', 6) + etq(K, 164, 142, 'oruga', 6) + etq(K, 90, 14, 'Bichitos del jardín', 6.6); },
      intro: 'En el jardín viven muchos bichitos: unos vuelan entre las flores y otros caminan por el suelo.',
      q: [['Nombra los bichitos del dibujo.', 'Abeja, mariposa, caracol, mariquita y oruga.'], ['¿Cuáles vuelan?', 'La abeja y la mariposa (la mariquita también puede volar).'], ['¿Cuál lleva su casa a cuestas?', 'El caracol.']],
      porque: 'Los bichitos ayudan al jardín: unos llevan polen a las flores y otros se comen las plagas.' },
    /* ─────────── APRENDO CON ANIMALES ─────────── */
    { id: 'if_tamanos', fam: 'apr', n: 'Grande, mediano y pequeño',
      d: function (K) { return prado(K, 122) + animal(K, 'elefante', 42, 122, 1.5) + animal(K, 'perro', 114, 122, 1) + animal(K, 'raton', 170, 122, .6) + etq(K, 42, 136, 'grande') + etq(K, 114, 136, 'mediano') + etq(K, 170, 136, 'pequeño') + etq(K, 100, 18, 'Grande, mediano y pequeño', 7); },
      intro: 'Los animales tienen tamaños muy distintos. Podemos ordenarlos de grande a pequeño.',
      q: [['¿Cuál es el animal más grande?', 'El elefante.'], ['¿Cuál es el más pequeño?', 'El ratón.'], ['Ordénalos de pequeño a grande.', 'Ratón, perro, elefante.']],
      porque: 'Comparar tamaños nos ayuda a ordenar las cosas: de pequeño a grande o de grande a pequeño.' },
    { id: 'if_colores', fam: 'apr', n: 'Animales de colores',
      d: function (K) { return rana(K, 34, 60, 1.3) + ave(K, 'pollito', 100, 60, 1.2) + animal(K, 'cerdo', 166, 60, .75) + ave(K, 'pajaro', 34, 124, 1.2) + animal(K, 'zorro', 96, 124, .75) + animal(K, 'oso', 166, 124, .75) + pildora(K, 34, 72, 42, 12, P.verde, 'verde') + pildora(K, 100, 72, 42, 12, P.amarillo, 'amarillo') + pildora(K, 166, 72, 42, 12, P.rosa, 'rosado') + pildora(K, 34, 136, 42, 12, P.azul, 'azul') + pildora(K, 100, 136, 42, 12, P.naranja, 'naranja') + pildora(K, 166, 136, 42, 12, P.marron, 'marrón'); },
      intro: 'Cada animal tiene su color. Mira los animales y lee el nombre de su color.',
      q: [['¿De qué color es la rana?', 'Verde.'], ['¿Qué animal es amarillo?', 'El pollito.'], ['Busca en tu clase algo del color del zorro.', 'Respuesta abierta: algo naranja.']],
      porque: 'Algunos animales usan su color para esconderse y otros para que los vean desde lejos.' },
    { id: 'if_posicion', fam: 'apr', n: 'Arriba, abajo, dentro y fuera',
      d: function (K) { return prado(K, 122) + arbol(K, 48, 122, 70, 26) + ave(K, 'pajaro', 48, 28, .9) + animal(K, 'gato', 72, 122, .85) + caseta(K, 150, 122, 40, 48) + animal(K, 'perro', 150, 124, .55) + animal(K, 'conejo', 188, 122, .6) + etq(K, 92, 20, 'arriba') + flechita(K, 80, 18, 62, 18) + etq(K, 74, 136, 'abajo') + etq(K, 150, 136, 'dentro') + etq(K, 188, 136, 'fuera') + etq(K, 150, 40, '¿Dónde está?', 7); },
      intro: 'Arriba, abajo, dentro y fuera son palabras que dicen dónde está cada animal.',
      q: [['¿Quién está arriba del árbol?', 'El pájaro.'], ['¿Quién está abajo?', 'El gato.'], ['¿Quién está dentro de la caseta y quién fuera?', 'Dentro, el perro; fuera, el conejo.']],
      porque: 'Las palabras arriba, abajo, dentro y fuera nos ayudan a decir dónde están las cosas.' },
    { id: 'if_mama_bebe', fam: 'apr', n: 'Mamás y bebés',
      d: function (K) { var s = etq(K, 100, 10, 'Une cada mamá con su bebé', 6.4); s += animal(K, 'vaca', 36, 52, .72) + ave(K, 'gallina', 36, 94, .9) + animal(K, 'oveja', 36, 136, .72) + ave(K, 'pollito', 164, 52, .6) + animal(K, 'vaca', 164, 94, .45) + animal(K, 'oveja', 164, 136, .45); [38, 80, 122].forEach(function (y) { s += puntos(K, 72, 128, y); }); return s + etq(K, 36, 60, 'vaca', 5.6) + etq(K, 36, 102, 'gallina', 5.6) + etq(K, 36, 144, 'oveja', 5.6) + etq(K, 164, 60, 'pollito', 5.6) + etq(K, 164, 102, 'ternero', 5.6) + etq(K, 164, 144, 'cordero', 5.6); },
      intro: 'Los bebés de los animales tienen nombres propios. Une cada mamá con su bebé.',
      q: [['¿Cómo se llama el bebé de la vaca?', 'Ternero.'], ['¿Y el de la oveja?', 'Cordero.'], ['¿Y el de la gallina?', 'Pollito.']],
      porque: 'Los bebés se parecen a su mamá y aprenden de ella a buscar comida.' },
    { id: 'if_que_come', fam: 'apr', n: '¿Qué come cada animal?',
      d: function (K) { var s = etq(K, 100, 10, 'Une cada animal con su comida', 6.4); s += animal(K, 'conejo', 36, 52, .62) + animal(K, 'mono', 32, 94, .7) + animal(K, 'oso', 36, 136, .7) + platano(K, 164, 40, 1.4) + tarro(K, 164, 94, 1.2) + zanahoria(K, 164, 117, 1.1, 1); [38, 80, 122].forEach(function (y) { s += puntos(K, 72, 128, y); }); return s + etq(K, 36, 60, 'conejo', 5.6) + etq(K, 36, 102, 'mono', 5.6) + etq(K, 36, 144, 'oso', 5.6) + etq(K, 164, 60, 'plátano', 5.6) + etq(K, 184, 102, 'miel', 5.6) + etq(K, 184, 140, 'zanahoria', 5.6); },
      intro: 'Cada animal come cosas distintas. Une cada animal con la comida que más le gusta.',
      q: [['¿Qué come el conejo?', 'Zanahorias y hierba.'], ['¿Qué le gusta al mono?', 'El plátano.'], ['¿Qué animal busca la miel?', 'El oso.']],
      porque: 'Cada animal come lo que su cuerpo necesita: unos comen plantas y otros, carne.' },
    { id: 'if_donde_vive', fam: 'apr', n: '¿Dónde vive cada animal?',
      d: function (K) { return K.r(18, 60, 64, 4, 2, P.madera, { w: .6 }) + ave(K, 'pajaro', 50, 54, .8) + nido(K, 50, 58, 18) + colmena(K, 150, 62, 1.3) + abeja(K, 182, 32, .7) + caseta(K, 46, 128, 40, 44) + animal(K, 'perro', 84, 128, .6) + pecera(K, 150, 128, 18) + pez(K, 150, 112, .7, P.naranja) + etq(K, 50, 74, 'nido') + etq(K, 150, 74, 'colmena') + etq(K, 46, 142, 'caseta') + etq(K, 150, 142, 'pecera'); },
      intro: 'Cada animal tiene su casa: el pájaro hace un nido y las abejas viven en la colmena.',
      q: [['¿Dónde vive el pájaro?', 'En el nido.'], ['¿Dónde vive la abeja?', 'En la colmena.'], ['¿Dónde vive el pez de casa?', 'En la pecera.']],
      porque: 'Cada animal busca o construye un lugar donde descansar y proteger a sus crías.' }
  ];
  IK.extra = { pez: pez, ballena: ballena, delfin: delfin, pulpo: pulpo, tortuga: tortuga, cangrejo: cangrejo, estrella: estrella, caracol: caracol, mariquita: mariquita, mariposa: mariposa, oruga: oruga, abeja: abeja, hormiga: hormiga, arana: arana };
  MO.agregar('infantil', L, { nombre: 'Infantil', familias: IK.FAM, materias: /^(infantil)$/ });
})();
