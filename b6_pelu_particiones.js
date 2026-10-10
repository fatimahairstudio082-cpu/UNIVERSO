/* b6_pelu_particiones.js — particiones y técnicas de Peluquería como DATOS (window.EU_PARTICIONES).
   Cada técnica sale de los diagramas de Fátima (carpeta «para mi clauidia» de su Drive) y se anima con el motor de
   diagramación que ya existe (EU_DIAGRAMA, sobre el maniquí de Guías 3D): mismos trazos con tiempos, mismo reproductor,
   mismos fondos. Así la técnica sale sola en el curso premium (lección «Diagramación · …» en la unidad pe_u_base,
   con voz frase a frase y grabable) sin tocar b6_guias_3d.js, b6_divisiones.js, b6_estudios.js ni b6_cerebro.js.
   Entrega 1: seccionado en 4 y 6 secciones (raya central medida desde la nariz, de oreja a oreja por arriba,
   segunda línea de oreja a oreja en la nuca) y escala de elevación 0–225° (225° = 45° sobredirigido).
   Numeración de sus diagramas: 1 delante derecha · 2 delante izquierda · 3 atrás izquierda · 4 atrás derecha ·
   5 nuca izquierda · 6 nuca derecha. Cargar después de b6_curso_animado.js.
   Entrega 3 (carpeta «para mi clauidia (1)»): particiones horizontales con pivote en la coronilla y sobreproyección
   (melena de color con perímetro en picos), Long Layers (proyección a un punto encima de la cabeza, marco en V, secciones
   por colores) y Pixie (abanico de elevaciones, flequillo en triángulo asimétrico, nuca en abanico y espiga). */
