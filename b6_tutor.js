/* b6_tutor.js — modo tutor en libro y curso (window.EU_TUTOR). Todas las materias, desde 10 páginas.
   1 · Libro: la página «Repaso» de cada unidad pasa a ser «Repaso con tu tutor» (página `tutor`, en el mismo sitio,
       sin añadir hojas): esquema del motor de láminas (EU_ESCANER.lamina) + maniquí con sus instrumentos
       (Peluquería: escena «ángulos» de EU_DIAGRAMA del corte de la unidad) o una segunda lámina de la misma unidad
       (palabras clave / ideas; así nunca entra un dibujo de otro tema), pasos numerados con autoevaluación (ideas de la unidad), ejemplo resuelto
       (generador de la unidad, con su proceso), «Practica con tu tutor» (preguntas de la unidad: en web, pista y
       respuesta con su porqué al tocar; en impreso, las respuestas al pie) y «Lo esencial» (palabras clave).
       Todo sale de los datos de la unidad; lo que no existe no se pone. Se mide al armar: si no cabe, se quitan
       partes opcionales hasta que cabe. `cfg.acab.tutor = 'no'` lo apaga (el libro sale como antes).
   2 · Curso premium (envuelve EU_CURSO_ANIM.enriquecer): al final de cada módulo, lecciones «Ejemplo resuelto»,
       «Practica con tu tutor» (pregunta → pista → respuesta correcta → porqué) y «Conclusión», con los mismos datos.
   Cargar después de b6_libro_escaner.js. */
