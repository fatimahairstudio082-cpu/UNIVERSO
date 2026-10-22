/* b6_pelu_referencias.js — referencias visuales de cortes en la biblioteca de dibujos de Peluquería
   (`window.EU_PELU_REF`, 22-10-2026). Fátima: «integrarlas en la biblioteca de dibujo; el sistema debe renderizarla».
   77 imágenes de su biblioteca hecha con ChatGPT (carpeta «Biblioteca_100_Cortes_Dama» de su Drive): cada una muestra el
   corte terminado de frente, de lado y de atrás. Recortadas sin el texto ni los bordes que se colaron y guardadas en
   `referencias/cortes/ref_NNN.jpg` (NNN = número de su biblioteca). Fuera (Fátima: sin máquina en el curso): las que
   llevan los lados o la nuca rapados a máquina (44, 45, 47–50, 52–55, 57–60, 70–73, 79, 80, 90, 100) y la de pelo verde (86).
   Cada imagen es un modelo de EU_MODELOS (materia `pelu`, familia `ref`, id `pe_ref_NNN`): sale en la Galería de dibujos,
   en el libro y en el curso como cualquier dibujo de la biblioteca, siempre con la marca «Referencia · IA».
   Solo enseña cómo queda: las elevaciones y la técnica siguen siendo las del maniquí y las fichas del sistema.
   Cada imagen va a los `u.mods` de su unidad (cortes por familia, «El cabello y el diagnóstico», «Secciones…»).
   Cargar después de b6_pelu_orden.js. Para quitar una: borrar su fila de REF. */
