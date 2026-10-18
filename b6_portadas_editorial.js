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
    var sub = C.libre ? (C.cfg.subtitulo || C.subtitulo || '') : [C.cursoN, C.N && C.N.n && String(C.cursoN).indexOf(C.N.n) !== 0 ? C.N.n : ''].filter(Boolean).join(' · ');
    return { titulo: C.titulo || C.matN || '', sub: sub, autor: C.cfg.autor || '', sello: C.cfg.centro || C.matN || '', anio: new Date().getFullYear() };
  }
  function svgPara(C) {
    var A = (C.cfg && C.cfg.acab) || {}, el = elegir(C), t = textoLibro(C), c = Object.assign({}, el.cfg);
    ['titulo', 'sub', 'autor', 'sello', 'anio'].forEach(function (k) { if (!c[k]) c[k] = t[k]; });
    if (A.portadaPal !== '' && A.portadaPal != null) c.pal = +A.portadaPal;
    delete c.ancho;
    return EP.svg(el.id, c).replace('style="width:100%;height:auto;display:block"', 'preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;display:block"');
  }
  /* ─── Estilos de curso (Fátima, 12-10-2026, de su archivo «Plantillas premium de portadas»): portada y contraportada a
     juego, con la foto subida en «Imágenes › Portada» a sangre como fondo (antes quedaba en un recuadro sobre hoja blanca)
     y el color de acento cambiable (acab.portadaAcc). acab.portada = 'estilo', acab.portadaEst = id del estilo. ─── */
  var FUENTES_EST = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800&family=Playfair+Display:ital,wght@0,700;0,900;1,500&family=Oswald:wght@500;700&family=Dancing+Script:wght@600&display=swap">';
  var ESTILOS = {
    medianoche: { n: 'Medianoche y oro', bg: '#16223A', bg2: '#0D1626', tx: '#F6F1E7', acc: '#B08D57', tit: "'Playfair Display',Georgia,serif", may: 0,
      deco: function (a) { return '<div style="position:absolute;inset:9mm;border:.5mm solid ' + a + ';pointer-events:none"></div><div style="position:absolute;inset:11mm;border:.2mm solid ' + a + ';opacity:.6;pointer-events:none"></div>'; } },
    aurora: { n: 'Aurora', bg: '#0B1026', bg2: '#1B1446', tx: '#FFFFFF', acc: '#22D3EE', tit: "'Montserrat',system-ui,sans-serif", may: 0,
      deco: function (a) { return '<div style="position:absolute;width:150mm;height:150mm;right:-50mm;top:-40mm;border-radius:50%;background:radial-gradient(circle,rgba(139,92,246,.55),transparent 65%)"></div><div style="position:absolute;width:130mm;height:130mm;left:-50mm;top:70mm;border-radius:50%;background:radial-gradient(circle,' + a + '55,transparent 65%)"></div>'; } },
    oro_noir: { n: 'Oro Noir', bg: '#14110F', bg2: '#221C17', tx: '#F4EDE0', acc: '#C9A45C', tit: "'Playfair Display',Georgia,serif", may: 0,
      deco: function (a) { return '<div style="position:absolute;left:14mm;right:14mm;top:14mm;border-top:.5mm solid ' + a + '"></div><div style="position:absolute;left:14mm;right:14mm;bottom:14mm;border-top:.5mm solid ' + a + '"></div>'; } },
    coral: { n: 'Coral Pop', bg: '#FFF4E6', bg2: '#FFE8CC', tx: '#1F1B18', acc: '#FF6B57', tit: "'Oswald',Impact,sans-serif", may: 1,
      deco: function (a) { return '<div style="position:absolute;width:90mm;height:90mm;right:-22mm;top:-22mm;border-radius:50%;background:' + a + '"></div><div style="position:absolute;width:46mm;height:46mm;right:40mm;top:40mm;background:#FFC145"></div><div style="position:absolute;left:0;bottom:0;width:40mm;height:12mm;background:' + a + '"></div>'; } },
    bosque: { n: 'Bosque', bg: '#1F3A2E', bg2: '#2D4F3E', tx: '#F3EEE2', acc: '#C8724F', tit: "'Playfair Display',Georgia,serif", may: 0, firma: "'Dancing Script',cursive",
      deco: function (a) { return '<div style="position:absolute;width:110mm;height:110mm;right:-30mm;top:-30mm;border-radius:50%;background:#9CB89A;opacity:.5"></div><div style="position:absolute;width:70mm;height:35mm;left:20mm;top:30mm;border-radius:35mm 35mm 0 0;border:1.2mm solid ' + a + ';border-bottom:0"></div>'; } },
    neon: { n: 'Neón Tech', bg: '#0A0F1C', bg2: '#0F172A', tx: '#E2E8F0', acc: '#A3E635', tit: "'Oswald',Impact,sans-serif", may: 1,
      deco: function (a) { return '<div style="position:absolute;inset:0;background-image:linear-gradient(rgba(59,130,246,.18) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,.18) 1px,transparent 1px);background-size:8mm 8mm"></div><div style="position:absolute;right:14mm;top:22mm;font:9px/1.6 monospace;color:' + a + ';opacity:.85;text-align:right">&lt;curso premium/&gt;<br>nivel: 1 → pro</div>'; } }
  };
  /* Masterclass (Fátima, 12-10-2026, de su póster «Peluquería Premium»): negro y oro, título en mayúsculas con serifa,
     «Premium» manuscrito, la foto a la derecha fundida en negro, tres rasgos con icono y banda final.
     Imagen completa: el diseño subido tal cual, sin texto encima (en Peluquería, sin foto, su póster de referencias/). */
  ESTILOS.masterclass = { n: 'Masterclass negro y oro', bg: '#0E0D0C', bg2: '#1A1714', tx: '#FFFFFF', acc: '#D4AF6A', tit: "'Playfair Display',Georgia,serif", may: 1, firma: "'Dancing Script',cursive", deco: function () { return ''; } };
  ESTILOS.imagen = { n: 'Imagen completa (diseño propio)', bg: '#0E0D0C', bg2: '#1A1714', tx: '#FFFFFF', acc: '#D4AF6A', tit: "'Playfair Display',Georgia,serif", deco: function () { return ''; } };
  var POSTER = '';
  try { fetch('./referencias/portada_peluqueria_premium.jpg').then(function (r) { return r.ok ? r.blob() : null; }).then(function (b) { if (!b) return; var fr = new FileReader(); fr.onload = function () { POSTER = fr.result; }; fr.readAsDataURL(b); }).catch(function () { }); } catch (e) { }
  var ICO = {
    tijera: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12"/></svg>',
    birrete: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/></svg>',
    reloj: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'
  };
  function portadaMaster(C) {
    var E = ESTILOS.masterclass, A = (C.cfg && C.cfg.acab) || {}, acc = A.portadaAcc || E.acc, t = textoLibro(C), img = C.cfg && C.cfg.portadaImg, M = 'Montserrat,system-ui,sans-serif';
    var lema = C.mat === 'pelu' ? 'Corte · Técnica · Precisión · Resultados' : t.sub;
    var rasgos = [['tijera', 'Técnicas paso a paso'], ['birrete', 'Método profesional'], ['reloj', 'Aprende a tu ritmo']];
    return FUENTES_EST + '<div style="position:absolute;inset:0;overflow:hidden;background:' + E.bg + ';color:#fff">' +
      (img ? '<div style="position:absolute;top:0;right:0;bottom:22%;width:66%;background:url(' + img + ') center/cover no-repeat"></div><div style="position:absolute;top:0;right:0;bottom:22%;width:66%;background:linear-gradient(90deg,' + E.bg + ' 0%,' + rgba(E.bg, .3) + ' 26%,transparent 50%),linear-gradient(0deg,' + E.bg + ' 0%,transparent 22%)"></div>'
        : '<div style="position:absolute;width:120mm;height:120mm;right:-30mm;top:10mm;border-radius:50%;background:radial-gradient(circle,' + rgba(acc, .28) + ',transparent 65%)"></div>') +
      '<div style="position:absolute;left:14mm;right:14mm;top:16mm;display:flex;flex-direction:column;gap:2mm;max-width:60%">' +
      '<div style="font:500 .78em/1.2 ' + M + ';letter-spacing:.3em;text-transform:uppercase;opacity:.9">Curso profesional · ' + escH(C.matN || '') + '</div>' +
      '<div style="font-family:' + E.tit + ';font-weight:700;text-transform:uppercase;font-size:' + (C.fs * 3.2) + 'px;line-height:1.02">' + escH(t.titulo) + '</div>' +
      '<div style="font-family:' + E.firma + ';color:' + acc + ';font-size:' + (C.fs * 3.4) + 'px;line-height:.9;margin-top:-1mm">Premium</div>' +
      (lema ? '<div style="font:500 .78em/1.3 ' + M + ';letter-spacing:.14em;text-transform:uppercase;margin-top:3mm">' + escH(lema) + '</div>' : '') + '</div>' +
      '<div style="position:absolute;left:14mm;right:14mm;bottom:26%;display:flex;gap:6mm;font:600 .66em/1.25 ' + M + ';letter-spacing:.08em;text-transform:uppercase">' +
      rasgos.map(function (r, i) { return '<div style="display:flex;flex-direction:column;gap:1.5mm;color:#fff;' + (i ? 'padding-left:6mm;border-left:.3mm solid ' + rgba(acc, .6) : '') + '"><span style="color:' + acc + '">' + ICO[r[0]] + '</span>' + r[1] + '</div>'; }).join('') + '</div>' +
      '<div style="position:absolute;left:0;right:0;bottom:0;height:22%;background:' + E.bg2 + ';border-top:.4mm solid ' + acc + ';display:flex;flex-direction:column;justify-content:center;align-items:center;gap:2mm;text-align:center;padding:0 14mm">' +
      '<div style="font-family:' + E.firma + ';color:' + acc + ';font-size:1.9em">' + escH(t.autor || '') + '</div>' +
      '<div style="font:500 .72em/1.3 ' + M + ';letter-spacing:.24em;text-transform:uppercase;opacity:.85">' + escH(C.cfg.centro || '') + (C.cfg.centro ? ' · ' : '') + t.anio + '</div></div></div>';
  }
  function portadaImagen(C) {
    var img = (C.cfg && C.cfg.portadaImg) || (C.mat === 'pelu' ? POSTER : '');
    if (!img) return portadaMaster(C);
    return '<div style="position:absolute;inset:0;overflow:hidden;background:#0E0D0C url(' + img + ') center/cover no-repeat"></div>';
  }
  function estiloDe(C) { var A = (C.cfg && C.cfg.acab) || {}; return ESTILOS[A.portadaEst] || ESTILOS[C.mat === 'pelu' ? 'medianoche' : 'aurora']; }
  function escH(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function rgba(hex, a) { var h = String(hex).replace('#', ''); if (h.length === 3) h = h.replace(/./g, '$&$&'); var n = parseInt(h, 16) || 0; return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')'; }
  function fondoEst(E, C, fuerte) {
    var img = C.cfg && C.cfg.portadaImg, base = 'linear-gradient(160deg,' + E.bg + ',' + E.bg2 + ')';
    return img ? 'background:linear-gradient(to top,' + rgba(E.bg, fuerte ? .96 : .92) + ' 0%,' + rgba(E.bg, fuerte ? .8 : .45) + ' 48%,' + rgba(E.bg, fuerte ? .55 : .08) + ' 100%),url(' + img + ') center/cover no-repeat,' + E.bg
      : 'background:' + base;
  }
  function portadaEstilo(C) {
    var E = estiloDe(C), A = (C.cfg && C.cfg.acab) || {}, acc = A.portadaAcc || E.acc, t = textoLibro(C), img = C.cfg && C.cfg.portadaImg;
    var tt = E.may ? 'text-transform:uppercase;letter-spacing:.02em;' : '';
    return FUENTES_EST + '<div style="position:absolute;inset:0;overflow:hidden;' + fondoEst(E, C) + ';color:' + E.tx + '">' + (img ? '' : E.deco(acc)) +
      '<div style="position:absolute;left:16mm;right:16mm;top:18mm;font:600 .78em/1.2 Montserrat,system-ui,sans-serif;letter-spacing:.22em;text-transform:uppercase;color:' + acc + '">' + escH(C.matN || '') + '</div>' +
      '<div style="position:absolute;left:16mm;right:16mm;bottom:22mm;display:flex;flex-direction:column;gap:4mm">' +
      '<div style="width:22mm;height:1.2mm;background:' + acc + '"></div>' +
      '<div style="font-family:' + E.tit + ';font-weight:900;' + tt + 'font-size:' + (C.fs * 3.6) + 'px;line-height:1.02">' + escH(t.titulo) + '</div>' +
      (t.sub ? '<div style="font:500 1.05em/1.35 Montserrat,system-ui,sans-serif;opacity:.92">' + escH(t.sub) + '</div>' : '') +
      '<div style="margin-top:6mm;display:flex;justify-content:space-between;align-items:flex-end;gap:6mm;font-family:Montserrat,system-ui,sans-serif">' +
      '<div><div style="' + (E.firma ? 'font-family:' + E.firma + ';font-size:1.6em;' : 'font-weight:800;font-size:1.05em;') + 'color:' + acc + '">' + escH(t.autor) + '</div><div style="font-size:.82em;opacity:.8">' + escH(C.cfg.centro || '') + '</div></div>' +
      '<div style="font-size:.75em;letter-spacing:.18em;text-transform:uppercase;opacity:.75">' + t.anio + '</div></div></div></div>';
  }
  /* contraportada a juego: se cambia solo el fondo de la del motor (el texto, la licencia y el sello de b6_derechos siguen) */
  function contraEstilo(h, C) {
    var E = estiloDe(C), claro = E.tx === '#1F1B18', bg = claro ? 'background:linear-gradient(160deg,' + ((C.cfg.acab || {}).portadaAcc || E.acc) + ',#1F1B18)' : fondoEst(E, C, true);
    return FUENTES_EST + String(h).replace(/(position:absolute;inset:0;)background:[^;]+;/, '$1' + bg + ';');
  }
  ED.registrar({ post: function (h, pg, C) {
    var A0 = (C.cfg && C.cfg.acab) || {};
    if (A0.portada === 'estilo' && (pg.tipo === 'portada' || pg.tipo === 'contra')) { try { return pg.tipo === 'portada' ? (A0.portadaEst === 'masterclass' ? portadaMaster(C) : A0.portadaEst === 'imagen' ? portadaImagen(C) : portadaEstilo(C)) : contraEstilo(h, C); } catch (e) { console.warn('portada estilo', e); return h; } }
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
      var s = seccion('Portada premium'), on = A.portada === 'premium', est = A.portada === 'estilo';
      var f = el('div', ST.fila);
      [['premium', 'Ilustración premium'], ['estilo', 'Estilo de curso (con tu foto)'], ['auto', 'Portada normal']].forEach(function (o) { var b = el('button', chip(o[0] === 'auto' ? !on && !est : A.portada === o[0]), o[1]); b.onclick = function () { setA({ portada: o[0] }); }; f.appendChild(b); });
      s.appendChild(f);
      if (est) {
        var ve = A.portadaEst || '', fe = el('div', ST.fila);
        [['', 'Automático']].concat(Object.keys(ESTILOS).map(function (k) { return [k, ESTILOS[k].n]; })).forEach(function (o) {
          var E = ESTILOS[o[0]], b = el('button', chip(ve === o[0]), o[1]);
          if (E) b.innerHTML = '<span style="display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:5px;background:' + E.bg + ';box-shadow:inset 0 0 0 3px ' + E.acc + '"></span>' + escH(o[1]);
          b.onclick = function () { setA({ portadaEst: o[0] }); }; fe.appendChild(b);
        });
        s.appendChild(fe);
        s.appendChild(el('div', ST.lbl, 'Color de acento'));
        var fc = el('div', 'display:flex;gap:8px;align-items:center'), ci = document.createElement('input'); ci.type = 'color'; ci.value = A.portadaAcc || (ESTILOS[ve] || ESTILOS.medianoche).acc;
        ci.oninput = function () { setA({ portadaAcc: ci.value }); }; fc.appendChild(ci);
        var rb = el('button', chip(false), 'El del estilo'); rb.onclick = function () { setA({ portadaAcc: '' }); }; fc.appendChild(rb);
        s.appendChild(fc);
        s.appendChild(el('div', ST.nota, 'Portada y contraportada a juego. La foto que subas en «Imágenes › Portada» va de fondo a sangre, con el título encima; sin foto, sale el dibujo del estilo.'));
      }
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