(function () {
  'use strict';
  /* modo revisión de Fátima: las notas «a validar» solo se ven si ella lo activa (localStorage eu_revision = 'si'); el alumno nunca las ve */
  function rev() { try { return localStorage.getItem('eu_revision') === 'si'; } catch (e) { return false; } }
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
  /* Fátima, 10-10-2026 · mechones que se SACAN de la sección, como en el motor de corte.
     En colorimetría el mechón se eleva a 90° para sacar las líneas: lo que se aprende son las divisiones del cráneo
     y la división del propio mechón. Balayage: zigzag grande en el cráneo y de cada pico sale un mechón en triángulo;
     el producto entra desde el arranque hasta las puntas. Mechas y babylights: tejido en zigzag, papel debajo y producto.
     Cada capa, de la nuca hacia arriba, con su número; al terminar el mechón baja con su aclarado.
     La cantidad de mechones y la profundidad las decide la clienta: aquí es un ejemplo de tres capas. */
  var C_HALO = '#FFFFFF', C_NAT = '#4A2E1E', ELEV_COLOR = 90, ARRANQUE = 0.5, C_CAPA = ['#C0392B', '#2C6FD1', '#18906A'];
  function contornoM(K, v, pts, t, c, w) { var tr = []; for (var i = 0; i < pts.length - 1; i++) tr = tr.concat(K.lineas(K.tramos(v, K.recta(pts[i], pts[i + 1]), 14), t, c, w)); return tr; }
  function mechonFuera(K, v, raices, phc, thc, g, ta, tb, desde, papel, col) {
    var tr = [], c0 = K.P(phc, thc), tl = ta + (tb - ta) * 0.18, tu = ta + (tb - ta) * 0.5, ext = { x: tb, lev: 1 }, fin = [];
    for (var k = 0; k <= 5; k++) fin.push(c0.clone().add(K.dirElev(phc, thc, g * k / 5).multiplyScalar(0.72)));
    if (papel) {
      var a0 = K.pr(v, c0), b0 = K.pr(v, fin[5]), dx = b0[0] - a0[0], dy = b0[1] - a0[1], l = Math.sqrt(dx * dx + dy * dy) || 1, nx = -dy / l * 26, ny = dx / l * 26;
      tr.push(Object.assign(zona([a0[0] + nx, a0[1] + ny, b0[0] + nx, b0[1] + ny, b0[0] - nx, b0[1] - ny, a0[0] - nx, a0[1] - ny], [tu - 0.02, tu + 0.04], C_PAPEL, 0.95, C_PAPEL_B), ext));
    }
    raices.forEach(function (r) {
      var a = K.P(r[0], r[1]), ks = fin.map(function (b) { return [].concat(K.pr(v, a), K.pr(v, a.clone().lerp(b, 0.97))); }), b5 = a.clone().lerp(fin[5], 0.97);
      tr.push(K.mechon(ks, [tl, tu], C_HALO, 5.4, ext), K.mechon(ks, [tl, tu], C_NAT, 2.2, ext));
      tr.push(K.linea([].concat(K.pr(v, a.clone().lerp(b5, desde)), K.pr(v, b5)), [tu + 0.02, tb - 0.05], '#F2C14E', 3.2, ext));
    });
    var q = K.pr(v, fin[5]), qr = K.pr(v, c0);
    tr.push(Object.assign({ k: 'n', x: q[0], y: q[1], s: '', c: col, t: [tl, 1] }, ext), Object.assign({ k: 'n', x: qr[0] + 34, y: qr[1] - 4, s: g + '°', c: col, t: [tu, 1] }, ext));
    return tr;
  }
  function escMechones(K, modo, col, t, o) {
    o = o || {};
    var v = o.profundo ? 'arriba' : 'nuca', tr = [], filas = o.profundo ? [1.5, 1.1, 0.72] : [1.7, 1.4, 1.1], n = filas.length, bal = modo === 'barrido', papel = !bal, fina = modo === 'finas';
    var AMP = o.profundo ? 0.28 : 0.22, ANCHO = o.profundo ? 0.3 : 0.2;
    var desde = bal ? ARRANQUE : 0;
    filas.forEach(function (th, f) {
      var ta = 0.03 + f * 0.95 / n, tb = ta + 0.95 / n, cc = C_CAPA[f % 3], ts = [ta, ta + (tb - ta) * 0.16], ult = f === n - 1;
      if (bal) {
        /* zigzag grande en el cráneo: picos hacia arriba; de cada pico sale un mechón en triángulo */
        var picos = [K.NUCA - 0.45, K.NUCA, K.NUCA + 0.45], zz = [[K.NUCA - 0.7, th]];
        picos.forEach(function (ph) { zz.push([ph - ANCHO, th], [ph, th - AMP], [ph + ANCHO, th]); }); zz.push([K.NUCA + 0.7, th]);
        tr = tr.concat(contornoM(K, v, zz, ts, cc, 3));
        [picos[0], picos[2]].forEach(function (ph) {
          if (!K.seVe(v, ph, th - 0.1)) return; var r = [];
          var aw = ANCHO * 0.9, ah = AMP * 0.9;
          for (var i = 0; i <= 6; i++) { var u = i / 6; r.push(u < 0.5 ? [ph - aw + aw * u * 2, th - ah * u * 2 + 0.01] : [ph + aw * (u - 0.5) * 2, th - ah + ah * (u - 0.5) * 2 + 0.01]); }
          tr = tr.concat(mechonFuera(K, v, r, ph, th - AMP * 0.4, ELEV_COLOR, ta, tb, desde, false, cc));
        });
      } else {
        /* tejido en zigzag dentro de la sección; el papel va debajo del mechón */
        [K.NUCA - 0.42, K.NUCA + 0.42].forEach(function (ph) {
          if (!K.seVe(v, ph, th - 0.06)) return; var w = 0.22, dn = fina ? 8 : 5, r = [], z = [];
          tr = tr.concat(contornoM(K, v, [[ph - w, th - 0.13], [ph + w, th - 0.13], [ph + w, th], [ph - w, th], [ph - w, th - 0.13]], ts, cc, 1.8));
          for (var i = 0; i <= dn * 2; i++) { var pz = [ph - w + 2 * w * i / (dn * 2), i % 2 ? th - 0.11 : th - 0.02]; z.push(pz); if (i % 2) r.push(pz); }
          tr = tr.concat(contornoM(K, v, z, ts, cc, fina ? 1.8 : 2.6));
          tr = tr.concat(mechonFuera(K, v, r, ph, th - 0.07, ELEV_COLOR, ta, tb, desde, papel, cc));
        });
      }
      /* lo ya trabajado baja y queda con su aclarado */
      [K.NUCA - 0.45, K.NUCA + 0.45].forEach(function (ph) { [-0.06, 0, 0.06].forEach(function (e) { var q = mecha(K, v, ph + e, th, bal ? desde * 0.6 : 0, 1); if (q) tr.push(K.linea(q, [tb - 0.05, tb], col === '#E9C979' ? '#F2C14E' : col, 3)); }); });
      tr.push(K.rotulo('Capa ' + (f + 1) + ' · mechón a ' + ELEV_COLOR + '°' + (bal ? ' · arranque ' + Math.round(desde * 100) + ' %' : ''), cc, ta, ult ? {} : { x: tb }));
    });
    var NOMM = { barrido: 'Balayage · zigzag grande en el cráneo, de cada pico sale el mechón', papel: 'Mechas · tejido en zigzag, papel debajo y producto', finas: 'Babylights · tejido finísimo, papel debajo y producto' };
    tr.push(K.rotulo(o.profundo ? 'Balayage profundo · empieza a unos 5 cm del cuello, zigzag grande' : NOMM[modo], '#1F1B18', 0), K.rotulo(bal ? 'El arranque (25, 50 o 75 %) y la cantidad los decide la clienta' : 'De la nuca hacia arriba · la cantidad la decide la clienta', C_RAYA, 0));
    var cant = t && t.ficha && t.ficha.cantidades; if (cant) tr.push(K.rotulo('Producto: ' + cant, '#9A7B2E', 0));
    return { v: v, tr: tr };
  }
  /* Fátima, 10-10-2026 · mechas universales con papel de aluminio, por el lateral.
     Desde la raya de atrás, líneas en diagonal de un centímetro (un dedo o menos) de la nuca a la coronilla.
     En una línea se hace el zigzag pequeño, se saca el mechón a 90°, se coloca el producto y el papel (en plantilla).
     La línea siguiente se deja libre, sin zigzag ni papel. Y así, alternando, hasta la coronilla: los papeles quedan montados. */
  function escUniversales(K, t, col) {
    var v = 'tres', s = K.seVe(v, K.NUCA + 0.9, 1.2) ? 1 : -1, tr = [], n = 12, th0 = 1.92, th1 = 0.62, d = (th0 - th1) / (n - 1), con = 0, nCon = Math.ceil(n / 2);
    var cP = col === '#E9C979' ? '#F2C14E' : col;
    function lin(th) { return function (u) { return [K.NUCA + s * 1.25 * u, th + 0.32 * u]; }; }
    tr = tr.concat(K.lineas(K.tramos(v, function (u) { return [K.NUCA, 0.45 + u * 1.6]; }, 30), [0, 0.04], C_RAYA, 2.4));
    for (var i = 0; i < n; i++) {
      var th = th0 - i * d, ta = 0.05 + i * 0.93 / n, tb = ta + 0.93 / n, dt = tb - ta, sac = i % 2 === 0, cc = sac ? C_CAPA[con % 3] : '#8E847A';
      tr = tr.concat(K.lineas(K.tramos(v, lin(th), 20), [ta, ta + dt * 0.15], sac ? cc : '#8E847A', sac ? 2.2 : 1.6, sac ? {} : { d: 1 }));
      if (!sac) continue;
      con++;
      /* zigzag pequeño sobre la línea: un centímetro */
      var z = [], r = [];
      for (var k = 0; k <= 16; k++) { var u = 0.06 + 0.8 * k / 16, q = lin(th)(u); z.push([q[0], q[1] - (k % 2 ? 0.035 : 0)]); if (k % 2) r.push([q[0], q[1] - 0.035]); }
      for (var j = 0; j < z.length - 1; j++) tr = tr.concat(K.lineas(K.tramos(v, K.recta(z[j], z[j + 1]), 3), [ta + dt * 0.1, ta + dt * 0.22], cc, 1.8));
      /* el mechón se saca a 90°, producto; después se coloca el papel y queda montado */
      var mc = lin(th)(0.46), ext = { x: ta + dt * 0.78, lev: 1 }, c0 = K.P(mc[0], mc[1] - 0.02), fin = [];
      for (var k2 = 0; k2 <= 5; k2++) fin.push(c0.clone().add(K.dirElev(mc[0], mc[1], 90 * k2 / 5).multiplyScalar(0.55)));
      r.forEach(function (rr) { var a = K.P(rr[0], rr[1]), ks = fin.map(function (b) { return [].concat(K.pr(v, a), K.pr(v, a.clone().lerp(b, 0.97))); });
        tr.push(K.mechon(ks, [ta + dt * 0.22, ta + dt * 0.42], C_HALO, 4.6, ext), K.mechon(ks, [ta + dt * 0.22, ta + dt * 0.42], C_NAT, 1.8, ext));
        tr.push(K.linea([].concat(K.pr(v, a), K.pr(v, a.clone().lerp(fin[5], 0.97))), [ta + dt * 0.44, ta + dt * 0.62], cP, 2.6, ext)); });
      var e0 = K.seVe(v, lin(th)(0.08)[0], lin(th)(0.08)[1]) ? K.pr(v, K.P.apply(null, lin(th)(0.08))) : null, e1 = K.seVe(v, lin(th)(0.86)[0], lin(th)(0.86)[1]) ? K.pr(v, K.P.apply(null, lin(th)(0.86))) : null;
      if (e0 && e1) {
        var dx = e1[0] - e0[0], dy = e1[1] - e0[1], L = Math.sqrt(dx * dx + dy * dy) || 1, nx = -dy / L, ny = dx / L; if (ny < 0) { nx = -nx; ny = -ny; }
        var H = 46, papel = [e0[0], e0[1], e1[0], e1[1], e1[0] + nx * H, e1[1] + ny * H, e0[0] + nx * H, e0[1] + ny * H];
        tr.push(zona(papel, [ta + dt * 0.62, ta + dt * 0.8], C_PAPEL, 0.96, C_PAPEL_B));
        for (var w = 1; w <= 3; w++) { var f0 = w / 4; tr.push(K.linea([e0[0] + dx * f0 + nx * 6, e0[1] + dy * f0 + ny * 6, e0[0] + dx * f0 + nx * (H - 6), e0[1] + dy * f0 + ny * (H - 6)], [ta + dt * 0.8, tb], cP, 2)); }
      }
      tr.push(Object.assign({ k: 'n', x: K.pr(v, K.P(mc[0], mc[1]))[0], y: K.pr(v, K.P(mc[0], mc[1]))[1], s: String(con), c: cc, t: [ta + dt * 0.15, 1] }));
      tr.push(K.rotulo('Línea ' + (i + 1) + ' · zigzag pequeño, mechón a 90°, producto y papel', cc, ta, con < nCon ? { x: tb } : {}));
      if (i + 1 < n) tr.push(K.rotulo('Línea ' + (i + 2) + ' · se deja libre: sin zigzag ni papel', '#8E847A', tb - dt * 0.05, { x: tb + 0.93 / n }));
    }
    var cant = t && t.ficha && t.ficha.cantidades;
    tr.push(K.rotulo('Mechas universales · líneas en diagonal de 1 cm, de la nuca a la coronilla', '#1F1B18', 0));
    if (cant) tr.push(K.rotulo('Producto: ' + cant, '#9A7B2E', 0));
    return { v: v, tr: tr };
  }
  /* Fátima, 10-10-2026 · balayage por el frente: en el frente la división es un cuadrado; dentro, el zigzag,
     el mechón a 90° y el producto desde el arranque hasta las puntas. */
  function escBalFrente(K, t, col) {
    var v = 'frente', tr = [], ph0 = K.CARA - 0.34, ph1 = K.CARA + 0.34, thA = 0.5, thB = 1.05, filas = [0.95, 0.78, 0.62];
    tr = tr.concat(contornoM(K, v, [[ph0, thA], [ph1, thA], [ph1, thB], [ph0, thB], [ph0, thA]], [0.02, 0.14], '#C0392B', 3));
    filas.forEach(function (th, f) {
      var ta = 0.16 + f * 0.82 / filas.length, tb = ta + 0.82 / filas.length, cc = C_CAPA[f % 3], z = [];
      for (var k = 0; k <= 10; k++) z.push([ph0 + (ph1 - ph0) * (0.05 + 0.9 * k / 10), th - (k % 2 ? 0.06 : 0)]);
      tr = tr.concat(contornoM(K, v, z, [ta, ta + (tb - ta) * 0.16], cc, 2.2));
      var q = K.pr(v, K.P(K.CARA, th - 0.03)); tr.push({ k: 'n', x: q[0], y: q[1], s: String(f + 1), c: cc, t: [ta + (tb - ta) * 0.16, 1] });
      tr.push(K.rotulo('Frente · línea ' + (f + 1) + ' · zigzag dentro del cuadrado; el mechón sale a 90° con el producto', cc, ta, f < filas.length - 1 ? { x: tb } : {}));
    });
    var cant = t && t.ficha && t.ficha.cantidades;
    tr.push(K.rotulo('Balayage · en el frente la división es un cuadrado', '#1F1B18', 0));
    if (cant) tr.push(K.rotulo('Producto: ' + cant, '#9A7B2E', 0));
    return { v: v, tr: tr };
  }
  /* Fátima, 10-10-2026 · la misma técnica por el LATERAL (balayage y mechas con papel).
     Horizontal: líneas de medio centímetro de la oreja hacia el rostro; una con zigzag pequeño, mechón a 90°, producto
     y papel; la siguiente libre. Vertical: líneas verticales solo en el lateral, papel enrollado en vertical, sin pasar
     la línea de oreja a oreja y sin tocar la coronilla. El arranque lo decide la clienta: 10 % de la raíz para líneas
     bien profundas; 25, 45 o 50 %; 65 % para iluminaciones. Después, cómo queda: el aclarado resalta en blanco
     difuminado sobre el cabello oscuro. */
  function lineaLat(vert, i, n) {
    /* DER es la oreja que ven las vistas 'tres' y 'lateral'; hacia el rostro el ángulo baja (CARA = π/2) */
    if (vert) { var ph = Math.PI - 0.08 - i * (0.82 / (n - 1)); return function (u) { return [ph, 0.98 + u * 0.66]; }; }
    var th = 1.0 + i * (0.58 / (n - 1)); return function (u) { return [Math.PI - 0.04 - u * 0.86, th]; };
  }
  function escLatAccion(K, t, col, vert, desde) {
    /* de lado: se ven la oreja, las líneas hacia el rostro, el zigzag y el papel */
    var v = 'lateral', tr = [], n = vert ? 9 : 11, con = 0, nCon = Math.ceil(n / 2), cP = '#F4D27A';
    /* la línea de oreja a oreja (no se pasa): sube de una oreja, cruza por arriba y baja a la otra */
    [Math.PI, 0].forEach(function (ph) { tr = tr.concat(K.lineas(K.tramos(v, function (u) { return [ph, 0.02 + u * 1.58]; }, 30), [0, 0.05], '#2C6FD1', 3)); });
    for (var i = 0; i < n; i++) {
      var L = lineaLat(vert, i, n), ta = 0.06 + i * 0.92 / n, tb = ta + 0.92 / n, dt = tb - ta, sac = i % 2 === 0, cc = sac ? C_CAPA[con % 3] : '#8E847A';
      tr = tr.concat(K.lineas(K.tramos(v, L, 20), [ta, ta + dt * 0.15], cc, sac ? 2.2 : 1.5, sac ? {} : { d: 1 }));
      if (!sac) continue;
      con++;
      var z = [], r = [];
      for (var k = 0; k <= 18; k++) { var q = L(0.04 + 0.86 * k / 18), off = k % 2 ? 0.03 : 0; z.push(vert ? [q[0] - off, q[1]] : [q[0], q[1] - off]); if (k % 2) r.push(z[z.length - 1]); }
      for (var j = 0; j < z.length - 1; j++) tr = tr.concat(K.lineas(K.tramos(v, K.recta(z[j], z[j + 1]), 3), [ta + dt * 0.1, ta + dt * 0.22], cc, 1.7));
      var mc = L(0.45), ext = { x: ta + dt * 0.8, lev: 1 }, c0 = K.P(mc[0], mc[1]), fin = [];
      for (var k2 = 0; k2 <= 5; k2++) fin.push(c0.clone().add(K.dirElev(mc[0], mc[1], 90 * k2 / 5).multiplyScalar(0.6)));
      r.forEach(function (rr) { if (!K.seVe(v, rr[0], rr[1])) return; var a = K.P(rr[0], rr[1]), b5 = a.clone().lerp(fin[5], 0.97), ks = fin.map(function (b) { return [].concat(K.pr(v, a), K.pr(v, a.clone().lerp(b, 0.97))); });
        tr.push(K.mechon(ks, [ta + dt * 0.22, ta + dt * 0.42], C_HALO, 4.6, ext), K.mechon(ks, [ta + dt * 0.22, ta + dt * 0.42], C_NAT, 1.8, ext));
        tr.push(K.linea([].concat(K.pr(v, a.clone().lerp(b5, desde)), K.pr(v, b5)), [ta + dt * 0.44, ta + dt * 0.62], cP, 2.6, ext)); });
      /* el papel: en plantilla (horizontal) o enrollado en vertical; queda puesto */
      var p0 = L(0.06), p1 = L(0.86);
      if (K.seVe(v, p0[0], p0[1]) && K.seVe(v, p1[0], p1[1])) {
        var e0 = K.pr(v, K.P(p0[0], p0[1])), e1 = K.pr(v, K.P(p1[0], p1[1])), dx = e1[0] - e0[0], dy = e1[1] - e0[1], Ln = Math.sqrt(dx * dx + dy * dy) || 1, nx = -dy / Ln, ny = dx / Ln, H = vert ? 12 : 30;
        if (!vert && ny < 0) { nx = -nx; ny = -ny; }
        var papel = vert ? [e0[0] + nx * H, e0[1] + ny * H, e1[0] + nx * H, e1[1] + ny * H, e1[0] - nx * H, e1[1] - ny * H, e0[0] - nx * H, e0[1] - ny * H] : [e0[0], e0[1], e1[0], e1[1], e1[0] + nx * H, e1[1] + ny * H, e0[0] + nx * H, e0[1] + ny * H];
        tr.push(zona(papel, [ta + dt * 0.62, ta + dt * 0.8], C_PAPEL, 0.96, C_PAPEL_B));
        if (vert) [-0.5, 0, 0.5].forEach(function (f) { tr.push(K.linea([e0[0] + nx * H * f, e0[1] + ny * H * f, e1[0] + nx * H * f, e1[1] + ny * H * f], [ta + dt * 0.8, tb], C_PAPEL_B, 1.2)); });
      }
      var qn = K.pr(v, K.P(mc[0], mc[1])); tr.push({ k: 'n', x: qn[0], y: qn[1], s: String(con), c: cc, t: [ta + dt * 0.15, 1] });
      tr.push(K.rotulo('Línea ' + (i + 1) + ' · zigzag pequeño, mechón a 90°, producto y papel' + (vert ? ' enrollado' : ''), cc, ta, con < nCon ? { x: tb } : {}));
      if (i + 1 < n) tr.push(K.rotulo('Línea ' + (i + 2) + ' · libre: sin zigzag ni papel', '#8E847A', tb - dt * 0.05, { x: tb + 0.92 / n }));
    }
    var cant = t && t.ficha && t.ficha.cantidades;
    tr.push(K.rotulo(vert ? 'Lateral en vertical · sin pasar la línea de oreja a oreja ni tocar la coronilla' : 'Lateral · líneas de medio centímetro de la oreja hacia el rostro', '#1F1B18', 0),
      K.rotulo('Arranque ' + Math.round(desde * 100) + ' %' + (desde <= 0.15 ? ' · líneas bien profundas' : desde >= 0.6 ? ' · iluminaciones' : '') + (cant ? ' · producto ' + cant : ''), '#9A7B2E', 0));
    return { v: v, tr: tr };
  }
  function escLatQueda(K, vert, desde) {
    /* cómo queda: primero el cabello oscuro, luego el aclarado en blanco difuminado desde el arranque hasta las puntas */
    var v = 'lateral', tr = [], n = vert ? 9 : 11, ph, i, j;
    /* el cabello oscuro cubre todo el lado que se ve, de atrás hasta delante de la oreja (sin tapar la cara) */
    for (ph = Math.PI + 1.0; ph > Math.PI - 0.75; ph -= 0.03) { var q = mecha(K, v, ph, 0.35, 0, 1); if (q) tr.push(K.linea(q, [0.02, 0.3], '#3A2418', 4.2)); }
    for (i = 0; i < n; i += 2) {
      var L = lineaLat(vert, i, n), t0 = 0.32 + 0.6 * i / n;
      for (j = 0; j < 5; j++) {
        var pt = L(0.1 + 0.16 * j); if (pt[0] < Math.PI - 0.75) continue; var q2 = mecha(K, v, pt[0], pt[1], desde, 1); if (!q2) continue;
        tr.push(K.linea(q2, [t0, t0 + 0.2], 'rgba(255,250,235,0.45)', 10), K.linea(q2, [t0 + 0.02, t0 + 0.22], '#F7E6BA', 3.4));
      }
    }
    tr.push(K.rotulo(vert ? 'Cómo queda · lateral en vertical' : 'Cómo queda · lateral en horizontal', '#1F1B18', 0),
      K.rotulo('El aclarado resalta en blanco desde el ' + Math.round(desde * 100) + ' % hasta las puntas', '#9A7B2E', 0.3));
    return { v: v, tr: tr };
  }
  /* Fátima, 10-10-2026 · cómo queda de atrás y de frente (la vuelta a la cabeza): el cabello oscuro y los mechones
     aclarados en blanco difuminado, desde el arranque hasta las puntas. De frente el cabello no tapa la cara. */
  function escQuedaVista(K, v, desde, tit) {
    var tr = [], ph, frente = v === 'frente', C0 = frente ? K.CARA : K.NUCA, luces;
    for (ph = C0 - 1.75; ph <= C0 + 1.75; ph += 0.03) {
      var d = Math.abs(ph - C0), q = frente && d < 0.5 ? mecha(K, v, ph, 0.22, 0, 0.32) : mecha(K, v, ph, 0.3, 0, 1);
      if (q) tr.push(K.linea(q, [0.02, 0.3], '#3A2418', 4.2));
    }
    luces = frente ? [-1.3, -1.0, -0.75, -0.55, 0.55, 0.75, 1.0, 1.3] : [-1.2, -0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9, 1.2];
    luces.forEach(function (o, i) {
      var t0 = 0.34 + 0.55 * i / luces.length;
      [-0.035, 0, 0.035].forEach(function (e) { var q2 = mecha(K, v, C0 + o + e, 0.3, desde, 1); if (q2) tr.push(K.linea(q2, [t0, t0 + 0.2], 'rgba(255,250,235,0.45)', 10), K.linea(q2, [t0 + 0.02, t0 + 0.22], '#F7E6BA', 3.4)); });
    });
    tr.push(K.rotulo(tit, '#1F1B18', 0), K.rotulo('Los mechones aclarados resaltan en blanco desde el ' + Math.round(desde * 100) + ' % hasta las puntas', '#9A7B2E', 0.3));
    return { v: v, tr: tr };
  }
  /* Fátima, 10-10-2026 · ALISADO a 0°: antes el cabello ondulado; divisiones finas de abajo arriba; en queratina y
     derriz el producto mechón a mechón; la plancha (queratina, planchado) baja a 0° prensando y estirando hacia abajo y
     detrás de ella el cabello queda liso. En el derriz no hay calor (ficha del Cerebro: «Ambiente. Nunca calor»):
     el mechón se estira a 0° con el peine. Al final, el después: todo liso y con brillo. */
  function ondas(q, amp, fase) {
    var o = [], n = q.length / 2, i;
    for (i = 0; i < n; i++) {
      var a = Math.max(0, i - 1), b = Math.min(n - 1, i + 1), dx = q[b * 2] - q[a * 2], dy = q[b * 2 + 1] - q[a * 2 + 1], L = Math.sqrt(dx * dx + dy * dy) || 1, u = i / (n - 1);
      var off = amp * Math.min(1, u * 1.6) * Math.sin(u * 15 + fase);
      o.push(Math.round((q[i * 2] - dy / L * off) * 10) / 10, Math.round((q[i * 2 + 1] + dx / L * off) * 10) / 10);
    }
    return o;
  }
  function puntoQ(q, u) { var n = q.length / 2 - 1, f = Math.max(0, Math.min(n, u * n)), i = Math.min(n - 1, Math.floor(f)), w = f - i; return [q[i * 2] + (q[i * 2 + 2] - q[i * 2]) * w, q[i * 2 + 1] + (q[i * 2 + 3] - q[i * 2 + 1]) * w]; }
  function escAlisado(K, t, v, prod, plancha) {
    var tr = [], C0 = v === 'nuca' ? K.NUCA : K.DER, filas = [1.8, 1.6, 1.4, 1.2, 1.0, 0.8], nf = filas.length, T0 = 0.07, NAT = '#3A2418';
    var phs = []; for (var d = -1.05; d <= 1.06; d += 0.09) if (K.seVe(v, C0 + d, 1.2)) phs.push(C0 + d);
    var cP = prod === 'queratina' ? 'rgba(236,226,206,0.75)' : 'rgba(214,224,236,0.75)';
    filas.forEach(function (th, f) {
      var ta = T0 + f * (0.85 - T0) / nf, tb = ta + (0.85 - T0) / nf, dt = tb - ta, medio = null;
      tr = tr.concat(K.lineas(K.tramos(v, function (u) { return [phs[0] + (phs[phs.length - 1] - phs[0]) * u, th - 0.03]; }, 30), [ta, ta + dt * 0.1], '#FFFFFF', 1.4));
      phs.forEach(function (ph, j) {
        var q = mecha(K, v, ph, th, 0, 1); if (!q) return;
        var w = ondas(q, 9, ph * 7 + th * 3);
        tr.push(K.linea(w, [0, T0], NAT, 3.2, { x: ta + dt * 0.62 }));
        if (prod) tr.push(K.linea(w, [ta + dt * 0.12, ta + dt * 0.3], cP, 5, { x: ta + dt * 0.62 }));
        tr.push(K.linea(q, [ta + dt * 0.36, ta + dt * 0.6], NAT, 3.2));
        tr.push(K.linea(q.slice(Math.floor(q.length * 0.1 / 2) * 2), [ta + dt * 0.62, ta + dt * 0.8], 'rgba(255,240,220,0.45)', 1.3));
        if (j === Math.floor(phs.length / 2)) medio = q;
      });
      if (medio) {
        var fr = []; for (var k = 0; k <= 8; k++) { var u0 = k / 8 * 0.85, a = puntoQ(medio, u0), b = puntoQ(medio, u0 + 0.13); fr.push([a[0], a[1], b[0], b[1]]); }
        tr.push(K.mechon(fr, [ta + dt * 0.36, ta + dt * 0.6], plancha ? '#2B2A2E' : '#E2B897', plancha ? 11 : 14, { x: ta + dt * 0.64 }));
      }
      tr.push(K.rotulo('División ' + (f + 1) + (prod ? ' · producto mechón a mechón' : '') + (plancha ? ' · plancha a 0°, se prensa y se estira hacia abajo' : ' · se peina y se prensa con la mano a 0°, sin calor'), C_CAPA[f % 3], ta, f < nf - 1 ? { x: tb } : { x: 0.86 }));
    });
    tr.push(K.rotulo('Antes: cabello ondulado', '#8E847A', 0, { x: T0 + 0.04 }), K.rotulo('Después: cabello liso', '#18906A', 0.86));
    if (prod === 'derriz') tr.push(K.rotulo('Si el cabello se pone frágil o chicloso: retirar el producto de inmediato', '#B01E45', 0.3), K.rotulo('Se busca quitar volumen al cabello abundante', '#18906A', 0.86));
    if (prod === 'queratina') tr.push(K.rotulo('Se deja de 3 días a una semana · dura de 3 a 6 meses según el producto', '#18906A', 0.9));
    var cant = t && t.ficha && t.ficha.cantidades; if (cant && prod) tr.push(K.rotulo('Producto: ' + cant, '#9A7B2E', 0));
    return { v: v, tr: tr };
  }
  /* Fátima, 10-10-2026 · DECOLORACIÓN por capas: del frente hacia atrás, en cada capa el producto desde unos 5 cm de la
     raíz hasta las puntas y papel de aluminio. Sobre cabello negro el fondo sube a amarillo; se neutraliza con violeta
     (curso: «Amarillo: neutralizar con violeta. Matizadores violeta o tintes .2»). */
  var NEGRO = '#161112', AMARILLO = '#E6C24A', VIOLETA = '#7B4FA0', PERLA = '#EAE4D6', NARANJA = '#D9822B', AZUL = '#3F6FB5', CENIZA = '#C9C2B4';
  function escDecoCapas(K, t) {
    var v = 'lateral', tr = [], phs = []; for (var d = -1.0; d <= 1.3; d += 0.115) if (K.seVe(v, K.DER - d, 1.0)) phs.push(K.DER - d);
    phs.sort(function (a, b) { return Math.abs(b - K.CARA) - Math.abs(a - K.CARA); }).reverse();
    var n = phs.length, desde = 0.25;
    phs.forEach(function (ph) { var q = mecha(K, v, ph, 0.35, 0, 1); if (q) tr.push(K.linea(q, [0, 0.05], NEGRO, 4)); });
    phs.forEach(function (ph, i) {
      var ta = 0.06 + i * 0.86 / n, tb = ta + 0.86 / n, dt = tb - ta, q = mecha(K, v, ph, 0.35, desde, 1); if (!q) return;
      tr = tr.concat(K.lineas(K.tramos(v, function (u) { return [ph + 0.05, 0.3 + u * 1.2]; }, 16), [ta, ta + dt * 0.15], '#FFFFFF', 1.4, { x: tb }));
      tr.push(K.linea(q, [ta + dt * 0.15, ta + dt * 0.45], 'rgba(240,236,228,0.9)', 5));
      var a = puntoQ(q, 0), b = puntoQ(q, 1), dx = b[0] - a[0], dy = b[1] - a[1], L = Math.sqrt(dx * dx + dy * dy) || 1, nx = -dy / L * 9, ny = dx / L * 9;
      tr.push(zona([a[0] + nx, a[1] + ny, b[0] + nx, b[1] + ny, b[0] - nx, b[1] - ny, a[0] - nx, a[1] - ny], [ta + dt * 0.5, ta + dt * 0.8], C_PAPEL, 0.95, C_PAPEL_B));
      tr.push(K.rotulo('Capa ' + (i + 1) + ' · producto desde 5 cm de la raíz y papel de aluminio', C_CAPA[i % 3], ta, i < n - 1 ? { x: tb } : {}));
    });
    tr.push(K.rotulo('Decoloración por capas · del frente hacia atrás', '#1F1B18', 0), K.rotulo('Antes: prueba de mechón · el producto preparado se aplica de inmediato', '#B01E45', 0));
    var cant = t && t.ficha && t.ficha.cantidades; if (cant) tr.push(K.rotulo('Producto: ' + cant, '#9A7B2E', 0));
    return { v: v, tr: tr };
  }
  function escDecoColor(K, neutro, naranja) {
    var FONDO_C = naranja ? NARANJA : AMARILLO, CONTRA = naranja ? AZUL : VIOLETA, FIN_C = naranja ? CENIZA : PERLA, rgbC = naranja ? 'rgba(63,111,181,0.85)' : 'rgba(123,79,160,0.85)';
    var v = 'lateral', tr = [], phs = []; for (var d = -1.0; d <= 1.3; d += 0.06) if (K.seVe(v, K.DER - d, 1.0)) phs.push(K.DER - d);
    phs.forEach(function (ph, i) {
      var q = mecha(K, v, ph, 0.35, 0, 1), q2 = mecha(K, v, ph, 0.35, 0.25, 1); if (!q) return;
      if (!neutro) { tr.push(K.linea(q, [0, 0.12], NEGRO, 4.2)); if (q2) tr.push(K.linea(q2, [0.25 + 0.4 * i / phs.length, 0.45 + 0.4 * i / phs.length], FONDO_C, 4.2)); }
      else {
        tr.push(K.linea(q, [0, 0.05], NEGRO, 4.2)); if (!q2) return;
        tr.push(K.linea(q2, [0, 0.05], FONDO_C, 4.2, { x: 0.68 }));
        tr.push(K.linea(q2, [0.15 + 0.3 * i / phs.length, 0.3 + 0.3 * i / phs.length], rgbC, 5, { x: 0.7 }));
        tr.push(K.linea(q2, [0.62, 0.66], FIN_C, 4.2));
        tr.push(K.linea(q2, [0.86, 0.97], 'rgba(255,255,255,0.45)', 1.4));
      }
    });
    if (!neutro) tr.push(K.rotulo(naranja ? 'Resultado: el fondo queda naranja' : 'Resultado: sobre cabello negro, el fondo sube a amarillo', '#9A7B2E', 0), K.rotulo(naranja ? 'Hay que neutralizar ese naranja' : 'Hay que neutralizar ese amarillo', '#1F1B18', 0.7));
    else if (naranja) tr.push(K.rotulo('Neutralizar el naranja con azul (ceniza)', AZUL, 0), K.rotulo('Tintes .1 o .11', AZUL, 0.15), K.rotulo('Resultado: sin naranja, tono ceniza', '#18906A', 0.62));
    else tr.push(K.rotulo('Neutralizar el amarillo con violeta', VIOLETA, 0), K.rotulo('Matizador violeta o tinte .2', VIOLETA, 0.15), K.rotulo('Resultado: rubio neutro, sin amarillo', '#18906A', 0.62));
    return { v: v, tr: tr };
  }
  /* Fátima, 10-10-2026 · en vez de papel, gorro plástico o térmico; se revisa a los 5, 10, 15 y 20 minutos */
  function escDecoGorro(K) {
    var v = 'lateral', tr = [], phs = []; for (var d = -1.0; d <= 1.3; d += 0.06) if (K.seVe(v, K.DER - d, 1.0)) phs.push(K.DER - d);
    phs.forEach(function (ph) { var q = mecha(K, v, ph, 0.35, 0, 1), q2 = mecha(K, v, ph, 0.35, 0.25, 1); if (q) tr.push(K.linea(q, [0, 0.05], NEGRO, 4.2)); if (q2) tr.push(K.linea(q2, [0, 0.05], 'rgba(240,236,228,0.9)', 4.2)); });
    var cas = []; for (var a = 0; a <= 24; a++) { var ph = K.DER - 1.0 + 2.3 * a / 24; if (K.seVe(v, ph, 0.9)) { var p0 = K.P(ph, 0.25, 1.12); cas.push(K.pr(v, p0)); } }
    var bord = []; for (var b = 24; b >= 0; b--) { var ph2 = K.DER - 1.0 + 2.3 * b / 24; if (K.seVe(v, ph2, 1.6)) bord.push(K.pr(v, K.P(ph2, 1.75, 1.12))); }
    var poly = []; cas.concat(bord).forEach(function (q) { poly.push(q[0], q[1]); });
    if (poly.length > 6) tr.push(zona(poly, [0.06, 0.18], 'rgba(205,225,240,0.55)', 0.6, '#8EA7BC'));
    tr.push({ k: 'c', m: 20, t: [0.2, 0.95], c: '#B01E45', s: 'Revisar' });
    [5, 10, 15, 20].forEach(function (m, i) { tr.push(K.rotulo('A los ' + m + ' minutos: se limpia un mechón y se mira cómo procesa', '#B01E45', 0.2 + i * 0.18, i < 3 ? { x: 0.38 + i * 0.18 } : {})); });
    tr.push(K.rotulo('Gorro plástico o térmico en lugar de papel', '#1F1B18', 0));
    return { v: v, tr: tr };
  }
  /* Fátima, 10-10-2026 · queratina: antes del producto se deshidrata el cabello con el champú de la queratina */
  function escQueraLavado(K) {
    var a = escCierre(K, true, 'Deshidratar: 4 o 5 lavados con el champú de la queratina');
    a.tr.push(K.rotulo('Hasta 6 si el cabello es muy graso · agua tibia', C_AGUA, 0.15), K.rotulo('Se abre la cutícula y el cabello queda deshidratado', '#1F1B18', 0.45), K.rotulo('Después: secar y aplicar el producto mechón a mechón', '#18906A', 0.75));
    return a;
  }
  /* aplicación: pincel, papel, plancha, bigudíes… según la técnica */
  function escAplicar(K, t, modo, col, k) {
    if ((modo === 'barrido' || modo === 'papel' || modo === 'finas') && K.dirElev && K.mechon) return escMechones(K, modo, col, t);
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
    /* preparación como una receta (Fátima): si la técnica no trae su paso de preparación, se abre con sus herramientas,
       productos y cantidades de la ficha — qué se prepara antes de tocar el cabello */
    var fr = t.ficha || {}, yaPrep = t.pasos.some(function (p) { return p.fase === 'preparacion' && !/lav|champ/i.test(p.n || ''); });
    if (!yaPrep && ((fr.herramientas || []).length || (fr.productos || []).length)) {
      var trR = [K.rotulo('Preparación · como una receta', C_RAYA, 0)], yR = 0.08, her = (fr.herramientas || []).slice(0, 5), pro = (fr.productos || []).slice(0, 3);
      her.forEach(function (h) { trR.push(K.rotulo('✔ ' + h, '#18906A', yR)); yR += 0.08; });
      pro.forEach(function (h) { trR.push(K.rotulo('Producto: ' + h, col === '#E9C979' ? '#9A7B2E' : C_RAYA, yR)); yR += 0.08; });
      if (fr.cantidades) trR.push(K.rotulo('Cantidad: ' + fr.cantidades, C_RAYA, Math.min(0.9, yR)));
      esc.push({ tipo: 'cb_receta', vista: 'tres', t: 'Preparación · como una receta', a: { v: 'tres', tr: trR },
        texto: 'Antes de tocar el cabello se prepara todo, como en una receta.' + (her.length ? ' Herramientas: ' + her.join(', ') + '.' : '') + (pro.length ? ' Productos: ' + pro.join(', ') + '.' : '') + (fr.cantidades ? ' Cantidad: ' + fr.cantidades + '.' : '') });
    }
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
      else if (f === 'tiempo') { var b = escAplicar(K, t, modo, col, 0); b.tr = b.tr.filter(function (s) { return s.k !== 'e' && s.c !== C_PLANCHA && !s.lev; }); b.tr.forEach(function (s) { s.t = [0, 0.08]; delete s.x; }); b.tr.push({ k: 'c', m: minutos(t, p), t: [0.1, 0.95], c: '#B01E45', s: 'Exposición' }, K.rotulo(minutos(t, p) ? minutos(t, p) + ' minutos de exposición' : 'Tiempo de exposición', '#B01E45', 0.1)); a = b; }
      else if (f === 'cierre') { a = escCierre(K, /aclar|lav|emulsi|agua|enjuag/i.test(p.n || '')); }
      else if (f === 'preparacion') {
        var fi2 = t.ficha || {}, tr3 = [], lava = /lav|champ/i.test(p.n || '');
        if (lava) { var e2 = escCierre(K, true, 'Preparación · lavado'); tr3 = e2.tr; a = { v: e2.v, tr: tr3 }; }
        else { tr3.push(K.rotulo('Preparación', C_RAYA, 0)); (fi2.herramientas || []).slice(0, 4).forEach(function (h, j) { tr3.push(K.rotulo('✔ ' + h, '#18906A', 0.1 + j * 0.12)); }); if ((fi2.seguridad || [])[0]) tr3.push(K.rotulo('Seguridad: ' + String(fi2.seguridad[0]).replace(/\.$/, ''), '#B01E45', 0.62)); a = { v: 'tres', tr: tr3 }; }
      }
      else a = escAplicar(K, t, modo, col, na++);
      /* sin cartel rojo «Cuidado» (Fátima: alerta genérica); el error típico sigue en la ficha */
      esc.push({ tipo: tipo, vista: a.v, t: p.t || 'Paso ' + (i + 1), texto: (p.n || ''), a: a });
      /* Fátima, 10-10-2026: el balayage también se hace profundo — se empieza a unos 5 cm del cuello, atrás, con zigzag grande;
         el mechón se eleva a 90° y se coloca el producto. Se añade como escena propia; la de arriba no cambia. */
      if ((id === 'mechas_aluminio' || id === 'color_balayage') && (f === 'aplicacion' || !p.fase) && !esc.some(function (e) { return e.tipo === 'cb_lat_h'; }) && K.dirElev && K.mechon) {
        var tecLat = id === 'color_balayage' ? 'balayage' : 'mechas con papel';
        esc.push({ tipo: 'cb_lat_h', vista: 'lateral', t: 'Lateral en horizontal · arranque 10 %', a: escLatAccion(K, t, col, false, 0.10),
          texto: 'Por el lateral, en ' + tecLat + ': líneas horizontales de medio centímetro, de la oreja hacia el rostro. En una línea se hace un zigzag pequeño, se saca el mechón a 90 grados, se coloca el producto y el papel de aluminio. La siguiente línea se deja libre. Para líneas bien profundas el producto se coloca desde el 10 por ciento de la raíz.' },
          { tipo: 'cb_lat_h_queda', vista: 'lateral', t: 'Lateral en horizontal · cómo queda', a: escLatQueda(K, false, 0.10),
          texto: 'Así queda: el aclarado resalta en blanco, difuminado sobre el cabello, desde el 10 por ciento hasta las puntas.' },
          { tipo: 'cb_lat_v', vista: 'lateral', t: 'Lateral en vertical · arranque 65 %', a: escLatAccion(K, t, col, true, 0.65),
          texto: 'La misma técnica en vertical, solo en los laterales: se dibuja el zigzag, se coloca el producto y el papel de aluminio enrollado en vertical, sin pasar la línea que sube de una oreja a la otra y sin tocar la coronilla. Para iluminaciones el producto se coloca desde el 65 por ciento. El arranque lo decide la clienta: 10, 25, 45, 50 o 65 por ciento.' },
          { tipo: 'cb_lat_v_queda', vista: 'lateral', t: 'Lateral en vertical · cómo queda', a: escLatQueda(K, true, 0.65),
          texto: 'Así quedan las iluminaciones: el aclarado resalta en blanco desde el 65 por ciento hasta las puntas.' });
      }
      if ((id === 'cab_derriz' || id === 'quera_alisado' || id === 'cab_planchado') && (f === 'aplicacion' || !p.fase) && !esc.some(function (e) { return e.tipo === 'cb_alisado_nuca'; }) && K.mechon) {
        var prodA = id === 'cab_derriz' ? 'derriz' : id === 'quera_alisado' ? 'queratina' : '', planA = id !== 'cab_derriz';
        var txA = 'Antes, el cabello ondulado. Se toman divisiones finas, de abajo arriba.' + (prodA ? ' Se aplica el producto mechón a mechón.' : '') +
          (planA ? ' La plancha se pasa a cero grados, sin elevar: se prensa bien el cabello y se estira hacia abajo, y detrás de la plancha el cabello queda liso.' : ' En el derriz, mientras se peina y se aplica el producto, con la mano se prensa el cabello a cero grados, todo a cero grados, para que quede bien estirado y pierda volumen. Se deja procesar según el tipo de cabello; si se pone frágil o chicloso, se retira el producto de inmediato.') + ' Después, todo el cabello liso y con brillo.' + (id === 'quera_alisado' ? ' La queratina se deja de tres días a una semana y el alisado dura de tres a seis meses, según el producto.' : '');
        if (id === 'quera_alisado') esc.push({ tipo: 'cb_quera_lavado', vista: 'lateral', t: 'Queratina · deshidratar el cabello', a: escQueraLavado(K),
          texto: 'Antes del producto se deshidrata el cabello: se lava cuatro o cinco veces con el champú de la queratina, hasta seis si es muy graso, con agua tibia. Así se abre la cutícula. Después se seca y se aplica el producto mechón a mechón, y se empieza a estirar con la plancha. Fátima recomienda la queratina orgánica, sin formol.' });
        esc.push({ tipo: 'cb_alisado_nuca', vista: 'nuca', t: 'Alisado a 0° · antes y después', a: escAlisado(K, t, 'nuca', prodA, planA), texto: txA },
          { tipo: 'cb_alisado_lat', vista: 'lateral', t: 'Alisado a 0° · de lado', a: escAlisado(K, t, 'lateral', prodA, planA), texto: 'De lado se ve igual: del ondulado al liso, división a división, estirando siempre hacia abajo.' });
      }
      if (id === 'quim_decoloracion' && (f === 'aplicacion' || !p.fase) && !esc.some(function (e) { return e.tipo === 'cb_deco_neutro'; }) && K.mechon) {
        esc.push({ tipo: 'cb_deco_capas', vista: 'lateral', t: 'Decoloración por capas · del frente hacia atrás', a: escDecoCapas(K, t),
          texto: 'Antes de empezar se hace una prueba de mechón para ver si el cabello resiste. Se prepara el polvo decolorante con el oxidante de 20, 30 o 40 volúmenes, según la ficha, y se aplica de inmediato: si se deja esperar, pierde consistencia. Se divide el cabello en capas finas, del frente hacia atrás. En cada capa se aplica el producto, mechón a mechón, desde unos cinco centímetros de la raíz hasta las puntas, y se coloca el papel de aluminio. Así hasta terminar atrás.' },
          { tipo: 'cb_deco_amarillo', vista: 'lateral', t: 'Resultado · el negro sube a amarillo', a: escDecoColor(K, false),
          texto: 'Sobre un cabello negro, al decolorar el fondo sube y probablemente queda amarillo. Ese amarillo hay que neutralizarlo.' },
          { tipo: 'cb_deco_neutro', vista: 'lateral', t: 'Neutralizar el amarillo con violeta', a: escDecoColor(K, true),
          texto: 'El amarillo se neutraliza con violeta: matizador violeta o tinte punto dos. Al neutralizar, el amarillo desaparece y queda un rubio neutro.' });
        esc.splice(esc.length - 2, 0, { tipo: 'cb_deco_gorro', vista: 'lateral', t: 'Gorro y revisión cada 5 minutos', a: escDecoGorro(K),
          texto: 'En lugar de papel de aluminio también se puede poner una bolsa o un gorro, plástico o térmico. Se va revisando a los cinco, diez, quince y veinte minutos para ver cómo procesa.' });
        esc.push({ tipo: 'cb_deco_naranja', vista: 'lateral', t: 'Resultado · si queda naranja', a: escDecoColor(K, false, true),
          texto: 'Si el fondo queda naranja, también hay que neutralizarlo.' },
          { tipo: 'cb_deco_neutro_nar', vista: 'lateral', t: 'Neutralizar el naranja con azul', a: escDecoColor(K, true, true),
          texto: 'El naranja se neutraliza con azul, es decir, con ceniza: tintes punto uno o punto once. Así desaparece el naranja y queda un tono ceniza.' });
      }
      if ((id === 'mechas_aluminio' || id === 'color_balayage') && (f === 'aplicacion' || !p.fase) && !esc.some(function (e) { return e.tipo === 'cb_queda_frente'; }) && K.dirElev && K.mechon) {
        var dq = id === 'color_balayage' ? ARRANQUE : 0.1;
        esc.push({ tipo: 'cb_queda_atras', vista: 'nuca', t: 'Cómo queda · atrás', a: escQuedaVista(K, 'nuca', dq, 'Cómo queda · atrás'),
          texto: 'Damos la vuelta a la cabeza. Así queda por detrás: el cabello natural y los mechones aclarados, que resaltan en blanco desde el ' + Math.round(dq * 100) + ' por ciento hasta las puntas.' },
          { tipo: 'cb_queda_frente', vista: 'frente', t: 'Cómo queda · de frente', a: escQuedaVista(K, 'frente', dq, 'Cómo queda · de frente'),
          texto: 'Y así queda de frente: los mechones aclarados enmarcan el rostro y dan ese reflejo blanco sobre el cabello.' });
      }
      if (id === 'mechas_aluminio' && (f === 'aplicacion' || !p.fase) && !esc.some(function (e) { return e.tipo === 'cb_universales'; }) && K.dirElev && K.mechon) {
        esc.push({ tipo: 'cb_universales', vista: 'tres', t: 'Mechas universales · por el lateral', a: escUniversales(K, t, col),
          texto: 'Mechas universales con papel de aluminio. Desde la raya de atrás se sacan líneas en diagonal de un centímetro, un dedo o menos, de la nuca hacia la coronilla. En una línea se hace un zigzag pequeño, se saca el mechón a 90 grados, se coloca el producto y se pone el papel de aluminio, en plantilla o enrollado. La línea siguiente se deja libre, sin zigzag ni papel. En la tercera se vuelve a hacer el zigzag, y así hasta llegar a la coronilla: los papeles quedan montados uno sobre otro.' });
      }
      if (id === 'color_balayage' && (f === 'aplicacion' || !p.fase) && !esc.some(function (e) { return e.tipo === 'cb_bal_frente'; }) && K.dirElev && K.mechon) {
        esc.push({ tipo: 'cb_bal_frente', vista: 'frente', t: 'Balayage · el frente en cuadrado', a: escBalFrente(K, t, col),
          texto: 'En el frente, la división del balayage es un cuadrado. Dentro del cuadrado se hace el zigzag, se saca el mechón a 90 grados y se coloca el producto desde el arranque hasta las puntas. Se repite línea a línea hasta el final del cuadrado.' });
      }
      if (id === 'color_balayage' && (f === 'aplicacion' || !p.fase) && !esc.some(function (e) { return e.tipo === 'cb_bal_profundo'; }) && K.dirElev && K.mechon) {
        var fp = t.ficha || {};
        esc.push({ tipo: 'cb_bal_profundo', vista: 'arriba', t: 'Balayage profundo · zigzag grande', a: escMechones(K, 'barrido', col, t, { profundo: true }),
          texto: 'También se puede hacer profundo. Se empieza atrás, a unos 5 centímetros del cuello, con un zigzag grande en el cráneo. De cada pico se saca un mechón, se eleva a 90 grados y se coloca el producto desde el arranque hasta las puntas.' + (fp.cantidades ? ' Producto: ' + fp.cantidades + '.' : '') + ' Poco o profundo, la cantidad la decide la clienta.' });
      }
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

  /* ═════════ Entrega 3 · diseños de «para mi clauidia (1)»: sobreproyección con pivote, Long Layers y Pixie ═════════
     Solo la geometría de cada diagrama, dibujada por el motor sobre el maniquí (ninguna imagen copiada).
     Lo que el dibujo no dice (grados, largos) no se pone: queda «a validar por Fátima». */
  function W(K, v, x, y, z) { return K.pr(v, K.V3(x, y, z)); }
  function flecha(K, v, a, b, t, c, w, ext) { return K.linea(K.plano([W(K, v, a[0], a[1], a[2]), W(K, v, b[0], b[1], b[2])]), t, c, w || 3, Object.assign({ fl: 1 }, ext || {})); }
  /* flecha blanca con borde oscuro (se ve sobre el fondo claro) */
  function flechaBlanca(K, v, a, b, t) { return [flecha(K, v, a, b, t, '#1F1B18', 6.5), flecha(K, v, a, b, t, '#FFFFFF', 3.2)]; }
  /* contorno del perfil (plano de la raya): ángulo 0 = coronilla, positivo hacia la cara */
  function perfil(a, s) { return [0, 1.22 * Math.cos(a) * (s || 1), 1.15 * Math.sin(a) * (s || 1)]; }
  function paralelos(K, v, ths, t, c, w, ext) { var tr = []; ths.forEach(function (th, i) { var t0 = t[0] + i * (t[1] - t[0]) / ths.length; tr = tr.concat(K.lineas(K.tramos(v, function (u) { return [u * 2 * PI, th]; }, 120), [t0, t0 + (t[1] - t[0]) / ths.length], c, w || 3, ext)); }); return tr; }
  /* abanico: líneas sobre el cráneo desde un punto [φ,θ] hasta varios puntos [φ,θ] */
  function abanico(K, v, o, fin, t, c, w) { var tr = []; fin.forEach(function (f, i) { var t0 = t[0] + i * (t[1] - t[0]) / (fin.length + 2); tr = tr.concat(K.lineas(K.tramos(v, K.recta(o, f), 40), [t0, t0 + (t[1] - t[0]) * 3 / (fin.length + 2)], c, w || 2.5)); }); return tr; }

  /* ── «Con efecto colores» · altura total, particiones horizontales, pivote, sobreproyección y melena de color ── */
  var C_MORADO = '#8E5BD6', C_MORADO_B = '#5B2E91', C_ROJO = '#C0392B';
  function sobreproy(K) {
    var v = 'lateral', esc = [], TH = [0.62, 0.95, 1.28, 1.6], PIV = [K.NUCA, 0.32];
    var frente = 1.5, atras = -1.75;
    function altura(t) { return [flecha(K, v, [0, 0.16, frente], [0, 1.22, frente], t, C_ROJO, 4), flecha(K, v, [0, 0.16, frente], [0, -0.9, frente], t, C_ROJO, 4)]; }
    function negras(t) { var tr = paralelos(K, v, TH, t, '#1F1B18', 2.6); TH.forEach(function (th, i) { var y = 1.22 * Math.cos(th); tr.push(flecha(K, v, [0, y, -1.15 * Math.sin(th) * 0.95], [0, y, frente - 0.1], [t[0] + i * 0.05, t[1]], '#1F1B18', 2.6)); }); return tr; }
    function pivote(t) {
      var fin = []; for (var i = 0; i <= 8; i++) fin.push([K.NUCA + 1.45 - i * 0.36, 1.95]);
      var tr = abanico(K, v, PIV, fin.filter(function (f) { return K.seVe(v, f[0], f[1] - 0.2); }), t, C_MORADO_B, 2.4);
      [0.25, 0.5, 0.75].forEach(function (z, i) { var yt = 1.22 * Math.sqrt(Math.max(0, 1 - z * z / 1.32)); tr.push(K.linea(K.plano([W(K, v, 0, yt * 1.02, z), W(K, v, 0, -0.15, z)]), [t[0] + i * 0.05, t[1]], C_MORADO_B, 2)); });
      tr.push(K.chapa(K.pr(v, K.P(PIV[0], PIV[1])), '', C_MORADO_B, t[0]));
      return tr;
    }
    function blancas(t) { return flechaBlanca(K, v, [0, 1.12, 0.6], [0, 1.12, atras], t).concat(flechaBlanca(K, v, [0, -0.32, 1.25], [0, -0.32, atras], [t[0] + 0.08, t[1]])); }
    /* melena: arriba sigue el cráneo, atrás cae por la nuca hasta los hombros; el borde de delante y el de abajo, en picos */
    function melena(t) {
      var q = [], a, i;
      for (a = 0.72; a >= -2.05; a -= 0.12) q.push(perfil(a, 1.06));
      var picos = [[-1.0, -0.75], [-0.8, -1.45], [-0.62, -1.95], [-0.5, -2.2], [-0.3, -1.9], [-0.12, -2.1], [0.0, -1.7], [0.12, -1.9], [0.2, -1.3], [0.32, -1.45], [0.36, -0.85], [0.5, -0.95], [0.48, -0.35], [0.62, -0.42], [0.6, 0.15], [0.76, 0.12], [0.7, 0.6]];
      picos.forEach(function (p) { q.push([0, p[1], p[0]]); });
      var pl = K.plano(q.map(function (c) { return W(K, v, c[0], c[1], c[2]); }));
      var borde = K.plano(picos.slice(2).map(function (p) { return W(K, v, 0, p[1], p[0]); }));
      return [{ k: 'z', p: pl, t: t, c: C_MORADO, a: 0.42, b: C_MORADO_B }, K.tijera(borde, [t[0] + (t[1] - t[0]) * 0.55, t[1]], K.CORTE, true)];
    }
    esc.push({ tipo: 'sp_altura', vista: v, t: 'La altura total de la cabeza', texto: 'Empezamos de perfil. La flecha roja vertical representa la altura total de la cabeza, desde arriba hasta la barbilla.',
      a: { v: v, tr: altura([0.05, 0.6]).concat([K.rotulo('Flecha roja: altura total de la cabeza', C_ROJO, 0.05)]) } });
    esc.push({ tipo: 'sp_secciones', vista: v, t: 'Particiones horizontales', texto: 'Las líneas negras son las particiones horizontales: las secciones del corte, una debajo de otra, de la coronilla hacia la nuca.',
      a: { v: v, tr: altura([0, 0.02]).concat(negras([0.05, 0.75]), [K.rotulo('Líneas negras: particiones horizontales (secciones)', '#1F1B18', 0.05)]) } });
    esc.push({ tipo: 'sp_pivote', vista: v, t: 'El pivote en la coronilla', texto: 'Las líneas que salen desde la coronilla son el pivote: marcan la dirección de peinado. Cada mechón se peina desde la coronilla, en abanico, antes de cortar. Delante, las secciones van en vertical.',
      a: { v: v, tr: negras([0, 0.02]).concat(pivote([0.05, 0.8]), [K.rotulo('Pivote: dirección de peinado desde la coronilla', C_MORADO_B, 0.05)]) } });
    esc.push({ tipo: 'sp_sobreproy', vista: v, t: 'La sobreproyección', texto: 'Las flechas blancas indican la dirección de sobreproyección: el cabello se peina hacia atrás antes de cortar.',
      a: { v: v, tr: negras([0, 0.02]).concat(pivote([0, 0.02]), blancas([0.08, 0.6]), [K.rotulo('Flechas blancas: el cabello se peina hacia atrás antes de cortar', '#1F1B18', 0.08)]) } });
    esc.push({ tipo: 'sp_melena', vista: v, t: 'La forma final con color', texto: 'Al terminar, el color muestra la forma: arriba sigue la curva de la cabeza, atrás cae largo, y el borde de delante y de abajo queda en picos, cortado con desfilado.',
      a: { v: v, tr: melena([0.04, 0.7]).concat(altura([0, 0.02]), negras([0, 0.02]), pivote([0, 0.02]), blancas([0, 0.02]), [K.rotulo('Forma final: perímetro en picos', C_MORADO_B, 0.04), K.rotulo('Grados y largos: a validar por Fátima', '#8A6D3B', 0.7, rev() ? undefined : { x: -1 })]) } });
    return {
      R: { id: 'p_sobreproy', n: 'Particiones horizontales, pivote y sobreproyección' },
      escenas: esc,
      preguntas: [
        { e: '¿Qué representa la flecha roja vertical?', o: ['La altura total de la cabeza', 'La dirección del corte', 'El largo de la nuca'], c: 0, x: 'La flecha roja va de arriba de la cabeza hasta la barbilla.' },
        { e: '¿Qué son las líneas negras?', o: ['Las particiones horizontales (secciones) del corte', 'Las líneas de color', 'La raya central'], c: 0, x: 'Cada línea negra es una sección horizontal.' },
        { e: '¿Qué indican las flechas blancas?', o: ['La dirección de sobreproyección: se peina hacia atrás antes de cortar', 'El largo final', 'La altura de la cabeza'], c: 0, x: 'Antes de cortar, el cabello se peina hacia atrás.' },
        { e: '¿Qué marcan las líneas que salen desde la coronilla?', o: ['El pivote: la dirección de peinado', 'Dónde termina el color', 'Las orejas'], c: 0, x: 'Cada mechón se peina desde la coronilla, en abanico.' }
      ]
    };
  }

  /* ── «Long Layers» de frente: proyección a un punto por encima de la cabeza, marco en V, secciones por colores ── */
  var C_AZUL = '#2C6FD1', C_NARANJA = '#E58A3A';
  function longLayers(K) {
    var v = 'frente', esc = [], Q = [0, 1.12, 1.05];
    function punto(t) { return K.chapa(W(K, v, Q[0], Q[1], Q[2]), '', C_ROJO, t); }
    var lados = [[-0.98, -1.75, 0.2], [-0.62, -1.7, 0.75], [0.62, -1.7, 0.75], [0.98, -1.75, 0.2]];
    function proyeccion(t) {
      var tr = [punto(t[0])];
      lados.forEach(function (a, i) { tr.push(flecha(K, v, a, Q, [t[0] + i * 0.06, t[1]], C_ROJO, 2.6)); });
      [[-0.7, 0.62, 0.75], [0.7, 0.62, 0.75]].forEach(function (a, i) { tr.push(K.linea(K.plano([W(K, v, Q[0], Q[1], Q[2]), W(K, v, a[0], a[1], a[2])]), [t[0] + 0.2 + i * 0.05, t[1]], C_ROJO, 2.2, { d: 1 })); });
      tr.push(K.linea(K.plano([W(K, v, -0.7, 0.62, 0.75), W(K, v, 0, 0.78, 0.95), W(K, v, 0.7, 0.62, 0.75)]), [t[0] + 0.3, t[1]], C_ROJO, 2, { d: 1 }));
      return tr;
    }
    function marco(t) {
      var tr = [];
      [-1, 1].forEach(function (s, i) {
        tr.push(flecha(K, v, [s * 0.55, 0.55, 0.85], [s * 0.58, -1.75, 0.75], [t[0] + i * 0.08, t[1]], C_ROJO, 2.6));
        tr.push(K.linea(K.plano([W(K, v, s * 0.3, 0.55, 1.0), W(K, v, s * 0.3, -0.62, 1.05), W(K, v, s * 0.62, -1.15, 0.7)]), [t[0] + 0.2 + i * 0.08, t[1]], C_ROJO, 2.6, { fl: 1 }));
      });
      return tr;
    }
    function colores(t) {
      var tr = paralelos(K, v, [0.55, 0.78, 1.0], [t[0], t[0] + 0.3], C_AZUL, 2.4, { d: 1 }).concat(paralelos(K, v, [1.3, 1.5, 1.7], [t[0] + 0.3, t[0] + 0.6], C_NARANJA, 2.4, { d: 1 }));
      [-0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9].forEach(function (x, i) { var c = i % 2 ? C_AZUL : (Math.abs(x) > 0.8 ? C_NARANJA : C_ROJO); tr.push(flecha(K, v, [x, 0.35, 0.4], [x, -1.75, 0.4], [t[0] + 0.45 + i * 0.03, t[1]], c, 2.4)); });
      tr.push(K.linea(K.plano([W(K, v, -1.02, -1.8, 0.4), W(K, v, 1.02, -1.8, 0.4)]), [t[1] - 0.1, t[1]], '#1F1B18', 4));
      return tr;
    }
    esc.push({ tipo: 'll_punto', vista: v, t: 'Proyección a un punto encima de la cabeza', texto: 'De frente. Los mechones se proyectan hacia arriba, todos al mismo punto, por encima de la cabeza. Arriba, en el centro, queda un triángulo marcado con líneas discontinuas.',
      a: { v: v, tr: proyeccion([0.05, 0.75]).concat([K.rotulo('Todos los mechones al mismo punto, encima de la cabeza', C_ROJO, 0.05)]) } });
    esc.push({ tipo: 'll_marco', vista: v, t: 'El marco del rostro', texto: 'Delante, los mechones bajan enmarcando el rostro: los de los lados caen rectos y los del centro se abren hacia afuera, formando una V alrededor de la cara.',
      a: { v: v, tr: [punto(0)].concat(marco([0.05, 0.75]), [K.rotulo('Marco del rostro en V', C_ROJO, 0.05)]) } });
    esc.push({ tipo: 'll_colores', vista: v, t: 'Secciones por colores y un solo largo', texto: 'En la segunda forma, las secciones horizontales se marcan por colores: azul arriba y naranja abajo. Desde la coronilla salen líneas hacia el punto de arriba, y todo el cabello cae hasta una misma línea recta.',
      a: { v: v, tr: [punto(0)].concat([[-0.75, 0.5, 0.75, C_AZUL], [-0.35, 0.62, 0.9, C_ROJO], [0, 0.66, 0.95, C_AZUL], [0.35, 0.62, 0.9, C_ROJO], [0.75, 0.5, 0.75, C_AZUL]].map(function (a, i) { return K.linea(K.plano([W(K, v, a[0], a[1], a[2]), W(K, v, Q[0], Q[1], Q[2])]), [0.02 + i * 0.03, 0.2], a[3], 2.2); }), colores([0.05, 0.85]), [K.rotulo('Azul arriba · naranja abajo', C_AZUL, 0.05), K.rotulo('Todo cae hasta una línea recta', '#1F1B18', 0.75), K.rotulo('Grados: a validar por Fátima', '#8A6D3B', 0.85, rev() ? undefined : { x: -1 })]) } });
    return {
      R: { id: 'p_long_layers', n: 'Long Layers · proyección a un punto' },
      escenas: esc,
      preguntas: [
        { e: 'En «Long Layers», ¿hacia dónde se proyectan los mechones?', o: ['A un mismo punto por encima de la cabeza', 'Hacia la nuca', 'Hacia las orejas'], c: 0, x: 'Todas las flechas van al mismo punto, arriba.' },
        { e: '¿Qué forma hacen los mechones de delante alrededor de la cara?', o: ['Una V', 'Un círculo', 'Una línea horizontal'], c: 0, x: 'Los del centro se abren hacia afuera y enmarcan el rostro.' },
        { e: 'En la segunda forma, ¿cómo terminan los mechones abajo?', o: ['En una misma línea recta', 'En picos', 'En diagonal'], c: 0, x: 'Todas las flechas llegan a la línea negra recta.' }
      ]
    };
  }

  /* ── Pixie: perfil (abanico de elevaciones y sobredirección atrás), frente (verticales y flequillo en triángulo), arriba (nuca radial y espiga) ── */
  function pixie(K) {
    var esc = [];
    (function () {
      var v = 'lateral', tr = [], i;
      for (i = 0; i <= 9; i++) {
        var a = -0.05 - i * 0.2, b = perfil(a, 1.03), n = [0, Math.cos(a) / 1.22, Math.sin(a) / 1.15], L = Math.sqrt(n[1] * n[1] + n[2] * n[2]);
        var c = [0, b[1] + n[1] / L * 0.6, b[2] + n[2] / L * 0.6];
        tr.push(K.linea(K.plano([W(K, v, b[0], b[1], b[2]), W(K, v, c[0], c[1], c[2])]), [0.05 + i * 0.05, 0.2 + i * 0.05], '#4A4A55', 2));
      }
      var arco = []; for (i = 0; i <= 30; i++) { var a2 = -0.05 - i * 1.8 / 30, b2 = perfil(a2, 1.03), n2 = [Math.cos(a2) / 1.22, Math.sin(a2) / 1.15], L2 = Math.sqrt(n2[0] * n2[0] + n2[1] * n2[1]); arco.push(W(K, v, 0, b2[1] + n2[0] / L2 * 0.6, b2[2] + n2[1] / L2 * 0.6)); }
      tr.push(K.linea(K.plano(arco), [0.55, 0.75], '#4A4A55', 2, { d: 1 }));
      [-0.25, -0.5, -0.75, -0.95].forEach(function (z, j) { var yt = 1.22 * Math.sqrt(Math.max(0, 1 - z * z / 1.32)); tr.push(K.linea(K.plano([W(K, v, 0, yt * 1.02, z), W(K, v, 0, -0.7, z)]), [0.02 + j * 0.03, 0.2], '#1F1B18', 2)); });
      [0.3, 0.05, -0.2, -0.45].forEach(function (y, j) { tr.push(flecha(K, v, [0, y, -1.0], [0, y, -1.75], [0.62 + j * 0.04, 0.85], '#1F1B18', 2.2)); });
      tr.push(K.rotulo('Secciones verticales', '#1F1B18', 0.02), K.rotulo('Abanico de elevaciones siguiendo la curva de la cabeza', '#4A4A55', 0.05), K.rotulo('Atrás: sobredirección hacia atrás', '#1F1B18', 0.62), K.rotulo('Grados: a validar por Fátima', '#8A6D3B', 0.85, rev() ? undefined : { x: -1 }));
      esc.push({ tipo: 'px_perfil', vista: v, t: 'Pixie de perfil · abanico de elevaciones', texto: 'De perfil, las secciones son verticales. Los mechones se elevan en abanico, siguiendo la curva de la cabeza. En la parte de atrás, las flechas marcan que el cabello se sobredirige hacia atrás.', a: { v: v, tr: tr } });
    })();
    (function () {
      var v = 'frente', tr = [];
      [-0.55, -0.35, -0.15, 0.05, 0.25, 0.45, 0.65].forEach(function (x, j) { var yt = 1.22 * Math.sqrt(Math.max(0, 1 - x * x / 1.2)); tr.push(K.linea(K.plano([W(K, v, x, yt * 0.98, 0.35), W(K, v, x, 0.35, 0.95)]), [0.04 + j * 0.03, 0.3 + j * 0.03], '#4A4A55', 2)); });
      tr = tr.concat(K.lineas(K.tramos(v, function (u) { return [K.CARA - 1.3 + u * 2.6, 0.95]; }, 60), [0.4, 0.55], '#4A4A55', 2, { d: 1 }));
      var A = W(K, v, 0.42, 0.18, 1.0), B = W(K, v, 0.62, -0.75, 0.75), Cq = W(K, v, -0.25, -0.38, 1.1);
      tr.push(K.linea(K.plano([A, B, Cq, A]), [0.58, 0.85], C_ROJO, 2.6, { d: 1 }));
      tr.push(K.rotulo('Secciones verticales de frente', '#4A4A55', 0.04), K.rotulo('Flequillo en triángulo asimétrico', C_ROJO, 0.58));
      esc.push({ tipo: 'px_frente', vista: v, t: 'Pixie de frente · flequillo en triángulo', texto: 'De frente, las secciones también son verticales. El flequillo se marca con un triángulo asimétrico: más largo hacia un lado, cubriendo la frente en diagonal.', a: { v: v, tr: tr } });
    })();
    (function () {
      var v = 'arriba', tr = [], O = [K.NUCA, 1.05], fin = [], i;
      for (i = 0; i <= 10; i++) fin.push([K.NUCA - 1.45 + i * 0.29, 1.95]);
      tr = tr.concat(K.lineas(K.tramos(v, function (u) { return [K.NUCA - 1.65 + u * 3.3, 1.05]; }, 60), [0.02, 0.2], '#1F1B18', 2.6));
      tr = tr.concat(abanico(K, v, O, fin, [0.2, 0.55], '#4A4A55', 2));
      /* espiga: una línea guía en diagonal y, a los dos lados, secciones que bajan hacia atrás (en pantalla) */
      var S0 = K.pr(v, K.P(K.NUCA, 1.0)), S1 = K.pr(v, K.P(K.CARA - 0.55, 0.62)), dx = S1[0] - S0[0], dy = S1[1] - S0[1], Lg = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / Lg, uy = dy / Lg;
      tr.push(K.linea([S0[0], S0[1], S1[0], S1[1]], [0.55, 0.65], '#1F1B18', 2.4));
      for (i = 1; i <= 6; i++) { var px = S0[0] + dx * i / 7, py = S0[1] + dy * i / 7; [-1, 1].forEach(function (sg) { tr.push(K.linea([px, py, px - ux * 34 - sg * uy * 40, py - uy * 34 + sg * ux * 40], [0.62 + i * 0.04, 0.72 + i * 0.04], '#4A4A55', 2)); }); }
      tr.push(K.chapa(K.pr(v, K.P(O[0], O[1])), '', '#1F1B18', 0.2));
      tr.push(K.rotulo('Línea de lado a lado', '#1F1B18', 0.02), K.rotulo('Nuca en abanico desde un punto', '#4A4A55', 0.2), K.rotulo('Arriba: secciones en espiga', '#1F1B18', 0.55));
      esc.push({ tipo: 'px_arriba', vista: v, t: 'Pixie desde arriba · nuca en abanico y espiga', texto: 'Desde arriba se ve el reparto: una línea de lado a lado separa la nuca. La nuca se divide en abanico, desde un mismo punto. Arriba, las secciones van en espiga, en diagonal a los dos lados de una línea.', a: { v: v, tr: tr } });
    })();
    return {
      R: { id: 'p_pixie', n: 'Pixie · abanico, flequillo en triángulo y espiga' },
      escenas: esc,
      preguntas: [
        { e: 'En el pixie, ¿cómo se divide la nuca vista desde arriba?', o: ['En abanico, desde un mismo punto', 'En horizontal', 'En cuadros'], c: 0, x: 'Todas las líneas de la nuca salen del mismo punto.' },
        { e: '¿Qué forma tiene el flequillo de este pixie?', o: ['Un triángulo asimétrico', 'Una línea recta', 'Un círculo'], c: 0, x: 'El triángulo es más largo hacia un lado.' },
        { e: 'De perfil, ¿hacia dónde se sobredirige el cabello de atrás?', o: ['Hacia atrás', 'Hacia la cara', 'Hacia abajo'], c: 0, x: 'Las flechas de la parte de atrás apuntan hacia atrás.' }
      ]
    };
  }

  /* ═════════ Seguridad en los químicos (reglas de Fátima, 9-10-2026) ═════════
     Prueba de mechón, guantes, embarazadas, revisar las mechas cada 15 minutos y cantidades exactas,
     con un «antes y después» de lo que pasa si no se tiene la precaución. Solo usa los ayudantes del maniquí. */
  function segQuimica(K) {
    var esc = [], ROJO = '#B01E45', VERDE = '#18906A', SANO = '#6A4428', QUEMA = '#3F3833', HUMO = '#7E7770';
    var v = 'nuca', cols = [-0.6, -0.3, 0, 0.3, 0.6];
    function mechas(a, b, c, w, t, x) { var tr = []; cols.forEach(function (d, j) { var q = mecha(K, v, K.NUCA + d, 1.2, a, b); if (q) tr.push(K.linea(q, [t[0] + j * 0.03, t[1]], c, w, x ? { x: x } : undefined)); }); return tr; }
    /* 1 · prueba de mechón */
    (function () {
      var tr = [], q = mecha(K, v, K.NUCA + 0.3, 1.5, 0, 1);
      if (q) { tr.push(K.linea(q, [0.1, 0.35], SANO, 5)); var bx = caja(mecha(K, v, K.NUCA + 0.3, 1.5, 0.25, 0.85), 12); if (bx) tr.push(zona(bx, [0.4, 0.7], '#E9C979', 0.85, '#9A7B2E')); tr.push(K.chapa([q[0], q[1]], '1', ROJO, 0.1)); }
      tr.push(K.rotulo('Prueba de mechón', ROJO, 0.02), K.rotulo('Antes de cualquier químico', ROJO, 0.2), K.rotulo('En todo tipo de cabello', ROJO, 0.4));
      esc.push({ tipo: 'sq_mechon', vista: v, t: 'Prueba de mechón antes de cualquier químico', texto: 'Antes de cualquier proceso químico, en todo tipo de cabello, se hace una prueba de mechón. Los productos químicos no tienen el mismo efecto en todas las personas y pueden dar una reacción alérgica.', a: { v: v, tr: tr } });
    })();
    /* 2 · guantes · 3 · embarazadas */
    esc.push({ tipo: 'sq_guantes', vista: v, t: 'Guantes en todo procedimiento químico', texto: 'El peluquero usa guantes para cualquier procedimiento químico: tinte, mechas, decoloración, queratina.', a: { v: v, tr: mechas(0, 0.5, SANO, 4, [0.05, 0.4]).concat([K.rotulo('Guantes siempre', VERDE, 0.02), K.rotulo('✔ Tinte', VERDE, 0.2), K.rotulo('✔ Mechas', VERDE, 0.32), K.rotulo('✔ Decoloración', VERDE, 0.44), K.rotulo('✔ Queratina', VERDE, 0.56)]) } });
    esc.push({ tipo: 'sq_embarazo', vista: v, t: 'Embarazo: ningún producto químico', texto: 'A una mujer embarazada no se le aplica ningún producto químico: corre el riesgo de calvicie.', a: { v: v, tr: [K.rotulo('Embarazada', ROJO, 0.02), K.rotulo('Ningún producto químico', ROJO, 0.25)] } });
    /* 4 · revisar cada 15 minutos */
    esc.push({ tipo: 'sq_revisar', vista: v, t: 'Revisar las mechas cada 15 minutos', texto: 'Las mechas se revisan cada 15 minutos. No revisarlas es un error común.', a: { v: v, tr: mechas(0.2, 1, '#E9C979', 5, [0, 0.1]).concat([{ k: 'c', m: 15, t: [0.1, 0.95], c: ROJO, s: 'Revisar' }, K.rotulo('Cada 15 minutos', ROJO, 0.05), K.rotulo('Error común: no revisarlas', ROJO, 0.5)]) } });
    /* 5 · cantidades exactas: antes y después */
    (function () {
      var tr = mechas(0, 1, SANO, 5, [0.02, 0.3], 0.5);
      tr.push(K.rotulo('Antes · cabello sano', VERDE, 0.02, { x: 0.5 }));
      cols.forEach(function (d, j) {
        var q = mecha(K, v, K.NUCA + d, 1.2, 0, 0.42); if (!q) return;
        tr.push(K.linea(q, [0.52 + j * 0.02, 0.62], QUEMA, 4.5));
        var x0 = q[q.length - 2], y0 = q[q.length - 1];
        [0, 1].forEach(function (h) { var pts = []; for (var i = 0; i <= 6; i++) pts.push(x0 + Math.sin(i * 1.2 + j + h * 2) * 10 + h * 14, y0 - 12 - i * 18); tr.push(K.linea(pts, [0.62 + j * 0.03, 0.85 + h * 0.05], HUMO, 3, { d: 1 })); });
      });
      tr.push(K.rotulo('Después · cantidad no exacta', ROJO, 0.5), K.rotulo('Echa humo, se quema y se pierde', ROJO, 0.65));
      esc.push({ tipo: 'sq_antes_despues', vista: v, t: 'Cantidades exactas · antes y después', texto: 'Las cantidades de producto deben ser exactas. Si no, el cabello empieza a echar humo, se quema y se pierde. Así se ve antes y después cuando no se tiene la precaución.', a: { v: v, tr: tr } });
    })();
    return {
      R: { id: 'p_seg_quimica', n: 'Seguridad en los químicos · antes y después' },
      escenas: esc,
      preguntas: [
        { e: '¿Cuándo se hace la prueba de mechón?', o: ['Solo en cabello rubio', 'Antes de cualquier proceso químico, en todo tipo de cabello', 'Después del servicio'], c: 1, x: 'Los productos no tienen el mismo efecto en todas las personas y pueden dar reacción alérgica.' },
        { e: '¿Cada cuánto se revisan las mechas?', o: ['Cada 15 minutos', 'Solo al final', 'Cada hora'], c: 0, x: 'No revisarlas es un error común.' },
        { e: '¿Qué pasa si la cantidad de producto no es exacta?', o: ['Nada', 'El color sale más bonito', 'El cabello echa humo, se quema y se pierde'], c: 2, x: 'Por eso las cantidades deben ser exactas.' }
      ]
    };
  }

  /* catálogo de técnicas como datos (las siguientes entregas se añaden aquí) */
  var TECNICAS = [
    { id: 'p_seis', n: 'Seccionado en 4 y 6 secciones · escala 0–225°', unidad: 'pe_u_base', uso: ['corte', 'color', 'queratina'], fn: seis, fuente: 'Diagramas de Fátima · formas de dividir un cabello, tipos de diagrama 0–225' },
    { id: 'p_sobreproy', n: 'Particiones horizontales, pivote y sobreproyección', unidad: 'pe_u_base', uso: ['corte', 'color'], fn: sobreproy, fuente: 'Diseño de Fátima · con efecto colores' },
    { id: 'p_long_layers', n: 'Long Layers · proyección a un punto', unidad: 'pe_u_base', uso: ['corte'], fn: longLayers, fuente: 'Diseño de Fátima · forma de frente (Long Layers)' },
    { id: 'p_pixie', n: 'Pixie · abanico, flequillo en triángulo y espiga', unidad: 'pe_u_base', uso: ['corte'], fn: pixie, fuente: 'Diseño de Fátima · pixie corte diagrama' },
    { id: 'p_seg_quimica', n: 'Seguridad en los químicos · antes y después', unidad: 'pe_u_fund', uso: ['color', 'queratina'], fn: segQuimica, fuente: 'Reglas de Fátima · seguridad y errores comunes (9-10-2026)' }
  ];
  /* técnicas que otros módulos registran (cerebro de colorimetría…): van después de las del Cerebro de su unidad */
  var EXTRA = [];
  function registrar(lista) { (lista || []).forEach(function (t) { if (t && t.id && !EXTRA.some(function (x) { return x.id === t.id; })) EXTRA.push(t); }); }
  function catalogo() { return TECNICAS.concat(delCerebro(), EXTRA); }
  function tecnica(id) { return catalogo().filter(function (t) { return t.id === id; })[0] || null; }
  function construir(id) { var t = tecnica(id); return t ? DG.construirCon(t.fn) : Promise.resolve(null); }
  function construirYa(id) { var t = tecnica(id); return t ? DG.construirConYa(t.fn) : null; }

  /* ───────── curso premium: una lección «Técnica paso a paso · técnica» en su unidad (Peluquería) ───────── */
  function lecciones(D, res, aviso) {
    var C = res && res.C, mat = C && C.cfg && C.cfg.materia; if (mat !== 'pelu' || !D || !D.modulos) return Promise.resolve(D);
    var tareas = catalogo().map(function (t) { return { t: t, M: D.modulos.filter(function (m) { return m.id === t.unidad; })[0] }; }).filter(function (x) { return x.M; });
    var i = 0, ins = {};   /* en el orden del catálogo, al principio de la unidad */
    return new Promise(function (ok) {
      (function sig() {
        if (i >= tareas.length) return ok(D);
        var T = tareas[i++];
        if (aviso) aviso('Curso premium: técnica ' + T.t.n + '…');
        construir(T.t.id).then(function (E) {
          if (!E || T.M.lecciones.some(function (l) { return l.id === T.M.id + '__' + T.t.id; })) return;
          /* Fátima, 9-10-2026: sin lecciones repetidas. Si la unidad ya tiene la lección de Estudios de esta técnica
             (id <unidad>__<técnica>), no se añade otra con la misma técnica.
             Fátima, 10-10-2026: esa lección (mismo nombre, mismo sitio) pasa a llevar las escenas animadas nuevas
             (zigzag, arranque, cómo queda, alisado a 0°, gorro, neutralizar…) en vez de los fotogramas fijos de Estudios. */
          var vieja = /^cb_/.test(T.t.id) ? T.M.lecciones.filter(function (l) { return l.id === T.M.id + '__' + T.t.id.slice(3); })[0] : null;
          D.anim = D.anim || {}; D.img = D.img || {};
          Object.keys(E.fondos).forEach(function (v) { D.img['dg_' + v] = E.fondos[v]; });
          var esc = E.escenas.map(function (e) { var k = T.t.id + '_' + e.tipo; D.anim[k] = e.anim; return { tipo: 'paso', id: 'dg_' + e.vista, t: e.t, texto: e.texto, rot: [], anim: k }; });
          var ult = esc[esc.length - 1].id;
          E.preguntas.forEach(function (q) {
            esc.push({ tipo: 'pregunta', id: ult, t: 'Repaso', texto: 'Antes de seguir, piensa: ' + q.e, rot: [], q: { e: q.e, o: q.o, c: q.c }, sol: 'La respuesta es: ' + q.o[q.c] + '.' + (q.x ? ' ' + q.x : '') });
            if (T.M.test && !T.M.test.some(function (x) { return x.e === q.e; })) T.M.test.push({ e: q.e, o: q.o, c: q.c });
          });
          if (vieja) { vieja.escenas = esc; vieja.video = 1; vieja.animada = 1; return; }
          var pag = (T.M.lecciones[0] || {}).pag;
          var pos = ins[T.M.id] || 0; ins[T.M.id] = pos + 1;
          T.M.lecciones.splice(pos, 0, { id: T.M.id + '__' + T.t.id, t: (T.t.pre || 'Técnica paso a paso · ') + E.R.n, pag: pag, video: 1, escenas: esc });
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

  window.EU_PARTICIONES = { TECNICAS: TECNICAS, catalogo: catalogo, tecnica: tecnica, construir: construir, construirYa: construirYa, lecciones: lecciones, registrar: registrar,
    /* ayudantes de dibujo para los módulos que registran técnicas (mismos trazos que las del Cerebro) */
    ayudas: { escAplicar: escAplicar, escCierre: escCierre, zona: zona, mecha: mecha, NIVEL: NIVEL } };
})();
