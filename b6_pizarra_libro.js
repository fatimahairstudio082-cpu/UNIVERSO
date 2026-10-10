/* b6_pizarra_libro.js — conecta la pizarra del tutor (EU_PIZARRA, b6_pizarra.js) con el libro y el curso premium
   de TODAS las materias y niveles (window.EU_PIZARRA_LIBRO). Fátima, 10-10-2026.
   · Libro interactivo (solo web; el impreso, el PDF y el EPUB no cambian):
     – «Repaso con tu tutor»: botón «✍️ Pizarra» en cada ejercicio de «Practica con tu tutor» (el profesor resuelve
       el ejemplo de la unidad o uno igual con otros números; el alumno hace ESE ejercicio) y en el ejemplo resuelto
       (el alumno hace otro igual o el siguiente de la página).
     – «Así se resuelve» (ejemplos resueltos del banco): «✍️ Pizarra» junto a «▶ Ver resolución».
     Los botones van dentro de filas que ya existen (no añaden alto a la página). El motor se copia una sola vez
     al final del HTML descargado.
   · Curso premium: lección «Pizarra · <unidad>» al final de cada módulo que tenga un ejercicio para la pizarra
     (operaciones en columnas, ecuaciones o fórmulas): el profesor paso a paso (una escena por paso, con la imagen
     de la pizarra y su cuenta) y «Tu turno» con OTRO ejercicio igual: cada paso es una pregunta con su respuesta
     y su porqué. Los ejercicios de texto ya tienen su práctica en las lecciones del tutor.
   `cfg.acab.pizarra = 'no'` lo apaga. Cargar después de b6_pizarra.js, b6_tutor.js y b6_ejemplos_animados.js. */
