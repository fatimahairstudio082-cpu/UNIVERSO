/* b6_curso_premium.js — «🎓 Curso premium»: libro + curso profesional con vídeos y voz, en un solo paquete.
   Se engancha a las salidas del Editorial (EU_CONECTORES.salidas). Construye, a partir del libro armado (ed.res):
   · Módulos = unidades del libro. Lecciones:
       – una por corte cuando la unidad trae pasos de Guías 3D (pe_g3d_<corte>_<k>, b6_pelu_guias.js):
         portada, un paso por escena con la cabeza 3D, y pregunta de repaso;
       – «Ideas clave» en las demás unidades, con los dibujos de la biblioteca asignados (u.mods).
     Cada lección enlaza a su página del libro.
   · Reproductor sin internet (curso/index.html + curso/datos.js): voz «Google español» (es-ES) del navegador,
     subtítulos que se resaltan, el dibujo cambia con cada escena, los rótulos aparecen al nombrarlos,
     pregunta de repaso al final, progreso guardado, test por unidad, examen final y certificado con nombre.
   · Grabación desde el propio curso: vídeo MP4/WebM y audio de cada lección (se comparte la pestaña con
     su audio para que la voz de Google entre en el archivo).
   · ZIP: curso/, libro/ (imprimible → PDF, interactivo), laminas/, guion-voz.txt, hotmart/ (módulos y
     lecciones con descripción y guion, carpeta lista para Hotmart/Teachable) y LEEME.txt.
   Cargar después de b6_conectores.js. */
