/* b6_pelu_banco_tests.js — tests de Peluquería hechos solo con la experiencia real de Fátima (window.EU_PELU_TESTS).
   15-11-2026 (Fátima: «tests de mi experiencia real, basados en cada corte; cero inventos; todo coherente con lo que ve»).

   Qué hace: da al motor (gancho `registrar({ quiz: { pelu } })`) las preguntas de cada unidad de `pelu`. Las usan las
   «Actividades» y el «Repaso con tu tutor» del libro y los tests y el examen del curso premium.

   REGLA: aquí no se redacta contenido de peluquería. La respuesta correcta y las opciones falsas son SIEMPRE datos que ya
   están en el sistema: la ficha de cada corte (EU_CORTES.tecnica), las preguntas de su clase animada (EU_DIAGRAMA), los
   pasos, errores comunes y repaso de cada técnica (EU_CEREBRO) y el repaso de la unidad (u.rep). Lo único fijo es el
   enunciado («¿a qué elevación…?», «¿cuál es el error común…?»). Sin plantillas «Completa ___», sin nombres ni ciudades.
   Con `solo = true` el motor no rellena con su plantilla genérica: si hay pocas preguntas suyas, el test sale más corto.
   `cfg.acab.testsFatima = 'no'` lo apaga. Cargar después de `b6_color_cerebro_motor.js`. */