(function () {
  'use strict';
  var ED = window.EU_EDITORIAL; if (!ED || window.EU_TUTOR) return;
  var H = ED.H, MM = 96 / 25.4;
  function es(s) { return H.esc(String(s == null ? '' : s)); }
  function sub(s, C) { try { return ED.sub(String(s || ''), C); } catch (e) { return String(s || ''); } }
  function txt(s) { return H.limpio(s); }
  function pal(t) { return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split(/[^a-z0-9ñ]+/).filter(function (w) { return w.length > 3; }); }
  function respuesta(x) { return x.tipo === 'mc' ? (x.o || [])[x.c] : x.tipo === 'vf' ? (x.s === 'V' || x.s === true ? 'Verdadero' : 'Falso') : x.s; }
  /* la idea de la unidad que más palabras comparte con la pregunta: es la pista (sin inventar) */
  function ideaDe(u, s, C) {
    var w = pal(s), mejor = null, pm = -1;
    (u.i || []).forEach(function (t) { var p = 0; pal(t).forEach(function (x) { if (w.indexOf(x) >= 0) p++; }); if (p > pm) { pm = p; mejor = t; } });
    return pm > 0 ? sub(mejor, C) : '';
  }

  /* la pista nunca lleva la respuesta (se deja en blanco) ni repite la pregunta */
  function pista(idea, sol, preg) {
    if (!idea) return '';
    var r = String(sol || '').trim(), p = idea;
    if (r.length > 1 && !/^(verdadero|falso)$/i.test(r)) p = p.replace(new RegExp(r.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '____');
    var w = pal(p), q = pal(preg), c = w.filter(function (x) { return q.indexOf(x) >= 0; }).length;
    return w.length && c / w.length > 0.7 ? '' : p;
  }

  /* ─── datos de la página (se calculan al armar y se guardan en pg.tut) ─── */
  function preparar(pg, res, vistos) {
    var C = res.C, u = pg.u, r = H.rng(H.hash(u.id + ':tutor') + (C.semilla || 1) * 31), t = { lam: 0, nivel: 0 };
    /* lámina: una variante del esquema que la unidad aún no tenga como página */
    var ya = {}; res.pages.forEach(function (p) { if (p.u && p.u.id === u.id && p.tipo === 'esc_lamina') ya[p.lam || 0] = 1; });
    t.lams = [0, 1, 2].filter(function (l) { return !ya[l]; }).slice(0, 2); t.lam = t.lams.length ? t.lams[0] : 0;
    /* ejemplo resuelto: del generador de la unidad, con su respuesta (y su proceso si lo trae) */
    var ej = []; try { ej = H.ejercicios(u, C, r, 12) || []; } catch (e) { }
    ej = ej.filter(function (x) { return x && x.e && x.s != null && x.s !== '' && !vistos[txt(x.e)] && x.tipo !== 'dibujo'; });
    ej.sort(function (a, b) { return (b.x ? 1 : 0) - (a.x ? 1 : 0); });
    if (ej[0]) { t.ej = { e: ej[0].e, s: String(respuesta(ej[0])), x: ej[0].x || '' }; vistos[txt(ej[0].e)] = 1; }
    /* práctica: preguntas autocorregibles de la unidad que no salgan ya en el libro */
    var q = []; try { q = ED.quiz(res, u.id, 8, (C.semilla || 1) + 7).items || []; } catch (e) { }
    t.items = q.filter(function (x) { var k = txt(x.e); if (vistos[k] || respuesta(x) == null) return false; vistos[k] = 1; return true; }).slice(0, 3).map(function (x) {
      var s = String(respuesta(x)), idea = ideaDe(u, txt(x.e) + ' ' + s, C);
      return { tipo: x.tipo, e: x.e, o: x.o, c: x.c, s: x.s, sol: s, pista: pista(idea, s, txt(x.e)), porque: x.x ? txt(x.x) : idea ? 'Lo explica esta idea de la unidad: ' + idea : '' };
    });
    /* maniquí (Peluquería, unidades de corte): el corte de la unidad con sus instrumentos. En las demás unidades la
       segunda figura es otra lámina de la misma unidad (nunca un dibujo de otro tema). */
    var cor = null; res.pages.some(function (p) { if (!p.u || p.u.id !== u.id) return false; if (p.corte) cor = { k: 'corte', corte: p.corte, cab: p.cab }; else if (p.dg && p.dg.k === 'corte') cor = p.dg; return !!cor; });
    if (cor && window.EU_DIAGRAMA && window.EU_PELU_LIBRO_DG) t.dg = { k: 'corte', corte: cor.corte, cab: cor.cab };
    return t;
  }
  /* fotograma del maniquí: la escena «ángulos» (transportador, escuadra/cartabón, regla en cm), que no sale en otras páginas */
  var FOTO = {};
  function fotoManiqui(dg) {
    var k = dg.corte + '|' + (dg.cab || ''); if (FOTO[k] !== undefined) return FOTO[k];
    var d = null; try { d = window.EU_PELU_LIBRO_DG.datos(dg); } catch (e) { }
    if (!d || !d.E) return '';   /* el motor 3D aún no está listo: no se guarda, se reintenta al volver a armar */
    var e = d.E.escenas.filter(function (x) { return x.tipo === 'angulos'; })[0], f = '';
    try { f = e ? window.EU_DIAGRAMA.foto(e, 560, 0.8) : ''; } catch (er) { }
    return (FOTO[k] = f ? { src: f, t: e.titulo || e.t || 'Ángulos y centímetros' } : '');
  }

  /* ─── la página ─── */
  function pagina(pg, C, modo) {
    var T = C.T, u = pg.u, t = pg.tut || {}, web = modo === 'web', alto = Math.round((C.papel.h - 46) * 0.24), sol = [];
    var medir = !!pg._medir, lam = medir ? '' : (window.EU_ESCANER ? window.EU_ESCANER.lamina({ u: u, lam: t.lam }, C) : '');
    var figs = [], conLam = t.nivel < 4;
    if (conLam) figs.push('<img ' + (lam ? 'src="' + lam + '" ' : '') + 'alt="Esquema de la unidad" style="height:' + alto + 'mm;width:auto;max-width:100%;object-fit:contain;display:block;border-radius:' + T.r + 'px">');
    if (t.nivel < 3 && t.dg) {
      var fm = medir ? { src: '', t: '' } : fotoManiqui(t.dg);
      if (fm) figs.push('<figure style="margin:0;text-align:center"><img ' + (fm.src ? 'src="' + fm.src + '" ' : '') + 'alt="Maniquí" style="height:' + (alto - 6) + 'mm;width:auto;max-width:100%;display:block;border-radius:' + T.r + 'px"><figcaption style="font-size:.7em;opacity:.8;margin-top:1mm">Maniquí · ' + es(fm.t || 'ángulos y centímetros') + '</figcaption></figure>');
    } else if (t.nivel < 3 && t.lams && t.lams[1] != null) {
      var l2 = medir ? '' : (window.EU_ESCANER ? window.EU_ESCANER.lamina({ u: u, lam: t.lams[1] }, C) : '');
      if (medir || l2) figs.push('<img ' + (l2 ? 'src="' + l2 + '" ' : '') + 'alt="Esquema de la unidad" style="height:' + alto + 'mm;width:auto;max-width:100%;object-fit:contain;display:block;border-radius:' + T.r + 'px">');
    }
    var cajas = figs.length ? '<div style="display:flex;gap:4mm;justify-content:center;align-items:flex-start;margin:0 0 2mm">' + figs.join('') + '</div>' : '';
    /* pasos numerados + autoevaluación en la misma fila */
    var niv = C.adulto ? ['Lo domino', 'Casi', 'Repasar'] : ['Lo sé', 'Casi', 'Ayuda'], circ = '<span style="display:inline-block;width:3.6mm;height:3.6mm;border:1px solid ' + T.ink + ';border-radius:50%"></span>';
    var ideas = (u.i || []).slice(0, t.nivel < 2 ? 4 : 3);
    var pasos = ideas.length ? H.h2(C, 'Paso a paso') + '<div style="display:grid;grid-template-columns:1fr repeat(3,12mm);gap:1mm 1.5mm;align-items:center;font-size:.86em"><span></span>' + niv.map(function (n) { return '<span style="font-size:.75em;text-align:center;color:' + T.acc + '">' + n + '</span>'; }).join('') +
      ideas.map(function (s, k) { return '<div><b style="color:' + T.acc + '">' + (k + 1) + '.</b> ' + es(sub(s, C)) + '</div>' + [0, 1, 2].map(function () { return '<span style="text-align:center">' + circ + '</span>'; }).join(''); }).join('') + '</div>' : '';
    var ej = t.ej && t.nivel < 5 ? H.h2(C, 'Ejemplo resuelto') + '<div style="background:' + T.soft + ';border-radius:' + T.r + 'px;padding:2mm 3.5mm;font-size:.88em">' + sub(t.ej.e, C) +
      '<div style="margin-top:1mm;color:' + T.acc2 + ';font-weight:700">→ ' + es(t.ej.s) + '</div>' + (t.ej.x ? '<div style="font-size:.9em;opacity:.85">Por qué: ' + es(t.ej.x) + '</div>' : '') + '</div>' : '';
    var its = (t.items || []).slice(0, t.nivel < 1 ? 3 : 2), prac = '';
    if (its.length) {
      prac = H.h2(C, 'Practica con tu tutor') + its.map(function (x, i) {
        var g = 'tu' + pg.num + '_' + i, ops = '';
        if (x.tipo === 'mc' || x.tipo === 'vf') {
          var o = x.tipo === 'vf' ? ['Verdadero', 'Falso'] : (x.o || []);
          ops = '<div style="display:flex;flex-wrap:wrap;gap:1mm 4mm;margin-top:.8mm">' + o.map(function (s, k) {
            return web ? '<label style="display:inline-flex;gap:1.5mm;align-items:center"><input type="radio" name="' + g + '">' + es(s) + '</label>' : '<span><span style="display:inline-block;width:3.4mm;height:3.4mm;border:1px solid ' + T.ink + ';border-radius:50%;vertical-align:-.5mm"></span> ' + (x.tipo === 'vf' ? s : 'abc'.charAt(k) + ') ' + es(s)) + '</span>';
          }).join('') + '</div>';
        } else ops = web ? '<input style="font:inherit;padding:.6mm 2mm;border:1px solid ' + T.ink + ';border-radius:4px;width:50%;margin-top:.8mm" aria-label="Respuesta">' : '<div style="height:' + (C.fs * 1.4) + 'px;border-bottom:1px solid ' + T.ink + ';opacity:.4;width:60%"></div>';
        var pop = 'position:absolute;z-index:3;left:0;right:0;top:100%;background:#fff;border:1px solid ' + T.acc + ';border-radius:6px;padding:2mm 3mm;box-shadow:0 3px 10px rgba(0,0,0,.18);font-size:.95em';
        var ayuda = web ? '<div style="display:flex;gap:3mm;margin-top:.8mm;font-size:.85em">' + (x.pista ? '<details style="position:relative"><summary style="cursor:pointer;color:' + T.acc2 + '">💡 Pista</summary><div style="' + pop + '">' + es(x.pista) + '</div></details>' : '') +
          '<details style="position:relative"><summary style="cursor:pointer;color:' + T.acc + '">✅ Respuesta y por qué</summary><div style="' + pop + '"><b>' + es(x.sol) + '</b>' + (x.porque ? '<br>' + es(x.porque) : '') + '</div></details></div>' : '';
        sol.push((i + 1) + ') ' + x.sol + (x.porque && t.nivel < 3 ? ' — ' + x.porque : ''));
        return '<div style="margin:0 0 2mm;font-size:.88em;position:relative"><b style="color:' + T.acc + '">' + (i + 1) + '.</b> ' + x.e + ops + ayuda + '</div>';
      }).join('');
    }
    var esencial = (u.k || []).length ? H.h2(C, 'Lo esencial') + '<div style="display:flex;flex-wrap:wrap;gap:1.5mm">' + (u.k || []).slice(0, 8).map(function (k) { return '<span style="border:1px solid ' + T.acc + ';color:' + T.acc + ';border-radius:' + (T.r ? 99 : 0) + 'px;padding:.3mm 2.5mm;font-size:.82em">' + es(sub(k, C)) + '</span>'; }).join('') + '</div>' : '';
    var pie = !web && sol.length ? '<div style="position:absolute;left:17mm;right:17mm;bottom:14mm;font-size:.72em;line-height:1.35;border-top:1px solid ' + T.soft + ';padding-top:1mm;opacity:.9"><b>Respuestas del tutor:</b> ' + es(sol.join(' · ')) + '</div>' : '';
    var intro = '<div style="display:flex;gap:2.5mm;align-items:center;margin:-2mm 0 2.5mm;font-size:.86em">' + H.avatar(C, 9) + '<span><b style="color:' + T.acc2 + '">' + es(C.guia.n) + ':</b> ' + es(C.adulto ? 'Repasamos juntos: esquema, pasos, un ejemplo resuelto y práctica con su respuesta.' : 'Vamos a repasar juntos: mira el esquema, sigue los pasos, resuelve conmigo y comprueba.') + '</span></div>';
    return H.cabecera(C, pg) + H.h1(C, 'Repaso con tu tutor', 'margin-bottom:3mm') + '<div data-tutor="1">' + intro + cajas + pasos + ej + prac + esencial + '</div>' + pie + H.folio(C, pg);
  }
  function voz(pg, C) {
    var u = pg.u, t = pg.tut || {};
    return 'Repaso con tu tutor. ' + (u.i || []).slice(0, 4).map(function (s, k) { return 'Paso ' + (k + 1) + ': ' + sub(s, C); }).join(' ') + (t.ej ? ' Ejemplo resuelto: ' + txt(t.ej.e) + ' La respuesta es ' + t.ej.s + '.' : '') + ' Lo esencial: ' + (u.k || []).map(function (k) { return sub(k, C); }).join(', ') + '.';
  }
  ED.registrar({
    paginas: { tutor: pagina }, voz: { tutor: voz },
    escenas: { tutor: function (pg, C) { var u = pg.u; return u ? { k: 'lista', t: 'Repaso · ' + sub(u.t, C), l: (u.k || []).map(function (x) { return sub(x, C); }) } : null; } },
    /* la presentación del libro describe el quinto momento tal como es ahora */
    post: function (h, pg) { return pg.tipo === 'presentacion' && pg._tutor ? h.replace(/<b>Repaso<\/b>: [^<]*/, '<b>Repaso con tu tutor</b>: esquema, pasos, ejemplo resuelto, práctica con sus respuestas y lo esencial.') : h; }
  });

  /* ─── al armar: repaso → tutor, y medir para que nunca desborde ─── */
  var caja = null;
  function cabe(pg, res) {
    var C = res.C; if (!document.body) return true;
    if (!caja) { caja = document.createElement('div'); caja.style.cssText = 'position:absolute;left:-99999px;top:0;visibility:hidden;pointer-events:none'; }
    if (!caja.parentNode) document.body.appendChild(caja);
    var ok = true; pg._medir = 1;
    try {
      ['print', 'web'].forEach(function (m) {
        if (!ok) return;
        caja.innerHTML = ED.paginaHTML(pg, C, m, res);
        var p = caja.firstChild, b = p.querySelector('[data-tutor]'); if (!b) return;
        var lim = p.getBoundingClientRect().top + (C.papel.h - 15) * MM, pie = p.querySelector('div[style*="bottom:14mm"]');
        if (pie) lim = Math.min(lim, pie.getBoundingClientRect().top - 1.5 * MM);
        if (b.getBoundingClientRect().bottom > lim) ok = false;
      });
    } catch (e) { ok = true; } finally { delete pg._medir; caja.innerHTML = ''; }
    return ok;
  }
  function aplicar(res, cfg) {
    var C = res && res.C; if (!C || !res.pages || ((cfg && cfg.acab) || {}).tutor === 'no' || C.papelId === 'slide') return res;
    var vistos = {}, hay = false;
    res.pages.forEach(function (p) { (p.items || []).forEach(function (x) { if (x && x.e) vistos[txt(x.e)] = 1; }); });
    res.pages.forEach(function (p, i) {
      if (p.tipo !== 'repaso' || !p.u) return;
      var n = { tipo: 'tutor', u: p.u, n: p.n, num: p.num, fill2: { nada: 1 } };
      try { n.tut = preparar(n, res, vistos); } catch (e) { console.warn('Tutor', e); return; }
      while (n.tut.nivel < 6 && !cabe(n, res)) n.tut.nivel++;
      res.pages[i] = n; hay = true;
    });
    if (hay) res.pages.forEach(function (p) { if (p.tipo === 'presentacion') p._tutor = 1; });
    return res;
  }
  function enganchar() {
    if (ED.__tutor) return; ED.__tutor = 1;
    var ens = ED.ensamblar;
    ED.ensamblar = function (cfg) { var r = ens.apply(this, arguments); try { aplicar(r, cfg); } catch (e) { console.warn('Tutor', e); } return r; };
  }
  /* después del escáner, que a su vez espera a los módulos que se enganchan al terminar la carga */
  (function esperar(n) { if (ED.__escaner || !window.EU_ESCANER || n > 60) enganchar(); else setTimeout(function () { esperar(n + 1); }, 300); })(0);

  /* ─── curso premium: lecciones del tutor al final de cada módulo ─── */
  function lecciones(D, res) {
    var C = res.C, n = 0;
    D.modulos.forEach(function (M) {
      var pg = res.pages.filter(function (p) { return p.tipo === 'tutor' && p.u && p.u.id === M.id; })[0]; if (!pg || !pg.tut) return;
      var u = pg.u, t = pg.tut, id = null;
      if (window.EU_ESCANER) { var src = window.EU_ESCANER.lamina({ u: u, lam: t.lam }, C); if (src) { id = 'tutor_' + u.id; D.img[id] = src; } }
      var titulo = txt(sub(u.t, C)), L = [];
      if (t.ej) L.push({ id: u.id + '__tutor_ej', t: 'Ejemplo resuelto · ' + titulo, pag: pg.num, video: 0, escenas: [
        { tipo: 'idea', id: id, t: 'Ejemplo resuelto', texto: 'Resolvemos juntos. ' + txt(sub(t.ej.e, C)), rot: [] },
        { tipo: 'idea', id: id, t: 'Solución', texto: 'La respuesta es: ' + txt(t.ej.s) + '.' + (t.ej.x ? ' Por qué: ' + txt(t.ej.x) : ''), rot: [] }] });
      var esc = (t.items || []).map(function (x) {
        var e = txt(sub(x.e, C)), pista = x.pista ? ' Pista: ' + x.pista : '', sol = 'La respuesta correcta es: ' + txt(x.sol) + '.' + (x.porque ? ' ' + x.porque : '');
        if (x.tipo === 'mc' || x.tipo === 'vf') {
          var o = x.tipo === 'vf' ? ['Verdadero', 'Falso'] : (x.o || []).map(txt), c = x.tipo === 'vf' ? (x.sol === 'Verdadero' ? 0 : 1) : x.c;
          return { tipo: 'pregunta', id: id, t: 'Practica con tu tutor', texto: 'Piensa: ' + e + pista, rot: [], q: { e: e, o: o, c: c }, sol: sol };
        }
        return { tipo: 'idea', id: id, t: 'Practica con tu tutor', texto: 'Piensa: ' + e + pista + ' … ' + sol, rot: [] };
      });
      if (esc.length) L.push({ id: u.id + '__tutor_pr', t: 'Practica con tu tutor · ' + titulo, pag: pg.num, video: 0, escenas: esc });
      var ks = (u.k || []).map(function (k) { return txt(sub(k, C)); }).filter(Boolean);
      if (ks.length || (u.i || []).length) L.push({ id: u.id + '__tutor_fin', t: 'Conclusión · ' + titulo, pag: pg.num, video: 0, escenas: [
        { tipo: 'idea', id: id, t: 'Conclusión', texto: (u.i || []).slice(0, 4).map(function (s, k) { return 'Paso ' + (k + 1) + ': ' + txt(sub(s, C)); }).join(' '), rot: ks.slice(0, 4) },
        { tipo: 'idea', id: id, t: 'Lo esencial', texto: 'Lo esencial de «' + titulo + '»: ' + ks.join(', ') + '.', rot: ks.slice(0, 4) }] });
      L.forEach(function (x) { M.lecciones.push(x); n++; });
    });
    return n;
  }
  var CA = window.EU_CURSO_ANIM;
  if (CA && CA.enriquecer) {
    var enr = CA.enriquecer;
    CA.enriquecer = function (D, res, aviso) { try { lecciones(D, res); } catch (e) { console.warn('Tutor · curso', e); } return enr.apply(this, arguments); };
  }

  window.EU_TUTOR = { aplicar: aplicar, pagina: pagina, lecciones: lecciones, preparar: preparar };
})();
