/* b6_pelu_tecnica.js — Peluquería técnica: elevaciones, fichas de corte y divisiones como modelos de la biblioteca.
   Reutiliza lo que ya existe en el Estudio:
     · EU_CORTES (b6_cortes.js): los 40 cortes con su pila de elevaciones por zona, partición, herramienta y regla del cabello.
     · EU_DIVISIONES (b6_divisiones.js): las 27 láminas de divisiones de la cabeza (perfil, planta y nuca).
   Modelos nuevos (familias 'tec' y 'div' de la materia 'pelu'):
     · pe_elev_0 … pe_elev_180: cabeza de perfil con las capas de color elevadas y el transportador.
     · pe_elev_escala: los cinco ángulos y lo que hace cada uno.
     · pe_ficha_<corte>: ficha técnica de cada corte (pila de 7 zonas con su ángulo, partición, herramienta y cabello).
     · pe_div_<lámina>: cada lámina de divisiones, rasterizada a 2x desde el motor de lienzo.
   Cargar después de b6_lib_peluqueria4.js, b6_cortes.js y b6_divisiones.js. */
(function () {
  'use strict';
  var MO = window.EU_MODELOS; if (!MO || MO.modelo('pe_elev_0')) return;
  var RAD = Math.PI / 180;
  var P = { piel: '#F3D3B8', casco: '#E6D2BE', trazo: '#3A2E28', base: '#2E2E34', rojo: '#C8323A', papel: '#F6F3EE', tinta: '#2B2B3D', gris: '#8A8A96' };
  /* capas de la nuca (violeta) a la coronilla (rojo), como en las fichas de academia */
  var ARCO = ['#6A3FB5', '#2E6FD8', '#2FA36B', '#E2B91E', '#F08A24', '#D7263D'];
  /* color de cada ángulo, el mismo en la escala, las fichas y las tablas */
  function colAng(a) { return a <= 0 ? '#2E6FD8' : a <= 45 ? '#2FA36B' : a <= 90 ? '#E2A01E' : a <= 135 ? '#F06424' : '#D7263D'; }
  function r1(n) { return Math.round(n * 10) / 10; }

  /* ─── cabeza de maniquí de perfil, mirando a la derecha (la misma geometría que b6_divisiones) ─── */
  function pt(cx, cy, R, ang) { return [cx + R * Math.cos(ang * RAD), cy + R * 1.02 * Math.sin(ang * RAD)]; }
  function contorno(cx, cy, R) {
    var a = pt(cx, cy, R, -55), b = pt(cx, cy, R, 145), q = function (x1, y1, x2, y2) { return ' Q' + r1(cx + R * x1) + ' ' + r1(cy + R * y1) + ' ' + r1(cx + R * x2) + ' ' + r1(cy + R * y2); };
    return 'M' + r1(a[0]) + ' ' + r1(a[1]) + ' A' + r1(R) + ' ' + r1(R * 1.02) + ' 0 0 0 ' + r1(b[0]) + ' ' + r1(b[1]) +
      q(-.74, .86, -.44, .94) + q(-.10, 1.08, .55, .99) + q(.78, .94, .80, .78) + q(.84, .64, .90, .56) + q(.84, .50, 1.10, .40) + q(.90, .24, .94, .08) + q(1.0, -.22, .76, -.62) + ' Z';
  }
  function zonaPelo(cx, cy, R) {
    var a = pt(cx, cy, R * .99, -55), b = pt(cx, cy, R * .99, 145), q = function (x1, y1, x2, y2) { return ' Q' + r1(cx + R * x1) + ' ' + r1(cy + R * y1) + ' ' + r1(cx + R * x2) + ' ' + r1(cy + R * y2); };
    return 'M' + r1(a[0]) + ' ' + r1(a[1]) + ' A' + r1(R * .99) + ' ' + r1(R * 1.01) + ' 0 0 0 ' + r1(b[0]) + ' ' + r1(b[1]) + q(-.70, .66, -.30, .52) + q(.12, .36, .34, -.10) + q(.52, -.46, .57, -.84) + ' Z';
  }
  function cabeza(K, cx, cy, R) {
    var s = K.suelo(cx, cy + R * 1.78, R * .7);
    s += K.r(cx - R * .5, cy + R * 1.42, R * .9, R * .34, 2, P.base);
    s += K.p('M' + r1(cx - R * .52) + ' ' + r1(cy + R * .7) + ' Q' + r1(cx - R * .5) + ' ' + r1(cy + R * 1.2) + ' ' + r1(cx - R * .44) + ' ' + r1(cy + R * 1.44) + ' L' + r1(cx + R * .36) + ' ' + r1(cy + R * 1.44) + ' Q' + r1(cx + R * .3) + ' ' + r1(cy + R * 1.15) + ' ' + r1(cx + R * .34) + ' ' + r1(cy + R * .95) + ' Z', K.oscuro(P.piel, .06));
    s += K.p(contorno(cx, cy, R), P.piel);
    s += K.p(zonaPelo(cx, cy, R), P.casco);
    s += K.e(cx + R * .12, cy + R * .2, R * .11, R * .17, K.oscuro(P.piel, .08));
    s += K.l('M' + r1(cx + R * .66) + ' ' + r1(cy + R * .12) + ' q' + r1(R * .07) + ' ' + r1(R * .05) + ' ' + r1(R * .14) + ' 0', P.trazo, { w: .9 });
    s += K.l('M' + r1(cx + R * .7) + ' ' + r1(cy + R * .02) + ' q' + r1(R * .08) + ' ' + r1(-R * .05) + ' ' + r1(R * .17) + ' -.2', P.trazo, { w: .7, op: .6 });
    s += K.brillo(cx - R * .1, cy - R * .62, R * .32, R * .1, -18);
    return s;
  }
  function tijera(K, x, y, ang) {
    var g = '<g transform="translate(' + r1(x) + ' ' + r1(y) + ') rotate(' + r1(ang) + ')">';
    g += K.pl([[0, 0], [15, -1.6], [15.6, -.4], [0, 1]], '#9AA2AA');
    g += K.pl([[0, 0], [15, 1.6], [15.6, .4], [0, -1]], '#C3C9CF');
    g += K.c(0, 0, .9, P.tinta) + '<ellipse cx="-5" cy="-3.2" rx="3.6" ry="2.4" fill="none" stroke="' + P.tinta + '" stroke-width="1.5"/><ellipse cx="-5" cy="3.2" rx="3.6" ry="2.4" fill="none" stroke="' + P.tinta + '" stroke-width="1.5"/>';
    return g + '</g>';
  }
  /* transportador: diámetro vertical a la izquierda, arco a la derecha. 0° abajo, 90° de frente, 180° arriba. */
  function transportador(K, cx, cy, r, a) {
    var s = K.p('M' + cx + ' ' + (cy + r) + ' A' + r + ' ' + r + ' 0 0 0 ' + cx + ' ' + (cy - r) + ' Z', P.papel);
    s += K.l('M' + cx + ' ' + (cy - r) + ' L' + cx + ' ' + (cy + r) + ' M' + cx + ' ' + cy + ' L' + (cx + r) + ' ' + cy, P.gris, { w: .6, op: .7 });
    for (var g = 0; g <= 180; g += 10) {
      var sn = Math.sin(g * RAD), cs = Math.cos(g * RAD), l = g % 45 === 0 ? 4.5 : 2.2;
      s += K.l('M' + r1(cx + r * sn) + ' ' + r1(cy + r * cs) + ' L' + r1(cx + (r - l) * sn) + ' ' + r1(cy + (r - l) * cs), P.tinta, { w: g % 45 === 0 ? .9 : .5 });
      if (g % 45 === 0 && g > 0 && g < 180) s += K.t(cx + (r - 10) * sn + 1, cy + (r - 10) * cs + 2, g + '°', { s: 4.6, c: P.gris });
    }
    if (a != null) {
      var sx = cx + r * Math.sin(a * RAD), sy = cy + r * Math.cos(a * RAD);
      s += K.l('M' + cx + ' ' + cy + ' L' + r1(sx) + ' ' + r1(sy), P.rojo, { w: 1.8 }) + K.c(sx, sy, 1.8, P.rojo) + K.c(cx, cy, 1.4, P.tinta);
    }
    return s;
  }

  /* ─── 1 · las cinco elevaciones ─── */
  var NOMBRE = { 0: 'Sin elevación', 45: 'Elevación baja', 90: 'Elevación media', 135: 'Elevación alta', 180: 'Elevación total' };
  var EFECTO = {
    0: ['Línea sólida: todo el largo cae sobre la guía.', 'Bob recto, melena de un largo, flequillo recto.', 'Todo el peso se queda en el borde.'],
    45: ['Graduación: el peso se acumula justo encima del borde.', 'Bob graduado, nuca en A, caballero clásico.', 'Cada capa queda un poco más corta que la de abajo y se apoya en ella.'],
    90: ['Capas uniformes: todas las mechas miden lo mismo.', 'Capas redondas, corte de caballero a tijera, rizado.', 'Al sacar cada mecha perpendicular al cráneo, la distancia al filo es igual en toda la cabeza.'],
    135: ['Capas largas: arriba más corto, abajo conserva el largo.', 'Desfilado en capas, shag, wolf cut.', 'Las mechas de abajo recorren más camino hasta el filo y quedan más largas.'],
    180: ['Capas superlargas: todo se reúne arriba y se corta en un punto.', 'Capas en cascada, corte «unicornio», melena larga con movimiento.', 'Al juntar todo el pelo en la coronilla, la nuca es la que más largo conserva.']
  };
  function elevacion(K, a) {
    var cx = 70, cy = 66, R = 28, d = [Math.sin(a * RAD), Math.cos(a * RAD)], pp = [Math.cos(a * RAD), -Math.sin(a * RAD)];
    var mues = [];
    for (var g = -55; g >= -215; g -= 10) mues.push(pt(cx, cy, R, g));
    [[1.1, .4], [.94, .08], [.55, .99], [.8, .78]].forEach(function (q) { mues.push([cx + R * q[0], cy + R * q[1]]); });
    var D = -1e9; mues.forEach(function (m) { D = Math.max(D, (m[0] - cx) * d[0] + (m[1] - cy) * d[1]); }); D += R * .2;
    var s = cabeza(K, cx, cy, R), fin = [], smin = 1e9, smax = -1e9, lin = '';
    for (var i = 0; i < 6; i++) {
      var th = 140 + i * 32, o = pt(cx, cy, R * .97, th), t = D - ((o[0] - cx) * d[0] + (o[1] - cy) * d[1]);
      var e = [o[0] + t * d[0], o[1] + t * d[1]], sp = (e[0] - cx) * pp[0] + (e[1] - cy) * pp[1];
      smin = Math.min(smin, sp); smax = Math.max(smax, sp); fin.push(e);
      lin += K.l('M' + r1(o[0]) + ' ' + r1(o[1]) + ' L' + r1(e[0]) + ' ' + r1(e[1]), ARCO[i], { w: 2.1 }) + K.c(o[0], o[1], 1.3, ARCO[i]);
    }
    s += lin;
    var c0 = [cx + D * d[0], cy + D * d[1]], A = [c0[0] + (smin - 7) * pp[0], c0[1] + (smin - 7) * pp[1]], B = [c0[0] + (smax + 7) * pp[0], c0[1] + (smax + 7) * pp[1]];
    s += K.l('M' + r1(A[0]) + ' ' + r1(A[1]) + ' L' + r1(B[0]) + ' ' + r1(B[1]), P.tinta, { w: 1, d: '3 2' });
    var Ti = (A[0] > B[0] || (A[0] === B[0] && A[1] > B[1])) ? A : B, ang = Math.atan2(B[1] - A[1], B[0] - A[0]) / RAD;
    s += tijera(K, Ti[0], Ti[1], ang + 180);
    s += K.t(12, 22, a + '°', { s: 17, b: 1, c: P.rojo, a: 'start' }) + K.t(12, 31, NOMBRE[a], { s: 6.2, b: 1, a: 'start' });
    s += transportador(K, 166, 66, 27, a) + K.t(166, 106, 'Transportador', { s: 5.4, c: P.gris });
    s += K.r(118, 120, 76, 20, 3, P.papel) + K.t(122, 128, 'Capas de nuca a coronilla', { s: 5, b: 1, a: 'start' });
    ARCO.forEach(function (c, j) { s += K.r(122 + j * 11.5, 132, 10, 4, 1, c); });
    return s;
  }
  var L = [0, 45, 90, 135, 180].map(function (a) {
    var E = EFECTO[a];
    return {
      id: 'pe_elev_' + a, fam: 'tec', n: 'Elevación a ' + a + '° · ' + NOMBRE[a].toLowerCase(),
      d: function (K) { return elevacion(K, a); },
      intro: 'La elevación es el ángulo al que se sostiene la mecha respecto a la caída natural del cabello. ' + E[0],
      q: [['¿Qué resultado da trabajar a ' + a + '°?', E[0]], ['¿En qué cortes se usa?', E[1]], ['¿Dónde se mide el ángulo?', 'Desde la caída natural del cabello hacia el suelo (0°) hasta la vertical hacia arriba (180°).']],
      porque: E[2]
    };
  });
  L.push({
    id: 'pe_elev_escala', fam: 'tec', n: 'Escala de elevaciones',
    d: function (K) {
      var cx = 64, cy = 76, r = 54, s = transportador(K, cx, cy, r, null);
      [0, 45, 90, 135, 180].forEach(function (a, i) {
        var sx = cx + r * Math.sin(a * RAD), sy = cy + r * Math.cos(a * RAD), y = 22 + i * 25;
        s += K.l('M' + cx + ' ' + cy + ' L' + r1(sx) + ' ' + r1(sy), colAng(a), { w: 2.2 }) + K.c(sx, sy, 2.4, colAng(a));
        s += K.r(126, y - 8, 4, 18, 1, colAng(a)) + K.t(134, y, a + '° · ' + NOMBRE[a], { s: 6.4, b: 1, a: 'start' }) + K.t(134, y + 8, EFECTO[a][0].split(':')[0], { s: 5.4, a: 'start', c: '#555' });
      });
      return s + K.c(cx, cy, 2, P.tinta);
    },
    intro: 'Cinco ángulos de referencia ordenan cualquier corte: cuanto más se eleva la mecha, más capas y más movimiento.',
    q: [['¿Qué ángulo da una línea sólida?', '0°, sin elevación.'], ['¿Qué ángulo da capas uniformes?', '90°, perpendicular al cráneo.'], ['¿Qué pasa con el peso al subir de 45° a 135°?', 'Se reparte hacia arriba: el borde se aligera y aparecen capas largas.']],
    porque: 'La distancia de cada mecha hasta el filo cambia con el ángulo: eso decide dónde queda el peso.'
  });

  /* ─── 2 · fichas técnicas de los 40 cortes (EU_CORTES) ─── */
  var ZONAS = ['Nuca', 'Nuca alta', 'Occipital', 'Occipital alto', 'Parietal', 'Parietal alto', 'Coronilla'];
  function fichaDe(c) {
    var CO = window.EU_CORTES, cab = c.mejor[0] || 'liso', g = CO.guiaDe(c.id, cab); if (!g) return null;
    var ps = g.pasos[2] || g.pasos[1], ev = (ps.elevB || [0, 0, 0, 0, 0, 0, 0]).slice(0, 7), regla = CO.reglaDe(cab);
    var mx = Math.max.apply(null, ev), mn = Math.min.apply(null, ev);
    var efecto = mx === 0 ? 'Sin elevación en ninguna zona: todo el peso queda en el borde y la línea se ve maciza.' :
      mx <= 45 ? 'Elevación baja: el peso se acumula sobre el perímetro y la forma se gradúa.' :
        mx <= 90 && mn >= 45 ? 'Elevación media en casi toda la cabeza: las capas salen parejas y la forma es redonda.' :
          'La elevación sube hacia la coronilla: arriba se acorta y abajo se conserva el largo, con capas y movimiento.';
    return {
      id: 'pe_ficha_' + c.id, fam: 'tec', n: 'Ficha técnica · ' + c.n,
      d: function (K) {
        var cx = 62, cy = 64, R = 27, s = cabeza(K, cx, cy, R);
        ev.forEach(function (e, z) {
          var th = 142 + z * (118 / 6), o = pt(cx, cy, R * .97, th), dd = [-Math.sin(e * RAD), Math.cos(e * RAD)], Lg = 22;
          s += K.l('M' + r1(o[0]) + ' ' + r1(o[1]) + ' L' + r1(o[0] + Lg * dd[0]) + ' ' + r1(o[1] + Lg * dd[1]), colAng(e), { w: 2.2 }) + K.c(o[0], o[1], 1.5, P.tinta) + K.c(o[0] + Lg * dd[0], o[1] + Lg * dd[1], 1.2, colAng(e));
        });
        s += K.r(112, 12, 84, 126, 4, P.papel);
        s += K.t(118, 23, 'Pila de elevaciones', { s: 6.6, b: 1, a: 'start' });
        for (var z = 6; z >= 0; z--) {
          var y = 34 + (6 - z) * 10.5, e = ev[z];
          s += K.t(118, y, 'Z' + z + ' ' + ZONAS[z], { s: 5.4, a: 'start' }) + K.r(162, y - 4.6, Math.max(2, 20 * e / 180), 5, 1, colAng(e)) + K.t(192, y, e + '°', { s: 5.6, b: 1, a: 'end' });
        }
        s += K.l('M118 106 L190 106', P.gris, { w: .5, op: .6 });
        s += K.t(118, 115, 'Partición: ' + String(ps.particionB || regla.part).replace(/^./, function (x) { return x.toUpperCase(); }), { s: 5.4, a: 'start', b: 1 });
        s += K.t(118, 124, 'Herramienta: ' + (ps.herramienta || 'Tijera') + ' · ' + (ps.tipoCorte || 'Recto'), { s: 5.4, a: 'start' });
        s += K.t(118, 133, 'Cabello: ' + regla.n, { s: 5.4, a: 'start' });
        s += K.t(14, 140, c.n, { s: 6.6, b: 1, a: 'start' });
        return s;
      },
      intro: c.d,
      q: [['¿A cuántos grados se trabaja la nuca y a cuántos la coronilla?', 'Nuca a ' + ev[0] + '° y coronilla a ' + ev[6] + '°.'],
        ['¿Cómo va la partición en cabello ' + regla.n.toLowerCase() + '?', regla.aviso],
        ['¿Con qué herramienta y tipo de corte se construye la forma?', (ps.herramienta || 'Tijera') + ', corte ' + String(ps.tipoCorte || 'recto').toLowerCase() + '.']],
      porque: efecto
    };
  }

  /* ─── 3 · divisiones (EU_DIVISIONES, lienzo → imagen) ─── */
  var CACHE = {};
  function rasterDiv(id) {
    if (CACHE[id]) return CACHE[id];
    var DV = window.EU_DIVISIONES; if (!DV || typeof document === 'undefined') return '';
    var W = 800, H = 600, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    var x = cv.getContext('2d');
    try { DV.dibujarUna(x, id, W * .5, H * .47, 190, 1, {}); } catch (e) { console.warn('división', id, e); return ''; }
    return (CACHE[id] = cv.toDataURL('image/png'));
  }
  var DIVQ = {
    perfil: ['¿Desde qué vista se ve esta división?', 'De perfil: la cabeza mirando de lado.'],
    planta: ['¿Desde qué vista se ve esta división?', 'En planta: la cabeza vista desde arriba.'],
    nuca: ['¿Desde qué vista se ve esta división?', 'Desde la nuca: la cabeza vista por detrás.'],
    gorro: ['¿Desde qué vista se ve esta división?', 'Desde la nuca: la cabeza vista por detrás.']
  };
  function divDe(l) {
    var vista = (l.id.match(/^(perfil|planta|nuca|gorro)/) || ['', 'perfil'])[1];
    return {
      id: 'pe_div_' + l.id, fam: 'div', n: 'Divisiones · ' + l.n.replace(/^(Perfil|Planta|Nuca) · /, ''),
      d: function (K) {
        var src = rasterDiv(l.id); if (!src) return K.t(100, 75, l.n, { s: 8, b: 1 });
        var f = K.linea ? ' filter="url(#peDivGris)"' : '';
        return (K.linea ? '<filter id="peDivGris"><feColorMatrix type="saturate" values="0"/></filter>' : '') + K.r(4, 4, 192, 142, 6, '#FBF8F2') + '<image href="' + src + '" x="4" y="4" width="192" height="144"' + f + ' preserveAspectRatio="xMidYMid meet"/>';
      },
      intro: l.d,
      q: [DIVQ[vista], ['¿Para qué sirve dividir antes de trabajar?', 'Para controlar cada sección por separado y que el producto o el corte quede igual en toda la cabeza.'], ['¿Qué se comprueba al terminar las divisiones?', 'Que las rayas estén limpias y simétricas, y que cada sección tenga el mismo grosor.']],
      porque: 'Una división limpia hace que cada mecha reciba lo mismo: el resultado es parejo y se puede repetir.'
    };
  }

  function registrar() {
    var lista = L.slice();
    if (window.EU_CORTES) window.EU_CORTES.lista().forEach(function (c) { var f = fichaDe(c); if (f) lista.push(f); });
    if (window.EU_DIVISIONES) window.EU_DIVISIONES.catalogo().forEach(function (l) { lista.push(divDe(l)); });
    MO.agregar('pelu', lista, { familias: { tec: 'Técnica de corte: elevaciones y fichas', div: 'Divisiones de la cabeza' } });
  }
  registrar();
  window.EU_PELU_TEC = { elevacion: elevacion, cabeza: cabeza, transportador: transportador, colAng: colAng };
})();