(function () {
  if (window.EU_PELU_TESTS) return;
  var ZONAS = ['la nuca', 'la nuca alta', 'el occipital', 'el parietal', 'el lateral', 'la coronilla', 'el flequillo'];
  /* pasos del archivo antiguo que contradicen su orden raíz → puntas (los mismos que quita b6_pelu_receta.js) */
  var QUITA = { color_global: /cubrir las canas|^Medios y puntas$|^Raíz$/i };
  var LARGO = 170;   /* una opción más larga no cabe en la hoja: esa pregunta no se hace (no se recorta su texto) */

  function limpio(s) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim(); }
  function igual(a, b) { return limpio(a).toLowerCase() === limpio(b).toLowerCase(); }
  function unicos(l) { var o = []; l.forEach(function (x) { x = limpio(x); if (x && !o.some(function (y) { return igual(x, y); })) o.push(x); }); return o; }
  function baraja(r, l) { var a = l.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* pregunta de opción múltiple: correcta + 2 falsas tomadas de los datos de Fátima */
  function mc(r, e, bien, falsas, x, src) {
    bien = limpio(bien); if (!bien || bien.length > LARGO) return null;
    var f = baraja(r, unicos(falsas).filter(function (y) { return !igual(y, bien) && y.length <= LARGO; })).slice(0, 2);
    if (f.length < 2) return null;
    var o = baraja(r, [bien].concat(f)), c = o.indexOf(bien);
    return { tipo: 'mc', e: e, o: o, c: c, s: 'abc'.charAt(c) + ') ' + bien, x: x || '', src: src };
  }
  /* pregunta que ya viene hecha (repaso de la unidad, de la técnica o de la clase animada) */
  function hecha(q, src) {
    var e = q.p || q.e, o = q.o || []; if (!e || o.length < 2 || q.c == null || !o[q.c]) return null;
    return { tipo: 'mc', e: e, o: o.slice(), c: q.c, s: 'abc'.charAt(q.c) + ') ' + o[q.c], x: q.x || '', src: src };
  }

  /* ───── cortes: la ficha de cada corte del catálogo ───── */
  function deCortes(u, r, pool) {
    var CO = window.EU_CORTES, DG = window.EU_DIAGRAMA; if (!CO || !CO.lista) return;
    var L = CO.lista(u.id.slice(7)) || [], todos = CO.lista() || [];
    var fichas = {}; todos.forEach(function (c) { try { fichas[c.id] = CO.tecnica(c.id) || {}; } catch (e) { fichas[c.id] = {}; } });
    var grados = unicos(todos.reduce(function (a, c) { return a.concat((fichas[c.id].elev || []).map(function (g) { return g + '°'; })); }, []));
    var resultados = todos.map(function (c) { return fichas[c.id].resultado; });
    var unos = 0;   /* «todas las capas a N°» como mucho en dos cortes de la unidad: en los básicos la respuesta es siempre 0° */
    L.forEach(function (c, i) {
      var T = fichas[c.id] || {}, ev = T.elev || [], src = 'corte:' + c.id;
      /* 1 · elevación: todo a un mismo grado, o la de una zona (distinta en cada corte de la unidad) */
      if (ev.length) {
        var uno = ev.every(function (g) { return g === ev[0]; });
        if (uno) { if (unos++ < 2) pool.push(mc(r, 'En «' + c.n + '», ¿a qué elevación se cortan todas las capas?', ev[0] + '°', grados, 'La ficha de «' + c.n + '» marca ' + ev[0] + '° en toda la cabeza.', src)); }
        else [i % ev.length, (i + 3) % ev.length].forEach(function (z) {
          pool.push(mc(r, 'En «' + c.n + '», ¿a qué elevación se corta ' + (ZONAS[z] || 'la capa ' + (z + 1)) + ' (capa ' + (z + 1) + ')?', ev[z] + '°', grados,
            'Elevaciones de «' + c.n + '», de la nuca hacia arriba: ' + ev.join(' · ') + '°.', src));
        });
      }
      /* 2 · cómo queda (su «resultado») */
      if (T.resultado) pool.push(mc(r, '¿Cómo queda el corte «' + c.n + '»?', T.resultado, resultados, '', src));
      /* 3 · las preguntas de su clase animada (las mismas que oye el alumno) */
      try { if (DG && DG.construirYa && (!DG.fondosYa || DG.fondosYa())) (DG.construirYa(c.id).preguntas || []).forEach(function (q) { pool.push(hecha(q, 'clase:' + c.id)); }); } catch (e) { }
    });
    /* 4 · el repaso de la unidad («¿Qué corte es?» con su descripción), como mucho tres */
    baraja(r, u.rep || []).slice(0, 3).forEach(function (q) { pool.push(hecha(q, 'repaso:' + u.id)); });
  }

  /* ───── técnicas: sus pasos, sus errores comunes y su repaso ───── */
  /* los pasos de una técnica, sin los que contradicen su orden */
  function pasosDe(id) { var CB = window.EU_CEREBRO; try { return (CB.pasos(id) || []).filter(function (p) { return !(QUITA[id] && QUITA[id].test(p.t || '')); }); } catch (e) { return []; } }
  function deTecnica(u, r, pool) {
    var CB = window.EU_CEREBRO, id = u.id.slice(3); if (!CB || !CB.pasos) return;
    var t = null, P = pasosDe(id); try { t = CB.obtener(id); } catch (e) { }
    if (!t) return;
    var src = 'tecnica:' + id, n = t.n || u.t, otros = [];
    try { (CB.listar() || []).forEach(function (x) { if (x.id !== id) (CB.pasos(x.id) || []).forEach(function (p) { otros.push(p); }); }); } catch (e) { }
    var errores = P.concat(otros).map(function (p) { return p.e; }), titulos = P.map(function (p) { return p.t; });
    (u.rep || []).forEach(function (q) { pool.push(hecha(q, 'repaso:' + id)); });
    P.forEach(function (p, i) {
      if (p.e) pool.push(mc(r, 'En «' + n + '», paso «' + p.t + '»: ¿cuál es el error común?', p.e, errores, p.n || '', src));
      if (i < P.length - 1 && titulos.length >= 4) pool.push(mc(r, 'En «' + n + '», ¿qué paso va después de «' + p.t + '»?', P[i + 1].t, titulos.filter(function (x) { return !igual(x, p.t); }), 'Orden de la receta: ' + titulos.join(' → ') + '.', src));
    });
  }

  function banco(u, C, r, n) {
    var pool = [];
    try {
      if (/^pe_u_c_/.test(u.id)) deCortes(u, r, pool);
      else if (/^cb_/.test(u.id)) deTecnica(u, r, pool);
      else (u.rep || []).forEach(function (q) { pool.push(hecha(q, 'repaso:' + u.id)); });
    } catch (e) { console.warn('pelu · tests', e); }
    var vistos = {}, out = [];
    baraja(r, pool.filter(Boolean)).forEach(function (x) { var k = limpio(x.e).toLowerCase(); if (!vistos[k]) { vistos[k] = 1; out.push(x); } });
    return out;
  }

  var ACTIVO = true;
  function quiz(u, C, r, n) { return banco(u, C, r, n); }
  quiz.solo = function (C) { return ACTIVO && !(C && C.cfg && (C.cfg.acab || {}).testsFatima === 'no'); };

  (function engancha(k) {
    var ED = window.EU_EDITORIAL;
    if (!ED || !ED.registrar) return k < 200 ? setTimeout(function () { engancha(k + 1); }, 300) : null;
    ED.registrar({ quiz: { pelu: quiz } });
  })(0);

  window.EU_PELU_TESTS = { banco: banco, quiz: quiz, pasosDe: pasosDe };
})();
