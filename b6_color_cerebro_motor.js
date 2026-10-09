/* b6_color_cerebro_motor.js — el cerebro de colorimetría de Fátima, animado (window.EU_COLOR_CEREBRO.tecnicas).
   Toma las clases de b6_color_cerebro_1/2.js (motores p1–p3 del repo «aprendizaje») y el cerebro con voz de la calculadora
   (b6_color_cerebro_3.js) y las convierte en técnicas del catálogo de EU_PARTICIONES: cada bloque de la clase es una escena
   del motor de diagramación, narrada con su texto literal:
   · paso (punto)  → la animación de su tema: liga de tonos con barra de proporción (mezclas), rueda de neutralización
                     (matización y corrección), pincel / papel / barrido / plancha / producto sobre el maniquí (tinte, mechas,
                     balayage, queratina, hidratación) o ficha de alerta (diagnóstico y alertas);
   · alerta        → «Por qué no» · importante → «Importante» · tip → «Consejo de Fátima» (solo texto, sin señales).
   Donde sus fuentes no coinciden, la escena lo dice y queda «a validar por Fátima» (NOTAS). No se inventa ningún dato.
   Entran solas en el curso premium (lección en su unidad), en el libro (página pe_animada) y en el libro interactivo.
   Cargar después de b6_pelu_particiones.js y de los tres b6_color_cerebro_*.js, antes de b6_pelu_libro_animado.js. */
