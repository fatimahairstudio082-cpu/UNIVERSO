/* b6_portadas_editorial.js — conecta las Portadas premium (EU_PORTADAS) con el Editorial.
   cfg.acab.portada = 'premium' sustituye la página de portada por una ilustración completa a sangre,
   con el título, el curso, el autor y el centro del libro en la capa de texto.
   cfg.acab.portadaPrem: '' (automática según la materia) · id de una portada · 'enviada' (la que se mandó
   desde «Portadas premium.dc.html» con «Usar en mi libro», guardada en localStorage eu_portada_libro).
   cfg.acab.portadaPal: índice de paleta (vacío = la de la portada).
   Cargar después de b6_portadas_kit.js, b6_portadas_1/2/3.js y b6_portada_edicion.js. */
(function () {
  'use strict';
  var ED = window.EU_EDITORIAL, EP = window.EU_PORTADAS; if (!ED || !EP || ED.__portadasPrem) return; ED.__portadasPrem = 1;
  var H = ED.H || { hash: function (s) { var h = 0; s = String(s); for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); } };
  var CAT = [
    [/^(empre|mkt|ia|redes|ecom|conta)$/, 'neg'],
    [/^(mate|geoalg|calculo|fisica|quimica|bio|anat|natu|tecno)$/, 'cie'],
    [/^(pelu|panaderia|pasteleria|cocina|batidos|reposteria)$/, 'ofi'],
    [/^(infantil)$/, 'inf']
  ];
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  function enviada() { try { var x = JSON.parse(localStorage.getItem('eu_portada_libro') || 'null'); return x && EP.portada(x.id) ? x : null; } catch (e) { return null; } }
  function autoPara(C) {
    var mat = C.mat || '', cat = 'let';
    CAT.forEach(function (c) { if (c[0].test(mat)) cat = c[1]; });
    if (/^(cuaderno|agenda|caligrafia)/.test((C.prod && C.prod.id) || '')) cat = 'cua';
    var L = EP.lista(cat); if (!L.length) L = EP.lista();
    var mn = norm(C.matN), tit = norm(C.titulo), buenas = L.filter(function (p) { var t = norm(p.t + ' ' + p.n); return mn && (t.indexOf(mn) >= 0 || mn.indexOf(norm(p.t)) >= 0) || (tit && t.indexOf(tit) >= 0); });
    var pool = buenas.length ? buenas : L;
    return pool[H.hash((C.titulo || '') + mat) % pool.length].id;
  }
  function elegir(C) {
    var A = (C.cfg && C.cfg.acab) || {}, v = A.portadaPrem || '';
    if (v === 'enviada') { var e = enviada(); if (e) return { id: e.id, cfg: e.cfg || {} }; v = ''; }
    return { id: v && EP.portada(v) ? v : autoPara(C), cfg: {} };
  }
  function textoLibro(C) {
    var sub = C.libre ? (C.cfg.subtitulo || C.subtitulo || '') : [C.cursoN, C.N && C.N.n].filter(Boolean).join(' · ');
    return { titulo: C.titulo || C.matN || '', sub: sub, autor: C.cfg.autor || '', sello: C.cfg.centro || C.matN || '', anio: new Date().getFullYear() };
  }
  function svgPara(C) {
    var A = (C.cfg && C.cfg.acab) || {}, el = elegir(C), t = textoLibro(C), c = Object.assign({}, el.cfg);
    ['titulo', 'sub', 'autor', 'sello', 'anio'].forEach(function (k) { if (!c[k]) c[k] = t[k]; });
    if (A.portadaPal !== '' && A.portadaPal != null) c.pal = +A.portadaPal;
    delete c.ancho;
    return EP.svg(el.id, c).replace('style="width:100%;height:auto;display:block"', 'preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;display:block"');
  }
  ED.registrar({ post: function (h, pg, C) {
    if (pg.tipo !== 'portada') return h;
    var A = (C.cfg && C.cfg.acab) || {}; if (A.portada !== 'premium') return h;
    try { return '<div style="position:absolute;inset:0;overflow:hidden">' + svgPara(C) + '</div>'; } catch (e) { console.warn('portada premium', e); return h; }
  } });
  window.EU_PORTADAS_ED = { svgPara: svgPara, autoPara: autoPara, enviada: enviada };

  /* ─────────── panel ─────────── */
  var CN = window.EU_CONECTORES;
  if (CN && CN.panel && !CN.panel._prem) {
    var orig = CN.panel;
    var nuevo = function (ed, seccion, U) {
      var el = U.el, ST = U.ST, chip = U.chip, A = ed.cfg.acab || {}, setA = function (o) { ed.set('acab', Object.assign({}, ed.cfg.acab || {}, o)); };
      var s = seccion('Portada premium'), on = A.portada === 'premium';
      var f = el('div', ST.fila);
      [[true, 'Ilustración premium'], [false, 'Portada normal']].forEach(function (o) { var b = el('button', chip(on === o[0]), o[1]); b.onclick = function () { setA({ portada: o[0] ? 'premium' : 'auto' }); }; f.appendChild(b); });
      s.appendChild(f);
      if (on) {
        var v = A.portadaPrem || '', env = enviada();
        s.appendChild(el('div', ST.lbl, 'Ilustración'));
        var f2 = el('div', ST.fila);
        [['', 'Automática por materia']].concat(env ? [['enviada', 'La enviada desde Portadas premium']] : []).forEach(function (o) { var b = el('button', chip(v === o[0]), o[1]); b.onclick = function () { setA({ portadaPrem: o[0] }); }; f2.appendChild(b); });
        s.appendChild(f2);
        var sel = el('select', ST.campo + ';width:100%;margin-top:6px');
        var o0 = document.createElement('option'); o0.value = ''; o0.textContent = '— Elegir una de las 100 —'; sel.appendChild(o0);
        Object.keys(EP.CATS).forEach(function (k) { var g = document.createElement('optgroup'); g.label = EP.CATS[k]; EP.lista(k).forEach(function (p) { var o = document.createElement('option'); o.value = p.id; o.textContent = p.n + ' (' + p.t + ')'; if (p.id === v) o.selected = true; g.appendChild(o); }); sel.appendChild(g); });
        sel.onchange = function () { setA({ portadaPrem: sel.value }); };
        s.appendChild(sel);
        s.appendChild(el('div', ST.lbl, 'Paleta'));
        var g = el('div', 'display:flex;flex-wrap:wrap;gap:6px'), pv = A.portadaPal == null ? '' : String(A.portadaPal);
        [{ i: '', n: 'La de la portada' }].concat(EP.PAL.map(function (p, i) { return { i: String(i), n: p.n, p: p }; })).forEach(function (q) {
          var act = pv === q.i, b = el('button', 'display:flex;align-items:center;gap:5px;padding:4px 8px 4px 4px;border-radius:99px;border:1px solid ' + (act ? '#a855f7' : '#3b3b5c') + ';background:' + (act ? '#2a1b45' : 'transparent') + ';color:#cbd5e1;font:11px system-ui,sans-serif;cursor:pointer');
          b.innerHTML = (q.p ? '<span style="display:flex"><span style="width:14px;height:14px;border-radius:50%;background:' + q.p.f + '"></span><span style="width:14px;height:14px;border-radius:50%;background:' + q.p.a + ';margin-left:-4px"></span><span style="width:14px;height:14px;border-radius:50%;background:' + q.p.b + ';margin-left:-4px"></span></span>' : '') + q.n;
          b.onclick = function () { setA({ portadaPal: q.i }); }; g.appendChild(b);
        });
        s.appendChild(g);
        s.appendChild(el('div', ST.nota, 'La ilustración ocupa toda la portada, a sangre, con el título, el curso, el autor y el centro del libro. Para cambiar encuadre, letra o colores, abre «Portadas premium», ajústala y pulsa «Usar en mi libro».'));
      }
      return orig.apply(this, arguments);
    };
    nuevo._prem = true; Object.keys(orig).forEach(function (k) { if (!(k in nuevo)) nuevo[k] = orig[k]; });
    CN.panel = nuevo;
  }
})();
