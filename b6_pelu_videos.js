/* b6_pelu_videos.js — vídeos de módulo y de cierre de nivel en el curso premium de Peluquería (window.EU_PELU_VIDEOS).
   Fátima, 19-10-2026: «en cada módulo un vídeo (ya tiene el de presentación, falta el de colorimetría…) y cuando terminan
   las lecciones también, de cada nivel; que se vea más profesional».
   - Primera lección de cada módulo (tras «Bienvenida · Presentación» en el primero): «Presentación · <módulo>», con su
     vídeo HyperFrames referencias/curso/modulos/<id del módulo>.mp4 (hyperframes/gen_modulos.py).
   - Última lección del curso: «Cierre · Nivel <nivel>», con referencias/curso/modulos/cierre_<pri|sec|bach|fp>.mp4.
   Solo se añade la lección si su vídeo existe (lista VIDEOS). No quita ni cambia ninguna lección. Solo `pelu`.
   Envuelve `EU_CURSO_ANIM.enriquecer` cuando `b6_pelu_fotos.js` ya la envolvió (`EU_PELU_FOTOS_OK`). `cfg.acab.videosModulo='no'` lo apaga. */
(function () {
  'use strict';
  if (window.EU_PELU_VIDEOS) return;
  /* vídeos hechos (hyperframes/gen_modulos.py → referencias/curso/modulos/) */
  var VIDEOS = {};
  var NIVEL = { pri: 'Principiante', sec: 'Intermedio', bach: 'Avanzado', fp: 'Profesional', adu: 'Profesional' };
  var CIERRE = { pri: 'pri', sec: 'sec', bach: 'bach', fp: 'fp', adu: 'fp' };
  try {
    fetch('./referencias/curso/modulos/lista.json').then(function (r) { return r.ok ? r.json() : []; })
      .then(function (l) { (l || []).forEach(function (n) { VIDEOS[n] = 1; }); }).catch(function () { });
    /* 23-10-2026 (Fátima: «quítale los subtítulos y ponle el audio mío»): clases en vídeo con su voz clonada, sin subtítulos */
    fetch('./referencias/curso/clases/lista.json').then(function (r) { return r.ok ? r.json() : []; })
      .then(function (l) { (l || []).forEach(function (n) { VIDEOS[n] = 1; }); }).catch(function () { });
  } catch (e) { }
  /* [vídeo, título de la lección, narración] por unidad; los textos son los de sus fichas (b6_cortes.js, b6_pelu_geometria.js) */
  var CLASES = {
    pe_u_c_basicos: [
      /* 25-10-2026 (Fátima, vídeos de Pexels con su voz): lavado antes de cortar y corte en la línea guía */
      ['clases/lavado.mp4', 'Clase en vídeo · Lavado del cabello', 'Antes de cortar, el cabello se lava. El cabello debe estar mojado para cortarlo.'],
      ['clases/seccionados_nivel1.mp4', 'Cinco técnicas de seccionado', 'Cinco técnicas de seccionado para empezar: en V invertida, curvo, en punta, horizontal en capas y vertical con graduación. En todas, el cabello cae hacia abajo, a 0°.'],
      ['clases/corte_cuadrado.mp4', 'Clase en vídeo · Corte cuadrado', 'Corte básico cuadrado, sin elevación: todo a 0° y la misma medida en cada mechón. Delante se empareja con el de atrás.'],
      ['clases/maniqui_linea_guia.mp4', 'Clase en vídeo · Línea guía en el maniquí', 'La línea guía va en la nuca, a 0°. Cada mechón se baja a esa misma línea y se corta con la tijera en horizontal.'],
      ['clases/guia_corte.mp4', 'Clase en vídeo · Corte en la línea guía', 'La línea guía va en la nuca, a 0°. Cada mechón que se agarra se corta a 0° y de esa misma medida, para que el corte quede parejo.']
    ],
    /* 25-10-2026: textos de b6_color_fatima.js (fat_i03) y b6_cerebro.js (mechas, secado, planchado) */
    cb_quim_decoloracion: [
      ['clases/matizacion.mp4', 'Clase en vídeo · Matizar después de decolorar', 'Una decoloración no significa que el cabello va a quedar así. Después de una decoloración siempre se matiza, a menos que llegue al tono que la persona anda buscando.']
    ],
    cb_mechas_aluminio: [
      ['clases/mechas_papel.mp4', 'Clase en vídeo · Mechas con papel de aluminio', 'Coloca el mechón en la paleta y barre con la punta del pincel. Después cubre el mechón con papel de aluminio. Entre mechón y mechón deja un dedo de separación.']
    ],
    cb_cab_secado: [
      ['clases/secado.mp4', 'Clase en vídeo · Secado con cepillo', 'Se seca con el cepillo y aire caliente, a temperatura alta. Mechas del ancho del cepillo: se estira bien el cabello, sin pegarlo al cráneo.']
    ],
    cb_cab_planchado: [
      ['clases/planchado.mp4', 'Clase en vídeo · Planchado', 'Se pasa la plancha lentamente, dos o tres veces. No hasta que quede liso: eso quema el pelo y las cutículas.']
    ]
  };

  function limpio(t) { return String(t || '').replace(/^Cortes · /, ''); }
  /* imagen de portada: la primera escena del módulo que ya tenga dibujo o foto */
  function imgDe(D, M) {
    var id = null;
    M.lecciones.some(function (L) { return (L.escenas || []).some(function (e) { if (e.id && D.img && D.img[e.id]) { id = e.id; return true; } return false; }); });
    return id;
  }

  function poner(D, res) {
    if (!D || !D.modulos || !D.modulos.length || D._videosPelu) return D;
    var cfg = (res && res.C && res.C.cfg) || {};
    if ((cfg.acab || {}).videosModulo === 'no') return D;
    D.modulos.forEach(function (M) {
      var n = 'modulos/' + M.id + '.mp4'; if (!VIDEOS[n]) return;
      var t = limpio(M.t), k = M.lecciones.length && /__bienvenida$/.test(M.lecciones[0].id) ? 1 : 0;
      M.lecciones.splice(k, 0, { id: M.id + '__video', t: 'Presentación · ' + t, pag: M.pag, video: 1, mp4: n,
        escenas: [{ tipo: 'idea', id: imgDe(D, M), t: t, texto: t + '.', rot: [] }] });
    });
    D.modulos.forEach(function (M) {
      var L = (CLASES[M.id] || []).filter(function (c) { return VIDEOS[c[0]]; }); if (!L.length) return;
      var k = 0; while (k < M.lecciones.length && /__(video|bienvenida)$/.test(M.lecciones[k].id)) k++;
      M.lecciones.splice.apply(M.lecciones, [k, 0].concat(L.map(function (c, j) {
        return { id: M.id + '__clase' + j, t: c[1], pag: M.pag, video: 1, mp4: c[0], escenas: [{ tipo: 'idea', id: imgDe(D, M), t: c[1], texto: c[2], rot: [] }] };
      })));
    });
    /* b6_pelu_premium.js arma pri/sec/bach con el temario profesional y deja el nivel en op.nivel (1·2·3) */
    var nk = { 1: 'pri', 2: 'sec', 3: 'bach' }[String((cfg.op || {}).nivel)] || cfg.nivel;
    var nv = CIERRE[nk] || 'fp', c = 'modulos/cierre_' + nv + '.mp4', U = D.modulos[D.modulos.length - 1];
    if (VIDEOS[c]) {
      var tc = 'Nivel ' + NIVEL[nv];
      U.lecciones.push({ id: U.id + '__cierre', t: 'Cierre · ' + tc, pag: U.pag, video: 1, mp4: c,
        escenas: [{ tipo: 'idea', id: imgDe(D, U), t: tc, texto: tc + '.', rot: [] }] });
    }
    D._videosPelu = 1;
    return D;
  }

  var CA;
  function enganchar() {
    CA = window.EU_CURSO_ANIM;
    /* tras b6_pelu_fotos.js (su marca _fotosPelu se pierde si otro módulo, p. ej. b6_derechos.js, envuelve después) */
    if (!CA || !CA.enriquecer || !window.EU_PELU_FOTOS_OK) return false;
    if (CA.enriquecer._videosPelu) return true;
    var enr = CA.enriquecer;
    CA.enriquecer = function (D, res) {
      return Promise.resolve(enr.apply(this, arguments)).then(function (D2) {
        var R = D2 || D, mat = res && res.C && res.C.cfg && res.C.cfg.materia;
        return mat === 'pelu' ? poner(R, res) : R;
      });
    };
    CA.enriquecer._videosPelu = 1;
    return true;
  }
  if (!enganchar()) (function espera(n) { if (!enganchar() && n < 200) setTimeout(function () { espera(n + 1); }, 300); })(0);

  window.EU_PELU_VIDEOS = { VIDEOS: VIDEOS, poner: poner };
})();