(function () {
  'use strict';
  /* modo revisión de Fátima: las notas «a validar» solo se ven si ella lo activa (localStorage eu_revision = 'si'); el alumno nunca las ve */
  function rev() { try { return localStorage.getItem('eu_revision') === 'si'; } catch (e) { return false; } }
  var B = window.EU_COLOR_CEREBRO, PA = window.EU_PARTICIONES;
  if (!B || !PA || !PA.registrar || !PA.ayudas || B.tecnicas) return;
  var A = PA.ayudas, CALC = B.calc || {};
  var TINTA = '#1F1B18', ROJO = '#B01E45', AMBAR = '#8A6D3B', VERDE = '#18906A', PANEL = '#FFFFFF';

  /* donde sus propias fuentes dicen cosas distintas: se narra y queda a validar */
  var NOTAS = {
    tin_p05: 'En el Cerebro del Estudio, mezclar 1:1,5 un tinte de crema figura como error. A validar por Fátima.',
    tin_i03: 'En tu carta de tonos el .3 es dorado; la calculadora neutraliza el rojo con 0.7 Verde. A validar por Fátima.',
    cco_p02: 'En tu carta de tonos el .3 es dorado y la calculadora usa 0.7 Verde para el rojo y 0.6 Rojo para el efecto verde. A validar por Fátima.',
    que_i04: 'El Cerebro del Estudio usa 180 a 220 °C con producto sin formol, y nunca más de 180 °C en decolorado. A validar por Fátima.',
    que_i05: 'En el Cerebro del Estudio, el derriz es un alisador químico muy alcalino. A validar por Fátima.',
    que_a01: 'En el Cerebro del Estudio, el derriz es un alisador químico muy alcalino. A validar por Fátima.'
  };
  var MODO = { tinte: 'global', mechas: 'papel', balayage: 'barrido', queratina: 'plancha', hidratacion: 'producto' };

  /* texto: sin el emoji del principio (es formato, no contenido); en pantalla, líneas cortas */
  function limpio(s) { return String(s || '').replace(/^(?:[←-⯿]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDC00-\uDFFF]|️|‍|\s)+/, '').trim(); }
  function lineas(s, n) {
    var out = [], l = ''; String(s).split(/\s+/).forEach(function (w) { if ((l + ' ' + w).trim().length > n && l) { out.push(l); l = w; } else l = (l + ' ' + w).trim(); });
    if (l) out.push(l); return out;
  }
  function rotulos(K, s, c, t0, max) { return lineas(s, 62).slice(0, max || 6).map(function (l, i) { return K.rotulo(l, c, t0 + i * 0.03); }); }

  /* carta de tonos de la calculadora: código → color; si no está, el nivel */
  var CARTA = {};
  Object.keys(CALC.colores || {}).forEach(function (f) { (CALC.colores[f] || []).forEach(function (t) { CARTA[t.c] = t; }); });
  function colorDe(cod) {
    var c = String(cod).replace(',', '.'); if (CARTA[c]) return CARTA[c].h;
    var n = parseInt(c, 10), N = (CALC.niveles || []).filter(function (x) { return x.l === n; })[0]; return N ? N.h : null;
  }
  function mezcla(a, b, t) {
    function h(x) { x = x.replace('#', ''); return [0, 2, 4].map(function (i) { return parseInt(x.substr(i, 2), 16); }); }
    var x = h(a), y = h(b); return '#' + x.map(function (v, i) { return ('0' + Math.round(v + (y[i] - v) * t).toString(16)).slice(-2); }).join('');
  }
  /* figuras en coordenadas de pantalla (lienzo 1280×720, recorte 190–1090) */
  function rect(x, y, w, h) { return [x, y, x + w, y, x + w, y + h, x, y + h]; }
  function circ(cx, cy, r) { var p = []; for (var i = 0; i < 28; i++) { var a = i / 28 * 2 * Math.PI; p.push(Math.round(cx + r * Math.cos(a)), Math.round(cy + r * Math.sin(a))); } return p; }
  function sector(cx, cy, r, a0, a1) { var p = [cx, cy]; for (var i = 0; i <= 10; i++) { var a = a0 + (a1 - a0) * i / 10; p.push(Math.round(cx + r * Math.cos(a)), Math.round(cy + r * Math.sin(a))); } return p; }
  function panel(t) { return A.zona(rect(330, 250, 620, 420), t, PANEL, 0.9, '#D8D2C8'); }

  /* ── liga de tonos (mezclas): los tonos que nombra el paso + la proporción que dice ── */
  function escLiga(K, txt) {
    var tr = [panel([0, 0.08])], cods = [], m, re = /\b(\d{1,2}[.,]\d{1,2})\b/g;
    while ((m = re.exec(txt)) && cods.length < 3) if (colorDe(m[1]) && cods.indexOf(m[1]) < 0) cods.push(m[1]);
    var prop = null, p1 = /(\d{1,3})\s*\/\s*(\d{1,3})/.exec(txt), p2 = /\b(\d+(?:[.,]\d+)?)\s*:\s*(\d+(?:[.,]\d+)?)\b/.exec(txt), p3 = /(\d{1,2})\s*-\s*(\d{1,2})\s*%/.exec(txt);
    if (p1 && +p1[1] + +p1[2] === 100) prop = [+p1[1], +p1[2]];
    else if (p2) prop = [parseFloat(p2[1].replace(',', '.')), parseFloat(p2[2].replace(',', '.'))];
    else if (p3) prop = [+p3[2], 100 - +p3[2]];
    var x0 = 400, y = 330;
    cods.forEach(function (c, i) {
      var cx = x0 + 70 + i * 170, ta = 0.12 + i * 0.12;
      tr.push(A.zona(circ(cx, y, 52), [ta, ta + 0.1], colorDe(c), 1, TINTA), K.chapa([cx, y + 78], c, TINTA, ta + 0.05));
    });
    if (cods.length >= 2) {
      var res = colorDe(cods[0]), t = prop ? prop[1] / (prop[0] + prop[1]) : 0.5; res = mezcla(colorDe(cods[0]), colorDe(cods[1]), t);
      var cx = x0 + 70 + cods.length * 170;
      if (cx < 900) tr.push(A.zona(circ(cx, y, 58), [0.5, 0.62], res, 1, TINTA), K.chapa([cx, y + 82], '=', TINTA, 0.55));
    }
    if (prop) {
      var W = 440, bx = 420, by = 470, w1 = Math.round(W * prop[0] / (prop[0] + prop[1]));
      var c1 = cods[0] ? colorDe(cods[0]) : '#8A5A33', c2 = cods[1] ? colorDe(cods[1]) : '#D9C7A8';
      tr.push(A.zona(rect(bx, by, w1, 46), [0.6, 0.78], c1, 0.95, TINTA), A.zona(rect(bx + w1, by, W - w1, 46), [0.78, 0.92], c2, 0.95, TINTA));
      tr.push(K.chapa([bx + w1 / 2, by + 70], String(prop[0]), TINTA, 0.7), K.chapa([bx + w1 + (W - w1) / 2, by + 70], String(prop[1]), TINTA, 0.85));
    }
    return { v: 'tres', tr: tr };
  }

  /* ── rueda de neutralización (matización y corrección): los opuestos que nombra el paso se encuentran ── */
  var RUEDA = [['amarillo', '#F2C230', /amarill|dorad/], ['naranja', '#E67E22', /naranj|cobriz|cobre/], ['rojo', '#C0392B', /\brojo|rojiz|caoba/],
    ['violeta', '#8E44AD', /violet|morad|irisad|lila/], ['azul', '#2C6FD1', /\bazul|ceniza/], ['verde', '#27AE60', /verde|verdos/]];
  function escRueda(K, txt) {
    var tr = [panel([0, 0.08])], cx = 640, cy = 430, r = 150, s = txt.toLowerCase(), hay = [];
    RUEDA.forEach(function (c, i) {
      var a0 = -Math.PI / 2 + (i - 0.5) * Math.PI / 3, a1 = a0 + Math.PI / 3;
      tr.push(A.zona(sector(cx, cy, r, a0, a1), [0.06 + i * 0.05, 0.16 + i * 0.05], c[1], 0.95, '#FFFFFF'));
      if (c[2].test(s)) hay.push(i);
    });
    RUEDA.forEach(function (c, i) { var a = -Math.PI / 2 + i * Math.PI / 3; tr.push(K.chapa([Math.round(cx + (r + 26) * Math.cos(a)), Math.round(cy + (r + 26) * Math.sin(a))], c[0].charAt(0).toUpperCase(), c[1], 0.4)); });
    /* si el paso nombra un color y su opuesto (a 3 sectores), la flecha los une por el centro: se neutralizan */
    var par = null; hay.forEach(function (i) { if (hay.indexOf((i + 3) % 6) >= 0 && !par) par = [i, (i + 3) % 6]; });
    if (par) {
      var pa = function (i) { var a = -Math.PI / 2 + i * Math.PI / 3; return [Math.round(cx + r * 0.7 * Math.cos(a)), Math.round(cy + r * 0.7 * Math.sin(a))]; };
      var q0 = pa(par[0]), q1 = pa(par[1]);
      tr.push(K.linea([q0[0], q0[1], cx, cy], [0.5, 0.65], TINTA, 4, { fl: 1 }), K.linea([q1[0], q1[1], cx, cy], [0.5, 0.65], TINTA, 4, { fl: 1 }));
      tr.push(A.zona(circ(cx, cy, 34), [0.68, 0.8], '#9A948C', 1, TINTA));
      tr.push(K.rotulo(RUEDA[par[0]][0] + ' + ' + RUEDA[par[1]][0] + ' = se neutralizan', TINTA, 0.68));
    }
    return { v: 'tres', tr: tr };
  }

  /* ── ficha (alertas, diagnóstico): solo el texto, sobre el perfil del maniquí.
     Sin señales (triángulo / círculo con «!»): Fátima, 9-10-2026, parecían de tráfico. ── */
  function escFicha(K, tipo, col) {
    return { v: 'lateral', tr: [] };
  }

  /* una escena por bloque de la clase */
  function escena(K, c, blq, i, k) {
    var tipo = blq[0], txt = limpio(blq[1]), a, t, voz = txt, col = TINTA;
    if (tipo === 'punto') {
      t = 'Paso ' + k;
      if (c.t === 'mezcla') a = escLiga(K, txt);
      else if (c.t === 'correccion' || c.t === 'matizacion' || /neutraliz/i.test(txt)) a = escRueda(K, txt);
      else if (MODO[c.t]) {
        var m = /\b(?:nivel|base|tono)\s*(\d{1,2})\b/i.exec(txt), modo = /ra[ií]z|ra[ií]ces/i.test(txt) && c.t === 'tinte' ? 'raiz' : MODO[c.t];
        a = A.escAplicar(K, {}, modo, m ? A.NIVEL[Math.min(10, +m[1])] : (c.t === 'queratina' || c.t === 'hidratacion' ? '#D9C7A8' : c.t === 'tinte' ? A.NIVEL[6] : '#E9C979'), k);
        a.tr = a.tr.filter(function (s) { return s.k !== 'e'; });
      } else a = escFicha(K, 'importante', '#5B5650');
    } else {
      t = tipo === 'alerta' ? 'Por qué no' : tipo === 'importante' ? 'Importante' : 'Consejo de Fátima';
      col = tipo === 'alerta' ? ROJO : tipo === 'importante' ? AMBAR : VERDE;
      voz = (tipo === 'alerta' ? 'Atención. ' : tipo === 'importante' ? 'Importante. ' : 'Consejo de Fátima. ') + txt;
      a = c.t === 'correccion' || c.t === 'matizacion' ? escRueda(K, txt) : escFicha(K, tipo, col);
    }
    /* rótulos: título arriba, luego el texto del paso y al final las etiquetas del dibujo */
    var dib = a.tr.filter(function (s) { return s.k !== 'e'; }), etq = a.tr.filter(function (s) { return s.k === 'e'; });
    a.tr = dib.concat([K.rotulo(t, col, 0)], rotulos(K, txt, col === TINTA ? '#3B3631' : col, 0.04, a.v === 'lateral' && !MODO[c.t] ? 11 : 7), etq);
    return { tipo: 'cc' + i + '_' + tipo, vista: a.v, t: t, texto: voz, a: a };
  }
  /* preguntas de su banco de colorimetría (juegos_fatima.html) que hablan de lo mismo que la clase; si no hay, ninguna */
  var VACIAS = /^(de|la|el|los|las|un|una|y|o|en|con|para|por|que|del|al|se|es|su|sus|lo|como|más|sin|sobre|cuál|qué|cuántos)$/;
  function palabras(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split(/[^a-z0-9]+/).filter(function (w) { return w.length > 3 && !VACIAS.test(w); }); }
  function preguntas(c) {
    var mias = palabras(c.n + ' ' + c.vds), out = [];
    (CALC.preguntas || []).forEach(function (q) { var n = palabras(q.p).filter(function (w) { return mias.indexOf(w) >= 0; }).length; if (n >= 2) out.push({ e: q.p, o: q.o, c: q.c, x: q.exp }); });
    return out.slice(0, 3);
  }
  function deClase(K, c) {
    var esc = [], k = 0;
    c.b.forEach(function (blq, i) { if (blq[0] === 'punto') k++; esc.push(escena(K, c, blq, i, k)); });
    if (NOTAS[c.id] && rev()) { var e = escFicha(K, 'importante', AMBAR); e.tr = e.tr.concat([K.rotulo('A validar por Fátima', AMBAR, 0)], rotulos(K, NOTAS[c.id], AMBAR, 0.04)); esc.push({ tipo: 'cc_validar', vista: e.v, t: 'A validar por Fátima', texto: 'Ojo. ' + NOTAS[c.id], a: e }); }
    return { R: { id: 'cc_' + c.id, n: c.n }, escenas: esc, preguntas: preguntas(c) };
  }

  /* ── el cerebro con voz de la calculadora: diagnóstico por estado del cabello y la estrella de neutralización ── */
  function clasesCalc() {
    var L = [], ch = CALC.chat || {}, tx = CALC.textos || {};
    var diag = [['Cabello muy maltratado', ch.muyMaltratado, 'alerta'], ['Cabello maltratado', ch.maltratado, 'importante'], ['Prueba de mechón', tx.TEXTO_MECHON || ch.mechon, 'punto'],
      ['Decoloración según el estado del cabello', ch.decoloracion, 'punto'], ['Hidratación natural', tx.TEXTO_HIDRATACION || ch.hidratacion, 'tip'], ['Corte de puntas', tx.TEXTO_CORTE_PUNTAS, 'tip'], ['Cobertura de canas', ch.canas, 'punto']]
      .filter(function (d) { return d[1]; });
    if (diag.length) L.push({ id: 'calc_diag', n: 'Diagnóstico del cabello antes del color', t: 'alerta', u: 'pe_u_cab', b: diag.map(function (d) { return [d[2], d[0] + '. ' + d[1]]; }) });
    if ((CALC.estrella || []).length) L.push({ id: 'calc_estrella', n: 'Estrella de neutralización (Howard)', t: 'matizacion', u: 'cb_quim_decoloracion',
      b: CALC.estrella.map(function (e) { return ['punto', 'Nivel ' + e.r.replace(/^NIV\s*/, '') + ': fondo ' + e.p.toLowerCase() + '; se neutraliza con ' + e.c + '.']; }) });
    if ((CALC.errores || []).length) L.push({ id: 'calc_errores', n: 'Errores de color y su corrector', t: 'correccion', u: 'cb_color_global',
      b: CALC.errores.map(function (e) { return ['punto', e.l + ': ' + e.s.toLowerCase() + '. Corrector: ' + e.cor + '. ' + e.regla]; }) });
    return L;
  }

  var todas = B.clases.concat(clasesCalc());
  var tec = todas.map(function (c) {
    return { id: 'cc_' + c.id, n: c.n, pre: 'Clase · ', unidad: c.u, uso: ['color'], fn: function (K) { return deClase(K, c); },
      fuente: c.src ? 'Cerebro de Fátima · motor ' + c.src + ' · ' + c.id : 'Cerebro de la calculadora cromática de Fátima' };
  });
  PA.registrar(tec);
  B.tecnicas = tec;
})();
