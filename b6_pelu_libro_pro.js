/* b6_pelu_libro_pro.js — Peluquería · producto «Libro profesional» (window.EU_PELU_LIBRO_PRO)
   (25-11-2026, Fátima: «en un libro de 850 hojas salen 56 páginas vacías y 846 frases repetidas; sustitúyelo por lo que ya
   tiene el sistema, sin inventar»). El libro profesional rellena hasta las hojas pedidas con «Notas» en blanco y con los mismos
   cuatro diagramas de la unidad una y otra vez. Los módulos de Peluquería ya ocupan esas hojas con sus técnicas, clases y
   cortes (b6_pelu_libro_animado.js, b6_pelu_libro_diagrama.js); las que quedan sin contenido propio se quitan: el libro
   lleva solo contenido real y puede salir con menos hojas que las pedidas. Solo `pelu` y `libro_pro`.
   `cfg.acab.proRelleno = 'si'` deja el relleno como antes. Se engancha el último a `ED.ensamblar`. */
(function () {
  'use strict';
  function limpiar(res, cfg) {
    var C = res && res.C;
    if (!C || !res.pages || !cfg || cfg.materia !== 'pelu' || ((C.prod && C.prod.id) || cfg.prod) !== 'libro_pro' || ((cfg.acab || {}).proRelleno) === 'si') return res;
    var antes = res.pages.length, nueva = {};
    res.pages = res.pages.filter(function (p) { return !(p.relleno && /^pro_(notas|diagrama)$/.test(p.tipo)); });
    if (res.pages.length === antes) return res;
    res.pages.forEach(function (p, i) { if (p.num != null) nueva[p.num] = i + 1; });
    res.pages.forEach(function (p, i) { p.num = i + 1; });
    res.pages.forEach(function (p) { if (p.tipo === 'solucion' && p.entradas) p.entradas.forEach(function (e) { if (nueva[e.p]) e.p = nueva[e.p]; }); });
    res.proSinRelleno = antes - res.pages.length;
    return res;
  }
  function enganchar() {
    var ED = window.EU_EDITORIAL; if (ED.__peluLibroPro) return; ED.__peluLibroPro = 1;
    var ens = ED.ensamblar;
    ED.ensamblar = function (cfg) { var r = ens.apply(this, arguments); try { limpiar(r, cfg); } catch (e) { console.warn('pelu · libro profesional', e); } return r; };
  }
  /* después de los módulos que ocupan esas hojas */
  function esperar(n) {
    var ED = window.EU_EDITORIAL;
    if (ED && ED.ensamblar && ((ED.__escaner && ED.__peluLibroAnim && ED.__peluLibroDg && ED.__peluSalon && ED.__peluReceta) || n > 120)) enganchar();
    else setTimeout(function () { esperar(n + 1); }, 300);
  }
  if (document.readyState === 'complete') setTimeout(function () { esperar(0); }, 500); else window.addEventListener('load', function () { setTimeout(function () { esperar(0); }, 500); });
  window.EU_PELU_LIBRO_PRO = { limpiar: limpiar };
})();
