/* b6_dibujos_plus2.js — dibujos propios para las materias con menos figuras en la biblioteca visual.
   · IA: red neuronal, matriz de confusión, árbol de decisión.
   · Marketing: recorrido del cliente con conversiones, mapa de posicionamiento.
   · Emprendimiento: lienzo del modelo de negocio, mapa de empatía.
   · Música: teclado de piano, notas en el pentagrama.
   · Peluquería: estructura del cabello, escala de pH de productos.
   · Religión: planta de una iglesia. Lengua: elementos de la comunicación.
   · Inglés e Idiomas: la hora en el reloj. Infantil: contar frutas (EU_BOTANICA).
   · Recetarios: cortes de cuchillo a escala, curva de fermentación.
   Además registra alias de figuras que ya existían para materias que no las recibían
   (punto de equilibrio y flujo de caja en Emprendimiento, porcentajes y estadística en Marketing e IA,
   colorimetría y pH en Peluquería). Cargar después de b6_dibujos_materias.js y b6_laminas_plus.js. */
(function () {
  'use strict';
  var ED = window.EU_EDITORIAL, SV = window.EU_SVG;
  if (!ED || !SV || !SV.visual || window.EU_DIBUJOS2) return;
  var H = ED.H, esc = H.esc, it = H.it, E = H.ent, osc = SV.osc, clr = SV.clr, NS = 'xmlns="http://www.w3.org/2000/svg"';
  function r1(n) { return Math.round(n * 10) / 10; }
  function es3d(C) { return C.prem ? C.prem.dibujo === '3d' : (((C.cfg && C.cfg.acab) || {}).dibujo || '3d') === '3d'; }
  function svg(w, h, body, maxw) { return '<svg ' + NS + ' data-plano="1" viewBox="0 0 ' + w + ' ' + h + '" style="width:100%;max-width:' + (maxw || w) + 'px;height:auto;display:block;margin:0 auto">' + body + '</svg>'; }
  function tx(x, y, s, o) { o = o || {}; return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || 'middle') + '" font-size="' + (o.s || 13) + '" font-family="' + esc(o.f || 'sans-serif') + '" font-weight="' + (o.w || 400) + '" fill="' + (o.c || '#222') + '">' + esc(s) + '</text>'; }
  function rc(x, y, w, h, o) { o = o || {}; return '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(w) + '" height="' + r1(h) + '" rx="' + (o.rx || 0) + '" fill="' + (o.f || 'none') + '" stroke="' + (o.s || 'none') + '" stroke-width="' + (o.sw || 1.5) + '"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : '') + '/>'; }
  function ln(x1, y1, x2, y2, c, w, o) { return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + c + '" stroke-width="' + (w || 1.5) + '"' + (o || '') + '/>'; }
  function sombra(C, x, y, w, h, rx) { return es3d(C) ? rc(x + 3, y + 4, w, h, { rx: rx, f: '#000' }).replace('/>', ' opacity=".13"/>') : ''; }
  function fmt(n, C) { return H.num(n, C); }
  function mc(e, ops, bien, x) { return it('mc', e, 'abc'.charAt(ops.indexOf(bien)) + ') ' + bien, Object.assign({ o: ops, c: ops.indexOf(bien) }, x || {})); }
  function peq(C) { return /^(inf|pri1|pri2)$/.test(C.bnd || ''); }
  function flecha(x1, y1, x2, y2, c) { var a = Math.atan2(y2 - y1, x2 - x1), L = 8; return ln(x1, y1, x2, y2, c, 1.8) + '<path d="M' + r1(x2) + ' ' + r1(y2) + ' L' + r1(x2 - L * Math.cos(a - .45)) + ' ' + r1(y2 - L * Math.sin(a - .45)) + ' L' + r1(x2 - L * Math.cos(a + .45)) + ' ' + r1(y2 - L * Math.sin(a + .45)) + 'Z" fill="' + c + '"/>'; }

  /* ─────────── IA ─────────── */
  function genRed(u, C, r) {
    var T = C.T, F = T.cuerpo, capas = [E(r, 2, 4), E(r, 3, 5), E(r, 2, 4), E(r, 1, 3)];
    if (r() < .4) capas.splice(2, 1);
    var W = 600, Hh = 330, xs = capas.map(function (_, i) { return 70 + i * (W - 140) / (capas.length - 1); }), out = '', pos = [];
    capas.forEach(function (n, i) { pos.push([]); for (var k = 0; k < n; k++) pos[i].push([xs[i], 50 + (k + .5) * (230 / n)]); });
    for (var i = 0; i < capas.length - 1; i++) pos[i].forEach(function (a) { pos[i + 1].forEach(function (b) { out += ln(a[0], a[1], b[0], b[1], clr(T.acc, .55), 1); }); });
    pos.forEach(function (col, i) {
      var c = i === 0 ? T.acc2 : i === capas.length - 1 ? osc(T.acc, .25) : T.acc;
      col.forEach(function (p) { if (es3d(C)) out += '<circle cx="' + (p[0] + 2) + '" cy="' + (p[1] + 3) + '" r="15" fill="#000" opacity=".15"/>'; out += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="15" fill="' + clr(c, .75) + '" stroke="' + c + '" stroke-width="2.5"/>'; });
      out += tx(xs[i], 305, i === 0 ? 'Entrada' : i === capas.length - 1 ? 'Salida' : 'Oculta ' + i, { f: F, s: 13, w: 700, c: T.ink });
    });
    var con = 0; for (var j = 0; j < capas.length - 1; j++) con += capas[j] * capas[j + 1];
    var items = [it('corta', '¿Cuántas neuronas tiene la capa de entrada?', capas[0]), it('corta', '¿Cuántas conexiones (pesos) hay en total entre capas?', con, { x: capas.slice(0, -1).map(function (n, i) { return n + ' × ' + capas[i + 1]; }).join(' + ') + ' = ' + con }), it('corta', '¿Cuántas capas ocultas tiene la red?', capas.length - 2),
      mc('Durante el entrenamiento, ¿qué se ajusta?', ['los pesos de las conexiones', 'el número de datos', 'el color de las neuronas'], 'los pesos de las conexiones')];
    return { t: 'Una red neuronal por dentro', intro: 'Cada círculo es una neurona y cada línea, una conexión con su peso. Los datos entran por la izquierda y la predicción sale por la derecha.', fig: svg(W, Hh, out, 560), items: items };
  }
  function genMatriz(u, C, r) {
    var T = C.T, F = T.cuerpo, casos = H.pick(r, [['correo basura', 'basura', 'normal'], ['fruta madura', 'madura', 'verde'], ['foto con gato', 'gato', 'sin gato'], ['transacción fraudulenta', 'fraude', 'legítima']]);
    var VP = E(r, 30, 60), FN = E(r, 3, 12), FP = E(r, 2, 10), VN = E(r, 40, 90), tot = VP + FN + FP + VN;
    var W = 520, Hh = 350, x0 = 170, y0 = 80, s = 130, out = '';
    out += tx(x0 + s, 30, 'Lo que predijo el modelo', { f: F, s: 14, w: 700, c: T.ink }) + tx(x0 + s / 2, 62, casos[1], { f: F, s: 13, c: T.ink }) + tx(x0 + s * 1.5, 62, casos[2], { f: F, s: 13, c: T.ink });
    out += '<text x="40" y="' + (y0 + s) + '" transform="rotate(-90 40 ' + (y0 + s) + ')" text-anchor="middle" font-size="14" font-weight="700" font-family="' + esc(F) + '" fill="' + T.ink + '">Lo que era en realidad</text>';
    out += tx(x0 - 12, y0 + s / 2 + 4, casos[1], { f: F, s: 13, a: 'end', c: T.ink }) + tx(x0 - 12, y0 + s * 1.5 + 4, casos[2], { f: F, s: 13, a: 'end', c: T.ink });
    [[0, 0, VP, 'aciertos (VP)', T.acc], [1, 0, FN, 'falsos negativos', T.acc2], [0, 1, FP, 'falsos positivos', T.acc2], [1, 1, VN, 'aciertos (VN)', T.acc]].forEach(function (c) {
      var x = x0 + c[0] * s, y = y0 + c[1] * s; out += sombra(C, x + 3, y + 3, s - 6, s - 6, 6) + rc(x + 3, y + 3, s - 6, s - 6, { rx: 6, f: clr(c[4], c[4] === T.acc ? .72 : .8), s: c[4], sw: 2 }) + tx(x + s / 2, y + s / 2 + 4, String(c[2]), { f: F, s: 30, w: 700, c: osc(c[4], .3) }) + tx(x + s / 2, y + s - 18, c[3], { f: F, s: 11, c: T.ink });
    });
    var exa = Math.round((VP + VN) / tot * 1000) / 10, pre = Math.round(VP / (VP + FP) * 1000) / 10, sen = Math.round(VP / (VP + FN) * 1000) / 10;
    var items = [it('corta', '¿Cuántos casos se evaluaron en total?', tot), it('corta', 'Exactitud: aciertos ÷ total (en %, un decimal).', fmt(exa, C) + ' %', { ac: [exa, fmt(exa, C)], x: '(' + VP + ' + ' + VN + ') ÷ ' + tot + ' × 100' }), it('corta', 'Precisión: de los que predijo «' + casos[1] + '», ¿qué % acertó?', fmt(pre, C) + ' %', { ac: [pre, fmt(pre, C)], x: VP + ' ÷ (' + VP + ' + ' + FP + ') × 100' }), it('corta', 'Sensibilidad: de los que eran «' + casos[1] + '», ¿qué % detectó?', fmt(sen, C) + ' %', { ac: [sen, fmt(sen, C)], x: VP + ' ÷ (' + VP + ' + ' + FN + ') × 100' })];
    return { t: 'Matriz de confusión', intro: 'Un modelo que clasifica ' + casos[0] + ' se ha probado con casos cuya respuesta real conocemos. La diagonal son los aciertos.', fig: svg(W, Hh, out, 480), items: items };
  }
  function genArbol(u, C, r) {
    var T = C.T, F = T.cuerpo, A = H.pick(r, [
      { t: '¿Aprobar un préstamo pequeño?', p: ['¿Ingresos fijos?', '¿Deudas > 40 %?', '¿Aval?'], h: ['Aprobar', 'Revisar', 'Revisar', 'Rechazar'] },
      { t: '¿Qué ropa llevar?', p: ['¿Llueve?', '¿Hace frío?', '¿Hace sol?'], h: ['Abrigo e impermeable', 'Impermeable', 'Gorra', 'Chaqueta ligera'] },
      { t: '¿Responder un correo ya?', p: ['¿Es urgente?', '¿Menos de 2 min?', '¿Es de un cliente?'], h: ['Responder ya', 'Responder hoy', 'Responder hoy', 'Archivar'] }
    ]);
    var W = 600, Hh = 320, out = '';
    var nodo = function (x, y, s, raiz) { var w = Math.max(120, s.length * 7.2); return sombra(C, x - w / 2, y - 18, w, 36, 18) + rc(x - w / 2, y - 18, w, 36, { rx: 18, f: raiz ? clr(T.acc, .7) : clr(T.acc, .85), s: T.acc, sw: 2 }) + tx(x, y + 5, s, { f: F, s: 13, w: 700, c: T.ink }); };
    var hoja = function (x, y, s) { var w = Math.max(110, s.length * 6.8); return rc(x - w / 2, y - 16, w, 32, { rx: 4, f: clr(T.acc2, .82), s: T.acc2, sw: 1.8 }) + tx(x, y + 5, s, { f: F, s: 12, c: T.ink }); };
    var P = [[300, 40], [150, 140], [450, 140]], L = [[75, 260], [225, 260], [375, 260], [525, 260]];
    out += flecha(300, 58, 150, 122, T.ink) + flecha(300, 58, 450, 122, T.ink) + tx(205, 88, 'sí', { f: F, s: 12, c: T.ink }) + tx(395, 88, 'no', { f: F, s: 12, c: T.ink });
    [[1, 0, 1], [2, 2, 3]].forEach(function (a) { var p = P[a[0]]; out += flecha(p[0], p[1] + 18, L[a[1]][0], L[a[1]][1] - 16, T.ink) + flecha(p[0], p[1] + 18, L[a[2]][0], L[a[2]][1] - 16, T.ink) + tx((p[0] + L[a[1]][0]) / 2 - 10, 205, 'sí', { f: F, s: 12, c: T.ink }) + tx((p[0] + L[a[2]][0]) / 2 + 10, 205, 'no', { f: F, s: 12, c: T.ink }); });
    out += nodo(300, 40, A.p[0], true) + nodo(150, 140, A.p[1]) + nodo(450, 140, A.p[2]);
    L.forEach(function (l, i) { out += hoja(l[0], l[1], A.h[i]); });
    var items = [it('corta', 'Si la respuesta a «' + A.p[0] + '» es sí y a «' + A.p[1] + '» es no, ¿qué decide el árbol?', A.h[1]), it('corta', 'Si la respuesta a «' + A.p[0] + '» es no y a «' + A.p[2] + '» es sí, ¿qué decide?', A.h[2]), it('corta', '¿Cuántas decisiones finales (hojas) tiene el árbol?', 4), it('abierta', 'Añade una pregunta nueva bajo una de las hojas y explica qué cambiaría.', '', { lin: 2 })];
    return { t: 'Árbol de decisión: ' + A.t, intro: 'Un árbol de decisión hace preguntas de sí o no hasta llegar a una respuesta. Muchos modelos de IA aprenden árboles así a partir de datos.', fig: svg(W, Hh, out, 560), items: items };
  }

  /* ─────────── Marketing ─────────── */
  function genRecorrido(u, C, r) {
    var T = C.T, F = T.cuerpo, et = ['Descubre', 'Considera', 'Compra', 'Repite', 'Recomienda'], n = [E(r, 8, 20) * 1000], tasas = [];
    for (var i = 1; i < 5; i++) { var t = [0, E(r, 20, 40), E(r, 3, 9), E(r, 25, 45), E(r, 15, 35)][i]; tasas.push(t); n.push(Math.round(n[i - 1] * t / 100)); }
    var W = 620, Hh = 300, out = '', mx = n[0];
    et.forEach(function (e, i) {
      var h = Math.max(8, 190 * n[i] / mx), x = 30 + i * 118, y = 230 - h;
      out += sombra(C, x, y, 80, h, 3) + rc(x, y, 80, h, { rx: 3, f: clr(i % 2 ? T.acc2 : T.acc, .55), s: i % 2 ? T.acc2 : T.acc }) + tx(x + 40, y - 8, fmt(n[i], C), { f: F, s: 13, w: 700, c: T.ink }) + tx(x + 40, 252, e, { f: F, s: 13, w: 700, c: T.ink });
      if (i) out += tx(x - 19, 285, tasas[i - 1] + ' %', { f: F, s: 12, c: osc(T.acc, .3) }) + flecha(x - 36, 270, x - 4, 270, T.ink);
    });
    var tot = Math.round(n[2] / n[0] * 10000) / 100;
    var items = [it('corta', '¿Cuántas personas compran?', fmt(n[2], C)), it('corta', '¿Qué porcentaje de quienes descubren la marca termina comprando? (dos decimales)', fmt(tot, C) + ' %', { ac: [tot, fmt(tot, C)], x: fmt(n[2], C) + ' ÷ ' + fmt(n[0], C) + ' × 100' }), mc('¿Qué etapa pierde más personas?', ['Descubre → Considera', 'Considera → Compra', 'Repite → Recomienda'], (n[1] - n[2]) > (n[0] - n[1]) ? 'Considera → Compra' : 'Descubre → Considera'), it('abierta', 'Propón una acción concreta para mejorar la etapa «Considera».', '', { lin: 2 })];
    return { t: 'El recorrido del cliente', intro: 'Cada barra es el número de personas que llega a esa etapa en un mes; debajo, el porcentaje que pasa a la siguiente.', fig: svg(W, Hh, out, 580), items: items };
  }
  function genPosicion(u, C, r) {
    var T = C.T, F = T.cuerpo, M = H.mezcla(r, [['Marca A', 'económica y básica', -.7, -.5], ['Marca B', 'cara y exclusiva', .75, .7], ['Marca C', 'buena relación calidad-precio', -.4, .55], ['Marca D', 'cara sin destacar', .6, -.4], ['Tu marca', '', 0, 0]]).slice(0, 5);
    M.forEach(function (m) { if (m[0] === 'Tu marca') { m[2] = -.2 + r() * .3; m[3] = .3 + r() * .4; } });
    var W = 460, Hh = 400, cx = 230, cy = 200, s = 160, out = '';
    out += rc(cx - s, cy - s, 2 * s, 2 * s, { f: clr(T.acc, .92), s: T.soft }) + flecha(cx - s, cy, cx + s + 8, cy, T.ink) + flecha(cx, cy + s, cx, cy - s - 8, T.ink);
    out += tx(cx + s, cy + 20, 'precio alto', { f: F, s: 12, a: 'end', c: T.ink }) + tx(cx - s, cy + 20, 'precio bajo', { f: F, s: 12, a: 'start', c: T.ink }) + tx(cx + 8, cy - s + 4, 'calidad alta', { f: F, s: 12, a: 'start', c: T.ink }) + tx(cx + 8, cy + s - 4, 'calidad baja', { f: F, s: 12, a: 'start', c: T.ink });
    M.forEach(function (m) { var x = cx + m[2] * s, y = cy - m[3] * s, tu = m[0] === 'Tu marca'; out += '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + (tu ? 11 : 9) + '" fill="' + (tu ? T.acc2 : T.acc) + '" stroke="#fff" stroke-width="2"/>' + tx(x, y - 15, m[0], { f: F, s: 12, w: 700, c: T.ink }); });
    var otras = M.filter(function (m) { return m[0] !== 'Tu marca'; });
    var items = otras.slice(0, 2).map(function (m) { return mc('¿Cómo se percibe la ' + m[0] + '?', H.mezcla(r, ['económica y básica', 'cara y exclusiva', 'buena relación calidad-precio', 'cara sin destacar']).slice(0, 3).concat([m[1]]).filter(function (v, i, a) { return a.indexOf(v) === i; }).slice(-3), m[1]); });
    items.push(it('abierta', '¿Qué hueco del mapa no ocupa nadie? ¿Sería una oportunidad?', '', { lin: 2 }), it('abierta', 'Escribe en una frase la propuesta de valor de «Tu marca».', '', { lin: 2 }));
    return { t: 'Mapa de posicionamiento', intro: 'Cada punto es cómo perciben los clientes una marca según precio y calidad. Sirve para encontrar huecos en el mercado.', fig: svg(W, Hh, out, 420), items: items };
  }

  function partir(s, n) { var ws = s.split(' '), out = [], l = ''; ws.forEach(function (w) { if ((l + ' ' + w).trim().length > n && l) { out.push(l); l = w; } else l = (l + ' ' + w).trim(); }); if (l) out.push(l); return out; }
  /* ─────────── Emprendimiento ─────────── */
  function genLienzo(u, C, r) {
    var T = C.T, F = T.cuerpo, B = [['Socios clave', 0, 0, 1, 2], ['Actividades clave', 1, 0, 1, 1], ['Recursos clave', 1, 1, 1, 1], ['Propuesta de valor', 2, 0, 1, 2], ['Relación con clientes', 3, 0, 1, 1], ['Canales', 3, 1, 1, 1], ['Segmentos de clientes', 4, 0, 1, 2], ['Estructura de costos', 0, 2, 2.5, 1], ['Fuentes de ingresos', 2.5, 2, 2.5, 1]];
    var W = 640, Hh = 360, cw = 124, ch = 110, out = '', oculto = H.mezcla(r, [0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 3);
    B.forEach(function (b, i) { var x = 10 + b[1] * cw, y = 10 + b[2] * ch, w = b[3] * cw - 6, h = b[4] * ch - 6; out += rc(x, y, w, h, { rx: 3, f: i === 3 ? clr(T.acc2, .85) : clr(T.acc, .9), s: i === 3 ? T.acc2 : T.acc }) + (oculto.indexOf(i) >= 0 ? tx(x + 8, y + 20, String.fromCharCode(65 + oculto.indexOf(i)) + ' · ?', { f: F, s: 13, w: 700, a: 'start', c: T.acc2 }) : partir(b[0], w > 200 ? 40 : 14).map(function (l, j) { return tx(x + 8, y + 20 + j * 15, l, { f: F, s: 12, w: 700, a: 'start', c: T.ink }); }).join('')); });
    var ej = { 'Socios clave': 'un proveedor de materia prima', 'Actividades clave': 'producir y entregar cada pedido', 'Recursos clave': 'el horno y la marca', 'Propuesta de valor': 'pan artesanal a domicilio antes de las 8', 'Relación con clientes': 'suscripción semanal y trato personal', 'Canales': 'WhatsApp y una tienda en línea', 'Segmentos de clientes': 'familias del barrio que trabajan temprano', 'Estructura de costos': 'harina, energía, reparto', 'Fuentes de ingresos': 'venta por pedido y suscripción' };
    var items = oculto.map(function (i, k) { return it('corta', '¿Qué bloque es el ' + String.fromCharCode(65 + k) + '?', B[i][0]); });
    items.push(it('corta', 'En una panadería a domicilio, ¿en qué bloque pondrías «' + ej[B[oculto[0]][0]] + '»?', B[oculto[0]][0]), it('abierta', 'Rellena la propuesta de valor de tu propio proyecto en una frase.', '', { lin: 2 }));
    return { t: 'Lienzo del modelo de negocio', intro: 'Nueve bloques resumen cómo un negocio crea, entrega y cobra valor. A la izquierda, lo que haces; a la derecha, a quién sirves; abajo, el dinero.', fig: svg(W, Hh, out, 600), items: items };
  }
  function genEmpatia(u, C, r) {
    var T = C.T, F = T.cuerpo, Q = [['Piensa y siente', 'Le preocupa no llegar a fin de mes'], ['Ve', 'Ofertas en redes todo el día'], ['Oye', 'Sus amigos recomiendan marcas'], ['Dice y hace', 'Compara precios antes de comprar']];
    var W = 520, Hh = 360, cx = 260, cy = 180, out = '';
    out += rc(20, 20, 480, 320, { rx: 4, s: T.soft }) + ln(260, 20, 260, 340, T.soft, 1.5) + ln(20, 180, 500, 180, T.soft, 1.5);
    Q.forEach(function (q, i) { var x = i % 2 ? 390 : 130, y = i < 2 ? 55 : 225; out += tx(x, y, q[0], { f: F, s: 15, w: 700, c: T.acc }) + rc(x - 105, y + 14, 210, 46, { rx: 3, f: clr(T.acc2, .88), s: T.acc2, d: '4 3' }); });
    out += '<circle cx="' + cx + '" cy="' + cy + '" r="42" fill="' + clr(T.acc, .7) + '" stroke="' + T.acc + '" stroke-width="2.5"/><circle cx="' + cx + '" cy="' + (cy - 10) + '" r="12" fill="' + T.acc + '"/><path d="M' + (cx - 20) + ' ' + (cy + 24) + ' Q' + cx + ' ' + (cy - 2) + ' ' + (cx + 20) + ' ' + (cy + 24) + '" fill="' + T.acc + '"/>';
    var items = Q.map(function (q) { return it('abierta', 'Escribe en «' + q[0] + '» algo real de tu cliente ideal (ejemplo: ' + q[1].toLowerCase() + ').', '', { lin: 1 }); });
    items.push(it('abierta', '¿Qué problema de tu cliente resolvería tu producto?', '', { lin: 2 }));
    return { t: 'Mapa de empatía del cliente', intro: 'Antes de vender hay que entender a quién. Rellena cada cuadrante pensando en una persona concreta, no en «todo el mundo».', fig: svg(W, Hh, out, 480), items: items };
  }

  /* ─────────── Música ─────────── */
  var NOTAS = ['do', 're', 'mi', 'fa', 'sol', 'la', 'si'];
  function genTeclado(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 600, Hh = 250, kw = 52, x0 = 18, out = '', ocultas = H.mezcla(r, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3);
    for (var i = 0; i < 11; i++) { var x = x0 + i * kw; out += rc(x, 30, kw, 190, { rx: 3, f: '#fff', s: T.ink, sw: 1.5 }) + tx(x + kw / 2, 205, ocultas.indexOf(i) >= 0 ? String.fromCharCode(65 + ocultas.indexOf(i)) : NOTAS[i % 7], { f: F, s: 14, w: 700, c: ocultas.indexOf(i) >= 0 ? T.acc2 : T.ink }); }
    [0, 1, 3, 4, 5, 7, 8].forEach(function (i) { var x = x0 + (i + 1) * kw - 16; out += (es3d(C) ? rc(x + 2, 32, 32, 118, { rx: 2, f: '#000' }).replace('/>', ' opacity=".2"/>') : '') + rc(x, 30, 32, 115, { rx: 2, f: T.ink, s: T.ink }); });
    var items = ocultas.map(function (k, j) { return it('corta', '¿Qué nota es la tecla ' + String.fromCharCode(65 + j) + '?', NOTAS[k % 7]); });
    items.push(it('corta', '¿Cuántos semitonos hay entre do y sol (contando teclas blancas y negras)?', 7), mc('Entre mi y fa no hay tecla negra. Su distancia es…', ['un semitono', 'un tono', 'dos tonos'], 'un semitono'));
    return { t: 'El teclado del piano', intro: 'Las teclas blancas son las siete notas; las negras, sostenidos y bemoles. Dos teclas vecinas están a un semitono.', fig: svg(W, Hh, out, 560), items: items };
  }
  function genPenta(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 600, Hh = 200, y5 = 150, g = 14, out = '', sel = [];
    for (var i = 0; i < 5; i++) out += ln(40, y5 - i * g, 570, y5 - i * g, T.ink, 1.4);
    out += '<text x="44" y="' + (y5 + 6) + '" font-size="78" font-family="serif" fill="' + T.ink + '">𝄞</text>';
    var pasos = { do: -2, re: -1, mi: 0, fa: 1, sol: 2, la: 3, si: 4 }, lista = ['mi', 'fa', 'sol', 'la', 'si', 'do', 're'];
    for (var k = 0; k < 7; k++) sel.push(H.pick(r, lista));
    sel.forEach(function (n, j) { var x = 130 + j * 62, st = pasos[n], y = y5 - st * g / 2; if (st <= -2) out += ln(x - 16, y5 + g, x + 16, y5 + g, T.ink, 1.4); out += '<ellipse cx="' + x + '" cy="' + y + '" rx="9" ry="6.5" transform="rotate(-20 ' + x + ' ' + y + ')" fill="' + T.ink + '"/>' + ln(x + 8, y, x + 8, y - 42, T.ink, 1.6) + tx(x, 190, String(j + 1), { f: F, s: 12, c: T.acc }); });
    var items = sel.slice(0, 5).map(function (n, j) { return it('corta', '¿Qué nota es la número ' + (j + 1) + '?', n); });
    items.push(mc('¿En qué línea está el sol en clave de sol?', ['segunda', 'primera', 'cuarta'], 'segunda'));
    return { t: 'Leer notas en clave de sol', intro: 'Las líneas se cuentan de abajo arriba. El do grave necesita una línea adicional por debajo del pentagrama.', fig: svg(W, Hh, out, 560), items: items };
  }

  /* ─────────── Peluquería ─────────── */
  function genCabello(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 560, Hh = 300, out = '', cx = 170, cy = 150;
    [[120, clr(T.acc2, .6), 'cutícula'], [100, clr(T.acc, .6), 'córtex'], [34, osc(T.acc, .2), 'médula']].forEach(function (c) { if (es3d(C)) out += '<circle cx="' + (cx + 3) + '" cy="' + (cy + 5) + '" r="' + c[0] + '" fill="#000" opacity=".08"/>'; out += '<circle cx="' + cx + '" cy="' + cy + '" r="' + c[0] + '" fill="' + c[1] + '" stroke="' + T.ink + '" stroke-width="1.2"/>'; });
    for (var a = 0; a < 18; a++) { var t = a / 18 * Math.PI * 2; out += '<path d="M' + r1(cx + 102 * Math.cos(t)) + ' ' + r1(cy + 102 * Math.sin(t)) + ' L' + r1(cx + 120 * Math.cos(t + .15)) + ' ' + r1(cy + 120 * Math.sin(t + .15)) + '" stroke="' + T.ink + '" stroke-width="1"/>'; }
    var et = [['1', 120, 'capa externa de escamas'], ['2', 70, 'fibras de queratina y pigmento'], ['3', 0, 'centro, no siempre presente']];
    et.forEach(function (e, i) { var y = 70 + i * 80; out += ln(cx + (i === 2 ? 0 : e[1] - 8), cy + (i - 1) * 30, 340, y, T.ink, 1) + '<circle cx="352" cy="' + y + '" r="12" fill="' + T.acc + '"/>' + tx(352, y + 5, e[0], { f: F, s: 13, w: 700, c: '#fff' }) + tx(372, y + 5, e[2], { f: F, s: 12, a: 'start', c: T.ink }); });
    var items = [it('corta', '¿Cómo se llama la capa 1?', 'cutícula'), it('corta', '¿Qué capa guarda la melanina que da el color?', 'córtex'), it('corta', '¿Cómo se llama el centro del pelo (3)?', 'médula'), mc('Un producto alcalino hace que la cutícula…', ['se abra', 'se cierre', 'no cambie'], 'se abra', { x: 'Por eso los tintes permanentes pueden llegar al córtex.' })];
    return { t: 'El pelo por dentro', intro: 'Corte transversal de un cabello. El tinte permanente tiene que atravesar la cutícula para depositar color en el córtex.', fig: svg(W, Hh, out, 520), items: items };
  }
  function genPhPelu(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 600, Hh = 220, x0 = 30, s = 38, out = '';
    for (var i = 0; i <= 14; i++) { var c = i < 7 ? 'hsl(' + (i * 8) + ',70%,' + (55 + i * 2) + '%)' : i === 7 ? 'hsl(120,45%,60%)' : 'hsl(' + (190 + (i - 7) * 12) + ',55%,' + (62 - (i - 7) * 3) + '%)'; out += rc(x0 + i * s, 90, s, 36, { f: c, s: '#fff', sw: 1 }) + tx(x0 + i * s + s / 2, 113, String(i), { f: F, s: 13, w: 700, c: '#fff' }); }
    var P = [['cabello y piel', 5], ['champú neutro', 6.5], ['oxidante', 3.5], ['tinte permanente', 10], ['acondicionador', 4]];
    var marcas = H.mezcla(r, P).slice(0, 4).sort(function (a, b) { return a[1] - b[1]; });
    marcas.forEach(function (m, i) { var x = x0 + m[1] * s + s / 2, arriba = i % 2 === 0, y = arriba ? 60 : 160; out += ln(x, arriba ? 70 : 132, x, arriba ? 88 : 150, T.ink, 1.5) + tx(x, y, m[0] + ' (≈' + fmt(m[1], C) + ')', { f: F, s: 12, w: 700, c: T.ink }); });
    out += tx(x0, 200, 'ácido', { f: F, s: 12, a: 'start', c: T.ink }) + tx(x0 + 7.5 * s, 200, 'neutro', { f: F, s: 12, c: T.ink }) + tx(x0 + 15 * s, 200, 'alcalino', { f: F, s: 12, a: 'end', c: T.ink });
    var items = [mc('El tinte permanente es…', ['alcalino', 'ácido', 'neutro'], 'alcalino'), it('corta', 'El pH del cabello está hacia 4,5–5,5. ¿Es ácido o alcalino?', 'ácido'), it('abierta', '¿Por qué conviene usar un acondicionador ácido después de teñir?', 'Para cerrar la cutícula y devolver el pH del cabello.', { lin: 2 })];
    return { t: 'El pH en peluquería', intro: 'Valores aproximados. Los productos alcalinos abren la cutícula; los ácidos la cierran y dejan el cabello brillante.', fig: svg(W, Hh, out, 580), items: items };
  }

  /* ─────────── Religión y Lengua ─────────── */
  function genPlanta(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 460, Hh = 470, out = '<g transform="translate(0 50)">', f = clr(T.acc, .82);
    out += (es3d(C) ? '<path d="M184 34 h96 v110 h120 v70 h-120 v186 h-96 v-186 h-120 v-70 h120z" fill="#000" opacity=".12"/>' : '') + '<path d="M180 30 h100 v110 h120 v70 h-120 v186 h-100 v-186 h-120 v-70 h120z" fill="' + f + '" stroke="' + T.ink + '" stroke-width="2"/>';
    out += '<path d="M180 30 a50 50 0 0 1 100 0" fill="' + clr(T.acc2, .7) + '" stroke="' + T.ink + '" stroke-width="2"/>' + rc(214, 60, 32, 20, { f: T.acc2 });
    var E_ = [['1', 230, 8, 'ábside'], ['2', 230, 70, 'altar'], ['3', 230, 175, 'crucero'], ['4', 90, 175, 'brazo del crucero'], ['5', 230, 300, 'nave central'], ['6', 230, 395, 'entrada (pórtico)']];
    var oc = H.mezcla(r, [0, 2, 3, 4, 5]).slice(0, 3);
    E_[0][2] = -2; E_[1][2] = 100;
    E_.forEach(function (e, i) { out += '<circle cx="' + e[1] + '" cy="' + e[2] + '" r="13" fill="' + T.acc + '" stroke="#fff" stroke-width="2"/>' + tx(e[1], e[2] + 5, e[0], { f: F, s: 13, w: 700, c: '#fff' }); });
    out += '</g>';
    var items = oc.map(function (i) { return it('corta', '¿Qué parte de la iglesia señala el número ' + E_[i][0] + '?', E_[i][3]); });
    items.push(mc('Esta planta tiene forma de…', ['cruz latina', 'círculo', 'cuadrado'], 'cruz latina'), it('abierta', 'Busca un templo de tu ciudad y di si su planta es parecida.', '', { lin: 2 }));
    return { t: 'Planta de una iglesia', intro: 'Muchas iglesias de España y América tienen planta de cruz latina: una nave larga cruzada por el crucero, con el ábside al fondo.', fig: svg(W, Hh, out, 380), items: items };
  }
  function genComunica(u, C, r) {
    var T = C.T, F = T.cuerpo, W = 620, Hh = 280, out = '', S = H.pick(r, [['Ana', 'su abuela', 'Llego a las ocho', 'mensaje de voz', 'español', 'un viernes de lluvia'], ['El profesor', 'la clase', 'Mañana hay examen', 'la pizarra', 'español escrito', 'última hora del lunes'], ['Una marca', 'sus clientes', 'Rebajas del 20 %', 'una red social', 'imagen y texto', 'campaña de verano']]);
    var box = function (x, y, t, s) { return sombra(C, x, y, 150, 56, 6) + rc(x, y, 150, 56, { rx: 6, f: clr(T.acc, .85), s: T.acc, sw: 2 }) + tx(x + 75, y + 22, t, { f: F, s: 13, w: 700, c: T.ink }) + tx(x + 75, y + 42, s, { f: F, s: 11, c: T.ink }); };
    out += box(20, 110, 'Emisor', S[0]) + box(235, 110, 'Mensaje', '«' + S[2] + '»') + box(450, 110, 'Receptor', S[1]) + flecha(170, 138, 233, 138, T.ink) + flecha(385, 138, 448, 138, T.ink);
    out += box(235, 20, 'Canal', S[3]) + box(235, 205, 'Código', S[4]) + rc(8, 8, 604, 264, { rx: 10, s: T.acc2, d: '6 4' }) + tx(596, 262, 'Contexto: ' + S[5], { f: F, s: 11, a: 'end', c: T.acc2 });
    var items = [it('corta', '¿Quién es el emisor?', S[0]), it('corta', '¿Cuál es el canal?', S[3]), mc('Si hay mucho ruido y no se oye el mensaje, falla…', ['el canal', 'el código', 'el emisor'], 'el canal'), it('abierta', 'Analiza con este esquema el último mensaje que enviaste.', '', { lin: 2 })];
    return { t: 'Los elementos de la comunicación', intro: 'Para que un mensaje llegue hacen falta seis elementos. El contexto rodea a todos.', fig: svg(W, Hh, out, 580), items: items };
  }

  /* ─────────── Inglés / Idiomas: la hora ─────────── */
  var NUM_EN = ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  function horaEn(h, m) { var hh = h % 12; if (m === 0) return NUM_EN[hh] + " o'clock"; if (m === 15) return 'quarter past ' + NUM_EN[hh]; if (m === 30) return 'half past ' + NUM_EN[hh]; if (m === 45) return 'quarter to ' + NUM_EN[(hh + 1) % 12]; return m < 30 ? m + ' past ' + NUM_EN[hh] : (60 - m) + ' to ' + NUM_EN[(hh + 1) % 12]; }
  function genHora(u, C, r) {
    if (!SV.reloj) return null;
    var T = C.T, F = T.cuerpo, hs = [], out = '';
    for (var i = 0; i < 3; i++) hs.push([E(r, 1, 12), H.pick(r, [0, 15, 30, 45, 10, 20, 40, 50])]);
    hs.forEach(function (h, i) { out += '<g transform="translate(' + (i * 190 + 15) + ' 10)">' + String(SV.reloj(C, h[0], h[1])).replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '') + '</g>' + tx(i * 190 + 95, 190, String.fromCharCode(65 + i), { f: F, s: 15, w: 700, c: T.acc }); });
    var items = hs.map(function (h, i) { return it('corta', 'Clock ' + String.fromCharCode(65 + i) + ': What time is it? (write it in words)', "It's " + horaEn(h[0], h[1])); });
    items.push(mc('«Half past seven» is…', ['7:30', '6:30', '7:15'], '7:30'), it('abierta', 'Write your timetable for tomorrow with three times in English.', '', { lin: 2 }));
    return { t: 'Telling the time', intro: 'In English we say «past» until half past and «to» after it: 7:45 is «quarter to eight».', fig: svg(590, 200, out, 560), items: items };
  }

  /* ─────────── Infantil: contar ─────────── */
  function genContar(u, C, r) {
    var B = window.EU_BOTANICA; if (!B || !B.dibujo) return null;
    var T = C.T, F = T.cuerpo, ids = Object.keys(B.D).filter(function (id) { return /^(manzana|pera|naranja|limon|fresa|platano|uva|cereza|sandia|pina|mango|tomate|zanahoria|flor|hoja|seta|kiwi|melocoton|fresas)/.test(id); }), sel = H.mezcla(r, ids.slice()).slice(0, 3), n = sel.map(function () { return E(r, 2, 6); }), out = '';
    sel.forEach(function (id, fila) { for (var k = 0; k < n[fila]; k++) { var g = B.dibujo(id, { T: T, d3: es3d(C), w: 54, g: true }); out += '<g transform="translate(' + (20 + k * 70) + ' ' + (15 + fila * 88) + ') scale(.54)">' + g + '</g>'; } out += rc(460, 25 + fila * 88, 56, 56, { rx: 8, f: '#fff', s: T.acc, sw: 2, d: '5 4' }); });
    var nom = function (id) { return (B.D[id] && B.D[id][0]) || id; };
    var items = sel.map(function (id, i) { return it('corta', '¿Cuántos hay en la fila ' + (i + 1) + '? Escribe el número en el cuadrado.', n[i]); });
    items.push(it('corta', '¿Cuántos hay en total?', n[0] + n[1] + n[2]), mc('¿Qué fila tiene más?', ['1', '2', '3'], String(n.indexOf(Math.max.apply(null, n)) + 1)));
    return { t: 'Cuenta y escribe', intro: 'Cuenta los dibujos de cada fila con el dedo, de izquierda a derecha, y escribe el número.', fig: svg(540, 280, out, 520), items: items };
  }

  /* ─────────── Recetarios ─────────── */
  function genCortes(u, C, r) {
    var T = C.T, F = T.cuerpo, mm = 3, W = 620, Hh = 300, out = '';
    var K = [['Brunoise', 3, 3, 'dados de 3 mm'], ['Macedonia', 5, 5, 'dados de 5 mm'], ['Dados', 10, 10, 'dados de 1 cm'], ['Juliana', 3, 50, 'tiras de 3 mm × 5 cm'], ['Bastones', 10, 60, 'bastones de 1 × 6 cm']];
    K.forEach(function (k, i) { var x = 30 + i * 118, w = k[1] * mm, h = k[2] * mm, y = 220 - h; for (var j = 0; j < (k[2] > 20 ? 3 : 4); j++) { var dx = x + (k[2] > 20 ? j * (w + 5) : (j % 2) * (w + 4)), dy = k[2] > 20 ? y : y - Math.floor(j / 2) * (h + 4); out += (es3d(C) ? rc(dx + 2, dy + 2, w, h, { f: '#000' }).replace('/>', ' opacity=".15"/>') : '') + rc(dx, dy, w, h, { rx: 1, f: clr(T.acc2, .6), s: osc(T.acc2, .2), sw: 1 }); } out += tx(x + 40, 245, k[0], { f: F, s: 13, w: 700, c: T.ink }) + tx(x + 40, 263, k[3], { f: F, s: 10.5, c: T.ink }); });
    out += ln(30, 285, 30 + 10 * mm, 285, T.ink, 2) + tx(34 + 10 * mm, 289, '1 cm (escala real aproximada)', { f: F, s: 11, a: 'start', c: T.ink });
    var items = [it('corta', '¿Qué corte da dados de 3 mm?', 'brunoise'), it('corta', '¿Cuántos dados de 1 cm salen de un bastón de 1 × 6 cm?', 6), mc('Para un sofrito que se deshaga en la salsa conviene…', ['brunoise', 'bastones', 'dados de 1 cm'], 'brunoise'), it('abierta', '¿Por qué los trozos iguales se cocinan mejor?', 'Porque se hacen todos a la vez.', { lin: 2 })];
    return { t: 'Cortes de cuchillo', intro: 'Tamaños de los cortes clásicos, dibujados a escala. Un corte regular hace que todo se cocine al mismo tiempo.', fig: svg(W, Hh, out, 580), items: items };
  }
  function genLevado(u, C, r) {
    var T = C.T, F = T.cuerpo, temp = H.pick(r, [[24, 90], [27, 70], [20, 130]]), W = 560, Hh = 300, x0 = 60, y0 = 250, sx = 420 / 180, sy = 180 / 120, out = '', pts = [];
    for (var t = 0; t <= 180; t += 10) { var v = 100 + 100 / (1 + Math.exp(-(t - temp[1] * .6) / (temp[1] * .18))); pts.push([x0 + t * sx, y0 - (v - 90) * sy, t, Math.round(v)]); }
    out += ln(x0, y0, x0 + 430, y0, T.ink, 1.5) + ln(x0, y0, x0, 40, T.ink, 1.5);
    for (var g = 0; g <= 180; g += 30) out += tx(x0 + g * sx, y0 + 18, g + ' min', { f: F, s: 11, c: T.ink });
    [100, 150, 200].forEach(function (v) { var y = y0 - (v - 90) * sy; out += ln(x0 - 4, y, x0 + 430, y, T.soft, 1, ' stroke-dasharray="4 4"') + tx(x0 - 8, y + 4, v + ' %', { f: F, s: 11, a: 'end', c: T.ink }); });
    out += '<polyline points="' + pts.map(function (p) { return r1(p[0]) + ',' + r1(p[1]); }).join(' ') + '" fill="none" stroke="' + T.acc + '" stroke-width="3"/>';
    var doble = pts.filter(function (p) { return p[3] >= 190; })[0] || pts[pts.length - 1];
    out += '<circle cx="' + r1(doble[0]) + '" cy="' + r1(doble[1]) + '" r="6" fill="' + T.acc2 + '"/>' + tx(doble[0] + 10, doble[1] - 10, 'casi el doble', { f: F, s: 12, a: 'start', w: 700, c: T.acc2 });
    var items = [it('corta', '¿Cuántos minutos tarda la masa en llegar casi al doble (190 %)?', doble[2] + ' min', { ac: [doble[2]] }), mc('Si la cocina estuviera más fría, la curva sería…', ['más lenta', 'más rápida', 'igual'], 'más lenta'), it('abierta', '¿Por qué no conviene dejar la masa fermentando mucho más allá del doble?', 'Se debilita el gluten, pierde gas y el pan queda plano y ácido.', { lin: 2 })];
    return { t: 'Curva de fermentación a ' + temp[0] + ' °C', intro: 'Volumen de una masa de pan respecto al inicial (100 %). Los datos son un modelo aproximado: cada harina y levadura cambian los tiempos.', fig: svg(W, Hh, out, 540), items: items };
  }

  var V = [
    ['ia_red', genRed, /^(ia|tecno)$/, 2], ['ia_matriz', genMatriz, /^(ia|mate|geoalg)$/, 2], ['ia_arbol', genArbol, /^(ia|tecno|empre)$/, 2],
    ['mkt_recorrido', genRecorrido, /^(mkt|empre|redes|ecom)$/, 2], ['mkt_posicion', genPosicion, /^(mkt|empre|ecom)$/, 2],
    ['emp_lienzo', genLienzo, /^(empre|mkt|ecom)$/, 2], ['emp_empatia', genEmpatia, /^(empre|mkt|redes|valores)$/, 2],
    ['mus_teclado', genTeclado, /^musica$/, 2], ['mus_penta', genPenta, /^musica$/, 3],
    ['pel_cabello', genCabello, /^(pelu|bio|anat)$/, 2], ['pel_ph', genPhPelu, /^(pelu|quimica)$/, 2],
    ['rel_planta', genPlanta, /^(religion|arte|soci)$/, 2], ['len_comunica', genComunica, /^(lengua|ingles|idiomas|mkt)$/, 2],
    ['ing_hora', genHora, /^(ingles|idiomas)$/, 2], ['inf_contar', genContar, /^(infantil)$/, 4],
    ['coc_cortes', genCortes, /^(cocina|reposteria|pasteleria|panaderia)$/, 2], ['coc_levado', genLevado, /^(panaderia|cocina|reposteria|quimica|bio)$/, 2]
  ];
  V.forEach(function (v) { SV.visual(v[0], v[1], { materias: v[2], max: v[3] }); });

  /* alias: figuras existentes para materias que no las recibían */
  [['emp_equilibrio', 'con_equilibrio', /^empre$/], ['emp_flujo', 'con_flujo', /^(empre|ecom)$/], ['mkt_porcentaje', 'mat_porcentaje', /^(mkt|empre|ecom)$/], ['mkt_estadistica', 'mat_estadistica', /^(mkt|ia|redes)$/], ['ia_probabilidad', 'mat_probabilidad', /^ia$/], ['pel_color', 'qui_color', /^pelu$/], ['pel_dilucion', 'qui_dilucion', /^pelu$/]]
    .forEach(function (a) { SV.visual(a[0], function (u, C, r) { return SV.generar(a[1], u, C, r); }, { materias: a[2], max: 2 }); });

  window.EU_DIBUJOS2 = { red: genRed, matriz: genMatriz, arbol: genArbol, recorrido: genRecorrido, posicion: genPosicion, lienzo: genLienzo, empatia: genEmpatia, teclado: genTeclado, penta: genPenta, cabello: genCabello, phPelu: genPhPelu, planta: genPlanta, comunica: genComunica, hora: genHora, contar: genContar, cortes: genCortes, levado: genLevado };
})();
