/* b6_enciclopedia.js — estructura enciclopédica del libro (window.EU_ENCICLOPEDIA). Todas las materias y etapas.
   · Apertura de cada unidad con ficha de identificación (código U01…, etapa y curso, parte del libro, referente
     curricular del país) e «Introducción» (texto del banco de la materia, b6_texto_<materia>.js; si no hay banco,
     se mantiene «En esta unidad vas a…» con las ideas de la unidad).
   · Páginas nuevas, sin añadir hojas (sustituyen «Mis apuntes», actividades de relleno y lecturas sobrantes de la
     unidad, y la página «Cerca de ti» cuando el banco trae ejemplos):
       enc_desarrollo — apartados explicados, cada uno con su dibujo de la biblioteca SVG de la misma materia
                        (o la referencia a la página donde ya está, para no repetirlo);
       enc_ejemplos   — ejemplos resueltos con pasos, respuesta y porqué (animados en el libro interactivo por
                        b6_ejemplos_animados.js) y errores frecuentes;
       enc_conclusion — «Para terminar»: conclusión, lo aprendido, vocabulario, «¿Sabías que…?» y preguntas.
   · Índice: debajo de cada unidad, sus apartados (si caben en las páginas de índice que ya tiene el libro).
   · Presentación: describe las partes reales de cada unidad.
   Cada página se mide al armar: si no cabe, se quitan partes opcionales. Solo libro y eBook (no cuaderno ni 16:9).
   `cfg.acab.enciclopedia = 'no'` lo apaga. Se engancha después del tutor. */
