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

  /* ─────────── libro: página «Cómo queda · referencias visuales» ───────────
     Hasta 6 imágenes por hoja (2 columnas) con su nombre. Solo ocupa huecos que quedan libres en su unidad cuando ya se
     colocaron las técnicas animadas y los diagramas (página llegada sin contenido, actividad o figura de relleno,
     lecturas a partir de la 2.ª); nunca añade hojas. `cfg.acab.referencias = 'no'` lo apaga. */
  var ED = window.EU_EDITORIAL;
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function porId(id) { var n = +String(id).slice(7); for (var i = 0; i < REF.length; i++) if (REF[i][0] === n) return REF[i]; return null; }
  function nombreCorte(r) { var CO = window.EU_CORTES, c = r && r[3] && CO && CO.get ? CO.get(r[3]) : null; return c ? c.n : ''; }
  function filasDe(C) { var h = (C.papel && C.papel.h) || 297; return h >= 250 ? 3 : h >= 200 ? 2 : 1; }
  if (ED && ED.registrar) {
    ED.registrar({
      paginas: {
        pe_ref_galeria: function (pg, C) {
          var H = ED.H, w = ((C.papel && C.papel.w) || 210) - 40, col = (w - 6) / 2, T = C.T || {}, acc = T.acc || '#B08D57';
          var cel = (pg.refs || []).map(function (id) {
            var r = porId(id); if (!r) return '';
            var cn = nombreCorte(r);
            return '<div style="width:' + col.toFixed(1) + 'mm;break-inside:avoid">' +
              '<div style="position:relative;border-radius:2mm;overflow:hidden;background:#EEF0F3;border:0.3mm solid ' + (T.soft || '#d9dde3') + '">' +
              '<img src="' + src(r[0]) + '" alt="' + esc(r[1]) + '" style="display:block;width:100%;height:' + (col * 0.6).toFixed(1) + 'mm;object-fit:contain">' +
              '<span style="position:absolute;right:1.5mm;bottom:1.5mm;font:600 6.5pt Archivo,Helvetica,Arial,sans-serif;color:#fff;background:rgba(22,34,58,.72);padding:.4mm 1.6mm;border-radius:1mm">Referencia · IA</span></div>' +
              '<div style="margin:1.4mm 0 3.2mm;font-weight:700;font-size:.95em">' + esc(r[1]) + '</div>' +
              (cn ? '<div style="margin:-2.4mm 0 3.2mm;font-size:.8em;opacity:.8">Se parece al «' + esc(cn) + '» del curso</div>' : '') + '</div>';
          }).join('');
          return H.cabecera(C, pg) + H.h1(C, 'Cómo queda · referencias visuales') +
            '<p style="margin:0 0 4mm;max-width:' + w.toFixed(0) + 'mm;border-left:1.2mm solid ' + acc + ';padding-left:3mm">Imágenes de referencia (IA): el corte terminado de frente, de lado y de atrás. La técnica, las secciones y las elevaciones son las del maniquí y su ficha.</p>' +
            '<div style="display:flex;flex-wrap:wrap;gap:0 6mm;width:' + w.toFixed(1) + 'mm">' + cel + '</div>' + H.folio(C, pg);
        }
      },
      voz: { pe_ref_galeria: function (pg) { return 'Cómo queda. Referencias visuales: ' + (pg.refs || []).map(function (id) { var r = porId(id); return r ? r[1] : ''; }).filter(Boolean).join(', ') + '.'; } }
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
    var ya = {}, porU = {}, orden = [], quitadas = {}, n = 0, fil = filasDe(C) * 2;
    res.pages.forEach(function (p) { (p.refs || []).forEach(function (id) { ya[id] = 1; }); });
    res.pages.forEach(function (p) {
      if (!p.u || porU[p.u.id]) return;
      var L = REF.filter(function (r) { return uniDe(r[2]) === p.u.id && !ya[idDe(r[0])]; }).map(function (r) { return idDe(r[0]); });
      if (L.length) { porU[p.u.id] = L; orden.push(p.u.id); }
    });
    orden.forEach(function (uid) {
      var L = porU[uid], hojas = Math.ceil(L.length / fil), idx = huecos(res, uid).slice(0, hojas).map(function (h) { return h[1]; }).sort(function (a, b) { return a - b; });
      idx.forEach(function (i, j) {
        var p = res.pages[i], refs = L.slice(j * fil, (j + 1) * fil); if (!refs.length) return;
        res.pages[i] = { tipo: 'pe_ref_galeria', u: p.u, n: p.n, num: p.num, refs: refs, fill2: { nada: 1 } };
        quitadas[p.num] = 1; n += refs.length;
      });
      porU[uid] = L.slice(idx.length * fil);
    });
    res.pages.forEach(function (p) { if (p.tipo === 'solucion' && p.entradas) p.entradas = p.entradas.filter(function (e) { return !quitadas[e.p]; }); });
    /* sin hueco: hojas nuevas al final de su unidad, antes del repaso con el tutor (como el box y sus formas,
       Fátima 19-10-2026). El libro crece en esas hojas. `cfg.acab.referencias = 'huecos'` = solo en huecos. */
    if (((cfg.acab || {}).referencias) !== 'huecos') {
      var nuevas = [];
      orden.forEach(function (uid) {
        var L = porU[uid]; if (!L.length) return;
        /* solo el tramo seguido de la unidad (el anexo de técnicas, al final del libro, también lleva su `u`) */
        var ult = -1, f = -1;
        res.pages.forEach(function (p, i) { if (f < 0 && p.u && p.u.id === uid && !p.anexo) f = i; });
        for (var i2 = f; f >= 0 && i2 < res.pages.length; i2++) {
          var q2 = res.pages[i2]; if (!q2.u || q2.u.id !== uid || q2.anexo) break;
          if (q2.tipo !== 'tutor' && q2.tipo !== 'repaso') ult = i2;
        }
        if (ult < 0) return;
        var ref = res.pages[ult], hs = [];
        for (var j = 0; j < L.length; j += fil) hs.push({ tipo: 'pe_ref_galeria', u: ref.u, n: ref.n, refs: L.slice(j, j + fil), fill2: { nada: 1 } });
        res.pages.splice.apply(res.pages, [ult + 1, 0].concat(hs));
        nuevas = nuevas.concat(hs); n += L.length;
      });
      if (nuevas.length) {
        var nueva = {};
        res.pages.forEach(function (p, i) { if (p.num != null && nuevas.indexOf(p) < 0) nueva[p.num] = i + 1; });
        res.pages.forEach(function (p, i) { if (p.num != null || nuevas.indexOf(p) >= 0) p.num = i + 1; });
        res.pages.forEach(function (p) { if (p.tipo === 'solucion' && p.entradas) p.entradas.forEach(function (e) { if (nueva[e.p]) e.p = nueva[e.p]; }); });
      }
      res.referenciasHojasNuevas = nuevas.length;
    }
    res.referencias = n;
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
        var id = idDe(r[0]), cn = nombreCorte(r); D.img[id] = DATA[id];
        return { tipo: 'idea', id: id, t: r[1], texto: r[1] + (cn ? ': se parece al «' + cn + '» del curso.' : '.') + ' Así queda de frente, de lado y de atrás.', rot: [] };
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
