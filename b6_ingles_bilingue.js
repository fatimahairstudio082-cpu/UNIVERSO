/* b6_ingles_bilingue.js — Inglés organizado por módulo y bilingüe (window.EU_INGLES_BILINGUE), Fátima 10-10-2026:
   «que se vea cómo se escribe en español y en inglés, con traducción, y que el audio diga cada cosa como se tiene que decir».
   · Libro (todos los formatos): en cada unidad de Inglés, una página «Así se dice · English ↔ Español» con el vocabulario
     (inglés · español · cómo se pronuncia) y las frases de la unidad con su traducción. En el libro interactivo cada fila
     lleva 🔊 EN (voz inglesa) y 🔊 ES (voz española), y «▶ Ver y escuchar» la lee con las dos voces (b6_voz_bilingue.js).
     Datos: b6_texto_ingles.js (traducciones) y, si una unidad no está allí, sus pares u.par.
     No añade hojas: ocupa, por este orden, la lectura de la unidad, una lectura extra, «Mis apuntes», una hoja visual o
     de actividades de relleno, la 2.ª lectura de concepto o, en el libro profesional, el caso práctico; el solucionario se ajusta.
   · Curso premium: en cada módulo de Inglés, lección «Escucha y repite · …» (tarjeta de cada palabra: la dice en inglés,
     luego en español, y pide repetirla) y «¿Cómo se dice?» con preguntas; el motor de voz bilingüe viaja en D.bil.
   `cfg.acab.bilingue = 'no'` lo apaga. Cargar después de b6_texto_ingles.js y b6_voz_bilingue.js. */
