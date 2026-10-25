/* b6_pelu_receta.js — lecciones «receta» de Peluquería (window.EU_PELU_RECETA).
   Fátima, 25-10-2026: «una imagen + el maniquí + la técnica + la explicación, bien organizado como un libro de recetas»,
   «el vídeo y la animación en una sola pantalla, uno detrás del otro», «cada imagen da su lección, no imágenes sueltas»,
   «cada clase tiene su técnica: una clase, un corte», «comenzamos con el corte tal: la clase, la visualización, la práctica y
   cómo queda», «en el tinte, da un ejemplo de cómo se saca la cuenta».
   - Curso: cada lección va en este orden: Clase → Visualización (las escenas del maniquí) → Práctica (preguntas) → Cómo queda.
     Cada paso lleva al lado SU foto de la galería (e.foto) solo si enseña lo mismo que el maniquí; si hay vídeo, la lección
     empieza con el vídeo y sigue sola con la animación (L.mp4 + L.siguen; el reproductor está en b6_curso_premium.js).
   - Libro: página `pe_receta`, una por paso, en el mismo orden.
   Primera entrega: lecciones de muestra para que Fátima las revise. Los textos son los del sistema (sus fichas, su cerebro de
   colorimetría y lo que ella ha dicho). `cfg.acab.receta='no'` lo apaga. */
