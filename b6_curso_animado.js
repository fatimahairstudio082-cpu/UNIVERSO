/* b6_curso_animado.js — animaciones del «🎓 Curso premium» (window.EU_CURSO_ANIM).
   Para cada lección de corte (pasos de Guías 3D, pe_g3d_<corte>_<k>) añade antes una lección
   «Diagramación · <corte>» hecha con el motor de diagramación (b6_pelu_diagrama.js): seccionado, línea guía
   en la nuca, capas de abajo arriba, lateral y frente, cada escena animada y sincronizada con la voz, más
   preguntas de repaso que también pasan al test del módulo.
   El curso premium la llama en dos puntos (enriquecer antes de las imágenes y js() para curso/anim.js).
   Si no hay cortes, no añade nada y el curso sale como antes. Cargar después de b6_curso_premium.js. */
(function () {
  'use strict';
  if (window.EU_CURSO_ANIM) return;

  function corteDe(L) {
    var id = null;
    (L.escenas || []).some(function (e) { var m = /^pe_g3d_(.+)_\d+$/.exec(e.id || ''); if (m) { id = m[1]; return true; } return false; });
    return id && window.EU_CORTES && window.EU_CORTES.get(id) ? id : null;
  }

  function enriquecer(D, res, aviso) {
    var DG = window.EU_DIAGRAMA; if (!DG) return Promise.resolve(D);
    var tareas = [];
    D.modulos.forEach(function (M) { M.lecciones.forEach(function (L) { var c = corteDe(L); if (c) tareas.push({ M: M, L: L, c: c }); }); });
    if (!tareas.length) return Promise.resolve(D);
    var hechos = {}, i = 0;
    return new Promise(function (ok) {
      (function sig() {
        if (i >= tareas.length) return ok(D);
        var T = tareas[i++];
        if (aviso) aviso('Curso premium: diagramación ' + i + ' de ' + tareas.length + '…');
        DG.construir(T.c).then(function (E) {
          if (!E || hechos[T.L.id]) return;
          hechos[T.L.id] = 1;
          D.anim = D.anim || {};
          Object.keys(E.fondos).forEach(function (v) { D.img['dg_' + v] = E.fondos[v]; });
          var esc = E.escenas.map(function (e) {
            var k = T.c + '_' + e.tipo; D.anim[k] = e.anim;
            return { tipo: 'paso', id: 'dg_' + e.vista, t: e.t, texto: e.texto, rot: [], anim: k };
          });
          var ult = esc[esc.length - 1].id;
          E.preguntas.forEach(function (q) {
            esc.push({ tipo: 'pregunta', id: ult, t: 'Repaso', texto: 'Antes de seguir, piensa: ' + q.e, rot: [], q: { e: q.e, o: q.o, c: q.c }, sol: 'La respuesta es: ' + q.o[q.c] + '.' + (q.x ? ' ' + q.x : '') });
            if (!T.M.test.some(function (x) { return x.e === q.e; })) T.M.test.push({ e: q.e, o: q.o, c: q.c });
          });
          var pos = T.M.lecciones.indexOf(T.L);
          T.M.lecciones.splice(pos, 0, { id: T.L.id + '__diag', t: 'Diagramación · ' + E.R.n, pag: T.L.pag, video: 1, escenas: esc });
        }).catch(function (er) { console.warn('Diagramación', T.c, er); }).then(function () { setTimeout(sig, 0); });
      })();
    });
  }

  window.EU_CURSO_ANIM = {
    enriquecer: enriquecer,
    js: function () { return window.EU_DIAGRAMA ? window.EU_DIAGRAMA.js() : ''; }
  };
})();