(function () {
  'use strict';
  var ED = window.EU_EDITORIAL; if (!ED || window.EU_ENCICLOPEDIA) return;
  var H = ED.H, MM = 96 / 25.4, PRODS = /^(libro|ebook)$/;
  function es(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function T(s, C) { s = String(s == null ? '' : s).replace(/\{\$(-?[\d.]+)\}/g, function (m, n) { try { return H.din(+n, C); } catch (e) { return n; } }); try { return ED.sub(s, C); } catch (e) { return s; } }
  function TE(s, C) { return es(T(s, C)); }
  function activo(C) { return C && ((C.cfg && C.cfg.acab) || {}).enciclopedia !== 'no' && PRODS.test((C.prod && C.prod.id) || '') && C.papelId !== 'slide'; }
  function banco(C, u) {
    var B = window.EU_TEXTO_BANCO || {}; if (!u) return null;
    if (B[C.mat] && B[C.mat][u.id]) return B[C.mat][u.id];
    for (var k in B) if (B[k] && B[k][u.id]) return B[k][u.id];
    /* (10-10-2026) materias sin banco escrito: banco armado con lo que ya tiene el sistema (b6_texto_auto.js) */
    if (window.EU_TEXTO_AUTO) { try { return EU_TEXTO_AUTO.banco(C, u); } catch (e) { return null; } }
    return null;
  }
  function parte(C, u) { var B = window.EU_TEXTO_BANCO || {}; for (var k in B) { var P = B[k] && B[k]._partes; if (P && P[u.id]) return P[u.id]; } return ''; }
  function dos(n) { return (n < 10 ? '0' : '') + n; }
  function kicker(C, t) { return '<div style="font-size:.74em;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:' + C.T.acc + ';margin:0 0 1.5mm">' + t + '</div>'; }
  function romano(n) { return ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][n] || String(n); }

  /* ─── apertura: ficha de la unidad + introducción ─── */
  function ficha(pg, C) {
    var T0 = C.T, u = pg.u, par = pg.encPar ? 'Parte ' + romano(pg.encPar[0]) + ' · ' + pg.encPar[1] : '';
    var cel = function (a, b) { return '<div style="padding:1.2mm 2.5mm;border-left:0.6mm solid ' + T0.acc + ';background:' + T0.soft + '"><div style="font-size:.78em;opacity:.75;text-transform:uppercase;letter-spacing:.08em">' + a + '</div><div style="font-weight:600">' + b + '</div></div>'; };
    return '<div data-enc-ficha="1" style="display:grid;grid-template-columns:repeat(' + (par ? 4 : 3) + ',minmax(0,1fr));gap:2mm;margin:-2mm 0 3mm;font-size:.72em;line-height:1.3">' +
      cel('Código', 'U' + dos(pg.n) + ' · ' + es(u.id.replace(/_/g, '-').toUpperCase().slice(0, 18))) +
      cel('Etapa', es((C.N && C.N.n) || '') + (C.libre ? '' : ' · ' + es(C.cursoN || ''))) +
      (par ? cel('Parte', es(par)) : '') +
      cel('Referente', es(C.libre ? (C.P.id === 'us' ? 'Estados Unidos' : C.P.n) : (C.P.marcoCorto || C.P.n))) + '</div>';
  }
  function postApertura(h, pg, C) {
    if (pg.mini || !pg.encA) return h;
    var b = banco(C, pg.u), lv = pg.encA - 1;
    var i1 = h.indexOf('</h1>'); if (i1 > 0) h = h.slice(0, i1 + 5) + ficha(pg, C) + h.slice(i1 + 5);
    if (b && b.intro) {
      var alto = [50, 40, 30, 0][Math.min(3, lv)];
      h = h.replace(/height:70mm/g, 'height:' + alto + 'mm');
      if (!alto) h = h.replace(/<div style="height:0mm[\s\S]*?<\/div><\/div>|<img [^>]*height:0mm[^>]*>|<div style="height:0mm[^"]*">[^<]*<\/div>/, '');
      var a = h.indexOf('En esta unidad vas a…</h2>');
      if (a > 0) {
        var a0 = h.lastIndexOf('<h2', a), z = h.indexOf('<div style="position:absolute;left:17mm;right:17mm;bottom:15mm;', a);
        if (z < 0) z = h.indexOf('<div style="position:absolute', a);
        if (a0 > 0 && z > a) {
          var ideas = (pg.u.i || []).slice(0, lv >= 2 ? 2 : 3).map(function (s) { return '<div style="margin:0 0 1.2mm">✓ ' + TE(s, C) + '</div>'; }).join('');
          h = h.slice(0, a0) + H.h2(C, 'Introducción') + '<p style="margin:0 0 2mm;line-height:1.5">' + TE(b.intro, C) + '</p>' + H.h2(C, 'Al terminar sabrás') + ideas + h.slice(z);
        }
      }
    } else if (lv) h = h.replace(/height:70mm/g, 'height:' + [70, 58, 46, 36][Math.min(3, lv)] + 'mm');
    return h;
  }

  /* ─── dibujo de la biblioteca de un apartado (o su referencia si ya está en otra página) ─── */
  function figura(id, C, donde, alto) {
    var MO = window.EU_MODELOS, m = MO && MO.modelo(id); if (!m) return '';
    if (donde) return '<div style="font-size:.78em;opacity:.85;border-left:0.6mm solid ' + C.T.acc + ';padding:1mm 2.5mm;margin-top:1mm">Lámina «' + es(m.n) + '», pág. ' + donde + '</div>';
    var s = ''; try { s = MO.svg(id, ((C.cfg && C.cfg.acab) || {}).dibujo === '2d' ? 'color' : '3d') || ''; } catch (e) { s = ''; }
    if (!s) return '';
    return '<figure style="margin:0;text-align:center"><div style="height:' + alto + 'mm">' + s.replace('<svg', '<svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet"') + '</div><figcaption style="font-size:.68em;opacity:.8;margin-top:.8mm">' + es(m.n) + '</figcaption></figure>';
  }

  /* ─── páginas ─── */
  function cab(pg, C, tipo, titulo) { return H.cabecera(C, pg) + kicker(C, 'Unidad ' + pg.n + ' · ' + tipo + (pg.encPar ? ' · Parte ' + romano(pg.encPar[0]) : '')) + H.h1(C, titulo, 'margin-bottom:3mm'); }
  function desarrollo(pg, C, modo, ctx) {
    var b = banco(C, pg.u) || {}, L = (b.des || []).slice(pg.d0, pg.d1), lv = pg.encL || 0, alto = [44, 36, 0][Math.min(2, lv)];
    var cuerpo = L.map(function (d, i) {
      var f = alto ? figura(d[2], C, (pg.figRef || {})[d[2]], alto) : '', num = pg.n + '.' + (pg.d0 + i + 1);
      var m = window.EU_MODELOS && window.EU_MODELOS.modelo(d[2]), pq = m && m.porque && lv < 2 ? '<div style="margin-top:1.5mm;font-size:.86em;padding-left:2.5mm;border-left:0.6mm solid ' + C.T.acc2 + '"><b>Por qué funciona.</b> ' + es(m.porque) + '</div>' : '';
      var txt = '<div><p style="margin:0;line-height:1.55">' + TE(d[1], C) + '</p>' + pq + '</div>';
      return '<section style="margin:0 0 2.5mm;break-inside:avoid">' + H.h2(C, num + ' ' + TE(d[0], C)) +
        (f && f.indexOf('<figure') === 0 ? '<div style="display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:4mm;align-items:start">' + txt + f + '</div>' : txt + f) + '</section>';
    }).join('');
    var cur = pg.cur && b.cur && lv < 3 ? '<div style="margin-top:2mm;padding:2.5mm 4mm;border-radius:' + C.T.r + 'px;background:' + C.T.soft2 + ';font-size:.9em"><b style="color:' + C.T.acc2 + '">¿Sabías que…?</b> ' + TE(b.cur.replace(/^¿Sabías que\s*/i, ''), C) + '</div>' : '';
    return cab(pg, C, 'Desarrollo', pg.d0 ? 'Desarrollo (continuación)' : TE(pg.u.t, C)) + '<div data-enc="1">' + cuerpo + cur + '</div>' + H.folio(C, pg);
  }
  function ejemplos(pg, C, modo) {
    var b = banco(C, pg.u) || {}, L = (b.ej || []).slice(pg.e0, pg.e1), web = modo === 'web', lv = pg.encL || 0;
    var cuerpo = L.map(function (x, i) {
      var k = pg.e0 + i + 1, pasos = x.pasos || [];
      var datos = web ? '<script type="application/json" data-ej-anim="1">' + JSON.stringify({ t: 'Ejemplo ' + k, e: T(x.e, C), p: pasos.map(function (s) { return T(s, C); }), s: T(x.s, C), x: T(x.x, C) }).replace(/</g, '\\u003c') + '<\/script>' : '';
      return '<div data-ej="' + k + '" style="border:0.3mm solid ' + C.T.soft + ';border-radius:' + C.T.r + 'px;padding:2.5mm 4mm;margin:0 0 3mm;break-inside:avoid">' +
        '<div style="display:flex;gap:3mm;align-items:baseline"><b style="color:' + C.T.acc + ';white-space:nowrap">Ejemplo ' + k + '</b><span style="flex:1">' + TE(x.e, C) + '</span></div>' +
        (pasos.length ? '<ol style="margin:1.5mm 0 1mm;padding-left:6mm;font-size:.92em;line-height:1.45">' + pasos.map(function (s) { return '<li>' + TE(s, C) + '</li>'; }).join('') + '</ol>' : '') +
        '<div style="background:' + C.T.soft + ';border-radius:' + Math.min(C.T.r, 6) + 'px;padding:1.2mm 3mm;display:inline-block"><b>Respuesta:</b> <b style="color:' + C.T.acc2 + '">' + TE(x.s, C) + '</b></div>' +
        (x.x && lv < 2 ? '<div style="font-size:.88em;margin-top:1mm;opacity:.9"><b>Por qué:</b> ' + TE(x.x, C) + '</div>' : '') + datos + '</div>';
    }).join('');
    var err = pg.err && (b.err || []).length && lv < 3 ? H.h2(C, 'Errores frecuentes') + (b.err || []).map(function (e) { return '<div style="display:grid;grid-template-columns:1fr 1fr;gap:3mm;font-size:.88em;margin:0 0 1.5mm"><div>✗ ' + TE(e[0], C) + '</div><div style="color:' + C.T.acc2 + '">✓ ' + TE(e[1], C) + '</div></div>'; }).join('') : '';
    var ahora = pg.cerca && (pg.u.q || []).length && lv < 1 ? H.h2(C, 'Ahora tú') + '<p style="margin:0 0 1mm">' + TE(pg.u.q[0], C) + '</p>' + H.lineas(3, C) : '';
    return cab(pg, C, 'Ejemplos resueltos', pg.e0 ? 'Más ejemplos resueltos' : 'Así se resuelve') + '<div data-enc="1">' + cuerpo + err + ahora + '</div>' + H.folio(C, pg);
  }
  /* esquema-resumen de la conclusión con el motor de láminas (estructuras revisadas sin rótulos tapados) */
  var RES = ['pr_capas', 'pr_escalones', 'fc_tarjetas', 'fl_serpiente'], IMGR = {};
  function resumen(pg, C, web, medir) {
    var LM = window.LAMINAS_MOTOR, u = pg.u; if (!LM || !u) return '';
    var est = RES[(pg.n - 1) % RES.length], ideas = est === 'pr_capas';
    var nod = ideas ? (u.i || []).slice(0, 5).map(function (t) { return { t: T(t, C), d: '', nivel: 1 }; }) : (u.k || []).slice(0, 5).map(function (k, i) { return { t: T(k, C), d: T((u.i || [])[i] || '', C), nivel: 1 }; });
    if (nod.length < 3) return '';
    var pals = (LM.paletas() || []).filter(function (p) { return p.claro; }), lam = { titulo: T(u.t, C), subtitulo: 'Resumen de la unidad', estructura: est, paleta: pals.length ? pals[(pg.n + 2) % pals.length].id : undefined, nodos: [{ t: T(u.t, C), d: '', nivel: 0 }].concat(nod) };
    var attr = web ? 'data-lam="' + es(JSON.stringify(lam)) + '" ' : '';
    if (medir) return { src: '', attr: attr };
    var k = C.mat + '|' + u.id + '|' + est + '|' + C.T.acc;
    if (!IMGR[k]) { try { var cv = document.createElement('canvas'); cv.width = 1400; cv.height = 1000; LM.pintar(cv.getContext('2d'), 1400, 1000, lam, { prog: 1 }); IMGR[k] = cv.toDataURL('image/jpeg', 0.86); } catch (e) { IMGR[k] = ''; } }
    return IMGR[k] ? { src: IMGR[k], attr: attr } : '';
  }
  function conclusion(pg, C, modo) {
    var b = banco(C, pg.u) || {}, u = pg.u, lv = pg.encL || 0;
    var ideas = (u.i || []).map(function (s) { return '<li>' + TE(s, C) + '</li>'; }).join('');
    var voc = (b.voc || []).slice(0, lv ? 4 : 8).map(function (v) { return '<div style="margin:0 0 1.2mm"><b style="color:' + C.T.acc + '">' + TE(v[0], C) + ':</b> ' + TE(v[1], C) + '</div>'; }).join('');
    var cur = b.cur && !pg.curYa && lv < 2 ? '<div style="margin-top:3mm;padding:2.5mm 4mm;border-radius:' + C.T.r + 'px;background:' + C.T.soft2 + ';font-size:.9em"><b style="color:' + C.T.acc2 + '">¿Sabías que…?</b> ' + TE(b.cur.replace(/^¿Sabías que\s*/i, ''), C) + '</div>' : '';
    var q = (u.q || []).slice(0, 2);
    var piensa = q.length && lv < 3 ? H.h2(C, 'Para pensar') + q.map(function (s, i) { return '<div style="margin:0 0 1mm">' + (i + 1) + '. ' + TE(s, C) + '</div>'; }).join('') : '';
    var L = lv < 2 ? resumen(pg, C, modo === 'web', pg._medir) : '', alto = lv ? 52 : 70;
    var esq = L ? H.h2(C, 'Esquema de la unidad') + '<img ' + (L.src ? 'src="' + L.src + '" ' : '') + (L.attr || '') + 'alt="Esquema de la unidad" style="height:' + alto + 'mm;width:auto;max-width:100%;display:block;margin:0 auto;border-radius:' + C.T.r + 'px">' : '';
    return cab(pg, C, 'Conclusión', 'Para terminar') + '<div data-enc="1"><p style="margin:0 0 2mm;line-height:1.55;font-size:1.04em">' + TE(b.con || '', C) + '</p>' +
      H.h2(C, 'Lo que has aprendido') + '<ul style="margin:0;padding-left:5mm;line-height:1.5">' + ideas + '</ul>' + esq + (voc ? H.h2(C, 'Vocabulario') + voc : '') + cur + piensa + '</div>' + H.folio(C, pg);
  }
  function txtVoz(pg, C) {
    var b = banco(C, pg.u) || {}, s = '';
    if (pg.tipo === 'enc_desarrollo') s = (b.des || []).slice(pg.d0, pg.d1).map(function (d) { return d[0] + '. ' + d[1]; }).join(' ');
    else if (pg.tipo === 'enc_ejemplos') s = (b.ej || []).slice(pg.e0, pg.e1).map(function (x, i) { return 'Ejemplo ' + (pg.e0 + i + 1) + '. ' + x.e + ' ' + (x.pasos || []).join(' ') + ' Respuesta: ' + x.s + '. ' + (x.x || ''); }).join(' ');
    else if (pg.tipo === 'enc_conclusion') s = (b.con || '') + ' ' + (b.voc || []).map(function (v) { return v[0] + ': ' + v[1]; }).join(' ');
    return T(s, C);
  }
  ED.registrar({
    paginas: { enc_desarrollo: desarrollo, enc_ejemplos: ejemplos, enc_conclusion: conclusion },
    voz: { enc_desarrollo: txtVoz, enc_ejemplos: txtVoz, enc_conclusion: txtVoz },
    post: function (h, pg, C, modo, ctx) {
      if (!activo(C)) return h;
      if (pg.tipo === 'apertura') return postApertura(h, pg, C);
      if (pg.tipo === 'presentacion' && pg._enc) {
        var a = h.indexOf('Cada unidad tiene cinco momentos:'); if (a < 0) return h;
        var a0 = h.lastIndexOf('<p', a), z = h.indexOf('<h2', a); if (a0 < 0 || z < 0) return h;
        var L = ['<b>Ficha e introducción</b>: código, etapa, parte del libro y de qué trata la unidad.', '<b>Aprende</b>: las ideas clave, con un esquema.'];
        if (pg._enc.des) L.push('<b>Desarrollo</b>: cada idea explicada, con láminas de la biblioteca.');
        if (pg._enc.ej) L.push('<b>Ejemplos resueltos</b>: paso a paso, con la respuesta y el porqué (animados en el libro interactivo).');
        L.push('<b>Actividades</b>: para practicar, de lo sencillo a lo difícil.', '<b>Repaso con tu tutor</b>: esquema, pasos, práctica con sus respuestas y lo esencial.');
        if (pg._enc.con) L.push('<b>Conclusión</b>: lo aprendido, vocabulario y preguntas para pensar.');
        return h.slice(0, a0) + '<p style="margin:0 0 2mm">Cada unidad está organizada como una enciclopedia:</p>' + L.map(function (s) { return '<div style="margin:0 0 1.5mm 3mm">· ' + s + '</div>'; }).join('') + h.slice(z);
      }
      return h;
    }
  });

  /* ─── medir: el contenido no puede bajar del folio (ni de la burbuja de la guía en la apertura) ─── */
  var caja = null;
  function cabe(pg, res) {
    var C = res.C; if (!document.body) return true;
    if (!caja) { caja = document.createElement('div'); caja.style.cssText = 'position:absolute;left:-99999px;top:0;visibility:hidden;pointer-events:none'; }
    if (!caja.parentNode) document.body.appendChild(caja);
    var ok = true;
    try {
      ['print', 'web'].forEach(function (m) {
        if (!ok) return;
        pg._medir = 1; caja.innerHTML = ED.paginaHTML(pg, C, m, res); delete pg._medir;
        var p = caja.firstChild, top = p.getBoundingClientRect().top, lim = top + (C.papel.h - 17) * MM, max = 0;
        [].slice.call(p.children).forEach(function (e) {
          var cs = getComputedStyle(e);
          if (cs.position === 'absolute') { if (/bottom: ?15mm/.test(e.getAttribute('style') || '') || (e.style.bottom === '15mm')) lim = Math.min(lim, e.getBoundingClientRect().top - 1.5 * MM); return; }
          max = Math.max(max, e.getBoundingClientRect().bottom);
        });
        if (max > lim) ok = false;
      });
    } catch (e) { ok = true; } finally { caja.innerHTML = ''; }
    return ok;
  }

  /* ─── al armar ─── */
  function aplicar(res, cfg) {
    var C = res && res.C; if (!activo(C) || !res.pages) return res;
    var pages = res.pages, porU = {}, orden = [], uso = {}, MO = window.EU_MODELOS;
    /* dibujos de la biblioteca que ya están en el libro: como página propia o guardados dentro de otra página */
    if (MO) pages.forEach(function (p) {
      [p.gen, p.mod, typeof p.portMod === 'string' ? p.portMod : null].forEach(function (id) { if (id && MO.modelo(id) && !uso[id]) uso[id] = p.num; });
      var t = ''; try { t = JSON.stringify(p, function (k, v) { return k === 'u' || k === 'C' ? undefined : v; }); } catch (e) { }
      (t.match(/data-modelo=\\"[^\\"]+/g) || []).forEach(function (x) { var id = x.replace(/^data-modelo=\\"/, ''); if (!uso[id]) uso[id] = p.num; });
    });
    pages.forEach(function (p, i) { if (!p.u || !p.u.id) return; if (!porU[p.u.id]) { porU[p.u.id] = []; orden.push(p.u.id); } porU[p.u.id].push(i); });
    /* partes del libro, en el orden en que aparecen las unidades */
    var partes = [], parDe = {};
    orden.forEach(function (id) { var u = pages[porU[id][0]].u, p = parte(C, u); if (!p) return; if (partes.indexOf(p) < 0) partes.push(p); parDe[id] = [partes.indexOf(p) + 1, p]; });
    var resumen = { des: 0, ej: 0, con: 0 }, sols = pages.filter(function (p) { return p.tipo === 'solucion' && p.entradas; }), largo = pages.length >= 40;
    orden.forEach(function (id) {
      var idx = porU[id], u = pages[idx[0]].u, b = banco(C, u), par = parDe[id];
      idx.forEach(function (i) { var p = pages[i]; if (par) p.encPar = par; if (p.tipo === 'apertura' && !p.mini) { p.encA = 1; var lib = b && (b.des || []).filter(function (d) { return d[2] && !uso[d[2]]; })[0]; if (lib) { if (typeof p.portMod === 'string' && uso[p.portMod] === p.num) delete uso[p.portMod]; p.portMod = lib[2]; uso[lib[2]] = p.num; } } });
      if (!b) return;
      /* huecos de la unidad: «Mis apuntes», actividades de relleno, lecturas a partir de la segunda */
      var huecos = [], lec = 0;
      idx.forEach(function (i) {
        var p = pages[i];
        if (p.tipo === 'apuntes') huecos.push([0, i]);
        else if (p.tipo === 'actividad' && p.relleno) huecos.push([1, i]);
        else if (/^lec_/.test(p.tipo) && ++lec > 1) huecos.push([2, i]);
      });
      huecos.sort(function (a, c) { return a[0] - c[0] || a[1] - c[1]; });
      var nuevas = [], des = b.des || [], ej = b.ej || [], e0 = 0;
      /* «Cerca de ti» pasa a ser «Así se resuelve» con los ejemplos del banco */
      if (ej.length) idx.forEach(function (i) { var p = pages[i]; if (p.tipo === 'ejemplo' && e0 === 0) { pages[i] = { tipo: 'enc_ejemplos', u: u, n: p.n, num: p.num, e0: 0, e1: Math.min(3, ej.length), cerca: 1, encPar: par, fill2: { nada: 1 } }; e0 = pages[i].e1; resumen.ej++; } });
      /* prioridad con pocos huecos: el primer desarrollo, la conclusión, más ejemplos y el resto del desarrollo */
      var desP = []; for (var d = 0; d < des.length; d += 3) desP.push({ tipo: 'enc_desarrollo', d0: d, d1: Math.min(des.length, d + 3) });
      var ejP = []; for (var e = e0; e < ej.length; e += 3) ejP.push({ tipo: 'enc_ejemplos', e0: e, e1: Math.min(ej.length, e + 3) });
      if (desP.length) nuevas.push(desP.shift());
      if (largo) nuevas.push({ tipo: 'enc_conclusion', curYa: 0 });
      nuevas = nuevas.concat(ejP.slice(0, 1), desP, ejP.slice(1));
      var puestos = nuevas.slice(0, huecos.length).map(function (nu, k) { return [huecos[k][1], nu]; });
      /* la conclusión va al final de la unidad: la página de hueco más alta; el resto, en orden */
      puestos.sort(function (a, c) { return (a[1].tipo === 'enc_conclusion') - (c[1].tipo === 'enc_conclusion') || a[0] - c[0]; });
      var libres = puestos.map(function (x) { return x[0]; }).sort(function (a, c) { return a - c; });
      var curPuesta = false;
      puestos.forEach(function (x, k) {
        var i = libres[k], viejo = pages[i], nu = Object.assign({ u: u, n: viejo.n, num: viejo.num, encPar: par, fill2: { nada: 1 } }, x[1]);
        if (nu.tipo === 'enc_desarrollo' && !curPuesta && nu.d1 >= des.length) { nu.cur = 1; curPuesta = true; }
        if (nu.tipo === 'enc_ejemplos' && nu.e1 >= ej.length) nu.err = 1;
        if (nu.tipo === 'enc_conclusion') nu.curYa = 0;
        pages[i] = nu; resumen[nu.tipo === 'enc_desarrollo' ? 'des' : nu.tipo === 'enc_ejemplos' ? 'ej' : 'con']++;
        sols.forEach(function (s) { s.entradas = s.entradas.filter(function (en) { return en.p !== viejo.num; }); });
      });
      if (curPuesta) pages.forEach(function (p) { if (p.u === u && p.tipo === 'enc_conclusion') p.curYa = 1; });
      /* si no hubo conclusión propia, la del banco no se pierde: va al primer ejemplo como errores */
      var hayErr = false; pages.forEach(function (p) { if (p.u && p.u.id === id && p.tipo === 'enc_ejemplos' && p.err) hayErr = true; });
      if (!hayErr) { for (var q = pages.length - 1; q >= 0; q--) if (pages[q].u && pages[q].u.id === id && pages[q].tipo === 'enc_ejemplos') { pages[q].err = 1; break; } }
    });
    /* cada dibujo se pinta una sola vez en el libro; las demás veces se cita su página */
    pages.forEach(function (p) {
      if (p.tipo !== 'enc_desarrollo') return; var b = banco(C, p.u) || {}; p.figRef = {};
      (b.des || []).slice(p.d0, p.d1).forEach(function (d) { var id = d[2]; if (!id) return; if (uso[id] && uso[id] !== p.num) p.figRef[id] = uso[id]; else uso[id] = p.num; });
    });
    /* medir y recortar */
    pages.forEach(function (p) {
      if (p.tipo === 'apertura' && p.encA) { while (p.encA < 4 && !cabe(p, res)) p.encA++; }
      else if (/^enc_/.test(p.tipo)) { p.encL = 0; while (p.encL < 3 && !cabe(p, res)) p.encL++; }
    });
    /* índice: los apartados de cada unidad, si caben en las páginas de índice que ya hay */
    var ind = pages.filter(function (p) { return p.tipo === 'indice'; }).length;
    if (ind) {
      var lim = Math.floor(H.presupuesto(C, 80) / 1.6), filas = pages.filter(function (p) { return p.indice || /^(apertura|s_titulo|t_intro|t_conclusion|t_biblio|t_anexos|glosario|bibliografia)$/.test(p.tipo) || (p.tipo === 'solucion' && p.parte === 0) || (p.tipo === 't_desarrollo' && p.n === 1); }).length;
      var extra = [], vist = {};
      pages.forEach(function (p) { if (!/^enc_/.test(p.tipo)) return; var k = p.u.id + p.tipo; if (vist[k]) return; vist[k] = 1; extra.push(p); });
      if (filas + extra.length <= ind * lim) extra.forEach(function (p) { p.indiceN = ''; p.indice = ' ' + ({ enc_desarrollo: 'Desarrollo', enc_ejemplos: 'Ejemplos resueltos', enc_conclusion: 'Conclusión' })[p.tipo]; });
    }
    pages.forEach(function (p) { if (p.tipo === 'presentacion') p._enc = resumen; });
    res.enciclopedia = resumen;
    return res;
  }
  function enganchar() {
    if (ED.__enc) return; ED.__enc = 1;
    var ens = ED.ensamblar;
    ED.ensamblar = function (cfg) { var r = ens.apply(this, arguments); try { aplicar(r, cfg); } catch (e) { console.warn('Enciclopedia', e); } return r; };
  }
  (function esperar(n) { if (ED.__tutor || !window.EU_TUTOR || n > 60) enganchar(); else setTimeout(function () { esperar(n + 1); }, 300); })(0);

  /* ─── curso premium: lecciones «Desarrollo» (con los dibujos de la biblioteca) y «Ejemplos resueltos» paso a paso ─── */
  function lecciones(D, res) {
    var C = res.C, MO = window.EU_MODELOS;
    D.modulos.forEach(function (M) {
      var u = (res.unidades || []).filter(function (x) { return x.id === M.id; })[0], b = u && banco(C, u); if (!b) return;
      var titulo = T(u.t, C), L = [], pag = function (t) { var p = res.pages.filter(function (x) { return x.tipo === t && x.u && x.u.id === u.id; })[0]; return p ? p.num : M.pag; };
      if ((b.des || []).length) L.push({ id: u.id + '__enc_des', t: 'Desarrollo · ' + titulo, pag: pag('enc_desarrollo'), video: 0, escenas: [{ tipo: 'idea', id: null, t: 'Introducción', texto: T(b.intro || '', C), rot: [] }].concat(b.des.map(function (d) {
        var m = MO && MO.modelo(d[2]); return { tipo: 'idea', id: m ? d[2] : null, t: T(d[0], C), texto: T(d[1], C) + (m && m.porque ? ' ' + m.porque : ''), rot: m && m.rot ? m.rot.slice(0, 4).map(function (r) { return r[0]; }) : [] };
      })) });
      (b.ej || []).forEach(function (x, k) {
        var esc = [{ tipo: 'idea', id: null, t: 'Ejemplo ' + (k + 1), texto: 'Resolvemos juntos. ' + T(x.e, C), rot: [] }].concat((x.pasos || []).map(function (s, i) { return { tipo: 'idea', id: null, t: 'Paso ' + (i + 1), texto: T(s, C), rot: [] }; }));
        esc.push({ tipo: 'idea', id: null, t: 'Respuesta', texto: 'La respuesta es: ' + T(x.s, C) + '.' + (x.x ? ' Por qué: ' + T(x.x, C) : ''), rot: [] });
        L.push({ id: u.id + '__enc_ej' + k, t: 'Ejemplo resuelto ' + (k + 1) + ' · ' + titulo, pag: pag('enc_ejemplos'), video: 0, escenas: esc });
      });
      if (b.con) L.push({ id: u.id + '__enc_con', t: 'Para terminar · ' + titulo, pag: pag('enc_conclusion'), video: 0, escenas: [{ tipo: 'idea', id: null, t: 'Conclusión', texto: T(b.con, C), rot: [] }].concat(b.cur ? [{ tipo: 'idea', id: null, t: '¿Sabías que…?', texto: T(b.cur, C), rot: [] }] : []) });
      M.lecciones = M.lecciones.concat(L);
    });
  }
  (function cursoEnc(n) {
    var CA = window.EU_CURSO_ANIM;
    if (CA && CA.enriquecer && !CA.enriquecer._enc) { var enr = CA.enriquecer; CA.enriquecer = function (D, res) { try { if (res && activo(res.C)) lecciones(D, res); } catch (e) { console.warn('Enciclopedia · curso', e); } return enr.apply(this, arguments); }; CA.enriquecer._enc = 1; }
    else if (!CA && n < 40) setTimeout(function () { cursoEnc(n + 1); }, 500);
  })(0);

  window.EU_ENCICLOPEDIA = { aplicar: aplicar, banco: banco, T: T, lecciones: lecciones };
})();
