/* b6_anatomia_transversal.js — Anatomía humana como recurso explicativo para todas las materias
   (window.EU_ANATOMIA). Un solo motor de figura humana, paramétrico:
   · vistas: frente y perfil;
   · capas: silueta, esqueleto, músculos, órganos y aparato digestivo;
   · edades: bebé (4 cabezas), niño (6) y adulto (8), dibujados a escala real de estatura;
   · sección transversal del muslo (piel, grasa, músculo, hueso, médula, vasos y nervio).
   Láminas registradas con EU_SVG.visual y la materia a la que alimentan:
   · sistemas del cuerpo (Anatomía, Biología, Naturales, Educación física, Arte);
   · proporciones por edad (Arte, Matemáticas, Anatomía, Biología, Educación física);
   · el brazo como palanca (Física, Tecnología, Anatomía, Educación física);
   · frecuencia cardíaca y zonas de esfuerzo (Educación física, Anatomía, Biología, Matemáticas);
   · de qué está hecho el cuerpo (Química, Biología, Anatomía);
   · el viaje de la comida (Cocina, batidos, repostería, Biología, Naturales);
   · postura y curvas de la columna con línea de gravedad (Educación física, Física, Anatomía, Arte);
   · sección transversal (Anatomía, Biología, Naturales).
   Respeta el interruptor 2D / 3D. Cargar después de b6_geometria.js. */
