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
     galería), escenas que no van, pasos que se añaden, vídeo inicial } */
  var R = {
    basico_cuadrado: {
      k: 'corte', n: 'Básico cuadrado', lec: '__basico_cuadrado', pre: 'basico_cuadrado_',
      quita: /^(Paso \d|Cortes · )/,
      mp4: 'clases/lavado.mp4',
      fotos: { lavado: 469, seccion: 402, particion: 327, guia: 397, queda_nuca: 50, queda_lateral: 50, queda_frente: 50 }
    },
    color_global: {
      k: 'tec', id: 'cb_color_global', cer: 'color_global', n: 'Color global', lec: '__color_global', pre: 'cb_color_global_',
      fotos: { cb_receta: 478, cb0_divisiones: 379, cb_lam_plantaCuatro: 330, cb1_aplicacion: 479, cb2_aplicacion: 313, cb3_aplicacion: 254, cb4_aplicacion: 301, cb_queda_color: 96 },
      /* su clase del peróxido (b6_color_fatima.js · fat_p01), con la foto del oxidante, después de la preparación */
      insertar: [{ tras: 'cb_receta', tipo: 'oxidante', t: 'El oxidante (peróxido)', foto: 495, clase: 'fat_p01' }]
    }
  };

  function G() { return window.EU_PELU_GALERIA; }
  function foto(n) { var g = G(); if (!g || !n) return null; var id = g.id(n), d = g.dato(id); return d ? { id: id, src: d, t: g.titulo(n) } : null; }
  /* puntos de una clase de su cerebro de colorimetría, tal cual (sin el icono del principio) */
  function puntosClase(id) {
    var B = window.EU_COLOR_CEREBRO, c = null; (B && B.clases || []).some(function (x) { if (x.id === id) { c = x; return true; } return false; });
    return c ? c.b.map(function (b) { return [b[0], String(b[1]).replace(/^[^\wÁÉÍÓÚÑáéíóúñ¿¡]+/, '')]; }) : [];
  }
  function toolsClase(id) { var B = window.EU_COLOR_CEREBRO, c = null; (B && B.clases || []).some(function (x) { if (x.id === id) { c = x; return true; } return false; }); return c && c.tools || []; }
  function textoClase(id) { return puntosClase(id).map(function (b) { return b[1]; }).join(' '); }
  function activo(cfg) { return cfg && cfg.materia === 'pelu' && ((cfg.acab || {}).receta) !== 'no'; }

  /* ─────────── curso ─────────── */
  function curso(D) {
    if (!D || !D.modulos || D._receta) return D;
    var V = (window.EU_PELU_VIDEOS && window.EU_PELU_VIDEOS.VIDEOS) || {};
    Object.keys(R).forEach(function (k) {
      var r = R[k], L = null;
      D.modulos.some(function (M) { return M.lecciones.some(function (l) { if (l.id === M.id + r.lec) { L = l; return true; } return false; }); });
      if (!L) return;
      if (r.quita) L.escenas = L.escenas.filter(function (e) { return !r.quita.test(e.t || ''); });
      D.img = D.img || {};
      L.escenas.forEach(function (e) {
        var s = e.anim && e.anim.indexOf(r.pre) === 0 ? e.anim.slice(r.pre.length) : '', f = foto(r.fotos[s]);
        if (f) { D.img[f.id] = f.src; e.foto = f.id; }
      });
      (r.insertar || []).forEach(function (a) {
        var i = -1; L.escenas.forEach(function (e, j) { if (e.anim === r.pre + a.tras) i = j; });
        var f = foto(a.foto), tx = textoClase(a.clase); if (!tx) return;
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
    var E = null, fotoDe = null;
    if (r.k === 'corte') {
      var LD = window.EU_PELU_LIBRO_DG, d = null; try { d = LD && LD.datos({ k: 'corte', corte: k }); } catch (e) { d = null; }
      E = d && d.E; fotoDe = function (e) { try { return window.EU_DIAGRAMA.foto(e, 760, 0.82); } catch (er) { return ''; } };
    } else {
      var LA = window.EU_PELU_LIBRO_ANIM, d2 = null; try { d2 = LA && LA.datos(r.id || k); } catch (e) { d2 = null; }
      E = d2 && d2.E; fotoDe = function (e, i) { try { return LA.foto(r.id || k, i, 760); } catch (er) { return ''; } };
    }
    if (!E || !E.escenas) return [];
    var P = []; P.R = d && d.R;
    E.escenas.forEach(function (e, i) {
      if (r.quita && r.quita.test(e.t || '')) return;
      P.push({ tipo: e.tipo, t: e.t, texto: e.texto, foto: foto(r.fotos[e.tipo]), mani: fotoDe(e, i) });
      (r.insertar || []).forEach(function (a) { if (a.tras === e.tipo) { var b = puntosClase(a.clase); if (b.length) P.push({ tipo: a.tipo, t: a.t, texto: textoClase(a.clase), puntos: b, tools: toolsClase(a.clase), foto: foto(a.foto), mani: '' }); } });
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
    return caja(T, 'Recomendaciones', '<ul style="margin:0;padding-left:5mm">' + F.recomendaciones.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>');
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
          else if (pg.paso === 0) extra = fichaTinte(r.cer, T);
          else if (ult) extra = recomTinte(r.cer, T);
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
