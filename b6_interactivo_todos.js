/* b6_interactivo_todos.js — tutor, pizarra y láminas animadas también fuera del «Libro de texto» (Fátima, 10-10-2026).
   El tutor («Repaso con tu tutor»: lámina animable, pasos, ejemplo resuelto con ✍️ Pizarra, «Practica con tu tutor»
   con 💡 Pista y ✅ Respuesta, «Lo esencial») nace de la página «repaso» de cada unidad, y solo el libro y el ebook
   la tienen. Aquí, al armar, se marca como «repaso» UNA hoja por unidad en los productos que no la traen, sin añadir
   hojas (b6_tutor.js la convierte después en tutor, la mide y la ajusta):
     · Cuaderno de actividades → la lectura de la unidad (lec_*) o «Mis apuntes»;
     · Fichas sueltas          → una ficha visual de relleno de la unidad;
     · Libro profesional       → «Claves» del capítulo (el tutor lleva «Lo esencial»).
   No se tocan: unidad didáctica y rúbrica (son para el profesorado), examen (no puede llevar respuestas), trabajo del
   alumno, recetario, diccionario, colorear, caligrafía y pasatiempos (tienen su propia estructura).
   El solucionario deja de citar la hoja sustituida. `cfg.acab.interactivoTodos = 'no'` lo apaga. */
(function () {
  'use strict';
  var ED = window.EU_EDITORIAL; if (!ED || window.EU_INTERACTIVO_TODOS) return;
  var REGLA = {
    cuaderno: [function (p) { return /^lec_/.test(p.tipo); }, function (p) { return p.tipo === 'apuntes'; }],
    fichas: [function (p) { return p.tipo === 'vis' && p.relleno; }],
    libro_pro: [function (p) { return p.tipo === 'pro_claves'; }]
  };
  function repasos(res) {
    var C = res && res.C, id = C && C.prod && C.prod.id, R = REGLA[id];
    if (!R || !res.pages || ((C.cfg && C.cfg.acab) || {}).interactivoTodos === 'no' || C.papelId === 'slide') return 0;
    var porU = {}, orden = [], hechas = 0, sols = res.pages.filter(function (p) { return p.tipo === 'solucion' && p.entradas; });
    res.pages.forEach(function (p, i) { if (!p.u || !p.u.id) return; if (!porU[p.u.id]) { porU[p.u.id] = []; orden.push(p.u.id); } porU[p.u.id].push(i); });
    orden.forEach(function (uid) {
      var idx = porU[uid];
      if (idx.some(function (i) { return res.pages[i].tipo === 'repaso' || res.pages[i].tipo === 'tutor'; })) return;
      var n = null; idx.forEach(function (i) { if (n == null && res.pages[i].n != null) n = res.pages[i].n; });
      for (var r = 0; r < R.length; r++) {
        for (var k = idx.length - 1; k >= 0; k--) {
          var i = idx[k], v = res.pages[i];
          if (!R[r](v)) continue;
          res.pages[i] = { tipo: 'repaso', u: v.u, n: v.n != null ? v.n : (n != null ? n : 1), num: v.num, deTodos: v.tipo };
          sols.forEach(function (s) { s.entradas = s.entradas.filter(function (en) { return en.p !== v.num; }); });
          hechas++; return;
        }
      }
    });
    return hechas;
  }
  window.EU_INTERACTIVO_TODOS = { repasos: repasos, REGLA: REGLA };
})();
