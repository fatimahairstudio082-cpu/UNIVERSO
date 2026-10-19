/* b6_pelu_laminas_libro.js — Peluquería (18-10-2026, Fátima: «reemplaza esta imagen genérica», «colocaste todos los
   maniquíes juntos en una sola hoja teniendo recursos para colocarlos en las otras hojas»).
   En el libro de `pelu`, la tarjeta plana del maniquí de Estudios (modelos pe_est_<técnica>_<k>) ya no se pinta en
   ninguna hoja: aperturas, fichas «Diagrama» (pe_corte) y la mitad de abajo de «Foto de referencia y maniquí» (pe_foto)
   llevan en su lugar una escena de la técnica animada de esa técnica (maniquí de Guías 3D, EU_DIAGRAMA), primero sus
   láminas (cb_lam_*: divisiones, zigzag, planta del balayage al 10/25/50/75 %…), luego los mechones (cb_mech_*) y después
   las demás escenas de trabajo, cada una con su título y su explicación (los textos de la propia escena, sin inventar).
   No repite escena en el libro mientras haya otras, y no usa las que ya salen impresas en su página «pe_animada».
   Los dibujos «mis» de la biblioteca (pe_est_mio…) no se tocan. Se apoya en el gancho `pre` del motor (lo deshace después).
   `cfg.acab.laminasLibro = 'no'` lo apaga. Cargar después de b6_pelu_fotos_libro.js. */
