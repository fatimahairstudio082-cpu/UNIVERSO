/* b6_pelu_fotos.js — fotos de Fátima en el curso premium de Peluquería (`window.EU_PELU_FOTOS`, 15-10-2026).
   Fátima: «humaniza el sistema, sustituye lo genérico sin eliminar nuestro trabajo». Sus fotos (referencias/curso/*.jpg)
   entran como portada al empezar el módulo que les corresponde: una escena más al principio de la primera lección
   (narración = el título del módulo). Los dibujos y animaciones de los pasos no se tocan. Cada foto se usa una sola vez.
   Sin la foto (no se pudo leer) no se añade nada. Envuelve `EU_CURSO_ANIM.enriquecer` después de `b6_pelu_premium.js`
   (así la Bienvenida ya existe). Solo materia `pelu`. Para añadir otra: una fila en FOTOS. */
(function () {
  'use strict';
  if (window.EU_PELU_FOTOS) return;
  /* [archivo, id de la imagen, a qué módulo va (por orden de preferencia)] — 'bienvenida' = la lección de presentación */
  var FOTOS = [
    ['portada_curso.jpg', 'foto_portada_curso', ['bienvenida']],
    ['colorimetria.jpg', 'foto_colorimetria', [/^cb_color_global$/, /^cb_color_/]],
    ['color_balayage.jpg', 'foto_color_balayage', [/^cb_color_balayage$/, /^cb_mechas_/]],
    ['corte_mariposa.jpg', 'foto_corte_mariposa', [/^pe_u_c_capas$/, /^pe_u_c_moda$/]],   /* mariposa = capas; nunca en melenas/bob */
    ['quimicos.jpg', 'foto_quimicos', [/^cb_quim_decoloracion$/, /^cb_quim_/, /^cb_quera_/]],
    /* 17-10-2026, Fátima (su Drive): tinte y corrección de color, secado y planchado, cada una en su módulo */
    ['tinte_correccion.jpg', 'foto_tinte_correccion', [/^cb_color_raiz$/, /^cb_color_global$/]],
    ['secado.jpg', 'foto_secado', [/^cb_cab_secado$/]],
    ['planchado.jpg', 'foto_planchado', [/^cb_cab_planchado$/, /^cb_quera_alisado$/]]
  ];
  var DATA = {};
  FOTOS.forEach(function (f) {
    try {
      fetch('./referencias/curso/' + f[0]).then(function (r) { return r.ok ? r.blob() : null; }).then(function (b) {
        if (!b) return; var fr = new FileReader(); fr.onload = function () { DATA[f[1]] = fr.result; }; fr.readAsDataURL(b);
      }).catch(function () { });
    } catch (e) { }
  });

  function poner(D) {
    if (!D || !D.modulos || !D.modulos.length || D._fotosFatima) return D;
    D.img = D.img || {};
    var usados = {};
    FOTOS.forEach(function (f) {
      var id = f[1]; if (!DATA[id]) return;
      var M = null, L = null;
      f[2].some(function (dest) {
        if (dest === 'bienvenida') {
          D.modulos.some(function (m) { var l = m.lecciones.filter(function (x) { return /__bienvenida$/.test(x.id); })[0]; if (l) { M = m; L = l; } return !!l; });
        } else {
          D.modulos.some(function (m) { if (!usados[m.id] && dest.test(m.id) && m.lecciones.length) { M = m; L = m.lecciones[0]; } return !!M; });
        }
        return !!L;
      });
      if (!L || !L.escenas) return;
      usados[M.id] = 1; D.img[id] = DATA[id];
      var tit = /__bienvenida$/.test(L.id) ? D.titulo : M.t;
      L.escenas.unshift({ tipo: 'idea', id: id, t: tit, texto: tit + '.', rot: [] });
    });
    D._fotosFatima = 1;
    return D;
  }

  var CA = window.EU_CURSO_ANIM;
  function enganchar() {
    CA = window.EU_CURSO_ANIM;
    if (!CA || !CA.enriquecer) return false;
    if (CA.enriquecer._fotosPelu) return true;
    var enr = CA.enriquecer;
    CA.enriquecer = function (D, res) {
      return Promise.resolve(enr.apply(this, arguments)).then(function (D2) {
        var R = D2 || D, mat = res && res.C && res.C.cfg && res.C.cfg.materia;
        return mat === 'pelu' ? poner(R) : R;
      });
    };
    CA.enriquecer._fotosPelu = 1;
    return true;
  }
  if (!enganchar()) (function espera(n) { if (!enganchar() && n < 200) setTimeout(function () { espera(n + 1); }, 300); })(0);

  window.EU_PELU_FOTOS = { FOTOS: FOTOS, poner: poner, listas: function () { return Object.keys(DATA); } };
})();