(function () {
  'use strict';
  var ED = window.EU_EDITORIAL; if (!ED || window.EU_INGLES_BILINGUE) return;
  var H = ED.H, esc = H.esc;
  function activo(C) { return C && C.mat === 'ingles' && ((C.cfg && C.cfg.acab) || {}).bilingue !== 'no' && C.papelId !== 'slide'; }
  function datos(u) {
    var B = (window.EU_TEXTO_INGLES || {})[u.id] || {};
    var v = (B.v || (u.par || []).map(function (p) { return [p[0], p[1], '']; })).slice(0, 9);
    var fr = (u.i || []).map(function (s, k) { return [s, (B.i || [])[k] || '']; });
    return { t: B.t || '', v: v, fr: fr };
  }
  function kicker(C, t) { return '<div style="font-size:.74em;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:' + C.T.acc + ';margin:0 0 1.5mm">' + t + '</div>'; }
  function boton(l, t) { return '<button data-bil="' + l + '" data-t="' + esc(t) + '" style="font:600 10px system-ui,sans-serif;padding:2px 7px;margin-left:1.5mm;border-radius:99px;border:1px solid currentColor;background:#fff;color:' + (l === 'en' ? '#1F4E8C' : '#B8322A') + ';cursor:pointer">🔊 ' + l.toUpperCase() + '</button>'; }

  function pagina(pg, C, modo) {
    var u = pg.u, D = datos(u), web = modo === 'web', T = C.T, lv = pg.bilL || 0;
    var th = 'text-align:left;padding:1.4mm 2mm;border-bottom:0.5mm solid ' + T.acc + ';font-size:.82em;letter-spacing:.04em';
    var td = 'padding:' + (lv ? 1.1 : 1.8) + 'mm 2mm;border-bottom:0.25mm solid ' + T.soft + ';vertical-align:middle';
    var tabla = D.v.length ? '<table style="width:100%;border-collapse:collapse;margin:0 0 4mm"><tr><th style="' + th + ';color:#1F4E8C">English</th><th style="' + th + ';color:#B8322A">Español</th><th style="' + th + '">Cómo se pronuncia</th></tr>' +
      D.v.map(function (v) {
        return '<tr><td style="' + td + ';font-weight:700;color:#1F4E8C">' + esc(v[0]) + (web ? boton('en', v[0]) : '') + '</td><td style="' + td + '">' + esc(v[1]) + (web ? boton('es', v[1]) : '') + '</td><td style="' + td + ';font-style:italic;opacity:.85">' + (v[2] ? '[' + esc(v[2]) + ']' : '') + '</td></tr>';
      }).join('') + '</table>' : '';
    var frases = D.fr.slice(0, lv >= 2 ? 2 : 4).map(function (f) {
      return '<div style="margin:0 0 2.6mm;padding-left:3mm;border-left:0.8mm solid #1F4E8C;break-inside:avoid"><div style="font-weight:600;color:#1F4E8C">' + esc(f[0]) + (web ? boton('en', f[0]) : '') + '</div>' +
        (f[1] ? '<div style="opacity:.9;margin-top:.6mm;border-left:0;color:' + T.ink + '">' + esc(f[1]) + (web ? boton('es', f[1]) : '') + '</div>' : '') + '</div>';
    }).join('');
    var nota = '<p style="margin:0 0 3mm;font-size:.92em">' + (web ? 'Pulsa 🔊 EN para oírlo en inglés y 🔊 ES para oírlo en español. Repite en voz alta.' : 'Lee en voz alta cada palabra en inglés, mira cómo se dice en español y repítela.') + '</p>';
    var practica = lv ? '' : H.h2(C, 'Tu turno · Your turn') + '<p style="margin:0 0 1.5mm;font-size:.92em">Escribe una frase en inglés con dos palabras de la tabla y tradúcela al español.</p>' + H.lineas(3, C);
    return H.cabecera(C, pg) + kicker(C, 'Unidad ' + pg.n + ' · Así se dice · English ↔ Español') +
      H.h1(C, esc(ED.sub ? ED.sub(u.t, C) : u.t) + (D.t ? '<span style="display:block;font-size:.55em;font-weight:400;opacity:.75;margin-top:1mm">' + esc(D.t) + '</span>' : ''), 'margin-bottom:3mm') +
      '<div data-bil-pag="1">' + nota + tabla + (frases ? H.h2(C, 'Frases de la unidad · Sentences') + frases : '') + practica + '</div>' + H.folio(C, pg);
  }
  function voz(pg) {
    var D = datos(pg.u);
    return 'Así se dice. ' + D.v.map(function (v) { return v[0] + ' — ' + v[1] + '.'; }).join(' ') + ' ' + D.fr.map(function (f) { return f[0] + (f[1] ? ' — ' + f[1] : ''); }).join(' ');
  }
  ED.registrar({ paginas: { ing_bil: pagina }, voz: { ing_bil: voz } });

  /* medir: la página nunca se sale (si no cabe, menos frases y sin «Tu turno») */
  var caja = null;
  function cabe(pg, res) {
    if (!document.body) return true; var C = res.C;
    if (!caja) { caja = document.createElement('div'); caja.style.cssText = 'position:absolute;left:-99999px;top:0;visibility:hidden;pointer-events:none'; }
    if (!caja.parentNode) document.body.appendChild(caja);
    var ok = true;
    try {
      ['print', 'web'].forEach(function (m) {
        if (!ok) return; caja.innerHTML = ED.paginaHTML(pg, C, m, res);
        var p = caja.firstChild, b = p.querySelector('[data-bil-pag]'); if (!b) return;
        if (b.getBoundingClientRect().bottom > p.getBoundingClientRect().top + (C.papel.h - 17) * 96 / 25.4) ok = false;
      });
    } catch (e) { ok = true; } finally { caja.innerHTML = ''; }
    return ok;
  }
  function colocar(res) {
    var C = res.C, pages = res.pages, porU = {}, orden = [], sols = pages.filter(function (p) { return p.tipo === 'solucion' && p.entradas; }), n = 0;
    pages.forEach(function (p, i) { if (!p.u || !p.u.id) return; if (!porU[p.u.id]) { porU[p.u.id] = []; orden.push(p.u.id); } porU[p.u.id].push(i); });
    orden.forEach(function (id) {
      var idx = porU[id], u = pages[idx[0]].u, D = datos(u);
      if (!D.v.length && !D.fr.length) return;
      if (idx.some(function (i) { return pages[i].tipo === 'ing_bil'; })) return;
      var cuenta = function (f) { return idx.filter(function (i) { return f(pages[i]); }).length; };
      var reglas = [
        function (p) { return p.tipo === 'lec_lectura'; },
        function (p) { return p.tipo === 'lec_amplia'; },
        function (p) { return p.tipo === 'apuntes'; },
        function (p) { return p.tipo === 'vis' && p.relleno; },
        function (p) { return p.tipo === 'vis' && cuenta(function (q) { return q.tipo === 'vis'; }) > 1; },
        function (p) { return p.tipo === 'actividad' && p.relleno && cuenta(function (q) { return q.tipo === 'actividad'; }) > 1; },
        function (p) { return /^lec_/.test(p.tipo) && cuenta(function (q) { return /^lec_/.test(q.tipo); }) > 1; },
        function (p) { return p.tipo === 'pro_caso'; }
      ];
      for (var r = 0; r < reglas.length; r++) {
        for (var k = idx.length - 1; k >= 0; k--) {
          var i = idx[k], v = pages[i]; if (!reglas[r](v)) continue;
          var nu = { tipo: 'ing_bil', u: u, n: v.n != null ? v.n : (pages[idx[0]].n || 1), num: v.num, fill2: { nada: 1 }, bilL: 0 };
          while (nu.bilL < 2 && !cabe(nu, res)) nu.bilL++;
          pages[i] = nu; n++;
          sols.forEach(function (s) { s.entradas = s.entradas.filter(function (en) { return en.p !== v.num; }); });
          return;
        }
      }
    });
    res.bilingue = n;
    return res;
  }
  /* se engancha después de la enciclopedia (que va después del tutor): así ocupa solo lo que ellos dejan libre */
  function enganchar() {
    if (ED.__bil) return; ED.__bil = 1;
    var ens = ED.ensamblar;
    ED.ensamblar = function (cfg) {
      var res = ens.apply(this, arguments);
      try { if (res && res.C && activo(res.C) && res.pages) colocar(res); } catch (e) { console.warn('Inglés bilingüe', e); }
      return res;
    };
  }
  (function esperar(n) { if (ED.__enc || n > 80) enganchar(); else setTimeout(function () { esperar(n + 1); }, 300); })(0);

  /* botones 🔊 del libro web (el motor de voz lo pone b6_voz_bilingue.js) */
  var JS = '<script>(function(){document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("button[data-bil]");if(!b)return;e.preventDefault();' +
    'if(window.EU_BIL&&EU_BIL.di)EU_BIL.di(b.getAttribute("data-t"),b.getAttribute("data-bil"));else if(window.speechSynthesis){var u=new SpeechSynthesisUtterance(b.getAttribute("data-t"));u.lang=b.getAttribute("data-bil")==="en"?"en-GB":"es-ES";speechSynthesis.cancel();speechSynthesis.speak(u)}})})();<\/script>' +
    '<style>@media print{button[data-bil]{display:none!important}}</style>';
  var doc = ED.documento;
  ED.documento = function (res, modo) {
    var h = doc.apply(this, arguments);
    try { if (modo === 'web' && res && res.C && activo(res.C) && h.indexOf('data-bil=') >= 0) { var k = h.lastIndexOf('</body>'); if (k > 0) h = h.slice(0, k) + JS + h.slice(k); } } catch (e) { }
    return h;
  };

  /* curso premium */
  function tarjeta(en, es, pr) {
    try {
      var cv = document.createElement('canvas'); cv.width = 960; cv.height = 540; var x = cv.getContext('2d'); x.setTransform(0.75, 0, 0, 0.75, 0, 0);
      var g = x.createLinearGradient(0, 0, 0, 720); g.addColorStop(0, '#16223A'); g.addColorStop(1, '#22305a'); x.fillStyle = g; x.fillRect(0, 0, 1280, 720);
      x.textAlign = 'center'; x.fillStyle = '#8fb4ff'; x.font = '600 34px system-ui,sans-serif'; x.fillText('ENGLISH', 640, 170);
      var f = 110; x.font = '800 ' + f + 'px system-ui,sans-serif'; while (x.measureText(en).width > 1160 && f > 40) { f -= 6; x.font = '800 ' + f + 'px system-ui,sans-serif'; }
      x.fillStyle = '#ffffff'; x.fillText(en, 640, 300);
      if (pr) { x.font = 'italic 40px system-ui,sans-serif'; x.fillStyle = '#B08D57'; x.fillText('[' + pr + ']', 640, 375); }
      x.fillStyle = '#ff9a8c'; x.font = '600 34px system-ui,sans-serif'; x.fillText('ESPAÑOL', 640, 480);
      f = 76; x.font = '700 ' + f + 'px system-ui,sans-serif'; while (x.measureText(es).width > 1160 && f > 34) { f -= 6; x.font = '700 ' + f + 'px system-ui,sans-serif'; }
      x.fillStyle = '#ffffff'; x.fillText(es, 640, 580);
      return cv.toDataURL('image/jpeg', 0.74);
    } catch (e) { return null; }
  }
  function tarjetaFrase(en, es) {
    try {
      var cv = document.createElement('canvas'); cv.width = 960; cv.height = 540; var x = cv.getContext('2d'); x.setTransform(0.75, 0, 0, 0.75, 0, 0);
      var g = x.createLinearGradient(0, 0, 0, 720); g.addColorStop(0, '#16223A'); g.addColorStop(1, '#22305a'); x.fillStyle = g; x.fillRect(0, 0, 1280, 720);
      var parte = function (t, f, y0, col, max) {
        x.font = f; var pal = String(t).split(' '), l = [], a = '';
        pal.forEach(function (p) { var b = a ? a + ' ' + p : p; if (x.measureText(b).width > 1120 && a) { l.push(a); a = p; } else a = b; }); if (a) l.push(a);
        l = l.slice(0, max); x.fillStyle = col; x.textAlign = 'center'; l.forEach(function (s, i) { x.fillText(s, 640, y0 + i * 62); }); return y0 + l.length * 62;
      };
      x.textAlign = 'center'; x.fillStyle = '#8fb4ff'; x.font = '600 30px system-ui,sans-serif'; x.fillText('ENGLISH', 640, 120);
      var y = parte(en, '700 50px system-ui,sans-serif', 190, '#ffffff', 4);
      x.fillStyle = '#ff9a8c'; x.font = '600 30px system-ui,sans-serif'; x.fillText('ESPAÑOL', 640, y + 40);
      parte(es, '400 44px system-ui,sans-serif', y + 105, '#e8ecf5', 4);
      return cv.toDataURL('image/jpeg', 0.74);
    } catch (e) { return null; }
  }
  function lecciones(D, res) {
    var C = res && res.C; if (!C || !activo(C) || !D || !D.modulos) return 0;
    if (window.EU_VOZ_BILINGUE) { try { D.bil = EU_VOZ_BILINGUE.fuente(C); } catch (e) { } }
    var n = 0, sub = function (s) { try { return ED.sub(String(s || ''), C); } catch (e) { return String(s || ''); } };
    D.modulos.forEach(function (M) {
      var pg = res.pages.filter(function (p) { return p.u && p.u.id === M.id; })[0]; if (!pg) return;
      var u = pg.u, Dt = datos(u); if (!Dt.v.length || M.lecciones.some(function (l) { return l.id === M.id + '__bil'; })) return;
      var esc1 = Dt.v.map(function (v, k) {
        var id = 'bil_' + u.id + '_' + k, img = tarjeta(v[0], v[1], v[2]); if (img) D.img[id] = img;
        return { tipo: 'idea', id: img ? id : null, t: 'Escucha y repite', texto: 'In English: ' + v[0] + '. En español: ' + v[1] + '. Repite conmigo: ' + v[0] + '.', rot: [v[0], v[1]] };
      });
      Dt.fr.forEach(function (f, k) { if (!f[1]) return; var id = 'bilf_' + u.id + '_' + k, img = tarjetaFrase(f[0], f[1]); if (img) D.img[id] = img; esc1.push({ tipo: 'idea', id: img ? id : null, t: 'Frases · Sentences', texto: f[0] + ' — En español: ' + f[1], rot: [] }); });
      M.lecciones.push({ id: M.id + '__bil', t: 'Escucha y repite · ' + sub(u.t), pag: pg.num, video: 1, escenas: esc1 });
      var qs = Dt.v.slice(0, 6).map(function (v, k) {
        var otros = Dt.v.filter(function (w) { return w !== v; }).map(function (w) { return w[0]; }).slice(k % 3, k % 3 + 3);
        var o = otros.concat([v[0]]).slice(-4), c = o.length - 1, rot = (k * 3) % o.length, oo = o.slice(rot).concat(o.slice(0, rot)); c = oo.indexOf(v[0]);
        return { tipo: 'pregunta', id: null, t: '¿Cómo se dice?', texto: '¿Cómo se dice «' + v[1] + '» en inglés?', rot: [], q: { e: '¿Cómo se dice «' + v[1] + '» en inglés?', o: oo, c: c }, sol: 'Se dice: ' + v[0] + '.' };
      });
      if (qs.length >= 3) M.lecciones.push({ id: M.id + '__bil_q', t: '¿Cómo se dice? · ' + sub(u.t), pag: pg.num, video: 0, escenas: qs });
      n++;
    });
    return n;
  }
  var CA = window.EU_CURSO_ANIM;
  if (CA && CA.enriquecer && !CA.enriquecer._bilingue) {
    var enr = CA.enriquecer;
    CA.enriquecer = function (D, res) {
      return Promise.resolve(enr.apply(this, arguments)).then(function (D2) { var R = D2 || D; try { lecciones(R, res); } catch (e) { console.warn('Inglés bilingüe · curso', e); } return R; });
    };
    CA.enriquecer._bilingue = 1;
  }
  window.EU_INGLES_BILINGUE = { datos: datos, colocar: colocar, lecciones: lecciones };
})();