(function () {
  'use strict';
  if (window.EU_PELU_RECETA) return;

  /* foto: n.º de su Galería web, o [n.º, parte de arriba que no se ve] (el rótulo de la ficha que no corresponde a la clase) */
  var R = {
    basico_cuadrado: {
      k: 'corte', n: 'Corte cuadrado recto', lec: '__basico_cuadrado', mp4: 'clases/lavado.mp4',
      receta: function (DG) { return DG.receta('basico_cuadrado'); },
      d: 'Corte básico sin elevación: todo a 0°, la misma medida en cada mechón. Atrás queda cuadrado.',
      fotos: { clase: 71, lavado: 469, queda_nuca: 71, queda_frente: 71 }   /* Fátima: la n.º 64 es en semi-U, no cuadrada: va con el corte redondo */
    },
    /* Fátima: «la próxima clase, corte cuadrado en capas: el corte en capa larga, pero con forma cuadrada»; «en un corte recto no
       se saca la guía desde arriba de la ceja: se nivela con el de atrás» (R.nivelar). Va en su módulo de capas. */
    cuadrado_capas: {
      k: 'corte', n: 'Corte cuadrado en capas', lec: '__receta_cuadrado_capas', modulo: 'pe_u_c_capas',
      receta: function (DG) { return Object.assign({}, DG.receta('capas_largas'), { n: 'Corte cuadrado en capas', linea: 'recta', nivelar: true }); },
      d: 'El corte en capas largas, pero con forma cuadrada atrás. De frente se nivela con el de atrás. Capas largas: melena larga con movimiento repartido y el largo intacto.',
      fotos: { lavado: 469 }
    },
    /* Fátima: «una clase, una técnica»: el corte redondo en su clase y el flequillo de lado en la suya */
    redondo: {
      k: 'corte', n: 'Corte redondo', lec: '__basico_redondeado', tras: '__basico_cuadrado',
      receta: function (DG) { return Object.assign({}, DG.receta('basico_redondeado'), { n: 'Corte redondo', emparejar: 'atras' }); },
      d: 'Corte básico sin elevación: todo a 0°, la misma medida en cada mechón; atrás queda redondeado. Para cortar todo redondo se divide la parte de adelante y la parte de atrás, para no confundirse: cuando se corta de frente se empareja con el de atrás.',
      fotos: { clase: 64, lavado: 469, queda_nuca: 64, queda_lateral: 64 }
    },
    /* su foto n.º 50: «flequillo de lado; se saca debajo del ojo, colocándolo en triángulo, cortando en triángulo, y se peina de
       lado; no se le dejan huecos al maniquí» */
    fleco_lado: {
      k: 'fleco', n: 'Flequillo de lado', lec: '__receta_fleco_lado', modulo: 'pe_u_c_flequillos', pre: 'rc_fleco_',
      d: 'Flequillo de lado. Se saca más abajo de los ojos, colocándolo en triángulo, cortando en triángulo. Y se peina de lado, sin dejar huecos.',
      fotos: { clase: [50, 0.13], peinado: [50, 0.13] }
    },
    /* Fátima: «en el tinte no expliques la decoloración»; las canas van en su propia clase, después */
    color_global: {
      k: 'tec', id: 'cb_color_global', cer: 'color_global', n: 'Tinte · color global', lec: '__color_global', pre: 'cb_color_global_',
      quitaT: /cubrir las canas/i,
      fotos: { cb_receta: 478, cb0_divisiones: 379, cb_lam_plantaCuatro: 330, cb1_aplicacion: 479, cb2_aplicacion: 301, cb_queda_color: 96 },
      /* su clase del peróxido (fat_p01) solo con lo que es del tinte, y su recomendación de 20/30 vol de la ficha;
         después, el ejemplo de cómo se saca la cuenta (fat_p02) */
      insertar: [{ tras: 'cb_receta', tipo: 'oxidante', t: 'El oxidante (peróxido) en el tinte', foto: 495, clase: 'fat_p01', solo: [0, 1, 2, 3, 7], rec: [1], tools: [0, 1, 2, 4, 5] }],
      ejemplos: 'cb_receta'
    },
    /* clase siguiente: las dos fórmulas del mismo tinte (sus textos: Cerebro y fat_i02) */
    tinte_canas: {
      k: 'canas', n: 'Tinte para cubrir canas', lec: '__receta_canas', pre: 'rc_canas_', tras: '__color_global',
      fotos: { formulas: 314, cb0_divisiones: 379, raiz: 254, puntas: 313, cb_queda_color: 97 }
    }
  };
  var ETAPAS = { clase: 'Clase', vis: 'Visualización', practica: 'Práctica', queda: 'Cómo queda' };

  function G() { return window.EU_PELU_GALERIA; }
  function foto(n) {
    var c = 0; if (Array.isArray(n)) { c = n[1] || 0; n = n[0]; }
    var g = G(); if (!g || !n) return null; var id = g.id(n), d = g.dato(id); return d ? { id: id, src: d, t: g.titulo(n), rec: c } : null;
  }
  function clase(id) { var B = window.EU_COLOR_CEREBRO, c = null; (B && B.clases || []).some(function (x) { if (x.id === id) { c = x; return true; } return false; }); return c; }
  function limpio(t) { return String(t).replace(/^[^\wÁÉÍÓÚÑáéíóúñ¿¡]+/, ''); }
  /* puntos de una clase de su cerebro de colorimetría, tal cual (sin el icono del principio); `a.solo` = cuáles */
  function puntosDe(a) {
    var c = clase(a.clase); if (!c) return [];
    var b = c.b.filter(function (x, i) { return !a.solo || a.solo.indexOf(i) >= 0; }).map(function (x) { return [x[0], limpio(x[1])]; });
    var F = a.rec && window.EU_CEREBRO && EU_CEREBRO.ficha && EU_CEREBRO.ficha(R.color_global.cer);
    (a.rec || []).forEach(function (k) { if (F && F.recomendaciones && F.recomendaciones[k]) b.push(['importante', F.recomendaciones[k]]); });
    return b;
  }
  function textoDe(a) { return puntosDe(a).map(function (b) { return b[1]; }).join(' '); }
  function toolsDe(a) { var c = clase(a.clase); return (c && c.tools || []).filter(function (x, i) { return !a.tools || a.tools.indexOf(i) >= 0; }); }
  function activo(cfg) { return cfg && cfg.materia === 'pelu' && ((cfg.acab || {}).receta) !== 'no'; }

  /* ─────────── escenas propias (maniquí del motor) ─────────── */
  var NIV = function (k) { var A = window.EU_PARTICIONES && EU_PARTICIONES.ayudas; return A ? A.NIVEL[k] : '#8A5A33'; };
  /* la clase de canas: el producto se ve en el cabello. Mismo tinte, dos fórmulas: la fuerte (más tinte, menos peróxido) en la
     raíz, tres dedos; la diluida desde ahí hasta las puntas */
  var C_FUERTE = '#8A5A33', C_DILUIDO = 'rgba(168,116,67,0.55)', C_CANA = '#E9E9E9', C_LINEA = '#1F1B18', RAIZ = 0.25;
  function escCanas(K, fase) {
    var A = window.EU_PARTICIONES.ayudas, v = 'nuca', tr = [], filas = [1.85, 1.6, 1.35, 1.1], cols = [-0.75, -0.45, -0.15, 0.15, 0.45, 0.75], nf = filas.length;
    filas.forEach(function (th, f) {
      var ta = 0.06 + f * 0.86 / nf, tb = ta + 0.86 / nf;
      tr = tr.concat(K.lineas(K.tramos(v, function (u) { return [K.NUCA - 0.85 + u * 1.7, th]; }, 30), fase ? [ta, ta + 0.04] : [0, 0.02], C_LINEA, 2));
      cols.forEach(function (d, j) {
        var ph = K.NUCA + d, t0 = ta + 0.04 + j * 0.01;
        var raiz = A.mecha(K, v, ph, th, 0, RAIZ), resto = A.mecha(K, v, ph, th, RAIZ, 1);
        if (fase === 0) { if (raiz) tr.push(K.linea(raiz, [0.05 + f * 0.04, 0.08 + f * 0.04], C_CANA, 4)); return; }
        if (fase === 1) { if (raiz) { tr.push(K.linea(raiz, [0, 0.01], C_CANA, 4)); tr.push(K.linea(raiz, [t0, tb], C_FUERTE, 8)); } return; }
        if (raiz) tr.push(K.linea(raiz, [0, 0.01], C_FUERTE, 8));
        if (resto) tr.push(K.linea(resto, [t0, tb], C_DILUIDO, 7));
      });
    });
    if (fase === 0) tr.push(K.rotulo('Las canas, en la raíz: tres o cuatro dedos', '#7A7A7A', 0.04), K.rotulo('Fórmula 1 · raíz: más tinte, menos peróxido · 20 vol', C_FUERTE, 0.3), K.rotulo('Fórmula 2 · resto: el mismo tinte, bien diluido · 20 + 30 vol', '#A87443', 0.55));
    if (fase === 1) tr.push(K.rotulo('Fórmula fuerte · solo en la raíz, tres dedos', C_FUERTE, 0.04), K.rotulo('De la nuca hacia arriba, capa por capa', C_LINEA, 0.04));
    if (fase === 2) tr.push(K.rotulo('Fórmula diluida · de los tres dedos a las puntas', '#A87443', 0.04), K.rotulo('La raíz ya cubierta con la fórmula fuerte', C_FUERTE, 0.04));
    return { v: v, tr: tr, banda: 1 };
  }
  /* el ejemplo de la cuenta (su clase fat_p02): el cabello con el tono de la clienta, la cuenta en tarjetas al lado y el resultado */
  function mezcla(a, b) { var h = function (c, i) { return parseInt(c.substr(1 + 2 * i, 2), 16); }, o = '#'; for (var i = 0; i < 3; i++) o += ('0' + Math.round((h(a, i) + h(b, i)) / 2).toString(16)).slice(-2); return o; }
  function escCuenta(K, ej) {
    var A = window.EU_PARTICIONES.ayudas, v = 'nuca', tr = [], phs = [];
    for (var ph0 = K.NUCA - 1.6; ph0 <= K.NUCA + 1.6; ph0 += 0.035) phs.push(ph0);
    var antes = ej === 1 ? NIV(6) : NIV(7), despues = ej === 1 ? mezcla(NIV(7), NIV(8)) : NIV(7);
    phs.forEach(function (ph, i) {
      var q = A.mecha(K, v, ph, 0.3, 0, 1); if (!q) return;
      tr.push(K.linea(q, [0, 0.03], antes, 4.2));
      if (ej === 1) tr.push(K.linea(q, [0.66 + 0.2 * i / phs.length, 0.74 + 0.2 * i / phs.length], despues, 4.2));
    });
    /* tarjetas de la cuenta, a la derecha del maniquí (como la carta de tonos) */
    var x0 = 850, y = 150, w = 62, h = 50, filas = ej === 1
      ? [[antes, 'Base de la clienta: 6', 0.08], [NIV(9), '+ tinte 9', 0.2], [null, '= 15', 0.32], [null, '15 ÷ 2 = 7,5', 0.44], [null, 'Peróxido 20 vol', 0.54], [despues, 'Resultado: 7,5', 0.66]]
      : [[NIV(7), '7.22', 0.08], [NIV(7), '+ 7.25', 0.2], [null, '= 14.47', 0.32], [null, '14.47 ÷ 2 = 7.235', 0.44], [null, 'Tres primeros números', 0.56], [NIV(7), 'Resultado: 7.23', 0.68]];
    filas.forEach(function (f) {
      if (f[0]) tr.push(A.zona([x0, y, x0 + w, y, x0 + w, y + h, x0, y + h], [f[2], f[2] + 0.05], f[0], 1, '#1F1B18'));
      tr.push(K.chapa([x0 + w + 92, y + h / 2], f[1], '#1F1B18', f[2] + 0.02)); y += h + 12;
    });
    tr.push(K.rotulo(ej === 1 ? 'Ejemplo: se suma la base de la clienta y el tinte, y se divide' : 'Ejemplo con reflejos: los números completos', '#1F1B18', 0.02),
      K.rotulo(ej === 1 ? 'Antes: base 6 · después: 7,5' : 'Se agarran los tres primeros números', '#18906A', 0.66));
    return { v: v, tr: tr, banda: 1 };
  }
  /* flequillo de lado: el triángulo (vértice en la raya de lado, base en el nacimiento de la frente) y el corte en triángulo,
     más abajo de los ojos: corto junto a la raya y largo hacia el otro lado */
  var C_TRI = '#C0392B';
  function escFleco(K, fase) {
    var v = 'frente', tr = [], R0 = K.CARA + 0.3, ap = K.P(R0, 0.32, 1.06), b1 = K.P(K.CARA + 0.62, 1.0, 1.06), b2 = K.P(K.CARA - 0.6, 1.0, 1.06);
    var yOjo = -0.23, yNar = -0.4, yLab = -0.72;
    function yCorte(ph) { var u = Math.max(0, Math.min(1, (R0 + 0.3 - ph) / 1.2)); return yOjo + (yNar - yOjo) * u; }
    var tri = [K.pr(v, ap), K.pr(v, b1), K.pr(v, b2), K.pr(v, ap)];
    tr.push(K.linea(K.plano(tri), [0.04, 0.3], C_TRI, 3));
    for (var ph = K.CARA - 0.58; ph <= K.CARA + 0.6; ph += 0.04) {
      function hasta(yT) { var o = []; for (var th = 0.36; th < 2.2; th += 0.04) { var q = K.P(ph, th, 1.07); if (q.y < yT) break; if (K.seVe(v, ph, th)) o.push(K.pr(v, q)); } return o; }
      var largo = hasta(yLab), corto = hasta(yCorte(ph));
      if (largo.length > 1) tr.push(K.linea(K.plano(largo), fase ? [0, 0.02] : [0.32, 0.6], '#5A3A26', 1.4, fase ? { x: 0.62 } : {}));
      if (fase && corto.length > 1) tr.push(K.linea(K.plano(corto), [0.62, 0.8], '#5A3A26', 1.4));
    }
    if (fase === 2) return escFlecoPeinado(K, R0, yCorte);
    if (fase) {
      var cut = []; for (var p2 = K.CARA + 0.6; p2 >= K.CARA - 0.58; p2 -= 0.06) { var yc = yCorte(p2); for (var th2 = 0.36; th2 < 2.2; th2 += 0.04) { var q2 = K.P(p2, th2, 1.07); if (q2.y < yc) { if (K.seVe(v, p2, th2)) cut.push(K.pr(v, q2)); break; } } }
      if (cut.length > 1) { tr.push(K.tijera(K.plano(cut), [0.3, 0.6], C_TRI, false)); tr.push(K.linea(K.plano(cut), [0.62, 0.8], C_TRI, 3)); }
      tr.push(K.rotulo('Se corta en triángulo, más abajo de los ojos', C_TRI, 0.3));
    } else tr.push(K.rotulo('El flequillo se saca en triángulo', C_TRI, 0.04), K.rotulo('Se peina hacia delante, sobre la cara', '#5A3A26', 0.32));
    return { v: v, tr: tr, banda: 1 };
  }
  /* «se peina de lado, sin dejar huecos»: raya de lado; el flequillo cruza la frente desde la raya y acaba en la línea del corte; el
     resto del cabello cae a los lados del rostro, en líneas, como el resultado de los cortes */
  function escFlecoPeinado(K, R0, yCorte) {
    var v = 'frente', tr = [], PELO = '#5A3A26', yLargo = -1.62, fin = [];
    tr = tr.concat(K.lineas(K.tramos(v, function (u) { return [R0, u * 0.3]; }, 12), [0, 0.03], '#1F1B18', 2.4));
    /* el cabello de los lados: desde arriba, peinado hacia su lado, hasta el largo del corte */
    for (var ph = K.CARA - 1.3; ph <= K.CARA + 1.3; ph += 0.045) {
      var dC = Math.atan2(Math.sin(ph - K.CARA), Math.cos(ph - K.CARA)); if (dC > -0.95 && dC < 0.62) continue;
      var lado = dC >= 0 ? 1 : -1, o = [], ult = null;
      for (var t = 0.06; t <= 1.28; t += 0.07) { var p2 = Math.abs(dC) < 0.62 ? K.CARA + lado * Math.min(0.62, Math.abs(dC) + t * 0.5) : ph; if (!K.seVe(v, p2, t)) continue; ult = K.P(p2, t, 1.06); o.push(K.pr(v, ult)); }
      if (ult && ult.y > yLargo) o.push(K.pr(v, K.V3(ult.x * 1.03, yLargo, ult.z * 1.03)));
      if (o.length > 1) tr.push(K.linea(K.plano(o), [0.05, 0.45], PELO, 1.3));
    }
    /* el flequillo: de la raya hacia el otro lado, en diagonal, hasta la línea del corte */
    var lejos = K.CARA - 0.95;
    var cerca = K.CARA + 0.6;
    for (var pe = cerca; pe >= lejos; pe -= 0.022) {
      /* del lado de la raya, un poco más abajo del ojo; hacia el otro lado, más largo (en triángulo) */
      var u = (cerca - pe) / (cerca - lejos), yE = -0.22 + (-0.62 + 0.22) * u * u, thE = 0.08; for (; thE < 2.2; thE += 0.02) if (K.P(pe, thE, 1.07).y < yE) break;
      var f = []; for (var w = 0; w <= 1.0001; w += 0.04) { var pw = R0 + (pe - R0) * Math.sqrt(w), tw = 0.06 + (thE - 0.06) * Math.pow(w, 1.6); if (K.seVe(v, pw, tw)) f.push(K.pr(v, K.P(pw, tw, 1.08 + 0.04 * Math.sin(Math.PI * w)))); }
      if (f.length > 1) { tr.push(K.linea(K.plano(f), [0.45, 0.75], PELO, 1.3)); fin.push(f[f.length - 1]); }
    }
    fin.sort(function (p, q) { return p[0] - q[0]; });
    if (fin.length > 1) tr.push(K.linea(K.plano(fin), [0.75, 0.9], C_TRI, 3), K.chapa(fin[Math.floor(fin.length / 2)], 'Flequillo · más abajo de los ojos', C_TRI, 0.8));
    tr.push(K.rotulo('Raya de lado: el flequillo se peina de lado, sin huecos', '#1F1B18', 0.02));
    return { v: v, tr: tr, banda: 1 };
  }
  var CACHE_E = {};
  function flecoE() {
    if (CACHE_E.fleco) return CACHE_E.fleco;
    var DG = window.EU_DIAGRAMA; if (!DG || !DG.construirYa) return null;
    var EN = null;
    try { EN = DG.construirConYa(function (K) { return { R: { id: 'rc_fleco', n: 'Flequillo de lado' }, escenas: [
      { tipo: 'triangulo', vista: 'frente', t: 'Se saca en triángulo', texto: 'El flequillo se saca en triángulo, desde la raya de lado.', a: escFleco(K, 0) },
      { tipo: 'corte', vista: 'frente', t: 'Se corta en triángulo, más abajo de los ojos', texto: 'Se corta en triángulo, más abajo de los ojos.', a: escFleco(K, 1) },
      { tipo: 'peinado', vista: 'frente', t: 'Se peina de lado', texto: 'Y se peina de lado, sin dejar huecos.', a: escFleco(K, 2) }] }; }); } catch (e) { EN = null; }
    if (!EN) return null;
    return (CACHE_E.fleco = { R: { n: 'Flequillo de lado' }, escenas: EN.escenas, fondos: EN.fondos, preguntas: [] });
  }
  function ejemplosE() {
    if (CACHE_E.ej) return CACHE_E.ej;
    var DG = window.EU_DIAGRAMA, c = clase('fat_p02'); if (!DG || !window.EU_PARTICIONES || !c) return null;
    var b = c.b.map(function (x) { return limpio(x[1]); }), E = null;
    try { E = DG.construirConYa(function (K) { return { R: { id: 'rc_cuenta', n: 'Cómo sacar la cuenta' }, escenas: [
      { tipo: 'cuenta1', vista: 'nuca', t: 'Ejemplo · cómo se saca la cuenta', texto: [b[0], b[1], b[2], b[4]].join(' '), a: escCuenta(K, 1) },
      { tipo: 'cuenta2', vista: 'nuca', t: 'Ejemplo · tintes con reflejo', texto: [b[5], b[3], b[6]].join(' '), a: escCuenta(K, 2) }] }; }); } catch (e) { E = null; }
    return E ? (CACHE_E.ej = E) : null;
  }
  function canasE() {
    if (CACHE_E.canas) return CACHE_E.canas;
    var DG = window.EU_DIAGRAMA, PA = window.EU_PARTICIONES, CB = window.EU_CEREBRO; if (!DG || !PA || !PA.ayudas || !CB) return null;
    var EB = null; try { EB = PA.construirYa('cb_color_global'); } catch (e) { EB = null; }
    var EN = null; try { EN = DG.construirConYa(function (K) { return { R: { id: 'rc_canas', n: R.tinte_canas.n }, escenas: [
      { tipo: 'formulas', vista: 'nuca', t: 'Dos fórmulas del mismo tinte', a: escCanas(K, 0) },
      { tipo: 'raiz', vista: 'nuca', t: 'Raíz · la fórmula fuerte', a: escCanas(K, 1) },
      { tipo: 'puntas', vista: 'nuca', t: 'De los tres dedos a las puntas · la fórmula diluida', a: escCanas(K, 2) }] }; }); } catch (e) { EN = null; }
    if (!EB || !EN) return null;
    var paso = function (re) { var x = (CB.pasos('color_global') || []).filter(function (p) { return re.test(p.t); })[0]; return x ? x.n : ''; };
    var F = CB.ficha('color_global') || {}, rec = F.recomendaciones || [], c = clase('fat_i02'), b = c ? c.b.map(function (x) { return limpio(x[1]); }) : [];
    var de = function (re) { return EB.escenas.filter(function (e) { return re.test(e.tipo); })[0]; };
    var copia = function (e, t, tx) { return e ? Object.assign({}, e, { t: t || e.t, texto: tx || e.texto }) : null; };
    var nv = {}; EN.escenas.forEach(function (e) { nv[e.tipo] = e; });
    /* el ejemplo de cantidades es suyo (fat_i02): la mitad del tinte, 50 gramos, con peróxido de 20, solo en la raíz */
    nv.formulas.texto = [b[0], rec[2], b[1]].filter(Boolean).join(' ');
    nv.raiz.texto = [paso(/canas · raíz/), b[2]].filter(Boolean).join(' ');
    nv.puntas.texto = paso(/canas · hasta las puntas/);
    var esc = [nv.formulas, copia(de(/divisiones$/)), nv.raiz, nv.puntas,
      copia(de(/_tiempo$/), 'Exposición', b[4]), copia(de(/_cierre$/), 'Retirar, lavar y terminar', b[5]), copia(de(/^cb_queda_color$/))].filter(function (e) { return e && e.texto; });
    return (CACHE_E.canas = { R: EN.R, escenas: esc, fondos: EN.fondos, preguntas: [] });
  }
  function corteE(k) {
    if (CACHE_E[k]) return CACHE_E[k];
    var DG = window.EU_DIAGRAMA, r = R[k]; if (!DG || !DG.construirYa || !r.receta) return null;
    var E = null; try { E = DG.construirYa(r.receta(DG)); } catch (e) { console.warn('Receta', k, e); }
    return E ? (CACHE_E[k] = E) : null;
  }

  /* ─────────── la lección en su orden: clase, visualización, práctica, cómo queda ───────────
     Devuelve los pasos con su etapa: { etapa, tipo, t, texto, e (escena del motor, si la hay), foto, puntos, tools, q } */
  function esQueda(e) { return /^queda_|^cb_queda_color$/.test(e.tipo || ''); }
  function pasosDe(k) {
    var r = R[k], E = null, P = [];
    if (r.k === 'corte') {
      E = corteE(k); if (!E) return [];
      var fin = E.escenas.filter(esQueda), fr = fin.filter(function (e) { return e.tipo === 'queda_frente'; })[0] || fin[0];
      var pila = (E.R.capas && E.R.capas.pila) || [];
      P.push({ etapa: 'clase', tipo: 'clase', t: r.n, texto: r.d + ' Capas de abajo arriba: ' + pila.map(function (g) { return g + '°'; }).join(', ') + '.', e: fr, foto: foto(r.fotos.clase), ficha: 1 });
      E.escenas.filter(function (e) { return !esQueda(e); }).forEach(function (e) { P.push({ etapa: 'vis', tipo: e.tipo, t: e.t, texto: e.texto, e: e, foto: foto(r.fotos[e.tipo]) }); });
      (E.preguntas || []).forEach(function (q) { P.push({ etapa: 'practica', tipo: 'pregunta', t: 'Pregunta', texto: q.e, q: q }); });
      fin.forEach(function (e) { P.push({ etapa: 'queda', tipo: e.tipo, t: e.t, texto: e.texto, e: e, foto: foto(r.fotos[e.tipo]) }); });
    } else if (r.k === 'fleco') {
      E = flecoE(); if (!E) return [];
      var ult = E.escenas[E.escenas.length - 1];
      P.push({ etapa: 'clase', tipo: 'clase', t: r.n, texto: r.d, e: ult, foto: foto(r.fotos.clase) });
      E.escenas.forEach(function (e, i) { P.push({ etapa: i === E.escenas.length - 1 ? 'queda' : 'vis', tipo: e.tipo, t: e.t, texto: e.texto, e: e, foto: foto(r.fotos[e.tipo]) }); });
    } else if (r.k === 'canas') {
      E = canasE(); if (!E) return [];
      E.escenas.forEach(function (e, i) { P.push({ etapa: esQueda(e) ? 'queda' : i === 0 ? 'clase' : 'vis', tipo: e.tipo, t: e.t, texto: e.texto, e: e, foto: foto(r.fotos[e.tipo]) }); });
    } else {
      var LA = window.EU_PELU_LIBRO_ANIM, d2 = null; try { d2 = LA && LA.datos(r.id); } catch (er) { d2 = null; }
      E = d2 && d2.E; if (!E) return [];
      var ej = r.ejemplos ? ejemplosE() : null, enClase = true;
      E.escenas.forEach(function (e) {
        if (r.quitaT && r.quitaT.test(e.t || '')) return;
        if (esQueda(e)) return;
        if (enClase && e.tipo !== 'cb_receta') enClase = false;
        P.push({ etapa: enClase ? 'clase' : 'vis', tipo: e.tipo, t: e.t, texto: e.texto, e: e, foto: foto(r.fotos[e.tipo]), ficha: e.tipo === 'cb_receta' ? 1 : 0 });
        (r.insertar || []).forEach(function (a) { if (a.tras === e.tipo) { var b = puntosDe(a); if (b.length) P.push({ etapa: 'clase', tipo: a.tipo, t: a.t, texto: textoDe(a), puntos: b, tools: toolsDe(a), foto: foto(a.foto) }); } });
        if (ej && r.ejemplos === e.tipo) ej.escenas.forEach(function (x) { P.push({ etapa: 'clase', tipo: x.tipo, t: x.t, texto: x.texto, e: x }); });
      });
      (E.preguntas || []).forEach(function (q) { P.push({ etapa: 'practica', tipo: 'pregunta', t: 'Pregunta', texto: q.e, q: q }); });
      E.escenas.filter(esQueda).forEach(function (e) { P.push({ etapa: 'queda', tipo: e.tipo, t: e.t, texto: e.texto, e: e, foto: foto(r.fotos[e.tipo]), recom: 1 }); });
    }
    P.E = E;
    return P;
  }
  var CACHE = {};
  function pasos(k) { return CACHE[k] || (CACHE[k] = pasosDe(k)); }

  /* ─────────── curso ─────────── */
  function curso(D) {
    if (!D || !D.modulos || D._receta) return D;
    var V = (window.EU_PELU_VIDEOS && window.EU_PELU_VIDEOS.VIDEOS) || {};
    D.img = D.img || {}; D.anim = D.anim || {};
    Object.keys(R).forEach(function (k) {
      var r = R[k], P = pasos(k); if (!P.length) return;
      var M0 = null, iL = -1, L = null;
      D.modulos.some(function (M) { return M.lecciones.some(function (l, i) { if (l.id === M.id + r.lec) { M0 = M; iL = i; L = l; return true; } return false; }); });
      if (!L && r.tras) D.modulos.some(function (M) { return M.lecciones.some(function (l, i) { if (l.id === M.id + r.tras) { M0 = M; iL = i; return true; } return false; }); });
      if (!L && !M0 && r.modulo) D.modulos.some(function (M) { if (M.id !== r.modulo) return false; M0 = M; iL = -1; M.lecciones.forEach(function (l, i) { if (/__(video|bienvenida|clase\d+)$/.test(l.id) && i === iL + 1) iL = i; }); return true; });
      if (!M0) return;
      Object.keys(P.E.fondos || {}).forEach(function (v) { D.img['dg_' + v] = D.img['dg_' + v] || P.E.fondos[v]; });
      if (P.some(function (p) { return p.e && p.e.tipo && /^cuenta/.test(p.e.tipo); })) { var EJ = ejemplosE(); Object.keys(EJ.fondos || {}).forEach(function (v) { D.img['dg_' + v] = D.img['dg_' + v] || EJ.fondos[v]; }); }
      var visto = {}, esc = P.map(function (p) {
        var x;
        if (p.q) x = { tipo: 'pregunta', id: 'dg_lateral', t: 'Pregunta', texto: 'Antes de seguir, piensa: ' + p.q.e, rot: [], q: { e: p.q.e, o: p.q.o, c: p.q.c }, sol: 'La respuesta es: ' + p.q.o[p.q.c] + '.' + (p.q.x ? ' ' + p.q.x : '') };
        else if (p.e) { var key = 'rc_' + k + '_' + p.tipo; D.anim[key] = p.e.anim; x = { tipo: 'paso', id: 'dg_' + p.e.vista, t: p.t, texto: p.texto, rot: [], anim: key }; }
        else x = { tipo: 'paso', id: p.foto ? p.foto.id : 'dg_frente', t: p.t, texto: p.texto, rot: [] };
        if (p.foto) { D.img[p.foto.id] = p.foto.src; if (p.e || p.q) { x.foto = p.foto.id; if (p.foto.rec) x.fotoRec = p.foto.rec; } }
        /* la etapa se dice en el título del primer paso de cada una */
        if (!visto[p.etapa]) { visto[p.etapa] = 1; if (p.etapa !== 'queda') x.t = ETAPAS[p.etapa] + ' · ' + x.t; }
        return x;
      });
      if (L) { L.escenas = esc; L.t = r.n; }
      else { L = { id: M0.id + r.lec, t: r.n, pag: M0.pag, escenas: esc }; M0.lecciones.splice(iL + 1, 0, L); }
      if (r.mp4 && V[r.mp4]) { L.mp4 = r.mp4; L.siguen = 1; }
      L.receta = 1;
    });
    D._receta = 1;
    return D;
  }
  var CA;
  function enganchar() {
    CA = window.EU_CURSO_ANIM;
    if (!CA || !CA.enriquecer || !window.EU_PELU_VIDEOS) return false;
    if (CA.enriquecer._receta) return true;
    var enr = CA.enriquecer;
    CA.enriquecer = function (D, res) {
      return Promise.resolve(enr.apply(this, arguments)).then(function (D2) {
        var X = D2 || D, cfg = res && res.C && res.C.cfg;
        return activo(cfg) ? curso(X) : X;
      });
    };
    CA.enriquecer._receta = 1;
    return true;
  }
  if (!enganchar()) (function espera(n) { if (!enganchar() && n < 200) setTimeout(function () { espera(n + 1); }, 300); })(0);

  /* ─────────── libro: una hoja por paso ─────────── */
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  var ALT_N = { cejas: 'bajo las cejas', ojo: 'bajo el ojo', nariz: 'bajo la nariz', labio: 'bajo el labio', barbilla: 'en la barbilla', rostro: 'donde termina el rostro', cuello: 'en el cuello' };
  var CORTE_ELEV = /capas|angulos|peinado|lateral|frente|emparejar|guia|queda/;
  var ICONO = { alerta: '⚠', importante: '📌', tip: '💡' };
  function chip(T, a, b) { return '<span style="display:inline-block;margin:0 1.2mm 1.2mm 0;padding:.5mm 2.2mm;border-radius:99px;background:' + T.soft + ';white-space:nowrap"><b style="color:' + T.acc + '">' + a + '</b> ' + b + '</span>'; }
  function caja(T, tit, html) { return '<div style="margin:4mm 0 0;padding:3mm 4mm;border-left:1.2mm solid ' + T.acc + ';background:' + T.soft + ';border-radius:0 2mm 2mm 0;font-size:.84em;line-height:1.45"><div style="font-weight:700;letter-spacing:.06em;text-transform:uppercase;font-size:.85em;color:' + T.acc + ';margin:0 0 1.5mm">' + tit + '</div>' + html + '</div>'; }
  /* ficha del corte: solo lo que dice su receta del motor (capas y su elevación, secciones, guía, línea, flequillo, acabado) */
  function fichaCorte(R0, T) {
    if (!R0) return '';
    var pila = (R0.capas && R0.capas.pila) || [];
    return caja(T, 'Ficha del corte',
      '<div style="margin:0 0 1mm"><b>Capas de abajo arriba:</b></div><div>' + pila.map(function (g, z) { return chip(T, 'Mechón ' + (z + 1), g + '°'); }).join('') + '</div>' +
      '<div><b>Secciones:</b> ' + (R0.oblicua ? 'oblicuas' : R0.liso ? 'horizontales (liso extremo)' : 'según su línea') + ' · <b>Lateral:</b> dividido de oreja a oreja</div>' +
      (R0.fleco === 'lado' ? '<div><b>Flequillo:</b> de lado, sacado en triángulo y cortado en triángulo, debajo del ojo</div>' : R0.altura ? '<div><b>Guía del frente:</b> a 0°, ' + esc(ALT_N[R0.altura] || R0.altura) + '</div>' : '') +
      (R0.linea ? '<div><b>Línea de corte:</b> ' + (R0.linea === 'recta' ? 'recta (queda cuadrado)' : R0.linea === 'v' ? 'en V (queda en punta)' : R0.linea === 'u' ? 'en U' : R0.linea === 'a' ? 'en A (V invertida)' : 'redondeada') + '</div>' : '') +
      '<div><b>Acabado:</b> ' + (R0.desg ? 'desgrafilado' : 'recto') + '</div>');
  }
  /* ficha del tinte: la de su técnica en el Cerebro del Estudio */
  function fichaTinte(id, T) {
    var F = window.EU_CEREBRO && EU_CEREBRO.ficha && EU_CEREBRO.ficha(id); if (!F) return '';
    var fila = function (k, v) { return v && (v.length || v) ? '<div><b>' + k + ':</b> ' + esc([].concat(v).join(' · ')) + '</div>' : ''; };
    return caja(T, 'Ficha de la técnica', fila('Fórmula', F.formula) + fila('Proporción', F.proporciones) + fila('Cantidad', F.cantidades) + fila('Tiempo', F.tiempos) + fila('Herramientas', F.herramientas) + fila('Seguridad', F.seguridad));
  }
  function recomTinte(id, T) {
    var F = window.EU_CEREBRO && EU_CEREBRO.ficha && EU_CEREBRO.ficha(id); if (!F || !(F.recomendaciones || []).length) return '';
    return caja(T, 'Recomendaciones', '<ul style="margin:0;padding-left:5mm">' + F.recomendaciones.filter(function (x) { return !/canas/i.test(x); }).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>');
  }
  var MANI = {};
  function maniquí(p, rec) { if (!p.e) return ''; var k = rec + '|' + p.e.tipo + '|' + (p.e.t || ''); if (MANI[k] == null) { try { MANI[k] = window.EU_DIAGRAMA.foto(p.e, 760, 0.82) || ''; } catch (er) { MANI[k] = ''; } } return MANI[k]; }

  var ED = window.EU_EDITORIAL;
  if (ED && ED.registrar) {
    ED.registrar({
      paginas: {
        pe_receta: function (pg, C) {
          var H = ED.H, T = C.T || {}, r = R[pg.rec], P = pasos(pg.rec);
          if (!r || !P.length) return '';
          T = { acc: T.acc || '#B08D57', soft: T.soft || '#EEF0F3' };
          var alto = ((C.papel && C.papel.h) || 297) >= 250, kick = function (et, txt) { return '<div style="font-size:.74em;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:' + T.acc + ';margin:0 0 1.5mm">' + esc(r.n) + ' · ' + ETAPAS[et] + (txt ? ' · ' + txt : '') + '</div>'; };
          /* práctica: todas las preguntas en una hoja, con las respuestas al pie */
          if (pg.practica) {
            var qs = P.filter(function (p) { return p.q; });
            return H.cabecera(C, pg) + kick('practica') + H.h1(C, 'Practica lo que has visto') +
              '<ol style="margin:0;padding-left:6mm;font-size:.98em;line-height:1.5">' + qs.map(function (p) { return '<li style="margin:0 0 3.5mm"><b>' + esc(p.q.e) + '</b><div style="margin-top:1mm">' + p.q.o.map(function (o, i) { return '<span style="display:inline-block;margin:0 4mm 1mm 0">' + String.fromCharCode(97 + i) + ') ' + esc(o) + '</span>'; }).join('') + '</div></li>'; }).join('') + '</ol>' +
              caja(T, 'Respuestas', qs.map(function (p, i) { return '<div>' + (i + 1) + '. ' + String.fromCharCode(97 + p.q.c) + ') ' + esc(p.q.o[p.q.c]) + (p.q.x ? ' · ' + esc(p.q.x) : '') + '</div>'; }).join('')) + H.folio(C, pg);
          }
          var p = P[pg.paso]; if (!p) return '';
          var extra = '';
          if (r.k === 'corte') { if (p.ficha || CORTE_ELEV.test(p.tipo)) extra = fichaCorte(P.E && P.E.R, T); }
          else if (r.cer && p.ficha) extra = fichaTinte(r.cer, T);
          else if (r.cer && p.recom) extra = recomTinte(r.cer, T);
          if (p.tools && p.tools.length) extra += caja(T, 'Lo que necesitas', p.tools.map(function (x) { return chip(T, '', esc(x)); }).join(''));
          /* la foto arriba y el maniquí debajo, cada uno a todo lo ancho que quepa (como un libro de recetas);
             se achican si la hoja lleva ficha o el texto es largo */
          var menos = (extra ? 16 : 0) + ((p.texto || '').length > 300 ? 10 : 0);
          var hF = alto ? 84 - menos : 50, hM = alto ? 98 - menos : 56, mani = maniquí(p, pg.rec);
          var fig1 = function (src, alt, h, rec) {
            var img = rec ? '<div style="height:' + h + 'mm;overflow:hidden"><img src="' + src + '" alt="' + esc(alt) + '" style="display:block;height:' + (h / (1 - rec)).toFixed(1) + 'mm;width:auto;max-width:none;margin-top:-' + (h * rec / (1 - rec)).toFixed(1) + 'mm"></div>'
              : '<img src="' + src + '" alt="' + esc(alt) + '" style="display:block;max-width:100%;width:auto;height:' + h + 'mm;object-fit:contain">';
            return '<figure style="margin:0 0 3mm;display:flex;justify-content:center;background:' + T.soft + ';border-radius:2mm;overflow:hidden">' + img + '</figure>';
          };
          var solo = p.puntos ? 84 : hF + hM, f = p.foto ? fig1(p.foto.src, p.foto.t, mani ? hF : solo, p.foto.rec) : '', m = mani ? fig1(mani, 'Maniquí · ' + p.t, p.foto ? hM : solo) : '';
          var cuerpo = p.puntos
            ? '<ul style="margin:0;padding-left:5mm;font-size:.96em;line-height:1.5">' + p.puntos.map(function (b) { var ic = ICONO[b[0]]; return '<li style="margin:0 0 1.2mm' + (ic ? ';list-style:none;margin-left:-5mm' : '') + '">' + (ic ? '<b>' + ic + '</b> ' : '') + (ic ? '<b>' + esc(b[1]) + '</b>' : esc(b[1])) + '</li>'; }).join('') + '</ul>'
            : '<div style="font-size:1.04em;line-height:1.6">' + esc(p.texto) + '</div>';
          var nEt = P.filter(function (x) { return x.etapa === p.etapa && !x.q; }), iEt = nEt.indexOf(p);
          return H.cabecera(C, pg) + kick(p.etapa, nEt.length > 1 ? 'paso ' + (iEt + 1) + ' de ' + nEt.length : '') +
            H.h1(C, esc(p.t)) + '<div style="margin:0 0 1.5mm">' + f + m + '</div>' + cuerpo + extra + H.folio(C, pg);
        }
      },
      voz: { pe_receta: function (pg) { var P = pasos(pg.rec); if (pg.practica) return P.filter(function (p) { return p.q; }).map(function (p) { return p.q.e; }).join(' '); var p = P[pg.paso]; return p ? p.t + '. ' + p.texto : ''; } }
    });
  }

  /* hojas de una técnica en su orden (la práctica en una sola hoja), para enseñárselas a Fátima antes de colocarlas en el libro */
  function hojas(k, base) {
    var out = [], prac = false;
    pasos(k).forEach(function (p, i) {
      if (p.q) { if (!prac) { prac = true; out.push({ tipo: 'pe_receta', rec: k, practica: 1, u: base && base.u, fill2: { nada: 1 } }); } return; }
      out.push({ tipo: 'pe_receta', rec: k, paso: i, u: base && base.u, fill2: { nada: 1 } });
    });
    return out;
  }

  window.EU_PELU_RECETA = { R: R, curso: curso, pasos: pasos, hojas: hojas };
})();