(function () {
  'use strict';
  if (window.EU_PELU_REF) return;
  var DIR = './referencias/cortes/';
  /* [número, nombre, unidad (familia de EU_CORTES o 'cab' / 'base'), corte del sistema que se le parece] */
  var REF = [
    [13, 'Corte recto', 'basicos', 'basico_cuadrado'], [15, 'Corte en V suave', 'basicos', 'basico_v'], [16, 'Corte en U', 'basicos', 'basico_u'],
    [39, 'Corte largo recto', 'basicos'],
    [1, 'Bob clásico', 'melenas'], [2, 'Bob recto', 'melenas', 'bob_recto'], [3, 'Bob graduado', 'melenas'], [5, 'Corte a la mandíbula', 'melenas'],
    [6, 'Long bob (lob)', 'melenas', 'lob'], [7, 'Lob asimétrico', 'melenas', 'bob_asimetrico'], [8, 'Bob invertido', 'melenas'],
    [9, 'Carré con flequillo', 'melenas'], [10, 'Bob texturizado', 'melenas'], [17, 'Melena clásica', 'melenas'],
    [19, 'Long bob ondulado', 'melenas'], [56, 'Bob corto ondulado', 'melenas'],
    [14, 'Corte desfilado', 'capas'], [21, 'Capas largas', 'capas', 'capas_largas'], [22, 'Capas medias', 'capas'], [23, 'Capas cortas', 'capas'],
    [24, 'Corte en V con capas', 'capas'], [25, 'Corte en U con capas', 'capas'], [31, 'Melena desfilada', 'capas'], [32, 'Melena escalonada', 'capas'],
    [33, 'Melena en capas largas', 'capas'], [34, 'Corte plumado', 'capas'], [35, 'Capas con flequillo', 'capas', 'capas_cara'],
    [36, 'Capas invisibles', 'capas'], [38, 'Capas en cascada', 'capas'], [40, 'Corte largo ondulado', 'capas'], [66, 'Corte en capas', 'capas'],
    [41, 'Pixie clásico', 'cortos', 'pixie'], [42, 'Pixie largo', 'cortos'], [43, 'Pixie con flequillo', 'cortos'], [51, 'Pixie rizado', 'cortos'],
    [11, 'Media melena recta', 'media'], [12, 'Media melena en capas', 'media'], [26, 'Corte mariposa (butterfly)', 'media', 'butterfly'],
    [27, 'Shag clásico', 'media', 'shag'], [28, 'Shag moderno', 'media'], [29, 'Wolf cut', 'media', 'wolf'],
    [18, 'Melena con flequillo', 'flequillos'], [61, 'Flequillo cortina', 'flequillos', 'fleq_cortina'], [62, 'Flequillo recto', 'flequillos', 'fleq_recto'],
    [63, 'Flequillo desfilado', 'flequillos', 'fleq_desfilado'], [64, 'Flequillo lateral', 'flequillos'], [65, 'Flequillo abierto', 'flequillos'],
    [20, 'Bob rizado', 'rizado', 'curly_bob'], [37, 'Melena rizada en capas', 'rizado'], [83, 'Corte para cabello rizado', 'rizado'],
    [4, 'Carré francés', 'moda', 'french_bob'], [30, 'Mullet femenino', 'moda'], [46, 'Bixie', 'moda', 'bixie'], [67, 'Italian bob', 'moda', 'italian_bob'],
    [68, 'Corte coreano', 'moda'], [69, 'Efecto mojado (wet look)', 'moda'], [74, 'Corte con volumen', 'moda'], [75, 'Corte retro', 'moda'],
    [76, 'Corte boho', 'moda'], [77, 'Corte rock', 'moda'], [78, 'Corte urbano', 'moda'],
    [81, 'Corte para cabello fino', 'cab'], [82, 'Corte para cabello grueso', 'cab'], [84, 'Corte para cabello lacio', 'cab'],
    [89, 'Corte para mujeres maduras', 'cab'], [91, 'Corte para canas', 'cab'], [92, 'Corte rejuvenecedor', 'cab'], [93, 'Corte elegante', 'cab'],
    [94, 'Corte cómodo', 'cab'], [95, 'Corte versátil', 'cab'], [96, 'Corte profesional', 'cab'], [97, 'Corte para volumen', 'cab'],
    [98, 'Corte antifrizz', 'cab'], [99, 'Corte para verano', 'cab'],
    [85, 'Corte para rostro ovalado', 'base'], [87, 'Corte para rostro cuadrado', 'base'], [88, 'Corte para rostro corazón', 'base']
  ];
  var UNI = { cab: 'pe_u_cab', base: 'pe_u_base' };
  function idDe(n) { return 'pe_ref_' + ('00' + n).slice(-3); }
  function archivo(n) { return DIR + 'ref_' + ('00' + n).slice(-3) + '.jpg'; }
  function uniDe(f) { return UNI[f] || ('pe_u_c_' + f); }

  /* cada imagen se lee una vez y queda como data URL: así va dentro del libro, el PDF y el curso descargados */
  var DATA = {};
  REF.forEach(function (r) {
    try {
      fetch(archivo(r[0])).then(function (x) { return x.ok ? x.blob() : null; }).then(function (b) {
        if (!b) return; var fr = new FileReader(); fr.onload = function () { DATA[idDe(r[0])] = fr.result; }; fr.readAsDataURL(b);
      }).catch(function () { });
    } catch (e) { }
  });
  function src(n) { return DATA[idDe(n)] || archivo(n); }

  function preguntas(r) {
    var CO = window.EU_CORTES, c = r[3] && CO && CO.get ? CO.get(r[3]) : null;
    if (c) {
      var T = (CO.tecnica && CO.tecnica(c.id)) || {}, ev = T.elev || [];
      var q = [['¿Qué corte del curso se parece a esta imagen?', 'El «' + c.n + '».']];
      if (c.d) q.push(['¿Cómo es el «' + c.n + '»?', c.d]);
      if (ev.length) q.push(['En la ficha del «' + c.n + '», ¿a qué elevación se corta la nuca?', ev[0] + '°.']);
      q.push(['¿Qué vistas muestra la imagen?', 'De frente, de lado y de atrás.']);
      return q.slice(0, 3);
    }
    return [['¿Cómo se llama este corte de referencia?', r[1] + '.'], ['¿Qué vistas muestra la imagen?', 'De frente, de lado y de atrás.'],
      ['¿Qué enseña la imagen y qué enseña el maniquí?', 'La imagen enseña cómo queda; el maniquí, cómo se llega a ese resultado paso a paso.']];
  }
  function modelo(r) {
    var id = idDe(r[0]), n = r[0];
    return {
      id: id, fam: 'ref', n: r[1] + ' · referencia', ref: n, unidad: uniDe(r[2]), corte: r[3] || '',
      raster: function () { return src(n); },
      d: function (K) {
        var gid = 'peRefGris' + n, f = K.linea ? ' filter="url(#' + gid + ')"' : '';
        return (K.linea ? '<filter id="' + gid + '"><feColorMatrix type="saturate" values="0"/></filter>' : '') +
          '<rect x="1" y="1" width="198" height="148" rx="5" fill="#EEF0F3"/>' + '<image href="' + src(n) + '" x="3" y="3" width="194" height="144"' + f + ' preserveAspectRatio="xMidYMid meet"/>' +
          '<rect x="146" y="139" width="50" height="9" rx="3" fill="#16223A" fill-opacity=".72"/>' + K.t(171, 145.3, 'Referencia · IA', { s: 5, c: '#fff' });
      },
      rot: [],
      intro: 'Imagen de referencia (IA) de «' + r[1] + '»: el corte terminado de frente, de lado y de atrás. Cómo se llega a este resultado lo enseña el maniquí paso a paso.',
      q: preguntas(r),
      porque: 'Ver la forma terminada desde tres lados ayuda a reconocer la línea, el largo y el volumen antes de cortar; la técnica y las elevaciones son las del maniquí y su ficha.'
    };
  }

  var REG = false;
  function registrar() {
    var MO = window.EU_MODELOS; if (!MO || !MO.agregar || REG) return !!REG;
    REG = true;
    MO.agregar('pelu', REF.map(modelo), { familias: { ref: 'Referencias visuales · cómo queda' } });
    return true;
  }
  if (!registrar()) (function espera(k) { if (!registrar() && k < 100) setTimeout(function () { espera(k + 1); }, 300); })(0);

  /* cada referencia, solo en su unidad (b6_pelu_orden reparte los dibujos con u.mods) */
  var CU = window.EU_CURRICULO;
  if (CU && CU.unidades && !CU.unidades._peRef) {
    var uni0 = CU.unidades;
    CU.unidades = function (materia) {
      var o = uni0.apply(this, arguments);
      if (materia !== 'pelu' || !Array.isArray(o)) return o;
      try {
        o.forEach(function (u) {
          if (!u || !u.id || !u.mods) return;
          REF.forEach(function (r) { var id = idDe(r[0]); if (uniDe(r[2]) === u.id && u.mods.indexOf(id) < 0) u.mods = u.mods.concat([id]); });
        });
      } catch (e) { console.warn('pelu referencias', e); }
      return o;
    };
    CU.unidades._peRef = 1;
  }

  /* ─────────── libro: una hoja por referencia (Fátima, 22-10-2026: «por hojas: el contenido escrito, el maniquí con la
     forma del corte, la imagen de referencia y el texto explicativo; sencillo, no cargado») ───────────
     Página `pe_ref_corte`: la imagen de referencia, el maniquí con el corte de base (una escena «cómo queda» o del
     paso a paso, distinta en cada hoja del mismo corte) y el texto de la ficha de ese corte en EU_CORTES (descripción,
     elevación por zonas, sección, herramienta, acabado, resultado y pasos). Si la imagen se parece a un corte del sistema
     (columna 4 de REF) ese es su corte; si no, el corte de base propuesto en BASE, marcado «a validar por Fátima».
     Primero ocupa huecos de su unidad (página sin contenido, relleno, lecturas a partir de la 2.ª) que dejan libres las
     técnicas animadas y los diagramas; las demás van en hojas nuevas detrás del diagrama de su corte de base (o al final
     de la unidad, antes del tutor). `cfg.acab.referencias = 'huecos'` solo huecos; `'no'` lo apaga. */
  var BASE = {
    39: 'basico_cuadrado',
    1: 'bob_recto', 3: 'carre_a', 5: 'bob_recto', 8: 'carre_a', 9: 'bob_recto', 10: 'lob', 17: 'lob', 19: 'lob', 56: 'bob_recto',
    14: 'desfilado_punta', 22: 'capas_90', 23: 'capas_90', 24: 'capas_largas', 25: 'capas_largas', 31: 'desfilado_punta', 32: 'capas_largas',
    33: 'capas_largas', 34: 'desfilado_punta', 36: 'capas_largas', 38: 'capas_largas', 40: 'capas_largas', 66: 'capas_90',
    42: 'pixie', 43: 'pixie', 51: 'pixie_desfilado',
    11: 'media_45', 12: 'media_45', 28: 'shag',
    18: 'fleq_recto', 64: 'fleq_desfilado', 65: 'fleq_cortina',
    37: 'rizo_seco', 83: 'rizo_seco',
    30: 'wolf', 68: 'butterfly', 69: 'blunt', 74: 'shag', 75: 'french_bob', 76: 'capas_largas', 77: 'shag', 78: 'shag',
    81: 'blunt', 82: 'capas_90', 84: 'basico_cuadrado', 89: 'lob', 91: 'bob_recto', 92: 'capas_cara', 93: 'bob_recto', 94: 'bob_recto',
    95: 'lob', 96: 'bob_recto', 97: 'capas_90', 98: 'capas_largas', 99: 'lob',
    85: 'capas_cara', 87: 'capas_cara', 88: 'capas_cara'
  };
  var ZN = ['Nuca', 'Nuca alta', 'Occipital', 'Parietal', 'Lateral', 'Coronilla', 'Flequillo'];
  var VISTAS_REF = ['queda_lateral', 'queda_nuca', 'queda_frente', 'queda_corto_lateral', 'queda_corto_nuca', 'lateral', 'frente', 'capas', 'angulos', 'peinado_lado', 'peinado_atras'];
  var ED = window.EU_EDITORIAL;
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function porId(id) { var n = +String(id).slice(7); for (var i = 0; i < REF.length; i++) if (REF[i][0] === n) return REF[i]; return null; }
  function baseDe(r) { return r[3] || BASE[r[0]] || ''; }
  function corteDe(id) { var CO = window.EU_CORTES; return id && CO && CO.get ? CO.get(id) : null; }
  /* escenas del maniquí del corte de base: la vista k-ésima libre (cada hoja del mismo corte enseña otra) */
  function escenaDe(corte, k) {
    var LD = window.EU_PELU_LIBRO_DG; if (!LD || !LD.datos || !corte) return null;
    var dg = { k: 'corte', corte: corte }, d = null; try { d = LD.datos(dg); } catch (e) { d = null; }
    if (!d || !d.E) return null;
    var hay = VISTAS_REF.filter(function (t) { return d.E.escenas.some(function (e) { return e.tipo === t; }); });
    if (!hay.length) return null;
    var t = hay[k % hay.length], e = d.E.escenas.filter(function (x) { return x.tipo === t; })[0], f = '';
    try { f = LD.fotoEscena(dg, t); } catch (er) { f = ''; }
    return f ? { t: e.t, texto: e.texto, foto: f } : null;
  }
  if (ED && ED.registrar) {
    ED.registrar({
      paginas: {
        pe_ref_corte: function (pg, C) {
          var H = ED.H, T = C.T || {}, acc = T.acc || '#B08D57', soft = T.soft || '#EEF0F3', r = porId(pg.ref); if (!r) return '';
          var w = ((C.papel && C.papel.w) || 210) - 40, alto = ((C.papel && C.papel.h) || 297) >= 250, b = baseDe(r), c = corteDe(b);
          var TE = c && window.EU_CORTES.tecnica ? (window.EU_CORTES.tecnica(c.id) || {}) : {}, ev = TE.elev || [];
          var esc1 = escenaDe(b, pg.vista || 0);
          var img = '<figure style="margin:0 0 3mm;position:relative;border-radius:2mm;overflow:hidden;background:' + soft + '">' +
            '<img src="' + src(r[0]) + '" alt="' + esc(r[1]) + '" style="display:block;width:100%;height:' + (alto ? 66 : 48) + 'mm;object-fit:contain">' +
            '<span style="position:absolute;right:1.5mm;bottom:1.5mm;font:600 6.5pt Archivo,Helvetica,Arial,sans-serif;color:#fff;background:rgba(22,34,58,.72);padding:.4mm 1.6mm;border-radius:1mm">Referencia · IA · frente, lado y atrás</span></figure>';
          var man = esc1 ? '<figure style="margin:0;background:' + soft + ';border-radius:2mm;padding:1.5mm"><img src="' + esc1.foto + '" alt="' + esc(esc1.t) + '" style="display:block;width:100%;height:auto;border-radius:1.5mm">' +
            '<figcaption style="font-size:.66em;line-height:1.3;margin-top:1.2mm"><b style="color:' + acc + '">Maniquí · ' + esc(esc1.t) + '</b><br>' + esc(esc1.texto || '') + '</figcaption></figure>' : '';
          var chips = ev.length ? ev.map(function (g, z) { return '<span style="display:inline-block;margin:0 1mm 1mm 0;padding:.3mm 1.8mm;border-radius:99px;background:' + soft + ';white-space:nowrap"><b style="color:' + acc + '">' + ZN[z] + '</b> ' + g + '°</span>'; }).join('') : '';
          var pasos = (TE.notas || []).slice(0, alto ? 8 : 3);
          var txt = '<div style="font-size:.78em;line-height:1.42">' +
            (c ? '<div style="margin:0 0 1.6mm"><b>' + (r[3] ? 'Corte del curso:' : 'Corte de base propuesto:') + '</b> «' + esc(c.n) + '». ' + esc(c.d || '') + '</div>' : '') +
            (!r[3] && c ? '<div style="margin:0 0 1.6mm;color:#A0522D;font-weight:700">Relación imagen–corte propuesta por el sistema, a validar por Fátima.</div>' : '') +
            (chips ? '<div style="margin:0 0 1.2mm"><b>Elevación por zonas:</b><div style="margin-top:1mm">' + chips + '</div></div>' : '') +
            (TE.part ? '<div><b>Sección:</b> ' + esc(TE.part) + (TE.her ? ' · <b>Herramienta:</b> ' + esc(TE.her) : '') + (TE.acabado ? ' · <b>Acabado:</b> ' + esc(TE.acabado) : '') + '</div>' : '') +
            (TE.resultado ? '<div style="margin-top:1mm"><b>Resultado:</b> ' + esc(TE.resultado) + '</div>' : '') +
            (pasos.length ? '<ol style="margin:1.6mm 0 0;padding-left:4.5mm">' + pasos.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ol>' : '') + '</div>';
          var cuerpo = man ? '<div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:4mm;align-items:start">' + man + txt + '</div>' : txt;
          return H.cabecera(C, pg) +
            '<div style="font-size:.74em;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:' + acc + ';margin:0 0 1.5mm">Cómo queda · referencia visual y maniquí</div>' +
            H.h1(C, esc(r[1])) + img + cuerpo +
            (alto ? '<div style="margin-top:4mm;padding:2.5mm 3.5mm;border-left:1.2mm solid ' + acc + ';background:' + soft + ';border-radius:1.5mm;font-size:.78em;line-height:1.45"><b>Repaso</b>' + preguntas(r).slice(0, 2).map(function (q, i) { return '<div style="margin-top:1.4mm">' + (i + 1) + '. ' + esc(q[0]) + '<br><span style="opacity:.75">Respuesta: ' + esc(q[1]) + '</span></div>'; }).join('') + '</div>' : '') +
            '<p style="font-size:.7em;opacity:.75;margin:3mm 0 0">La imagen enseña el resultado; el maniquí y la ficha, cómo se llega a él.</p>' + H.folio(C, pg);
        }
      },
      voz: { pe_ref_corte: function (pg) {
        var r = porId(pg.ref); if (!r) return '';
        var c = corteDe(baseDe(r)), TE = c && window.EU_CORTES.tecnica ? (window.EU_CORTES.tecnica(c.id) || {}) : {};
        return r[1] + '. Así queda de frente, de lado y de atrás. ' + (c ? (r[3] ? 'Es el corte «' : 'Corte de base propuesto: «') + c.n + '». ' + (c.d || '') + ' ' : '') + (TE.resultado ? 'Resultado: ' + TE.resultado : '');
      } }
    });
  }
  function huecos(res, uid) {
    var c = [], lec = 0;
    res.pages.forEach(function (p, i) {
      if (!p.u || p.u.id !== uid) return;
      if (p.tipo === 'lec_amplia' && !p.ds) return c.push([-1, i]);
      if (p.relleno && (p.tipo === 'actividad' || p.tipo === 'ficha')) return c.push([1, i]);
      if (p.relleno && p.tipo === 'vis') return c.push([2, i]);
      if (/^lec_(amplia|concepto|lectura|caso|proyecto)$/.test(p.tipo) && ++lec > 1) c.push([3, i]);
    });
    return c.sort(function (a, b) { return a[0] - b[0] || (a[0] === 3 ? b[1] - a[1] : a[1] - b[1]); });
  }
  function repartir(res) {
    var C = res && res.C, cfg = C && C.cfg;
    if (!res || !res.pages || !cfg || cfg.materia !== 'pelu' || ((cfg.acab || {}).referencias) === 'no') return res;
    var ya = {}, porU = {}, orden = [], quitadas = {}, n = 0, vistas = {};
    res.pages.forEach(function (p) { if (p.tipo === 'pe_ref_corte') ya[p.ref] = 1; });
    res.pages.forEach(function (p) {
      if (!p.u || porU[p.u.id]) return;
      var L = REF.filter(function (r) { return uniDe(r[2]) === p.u.id && !ya[idDe(r[0])]; });
      if (L.length) { porU[p.u.id] = L; orden.push(p.u.id); }
    });
    function hoja(r, p) { var b = baseDe(r), k = vistas[b] = (vistas[b] == null ? 0 : vistas[b] + 1); return { tipo: 'pe_ref_corte', u: p.u, n: p.n, num: p.num, ref: idDe(r[0]), base: b, vista: k, fill2: { nada: 1 } }; }
    orden.forEach(function (uid) {
      var L = porU[uid], idx = huecos(res, uid).slice(0, L.length).map(function (h) { return h[1]; }).sort(function (a, b) { return a - b; });
      idx.forEach(function (i, j) { var p = res.pages[i]; res.pages[i] = hoja(L[j], p); quitadas[p.num] = 1; n++; });
      porU[uid] = L.slice(idx.length);
    });
    res.pages.forEach(function (p) { if (p.tipo === 'solucion' && p.entradas) p.entradas = p.entradas.filter(function (e) { return !quitadas[e.p]; }); });
    /* las que no caben en huecos: hojas nuevas detrás del diagrama de su corte de base, o al final del tramo de su unidad
       (el anexo de técnicas, al final del libro, también lleva su `u`: no cuenta) */
    var nuevas = [];
    if (((cfg.acab || {}).referencias) !== 'huecos') {
      orden.forEach(function (uid) {
        porU[uid].forEach(function (r) {
          var b = baseDe(r), f = -1, ult = -1, trasDg = -1;
          res.pages.forEach(function (p, i) { if (f < 0 && p.u && p.u.id === uid && !p.anexo) f = i; });
          for (var i2 = f; f >= 0 && i2 < res.pages.length; i2++) {
            var q2 = res.pages[i2]; if (!q2.u || q2.u.id !== uid || q2.anexo) break;
            if (q2.tipo !== 'tutor' && q2.tipo !== 'repaso') ult = i2;
            if (((q2.tipo === 'pe_diagrama' && q2.dg && q2.dg.corte === b) || (q2.tipo === 'pe_ref_corte' && q2.base === b))) trasDg = i2;
          }
          var pos = trasDg >= 0 ? trasDg : ult; if (pos < 0) return;
          var hj = hoja(r, res.pages[pos]); delete hj.num;
          res.pages.splice(pos + 1, 0, hj); nuevas.push(hj); n++;
        });
      });
      if (nuevas.length) {
        var nueva = {};
        res.pages.forEach(function (p, i) { if (p.num != null && nuevas.indexOf(p) < 0) nueva[p.num] = i + 1; });
        res.pages.forEach(function (p, i) { if (p.num != null || nuevas.indexOf(p) >= 0) p.num = i + 1; });
        res.pages.forEach(function (p) { if (p.tipo === 'solucion' && p.entradas) p.entradas.forEach(function (e) { if (nueva[e.p]) e.p = nueva[e.p]; }); });
      }
    }
    res.referencias = { hojas: n, nuevas: nuevas.length };
    return res;
  }
  /* después de las técnicas animadas y los diagramas de corte, que tienen prioridad en los huecos */
  function engancharLibro() {
    if (!ED || ED.__peluRef) return true;
    if (!window.EU_LIBS_LISTAS || !ED.__peluLibroAnim) return false;
    ED.__peluRef = 1;
    var ens = ED.ensamblar;
    ED.ensamblar = function (cfg) { var r = ens.apply(this, arguments); try { repartir(r); } catch (e) { console.warn('pelu referencias (libro)', e); } return r; };
    return true;
  }
  (function espera(k) { if (!engancharLibro() && k < 2000) setTimeout(function () { espera(k + 1); }, 300); })(0);

  /* ─────────── curso premium: lección «Cómo queda · referencias visuales» en su módulo ───────────
     Una escena por imagen (narración: nombre y, si lo hay, el corte del curso al que se parece), justo después de la
     primera lección del módulo (o de su presentación en vídeo). Solo materia `pelu`. */
  function ponerCurso(D) {
    if (!D || !D.modulos || D._refPelu) return D;
    D.img = D.img || {};
    D.modulos.forEach(function (M) {
      var L = REF.filter(function (r) { return uniDe(r[2]) === M.id && DATA[idDe(r[0])]; });
      if (!L.length || !M.lecciones || !M.lecciones.length) return;
      var esc2 = L.map(function (r) {
        var id = idDe(r[0]), c = corteDe(baseDe(r)); D.img[id] = DATA[id];
        return { tipo: 'idea', id: id, t: r[1], texto: r[1] + '. Así queda de frente, de lado y de atrás.' + (c ? (r[3] ? ' Es el corte «' : ' Corte de base propuesto, a validar: «') + c.n + '». ' + (c.d || '') : ''), rot: [] };
      });
      var k = 1; while (k < M.lecciones.length && /__(video|bienvenida)$/.test(M.lecciones[k - 1].id) ) k++;
      M.lecciones.splice(Math.min(k, M.lecciones.length), 0, { id: M.id + '__referencias', t: 'Cómo queda · referencias visuales', pag: M.pag, escenas: esc2 });
    });
    D._refPelu = 1;
    return D;
  }
  function engancharCurso() {
    var CA = window.EU_CURSO_ANIM;
    if (!CA || !CA.enriquecer || !window.EU_PELU_VIDEOS) return false;
    if (CA.enriquecer._refPelu) return true;
    var enr = CA.enriquecer;
    CA.enriquecer = function (D, res) {
      return Promise.resolve(enr.apply(this, arguments)).then(function (D2) {
        var R = D2 || D, cfg = res && res.C && res.C.cfg;
        return cfg && cfg.materia === 'pelu' && ((cfg.acab || {}).referencias) !== 'no' ? ponerCurso(R) : R;
      });
    };
    CA.enriquecer._refPelu = 1;
    return true;
  }
  (function espera(k) { if (!engancharCurso() && k < 2000) setTimeout(function () { espera(k + 1); }, 300); })(0);

  window.EU_PELU_REF = { REF: REF, id: idDe, archivo: archivo, repartir: repartir, ponerCurso: ponerCurso, listas: function () { return Object.keys(DATA); } };
})();
