/* b6_pelu_escaner_galeria.js — «Cortes por forma»: el escáner de la biblioteca en el libro y el curso (window.EU_ESCANER_GALERIA, 31-10-2026).
   Fátima: «que el sistema saque la cuenta de elevación de la imagen con el motor de geometría capilar; cada imagen con el maniquí en la
   forma del corte, la imagen de referencia y la lección bien explicativa; en los libros, los PDF, el libro interactivo y el curso; ninguna
   hoja vacía».
   Datos: b6_pelu_escaner_datos.js (GENERADO por escaner/: medir.py → calcular.js → maniquies.py). Cada imagen de resultado de corte de su
   Galería web lleva su numeración (calculada desde la foto con EU_CALCULO_CAPILAR, o el corte del catálogo si la foto no deja medir), su
   grupo de largo (corto hasta la barbilla · medio · largo desde media espalda, 45 cm a validar), el fotograma del maniquí
   (referencias/galeria_web/maniqui/) y los pasos de su lección (título y explicación de cada escena del motor).
   Libro (pelu): una hoja por imagen, página `pe_escaneo` (foto + maniquí + ficha + «La lección, paso a paso»; si los pasos no caben,
   siguen en hojas de continuación), al final de su unidad, antes del repaso del tutor; solo unidades que lleva el libro; sin repetir la
   foto que ya es la foto de una clase (b6_pelu_receta.js) ni una hoja de galería. Las de revisión no entran (en modo revisión,
   localStorage eu_revision = 'si', la ficha dice además lo que es aproximado). Curso: lecciones «Cortes por forma · <módulo>» de 6 imágenes
   (foto y maniquí con su numeración). cfg.acab.cortesForma = 'no' lo apaga. Se engancha después de b6_pelu_receta.js. */
