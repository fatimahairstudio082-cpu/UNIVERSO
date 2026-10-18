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
  function escena(pg, C, id) {
    var LA = window.EU_PELU_LIBRO_ANIM, x = tecDe(id); if (!LA || !LA.datos || !LA.foto || !x) return null;
    var R = REG.get(C); if (!R) { R = { pg: new WeakMap(), usadas: {} }; REG.set(C, R); }
    var porPg = R.pg.get(pg) || {}; if (porPg[id] !== undefined) return porPg[id];
    var d = LA.datos(x.tec), NOI = LA.NO_IMPRESO || /^cb_receta$|_preparacion$|_cierre$/, r = null;
    if (d) {
      var cand = []; d.E.escenas.forEach(function (e, k) { if (d.sel.indexOf(k) < 0 && !NOI.test(e.tipo || '')) cand.push(k); });
      cand.sort(function (a, b) { return orden(d.E.escenas[a]) - orden(d.E.escenas[b]) || a - b; });
      var k0 = cand.filter(function (k) { return !R.usadas[x.tec + '|' + k]; })[0];
      if (k0 == null) k0 = cand[x.k % Math.max(1, cand.length)];
      if (k0 != null) { var src = LA.foto(x.tec, k0, 640, null); if (src) { R.usadas[x.tec + '|' + k0] = 1; r = { e: d.E.escenas[k0], src: src }; } }
    }
    porPg[id] = r; R.pg.set(pg, porPg); return r;
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
        if (cambio || pg.tipo === 'pe_foto') { pg.fill2 = { nada: 1 }; delete pg.llena; }
        return function () { CUR = antes; if (cambio) pg.tipo = 'pe_corte'; if (cambio || pg.tipo === 'pe_foto') { pg.fill2 = f2; if (ll !== undefined) pg.llena = ll; } };
      },
      paginas: { pe_escena: function (pg, C) { return hoja(pg, C, null); } }
    });
    return true;
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
      var arriba = '<div style="height:98mm;display:flex;justify-content:center;align-items:center">' + fot + '</div><div style="font-size:.78em;font-weight:700;color:' + T.acc + ';text-align:center;margin-top:1.5mm">Foto real · Fátima</div>';
      if (escena(pg, C, pg.mod)) return hoja(pg, C, arriba);
      return H.cabecera(C, pg) + '<div style="font-size:.74em;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:' + T.acc + ';margin:0 0 2mm">Foto de referencia</div>' +
        H.h1(C, H.esc(pg.u.t)) + '<div style="height:185mm;display:flex;justify-content:center;align-items:center">' + fot + '</div>' + H.folio(C, pg);
    } } });
    return true;
  }
  (function espera(n) { var a = enganchar(), b = a && fotoPagina(); if (!(a && b) && n < 200) setTimeout(function () { espera(n + 1); }, 300); })(0);

  /* escenas de una técnica que ya usó este libro (la página pe_tecnica no las repite) */
  function usadas(C, tec) { var R = REG.get(C), o = {}; if (R) Object.keys(R.usadas).forEach(function (k) { var a = k.split('|'); if (a[0] === tec) o[a[1]] = 1; }); return o; }
  window.EU_PELU_LAMINAS_LIBRO = { escena: escena, hoja: hoja, usadas: usadas };
})();
