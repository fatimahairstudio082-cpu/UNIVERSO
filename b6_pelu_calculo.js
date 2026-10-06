/* b6_pelu_calculo.js — calculadora de geometría capilar (window.EU_CALCULO_CAPILAR).
   La geometría del corte como en una calculadora científica: cualquier ángulo (con decimales, 0–225°), guía móvil o
   fija capa a capa, y el largo que queda en cada capa calculado con trigonometría sobre la curva de la cabeza.
   · Cabeza en perfil = arco de radio R = contorno / 2π; la nuca está a «nuca–coronilla» cm de la coronilla por el arco.
     Medidas: las del maniquí estándar (a validar) o las de la clienta (localStorage `eu_medidas_clienta`, clave nueva).
   · Ángulo: referencia «cráneo» por defecto (0 cae, 90 = perpendicular a la curva en ese punto, 180 arriba, 225 pasado
     hacia delante) o «suelo» (90 = horizontal hacia fuera, como la regla de las animaciones de capas).
   · Guía móvil: la guía viaja en secciones finas (2 mm); cada sección se eleva junto con la nueva y se corta a su largo:
       L(s+ds) = L(s) + (P(s) − P(s+ds)) · d    (al límite: a 90° del cráneo los largos quedan iguales)
     Guía fija: todo se lleva al punto de la guía G = P(0) + L(0)·d(0) (sobredirección): L(i) = |G − P(i)|, y si la
     recta atravesaría la cabeza, el mechón rodea el cráneo (arco hasta la tangente + tramo recto hasta G).
   · Forma resultante: se calcula de los largos (no se inventa): un largo, uniforme, graduado, en aumento o combinada.
     Los nombres salen «a validar por Fátima».
   · Escuadra (45°/45°/90°) y cartabón (30°/60°/90°): cómo se traza el ángulo sumando o restando sus piezas. */
