/* b6_pelu_particiones.js — particiones y técnicas de Peluquería como DATOS (window.EU_PARTICIONES).
   Cada técnica sale de los diagramas de Fátima (carpeta «para mi clauidia» de su Drive) y se anima con el motor de
   diagramación que ya existe (EU_DIAGRAMA, sobre el maniquí de Guías 3D): mismos trazos con tiempos, mismo reproductor,
   mismos fondos. Así la técnica sale sola en el curso premium (lección «Diagramación · …» en la unidad pe_u_base,
   con voz frase a frase y grabable) sin tocar b6_guias_3d.js, b6_divisiones.js, b6_estudios.js ni b6_cerebro.js.
   Entrega 1: seccionado en 4 y 6 secciones (raya central medida desde la nariz, de oreja a oreja por arriba,
   segunda línea de oreja a oreja en la nuca) y escala de elevación 0–225° (225° = 45° sobredirigido).
   Numeración de sus diagramas: 1 delante derecha · 2 delante izquierda · 3 atrás izquierda · 4 atrás derecha ·
   5 nuca izquierda · 6 nuca derecha. Cargar después de b6_curso_animado.js. */
(function () {
  'use strict';
  if (window.EU_PARTICIONES) return;
  var DG = window.EU_DIAGRAMA; if (!DG || !DG.construirCon) return;

  var PI = Math.PI;
  var C_RAYA = '#1F1B18', C_OREJAS = '#2C6FD1', C_NUCA = '#18906A', C_NARIZ = '#7CB342';
  /* colores de las secciones 1–6 (los mismos del motor, en su orden) */
  var C_SEC = ['#B01E45', '#C96A1E', '#D9920E', '#18906A', '#2C6FD1', '#7A4BD1'];

  /* ── líneas de división como datos: [tipo, …] en coordenadas del cráneo del motor (φ azimut, θ desde la coronilla) ──
     'meridiano' [a, θa, b, θb]: de un lado (φ=a, θa) sube por la coronilla y baja al otro (φ=b, θb)
     'paralelo'  [θ, φ0, φ1]:     a la misma altura θ, de φ0 a φ1                                                   */
  function curva(K, d) {
    if (d[0] === 'meridiano') { var a = d[1], ta = d[2], b = d[3], tb = d[4]; return function (u) { var th = -ta + u * (ta + tb); return th < 0 ? [a, -th] : [b, th]; }; }
    if (d[0] === 'paralelo') return function (u) { return [d[2] + u * (d[3] - d[2]), d[1]]; };
    return null;
  }
  /* zonas: número, φ, θ (centro aproximado de cada sección) */
  function zonasSeis(K) {
    var DEL_D = K.CARA - 0.55, DEL_I = K.CARA + 0.55, ATR_D = K.NUCA + 0.62, ATR_I = K.NUCA - 0.62;   /* derecha de la clienta = φ hacia IZQ del motor (comprobado en las 4 vistas) */
    return [
      ['1', DEL_D, 0.72], ['2', DEL_I, 0.72],
      ['3', ATR_I, 1.12], ['4', ATR_D, 1.12],
      ['5', K.NUCA - 0.42, 1.86], ['6', K.NUCA + 0.42, 1.86]
    ];
  }
  function lineasSeis(K) {
    return {
      raya: ['meridiano', K.CARA, 1.30, K.NUCA, 1.97],
      orejas: ['meridiano', K.IZQ - 0.12, 1.62, K.DER + 0.12, 1.62],
      nuca: ['paralelo', 1.64, K.NUCA + PI / 2 - 0.12, K.NUCA - PI / 2 + 0.12]
    };
  }

  /* dibuja en una vista: líneas (con su tiempo) y números (con su tiempo); solo lo que se ve desde esa cámara */
  function dibujar(K, v, lin, sec, zonas) {
    var tr = [];
    lin.forEach(function (l) { var f = curva(K, l.d); if (f) tr = tr.concat(K.lineas(K.tramos(v, f, 90), l.t, l.c, l.w || 4, l.extra)); });
    zonas.forEach(function (z) {
      var i = +z[0] - 1, t0 = sec[z[0]]; if (t0 == null || !K.seVe(v, z[1], z[2])) return;
      tr.push(K.chapa(K.pr(v, K.P(z[1], z[2])), z[0], C_SEC[i], t0));
    });
    return tr;
  }

  /* ───────── Técnica 1 · seccionado en 4 y 6 secciones + escala 0–225° ───────── */
  function seis(K) {
    var L = lineasSeis(K), Z = zonasSeis(K), esc = [];

    /* 1 · De frente: la raya central se mide desde la nariz para que salga recta */
    (function () {
      var v = 'frente', tr = [];
      tr.push(K.linea(K.plano([K.pr(v, K.V3(0, -0.36, 1.18)), K.pr(v, K.P(K.CARA, 1.30))]), [0.02, 0.22], C_NARIZ, 2.5, { d: 1 }));
      tr = tr.concat(dibujar(K, v, [{ d: L.raya, t: [0.22, 0.6], c: C_RAYA }], { '1': 0.62, '2': 0.66 }, Z));
      tr.push(K.rotulo('1 · Se mide desde la nariz', C_NARIZ, 0.02), K.rotulo('Raya central: de la frente a la nuca', C_RAYA, 0.22), K.rotulo('Delante quedan la 1 y la 2', C_SEC[0], 0.62));
      esc.push({ tipo: 'p6_raya', vista: v, t: 'Raya central desde la nariz',
        texto: 'Primero, una línea vertical desde el frente de la cabeza hasta la nuca. Se mide desde la nariz para que la raya salga recta. Así la cabeza queda en dos mitades: derecha e izquierda.', a: { v: v, tr: tr } });
    })();

    /* 2 · Desde arriba: de oreja a oreja por la parte de arriba → 4 secciones */
    (function () {
      var v = 'arriba', tr = dibujar(K, v, [{ d: L.raya, t: [0, 0.25], c: C_RAYA }, { d: L.orejas, t: [0.25, 0.6], c: C_OREJAS, w: 4.5 }], { '1': 0.62, '2': 0.66, '3': 0.7, '4': 0.74 }, Z);
      tr.push(K.rotulo('Raya central', C_RAYA, 0), K.rotulo('2 · De oreja a oreja por arriba', C_OREJAS, 0.25), K.rotulo('4 secciones: 1 y 2 delante, 3 y 4 atrás', C_SEC[2], 0.62));
      esc.push({ tipo: 'p6_cuatro', vista: v, t: 'De oreja a oreja · 4 secciones',
        texto: 'Después, una línea horizontal desde detrás de una oreja hasta la otra, pasando por la parte de arriba de la cabeza. Con la raya central quedan cuatro secciones: la 1 y la 2 delante, la 3 y la 4 atrás.', a: { v: v, tr: tr } });
    })();

    /* 3 · Desde atrás: segunda línea de oreja a oreja en la nuca → 6 secciones */
    (function () {
      var v = 'nuca', tr = dibujar(K, v, [{ d: L.raya, t: [0, 0.18], c: C_RAYA }, { d: L.orejas, t: [0.18, 0.36], c: C_OREJAS, w: 4.5 }, { d: L.nuca, t: [0.48, 0.78], c: C_NUCA, w: 4.5 }], { '3': 0.38, '4': 0.42, '5': 0.8, '6': 0.84 }, Z);
      tr.push(K.rotulo('Atrás quedan la 3 y la 4', C_SEC[2], 0.36), K.rotulo('3 · Segunda línea de oreja a oreja, en la nuca', C_NUCA, 0.48), K.rotulo('La nuca se separa en 5 y 6', C_SEC[4], 0.8));
      esc.push({ tipo: 'p6_seis', vista: v, t: 'Segunda línea en la nuca · 6 secciones',
        texto: 'Desde atrás se ven la 3 y la 4. Ahora, una segunda línea horizontal desde detrás de una oreja hasta la otra, a la altura de la nuca. La nuca queda separada en dos secciones más: la 5 y la 6. En total, seis secciones.', a: { v: v, tr: tr } });
    })();

    /* 4 · De perfil: cómo se ven las secciones de un lado */
    (function () {
      var v = 'lateral', tr = dibujar(K, v, [{ d: L.orejas, t: [0, 0.3], c: C_OREJAS, w: 4.5 }, { d: L.nuca, t: [0.3, 0.55], c: C_NUCA, w: 4.5 }, { d: L.raya, t: [0, 0.3], c: C_RAYA, w: 3 }], { '1': 0.6, '2': 0.6, '3': 0.64, '4': 0.64, '5': 0.68, '6': 0.68 }, Z);
      tr.push(K.rotulo('De perfil: la línea de las orejas separa delante y atrás', C_OREJAS, 0), K.rotulo('Debajo, la nuca', C_NUCA, 0.3));
      esc.push({ tipo: 'p6_perfil', vista: v, t: 'Las secciones de perfil',
        texto: 'De perfil se entiende mejor: la línea de oreja a oreja separa la parte de delante de la de atrás, y debajo, detrás de la oreja, queda la sección de la nuca.', a: { v: v, tr: tr } });
    })();

    /* 5 · Escala de elevación 0–225° sobre el perfil */
    (function () {
      var v = 'lateral', tr = [], ph = [K.NUCA + 0.5, K.NUCA - 0.5, K.NUCA + 0.25, K.NUCA - 0.25].filter(function (p) { return K.seVe(v, p, 1.25); })[0];
      if (ph == null) ph = K.NUCA; var th = 1.25, raiz = K.P(ph, th), q0 = K.pr(v, raiz);
      var G = [[0, 'caída natural'], [45, ''], [90, 'horizontal'], [135, ''], [180, 'hacia arriba'], [225, '45° sobredirigido']];
      G.forEach(function (g, i) {
        var ta = 0.06 + i * 0.13, punta = raiz.clone().add(K.dirElev(ph, th, g[0]).multiplyScalar(0.72)), q1 = K.pr(v, punta);
        tr.push(K.linea(K.plano([q0, q1]), [ta, ta + 0.1], C_SEC[i % 6], i === 5 ? 4 : 3, { fl: 1, d: i === 0 ? 1 : 0 }));
        tr.push(K.chapa(q1, String(g[0]), C_SEC[i % 6], ta + 0.1));
        tr.push(K.rotulo(g[0] + '°' + (g[1] ? (g[0] === 225 ? ' = ' : ' · ') + g[1] : ''), C_SEC[i % 6], ta));
      });
      tr.push(K.chapa(q0, '', C_RAYA, 0.02), K.regla(0, 225, [0.06, 0.84], C_SEC[5], 'Elevación 0–225°'));
      esc.push({ tipo: 'p6_elevacion', vista: v, t: 'La escala de elevación 0–225°',
        texto: 'La elevación se mide con la escala de 0 a 225 grados. A 0 grados el cabello cae natural. A 45 sube un poco, a 90 queda horizontal, a 135 sube más y a 180 va hacia arriba. A 225 pasa al otro lado: son 45 grados sobredirigidos.', a: { v: v, tr: tr } });
    })();

    return {
      R: { id: 'p_seis', n: 'Seccionado en 4 y 6 secciones' },
      escenas: esc,
      preguntas: [
        { e: '¿Desde dónde se mide la raya central para que salga recta?', o: ['Desde la nariz', 'Desde la oreja', 'Desde la coronilla'], c: 0, x: 'La raya va del frente a la nuca y se mide desde la nariz.' },
        { e: '¿Qué línea convierte las 4 secciones en 6?', o: ['La segunda línea de oreja a oreja, en la nuca', 'Una segunda raya central', 'Una línea en la coronilla'], c: 0, x: 'La línea de la nuca separa las secciones 5 y 6.' },
        { e: '¿A qué equivalen 225 grados en la escala de elevación?', o: ['45° sobredirigido', '90° horizontal', 'Caída natural'], c: 0, x: 'A 225 grados la mecha pasa al otro lado: 45 grados sobredirigidos.' }
      ]
    };
  }

  /* ═════════ Entrega 2 · técnicas del Cerebro (color, mechas, hidratación, queratina, químicos, cabello) ═════════
     El contenido es el de cada técnica de EU_CEREBRO (pasos con su fase, divisiones, ficha y repaso), también las
     que Fátima cree o corrija en Estudios. Aquí solo se decide CÓMO se dibuja cada fase sobre el maniquí. */
  var MODO = { color_raiz: 'raiz', color_global: 'global', color_balayage: 'barrido', color_babylights: 'finas', color_sombre: 'barrido',
    mechas_aluminio: 'papel', mechas_gorro: 'gorro', hidra_profunda: 'producto', hidra_nutricion: 'producto', quera_alisado: 'plancha',
    quera_botox: 'producto', quim_permanente: 'bigudi', quim_decoloracion: 'decolor', cab_secado: 'secado', cab_planchado: 'plancha', cab_derriz: 'producto' };
  /* altura de tono (1–10) → color del pincel; mezclas claras para decoloración, queratina y tratamientos */
  var NIVEL = ['#1B1110', '#1B1110', '#2A1A14', '#3B2417', '#4E301E', '#6A4428', '#8A5A33', '#A87443', '#C69560', '#DDB97F', '#EED7A6'];
  var C_PAPEL = '#C9CED6', C_PAPEL_B = '#8E98A5', C_AGUA = '#3E9AD6', C_PLANCHA = '#2B2A2E', C_PROD = '#EFE6D6';
  function tono(t, modo) {
    if (modo === 'decolor' || modo === 'papel' || modo === 'gorro' || modo === 'finas' || modo === 'barrido') return '#E9C979';
    if (modo === 'producto' || modo === 'plancha' || modo === 'bigudi' || modo === 'secado') return '#D9C7A8';
    var m = /(\d{1,2})[.,]\d/.exec(((t.ficha || {}).formula) || ''); var n = m ? Math.max(1, Math.min(10, +m[1])) : 6; return NIVEL[n];
  }
  function minutos(t, p) { var s = (p && p.n || '') + ' ' + (((t.ficha || {}).tiempos) || ''), m = /(\d{1,3})\s*min/.exec(s); return m ? +m[1] : 0; }
  function proporcion(t) { var fi = t.ficha || {}, m = /(\d+(?:[.,]\d+)?)(?:\s*de\s+[a-záéíóú]+)?\s*:\s*(\d+(?:[.,]\d+)?)/i.exec((fi.proporciones || '') + ' ' + (fi.formula || '')); return m ? [parseFloat(m[1].replace(',', '.')), parseFloat(m[2].replace(',', '.'))] : null; }

  /* una mecha sobre el cráneo: baja por la superficie desde θ0 hasta la nuca y cuelga; devuelve [x,y,…] visibles entre las fracciones a y b */
  function mecha(K, v, ph, th0, a, b) {
    var pts = [], n = 18, cuelga = 6, i;
    for (i = 0; i <= n; i++) { var th = th0 + (2.05 - th0) * i / n; pts.push([ph, th, null]); }
    var base = K.P(ph, 2.05, 1.06); for (i = 1; i <= cuelga; i++) pts.push([ph, 2.05, base.clone().add(K.V3(0, -0.15 * i, 0))]);
    var out = [], tot = pts.length - 1;
    for (i = Math.floor(a * tot); i <= Math.ceil(b * tot); i++) {
      var q = pts[i]; if (!q) continue;
      if (q[2]) out.push.apply(out, K.pr(v, q[2])); else { if (!K.seVe(v, q[0], q[1])) { if (out.length > 2) break; continue; } out.push.apply(out, K.pr(v, K.P(q[0], q[1], 1.06))); }
    }
    return out.length >= 4 ? out : null;
  }
  function zona(p, t, c, a, b) { return { k: 'z', p: p, t: t, c: c, a: a || 0.45, b: b || '' }; }
  /* rectángulo (papel, bigudí, plancha) alrededor de un tramo de mecha, en coordenadas de pantalla */
  function caja(q, ancho) {
    if (!q || q.length < 4) return null; var x0 = q[0], y0 = q[1], x1 = q[q.length - 2], y1 = q[q.length - 1], dx = x1 - x0, dy = y1 - y0, L = Math.sqrt(dx * dx + dy * dy) || 1, nx = -dy / L * ancho, ny = dx / L * ancho;
    return [x0 + nx, y0 + ny, x1 + nx, y1 + ny, x1 - nx, y1 - ny, x0 - nx, y0 - ny];
  }

  /* divisiones de la técnica (nombres del catálogo del Cerebro) → líneas en la vista de arriba o de la nuca */
  function escDivisiones(K, t, divs, ta, tb) {
    var L = lineasSeis(K), Z = zonasSeis(K), ids = divs.map(function (d) { return d.id; }), v = /ladrillo|espiga/.test(ids.join(' ')) ? 'nuca' : 'arriba', lin = [], sec = {}, tr = [];
    var paso = (tb - ta) / Math.max(1, ids.length);
    ids.forEach(function (id, i) {
      var t0 = ta + i * paso, t1 = t0 + paso * 0.9;
      if (id === 'media' || id === 'cuatro' || id === 'nueve') lin.push({ d: L.raya, t: [t0, t1], c: C_RAYA });
      if (id === 'orejas' || id === 'cuatro' || id === 'nueve') { lin.push({ d: L.orejas, t: [t0, t1], c: C_OREJAS, w: 4.5 }); ['1', '2', '3', '4'].forEach(function (n, j) { sec[n] = t1 + j * 0.02; }); }
      if (id === 'nueve') { lin.push({ d: ['meridiano', K.CARA - 0.35, 1.2, K.NUCA + 0.35, 1.9], t: [t0, t1], c: C_NUCA, w: 3 }, { d: ['meridiano', K.CARA + 0.35, 1.2, K.NUCA - 0.35, 1.9], t: [t0, t1], c: C_NUCA, w: 3 }); }
      if (id === 'nuca') lin.push({ d: L.nuca, t: [t0, t1], c: C_NUCA, w: 4.5 });
      if (id === 'parietal') lin.push({ d: ['paralelo', 0.8, 0, 2 * PI], t: [t0, t1], c: '#7A4BD1', w: 3.5 });
      if (id === 'coronilla') lin.push({ d: ['paralelo', 0.4, 0, 2 * PI], t: [t0, t1], c: '#D9920E', w: 4 });
      if (id === 'frontal') lin.push({ d: ['paralelo', 0.8, K.CARA - 1.3, K.CARA + 1.3], t: [t0, t1], c: '#C96A1E', w: 4 });
      if (id === 'perfil') lin.push({ d: ['paralelo', 1.15, K.CARA - 1.5, K.CARA + 1.5], t: [t0, t1], c: '#B01E45', w: 4 });
      if (id === 'laterales') [K.IZQ, K.DER].forEach(function (q0) { lin.push({ d: ['paralelo', 1.3, q0 - 0.6, q0 + 0.6], t: [t0, t1], c: '#2C6FD1', w: 4 }); });
      if (id === 'mediaLuna') lin.push({ d: ['paralelo', 1.0, K.CARA - 1.3, K.CARA + 1.3], t: [t0, t1], c: '#C96A1E', w: 4 });
      if (id === 'herradura') lin.push({ d: ['paralelo', 0.85, K.CARA + 1.4, K.CARA + 2 * PI - 1.4], t: [t0, t1], c: '#B01E45', w: 4 });
      if (id === 'diagAdel' || id === 'diagAtras') { var s = id === 'diagAdel' ? 1 : -1; [0.6, 1.0, 1.4].forEach(function (h) { lin.push({ d: ['meridiano', K.NUCA + s * 0.2, h, K.NUCA + s * 0.2, h], t: [t0, t1], c: '#7A4BD1', w: 2.5 }); }); }
      if (id === 'ladrillo' || id === 'espiga') for (var f = 0; f < 4; f++) for (var c = 0; c < 4; c++) { var p0 = K.NUCA - 0.7 + c * 0.38 + (f % 2) * 0.19, th = 1.15 + f * 0.22; lin.push({ d: id === 'ladrillo' ? ['paralelo', th, p0, p0 + 0.3] : ['paralelo', th, p0, p0 + 0.3 * (f % 2 ? 1 : -1)], t: [t0 + f * 0.03, t1], c: '#7A4BD1', w: 3 }); }
      tr.push(K.rotulo((divs[i].n || id), C_RAYA, t0));
    });
    tr = dibujar(K, v, lin, sec, Z).concat(tr);
    return { v: v, tr: tr };
  }
  /* aplicación: pincel, papel, plancha, bigudíes… según la técnica */
  function escAplicar(K, t, modo, col, k) {
    var v = k % 2 ? 'lateral' : 'nuca', tr = [], filas = [1.85, 1.6, 1.35, 1.1], cols = v === 'nuca' ? [-0.75, -0.45, -0.15, 0.15, 0.45, 0.75] : [-0.6, -0.3, 0, 0.3];
    var base = v === 'nuca' ? K.NUCA : [K.NUCA + 0.75, K.NUCA - 0.75, K.DER - 0.4, K.IZQ + 0.4].filter(function (p) { return K.seVe(v, p, 1.4); })[0];
    if (base == null) base = K.NUCA;
    var nf = filas.length;
    filas.forEach(function (th, f) {
      var ta = 0.04 + f * 0.9 / nf, tb = ta + 0.9 / nf;
      tr = tr.concat(K.lineas(K.tramos(v, function (u) { return [base - 0.85 + u * 1.7, th]; }, 30), [ta, ta + 0.04], C_RAYA, 2));
      cols.forEach(function (d, j) {
        var ph = base + d, t0 = ta + 0.04 + j * 0.01, t1 = tb;
        function pincel(a, b, c, w, s0, s1) { var q = mecha(K, v, ph, th, a, b); if (q) tr.push(K.linea(q, [s0, s1], c, w)); return q; }
        if (modo === 'raiz') pincel(0, 0.1, col, 7, t0, t1);
        else if (modo === 'global') { var m3 = (t1 - t0) / 3; pincel(0, 0.12, col, 7, t0, t0 + m3); pincel(0.12, 0.6, col, 7, t0 + m3, t0 + 2 * m3); pincel(0.6, 1, col, 7, t0 + 2 * m3, t1); }
        else if (modo === 'decolor') { var m2 = (t1 - t0) / 2; pincel(0.12, 1, col, 7, t0, t0 + m2); pincel(0, 0.12, col, 7, t0 + m2, t1); }
        else if (modo === 'finas') { [-0.05, 0.05].forEach(function (e) { var q = mecha(K, v, ph + e, th, 0, 1); if (q) tr.push(K.linea(q, [t0, t1], col, 1.6)); }); }
        else if (modo === 'barrido') { var q2 = mecha(K, v, ph, th, 0.35, 1); if (q2) { var cj = caja(q2, 9); if (cj) tr.push(zona([q2[0], q2[1], cj[2], cj[3], cj[4], cj[5]], [t0, t1], col, 0.7)); }   /* triángulo: fino arriba, abierto en puntas */ }
        else if (modo === 'papel') { if (j % 2) return; var q3 = mecha(K, v, ph, th, 0.02, 0.85), bx = caja(q3, 14); if (bx) { tr.push(zona(bx, [t0, t0 + (t1 - t0) * 0.4], C_PAPEL, 0.9, C_PAPEL_B)); tr.push(K.linea(q3, [t0 + (t1 - t0) * 0.4, t0 + (t1 - t0) * 0.75], col, 6)); var half = caja(mecha(K, v, ph, th, 0.02, 0.45), 14); if (half) tr.push(zona(half, [t0 + (t1 - t0) * 0.75, t1], C_PAPEL, 0.95, C_PAPEL_B)); } }
        else if (modo === 'gorro') { var q4 = mecha(K, v, ph, th, 0, 0.12); if (q4) { tr.push(K.chapa([q4[0], q4[1]], '', C_PAPEL_B, t0)); tr.push(K.linea(q4, [t0 + 0.02, t1], col, 4)); } }
        else if (modo === 'producto') pincel(0.05, 1, col, 9, t0, t1);
        else if (modo === 'plancha') { var q5 = pincel(0.05, 1, col, 5, t0, t0 + (t1 - t0) * 0.4); if (q5) { var tp = t0 + (t1 - t0) * 0.45; tr.push(K.linea(q5, [tp, t1 - 0.01], C_PLANCHA, 9, { x: t1 }), K.linea(q5, [t1 - 0.01, t1], '#FFFFFF', 1.6)); } }
        else if (modo === 'bigudi') { if (j % 2) return; var q6 = mecha(K, v, ph, th, 0.1, 0.3), bg = caja(q6, 10); if (bg) { pincel(0.05, 0.3, col, 5, t0, t0 + (t1 - t0) * 0.4); tr.push(zona(bg, [t0 + (t1 - t0) * 0.4, t1], '#B07AA1', 0.85, '#7A4B6B')); } }
        else if (modo === 'secado') { var q7 = mecha(K, v, ph, th, 0.1, 1); if (q7) tr.push(K.linea(q7, [t0, t1], '#E58A3A', 2.5, { fl: 1 })); }
      });
    });
    var NOM = { raiz: 'Solo la raíz', global: 'Raíz → medios → puntas', decolor: 'Medios y puntas primero, la raíz al final', finas: 'Mechas finísimas', barrido: 'Barrido en V', papel: 'Papel de aluminio: se coloca, se aplica y se pliega', gorro: 'Mechas sacadas por el gorro', producto: 'Producto mecha a mecha', plancha: 'Producto y pasadas de plancha', bigudi: 'Bigudíes', secado: 'Dirección del secado' };
    tr.push(K.rotulo(NOM[modo] || 'Aplicación', col === '#E9C979' ? '#9A7B2E' : col, 0.04), K.rotulo('De la nuca hacia arriba', C_RAYA, 0.04));
    return { v: v, tr: tr };
  }
  function escCierre(K, agua, tit) {
    var v = 'lateral', tr = [], bs = [K.NUCA + 0.75, K.NUCA - 0.75, K.DER - 0.4, K.IZQ + 0.4].filter(function (q0) { return K.seVe(v, q0, 1.2); })[0]; if (bs == null) bs = K.NUCA;
    [-0.6, -0.3, 0, 0.3, 0.6].forEach(function (d, j) { var q = mecha(K, v, bs + d, 0.55, 0, 1); if (q) tr.push(K.linea(q, [0.05 + j * 0.08, 0.6 + j * 0.06], agua ? C_AGUA : '#E58A3A', agua ? 3 : 2.5, { fl: 1, d: agua ? 1 : 0 })); });
    tr.push(K.rotulo(tit || (agua ? 'Emulsión y aclarado' : 'Acabado'), agua ? C_AGUA : '#E58A3A', 0.05));
    return { v: v, tr: tr };
  }
  function deCerebro(K, id) {
    var CB = window.EU_CEREBRO, t = CB && CB.obtener(id); if (!t || !(t.pasos || []).length) return null;
    var modo = MODO[id] || 'global', col = tono(t, modo), divs = CB.divisiones ? CB.divisiones(id) : [], esc = [], na = 0;
    t.pasos.forEach(function (p, i) {
      var f = p.fase || 'aplicacion', a, tipo = 'cb' + i + '_' + f;
      if (f === 'divisiones') a = escDivisiones(K, t, divs.length ? divs : [{ id: 'cuatro', n: 'Cuatro secciones' }], 0.02, 0.8);
      else if (f === 'formula') {
        var fi = t.ficha || {}, pr = proporcion(t), tr = [];
        if (fi.formula) tr.push(K.rotulo('Fórmula: ' + fi.formula, C_RAYA, 0.02));
        if (fi.proporciones) tr.push(K.rotulo('Proporción: ' + fi.proporciones, C_RAYA, 0.12));
        if (fi.cantidades) tr.push(K.rotulo('Cantidad: ' + fi.cantidades, C_RAYA, 0.22));
        if (pr) { var W = 420, x0 = 430, y0 = 600, w1 = W * pr[0] / (pr[0] + pr[1]); tr.push(zona([x0, y0, x0 + w1, y0, x0 + w1, y0 + 44, x0, y0 + 44], [0.32, 0.6], col, 0.9, C_RAYA), zona([x0 + w1, y0, x0 + W, y0, x0 + W, y0 + 44, x0 + w1, y0 + 44], [0.6, 0.85], '#F4F7FA', 0.95, C_PAPEL_B), K.rotulo('Color ' + pr[0] + ' : ' + pr[1] + ' oxidante', col === '#E9C979' ? '#9A7B2E' : col, 0.32)); }
        a = { v: 'tres', tr: tr };
      }
      else if (f === 'tiempo') { var b = escAplicar(K, t, modo, col, 0); b.tr = b.tr.filter(function (s) { return s.k !== 'e' && s.c !== C_PLANCHA; }); b.tr.forEach(function (s) { s.t = [0, 0.08]; delete s.x; }); b.tr.push({ k: 'c', m: minutos(t, p), t: [0.1, 0.95], c: '#B01E45', s: 'Exposición' }, K.rotulo(minutos(t, p) ? minutos(t, p) + ' minutos de exposición' : 'Tiempo de exposición', '#B01E45', 0.1)); a = b; }
      else if (f === 'cierre') { a = escCierre(K, /aclar|lav|emulsi|agua|enjuag/i.test(p.n || '')); }
      else if (f === 'preparacion') {
        var fi2 = t.ficha || {}, tr3 = [], lava = /lav|champ/i.test(p.n || '');
        if (lava) { var e2 = escCierre(K, true, 'Preparación · lavado'); tr3 = e2.tr; a = { v: e2.v, tr: tr3 }; }
        else { tr3.push(K.rotulo('Preparación', C_RAYA, 0)); (fi2.herramientas || []).slice(0, 4).forEach(function (h, j) { tr3.push(K.rotulo('✔ ' + h, '#18906A', 0.1 + j * 0.12)); }); if ((fi2.seguridad || [])[0]) tr3.push(K.rotulo('Seguridad: ' + String(fi2.seguridad[0]).replace(/\.$/, ''), '#B01E45', 0.62)); a = { v: 'tres', tr: tr3 }; }
      }
      else a = escAplicar(K, t, modo, col, na++);
      if (p.e) a.tr.push(K.rotulo('Cuidado: ' + String(p.e).replace(/\.$/, ''), '#B01E45', 0.86));
      esc.push({ tipo: tipo, vista: a.v, t: p.t || 'Paso ' + (i + 1), texto: (p.n || '') + (p.e ? ' Cuidado: ' + p.e : ''), a: a });
    });
    return {
      R: { id: 'cb_' + id, n: t.n },
      escenas: esc,
      preguntas: (t.repaso || []).map(function (r) { return { e: r.p, o: r.o, c: r.c, x: r.x }; })
    };
  }
  function delCerebro() {
    var CB = window.EU_CEREBRO, out = []; if (!CB || !CB.familias) return out;
    CB.familias().forEach(function (fa) {
      if (!/^(color|mechas|hidratacion|queratina|quimicos|cabello)$/.test(fa.id)) return;
      CB.listar(fa.id).forEach(function (t0) { out.push({ id: 'cb_' + t0.id, n: t0.n, unidad: 'cb_' + t0.id, uso: [fa.id], fn: function (K) { return deCerebro(K, t0.id); }, fuente: 'Cerebro del Estudio · ' + fa.n }); });
    });
    return out;
  }

  /* catálogo de técnicas como datos (las siguientes entregas se añaden aquí) */
  var TECNICAS = [
    { id: 'p_seis', n: 'Seccionado en 4 y 6 secciones · escala 0–225°', unidad: 'pe_u_base', uso: ['corte', 'color', 'queratina'], fn: seis, fuente: 'Diagramas de Fátima · formas de dividir un cabello, tipos de diagrama 0–225' }
  ];
  function catalogo() { return TECNICAS.concat(delCerebro()); }
  function tecnica(id) { return catalogo().filter(function (t) { return t.id === id; })[0] || null; }
  function construir(id) { var t = tecnica(id); return t ? DG.construirCon(t.fn) : Promise.resolve(null); }
  function construirYa(id) { var t = tecnica(id); return t ? DG.construirConYa(t.fn) : null; }

  /* ───────── curso premium: una lección «Diagramación · técnica» en su unidad (Peluquería) ───────── */
  function lecciones(D, res, aviso) {
    var C = res && res.C, mat = C && C.cfg && C.cfg.materia; if (mat !== 'pelu' || !D || !D.modulos) return Promise.resolve(D);
    var tareas = catalogo().map(function (t) { return { t: t, M: D.modulos.filter(function (m) { return m.id === t.unidad; })[0] }; }).filter(function (x) { return x.M; });
    var i = 0;
    return new Promise(function (ok) {
      (function sig() {
        if (i >= tareas.length) return ok(D);
        var T = tareas[i++];
        if (aviso) aviso('Curso premium: técnica ' + T.t.n + '…');
        construir(T.t.id).then(function (E) {
          if (!E || T.M.lecciones.some(function (l) { return l.id === T.M.id + '__' + T.t.id; })) return;
          D.anim = D.anim || {}; D.img = D.img || {};
          Object.keys(E.fondos).forEach(function (v) { D.img['dg_' + v] = E.fondos[v]; });
          var esc = E.escenas.map(function (e) { var k = T.t.id + '_' + e.tipo; D.anim[k] = e.anim; return { tipo: 'paso', id: 'dg_' + e.vista, t: e.t, texto: e.texto, rot: [], anim: k }; });
          var ult = esc[esc.length - 1].id;
          E.preguntas.forEach(function (q) {
            esc.push({ tipo: 'pregunta', id: ult, t: 'Repaso', texto: 'Antes de seguir, piensa: ' + q.e, rot: [], q: { e: q.e, o: q.o, c: q.c }, sol: 'La respuesta es: ' + q.o[q.c] + '.' + (q.x ? ' ' + q.x : '') });
            if (T.M.test && !T.M.test.some(function (x) { return x.e === q.e; })) T.M.test.push({ e: q.e, o: q.o, c: q.c });
          });
          var pag = (T.M.lecciones[0] || {}).pag;
          T.M.lecciones.splice(0, 0, { id: T.M.id + '__' + T.t.id, t: 'Diagramación · ' + E.R.n, pag: pag, video: 1, escenas: esc });
        }).catch(function (er) { console.warn('Particiones', T.t.id, er); }).then(function () { setTimeout(sig, 0); });
      })();
    });
  }
  var CA = window.EU_CURSO_ANIM;
  if (CA && CA.enriquecer && !CA.enriquecer._part) {
    var enr = CA.enriquecer;
    CA.enriquecer = function (D, res, aviso) { return Promise.resolve(enr.apply(this, arguments)).then(function (D2) { return lecciones(D2 || D, res, aviso); }); };
    CA.enriquecer._part = 1;
  }

  window.EU_PARTICIONES = { TECNICAS: TECNICAS, catalogo: catalogo, tecnica: tecnica, construir: construir, construirYa: construirYa, lecciones: lecciones };
})();
