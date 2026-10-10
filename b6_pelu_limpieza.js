/* b6_pelu_limpieza.js — limpieza de la biblioteca de Peluquería (materia `pelu`).
   · Quita 11 modelos: 8 que no son de peluquería (manicura, uña, tipos de piel, depilación con cera, cejas,
     limpieza facial, maquillaje, pinzas de depilar) y 3 duplicados (pe_elevacion → serie pe_elev_*,
     pe_caspa → pe_cuero, pe_degradado → pe_fade_niveles). Se filtran de EU_MODELOS.lista/modelo y su
     generador en EU_SVG deja de dar figura.
   · Conecta las 27 láminas de divisiones de la cabeza (EU_DIVISIONES) como familia 'div' (pe_div_<lámina>).
   Cargar después de b6_pelu_fichas.js y antes de b6_pelu_orden.js. */
(function () {
  'use strict';
  var MO = window.EU_MODELOS; if (!MO || window.EU_PELU_LIMPIEZA) return;
  var FUERA = ['pe_manicura', 'pe_uña', 'pe_piel_tipos', 'pe_depilacion_cera', 'pe_cejas', 'pe_limpieza_facial', 'pe_maquillaje',
    'pe_pinzas_depilar', 'pe_elevacion', 'pe_caspa', 'pe_degradado'];
  var NO = {}; FUERA.forEach(function (id) { NO[id] = 1; });

  var lista0 = MO.lista, modelo0 = MO.modelo;
  MO.lista = function (mat, fam) { return lista0.call(MO, mat, fam).filter(function (m) { return !NO[m.id]; }); };
  var fam0 = MO.familias;
  MO.familias = function (mat) { return fam0.call(MO, mat).map(function (f) { f.total = MO.lista(mat, f.id).length; return f; }).filter(function (f) { return f.total; }); };
  MO.modelo = function (id) { return NO[id] ? undefined : modelo0.call(MO, id); };
  if (window.EU_SVG && window.EU_SVG.visual) FUERA.forEach(function (id) { window.EU_SVG.visual(id, function () { return null; }, { materias: /^$/ }); });

  /* divisiones: EU_DIVISIONES (lienzo) → imagen dentro del lienzo 200×150 del modelo */
  var CACHE = {};
  function raster(id) {
    if (CACHE[id]) return CACHE[id];
    var DV = window.EU_DIVISIONES; if (!DV || typeof document === 'undefined') return '';
    var W = 800, H = 600, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    /* Balayage (Fátima, 10-10-2026): más pequeña y más arriba para que la escala 25 / 50 / 75 % y el arranque quepan en la imagen */
    var bal = id === 'plantaBalayage';
    try { DV.dibujarUna(cv.getContext('2d'), id, W * .5, bal ? 197 : H * .47, bal ? 165 : 190, 1, {}); } catch (e) { return ''; }
    return (CACHE[id] = cv.toDataURL('image/png'));
  }
  var VISTA = {
    perfil: 'De perfil: la cabeza mirando de lado.',
    planta: 'En planta: la cabeza vista desde arriba.',
    nuca: 'Desde la nuca: la cabeza vista por detrás.',
    gorro: 'Desde la nuca: la cabeza vista por detrás.'
  };
  function divDe(l) {
    var vista = (l.id.match(/^(perfil|planta|nuca|gorro)/) || ['', 'perfil'])[1];
    return {
      id: 'pe_div_' + l.id, fam: 'div', n: 'Divisiones · ' + String(l.n).replace(/^(Perfil|Planta|Nuca) · /, ''),
      d: function (K) {
        var src = raster(l.id); if (!src) return K.t(100, 75, l.n, { s: 8, b: 1 });
        var f = K.linea ? ' filter="url(#peDivGris)"' : '';
        return (K.linea ? '<filter id="peDivGris"><feColorMatrix type="saturate" values="0"/></filter>' : '') + K.r(4, 4, 192, 142, 6, '#FBF8F2') +
          '<image href="' + src + '" x="4" y="4" width="192" height="144"' + f + ' preserveAspectRatio="xMidYMid meet"/>';
      },
      intro: l.d,
      q: [['¿Desde qué vista se ve esta división?', VISTA[vista]],
        ['¿Para qué sirve dividir antes de trabajar?', 'Para controlar cada sección por separado y que el producto o el corte quede igual en toda la cabeza.'],
        ['¿Qué se comprueba al terminar las divisiones?', 'Que las rayas estén limpias y simétricas, y que cada sección tenga el mismo grosor.']],
      porque: 'Una división limpia hace que cada mecha reciba lo mismo: el resultado es parejo y se puede repetir.'
    };
  }
  var n = 0;
  if (window.EU_DIVISIONES && window.EU_DIVISIONES.catalogo) {
    var L = window.EU_DIVISIONES.catalogo().map(divDe); n = L.length;
    MO.agregar('pelu', L, { familias: { div: 'Divisiones de la cabeza' } });
  }
  window.EU_PELU_LIMPIEZA = { fuera: FUERA.slice(), divisiones: n };
})();