(function () {
  'use strict';
  if (window.EU_CALCULO_CAPILAR) return;
  var CLAVE = 'eu_medidas_clienta';
  var ESTANDAR = { guia: 20, contorno: 56, nucaCoronilla: 17 };   /* maniquí estándar, en cm (a validar por Fátima) */
  var D2R = Math.PI / 180;

  function medidas() {
    var m = null; try { m = JSON.parse(localStorage.getItem(CLAVE) || 'null'); } catch (e) { m = null; }
    var o = Object.assign({}, ESTANDAR, m || {}); o.estandar = !m; return o;
  }
  function guardarMedidas(m) {
    var o = {}; ['guia', 'contorno', 'nucaCoronilla'].forEach(function (k) { var v = +m[k]; if (v > 0) o[k] = v; });
    try { localStorage.setItem(CLAVE, JSON.stringify(o)); return true; } catch (e) { return false; }
  }
  function borrarMedidas() { try { localStorage.removeItem(CLAVE); } catch (e) { } }

  /* ─── escuadra y cartabón: ángulos que se trazan sumando o restando sus piezas (hasta 3) ─── */
  var PIEZAS = [[90, 'recto'], [45, 'escuadra'], [30, 'cartabón'], [60, 'cartabón']], TRAZO = null;
  function trazos() {
    if (TRAZO) return TRAZO; TRAZO = {};
    function poner(g, s) { if (g > 0 && g <= 225 && !TRAZO[g]) TRAZO[g] = s; }
    PIEZAS.forEach(function (a) { poner(a[0], a[0] + '° (' + a[1] + ')'); });
    PIEZAS.forEach(function (a) { PIEZAS.forEach(function (b) { poner(a[0] + b[0], a[0] + '° + ' + b[0] + '°'); poner(a[0] - b[0], a[0] + '° − ' + b[0] + '°'); }); });
    PIEZAS.forEach(function (a) { PIEZAS.forEach(function (b) { PIEZAS.forEach(function (c) { poner(a[0] + b[0] + c[0], a[0] + '° + ' + b[0] + '° + ' + c[0] + '°'); poner(a[0] + b[0] - c[0], a[0] + '° + ' + b[0] + '° − ' + c[0] + '°'); }); }); });
    return TRAZO;
  }
  function trazar(g) {
    g = +g || 0; if (g === 0) return '0°: el mechón cae natural (sin instrumento)';
    var e = Math.round(g * 10) / 10; if (e === Math.round(e) && trazos()[e]) return trazos()[e];
    return 'con transportador (' + fmt(e) + '°)';
  }
  function fmt(n) { return String(Math.round(n * 10) / 10).replace('.', ','); }

  /* ─── geometría de perfil (cm): origen en el centro de la cabeza, x hacia atrás, y hacia arriba ─── */
  function dir(b, g, ref) {
    /* b: posición en el arco (0 = coronilla, crece hacia la nuca); g: elevación en grados */
    var a;
    if (ref === 'craneo') {
      var aDown = -90, aN = Math.atan2(Math.cos(b), Math.sin(b)) / D2R, aUp = 90;
      a = g <= 90 ? aDown + (aN - aDown) * g / 90 : g <= 180 ? aN + (aUp - aN) * (g - 90) / 90 : aUp + (g - 180);
    } else a = g - 90;
    return [Math.cos(a * D2R), Math.sin(a * D2R)];
  }
  function suma(p, d, l) { return [p[0] + d[0] * l, p[1] + d[1] * l]; }
  function resta(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
  function pesc(a, b) { return a[0] * b[0] + a[1] * b[1]; }

  /* Guía fija: el mechón va al punto de la guía G. Si la recta atravesaría la cabeza, rodea el cráneo:
     arco sobre la curva hasta el punto de tangencia T y de ahí recto hasta G (camino más corto por fuera). */
  function haciaGuia(P, G, R) {
    var v = resta(G, P), dl = Math.sqrt(pesc(v, v)) || 1e-6, n = [P[0] / R, P[1] / R];
    if (pesc(v, n) >= 0) return { largo: dl, dir: [v[0] / dl, v[1] / dl], camino: null };
    var gL = Math.sqrt(pesc(G, G)); if (gL <= R) return { largo: dl, dir: [v[0] / dl, v[1] / dl], camino: null };
    var aP = Math.atan2(P[1], P[0]), aG = Math.atan2(G[1], G[0]), ab = Math.acos(R / gL), mejor = null;
    [aG + ab, aG - ab].forEach(function (aT) {
      var da = aT - aP; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
      var Lc = Math.abs(da) * R + Math.sqrt(gL * gL - R * R); if (!mejor || Lc < mejor.largo) mejor = { largo: Lc, aT: aT, da: da };
    });
    var cam = [], k = Math.max(2, Math.ceil(Math.abs(mejor.da) / 0.1));
    for (var j = 0; j <= k; j++) { var a = aP + mejor.da * j / k; cam.push([R * Math.cos(a), R * Math.sin(a)]); }
    cam.push(G.slice());
    var T = cam[cam.length - 2], w = resta(G, T), wl = Math.sqrt(pesc(w, w)) || 1e-6;
    return { largo: mejor.largo, dir: [w[0] / wl, w[1] / wl], camino: cam };
  }

  /* o = { capas:[grados…], guias:['m'|'f'…], ref:'suelo'|'craneo' } · m = medidas (opcional) */
  function calcular(o, m) {
    o = o || {}; m = Object.assign({}, medidas(), m || {});
    var pila = (o.capas || []).map(function (g) { return Math.max(0, Math.min(225, +g || 0)); }); if (!pila.length) pila = [0];
    var n = pila.length, R = m.contorno / (2 * Math.PI), b0 = Math.min(Math.PI * 0.75, m.nucaCoronilla / R), b1 = Math.min(0.12, b0 / 4), ref = o.ref === 'suelo' ? 'suelo' : 'craneo';
    var gu = (o.guias || []).map(function (x) { return /^f/i.test(String(x)) ? 'fija' : 'movil'; });
    var capas = [], G = null;
    for (var i = 0; i < n; i++) {
      var b = n === 1 ? b0 : b0 - (b0 - b1) * i / (n - 1), P = [R * Math.sin(b), R * Math.cos(b)], d = dir(b, pila[i], ref), guia = i === 0 ? 'guía' : (gu[i] || gu[gu.length - 1] || 'movil'), L;
      if (i === 0) L = +m.guia || ESTANDAR.guia;
      else if (guia === 'fija') { var cf = haciaGuia(P, G, R); L = cf.largo; d = cf.dir; var camino = cf.camino; }
      else {
        /* la guía viaja en secciones finas (2 mm), como en el corte real: cada sección se eleva a la capa que toca */
        var A = capas[i - 1], k = Math.max(1, Math.ceil(Math.abs(A.b - b) * R / 0.2)), Lc = A.largo, Pc = A.raiz;
        for (var s = 1; s <= k; s++) { var bs = A.b + (b - A.b) * s / k, Ps = [R * Math.sin(bs), R * Math.cos(bs)]; Lc = Lc + pesc(resta(Pc, Ps), dir(bs, pila[i], ref)); Pc = Ps; }
        L = Lc;
      }
      L = Math.max(0.5, L);
      var c = { i: i, b: b, raiz: P, ang: pila[i], guia: guia, dir: d, largo: L, punta: guia === 'fija' ? G.slice() : suma(P, d, L), escuadra: trazar(pila[i]) };
      if (guia === 'fija' && camino) c.camino = camino; camino = null;
      if (i === 0) G = c.punta;
      capas.push(c);
    }
    var Ls = capas.map(function (c) { return c.largo; }), mx = Math.max.apply(null, Ls), mn = Math.min.apply(null, Ls), dif = [];
    for (var j = 1; j < n; j++) dif.push(Ls[j] - Ls[j - 1]);
    var sube = dif.every(function (x) { return x >= -0.3; }), baja = dif.every(function (x) { return x <= 0.3; }), forma;
    if (pila.every(function (g) { return g === 0; })) forma = 'línea sólida · un solo largo';
    else if (mx - mn <= 0.6 * Math.max(1, n / 4)) forma = 'capas uniformes';
    else if (sube) forma = 'graduación · escalonado (peso abajo)';
    else if (baja) forma = 'capas en aumento (más cortas arriba)';
    else forma = 'forma combinada';
    var texto = capas.map(function (c) { return 'Capa ' + (c.i + 1) + ' a ' + fmt(c.ang) + '°' + (c.i ? ' con guía ' + (c.guia === 'movil' ? 'móvil' : c.guia) : ' (guía)') + ': ' + fmt(c.largo) + ' cm'; }).join('. ') + '. Forma resultante: ' + forma + ' (a validar).';
    return { medidas: m, R: R, ref: ref, capas: capas, largos: Ls, dif: dif, forma: forma, texto: texto };
  }

  window.EU_CALCULO_CAPILAR = { ESTANDAR: ESTANDAR, medidas: medidas, guardarMedidas: guardarMedidas, borrarMedidas: borrarMedidas, calcular: calcular, trazar: trazar, fmt: fmt };
})();
