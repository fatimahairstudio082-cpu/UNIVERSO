/* b6_pelu_fichas.js — fichas técnicas de corte dibujadas (window.EU_PELU_FICHAS).
   Reutiliza EU_CORTES (40 cortes, 7 cabellos, elevación por zona Z0 nuca → Z6 coronilla) y el kit de EU_MODELOS.
   Dibujo: maniquí de perfil, mechas de colores por zona proyectadas a su elevación, línea de corte, tijera
   y transportador. Registra en «pelu»: 5 láminas de elevación (0/45/90/135/180) y 40 fichas de corte
   (una por corte con su cabello ideal). EU_PELU_FICHAS.svg(corte, cabello, modo) da cualquiera de las
   40 × 7 combinaciones en 2D, 3D o para colorear.
   Cargar después de b6_cortes.js y b6_lib_peluqueria4.js. */
(function () {
  'use strict';
  var MO = window.EU_MODELOS, CO = window.EU_CORTES;
  if (!MO || !CO || !CO.tecnica || MO.modelo('pe_elev_90')) return;
  var D2R = Math.PI / 180;
  var ZC = ['#6A3FA0', '#3A6FC8', '#2E9A5A', '#9AB83A', '#E2B32A', '#E37A2A', '#C8323A'];
  var ZN = ['Borde', 'Nuca', 'Occipital', 'Media', 'Parietal', 'Alto', 'Coronilla'];
  var PIEL = '#EFCDB0', PIELO = '#C99A78', BASE = '#2A2A2E';
  var CX = 80, CY = 64, R = 30;
  function r1(n) { return Math.round(n * 10) / 10; }
  function th(i) { return (55 - i * 145 / 6) * D2R; }
  function dirDe(e) { return [Math.sin(e * D2R), Math.cos(e * D2R)]; }

  function maniqui(K) {
    var s = K.suelo(CX + 6, 128, 26);
    s += K.cil(CX + 6, 112, 12, 14, BASE, { ry: 3 });
    s += K.p('M' + (CX - 10) + ' 94 L' + (CX - 8) + ' 113 L' + (CX + 20) + ' 113 L' + (CX + 22) + ' 90 Z', PIEL);
    var nx = r1(CX + R * Math.cos(55 * D2R)), ny = r1(CY + R * Math.sin(55 * D2R));
    s += K.p('M' + (CX - 26) + ' ' + (CY - 15) + ' A' + R + ' ' + R + ' 0 1 1 ' + nx + ' ' + ny + ' L' + (CX + 20) + ' 113 L' + (CX - 8) + ' 113 L' + (CX - 9) + ' 97 Q' + (CX - 16) + ' 101 ' + (CX - 27) + ' 95 Q' + (CX - 31) + ' 92 ' + (CX - 30) + ' 87 Q' + (CX - 33) + ' 84 ' + (CX - 31) + ' 80 L' + (CX - 36) + ' 77 L' + (CX - 31) + ' 69 Q' + (CX - 33) + ' 60 ' + (CX - 26) + ' ' + (CY - 15) + ' Z', PIEL);
    s += K.e(CX + 4, CY + 8, 4, 6, PIELO);
    s += K.l('M' + (CX - 26) + ' 46 Q' + CX + ' 30 ' + (CX + 24) + ' 50', PIELO, { w: .7, d: '2 2' });
    s += K.brillo(CX - 10, CY - 16, 9, 5, -30);
    return s;
  }
  function tijera(x, y, ang) {
    return '<g transform="translate(' + r1(x) + ' ' + r1(y) + ') rotate(' + r1(ang) + ')">' +
      '<path d="M0 0 L17 -3.6 L17.6 -2.2 Z" fill="#A7B0B8" stroke="#555" stroke-width=".5"/>' +
      '<path d="M0 0 L17 3.6 L17.6 2.2 Z" fill="#C3C9CF" stroke="#555" stroke-width=".5"/>' +
      '<circle cx="-5.4" cy="-3.2" r="3" fill="none" stroke="' + BASE + '" stroke-width="1.5"/>' +
      '<circle cx="-5.4" cy="3.2" r="3" fill="none" stroke="' + BASE + '" stroke-width="1.5"/>' +
      '<circle cx="0" cy="0" r="1" fill="' + BASE + '"/></g>';
  }
  /* mechas: ev = 7 elevaciones; D = distancia de corte desde el centro de la cabeza */
  function mechas(K, ev, D) {
    var s = '', fin = [];
    for (var i = 0; i < 7; i++) {
      var a = th(i), px = CX + R * Math.cos(a), py = CY + R * Math.sin(a), d = dirDe(ev[i]);
      var t = Math.max(14, D - ((px - CX) * d[0] + (py - CY) * d[1]));
      var ex = px + d[0] * t, ey = Math.min(112, py + d[1] * t);
      fin.push([ex, ey, d]);
      for (var k = -1; k <= 1; k++) {
        var ox = -d[1] * k * 1.7, oy = d[0] * k * 1.7;
        s += K.l('M' + r1(px + ox) + ' ' + r1(py + oy) + ' L' + r1(ex + ox) + ' ' + r1(ey + oy), ZC[i], { w: 1.25 });
      }
    }
    return { s: s, fin: fin };
  }
  function transportador(K, ev) {
    var x0 = 14, y0 = 38, r = 15, s = '';
    s += K.p('M' + x0 + ' ' + (y0 - r) + ' A' + r + ' ' + r + ' 0 0 1 ' + x0 + ' ' + (y0 + r) + ' Z', '#F4F5F7', { w: .7 });
    for (var g = 0; g <= 180; g += 15) { var d = dirDe(g), q = g % 45 ? .86 : .74; s += K.l('M' + r1(x0 + d[0] * r * q) + ' ' + r1(y0 + d[1] * r * q) + ' L' + r1(x0 + d[0] * r) + ' ' + r1(y0 + d[1] * r), '#777', { w: .4 }); }
    s += K.l('M' + (x0 - .5) + ' ' + y0 + ' H' + (x0 + r), '#999', { w: .3 });
    var vis = {};
    ev.forEach(function (e, i) { if (vis[e]) return; vis[e] = 1; var d = dirDe(e); s += K.l('M' + x0 + ' ' + y0 + ' L' + r1(x0 + d[0] * r) + ' ' + r1(y0 + d[1] * r), ev.length === 1 ? '#C8323A' : ZC[i], { w: 1.1 }); });
    s += K.t(x0 + 2, y0 + r + 6, '0°', { s: 4.6, a: 'start', c: '#555' }) + K.t(x0 + 2, y0 - r - 2, '180°', { s: 4.6, a: 'start', c: '#555' }) + K.t(x0 + r + 1.5, y0 + 1.6, '90°', { s: 4.6, a: 'start', c: '#555' });
    return s;
  }
  function corteLinea(K, fin, una) {
    var s = '';
    if (una) {
      var a = fin[0], b = fin[6];
      s += K.l('M' + r1(a[0]) + ' ' + r1(a[1]) + ' L' + r1(b[0]) + ' ' + r1(b[1]), '#1B1B1B', { w: .8, d: '3 2' });
    } else s += K.l('M' + fin.map(function (f) { return r1(f[0]) + ' ' + r1(f[1]); }).join(' L'), '#1B1B1B', { w: .8, d: '3 2' });
    var m = fin[3], ang = Math.atan2(fin[4][1] - fin[2][1], fin[4][0] - fin[2][0]) / D2R;
    return s + tijera(m[0] + m[2][0] * 5, m[1] + m[2][1] * 5, ang);
  }

  /* ─────────── láminas de elevación ─────────── */
  var EF = {
    0: ['Línea · peso total', 'Corte de un solo largo: bob, melena recta, borde macizo.', 'Todo el pelo baja a la misma línea y el peso se queda entero en el borde.'],
    45: ['Graduado · peso', 'Graduación: bob en A, nuca apilada, base de muchos cortos.', 'Las mechas de arriba quedan un poco más largas que las de abajo y el peso se apila en la línea.'],
    90: ['Capas uniformes', 'Capas iguales que siguen la curva de la cabeza: corte redondo, capas clásicas.', 'Al cortar perpendicular al cuero cabelludo todas las mechas quedan del mismo largo.'],
    135: ['Capas largas', 'Capas desfiladas: arriba corto y abajo largo, mucho movimiento.', 'Al subir por encima de la horizontal las mechas de arriba quedan más cortas que las de abajo.'],
    180: ['Máxima capa', 'Coronilla corta y largo abajo: capas en cascada, wolf, shag.', 'Todo se reúne en la coronilla: es la diferencia máxima entre capas cortas arriba y largo abajo.']
  };
  var L = [];
  [0, 45, 90, 135, 180].forEach(function (e) {
    var ef = EF[e];
    L.push({
      id: 'pe_elev_' + e, fam: 'fic', n: 'Elevación a ' + e + '°',
      d: function (K) {
        var ev = [e, e, e, e, e, e, e], M2 = mechas(K, ev, 50);
        return maniqui(K) + M2.s + corteLinea(K, M2.fin, true) + transportador(K, [e]) +
          K.t(176, 70, e + '°', { s: 22, b: 1, c: '#C8323A' }) + K.t(176, 82, 'Elevación', { s: 6.6, b: 1 }) + K.t(176, 91, ef[0], { s: 6 });
      },
      intro: 'Se sostiene cada mecha a ' + e + '° respecto a la caída natural y se corta con la tijera en la línea discontinua. ' + ef[1],
      q: [['¿Desde dónde se mide la elevación?', 'Desde la caída natural del pelo: 0° es colgando hacia el suelo.'],
        ['¿Qué resultado da cortar a ' + e + '°?', ef[0] + '. ' + ef[1]],
        ['¿Qué pasa si la mecha se sube más de la cuenta?', 'Se quita más largo arriba: aparece una capa o un escalón que no estaba previsto.']],
      porque: ef[2]
    });
  });

  /* ─────────── fichas de corte ─────────── */
  function ficha(corteId, cabId, modo, id) {
    var c = CO.get(corteId), T = CO.tecnica(corteId); if (!c || !T) return null;
    cabId = cabId || c.mejor[0];
    var rg = CO.reglaDe(cabId), ev = T.elev, mx = Math.max.apply(null, ev), mn = Math.min.apply(null, ev), izm = ev.indexOf(mx);
    var tipo = mx === mn ? (mx === 0 ? 'línea de un solo largo' : 'capas a ' + mx + '° en toda la cabeza') : (ev[6] > ev[0] ? 'la elevación sube de la nuca (' + ev[0] + '°) a la coronilla (' + ev[6] + '°)' : 'la elevación baja de la nuca (' + ev[0] + '°) a la coronilla (' + ev[6] + '°)');
    var porque = mx === 0 ? 'Sin elevación todas las mechas caen a la misma línea: el peso se queda en el borde y el brillo es continuo.' :
      mx === mn ? 'Con la misma elevación en todas las zonas el largo sigue la curva de la cabeza y las capas quedan parejas.' :
      ev[6] > ev[0] ? 'Cuanto más se eleva una zona, más corta queda respecto a la de abajo: por eso arriba hay capa y en la nuca se conserva el peso.' :
      'Se eleva más la nuca que la parte de arriba: el peso sube y el borde queda graduado.';
    return {
      id: id || ('pe_ft_' + corteId + (cabId !== c.mejor[0] ? '_' + cabId : '')), fam: 'fic', n: 'Ficha técnica: ' + c.n.toLowerCase(),
      d: function (K) {
        var M2 = mechas(K, ev, 60), s = maniqui(K) + M2.s + corteLinea(K, M2.fin, false) + transportador(K, ev);
        s += K.t(146, 18, 'Zona', { s: 5.4, b: 1, a: 'start' }) + K.t(198, 18, 'Elev.', { s: 5.4, b: 1, a: 'end' });
        for (var i = 6; i >= 0; i--) {
          var y = 26 + (6 - i) * 11;
          s += K.r(146, y - 5.4, 6, 6, 1.2, ZC[i], { w: .4 }) + K.t(155, y, ZN[i], { s: 5.6, a: 'start' }) + K.t(198, y, ev[i] + '°', { s: 6, b: 1, a: 'end' });
        }
        s += K.l('M146 105 H198', '#BBB', { w: .4 });
        s += K.t(146, 113, 'Sección ' + rg.part, { s: 5.4, b: 1, a: 'start' }) + K.t(146, 121, T.her + ' · ' + T.tipo.toLowerCase(), { s: 5.2, a: 'start' }) + K.t(146, 129, 'Cabello ' + rg.n.split(' ·')[0].toLowerCase(), { s: 5.2, a: 'start' });
        return s;
      },
      intro: c.d + ' En la ficha, ' + tipo + '. Cabello ' + rg.n.toLowerCase() + ': ' + rg.corto.toLowerCase() + '.',
      q: [['¿A qué elevación se marca la nuca?', 'A ' + ev[0] + '°, con sección ' + rg.part + '.'],
        ['¿En qué zona se eleva más y cuánto?', ZN[izm] + ', a ' + mx + '°.'],
        ['¿Por qué la sección es ' + rg.part + ' en este cabello?', rg.aviso]],
      porque: porque
    };
  }
  CO.lista().forEach(function (c) { var f = ficha(c.id); if (f) L.push(f); });

  MO.agregar('pelu', L, { familias: { fic: 'Fichas técnicas de corte' } });

  var CACHE = {};
  window.EU_PELU_FICHAS = {
    ficha: ficha,
    /* cualquier corte × cabello en 'color' | '3d' | 'linea' */
    svg: function (corteId, cabId, modo) {
      var k = corteId + '|' + (cabId || '');
      if (!CACHE[k]) { var f = ficha(corteId, cabId, modo, 'pe_fx_' + corteId + '_' + (cabId || 'ideal')); if (!f) return ''; if (!MO.modelo(f.id)) MO.agregar('pelu_fx', [f], { nombre: 'Fichas (variantes)' }); CACHE[k] = f.id; }
      return MO.svg(CACHE[k], modo || 'color', { rot: false });
    },
    combinaciones: function () { return CO.lista().length * CO.cabellos().length; }
  };
})();
