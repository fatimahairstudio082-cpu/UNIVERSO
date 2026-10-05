/* b6_modelos.js — biblioteca de modelos vectoriales por materia (window.EU_MODELOS).
   Cada modelo se define una sola vez y se usa de tres formas:
     · lámina del libro (2D plano o 3D con volumen, con título, explicación, preguntas y «por qué»),
     · página para colorear (el mismo dibujo en línea, clasificado por materia y familia),
     · relleno de huecos (apertura, «Cerca de ti») a través de EU_SVG.generar.
   Kit de dibujo K: las mismas primitivas se pintan distinto según el modo:
     'color' = 2D plano · '3d' = degradado de luz, canto y sombra propia · 'linea' = contorno para colorear.
   Registro: EU_MODELOS.agregar(materia, [modelos]). Cada modelo entra en EU_SVG.visual con tope de 1 por libro
   y un registro propio por libro impide que un mismo dibujo salga en dos unidades distintas.
   Exportación: svgArchivo / descargarSVG (vectorial) · descargarPNG (300 ppp) · descargarPDF (carta, papel Bond).
   Cargar después de b6_apertura_dibujo.js y de b6_colorear_plus.js. */
(function () {
  'use strict';
  if (window.EU_MODELOS) return;
  var NS = 'xmlns="http://www.w3.org/2000/svg"', VB = [200, 150];
  var LIB = {}, POR = {}, ORD = {}, FAM = {};
  function r1(n) { return Math.round(n * 10) / 10; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function hex(c) { c = String(c).replace('#', ''); if (c.length === 3) c = c.replace(/./g, '$&$&'); return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]; }
  function mix(c, d, t) { var a = hex(c), b = hex(d); return '#' + a.map(function (v, i) { return ('0' + Math.round(v + (b[i] - v) * t).toString(16)).slice(-2); }).join(''); }
  function claro(c, t) { return mix(c, '#ffffff', t); }
  function oscuro(c, t) { return mix(c, '#000000', t); }

  /* Paleta de materiales compartida por todas las materias. */
  var M = {
    madera: '#C08A55', maderaO: '#8A5A32', metal: '#C3C9CF', acero: '#8E979F', negro: '#3A3634', blanco: '#F7F4EE',
    ceramica: '#EAE3D6', vidrio: '#CFE6EE', plastico: '#4F8FC0', rojo: '#D2553C', verde: '#6E9A4E', amarillo: '#E9B949',
    corteza: '#C67B35', cortezaO: '#8E4F1E', cortezaC: '#E0A45E', miga: '#F3DDB0', masa: '#F1DDB8', harina: '#FBF6EC',
    chocolate: '#5C3A24', crema: '#FFF3D6', fresa: '#D9412E', azucar: '#FFFFFF', semilla: '#6B4E2E', sesamo: '#EAD9A8',
    mimbre: '#B98A52', lino: '#E8E0CC', agua: '#9CCBE6', fuego: '#E9772E', gris: '#9AA0A6', tinta: '#2A2420'
  };

  /* ─────────── kit de dibujo ─────────── */
  function Kit(modo, uid) {
    var defs = {}, n = 0, L = modo === 'linea', D3 = modo === '3d';
    var INK = '#1B1B1B';
    function grad(c) {
      var k = 'g' + c;
      if (!defs[k]) { var id0 = uid + 'g' + (++n); defs[k] = { id: id0, s: '<linearGradient id="' + id0 + '" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="' + claro(c, .42) + '"/><stop offset=".48" stop-color="' + c + '"/><stop offset="1" stop-color="' + oscuro(c, .3) + '"/></linearGradient>' }; }
      return 'url(#' + defs[k].id + ')';
    }
    function gradH(c) {
      var k = 'h' + c;
      if (!defs[k]) { var id0 = uid + 'h' + (++n); defs[k] = { id: id0, s: '<linearGradient id="' + id0 + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="' + oscuro(c, .28) + '"/><stop offset=".32" stop-color="' + claro(c, .38) + '"/><stop offset=".62" stop-color="' + c + '"/><stop offset="1" stop-color="' + oscuro(c, .34) + '"/></linearGradient>' }; }
      return 'url(#' + defs[k].id + ')';
    }
    function f(c, o) { if (!c || c === 'none') return 'none'; if (L) return (o && o.negro) ? INK : '#fff'; return D3 ? ((o && o.cil) ? gradH(c) : grad(c)) : c; }
    function s(c, o) { if (o && o.sin) return 'none'; if (L) return INK; return oscuro(c && c !== 'none' ? c : '#888888', D3 ? .5 : .45); }
    function w(o) { return (o && o.w) || (L ? 1.7 : D3 ? 1.1 : 1.3); }
    function a(c, o) { return ' fill="' + f(c, o) + '" stroke="' + s(c, o) + '" stroke-width="' + w(o) + '" stroke-linejoin="round" stroke-linecap="round"' + (o && o.op && !L ? ' opacity="' + o.op + '"' : '') + '/>'; }
    var K = {
      modo: modo, d3: D3, linea: L, M: M, claro: claro, oscuro: oscuro,
      p: function (d, c, o) { return '<path d="' + d + '"' + a(c, o); },
      e: function (cx, cy, rx, ry, c, o) { return '<ellipse cx="' + r1(cx) + '" cy="' + r1(cy) + '" rx="' + r1(rx) + '" ry="' + r1(ry) + '"' + a(c, o); },
      c: function (cx, cy, rr, c, o) { return '<circle cx="' + r1(cx) + '" cy="' + r1(cy) + '" r="' + r1(rr) + '"' + a(c, o); },
      r: function (x, y, ww, hh, rx, c, o) { return '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(ww) + '" height="' + r1(hh) + '" rx="' + (rx || 0) + '"' + a(c, o); },
      pl: function (pts, c, o) { return '<polygon points="' + pts.map(function (q) { return r1(q[0]) + ',' + r1(q[1]); }).join(' ') + '"' + a(c, o); },
      /* trazo de detalle: greñas, costuras, vetas, textura */
      l: function (d, c, o) { o = o || {}; return '<path d="' + d + '" fill="none" stroke="' + (L ? INK : (c || oscuro('#888888', .3))) + '" stroke-width="' + (o.w || (L ? 1.3 : 1)) + '" stroke-linecap="round" stroke-linejoin="round"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : '') + (o.op && !L ? ' opacity="' + o.op + '"' : '') + '/>'; },
      /* cilindro vertical: tapa elíptica en y, altura h */
      cil: function (cx, y, rx, h, c, o) {
        o = o || {}; var ry = o.ry || rx * .28, out = '';
        out += '<path d="M' + r1(cx - rx) + ' ' + r1(y) + ' L' + r1(cx - rx) + ' ' + r1(y + h) + ' A' + r1(rx) + ' ' + r1(ry) + ' 0 0 0 ' + r1(cx + rx) + ' ' + r1(y + h) + ' L' + r1(cx + rx) + ' ' + r1(y) + ' Z"' + a(c, { cil: 1, w: o.w });
        if (!o.abierto) out += K.e(cx, y, rx, ry, D3 ? claro(c, .18) : c, { w: o.w });
        else out += K.e(cx, y, rx, ry, oscuro(c, .35), { w: o.w });
        return out;
      },
      /* caja: frente x,y,ww,hh y profundidad p (solo se ve en 3D y en línea) */
      caja: function (x, y, ww, hh, p, c, o) {
        var out = '', dx = p * .7, dy = p * .5;
        if (D3 || L) {
          out += K.pl([[x, y], [x + dx, y - dy], [x + ww + dx, y - dy], [x + ww, y]], L ? c : claro(c, .25), o);
          out += K.pl([[x + ww, y], [x + ww + dx, y - dy], [x + ww + dx, y + hh - dy], [x + ww, y + hh]], L ? c : oscuro(c, .22), o);
        }
        return out + K.r(x, y, ww, hh, 0, c, o);
      },
      suelo: function (cx, cy, rx, ry) { return D3 ? '<ellipse cx="' + r1(cx) + '" cy="' + r1(cy) + '" rx="' + r1(rx) + '" ry="' + r1(ry || rx * .09) + '" fill="#000" opacity=".13"/>' : L ? '' : '<path d="M' + r1(cx - rx) + ' ' + r1(cy) + ' H' + r1(cx + rx) + '" stroke="#000" stroke-opacity=".18" stroke-width="1.2" stroke-linecap="round"/>'; },
      brillo: function (cx, cy, rx, ry, rot) { return D3 ? '<ellipse cx="' + r1(cx) + '" cy="' + r1(cy) + '" rx="' + r1(rx) + '" ry="' + r1(ry) + '" fill="#fff" opacity=".38"' + (rot ? ' transform="rotate(' + rot + ' ' + r1(cx) + ' ' + r1(cy) + ')"' : '') + '/>' : ''; },
      /* puntitos: semillas, alveolos, azúcar */
      puntos: function (lista, rr, c, o) { return lista.map(function (q) { return K.e(q[0], q[1], rr, rr * ((o && o.ry) || .6), c, { w: .7 }); }).join(''); },
      t: function (x, y, txt, o) { o = o || {}; return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || 'middle') + '" font-size="' + (o.s || 8) + '" font-family="Archivo, Helvetica, Arial, sans-serif" font-weight="' + (o.b ? 700 : 500) + '" fill="' + (o.c || INK) + '"' + (o.halo ? ' stroke="#fff" stroke-width="2.4" paint-order="stroke"' : '') + '>' + esc(txt) + '</text>'; },
      flecha: function (x1, y1, x2, y2, c, o) { o = o || {}; var an = Math.atan2(y2 - y1, x2 - x1), Lh = o.p || 5, col = L ? INK : (c || '#333'); return '<path d="M' + r1(x1) + ' ' + r1(y1) + (o.curva ? ' Q' + r1(o.curva[0]) + ' ' + r1(o.curva[1]) + ' ' : ' L') + r1(x2) + ' ' + r1(y2) + '" fill="none" stroke="' + col + '" stroke-width="' + (o.w || 1.4) + '" stroke-linecap="round"/><path d="M' + r1(x2) + ' ' + r1(y2) + ' L' + r1(x2 - Lh * Math.cos(an - .5)) + ' ' + r1(y2 - Lh * Math.sin(an - .5)) + ' L' + r1(x2 - Lh * Math.cos(an + .5)) + ' ' + r1(y2 - Lh * Math.sin(an + .5)) + 'Z" fill="' + col + '"/>'; },
      defs: function () { var k = Object.keys(defs); return k.length ? '<defs>' + k.map(function (x) { return defs[x].s; }).join('') + '</defs>' : ''; }
    };
    return K;
  }

  /* ─────────── SVG de un modelo ─────────── */
  var UID = 0;
  function cuerpo(m, modo, rot) {
    var K = Kit(modo, 'm' + (++UID) + '_'), b = '';
    try { b = m.d(K); } catch (e) { console.warn('modelo', m.id, e); b = ''; }
    if (rot && m.rot) b += m.rot.map(function (q, i) {
      var lx = q[3], ly = q[4], izq = lx < q[1];
      return K.l('M' + q[1] + ' ' + q[2] + ' L' + lx + ' ' + ly, '#333', { w: .8 }) + '<circle cx="' + q[1] + '" cy="' + q[2] + '" r="1.6" fill="#1B1B1B"/>' + K.t(lx + (izq ? -2 : 2), ly + 2.6, q[0], { a: izq ? 'end' : 'start', s: 7.4, b: 1, halo: 1 });
    }).join('');
    return K.defs() + b;
  }
  function svg(id, modo, o) {
    o = o || {}; var m = POR[id]; if (!m) return '';
    var vb = m.vb || VB, dim = o.mm ? ' width="' + o.mm + 'mm" height="' + r1(o.mm * vb[1] / vb[0]) + 'mm"' : '';
    return '<svg ' + NS + ' data-plano="1" data-modelo="' + esc(id) + '" viewBox="0 0 ' + vb[0] + ' ' + vb[1] + '"' + dim + ' shape-rendering="geometricPrecision" text-rendering="geometricPrecision"' + (o.mm ? '' : ' style="width:100%;height:auto;display:block;overflow:visible"') + '>' + cuerpo(m, modo || 'color', o.rot) + '</svg>';
  }
  function svgArchivo(id, modo, mm) { return '<?xml version="1.0" encoding="UTF-8"?>\n' + svg(id, modo, { mm: mm || 180, rot: modo !== 'linea' }); }

  /* ─────────── descargas en alta resolución ─────────── */
  function bajar(blob, nombre) { var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nombre; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400); }
  function nombreDe(id, modo, ext) { return id + '_' + ({ color: '2d', '3d': '3d', linea: 'colorear' }[modo] || modo) + '.' + ext; }
  function descargarSVG(id, modo) { bajar(new Blob([svgArchivo(id, modo)], { type: 'image/svg+xml' }), nombreDe(id, modo, 'svg')); }
  /* Rasteriza a ppp dado (300 por defecto) sobre fondo blanco. mm = ancho impreso. */
  function png(id, modo, dpi, mm) {
    dpi = dpi || 300; mm = mm || 180;
    var m = POR[id], vb = m.vb || VB, W = Math.round(mm / 25.4 * dpi), Hh = Math.round(W * vb[1] / vb[0]);
    var s = svg(id, modo, { mm: mm, rot: modo !== 'linea' }).replace(/width="[^"]+mm" height="[^"]+mm"/, 'width="' + W + '" height="' + Hh + '"');
    return new Promise(function (ok, ko) {
      var img = new Image(); img.onload = function () { var cv = document.createElement('canvas'); cv.width = W; cv.height = Hh; var g = cv.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, W, Hh); g.drawImage(img, 0, 0, W, Hh); ok({ canvas: cv, w: W, h: Hh, mm: mm }); };
      img.onerror = ko; img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
    });
  }
  function descargarPNG(id, modo, dpi) { return png(id, modo, dpi).then(function (r) { r.canvas.toBlob(function (b) { bajar(b, nombreDe(id, modo, 'png')); }, 'image/png'); }); }
  /* PDF carta (216 × 279 mm): una hoja por dibujo, título y, en láminas, el «por qué». */
  function descargarPDF(ids, modo, nombre) {
    var J = window.jspdf && window.jspdf.jsPDF; if (!J) { alert('Falta jsPDF para generar el PDF.'); return Promise.resolve(); }
    var doc = new J({ unit: 'mm', format: 'letter' }), i = 0;
    function paso() {
      if (i >= ids.length) { doc.save(nombre || ('dibujos_' + (modo === 'linea' ? 'colorear' : modo) + '.pdf')); return; }
      var id = ids[i], m = POR[id];
      return png(id, modo, 300, 186).then(function (r) {
        if (i) doc.addPage();
        doc.setFont('helvetica', 'bold'); doc.setFontSize(20); doc.text(m.n, 15, 22);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.text((LIB[m.mat] ? LIB[m.mat].nombre : m.mat) + ' · ' + (FAM[m.mat + '|' + m.fam] || m.fam), 15, 29);
        var hmm = 186 * r.h / r.w; doc.addImage(r.canvas.toDataURL('image/png'), 'PNG', 15, 38, 186, hmm, undefined, 'FAST');
        if (modo !== 'linea') { doc.setFontSize(11); doc.text(doc.splitTextToSize(m.intro + ' ' + (m.porque ? 'Por qué: ' + m.porque : ''), 186), 15, 46 + hmm); }
        i++; return paso();
      });
    }
    return Promise.resolve().then(paso);
  }

  /* ─────────── integración con el motor ─────────── */
  /* Registro por libro: un modelo sale una sola vez en todo el libro (láminas, aperturas y rellenos).
     Al redibujar una página ya colocada (rotación de diseños) se permite volver a generarlo. */
  var OPC = null;
  var usoLibro = typeof WeakMap !== 'undefined' ? new WeakMap() : null, REGEN = 0;
  if (window.EU_SVG && window.EU_SVG.regenerar) { var reg0 = window.EU_SVG.regenerar; window.EU_SVG.regenerar = function () { REGEN++; try { return reg0.apply(this, arguments); } finally { REGEN--; } }; }
  function es3d(C) { return C && C.prem ? C.prem.dibujo === '3d' : ((((C && C.cfg && C.cfg.acab) || {}).dibujo) || '3d') === '3d'; }
  function lamina(m, C, modo) {
    var T = (C && C.T) || {}, acc = T.acc || '#555', F = T.cuerpo || 'inherit';
    var fig = '<div style="max-width:150mm;margin:0 auto">' + svg(m.id, modo, { rot: true }) + '</div>';
    if (m.porque) fig += '<div style="max-width:150mm;margin:3mm auto 0;padding:2.5mm 4mm;border-left:1.2mm solid ' + acc + ';font-family:' + F + ';font-size:.95em;line-height:1.35"><b>Por qué funciona.</b> ' + esc(m.porque) + '</div>';
    return fig;
  }
  function itemsDe(m) {
    var ED = window.EU_EDITORIAL, it = ED && ED.H && ED.H.it;
    return (m.q || []).map(function (q) { return it ? it('abierta', q[0], q[1], { lin: 2 }) : { tipo: 'abierta', e: q[0], s: q[1] }; });
  }
  function genDe(m) {
    return function (u, C) {
      if (m.tema && u && !m.tema.test([u.t, (u.k || []).join(' '), u.id].join(' '))) return null;
      if (usoLibro && C && !REGEN) { var reg = usoLibro.get(C); if (!reg) { reg = {}; usoLibro.set(C, reg); } if (reg[m.id]) return null; reg[m.id] = 1; }
      return vDe(m, C);
    };
  }
  function vDe(m, C) { return { t: m.n, intro: m.intro, fig: lamina(m, C, es3d(C) ? '3d' : 'color'), items: itemsDe(m) }; }
  function agregar(mat, lista, info) {
    info = info || {};
    if (!LIB[mat]) { LIB[mat] = { nombre: info.nombre || mat, familias: [] }; ORD[mat] = []; }
    if (info.familias) Object.keys(info.familias).forEach(function (k) { FAM[mat + '|' + k] = info.familias[k]; if (LIB[mat].familias.indexOf(k) < 0) LIB[mat].familias.push(k); });
    var SV = window.EU_SVG, re = info.materias || new RegExp('^' + mat + '$');
    lista.forEach(function (m) {
      if (!m || !m.id || POR[m.id]) return;
      m.mat = mat; POR[m.id] = m; ORD[mat].push(m.id);
      if (LIB[mat].familias.indexOf(m.fam) < 0) LIB[mat].familias.push(m.fam);
      if (SV && SV.visual) SV.visual(m.id, genDe(m), { materias: re, max: 1, libro: 1, unico: 1 });
    });
    if (OPC) try { OPC(); } catch (e) { }
  }
  function lista(mat, fam) { return (ORD[mat] || []).filter(function (id) { return !fam || POR[id].fam === fam; }).map(function (id) { return POR[id]; }); }

  /* ─────────── para colorear ─────────── */
  var ED = window.EU_EDITORIAL, CU = window.EU_CURRICULO;
  if (ED && ED.registrar) {
    ED.registrar({
      paginas: {
        col_modelo: function (pg, C) {
          var H = ED.H, m = POR[pg.mod]; if (!m) return '';
          var w = Math.min(C.papel.w - 44, 160);
          return H.cabecera(C, pg) + H.h1(C, esc('Colorea: ' + m.n.toLowerCase())) + '<p style="font-size:1.08em;margin:0 0 5mm;max-width:160mm">' + esc(m.colorea || 'Mira el modelo pequeño y usa sus colores, o inventa los tuyos.') + '</p>' +
            '<div style="position:relative;width:' + w + 'mm;margin:0 auto">' + svg(m.id, 'linea') + '<div style="position:absolute;right:-10mm;top:-10mm;width:30mm;padding:2mm;border:0.3mm solid ' + C.T.soft + ';border-radius:' + Math.max(4, C.T.r) + 'px;background:' + C.T.bg + '">' + svg(m.id, 'color') + '<div style="font-size:.7em;text-align:center;opacity:.8">modelo</div></div></div>' +
            '<div style="text-align:center;margin-top:6mm;font-family:' + C.T.tit + ';font-size:' + (C.fs * 2.2) + 'px;color:transparent;-webkit-text-stroke:0.35mm #555;letter-spacing:.05em">' + esc(m.n.toUpperCase()) + '</div>' + H.folio(C, pg);
        }
      },
      voz: { col_modelo: function (pg) { var m = POR[pg.mod]; return m ? 'Colorea: ' + m.n + '.' : ''; } }
    });
    /* Opción en el libro para colorear: una entrada por materia con modelos. */
    var opcionesColorear = function () {
      var MI = CU && CU.materia && CU.materia('infantil'); if (!MI) return;
      (MI.opciones || []).forEach(function (o) { if (o.k !== 'dibujos') return; Object.keys(LIB).forEach(function (mat) { var k = 'mod_' + mat; if (!o.ops.some(function (x) { return x[0] === k; })) o.ops.push([k, LIB[mat].nombre]); }); });
    };
    var ens = ED.ensamblar;
    ED.ensamblar = function (cfg) {
      var op = cfg.op || {}, sel = op.dibujos || [], mios = sel.filter(function (x) { return /^mod_/.test(x); }).map(function (x) { return x.slice(4); }), otros = sel.filter(function (x) { return !/^mod_/.test(x); });
      if (cfg.prod === 'colorear' && !mios.length && LIB[cfg.materia]) mios = [cfg.materia];
      var cfg2 = cfg;
      if (cfg.prod === 'colorear' && sel.some(function (x) { return /^mod_/.test(x); })) cfg2 = Object.assign({}, cfg, { op: Object.assign({}, op, { dibujos: otros.length ? otros : ['figura'] }) });
      var res = ens(cfg2);
      try {
        var C = res.C; if (!C || C.prod.id !== 'colorear' || !mios.length) return res;
        if (cfg2 !== cfg) C.cfg = cfg;
        var ids = []; mios.forEach(function (mat) { ids = ids.concat(ORD[mat] || []); });
        ids = ED.H.mezcla(ED.H.rng(ED.H.hash('mod') + (C.semilla || 1)), ids);
        var cuota = otros.length ? mios.length / (mios.length + otros.length) : 1, acc = 0, k = 0, visto = {};
        res.pages.forEach(function (p, i) {
          if (k >= ids.length || !p.relleno || p.indice || !/^col_/.test(p.tipo)) return;
          acc += cuota; if (acc < 1) return; acc -= 1;
          var m = POR[ids[k++]], nu = { tipo: 'col_modelo', mod: m.id, relleno: true, num: p.num, cab: LIB[m.mat].nombre + ' · ' + (FAM[m.mat + '|' + m.fam] || m.fam) };
          if (!visto[m.mat + m.fam]) { visto[m.mat + m.fam] = 1; nu.indice = nu.cab; }
          res.pages[i] = nu;
        });
      } catch (e) { console.warn('modelos colorear', e); }
      return res;
    };
    OPC = opcionesColorear; if (window.addEventListener) window.addEventListener('load', opcionesColorear);
  }

  window.EU_MODELOS = {
    M: M, Kit: Kit, agregar: agregar, lista: lista, modelo: function (id) { return POR[id]; }, materias: function () { return Object.keys(LIB); }, nombre: function (mat) { return (LIB[mat] || {}).nombre || mat; },
    familias: function (mat) { return ((LIB[mat] || {}).familias || []).map(function (k) { return { id: k, n: FAM[mat + '|' + k] || k, total: lista(mat, k).length }; }); },
    nombreFamilia: function (mat, k) { return FAM[mat + '|' + k] || k; },
    /* lámina de un modelo sin pasar por el registro del libro (quien llama comprueba que no esté ya en el libro) */
    vis: function (id, C) { var m = POR[id]; return m ? vDe(m, C) : null; },
    svg: svg, svgArchivo: svgArchivo, png: png, descargarSVG: descargarSVG, descargarPNG: descargarPNG, descargarPDF: descargarPDF, claro: claro, oscuro: oscuro
  };
})();