(function () {
  var ED = window.EU_EDITORIAL, SV = window.EU_SVG;
  if (!ED || !SV || !SV.visual || window.EU_ANATOMIA) return;
  var H = ED.H, esc = H.esc, it = H.it, E = H.ent, osc = SV.osc, clr = SV.clr, NS = 'xmlns="http://www.w3.org/2000/svg"';
  var HUESO = '#F4EEE0', MUSCULO = '#DE8A7C', MUS_B = '#A2463B', ARTERIA = '#C8352E', VENA = '#2F5FA8', NERVIO = '#E0B422';
  function r1(n) { return Math.round(n * 10) / 10; }
  function fmt(n) { return String(Math.round(n * 100) / 100).replace('.', ','); }
  function es3d(C) { return C.prem ? C.prem.dibujo === '3d' : (((C.cfg && C.cfg.acab) || {}).dibujo || '3d') === '3d'; }
  function esPeq(C) { return /^(inf|pri1|pri2)$/.test(C.bnd || ''); }
  function svg(w, h, body, maxw) { return '<svg ' + NS + ' data-plano="1" viewBox="0 0 ' + r1(w) + ' ' + r1(h) + '" style="width:100%;max-width:' + (maxw || w) + 'px;height:auto;display:block;margin:0 auto">' + body + '</svg>'; }
  function tx(x, y, s, o) { o = o || {}; return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || 'middle') + '" font-size="' + (o.s || 13) + '" font-family="' + esc(o.f || 'sans-serif') + '" font-weight="' + (o.w || 400) + '" fill="' + (o.c || '#222') + '"' + (o.st ? ' stroke="#fff" stroke-width="3" paint-order="stroke"' : '') + '>' + esc(s) + '</text>'; }
  function ln(a, b, at) { return '<line x1="' + r1(a[0]) + '" y1="' + r1(a[1]) + '" x2="' + r1(b[0]) + '" y2="' + r1(b[1]) + '" ' + at + '/>'; }
  function num(v, ext) { return { ac: [v, fmt(v), String(v)].concat(ext || []) }; }
  function mc(e, ops, bien) { return it('mc', e, 'abc'.charAt(ops.indexOf(bien)) + ') ' + bien, { o: ops, c: ops.indexOf(bien) }); }
  function porque(C, s) { return H.guia(C, s, false); }
  /* Curva suave (Catmull-Rom → Bézier) por una lista de puntos en píxeles. */
  function curva(p, cerrar) {
    var n = p.length, d = 'M' + r1(p[0][0]) + ',' + r1(p[0][1]), seg = cerrar ? n : n - 1;
    var g = function (i) { return cerrar ? p[(i + n) % n] : p[Math.max(0, Math.min(n - 1, i))]; };
    for (var i = 0; i < seg; i++) {
      var p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
      d += ' C' + r1(p1[0] + (p2[0] - p0[0]) / 6) + ',' + r1(p1[1] + (p2[1] - p0[1]) / 6) + ' ' + r1(p2[0] - (p3[0] - p1[0]) / 6) + ',' + r1(p2[1] - (p3[1] - p1[1]) / 6) + ' ' + r1(p2[0]) + ',' + r1(p2[1]);
    }
    return d + (cerrar ? ' Z' : '');
  }

  /* ─────────── proporciones: bebé (4 cabezas) → adulto (8) ─────────── */
  var NIV = { yHom: [1.2, 1.45], yPec: [1.55, 2.1], yCin: [2.0, 2.95], yCad: [2.3, 3.55], yIng: [2.55, 4.0], yCod: [1.95, 2.95], yMun: [2.5, 3.9], yMan: [2.85, 4.6], yRod: [3.25, 6.0], yTob: [3.85, 7.75], yPie: [4, 8] };
  var ANCH = { wHom: [.78, 1.02], wCin: [.66, .58], wCad: [.72, .74], wMus: [.34, .36], wRod: [.24, .21], wGem: [.26, .24], wTob: [.17, .12], wBra: [.2, .2], wCue: [.2, .17], wCab: [.44, .36] };
  function prop(n) {
    var t = Math.max(0, Math.min(1, (n - 4) / 4)), K = { n: n }, k;
    for (k in NIV) K[k] = NIV[k][0] + (NIV[k][1] - NIV[k][0]) * t;
    for (k in ANCH) K[k] = ANCH[k][0] + (ANCH[k][1] - ANCH[k][0]) * t;
    K.lc = K.wCad * .5; K.mt = (K.yIng + K.yRod) / 2; K.cf = K.yRod + (K.yTob - K.yRod) * .33;
    return K;
  }

  /* ─────────── figura de frente ─────────── */
  var PARTES = {
    esqueleto: [['craneo', 'el cráneo', 'protege el encéfalo'], ['clavicula', 'la clavícula', 'une el brazo con el tronco'], ['costillas', 'las costillas', 'protegen el corazón y los pulmones'], ['columna', 'la columna vertebral', 'sostiene el cuerpo y protege la médula espinal'], ['pelvis', 'la pelvis', 'sostiene los órganos del abdomen'], ['humero', 'el húmero', 'es el hueso del brazo'], ['radio', 'el radio y el cúbito', 'permiten girar la muñeca'], ['femur', 'el fémur', 'es el hueso más largo del cuerpo'], ['rotula', 'la rótula', 'protege la articulación de la rodilla'], ['tibia', 'la tibia y el peroné', 'soportan el peso al caminar']],
    musculos: [['deltoides', 'el deltoides', 'levanta el brazo hacia el lado'], ['pectoral', 'el pectoral', 'acerca el brazo al pecho'], ['biceps', 'el bíceps', 'dobla el codo'], ['abdominales', 'los abdominales', 'sostienen el tronco y protegen el abdomen'], ['cuadriceps', 'el cuádriceps', 'estira la rodilla'], ['tibial', 'el tibial anterior', 'levanta la punta del pie']],
    organos: [['cerebro', 'el encéfalo', 'dirige y coordina el cuerpo'], ['pulmones', 'los pulmones', 'toman oxígeno y expulsan dióxido de carbono'], ['corazon', 'el corazón', 'bombea la sangre'], ['higado', 'el hígado', 'fabrica bilis y guarda energía'], ['estomago', 'el estómago', 'digiere la comida con jugos ácidos'], ['intestinos', 'los intestinos', 'absorben los nutrientes y el agua'], ['vejiga', 'la vejiga', 'guarda la orina']],
    digestivo: [['boca', 'la boca', 'tritura la comida y la mezcla con saliva'], ['esofago', 'el esófago', 'lleva la comida al estómago'], ['estomago', 'el estómago', 'digiere la comida con jugos ácidos'], ['higado', 'el hígado', 'fabrica la bilis que digiere las grasas'], ['pancreas', 'el páncreas', 'produce jugos digestivos'], ['delgado', 'el intestino delgado', 'absorbe los nutrientes'], ['grueso', 'el intestino grueso', 'absorbe el agua y forma las heces']]
  };
  function figFrente(C, o) {
    var T = C.T, K = prop(o.n || 8), hu = o.alto / K.n, cx = o.cx, y0 = o.y0 || 12, d3 = es3d(C), capa = o.capa || 'silueta', s = '', P = {};
    var X = function (v) { return cx + v * hu; }, Y = function (v) { return y0 + v * hu; }, Q = function (p) { return [X(p[0]), Y(p[1])]; };
    var ink = T.ink, piel = o.fill || clr(T.acc, .82);
    var R = [[K.wCue, .9], [K.wCue + .03, K.yHom - .12], [K.wHom * .78, K.yHom - .04], [K.wHom, K.yHom + .14], [K.wHom * .84, K.yPec + .1], [K.wCin, K.yCin], [K.wCad, K.yCad],
      [K.lc + K.wMus, K.mt], [K.lc + K.wRod, K.yRod], [K.lc + K.wGem, K.cf], [K.lc + K.wTob, K.yTob], [K.lc + K.wTob + .08, K.yPie - .03], [K.lc - K.wTob - .02, K.yPie - .02], [K.lc - K.wTob, K.yTob], [K.lc - K.wGem * .8, K.cf], [K.lc - K.wRod, K.yRod], [K.lc - K.wMus * .9, K.mt], [0, K.yIng]];
    var L = R.map(function (p) { return [-p[0], p[1]]; }).reverse().slice(1), cont = curva(R.concat(L).map(Q), true);
    var brazo = function (sg) { return curva([[K.wHom - .02, K.yHom + .02], [K.wHom + .06, K.yHom + .2], [K.wHom + .02 + K.wBra / 2 + .01, K.yCod], [K.wHom + .06 + K.wBra * .4, K.yMun], [K.wHom + .06 - K.wBra * .4, K.yMun], [K.wHom + .02 - K.wBra / 2, K.yCod], [K.wHom - .14, K.yPec + .05]].map(function (p) { return Q([sg * p[0], p[1]]); }), true); };
    var mano = function (sg) { return '<ellipse cx="' + r1(X(sg * (K.wHom + .07))) + '" cy="' + r1(Y((K.yMun + K.yMan) / 2)) + '" rx="' + r1(.09 * hu) + '" ry="' + r1((K.yMan - K.yMun) / 2 * hu) + '"'; };
    var cab = '<ellipse cx="' + r1(cx) + '" cy="' + r1(Y(.5)) + '" rx="' + r1(K.wCab * hu) + '" ry="' + r1(.5 * hu) + '"';
    var todo = [brazo(1), brazo(-1)].map(function (d) { return '<path d="' + d + '"'; }).concat(['<path d="' + cont + '"', mano(1), mano(-1), cab]);
    if (d3) s += '<ellipse cx="' + r1(cx) + '" cy="' + r1(Y(K.yPie) + 2) + '" rx="' + r1((K.lc + .4) * hu) + '" ry="' + r1(.1 * hu) + '" fill="#000" opacity=".14"/>' + '<g transform="translate(4 5)" opacity=".13">' + todo.map(function (e) { return e + ' fill="#000"/>'; }).join('') + '</g>';
    s += todo.map(function (e) { return e + ' fill="' + piel + '" stroke="' + ink + '" stroke-width="1.6"/>'; }).join('');
    var hueso = function (a, b, w) { a = Q(a); b = Q(b); return ln(a, b, 'stroke="' + ink + '" stroke-width="' + r1(w * hu + 2.4) + '" stroke-linecap="round"') + ln(a, b, 'stroke="' + HUESO + '" stroke-width="' + r1(w * hu) + '" stroke-linecap="round"'); };
    var forma = function (pts, fill, st) { return '<path d="' + curva(pts.map(Q), true) + '" fill="' + fill + '" stroke="' + (st || ink) + '" stroke-width="1.2"/>'; };
    var elip = function (c, rx, ry, fill, rot) { var q = Q(c); return '<ellipse cx="' + r1(q[0]) + '" cy="' + r1(q[1]) + '" rx="' + r1(rx * hu) + '" ry="' + r1(ry * hu) + '" fill="' + fill + '" stroke="' + ink + '" stroke-width="1.1"' + (rot ? ' transform="rotate(' + rot + ' ' + r1(q[0]) + ' ' + r1(q[1]) + ')"' : '') + '/>'; };
    var dos = function (fn) { return fn(1) + fn(-1); };
    if (capa === 'esqueleto') {
      s += elip([0, .42], K.wCab * .9, .4, HUESO) + '<path d="M' + r1(X(-K.wCab * .62)) + ',' + r1(Y(.6)) + ' Q' + r1(cx) + ',' + r1(Y(1.08)) + ' ' + r1(X(K.wCab * .62)) + ',' + r1(Y(.6)) + '" fill="' + HUESO + '" stroke="' + ink + '" stroke-width="1.2"/>';
      s += dos(function (g) { return elip([g * K.wCab * .38, .5], .1, .08, osc(HUESO, .45)); });
      for (var yv = .98; yv < K.yCad; yv += .13) s += '<rect x="' + r1(X(-.05)) + '" y="' + r1(Y(yv)) + '" width="' + r1(.1 * hu) + '" height="' + r1(.1 * hu) + '" rx="2" fill="' + HUESO + '" stroke="' + ink + '" stroke-width=".8"/>';
      for (var k = 0; k < 7; k++) {
        var yk = K.yHom + .12 + k * ((K.yCin - .15) - (K.yHom + .12)) / 7, wk = K.wHom * (.6 + .12 * Math.sin((k + 1) / 8 * Math.PI));
        s += dos(function (g) { var d = 'M' + r1(X(g * .05)) + ',' + r1(Y(yk)) + ' Q' + r1(X(g * wk * 1.08)) + ',' + r1(Y(yk - .04)) + ' ' + r1(X(g * wk * .92)) + ',' + r1(Y(yk + .22)); return '<path d="' + d + '" fill="none" stroke="' + ink + '" stroke-width="' + r1(.05 * hu + 2) + '" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="' + HUESO + '" stroke-width="' + r1(.05 * hu) + '" stroke-linecap="round"/>'; });
      }
      s += '<rect x="' + r1(X(-.045)) + '" y="' + r1(Y(K.yHom + .08)) + '" width="' + r1(.09 * hu) + '" height="' + r1((K.yPec + .3 - K.yHom) * hu) + '" rx="3" fill="' + HUESO + '" stroke="' + ink + '" stroke-width="1"/>';
      s += dos(function (g) {
        return hueso([g * .05, K.yHom - .02], [g * K.wHom * .86, K.yHom + .02], .05) +
          forma([[g * .05, K.yCad - .18], [g * K.wCad * .8, K.yCad - .34], [g * K.wCad * .92, K.yCad - .05], [g * (K.lc + .02), K.yIng - .12], [g * .08, K.yIng - .02], [g * .1, K.yCad]], HUESO) +
          hueso([g * (K.wHom - .06), K.yHom + .12], [g * (K.wHom + .02), K.yCod], .1) + hueso([g * (K.wHom), K.yCod + .02], [g * (K.wHom + .04), K.yMun], .045) + hueso([g * (K.wHom + .06), K.yCod + .03], [g * (K.wHom + .09), K.yMun], .04) +
          elip([g * (K.wHom + .07), (K.yMun + K.yMan) / 2], .07, (K.yMan - K.yMun) / 2 * .8, HUESO) +
          hueso([g * K.wCad * .7, K.yCad + .05], [g * K.lc, K.yRod - .06], .12) + elip([g * K.lc, K.yRod], .07, .07, HUESO) +
          hueso([g * (K.lc - .03), K.yRod + .06], [g * (K.lc - .02), K.yTob], .08) + hueso([g * (K.lc + .08), K.yRod + .1], [g * (K.lc + .07), K.yTob], .04) + elip([g * (K.lc + .03), K.yPie - .06], .11, .06, HUESO);
      });
      P = { craneo: [-K.wCab * .7, .35], clavicula: [K.wHom * .6, K.yHom], costillas: [-K.wHom * .62, K.yPec + .1], columna: [.05, K.yCin - .1], pelvis: [-K.wCad * .8, K.yCad - .15], humero: [K.wHom - .02, (K.yHom + K.yCod) / 2], radio: [-(K.wHom + .03), (K.yCod + K.yMun) / 2], femur: [K.lc + .03, K.mt], rotula: [-K.lc, K.yRod], tibia: [K.lc - .02, K.cf + .2] };
    }
    if (capa === 'musculos') {
      var mus = MUSCULO, bord = MUS_B;
      s += dos(function (g) {
        var f = function (c, rx, ry, rot) { var q = Q(c); return '<ellipse cx="' + r1(q[0]) + '" cy="' + r1(q[1]) + '" rx="' + r1(rx * hu) + '" ry="' + r1(ry * hu) + '" fill="' + mus + '" stroke="' + bord + '" stroke-width="1.2"' + (rot ? ' transform="rotate(' + rot + ' ' + r1(q[0]) + ' ' + r1(q[1]) + ')"' : '') + '/>'; };
        var ab = ''; for (var fi = 0; fi < 3; fi++) ab += '<rect x="' + r1(g > 0 ? X(.02) : X(-.17)) + '" y="' + r1(Y(K.yPec + .3 + fi * .28)) + '" width="' + r1(.15 * hu) + '" height="' + r1(.24 * hu) + '" rx="' + r1(.05 * hu) + '" fill="' + mus + '" stroke="' + bord + '" stroke-width="1.1"/>';
        return f([g * (K.wHom - .02), K.yHom + .16], .13, .2, g * 15) + f([g * K.wHom * .45, K.yPec - .05], K.wHom * .4, .25, 0) + f([g * (K.wHom - .03), (K.yHom + K.yCod) / 2 + .08], K.wBra * .42, (K.yCod - K.yHom) * .33, g * -6) + ab +
          f([g * (K.lc + .02), K.mt], K.wMus * .75, (K.yRod - K.yIng) * .36, 0) + f([g * (K.lc + .05), K.cf + .1], K.wGem * .4, (K.yTob - K.yRod) * .3, 0);
      });
      P = { deltoides: [-(K.wHom + .04), K.yHom + .12], pectoral: [K.wHom * .5, K.yPec - .08], biceps: [K.wHom - .03, (K.yHom + K.yCod) / 2 + .08], abdominales: [-.1, K.yPec + .7], cuadriceps: [K.lc + .02, K.mt], tibial: [-(K.lc + .05), K.cf + .1] };
    }
    if (capa === 'organos' || capa === 'digestivo') {
      var dig = capa === 'digestivo';
      if (!dig) s += elip([0, .36], K.wCab * .78, .28, clr(T.acc, .45)) + '<path d="M' + r1(X(-K.wCab * .5)) + ',' + r1(Y(.36)) + ' q' + r1(.1 * hu) + ',-' + r1(.12 * hu) + ' ' + r1(.2 * hu) + ',0 t' + r1(.2 * hu) + ',0 t' + r1(.2 * hu) + ',0 t' + r1(.2 * hu) + ',0" fill="none" stroke="' + osc(T.acc, .2) + '" stroke-width="1.4"/>';
      if (!dig) s += dos(function (g) { return forma([[g * .07, K.yHom + .02], [g * K.wHom * .55, K.yHom + .1], [g * K.wHom * .72, K.yPec + .3], [g * K.wHom * .65, K.yCin - .38], [g * .1, K.yCin - .42], [g * .1, K.yHom + .2]], clr(T.acc2, .5)); });
      if (!dig) s += forma([[.02, K.yPec - .02], [.13, K.yPec - .08], [.25, K.yPec + .05], [.12, K.yPec + .36], [.01, K.yPec + .16]], T.acc2);
      if (dig) s += '<path d="M' + r1(cx) + ',' + r1(Y(.95)) + ' L' + r1(cx) + ',' + r1(Y(K.yPec)) + ' Q' + r1(cx) + ',' + r1(Y(K.yCin - .45)) + ' ' + r1(X(.1)) + ',' + r1(Y(K.yCin - .36)) + '" fill="none" stroke="' + osc(T.acc2, .15) + '" stroke-width="' + r1(.06 * hu) + '" stroke-linecap="round"/>' + elip([0, .82], .12, .05, osc(T.acc2, .1));
      s += forma([[-K.wCin * 1.05, K.yCin - .44], [.05, K.yCin - .42], [.1, K.yCin - .32], [-.1, K.yCin - .06], [-K.wCin, K.yCin - .02]], osc(T.acc, .28));
      s += forma([[.06, K.yCin - .38], [K.wCin * .85, K.yCin - .44], [K.wCin * .92, K.yCin - .1], [.3, K.yCin + .04], [.1, K.yCin - .12]], clr(T.acc, .3));
      if (dig) s += elip([.14, K.yCin - .02], .17, .045, clr(T.acc2, .15));
      var gx = K.wCin * .85, gy1 = K.yCin + .04, gy2 = K.yCad + .1;
      s += '<path d="M' + r1(X(-gx)) + ',' + r1(Y(gy2)) + ' L' + r1(X(-gx)) + ',' + r1(Y(gy1)) + ' L' + r1(X(gx)) + ',' + r1(Y(gy1)) + ' L' + r1(X(gx)) + ',' + r1(Y(gy2)) + ' L' + r1(X(.1)) + ',' + r1(Y(gy2 + .08)) + '" fill="none" stroke="' + osc(T.acc, .35) + '" stroke-width="' + r1(.11 * hu) + '" stroke-linejoin="round" stroke-linecap="round"/>';
      var sp = 'M' + r1(X(-gx * .62)) + ',' + r1(Y(gy1 + .14)), filas = 5, dy = (gy2 - gy1 - .2) / filas;
      for (var fl = 0; fl < filas; fl++) { var ya = gy1 + .14 + fl * dy, xa = fl % 2 ? -gx * .62 : gx * .62; sp += ' Q' + r1(X(0)) + ',' + r1(Y(ya - .12)) + ' ' + r1(X(xa)) + ',' + r1(Y(ya)) + ' Q' + r1(X(xa * 1.1)) + ',' + r1(Y(ya + dy / 2)) + ' ' + r1(X(xa)) + ',' + r1(Y(ya + dy)); }
      s += '<path d="' + sp + '" fill="none" stroke="' + clr(T.acc2, .15) + '" stroke-width="' + r1(.07 * hu) + '" stroke-linecap="round"/>';
      if (!dig) s += elip([0, K.yIng - .15], .12, .08, clr(T.acc, .55));
      P = dig ? { boca: [.1, .82], esofago: [-.02, K.yHom + .2], estomago: [K.wCin * .6, K.yCin - .28], higado: [-K.wCin * .7, K.yCin - .28], pancreas: [.25, K.yCin - .02], delgado: [-.2, (gy1 + gy2) / 2 + .1], grueso: [gx, (gy1 + gy2) / 2] }
        : { cerebro: [-K.wCab * .5, .36], pulmones: [-K.wHom * .5, K.yPec], corazon: [.14, K.yPec + .1], higado: [-K.wCin * .7, K.yCin - .28], estomago: [K.wCin * .6, K.yCin - .28], intestinos: [gx, (gy1 + gy2) / 2], vejiga: [-.05, K.yIng - .15] };
    }
    var Pp = {}; for (var q in P) Pp[q] = Q(P[q]);
    return { s: s, P: Pp, K: K, hu: hu, X: X, Y: Y, ancho: (K.wHom + .3) * hu };
  }
  /* Rótulos numerados a izquierda y derecha, sin que se monten. */
  function rotulos(C, L, cx, xi, xd) {
    var T = C.T, out = '', n = 0, orden = [];
    [L.filter(function (l) { return l.p[0] < cx; }), L.filter(function (l) { return l.p[0] >= cx; })].forEach(function (g, lado) {
      g.sort(function (a, b) { return a.p[1] - b.p[1]; });
      var ult = -99, xl = lado ? xd : xi;
      g.forEach(function (l) {
        var y = Math.max(l.p[1], ult + 26); ult = y; l.n = ++n; orden.push(l);
        out += ln(l.p, [xl + (lado ? -13 : 13), y], 'stroke="' + T.ink + '" stroke-width="1.1"') + '<circle cx="' + r1(l.p[0]) + '" cy="' + r1(l.p[1]) + '" r="2.6" fill="' + T.ink + '"/>' +
          '<circle cx="' + r1(xl) + '" cy="' + r1(y) + '" r="12" fill="' + T.acc + '" stroke="#fff" stroke-width="1.5"/>' + tx(xl, y + 4.5, l.n, { f: T.cuerpo, s: 13, c: '#fff', w: 700 });
      });
    });
    return { s: out, L: orden };
  }
  function banco(C, ns) { var T = C.T; return '<div style="display:flex;flex-wrap:wrap;gap:2mm;justify-content:center;margin:3mm 0 1mm">' + ns.map(function (x) { return '<span style="border:1px solid ' + T.acc + ';border-radius:' + Math.max(T.r, 4) + 'px;padding:.6mm 3mm;font-size:.9em">' + esc(x) + '</span>'; }).join('') + '</div>'; }
  function sinArt(s) { return s.replace(/^(el|la|los|las) /, ''); }

  /* ─────────── 1 · Sistemas del cuerpo ─────────── */
  var CTX = {
    anat: 'Cada sistema del cuerpo trabaja coordinado con los demás.', bio: 'El cuerpo humano es un organismo pluricelular organizado en aparatos y sistemas.', natu: 'Conocer tu cuerpo te ayuda a cuidarlo.',
    efisica: 'Cuando haces ejercicio trabajan a la vez huesos, músculos, corazón y pulmones.', arte: 'Para dibujar bien la figura humana, los artistas estudian lo que hay bajo la piel.',
    cocina: 'Todo lo que cocinas acaba recorriendo este camino.', batidos: 'Un batido empieza a digerirse en cuanto lo bebes.', reposteria: 'Los azúcares de un postre se absorben en el intestino.', pasteleria: 'Los azúcares de un postre se absorben en el intestino.', panaderia: 'El almidón del pan empieza a digerirse en la boca, con la saliva.'
  };
  var TIT = { esqueleto: 'El esqueleto', musculos: 'Los músculos', organos: 'Los órganos internos', digestivo: 'El viaje de la comida' };
  function laminaSistema(u, C, r, capa) {
    var T = C.T, n = esPeq(C) ? 6 : 8, torso = capa === 'organos' || capa === 'digestivo', alto = torso ? 760 : 430, f0 = prop(n), hu = alto / n, ancho = (f0.wHom + .3) * hu, W = ancho * 2 + 140, cx = W / 2;
    var F = figFrente(C, { n: n, alto: alto, cx: cx, capa: capa, fill: capa === 'esqueleto' ? clr(T.acc, .9) : null });
    var Hh = torso ? F.Y(F.K.yIng + .25) : F.Y(F.K.yPie) + 14, defs = PARTES[capa], elegidas = H.mezcla(r, defs).slice(0, esPeq(C) ? 5 : Math.min(7, defs.length));
    var R = rotulos(C, elegidas.map(function (d) { return { id: d[0], nom: d[1], fun: d[2], p: F.P[d[0]] }; }), cx, 22, W - 22);
    var fig = svg(W, Hh, F.s + R.s, torso ? 420 : 400);
    var L = R.L, a = L[0], b = L[Math.min(2, L.length - 1)], c = L[L.length - 1];
    var otras = H.mezcla(r, defs.filter(function (d) { return d[0] !== c.id; })).slice(0, 2).map(function (d) { return d[2]; });
    var items = [it('corta', '¿Qué número señala ' + a.nom + '?', a.n, num(a.n)), it('corta', '¿Qué número señala ' + b.nom + '?', b.n, num(b.n)), mc('¿Qué función tiene ' + c.nom + '?', H.mezcla(r, [c.fun].concat(otras)), c.fun)];
    if (capa === 'digestivo') items.push(it('abierta', 'Ordena el recorrido de la comida desde la boca.', 'boca → esófago → estómago → intestino delgado → intestino grueso', { lin: 2 }));
    else if (!esPeq(C)) items.push(it('abierta', 'Elige un ' + (capa === 'esqueleto' ? 'hueso' : capa === 'musculos' ? 'músculo' : 'órgano') + ' y explica qué pasaría si dejara de funcionar.', '', { lin: 2 }));
    var exp = { esqueleto: 'Los huesos son rígidos pero están vivos: tienen vasos sanguíneos y se reparan solos. Las articulaciones permiten que el esqueleto se mueva como un sistema de palancas.', musculos: 'Los músculos solo tiran, nunca empujan. Por eso trabajan por parejas: cuando el bíceps se contrae y dobla el codo, el tríceps se relaja; para estirarlo, ocurre al revés.', organos: 'Los órganos están protegidos por el esqueleto: el cráneo guarda el encéfalo y las costillas forman una jaula para el corazón y los pulmones.', digestivo: 'La digestión convierte la comida en moléculas tan pequeñas que atraviesan la pared del intestino y pasan a la sangre. El intestino delgado mide unos 7 metros y se pliega para caber en el abdomen.' }[capa];
    return { t: TIT[capa], intro: (CTX[C.mat] || CTX.anat) + ' Relaciona cada número con su nombre.', fig: fig + banco(C, H.mezcla(r, L.map(function (l) { return sinArt(l.nom); }))) + porque(C, exp), items: items };
  }
  function genSistemas(u, C, r) {
    var m = C.mat, capas = m === 'efisica' ? ['musculos', 'esqueleto', 'organos'] : m === 'arte' ? ['esqueleto', 'musculos'] : ['esqueleto', 'musculos', 'organos'];
    return laminaSistema(u, C, r, H.pick(r, capas));
  }
  function genDigestion(u, C, r) {
    var V = laminaSistema(u, C, r, 'digestivo'), L = 7, alt = esPeq(C) ? 1.3 : C.adulto ? 1.7 : 1.5, veces = Math.round(L / alt * 10) / 10;
    if (/^(cocina|batidos|reposteria|pasteleria|panaderia)$/.test(C.mat)) V.intro = CTX[C.mat] + ' Relaciona cada número con su nombre.';
    V.items.push(it('corta', 'El intestino delgado mide unos 7 m. Si mides ' + fmt(alt) + ' m, ¿cuántas veces tu altura es? (un decimal)', fmt(veces), num(veces)));
    return V;
  }

  /* ─────────── 2 · Proporciones por edad ─────────── */
  var EDADES = [['Bebé (1 año)', 4, 75], ['Niña o niño (6 años)', 6, 115], ['Persona adulta', 8, 170]];
  function genEdades(u, C, r) {
    var T = C.T, esc0 = 360 / 170, W = 600, cxs = [100, 290, 480], out = '', y0 = 14, base = y0 + 360;
    EDADES.forEach(function (e, i) {
      var alto = e[2] * esc0, top = base - alto, F = figFrente(C, { n: e[1], alto: alto, cx: cxs[i], y0: top }), hu = alto / e[1];
      for (var k = 0; k <= e[1]; k++) out += ln([cxs[i] - 70, top + k * hu], [cxs[i] + 70, top + k * hu], 'stroke="' + T.acc + '" stroke-width="' + (k === 0 || k === e[1] ? 1.2 : .8) + '" stroke-dasharray="' + (k === 0 || k === e[1] ? '0' : '4 4') + '" opacity=".7"');
      out += F.s;
      for (var j = 0; j < e[1]; j++) out += tx(cxs[i] - 78, top + (j + .5) * hu + 4, j + 1, { f: T.cuerpo, s: 11, c: T.acc, w: 700, a: 'end' });
      out += tx(cxs[i], base + 22, e[0], { f: T.cuerpo, s: 13, c: T.ink, w: 700 }) + tx(cxs[i], base + 38, e[1] + ' cabezas · ' + e[2] + ' cm', { f: T.cuerpo, s: 12, c: T.ink });
    });
    var fig = svg(W, base + 46, out, 600), cab = E(r, 20, 23), adu = cab * 8, arte = C.mat === 'arte';
    var items = [it('corta', '¿Cuántas cabezas mide la persona adulta?', 8, num(8)), it('corta', '¿Qué fracción de su altura es la cabeza del bebé?', '1/4', { ac: ['1/4', '0,25', '25 %', '25%', 'un cuarto'] })];
    if (!esPeq(C)) items.push(it('corta', 'Si la cabeza de un adulto mide ' + cab + ' cm, ¿cuánto mide de alto?', adu + ' cm', num(adu)), it('corta', '¿Qué porcentaje de la altura adulta es la cabeza?', '12,5 %', { ac: ['12,5', '12,5 %', '12.5', '12,5%'] }));
    if (arte) items.push(it('abierta', 'Dibuja una figura de 6 cabezas en tu cuaderno: marca primero las líneas horizontales.', '', { lin: 2 }));
    return { t: 'Las proporciones cambian con la edad', intro: 'Las tres figuras están dibujadas a la misma escala. La unidad de medida es la altura de la propia cabeza.', fig: fig + porque(C, arte ? 'Los dibujantes usan la cabeza como regla: el canon clásico da 8 cabezas al adulto. Si dibujas un niño con la cabeza pequeña, parecerá un adulto en miniatura.' : 'Al nacer, la cabeza ya tiene casi la mitad de su tamaño final, pero las piernas crecen mucho más. Por eso el número de cabezas pasa de 4 a 8: es una razón que cambia con la edad.'), items: items };
  }

  /* ─────────── 3 · El brazo como palanca ─────────── */
  function flecha(a, b, col, et, C) {
    var ang = Math.atan2(b[1] - a[1], b[0] - a[0]), L = 12, p1 = [b[0] - L * Math.cos(ang - .4), b[1] - L * Math.sin(ang - .4)], p2 = [b[0] - L * Math.cos(ang + .4), b[1] - L * Math.sin(ang + .4)];
    return ln(a, [b[0] - 6 * Math.cos(ang), b[1] - 6 * Math.sin(ang)], 'stroke="' + col + '" stroke-width="4" stroke-linecap="round"') + '<polygon points="' + [b, p1, p2].map(function (q) { return r1(q[0]) + ',' + r1(q[1]); }).join(' ') + '" fill="' + col + '"/>' + (et ? tx(b[0] + 8, b[1] + (b[1] > a[1] ? 18 : -8), et, { f: C.T.cuerpo, s: 14, c: col, w: 700, a: 'start', st: true }) : '');
  }
  function genPalanca(u, C, r) {
    var T = C.T, k = 9, cx = 110, cy = 200, dI = 4, dP = 35, kg = E(r, 2, 6), P = kg * 10, F = P * dP / dI, out = '', d3 = es3d(C), piel = clr(T.acc, .82);
    var mano = [cx + dP * k, cy];
    if (d3) out += '<g transform="translate(4 5)" opacity=".13"><path d="M' + (cx - 22) + ',30 L' + (cx + 22) + ',30 L' + (cx + 24) + ',' + (cy + 18) + ' L' + (mano[0] + 10) + ',' + (cy + 16) + ' L' + (mano[0] + 10) + ',' + (cy - 16) + ' L' + (cx + 24) + ',' + (cy - 18) + ' Z" fill="#000"/></g>';
    out += '<path d="' + curva([[cx - 24, 24], [cx + 26, 24], [cx + 30, cy - 22], [mano[0] - 10, cy - 15], [mano[0] + 6, cy - 12], [mano[0] + 6, cy + 14], [cx + 20, cy + 22], [cx - 22, cy + 16]], true) + '" fill="' + piel + '" stroke="' + T.ink + '" stroke-width="1.6"/>';
    var hs = function (a, b, w) { return ln(a, b, 'stroke="' + T.ink + '" stroke-width="' + (w + 2.4) + '" stroke-linecap="round"') + ln(a, b, 'stroke="' + HUESO + '" stroke-width="' + w + '" stroke-linecap="round"'); };
    out += hs([cx, 34], [cx, cy - 4], 14) + hs([cx + 4, cy], [mano[0] - 16, cy - 4], 9) + hs([cx + 4, cy + 7], [mano[0] - 16, cy + 5], 7);
    out += '<ellipse cx="' + (cx + 18) + '" cy="' + ((34 + cy) / 2 + 8) + '" rx="15" ry="' + ((cy - 34) / 2 - 16) + '" fill="' + MUSCULO + '" stroke="' + MUS_B + '" stroke-width="1.4" transform="rotate(6 ' + (cx + 18) + ' ' + ((34 + cy) / 2) + ')"/>' + ln([cx + 22, cy - 38], [cx + dI * k, cy - 6], 'stroke="' + MUS_B + '" stroke-width="3"');
    out += '<polygon points="' + cx + ',' + (cy + 10) + ' ' + (cx - 14) + ',' + (cy + 36) + ' ' + (cx + 14) + ',' + (cy + 36) + '" fill="' + T.ink + '"/>' + tx(cx, cy + 54, 'codo (fulcro)', { f: T.cuerpo, s: 12, c: T.ink, w: 700 });
    out += '<rect x="' + (mano[0] - 16) + '" y="' + (cy + 18) + '" width="32" height="' + (22 + kg * 3) + '" rx="4" fill="' + osc(T.ink, 0) + '" opacity=".85"/>' + ln([mano[0], cy + 6], [mano[0], cy + 18], 'stroke="' + T.ink + '" stroke-width="2"') + tx(mano[0], cy + 36 + kg * 1.5, kg + ' kg', { f: T.cuerpo, s: 12, c: '#fff', w: 700 });
    out += flecha([cx + dI * k, cy - 8], [cx + dI * k, cy - 92], T.acc2, 'F bíceps', C) + flecha([mano[0] + 24, cy], [mano[0] + 24, cy + 80], T.acc, 'P = ' + P + ' N', C);
    var cota = function (x1, x2, y, t) { return ln([x1, y], [x2, y], 'stroke="' + T.ink + '" stroke-width="1"') + ln([x1, y - 5], [x1, y + 5], 'stroke="' + T.ink + '" stroke-width="1"') + ln([x2, y - 5], [x2, y + 5], 'stroke="' + T.ink + '" stroke-width="1"') + tx((x1 + x2) / 2, y - 6, t, { f: T.cuerpo, s: 12, c: T.ink, w: 700, st: true }); };
    out += cota(cx, cx + dI * k, cy + 76, dI + ' cm') + cota(cx, mano[0], cy + 104, dP + ' cm');
    var fig = svg(mano[0] + 110, cy + 118, out, 560);
    var items = [it('corta', '¿Cuánto pesa la pesa en newtons? (usa g ≈ 10 N/kg)', P + ' N', num(P)), it('corta', 'Aplica la ley de la palanca, F × ' + dI + ' = P × ' + dP + '. ¿Qué fuerza hace el bíceps?', F + ' N', num(F)), mc('¿De qué género es esta palanca?', ['primer género', 'segundo género', 'tercer género'], 'tercer género')];
    if (C.mat === 'efisica') items[2] = it('abierta', '¿Por qué cuesta más sostener la pesa con el brazo estirado que pegada al cuerpo?', 'Con el brazo estirado aumenta la distancia de la carga al codo y el músculo debe hacer más fuerza.', { lin: 2 });
    return { t: 'El brazo es una palanca', intro: 'El codo es el punto de apoyo, el bíceps tira del antebrazo a ' + dI + ' cm del codo y la pesa está en la mano, a ' + dP + ' cm.', fig: fig + porque(C, 'En una palanca de tercer género la fuerza está entre el apoyo y la carga: el músculo tiene que hacer mucha más fuerza que la carga, pero a cambio la mano se mueve deprisa y recorre mucho espacio. Así funcionan también unas pinzas o una caña de pescar.'), items: items };
  }

  /* ─────────── 4 · Frecuencia cardíaca ─────────── */
  function genPulso(u, C, r) {
    if (!SV.barras) return null;
    var edad = esPeq(C) ? 10 : C.adulto ? H.pick(r, [30, 35, 40, 45, 50]) : H.pick(r, [13, 14, 15, 16]), max = 220 - edad, pc = [50, 60, 70, 80, 90], vals = pc.map(function (p) { return Math.round(max * p / 100); });
    var fig = SV.barras(C, { cats: ['50 %', '60 %', '70 %', '80 %', '90 %'], vals: vals, unidad: 'pulsaciones por minuto', valores: true, max: Math.ceil(max / 20) * 20 + 10 });
    var T = C.T, K = prop(8), F = figFrente(C, { n: 8, alto: 700, cx: 110, capa: 'organos' }), mini = svg(220, F.Y(K.yCin), F.s + '<circle cx="' + r1(F.P.corazon[0]) + '" cy="' + r1(F.P.corazon[1]) + '" r="22" fill="none" stroke="' + T.acc2 + '" stroke-width="3"><animate attributeName="r" values="18;26;18" dur=".8s" repeatCount="indefinite"/></circle>', 150);
    var lat = E(r, 18, 26), ppm = lat * 4, z70 = Math.round(max * .7);
    var items = [it('corta', 'Calcula tu frecuencia máxima con la fórmula 220 − edad, para ' + edad + ' años.', max + ' ppm', num(max)), it('corta', 'La zona aeróbica empieza en el 70 %. ¿Cuántas pulsaciones son?', z70 + ' ppm', num(z70)), it('corta', 'Cuentas ' + lat + ' latidos en 15 segundos. ¿Cuántas pulsaciones por minuto son?', ppm + ' ppm', num(ppm))];
    return { t: 'El corazón y las zonas de esfuerzo', intro: 'Zonas de frecuencia cardíaca para una persona de ' + edad + ' años. Cada barra es un porcentaje de su frecuencia máxima.', fig: '<div style="display:grid;grid-template-columns:1fr 2.6fr;gap:6mm;align-items:center">' + mini + fig + '</div>' + porque(C, 'Con el ejercicio los músculos piden más oxígeno y el corazón late más deprisa para llevárselo. Entrenar entre el 60 y el 80 % mejora la resistencia; por encima del 90 % solo se aguanta unos segundos.'), items: items };
  }

  /* ─────────── 5 · De qué está hecho el cuerpo ─────────── */
  function genQuimica(u, C, r) {
    if (!SV.sectores) return null;
    var cats = ['Oxígeno (O)', 'Carbono (C)', 'Hidrógeno (H)', 'Nitrógeno (N)', 'Calcio (Ca)', 'Otros'], vals = [65, 18, 10, 3, 1.5, 2.5], kg = H.pick(r, [50, 60, 70, 80]), o = Math.round(kg * .65 * 10) / 10, cc = Math.round(kg * .18 * 10) / 10;
    var fig = SV.sectores(C, { cats: cats, vals: vals });
    var items = [it('corta', '¿Qué elemento es el más abundante en el cuerpo?', 'oxígeno', { ac: ['oxígeno', 'oxigeno', 'O'] }), it('corta', 'Una persona de ' + kg + ' kg, ¿cuántos kg de oxígeno tiene?', fmt(o) + ' kg', num(o)), it('corta', '¿Y cuántos kg de carbono?', fmt(cc) + ' kg', num(cc)), mc('¿Por qué hay tanto oxígeno?', H.mezcla(r, ['porque el cuerpo es sobre todo agua (H₂O)', 'porque respiramos aire puro', 'porque los huesos son de oxígeno']), 'porque el cuerpo es sobre todo agua (H₂O)')];
    return { t: 'De qué está hecho el cuerpo', intro: 'Porcentaje en masa de los elementos químicos del cuerpo humano.', fig: fig + porque(C, 'Alrededor del 60 % del cuerpo es agua, y en cada molécula de agua el oxígeno pesa 16 veces más que cada hidrógeno. El carbono forma el esqueleto de las proteínas, las grasas y el ADN; el calcio, casi todo, está en los huesos.'), items: items };
  }

  /* ─────────── 6 · Postura y columna ─────────── */
  function genPostura(u, C, r) {
    var T = C.T, hu = 50, cx = 200, y0 = 14, X = function (v) { return cx + v * hu * 1.6; }, Y = function (v) { return y0 + v * hu; }, Q = function (p) { return [X(p[0]), Y(p[1])]; }, d3 = es3d(C), out = '';
    var cont = [[.12, 1.0], [.2, 1.4], [.38, 2.0], [.3, 2.7], [.34, 3.2], [.28, 3.7], [.3, 4.3], [.18, 5.6], [.2, 6.0], [.12, 6.6], [.08, 7.7], [.5, 7.95], [.45, 8.0], [-.18, 8.0], [-.16, 7.7], [-.2, 6.9], [-.28, 6.4], [-.14, 5.9], [-.22, 5.2], [-.3, 4.3], [-.38, 3.85], [-.24, 3.2], [-.3, 2.4], [-.24, 1.6], [-.1, 1.05]];
    var d = curva(cont.map(Q), true), piel = clr(T.acc, .82);
    if (d3) out += '<ellipse cx="' + X(.1) + '" cy="' + (Y(8) + 3) + '" rx="' + (.7 * hu) + '" ry="7" fill="#000" opacity=".14"/><g transform="translate(4 5)" opacity=".13"><path d="' + d + '" fill="#000"/><circle cx="' + X(.05) + '" cy="' + Y(.5) + '" r="' + (.62 * hu) + '" fill="#000"/></g>';
    out += '<path d="' + d + '" fill="' + piel + '" stroke="' + T.ink + '" stroke-width="1.6"/><circle cx="' + X(.05) + '" cy="' + Y(.5) + '" r="' + (.62 * hu) + '" fill="' + piel + '" stroke="' + T.ink + '" stroke-width="1.6"/>';
    var pal = SV.paleta ? SV.paleta(C) : [T.acc, T.acc2, T.ink, T.acc];
    var segs = [['cervical', [[-.12, 1.0], [-.06, 1.25], [-.1, 1.45]], pal[0]], ['torácica', [[-.1, 1.45], [-.26, 2.1], [-.1, 2.75]], pal[1]], ['lumbar', [[-.1, 2.75], [-.03, 3.05], [-.13, 3.35]], pal[2]], ['sacro', [[-.13, 3.35], [-.22, 3.55], [-.16, 3.75]], pal[3]]];
    segs.forEach(function (sg) { var a = Q(sg[1][0]), b = Q(sg[1][1]), c = Q(sg[1][2]); out += '<path d="M' + r1(a[0]) + ',' + r1(a[1]) + ' Q' + r1(b[0]) + ',' + r1(b[1]) + ' ' + r1(c[0]) + ',' + r1(c[1]) + '" fill="none" stroke="' + T.ink + '" stroke-width="12" stroke-linecap="round"/><path d="M' + r1(a[0]) + ',' + r1(a[1]) + ' Q' + r1(b[0]) + ',' + r1(b[1]) + ' ' + r1(c[0]) + ',' + r1(c[1]) + '" fill="none" stroke="' + sg[2] + '" stroke-width="9" stroke-linecap="round" stroke-dasharray="7 2"/>'; });
    out += ln(Q([.02, .3]), Q([.02, 8.1]), 'stroke="' + T.acc2 + '" stroke-width="2" stroke-dasharray="8 5"') + tx(X(.02), Y(8.1) + 18, 'línea de gravedad', { f: T.cuerpo, s: 12, c: T.acc2, w: 700 });
    var R = rotulos(C, segs.map(function (sg) { var m = sg[1][1]; return { nom: sg[0], p: Q([(sg[1][0][0] + m[0] + sg[1][2][0]) / 3, m[1]]) }; }), cx + 1, 40, cx + 180);
    out += R.s;
    var fig = svg(cx + 200, Y(8.1) + 26, out, 360), L = R.L;
    var ley = '<div style="display:flex;flex-wrap:wrap;gap:3mm;justify-content:center;margin-top:2mm;font-size:.9em">' + L.map(function (l) { return '<span><b style="color:' + T.acc + '">' + l.n + '</b> · ' + esc(l.nom) + '</span>'; }).join('') + '</div>';
    var fis = C.mat === 'fisica';
    var items = [it('corta', 'La columna tiene 7 vértebras cervicales, 12 torácicas y 5 lumbares. ¿Cuántas suman?', 24, num(24)), mc('¿Qué zona de la columna se curva hacia atrás (cifosis)?', ['cervical', 'torácica', 'lumbar'], 'torácica'),
      fis ? mc('Si la línea de gravedad cae fuera de los pies, la persona…', H.mezcla(r, ['pierde el equilibrio', 'pesa menos', 'se queda igual']), 'pierde el equilibrio') : it('abierta', '¿Por qué conviene llevar la mochila con las dos asas y pegada a la espalda?', 'Así el peso queda cerca de la línea de gravedad y la columna no se curva hacia un lado.', { lin: 2 })];
    return { t: 'La postura y las curvas de la columna', intro: 'Vista de perfil. La columna no es recta: sus curvas amortiguan los golpes como un muelle.', fig: fig + ley + porque(C, fis ? 'Un cuerpo está en equilibrio si la vertical que pasa por su centro de gravedad cae dentro de la base de apoyo. Al inclinarte, el cuerpo mueve brazos y cadera sin que lo pienses para mantener esa línea entre los pies.' : 'Una buena postura mantiene las tres curvas en su sitio y reparte el peso sobre la línea de gravedad. Encorvarse aumenta la cifosis y carga los músculos de la espalda.'), items: items };
  }

  /* ─────────── 7 · Sección transversal del muslo ─────────── */
  function genSeccion(u, C, r) {
    var T = C.T, cx = 230, cy = 180, out = '', d3 = es3d(C), capas = [['piel', 150, clr(T.acc, .55)], ['grasa', 142, '#F3DDA0'], ['músculo', 120, MUSCULO], ['hueso', 34, HUESO], ['médula ósea', 20, clr(T.acc2, .05)]];
    if (d3) out += '<ellipse cx="' + (cx + 5) + '" cy="' + (cy + 7) + '" rx="152" ry="146" fill="#000" opacity=".14"/>';
    capas.forEach(function (c, i) { out += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + c[1] + '" ry="' + (c[1] * .96) + '" fill="' + c[2] + '" stroke="' + T.ink + '" stroke-width="' + (i ? 1.2 : 1.8) + '"/>'; if (i === 2) [[-40, -110, 0, -36], [60, -95, 30, -18], [95, 60, 28, 20], [-100, 50, -30, 16]].forEach(function (s) { out += ln([cx + s[0], cy + s[1]], [cx + s[2], cy + s[3]], 'stroke="' + MUS_B + '" stroke-width="1.4"'); }); });
    out += '<circle cx="' + (cx - 60) + '" cy="' + (cy + 55) + '" r="9" fill="' + ARTERIA + '" stroke="' + T.ink + '"/><circle cx="' + (cx - 42) + '" cy="' + (cy + 66) + '" r="11" fill="' + VENA + '" stroke="' + T.ink + '"/><circle cx="' + (cx - 78) + '" cy="' + (cy + 70) + '" r="6" fill="' + NERVIO + '" stroke="' + T.ink + '"/>';
    var P = [['piel', [cx - 104, cy - 104]], ['grasa', [cx + 128, cy - 40]], ['músculo', [cx - 80, cy - 40]], ['hueso', [cx + 27, cy]], ['médula ósea', [cx - 8, cy + 6]], ['arteria', [cx - 60, cy + 55]], ['vena', [cx - 42, cy + 66]], ['nervio', [cx - 78, cy + 70]]];
    var R = rotulos(C, P.map(function (p) { return { nom: p[0], p: p[1] }; }), cx, 26, 2 * cx - 26), L = R.L;
    var fig = svg(2 * cx, 350, out + R.s, 440) + banco(C, H.mezcla(r, L.map(function (l) { return l.nom; })));
    var nm = function (x) { return L.filter(function (l) { return l.nom === x; })[0].n; };
    var items = [it('corta', '¿Qué número es la médula ósea?', nm('médula ósea'), num(nm('médula ósea'))), it('corta', 'Escribe las capas de fuera hacia dentro.', 'piel, grasa, músculo, hueso, médula ósea'), mc('¿Dónde se fabrican las células de la sangre?', H.mezcla(r, ['en la médula ósea', 'en la grasa', 'en la piel']), 'en la médula ósea')];
    return { t: 'Por dentro de la pierna', intro: 'Corte transversal del muslo, como si lo cortáramos en rodajas. Dentro está el fémur.', fig: fig + porque(C, 'La grasa aísla del frío y guarda energía; el músculo mueve el hueso; y dentro del hueso, la médula roja fabrica millones de glóbulos rojos cada segundo. La arteria lleva sangre con oxígeno hacia el pie y la vena la devuelve al corazón.'), items: items };
  }

  SV.visual('anat_sistemas', genSistemas, { materias: /^(anat|bio|natu|efisica|arte)$/, max: 2 });
  SV.visual('anat_edades', genEdades, { materias: /^(arte|mate|anat|bio|efisica|geoalg|calculo)$/, unico: true });
  SV.visual('anat_palanca', genPalanca, { materias: /^(fisica|tecno|anat|efisica)$/, unico: true });
  SV.visual('anat_pulso', genPulso, { materias: /^(efisica|anat|bio|mate|geoalg|calculo)$/, unico: true });
  SV.visual('anat_quimica', genQuimica, { materias: /^(quimica|bio|anat)$/, unico: true });
  SV.visual('anat_digestion', genDigestion, { materias: /^(cocina|batidos|reposteria|pasteleria|panaderia|bio|natu|anat)$/, unico: true });
  SV.visual('anat_postura', genPostura, { materias: /^(efisica|fisica|anat|arte)$/, unico: true });
  SV.visual('anat_seccion', genSeccion, { materias: /^(anat|bio|natu)$/, unico: true });

  window.EU_ANATOMIA = { figFrente: figFrente, prop: prop, rotulos: rotulos, curva: curva, PARTES: PARTES, generadores: { sistemas: genSistemas, edades: genEdades, palanca: genPalanca, pulso: genPulso, quimica: genQuimica, digestion: genDigestion, postura: genPostura, seccion: genSeccion, lamina: laminaSistema } };
})();
