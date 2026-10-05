/* b6_colorear_plus.js — Más láminas para colorear (window.EU_COLOREAR_PLUS).
   · Mapas: contorno real de los 8 países (EU_MAPAS_DATOS) con ciudades, rosa de los vientos y consigna.
   · Banderas: las 8 banderas en línea, con zonas numeradas y su leyenda de colores.
   · Frutas y plantas: dibujos de EU_BOTANICA en línea, con el modelo en color al lado.
   Entran en el libro para colorear en rotación con los dibujos, mandalas y une los puntos (en Geografía
   y Sociales, los mapas y banderas van primero). También se pueden elegir en «Para colorear».
   Cargar después de b6_cerebro_infantil.js, b6_mapas_datos.js y b6_botanica.js. */
(function () {
  var ED = window.EU_EDITORIAL, CU = window.EU_CURRICULO;
  if (!ED || window.EU_COLOREAR_PLUS) return;
  var H = ED.H, esc = H.esc, NS = 'xmlns="http://www.w3.org/2000/svg"';
  var PAIS = { es: 'España', mx: 'México', co: 'Colombia', ar: 'Argentina', cl: 'Chile', ve: 'Venezuela', do: 'República Dominicana', us: 'Estados Unidos' };
  var COL = { rojo: '#D62828', amarillo: '#F7C948', azul: '#1D4E9E', celeste: '#74ACDF', verde: '#1B7F3B', blanco: '#FFFFFF', marron: '#8A5A2B' };
  function r1(n) { return Math.round(n * 10) / 10; }
  function ancho(C) { return C.papel.w - 34; }
  function consigna(C, t) { return '<p style="font-size:1.08em;margin:0 0 5mm;max-width:160mm">' + esc(t) + '</p>'; }
  function leyenda(C, L) { return '<div style="display:flex;flex-wrap:wrap;gap:3mm 6mm;margin:5mm 0 0;justify-content:center">' + L.map(function (x, i) { return '<div style="display:flex;align-items:center;gap:2mm"><span style="width:8mm;height:8mm;border-radius:50%;background:' + COL[x] + ';border:0.3mm solid #222;display:flex;align-items:center;justify-content:center;font-weight:700;color:' + (x === 'blanco' || x === 'amarillo' || x === 'celeste' ? '#222' : '#fff') + '">' + (i + 1) + '</span><span>' + x.replace('marron', 'marrón') + '</span></div>'; }).join('') + '</div>'; }

  /* ─────────── mapas ─────────── */
  function rosa(x, y, s) { return '<g transform="translate(' + x + ' ' + y + ')" stroke="#222" stroke-width="1.4" fill="#fff"><polygon points="0,-' + s + ' ' + s * .22 + ',0 0,' + s + ' -' + s * .22 + ',0"/><polygon points="-' + s + ',0 0,' + s * .22 + ' ' + s + ',0 0,-' + s * .22 + '"/><circle r="' + s * .14 + '"/><text y="-' + (s + 6) + '" text-anchor="middle" font-size="' + s * .5 + '" font-family="sans-serif" font-weight="700" fill="#222" stroke="none">N</text></g>'; }
  function mapaSVG(pk, C) {
    var D = (window.EU_MAPAS_DATOS || {})[pk]; if (!D) return '';
    var pad = 30, W = D.w + pad * 2 + 70, Hh = D.h + pad * 2, s = '';
    for (var i = 0; i < W; i += 14) s += '<path d="M' + i + ',0 l-' + Hh + ',' + Hh + '" stroke="#9aa" stroke-width=".5" opacity=".35"/>';
    s = '<clipPath id="cm' + pk + '"><rect width="' + W + '" height="' + Hh + '"/></clipPath><g clip-path="url(#cm' + pk + ')">' + s + '</g>';
    s += '<g transform="translate(' + pad + ' ' + pad + ')"><path d="' + D.d + '" fill="#fff" stroke="#222" stroke-width="2" stroke-linejoin="round"/>';
    D.c.forEach(function (c) { s += c[3] ? '<g><polygon points="' + r1(c[1]) + ',' + r1(c[2] - 7) + ' ' + r1(c[1] + 6.5) + ',' + r1(c[2] + 4) + ' ' + r1(c[1] - 6.5) + ',' + r1(c[2] + 4) + '" fill="#fff" stroke="#222" stroke-width="1.4"/></g>' : '<circle cx="' + r1(c[1]) + '" cy="' + r1(c[2]) + '" r="3.6" fill="#fff" stroke="#222" stroke-width="1.4"/>'; s += '<text x="' + r1(c[1] + 8) + '" y="' + r1(c[2] + 4) + '" font-size="10" font-family="sans-serif" fill="#222" stroke="#fff" stroke-width="3" paint-order="stroke">' + esc(c[0]) + '</text>'; });
    s += '</g>' + rosa(W - 34, 44, 20);
    return '<svg ' + NS + ' data-plano="1" viewBox="0 0 ' + W + ' ' + Hh + '" style="width:100%;height:auto;display:block;border:0.4mm solid #222">' + s + '</svg>';
  }
  /* ─────────── banderas (300 × 200) ─────────── */
  function n(x, y, k) { return '<circle cx="' + x + '" cy="' + y + '" r="11" fill="#fff" stroke="#222" stroke-width="1.2"/><text x="' + x + '" y="' + (y + 5) + '" text-anchor="middle" font-size="13" font-weight="700" font-family="sans-serif" fill="#222">' + k + '</text>'; }
  function R(x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="#fff" stroke="#222" stroke-width="2"/>'; }
  function estrella(cx, cy, r) { var p = []; for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .42 : r; p.push(r1(cx + Math.cos(a) * rr) + ',' + r1(cy + Math.sin(a) * rr)); } return '<polygon points="' + p.join(' ') + '" fill="#fff" stroke="#222" stroke-width="1.2"/>'; }
  var BAN = {
    es: [['rojo', 'amarillo'], function () { return R(0, 0, 300, 50) + R(0, 50, 300, 100) + R(0, 150, 300, 50) + n(150, 25, 1) + n(150, 100, 2) + n(150, 175, 1); }],
    mx: [['verde', 'blanco', 'rojo', 'marron'], function () { return R(0, 0, 100, 200) + R(100, 0, 100, 200) + R(200, 0, 100, 200) + '<ellipse cx="150" cy="100" rx="30" ry="34" fill="#fff" stroke="#222" stroke-width="1.6"/>' + n(50, 100, 1) + n(150, 30, 2) + n(250, 100, 3) + n(150, 100, 4); }],
    co: [['amarillo', 'azul', 'rojo'], function () { return R(0, 0, 300, 100) + R(0, 100, 300, 50) + R(0, 150, 300, 50) + n(150, 50, 1) + n(150, 125, 2) + n(150, 175, 3); }],
    ar: [['celeste', 'blanco', 'amarillo'], function () { var s = ''; for (var i = 0; i < 16; i++) { var a = i * Math.PI / 8; s += '<line x1="' + r1(150 + Math.cos(a) * 16) + '" y1="' + r1(100 + Math.sin(a) * 16) + '" x2="' + r1(150 + Math.cos(a) * 26) + '" y2="' + r1(100 + Math.sin(a) * 26) + '" stroke="#222" stroke-width="1.4"/>'; } return R(0, 0, 300, 67) + R(0, 67, 300, 66) + R(0, 133, 300, 67) + s + '<circle cx="150" cy="100" r="15" fill="#fff" stroke="#222" stroke-width="1.4"/>' + n(150, 33, 1) + n(60, 100, 2) + n(150, 167, 1) + n(150, 100, 3); }],
    cl: [['azul', 'blanco', 'rojo'], function () { return R(0, 0, 100, 100) + R(100, 0, 200, 100) + R(0, 100, 300, 100) + estrella(50, 50, 26) + n(18, 18, 1) + n(200, 50, 2) + n(150, 150, 3) + n(50, 52, 2); }],
    ve: [['amarillo', 'azul', 'rojo', 'blanco'], function () { var s = ''; for (var i = 0; i < 8; i++) { var a = Math.PI * (1.2 + i * .6 / 7); s += estrella(r1(150 + Math.cos(a) * 44), r1(118 + Math.sin(a) * 44), 7); } return R(0, 0, 300, 67) + R(0, 67, 300, 66) + R(0, 133, 300, 67) + s + n(150, 33, 1) + n(260, 100, 2) + n(150, 167, 3) + n(150, 100, 4); }],
    do: [['azul', 'rojo', 'blanco'], function () { return R(0, 0, 125, 80) + R(175, 120, 125, 80) + R(175, 0, 125, 80) + R(0, 120, 125, 80) + R(125, 0, 50, 200) + R(0, 80, 300, 40) + '<rect x="132" y="84" width="36" height="32" fill="#fff" stroke="#222" stroke-width="1.4"/>' + n(62, 40, 1) + n(238, 160, 1) + n(238, 40, 2) + n(62, 160, 2) + n(150, 30, 3) + n(270, 100, 3); }],
    us: [['rojo', 'blanco', 'azul'], function () { var s = ''; for (var i = 0; i < 13; i++) s += '<rect x="0" y="' + r1(i * 200 / 13) + '" width="300" height="' + r1(200 / 13) + '" fill="#fff" stroke="#222" stroke-width="1"/>'; s += '<rect x="0" y="0" width="130" height="' + r1(7 * 200 / 13) + '" fill="#fff" stroke="#222" stroke-width="2"/>'; for (var y = 0; y < 5; y++) for (var x = 0; x < 6; x++) s += '<circle cx="' + (14 + x * 20 + (y % 2) * 8) + '" cy="' + (14 + y * 20) + '" r="3" fill="#fff" stroke="#222" stroke-width="1"/>'; return s + n(210, r1(200 / 26), 1) + n(210, r1(200 / 13 * 1.5), 2) + n(65, 52, 3); }]
  };
  function banderaSVG(pk) { return '<svg ' + NS + ' data-plano="1" viewBox="-4 -4 308 208" style="width:100%;height:auto;display:block">' + BAN[pk][1]() + '</svg>'; }

  var paginas = {
    col_mapa: function (pg, C) {
      var w = Math.min(ancho(C), 170), pk = pg.pk;
      return H.cabecera(C, pg) + H.h1(C, esc('Colorea el mapa de ' + PAIS[pk])) + consigna(C, 'Pinta el país de verde y el mar de azul. Marca la capital (el triángulo) de rojo y repasa el nombre de cada ciudad.') +
        '<div style="width:' + w + 'mm;margin:0 auto">' + mapaSVG(pk, C) + '</div>' + (window.EU_MAPAS_DATOS[pk].c.length ? '<div style="display:flex;flex-wrap:wrap;gap:2mm 5mm;justify-content:center;margin-top:5mm;font-size:1.05em">' + window.EU_MAPAS_DATOS[pk].c.map(function (c) { return '<span style="border-bottom:0.3mm dashed #999;padding:0 1mm">' + esc(c[0]) + '</span>'; }).join('') + '</div>' : '') + H.folio(C, pg);
    },
    col_bandera: function (pg, C) {
      var w = Math.min(ancho(C), 160), pk = pg.pk;
      return H.cabecera(C, pg) + H.h1(C, esc('La bandera de ' + PAIS[pk])) + consigna(C, 'Colorea cada zona con el color de su número.') + '<div style="width:' + w + 'mm;margin:0 auto">' + banderaSVG(pk) + '</div>' + leyenda(C, BAN[pk][0]) + H.folio(C, pg);
    },
    col_botanica: function (pg, C) {
      var B = window.EU_BOTANICA, w = Math.min(ancho(C) - 20, 150), D = B.D[pg.b];
      return H.cabecera(C, pg) + H.h1(C, esc('Colorea: ' + D[1].toLowerCase())) + consigna(C, 'Mira el modelo pequeño y usa sus colores, o inventa los tuyos.') +
        '<div style="position:relative;width:' + w + 'mm;margin:0 auto">' + B.dibujo(pg.b, { modo: 'linea', T: C.T }) + '<div style="position:absolute;right:-12mm;top:-8mm;width:26mm;padding:2mm;border:0.3mm solid ' + C.T.soft + ';border-radius:' + Math.max(4, C.T.r) + 'px;background:' + C.T.bg + '">' + B.dibujo(pg.b, { modo: 'color', T: C.T }) + '<div style="font-size:.7em;text-align:center;opacity:.8">modelo</div></div></div>' +
        '<div style="text-align:center;margin-top:5mm;font-family:' + C.T.tit + ';font-size:' + (C.fs * 2.4) + 'px;color:transparent;-webkit-text-stroke:0.35mm #555;letter-spacing:.06em">' + esc(D[1].toUpperCase()) + '</div>' + H.folio(C, pg);
    }
  };
  var voz = { col_mapa: function (pg) { return 'Colorea el mapa de ' + PAIS[pg.pk] + '.'; }, col_bandera: function (pg) { return 'Colorea la bandera de ' + PAIS[pg.pk] + '.'; }, col_botanica: function (pg) { return 'Colorea ' + window.EU_BOTANICA.D[pg.b][1].toLowerCase() + '.'; } };
  ED.registrar({ paginas: paginas, voz: voz });

  var MIOS = ['botanica', 'mapa', 'bandera'], CAB = { botanica: 'Frutas, plantas y animales', mapa: 'Mapas', bandera: 'Banderas' };
  var M = CU && CU.materia && CU.materia('infantil');
  if (M) (M.opciones || []).forEach(function (o) { if (o.k === 'dibujos' && !o.ops.some(function (x) { return x[0] === 'mapa'; })) o.ops.push(['botanica', 'Frutas y plantas'], ['mapa', 'Mapas'], ['bandera', 'Banderas']); });

  var ens = ED.ensamblar;
  ED.ensamblar = function (cfg) {
    var op = cfg.op || {}, sel = op.dibujos || [], mios = sel.filter(function (x) { return MIOS.indexOf(x) >= 0; }), otros = sel.filter(function (x) { return MIOS.indexOf(x) < 0; });
    var cfg2 = cfg;
    if (cfg.prod === 'colorear' && mios.length) cfg2 = Object.assign({}, cfg, { op: Object.assign({}, op, { dibujos: otros.length ? otros : ['figura'] }) });
    var res = ens(cfg2);
    try {
      var C = res.C; if (C.prod.id !== 'colorear') return res;
      if (cfg2 !== cfg) C.cfg = cfg;
      var B = window.EU_BOTANICA, MD = window.EU_MAPAS_DATOS, geo = /^(geografia|sociales|historia)$/.test(C.mat);
      var tipos = mios.length ? mios : geo ? ['mapa', 'bandera', 'botanica'] : ['botanica', 'mapa', 'botanica', 'bandera'];
      tipos = tipos.filter(function (t) { return t === 'botanica' ? !!B : !!MD; }); if (!tipos.length) return res;
      var cuota = mios.length ? (otros.length ? mios.length / (mios.length + otros.length) : 1) : geo ? .6 : .4;
      var paises = [C.pk].concat(Object.keys(PAIS).filter(function (k) { return k !== C.pk; })), bots = H.mezcla(H.rng(H.hash('bot') + (C.semilla || 1)), B ? B.ORDEN.filter(function (x) { return !/^(agua|sal|azucar|tofu|hoja|leche|yogur|mantequilla)$/.test(x); }) : []);
      var ib = 0, im = 0, ibn = 0, k = 0, acc = 0, visto = {};
      res.pages.forEach(function (p, i) {
        if (!p.relleno || p.indice || !/^col_(figura|mandala|numeros|puntos)$/.test(p.tipo)) return;
        acc += cuota; if (acc < 1) return; acc -= 1;
        var t = tipos[k++ % tipos.length], nu;
        if (t === 'botanica') nu = { tipo: 'col_botanica', b: bots[ib++ % bots.length] };
        else if (t === 'mapa') nu = { tipo: 'col_mapa', pk: paises[im++ % paises.length] };
        else nu = { tipo: 'col_bandera', pk: paises[ibn++ % paises.length] };
        nu.relleno = true; nu.num = p.num; nu.cab = CAB[t]; if (!visto[t]) { visto[t] = 1; nu.indice = CAB[t]; }
        res.pages[i] = nu;
      });
    } catch (e) { console.warn('colorear+', e); }
    return res;
  };

  window.EU_COLOREAR_PLUS = { mapaSVG: mapaSVG, banderaSVG: banderaSVG, BAN: BAN };
})();