(function () {
  'use strict';
  var ED = window.EU_EDITORIAL, PZ = window.EU_PIZARRA; if (!ED || !PZ || window.EU_PIZARRA_LIBRO) return;
  function activo(C) { return C && ((C.cfg && C.cfg.acab) || {}).pizarra !== 'no'; }
  function sub(s, C) { try { return ED.sub(String(s || ''), C); } catch (e) { return String(s || ''); } }
  function json(o) { return '<script type="application/json" data-piz="1">' + JSON.stringify(o).replace(/</g, '\\u003c') + '<\/script>'; }
  function tarea(x, C) { return x ? { e: sub(x.e, C), s: String(x.sol != null ? x.sol : x.s), x: x.porque != null ? x.porque : (x.x || ''), tipo: x.tipo, o: x.o, c: x.c, pista: x.pista || '' } : null; }

  /* ─── libro: datos de la pizarra en la página del tutor ─── */
  var FILA = '<div style="display:flex;gap:3mm;margin-top:.8mm;font-size:.85em">';
  ED.registrar({
    post: function (h, pg, C, modo) {
      if (modo !== 'web' || pg.tipo !== 'tutor' || !pg.tut || !activo(C) || typeof h !== 'string') return h;
      var t = pg.tut, u = pg.u, tit = 'Repaso · ' + PZ.limpio(sub(u.t, C)), its = (t.items || []).slice(0, t.nivel < 1 ? 3 : 2).map(function (x) { return tarea(x, C); });
      var prof = t.ej ? { e: sub(t.ej.e, C), s: t.ej.s, x: t.ej.x } : null, i = 0;
      h = h.split(FILA).map(function (trozo, k) {
        if (!k) return trozo;
        var r = its[i++]; return r ? json({ titulo: tit, prof: prof, reto: r, otros: its.filter(function (o) { return o !== r; }) }) + trozo : trozo;
      }).join(FILA);
      if (prof && t.nivel < 5) {
        var m = '→ ' + H(t.ej.s) + '</div>', k = h.indexOf(m);
        if (k >= 0) h = h.slice(0, k + m.length - 6) + json({ titulo: tit, prof: prof, otros: its }) + h.slice(k + m.length - 6);
      }
      return h;
    }
  });
  function H(s) { return ED.H.esc(String(s == null ? '' : s)); }

  /* ─── libro: el motor y los botones, una vez al final del HTML ─── */
  function botones() {
    return '<script>(function(){var P=window.EU_PIZ;if(!P)return;' +
      'function bt(){var b=document.createElement("button");b.type="button";b.textContent="\\u270d\\ufe0f Pizarra";b.title="Practicar en la pizarra con el tutor";b.style.cssText="font:600 11px system-ui,sans-serif;padding:2px 10px;border-radius:99px;border:1px solid #ffd43b;background:#0b1a2e;color:#ffd43b;cursor:pointer;vertical-align:middle;margin:0 2mm;line-height:1.6";return b}' +
      '[].slice.call(document.querySelectorAll("script[data-piz]")).forEach(function(sc){var d;try{d=JSON.parse(sc.textContent)}catch(e){return}var b=bt();b.onclick=function(e){e.preventDefault();e.stopPropagation();P.abrir(d)};sc.parentNode.insertBefore(b,sc)});' +
      /* ejemplos resueltos del banco: el alumno hace otro igual o el siguiente ejemplo de la misma página */
      'var ej=[].slice.call(document.querySelectorAll("script[data-ej-anim]")).map(function(sc){try{return{sc:sc,d:JSON.parse(sc.textContent)}}catch(e){return null}}).filter(Boolean);' +
      'ej.forEach(function(o){var box=o.sc.parentNode,pag=box.closest("[data-enc]")||document,d=o.d,b=bt();' +
      'var otros=ej.filter(function(q){return q!==o&&pag.contains(q.sc)}).map(function(q){return{e:q.d.e,s:q.d.s,x:q.d.x,p:q.d.p}});' +
      'b.onclick=function(e){e.preventDefault();P.abrir({titulo:d.t,prof:{e:d.e,s:d.s,x:d.x,p:d.p},otros:otros})};' +
      'var cab=box.firstElementChild;if(cab)cab.appendChild(b);else box.insertBefore(b,box.firstChild)});' +
      '})();<\/script>';
  }
  var doc = ED.documento;
  ED.documento = function (res, modo) {
    var h = doc.apply(this, arguments);
    try {
      if (modo === 'web' && res && activo(res.C) && (h.indexOf('data-piz=') >= 0 || h.indexOf('data-ej-anim') >= 0)) {
        var k = h.lastIndexOf('</body>');
        if (k > 0) h = h.slice(0, k) + '<script>' + PZ.fuente().replace(/<\/script/gi, '<\\/script') + '<\/script>' + botones() + h.slice(k);
      }
    } catch (e) { console.warn('Pizarra · libro', e); }
    return h;
  };

  /* ─── curso premium: lección «Pizarra · <unidad>» ─── */
  var MAXP = 12;
  function elegir(t, C) {
    var prof = t.ej ? PZ.analiza({ e: sub(t.ej.e, C), s: t.ej.s, x: t.ej.x }) : null, its = (t.items || []).map(function (x) { return PZ.analiza(tarea(x, C), prof && prof.tipo); });
    var util = function (a) { return a && (a.tipo === 'columnas' || a.tipo === 'ecuacion' || (a.tipo === 'cadena' && PZ.lineasDe(a).length >= 1)); };
    var reto = its.filter(function (a) { return a.tipo === 'columnas' || a.tipo === 'ecuacion'; })[0] || null;
    if (!reto && util(prof)) reto = PZ.similar(prof) || its.filter(function (a) { return a.tipo === prof.tipo && a.e !== prof.e; })[0] || null;
    if (!reto) return null;
    if (!util(prof) || prof.tipo !== reto.tipo || (reto.tipo === 'columnas' && prof.op !== reto.op) || prof.e === reto.e) prof = PZ.similar(reto) || (util(prof) ? prof : null);
    return prof && util(prof) ? { prof: prof, reto: reto } : null;
  }
  function muestra(L, n) { if (L.length <= n) return L; var out = [L[0]], paso = (L.length - 2) / (n - 2); for (var i = 1; i < n - 1; i++) out.push(L[Math.round(i * paso)]); out.push(L[L.length - 1]); return out.filter(function (x, i, a) { return a.indexOf(x) === i; }); }
  function opciones(v, sem) {
    var o = [v, v + 1, v - 1 >= 0 ? v - 1 : v + 2, v + 10].filter(function (x, i, a) { return a.indexOf(x) === i; }).slice(0, 3), r = [];
    var k = Math.abs(sem) % 3; o.forEach(function (x, i) { r[(i + k) % o.length] = x; }); return { o: r.map(String), c: r.indexOf(v) };
  }
  function lecciones(D, res) {
    var C = res.C, n = 0; if (!activo(C) || !D || !D.modulos) return 0; D.img = D.img || {};
    D.modulos.forEach(function (M) {
      var pg = res.pages.filter(function (p) { return p.tipo === 'tutor' && p.u && p.u.id === M.id; })[0]; if (!pg || !pg.tut) return;
      if (M.lecciones.some(function (l) { return l.id === M.id + '__pizarra'; })) return;
      var par = null; try { par = elegir(pg.tut, C); } catch (e) { par = null; } if (!par) return;
      var u = pg.u, base = 'piz_' + u.id, P = PZ.pasos(par.prof), idx = [], esc = [];
      for (var k = 1; k <= P.length; k++) idx.push(k);
      muestra(idx, MAXP).forEach(function (k) {
        var p = P[k - 1], id = base + '_p' + k;
        try { D.img[id] = PZ.foto(par.prof, k, 720, 420); } catch (e) { return; }
        esc.push({ tipo: 'idea', id: id, t: '👨‍🏫 ' + p.t, texto: p.d + (p.ecu && p.d.indexOf(p.ecu) < 0 ? ' ' + p.ecu + '.' : ''), rot: [] });
      });
      /* tu turno: otro ejercicio igual, paso a paso */
      var R = par.reto, Q = PZ.pasos(R), qs = [];
      if (R.tipo === 'cadena') {
        var id0 = base + '_r0'; try { D.img[id0] = PZ.foto(R, 1, 720, 420); } catch (e) { }
        esc.push({ tipo: 'idea', id: id0, t: '✍️ Tu turno', texto: 'Ahora tú: ' + R.e + ' Hazlo como el profesor. … La respuesta es: ' + R.s + '.' + (R.x ? ' Por qué: ' + R.x : ''), rot: [] });
      } else {
        Q.forEach(function (p, k) { if (p.esp != null && Math.round(p.esp) === p.esp) qs.push(k); });
        muestra(qs, 6).forEach(function (k, j) {
          var p = Q[k], id = base + '_r' + k, op = opciones(p.esp, k + j);
          try { D.img[id] = PZ.foto(R, k, 720, 420, '#39d9ff'); } catch (e) { return; }
          esc.push({ tipo: 'pregunta', id: id, t: '✍️ Tu turno · ' + p.t, texto: p.d + ' ¿Cuánto da?', rot: [], q: { e: p.d + ' ¿Cuánto da?', o: op.o, c: op.c }, sol: 'Es ' + p.esp + '. ' + p.ok });
        });
        var fid = base + '_rf'; try { D.img[fid] = PZ.foto(R, Q.length, 720, 420, '#39d9ff'); } catch (e) { }
        var f = Q[Q.length - 1]; if (f) esc.push({ tipo: 'idea', id: fid, t: '🎉 Resultado', texto: f.d, rot: [] });
      }
      if (esc.length < 3) return;
      M.lecciones.push({ id: M.id + '__pizarra', t: 'Pizarra · ' + PZ.limpio(sub(u.t, C)), pag: pg.num, video: 1, escenas: esc }); n++;
    });
    return n;
  }
  var CA = window.EU_CURSO_ANIM;
  if (CA && CA.enriquecer && !CA.enriquecer._pizarra) {
    var enr = CA.enriquecer;
    CA.enriquecer = function (D, res) {
      return Promise.resolve(enr.apply(this, arguments)).then(function (D2) { var R = D2 || D; try { lecciones(R, res); } catch (e) { console.warn('Pizarra · curso', e); } return R; });
    };
    CA.enriquecer._pizarra = 1;
  }

  window.EU_PIZARRA_LIBRO = { lecciones: lecciones, elegir: elegir };
})();