(function () {
  if (window.EU_PELU_LAMINAS_LIBRO) return;
  var CUR = null, REG = new WeakMap();
  function es(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function tecDe(id) { var m = /^pe_est_(?!mio)(.+)_(\d+)$/.exec(id || ''); return m ? { tec: 'cb_' + m[1], k: +m[2] } : null; }
  function orden(e) { var t = e.tipo || ''; return /^cb_lam_/.test(t) ? 0 : /^cb_mech_/.test(t) ? 1 : /queda/.test(t) ? 2 : 3; }
  /* escena para una hoja: la misma en cada pintado de esa hoja, distinta entre hojas del mismo libro */
  function escena(pg, C, id) { var x = tecDe(id); return x ? escenaDe(pg, C, id, [x.tec], x.k, 1) : null; }
  /* escena libre de una de las técnicas `tecs` (en orden); `repite`: si ya salieron todas, se acepta una repetida */
  function escenaDe(pg, C, clave, tecs, semilla, repite) {
    var LA = window.EU_PELU_LIBRO_ANIM; if (!LA || !LA.datos || !LA.foto) return null;
    var R = REG.get(C); if (!R) { R = { pg: new WeakMap(), usadas: {} }; REG.set(C, R); }
    var porPg = R.pg.get(pg) || {}; if (porPg[clave] !== undefined) return porPg[clave];
    var NOI = LA.NO_IMPRESO || /^cb_receta$|_preparacion$|_cierre$/, r = null, prim = null;
    tecs.some(function (tec) {
      var d = LA.datos(tec); if (!d) return false;
      var cand = []; d.E.escenas.forEach(function (e, k) { if (d.sel.indexOf(k) < 0 && !NOI.test(e.tipo || '')) cand.push(k); });
      cand.sort(function (a, b) { return orden(d.E.escenas[a]) - orden(d.E.escenas[b]) || a - b; });
      if (!prim && cand.length) prim = { tec: tec, d: d, k: cand[(semilla || 0) % cand.length] };
      var k0 = cand.filter(function (k) { return !R.usadas[tec + '|' + k]; })[0];
      if (k0 == null) return false;
      var src = LA.foto(tec, k0, 640, null); if (!src) return false;
      R.usadas[tec + '|' + k0] = 1; r = { e: d.E.escenas[k0], src: src, tec: tec }; return true;
    });
    if (!r && repite && prim) { var s2 = LA.foto(prim.tec, prim.k, 640, null); if (s2) r = { e: prim.d.E.escenas[prim.k], src: s2, tec: prim.tec }; }
    porPg[clave] = r; R.pg.set(pg, porPg); return r;
  }
  /* la escena como SVG (mismo sitio que el dibujo): imagen y debajo su título */
  function svgEsc(id, r) {
    return '<svg xmlns="http://www.w3.org/2000/svg" data-plano="1" data-modelo="' + es(id) + '" data-escena="' + es(r.e.tipo) + '" viewBox="0 0 200 160" style="width:100%;height:auto;display:block">' +
      '<image href="' + r.src + '" x="0" y="0" width="200" height="146" preserveAspectRatio="xMidYMid meet"/>' +
      '<text x="100" y="156" text-anchor="middle" font-family="Georgia,serif" font-size="7" font-weight="700" fill="#16223A">' + es(r.e.t.length > 62 ? r.e.t.slice(0, 60) + '…' : r.e.t) + '</text></svg>';
  }
  function enganchar() {
    var MO = window.EU_MODELOS, ED = window.EU_EDITORIAL; if (!MO || !MO.svg || !ED || !ED.registrar || !window.EU_PELU_FOTOS_LIBRO) return false;
    if (!MO.svg._lamLibro) {
      var sv = MO.svg;
      MO.svg = function (id) {
        if (CUR && tecDe(id)) { var r = escena(CUR.pg, CUR.C, id); if (r) return svgEsc(id, r); }
        return sv.apply(this, arguments);
      };
      MO.svg._lamLibro = 1;
    }
    if (ED.__lamLibro) return true; ED.__lamLibro = 1;
    ED.registrar({
      pre: function (pg, C) {
        var cfg = C && C.cfg; if (!cfg || cfg.materia !== 'pelu' || ((cfg.acab || {}).laminasLibro === 'no') || !pg) return;
        var antes = CUR, cambio = 0; CUR = { pg: pg, C: C };
        /* ficha «Diagrama» sin foto: pasa a hoja de escena con su explicación (el texto de Estudios no describe esta imagen) */
        var f2 = pg.fill2, ll = pg.llena;
        if (pg.tipo === 'pe_corte' && tecDe(pg.mod)) { pg.tipo = 'pe_escena'; cambio = 1; }
        /* el relleno se midió con la ficha de antes: la hoja de escena ya va llena con su explicación */
        var tocaF2 = cambio || pg.tipo === 'pe_foto';
        if (tocaF2) { pg.fill2 = { nada: 1 }; delete pg.llena; }
        else if (f2 && f2.fig && pg.u) { var n3 = observaEst(pg, C, f2); if (n3) { pg.fill2 = n3; tocaF2 = 1; } }
        else if (f2 && !f2.fig && f2.its && f2.its.length && pg.u) { var n2 = rellenoVisual(pg, C, f2); if (n2) { pg.fill2 = n2; tocaF2 = 1; } }
        return function () { CUR = antes; if (cambio) pg.tipo = 'pe_corte'; if (tocaF2) { pg.fill2 = f2; if (ll !== undefined) pg.llena = ll; } };
      },
      paginas: { pe_escena: function (pg, C) { return hoja(pg, C, null); } }
    });
    return true;
  }
  /* (18-10-2026, Fátima: «no se puede colocar contenido genérico», «para cubrir esas páginas hay que colocar imágenes»)
     En «Practica más» del relleno, los ejercicios genéricos («Cuéntale a alguien de tu familia…», «Dibuja y rotula…»,
     «Escribe una oración con…») y los «Ordena los pasos» repetidos dejan su sitio a una escena del maniquí de la
     técnica de la unidad (o de sus técnicas y clases animadas), con su título y su explicación tal cual. Si no hay
     escena libre o no cabe, la hoja se queda como estaba. */
  var GENERICO = /^(Explica con tus palabras qué es|Escribe una oración con la palabra|Busca un ejemplo de|Cuéntale a alguien de tu familia|Dibuja y rotula algo|Escribe una pregunta sobre)/;
  function tecsDe(u) {
    var o = /^cb_/.test(u.id) ? [u.id] : [], PA = window.EU_PARTICIONES, cat = [];
    try { cat = PA && PA.catalogo ? PA.catalogo() : []; } catch (e) { cat = []; }
    var add = function (re) { cat.forEach(function (t) { if (t && t.unidad === u.id && re.test(t.id || '') && o.indexOf(t.id) < 0) o.push(t.id); }); };
    add(/^cb_/); add(/^p_/); add(/^cc_/); return o;
  }
  function rellenoVisual(pg, C, f2) {
    var quita = 0, orden1 = 0, its = f2.its.filter(function (x) {
      var e = String(x && x.e || '').replace(/<[^>]+>/g, '');
      var gen = GENERICO.test(e), ord = /^Ordena los pasos de/.test(e) && orden1++ > 0;
      if (gen || ord) { quita += x.tipo === 'abierta' || /^Dibuja/.test(e) ? 26 : 19; return false; }
      return true;
    });
    if (!quita) return null;
    var h = Math.floor(quita * 0.85) - 9; if (h < 16) return Object.assign({}, f2, { its: its });   /* poco hueco: se quita lo genérico y queda un margen pequeño */
    var tecs = h >= 48 ? tecsDe(pg.u) : [], r = tecs.length ? escenaDe(pg, C, 'relleno', tecs, pg.num || 0, 0) : null;
    if (!r) { var bq = bloqueClase(pg, C, h); return bq ? Object.assign({}, f2, { its: its, fig: bq.html, figH: bq.alto, figT: bq.t }) : h < 30 ? Object.assign({}, f2, { its: its }) : null; }
    var T = C.T, fig = '<div data-escena="' + es(r.e.tipo) + '" style="height:100%;width:100%;display:flex;flex-direction:column;align-items:center">' +
      '<img src="' + r.src + '" alt="' + es(r.e.t) + '" style="flex:1 1 auto;min-height:0;max-width:100%;object-fit:contain;display:block;border-radius:' + Math.min(T.r || 4, 6) + 'px">' +
      '<div style="flex:none;max-width:170mm;font-size:.85em;line-height:1.35;margin-top:1.5mm"><b style="color:' + T.acc + '">' + es(r.e.t) + '.</b> ' + es(r.e.texto || '') + '</div></div>';
    return Object.assign({}, f2, { its: its, fig: fig, figH: Math.min(h, 120), figT: /^cb_lam_/.test(r.e.tipo || '') ? 'Lámina en el maniquí' : 'En el maniquí' });
  }
  /* (19-10-2026, Fátima: «esa tarjeta no debe salir más») El bloque «Observa» del relleno (b6_relleno_total) guarda su figura
     ya dibujada al armar el libro, fuera del pintado: ahí la tarjeta plana de Estudios se colaba con su «Por qué funciona».
     Se cambia por la escena del maniquí de esa misma técnica, con su título y su explicación. */
  function observaEst(pg, C, f2) {
    var m = /data-modelo="(pe_est_(?!mio)[^"]+)"/.exec(String(f2.fig)); if (!m || /data-escena=/.test(f2.fig)) return null;
    var r = escena(pg, C, m[1]); if (!r) return null;
    var T = C.T, fig = '<div data-escena="' + es(r.e.tipo) + '" style="height:100%;width:100%;display:flex;flex-direction:column;align-items:center">' +
      '<img src="' + r.src + '" alt="' + es(r.e.t) + '" style="flex:1 1 auto;min-height:0;max-width:100%;object-fit:contain;display:block;border-radius:' + Math.min(T.r || 4, 6) + 'px">' +
      '<div style="flex:none;max-width:170mm;font-size:.85em;line-height:1.35;margin-top:1.5mm"><b style="color:' + T.acc + '">' + es(r.e.t) + '.</b> ' + es(r.e.texto || '') + '</div></div>';
    var its = (f2.its || []).filter(function (x) { return !GENERICO.test(String(x && x.e || '').replace(/<[^>]+>/g, '')); });
    return Object.assign({}, f2, { its: its, fig: fig, figT: /^cb_lam_/.test(r.e.tipo || '') ? 'Lámina en el maniquí' : 'En el maniquí' });
  }
  /* sin escena libre o con poco sitio: puntos de las clases de colorimetría de Fátima de esa unidad (su texto tal cual,
     de b6_color_cerebro_1-3), cada punto una sola vez en el libro */
  var ETQ = { alerta: 'Por qué no', importante: 'Importante', tip: 'Consejo profesional' };
  function bloqueClase(pg, C, h) {
    var CC = window.EU_COLOR_CEREBRO; if (!CC || !CC.clases || !pg.u) return null;
    var R = REG.get(C); if (!R) { R = { pg: new WeakMap(), usadas: {} }; REG.set(C, R); }
    R.bloques = R.bloques || {}; var porPg = R.pg.get(pg) || {}; if (porPg.bloque !== undefined) return porPg.bloque;
    var out = null;
    CC.clases.some(function (c) {
      if (c.u !== pg.u.id || !(c.b || []).length) return false;
      var alto = 8, items = [];
      c.b.forEach(function (b, j) {
        var k = c.id + '|' + j, tx = String(b[1] || ''); if (R.bloques[k] || !tx) return;
        var a = 2 + Math.ceil((tx.length + 22) / 82) * 5.2; if (alto + a > h) return;
        alto += a; items.push(b); R.bloques[k] = 1;
      });
      if (!items.length) return false;
      var T = C.T;
      out = { t: c.n, alto: Math.ceil(alto), html: '<div style="width:100%;font-size:.9em;line-height:1.42">' + items.map(function (b) {
        return '<div style="margin:0 0 1.6mm">' + (ETQ[b[0]] ? '<b style="color:' + (b[0] === 'alerta' ? '#9A3B2E' : T.acc) + '">' + ETQ[b[0]] + ':</b> ' : '· ') + es(b[1]) + '</div>';
      }).join('') + '</div>' };
      return true;
    });
    porPg.bloque = out; R.pg.set(pg, porPg); return out;
  }
  /* hoja con la escena grande, su título y su explicación (también la usa la mitad de abajo de pe_foto) */
  function hoja(pg, C, arriba) {
    var H = window.EU_EDITORIAL.H, T = C.T, r = escena(pg, C, pg.mod), md = window.EU_MODELOS && pg.mod && EU_MODELOS.modelo(pg.mod);
    if (!r) return H.cabecera(C, pg) + H.h1(C, H.esc(pg.u.t)) + H.folio(C, pg);
    var lam = /^cb_lam_/.test(r.e.tipo || '');
    return H.cabecera(C, pg) + '<div style="font-size:.74em;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:' + T.acc + ';margin:0 0 2mm">' + (arriba ? 'Foto de referencia y maniquí' : lam ? 'Lámina en el maniquí' : 'En el maniquí') + '</div>' +
      H.h1(C, H.esc(pg.u.t)) + (arriba || '') +
      '<div style="height:' + (arriba ? 78 : 105) + 'mm;display:flex;justify-content:center;align-items:center;margin-top:' + (arriba ? 4 : 0) + 'mm"><img src="' + r.src + '" alt="' + es(r.e.t) + '" style="height:100%;width:auto;max-width:100%;display:block;border-radius:' + Math.min(T.r || 4, 6) + 'px"></div>' +
      '<div style="font-family:' + T.tit + ';font-weight:700;color:' + T.acc + ';margin:2.5mm 0 1mm">' + es(r.e.t) + '</div>' +
      '<p style="max-width:170mm;margin:0">' + es(r.e.texto || '') + '</p>' +
      /* sin foto: también el repaso de la ficha de antes (sus preguntas y «Por qué funciona») */
      (!arriba && md ? (md.q || []).map(function (q, i) { return '<div style="margin:2.5mm 0 0;font-size:.92em"><b style="color:' + T.acc + '">' + (i + 1) + '.</b> ' + es(q[0]) + '<div style="font-size:.9em;opacity:.8;margin-top:.8mm">' + es(q[1]) + '</div></div>'; }).join('') +
        (md.porque ? '<p style="font-size:.9em;margin-top:3mm"><b>Por qué funciona:</b> ' + es(md.porque) + '</p>' : '') : '') + H.folio(C, pg);
  }
  /* pe_foto (b6_pelu_fotos_libro.js): la foto arriba se queda; abajo, la escena con su explicación en vez de la tarjeta */
  function fotoPagina() {
    var ED = window.EU_EDITORIAL, FL = window.EU_PELU_FOTOS_LIBRO; if (!ED || !FL || !ED.registrar || ED.__lamFoto) return !!ED.__lamFoto;
    ED.__lamFoto = 1;
    ED.registrar({ paginas: { pe_foto: function (pg, C) {
      var H = ED.H, T = C.T, MO = window.EU_MODELOS;
      var fot = MO.svg(pg._foto).replace('style="width:100%;height:auto;display:block"', 'style="height:100%;width:auto;max-width:100%;display:block"');
      var arriba = '<div style="height:98mm;display:flex;justify-content:center;align-items:center">' + fot + '</div><div style="font-size:.78em;font-weight:700;color:' + T.acc + ';text-align:center;margin-top:1.5mm">Foto de referencia</div>';
      if (escena(pg, C, pg.mod)) return hoja(pg, C, arriba);
      return H.cabecera(C, pg) + '<div style="font-size:.74em;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:' + T.acc + ';margin:0 0 2mm">Foto de referencia</div>' +
        H.h1(C, H.esc(pg.u.t)) + '<div style="height:185mm;display:flex;justify-content:center;align-items:center">' + fot + '</div>' + H.folio(C, pg);
    } } });
    return true;
  }
  (function espera(n) { var a = enganchar(), b = a && fotoPagina(); if (!(a && b) && n < 200) setTimeout(function () { espera(n + 1); }, 300); })(0);

  /* (19-10-2026, Fátima: «en el libro se tiene que ver el maniquí haciendo el procedimiento, sincronizado con el tema»)
     En las unidades de corte (pe_u_c_*) y de técnica (cb_*), las páginas de texto genérico del motor general («Cerca de ti»:
     «Fulano vive en… busca un ejemplo en tu barrio»; lecturas con «Encuesta de la clase» de votos inventados, «Investiga»,
     «Un ejemplo cercano») pasan a ser «En el salón»: un corte de la unidad (o la técnica) en el maniquí, con su descripción,
     sus elevaciones de la ficha técnica, la escena con su título y su explicación, y una pregunta del repaso de la unidad.
     No añade hojas; las soluciones de las páginas sustituidas salen del solucionario. */
  var GEN_PG = /^(ejemplo|lec_concepto|lec_lectura|lec_caso|lec_amplia|lec_proyecto)$/;
  var PREF_CORTE = ['angulos', 'coronilla', 'emparejar', 'particion', 'seccion', 'guia', 'pulir', 'queda_frente', 'queda_lateral', 'queda_nuca', 'capas', 'lateral', 'frente'];
  var ZN = ['nuca', 'nuca alta', 'occipital', 'parietal', 'lateral', 'coronilla', 'flequillo'];
  function salonCambiar(res, cfg) {
    if (!res || !res.pages || !cfg || cfg.materia !== 'pelu' || ((cfg.acab || {}).laminasLibro === 'no')) return res;
    var quit = {}, k = {};
    res.pages.forEach(function (p, i) {
      if (!p.u || !GEN_PG.test(p.tipo) || !(/^(pe_u_c_|cb_)/.test(p.u.id) || (p.tipo === 'ejemplo' && /^pe_u_/.test(p.u.id)))) return;   /* 19-10-2026: «Cerca de ti» inventado («Daniela vive en…») también fuera de cortes y técnicas */
      k[p.u.id] = (k[p.u.id] || 0);
      res.pages[i] = { tipo: 'pe_salon', u: p.u, n: p.n, num: p.num, ks: k[p.u.id]++, fill2: { nada: 1 }, indice: p.indice };
      quit[p.num] = 1;
    });
    res.pages.forEach(function (p) { if (p.tipo === 'solucion' && p.entradas) p.entradas = p.entradas.filter(function (e) { return !quit[e.p]; }); });
    return res;
  }
  /* escena de un corte de la unidad que aún no haya salido en estas páginas */
  function escCorte(pg, C) {
    var CO = window.EU_CORTES, DGL = window.EU_PELU_LIBRO_DG, DG = window.EU_DIAGRAMA; if (!CO || !DGL || !DG || !DGL.datos) return null;
    var R = REG.get(C); if (!R) { R = { pg: new WeakMap(), usadas: {} }; REG.set(C, R); }
    var porPg = R.pg.get(pg) || {}; if (porPg.salon !== undefined) return porPg.salon;
    var L = CO.lista(pg.u.id.slice(7)), r = null;
    for (var v = 0; v < L.length && !r; v++) {
      var c = L[(pg.ks + v) % L.length], dg = { k: 'corte', corte: c.id }, d = DGL.datos(dg); if (!d || !d.E) continue;
      var vis = {}; (d.vis || []).forEach(function (e) { vis[e.tipo] = 1; });
      for (var j = 0; j < PREF_CORTE.length && !r; j++) {
        var e = d.E.escenas.filter(function (x) { return x.tipo === PREF_CORTE[j]; })[0];
        if (!e || vis[e.tipo] || R.usadas['dg|' + c.id + '|' + e.tipo]) continue;
        var src = ''; try { src = DG.foto(e, 640, 0.8); } catch (er) { src = ''; }
        if (src) { R.usadas['dg|' + c.id + '|' + e.tipo] = 1; r = { c: c, e: e, src: src }; }
      }
    }
    porPg.salon = r; R.pg.set(pg, porPg); return r;
  }
  function salon(pg, C) {
    var H = window.EU_EDITORIAL.H, T = C.T, u = pg.u, corte = /^pe_u_c_/.test(u.id), r = null, t = '', intro = '', ficha = '';
    if (corte) {
      r = escCorte(pg, C);
      if (r) {
        var Tc = (window.EU_CORTES.tecnica(r.c.id) || {}), ev = Tc.elev || [];
        t = r.c.n; intro = r.c.d || '';
        if (ev.length) ficha = ev.map(function (g, z) { return '<span style="display:inline-block;margin:0 1mm 1mm 0;padding:.4mm 2mm;border-radius:99px;background:' + T.soft + ';white-space:nowrap"><b style="color:' + T.acc + '">' + (z + 1) + ' · ' + ZN[z] + '</b> ' + g + '°</span>'; }).join('') +
          '<div style="font-size:.88em;margin-top:.5mm">' + es([Tc.part ? 'Partición ' + String(Tc.part).toLowerCase() : '', Tc.her ? Tc.her : '', Tc.tipo ? 'corte ' + String(Tc.tipo).toLowerCase() : '', Tc.acabado ? 'acabado ' + String(Tc.acabado).toLowerCase() : ''].filter(Boolean).join(' · ')) + '</div>';
        r = { e: r.e, src: r.src };
      }
    } else {
      var x = escenaDe(pg, C, 'salon', tecsDe(u), pg.ks || 0, 1);
      if (x) { r = x; t = u.t; intro = (u.i || [])[(pg.ks || 0) % Math.max(1, (u.i || []).length)] || ''; }
    }
    var rep = u.rep || [], q = null;
    if (rep.length) { q = (corte && t ? rep.filter(function (y) { return String(y.p).indexOf(t) >= 0; })[0] : null) || rep[(pg.ks || 0) % rep.length]; }
    var cab = '<div style="font-size:.74em;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:' + T.acc + ';margin:0 0 2mm">' + (r ? 'En el salón · el maniquí paso a paso' : 'En el salón') + '</div>';
    var cuerpo = H.h1(C, H.esc(t || u.t)) + (intro ? '<p style="margin:0 0 2mm">' + es(intro) + '</p>' : '') + (ficha ? '<div style="margin:0 0 2.5mm">' + ficha + '</div>' : '');
    if (r) cuerpo += '<div style="height:' + (ficha ? 112 : 122) + 'mm;display:flex;justify-content:center;align-items:center"><img src="' + r.src + '" alt="' + es(r.e.t) + '" style="height:100%;width:auto;max-width:100%;object-fit:contain;display:block;border-radius:' + Math.min(T.r || 4, 6) + 'px"></div>' +
      '<div style="font-family:' + T.tit + ';font-weight:700;color:' + T.acc + ';margin:2.5mm 0 1mm">' + es(r.e.t) + '</div><p style="max-width:170mm;margin:0">' + es(r.e.texto || '') + '</p>';
    else cuerpo += (u.i || []).map(function (s) { return '<p style="margin:0 0 2mm">' + es(s) + '</p>'; }).join('');
    if (q) cuerpo += '<div style="margin:3mm 0 0;font-size:.92em"><b style="color:' + T.acc + '">Compruébalo.</b> ' + es(q.p) +
      '<div style="margin-top:1mm">' + (q.o || []).map(function (o, i) { return '<span style="display:inline-block;margin:0 2mm 1mm 0;padding:.4mm 2.5mm;border:0.3mm solid ' + T.soft + ';border-radius:4px">' + 'abc'.charAt(i) + ') ' + es(o) + '</span>'; }).join('') + '</div>' +
      '<div style="font-size:.85em;opacity:.75;margin-top:1mm">Respuesta: ' + es((q.o || [])[q.c] || '') + (q.x ? ' · ' + es(q.x) : '') + '</div></div>';
    return H.cabecera(C, pg) + cab + cuerpo + H.folio(C, pg);
  }
  (function engancharSalon(n) {
    var ED = window.EU_EDITORIAL;
    if (!ED || !ED.registrar || !(ED.__enc || n > 80)) return setTimeout(function () { engancharSalon(n + 1); }, 300);
    if (ED.__peluSalon) return; ED.__peluSalon = 1;
    ED.registrar({ paginas: { pe_salon: salon } });
    var ens = ED.ensamblar;
    ED.ensamblar = function (cfg) { var r = ens.apply(this, arguments); try { salonCambiar(r, cfg); } catch (e) { console.warn('pelu · en el salón', e); } return r; };
  })(0);

  /* escenas de una técnica que ya usó este libro (la página pe_tecnica no las repite) */
  function usadas(C, tec) { var R = REG.get(C), o = {}; if (R) Object.keys(R.usadas).forEach(function (k) { var a = k.split('|'); if (a[0] === tec) o[a[1]] = 1; }); return o; }
  window.EU_PELU_LAMINAS_LIBRO = { escena: escena, hoja: hoja, usadas: usadas };
})();
