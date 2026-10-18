/* b6_pelu_fotos_libro.js — fotos de Fátima en el libro de Peluquería (`window.EU_PELU_FOTOS_LIBRO`, 17-10-2026).
   Fátima: «sustituye los dibujos genéricos sin eliminar nada, cada imagen en su categoría». Su foto ocupa el hueco
   del dibujo de la portada de su unidad (Retoque de raíz, Secado con cepillo, Planchado), entera, sin recortar
   (preserveAspectRatio meet). El dibujo que había sigue en la biblioteca. Sin la foto (no se pudo leer) no se cambia nada. No añade hojas ni cambia textos.
   No entra en el reparto automático de dibujos: se pinta envolviendo EU_MODELOS.svg solo para sus ids, y se pone
   con el gancho `pre` del motor al pintar la página (el dibujo que había vuelve a su sitio después).
   Solo materia `pelu`. Cargar al final de la lista diferida. `cfg.acab.fotosLibro='no'` lo apaga. */
(function () {
  'use strict';
  if (window.EU_PELU_FOTOS_LIBRO) return;
  /* [archivo en referencias/curso, id, unidad, tipo de página] */
  var FOTOS = [
    ['tinte_correccion.jpg', 'pe_foto_tinte_correccion', 'cb_color_raiz', 'apertura'],
    ['secado.jpg', 'pe_foto_secado', 'cb_cab_secado', 'apertura'],
    ['planchado.jpg', 'pe_foto_planchado', 'cb_cab_planchado', 'apertura'],
    ['mechas_aluminio.jpg', 'pe_foto_mechas_aluminio', 'cb_mechas_aluminio', 'apertura'],
    ['mechas_gorro.jpg', 'pe_foto_mechas_gorro', 'cb_mechas_gorro', 'apertura'],
    ['balayage_90.jpg', 'pe_foto_balayage', 'cb_color_balayage', 'apertura']
  ];
  /* (18-10-2026, Fátima: «todas las técnicas») las páginas «Diagrama» con el fotograma del maniquí de Estudios
     (pe_corte con dibujo pe_est_*) pasan a ser su foto de esa técnica, a página completa. Cada foto una vez por unidad,
     primero las que no están en la portada; si la unidad no tiene más fotos, la ficha se queda como estaba.
     [archivo en referencias/curso, id, unidades] */
  var FICHAS = [
    ['colorimetria.jpg', 'pe_foto_colorimetria', /^cb_color_global$/],
    ['tinte_correccion.jpg', 'pe_foto_tinte_correccion', /^cb_color_(raiz|global)$/],
    ['secado.jpg', 'pe_foto_secado', /^cb_cab_secado$/],
    ['planchado.jpg', 'pe_foto_planchado', /^cb_cab_planchado$|^cb_quera_alisado$/],
    ['mechas_aluminio.jpg', 'pe_foto_mechas_aluminio', /^cb_mechas_aluminio$/],
    ['mechas_aluminio_2.jpg', 'pe_foto_mechas_aluminio_2', /^cb_mechas_aluminio$/],
    ['mechas_aluminio_3.jpg', 'pe_foto_mechas_aluminio_3', /^cb_mechas_aluminio$/],
    ['mechas_guia.jpg', 'pe_foto_mechas_guia', /^cb_mechas_aluminio$/],
    ['mechas_aluminio_4.jpg', 'pe_foto_mechas_aluminio_4', /^cb_mechas_aluminio$/],
    ['mechas_aluminio_5.jpg', 'pe_foto_mechas_aluminio_5', /^cb_mechas_aluminio$/],
    ['mechas_gorro.jpg', 'pe_foto_mechas_gorro', /^cb_mechas_gorro$/],
    ['mechas_gorro_2.jpg', 'pe_foto_mechas_gorro_2', /^cb_mechas_gorro$/],
    ['balayage_90.jpg', 'pe_foto_balayage', /^cb_color_balayage$/],
    ['balayage_guia.jpg', 'pe_foto_balayage_guia', /^cb_color_balayage$/],
    ['balayage_antes_despues.jpg', 'pe_foto_balayage_antes_despues', /^cb_color_balayage$/],
    ['color_balayage.jpg', 'pe_foto_color_balayage', /^cb_color_balayage$|^cb_color_babylights$|^cb_mechas_/],
    ['quimicos.jpg', 'pe_foto_quimicos', /^cb_quim_|^cb_quera_/]
  ];
  var DATA = {};
  FOTOS.concat(FICHAS.filter(function (f) { return !FOTOS.some(function (x) { return x[1] === f[1]; }); })).forEach(function (f) {
    try {
      fetch('./referencias/curso/' + f[0]).then(function (r) { return r.ok ? r.blob() : null; }).then(function (b) {
        if (!b) return; var fr = new FileReader(); fr.onload = function () { DATA[f[1]] = fr.result; }; fr.readAsDataURL(b);
      }).catch(function () { });
    } catch (e) { }
  });

  function svg(id) {
    return '<svg xmlns="http://www.w3.org/2000/svg" data-plano="1" data-foto="' + id + '" viewBox="0 0 200 150" style="width:100%;height:auto;display:block">' +
      '<image href="' + DATA[id] + '" x="0" y="0" width="200" height="150" preserveAspectRatio="xMidYMid meet"/></svg>';
  }
  function enganchar() {
    var MO = window.EU_MODELOS, ED = window.EU_EDITORIAL;
    if (!MO || !MO.svg || !ED || !ED.registrar) return false;
    if (!MO.svg._fotosLibro) {
      var sv = MO.svg;
      MO.svg = function (id) { return DATA[id] && /^pe_foto_/.test(id) ? svg(id) : sv.apply(this, arguments); };
      MO.svg._fotosLibro = 1;
    }
    if (!ED.__fotosLibro) {
      ED.__fotosLibro = 1;
      /* gancho `pre` del motor: justo antes de pintar la portada de su unidad pone la foto (y lo deshace después),
         así ningún módulo que se enganche más tarde a `ensamblar` la vuelve a cambiar */
      ED.registrar({
        pre: function (pg, C) {
          var cfg = C && C.cfg, acab = (cfg && cfg.acab) || {};
          if (!cfg || cfg.materia !== 'pelu' || acab.fotosLibro === 'no' || !pg || pg.mini || !pg.u) return;
          if (pg.tipo === 'pe_corte' && /^pe_est_/.test(pg.mod || '')) return ficha(pg, C);
          var f = FOTOS.filter(function (x) { return x[2] === pg.u.id && x[3] === pg.tipo && DATA[x[1]]; })[0];
          if (!f || pg.portMod === f[1]) return;
          var antes = pg.portMod; pg.portMod = f[1];
          return function () { pg.portMod = antes; };
        },
        paginas: { pe_foto: function (pg, C) {
          var H = ED.H, T = C.T, u = pg.u, MO = window.EU_MODELOS, md = MO && pg.mod && MO.modelo(pg.mod), man = '';
          /* (18-10-2026, Fátima: «fotos y maniquí sincronizados») el fotograma del maniquí se queda AL LADO de la foto, no se quita */
          if (md) { try { man = MO.svg(md.id, ((C.cfg && C.cfg.acab) || {}).dibujo === '2d' ? 'color' : '3d', { rot: true }); } catch (e) { man = ''; } }
          var fot = svg(pg._foto).replace('style="width:100%;height:auto;display:block"', 'style="height:100%;width:auto;max-width:100%;display:block"');
          var pie = function (t) { return '<div style="font-size:.78em;font-weight:700;color:' + T.acc + ';text-align:center;margin-top:1.5mm">' + t + '</div>'; };
          if (!man) return H.cabecera(C, pg) + '<div style="font-size:.74em;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:' + T.acc + ';margin:0 0 2mm">Foto de referencia</div>' +
            H.h1(C, H.esc(u.t)) + '<div style="height:185mm;display:flex;justify-content:center;align-items:center">' + fot + '</div>' + H.folio(C, pg);
          return H.cabecera(C, pg) + '<div style="font-size:.74em;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:' + T.acc + ';margin:0 0 2mm">Foto de referencia y maniquí</div>' +
            H.h1(C, H.esc(u.t)) +
            '<div style="height:98mm;display:flex;justify-content:center;align-items:center">' + fot + '</div>' + pie('Foto real · Fátima') +
            '<div style="height:88mm;display:flex;justify-content:center;align-items:center;margin-top:4mm">' + man.replace('<svg', '<svg style="height:100%;width:auto;max-width:100%"') + '</div>' + pie('En el maniquí · ' + H.esc(md.n)) +
            (md.intro ? '<p style="max-width:170mm;margin:4mm 0 0">' + H.esc(md.intro) + '</p>' : '') + H.folio(C, pg);
        } }
      });
    }
    return true;
  }
  /* foto de la unidad para una ficha del maniquí: la misma en cada pintado de la página, sin repetir dentro de la unidad */
  var REP = new WeakMap();
  function ficha(pg, C) {
    var R = REP.get(C); if (!R) { R = { pg: new WeakMap(), uni: {} }; REP.set(C, R); }
    var id = R.pg.get(pg);
    if (id === undefined) {
      var us = R.uni[pg.u.id] = R.uni[pg.u.id] || {}, port = FOTOS.filter(function (x) { return x[2] === pg.u.id; }).map(function (x) { return x[1]; });
      var lista = FICHAS.filter(function (f) { return f[2].test(pg.u.id) && DATA[f[1]] && !us[f[1]]; }).map(function (f) { return f[1]; });
      lista.sort(function (a, b) { return (port.indexOf(a) >= 0) - (port.indexOf(b) >= 0); });
      id = lista[0] || null; if (id) us[id] = 1; R.pg.set(pg, id);
    }
    if (!id) return;
    pg.tipo = 'pe_foto'; pg._foto = id;   /* pg.mod (fotograma del maniquí) se conserva y se pinta al lado */
    return function () { pg.tipo = 'pe_corte'; delete pg._foto; };
  }

  if (!enganchar()) (function espera(n) { if (!enganchar() && n < 200) setTimeout(function () { espera(n + 1); }, 300); })(0);

  window.EU_PELU_FOTOS_LIBRO = { FOTOS: FOTOS, FICHAS: FICHAS, listas: function () { return Object.keys(DATA); } };
})();