(function () {
  'use strict';
  if (window.EU_CURSO_PREMIUM) return;

  function slug(s) { return String(s || 'curso').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'curso'; }
  function txt(s) { return String(s == null ? '' : s).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(); }
  function dos(n) { return String(n).padStart(2, '0'); }
  /* firma de Fátima Caldea (firma-fatima.png, transparente) para el certificado: se lee una vez como data URL */
  var FIRMA = '';
  try { fetch('./firma-fatima.png').then(function (r) { return r.ok ? r.blob() : null; }).then(function (b) { if (!b) return; var fr = new FileReader(); fr.onload = function () { FIRMA = fr.result; }; fr.readAsDataURL(b); }).catch(function () { }); } catch (e) { }
  function svgURL(id) {
    var MO = window.EU_MODELOS; if (!MO || !MO.svg) return '';
    var s = ''; try { s = MO.svg(id, 'color'); } catch (e) { return ''; }
    if (!s) return '';
    if (!/<svg[^>]*\swidth=/.test(s)) s = s.replace('<svg', '<svg width="800" height="600"');
    if (!/xmlns=/.test(s)) s = s.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
  }
  /* «Completa: « ___: descripción»» con el hueco al principio = el nombre del término: se pregunta como «¿Qué es?» con opciones de la unidad */
  function ident(q, u) {
    if (!q || !q.a) return q;
    var m = q.e.match(/^Completa: «[\s\u00a0]*[:·—-][\s\u00a0]*([\s\S]+)»$/); if (!m) return q;
    var k = (u.k || []).map(txt).filter(Boolean), ok = q.a[0], otras = k.filter(function (w) { return w.toLowerCase() !== String(ok).toLowerCase(); });
    if (otras.length < 2) return null;
    var g = ok.length, o = [ok, otras[g % otras.length], otras[(g + 1) % otras.length]], s = g % 3;
    o = o.slice(s).concat(o.slice(0, s));
    return { e: '¿A qué corresponde? «' + m[1].trim() + '»', o: o.map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }), c: (3 - s) % 3 };
  }
  function itemQ(x) {
    if (!x || !x.e) return null;
    if (x.tipo === 'mc' && x.o) return { e: txt(x.e), o: x.o.map(txt), c: x.c };
    if (x.tipo === 'vf') { var v = x.s === true || /^v/i.test(String(x.s)); return { e: txt(x.e), o: ['Verdadero', 'Falso'], c: v ? 0 : 1 }; }
    if (x.tipo === 'corta' && x.s != null) return { e: txt(x.e), a: (x.ac || [x.s]).map(txt) };
    if (x.p && x.o) return { e: txt(x.p), o: x.o.map(txt), c: x.c, x: txt(x.x) };
    return null;
  }
  var PARTS = ['horizontal', 'vertical', 'diagonal hacia atrás', 'diagonal hacia delante', 'radial'];

  /* ─── 1 · el curso a partir del libro ─── */
  function construir(res) {
    var ED = window.EU_EDITORIAL, MO = window.EU_MODELOS, CO = window.EU_CORTES, C = res.C, T = C.T || {};
    var pagDe = function (u, ids) {
      var pg = null;
      res.pages.some(function (p) { if (p.u === u && ids && (ids.indexOf(p.mod) >= 0 || ids.indexOf(p.gen) >= 0)) { pg = p; return true; } return false; });
      if (!pg) res.pages.some(function (p) { if (p.u === u && p.num) { pg = p; return true; } return false; });
      return pg && pg.num ? pg.num : null;
    };
    var mods = [], examen = [], USADOS = {};
    res.unidades.forEach(function (u, iu) {
      var M = { id: u.id, t: txt(u.t), pag: pagDe(u), lecciones: [], test: [] };
      var grupos = {}, orden = [];
      (u.mods || []).forEach(function (id) {
        var m = /^pe_(?:g3d|est)_(.+)_(\d+)$/.exec(id); if (!m || !MO.modelo(id)) return;
        if (!grupos[m[1]]) { grupos[m[1]] = []; orden.push(m[1]); } grupos[m[1]].push(id);
      });
      orden.forEach(function (cid) {
        var ids = grupos[cid].sort(function (a, b) { return MO.modelo(a).paso - MO.modelo(b).paso; }), mg = MO.modelo(ids[0]);
        var c = mg.grupoN ? { n: mg.grupoN, d: mg.grupoD || '' } : (CO && CO.get(cid)) || { n: cid, d: '' };
        var esc = [{ tipo: 'portada', id: ids[0], t: c.n, texto: c.n + '. ' + txt(c.d) + ' Lo hacemos en ' + ids.length + ' pasos.', rot: [] }];
        ids.forEach(function (id) {
          var m = MO.modelo(id);
          if (m.narr) { esc.push({ tipo: 'paso', id: id, t: 'Paso ' + (m.paso + 1), texto: 'Paso ' + (m.paso + 1) + '. ' + txt(m.narr), rot: [] }); return; }
          var rot = ['Partición ' + m.part, m.elev ? 'Elevación ' + m.elev + '°' : 'Elevación 0°'];
          var narr = 'Paso ' + (m.paso + 1) + (m.titulo ? ': ' + m.titulo : '') + '. ' + txt(m.intro) + ' ' + rot[0] + '. ' + rot[1] + '.' + (m.vigila ? ' Ojo: ' + txt(m.vigila) : '');
          esc.push({ tipo: 'paso', id: id, t: 'Paso ' + (m.paso + 1) + (m.titulo ? ' · ' + m.titulo : ''), texto: narr, rot: rot });
        });
        var m0 = MO.modelo(ids[0]);
        if (m0.narr) {
          var nn = ids.map(function (id) { return txt(MO.modelo(id).narr); }), ko = Math.min(1, nn.length - 1), opE = [nn[ko], nn[nn.length - 1], nn[0]].filter(function (x, i, a) { return a.indexOf(x) === i; });
          var qe = { e: '¿Qué se hace en el paso ' + (ko + 1) + ' de ' + c.n.toLowerCase() + '?', o: opE.map(function (s) { return s.length > 90 ? s.slice(0, 88) + '…' : s; }), c: 0 };
          var gE = (iu + orden.indexOf(cid)) % qe.o.length; qe.o = qe.o.slice(gE).concat(qe.o.slice(0, gE)); qe.c = (qe.o.length - gE) % qe.o.length;
          esc.push({ tipo: 'pregunta', id: ids[ko], t: 'Repaso', texto: 'Antes de seguir, piensa: ' + qe.e, rot: [], q: qe, sol: 'La respuesta es: ' + qe.o[qe.c] });
          M.lecciones.push({ id: u.id + '__' + cid, t: c.n, pag: pagDe(u, ids), video: 1, escenas: esc });
          return;
        }
        var op = [m0.part].concat(PARTS.filter(function (p) { return p !== m0.part; }).slice(0, 2));
        var giro = (iu + orden.indexOf(cid)) % 3, ops = op.slice(giro).concat(op.slice(0, giro));
        var q = { e: '¿Qué partición se usa en el primer paso del ' + c.n.toLowerCase() + '?', o: ops.map(function (x) { return 'Partición ' + x; }), c: ops.indexOf(m0.part) };
        esc.push({ tipo: 'pregunta', id: ids[ids.length - 1], t: 'Repaso', texto: 'Antes de seguir, piensa: ' + q.e, rot: [], q: q, sol: 'La respuesta es: ' + q.o[q.c] + '.' });
        M.lecciones.push({ id: u.id + '__' + cid, t: c.n, pag: pagDe(u, ids), video: 1, escenas: esc });
      });
      var dib = (u.mods || []).filter(function (id) { return !/^pe_(g3d|est)_/.test(id) && MO && MO.modelo(id); });
      /* las demás materias no traen u.mods: se usan los dibujos que el libro puso en esa unidad y, si faltan, los más parecidos de su biblioteca */
      if (!dib.length && MO) {
        res.pages.forEach(function (p) {
          if (p.u !== u) return;
          Object.keys(p).forEach(function (k) { var v = p[k]; if (typeof v === 'string' && v.length < 60 && MO.modelo(v) && !/^pe_(g3d|est)_/.test(v) && dib.indexOf(v) < 0) dib.push(v); });
        });
        var falta = Math.max(0, (u.i || []).length - dib.length);
        if (falta && MO.lista && C.mat) {
          var pal = function (t) { return String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(/[^a-z0-9ñ]+/).filter(function (w) { return w.length > 3; }); };
          var cl = pal(u.t + ' ' + (u.k || []).join(' ') + ' ' + (u.i || []).join(' '));
          var cand = MO.lista(C.mat).filter(function (m) { return !USADOS[m.id] && dib.indexOf(m.id) < 0 && !/^pe_(g3d|est|ft|fx|elev)_/.test(m.id); }).map(function (m, j) {
            var w = pal(m.n + ' ' + (m.intro || '')), pts = 0; cl.forEach(function (x) { if (w.indexOf(x) >= 0) pts++; }); return [pts, j, m.id];
          }).sort(function (x, y) { return y[0] - x[0] || x[1] - y[1]; });
          cand.slice(0, falta).forEach(function (x) { dib.push(x[2]); });
        }
      }
      dib.forEach(function (id) { USADOS[id] = 1; });
      var ideas = (u.i || []).map(txt).filter(Boolean);
      if (ideas.length) {
        var claves = (u.k || []).map(txt).filter(Boolean);
        var escI = ideas.map(function (t, k) {
          var id = dib[k] || dib[dib.length - 1] || null, m = id && MO.modelo(id);
          var rot = claves.filter(function (w) { return t.toLowerCase().indexOf(w.toLowerCase()) >= 0; }).slice(0, 4);
          if (!rot.length && m && m.rot) rot = m.rot.slice(0, 3).map(function (r) { return txt(r[0]); }).filter(function (w) { return t.toLowerCase().indexOf(w.toLowerCase()) >= 0; });
          return { tipo: 'idea', id: id, t: m ? m.n : M.t, texto: t, rot: rot };
        });
        var qr = (u.rep || []).map(itemQ).filter(function (x) { return x && x.o; })[0];
        if (qr) escI.push({ tipo: 'pregunta', id: escI[escI.length - 1].id, t: 'Repaso', texto: 'Antes de seguir, piensa: ' + qr.e, rot: [], q: qr, sol: 'La respuesta es: ' + qr.o[qr.c] + '.' + (qr.x ? ' ' + qr.x : '') });
        M.lecciones.unshift({ id: u.id + '__ideas', t: 'Ideas clave · ' + M.t, pag: M.pag, video: 0, escenas: escI });
      }
      var qs = (u.rep || []).map(itemQ).filter(Boolean);
      try { ED.quiz(res, u.id, 10, C.semilla).items.forEach(function (x) { var q = ident(itemQ(x), u); if (q) qs.push(q); }); } catch (e) { }
      var vis = {}; M.test = qs.filter(function (q) { var k = q.e.toLowerCase(); if (vis[k]) return false; vis[k] = 1; return true; }).slice(0, 10);
      examen = examen.concat(M.test.slice(0, 3));
      if (M.lecciones.length || M.test.length) mods.push(M);
    });
    return {
      titulo: txt(C.titulo), sub: txt(C.sub || C.curso || ''), autor: txt(C.autor || ''), centro: txt(C.centro || ''),
      T: { acc: T.acc || '#B5476B', bg: T.bg || '#FBF7F2', tit: T.tit || 'Georgia, serif', txt: T.txt || '#1F1B18', soft: T.soft || '#E6DCD2' },
      clave: 'eu_cp_' + slug(C.titulo), modulos: mods, examen: examen.slice(0, 20), img: {}, firma: FIRMA
    };
  }

  /* imágenes: Guías 3D en JPEG, biblioteca en SVG; por tandas para no congelar la página */
  function imagenes(D, prog) {
    var ids = []; D.modulos.forEach(function (M) { M.lecciones.forEach(function (L) { L.escenas.forEach(function (e) { if (e.id && ids.indexOf(e.id) < 0) ids.push(e.id); }); }); });
    var MO = window.EU_MODELOS, PG = window.EU_PELU_GUIAS, i = 0;
    return new Promise(function (ok) {
      (function tanda() {
        var t0 = performance.now();
        while (i < ids.length && performance.now() - t0 < 60) {
          var id = ids[i++], m = MO.modelo(id), src = '';
          if (m && m.raster) { try { src = m.raster(); } catch (e) { } }
          else if (m && m.fam === 'g3d' && PG) { try { var full = window.EU_CORTES.get(m.corte) || {}; src = PG.render(m.corte, (full.mejor || [])[0], m.paso); } catch (e) { } }
          if (!src) src = svgURL(id);
          if (src) D.img[id] = src;
        }
        if (prog) prog(i / Math.max(1, ids.length));
        if (i < ids.length) setTimeout(tanda, 0); else ok(D);
      })();
    });
  }

  function guionTXT(D) {
    var s = D.titulo + ' — guion de voz (es-ES)\n\n';
    D.modulos.forEach(function (M, i) {
      s += '══ Módulo ' + (i + 1) + ' · ' + M.t + (M.pag ? ' (libro, pág. ' + M.pag + ')' : '') + '\n\n';
      M.lecciones.forEach(function (L, j) {
        s += '── Lección ' + (i + 1) + '.' + (j + 1) + ' · ' + L.t + (L.pag ? ' (pág. ' + L.pag + ')' : '') + '\n';
        L.escenas.forEach(function (e, k) { s += '  ' + (k + 1) + '. [' + e.tipo + '] ' + e.texto + (e.sol ? ' … ' + e.sol : '') + '\n'; });
        s += '\n';
      });
    });
    return s;
  }

  /* ─── 2 · reproductor (se serializa dentro de curso/index.html; no usar la etiqueta de cierre de script) ─── */
  function REPRODUCTOR() {
    var D = window.CURSO, T = D.T, $ = function (s) { return document.querySelector(s); }, cv = $('#cv'), x = cv.getContext('2d');
    var ST; try { ST = JSON.parse(localStorage.getItem(D.clave) || '{}'); } catch (e) { ST = {}; }
    ST.vistas = ST.vistas || {}; ST.tests = ST.tests || {};
    function guarda() { try { localStorage.setItem(D.clave, JSON.stringify(ST)); } catch (e) { } }
    var IMG = {}; function img(id) { if (!id || !D.img[id]) return null; if (!IMG[id]) { IMG[id] = new Image(); IMG[id].src = D.img[id]; } return IMG[id]; }
    var LEC = []; D.modulos.forEach(function (M, i) { M.lecciones.forEach(function (L, j) { L.mi = i; L.li = j; LEC.push(L); }); });
    var cur = { L: null, k: 0, pos: 0, voz: false, rev: false, play: false, t0: 0, b: false };
    var VOZ = null;
    function eligeVoz() {
      var vs = speechSynthesis.getVoices().filter(function (v) { return /^es/i.test(v.lang); });
      VOZ = vs.filter(function (v) { return /google/i.test(v.name) && /es-ES/i.test(v.lang); })[0] || vs.filter(function (v) { return /es-ES/i.test(v.lang); })[0] || vs[0] || null;
      $('#voz').textContent = VOZ ? 'Voz: ' + VOZ.name : 'Sin voz en español en este navegador (se ve con subtítulos)';
    }
    if (window.speechSynthesis) { eligeVoz(); speechSynthesis.onvoiceschanged = eligeVoz; }

    /* lienzo 1280×720: dibujo, título, rótulos y subtítulo resaltado */
    function ajusta(t, w, f) { x.font = f; var pal = t.split(' '), l = [], a = ''; pal.forEach(function (p) { var b = a ? a + ' ' + p : p; if (x.measureText(b).width > w && a) { l.push(a); a = p; } else a = b; }); if (a) l.push(a); return l; }
    function pinta() {
      var L = cur.L; x.fillStyle = T.bg; x.fillRect(0, 0, 1280, 720);
      if (!L) { x.fillStyle = T.txt; x.font = '600 54px ' + T.tit; x.fillText(D.titulo, 70, 330); x.font = '28px ' + T.tit; x.fillStyle = T.acc; x.fillText('Elige una lección para empezar', 70, 390); return; }
      var e = L.escenas[cur.k], im = img(e.id);
      x.fillStyle = T.acc; x.fillRect(0, 0, 1280, 6);
      x.fillStyle = T.acc; x.font = '600 20px ' + T.tit; x.fillText(('Módulo ' + (L.mi + 1) + ' · ' + D.modulos[L.mi].t).toUpperCase().slice(0, 80), 48, 46);
      x.fillStyle = T.txt; x.font = '600 36px ' + T.tit; x.fillText(e.t.slice(0, 64), 48, 92);
      if (e.tipo === 'pregunta') {
        x.font = '600 34px ' + T.tit; var ly = 170; ajusta(e.q.e, 1180, x.font).forEach(function (l) { x.fillText(l, 48, ly); ly += 44; });
        e.q.o.forEach(function (o, i) {
          var y = ly + 30 + i * 84, ok = cur.rev && i === e.q.c;
          x.fillStyle = ok ? T.acc : '#FFFFFF'; x.strokeStyle = ok ? T.acc : T.soft; x.lineWidth = 3; x.beginPath(); x.rect(48, y, 1184, 64); x.fill(); x.stroke();
          x.fillStyle = ok ? '#FFFFFF' : T.txt; x.font = '28px ' + T.tit; x.fillText(String.fromCharCode(65 + i) + '.  ' + o, 72, y + 42);
        });
      } else {
        var bx = 48, by = 118, bw = e.rot.length ? 840 : 1184, bh = 440;
        x.fillStyle = '#FFFFFF'; x.fillRect(bx, by, bw, bh);
        if (e.anim && window.CURSO_ANIM && D.anim && D.anim[e.anim]) CURSO_ANIM.pinta(x, D.anim[e.anim], im, bx, by, bw, bh, cur.fin ? 1 : Math.min(1, cur.pos / Math.max(1, e.texto.length)));
        else if (im && im.complete && im.naturalWidth) { var r = Math.min(bw / im.naturalWidth, bh / im.naturalHeight); var w = im.naturalWidth * r, h = im.naturalHeight * r; x.drawImage(im, bx + (bw - w) / 2, by + (bh - h) / 2, w, h); }
        var low = e.texto.toLowerCase(), ry = by + 10;
        e.rot.forEach(function (rt) {
          var at = low.indexOf(rt.toLowerCase()); if (at < 0) at = 0; if (cur.pos < at && !cur.fin) return;
          var ls = ajusta(rt, 290, '600 24px ' + T.tit), hh = 26 + ls.length * 30;
          x.fillStyle = '#FFFFFF'; x.fillRect(912, ry, 320, hh); x.fillStyle = T.acc; x.fillRect(912, ry, 6, hh);
          x.fillStyle = T.txt; x.font = '600 24px ' + T.tit; ls.forEach(function (l, i) { x.fillText(l, 932, ry + 36 + i * 30); }); ry += hh + 14;
        });
      }
      /* subtítulo: la parte ya dicha en color del acento */
      var sub = e.tipo === 'pregunta' && cur.rev ? e.sol : e.texto, f = '26px ' + T.tit, lin = ajusta(sub, 1150, f), pos = e.tipo === 'pregunta' && cur.rev ? 1e9 : cur.pos;
      var ini = 0, vis = lin, lh = 34;
      if (lin.length > 3) { var acc = 0, cuál = 0; lin.forEach(function (l, i) { if (acc <= pos) cuál = i; acc += l.length + 1; }); var s0 = Math.max(0, Math.min(cuál - 1, lin.length - 3)); vis = lin.slice(s0, s0 + 3); for (var q = 0; q < s0; q++) ini += lin[q].length + 1; }
      x.fillStyle = 'rgba(20,16,14,.86)'; x.fillRect(0, 720 - 30 - vis.length * lh - 14, 1280, vis.length * lh + 44);
      var yy = 720 - 30 - (vis.length - 1) * lh; x.font = f;
      vis.forEach(function (l) {
        var px = 64; l.split(' ').forEach(function (p) { x.fillStyle = ini <= pos ? '#FFE7A8' : '#FFFFFF'; x.fillText(p, px, yy); px += x.measureText(p + ' ').width; ini += p.length + 1; });
        yy += lh;
      });
      x.fillStyle = T.acc; x.fillRect(0, 714, 1280 * ((cur.k + (cur.fin ? 1 : Math.min(.99, cur.pos / Math.max(1, e.texto.length)))) / L.escenas.length), 6);
    }
    /* carrusel de escenas: cada tarjeta repite su animación; la de la escena que suena va al paso de la voz */
    var MINI = [], kMini = -1, nCuadro = 0, VIS = window.IntersectionObserver ? new IntersectionObserver(function (ls) { ls.forEach(function (l) { if (l.target._m) l.target._m.vis = l.isIntersecting; }); }, { root: null }) : null;
    function mini(m, i, t) {
      var e = m.e, g = m.g, im = img(e.id); g.fillStyle = T.bg; g.fillRect(0, 0, 320, 180);
      if (e.tipo === 'pregunta') { g.fillStyle = T.acc; g.font = '600 96px ' + T.tit; g.textAlign = 'center'; g.fillText('?', 160, 124); g.textAlign = 'start'; return; }
      var p = i === cur.k && cur.play ? (cur.fin ? 1 : Math.min(1, cur.pos / Math.max(1, e.texto.length))) : Math.min(1, ((t / 1000 + i * 0.8) % 6) / 5);
      if (e.anim && window.CURSO_ANIM && D.anim && D.anim[e.anim]) CURSO_ANIM.pinta(g, D.anim[e.anim], im, 0, 0, 320, 180, p);
      else if (im && im.complete && im.naturalWidth) { var r = Math.min(320 / im.naturalWidth, 180 / im.naturalHeight); g.fillStyle = '#fff'; g.fillRect(0, 0, 320, 180); g.drawImage(im, (320 - im.naturalWidth * r) / 2, (180 - im.naturalHeight * r) / 2, im.naturalWidth * r, im.naturalHeight * r); }
      else { g.fillStyle = T.txt; g.font = '600 22px ' + T.tit; ajustaEn(g, e.t, 290).slice(0, 4).forEach(function (l, j) { g.fillText(l, 16, 44 + j * 30); }); }
    }
    function ajustaEn(g, t, w) { var pal = String(t).split(' '), l = [], a = ''; pal.forEach(function (q) { var b = a ? a + ' ' + q : q; if (g.measureText(b).width > w && a) { l.push(a); a = q; } else a = b; }); if (a) l.push(a); return l; }
    function minis() {
      if (!MINI.length) return;
      if (kMini !== cur.k) { kMini = cur.k; MINI.forEach(function (m, i) { m.b.classList.toggle('on', i === cur.k); }); var a = MINI[cur.k]; if (a) { var tira = $('#escenas'); tira.scrollTo({ left: a.b.offsetLeft - (tira.clientWidth - a.b.offsetWidth) / 2, behavior: 'smooth' }); } }
      if (++nCuadro % 3) return;
      var t = performance.now(); MINI.forEach(function (m, i) { if (m.vis) mini(m, i, t); });
    }
    var raf = 0; function bucle() { if (cur.play && !cur.b && !cur.fin) { cur.pos = Math.max(cur.pos, (performance.now() - cur.t0) / 1000 * 14.5 * (cur.vel || 1)); } pinta(); minis(); raf = requestAnimationFrame(bucle); }
    bucle();

    function escena(k, alAcabar) {
      var L = cur.L, e = L.escenas[k]; cur.k = k; cur.pos = 0; cur.fin = false; cur.rev = false; cur.b = false; cur.t0 = performance.now();
      pintaPregunta(e); textoBajo(e);
      var sigue = function () {
        if (e.tipo === 'pregunta' && !cur.rev) { setTimeout(function () { if (!cur.play) return; cur.rev = true; textoBajo(e); habla(e.sol, function () { setTimeout(alAcabar, 900); }); }, 3500); return; }
        cur.fin = true; setTimeout(alAcabar, 700);
      };
      habla(e.texto, sigue);
    }
    function habla(t, fin) {
      cur.pos = 0; cur.t0 = performance.now(); cur.b = false;
      if (!window.speechSynthesis || !VOZ || $('#mudo').checked) { var ms = Math.max(2500, t.length / 14.5 * 1000); var h = setTimeout(function () { if (cur.play) fin(); }, ms); cur.h = h; return; }
      var u = null, fr = (t.match(/[^.!?:]+[.!?:]*/g) || [t]).map(function (s) { return s; }), base = 0;
      /* Chrome corta las voces de Google a los ~15 s: se dice frase a frase */
      (function sig(i) {
        if (i >= fr.length) { cur.pos = t.length; if (cur.play) fin(); return; }
        if (!cur.play) return;
        var f = fr[i], off = base; base += f.length;
        u = new SpeechSynthesisUtterance(f.trim()); u.voice = VOZ; u.lang = 'es-ES'; u.rate = cur.vel || 1;
        cur.t0 = performance.now() - off / 14.5 * 1000; cur.pos = Math.max(cur.pos, off);
        u.onboundary = function (ev) { if (ev.charIndex != null) { cur.b = true; cur.pos = off + ev.charIndex; } };
        u.onend = function () { cur.b = false; sig(i + 1); };
        u.onerror = function () { sig(i + 1); };
        speechSynthesis.speak(u);
      })(0);
    }
    function para() { cur.play = false; clearTimeout(cur.h); if (window.speechSynthesis) speechSynthesis.cancel(); $('#play').textContent = '▶ Reproducir'; }
    function reproduce(desde, alTerminar) {
      para(); cur.play = true; $('#play').textContent = '❚❚ Pausa';
      var k = desde || 0, L = cur.L;
      var paso = function () {
        if (!cur.play) return;
        if (k >= L.escenas.length) { para(); ST.vistas[L.id] = 1; guarda(); menu(); if (alTerminar) alTerminar(); return; }
        escena(k++, paso);
      };
      paso();
    }
    function pintaPregunta(e) {
      var box = $('#preg'); box.innerHTML = '';
      if (e.tipo !== 'pregunta') return;
      e.q.o.forEach(function (o, i) {
        var b = document.createElement('button'); b.textContent = String.fromCharCode(65 + i) + '. ' + o; b.className = 'op';
        b.onclick = function () { cur.rev = true; textoBajo(e); b.style.background = i === e.q.c ? T.acc : '#F6D6D6'; b.style.color = i === e.q.c ? '#fff' : T.txt; };
        box.appendChild(b);
      });
    }
    function textoBajo(e) { $('#bajo').textContent = e.tipo === 'pregunta' && cur.rev ? e.sol : e.texto; }
    function abre(L) {
      para(); cur.L = L; cur.k = 0; cur.pos = 0; cur.fin = false;
      $('#tl').textContent = L.t; var ix = LEC.indexOf(L); $('#pos').textContent = 'Módulo ' + (L.mi + 1) + ' · Lección ' + (L.li + 1) + ' de ' + D.modulos[L.mi].lecciones.length + ' · ' + (ix + 1) + '/' + LEC.length;
      $('#ant').disabled = ix <= 0; $('#sig').disabled = ix >= LEC.length - 1; document.body.classList.remove('verMenu'); $('#pag').innerHTML = L.pag ? '📖 En el libro: <a href="../libro/libro-interactivo.html" target="_blank">página ' + L.pag + '</a>' : '';
      $('#reproductor').style.display = ''; $('#zonaTest').style.display = 'none'; textoBajo(L.escenas[0]); pintaPregunta(L.escenas[0]);
      $('#escenas').innerHTML = ''; MINI = []; kMini = -1;
      L.escenas.forEach(function (e, k) {
        var b = document.createElement('button'), c = document.createElement('canvas'), t = document.createElement('b'); b.className = 'card'; c.width = 320; c.height = 180;
        t.textContent = (k + 1) + '. ' + e.t; b.appendChild(c); b.appendChild(t); b.onclick = function () { reproduce(k); }; $('#escenas').appendChild(b);
        var m = { e: e, b: b, g: c.getContext('2d'), vis: true }; MINI.push(m); if (VIS) VIS.observe(b); b._m = m;
      });
      window.scrollTo(0, 0);
    }
    $('#play').onclick = function () { if (!cur.L) return abre(LEC[0]); if (cur.play) para(); else reproduce(cur.fin || cur.k >= cur.L.escenas.length - 1 ? 0 : cur.k); };
    $('#vel').onchange = function () { cur.vel = +this.value; };
    var mueve = function (d) { var L = LEC[LEC.indexOf(cur.L) + d]; if (L) { abre(L); menu(); } };
    $('#ant').onclick = function () { mueve(-1); }; $('#sig').onclick = function () { if (!cur.L) { abre(LEC[0]); menu(); } else mueve(1); };
    $('#btnMenu').onclick = function () { document.body.classList.add('verMenu'); }; $('#cerrarMenu').onclick = function () { document.body.classList.remove('verMenu'); };
    if (/grabar/.test(location.hash)) $('#autora').style.display = 'flex';

    /* tests y examen */
    function nrm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\s.,;:()$€¡!¿?]/g, ''); }
    function test(tit, qs, alNota) {
      para(); $('#reproductor').style.display = 'none'; var z = $('#zonaTest'); z.style.display = ''; z.innerHTML = '<h2>' + tit + '</h2>';
      var resp = [];
      qs.forEach(function (q, i) {
        var d = document.createElement('div'); d.className = 'pq'; d.innerHTML = '<p><b>' + (i + 1) + '.</b> ' + q.e.replace(/</g, '&lt;') + '</p>';
        if (q.o) q.o.forEach(function (o, j) { var l = document.createElement('label'); l.innerHTML = '<input type="radio" name="q' + i + '"> ' + o.replace(/</g, '&lt;'); l.firstChild.onchange = function () { resp[i] = j; }; d.appendChild(l); });
        else { var inp = document.createElement('input'); inp.className = 'in'; inp.oninput = function () { resp[i] = inp.value; }; d.appendChild(inp); }
        z.appendChild(d);
      });
      var b = document.createElement('button'); b.className = 'cta'; b.textContent = 'Corregir'; z.appendChild(b);
      var out = document.createElement('p'); out.className = 'nota'; z.appendChild(out);
      b.onclick = function () {
        var bien = 0; qs.forEach(function (q, i) {
          var ok = q.o ? resp[i] === q.c : (q.a || []).some(function (a) { return nrm(a) === nrm(resp[i] || ''); });
          if (ok) bien++; var d = z.querySelectorAll('.pq')[i]; d.style.borderLeftColor = ok ? '#3C8D5A' : '#C0392B';
          if (!ok && !d.querySelector('.sol')) { var s = document.createElement('div'); s.className = 'sol'; s.textContent = 'Correcta: ' + (q.o ? q.o[q.c] : (q.a || [])[0]); d.appendChild(s); }
        });
        var n = Math.round(bien / Math.max(1, qs.length) * 100); out.textContent = 'Nota: ' + n + ' %' + (n >= 70 ? ' · aprobado' : ' · necesitas un 70 %: repasa y vuelve a intentarlo'); alNota(n); guarda(); menu();
      };
      window.scrollTo(0, 0);
    }
    /* certificado profesional (Fátima, 9-10-2026): firma y sello de Fátima Caldea, horas del curso
       cronometradas con la narración y los tests, número de certificado y descarga en PDF A4 apaisado (sin librerías) */
    function horasCurso() {
      var seg = 0, nq = (D.examen || []).length;
      D.modulos.forEach(function (M) { nq += (M.test || []).length; M.lecciones.forEach(function (L) { L.escenas.forEach(function (e) { seg += String(e.texto || '').length / 14.5 + 2 + (e.tipo === 'pregunta' ? 20 : 0); }); }); });
      seg += nq * 45;
      return Math.max(1, Math.ceil(seg / 3600));
    }
    function pdfJPEG(url, W, H) {
      var bin = atob(url.split(',')[1]), pw = 841.89, ph = 595.28, out = '%PDF-1.4\n', off = [];
      var obj = function (n, cuerpo) { off[n] = out.length; out += n + ' 0 obj\n' + cuerpo + '\nendobj\n'; };
      var cont = 'q ' + pw + ' 0 0 ' + ph + ' 0 0 cm /Im0 Do Q';
      obj(1, '<</Type/Catalog/Pages 2 0 R>>');
      obj(2, '<</Type/Pages/Kids[3 0 R]/Count 1>>');
      obj(3, '<</Type/Page/Parent 2 0 R/MediaBox[0 0 ' + pw + ' ' + ph + ']/Resources<</XObject<</Im0 4 0 R>>>>/Contents 5 0 R>>');
      obj(4, '<</Type/XObject/Subtype/Image/Width ' + W + '/Height ' + H + '/ColorSpace/DeviceRGB/BitsPerComponent 8/Filter/DCTDecode/Length ' + bin.length + '>>stream\n' + bin + '\nendstream');
      obj(5, '<</Length ' + cont.length + '>>stream\n' + cont + '\nendstream');
      var x = out.length; out += 'xref\n0 6\n0000000000 65535 f \n';
      for (var i = 1; i <= 5; i++) out += String(off[i]).padStart(10, '0') + ' 00000 n \n';
      out += 'trailer\n<</Size 6/Root 1 0 R>>\nstartxref\n' + x + '\n%%EOF';
      var u8 = new Uint8Array(out.length); for (var j = 0; j < out.length; j++) u8[j] = out.charCodeAt(j) & 255;
      return new Blob([u8], { type: 'application/pdf' });
    }
    function certificado() {
      var nom = (prompt('Nombre completo para el certificado:', ST.nombre || '') || '').trim(); if (!nom) return; ST.nombre = nom; guarda();
      var W = 2339, H = 1654, c = document.createElement('canvas'); c.width = W; c.height = H; var g = c.getContext('2d');
      var ORO = '#B08D57', AUTORA = 'Fátima Caldea', SELLO = 'FÁTIMA CALDEA', horas = horasCurso();
      var h = 0; (nom + '|' + D.titulo).split('').forEach(function (ch) { h = (h * 31 + ch.charCodeAt(0)) >>> 0; });
      var num = 'FC-' + new Date().getFullYear() + '-' + String(h % 1000000).padStart(6, '0') + (D.derechos && D.derechos.codigo ? ' · ' + D.derechos.codigo : '');
      var centro = function (t, y, f, col) { g.font = f; g.fillStyle = col; g.textAlign = 'center'; g.fillText(t, W / 2, y); g.textAlign = 'start'; };
      var ajustaT = function (t, w, f) { g.font = f; var pal = String(t).split(' '), l = [], a = ''; pal.forEach(function (p) { var b = a ? a + ' ' + p : p; if (g.measureText(b).width > w && a) { l.push(a); a = p; } else a = b; }); if (a) l.push(a); return l; };
      g.fillStyle = '#FFFDF8'; g.fillRect(0, 0, W, H);
      g.strokeStyle = T.acc; g.lineWidth = 14; g.strokeRect(60, 60, W - 120, H - 120);
      g.strokeStyle = ORO; g.lineWidth = 3; g.strokeRect(100, 100, W - 200, H - 200);
      [[100, 100, 1, 1], [W - 100, 100, -1, 1], [100, H - 100, 1, -1], [W - 100, H - 100, -1, -1]].forEach(function (q) {
        g.strokeStyle = ORO; g.lineWidth = 4; g.beginPath(); g.moveTo(q[0] + q[2] * 20, q[1] + q[3] * 140); g.lineTo(q[0] + q[2] * 20, q[1] + q[3] * 20); g.lineTo(q[0] + q[2] * 140, q[1] + q[3] * 20); g.stroke();
        g.fillStyle = ORO; g.beginPath(); g.arc(q[0] + q[2] * 20, q[1] + q[3] * 20, 9, 0, 7); g.fill();
      });
      centro('CERTIFICADO', 330, '600 112px ' + T.tit, T.acc);
      centro('DE APROVECHAMIENTO', 400, '500 40px ' + T.tit, ORO);
      centro('Se certifica que', 530, 'italic 42px ' + T.tit, T.txt);
      var fn = 128; g.font = '600 ' + fn + 'px ' + T.tit; while (g.measureText(nom).width > W - 520 && fn > 60) { fn -= 4; g.font = '600 ' + fn + 'px ' + T.tit; }
      centro(nom, 680, '600 ' + fn + 'px ' + T.tit, T.txt);
      g.strokeStyle = ORO; g.lineWidth = 2; g.beginPath(); g.moveTo(W / 2 - 600, 720); g.lineTo(W / 2 + 600, 720); g.stroke();
      centro('ha completado con éxito el curso', 800, 'italic 42px ' + T.tit, T.txt);
      ajustaT(D.titulo, W - 600, '600 66px ' + T.tit).slice(0, 2).forEach(function (l, i) { centro(l, 890 + i * 78, '600 66px ' + T.tit, T.acc); });
      centro(D.modulos.length + ' módulos · ' + LEC.length + ' lecciones · ' + horas + (horas === 1 ? ' hora' : ' horas') + ' · examen final: ' + ST.examen + ' %', 1060, '36px ' + T.tit, T.txt);
      centro('Expedido el ' + new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }), 1120, '34px ' + T.tit, T.txt);
      /* firma y sello */
      var fx = 560, ly = 1390;
      g.strokeStyle = T.txt; g.lineWidth = 2; g.beginPath(); g.moveTo(fx - 300, ly); g.lineTo(fx + 300, ly); g.stroke();
      g.textAlign = 'center'; g.fillStyle = T.txt; g.font = '600 40px ' + T.tit; g.fillText(AUTORA, fx, ly + 56);
      var sx = W - 560, sy = 1330; g.strokeStyle = ORO; g.lineWidth = 6; g.beginPath(); g.arc(sx, sy, 170, 0, 7); g.stroke(); g.lineWidth = 2; g.beginPath(); g.arc(sx, sy, 140, 0, 7); g.stroke();
      g.fillStyle = ORO; g.font = '600 30px ' + T.tit; for (var k = 0; k < SELLO.length; k++) { var an = -Math.PI * 0.86 + k * (Math.PI * 0.86 * 2 / (SELLO.length - 1)); g.save(); g.translate(sx + Math.cos(an - Math.PI / 2) * 112 * 0 + Math.sin(an) * 155, sy - Math.cos(an) * 155); g.rotate(an); g.fillText(SELLO[k], 0, 10); g.restore(); }
      g.font = '600 92px ' + T.tit; g.fillText('FC', sx, sy + 32); g.font = '26px ' + T.tit; g.fillText(String(new Date().getFullYear()), sx, sy + 80);
      g.font = '26px ' + T.tit; g.fillStyle = T.txt; g.fillText('Certificado n.º ' + num, W / 2, H - 150); g.textAlign = 'start';
      var bajar = function () {
        var url = c.toDataURL('image/jpeg', 0.92), b = pdfJPEG(url, W, H), u = URL.createObjectURL(b), a = document.createElement('a');
        a.href = u; a.download = 'certificado-' + nom.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-') + '.pdf'; a.click(); setTimeout(function () { URL.revokeObjectURL(u); }, 4000);
      };
      if (D.firma) { var im = new Image(); im.onload = function () { var r = Math.min(520 / im.width, 210 / im.height); g.drawImage(im, fx - im.width * r / 2, ly - im.height * r - 6, im.width * r, im.height * r); bajar(); }; im.onerror = bajar; im.src = D.firma; } else bajar();
    }

    /* grabar: el lienzo + el audio de la pestaña (la voz de Google sale por ahí) */
    function tipoV() { var t = ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm']; for (var i = 0; i < t.length; i++) if (window.MediaRecorder && MediaRecorder.isTypeSupported(t[i])) return t[i]; return ''; }
    function tipoA() { var t = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm']; for (var i = 0; i < t.length; i++) if (window.MediaRecorder && MediaRecorder.isTypeSupported(t[i])) return t[i]; return ''; }
    var AUD = null;
    function audioPestana() {
      if (AUD && AUD.getAudioTracks().some(function (t) { return t.readyState === 'live'; })) return Promise.resolve(AUD);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) return Promise.reject(new Error('Este navegador no deja grabar el audio de la pestaña. Usa Chrome de escritorio.'));
      alert('Chrome te pedirá compartir: elige «Esta pestaña» y marca «Compartir también el audio de la pestaña». Así la voz entra en el archivo.');
      return navigator.mediaDevices.getDisplayMedia({ video: true, audio: true, preferCurrentTab: true, selfBrowserSurface: 'include', systemAudio: 'include' }).then(function (s) {
        s.getVideoTracks().forEach(function (t) { t.stop(); });
        if (!s.getAudioTracks().length) throw new Error('No llegó audio: vuelve a intentarlo marcando «Compartir audio de la pestaña».');
        AUD = s; return s;
      });
    }
    function nombreL(L, ext) { return 'M' + String(L.mi + 1).padStart(2, '0') + '-L' + String(L.li + 1).padStart(2, '0') + '-' + L.t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) + '.' + ext; }
    function graba(L, soloAudio) {
      return audioPestana().then(function (a) {
        return new Promise(function (ok) {
          abre(L);
          var mime = soloAudio ? tipoA() : tipoV(), st = soloAudio ? new MediaStream(a.getAudioTracks()) : new MediaStream(cv.captureStream(30).getVideoTracks().concat(a.getAudioTracks()));
          var rec = new MediaRecorder(st, mime ? { mimeType: mime, videoBitsPerSecond: 4e6 } : undefined), trozos = [];
          rec.ondataavailable = function (ev) { if (ev.data.size) trozos.push(ev.data); };
          rec.onstop = function () {
            var ext = /mp4/.test(rec.mimeType) ? (soloAudio ? 'm4a' : 'mp4') : 'webm', b = new Blob(trozos, { type: rec.mimeType }), u = URL.createObjectURL(b);
            var el = document.createElement('a'); el.href = u; el.download = nombreL(L, ext); el.click(); setTimeout(function () { URL.revokeObjectURL(u); }, 4000); ok();
          };
          rec.start(500); setTimeout(function () { reproduce(0, function () { setTimeout(function () { rec.stop(); }, 600); }); }, 400);
        });
      }).catch(function (e) { alert(e.message); });
    }
    $('#grabV').onclick = function () { if (cur.L) graba(cur.L, false); };
    $('#grabA').onclick = function () { if (cur.L) graba(cur.L, true); };
    $('#grabT').onclick = function () { var vids = LEC.filter(function (L) { return L.video; }), i = 0; if (!vids.length) vids = LEC; (function sig() { if (i < vids.length) graba(vids[i++], false).then(sig); })(); };

    /* menú lateral */
    function menu() {
      var m = $('#menu'), hechas = LEC.filter(function (L) { return ST.vistas[L.id]; }).length; m.innerHTML = '';
      var pr = document.createElement('div'); pr.className = 'prog'; pr.innerHTML = '<b>' + Math.round(hechas / Math.max(1, LEC.length) * 100) + ' %</b> completado · ' + hechas + '/' + LEC.length + ' lecciones'; m.appendChild(pr);
      D.modulos.forEach(function (M, i) {
        var h = document.createElement('details'), sm = document.createElement('summary'), vh = M.lecciones.filter(function (L) { return ST.vistas[L.id]; }).length;
        h.open = cur.L ? cur.L.mi === i : i === 0; sm.innerHTML = (i + 1) + '. ' + M.t.replace(/</g, '&lt;') + '<small>' + vh + '/' + M.lecciones.length + (vh === M.lecciones.length ? ' ✓' : '') + '</small>'; h.appendChild(sm); m.appendChild(h);
        var m0 = m; m = h;
        M.lecciones.forEach(function (L) { var b = document.createElement('button'); b.className = 'lec' + (cur.L === L ? ' on' : ''); b.innerHTML = (ST.vistas[L.id] ? '✓ ' : (L.video ? '▶ ' : '• ')) + L.t.replace(/</g, '&lt;'); b.onclick = function () { abre(L); menu(); }; m.appendChild(b); });
        if (M.test.length) { var t = document.createElement('button'); t.className = 'lec tst'; t.textContent = (ST.tests[M.id] >= 70 ? '✓ ' : '✎ ') + 'Test del módulo' + (ST.tests[M.id] != null ? ' · ' + ST.tests[M.id] + ' %' : ''); t.onclick = function () { test('Test · ' + M.t, M.test, function (n) { ST.tests[M.id] = Math.max(n, ST.tests[M.id] || 0); }); }; m.appendChild(t); }
        m = m0;
      });
      var ex = document.createElement('button'); ex.className = 'lec fin'; ex.textContent = (ST.examen >= 70 ? '✓ ' : '★ ') + 'Examen final' + (ST.examen != null ? ' · ' + ST.examen + ' %' : ''); ex.onclick = function () { test('Examen final', D.examen, function (n) { ST.examen = Math.max(n, ST.examen || 0); }); }; m.appendChild(ex);
      var listo = hechas === LEC.length && ST.examen >= 70, ce = document.createElement('button'); ce.className = 'lec fin'; ce.textContent = '🎓 Certificado' + (listo ? '' : ' (completa lecciones y examen)'); ce.disabled = !listo; ce.onclick = certificado; m.appendChild(ce);
    }
    menu();
  }

  function cursoHTML(D) {
    var T = D.T, e = function (s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
    var css = 'body{margin:0;background:' + T.bg + ';color:' + T.txt + ';font-family:' + T.tit + ';}' +
      'a{color:' + T.acc + '}a:hover{opacity:.8}' +
      '.wrap{display:grid;grid-template-columns:minmax(220px,300px) minmax(0,1fr);min-height:100vh}' +
      '#menu{padding:18px;border-right:1px solid ' + T.soft + ';display:flex;flex-direction:column;gap:4px;background:#fff;position:sticky;top:0;height:100vh;overflow-y:auto;box-sizing:border-box}' +
      '#menu details{border-bottom:1px solid ' + T.soft + ';padding:4px 0}#menu summary{cursor:pointer;font-weight:700;font-size:15px;padding:8px 4px;list-style-position:inside}#menu summary small{font-weight:400;margin-left:6px}' +
      '#btnMenu,#cerrarMenu{display:none}.nav{display:flex;gap:8px;flex-wrap:wrap}' +
      '@media(max-width:820px){.wrap{grid-template-columns:minmax(0,1fr)}#menu{display:none;position:fixed;inset:0;z-index:20;height:auto;border:0}body.verMenu #menu{display:flex}#btnMenu,body.verMenu #cerrarMenu{display:inline-block}' +
      '#cv{position:sticky;top:0;z-index:5}main{padding:12px}main h1{font-size:22px!important}}' +
      '.prog{font-size:14px;margin-bottom:10px}.mod{font-weight:700;margin:14px 0 4px;font-size:15px}' +
      '.lec{all:unset;cursor:pointer;padding:6px 8px;font-size:14px;border-radius:4px;display:block}.lec:hover{background:' + T.soft + '}.lec.on{background:' + T.acc + ';color:#fff}.lec span{opacity:.6;font-size:12px}.lec.tst{font-style:italic}.lec.fin{font-weight:700;margin-top:8px}.lec:disabled{opacity:.45;cursor:default}' +
      'main{padding:22px;display:flex;flex-direction:column;gap:12px;max-width:1100px}' +
      'canvas{width:100%;height:auto;display:block;border:1px solid ' + T.soft + ';background:#fff}' +
      '.bar{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.bar button,.cta,.op,.esc{font:inherit;cursor:pointer;border:1px solid ' + T.acc + ';background:#fff;color:' + T.txt + ';padding:8px 14px;border-radius:4px;white-space:nowrap}.op{white-space:normal;text-align:left}' +
      '.bar button:hover,.op:hover,.esc:hover{background:' + T.soft + '}.cta{background:' + T.acc + ';color:#fff}' +
      '#preg{display:flex;flex-direction:column;gap:6px}#escenas{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;padding:2px 2px 10px;-webkit-overflow-scrolling:touch}.card{all:unset;cursor:pointer;flex:0 0 176px;scroll-snap-align:center;display:flex;flex-direction:column;gap:6px;background:#fff;border:2px solid ' + T.soft + ';border-radius:8px;padding:6px;box-sizing:border-box}.card canvas{width:100%;height:auto;border:0;border-radius:4px}.card b{font-size:13px;line-height:1.25;font-weight:600}.card.on{border-color:' + T.acc + ';box-shadow:0 0 0 2px ' + T.acc + '}.esc{font-size:13px;padding:5px 9px;white-space:normal;text-align:left;max-width:260px}' +
      '#bajo{font-size:17px;line-height:1.55;max-width:70ch}.pq{border-left:4px solid ' + T.soft + ';padding:6px 12px;margin:10px 0;display:flex;flex-direction:column;gap:4px}.in{font:inherit;padding:6px;max-width:320px}.sol{color:#C0392B;font-size:14px}.nota{font-size:20px;font-weight:700}' +
      'small{opacity:.7}';
    return '<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + e(D.titulo) + ' · curso</title><style>' + css + '</style>' +
      '<script src="datos.js"></script>' + (D.anim ? '<script src="anim.js"></script>' : '') + '</head><body><div class="wrap"><nav id="menu"></nav><main>' +
      '<div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start"><div><small>' + e(D.sub) + '</small><h1 style="margin:2px 0 0;font-size:30px">' + e(D.titulo) + '</h1></div><button id="btnMenu" class="cta">☰ Temario</button></div>' +
      '<div id="reproductor" style="display:flex;flex-direction:column;gap:12px"><div><small id="pos"></small><h2 id="tl" style="margin:0;font-size:22px">Bienvenida</h2></div>' +
      '<canvas id="cv" width="1280" height="720"></canvas>' +
      '<div class="bar"><button id="play" class="cta">▶ Reproducir</button><label>Velocidad <select id="vel"><option value="0.85">0,85×</option><option value="1" selected>1×</option><option value="1.15">1,15×</option></select></label><label><input id="mudo" type="checkbox"> Sin voz</label><small id="voz"></small></div>' +
      '<div class="nav"><button id="ant" class="esc">‹ Anterior</button><button id="sig" class="esc">Siguiente ›</button></div><div id="escenas"></div><div id="preg"></div><p id="bajo"></p><p id="pag"></p>' +
      '<div id="autora" style="display:none;flex-direction:column;gap:8px"><div class="bar"><button id="grabV">⏺ Grabar vídeo de la lección</button><button id="grabA">🎙 Grabar audio</button><button id="grabT">⏺ Grabar todos los vídeos</button></div>' +
      '<small>Para grabar con la voz «Google español», usa Chrome de escritorio y comparte «Esta pestaña» con su audio. Los vídeos salen en MP4 si el navegador lo permite (si no, WebM) y el audio en M4A o WebM.</small></div>' +
      '<p><b>Descargas</b> · <a href="../libro/libro-imprimible.html" target="_blank">Libro para imprimir o guardar en PDF</a> · <a href="../libro/libro-interactivo.html" target="_blank">Libro interactivo</a> · <a href="../laminas/" target="_blank">Láminas</a> · <a href="../guion-voz.txt" target="_blank">Guion de voz</a></p></div>' +
      '<div id="zonaTest" style="display:none"></div></main></div><button id="cerrarMenu" class="cta" style="position:fixed;top:10px;right:10px;z-index:21">✕ Cerrar</button><script>(' + REPRODUCTOR.toString() + ')();<\/script></body></html>';
  }

  function hotmart(z, D) {
    var raiz = 'hotmart/';
    z.file(raiz + 'LEEME.txt', 'Estructura para Hotmart, Teachable o similar.\nCada carpeta es un módulo y cada .txt una lección: título, descripción, página del libro y guion.\n' +
      'Graba los vídeos abriendo curso/index.html#grabar («Grabar todos los vídeos»): cada archivo sale con el mismo nombre que su lección (M01-L02-…).\nGuárdalos en su carpeta y súbelos lección por lección. Adjunta el libro en PDF como material descargable.\n');
    D.modulos.forEach(function (M, i) {
      var dir = raiz + 'Modulo-' + dos(i + 1) + '-' + slug(M.t) + '/';
      M.lecciones.forEach(function (L, j) {
        z.file(dir + 'M' + dos(i + 1) + '-L' + dos(j + 1) + '-' + slug(L.t).slice(0, 40) + '.txt',
          L.t + '\n\n' + (L.escenas[0] ? L.escenas[0].texto : '') + '\n\nPágina del libro: ' + (L.pag || '—') + '\n\nGuion:\n' + L.escenas.map(function (e, k) { return (k + 1) + '. ' + e.texto + (e.sol ? ' … ' + e.sol : ''); }).join('\n'));
      });
      if (M.test.length) z.file(dir + 'test.txt', M.test.map(function (q, k) { return (k + 1) + '. ' + q.e + (q.o ? '\n' + q.o.map(function (o, m) { return '   ' + (m === q.c ? '*' : ' ') + String.fromCharCode(65 + m) + ') ' + o; }).join('\n') : '\n   Respuesta: ' + (q.a || [])[0]); }).join('\n\n'));
    });
  }

  function paquete(res, aviso) {
    if (!window.JSZip) return Promise.reject(new Error('El curso premium necesita conexión la primera vez (JSZip).'));
    var ED = window.EU_EDITORIAL, D = construir(res);
    if (!D.modulos.length) return Promise.reject(new Error('Este libro no tiene unidades para el curso.'));
    aviso('Curso premium: preparando dibujos…');
    return (window.EU_CURSO_ANIM ? EU_CURSO_ANIM.enriquecer(D, res, aviso) : Promise.resolve(D)).then(function () {
      return imagenes(D, function (f) { aviso('Curso premium: dibujos ' + Math.round(f * 100) + ' %'); });
    }).then(function () {
      var z = new JSZip(), base = slug(D.titulo) + '-premium/';
      /* index.html autónomo: datos y animaciones dentro (abierto desde el gestor de archivos del móvil, los <script src> sueltos no cargan) */
      var datosIn = '<script>window.CURSO=' + JSON.stringify(D).replace(/<\//g, '<\\/') + ';<\/script>';
      var animIn = D.anim && window.EU_CURSO_ANIM ? '<script>' + EU_CURSO_ANIM.js().replace(/<\//g, '<\\/') + '<\/script>' : '';
      z.file(base + 'curso/index.html', cursoHTML(D).replace('<script src="datos.js"></script>', function () { return datosIn; }).replace('<script src="anim.js"></script>', function () { return animIn; }));
      if (D.anim && window.EU_CURSO_ANIM) z.file(base + 'curso/anim.js', EU_CURSO_ANIM.js());
      z.file(base + 'curso/datos.js', 'window.CURSO=' + JSON.stringify(D).replace(/<\//g, '<\\/') + ';');
      z.file(base + 'libro/libro-imprimible.html', ED.documento(res, 'print'));
      z.file(base + 'libro/libro-interactivo.html', ED.documento(res, 'web'));
      var li = [];
      Object.keys(D.img).forEach(function (id) {
        var s = D.img[id], m = window.EU_MODELOS.modelo(id), nom = slug(m ? m.n : id).slice(0, 60);
        if (/^data:image\/jpeg;base64,/.test(s)) { z.file(base + 'laminas/' + nom + '.jpg', s.split(',')[1], { base64: true }); li.push(nom + '.jpg'); }
        else if (/^data:image\/svg/.test(s)) { z.file(base + 'laminas/' + nom + '.svg', decodeURIComponent(s.split(',')[1])); li.push(nom + '.svg'); }
      });
      z.file(base + 'laminas/index.html', '<!DOCTYPE html><meta charset="utf-8"><title>Láminas</title><body style="font-family:Georgia,serif;display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;padding:16px">' +
        li.map(function (f) { return '<figure style="margin:0"><img src="' + f + '" style="width:100%;border:1px solid #ddd"><figcaption style="font-size:13px">' + f.replace(/\.(jpg|svg)$/, '').replace(/-/g, ' ') + '</figcaption></figure>'; }).join('') + '</body>');
      z.file(base + 'guion-voz.txt', guionTXT(D));
      hotmart(z, D);
      var nL = 0, nV = 0; D.modulos.forEach(function (M) { nL += M.lecciones.length; M.lecciones.forEach(function (L) { if (L.video) nV++; }); });
      z.file(base + 'LEEME.txt', D.titulo + ' — paquete premium\n\n' +
        '1. curso/index.html — el curso: ' + D.modulos.length + ' módulos, ' + nL + ' lecciones (' + nV + ' vídeos paso a paso), tests, examen final y certificado. Funciona sin internet; la voz es la «Google español» de Chrome.\n' +
        '2. libro/ — libro-imprimible.html: ábrelo y elige Imprimir → Guardar como PDF. libro-interactivo.html: versión en pantalla.\n' +
        '3. laminas/ — todos los dibujos del curso (JPG de Guías 3D y SVG vectoriales).\n' +
        '4. guion-voz.txt — el texto que narra cada escena.\n' +
        '5. hotmart/ — módulos y lecciones listos para subir. Los vídeos y audios se graban abriendo curso/index.html#grabar (botones «Grabar»; el alumno no los ve).\n');
      aviso('Curso premium: comprimiendo…');
      return z.generateAsync({ type: 'blob' }).then(function (b) { return { blob: b, nombre: slug(D.titulo) + '-curso-premium.zip', D: D, nL: nL, nV: nV }; });
    });
  }

  function enganchar() {
    var CN = window.EU_CONECTORES; if (!CN || CN.__premium) return !!CN;
    var s0 = CN.salidas; CN.__premium = true;
    CN.salidas = function (ed, b8) {
      s0.apply(this, arguments);
      var ocupado = false;
      b8('🎓 Curso premium (libro + vídeos + voz)', function () {
        if (ocupado) return; ocupado = true; if (ed.terminarTandas) ed.terminarTandas();
        ((window.EU_CURSO_PREMIUM && window.EU_CURSO_PREMIUM.paquete) || paquete)(ed.res, function (t) { ed.aviso(t); }).then(function (r) { ed.bajar(r.blob, r.nombre); ed.aviso('Curso premium descargado: ' + r.D.modulos.length + ' módulos, ' + r.nL + ' lecciones y ' + r.nV + ' vídeos. Abre curso/index.html en Chrome.'); })
          .catch(function (e) { ed.aviso(e.message); }).then(function () { ocupado = false; });
      }, true);
    };
    return true;
  }
  if (!enganchar()) (function espera(n) { if (!enganchar() && n < 200) setTimeout(function () { espera(n + 1); }, 300); })(0);

  window.EU_CURSO_PREMIUM = { construir: construir, imagenes: imagenes, cursoHTML: cursoHTML, guion: guionTXT, paquete: paquete };
})();
