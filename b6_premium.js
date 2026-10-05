/* b6_premium.js — Acabado premium del Editorial.
   Se engancha al motor con EU_EDITORIAL.registrar({ ajuste, post }) sin tocar lo construido:
   · Dibujos 2D / 3D: los diagramas SVG del motor (mapas, ciclos, flujos, líneas de tiempo,
     fracciones, balanza, vistas…) ganan volumen: extrusión, luz especular y sombra.
     Las páginas para colorear, caligrafía y pasatiempos quedan en línea limpia (2D) siempre.
   · Tipografía fina: kerning, ligaduras, guiones, sin viudas ni huérfanas.
   · Folio editorial: número de página con filete y título del libro.
   · Panel: sección «Acabado premium» dentro del Editorial. */
(function () {
  var ED = window.EU_EDITORIAL;
  if (!ED || window.EU_PREMIUM || ED._premium) return;
  ED._premium = true;

  var SIN_3D = /^(col_|cal_|pas_|inf_libre)/;
  var DEF = { dibujo: '3d', premium: true };
  function opc(cfg) { var a = (cfg && cfg.acab) || {}; return { dibujo: a.dibujo || DEF.dibujo, premium: a.premium !== false }; }

  function rgb(c) { c = String(c).replace('#', ''); if (c.length === 3) c = c.replace(/./g, '$&$&'); return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]; }
  function oscurece(c, t) { var A = rgb(c); if (A.some(isNaN)) return null; return '#' + A.map(function (v) { return Math.round(v * (1 - t)).toString(16).padStart(2, '0'); }).join(''); }
  function esBlanco(c) { return /^(#fff(fff)?|white|none|transparent)$/i.test(c); }

  /* ─────────── dibujos en 3D ─────────── */
  var cont = 0;
  function defs3d(id) {
    return '<defs><filter id="' + id + '" x="-15%" y="-15%" width="130%" height="150%" color-interpolation-filters="sRGB">' +
      '<feGaussianBlur in="SourceAlpha" stdDeviation="2" result="b"/>' +
      '<feSpecularLighting in="b" surfaceScale="3.2" specularConstant=".6" specularExponent="20" lighting-color="#ffffff" result="s"><feDistantLight azimuth="235" elevation="50"/></feSpecularLighting>' +
      '<feComposite in="s" in2="SourceAlpha" operator="in" result="s2"/>' +
      '<feComposite in="SourceGraphic" in2="s2" operator="arithmetic" k1="0" k2="1" k3=".55" k4="0" result="luz"/>' +
      '<feDropShadow in="luz" dx="0" dy="2.4" stdDeviation="2" flood-color="#000000" flood-opacity=".22"/>' +
      '</filter></defs>';
  }
  /* Cada figura rellena recibe un canto (copia desplazada y más oscura) y el filtro de luz. */
  function volumen(svg) {
    var id = 'eu3d' + (++cont), hay = false;
    var out = svg.replace(/<(rect|circle|ellipse|polygon|path)\b([^>]*?)(\/?)>/g, function (m, tag, at, cierre) {
      var f = /\sfill="([^"]+)"/.exec(at);
      if (!f || esBlanco(f[1]) || /url\(/.test(f[1]) || /clip-path|<clipPath/.test(at)) return m;
      var canto = oscurece(f[1], 0.32);
      if (!canto) return m;
      hay = true;
      var base = at.replace(/\sfill="[^"]+"/, ' fill="' + canto + '"').replace(/\sstroke="[^"]+"/, ' stroke="' + canto + '"');
      var tr = /\stransform="([^"]+)"/.exec(at);
      base = tr ? base.replace(/\stransform="[^"]+"/, ' transform="translate(2.2 3) ' + tr[1] + '"') : base + ' transform="translate(2.2 3)"';
      return '<' + tag + base + cierre + '>' + '<' + tag + at + ' filter="url(#' + id + ')"' + cierre + '>';
    });
    if (!hay) return svg;
    return out.replace(/(<svg\b[^>]*>)/, '$1' + defs3d(id));
  }
  function dibujos3d(h) {
    return h.replace(/<svg\b[\s\S]*?<\/svg>/g, function (s) {
      if (/<clipPath|data-plano/.test(s)) return s;
      return volumen(s);
    });
  }

  /* ─────────── folio editorial ─────────── */
  var RE_FOLIO = /<div style="position:absolute;bottom:8mm;(left|right):17mm;font-size:\.75em;color:([^;]+);opacity:\.65;font-variant-numeric:tabular-nums">(\d+)<\/div>/g;
  function folioPro(h, C) {
    var T = C.T, tit = ED.H.esc(String(C.titulo || '').slice(0, 60));
    return h.replace(RE_FOLIO, function (m, lado, col, n) {
      var izq = lado === 'left';
      var num = '<span style="font-variant-numeric:tabular-nums lining-nums;font-weight:600;color:' + T.acc + '">' + n + '</span>';
      var filete = '<span style="width:6mm;border-top:0.25mm solid ' + col + ';opacity:.5"></span>';
      var rot = '<span style="font-size:.86em;letter-spacing:.12em;text-transform:uppercase;opacity:.6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:90mm">' + tit + '</span>';
      return '<div style="position:absolute;bottom:8mm;' + lado + ':17mm;display:flex;align-items:center;gap:2.5mm;font-size:.72em;color:' + col + '">' + (izq ? num + filete + rot : rot + filete + num) + '</div>';
    });
  }

  /* ─────────── ganchos ─────────── */
  function ajuste(C) { C.prem = opc(C.cfg); }
  function post(h, pg, C) {
    var O = C.prem || opc(C.cfg);
    if (O.dibujo === '3d' && !SIN_3D.test(pg.tipo || '')) h = dibujos3d(h);
    if (O.premium) {
      if (!/^(portada|contra|car_|s_)/.test(pg.tipo || '') && C.papelId !== 'slide' && C.papelId !== 'cuadrado') h = folioPro(h, C);
      h = '<div style="display:contents;font-kerning:normal;font-feature-settings:\'kern\' 1,\'liga\' 1;text-rendering:optimizeLegibility;hyphens:auto;-webkit-hyphens:auto;orphans:3;widows:3;text-wrap:pretty">' + h + '</div>';
    }
    return h;
  }
  ED.registrar({ ajuste: ajuste, post: post });

  /* ─────────── panel ─────────── */
  var CN = window.EU_CONECTORES;
  if (CN && CN.panel && !CN.panel._premium) {
    var orig = CN.panel;
    var nuevo = function (ed, seccion, U) {
      var el = U.el, ST = U.ST, chip = U.chip, O = opc(ed.cfg);
      var setO = function (k, v) { var a = Object.assign({}, ed.cfg.acab || {}); a[k] = v; ed.set('acab', a); };
      var s = seccion('Acabado premium');
      var fila = function (opts, val, fn) {
        var f = el('div', ST.fila);
        opts.forEach(function (o) { var b = el('button', chip(val === o[0]), o[1]); b.onclick = function () { fn(o[0]); }; f.appendChild(b); });
        s.appendChild(f);
      };
      s.appendChild(el('div', ST.lbl, 'Dibujos y diagramas'));
      fila([['2d', '2D plano'], ['3d', '3D con volumen']], O.dibujo, function (v) { setO('dibujo', v); });
      s.appendChild(el('div', ST.lbl, 'Maquetación'));
      fila([[true, 'Premium'], [false, 'Básica']], O.premium, function (v) { setO('premium', v); });
      s.appendChild(el('div', ST.nota, (O.dibujo === '3d' ? 'Mapas, ciclos, flujos, líneas de tiempo, fracciones y demás diagramas salen con canto, luz y sombra. ' : 'Diagramas en línea plana, ideales para fotocopiar en blanco y negro. ') +
        'Las páginas para colorear, de caligrafía y de pasatiempos se mantienen siempre en 2D para poder pintar y escribir encima.' +
        (O.premium ? ' Premium añade kerning, ligaduras, partición de palabras, control de viudas y huérfanas y folio editorial con el título del libro.' : '')));
      return orig.apply(this, arguments);
    };
    nuevo._premium = true;
    CN.panel = nuevo;
  }

  window.EU_PREMIUM = { opc: opc, dibujos3d: dibujos3d };
})();
