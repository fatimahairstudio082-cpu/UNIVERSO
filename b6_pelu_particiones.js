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

  /* catálogo de técnicas como datos (las siguientes entregas se añaden aquí) */
  var TECNICAS = [
    { id: 'p_seis', n: 'Seccionado en 4 y 6 secciones · escala 0–225°', unidad: 'pe_u_base', uso: ['corte', 'color', 'queratina'], fn: seis, fuente: 'Diagramas de Fátima · formas de dividir un cabello, tipos de diagrama 0–225' }
  ];
  function tecnica(id) { return TECNICAS.filter(function (t) { return t.id === id; })[0] || null; }
  function construir(id) { var t = tecnica(id); return t ? DG.construirCon(t.fn) : Promise.resolve(null); }
  function construirYa(id) { var t = tecnica(id); return t ? DG.construirConYa(t.fn) : null; }

  /* ───────── curso premium: una lección «Diagramación · técnica» en su unidad (Peluquería) ───────── */
  function lecciones(D, res, aviso) {
    var C = res && res.C, mat = C && C.cfg && C.cfg.materia; if (mat !== 'pelu' || !D || !D.modulos) return Promise.resolve(D);
    var tareas = TECNICAS.map(function (t) { return { t: t, M: D.modulos.filter(function (m) { return m.id === t.unidad; })[0] }; }).filter(function (x) { return x.M; });
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

  window.EU_PARTICIONES = { TECNICAS: TECNICAS, tecnica: tecnica, construir: construir, construirYa: construirYa, lecciones: lecciones };
})();
