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
  var DATA = {};
  FOTOS.forEach(function (f) {
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
          var f = FOTOS.filter(function (x) { return x[2] === pg.u.id && x[3] === pg.tipo && DATA[x[1]]; })[0];
          if (!f || pg.portMod === f[1]) return;
          var antes = pg.portMod; pg.portMod = f[1];
          return function () { pg.portMod = antes; };
        }
      });
    }
    return true;
  }
  if (!enganchar()) (function espera(n) { if (!enganchar() && n < 200) setTimeout(function () { espera(n + 1); }, 300); })(0);

  window.EU_PELU_FOTOS_LIBRO = { FOTOS: FOTOS, listas: function () { return Object.keys(DATA); } };
})();