(function () {
  if (window.EU_ESCANER_GALERIA) return;
  var DIR_M = './referencias/galeria_web/maniqui/', DIR_F = './referencias/galeria_web/imagenes/';
  var LINEA = { recta: 'recta (cuadrado)', redondeada: 'redondeada', u: 'en U', v: 'en V', a: 'en A (más larga delante)' };
  var GRUPO = { corto: 'Corto (hasta la barbilla)', medio: 'Medio (de la barbilla a media espalda)', largo: 'Largo (desde media espalda)' };
  var ZN = ['Nuca', 'Nuca alta', 'Occipital', 'Parietal', 'Lateral', 'Coronilla', 'Flequillo'];
  function datos() { return window.EU_ESCANER_DATOS || { imagenes: [], textos: [] }; }
  function lista() { return datos().imagenes.filter(function (e) { return e.man && e.fuente !== 'revision'; }); }
  function porN(n) { var L = datos().imagenes; for (var i = 0; i < L.length; i++) if (L[i].n === n) return L[i]; return null; }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function rev() { try { return localStorage.getItem('eu_revision') === 'si'; } catch (e) { return false; } }
  function apagado(cfg) { return !cfg || cfg.materia !== 'pelu' || ((cfg.acab || {}).cortesForma) === 'no'; }

  /* maniquíes como data URL (el libro descargado y el curso no ven las rutas de la app) */
  var MAN = {};
  setTimeout(function () {
    var vistos = {};
    lista().forEach(function (e) {
      if (vistos[e.man]) return; vistos[e.man] = 1;
      try { fetch(DIR_M + e.man).then(function (x) { return x.ok ? x.blob() : null; }).then(function (b) { if (!b) return; var fr = new FileReader(); fr.onload = function () { MAN[e.man] = fr.result; }; fr.readAsDataURL(b); }).catch(function () { }); } catch (er) { }
    });
  }, 1500);
  function srcMan(e) { var V = window.EU_MANIQUI_PUENTE, v = V && V.manV18 && V.manV18(e); return v || MAN[e.man] || DIR_M + e.man; } /* V18 primero (5-11-2026) */
  function gwId(e) { var GA = window.EU_PELU_GALERIA; return GA && GA.id ? GA.id(e.n) : 'pe_gw_' + e.n; }
  function srcFoto(e) { var GA = window.EU_PELU_GALERIA; return (GA && GA.dato && GA.dato(gwId(e))) || DIR_F + e.archivo; }
  function unidad(e) {
    var d = e.destino || {}; if (d.unidad) return d.unidad;
    var CO = window.EU_CORTES, c = d.k === 'corte' && CO && CO.get ? CO.get(d.id) : null; return c ? 'pe_u_c_' + c.fam : '';
  }
  function pasos(e) { var T = datos().textos || []; return (e.pasos || []).map(function (i) { return T[i]; }).filter(Boolean); }
  /* numeración que se enseña: la calculada (capas de la nuca hacia arriba) o la del corte del catálogo (por zonas) */
  function numeracion(e) {
    if (e.fuente === 'escaner' && e.R) return e.R.capas.map(function (g, i) { return ['Capa ' + (i + 1), g]; });
    var CO = window.EU_CORTES, TE = e.corte && CO && CO.tecnica ? (CO.tecnica(e.corte) || {}) : {};
    return (TE.elev || []).map(function (g, z) { return [ZN[z] || ('Zona ' + (z + 1)), g]; });
  }
  function nombreCorte(e) { var CO = window.EU_CORTES, c = e.corte && CO && CO.get ? CO.get(e.corte) : null; return c ? c.n : ''; }
  function fichaTexto(e) {
    var num = numeracion(e).map(function (x) { return x[0] + ' a ' + x[1] + ' grados'; }).join(', ');
    var t = e.fuente === 'escaner' ? 'Forma ' + (LINEA[e.R.linea] || e.R.linea) + '. Largo ' + (e.grupo || '') + ', unos ' + e.cm + ' centímetros desde lo alto de la cabeza. ' +
      (e.R.capas.some(function (g) { return g; }) ? 'Numeración calculada desde la imagen: ' + num + '.' : 'Sin capas: todo a cero grados, todo el peso en el cuello.')
      : 'Corte del curso: ' + nombreCorte(e) + '. ' + (num ? 'Elevación por zonas: ' + num + '.' : '');
    return t;
  }

  /* ─────────── reparto de los pasos en hojas ─────────── */
  function cabida(C, primera) {
    var P = C.papel || {}, h = P.h || 297, w = P.w || 210, alto = h >= 250, cf = C.cfg || {}, k = cf.facil || cf.dislexia ? 1.32 : 1;   /* letra fácil o para dislexia: más grande */
    var mm = h - 34 - 14 - (primera ? (alto ? 66 : 46) + 30 : 6);            /* cabecera y título · folio · figuras y ficha */
    return { mm: mm, cpl: Math.max(40, Math.round((w - 36) / 1.2 / k)), lh: 3.75 * k, fig: alto ? 66 : 46 };   /* medido en la hoja: ~145 letras por línea en A4 */
  }
  function trozos(e, C) {
    var L = pasos(e), out = [], cur = [], cap = cabida(C, true).mm * 0.9, usado = 0;
    L.forEach(function (p, i) {
      var lin = Math.ceil((String(p[0]).length + String(p[1] || '').length + 3) / cabida(C, false).cpl), h = lin * cabida(C, false).lh + 1.2 * (cabida(C, false).lh / 3.75);
      if (usado + h > cap && cur.length) { out.push(cur); cur = []; usado = 0; cap = cabida(C, false).mm * 0.9; }
      cur.push(i); usado += h;
    });
    if (cur.length || !out.length) out.push(cur);
    return out;
  }

  /* ─────────── página ─────────── */
  var ED = window.EU_EDITORIAL;
  function pagina(pg, C) {
    var H = ED.H, T = C.T || {}, acc = T.acc || '#B08D57', soft = T.soft || '#EEF0F3', e = porN(pg.esc); if (!e) return '';
    var cap = cabida(C, true), L = pasos(e), idx = pg.idx || [], k0 = idx.length ? idx[0] : 0;
    /* imagen de un corte cuya lección completa ya está en otra hoja: sus pasos clave (títulos) y dónde está la lección */
    var clave = pg.clave ? '<div style="font-size:.76em;line-height:1.42;margin:1mm 0 0"><b>Pasos clave:</b> ' + L.map(function (p) { return esc(p[0]); }).join(' · ') + '.</div>' +
      '<div style="font-size:.76em;margin-top:1.5mm"><b>La lección completa de este corte, paso a paso:</b> pág. ' + (pg.clave.num || '') + '.</div>' : '';
    var lista = '<ol start="' + (k0 + 1) + '" style="margin:1mm 0 0;padding-left:5mm;font-size:.74em;line-height:1.38">' +
      idx.map(function (i) { var p = L[i]; return '<li style="margin:0 0 1.2mm"><b>' + esc(p[0]) + '.</b> ' + esc(p[1] || '') + '</li>'; }).join('') + '</ol>';
    var kick = '<div style="font-size:.74em;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:' + acc + ';margin:0 0 1.5mm">Corte por forma · ' +
      (pg.parte > 1 ? 'la lección, continuación (' + pg.parte + ' de ' + pg.partes + ')' : 'imagen, maniquí y lección') + '</div>';
    if (pg.parte > 1) return H.cabecera(C, pg) + kick + H.h1(C, esc(e.titulo)) + '<div style="font-weight:700;color:' + acc + ';font-size:.8em">La lección, paso a paso (sigue)</div>' + lista + H.folio(C, pg);
    var fh = cap.fig + (pg.clave ? (cap.fig > 50 ? 34 : 16) : 0);
    var figs = '<div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:3mm;margin:0 0 2.5mm">' +
      '<figure style="margin:0;background:' + soft + ';border-radius:2mm;padding:1.2mm"><img src="' + srcFoto(e) + '" alt="' + esc(e.titulo) + '" style="display:block;width:100%;height:' + fh + 'mm;object-fit:contain;border-radius:1.5mm">' +
      '<figcaption style="font-size:.64em;margin-top:1mm"><b style="color:' + acc + '">Imagen de referencia</b></figcaption></figure>' +
      '<figure style="margin:0;background:' + soft + ';border-radius:2mm;padding:1.2mm"><img src="' + srcMan(e) + '" alt="Maniquí" style="display:block;width:100%;height:' + fh + 'mm;object-fit:contain;border-radius:1.5mm">' +
      '<figcaption style="font-size:.64em;margin-top:1mm"><b style="color:' + acc + '">Maniquí · ' + esc(e.manT || 'Cómo queda') + '</b></figcaption></figure></div>';
    var chips = numeracion(e).map(function (x) { return '<span style="display:inline-block;margin:0 1mm 1mm 0;padding:.3mm 1.8mm;border-radius:99px;background:' + soft + ';white-space:nowrap"><b style="color:' + acc + '">' + esc(x[0]) + '</b> ' + x[1] + '°</span>'; }).join('');
    var nota = rev() ? [e.aprox, e.minimo ? 'la foto corta el cabello: el largo es un mínimo' : '', e.fuente === 'catalogo' ? e.motivo : ''].filter(Boolean).map(function (s) { return '<div style="color:#A0522D;font-weight:700">' + esc(s) + ' · a validar por Fátima</div>'; }).join('') : '';
    var ficha = '<div style="font-size:.76em;line-height:1.42;margin:0 0 2mm">' +
      (e.fuente === 'escaner' ? '<div><b>Forma:</b> ' + esc(LINEA[e.R.linea] || e.R.linea) + ' · <b>Largo:</b> ' + esc(GRUPO[e.grupo] || e.grupo) + ', unos ' + e.cm + ' cm desde lo alto de la cabeza' +
        (e.R.fleco ? ' · <b>Flequillo:</b> ' + (e.R.fleco === 'lado' ? 'de lado' : 'pollina') : '') + '</div>' +
        '<div style="margin:1mm 0"><b>' + (e.R.capas.some(function (g) { return g; }) ? 'Numeración de elevación (de la nuca hacia arriba), calculada desde la imagen con el motor de geometría capilar:' : 'Sin capas: todo a 0°, todo el peso en el cuello.') + '</b><div style="margin-top:1mm">' + chips + '</div></div>'
        : '<div><b>Corte del curso:</b> «' + esc(nombreCorte(e)) + '».</div>' + (chips ? '<div style="margin:1mm 0"><b>Elevación por zonas:</b><div style="margin-top:1mm">' + chips + '</div></div>' : '')) +
      nota + '</div>';
    return H.cabecera(C, pg) + kick + H.h1(C, esc(e.titulo)) + figs + ficha +
      (pg.clave ? clave : '<div style="font-weight:700;color:' + acc + ';font-size:.8em">La lección, paso a paso</div>' + lista) + H.folio(C, pg);
  }
  if (ED && ED.registrar) ED.registrar({
    paginas: { pe_escaneo: pagina },
    voz: { pe_escaneo: function (pg) { var e = porN(pg.esc); if (!e) return ''; var L = pasos(e);
      return (pg.parte > 1 ? '' : e.titulo + '. ' + fichaTexto(e) + ' ') + (pg.clave ? 'Pasos clave: ' + L.map(function (p) { return p[0]; }).join(', ') + '. La lección completa está en la página ' + (pg.clave.num || '') + '.' :
        (pg.idx || []).map(function (i) { return L[i][0] + '. ' + (L[i][1] || ''); }).join(' ')); } }
  });

  /* ─────────── libro: una hoja por imagen (más las de continuación) al final de su unidad ─────────── */
  function repartir(res) {
    var C = res && res.C, cfg = C && C.cfg; if (!res || !res.pages || apagado(cfg)) return res;
    var hay = {}, ya = {}, porU = {}, orden = [], nuevas = [], leccion = {};
    res.pages.forEach(function (p) {
      if (p.u && !p.anexo) hay[p.u.id] = 1;
      if (p.tipo === 'pe_clase' && p.foto) ya[p.foto] = 1;
      if (p.tipo === 'pe_galeria' && p.gw) ya[p.gw] = 1;
      if (p.tipo === 'pe_escaneo') ya['esc' + p.esc] = 1;
    });
    lista().forEach(function (e) {
      var uid = unidad(e); if (!uid || !hay[uid] || ya[gwId(e)] || ya['esc' + e.n]) return;
      if (!porU[uid]) { porU[uid] = []; orden.push(uid); } porU[uid].push(e);
    });
    orden.forEach(function (uid) {
      var f = -1, ult = -1;
      res.pages.forEach(function (p, i) { if (f < 0 && p.u && p.u.id === uid && !p.anexo) f = i; });
      for (var i = f; f >= 0 && i < res.pages.length; i++) { var q = res.pages[i]; if (!q.u || q.u.id !== uid || q.anexo) break; if (q.tipo !== 'tutor' && q.tipo !== 'repaso') ult = i; }
      if (ult < 0) return;
      var base = res.pages[ult], hs = [];
      porU[uid].forEach(function (e) {
        /* la lección completa, una vez por corte (misma numeración, línea y flequillo, o el mismo corte del catálogo); las demás imágenes de ese corte, sus pasos clave y la página de la lección */
        var clave = e.fuente === 'escaner' && e.R ? [e.R.capas.join('.'), e.R.linea, e.R.fleco || ''].join('|') : 'corte:' + e.corte, pr = leccion[clave];
        if (pr) { hs.push({ tipo: 'pe_escaneo', u: base.u, n: base.n, esc: e.n, idx: [], clave: pr, parte: 1, partes: 1, fill2: { nada: 1 } }); return; }
        var tz = trozos(e, C), h0 = null;
        tz.forEach(function (idx, j) { var h = { tipo: 'pe_escaneo', u: base.u, n: base.n, esc: e.n, idx: idx, parte: j + 1, partes: tz.length, fill2: { nada: 1 } }; if (!j) h0 = h; hs.push(h); });
        leccion[clave] = h0;
      });
      res.pages.splice.apply(res.pages, [ult + 1, 0].concat(hs)); nuevas = nuevas.concat(hs);
    });
    if (nuevas.length) {
      var mapa = {};
      res.pages.forEach(function (p, i) { if (p.num != null && nuevas.indexOf(p) < 0) mapa[p.num] = i + 1; });
      res.pages.forEach(function (p, i) { if (p.num != null || nuevas.indexOf(p) >= 0) p.num = i + 1; });
      res.pages.forEach(function (p) { if (p.tipo === 'solucion' && p.entradas) p.entradas.forEach(function (x) { if (mapa[x.p]) x.p = mapa[x.p]; }); });
    }
    res.cortesForma = { imagenes: nuevas.filter(function (p) { return p.parte === 1; }).length, hojas: nuevas.length };
    return res;
  }
  function engancharLibro() {
    if (!ED || ED.__peluEscaneo) return true;
    if (!ED.__peluReceta) return false;
    ED.__peluEscaneo = 1;
    var ens = ED.ensamblar;
    ED.ensamblar = function () { var r = ens.apply(this, arguments); try { repartir(r); } catch (e) { console.warn('Cortes por forma · libro', e); } return r; };
    return true;
  }
  (function espera(k) { if (!engancharLibro() && k < 2000) setTimeout(function () { espera(k + 1); }, 300); })(0);

  /* ─────────── curso premium: «Cortes por forma · <módulo>» (6 imágenes por lección: foto y maniquí) ─────────── */
  function ponerCurso(D) {
    if (!D || !D.modulos || D._cortesForma) return D;
    D.img = D.img || {};
    D.modulos.forEach(function (M) {
      var L = lista().filter(function (e) { return unidad(e) === M.id && !D.img[gwId(e)]; });
      if (!L.length || !M.lecciones) return;
      var tot = Math.ceil(L.length / 6), mt = String(M.t || '').replace(/^Cortes · /, '');
      for (var i = 0; i < L.length; i += 6) {
        var esc_ = [];
        L.slice(i, i + 6).forEach(function (e) {
          var fid = 'cf_f' + e.n, mid = 'cf_m' + e.n;
          D.img[fid] = srcFoto(e); D.img[mid] = srcMan(e);
          esc_.push({ tipo: 'idea', id: fid, t: e.titulo + ' · imagen de referencia', texto: e.titulo + '. Así queda el corte en la imagen de referencia.', rot: [] });
          esc_.push({ tipo: 'idea', id: mid, t: e.titulo + ' · en el maniquí', texto: fichaTexto(e), rot: [] });
        });
        M.lecciones.push({ id: M.id + '__cortesForma' + (i / 6 + 1), t: 'Cortes por forma · ' + mt + (tot > 1 ? ' ' + (i / 6 + 1) + '/' + tot : ''), pag: M.pag, escenas: esc_ });
      }
    });
    D._cortesForma = 1;
    return D;
  }
  function engancharCurso() {
    var CA = window.EU_CURSO_ANIM;
    if (window.__cortesFormaCurso) return true;
    if (!CA || !CA.enriquecer || !window.EU_PELU_RECETA) return false;
    window.__cortesFormaCurso = 1;
    var enr = CA.enriquecer;
    CA.enriquecer = function (D, res) {
      return Promise.resolve(enr.apply(this, arguments)).then(function (D2) {
        var R = D2 || D, cfg = res && res.C && res.C.cfg;
        return apagado(cfg) ? R : ponerCurso(R);
      });
    };
    CA.enriquecer._cortesForma = 1;
    return true;
  }
  (function espera(k) { if (!engancharCurso() && k < 2000) setTimeout(function () { espera(k + 1); }, 300); })(0);

  window.EU_ESCANER_GALERIA = { lista: lista, unidad: unidad, repartir: repartir, ponerCurso: ponerCurso, fichaTexto: fichaTexto, pasos: pasos,
    revision: function () { return datos().imagenes.filter(function (e) { return e.fuente === 'revision'; }).map(function (e) { return { n: e.n, titulo: e.titulo, motivo: e.motivo }; }); } };
})();
