/* b6_dibujos_materias.js — dibujos 2D/3D propios de cada asignatura (se registran en EU_SVG.visual).
   · Mapas: ruta entre ciudades con distancias reales en línea recta (coordenadas de cada ciudad) y
     barra de escala; dos países comparados a la misma escala.
   · Mate/Tecno/Arte: bloques isométricos (3D) o planta acotada (2D). Lengua: árbol de la oración.
   · Ciencias: plato saludable, ciclo del agua, célula animal y vegetal, tabla periódica (1–20), palanca.
   · Sociales: línea del tiempo del país a escala. Música: compases y figuras. E. física: pulso.
   · Peluquería: escala de alturas de tono 1–10.
   Cada generador respeta el acabado 2D/3D (cfg.acab.dibujo) y los colores del diseño.
   Cargar después de b6_cerebro_visual.js. */
(function () {
  'use strict';
  var ED = window.EU_EDITORIAL, SV = window.EU_SVG;
  if (!ED || !SV || !SV.visual || window.EU_DIBUJOS) return;
  var H = ED.H, esc = H.esc, it = H.it, E = H.ent, osc = SV.osc, clr = SV.clr, NS = 'xmlns="http://www.w3.org/2000/svg"', uid = 0;
  function r1(n) { return Math.round(n * 10) / 10; }
  function es3d(C) { return C.prem ? C.prem.dibujo === '3d' : (((C.cfg && C.cfg.acab) || {}).dibujo || '3d') === '3d'; }
  function svg(w, h, body, maxw) { return '<svg ' + NS + ' data-plano="1" viewBox="0 0 ' + w + ' ' + h + '" style="width:100%;max-width:' + (maxw || w) + 'px;height:auto;display:block;margin:0 auto">' + body + '</svg>'; }
  function tx(x, y, s, o) { o = o || {}; return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || 'middle') + '" font-size="' + (o.s || 13) + '" font-family="' + esc(o.f || 'sans-serif') + '" font-weight="' + (o.w || 400) + '" fill="' + (o.c || '#222') + '"' + (o.st ? ' stroke="#fff" stroke-width="3" paint-order="stroke"' : '') + '>' + esc(s) + '</text>'; }
  function fmt(n, C) { return H.num(n, C); }
  function mc(e, ops, bien, x) { return it('mc', e, 'abc'.charAt(ops.indexOf(bien)) + ') ' + bien, Object.assign({ o: ops, c: ops.indexOf(bien) }, x || {})); }
  function banco(C, ws) { return '<div style="display:flex;flex-wrap:wrap;gap:2mm;justify-content:center;margin:3mm 0 1mm">' + ws.map(function (w) { return '<span style="border:1px dashed ' + C.T.acc2 + ';border-radius:' + (C.T.r ? 99 : 0) + 'px;padding:.8mm 3.5mm;font-size:.9em">' + esc(w) + '</span>'; }).join('') + '</div>'; }
  function peq(C) { return /^(inf|pri1|pri2)$/.test(C.bnd || ''); }
  function sombra(id) { return '<filter id="' + id + '" x="-10%" y="-10%" width="130%" height="140%"><feDropShadow dx="2" dy="4" stdDeviation="3" flood-opacity=".22"/></filter>'; }

  /* ─────────── mapas con distancias reales ─────────── */
  var LL = {
    'Madrid': [40.42, -3.70], 'Barcelona': [41.39, 2.17], 'Sevilla': [37.39, -5.98], 'Valencia': [39.47, -0.38], 'Bilbao': [43.26, -2.93],
    'Ciudad de México': [19.43, -99.13], 'Guadalajara': [20.67, -103.35], 'Monterrey': [25.69, -100.32], 'Mérida': [20.97, -89.62], 'Tijuana': [32.51, -117.04],
    'Bogotá': [4.71, -74.07], 'Medellín': [6.24, -75.58], 'Cali': [3.45, -76.53], 'Barranquilla': [10.97, -74.80], 'Cartagena': [10.39, -75.51],
    'Buenos Aires': [-34.60, -58.38], 'Córdoba': [-31.42, -64.18], 'Rosario': [-32.95, -60.64], 'Mendoza': [-32.89, -68.84], 'Ushuaia': [-54.80, -68.30],
    'Santiago': [-33.45, -70.67], 'Valparaíso': [-33.05, -71.62], 'Antofagasta': [-23.65, -70.40], 'Concepción': [-36.83, -73.05], 'Punta Arenas': [-53.16, -70.91],
    'Caracas': [10.48, -66.90], 'Maracaibo': [10.65, -71.64], 'Barquisimeto': [10.07, -69.32], 'Ciudad Guayana': [8.35, -62.64],
    'Santo Domingo': [18.49, -69.93], 'Santiago de los Caballeros': [19.45, -70.70], 'La Romana': [18.43, -68.97], 'Puerto Plata': [19.79, -70.69], 'Punta Cana': [18.58, -68.40],
    'Washington D. C.': [38.91, -77.04], 'Nueva York': [40.71, -74.01], 'Los Ángeles': [34.05, -118.24], 'Chicago': [41.88, -87.63], 'Miami': [25.76, -80.19], 'Houston': [29.76, -95.37]
  };
  var LLve = { 'Valencia': [10.16, -68.00] };
  var PAIS_N = { es: 'España', mx: 'México', co: 'Colombia', ar: 'Argentina', cl: 'Chile', ve: 'Venezuela', do: 'República Dominicana', us: 'Estados Unidos' };
  function ll(pk, n) { return pk === 've' && LLve[n] ? LLve[n] : LL[n]; }
  function km(a, b) { var R = 6371, p = Math.PI / 180, dLa = (b[0] - a[0]) * p, dLo = (b[1] - a[1]) * p, x = Math.sin(dLa / 2) * Math.sin(dLa / 2) + Math.cos(a[0] * p) * Math.cos(b[0] * p) * Math.sin(dLo / 2) * Math.sin(dLo / 2); return 2 * R * Math.asin(Math.sqrt(x)); }
  function ciudades(pk) { var D = (window.EU_MAPAS_DATOS || {})[pk]; if (!D) return null; return D.c.map(function (c) { return { n: c[0], x: c[1], y: c[2], cap: !!c[3], ll: ll(pk, c[0]) }; }).filter(function (c) { return c.ll; }); }
  function kmPorUnidad(pk) {
    var cs = ciudades(pk), v = [];
    for (var i = 0; i < cs.length; i++) for (var j = i + 1; j < cs.length; j++) { var d = Math.hypot(cs[i].x - cs[j].x, cs[i].y - cs[j].y); if (d > 20) v.push(km(cs[i].ll, cs[j].ll) / d); }
    v.sort(function (a, b) { return a - b; }); return v[Math.floor(v.length / 2)] || 1;
  }
  function contorno(C, pk, ox, oy, s, d3, id) {
    var D = window.EU_MAPAS_DATOS[pk], T = C.T, out = '';
    if (d3) out += '<path d="' + D.d + '" transform="translate(' + r1(ox + 3) + ' ' + r1(oy + 5) + ') scale(' + s + ')" fill="' + osc(T.acc, .45) + '" opacity=".8"/>';
    out += '<path d="' + D.d + '" transform="translate(' + r1(ox) + ' ' + r1(oy) + ') scale(' + s + ')" fill="' + (d3 ? 'url(#' + id + ')' : clr(T.acc, .8)) + '" stroke="' + osc(T.acc, .2) + '" stroke-width="' + r1(1.2 / s) + '" stroke-linejoin="round"/>';
    return out;
  }
  function degr(C, id, d3) { var T = C.T; return '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + clr(T.acc, d3 ? .5 : .8) + '"/><stop offset="1" stop-color="' + clr(T.acc, d3 ? .75 : .8) + '"/></linearGradient></defs>'; }
  function escalaNice(kmMax) { var c = [10, 20, 50, 100, 200, 250, 500, 1000, 2000]; for (var i = c.length - 1; i >= 0; i--) if (c[i] <= kmMax) return c[i]; return 10; }
  function genRuta(u, C, r) {
    if (!window.EU_MAPAS_DATOS) return null;
    var pks = Object.keys(PAIS_N).filter(function (k) { return ciudades(k) && ciudades(k).length >= 3; });
    var pk = r() < 0.6 && pks.indexOf(C.pk) >= 0 ? C.pk : H.pick(r, pks), D = window.EU_MAPAS_DATOS[pk], cs = H.mezcla(r, ciudades(pk)).slice(0, 3);
    var T = C.T, F = T.cuerpo, d3 = es3d(C), id = 'eur' + (++uid), s = pk === 'cl' ? 1.25 : 1, pad = 40, W = Math.max(D.w * s + pad * 2, 300), Hh = D.h * s + pad * 2 + 30, ox = (W - D.w * s) / 2, oy = pad;
    var kpu = kmPorUnidad(pk), tramos = [[0, 1], [1, 2]].map(function (p) { return { a: cs[p[0]], b: cs[p[1]], d: Math.round(km(cs[p[0]].ll, cs[p[1]].ll) / 10) * 10 }; });
    var out = degr(C, id, d3) + contorno(C, pk, ox, oy, s, d3, id);
    tramos.forEach(function (t, i) {
      var x1 = ox + t.a.x * s, y1 = oy + t.a.y * s, x2 = ox + t.b.x * s, y2 = oy + t.b.y * s;
      out += '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + T.acc2 + '" stroke-width="2.4" stroke-dasharray="6 4" stroke-linecap="round"/>';
      out += tx((x1 + x2) / 2 + (i ? 10 : -10), (y1 + y2) / 2 - 6, i === 0 ? '? km' : fmtKm(t.d, C), { f: F, s: 12, c: T.acc2, w: 700, st: true });
    });
    cs.forEach(function (c) { var x = ox + c.x * s, y = oy + c.y * s; out += '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="5" fill="' + T.ink + '" stroke="#fff" stroke-width="1.6"/>' + tx(x + (c.x * s > D.w * s * .6 ? -9 : 9), y + 4.5, c.n, { f: F, s: 12, c: T.ink, w: 700, a: c.x * s > D.w * s * .6 ? 'end' : 'start', st: true }); });
    var ek = escalaNice(D.w * kpu * .35), el = ek / kpu * s, by = Hh - 22;
    out += '<rect x="' + pad + '" y="' + by + '" width="' + r1(el / 2) + '" height="6" fill="' + T.ink + '"/><rect x="' + r1(pad + el / 2) + '" y="' + by + '" width="' + r1(el / 2) + '" height="6" fill="#fff" stroke="' + T.ink + '"/>' + tx(pad, by - 5, '0', { f: F, s: 11, c: T.ink }) + tx(pad + el, by - 5, fmtKm(ek, C), { f: F, s: 11, c: T.ink });
    out += '<polygon points="' + (W - 22) + ',14 ' + (W - 16) + ',30 ' + (W - 22) + ',26 ' + (W - 28) + ',30" fill="' + T.ink + '"/>' + tx(W - 22, 44, 'N', { f: F, s: 12, c: T.ink, w: 700 });
    var t0 = tramos[0], t1 = tramos[1], vel = C.adulto ? 90 : 80, horas = Math.round(t1.d / vel * 10) / 10;
    var items = [it('corta', 'Mide con la escala: ¿cuántos kilómetros hay en línea recta de ' + t0.a.n + ' a ' + t0.b.n + '? (aprox.)', fmtKm(t0.d, C), { x: 'Compara la línea con la barra de escala: ' + fmtKm(ek, C) + '.' }),
      it('corta', '¿Cuántos kilómetros suma el recorrido ' + t0.a.n + ' → ' + t0.b.n + ' → ' + t1.b.n + '?', fmtKm(t0.d + t1.d, C)),
      it('corta', 'Un autobús va a ' + vel + ' km/h. ¿Cuántas horas tarda de ' + t1.a.n + ' a ' + t1.b.n + ' en línea recta?', fmt(horas, C) + ' h', { x: 'Tiempo = distancia ÷ velocidad.' }),
      mc('¿Qué tramo es más largo?', [t0.a.n + '–' + t0.b.n, t1.a.n + '–' + t1.b.n], t0.d >= t1.d ? t0.a.n + '–' + t0.b.n : t1.a.n + '–' + t1.b.n)];
    if (peq(C)) items = [items[3], it('corta', '¿Qué ciudad está más al norte: ' + cs[0].n + ' o ' + cs[1].n + '?', cs[0].y < cs[1].y ? cs[0].n : cs[1].n)];
    return { t: 'Ruta por ' + PAIS_N[pk], intro: 'Distancias reales en línea recta entre ciudades de ' + PAIS_N[pk] + '. La barra de escala convierte centímetros del mapa en kilómetros.', fig: svg(W, Hh, out, 440), items: items, compacto: true };
  }
  function fmtKm(n, C) { return H.num(n, C) + ' km'; }
  function genCompara(u, C, r) {
    if (!window.EU_MAPAS_DATOS) return null;
    var pks = Object.keys(PAIS_N).filter(function (k) { return ciudades(k) && ciudades(k).length >= 3; });
    var a = pks.indexOf(C.pk) >= 0 ? C.pk : H.pick(r, pks), b = H.pick(r, pks.filter(function (k) { return k !== a; }));
    var T = C.T, F = T.cuerpo, d3 = es3d(C), id = 'euc' + (++uid), Da = window.EU_MAPAS_DATOS[a], Db = window.EU_MAPAS_DATOS[b], ka = kmPorUnidad(a), kb = kmPorUnidad(b);
    var k = Math.max(Da.h * ka, Da.w * ka, Db.h * kb, Db.w * kb) / 230, sa = ka / k, sb = kb / k, W = 560, Hh = 300, out = degr(C, id, d3);
    var xa = 140 - Da.w * sa / 2, xb = 420 - Db.w * sb / 2, ya = 30 + (230 - Da.h * sa) / 2, yb = 30 + (230 - Db.h * sb) / 2;
    out += contorno(C, a, xa, ya, r1(sa * 100) / 100, d3, id) + contorno(C, b, xb, yb, r1(sb * 100) / 100, d3, id);
    var La = Math.round(Da.h * ka / 100) * 100, Lb = Math.round(Db.h * kb / 100) * 100;
    out += tx(140, 285, PAIS_N[a], { f: F, s: 14, c: T.ink, w: 700 }) + tx(420, 285, PAIS_N[b], { f: F, s: 14, c: T.ink, w: 700 });
    [[a, Da, xa, ya, sa, La], [b, Db, xb, yb, sb, Lb]].forEach(function (q) { var x = q[2] + q[1].w * q[4] + 10, y0 = q[3], y1 = q[3] + q[1].h * q[4]; out += '<line x1="' + r1(x) + '" y1="' + r1(y0) + '" x2="' + r1(x) + '" y2="' + r1(y1) + '" stroke="' + T.acc2 + '" stroke-width="1.6" marker-end="none"/>' + '<line x1="' + r1(x - 4) + '" y1="' + r1(y0) + '" x2="' + r1(x + 4) + '" y2="' + r1(y0) + '" stroke="' + T.acc2 + '" stroke-width="1.6"/><line x1="' + r1(x - 4) + '" y1="' + r1(y1) + '" x2="' + r1(x + 4) + '" y2="' + r1(y1) + '" stroke="' + T.acc2 + '" stroke-width="1.6"/>'; });
    var mas = La >= Lb ? PAIS_N[a] : PAIS_N[b];
    var items = [mc('A la misma escala, ¿qué país es más largo de norte a sur?', [PAIS_N[a], PAIS_N[b]], mas), it('corta', 'Longitud norte-sur aproximada de ' + PAIS_N[a] + ' (usa las ciudades como referencia):', 'unos ' + fmtKm(La, C)), it('abierta', '¿Por qué hace falta dibujar los dos países a la misma escala para compararlos?', '', { lin: 2 })];
    return { t: PAIS_N[a] + ' y ' + PAIS_N[b] + ' a la misma escala', intro: 'Los dos contornos están dibujados con la misma relación entre milímetros y kilómetros. La raya lateral marca la longitud de norte a sur.', fig: svg(W, Hh, out, 520), items: items, compacto: true };
  }

  /* ─────────── bloques isométricos / planta acotada ─────────── */
  function genBloques(u, C, r) {
    var T = C.T, F = T.cuerpo, d3 = es3d(C), n = peq(C) ? 2 : 3, M = [], tot = 0, max = 0;
    for (var y = 0; y < n; y++) { M.push([]); for (var x = 0; x < n; x++) { var h = E(r, x + y === 0 ? 1 : 0, peq(C) ? 2 : 3); M[y].push(h); tot += h; max = Math.max(max, h); } }
    if (tot < 3) { M[0][0] = 2; M[n - 1][n - 1] = 1; tot = 0; M.forEach(function (f) { f.forEach(function (h) { tot += h; }); }); }
    var out = '', W = 460, Hh = 300;
    if (d3) {
      var cw = 34, ch = 19, hz = 38, ox = 230, oy = 110 - (n - 2) * 10, P = function (x, y, z) { return [ox + (x - y) * cw, oy + (x + y) * ch - z * hz]; }, poly = function (pts, f) { return '<polygon points="' + pts.map(function (p) { return r1(p[0]) + ',' + r1(p[1]); }).join(' ') + '" fill="' + f + '" stroke="' + osc(T.acc, .45) + '" stroke-width="1" stroke-linejoin="round"/>'; };
      for (var s = 0; s <= 2 * (n - 1); s++) for (var yy = 0; yy < n; yy++) { var xx = s - yy; if (xx < 0 || xx >= n) continue; for (var z = 0; z < M[yy][xx]; z++) {
        out += poly([P(xx, yy, z + 1), P(xx + 1, yy, z + 1), P(xx + 1, yy + 1, z + 1), P(xx, yy + 1, z + 1)], clr(T.acc, .55)) + poly([P(xx, yy + 1, z), P(xx + 1, yy + 1, z), P(xx + 1, yy + 1, z + 1), P(xx, yy + 1, z + 1)], T.acc) + poly([P(xx + 1, yy, z), P(xx + 1, yy + 1, z), P(xx + 1, yy + 1, z + 1), P(xx + 1, yy, z + 1)], osc(T.acc, .3));
      } }
      out = '<polygon points="' + [P(0, 0, 0), P(n, 0, 0), P(n, n, 0), P(0, n, 0)].map(function (p) { return r1(p[0]) + ',' + r1(p[1] + 3); }).join(' ') + '" fill="' + T.soft + '"/>' + out;
    } else {
      var c = 56, x0 = (W - n * c) / 2, y0 = 40;
      for (var y2 = 0; y2 < n; y2++) for (var x2 = 0; x2 < n; x2++) { var hh = M[y2][x2]; out += '<rect x="' + (x0 + x2 * c) + '" y="' + (y0 + y2 * c) + '" width="' + c + '" height="' + c + '" fill="' + (hh ? clr(T.acc, 1 - hh / (max + 1)) : '#fff') + '" stroke="' + T.ink + '" stroke-width="1.4"/>' + (hh ? tx(x0 + x2 * c + c / 2, y0 + y2 * c + c / 2 + 7, hh, { f: F, s: 20, c: hh / (max + 1) > .5 ? '#fff' : T.ink, w: 700 }) : ''); }
      out += tx(W / 2, y0 + n * c + 26, 'Planta: el número dice cuántos cubos hay en cada columna', { f: F, s: 12, c: T.ink });
      Hh = y0 + n * c + 44;
    }
    var items = [it('corta', '¿Cuántos cubos hay en total?', tot, { x: d3 ? 'Cuenta columna a columna, también los que están escondidos debajo.' : 'Suma los números de la planta.' }), it('corta', '¿Cuántos cubos tiene la columna más alta?', max)];
    if (!peq(C)) items.push(it('corta', 'Si cada cubo mide 2 cm de arista, ¿cuál es el volumen total?', fmt(tot * 8, C) + ' cm³', { x: 'Un cubo de 2 cm tiene 2 × 2 × 2 = 8 cm³.' }), it('dibujo', d3 ? 'Dibuja la planta de la construcción y escribe en cada cuadro el número de cubos.' : 'Dibuja la construcción en perspectiva isométrica.', ''));
    return { t: d3 ? 'Construcción con cubos' : 'Planta acotada', intro: d3 ? 'Todos los cubos son iguales. Algunos quedan ocultos detrás o debajo de otros.' : 'Vista desde arriba de una construcción con cubos.', fig: svg(W, Hh, out, 380), items: items };
  }

  /* ─────────── lengua: árbol de la oración ─────────── */
  var SUJ = [['Mi hermana', 's'], ['{n1}', 's'], ['Los vecinos de {ciudad}', 'p'], ['La profesora de música', 's'], ['Mis abuelos', 'p'], ['El equipo del barrio', 's']];
  var VERB = [['lee', 'leen', 'un libro de aventuras', 'en la biblioteca'], ['prepara', 'preparan', '{comida}', 'para la cena'], ['pinta', 'pintan', 'un mural enorme', 'en el patio'], ['escribe', 'escriben', 'una carta', 'por la tarde'], ['canta', 'cantan', 'una canción antigua', 'en la fiesta'], ['riega', 'riegan', 'las plantas', 'cada mañana']];
  function genArbol(u, C, r) {
    var T = C.T, F = T.cuerpo, s = H.pick(r, SUJ), v = H.pick(r, VERB), suj = H.sub(s[0], C), vb = s[1] === 'p' ? v[1] : v[0], cd = H.sub(v[2], C), cc = v[3];
    var W = 620, Hh = 250, out = '', caja = function (x, y, w, t, sub, c) { return '<rect x="' + r1(x - w / 2) + '" y="' + y + '" width="' + r1(w) + '" height="34" rx="' + Math.min(T.r, 8) + '" fill="' + c + '" stroke="' + osc(c, .35) + '"/>' + tx(x, y + 22, t, { f: F, s: 14, c: T.ink, w: 700 }) + (sub ? tx(x, y + 50, sub, { f: F, s: 12, c: T.ink }) : ''); };
    var lin = function (x1, y1, x2, y2) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + T.ink + '" stroke-width="1.4"/>'; };
    out += caja(310, 10, 90, 'O', '', T.soft) + lin(310, 44, 150, 84) + lin(310, 44, 430, 84) + caja(150, 84, 170, 'SN · Sujeto', '', clr(T.acc, .7)) + caja(430, 84, 220, 'SV · Predicado', '', clr(T.acc2, .7));
    out += lin(150, 118, 150, 158) + caja(150, 158, 200, '?', '', '#fff') + lin(430, 118, 330, 158) + lin(430, 118, 450, 158) + lin(430, 118, 565, 158);
    out += caja(330, 158, 90, 'N', '', '#fff') + caja(450, 158, 130, 'CD', '', '#fff') + caja(565, 158, 104, 'CC', '', '#fff');
    out += tx(310, 240, suj + ' ' + vb + ' ' + cd + ' ' + cc + '.', { f: F, s: 15, c: T.acc, w: 700 });
    var items = [it('corta', 'Escribe el sujeto de la oración.', suj), it('corta', '¿Cuál es el núcleo del predicado (N)?', vb), it('corta', '¿Qué palabras forman el complemento directo (CD)?', cd), it('corta', 'Cambia el sujeto a ' + (s[1] === 'p' ? 'singular' : 'plural') + ': ¿cómo queda el verbo?', s[1] === 'p' ? v[0] : v[1], { x: 'Sujeto y verbo concuerdan en número.' })];
    return { t: 'El árbol de la oración', intro: 'Completa el árbol: cada casilla vacía se rellena con una parte de la oración de abajo.', fig: svg(W, Hh, out, 560), items: items, compacto: true };
  }

  /* ─────────── ciencias ─────────── */
  function genPlato(u, C, r) {
    var T = C.T, F = T.cuerpo, d3 = es3d(C), id = 'eup' + (++uid), cx = 200, cy = 150, R = 115, out = d3 ? '<defs>' + sombra(id) + '</defs>' : '';
    var arco = function (a0, a1, col, lab) { var p = Math.PI / 180, x0 = cx + R * Math.cos(a0 * p), y0 = cy + R * Math.sin(a0 * p), x1 = cx + R * Math.cos(a1 * p), y1 = cy + R * Math.sin(a1 * p), am = (a0 + a1) / 2 * p; return '<path d="M' + cx + ',' + cy + ' L' + r1(x0) + ',' + r1(y0) + ' A' + R + ',' + R + ' 0 ' + (a1 - a0 > 180 ? 1 : 0) + ' 1 ' + r1(x1) + ',' + r1(y1) + ' Z" fill="' + col + '" stroke="#fff" stroke-width="3"/>' + tx(cx + R * .58 * Math.cos(am), cy + R * .58 * Math.sin(am) + 5, lab, { f: F, s: 13, c: T.ink, w: 700, st: true }); };
    out += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (R + 14) + '" fill="#fff" stroke="' + T.soft + '" stroke-width="3"' + (d3 ? ' filter="url(#' + id + ')"' : '') + '/>';
    out += arco(-90, 45, '#8BC34A', 'Verduras') + arco(45, 90, '#F4A340', 'Frutas') + arco(90, 180, '#E8C872', 'Cereales') + arco(180, 270, '#E57373', 'Proteínas');
    out += '<rect x="352" y="70" width="44" height="80" rx="6" fill="' + clr('#4FA3D9', .55) + '" stroke="#4FA3D9" stroke-width="2"/>' + tx(374, 170, 'Agua', { f: F, s: 13, c: T.ink, w: 700 });
    var items = [it('corta', '¿Qué fracción del plato ocupan verduras y frutas juntas?', '1/2', { x: 'Mira la mitad derecha del plato.' }), it('corta', '¿Qué porcentaje ocupan las proteínas?', '25 %'), it('abierta', H.sub('Diseña un plato así con ingredientes de tu región. ¿Encaja {comida}? ¿En qué parte?', C), '', { lin: 3 })];
    if (peq(C)) items = [items[0], it('corta', '¿Qué bebida acompaña al plato?', 'agua')];
    return { t: 'El plato saludable', intro: 'La mitad del plato, verduras y frutas; un cuarto, cereales integrales; un cuarto, proteínas. Para beber, agua.', fig: svg(420, 300, out, 400), items: items };
  }
  function genCicloAgua(u, C, r) {
    var T = C.T, F = T.cuerpo, d3 = es3d(C), W = 600, Hh = 300, out = '', ord = H.mezcla(r, [0, 1, 2, 3]);
    var fases = ['evaporación', 'condensación', 'precipitación', 'escorrentía'];
    out += '<rect x="0" y="230" width="600" height="70" fill="' + clr('#3E8ED0', d3 ? .35 : .6) + '"/><polygon points="330,230 450,90 560,230" fill="' + (d3 ? '#8A9A6B' : clr('#8A9A6B', .4)) + '"/><polygon points="420,125 450,90 482,128 462,120 440,132" fill="#fff"/>';
    out += '<circle cx="70" cy="60" r="30" fill="#F6C343"/>';
    [[210, 55], [300, 45]].forEach(function (p) { out += '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="52" ry="22" fill="' + (d3 ? '#E8EEF4' : '#fff') + '" stroke="' + T.ink + '" stroke-width="1"/>'; });
    for (var k = 0; k < 6; k++) out += '<line x1="' + (330 + k * 14) + '" y1="80" x2="' + (322 + k * 14) + '" y2="110" stroke="#3E8ED0" stroke-width="2"/>';
    var fl = function (x1, y1, x2, y2, n) { var a = Math.atan2(y2 - y1, x2 - x1), l = 10; return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + T.acc2 + '" stroke-width="3"/><polygon points="' + x2 + ',' + y2 + ' ' + r1(x2 - l * Math.cos(a - .45)) + ',' + r1(y2 - l * Math.sin(a - .45)) + ' ' + r1(x2 - l * Math.cos(a + .45)) + ',' + r1(y2 - l * Math.sin(a + .45)) + '" fill="' + T.acc2 + '"/><circle cx="' + r1((x1 + x2) / 2) + '" cy="' + r1((y1 + y2) / 2) + '" r="13" fill="' + T.acc + '"/>' + tx((x1 + x2) / 2, (y1 + y2) / 2 + 5, n, { f: F, s: 14, c: '#fff', w: 700 }); };
    var pos = [[140, 220, 175, 90], [255, 70, 320, 70], [380, 120, 400, 200], [470, 225, 300, 255]];
    pos.forEach(function (p, i) { out += fl(p[0], p[1], p[2], p[3], ord[i] + 1); });
    var items = fases.map(function (f, i) { return it('corta', '¿Qué número marca la ' + f + '?', ord[i] + 1); });
    items.push(it('corta', '¿Qué aporta la energía que mueve el ciclo?', 'el calor del Sol'));
    return { t: 'El ciclo del agua', intro: 'El agua cambia de estado y de lugar sin perderse. Cada flecha numerada es una fase.', fig: svg(W, Hh, out, 560) + banco(C, H.mezcla(r, fases)), items: peq(C) ? items.slice(0, 2) : items, compacto: true };
  }
  function genCelula(u, C, r) {
    var T = C.T, F = T.cuerpo, d3 = es3d(C), veg = r() < 0.5, W = 520, Hh = 300, out = '', id = 'euce' + (++uid);
    var partes = veg ? ['pared celular', 'membrana', 'núcleo', 'cloroplasto', 'vacuola', 'mitocondria'] : ['membrana', 'citoplasma', 'núcleo', 'mitocondria', 'ribosomas'];
    if (d3) out += '<defs><radialGradient id="' + id + '" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="' + clr(T.acc2, .85) + '"/><stop offset="1" stop-color="' + clr(T.acc2, .5) + '"/></radialGradient></defs>';
    var fondo = d3 ? 'url(#' + id + ')' : clr(T.acc2, .85);
    if (veg) out += '<rect x="80" y="30" width="300" height="240" rx="10" fill="' + clr('#7BAA4A', .6) + '" stroke="#5B8A2E" stroke-width="6"/><rect x="92" y="42" width="276" height="216" rx="6" fill="' + fondo + '" stroke="' + osc(T.acc2, .3) + '" stroke-width="2"/><rect x="200" y="70" width="140" height="160" rx="30" fill="' + clr('#4FA3D9', .75) + '"/>';
    else out += '<ellipse cx="230" cy="150" rx="170" ry="120" fill="' + fondo + '" stroke="' + osc(T.acc2, .3) + '" stroke-width="3"/>';
    var nx = veg ? 150 : 230, ny = veg ? 150 : 150;
    out += '<circle cx="' + nx + '" cy="' + ny + '" r="34" fill="' + clr(T.acc, .5) + '" stroke="' + T.acc + '" stroke-width="2"/><circle cx="' + (nx + 6) + '" cy="' + (ny - 4) + '" r="10" fill="' + T.acc + '"/>';
    var mito = function (x, y) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="20" ry="10" fill="#F28B50" stroke="#B85420"/><path d="M' + (x - 14) + ',' + y + ' q5,-7 9,0 t9,0 t9,0" fill="none" stroke="#B85420"/>'; };
    out += mito(veg ? 130 : 110, veg ? 230 : 110) + mito(veg ? 330 : 320, veg ? 250 : 200);
    if (veg) [[120, 80], [300, 60], [360, 150]].forEach(function (p) { out += '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="16" ry="9" fill="#3E8E3E" stroke="#2A5E2A"/>'; });
    else for (var k = 0; k < 14; k++) out += '<circle cx="' + E(r, 110, 360) + '" cy="' + E(r, 70, 230) + '" r="2.4" fill="' + T.ink + '"/>';
    var dest = veg ? { 'pared celular': [84, 36], membrana: [95, 150], 'núcleo': [nx, ny], cloroplasto: [300, 60], vacuola: [270, 150], mitocondria: [130, 230] } : { membrana: [60, 150], citoplasma: [300, 110], 'núcleo': [nx, ny], mitocondria: [110, 110], ribosomas: [340, 230] };
    var ord = H.mezcla(r, partes.map(function (p, i) { return i; }));
    partes.forEach(function (p, i) { var d = dest[p], lx = 470, ly = 30 + i * 44; out += '<line x1="' + d[0] + '" y1="' + d[1] + '" x2="' + (lx - 16) + '" y2="' + ly + '" stroke="' + T.ink + '" stroke-width="1"/><circle cx="' + lx + '" cy="' + ly + '" r="13" fill="' + T.acc + '"/>' + tx(lx, ly + 5, ord[i] + 1, { f: F, s: 13, c: '#fff', w: 700 }); });
    var items = partes.slice(0, peq(C) ? 2 : 4).map(function (p) { return it('corta', '¿Qué número señala ' + (/^(ribosomas)$/.test(p) ? 'los ' : /^(membrana|pared|vacuola|mitocondria)/.test(p) ? 'la ' : 'el ') + p + '?', ord[partes.indexOf(p)] + 1); });
    items.push(mc('¿Es una célula animal o vegetal?', ['animal', 'vegetal'], veg ? 'vegetal' : 'animal', { x: veg ? 'Tiene pared celular y cloroplastos.' : 'No tiene pared celular ni cloroplastos.' }));
    return { t: veg ? 'La célula vegetal' : 'La célula animal', intro: 'Cada número señala un orgánulo. Usa el banco de palabras.', fig: svg(W, Hh, out, 500) + banco(C, H.mezcla(r, partes)), items: items, compacto: true };
  }
  var ELEM = [['H', 'hidrógeno', 1, 1], ['He', 'helio', 1, 18], ['Li', 'litio', 2, 1], ['Be', 'berilio', 2, 2], ['B', 'boro', 2, 13], ['C', 'carbono', 2, 14], ['N', 'nitrógeno', 2, 15], ['O', 'oxígeno', 2, 16], ['F', 'flúor', 2, 17], ['Ne', 'neón', 2, 18], ['Na', 'sodio', 3, 1], ['Mg', 'magnesio', 3, 2], ['Al', 'aluminio', 3, 13], ['Si', 'silicio', 3, 14], ['P', 'fósforo', 3, 15], ['S', 'azufre', 3, 16], ['Cl', 'cloro', 3, 17], ['Ar', 'argón', 3, 18], ['K', 'potasio', 4, 1], ['Ca', 'calcio', 4, 2]];
  function genTabla(u, C, r) {
    var T = C.T, F = T.cuerpo, d3 = es3d(C), c = 30, W = 18 * c + 20, Hh = 4 * c + 40, out = '', sel = H.mezcla(r, ELEM.map(function (e, i) { return i; })).slice(0, 3);
    ELEM.forEach(function (e, i) {
      var x = 10 + (e[3] - 1) * c, y = 20 + (e[2] - 1) * c, on = sel.indexOf(i) >= 0, gas = e[3] === 18, alc = e[3] === 1 && i > 0;
      var f = on ? T.acc : gas ? clr(T.acc2, .7) : alc ? clr(T.acc, .75) : '#fff';
      if (d3) out += '<rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="' + (c - 2) + '" height="' + (c - 2) + '" fill="' + osc(T.ink, .2) + '" opacity=".25"/>';
      out += '<rect x="' + x + '" y="' + y + '" width="' + (c - 2) + '" height="' + (c - 2) + '" fill="' + f + '" stroke="' + T.ink + '" stroke-width=".8"/>' + tx(x + 4, y + 9, i + 1, { f: F, s: 7, c: on ? '#fff' : T.ink, a: 'start' }) + tx(x + c / 2 - 1, y + 22, on ? '?' : e[0], { f: F, s: 12, c: on ? '#fff' : T.ink, w: 700 });
    });
    out += tx(10, 14, '1', { f: F, s: 9, c: T.acc, a: 'start' }) + tx(10 + 17 * c, 14, '18', { f: F, s: 9, c: T.acc, a: 'start' });
    var items = sel.map(function (i) { return it('corta', 'La casilla con número atómico ' + (i + 1) + ' está tapada. ¿Qué símbolo lleva y cómo se llama?', ELEM[i][0] + ' · ' + ELEM[i][1]); });
    items.push(mc('Los elementos de la última columna (grupo 18) son…', ['gases nobles', 'metales alcalinos', 'halógenos'], 'gases nobles'), it('corta', '¿Cuántos protones tiene un átomo de ' + ELEM[sel[0]][1] + '?', sel[0] + 1, { x: 'El número atómico es el número de protones.' }));
    return { t: 'Tabla periódica: los 20 primeros', intro: 'Cada casilla lleva el número atómico y el símbolo. Tres casillas están tapadas.', fig: svg(W, Hh, out, 560), items: items };
  }
  function genPalanca(u, C, r) {
    var T = C.T, F = T.cuerpo, d3 = es3d(C), d1 = E(r, 1, 3), d2 = E(r, d1 + 1, 6), P = E(r, 2, 8) * d2 * 5, Fz = Math.round(P * d1 / d2 * 100) / 100;
    var W = 600, Hh = 240, u0 = 70, fx = 270, y = 130, x0 = fx - d1 * u0, x1 = fx + d2 * u0, out = '';
    if (x1 > 580) { u0 = (580 - 60) / (d1 + d2); fx = 60 + d1 * u0; x0 = 60; x1 = fx + d2 * u0; }
    if (d3) out += '<polygon points="' + x0 + ',' + (y - 6) + ' ' + (x0 + 8) + ',' + (y - 12) + ' ' + (x1 + 8) + ',' + (y - 12) + ' ' + x1 + ',' + (y - 6) + '" fill="' + clr(T.acc, .4) + '"/>';
    out += '<rect x="' + x0 + '" y="' + (y - 6) + '" width="' + (x1 - x0) + '" height="12" fill="' + T.acc + '" stroke="' + osc(T.acc, .3) + '"/><polygon points="' + fx + ',' + (y + 6) + ' ' + (fx - 26) + ',' + (y + 56) + ' ' + (fx + 26) + ',' + (y + 56) + '" fill="' + T.ink + '"/>' + (d3 ? '<polygon points="' + fx + ',' + (y + 6) + ' ' + (fx + 26) + ',' + (y + 56) + ' ' + (fx + 36) + ',' + (y + 50) + '" fill="' + osc(T.ink, .1) + '" opacity=".6"/>' : '');
    out += '<rect x="' + (x0 - 2) + '" y="' + (y - 56) + '" width="44" height="50" rx="' + Math.min(T.r, 4) + '" fill="' + T.acc2 + '"/>' + tx(x0 + 20, y - 26, P + ' N', { f: F, s: 13, c: '#fff', w: 700 });
    out += '<line x1="' + (x1 - 8) + '" y1="' + (y - 80) + '" x2="' + (x1 - 8) + '" y2="' + (y - 12) + '" stroke="' + T.ink + '" stroke-width="3"/><polygon points="' + (x1 - 8) + ',' + (y - 8) + ' ' + (x1 - 15) + ',' + (y - 22) + ' ' + (x1 - 1) + ',' + (y - 22) + '" fill="' + T.ink + '"/>' + tx(x1 - 8, y - 88, 'F = ?', { f: F, s: 14, c: T.ink, w: 700 });
    var cota = function (a, b, t) { return '<line x1="' + a + '" y1="' + (y + 72) + '" x2="' + b + '" y2="' + (y + 72) + '" stroke="' + T.acc2 + '" stroke-width="1.4"/><line x1="' + a + '" y1="' + (y + 66) + '" x2="' + a + '" y2="' + (y + 78) + '" stroke="' + T.acc2 + '"/><line x1="' + b + '" y1="' + (y + 66) + '" x2="' + b + '" y2="' + (y + 78) + '" stroke="' + T.acc2 + '"/>' + tx((a + b) / 2, y + 92, t, { f: F, s: 13, c: T.acc2, w: 700 }); };
    out += cota(x0 + 20, fx, d1 + ' m') + cota(fx, x1 - 8, d2 + ' m');
    var items = [it('corta', '¿Qué fuerza F equilibra la palanca?', fmt(Fz, C) + ' N', { x: 'Ley de la palanca: P · d₁ = F · d₂ → F = ' + P + ' · ' + d1 + ' ÷ ' + d2 + '.' }), mc('¿Qué tipo de palanca es?', ['primer grado', 'segundo grado', 'tercer grado'], 'primer grado', { x: 'El punto de apoyo está entre la carga y la fuerza.' }), it('abierta', 'Si alargas el brazo de la fuerza, ¿tienes que empujar más o menos? Explícalo.', 'Menos: a más brazo, menos fuerza.', { lin: 2 })];
    return { t: 'La palanca', intro: 'Una barra rígida gira sobre el punto de apoyo. La carga está a ' + d1 + ' m del apoyo; la fuerza, a ' + d2 + ' m.', fig: svg(W, Hh, out, 540), items: peq(C) ? items.slice(1, 3) : items };
  }

  /* ─────────── sociales: línea del tiempo del país a escala ─────────── */
  function siglo(a) { var s = Math.floor((a - 1) / 100) + 1, v = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']], o = ''; v.forEach(function (p) { while (s >= p[0]) { o += p[1]; s -= p[0]; } }); return o; }
  function genLinea(u, C, r) {
    var h = (C.P.historia || []).map(function (x) { return [parseInt(x[0], 10), x[1]]; }).filter(function (x) { return x[0]; }); if (h.length < 3) return null;
    var T = C.T, F = T.cuerpo, d3 = es3d(C), a0 = Math.floor(h[0][0] / 100) * 100, a1 = Math.ceil((h[h.length - 1][0] + 1) / 100) * 100, W = 640, Hh = 190, X = function (a) { return 30 + (a - a0) / (a1 - a0) * 580; }, out = '';
    if (d3) out += '<rect x="30" y="84" width="580" height="14" fill="' + osc(T.acc, .35) + '"/>';
    out += '<rect x="30" y="78" width="580" height="14" fill="' + T.acc + '"/>';
    for (var a = a0; a <= a1; a += 100) out += '<line x1="' + r1(X(a)) + '" y1="72" x2="' + r1(X(a)) + '" y2="98" stroke="' + T.ink + '" stroke-width="1.2"/>' + tx(X(a), 116, a, { f: F, s: 11, c: T.ink });
    var ord = H.mezcla(r, h.map(function (x, i) { return i; }));
    h.forEach(function (x, i) { var px = X(x[0]), up = i % 2 === 0; out += '<line x1="' + r1(px) + '" y1="' + (up ? 40 : 92) + '" x2="' + r1(px) + '" y2="' + (up ? 78 : 140) + '" stroke="' + T.acc2 + '" stroke-width="1.4"/><circle cx="' + r1(px) + '" cy="' + (up ? 30 : 152) + '" r="12" fill="' + T.acc2 + '"/>' + tx(px, (up ? 30 : 152) + 5, String.fromCharCode(65 + ord[i]), { f: F, s: 13, c: '#fff', w: 700 }); });
    var e1 = h[ord.indexOf(0)] || h[0], i2 = Math.min(h.length - 1, 1 + E(r, 1, h.length - 2)), dif = Math.abs(h[i2][0] - h[0][0]);
    var items = [it('corta', '¿Qué letra corresponde a «' + e1[1] + '» (' + e1[0] + ')?', 'A', { x: 'Busca el año en la escala.' }), it('corta', '¿Cuántos años pasaron entre «' + h[0][1] + '» y «' + h[i2][1] + '»?', dif + ' años'), it('corta', '¿En qué siglo ocurrió «' + h[h.length - 1][1] + '»?', 'siglo ' + siglo(h[h.length - 1][0]))];
    var lista = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5mm 6mm;margin-top:3mm;font-size:.9em">' + h.map(function (x) { return '<div>· ' + esc(x[0] + ' — ' + x[1]) + '</div>'; }).join('') + '</div>';
    return { t: 'Línea del tiempo de ' + (C.P.id === 'us' ? 'Estados Unidos' : C.P.n), intro: 'Cada marca de la escala es un siglo. Relaciona cada letra con su acontecimiento.', fig: svg(W, Hh, out, 600) + lista, items: items, compacto: true };
  }

  /* ─────────── música: compases ─────────── */
  var FIG = [['redonda', 4], ['blanca', 2], ['negra', 1], ['corchea', .5]];
  function nota(x, y, f, c) {
    var o = '<ellipse cx="' + x + '" cy="' + y + '" rx="7.5" ry="5.5" transform="rotate(-20 ' + x + ' ' + y + ')" fill="' + (f === 'redonda' || f === 'blanca' ? '#fff' : c) + '" stroke="' + c + '" stroke-width="2"/>';
    if (f !== 'redonda') o += '<line x1="' + (x + 6.5) + '" y1="' + (y - 2) + '" x2="' + (x + 6.5) + '" y2="' + (y - 38) + '" stroke="' + c + '" stroke-width="2"/>';
    if (f === 'corchea') o += '<path d="M' + (x + 6.5) + ',' + (y - 38) + ' q10,8 8,20" fill="none" stroke="' + c + '" stroke-width="2"/>';
    return o;
  }
  function genRitmo(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 640, Hh = 150, out = '', comp = [], x = 70;
    for (var q = 0; q < 3; q++) { var rest = 4, c = []; while (rest > 0) { var op = FIG.filter(function (f) { return f[1] <= rest && (q < 2 || f[1] < 4); }), f = H.pick(r, op); c.push(f); rest -= f[1]; } comp.push(c); }
    var falta = comp[2].pop(); var sumaFalta = falta[1];
    for (var l = 0; l < 5; l++) out += '<line x1="20" y1="' + (40 + l * 10) + '" x2="620" y2="' + (40 + l * 10) + '" stroke="' + T.ink + '" stroke-width="1"/>';
    out += tx(40, 62, '4', { f: F, s: 20, c: T.ink, w: 700 }) + tx(40, 82, '4', { f: F, s: 20, c: T.ink, w: 700 });
    comp.forEach(function (c, i) {
      var ancho = 180, px = x + 18;
      c.forEach(function (f) { out += nota(px, 70 - (E(r, 0, 4) * 5), f[0], T.acc); px += Math.max(26, f[1] * 36); });
      if (i === 2) out += '<rect x="' + px + '" y="36" width="44" height="46" fill="none" stroke="' + T.acc2 + '" stroke-dasharray="4 3" stroke-width="2"/>' + tx(px + 22, 64, '?', { f: F, s: 18, c: T.acc2, w: 700 });
      x += ancho; out += '<line x1="' + x + '" y1="40" x2="' + x + '" y2="80" stroke="' + T.ink + '" stroke-width="1.6"/>';
    });
    out += tx(320, 128, 'Redonda = 4 · Blanca = 2 · Negra = 1 · Corchea = ½ tiempo', { f: F, s: 13, c: T.ink });
    var items = [it('corta', '¿Cuántos tiempos tiene cada compás de 4/4?', 4), it('corta', '¿Cuántos tiempos faltan en el tercer compás?', fmt(sumaFalta, C)), mc('¿Qué figura completa el tercer compás?', FIG.map(function (f) { return f[0]; }).slice(0, 4).filter(function (n, i, a) { return true; }), falta[0])];
    items.push(it('abierta', 'Da palmas al ritmo del primer compás contando en voz alta «1, 2, 3, 4».', '', { lin: 1 }));
    return { t: 'Compases y figuras', intro: 'En un compás de 4/4 caben cuatro tiempos. Cada figura dura un número fijo de tiempos.', fig: svg(W, Hh, out, 600), items: items };
  }

  /* ─────────── educación física: pulso ─────────── */
  function genPulso(u, C, r) {
    var T = C.T, F = T.cuerpo, d3 = es3d(C), edad = { pri1: 7, pri2: 9, pri3: 11, sec: 14, bach: 17, fp: 18, adu: 35 }[C.bnd] || 14, rep = E(r, 62, 78);
    var pts = [rep, rep + E(r, 3, 8), rep + E(r, 25, 40), E(r, 130, 150), E(r, 150, 172), E(r, 140, 160), E(r, 110, 125), E(r, 90, 100), rep + E(r, 5, 12)];
    var W = 600, Hh = 260, X = function (i) { return 60 + i * 64; }, Y = function (v) { return 220 - (v - 50) * 1.3; }, out = '';
    for (var v = 60; v <= 180; v += 20) out += '<line x1="60" y1="' + r1(Y(v)) + '" x2="580" y2="' + r1(Y(v)) + '" stroke="' + T.soft + '"/>' + tx(52, Y(v) + 4, v, { f: F, s: 11, c: T.ink, a: 'end' });
    pts.forEach(function (p, i) { out += tx(X(i), 242, i * 2, { f: F, s: 11, c: T.ink }); });
    out += tx(320, 258, 'minutos', { f: F, s: 11, c: T.ink }) + tx(20, 30, 'pulsaciones/min', { f: F, s: 11, c: T.ink, a: 'start' });
    var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + X(i) + ',' + r1(Y(p)); }).join(' ');
    if (d3) out += '<path d="' + d + ' L' + X(pts.length - 1) + ',220 L60,220 Z" fill="' + clr(T.acc, .75) + '"/>';
    out += '<path d="' + d + '" fill="none" stroke="' + T.acc + '" stroke-width="3" stroke-linejoin="round"/>' + pts.map(function (p, i) { return '<circle cx="' + X(i) + '" cy="' + r1(Y(p)) + '" r="4" fill="' + T.acc2 + '"/>'; }).join('');
    var mx = Math.max.apply(null, pts), im = pts.indexOf(mx);
    var items = [it('corta', '¿Cuál fue el pulso más alto?', mx + ' pulsaciones/min'), it('corta', '¿En qué minuto se alcanzó?', 'en el minuto ' + im * 2), it('corta', '¿Cuánto subió el pulso desde el reposo hasta el máximo?', (mx - rep) + ' pulsaciones/min'), it('corta', 'Frecuencia cardiaca máxima estimada para ' + edad + ' años (220 − edad):', (220 - edad) + ' pulsaciones/min')];
    return { t: 'El pulso durante la sesión', intro: 'Pulso medido cada dos minutos: reposo, calentamiento, parte principal y vuelta a la calma.', fig: svg(W, Hh, out, 560), items: peq(C) ? items.slice(0, 2) : items };
  }

  /* ─────────── peluquería: alturas de tono ─────────── */
  var TONOS = [['negro', '#1b1512'], ['castaño muy oscuro', '#2b1f19'], ['castaño oscuro', '#3b2a20'], ['castaño medio', '#4f3627'], ['castaño claro', '#6a4a33'], ['rubio oscuro', '#86613f'], ['rubio medio', '#a4804f'], ['rubio claro', '#c3a06a'], ['rubio muy claro', '#dcc08f'], ['rubio clarísimo', '#eedcb6']];
  function genTonos(u, C, r) {
    var T = C.T, F = T.cuerpo, d3 = es3d(C), W = 620, Hh = 170, w = 58, out = '', a = E(r, 3, 6), b = E(r, a + 1, Math.min(10, a + 4)), ocu = E(r, 1, 10);
    TONOS.forEach(function (t, i) {
      var x = 20 + i * w, id = 'eut' + (++uid);
      if (d3) out += '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="' + osc(t[1], .25) + '"/><stop offset=".5" stop-color="' + clr(t[1], .12) + '"/><stop offset="1" stop-color="' + osc(t[1], .25) + '"/></linearGradient></defs>';
      out += '<path d="M' + (x + 8) + ',20 q' + (w / 2 - 8) + ',-10 ' + (w - 16) + ',0 l4,90 q-' + (w / 2 - 4) + ',14 -' + (w - 8) + ',0 z" fill="' + (d3 ? 'url(#' + id + ')' : t[1]) + '"/>' + tx(x + w / 2, 134, i + 1 === ocu ? '?' : i + 1, { f: F, s: 16, c: T.ink, w: 700 });
    });
    var items = [it('corta', '¿Cuántos tonos hay que aclarar para pasar de altura ' + a + ' a altura ' + b + '?', b - a), it('corta', '¿Qué nombre tiene la altura ' + ocu + '?', TONOS[ocu - 1][0]), it('corta', '¿Qué altura es el «' + TONOS[a - 1][0] + '»?', a)];
    return { t: 'Alturas de tono', intro: 'La altura de tono mide lo claro u oscuro que es un cabello, del 1 (negro) al 10 (rubio clarísimo).', fig: svg(W, Hh, out, 600), items: items };
  }

  SV.visual('mapa_ruta', genRuta, { materias: /^(soci|geografia|mate|valores|idiomas|lengua|ingles|efisica|historia|geoalg|calculo)$/, max: 2 });
  SV.visual('mapa_compara', genCompara, { materias: /^(geografia|soci|mate|historia|geoalg|calculo)$/, max: 1 });
  SV.visual('bloques', genBloques, { materias: /^(mate|tecno|arte|fisica|geoalg|calculo)$/, max: 2 });
  SV.visual('arbol_frase', genArbol, { materias: /^lengua$/, max: 2 });
  SV.visual('plato', genPlato, { materias: /^(natu|bio|anat|efisica|cocina|reposteria|batidos|valores)$/, max: 1 });
  SV.visual('ciclo_agua', genCicloAgua, { materias: /^(natu|geografia|fisica|bio|quimica)$/, max: 1 });
  SV.visual('celula', genCelula, { materias: /^(bio|natu|anat)$/, max: 2 });
  SV.visual('tabla_periodica', genTabla, { materias: /^(quimica|fisica|natu)$/, max: 2 });
  SV.visual('palanca', genPalanca, { materias: /^(fisica|tecno|natu|efisica)$/, max: 2 });
  SV.visual('linea_pais', genLinea, { materias: /^(soci|valores|religion|lengua|geografia|arte|musica|historia)$/, max: 1 });
  SV.visual('ritmo', genRitmo, { materias: /^musica$/, max: 3 });
  SV.visual('pulso', genPulso, { materias: /^(efisica|anat|bio)$/, max: 2 });
  SV.visual('tonos', genTonos, { materias: /^pelu$/, max: 2 });

  window.EU_DIBUJOS = { km: km, kmPorUnidad: kmPorUnidad, ruta: genRuta, compara: genCompara, bloques: genBloques, arbol: genArbol, plato: genPlato, cicloAgua: genCicloAgua, celula: genCelula, tabla: genTabla, palanca: genPalanca, linea: genLinea, ritmo: genRitmo, pulso: genPulso, tonos: genTonos };
})();
