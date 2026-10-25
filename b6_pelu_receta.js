/* b6_pelu_receta.js — lecciones «receta» de Peluquería (window.EU_PELU_RECETA).
   Fátima, 25-10-2026: «una imagen + el maniquí + la técnica + la explicación, bien organizado como un libro de recetas»,
   «el vídeo y la animación en una sola pantalla, uno detrás del otro», «cada imagen da su lección, no imágenes sueltas».
   - Curso: la lección de la técnica se queda (mismas escenas animadas del motor), sin la portada genérica ni las fotos fijas
     de los pasos; cada paso lleva al lado SU foto de la galería (e.foto) y, si hay vídeo, la lección empieza con el vídeo y
     sigue sola con la animación (L.mp4 + L.siguen; el reproductor está en b6_curso_premium.js).
   - Libro: página `pe_receta`, una por paso: la foto, el maniquí de ese paso y la explicación.
   Primera entrega: dos lecciones de muestra (Básico cuadrado y Color global) para que Fátima las revise.
   Las fotos de cada paso salen de su Galería web (b6_pelu_galeria.js) por su número; los textos son los del sistema
   (sus fichas, su cerebro de colorimetría). `cfg.acab.receta='no'` lo apaga. */
(function () {
  'use strict';
  if (window.EU_PELU_RECETA) return;

  /* técnica → { lección del curso (final del id), prefijo de las animaciones, fotos por paso (tipo de escena → n.º de la
     galería), escenas que no van, pasos que se añaden, vídeo inicial }.
     Fátima, 25-10-2026: cada foto tiene que enseñar LO MISMO que el maniquí (forma y elevación). El básico cuadrado es un
     corte recto a 0°: solo lleva fotos de corte recto (n.º 64 «Corte recto» y 71 «Corte largo recto»); la n.º 50 es un
     corte redondo con pollina y no va aquí. Las fotos de divisiones 81–90 no van en los pasos (todas iguales). */
  var R = {
    basico_cuadrado: {
      k: 'corte', n: 'Básico cuadrado', lec: '__basico_cuadrado', pre: 'basico_cuadrado_',
      quita: /^(Paso \d|Cortes · )/,
      mp4: 'clases/lavado.mp4',
      fotos: { lavado: 469, queda_nuca: 64, queda_lateral: 64, queda_frente: 71 }
    },
    /* Fátima: «en el tinte no expliques la decoloración»; las canas van en su propia clase, después */
    color_global: {
      k: 'tec', id: 'cb_color_global', cer: 'color_global', n: 'Tinte · color global', lec: '__color_global', pre: 'cb_color_global_',
      quitaT: /cubrir las canas/i,
      fotos: { cb_receta: 478, cb0_divisiones: 379, cb_lam_plantaCuatro: 330, cb1_aplicacion: 479, cb2_aplicacion: 301, cb_queda_color: 96 },
      /* su clase del peróxido (fat_p01) solo con lo que es del tinte, y su recomendación de 20/30 vol de la ficha */
      insertar: [{ tras: 'cb_receta', tipo: 'oxidante', t: 'El oxidante (peróxido) en el tinte', foto: 495, clase: 'fat_p01', solo: [0, 1, 2, 3, 7], rec: [1], tools: [0, 1, 2, 4, 5] }]
    },
    /* clase nueva, detrás del color global: las dos fórmulas del mismo tinte (sus textos: Cerebro y fat_i02) */
    tinte_canas: {
      k: 'canas', n: 'Tinte para cubrir canas', lec: '__receta_canas', pre: 'rc_canas_', tras: '__color_global',
      fotos: { formulas: 314, cb0_divisiones: 379, raiz: 254, puntas: 313, cb_queda_color: 97 }
    }
  };

  function G() { return window.EU_PELU_GALERIA; }
  function foto(n) { var g = G(); if (!g || !n) return null; var id = g.id(n), d = g.dato(id); return d ? { id: id, src: d, t: g.titulo(n) } : null; }
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
  function toolsClase(id) { var c = clase(id); return c && c.tools || []; }
  function activo(cfg) { return cfg && cfg.materia === 'pelu' && ((cfg.acab || {}).receta) !== 'no'; }

  /* ─────────── la clase de canas: el producto se ve en el cabello ───────────
     Mismo tinte, dos fórmulas: la fuerte (más tinte, menos peróxido) en la raíz, tres dedos; la diluida desde ahí hasta
     las puntas. En el maniquí: las canas en la raíz, la raíz que se cubre con el color fuerte y el resto con el diluido. */
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
    return { v: v, tr: tr };
  }
  var CANAS = null;
  function canasE() {
    if (CANAS) return CANAS;
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
    nv.formulas.texto = [b[0], rec[2]].filter(Boolean).join(' ');
    nv.raiz.texto = [paso(/canas · raíz/), b[2]].filter(Boolean).join(' ');
    nv.puntas.texto = paso(/canas · hasta las puntas/);
    var esc = [nv.formulas, copia(de(/divisiones$/)), nv.raiz, nv.puntas,
      copia(de(/_tiempo$/), 'Exposición', b[4]), copia(de(/_cierre$/), 'Retirar, lavar y terminar', b[5]), copia(de(/^cb_queda_color$/))].filter(function (e) { return e && e.texto; });
    return (CANAS = { R: EN.R, escenas: esc, fondos: EN.fondos });
  }

  /* ─────────── curso ─────────── */
  function anclaE(D, e, pre) { var k = pre + e.tipo; D.anim[k] = e.anim; D.img['dg_' + e.vista] = D.img['dg_' + e.vista] || (CANAS && CANAS.fondos[e.vista]); return k; }
  function curso(D) {
    if (!D || !D.modulos || D._receta) return D;
    var V = (window.EU_PELU_VIDEOS && window.EU_PELU_VIDEOS.VIDEOS) || {};
    D.img = D.img || {}; D.anim = D.anim || {};
    Object.keys(R).forEach(function (k) {
      var r = R[k], L = null, M0 = null, iL = -1;
      if (r.k === 'canas') {
        D.modulos.some(function (M) { return M.lecciones.some(function (l, i) { if (l.id === M.id + r.tras) { M0 = M; iL = i; return true; } return false; }); });
        var E = M0 && canasE(); if (!E) return;
        Object.keys(E.fondos).forEach(function (v) { D.img['dg_' + v] = D.img['dg_' + v] || E.fondos[v]; });
        L = { id: M0.id + r.lec, t: r.n, pag: M0.pag, escenas: E.escenas.map(function (e) { return { tipo: 'paso', id: 'dg_' + e.vista, t: e.t, texto: e.texto, rot: [], anim: anclaE(D, e, r.pre) }; }) };
        M0.lecciones.splice(iL + 1, 0, L);
      } else {
        D.modulos.some(function (M) { return M.lecciones.some(function (l) { if (l.id === M.id + r.lec) { L = l; return true; } return false; }); });
        if (!L) return;
        if (r.quita) L.escenas = L.escenas.filter(function (e) { return !r.quita.test(e.t || ''); });
        if (r.quitaT) L.escenas = L.escenas.filter(function (e) { return !r.quitaT.test(e.t || ''); });
        if (r.k === 'tec') L.t = r.n;
      }
      L.escenas.forEach(function (e) {
        var s = e.anim && e.anim.indexOf(r.pre) === 0 ? e.anim.slice(r.pre.length) : '', f = foto(r.fotos[s]);
        if (f) { D.img[f.id] = f.src; e.foto = f.id; }
      });
      (r.insertar || []).forEach(function (a) {
        var i = -1; L.escenas.forEach(function (e, j) { if (e.anim === r.pre + a.tras) i = j; });
        var f = foto(a.foto), tx = textoDe(a); if (!tx) return;
        if (f) D.img[f.id] = f.src;
        L.escenas.splice(i + 1, 0, { tipo: 'paso', id: f ? f.id : (L.escenas[0] || {}).id, foto: f ? f.id : undefined, t: a.t, texto: tx, rot: [] });
      });
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
  function escenas(k) {
    var r = R[k]; if (!r) return [];
    var E = null, fotoDe = null, d = null;
    if (r.k === 'corte') {
      var LD = window.EU_PELU_LIBRO_DG; try { d = LD && LD.datos({ k: 'corte', corte: k }); } catch (e) { d = null; }
      E = d && d.E; fotoDe = function (e) { try { return window.EU_DIAGRAMA.foto(e, 760, 0.82); } catch (er) { return ''; } };
    } else if (r.k === 'canas') {
      E = canasE(); fotoDe = function (e) { try { return window.EU_DIAGRAMA.foto(e, 760, 0.82); } catch (er) { return ''; } };
    } else {
      var LA = window.EU_PELU_LIBRO_ANIM, d2 = null; try { d2 = LA && LA.datos(r.id || k); } catch (e) { d2 = null; }
      E = d2 && d2.E; fotoDe = function (e, i) { try { return LA.foto(r.id || k, i, 760); } catch (er) { return ''; } };
    }
    if (!E || !E.escenas) return [];
    var P = []; P.R = d && d.R;
    E.escenas.forEach(function (e, i) {
      if (r.quita && r.quita.test(e.t || '')) return;
      if (r.quitaT && r.quitaT.test(e.t || '')) return;
      P.push({ tipo: e.tipo, t: e.t, texto: e.texto, foto: foto(r.fotos[e.tipo]), mani: fotoDe(e, i) });
      (r.insertar || []).forEach(function (a) { if (a.tras === e.tipo) { var b = puntosDe(a); if (b.length) P.push({ tipo: a.tipo, t: a.t, texto: textoDe(a), puntos: b, tools: toolsClase(a.clase).filter(function (x, i) { return !a.tools || a.tools.indexOf(i) >= 0; }), foto: foto(a.foto), mani: '' }); } });
    });
    return P;
  }
  var CACHE = {};
  function pasos(k) { return CACHE[k] || (CACHE[k] = escenas(k)); }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  var ALT_N = { cejas: 'bajo las cejas', ojo: 'bajo el ojo', nariz: 'bajo la nariz', labio: 'bajo el labio', barbilla: 'en la barbilla', rostro: 'donde termina el rostro', cuello: 'en el cuello' };
  var CORTE_ELEV = /capas|angulos|peinado|lateral|frente|emparejar|guia/;
  var ICONO = { alerta: '⚠', importante: '📌', tip: '💡' };
  function chip(T, a, b) { return '<span style="display:inline-block;margin:0 1.2mm 1.2mm 0;padding:.5mm 2.2mm;border-radius:99px;background:' + T.soft + ';white-space:nowrap"><b style="color:' + T.acc + '">' + a + '</b> ' + b + '</span>'; }
  function caja(T, tit, html) { return '<div style="margin:4mm 0 0;padding:3mm 4mm;border-left:1.2mm solid ' + T.acc + ';background:' + T.soft + ';border-radius:0 2mm 2mm 0;font-size:.84em;line-height:1.45"><div style="font-weight:700;letter-spacing:.06em;text-transform:uppercase;font-size:.85em;color:' + T.acc + ';margin:0 0 1.5mm">' + tit + '</div>' + html + '</div>'; }
  /* ficha del corte: solo lo que dice su receta del motor (capas y su elevación, secciones, guía, línea, acabado) */
  function fichaCorte(R, T) {
    if (!R) return '';
    var pila = (R.capas && R.capas.pila) || [];
    return caja(T, 'Ficha del corte',
      '<div style="margin:0 0 1mm"><b>Capas de abajo arriba:</b></div><div>' + pila.map(function (g, z) { return chip(T, 'Mechón ' + (z + 1), g + '°'); }).join('') + '</div>' +
      '<div><b>Secciones:</b> ' + (R.oblicua ? 'oblicuas' : R.liso ? 'horizontales (liso extremo)' : 'según su línea') + ' · <b>Lateral:</b> dividido de oreja a oreja</div>' +
      (R.altura ? '<div><b>Guía del frente:</b> a 0°, ' + esc(ALT_N[R.altura] || R.altura) + '</div>' : '') +
      (R.linea ? '<div><b>Línea de corte:</b> ' + (R.linea === 'recta' ? 'recta (queda cuadrado)' : R.linea === 'v' ? 'en V (queda en punta)' : R.linea === 'u' ? 'en U' : R.linea === 'a' ? 'en A (V invertida)' : 'redondeada') + '</div>' : '') +
      '<div><b>Acabado:</b> ' + (R.desg ? 'desgrafilado' : 'recto') + '</div>');
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

  var ED = window.EU_EDITORIAL;
  if (ED && ED.registrar) {
    ED.registrar({
      paginas: {
        pe_receta: function (pg, C) {
          var H = ED.H, T = C.T || {}, r = R[pg.rec], P = pasos(pg.rec), p = P[pg.paso];
          if (!r || !p) return '';
          T = { acc: T.acc || '#B08D57', soft: T.soft || '#EEF0F3' };
          var alto = ((C.papel && C.papel.h) || 297) >= 250, ult = pg.paso === P.length - 1;
          var extra = '';
          if (r.k === 'corte') { if (pg.paso === 0 || ult || CORTE_ELEV.test(p.tipo)) extra = fichaCorte(P.R, T); }
          else if (r.cer && pg.paso === 0) extra = fichaTinte(r.cer, T);
          else if (r.cer && ult) extra = recomTinte(r.cer, T);
          /* la foto arriba y el maniquí debajo, cada uno a todo lo ancho que quepa (como un libro de recetas);
             se achican si la hoja lleva ficha o el texto es largo */
          var menos = (extra ? 16 : 0) + ((p.texto || '').length > 300 ? 10 : 0);
          var hF = alto ? 84 - menos : 50, hM = alto ? 98 - menos : 56;
          var fig1 = function (src, alt, h) { return '<figure style="margin:0 0 3mm;display:flex;justify-content:center;background:' + T.soft + ';border-radius:2mm;overflow:hidden"><img src="' + src + '" alt="' + esc(alt) + '" style="display:block;max-width:100%;width:auto;height:' + h + 'mm;object-fit:contain"></figure>'; };
          var solo = p.puntos ? 84 : hF + hM, f = p.foto ? fig1(p.foto.src, p.foto.t, p.mani ? hF : solo) : '', m = p.mani ? fig1(p.mani, 'Maniquí · ' + p.t, p.foto ? hM : solo) : '';
          var fig = '<div style="margin:0 0 1.5mm">' + f + m + '</div>';
          var cuerpo = p.puntos
            ? '<ul style="margin:0;padding-left:5mm;font-size:.96em;line-height:1.5">' + p.puntos.map(function (b) { var ic = ICONO[b[0]]; return '<li style="margin:0 0 1.2mm' + (ic ? ';list-style:none;margin-left:-5mm' : '') + '">' + (ic ? '<b>' + ic + '</b> ' : '') + (ic ? '<b>' + esc(b[1]) + '</b>' : esc(b[1])) + '</li>'; }).join('') + '</ul>'
            : '<div style="font-size:1.04em;line-height:1.6">' + esc(p.texto) + '</div>';
          if (p.tools && p.tools.length) extra += caja(T, 'Lo que necesitas', p.tools.map(function (x) { return chip(T, '', esc(x)); }).join(''));
          return H.cabecera(C, pg) +
            '<div style="font-size:.74em;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:' + T.acc + ';margin:0 0 1.5mm">' + esc(r.n) + ' · paso ' + (pg.paso + 1) + ' de ' + P.length + '</div>' +
            H.h1(C, esc(p.t)) + fig + cuerpo + extra + H.folio(C, pg);
        }
      },
      voz: { pe_receta: function (pg) { var p = pasos(pg.rec)[pg.paso]; return p ? p.t + '. ' + p.texto : ''; } }
    });
  }

  /* hojas de muestra: todas las de una técnica, para enseñárselas a Fátima antes de colocarlas en el libro */
  function hojas(k, base) {
    return pasos(k).map(function (p, i) { return { tipo: 'pe_receta', rec: k, paso: i, u: base && base.u, fill2: { nada: 1 } }; });
  }

  window.EU_PELU_RECETA = { R: R, curso: curso, pasos: pasos, hojas: hojas };
})();
